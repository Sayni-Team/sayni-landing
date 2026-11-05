import { FREE_SHIPPING_MIN, isCyberActive } from "@/lib/promo";
import { formatPEN } from "@/lib/pricing";

// Franja superior de campaña: texto en movimiento, a todo el ancho.
// Hasta el 5 de noviembre muestra Cyber Wow; después, la campaña de Navidad (cambia sola por fecha).
const CYBER = {
    bg: "#0535FF",
    accent: "#FE2D73",
    pillText: "#FFFFFF",
    pill: "CYBERWOW",
    messages: ["Del 2 al 5 de noviembre", "Descubre nuestras ofertas en café de especialidad"],
    label: "Cyber Wow del 2 al 5 de noviembre: ver ofertas en Sayni",
};
const XMAS = {
    bg: "#1B2A1E",
    accent: "#BCC90F",
    pillText: "#121212",
    pill: "NAVIDAD",
    messages: [
        "🎄 Delivery gratis en Lima",
        `En compras desde ${formatPEN(FREE_SHIPPING_MIN)}`,
        "Hasta el 23 de diciembre",
    ],
    label: "Navidad en Sayni: delivery gratis en Lima. Ver regalos",
};
const REPEAT = 4; // repeticiones por mitad: cubren de sobra pantallas anchas

function Separator({ color }: { color: string }) {
    return (
        <span aria-hidden className="mx-4 sm:mx-6" style={{ color }}>
            •
        </span>
    );
}

export default function CyberWowTopBar() {
    const c = isCyberActive() ? CYBER : XMAS;
    const BLUE = c.bg;
    const PINK = c.accent;
    const MESSAGES = c.messages;
    const group = Array.from({ length: REPEAT }, (_, i) => (
        <span key={i} className="flex shrink-0 items-center">
            {/* Nombre de la campaña destacado en píldora */}
            <span
                className="rounded-full px-2.5 py-0.5 text-[11px] font-extrabold tracking-[0.12em] sm:text-xs"
                style={{ backgroundColor: PINK, color: c.pillText }}
            >
                {c.pill}
            </span>
            {MESSAGES.map((message) => (
                <span key={message} className="flex items-center">
                    <Separator color={PINK} />
                    <span className="whitespace-nowrap">{message}</span>
                </span>
            ))}
            <Separator color={PINK} />
        </span>
    ));

    return (
        <a
            href="#cafes"
            aria-label={c.label}
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