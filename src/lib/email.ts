import "server-only";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { formatPEN } from "@/lib/pricing";
import { SITE_URL } from "@/lib/mercadopago";
import { BUSINESS, complaintCode } from "@/lib/business";


const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.MAIL_FROM ?? "Sayni Café <pedidos@sayniperu.com>";
const REPLY_TO = process.env.MAIL_REPLY_TO;
const NOTIFY_TO = process.env.ORDER_NOTIFY_EMAIL;

// Colores de la marca
const DARK = "#132219";
const LIME = "#BCC90F";

/** Escapa los datos del cliente antes de meterlos en el HTML del correo */
const esc = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

async function getOrder(orderId: string) {
    return prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true, shippingZone: true },
    });
}

type OrderForEmail = NonNullable<Awaited<ReturnType<typeof getOrder>>>;

/* ── Piezas del correo ─────────────────────── */

function layout(title: string, body: string) {
    return `
    <div style="background:#f3f3ef; padding:24px 0; font-family:Helvetica, Arial, sans-serif;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden;">
            <tr>
                <td style="padding:24px 32px; background:${DARK};">
                    <span style="font-size:22px; font-weight:bold; letter-spacing:3px; color:${LIME};">SAYNI</span>
                    <div style="margin-top:2px; font-size:10px; letter-spacing:2px; color:#ffffff; opacity:0.6;">CAFÉ DE CUSCO</div>
                </td>
            </tr>
            <tr><td style="height:4px; background:${LIME}; line-height:4px; font-size:0;">&nbsp;</td></tr>
            <tr>
                <td style="padding:32px; color:#1a1a1a;">
                    <h1 style="margin:0 0 16px; font-size:22px; color:${DARK};">${title}</h1>
                    ${body}
                </td>
            </tr>
            <tr>
                <td style="padding:18px 32px; background:${DARK}; font-size:11px; color:#ffffff; opacity:0.7;">
                    Sayni Café · sayniperu.com
                </td>
            </tr>
        </table>
    </div>`;
}

function itemsTable(order: OrderForEmail) {
    const rows = order.items
        .map(
            (item) => `
            <tr>
                <td style="padding:10px 0; border-bottom:1px solid #eeeeea; font-size:14px;">
                    <strong>${item.quantity}×</strong> ${esc(item.productName)}
                </td>
                <td style="padding:10px 0; border-bottom:1px solid #eeeeea; font-size:14px; text-align:right; white-space:nowrap;">
                    ${formatPEN(item.lineTotal)}
                </td>
            </tr>`
        )
        .join("");

    const line = (label: string, value: string, bold = false) => `
        <tr>
            <td style="padding:4px 0; font-size:${bold ? 16 : 14}px; ${bold ? "font-weight:bold;" : "color:#666;"}">${label}</td>
            <td style="padding:4px 0; font-size:${bold ? 16 : 14}px; text-align:right; ${bold ? "font-weight:bold;" : "color:#666;"}">${value}</td>
        </tr>`;

    return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:8px 0 16px;">
        ${rows}
        <tr><td colspan="2" style="height:8px;"></td></tr>
        ${line("Subtotal", formatPEN(order.subtotal))}
        ${line(`Envío (${esc(order.shippingZone.district)})`, formatPEN(order.shipping))}
        ${line("Total pagado", formatPEN(order.total), true)}
    </table>`;
}

function addressBlock(order: OrderForEmail) {
    return `
    <div style="margin-top:8px; padding:16px; background:#f6f7ef; border-radius:12px; font-size:14px; line-height:1.5;">
        <strong>Entrega en ${esc(order.shippingZone.district)}</strong><br />
        ${esc(order.address)}
        ${order.reference ? `<br /><span style="color:#666;">Ref.: ${esc(order.reference)}</span>` : ""}
    </div>`;
}

/* ── Correos ─────────────────────────────── */

function customerEmail(order: OrderForEmail) {
    const firstName = esc(order.customerName.split(" ")[0]);
    return layout(
        `¡Gracias por tu compra, ${firstName}!`,
        `
        <p style="margin:0 0 16px; font-size:14px; line-height:1.6;">
            Recibimos tu pago y ya estamos preparando tu pedido <strong>#${order.number}</strong>.
            Te avisaremos cuando salga a reparto.
        </p>
        ${itemsTable(order)}
        ${addressBlock(order)}
        <p style="margin:24px 0 0; font-size:13px; line-height:1.6; color:#666;">
            ¿Tienes alguna duda sobre tu pedido? Responde a este correo y te ayudamos.
        </p>`
    );
}

function adminEmail(order: OrderForEmail) {
    const panelUrl = `${SITE_URL}/admin/pedidos/${order.id}`;
    return layout(
        `Nuevo pedido #${order.number} pagado`,
        `
        <p style="margin:0 0 16px; font-size:14px; line-height:1.6;">
            <strong>${esc(order.customerName)}</strong><br />
            ${esc(order.phone)} · ${esc(order.email)}
        </p>
        ${addressBlock(order)}
        ${itemsTable(order)}
        <a href="${panelUrl}" style="display:inline-block; margin-top:8px; padding:12px 24px; background:${LIME}; color:${DARK}; font-size:14px; font-weight:bold; text-decoration:none; border-radius:999px;">
            Ver pedido en el panel
        </a>
        <p style="margin:16px 0 0; font-size:12px; color:#888;">Responder a este correo le escribe directamente al cliente.</p>`
    );
}

/**
 * Envía la confirmación al cliente y el aviso al negocio.
 * Las claves de idempotencia evitan correos duplicados si se llama dos veces para el mismo pedido.
 */
export async function sendOrderPaidEmails(orderId: string) {
    const order = await getOrder(orderId);
    if (!order) return;

    const results = await Promise.allSettled([
        resend.emails.send(
            {
                from: FROM,
                to: order.email,
                replyTo: REPLY_TO,
                subject: `Confirmamos tu pedido #${order.number} — Sayni`,
                html: customerEmail(order),
            },
            { idempotencyKey: `order-paid-customer/${order.id}` }
        ),
        NOTIFY_TO
            ? resend.emails.send(
                {
                    from: FROM,
                    to: NOTIFY_TO,
                    replyTo: order.email,
                    subject: `Nuevo pedido #${order.number} — ${formatPEN(order.total)}`,
                    html: adminEmail(order),
                },
                { idempotencyKey: `order-paid-admin/${order.id}` }
            )
            : Promise.resolve(null),
    ]);

    // Los fallos se registran, pero no afectan al pedido
    for (const result of results) {
        if (result.status === "rejected") {
            console.error(`Error enviando correo del pedido #${order.number}`, result.reason);
        } else if (result.value?.error) {
            console.error(`Resend rechazó un correo del pedido #${order.number}`, result.value.error);
        }
    }
}

const limaDate = (date: Date) =>
    new Intl.DateTimeFormat("es-PE", { dateStyle: "long", timeStyle: "short", timeZone: "America/Lima" }).format(date);

const DOC_LABEL: Record<string, string> = { DNI: "DNI", CE: "Carné de extranjería", PASAPORTE: "Pasaporte" };

async function getComplaint(id: string) {
    return prisma.complaint.findUnique({ where: { id } });
}
type ComplaintForEmail = NonNullable<Awaited<ReturnType<typeof getComplaint>>>;

