import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InfiniteMarquee from "@/features/InfiniteMarquee";
import Link from "next/link";
import AboutUs from "@/features/AboutUs";

export default function Home() {
  return (
      <div className="min-h-screen flex flex-col bg-sayni-black text-sayni-light">
        {/* Header Fijo / Absoluto */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow">
          {/* Hero Section */}
          <section
              id="inicio"
              className="relative min-h-screen flex items-center justify-center px-6 lg:px-16 pt-24 pb-12 overflow-hidden"
          >
            {/* Fondo oscuro con textura o elementos visuales */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-sayni-black/80 to-sayni-black z-10" />

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-20">
              {/* Contenido de Texto Izquierda / Centro según versión */}
              <div className="space-y-6 text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight font-heading">
                  Una pausa que nace de nuestra tierra
                </h1>
                <p className="text-lg text-gray-300 max-w-xl mx-auto lg:mx-0">
                  Café peruano con origen, historia y propósito. Desde las alturas del Perú hasta tu taza.
                </p>

                {/* Botones de CTA Dual (B2C / B2B) */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                  <Link
                      href="#cafes"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-sayni-lime text-sayni-black font-semibold px-8 py-4 rounded-full hover:bg-sayni-olive transition-all shadow-lg group"
                  >
                    Haz tu pedido
                    <span className="bg-sayni-black text-sayni-lime rounded-full p-1 group-hover:translate-x-1 transition-transform">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                  </Link>

                  <Link
                      href="#nosotros"
                      className="w-full sm:w-auto inline-flex items-center justify-center bg-white/10 text-white font-medium px-8 py-4 rounded-full hover:bg-white/20 transition-all border border-white/10 backdrop-blur-sm"
                  >
                    Conócenos más
                  </Link>
                </div>
              </div>

              {/* Espacio visual para el empaque / mock */}
              <div className="flex justify-center relative">
                <div className="w-72 h-96 sm:w-80 sm:h-[450px] bg-sayni-darkGreen/55 border border-sayni-lime/30 rounded-2xl flex items-center justify-center relative shadow-2xl backdrop-blur-md">
                  <div className="text-center p-6 space-y-2">
                  <span className="text-sayni-lime font-heading tracking-widest text-sm uppercase">
                    Sayni Clásico
                  </span>
                    <p className="text-xs text-gray-400">[ Espacio para el render del empaque ]</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Banda de Notas de Cata Infinita */}
          <InfiniteMarquee />
          <AboutUs/>

          {/* Aquí irán las siguientes secciones (#cafes, #nosotros, etc.) */}
        </main>

        {/* Footer */}
        <Footer />
      </div>
  );
}