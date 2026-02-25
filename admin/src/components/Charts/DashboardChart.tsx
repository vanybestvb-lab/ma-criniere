"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export interface RevenueByDayItem {
  date: string;
  revenue: number;
}

export interface OrdersByStatusItem {
  status: string;
  count: number;
}

interface DashboardChartProps {
  revenueByDay: RevenueByDayItem[];
  ordersByStatus: OrdersByStatusItem[];
}

export function DashboardChart({ revenueByDay, ordersByStatus }: DashboardChartProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">CA par jour</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: number) => [`${Number(v).toFixed(2)} $`, "CA"]} />
              <Line type="monotone" dataKey="revenue" stroke="#81557A" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Commandes par statut</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ordersByStatus} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="status" width={55} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#81557A" name="Nombre" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
