// Cálculo de precios con promociones por cantidad.
// Importes en CÉNTIMOS (S/ 50.00 = 5000). Se usa en cliente y servidor.

export type PriceTier = { quantity: number; price: number };

/**
 * Precio total de `quantity` unidades de un producto.
 * Sin tramos: precio unitario × cantidad.
 * Con tramos: se cobra por ciclos del tramo mayor.
 *   Geisha {1: 5000, 2: 9500, 3: 14500} → 4 bolsas = 14500 + 5000 = 19500
 */
export function priceForQuantity(quantity: number, unitPrice: number, tiers: readonly PriceTier[] = []): number {
    if (quantity <= 0) return 0;
    if (tiers.length === 0) return unitPrice * quantity;

    const byQuantity = new Map(tiers.map((t) => [t.quantity, t.price]));
    const cycle = Math.max(...tiers.map((t) => t.quantity));

    // Los tramos deben cubrir 1..cycle sin huecos
    for (let q = 1; q <= cycle; q++) {
        if (!byQuantity.has(q)) throw new Error(`Falta el tramo de ${q} unidades`);
    }

    const fullCycles = Math.floor(quantity / cycle);
    const rest = quantity % cycle;

    return fullCycles * byQuantity.get(cycle)! + (rest > 0 ? byQuantity.get(rest)! : 0);
}

/** 5000 → "S/ 50.00" */
export const formatPEN = (cents: number) => `S/ ${(cents / 100).toFixed(2)}`;