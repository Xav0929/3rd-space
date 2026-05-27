import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteFromR2 } from "@/lib/r2";

export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const { searchParams } = new URL(req.url);
  const olderThanDays = parseInt(searchParams.get("days") || "30");

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - olderThanDays);

  const oldOrders = await Order.find({
    createdAt: { $lte: cutoff },
    status: { $in: ["completed", "cancelled"] },
  });

  // delete all receipts from R2
  await Promise.all(
    oldOrders
      .filter((o) => o.receiptKey)
      .map((o) => deleteFromR2(o.receiptKey)),
  );

  const result = await Order.deleteMany({
    createdAt: { $lte: cutoff },
    status: { $in: ["completed", "cancelled"] },
  });

  return NextResponse.json({ deleted: result.deletedCount });
}
