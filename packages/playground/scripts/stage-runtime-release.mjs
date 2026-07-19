import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';

const packageRoot = fileURLToPath(new URL('..', import.meta.url));
const kokaRoot = path.join(packageRoot, 'public', 'koka');
const releasesRoot = path.join(kokaRoot, 'releases');
const manifestPath = path.join(kokaRoot, 'assets.json');
const runtimePath = path.join(kokaRoot, 'koka-runtime.json.gz');
const releaseManifestPath = path.join(kokaRoot, 'release.json');
const wasmFilenames = ['koka-playground.wasm', 'koka-lsp.wasm'];

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const expectedRuntimeHash = manifest?.runtime?.sha256;
if (typeof expectedRuntimeHash !== 'string' || !/^[0-9a-f]{64}$/i.test(expectedRuntimeHash)) {
  throw new Error(`Invalid runtime SHA-256 in ${manifestPath}`);
}

const runtimeGzip = await readFile(runtimePath);
const runtimeHash = createHash('sha256').update(runtimeGzip).digest('hex');
if (runtimeHash !== expectedRuntimeHash) {
  throw new Error(`Runtime SHA-256 mismatch: expected ${expectedRuntimeHash}, received ${runtimeHash}`);
}

const wasmAssets = await Promise.all(wasmFilenames.map(async (filename) => {
  const bytes = await readFile(path.join(kokaRoot, filename));
  const actualHash = createHash('sha256').update(bytes).digest('hex');
  const expectedHash = manifest?.wasm?.[filename]?.sha256;
  if (typeof expectedHash !== 'string' || actualHash !== expectedHash) {
    throw new Error(`WASM SHA-256 mismatch for ${filename}: expected ${expectedHash}, received ${actualHash}`);
  }
  return { filename, bytes, sha256: actualHash };
}));

const releaseDescriptor = {
  schemaVersion: 1,
  compilerVersion: manifest.compilerVersion,
  upstreamCommit: manifest.upstreamCommit,
  runtimeSha256: runtimeHash,
  wasmSha256: Object.fromEntries(wasmAssets.map(({ filename, sha256 }) => [filename, sha256])),
};
const release = createHash('sha256')
  .update(JSON.stringify(releaseDescriptor))
  .digest('hex');

const runtime = JSON.parse(gunzipSync(runtimeGzip).toString('utf8'));
if (!Array.isArray(runtime?.files)) {
  throw new Error(`Invalid runtime file table in ${runtimePath}`);
}

const modulePrefix = '/lib/js-debug/';
const modules = runtime.files.flatMap((entry) => {
  if (!Array.isArray(entry) || entry.length !== 2) return [];
  const [filePath, source] = entry;
  if (typeof filePath !== 'string' || !filePath.startsWith(modulePrefix) || !filePath.endsWith('.mjs')) {
    return [];
  }
  const filename = filePath.slice(modulePrefix.length);
  if (typeof source !== 'string' || path.posix.basename(filename) !== filename) {
    throw new Error(`Invalid precompiled module in ${runtimePath}: ${filePath}`);
  }
  return [[filename, source]];
});
if (modules.length !== manifest.staticPrecompiledModules) {
  throw new Error(
    `Precompiled module count mismatch: expected ${manifest.staticPrecompiledModules}, received ${modules.length}`,
  );
}
if (new Set(modules.map(([filename]) => filename)).size !== modules.length) {
  throw new Error(`Duplicate precompiled module filename in ${runtimePath}`);
}

const target = path.join(releasesRoot, release);
const precompiledTarget = path.join(target, 'precompiled');
await rm(releasesRoot, { recursive: true, force: true });
await mkdir(precompiledTarget, { recursive: true });
await Promise.all([
  writeFile(path.join(target, 'koka-runtime.json.gz'), runtimeGzip),
  ...wasmAssets.map(({ filename, bytes }) => writeFile(path.join(target, filename), bytes)),
  ...modules.map(([filename, source]) => (
    writeFile(path.join(precompiledTarget, filename), source, 'utf8')
  )),
]);
await writeFile(
  releaseManifestPath,
  `${JSON.stringify({ id: release, ...releaseDescriptor }, null, 2)}\n`,
  'utf8',
);

console.log(`Staged Koka runtime release ${release}.`);
