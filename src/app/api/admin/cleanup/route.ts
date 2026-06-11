import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import {
  S3Client,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("key") !== process.env.USAGE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { days, dryRun = false } = (await req.json()) as {
    days: number;
    dryRun?: boolean;
  };
  if (!days || typeof days !== "number" || days < 1) {
    return NextResponse.json({ error: "Invalid days value" }, { status: 400 });
  }

  await connectDB();
  const db = mongoose.connection.db!;

  const cutoff = new Date(Date.now() - days * 86_400_000);

  type OrderDoc = { _id: mongoose.Types.ObjectId; receiptKey?: string };

  const targets = (await db
    .collection("orders")
    .find(
      {
        createdAt: { $lt: cutoff },
        status: { $in: ["completed", "cancelled"] },
      },
      { projection: { _id: 1, receiptKey: 1 } },
    )
    .toArray()) as OrderDoc[];

  if (dryRun) {
    return NextResponse.json({ count: targets.length, dryRun: true });
  }

  // Delete R2 receipt files in batches of 1000
  const keys = targets
    .map((o) => o.receiptKey)
    .filter((k): k is string => Boolean(k))
    .map((k) => ({ Key: k }));

  let r2Deleted = 0;
  for (let i = 0; i < keys.length; i += 1000) {
    const batch = keys.slice(i, i + 1000);
    if (batch.length === 1) {
      await r2
        .send(
          new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: batch[0].Key,
          }),
        )
        .catch(() => {});
    } else if (batch.length > 1) {
      await r2
        .send(
          new DeleteObjectsCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Delete: { Objects: batch },
          }),
        )
        .catch(() => {});
    }
    r2Deleted += batch.length;
  }

  const ids = targets.map((o) => o._id as mongoose.Types.ObjectId);
  const result = await db
    .collection("orders")
    .deleteMany({ _id: { $in: ids } });

  return NextResponse.json({
    deleted: result.deletedCount,
    r2FilesDeleted: r2Deleted,
    dryRun: false,
  });
}
