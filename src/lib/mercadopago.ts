import "server-only";
import { MercadoPagoConfig } from "mercadopago";

export const mp = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
});

export const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";