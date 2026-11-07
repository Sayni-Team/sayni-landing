// Textos, colores y cambios permitidos de los estados de un pedido.
import type { OrderStatus } from "@prisma/client";

export const STATUS_LABEL: Record<OrderStatus, string> = {
    PENDING: "Pendiente de pago",
    COD_PENDING: "Contra entrega – por confirmar",
    PAID: "Por enviar",
    SHIPPED: "Enviado",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado",
};

export const STATUS_STYLE: Record<OrderStatus, string> = {
    PENDING: "bg-white/10 text-white/70",
    COD_PENDING: "bg-amber-400/15 text-amber-300",
    PAID: "bg-[#BCC90F]/20 text-[#BCC90F]",
    SHIPPED: "bg-sky-400/15 text-sky-300",
    DELIVERED: "bg-emerald-400/15 text-emerald-300",
    CANCELLED: "bg-red-400/15 text-red-300",
};

export const TRANSITIONS: Record<OrderStatus, { to: OrderStatus; label: string }[]> = {
    PENDING: [{ to: "CANCELLED", label: "Cancelar pedido" }],
    COD_PENDING: [
        { to: "PAID", label: "Confirmar pedido (ya lo confirmé por WhatsApp)" },
        { to: "CANCELLED", label: "Cancelar pedido" },
    ],
    PAID: [
        { to: "SHIPPED", label: "Marcar como enviado" },
        { to: "CANCELLED", label: "Cancelar (devuelve el stock)" },
    ],
    SHIPPED: [
        { to: "DELIVERED", label: "Marcar como entregado" },
        { to: "PAID", label: "Deshacer: volver a por enviar" },
    ],
    DELIVERED: [{ to: "SHIPPED", label: "Deshacer: volver a enviado" }],
    CANCELLED: [],
};

export const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("es-PE", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "America/Lima",
    }).format(date);

/* ── Exportación ─────────────────────────── */

// Qué pedidos incluir en la exportación
export const EXPORT_FILTERS: Record<string, { label: string; statuses: OrderStatus[] }> = {
    ventas: { label: "Ventas (pagados, enviados y entregados)", statuses: ["PAID", "SHIPPED", "DELIVERED"] },
    "por-enviar": { label: "Solo por enviar", statuses: ["PAID"] },
    todos: { label: "Todos (incluye pendientes y cancelados)", statuses: ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED", "COD_PENDING"] },
};

/** Fecha de hoy en Lima, en formato YYYY-MM-DD */
export const limaToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Lima" }).format(new Date());