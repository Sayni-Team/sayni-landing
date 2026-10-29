"use server";

import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/lib/auth";
import { TRANSITIONS } from "@/lib/order-status";

export async function updateOrderStatus(orderId: string, next: OrderStatus) {
    await assertAdmin();

    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
    });
    if (!order) throw new Error("Pedido no encontrado");

    const allowed = TRANSITIONS[order.status].some((t) => t.to === next);
    if (!allowed) throw new Error(`No se puede pasar de ${order.status} a ${next}`);

    // Cancelar un pedido que ya descontó stock lo devuelve
    const restoresStock = next === "CANCELLED" && order.status === "PAID";

    await prisma.$transaction(async (tx) => {
        // Solo cambia si sigue en el estado que vimos (evita conflictos si dos personas lo editan a la vez)
        const updated = await tx.order.updateMany({
            where: { id: orderId, status: order.status },
            data: { status: next },
        });
        if (updated.count === 0) throw new Error("El pedido cambió mientras lo editabas. Recarga la página.");

        if (restoresStock) {
            for (const item of order.items) {
                if (item.variant) {
                    await tx.productVariant.update({
                        where: { productId_key: { productId: item.productId, key: item.variant } },
                        data: { stock: { increment: item.quantity } },
                    });
                } else {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { increment: item.quantity } },
                    });
                }
            }
        }
    });

    revalidatePath("/admin");
    revalidatePath(`/admin/pedidos/${orderId}`);
    if (restoresStock) revalidatePath("/", "layout"); // la tienda ve el stock devuelto
}