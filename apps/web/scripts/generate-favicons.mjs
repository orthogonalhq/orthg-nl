// Regenerates favicon.ico + apple-icon.png from src/app/icon.svg.
// Run with: node scripts/generate-favicons.mjs
//
// Outputs:
//   src/app/favicon.ico   — multi-size ICO (16, 32, 48)
//   src/app/apple-icon.png — 180x180 for iOS home-screen
//   public/icon-192.png    — PWA-friendly 192x192
//   public/icon-512.png    — PWA-friendly 512x512

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(here, "..");
const svgPath = resolve(webRoot, "src/app/icon.svg");

const svg = await readFile(svgPath);

const renderPng = (size) =>
  sharp(svg, { density: 384 })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();

// Build a PNG-embedded ICO (Vista+ compatible) containing 16/32/48.
async function buildIco(sizes) {
  const pngs = await Promise.all(sizes.map(renderPng));
  const count = pngs.length;
  const headerSize = 6 + 16 * count;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type = icon
  header.writeUInt16LE(count, 4);

  const entries = Buffer.alloc(16 * count);
  let offset = headerSize;
  pngs.forEach((png, i) => {
    const size = sizes[i];
    const e = entries.subarray(i * 16, (i + 1) * 16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 == 256)
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(png.length, 8); // bytes in resource
    e.writeUInt32LE(offset, 12); // image offset
    offset += png.length;
  });

  return Buffer.concat([header, entries, ...pngs]);
}

const ico = await buildIco([16, 32, 48]);
await writeFile(resolve(webRoot, "src/app/favicon.ico"), ico);

const apple = await renderPng(180);
await writeFile(resolve(webRoot, "src/app/apple-icon.png"), apple);

const icon192 = await renderPng(192);
await writeFile(resolve(webRoot, "public/icon-192.png"), icon192);

const icon512 = await renderPng(512);
await writeFile(resolve(webRoot, "public/icon-512.png"), icon512);

console.log("Generated:");
console.log("  src/app/favicon.ico        (16/32/48)");
console.log("  src/app/apple-icon.png     (180)");
console.log("  public/icon-192.png");
console.log("  public/icon-512.png");
