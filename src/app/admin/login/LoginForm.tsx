"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const INPUT =
    "w-full rounded-xl border border-white/10 bg-[#0d1711] px-4 py-3 text-sm text-white placeholder-white/35 focus:border-[#BCC90F] focus:outline-none";

export default function LoginForm() {
    const [state, action, isPending] = useActionState<LoginState, FormData>(login, {});

    return (
        <form action={action} className="mt-8 space-y-4">
            <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-white/80">Correo</span>
                <input name="email" type="email" required autoComplete="username" className={INPUT} />
            </label>

            <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-white/80">Contraseña</span>
                <input name="password" type="password" required autoComplete="current-password" className={INPUT} />
            </label>

            {state.error && (
                <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">
                    {state.error}
                </p>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full cursor-pointer rounded-full bg-[#BCC90F] px-6 py-3 text-sm font-bold text-[#132219] transition-opacity disabled:cursor-wait disabled:opacity-60"
            >
                {isPending ? "Verificando…" : "Entrar"}
            </button>
        </form>
    );
}