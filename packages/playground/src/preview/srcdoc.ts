export const PREVIEW_CHANNEL = 'kokaine.preview.v1';

export const MAX_CDP_MESSAGE_BYTES = 1_000_000;

export interface PreviewDocumentOptions {
  token: string;
  entryPath: string;
  revision: string | number;
  appOrigin: string;
  chobitsuUrl: string;
}

export interface DevtoolsDocumentAssets {
  customElementsUrl?: string;
  chiiUrl?: string;
}

function safeJson(value: unknown): string {
  return JSON.stringify(value)
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e')
    .replaceAll('&', '\\u0026')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029');
}

function htmlAttribute(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

/*
 * The Chobitsu bridge is adapted from Solid Playground's MIT-licensed preview:
 * https://github.com/solidjs/solid-playground/blob/main/packages/solid-repl/src/components/preview.tsx
 * Copyright (c) 2022 SolidJS Core Team.
 */
const PREVIEW_BOOT_SOURCE = String.raw`
(() => {
  const CONFIG = __KOKAINE_PREVIEW_CONFIG__;
  const realParent = window.parent;
  const MAX_CDP_BYTES = 1000000;

  const send = (type, payload) => {
    try {
      realParent.postMessage({
        channel: CONFIG.channel,
        token: CONFIG.token,
        type,
        payload,
      }, '*');
    } catch {
      // A logging bridge must never take the preview down with it.
    }
  };

  const makeStorage = (initial) => {
    const values = new Map(initial || []);
    return {
      getItem: (key) => values.has(String(key)) ? values.get(String(key)) : null,
      setItem: (key, value) => values.set(String(key), String(value)),
      removeItem: (key) => values.delete(String(key)),
      clear: () => values.clear(),
      key: (index) => Array.from(values.keys())[index] || null,
      get length() { return values.size; },
    };
  };

  // A srcdoc iframe without allow-same-origin has an opaque origin. Chobitsu reads
  // storage and parent.location while constructing its resource tree, so give it
  // narrow in-memory substitutes without weakening the iframe sandbox.
  try {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: makeStorage(),
    });
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      value: makeStorage(),
    });
  } catch {
    // Some browsers already expose usable storage here.
  }

  const targetOrigin = CONFIG.appOrigin;
  const displayUrl = CONFIG.appOrigin
    + '/__kokaine/preview/'
    + encodeURIComponent(CONFIG.entryPath || 'main.mjs');

  try {
    window.parent = Object.freeze({
      location: Object.freeze({
        href: displayUrl,
        origin: targetOrigin,
      }),
      postMessage: (message, target, transfer) => {
        realParent.postMessage(message, target, transfer);
      },
    });
  } catch {
    // The bridge uses realParent directly; this shim is only for Chobitsu.
  }

  const serialize = (value, seen, depth) => {
    if (value === null || value === undefined) return value;

    const kind = typeof value;
    if (kind === 'string' || kind === 'number' || kind === 'boolean') return value;
    if (kind === 'bigint') return String(value) + 'n';
    if (kind === 'symbol') return String(value);
    if (kind === 'function') return '[Function ' + (value.name || 'anonymous') + ']';

    if (value instanceof Error) {
      return {
        name: value.name,
        message: value.message,
        stack: value.stack || '',
      };
    }

    if (typeof Element !== 'undefined' && value instanceof Element) {
      const id = value.id ? '#' + value.id : '';
      const classes = value.classList && value.classList.length
        ? '.' + Array.from(value.classList).join('.')
        : '';
      return '<' + value.localName + id + classes + '>';
    }

    if (depth >= 4) return '[Object]';
    if (seen.has(value)) return '[Circular]';
    seen.add(value);

    if (Array.isArray(value)) {
      const result = value.slice(0, 100).map((item) => serialize(item, seen, depth + 1));
      if (value.length > 100) result.push('... ' + (value.length - 100) + ' more');
      return result;
    }

    const result = {};
    let keys = [];
    try {
      keys = Reflect.ownKeys(value).slice(0, 100);
    } catch {
      return String(value);
    }

    for (const key of keys) {
      const printableKey = typeof key === 'symbol' ? String(key) : key;
      try {
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        if (descriptor && 'value' in descriptor) {
          result[printableKey] = serialize(descriptor.value, seen, depth + 1);
        } else {
          result[printableKey] = '[Getter]';
        }
      } catch (error) {
        result[printableKey] = '[Unserializable: ' + String(error) + ']';
      }
    }
    return result;
  };

  const serializeArguments = (args) => {
    try {
      return Array.from(args).map((value) => serialize(value, new WeakSet(), 0));
    } catch (error) {
      return ['[Unable to serialize console arguments: ' + String(error) + ']'];
    }
  };

  const consoleLevels = ['log', 'info', 'warn', 'error', 'debug'];
  for (const level of consoleLevels) {
    const original = console[level].bind(console);
    console[level] = (...args) => {
      send('runtime-log', {
        level,
        args: serializeArguments(args),
        timestamp: Date.now(),
      });
      original(...args);
    };
  }

  const toErrorPayload = (error, fallbackMessage, phase, event) => ({
    name: error && typeof error.name === 'string' ? error.name : 'Error',
    message: error && typeof error.message === 'string'
      ? error.message
      : fallbackMessage || String(error),
    stack: error && typeof error.stack === 'string' ? error.stack : '',
    source: event && typeof event.filename === 'string' ? event.filename : undefined,
    line: event && typeof event.lineno === 'number' ? event.lineno : undefined,
    column: event && typeof event.colno === 'number' ? event.colno : undefined,
    phase,
    timestamp: Date.now(),
  });

  window.addEventListener('error', (event) => {
    const payload = toErrorPayload(
      event.error,
      event.message || 'A preview resource failed to load.',
      'runtime',
      event,
    );
    send('runtime-error', payload);
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    send('runtime-error', toErrorPayload(
      event.reason,
      'Unhandled promise rejection',
      'unhandled-rejection',
    ));
  });

  const isCdpMessage = (message) => {
    if (typeof message !== 'string' || message.length > MAX_CDP_BYTES) return false;
    try {
      const parsed = JSON.parse(message);
      return parsed !== null
        && typeof parsed === 'object'
        && (typeof parsed.method === 'string'
          || typeof parsed.id === 'number'
          || typeof parsed.id === 'string');
    } catch {
      return false;
    }
  };

  const chobitsu = window.chobitsu;
  let internalCdpId = 0;

  const sendInternalCdp = (method, params) => {
    if (!chobitsu || typeof chobitsu.sendRawMessage !== 'function') return;
    internalCdpId += 1;
    chobitsu.sendRawMessage(JSON.stringify({
      id: '__kokaine_internal_' + internalCdpId,
      method,
      params: params || {},
    }));
  };

  const sendCdpEvent = (method, params) => {
    send('cdp', JSON.stringify({ method, params: params || {} }));
  };

  if (chobitsu && typeof chobitsu.setOnMessage === 'function') {
    chobitsu.setOnMessage((message) => {
      if (!isCdpMessage(message)) return;
      if (message.includes('"id":"__kokaine_internal_')) return;
      send('cdp', message);
    });

    try {
      const pageDomain = chobitsu.domain && chobitsu.domain('Page');
      if (pageDomain) {
        pageDomain.getResourceContent = () => Promise.resolve({
          base64Encoded: false,
          content: '<!doctype html>\\n' + document.documentElement.outerHTML,
        });
      }
    } catch (error) {
      console.warn('Kokaine DevTools could not install its source bridge.', error);
    }
  } else {
    console.warn('Kokaine DevTools are unavailable because Chobitsu did not load.');
  }

  const MAX_MODULE_COUNT = 512;
  const MAX_MODULE_SOURCE_CHARS = 16 * 1024 * 1024;
  const GENERATED_MODULE_PREFIX = 'kokaine-generated/';
  const generatedObjectUrls = [];
  let loadGeneration = 0;

  const normalizeModuleName = (value) => {
    if (typeof value !== 'string') return '';
    const clean = value.split(/[?#]/, 1)[0].replace(/\\/g, '/');
    const segments = [];
    for (const segment of clean.split('/')) {
      if (!segment || segment === '.') continue;
      if (segment === '..') segments.pop();
      else segments.push(segment);
    }
    return segments.length > 0 ? segments[segments.length - 1] : '';
  };

  const revokeGeneratedModules = () => {
    while (generatedObjectUrls.length > 0) {
      const url = generatedObjectUrls.pop();
      try { URL.revokeObjectURL(url); } catch {}
    }
  };

  const moduleFallbackUrl = (baseUrl, moduleName) => {
    const resolved = new URL(encodeURIComponent(moduleName), baseUrl);
    if (resolved.origin !== CONFIG.appOrigin || !resolved.pathname.startsWith(baseUrl.pathname)) {
      throw new Error('A generated module tried to escape the precompiled module directory.');
    }
    return resolved.href;
  };

  const generatedModuleSpecifier = (moduleName) => (
    GENERATED_MODULE_PREFIX + encodeURIComponent(moduleName)
  );

  const rewriteModuleSource = (source, available, baseUrl) => {
    const replaceSpecifier = (match, prefix, quote, specifier, suffix) => {
      const dependency = normalizeModuleName(specifier);
      if (!dependency) throw new Error('Invalid relative module import: ' + specifier);

      const resolved = available.has(dependency)
        ? generatedModuleSpecifier(dependency)
        : moduleFallbackUrl(baseUrl, dependency);
      return prefix + quote + resolved + quote + (suffix || '');
    };

    const staticImports = /(\b(?:import|export)\s+(?:[^'";]*?\s+from\s*)?)(['"])(\.{1,2}\/[^'"]+)\2/g;
    const dynamicImports = /(\bimport\s*\(\s*)(['"])(\.{1,2}\/[^'"]+)\2(\s*\))/g;
    let rewritten = source.replace(
      staticImports,
      (match, prefix, quote, specifier) => replaceSpecifier(match, prefix, quote, specifier, ''),
    );
    rewritten = rewritten.replace(
      dynamicImports,
      (match, prefix, quote, specifier, suffix) => replaceSpecifier(
        match,
        prefix,
        quote,
        specifier,
        suffix,
      ),
    );
    return rewritten;
  };

  const readModuleBundle = (payload) => {
    if (!payload || typeof payload !== 'object') {
      throw new Error('The compiler returned an invalid module bundle.');
    }
    if (typeof payload.entryPath !== 'string' || payload.entryPath.length === 0) {
      throw new Error('The compiler did not identify an entry module.');
    }
    if (!Array.isArray(payload.modules) || payload.modules.length === 0) {
      throw new Error('The compiler did not generate any JavaScript modules.');
    }
    if (payload.modules.length > MAX_MODULE_COUNT) {
      throw new Error('The compiler generated too many JavaScript modules.');
    }

    if (typeof payload.precompiledBaseUrl !== 'string') {
      throw new Error('The module bundle has no precompiled runtime release.');
    }
    const baseUrl = new URL(payload.precompiledBaseUrl, CONFIG.appOrigin + '/');
    if (baseUrl.origin !== CONFIG.appOrigin) {
      throw new Error('Precompiled modules must be served from the playground origin.');
    }
    if (!baseUrl.pathname.endsWith('/')) baseUrl.pathname += '/';

    const sources = new Map();
    let sourceChars = 0;
    for (const file of payload.modules) {
      if (!file || typeof file !== 'object'
          || typeof file.path !== 'string' || typeof file.source !== 'string') {
        throw new Error('The compiler returned a malformed JavaScript module.');
      }
      const name = normalizeModuleName(file.path);
      if (!name || !name.endsWith('.mjs')) {
        throw new Error('Generated module paths must end in .mjs.');
      }
      if (sources.has(name)) {
        throw new Error('Generated modules contain a duplicate filename: ' + name);
      }
      sourceChars += file.source.length;
      if (sourceChars > MAX_MODULE_SOURCE_CHARS) {
        throw new Error('The generated JavaScript exceeds the preview size limit.');
      }
      sources.set(name, file.source);
    }

    const entryName = normalizeModuleName(payload.entryPath);
    if (!sources.has(entryName)) {
      throw new Error('The generated entry module is missing: ' + entryName);
    }
    return { sources, entryName, baseUrl };
  };

  const showModuleError = (error) => {
    const payload = toErrorPayload(error, 'Unable to load the compiled module.', 'module-import');
    const loader = document.getElementById('kokaine-preview-loader');
    if (loader) {
      loader.dataset.state = 'error';
      loader.innerHTML = '<strong>Preview failed to start</strong><span></span>';
      const detail = loader.querySelector('span');
      if (detail) detail.textContent = payload.message;
    }
    send('runtime-error', payload);
    console.error(error);
  };

  const loadModuleBundle = async (payload) => {
    const generation = ++loadGeneration;
    revokeGeneratedModules();

    try {
      const { sources, entryName, baseUrl } = readModuleBundle(payload);
      const importMap = { imports: {} };

      for (const [name, source] of sources) {
        const rewritten = rewriteModuleSource(source, sources, baseUrl);
        const annotated = rewritten
          + '\n//# sourceURL=kokaine-generated:///' + encodeURIComponent(name) + '\n';
        const objectUrl = URL.createObjectURL(new Blob([annotated], {
          type: 'application/javascript',
        }));
        generatedObjectUrls.push(objectUrl);
        importMap.imports[generatedModuleSpecifier(name)] = objectUrl;
      }
      if (generation !== loadGeneration) return;

      const importMapElement = document.createElement('script');
      importMapElement.type = 'importmap';
      importMapElement.textContent = JSON.stringify(importMap);
      document.head.append(importMapElement);

      await import(generatedModuleSpecifier(entryName));
      if (generation !== loadGeneration) return;

      const loader = document.getElementById('kokaine-preview-loader');
      if (loader) loader.remove();
      send('ready', {
        entryPath: payload.entryPath,
        revision: CONFIG.revision,
        timestamp: Date.now(),
      });
    } catch (error) {
      if (generation === loadGeneration) showModuleError(error);
    }
  };

  window.addEventListener('unload', revokeGeneratedModules, { once: true });

  const initializeDevtools = () => {
    sendCdpEvent('Page.frameNavigated', {
      frame: {
        id: '1',
        loaderId: '1',
        mimeType: 'text/html',
        securityOrigin: targetOrigin,
        url: displayUrl,
      },
      type: 'Navigation',
    });
    sendInternalCdp('Network.enable');
    sendCdpEvent('Runtime.executionContextsCleared');
    sendInternalCdp('Runtime.enable');
    sendInternalCdp('Debugger.enable');
    sendInternalCdp('DOMStorage.enable');
    sendInternalCdp('DOM.enable');
    sendInternalCdp('CSS.enable');
    sendInternalCdp('Overlay.enable');
    sendCdpEvent('DOM.documentUpdated');
  };

  window.addEventListener('message', (event) => {
    if (event.source !== realParent) return;
    const message = event.data;
    if (!message
      || message.channel !== CONFIG.channel
      || message.token !== CONFIG.token
      || typeof message.type !== 'string') return;

    if (message.type === 'theme') {
      document.documentElement.classList.toggle('dark', message.payload === true);
      document.documentElement.style.colorScheme = message.payload ? 'dark' : 'light';
      return;
    }

    if (message.type === 'devtools-ready') {
      initializeDevtools();
      return;
    }

    if (message.type === 'load-modules') {
      void loadModuleBundle(message.payload);
      return;
    }

    if (message.type === 'cdp-command' && isCdpMessage(message.payload)) {
      if (chobitsu && typeof chobitsu.sendRawMessage === 'function') {
        chobitsu.sendRawMessage(message.payload);
      }
    }
  });

  const announceReady = () => {
    send('bridge-ready', { revision: CONFIG.revision });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', announceReady, { once: true });
  } else {
    announceReady();
  }
})();
`;

// Chobitsu touches Web Storage while its UMD bundle is evaluating, so the
// opaque-origin storage shim must be installed before the external script.
const PREVIEW_STORAGE_SHIM_SOURCE = String.raw`
(() => {
  const makeStorage = () => {
    const values = new Map();
    return {
      getItem: (key) => values.has(String(key)) ? values.get(String(key)) : null,
      setItem: (key, value) => values.set(String(key), String(value)),
      removeItem: (key) => values.delete(String(key)),
      clear: () => values.clear(),
      key: (index) => Array.from(values.keys())[index] || null,
      get length() { return values.size; },
    };
  };
  try {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: makeStorage(),
    });
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      value: makeStorage(),
    });
  } catch {}
})();
`;

export function buildPreviewDocument(options: PreviewDocumentOptions): string {
  const config = safeJson({
    channel: PREVIEW_CHANNEL,
    token: options.token,
    entryPath: options.entryPath,
    revision: options.revision,
    appOrigin: options.appOrigin,
  });
  const boot = PREVIEW_BOOT_SOURCE.replace('__KOKAINE_PREVIEW_CONFIG__', config);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="referrer" content="no-referrer" />
    <title>Kokaine preview</title>
    <style>
      :root {
        color: #20222a;
        color-scheme: light;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #ffffff;
      }
      :root.dark {
        color: #e8e9ee;
        color-scheme: dark;
        background: #17181d;
      }
      *, *::before, *::after { box-sizing: border-box; }
      html, body { min-width: 100%; min-height: 100%; margin: 0; }
      body { min-height: 100vh; padding: 16px; background: inherit; color: inherit; }
      #app { min-height: calc(100vh - 32px); }
      button, input, select, textarea { font: inherit; }
      button, input, select, textarea {
        border: 1px solid #c7cad2;
        border-radius: 5px;
      }
      :root.dark button, :root.dark input, :root.dark select, :root.dark textarea {
        border-color: #4a4d58;
      }
      button { padding: 0.42em 0.72em; color: inherit; background: #f4f5f8; cursor: pointer; }
      :root.dark button { background: #292b32; }
      :focus-visible { outline: 2px solid #6558d3; outline-offset: 2px; }
      #kokaine-preview-loader {
        min-height: calc(100vh - 32px);
        display: grid;
        place-content: center;
        gap: 8px;
        color: #727680;
        text-align: center;
      }
      #kokaine-preview-loader::before {
        width: 20px;
        height: 20px;
        margin: 0 auto 4px;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        content: '';
        animation: kokaine-spin 800ms linear infinite;
      }
      #kokaine-preview-loader[data-state="error"] { color: #bd3348; }
      #kokaine-preview-loader[data-state="error"]::before { display: none; }
      #kokaine-preview-loader span { max-width: 44ch; font-size: 0.8125rem; }
      @keyframes kokaine-spin { to { transform: rotate(360deg); } }
      @media (prefers-reduced-motion: reduce) {
        #kokaine-preview-loader::before { animation: none; }
      }
    </style>
    <script>${PREVIEW_STORAGE_SHIM_SOURCE}</script>
    <script crossorigin="anonymous" src="${htmlAttribute(options.chobitsuUrl)}"></script>
    <script>${boot}</script>
  </head>
  <body>
    <div id="kokaine-preview-loader" role="status">
      <span>Starting compiled Koka…</span>
    </div>
    <div id="app"></div>
  </body>
</html>`;
}

const DEVTOOLS_SETUP_SOURCE = String.raw`
(() => {
  const params = new URLSearchParams(location.hash.replace(/^#\??/, ''));
  const theme = params.get('kokaineTheme') === 'dark' ? 'dark' : 'default';
  const values = new Map([['uiTheme', JSON.stringify(theme)]]);
  const storage = {
    getItem: (key) => values.has(String(key)) ? values.get(String(key)) : null,
    setItem: (key, value) => values.set(String(key), String(value)),
    removeItem: (key) => values.delete(String(key)),
    clear: () => values.clear(),
    key: (index) => Array.from(values.keys())[index] || null,
    get length() { return values.size; },
  };
  try {
    Object.defineProperty(window, 'localStorage', { configurable: true, value: storage });
    Object.defineProperty(window, 'sessionStorage', { configurable: true, value: storage });
  } catch {
    try { localStorage.setItem('uiTheme', JSON.stringify(theme)); } catch {}
  }
})();
`;

export function buildDevtoolsDocument(assets: DevtoolsDocumentAssets = {}): string {
  const customElementsUrl = assets.customElementsUrl ?? '/devtools/custom-elements.js';
  const chiiUrl = assets.chiiUrl ?? '/devtools/chii/entrypoints/chii_app/chii_app.js';
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="referrer" content="no-referrer" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Kokaine DevTools</title>
    <style>
      html, body { width: 100%; height: 100%; margin: 0; }
      body { background: #f3f3f3; }
      @media (prefers-color-scheme: dark) { body { background: rgb(41 42 45); } }
    </style>
    <script>${DEVTOOLS_SETUP_SOURCE}</script>
    <script crossorigin="anonymous" src="${htmlAttribute(customElementsUrl)}"></script>
    <script crossorigin="anonymous" type="module" src="${htmlAttribute(chiiUrl)}"></script>
  </head>
  <body class="undocked" id="-blink-dev-tools"></body>
</html>`;
}
