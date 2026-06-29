import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema({}, { strict: false });
const Setting =
  mongoose.models.Setting || mongoose.model("Setting", SettingSchema);

export async function GET() {
  try {
    await connectDB();
    const doc = await Setting.findOne({ key: "shopStatus" }).lean();
    return NextResponse.json({
      open: (doc as any)?.open ?? true,
      openedAt: (doc as any)?.openedAt ?? null,
      shiftDate: (doc as any)?.shiftDate ?? null,
      shiftLabel: (doc as any)?.shiftLabel ?? "Shift 1",
      startingCash: (doc as any)?.startingCash ?? null,
      paidIn: (doc as any)?.paidIn ?? [],
      paidOut: (doc as any)?.paidOut ?? [],
    });
  } catch (e) {
    console.error("[shop-status GET]", e);
    return NextResponse.json({
      open: true,
      openedAt: null,
      shiftDate: null,
      startingCash: null,
      paidIn: [],
      paidOut: [],
    });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { open, openedAt, startingCash, shiftLabel } = await req.json();

    const update: Record<string, any> = {
      open: !!open,
      openedAt: openedAt ?? null,
    };

    // Only stamp shiftDate + reset cash tracking when OPENING.
    // daily-close is responsible for clearing after it saves the report.
    if (open) {
      const now = new Date();
      update.shiftDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      update.startingCash = typeof startingCash === "number" ? startingCash : 0;
      update.shiftLabel = shiftLabel || "Shift 1";
      update.paidIn = [];
      update.paidOut = [];
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
