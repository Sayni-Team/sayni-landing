"use server";

import { revalidatePath } from "next/cache";
import type { OrderStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/lib/auth";
import { TRANSITIONS } from "@/lib/order-status";

type Item = { productId: string; variant: string | null; quantity: number };

/** Suma (increment) o resta (decrement) stock: de la presentación si la tiene, si no del producto */
async function adjustStock(tx: Prisma.TransactionClient, items: Item[], mode: "increment" | "decrement") {
    for (const item of items) {
        if (item.variant) {
            await tx.productVariant.update({
                where: { productId_key: { productId: item.productId, key: item.variant } },
                data: { stock: { [mode]: item.quantity } },
            });
        } else {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { [mode]: item.quantity } },
            });
        }
    }
}

/** Comprueba que haya stock suficiente para todo el pedido */
async function assertStock(tx: Prisma.TransactionClient, items: Item[]) {
    for (const item of items) {
        const stock = item.variant
            ? (await tx.productVariant.findUnique({
            where: { productId_key: { productId: item.productId, key: item.variant } },
            select: { stock: true },
        }))?.stock ?? 0
            : (await tx.product.findUnique({ where: { id: item.productId }, select: { stock: true } }))?.stock ?? 0;

        if (stock < item.quantity) {
            throw new Error("No hay stock suficiente para confirmar este pedido. Revisa el stock en Productos.");
        }
    }
}

export async function updateOrderStatus(orderId: string, next: OrderStatus) {
    await assertAdmin();

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
    });
    if (!order) throw new Error("Pedido no encontrado");

    const allowed = TRANSITIONS[order.status].some((t) => t.to === next);
    if (!allowed) throw new Error(`No se puede pasar de ${order.status} a ${next}`);

    // Contra entrega confirmado: descuenta el stock
    const consumesStock = order.status === "COD_PENDING" && next === "PAID";
    // Cancelar un pedido que ya descontó stock lo devuelve
    const restoresStock = next === "CANCELLED" && order.status === "PAID";

    await prisma.$transaction(async (tx) => {
        if (consumesStock) await assertStock(tx, order.items);

        // Solo cambia si sigue en el estado que vimos (evita conflictos si dos personas lo editan a la vez)
        const updated = await tx.order.updateMany({
            where: { id: orderId, status: order.status },
            data: { status: next, ...(consumesStock ? { confirmedAt: new Date() } : {}) },
        });
        if (updated.count === 0) throw new Error("El pedido cambió mientras lo editabas. Recarga la página.");

        if (consumesStock) await adjustStock(tx, order.items, "decrement");
        if (restoresStock) await adjustStock(tx, order.items, "increment");
    });

    revalidatePath("/admin");
    revalidatePath(`/admin/pedidos/${orderId}`);
    if (consumesStock || restoresStock) revalidatePath("/", "layout"); // la tienda ve el stock actualizado
}