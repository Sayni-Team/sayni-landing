"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const isMobile = () =>
    typeof window !== "undefined" && window.innerWidth <= 768;

type ProductType = "clasico" | "geysha";

export default function Hero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [mobile, setMobile] = useState(false);
    const [activeProduct, setActiveProduct] = useState<ProductType>("clasico");
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Referencias mutables para el loop de animación sin re-renders
    const currentFrameRef = useRef<number>(53); // Frame inicial de entrada Clásico
    const targetFrameRef = useRef<number>(150); // Frame final Clásico
    const animationSpeedRef = useRef<number>(0.5); // Velocidad de reproducción

    // 1. Detectar dispositivo móvil
    useEffect(() => {
        setMobile(isMobile());
        const onResize = () => setMobile(isMobile());
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // 2. Lógica para Mobile (Video continuo)
    useEffect(() => {
        if (!mobile) return;
        const video = videoRef.current;
        if (!video) return;
        video.play().catch(() => {});
    }, [mobile]);

    // 3. Lógica para Desktop (Canvas plano sin zoom ni parallax)
    useEffect(() => {
        if (mobile) return;

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        const frameCount = 240;
        const images: HTMLImageElement[] = [];

        // Pre-carga inicial crítica
        const CRITICAL_FRAMES = 150;
        for (let i = 1; i <= Math.min(CRITICAL_FRAMES, frameCount); i++) {
            const img = new window.Image();
            img.src = `/assets/hero-sequence/frame_${String(i).padStart(4, "0")}.jpg`;
            images[i - 1] = img;
        }

        // Pre-carga diferida para el resto de la secuencia (Geysha)
        const preloadTimeout = setTimeout(() => {
            for (let i = CRITICAL_FRAMES + 1; i <= frameCount; i++) {
                const img = new window.Image();
                img.src = `/assets/hero-sequence/frame_${String(i).padStart(4, "0")}.jpg`;
                images[i - 1] = img;
            }
        }, 300);

        const render = () => {
            let targetFrame = Math.floor(currentFrameRef.current);
            let img = images[targetFrame];

            // Fallback si la imagen aún no termina de cargar
            while (targetFrame > 0 && (!img || !img.complete)) {
                targetFrame--;
                img = images[targetFrame];
            }

            if (!img || !img.complete) return;

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

        if (images[52]) {
            images[52].onload = render;
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
                setIsTransitioning(false);
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
            animationSpeedRef.current = 0.6;
        } else {
            setActiveProduct("clasico");
            targetFrameRef.current = 150;
            animationSpeedRef.current = 0.6;
        }
    };

    // Render Móvil
    if (mobile) {
        return (
            <section className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
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

    // Render Desktop
    return (
        <section
            ref={wrapperRef}
            className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-end px-8 md:px-16"
        >
            {/* CANVAS UNICO DE FONDO COMPLETO */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none z-0"
            />

            {/* OVERLAY GRADIENT */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/60 z-10 pointer-events-none" />

            {/* BOTÓN IZQUIERDO (Ubicación respecto al lienzo) */}
            <button
                onClick={toggleProduct}
                className="
                    absolute cursor-pointer left-6 md:left-19 top-1/2 -translate-y-1/2 z-30
                    w-11 h-11 rounded-full flex items-center justify-center
                    bg-black/40 backdrop-blur-md text-white
                    hover:scale-110 active:scale-95 hover:bg-black/60
                    transition-all duration-300 group
                    border-t border-white/20
                    shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),_inset_0_-3px_6px_rgba(0,0,0,0.5),_0_10px_20px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.2)]
                "
                aria-label="Anterior empaque Sayni"
            >
                <svg
                    className="w-5 h-5 stroke-current transition-transform group-hover:-translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* BOTÓN DERECHO (Ajusta la clase left-[38%] o left-[40%] para separar/acercar respecto a la bolsa) */}
            <button
                onClick={toggleProduct}
                className="
                    absolute cursor-pointer left-[38%] xl:left-[42%] top-1/2 -translate-y-1/2 z-30
                    w-11 h-11 rounded-full flex items-center justify-center
                    bg-black/40 backdrop-blur-md text-white
                    hover:scale-110 active:scale-95 hover:bg-black/60
                    transition-all duration-300 group
                    border-t border-white/20
                    shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),_inset_0_-3px_6px_rgba(0,0,0,0.5),_0_10px_20px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.2)]
                "
                aria-label="Siguiente empaque Sayni"
            >
                <svg
                    className="w-5 h-5 stroke-current transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* CONTENIDO TEXTO + CALL TO ACTIONS */}
            <div className="relative z-20 max-w-xl text-center flex flex-col items-center mr-[8%]">
                <h1 className="text-4xl md:text-5xl font-clash font-semibold text-white tracking-wide leading-tight drop-shadow-md">
                    Una pausa que nace de nuestra tierra
                </h1>

                <p className="mt-4 text-base md:text-lg text-gray-200 max-w-md font-light drop-shadow">
                    Café peruano con origen, historia y propósito. Desde las alturas <span className="text-[#d4df37]">del Perú hasta tu taza.</span>
                </p>

                <div className="mt-8 flex items-center gap-4">
                    {/* BOTÓN PRINCIPAL 3D (LIMA) */}
                    <Link
                        href="#comprar"
                        className="
                            inline-flex items-center gap-4 bg-[#BCC90F] text-[#132219] font-bold
                            pl-7 pr-2 py-2.5 rounded-[100px] hover:scale-[1.02] active:scale-[0.98]
                            transition-all duration-300 group text-base sm:text-lg relative
                            border-t border-white/40
                            shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.2)]
                        "
                    >
                        <span className="font-urbanist tracking-wide select-none drop-shadow-[0_1px_1px_rgba(255,255,255,0.15)]">
                            Obtén tu Sayni
                        </span>

                        <span className="
                            bg-[#132219] text-[#BCC90F] rounded-full w-10 h-10 flex items-center justify-center
                            transition-transform group-hover:scale-105 shrink-0
                            shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4),_0_2px_4px_rgba(0,0,0,0.15)]
                        ">
                            <svg
                                className="w-5 h-5 fill-current transition-transform group-hover:translate-x-0.5"
                                viewBox="0 0 24 24"
                            >
                                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </Link>

                    {/* BOTÓN SECUNDARIO 3D (OSCURO) */}
                    <Link
                        href="#conocenos"
                        className="
                            inline-flex items-center justify-center bg-black/40 backdrop-blur-md text-white font-bold
                            px-8 py-4 rounded-[100px] hover:scale-[1.02] active:scale-[0.98] hover:bg-black/60
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

            {/* MARCA DE AGUA VERTICAL SAYNI */}
            <div className="absolute -right-5 top-0 bottom-0 h-full z-20 pointer-events-none flex items-center justify-end overflow-hidden pr-2">
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