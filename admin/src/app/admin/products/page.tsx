import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { fetchBackendProducts } from "@/lib/backend-api";

export const dynamic = "force-dynamic";

interface BackendProduct {
  id: string;
  name: string;
  slug: string;
  price?: number | null;
  active: boolean;
  category?: { name: string } | null;
  _count?: { variants?: number };
  inventory?: Array<{ quantity: number; alertThreshold: number }>;
}

export default async function AdminProductsPage() {
  const useBackend = !!process.env.BACKEND_URL;
  let products: BackendProduct[] = [];

  if (useBackend) {
    products = (await fetchBackendProducts()) as BackendProduct[];
  } else {
    try {
      const rows = await prisma.product.findMany({
        take: 50,
        orderBy: { createdAt: "desc" },
        include: { category: true, _count: { select: { variants: true } } },
      });
      products = rows.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        active: p.active,
        category: p.category,
        _count: { variants: p._count.variants },
      }));
    } catch {
      // Mode démo sans base de données
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produits</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Nouveau produit
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Nom</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Slug</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Catégorie</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Prix</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Variantes / Stock</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Actif</th>
              <th className="px-4 py-3 text-right font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Aucun produit
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.slug}</td>
                  <td className="px-4 py-3">{p.category?.name ?? "—"}</td>
                  <td className="px-4 py-3">{p.price != null ? `${p.price} $` : "—"}</td>
                  <td className="px-4 py-3">
                    {p._count?.variants != null
                      ? p._count.variants
                      : p.inventory?.[0]
                        ? `Stock: ${p.inventory[0].quantity}`
                        : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {p.active ? (
                      <span className="text-green-600">Oui</span>
                    ) : (
                      <span className="text-gray-400">Non</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/products/${p.id}`} className="text-primary hover:underline">
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
