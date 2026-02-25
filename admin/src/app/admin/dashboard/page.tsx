import Link from "next/link";
import nextDynamic from "next/dynamic";
import { cookies } from "next/headers";
import {
  getDashboardKpis,
  getTopProducts,
  getOrdersByStatus,
  getRecentOrders,
  getRevenueByDay,
  type DashboardPeriod,
} from "@/services/dashboard.service";
import { DashboardPeriodFilter } from "@/components/DashboardPeriodFilter";

const DashboardChart = nextDynamic(
  () => import("@/components/Charts/DashboardChart").then((m) => m.DashboardChart),
  { ssr: false }
);

export const dynamic = "force-dynamic";

function parsePeriod(p: { from?: string; to?: string }): DashboardPeriod | undefined {
  const from = p.from;
  const to = p.to;
  if (!from || !to) return undefined;
  const dateFrom = new Date(from);
  const dateTo = new Date(to);
  if (Number.isNaN(dateFrom.getTime()) || Number.isNaN(dateTo.getTime())) return undefined;
  if (dateFrom > dateTo) return undefined;
  return { dateFrom, dateTo };
}

type Props = { searchParams: { from?: string; to?: string } | Promise<{ from?: string; to?: string }> };

export default async function AdminDashboardPage({ searchParams }: Props) {
  const params = await Promise.resolve(searchParams);
  const period = parsePeriod(params);
  const cookieStore = await cookies();
  const useDemoData = !!(
    cookieStore.get("admin_demo")?.value ||
    cookieStore.get("demo_auth")?.value
  );
  const [kpis, topProducts, ordersByStatus, recentOrders, revenueByDay] = await Promise.all([
    getDashboardKpis(useDemoData, period),
    getTopProducts(5, useDemoData, period),
    getOrdersByStatus(useDemoData, period),
    getRecentOrders(10, useDemoData, period),
    getRevenueByDay(period ? 365 : 14, useDemoData, period),
  ]);

  const periodSub = period
    ? `${period.dateFrom.toLocaleDateString("fr-FR")} - ${period.dateTo.toLocaleDateString("fr-FR")}`
    : null;
  const kpiCards = [
    { label: "CA Aujourd'hui", value: `${kpis.revenueToday.toFixed(2)} $`, sub: period ? periodSub : "Today" },
    { label: "CA 7 jours", value: `${kpis.revenue7d.toFixed(2)} $`, sub: period ? periodSub : "7 derniers jours" },
    { label: "CA 30 jours", value: `${kpis.revenue30d.toFixed(2)} $`, sub: period ? periodSub : "30 derniers jours" },
    { label: "Total commandes", value: String(kpis.totalOrders), sub: period ? periodSub : "Toutes périodes" },
    { label: "En attente", value: String(kpis.pendingOrders), sub: "À traiter" },
    { label: "Panier moyen", value: `${kpis.averageOrderValue.toFixed(2)} $`, sub: "Moyenne" },
    { label: "Stock critique", value: String(kpis.criticalStockCount), sub: "Alertes" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <DashboardPeriodFilter />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {kpiCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-400">{card.sub}</p>
          </div>
        ))}
      </section>

      <DashboardChart revenueByDay={revenueByDay} ordersByStatus={ordersByStatus} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Top 5 produits vendus</h2>
          <ul className="space-y-2">
            {topProducts.length === 0 ? (
              <li className="text-sm text-gray-500">Aucune vente</li>
            ) : (
              topProducts.map((p, i) => (
                <li key={p.name} className="flex items-center justify-between text-sm">
                  <span>
                    {i + 1}. {p.name}
                  </span>
                  <span className="font-medium">{p.quantity} vendus · {p.revenue.toFixed(2)} $</span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Dernières commandes</h2>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-primary hover:underline"
            >
              Voir tout
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 pr-2">N°</th>
                  <th className="pb-2 pr-2">Client</th>
                  <th className="pb-2 pr-2">Total</th>
                  <th className="pb-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500">
                      Aucune commande
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((o) => (
                    <tr key={o.id} className="border-b">
                      <td className="py-2 pr-2">
                        <Link href={`/admin/orders/${o.id}`} className="text-primary hover:underline">
                          {o.orderNumber}
                        </Link>
                      </td>
                      <td className="py-2 pr-2">
                        {o.firstName} {o.lastName}
                      </td>
                      <td className="py-2 pr-2">{Number(o.total).toFixed(2)} $</td>
                      <td className="py-2">
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
        <h2 className="text-lg font-semibold text-amber-800">Alertes stock bas</h2>
        <p className="mt-1 text-sm text-amber-700">
          {kpis.criticalStockCount} produit(s) sous le seuil d&apos;alerte.
        </p>
        <Link
          href="/admin/stock"
          className="mt-2 inline-block text-sm font-medium text-amber-800 hover:underline"
        >
          Voir le stock →
        </Link>
      </div>
    </div>
  );
}
