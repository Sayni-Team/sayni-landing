"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/lib/auth";

export type SaveState = { ok?: boolean; error?: string };

const soles = z.coerce.number().positive("El precio debe ser mayor que 0").max(10000);

const productSchema = z.object({
    id: z.string().min(1),
    stock: z.coerce.number().int("El stock debe ser un número entero").min(0).max(100000),
    status: z.enum(["ACTIVE", "COMING_SOON", "HIDDEN"]),
});

/** Soles del formulario → céntimos en la base de datos */
const toCents = (value: number) => Math.round(value * 100);

export async function updateProduct(_prev: SaveState, formData: FormData): Promise<SaveState> {
    await assertAdmin();

    const parsed = productSchema.safeParse({
        id: formData.get("id"),
        stock: formData.get("stock"),
        status: formData.get("status"),
    });
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    const { id, stock, status } = parsed.data;

    const product = await prisma.product.findUnique({ where: { id }, include: { priceTiers: true } });
    if (!product) return { error: "Producto no encontrado" };

    // Con promoción: se editan los precios por cantidad (el de 1 unidad es el precio base)
    if (product.priceTiers.length > 0) {
        const tiers: { quantity: number; price: number }[] = [];
        for (const tier of product.priceTiers) {
            const value = soles.safeParse(formData.get(`tier_${tier.quantity}`));
            if (!value.success) return { error: `Precio de ${tier.quantity} unidad(es) no válido` };
            tiers.push({ quantity: tier.quantity, price: toCents(value.data) });
        }
        const basePrice = tiers.find((t) => t.quantity === 1)!.price;

        await prisma.$transaction([
            prisma.product.update({ where: { id }, data: { price: basePrice, stock, status } }),
            ...tiers.map((t) =>
                prisma.priceTier.update({
                    where: { productId_quantity: { productId: id, quantity: t.quantity } },
                    data: { price: t.price },
                })
            ),
        ]);
    } else {
        const price = soles.safeParse(formData.get("price"));
        if (!price.success) return { error: price.error.issues[0].message };

        await prisma.product.update({ where: { id }, data: { price: toCents(price.data), stock, status } });
    }

    revalidatePath("/admin/productos");
    revalidatePath("/", "layout"); // la tienda ve los cambios al momento
    return { ok: true };
}