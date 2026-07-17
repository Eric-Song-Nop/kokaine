import { createHash } from "node:crypto";

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

export function createFingerprint(discovery, flags = []) {
  const payload = {
    schemaVersion: 1,
    compiler: discovery.project.config.compiler,
    target: discovery.project.config.target,
    entry: discovery.project.config.entryRelative.replaceAll("\\", "/"),
    sources: discovery.project.config.sourceRelatives.map((source) => source.replaceAll("\\", "/")),
    packages: discovery.packages.map(({ package: dependency }) => ({
      name: dependency.name,
      version: dependency.version,
      sources: dependency.koka.sourceRelatives.map((source) => source.replaceAll("\\", "/")),
      compiler: dependency.koka.compiler,
      targets: [...dependency.koka.targets].sort()
    })),
    flags: [...flags]
  };
  return createHash("sha256").update(JSON.stringify(stable(payload))).digest("hex");
}
