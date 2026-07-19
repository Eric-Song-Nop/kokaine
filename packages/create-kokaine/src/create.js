import { cp, mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TEMPLATE = fileURLToPath(new URL("../template", import.meta.url));

function packageName(directory) {
  return path.basename(directory)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "kokaine-app";
}

export async function createProject(targetDirectory, options = {}) {
  const target = path.resolve(targetDirectory);
  await mkdir(target, { recursive: true });
  const contents = await readdir(target);
  if (contents.length > 0) {
    throw new Error(`Target directory is not empty: ${target}`);
  }
  await cp(TEMPLATE, target, { recursive: true, errorOnExist: true });
  await rename(path.join(target, "gitignore"), path.join(target, ".gitignore"));
  const manifestFile = path.join(target, "package.json");
  const manifest = JSON.parse(await readFile(manifestFile, "utf8"));
  manifest.name = options.name ?? packageName(target);
  await writeFile(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
  return target;
}

export async function run(argv = process.argv.slice(2)) {
  if (argv.includes("--help") || argv.includes("-h")) {
    process.stdout.write("Usage: npm create @kokaine [directory]\n");
    return;
  }
  const target = argv.find((argument) => !argument.startsWith("-")) ?? "kokaine-app";
  const created = await createProject(target);
  const relative = path.relative(process.cwd(), created) || ".";
  process.stdout.write(`Created Kokaine app in ${created}\n\n`);
  if (relative !== ".") process.stdout.write(`  cd ${relative}\n`);
  process.stdout.write("  npm install\n  npm run dev\n");
}
