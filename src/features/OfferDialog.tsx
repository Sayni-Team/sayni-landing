"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPEN, priceForQuantity } from "@/lib/pricing";
import { FREE_SHIPPING_MIN, isXmasActive } from "@/lib/promo";

/* ── Tipos compartidos con CyberOffers ── */

export type IconName = "flower" | "drop" | "sun" | "mountain" | "gift" | "press" | "bag" | "flame";

export type Offer = {
    productId: string; // id del producto en la base de datos
    name: string;
    detail: string;
    image: string;
    before: number; // precio anterior, en céntimos (solo referencia visual)
    badge: string;
    variants?: { key: string; label: string }[]; // presentaciones (grano / molido)
    // Información complementaria del diálogo
    tagline: string;
    highlights: { icon: IconName; text: string }[];
};

type Props = { offer: Offer | null; onClose: () => void };

// Diálogo de producto: información complementaria + compra rápida.
// En celular sube desde abajo (hoja); desde sm, centrado.
export default function OfferDialog({ offer, onClose }: Props) {
    const { addToCart, getProduct, remainingStock } = useCart();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    const [variant, setVariant] = useState<string | undefined>(undefined);
    const [quantity, setQuantity] = useState(1);

    // Abrir / cerrar el <dialog> nativo y bloquear el scroll de la página
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (offer) {
            setVariant(offer.variants?.[0]?.key);
            setQuantity(1);
            if (!dialog.open) dialog.showModal();
            document.body.style.overflow = "hidden";
        } else if (dialog.open) {
            dialog.close();
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [offer]);

    const product = offer ? getProduct(offer.productId) : undefined;
    const unitPrice = product?.price ?? 0;
    const tiers = product?.tiers ?? [];
    const stockLeft = offer ? remainingStock(offer.productId, variant) : 0;
    const maxQty = Math.max(1, Math.min(stockLeft, 50));
    const soldOut = stockLeft <= 0;
    const total = priceForQuantity(quantity, unitPrice, tiers);

    // Envío gratis de Navidad desde el monto mínimo
    const xmas = isXmasActive();
    const missingForFree = xmas && FREE_SHIPPING_MIN > 0 && total < FREE_SHIPPING_MIN ? FREE_SHIPPING_MIN - total : 0;
    const shippingNote = xmas
        ? FREE_SHIPPING_MIN > 0
            ? `Delivery gratis en Lima desde ${formatPEN(FREE_SHIPPING_MIN)} · Provincias por Shalom`
            : "Delivery gratis en Lima · Provincias por Shalom"
        : "Delivery en Lima · Provincias por Shalom";

    const buy = () => {
        if (!offer || soldOut) return;
        addToCart({ productId: offer.productId, variant, quantity }); // abre el carrito
        onClose();
    };

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={titleId}
            onClose={onClose}
            // Tocar fuera (el fondo oscuro) cierra el diálogo
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            className="m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-hidden rounded-t-3xl border border-sayni-lime/15 bg-sayni-darkGreen p-0 text-sayni-light backdrop:bg-black/70 backdrop:backdrop-blur-sm sm:m-auto sm:max-w-md sm:rounded-3xl"
        >
            {offer && (
                <div className="flex max-h-[92dvh] flex-col font-urbanist">
                    {/* ── Contenido con scroll ── */}
                    <div className="overflow-y-auto">
                        {/* Imagen con halo lima */}
                        <div className="relative aspect-[4/3] w-full bg-gradient-to-b from-sayni-black/50 to-transparent">
                            <span
                                aria-hidden
                                className="pointer-events-none absolute left-1/2 top-1/2 size-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sayni-lime/10 blur-3xl"
                            />
                            <Image src={offer.image} alt={offer.name} fill sizes="(min-width: 640px) 448px, 100vw" className="object-contain p-6 pt-10" />
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Cerrar"
                                className="absolute right-3 top-3 grid size-9 cursor-pointer place-items-center rounded-full bg-sayni-black/60 text-sayni-light transition-colors hover:bg-sayni-black"
                            >
                                <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden>
                                    <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4 px-5 pb-5 pt-0">
                            <div>
                                <h2 id={titleId} className="font-heading text-2xl font-bold text-sayni-light">
                                    {offer.name}
                                </h2>
                                <p className="mt-1 text-sm italic text-sayni-light/70">{offer.tagline}</p>
                            </div>

                            {/* Características */}
                            <ul className="grid grid-cols-2 gap-2">
                                {offer.highlights.map((h) => (
                                    <li
                                        key={h.text}
                                        className="flex items-center gap-2.5 rounded-xl border border-sayni-lime/15 bg-sayni-black/30 p-2.5 text-xs leading-snug text-sayni-light/85"
                                    >
                                        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sayni-lime/15 text-sayni-lime">
                                            <Icon name={h.icon} />
                                        </span>
                                        {h.text}
                                    </li>
                                ))}
                            </ul>

                            {/* Precios por cantidad (solo productos con promoción) */}
                            {tiers.length > 0 && (
                                <p className="text-xs text-sayni-light/60">
                                    {[1, 2, 3].map((q, i) => (
                                        <span key={q}>
                                            {i > 0 && " · "}
                                            <span className={quantity === q ? "font-bold text-sayni-lime" : ""}>
                                                {q} {q === 1 ? "bolsa" : "bolsas"} {formatPEN(priceForQuantity(q, unitPrice, tiers))}
                                            </span>
                                        </span>
                                    ))}
                                </p>
                            )}

                            {/* Presentación */}
                            {offer.variants && (
                                <div role="radiogroup" aria-label="Presentación" className="grid grid-cols-2 gap-2">
                                    {offer.variants.map((v) => {
                                        const selected = variant === v.key;
                                        const out = remainingStock(offer.productId, v.key) <= 0;
                                        return (
                                            <button
                                                key={v.key}
                                                type="button"
                                                role="radio"
                                                aria-checked={selected}
                                                disabled={out}
                                                onClick={() => {
                                                    setVariant(v.key);
                                                    setQuantity(1);
                                                }}
                                                className={`cursor-pointer rounded-xl border py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                                                    selected
                                                        ? "border-sayni-lime bg-sayni-lime/10 text-sayni-light"
                                                        : "border-white/15 text-sayni-light/70 hover:border-white/35"
                                                }`}
                                            >
                                                {v.key === "grano" ? "En grano" : v.label}
                                                {out && <span className="ml-1 text-xs font-normal">(agotado)</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Envío */}
                            <p className="flex items-start gap-2 text-xs text-sayni-light/70">
                                <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 size-4 shrink-0 text-sayni-lime" aria-hidden>
                                    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                                </svg>
                                {shippingNote}
                            </p>
                        </div>
                    </div>

                    {/* ── Pie fijo: precio, cantidad y compra ── */}
                    <div className="space-y-3 border-t border-white/10 bg-sayni-darkGreen p-4 sm:p-5">
                        <div className="flex items-end justify-between gap-3">
                            <span className="font-heading text-3xl font-bold text-sayni-lime">{formatPEN(total)}</span>
                            {missingForFree > 0 && (
                                <span className="text-right text-xs text-sayni-light/60">
                                    Te faltan {formatPEN(missingForFree)} para delivery gratis
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center rounded-full border border-white/15 bg-sayni-black/30">
                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    disabled={quantity <= 1}
                                    aria-label="Quitar uno"
                                    className="grid size-11 cursor-pointer place-items-center text-xl text-sayni-light/80 hover:text-sayni-light disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                    −
                                </button>
                                <span aria-live="polite" className="w-6 text-center font-bold">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                                    disabled={quantity >= maxQty || soldOut}
                                    aria-label="Añadir uno"
                                    className="grid size-11 cursor-pointer place-items-center text-xl text-sayni-light/80 hover:text-sayni-light disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={buy}
                                disabled={soldOut}
                                className="flex-1 cursor-pointer rounded-full bg-sayni-lime py-3 text-base font-extrabold text-sayni-black transition-colors hover:bg-sayni-olive disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {soldOut ? "Agotado" : "Comprar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </dialog>
    );
}

/* ── Iconos de las características ── */

function Icon({ name }: { name: IconName }) {
    const common = { viewBox: "0 0 24 24", fill: "none", className: "size-4", "aria-hidden": true } as const;
    const stroke = { stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

    switch (name) {
        case "flower":
            return (
                <svg {...common}>
                    <path {...stroke} d="M3 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
                    <path {...stroke} d="M3 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
                </svg>
            );
        case "drop":
            return (
                <svg {...common}>
                    <path {...stroke} d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />
                </svg>
            );
        case "sun":
            return (
                <svg {...common}>
                    <circle {...stroke} cx="12" cy="12" r="4" />
                    <path {...stroke} d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
            );
        case "mountain":
            return (
                <svg {...common}>
                    <path {...stroke} d="m3 20 6-10 4 6 2-3 6 7H3Z" />
                </svg>
            );
        case "gift":
            return (
                <svg {...common}>
                    <path {...stroke} d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-2-4-6-3-5 0M12 7c2-4 6-3 5 0" />
                </svg>
            );
        case "press":
            return (
                <svg {...common}>
                    <path {...stroke} d="M7 7h9v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7ZM16 10h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-2M11.5 3v8M9 3h5" />
                </svg>
            );
        case "bag":
            return (
                <svg {...common}>
                    <path {...stroke} d="M6 8h12l-1 12H7L6 8ZM9 8V6a3 3 0 0 1 6 0v2" />
                </svg>
            );
        case "flame":
            return (
                <svg {...common}>
                    <path {...stroke} d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-6 1 1 2 2 3 2 0-2-1-4 0-6Z" />
                </svg>
            );
    }
}