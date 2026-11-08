// Génère static/grain.png : tuile 256×256 de bruit monochrome (charte v2, « Grain »).
// Script ponctuel : le PNG produit est versionné. Usage : node scripts/make-grain.mjs
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const SIZE = 256;
let seed = 0x2b3bd6; // déterministe : même tuile à chaque génération
const rand = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32;

// Gris + alpha : pixels noirs ou blancs à opacité aléatoire, l'opacité globale est réglée en CSS.
const raw = Buffer.alloc((SIZE * 2 + 1) * SIZE);
for (let y = 0; y < SIZE; y++) {
  const row = y * (SIZE * 2 + 1);
  raw[row] = 0;
  for (let x = 0; x < SIZE; x++) {
    const v = rand();
    raw[row + 1 + x * 2] = v > 0.5 ? 255 : 0;
    raw[row + 2 + x * 2] = Math.floor(Math.abs(v - 0.5) * 2 * 90);
  }
}

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
/** @param {Buffer} buf */
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = (crcTable[(c ^ b) & 0xff] ?? 0) ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
/** @param {string} type @param {Buffer} data */
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);
ihdr.writeUInt32BE(SIZE, 4);
ihdr[8] = 8; // profondeur
ihdr[9] = 4; // niveaux de gris + alpha
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]);
writeFileSync(new URL('../static/grain.png', import.meta.url), png);
console.log(`static/grain.png : ${png.length} octets`);
