import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import mongoose from "mongoose";

const DailyReportSchema = new mongoose.Schema({}, { strict: false });
const DailyReport =
  mongoose.models.DailyReport ||
  mongoose.model("DailyReport", DailyReportSchema);

const SettingSchema = new mongoose.Schema({
  key: String,
  open: Boolean,
  openedAt: { type: String, default: null },
  shiftDate: { type: String, default: null },
});
const Setting =
  mongoose.models.Setting || mongoose.model("Setting", SettingSchema);

function calendarKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { openedAt } = await req.json();
    const now = new Date();

    // ── Resolve the shift key ───────────────────────────────────────────────
    // Use the shiftDate stamped when the owner opened the shop.
    // Falls back to calendar date only if somehow shiftDate was never set.
    const shopDoc = await Setting.findOne({ key: "shopStatus" }).lean();

    // Use shiftDate if available, otherwise fall back to today's calendar key
    const dayKey = (shopDoc as any)?.shiftDate ?? calendarKey(now);

    // Check if a report already exists for this business day
    const existingReport = await DailyReport.findOne({ dayKey }).lean();

    // ── Pull all unarchived orders that belong to this shift ────────────────
    const shiftOrders = await Order.find({
      archived: { $ne: true },
      shiftDate: dayKey, // only orders tagged to this shift
    }).lean();

    // Legacy orders only on first-ever close (no existing report yet)
    const legacyOrders = !(existingReport as any)
      ? await Order.find({
          archived: { $ne: true },
          shiftDate: { $exists: false },
        }).lean()
      : [];

    const allOrders = [...shiftOrders, ...legacyOrders];

    // ── Aggregate ───────────────────────────────────────────────────────────
    const completed = allOrders.filter((o: any) => o.status === "completed");
    const cancelled = allOrders.filter((o: any) => o.status === "cancelled");
    const revenue = completed.reduce((s: number, o: any) => s + o.total, 0);
    const deliveryFees = completed
      .filter((o: any) => o.type === "delivery")
      .reduce((s: number, o: any) => s + (o.deliveryFee || 0), 0);

    const items: Record<string, { qty: number; revenue: number }> = {};
    completed.forEach((o: any) => {
      o.items?.forEach((it: any) => {
        if (!items[it.name]) items[it.name] = { qty: 0, revenue: 0 };
        items[it.name].qty += it.quantity;
        items[it.name].revenue += it.price * it.quantity;
      });
    });

    const cashRev = completed
      .filter((o: any) => o.paymentMethod === "cash")
      .reduce((s: number, o: any) => s + o.total, 0);
    const gcashRev = completed
      .filter((o: any) => o.paymentMethod === "gcash")
      .reduce((s: number, o: any) => s + o.total, 0);
    const dineInRev = completed
      .filter((o: any) => o.type === "dine-in")
      .reduce((s: number, o: any) => s + o.total, 0);
    const deliveryRev = completed
      .filter((o: any) => o.type === "delivery")
      .reduce((s: number, o: any) => s + o.total, 0);
    const takeoutRev = completed
      .filter((o: any) => o.type === "takeout")
      .reduce((s: number, o: any) => s + o.total, 0);

    const report = {
      dayKey, // ← business-day key, not calendar
      date: now.toISOString(),
      openedAt: (existingReport as any)?.openedAt || openedAt || null,
      closedAt: now.toISOString(),
      revenue,
      netRevenue: revenue - deliveryFees,
      deliveryFees,
      orderCount: completed.length,
      cancelledCount: cancelled.length,
      totalOrders: allOrders.length,
      avgOrder: completed.length ? revenue / completed.length : 0,
      cashRev,
      gcashRev,
      dineInRev,
      deliveryRev,
      takeoutRev,
      items,
      orders: JSON.parse(JSON.stringify(allOrders)),
    };

    await DailyReport.findOneAndUpdate(
      { dayKey },
      { $set: report },
      { upsert: true, new: true },
    );

    // Archive every order that was part of this shift
    const idsToArchive = allOrders.map((o: any) => o._id);
    await Order.updateMany(
      { _id: { $in: idsToArchive } },
      { $set: { archived: true, archivedAt: now.toISOString() } },
    );

    // ── Clear shiftDate so the next open stamps a fresh one ─────────────────
    await Setting.findOneAndUpdate(
      { key: "shopStatus" },
      { $set: { shiftDate: null } },
    );

    return NextResponse.json({ ok: true, report });
  } catch (e) {
    console.error("[daily-close POST]", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const reports = await DailyReport.find({})
      .sort({ dayKey: -1 })
      .limit(400)
      .lean();
    return NextResponse.json(
      reports.map((r: any) => ({ ...r, _id: r._id.toString() })),
    );
  } catch (e) {
    console.error("[daily-close GET]", e);
    return NextResponse.json([]);
  }
}
