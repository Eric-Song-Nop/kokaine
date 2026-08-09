import '@fontsource-variable/ibm-plex-sans';
import '@fontsource-variable/jetbrains-mono';
import '../styles.css';
import '../preview/preview.css';

import { DEFAULT_SOURCE, SPLIT_KEY } from '../defaults';
import { createKokaEditorController } from '../editor/controller';
import type { KokaEditorController } from '../editor/controller';
import {
  loadInitialSource,
  loadTheme,
  makeShareUrl,
  persistSource,
  persistTheme,
  resetSource,
} from '../lib/persistence';
import { createPreviewController } from '../preview/controller';
import type {
  PreviewController,
  PreviewModuleBundle,
  PreviewRuntimeError,
  PreviewRuntimeLog,
} from '../preview/controller';
import type { CompileResult, GeneratedModule, RuntimeLog } from '../types';
import { DEFAULT_PRECOMPILED_BASE_URL } from '../wasm/assets';
import { createBrowserCompiler } from '../wasm/runtime';
import type { BrowserCompiler } from '../wasm/runtime';

const DOCUMENT_URI = 'file:///main.kk';
const DEFAULT_EDITOR_WIDTH = Math.round(window.innerWidth * 0.54);
const initialSource = loadInitialSource().source;
const initialTheme = loadTheme();

let source = initialSource;
let dark = initialTheme === 'dark';
let buildStatus: 'idle' | 'compiling' | 'success' | 'error' = 'idle';
let compiler: BrowserCompiler | undefined;
let editor: KokaEditorController | undefined;
let preview: PreviewController | undefined;
let previewBundle: PreviewModuleBundle | undefined;
let compileResult: CompileResult | undefined;
let compileController: AbortController | undefined;
let revision = 0;
let runtimeLogId = 0;
let runtimeLogs: RuntimeLog[] = [];
let devtoolsVisible = false;
let hostStarted = false;
let toastTimer: number | undefined;
const disposers: Array<() => void> = [];

function moduleFilename(moduleName: string): string {
  let result = '';
  for (const character of moduleName) {
    if (/[A-Za-z0-9]/.test(character)) result += character;
    else if (character === '/') result += '_';
    else if (character === '-') result += '_dash_';
    else if (character === '_') result += '__';
    else if (character === '.') result += '_dot_';
    else result += character;
  }
  return result;
}

function basename(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1);
}

function selectGeneratedOutput(
  moduleName: string,
  generatedModules: ReadonlyMap<string, string>,
): { entryPath: string | null; generatedFile: string | null; generatedSource: string; modules: GeneratedModule[] } {
  const modules = Array.from(generatedModules, ([path, generatedSource]) => ({
    path,
    source: generatedSource,
  }));
  const encoded = moduleFilename(moduleName);
  const findModule = (filename: string) => (
    modules.find((module) => basename(module.path) === filename)
  );
  const entry = findModule(`${encoded}__main.mjs`)
    ?? modules.find((module) => basename(module.path).endsWith('__main.mjs'))
    ?? findModule(`${encoded}.mjs`)
    ?? null;
  const generated = findModule(`${encoded}.mjs`) ?? entry ?? modules[0] ?? null;
  return {
    entryPath: entry?.path ?? null,
    generatedFile: generated?.path ?? null,
    generatedSource: generated?.source ?? '',
    modules,
  };
}

function printable(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value instanceof Error) return value.stack || `${value.name}: ${value.message}`;
  if (typeof value === 'undefined') return 'undefined';
  if (typeof value === 'bigint') return `${value}n`;
  if (typeof value === 'symbol' || typeof value === 'function') return String(value);

  const seen = new WeakSet<object>();
  try {
    const encoded = JSON.stringify(value, (_key, item: unknown) => {
      if (typeof item === 'bigint') return `${item}n`;
      if (item && typeof item === 'object') {
        if (seen.has(item)) return '[Circular]';
        seen.add(item);
      }
      return item;
    });
    return encoded ?? String(value);
  } catch {
    return String(value);
  }
}

