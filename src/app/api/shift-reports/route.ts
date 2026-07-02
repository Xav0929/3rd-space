import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import mongoose from "mongoose";

const ShiftReportSchema = new mongoose.Schema({}, { strict: false });
const ShiftReport =
  mongoose.models.ShiftReport ||
  mongoose.model("ShiftReport", ShiftReportSchema);

export async function GET() {
  await connectDB();
  const today = new Date();
  const dayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const reports = await ShiftReport.find({ dayKey }).sort({ closedAt: 1 });
  return NextResponse.json(reports);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const {
    openedAt,
    closedAt,
    countedCash,
    shiftLabel,
    startingCash: bodyStartingCash,
    openedBy,
  } = body;

  const today = new Date();
  const dayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const windowEnd = closedAt ? new Date(closedAt) : new Date();
  const shiftOrders = await Order.find({
    createdAt: { $gte: new Date(openedAt), $lte: windowEnd },
  });
  const completed = shiftOrders.filter((o: any) => o.status === "completed");
  const revenue = completed.reduce((s: number, o: any) => s + o.total, 0);
  const cashRev = completed
    .filter((o: any) => o.paymentMethod === "cash")
    .reduce((s: number, o: any) => s + o.total, 0);
  const gcashRev = completed
    .filter((o: any) => o.paymentMethod === "gcash")
    .reduce((s: number, o: any) => s + o.total, 0);
  const cancelledCount = shiftOrders.filter(
    (o: any) => o.status === "cancelled",
  ).length;

  const startingCash = bodyStartingCash || 0;
  const expectedCash = startingCash + cashRev;
  const cashDiff =
    typeof countedCash === "number" ? countedCash - expectedCash : null;

  const items: Record<string, { qty: number; revenue: number }> = {};
  completed.forEach((o: any) => {
    o.items.forEach((it: any) => {
      if (!items[it.name]) items[it.name] = { qty: 0, revenue: 0 };
      items[it.name].qty += it.quantity;
      items[it.name].revenue += it.price * it.quantity;
    });
  });

  const report = await ShiftReport.create({
    dayKey,
    shiftLabel,
    openedBy: openedBy || null,
    openedAt,
    closedAt: closedAt || new Date().toISOString(),
    revenue,
    orderCount: completed.length,
    cancelledCount,
    cashRev,
    gcashRev,
    startingCash,
    countedCash: countedCash ?? null,
    expectedCash,
    cashDiff,
    items,
  });

  return NextResponse.json(report);
}
