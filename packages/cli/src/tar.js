import {
  chmodSync,
  closeSync,
  mkdirSync,
  openSync,
  symlinkSync,
  writeSync
} from "node:fs";
import path from "node:path";
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Writable } from "node:stream";
import { createGunzip } from "node:zlib";
import { KokaineError } from "./errors.js";

function tarString(buffer, start, length) {
  const end = buffer.indexOf(0, start);
  const boundary = end === -1 || end > start + length ? start + length : end;
  return buffer.subarray(start, boundary).toString("utf8");
}

function safeDestination(root, name) {
  const destination = path.resolve(root, name);
  const relative = path.relative(root, destination);
  if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new KokaineError("TOOLCHAIN_ARCHIVE_ESCAPE", "Compiler archive contains an unsafe path", [name]);
  }
  return destination;
}

class TarExtractor extends Writable {
  constructor(root) {
    super();
    this.root = root;
    this.buffer = Buffer.alloc(0);
    this.state = "header";
    this.remaining = 0;
    this.padding = 0;
    this.file = null;
    this.mode = 0o644;
  }

  _write(chunk, _encoding, callback) {
    try {
      this.consume(chunk);
      callback();
    } catch (error) {
      callback(error);
    }
  }

  consume(input) {
    let chunk = this.buffer.length === 0 ? input : Buffer.concat([this.buffer, input]);
    this.buffer = Buffer.alloc(0);
    while (chunk.length > 0) {
      if (this.state === "done") return;
      if (this.state === "header") {
        if (chunk.length < 512) {
          this.buffer = chunk;
          return;
        }
        const header = chunk.subarray(0, 512);
        chunk = chunk.subarray(512);
        if (header.every((byte) => byte === 0)) {
          this.state = "done";
          continue;
        }
        this.openEntry(header);
        if (this.remaining === 0) this.finishEntry();
        continue;
      }
      if (this.state === "data") {
        const length = Math.min(this.remaining, chunk.length);
        if (this.file !== null && length > 0) writeSync(this.file, chunk, 0, length);
        this.remaining -= length;
        chunk = chunk.subarray(length);
        if (this.remaining === 0) this.finishEntry();
        continue;
      }
      if (this.state === "padding") {
        const length = Math.min(this.padding, chunk.length);
        this.padding -= length;
        chunk = chunk.subarray(length);
        if (this.padding === 0) this.state = "header";
      }
    }
  }

  openEntry(header) {
    const name = tarString(header, 0, 100);
    const prefix = tarString(header, 345, 155);
    const fullName = prefix ? `${prefix}/${name}` : name;
    const rawSize = tarString(header, 124, 12).trim();
    const rawMode = tarString(header, 100, 8).trim();
    const size = rawSize === "" ? 0 : Number.parseInt(rawSize, 8);
    const mode = rawMode === "" ? 0o644 : Number.parseInt(rawMode, 8);
    const type = String.fromCharCode(header[156] || 48);
    if (!Number.isSafeInteger(size) || size < 0) {
      throw new KokaineError("TOOLCHAIN_ARCHIVE_INVALID", "Compiler archive has an invalid entry size", [fullName]);
    }
    const destination = safeDestination(this.root, fullName);
    this.remaining = size;
    this.padding = (512 - (size % 512)) % 512;
    this.mode = mode;
    this.file = null;

    if (type === "0" || type === "\0") {
      mkdirSync(path.dirname(destination), { recursive: true });
      this.file = openSync(destination, "w", mode);
    } else if (type === "5") {
      mkdirSync(destination, { recursive: true, mode });
    } else if (type === "2") {
      const linkName = tarString(header, 157, 100);
      const linkTarget = path.resolve(path.dirname(destination), linkName);
      const relation = path.relative(this.root, linkTarget);
      if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation)) {
        throw new KokaineError("TOOLCHAIN_ARCHIVE_ESCAPE", "Compiler archive contains an unsafe symlink", [fullName, linkName]);
      }
      mkdirSync(path.dirname(destination), { recursive: true });
      symlinkSync(linkName, destination);
    } else if (type !== "x" && type !== "g") {
      throw new KokaineError("TOOLCHAIN_ARCHIVE_UNSUPPORTED", "Compiler archive contains an unsupported entry", [fullName, `type: ${type}`]);
    }
    this.state = "data";
  }

  finishEntry() {
    if (this.file !== null) {
      closeSync(this.file);
      this.file = null;
    }
    this.state = this.padding === 0 ? "header" : "padding";
  }

  _final(callback) {
    try {
      if (this.file !== null) closeSync(this.file);
      if (this.state !== "done" && this.state !== "header") {
        throw new KokaineError("TOOLCHAIN_ARCHIVE_TRUNCATED", "Compiler archive ended unexpectedly");
      }
      callback();
    } catch (error) {
      callback(error);
    }
  }
}

export async function extractTarGz(archive, destination) {
  mkdirSync(destination, { recursive: true });
  await pipeline(createReadStream(archive), createGunzip(), new TarExtractor(destination));
  const binary = path.join(destination, "bin", process.platform === "win32" ? "koka.exe" : "koka");
  if (process.platform !== "win32") chmodSync(binary, 0o755);
}