/** La hoja completa, tal como la registró el consumidor */
function complaintSheet(c: ComplaintForEmail) {
    const row = (label: string, value: string) => `
        <tr>
            <td style="padding:6px 0; font-size:13px; color:#666; width:170px; vertical-align:top;">${label}</td>
            <td style="padding:6px 0; font-size:13px;">${value}</td>
        </tr>`;

    return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        ${row("Hoja N°", `<strong>${complaintCode(c.number)}</strong>`)}
        ${row("Fecha", limaDate(c.createdAt))}
        ${row("Proveedor", `${esc(BUSINESS.legalName)} · RUC ${esc(BUSINESS.ruc)}<br />${esc(BUSINESS.address)}`)}
        <tr><td colspan="2" style="padding:10px 0 4px; font-weight:bold; font-size:14px;">Consumidor</td></tr>
        ${row("Nombre", esc(c.consumerName))}
        ${row("Documento", `${DOC_LABEL[c.docType] ?? c.docType} ${esc(c.docNumber)}`)}
        ${row("Domicilio", esc(c.address))}
        ${row("Teléfono / correo", `${esc(c.phone)} · ${esc(c.email)}`)}
        ${c.isMinor ? row("Padre, madre o apoderado", esc(c.guardianName ?? "")) : ""}
        <tr><td colspan="2" style="padding:10px 0 4px; font-weight:bold; font-size:14px;">Bien contratado</td></tr>
        ${row("Tipo", c.goodType === "PRODUCTO" ? "Producto" : "Servicio")}
        ${row("Descripción", esc(c.goodDescription))}
        ${c.amount !== null ? row("Monto reclamado", formatPEN(c.amount)) : ""}
        ${c.orderNumber !== null ? row("N° de pedido", `#${c.orderNumber}`) : ""}
        <tr><td colspan="2" style="padding:10px 0 4px; font-weight:bold; font-size:14px;">${c.kind === "RECLAMO" ? "Reclamo" : "Queja"}</td></tr>
        ${row("Detalle", esc(c.detail).replace(/\n/g, "<br />"))}
        ${row("Pedido del consumidor", esc(c.request).replace(/\n/g, "<br />"))}
    </table>`;
}

/** Constancia al consumidor + aviso al negocio */
export async function sendComplaintEmails(complaintId: string) {
    const c = await getComplaint(complaintId);
    if (!c) return;

    const code = complaintCode(c.number);
    const results = await Promise.allSettled([
        resend.emails.send(
            {
                from: FROM,
                to: c.email,
                replyTo: REPLY_TO,
                subject: `Constancia de tu hoja de reclamación N° ${code} — Sayni`,
                html: layout(
                    `Hoja de reclamación N° ${code}`,
                    `<p style="margin:0 0 16px; font-size:14px; line-height:1.6;">
                        Registramos tu ${c.kind === "RECLAMO" ? "reclamo" : "queja"}. Esta es tu constancia.
                        Te responderemos a este correo en un plazo máximo de 15 días hábiles.
                    </p>
                    ${complaintSheet(c)}`
                ),
            },
            { idempotencyKey: `complaint-customer/${c.id}` }
        ),
        NOTIFY_TO
            ? resend.emails.send(
                {
                    from: FROM,
                    to: NOTIFY_TO,
                    replyTo: c.email,
                    subject: `Nuevo ${c.kind === "RECLAMO" ? "reclamo" : "queja"} N° ${code} — responder antes del ${new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeZone: "America/Lima" }).format(c.dueAt)}`,
                    html: layout(
                        `Nuevo ${c.kind === "RECLAMO" ? "reclamo" : "queja"} N° ${code}`,
                        `${complaintSheet(c)}
                          <a href="${SITE_URL}/admin/reclamos/${c.id}" style="display:inline-block; margin-top:16px; padding:12px 24px; background:${LIME}; color:${DARK}; font-size:14px; font-weight:bold; text-decoration:none; border-radius:999px;">
                              Responder en el panel
                          </a>`
                    ),
                },
                { idempotencyKey: `complaint-admin/${c.id}` }
            )
            : Promise.resolve(null),
    ]);

    for (const r of results) {
        if (r.status === "rejected") console.error(`Error enviando correo del reclamo ${code}`, r.reason);
        else if (r.value?.error) console.error(`Resend rechazó un correo del reclamo ${code}`, r.value.error);
    }
}

/** Respuesta del proveedor al consumidor */
export async function sendComplaintResponseEmail(complaintId: string) {
    const c = await getComplaint(complaintId);
    if (!c || !c.response) return;

    const code = complaintCode(c.number);
    const { error } = await resend.emails.send(
        {
            from: FROM,
            to: c.email,
            replyTo: REPLY_TO,
            subject: `Respuesta a tu hoja de reclamación N° ${code} — Sayni`,
            html: layout(
                `Respuesta a tu hoja N° ${code}`,
                `<div style="padding:16px; background:#f6f7ef; border-radius:12px; font-size:14px; line-height:1.6;">
                    ${esc(c.response).replace(/\n/g, "<br />")}
                </div>
                <p style="margin:16px 0 0; font-size:12px; color:#666;">
                    ${esc(BUSINESS.legalName)} · RUC ${esc(BUSINESS.ruc)}
                </p>`
            ),
        },
        { idempotencyKey: `complaint-response/${c.id}` }
    );
    if (error) console.error(`Resend rechazó la respuesta del reclamo ${code}`, error);
}