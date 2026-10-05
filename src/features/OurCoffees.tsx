"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useInView, type Variants } from "framer-motion";
import { useCart } from "@/context/CartContext";

type CategoryType = "especialidad" | "comercial";

const EASE = [0.215, 0.61, 0.355, 1] as const;

/* ── Variantes ─────────────────────────────── */

const stagger = (staggerChildren = 0.15, delayChildren = 0): Variants => ({
    hidden: {},
    visible: { transition: { staggerChildren, delayChildren } },
});

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const fadeDown: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const slideFromLeft: Variants = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
};

const slideFromRight: Variants = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
};

const zoomIn: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
};

// Blur reservado para títulos destacados
const blurIn: Variants = {
    hidden: { opacity: 0, y: 12, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: EASE } },
};

// Líneas que se dibujan (el originX se define en cada línea)
const drawLine: Variants = {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1, transition: { duration: 0.8, ease: EASE, delay: 0.3 } },
};

// Tarjeta del pack: crece y luego escalona su contenido
const cardIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: EASE, staggerChildren: 0.12, delayChildren: 0.2 },
    },
};

const ornamentIn: Variants = {
    hidden: { opacity: 0, rotate: -6 },
    visible: { opacity: 0.5, rotate: 0, transition: { duration: 1.4, ease: EASE } },
};

const tabContent: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3, ease: "easeIn" } },
};

/* ── Componente ─────────────────────────────── */

