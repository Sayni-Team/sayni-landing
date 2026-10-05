import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InfiniteMarquee from "@/features/InfiniteMarquee";
import AboutUs from "@/features/AboutUs";
import OurCoffees from "@/features/OurCoffees";
import TestimonialsSection from "@/features/Testimonials";
import CtaSection from "@/features/CTA";
import Hero from "@/features/Hero";
import { SectionDivider } from "@/components/SectionDivider";
import FAQSection from "@/features/FAQSection";
import NewHero from "@/features/newHero";

export default function Home() {
    // JSON-LD para Organización y Producto Principal
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": "https://sayni.pe/#organization",
                "name": "Sayni Café",
                "url": "https://sayni.pe",
                "logo": "https://sayni.pe/assets/brand/logo.webp",
                "description": "Productores de café de especialidad peruano originario de Cusco.",
                "sameAs": [],
            },
            {
                "@type": "WebSite",
                "@id": "https://sayni.pe/#website",
                "url": "https://sayni.pe",
                "name": "Sayni",
                "publisher": { "@id": "https://sayni.pe/#organization" },
                "inLanguage": "es-PE",
            },
            {
                "@type": "Product",
                "name": "Café de Especialidad Sayni - Cusco 87 SCA",
                "image": "https://sayni.pe/assets/brand/logo.webp",
                "description": "Café peruano de especialidad producido en Cusco a más de 1800 msnm con puntuación de 87 puntos SCA.",
                "brand": {
                    "@type": "Brand",
                    "name": "Sayni",
                },
                "offers": {
                    "@type": "AggregateOffer",
                    "priceCurrency": "PEN",
                    "price": "35.00",
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

            <Header />

            <main className="flex-grow overflow-visible relative">
                <NewHero />
                <InfiniteMarquee />
                <AboutUs />
                <SectionDivider />
                <OurCoffees />
                <TestimonialsSection />
                <FAQSection />
                <CtaSection />
            </main>

            <Footer />
        </div>
    );
}