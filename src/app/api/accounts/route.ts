import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();
    const db = mongoose.connection.db!;
    const accounts = await db
      .collection("accounts")
      .find({}, { projection: { passwordHash: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(
      accounts.map((a) => ({ ...a, _id: a._id.toString() })),
    );
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { username, displayName, password, role } = await req.json();
    if (!username || !displayName || !password || !role)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    await connectDB();
    const db = mongoose.connection.db!;

    const existing = await db
      .collection("accounts")
      .findOne({ username: username.trim().toLowerCase() });
    if (existing)
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 },
      );

    const passwordHash = await bcrypt.hash(password, 12);
    const doc = {
      username: username.trim().toLowerCase(),
      displayName: displayName.trim(),
      role,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    const result = await db.collection("accounts").insertOne(doc);
    return NextResponse.json({
      _id: result.insertedId.toString(),
      username: doc.username,
      displayName: doc.displayName,
      role: doc.role,
      createdAt: doc.createdAt,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
