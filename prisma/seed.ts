// Datos iniciales de la tienda. Ejecutar con: npx prisma db seed
// Se puede ejecutar varias veces: actualiza lo que ya existe, sin duplicar.
import { PrismaClient, ProductStatus } from "@prisma/client";

const prisma = new PrismaClient();

/* ── Productos ─────────────────────────────── */

type SeedVariant = { key: string; label: string; stock: number };

type SeedProduct = {
    id: string;
    name: string;
    image: string;
    price: number; // céntimos
    stock: number; // solo productos sin presentaciones
    status: ProductStatus;
    variants: SeedVariant[];
    sortOrder: number;
    tiers: { quantity: number; price: number }[];
};

const INITIAL_STOCK = 100;
const INITIAL_VARIANT_STOCK = 50;

// Grano y molido, cada uno con su stock
const GRIND_VARIANTS: SeedVariant[] = [
    { key: "grano", label: "Grano", stock: INITIAL_VARIANT_STOCK },
    { key: "molido", label: "Molido", stock: INITIAL_VARIANT_STOCK },
];

const PRODUCTS: SeedProduct[] = [
    {
        id: "geisha-250",
        name: "Sayni Geisha 250g",
        image: "/assets/features/products/geisha_package_250.webp",
        price: 5000,
        stock: 0, // con presentaciones: el stock va en cada una
        status: ProductStatus.ACTIVE,
        variants: GRIND_VARIANTS,
        sortOrder: 1,
        // Promoción en ciclos de 3 (grano y molido se suman)
        tiers: [
            { quantity: 1, price: 5000 },
            { quantity: 2, price: 9500 },
            { quantity: 3, price: 14500 },
        ],
    },
    {
        id: "blend-250",
        name: "Sayni Blend 250g",
        image: "/assets/features/products/blend_package_250.webp",
        price: 3000,
        stock: 0,
        status: ProductStatus.COMING_SOON,
        variants: GRIND_VARIANTS,
        sortOrder: 2,
        tiers: [], // PENDIENTE: tramos de su promoción, cuando se definan
    },
    {
        id: "geisha-500",
        name: "Sayni Geisha 500g",
        image: "/assets/features/products/geisha_package_500_.webp",
        price: 9500,
        stock: INITIAL_STOCK,
        status: ProductStatus.HIDDEN,
        variants: [],
        sortOrder: 3,
        tiers: [],
    },
    {
        id: "pack-regalo-clasico",
        name: "Pack Ocasión Especial",
        image: "/assets/features/products/sayni-package-premium.webp",
        price: 7990,
        stock: INITIAL_STOCK,
        status: ProductStatus.ACTIVE,
        variants: [],
        sortOrder: 4,
        tiers: [],
    },
    {
        id: "pack-clasico-prensa",
        name: "Pack Sayni Clásico + Prensa",
        image: "/assets/features/products/classic_package_220.webp",
        price: 6990,
        stock: INITIAL_STOCK,
        status: ProductStatus.ACTIVE,
        variants: [],
        sortOrder: 5,
        tiers: [],
    },
];

/* ── Zonas de envío — Lima (IGV incluido) ──────
   Agrupadas por tarifa, tal como las envió el cliente. Precios en céntimos.
   Provincia NO va aquí: se cotiza por WhatsApp desde el checkout. */

const ZONES_BY_PRICE: Record<number, string[]> = {
    1000: [
        "Barranco", "Breña", "Cercado de Lima", "El Agustino", "Jesús María", "La Molina",
        "La Victoria", "Lince", "Magdalena del Mar", "Miraflores", "Pueblo Libre", "Rímac",
        "Salamanca (Ate)", "San Borja", "San Isidro", "San Juan de Lurigancho", "San Luis",
        "San Miguel", "Santa Anita", "Santiago de Surco", "Surquillo",
    ],
    1200: [
        "Ate", "Bellavista", "Callao", "Carabayllo", "Carmen de la Legua", "Chorrillos", "Comas",
        "El Márquez (Callao)", "Huaycán (Ate)", "Independencia", "La Perla", "La Punta",
        "Los Olivos", "Mi Perú", "Puente Piedra", "San Juan de Miraflores", "San Martín de Porres",
        "Santa Clara (Ate)", "Ventanilla", "Villa El Salvador", "Villa María del Triunfo",
    ],
    1400: ["Huachipa", "Jicamarca Anexo 22", "Lurigancho (Chosica)", "Lurín"],
    1700: ["Ancón", "Chaclacayo", "Cieneguilla", "Manchay", "Punta Hermosa", "Santa Rosa"],
    1900: ["Pachacámac"],
    2100: ["Cajamarquilla", "Jicamarca Anexo 8", "Punta Negra"],
    2200: ["Chosica", "San Bartolo"],
    2500: ["Ricardo Palma", "Santa Eulalia", "Santa María del Mar"],
    2800: ["Pucusana"],
};

/* ── Ejecución ─────────────────────────────── */

async function seedProducts() {
    for (const { tiers, variants, ...product } of PRODUCTS) {
        // El stock no se pisa en actualizaciones: así el seed no borra ventas reales
        const { stock, ...withoutStock } = product;

        await prisma.product.upsert({
            where: { id: product.id },
            update: withoutStock,
            create: { ...withoutStock, stock },
        });

        // Presentaciones: el stock solo se pone al crearlas
        for (const [i, v] of variants.entries()) {
            await prisma.productVariant.upsert({
                where: { productId_key: { productId: product.id, key: v.key } },
                update: { label: v.label, sortOrder: i },
                create: { productId: product.id, key: v.key, label: v.label, stock: v.stock, sortOrder: i },
            });
        }

        // Tramos de precio: se reemplazan enteros
        await prisma.priceTier.deleteMany({ where: { productId: product.id } });
        if (tiers.length > 0) {
            await prisma.priceTier.createMany({
                data: tiers.map((t) => ({ ...t, productId: product.id })),
            });
        }
    }

    console.log(`✔ ${PRODUCTS.length} productos`);
}

async function seedShippingZones() {
    // Orden alfabético: en el selector se busca el distrito por nombre
    const zones = Object.entries(ZONES_BY_PRICE)
        .flatMap(([price, districts]) => districts.map((district) => ({ district, price: Number(price) })))
        .sort((a, b) => a.district.localeCompare(b.district, "es"));

    for (const [i, zone] of zones.entries()) {
        await prisma.shippingZone.upsert({
            where: { district: zone.district },
            update: { price: zone.price, sortOrder: i, active: true },
            create: { ...zone, sortOrder: i },
        });
    }

    console.log(`✔ ${zones.length} zonas de envío`);
}

async function main() {
    await seedProducts();
    await seedShippingZones();
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });