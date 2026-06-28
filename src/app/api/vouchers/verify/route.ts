import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Redemption from "@/models/Redemption";

export async function POST(req: NextRequest) {
  await connectDB();
  const { code } = await req.json();

  if (!code?.trim()) {
    return NextResponse.json({ error: "Enter a code." }, { status: 400 });
  }

  const redemption = await Redemption.findOne({
    code: code.trim().toUpperCase(),
  });

  if (!redemption) {
    return NextResponse.json(
      { error: "Code not found. Invalid voucher." },
      { status: 404 },
    );
  }

  if (redemption.used) {
    return NextResponse.json(
      { error: "This voucher has already been used." },
      { status: 400 },
    );
  }

  // Just validate — do NOT mark as used here
  return NextResponse.json({
    success: true,
    type: redemption.type,
    customerName: redemption.customerName,
    code: redemption.code,
  });
}
