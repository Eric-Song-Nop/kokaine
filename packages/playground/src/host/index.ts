import '@fontsource-variable/ibm-plex-sans';
import '@fontsource-variable/jetbrains-mono';
import '../styles.css';
import '../preview/preview.css';

import { SPLIT_KEY } from '../defaults';
import { createKokaEditorController } from '../editor/controller';
import type { KokaEditorController } from '../editor/controller';
import { loadTheme, persistTheme } from '../lib/persistence';
import {
  DEFAULT_PROJECT,
  ProjectFS,
  moduleNameFromPath,
  modulePath,
  type ProjectSnapshot,
} from '../project/project-fs';
import {
  decodeProjectHash,
  makeProjectShareUrl,
} from '../project/project-share';
import { createPreviewController } from '../preview/controller';
import type {
  PreviewController,
  PreviewModuleBundle,
  PreviewRuntimeError,
  PreviewRuntimeLog,
} from '../preview/controller';
import {
  createBrowserRepl,
  createReplSandbox,
  type BrowserRepl,
  type BrowserReplResult,
  type ReplSandbox,
} from '../repl';
import type { CompileResult, GeneratedModule, RuntimeLog } from '../types';
import { DEFAULT_PRECOMPILED_BASE_URL } from '../wasm/assets';
import { createBrowserCompiler } from '../wasm/runtime';
import type { BrowserCompiler } from '../wasm/runtime';

interface ProjectEntry {
  readonly path: string;
  readonly label: string;
  readonly kind: 'directory' | 'file';
  readonly depth: number;
}

const DEFAULT_EDITOR_WIDTH = Math.round(window.innerWidth * 0.43);
const PROJECT_WRITE_DELAY_MS = 240;
const MAX_CONSOLE_ENTRIES = 500;
const initialTheme = loadTheme();

let dark = initialTheme === 'dark';
let projectFs: ProjectFS | undefined;
let project: ProjectSnapshot = DEFAULT_PROJECT;
let projectEntries: ProjectEntry[] = [];
let activePath = modulePath(DEFAULT_PROJECT.entryModule);
let selectedPath = activePath;
let openTabs = [activePath];
let pendingWrites = new Map<string, string>();
let writeTimer: number | undefined;
let flushPromise: Promise<void> | undefined;
let sharedProjectLoaded = false;
let compiler: BrowserCompiler | undefined;
let editor: KokaEditorController | undefined;
let preview: PreviewController | undefined;
let repl: BrowserRepl | undefined;
let replSandbox: ReplSandbox | undefined;
let replLoadedRevision: number | undefined;
let replBusy = false;
let previewBundle: PreviewModuleBundle | undefined;
let compileResult: CompileResult | undefined;
let compileController: AbortController | undefined;
let buildStatus: 'idle' | 'compiling' | 'success' | 'error' = 'idle';
let revision = 0;
let runtimeLogId = 0;
let runtimeLogs: RuntimeLog[] = [];
let consoleEntries: string[] = [];
let replHistoryEntries: string[] = [];
let replHistoryIndex = 0;
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
): {
  entryPath: string | null;
  generatedFile: string | null;
  generatedSource: string;
  modules: GeneratedModule[];
} {
  const modules = Array.from(generatedModules, ([path, generatedSource]) => ({
    path,
    source: generatedSource,
  }));
  const encoded = moduleFilename(moduleName);
  const findModule = (filename: string) => modules.find((module) => basename(module.path) === filename);
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
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => dispatch('playground-toast', { message: '' }), 2400);
}

function rebuildProjectEntries(): void {
  projectEntries = [
    ...project.directories.map((path): ProjectEntry => ({
      path,
      label: basename(path),
      kind: 'directory',
      depth: path.split('/').length - 1,
    })),
    ...Object.keys(project.files).map((path): ProjectEntry => ({
      path,
      label: basename(path),
      kind: 'file',
      depth: path.split('/').length - 1,
    })),
  ].sort((left, right) => {
    const byPath = left.path.localeCompare(right.path);
    if (byPath !== 0) return byPath;
    return left.kind === 'directory' ? -1 : 1;
  });
}

