import { PrismaClient } from "@prisma/client";

// En desarrollo, Next.js recarga los módulos en cada cambio. Sin esto,
// se crearía una conexión nueva cada vez y se agotarían las conexiones.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}