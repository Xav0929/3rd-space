// app/api/debug/fix-daryl-final/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ShiftReport } from "@/lib/models/ShiftReport";

export async function POST() {
  await connectDB();

  const report = await ShiftReport.findOne({
    dayKey: "2026-07-08",
    shiftLabel: "Daryl",
  });

  if (!report) {
    return NextResponse.json({
      ok: false,
      message: "Daryl's report not found",
    });
  }

  const startingCash = 739;
  const cashRev = 3789;
  const paidInTotal = 0;
  const paidOutTotal = 1550;
  const countedCash = 2978;
  const expectedCash = startingCash + cashRev + paidInTotal - paidOutTotal;

  report.startingCash = startingCash;
  report.cashRev = cashRev;
  report.paidInTotal = paidInTotal;
  report.paidOutTotal = paidOutTotal;
  report.countedCash = countedCash;
  report.expectedCash = expectedCash;
  report.cashDiff = countedCash - expectedCash;
  await report.save();

  return NextResponse.json({ ok: true, report });
}
