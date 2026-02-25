"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function startOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  return out;
}

function endOfDay(d: Date): Date {
  const out = new Date(d);
  out.setHours(23, 59, 59, 999);
  return out;
}

export function DashboardPeriodFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";

  const applyPeriod = useCallback(
    (dateFrom: Date, dateTo: Date) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("from", formatDate(dateFrom));
      params.set("to", formatDate(dateTo));
      router.push(`/admin/dashboard?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handlePreset = useCallback(
    (preset: "today" | "7d" | "30d" | "month" | "lastMonth") => {
      const now = new Date();
      const today = startOfDay(now);

      switch (preset) {
        case "today":
          applyPeriod(today, endOfDay(now));
          break;
        case "7d": {
          const d7 = new Date(today);
          d7.setDate(d7.getDate() - 6);
          applyPeriod(d7, endOfDay(now));
          break;
        }
        case "30d": {
          const d30 = new Date(today);
          d30.setDate(d30.getDate() - 29);
          applyPeriod(d30, endOfDay(now));
          break;
        }
        case "month": {
          const first = new Date(today.getFullYear(), today.getMonth(), 1);
          const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          applyPeriod(first, endOfDay(last));
          break;
        }
        case "lastMonth": {
          const first = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          const last = new Date(today.getFullYear(), today.getMonth(), 0);
          applyPeriod(first, endOfDay(last));
          break;
        }
      }
    },
    [applyPeriod]
  );

  const handleCustomSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fromInput = form.querySelector<HTMLInputElement>('[name="from"]');
    const toInput = form.querySelector<HTMLInputElement>('[name="to"]');
    if (fromInput?.value && toInput?.value) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("from", fromInput.value);
      params.set("to", toInput.value);
      router.push(`/admin/dashboard?${params.toString()}`);
    }
  };

  const clearFilter = useCallback(() => {
    router.push("/admin/dashboard");
  }, [router]);

  const hasFilter = from !== "" || to !== "";

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <span className="text-sm font-medium text-gray-700">Période :</span>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => handlePreset("today")}
          className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Aujourd&apos;hui
        </button>
        <button
          type="button"
          onClick={() => handlePreset("7d")}
          className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          7 derniers jours
        </button>
        <button
          type="button"
          onClick={() => handlePreset("30d")}
          className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          30 derniers jours
        </button>
        <button
          type="button"
          onClick={() => handlePreset("month")}
          className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Ce mois
        </button>
        <button
          type="button"
          onClick={() => handlePreset("lastMonth")}
          className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
        >
          Mois dernier
        </button>
      </div>
      <form onSubmit={handleCustomSubmit} className="flex flex-wrap items-center gap-2">
        <label className="text-sm text-gray-500">
          Du
          <input
            type="date"
            name="from"
            defaultValue={from}
            className="ml-1 rounded border border-gray-200 px-2 py-1 text-sm"
          />
        </label>
        <label className="text-sm text-gray-500">
          au
          <input
            type="date"
            name="to"
            defaultValue={to}
            className="ml-1 rounded border border-gray-200 px-2 py-1 text-sm"
          />
        </label>
        <button
          type="submit"
          className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Appliquer
        </button>
      </form>
      {hasFilter && (
        <button
          type="button"
          onClick={clearFilter}
          className="text-sm font-medium text-gray-500 underline hover:text-gray-700"
        >
          Tout afficher
        </button>
      )}
    </div>
  );
}
