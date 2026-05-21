"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShopNavbar } from "@/components/shop/ShopNavbar";
import { QRPayment } from "@/components/shop/QRPayment";
import { useCart } from "@/context/CartContext";
import { getProduct, createOrder, markOrderPaid } from "@/lib/shop/api";
import { formatINR } from "@/lib/shop/format";
import { SHOP_ROUTES } from "@/lib/shop/constants";
import { useToast } from "@/components/providers/ToastProvider";
import type { CartItem } from "@/types/shop";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const buySlug = searchParams.get("buy");
  const buyQty = Number(searchParams.get("qty") || 1);
  const { items, subtotal, clearCart } = useCart();
  const { showToast } = useToast();
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [step, setStep] = useState<"form" | "payment" | "done">("form");
  const [orderId, setOrderId] = useState<string>("");
  const [dbOrderId, setDbOrderId] = useState<string>("");
  const [coupon, setCoupon] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    line1: "",
    line2: "",
    city: "Patna",
    state: "Bihar",
    pincode: "",
  });

  useEffect(() => {
    async function load() {
      if (buySlug) {
        const p = await getProduct(buySlug);
        if (p) {
          const single: CartItem = {
            productId: p._id,
            slug: p.slug,
            name: p.name,
            image: p.images[0],
            price: p.price,
            quantity: buyQty,
            stock: p.stock,
          };
          setCheckoutItems([single]);
          setTotal(p.price * buyQty);
          return;
        }
      }
      setCheckoutItems(items);
      setTotal(subtotal);
    }
    load();
  }, [buySlug, buyQty, items, subtotal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.phone || !form.line1 || !form.pincode) {
      showToast("Please fill required fields");
      return;
    }
    const orderItems = checkoutItems.map((i) => ({
      productId: i.productId,
      name: i.name,
      image: i.image,
      price: i.price,
      quantity: i.quantity,
    }));
    const order = (await createOrder({
      customerName: form.customerName,
      phone: form.phone,
      email: form.email,
      address: {
        line1: form.line1,
        line2: form.line2,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },
      items: orderItems,
      couponCode: coupon || undefined,
    })) as { orderId: string; _id: string; total: number } | null;

    if (order) {
      setOrderId(order.orderId);
      setDbOrderId(order._id);
      setTotal(order.total);
      setStep("payment");
    } else {
      setOrderId(`VB${Date.now()}`);
      setStep("payment");
    }
  };

  const handlePaid = async () => {
    if (dbOrderId) await markOrderPaid(dbOrderId);
    clearCart();
    setStep("done");
    showToast("Order placed successfully!");
  };

  if (checkoutItems.length === 0 && step === "form") {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-400">Your cart is empty</p>
        <Link href={SHOP_ROUTES.shop} className="mt-4 inline-block text-sky-brand">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 pb-24 md:px-6">
      <h1 className="font-display text-2xl font-bold text-white">Checkout</h1>

      {step === "done" ? (
        <div className="mt-12 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
          <p className="text-xl font-bold text-emerald-400">Order Confirmed!</p>
          <p className="mt-2 text-slate-400">Order ID: {orderId}</p>
          <Link
            href={SHOP_ROUTES.shop}
            className="mt-6 inline-block rounded-xl bg-sky-brand px-6 py-3 font-semibold text-navy-900"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {step === "form" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="font-semibold text-white">Delivery address</h2>
              {(
                [
                  ["customerName", "Full name *", "text"],
                  ["phone", "Phone *", "tel"],
                  ["email", "Email", "email"],
                  ["line1", "Address line 1 *", "text"],
                  ["line2", "Address line 2", "text"],
                  ["city", "City", "text"],
                  ["state", "State", "text"],
                  ["pincode", "PIN code *", "text"],
                ] as const
              ).map(([key, label, type]) => (
                <div key={key}>
                  <label className="text-xs text-slate-500">{label}</label>
                  <input
                    type={type}
                    required={label.includes("*")}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-2.5 text-white"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs text-slate-500">Coupon code</label>
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="VETBUDDY10 or PAW50"
                  className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-2.5 text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-sky-brand to-cyan-glow py-3 font-semibold text-navy-900"
              >
                Continue to Payment
              </button>
            </form>
          ) : (
            <QRPayment
              amount={total}
              orderId={orderId}
              onPaid={handlePaid}
            />
          )}

          <div className="rounded-2xl border border-white/10 bg-shop-card p-6 h-fit">
            <h2 className="font-semibold text-white">Order summary</h2>
            <ul className="mt-4 space-y-3">
              {checkoutItems.map((item) => (
                <li key={item.productId} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm text-white">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      Qty {item.quantity} × {formatINR(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {formatINR(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-white/10 pt-4 flex justify-between">
              <span className="text-slate-400">Total</span>
              <span className="text-xl font-bold text-sky-brand">
                {formatINR(total)}
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <>
      <ShopNavbar />
      <Suspense fallback={<div className="p-8 text-slate-400">Loading...</div>}>
        <CheckoutContent />
      </Suspense>
    </>
  );
}
