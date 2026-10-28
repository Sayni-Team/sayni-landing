import Link from "next/link";
import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatPEN } from "@/lib/pricing";
import { STATUS_LABEL, STATUS_STYLE, formatDate } from "@/lib/order-status";

type Props = { searchParams: Promise<{ estado?: string }> };

// Pestañas de filtro. "Por enviar" va primero: es lo que hay que preparar.
const FILTERS: { key: string; label: string; status?: OrderStatus }[] = [
    { key: "por-enviar", label: "Por enviar", status: "PAID" },
    { key: "enviados", label: "Enviados", status: "SHIPPED" },
    { key: "entregados", label: "Entregados", status: "DELIVERED" },
    { key: "pendientes", label: "Pendientes de pago", status: "PENDING" },
    { key: "cancelados", label: "Cancelados", status: "CANCELLED" },
    { key: "todos", label: "Todos" },
];

export default async function OrdersPage({ searchParams }: Props) {
    const { estado = "por-enviar" } = await searchParams;
    const filter = FILTERS.find((f) => f.key === estado) ?? FILTERS[0];

    const [orders, counts] = await Promise.all([
        prisma.order.findMany({
            where: filter.status ? { status: filter.status } : undefined,
            orderBy: { createdAt: "desc" },
            take: 100,
            include: { shippingZone: { select: { district: true } }, _count: { select: { items: true } } },
        }),
        prisma.order.groupBy({ by: ["status"], _count: true }),
    ]);

    const countBy = Object.fromEntries(counts.map((c) => [c.status, c._count])) as Partial<Record<OrderStatus, number>>;

    return (
        <div>
            <h1 className="font-heading text-2xl font-bold">Pedidos</h1>

            {/* Filtros */}
            <nav className="mt-6 flex flex-wrap gap-2">
                {FILTERS.map((f) => {
                    const active = f.key === filter.key;
                    const count = f.status ? countBy[f.status] ?? 0 : undefined;
                    return (
                        <Link
                            key={f.key}
                            href={`/admin?estado=${f.key}`}
                            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                                active
                                    ? "border-[#BCC90F] bg-[#BCC90F]/10 text-white"
                                    : "border-white/15 text-white/60 hover:border-white/35 hover:text-white"
                            }`}
                        >
                            {f.label}
                            {count !== undefined && <span className="ml-1.5 text-white/40">{count}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Lista */}
            {orders.length === 0 ? (
                <p className="mt-10 text-sm text-white/50">No hay pedidos en esta sección.</p>
            ) : (
                <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
                    <table className="w-full min-w-[720px] text-left text-sm">
                        <thead className="bg-[#132219] text-xs uppercase tracking-wider text-white/50">
                        <tr>
                            <th className="px-4 py-3">Pedido</th>
                            <th className="px-4 py-3">Fecha</th>
                            <th className="px-4 py-3">Cliente</th>
                            <th className="px-4 py-3">Distrito</th>
                            <th className="px-4 py-3 text-right">Total</th>
                            <th className="px-4 py-3">Estado</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {orders.map((o) => (
                            <tr key={o.id} className="transition-colors hover:bg-white/[0.03]">
                                <td className="px-4 py-3 font-semibold">
                                    <Link href={`/admin/pedidos/${o.id}`} className="text-[#BCC90F] hover:underline">
                                        #{o.number}
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-white/70">{formatDate(o.createdAt)}</td>
                                <td className="px-4 py-3">
                                    <span className="block">{o.customerName}</span>
                                    <span className="text-xs text-white/50">{o._count.items} producto(s)</span>
                                </td>
                                <td className="px-4 py-3 text-white/70">{o.shippingZone.district}</td>
                                <td className="px-4 py-3 text-right font-semibold">{formatPEN(o.total)}</td>
                                <td className="px-4 py-3">
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[o.status]}`}>
                                            {STATUS_LABEL[o.status]}
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}