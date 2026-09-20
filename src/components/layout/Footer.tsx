"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bg-[#111111] text-white pt-16 pb-12 px-6 sm:px-12 border-t border-white/10 font-urbanist">
            {/* Estilos CSS Inline para la animación bounce/salto suave en orden de cada letra */}
            <style jsx global>{`
        @keyframes letterJump {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-letter-jump {
          animation: letterJump 3s ease-in-out infinite;
        }
      `}</style>

            <div className="max-w-6xl mx-auto flex flex-col gap-16">

                {/* BLOQUE SUPERIOR: Información + Enlaces de Navegación */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-center md:text-left items-start">

                    {/* Mensaje de marca (Columna izquierda) */}
                    <div className="md:col-span-5 flex flex-col gap-4 items-center md:items-start max-w-sm mx-auto md:mx-0">
                        <h3 className="font-clash text-2xl sm:text-3xl font-semibold leading-tight text-[#BCC90F]">
                            Una pausa que nace de nuestra tierra
                        </h3>
                        <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                            Café peruano con raíces, historia y propósito. Del origen a tu taza, para acompañarte en cada momento.
                        </p>
                    </div>

                    {/* Enlaces de pie de página (Columnas derechas) */}
                    <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">

                        {/* Seccion 1: Explora */}
                        <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold tracking-wider uppercase text-white/50">
                Explora
              </span>
                            <ul className="flex flex-col gap-2.5 text-sm text-white/80">
                                <li>
                                    <Link href="#cafes" className="hover:text-[#BCC90F] transition-colors duration-200 inline-block hover:scale-105 transform origin-center sm:origin-left">
                                        Nuestros Cafés
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#nosotros" className="hover:text-[#BCC90F] transition-colors duration-200 inline-block hover:scale-105 transform origin-center sm:origin-left">
                                        Nuestra Historia
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#origen" className="hover:text-[#BCC90F] transition-colors duration-200 inline-block hover:scale-105 transform origin-center sm:origin-left">
                                        Origen
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Seccion 2: Descubre */}
                        <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold tracking-wider uppercase text-white/50">
                Descubre
              </span>
                            <ul className="flex flex-col gap-2.5 text-sm text-white/80">
                                <li>
                                    <Link href="#sayni-geisha" className="hover:text-[#BCC90F] transition-colors duration-200 inline-block hover:scale-105 transform origin-center sm:origin-left">
                                        Sayni Geisha
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#sayni-clasico" className="hover:text-[#BCC90F] transition-colors duration-200 inline-block hover:scale-105 transform origin-center sm:origin-left">
                                        Sayni Clásico
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#comprar" className="hover:text-[#BCC90F] transition-colors duration-200 inline-block hover:scale-105 transform origin-center sm:origin-left">
                                        Comprar
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Seccion 3: Síguenos */}
                        <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold tracking-wider uppercase text-white/50">
                Síguenos
              </span>
                            <ul className="flex flex-col gap-2.5 text-sm text-white/80">
                                <li>
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#BCC90F] transition-colors duration-200 inline-block hover:scale-105 transform origin-center sm:origin-left">
                                        Instagram
                                    </a>
                                </li>
                                <li>
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#BCC90F] transition-colors duration-200 inline-block hover:scale-105 transform origin-center sm:origin-left">
                                        Facebook
                                    </a>
                                </li>
                                <li>
                                    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#BCC90F] transition-colors duration-200 inline-block hover:scale-105 transform origin-center sm:origin-left">
                                        TikTok
                                    </a>
                                </li>
                                <li>
                                    <Link href="#contactanos" className="hover:text-[#BCC90F] transition-colors duration-200 inline-block hover:scale-105 transform origin-center sm:origin-left">
                                        Contáctanos
                                    </Link>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>

                {/* BLOQUE CENTRAL: Logo gigante "Sayni" (SVG animado letra por letra) */}
                <div className="flex justify-center items-center py-6">
                    <svg
                        width="490"
                        height="207"
                        viewBox="0 0 490 207"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full max-w-[320px] sm:max-w-[420px] md:max-w-[490px] h-auto"
                    >
                        {/* Letra 'S' */}
                        <path
                            d="M79.1503 37.8835C75.1879 23.1079 68.8641 8.15413 47.7102 8.15413C30.9034 8.15413 24.356 20.3364 24.356 32.1978C24.356 47.1605 34.0072 54.9582 52.9607 64.6719C79.5439 78.2622 91.941 88.8581 91.941 110.398C91.941 134.557 71.1002 152.808 41.3864 152.808C27.6744 152.808 15.7245 148.976 6.21647 145.465C4.49018 139.369 1.57424 122.598 1.78657e-08 110.736L7.32559 108.892C11.8426 123.81 22.2719 144.28 45.5188 144.28C61.3328 144.28 70.9929 133.514 70.9929 118.926C70.9929 102.368 61.9321 95.2656 42.2183 84.5894C18.5421 71.8012 4.84796 60.9201 4.84796 39.541C4.84796 18.162 21.8873 3.51815e-09 52.4419 8.42946e-09C65.6172 1.05472e-08 77.9249 3.37752 82.7103 4.23304C83.6137 12.3783 84.6423 21.8603 86.4491 36.413L79.1593 37.8835L79.1503 37.8835Z"
                            fill="#BCC90F"
                            className="animate-letter-jump"
                            style={{ animationDelay: "0ms" }}
                        />
                        {/* Letra 'a' */}
                        <path
                            d="M182.352 152.14C178.479 152.14 173.506 150.305 171.127 147.783C168.148 144.895 166.753 141.749 165.626 137.98C156.673 143.977 145.608 152.14 139.088 152.14C122.442 152.14 110.957 138.541 110.957 124.211C110.957 113.018 116.932 106.138 129.275 101.789C142.979 97.0217 160.08 91.247 165.089 87.1209L165.089 81.6491C165.089 66.4369 157.648 57.6945 146.27 57.6945C141.315 57.6945 138.157 60.0472 135.939 62.7474C133.417 65.9824 131.95 70.8482 129.964 77.416C128.757 81.4619 126.431 83.0393 122.844 83.0393C118.265 83.0393 112.29 78.3785 112.29 72.8177C112.29 69.5025 115.188 66.7577 119.83 63.5317C127.03 58.4431 140.179 50.4405 153.014 47.7402C160.197 47.7402 167.326 49.7632 172.764 53.8982C180.993 60.6532 184.445 68.6291 184.445 80.2856L184.445 122.91C184.445 133.346 188.247 136.411 192.227 136.411C194.857 136.411 197.674 135.369 200.161 134.059L202.46 140.6L182.361 152.14L182.352 152.14ZM165.089 95.2394C160.277 97.6722 150.662 101.959 145.581 104.249C137.281 108.036 132.29 112.27 132.29 120.477C132.29 132.526 141.288 137.766 148.104 137.766C153.488 137.766 160.724 134.771 165.08 130.476L165.08 95.2483L165.089 95.2394Z"
                            fill="#BCC90F"
                            className="animate-letter-jump"
                            style={{ animationDelay: "200ms" }}
                        />
                        {/* Letra 'y' */}
                        <path
                            d="M307.889 56.7937C296.306 58.5582 293.855 60.4386 288.211 73.1377C282.567 85.5784 276.422 101.165 261.279 138.915C246.475 175.007 242.37 189.123 238.631 201.029C237.236 205.797 234.713 207 231.61 207C224.096 207 217.102 201.581 217.102 195.548C217.102 192.5 218.64 190.513 222.28 187.59C229.794 182.083 235.152 176.887 238.103 171.014C242.397 162.575 245.626 155.018 246.717 152.139C247.62 148.807 247.54 146.775 246.18 143.032C236.842 116.154 224.239 87.9043 217.951 72.9149C213.139 61.0624 210.992 58.3621 198.846 56.7848L198.846 50.4219L246.431 50.4219L246.431 56.7848C236.162 58.3621 234.946 60.492 237.808 68.5749L258.944 122.526C265.026 107.563 273.899 83.3504 278.524 69.4572C281.153 61.1515 279.329 58.5938 266.556 56.7937L266.556 50.4307L307.898 50.4307L307.898 56.7937L307.889 56.7937Z"
                            fill="#BCC90F"
                            className="animate-letter-jump"
                            style={{ animationDelay: "400ms" }}
                        />
                        {/* Letra 'n' */}
                        <path
                            d="M378.354 149.44L378.354 142.899C390.805 141.544 392.039 140.092 392.039 124.746L392.039 87.3702C392.039 71.5787 385.984 62.0076 372.335 62.0076C363.685 62.0076 355.564 66.8378 348.721 72.8175L348.721 125.806C348.721 141.009 349.991 141.544 362.594 142.89L362.594 149.431L313.148 149.431L313.148 142.89C327.487 141.232 328.846 140.457 328.846 125.637L328.846 79.1893C328.846 64.7613 327.227 64.084 315.429 62.0611L315.429 55.9655C326.86 54.201 338.748 51.278 348.801 47.0449C348.766 51.8572 348.721 59.1826 348.721 64.5385C353.238 61.3838 358.166 58.0152 363.918 54.3079C370.322 50.2531 375.912 47.7222 382.469 47.7222C400.581 47.7222 411.914 61.0006 411.914 83.0391L411.914 125.762C411.914 140.822 413.274 141.5 425.966 142.89L425.966 149.431L378.354 149.431L378.354 149.44Z"
                            fill="#BCC90F"
                            className="animate-letter-jump"
                            style={{ animationDelay: "600ms" }}
                        />
                        {/* Letra 'i' */}
                        <path
                            d="M438.855 149.439L438.855 142.898C452.72 141.508 454.258 140.421 454.258 124.995L454.258 79.0729C454.258 64.9212 453.498 64.0211 440.474 61.9269L440.474 56.1611C452.666 54.2183 463.936 51.2953 474.142 47.3207L474.142 124.995C474.142 140.296 475.6 141.508 490 142.898L490 149.439L438.855 149.439ZM462.881 26.7615C456.145 26.7615 450.135 20.8531 450.135 14.107C450.135 6.54097 456.145 1.07813 463.104 1.07813C470.063 1.07813 475.474 6.54097 475.474 14.107C475.474 20.8531 469.911 26.7615 462.872 26.7615L462.881 26.7615Z"
                            fill="#BCC90F"
                            className="animate-letter-jump"
                            style={{ animationDelay: "800ms" }}
                        />
                    </svg>
                </div>

                {/* BLOQUE INFERIOR: Copyright + Ubicación */}
                <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50 tracking-wider text-center sm:text-left">
                    <p>© 2026 SAYNI · TODOS LOS DERECHOS RESERVADOS</p>
                    <p className="font-semibold text-white/70">PERÚ</p>
                </div>

            </div>
        </footer>
    );
}