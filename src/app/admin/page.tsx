"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminFetch } from "@/lib/shop/api";
import { ADMIN_TOKEN_KEY } from "@/lib/shop/constants";
import { formatINR } from "@/lib/shop/format";

type Dashboard = {
  stats: {
    products: number;
    orders: number;
    customers: number;
    pendingOrders: number;
    revenue: number;
  };
  recentOrders: {
    orderId: string;
    customerName: string;
    total: number;
    status: string;
    paymentStatus: string;
  }[];
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return;
    adminFetch<Dashboard>("/admin/dashboard", token)
      .then(setData)
      .catch(() => setData(null));
  }, []);

  const stats = data?.stats;

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-400">Store analytics overview</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Products", value: stats?.products ?? "—" },
          { label: "Orders", value: stats?.orders ?? "—" },
          { label: "Customers", value: stats?.customers ?? "—" },
          { label: "Revenue", value: stats ? formatINR(stats.revenue) : "—" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-white/10 bg-slate-900 p-5"
          >
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-white/10 bg-slate-900 p-5">
        <h2 className="font-semibold">Recent orders</h2>
        {!data?.recentOrders?.length ? (
          <p className="mt-4 text-sm text-slate-500">
            No orders yet. Start the API server and place a test order.
          </p>
        ) : (
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="pb-2">ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((o) => (
                <tr key={o.orderId} className="border-t border-white/5">
                  <td className="py-2 font-mono text-xs">{o.orderId}</td>
                  <td>{o.customerName}</td>
                  <td>{formatINR(o.total)}</td>
                  <td>
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
