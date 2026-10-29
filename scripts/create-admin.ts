// Crea o actualiza un administrador.
// Uso: npx tsx scripts/create-admin.ts
import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { hash } from "@node-rs/argon2";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const rl = createInterface({ input: process.stdin, output: process.stdout });

    const email = (await rl.question("Correo del administrador: ")).trim().toLowerCase();
    const password = await rl.question("Contraseña (mínimo 12 caracteres): ");
    rl.close();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Correo no válido");
    if (password.length < 12) throw new Error("La contraseña debe tener al menos 12 caracteres");

    const passwordHash = await hash(password);

    await prisma.adminUser.upsert({
        where: { email },
        update: { passwordHash },
        create: { email, passwordHash },
    });

    // Al cambiar la contraseña, se cierran todas sus sesiones abiertas
    await prisma.adminSession.deleteMany({ where: { user: { email } } });

    console.log(`✔ Administrador listo: ${email}`);
}

main()
    .catch((e) => {
        console.error("✖", e.message);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());