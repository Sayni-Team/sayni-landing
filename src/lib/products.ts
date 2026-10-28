import "server-only";
import { prisma } from "@/lib/prisma";
import type { PriceTier } from "@/lib/pricing";

export type StoreVariant = { key: string; label: string; stock: number };

// Producto tal como lo recibe la web (sin datos internos de la base de datos)
export type StoreProduct = {
    id: string;
    name: string;
    image: string;
    price: number; // céntimos
    stock: number; // con presentaciones: la suma de todas
    status: "ACTIVE" | "COMING_SOON";
    variants: StoreVariant[];
    tiers: PriceTier[];
};

/** Productos visibles en la tienda (los ocultos no se envían a la web) */
export async function getStoreProducts(): Promise<StoreProduct[]> {
    const products = await prisma.product.findMany({
        where: { status: { not: "HIDDEN" } },
        orderBy: { sortOrder: "asc" },
        include: {
            priceTiers: { orderBy: { quantity: "asc" } },
            variants: { where: { active: true }, orderBy: { sortOrder: "asc" } },
        },
    });

    return products.map((p) => {
        const variants = p.variants.map((v) => ({ key: v.key, label: v.label, stock: v.stock }));
        return {
            id: p.id,
            name: p.name,
            image: p.image,
            price: p.price,
            stock: variants.length > 0 ? variants.reduce((acc, v) => acc + v.stock, 0) : p.stock,
            status: p.status as StoreProduct["status"],
            variants,
            tiers: p.priceTiers.map((t) => ({ quantity: t.quantity, price: t.price })),
        };
    });
}