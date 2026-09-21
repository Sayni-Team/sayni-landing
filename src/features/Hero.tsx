"use client";

import { useState, useEffect, useRef } from "react";

const isMobile = () =>
    typeof window !== "undefined" && window.innerWidth <= 768;

export default function Hero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [mobile, setMobile] = useState(false);

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

    // 3. Lógica para Desktop (Canvas Sequence + Parallax)
    useEffect(() => {
        if (mobile) return;

        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        const PARALLAX_STRENGTH = 18;
        const LERP_SPEED = 0.05;

        const onMouseMove = (e: MouseEvent) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * -2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * -2;
        };

        window.addEventListener("mousemove", onMouseMove);

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        const frameCount = 240; // Total de fotogramas (10s * 24fps)
        const images: HTMLImageElement[] = [];

        // CARGA CRÍTICA INICIAL (Primeros 15 fotogramas para render inmediato)
        for (let i = 1; i <= Math.min(15, frameCount); i++) {
            const img = new Image();
            img.src = `/assets/hero-sequence/frame_${String(i).padStart(4, "0")}.jpg`;
            images[i - 1] = img;
        }

        // LAZY PRELOAD (Difiere la carga del resto para optimizar LCP/TBT)
        const preloadTimeout = setTimeout(() => {
            for (let i = 16; i <= frameCount; i++) {
                const img = new Image();
                img.src = `/assets/hero-sequence/frame_${String(i).padStart(4, "0")}.jpg`;
                images[i - 1] = img;
            }
        }, 300);

        let currentFrameIndex = 0;

        const render = () => {
            const img = images[Math.floor(currentFrameIndex)];
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

        if (images[0]) {
            images[0].onload = render;
        }

        let animationFrameId: number;

        const animate = () => {
            // Animación continua de secuencia
            currentFrameIndex = (currentFrameIndex + 0.4) % frameCount;

            // Suavizado del Parallax
            const deltaX = mouseX * PARALLAX_STRENGTH - currentX;
            const deltaY = mouseY * PARALLAX_STRENGTH - currentY;

            currentX += deltaX * LERP_SPEED;
            currentY += deltaY * LERP_SPEED;

            const time = Date.now() / 1000;
            const floatY = Math.sin(time * 0.5) * 6;
            const floatX = Math.sin(time * 0.3) * 3;

            canvas.style.transform = `scale(1.05) translate(${currentX + floatX}px, ${currentY + floatY}px)`;

            render();
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            clearTimeout(preloadTimeout);
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", onMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [mobile]);

    // Render para Dispositivos Móviles
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
                <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
            </section>
        );
    }

    // Render para Desktop (Canvas)
    return (
        <section ref={wrapperRef} className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-75 ease-out"
            />
            <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
        </section>
    );
}