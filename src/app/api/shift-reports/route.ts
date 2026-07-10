import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import mongoose from "mongoose";

const ShiftReportSchema = new mongoose.Schema({}, { strict: false });
const ShiftReport =
  mongoose.models.ShiftReport ||
  mongoose.model("ShiftReport", ShiftReportSchema);

const SettingSchema = new mongoose.Schema({}, { strict: false });
const Setting =
  mongoose.models.Setting || mongoose.model("Setting", SettingSchema);

function dayKeyOf(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  // Optional ?dayKey=YYYY-MM-DD — defaults to today (Asia/Manila) when omitted,
  // so History can browse any past day, not just "today".
  const dayKey = searchParams.get("dayKey") || dayKeyOf(new Date());
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

  // A shift belongs to the day it OPENED, not the moment it happens to be
  // closed. Without this, a shift opened at 11pm and closed just after
  // midnight would get filed under the next day and vanish from the day
  // it actually ran on.
  const dayKey = dayKeyOf(new Date(openedAt));

  const windowEnd = closedAt ? new Date(closedAt) : new Date();
  const shiftOrders = await Order.find({
    createdAt: { $gte: new Date(openedAt), $lte: windowEnd },
    shiftReportId: null, // only orders not already claimed by a prior report
  });
  const completed = shiftOrders.filter((o: any) => o.status === "completed");
  const revenue = completed.reduce((s: number, o: any) => s + o.total, 0);
  const cashRev = completed.reduce((s: number, o: any) => {
    if (o.paymentMethod === "cash") return s + o.total;
    if (o.paymentMethod === "split") return s + (o.cashAmount ?? 0);
    return s;
  }, 0);
  const gcashRev = completed.reduce((s: number, o: any) => {
    if (o.paymentMethod === "gcash") return s + o.total;
    if (o.paymentMethod === "split") return s + (o.gcashAmount ?? 0);
    return s;
  }, 0);
  const cancelledCount = shiftOrders.filter(
    (o: any) => o.status === "cancelled",
  ).length;

  // Total discounts given away this shift — item-level discounts,
  // order-level discounts, and voucher discounts all count.
  const discountTotal = completed.reduce((s: number, o: any) => {
    const itemDiscounts = (o.items || []).reduce(
      (is: number, it: any) => is + (it.discountAmount || 0),
      0,
    );
    const orderDiscount = o.discountAmount || 0;
    const voucherDiscount = o.voucherDiscount || 0;
    return s + itemDiscounts + orderDiscount + voucherDiscount;
  }, 0);

  // Pull this shift's cash-in/cash-out log before we reset it
  const settingDoc = await Setting.findOne({ key: "shopStatus" }).lean();
  const paidInEntries = (settingDoc as any)?.paidIn ?? [];
  const paidOutEntries = (settingDoc as any)?.paidOut ?? [];
  const paidInTotal = paidInEntries.reduce(
    (s: number, e: any) => s + (e.amount || 0),
    0,
  );
  const paidOutTotal = paidOutEntries.reduce(
    (s: number, e: any) => s + (e.amount || 0),
    0,
  );

  const startingCash = bodyStartingCash || 0;
  const expectedCash = startingCash + cashRev + paidInTotal - paidOutTotal;
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

  // Idempotent write: a shift's openedAt is unique per shift (freshly
  // generated the moment that shift opens), so it's the natural dedupe key.
  // findOneAndUpdate + upsert is atomic at the MongoDB level — even if two
  // requests for the same shift land at the exact same millisecond (double
  // click, two tabs, a retried request), only ONE document is ever created.
  // $setOnInsert means: if a report for this openedAt already exists, don't
  // touch it — just hand back the existing one.
  const rawResult = await ShiftReport.collection.findOneAndUpdate(
    { openedAt },
    {
      $setOnInsert: {
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
        paidIn: paidInEntries,
        paidOut: paidOutEntries,
        paidInTotal,
        paidOutTotal,
        discountTotal,
      },
    },
    { upsert: true, returnDocument: "after", includeResultMetadata: true },
  );
  const report = rawResult?.value;
  const wasInsert = rawResult?.lastErrorObject?.upserted != null;

  if (!report) {
    // Should be unreachable (upsert:true guarantees a document back), but
    // keep TypeScript and runtime both honest if the driver ever returns
    // nothing.
    return NextResponse.json(
      { error: "Failed to create or fetch shift report" },
      { status: 500 },
    );
  }

  if (!wasInsert) {
    // A report for this exact shift (same openedAt) already exists — this
    // request was a duplicate (double click, retry, second tab, etc).
    // Return the existing report as-is and skip re-claiming orders /
    // resetting the cash log, since that already happened on the first call.
    return NextResponse.json(report);
  }

  // Mark these orders as claimed so they can never be double-counted
  // by a future shift report or backfill.
  await Order.updateMany(
    { _id: { $in: shiftOrders.map((o: any) => o._id) } },
    { $set: { shiftReportId: report._id } },
  );
  // Reset the cash log now that it's been captured on this shift's report —
  // the next shift should start with an empty log.
  await Setting.findOneAndUpdate(
    { key: "shopStatus" },
    { $set: { paidIn: [], paidOut: [] } },
    { upsert: true },
  );

  return NextResponse.json(report);
}
