import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "sayni_admin_session";
const SESSION_HOURS = 8;

// En la base de datos solo se guarda el hash del token
const hashToken = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

/** Crea la sesión y la guarda en una cookie segura. Solo desde Server Actions o Route Handlers. */
export async function createSession(userId: string) {
    const token = crypto.randomBytes(32).toString("base64url"); // 256 bits aleatorios
    const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);

    await prisma.adminSession.create({
        data: { id: hashToken(token), userId, expiresAt },
    });

    (await cookies()).set(SESSION_COOKIE, token, {
        httpOnly: true, // JavaScript del navegador no puede leerla
        secure: process.env.NODE_ENV === "production", // solo por HTTPS
        sameSite: "lax",
        path: "/",
        expires: expiresAt,
    });
}

/** Administrador de la sesión actual, o null si no hay sesión válida. */
export async function getAdmin() {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const session = await prisma.adminSession.findUnique({
        where: { id: hashToken(token) },
        include: { user: { select: { id: true, email: true, name: true } } },
    });
    if (!session) return null;

    if (session.expiresAt < new Date()) {
        await prisma.adminSession.delete({ where: { id: session.id } }).catch(() => {});
        return null;
    }

    return session.user;
}

/** Para páginas del panel: sin sesión, al login. */
export async function requireAdminPage() {
    const admin = await getAdmin();
    if (!admin) redirect("/admin/login");
    return admin;
}

/** Para Server Actions del panel: sin sesión, corta con un error. */
export async function assertAdmin() {
    const admin = await getAdmin();
    if (!admin) throw new Error("Unauthorized");
    return admin;
}

/** Cierra la sesión actual. */
export async function destroySession() {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;
    if (token) {
        await prisma.adminSession.deleteMany({ where: { id: hashToken(token) } });
    }
    store.delete(SESSION_COOKIE);
}