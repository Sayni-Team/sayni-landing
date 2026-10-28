"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { updateProduct, type SaveState } from "./actions";

type Product = {
    id: string;
    name: string;
    image: string;
    price: number; // céntimos
    stock: number;
    status: "ACTIVE" | "COMING_SOON" | "HIDDEN";
    tiers: { quantity: number; price: number }[];
};

const INPUT =
    "w-full rounded-lg border border-white/10 bg-[#0d1711] px-3 py-2 text-sm text-white focus:border-[#BCC90F] focus:outline-none";

const STATUS_OPTIONS = [
    { value: "ACTIVE", label: "A la venta" },
    { value: "COMING_SOON", label: "Próximamente" },
    { value: "HIDDEN", label: "Oculto" },
];

const toSoles = (cents: number) => (cents / 100).toFixed(2);

export default function ProductRow({ product }: { product: Product }) {
    const [state, action, isPending] = useActionState<SaveState, FormData>(updateProduct, {});
    const [showSaved, setShowSaved] = useState(false);

    // El "Guardado" desaparece a los 2 segundos
    useEffect(() => {
        if (!state.ok) return;
        setShowSaved(true);
        const t = setTimeout(() => setShowSaved(false), 2000);
        return () => clearTimeout(t);
    }, [state]);

    return (
        <form action={action} className="rounded-2xl border border-white/10 bg-[#132219] p-5">
            <input type="hidden" name="id" value={product.id} />

            <div className="flex items-center gap-4">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#0d1711]">
                    <Image src={product.image} alt="" fill className="object-contain p-1" />
                </span>
                <h2 className="font-semibold">{product.name}</h2>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_120px_170px]">
                {/* Precio: único, o por cantidad si tiene promoción */}
                {product.tiers.length > 0 ? (
                    <fieldset>
                        <legend className="mb-1.5 text-xs text-white/60">Precio por cantidad (promoción en ciclos)</legend>
                        <div className="grid grid-cols-3 gap-2">
                            {product.tiers.map((t) => (
                                <label key={t.quantity} className="block">
                                    <span className="mb-1 block text-[11px] text-white/45">{t.quantity} unid. (S/)</span>
                                    <input name={`tier_${t.quantity}`} type="number" step="0.01" min="0.01" defaultValue={toSoles(t.price)} className={INPUT} />
                                </label>
                            ))}
                        </div>
                    </fieldset>
                ) : (
                    <label className="block">
                        <span className="mb-1.5 block text-xs text-white/60">Precio (S/)</span>
                        <input name="price" type="number" step="0.01" min="0.01" defaultValue={toSoles(product.price)} className={INPUT} />
                    </label>
                )}

                <label className="block">
                    <span className="mb-1.5 block text-xs text-white/60">Stock</span>
                    <input name="stock" type="number" step="1" min="0" defaultValue={product.stock} className={INPUT} />
                </label>

                <label className="block">
                    <span className="mb-1.5 block text-xs text-white/60">Estado</span>
                    <select name="status" defaultValue={product.status} className={INPUT}>
                        {STATUS_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="mt-5 flex items-center gap-3">
                <button
                    type="submit"
                    disabled={isPending}
                    className="cursor-pointer rounded-full bg-[#BCC90F] px-5 py-2 text-sm font-bold text-[#132219] disabled:cursor-wait disabled:opacity-60"
                >
                    {isPending ? "Guardando…" : "Guardar"}
                </button>
                {showSaved && <span className="text-sm text-emerald-300">✔ Guardado</span>}
                {state.error && <span role="alert" className="text-sm text-red-300">{state.error}</span>}
            </div>
        </form>
    );
}