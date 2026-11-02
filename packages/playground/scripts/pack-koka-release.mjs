// Assemble the files of a Playground compiler release from a Koka build.
//
//   node scripts/pack-koka-release.mjs --koka <checkout> --precompiled <dir> \
//     --wasm <dir> --out <dir>
//
// <checkout> is the Koka source tree, <precompiled> the native `--target=js`
// output directory, <wasm> holds the three optimized WASM programs. <out>
// receives those programs, a deterministic koka-browser-lib.tar.gz (the Koka
// licence, lib/std, and the .kki/.mjs of precompiled/), LICENSE, and SHA256SUMS,
// which is what gets uploaded. See docs/maintainers/playground-compiler.md.
import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { gzipSync } from 'node:zlib';

const WASM_FILES = ['koka-playground.wasm', 'koka-lsp.wasm', 'koka-browser-repl.wasm'];
const LIBRARY_ARCHIVE = 'koka-browser-lib.tar.gz';
const CLOUDFLARE_PAGES_FILE_LIMIT = 25 * 1024 * 1024;

const { values } = parseArgs({
  options: {
    koka: { type: 'string' },
    precompiled: { type: 'string' },
    wasm: { type: 'string' },
    out: { type: 'string' },
  },
});
for (const name of ['koka', 'precompiled', 'wasm', 'out']) {
  if (!values[name]) throw new Error(`Missing --${name} <dir>`);
}

async function listFiles(directory, prefix = '') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...await listFiles(path.join(directory, entry.name), relative));
    else if (entry.isFile()) files.push(relative);
    else throw new Error(`Refusing to archive a non-regular file: ${relative}`);
  }
  return files;
}

function octal(value, width) {
  return `${value.toString(8).padStart(width - 1, '0')}\0`;
}

// USTAR with fixed metadata, so the archive depends only on names and contents.
function tarHeader(name, size) {
  let prefix = '';
  let base = name;
  if (Buffer.byteLength(base) > 100) {
    const split = name.lastIndexOf('/', 155);
    if (split <= 0 || Buffer.byteLength(name.slice(split + 1)) > 100) {
      throw new Error(`Path does not fit a USTAR header: ${name}`);
    }
    prefix = name.slice(0, split);
    base = name.slice(split + 1);
  }
  const header = Buffer.alloc(512);
  header.write(base, 0, 100);
  header.write(octal(0o644, 8), 100);
  header.write(octal(0, 8), 108);
  header.write(octal(0, 8), 116);
  header.write(octal(size, 12), 124);
  header.write(octal(0, 12), 136);
  header.write('        ', 148);
  header.write('0', 156);
  header.write('ustar\0' + '00', 257);
  header.write(prefix, 345, 155);
  let sum = 0;
  for (const byte of header) sum += byte;
  header.write(`${sum.toString(8).padStart(6, '0')}\0 `, 148);
  return header;
}

function tarArchive(entries) {
  const blocks = [];
  for (const [name, bytes] of entries) {
    blocks.push(tarHeader(name, bytes.byteLength), bytes);
    const padding = (512 - (bytes.byteLength % 512)) % 512;
    if (padding > 0) blocks.push(Buffer.alloc(padding));
  }
  blocks.push(Buffer.alloc(1024));
  return Buffer.concat(blocks);
}

const stdRoot = path.join(values.koka, 'lib', 'std');
const entries = [['LICENSE', await readFile(path.join(values.koka, 'LICENSE'))]];
for (const name of (await listFiles(stdRoot)).sort()) {
  entries.push([`lib/std/${name}`, await readFile(path.join(stdRoot, name))]);
}
const precompiledNames = (await readdir(values.precompiled))
  .filter((name) => name.endsWith('.kki') || name.endsWith('.mjs'))
  .sort();
for (const name of precompiledNames) {
  entries.push([`precompiled/${name}`, await readFile(path.join(values.precompiled, name))]);
}

const archive = gzipSync(tarArchive(entries), { level: 9 });
// zlib records the host OS at byte 9; normalize it across platforms.
archive[9] = 255;

await mkdir(values.out, { recursive: true });
await writeFile(path.join(values.out, LIBRARY_ARCHIVE), archive);
for (const filename of WASM_FILES) {
  await copyFile(path.join(values.wasm, filename), path.join(values.out, filename));
}
await copyFile(path.join(values.koka, 'LICENSE'), path.join(values.out, 'LICENSE'));

const lines = [];
for (const filename of [...WASM_FILES, LIBRARY_ARCHIVE, 'LICENSE']) {
  const bytes = await readFile(path.join(values.out, filename));
  const hash = createHash('sha256').update(bytes).digest('hex');
  lines.push(`${hash}  ${filename}`);
  const over = bytes.byteLength >= CLOUDFLARE_PAGES_FILE_LIMIT ? '  OVER THE 25 MiB PAGES LIMIT' : '';
  console.log(`${String(bytes.byteLength).padStart(10)}  ${hash}  ${filename}${over}`);
  if (over && WASM_FILES.includes(filename)) process.exitCode = 1;
}
await writeFile(path.join(values.out, 'SHA256SUMS'), `${lines.join('\n')}\n`);
console.log(`${entries.length} archive entries; wrote ${values.out}`);
