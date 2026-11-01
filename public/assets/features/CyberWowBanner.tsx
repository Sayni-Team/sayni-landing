import Image from "next/image";

/* ── Medidas del diseño original (en px, sobre un ancho de 1366px) ── */
const DESIGN_WIDTH = 1366;
const IMAGE_HEIGHT = 197; // alto de la imagen YA recortada (sin la franja): ajústalo al real
const BAND_HEIGHT = 33; // alto de la franja del marquee
const FONT_SIZE = 18; // tamaño del texto
const DOT_GAP = 28; // espacio a cada lado del punto rosado

/** px del diseño → % del ancho del banner. Así todo escala junto con la imagen. */
const cqw = (px: number) => `${(px / DESIGN_WIDTH) * 100}cqw`;

const PHRASE = "Llega el CyberWow con ofertas en todos lados";
const REPEAT = 4; // repeticiones por mitad: cubren de sobra el ancho del banner

// Colores del banner
const BLUE = "#0535FF";
const PINK = "#FE2D73";

export default function CyberWowBanner() {
    const phrases = Array.from({ length: REPEAT }, (_, i) => (
        <span
            key={i}
            className="flex shrink-0 items-center whitespace-nowrap font-urbanist font-bold uppercase leading-none tracking-[0.04em] text-white"
            style={{ fontSize: cqw(FONT_SIZE) }}
        >
            {PHRASE}
            <span aria-hidden style={{ color: PINK, margin: `0 ${cqw(DOT_GAP)}` }}>
                •
            </span>
        </span>
    ));

    return (
        // container-type: el banner es la referencia de las unidades cqw
        <section aria-label="Cyber Wow en Sayni" className="w-full [container-type:inline-size]">
            {/* Todo el banner lleva a la sección de cafés */}
            <a href="#cafes" className="block">
                <Image
                    src="/assets/banners/IMG_53567_.webp"
                    alt="Cyber Wow del 2 al 5 de noviembre: ofertas en Sayni, marca oficial Cyber Wow 2026"
                    width={DESIGN_WIDTH}
                    height={IMAGE_HEIGHT}
                    sizes="100vw"
                    priority
                    className="block h-auto w-full"
                />

                {/* Franja con el texto en movimiento (decorativa: el alt de la imagen ya describe la campaña) */}
                <div
                    aria-hidden
                    className="flex items-center overflow-hidden"
                    style={{ height: cqw(BAND_HEIGHT), backgroundColor: BLUE }}
                >
                    {/* Dos copias idénticas: al desplazar la mitad, el bucle es continuo */}
                    <div className="flex w-max animate-cw-marquee motion-reduce:animate-none">
                        <div className="flex shrink-0">{phrases}</div>
                        <div className="flex shrink-0">{phrases}</div>
                    </div>
                </div>
            </a>
        </section>
    );
}