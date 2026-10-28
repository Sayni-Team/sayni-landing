"use server";

import { after } from "next/server";
import { prisma } from "@/lib/prisma";
import { addBusinessDays } from "@/lib/business-days";
import { COMPLAINT_RESPONSE_DAYS } from "@/lib/business";
import { complaintSchema, type ComplaintField, type ComplaintInput } from "@/lib/complaint-schema";
import { sendComplaintEmails } from "@/lib/email";

export type CreateComplaintResult =
    | { ok: true; number: number; createdAt: string }
    | { ok: false; error: string; fieldErrors?: Partial<Record<ComplaintField, string>> };

export async function createComplaint(input: ComplaintInput): Promise<CreateComplaintResult> {
    const parsed = complaintSchema.safeParse(input);
    if (!parsed.success) {
        const fieldErrors: Partial<Record<ComplaintField, string>> = {};
        for (const issue of parsed.error.issues) {
            const key = issue.path[0] as ComplaintField;
            fieldErrors[key] ??= issue.message;
        }
        return { ok: false, error: "Revisa los campos marcados.", fieldErrors };
    }
    const d = parsed.data;

    // Honeypot relleno: es un bot. Se finge éxito sin guardar nada.
    if (d.website) {
        return { ok: true, number: 0, createdAt: new Date().toISOString() };
    }

    const now = new Date();
    const complaint = await prisma.complaint.create({
        data: {
            dueAt: addBusinessDays(now, COMPLAINT_RESPONSE_DAYS),
            consumerName: d.consumerName,
            docType: d.docType,
            docNumber: d.docNumber.toUpperCase(),
            address: d.address,
            phone: d.phone,
            email: d.email.toLowerCase(),
            isMinor: d.isMinor,
            guardianName: d.isMinor ? d.guardianName : null,
            goodType: d.goodType,
            goodDescription: d.goodDescription,
            amount: d.amount !== undefined ? Math.round(d.amount * 100) : null,
            orderNumber: d.orderNumber ?? null,
            kind: d.kind,
            detail: d.detail,
            request: d.request,
        },
        select: { id: true, number: true, createdAt: true },
    });

    // Constancia al consumidor y aviso al negocio, sin hacer esperar al usuario
    after(() =>
        sendComplaintEmails(complaint.id).catch((error) =>
            console.error("Error enviando correos del reclamo", error)
        )
    );

    return { ok: true, number: complaint.number, createdAt: complaint.createdAt.toISOString() };
}