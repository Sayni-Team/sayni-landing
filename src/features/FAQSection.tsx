"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "¿Qué diferencia hay entre Sayni Geisha Especialidad y Sayni Clásico Comercial?",
        answer: "Son dos formas de hacer una pausa. Sayni Premium es un café de especialidad variedad Geisha, con 87 puntos SCA, de producción limitada y en grano entero. Tiene notas a jazmín, cítricos, frutas rojas, caramelo y chocolate, y es el mismo café que hoy exportamos a Japón. Sayni Clásico es nuestro café de todos los días: un blend 100% cusqueño de tueste oscuro, con cuerpo y sabor intenso, pensado para acompañar tu rutina diaria. Los dos tienen el mismo origen y la misma alma. Lo que cambia es la ocasión.",
    },
    {
        question: "¿De dónde viene el café Sayni?",
        answer: "Todo nuestro café viene de Inkawasi, en La Convención (Cusco), y se cultiva por encima de los 2,000 msnm. Lo trabajamos con una productora local que es Q-Grader certificada. Ella acompaña cada etapa: cultivo, cosecha, proceso, tueste y envasado. Por eso sabemos exactamente de qué finca viene cada bolsa.",
    },
    {
        question: "¿Viene en grano o molido? ¿Cómo lo preparo?",
        answer: "Sayni Premium viene en grano entero, para que lo muelas justo antes de preparar y conserves todos sus aromas. Sayni Clásico está disponible en grano o molido. Funciona muy bien en prensa francesa, cafetera italiana y métodos de goteo (en cada etiqueta encontrarás los pictogramas de preparación). Te recomendamos guardarlo en su bolsa bien cerrada, en un lugar fresco y lejos de la luz.",
    },
    {
        question: "¿Cómo compro y hacen envíos?",
        answer: "Puedes hacer tu pedido por WhatsApp o por nuestro Instagram. Hacemos delivery en Lima Metropolitana, con un costo que depende del distrito. Te lo confirmamos antes de cerrar tu pedido. Si buscas un regalo, tenemos packs de 4 bolsas en caja premium, con opción de incluir una prensa francesa.",
    },
    {
        question: "¿Atienden empresas, cafeterías o pedidos al por mayor?",
        answer: "Sí. Trabajamos con cafeterías, tiendas, bodegas y empresas que buscan regalos corporativos. También atendemos importadores del extranjero, porque Sayni Premium ya se exporta a Japón. Escríbenos con el volumen y la presentación que necesitas, y te enviamos una propuesta a medida.",
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bg-sayni-black text-white py-24 px-10 sm:px-6 md:px-12 flex justify-center items-center">
            <div className="w-full max-w-3xl mx-auto">
                {/* Encabezado */}
                <div className="text-center mb-14">
                    {/* Badge / Label FAQ */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="w-16 h-[1px] bg-white/20" />
                        <span className="text-[#C2D813] font-mono text-xs sm:text-sm tracking-widest uppercase">
                            FAQ
                        </span>
                        <div className="w-16 h-[1px] bg-white/20" />
                    </div>

                    {/* Título Principal */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide text-white">
                        Preguntas Frecuentes
                    </h2>
                </div>

                {/* Lista de Preguntas */}
                <div>
                    {faqData.map((item, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div key={index} className="border-b border-white/15">
                                <button
                                    type="button"
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full py-5 flex items-center justify-between text-left gap-6 group cursor-pointer focus:outline-none"
                                >
                                    {/* Pregunta */}
                                    <span className="text-sm sm:text-lg font-normal text-gray-200 group-hover:text-white transition-colors leading-snug">
                                        {item.question}
                                    </span>

                                    {/* Botón Circular Verde (+) más pequeño */}
                                    <span
                                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#C2D813] text-black flex items-center justify-center shrink-0 transition-transform duration-300 ease-in-out ${
                                            isOpen ? "rotate-45" : ""
                                        }`}
                                    >
                                        <svg
                                            className="w-3.5 h-3.5 fill-current stroke-current stroke-[0.5]"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                        </svg>
                                    </span>
                                </button>

                                {/* Respuesta desplegable */}
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <p className="pb-5 pr-10 text-sm text-gray-400 font-light leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}