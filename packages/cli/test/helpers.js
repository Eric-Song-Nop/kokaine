import { chmod, mkdir, symlink, writeFile } from "node:fs/promises";
import path from "node:path";

export async function writeJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

export async function writeKoka(file, moduleName, body = "pub fun main() ()") {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `module ${moduleName}\n\n${body}\n`);
}

export async function createApp(root, overrides = {}) {
  const manifest = {
    name: "test-app",
    version: "1.0.0",
    private: true,
    dependencies: {},
    kokaine: {
      entry: "src/app/main.kk",
      compiler: "3.2.3",
      target: "jsweb"
    },
    ...overrides
  };
  await writeJson(path.join(root, "package.json"), manifest);
  await writeKoka(path.join(root, "src", "app", "main.kk"), "app/main");
  return manifest;
}

export async function createPackage(root, manifest, modules = []) {
  await writeJson(path.join(root, "package.json"), manifest);
  for (const [relative, moduleName] of modules) {
    await writeKoka(path.join(root, relative), moduleName, "pub val marker = 1");
  }
  return root;
}

export async function linkPackage(parentRoot, name, target) {
  const link = path.join(parentRoot, "node_modules", ...name.split("/"));
  await mkdir(path.dirname(link), { recursive: true });
  await symlink(target, link, process.platform === "win32" ? "junction" : "dir");
  return link;
}

export async function createFakeCompiler(file, version = "3.2.3", behavior = "success") {
  const executable = process.platform === "win32" ? `${file}.js` : file;
  await mkdir(path.dirname(executable), { recursive: true });
  const source = `#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
if (process.argv.includes("--version")) {
  process.stdout.write("Koka ${version}, fake build\\n");
  process.exit(0);
}
const outputArg = process.argv.find((arg) => arg.startsWith("--outputdir="));
const output = outputArg?.slice("--outputdir=".length);
${behavior === "success" ? `fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, "app_main__main.mjs"), "export const built = true;\\n");
process.stdout.write("created fake output\\n");` : `process.stderr.write("fake compiler failure\\n");
process.exit(23);`}
`;
  await writeFile(executable, source);
  await chmod(executable, 0o755);
  return executable;
}
