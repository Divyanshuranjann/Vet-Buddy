"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminFetch } from "@/lib/shop/api";
import { ADMIN_TOKEN_KEY } from "@/lib/shop/constants";
import { formatINR } from "@/lib/shop/format";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<
    { orderId: string; total: number; paymentStatus: string; customerName: string }[]
  >([]);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY) || "";
    adminFetch<typeof payments>("/admin/payments", token).then(setPayments);
  }, []);

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold">Payments</h1>
      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="text-slate-500">
            <th>Order</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.orderId} className="border-t border-white/5">
              <td className="py-2 font-mono text-xs">{p.orderId}</td>
              <td>{p.customerName}</td>
              <td>{formatINR(p.total)}</td>
              <td>{p.paymentStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
