import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function POST() {
  await connectDB();
  const db = mongoose.connection.db!;

  await db.collection("orders").deleteMany({});
  await db.collection("dailyreports").deleteMany({});
  await db.collection("shiftreports").deleteMany({});
  await db.collection("settings").deleteMany({ key: "shopStatus" });
  await db.collection("redemptions").deleteMany({});

  return NextResponse.json({ ok: true });
}