function dispatch(name: string, detail: Record<string, unknown> = {}): void {
  document.querySelector('#playground-root')?.dispatchEvent(new CustomEvent(name, { detail }));
}

function showToast(message: string): void {
  dispatch('playground-toast', { message });
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => dispatch('playground-toast', { message: '' }), 2200);
}

function buildText(result: CompileResult): string {
  return [
    result.stdout.trim(),
    result.stderr.trim(),
    result.error?.trim() ?? '',
  ].filter(Boolean).join('\n\n');
}

function dispatchBuild(result: CompileResult, builtSource: string): void {
  dispatch('playground-build', {
    status: result.ok ? 'success' : 'error',
    label: `${result.ok ? 'Built' : 'Failed'} in ${(result.durationMs / 1000).toFixed(1)}s`,
    generated: result.generatedSource,
    build: buildText(result),
    generatedFile: result.generatedFile ?? '',
    usedLastGood: result.usedLastGood,
    ok: result.ok,
    builtSource: result.ok ? builtSource : '',
  });
}

async function runWithCompiler(activeCompiler: BrowserCompiler): Promise<void> {
  if (buildStatus === 'compiling') return;
  const builtSource = source;
  const activeRevision = ++revision;
  compileController?.abort();
  compileController = new AbortController();
  buildStatus = 'compiling';
  dispatch('playground-build', {
    status: 'compiling',
    label: '',
    generated: compileResult?.generatedSource ?? '',
    build: compileResult ? buildText(compileResult) : '',
    generatedFile: compileResult?.generatedFile ?? '',
    usedLastGood: false,
    ok: false,
    builtSource: '',
  });

  try {
    const compiled = await activeCompiler.compile({
      entryModule: 'main',
      files: { 'main.kk': builtSource },
      signal: compileController.signal,
    });
    const generated = selectGeneratedOutput(compiled.moduleName, compiled.generatedModules);
    const missingEntry = compiled.ok && !generated.entryPath
      ? 'Koka compiled successfully but did not generate an executable entry module.'
      : undefined;
    const result: CompileResult = {
      ok: compiled.ok && !missingEntry,
      revision: activeRevision,
      durationMs: Math.round(compiled.durationMs),
      entryPath: generated.entryPath,
      modules: generated.modules,
      generatedSource: generated.generatedSource,
      generatedFile: generated.generatedFile,
      stdout: compiled.stdout,
      stderr: compiled.stderr,
      error: missingEntry ?? compiled.error,
      usedLastGood: !compiled.ok && Boolean(previewBundle),
    };
    compileResult = result;
    buildStatus = result.ok ? 'success' : 'error';

    if (result.ok && result.entryPath) {
      previewBundle = {
        entryPath: result.entryPath,
        modules: result.modules,
        precompiledBaseUrl: DEFAULT_PRECOMPILED_BASE_URL,
      };
      runtimeLogs = [];
      preview?.load(previewBundle, result.revision);
      dispatch('playground-runtime', { text: '', count: 0 });
    }
    dispatchBuild(result, builtSource);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return;
    const message = error instanceof Error ? error.message : String(error);
    const result: CompileResult = {
      ok: false,
      revision: activeRevision,
      durationMs: 0,
      entryPath: previewBundle?.entryPath ?? null,
      modules: compileResult?.modules ?? [],
      generatedSource: compileResult?.generatedSource ?? '',
      generatedFile: compileResult?.generatedFile ?? null,
      stdout: '',
      stderr: message,
      error: message,
      usedLastGood: Boolean(previewBundle),
    };
    compileResult = result;
    buildStatus = 'error';
    dispatchBuild(result, builtSource);
  }
}

function run(): void {
  if (!compiler) {
    showToast('The compiler session is still starting.');
    return;
  }
  void runWithCompiler(compiler);
}

