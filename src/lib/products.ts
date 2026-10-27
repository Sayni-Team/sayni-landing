import "server-only";
import { prisma} from "@/lib/prisma";
import type { PriceTier } from "@/lib/pricing";

// Producto tal como lo recibe la web (sin datos internos de la base de datos)
export type StoreProduct = {
    id: string;
    name: string;
    image: string;
    price: number; // céntimos
    stock: number;
    status: "ACTIVE" | "COMING_SOON";
    variants: string[];
    tiers: PriceTier[];
};

/** Productos visibles en la tienda (los ocultos no se envían a la web) */
export async function getStoreProducts(): Promise<StoreProduct[]> {
    const products = await prisma.product.findMany({
        where: { status: { not: "HIDDEN" } },
        orderBy: { sortOrder: "asc" },
        include: { priceTiers: { orderBy: { quantity: "asc" } } },
    });

    return products.map((p) => ({
        id: p.id,
        name: p.name,
        image: p.image,
        price: p.price,
        stock: p.stock,
        status: p.status as StoreProduct["status"],
        variants: p.variants,
        tiers: p.priceTiers.map((t) => ({ quantity: t.quantity, price: t.price })),
    }));
}