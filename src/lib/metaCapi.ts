import "server-only";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/mercadopago";

// API de Conversiones de Meta: envía la compra desde el servidor cuando Mercado Pago confirma el pago.
// Así la compra se registra aunque el cliente no vuelva a la web (Yape, cierre de pestaña, bloqueador).
// Usa el id del pedido como event_id: Meta lo deduplica con el Purchase del píxel del navegador.

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const TOKEN = process.env.META_CAPI_TOKEN; // Administrador de eventos → Configuración → API de Conversiones → Generar token
const TEST_CODE = process.env.META_CAPI_TEST_CODE; // opcional: código de "Probar eventos" mientras se verifica

const sha256 = (value: string) => crypto.createHash("sha256").update(value).digest("hex");

/** Teléfono peruano a formato E.164 sin "+" (51 + 9 dígitos), como lo pide Meta. */
function normalizePhone(phone: string) {
    const digits = phone.replace(/\D/g, "");
    return digits.length === 9 ? `51${digits}` : digits;
}

export async function sendPurchaseToMeta(orderId: string) {
    if (!PIXEL_ID || !TOKEN) return; // sin token configurado no hace nada

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        select: { id: true, email: true, phone: true, total: true, paidAt: true, city: true, items: { select: { productId: true, quantity: true } } },
    });
    if (!order) return;

    const event = {
        event_name: "Purchase",
        event_time: Math.floor((order.paidAt ?? new Date()).getTime() / 1000),
        event_id: order.id, // mismo eventID que TrackPurchase.tsx → no se cuenta dos veces
        action_source: "website",
        event_source_url: `${SITE_URL}/checkout/resultado`,
        user_data: {
            em: [sha256(order.email.trim().toLowerCase())],
            ph: [sha256(normalizePhone(order.phone))],
            external_id: [sha256(order.id)],
            country: [sha256("pe")],
            ...(order.city ? { ct: [sha256(order.city.trim().toLowerCase().replace(/\s+/g, ""))] } : {}),
        },
        custom_data: {
            currency: "PEN",
            value: order.total / 100,
            content_type: "product",
            content_ids: [...new Set(order.items.map((i: { productId: string }) => i.productId))],
            num_items: order.items.reduce((acc: number, i: { quantity: number }) => acc + i.quantity, 0),
        },
    };

    const res = await fetch(`https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${TOKEN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: [event], ...(TEST_CODE ? { test_event_code: TEST_CODE } : {}) }),
    });
    if (!res.ok) {
        console.error("Meta CAPI Purchase falló", res.status, await res.text());
    }
}
