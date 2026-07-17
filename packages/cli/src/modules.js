import { opendir, readFile, realpath } from "node:fs/promises";
import path from "node:path";
import { KokaineError } from "./errors.js";

const MODULE_PATTERN = /^\s*module\s+([^\s/][^\s]*)/m;

async function walkKokaFiles(directory, result) {
  const entries = [];
  for await (const entry of await opendir(directory)) entries.push(entry);
  entries.sort((left, right) => left.name.localeCompare(right.name));
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walkKokaFiles(file, result);
    } else if (entry.isFile() && entry.name.endsWith(".kk")) {
      result.push(file);
    }
  }
}

export async function readModuleName(file) {
  const source = await readFile(file, "utf8");
  const match = MODULE_PATTERN.exec(source);
  if (!match) {
    throw new KokaineError("KOKA_MODULE_MISSING", "Koka source does not declare a module", [file]);
  }
  return match[1];
}

export async function createModuleIndex(sourceRoots) {
  const files = [];
  for (const sourceRoot of sourceRoots) await walkKokaFiles(sourceRoot, files);
  const modules = new Map();
  const physicalFiles = new Set();
  for (const file of files) {
    const physical = await realpath(file);
    if (physicalFiles.has(physical)) continue;
    physicalFiles.add(physical);
    const moduleName = await readModuleName(file);
    const existing = modules.get(moduleName);
    if (existing && existing !== physical) {
      throw new KokaineError(
        "KOKA_MODULE_CONFLICT",
        `Koka module ${moduleName} is declared by multiple files`,
        [existing, physical]
      );
    }
    modules.set(moduleName, physical);
  }
  return new Map([...modules.entries()].sort(([left], [right]) => left.localeCompare(right)));
}
