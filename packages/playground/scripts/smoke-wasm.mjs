import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import {
  ConsoleStdout,
  Directory,
  File,
  OpenFile,
  PreopenDirectory,
  WASI,
} from '@bjorn3/browser_wasi_shim';

const PACKAGE_ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const REPO_ROOT = path.resolve(PACKAGE_ROOT, '../..');
const KOKAINE_CACHE_DIR = path.join(PACKAGE_ROOT, 'vendor', 'kokaine-precompiled-v3.2.4');
const UPSTREAM_COMMIT = 'c0f1a10a60b8644fd6f08dfcec654fa815c06e3f';
const PRECOMPILED_MTIME_NS = 2_000_000_000_000_000_000n;
const KOKAINE_PRECOMPILED_PATH = /^\/lib\/js-debug\/kokaine_[^/]+\.(?:kki|mjs)$/;
const KOKAINE_BUILD_CACHE_PATH = /^\/\.koka\/v[^/]+\/js-debug-[^/]+\/kokaine_[^/]+\.(?:kki|mjs)$/;
const INTERFACE_EXTERNALS_HEADER = '//------------------------------\n//#kki: external declarations';
const INTERFACE_INLINE_MARKER = '//.inline-section';
const CACHE_PHASE_DECLARATION = 'fun @kokaine-cache-phase[1,0,1,0] : () -> std/core/types/int;';
const CACHE_PHASE_INLINE = `${INTERFACE_INLINE_MARKER}
fun @kokaine-cache-phase // inline size: 1
  = fn(){ 0; };
`;
const updateKokaineCache = process.argv.includes('--update-kokaine-cache');
const SOURCE = `module playground

import kokaine/reactive
import kokaine/html
import kokaine/dom
${updateKokaineCache ? `import kokaine/control
import kokaine/async
import kokaine/async/web
import kokaine/resource
import kokaine/ssr
import kokaine/web/window` : ''}

pub fun main()
  val (root,count) = create-root fn(root)
    signal(root,0)
  val page = view
    button("Increment",attrs=[
      on("click",fn(_) count.modify(fn(value) value + 1))
    ])
    strong { text { count.get.show } }
  val dispose = mount(root,query("#app"),page)
  ()
`;

async function readSources(directory, prefix = '/share/lib/kokaine') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const diskPath = path.join(directory, entry.name);
    const vfsPath = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) files.push(...await readSources(diskPath, vfsPath));
    else if (entry.name.endsWith('.kk')) files.push([vfsPath, await readFile(diskPath, 'utf8')]);
  }
  return files;
}

function buildTree(files) {
  const root = new Map();
  const encoder = new TextEncoder();
  for (const [filePath, content] of files) {
    const parts = filePath.split('/').filter(Boolean);
    const filename = parts.pop();
    let current = root;
    for (const part of parts) {
      let entry = current.get(part);
      if (!(entry instanceof Directory)) {
        entry = new Directory(new Map());
        current.set(part, entry);
      }
      current = entry.contents;
    }
    const file = new File(encoder.encode(content));
    if (filePath.startsWith('/lib/js-debug/')) {
      const originalStat = file.stat.bind(file);
      file.stat = () => {
        const result = originalStat();
        result.atim = PRECOMPILED_MTIME_NS;
        result.mtim = PRECOMPILED_MTIME_NS;
        result.ctim = PRECOMPILED_MTIME_NS;
        result.write_bytes = (view, pointer) => {
          view.setBigUint64(pointer, result.dev, true);
          view.setBigUint64(pointer + 8, result.ino, true);
          view.setUint8(pointer + 16, result.filetype);
          view.setBigUint64(pointer + 24, result.nlink, true);
          view.setBigUint64(pointer + 32, result.size, true);
          view.setBigUint64(pointer + 40, result.atim, true);
          view.setBigUint64(pointer + 48, result.mtim, true);
          view.setBigUint64(pointer + 56, result.ctim, true);
        };
        return result;
      };
    }
    current.set(filename, file);
  }
  return new Directory(root);
}

function collect(directory, prefix, output) {
  const decoder = new TextDecoder();
  for (const [name, entry] of directory.contents) {
    const filePath = `${prefix}/${name}`;
    if (entry instanceof File) output.set(filePath, decoder.decode(entry.data));
    else if (entry instanceof Directory) collect(entry, filePath, output);
  }
}

// Koka 3.2.4 marks an interface with no inline body as PhaseLinked, while an
// interface with inline bodies is PhaseIfaceLoaded. A PhaseLinked module that
// imports a PhaseIfaceLoaded module is then force-reloaded from source by
// validateDependencies, which cascades through Kokaine's graph. In addition,
// some higher-effect inline bodies emitted by 3.2.4 do not parse back. Treat
// vendored Kokaine as an opaque precompiled library: retain its declarations
// and JavaScript implementation, but replace cross-module inline IR with one
// private, inert marker so every interface has the same load phase.
function makeOpaqueKokaineInterface(content, name) {
  if (!content.includes(INTERFACE_EXTERNALS_HEADER)) {
    throw new Error(`Kokaine interface has no external-declarations section: ${name}`);
  }

  const withDeclaration = content.replace(
    INTERFACE_EXTERNALS_HEADER,
    `${CACHE_PHASE_DECLARATION}\n \n${INTERFACE_EXTERNALS_HEADER}`,
  );
  const inlineOffset = withDeclaration.indexOf(INTERFACE_INLINE_MARKER);
  const declarations = inlineOffset >= 0
    ? withDeclaration.slice(0, inlineOffset)
    : `${withDeclaration.trimEnd()}\n\n`;
  return `${declarations}${CACHE_PHASE_INLINE}`;
}

