import path from "node:path";
import { readFile } from "node:fs/promises";
import { compileProject } from "./compiler.js";
import { discoverProject } from "./discovery.js";
import { createDoctorReport, formatDoctorReport } from "./doctor.js";
import { KokaineError } from "./errors.js";
import { createModuleIndex } from "./modules.js";
import { resolveCompiler } from "./toolchain.js";
import { buildWithVite, serveWithVite } from "./vite.js";

const HELP = `Usage: kokaine <command> [options]

Commands:
  doctor        Validate and print the installed package/toolchain graph
  check         Compile the Koka application without running Vite
  build         Compile Koka and create a Vite production bundle
  dev           Compile Koka, watch discovered sources, and serve with Vite

Options:
  --root <dir>       Project directory (default: current directory)
  --koka <file>      Explicit Koka binary (also supported through KOKA_BIN)
  --json             Machine-readable doctor output
  --host <host>      Vite development host
  --port <port>      Vite development port
  --vite-out <dir>   Vite production output directory (default: dist)
  -h, --help         Show this help
  -v, --version      Show the CLI version`;

function parseArguments(argv) {
  const result = { command: null, root: process.cwd(), json: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith("-") && result.command === null) {
      result.command = argument;
      continue;
    }
    if (argument === "--json") result.json = true;
    else if (argument === "-h" || argument === "--help") result.help = true;
    else if (argument === "-v" || argument === "--version") result.version = true;
    else if (["--root", "--koka", "--host", "--port", "--vite-out"].includes(argument)) {
      const value = argv[index + 1];
      if (value === undefined || value.startsWith("--")) {
        throw new KokaineError("CLI_ARGUMENT_MISSING", `${argument} requires a value`);
      }
      index += 1;
      if (argument === "--root") result.root = path.resolve(value);
      else if (argument === "--koka") result.koka = path.resolve(value);
      else if (argument === "--host") result.host = value;
      else if (argument === "--vite-out") result.viteOutValue = value;
      else {
        const port = Number(value);
        if (!Number.isInteger(port) || port < 1 || port > 65535) {
          throw new KokaineError("CLI_ARGUMENT_INVALID", `Invalid port: ${value}`);
        }
        result.port = port;
      }
    } else {
      throw new KokaineError("CLI_ARGUMENT_UNKNOWN", `Unknown argument: ${argument}`);
    }
  }
  if (result.viteOutValue) result.viteOut = path.resolve(result.root, result.viteOutValue);
  return result;
}

async function readVersion() {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  return packageJson.version;
}

async function prepare(options) {
  const discovery = await discoverProject(options.root);
  const moduleIndex = await createModuleIndex(discovery.sourceRoots);
  const compiler = await resolveCompiler(discovery.project, { binary: options.koka });
  return { discovery, moduleIndex, compiler };
}

export async function runCli(argv = process.argv.slice(2)) {
  const options = parseArguments(argv);
  if (options.help || (!options.command && !options.version)) {
    process.stdout.write(`${HELP}\n`);
    return;
  }
  if (options.version) {
    process.stdout.write(`${await readVersion()}\n`);
    return;
  }
  if (!new Set(["doctor", "check", "build", "dev"]).has(options.command)) {
    throw new KokaineError("CLI_COMMAND_UNKNOWN", `Unknown command: ${options.command}`, ["Run kokaine --help for usage."]);
  }

  const context = await prepare(options);
  if (options.command === "doctor") {
    const report = createDoctorReport(context.discovery, context.moduleIndex, context.compiler);
    process.stdout.write(options.json ? `${JSON.stringify(report, null, 2)}\n` : `${formatDoctorReport(report)}\n`);
    return report;
  }

  const mode = options.command === "check" ? "check" : options.command === "dev" ? "dev" : "build";
  const compilation = await compileProject(context.discovery, context.compiler.binary, { mode });
  if (options.command === "check") return compilation;
  if (options.command === "build") {
    await buildWithVite(context.discovery.project, compilation.mainModule, {
      viteOutDir: options.viteOut
    });
    return compilation;
  }

  const server = await serveWithVite({
    ...context,
    compilation,
    recompile: () => compileProject(context.discovery, context.compiler.binary, { mode: "dev" })
  }, { host: options.host, port: options.port });
  const close = async () => {
    await server.close();
    process.exitCode = 0;
  };
  process.once("SIGINT", close);
  process.once("SIGTERM", close);
  return server;
}
