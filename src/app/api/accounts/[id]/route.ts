import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { password } = await req.json();
    if (!password?.trim())
      return NextResponse.json({ error: "Password required" }, { status: 400 });

    await connectDB();
    const db = mongoose.connection.db!;
    const hashed = await bcrypt.hash(password, 10);
    await db
      .collection("accounts")
      .updateOne({ _id: new ObjectId(id) }, { $set: { passwordHash: hashed } });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("PATCH /api/accounts/[id]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();
    const db = mongoose.connection.db!;
    await db.collection("accounts").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ deleted: true });
  } catch (e) {
    console.error("DELETE /api/accounts/[id]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
