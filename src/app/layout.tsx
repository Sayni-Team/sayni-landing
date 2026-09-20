import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";

const urbanist = Urbanist({
    subsets: ["latin"],
    variable: "--font-urbanist",
    weight: ["300", "400", "500", "600", "700"],
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
        <html lang="es" className={`${urbanist.variable}`}>
        <body className="bg-sayni-black text-sayni-light font-sans antialiased selection:bg-sayni-lime selection:text-sayni-black">
        {children}
        </body>
        </html>
    );
}