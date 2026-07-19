import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

const playgroundRoot = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const releaseManifestPath = fileURLToPath(new URL('./public/koka/release.json', import.meta.url));
const releaseManifest = JSON.parse(readFileSync(releaseManifestPath, 'utf8'));
const runtimeRelease = releaseManifest?.id;
if (typeof runtimeRelease !== 'string' || !/^[0-9a-f]{64}$/i.test(runtimeRelease)) {
  throw new Error(`Invalid runtime release ID in ${releaseManifestPath}`);
}
const isolationHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  // The opaque-origin preview imports self-hosted generated runtime modules.
  'Cross-Origin-Resource-Policy': 'cross-origin',
  'Access-Control-Allow-Origin': '*',
};

export default defineConfig({
  root: playgroundRoot,
  appType: 'mpa',
  plugins: [solid()],
  define: {
    __KOKAINE_RUNTIME_RELEASE__: JSON.stringify(runtimeRelease),
  },
  build: {
    target: 'es2022',
  },
  server: {
    host: '127.0.0.1',
    headers: isolationHeaders,
    fs: {
      allow: [repoRoot],
    },
  },
  preview: {
    host: '127.0.0.1',
    headers: isolationHeaders,
  },
});
