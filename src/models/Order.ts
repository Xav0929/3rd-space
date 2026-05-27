import mongoose, { Schema, model, models } from "mongoose";

const OrderItemSchema = new Schema({
  menuItemId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ["delivery", "dine-in"], required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
    items: [OrderItemSchema],
    total: { type: Number, required: true },

    // delivery only
    customerName: { type: String },
    customerContact: { type: String },
    deliveryAddress: { type: String },
    receiptUrl: { type: String },
    receiptKey: { type: String },

    // dine-in only
    tableNumber: { type: String },

    // payment
    paymentStatus: {
      type: String,
      enum: ["pending", "confirmed"],
      default: "pending",
    },

    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

export const Order = models.Order || model("Order", OrderSchema);
