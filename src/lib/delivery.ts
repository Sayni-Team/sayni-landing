import { addBusinessDays } from "@/lib/business-days";

// Plazo máximo de entrega (días hábiles, lunes a viernes) desde la confirmación del pago
export const DELIVERY_BUSINESS_DAYS = 3;

export const estimatedDeliveryDate = (from: Date) => addBusinessDays(from, DELIVERY_BUSINESS_DAYS);

/** "viernes 31 de octubre" (hora de Lima) */
export const formatDeliveryDate = (date: Date) =>
    new Intl.DateTimeFormat("es-PE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "America/Lima",
    }).format(date);