function dispatchProject(): void {
  rebuildProjectEntries();
  dispatch('playground-project', {
    fileCount: projectEntries.length,
    tabCount: openTabs.length,
    activePath,
    selectedPath,
    entryModule: project.entryModule,
    revision: project.revision,
    dirty: pendingWrites.has(activePath),
  });
}

function dispatchRepl(status: 'starting' | 'ready' | 'busy' | 'error', label: string): void {
  dispatch('playground-repl', { status, label });
}

function dispatchConsole(): void {
  dispatch('playground-console', {
    text: consoleEntries.join('\n'),
    count: consoleEntries.length,
  });
  queueMicrotask(() => {
    const output = document.querySelector('#playground-console-output');
    if (output instanceof HTMLElement) output.scrollTop = output.scrollHeight;
  });
}

function appendConsole(text: string): void {
  const normalized = text.replaceAll('\r\n', '\n').trimEnd();
  if (!normalized) return;
  consoleEntries = [...consoleEntries.slice(-(MAX_CONSOLE_ENTRIES - 1)), normalized];
  dispatchConsole();
}

function appendReplInput(line: string): void {
  const lines = line.replaceAll('\r\n', '\n').split('\n');
  appendConsole(lines.map((value, index) => `${index === 0 ? '›' : '·'} ${value}`).join('\n'));
}

function clearConsole(): void {
  consoleEntries = [];
  dispatchConsole();
}

function addRuntimeLog(
  level: RuntimeLog['level'],
  text: string,
  timestamp = Date.now(),
  source = 'preview',
): void {
  runtimeLogs = [
    ...runtimeLogs.slice(-499),
    { id: ++runtimeLogId, level, text, timestamp },
  ];
  appendConsole(`[${source}:${level}] ${text}`);
}

function onPreviewLog(log: PreviewRuntimeLog): void {
  addRuntimeLog(log.level, log.args.map(printable).join(' '), log.timestamp, 'preview');
}

function onPreviewError(error: PreviewRuntimeError): void {
  const location = error.source
    ? `\n${error.source}${error.line ? `:${error.line}:${error.column ?? 0}` : ''}`
    : '';
  addRuntimeLog(
    'error',
    `${error.name}: ${error.message}${location}${error.stack ? `\n${error.stack}` : ''}`,
    error.timestamp,
    'preview',
  );
}

function onReplLog(log: PreviewRuntimeLog): void {
  addRuntimeLog(log.level, log.args.map(printable).join(' '), log.timestamp, 'repl');
}

function onReplError(error: PreviewRuntimeError): void {
  addRuntimeLog(
    'error',
    `${error.name}: ${error.message}${error.stack ? `\n${error.stack}` : ''}`,
    error.timestamp,
    'repl',
  );
}

function visibleReplCompilerLine(value: string): string | undefined {
  const line = value.trim();
  if (
    line === ''
    || /^warning: cannot find the C compiler\b/.test(line)
    || /^\/share\/lib\/.*:\s*warning:/.test(line)
    || /^(?:generate javascript|generate index html|load\s*:|created\s*:)/.test(line)
    || /^\^+$/.test(line)
  ) {
    return undefined;
  }
  return line;
}

function clearShareFragment(): void {
  if (!sharedProjectLoaded && !window.location.hash.startsWith('#project=')) return;
  sharedProjectLoaded = false;
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
}

function queueProjectWrite(path: string, content: string): void {
  pendingWrites.set(path, content);
  clearShareFragment();
  clearTimeout(writeTimer);
  writeTimer = window.setTimeout(() => {
    void flushProjectWrites().catch(reportHostError);
  }, PROJECT_WRITE_DELAY_MS);
  dispatchProject();
}

