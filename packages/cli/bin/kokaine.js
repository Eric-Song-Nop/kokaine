#!/usr/bin/env node

import { runCli } from "../src/cli.js";

runCli().catch((error) => {
  const message = error?.format?.() ?? error?.stack ?? String(error);
  process.stderr.write(`${message}\n`);
  process.exitCode = error?.exitCode ?? 1;
});
