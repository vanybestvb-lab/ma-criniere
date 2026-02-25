/**
 * Client API pour le backend (NestJS).
 * Utilisé par le storefront et l'admin pour produits, stock, livraisons.
 */

const BASE = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  tag: string | null;
  price: number | null;
  currency: string | null;
  descriptionShort: string | null;
  active: boolean;
  images: Array<{ id: string; url: string; alt: string | null }>;
  inventory?: Array<{ quantity: number; alertThreshold: number; stockReserved: number }>;
}

export async function fetchProducts(): Promise<ApiProduct[]> {
  if (!BASE) return [];
  try {
    const res = await fetch(`${BASE}/admin/products`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function fetchProductBySlug(slug: string): Promise<ApiProduct | null> {
  if (!BASE) return null;
  try {
    const res = await fetch(`${BASE}/admin/products/by-slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