function addRuntimeLog(
  level: RuntimeLog['level'],
  text: string,
  timestamp = Date.now(),
): void {
  runtimeLogs = [
    ...runtimeLogs.slice(-499),
    { id: ++runtimeLogId, level, text, timestamp },
  ];
  dispatch('playground-runtime', {
    text: runtimeLogs.map((line) => {
      const time = new Date(line.timestamp).toLocaleTimeString([], { hour12: false });
      return `${time} ${line.level.padEnd(5)} ${line.text}`;
    }).join('\n'),
    count: runtimeLogs.length,
  });
}

function onPreviewLog(log: PreviewRuntimeLog): void {
  addRuntimeLog(log.level, log.args.map(printable).join(' '), log.timestamp);
}

function onPreviewError(error: PreviewRuntimeError): void {
  const location = error.source
    ? `\n${error.source}${error.line ? `:${error.line}:${error.column ?? 0}` : ''}`
    : '';
  addRuntimeLog(
    'error',
    `${error.name}: ${error.message}${location}${error.stack ? `\n${error.stack}` : ''}`,
    error.timestamp,
  );
}

function requireElement<T extends Element>(selector: string, constructor: { new(): T }): T {
  const value = document.querySelector(selector);
  if (!(value instanceof constructor)) throw new Error(`Missing playground host element: ${selector}`);
  return value;
}

interface ResizerOptions {
  element: HTMLElement;
  orientation: 'horizontal' | 'vertical';
  value: () => number;
  min: () => number;
  max: () => number;
  update: (value: number) => void;
  reset: () => void;
  step?: number;
  inverted?: boolean;
}

function installResizer(options: ResizerOptions): () => void {
  let activePointer: number | undefined;
  let startCoordinate = 0;
  let startValue = 0;
  const coordinate = (event: PointerEvent) => (
    options.orientation === 'horizontal' ? event.clientY : event.clientX
  );
  const update = (value: number) => {
    const step = options.step ?? 1;
    const stepped = Math.round(value / step) * step;
    options.update(Math.min(options.max(), Math.max(options.min(), stepped)));
  };
  const finish = (event: PointerEvent) => {
    if (activePointer !== event.pointerId) return;
    activePointer = undefined;
    options.element.classList.remove('is-dragging');
    if (options.element.hasPointerCapture(event.pointerId)) {
      options.element.releasePointerCapture(event.pointerId);
    }
  };
  const pointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    activePointer = event.pointerId;
    startCoordinate = coordinate(event);
    startValue = options.value();
    options.element.setPointerCapture(event.pointerId);
    options.element.classList.add('is-dragging');
    event.preventDefault();
  };
  const pointerMove = (event: PointerEvent) => {
    if (activePointer !== event.pointerId) return;
    const delta = coordinate(event) - startCoordinate;
    update(startValue + (options.inverted ? -delta : delta));
  };
  const keyDown = (event: KeyboardEvent) => {
    const vertical = options.orientation === 'vertical';
    const backward = vertical ? event.key === 'ArrowLeft' : event.key === 'ArrowUp';
    const forward = vertical ? event.key === 'ArrowRight' : event.key === 'ArrowDown';
    if (!backward && !forward && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    if (event.key === 'Home') update(options.min());
    else if (event.key === 'End') update(options.max());
    else {
      const direction = backward ? -1 : 1;
      update(options.value() + direction * (event.shiftKey ? 50 : options.step ?? 10));
    }
  };
  const doubleClick = () => options.reset();

  options.element.addEventListener('pointerdown', pointerDown);
  options.element.addEventListener('pointermove', pointerMove);
  options.element.addEventListener('pointerup', finish);
  options.element.addEventListener('pointercancel', finish);
  options.element.addEventListener('lostpointercapture', finish);
  options.element.addEventListener('keydown', keyDown);
  options.element.addEventListener('dblclick', doubleClick);

  return () => {
    options.element.removeEventListener('pointerdown', pointerDown);
    options.element.removeEventListener('pointermove', pointerMove);
    options.element.removeEventListener('pointerup', finish);
    options.element.removeEventListener('pointercancel', finish);
    options.element.removeEventListener('lostpointercapture', finish);
    options.element.removeEventListener('keydown', keyDown);
    options.element.removeEventListener('dblclick', doubleClick);
  };
}

