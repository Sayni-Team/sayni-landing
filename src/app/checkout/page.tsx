import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import CheckoutForm from "./CheckoutForm";

export const metadata: Metadata = {
    title: "Finalizar pedido | Sayni",
    robots: { index: false, follow: false },
};

// Las tarifas se leen de la base de datos (como máximo cada 60 s)
export const revalidate = 60;

export default async function CheckoutPage() {
    const zones = await prisma.shippingZone.findMany({
        where: { active: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true, district: true, price: true },
    });

    return (
        <div className="min-h-screen bg-sayni-black text-sayni-light">
            <header className="flex items-center justify-between px-6 py-6 sm:px-12">
                <Link href="/" className="flex items-center gap-3">
                    <span className="relative block size-10">
                        <Image src="/assets/brand/logo.webp" alt="Sayni" fill className="object-contain" />
                    </span>
                </Link>
                <Link href="/#cafes" className="text-sm text-white/70 underline-offset-4 transition-colors hover:text-[#BCC90F] hover:underline">
                    ← Volver a la tienda
                </Link>
            </header>

            <main className="mx-auto max-w-6xl px-6 pb-20 sm:px-12">
                <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">Finalizar pedido</h1>
                <CheckoutForm zones={zones} />
            </main>
        </div>
    );
}