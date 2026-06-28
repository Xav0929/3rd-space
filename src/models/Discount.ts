import mongoose, { Schema, model, models } from "mongoose";

const DiscountSchema = new Schema(
  {
    name: { type: String, required: true },
    percentage: { type: Number, required: true, min: 1, max: 100 },
  },
  { timestamps: true },
);

export const Discount = models.Discount || model("Discount", DiscountSchema);
