import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema({ key: String, open: Boolean });
const Setting =
  mongoose.models.Setting || mongoose.model("Setting", SettingSchema);

export async function GET() {
  try {
    await connectDB();
    const doc = await Setting.findOne({ key: "shopStatus" }).lean();
    return NextResponse.json({ open: (doc as any)?.open ?? true });
  } catch (e) {
    console.error("[shop-status GET]", e);
    return NextResponse.json({ open: true });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { open } = await req.json();
    await Setting.findOneAndUpdate(
      { key: "shopStatus" },
      { $set: { open: !!open } },
      { upsert: true, new: true },
    );
    return NextResponse.json({ open: !!open });
  } catch (e) {
    console.error("[shop-status POST]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
