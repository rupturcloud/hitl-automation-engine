#!/usr/bin/env node
/**
 * Descompacta o standalone Ruptur OS v3.13 (HTML self-contained) para
 * inspeção/port. O HTML embute um <script type="__bundler/manifest">
 * com mapping uuid → { mime, compressed, data: base64(gzip(text)) }.
 *
 * Uso:
 *   node scripts/unpack-v3.13-standalone.mjs <html> <outDir>
 *
 * Default:
 *   html=web/client-area/public/demo/index.html
 *   out=tmp/v3.13-unpacked
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { dirname, join, resolve } from 'node:path';

const html = resolve(process.argv[2] || 'web/client-area/public/demo/index.html');
const out  = resolve(process.argv[3] || 'tmp/v3.13-unpacked');

const src = readFileSync(html, 'utf8');
const m = src.match(/<script type="__bundler\/manifest">([\s\S]*?)<\/script>/);
if (!m) { console.error('Manifest não encontrado'); process.exit(1); }

let manifest;
try { manifest = JSON.parse(m[1]); }
catch (e) { console.error('Manifest JSON inválido:', e.message); process.exit(1); }

// Também procurar o mapping uuid → filename. Pode estar em outro script.
const nameMap = {};
const nm = src.match(/<script type="__bundler\/names">([\s\S]*?)<\/script>/);
if (nm) { Object.assign(nameMap, JSON.parse(nm[1])); }

if (!existsSync(out)) mkdirSync(out, { recursive: true });

const summary = [];
let i = 0;
for (const [uuid, entry] of Object.entries(manifest)) {
  i++;
  let bytes;
  try {
    const b64 = entry.data;
    const buf = Buffer.from(b64, 'base64');
    bytes = entry.compressed ? gunzipSync(buf) : buf;
  } catch (e) {
    console.warn(`[skip ${uuid}] ${e.message}`);
    continue;
  }
  const name = nameMap[uuid] || `entry_${i.toString().padStart(3,'0')}_${uuid.slice(0,8)}`;
  const ext = entry.mime?.includes('javascript') ? 'js'
            : entry.mime?.includes('css')        ? 'css'
            : entry.mime?.includes('html')       ? 'html'
            : entry.mime?.includes('json')       ? 'json'
            : 'txt';
  const filename = nameMap[uuid] ? name : `${name}.${ext}`;
  const path = join(out, filename);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, bytes);
  summary.push({ uuid, name: filename, mime: entry.mime, size: bytes.length });
}

writeFileSync(join(out, '_manifest.json'), JSON.stringify(summary, null, 2));
console.log(`\nDescompactados ${summary.length} arquivos em ${out}`);
console.log(`\nResumo por mime:`);
const byMime = {};
for (const s of summary) byMime[s.mime] = (byMime[s.mime] || 0) + 1;
for (const [mime, count] of Object.entries(byMime)) console.log(`  ${mime}: ${count}`);
console.log(`\n10 maiores arquivos:`);
summary.sort((a,b) => b.size - a.size).slice(0,10).forEach(s => {
  console.log(`  ${(s.size/1024).toFixed(1).padStart(8)} KB  ${s.name}`);
});
