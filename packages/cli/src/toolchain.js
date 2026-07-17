import { createHash, randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import {
  access,
  mkdir,
  open,
  readFile,
  realpath,
  rename,
  rm,
  stat,
  unlink
} from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { KokaineError } from "./errors.js";
import { runProcess } from "./process.js";
import { extractTarGz } from "./tar.js";

const RELEASES_FILE = fileURLToPath(new URL("../compiler-releases.json", import.meta.url));
const LOCK_STALE_MS = 10 * 60 * 1000;
const LOCK_TIMEOUT_MS = 2 * 60 * 1000;

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function defaultCacheDirectory(environment = process.env, platform = process.platform) {
  if (environment.KOKAINE_CACHE_DIR) return path.resolve(environment.KOKAINE_CACHE_DIR);
  if (environment.XDG_CACHE_HOME) return path.join(environment.XDG_CACHE_HOME, "kokaine");
  if (platform === "win32" && environment.LOCALAPPDATA) return path.join(environment.LOCALAPPDATA, "kokaine", "cache");
  return path.join(homedir(), ".cache", "kokaine");
}

export async function readCompilerVersion(binary) {
  const result = await runProcess(binary, ["--version"], { mirror: false });
  if (result.code !== 0) {
    throw new KokaineError("COMPILER_VERSION_FAILED", `Unable to query Koka compiler at ${binary}`, [result.stderr.trim()]);
  }
  const match = /\bKoka\s+(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)/i.exec(`${result.stdout}\n${result.stderr}`);
  if (!match) {
    throw new KokaineError("COMPILER_VERSION_UNKNOWN", `Unable to parse the Koka compiler version at ${binary}`, [result.stdout.trim()]);
  }
  return match[1];
}

async function validateCompiler(binary, expectedVersion) {
  let canonical;
  try {
    canonical = await realpath(binary);
  } catch (error) {
    throw new KokaineError("COMPILER_NOT_FOUND", `Koka compiler does not exist: ${binary}`, [error.message]);
  }
  const actualVersion = await readCompilerVersion(canonical);
  if (actualVersion !== expectedVersion) {
    throw new KokaineError(
      "COMPILER_VERSION_MISMATCH",
      `Expected Koka ${expectedVersion}, but ${canonical} is ${actualVersion}`,
      ["Select a matching binary with --koka or KOKA_BIN."]
    );
  }
  return { binary: canonical, version: actualVersion };
}

async function loadReleases() {
  return JSON.parse(await readFile(RELEASES_FILE, "utf8"));
}

async function download(url, destination, expectedSha256, fetchImpl) {
  const response = await fetchImpl(url, { redirect: "follow" });
  if (!response.ok || !response.body) {
    throw new KokaineError("TOOLCHAIN_DOWNLOAD_FAILED", `Unable to download ${url}`, [`HTTP ${response.status}`]);
  }
  const hash = createHash("sha256");
  const digest = new Transform({
    transform(chunk, _encoding, callback) {
      hash.update(chunk);
      callback(null, chunk);
    }
  });
  await pipeline(Readable.fromWeb(response.body), digest, createWriteStream(destination, { flags: "wx" }));
  const actual = hash.digest("hex");
  if (actual !== expectedSha256) {
    throw new KokaineError(
      "TOOLCHAIN_CHECKSUM_MISMATCH",
      "Downloaded Koka compiler failed SHA-256 verification",
      [`expected: ${expectedSha256}`, `actual:   ${actual}`, `url: ${url}`]
    );
  }
}

async function acquireLock(lockFile, installDirectory) {
  const started = Date.now();
  while (true) {
    try {
      const handle = await open(lockFile, "wx");
      await handle.writeFile(`${process.pid}\n${new Date().toISOString()}\n`);
      return handle;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      try {
        await access(installDirectory);
        return null;
      } catch {
        // The other process has not published the installation yet.
      }
      try {
        const info = await stat(lockFile);
        if (Date.now() - info.mtimeMs > LOCK_STALE_MS) {
          await unlink(lockFile);
          continue;
        }
      } catch (lockError) {
        if (lockError.code === "ENOENT") continue;
        throw lockError;
      }
      if (Date.now() - started > LOCK_TIMEOUT_MS) {
        throw new KokaineError("TOOLCHAIN_LOCK_TIMEOUT", `Timed out waiting for compiler installation lock`, [lockFile]);
      }
      await delay(100);
    }
  }
}

async function installCompiler({ version, cacheDirectory, release, fetchImpl, extract, platform, arch }) {
  const platformKey = `${platform}-${arch}`;
  const installDirectory = path.join(cacheDirectory, "koka", version, platformKey);
  const binaryName = platform === "win32" ? "koka.exe" : "koka";
  const binary = path.join(installDirectory, "bin", binaryName);
  try {
    await access(binary);
    return { binary, downloaded: false };
  } catch {
    // Continue to the locked installation path.
  }

  await mkdir(path.dirname(installDirectory), { recursive: true });
  const lockFile = `${installDirectory}.lock`;
  const lockHandle = await acquireLock(lockFile, installDirectory);
  if (lockHandle === null) return { binary, downloaded: false };

  const token = `${process.pid}-${randomUUID()}`;
  const archive = path.join(path.dirname(installDirectory), `.download-${token}.tar.gz`);
  const staging = path.join(path.dirname(installDirectory), `.install-${token}`);
  try {
    try {
      await access(binary);
      return { binary, downloaded: false };
    } catch {
      // Still missing while holding the lock.
    }
    await download(release.url, archive, release.sha256, fetchImpl);
    await extract(archive, staging);
    await rename(staging, installDirectory);
    return { binary, downloaded: true };
  } finally {
    await rm(archive, { force: true });
    await rm(staging, { force: true, recursive: true });
    await lockHandle.close();
    await rm(lockFile, { force: true });
  }
}

export async function resolveCompiler(projectOrVersion, options = {}) {
  const version = typeof projectOrVersion === "string"
    ? projectOrVersion
    : projectOrVersion.config.compiler;
  const environment = options.env ?? process.env;
  const explicit = options.binary ?? environment.KOKA_BIN;
  if (explicit) {
    const validated = await validateCompiler(path.resolve(explicit), version);
    return {
      ...validated,
      source: options.binary ? "option" : "environment",
      cachePath: null
    };
  }

  const releases = options.releases ?? await loadReleases();
  const platform = options.platform ?? process.platform;
  const arch = options.arch ?? process.arch;
  const platformKey = `${platform}-${arch}`;
  const release = releases[version]?.[platformKey];
  if (!release) {
    throw new KokaineError(
      "TOOLCHAIN_PLATFORM_UNSUPPORTED",
      `No managed Koka ${version} compiler is available for ${platformKey}`,
      ["Use --koka or KOKA_BIN to select an explicit compatible compiler."]
    );
  }
  const cacheDirectory = options.cacheDirectory ?? defaultCacheDirectory(environment, platform);
  const installed = await installCompiler({
    version,
    cacheDirectory,
    release,
    fetchImpl: options.fetch ?? globalThis.fetch,
    extract: options.extract ?? extractTarGz,
    platform,
    arch
  });
  const validated = await validateCompiler(installed.binary, version);
  return {
    ...validated,
    source: installed.downloaded ? "download" : "cache",
    cachePath: path.dirname(path.dirname(validated.binary))
  };
}
