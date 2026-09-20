import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-sayni-black text-sayni-light pt-20 pb-10 px-6 lg:px-16 border-t border-white/10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                {/* Columna 1: Frase institucional */}
                <div className="space-y-4 md:col-span-1">
                    <h3 className="text-sayni-lime font-heading text-xl font-medium leading-snug">
                        Una pausa que nace de nuestra tierra.
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Café peruano con raíces, historia y propósito. Del origen a tu taza, para acompañarte en cada momento.
                    </p>
                </div>

                {/* Columna 2: Explora */}
                <div className="space-y-3">
                    <h4 className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Explora</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="#cafes" className="hover:text-sayni-lime transition-colors">Nuestros Cafés</Link></li>
                        <li><Link href="#nosotros" className="hover:text-sayni-lime transition-colors">Nuestra Historia</Link></li>
                        <li><Link href="#origen" className="hover:text-sayni-lime transition-colors">Origen</Link></li>
                    </ul>
                </div>

                {/* Columna 3: Descubre */}
                <div className="space-y-3">
                    <h4 className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Descubre</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="#" className="hover:text-sayni-lime transition-colors">Sayni Geisha</Link></li>
                        <li><Link href="#" className="hover:text-sayni-lime transition-colors">Sayni Clásico</Link></li>
                        <li><Link href="#" className="hover:text-sayni-lime transition-colors">Comprar</Link></li>
                    </ul>
                </div>

                {/* Columna 4: Síguenos */}
                <div className="space-y-3">
                    <h4 className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Síguenos</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-sayni-lime transition-colors">Instagram</a></li>
                        <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-sayni-lime transition-colors">Facebook</a></li>
                        <li><a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-sayni-lime transition-colors">TikTok</a></li>
                        <li><Link href="#contacto" className="hover:text-sayni-lime transition-colors">Contáctanos</Link></li>
                    </ul>
                </div>

            </div>

            {/* Marca de agua gigante central ("Sayni") */}
            <div className="text-center my-12">
        <span className="font-heading text-6xl md:text-8xl tracking-wider text-sayni-lime/90 font-bold select-none">
          Sayni
        </span>
            </div>

            {/* Copyright y país */}
            <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
                <p>© 2026 SAYNI · TODOS LOS DERECHOS RESERVADOS</p>
                <p className="tracking-widest uppercase mt-4 sm:mt-0">Perú</p>
            </div>
        </footer>
    );
}