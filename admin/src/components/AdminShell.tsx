"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/orders", label: "Commandes" },
  { href: "/admin/products", label: "Produits" },
  { href: "/admin/stock", label: "Stock" },
  { href: "/admin/customers", label: "Clients" },
  { href: "/admin/payments", label: "Paiements" },
  { href: "/admin/shipments", label: "Livraison" },
  { href: "/admin/promotions", label: "Promotions" },
  { href: "/admin/cms", label: "CMS" },
  { href: "/admin/reports", label: "Rapports" },
  { href: "/admin/settings", label: "Paramètres" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
        <div className="flex h-14 items-center border-b border-gray-200 px-4">
          <Link href="/admin/dashboard" className="font-semibold text-primary-dark">
            Ma Crinière Admin
          </Link>
        </div>
        {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-2">
            <span className="inline-flex items-center rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
              DEMO MODE
            </span>
          </div>
        )}
        <nav className="space-y-0.5 p-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-primary-light hover:text-primary-dark"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 pl-64">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
