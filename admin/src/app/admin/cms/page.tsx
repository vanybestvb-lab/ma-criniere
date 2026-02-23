import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCmsPage() {
  const [pages, banners] = await Promise.all([
    prisma.cmsPage.findMany({ orderBy: { title: "asc" } }),
    prisma.banner.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">CMS et contenu</h1>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Pages statiques</h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Titre</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Slug</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Publie</th>
              </tr>
            </thead>
            <tbody>
              {pages.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                    Aucune page
                  </td>
                </tr>
              ) : (
                pages.map((p) => (
                  <tr key={p.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium">{p.title}</td>
                    <td className="px-4 py-3 text-gray-500">{p.slug}</td>
                    <td className="px-4 py-3">
                      {p.published ? (
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
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Bannieres</h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Titre</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Position</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Actif</th>
              </tr>
            </thead>
            <tbody>
              {banners.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                    Aucune banniere
                  </td>
                </tr>
              ) : (
                banners.map((b) => (
                  <tr key={b.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium">{b.title ?? "—"}</td>
                    <td className="px-4 py-3">{b.position}</td>
                    <td className="px-4 py-3">
                      {b.active ? (
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
      </section>
    </div>
  );
}
