"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type TabType = "b2c" | "b2b";

export default function OurCoffees() {
    const [activeTab, setActiveTab] = useState<TabType>("b2c");

    return (
        <section id="cafes" className="py-16 sm:py-20 lg:py-28 px-6 lg:px-16 bg-sayni-black text-sayni-light transition-all duration-500">
            <div className="max-w-3xl mx-auto space-y-12">

                {/* ENCABEZADO CON SWITCH */}
                <div className="text-center space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-center gap-3">
                            <span className="h-[1px] w-12 sm:w-16 bg-white/20" />
                            <span className="text-sayni-lime font-heading tracking-widest text-xs sm:text-sm uppercase font-medium">
                                Nuestros cafés
                            </span>
                            <span className="h-[1px] w-12 sm:w-16 bg-white/20" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white tracking-tight">
                            Dos cafés <br />
                            Una misma esencia
                        </h2>
                    </div>

                    {/* TOGGLE SWITCH PILS */}
                    <div className="inline-flex items-center p-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                        <button
                            onClick={() => setActiveTab("b2c")}
                            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                                activeTab === "b2c"
                                    ? "bg-sayni-lime text-sayni-black shadow-lg"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            Para ti
                        </button>
                        <button
                            onClick={() => setActiveTab("b2b")}
                            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                                activeTab === "b2b"
                                    ? "bg-sayni-lime text-sayni-black shadow-lg"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            Para tu negocio
                        </button>
                    </div>
                </div>

                {/* VISTA 1: PARA TI (B2C) - DOS PRODUCTOS (GEISHA & CLÁSICO) */}
                {activeTab === "b2c" && (
                    <div className="space-y-20 pt-6 animate-fadeIn">

                        {/* Producto 1: Sayni Geisha */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                            <div className="lg:col-span-6 flex justify-center">
                                <div className="relative w-64 h-80 sm:w-80 sm:h-[420px]">
                                    <Image
                                        src="/assets/features/geisha.webp"
                                        alt="Sayni Geisha"
                                        fill
                                        className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform duration-500"
                                        priority
                                    />
                                </div>
                            </div>

                            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                                <div className="space-y-2">
                                    <h3 className="text-3xl sm:text-4xl font-bold font-heading text-white">
                                        Sayni <br/> Geisha
                                    </h3>
                                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0 font-light">
                                        Café de todos los días. Un café peruano con alma andina para tu pausa diaria. Blend de origen Cusco (Inkawasi, La Convención), de tueste oscuro y sabor intenso. Haz una pausa, recarga el alma y sigue adelante.
                                    </p>
                                </div>

                                {/* Imagen secundaria / detalle en relación 3:2 */}
                                <div className="relative aspect-[3/2] w-full max-w-xs mx-auto lg:mx-0 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                                    <Image
                                        src="/assets/features/geisha-grain.webp"
                                        alt="Sayni Geisha Detalle"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Producto 2: Sayni Clásico */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                            <div className="lg:col-span-6 space-y-6 text-center lg:text-left order-2 lg:order-1">
                                <div className="space-y-2">
                                    <h3 className="text-3xl sm:text-4xl font-bold font-heading text-white">
                                        Sayni <br/> Clásico
                                    </h3>
                                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0 font-light">
                                        100% café peruano, blend de Cusco y tueste oscuro, creado para acompañarte cada día con un sabor intenso y auténtico. Una pausa para recargar el alma y seguir adelante.
                                    </p>
                                </div>

                                {/* Imagen secundaria / detalle en relación 3:2 */}
                                <div className="relative aspect-[3/2] w-full max-w-xs mx-auto lg:mx-0 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                                    <Image
                                        src="/assets/features/clasico-grain.webp"
                                        alt="Sayni Clásico Detalle"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            <div className="lg:col-span-6 flex justify-center order-1 lg:order-2">
                                <div className="relative w-64 h-80 sm:w-80 sm:h-[420px]">
                                    <Image
                                        src="/assets/features/clasico.webp"
                                        alt="Sayni Clásico"
                                        fill
                                        className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Botón CTA B2C */}
                        <div className="text-center pt-8">
                            <Link
                                href="https://wa.me/"
                                target="_blank"
                                className="inline-flex items-center gap-3 bg-sayni-lime text-sayni-black font-semibold px-8 py-3.5 rounded-full hover:bg-sayni-olive transition-all shadow-lg group"
                            >
                                Solicita información
                                <span className="bg-sayni-black text-sayni-lime rounded-full p-1 group-hover:translate-x-1 transition-transform">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </span>
                            </Link>
                        </div>

                    </div>
                )}

                {/* VISTA 2: PARA TU NEGOCIO (B2B) */}
                {activeTab === "b2b" && (
                    <div className="space-y-10 pt-6 animate-fadeIn max-w-4xl mx-auto text-center">

                        {/* Imagen Principal de Pack Cofre B2B */}
                        <div className="relative w-full max-w-2xl h-72 sm:h-96 md:h-[420px] mx-auto">
                            <Image
                                src="/assets/features/sayni-package.webp"
                                alt="Pack Cofre Sayni B2B"
                                fill
                                className="object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.8)]"
                            />
                        </div>

                        {/* Badges de Contenido del Pack */}
                        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
                            <div className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-xs sm:text-sm text-gray-200">
                                4 Bolsas Sayni
                            </div>
                            <div className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-xs sm:text-sm text-gray-200">
                                1 Prensa Francesa
                            </div>
                            <div className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-xs sm:text-sm text-gray-200">
                                1 Estuche cofre
                            </div>
                        </div>

                        {/* Botón CTA B2B */}
                        <div className="pt-6">
                            <Link
                                href="https://wa.me/"
                                target="_blank"
                                className="inline-flex items-center gap-3 bg-sayni-lime text-sayni-black font-semibold px-8 py-3.5 rounded-full hover:bg-sayni-olive transition-all shadow-lg group"
                            >
                                Pide tu Sayni
                                <span className="bg-sayni-black text-sayni-lime rounded-full p-1 group-hover:translate-x-1 transition-transform">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </span>
                            </Link>
                        </div>

                    </div>
                )}

            </div>
        </section>
    );
}