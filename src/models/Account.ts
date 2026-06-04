import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["admin", "staff"], default: "staff" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Account ||
  mongoose.model("Account", AccountSchema);
