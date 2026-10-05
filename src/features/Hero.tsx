"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ENTER_ANIM } from "@/lib/reveal";

const isMobile = () =>
    typeof window !== "undefined" && window.innerWidth <= 768;

type ProductType = "clasico" | "geysha";

// Estilo común de los botones circulares de navegación
const NAV_BUTTON = cn(
    "cursor-pointer w-11 h-11 rounded-full flex items-center justify-center",
    "bg-white/5 backdrop-blur-md text-white",
    "hover:scale-110 active:scale-95 hover:bg-white/10",
    "transition-all duration-300 group border-t border-white/20",
    "shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),_inset_0_-3px_6px_rgba(0,0,0,0.5),_0_10px_20px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.2)]"
);

export default function Hero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [mobile, setMobile] = useState(false);
    const [activeProduct, setActiveProduct] = useState<ProductType>("clasico");

    const currentFrameRef = useRef<number>(45);
    const targetFrameRef = useRef<number>(150);
    const animationSpeedRef = useRef<number>(0.4);

    useEffect(() => {
        setMobile(isMobile());
        const onResize = () => setMobile(isMobile());
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        if (!mobile) return;
        const video = videoRef.current;
        if (!video) return;
        video.play().catch(() => {});
    }, [mobile]);

    useEffect(() => {
        if (mobile) return;

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        const frameCount = 240;
        const images: HTMLImageElement[] = [];

        const CRITICAL_FRAMES = 150;
        for (let i = 1; i <= Math.min(CRITICAL_FRAMES, frameCount); i++) {
            const img = new window.Image();
            img.src = `/assets/hero-sequence/frame_${String(i).padStart(4, "0")}.jpg`;
            images[i - 1] = img;
        }

        const preloadTimeout = setTimeout(() => {
            for (let i = CRITICAL_FRAMES + 1; i <= frameCount; i++) {
                const img = new window.Image();
                img.src = `/assets/hero-sequence/frame_${String(i).padStart(4, "0")}.jpg`;
                images[i - 1] = img;
            }
        }, 300);

        const render = () => {
            const targetFrame = Math.floor(currentFrameRef.current);
            const img = images[targetFrame];

            if (!img || !img.complete) {
                if (img) img.onload = render;
                return;
            }

            const cw = canvas.width / (window.devicePixelRatio || 1);
            const ch = canvas.height / (window.devicePixelRatio || 1);
            const scale = Math.max(cw / img.width, ch / img.height);
            const dw = img.width * scale;
            const dh = img.height * scale;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
        };

        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            render();
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        if (images[62]) {
            if (images[62].complete) {
                render();
            } else {
                images[62].onload = render;
            }
        }

        let animationFrameId: number;

        const animate = () => {
            const current = currentFrameRef.current;
            const target = targetFrameRef.current;
            const speed = animationSpeedRef.current;

            if (Math.abs(current - target) > speed) {
                if (current < target) {
                    currentFrameRef.current += speed;
                } else {
                    currentFrameRef.current -= speed;
                }
            } else {
                currentFrameRef.current = target;
            }

            render();
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            clearTimeout(preloadTimeout);
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [mobile]);

    const toggleProduct = () => {
        if (activeProduct === "clasico") {
            setActiveProduct("geysha");
            targetFrameRef.current = 230;
            animationSpeedRef.current = 0.4;
        } else {
            setActiveProduct("clasico");
            targetFrameRef.current = 150;
            animationSpeedRef.current = 0.4;
        }
    };

    if (mobile) {
        return (
            <section className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
                <video
                    ref={videoRef}
                    className={cn(
                        "absolute inset-0 w-full h-full object-cover pointer-events-none",
                        ENTER_ANIM.fade,
                        "duration-1000"
                    )}
                    src="/assets/features/hero/hero_saymi.mp4"
                    muted
                    autoPlay
                    loop
                    playsInline
                    disablePictureInPicture
                    preload="auto"
                />
                <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
            </section>
        );
    }

    return (
        <section
            ref={wrapperRef}
            className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-end px-8 md:px-16"
        >
            <canvas
                ref={canvasRef}
                className={cn(
                    "absolute inset-0 w-full h-full pointer-events-none z-0",
                    ENTER_ANIM.fade,
                    "duration-1000"
                )}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/60 z-10 pointer-events-none" />

            {/* BOTÓN IZQUIERDO: el contenedor lleva posición y entrada; el botón, su hover */}
            <div
                className={cn(
                    "absolute left-6 md:left-19 top-1/2 -translate-y-1/2 z-30",
                    ENTER_ANIM.zoom,
                    "delay-500"
                )}
            >
                <button onClick={toggleProduct} className={NAV_BUTTON} aria-label="Anterior empaque Sayni">
                    <svg
                        className="w-5 h-5 stroke-current transition-transform group-hover:-translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            {/* BOTÓN DERECHO: mismo patrón */}
            <div
                className={cn(
                    "absolute left-[38%] xl:left-[42%] top-1/2 -translate-y-1/2 z-30",
                    ENTER_ANIM.zoom,
                    "delay-500"
                )}
            >
                <button onClick={toggleProduct} className={NAV_BUTTON} aria-label="Siguiente empaque Sayni">
                    <svg
                        className="w-5 h-5 stroke-current transition-transform group-hover:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* CONTENIDO TEXTO + CALL TO ACTIONS */}
            <div className="relative z-20 w-3/5 flex flex-col items-center justify-center text-center px-4">
                {/* TÍTULO H1 CON BLUR + TRANSLATE Y */}
                <h1
                    className={cn(
                        "text-4xl md:text-[50px] font-clash font-semibold text-white tracking-wide leading-none drop-shadow-md",
                        ENTER_ANIM.blurUp
                    )}
                >
                    Una pausa que nace <br /> de nuestra tierra
                </h1>

                {/* PÁRRAFO CON BLUR + TRANSLATE Y + DELAY */}
                <p
                    className={cn(
                        "mt-4 text-base md:text-lg text-gray-200 max-w-md font-light drop-shadow",
                        ENTER_ANIM.blurUp,
                        "delay-150"
                    )}
                >
                    Café cultivado desde las alturas del <br />{" "}
                    <span className="text-[#d4df37]">del Perú hasta tu taza.</span>
                </p>

                {/* BOTONES CON TRANSLATE Y + DELAY (la entrada va en el contenedor) */}
                <div
                    className={cn(
                        "mt-8 flex items-center justify-center gap-4 w-full",
                        ENTER_ANIM.up,
                        "delay-300"
                    )}
                >
                    <Link
                        href="#cafes"
                        className="
                            inline-flex items-center gap-4 bg-[#BCC90F] text-[#132219] font-bold
                            pl-7 pr-2 py-2 rounded-[100px] hover:scale-[1.02] active:scale-[0.98]
                            transition-all duration-300 group text-base sm:text-lg relative
                            border-t border-white/40
                            shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.2)]
                        "
                    >
                        <span className="font-urbanist tracking-wide select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.15)] pr-1 transition-all duration-300">
                            {activeProduct === "clasico" ? "Pedir Clásico" : "Pedir Geisha"}
                        </span>

                        <span className="
                            bg-[#132219] text-[#BCC90F] rounded-full w-11 h-11 flex items-center justify-center
                            transition-transform group-hover:scale-105 shrink-0
                            shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.15)]
                        ">
                            <svg
                                className="w-6 h-6 transition-transform group-hover:scale-110"
                                viewBox="0 0 28 28"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden
                            >
                                <path d="M6.51908 24.9813C6.06213 24.5243 5.83366 23.975 5.83366 23.3334C5.83366 22.6917 6.06213 22.1424 6.51908 21.6855C6.97602 21.2285 7.52533 21 8.16699 21C8.80866 21 9.35796 21.2285 9.81491 21.6855C10.2719 22.1424 10.5003 22.6917 10.5003 23.3334C10.5003 23.975 10.2719 24.5243 9.81491 24.9813C9.35796 25.4382 8.80866 25.6667 8.16699 25.6667C7.52533 25.6667 6.97602 25.4382 6.51908 24.9813ZM18.1857 24.9813C17.7288 24.5243 17.5003 23.975 17.5003 23.3334C17.5003 22.6917 17.7288 22.1424 18.1857 21.6855C18.6427 21.2285 19.192 21 19.8337 21C20.4753 21 21.0246 21.2285 21.4816 21.6855C21.9385 22.1424 22.167 22.6917 22.167 23.3334C22.167 23.975 21.9385 24.5243 21.4816 24.9813C21.0246 25.4382 20.4753 25.6667 19.8337 25.6667C19.192 25.6667 18.6427 25.4382 18.1857 24.9813ZM7.17533 7.00004L9.97533 12.8334H18.142L21.3503 7.00004H7.17533ZM6.06699 4.66671H23.2753C23.7225 4.66671 24.0628 4.86601 24.2962 5.26462C24.5295 5.66324 24.5392 6.06671 24.3253 6.47504L20.1837 13.9417C19.9698 14.3306 19.683 14.632 19.3232 14.8459C18.9635 15.0598 18.5698 15.1667 18.142 15.1667H9.45033L8.16699 17.5H22.167V19.8334H8.16699C7.29199 19.8334 6.63088 19.4493 6.18366 18.6813C5.73644 17.9132 5.71699 17.15 6.12533 16.3917L7.70033 13.5334L3.50033 4.66671H1.16699V2.33337H4.95866L6.06699 4.66671Z" fill="currentColor"/>
                            </svg>
                        </span>
                    </Link>

                    <Link
                        href="#nosotros"
                        className="
                            inline-flex items-center justify-center bg-white/10 backdrop-blur-md text-white font-bold
                            px-8 py-4 rounded-[100px] hover:scale-[1.02] active:scale-[0.98] hover:bg-white/15
                            transition-all duration-300 group text-base sm:text-lg relative
                            border-t border-white/20
                            shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),_inset_0_-4px_8px_rgba(0,0,0,0.5),_0_10px_20px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.2)]
                        "
                    >
                        <span className="font-urbanist tracking-wide select-none">
                            Conócenos más
                        </span>
                    </Link>
                </div>
            </div>

            {/* MARCA DE AGUA CON FADE PURO */}
            <div
                className={cn(
                    "absolute -right-5 top-0 bottom-0 h-full z-20 pointer-events-none flex items-center justify-end overflow-hidden pr-2",
                    ENTER_ANIM.fade,
                    "delay-500"
                )}
            >
                <Image
                    src="/assets/brand/sayni-vertical-brand.svg"
                    alt="Sayni Brand"
                    width={180}
                    height={1000}
                    className="h-full w-auto object-contain opacity-90 select-none mix-blend-screen"
                    priority
                />
            </div>
        </section>
    );
}