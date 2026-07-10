import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { deleteFromR2 } from "@/lib/r2";
import { notifyClients } from "@/lib/sse";

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

    // ── Per-item discount apply/remove ──────────────────────────────
    // body: { itemDiscount: { itemIndex, discountName, discountPct } }
    // or:   { itemDiscount: { itemIndex, remove: true } }
    if (body.itemDiscount) {
      const { itemIndex, discountName, discountPct, remove } =
        body.itemDiscount;
      const order = await Order.findById(id);
      if (!order)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

      const item = order.items[itemIndex];
      if (!item)
        return NextResponse.json(
          { error: "Item not found on order" },
          { status: 400 },
        );

      if (remove) {
        item.discountName = undefined;
        item.discountPct = undefined;
        item.discountAmount = undefined;
      } else {
        const lineTotal = item.price * item.quantity;
        const amount = Math.round(lineTotal * discountPct) / 100;
        item.discountName = discountName;
        item.discountPct = discountPct;
        item.discountAmount = amount;
      }

      // Recompute order total from all line items minus their own discounts,
      // plus delivery fee if present.
      const itemsTotal = order.items.reduce((sum: number, it: any) => {
        const line = it.price * it.quantity;
        return sum + (line - (it.discountAmount || 0));
      }, 0);
      order.total = itemsTotal + (order.deliveryFee || 0);
      order.markModified("items");
      await order.save();
      notifyClients();
      return NextResponse.json(order);
    }

    // Auto-stamp when status or paymentStatus changes
    const stampUpdate: any = { ...body };
    if (body.status) {
      const statusStamps: Record<string, string> = {
        confirmed: "confirmedAt",
        preparing: "preparingAt",
        ready: "readyAt",
        completed: "completedAt",
        cancelled: "cancelledAt",
      };
      const field = statusStamps[body.status];
      if (field) stampUpdate[field] = new Date();
    }
    if (body.paymentStatus === "confirmed") {
      stampUpdate.paidAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(id, stampUpdate, {
      new: true,
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
