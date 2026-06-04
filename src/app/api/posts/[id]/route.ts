import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  await connectDB();
  await Post.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
