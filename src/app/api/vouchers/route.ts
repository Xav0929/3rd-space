import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Redemption from "@/models/Redemption";

const MAX_PER_DAY = 5;

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function generateCode(type: string): string {
  const prefix = type === "drink" ? "DRK" : "FD";
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++)
    suffix += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${suffix}`;
}

export async function GET() {
  await connectDB();
  const today = getToday();
  const [drinkCount, foodCount, todayRedemptions, allRedemptions] =
    await Promise.all([
      Redemption.countDocuments({ type: "drink", date: today }),
      Redemption.countDocuments({ type: "food", date: today }),
      Redemption.find({ date: today }).sort({ redeemedAt: -1 }),
      Redemption.find({ date: today }).sort({ redeemedAt: -1 }),
    ]);
  return NextResponse.json({
    drinkRemaining: MAX_PER_DAY - drinkCount,
    foodRemaining: MAX_PER_DAY - foodCount,
    drinkTotal: MAX_PER_DAY,
    foodTotal: MAX_PER_DAY,
    todayRedemptions,
    allCodes: allRedemptions,
  });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const { type, customerName } = await req.json();
  const today = getToday();

  if (!type || !["drink", "food"].includes(type)) {
    return NextResponse.json(
      { error: "Invalid voucher type." },
      { status: 400 },
    );
  }

  if (!customerName?.trim()) {
    return NextResponse.json(
      { error: "Please enter your name." },
      { status: 400 },
    );
  }

  const normalizedName = customerName.trim().toLowerCase();

  // Check by name + type (allows same person to claim one drink AND one food)
  const alreadyClaimed = await Redemption.findOne({
    date: today,
    type,
    customerName: { $regex: new RegExp(`^${normalizedName}$`, "i") },
  });

  if (alreadyClaimed) {
    return NextResponse.json(
      {
        error: `You've already claimed a ${type} voucher today. Come back tomorrow!`,
      },
      { status: 400 },
    );
  }

  const count = await Redemption.countDocuments({ type, date: today });
  if (count >= MAX_PER_DAY) {
    return NextResponse.json(
      {
        error: `All ${MAX_PER_DAY} ${type} vouchers for today have been claimed. Check back tomorrow!`,
      },
      { status: 400 },
    );
  }

  const code = generateCode(type);
  const redemption = await Redemption.create({
    type,
    date: today,
    customerName: customerName.trim(),
    code,
    redeemedAt: new Date(),
  });

  return NextResponse.json({
    success: true,
    type,
    code,
    customerName: customerName.trim(),
    redemptionId: redemption._id,
    message:
      type === "drink"
        ? `✓ 10% drink voucher claimed, ${customerName.trim()}!`
        : `✓ 5% food voucher claimed, ${customerName.trim()}!`,
  });
}
