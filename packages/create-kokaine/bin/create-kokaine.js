#!/usr/bin/env node

import { run } from "../src/create.js";

run().catch((error) => {
  process.stderr.write(`${error?.stack ?? error}\n`);
  process.exitCode = 1;
});
