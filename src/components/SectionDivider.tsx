export function SectionDivider() {
    return (
        <div className="relative w-full h-0 z-20 pointer-events-none">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex justify-end overflow-visible">
                <svg
                    viewBox="0 0 500 500"
                    className="w-80 md:w-[500px] lg:w-[600px] h-auto text-[#8B7E56] opacity-30 object-contain translate-x-1/4"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Si usas la imagen vectorial como asset local, reemplaza este SVG por tu ruta en <img /> */}
                    <image href="/assets/vector-ornamental.svg" width="500" height="500" />
                </svg>
            </div>
        </div>
    );
}