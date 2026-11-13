// Textos de destino de un pedido: Lima (distrito) o provincia (agencia Shalom).
type OrderShipping = {
    shippingMethod: "LIMA_DELIVERY" | "SHALOM";
    shippingZone: { district: string } | null;
    region: string | null;
    city: string | null;
};

export const isShalomOrder = (o: { shippingMethod: string }) => o.shippingMethod === "SHALOM";

/** Texto corto para listados: "Miraflores" o "Shalom · Piura (Piura)" */
export function destinationLabel(o: OrderShipping): string {
    if (o.shippingMethod === "SHALOM") {
        const place = [o.city, o.region && o.region !== o.city ? `(${o.region})` : ""].filter(Boolean).join(" ");
        return `Shalom · ${place || "provincia"}`;
    }
    return o.shippingZone?.district ?? "—";
}

/** Línea de envío en resúmenes: el flete de Shalom nunca es "gratis", se paga al recoger. */
export const SHALOM_FREIGHT_LABEL = "Flete Shalom: pagas al recoger";