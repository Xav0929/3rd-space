import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { notifyClients } from "@/lib/sse";
import Redemption from "@/models/Redemption";

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

  if (orderNumber) {
    const order = await Order.findOne({ orderNumber });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json([order]);
  }

  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const query: any = { archived: { $ne: true } };
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

  const { default: mongoose } = await import("mongoose");
  const Setting =
    mongoose.models.Setting ||
    mongoose.model(
      "Setting",
      new mongoose.Schema({
        key: String,
        open: Boolean,
        openedAt: { type: String, default: null },
        shiftDate: { type: String, default: null },
      }),
    );
  const shopDoc = await Setting.findOne({ key: "shopStatus" }).lean();

  if (body.source !== "crew") {
    if (shopDoc && (shopDoc as any).open === false) {
      return NextResponse.json(
        { error: "Ordering is currently paused." },
        { status: 503 },
      );
    }
  }

  const shiftDate =
    (shopDoc as any)?.shiftDate ??
    (() => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    })();

  const {
    type,
    items,
    total,
    customerName,
    customerContact,
    deliveryAddress,
    deliveryAddressDetails,
    receiptUrl,
    receiptKey,
    gcashRef,
    tableNumber,
    paymentMethod,
    notes,
    waiterName,
    source,
    deliveryFee,
    voucherCode,
  } = body;

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

  if (type === "dine-in" && !tableNumber && !customerName) {
    return NextResponse.json(
      { error: "Table number or customer name required for dine-in" },
      { status: 400 },
    );
  }

  const normalizedItems = items.map((item: any) => ({
    menuItemId: item.id || item.menuItemId || undefined,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    customizations: Array.isArray(item.customizations)
      ? item.customizations
      : [],
  }));

  if (type === "delivery") {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentCount = await Order.countDocuments({
      type: "delivery",
      createdAt: { $gte: tenMinutesAgo },
      customerContact: body.customerContact,
    });

    if (recentCount >= 3) {
      return NextResponse.json(
        {
          error:
            "Too many orders placed recently. Please wait a few minutes before trying again.",
        },
        { status: 429 },
      );
    }
  }

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    type,
    shiftDate,
    items: normalizedItems,
    total,
    customerName,
    customerContact,
    deliveryAddress,
    deliveryAddressDetails,
    receiptUrl,
    receiptKey,
    gcashRef,
    tableNumber,
    paymentMethod,
    notes,
    waiterName,
    source,
    deliveryFee,
    voucherCode: voucherCode?.trim().toUpperCase() || undefined,
  });

  // Burn the voucher only now that the order is confirmed
  if (voucherCode?.trim()) {
    await Redemption.updateOne(
      { code: voucherCode.trim().toUpperCase(), used: false },
      { $set: { used: true, usedAt: new Date(), orderId: order._id } },
    );
  }

  notifyClients();

  return NextResponse.json(order, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  const { id, status, paymentStatus } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const update: any = {};
  if (status) update.status = status;
  if (paymentStatus) update.paymentStatus = paymentStatus;
  if (body.cancelReason) update.cancelReason = body.cancelReason;
  if (body.paymentMethod) update.paymentMethod = body.paymentMethod;

  if (!Object.keys(update).length) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const order = await Order.findByIdAndUpdate(id, update, { new: true });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  notifyClients();

  return NextResponse.json(order);
}

export async function DELETE(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await Order.findByIdAndDelete(id);
  notifyClients();
  return NextResponse.json({ success: true });
}
