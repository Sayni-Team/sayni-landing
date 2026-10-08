import Image from "next/image";
import RevealSection from "@/components/ui/RevealSection";
import { REVEAL } from "@/lib/reveal";
import { cn } from "@/lib/utils";

// Líneas junto a "Sayni" que se dibujan desde el centro (solo escala horizontal)
const LINE_DRAW =
    "scale-x-0 transition-[scale] duration-700 ease-out group-data-[inview=true]/reveal:scale-x-100 motion-reduce:scale-x-100 motion-reduce:transition-none";

export default function AboutUs() {
    return (
        <RevealSection
            id="nosotros"
            /* Sin overflow-hidden: el Divider puede sobresalir sin cortarse */
            className="relative bg-sayni-black px-10 py-16 text-sayni-light sm:px-26 sm:py-20 lg:px-16 lg:py-24"
        >
            <div className="mx-auto max-w-4xl space-y-10 sm:space-y-12">
                {/* ENCABEZADO */}
                <div className="space-y-3 text-center">
                    {/* Etiqueta: baja; las líneas se dibujan hacia fuera */}
                    <div className={cn("flex items-center justify-center gap-3", REVEAL.down)}>
                        <span className={cn("h-px w-12 origin-right bg-white/20 sm:w-16", LINE_DRAW, "delay-300")} />
                        <span className="font-heading text-xs font-medium uppercase tracking-widest text-sayni-lime sm:text-sm">
                            Sayni
                        </span>
                        <span className={cn("h-px w-12 origin-left bg-white/20 sm:w-16", LINE_DRAW, "delay-300")} />
                    </div>

                    {/* Título: crece hasta su tamaño */}
                    <h2
                        className={cn(
                            "font-heading text-3xl font-bold tracking-wide text-white sm:text-4xl lg:text-5xl",
                            REVEAL.zoomIn,
                            "delay-100"
                        )}
                    >
                        Una historia que <br className="hidden sm:block" />
                        comienza en el origen
                    </h2>
                </div>

                {/* CONTENIDO PRINCIPAL */}
                <div className="mx-auto grid max-w-3xl grid-cols-1 items-stretch gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
                    {/* Imagen: entra desde la izquierda; la foto hace zoom out dentro del marco */}
                    <div
                        className={cn(
                            "relative mx-auto aspect-[2/3] w-full max-w-[260px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl sm:max-w-sm",
                            REVEAL.left,
                            "delay-200"
                        )}
                    >
                        <Image
                            src="/assets/features/about-us-image.webp"
                            alt="Planta de café Sayni en ambiente natural"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className={cn("object-cover object-center", REVEAL.zoomOut, "duration-[1400ms] delay-200")}
                        />
                    </div>

                    {/* COLUMNA DERECHA */}
                    <div className="flex flex-col justify-between px-1 py-2 text-center md:text-left">
                        <div className="my-auto flex flex-1 flex-col justify-center space-y-4">
                            {/* Primer párrafo: sube */}
                            <p
                                className={cn(
                                    "text-sm font-light leading-relaxed text-white sm:text-base lg:text-2xl",
                                    REVEAL.up,
                                    "delay-[400ms]"
                                )}
                            >
                                Sayni nace de la conexión entre la tierra, las personas y el café peruano. Inspirados en Samay, el respiro que renueva, y Ayni, la reciprocidad que nos une, llevamos en cada taza una parte de nuestro origen.
                            </p>

                            {/* Segundo párrafo: fade simple */}
                            <p
                                className={cn(
                                    "text-sm font-normal leading-relaxed text-sayni-lime sm:text-base lg:text-2xl",
                                    REVEAL.fade,
                                    "delay-[600ms] duration-1000"
                                )}
                            >
                                De nuestra tierra a tu taza, creamos momentos para hacer una pausa, recargar el alma y continuar.
                            </p>
                        </div>

                        {/* Redes Sociales: Instagram & Facebook */}
                        <div
                            className={cn(
                                "relative z-21 mt-auto space-y-3 pt-6 sm:pt-8",
                                REVEAL.zoomOut,
                                "delay-[750ms]"
                            )}
                        >
                            <span className="block text-sm font-light text-gray-400">Síguenos y conoce más</span>

                            <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start sm:gap-6">
                                {/* Instagram */}
                                <a
                                    href="https://instagram.com/sayni_peru"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-2 text-base font-medium text-sayni-lime transition-colors duration-300 hover:text-white sm:text-xl"
                                >
                                    <svg
                                        className="size-5 fill-none stroke-current transition-transform duration-300 group-hover:scale-110 sm:size-6"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden
                                    >
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                    </svg>
                                    <span>@sayni_peru</span>
                                </a>

                                <span className="hidden text-white/20 sm:inline">•</span>

                                {/* Facebook */}
                                <a
                                    href="https://www.facebook.com/share/1Cf2MD3RBb/?mibextid=wwXIfr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-center gap-2 text-base font-medium text-sayni-lime transition-colors duration-300 hover:text-white sm:text-xl"
                                >
                                    <svg
                                        className="size-5 fill-current transition-transform duration-300 group-hover:scale-110 sm:size-6"
                                        viewBox="0 0 24 24"
                                        aria-hidden
                                    >
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                    </svg>
                                    <span>Sayni</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </RevealSection>
    );
}