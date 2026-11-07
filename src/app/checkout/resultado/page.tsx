import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPEN } from "@/lib/pricing";
import { estimatedDeliveryDate, formatDeliveryDate } from "@/lib/delivery";
import ClearCartOnSuccess from "./ClearCartOnSuccess";
import TrackPurchase from "./TrackPurchase";

export const metadata = { title: "Estado de tu pedido | Sayni", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ status?: string; external_reference?: string }> };

const MESSAGES = {
    approved: { title: "¡Gracias por tu compra!", text: "Tu pago fue aprobado. Te enviaremos la confirmación por correo." },
    cod: { title: "¡Pedido registrado!", text: "Te escribiremos por WhatsApp para coordinar la entrega." },
    pending: { title: "Pago en proceso", text: "Tu pago está pendiente de confirmación. Te avisaremos por correo cuando se apruebe." },
    rejected: { title: "El pago no se completó", text: "Tu pedido sigue guardado. Puedes volver a intentarlo con otro medio de pago." },
} as const;

export default async function ResultPage({ searchParams }: Props) {
    const { status, external_reference } = await searchParams;

    const order = external_reference
        ? await prisma.order.findUnique({
            where: { id: external_reference },
            select: { id: true, number: true, total: true, paidAt: true, createdAt: true, paymentMethod: true },
        })
        : null;

    // Contra entrega: solo si el pedido existe y realmente es contra entrega
    const isCod = status === "cod" && order?.paymentMethod === "CASH_ON_DELIVERY";

    const kind = isCod
        ? "cod"
        : status === "approved"
            ? "approved"
            : status === "pending" || status === "in_process"
                ? "pending"
                : "rejected";
    const message = MESSAGES[kind];

    // Pedido completado (pagado o registrado contra entrega): se vacía el carrito y se registra la compra
    const completed = kind === "approved" || kind === "cod";

    return (
        <main className="flex min-h-screen items-center justify-center bg-sayni-black px-6 text-sayni-light">
            {completed && <ClearCartOnSuccess />}
            {completed && order && <TrackPurchase orderId={order.id} total={order.total} />}

            <div className="w-full max-w-md rounded-3xl border border-[#BCC90F]/30 bg-[#182a1f] p-8 text-center font-urbanist">
                <h1 className="font-heading text-2xl font-bold text-white">{message.title}</h1>
                {order && (
                    <p className="mt-3 text-sm text-[#BCC90F]">
                        Pedido #{order.number} · {formatPEN(order.total)}
                    </p>
                )}
                <p className="mt-3 text-sm text-white/70">{message.text}</p>

                {/* Contra entrega: cómo pagará */}
                {kind === "cod" && order && (
                    <div className="mt-6 rounded-2xl border border-[#BCC90F]/30 bg-[#BCC90F]/10 px-4 py-3 text-sm">
                        <span className="block text-white/60">Pagas al recibir</span>
                        <span className="font-semibold text-white">
                            {formatPEN(order.total)} con Yape, Plin o efectivo
                        </span>
                    </div>
                )}

                {/* Mercado Pago: fecha estimada. paidAt puede tardar unos segundos (llega por el webhook) */}
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