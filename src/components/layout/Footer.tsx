"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, type Variants } from "framer-motion";

const EASE = [0.215, 0.61, 0.355, 1] as const;

type FooterLink = { label: string; href: string; external?: boolean };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
    {
        title: "Explora",
        links: [
            { label: "Nuestros Cafés", href: "#cafes" },
            { label: "Nuestra Historia", href: "#nosotros" },
            { label: "Origen", href: "#origen" },
        ],
    },
    {
        title: "Descubre",
        links: [
            { label: "Sayni Geisha", href: "#sayni-geisha" },
            { label: "Sayni Clásico", href: "#sayni-clasico" },
            { label: "Comprar", href: "#comprar" },
        ],
    },
    {
        title: "Síguenos",
        links: [
            { label: "Instagram", href: "https://instagram.com/sayni_peru", external: true },
            { label: "Facebook", href: "https://facebook.com", external: true },
            { label: "TikTok", href: "https://tiktok.com", external: true },
            { label: "Contáctanos", href: "#contactanos" },
        ],
    },
];

// Trazados del logo "Sayni", letra por letra
const LOGO_LETTERS = [
    "M79.1503 37.8835C75.1879 23.1079 68.8641 8.15413 47.7102 8.15413C30.9034 8.15413 24.356 20.3364 24.356 32.1978C24.356 47.1605 34.0072 54.9582 52.9607 64.6719C79.5439 78.2622 91.941 88.8581 91.941 110.398C91.941 134.557 71.1002 152.808 41.3864 152.808C27.6744 152.808 15.7245 148.976 6.21647 145.465C4.49018 139.369 1.57424 122.598 1.78657e-08 110.736L7.32559 108.892C11.8426 123.81 22.2719 144.28 45.5188 144.28C61.3328 144.28 70.9929 133.514 70.9929 118.926C70.9929 102.368 61.9321 95.2656 42.2183 84.5894C18.5421 71.8012 4.84796 60.9201 4.84796 39.541C4.84796 18.162 21.8873 3.51815e-09 52.4419 8.42946e-09C65.6172 1.05472e-08 77.9249 3.37752 82.7103 4.23304C83.6137 12.3783 84.6423 21.8603 86.4491 36.413L79.1593 37.8835L79.1503 37.8835Z",
    "M182.352 152.14C178.479 152.14 173.506 150.305 171.127 147.783C168.148 144.895 166.753 141.749 165.626 137.98C156.673 143.977 145.608 152.14 139.088 152.14C122.442 152.14 110.957 138.541 110.957 124.211C110.957 113.018 116.932 106.138 129.275 101.789C142.979 97.0217 160.08 91.247 165.089 87.1209L165.089 81.6491C165.089 66.4369 157.648 57.6945 146.27 57.6945C141.315 57.6945 138.157 60.0472 135.939 62.7474C133.417 65.9824 131.95 70.8482 129.964 77.416C128.757 81.4619 126.431 83.0393 122.844 83.0393C118.265 83.0393 112.29 78.3785 112.29 72.8177C112.29 69.5025 115.188 66.7577 119.83 63.5317C127.03 58.4431 140.179 50.4405 153.014 47.7402C160.197 47.7402 167.326 49.7632 172.764 53.8982C180.993 60.6532 184.445 68.6291 184.445 80.2856L184.445 122.91C184.445 133.346 188.247 136.411 192.227 136.411C194.857 136.411 197.674 135.369 200.161 134.059L202.46 140.6L182.361 152.14L182.352 152.14ZM165.089 95.2394C160.277 97.6722 150.662 101.959 145.581 104.249C137.281 108.036 132.29 112.27 132.29 120.477C132.29 132.526 141.288 137.766 148.104 137.766C153.488 137.766 160.724 134.771 165.08 130.476L165.08 95.2483L165.089 95.2394Z",
    "M307.889 56.7937C296.306 58.5582 293.855 60.4386 288.211 73.1377C282.567 85.5784 276.422 101.165 261.279 138.915C246.475 175.007 242.37 189.123 238.631 201.029C237.236 205.797 234.713 207 231.61 207C224.096 207 217.102 201.581 217.102 195.548C217.102 192.5 218.64 190.513 222.28 187.59C229.794 182.083 235.152 176.887 238.103 171.014C242.397 162.575 245.626 155.018 246.717 152.139C247.62 148.807 247.54 146.775 246.18 143.032C236.842 116.154 224.239 87.9043 217.951 72.9149C213.139 61.0624 210.992 58.3621 198.846 56.7848L198.846 50.4219L246.431 50.4219L246.431 56.7848C236.162 58.3621 234.946 60.492 237.808 68.5749L258.944 122.526C265.026 107.563 273.899 83.3504 278.524 69.4572C281.153 61.1515 279.329 58.5938 266.556 56.7937L266.556 50.4307L307.898 50.4307L307.898 56.7937L307.889 56.7937Z",
    "M378.354 149.44L378.354 142.899C390.805 141.544 392.039 140.092 392.039 124.746L392.039 87.3702C392.039 71.5787 385.984 62.0076 372.335 62.0076C363.685 62.0076 355.564 66.8378 348.721 72.8175L348.721 125.806C348.721 141.009 349.991 141.544 362.594 142.89L362.594 149.431L313.148 149.431L313.148 142.89C327.487 141.232 328.846 140.457 328.846 125.637L328.846 79.1893C328.846 64.7613 327.227 64.084 315.429 62.0611L315.429 55.9655C326.86 54.201 338.748 51.278 348.801 47.0449C348.766 51.8572 348.721 59.1826 348.721 64.5385C353.238 61.3838 358.166 58.0152 363.918 54.3079C370.322 50.2531 375.912 47.7222 382.469 47.7222C400.581 47.7222 411.914 61.0006 411.914 83.0391L411.914 125.762C411.914 140.822 413.274 141.5 425.966 142.89L425.966 149.431L378.354 149.431L378.354 149.44Z",
    "M438.855 149.439L438.855 142.898C452.72 141.508 454.258 140.421 454.258 124.995L454.258 79.0729C454.258 64.9212 453.498 64.0211 440.474 61.9269L440.474 56.1611C452.666 54.2183 463.936 51.2953 474.142 47.3207L474.142 124.995C474.142 140.296 475.6 141.508 490 142.898L490 149.439L438.855 149.439ZM462.881 26.7615C456.145 26.7615 450.135 20.8531 450.135 14.107C450.135 6.54097 456.145 1.07813 463.104 1.07813C470.063 1.07813 475.474 6.54097 475.474 14.107C475.474 20.8531 469.911 26.7615 462.872 26.7615L462.881 26.7615Z",
];

