"use client";

import { useEffect, useState } from "react";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, type PanInfo, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { ENTER_ANIM } from "@/lib/reveal";

const HERO_DIR = "/assets/features/hero";

type HeroProduct = {
    key: string;
    name: string;
    cta: string;
    product: string;
    bgDesktop: string;
    bgMobile: string;
};

const PRODUCTS: readonly HeroProduct[] = [
    {
        key: "clasico",
        name: "Sayni Clásico",
        cta: "Pedir Clásico",
        product: `${HERO_DIR}/classic_product.png`,
        bgDesktop: `${HERO_DIR}/classic_desktop_background.png`,
        bgMobile: `${HERO_DIR}/classic_mobile_background.png`,
    },
    {
        key: "geisha",
        name: "Sayni Geisha",
        cta: "Pedir Geisha",
        product: `${HERO_DIR}/geisha_product.png`,
        bgDesktop: `${HERO_DIR}/geisha_desktop_background.png`,
        bgMobile: `${HERO_DIR}/geisha_mobile_background.png`,
    },
];

const PRODUCT_SIZES = "(min-width: 768px) 96vw, 100vw";
const SWIPE_THRESHOLD = 80;

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN = [0.55, 0, 1, 0.45] as const;

/* ── Variantes ─────────────────────────────── */

const productVariants: Variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "110%" : "-110%", opacity: 0, rotate: dir * 10 }),
    center: { x: "0%", opacity: 1, rotate: 0, transition: { duration: 0.9, ease: EASE_OUT } },
    exit: (dir: number) => ({
        x: dir > 0 ? "-110%" : "110%",
        opacity: 0,
        rotate: -dir * 10,
        transition: { duration: 0.7, ease: EASE_IN },
    }),
};

const backgroundVariants: Variants = {
    active: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: EASE_OUT } },
    inactive: { opacity: 0, scale: 1.08, transition: { duration: 1.2, ease: EASE_OUT } },
};

const labelVariants: Variants = {
    enter: { opacity: 0, y: 12 },
    center: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.25, ease: EASE_IN } },
};

