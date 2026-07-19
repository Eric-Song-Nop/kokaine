import { mergeVfsFiles, normalizeVfsPath, type VfsFiles } from './vfs';

export const RUNTIME_RELEASE = __KOKAINE_RUNTIME_RELEASE__;
export const DEFAULT_RUNTIME_BUNDLE_PATH =
  `koka/releases/${RUNTIME_RELEASE}/koka-runtime.json.gz`;
export const DEFAULT_PRECOMPILED_BASE_URL =
  `/koka/releases/${RUNTIME_RELEASE}/precompiled/`;
export const DEFAULT_COMPILER_WASM_PATH =
  `koka/releases/${RUNTIME_RELEASE}/koka-playground.wasm`;
export const DEFAULT_LSP_WASM_PATH =
  `koka/releases/${RUNTIME_RELEASE}/koka-lsp.wasm`;

const MAX_COMPRESSED_BUNDLE_BYTES = 64 * 1024 * 1024;
const MAX_DECOMPRESSED_BUNDLE_BYTES = 256 * 1024 * 1024;
const MAX_RUNTIME_FILES = 20_000;
const MAX_RUNTIME_FILE_BYTES = 16 * 1024 * 1024;

export interface KokaRuntimeBundle {
  schemaVersion: 1;
  compilerVersion: string;
  upstreamCommit: string;
  files: [path: string, content: string][];
}

export interface LoadedRuntimeAssets {
  compilerVersion: string;
  upstreamCommit: string;
  files: VfsFiles;
  runtimeFileCount: number;
  kokaineFileCount: number;
}

const rawKokaineModules = import.meta.glob<string>(
  '../../../../src/kokaine/**/*.kk',
  { query: '?raw', import: 'default', eager: true },
);

/** Resolve a public asset against Vite's configured deployment base. */
export function resolvePublicAssetUrl(
  supplied: string | URL | undefined,
  defaultPath: string,
): URL {
  const pageUrl = typeof location === 'undefined' ? 'http://localhost/' : location.href;
  if (supplied !== undefined) return new URL(supplied.toString(), pageUrl);

  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return new URL(`${normalizedBase}${defaultPath}`, pageUrl);
}

/** Mount Kokaine sources at the exact path used to build their cached `.kki` files. */
export function loadBundledKokaineSources(): VfsFiles {
  const files = new Map<string, string>();
  const sourceMarker = '/src/kokaine/';
  const vfsRoot = '/share/lib/kokaine/';

  for (const [modulePath, content] of Object.entries(rawKokaineModules)) {
    if (typeof content !== 'string') {
      throw new Error(`Kokaine source was not loaded as text: ${modulePath}`);
    }

    const portablePath = modulePath.replaceAll('\\', '/');
    const markerIndex = portablePath.lastIndexOf(sourceMarker);
    if (markerIndex < 0) {
      throw new Error(`Cannot derive Kokaine VFS path from: ${modulePath}`);
    }

    const relativePath = portablePath.slice(markerIndex + sourceMarker.length);
    files.set(normalizeVfsPath(`${vfsRoot}${relativePath}`), content);
  }

  return files;
}

