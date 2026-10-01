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

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col bg-sayni-black text-sayni-light overflow-x-hidden relative">
            <Header />

            <main className="flex-grow overflow-visible relative">
                <Hero />
                <InfiniteMarquee />
                <AboutUs />
                <SectionDivider />
                <OurCoffees />
                <TestimonialsSection />
                <FAQSection/>
                <CtaSection />
            </main>

            <Footer />
        </div>
    );
}