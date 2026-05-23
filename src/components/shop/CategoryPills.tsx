"use client";

import { motion } from "framer-motion";
import { SHOP_CATEGORIES } from "@/lib/shop/constants";

type Props = {
  selected?: string;
  onSelect: (slug: string) => void;
};

export function CategoryPills({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => onSelect("")}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
          !selected
            ? "bg-gradient-to-r from-sky-brand to-cyan-glow text-white"
            : "border border-slate-200 bg-white/80 text-navy-900 hover:border-sky-brand/50"
        }`}
      >
        All
      </motion.button>
      {SHOP_CATEGORIES.map((cat) => (
        <motion.button
          key={cat.slug}
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(cat.slug)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            selected === cat.slug
              ? "bg-gradient-to-r from-sky-brand to-cyan-glow text-white"
              : "border border-slate-200 bg-white/80 text-navy-900 hover:border-sky-brand/50"
          }`}
        >
          <span className="mr-1">{cat.icon}</span>
          {cat.name}
        </motion.button>
      ))}
    </div>
  );
}
