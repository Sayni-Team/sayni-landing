"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="absolute top-0 left-0 w-full z-50 px-6 lg:px-16 py-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Logotipo Isotipo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative w-10 h-10">
                        {/* Reemplaza con tu ruta de logo real en public/ */}
                        <span className="text-sayni-lime font-bold text-2xl tracking-wider">Sayni</span>
                    </div>
                </Link>

                {/* Navegación Desktop */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-sayni-light/90">
                    <Link href="#inicio" className="hover:text-sayni-lime transition-colors">Inicio</Link>
                    <Link href="#nosotros" className="hover:text-sayni-lime transition-colors">Nosotros</Link>
                    <Link href="#cafes" className="hover:text-sayni-lime transition-colors">Cafés</Link>
                    <Link href="#opiniones" className="hover:text-sayni-lime transition-colors">Opiniones</Link>
                </nav>

                {/* Botón CTA o Menú Móvil */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-sayni-light focus:outline-none p-2"
                        aria-label="Abrir menú"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Menú desplegable móvil */}
            {isOpen && (
                <div className="absolute top-full left-0 w-full bg-sayni-black/95 backdrop-blur-md border-b border-white/10 py-6 px-6 flex flex-col gap-4 md:hidden">
                    <Link href="#inicio" onClick={() => setIsOpen(false)} className="text-lg hover:text-sayni-lime">Inicio</Link>
                    <Link href="#nosotros" onClick={() => setIsOpen(false)} className="text-lg hover:text-sayni-lime">Nosotros</Link>
                    <Link href="#cafes" onClick={() => setIsOpen(false)} className="text-lg hover:text-sayni-lime">Cafés</Link>
                    <Link href="#opiniones" onClick={() => setIsOpen(false)} className="text-lg hover:text-sayni-lime">Opiniones</Link>
                </div>
            )}
        </header>
    );
}