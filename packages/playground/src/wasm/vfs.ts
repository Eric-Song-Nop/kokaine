/**
 * Browser-only virtual filesystem helpers for the Koka WASI compiler.
 *
 * The WASI implementation never receives access to the host filesystem. Every
 * path exposed to the compiler is assembled here from trusted, static assets.
 */

export type VfsFiles = Map<string, string>;

const NUL = '\0';

/**
 * Normalize and validate a path before exposing it through the WASI preopen.
 * Traversal is rejected instead of resolved so a malformed runtime bundle
 * cannot silently replace a different file.
 */
export function normalizeVfsPath(input: string): string {
  if (input.length === 0) throw new Error('VFS path must not be empty');
  if (input.includes(NUL)) throw new Error('VFS path must not contain NUL bytes');

  const parts = input.replaceAll('\\', '/').split('/');
  const normalized: string[] = [];

  for (const part of parts) {
    if (part === '' || part === '.') continue;
    if (part === '..') throw new Error(`VFS path traversal is not allowed: ${input}`);
    normalized.push(part);
  }

  if (normalized.length === 0) throw new Error(`VFS path does not name a file: ${input}`);
  return `/${normalized.join('/')}`;
}

/** Convert a Koka module name into its virtual source path. */
export function moduleSourcePath(moduleName: string): string {
  return normalizeVfsPath(`${moduleName.replaceAll('.', '/')}.kk`);
}

/**
 * Validate a module name accepted by the single-file playground.
 * Koka package separators (`/`) and the common `_`/`-` identifier characters
 * are supported, while paths and compiler flags cannot be smuggled through it.
 */
export function normalizeModuleName(input: string): string {
  const normalized = input.trim().replaceAll('.', '/');
  const parts = normalized.split('/');

  if (
    normalized.length === 0 ||
    normalized.length > 240 ||
    parts.some((part) => !/^[A-Za-z][A-Za-z0-9_-]*$/.test(part))
  ) {
    throw new Error(`Invalid Koka module name: ${input}`);
  }

  return parts.join('/');
}

/** Build an immutable-at-the-boundary VFS snapshot. Later inputs win. */
export function mergeVfsFiles(...sources: ReadonlyMap<string, string>[]): VfsFiles {
  const files = new Map<string, string>();

  for (const source of sources) {
    for (const [path, content] of source) {
      files.set(normalizeVfsPath(path), content);
    }
  }

  return files;
}

/** Return a fresh map so a compilation can safely add its user source. */
export function cloneVfsFiles(source: ReadonlyMap<string, string>): VfsFiles {
  return new Map(source);
}
