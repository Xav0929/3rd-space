/**
 * migrate-images.ts
 * Fixes ALL image formats in one run:
 *   1. /menu/food/xxx.png      → reads from /public, uploads to R2
 *   2. https://3rdspace.shop/cdn/... → fetches from CDN, re-uploads to R2
 *   3. https://pub-xxx.r2.dev/...   → already correct, skipped
 *
 * HOW TO RUN:
 *   npx tsx scripts/migrate-images.ts
 */

import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// ── CONFIG ────────────────────────────────────────────────────────────────────

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = "3rd-space";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const R2_PUBLIC_URL = (
  process.env.R2_PUBLIC_URL ||
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
  ""
).replace(/\/$/, "");

// Your correct R2 public domain — images with this prefix are already good
const R2_DOMAIN = "r2.dev";

const PUBLIC_DIR = path.join(process.cwd(), "public");

// ── R2 CLIENT ─────────────────────────────────────────────────────────────────

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function uploadToR2(
  key: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );
  return `${R2_PUBLIC_URL}/${key}`;
}

async function compressImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(900, 900, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🔌 Connecting to MongoDB…");
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const col = db.collection("menuitems");

  // Get ALL items that have an image
  const items = await col
    .find({ image: { $exists: true, $nin: [null, ""] } })
    .toArray();

  console.log(`\n📦 Found ${items.length} total item(s) with images.\n`);

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of items) {
    const img = item.image as string;

    // ── Already correct R2 URL → skip ────────────────────────────────────────
    if (img.includes(R2_DOMAIN)) {
      console.log(`  ✓ SKIP  ${item.name} — already on R2`);
      skipped++;
      continue;
    }

    process.stdout.write(`  → ${item.name} … `);

    try {
      let raw: Buffer;

      if (img.startsWith("http")) {
        // ── Remote URL (old CDN, etc.) → fetch it ──────────────────────────
        const res = await fetch(img);
        if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${img}`);
        raw = Buffer.from(await res.arrayBuffer());
      } else {
        // ── Local path → read from /public ─────────────────────────────────
        const absPath = path.join(PUBLIC_DIR, img);
        if (!fs.existsSync(absPath)) {
          console.log(`⚠️  FILE NOT FOUND (${img}) — skipping`);
          failed++;
          continue;
        }
        raw = fs.readFileSync(absPath);
      }

      const compressed = await compressImage(raw);
      const key = `menu/${uuidv4()}.webp`;
      const url = await uploadToR2(key, compressed, "image/webp");

      await col.updateOne(
        { _id: item._id },
        { $set: { image: url, updatedAt: new Date() } },
      );

      console.log(`✓  ${url}`);
      success++;
    } catch (err) {
      console.log(`✗  ERROR: ${err}`);
      failed++;
    }
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Migrated : ${success}
⏭  Skipped  : ${skipped}  (already on R2)
❌ Failed   : ${failed}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

  await client.close();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
