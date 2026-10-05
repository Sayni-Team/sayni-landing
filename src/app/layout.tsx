import type { Metadata, Viewport } from "next";
import { Urbanist } from "next/font/google";
import localFont from "next/font/local";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const urbanist = Urbanist({
    subsets: ["latin"],
    variable: "--font-urbanist",
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
});

const clashGrotesk = localFont({
    src: [
        { path: "./fonts/ClashGrotesk-Regular.woff2", weight: "400", style: "normal" },
        { path: "./fonts/ClashGrotesk-Medium.woff2", weight: "500", style: "normal" },
        { path: "./fonts/ClashGrotesk-Semibold.woff2", weight: "600", style: "normal" },
        { path: "./fonts/ClashGrotesk-Bold.woff2", weight: "700", style: "normal" },
    ],
    variable: "--font-clash",
    display: "swap",
});

export const viewport: Viewport = {
    themeColor: "#0e0e0e",
    colorScheme: "dark",
    width: "device-width",
    initialScale: 1,
};

const siteUrl = "https://sayni.pe"; // Cambia por tu dominio real

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "Sayni | Café de Especialidad Peruano de Cusco (87 Puntos SCA)",
        template: "%s | Sayni Café",
    },
    description:
        "Descubre Sayni: café peruano de especialidad producido a más de 1800 msnm en Cusco. 87 puntos SCA, cultivo sustentable y envío a todo el Perú.",
    keywords: [
        "café de especialidad",
        "café peruano",
        "café de Cusco",
        "Sayni café",
        "puntos SCA",
        "comprar café de especialidad Perú",
        "café en grano",
        "café molido",
    ],
    authors: [{ name: "Sayni" }],
    creator: "Sayni",
    publisher: "Sayni",
    formatDetection: {
        telephone: true,
        email: true,
    },
    alternates: {
        canonical: "/",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        type: "website",
        locale: "es_PE",
        url: siteUrl,
        title: "Sayni | Café de Especialidad Peruano de Cusco",
        description:
            "Una pausa que nace de nuestra tierra. Café de especialidad con 87 puntos SCA directo de Cusco.",
        siteName: "Sayni Café",
        images: [
            {
                url: "/assets/brand/logo.webp", // O usa una imagen OG específica de 1200x630
                width: 1200,
                height: 630,
                alt: "Sayni - Café de Especialidad Peruano",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Sayni | Café de Especialidad Peruano de Cusco",
        description:
            "Una pausa que nace de nuestra tierra. Café de especialidad con 87 puntos SCA directo de Cusco.",
        images: ["/assets/brand/logo.webp"],
    },
    icons: {
        icon: "/icon.png",
        shortcut: "/icon.png",
        apple: "/icon.png",
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" className={`${urbanist.variable} ${clashGrotesk.variable}`}>
        <body className="bg-sayni-black text-sayni-light font-sans antialiased selection:bg-sayni-lime selection:text-sayni-black">
        <CartProvider>{children}</CartProvider>
        </body>
        </html>
    );
}