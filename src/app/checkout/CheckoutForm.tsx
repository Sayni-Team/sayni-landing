"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatPEN } from "@/lib/pricing";
import { checkoutSchema, type CheckoutField, type CheckoutInput } from "@/lib/checkout-schema";
import { createOrder } from "./actions";
import { estimatedDeliveryDate, formatDeliveryDate } from "@/lib/delivery";
import { clarityEvent } from "@/lib/clarity";
import { metaCustomEvent, metaEvent, toSoles } from "@/lib/metaPixel";
import { FREE_SHIPPING_MIN, isXmasActive, shippingFor } from "@/lib/promo";
import { PERU_REGIONS } from "@/lib/peru-regions";

type Zone = { id: string; district: string; price: number };
type PaymentMethod = "MERCADO_PAGO" | "CASH_ON_DELIVERY";
type ShippingMethod = "" | "LIMA" | "SHALOM";

const WHATSAPP_NUMBER = "51939273366";
const WHATSAPP_HELP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "¡Hola Sayni! ☕ Tengo una consulta sobre mi pedido y el envío."
)}`;

const INPUT =
    "w-full rounded-xl border bg-[#132219] px-4 py-3 text-sm text-white placeholder-white/35 transition-colors focus:border-[#BCC90F] focus:outline-none";

// Opciones de pago (pagar al recibir es solo para Lima; provincia paga con Mercado Pago)
const PAYMENT_OPTIONS: { value: PaymentMethod; title: string; text: string }[] = [
    { value: "MERCADO_PAGO", title: "Pagar ahora con Mercado Pago", text: "Tarjeta, Yape y otros medios" },
    { value: "CASH_ON_DELIVERY", title: "Pagar al recibir", text: "Yape, Plin o efectivo · te confirmamos por WhatsApp" },
];

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
        // Solo provincia (Shalom)
        region: "",
        city: "",
        shalomAgency: "",
        pickupDni: "",
    });
    const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("");
    const [errors, setErrors] = useState<Partial<Record<CheckoutField, string>>>({});
    const [serverError, setServerError] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("MERCADO_PAGO");

    // Una sola vez al entrar al checkout con productos en el carrito
    const checkoutTracked = useRef(false);
    useEffect(() => {
        if (!isInitialized || items.length === 0 || checkoutTracked.current) return;
        checkoutTracked.current = true;
        clarityEvent("checkout_start");
        metaEvent("InitiateCheckout", {
            content_ids: items.map((i) => i.productId),
            content_type: "product",
            num_items: items.reduce((acc, i) => acc + i.quantity, 0),
            value: toSoles(total),
            currency: "PEN",
        });
    }, [isInitialized, items, total]);

    // Una sola vez: la primera vez que escribe o elige algo en el formulario
    const formStartedTracked = useRef(false);
    const trackFormStarted = () => {
        if (formStartedTracked.current) return;
        formStartedTracked.current = true;
        metaCustomEvent("CheckoutFormStarted", { value: toSoles(total), currency: "PEN" });
        clarityEvent("checkout_form_started");
    };

    const isProvince = shippingMethod === "SHALOM";
    const isCashOnDelivery = !isProvince && paymentMethod === "CASH_ON_DELIVERY";
    const zone = useMemo(() => zones.find((z) => z.id === form.shippingZoneId), [zones, form.shippingZoneId]);
    // Tarifa plana: si todos los distritos tienen el mismo precio (se cambia desde /admin → Envíos),
    // el envío y el total se muestran desde el inicio, sin esperar a que elijan distrito.
    const flatRate = zones.length > 0 && zones.every((z) => z.price === zones[0].price) ? zones[0].price : null;
    // Navidad: delivery gratis desde el monto mínimo (el servidor aplica la misma regla al cobrar)
    const freeShipping = shippingFor(1, total) === 0;
    const shipping = freeShipping ? 0 : zone?.price ?? flatRate ?? 0;
    const shippingKnown = freeShipping || Boolean(zone) || flatRate !== null;
    const missingForFree = isXmasActive() && !freeShipping ? FREE_SHIPPING_MIN - total : 0;

    const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        trackFormStarted();
        setForm((f) => ({ ...f, [field]: e.target.value }));
        setErrors((er) => ({ ...er, [field]: undefined }));
    };

    const chooseShipping = (method: Exclude<ShippingMethod, "">) => {
        trackFormStarted();
        setShippingMethod(method);
        if (method === "SHALOM") setPaymentMethod("MERCADO_PAGO"); // pagar al recibir es solo para Lima
        setErrors({});
    };

    // Datos para validar y enviar: Lima lleva distrito y dirección; provincia, los datos de la agencia Shalom
    const payload = (): CheckoutInput => ({
        customerName: form.customerName,
        email: form.email,
        phone: form.phone,
        shippingMethod: (shippingMethod || undefined) as CheckoutInput["shippingMethod"],
        ...(isProvince
            ? {
                region: form.region,
                city: form.city,
                shalomAgency: form.shalomAgency,
                pickupDni: form.pickupDni.replace(/\D/g, ""),
            }
            : {
                shippingZoneId: form.shippingZoneId,
                address: form.address,
                reference: form.reference || undefined,
            }),
        items: items.map((i) => ({ productId: i.productId, variant: i.variant, quantity: i.quantity })),
        paymentMethod: isProvince ? "MERCADO_PAGO" : paymentMethod,
    });

    // Si falta un dato, lleva al cliente al primer campo marcado (en celular suele estar fuera de la pantalla)
    const formRef = useRef<HTMLFormElement>(null);
    const scrollToFirstError = () => {
        requestAnimationFrame(() => {
            const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
            if (!first) return;
            first.scrollIntoView({ behavior: "smooth", block: "center" });
            first.focus({ preventScroll: true });
        });
    };

    const validate = () => {
        const result = checkoutSchema.safeParse(payload());
        const next: typeof errors = {};
        if (!result.success) {
            for (const [key, messages] of Object.entries(result.error.flatten().fieldErrors)) {
                next[key as CheckoutField] = messages?.[0];
            }
        }
        setErrors(next);
        const ok = Object.keys(next).length === 0;
        if (!ok) scrollToFirstError();
        return ok;
    };

    const hasErrors = Object.values(errors).some(Boolean);
    const shippingLabel = isProvince
        ? "Flete Shalom: pagas al recoger"
        : !shippingMethod
            ? "Elige dónde recibes"
            : freeShipping
                ? "¡Gratis! 🎄"
                : shippingKnown
                    ? formatPEN(shipping)
                    : "Elige tu distrito";
    const grandTotal = total + (isProvince || !shippingMethod ? 0 : shipping);

    const buttonLabel = isPending ? "Procesando…" : isCashOnDelivery ? "Registrar pedido" : "Continuar al pago";

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setServerError("");
        if (!validate()) return;

        // Solo cuenta a quienes rellenaron bien el formulario y enviaron el pedido
        clarityEvent("checkout_submit");
        metaEvent("AddPaymentInfo", {
            content_ids: items.map((i) => i.productId),
            content_type: "product",
            value: toSoles(grandTotal),
            currency: "PEN",
            payment_type: isCashOnDelivery ? "contra_entrega" : "mercado_pago",
            shipping_tier: isProvince ? "shalom_provincia" : "delivery_lima",
        });

        startTransition(async () => {
            const result = await createOrder(payload());
            if (!result.ok) {
                setServerError(result.error);
                if (result.fieldErrors) setErrors(result.fieldErrors);
                return;
            }
            // Mercado Pago: a su página de pago. Contra entrega: a la confirmación del pedido.
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
        <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-6 grid gap-8 font-urbanist sm:mt-10 lg:grid-cols-[1fr_400px] lg:gap-10">
            {/* Celular: resumen compacto arriba, para ver qué se compra y cuánto se paga antes de llenar datos */}
            <div className="rounded-2xl border border-white/10 bg-[#132219] p-4 lg:hidden">
                <ul className="space-y-2">
                    {items.map((item) => (
                        <li key={item.id} className="flex items-center gap-3">
                            <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-[#1b2f22]">
                                <Image src={item.image} alt="" fill className="object-contain p-1" />
                            </span>
                            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
                                {item.quantity > 1 && `${item.quantity}× `}
                                {item.title}
                            </span>
                        </li>
                    ))}
                </ul>
                <div className="mt-3 space-y-1 border-t border-white/10 pt-3 text-sm">
                    {discount > 0 && <Row label="Promoción aplicada" value={`-${formatPEN(discount)}`} accent />}
                    <Row label="Envío" value={shippingLabel} />
                    <div className="flex items-center justify-between pt-1">
                        <span className="text-white/80">Total</span>
                        <span className="text-lg font-bold text-white">{formatPEN(grandTotal)}</span>
                    </div>
                </div>
            </div>

            {/* Datos: primero el destino (define el envío y el total), luego los datos de contacto */}
            <div className="space-y-8">
                <fieldset className="space-y-4">
                    <legend className="mb-2 font-heading text-lg font-bold text-white">¿Dónde recibes tu pedido?</legend>

                    {/* Primero el destino: deja claro desde el inicio que se envía a todo el Perú */}
                    <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Dónde recibes tu pedido" aria-invalid={Boolean(errors.shippingMethod)}>
                        <ShippingOption
                            selected={shippingMethod === "LIMA"}
                            onSelect={() => chooseShipping("LIMA")}
                            invalid={Boolean(errors.shippingMethod)}
                            icon="🏙️"
                            title="Lima y Callao"
                            text={isXmasActive() ? `Delivery a domicilio · gratis desde ${formatPEN(FREE_SHIPPING_MIN)} 🎄` : "Delivery a domicilio"}
                        />
                        <ShippingOption
                            selected={isProvince}
                            onSelect={() => chooseShipping("SHALOM")}
                            invalid={Boolean(errors.shippingMethod)}
                            icon="📦"
                            title="Provincia"
                            text="Envíos a todo el Perú por Shalom"
                        />
                    </div>
                    {errors.shippingMethod && <p className="-mt-2 text-xs text-red-300">{errors.shippingMethod}</p>}

                    {/* Lima y Callao: distrito + dirección */}
                    {shippingMethod === "LIMA" && (
                        <>
                            <Field label="Distrito" error={errors.shippingZoneId}>
                                <select className={cnInput(errors.shippingZoneId)} aria-invalid={Boolean(errors.shippingZoneId)} value={form.shippingZoneId} onChange={set("shippingZoneId")}>
                                    <option value="">Elige tu distrito</option>
                                    {zones.map((z) => (
                                        <option key={z.id} value={z.id}>
                                            {flatRate !== null ? z.district : `${z.district} — ${formatPEN(z.price)}`}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            {freeShipping && (
                                <p className="-mt-2 text-sm text-[#BCC90F]">🎄 Delivery gratis a todo Lima y Callao por Navidad</p>
                            )}
                            {!freeShipping && flatRate !== null && (
                                <p className="-mt-2 text-sm text-[#BCC90F]">Delivery a todo Lima y Callao: {formatPEN(flatRate)}</p>
                            )}
                            {missingForFree > 0 && (
                                <p className="-mt-2 text-xs text-white/60">
                                    Te faltan {formatPEN(missingForFree)} para el delivery gratis de Navidad (desde {formatPEN(FREE_SHIPPING_MIN)}).
                                </p>
                            )}
                            <Field label="Dirección" error={errors.address}>
                                <input className={cnInput(errors.address)} aria-invalid={Boolean(errors.address)} value={form.address} onChange={set("address")} autoComplete="street-address" />
                            </Field>
                            <Field label="Referencia (opcional)" error={errors.reference}>
                                <input className={cnInput(errors.reference)} aria-invalid={Boolean(errors.reference)} value={form.reference} onChange={set("reference")} placeholder="Ej. Frente al parque" />
                            </Field>
                        </>
                    )}

                    {/* Provincia: recojo en agencia Shalom (el flete se paga al recoger, nunca decimos "gratis") */}
                    {isProvince && (
                        <>
                            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-white/75">
                                <p className="font-semibold text-white">¿Cómo funciona el envío a provincia?</p>
                                <ol className="mt-2 list-decimal space-y-1 pl-5">
                                    <li>Pagas tu café aquí con Mercado Pago.</li>
                                    <li>Llevamos tu pedido a Shalom en 24 a 48 horas hábiles, <strong className="text-white">sin costo para ti</strong>.</li>
                                    <li>
                                        Lo recoges en la agencia Shalom que elijas y ahí <strong className="text-white">pagas el flete de Shalom</strong> (según tu destino).
                                    </li>
                                </ol>
                                <p className="mt-2 text-xs text-white/50">El tiempo de traslado hasta tu ciudad depende de Shalom.</p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Departamento" error={errors.region}>
                                    <select className={cnInput(errors.region)} aria-invalid={Boolean(errors.region)} value={form.region} onChange={set("region")}>
                                        <option value="">Elige tu departamento</option>
                                        {PERU_REGIONS.map((r) => (
                                            <option key={r} value={r}>
                                                {r}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="Ciudad / provincia" error={errors.city}>
                                    <input className={cnInput(errors.city)} aria-invalid={Boolean(errors.city)} value={form.city} onChange={set("city")} placeholder="Ej. Piura" />
                                </Field>
                            </div>
                            <Field label="Agencia Shalom donde recogerás" error={errors.shalomAgency}>
                                <input
                                    className={cnInput(errors.shalomAgency)}
                                    aria-invalid={Boolean(errors.shalomAgency)}
                                    value={form.shalomAgency}
                                    onChange={set("shalomAgency")}
                                    placeholder="Ej. Shalom Piura – Av. Sánchez Cerro"
                                />
                            </Field>
                            <p className="-mt-2 text-xs text-white/50">Puedes ver las agencias cercanas en la app o web de Shalom.</p>
                            <Field label="DNI de quien recoge" error={errors.pickupDni}>
                                <input
                                    className={cnInput(errors.pickupDni)}
                                    aria-invalid={Boolean(errors.pickupDni)}
                                    value={form.pickupDni}
                                    onChange={set("pickupDni")}
                                    inputMode="numeric"
                                    maxLength={8}
                                    placeholder="8 dígitos"
                                />
                            </Field>
                            <p className="-mt-2 text-xs text-white/50">Shalom pide el DNI para entregar el paquete. El nombre de abajo debe ser el de esa persona.</p>
                        </>
                    )}
                </fieldset>

                <fieldset className="space-y-4">
                    <legend className="mb-2 font-heading text-lg font-bold text-white">Tus datos</legend>
                    <Field label="Nombre completo" error={errors.customerName}>
                        <input className={cnInput(errors.customerName)} aria-invalid={Boolean(errors.customerName)} value={form.customerName} onChange={set("customerName")} autoComplete="name" />
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Teléfono (WhatsApp)" error={errors.phone}>
                            <input type="tel" className={cnInput(errors.phone)} aria-invalid={Boolean(errors.phone)} value={form.phone} onChange={set("phone")} autoComplete="tel" placeholder="999 999 999" />
                        </Field>
                        <Field label="Correo (para tu confirmación)" error={errors.email}>
                            <input type="email" className={cnInput(errors.email)} aria-invalid={Boolean(errors.email)} value={form.email} onChange={set("email")} autoComplete="email" />
                        </Field>
                    </div>
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
                    <Row label="Envío" value={shippingLabel} />
                    <div className="flex items-center justify-between pt-2 text-base">
                        <span className="text-white/80">{isCashOnDelivery ? "Total a pagar al recibir" : "Total"}</span>
                        <span className="text-xl font-bold text-white">{formatPEN(grandTotal)}</span>
                    </div>
                </div>

                {/* Entrega estimada: solo Lima con Mercado Pago (contra entrega se coordina por WhatsApp) */}
                {zone && !isProvince && !isCashOnDelivery && (
                    <p className="flex items-center gap-2 rounded-xl bg-[#BCC90F]/10 px-3 py-2.5 text-sm text-white/80">
                        <svg viewBox="0 0 24 24" fill="none" className="size-4 shrink-0 text-[#BCC90F]" aria-hidden>
                            <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                        </svg>
                        <span>
                            Fecha estimada de entrega: <strong className="text-white">hasta el {formatDeliveryDate(estimatedDeliveryDate(new Date()))}</strong>
                        </span>
                    </p>
                )}

                {/* Provincia: el flete se paga en destino */}
                {isProvince && (
                    <p className="rounded-xl bg-[#BCC90F]/10 px-3 py-2.5 text-sm text-white/80">
                        Despachamos a Shalom en <strong className="text-white">24 a 48 horas hábiles</strong>. El flete de Shalom se paga al recoger y no está incluido en este total.
                    </p>
                )}

                {/* Método de pago: pagar al recibir solo en Lima */}
                {shippingMethod && (
                    <fieldset className="space-y-2">
                        <legend className="mb-4 text-sm font-semibold text-white">¿Cómo quieres pagar?</legend>
                        {PAYMENT_OPTIONS.filter((option) => !isProvince || option.value === "MERCADO_PAGO").map((option) => {
                            const selected = paymentMethod === option.value;
                            return (
                                <label
                                    key={option.value}
                                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                                        selected ? "border-[#BCC90F] bg-[#BCC90F]/10" : "border-white/15 hover:border-white/35"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={selected}
                                        onChange={() => {
                                            trackFormStarted();
                                            setPaymentMethod(option.value);
                                        }}
                                        className="mt-1 accent-[#BCC90F]"
                                    />
                                    <span>
                                        <span className="block text-sm font-semibold text-white">{option.title}</span>
                                        <span className="block text-xs text-white/60">{option.text}</span>
                                    </span>
                                </label>
                            );
                        })}
                    </fieldset>
                )}

                {hasErrors && !serverError && (
                    <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">
                        Completa los datos marcados en rojo para continuar.
                    </p>
                )}

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
                    {buttonLabel}
                </button>

                <a
                    href={WHATSAPP_HELP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => clarityEvent("checkout_whatsapp_help")}
                    className="block text-center text-sm text-white/70 underline underline-offset-4 transition-colors hover:text-[#BCC90F]"
                >
                    ¿Dudas con tu pedido o envío? Escríbenos por WhatsApp
                </a>

                <p className="text-center text-xs leading-relaxed text-white/50">
                    Al continuar aceptas nuestros{" "}
                    <Link href="/terminos-y-condiciones" target="_blank" className="text-white/70 underline underline-offset-2 hover:text-[#BCC90F]">
                        Términos y condiciones
                    </Link>{" "}
                    y la{" "}
                    <Link href="/politica-de-privacidad" target="_blank" className="text-white/70 underline underline-offset-2 hover:text-[#BCC90F]">
                        Política de privacidad
                    </Link>
                    .
                </p>
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

function ShippingOption({
                            selected,
                            onSelect,
                            invalid,
                            icon,
                            title,
                            text,
                        }: {
    selected: boolean;
    onSelect: () => void;
    invalid: boolean;
    icon: string;
    title: string;
    text: string;
}) {
    return (
        <button
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={onSelect}
            className={`flex w-full cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                selected
                    ? "border-[#BCC90F] bg-[#BCC90F]/10"
                    : invalid
                        ? "border-red-400 bg-[#132219]"
                        : "border-white/15 bg-[#132219] hover:border-white/35"
            }`}
        >
            <span>
                <span className="block text-base font-semibold text-white">{title}</span>
                <span className="mt-0.5 block text-xs text-white/65">{text}</span>
            </span>
        </button>
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