import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { resolveCompiler } from "../src/toolchain.js";
import { createFakeCompiler } from "./helpers.js";

test("validates an explicit compiler override", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "kokaine-toolchain-explicit-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const binary = await createFakeCompiler(path.join(root, "koka"));
  const resolved = await resolveCompiler("3.2.3", { binary });
  assert.equal(resolved.version, "3.2.3");
  assert.equal(resolved.source, "option");
  await assert.rejects(() => resolveCompiler("3.3.0", { binary }), (error) => error.code === "COMPILER_VERSION_MISMATCH");
});

test("shares one checksummed atomic compiler install between concurrent callers", {
  skip: process.platform === "win32" ? "the fake compiler is a script, while a managed Windows compiler is an .exe" : false
}, async (t) => {
  const cacheDirectory = await mkdtemp(path.join(tmpdir(), "kokaine-toolchain-cache-"));
  t.after(() => rm(cacheDirectory, { recursive: true, force: true }));
  const archive = Buffer.from("fake compiler archive");
  const sha256 = createHash("sha256").update(archive).digest("hex");
  const key = `${process.platform}-${process.arch}`;
  const releases = { "3.2.3": { [key]: { url: "https://example.invalid/koka.tar.gz", sha256 } } };
  let fetches = 0;
  const fetch = async () => {
    fetches += 1;
    return new Response(archive);
  };
  const extract = async (_file, destination) => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    await createFakeCompiler(path.join(destination, "bin", process.platform === "win32" ? "koka.exe" : "koka"));
  };
  const options = { cacheDirectory, releases, fetch, extract };
  const [first, second] = await Promise.all([
    resolveCompiler("3.2.3", options),
    resolveCompiler("3.2.3", options)
  ]);
  assert.equal(fetches, 1);
  assert.equal(first.binary, second.binary);
  assert.ok(new Set([first.source, second.source]).has("download"));
});

test("rejects a compiler archive with the wrong checksum", async (t) => {
  const cacheDirectory = await mkdtemp(path.join(tmpdir(), "kokaine-toolchain-checksum-"));
  t.after(() => rm(cacheDirectory, { recursive: true, force: true }));
  const key = `${process.platform}-${process.arch}`;
  const releases = { "3.2.3": { [key]: { url: "https://example.invalid/koka.tar.gz", sha256: "0".repeat(64) } } };
  await assert.rejects(() => resolveCompiler("3.2.3", {
    cacheDirectory,
    releases,
    fetch: async () => new Response(Buffer.from("corrupt")),
    extract: async () => assert.fail("extract must not run")
  }), (error) => error.code === "TOOLCHAIN_CHECKSUM_MISMATCH");
});
