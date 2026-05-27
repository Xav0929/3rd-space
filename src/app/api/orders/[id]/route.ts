import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteFromR2 } from "@/lib/r2";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const order = await Order.findById(params.id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();
  const order = await Order.findByIdAndUpdate(params.id, body, { new: true });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const order = await Order.findById(params.id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // delete receipt from R2 if exists
  if (order.receiptKey) {
    await deleteFromR2(order.receiptKey);
  }

  await order.deleteOne();
  return NextResponse.json({ success: true });
}
