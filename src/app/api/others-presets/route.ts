import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { OthersPreset } from "@/models/OthersPreset";

// Single shared document for the whole store — everyone (admin dashboard,
// crew tab, any device) reads/writes the same "Others" quick-add list.
async function getDoc() {
  let doc = await OthersPreset.findOne();
  if (!doc) doc = await OthersPreset.create({ amounts: [] });
  return doc;
}

export async function GET() {
  await connectDB();
  const doc = await getDoc();
  return NextResponse.json({ amounts: doc.amounts });
}

export async function PUT(req: NextRequest) {
  await connectDB();
  const { amounts } = await req.json();
  if (!Array.isArray(amounts)) {
    return NextResponse.json(
      { error: "amounts must be an array" },
      { status: 400 },
    );
  }
  const doc = await getDoc();
  doc.amounts = amounts;
  await doc.save();
  return NextResponse.json({ amounts: doc.amounts });
}
