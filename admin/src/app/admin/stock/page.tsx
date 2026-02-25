import { prisma } from "@/lib/prisma";
import { fetchBackendInventory } from "@/lib/backend-api";

export const dynamic = "force-dynamic";

interface InventoryRow {
  id: string;
  productId: string;
  quantity: number;
  stockReserved?: number;
  alertThreshold: number;
  product?: { name: string; slug: string };
}

export default async function AdminStockPage() {
  const useBackend = !!process.env.BACKEND_URL;
  let levels: InventoryRow[] = [];

  if (useBackend) {
    levels = (await fetchBackendInventory()) as InventoryRow[];
  } else {
    try {
      const rows = await prisma.inventoryLevel.findMany({
        include: { product: true },
        orderBy: { quantity: "asc" },
      });
      levels = rows.map((l) => ({
        id: l.id,
        productId: l.productId,
        quantity: l.quantity,
        stockReserved: l.stockReserved,
        alertThreshold: l.alertThreshold,
        product: l.product,
      }));
    } catch {
      // Mode démo sans base de données
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Stock et inventaire</h1>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Produit</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Quantité</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Réservé</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Seuil alerte</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Statut</th>
            </tr>
          </thead>
          <tbody>
            {levels.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Aucun niveau de stock
                </td>
              </tr>
            ) : (
              levels.map((l) => {
                const isCritical = l.quantity <= l.alertThreshold;
                const productName = l.product?.name ?? "—";
                return (
                  <tr key={l.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{productName}</td>
                    <td className="px-4 py-3">{l.quantity}</td>
                    <td className="px-4 py-3">{l.stockReserved ?? 0}</td>
                    <td className="px-4 py-3">{l.alertThreshold}</td>
                    <td className="px-4 py-3">
                      {isCritical ? (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                          Critique
                        </span>
                      ) : (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                          OK
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
