"use client";

import { useActionState, useEffect, useState } from "react";
import { updateZone, type SaveState } from "./actions";

type Zone = { id: string; district: string; price: number; active: boolean };

export default function ZoneRow({ zone }: { zone: Zone }) {
    const [state, action, isPending] = useActionState<SaveState, FormData>(updateZone, {});
    const [showSaved, setShowSaved] = useState(false);

    useEffect(() => {
        if (!state.ok) return;
        setShowSaved(true);
        const t = setTimeout(() => setShowSaved(false), 2000);
        return () => clearTimeout(t);
    }, [state]);

    return (
        <form action={action} className={`flex flex-wrap items-center gap-3 px-4 py-3 ${zone.active ? "" : "opacity-50"}`}>
            <input type="hidden" name="id" value={zone.id} />

            <span className="min-w-[180px] flex-1 text-sm">{zone.district}</span>

            <label className="flex items-center gap-2 text-sm text-white/60">
                S/
                <input
                    name="price"
                    type="number"
                    step="0.50"
                    min="0"
                    defaultValue={(zone.price / 100).toFixed(2)}
                    className="w-24 rounded-lg border border-white/10 bg-[#0d1711] px-3 py-1.5 text-white focus:border-[#BCC90F] focus:outline-none"
                />
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-white/60">
                <input name="active" type="checkbox" defaultChecked={zone.active} className="size-4 accent-[#BCC90F]" />
                Activo
            </label>

            <button
                type="submit"
                disabled={isPending}
                className="cursor-pointer rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-white/80 hover:border-[#BCC90F] hover:text-white disabled:opacity-50"
            >
                {isPending ? "…" : "Guardar"}
            </button>

            {showSaved && <span className="text-xs text-emerald-300">✔</span>}
            {state.error && <span role="alert" className="text-xs text-red-300">{state.error}</span>}
        </form>
    );
}