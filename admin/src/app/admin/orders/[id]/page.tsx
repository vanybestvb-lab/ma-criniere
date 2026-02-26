import Link from "next/link";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PrintButton } from "@/components/PrintButton";
import { confirmOrderPayment } from "../actions";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

type OrderWithDetails = Prisma.OrderGetPayload<{
  include: {
    items: { include: { product: true; variant: true } };
    events: true;
    payments: true;
    shipments: true;
  };
}>;

export default async function AdminOrderDetailPage({ params }: Params) {
  const { id } = await params;
  let order: OrderWithDetails | null = null;
  try {
    order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true, variant: true } },
        events: { orderBy: { createdAt: "desc" } },
        payments: true,
        shipments: true,
      },
    });
  } catch {
    // Mode démo sans base de données
  }

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Commandes
          </Link>
          <h1 className="text-2xl font-bold">Commande {order.orderNumber}</h1>
          <span
            className={
              order.status === "PAID" || order.status === "DELIVERED"
                ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
                : order.status === "CANCELLED" || order.status === "REFUNDED"
                  ? "rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800"
                  : "rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800"
            }
          >
            {order.status}
          </span>
        </div>
        <div className="flex gap-2">
          <form action={confirmOrderPayment} className="inline">
            <input type="hidden" name="orderId" value={order.id} />
            <button
              type="submit"
              disabled={order.status !== "PENDING"}
              className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
            >
              Confirmer paiement
            </button>
          </form>
          <PrintButton />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-semibold text-gray-800">Client</h2>
          <p className="font-medium">
            {order.firstName} {order.lastName}
          </p>
          <p className="text-sm text-gray-600">{order.email}</p>
          {order.phone && (
            <p className="text-sm text-gray-600">{order.phone}</p>
          )}
          {order.address && (
            <p className="mt-2 text-sm text-gray-600">{order.address}</p>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-semibold text-gray-800">Montants</h2>
          <ul className="space-y-1 text-sm">
            <li className="flex justify-between">
              <span className="text-gray-600">Sous-total</span>
              <span>{Number(order.subtotal).toFixed(2)} $</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Livraison</span>
              <span>{Number(order.shippingCost).toFixed(2)} $</span>
            </li>
            {Number(order.discount) > 0 && (
              <li className="flex justify-between text-green-600">
                <span>Remise</span>
                <span>-{Number(order.discount).toFixed(2)} $</span>
              </li>
            )}
            <li className="flex justify-between border-t border-gray-100 pt-2 font-medium">
              <span>Total</span>
              <span>{Number(order.total).toFixed(2)} $</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <h2 className="border-b border-gray-100 px-4 py-3 font-semibold text-gray-800">
          Lignes de commande
        </h2>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Produit</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">SKU</th>
              <th className="px-4 py-2 text-right font-medium text-gray-700">Prix</th>
              <th className="px-4 py-2 text-right font-medium text-gray-700">Qté</th>
              <th className="px-4 py-2 text-right font-medium text-gray-700">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-t border-gray-100">
                <td className="px-4 py-2 font-medium">{item.name}</td>
                <td className="px-4 py-2 text-gray-500">{item.sku ?? "—"}</td>
                <td className="px-4 py-2 text-right">{Number(item.price).toFixed(2)} $</td>
                <td className="px-4 py-2 text-right">{item.quantity}</td>
                <td className="px-4 py-2 text-right">{Number(item.subtotal).toFixed(2)} $</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 font-semibold text-gray-800">Timeline</h2>
        <ul className="space-y-2">
          {order.events.length === 0 ? (
            <li className="text-sm text-gray-500">Aucun événement</li>
          ) : (
            order.events.map((ev) => (
              <li key={ev.id} className="flex gap-2 text-sm">
                <span className="text-gray-400">
                  {new Date(ev.createdAt).toLocaleString("fr-FR")}
                </span>
                <span className="font-medium">{ev.status}</span>
                {ev.message && <span className="text-gray-600">— {ev.message}</span>}
              </li>
            ))
          )}
        </ul>
      </div>

      {order.payments.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-semibold text-gray-800">Paiements</h2>
          <ul className="space-y-1 text-sm">
            {order.payments.map((p) => (
              <li key={p.id} className="flex justify-between">
                <span>{p.method} — {Number(p.amount).toFixed(2)} $</span>
                <span className={p.status === "SUCCESS" ? "text-green-600" : "text-gray-500"}>
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {order.shipments.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 font-semibold text-gray-800">Expéditions</h2>
          <ul className="space-y-1 text-sm">
            {order.shipments.map((s) => (
              <li key={s.id}>
                {s.carrier} — {s.trackingNumber ?? "—"} — {s.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
