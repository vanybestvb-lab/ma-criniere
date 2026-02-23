/** Types alignés avec le dashboard (évite dépendance circulaire). */
export interface MockDashboardKpis {
  revenueToday: number;
  revenue7d: number;
  revenue30d: number;
  totalOrders: number;
  pendingOrders: number;
  averageOrderValue: number;
  criticalStockCount: number;
}

export interface MockTopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

export const DEMO_EMAIL = "admin@ma-criniere.com";
export const DEMO_PASSWORD = "admin123";

export function isDemoModeEnabled(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}

/** KPIs mock pour le dashboard */
export const mockDashboardKpis: MockDashboardKpis = {
  revenueToday: 420.5,
  revenue7d: 2840.0,
  revenue30d: 12500.0,
  totalOrders: 156,
  pendingOrders: 12,
  averageOrderValue: 80.13,
  criticalStockCount: 3,
};

/** Top produits vendus */
export const mockTopProducts: MockTopProduct[] = [
  { name: "Masque Hydratant Argan", quantity: 45, revenue: 10125 },
  { name: "Shampooing Charbons", quantity: 38, revenue: 7030 },
  { name: "Gloss Lavande", quantity: 52, revenue: 7540 },
  { name: "Huile Capillaire Cocotte", quantity: 28, revenue: 5460 },
  { name: "Sérum Réparateur", quantity: 22, revenue: 4620 },
];

/** Commandes par statut */
export const mockOrdersByStatus: { status: string; count: number }[] = [
  { status: "PENDING", count: 12 },
  { status: "PAID", count: 89 },
  { status: "SHIPPED", count: 34 },
  { status: "DELIVERED", count: 18 },
  { status: "CANCELLED", count: 3 },
];

/** Dernières commandes (format attendu par le dashboard) */
export const mockRecentOrders: Array<{
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: Date;
  firstName: string;
  lastName: string;
}> = [
  {
    id: "demo-1",
    orderNumber: "MC250218-A1B2",
    total: 225,
    status: "PAID",
    createdAt: new Date(Date.now() - 3600000),
    firstName: "Marie",
    lastName: "Dupont",
  },
  {
    id: "demo-2",
    orderNumber: "MC250218-C3D4",
    total: 430,
    status: "SHIPPED",
    createdAt: new Date(Date.now() - 86400000),
    firstName: "Jean",
    lastName: "Martin",
  },
  {
    id: "demo-3",
    orderNumber: "MC250217-E5F6",
    total: 89.5,
    status: "DELIVERED",
    createdAt: new Date(Date.now() - 172800000),
    firstName: "Sophie",
    lastName: "Bernard",
  },
];

/** CA par jour (14 derniers jours) */
export function getMockRevenueByDay(days: number = 14): { date: string; revenue: number }[] {
  const result: { date: string; revenue: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    result.push({
      date: d.toISOString().slice(0, 10),
      revenue: Math.round(400 + Math.random() * 600),
    });
  }
  return result;
}
