import { copyFile, cp, mkdir, readFile, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PACKAGE_ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const OUTPUT_DIR = path.join(PACKAGE_ROOT, 'public', 'devtools');
const require = createRequire(import.meta.url);

async function resolvePackageRoot(name) {
  let current = path.dirname(require.resolve(name));
  while (true) {
    try {
      const manifest = JSON.parse(await readFile(path.join(current, 'package.json'), 'utf8'));
      if (manifest.name === name) return current;
    } catch (error) {
      if (!error || error.code !== 'ENOENT') throw error;
    }

    const parent = path.dirname(current);
    if (parent === current) throw new Error(`Could not locate the ${name} package root.`);
    current = parent;
  }
}

const [CHII_ROOT, CHOBITSU_ROOT] = await Promise.all([
  resolvePackageRoot('chii'),
  resolvePackageRoot('chobitsu'),
]);

await rm(OUTPUT_DIR, { recursive: true, force: true });
await mkdir(path.join(OUTPUT_DIR, 'chii'), { recursive: true });

await Promise.all([
  copyFile(
    path.join(CHOBITSU_ROOT, 'dist', 'chobitsu.js'),
    path.join(OUTPUT_DIR, 'chobitsu.min.js'),
  ),
  copyFile(
    path.join(CHOBITSU_ROOT, 'LICENSE'),
    path.join(OUTPUT_DIR, 'CHOBITSU-LICENSE'),
  ),
  copyFile(
    path.join(CHII_ROOT, 'LICENSE'),
    path.join(OUTPUT_DIR, 'CHII-LICENSE'),
  ),
  copyFile(
    path.join(CHII_ROOT, 'public', 'front_end', 'third_party', 'polyfill', 'customElement.js'),
    path.join(OUTPUT_DIR, 'custom-elements.js'),
  ),
  cp(
    path.join(CHII_ROOT, 'public', 'front_end'),
    path.join(OUTPUT_DIR, 'chii'),
    { recursive: true },
  ),
]);

console.log('Copied self-hosted Chii and Chobitsu browser DevTools assets.');
