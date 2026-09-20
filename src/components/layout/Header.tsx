"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="absolute top-0 left-0 w-full z-50 px-6 sm:px-12 pt-8 pb-6 bg-transparent transition-all duration-300 ease-in-out">
            {/* Contenedor principal limitado a max-w-6xl */}
            <div className="max-w-6xl mx-auto flex items-center justify-between transition-all duration-300 ease-in-out">

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

                {/* 2. ESPACIADOR (Solo para Tablets y Desktop para empujar el menú a la derecha) */}
                <div className="hidden md:block md:flex-1 transition-all duration-300" />

                {/* 3. BLOQUE DERECHO (Navegación Desktop/Tablet + Botón Hamburguesa Mobile) */}
                <div className="flex items-center justify-end gap-10 md:gap-16 transition-all duration-300 ease-in-out">

                    {/* Navegación Desktop / Tablet (Logo + Links alineados juntos) */}
                    <nav className="hidden md:flex items-center gap-15 lg:gap-25 text-sm font-medium tracking-wide text-sayni-light/90 transition-all duration-300 ease-in-out">

                        {/* Logo Desktop / Tablet */}
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

                        {/* Links Desktop / Tablet con hover scale + underline animado */}
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
                        <Link
                            href="#opiniones"
                            className="relative py-1 inline-block hover:text-sayni-lime transition-all duration-300 hover:scale-110 active:scale-95 origin-center group"
                        >
                            Opiniones
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-sayni-lime transition-all duration-300 group-hover:w-full" />
                        </Link>

                    </nav>

                    {/* Botón Menú Móvil (Alineado a la derecha en < md) */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-sayni-light focus:outline-none p-2 md:hidden transition-transform duration-300 active:scale-90"
                        aria-label="Abrir menú"
                    >
                        <svg className="w-8 h-8 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

            </div>

            {/* Menú desplegable Mobile con hover scale en opciones */}
            <div
                className={`absolute top-full left-0 w-full bg-sayni-black/95 backdrop-blur-xl border-b border-white/10 py-8 px-8 flex flex-col gap-6 md:hidden shadow-2xl transition-all duration-300 ease-out origin-top ${
                    isOpen
                        ? 'opacity-100 scale-y-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
                }`}
            >
                <Link
                    href="#inicio"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium w-max hover:text-sayni-lime transition-all duration-300 hover:scale-105 active:scale-95 origin-left"
                >
                    Inicio
                </Link>
                <Link
                    href="#nosotros"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium w-max hover:text-sayni-lime transition-all duration-300 hover:scale-105 active:scale-95 origin-left"
                >
                    Nosotros
                </Link>
                <Link
                    href="#cafes"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium w-max hover:text-sayni-lime transition-all duration-300 hover:scale-105 active:scale-95 origin-left"
                >
                    Cafés
                </Link>
                <Link
                    href="#opiniones"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium w-max hover:text-sayni-lime transition-all duration-300 hover:scale-105 active:scale-95 origin-left"
                >
                    Opiniones
                </Link>
            </div>
        </header>
    );
}