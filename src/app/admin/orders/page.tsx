"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminFetch } from "@/lib/shop/api";
import { ADMIN_TOKEN_KEY } from "@/lib/shop/constants";
import { formatINR } from "@/lib/shop/format";

type OrderRow = {
  _id: string;
  orderId: string;
  customerName: string;
  phone: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
};

const STATUSES = ["pending", "confirmed", "shipped", "delivered"] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [filter, setFilter] = useState("");

  const load = () => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY) || "";
    const q = filter ? `?status=${filter}` : "";
    adminFetch<{ orders: OrderRow[] }>(`/orders${q}`, token).then((d) =>
      setOrders(d.orders || [])
    );
  };

  useEffect(() => {
    load();
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY) || "";
    await adminFetch(`/orders/${id}/status`, token, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    load();
  };

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold">Orders</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("")}
          className={`rounded-lg px-3 py-1 text-sm ${!filter ? "bg-sky-brand text-navy-900" : "bg-slate-800"}`}
        >
          All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-lg px-3 py-1 text-sm capitalize ${filter === s ? "bg-sky-brand text-navy-900" : "bg-slate-800"}`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-500">
              <th>Order</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t border-white/5">
                <td className="py-2 font-mono text-xs">{o.orderId}</td>
                <td>
                  {o.customerName}
                  <br />
                  <span className="text-xs text-slate-500">{o.phone}</span>
                </td>
                <td>{formatINR(o.total)}</td>
                <td>{o.paymentStatus}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