async function startCompiler(): Promise<void> {
  try {
    compiler = await createBrowserCompiler();
    dispatch('playground-session', {
      compilerVersion: compiler.compilerVersion.replace(/^Koka\s*/i, ''),
      error: '',
    });
    await runWithCompiler(compiler);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    buildStatus = 'error';
    dispatch('playground-session', { compilerVersion: '', error: message });
    dispatch('playground-lsp', { status: 'offline' });
    dispatch('playground-build', {
      status: 'error',
      label: 'Failed to start',
      generated: '',
      build: message,
      generatedFile: '',
      usedLastGood: false,
      ok: false,
      builtSource: '',
    });
    showToast(`Could not start playground: ${message}`);
  }
}

async function startHost(): Promise<void> {
  if (hostStarted) return;
  hostStarted = true;

  const root = requireElement('#playground-root', HTMLElement);
  const workbench = requireElement('#playground-workbench', HTMLElement);
  const editorContainer = requireElement('#playground-editor', HTMLElement);
  const editorResizer = requireElement('#playground-editor-resizer', HTMLElement);
  const previewRoot = requireElement('#playground-preview-root', HTMLElement);
  const previewFrame = requireElement('#playground-preview-frame', HTMLIFrameElement);
  const previewDevice = requireElement('#playground-preview-device', HTMLElement);
  const devtoolsFrame = requireElement('#playground-devtools-frame', HTMLIFrameElement);
  const devtoolsPane = devtoolsFrame.closest('.kokaine-devtools-pane');
  const devtoolsResizer = requireElement('#playground-devtools-resizer', HTMLElement);
  if (!(devtoolsPane instanceof HTMLElement)) throw new Error('Missing DevTools pane');

  let editorWidth = Number(window.localStorage.getItem(SPLIT_KEY));
  if (!Number.isFinite(editorWidth) || editorWidth < 300) editorWidth = DEFAULT_EDITOR_WIDTH;
  let workbenchWidth = workbench.getBoundingClientRect().width;
  const updateEditorWidth = (value: number) => {
    editorWidth = value;
    root.style.setProperty('--editor-width', `${value}px`);
    editorResizer.setAttribute('aria-valuenow', String(Math.round(value)));
    editorResizer.setAttribute('aria-valuemax', String(Math.round(Math.max(300, workbenchWidth - 307))));
    window.localStorage.setItem(SPLIT_KEY, String(value));
  };
  updateEditorWidth(Math.min(editorWidth, Math.max(300, workbenchWidth - 307)));
  disposers.push(installResizer({
    element: editorResizer,
    orientation: 'vertical',
    value: () => editorWidth,
    min: () => 300,
    max: () => Math.max(300, workbenchWidth - 307),
    update: updateEditorWidth,
    reset: () => updateEditorWidth(Math.round(workbenchWidth * 0.54)),
    step: 10,
  }));

  const resizeObserver = new ResizeObserver(([entry]) => {
    if (!entry) return;
    workbenchWidth = entry.contentRect.width;
    updateEditorWidth(Math.min(Math.max(300, editorWidth), Math.max(300, workbenchWidth - 307)));
  });
  resizeObserver.observe(workbench);
  disposers.push(() => resizeObserver.disconnect());

  let devtoolsHeight = 310;
  const updateDevtoolsHeight = (value: number) => {
    devtoolsHeight = value;
    devtoolsPane.style.height = `${value}px`;
    devtoolsResizer.setAttribute('aria-valuenow', String(Math.round(value)));
  };
  disposers.push(installResizer({
    element: devtoolsResizer,
    orientation: 'horizontal',
    value: () => devtoolsHeight,
    min: () => 150,
    max: () => 720,
    update: updateDevtoolsHeight,
    reset: () => updateDevtoolsHeight(310),
    step: 10,
    inverted: true,
  }));

  preview = createPreviewController({
    root: previewRoot,
    frame: previewFrame,
    device: previewDevice,
    devtoolsFrame,
    dark,
    onRuntimeLog: onPreviewLog,
    onRuntimeError: onPreviewError,
  });
  preview.setDevtoolsVisible(devtoolsVisible);

  const editorPromise = createKokaEditorController({
    container: editorContainer,
    activePath: 'main.kk',
    files: { 'main.kk': source },
    theme: dark ? 'dark' : 'light',
    onChange: (_path, value) => {
      source = value;
      persistSource(source);
      dispatch('playground-source', { source });
    },
    onRun: run,
    onStatus: (status) => dispatch('playground-lsp', { status }),
    onProblemCount: (count) => dispatch('playground-problems', { count }),
    onCursor: (line, column) => dispatch('playground-cursor', { line, column }),
    onLspLog: (message) => console.info(message),
  });
  const compilerPromise = startCompiler();

  try {
    editor = await editorPromise;
    editor.focus();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    editorContainer.textContent = `Editor failed to load: ${message}`;
    dispatch('playground-lsp', { status: 'error' });
    showToast(`Could not start editor: ${message}`);
  }
  await compilerPromise;
}

