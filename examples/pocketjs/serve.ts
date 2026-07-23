import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const DEMO = "kokaine-pocket-demo";
const exampleDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(exampleDirectory, "../..");
const distDirectory = resolve(exampleDirectory, "dist");
const frameworkEntry = realpathSync(
  createRequire(resolve(projectDirectory, "packages/pocketjs/package.json"))
    .resolve("@pocketjs/framework")
);
const frameworkDirectory = resolve(dirname(frameworkEntry), "..");
const frameworkManifest = JSON.parse(
  readFileSync(resolve(frameworkDirectory, "package.json"), "utf8")
) as { version?: string };
if (frameworkManifest.version !== "0.6.0") {
  throw new Error(
    `PocketJS browser example requires @pocketjs/framework 0.6.0, got ${frameworkManifest.version ?? "unknown"}`
  );
}
const hostDirectory = resolve(frameworkDirectory, "host-web");

for (const required of [
  resolve(hostDirectory, "index.html"),
  resolve(hostDirectory, "engine.js"),
  resolve(hostDirectory, "wasm-ops.js"),
  resolve(hostDirectory, "pocketjs.wasm"),
  resolve(distDirectory, `${DEMO}.js`),
  resolve(distDirectory, `${DEMO}.pak`)
]) {
  if (!existsSync(required)) {
    throw new Error(`PocketJS browser example is missing ${required}`);
  }
}

const mimeTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".pak": "application/octet-stream",
  ".png": "image/png",
  ".wasm": "application/wasm"
};

function inside(directory: string, relativePath: string): string | undefined {
  const target = resolve(directory, relativePath.replace(/^[/\\]+/, ""));
  return target === directory || target.startsWith(directory + sep) ? target : undefined;
}

function fileResponse(path: string | undefined): Response {
  if (!path) return new Response("not found", { status: 404 });
  try {
    if (!statSync(path).isFile()) return new Response("not found", { status: 404 });
  } catch {
    return new Response("not found", { status: 404 });
  }
  return new Response(Bun.file(path), {
    headers: {
      "cache-control": "no-store",
      "content-type": mimeTypes[extname(path)] ?? "application/octet-stream"
    }
  });
}

const server = Bun.serve<{ role: "device" | "panel" }>({
  hostname: "127.0.0.1",
  port: Number(process.env.PORT ?? 8130),
  fetch(request, bunServer) {
    const url = new URL(request.url);
    let path: string;
    try {
      path = decodeURIComponent(url.pathname);
    } catch {
      return new Response("invalid URL path", { status: 400 });
    }

    if (path === "/ws") {
      const role = url.searchParams.get("role") === "device" ? "device" : "panel";
      if (bunServer.upgrade(request, { data: { role } })) return undefined;
      return new Response("websocket upgrade failed", { status: 400 });
    }
    if (path === "/" || path === "/index.html") {
      return fileResponse(resolve(hostDirectory, "index.html"));
    }
    if (path === "/devtools" || path === "/devtools/") {
      return fileResponse(resolve(hostDirectory, "devtools.html"));
    }
    if (path === "/demos") {
      return Response.json(
        [{ name: DEMO, hasPak: true, mounts: true }],
        { headers: { "cache-control": "no-store" } }
      );
    }
    if (path.startsWith("/dist/")) {
      return fileResponse(inside(distDirectory, path.slice("/dist/".length)));
    }
    return fileResponse(inside(hostDirectory, path.slice(1)));
  },
  websocket: {
    message() {
      // The example keeps the official host transport connected without
      // embedding Pocket DevTools. Rendering and input do not need a panel.
    }
  }
});

console.log(`Kokaine PocketJS browser example: http://127.0.0.1:${server.port}/`);