async function flushProjectWrites(): Promise<void> {
  clearTimeout(writeTimer);
  if (flushPromise) {
    await flushPromise;
    if (pendingWrites.size > 0) await flushProjectWrites();
    return;
  }
  const activeFs = projectFs;
  if (!activeFs || pendingWrites.size === 0) return;

  flushPromise = (async () => {
    while (pendingWrites.size > 0) {
      const next = pendingWrites.entries().next().value as [string, string] | undefined;
      if (!next) break;
      const [path, content] = next;
      await activeFs.writeFile(path, content);
      if (pendingWrites.get(path) === content) pendingWrites.delete(path);
      project = activeFs.snapshot();
    }
  })();
  try {
    await flushPromise;
  } finally {
    flushPromise = undefined;
    dispatchProject();
  }
}

function buildText(result: CompileResult): string {
  return [result.stdout.trim(), result.stderr.trim(), result.error?.trim() ?? '']
    .filter(Boolean)
    .join('\n\n');
}

function dispatchBuild(result: CompileResult): void {
  dispatch('playground-build', {
    status: result.ok ? 'success' : 'error',
    label: `${result.ok ? 'Built' : 'Failed'} in ${(result.durationMs / 1000).toFixed(1)}s`,
    generated: result.generatedSource,
    build: buildText(result),
    generatedFile: result.generatedFile ?? '',
    ok: result.ok,
  });
}

async function runWithCompiler(activeCompiler: BrowserCompiler): Promise<void> {
  if (buildStatus === 'compiling') return;
  await flushProjectWrites();
  const builtProject = projectFs?.snapshot();
  if (!builtProject) throw new Error('The project filesystem is not ready');
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
    ok: false,
  });

  try {
    const compiled = await activeCompiler.compile({
      entryModule: builtProject.entryModule,
      files: builtProject.files,
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
      preview?.load(previewBundle, result.revision);
    }
    dispatchBuild(result);
    appendConsole(
      result.ok
        ? `[build] ${builtProject.entryModule} compiled in ${(result.durationMs / 1000).toFixed(1)}s`
        : `[build:error] ${result.error ?? 'Compilation failed'}`,
    );
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return;
    const message = errorMessage(error);
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
    dispatchBuild(result);
    appendConsole(`[build:error] ${message}`);
  }
}

function runProject(): void {
  if (!compiler) {
    showToast('The compiler session is still starting.');
    return;
  }
  void runWithCompiler(compiler).catch(reportHostError);
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
    const message = errorMessage(error);
    buildStatus = 'error';
    dispatch('playground-session', { compilerVersion: '', error: message });
    dispatch('playground-build', {
      status: 'error',
      label: 'Compiler failed',
      generated: '',
      build: message,
      generatedFile: '',
      ok: false,
    });
    appendConsole(`[compiler:error] ${message}`);
    showToast(`Could not start compiler: ${message}`);
  }
}

function appendReplResponse(result: BrowserReplResult): void {
  const { response } = result;
  if (!response.success) {
    appendConsole(`[repl:error] ${response.error ?? 'The request failed'}`);
    return;
  }
  if (!response.output) return;
  if (response.kind === 'value' || response.kind === 'type') {
    appendConsole(`: ${response.output}`);
  } else {
    appendConsole(`[repl] ${response.output}`);
  }
}

async function loadProjectIntoRepl(activeRepl: BrowserRepl): Promise<void> {
  await flushProjectWrites();
  const current = projectFs?.snapshot();
  if (!current) throw new Error('The project filesystem is not ready');
  if (replLoadedRevision === current.revision) return;
  const result = await activeRepl.reload(current);
  appendReplResponse(result);
  if (!result.response.success) {
    throw new Error(result.response.error ?? 'The REPL rejected the project');
  }
  replLoadedRevision = current.revision;
}

async function executeReplResult(result: BrowserReplResult): Promise<void> {
  appendReplResponse(result);
  if (!result.response.success || !result.response.entryPath) return;
  if (result.generatedModules.size === 0) {
    throw new Error('The REPL generated an entry module without JavaScript output');
  }
  await replSandbox?.run({
    entryPath: result.response.entryPath,
    modules: Array.from(result.generatedModules, ([path, source]) => ({ path, source })),
    precompiledBaseUrl: DEFAULT_PRECOMPILED_BASE_URL,
  }, `repl-${result.response.id}`);
}

