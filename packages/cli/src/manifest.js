import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";
import semver from "semver";
import { KokaineError, invariant } from "./errors.js";

const PROJECT_KEYS = new Set([
  "schemaVersion",
  "entry",
  "compiler",
  "target",
  "outDir",
  "buildDir",
  "buildTag",
  "sources"
]);

const PACKAGE_KEYS = new Set([
  "schemaVersion",
  "sources",
  "compiler",
  "targets"
]);

async function readJson(file) {
  let source;
  try {
    source = await readFile(file, "utf8");
  } catch (error) {
    throw new KokaineError("MANIFEST_NOT_FOUND", `Cannot read ${file}`, [error.message]);
  }
  try {
    return JSON.parse(source.replace(/^\uFEFF/, ""));
  } catch (error) {
    throw new KokaineError("MANIFEST_INVALID_JSON", `Invalid JSON in ${file}`, [error.message]);
  }
}

function assertObject(value, field, manifestPath) {
  invariant(
    value !== null && typeof value === "object" && !Array.isArray(value),
    "MANIFEST_INVALID",
    `${field} in ${manifestPath} must be an object`
  );
}

function rejectUnknownKeys(value, allowed, field, manifestPath) {
  const unknown = Object.keys(value).filter((key) => !allowed.has(key)).sort();
  invariant(
    unknown.length === 0,
    "MANIFEST_UNKNOWN_FIELD",
    `${field} in ${manifestPath} has unknown field${unknown.length === 1 ? "" : "s"}`,
    unknown
  );
}

function validateSchemaVersion(value, field, manifestPath) {
  const schemaVersion = value ?? 1;
  invariant(
    schemaVersion === 1,
    "MANIFEST_SCHEMA_UNSUPPORTED",
    `${field}.schemaVersion in ${manifestPath} must be 1`,
    [`received: ${JSON.stringify(schemaVersion)}`]
  );
  return schemaVersion;
}

function validateRelativePath(value, field, manifestPath) {
  invariant(
    typeof value === "string" && value.trim() !== "" && !path.isAbsolute(value),
    "MANIFEST_INVALID_PATH",
    `${field} in ${manifestPath} must be a non-empty relative path`
  );
  const normalized = path.normalize(value);
  invariant(
    normalized !== ".." && !normalized.startsWith(`..${path.sep}`),
    "MANIFEST_PATH_ESCAPE",
    `${field} in ${manifestPath} escapes its package root`,
    [value]
  );
  return normalized;
}

async function canonicalDirectory(packageRoot, relative, field, manifestPath) {
  const candidate = path.resolve(packageRoot, relative);
  let canonical;
  try {
    canonical = await realpath(candidate);
    const info = await stat(canonical);
    invariant(info.isDirectory(), "MANIFEST_INVALID_PATH", `${field} must name a directory`, [candidate]);
  } catch (error) {
    if (error instanceof KokaineError) throw error;
    throw new KokaineError("MANIFEST_SOURCE_NOT_FOUND", `${field} does not exist`, [candidate]);
  }
  const relation = path.relative(packageRoot, canonical);
  invariant(
    relation !== ".." && !relation.startsWith(`..${path.sep}`) && !path.isAbsolute(relation),
    "MANIFEST_PATH_ESCAPE",
    `${field} resolves outside its package root`,
    [`source: ${candidate}`, `realpath: ${canonical}`, `package: ${packageRoot}`]
  );
  return canonical;
}

