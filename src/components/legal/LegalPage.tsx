import Link from "next/link";
import Image from "next/image";
import { LEGAL_UPDATED } from "@/lib/business";

const LEGAL_LINKS = [
    { href: "/terminos-y-condiciones", label: "Términos y condiciones" },
    { href: "/politica-de-envios", label: "Política de envíos" },
    { href: "/cambios-y-devoluciones", label: "Cambios y devoluciones" },
    { href: "/politica-de-privacidad", label: "Política de privacidad" },
    { href: "/libro-de-reclamaciones", label: "Libro de reclamaciones" },
];

/** Dato que debe definir el cliente: resaltado para encontrarlo fácil antes de publicar */
export function Pending({ children }: { children: React.ReactNode }) {
    return <mark className="rounded bg-[#BCC90F]/20 px-1 text-[#BCC90F]">{children}</mark>;
}

export default function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
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
                <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">{title}</h1>
                <p className="mt-2 text-sm text-white/50">Última actualización: {LEGAL_UPDATED}</p>

                {/* Estilos del texto legal */}
                <div
                    className="mt-8 space-y-4 text-[15px] leading-relaxed text-white/80
                        [&_a]:text-[#BCC90F] [&_a]:underline [&_a]:underline-offset-2
                        [&_h2]:pt-6 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white
                        [&_strong]:text-white
                        [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5"
                >
                    {children}
                </div>

                {/* Resto de páginas legales */}
                <nav className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-sm">
                    {LEGAL_LINKS.map((l) => (
                        <Link key={l.href} href={l.href} className="text-white/60 hover:text-[#BCC90F]">
                            {l.label}
                        </Link>
                    ))}
                </nav>
            </main>
        </div>
    );
}