import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { compileProject, createCompilerInvocation } from "../src/compiler.js";
import { discoverProject } from "../src/discovery.js";
import { createApp, createFakeCompiler } from "./helpers.js";

test("constructs compiler arguments without shell interpolation", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "kokaine args with spaces-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await createApp(root);
  const discovery = await discoverProject(root);
  const invocation = createCompilerInvocation(discovery, "/path/to/koka", { mode: "check" });
  assert.equal(invocation.command, "/path/to/koka");
  assert.ok(invocation.args.includes(`-i${path.join(discovery.project.root, "src")}`));
  assert.ok(invocation.args.includes("--target=jsweb"));
  assert.equal(invocation.args.at(-1), path.join(discovery.project.root, "src", "app", "main.kk"));
});

test("publishes successful compiler output atomically", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "kokaine-compile-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await createApp(root);
  const compiler = await createFakeCompiler(path.join(root, "fake-koka"));
  const discovery = await discoverProject(root);
  const compilation = await compileProject(discovery, compiler, { mirror: false });
  assert.equal(await readFile(compilation.mainModule, "utf8"), "export const built = true;\n");
  assert.equal(compilation.outputDir, path.join(discovery.project.root, ".kokaine", "generated"));
});

test("keeps the last successful output when compilation fails", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "kokaine-compile-failure-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await createApp(root);
  const compiler = await createFakeCompiler(path.join(root, "fake-koka"), "3.2.3", "failure");
  const output = path.join(root, ".kokaine", "generated");
  await (await import("node:fs/promises")).mkdir(output, { recursive: true });
  await writeFile(path.join(output, "last-good.mjs"), "good\n");
  const discovery = await discoverProject(root);
  await assert.rejects(() => compileProject(discovery, compiler, { mirror: false }), (error) => {
    assert.equal(error.code, "KOKA_COMPILE_FAILED");
    assert.equal(error.exitCode, 23);
    return true;
  });
  assert.equal(await readFile(path.join(output, "last-good.mjs"), "utf8"), "good\n");
});
