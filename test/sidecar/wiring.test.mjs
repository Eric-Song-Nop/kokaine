// Every sidecar must be imported by its Koka module, and every `js inline`
// call into it must name a function it declares. Koka does not check the
// inline JavaScript, so a typo would otherwise only surface as a browser
// ReferenceError.
import assert from 'node:assert/strict';
import path from 'node:path';
import { describe, it } from 'node:test';
import { declaredFunctions, loadSidecar, readRepoFile, SIDECARS } from './load.mjs';

describe('Koka sidecar wiring', () => {
  for (const [key, { kk, js, prefix }] of Object.entries(SIDECARS)) {
    it(`${kk} <-> ${js}`, () => {
      const koka = readRepoFile(kk);
      const source = readRepoFile(js);

      const importPattern = new RegExp(
        `^extern import\\n(?:[ \\t]+\\w+ file "[^"]*"\\n)*?[ \\t]+js file "${path.basename(js).replace('.', '\\.')}"$`,
        'm',
      );
      assert.match(koka, importPattern, `${kk} must extern-import ${path.basename(js)}`);

      // Pasted into the generated module scope: top level is function
      // declarations only, all carrying the module prefix.
      for (const line of source.split('\n')) {
        if (!line || /^\s/.test(line) || line.startsWith('//') || line.startsWith('/*') || line.startsWith('}')) continue;
        assert.match(line, new RegExp(`^function ${prefix}[A-Z]\\w*\\(`), `${js}: unexpected top-level line: ${line}`);
      }

      const declared = declaredFunctions(source);
      assert.equal(new Set(declared).size, declared.length, `${js} declares a function twice`);
      const called = new Set(
        [...koka.matchAll(new RegExp(`\\b(${prefix}[A-Z]\\w*)\\(`, 'g'))].map((match) => match[1]),
      );
      assert.deepEqual([...called].filter((name) => !declared.includes(name)), [], `${kk} calls undeclared functions`);
      assert.deepEqual(declared.filter((name) => !called.has(name)), [], `${js} declares unused functions`);

      // Evaluates in a realm without a DOM: declarations only, no top-level effects.
      const { fns } = loadSidecar(js);
      for (const name of declared) assert.equal(typeof fns[name], 'function', `${key}.${name}`);
    });
  }
});
