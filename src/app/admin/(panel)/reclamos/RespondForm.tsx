"use client";

import { useActionState } from "react";
import { respondComplaint, type RespondState } from "./actions";

export default function RespondForm({ complaintId }: { complaintId: string }) {
    const [state, action, isPending] = useActionState<RespondState, FormData>(
        respondComplaint.bind(null, complaintId),
        {}
    );

    return (
        <form action={action} className="space-y-3">
            <textarea
                name="response"
                rows={6}
                required
                placeholder="Escribe la respuesta al consumidor…"
                className="w-full rounded-xl border border-white/10 bg-[#0d1711] px-4 py-3 text-sm text-white focus:border-[#BCC90F] focus:outline-none"
            />
            <p className="text-xs text-white/45">Al enviar, la respuesta se guarda y se envía por correo al consumidor. No se puede editar después.</p>
            {state.error && <p role="alert" className="text-sm text-red-300">{state.error}</p>}
            <button
                type="submit"
                disabled={isPending}
                className="cursor-pointer rounded-full bg-[#BCC90F] px-5 py-2.5 text-sm font-bold text-[#132219] disabled:cursor-wait disabled:opacity-60"
            >
                {isPending ? "Enviando…" : "Enviar respuesta"}
            </button>
        </form>
    );
}