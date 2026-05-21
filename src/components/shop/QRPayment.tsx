"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { FiCheck } from "react-icons/fi";
import { PAYMENT } from "@/lib/shop/constants";
import { formatINR } from "@/lib/shop/format";
import { getShopConfig } from "@/lib/shop/api";

type Props = {
  amount: number;
  orderId?: string;
  onPaid: () => void;
};

export function QRPayment({ amount, orderId, onPaid }: Props) {
  const [upiId, setUpiId] = useState(PAYMENT.upiId);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    getShopConfig().then((c) => setUpiId(c.upiId));
  }, []);

  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(PAYMENT.merchantName)}&am=${amount}&cu=INR${orderId ? `&tn=Order%20${orderId}` : ""}`;

  const handleConfirm = () => {
    setPaid(true);
    setTimeout(() => onPaid(), 1800);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-shop-card p-6">
      <h3 className="font-display text-lg font-bold text-white">Scan & Pay</h3>
      <p className="mt-1 text-sm text-slate-400">
        Pay via Google Pay, PhonePe, or Paytm
      </p>

      <AnimatePresence mode="wait">
        {!paid ? (
          <motion.div
            key="qr"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 flex flex-col items-center"
          >
            <div className="rounded-2xl bg-white p-4">
              <QRCodeSVG value={upiString} size={200} level="M" />
            </div>
            <p className="mt-4 text-center text-sm text-slate-400">
              UPI ID:{" "}
              <span className="font-mono font-semibold text-sky-brand">
                {upiId}
              </span>
            </p>
            <p className="mt-2 text-2xl font-bold text-white">
              {formatINR(amount)}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {[PAYMENT.gpay, PAYMENT.phonepe, PAYMENT.paytm].map((app) => (
                <span
                  key={app}
                  className="rounded-full border border-slate-600 px-3 py-1 text-xs text-slate-300"
                >
                  {app}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={handleConfirm}
              className="mt-6 w-full rounded-xl bg-gradient-to-r from-sky-brand to-cyan-glow py-3 font-semibold text-navy-900"
            >
              I have completed payment
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center py-12"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400"
            >
              <FiCheck className="h-10 w-10" />
            </motion.span>
            <p className="mt-4 font-display text-xl font-bold text-white">
              Payment Successful!
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Thank you for shopping with Vet Buddy
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
