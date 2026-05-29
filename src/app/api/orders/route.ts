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
  await connectDB();

  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("orderNumber");

  // Public guest tracking by order number
  if (orderNumber) {
    const order = await Order.findOne({ orderNumber });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json([order]);
  }

  // ← FIXED: allow staff/waiter to fetch all orders without admin auth
  // Admin-only filters (status, type, date range) still work when passed
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
    gcashRef,
    tableNumber,
    paymentMethod,
    notes,
    waiterName, // ← FIXED: was missing
    source,
  } = body;

  // Basic validation
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
    // Waiter-placed orders skip receipt requirement; customer-facing orders need proof
    if (source !== "waiter" && !receiptUrl && !gcashRef) {
      return NextResponse.json(
        {
          error:
            "Payment proof required for delivery (screenshot or ref number)",
        },
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

  const normalizedItems = items.map((item: any) => ({
    menuItemId: item.id || item.menuItemId || undefined,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }));

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    type,
    items: normalizedItems,
    total,
    customerName,
    customerContact,
    deliveryAddress,
    receiptUrl,
    receiptKey,
    gcashRef,
    tableNumber,
    paymentMethod,
    notes,
    waiterName, // ← FIXED: now saved to DB
    source,
  });

  return NextResponse.json(order, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  // Allow status/payment updates without strict admin auth
  // (waiter needs to be able to confirm payment too)
  const { id, status, paymentStatus } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const update: any = {};
  if (status) update.status = status;
  if (paymentStatus) update.paymentStatus = paymentStatus;

  if (!Object.keys(update).length) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const order = await Order.findByIdAndUpdate(id, update, { new: true });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await Order.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
