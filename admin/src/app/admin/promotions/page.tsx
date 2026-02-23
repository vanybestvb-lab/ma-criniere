import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPromotionsPage() {
  let coupons: Awaited<ReturnType<typeof prisma.coupon.findMany>> = [];
  try {
    coupons = await prisma.coupon.findMany({
      orderBy: { endsAt: "desc" },
    });
  } catch {
    // Mode démo sans base de données
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Promotions & Codes promo</h1>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Code</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Type</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Valeur</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Utilisations</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Fin validité</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Actif</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Aucun code promo
                </td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-medium">{c.code}</td>
                  <td className="px-4 py-3">{c.type}</td>
                  <td className="px-4 py-3">
                    {c.type === "PERCENT" ? `${c.value} %` : `${c.value} €`}
                  </td>
                  <td className="px-4 py-3">
                    {c.usedCount}
                    {c.maxUses != null ? ` / ${c.maxUses}` : ""}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(c.endsAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    {c.active ? (
                      <span className="text-green-600">Oui</span>
                    ) : (
                      <span className="text-gray-400">Non</span>
                    )}
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
