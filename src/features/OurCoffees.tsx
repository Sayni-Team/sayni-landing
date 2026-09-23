"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";

type TabType = "b2c" | "b2b";

// Variantes para contenedores principales
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.18,
            delayChildren: 0.1,
        },
    },
};

// Variantes de entrada hacia arriba
const itemUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.215, 0.61, 0.355, 1], // Cubic-bezier ultra fluido
        },
    },
};

// Variantes para cambio suave de pestañas (Tab switch)
const tabContentVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        y: -15,
        transition: {
            duration: 0.3,
            ease: "easeIn",
        },
    },
};

export default function OurCoffees() {
    const [activeTab, setActiveTab] = useState<TabType>("b2c");

    return (
        <section
            id="cafes"
            className="py-16 sm:py-20 lg:py-28 px-6 lg:px-16 bg-sayni-black text-sayni-light transition-all duration-500 relative overflow-hidden"
        >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className="max-w-5xl mx-auto space-y-12 relative z-10"
            >

                {/* ENCABEZADO CON SWITCH */}
                <motion.div variants={itemUpVariants} className="text-center space-y-6">
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

                    {/* TOGGLE SWITCH PILS 3D */}
                    <div className="relative inline-grid grid-cols-2 p-1.5 bg-[#151f15] border border-white/15 rounded-full shadow-[inset_0_3px_8px_rgba(0,0,0,0.7)] backdrop-blur-md select-none w-full max-w-[360px] font-urbanist">

                        {/* Pill verde flotante */}
                        <div
                            className={`
                                absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-[#BCC90F] rounded-full
                                border-t border-white/40
                                shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_4px_10px_rgba(0,0,0,0.4)]
                                transition-transform duration-300 ease-out pointer-events-none z-0
                                ${activeTab === "b2c" ? "translate-x-0" : "translate-x-full"}
                            `}
                        />

                        {/* Botón 1 */}
                        <button
                            type="button"
                            onClick={() => setActiveTab("b2c")}
                            className={`
                                relative z-10 flex items-center justify-center py-2 px-4 rounded-full
                                text-sm sm:text-lg font-bold transition-colors duration-300
                                cursor-pointer text-center
                                ${activeTab === "b2c"
                                ? "text-[#132219]"
                                : "text-white/80 hover:text-white"
                            }
                            `}
                        >
                            Para ti
                        </button>

                        {/* Botón 2 */}
                        <button
                            type="button"
                            onClick={() => setActiveTab("b2b")}
                            className={`
                                relative z-10 flex items-center justify-center py-2 px-4 rounded-full
                                text-sm sm:text-lg font-bold transition-colors duration-300
                                cursor-pointer text-center
                                ${activeTab === "b2b"
                                ? "text-[#132219]"
                                : "text-white/80 hover:text-white"
                            }
                            `}
                        >
                            Para tu negocio
                        </button>
                    </div>
                </motion.div>

                {/* CONTENIDO CON ANIMACIÓN DE PESTAÑAS (ANIMATE PRESENCE) */}
                <AnimatePresence mode="wait">
                    {/* VISTA 1: PARA TI */}
                    {activeTab === "b2c" && (
                        <motion.div
                            key="b2c-tab"
                            variants={tabContentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-28 pt-6"
                        >

                            {/* ====================================================== */}
                            {/* PRODUCTO 1: GEISHA */}
                            {/* ====================================================== */}

                            <div className="grid grid-cols-12 gap-0 items-center justify-center relative">

                                {/* DEGRADADO AMBIENTAL OVALADO */}
                                <div
                                    className="
                                        absolute -top-[35%] -left-[95%]
                                        w-[180%] h-[160%]
                                        sm:w-[160%] sm:h-[150%]
                                        lg:w-[250%] lg:h-[140%]
                                        pointer-events-none opacity-45
                                        blur-[140px] sm:blur-[170px] lg:blur-[200px]
                                        -z-10 -rotate-12 transform-gpu
                                    "
                                    style={{
                                        background:
                                            "radial-gradient(ellipse at center, rgba(188,201,15,0.8) 0%, rgba(188,201,15,0.25) 40%, rgba(0,0,0,0) 15%)",
                                    }}
                                />

                                {/* Bolsa Geisha */}
                                <div className="col-span-6 lg:col-span-7 flex justify-center items-center h-[300px] sm:h-[360px] lg:h-[480px] relative">
                                    <div className="relative h-full w-auto flex items-center justify-center scale-100 sm:scale-101 transition-transform duration-500 z-10">
                                        <Image
                                            src="/assets/features/geisha_package.webp"
                                            alt="Sayni Geisha"
                                            width={360}
                                            height={520}
                                            className="h-full w-auto object-contain hover:scale-105 transition-transform duration-500"
                                            priority
                                        />
                                    </div>
                                </div>

                                {/* Información Geisha */}
                                <div className="col-span-6 lg:col-span-5 flex flex-col justify-center lg:justify-between gap-5 lg:gap-10 text-left relative z-10">

                                    {/* Título e información */}
                                    <div className="space-y-4 sm:space-y-6">

                                        <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-heading text-white leading-snug sm:leading-[1.15]">
                                            Sayni <br />
                                            Geisha
                                        </h3>

                                        <p className="text-gray-300 text-[11px] sm:text-sm lg:text-lg leading-relaxed max-w-[150px] sm:max-w-[200px] lg:max-w-xs mx-0 font-light font-urbanist">
                                            <span className="sm:hidden">
                                                Geisha de Cusco con notas florales, cítricas y frutos rojos. Un perfil elegante y complejo.
                                            </span>
                                            <span className="hidden sm:inline">
                                                Variedad Geisha de origen Cusco (Inkawasi, La Convención). Presenta notas florales y frutales a jazmín, cítricos, frutos rojos, caramelo, miel y chocolate. Un perfil elegante y complejo, ideal para momentos especiales.
                                            </span>
                                        </p>
                                    </div>

                                    {/* Imagen secundaria */}
                                    <div className="relative w-full max-w-[150px] sm:max-w-[200px] lg:max-w-[300px] mx-0">

                                        {/* Línea */}
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

                            {/* ====================================================== */}
                            {/* PRODUCTO 2: CLÁSICO */}
                            {/* ====================================================== */}

                            <div className="grid grid-cols-12 gap-0 items-center justify-center relative">

                                {/* DEGRADADO AMBIENTAL OVALADO - ESPEJO */}
                                <div
                                    className="
                                        absolute -bottom-[35%] -right-[125%]
                                        w-[180%] h-[160%]
                                        sm:w-[160%] sm:h-[150%]
                                        lg:w-[250%] lg:h-[140%]
                                        pointer-events-none opacity-80
                                        blur-[140px] sm:blur-[170px] lg:blur-[200px]
                                        -z-10 rotate-12 transform-gpu
                                    "
                                    style={{
                                        background:
                                            "radial-gradient(ellipse at center, rgba(23,46,32,0.95) 0%, rgba(23,46,32,0.4) 40%, rgba(0,0,0,0) 75%)",
                                    }}
                                />

                                {/* Información Clásico */}
                                <div className="col-span-6 lg:col-span-5 flex flex-col justify-center lg:justify-between items-end lg:items-start gap-5 lg:gap-10 text-right lg:text-left order-1 lg:order-1 relative pr-3 sm:pr-6 lg:pr-0 pl-1 sm:pl-2 lg:pl-32 z-10">
                                    {/* Título e información */}
                                    <div className="space-y-4 sm:space-y-6">

                                        <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-heading text-white leading-snug sm:leading-[1.15]">
                                            Sayni <br />
                                            Clásico
                                        </h3>

                                        <p className="text-gray-300 text-[11px] sm:text-sm lg:text-lg leading-relaxed max-w-[150px] sm:max-w-[200px] lg:max-w-xs mx-0 font-light font-urbanist">
                                            <span className="sm:hidden">
                                                100% café peruano de Cusco, de tueste oscuro y sabor intenso. Ideal para acompañarte cada día.
                                            </span>
                                            <span className="hidden sm:inline">
                                                100% café peruano, blend de Cusco y tueste oscuro, creado para acompañarte cada día con un sabor intenso y auténtico. Una pausa para recargar el alma y seguir adelante.
                                            </span>
                                        </p>
                                    </div>

                                    {/* Imagen secundaria */}
                                    <div className="relative w-full max-w-[150px] sm:max-w-[200px] lg:max-w-[300px] mx-0">

                                        {/* Línea */}
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

                                {/* Bolsa Clásico */}
                                <div className="col-span-6 lg:col-span-7 flex justify-center items-center h-[300px] sm:h-[360px] lg:h-[480px] order-2 lg:order-2 relative z-10">

                                    <div className="relative h-full w-auto flex items-center justify-center scale-100 sm:scale-101 transition-transform duration-500">
                                        <Image
                                            src="/assets/features/classic_package_.webp"
                                            alt="Sayni Clásico"
                                            width={360}
                                            height={520}
                                            className="h-full w-auto object-contain hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ====================================================== */}
                            {/* CTA B2C */}
                            {/* ====================================================== */}

                            <div className="text-center pt-8">
                                <Link
                                    href="https://wa.me/"
                                    target="_blank"
                                    className="
                                        inline-flex items-center gap-6 bg-[#BCC90F] text-[#132219] font-bold
                                        pl-8 pr-3 py-1 rounded-[100px]
                                        hover:scale-[1.01] active:scale-[0.98]
                                        transition-all duration-300 group text-base sm:text-lg relative
                                        border-t border-white/40
                                        shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.2)]
                                    "
                                >
                                    <span className="font-urbanist tracking-wide select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.15)] pr-1">
                                        Solicita información
                                    </span>

                                    <span
                                        className="
                                            bg-[#132219] text-[#BCC90F] rounded-full w-12 h-12
                                            flex items-center justify-center
                                            transition-transform group-hover:scale-105 shrink-0
                                            shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.15)]
                                        "
                                    >
                                        <svg
                                            className="w-5 h-5 fill-current"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                        </svg>
                                    </span>
                                </Link>
                            </div>
                        </motion.div>
                    )}

                    {/* ========================================================== */}
                    {/* VISTA 2: PARA TU NEGOCIO */}
                    {/* ========================================================== */}

                    {activeTab === "b2b" && (
                        <motion.div
                            key="b2b-tab"
                            variants={tabContentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-10 pt-6 max-w-4xl mx-auto text-center relative"
                        >

                            {/* DEGRADADO AMBIENTAL OVALADO - CENTRADO */}
                            <div
                                className="
                                    absolute top-1/2 left-1/2
                                    -translate-x-1/2 -translate-y-1/2
                                    w-[180%] h-[160%]
                                    sm:w-[160%] sm:h-[150%]
                                    lg:w-[220%] lg:h-[140%]
                                    pointer-events-none opacity-80
                                    blur-[140px] sm:blur-[170px] lg:blur-[200px]
                                    -z-10 rotate-0 transform-gpu
                                "
                                style={{
                                    background:
                                        "radial-gradient(ellipse at center, rgba(23,46,32,0.95) 0%, rgba(23,46,32,0.4) 45%, rgba(0,0,0,0) 75%)",
                                }}
                            />

                            {/* Imagen Principal */}
                            <div className="relative w-full max-w-2xl h-72 sm:h-96 md:h-[420px] mx-auto z-10">
                                <Image
                                    src="/assets/features/sayni-package.webp"
                                    alt="Pack Cofre Sayni B2B"
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2 relative z-10">
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

                            {/* CTA B2B */}
                            <div className="pt-6 font-urbanist relative z-10">
                                <Link
                                    href="https://wa.me/"
                                    target="_blank"
                                    className="
                                        inline-flex items-center gap-6 bg-[#BCC90F] text-[#132219] font-bold
                                        pl-8 pr-3 py-1 rounded-[100px]
                                        hover:scale-[1.01] active:scale-[0.98]
                                        transition-all duration-300 group text-base sm:text-lg
                                        relative cursor-pointer
                                        border-t border-white/40
                                        shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.2)]
                                    "
                                >
                                    <span className="tracking-wide select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.15)] pr-1">
                                        Pide tu Sayni
                                    </span>

                                    <span
                                        className="
                                            bg-[#132219] text-[#BCC90F] rounded-full w-12 h-12
                                            flex items-center justify-center
                                            transition-transform group-hover:scale-105 shrink-0
                                            shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.15)]
                                        "
                                    >
                                        <svg
                                            className="w-5 h-5 fill-current"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                        </svg>
                                    </span>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}