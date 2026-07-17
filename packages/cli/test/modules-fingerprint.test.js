import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { discoverProject } from "../src/discovery.js";
import { createFingerprint } from "../src/fingerprint.js";
import { createModuleIndex } from "../src/modules.js";
import { createApp, createPackage } from "./helpers.js";

test("detects duplicate Koka module names before compilation", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "kokaine-module-conflict-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await createApp(root, { dependencies: { library: "1.0.0" } });
  await createPackage(path.join(root, "node_modules", "library"), {
    name: "library",
    version: "1.0.0",
    koka: { sources: ["src"], compiler: "*", targets: ["jsweb"] }
  }, [["src/main.kk", "app/main"]]);
  const discovery = await discoverProject(root);
  await assert.rejects(() => createModuleIndex(discovery.sourceRoots), (error) => error.code === "KOKA_MODULE_CONFLICT");
});

test("produces a stable graph fingerprint independent of discovery repetition", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "kokaine-fingerprint-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await createApp(root, { dependencies: { zebra: "1.0.0", alpha: "1.0.0" } });
  for (const name of ["zebra", "alpha"]) {
    await createPackage(path.join(root, "node_modules", name), {
      name,
      version: "1.0.0",
      koka: { sources: ["src"], compiler: "*", targets: ["jsweb"] }
    }, [[`src/${name}.kk`, name]]);
  }
  const first = await discoverProject(root);
  const second = await discoverProject(root);
  assert.equal(createFingerprint(first), createFingerprint(second));
  assert.notEqual(createFingerprint(first), createFingerprint(first, ["--optimize=2"]));
  assert.deepEqual(first.packages.map(({ package: dependency }) => dependency.name), ["alpha", "zebra"]);
});