export async function loadProject(projectDirectory = process.cwd()) {
  let root;
  try {
    root = await realpath(projectDirectory);
  } catch (error) {
    throw new KokaineError("PROJECT_NOT_FOUND", `Project directory does not exist: ${projectDirectory}`, [error.message]);
  }
  const manifestPath = path.join(root, "package.json");
  const manifest = await readJson(manifestPath);
  assertObject(manifest, "package.json", manifestPath);
  assertObject(manifest.kokaine, "kokaine", manifestPath);
  rejectUnknownKeys(manifest.kokaine, PROJECT_KEYS, "kokaine", manifestPath);

  const raw = manifest.kokaine;
  const schemaVersion = validateSchemaVersion(raw.schemaVersion, "kokaine", manifestPath);
  const entryRelative = validateRelativePath(raw.entry, "kokaine.entry", manifestPath);
  invariant(
    typeof raw.compiler === "string" && semver.valid(raw.compiler) === raw.compiler,
    "MANIFEST_COMPILER_NOT_EXACT",
    `kokaine.compiler in ${manifestPath} must be an exact semantic version`,
    [`received: ${JSON.stringify(raw.compiler)}`]
  );
  const target = raw.target ?? "jsweb";
  invariant(target === "jsweb", "MANIFEST_TARGET_UNSUPPORTED", "Kokaine currently supports only the jsweb target", [String(target)]);

  const entryParts = entryRelative.split(path.sep);
  const sourceValues = raw.sources ?? [entryParts.length > 1 ? entryParts[0] : "."];
  invariant(
    Array.isArray(sourceValues) && sourceValues.length > 0,
    "MANIFEST_INVALID",
    `kokaine.sources in ${manifestPath} must be a non-empty array`
  );
  const sourceRelatives = sourceValues.map((source, index) =>
    validateRelativePath(source, `kokaine.sources[${index}]`, manifestPath)
  );
  const sourceRoots = [];
  for (let index = 0; index < sourceRelatives.length; index += 1) {
    sourceRoots.push(await canonicalDirectory(root, sourceRelatives[index], `kokaine.sources[${index}]`, manifestPath));
  }

  const entry = path.resolve(root, entryRelative);
  const entryRelation = path.relative(root, entry);
  invariant(!entryRelation.startsWith(`..${path.sep}`), "MANIFEST_PATH_ESCAPE", "kokaine.entry escapes the project root", [entry]);
  try {
    const info = await stat(entry);
    invariant(info.isFile(), "MANIFEST_ENTRY_NOT_FOUND", "kokaine.entry must name a file", [entry]);
  } catch (error) {
    if (error instanceof KokaineError) throw error;
    throw new KokaineError("MANIFEST_ENTRY_NOT_FOUND", "kokaine.entry does not exist", [entry]);
  }
  invariant(
    sourceRoots.some((sourceRoot) => {
      const relative = path.relative(sourceRoot, entry);
      return relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
    }),
    "MANIFEST_ENTRY_OUTSIDE_SOURCES",
    "kokaine.entry must be contained by one of kokaine.sources",
    [`entry: ${entry}`, ...sourceRoots.map((sourceRoot) => `source: ${sourceRoot}`)]
  );

  const outDirRelative = validateRelativePath(raw.outDir ?? ".kokaine/generated", "kokaine.outDir", manifestPath);
  const buildDirRelative = validateRelativePath(raw.buildDir ?? ".kokaine/build", "kokaine.buildDir", manifestPath);
  invariant(
    raw.buildTag === undefined || (typeof raw.buildTag === "string" && /^[A-Za-z0-9._-]+$/.test(raw.buildTag)),
    "MANIFEST_INVALID",
    "kokaine.buildTag may contain only letters, digits, dot, underscore, and dash"
  );

  return {
    root,
    manifestPath,
    manifest,
    name: typeof manifest.name === "string" ? manifest.name : path.basename(root),
    config: {
      schemaVersion,
      entry,
      entryRelative,
      compiler: raw.compiler,
      target,
      outDir: path.resolve(root, outDirRelative),
      outDirRelative,
      buildDir: path.resolve(root, buildDirRelative),
      buildDirRelative,
      buildTag: raw.buildTag ?? "kokaine",
      sourceRoots,
      sourceRelatives
    }
  };
}

export async function loadDependencyManifest(packageDirectory) {
  const root = await realpath(packageDirectory);
  const manifestPath = path.join(root, "package.json");
  const manifest = await readJson(manifestPath);
  assertObject(manifest, "package.json", manifestPath);
  invariant(typeof manifest.name === "string" && manifest.name !== "", "PACKAGE_IDENTITY_INVALID", `${manifestPath} is missing a package name`);
  invariant(typeof manifest.version === "string" && semver.valid(manifest.version), "PACKAGE_IDENTITY_INVALID", `${manifestPath} has an invalid package version`);

  let koka = null;
  if (manifest.koka !== undefined) {
    assertObject(manifest.koka, "koka", manifestPath);
    rejectUnknownKeys(manifest.koka, PACKAGE_KEYS, "koka", manifestPath);
    const raw = manifest.koka;
    const schemaVersion = validateSchemaVersion(raw.schemaVersion, "koka", manifestPath);
    invariant(Array.isArray(raw.sources) && raw.sources.length > 0, "MANIFEST_INVALID", `koka.sources in ${manifestPath} must be a non-empty array`);
    const sourceRelatives = raw.sources.map((source, index) =>
      validateRelativePath(source, `koka.sources[${index}]`, manifestPath)
    );
    const sourceRoots = [];
    for (let index = 0; index < sourceRelatives.length; index += 1) {
      sourceRoots.push(await canonicalDirectory(root, sourceRelatives[index], `koka.sources[${index}]`, manifestPath));
    }
    invariant(raw.compiler === undefined || semver.validRange(raw.compiler), "MANIFEST_COMPILER_RANGE_INVALID", `koka.compiler in ${manifestPath} is not a valid semantic version range`, [String(raw.compiler)]);
    const targets = raw.targets ?? ["jsweb"];
    invariant(Array.isArray(targets) && targets.length > 0 && targets.every((target) => typeof target === "string"), "MANIFEST_INVALID", `koka.targets in ${manifestPath} must be a non-empty string array`);
    koka = {
      schemaVersion,
      sourceRoots,
      sourceRelatives,
      compiler: raw.compiler ?? "*",
      targets: [...targets]
    };
  }

  return {
    root,
    manifestPath,
    manifest,
    name: manifest.name,
    version: manifest.version,
    koka
  };
}
