import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { isAdminAuthenticated } from "@/lib/auth";

function generateOrderNumber() {
  const date = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const datePart = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `3S-${datePart}-${random}`;
}

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const query: any = {};
  if (status) query.status = status;
  if (type) query.type = type;
  if (from || to) {
    query.createdAt = {};
    if (from) query.createdAt.$gte = new Date(from);
    if (to) query.createdAt.$lte = new Date(to);
  }

  const orders = await Order.find(query).sort({ createdAt: -1 });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  const {
    type,
    items,
    total,
    customerName,
    customerContact,
    deliveryAddress,
    receiptUrl,
    receiptKey,
    tableNumber,
    notes,
  } = body;

  // validations
  if (!type || !items?.length || !total) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  if (type === "delivery") {
    if (!customerName || !customerContact || !deliveryAddress) {
      return NextResponse.json(
        { error: "Missing delivery details" },
        { status: 400 },
      );
    }
    if (!receiptUrl) {
      return NextResponse.json(
        { error: "Payment receipt required for delivery" },
        { status: 400 },
      );
    }
  }

  if (type === "dine-in" && !tableNumber) {
    return NextResponse.json(
      { error: "Table number required for dine-in" },
      { status: 400 },
    );
  }

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    type,
    items,
    total,
    customerName,
    customerContact,
    deliveryAddress,
    receiptUrl,
    receiptKey,
    tableNumber,
    notes,
  });

  return NextResponse.json(order, { status: 201 });
}
