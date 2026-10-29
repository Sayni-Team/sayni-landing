"use client";

import { useState, useTransition } from "react";
import { complaintCode } from "@/lib/business";
import { complaintSchema, type ComplaintField, type ComplaintInput } from "@/lib/complaint-schema";
import { createComplaint } from "./actions";

const INPUT =
    "w-full rounded-xl border bg-[#132219] px-4 py-3 text-sm text-white placeholder-white/35 transition-colors focus:border-[#BCC90F] focus:outline-none";

const EMPTY = {
    consumerName: "",
    docType: "DNI" as const,
    docNumber: "",
    address: "",
    phone: "",
    email: "",
    isMinor: false,
    guardianName: "",
    goodType: "PRODUCTO" as const,
    goodDescription: "",
    amount: "",
    orderNumber: "",
    kind: "RECLAMO" as const,
    detail: "",
    request: "",
    accepted: false,
    website: "",
};

type FormState = Omit<typeof EMPTY, "docType" | "goodType" | "kind"> & {
    docType: "DNI" | "CE" | "PASAPORTE";
    goodType: "PRODUCTO" | "SERVICIO";
    kind: "RECLAMO" | "QUEJA";
};

export default function ComplaintForm() {
    const [form, setForm] = useState<FormState>(EMPTY);
    const [errors, setErrors] = useState<Partial<Record<ComplaintField, string>>>({});
    const [serverError, setServerError] = useState("");
    const [result, setResult] = useState<{ number: number; createdAt: string } | null>(null);
    const [isPending, startTransition] = useTransition();

    const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((f) => ({ ...f, [key]: value }));
        setErrors((e) => ({ ...e, [key]: undefined }));
    };

    const payload = (): ComplaintInput => ({
        ...form,
        guardianName: form.guardianName || undefined,
        accepted: form.accepted as true,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setServerError("");

        const check = complaintSchema.safeParse(payload());
        if (!check.success) {
            const next: Partial<Record<ComplaintField, string>> = {};
            for (const issue of check.error.issues) next[issue.path[0] as ComplaintField] ??= issue.message;
            setErrors(next);
            return;
        }

        startTransition(async () => {
            const res = await createComplaint(payload());
            if (!res.ok) {
                setServerError(res.error);
                if (res.fieldErrors) setErrors(res.fieldErrors);
                return;
            }
            setResult({ number: res.number, createdAt: res.createdAt });
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    };

    /* ── Constancia en pantalla ── */
    if (result) {
        const date = new Intl.DateTimeFormat("es-PE", { dateStyle: "long", timeStyle: "short", timeZone: "America/Lima" }).format(
            new Date(result.createdAt)
        );
        return (
            <div className="mt-8 rounded-3xl border border-[#BCC90F]/30 bg-[#182a1f] p-8 text-center">
                <p className="text-sm uppercase tracking-wider text-[#BCC90F]">Hoja de reclamación registrada</p>
                <p className="mt-2 font-heading text-3xl font-bold text-white">N° {complaintCode(result.number)}</p>
                <p className="mt-2 text-sm text-white/60">{date}</p>
                <p className="mt-6 text-sm leading-relaxed text-white/80">
                    Te enviamos una copia de tu hoja de reclamación a <strong>{form.email}</strong>. Te responderemos por correo en un plazo máximo de 15 días hábiles.
                </p>
            </div>
        );
    }

    /* ── Formulario ── */
    return (
        <form onSubmit={onSubmit} noValidate className="mt-8 space-y-10">
            {/* 1. Consumidor */}
            <fieldset className="space-y-4">
                <legend className="mb-2 font-heading text-lg font-bold text-white">1. Identificación del consumidor</legend>

                <Field label="Nombre completo" error={errors.consumerName}>
                    <input className={cnInput(errors.consumerName)} value={form.consumerName} onChange={(e) => set("consumerName", e.target.value)} autoComplete="name" />
                </Field>

                <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
                    <Field label="Documento">
                        <select className={cnInput()} value={form.docType} onChange={(e) => set("docType", e.target.value as FormState["docType"])}>
                            <option value="DNI">DNI</option>
                            <option value="CE">Carné de extranjería</option>
                            <option value="PASAPORTE">Pasaporte</option>
                        </select>
                    </Field>
                    <Field label="Número de documento" error={errors.docNumber}>
                        <input className={cnInput(errors.docNumber)} value={form.docNumber} onChange={(e) => set("docNumber", e.target.value)} />
                    </Field>
                </div>

                <Field label="Domicilio" error={errors.address}>
                    <input className={cnInput(errors.address)} value={form.address} onChange={(e) => set("address", e.target.value)} autoComplete="street-address" />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Teléfono" error={errors.phone}>
                        <input type="tel" className={cnInput(errors.phone)} value={form.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" />
                    </Field>
                    <Field label="Correo" error={errors.email}>
                        <input type="email" className={cnInput(errors.email)} value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
                    </Field>
                </div>

                <label className="flex cursor-pointer items-center gap-3 text-sm text-white/80">
                    <input type="checkbox" checked={form.isMinor} onChange={(e) => set("isMinor", e.target.checked)} className="size-4 accent-[#BCC90F]" />
                    Soy menor de edad
                </label>

                {form.isMinor && (
                    <Field label="Nombre del padre, madre o apoderado" error={errors.guardianName}>
                        <input className={cnInput(errors.guardianName)} value={form.guardianName} onChange={(e) => set("guardianName", e.target.value)} />
                    </Field>
                )}
            </fieldset>

            {/* 2. Bien contratado */}
            <fieldset className="space-y-4">
                <legend className="mb-2 font-heading text-lg font-bold text-white">2. Identificación del bien contratado</legend>

                <div className="flex gap-6 text-sm text-white/80">
                    {(["PRODUCTO", "SERVICIO"] as const).map((type) => (
                        <label key={type} className="flex cursor-pointer items-center gap-2">
                            <input type="radio" name="goodType" checked={form.goodType === type} onChange={() => set("goodType", type)} className="accent-[#BCC90F]" />
                            {type === "PRODUCTO" ? "Producto" : "Servicio"}
                        </label>
                    ))}
                </div>

                <Field label="Descripción" error={errors.goodDescription}>
                    <input className={cnInput(errors.goodDescription)} value={form.goodDescription} onChange={(e) => set("goodDescription", e.target.value)} placeholder="Ej. Sayni Geisha 250g molido" />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Monto reclamado (S/) — opcional" error={errors.amount}>
                        <input type="number" step="0.01" min="0" className={cnInput(errors.amount)} value={form.amount} onChange={(e) => set("amount", e.target.value)} />
                    </Field>
                    <Field label="N° de pedido — opcional" error={errors.orderNumber}>
                        <input type="number" min="1" className={cnInput(errors.orderNumber)} value={form.orderNumber} onChange={(e) => set("orderNumber", e.target.value)} />
                    </Field>
                </div>
            </fieldset>

            {/* 3. Detalle */}
            <fieldset className="space-y-4">
                <legend className="mb-2 font-heading text-lg font-bold text-white">3. Detalle de la reclamación</legend>

                <div className="grid gap-3 sm:grid-cols-2">
                    {(
                        [
                            { value: "RECLAMO", title: "Reclamo", text: "Disconformidad con el producto o servicio." },
                            { value: "QUEJA", title: "Queja", text: "Malestar con la atención, no relacionado con el producto o servicio." },
                        ] as const
                    ).map((opt) => (
                        <label
                            key={opt.value}
                            className={`cursor-pointer rounded-xl border p-4 text-sm transition-colors ${
                                form.kind === opt.value ? "border-[#BCC90F] bg-[#BCC90F]/10" : "border-white/15 hover:border-white/35"
                            }`}
                        >
                            <input type="radio" name="kind" checked={form.kind === opt.value} onChange={() => set("kind", opt.value)} className="sr-only" />
                            <span className="block font-semibold text-white">{opt.title}</span>
                            <span className="mt-1 block text-white/60">{opt.text}</span>
                        </label>
                    ))}
                </div>

                <Field label="Detalle" error={errors.detail}>
                    <textarea rows={5} className={cnInput(errors.detail)} value={form.detail} onChange={(e) => set("detail", e.target.value)} />
                </Field>
                <Field label="Pedido del consumidor (qué solicitas)" error={errors.request}>
                    <textarea rows={3} className={cnInput(errors.request)} value={form.request} onChange={(e) => set("request", e.target.value)} />
                </Field>
            </fieldset>

            {/* Honeypot: invisible; Chrome no lo autocompleta */}
            <div aria-hidden className="absolute -left-[9999px] size-px overflow-hidden opacity-0">
                <label htmlFor="hp-complaint">Leave this field empty</label>
                <input id="hp-complaint" tabIndex={-1} autoComplete="new-password" data-lpignore="true" data-1p-ignore value={form.website} onChange={(e) => set("website", e.target.value)} />
            </div>

            <div>
                <label className="flex cursor-pointer gap-3 text-sm text-white/80">
                    <input type="checkbox" checked={form.accepted} onChange={(e) => set("accepted", e.target.checked)} className="mt-0.5 size-4 shrink-0 accent-[#BCC90F]" />
                    Declaro que la información proporcionada es correcta y autorizo el uso de mis datos para atender este reclamo o queja.
                </label>
                {errors.accepted && <p className="mt-1 pl-7 text-xs text-red-300">{errors.accepted}</p>}
            </div>

            {serverError && (
                <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">{serverError}</p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="inline-flex w-full cursor-pointer items-center justify-center rounded-full border-t border-white/40 bg-[#BCC90F] px-6 py-3.5 text-base font-bold text-[#132219] shadow-[inset_0_3px_5px_rgba(255,255,255,0.45),_inset_0_-4px_8px_rgba(0,0,0,0.25),_0_10px_20px_rgba(0,0,0,0.4)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:px-10"
            >
                {isPending ? "Enviando…" : "Enviar hoja de reclamación"}
            </button>
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