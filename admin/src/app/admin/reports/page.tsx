import { getDashboardKpis, getTopProducts, getRevenueByDay } from "@/services/dashboard.service";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const [kpis, topProducts, revenueByDay] = await Promise.all([
    getDashboardKpis(),
    getTopProducts(20),
    getRevenueByDay(30),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Rapports</h1>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Resume ventes (30j)</h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <li className="rounded-lg bg-gray-50 p-3">
            <span className="text-sm text-gray-500">CA 30 jours</span>
            <p className="text-xl font-semibold">{kpis.revenue30d.toFixed(2)} €</p>
          </li>
          <li className="rounded-lg bg-gray-50 p-3">
            <span className="text-sm text-gray-500">Panier moyen</span>
            <p className="text-xl font-semibold">{kpis.averageOrderValue.toFixed(2)} €</p>
          </li>
          <li className="rounded-lg bg-gray-50 p-3">
            <span className="text-sm text-gray-500">Total commandes</span>
            <p className="text-xl font-semibold">{kpis.totalOrders}</p>
          </li>
          <li className="rounded-lg bg-gray-50 p-3">
            <span className="text-sm text-gray-500">En attente</span>
            <p className="text-xl font-semibold">{kpis.pendingOrders}</p>
          </li>
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Top produits (revenus)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-2 pr-4">Produit</th>
                <th className="pb-2 pr-4">Quantite vendue</th>
                <th className="pb-2">Revenu</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-gray-500">
                    Aucune vente
                  </td>
                </tr>
              ) : (
                topProducts.map((p) => (
                  <tr key={p.name} className="border-b">
                    <td className="py-2 pr-4 font-medium">{p.name}</td>
                    <td className="py-2 pr-4">{p.quantity}</td>
                    <td className="py-2">{p.revenue.toFixed(2)} €</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Export CSV a venir (lien ou bouton a brancher sur une Server Action).
        </p>
      </section>
    </div>
  );
}
