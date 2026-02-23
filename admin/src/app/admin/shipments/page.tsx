import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminShipmentsPage() {
  let shipments: Awaited<ReturnType<typeof prisma.shipment.findMany>> = [];
  try {
    shipments = await prisma.shipment.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: { order: { select: { orderNumber: true } } },
    });
  } catch {
    // Mode démo sans base de données
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Livraisons</h1>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Commande</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Suivi</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Statut</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Transporteur</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Expedie le</th>
            </tr>
          </thead>
          <tbody>
            {shipments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">Aucune livraison</td>
              </tr>
            ) : (
              shipments.map((s) => (
                <tr key={s.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{s.order.orderNumber}</td>
                  <td className="px-4 py-3">{s.trackingNumber ?? "-"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium">{s.status}</span>
                  </td>
                  <td className="px-4 py-3">{s.carrier ?? "-"}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {s.shippedAt ? new Date(s.shippedAt).toLocaleDateString("fr-FR") : "-"}
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
