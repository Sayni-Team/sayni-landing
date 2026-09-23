"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function AboutUs() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const section = sectionRef.current;

        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(section);
                }
            },
            {
                threshold: 0.15,
                rootMargin: "0px 0px -60px 0px",
            }
        );

        observer.observe(section);

        return () => observer.disconnect();
    }, []);

    const revealStyle = (
        delay: number,
        duration = 1000
    ): React.CSSProperties => ({
        opacity: isVisible ? 1 : 0,
        transform: isVisible
            ? "translate3d(0, 0, 0)"
            : "translate3d(0, 28px, 0)",
        transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
        willChange: "opacity, transform",
    });

    return (
        <section
            ref={sectionRef}
            id="nosotros"
            className="py-16 sm:py-20 lg:py-24 px-6 lg:px-16 bg-sayni-black text-sayni-light overflow-hidden"
        >
            <div className="max-w-4xl mx-auto space-y-10 sm:space-y-12">

                {/* ====================================================== */}
                {/* ENCABEZADO */}
                {/* ====================================================== */}

                <div
                    className="text-center space-y-3"
                    style={revealStyle(0, 1100)}
                >
                    <div className="flex items-center justify-center gap-3">
                        <span className="h-[1px] w-12 sm:w-16 bg-white/20" />

                        <span className="text-sayni-lime font-heading tracking-widest text-xs sm:text-sm uppercase font-medium">
                            Sayni
                        </span>

                        <span className="h-[1px] w-12 sm:w-16 bg-white/20" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-white tracking-tight">
                        Una historia que <br className="hidden sm:block" />
                        comienza en el origen
                    </h2>
                </div>

                {/* ====================================================== */}
                {/* CONTENIDO PRINCIPAL */}
                {/* ====================================================== */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-stretch max-w-3xl mx-auto">

                    {/* ================================================== */}
                    {/* IMAGEN */}
                    {/* ================================================== */}

                    <div
                        className="relative aspect-[2/3] w-full max-w-sm mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
                        style={revealStyle(180, 1200)}
                    >
                        <Image
                            src="/assets/features/about-us.webp"
                            alt="Taza de café Sayni en ambiente natural"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover object-center transition-transform duration-[1800ms] ease-out"
                            priority
                        />
                    </div>

                    {/* ================================================== */}
                    {/* COLUMNA DERECHA */}
                    {/* ================================================== */}

                    <div className="flex flex-col justify-between py-2 text-center md:text-left">

                        {/* ============================================== */}
                        {/* BLOQUE DE TEXTO */}
                        {/* ============================================== */}

                        <div className="flex flex-col justify-center flex-1 space-y-4 my-auto">

                            {/* Primer párrafo */}
                            <p
                                className="text-gray-300 text-sm sm:text-xl leading-relaxed font-light"
                                style={revealStyle(380, 1000)}
                            >
                                Sayni nace de la conexión entre la tierra, las personas y el café peruano. Inspirados en{" "}
                                <strong className="text-white font-medium">
                                    Samay
                                </strong>
                                , el respiro que renueva, y{" "}
                                <strong className="text-white font-medium">
                                    Ayni
                                </strong>
                                , la reciprocidad que nos une, llevamos en cada taza una parte de nuestro origen.
                            </p>

                            {/* Segundo párrafo */}
                            <p
                                className="text-sayni-lime text-sm sm:text-xl font-normal leading-relaxed"
                                style={revealStyle(520, 1000)}
                            >
                                De nuestra tierra a tu taza, creamos momentos para hacer una pausa, recargar el alma y continuar.
                            </p>
                        </div>

                        {/* ============================================== */}
                        {/* BADGES */}
                        {/* ============================================== */}

                        <div
                            className="space-y-3 pt-6 mt-auto"
                            style={revealStyle(650, 900)}
                        >
                            <span className="text-xs text-gray-400 uppercase tracking-wider block">
                                Conoce más
                            </span>

                            <div className="flex flex-wrap justify-center md:justify-start gap-2.5">

                                {/* Badge 1 */}
                                <div
                                    className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200"
                                    style={revealStyle(760, 800)}
                                >
                                    100% Peruano
                                </div>

                                {/* Badge 2 */}
                                <div
                                    className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200"
                                    style={revealStyle(850, 800)}
                                >
                                    Comercio Justo
                                </div>

                                {/* Badge 3 */}
                                <div
                                    className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200"
                                    style={revealStyle(940, 800)}
                                >
                                    Tueste Especial
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}