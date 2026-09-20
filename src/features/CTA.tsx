"use client";

import Link from "next/link";

export default function CtaSection() {
    return (
        <section className="w-full py-20 lg:py-28 px-6 bg-sayni-black text-white text-center flex flex-col items-center justify-center">
            <div className="max-w-2xl mx-auto space-y-8">

                {/* TÍTULO EN 2 LÍNEAS CON CLASH GROTESK */}
                <h2 className="font-clash text-3xl sm:text-4xl lg:text-5xl font-medium tracking-wide leading-none text-white">
                    Lleva nuestra esencia <br />
                    a tu próxima taza
                </h2>

                {/* BOTÓN CTA CON PADDING INTERNO Y CÍRCULO EN LA FLECHA */}
                <div className="pt-2">
                    <Link
                        href="https://wa.me/"
                        target="_blank"
                        className="inline-flex items-center gap-3 bg-[#BCC90F] text-black font-semibold pl-6 pr-2 py-2 rounded-full hover:bg-opacity-90 transition-all shadow-lg group text-sm sm:text-base"
                    >
                        <span>Obtén tu Sayni</span>
                        <span className="bg-[#121212] text-[#BCC90F] rounded-full p-2 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                            <svg
                                className="w-4 h-4 stroke-[2.5]"
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
                </div>

            </div>
        </section>
    );
}