interface KokainePlaygroundHost {
  initialSource(): string;
  initialDark(): boolean;
  start(): void;
  run(): void;
  share(): void;
  reset(): void;
  setTheme(dark: boolean): void;
  setDevtools(visible: boolean): void;
  reloadPreview(): void;
  setDeviceWidth(value: string): void;
  copyOutput(value: string): void;
}

const host: KokainePlaygroundHost = {
  initialSource: () => initialSource,
  initialDark: () => initialTheme === 'dark',
  start() {
    queueMicrotask(() => {
      void startHost().catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        const app = document.querySelector('#app');
        if (app) app.textContent = `Playground failed to start: ${message}`;
      });
    });
  },
  run,
  share() {
    const url = makeShareUrl(source);
    void navigator.clipboard.writeText(url).then(() => {
      window.history.replaceState(null, '', url);
      showToast('Share link copied');
    }).catch(() => {
      window.location.hash = new URL(url).hash;
      showToast('Share link added to the address bar');
    });
  },
  reset() {
    if (source !== DEFAULT_SOURCE && !window.confirm('Reset main.kk to the starter example?')) return;
    resetSource();
    source = DEFAULT_SOURCE;
    persistSource(source);
    editor?.setValue(source);
    dispatch('playground-source', { source });
    showToast('Starter restored');
  },
  setTheme(nextDark) {
    dark = nextDark;
    persistTheme(dark ? 'dark' : 'light');
    editor?.setTheme(dark ? 'dark' : 'light');
    preview?.setTheme(dark);
  },
  setDevtools(visible) {
    devtoolsVisible = visible;
    preview?.setDevtoolsVisible(visible);
  },
  reloadPreview() {
    preview?.reload();
  },
  setDeviceWidth(value) {
    const width = value === 'responsive' ? 'responsive' : Number(value);
    if (width !== 'responsive' && !Number.isFinite(width)) return;
    preview?.setDeviceWidth(width);
  },
  copyOutput(value) {
    void navigator.clipboard.writeText(value).then(
      () => showToast('Output copied'),
      () => showToast('Could not copy output'),
    );
  },
};

const hostGlobal = globalThis as typeof globalThis & {
  __kokainePlaygroundHost: KokainePlaygroundHost;
};
hostGlobal.__kokainePlaygroundHost = host;

window.addEventListener('pagehide', () => {
  compileController?.abort();
  compiler?.dispose();
  editor?.dispose();
  preview?.dispose();
  if (toastTimer) window.clearTimeout(toastTimer);
  for (const dispose of disposers.splice(0)) dispose();
}, { once: true });

void import('../generated/koka/entry.mjs').catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  const app = document.querySelector('#app');
  if (app) app.textContent = `Could not load the Kokaine workbench: ${message}`;
});
