import { createCompilerInvocation } from "./compiler.js";
import { createFingerprint } from "./fingerprint.js";

function displayToken(token) {
  if (/^[A-Za-z0-9_./:=@+-]+$/.test(token)) return token;
  return JSON.stringify(token);
}

export function createDoctorReport(discovery, moduleIndex, compiler) {
  const invocation = createCompilerInvocation(discovery, compiler.binary, { mode: "check" });
  return {
    schemaVersion: 1,
    project: {
      name: discovery.project.name,
      root: discovery.project.root,
      entry: discovery.project.config.entry,
      target: discovery.project.config.target,
      outputDirectory: discovery.project.config.outDir,
      buildDirectory: discovery.project.config.buildDir
    },
    compiler: {
      selectedVersion: discovery.project.config.compiler,
      actualVersion: compiler.version,
      binary: compiler.binary,
      source: compiler.source,
      cachePath: compiler.cachePath
    },
    packages: discovery.packages.map(({ package: dependency, paths }) => ({
      name: dependency.name,
      version: dependency.version,
      root: dependency.root,
      sources: dependency.koka.sourceRoots,
      compiler: dependency.koka.compiler,
      targets: dependency.koka.targets,
      dependencyPaths: paths
    })),
    sourceRoots: discovery.sourceRoots,
    modules: Object.fromEntries(moduleIndex),
    fingerprint: createFingerprint(discovery),
    command: [invocation.command, ...invocation.args],
    commandText: [invocation.command, ...invocation.args].map(displayToken).join(" ")
  };
}

export function formatDoctorReport(report) {
  const packages = report.packages.length === 0
    ? "  (no Koka source dependencies)"
    : report.packages.map((dependency) => `  ${dependency.name}@${dependency.version}\n    ${dependency.root}`).join("\n");
  return [
    `Project: ${report.project.name}`,
    `Root: ${report.project.root}`,
    `Entry: ${report.project.entry}`,
    `Target: ${report.project.target}`,
    `Compiler: Koka ${report.compiler.actualVersion}`,
    `Compiler binary: ${report.compiler.binary}`,
    `Compiler source: ${report.compiler.source}`,
    "Koka packages:",
    packages,
    "Source roots:",
    ...report.sourceRoots.map((sourceRoot) => `  ${sourceRoot}`),
    `Modules: ${Object.keys(report.modules).length}`,
    `Fingerprint: ${report.fingerprint}`,
    "Koka command:",
    `  ${report.commandText}`
  ].join("\n");
}
