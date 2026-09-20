import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Fuente Urbanist desde Google Fonts
const urbanist = Urbanist({
    subsets: ["latin"],
    variable: "--font-urbanist",
    weight: ["300", "400", "500", "600", "700"],
});

// Cargar Clash Grotesk localmente desde src/app/fonts/
const clashGrotesk = localFont({
    src: [
        {
            path: "./fonts/ClashGrotesk-Regular.woff2", // Cambia a .ttf o .otf según los archivos que tengas
            weight: "400",
            style: "normal",
        },
        {
            path: "./fonts/ClashGrotesk-Medium.woff2",
            weight: "500",
            style: "normal",
        },
        {
            path: "./fonts/ClashGrotesk-Semibold.woff2",
            weight: "600",
            style: "normal",
        },
        {
            path: "./fonts/ClashGrotesk-Bold.woff2",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-clash",
});

export const metadata: Metadata = {
    title: "Sayni | Peruvian Specialty Coffee",
    description: "Una pausa que nace de nuestra tierra. Café peruano de especialidad.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className={`${urbanist.variable} ${clashGrotesk.variable}`}>
        <body className="bg-sayni-black text-sayni-light font-sans antialiased selection:bg-sayni-lime selection:text-sayni-black">
        {children}
        </body>
        </html>
    );
}