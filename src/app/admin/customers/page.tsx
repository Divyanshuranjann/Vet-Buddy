"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminFetch } from "@/lib/shop/api";
import { ADMIN_TOKEN_KEY } from "@/lib/shop/constants";
import { formatINR } from "@/lib/shop/format";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<
    { name: string; phone: string; orderCount: number; totalSpent: number }[]
  >([]);

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY) || "";
    adminFetch<typeof customers>("/admin/customers", token).then(setCustomers);
  }, []);

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold">Customers</h1>
      <table className="mt-6 w-full text-left text-sm">
        <thead>
          <tr className="text-slate-500">
            <th>Name</th>
            <th>Phone</th>
            <th>Orders</th>
            <th>Spent</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.phone} className="border-t border-white/5">
              <td className="py-2">{c.name}</td>
              <td>{c.phone}</td>
              <td>{c.orderCount}</td>
              <td>{formatINR(c.totalSpent)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