const runtimeGzip = await readFile(path.join(PACKAGE_ROOT, 'public/koka/koka-runtime.json.gz'));
const runtime = JSON.parse(gunzipSync(runtimeGzip).toString('utf8'));
const kokaineSources = await readSources(path.join(REPO_ROOT, 'src/kokaine'));
const runtimeFiles = updateKokaineCache
  ? runtime.files.filter(([filePath]) => (
      !KOKAINE_PRECOMPILED_PATH.test(filePath)
      && !KOKAINE_BUILD_CACHE_PATH.test(filePath)
    ))
  : runtime.files;
// Sources are inserted first; verified precompiled interfaces are inserted last
// so WASI file timestamps make the cache the freshest copy.
const files = new Map([...kokaineSources, ...runtimeFiles]);
const root = buildTree(files);
const stdout = [];
const stderr = [];
const wasi = new WASI(
  [
    'koka-playground',
    '--sharedir=/share',
    '--libdir=/lib',
    '--target=js',
    '--builddir=/.koka',
    '--include=/share/lib',
    '--include=/src',
    '--include=/',
    '--console=raw',
    '-v1',
    'playground',
  ],
  [],
  [
    new OpenFile(new File(new TextEncoder().encode(SOURCE))),
    ConsoleStdout.lineBuffered((line) => stdout.push(line)),
    ConsoleStdout.lineBuffered((line) => stderr.push(line)),
    new PreopenDirectory('/', root.contents),
  ],
  { debug: false },
);

const wasm = await WebAssembly.compile(
  await readFile(path.join(PACKAGE_ROOT, 'public/koka/koka-playground.wasm')),
);
const startedAt = performance.now();
try {
  wasi.start(new WebAssembly.Instance(wasm, { wasi_snapshot_preview1: wasi.wasiImport }));
} catch (error) {
  if (!(error instanceof Error && error.message.toLowerCase().includes('exit'))) throw error;
}

const resultLine = [...stdout].reverse().find((line) => line.trimStart().startsWith('{'));
const result = resultLine ? JSON.parse(resultLine) : null;
const generated = new Map();
const buildDirectory = root.contents.get('.koka');
if (buildDirectory instanceof Directory) collect(buildDirectory, '/.koka', generated);
const generatedNames = [...generated.keys()].map((name) => name.slice(name.lastIndexOf('/') + 1));

if (result?.success !== true) {
  throw new Error(`WASM Kokaine smoke compile failed:\n${stderr.join('\n')}\n${resultLine ?? ''}`);
}
if (!generatedNames.includes('playground.mjs') || !generatedNames.includes('playground__main.mjs')) {
  throw new Error(`WASM compiler did not generate the playground entry: ${generatedNames.join(', ')}`);
}
if (process.argv.includes('--verbose')) {
  console.error(stderr.join('\n'));
}
if (updateKokaineCache) {
  const cacheFiles = [...generated]
    .filter(([filePath]) => /^kokaine_[a-z0-9_]+\.(?:kki|mjs)$/.test(filePath.slice(filePath.lastIndexOf('/') + 1)))
    .sort(([left], [right]) => left.localeCompare(right));
  if (cacheFiles.length !== 76) {
    throw new Error(`Expected 76 Kokaine cache files, received ${cacheFiles.length}.`);
  }
  await rm(KOKAINE_CACHE_DIR, { recursive: true, force: true });
  await mkdir(KOKAINE_CACHE_DIR, { recursive: true });
  const manifestFiles = [];
  for (const [sourcePath, content] of cacheFiles) {
    const name = sourcePath.slice(sourcePath.lastIndexOf('/') + 1);
    const vendoredContent = name.endsWith('.kki')
      ? makeOpaqueKokaineInterface(content, name)
      : content;
    const bytes = Buffer.from(vendoredContent, 'utf8');
    await writeFile(path.join(KOKAINE_CACHE_DIR, name), bytes);
    manifestFiles.push({
      sourcePath,
      name,
      bytes: bytes.byteLength,
      sha256: createHash('sha256').update(bytes).digest('hex'),
    });
  }
  await writeFile(path.join(KOKAINE_CACHE_DIR, 'manifest.json'), `${JSON.stringify({
    compilerVersion: runtime.compilerVersion,
    compilerCommit: UPSTREAM_COMMIT,
    vfsDestination: '/lib/js-debug',
    files: manifestFiles,
  }, null, 2)}\n`);
  console.log(`Updated ${cacheFiles.length} vendored Kokaine precompiled files.`);
}

const loadedKokaineInterfaces = stderr.filter((line) => (
  line.includes('load')
  && line.includes('kokaine/')
  && line.includes('from:')
  && line.includes('/lib/js-debug/kokaine_')
));
if (!updateKokaineCache && loadedKokaineInterfaces.length < 3) {
  throw new Error(
    'Vendored Kokaine precompiled interfaces were not loaded by the compiler.\n'
    + `Compiler log:\n${stderr.slice(-40).join('\n')}`,
  );
}

const regeneratedKokaine = stderr.filter((line) => (
  line.includes('generate javascript:') && line.includes('/kokaine_')
));
if (!updateKokaineCache && regeneratedKokaine.length > 0) {
  throw new Error(
    'Vendored Kokaine modules were regenerated instead of loaded from cache.\n'
    + `Regenerated: ${regeneratedKokaine.join(', ')}\n`,
  );
}

console.log(
  `WASM smoke passed in ${((performance.now() - startedAt) / 1000).toFixed(2)}s; `
  + `${generatedNames.filter((name) => name.endsWith('.mjs')).length} generated modules.`,
);
