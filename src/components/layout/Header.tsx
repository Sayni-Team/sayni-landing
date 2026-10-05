"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useCart } from "@/context/CartContext";

const EASE = [0.215, 0.61, 0.355, 1] as const;

const NAV_LINKS = [
    { id: "inicio", label: "Inicio" },
    { id: "nosotros", label: "Nosotros" },
    { id: "cafes", label: "Cafés" },
];

/* ── Variantes ─────────────────────────────── */

// Header: escalona sus elementos al cargar
const headerContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const dropIn: Variants = {
    hidden: { opacity: 0, y: -16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const popIn: Variants = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 260, damping: 16 } },
};

// Menú móvil: los enlaces suben uno a uno al abrir
const menuList: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const menuItem: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

// Carrito: los productos entran desde la derecha, escalonados por índice
const cartItem: Variants = {
    hidden: { opacity: 0, x: 40 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.45, ease: EASE, delay: 0.15 + i * 0.06 },
    }),
    exit: { opacity: 0, x: 60, transition: { duration: 0.25, ease: "easeIn" } },
};

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {
        cartItems,
        updateQuantity,
        removeFromCart,
        totalCartCount,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
    } = useCart();

    // Cerrar menú y carrito con Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "Escape") return;
            setIsMenuOpen(false);
            setIsCartOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [setIsCartOpen]);

    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
        e.preventDefault();
        setIsMenuOpen(false);

        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            window.history.pushState(null, "", `#${id}`);
        }
    };

    const handleCheckout = () => {
        const phoneNumber = "51991319377";

        const itemsList = cartItems
            .map(
                (item) =>
                    `• ${item.quantity}x *${item.title}* (${item.weight}) - S/ ${(item.price * item.quantity).toFixed(2)}`
            )
            .join("\n");

        const message = `¡Hola Sayni! ☕ Deseo realizar el siguiente pedido:\n\n${itemsList}\n\n*Total:* S/ ${totalPrice.toFixed(2)}`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    };

    const sortedItems = cartItems
        .slice()
        .sort((a, b) => (a.id === "pack-regalo-clasico" ? -1 : b.id === "pack-regalo-clasico" ? 1 : 0));

    return (
        <>
            <header className="absolute left-0 top-0 z-50 w-full bg-transparent px-6 pb-6 pt-8 sm:px-12">
                {/* Contenedor desktop en el lado derecho solo a partir de lg (1024px) */}
                <motion.div
                    variants={headerContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex w-full items-center justify-between px-4 lg:ml-auto lg:w-3/5 lg:justify-center"
                >
                    {/* 1. LOGO MÓVIL Y TABLET (visible hasta lg) */}
                    <motion.div variants={popIn} className="z-50 shrink-0 lg:hidden">
                        <Link
                            href="#inicio"
                            onClick={(e) => handleScroll(e, "inicio")}
                            className="flex items-center transition-[scale] duration-300 hover:scale-105 active:scale-95"
                        >
                            <span className="relative block size-10 sm:size-11">
                                <Image src="/assets/brand/logo.webp" alt="Sayni Logo" fill className="object-contain" priority />
                            </span>
                        </Link>
                    </motion.div>

                    {/* 2. BLOQUE NAVEGACIÓN */}
                    <div className="flex w-full items-center justify-end lg:justify-center">
                        {/* Navegación Desktop (desde lg) */}
                        <nav className="hidden items-center justify-center gap-12 text-sm font-medium tracking-wide text-sayni-light/90 lg:flex lg:gap-20">
                            {/* Logo Desktop */}
                            <motion.div variants={popIn} className="shrink-0">
                                <Link
                                    href="#inicio"
                                    onClick={(e) => handleScroll(e, "inicio")}
                                    className="flex items-center transition-[scale] duration-300 hover:scale-105 active:scale-95"
                                >
                                    <span className="relative block size-10 sm:size-11">
                                        <Image src="/assets/brand/logo.webp" alt="Sayni Logo" fill className="object-contain" priority />
                                    </span>
                                </Link>
                            </motion.div>

                            {/* Links Desktop: bajan uno tras otro */}
                            {NAV_LINKS.map((link) => (
                                <motion.div key={link.id} variants={dropIn}>
                                    <Link
                                        href={`#${link.id}`}
                                        onClick={(e) => handleScroll(e, link.id)}
                                        className="group relative inline-block origin-center py-1 transition-all duration-300 hover:scale-110 hover:text-sayni-lime active:scale-95"
                                    >
                                        {link.label}
                                        <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-sayni-lime transition-all duration-300 group-hover:w-full" />
                                    </Link>
                                </motion.div>
                            ))}

                            {/* Botón Carrito Desktop */}
                            <motion.div variants={popIn}>
                                <button
                                    type="button"
                                    onClick={() => setIsCartOpen(true)}
                                    className="relative cursor-pointer p-2 text-sayni-lime transition-all duration-300 hover:scale-110 hover:text-white active:scale-95"
                                    aria-label={`Abrir carrito (${totalCartCount} productos)`}
                                >
                                    <CartIcon className="size-6" />
                                    <CartBadge count={totalCartCount} className="-right-1 -top-1" />
                                </button>
                            </motion.div>
                        </nav>

                        {/* Botones Móvil y Tablet (hasta lg) */}
                        <motion.div variants={dropIn} className="z-50 flex items-center gap-2 lg:hidden">
                            <button
                                type="button"
                                onClick={() => setIsCartOpen(true)}
                                className="relative rounded-full p-2 text-sayni-lime transition-[scale] duration-300 focus-visible:outline-2 focus-visible:outline-sayni-lime active:scale-90"
                                aria-label={`Abrir carrito (${totalCartCount} productos)`}
                            >
                                <CartIcon className="size-7" />
                                <CartBadge count={totalCartCount} className="right-0 top-0" />
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-expanded={isMenuOpen}
                                aria-controls="mobile-menu"
                                aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                                className="cursor-pointer rounded-full p-2 text-sayni-light transition-[scale] duration-300 focus-visible:outline-2 focus-visible:outline-sayni-lime active:scale-90"
                            >
                                <svg className="size-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </header>

            {/* MENÚ DESPLEGABLE MÓVIL Y TABLET (hasta lg) */}
            <div
                id="mobile-menu"
                inert={!isMenuOpen}
                className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#132219]/95 backdrop-blur-md transition-opacity duration-300 ease-in-out lg:hidden ${
                    isMenuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                }`}
            >
                <motion.nav
                    variants={menuList}
                    initial="hidden"
                    animate={isMenuOpen ? "visible" : "hidden"}
                    className="flex flex-col items-center gap-8 font-heading text-2xl font-bold tracking-wide text-white"
                >
                    {NAV_LINKS.map((link) => (
                        <motion.div key={link.id} variants={menuItem}>
                            <Link
                                href={`#${link.id}`}
                                onClick={(e) => handleScroll(e, link.id)}
                                className="transition-colors hover:text-sayni-lime"
                            >
                                {link.label}
                            </Link>
                        </motion.div>
                    ))}
                </motion.nav>
            </div>

            {/* OVERLAY DEL CARRITO */}
            <div
                aria-hidden
                className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
                    isCartOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                }`}
                onClick={() => setIsCartOpen(false)}
            />

            {/* DRAWER DEL CARRITO */}
            <aside
                inert={!isCartOpen}
                aria-label="Carrito de compras"
                className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#132219] text-white shadow-2xl transition-[translate] duration-300 ease-out ${
                    isCartOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Header Carrito */}
                <div className="flex items-center justify-between border-b border-white/10 p-6">
                    <div className="flex items-center gap-3">
                        <CartIcon className="size-6 text-[#BCC90F]" />
                        <h3 className="font-heading text-xl font-bold">Tu Carrito</h3>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsCartOpen(false)}
                        aria-label="Cerrar carrito"
                        className="cursor-pointer p-2 text-gray-400 transition-colors hover:text-white"
                    >
                        <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Lista de Items */}
                <div
                    className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden p-6 font-urbanist
                    [&::-webkit-scrollbar]:w-2
                    [&::-webkit-scrollbar-track]:rounded-full
                    [&::-webkit-scrollbar-track]:bg-[#0d1711]
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-[#BCC90F]/60
                    hover:[&::-webkit-scrollbar-thumb]:bg-[#BCC90F]"
                >
                    {cartItems.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-gray-400">
                            <svg className="size-12 stroke-current opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p className="text-base">Tu carrito está vacío</p>
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {sortedItems.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    custom={i}
                                    variants={cartItem}
                                    initial="hidden"
                                    animate={isCartOpen ? "visible" : "hidden"}
                                    exit="exit"
                                    className="flex items-center gap-4 rounded-2xl border border-white/5 bg-[#1b2f22] p-3"
                                >
                                    <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-[#132219] p-1">
                                        <Image
                                            src={item.image ?? "/assets/brand/logo.webp"}
                                            alt={item.title}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-base font-bold leading-tight text-white">{item.title}</h4>
                                        <p className="text-xs text-[#BCC90F]">{item.weight}</p>
                                        <p className="mt-1 text-sm font-semibold text-gray-200">S/ {item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#132219] px-2 py-1">
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.id, -1)}
                                            aria-label={`Quitar una unidad de ${item.title}`}
                                            className="flex size-5 items-center justify-center text-gray-300 hover:text-white"
                                        >
                                            -
                                        </button>
                                        <span className="w-4 text-center text-xs font-bold">{item.quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.id, 1)}
                                            aria-label={`Añadir una unidad de ${item.title}`}
                                            className="flex size-5 items-center justify-center text-gray-300 hover:text-white"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFromCart(item.id)}
                                        aria-label={`Eliminar ${item.title} del carrito`}
                                        className="p-1 text-gray-400 transition-colors hover:text-red-400"
                                    >
                                        <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Footer Carrito */}
                {cartItems.length > 0 && (
                    <div className="space-y-4 border-t border-white/10 bg-[#0d1711] p-6 font-urbanist">
                        <div className="flex items-center justify-between text-gray-300">
                            <span>Total</span>
                            <span className="text-xl font-bold text-white">S/ {totalPrice.toFixed(2)}</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleCheckout}
                            className="
                                inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-[#BCC90F] px-6 py-3.5 text-base font-bold text-[#132219]
                                transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
                                border-t border-white/40
                                shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4)]
                            "
                        >
                            <span>Finalizar Pedido por WhatsApp</span>
                            <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}

/* ── Piezas ─────────────────────────────── */

// Contador: hace "pop" cada vez que cambia el número
function CartBadge({ count, className }: { count: number; className?: string }) {
    return (
        <AnimatePresence>
            {count > 0 && (
                <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className={`absolute flex size-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-sayni-black shadow-md ${className ?? ""}`}
                >
                    {count}
                </motion.span>
            )}
        </AnimatePresence>
    );
}

function CartIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.89-2-1.99-2z" />
        </svg>
    );
}