import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BUSINESS } from "@/lib/business";
import ComplaintForm from "./ComplaintForm";

export const metadata: Metadata = {
    title: "Libro de Reclamaciones | Sayni",
    description: "Libro de Reclamaciones virtual de Sayni Café, conforme al Código de Protección y Defensa del Consumidor.",
};

export default function ComplaintsBookPage() {
    return (
        <div className="min-h-screen bg-sayni-black text-sayni-light">
            <header className="flex items-center justify-between px-6 py-6 sm:px-12">
                <Link href="/" className="relative block size-10">
                    <Image src="/assets/brand/logo.webp" alt="Sayni" fill className="object-contain" />
                </Link>
                <Link href="/" className="text-sm text-white/70 underline-offset-4 hover:text-[#BCC90F] hover:underline">
                    ← Volver a la tienda
                </Link>
            </header>

            <main className="mx-auto max-w-3xl px-6 pb-20 font-urbanist sm:px-12">
                <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">Libro de Reclamaciones</h1>

                {/* Datos del proveedor */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-[#132219] p-5 text-sm leading-relaxed text-white/80">
                    <p><span className="text-white/50">Razón social:</span> {BUSINESS.legalName}</p>
                    <p><span className="text-white/50">RUC:</span> {BUSINESS.ruc}</p>
                    <p><span className="text-white/50">Domicilio:</span> {BUSINESS.address}</p>
                </div>

                <ComplaintForm />

                {/* Avisos legales */}
                <div className="mt-10 space-y-2 text-xs leading-relaxed text-white/50">
                    <p>
                        <strong className="text-white/70">Reclamo:</strong> disconformidad relacionada con los productos o servicios.{" "}
                        <strong className="text-white/70">Queja:</strong> disconformidad no relacionada con los productos o servicios, o malestar o descontento respecto a la atención al público.
                    </p>
                    <p>
                        La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.
                    </p>
                    <p>
                        El proveedor deberá dar respuesta al reclamo o queja en un plazo no mayor a quince (15) días hábiles.
                    </p>
                </div>
            </main>
        </div>
    );
}