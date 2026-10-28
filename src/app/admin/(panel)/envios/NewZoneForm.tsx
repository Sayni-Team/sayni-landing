"use client";

import { useActionState, useEffect, useRef } from "react";
import { createZone, type SaveState } from "./actions";

const INPUT =
    "rounded-lg border border-white/10 bg-[#0d1711] px-3 py-2 text-sm text-white focus:border-[#BCC90F] focus:outline-none";

export default function NewZoneForm() {
    const [state, action, isPending] = useActionState<SaveState, FormData>(createZone, {});
    const formRef = useRef<HTMLFormElement>(null);

    // Limpia el formulario después de crear el distrito
    useEffect(() => {
        if (state.ok) formRef.current?.reset();
    }, [state]);

    return (
        <form ref={formRef} action={action} className="flex flex-wrap items-end gap-3 rounded-2xl border border-white/10 bg-[#132219] p-5">
            <label className="block flex-1">
                <span className="mb-1.5 block text-xs text-white/60">Nuevo distrito</span>
                <input name="district" placeholder="Ej. Lurín" className={`${INPUT} w-full`} />
            </label>
            <label className="block">
                <span className="mb-1.5 block text-xs text-white/60">Tarifa (S/)</span>
                <input name="price" type="number" step="0.50" min="0" className={`${INPUT} w-28`} />
            </label>
            <button
                type="submit"
                disabled={isPending}
                className="cursor-pointer rounded-full bg-[#BCC90F] px-5 py-2 text-sm font-bold text-[#132219] disabled:opacity-60"
            >
                {isPending ? "Añadiendo…" : "Añadir"}
            </button>
            {state.error && <p role="alert" className="w-full text-sm text-red-300">{state.error}</p>}
        </form>
    );
}