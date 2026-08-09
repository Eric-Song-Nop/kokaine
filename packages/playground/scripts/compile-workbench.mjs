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

const packageRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const repoRoot = path.resolve(packageRoot, '../..');
const workbenchRoot = path.join(packageRoot, 'koka');
const outputRoot = path.join(packageRoot, 'src', 'generated', 'koka');
const entryModule = 'playground/main';
const precompiledMtimeNs = 2_000_000_000_000_000_000n;

async function readSources(directory, prefix) {
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
        result.atim = precompiledMtimeNs;
        result.mtim = precompiledMtimeNs;
        result.ctim = precompiledMtimeNs;
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

const runtimeGzip = await readFile(path.join(packageRoot, 'public', 'koka', 'koka-runtime.json.gz'));
const runtime = JSON.parse(gunzipSync(runtimeGzip).toString('utf8'));
if (!Array.isArray(runtime?.files)) throw new Error('Invalid Koka browser runtime file table');

const coreSources = await readSources(path.join(repoRoot, 'src', 'kokaine'), '/share/lib/kokaine');
const workbenchSources = await readSources(workbenchRoot, '/src');
const sourcePath = '/src/playground/main.kk';
const source = new Map(workbenchSources).get(sourcePath);
if (typeof source !== 'string') throw new Error(`Missing workbench entry ${sourcePath}`);

const files = new Map([...coreSources, ...workbenchSources, ...runtime.files]);
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
    '-v0',
    entryModule,
  ],
  [],
  [
    new OpenFile(new File(new TextEncoder().encode(source))),
    ConsoleStdout.lineBuffered((line) => stdout.push(line)),
    ConsoleStdout.lineBuffered((line) => stderr.push(line)),
    new PreopenDirectory('/', root.contents),
  ],
  { debug: false },
);

const wasm = await WebAssembly.compile(
  await readFile(path.join(packageRoot, 'public', 'koka', 'koka-playground.wasm')),
);
try {
  wasi.start(new WebAssembly.Instance(wasm, { wasi_snapshot_preview1: wasi.wasiImport }));
} catch (error) {
  if (!(error instanceof Error && error.message.toLowerCase().includes('exit'))) throw error;
}

const resultLine = [...stdout].reverse().find((line) => line.trimStart().startsWith('{'));
const result = resultLine ? JSON.parse(resultLine) : null;
if (result?.success !== true) {
  throw new Error(`Koka workbench compilation failed:\n${stderr.join('\n')}\n${resultLine ?? ''}`);
}

const generatedFiles = new Map();
const buildDirectory = root.contents.get('.koka');
if (!(buildDirectory instanceof Directory)) throw new Error('Koka emitted no build directory');
collect(buildDirectory, '/.koka', generatedFiles);

const modules = new Map(
  runtime.files
    .filter(([filePath, content]) => (
      typeof filePath === 'string'
      && filePath.startsWith('/lib/js-debug/')
      && filePath.endsWith('.mjs')
      && typeof content === 'string'
    ))
    .map(([filePath, content]) => [path.posix.basename(filePath), content]),
);
for (const [filePath, content] of generatedFiles) {
  if (filePath.endsWith('.mjs')) modules.set(path.posix.basename(filePath), content);
}

const entryCandidates = [...generatedFiles.keys()]
  .filter((filePath) => filePath.endsWith('__main.mjs'))
  .map((filePath) => path.posix.basename(filePath));
if (entryCandidates.length !== 1) {
  throw new Error(`Expected one generated workbench entry, received: ${entryCandidates.join(', ')}`);
}

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });
await Promise.all([...modules].map(([filename, content]) => (
  writeFile(path.join(outputRoot, filename), content, 'utf8')
)));
await writeFile(
  path.join(outputRoot, 'entry.mjs'),
  `import './${entryCandidates[0]}';\n`,
  'utf8',
);
await writeFile(
  path.join(outputRoot, 'entry.d.mts'),
  'export {};\n',
  'utf8',
);

console.log(
  `Compiled Kokaine workbench with Koka ${runtime.compilerVersion}: `
  + `${generatedFiles.size} generated files, ${modules.size} staged modules.`,
);
