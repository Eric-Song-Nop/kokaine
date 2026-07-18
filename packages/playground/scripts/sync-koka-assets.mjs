import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const UPSTREAM_COMMIT = 'c0f1a10a60b8644fd6f08dfcec654fa815c06e3f';
const COMPILER_VERSION = '3.2.4';
const RAW_ROOT = `https://raw.githubusercontent.com/koka-lang/koka/${UPSTREAM_COMMIT}/playground`;
const PACKAGE_ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const KOKA_DIR = path.join(PACKAGE_ROOT, 'public', 'koka');
const PRECOMPILED_DIR = path.join(KOKA_DIR, 'precompiled');
const KOKAINE_PRECOMPILED_DIR = path.join(PACKAGE_ROOT, 'vendor', 'kokaine-precompiled-v3.2.4');
const EXPECTED_WASM = {
  'koka-playground.wasm': 'e4c77ffd06391435865d7e6aef7d7ecabb211601dfa181e1c6b819633959c660',
  'koka-lsp.wasm': 'ce950710f27fda0f325d9046885d525f3e87daf30d93be1d45058d556c6039c0',
};

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function assertRelativeAsset(asset) {
  if (typeof asset !== 'string' || asset.length === 0 || asset.startsWith('/') || asset.includes('..')) {
    throw new Error(`Unsafe upstream asset path: ${String(asset)}`);
  }
  return asset;
}

async function fetchBytes(relativePath, attempts = 5) {
  const safePath = relativePath.split('/').map(encodeURIComponent).join('/');
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(`${RAW_ROOT}/${safePath}`, { redirect: 'follow' });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 350 * attempt));
    }
  }
  throw new Error(`Unable to download ${relativePath}: ${String(lastError)}`);
}

async function fetchJson(relativePath) {
  return JSON.parse((await fetchBytes(relativePath)).toString('utf8'));
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

async function main() {
  const [stdlibManifest, precompiledManifest] = await Promise.all([
    fetchJson('stdlib-manifest.json'),
    fetchJson('precompiled-manifest.json'),
  ]);

  if (!Array.isArray(stdlibManifest) || !Array.isArray(precompiledManifest)) {
    throw new Error('Unexpected Koka playground manifest format.');
  }

  await mkdir(KOKA_DIR, { recursive: true });
  await rm(PRECOMPILED_DIR, { recursive: true, force: true });
  await mkdir(PRECOMPILED_DIR, { recursive: true });

  const wasmMetadata = {};
  for (const [filename, expectedHash] of Object.entries(EXPECTED_WASM)) {
    const bytes = await fetchBytes(filename);
    const actualHash = sha256(bytes);
    if (actualHash !== expectedHash) {
      throw new Error(`${filename} SHA-256 mismatch: expected ${expectedHash}, received ${actualHash}`);
    }
    await writeFile(path.join(KOKA_DIR, filename), bytes);
    wasmMetadata[filename] = { bytes: bytes.byteLength, sha256: actualHash };
  }

  const stdlibFiles = await mapConcurrent(stdlibManifest.map(assertRelativeAsset), 12, async (filename) => {
    const source = (await fetchBytes(`lib/${filename}`)).toString('utf8');
    return [`/share/lib/${filename}`, source];
  });

  const precompiledFiles = await mapConcurrent(precompiledManifest.map(assertRelativeAsset), 12, async (filename) => {
    const source = (await fetchBytes(`precompiled/${filename}`)).toString('utf8');
    if (filename.endsWith('.mjs')) {
      await writeFile(path.join(PRECOMPILED_DIR, filename), source, 'utf8');
    }
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
    const source = bytes.toString('utf8');
    if (entry.name.endsWith('.mjs')) {
      await writeFile(path.join(PRECOMPILED_DIR, entry.name), source, 'utf8');
    }
    return [`/lib/js-debug/${entry.name}`, source];
  });

  const runtime = {
    schemaVersion: 1,
    compilerVersion: COMPILER_VERSION,
    upstreamCommit: UPSTREAM_COMMIT,
    files: [...stdlibFiles, ...precompiledFiles, ...kokainePrecompiledFiles],
  };
  const runtimeJson = Buffer.from(JSON.stringify(runtime), 'utf8');
  const runtimeGzip = gzipSync(runtimeJson, { level: 9 });
  await writeFile(path.join(KOKA_DIR, 'koka-runtime.json.gz'), runtimeGzip);

  const metadata = {
    schemaVersion: 1,
    compilerVersion: COMPILER_VERSION,
    upstreamCommit: UPSTREAM_COMMIT,
    wasm: wasmMetadata,
    runtime: {
      files: runtime.files.length,
      jsonBytes: runtimeJson.byteLength,
      gzipBytes: runtimeGzip.byteLength,
      sha256: sha256(runtimeGzip),
    },
    staticPrecompiledModules: precompiledManifest.filter((name) => name.endsWith('.mjs')).length
      + kokaineManifest.files.filter((entry) => entry.name.endsWith('.mjs')).length,
    kokainePrecompiledFiles: kokainePrecompiledFiles.length,
  };
  await writeFile(path.join(KOKA_DIR, 'assets.json'), `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');

  console.log(`Pinned Koka ${COMPILER_VERSION} browser assets from ${UPSTREAM_COMMIT}.`);
  console.log(`${runtime.files.length} VFS files; runtime bundle ${(runtimeGzip.byteLength / 1024 / 1024).toFixed(2)} MiB.`);
}

await main();
