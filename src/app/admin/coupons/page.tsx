"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminFetch } from "@/lib/shop/api";
import { ADMIN_TOKEN_KEY } from "@/lib/shop/constants";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<
    { _id: string; code: string; type: string; value: number; active: boolean }[]
  >([]);
  const [code, setCode] = useState("");
  const [value, setValue] = useState("10");

  const load = () => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY) || "";
    adminFetch<typeof coupons>("/admin/coupons", token).then(setCoupons);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem(ADMIN_TOKEN_KEY) || "";
    await adminFetch("/admin/coupons", token, {
      method: "POST",
      body: JSON.stringify({
        code: code.toUpperCase(),
        type: "percent",
        value: Number(value),
        minOrder: 499,
      }),
    });
    setCode("");
    load();
  };

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold">Coupons</h1>
      <form onSubmit={create} className="mt-4 flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="CODE"
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
        />
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-20 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
        />
        <button type="submit" className="rounded-lg bg-sky-brand px-4 py-2 text-navy-900 font-semibold">
          Add
        </button>
      </form>
      <ul className="mt-6 space-y-2">
        {coupons.map((c) => (
          <li
            key={c._id}
            className="flex justify-between rounded-lg border border-white/10 px-4 py-2"
          >
            <span className="font-mono font-bold">{c.code}</span>
            <span>
              {c.value}% · {c.active ? "Active" : "Inactive"}
            </span>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
