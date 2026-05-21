"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiHeart, FiStar, FiMinus, FiPlus } from "react-icons/fi";
import type { Product } from "@/types/shop";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/components/providers/ToastProvider";
import { formatINR, discountPercent } from "@/lib/shop/format";
import { SHOP_ROUTES } from "@/lib/shop/constants";

type Props = { product: Product };

export function ProductCard({ product }: Props) {
  const { addItem, items, updateQuantity, isInCart } = useCart();
  const { toggle, has } = useWishlist();
  const { showToast } = useToast();
  const cartItem = items.find((i) => i.productId === product._id);
  const discount = discountPercent(product.price, product.compareAtPrice);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    showToast(`${product.name} added to cart`);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-shop-card shadow-lg transition hover:border-sky-brand/30 hover:shadow-[0_8px_40px_rgba(56,189,248,0.12)]"
    >
      <Link href={SHOP_ROUTES.product(product.slug)} className="relative block">
        {product.isBestSeller && (
          <span className="absolute left-2 top-2 z-10 rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy-900">
            Best Seller
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-2 top-2 z-10 rounded-md bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
            {discount}% off
          </span>
        )}
        <div className="relative aspect-square overflow-hidden bg-slate-800">
          <Image
            src={product.images[0] || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width:768px) 50vw, 25vw"
          />
        </div>
      </Link>

      <button
        type="button"
        onClick={() => toggle(product._id)}
        className="absolute right-3 top-[calc(50%-2rem)] z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/80 text-white backdrop-blur transition hover:bg-sky-brand"
        aria-label="Wishlist"
      >
        <FiHeart
          className={`h-4 w-4 ${has(product._id) ? "fill-red-500 text-red-500" : ""}`}
        />
      </button>

      <div className="flex flex-1 flex-col p-3 md:p-4">
        <Link href={SHOP_ROUTES.product(product.slug)}>
          <h3 className="line-clamp-2 text-sm font-semibold text-white transition hover:text-sky-brand md:text-base">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-center gap-1 text-amber-400">
          <FiStar className="h-3.5 w-3.5 fill-current" />
          <span className="text-xs text-slate-400">
            {product.rating} ({product.reviewCount})
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-lg font-bold text-white">
            {formatINR(product.price)}
          </span>
          {product.compareAtPrice > product.price && (
            <span className="text-xs text-slate-500 line-through">
              {formatINR(product.compareAtPrice)}
            </span>
          )}
        </div>

        <div className="mt-auto flex gap-2 pt-3">
          {isInCart(product._id) && cartItem ? (
            <div className="flex flex-1 items-center justify-between rounded-xl border border-slate-600 bg-slate-800/80 px-2">
              <button
                type="button"
                onClick={() =>
                  updateQuantity(product._id, cartItem.quantity - 1)
                }
                className="p-2 text-slate-300 hover:text-white"
              >
                <FiMinus />
              </button>
              <span className="text-sm font-semibold text-white">
                {cartItem.quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  updateQuantity(product._id, cartItem.quantity + 1)
                }
                className="p-2 text-slate-300 hover:text-white"
              >
                <FiPlus />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 rounded-xl bg-gradient-to-r from-sky-brand to-cyan-glow py-2.5 text-sm font-semibold text-navy-900 transition hover:brightness-110"
            >
              Add to Cart
            </button>
          )}
          <Link
            href={`${SHOP_ROUTES.checkout}?buy=${product.slug}`}
            className="rounded-xl border border-sky-brand/50 px-3 py-2.5 text-xs font-semibold text-sky-brand transition hover:bg-sky-brand/10"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
