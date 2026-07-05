import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { MenuItem } from "@/models/MenuItem";
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
    customerName,
    customerContact,
    deliveryAddress,
    deliveryAddressDetails,
    receiptUrl,
    receiptKey,
    gcashRef,
    tableNumber,
    paymentMethod,
    cashAmount,
    gcashAmount,
    notes,
    waiterName,
    source,
    deliveryFee,
    voucherCode,
    isTab,
  } = body;
  const total = body.total;

  if (!type || !items?.length || !total) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  // ── Server-side availability check ──────────────────────────────────
  // The customer's cart is built from a menu snapshot fetched on page
  // load. If an admin hides an item while they're mid-checkout, nothing
  // on the client re-validates that before hitting this endpoint — so
  // check current availability here, server-side, right before we'd
  // otherwise create the order.
  {
    const cartItemIds = items
      .map((i: any) => i.id || i.menuItemId)
      .filter((id: any) => id && !String(id).startsWith("hardcoded-"));

    if (cartItemIds.length > 0) {
      const currentMenuDocs = await MenuItem.find({
        _id: { $in: cartItemIds },
      }).lean();
      const availabilityById: Record<string, boolean> = Object.fromEntries(
        currentMenuDocs.map((m: any) => [String(m._id), m.available !== false]),
      );

      const unavailableNames: string[] = [];
      for (const it of items) {
        const itemId = it.id || it.menuItemId;
        if (!itemId || String(itemId).startsWith("hardcoded-")) continue;
        // Missing from availabilityById means the item was deleted entirely.
        const stillAvailable = availabilityById[String(itemId)];
        if (stillAvailable === false || stillAvailable === undefined) {
          unavailableNames.push(it.name);
        }
      }

      if (unavailableNames.length > 0) {
        return NextResponse.json(
          {
            error:
              unavailableNames.length === 1
                ? `"${unavailableNames[0]}" just sold out — remove it from your cart to continue.`
                : `These items just sold out: ${unavailableNames.join(", ")}. Remove them from your cart to continue.`,
            unavailableNames,
          },
          { status: 409 },
        );
      }
    }
  }

  // ── Server-side voucher validation ──────────────────────────────────
  // Never trust the client-computed total when a voucher is present.
  // Re-derive category info per item and recompute the discount ourselves.
  let serverVoucherType: "drink" | "food" | null = null;
  if (voucherCode?.trim()) {
    const redemption = await Redemption.findOne({
      code: voucherCode.trim().toUpperCase(),
      used: false,
    });
    if (!redemption) {
      return NextResponse.json(
        { error: "Voucher is invalid, already used, or not found." },
        { status: 400 },
      );
    }
    serverVoucherType = redemption.type;

    const DRINK_CATEGORY_KEYWORDS = [
      "3rd space",
      "coffee",
      "matcha",
      "tea",
      "non",
      "oat",
      "brain fuel",
      "flavored soda",
    ];
    const ids = items.map((i: any) => i.id || i.menuItemId).filter(Boolean);
    const menuDocs = await MenuItem.find({ _id: { $in: ids } }).lean();
    const categoryByMenuItemId: Record<string, string> = Object.fromEntries(
      menuDocs.map((m: any) => [String(m._id), m.category || ""]),
    );

    const isDrink = (cat: string) =>
      DRINK_CATEGORY_KEYWORDS.some((k) => cat.toLowerCase().includes(k));

    // Voucher applies to ONE unit of the cheapest eligible item only —
    // not the whole drink/food category. Find that single item here.
    let cheapestEligibleItem: any = null;
    for (const it of items) {
      const cat = categoryByMenuItemId[String(it.id || it.menuItemId)] || "";
      const matches =
        serverVoucherType === "drink" ? isDrink(cat) : !isDrink(cat);
      if (!matches) continue;
      if (!cheapestEligibleItem || it.price < cheapestEligibleItem.price) {
        cheapestEligibleItem = it;
      }
    }

    if (!cheapestEligibleItem) {
      return NextResponse.json(
        {
          error: `This is a ${serverVoucherType} voucher — your cart has no ${serverVoucherType} items.`,
        },
        { status: 400 },
      );
    }

    const pct = serverVoucherType === "drink" ? 0.1 : 0.05;
    const expectedDiscount =
      Math.round(cheapestEligibleItem.price * pct * 100) / 100;
    const rawSubtotal = items.reduce(
      (s: number, i: any) => s + i.price * i.quantity,
      0,
    );
    const expectedTotal =
      Math.max(0, rawSubtotal - expectedDiscount) + (deliveryFee || 0);

    // Overwrite whatever the client sent with the server-computed total.
    body.total = expectedTotal;
    body.voucherDiscount = expectedDiscount;
    body.voucherItemName = cheapestEligibleItem.name;
  }

  if (type === "delivery") {
    if (!customerName || !customerContact || !deliveryAddress) {
      return NextResponse.json(
        { error: "Missing delivery details" },
        { status: 400 },
      );
    }
    if (source !== "waiter" && source !== "crew" && !receiptUrl && !gcashRef) {
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
    cashAmount,
    gcashAmount,
    notes,
    waiterName,
    source,
    deliveryFee,
    voucherCode: voucherCode?.trim().toUpperCase() || undefined,
    voucherDiscount: body.voucherDiscount || undefined,
    voucherItemName: body.voucherItemName || undefined,
    isTab: isTab === true,
    shiftLabel: body.shiftLabel || null,
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
