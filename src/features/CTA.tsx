"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";

// Variantes de animación para el contenedor
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

// Variantes para elementos que se deslizan hacia arriba
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

export default function CtaSection() {
    return (
        <section className="relative w-full py-20 lg:py-28 px-6 bg-sayni-black text-white text-center flex flex-col items-center justify-center overflow-hidden">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="max-w-2xl mx-auto space-y-8 relative z-10"
            >

                {/* TÍTULO EN 2 LÍNEAS CON CLASH GROTESK */}
                <motion.h2
                    variants={itemUpVariants}
                    className="font-clash text-3xl sm:text-4xl lg:text-5xl font-medium tracking-wide leading-tight sm:leading-none text-white"
                >
                    Lleva nuestra esencia <br />
                    a tu próxima taza
                </motion.h2>

                {/* BOTÓN CTA CON EFECTO 3D Y ENTRADA SUAVE */}
                <motion.div variants={itemUpVariants} className="pt-2">
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
                        {/* TEXTO CON FUENTE URBANIST Y TÍTULO */}
                        <span className="font-urbanist tracking-wide select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.15)] pr-1">
                            Obtén tu Sayni
                        </span>

                        {/* CÍRCULO OSCURO CON FLECHA LIMA */}
                        <span className="
                            bg-[#132219] text-[#BCC90F] rounded-full w-12 h-12 flex items-center justify-center
                            transition-transform group-hover:translate-x-0.5 shrink-0
                            /* Sutil relieve 3D para el círculo */
                            shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.15)]
                        ">
                            <svg
                                className="w-6 h-6 stroke-[2.5]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                />
                            </svg>
                        </span>
                    </Link>
                </motion.div>

            </motion.div>
        </section>
    );
}