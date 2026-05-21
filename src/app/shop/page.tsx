"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiFilter } from "react-icons/fi";
import { ShopNavbar } from "@/components/shop/ShopNavbar";
import { ShopHero } from "@/components/shop/ShopHero";
import { BreedCarousel } from "@/components/shop/BreedCarousel";
import { CategoryPills } from "@/components/shop/CategoryPills";
import { ProductCard } from "@/components/shop/ProductCard";
import { FiltersSidebar } from "@/components/shop/FiltersSidebar";
import { ProductGridSkeleton } from "@/components/shop/ProductSkeleton";
import { getProducts } from "@/lib/shop/api";
import type { Product, Pagination } from "@/types/shop";
import Link from "next/link";
import { SITE } from "@/lib/constants";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [breed, setBreed] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [bestSellerOnly, setBestSellerOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const data = await getProducts({
      category: category || undefined,
      breed: breed || undefined,
      search: search || undefined,
      sort: sort as "newest" | "price_asc" | "price_desc" | "rating",
      page,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      bestSeller: bestSellerOnly || undefined,
    });
    setProducts(data.products);
    setPagination(data.pagination);
    setLoading(false);
  }, [category, breed, search, sort, page, minPrice, maxPrice, bestSellerOnly]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setPage(1);
  }, [category, breed, search, sort, minPrice, maxPrice, bestSellerOnly]);

  return (
    <>
      <ShopNavbar onSearch={setSearch} searchValue={search} />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-4 md:px-6 md:pb-12">
        <ShopHero />
        <div className="mt-8">
          <BreedCarousel selected={breed} onSelect={setBreed} />
        </div>
        <div className="mt-6">
          <CategoryPills selected={category} onSelect={setCategory} />
        </div>

        <div id="products" className="mt-10 flex gap-6">
          <FiltersSidebar
            open={filtersOpen}
            onClose={() => setFiltersOpen(false)}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPrice={setMinPrice}
            onMaxPrice={setMaxPrice}
            bestSellerOnly={bestSellerOnly}
            onBestSeller={setBestSellerOnly}
            sort={sort}
            onSort={setSort}
          />

          <div className="min-w-0 flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                {pagination
                  ? `${pagination.total} products`
                  : "Loading..."}
              </p>
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-slate-600 px-3 py-2 text-sm lg:hidden"
              >
                <FiFilter /> Filters
              </button>
            </div>

            {loading ? (
              <ProductGridSkeleton />
            ) : products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-600 py-16 text-center text-slate-400">
                No products found. Try adjusting filters.
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6"
              >
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </motion.div>
            )}

            {pagination && pagination.pages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={`h-10 w-10 rounded-lg text-sm font-medium ${
                        page === p
                          ? "bg-sky-brand text-navy-900"
                          : "border border-slate-600 text-slate-300"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        <footer className="mt-16 border-t border-white/5 py-8 text-center text-sm text-slate-500">
          <p>
            {SITE.name} Pet Shop · Need help?{" "}
            <Link href={`tel:${SITE.phoneTel}`} className="text-sky-brand">
              {SITE.phone}
            </Link>
          </p>
        </footer>
      </main>
    </>
  );
}
