"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/lib/auth";
import { sendComplaintResponseEmail } from "@/lib/email";

export type RespondState = { ok?: boolean; error?: string };

export async function respondComplaint(complaintId: string, _prev: RespondState, formData: FormData): Promise<RespondState> {
    await assertAdmin();

    const parsed = z
        .string()
        .trim()
        .min(10, "Escribe una respuesta más completa")
        .max(5000)
        .safeParse(formData.get("response"));
    if (!parsed.success) return { error: parsed.error.issues[0].message };

    // Solo se responde una vez (si ya está respondido, no cambia)
    const updated = await prisma.complaint.updateMany({
        where: { id: complaintId, status: "PENDING" },
        data: { status: "RESPONDED", response: parsed.data, respondedAt: new Date() },
    });
    if (updated.count === 0) return { error: "Este reclamo ya fue respondido." };

    after(() =>
        sendComplaintResponseEmail(complaintId).catch((error) =>
            console.error("Error enviando respuesta del reclamo", error)
        )
    );

    revalidatePath("/admin/reclamos");
    revalidatePath(`/admin/reclamos/${complaintId}`);
    return { ok: true };
}