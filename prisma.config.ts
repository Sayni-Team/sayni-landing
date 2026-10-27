// Configuración de la CLI de Prisma.
// La conexión a la base de datos se define en prisma/schema.prisma (url y directUrl).
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});