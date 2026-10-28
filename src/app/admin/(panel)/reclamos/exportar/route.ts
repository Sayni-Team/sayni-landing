import ExcelJS from "exceljs";
import { getAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { complaintCode } from "@/lib/business";
import { formatDate } from "@/lib/order-status";

export const dynamic = "force-dynamic";

export async function GET() {
    if (!(await getAdmin())) return new Response("No autorizado", { status: 401 });

    const complaints = await prisma.complaint.findMany({ orderBy: { number: "asc" } });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Libro de reclamaciones");
    sheet.columns = [
        { header: "Hoja N°", key: "number", width: 10 },
        { header: "Fecha", key: "date", width: 20 },
        { header: "Tipo", key: "kind", width: 10 },
        { header: "Consumidor", key: "name", width: 26 },
        { header: "Documento", key: "doc", width: 18 },
        { header: "Domicilio", key: "address", width: 30 },
        { header: "Teléfono", key: "phone", width: 14 },
        { header: "Correo", key: "email", width: 26 },
        { header: "Apoderado (menor)", key: "guardian", width: 22 },
        { header: "Bien", key: "good", width: 30 },
        { header: "Monto (S/)", key: "amount", width: 12, style: { numFmt: '"S/" #,##0.00' } },
        { header: "N° pedido", key: "order", width: 10 },
        { header: "Detalle", key: "detail", width: 50 },
        { header: "Pedido del consumidor", key: "request", width: 40 },
        { header: "Estado", key: "status", width: 12 },
        { header: "Vence", key: "due", width: 20 },
        { header: "Respuesta", key: "response", width: 50 },
        { header: "Respondido el", key: "respondedAt", width: 20 },
    ];

    for (const c of complaints) {
        sheet.addRow({
            number: complaintCode(c.number),
            date: formatDate(c.createdAt),
            kind: c.kind === "RECLAMO" ? "Reclamo" : "Queja",
            name: c.consumerName,
            doc: `${c.docType} ${c.docNumber}`,
            address: c.address,
            phone: c.phone,
            email: c.email,
            guardian: c.guardianName ?? "",
            good: `${c.goodType === "PRODUCTO" ? "Producto" : "Servicio"}: ${c.goodDescription}`,
            amount: c.amount !== null ? c.amount / 100 : "",
            order: c.orderNumber ?? "",
            detail: c.detail,
            request: c.request,
            status: c.status === "PENDING" ? "Pendiente" : "Respondido",
            due: formatDate(c.dueAt),
            response: c.response ?? "",
            respondedAt: c.respondedAt ? formatDate(c.respondedAt) : "",
        });
    }

    const header = sheet.getRow(1);
    header.font = { bold: true };
    header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFBCC90F" } };
    sheet.views = [{ state: "frozen", ySplit: 1 }];

    const buffer = await workbook.xlsx.writeBuffer();
    return new Response(buffer as ArrayBuffer, {
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="libro-de-reclamaciones-sayni.xlsx"`,
            "Cache-Control": "no-store",
        },
    });
}