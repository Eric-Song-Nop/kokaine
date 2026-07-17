import assert from "node:assert/strict";
import test from "node:test";
import { createKokaineVitePlugin } from "../src/vite.js";

test("injects the virtual Koka entry before Vite processes index.html", () => {
  const plugin = createKokaineVitePlugin({ mainModule: "/project/.kokaine/generated/app_main__main.mjs" });
  assert.equal(plugin.transformIndexHtml.order, "pre");
  const transformed = plugin.transformIndexHtml.handler("<html><body><main></main></body></html>");
  assert.match(transformed, /<script type="module" src="\/@kokaine\/entry"><\/script>/);
  const resolved = plugin.resolveId("/@kokaine/entry");
  assert.equal(resolved, "\0virtual:kokaine-entry");
  assert.match(plugin.load(resolved), /app_main__main\.mjs/);
});

test("does not inject a duplicate explicit Kokaine entry", () => {
  const plugin = createKokaineVitePlugin({ mainModule: "/tmp/main.mjs" });
  const html = '<script type="module" src="/@kokaine/entry"></script>';
  assert.equal(plugin.transformIndexHtml.handler(html), html);
});
