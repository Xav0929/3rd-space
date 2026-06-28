import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Discount } from "@/models/Discount";

export async function GET() {
  await connectDB();
  const discounts = await Discount.find().sort({ createdAt: 1 });
  return NextResponse.json(discounts);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const { name, percentage } = await req.json();
  if (!name || !percentage)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const discount = await Discount.create({ name, percentage });
  return NextResponse.json(discount, { status: 201 });
}
