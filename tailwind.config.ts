import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                sayni: {
                    black: "#121212",      // Deep Black de fondo
                    darkGreen: "#1B2A22",  // Verde oscuro institucional
                    lime: "#A3C639",       // Core Green / Lima principal
                    olive: "#879A39",      // Verde secundario
                    light: "#F5F5F0",      // Texto claro / blanco roto
                },
            },
            fontFamily: {
                sans: ["var(--font-urbanist)", "sans-serif"],
                heading: ["var(--font-clash)", "sans-serif"],
            },
            keyframes: {
                marquee: {
                    "0%": { transform: "translateX(0%)" },
                    "100%": { transform: "translateX(-33.333%)" },
                },
            },
            animation: {
                // Animación infinita fluida de 20s (ajusta la velocidad cambiando los segundos)
                marquee: "marquee 20s linear infinite",
            },
        },
    },
    plugins: [],
};

export default config;