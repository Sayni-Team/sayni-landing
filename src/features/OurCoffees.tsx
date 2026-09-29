"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useCart } from "@/context/CartContext";

type CategoryType = "especialidad" | "comercial";

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

const itemUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.215, 0.61, 0.355, 1],
        },
    },
};

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
    const [activeCategory, setActiveCategory] =
        useState<CategoryType>("especialidad");

    const { addToCart } = useCart();

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
                className="max-w-5xl mx-auto space-y-16 relative z-10"
            >
                {/* ENCABEZADO CON SWITCH */}
                <motion.div
                    variants={itemUpVariants}
                    className="text-center space-y-6"
                >
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
                        <div
                            className={`
                                absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-[#BCC90F] rounded-full
                                border-t border-white/40
                                shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_4px_10px_rgba(0,0,0,0.4)]
                                transition-transform duration-300 ease-out pointer-events-none z-0
                                ${activeCategory === "especialidad"
                                ? "translate-x-0"
                                : "translate-x-full"
                            }
                            `}
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setActiveCategory("especialidad")
                            }
                            className={`
                                relative z-10 flex items-center justify-center py-2 px-3 rounded-full
                                text-sm sm:text-base font-bold transition-colors duration-300
                                cursor-pointer text-center
                                ${activeCategory === "especialidad"
                                ? "text-[#132219]"
                                : "text-white/80 hover:text-white"
                            }
                            `}
                        >
                            De especialidad
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setActiveCategory("comercial")
                            }
                            className={`
                                relative z-10 flex items-center justify-center py-2 px-3 rounded-full
                                text-sm sm:text-base font-bold transition-colors duration-300
                                cursor-pointer text-center
                                ${activeCategory === "comercial"
                                ? "text-[#132219]"
                                : "text-white/80 hover:text-white"
                            }
                            `}
                        >
                            Comercial
                        </button>
                    </div>
                </motion.div>

                {/* CONTENIDO CON ANIMATE PRESENCE */}
                <AnimatePresence mode="wait">

                    {/* ========================================================== */}
                    {/* PESTAÑA 1: DE ESPECIALIDAD */}
                    {/* ========================================================== */}

                    {activeCategory === "especialidad" && (
                        <motion.div
                            key="especialidad-tab"
                            variants={tabContentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-8 sm:space-y-12 pt-4"
                        >

                            {/* ====================================================== */}
                            {/* ITEM 1: SAYNI GEISHA 250g - BOLSA IZQUIERDA */}
                            {/* ====================================================== */}

                            <div className="grid grid-cols-12 gap-0 items-center justify-center relative">

                                {/* Bolsa */}
                                <div className="col-span-12 lg:col-span-6 flex justify-center lg:justify-end items-center h-[340px] sm:h-[400px] lg:h-[460px] mr-2 relative">
                                    <Image
                                        src="/assets/features/geisha_package_250.webp"
                                        alt="Sayni Geisha 250g"
                                        width={340}
                                        height={480}
                                        className="h-full w-auto object-contain hover:scale-105 transition-transform duration-500"
                                        priority
                                    />
                                </div>

                                {/* Información */}
                                <div className="col-span-12 lg:col-span-6 flex flex-col justify-center gap-5 text-left font-urbanist lg:pl-4">

                                    <div>
                                        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white tracking-wide">
                                            Sayni <br />
                                            Geisha{" "}
                                            <span className="text-base sm:text-lg font-normal text-[#BCC90F] ml-2">
                                                250g
                                            </span>
                                        </h3>

                                        <p className="mt-3 text-gray-300 text-sm sm:text-base leading-relaxed max-w-[320px] font-light">
                                            Café de todos los días. Un café peruano con alma andina para tu pausa diaria. Blend de origen Cusco (Inkawasi, La Convención), de tueste oscuro y sabor intenso. Haz una pausa, recarga el alma y sigue adelante.

                                            <a
                                                href="/ficha-tecnica-geisha.pdf"
                                                download
                                                className="inline-block ml-2 text-[#BCC90F] underline underline-offset-4 transition-colors"
                                            >
                                                Descargar ficha técnica
                                            </a>
                                        </p>
                                    </div>

                                    {/* Imagen secundaria */}
                                    <div className="relative w-full max-w-[200px] sm:max-w-[240px]">
                                        <span className="hidden lg:block absolute right-full top-1/2 -translate-y-1/2 w-20 lg:w-18 h-[1px] bg-[#BCC90F] pointer-events-none" />

                                        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                                            <Image
                                                src="/assets/features/geisha-grain.webp"
                                                alt="Sayni Geisha Detalle"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Botón */}
                                    <div className="pt-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                addToCart({
                                                    id: "geisha-250",
                                                    title: "Sayni Geisha",
                                                    weight: "250g",
                                                    price: 45.00,
                                                    quantity: 1, // <--- Agregar aquí
                                                    image: "/assets/features/geisha_package_250.webp",
                                                })
                                            }
                                            className="
                                                inline-flex items-center gap-4 bg-[#BCC90F] text-[#132219] font-bold
                                                pl-6 pr-2 py-2 rounded-[100px] hover:scale-[1.02] active:scale-[0.98]
                                                transition-all duration-300 group text-sm sm:text-base cursor-pointer
                                                border-t border-white/40
                                                shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4)]
                                            "
                                        >
                                            <span className="tracking-wide select-none">
                                                Añadir al carrito
                                            </span>

                                            <span className="bg-[#132219] text-[#BCC90F] rounded-full w-9 h-9 flex items-center justify-center shrink-0">
                                                <svg
                                                    className="w-5 h-5 fill-current"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.89-2-1.99-2z" />
                                                </svg>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* ====================================================== */}
                            {/* ITEM 2: SAYNI GEISHA 500g - BOLSA DERECHA */}
                            {/* ====================================================== */}

                            <div className="grid grid-cols-12 gap-0 items-center justify-center relative">

                                {/* Información */}
                                <div className="col-span-12 lg:col-span-6 flex flex-col justify-center items-start lg:items-end gap-5 text-left lg:text-right font-urbanist order-2 lg:order-1 lg:pr-8">

                                    <div className="flex flex-col items-start lg:items-end">

                                        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white tracking-wide">
                                            Sayni <br />
                                            Geisha{" "}
                                            <span className="text-base sm:text-lg font-normal text-[#BCC90F] ml-2">
                                                500g
                                            </span>
                                        </h3>

                                        <p className="mt-3 text-gray-300 text-sm sm:text-base leading-relaxed max-w-[320px] font-light">
                                            Café de todos los días. Un café peruano con alma andina para tu pausa diaria. Blend de origen Cusco (Inkawasi, La Convención), de tueste oscuro y sabor intenso. Haz una pausa, recarga el alma y sigue adelante.

                                            <a
                                                href="/ficha-tecnica-geisha.pdf"
                                                download
                                                className="inline-block ml-2 text-[#BCC90F] underline underline-offset-4 transition-colors"
                                            >
                                                Descargar ficha técnica
                                            </a>
                                        </p>
                                    </div>

                                    {/* Imagen secundaria */}
                                    <div className="relative w-full max-w-[200px] sm:max-w-[240px]">

                                        <span className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 w-16 lg:w-20 h-[1px] bg-[#BCC90F] pointer-events-none" />

                                        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                                            <Image
                                                src="/assets/features/geisha-grain.webp"
                                                alt="Sayni Geisha Detalle"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Botón */}
                                    <div className="pt-1 self-start lg:self-end">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                addToCart({
                                                    id: "geisha-500",
                                                    title: "Sayni Geisha",
                                                    weight: "500g",
                                                    price: 80.00,
                                                    quantity: 1, // <--- Agregar aquí
                                                    image: "/assets/features/geisha_package_500.webp",
                                                })
                                            }
                                            className="
                                                inline-flex items-center gap-4 bg-[#BCC90F] text-[#132219] font-bold
                                                pl-6 pr-2 py-2 rounded-[100px] hover:scale-[1.02] active:scale-[0.98]
                                                transition-all duration-300 group text-sm sm:text-base cursor-pointer
                                                border-t border-white/40
                                                shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4)]
                                            "
                                        >
                                            <span className="tracking-wide select-none">
                                                Añadir al carrito
                                            </span>

                                            <span className="bg-[#132219] text-[#BCC90F] rounded-full w-9 h-9 flex items-center justify-center shrink-0">
                                                <svg
                                                    className="w-5 h-5 fill-current"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.89-2-1.99-2z" />
                                                </svg>
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Bolsa derecha */}
                                <div className="col-span-12 lg:col-span-6 flex justify-center lg:justify-start items-center h-[340px] sm:h-[400px] lg:h-[460px] order-1 lg:order-2 lg:pl-4">
                                    <Image
                                        src="/assets/features/geisha_package_500.webp"
                                        alt="Sayni Geisha 500g"
                                        width={340}
                                        height={480}
                                        className="h-full w-auto object-contain hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ========================================================== */}
                    {/* PESTAÑA 2: COMERCIAL */}
                    {/* ========================================================== */}

                    {activeCategory === "comercial" && (
                        <motion.div
                            key="comercial-tab"
                            variants={tabContentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="space-y-8 sm:space-y-12 pt-4"
                        >

                            {/* ITEM 1: PACK COFRE SAYNI B2B */}
                            <div className="max-w-3xl mx-auto text-center space-y-8">

                                <div className="relative w-full h-72 sm:h-96 md:h-[380px] mx-auto">
                                    <Image
                                        src="/assets/features/sayni-package.webp"
                                        alt="Pack Cofre Sayni"
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                <div className="flex flex-wrap items-center justify-center font-urbanist">

                                    {/* Ítem 1 */}
                                    <div className="flex flex-col items-center px-6 py-2">
                                        <div className="bg-[#b3ca14] text-black font-bold px-6 py-2 rounded-lg text-base sm:text-lg shadow-sm">
                                            4 Bolsas Sayni
                                        </div>
                                        <p className="text-gray-300 text-xs sm:text-sm mt-3 text-center">
                                            Clásico 220g c/u - tueste oscuro
                                        </p>
                                    </div>

                                    {/* Separador vertical */}
                                    <div className="hidden sm:block h-16 w-[1px] bg-white/20 mx-2" />

                                    {/* Ítem 2 */}
                                    <div className="flex flex-col items-center px-6 py-2">
                                        <div className="bg-[#b3ca14] text-black font-bold px-6 py-2 rounded-lg text-base sm:text-lg shadow-sm">
                                            1 Prensa Francesa
                                        </div>
                                        <p className="text-gray-300 text-xs sm:text-sm mt-3 text-center">
                                            350 ml - portátil
                                        </p>
                                    </div>

                                    {/* Separador vertical */}
                                    <div className="hidden sm:block h-16 w-[1px] bg-white/20 mx-2" />

                                    {/* Ítem 3 */}
                                    <div className="flex flex-col items-center px-6 py-2">
                                        <div className="bg-[#b3ca14] text-black font-bold px-6 py-2 rounded-lg text-base sm:text-lg shadow-sm">
                                            1 Estuche cofre
                                        </div>
                                        <p className="text-gray-300 text-xs sm:text-sm mt-3 text-center">
                                            Verde andino dorado
                                        </p>
                                    </div>

                                </div>

                                <div className="pt-2 font-urbanist flex flex-col items-center gap-3">

                                    <p className="text-gray-300 text-sm max-w-[320px] font-light">
                                        Empaque corporativo listo para regalar o para tu negocio.

                                        <a
                                            href="/ficha-tecnica-clasico.pdf"
                                            download
                                            className="inline-block ml-2 text-[#BCC90F] underline underline-offset-4 transition-colors"
                                        >
                                            Descargar ficha técnica
                                        </a>
                                    </p>

                                    <Link
                                        href="https://wa.me/"
                                        target="_blank"
                                        className="
                                            inline-flex items-center gap-6 bg-[#BCC90F] text-[#132219] font-bold mt-5 mb-8
                                            pl-8 pr-3 py-1.5 rounded-[100px]
                                            hover:scale-[1.01] active:scale-[0.98]
                                            transition-all duration-300 group text-base sm:text-lg
                                            border-t border-white/40
                                            shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4)]
                                        "
                                    >
                                        <span className="tracking-wide select-none pr-1">
                                            Pide tu Sayni
                                        </span>

                                        <span className="bg-[#132219] text-[#BCC90F] rounded-full w-10 h-10 flex items-center justify-center shrink-0">
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

                            {/* ====================================================== */}
                            {/* ITEM 2: SAYNI CLÁSICO 250g - BOLSA DERECHA */}
                            {/* ====================================================== */}

                            <div className="grid grid-cols-12 gap-0 items-center justify-center relative">

                                {/* Información */}
                                <div className="col-span-12 lg:col-span-6 flex flex-col justify-center items-start lg:items-end gap-5 text-left lg:text-right font-urbanist order-2 lg:order-1 lg:pr-8">

                                    <div className="flex flex-col items-start lg:items-end">

                                        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white tracking-wide">
                                            Sayni <br />
                                            Clásico{" "}
                                            <span className="text-base sm:text-lg font-normal text-[#BCC90F] ml-2">
                                                250g
                                            </span>
                                        </h3>

                                        <p className="mt-3 text-gray-300 text-sm sm:text-base leading-relaxed max-w-[320px] font-light">
                                            100% café peruano, blend de Cusco y tueste oscuro, creado para acompañarte cada día con un sabor intenso y auténtico. Una pausa para recargar el alma y seguir adelante.

                                            <a
                                                href="/ficha-tecnica-clasico.pdf"
                                                download
                                                className="inline-block ml-2 text-[#BCC90F] underline underline-offset-4 transition-colors"
                                            >
                                                Descargar ficha técnica
                                            </a>
                                        </p>
                                    </div>

                                    {/* Imagen secundaria */}
                                    <div className="relative w-full max-w-[200px] sm:max-w-[240px]">

                                        <span className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 w-16 lg:w-20 h-[1px] bg-[#BCC90F] pointer-events-none" />

                                        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                                            <Image
                                                src="/assets/features/classic-grain.webp"
                                                alt="Sayni Clásico Detalle"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Botón */}
                                    <div className="pt-1 self-start lg:self-end">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                addToCart({
                                                    id: "clasico-250",
                                                    title: "Sayni Clásico",
                                                    weight: "250g",
                                                    price: 35.00,
                                                    quantity: 1, // <--- Agregar aquí
                                                    image: "/assets/features/classic_package_250.webp",
                                                })
                                            }
                                            className="
                                                inline-flex items-center gap-4 bg-[#BCC90F] text-[#132219] font-bold
                                                pl-6 pr-2 py-2 rounded-[100px] hover:scale-[1.02] active:scale-[0.98]
                                                transition-all duration-300 group text-sm sm:text-base cursor-pointer
                                                border-t border-white/40
                                                shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4)]
                                            "
                                        >
                                            <span className="tracking-wide select-none">
                                                Añadir al carrito
                                            </span>

                                            <span className="bg-[#132219] text-[#BCC90F] rounded-full w-9 h-9 flex items-center justify-center shrink-0">
                                                <svg
                                                    className="w-5 h-5 fill-current"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.89-2-1.99-2z" />
                                                </svg>
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* Bolsa derecha */}
                                <div className="col-span-12 lg:col-span-6 flex justify-center lg:justify-start items-center h-[340px] sm:h-[400px] lg:h-[460px] order-1 lg:order-2 lg:pl-4">
                                    <Image
                                        src="/assets/features/classic_package_.webp"
                                        alt="Sayni Clásico 250g"
                                        width={340}
                                        height={480}
                                        className="h-full w-auto object-contain hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}