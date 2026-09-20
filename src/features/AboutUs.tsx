import Image from "next/image";

export default function AboutUs() {
    return (
        <section id="nosotros" className="py-16 sm:py-20 lg:py-24 px-6 lg:px-16 bg-sayni-black text-sayni-light">
            <div className="max-w-4xl mx-auto space-y-10 sm:space-y-12">

                {/* 1. Encabezado con líneas decorativas y texto verde */}
                <div className="text-center space-y-3">
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

                {/* Grid principal de 2 columnas simétricas en escritorio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-stretch max-w-3xl mx-auto">

                    {/* Contenedor de la Imagen: Aspect Ratio estricto 2:3 */}
                    <div className="relative aspect-[2/3] w-full max-w-sm mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                        <Image
                            src="/assets/features/about-us.webp"
                            alt="Taza de café Sayni en ambiente natural"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover object-center transition-transform duration-700"
                            priority
                        />
                    </div>

                    {/* Columna Derecha de Texto dividida en 2 bloques principales */}
                    <div className="flex flex-col justify-between py-2 text-center md:text-left">

                        {/* Bloque 1: Contenedor para párrafos centrados verticalmente */}
                        <div className="flex flex-col justify-center flex-1 space-y-4 my-auto">
                            <p className="text-gray-300 text-sm sm:text-xl leading-relaxed font-light">
                                Sayni nace de la conexión entre la tierra, las personas y el café peruano. Inspirados en <strong className="text-white font-medium">Samay</strong>, el respiro que renueva, y <strong className="text-white font-medium">Ayni</strong>, la reciprocidad que nos une, llevamos en cada taza una parte de nuestro origen.
                            </p>

                            <p className="text-sayni-lime text-sm sm:text-xl font-normal leading-relaxed">
                                De nuestra tierra a tu taza, creamos momentos para hacer una pausa, recargar el alma y continuar.
                            </p>
                        </div>

                        {/* Bloque 2: Contenedor para los botones/badges fijados al fondo */}
                        <div className="space-y-3 pt-6 mt-auto">
                            <span className="text-xs text-gray-400 uppercase tracking-wider block">
                                Conoce más
                            </span>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2.5">
                                <div className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
                                    100% Peruano
                                </div>
                                <div className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
                                    Comercio Justo
                                </div>
                                <div className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
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