export function SectionDividerLeft() {
    return (
        <div className="relative w-full h-0 z-20 pointer-events-none">
            {/* Contenedor alineado a la izquierda (left-0, justify-start) */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 flex justify-start overflow-visible">
                <svg
                    viewBox="0 0 500 500"
                    className="w-[400px] md:w-[650px] lg:w-[700px] h-auto text-[#8B7E56] opacity-50 object-contain rotate-12 -translate-x-1/4 origin-center"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Ruta al nuevo archivo SVG */}
                    <image href="/assets/vector-ornamental-2.svg" width="500" height="500" />
                </svg>
            </div>
        </div>
    );
}