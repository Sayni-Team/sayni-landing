import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InfiniteMarquee from "@/features/InfiniteMarquee";
import Link from "next/link";
import AboutUs from "@/features/AboutUs";
import OurCoffees from "@/features/OurCoffees";
import TestimonialsSection from "@/features/Testimonials";
import CtaSection from "@/features/CTA";
import Hero from "@/features/Hero";

export default function Home() {
  return (
      <div className="min-h-screen flex flex-col bg-sayni-black text-sayni-light">
        {/* Header Fijo / Absoluto */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow">
          {/* Hero Section */}
          <Hero/>
          <InfiniteMarquee />
          <AboutUs/>
          <OurCoffees/>
          <TestimonialsSection/>
          <CtaSection/>

          {/* Aquí irán las siguientes secciones (#cafes, #nosotros, etc.) */}
        </main>

        {/* Footer */}
        <Footer />
      </div>
  );
}