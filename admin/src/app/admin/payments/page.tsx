import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  let payments: Awaited<ReturnType<typeof prisma.payment.findMany>> = [];
  try {
    payments = await prisma.payment.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: { order: { select: { orderNumber: true } } },
    });
  } catch {
    // Mode démo sans base de données
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Paiements</h1>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Commande</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Montant</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Statut</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Methode</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Aucun paiement
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{p.order.orderNumber}</td>
                  <td className="px-4 py-3">{Number(p.amount).toFixed(2)} $</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        p.status === "SUCCESS"
                          ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
                          : p.status === "FAILED"
                            ? "rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800"
                            : "rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800"
                      }
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{p.method}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString("fr-FR")}
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
