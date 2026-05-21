"use client";

import { motion } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

export function FloatingCartButton() {
  const { itemCount, toggleCart } = useCart();
  if (itemCount === 0) return null;

  return (
    <motion.button
      type="button"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleCart}
      className="fixed bottom-24 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-sky-brand to-cyan-glow text-navy-900 shadow-[0_8px_32px_rgba(56,189,248,0.45)] md:bottom-8"
      aria-label="Open cart"
    >
      <FiShoppingCart className="h-6 w-6" />
      <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
        {itemCount > 9 ? "9+" : itemCount}
      </span>
    </motion.button>
  );
}
