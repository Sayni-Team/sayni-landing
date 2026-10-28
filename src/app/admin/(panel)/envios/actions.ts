"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/lib/auth";

export type SaveState = { ok?: boolean; error?: string };

const price = z.coerce.number().min(0, "La tarifa no puede ser negativa").max(1000);

function refresh() {
    revalidatePath("/admin/envios");
    revalidatePath("/checkout"); // el selector de distritos del checkout
}

export async function updateZone(_prev: SaveState, formData: FormData): Promise<SaveState> {
    await assertAdmin();

    const parsed = z
        .object({ id: z.string().min(1), price, active: z.boolean() })
        .safeParse({
            id: formData.get("id"),
            price: formData.get("price"),
            active: formData.get("active") === "on",
        });
    if (!parsed.success) return { error: parsed.error.issues[0].message };

    await prisma.shippingZone.update({
        where: { id: parsed.data.id },
        data: { price: Math.round(parsed.data.price * 100), active: parsed.data.active },
    });

    refresh();
    return { ok: true };
}

export async function createZone(_prev: SaveState, formData: FormData): Promise<SaveState> {
    await assertAdmin();

    const parsed = z
        .object({ district: z.string().trim().min(2, "Escribe el nombre del distrito").max(80), price })
        .safeParse({ district: formData.get("district"), price: formData.get("price") });
    if (!parsed.success) return { error: parsed.error.issues[0].message };

    const exists = await prisma.shippingZone.findUnique({ where: { district: parsed.data.district } });
    if (exists) return { error: "Ese distrito ya existe" };

    await prisma.shippingZone.create({
        data: { district: parsed.data.district, price: Math.round(parsed.data.price * 100) },
    });

    // Reordenar alfabéticamente para el selector del checkout
    const zones = await prisma.shippingZone.findMany({ select: { id: true, district: true } });
    zones.sort((a, b) => a.district.localeCompare(b.district, "es"));
    await prisma.$transaction(
        zones.map((z, i) => prisma.shippingZone.update({ where: { id: z.id }, data: { sortOrder: i } }))
    );

    refresh();
    return { ok: true };
}