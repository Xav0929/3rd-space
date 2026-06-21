import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MenuItem } from "@/models/MenuItem";
import mongoose from "mongoose";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    await connectDB();
    const body = await req.json();
    const allowed = [
      "name",
      "description",
      "price",
      "category",
      "image",
      "available",
      "variants",
      "options",
    ];
    const update: Record<string, any> = {};
    for (const key of allowed) {
      if (key in body) update[key] = body[key];
    }

    const item = await MenuItem.findByIdAndUpdate(id, update, { new: true }); // also: use `new` not `returnDocument`
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Menu PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 },
    );
  }
}
