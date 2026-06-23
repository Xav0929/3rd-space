import { NextRequest, NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs"; // sharp needs Node, not Edge

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file)
      return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const rawBuffer = Buffer.from(await file.arrayBuffer());

    let buffer: Buffer = rawBuffer;
    let contentType: string = file.type || "image/jpeg";
    let ext: string = file.name.split(".").pop()?.toLowerCase() || "jpg";

    try {
      // Dynamic import at request time. If sharp's native binary fails
      // to load for any reason, this throws here — inside our try/catch
      // — instead of crashing the whole module at import time.
      const sharp = (await import("sharp")).default;
      buffer = await sharp(rawBuffer)
        .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      contentType = "image/webp";
      ext = "webp";
    } catch (sharpErr) {
      // Fallback — upload the original file as-is. The client already
      // compresses large images before sending (see lib/compressImage.ts),
      // so this is a safe degradation, not a broken upload.
      console.error(
        "[/api/upload] sharp unavailable, uploading raw file:",
        sharpErr,
      );
    }

    const key = `menu/${uuidv4()}.${ext}`;
    await uploadToR2(key, buffer, contentType);
    const url = `https://cdn.3rdspace.shop/${key}`;

    return NextResponse.json({ url, key });
  } catch (err) {
    console.error("[/api/upload] failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 },
    );
  }
}
