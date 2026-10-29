import "server-only";
import { prisma } from "@/lib/prisma";

type Limit = { maxFailures: number; windowMs: number; lockMs: number };

const MINUTE = 60 * 1000;

export const LOGIN_LIMITS = {
    // 5 fallos con el mismo correo en 15 min → bloqueo de 15 min
    email: { maxFailures: 5, windowMs: 15 * MINUTE, lockMs: 15 * MINUTE },
    // 20 fallos desde la misma IP en 1 hora → bloqueo de 1 hora
    ip: { maxFailures: 20, windowMs: 60 * MINUTE, lockMs: 60 * MINUTE },
} satisfies Record<string, Limit>;

/** Minutos de bloqueo restantes para cualquiera de las claves (0 si no hay bloqueo). */
export async function lockedMinutes(keys: string[]): Promise<number> {
    const now = new Date();
    const locked = await prisma.loginAttempt.findMany({
        where: { key: { in: keys }, lockedUntil: { gt: now } },
        select: { lockedUntil: true },
    });
    if (locked.length === 0) return 0;

    const until = Math.max(...locked.map((l) => l.lockedUntil!.getTime()));
    return Math.ceil((until - now.getTime()) / MINUTE);
}

/** Registra un intento fallido y bloquea si se supera el límite. */
export async function registerFailure(key: string, limit: Limit) {
    const now = new Date();
    const current = await prisma.loginAttempt.findUnique({ where: { key } });

    // Ventana caducada (o primer fallo): se empieza a contar de nuevo
    const windowExpired = !current || now.getTime() - current.windowStart.getTime() > limit.windowMs;
    const failures = windowExpired ? 1 : current.failures + 1;
    const lockedUntil = failures >= limit.maxFailures ? new Date(now.getTime() + limit.lockMs) : null;

    await prisma.loginAttempt.upsert({
        where: { key },
        create: { key, failures, windowStart: now, lockedUntil },
        update: {
            failures,
            windowStart: windowExpired ? now : undefined,
            lockedUntil,
        },
    });
}

/** Borra los fallos de una clave (tras un login correcto). */
export async function clearFailures(key: string) {
    await prisma.loginAttempt.deleteMany({ where: { key } });
}