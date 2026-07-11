import mongoose from "mongoose";

const OthersPresetSchema = new mongoose.Schema(
  {
    amounts: { type: [Number], default: [] },
  },
  { timestamps: true },
);

export const OthersPreset =
  mongoose.models.OthersPreset ||
  mongoose.model("OthersPreset", OthersPresetSchema);
