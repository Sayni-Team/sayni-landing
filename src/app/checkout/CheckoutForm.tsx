"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPEN } from "@/lib/pricing";
import { checkoutSchema, type CheckoutField } from "@/lib/checkout-schema";
import { createOrder } from "./actions";

type Zone = { id: string; district: string; price: number };

const WHATSAPP_NUMBER = "51939273366";
const PROVINCE = "provincia"; // opción especial: se cotiza por WhatsApp

const INPUT =
    "w-full rounded-xl border bg-[#132219] px-4 py-3 text-sm text-white placeholder-white/35 transition-colors focus:border-[#BCC90F] focus:outline-none";

export default function CheckoutForm({ zones }: { zones: Zone[] }) {
    const { items, subtotal, discount, total, isInitialized } = useCart();
    const [isPending, startTransition] = useTransition();

    const [form, setForm] = useState({
        customerName: "",
        email: "",
        phone: "",
        address: "",
        reference: "",
        shippingZoneId: "",
        city: "", // solo para provincia
    });
    const [errors, setErrors] = useState<Partial<Record<CheckoutField | "city", string>>>({});
    const [serverError, setServerError] = useState("");

    const isProvince = form.shippingZoneId === PROVINCE;
    const zone = useMemo(() => zones.find((z) => z.id === form.shippingZoneId), [zones, form.shippingZoneId]);
    const shipping = zone?.price ?? 0;

    const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm((f) => ({ ...f, [field]: e.target.value }));
        setErrors((er) => ({ ...er, [field]: undefined }));
    };

    // Datos para validar y enviar (provincia no necesita zona de la base de datos)
    const payload = () => ({
        customerName: form.customerName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        reference: form.reference || undefined,
        shippingZoneId: isProvince ? PROVINCE : form.shippingZoneId,
        items: items.map((i) => ({ productId: i.productId, variant: i.variant, quantity: i.quantity })),
    });

    const validate = () => {
        const result = checkoutSchema.safeParse(payload());
        const next: typeof errors = {};
        if (!result.success) {
            for (const [key, messages] of Object.entries(result.error.flatten().fieldErrors)) {
                next[key as CheckoutField] = messages?.[0];
            }
        }
        if (isProvince && form.city.trim().length < 3) next.city = "Indica tu ciudad o provincia";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    // Provincia: el pedido se coordina por WhatsApp (el envío se cotiza aparte)
    const sendToWhatsApp = () => {
        const list = items.map((i) => `• ${i.quantity}x *${i.title}* — ${formatPEN(i.unitPrice)} c/u`).join("\n");
        const promo = discount > 0 ? `\n*Descuento por promoción:* -${formatPEN(discount)}` : "";
        const message =
            `¡Hola Sayni! ☕ Quiero hacer un pedido para *provincia*:\n\n${list}\n${promo}\n*Total productos:* ${formatPEN(total)}\n\n` +
            `*Nombre:* ${form.customerName}\n*Teléfono:* ${form.phone}\n*Correo:* ${form.email}\n` +
            `*Ciudad / provincia:* ${form.city}\n*Dirección:* ${form.address}` +
            (form.reference ? `\n*Referencia:* ${form.reference}` : "") +
            `\n\n¿Me pueden cotizar el envío?`;

        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setServerError("");
        if (!validate()) return;

        if (isProvince) {
            sendToWhatsApp();
            return;
        }

        startTransition(async () => {
            const result = await createOrder(payload());
            if (!result.ok) {
                setServerError(result.error);
                if (result.fieldErrors) setErrors(result.fieldErrors);
                return;
            }
            // Al pago en la página de Mercado Pago
            window.location.href = result.checkoutUrl;
        });
    };

    /* ── Estados especiales ── */

    if (!isInitialized) {
        return <p className="mt-10 text-white/60">Cargando tu carrito…</p>;
    }

    if (items.length === 0) {
        return (
            <div className="mt-10 text-center">
                <p className="text-white/70">Tu carrito está vacío.</p>
                <Link href="/#cafes" className="mt-4 inline-block font-semibold text-[#BCC90F] underline underline-offset-4">
                    Ver nuestros cafés
                </Link>
            </div>
        );
    }

    /* ── Formulario + resumen ── */

    return (
        <form onSubmit={onSubmit} noValidate className="mt-10 grid gap-10 font-urbanist lg:grid-cols-[1fr_400px]">
            {/* Datos */}
            <div className="space-y-8">
                <fieldset className="space-y-4">
                    <legend className="mb-2 font-heading text-lg font-bold text-white">Tus datos</legend>
                    <Field label="Nombre completo" error={errors.customerName}>
                        <input className={cnInput(errors.customerName)} value={form.customerName} onChange={set("customerName")} autoComplete="name" />
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Correo" error={errors.email}>
                            <input type="email" className={cnInput(errors.email)} value={form.email} onChange={set("email")} autoComplete="email" />
                        </Field>
                        <Field label="Teléfono" error={errors.phone}>
                            <input type="tel" className={cnInput(errors.phone)} value={form.phone} onChange={set("phone")} autoComplete="tel" placeholder="999 999 999" />
                        </Field>
                    </div>
                </fieldset>

                <fieldset className="space-y-4">
                    <legend className="mb-2 font-heading text-lg font-bold text-white">Entrega</legend>
                    <Field label="Distrito" error={errors.shippingZoneId}>
                        <select className={cnInput(errors.shippingZoneId)} value={form.shippingZoneId} onChange={set("shippingZoneId")}>
                            <option value="">Elige tu distrito</option>
                            <optgroup label="Lima y Callao">
                                {zones.map((z) => (
                                    <option key={z.id} value={z.id}>
                                        {z.district} — {formatPEN(z.price)}
                                    </option>
                                ))}
                            </optgroup>
                            <optgroup label="Fuera de Lima">
                                <option value={PROVINCE}>Provincia — se cotiza por WhatsApp</option>
                            </optgroup>
                        </select>
                    </Field>

                    {isProvince && (
                        <Field label="Ciudad / provincia" error={errors.city}>
                            <input className={cnInput(errors.city)} value={form.city} onChange={set("city")} placeholder="Ej. Arequipa" />
                        </Field>
                    )}

                    <Field label="Dirección" error={errors.address}>
                        <input className={cnInput(errors.address)} value={form.address} onChange={set("address")} autoComplete="street-address" />
                    </Field>
                    <Field label="Referencia (opcional)" error={errors.reference}>
                        <input className={cnInput(errors.reference)} value={form.reference} onChange={set("reference")} placeholder="Ej. Frente al parque" />
                    </Field>
                </fieldset>
            </div>

            {/* Resumen */}
            <aside className="h-fit space-y-5 rounded-3xl border border-white/10 bg-[#132219] p-6 lg:sticky lg:top-8">
                <h2 className="font-heading text-lg font-bold text-white">Tu pedido</h2>

                <ul className="space-y-3">
                    {items.map((item) => (
                        <li key={item.id} className="flex items-center gap-3">
                            <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-[#1b2f22]">
                                <Image src={item.image} alt="" fill className="object-contain p-1" />
                            </span>
                            <span className="min-w-0 flex-1 text-sm text-white">
                                <span className="block truncate font-semibold">{item.title}</span>
                                <span className="text-xs text-white/50">
                                    {item.quantity} × {formatPEN(item.unitPrice)}
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>

                <div className="space-y-1.5 border-t border-white/10 pt-4 text-sm">
                    <Row label="Subtotal" value={formatPEN(subtotal)} />
                    {discount > 0 && <Row label="Promoción aplicada" value={`-${formatPEN(discount)}`} accent />}
                    <Row label="Envío" value={isProvince ? "Por cotizar" : zone ? formatPEN(shipping) : "—"} />
                    <div className="flex items-center justify-between pt-2 text-base">
                        <span className="text-white/80">Total</span>
                        <span className="text-xl font-bold text-white">{formatPEN(total + (isProvince ? 0 : shipping))}</span>
                    </div>
                </div>

                {serverError && (
                    <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">
                        {serverError}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-full border-t border-white/40 bg-[#BCC90F] px-6 py-3.5 text-base font-bold text-[#132219] shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
                >
                    {isPending ? "Procesando…" : isProvince ? "Coordinar por WhatsApp" : "Continuar al pago"}
                </button>
            </aside>
        </form>
    );
}

/* ── Piezas ─────────────────────────────── */

const cnInput = (error?: string) => `${INPUT} ${error ? "border-red-400" : "border-white/10"}`;

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-white/80">{label}</span>
            {children}
            {error && <span className="mt-1 block text-xs text-red-300">{error}</span>}
        </label>
    );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
    return (
        <div className={`flex items-center justify-between ${accent ? "text-[#BCC90F]" : "text-white/60"}`}>
            <span>{label}</span>
            <span>{value}</span>
        </div>
    );
}