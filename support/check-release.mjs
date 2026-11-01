#!/usr/bin/env node
// Release gate for the Kokaine workspace.
//
//   node support/check-release.mjs            # check internal ranges only
//   node support/check-release.mjs --plan     # also list versions npm lacks
//
// Every published workspace package that depends on another @kokaine package
// (dependencies or peerDependencies; devDependencies may use file:/workspace:)
// must accept the version of that package in this repository. Otherwise a
// fresh install from the registry cannot satisfy the graph, as happened when
// @kokaine/pocketjs peered on ^0.1.1 while npm only had @kokaine/core 0.1.0.
import { readFile, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

async function manifest(dir) {
  return JSON.parse(await readFile(path.join(dir, "package.json"), "utf8"));
}

const packages = [{ dir: root, json: await manifest(root) }];
for (const entry of await readdir(path.join(root, "packages"), { withFileTypes: true })) {
  if (entry.isDirectory()) {
    const dir = path.join(root, "packages", entry.name);
    packages.push({ dir, json: await manifest(dir) });
  }
}
const published = packages.filter((p) => !p.json.private);
const versions = new Map(packages.map((p) => [p.json.name, p.json.version]));

function parse(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/.exec(version.trim());
  if (!match) throw new Error(`unsupported version ${version}`);
  return { v: [Number(match[1]), Number(match[2]), Number(match[3])], pre: match[4] ?? null };
}

function compare(a, b) {
  for (let i = 0; i < 3; i++) if (a.v[i] !== b.v[i]) return a.v[i] - b.v[i];
  if (a.pre === b.pre) return 0;
  if (a.pre === null) return 1;
  if (b.pre === null) return -1;
  return a.pre < b.pre ? -1 : 1;
}

// Supports the comparator forms used in this repository: exact, ^, ~, and
// space-separated >, >=, <, <=, joined by ||.
function satisfies(version, range) {
  const target = parse(version);
  return range.split("||").some((alternative) =>
    alternative.trim().split(/\s+/).filter(Boolean).every((comparator) => {
      const match = /^(\^|~|>=|<=|>|<|=)?(.+)$/.exec(comparator);
      const op = match[1] ?? "=";
      const bound = parse(match[2]);
      const order = compare(target, bound);
      switch (op) {
        case "=": return order === 0;
        case ">": return order > 0;
        case ">=": return order >= 0;
        case "<": return order < 0;
        case "<=": return order <= 0;
        case "~": return order >= 0 && target.v[0] === bound.v[0] && target.v[1] === bound.v[1];
        case "^": {
          if (order < 0) return false;
          const [major, minor] = bound.v;
          if (major > 0) return target.v[0] === major;
          if (minor > 0) return target.v[0] === 0 && target.v[1] === minor;
          return target.v[0] === 0 && target.v[1] === 0 && target.v[2] === bound.v[2];
        }
      }
      return false;
    })
  );
}

let failures = 0;
for (const pkg of published) {
  for (const field of ["dependencies", "peerDependencies"]) {
    for (const [name, range] of Object.entries(pkg.json[field] ?? {})) {
      if (!versions.has(name)) continue;
      if (/^(file|workspace|link):/.test(range)) {
        console.error(`${pkg.json.name} ${field}.${name} uses a local protocol: ${range}`);
        failures++;
      } else if (!satisfies(versions.get(name), range)) {
        console.error(`${pkg.json.name} ${field}.${name} "${range}" rejects repository version ${versions.get(name)}`);
        failures++;
      }
    }
  }
}
if (failures > 0) process.exit(1);
console.log(`release check: ${published.length} published packages have satisfiable internal ranges`);

if (process.argv.includes("--plan")) {
  for (const pkg of published) {
    const { name, version } = pkg.json;
    let onRegistry = false;
    try {
      execFileSync("npm", ["view", `${name}@${version}`, "version"], { stdio: ["ignore", "pipe", "ignore"] });
      onRegistry = execFileSync("npm", ["view", `${name}@${version}`, "version"], { encoding: "utf8" }).trim() === version;
    } catch {
      onRegistry = false;
    }
    console.log(`${onRegistry ? "published  " : "TO PUBLISH "} ${name}@${version}  (${path.relative(root, pkg.dir) || "."})`);
  }
}