async function startRepl(): Promise<void> {
  dispatchRepl('starting', 'Starting REPL');
  try {
    repl = await createBrowserRepl({
      onLog(log) {
        if (log.stream !== 'stderr') return;
        const line = visibleReplCompilerLine(log.text);
        if (line) appendConsole(`[repl:compiler] ${line}`);
      },
    });
    const current = projectFs?.snapshot();
    if (!current) throw new Error('The project filesystem is not ready');
    const opened = await repl.open(current);
    replLoadedRevision = opened.response.success ? current.revision : undefined;
    appendReplResponse(opened);
    dispatchRepl('ready', 'REPL ready');
  } catch (error) {
    const message = errorMessage(error);
    dispatchRepl('error', 'REPL unavailable');
    appendConsole(`[repl:error] ${message}`);
  }
}

function submitRepl(line: string): void {
  const trimmed = line.trim();
  if (!trimmed || replBusy) return;
  if (!repl) {
    showToast('The REPL session is still starting.');
    return;
  }
  replHistoryEntries = [
    ...replHistoryEntries.filter((entry) => entry !== line),
    line,
  ].slice(-100);
  replHistoryIndex = replHistoryEntries.length;
  appendReplInput(line);
  replBusy = true;
  dispatchRepl('busy', 'REPL running');
  const activeRepl = repl;

  void (async () => {
    try {
      await loadProjectIntoRepl(activeRepl);
      const result = await activeRepl.submit(line);
      await executeReplResult(result);
      dispatchRepl('ready', `REPL ${(result.durationMs / 1000).toFixed(1)}s`);
    } catch (error) {
      if (!(error instanceof Error && error.name === 'AbortError')) {
        appendConsole(`[repl:error] ${errorMessage(error)}`);
        dispatchRepl('error', 'REPL error');
      }
    } finally {
      replBusy = false;
      if (repl) window.setTimeout(() => dispatchRepl('ready', 'REPL ready'), 900);
    }
  })();
}

function replHistory(delta: number): string {
  if (replHistoryEntries.length === 0) return '';
  replHistoryIndex = Math.max(0, Math.min(
    replHistoryEntries.length,
    replHistoryIndex + Math.sign(delta),
  ));
  return replHistoryIndex === replHistoryEntries.length
    ? ''
    : replHistoryEntries[replHistoryIndex] ?? '';
}

function resetRepl(): void {
  if (!repl || replBusy) return;
  replBusy = true;
  dispatchRepl('busy', 'Resetting REPL');
  clearConsole();
  void repl.reset().then((result) => {
    if (!result.response.success) {
      throw new Error(result.response.error ?? 'The Koka browser REPL could not reset');
    }
    replLoadedRevision = projectFs?.snapshot().revision;
    appendReplResponse(result);
    dispatchRepl('ready', 'REPL reset');
  }).catch((error: unknown) => {
    appendConsole(`[repl:error] ${errorMessage(error)}`);
    dispatchRepl('error', 'REPL reset failed');
  }).finally(() => {
    replBusy = false;
  });
}

async function openProjectEntry(index: number): Promise<void> {
  const entry = projectEntries[index];
  if (!entry) return;
  selectedPath = entry.path;
  if (entry.kind === 'file') {
    activePath = entry.path;
    if (!openTabs.includes(activePath)) openTabs = [...openTabs, activePath];
    editor?.openFile(activePath);
    editor?.focus();
  }
  dispatchProject();
}

function openTab(index: number): void {
  const path = openTabs[index];
  if (!path || project.files[path] === undefined) return;
  activePath = path;
  selectedPath = path;
  editor?.openFile(path);
  editor?.focus();
  dispatchProject();
}

