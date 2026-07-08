// lib/models/Setting.ts
import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema({}, { strict: false });
export const Setting =
  mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
