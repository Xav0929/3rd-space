import sharp from "sharp";
import fs from "fs";
import path from "path";

const INPUT_DIR = "C:/Users/yuri/OneDrive/Desktop/drive-download-hehe-3-001";
const OUTPUT_DIR = "./public/gallery";
const START_INDEX = 56;

const SUPPORTED = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".heif",
  ".avif",
  ".bmp",
  ".tiff",
];

const files = fs
  .readdirSync(INPUT_DIR)
  .filter((f) => SUPPORTED.includes(path.extname(f).toLowerCase()));

console.log(`Found ${files.length} files. Converting...`);

let i = START_INDEX;
for (const file of files) {
  const src = path.join(INPUT_DIR, file);
  const dest = path.join(OUTPUT_DIR, `g${i}.webp`);
  try {
    await sharp(src).webp({ quality: 82 }).toFile(dest);
    console.log(`✓ ${file} → g${i}.webp`);
    i++;
  } catch (e) {
    console.error(`✗ ${file} SKIPPED:`, e.message);
  }
}

console.log(`\nDone. Added g${START_INDEX} → g${i - 1}.webp`);
