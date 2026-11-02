#!/usr/bin/env node
// Add an official Koka release to compiler-releases.json.
//
//   node packages/cli/scripts/add-compiler-release.mjs 3.2.9
//
// Checksums come from the SHA-256 digests GitHub records for each uploaded
// release asset, so nothing is downloaded or hashed locally. Set GITHUB_TOKEN
// to avoid the anonymous API rate limit.
import { readFile, writeFile } from "node:fs/promises";

const PLATFORMS = {
  "darwin-arm64": "macos-arm64",
  "darwin-x64": "macos-x64",
  "linux-arm64": "linux-arm64",
  "linux-x64": "linux-x64",
  "win32-x64": "windows-x64"
};

const version = process.argv[2];
if (!/^\d+\.\d+\.\d+$/.test(version ?? "")) {
  console.error("usage: add-compiler-release.mjs <major.minor.patch>");
  process.exit(2);
}

const headers = { accept: "application/vnd.github+json", "user-agent": "kokaine-release-table" };
if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
const response = await fetch(`https://api.github.com/repos/koka-lang/koka/releases/tags/v${version}`, { headers });
if (!response.ok) {
  console.error(`GitHub release v${version}: HTTP ${response.status}`);
  process.exit(1);
}
const release = await response.json();

const entry = {};
for (const [platform, suffix] of Object.entries(PLATFORMS)) {
  const name = `koka-v${version}-${suffix}.tar.gz`;
  const asset = release.assets.find((candidate) => candidate.name === name);
  const digest = /^sha256:([0-9a-f]{64})$/.exec(asset?.digest ?? "");
  if (!asset || !digest) {
    console.error(`v${version} has no ${name} with a sha256 digest`);
    process.exit(1);
  }
  entry[platform] = { url: asset.browser_download_url, sha256: digest[1] };
}

const tableUrl = new URL("../compiler-releases.json", import.meta.url);
const table = JSON.parse(await readFile(tableUrl, "utf8"));
table[version] = entry;
const sorted = Object.fromEntries(
  Object.keys(table)
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
    .map((key) => [key, table[key]])
);
await writeFile(tableUrl, `${JSON.stringify(sorted, null, 2)}\n`);
console.log(`compiler-releases.json: Koka ${version} for ${Object.keys(entry).join(", ")}`);
