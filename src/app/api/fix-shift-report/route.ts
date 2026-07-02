import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import mongoose from "mongoose";

const ShiftReportSchema = new mongoose.Schema({}, { strict: false });
const ShiftReport =
  mongoose.models.ShiftReport ||
  mongoose.model("ShiftReport", ShiftReportSchema);

export async function GET() {
  await connectDB();

  // Find the bad France shift report (the ₱865 one)
  const badReport = await ShiftReport.findOne({
    dayKey: "2026-07-02",
    revenue: 865,
  });

  if (!badReport) {
    return NextResponse.json({
      error: "Bad report not found — already fixed?",
    });
  }

  const openedAt = new Date(badReport.openedAt);
  const closedAt = new Date(badReport.closedAt);

  const orders = await Order.find({
    createdAt: { $gte: openedAt, $lte: closedAt },
  });

  const completed = orders.filter((o: any) => o.status === "completed");
  const revenue = completed.reduce((s: number, o: any) => s + o.total, 0);
  const cashRev = completed
    .filter((o: any) => o.paymentMethod === "cash")
    .reduce((s: number, o: any) => s + o.total, 0);
  const gcashRev = completed
    .filter((o: any) => o.paymentMethod === "gcash")
    .reduce((s: number, o: any) => s + o.total, 0);

  const items: Record<string, { qty: number; revenue: number }> = {};
  completed.forEach((o: any) => {
    o.items.forEach((it: any) => {
      if (!items[it.name]) items[it.name] = { qty: 0, revenue: 0 };
      items[it.name].qty += it.quantity;
      items[it.name].revenue += it.price * it.quantity;
    });
  });

  const startingCash = badReport.startingCash || 0;
  const expectedCash = startingCash + cashRev;

  await ShiftReport.updateOne(
    { _id: badReport._id },
    {
      $set: {
        revenue,
        orderCount: completed.length,
        cashRev,
        gcashRev,
        items,
        expectedCash,
      },
    },
  );

  return NextResponse.json({
    ok: true,
    before: { revenue: 865, orderCount: badReport.orderCount },
    after: { revenue, orderCount: completed.length, cashRev, gcashRev },
  });
}
