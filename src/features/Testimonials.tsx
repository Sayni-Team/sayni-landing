"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";

// Variantes de animación general
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
            ease: [0.215, 0.61, 0.355, 1], // cubic-bezier para entrada ultra fluida
        },
    },
};

const imageVariants: Variants = {
    hidden: { opacity: 0, y: 25, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.7,
            ease: [0.215, 0.61, 0.355, 1],
        },
    },
};

export default function TestimonialsSection() {
    return (
        <section className="relative w-full py-20 lg:py-32 px-6 overflow-hidden flex flex-col items-center justify-center min-h-[600px] text-white">

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
                {/* Gradient overlay para suavizar bordes superior e inferior */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0e0e0e]/80 via-transparent to-[#0e0e0e]/80" />
            </motion.div>

            {/* CONTENEDOR GENERAL CON STAGGER ANIMATION */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                className="w-full max-w-5xl mx-auto text-center space-y-12 relative z-10 font-clash"
            >

                {/* BADGES FLOTANTES SUPERIORES */}
                <motion.div variants={itemUpVariants} className="flex flex-wrap items-center justify-evenly gap-4">
                    {/* Badge 1: 87 puntos SCA */}
                    <div className="px-8 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-sm sm:text-lg font-medium shadow-xl transition-colors duration-300 hover:border-[#BCC90F]/40">
                        <span className="text-[#BCC90F] font-bold">87</span> puntos SCA
                    </div>

                    {/* Badge 2: 100% café de Cusco */}
                    <div className="px-8 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-sm sm:text-lg font-medium shadow-xl transition-colors duration-300 hover:border-[#BCC90F]/40">
                        <span className="text-[#BCC90F] font-bold">100%</span> café de Cusco
                    </div>
                </motion.div>

                {/* SECCIÓN CITA / TESTIMONIAL */}
                <motion.div variants={itemUpVariants} className="space-y-6 max-w-md sm:max-w-lg mx-auto">

                    {/* ENCABEZADO CON LÍNEAS CONECTORAS */}
                    <div className="flex items-center justify-center gap-3 mb-0">
                        <span className="h-[1px] w-8 sm:w-16 bg-white/20" />
                        <span className="font-urbanist text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap">
                            <span className="text-[#BCC90F]">¿Qué opinan</span> de nosotros?
                        </span>
                        <span className="h-[1px] w-8 sm:w-16 bg-white/20" />
                    </div>

                    {/* FRASE ENTRE COMILLAS */}
                    <blockquote className="font-clash text-2xl sm:text-3xl lg:text-4xl font-medium leading-tight tracking-wide text-white max-w-[280px] sm:max-w-[380px] mx-auto text-balance">
                        <span className="text-[#BCC90F] font-serif">“</span>
                        Haz una pausa y <br /> recarga tu alma con la <br /> esencia que nace de nuestra tierra
                        <span className="text-[#BCC90F] font-serif">”</span>
                    </blockquote>
                </motion.div>

                {/* GALERÍA DE 3 IMÁGENES CON ANIMACIÓN ESCALONADA */}
                <motion.div variants={itemUpVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto pt-2">
                    {/* Imagen 1 */}
                    <motion.div
                        variants={imageVariants}
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden"
                    >
                        <Image
                            src="/assets/features/family.webp"
                            alt="Proceso de café 1"
                            fill
                            className="object-contain"
                        />
                    </motion.div>

                    {/* Imagen 2 */}
                    <motion.div
                        variants={imageVariants}
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden"
                    >
                        <Image
                            src="/assets/features/field.webp"
                            alt="Proceso de café 2"
                            fill
                            className="object-contain"
                        />
                    </motion.div>

                    {/* Imagen 3 */}
                    <motion.div
                        variants={imageVariants}
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden"
                    >
                        <Image
                            src="/assets/features/farmer.webp"
                            alt="Proceso de café 3"
                            fill
                            className="object-contain"
                        />
                    </motion.div>
                </motion.div>

            </motion.div>
        </section>
    );
}