import { randomUUID } from "node:crypto";
import { mkdir, opendir, rename, rm } from "node:fs/promises";
import path from "node:path";
import { KokaineError } from "./errors.js";
import { createFingerprint } from "./fingerprint.js";
import { runProcess } from "./process.js";

export function createCompilerInvocation(discovery, compiler, options = {}) {
  const config = discovery.project.config;
  const outputDir = options.outputDir ?? config.outDir;
  const mode = options.mode ?? "build";
  const fingerprint = createFingerprint(discovery, options.flags ?? []).slice(0, 12);
  const buildTag = options.buildTag ?? `${config.buildTag}-${mode}-${fingerprint}`;
  const args = [
    "-j1",
    `--target=${config.target}`,
    `--builddir=${config.buildDir}`,
    `--buildtag=${buildTag}`,
    "--buildhash",
    `--outputdir=${outputDir}`,
    ...discovery.sourceRoots.map((sourceRoot) => `-i${sourceRoot}`),
    ...(options.flags ?? []),
    config.entry
  ];
  return { command: compiler, args, cwd: discovery.project.root, outputDir };
}

async function findMainModules(directory, result = []) {
  const entries = [];
  for await (const entry of await opendir(directory)) entries.push(entry);
  entries.sort((left, right) => left.name.localeCompare(right.name));
  for (const entry of entries) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await findMainModules(file, result);
    else if (entry.isFile() && entry.name.endsWith("__main.mjs")) result.push(file);
  }
  return result;
}

async function promote(staging, destination) {
  const backup = `${destination}.previous-${process.pid}-${randomUUID()}`;
  let hadDestination = false;
  try {
    await rename(destination, backup);
    hadDestination = true;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  try {
    await rename(staging, destination);
    if (hadDestination) await rm(backup, { recursive: true, force: true });
  } catch (error) {
    if (hadDestination) await rename(backup, destination);
    throw error;
  }
}

export async function compileProject(discovery, compiler, options = {}) {
  const outputDir = options.outputDir ?? discovery.project.config.outDir;
  const staging = `${outputDir}.staging-${process.pid}-${randomUUID()}`;
  await mkdir(path.dirname(outputDir), { recursive: true });
  await mkdir(discovery.project.config.buildDir, { recursive: true });
  await mkdir(staging, { recursive: true });
  const invocation = createCompilerInvocation(discovery, compiler, { ...options, outputDir: staging });
  let result;
  try {
    result = await runProcess(invocation.command, invocation.args, {
      cwd: invocation.cwd,
      env: options.env ?? process.env,
      mirror: options.mirror ?? true
    });
    if (result.code !== 0) {
      const error = new KokaineError(
        "KOKA_COMPILE_FAILED",
        `Koka compiler exited with status ${result.code}`,
        [result.stderr.trim() || result.stdout.trim()].filter(Boolean)
      );
      error.exitCode = result.code;
      error.diagnostics = `${result.stdout}${result.stderr}`;
      throw error;
    }
    const mainModules = await findMainModules(staging);
    if (mainModules.length !== 1) {
      throw new KokaineError(
        "KOKA_ENTRY_OUTPUT_INVALID",
        `Expected one generated __main.mjs module, found ${mainModules.length}`,
        mainModules
      );
    }
    const relativeMain = path.relative(staging, mainModules[0]);
    await promote(staging, outputDir);
    return {
      invocation: { ...invocation, outputDir },
      outputDir,
      mainModule: path.join(outputDir, relativeMain),
      stdout: result.stdout,
      stderr: result.stderr
    };
  } catch (error) {
    await rm(staging, { recursive: true, force: true });
    throw error;
  }
}
