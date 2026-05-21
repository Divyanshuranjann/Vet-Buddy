"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiStar, FiHeart, FiMinus, FiPlus } from "react-icons/fi";
import { ShopNavbar } from "@/components/shop/ShopNavbar";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductGridSkeleton } from "@/components/shop/ProductSkeleton";
import { getProduct, getRelatedProducts } from "@/lib/shop/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/components/providers/ToastProvider";
import { formatINR, discountPercent } from "@/lib/shop/format";
import { SHOP_ROUTES } from "@/lib/shop/constants";
import type { Product } from "@/types/shop";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getProduct(slug).then(async (p) => {
      setProduct(p);
      if (p) {
        const rel = await getRelatedProducts(p.categorySlug, p.slug);
        setRelated(rel);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <>
        <ShopNavbar />
        <div className="mx-auto max-w-7xl px-4 py-8">
          <ProductGridSkeleton count={1} />
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <ShopNavbar />
        <div className="mx-auto max-w-7xl px-4 py-20 text-center">
          <p className="text-slate-400">Product not found</p>
          <Link href={SHOP_ROUTES.shop} className="mt-4 inline-block text-sky-brand">
            Back to shop
          </Link>
        </div>
      </>
    );
  }

  const discount = discountPercent(product.price, product.compareAtPrice);

  return (
    <>
      <ShopNavbar />
      <main className="mx-auto max-w-7xl px-4 py-6 pb-24 md:px-6 md:pb-12">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href={SHOP_ROUTES.shop} className="hover:text-sky-brand">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-300">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/5 bg-slate-800">
              <Image
                src={product.images[imgIdx] || product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImgIdx(i)}
                    className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 ${
                      imgIdx === i ? "border-sky-brand" : "border-transparent"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {product.isBestSeller && (
              <span className="rounded-md bg-amber-500 px-2 py-0.5 text-xs font-bold text-navy-900">
                Best Seller
              </span>
            )}
            <h1 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
              {product.name}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-amber-400">
              <FiStar className="fill-current" />
              <span className="text-slate-400">
                {product.rating} · {product.reviewCount} reviews
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-white">
                {formatINR(product.price)}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-slate-500 line-through">
                    {formatINR(product.compareAtPrice)}
                  </span>
                  <span className="text-emerald-400">{discount}% off</span>
                </>
              )}
            </div>
            <p className="mt-4 text-slate-400 leading-relaxed">
              {product.description}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </p>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-xl border border-slate-600">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-3 text-slate-300"
                >
                  <FiMinus />
                </button>
                <span className="min-w-[2rem] text-center font-semibold">{qty}</span>
                <button
                  type="button"
                  onClick={() =>
                    setQty((q) => Math.min(product.stock, q + 1))
                  }
                  className="p-3 text-slate-300"
                >
                  <FiPlus />
                </button>
              </div>
              <button
                type="button"
                onClick={() => toggle(product._id)}
                className="rounded-xl border border-slate-600 p-3 text-slate-300"
              >
                <FiHeart
                  className={has(product._id) ? "fill-red-500 text-red-500" : ""}
                />
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  addItem(product, qty);
                  showToast("Added to cart");
                }}
                disabled={product.stock < 1}
                className="flex-1 rounded-xl bg-gradient-to-r from-sky-brand to-cyan-glow py-3 font-semibold text-navy-900 disabled:opacity-50"
              >
                Add to Cart
              </button>
              <Link
                href={`${SHOP_ROUTES.checkout}?buy=${product.slug}&qty=${qty}`}
                className="flex-1 rounded-xl border border-sky-brand py-3 text-center font-semibold text-sky-brand"
              >
                Buy Now
              </Link>
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-xl font-bold text-white">
              Related products
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
