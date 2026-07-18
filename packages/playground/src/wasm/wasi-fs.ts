/**
 * Adapted from koka-lang/koka's browser playground at commit
 * 94b2356a56eee5976174383ee35b0e9452aed9fe.
 * Koka is licensed under Apache-2.0; see the repository's third-party notice.
 */

import { Directory, File } from '@bjorn3/browser_wasi_shim';

import { normalizeVfsPath, type VfsFiles } from './vfs';

type WasiEntry = File | Directory;
const PRECOMPILED_PREFIX = '/lib/js-debug/';
// browser_wasi_shim defaults every in-memory mtime to zero. Koka only accepts
// a library interface when it is newer than the missing build-cache copy, so
// preserve the upstream playground's intended "far future" cache timestamp.
const PRECOMPILED_MTIME_NS = 2_000_000_000_000_000_000n;

class VfsFile extends File {
  constructor(data: Uint8Array, private readonly precompiled: boolean) {
    super(data);
  }

  override stat(): ReturnType<File['stat']> {
    const result = super.stat();
    if (this.precompiled) {
      result.atim = PRECOMPILED_MTIME_NS;
      result.mtim = PRECOMPILED_MTIME_NS;
      result.ctim = PRECOMPILED_MTIME_NS;
      // browser_wasi_shim 0.4.2 writes these three fields at unaligned offsets
      // 38/46/52. WASI Preview1 specifies 40/48/56; non-zero timestamps expose
      // the bug, so provide a corrected serializer for this filestat.
      result.write_bytes = (view: DataView, pointer: number) => {
        view.setBigUint64(pointer, result.dev, true);
        view.setBigUint64(pointer + 8, result.ino, true);
        view.setUint8(pointer + 16, result.filetype);
        view.setBigUint64(pointer + 24, result.nlink, true);
        view.setBigUint64(pointer + 32, result.size, true);
        view.setBigUint64(pointer + 40, result.atim, true);
        view.setBigUint64(pointer + 48, result.mtim, true);
        view.setBigUint64(pointer + 56, result.ctim, true);
      };
    }
    return result;
  }
}

/** Build one unified WASI root to avoid unsupported cross-mount operations. */
export function buildUnifiedTree(files: ReadonlyMap<string, string>): Directory {
  const root = new Map<string, WasiEntry>();
  const encoder = new TextEncoder();

  for (const [untrustedPath, content] of files) {
    const path = normalizeVfsPath(untrustedPath);
    const parts = path.slice(1).split('/');
    const filename = parts.pop();
    if (!filename) continue;

    let current = root;
    for (const part of parts) {
      const existing = current.get(part);
      if (existing instanceof File) {
        throw new Error(`VFS path conflicts with a file: ${path}`);
      }

      if (existing instanceof Directory) {
        current = existing.contents as Map<string, WasiEntry>;
        continue;
      }

      const directory = new Directory(new Map());
      current.set(part, directory);
      current = directory.contents as Map<string, WasiEntry>;
    }

    if (current.get(filename) instanceof Directory) {
      throw new Error(`VFS path conflicts with a directory: ${path}`);
    }
    current.set(filename, new VfsFile(
      encoder.encode(content),
      path.startsWith(PRECOMPILED_PREFIX),
    ));
  }

  return new Directory(root);
}

/** Recursively flatten a directory from browser_wasi_shim. */
export function collectFilesFromDirectory(
  directory: Directory,
  prefix: string,
  output: VfsFiles,
  decoder = new TextDecoder(),
): void {
  for (const [name, entry] of directory.contents) {
    const path = `${prefix}/${name}`;
    if (entry instanceof File) {
      output.set(normalizeVfsPath(path), decoder.decode(entry.data));
    } else if (entry instanceof Directory) {
      collectFilesFromDirectory(entry, path, output, decoder);
    }
  }
}

/** Collect only files produced in Koka's configured build directory. */
export function collectGeneratedFiles(root: Directory): VfsFiles {
  const generated = new Map<string, string>();
  const buildDirectory = root.contents.get('.koka');

  if (buildDirectory instanceof Directory) {
    collectFilesFromDirectory(buildDirectory, '/.koka', generated);
  }

  return generated;
}
