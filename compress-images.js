/**
 * Batch image compressor
 *
 * Setup (run once in your project):
 *   npm install sharp --save-dev
 *
 * Usage:
 *   node compress-images.js
 *
 * What it does:
 *   - Recursively walks INPUT_DIR
 *   - Resizes anything wider than MAX_WIDTH down to MAX_WIDTH
 *   - Compresses png/jpg/jpeg/webp at QUALITY
 *   - Writes results to OUTPUT_DIR, mirroring the same folder structure
 *   - Keeps the SAME filenames/extensions, so you don't need to touch
 *     any <img src="..."> or next/image references in your code —
 *     just swap the compressed files back in.
 *
 * Workflow:
 *   1. Point INPUT_DIR at your public/ folder (or a subfolder like
 *      public/vouchers if you only want to target specific images)
 *   2. Run the script
 *   3. Check the before/after sizes printed in the terminal
 *   4. Eyeball a few compressed images in OUTPUT_DIR to confirm quality
 *      is acceptable
 *   5. Copy the compressed files over your originals (or into R2 for
 *      anything served from cdn.3rdspace.shop)
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const INPUT_DIR = "./public/gallery-original";
const OUTPUT_DIR = "./public/gallery-compressed";
const MAX_WIDTH = 1600;
const QUALITY = 80;

const IMAGE_EXT = [".png", ".jpg", ".jpeg", ".webp"];

function fmtKB(bytes) {
  return (bytes / 1024).toFixed(0) + "KB";
}

async function processDir(inputDir, outputDir) {
  await fs.promises.mkdir(outputDir, { recursive: true });
  const entries = await fs.promises.readdir(inputDir, { withFileTypes: true });

  let totalBefore = 0;
  let totalAfter = 0;

  for (const entry of entries) {
    const inputPath = path.join(inputDir, entry.name);
    const outputPath = path.join(outputDir, entry.name);

    if (entry.isDirectory()) {
      const sub = await processDir(inputPath, outputPath);
      totalBefore += sub.totalBefore;
      totalAfter += sub.totalAfter;
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (!IMAGE_EXT.includes(ext)) continue;

    try {
      const beforeStat = await fs.promises.stat(inputPath);
      const img = sharp(inputPath);
      const meta = await img.metadata();

      let pipeline = img;
      if (meta.width && meta.width > MAX_WIDTH) {
        pipeline = pipeline.resize({ width: MAX_WIDTH });
      }

      pipeline = pipeline.webp({ quality: QUALITY });
      const webpOutputPath = outputPath.replace(/\.(png|jpg|jpeg)$/i, ".webp");
      await pipeline.toFile(webpOutputPath);

      const afterStat = await fs.promises.stat(webpOutputPath);
      totalBefore += beforeStat.size;
      totalAfter += afterStat.size;

      const savings = ((1 - afterStat.size / beforeStat.size) * 100).toFixed(0);

      console.log(
        `${inputPath}: ${fmtKB(beforeStat.size)} -> ${fmtKB(afterStat.size)} (-${savings}%)`,
      );
    } catch (err) {
      console.error(`Failed on ${inputPath}:`, err.message);
    }
  }

  return { totalBefore, totalAfter };
}

processDir(INPUT_DIR, OUTPUT_DIR).then(({ totalBefore, totalAfter }) => {
  console.log("\n--- Done ---");
  console.log(`Total before: ${fmtKB(totalBefore)}`);
  console.log(`Total after:  ${fmtKB(totalAfter)}`);
  console.log(
    `Saved: ${fmtKB(totalBefore - totalAfter)} (-${(
      (1 - totalAfter / totalBefore) *
      100
    ).toFixed(0)}%)`,
  );
  console.log(`\nCompressed files are in: ${OUTPUT_DIR}`);
});
