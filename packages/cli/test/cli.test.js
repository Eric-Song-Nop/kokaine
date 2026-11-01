import assert from "node:assert/strict";
import path from "node:path";
import { test } from "node:test";
import { parseArguments } from "../src/cli.js";
import { formatDoctorReport } from "../src/doctor.js";

const accepted = [
  ["no arguments", [], { command: null, json: false }],
  ["command only", ["build"], { command: "build" }],
  ["--help", ["--help"], { help: true }],
  ["-h", ["-h"], { help: true }],
  ["-v", ["-v"], { version: true }],
  ["--json", ["doctor", "--json"], { command: "doctor", json: true }],
  ["--port min", ["dev", "--port", "1"], { port: 1 }],
  ["--port max", ["dev", "--port", "65535"], { port: 65535 }],
  ["--host", ["dev", "--host", "0.0.0.0"], { host: "0.0.0.0" }],
  ["--koka resolves", ["check", "--koka", "bin/koka"], { koka: path.resolve("bin/koka") }],
  ["--root resolves", ["check", "--root", "app"], { root: path.resolve("app") }],
  ["--vite-out relative to root", ["build", "--root", "app", "--vite-out", "out"], { viteOut: path.resolve("app", "out") }]
];

for (const [name, argv, expected] of accepted) {
  test(`parseArguments accepts ${name}`, () => {
    const result = parseArguments(argv);
    for (const [key, value] of Object.entries(expected)) assert.deepEqual(result[key], value, key);
  });
}

test("parseArguments defaults root to cwd", () => {
  assert.equal(parseArguments([]).root, process.cwd());
});

const rejected = [
  ["non-numeric port", ["dev", "--port", "abc"], "CLI_ARGUMENT_INVALID"],
  ["port 0", ["dev", "--port", "0"], "CLI_ARGUMENT_INVALID"],
  ["port 65536", ["dev", "--port", "65536"], "CLI_ARGUMENT_INVALID"],
  ["negative port", ["dev", "--port", "-1"], "CLI_ARGUMENT_INVALID"],
  ["fractional port", ["dev", "--port", "80.5"], "CLI_ARGUMENT_INVALID"],
  ["empty port", ["dev", "--port", ""], "CLI_ARGUMENT_INVALID"],
  ["missing port value", ["dev", "--port"], "CLI_ARGUMENT_MISSING"],
  ["missing koka value", ["check", "--koka"], "CLI_ARGUMENT_MISSING"],
  ["flag instead of value", ["check", "--root", "--json"], "CLI_ARGUMENT_MISSING"],
  ["missing vite-out value", ["build", "--vite-out"], "CLI_ARGUMENT_MISSING"],
  ["unknown long flag", ["build", "--watch"], "CLI_ARGUMENT_UNKNOWN"],
  ["unknown short flag", ["-x"], "CLI_ARGUMENT_UNKNOWN"],
  ["second positional", ["build", "extra"], "CLI_ARGUMENT_UNKNOWN"]
];

for (const [name, argv, code] of rejected) {
  test(`parseArguments rejects ${name}`, () => {
    assert.throws(() => parseArguments(argv), { code });
  });
}

test("formatDoctorReport renders a stable text layout", () => {
  const report = {
    project: { name: "app", root: "/p", entry: "src/main.kk", target: "jsweb" },
    compiler: { actualVersion: "3.2.3", binary: "/k/koka", source: "cache" },
    packages: [],
    sourceRoots: ["/p/src"],
    modules: { "app/main": "/p/src/app/main.kk" },
    fingerprint: "abc",
    commandText: "koka --target=jsweb"
  };
  assert.equal(formatDoctorReport(report), [
    "Project: app", "Root: /p", "Entry: src/main.kk", "Target: jsweb",
    "Compiler: Koka 3.2.3", "Compiler binary: /k/koka", "Compiler source: cache",
    "Koka packages:", "  (no Koka source dependencies)",
    "Source roots:", "  /p/src", "Modules: 1", "Fingerprint: abc",
    "Koka command:", "  koka --target=jsweb"
  ].join("\n"));
  report.packages = [{ name: "lib", version: "1.0.0", root: "/p/node_modules/lib" }];
  assert.match(formatDoctorReport(report), /Koka packages:\n {2}lib@1\.0\.0\n {4}\/p\/node_modules\/lib\nSource roots:/);
});
