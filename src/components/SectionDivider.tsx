export function SectionDivider() {
    return (
        <div className="relative w-full h-0 z-20 pointer-events-none">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex justify-end overflow-visible">
                <svg
                    viewBox="0 0 500 500"
                    className="w-[400px] md:w-[650px] lg:w-[700px] h-auto text-[#8B7E56] opacity-50 object-contain translate-x-1/4"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <image href="/assets/vector-ornamental.svg" width="500" height="500" />
                </svg>
            </div>
        </div>
    );
}