import React from 'react';

const flavorNotes = [
    'Jasmine',
    'Citrus',
    'Red Fruits',
    'Caramel',
    'Honey',
    'Chocolate',
];

export const InfiniteMarquee = () => {
    // Duplicamos las notas para asegurar el loop infinito continuo
    const duplicatedNotes = [...flavorNotes, ...flavorNotes, ...flavorNotes];

    return (
        <section className="w-full bg-[#121212] border-y border-white/10 py-4 overflow-hidden select-none">
            {/* Contenedor principal animado sin ninguna regla de pausa */}
            <div className="animate-marquee flex items-center gap-8 sm:gap-12 md:gap-16 w-max pointer-events-auto">
                {duplicatedNotes.map((note, index) => (
                    <div key={index} className="flex items-center gap-8 sm:gap-12 md:gap-16 shrink-0">
                        {/*
                          - hover:scale-115: Crece mientras la animación sigue corriendo.
                          - duration-300 ease-out: Transición suave de entrada y salida cuando la palabra se desplace fuera del cursor.
                          - will-change-transform: Optimización para que la aceleración por hardware no altere el movimiento del ticker.
                        */}
                        <span className="text-sm sm:text-base md:text-lg font-light text-neutral-200 tracking-wide whitespace-nowrap transition-transform duration-300 ease-out hover:scale-115 hover:text-white inline-block cursor-pointer will-change-transform">
                            {note}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-[#BCC90F] shrink-0 inline-block" />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default InfiniteMarquee;