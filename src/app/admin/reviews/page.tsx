"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminFetch } from "@/lib/shop/api";
import { ADMIN_TOKEN_KEY } from "@/lib/shop/constants";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<
    {
      _id: string;
      customerName: string;
      rating: number;
      comment: string;
      approved: boolean;
      productId?: { name: string };
    }[]
  >([]);

  const load = () => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY) || "";
    adminFetch<typeof reviews>("/admin/reviews", token).then(setReviews);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (id: string, approved: boolean) => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY) || "";
    await adminFetch(`/admin/reviews/${id}`, token, {
      method: "PATCH",
      body: JSON.stringify({ approved }),
    });
    load();
  };

  return (
    <AdminShell>
      <h1 className="font-display text-2xl font-bold">Review moderation</h1>
      <ul className="mt-6 space-y-4">
        {reviews.map((r) => (
          <li
            key={r._id}
            className="rounded-xl border border-white/10 bg-slate-900 p-4"
          >
            <p className="font-semibold">{r.customerName} · {r.rating}★</p>
            <p className="text-sm text-slate-400">{r.productId?.name}</p>
            <p className="mt-2 text-sm">{r.comment}</p>
            <button
              type="button"
              onClick={() => toggle(r._id, !r.approved)}
              className={`mt-2 text-xs ${r.approved ? "text-emerald-400" : "text-amber-400"}`}
            >
              {r.approved ? "Approved" : "Approve"}
            </button>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
