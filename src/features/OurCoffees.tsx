"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useCart } from "@/context/CartContext";

type CategoryType = "especialidad" | "comercial";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.18, delayChildren: 0.1 },
    },
};

const itemUpVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.215, 0.61, 0.355, 1] },
    },
};

const tabContentVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3, ease: "easeIn" } },
};

export default function OurCoffees() {
    const [activeCategory, setActiveCategory] = useState<CategoryType>("especialidad");
    const { addToCart } = useCart();

    return (
        <section
            id="cafes"
            className="py-16 sm:py-20 lg:py-28 px-5 sm:px-6 lg:px-16 bg-sayni-black text-sayni-light transition-all duration-500 relative overflow-hidden"
        >
            {/* ILUSTRACIÓN ORNAMENTAL DE FONDO */}
            <div className="absolute -left-20 sm:-left-108 bottom-30 pointer-events-none z-0 opacity-50 md:opacity-50 select-none">
                <Image
                    src="/assets/vector-ornamental-2.svg"
                    alt=""
                    width={500}
                    height={500}
                    className="w-[380px] sm:w-[520px] md:w-[650px] lg:w-[750px] h-auto object-contain rotate-12 origin-bottom-left"
                />
            </div>

            {/* ELLIPSE ILUMINADA CON BLUR
            <div className="absolute -right-10 sm:-right-20 -bottom-10 pointer-events-none z-0 select-none overflow-hidden">
                <Image
                    src="/assets/ellipse.svg"
                    alt=""
                    width={1000}
                    height={650} // Ajusta a la proporción real de tu SVG
                    className="w-[800px] sm:w-[1100px] lg:w-[1300px] h-auto object-contain origin-bottom-right opacity-80"
                    priority
                />
            </div>*/}

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="max-w-5xl mx-auto space-y-16 relative z-20"
            >
                {/* ENCABEZADO */}
                <motion.div variants={itemUpVariants} className="text-center space-y-6 relative z-20">
                    <div className="space-y-3">
                        <div className="flex items-center justify-center gap-3">
                            <span className="h-[1px] w-12 sm:w-16 bg-white/20" />
                            <span className="text-sayni-lime font-heading tracking-widest text-xs sm:text-sm uppercase font-medium">Nuestros cafés</span>
                            <span className="h-[1px] w-12 sm:w-16 bg-white/20" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white tracking-wide">
                            Dos cafés <br />Una misma esencia
                        </h2>
                    </div>

                    {/* TOGGLE */}
                    <div
                        role="tablist"
                        aria-label="Categorías de café"
                        className="relative inline-grid grid-cols-2 p-1.5 bg-[#151f15] border border-white/15 rounded-full shadow-[inset_0_3px_8px_rgba(0,0,0,0.7)] backdrop-blur-md select-none w-full max-w-[360px] font-urbanist"
                    >
                        <div className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-[#BCC90F] rounded-full border-t border-white/40 shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_4px_10px_rgba(0,0,0,0.4)] transition-transform duration-300 ease-out pointer-events-none z-0 ${activeCategory === "especialidad" ? "translate-x-0" : "translate-x-full"}`} />
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeCategory === "especialidad"}
                            onClick={() => setActiveCategory("especialidad")}
                            className={`relative z-10 flex items-center justify-center py-2 px-3 rounded-full text-sm sm:text-base font-bold transition-colors duration-300 cursor-pointer text-center ${activeCategory === "especialidad" ? "text-[#132219]" : "text-white/80 hover:text-white"}`}
                        >
                            De especialidad
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeCategory === "comercial"}
                            onClick={() => setActiveCategory("comercial")}
                            className={`relative z-10 flex items-center justify-center py-2 px-3 rounded-full text-sm sm:text-base font-bold transition-colors duration-300 cursor-pointer text-center ${activeCategory === "comercial" ? "text-[#132219]" : "text-white/80 hover:text-white"}`}
                        >
                            Comercial
                        </button>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">

                    {/* ══════════════════════════════════════════ */}
                    {/* PESTAÑA 1: DE ESPECIALIDAD                */}
                    {/* ══════════════════════════════════════════ */}
                    {activeCategory === "especialidad" && (
                        <motion.div key="especialidad-tab" variants={tabContentVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8 sm:space-y-20 pt-4">

                            {/* ITEM 1: GEISHA 250g — bolsa IZQUIERDA */}
                            <div className="grid grid-cols-2 lg:grid-cols-12 gap-2 md:gap-6 lg:gap-0 items-center justify-center relative md:max-w-xl md:mx-auto lg:max-w-none">

                                {/* BOLSA — izquierda */}
                                <div className="col-span-1 lg:col-span-6 flex justify-center md:justify-center lg:justify-end items-center min-h-[200px] sm:min-h-[400px] lg:min-h-0 h-full lg:mr-2 relative py-2 lg:py-4">
                                    <Image
                                        src="/assets/features/geisha_package_250.webp"
                                        alt="Sayni Geisha 250g"
                                        width={340} height={480}
                                        className="max-h-[220px] sm:max-h-full w-auto object-contain hover:scale-105 transition-transform duration-500"
                                        priority
                                    />
                                </div>

                                {/* INFO — derecha */}
                                <div className="col-span-1 lg:col-span-6 flex flex-col justify-center items-start gap-3 lg:gap-5 text-left font-urbanist md:pl-2 lg:pl-4 py-2 lg:py-4">
                                    <div>
                                        <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-heading text-white tracking-wide">
                                            Sayni <br />
                                            Geisha{" "}
                                            <span className="text-sm sm:text-lg font-normal text-[#BCC90F] ml-1">250g</span>
                                        </h3>
                                        <p className="mt-1 lg:mt-2 text-lg sm:text-2xl font-bold text-[#BCC90F]">S/ 50.00</p>

                                        {/* Descripción — solo desktop */}
                                        <p className="mt-3 text-white text-sm sm:text-base leading-relaxed max-w-[340px] font-light hidden lg:block">
                                            Geisha de altura en presentación de 250g (solo en grano entero), 87 puntos SCA certificados por Q-Grader. Cultivado a +2,000 msnm en Inkawasi, Cusco. Lavado y de tueste medio, con notas de jazmín, cítricos y frutas rojas.
                                        </p>

                                        {/* Ficha técnica — siempre visible */}
                                        <a href="/ficha-tecnica-geisha.pdf" download className="inline-block mt-2 text-[#BCC90F] text-xs sm:text-sm underline underline-offset-4 transition-colors">
                                            Descargar ficha técnica
                                        </a>
                                    </div>

                                    {/* Imagen grano — solo desktop */}
                                    <div className="relative w-full max-w-[200px] sm:max-w-[240px] hidden lg:block">
                                        <span className="hidden lg:block absolute right-full top-1/2 -translate-y-1/2 w-20 lg:w-18 h-[1px] bg-[#BCC90F] pointer-events-none -z-10" />
                                        <div className="relative z-10 aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-[#132219]">
                                            <Image src="/assets/features/geisha-grain.webp" alt="Sayni Geisha Detalle" fill className="object-cover" />
                                        </div>
                                    </div>

                                    {/* Botón */}
                                    <div className="pt-0 lg:pt-1">
                                        <button
                                            type="button"
                                            onClick={() => addToCart({ id: "geisha-250", title: "Sayni Geisha (Grano)", weight: "250g", price: 50.00, quantity: 1, image: "/assets/features/geisha_package_250.webp" })}
                                            className="inline-flex mt-3 items-center gap-2 sm:gap-4 bg-[#BCC90F] text-[#132219] font-bold pl-4 sm:pl-6 pr-2 py-1.5 sm:py-2 rounded-[100px] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-xs sm:text-base cursor-pointer border-t border-white/40 shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4)]"
                                        >
                                            <span className="tracking-wide select-none hidden sm:inline">Añadir al carrito</span>
                                            <span className="tracking-wide select-none sm:hidden">Añadir</span>
                                            <span className="bg-[#132219] text-[#BCC90F] rounded-full w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center shrink-0">
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.89-2-1.99-2z" /></svg>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* ITEM 2: GEISHA 500g — bolsa DERECHA */}
                            <div className="grid grid-cols-2 lg:grid-cols-12 gap-2 md:gap-6 lg:gap-0 items-center justify-center relative md:max-w-xl md:mx-auto lg:max-w-none">

                                {/* INFO — izquierda */}
                                <div className="col-span-1 lg:col-span-6 flex flex-col justify-center items-end gap-3 lg:gap-5 text-right font-urbanist md:pr-2 lg:pr-8 py-2 lg:py-4">
                                    <div className="flex flex-col items-end">
                                        <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-heading text-white tracking-wide">
                                            Sayni <br />
                                            <span className="text-sm sm:text-lg font-normal text-[#BCC90F] mr-1">500g</span>{" "}Geisha
                                        </h3>
                                        <p className="mt-1 lg:mt-2 text-lg sm:text-2xl font-bold text-[#BCC90F]">S/ 95.00</p>

                                        {/* Descripción — solo desktop */}
                                        <p className="mt-3 text-white text-sm sm:text-base leading-relaxed max-w-[340px] font-light hidden lg:block">
                                            Geisha de altura en presentación de 500g (solo en grano entero), 87 puntos SCA certificados por Q-Grader. Cultivado a +2,000 msnm en Inkawasi, Cusco. Lavado y de tueste medio.
                                        </p>

                                        {/* Ficha técnica — siempre visible */}
                                        <a href="/ficha-tecnica-geisha.pdf" download className="inline-block mt-2 text-[#BCC90F] text-xs sm:text-sm underline underline-offset-4 transition-colors">
                                            Descargar ficha técnica
                                        </a>
                                    </div>

                                    {/* Imagen grano — solo desktop */}
                                    <div className="relative w-full max-w-[200px] sm:max-w-[240px] hidden lg:block">
                                        <span className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 w-16 lg:w-20 h-[1px] bg-[#BCC90F] pointer-events-none -z-10" />
                                        <div className="relative z-10 aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-[#132219]">
                                            <Image src="/assets/features/geisha-grain.webp" alt="Sayni Geisha Detalle" fill className="object-cover" />
                                        </div>
                                    </div>

                                    {/* Botón — alineado a la derecha */}
                                    <div className="pt-0 lg:pt-1 self-end">
                                        <button
                                            type="button"
                                            onClick={() => addToCart({ id: "geisha-500", title: "Sayni Geisha (Grano)", weight: "500g", price: 95.00, quantity: 1, image: "/assets/features/geisha_package_500.webp" })}
                                            className="inline-flex mt-3 items-center gap-2 sm:gap-4 bg-[#BCC90F] text-[#132219] font-bold pl-4 sm:pl-6 pr-2 py-1.5 sm:py-2 rounded-[100px] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-xs sm:text-base cursor-pointer border-t border-white/40 shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4)]"
                                        >
                                            <span className="tracking-wide select-none hidden sm:inline">Añadir al carrito</span>
                                            <span className="tracking-wide select-none sm:hidden">Añadir</span>
                                            <span className="bg-[#132219] text-[#BCC90F] rounded-full w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center shrink-0">
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.89-2-1.99-2z" /></svg>
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                {/* BOLSA 500g — derecha */}
                                <div className="col-span-1 lg:col-span-6 flex justify-center md:justify-center lg:justify-start items-center min-h-[240px] sm:min-h-[400px] lg:min-h-0 h-full lg:pl-4 py-2 lg:py-4">
                                    <Image
                                        src="/assets/features/geisha_package_500.webp"
                                        alt="Sayni Geisha 500g"
                                        width={340}
                                        height={480}
                                        className="max-h-[260px] sm:max-h-full w-auto object-contain scale-110 sm:scale-100 hover:scale-103 transition-transform duration-500"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ══════════════════════════════════════════ */}
                    {/* PESTAÑA 2: COMERCIAL                      */}
                    {/* ══════════════════════════════════════════ */}
                    {activeCategory === "comercial" && (
                        <motion.div key="comercial-tab" variants={tabContentVariants} initial="hidden" animate="visible" exit="exit" className="space-y-16 sm:space-y-24 pt-4">

                            {/* PACK OCASIÓN ESPECIAL */}
                            <div className="max-w-3xl mx-auto text-center space-y-6 relative bg-[#182a1f] p-6 sm:p-10 rounded-3xl border border-[#BCC90F]/30 shadow-2xl">
                                <div className="inline-flex items-center justify-center gap-2 bg-[#BCC90F] text-[#132219] font-bold text-xs sm:text-sm uppercase tracking-wider px-4 py-2 rounded-full shadow-md leading-none">
                                    <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
                                        <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.67C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1h-2.12l.41-.55C13.61 4.9 14.26 4 15 4zM9 4c.74 0 1.39.9 1.71 1.45l.41.55H9c-.55 0-1-.45-1-1s.45-1 1-1zm11 15H4V13h7v6h2v-6h7v6zm0-8H4V8h16v3z" />
                                    </svg>
                                    <span className="translate-y-[0.5px]">
                                        Ideal para ocasiones especiales
                                    </span>
                                </div>
                                <h3 className="text-3xl sm:text-4xl font-bold font-heading text-[#ffffff] tracking-wide">Pack Ocasión Especial</h3>
                                <p className="text-3xl font-bold text-[#BCC90F]">S/ 99.90</p>
                                <div className="relative w-full h-64 sm:h-80 md:h-[320px] mx-auto">
                                    <Image src="/assets/features/sayni-package.webp" alt="Pack Ocasión Especial Sayni" fill className="object-contain" />
                                </div>
                                <div className="flex flex-wrap items-center justify-center font-urbanist gap-3 sm:gap-0">
                                    <div className="flex flex-col items-center px-4 py-2">
                                        <div className="bg-[#BCC90F] text-black font-bold px-5 py-1.5 rounded-lg text-sm sm:text-base shadow-sm">4 Bolsas Sayni Clásico</div>
                                        <p className="text-gray-300 text-xs mt-2 text-center">220g c/u - blend cusqueño</p>
                                    </div>
                                    <div className="hidden sm:block h-12 w-[1px] bg-white/20 mx-1" />
                                    <div className="flex flex-col items-center px-4 py-2">
                                        <div className="bg-[#BCC90F] text-black font-bold px-5 py-1.5 rounded-lg text-sm sm:text-base shadow-sm">1 Caja Diseño Premium</div>
                                        <p className="text-gray-300 text-xs mt-2 text-center">Verde andino con detalles dorados</p>
                                    </div>
                                    <div className="hidden sm:block h-12 w-[1px] bg-white/20 mx-1" />
                                    <div className="flex flex-col items-center px-4 py-2">
                                        <div className="bg-[#BCC90F] text-black font-bold px-5 py-1.5 rounded-lg text-sm sm:text-base shadow-sm">1 Tarjeta Especial</div>
                                        <p className="text-gray-300 text-xs mt-2 text-center">Con mensaje predeterminado e impresos "Para/De"</p>
                                    </div>
                                </div>
                                <div className="pt-2 font-urbanist flex flex-col items-center gap-4">
                                    <p className="text-white text-xs sm:text-sm max-w-[420px] font-light leading-relaxed">
                                        El detalle perfecto listo para regalar. Incluye tarjeta especial de 11x8 cm con el mensaje inspirador de Sayni.
                                        <a href="/ficha-tecnica-clasico.pdf" download className="inline-block ml-2 text-[#BCC90F] underline underline-offset-4 transition-colors">Descargar ficha técnica</a>
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => addToCart({ id: "pack-regalo-clasico", title: "Pack Ocasión Especial", weight: "4 Bolsas 220g + Estuche + Tarjeta", price: 99.90, quantity: 1, image: "/assets/features/sayni-package.webp" })}
                                        className="inline-flex items-center gap-2 sm:gap-4 bg-[#BCC90F] text-[#132219] font-bold mt-2 pl-5 sm:pl-8 pr-2 sm:pr-3 py-2.5 sm:py-3 rounded-[100px] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group text-[11px] sm:text-lg cursor-pointer border-t border-white/40 shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4)]"
                                    >
                                        <span className="tracking-wide select-none sm:hidden">
                                            Añadir por S/ 99.90
                                        </span>
                                        <span className="tracking-wide select-none hidden sm:inline">
                                            Añadir al carrito — S/ 99.90
                                        </span>
                                        <span className="bg-[#132219] text-[#BCC90F] rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.89-2-1.99-2z" /></svg>
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* PACK X4 CLÁSICO */}
                            <div className="grid grid-cols-2 lg:grid-cols-12 gap-2 md:gap-6 lg:gap-0 items-center justify-center relative pt-6 md:max-w-xl md:mx-auto lg:max-w-none">

                                {/* BOLSA — izquierda */}
                                <div className="col-span-1 lg:col-span-6 flex justify-center md:justify-center lg:justify-end items-center min-h-[200px] sm:min-h-[360px] lg:min-h-0 h-full lg:mr-2 relative py-2 lg:py-4">
                                    <Image
                                        src="/assets/features/classic_package_250.webp"
                                        alt="Pack x4 Sayni Clásico 220g"
                                        width={320} height={440}
                                        className="max-h-[220px] sm:max-h-full w-auto object-contain hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* INFO — derecha */}
                                <div className="col-span-1 lg:col-span-6 flex flex-col justify-center items-start gap-3 lg:gap-5 text-left font-urbanist md:pl-2 lg:pl-6 py-2 lg:py-4">
                                    <div>
                                        <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-heading text-white tracking-wide">
                                            Pack x4 <br />
                                            Sayni Clásico{" "}
                                            <span className="text-sm sm:text-lg font-normal text-[#BCC90F] ml-1">(220g c/u)</span>
                                        </h3>
                                        <p className="mt-1 lg:mt-2 text-lg sm:text-2xl font-bold text-[#BCC90F]">S/ 89.90</p>

                                        {/* Descripción — solo desktop */}
                                        <p className="mt-3 text-white text-sm sm:text-base leading-relaxed max-w-[340px] font-light hidden lg:block">
                                            Pack de 4 bolsas de Sayni Clásico 220g (sin estuche ni tarjeta). Ideal para el consumo diario en casa o en la oficina. Blend 100% cusqueño de tueste oscuro con sabor intenso.
                                        </p>

                                        {/* Ficha técnica — siempre visible */}
                                        <a href="/ficha-tecnica-clasico.pdf" download className="inline-block mt-2 text-[#BCC90F] text-xs sm:text-sm underline underline-offset-4 transition-colors">
                                            Descargar ficha técnica
                                        </a>
                                    </div>

                                    {/* Imagen detalle grano con LÍNEA DECORATIVA — solo desktop */}
                                    <div className="relative w-full max-w-[200px] sm:max-w-[240px] hidden lg:block">
                                        <span className="hidden lg:block absolute right-full top-1/2 -translate-y-1/2 w-20 lg:w-18 h-[1px] bg-[#BCC90F] pointer-events-none -z-10" />
                                        <div className="relative z-10 aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-[#132219]">
                                            <Image src="/assets/features/geisha-grain.webp" alt="Sayni Clásico Detalle" fill className="object-cover" />
                                        </div>
                                    </div>

                                    {/* Botón */}
                                    <div className="pt-0 lg:pt-2">
                                        <button
                                            type="button"
                                            onClick={() => addToCart({ id: "pack-clasico-4x", title: "Pack x4 Sayni Clásico", weight: "4 Bolsas 220g", price: 89.90, quantity: 1, image: "/assets/features/classic_package_250.webp" })}
                                            className="inline-flex mt-3 items-center gap-2 sm:gap-4 bg-[#BCC90F] text-[#132219] font-bold pl-4 sm:pl-6 pr-2 py-1.5 sm:py-2.5 rounded-[100px] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-xs sm:text-base cursor-pointer border-t border-white/40 shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4)]"
                                        >
                                            <span className="tracking-wide select-none hidden sm:inline">Añadir al carrito</span>
                                            <span className="tracking-wide select-none sm:hidden">Añadir</span>
                                            <span className="bg-[#132219] text-[#BCC90F] rounded-full w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center shrink-0">
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.89-2-1.99-2z" /></svg>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}