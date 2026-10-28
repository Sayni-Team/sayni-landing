import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { complaintCode } from "@/lib/business";
import { formatDate } from "@/lib/order-status";

type Props = { searchParams: Promise<{ estado?: string }> };

const CELL_LINK = "block px-4 py-3";
const dateOnly = (d: Date) => new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeZone: "America/Lima" }).format(d);

export default async function ComplaintsPage({ searchParams }: Props) {
    const { estado = "pendientes" } = await searchParams;
    const status = estado === "respondidos" ? "RESPONDED" : estado === "todos" ? undefined : "PENDING";

    const complaints = await prisma.complaint.findMany({
        where: status ? { status } : undefined,
        orderBy: status === "PENDING" ? { dueAt: "asc" } : { createdAt: "desc" },
        take: 200,
    });
    const now = new Date();

    const tabs = [
        { key: "pendientes", label: "Pendientes" },
        { key: "respondidos", label: "Respondidos" },
        { key: "todos", label: "Todos" },
    ];

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="font-heading text-2xl font-bold">Libro de reclamaciones</h1>
                <a
                    href="/admin/reclamos/exportar"
                    className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 hover:border-[#BCC90F] hover:text-white"
                >
                    Descargar Excel
                </a>
            </div>

            <nav className="mt-6 flex gap-2">
                {tabs.map((t) => (
                    <Link
                        key={t.key}
                        href={`/admin/reclamos?estado=${t.key}`}
                        className={`rounded-full border px-4 py-1.5 text-sm ${
                            t.key === estado ? "border-[#BCC90F] bg-[#BCC90F]/10 text-white" : "border-white/15 text-white/60 hover:text-white"
                        }`}
                    >
                        {t.label}
                    </Link>
                ))}
            </nav>

            {complaints.length === 0 ? (
                <p className="mt-10 text-sm text-white/50">No hay reclamos en esta sección.</p>
            ) : (
                <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
                    <table className="w-full min-w-[680px] text-left text-sm">
                        <thead className="bg-[#132219] text-xs uppercase tracking-wider text-white/50">
                        <tr>
                            <th className="px-4 py-3">Hoja N°</th>
                            <th className="px-4 py-3">Fecha</th>
                            <th className="px-4 py-3">Consumidor</th>
                            <th className="px-4 py-3">Tipo</th>
                            <th className="px-4 py-3">Responder antes del</th>
                            <th className="px-4 py-3">Estado</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                        {complaints.map((c) => {
                            const href = `/admin/reclamos/${c.id}`;
                            const overdue = c.status === "PENDING" && c.dueAt < now;
                            return (
                                <tr key={c.id} className="group cursor-pointer hover:bg-white/[0.04]">
                                    <td className="p-0 font-semibold">
                                        <Link href={href} className={`${CELL_LINK} text-[#BCC90F] group-hover:underline`}>
                                            {complaintCode(c.number)}
                                        </Link>
                                    </td>
                                    <td className="p-0 text-white/70">
                                        <Link href={href} tabIndex={-1} aria-hidden className={CELL_LINK}>{formatDate(c.createdAt)}</Link>
                                    </td>
                                    <td className="p-0">
                                        <Link href={href} tabIndex={-1} aria-hidden className={CELL_LINK}>{c.consumerName}</Link>
                                    </td>
                                    <td className="p-0 text-white/70">
                                        <Link href={href} tabIndex={-1} aria-hidden className={CELL_LINK}>{c.kind === "RECLAMO" ? "Reclamo" : "Queja"}</Link>
                                    </td>
                                    <td className={`p-0 ${overdue ? "font-semibold text-red-300" : "text-white/70"}`}>
                                        <Link href={href} tabIndex={-1} aria-hidden className={CELL_LINK}>
                                            {c.status === "PENDING" ? `${dateOnly(c.dueAt)}${overdue ? " · vencido" : ""}` : "—"}
                                        </Link>
                                    </td>
                                    <td className="p-0">
                                        <Link href={href} tabIndex={-1} aria-hidden className={CELL_LINK}>
                                                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${c.status === "PENDING" ? "bg-[#BCC90F]/20 text-[#BCC90F]" : "bg-emerald-400/15 text-emerald-300"}`}>
                                                    {c.status === "PENDING" ? "Pendiente" : "Respondido"}
                                                </span>
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}