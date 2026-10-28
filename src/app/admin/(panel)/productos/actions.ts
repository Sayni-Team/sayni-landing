"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/lib/auth";

export type SaveState = { ok?: boolean; error?: string };

const soles = z.coerce.number().positive("El precio debe ser mayor que 0").max(10000);
const stockValue = z.coerce.number().int("El stock debe ser un número entero").min(0, "El stock no puede ser negativo").max(100000);

const productSchema = z.object({
    id: z.string().min(1),
    status: z.enum(["ACTIVE", "COMING_SOON", "HIDDEN"]),
});

/** Soles del formulario → céntimos en la base de datos */
const toCents = (value: number) => Math.round(value * 100);

export async function updateProduct(_prev: SaveState, formData: FormData): Promise<SaveState> {
    await assertAdmin();

    const parsed = productSchema.safeParse({ id: formData.get("id"), status: formData.get("status") });
    if (!parsed.success) return { error: parsed.error.issues[0].message };
    const { id, status } = parsed.data;

    const product = await prisma.product.findUnique({
        where: { id },
        include: { priceTiers: true, variants: true },
    });
    if (!product) return { error: "Producto no encontrado" };

    // ── Precio: por cantidad si tiene promoción, si no uno solo ──
    let basePrice: number;
    const tiers: { quantity: number; price: number }[] = [];

    if (product.priceTiers.length > 0) {
        for (const tier of product.priceTiers) {
            const value = soles.safeParse(formData.get(`tier_${tier.quantity}`));
            if (!value.success) return { error: `Precio de ${tier.quantity} unidad(es) no válido` };
            tiers.push({ quantity: tier.quantity, price: toCents(value.data) });
        }
        basePrice = tiers.find((t) => t.quantity === 1)!.price;
    } else {
        const price = soles.safeParse(formData.get("price"));
        if (!price.success) return { error: price.error.issues[0].message };
        basePrice = toCents(price.data);
    }

    // ── Stock: por presentación si las tiene, si no del producto ──
    const variantStocks: { id: string; stock: number }[] = [];
    let productStock = product.stock;

    if (product.variants.length > 0) {
        for (const v of product.variants) {
            const value = stockValue.safeParse(formData.get(`stock_${v.key}`));
            if (!value.success) return { error: `Stock de ${v.label}: ${value.error.issues[0].message}` };
            variantStocks.push({ id: v.id, stock: value.data });
        }
    } else {
        const value = stockValue.safeParse(formData.get("stock"));
        if (!value.success) return { error: value.error.issues[0].message };
        productStock = value.data;
    }

    await prisma.$transaction([
        prisma.product.update({ where: { id }, data: { price: basePrice, stock: productStock, status } }),
        ...tiers.map((t) =>
            prisma.priceTier.update({
                where: { productId_quantity: { productId: id, quantity: t.quantity } },
                data: { price: t.price },
            })
        ),
        ...variantStocks.map((v) =>
            prisma.productVariant.update({ where: { id: v.id }, data: { stock: v.stock } })
        ),
    ]);

    revalidatePath("/admin/productos");
    revalidatePath("/", "layout"); // la tienda ve los cambios al momento
    return { ok: true };
}