import ExcelJS from "exceljs";
import { getAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EXPORT_FILTERS, STATUS_LABEL, formatDate } from "@/lib/order-status";

export const dynamic = "force-dynamic";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MONEY_FORMAT = '"S/" #,##0.00';
const LIME = "FFBCC90F";

// Perú no tiene horario de verano: siempre UTC-5
const limaStart = (date: string) => new Date(`${date}T00:00:00.000-05:00`);
const limaEnd = (date: string) => new Date(`${date}T23:59:59.999-05:00`);

export async function GET(req: Request) {
    // Las rutas de API no pasan por el layout del panel: se comprueba la sesión aquí
    if (!(await getAdmin())) {
        return new Response("No autorizado", { status: 401 });
    }

    const url = new URL(req.url);
    const from = url.searchParams.get("desde") ?? "";
    const to = url.searchParams.get("hasta") ?? "";
    const filter = EXPORT_FILTERS[url.searchParams.get("estado") ?? "ventas"] ?? EXPORT_FILTERS.ventas;

    if (!DATE_RE.test(from) || !DATE_RE.test(to) || from > to) {
        return new Response("Rango de fechas no válido", { status: 400 });
    }

    const orders = await prisma.order.findMany({
        where: {
            createdAt: { gte: limaStart(from), lte: limaEnd(to) },
            status: { in: filter.statuses },
        },
        orderBy: { createdAt: "asc" },
        include: { items: true, shippingZone: { select: { district: true } } },
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Sayni";
    workbook.created = new Date();

    /* ── Hoja 1: un pedido por fila ── */
    const ordersSheet = workbook.addWorksheet("Pedidos");
    ordersSheet.columns = [
        { header: "N° pedido", key: "number", width: 11 },
        { header: "Fecha", key: "date", width: 20 },
        { header: "Estado", key: "status", width: 18 },
        { header: "Cliente", key: "customer", width: 26 },
        { header: "Correo", key: "email", width: 28 },
        { header: "Teléfono", key: "phone", width: 15 },
        { header: "Distrito", key: "district", width: 22 },
        { header: "Dirección", key: "address", width: 34 },
        { header: "Referencia", key: "reference", width: 26 },
        { header: "Subtotal", key: "subtotal", width: 12, style: { numFmt: MONEY_FORMAT } },
        { header: "Envío", key: "shipping", width: 10, style: { numFmt: MONEY_FORMAT } },
        { header: "Total", key: "total", width: 12, style: { numFmt: MONEY_FORMAT } },
        { header: "Pagado el", key: "paidAt", width: 20 },
        { header: "ID pago Mercado Pago", key: "mpPaymentId", width: 22 },
    ];

    for (const o of orders) {
        ordersSheet.addRow({
            number: o.number,
            date: formatDate(o.createdAt),
            status: STATUS_LABEL[o.status],
            customer: o.customerName,
            email: o.email,
            phone: o.phone,
            district: o.shippingZone.district,
            address: o.address,
            reference: o.reference ?? "",
            subtotal: o.subtotal / 100,
            shipping: o.shipping / 100,
            total: o.total / 100,
            paidAt: o.paidAt ? formatDate(o.paidAt) : "",
            mpPaymentId: o.mpPaymentId ?? "",
        });
    }

    /* ── Hoja 2: un producto vendido por fila ── */
    const itemsSheet = workbook.addWorksheet("Productos");
    itemsSheet.columns = [
        { header: "N° pedido", key: "number", width: 11 },
        { header: "Fecha", key: "date", width: 20 },
        { header: "Estado", key: "status", width: 18 },
        { header: "Producto", key: "product", width: 34 },
        { header: "Presentación", key: "variant", width: 14 },
        { header: "Cantidad", key: "quantity", width: 10 },
        { header: "Total línea", key: "lineTotal", width: 13, style: { numFmt: MONEY_FORMAT } },
    ];

    for (const o of orders) {
        for (const item of o.items) {
            itemsSheet.addRow({
                number: o.number,
                date: formatDate(o.createdAt),
                status: STATUS_LABEL[o.status],
                product: item.productName,
                variant: item.variant ? item.variant[0].toUpperCase() + item.variant.slice(1) : "",
                quantity: item.quantity,
                lineTotal: item.lineTotal / 100,
            });
        }
    }

    // Encabezados en color de la marca, fila fija arriba y filtros en cada columna
    for (const sheet of [ordersSheet, itemsSheet]) {
        const header = sheet.getRow(1);
        header.font = { bold: true };
        header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIME } };
        sheet.views = [{ state: "frozen", ySplit: 1 }];
        sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: sheet.columnCount } };
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer as ArrayBuffer, {
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="pedidos-sayni_${from}_${to}.xlsx"`,
            "Cache-Control": "no-store",
        },
    });
}