"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";

// Array de imágenes base
const galleryImages = [
    { src: "/assets/features/family.webp", alt: "Proceso de café 1 - Familia" },
    { src: "/assets/features/field.webp", alt: "Proceso de café 2 - Campo" },
    { src: "/assets/features/farmer.webp", alt: "Proceso de café 3 - Agricultor" },
];

// Duplicamos las imágenes para lograr el loop infinito continuo
const marqueeImages = [...galleryImages, ...galleryImages, ...galleryImages, ...galleryImages];

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

export default function TestimonialsSection() {
    return (
        <section className="relative w-full py-20 lg:py-32 overflow-hidden flex flex-col items-center justify-center min-h-[600px] text-white">

            {/* FONDO PRINCIPAL CON FADE IN */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute inset-0 z-0"
            >
                <Image
                    src="/assets/features/coffee_background.webp"
                    alt="Fondo café"
                    fill
                    className="object-cover object-center opacity-40"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0e0e0e]/80 via-transparent to-[#0e0e0e]/80" />
            </motion.div>

            {/* CONTENEDOR TEXTOS Y BADGES (CON MAX-WIDTH) */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="w-full max-w-5xl mx-auto px-6 text-center space-y-12 relative z-10 font-clash"
            >

                {/* SECCIÓN CITA / TESTIMONIAL */}
                <motion.div variants={itemUpVariants} className="space-y-6 max-w-md sm:max-w-lg mx-auto">
                    <div className="flex items-center justify-center gap-3 mb-0">
                        <span className="h-[1px] w-8 sm:w-16 bg-white/20" />
                        <span className="font-urbanist text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap">
                            <span className="text-[#BCC90F]">¿Qué opinan</span> de nosotros?
                        </span>
                        <span className="h-[1px] w-8 sm:w-16 bg-white/20" />
                    </div>

                    <blockquote className="font-clash text-2xl sm:text-3xl lg:text-4xl font-medium leading-tight tracking-wide text-white max-w-[280px] sm:max-w-[380px] mx-auto text-balance">
                        <span className="text-[#BCC90F] font-serif">“</span>
                        Haz una pausa y <br /> recarga tu alma con la <br /> esencia que nace de nuestra tierra
                        <span className="text-[#BCC90F] font-serif">”</span>
                    </blockquote>
                </motion.div>

            </motion.div>

            {/* CARRUSEL INFINITO FULL WIDTH (SIN FADE LATERAL) */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="w-full mt-12 overflow-hidden relative z-10"
            >
                <motion.div
                    className="flex items-center gap-4 sm:gap-6 w-max"
                    animate={{ x: ["0%", "-25%"] }}
                    transition={{
                        ease: "linear",
                        duration: 20,
                        repeat: Infinity,
                    }}
                >
                    {marqueeImages.map((img, idx) => (
                        <div
                            key={idx}
                            className="relative aspect-[3/2] w-[280px] sm:w-[360px] md:w-[420px] shrink-0 rounded-2xl overflow-hidden border border-white/10"
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover transition-transform duration-500 hover:scale-105"
                            />
                        </div>
                    ))}
                </motion.div>
            </motion.div>

        </section>
    );
}