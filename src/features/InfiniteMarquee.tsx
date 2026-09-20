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
    // Duplicamos el array para lograr la ilusion de bucle continuo sin cortes
    const duplicatedNotes = [...flavorNotes, ...flavorNotes];

    return (
        <section className="w-full bg-[#121212] border-y border-white/10 py-4 overflow-hidden select-none">
            <div className="animate-marquee flex items-center gap-8 sm:gap-12 md:gap-16">
                {duplicatedNotes.map((note, index) => (
                    <div key={index} className="flex items-center gap-8 sm:gap-12 md:gap-16 shrink-0">
            <span className="text-sm sm:text-base md:text-lg font-light text-neutral-200 tracking-wide whitespace-nowrap">
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