function closeTab(index: number): void {
  const path = openTabs[index];
  if (!path || openTabs.length === 1) return;
  const wasActive = path === activePath;
  openTabs = openTabs.filter((candidate) => candidate !== path);
  if (wasActive) {
    activePath = openTabs[Math.min(index, openTabs.length - 1)] ?? modulePath(project.entryModule);
    selectedPath = activePath;
    editor?.openFile(activePath);
  }
  dispatchProject();
}

async function reconcileProject(next: ProjectSnapshot, requestedActivePath?: string): Promise<void> {
  project = next;
  const entryPath = modulePath(project.entryModule);
  activePath = requestedActivePath && project.files[requestedActivePath] !== undefined
    ? requestedActivePath
    : project.files[activePath] !== undefined ? activePath : entryPath;
  selectedPath = project.files[selectedPath] !== undefined || project.directories.includes(selectedPath)
    ? selectedPath
    : activePath;
  openTabs = openTabs.filter((path) => project.files[path] !== undefined);
  if (!openTabs.includes(activePath)) openTabs = [...openTabs, activePath];
  await editor?.setProject(project.files, activePath);
  replLoadedRevision = undefined;
  dispatchProject();
}

async function createFile(): Promise<void> {
  const activeFs = projectFs;
  if (!activeFs) return;
  const supplied = window.prompt('New Koka file path', 'module.kk')?.trim();
  if (!supplied) return;
  try {
    await flushProjectWrites();
    const moduleName = moduleNameFromPath(supplied);
    const next = await activeFs.createFile(supplied, `module ${moduleName}\n`);
    clearShareFragment();
    selectedPath = supplied;
    openTabs = [...openTabs.filter((path) => path !== supplied), supplied];
    await reconcileProject(next, supplied);
    showToast(`Created ${supplied}`);
  } catch (error) {
    reportHostError(error);
  }
}

async function createDirectory(): Promise<void> {
  const activeFs = projectFs;
  if (!activeFs) return;
  const supplied = window.prompt('New project folder', 'lib')?.trim();
  if (!supplied) return;
  try {
    await flushProjectWrites();
    const next = await activeFs.createDirectory(supplied);
    clearShareFragment();
    project = next;
    selectedPath = supplied;
    dispatchProject();
    showToast(`Created ${supplied}`);
  } catch (error) {
    reportHostError(error);
  }
}

async function renameSelected(): Promise<void> {
  const activeFs = projectFs;
  if (!activeFs || !selectedPath) return;
  const source = selectedPath;
  const target = window.prompt('Rename project entry', source)?.trim();
  if (!target || target === source) return;
  try {
    await flushProjectWrites();
    const sourcePrefix = `${source}/`;
    const replacePrefix = (path: string) => path === source ? target : `${target}${path.slice(source.length)}`;
    const next = await activeFs.rename(source, target);
    clearShareFragment();
    pendingWrites = new Map(Array.from(pendingWrites, ([path, content]) => [
      path === source || path.startsWith(sourcePrefix) ? replacePrefix(path) : path,
      content,
    ]));
    openTabs = openTabs.map((path) => (
      path === source || path.startsWith(sourcePrefix) ? replacePrefix(path) : path
    ));
    if (activePath === source || activePath.startsWith(sourcePrefix)) activePath = replacePrefix(activePath);
    selectedPath = target;
    await reconcileProject(next, activePath);
    showToast(`Renamed to ${target}`);
  } catch (error) {
    reportHostError(error);
  }
}

async function deleteSelected(): Promise<void> {
  const activeFs = projectFs;
  if (!activeFs || !selectedPath) return;
  const source = selectedPath;
  const isDirectory = project.directories.includes(source);
  if (!window.confirm(`Delete ${source}${isDirectory ? ' and its contents' : ''}?`)) return;
  try {
    await flushProjectWrites();
    const next = await activeFs.remove(source, { recursive: isDirectory });
    clearShareFragment();
    const prefix = `${source}/`;
    openTabs = openTabs.filter((path) => path !== source && !path.startsWith(prefix));
    pendingWrites = new Map(Array.from(pendingWrites).filter(
      ([path]) => path !== source && !path.startsWith(prefix),
    ));
    selectedPath = modulePath(next.entryModule);
    await reconcileProject(next);
    showToast(`Deleted ${source}`);
  } catch (error) {
    reportHostError(error);
  }
}

