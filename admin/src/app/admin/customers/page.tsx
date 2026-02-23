import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  let customers: Awaited<ReturnType<typeof prisma.customer.findMany>> = [];
  try {
    customers = await prisma.customer.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { orders: true } } },
    });
  } catch {
    // Mode démo sans base de données
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Clients</h1>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Nom</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Email</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Tel</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Segment</th>
              <th className="px-4 py-3 text-left font-medium text-gray-700">Cmd</th>
              <th className="px-4 py-3 text-right font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">Aucun client</td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.firstName} {c.lastName}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3">{c.phone ?? "-"}</td>
                  <td className="px-4 py-3">{c.segment ?? "-"}</td>
                  <td className="px-4 py-3">{c._count.orders}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/customers/${c.id}`} className="text-primary hover:underline">Fiche</Link>
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
