import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema({
  key: String,
  open: Boolean,
  openedAt: { type: String, default: null },
  shiftDate: { type: String, default: null }, // ← NEW: the business-day key
});
const Setting =
  mongoose.models.Setting || mongoose.model("Setting", SettingSchema);

export async function GET() {
  try {
    await connectDB();
    const doc = await Setting.findOne({ key: "shopStatus" }).lean();
    return NextResponse.json({
      open: (doc as any)?.open ?? true,
      openedAt: (doc as any)?.openedAt ?? null,
      shiftDate: (doc as any)?.shiftDate ?? null, // ← NEW
    });
  } catch (e) {
    console.error("[shop-status GET]", e);
    return NextResponse.json({ open: true, openedAt: null, shiftDate: null });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { open, openedAt } = await req.json();

    const update: Record<string, any> = {
      open: !!open,
      openedAt: openedAt ?? null,
    };

    // Only stamp shiftDate when OPENING — never clear it here.
    // daily-close is responsible for clearing after it saves the report.
    if (open) {
      const now = new Date();
      update.shiftDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    }

    await Setting.findOneAndUpdate(
      { key: "shopStatus" },
      { $set: update },
      { upsert: true, new: true },
    );

    return NextResponse.json({ ok: true, shiftDate: update.shiftDate ?? null });
  } catch (e) {
    console.error("[shop-status POST]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
