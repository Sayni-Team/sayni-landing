// Franja superior de la campaña Cyber Wow: texto en movimiento, a todo el ancho.
const BLUE = "#0535FF";
const PINK = "#FE2D73";

const MESSAGES = ["Del 2 al 5 de noviembre", "Descubre nuestras ofertas en café de especialidad"];
const REPEAT = 4; // repeticiones por mitad: cubren de sobra pantallas anchas

function Separator() {
    return (
        <span aria-hidden className="mx-4 sm:mx-6" style={{ color: PINK }}>
            •
        </span>
    );
}

export default function CyberWowTopBar() {
    const group = Array.from({ length: REPEAT }, (_, i) => (
        <span key={i} className="flex shrink-0 items-center">
            {/* "CYBER WOW" destacado en píldora rosada */}
            <span
                className="rounded-full px-2.5 py-0.5 text-[11px] font-extrabold tracking-[0.12em] text-white sm:text-xs"
                style={{ backgroundColor: PINK }}
            >
                CYBERWOW
            </span>
            {MESSAGES.map((message) => (
                <span key={message} className="flex items-center">
                    <Separator />
                    <span className="whitespace-nowrap">{message}</span>
                </span>
            ))}
            <Separator />
        </span>
    ));

    return (
        <a
            href="#cafes"
            aria-label="Cyber Wow del 2 al 5 de noviembre: ver ofertas en Sayni"
            className="relative z-[60] block overflow-hidden py-2"
            style={{ backgroundColor: BLUE }}
        >
            {/* Dos copias idénticas: al desplazar la mitad, el bucle es continuo */}
            <div
                aria-hidden
                className="flex w-max animate-cw-marquee font-urbanist text-xs font-bold uppercase tracking-wider text-white motion-reduce:animate-none sm:text-sm"
            >
                <div className="flex shrink-0 items-center">{group}</div>
                <div className="flex shrink-0 items-center">{group}</div>
            </div>
        </a>
    );
}