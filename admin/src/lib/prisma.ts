import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

/**
 * Résout l'URL SQLite en chemin absolu pour éviter "Unable to open the database file"
 * quand le working directory varie (Next.js, CLI, etc.).
 */
function resolveDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url || !url.startsWith("file:")) {
    return url ?? "";
  }
  const relativePath = url.replace(/^file:\.\/?/, "");
  // Chemin absolu depuis la racine du projet admin (process.cwd() = admin/ en dev)
  const absolutePath = path.resolve(process.cwd(), "prisma", relativePath);
  const resolved = "file:" + absolutePath;
  if (process.env.NODE_ENV === "development") {
    const exists = fs.existsSync(absolutePath);
    if (!exists) {
      console.warn(
        "[Prisma] Fichier DB introuvable:",
        absolutePath,
        "- Lancez dans admin/: npm run db:push && npm run db:seed"
      );
    }
  }
  return resolved;
}

const datasourceUrl = resolveDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: datasourceUrl ? { db: { url: datasourceUrl } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/** Vérifie si la base est accessible (pour afficher un message sur la page de login). */
export async function isDatabaseAvailable(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
