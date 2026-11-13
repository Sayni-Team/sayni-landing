import { z } from "zod";
import { PERU_REGIONS } from "./peru-regions";

export const checkoutItemSchema = z.object({
    productId: z.string().min(1),
    variant: z.string().optional(),
    quantity: z.number().int().min(1).max(50),
});

export const checkoutSchema = z
    .object({
        customerName: z.string().trim().min(3, "Ingresa tu nombre completo").max(80),
        email: z.string().trim().email("Ingresa un correo válido"),
        phone: z
            .string()
            .trim()
            .regex(/^[\d\s+()-]{9,20}$/, "Ingresa un teléfono válido"),
        // LIMA: delivery a domicilio. SHALOM: provincia, recojo en agencia Shalom.
        shippingMethod: z.enum(["LIMA", "SHALOM"], { message: "Elige dónde recibes tu pedido" }),

        // Solo Lima
        address: z.string().trim().max(160).optional(),
        reference: z.string().trim().max(160).optional(),
        shippingZoneId: z.string().optional(),

        // Solo provincia (Shalom)
        region: z.string().optional(),
        city: z.string().trim().max(80).optional(),
        shalomAgency: z.string().trim().max(120).optional(),
        pickupDni: z.string().trim().optional(),

        items: z.array(checkoutItemSchema).min(1, "Tu carrito está vacío"),
        paymentMethod: z.enum(["MERCADO_PAGO", "CASH_ON_DELIVERY"]),
    })
    .superRefine((d, ctx) => {
        const need = (path: string, message: string) => ctx.addIssue({ code: "custom", path: [path], message });

        if (d.shippingMethod === "LIMA") {
            if (!d.shippingZoneId) need("shippingZoneId", "Elige tu distrito");
            if (!d.address || d.address.length < 5) need("address", "Ingresa tu dirección");
            return;
        }

        // Provincia
        if (!d.region || !(PERU_REGIONS as readonly string[]).includes(d.region)) need("region", "Elige tu departamento");
        if (!d.city || d.city.length < 3) need("city", "Indica tu ciudad o provincia");
        if (!d.shalomAgency || d.shalomAgency.length < 3) need("shalomAgency", "Indica la agencia Shalom donde recogerás");
        if (!d.pickupDni || !/^\d{8}$/.test(d.pickupDni)) need("pickupDni", "Ingresa un DNI de 8 dígitos");
        // Pagar al recibir es solo para Lima
        if (d.paymentMethod !== "MERCADO_PAGO") need("paymentMethod", "Para provincia el pago es con Mercado Pago");
    });

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CheckoutField = keyof CheckoutInput;