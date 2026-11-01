// Fetch, verify, and stage the pinned Koka browser assets.
//
//   node scripts/sync-koka-assets.mjs           ensure (default): make
//       public/koka/{koka-playground.wasm,koka-lsp.wasm,koka-runtime.json.gz}
//       match the SHA-256 pins in the tracked public/koka/assets.json, using the
//       local cache or the network. Never rewrites assets.json.
//   node scripts/sync-koka-assets.mjs --update  rebuild the runtime bundle from
//       the pinned upstream sources plus vendor/kokaine-precompiled-v3.2.4 and
//       rewrite public/koka/assets.json (after `smoke-wasm --update-kokaine-cache`).
//
// Downloads are cached outside the repository in a content-addressed store
// (KOKAINE_CACHE_DIR, else $XDG_CACHE_HOME/kokaine, else %LOCALAPPDATA%/kokaine/cache,
// else ~/.cache/kokaine, under `playground/`). Set KOKAINE_OFFLINE=1 to forbid
// network access and use only that cache.
import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const UPSTREAM_COMMIT = 'c0f1a10a60b8644fd6f08dfcec654fa815c06e3f';
const COMPILER_VERSION = '3.2.4';
const BROWSER_REPL_COMMIT = '32fee7eda6397dee81f4752ff7cab4e4001d3eb2';
const RAW_ROOT = `https://raw.githubusercontent.com/koka-lang/koka/${UPSTREAM_COMMIT}/playground`;
const PACKAGE_ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const KOKA_DIR = path.join(PACKAGE_ROOT, 'public', 'koka');
const MANIFEST_PATH = path.join(KOKA_DIR, 'assets.json');
const RUNTIME_PATH = path.join(KOKA_DIR, 'koka-runtime.json.gz');
// Legacy output: an unversioned copy of the precompiled modules. Nothing reads
// it (the served copy is staged under releases/<id>/precompiled/ by
// stage-runtime-release.mjs), so it is removed rather than regenerated.
const LEGACY_PRECOMPILED_DIR = path.join(KOKA_DIR, 'precompiled');
const KOKAINE_PRECOMPILED_DIR = path.join(PACKAGE_ROOT, 'vendor', 'kokaine-precompiled-v3.2.4');
// Downloaded from the pinned upstream commit; not tracked in git.
const EXPECTED_WASM = {
  'koka-playground.wasm': 'e4c77ffd06391435865d7e6aef7d7ecabb211601dfa181e1c6b819633959c660',
  'koka-lsp.wasm': 'ce950710f27fda0f325d9046885d525f3e87daf30d93be1d45058d556c6039c0',
};
// Built from the BROWSER_REPL_COMMIT fork and checked in: there is no
// immutable upstream download for it, so it stays tracked.
const BUNDLED_WASM = {
  'koka-browser-repl.wasm': '5ee587122a58da95b4bbbaaee8d946ef3f2bec1c9da4a21d70fdb34e2ad80afd',
};

const update = process.argv.includes('--update');
const offline = process.argv.includes('--offline') || /^(1|true|yes)$/i.test(process.env.KOKAINE_OFFLINE ?? '');

function cacheRoot(environment = process.env, platform = process.platform) {
  // Mirrors packages/cli/src/toolchain.js defaultCacheDirectory().
  let base;
  if (environment.KOKAINE_CACHE_DIR) base = path.resolve(environment.KOKAINE_CACHE_DIR);
  else if (environment.XDG_CACHE_HOME) base = path.join(environment.XDG_CACHE_HOME, 'kokaine');
  else if (platform === 'win32' && environment.LOCALAPPDATA) base = path.join(environment.LOCALAPPDATA, 'kokaine', 'cache');
  else base = path.join(homedir(), '.cache', 'kokaine');
  return path.join(base, 'playground');
}

const CACHE_ROOT = cacheRoot();
const stats = { downloadedFiles: 0, downloadedBytes: 0, cachedFiles: 0, downloadMs: 0 };

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function mib(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}

