/**
 * Client pour le backend NestJS (produits, inventaire, livraisons).
 * Utilisé quand BACKEND_URL est défini.
 */

const BASE = process.env.BACKEND_URL ?? "";

export async function fetchBackendProducts(): Promise<unknown[]> {
  if (!BASE) return [];
  try {
    const res = await fetch(`${BASE}/admin/products`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchBackendInventory(): Promise<unknown[]> {
  if (!BASE) return [];
  try {
    const res = await fetch(`${BASE}/admin/inventory`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchBackendDeliveries(): Promise<unknown[]> {
  if (!BASE) return [];
  try {
    const res = await fetch(`${BASE}/admin/deliveries`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
