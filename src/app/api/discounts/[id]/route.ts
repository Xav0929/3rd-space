import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Discount } from "@/models/Discount";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const discount = await Discount.findByIdAndUpdate(id, body, { new: true });
  if (!discount)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(discount);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;
  await Discount.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
