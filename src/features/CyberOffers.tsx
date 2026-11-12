"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { metaEvent } from "@/lib/metaPixel";
import { FREE_SHIPPING_MIN, isCyberActive } from "@/lib/promo";

// Ofertas de temporada: Cyber Wow (2 al 5 de noviembre) y luego Navidad (delivery gratis).
// Bloque visible apenas carga la web, para que quien llega desde un anuncio vea de inmediato los precios.
// "Comprar" agrega el producto al carrito y lo abre (desde ahí se va a /checkout → Mercado Pago).
// El precio mostrado sale del catálogo, igual que en el carrito y el checkout.

const PINK = "#FE2D73"; // solo para la marca Cyber Wow, durante la campaña

// Patrón de fondo: granos de café en lima, con tamaños y giros variados (SVG en línea).
// El grano se dibuja una vez (#b) y se reutiliza en distintas posiciones.
const BEAN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="360" height="360" viewBox="0 0 360 360"><defs><g id="b"><path d="M2-28C16-27 23-13 22 2S13 28-1 28C-15 27-23 14-22-1S-12-29 2-28Z" fill="#BCC90F" fill-opacity="0.18" stroke="#BCC90F" stroke-width="2"/><path d="M3-24C-6-14 8-6 0 2S-8 16 1 24" fill="none" stroke="#BCC90F" stroke-width="2.2" stroke-linecap="round"/><path d="M7-21C0-12 12-5 4 3S-3 15 5 21" fill="none" stroke="#BCC90F" stroke-width="1" stroke-linecap="round" opacity="0.6"/></g></defs><use xlink:href="#b" href="#b" transform="translate(62 72) rotate(-25) scale(1.1)"/><use xlink:href="#b" href="#b" transform="translate(252 46) rotate(40) scale(0.8)"/><use xlink:href="#b" href="#b" transform="translate(172 192) rotate(-70) scale(1.35)"/><use xlink:href="#b" href="#b" transform="translate(306 262) rotate(15) scale(0.95)"/><use xlink:href="#b" href="#b" transform="translate(70 292) rotate(65) scale(0.85)"/></svg>`;
const BEAN_PATTERN = `url("data:image/svg+xml,${encodeURIComponent(BEAN_SVG)}")`;

type Offer = {
    productId: string; // id del producto en la base de datos
    name: string;
    detail: string;
    image: string;
    before: number; // precio anterior, en céntimos (solo referencia visual)
    badge: string;
    variants?: { key: string; label: string }[]; // presentaciones (grano / molido)
};

const OFFERS: readonly Offer[] = [
    {
        productId: "pack-regalo-clasico",
        name: "Pack Ocasión Especial",
        detail: "2 cafés Clásico + prensa francesa + caja premium",
        image: "/assets/features/products/pack-ocasion-cuadrado_.webp",
        before: 8990,
        badge: "Ideal para regalar",
    },
    {
        productId: "pack-clasico-prensa",
        name: "Pack Clásico + Prensa",
        detail: "2 cafés Clásico 220 g + prensa francesa 350 ml",
        image: "/assets/features/products/bolsa_prensa.webp",
        before: 7990,
        badge: "Café de todos los días",
    },
    {
        productId: "geisha-250",
        name: "Sayni Geisha 250 g",
        detail: "87 pts SCA · 3 bolsas por S/ 145",
        image: "/assets/features/products/geisha_package_250.webp",
        before: 5500,
        badge: "Especialidad",
        variants: [
            { key: "grano", label: "Grano" },
            { key: "molido", label: "Molido" },
        ],
    },
];

const formatPEN = (cents: number) => `S/ ${(cents / 100).toFixed(2)}`;

const BUTTON =
    "block w-full cursor-pointer rounded-full bg-sayni-lime py-2 text-center text-sm font-extrabold text-sayni-black transition-colors duration-200 hover:bg-sayni-olive disabled:cursor-not-allowed disabled:opacity-40 sm:py-2.5 sm:text-base";

export default function CyberOffers() {
    const { addToCart, getProduct, remainingStock } = useCart();
    const cyber = isCyberActive();

    // ViewContent: el visitante vio las ofertas (una vez por carga de página)
    useEffect(() => {
        metaEvent("ViewContent", {
            content_ids: OFFERS.map((o) => o.productId),
            content_type: "product",
            content_name: isCyberActive() ? "Ofertas Cyber Wow" : "Regalos de Navidad",
        });
    }, []);

    // Solo se muestran las ofertas cuyo producto está activo en la tienda
    const offers = OFFERS.filter((o) => getProduct(o.productId)?.status === "ACTIVE");
    if (offers.length === 0) return null;

    return (
        <section
            id="ofertas-cyber"
            aria-label={cyber ? "Ofertas Cyber Wow en Sayni" : "Regalos de Navidad en Sayni"}
            className="relative isolate w-full overflow-hidden border-b border-white/5 bg-sayni-black px-4 pb-8 pt-28  sm:px-8 sm:pb-10 sm:pt-32"
        >
            {/* ── Fondo decorativo: dos capas del mismo patrón a distinto tamaño y desenfoque, para dar profundidad ── */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06] blur-[4px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_90%)]"
                style={{ backgroundImage: BEAN_PATTERN, backgroundSize: "360px 360px" }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 rotate-180 opacity-[0.05] blur-[1px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]"
                style={{ backgroundImage: BEAN_PATTERN, backgroundSize: "520px 520px", backgroundPosition: "180px 120px" }}
            />

            <div className="mx-auto max-w-6xl">
                {/* Título */}
                <div className="mb-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center sm:mb-7">
                    {cyber ? (
                        <>
                            <span
                                className="rounded-full px-3 py-1 text-xs font-extrabold tracking-[0.12em] text-white"
                                style={{ backgroundColor: PINK }}
                            >
                                CYBER WOW
                            </span>
                            <h2 className="font-heading text-xl font-bold text-sayni-light sm:text-3xl">
                                Precios especiales solo hasta el <span className="text-sayni-lime">jueves 5</span>
                            </h2>
                        </>
                    ) : (
                        <>
                            <h2 className="font-heading text-xl font-bold text-sayni-light sm:text-3xl">
                                Regalos de café con <span className="text-sayni-lime">delivery gratis</span> en Lima
                            </h2>
                        </>
                    )}
                </div>

                {/* Celular: filas compactas (las 3 ofertas a la vista). Desde sm: tarjetas en 3 columnas */}
                <ul className="flex flex-col gap-3 sm:grid sm:grid-cols-3 sm:gap-5">
                    {offers.map((offer) => {
                        const product = getProduct(offer.productId);
                        const price = product?.price ?? 0;
                        const showBefore = cyber && offer.before > price; // precio anterior solo durante el Cyber

                        return (
                            <li
                                key={offer.productId}
                                className="group flex flex-row overflow-hidden rounded-3xl border border-sayni-lime/15 bg-sayni-darkGreen text-sayni-light transition-[translate,border-color] duration-300 hover:-translate-y-1 hover:border-sayni-lime/40 sm:flex-col"
                            >
                                {/* Imagen con halo lima detrás del producto */}
                                <div className="relative w-28 shrink-0 bg-gradient-to-b from-sayni-black/40 to-transparent sm:aspect-square sm:w-full">
                                    <span
                                        aria-hidden
                                        className="pointer-events-none absolute left-1/2 top-1/2 size-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sayni-lime/8 blur-2xl"
                                    />
                                    <Image
                                        src={offer.image}
                                        alt={offer.name}
                                        fill
                                        sizes="(min-width: 640px) 33vw, 112px"
                                        className="object-contain p-2 transition-[scale] duration-500 group-hover:scale-105 sm:p-5 mt-8"
                                        priority
                                    />
                                    <span className="absolute left-3 top-3 hidden rounded-full bg-sayni-lime px-2.5 py-1 text-[11px] font-bold text-sayni-black sm:block">
                                        {offer.badge}
                                    </span>
                                </div>

                                {/* Información */}
                                <div className="flex min-w-0 flex-1 flex-col gap-0.5 p-3 sm:gap-1 sm:p-5">
                                    <h3 className="font-urbanist text-base font-extrabold leading-tight text-sayni-light sm:text-lg">
                                        {offer.name}
                                    </h3>
                                    <p className="text-xs text-sayni-light/60 sm:text-sm">{offer.detail}</p>
                                    <div className="mt-1 flex items-baseline gap-2 sm:mt-2">
                                        {showBefore && (
                                            <s className="text-sm text-sayni-light/40">{formatPEN(offer.before)}</s>
                                        )}
                                        <span
                                            className="text-xl font-extrabold sm:text-2xl"
                                            style={cyber ? { color: PINK } : undefined}
                                        >
                                            <span className={cyber ? "" : "text-sayni-lime"}>{formatPEN(price)}</span>
                                        </span>
                                    </div>

                                    {/* Botones */}
                                    <div className="mt-auto pt-2 sm:pt-4">
                                        {offer.variants ? (
                                            <div className="grid grid-cols-2 gap-2">
                                                {offer.variants.map((v) => {
                                                    const soldOut = remainingStock(offer.productId, v.key) <= 0;
                                                    return (
                                                        <button
                                                            key={v.key}
                                                            type="button"
                                                            disabled={soldOut}
                                                            onClick={() => addToCart({ productId: offer.productId, variant: v.key })}
                                                            className={BUTTON}
                                                        >
                                                            {soldOut ? (
                                                                "Agotado"
                                                            ) : (
                                                                <>
                                                                    <span className="sm:hidden">{v.label}</span>
                                                                    <span className="hidden sm:inline">Comprar {v.label.toLowerCase()}</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                disabled={remainingStock(offer.productId) <= 0}
                                                onClick={() => addToCart({ productId: offer.productId })}
                                                className={BUTTON}
                                            >
                                                {remainingStock(offer.productId) <= 0 ? "Agotado" : "Comprar"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                <p className="mt-5 text-center text-xs text-sayni-light/60 sm:text-sm">
                    {cyber
                        ? "Pago seguro con Mercado Pago · Delivery en Lima y envíos a todo el Perú"
                        : `Delivery gratis en Lima en compras desde ${formatPEN(FREE_SHIPPING_MIN)}, hasta el 24 de diciembre · Pago seguro con Mercado Pago`}
                </p>
            </div>
        </section>
    );
}