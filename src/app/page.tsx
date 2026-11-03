import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InfiniteMarquee from "@/features/InfiniteMarquee";
import AboutUs from "@/features/AboutUs";
import OurCoffees from "@/features/OurCoffees";
import TestimonialsSection from "@/features/Testimonials";
import CtaSection from "@/features/CTA";
import { SectionDivider } from "@/components/SectionDivider";
import FAQSection from "@/features/FAQSection";
import Hero from "@/features/Hero";
import CyberWowBanner from "../../public/assets/features/CyberWowBanner";
import CyberWowTopBar from "@/features/CyberWowTopBar";
import CyberOffers from "@/features/CyberOffers";

const SITE_URL = "https://www.sayniperu.com";

export default function Home() {
    // JSON-LD para Organización y Producto Principal
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": `${SITE_URL}/#organization`,
                "name": "Sayni Café",
                "url": SITE_URL,
                "logo": `${SITE_URL}/assets/brand/logo.webp`,
                "description": "Productores de café de especialidad peruano originario de Cusco.",
                "sameAs": [
                    "https://instagram.com/sayni_peru",
                    "https://www.facebook.com/share/1Cf2MD3RBb/?mibextid=wwXIfr",
                ],
            },
            {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                "url": SITE_URL,
                "name": "Sayni",
                "publisher": { "@id": `${SITE_URL}/#organization` },
                "inLanguage": "es-PE",
            },
            {
                "@type": "Product",
                "name": "Café de Especialidad Sayni - Cusco 87 SCA",
                "image": `${SITE_URL}/assets/brand/logo.webp`,
                "description": "Café peruano de especialidad producido en Cusco a más de 1800 msnm con puntuación de 87 puntos SCA.",
                "brand": {
                    "@type": "Brand",
                    "name": "Sayni",
                },
                "offers": {
                    "@type": "AggregateOffer",
                    "priceCurrency": "PEN",
                    "lowPrice": "50.00",
                    "highPrice": "79.90",
                    "availability": "https://schema.org/InStock",
                },
            },
        ],
    };

    return (
        <div className="min-h-screen flex flex-col bg-sayni-black text-sayni-light overflow-x-hidden relative">
            {/* Script de datos estructurados para Google */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Franja de campaña: arriba del todo, antes del header */}
            <CyberWowTopBar />

            {/* Ofertas Cyber Wow: lo primero que se ve al entrar desde un anuncio */}
            <CyberOffers />

            {/* El header es absoluto: este contenedor hace que empiece debajo de la franja, sobre el Hero */}
            <div className="relative flex flex-grow flex-col">
                <Header />

                <main className="flex-grow overflow-visible relative">
                    <Hero />
                    {/* Banner de campaña: justo después del Hero */}
                    <CyberWowBanner />
                    <InfiniteMarquee />
                    <AboutUs />
                    <SectionDivider />
                    <OurCoffees />
                    <TestimonialsSection />
                    <FAQSection />
                    <CtaSection />
                </main>
            </div>

            <Footer />
        </div>
    );
}