"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

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

    const handleCheckout = () => {
        const phoneNumber = "51991319377"; // Número con código de país de Perú (+51)

        // Formatear los productos de la orden
        const itemsList = cartItems
            .map(
                (item) =>
                    `• ${item.quantity}x *${item.title}* (${item.weight}) - S/ ${(item.price * item.quantity).toFixed(2)}`
            )
            .join("\n");

        const message = `¡Hola Sayni! ☕ Deseo realizar el siguiente pedido:\n\n${itemsList}\n\n*Total:* S/ ${totalPrice.toFixed(2)}`;

        // Redirigir a WhatsApp
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, "_blank");
    };

    return (
        <>
            <header className="absolute top-0 left-0 w-full z-50 px-6 sm:px-12 pt-8 pb-6 bg-transparent transition-all duration-300 ease-in-out">
                {/* Contenedor que ocupa exactamente los 3/5 derechos en Desktop */}
                <div className="w-full md:w-3/5 md:ml-auto flex items-center justify-between md:justify-center transition-all duration-300 ease-in-out px-4">

                    {/* 1. LOGO MÓVIL (Solo visible en pantallas pequeñas < md) */}
                    <Link
                        href="/"
                        className="flex items-center shrink-0 md:hidden transition-transform duration-300 hover:scale-105 active:scale-95"
                    >
                        <div className="relative w-10 h-10 sm:w-11 sm:h-11">
                            <Image
                                src="/assets/brand/logo.webp"
                                alt="Sayni Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </Link>

                    {/* 2. BLOQUE NAVEGACIÓN DESKTOP */}
                    <div className="flex items-center justify-end md:justify-center transition-all duration-300 ease-in-out w-full">

                        {/* Navegación Desktop con el GAP correcto */}
                        <nav className="hidden md:flex items-center justify-center gap-12 lg:gap-20 text-sm font-medium tracking-wide text-sayni-light/90 transition-all duration-300 ease-in-out">

                            {/* Logo Desktop */}
                            <Link
                                href="/"
                                className="flex items-center shrink-0 transition-transform duration-300 hover:scale-105 active:scale-95"
                            >
                                <div className="relative w-10 h-10 sm:w-11 sm:h-11">
                                    <Image
                                        src="/assets/brand/logo.webp"
                                        alt="Sayni Logo"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            </Link>

                            {/* Links Desktop */}
                            <Link
                                href="#inicio"
                                className="relative py-1 inline-block hover:text-sayni-lime transition-all duration-300 hover:scale-110 active:scale-95 origin-center group"
                            >
                                Inicio
                                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-sayni-lime transition-all duration-300 group-hover:w-full" />
                            </Link>
                            <Link
                                href="#nosotros"
                                className="relative py-1 inline-block hover:text-sayni-lime transition-all duration-300 hover:scale-110 active:scale-95 origin-center group"
                            >
                                Nosotros
                                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-sayni-lime transition-all duration-300 group-hover:w-full" />
                            </Link>
                            <Link
                                href="#cafes"
                                className="relative py-1 inline-block hover:text-sayni-lime transition-all duration-300 hover:scale-110 active:scale-95 origin-center group"
                            >
                                Cafés
                                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-sayni-lime transition-all duration-300 group-hover:w-full" />
                            </Link>

                            {/* Botón Carrito Desktop */}
                            <button
                                type="button"
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2 text-sayni-lime hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                                aria-label="Abrir carrito"
                            >
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.89-2-1.99-2z" />
                                </svg>
                                {totalCartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-white text-sayni-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                                        {totalCartCount}
                                    </span>
                                )}
                            </button>
                        </nav>

                        {/* Botones Móvil */}
                        <div className="flex items-center gap-2 md:hidden">
                            <button
                                type="button"
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2 text-sayni-lime focus:outline-none transition-transform duration-300 active:scale-90"
                                aria-label="Abrir carrito"
                            >
                                <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.89-2-1.99-2z" />
                                </svg>
                                {totalCartCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-white text-sayni-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                                        {totalCartCount}
                                    </span>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-sayni-light focus:outline-none p-2 transition-transform duration-300 active:scale-90"
                                aria-label="Abrir menú"
                            >
                                <svg className="w-8 h-8 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>

                    </div>

                </div>
            </header>

            {/* OVERLAY & DRAWER DEL CARRITO */}
            <div
                className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
                    isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsCartOpen(false)}
            />

            <aside
                className={`fixed top-0 right-0 z-[70] w-full max-w-md h-full bg-[#132219] text-white border-l border-white/10 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
                    isCartOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header Carrito */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 fill-[#BCC90F]" viewBox="0 0 24 24">
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.89-2-1.99-2z" />
                        </svg>
                        <h3 className="text-xl font-bold font-heading">Tu Carrito</h3>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Lista de Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 font-urbanist">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 gap-3">
                            <svg className="w-12 h-12 stroke-current opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p className="text-base">Tu carrito está vacío</p>
                        </div>
                    ) : (
                        cartItems
                            .slice() // Copia para no mutar el array original en el estado
                            .sort((a, b) => (a.id === "pack-regalo-clasico" ? -1 : b.id === "pack-regalo-clasico" ? 1 : 0))
                            .map((item) => (
                                <div key={item.id} className="flex items-center gap-4 bg-[#1b2f22] p-3 rounded-2xl border border-white/5">
                                    <div className="relative w-16 h-16 shrink-0 bg-[#132219] rounded-xl overflow-hidden p-1">
                                        <Image
                                            src={item.image ?? "/assets/brand/logo.webp"}
                                            alt={item.title}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white text-base leading-tight">{item.title}</h4>
                                        <p className="text-xs text-[#BCC90F]">{item.weight}</p>
                                        <p className="text-sm font-semibold text-gray-200 mt-1">S/ {item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#132219] rounded-full px-2 py-1 border border-white/10">
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="w-5 h-5 flex items-center justify-center text-gray-300 hover:text-white"
                                        >
                                            -
                                        </button>
                                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                        <button
                                            type="button"
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="w-5 h-5 flex items-center justify-center text-gray-300 hover:text-white"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-gray-400 hover:text-red-400 p-1 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))
                    )}
                </div>

                {/* Footer Carrito */}
                {cartItems.length > 0 && (
                    <div className="p-6 border-t border-white/10 bg-[#0d1711] space-y-4 font-urbanist">
                        <div className="flex justify-between items-center text-gray-300">
                            <span>Total</span>
                            <span className="text-xl font-bold text-white">S/ {totalPrice.toFixed(2)}</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleCheckout}
                            className="
                                w-full inline-flex items-center justify-center gap-3 bg-[#BCC90F] text-[#132219] font-bold
                                py-3.5 px-6 rounded-full hover:scale-[1.02] active:scale-[0.98]
                                transition-all duration-300 text-base cursor-pointer
                                border-t border-white/40
                                shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4)]
                            "
                        >
                            <span>Finalizar Pedido por WhatsApp</span>
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}