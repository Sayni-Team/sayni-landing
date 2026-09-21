"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type TabType = "b2c" | "b2b";

export default function OurCoffees() {
    const [activeTab, setActiveTab] = useState<TabType>("b2c");

    return (
        <section id="cafes" className="py-16 sm:py-20 lg:py-28 px-6 lg:px-16 bg-sayni-black text-sayni-light transition-all duration-500 relative overflow-hidden">
            <div className="max-w-5xl mx-auto space-y-12 relative z-10">

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
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white tracking-wide">
                            Dos cafés <br />
                            Una misma esencia
                        </h2>
                    </div>

                    {/* TOGGLE SWITCH PILS 3D CORREGIDO */}
                    <div className="relative inline-grid grid-cols-2 p-1.5 bg-[#151f15] border border-white/15 rounded-full shadow-[inset_0_3px_8px_rgba(0,0,0,0.7)] backdrop-blur-md select-none w-full max-w-[360px] font-urbanist">

                        {/* Pill verde flotante 3D que se desliza (50% exacto del contenedor) */}
                        <div
                            className={`
            absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-[#BCC90F] rounded-full
            border-t border-white/40
            shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_4px_10px_rgba(0,0,0,0.4)]
            transition-transform duration-300 ease-out pointer-events-none z-0
            ${activeTab === "b2c" ? "translate-x-0" : "translate-x-full"}
        `}
                        />

                        {/* Botón 1: Para ti */}
                        <button
                            type="button"
                            onClick={() => setActiveTab("b2c")}
                            className={`
            relative z-10 flex items-center justify-center py-2 px-4 rounded-full text-sm sm:text-lg font-bold transition-colors duration-300 cursor-pointer text-center
            ${activeTab === "b2c" ? "text-[#132219]" : "text-white/80 hover:text-white"}
        `}
                        >
                            Para ti
                        </button>

                        {/* Botón 2: Para tu negocio */}
                        <button
                            type="button"
                            onClick={() => setActiveTab("b2b")}
                            className={`
            relative z-10 flex items-center justify-center py-2 px-4 rounded-full text-sm sm:text-lg font-bold transition-colors duration-300 cursor-pointer text-center
            ${activeTab === "b2b" ? "text-[#132219]" : "text-white/80 hover:text-white"}
        `}
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

                                {/* DEGRADADO RADIAL Y DESENFOQUE DETRÁS DEL PRODUCTO (#BCC90F) */}
                                <div
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] lg:w-[650px] h-[350px] sm:h-[500px] lg:h-[650px] rounded-full pointer-events-none opacity-35 blur-[90px] lg:blur-[120px] -z-10"
                                    style={{
                                        background: "radial-gradient(circle, rgba(188,201,15,0.8) 0%, rgba(188,201,15,0.2) 45%, rgba(0,0,0,0) 70%)",
                                    }}
                                />

                                <div className="relative h-full w-auto flex items-center justify-center scale-100 sm:scale-101 transition-transform duration-500 z-10">
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

                        {/* Botón CTA B2C CON EFECTO 3D Y ÍCONO DE TELÉFONO */}
                        <div className="text-center pt-8">
                            <Link
                                href="https://wa.me/"
                                target="_blank"
                                className="
            inline-flex items-center gap-6 bg-[#BCC90F] text-[#132219] font-bold
            pl-8 pr-3 py-1 rounded-[100px] hover:scale-[1.01] active:scale-[0.98]
            transition-all duration-300 group text-base sm:text-lg relative
            /* ILUMINACIÓN SUPERIOR (Borde superior) */
            border-t border-white/40
            /* SOMBRAS 3D: Inset superior blanca, inset inferior oscura, y sombras de caída */
            shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.2)]
        "
                            >
                                {/* TEXTO CON FUENTE CLASH GROTESK Y TÍTULO */}
                                <span className="font-urbanist tracking-wide select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.15)] pr-1">
            Solicita información
        </span>

                                {/* CÍRCULO OSCURO CON ÍCONO DE TELÉFONO LIMA */}
                                <span className="
            bg-[#132219] text-[#BCC90F] rounded-full w-12 h-12 flex items-center justify-center
            transition-transform group-hover:scale-105 shrink-0
            /* Sutil relieve 3D para el círculo */
            shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.15)]
        ">
            <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
            >
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
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

                        {/* Botón CTA B2B CON EFECTO 3D Y ÍCONO DE TELÉFONO */}
                        <div className="pt-6 font-urbanist">
                            <Link
                                href="https://wa.me/"
                                target="_blank"
                                className="
            inline-flex items-center gap-6 bg-[#BCC90F] text-[#132219] font-bold
            pl-8 pr-3 py-1 rounded-[100px] hover:scale-[1.01] active:scale-[0.98]
            transition-all duration-300 group text-base sm:text-lg relative cursor-pointer
            /* ILUMINACIÓN SUPERIOR (Borde superior) */
            border-t border-white/40
            /* SOMBRAS 3D: Inset superior blanca, inset inferior oscura, y sombras de caída */
            shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.2)]
        "
                            >
                                {/* TEXTO CON FUENTE URBANIST Y TRACED SPACING */}
                                <span className="tracking-wide select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.15)] pr-1">
            Pide tu Sayni
        </span>

                                {/* CÍRCULO OSCURO CON ÍCONO DE TELÉFONO LIMA */}
                                <span className="
            bg-[#132219] text-[#BCC90F] rounded-full w-12 h-12 flex items-center justify-center
            transition-transform group-hover:scale-105 shrink-0
            /* Sutil relieve 3D para el círculo */
            shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.15)]
        ">
            <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
            >
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
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