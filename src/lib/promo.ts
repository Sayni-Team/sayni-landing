// Campañas de temporada. Fechas en hora de Lima (UTC-5). Se usa en cliente y servidor.

/** Cyber Wow 2026: hasta el jueves 5 de noviembre, 23:59 (Lima) */
export const CYBER_END = new Date("2026-11-06T04:59:59Z");

/** Navidad: delivery gratis en Lima desde un monto mínimo, hasta el 23 de diciembre, 23:59 (Lima) */
export const XMAS_FREE_SHIPPING_END = new Date("2026-12-24T04:59:59Z");
export const FREE_SHIPPING_MIN = 6990; // céntimos (S/ 69.90)

export const isCyberActive = (now: Date = new Date()) => now <= CYBER_END;
export const isXmasActive = (now: Date = new Date()) => now > CYBER_END && now <= XMAS_FREE_SHIPPING_END;

/**
 * Costo de envío a cobrar (céntimos).
 * `productsTotal` es lo que se paga por los productos (ya con promociones por cantidad).
 */
export function shippingFor(zonePrice: number, productsTotal: number, now: Date = new Date()): number {
    if (isXmasActive(now) && productsTotal >= FREE_SHIPPING_MIN) return 0;
    return zonePrice;
}
