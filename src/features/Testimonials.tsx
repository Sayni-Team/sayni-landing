"use client";

import Image from "next/image";

export default function TestimonialsSection() {
    return (
        <section className="relative w-full py-20 lg:py-32 px-6 overflow-hidden flex flex-col items-center justify-center min-h-[600px] text-white">

            {/* FONDO PRINCIPAL */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/assets/features/coffee_background.webp"
                    alt="Fondo café"
                    fill
                    className="object-cover object-center opacity-40"
                    priority
                />
                {/* Gradient overlay para suavizar bordes superior e inferior */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0e0e0e]/80 via-transparent to-[#0e0e0e]/80" />
            </div>

            {/* CONTENEDOR GENERAL MÁS ANCHO */}
            <div className="w-full max-w-5xl mx-auto text-center space-y-12 relative z-10 font-clash">

                {/* BADGES FLOTANTES SUPERIORES */}
                <div className="flex flex-wrap items-center justify-evenly gap-4 ">
                    {/* Badge 1: 87 puntos SCA */}
                    <div className="px-8 py-2.5 rounded-full bg-white/2 backdrop-blur-md border border-white/5 text-sm sm:text-lg font-medium shadow-xl">
                        <span className="text-[#BCC90F] font-bold">87</span> puntos SCA
                    </div>

                    {/* Badge 2: 100% café de Cusco */}
                    <div className="px-8 py-2.5 rounded-full bg-white/2 backdrop-blur-md border border-white/5 text-sm sm:text-lg font-medium shadow-xl">
                        <span className="text-[#BCC90F] font-bold">100%</span> café de Cusco
                    </div>
                </div>

                {/* SECCIÓN CITA / TESTIMONIAL (LÍMITE ESTRECHO INDEPENDIENTE) */}
                <div className="space-y-6 max-w-md sm:max-w-lg mx-auto">

                    {/* ENCABEZADO CON LÍNEAS CONECTORAS */}
                    <div className="flex items-center justify-center gap-3 mb-0">
                        <span className="h-[1px] w-8 sm:w-16 bg-white/20" />
                        <span className="font-urbanist text-xs sm:text-sm font-medium tracking-wide whitespace-nowrap">
                            <span className="text-[#BCC90F]">¿Qué opinan</span> de nosotros?
                        </span>
                        <span className="h-[1px] w-8 sm:w-16 bg-white/20" />
                    </div>

                    {/* FRASE ENTRE COMILLAS EN VERDE LIMA (4 LÍNEAS EXACTAS CON CLASH GROTESK) */}
                    <blockquote className="font-clash text-2xl sm:text-3xl lg:text-4xl font-medium leading-tight tracking-wide text-white max-w-[280px] sm:max-w-[380px] mx-auto text-balance">
                        <span className="text-[#BCC90F] font-serif">“</span>
                        Haz una pausa y <br/> recarga tu alma con la <br/> esencia que nace de nuestra tierra
                        <span className="text-[#BCC90F] font-serif">”</span>
                    </blockquote>
                </div>

                {/* GALERÍA DE 3 IMÁGENES (MÁS COMPACTAS) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto pt-2">
                    {/* Imagen 1 */}
                    <div className="relative aspect-[3/2] w-full transition-transform duration-300 hover:scale-105">
                        <Image
                            src="/assets/features/family.webp"
                            alt="Proceso de café 1"
                            fill
                            className="object-contain"
                        />
                    </div>

                    {/* Imagen 2 */}
                    <div className="relative aspect-[3/2] w-full transition-transform duration-300 hover:scale-105">
                        <Image
                            src="/assets/features/field.webp"
                            alt="Proceso de café 2"
                            fill
                            className="object-contain"
                        />
                    </div>

                    {/* Imagen 3 */}
                    <div className="relative aspect-[3/2] w-full transition-transform duration-300 hover:scale-105">
                        <Image
                            src="/assets/features/farmer.webp"
                            alt="Proceso de café 3"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}