export default function OurCoffees() {
    const [activeCategory, setActiveCategory] = useState<CategoryType>("especialidad");
    const { addToCart } = useCart();

    // Un solo "en vista" para todo: la sección y cada pestaña nueva animan desde aquí
    const sectionRef = useRef<HTMLElement>(null);
    const inView = useInView(sectionRef, { once: true, amount: 0.1 });
    const state = inView ? "visible" : "hidden";

    return (
        <section
            ref={sectionRef}
            id="cafes"
            className="relative overflow-hidden bg-sayni-black px-5 py-16 text-sayni-light sm:px-6 sm:py-20 lg:px-16 lg:py-28"
        >
            {/* ILUSTRACIÓN ORNAMENTAL DE FONDO */}
            <motion.div
                variants={ornamentIn}
                initial="hidden"
                animate={state}
                className="pointer-events-none absolute -left-60 bottom-0 z-0 select-none sm:-left-78 lg:-left-124"
            >
                <Image
                    src="/assets/vector-ornamental-2.svg"
                    alt=""
                    width={500}
                    height={500}
                    className="h-auto w-[380px] origin-bottom-left rotate-12 object-contain sm:w-[520px] md:w-[650px] lg:w-[750px]"
                />
            </motion.div>

            <motion.div
                variants={stagger(0.18, 0.1)}
                initial="hidden"
                animate={state}
                className="relative z-20 mx-auto max-w-5xl space-y-16"
            >
                {/* ENCABEZADO */}
                <motion.div variants={stagger(0.15)} className="relative z-20 space-y-6 text-center">
                    <div className="space-y-3">
                        <motion.div variants={fadeDown} className="flex items-center justify-center gap-3">
                            <motion.span variants={drawLine} style={{ originX: 1 }} className="h-px w-12 bg-white/20 sm:w-16" />
                            <span className="font-heading text-xs font-medium uppercase tracking-widest text-sayni-lime sm:text-sm">
                                Nuestros cafés
                            </span>
                            <motion.span variants={drawLine} style={{ originX: 0 }} className="h-px w-12 bg-white/20 sm:w-16" />
                        </motion.div>

                        <motion.h2
                            variants={blurIn}
                            className="font-heading text-3xl font-bold tracking-wide text-white sm:text-4xl lg:text-5xl"
                        >
                            Dos cafés <br />Una misma esencia
                        </motion.h2>
                    </div>

                    {/* TOGGLE */}
                    <motion.div
                        variants={zoomIn}
                        role="tablist"
                        aria-label="Categorías de café"
                        className="relative inline-grid w-full max-w-[360px] select-none grid-cols-2 rounded-full border border-white/15 bg-[#151f15] p-1.5 font-urbanist shadow-[inset_0_3px_8px_rgba(0,0,0,0.7)] backdrop-blur-md"
                    >
                        <div
                            className={`pointer-events-none absolute bottom-1.5 left-1.5 top-1.5 z-0 w-[calc(50%-6px)] rounded-full border-t border-white/40 bg-[#BCC90F] shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_4px_10px_rgba(0,0,0,0.4)] transition-[translate] duration-300 ease-out ${activeCategory === "especialidad" ? "translate-x-0" : "translate-x-full"}`}
                        />
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeCategory === "especialidad"}
                            onClick={() => setActiveCategory("especialidad")}
                            className={`relative z-10 flex cursor-pointer items-center justify-center rounded-full px-3 py-2 text-center text-sm font-bold transition-colors duration-300 sm:text-base ${activeCategory === "especialidad" ? "text-[#132219]" : "text-white/80 hover:text-white"}`}
                        >
                            De especialidad
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeCategory === "comercial"}
                            onClick={() => setActiveCategory("comercial")}
                            className={`relative z-10 flex cursor-pointer items-center justify-center rounded-full px-3 py-2 text-center text-sm font-bold transition-colors duration-300 sm:text-base ${activeCategory === "comercial" ? "text-[#132219]" : "text-white/80 hover:text-white"}`}
                        >
                            Comercial
                        </button>
                    </motion.div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {/* ══════════════════════════════════════════ */}
                    {/* PESTAÑA 1: DE ESPECIALIDAD                */}
                    {/* ══════════════════════════════════════════ */}
                    {activeCategory === "especialidad" && (
                        <motion.div
                            key="especialidad-tab"
                            variants={tabContent}
                            initial="hidden"
                            animate={state}
                            exit="exit"
                            className="space-y-8 pt-4 sm:space-y-20"
                        >
                            {/* ITEM 1: GEISHA 250g — bolsa IZQUIERDA */}
                            <motion.div
                                variants={stagger(0.15)}
                                className="relative grid grid-cols-2 items-center justify-center gap-2 md:mx-auto md:max-w-xl md:gap-6 lg:max-w-none lg:grid-cols-12 lg:gap-0"
                            >
                                {/* BOLSA — entra desde la izquierda */}
                                <motion.div
                                    variants={slideFromLeft}
                                    className="relative col-span-1 flex h-full min-h-[200px] items-center justify-center py-2 sm:min-h-[400px] md:justify-center lg:col-span-6 lg:mr-2 lg:min-h-0 lg:justify-end lg:py-4"
                                >
                                    <Image
                                        src="/assets/features/geisha_package_250.webp"
                                        alt="Sayni Geisha 250g"
                                        width={340}
                                        height={480}
                                        className="max-h-[220px] w-auto object-contain transition-[scale] duration-500 hover:scale-105 sm:max-h-full"
                                        priority
                                    />
                                </motion.div>

                                {/* INFO — derecha, por partes */}
                                <motion.div
                                    variants={stagger(0.12)}
                                    className="col-span-1 flex flex-col items-start justify-center gap-3 py-2 text-left font-urbanist md:pl-2 lg:col-span-6 lg:gap-5 lg:py-4 lg:pl-4"
                                >
                                    <motion.div variants={fadeUp}>
                                        <h3 className="font-heading text-2xl font-bold tracking-wide text-white sm:text-4xl lg:text-5xl">
                                            Sayni <br />
                                            Geisha{" "}
                                            <span className="ml-1 text-sm font-normal text-[#BCC90F] sm:text-lg">250g</span>
                                        </h3>
                                        <p className="mt-1 text-lg font-bold text-[#BCC90F] sm:text-2xl lg:mt-2">S/ 50.00</p>

                                        {/* Descripción — solo desktop */}
                                        <p className="mt-3 hidden max-w-[340px] text-sm font-light leading-relaxed text-white sm:text-base lg:block">
                                            Geisha de altura en presentación de 250g (solo en grano entero), 87 puntos SCA certificados por Q-Grader. Cultivado a +2,000 msnm en Inkawasi, Cusco. Lavado y de tueste medio, con notas de jazmín, cítricos y frutas rojas.
                                        </p>

                                        {/* Ficha técnica — siempre visible */}
                                        <a href="/ficha-tecnica-geisha.pdf" download className="mt-2 inline-block text-xs text-[#BCC90F] underline underline-offset-4 transition-colors sm:text-sm">
                                            Descargar ficha técnica
                                        </a>
                                    </motion.div>

                                    {/* Imagen grano — solo desktop: crece y su línea se dibuja */}
                                    <motion.div variants={zoomIn} className="relative hidden w-full max-w-[200px] sm:max-w-[240px] lg:block">
                                        <motion.span
                                            variants={drawLine}
                                            style={{ originX: 1 }}
                                            className="pointer-events-none absolute right-full top-1/2 -z-10 hidden h-px w-20 -translate-y-1/2 bg-[#BCC90F] lg:block lg:w-18"
                                        />
                                        <div className="relative z-10 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#132219] shadow-lg">
                                            <Image src="/assets/features/geisha-grain.webp" alt="Sayni Geisha Detalle" fill className="object-cover" />
                                        </div>
                                    </motion.div>

                                    {/* Botón */}
                                    <motion.div variants={fadeUp} className="pt-0 lg:pt-1">
                                        <button
                                            type="button"
                                            onClick={() => addToCart({ id: "geisha-250", title: "Sayni Geisha (Grano)", weight: "250g", price: 50.0, quantity: 1, image: "/assets/features/geisha_package_250.webp" })}
                                            className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-[100px] border-t border-white/40 bg-[#BCC90F] py-1.5 pl-4 pr-2 text-xs font-bold text-[#132219] shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] sm:gap-4 sm:py-2 sm:pl-6 sm:text-base"
                                        >
                                            <span className="hidden select-none tracking-wide sm:inline">Añadir al carrito</span>
                                            <span className="select-none tracking-wide sm:hidden">Añadir</span>
                                            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#132219] text-[#BCC90F] sm:size-9">
                                                <CartIcon className="size-4 sm:size-5" />
                                            </span>
                                        </button>
                                    </motion.div>
                                </motion.div>
                            </motion.div>

                            {/* ITEM 2: GEISHA 500g — bolsa DERECHA */}
                            <motion.div
                                variants={stagger(0.15)}
                                className="relative grid grid-cols-2 items-center justify-center gap-2 md:mx-auto md:max-w-xl md:gap-6 lg:max-w-none lg:grid-cols-12 lg:gap-0"
                            >
                                {/* INFO — izquierda, por partes */}
                                <motion.div
                                    variants={stagger(0.12)}
                                    className="col-span-1 flex flex-col items-end justify-center gap-3 py-2 text-right font-urbanist md:pr-2 lg:col-span-6 lg:gap-5 lg:py-4 lg:pr-8"
                                >
                                    <motion.div variants={fadeUp} className="flex flex-col items-end">
                                        <h3 className="font-heading text-2xl font-bold tracking-wide text-white sm:text-4xl lg:text-5xl">
                                            Sayni <br />
                                            <span className="mr-1 text-sm font-normal text-[#BCC90F] sm:text-lg">500g</span> Geisha
                                        </h3>
                                        <p className="mt-1 text-lg font-bold text-[#BCC90F] sm:text-2xl lg:mt-2">S/ 95.00</p>

                                        {/* Descripción — solo desktop */}
                                        <p className="mt-3 hidden max-w-[340px] text-sm font-light leading-relaxed text-white sm:text-base lg:block">
                                            Geisha de altura en presentación de 500g (solo en grano entero), 87 puntos SCA certificados por Q-Grader. Cultivado a +2,000 msnm en Inkawasi, Cusco. Lavado y de tueste medio.
                                        </p>

                                        {/* Ficha técnica — siempre visible */}
                                        <a href="/ficha-tecnica-geisha.pdf" download className="mt-2 inline-block text-xs text-[#BCC90F] underline underline-offset-4 transition-colors sm:text-sm">
                                            Descargar ficha técnica
                                        </a>
                                    </motion.div>

                                    {/* Imagen grano — solo desktop: crece y su línea se dibuja */}
                                    <motion.div variants={zoomIn} className="relative hidden w-full max-w-[200px] sm:max-w-[240px] lg:block">
                                        <motion.span
                                            variants={drawLine}
                                            style={{ originX: 0 }}
                                            className="pointer-events-none absolute left-full top-1/2 -z-10 hidden h-px w-16 -translate-y-1/2 bg-[#BCC90F] lg:block lg:w-20"
                                        />
                                        <div className="relative z-10 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#132219] shadow-lg">
                                            <Image src="/assets/features/geisha-grain.webp" alt="Sayni Geisha Detalle" fill className="object-cover" />
                                        </div>
                                    </motion.div>

                                    {/* Botón — alineado a la derecha */}
                                    <motion.div variants={fadeUp} className="self-end pt-0 lg:pt-1">
                                        <button
                                            type="button"
                                            onClick={() => addToCart({ id: "geisha-500", title: "Sayni Geisha (Grano)", weight: "500g", price: 95.0, quantity: 1, image: "/assets/features/geisha_package_500.webp" })}
                                            className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-[100px] border-t border-white/40 bg-[#BCC90F] py-1.5 pl-4 pr-2 text-xs font-bold text-[#132219] shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] sm:gap-4 sm:py-2 sm:pl-6 sm:text-base"
                                        >
                                            <span className="hidden select-none tracking-wide sm:inline">Añadir al carrito</span>
                                            <span className="select-none tracking-wide sm:hidden">Añadir</span>
                                            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#132219] text-[#BCC90F] sm:size-9">
                                                <CartIcon className="size-4 sm:size-5" />
                                            </span>
                                        </button>
                                    </motion.div>
                                </motion.div>

                                {/* BOLSA 500g — entra desde la derecha */}
                                <motion.div
                                    variants={slideFromRight}
                                    className="col-span-1 flex h-full min-h-[240px] items-center justify-center py-2 sm:min-h-[400px] md:justify-center lg:col-span-6 lg:min-h-0 lg:justify-start lg:py-4 lg:pl-4"
                                >
                                    <Image
                                        src="/assets/features/geisha_package_500.webp"
                                        alt="Sayni Geisha 500g"
                                        width={340}
                                        height={480}
                                        className="max-h-[260px] w-auto scale-110 object-contain transition-[scale] duration-500 hover:scale-103 sm:max-h-full sm:scale-100"
                                    />
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* ══════════════════════════════════════════ */}
                    {/* PESTAÑA 2: COMERCIAL                      */}
                    {/* ══════════════════════════════════════════ */}
                    {activeCategory === "comercial" && (
                        <motion.div
                            key="comercial-tab"
                            variants={tabContent}
                            initial="hidden"
                            animate={state}
                            exit="exit"
                            className="space-y-16 pt-4 sm:space-y-24"
                        >
                            {/* PACK OCASIÓN ESPECIAL — la tarjeta crece y escalona su contenido */}
                            <motion.div
                                variants={cardIn}
                                className="relative mx-auto max-w-3xl space-y-6 rounded-3xl border border-[#BCC90F]/30 bg-[#182a1f] p-6 text-center shadow-2xl sm:p-10"
                            >
                                <motion.div
                                    variants={fadeDown}
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#BCC90F] px-4 py-2 text-xs font-bold uppercase leading-none tracking-wider text-[#132219] shadow-md sm:text-sm"
                                >
                                    <svg className="size-4 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden>
                                        <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.67C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1h-2.12l.41-.55C13.61 4.9 14.26 4 15 4zM9 4c.74 0 1.39.9 1.71 1.45l.41.55H9c-.55 0-1-.45-1-1s.45-1 1-1zm11 15H4V13h7v6h2v-6h7v6zm0-8H4V8h16v3z" />
                                    </svg>
                                    <span className="translate-y-[0.5px]">Ideal para ocasiones especiales</span>
                                </motion.div>

                                <motion.h3 variants={blurIn} className="font-heading text-3xl font-bold tracking-wide text-white sm:text-4xl">
                                    Pack Ocasión Especial
                                </motion.h3>

                                <motion.p variants={fadeUp} className="text-3xl font-bold text-[#BCC90F]">
                                    S/ 99.90
                                </motion.p>

                                <motion.div variants={zoomIn} className="relative mx-auto h-64 w-full sm:h-80 md:h-[320px]">
                                    <Image src="/assets/features/sayni-package.webp" alt="Pack Ocasión Especial Sayni" fill className="object-contain" />
                                </motion.div>

                                {/* Contenido del pack: uno tras otro */}
                                <motion.div variants={stagger(0.12)} className="flex flex-wrap items-center justify-center gap-3 font-urbanist sm:gap-0">
                                    <motion.div variants={fadeUp} className="flex flex-col items-center px-4 py-2">
                                        <div className="rounded-lg bg-[#BCC90F] px-5 py-1.5 text-sm font-bold text-black shadow-sm sm:text-base">4 Bolsas Sayni Clásico</div>
                                        <p className="mt-2 text-center text-xs text-gray-300">220g c/u - blend cusqueño</p>
                                    </motion.div>
                                    <div className="mx-1 hidden h-12 w-px bg-white/20 sm:block" />
                                    <motion.div variants={fadeUp} className="flex flex-col items-center px-4 py-2">
                                        <div className="rounded-lg bg-[#BCC90F] px-5 py-1.5 text-sm font-bold text-black shadow-sm sm:text-base">1 Caja Diseño Premium</div>
                                        <p className="mt-2 text-center text-xs text-gray-300">Verde andino con detalles dorados</p>
                                    </motion.div>
                                    <div className="mx-1 hidden h-12 w-px bg-white/20 sm:block" />
                                    <motion.div variants={fadeUp} className="flex flex-col items-center px-4 py-2">
                                        <div className="rounded-lg bg-[#BCC90F] px-5 py-1.5 text-sm font-bold text-black shadow-sm sm:text-base">1 Tarjeta Especial</div>
                                        <p className="mt-2 text-center text-xs text-gray-300">Con mensaje predeterminado e impresos &quot;Para/De&quot;</p>
                                    </motion.div>
                                </motion.div>

                                <motion.div variants={fadeUp} className="flex flex-col items-center gap-4 pt-2 font-urbanist">
                                    <p className="max-w-[420px] text-xs font-light leading-relaxed text-white sm:text-sm">
                                        El detalle perfecto listo para regalar. Incluye tarjeta especial de 11x8 cm con el mensaje inspirador de Sayni.
                                        <a href="/ficha-tecnica-clasico.pdf" download className="ml-2 inline-block text-[#BCC90F] underline underline-offset-4 transition-colors">
                                            Descargar ficha técnica
                                        </a>
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => addToCart({ id: "pack-regalo-clasico", title: "Pack Ocasión Especial", weight: "4 Bolsas 220g + Estuche + Tarjeta", price: 99.9, quantity: 1, image: "/assets/features/sayni-package.webp" })}
                                        className="group mt-2 inline-flex cursor-pointer items-center gap-2 rounded-[100px] border-t border-white/40 bg-[#BCC90F] py-2.5 pl-5 pr-2 text-[11px] font-bold text-[#132219] shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] sm:gap-4 sm:py-3 sm:pl-8 sm:pr-3 sm:text-lg"
                                    >
                                        <span className="select-none tracking-wide sm:hidden">Añadir por S/ 99.90</span>
                                        <span className="hidden select-none tracking-wide sm:inline">Añadir al carrito — S/ 99.90</span>
                                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#132219] text-[#BCC90F] sm:size-10">
                                            <CartIcon className="size-4 sm:size-5" />
                                        </span>
                                    </button>
                                </motion.div>
                            </motion.div>

                            {/* PACK X4 CLÁSICO */}
                            <motion.div
                                variants={stagger(0.15)}
                                className="relative grid grid-cols-2 items-center justify-center gap-2 pt-6 md:mx-auto md:max-w-xl md:gap-6 lg:max-w-none lg:grid-cols-12 lg:gap-0"
                            >
                                {/* BOLSA — entra desde la izquierda */}
                                <motion.div
                                    variants={slideFromLeft}
                                    className="relative col-span-1 flex h-full min-h-[200px] items-center justify-center py-2 sm:min-h-[360px] md:justify-center lg:col-span-6 lg:mr-2 lg:min-h-0 lg:justify-end lg:py-4"
                                >
                                    <Image
                                        src="/assets/features/classic_package_250.webp"
                                        alt="Pack x4 Sayni Clásico 220g"
                                        width={320}
                                        height={440}
                                        className="max-h-[220px] w-auto object-contain transition-[scale] duration-500 hover:scale-105 sm:max-h-full"
                                    />
                                </motion.div>

                                {/* INFO — derecha, por partes */}
                                <motion.div
                                    variants={stagger(0.12)}
                                    className="col-span-1 flex flex-col items-start justify-center gap-3 py-2 text-left font-urbanist md:pl-2 lg:col-span-6 lg:gap-5 lg:py-4 lg:pl-6"
                                >
                                    <motion.div variants={fadeUp}>
                                        <h3 className="font-heading text-2xl font-bold tracking-wide text-white sm:text-4xl lg:text-5xl">
                                            Pack x4 <br />
                                            Sayni Clásico{" "}
                                            <span className="ml-1 text-sm font-normal text-[#BCC90F] sm:text-lg">(220g c/u)</span>
                                        </h3>
                                        <p className="mt-1 text-lg font-bold text-[#BCC90F] sm:text-2xl lg:mt-2">S/ 89.90</p>

                                        {/* Descripción — solo desktop */}
                                        <p className="mt-3 hidden max-w-[340px] text-sm font-light leading-relaxed text-white sm:text-base lg:block">
                                            Pack de 4 bolsas de Sayni Clásico 220g (sin estuche ni tarjeta). Ideal para el consumo diario en casa o en la oficina. Blend 100% cusqueño de tueste oscuro con sabor intenso.
                                        </p>

                                        {/* Ficha técnica — siempre visible */}
                                        <a href="/ficha-tecnica-clasico.pdf" download className="mt-2 inline-block text-xs text-[#BCC90F] underline underline-offset-4 transition-colors sm:text-sm">
                                            Descargar ficha técnica
                                        </a>
                                    </motion.div>

                                    {/* Imagen detalle grano — solo desktop: crece y su línea se dibuja */}
                                    <motion.div variants={zoomIn} className="relative hidden w-full max-w-[200px] sm:max-w-[240px] lg:block">
                                        <motion.span
                                            variants={drawLine}
                                            style={{ originX: 1 }}
                                            className="pointer-events-none absolute right-full top-1/2 -z-10 hidden h-px w-20 -translate-y-1/2 bg-[#BCC90F] lg:block lg:w-18"
                                        />
                                        <div className="relative z-10 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#132219] shadow-lg">
                                            <Image src="/assets/features/geisha-grain.webp" alt="Sayni Clásico Detalle" fill className="object-cover" />
                                        </div>
                                    </motion.div>

                                    {/* Botón */}
                                    <motion.div variants={fadeUp} className="pt-0 lg:pt-2">
                                        <button
                                            type="button"
                                            onClick={() => addToCart({ id: "pack-clasico-4x", title: "Pack x4 Sayni Clásico", weight: "4 Bolsas 220g", price: 89.9, quantity: 1, image: "/assets/features/classic_package_250.webp" })}
                                            className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-[100px] border-t border-white/40 bg-[#BCC90F] py-1.5 pl-4 pr-2 text-xs font-bold text-[#132219] shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] sm:gap-4 sm:py-2.5 sm:pl-6 sm:text-base"
                                        >
                                            <span className="hidden select-none tracking-wide sm:inline">Añadir al carrito</span>
                                            <span className="select-none tracking-wide sm:hidden">Añadir</span>
                                            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#132219] text-[#BCC90F] sm:size-9">
                                                <CartIcon className="size-4 sm:size-5" />
                                            </span>
                                        </button>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}

/* ── Iconos ─────────────────────────────── */

function CartIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.89-2-1.99-2z" />
        </svg>
    );
}