async function setSelectedEntry(): Promise<void> {
  const activeFs = projectFs;
  if (!activeFs || project.files[selectedPath] === undefined) {
    showToast('Select a Koka file before setting the entry module.');
    return;
  }
  try {
    await flushProjectWrites();
    const next = await activeFs.setEntryModule(moduleNameFromPath(selectedPath));
    clearShareFragment();
    project = next;
    replLoadedRevision = undefined;
    dispatchProject();
    showToast(`${next.entryModule} is now the project entry`);
  } catch (error) {
    reportHostError(error);
  }
}

async function shareProject(): Promise<void> {
  try {
    await flushProjectWrites();
    const current = projectFs?.snapshot();
    if (!current) throw new Error('The project filesystem is not ready');
    const url = makeProjectShareUrl(current, window.location.href);
    await navigator.clipboard.writeText(url);
    window.history.replaceState(null, '', url);
    showToast('Project share link copied');
  } catch (error) {
    reportHostError(error);
  }
}

async function resetProject(): Promise<void> {
  const activeFs = projectFs;
  if (!activeFs || !window.confirm('Reset the complete project to the Kokaine starter?')) return;
  try {
    clearTimeout(writeTimer);
    pendingWrites.clear();
    const next = await activeFs.replace(DEFAULT_PROJECT);
    clearShareFragment();
    openTabs = [modulePath(next.entryModule)];
    activePath = openTabs[0] as string;
    selectedPath = activePath;
    await reconcileProject(next, activePath);
    clearConsole();
    if (repl) {
      const loaded = await repl.reload(next);
      replLoadedRevision = loaded.response.success ? next.revision : undefined;
      appendReplResponse(loaded);
    }
    showToast('Starter project restored');
    runProject();
  } catch (error) {
    reportHostError(error);
  }
}

function requireElement<T extends Element>(selector: string, constructor: { new(): T }): T {
  const value = document.querySelector(selector);
  if (!(value instanceof constructor)) throw new Error(`Missing playground host element: ${selector}`);
  return value;
}

