"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PawPrint, Menu, X, Moon, Sun } from "lucide-react";
import { FiShoppingCart, FiSearch } from "react-icons/fi";
import { SITE, SECTION_IDS } from "@/lib/constants";
import { SHOP_ROUTES } from "@/lib/shop/constants";
import { useCart } from "@/context/CartContext";
import { useShopTheme } from "@/context/ShopThemeContext";

type Props = {
  onSearch?: (q: string) => void;
  searchValue?: string;
};

export function ShopNavbar({ onSearch, searchValue = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchValue);
  const pathname = usePathname();
  const { itemCount, toggleCart } = useCart();
  const { dark, toggle: toggleTheme } = useShopTheme();
  const isShop = pathname?.startsWith("/shop");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localSearch);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-shop-dark/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-4 md:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-display text-lg font-bold text-white"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-brand to-cyan-glow text-navy-900">
            <PawPrint className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline">{SITE.name}</span>
        </Link>

        {isShop && onSearch && (
          <form onSubmit={handleSearch} className="hidden flex-1 md:flex">
            <div className="relative w-full max-w-xl">
              <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="search"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search food, toys, medicines..."
                className="w-full rounded-xl border border-slate-600 bg-slate-800/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-sky-brand focus:outline-none focus:ring-1 focus:ring-sky-brand"
              />
            </div>
          </form>
        )}

        <nav className="ml-auto hidden items-center gap-4 lg:flex">
          <Link
            href="/"
            className="text-sm font-medium text-slate-400 transition hover:text-white"
          >
            Clinic Home
          </Link>
          <Link
            href={SHOP_ROUTES.shop}
            className={`text-sm font-medium transition ${
              pathname === SHOP_ROUTES.shop
                ? "text-sky-brand"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Shop
          </Link>
          <Link
            href={`/#${SECTION_IDS.appointment}`}
            className="rounded-full bg-gradient-to-r from-sky-brand to-cyan-glow px-4 py-2 text-sm font-semibold text-navy-900"
          >
            Book Vet
          </Link>
        </nav>

        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button
          type="button"
          onClick={toggleCart}
          className="relative rounded-lg p-2 text-slate-300 hover:bg-white/5 hover:text-white"
        >
          <FiShoppingCart className="h-6 w-6" />
          {itemCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-sky-brand text-[10px] font-bold text-navy-900">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </button>

        <button
          type="button"
          className="rounded-lg p-2 text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5 lg:hidden"
          >
            <div className="space-y-2 px-4 py-3">
              {onSearch && (
                <form onSubmit={handleSearch}>
                  <input
                    type="search"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm text-white"
                  />
                </form>
              )}
              <Link href="/" className="block py-2 text-slate-300" onClick={() => setOpen(false)}>
                Clinic Home
              </Link>
              <Link
                href={SHOP_ROUTES.shop}
                className="block py-2 text-slate-300"
                onClick={() => setOpen(false)}
              >
                Shop
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