async function readOptional(filePath) {
  try {
    return await readFile(filePath);
  } catch (error) {
    if (error?.code === 'ENOENT') return null;
    throw error;
  }
}

async function writeAtomic(filePath, bytes) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temporary, bytes);
  await rename(temporary, filePath);
}

function assertRelativeAsset(asset) {
  if (typeof asset !== 'string' || asset.length === 0 || asset.startsWith('/') || asset.includes('..')) {
    throw new Error(`Unsafe upstream asset path: ${String(asset)}`);
  }
  return asset;
}

class OfflineError extends Error {}

async function download(relativePath, attempts = 5) {
  if (offline) {
    throw new OfflineError(
      `${relativePath} is not in the local cache (${CACHE_ROOT}) and KOKAINE_OFFLINE is set.`,
    );
  }
  const safePath = relativePath.split('/').map(encodeURIComponent).join('/');
  const url = `${RAW_ROOT}/${safePath}`;
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const startedAt = performance.now();
    try {
      const response = await fetch(url, { redirect: 'follow' });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      stats.downloadedFiles += 1;
      stats.downloadedBytes += bytes.byteLength;
      stats.downloadMs += performance.now() - startedAt;
      return bytes;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 350 * attempt));
    }
  }
  throw new OfflineError(
    `Unable to download ${url} after ${attempts} attempts (${String(lastError?.cause ?? lastError)}), `
    + `and it is not in the local cache (${CACHE_ROOT}).`,
  );
}

// Content-addressed by SHA-256: used for the WASM programs and the runtime bundle.
async function fetchPinned(relativePath, expectedHash) {
  const cachePath = path.join(CACHE_ROOT, 'sha256', expectedHash);
  const cached = await readOptional(cachePath);
  if (cached && sha256(cached) === expectedHash) {
    stats.cachedFiles += 1;
    return cached;
  }
  const bytes = await download(relativePath);
  const actualHash = sha256(bytes);
  if (actualHash !== expectedHash) {
    throw new Error(`${relativePath} SHA-256 mismatch: expected ${expectedHash}, received ${actualHash}`);
  }
  await writeAtomic(cachePath, bytes);
  return bytes;
}

// Upstream text sources are addressed by the immutable commit. The rebuilt
// runtime bundle is verified against its pinned SHA-256 in ensure mode.
async function fetchUpstreamSource(relativePath) {
  const cachePath = path.join(CACHE_ROOT, 'koka-src', UPSTREAM_COMMIT, ...relativePath.split('/'));
  const cached = await readOptional(cachePath);
  if (cached) {
    stats.cachedFiles += 1;
    return cached;
  }
  const bytes = await download(relativePath);
  await writeAtomic(cachePath, bytes);
  return bytes;
}

async function mapConcurrent(values, concurrency, worker) {
  const results = new Array(values.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(concurrency, values.length) }, async () => {
    while (cursor < values.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(values[index], index);
    }
  });
  await Promise.all(runners);
  return results;
}

