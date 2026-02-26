import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

/**
 * Singleton Prisma pour Next.js / Vercel serverless.
 * Évite "too many connections" et multiple instances du client entre rechargements (dev)
 * et entre invocations (prod). Ne pas instancier PrismaClient ailleurs : importer prisma depuis ici.
 */
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

/**
 * Résout l'URL de base de données.
 * - PostgreSQL (Neon, etc.) : on ajoute connect_timeout pour les cold starts (Vercel, serverless).
 * - SQLite (dev) : chemin absolu depuis admin/prisma/.
 */
function resolveDatabaseUrl(): string {
  const url = (process.env.DATABASE_URL ?? "").trim();
  if (!url) return "";

  // PostgreSQL : ajouter un timeout de connexion pour éviter les échecs au cold start (Neon + Vercel)
  if (url.startsWith("postgresql://") || url.startsWith("postgres://")) {
    const separator = url.includes("?") ? "&" : "?";
    const hasTimeout = /[?&]connect_timeout=/.test(url);
    return hasTimeout ? url : `${url}${separator}connect_timeout=30`;
  }

  // SQLite (dev local) : file:./dev.db (relatif au dossier prisma/) → cwd/prisma/dev.db (lancer npm run dev depuis admin/)
  if (url.startsWith("file:")) {
    const relativePath = url.replace(/^file:\.\/?/, "");
    const absolutePath =
      relativePath === "dev.db" || relativePath === "prisma/dev.db"
        ? path.resolve(process.cwd(), "prisma", "dev.db")
        : path.resolve(process.cwd(), relativePath);
    if (process.env.NODE_ENV === "development" && !fs.existsSync(absolutePath)) {
      console.warn("[Prisma] Fichier DB introuvable:", absolutePath);
    }
    return "file:" + absolutePath;
  }

  return url;
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

/** Vérifie si la base est accessible (SQLite et PostgreSQL). Utilisé sur la page de login. */
export async function isDatabaseAvailable(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
