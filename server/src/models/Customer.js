import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    email: { type: String, default: "" },
    addresses: [
      {
        line1: String,
        line2: String,
        city: String,
        state: String,
        pincode: String,
      },
    ],
    orderCount: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Customer = mongoose.model("Customer", customerSchema);
