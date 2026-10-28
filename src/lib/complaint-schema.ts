import { z } from "zod";

// Campo numérico opcional: vacío → undefined
const optionalNumber = (schema: z.ZodNumber) =>
    z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : Number(v)), schema.optional());

export const complaintSchema = z
    .object({
        consumerName: z.string().trim().min(3, "Ingresa tu nombre completo").max(100),
        docType: z.enum(["DNI", "CE", "PASAPORTE"]),
        docNumber: z
            .string()
            .trim()
            .min(6, "Número de documento no válido")
            .max(15)
            .regex(/^[A-Za-z0-9]+$/, "Solo letras y números"),
        address: z.string().trim().min(5, "Ingresa tu domicilio").max(200),
        phone: z.string().trim().regex(/^[\d\s+()-]{6,20}$/, "Teléfono no válido"),
        email: z.string().trim().email("Correo no válido"),
        isMinor: z.boolean(),
        guardianName: z.string().trim().max(100).optional(),

        goodType: z.enum(["PRODUCTO", "SERVICIO"]),
        goodDescription: z.string().trim().min(3, "Describe el producto o servicio").max(300),
        amount: optionalNumber(z.number().min(0, "Monto no válido").max(100000)),
        orderNumber: optionalNumber(z.number().int("N° de pedido no válido").positive("N° de pedido no válido")),

        kind: z.enum(["RECLAMO", "QUEJA"]),
        detail: z.string().trim().min(10, "Describe tu reclamo o queja").max(3000),
        request: z.string().trim().min(5, "Indica qué solicitas").max(2000),

        accepted: z.literal(true, "Debes confirmar que la información es correcta"),
        website: z.string().optional(), // honeypot: solo lo rellenan los bots
    })
    .refine((d) => !d.isMinor || (d.guardianName ?? "").length >= 3, {
        path: ["guardianName"],
        message: "Ingresa el nombre del padre, madre o apoderado",
    });

export type ComplaintInput = z.input<typeof complaintSchema>;
export type ComplaintField = keyof ComplaintInput;