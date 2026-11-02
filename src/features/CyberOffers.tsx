import Image from "next/image";

// Ofertas Cyber Wow (2 al 5 de noviembre): bloque visible apenas carga la web,
// para que quien llega desde un anuncio vea de inmediato los precios.
// Los botones llevan a la sección de cafés (#cafes), donde se agrega al carrito.

const BLUE = "#0535FF";
const PINK = "#FE2D73";

type Offer = {
    name: string;
    detail: string;
    image: string;
    before: string;
    now: string;
    badge: string;
};

const OFFERS: readonly Offer[] = [
    {
        name: "Pack Ocasión Especial",
        detail: "2 cafés Clásico + prensa francesa + caja premium",
        image: "/assets/features/products/sayni-package-premium.webp",
        before: "S/ 89.90",
        now: "S/ 79.90",
        badge: "Ideal para regalar",
    },
    {
        name: "Pack Clásico + Prensa",
        detail: "2 cafés Clásico 220 g + prensa francesa 350 ml",
        image: "/assets/features/products/bolsa_prensa.webp",
        before: "S/ 79.90",
        now: "S/ 69.90",
        badge: "Café de todos los días",
    },
    {
        name: "Sayni Geisha 250 g",
        detail: "87 pts SCA · 3 bolsas por S/ 145",
        image: "/assets/features/products/geisha_package_250.webp",
        before: "S/ 55.00",
        now: "S/ 50.00",
        badge: "Especialidad",
    },
];

export default function CyberOffers() {
    return (
        <section
            id="ofertas-cyber"
            aria-label="Ofertas Cyber Wow en Sayni"
            className="relative z-[55] w-full bg-sayni-darkGreen px-4 pb-6 pt-5 sm:px-8 sm:pb-8"
        >
            <div className="mx-auto max-w-6xl">
                <div className="mb-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
                    <span
                        className="rounded-full px-3 py-1 text-xs font-extrabold tracking-[0.12em] text-white"
                        style={{ backgroundColor: PINK }}
                    >
                        CYBER WOW
                    </span>
                    <h2 className="font-urbanist text-lg font-extrabold text-white sm:text-2xl">
                        Precios especiales solo hasta el <span className="text-sayni-lime">jueves 5</span>
                    </h2>
                </div>

                <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0">
                    {OFFERS.map((offer) => (
                        <li
                            key={offer.name}
                            className="flex w-[78%] shrink-0 snap-center flex-col overflow-hidden rounded-2xl bg-white text-sayni-black shadow-lg sm:w-auto"
                        >
                            <div className="relative aspect-[4/3] w-full bg-white sm:aspect-square">
                                <Image
                                    src={offer.image}
                                    alt={offer.name}
                                    fill
                                    sizes="(min-width: 640px) 33vw, 78vw"
                                    className="object-contain p-3"
                                    priority
                                />
                                <span
                                    className="absolute left-2 top-2 rounded-full px-2.5 py-1 text-[11px] font-bold text-white"
                                    style={{ backgroundColor: BLUE }}
                                >
                                    {offer.badge}
                                </span>
                            </div>
                            <div className="flex flex-1 flex-col gap-1 p-4">
                                <h3 className="font-urbanist text-lg font-extrabold leading-tight">{offer.name}</h3>
                                <p className="text-sm text-neutral-600">{offer.detail}</p>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <s className="text-sm text-neutral-500">{offer.before}</s>
                                    <span className="text-2xl font-extrabold" style={{ color: PINK }}>
                                        {offer.now}
                                    </span>
                                </div>
                                <a
                                    href="#cafes"
                                    className="mt-3 block rounded-full bg-sayni-lime py-2.5 text-center font-extrabold text-sayni-black transition hover:brightness-95"
                                >
                                    Comprar
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>

                <p className="mt-4 text-center text-xs text-white/80 sm:text-sm">
                    Pago seguro con Mercado Pago · Delivery en Lima y envíos a todo el Perú
                </p>
            </div>
        </section>
    );
}