export default function NewHero() {
    const [[index, direction], setSlide] = useState<[number, number]>([0, 0]);
    const current = PRODUCTS[index];

    const paginate = (dir: number) => {
        setSlide(([i]) => [(i + dir + PRODUCTS.length) % PRODUCTS.length, dir]);
    };

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") paginate(1);
            if (e.key === "ArrowLeft") paginate(-1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const onDragEnd = (_: unknown, info: PanInfo) => {
        if (info.offset.x < -SWIPE_THRESHOLD) paginate(1);
        else if (info.offset.x > SWIPE_THRESHOLD) paginate(-1);
    };

    return (
        <section
            id="inicio"
            className="relative flex h-svh w-full flex-col justify-center overflow-hidden bg-black md:flex-row md:items-center md:justify-end md:px-16"
        >
            {/* ── CAPA 1: FONDOS ── */}
            <div className={cn("absolute inset-0 z-0", ENTER_ANIM.fade, "[animation-duration:1s]")}>
                {PRODUCTS.map((p, i) => (
                    <motion.div
                        key={p.key}
                        variants={backgroundVariants}
                        initial={false}
                        animate={i === index ? "active" : "inactive"}
                        className="absolute inset-0"
                    >
                        <BackgroundPicture desktop={p.bgDesktop} mobile={p.bgMobile} priority={i === 0} />
                    </motion.div>
                ))}
            </div>

            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/30 md:bg-gradient-to-r md:from-black/40 md:via-transparent md:to-black/60" />

            {/* ── CAPA 2: ESCENARIO DEL PRODUCTO ── */}
            <div className="absolute inset-0 z-10 md:inset-y-0 md:left-0 md:right-auto md:w-2/5">
                <div className={cn("relative size-full", ENTER_ANIM.zoom, "[animation-delay:200ms]")}>
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={current.key}
                            custom={direction}
                            variants={productVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.35}
                            onDragEnd={onDragEnd}
                            className="absolute inset-0 flex cursor-grab items-center justify-center active:cursor-grabbing"
                        >
                            <div className="relative aspect-[3/4] h-[85%] -translate-x-[17%] translate-y-[9%] select-none md:-translate-x-[24%] md:translate-y-[7%]">
                                <Image
                                    src={current.product}
                                    alt={current.name}
                                    fill
                                    sizes={PRODUCT_SIZES}
                                    quality={90}
                                    priority={index === 0}
                                    draggable={false}
                                    className="pointer-events-none scale-[1.8] object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)] md:scale-[3.2]"
                                />
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Text Button superpuesto con fondo Blur & Gradient suave */}
                    <button
                        type="button"
                        onClick={() => paginate(1)}
                        className={cn(
                            "pointer-events-auto absolute bottom-[12%] left-[53%] z-30 hidden items-center gap-3 rounded-full px-5 py-2 text-white transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer md:flex",
                            "bg-gradient-to-r from-black/40 via-black/25 to-black/40 backdrop-blur-md border border-white/10 shadow-lg",
                            ENTER_ANIM.fade,
                            "[animation-delay:600ms]"
                        )}
                    >
                        <motion.div
                            animate={{ x: [-2, 6, -2] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                            className="text-[#BCC90F] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                        >
                            <svg
                                className="size-6 sm:size-7"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                                <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6" />
                                <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                                <path d="M18 8a2 2 0 0 1 2 2v4a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.8-5.9-2.2L2 17" />
                            </svg>
                        </motion.div>

                        <span className="font-urbanist text-sm sm:text-base font-bold tracking-widest uppercase text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
        Desliza
    </span>
                    </button>

                    <div className="pointer-events-none absolute inset-0 bg-black/45 md:hidden" />
                </div>

                {/* Botón Siguiente (solo móvil) */}
                <div
                    className={cn(
                        "pointer-events-auto absolute bottom-8 left-1/2 -translate-x-1/2 md:hidden",
                        ENTER_ANIM.fade,
                        "[animation-delay:600ms]"
                    )}
                >
                    <button
                        type="button"
                        onClick={() => paginate(1)}
                        className="
                            group relative inline-flex items-center gap-3 rounded-[100px] bg-white/10 py-3 pl-8 pr-3 text-base font-bold text-white backdrop-blur-md
                            transition-all duration-300 hover:scale-[1.02] hover:bg-white/15 active:scale-[0.98] sm:text-lg
                            border-t border-white/20
                            shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),_inset_0_-4px_8px_rgba(0,0,0,0.5),_0_10px_20px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.2)]
                        "
                    >
                        <span className="select-none font-urbanist tracking-wide">Siguiente</span>
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-[scale] group-hover:scale-105">
                            <svg
                                className="size-5 transition-transform duration-300 group-hover:translate-x-0.5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </span>
                    </button>
                </div>
            </div>

            {/* ── CAPA 3: TEXTO + CTA ── */}
            <div className="relative z-20 flex w-full flex-col items-center justify-center px-6 pt-16 text-center md:w-3/5 md:px-4 md:pt-0">
                <h1
                    className={cn(
                        "font-clash text-3xl font-semibold leading-none tracking-wide text-white drop-shadow-md sm:text-4xl md:text-[50px]",
                        ENTER_ANIM.blurUp
                    )}
                >
                    Una pausa que nace <br /> de nuestra tierra
                </h1>

                <p
                    className={cn(
                        "mt-4 max-w-md text-base font-light text-gray-200 drop-shadow md:text-lg",
                        ENTER_ANIM.up,
                        "[animation-delay:150ms]"
                    )}
                >
                    Café cultivado desde las alturas <br />{" "}
                    <span className="text-[#d4df37]">del Perú hasta tu taza.</span>
                </p>

                <div className={cn("mt-8 flex w-full flex-wrap items-center justify-center gap-4", ENTER_ANIM.up, "[animation-delay:300ms]")}>
                    <Link
                        href="#cafes"
                        className="
                            group relative inline-flex items-center gap-4 rounded-[100px] bg-[#BCC90F] py-2 pl-7 pr-2 text-base font-bold text-[#132219]
                            transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] sm:text-lg
                            border-t border-white/40
                            shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.2)]
                        "
                    >
                        <span className="relative grid select-none overflow-hidden pr-1 font-urbanist tracking-wide">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.span
                                    key={current.cta}
                                    variants={labelVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="block"
                                >
                                    {current.cta}
                                </motion.span>
                            </AnimatePresence>
                        </span>

                        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#132219] text-[#BCC90F] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.15)] transition-[scale] group-hover:scale-105">
                            <CartIcon className="size-6 transition-[scale] group-hover:scale-110" />
                        </span>
                    </Link>

                    <Link
                        href="#nosotros"
                        className="
                            relative inline-flex items-center justify-center rounded-[100px] bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-md
                            transition-all duration-300 hover:scale-[1.02] hover:bg-white/15 active:scale-[0.98] sm:text-lg
                            border-t border-white/20
                            shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),_inset_0_-4px_8px_rgba(0,0,0,0.5),_0_10px_20px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.2)]
                        "
                    >
                        <span className="select-none font-urbanist tracking-wide">Conócenos más</span>
                    </Link>
                </div>

                <div className={cn("mt-6 flex items-center gap-2", ENTER_ANIM.fade, "[animation-delay:450ms]")}>
                    {PRODUCTS.map((p, i) => (
                        <button
                            key={p.key}
                            type="button"
                            onClick={() => setSlide([i, i > index ? 1 : -1])}
                            aria-label={`Ver ${p.name}`}
                            aria-current={i === index}
                            className={cn(
                                "h-1.5 cursor-pointer rounded-full transition-[width,background-color] duration-300",
                                i === index ? "w-6 bg-[#BCC90F]" : "w-1.5 bg-white/40 hover:bg-white/70"
                            )}
                        />
                    ))}
                </div>
            </div>

            <div
                className={cn(
                    "pointer-events-none absolute -right-5 bottom-0 top-0 z-20 hidden h-full items-center justify-end overflow-hidden pr-2 md:flex",
                    ENTER_ANIM.fade,
                    "[animation-delay:500ms]"
                )}
            >
                <Image
                    src="/assets/brand/sayni-vertical-brand.svg"
                    alt=""
                    width={180}
                    height={1000}
                    className="h-full w-auto select-none object-contain opacity-90 mix-blend-screen"
                    priority
                />
            </div>

            <div aria-hidden className="pointer-events-none absolute size-0 overflow-hidden opacity-0">
                {PRODUCTS.map((p) => (
                    <div key={p.key} className="relative size-px">
                        <Image src={p.product} alt="" fill sizes={PRODUCT_SIZES} loading="eager" />
                    </div>
                ))}
            </div>
        </section>
    );
}

function BackgroundPicture({ desktop, mobile, priority }: { desktop: string; mobile: string; priority: boolean }) {
    const common = { alt: "", fill: true, sizes: "100vw", priority, loading: priority ? undefined : ("eager" as const) };
    const {
        props: { srcSet: desktopSrcSet },
    } = getImageProps({ ...common, src: desktop });
    const { props: mobileProps } = getImageProps({ ...common, src: mobile });

    return (
        <picture>
            <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img {...mobileProps} alt="" className="object-cover object-center" />
        </picture>
    );
}

function CartIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.89-2-1.99-2z" />
        </svg>
    );
}