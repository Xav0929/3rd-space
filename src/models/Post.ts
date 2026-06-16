import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  tag: {
    type: String,
    enum: ["PROMO", "EVENT", "UPDATE", "PINNED"],
    required: true,
  },
  pinned: { type: Boolean, default: false },
  pinColor: { type: String, default: "gold" },
  date: { type: String },
  title: { type: String, required: true },
  body: { type: String, required: true },
  tilt: { type: Number, default: 0 },
  size: { type: String, enum: ["sm", "md", "lg"], default: "md" },
  image: { type: String, default: "" },
  link: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
