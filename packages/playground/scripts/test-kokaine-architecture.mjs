import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const sourceRoot = path.join(packageRoot, 'src');

async function exists(relativePath) {
  try {
    await access(path.join(packageRoot, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function collectFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const candidate = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(candidate));
    else files.push(candidate);
  }
  return files;
}

assert.equal(
  await exists('koka/playground/main.kk'),
  true,
  'the playground workbench must have a Koka entry module',
);
assert.equal(
  await exists('src/index.ts'),
  true,
  'the browser bootstrap must be framework-neutral TypeScript',
);
assert.equal(
  await exists('src/host/index.ts'),
  true,
  'browser-only services must live behind the playground host adapter',
);

const manifest = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
for (const dependency of ['solid-js', 'lucide-solid', 'vite-plugin-solid']) {
  assert.equal(
    dependency in (manifest.dependencies ?? {}) || dependency in (manifest.devDependencies ?? {}),
    false,
    `${dependency} must not remain in the migrated playground runtime`,
  );
}

const frameworkSources = (await collectFiles(sourceRoot))
  .filter((file) => file.endsWith('.tsx') || file.endsWith('.jsx'));
assert.deepEqual(
  frameworkSources,
  [],
  `the migrated playground must not retain JSX sources: ${frameworkSources.join(', ')}`,
);

console.log('playground architecture: Kokaine workbench with a framework-neutral browser host');
