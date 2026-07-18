import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

const playgroundRoot = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const isolationHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  // The opaque-origin preview imports self-hosted generated runtime modules.
  'Cross-Origin-Resource-Policy': 'cross-origin',
  'Access-Control-Allow-Origin': '*',
};

export default defineConfig({
  root: playgroundRoot,
  plugins: [solid()],
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
