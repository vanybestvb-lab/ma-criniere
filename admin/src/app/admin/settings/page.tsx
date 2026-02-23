import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  let zones: Awaited<ReturnType<typeof prisma.shippingZone.findMany>> = [];
  try {
    zones = await prisma.shippingZone.findMany({ orderBy: { code: "asc" } });
  } catch {
    // Mode démo sans base de données
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Paramètres</h1>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Zones de livraison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-2 pr-4">Code</th>
                <th className="pb-2 pr-4">Nom</th>
                <th className="pb-2 pr-4">Prix</th>
                <th className="pb-2">Délai</th>
              </tr>
            </thead>
            <tbody>
              {zones.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    Aucune zone. Exécutez <code className="rounded bg-gray-100 px-1">npm run db:seed</code>.
                  </td>
                </tr>
              ) : (
                zones.map((z) => (
                  <tr key={z.id} className="border-b">
                    <td className="py-2 pr-4 font-mono">{z.code}</td>
                    <td className="py-2 pr-4">{z.name}</td>
                    <td className="py-2 pr-4">{Number(z.price).toFixed(2)} €</td>
                    <td className="py-2">{z.delay ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
