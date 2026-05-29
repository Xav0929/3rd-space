import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { deleteFromR2 } from "@/lib/r2";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await connectDB();
  const order = await Order.findById(id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();
    const order = await Order.findByIdAndUpdate(id, body, {
      returnDocument: "after",
    });
    if (!order)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch (e) {
    console.error("PATCH /api/orders/[id]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();
    const order = await Order.findById(id);
    if (!order)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (order.receiptKey) await deleteFromR2(order.receiptKey);
    await order.deleteOne();
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("DELETE /api/orders/[id]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
