"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type TabType = "b2c" | "b2b";

export default function OurCoffees() {
    const [activeTab, setActiveTab] = useState<TabType>("b2c");

    return (
        <section id="cafes" className="py-16 sm:py-20 lg:py-28 px-6 lg:px-16 bg-sayni-black text-sayni-light transition-all duration-500">
            <div className="max-w-5xl mx-auto space-y-12">

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

                {/* VISTA 1: PARA TI (B2C) */}
                {activeTab === "b2c" && (
                    <div className="space-y-28 pt-6 animate-fadeIn">

                        {/* Producto 1: Sayni Geisha */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-center justify-center relative">

                            {/* Bolsa Geisha (7 columnas) */}
                            <div className="lg:col-span-7 flex justify-center items-center h-full min-h-[420px] lg:min-h-[480px] relative">
                                <div className="relative h-full w-auto flex items-center justify-center scale-100 sm:scale-101 transition-transform duration-500">
                                    <Image
                                        src="/assets/features/geisha_package.webp"
                                        alt="Sayni Geisha"
                                        width={360}
                                        height={520}
                                        className="h-full w-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform duration-500"
                                        priority
                                    />
                                </div>
                            </div>

                            {/* Columna Derecha con Texto e Imagen secundaria (5 columnas) */}
                            <div className="lg:col-span-5 flex flex-col justify-between space-y-10 text-center lg:text-left relative">
                                {/* Título e información */}
                                <div className="space-y-6">
                                    <h3 className="text-3xl sm:text-5xl font-bold font-heading text-white leading-snug sm:leading-[1.15]">
                                        Sayni <br/> Geisha
                                    </h3>
                                    <p className="text-gray-300 text-sm sm:text-lg leading-relaxed max-w-[280px] sm:max-w-xs mx-auto lg:mx-0 font-light">
                                        Variedad Geisha de origen Cusco (Inkawasi, La Convención). Presenta notas florales y frutales a jazmín, cítricos, frutos rojos, caramelo, miel y chocolate. Un perfil elegante y complejo, ideal para momentos especiales.
                                    </p>
                                </div>

                                {/* Contenedor de foto secundaria con LÍNEA COLOR #BCC90F */}
                                <div className="relative w-full max-w-[300px] mx-auto lg:mx-0">
                                    <span className="hidden lg:block absolute right-full top-1/2 -translate-y-1/2 w-28 lg:w-36 h-[1px] bg-[#BCC90F] pointer-events-none" />

                                    <div className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                                        <Image
                                            src="/assets/features/geisha-grain.webp"
                                            alt="Sayni Geisha Detalle"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Producto 2: Sayni Clásico */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-center justify-center relative">

                            {/* Columna Izquierda con Texto con padding interno a la izquierda lg:pl-16 para empujar todo hacia la derecha */}
                            <div className="lg:col-span-5 flex flex-col justify-between space-y-10 text-center lg:text-left order-2 lg:order-1 relative lg:pl-32">
                                {/* Título e información */}
                                <div className="space-y-6">
                                    <h3 className="text-3xl sm:text-5xl font-bold font-heading text-white leading-snug sm:leading-[1.15]">
                                        Sayni <br/> Clásico
                                    </h3>
                                    <p className="text-gray-300 text-sm sm:text-lg leading-relaxed max-w-[280px] sm:max-w-xs mx-auto lg:mx-0 font-light">
                                        100% café peruano, blend de Cusco y tueste oscuro, creado para acompañarte cada día con un sabor intenso y auténtico. Una pausa para recargar el alma y seguir adelante.
                                    </p>
                                </div>

                                {/* Contenedor de foto secundaria con LÍNEA EXTENDIDA */}
                                <div className="relative w-full max-w-[300px] mx-auto lg:mx-0">
                                    {/* Línea extendida proporcionalmente */}
                                    <span className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 w-36 lg:w-48 h-[1px] bg-[#BCC90F] pointer-events-none" />

                                    <div className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                                        <Image
                                            src="/assets/features/classic-grain.webp"
                                            alt="Sayni Clásico Detalle"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bolsa Clásico (7 columnas) */}
                            <div className="lg:col-span-7 flex justify-center items-center h-full min-h-[420px] lg:min-h-[480px] order-1 lg:order-2 relative">
                                <div className="relative h-full w-auto flex items-center justify-center scale-100 sm:scale-101 transition-transform duration-500">
                                    <Image
                                        src="/assets/features/classic_package_.webp"
                                        alt="Sayni Clásico"
                                        width={360}
                                        height={520}
                                        className="h-full w-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform duration-500"
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