// --- 1. Para elementos en SCROLL (usados dentro de RevealSection) ---
const IN =
    "group-data-[inview=true]/reveal:opacity-100 group-data-[inview=true]/reveal:scale-100 group-data-[inview=true]/reveal:translate-x-0 group-data-[inview=true]/reveal:translate-y-0 group-data-[inview=true]/reveal:blur-none";

const BASE =
    "transition-[opacity,scale,translate,filter] duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:scale-100 motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:blur-none";

export const REVEAL = {
    fade: `${BASE} ${IN} opacity-0`,
    zoomIn: `${BASE} ${IN} opacity-0 scale-90`,
    zoomOut: `${BASE} ${IN} opacity-0 scale-110`,
    up: `${BASE} ${IN} opacity-0 translate-y-10`,
    down: `${BASE} ${IN} opacity-0 -translate-y-10`,
    left: `${BASE} ${IN} opacity-0 -translate-x-10`,
    right: `${BASE} ${IN} opacity-0 translate-x-10`,
    blur: `${BASE} ${IN} opacity-0 blur-md`,
} as const;

// --- 2. Para elementos en VISTA INICIAL / HERO (@starting-style CSS) ---
const ENTER =
    "transition-[opacity,translate,scale,filter] duration-700 ease-out motion-reduce:transition-none";

export const ENTER_ANIM = {
    zoom: `${ENTER} starting:scale-90 starting:opacity-0`,
    up: `${ENTER} starting:translate-y-6 starting:opacity-0`,
    fade: `${ENTER} starting:opacity-0`,
    blurUp: `${ENTER} starting:translate-y-4 starting:opacity-0 starting:blur-sm`,
} as const;