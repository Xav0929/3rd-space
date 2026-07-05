import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema({}, { strict: false });
const Setting =
  mongoose.models.Setting || mongoose.model("Setting", SettingSchema);

export async function POST(req: Request) {
  try {
    await connectDB();
    const { type, amount, note, loggedBy } = await req.json();

    if ((type !== "in" && type !== "out") || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid entry" }, { status: 400 });
    }

    const entry = {
      amount: Number(amount),
      note: note?.trim() || "",
      loggedBy: loggedBy?.trim() || "Unknown",
      at: new Date().toISOString(),
    };

    const field = type === "in" ? "paidIn" : "paidOut";

    const doc = await Setting.findOneAndUpdate(
      { key: "shopStatus" },
      { $push: { [field]: entry } },
      { upsert: true, new: true },
    ).lean();

    return NextResponse.json({
      ok: true,
      paidIn: (doc as any)?.paidIn ?? [],
      paidOut: (doc as any)?.paidOut ?? [],
    });
  } catch (e) {
    console.error("[cash-log POST]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    await Setting.findOneAndUpdate(
      { key: "shopStatus" },
      { $set: { paidIn: [], paidOut: [] } },
      { upsert: true },
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[cash-log DELETE]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const doc = await Setting.findOne({ key: "shopStatus" }).lean();
    return NextResponse.json({
      paidIn: (doc as any)?.paidIn ?? [],
      paidOut: (doc as any)?.paidOut ?? [],
    });
  } catch (e) {
    console.error("[cash-log GET]", e);
    return NextResponse.json({ paidIn: [], paidOut: [] });
  }
}
