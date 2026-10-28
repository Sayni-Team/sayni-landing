import { prisma } from "@/lib/prisma";
import ProductRow from "./ProductRow";

export default async function ProductsPage() {
    const products = await prisma.product.findMany({
        orderBy: { sortOrder: "asc" },
        include: { priceTiers: { orderBy: { quantity: "asc" } } },
    });

    return (
        <div className="max-w-4xl">
            <h1 className="font-heading text-2xl font-bold">Productos</h1>
            <p className="mt-2 text-sm text-white/60">
                Los cambios se ven en la tienda al guardar. El stock baja solo con cada pago aprobado.
            </p>

            <div className="mt-8 space-y-4">
                {products.map((p) => (
                    <ProductRow
                        key={p.id}
                        product={{
                            id: p.id,
                            name: p.name,
                            image: p.image,
                            price: p.price,
                            stock: p.stock,
                            status: p.status,
                            tiers: p.priceTiers.map((t) => ({ quantity: t.quantity, price: t.price })),
                        }}
                    />
                ))}
            </div>
        </div>
    );
}