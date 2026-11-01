import assert from "node:assert/strict";
import { existsSync, lstatSync, mkdtempSync, readFileSync, readlinkSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, test } from "node:test";
import { gzipSync } from "node:zlib";
import { extractTarGz } from "../src/tar.js";

const SYMLINK_SKIP = process.platform === "win32"
  ? "symlink creation needs elevated privileges or developer mode on Windows"
  : false;

function header(name, { type = "0", size = 0, mode = 0o644, linkName = "" } = {}) {
  const block = Buffer.alloc(512);
  block.write(name, 0, 100, "utf8");
  block.write(`${mode.toString(8).padStart(7, "0")}\0`, 100, 8, "ascii");
  block.write("0000000\0", 108, 8, "ascii");
  block.write("0000000\0", 116, 8, "ascii");
  block.write(`${size.toString(8).padStart(11, "0")}\0`, 124, 12, "ascii");
  block.write("00000000000\0", 136, 12, "ascii");
  block.write(type, 156, 1, "ascii");
  block.write(linkName, 157, 100, "utf8");
  block.write("ustar\0", 257, 6, "ascii");
  block.write("00", 263, 2, "ascii");
  block.fill(0x20, 148, 156);
  let sum = 0;
  for (const byte of block) sum += byte;
  block.write(`${sum.toString(8).padStart(6, "0")}\0 `, 148, 8, "ascii");
  return block;
}

function entry(name, options = {}) {
  const data = Buffer.from(options.content ?? "");
  const parts = [header(name, { ...options, size: data.length })];
  if (data.length > 0) parts.push(data, Buffer.alloc((512 - (data.length % 512)) % 512));
  return Buffer.concat(parts);
}

function archive(...entries) {
  return gzipSync(Buffer.concat([...entries, Buffer.alloc(1024)]));
}

let scratch;
let destination;
let archivePath;

beforeEach(() => {
  scratch = mkdtempSync(path.join(os.tmpdir(), "kokaine-tar-"));
  destination = path.join(scratch, "nested", "dest");
  archivePath = path.join(scratch, "archive.tar.gz");
});

afterEach(() => {
  rmSync(scratch, { recursive: true, force: true });
});

// Everything under scratch except the archive itself.
function snapshot() {
  return readdirSync(scratch, { recursive: true }).map(String).filter((item) => item !== "archive.tar.gz").sort();
}

const EMPTY = () => ["nested", path.join("nested", "dest")];

async function assertEscape(buffer) {
  writeFileSync(archivePath, buffer);
  await assert.rejects(extractTarGz(archivePath, destination), { code: "TOOLCHAIN_ARCHIVE_ESCAPE" });
}

test("rejects a ../ entry before writing anything", async () => {
  await assertEscape(archive(entry("../escape", { content: "pwned" })));
  assert.deepEqual(snapshot(), EMPTY());
});

test("rejects an absolute path entry before writing anything", async () => {
  const absolute = path.join(scratch, "absolute-escape").replaceAll("\\", "/");
  await assertEscape(archive(entry(absolute, { content: "pwned" })));
  assert.equal(existsSync(path.join(scratch, "absolute-escape")), false);
  assert.deepEqual(snapshot(), EMPTY());
});

test("rejects a symlink pointing outside the destination", { skip: SYMLINK_SKIP }, async () => {
  await assertEscape(archive(
    entry("link", { type: "2", linkName: "../../outside" }),
    entry("link/file", { content: "pwned" })
  ));
  assert.deepEqual(snapshot(), EMPTY());
});

test("rejects an entry nested under a symlink chain that escapes", { skip: SYMLINK_SKIP, todo: "tar.js only checks link targets lexically" }, async () => {
  // Each link target is lexically inside the destination, but p/q/l really
  // resolves to <dest>/.. because p/q/b points at <dest>.
  await assertEscape(archive(
    entry("p/q/", { type: "5", mode: 0o755 }),
    entry("p/q/b", { type: "2", linkName: "../.." }),
    entry("p/q/l", { type: "2", linkName: "b/.." }),
    entry("p/q/l/evil", { content: "pwned" })
  ));
  assert.equal(existsSync(path.join(scratch, "nested", "evil")), false);
});

test("extracts files, directories and in-tree symlinks", async () => {
  const entries = [
    entry("bin/", { type: "5", mode: 0o755 }),
    entry("bin/koka", { content: "#!/bin/sh\n", mode: 0o755 }),
    entry("lib/std/core.kk", { content: "module std/core\n" })
  ];
  if (!SYMLINK_SKIP) entries.push(entry("lib/current", { type: "2", linkName: "std" }));
  writeFileSync(archivePath, archive(...entries));
  await extractTarGz(archivePath, destination);
  assert.equal(readFileSync(path.join(destination, "bin", "koka"), "utf8"), "#!/bin/sh\n");
  assert.equal(readFileSync(path.join(destination, "lib", "std", "core.kk"), "utf8"), "module std/core\n");
  if (process.platform !== "win32") {
    assert.equal(lstatSync(path.join(destination, "bin", "koka")).mode & 0o777, 0o755);
  }
  if (!SYMLINK_SKIP) {
    assert.equal(readlinkSync(path.join(destination, "lib", "current")), "std");
    assert.equal(readFileSync(path.join(destination, "lib", "current", "core.kk"), "utf8"), "module std/core\n");
  }
});