export async function loadRuntimeAssets(
  runtimeUrl?: string | URL,
  signal?: AbortSignal,
): Promise<LoadedRuntimeAssets> {
  const url = resolvePublicAssetUrl(runtimeUrl, DEFAULT_RUNTIME_BUNDLE_PATH);
  const response = await fetch(url, {
    signal,
    credentials: 'same-origin',
    cache: 'force-cache',
  });

  if (!response.ok) {
    throw new Error(`Failed to load Koka runtime bundle (${response.status} ${response.statusText})`);
  }

  const advertisedLength = Number(response.headers.get('content-length') ?? 0);
  if (advertisedLength > MAX_COMPRESSED_BUNDLE_BYTES) {
    throw new Error(`Koka runtime bundle is unexpectedly large: ${advertisedLength} bytes`);
  }

  const encoded = new Uint8Array(await response.arrayBuffer());
  if (encoded.byteLength > MAX_COMPRESSED_BUNDLE_BYTES) {
    throw new Error(`Koka runtime bundle exceeds ${MAX_COMPRESSED_BUNDLE_BYTES} bytes`);
  }

  const decoded = await decodeMaybeGzip(encoded);
  if (decoded.byteLength > MAX_DECOMPRESSED_BUNDLE_BYTES) {
    throw new Error(`Expanded Koka runtime bundle exceeds ${MAX_DECOMPRESSED_BUNDLE_BYTES} bytes`);
  }

  const bundle = parseRuntimeBundle(decoded);
  const runtimeFiles = new Map<string, string>();
  const encoder = new TextEncoder();

  for (const [path, content] of bundle.files) {
    const normalizedPath = normalizeVfsPath(path);
    if (runtimeFiles.has(normalizedPath)) {
      throw new Error(`Duplicate path in Koka runtime bundle: ${normalizedPath}`);
    }
    if (encoder.encode(content).byteLength > MAX_RUNTIME_FILE_BYTES) {
      throw new Error(`Runtime file is unexpectedly large: ${normalizedPath}`);
    }
    runtimeFiles.set(normalizedPath, content);
  }

  const kokaineFiles = loadBundledKokaineSources();
  return {
    compilerVersion: bundle.compilerVersion,
    upstreamCommit: bundle.upstreamCommit,
    // Mount readable Kokaine sources first, then the matching precompiled
    // runtime cache so `.kki`/`.mjs` artifacts are available for cache hits.
    files: mergeVfsFiles(kokaineFiles, runtimeFiles),
    runtimeFileCount: runtimeFiles.size,
    kokaineFileCount: kokaineFiles.size,
  };
}

async function decodeMaybeGzip(encoded: Uint8Array): Promise<Uint8Array> {
  const isGzip = encoded[0] === 0x1f && encoded[1] === 0x8b;
  if (!isGzip) return encoded;

  if (typeof DecompressionStream === 'undefined') {
    throw new Error('This browser cannot decompress the Koka runtime bundle');
  }

  const input = new Blob([encoded.slice().buffer]).stream();
  const output = input.pipeThrough(new DecompressionStream('gzip'));
  return new Uint8Array(await new Response(output).arrayBuffer());
}

function parseRuntimeBundle(bytes: Uint8Array): KokaRuntimeBundle {
  let value: unknown;
  try {
    value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch (error) {
    throw new Error('Koka runtime bundle is not valid UTF-8 JSON', { cause: error });
  }

  if (!isRecord(value) || value.schemaVersion !== 1) {
    throw new Error('Unsupported Koka runtime bundle schema');
  }
  if (typeof value.compilerVersion !== 'string' || value.compilerVersion.length === 0) {
    throw new Error('Koka runtime bundle has no compiler version');
  }
  if (
    typeof value.upstreamCommit !== 'string' ||
    !/^[0-9a-f]{7,64}$/i.test(value.upstreamCommit)
  ) {
    throw new Error('Koka runtime bundle has an invalid upstream commit');
  }
  if (!Array.isArray(value.files) || value.files.length > MAX_RUNTIME_FILES) {
    throw new Error(`Koka runtime bundle must contain at most ${MAX_RUNTIME_FILES} files`);
  }

  const files: [string, string][] = [];
  for (const entry of value.files) {
    if (
      !Array.isArray(entry) ||
      entry.length !== 2 ||
      typeof entry[0] !== 'string' ||
      typeof entry[1] !== 'string'
    ) {
      throw new Error('Koka runtime bundle contains an invalid file entry');
    }
    files.push([entry[0], entry[1]]);
  }

  return {
    schemaVersion: 1,
    compilerVersion: value.compilerVersion,
    upstreamCommit: value.upstreamCommit,
    files,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
