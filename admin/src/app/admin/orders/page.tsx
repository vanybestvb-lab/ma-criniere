import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  let orders: Awaited<ReturnType<typeof prisma.order.findMany>> = [];
  try {
    orders = await prisma.order.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { items: true } } },
    });
  } catch {
    // Mode démo sans base de données
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Commandes</h1>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700">N°</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Client</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Total</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Statut</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
              <th className="px-4 py-3 text-right font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Aucune commande
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/admin/orders/${o.id}`} className="text-primary hover:underline">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {o.firstName} {o.lastName}
                  </td>
                  <td className="px-4 py-3">{Number(o.total).toFixed(2)} €</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium">
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(o.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="text-primary hover:underline"
                    >
                      Détail
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
