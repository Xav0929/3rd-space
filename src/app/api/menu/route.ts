import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MenuItem } from "@/models/MenuItem";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const items = await MenuItem.find().sort({ category: 1, createdAt: 1 });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();
  const item = await MenuItem.create(body);
  return NextResponse.json(item, { status: 201 });
}
