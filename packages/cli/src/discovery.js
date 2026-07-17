import { access, realpath } from "node:fs/promises";
import path from "node:path";
import semver from "semver";
import { createRequire } from "node:module";
import { KokaineError } from "./errors.js";
import { loadDependencyManifest, loadProject } from "./manifest.js";

const DEPENDENCY_FIELDS = ["dependencies", "optionalDependencies", "peerDependencies"];

function dependencyKinds(manifest) {
  const result = new Map();
  for (const field of DEPENDENCY_FIELDS) {
    const dependencies = manifest[field];
    if (!dependencies || typeof dependencies !== "object" || Array.isArray(dependencies)) continue;
    for (const name of Object.keys(dependencies).sort()) {
      result.set(name, field);
    }
  }
  return [...result.entries()].sort(([left], [right]) => left.localeCompare(right));
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

export async function resolvePackageRoot(parentRoot, packageName) {
  let cursor = parentRoot;
  while (true) {
    const candidate = path.join(cursor, "node_modules", ...packageName.split("/"));
    if (await exists(path.join(candidate, "package.json"))) {
      return realpath(candidate);
    }
    const next = path.dirname(cursor);
    if (next === cursor) break;
    cursor = next;
  }

  try {
    const require = createRequire(path.join(parentRoot, "package.json"));
    return realpath(path.dirname(require.resolve(`${packageName}/package.json`)));
  } catch {
    return null;
  }
}

function formatPath(pathParts) {
  return pathParts.join(" -> ");
}

function validateKokaPackages(project, occurrences) {
  const groups = new Map();
  for (const occurrence of occurrences) {
    if (!occurrence.package.koka) continue;
    const values = groups.get(occurrence.package.name) ?? [];
    values.push(occurrence);
    groups.set(occurrence.package.name, values);
  }

  for (const [name, values] of [...groups.entries()].sort(([left], [right]) => left.localeCompare(right))) {
    const unique = new Map();
    for (const value of values) {
      unique.set(value.package.root, value);
    }
    const copies = [...unique.values()];
    const versions = new Set(copies.map((copy) => copy.package.version));
    if (versions.size > 1) {
      throw new KokaineError(
        "KOKA_PACKAGE_VERSION_CONFLICT",
        `${name} resolves to multiple versions in Koka's global module space`,
        copies.map((copy) => `${formatPath(copy.path)} (${copy.package.root})`)
      );
    }
    if (copies.length > 1) {
      throw new KokaineError(
        "KOKA_PACKAGE_COPY_CONFLICT",
        `${name}@${copies[0].package.version} resolves to multiple physical package copies`,
        copies.map((copy) => `${formatPath(copy.path)} (${copy.package.root})`)
      );
    }
  }

  for (const occurrence of occurrences) {
    const dependency = occurrence.package;
    if (!dependency.koka) continue;
    if (!semver.satisfies(project.config.compiler, dependency.koka.compiler)) {
      throw new KokaineError(
        "COMPILER_CONSTRAINT_CONFLICT",
        `${dependency.name}@${dependency.version} does not support Koka ${project.config.compiler}`,
        [
          `constraint: ${dependency.koka.compiler}`,
          `dependency path: ${formatPath(occurrence.path)}`,
          `package root: ${dependency.root}`
        ]
      );
    }
    if (!dependency.koka.targets.includes(project.config.target)) {
      throw new KokaineError(
        "TARGET_CONSTRAINT_CONFLICT",
        `${dependency.name}@${dependency.version} does not support ${project.config.target}`,
        [`targets: ${dependency.koka.targets.join(", ")}`, `dependency path: ${formatPath(occurrence.path)}`]
      );
    }
  }
}

export async function discoverProject(projectDirectory = process.cwd()) {
  const project = typeof projectDirectory === "string"
    ? await loadProject(projectDirectory)
    : projectDirectory;
  const queue = [];
  const rootLabel = `${project.name} (root)`;
  for (const [name, kind] of dependencyKinds(project.manifest)) {
    queue.push({ parentRoot: project.root, name, kind, path: [rootLabel] });
  }

  const expandedRoots = new Set();
  const occurrences = [];
  const allPackages = new Map();
  while (queue.length > 0) {
    const item = queue.shift();
    const packageRoot = await resolvePackageRoot(item.parentRoot, item.name);
    const optional = item.kind === "optionalDependencies" || item.kind === "peerDependencies";
    if (!packageRoot) {
      if (optional) continue;
      throw new KokaineError(
        "DEPENDENCY_NOT_INSTALLED",
        `Cannot resolve installed dependency ${item.name}`,
        [`from: ${item.parentRoot}`, `dependency path: ${formatPath([...item.path, item.name])}`]
      );
    }

    const dependency = await loadDependencyManifest(packageRoot);
    const occurrencePath = [...item.path, `${dependency.name}@${dependency.version}`];
    const occurrence = { package: dependency, path: occurrencePath };
    occurrences.push(occurrence);
    const existing = allPackages.get(dependency.root) ?? { package: dependency, paths: [] };
    existing.paths.push(occurrencePath);
    allPackages.set(dependency.root, existing);

    if (expandedRoots.has(dependency.root)) continue;
    expandedRoots.add(dependency.root);
    for (const [name, kind] of dependencyKinds(dependency.manifest)) {
      queue.push({ parentRoot: dependency.root, name, kind, path: occurrencePath });
    }
  }

  validateKokaPackages(project, occurrences);
  const packages = [...allPackages.values()]
    .filter(({ package: dependency }) => dependency.koka)
    .sort((left, right) =>
      left.package.name.localeCompare(right.package.name)
      || semver.compare(left.package.version, right.package.version)
      || left.package.root.localeCompare(right.package.root)
    );
  const sourceRoots = [
    ...project.config.sourceRoots,
    ...packages.flatMap(({ package: dependency }) => dependency.koka.sourceRoots)
  ];

  return {
    project,
    packages,
    sourceRoots: [...new Set(sourceRoots)],
    packageCount: allPackages.size,
    occurrences
  };
}
