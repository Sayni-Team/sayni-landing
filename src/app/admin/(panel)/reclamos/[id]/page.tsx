import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPEN } from "@/lib/pricing";
import { complaintCode } from "@/lib/business";
import { formatDate } from "@/lib/order-status";
import RespondForm from "../RespondForm";

type Props = { params: Promise<{ id: string }> };

const DOC_LABEL: Record<string, string> = { DNI: "DNI", CE: "Carné de extranjería", PASAPORTE: "Pasaporte" };

export default async function ComplaintDetailPage({ params }: Props) {
    const { id } = await params;
    const c = await prisma.complaint.findUnique({ where: { id } });
    if (!c) notFound();

    const overdue = c.status === "PENDING" && c.dueAt < new Date();

    const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
        <div className="grid gap-1 py-2 sm:grid-cols-[200px_1fr]">
            <dt className="text-sm text-white/50">{label}</dt>
            <dd className="whitespace-pre-line text-sm">{children}</dd>
        </div>
    );

    return (
        <div className="max-w-3xl">
            <Link href="/admin/reclamos" className="text-sm text-white/60 hover:text-white">← Volver al libro</Link>

            <h1 className="mt-4 font-heading text-2xl font-bold">
                Hoja N° {complaintCode(c.number)} · {c.kind === "RECLAMO" ? "Reclamo" : "Queja"}
            </h1>
            <p className={`mt-1 text-sm ${overdue ? "font-semibold text-red-300" : "text-white/50"}`}>
                Registrada: {formatDate(c.createdAt)}
                {c.status === "PENDING" && ` · Responder antes del ${formatDate(c.dueAt)}${overdue ? " (vencido)" : ""}`}
            </p>

            <dl className="mt-6 divide-y divide-white/5 rounded-2xl border border-white/10 bg-[#132219] px-5 py-2">
                <Row label="Consumidor">{c.consumerName}</Row>
                <Row label="Documento">{DOC_LABEL[c.docType] ?? c.docType} {c.docNumber}</Row>
                <Row label="Domicilio">{c.address}</Row>
                <Row label="Contacto">{c.phone} · {c.email}</Row>
                {c.isMinor && <Row label="Padre, madre o apoderado">{c.guardianName}</Row>}
                <Row label="Bien contratado">{c.goodType === "PRODUCTO" ? "Producto" : "Servicio"}: {c.goodDescription}</Row>
                {c.amount !== null && <Row label="Monto reclamado">{formatPEN(c.amount)}</Row>}
                {c.orderNumber !== null && (
                    <Row label="N° de pedido">#{c.orderNumber}</Row>
                )}
                <Row label="Detalle">{c.detail}</Row>
                <Row label="Pedido del consumidor">{c.request}</Row>
            </dl>

            <section className="mt-6 rounded-2xl border border-white/10 bg-[#132219] p-5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">Respuesta del proveedor</h2>
                {c.status === "RESPONDED" ? (
                    <>
                        <p className="mt-3 whitespace-pre-line text-sm">{c.response}</p>
                        <p className="mt-3 text-xs text-white/45">Respondido el {formatDate(c.respondedAt!)} · enviado por correo al consumidor.</p>
                    </>
                ) : (
                    <div className="mt-3">
                        <RespondForm complaintId={c.id} />
                    </div>
                )}
            </section>
        </div>
    );
}