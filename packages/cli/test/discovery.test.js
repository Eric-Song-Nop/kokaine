import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { discoverProject } from "../src/discovery.js";
import { createApp, createPackage, linkPackage } from "./helpers.js";

test("discovers transitive and peer Koka packages through parent package contexts", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "kokaine-discovery-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await createApp(root, { dependencies: { adapter: "1.0.0" } });
  const adapter = path.join(root, "node_modules", "adapter");
  await createPackage(adapter, {
    name: "adapter",
    version: "1.0.0",
    dependencies: { "koka-library": "1.0.0" },
    peerDependencies: { "peer-library": "^2.0.0", "missing-peer": "*" },
    optionalDependencies: { "missing-optional": "1.0.0" },
    koka: { sources: ["src"], compiler: ">=3.2.0 <3.3.0", targets: ["jsweb"] }
  }, [["src/adapter.kk", "adapter"]]);
  const transitive = path.join(adapter, "node_modules", "koka-library");
  await createPackage(transitive, {
    name: "koka-library",
    version: "1.0.0",
    koka: { sources: ["koka"], compiler: "3.2.x", targets: ["jsweb"] }
  }, [["koka/library.kk", "library"]]);
  await createPackage(path.join(root, "node_modules", "peer-library"), {
    name: "peer-library",
    version: "2.1.0",
    koka: { sources: ["src"], compiler: "*", targets: ["jsweb"] }
  }, [["src/peer.kk", "peer"]]);

  const discovery = await discoverProject(root);
  assert.deepEqual(discovery.packages.map(({ package: dependency }) => dependency.name), [
    "adapter",
    "koka-library",
    "peer-library"
  ]);
  assert.equal(discovery.sourceRoots.length, 4);
  assert.match(discovery.packages[1].paths[0].join(" -> "), /adapter@1\.0\.0 -> koka-library@1\.0\.0/);
});

test("deduplicates workspace symlinks by realpath", async (t) => {
  const parent = await mkdtemp(path.join(tmpdir(), "kokaine-symlink-"));
  t.after(() => rm(parent, { recursive: true, force: true }));
  const root = path.join(parent, "app");
  await mkdir(root);
  await createApp(root, { dependencies: { left: "1.0.0", right: "1.0.0" } });
  for (const name of ["left", "right"]) {
    await createPackage(path.join(root, "node_modules", name), {
      name,
      version: "1.0.0",
      dependencies: { "shared-koka": "1.0.0" }
    });
  }
  const shared = path.join(parent, "packages", "shared-koka");
  await createPackage(shared, {
    name: "shared-koka",
    version: "1.0.0",
    koka: { sources: ["src"], compiler: "*", targets: ["jsweb"] }
  }, [["src/shared.kk", "shared"]]);
  await linkPackage(path.join(root, "node_modules", "left"), "shared-koka", shared);
  await linkPackage(path.join(root, "node_modules", "right"), "shared-koka", shared);
  const discovery = await discoverProject(root);
  assert.equal(discovery.packages.length, 1);
  assert.equal(discovery.packages[0].paths.length, 2);
});

test("reports both dependency paths for multiple Koka package versions", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "kokaine-version-conflict-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await createApp(root, { dependencies: { left: "1.0.0", right: "1.0.0" } });
  for (const [parentName, version] of [["left", "1.0.0"], ["right", "2.0.0"]]) {
    const parent = path.join(root, "node_modules", parentName);
    await createPackage(parent, {
      name: parentName,
      version: "1.0.0",
      dependencies: { "shared-koka": version }
    });
    await createPackage(path.join(parent, "node_modules", "shared-koka"), {
      name: "shared-koka",
      version,
      koka: { sources: ["src"], compiler: "*", targets: ["jsweb"] }
    }, [["src/shared.kk", `shared/v${version[0]}`]]);
  }
  await assert.rejects(() => discoverProject(root), (error) => {
    assert.equal(error.code, "KOKA_PACKAGE_VERSION_CONFLICT");
    assert.match(error.format(), /left@1\.0\.0 -> shared-koka@1\.0\.0/);
    assert.match(error.format(), /right@1\.0\.0 -> shared-koka@2\.0\.0/);
    return true;
  });
});

test("fails before compilation on an incompatible compiler range", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "kokaine-compiler-conflict-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await createApp(root, { dependencies: { future: "1.0.0" } });
  await createPackage(path.join(root, "node_modules", "future"), {
    name: "future",
    version: "1.0.0",
    koka: { sources: ["src"], compiler: ">=3.3.0", targets: ["jsweb"] }
  }, [["src/future.kk", "future"]]);
  await assert.rejects(() => discoverProject(root), (error) => error.code === "COMPILER_CONSTRAINT_CONFLICT");
});
