// One-off migration: moves inline base64 `data:image/...` URLs in data/products.json into
// public/media/inline-<hash>.<ext> files and rewrites the JSON to point at them.
// Lossless (the bytes are written as-is). Usage: node scripts/externalize-inline-images.mjs
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';

const FILE = path.join('data', 'products.json');
const OUT = path.join('public', 'media');
const EXT = { 'image/webp': 'webp', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/avif': 'avif' };

const products = JSON.parse(fs.readFileSync(FILE, 'utf-8'));
fs.mkdirSync(OUT, { recursive: true });
let moved = 0, savedBytes = 0;

function walk(node) {
  if (typeof node === 'string' && node.startsWith('data:image/')) {
    const m = /^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i.exec(node);
    const ext = m && EXT[m[1].toLowerCase()];
    if (!ext) return node;
    const buf = Buffer.from(m[2], 'base64');
    const name = `inline-${crypto.createHash('sha1').update(buf).digest('hex').slice(0, 16)}.${ext}`;
    fs.writeFileSync(path.join(OUT, name), buf);
    moved++; savedBytes += node.length;
    return `/media/${name}`;
  }
  if (Array.isArray(node)) return node.map(walk);
  if (node && typeof node === 'object') return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, walk(v)]));
  return node;
}

const before = fs.statSync(FILE).size;
fs.writeFileSync(FILE, JSON.stringify(walk(products), null, 2));
console.log(`Moved ${moved} inline images. products.json: ${before} -> ${fs.statSync(FILE).size} bytes (saved ~${Math.round(savedBytes / 1024)} KB of inline data)`);
