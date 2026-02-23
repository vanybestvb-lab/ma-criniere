import { prisma } from "@/lib/prisma";
import { startOfDay, subDays } from "date-fns";

export interface DashboardKpis {
  revenueToday: number;
  revenue7d: number;
  revenue30d: number;
  totalOrders: number;
  pendingOrders: number;
  averageOrderValue: number;
  criticalStockCount: number;
}

export interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

export async function getDashboardKpis(): Promise<DashboardKpis> {
  const today = startOfDay(new Date());
  const day7 = subDays(today, 7);
  const day30 = subDays(today, 30);

  const [revenueTodayAgg, revenue7dAgg, revenue30dAgg, totalOrders, pendingOrders, avgOrder] =
    await Promise.all([
      prisma.order.aggregate({
        where: { status: { in: ["PAID", "PREPARING", "SHIPPED", "DELIVERED"] }, createdAt: { gte: today } },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { status: { in: ["PAID", "PREPARING", "SHIPPED", "DELIVERED"] }, createdAt: { gte: day7 } },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { status: { in: ["PAID", "PREPARING", "SHIPPED", "DELIVERED"] }, createdAt: { gte: day30 } },
        _sum: { total: true },
      }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.aggregate({ _avg: { total: true } }),
    ]);

  const countWithCritical = await prisma.inventoryLevel.count({
    where: { quantity: { lte: 5 } },
  });

  const revenueToday = Number(revenueTodayAgg._sum.total ?? 0);
  const revenue7d = Number(revenue7dAgg._sum.total ?? 0);
  const revenue30d = Number(revenue30dAgg._sum.total ?? 0);
  const avg = Number(avgOrder._avg.total ?? 0);

  return {
    revenueToday,
    revenue7d,
    revenue30d,
    totalOrders,
    pendingOrders,
    averageOrderValue: avg,
    criticalStockCount: countWithCritical,
  };
}

export async function getTopProducts(limit: number = 5): Promise<TopProduct[]> {
  const all = await prisma.orderItem.findMany({
    where: { order: { status: { in: ["PAID", "PREPARING", "SHIPPED", "DELIVERED"] } } },
    select: { name: true, quantity: true, subtotal: true },
  });
  const byName = new Map<string, { quantity: number; revenue: number }>();
  for (const row of all) {
    const cur = byName.get(row.name) ?? { quantity: 0, revenue: 0 };
    cur.quantity += row.quantity;
    cur.revenue += Number(row.subtotal);
    byName.set(row.name, cur);
  }
  return Array.from(byName.entries())
    .map(([name, data]) => ({ name, quantity: data.quantity, revenue: data.revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export async function getOrdersByStatus(): Promise<{ status: string; count: number }[]> {
  const groups = await prisma.order.groupBy({
    by: ["status"],
    _count: { id: true },
  });
  return groups.map((g) => ({ status: g.status, count: g._count.id }));
}

export async function getRecentOrders(limit: number = 10) {
  return prisma.order.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      total: true,
      status: true,
      createdAt: true,
      firstName: true,
      lastName: true,
    },
  });
}

export async function getRevenueByDay(days: number = 14) {
  const start = subDays(startOfDay(new Date()), days);
  const orders = await prisma.order.findMany({
    where: {
      status: { in: ["PAID", "PREPARING", "SHIPPED", "DELIVERED"] },
      createdAt: { gte: start },
    },
    select: { createdAt: true, total: true },
  });

  const byDay = new Map<string, number>();
  for (const o of orders) {
    const key = o.createdAt.toISOString().slice(0, 10);
    byDay.set(key, (byDay.get(key) ?? 0) + Number(o.total));
  }
  return Array.from(byDay.entries()).map(([date, revenue]) => ({ date, revenue }));
}
