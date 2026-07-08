// app/api/debug/backfill-daryl-shift/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { ShiftReport } from "@/lib/models/ShiftReport";

// ONE-TIME USE: reconstructs Daryl's missing shift report for July 8 from
// the 19 orders that were placed before France's shift opened (5:15 PM
// Manila / 09:15 UTC) but never got a ShiftReport of their own. Delete this
// file after running it once.
export async function POST() {
  await connectDB();

  const dayKey = "2026-07-08";
  const windowStart = new Date("2026-07-08T00:00:00.000Z");
  const windowEnd = new Date("2026-07-08T09:15:00.000Z"); // right before France opened

  const orders = await Order.find({
    shiftDate: dayKey,
    createdAt: { $gte: windowStart, $lt: windowEnd },
  }).lean();

  if (orders.length === 0) {
    return NextResponse.json({
      ok: false,
      message: "No orders found in that window — nothing to backfill.",
    });
  }

  const completed = orders.filter((o: any) => o.status === "completed");
  const cancelled = orders.filter((o: any) => o.status === "cancelled");

  const revenue = completed.reduce((s: number, o: any) => s + o.total, 0);
  const cashRev = completed
    .filter((o: any) => o.paymentMethod === "cash")
    .reduce((s: number, o: any) => s + o.total, 0);
  const gcashRev = completed
    .filter((o: any) => o.paymentMethod === "gcash")
    .reduce((s: number, o: any) => s + o.total, 0);

  const discountTotal = completed.reduce((s: number, o: any) => {
    const itemDiscounts = (o.items || []).reduce(
      (is: number, it: any) => is + (it.discountAmount || 0),
      0,
    );
    return (
      s + itemDiscounts + (o.discountAmount || 0) + (o.voucherDiscount || 0)
    );
  }, 0);

  const items: Record<string, { qty: number; revenue: number }> = {};
  completed.forEach((o: any) => {
    o.items.forEach((it: any) => {
      if (!items[it.name]) items[it.name] = { qty: 0, revenue: 0 };
      items[it.name].qty += it.quantity;
      items[it.name].revenue += it.price * it.quantity;
    });
  });

  const openedAt = orders.map((o: any) => o.createdAt).sort()[0];
  const closedAt = orders
    .map((o: any) => o.completedAt || o.createdAt)
    .sort()
    .reverse()[0];

  const report = await ShiftReport.create({
    dayKey,
    shiftLabel: "Daryl",
    openedBy: "Daryl",
    openedAt,
    closedAt,
    revenue,
    orderCount: completed.length,
    cancelledCount: cancelled.length,
    cashRev,
    gcashRev,
    startingCash: 0,
    countedCash: null,
    expectedCash: cashRev,
    cashDiff: null,
    items,
    paidIn: [],
    paidOut: [],
    paidInTotal: 0,
    paidOutTotal: 0,
    discountTotal,
  });

  return NextResponse.json({
    ok: true,
    ordersFound: orders.length,
    totalRevenue: revenue,
    report,
  });
}

// Deletes any "Test" shift report(s) filed today so they don't clutter
// Shift Comparison alongside the real Daryl/France shifts.
export async function DELETE() {
  await connectDB();
  const result = await ShiftReport.deleteMany({
    dayKey: "2026-07-08",
    shiftLabel: { $regex: /^test$/i },
  });
  return NextResponse.json({ ok: true, deletedCount: result.deletedCount });
}
