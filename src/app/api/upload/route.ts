import { NextRequest, NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file)
    return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const raw = Buffer.from(await file.arrayBuffer());
  const compressed = await sharp(raw)
    .resize(900, 900, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const key = `menu/${uuidv4()}.webp`;
  const url = await uploadToR2(key, compressed, "image/webp");
  return NextResponse.json({ url, key });
}
