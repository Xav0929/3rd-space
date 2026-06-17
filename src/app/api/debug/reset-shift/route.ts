import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

const Setting =
  mongoose.models.Setting ||
  mongoose.model(
    "Setting",
    new mongoose.Schema({
      key: String,
      open: Boolean,
      openedAt: { type: String, default: null },
      shiftDate: { type: String, default: null },
    }),
  );

export async function POST() {
  await connectDB();
  await Setting.findOneAndUpdate(
    { key: "shopStatus" },
    { $set: { open: false, openedAt: null, shiftDate: null } },
  );
  return NextResponse.json({ ok: true });
}