const LINK_CLASS =
    "inline-block origin-center transition-[color,scale] duration-200 hover:scale-105 hover:text-[#BCC90F] sm:origin-left";

/* ── Variantes ─────────────────────────────── */

const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
};

const fromLeft: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: EASE } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const fade: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: EASE } },
};

// Cada columna aparece y escalona sus enlaces
const column: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: EASE, staggerChildren: 0.07, delayChildren: 0.1 },
    },
};

const logoContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

// Cada letra cae con un pequeño rebote
const letterDrop: Variants = {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 14 } },
};

// Línea superior de la barra inferior: se dibuja desde el centro
const drawFromCenter: Variants = {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1, transition: { duration: 1, ease: EASE } },
};

export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);
    const inView = useInView(footerRef, { once: true, amount: 0.15 });
    const state = inView ? "visible" : "hidden";

    return (
        <footer ref={footerRef} className="w-full border-t border-white/10 bg-[#111111] px-6 pb-12 pt-16 font-sans text-white sm:px-12">
            {/* Efecto "tic / temblor" sutil en cascada de las letras del logo */}
            <style jsx global>{`
                @keyframes letterTic {
                    0%, 85%, 100% { transform: translate(0, 0) rotate(0deg); }
                    87% { transform: translate(-1.5px, 1px) rotate(-0.5deg); }
                    89% { transform: translate(1.5px, -1px) rotate(0.5deg); }
                    91% { transform: translate(-1px, -1px) rotate(-0.3deg); }
                    93% { transform: translate(1px, 1px) rotate(0.3deg); }
                    95% { transform: translate(0, 0) rotate(0deg); }
                }

                .animate-letter-tic {
                    animation: letterTic 3s ease-in-out infinite;
                    transform-box: fill-box;
                    transform-origin: center;
                }
            `}</style>

            <motion.div variants={container} initial="hidden" animate={state} className="mx-auto flex max-w-6xl flex-col gap-16">
                {/* BLOQUE SUPERIOR */}
                <div className="grid grid-cols-1 items-start gap-12 text-center md:grid-cols-12 md:text-left">
                    {/* Marca: el título entra desde la izquierda; el párrafo sube */}
                    <motion.div
                        variants={container}
                        className="mx-auto flex max-w-xs flex-col items-center gap-4 md:col-span-5 md:mx-0 md:items-start"
                    >
                        <motion.h3 variants={fromLeft} className="font-clash text-2xl font-semibold leading-tight text-[#BCC90F] sm:text-3xl">
                            Una pausa que nace de nuestra tierra
                        </motion.h3>
                        <motion.p variants={fadeUp} className="text-base leading-relaxed text-white/50 sm:text-lg">
                            Café peruano con raíces, historia y propósito. Del origen a tu taza, para acompañarte en cada momento.
                        </motion.p>
                    </motion.div>

                    {/* Columnas: una tras otra, con sus enlaces en cascada */}
                    <motion.div variants={container} className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3 sm:text-left md:col-span-7">
                        {COLUMNS.map((col) => (
                            <motion.div key={col.title} variants={column} className="flex flex-col gap-3">
                                <span className="text-sm font-normal uppercase tracking-wider text-white/50">{col.title}</span>
                                <ul className="flex flex-col gap-2.5 text-sm text-white/80">
                                    {col.links.map((link) => (
                                        <motion.li key={link.label} variants={fadeUp}>
                                            {link.external ? (
                                                <a href={link.href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
                                                    {link.label}
                                                </a>
                                            ) : (
                                                <Link href={link.href} className={LINK_CLASS}>
                                                    {link.label}
                                                </Link>
                                            )}
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* BLOQUE CENTRAL: las letras caen una a una y luego siguen con su tic */}
                <div className="flex items-center justify-center py-3.5">
                    <motion.svg
                        variants={logoContainer}
                        width="490"
                        height="227"
                        viewBox="0 -10 490 227"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        role="img"
                        aria-label="Sayni"
                        className="h-auto w-full max-w-[210px] overflow-visible sm:max-w-[280px] md:max-w-[330px]"
                    >
                        {LOGO_LETTERS.map((d, i) => (
                            // La entrada va en el <g>; el tic, en el <path> (los dos usan transform)
                            <motion.g key={i} variants={letterDrop} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                                <path
                                    d={d}
                                    fill="#BCC90F"
                                    className="animate-letter-tic"
                                    style={{ animationDelay: `${i * 150}ms` }}
                                />
                            </motion.g>
                        ))}
                    </motion.svg>
                </div>

                {/* BLOQUE INFERIOR: la línea se dibuja desde el centro; los textos aparecen */}
                <div className="relative flex flex-col items-center justify-between gap-4 pt-8 text-center text-xs tracking-wider text-white/50 sm:flex-row sm:text-left">
                    <motion.span
                        variants={drawFromCenter}
                        aria-hidden
                        className="absolute inset-x-0 top-0 h-px bg-white/10"
                    />
                    <motion.p variants={fade}>© 2026 SAYNI · TODOS LOS DERECHOS RESERVADOS</motion.p>
                    <motion.p variants={fade} className="font-semibold text-white/70">
                        PERÚ
                    </motion.p>
                </div>
            </motion.div>
        </footer>
    );
}