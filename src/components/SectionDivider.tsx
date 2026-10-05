import RevealSection from "@/components/ui/RevealSection";
import { cn } from "@/lib/utils";

// Entrada propia del adorno: giro suave + escala + fade, más lenta que el resto
const ORNAMENT_IN =
    "opacity-0 -rotate-12 scale-90 transition-[opacity,rotate,scale] duration-[1400ms] ease-out group-data-[inview=true]/reveal:rotate-0 group-data-[inview=true]/reveal:scale-100 group-data-[inview=true]/reveal:opacity-100 motion-reduce:rotate-0 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:transition-none";

export function SectionDivider() {
    return (
        <RevealSection aria-hidden className="pointer-events-none relative z-20 h-0 w-full">
            {/* Posición: este div conserva su -translate-y-1/2 */}
            <div className="absolute -right-25 top-1/2 flex -translate-y-1/2 justify-end overflow-visible">
                {/* Animación en un div propio, para no pisar los translate de posicionamiento */}
                <div className={ORNAMENT_IN}>
                    <svg
                        viewBox="0 0 500 500"
                        className="h-auto w-[400px] translate-x-1/4 object-contain text-[#8B7E56] opacity-50 md:w-[700px] lg:w-[800px]"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <image href="/assets/vector-ornamental.svg" width="500" height="500" />
                    </svg>
                </div>
            </div>
        </RevealSection>
    );
}