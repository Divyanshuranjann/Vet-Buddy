"use client";

import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";

type Props = {
  open: boolean;
  onClose: () => void;
  minPrice: number;
  maxPrice: number;
  onMinPrice: (v: number) => void;
  onMaxPrice: (v: number) => void;
  bestSellerOnly: boolean;
  onBestSeller: (v: boolean) => void;
  sort: string;
  onSort: (v: string) => void;
};

export function FiltersSidebar({
  open,
  onClose,
  minPrice,
  maxPrice,
  onMinPrice,
  onMaxPrice,
  bestSellerOnly,
  onBestSeller,
  sort,
  onSort,
}: Props) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : "-100%" }}
        className="fixed left-0 top-0 z-50 h-full w-72 overflow-y-auto border-r border-white/60 bg-white p-5 pt-20 lg:static lg:z-auto lg:h-auto lg:w-56 lg:translate-x-0 lg:rounded-2xl lg:border lg:pt-5 lg:shrink-0"
      >
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <h3 className="font-display font-bold text-navy-900">Filters</h3>
          <button type="button" onClick={onClose} className="text-slate-600">
            <FiX />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Sort by
            </label>
            <select
              value={sort}
              onChange={(e) => onSort(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-900"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              Price range (₹)
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice || ""}
                onChange={(e) => onMinPrice(Number(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-900"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice || ""}
                onChange={(e) => onMaxPrice(Number(e.target.value) || 0)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-900"
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={bestSellerOnly}
              onChange={(e) => onBestSeller(e.target.checked)}
              className="rounded border-slate-200 bg-white text-sky-brand"
            />
            <span className="text-sm text-navy-900">Best sellers only</span>
          </label>
        </div>
      </motion.aside>
    </>
  );
}
