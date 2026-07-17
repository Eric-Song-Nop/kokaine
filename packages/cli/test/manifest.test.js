import assert from "node:assert/strict";
import { mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { loadDependencyManifest, loadProject } from "../src/manifest.js";
import { createApp, createPackage, writeJson } from "./helpers.js";

test("loads project defaults and canonical source roots", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "kokaine-manifest-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await createApp(root);
  const project = await loadProject(root);
  assert.equal(project.config.entryRelative, path.join("src", "app", "main.kk"));
  assert.equal(project.config.outDirRelative, path.join(".kokaine", "generated"));
  assert.deepEqual(project.config.sourceRelatives, ["src"]);
  assert.equal(project.config.compiler, "3.2.3");
});

test("requires an exact compiler version and rejects unknown fields", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "kokaine-manifest-invalid-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await createApp(root);
  const file = path.join(root, "package.json");
  const manifest = JSON.parse(await (await import("node:fs/promises")).readFile(file, "utf8"));
  manifest.kokaine.compiler = "^3.2.3";
  await writeJson(file, manifest);
  await assert.rejects(() => loadProject(root), (error) => error.code === "MANIFEST_COMPILER_NOT_EXACT");
  manifest.kokaine.compiler = "3.2.3";
  manifest.kokaine.typo = true;
  await writeJson(file, manifest);
  await assert.rejects(() => loadProject(root), (error) => error.code === "MANIFEST_UNKNOWN_FIELD");
});

test("rejects a dependency source symlink that escapes its package", async (t) => {
  const parent = await mkdtemp(path.join(tmpdir(), "kokaine-source-escape-"));
  t.after(() => rm(parent, { recursive: true, force: true }));
  const root = path.join(parent, "package");
  const outside = path.join(parent, "outside");
  await createPackage(root, {
    name: "unsafe-package",
    version: "1.0.0",
    koka: { sources: ["src"], compiler: "*", targets: ["jsweb"] }
  });
  await createPackage(outside, { name: "outside", version: "1.0.0" });
  await symlink(outside, path.join(root, "src"), process.platform === "win32" ? "junction" : "dir");
  await assert.rejects(() => loadDependencyManifest(root), (error) => error.code === "MANIFEST_PATH_ESCAPE");
});
