"use client";

import { useState } from "react";

interface PaymentMethod {
    id: string;
    name: string;
    logo?: string;
    /** Ajuste fino por logo, si alguno trae mucho espacio vacío (por ejemplo "scale-110") */
    logoClassName?: string;
}

// Usar versiones "símbolo" donde existan (círculos de Mastercard, ícono de PagoEfectivo):
// a tamaño pequeño se reconocen mejor y ocupan más espacio que los logos con texto.
const METHODS: PaymentMethod[] = [
    { id: "yape", name: "Yape", logo: "https://www.ecoplaza.com.pe/_next/static/media/yape.23a0e918.png" },
    {
        id: "visa",
        name: "Visa",
        logo: "https://static.vecteezy.com/system/resources/thumbnails/020/975/570/small/visa-logo-visa-icon-transparent-free-png.png",
    },
    {
        id: "mastercard",
        name: "Mastercard",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png",
    },
    {
        id: "pagoefectivo",
        name: "PagoEfectivo",
        logo: "https://cdn.shopify.com/s/files/1/0269/4925/5256/files/0.-logo-pagoefectivo_horizontal_1024x282_e3bfb773-8926-4614-8781-93b8dfbb7aa9.png?v=1576275858",
    },
];

export default function PaymentMethods({ compact = false }: { compact?: boolean }) {
    const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});

    const handleImageError = (id: string) => {
        setFailedIds((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
    };

    return (
        <div className={`rounded-2xl border border-white/10 bg-[#132219]/80 ${compact ? "p-3" : "p-4"}`}>
            {/* Encabezado: una sola línea */}
            <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-sayni-light/90">Paga con</span>
                <span className="flex items-center gap-1 text-sayni-light/60">
                    <svg viewBox="0 0 24 24" fill="none" className="size-3.5 text-[#BCC90F]" aria-hidden>
                        <path d="M6 10V8a6 6 0 1 1 12 0v2M5 10h14v11H5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>
                    Seguro con <strong className="font-semibold text-sayni-light/85">Mercado Pago</strong>
                </span>
            </div>

            {/* Logos: cada uno ocupa todo el espacio de su cajita */}
            <ul className="mt-2.5 grid grid-cols-4 gap-2">
                {METHODS.map((method) => {
                    const showFallbackText = !method.logo || failedIds[method.id];

                    return (
                        <li
                            key={method.id}
                            title={method.name}
                            className="flex h-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5"
                        >
                            {!showFallbackText ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={method.logo}
                                    alt={method.name}
                                    className={`max-h-[68%] max-w-[70%] object-contain ${method.logoClassName ?? ""}`}
                                    onError={() => handleImageError(method.id)}
                                />
                            ) : (
                                <span className="truncate px-1 text-xs font-bold tracking-tight text-[#132219]">{method.name}</span>
                            )}
                        </li>
                    );
                })}
            </ul>

            {/* Versión grande (checkout): sin cuenta y contra entrega */}
            {!compact && (
                <p className="mt-2.5 text-xs leading-relaxed text-sayni-light/55">
                    No necesitas crear cuenta. En Lima también puedes pagar al recibir con Yape, Plin o efectivo.
                </p>
            )}
        </div>
    );
}