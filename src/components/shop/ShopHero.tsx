"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function ShopHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900 via-navy-900 to-slate-900 px-6 py-12 md:px-10 md:py-16">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-brand/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 left-10 h-48 w-48 rounded-full bg-cyan-glow/15 blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-2xl"
      >
        <span className="inline-block rounded-full border border-sky-brand/30 bg-sky-brand/10 px-3 py-1 text-xs font-semibold text-sky-brand">
          Vet Buddy Pet Store
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-5xl">
          Premium pet care,{" "}
          <span className="gradient-text">delivered fast</span>
        </h1>
        <p className="mt-4 text-slate-400 md:text-lg">
          Food, toys, medicines & more — trusted by pet parents across Patna.
          Same care as our clinic, now at your doorstep.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="#products"
            className="rounded-full bg-gradient-to-r from-sky-brand to-cyan-glow px-6 py-3 text-sm font-semibold text-navy-900 shadow-float"
          >
            Shop Now
          </a>
          <Link
            href="/#appointment"
            className="rounded-full border border-slate-500 px-6 py-3 text-sm font-semibold text-white transition hover:border-sky-brand"
          >
            Book Vet Visit
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
