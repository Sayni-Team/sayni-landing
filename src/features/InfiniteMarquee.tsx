import RevealSection from "@/components/ui/RevealSection";
import { REVEAL } from "@/lib/reveal";
import { cn } from "@/lib/utils";

const flavorNotes = [
    "Jasmine",
    "Citrus",
    "Red Fruits",
    "Caramel",
    "Honey",
    "Chocolate",
];

export const InfiniteMarquee = () => {
    return (
        <RevealSection className="relative w-full overflow-hidden border-y border-white/10 bg-[#121212] py-4 select-none">
            {/* Fade lateral izquierdo */}
            <div
                className={cn(
                    "pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#121212] to-transparent sm:w-24",
                    REVEAL.fade,
                    "delay-300"
                )}
            />

            {/* Fade lateral derecho */}
            <div
                className={cn(
                    "pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#121212] to-transparent sm:w-24",
                    REVEAL.fade,
                    "delay-300"
                )}
            />

            {/* Entrada: la cinta se enfoca al llegar; dentro, el marquee sigue su bucle */}
            <div className={REVEAL.blur}>
                <div className="animate-marquee flex items-center">
                    <NoteList />
                    {/* Segunda copia para el bucle (-50%); oculta a lectores de pantalla */}
                    <NoteList hidden />
                </div>
            </div>
        </RevealSection>
    );
};

function NoteList({ hidden = false }: { hidden?: boolean }) {
    return (
        <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
            {flavorNotes.map((note) => (
                // Separación con padding (no gap): el -50% del bucle cuadra exacto
                <li key={note} className="flex shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12 md:gap-16 md:pr-16">
                    <span className="inline-block cursor-pointer whitespace-nowrap text-sm font-light tracking-wide text-neutral-200 transition-[scale,color] duration-300 ease-out hover:scale-115 hover:text-white sm:text-base md:text-lg">
                        {note}
                    </span>
                    <span aria-hidden className="inline-block size-2 shrink-0 rounded-full bg-[#BCC90F]" />
                </li>
            ))}
        </ul>
    );
}

export default InfiniteMarquee;