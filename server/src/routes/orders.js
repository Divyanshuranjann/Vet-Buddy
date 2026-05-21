import { Router } from "express";
import { Order } from "../models/Order.js";
import { Customer } from "../models/Customer.js";
import { Coupon } from "../models/Coupon.js";
import { authAdmin } from "../middleware/auth.js";

const router = Router();

function generateOrderId() {
  return `VB${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

router.post("/", async (req, res) => {
  try {
    const { customerName, phone, email, address, items, couponCode } = req.body;
    if (!items?.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    let discount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        active: true,
      });
      if (coupon && coupon.usedCount < coupon.maxUses) {
        if (subtotal >= coupon.minOrder) {
          discount =
            coupon.type === "percent"
              ? Math.round((subtotal * coupon.value) / 100)
              : coupon.value;
          coupon.usedCount += 1;
          await coupon.save();
        }
      }
    }

    const total = Math.max(0, subtotal - discount);
    const order = await Order.create({
      orderId: generateOrderId(),
      customerName,
      phone,
      email,
      address,
      items,
      subtotal,
      discount,
      total,
      couponCode: couponCode || "",
      status: "pending",
      paymentStatus: "pending",
    });

    let customer = await Customer.findOne({ phone });
    if (!customer) {
      customer = await Customer.create({
        name: customerName,
        phone,
        email,
        addresses: address ? [address] : [],
      });
    } else {
      customer.orderCount += 1;
      customer.totalSpent += total;
      if (address) customer.addresses.push(address);
      await customer.save();
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id/pay", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: "paid", status: "confirmed" },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", authAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(filter),
    ]);
    res.json({ orders, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id/status", authAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
