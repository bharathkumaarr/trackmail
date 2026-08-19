#!/usr/bin/env node
/**
 * Generates minimal PNG icons for the Chrome extension.
 */
import { writeFileSync, mkdirSync } from 'fs';
import { deflateSync } from 'zlib';

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function createPNG(size, r, g, b) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const raw = Buffer.alloc((size * size * 3 + size) * size);
  let offset = 0;
  for (let y = 0; y < size; y++) {
    raw[offset++] = 0; // filter none
    for (let x = 0; x < size; x++) {
      const cx = x - size / 2;
      const cy = y - size / 2;
      const inCircle = cx * cx + cy * cy < (size * 0.35) ** 2;
      raw[offset++] = inCircle ? r : 255;
      raw[offset++] = inCircle ? g : 255;
      raw[offset++] = inCircle ? b : 255;
    }
  }

  const compressed = deflateSync(raw);
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync('public/icons', { recursive: true });
for (const size of [16, 48, 128]) {
  const png = createPNG(size, 26, 115, 232); // Google blue
  writeFileSync(`public/icons/icon${size}.png`, png);
  console.log(`created icon${size}.png`);
}
