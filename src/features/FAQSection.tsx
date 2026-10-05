"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView, type Variants } from "framer-motion";

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

const EASE = [0.215, 0.61, 0.355, 1] as const;

/* ── Variantes ─────────────────────────────── */

const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

const fadeDown: Variants = {
    hidden: { opacity: 0, y: -16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const zoomIn: Variants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: EASE } },
};

// Líneas que se dibujan (el originX se define en cada línea)
const drawLine: Variants = {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1, transition: { duration: 0.8, ease: EASE, delay: 0.2 } },
};

// Cada pregunta: se desliza desde la izquierda y escalona su línea y su botón
const itemIn: Variants = {
    hidden: { opacity: 0, x: -24 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, ease: EASE, staggerChildren: 0.1 },
    },
};

// Botón "+" con un pequeño rebote
const popIn: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 15 } },
};

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const sectionRef = useRef<HTMLElement>(null);
    const inView = useInView(sectionRef, { once: true, amount: 0.2 });
    const state = inView ? "visible" : "hidden";

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section
            ref={sectionRef}
            className="flex items-center justify-center bg-sayni-black px-10 py-24 text-white sm:px-6 md:px-12"
        >
            <motion.div variants={container} initial="hidden" animate={state} className="mx-auto w-full max-w-3xl">
                {/* Encabezado */}
                <motion.div variants={container} className="mb-14 text-center">
                    {/* Badge / Label FAQ: baja; las líneas se dibujan hacia fuera */}
                    <motion.div variants={fadeDown} className="mb-4 flex items-center justify-center gap-4">
                        <motion.div variants={drawLine} style={{ originX: 1 }} className="h-px w-16 bg-white/20" />
                        <span className="font-mono text-xs uppercase tracking-widest text-[#C2D813] sm:text-sm">FAQ</span>
                        <motion.div variants={drawLine} style={{ originX: 0 }} className="h-px w-16 bg-white/20" />
                    </motion.div>

                    {/* Título: crece hasta su tamaño */}
                    <motion.h2 variants={zoomIn} className="text-3xl font-bold tracking-wide text-white sm:text-4xl md:text-5xl">
                        Preguntas Frecuentes
                    </motion.h2>
                </motion.div>

                {/* Lista de Preguntas: una tras otra */}
                <motion.div variants={container}>
                    {faqData.map((item, index) => {
                        const isOpen = openIndex === index;
                        const answerId = `faq-answer-${index}`;

                        return (
                            <motion.div key={item.question} variants={itemIn} className="relative">
                                <button
                                    type="button"
                                    onClick={() => toggleFAQ(index)}
                                    aria-expanded={isOpen}
                                    aria-controls={answerId}
                                    className="group flex w-full cursor-pointer items-center justify-between gap-6 rounded-lg py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C2D813]"
                                >
                                    {/* Pregunta */}
                                    <span className="text-sm font-normal leading-snug text-gray-200 transition-colors group-hover:text-white sm:text-xl">
                                        {item.question}
                                    </span>

                                    {/* Botón "+": rebote de entrada; gira al abrir */}
                                    <motion.span
                                        variants={popIn}
                                        aria-hidden
                                        className={`flex size-6 shrink-0 items-center justify-center rounded-full bg-[#C2D813] text-black transition-[rotate] duration-300 ease-in-out sm:size-7 ${
                                            isOpen ? "rotate-45" : ""
                                        }`}
                                    >
                                        <svg className="size-3.5 fill-current stroke-current stroke-[0.5]" viewBox="0 0 24 24">
                                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                        </svg>
                                    </motion.span>
                                </button>

                                {/* Respuesta desplegable: el texto baja mientras se abre */}
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            id={answerId}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <motion.p
                                                initial={{ y: -8 }}
                                                animate={{ y: 0 }}
                                                transition={{ duration: 0.35, ease: "easeOut" }}
                                                className="pb-5 pr-10 text-lg font-light leading-relaxed text-gray-400"
                                            >
                                                {item.answer}
                                            </motion.p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Línea inferior: se dibuja de izquierda a derecha */}
                                <motion.span
                                    variants={drawLine}
                                    style={{ originX: 0 }}
                                    aria-hidden
                                    className="absolute inset-x-0 bottom-0 h-px bg-white/15"
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>
            </motion.div>
        </section>
    );
}