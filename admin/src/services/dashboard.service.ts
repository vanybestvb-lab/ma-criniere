import { prisma } from "@/lib/prisma";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { isDemoModeEnabled } from "@/mocks";
import {
  mockDashboardKpis,
  mockTopProducts,
  mockOrdersByStatus,
  mockRecentOrders,
  getMockRevenueByDay,
} from "@/mocks";

export interface DashboardPeriod {
  dateFrom: Date;
  dateTo: Date;
}

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

const emptyKpis: DashboardKpis = {
  revenueToday: 0,
  revenue7d: 0,
  revenue30d: 0,
  totalOrders: 0,
  pendingOrders: 0,
  averageOrderValue: 0,
  criticalStockCount: 0,
};

function orderDateFilter(period: DashboardPeriod | undefined): { createdAt?: { gte: Date; lte: Date } } {
  if (!period) return {};
  return {
    createdAt: { gte: startOfDay(period.dateFrom), lte: endOfDay(period.dateTo) },
  };
}

export async function getDashboardKpis(
  useDemoData?: boolean,
  period?: DashboardPeriod
): Promise<DashboardKpis> {
  if (useDemoData || isDemoModeEnabled()) return mockDashboardKpis;
  try {
    const dateFilter = orderDateFilter(period);
    const today = startOfDay(new Date());
    const day7 = subDays(today, 7);
    const day30 = subDays(today, 30);

    const paidStatus = { in: ["PAID", "PREPARING", "SHIPPED", "DELIVERED"] as string[] };

    if (period) {
      const [revenueAgg, totalOrders, pendingOrders, avgOrder] = await Promise.all([
        prisma.order.aggregate({
          where: { status: paidStatus, ...dateFilter },
          _sum: { total: true },
        }),
        prisma.order.count({ where: dateFilter }),
        prisma.order.count({ where: { status: "PENDING", ...dateFilter } }),
        prisma.order.aggregate({ where: dateFilter, _avg: { total: true } }),
      ]);
      const countWithCritical = await prisma.inventoryLevel.count({
        where: { quantity: { lte: 5 } },
      });
      const rev = Number(revenueAgg._sum.total ?? 0);
      const avg = Number(avgOrder._avg.total ?? 0);
      return {
        revenueToday: rev,
        revenue7d: rev,
        revenue30d: rev,
        totalOrders,
        pendingOrders,
        averageOrderValue: avg,
        criticalStockCount: countWithCritical,
      };
    }

    const [revenueTodayAgg, revenue7dAgg, revenue30dAgg, totalOrders, pendingOrders, avgOrder] =
      await Promise.all([
        prisma.order.aggregate({
          where: { status: paidStatus, createdAt: { gte: today } },
          _sum: { total: true },
        }),
        prisma.order.aggregate({
          where: { status: paidStatus, createdAt: { gte: day7 } },
          _sum: { total: true },
        }),
        prisma.order.aggregate({
          where: { status: paidStatus, createdAt: { gte: day30 } },
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
  } catch {
    if (isDemoModeEnabled()) return mockDashboardKpis;
    return emptyKpis;
  }
}

export async function getTopProducts(
  limit: number = 5,
  useDemoData?: boolean,
  period?: DashboardPeriod
): Promise<TopProduct[]> {
  if (useDemoData || isDemoModeEnabled()) return mockTopProducts.slice(0, limit);
  try {
    const orderWhere = period
      ? { status: { in: ["PAID", "PREPARING", "SHIPPED", "DELIVERED"] as string[] }, ...orderDateFilter(period) }
      : { status: { in: ["PAID", "PREPARING", "SHIPPED", "DELIVERED"] as string[] } };
    const all = await prisma.orderItem.findMany({
      where: { order: orderWhere },
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
  } catch {
    if (isDemoModeEnabled()) return mockTopProducts.slice(0, limit);
    return [];
  }
}

export async function getOrdersByStatus(
  useDemoData?: boolean,
  period?: DashboardPeriod
): Promise<{ status: string; count: number }[]> {
  if (useDemoData || isDemoModeEnabled()) return mockOrdersByStatus;
  try {
    const where = orderDateFilter(period);
    const groups = await prisma.order.groupBy({
      by: ["status"],
      where: Object.keys(where).length > 0 ? where : undefined,
      _count: { id: true },
    });
    return groups.map((g) => ({ status: g.status, count: g._count.id }));
  } catch {
    if (isDemoModeEnabled()) return mockOrdersByStatus;
    return [];
  }
}

export async function getRecentOrders(
  limit: number = 10,
  useDemoData?: boolean,
  period?: DashboardPeriod
) {
  if (useDemoData || isDemoModeEnabled()) return mockRecentOrders.slice(0, limit);
  try {
    const where = orderDateFilter(period);
    return prisma.order.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
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
  } catch {
    if (isDemoModeEnabled()) return mockRecentOrders.slice(0, limit);
    return [];
  }
}

export async function getRevenueByDay(
  days: number = 14,
  useDemoData?: boolean,
  period?: DashboardPeriod
) {
  if (useDemoData || isDemoModeEnabled()) return getMockRevenueByDay(days);
  try {
    const dateFilter = period
      ? {
          createdAt: {
            gte: startOfDay(period.dateFrom),
            lte: endOfDay(period.dateTo),
          },
        }
      : { createdAt: { gte: subDays(startOfDay(new Date()), days) } };
    const orders = await prisma.order.findMany({
      where: {
        status: { in: ["PAID", "PREPARING", "SHIPPED", "DELIVERED"] as string[] },
        ...dateFilter,
      },
      select: { createdAt: true, total: true },
    });

    const byDay = new Map<string, number>();
    for (const o of orders) {
      const key = o.createdAt.toISOString().slice(0, 10);
      byDay.set(key, (byDay.get(key) ?? 0) + Number(o.total));
    }
    return Array.from(byDay.entries())
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    if (isDemoModeEnabled()) return getMockRevenueByDay(days);
    return [];
  }
}
