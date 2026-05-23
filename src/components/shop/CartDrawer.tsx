"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/shop/format";
import { SHOP_ROUTES } from "@/lib/shop/constants";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    itemCount,
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-white/60 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/60 px-5 py-4">
              <h2 className="font-display text-lg font-bold text-navy-900">
                Your Cart ({itemCount})
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="rounded-lg p-2 text-slate-600 hover:bg-sky-50 hover:text-navy-900"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <FiShoppingBag className="h-16 w-16 text-slate-400" />
                  <p className="mt-4 font-medium text-slate-600">
                    Your cart is empty
                  </p>
                  <Link
                    href={SHOP_ROUTES.shop}
                    onClick={closeCart}
                    className="mt-4 rounded-full bg-sky-brand px-6 py-2 text-sm font-semibold text-white"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => (
                    <li
                      key={item.productId}
                      className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium text-navy-900">
                          {item.name}
                        </p>
                        <p className="mt-1 text-sm font-bold text-sky-brand">
                          {formatINR(item.price)}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-lg border border-slate-200">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                              className="p-1.5 text-slate-600"
                            >
                              <FiMinus className="h-3 w-3" />
                            </button>
                            <span className="min-w-[1.5rem] text-center text-sm text-navy-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                              className="p-1.5 text-slate-600"
                            >
                              <FiPlus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.productId)}
                            className="text-xs text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-white/60 p-5">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-navy-900">
                    {formatINR(subtotal)}
                  </span>
                </div>
                <Link
                  href={SHOP_ROUTES.checkout}
                  onClick={closeCart}
                  className="mt-4 block w-full rounded-xl bg-gradient-to-r from-sky-brand to-cyan-glow py-3 text-center font-semibold text-white"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
