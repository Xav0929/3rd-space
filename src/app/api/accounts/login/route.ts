import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    await connectDB();
    const db = mongoose.connection.db!;
    const account = await db
      .collection("accounts")
      .findOne({ username: username.trim().toLowerCase() });

    if (!account)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );

    const valid = await bcrypt.compare(password, account.passwordHash);
    if (!valid)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );

    return NextResponse.json({
      role: account.role,
      displayName: account.displayName,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
