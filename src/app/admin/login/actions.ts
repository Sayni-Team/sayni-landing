"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { hash, verify } from "@node-rs/argon2";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/auth";
import { LOGIN_LIMITS, clearFailures, lockedMinutes, registerFailure } from "@/lib/rate-limit";

export type LoginState = { error?: string };

const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email().max(120),
    password: z.string().min(1).max(200),
});

const GENERIC_ERROR = "Correo o contraseña incorrectos.";

// Hash de relleno: si el correo no existe, se verifica igual contra este,
// para que la respuesta tarde lo mismo y no se pueda saber qué correos existen.
let dummyHash: Promise<string> | null = null;
const getDummyHash = () => (dummyHash ??= hash("sayni-dummy-password-never-valid"));

async function clientIp() {
    const h = await headers();
    return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
    const parsed = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });
    if (!parsed.success) return { error: GENERIC_ERROR };

    const { email, password } = parsed.data;
    const emailKey = `email:${email}`;
    const ipKey = `ip:${await clientIp()}`;

    // 1. ¿Bloqueado por demasiados intentos?
    const minutes = await lockedMinutes([emailKey, ipKey]);
    if (minutes > 0) {
        return { error: `Demasiados intentos fallidos. Inténtalo de nuevo en ${minutes} min.` };
    }

    // 2. Verificar la contraseña (siempre se ejecuta, exista o no el correo)
    const user = await prisma.adminUser.findUnique({ where: { email } });
    const valid = await verify(user?.passwordHash ?? (await getDummyHash()), password).catch(() => false);

    if (!user || !valid) {
        await registerFailure(emailKey, LOGIN_LIMITS.email);
        await registerFailure(ipKey, LOGIN_LIMITS.ip);
        return { error: GENERIC_ERROR };
    }

    // 3. Correcto: limpiar fallos de la cuenta y crear la sesión
    await clearFailures(emailKey);
    await createSession(user.id);
    redirect("/admin");
}

export async function logout() {
    await destroySession();
    redirect("/admin/login");
}