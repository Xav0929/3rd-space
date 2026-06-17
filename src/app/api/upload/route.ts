import { NextRequest, NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file)
    return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const rawBuffer = Buffer.from(await file.arrayBuffer());

  let buffer: Buffer;
  let contentType: string;
  let ext: string;

  try {
    buffer = await sharp(rawBuffer)
      .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    contentType = "image/webp";
    ext = "webp";
  } catch {
    // Fallback — file isn't a processable image (e.g. already webp/gif), upload as-is
    buffer = rawBuffer;
    contentType = file.type || "image/jpeg";
    ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  }

  const key = `menu/${uuidv4()}.${ext}`;
  const url = await uploadToR2(key, buffer, contentType);

  return NextResponse.json({ url, key });
}
