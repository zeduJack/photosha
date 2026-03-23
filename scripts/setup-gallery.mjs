// setup-gallery.mjs
//
// Prepares all gallery images for photosha:
//   1. Shows a dry-run manifest (folder → R2 key mapping)
//   2. With --confirm:
//      a. Deletes all existing objects under photos/ in R2
//      b. Converts each source image to WebP (quality 85)
//      c. Extracts width + height
//      d. Generates a base64 blur placeholder (blurDataURL)
//      e. Uploads to R2 as photos/{category}/{0010..}.webp
//      f. Writes TypeScript data files to OUTPUT_DIR
//
// Usage:
//   node setup-gallery.mjs              → dry run (manifest only)
//   node setup-gallery.mjs --confirm    → delete R2 + convert + upload + write TS
//
// Required .env vars:
//   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
//
// Optional .env vars:
//   CDN_BASE_URL   default: https://images.photosha.ch
//   PHOTOS_DIR     default: ../public/photos   (relative to this script)
//   OUTPUT_DIR     default: ./gallery-output   (where .ts files are written)
//                  tip: set to ../photosha/src/data/gallery for direct output
//
// Dependencies (install in the source project):
//   npm install @aws-sdk/client-s3 sharp dotenv

import "dotenv/config";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { readdirSync, mkdirSync, writeFileSync } from "fs";
import { join, extname, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

// ─── Config ────────────────────────────────────────────────────────────────

const __dir = dirname(fileURLToPath(import.meta.url));

const R2_ACCOUNT_ID      = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID   = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET_NAME        = process.env.R2_BUCKET_NAME;
const CDN_BASE           = (process.env.CDN_BASE_URL ?? "https://images.photosha.ch").replace(/\/$/, "");
const PHOTOS_DIR         = join(__dir, process.env.PHOTOS_DIR ?? "../public/photos");
const OUTPUT_DIR         = join(__dir, process.env.OUTPUT_DIR ?? "./gallery-output");

// Source folder name → R2 category (English, matches Next.js route segments)
const CATEGORY_MAP = {
  "1_Portrait":  "portrait",
  "2_Hochzeit":  "wedding",   // renamed from hochzeit
  "3_Event":     "event",
  "5_Familie":   "family",    // renamed from familie
  "6_Landscape": "landscape",
};

const SUPPORTED_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

// ─── Helpers ───────────────────────────────────────────────────────────────

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function r2Key(category, index) {
  return `photos/${category}/${String((index + 1) * 10).padStart(4, "0")}.webp`;
}

function cdnUrl(category, index) {
  return `${CDN_BASE}/${r2Key(category, index)}`;
}

function defaultAlt(category, index) {
  const label = category.charAt(0).toUpperCase() + category.slice(1);
  return `${label} photography by Sha — photo ${index + 1}`;
}

// ─── R2 client ─────────────────────────────────────────────────────────────

const client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function listR2Keys(prefix) {
  const keys = [];
  let token;
  do {
    const res = await client.send(
      new ListObjectsV2Command({ Bucket: BUCKET_NAME, Prefix: prefix, ContinuationToken: token })
    );
    for (const obj of res.Contents ?? []) keys.push(obj.Key);
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);
  return keys;
}

async function deleteR2Keys(keys) {
  for (let i = 0; i < keys.length; i += 1000) {
    const batch = keys.slice(i, i + 1000).map((Key) => ({ Key }));
    await client.send(
      new DeleteObjectsCommand({ Bucket: BUCKET_NAME, Delete: { Objects: batch } })
    );
  }
}

// ─── Image processing ──────────────────────────────────────────────────────

async function processImage(sourcePath) {
  const img = sharp(sourcePath);
  const { width, height } = await img.metadata();

  // 16px-wide low-quality JPEG for blur placeholder
  const blurBuf = await img
    .clone()
    .resize(16, null, { withoutEnlargement: true })
    .jpeg({ quality: 20 })
    .toBuffer();
  const blurDataURL = `data:image/jpeg;base64,${blurBuf.toString("base64")}`;

  // WebP conversion
  const webpBuffer = await img.webp({ quality: 85 }).toBuffer();

  return { width, height, blurDataURL, webpBuffer };
}

// ─── Manifest builder ──────────────────────────────────────────────────────

function buildManifest() {
  const manifest = {};
  for (const [folder, category] of Object.entries(CATEGORY_MAP)) {
    const mediumDir = join(PHOTOS_DIR, folder, "medium");
    let files;
    try {
      files = readdirSync(mediumDir)
        .filter((f) => SUPPORTED_EXTS.has(extname(f).toLowerCase()))
        .sort(naturalSort);
    } catch {
      console.warn(`⚠  No medium/ folder found in ${folder} — skipping`);
      continue;
    }
    manifest[category] = files.map((file, index) => ({
      sourcePath: join(mediumDir, file),
      key: r2Key(category, index),
      url: cdnUrl(category, index),
      alt: defaultAlt(category, index),
    }));
  }
  return manifest;
}

// ─── TypeScript output ─────────────────────────────────────────────────────

function writeTypeScriptFile(category, images) {
  const entries = images
    .map(
      ({ url, width, height, alt, blurDataURL }) =>
        `  {\n` +
        `    src: '${url}',\n` +
        `    width: ${width},\n` +
        `    height: ${height},\n` +
        `    // TODO: replace with a specific descriptive caption\n` +
        `    alt: '${alt}',\n` +
        `    blurDataURL: '${blurDataURL}',\n` +
        `  }`
    )
    .join(",\n");

  return (
    `import type { GalleryImage } from '@/types/gallery'\n\n` +
    `export const ${category}Images: GalleryImage[] = [\n${entries},\n]\n`
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function run() {
  const confirm = process.argv.includes("--confirm");

  // Validate env
  for (const [key, val] of Object.entries({ R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, BUCKET_NAME })) {
    if (!val) { console.error(`Missing env var: ${key}`); process.exit(1); }
  }

  // Build manifest
  console.log(`\nReading source images from: ${PHOTOS_DIR}`);
  const manifest = buildManifest();

  if (Object.keys(manifest).length === 0) {
    console.error("No categories found. Check PHOTOS_DIR and folder names.");
    process.exit(1);
  }

  // Print manifest
  let totalImages = 0;
  for (const [category, images] of Object.entries(manifest)) {
    console.log(`\n📁 ${category} (${images.length} images):`);
    images.forEach(({ key }) => console.log(`   ${key}`));
    totalImages += images.length;
  }
  console.log(`\nTotal: ${totalImages} images → ${Object.keys(manifest).length} categories`);
  console.log(`CDN base: ${CDN_BASE}`);
  console.log(`TS output: ${OUTPUT_DIR}`);

  if (!confirm) {
    console.log("\n──────────────────────────────────────────────────────────────");
    console.log("Dry run complete. To delete R2 photos/ and re-upload, run:");
    console.log("  node setup-gallery.mjs --confirm");
    console.log("──────────────────────────────────────────────────────────────\n");
    return;
  }

  // ── Step 1: Delete existing R2 photos/ ────────────────────────────────
  console.log("\n🗑  Deleting existing R2 objects under photos/…");
  const existing = await listR2Keys("photos/");
  if (existing.length > 0) {
    await deleteR2Keys(existing);
    console.log(`   Deleted ${existing.length} objects`);
  } else {
    console.log("   Nothing to delete");
  }

  // ── Step 2: Convert, upload, collect metadata ─────────────────────────
  const galleryData = {};
  let uploaded = 0, failed = 0;

  for (const [category, images] of Object.entries(manifest)) {
    galleryData[category] = [];
    console.log(`\n📤 ${category} (${images.length} images)…`);

    for (const { sourcePath, key, url, alt } of images) {
      try {
        const { width, height, blurDataURL, webpBuffer } = await processImage(sourcePath);

        await client.send(
          new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: webpBuffer,
            ContentType: "image/webp",
          })
        );

        galleryData[category].push({ url, width, height, alt, blurDataURL });
        process.stdout.write(`   ✓ ${key} (${width}×${height})\n`);
        uploaded++;
      } catch (err) {
        console.error(`   ✗ ${key}: ${err.message}`);
        failed++;
      }
    }
  }

  console.log(`\nUploaded: ${uploaded}  Failed: ${failed}`);

  // ── Step 3: Write TypeScript data files ───────────────────────────────
  console.log(`\n📝 Writing TypeScript data files to ${OUTPUT_DIR}…`);
  mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const [category, images] of Object.entries(galleryData)) {
    const content = writeTypeScriptFile(category, images);
    const outPath = join(OUTPUT_DIR, `${category}.ts`);
    writeFileSync(outPath, content, "utf8");
    console.log(`   ✓ ${outPath}`);
  }

  console.log("\n✅ Done!");
  console.log("\nNext steps:");
  console.log("  1. Review alt text in each generated .ts file and replace placeholders");
  console.log(`  2. Copy .ts files to src/data/gallery/ in the photosha project`);
  console.log("     (or re-run with OUTPUT_DIR=../photosha/src/data/gallery)");
}

run().catch((err) => {
  console.error("\nFatal error:", err.message);
  process.exit(1);
});
