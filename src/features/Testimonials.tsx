"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";

const EASE = [0.215, 0.61, 0.355, 1] as const;

// Imágenes base (5)
const galleryImages = [
    { src: "/assets/features/carousel/landscape-1.webp", alt: "Proceso de café 1 - Campo" },
    { src: "/assets/features/carousel/landscape-2.webp", alt: "Proceso de café 2 - Campo" },
    { src: "/assets/features/carousel/landscape-3.webp", alt: "Proceso de café 3 - Agricultor" },
    { src: "/assets/features/carousel/landscape-4.webp", alt: "Proceso de café 4 - Campo" },
    { src: "/assets/features/carousel/landscape-5.webp", alt: "Proceso de café 5 - Campo" },
];

// Dos copias exactas: el bucle de 0% a -50% cuadra con la segunda
const marqueeImages = [...galleryImages, ...galleryImages];

// Cita dividida en líneas para revelarlas una a una
const QUOTE_LINES = ["Haz una pausa y", "recarga tu alma con la", "esencia que nace de nuestra tierra"];

/* ── Variantes ─────────────────────────────── */

// Fondo: único blur de la sección, con un leve zoom de cámara
const backgroundIn: Variants = {
    hidden: { opacity: 0, scale: 1.08, filter: "blur(8px)" },
    visible: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 1.6, ease: EASE },
    },
};

const quoteContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.14, delayChildren: 0.3 } },
};

// Cada línea sube desde detrás de su máscara (overflow-hidden)
const lineUp: Variants = {
    hidden: { y: "105%" },
    visible: { y: "0%", transition: { duration: 0.8, ease: EASE } },
};

// Comillas con un pequeño rebote
const quoteMark: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 260, damping: 14 },
    },
};

const carouselContainer: Variants = {
    hidden: {},
    visible: { transition: { delayChildren: 0.5 } },
};

// Tarjetas en ola: cada una con su retraso por índice
const cardIn: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.94 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.8, ease: EASE, delay: 0.5 + i * 0.08 },
    }),
};

export default function TestimonialsSection() {
    return (
        <section className="relative flex min-h-[600px] w-full flex-col items-center justify-center overflow-hidden py-20 text-white lg:py-32">
            {/* FONDO: se enfoca y se aleja */}
            <motion.div
                variants={backgroundIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="absolute inset-0 z-0"
            >
                <Image
                    src="/assets/features/coffee_background.webp"
                    alt=""
                    fill
                    className="object-cover object-center opacity-40"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0e0e0e]/80 via-transparent to-[#0e0e0e]/80" />
            </motion.div>

            {/* CITA: línea por línea, comillas con rebote */}
            <motion.div
                variants={quoteContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center font-clash"
            >
                <blockquote className="mx-auto mb-3 max-w-[280px] font-clash text-2xl font-medium leading-tight tracking-wide text-white sm:mb-10 sm:max-w-[380px] sm:text-3xl lg:text-4xl">
                    <motion.span variants={quoteMark} className="inline-block font-serif text-[#BCC90F]">
                        “
                    </motion.span>

                    {QUOTE_LINES.map((line) => (
                        <span key={line} className="block overflow-hidden">
                            <motion.span variants={lineUp} className="block">
                                {line}
                            </motion.span>
                        </span>
                    ))}

                    <motion.span variants={quoteMark} className="inline-block font-serif text-[#BCC90F]">
                        ”
                    </motion.span>
                </blockquote>
            </motion.div>

            {/* CARRUSEL INFINITO FULL WIDTH: tarjetas en ola */}
            <motion.div
                variants={carouselContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="relative z-10 mt-12 w-full overflow-hidden"
            >
                <motion.div
                    className="flex w-max items-center"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ ease: "linear", duration: 40, repeat: Infinity }}
                >
                    {marqueeImages.map((img, idx) => (
                        // Separación con padding (no gap): el -50% del bucle cuadra exacto
                        <motion.div
                            key={`${img.src}-${idx}`}
                            custom={idx}
                            variants={cardIn}
                            aria-hidden={idx >= galleryImages.length || undefined}
                            className="shrink-0 pr-3 sm:pr-4 lg:pr-5"
                        >
                            <div className="relative aspect-[9/16] w-[220px] overflow-hidden rounded-2xl border border-white/10 sm:w-[280px] lg:w-[calc((100vw-80px)/5)]">
                                <Image
                                    src={img.src}
                                    alt={idx >= galleryImages.length ? "" : img.alt}
                                    fill
                                    sizes="(min-width: 1024px) 20vw, 280px"
                                    className="object-cover transition-[scale] duration-500 hover:scale-101"
                                />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}