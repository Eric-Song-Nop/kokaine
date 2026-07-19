import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = fileURLToPath(new URL('..', import.meta.url));
const distKokaRoot = path.join(packageRoot, 'dist', 'koka');
const stableRuntimePaths = [
  'koka-playground.wasm',
  'koka-lsp.wasm',
  'koka-runtime.json.gz',
  'precompiled',
];

await Promise.all(stableRuntimePaths.map((relativePath) => (
  rm(path.join(distKokaRoot, relativePath), { recursive: true, force: true })
)));

console.log('Removed unversioned Koka runtime assets from the production build.');
