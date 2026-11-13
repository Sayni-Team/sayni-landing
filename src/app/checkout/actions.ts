"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { Preference } from "mercadopago";
import { prisma } from "@/lib/prisma";
import { priceForQuantity } from "@/lib/pricing";
import { shippingFor } from "@/lib/promo";
import { mp, SITE_URL } from "@/lib/mercadopago";
import { COD_LIMIT, lockedMinutes, registerFailure } from "@/lib/rate-limit";
import { sendCodOrderEmails } from "@/lib/email";
import { checkoutSchema, type CheckoutField, type CheckoutInput } from "@/lib/checkout-schema";

export type CreateOrderResult =
    | { ok: true; checkoutUrl: string }
    | { ok: false; error: string; fieldErrors?: Partial<Record<CheckoutField, string>> };

/** Reparte el total de un producto entre sus líneas (grano / molido) según la cantidad. */
function allocate(total: number, quantities: number[]): number[] {
    const sum = quantities.reduce((a, b) => a + b, 0);
    let assigned = 0;
    return quantities.map((q, i) => {
        if (i === quantities.length - 1) return total - assigned; // el resto, a la última línea
        const part = Math.floor((total * q) / sum);
        assigned += part;
        return part;
    });
}

async function clientIp() {
    const h = await headers();
    return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function createOrder(input: CheckoutInput): Promise<CreateOrderResult> {
    // 1. Validar los datos (nunca confiar en lo que llega del navegador)
    const parsed = checkoutSchema.safeParse(input);
    if (!parsed.success) {
        const flat = parsed.error.flatten().fieldErrors;
        const fieldErrors = Object.fromEntries(
            Object.entries(flat).map(([key, messages]) => [key, messages?.[0]])
        ) as Partial<Record<CheckoutField, string>>;
        return { ok: false, error: "Revisa los datos del formulario.", fieldErrors };
    }
    const data = parsed.data;
    const isCashOnDelivery = data.paymentMethod === "CASH_ON_DELIVERY";

    // Contra entrega: límite de pedidos por conexión (evita pedidos falsos)
    const codKey = `cod:${await clientIp()}`;
    if (isCashOnDelivery && (await lockedMinutes([codKey])) > 0) {
        return {
            ok: false,
            error: "Recibimos varios pedidos desde tu conexión. Escríbenos por WhatsApp y te ayudamos a completar tu compra.",
        };
    }

    // 2. Productos reales de la base de datos (precios, stock, estado, promociones, presentaciones)
    const productIds = [...new Set(data.items.map((i) => i.productId))];
    const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        include: { priceTiers: true, variants: { where: { active: true } } },
    });
    const productsById = new Map(products.map((p) => [p.id, p]));

    for (const item of data.items) {
        const product = productsById.get(item.productId);
        if (!product || product.status !== "ACTIVE") {
            return { ok: false, error: "Uno de los productos ya no está disponible. Revisa tu carrito." };
        }
        const validVariant =
            product.variants.length > 0
                ? product.variants.some((v) => v.key === item.variant)
                : !item.variant;
        if (!validVariant) {
            return { ok: false, error: `Presentación no válida para ${product.name}.` };
        }
    }

    // 3. Stock (por presentación) y precio (por producto: grano + molido se suman para la promoción)
    const linesByProduct = new Map<string, typeof data.items>();
    for (const item of data.items) {
        linesByProduct.set(item.productId, [...(linesByProduct.get(item.productId) ?? []), item]);
    }

    const orderItems: {
        productId: string;
        productName: string;
        variant: string | null;
        quantity: number;
        lineTotal: number;
    }[] = [];

    for (const [productId, lines] of linesByProduct) {
        const product = productsById.get(productId)!;
        const quantity = lines.reduce((acc, l) => acc + l.quantity, 0);

        if (product.variants.length > 0) {
            for (const variant of product.variants) {
                const requested = lines.filter((l) => l.variant === variant.key).reduce((acc, l) => acc + l.quantity, 0);
                if (requested > variant.stock) {
                    return {
                        ok: false,
                        error: `Solo quedan ${variant.stock} unidades de ${product.name} (${variant.label}).`,
                    };
                }
            }
        } else if (quantity > product.stock) {
            return { ok: false, error: `Solo quedan ${product.stock} unidades de ${product.name}.` };
        }

        const productTotal = priceForQuantity(
            quantity,
            product.price,
            product.priceTiers.map((t) => ({ quantity: t.quantity, price: t.price }))
        );
        const lineTotals = allocate(productTotal, lines.map((l) => l.quantity));

        lines.forEach((line, i) => {
            const label = product.variants.find((v) => v.key === line.variant)?.label;
            orderItems.push({
                productId,
                productName: label ? `${product.name} (${label})` : product.name,
                variant: line.variant ?? null,
                quantity: line.quantity,
                lineTotal: lineTotals[i],
            });
        });
    }

    // 4. Envío
    //    Lima: tarifa del distrito desde la base de datos (gratis en Navidad desde el monto mínimo).
    //    Provincia (Shalom): lo dejamos en Shalom Lima sin costo; el flete lo paga el cliente al recoger.
    const isShalom = data.shippingMethod === "SHALOM";
    let zone: { id: string; district: string; price: number } | null = null;
    if (!isShalom) {
        zone = await prisma.shippingZone.findFirst({
            where: { id: data.shippingZoneId, active: true },
            select: { id: true, district: true, price: true },
        });
        if (!zone) {
            return { ok: false, error: "Elige un distrito válido.", fieldErrors: { shippingZoneId: "Elige tu distrito" } };
        }
    }

    const subtotal = orderItems.reduce((acc, i) => acc + i.lineTotal, 0);
    const shipping = zone ? shippingFor(zone.price, subtotal) : 0;
    const total = subtotal + shipping;

    // 5. Guardar el pedido
    const order = await prisma.order.create({
        data: {
            customerName: data.customerName,
            email: data.email.toLowerCase(),
            phone: data.phone,
            reference: data.reference || null,
            shippingMethod: isShalom ? "SHALOM" : "LIMA_DELIVERY",
            ...(isShalom
                ? {
                    address: `Agencia Shalom: ${data.shalomAgency}`,
                    region: data.region,
                    city: data.city,
                    shalomAgency: data.shalomAgency,
                    pickupDni: data.pickupDni,
                }
                : { address: data.address!, shippingZoneId: zone!.id }),
            subtotal,
            shipping,
            total,
            paymentMethod: data.paymentMethod,
            // Contra entrega: queda por confirmar por WhatsApp. Mercado Pago: pendiente de pago.
            status: isCashOnDelivery ? "COD_PENDING" : "PENDING",
            items: { create: orderItems },
        },
        select: { id: true },
    });

    // 6a. Contra entrega: no pasa por Mercado Pago
    if (isCashOnDelivery) {
        await registerFailure(codKey, COD_LIMIT); // cuenta para el límite por hora
        after(() =>
            sendCodOrderEmails(order.id).catch((error) =>
                console.error("Error enviando correos del pedido contra entrega", error)
            )
        );
        return { ok: true, checkoutUrl: `/checkout/resultado?status=cod&external_reference=${order.id}` };
    }

    // 6b. Mercado Pago: crear la preferencia de pago.
    //     Cada línea va como 1 unidad con su total ya calculado (así la promoción cuadra al céntimo).
    try {
        const preference = await new Preference(mp).create({
            body: {
                items: [
                    ...orderItems.map((item, i) => ({
                        id: `${item.productId}-${i}`,
                        title: `${item.quantity}x ${item.productName}`,
                        quantity: 1,
                        unit_price: item.lineTotal / 100,
                        currency_id: "PEN",
                    })),
                    // Envío gratis: Mercado Pago no acepta líneas en 0, así que no se envía
                    ...(shipping > 0
                        ? [
                            {
                                id: "envio",
                                title: `Envío — ${zone?.district ?? "Shalom"}`,
                                quantity: 1,
                                unit_price: shipping / 100,
                                currency_id: "PEN",
                            },
                        ]
                        : []),
                ],
                payer: { name: data.customerName, email: data.email.toLowerCase() },
                external_reference: order.id, // une el pago con el pedido
                statement_descriptor: "SAYNI",
                notification_url: `${SITE_URL}/api/webhooks/mercadopago`,
                back_urls: {
                    success: `${SITE_URL}/checkout/resultado`,
                    pending: `${SITE_URL}/checkout/resultado`,
                    failure: `${SITE_URL}/checkout/resultado`,
                },
                // Mercado Pago solo permite la vuelta automática con URLs https
                ...(SITE_URL.startsWith("https") ? { auto_return: "approved" as const } : {}),
            },
        });

        await prisma.order.update({
            where: { id: order.id },
            data: { mpPreferenceId: preference.id },
        });

        return { ok: true, checkoutUrl: preference.init_point! };
    } catch (error) {
        console.error("Error creando preferencia de Mercado Pago", error);
        return { ok: false, error: "No pudimos iniciar el pago. Inténtalo de nuevo en unos minutos." };
    }
}