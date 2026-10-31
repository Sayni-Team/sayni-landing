import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPEN } from "@/lib/pricing";
import ClearCartOnSuccess from "./ClearCartOnSuccess";
import { estimatedDeliveryDate, formatDeliveryDate } from "@/lib/delivery";

export const metadata = { title: "Estado de tu pedido | Sayni", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ status?: string; external_reference?: string }> };

const MESSAGES = {
    approved: { title: "¡Gracias por tu compra!", text: "Tu pago fue aprobado. Te enviaremos la confirmación por correo." },
    pending: { title: "Pago en proceso", text: "Tu pago está pendiente de confirmación. Te avisaremos por correo cuando se apruebe." },
    rejected: { title: "El pago no se completó", text: "Tu pedido sigue guardado. Puedes volver a intentarlo con otro medio de pago." },
} as const;

export default async function ResultPage({ searchParams }: Props) {
    const { status, external_reference } = await searchParams;

    const order = external_reference
        ? await prisma.order.findUnique({
            where: { id: external_reference },
            select: { number: true, total: true, paidAt: true, createdAt: true },
        })
        : null;

    const kind = status === "approved" ? "approved" : status === "pending" || status === "in_process" ? "pending" : "rejected";
    const message = MESSAGES[kind];

    return (
        <main className="flex min-h-screen items-center justify-center bg-sayni-black px-6 text-sayni-light">
            {kind === "approved" && <ClearCartOnSuccess />}

            <div className="w-full max-w-md rounded-3xl border border-[#BCC90F]/30 bg-[#182a1f] p-8 text-center font-urbanist">
                <h1 className="font-heading text-2xl font-bold text-white">{message.title}</h1>
                {order && (
                    <p className="mt-3 text-sm text-[#BCC90F]">
                        Pedido #{order.number} · {formatPEN(order.total)}
                    </p>
                )}
                <p className="mt-3 text-sm text-white/70">{message.text}</p>

                {/* paidAt puede tardar unos segundos (llega por el webhook): si aún no está, se usa la fecha del pedido */}
                {kind === "approved" && order && (
                    <div className="mt-6 rounded-2xl border border-[#BCC90F]/30 bg-[#BCC90F]/10 px-4 py-3 text-sm">
                        <span className="block text-white/60">Fecha estimada de entrega</span>
                        <span className="font-semibold text-white">
    Hasta el {formatDeliveryDate(estimatedDeliveryDate(order.paidAt ?? order.createdAt))}
</span>
                    </div>
                )}

                <Link
                    href={kind === "rejected" ? "/checkout" : "/"}
                    className="mt-8 inline-flex rounded-full bg-[#BCC90F] px-6 py-3 text-sm font-bold text-[#132219]"
                >
                    {kind === "rejected" ? "Volver a intentar" : "Volver a la tienda"}
                </Link>
            </div>
        </main>
    );
}