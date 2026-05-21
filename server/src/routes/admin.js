import { Router } from "express";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { Customer } from "../models/Customer.js";
import { Coupon } from "../models/Coupon.js";
import { Review } from "../models/Review.js";
import { Category } from "../models/Category.js";
import { authAdmin } from "../middleware/auth.js";

const router = Router();
router.use(authAdmin);

router.get("/dashboard", async (_req, res) => {
  try {
    const [productCount, orderCount, customerCount, pendingOrders, revenue] =
      await Promise.all([
        Product.countDocuments({ active: true }),
        Order.countDocuments(),
        Customer.countDocuments(),
        Order.countDocuments({ status: "pending" }),
        Order.aggregate([
          { $match: { paymentStatus: "paid" } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
      ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .select("orderId customerName total status paymentStatus createdAt");

    res.json({
      stats: {
        products: productCount,
        orders: orderCount,
        customers: customerCount,
        pendingOrders,
        revenue: revenue[0]?.total || 0,
      },
      recentOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/customers", async (_req, res) => {
  const customers = await Customer.find().sort({ createdAt: -1 }).limit(100);
  res.json(customers);
});

router.get("/coupons", async (_req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(coupons);
});

router.post("/coupons", async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(coupon);
});

router.put("/coupons/:id", async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(coupon);
});

router.get("/reviews", async (_req, res) => {
  const reviews = await Review.find().populate("productId", "name").sort({ createdAt: -1 });
  res.json(reviews);
});

router.patch("/reviews/:id", async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { approved: req.body.approved },
    { new: true }
  );
  res.json(review);
});

router.get("/payments", async (_req, res) => {
  const orders = await Order.find({ paymentStatus: { $in: ["paid", "pending"] } })
    .sort({ createdAt: -1 })
    .limit(50)
    .select("orderId total paymentStatus paymentMethod customerName createdAt");
  res.json(orders);
});

export default router;
