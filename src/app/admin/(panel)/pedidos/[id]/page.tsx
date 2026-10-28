import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPEN } from "@/lib/pricing";
import { STATUS_LABEL, STATUS_STYLE, TRANSITIONS, formatDate } from "@/lib/order-status";
import { updateOrderStatus } from "../actions";

type Props = { params: Promise<{ id: string }> };

export default async function OrderDetailPage({ params }: Props) {
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: { items: true, shippingZone: true },
    });
    if (!order) notFound();

    // Teléfono para WhatsApp: solo dígitos, con prefijo de Perú si falta
    const digits = order.phone.replace(/\D/g, "");
    const waNumber = digits.length === 9 ? `51${digits}` : digits;

    return (
        <div className="max-w-4xl">
            <Link href="/admin" className="text-sm text-white/60 hover:text-white">
                ← Volver a pedidos
            </Link>

            <div className="mt-4 flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-2xl font-bold">Pedido #{order.number}</h1>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[order.status]}`}>
                    {STATUS_LABEL[order.status]}
                </span>
            </div>
            <p className="mt-1 text-sm text-white/50">
                Creado: {formatDate(order.createdAt)}
                {order.paidAt && ` · Pagado: ${formatDate(order.paidAt)}`}
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
                {/* Cliente */}
                <section className="rounded-2xl border border-white/10 bg-[#132219] p-5">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">Cliente</h2>
                    <p className="mt-3 font-semibold">{order.customerName}</p>
                    <p className="mt-1 text-sm">
                        <a href={`mailto:${order.email}`} className="text-white/70 hover:text-white">{order.email}</a>
                    </p>
                    <p className="mt-1 text-sm">
                        <a
                            href={`https://wa.me/${waNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#BCC90F] hover:underline"
                        >
                            {order.phone} · Escribir por WhatsApp
                        </a>
                    </p>
                </section>

                {/* Entrega */}
                <section className="rounded-2xl border border-white/10 bg-[#132219] p-5">
                    <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">Entrega</h2>
                    <p className="mt-3 font-semibold">{order.shippingZone.district}</p>
                    <p className="mt-1 text-sm text-white/80">{order.address}</p>
                    {order.reference && <p className="mt-1 text-sm text-white/60">Ref.: {order.reference}</p>}
                </section>
            </div>

            {/* Productos y totales */}
            <section className="mt-6 rounded-2xl border border-white/10 bg-[#132219] p-5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">Productos</h2>
                <ul className="mt-3 divide-y divide-white/5">
                    {order.items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between py-3 text-sm">
                            <span>
                                <span className="font-semibold">{item.quantity}×</span> {item.productName}
                            </span>
                            <span className="text-white/80">{formatPEN(item.lineTotal)}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-3 space-y-1 border-t border-white/10 pt-3 text-sm">
                    <div className="flex justify-between text-white/60"><span>Subtotal</span><span>{formatPEN(order.subtotal)}</span></div>
                    <div className="flex justify-between text-white/60"><span>Envío</span><span>{formatPEN(order.shipping)}</span></div>
                    <div className="flex justify-between pt-1 text-base font-bold"><span>Total</span><span>{formatPEN(order.total)}</span></div>
                </div>
                {order.mpPaymentId && (
                    <p className="mt-3 text-xs text-white/40">Pago Mercado Pago: {order.mpPaymentId}</p>
                )}
            </section>

            {/* Acciones de estado */}
            {TRANSITIONS[order.status].length > 0 && (
                <section className="mt-6 flex flex-wrap gap-3">
                    {TRANSITIONS[order.status].map((t) => (
                        <form key={t.to} action={updateOrderStatus.bind(null, order.id, t.to)}>
                            <button
                                type="submit"
                                className={`cursor-pointer rounded-full px-5 py-2.5 text-sm font-bold transition-opacity hover:opacity-90 ${
                                    t.to === "CANCELLED"
                                        ? "border border-red-400/40 text-red-300"
                                        : t.label.startsWith("Deshacer")
                                            ? "border border-white/20 text-white/70"
                                            : "bg-[#BCC90F] text-[#132219]"
                                }`}
                            >
                                {t.label}
                            </button>
                        </form>
                    ))}
                </section>
            )}

            {order.status === "PAID" && (
                <p className="mt-3 text-xs text-white/40">
                    Si cancelas un pedido pagado, el stock vuelve a la tienda, pero el reembolso al cliente se hace desde el panel de Mercado Pago.
                </p>
            )}
        </div>
    );
}