async function buildRuntime() {
  const [stdlibManifest, precompiledManifest] = await Promise.all([
    fetchUpstreamSource('stdlib-manifest.json').then((bytes) => JSON.parse(bytes.toString('utf8'))),
    fetchUpstreamSource('precompiled-manifest.json').then((bytes) => JSON.parse(bytes.toString('utf8'))),
  ]);
  if (!Array.isArray(stdlibManifest) || !Array.isArray(precompiledManifest)) {
    throw new Error('Unexpected Koka playground manifest format.');
  }

  const stdlibFiles = await mapConcurrent(stdlibManifest.map(assertRelativeAsset), 12, async (filename) => {
    const source = (await fetchUpstreamSource(`lib/${filename}`)).toString('utf8');
    return [`/share/lib/${filename}`, source];
  });
  const precompiledFiles = await mapConcurrent(precompiledManifest.map(assertRelativeAsset), 12, async (filename) => {
    const source = (await fetchUpstreamSource(`precompiled/${filename}`)).toString('utf8');
    return [`/lib/js-debug/${filename}`, source];
  });

  const kokaineManifest = JSON.parse(
    await readFile(path.join(KOKAINE_PRECOMPILED_DIR, 'manifest.json'), 'utf8'),
  );
  if (kokaineManifest.compilerVersion !== COMPILER_VERSION
      || kokaineManifest.compilerCommit !== UPSTREAM_COMMIT
      || !Array.isArray(kokaineManifest.files)) {
    throw new Error('Vendored Kokaine precompiled manifest does not match the pinned compiler.');
  }
  const kokainePrecompiledFiles = await mapConcurrent(kokaineManifest.files, 12, async (entry) => {
    if (!entry || typeof entry.name !== 'string' || !/^kokaine_[a-z0-9_]+\.(?:kki|mjs)$/.test(entry.name)) {
      throw new Error(`Invalid vendored Kokaine precompiled entry: ${JSON.stringify(entry)}`);
    }
    const bytes = await readFile(path.join(KOKAINE_PRECOMPILED_DIR, entry.name));
    if (bytes.byteLength !== entry.bytes || sha256(bytes) !== entry.sha256) {
      throw new Error(`Vendored Kokaine precompiled file failed verification: ${entry.name}`);
    }
    return [`/lib/js-debug/${entry.name}`, bytes.toString('utf8')];
  });

  const runtime = {
    schemaVersion: 1,
    compilerVersion: COMPILER_VERSION,
    upstreamCommit: UPSTREAM_COMMIT,
    files: [...stdlibFiles, ...precompiledFiles, ...kokainePrecompiledFiles],
  };
  const runtimeJson = Buffer.from(JSON.stringify(runtime), 'utf8');
  const runtimeGzip = gzipSync(runtimeJson, { level: 9 });
  // zlib records the host OS at byte 9; normalize it so macOS and Linux produce identical assets.
  runtimeGzip[9] = 255;
  return {
    runtimeGzip,
    info: {
      files: runtime.files.length,
      jsonBytes: runtimeJson.byteLength,
      gzipBytes: runtimeGzip.byteLength,
      sha256: sha256(runtimeGzip),
    },
    staticPrecompiledModules: precompiledManifest.filter((name) => name.endsWith('.mjs')).length
      + kokaineManifest.files.filter((entry) => entry.name.endsWith('.mjs')).length,
    kokainePrecompiledFiles: kokainePrecompiledFiles.length,
  };
}

async function ensureWasm(filename, expectedHash) {
  const target = path.join(KOKA_DIR, filename);
  const existing = await readOptional(target);
  if (existing && sha256(existing) === expectedHash) return existing;
  const bytes = await fetchPinned(filename, expectedHash);
  await writeAtomic(target, bytes);
  return bytes;
}

async function verifyBundledWasm() {
  const metadata = {};
  for (const [filename, expectedHash] of Object.entries(BUNDLED_WASM)) {
    const bytes = await readFile(path.join(KOKA_DIR, filename));
    const actualHash = sha256(bytes);
    if (actualHash !== expectedHash) {
      throw new Error(`${filename} SHA-256 mismatch: expected ${expectedHash}, received ${actualHash}`);
    }
    metadata[filename] = { bytes: bytes.byteLength, sha256: actualHash };
  }
  return metadata;
}

