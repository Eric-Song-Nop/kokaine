import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { createProject } from "../src/create.js";

test("creates a complete npm-compatible Kokaine project", async (t) => {
  const parent = await mkdtemp(path.join(tmpdir(), "create-kokaine-"));
  t.after(() => rm(parent, { recursive: true, force: true }));
  const target = path.join(parent, "My App");
  await createProject(target);
  const manifest = JSON.parse(await readFile(path.join(target, "package.json"), "utf8"));
  assert.equal(manifest.name, "my-app");
  assert.equal(manifest.kokaine.compiler, "3.2.3");
  assert.equal(manifest.scripts.dev, "kokaine dev");
  assert.ok((await readdir(path.join(target, "src", "app"))).includes("main.kk"));
  assert.match(await readFile(path.join(target, ".gitignore"), "utf8"), /\.kokaine\//);
});

test("refuses to overwrite a non-empty directory", async (t) => {
  const target = await mkdtemp(path.join(tmpdir(), "create-kokaine-nonempty-"));
  t.after(() => rm(target, { recursive: true, force: true }));
  await writeFile(path.join(target, "keep.txt"), "keep");
  await assert.rejects(() => createProject(target), /not empty/);
  assert.equal(await readFile(path.join(target, "keep.txt"), "utf8"), "keep");
});
