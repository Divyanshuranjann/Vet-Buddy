import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Admin } from "../models/Admin.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { Coupon } from "../models/Coupon.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedData = JSON.parse(
  readFileSync(join(__dirname, "../data/seed-products.json"), "utf-8")
);

dotenv.config();

async function seed() {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || "admin@vetbuddy.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@123";
  const hash = await bcrypt.hash(password, 10);
  await Admin.findOneAndUpdate(
    { email },
    { email, passwordHash: hash, name: "Vet Buddy Admin" },
    { upsert: true }
  );
  console.log(`Admin: ${email}`);

  const categoryMap = {};
  for (const c of seedData.categories) {
    const cat = await Category.findOneAndUpdate(
      { slug: c.slug },
      { ...c, active: true },
      { upsert: true, new: true }
    );
    categoryMap[c.slug] = cat._id;
  }
  console.log(`Categories: ${seedData.categories.length}`);

  for (const p of seedData.products) {
    await Product.findOneAndUpdate(
      { slug: p.slug },
      {
        ...p,
        category: categoryMap[p.categorySlug],
        active: true,
      },
      { upsert: true, new: true }
    );
  }
  console.log(`Products: ${seedData.products.length}`);

  for (const c of seedData.coupons) {
    await Coupon.findOneAndUpdate({ code: c.code }, { ...c, active: true }, { upsert: true });
  }
  console.log("Seed complete");
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