async function ensure() {
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
  if (manifest.upstreamCommit !== UPSTREAM_COMMIT || manifest.compilerVersion !== COMPILER_VERSION) {
    throw new Error(`${MANIFEST_PATH} does not match the pins in sync-koka-assets.mjs; run with --update.`);
  }
  for (const [filename, expectedHash] of Object.entries({ ...EXPECTED_WASM, ...BUNDLED_WASM })) {
    if (manifest.wasm?.[filename]?.sha256 !== expectedHash) {
      throw new Error(`${MANIFEST_PATH} pins a different ${filename}; run with --update.`);
    }
  }
  await verifyBundledWasm();
  for (const [filename, expectedHash] of Object.entries(EXPECTED_WASM)) {
    await ensureWasm(filename, expectedHash);
  }

  const expectedRuntimeHash = manifest.runtime?.sha256;
  if (typeof expectedRuntimeHash !== 'string' || !/^[0-9a-f]{64}$/.test(expectedRuntimeHash)) {
    throw new Error(`Invalid runtime SHA-256 in ${MANIFEST_PATH}`);
  }
  const existingRuntime = await readOptional(RUNTIME_PATH);
  if (!existingRuntime || sha256(existingRuntime) !== expectedRuntimeHash) {
    const runtimeCachePath = path.join(CACHE_ROOT, 'sha256', expectedRuntimeHash);
    let runtimeGzip = await readOptional(runtimeCachePath);
    if (runtimeGzip && sha256(runtimeGzip) === expectedRuntimeHash) {
      stats.cachedFiles += 1;
    } else {
      ({ runtimeGzip } = await buildRuntime());
      const actualHash = sha256(runtimeGzip);
      if (actualHash !== expectedRuntimeHash) {
        throw new Error(
          `Rebuilt koka-runtime.json.gz does not match ${MANIFEST_PATH}: expected ${expectedRuntimeHash}, `
          + `received ${actualHash}. If vendor/kokaine-precompiled-v3.2.4 changed, run `
          + '`pnpm --filter @kokaine/playground run assets:koka:update` and commit assets.json; '
          + `otherwise delete the source cache at ${path.join(CACHE_ROOT, 'koka-src')} and retry.`,
        );
      }
      await writeAtomic(runtimeCachePath, runtimeGzip);
    }
    await writeAtomic(RUNTIME_PATH, runtimeGzip);
  }
  await rm(LEGACY_PRECOMPILED_DIR, { recursive: true, force: true });
}

async function rebuildManifest() {
  await mkdir(KOKA_DIR, { recursive: true });
  const wasmMetadata = {};
  for (const [filename, expectedHash] of Object.entries(EXPECTED_WASM)) {
    const bytes = await ensureWasm(filename, expectedHash);
    wasmMetadata[filename] = { bytes: bytes.byteLength, sha256: expectedHash };
  }
  Object.assign(wasmMetadata, await verifyBundledWasm());

  const { runtimeGzip, info, staticPrecompiledModules, kokainePrecompiledFiles } = await buildRuntime();
  await writeAtomic(path.join(CACHE_ROOT, 'sha256', info.sha256), runtimeGzip);
  await writeAtomic(RUNTIME_PATH, runtimeGzip);
  await rm(LEGACY_PRECOMPILED_DIR, { recursive: true, force: true });

  const metadata = {
    schemaVersion: 1,
    compilerVersion: COMPILER_VERSION,
    upstreamCommit: UPSTREAM_COMMIT,
    browserReplCommit: BROWSER_REPL_COMMIT,
    wasm: wasmMetadata,
    runtime: info,
    staticPrecompiledModules,
    kokainePrecompiledFiles,
  };
  await writeFile(MANIFEST_PATH, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');
  console.log(`Pinned Koka ${COMPILER_VERSION} browser assets from ${UPSTREAM_COMMIT}.`);
  console.log(`${info.files} VFS files; runtime bundle ${mib(info.gzipBytes)}.`);
}

const startedAt = performance.now();
try {
  if (update) await rebuildManifest();
  else await ensure();
} catch (error) {
  if (error instanceof OfflineError) {
    console.error(`sync-koka-assets: ${error.message}`);
    console.error(
      'The Koka browser assets are not tracked in git. Connect to the network once to populate '
      + `the cache at ${CACHE_ROOT}, or point KOKAINE_CACHE_DIR at a populated cache.`,
    );
    process.exit(1);
  }
  throw error;
}
const elapsed = ((performance.now() - startedAt) / 1000).toFixed(1);
if (stats.downloadedFiles > 0) {
  console.log(
    `Koka assets ready in ${elapsed}s: downloaded ${stats.downloadedFiles} files (${mib(stats.downloadedBytes)}), `
    + `${stats.cachedFiles} from cache ${CACHE_ROOT}.`,
  );
} else {
  console.log(`Koka assets verified in ${elapsed}s (${stats.cachedFiles} from cache ${CACHE_ROOT}).`);
}