interface ResizerOptions {
  readonly element: HTMLElement;
  readonly orientation: 'horizontal' | 'vertical';
  readonly value: () => number;
  readonly min: () => number;
  readonly max: () => number;
  readonly update: (value: number) => void;
  readonly reset: () => void;
  readonly step?: number;
  readonly inverted?: boolean;
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
    else update(options.value() + (backward ? -1 : 1) * (event.shiftKey ? 50 : options.step ?? 10));
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

async function openInitialProject(): Promise<void> {
  projectFs = await ProjectFS.open();
  try {
    const shared = decodeProjectHash(window.location.hash);
    if (shared) {
      project = await projectFs.replace(shared);
      sharedProjectLoaded = true;
    } else {
      project = projectFs.snapshot();
    }
  } catch (error) {
    project = projectFs.snapshot();
    showToast(`Could not open shared project: ${errorMessage(error)}`);
  }
  activePath = modulePath(project.entryModule);
  selectedPath = activePath;
  openTabs = [activePath];
  dispatchProject();
}

async function startHost(): Promise<void> {
  if (hostStarted) return;
  hostStarted = true;
  await openInitialProject();

  const root = requireElement('#playground-root', HTMLElement);
  const workbench = requireElement('#playground-workbench', HTMLElement);
  const projectPanel = requireElement('.project-panel', HTMLElement);
  const editorContainer = requireElement('#playground-editor', HTMLElement);
  const editorResizer = requireElement('#playground-editor-resizer', HTMLElement);
  const previewRoot = requireElement('#playground-preview-root', HTMLElement);
  const previewFrame = requireElement('#playground-preview-frame', HTMLIFrameElement);
  const previewDevice = requireElement('#playground-preview-device', HTMLElement);
  const devtoolsFrame = requireElement('#playground-devtools-frame', HTMLIFrameElement);
  const devtoolsPane = devtoolsFrame.closest('.kokaine-devtools-pane');
  const devtoolsResizer = requireElement('#playground-devtools-resizer', HTMLElement);
  const replSandboxContainer = requireElement('#playground-repl-sandbox', HTMLElement);
  if (!(devtoolsPane instanceof HTMLElement)) throw new Error('Missing DevTools pane');

  let editorWidth = Number(window.localStorage.getItem(SPLIT_KEY));
  if (!Number.isFinite(editorWidth) || editorWidth < 320) editorWidth = DEFAULT_EDITOR_WIDTH;
  let workbenchWidth = workbench.getBoundingClientRect().width;
  const maxEditorWidth = () => Math.max(
    320,
    workbenchWidth - projectPanel.getBoundingClientRect().width - 367,
  );
  const updateEditorWidth = (value: number) => {
    editorWidth = value;
    root.style.setProperty('--editor-width', `${value}px`);
    editorResizer.setAttribute('aria-valuenow', String(Math.round(value)));
    editorResizer.setAttribute('aria-valuemax', String(Math.round(maxEditorWidth())));
    window.localStorage.setItem(SPLIT_KEY, String(value));
  };
  updateEditorWidth(Math.min(editorWidth, maxEditorWidth()));
  disposers.push(installResizer({
    element: editorResizer,
    orientation: 'vertical',
    value: () => editorWidth,
    min: () => 320,
    max: maxEditorWidth,
    update: updateEditorWidth,
    reset: () => updateEditorWidth(Math.round(maxEditorWidth() * 0.55)),
    step: 10,
  }));

  const resizeObserver = new ResizeObserver(([entry]) => {
    if (!entry) return;
    workbenchWidth = entry.contentRect.width;
    updateEditorWidth(Math.min(Math.max(320, editorWidth), maxEditorWidth()));
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
  replSandbox = createReplSandbox({
    container: replSandboxContainer,
    dark,
    onRuntimeLog: onReplLog,
    onRuntimeError: onReplError,
    onOutput(output) {
      const value = output.trim();
      if (value) appendConsole(value);
    },
  });

  const editorPromise = createKokaEditorController({
    container: editorContainer,
    activePath,
    files: project.files,
    theme: dark ? 'dark' : 'light',
    onChange: (path, value) => queueProjectWrite(path, value),
    onActivePath: (path) => {
      activePath = path;
      selectedPath = path;
      if (!openTabs.includes(path)) openTabs = [...openTabs, path];
      dispatchProject();
    },
    onRun: runProject,
    onStatus: (status) => dispatch('playground-lsp', { status }),
    onProblemCount: (count) => dispatch('playground-problems', { count }),
    onCursor: (line, column) => dispatch('playground-cursor', { line, column }),
    onLspLog: (message) => console.info(message),
  });
  const compilerPromise = startCompiler();
  const replPromise = startRepl();

  try {
    editor = await editorPromise;
    editor.focus();
  } catch (error) {
    const message = errorMessage(error);
    editorContainer.textContent = `Editor failed to load: ${message}`;
    dispatch('playground-lsp', { status: 'error' });
    showToast(`Could not start editor: ${message}`);
  }
  await Promise.all([compilerPromise, replPromise]);

  const handleShortcut = (event: KeyboardEvent) => {
    if (!(event.metaKey || event.ctrlKey)) return;
    if (event.key.toLowerCase() === 'l') {
      event.preventDefault();
      clearConsole();
    } else if (event.key === 'Enter' && !(event.target instanceof Element && event.target.closest('.monaco-editor'))) {
      event.preventDefault();
      runProject();
    }
  };
  window.addEventListener('keydown', handleShortcut);
  disposers.push(() => window.removeEventListener('keydown', handleShortcut));
}

interface KokainePlaygroundHost {
  initialDark(): boolean;
  start(): void;
  projectEntryCount(): number;
  projectEntryPath(index: number): string;
  projectEntryLabel(index: number): string;
  projectEntryKind(index: number): string;
  projectEntryDepth(index: number): number;
  projectEntryIsEntry(index: number): boolean;
  projectEntryIsSelected(index: number): boolean;
  openProjectEntry(index: number): void;
  openTabCount(): number;
  openTabPath(index: number): string;
  openTabLabel(index: number): string;
  openTabIsActive(index: number): boolean;
  openTab(index: number): void;
  closeTab(index: number): void;
  createFile(): void;
  createDirectory(): void;
  renameSelected(): void;
  deleteSelected(): void;
  setSelectedEntry(): void;
  runProject(): void;
  submitRepl(line: string): void;
  replHistory(delta: number): string;
  clearConsole(): void;
  resetRepl(): void;
  shareProject(): void;
  resetProject(): void;
  setTheme(dark: boolean): void;
  setDevtools(visible: boolean): void;
  reloadPreview(): void;
  setDeviceWidth(value: string): void;
  copyOutput(value: string): void;
}

const host: KokainePlaygroundHost = {
  initialDark: () => initialTheme === 'dark',
  start() {
    queueMicrotask(() => {
      void startHost().catch((error: unknown) => {
        const message = errorMessage(error);
        const app = document.querySelector('#app');
        if (app) app.textContent = `Playground failed to start: ${message}`;
      });
    });
  },
  projectEntryCount: () => projectEntries.length,
  projectEntryPath: (index) => projectEntries[index]?.path ?? '',
  projectEntryLabel: (index) => projectEntries[index]?.label ?? '',
  projectEntryKind: (index) => projectEntries[index]?.kind ?? '',
  projectEntryDepth: (index) => projectEntries[index]?.depth ?? 0,
  projectEntryIsEntry: (index) => (
    projectEntries[index]?.kind === 'file'
    && projectEntries[index]?.path === modulePath(project.entryModule)
  ),
  projectEntryIsSelected: (index) => projectEntries[index]?.path === selectedPath,
  openProjectEntry(index) {
    void openProjectEntry(index);
  },
  openTabCount: () => openTabs.length,
  openTabPath: (index) => openTabs[index] ?? '',
  openTabLabel: (index) => basename(openTabs[index] ?? ''),
  openTabIsActive: (index) => openTabs[index] === activePath,
  openTab,
  closeTab,
  createFile() {
    void createFile();
  },
  createDirectory() {
    void createDirectory();
  },
  renameSelected() {
    void renameSelected();
  },
  deleteSelected() {
    void deleteSelected();
  },
  setSelectedEntry() {
    void setSelectedEntry();
  },
  runProject,
  submitRepl,
  replHistory,
  clearConsole,
  resetRepl,
  shareProject() {
    void shareProject();
  },
  resetProject() {
    void resetProject();
  },
  setTheme(nextDark) {
    dark = nextDark;
    persistTheme(dark ? 'dark' : 'light');
    editor?.setTheme(dark ? 'dark' : 'light');
    preview?.setTheme(dark);
    replSandbox?.setTheme(dark);
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

function reportHostError(error: unknown): void {
  const message = errorMessage(error);
  appendConsole(`[host:error] ${message}`);
  showToast(message);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

window.addEventListener('pagehide', () => {
  clearTimeout(writeTimer);
  void flushProjectWrites();
  compileController?.abort();
  compiler?.dispose();
  editor?.dispose();
  preview?.dispose();
  repl?.dispose();
  replSandbox?.dispose();
  projectFs?.close();
  clearTimeout(toastTimer);
  for (const dispose of disposers.splice(0)) dispose();
}, { once: true });

void import('../generated/koka/entry.mjs').catch((error: unknown) => {
  const message = errorMessage(error);
  const app = document.querySelector('#app');
  if (app) app.textContent = `Could not load the Kokaine workbench: ${message}`;
});
