import mongoose from "mongoose";

const RedemptionSchema = new mongoose.Schema({
  type: { type: String, enum: ["drink", "food"], required: true },
  date: { type: String, required: true },
  customerName: { type: String, default: "" },
  ip: { type: String, default: "" },
  code: { type: String, default: "" },
  used: { type: Boolean, default: false },
  redeemedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Redemption ||
  mongoose.model("Redemption", RedemptionSchema);
