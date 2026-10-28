import crypto from "node:crypto";
import { NextResponse, after } from "next/server";
import { Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";
import { mp } from "@/lib/mercadopago";
import { sendOrderPaidEmails } from "@/lib/email";

/** Verifica que el aviso viene de Mercado Pago (cabecera x-signature). */
function isValidSignature(req: Request, dataId: string): boolean {
    const secret = process.env.MP_WEBHOOK_SECRET;
    const signature = req.headers.get("x-signature");
    const requestId = req.headers.get("x-request-id");
    if (!secret || !signature || !requestId) return false;

    // Formato: "ts=1704908010,v1=618c85345248dd820d5fd456117c2ab2ef8eda45a0282ff693eac24131a5e839"
    const parts = Object.fromEntries(signature.split(",").map((p) => p.trim().split("=") as [string, string]));
    if (!parts.ts || !parts.v1) return false;

    const manifest = `id:${dataId};request-id:${requestId};ts:${parts.ts};`;
    const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

    return (
        expected.length === parts.v1.length &&
        crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1))
    );
}

export async function POST(req: Request) {
    const url = new URL(req.url);
    const body = await req.json().catch(() => ({}));

    const type = body.type ?? url.searchParams.get("type");
    const dataId = String(body.data?.id ?? url.searchParams.get("data.id") ?? "");

    // Solo nos interesan los avisos de pagos
    if (type !== "payment" || !dataId) {
        return NextResponse.json({ received: true });
    }

    if (!isValidSignature(req, dataId.toLowerCase())) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    try {
        // Consultar el pago a Mercado Pago: no confiar solo en el aviso
        const payment = await new Payment(mp).get({ id: dataId });
        const orderId = payment.external_reference;

        if (payment.status === "approved" && orderId) {
            const paidNow = await prisma.$transaction(async (tx) => {
                // Idempotente: solo pasa a PAID si seguía PENDING (Mercado Pago puede avisar varias veces)
                const updated = await tx.order.updateMany({
                    where: { id: orderId, status: "PENDING" },
                    data: { status: "PAID", mpPaymentId: String(payment.id), paidAt: new Date() },
                });
                if (updated.count === 0) return false;

                // Descontar stock del pedido
                const items = await tx.orderItem.findMany({ where: { orderId } });
                // Descontar stock: de la presentación si la tiene, si no del producto
                for (const item of items) {
                    if (item.variant) {
                        await tx.productVariant.update({
                            where: { productId_key: { productId: item.productId, key: item.variant } },
                            data: { stock: { decrement: item.quantity } },
                        });
                    } else {
                        await tx.product.update({
                            where: { id: item.productId },
                            data: { stock: { decrement: item.quantity } },
                        });
                    }
                }
                return true;
            });

            // Correos solo la primera vez que el pedido pasa a pagado.
            // after(): se envían después de responder a Mercado Pago, sin hacerle esperar.
            if (paidNow) {
                after(() =>
                    sendOrderPaidEmails(orderId).catch((error) =>
                        console.error("Error enviando correos del pedido", error)
                    )
                );
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("Error procesando webhook de Mercado Pago", error);
        // 500: Mercado Pago reintentará el aviso más tarde
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}