// Load a Koka JavaScript sidecar (an `extern import { js file ... }` file) the
// way the Koka compiler uses it: pasted verbatim into a strict-mode module
// scope. Each call gets a fresh VM realm, so `globalThis` registries
// (`Symbol.for('kokaine.dom.*')`) never leak between tests.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

export const SIDECARS = {
  dom: { kk: 'packages/core/src/kokaine/dom.kk', js: 'packages/core/src/kokaine/dom-inline.js', prefix: 'kokaineDom' },
  asyncWeb: { kk: 'packages/core/src/kokaine/async/web.kk', js: 'packages/core/src/kokaine/async/web-inline.js', prefix: 'kokaineAsyncWeb' },
  window: { kk: 'packages/core/src/kokaine/web/window.kk', js: 'packages/core/src/kokaine/web/window-inline.js', prefix: 'kokaineWindow' },
};

const repoRoot = new URL('../../', import.meta.url);

export function readRepoFile(relative) {
  // Normalise CRLF: Windows checkouts may convert line endings.
  return readFileSync(new URL(relative, repoRoot), 'utf8').replace(/\r\n/g, '\n');
}

/** Top-level function names declared by a sidecar source. */
export function declaredFunctions(source) {
  return [...source.matchAll(/^function ([A-Za-z_$][\w$]*)\s*\(/gm)].map((match) => match[1]);
}

/**
 * Evaluate a sidecar in a new realm. `globals` are installed on that realm's
 * `globalThis` first. Returns `{ fns, realm }`, where `fns` maps every
 * declared function name to the function and `realm` is the realm's global.
 */
export function loadSidecar(relative, globals = {}) {
  const source = readRepoFile(relative);
  const sandbox = vm.createContext({});
  for (const [name, value] of Object.entries(globals)) sandbox[name] = value;
  const names = declaredFunctions(source);
  // Return the realm's own `globalThis`: unlike the contextified sandbox
  // object it exposes the realm's builtins and symbol-keyed registries.
  return vm.runInContext(
    `"use strict";\n${source}\n;({ fns: { ${names.join(', ')} }, realm: globalThis });`,
    sandbox,
    { filename: relative },
  );
}
