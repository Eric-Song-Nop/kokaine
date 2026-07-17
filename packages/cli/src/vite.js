import path from "node:path";
import { watch } from "chokidar";

const PUBLIC_ID = "/@kokaine/entry";
const VIRTUAL_ID = "virtual:kokaine-entry";
const RESOLVED_ID = "\0virtual:kokaine-entry";

export function createKokaineVitePlugin(options) {
  const getMainModule = typeof options.mainModule === "function"
    ? options.mainModule
    : () => options.mainModule;
  return {
    name: "kokaine",
    enforce: "pre",
    resolveId(id) {
      if (id === PUBLIC_ID || id === VIRTUAL_ID) return RESOLVED_ID;
      return null;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;
      const mainModule = getMainModule();
      return `import ${JSON.stringify(mainModule)};\n`;
    },
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        if (html.includes(PUBLIC_ID) || html.includes(VIRTUAL_ID)) return html;
        const entry = `    <script type="module" src="${PUBLIC_ID}"></script>\n`;
        return html.includes("</body>")
          ? html.replace("</body>", `${entry}  </body>`)
          : `${html}\n${entry}`;
      }
    }
  };
}

export async function buildWithVite(project, mainModule, options = {}) {
  const { build } = await import("vite");
  return build({
    root: project.root,
    logLevel: options.logLevel ?? "info",
    plugins: [createKokaineVitePlugin({ mainModule })],
    build: {
      outDir: options.viteOutDir ?? path.join(project.root, "dist"),
      emptyOutDir: options.emptyOutDir ?? true
    }
  });
}

function overlayError(server, error) {
  const message = error?.format?.() ?? error?.message ?? String(error);
  server.ws.send({
    type: "error",
    err: {
      message,
      stack: error?.stack ?? message,
      plugin: "kokaine"
    }
  });
}

export async function serveWithVite(context, options = {}) {
  const { createServer } = await import("vite");
  let mainModule = context.compilation.mainModule;
  const plugin = createKokaineVitePlugin({ mainModule: () => mainModule });
  const server = await createServer({
    root: context.discovery.project.root,
    logLevel: options.logLevel ?? "info",
    plugins: [plugin],
    server: {
      host: options.host,
      port: options.port,
      strictPort: options.strictPort ?? false
    }
  });

  const sourceRoots = context.discovery.sourceRoots;
  const sourceWatcher = watch(sourceRoots, {
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 75, pollInterval: 20 }
  });
  let compiling = false;
  let pending = false;
  async function rebuild() {
    pending = true;
    if (compiling) return;
    compiling = true;
    try {
      while (pending) {
        pending = false;
        try {
          const compilation = await context.recompile();
          mainModule = compilation.mainModule;
          server.moduleGraph.invalidateAll();
          server.ws.send({ type: "full-reload", path: "*" });
        } catch (error) {
          overlayError(server, error);
        }
      }
    } finally {
      compiling = false;
    }
  }

  sourceWatcher.on("all", (event, file) => {
    if (!new Set(["add", "change", "unlink"]).has(event)) return;
    if (!file.endsWith(".kk")) return;
    if (!sourceRoots.some((sourceRoot) => {
      const relative = path.relative(sourceRoot, file);
      return relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
    })) return;
    void rebuild();
  });
  server.httpServer?.once("close", () => void sourceWatcher.close());
  await server.listen();
  server.printUrls();
  return server;
}
