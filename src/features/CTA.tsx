"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const EASE = [0.215, 0.61, 0.355, 1] as const;

/* ── Variantes ─────────────────────────────── */

const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

// Cada línea del título entra desde un lado
const fromLeft: Variants = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
};

const fromRight: Variants = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } },
};

// Botón con rebote; luego escalona la flecha
const buttonPop: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 220, damping: 16, delayChildren: 0.25 },
    },
};

// Flecha que entra deslizándose dentro de su círculo
const arrowIn: Variants = {
    hidden: { opacity: 0, x: -14 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

// Resplandor de fondo
const glowIn: Variants = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1.6, ease: EASE, delay: 0.3 } },
};

export default function CtaSection() {
    return (
        <section className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-sayni-black px-6 py-60 text-center text-white lg:py-65">
            <motion.div
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="relative z-10 mx-auto max-w-2xl space-y-8"
            >
                {/* RESPLANDOR DE FONDO: crece detrás del botón */}
                <motion.div
                    variants={glowIn}
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#BCC90F]/10 blur-3xl"
                />

                {/* TÍTULO: cada línea desde un lado */}
                <h2 className="font-clash text-3xl font-medium leading-tight tracking-wide text-white sm:text-4xl sm:leading-none lg:text-5xl">
                    <motion.span variants={fromLeft} className="block">
                        Lleva nuestra esencia
                    </motion.span>
                    <motion.span variants={fromRight} className="block">
                        a tu próxima taza
                    </motion.span>
                </h2>

                {/* BOTÓN CTA: rebote de entrada; la flecha entra después */}
                <motion.div variants={buttonPop} className="pt-2">
                    <Link
                        href="https://wa.me/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            group relative inline-flex items-center gap-6 rounded-[100px] bg-[#BCC90F] py-1 pl-8 pr-3 text-base font-bold text-[#132219]
                            transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] sm:text-lg
                            border-t border-white/40
                            shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.2)]
                        "
                    >
                        <span className="select-none pr-1 font-urbanist tracking-wide drop-shadow-[0_1px_1px_rgba(255,255,255,0.15)]">
                            Obtén tu Sayni
                        </span>

                        {/* Círculo oscuro: la flecha entra deslizándose y se mueve en hover */}
                        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#132219] text-[#BCC90F] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.15)]">
                            <motion.span variants={arrowIn} className="flex">
                                <svg
                                    className="size-6 stroke-[2.5] transition-[translate] duration-300 group-hover:translate-x-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </motion.span>
                        </span>
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
}