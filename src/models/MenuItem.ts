import mongoose, { Schema, model, models } from "mongoose";

const MenuItemSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, default: "" },
    available: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const MenuItem = models.MenuItem || model("MenuItem", MenuItemSchema);
