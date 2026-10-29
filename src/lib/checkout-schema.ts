import { z } from "zod";

export const checkoutItemSchema = z.object({
    productId: z.string().min(1),
    variant: z.string().optional(),
    quantity: z.number().int().min(1).max(50),
});

export const checkoutSchema = z.object({
    customerName: z.string().trim().min(3, "Ingresa tu nombre completo").max(80),
    email: z.string().trim().email("Ingresa un correo válido"),
    phone: z
        .string()
        .trim()
        .regex(/^[\d\s+()-]{9,20}$/, "Ingresa un teléfono válido"),
    address: z.string().trim().min(5, "Ingresa tu dirección").max(160),
    reference: z.string().trim().max(160).optional(),
    shippingZoneId: z.string().min(1, "Elige tu distrito"),
    items: z.array(checkoutItemSchema).min(1, "Tu carrito está vacío"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CheckoutField = keyof CheckoutInput;