import { spawn } from "node:child_process";

export function runProcess(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const nodeScript = command.endsWith(".js");
    const child = spawn(nodeScript ? process.execPath : command, nodeScript ? [command, ...args] : args, {
      cwd: options.cwd,
      env: options.env,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"]
    });
    const stdout = [];
    const stderr = [];
    child.stdout.on("data", (chunk) => {
      stdout.push(chunk);
      if (options.mirror !== false) process.stdout.write(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr.push(chunk);
      if (options.mirror !== false) process.stderr.write(chunk);
    });
    child.once("error", reject);
    child.once("close", (code, signal) => resolve({
      code: code ?? 1,
      signal,
      stdout: Buffer.concat(stdout).toString("utf8"),
      stderr: Buffer.concat(stderr).toString("utf8")
    }));
  });
}
