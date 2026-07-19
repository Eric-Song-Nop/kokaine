import { Bug, Code2, Eye, SquareTerminal } from 'lucide-solid';
import {
  Show,
  batch,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';
import { Header } from './components/Header';
import { OutputPane } from './components/OutputPane';
import { StatusBar } from './components/StatusBar';
import { DEFAULT_SOURCE, SPLIT_KEY } from './defaults';
import { KokaEditor } from './editor';
import {
  loadInitialSource,
  loadTheme,
  makeShareUrl,
  persistSource,
  persistTheme,
  resetSource,
} from './lib/persistence';
import {
  DragResizer,
  Preview,
  type PreviewModuleBundle,
  type PreviewRuntimeError,
  type PreviewRuntimeLog,
} from './preview';
import type {
  BuildStatus,
  CompileResult,
  GeneratedModule,
  LspStatus,
  OutputChannel,
  RuntimeLog,
  WorkspaceView,
} from './types';
import { DEFAULT_PRECOMPILED_BASE_URL } from './wasm/assets';
import { createBrowserCompiler, type BrowserCompiler } from './wasm/runtime';

const initialSource = loadInitialSource().source;
const DEFAULT_EDITOR_WIDTH = Math.round(window.innerWidth * 0.54);
const DOCUMENT_URI = 'file:///main.kk';

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
  const modules = Array.from(generatedModules, ([path, source]) => ({ path, source }));
  const encoded = moduleFilename(moduleName);
  const find = (filename: string) => modules.find((module) => basename(module.path) === filename);
  const entry = find(`${encoded}__main.mjs`)
    ?? modules.find((module) => basename(module.path).endsWith('__main.mjs'))
    ?? find(`${encoded}.mjs`)
    ?? null;
  const generated = find(`${encoded}.mjs`) ?? entry ?? modules[0] ?? null;
  return {
    entryPath: entry?.path ?? null,
    generatedFile: generated?.path ?? null,
    generatedSource: generated?.source ?? '',
    modules,
  };
}

function initialEditorWidth(): number {
  const saved = Number(window.localStorage.getItem(SPLIT_KEY));
  return Number.isFinite(saved) && saved >= 300 ? saved : DEFAULT_EDITOR_WIDTH;
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

export function App() {
  let workbench!: HTMLDivElement;
  let resizeObserver: ResizeObserver | undefined;
  let cursorSubscription: { dispose(): void } | undefined;
  let compileController: AbortController | undefined;
  let revision = 0;
  let logId = 0;
  let toastTimer: number | undefined;

  const [source, setSource] = createSignal(initialSource);
  const [compiler, setCompiler] = createSignal<BrowserCompiler | null>(null);
  const [compilerVersion, setCompilerVersion] = createSignal<string | null>(null);
  const [sessionError, setSessionError] = createSignal<string | null>(null);
  const [theme, setTheme] = createSignal(loadTheme());
  const [lspStatus, setLspStatus] = createSignal<LspStatus>('connecting');
  const [buildStatus, setBuildStatus] = createSignal<BuildStatus>('idle');
  const [compileResult, setCompileResult] = createSignal<CompileResult | null>(null);
  const [lastBuiltSource, setLastBuiltSource] = createSignal<string | null>(null);
  const [previewBundle, setPreviewBundle] = createSignal<PreviewModuleBundle | null>(null);
  const [previewRevision, setPreviewRevision] = createSignal(0);
  const [previewReload, setPreviewReload] = createSignal(0);
  const [runtimeLogs, setRuntimeLogs] = createSignal<RuntimeLog[]>([]);
  const [problemCount, setProblemCount] = createSignal(0);
  const [cursor, setCursor] = createSignal({ line: 1, column: 1 });
  const [rightView, setRightView] = createSignal<'preview' | 'output'>('preview');
  const [outputChannel, setOutputChannel] = createSignal<OutputChannel>('generated');
  const [devtoolsVisible, setDevtoolsVisible] = createSignal(false);
  const [mobileView, setMobileView] = createSignal<WorkspaceView>('editor');
  const [editorWidth, setEditorWidth] = createSignal(initialEditorWidth());
  const [workbenchWidth, setWorkbenchWidth] = createSignal(window.innerWidth);
  const [toast, setToast] = createSignal<string | null>(null);

  const stale = () => lastBuiltSource() !== null && source() !== lastBuiltSource();
  const maxEditorWidth = () => Math.max(300, workbenchWidth() - 307);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => setToast(null), 2200);
  };

  const addRuntimeLog = (
    level: RuntimeLog['level'],
    text: string,
    timestamp = Date.now(),
  ) => {
    const next: RuntimeLog = { id: ++logId, level, text, timestamp };
    setRuntimeLogs((current) => [...current.slice(-499), next]);
  };

  const runWithCompiler = async (activeCompiler: BrowserCompiler) => {
    if (buildStatus() === 'compiling') return;
    const code = source();
    const activeRevision = ++revision;
    compileController?.abort();
    compileController = new AbortController();
    setBuildStatus('compiling');
    setSessionError(null);

    try {
      const compiled = await activeCompiler.compile({
        source: code,
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
        usedLastGood: !compiled.ok && Boolean(previewBundle()),
      };
      batch(() => {
        setCompileResult(result);
        setBuildStatus(result.ok ? 'success' : 'error');

        if (result.ok && result.entryPath) {
          setLastBuiltSource(code);
          setPreviewBundle({
            entryPath: result.entryPath,
            modules: result.modules,
            precompiledBaseUrl: DEFAULT_PRECOMPILED_BASE_URL,
          });
          setPreviewRevision(result.revision);
          setPreviewReload((value) => value + 1);
          setRuntimeLogs([]);
          setRightView('preview');
          if (mobileView() !== 'editor') setMobileView('preview');
        } else {
          setOutputChannel('build');
          setRightView('output');
          if (mobileView() !== 'editor') setMobileView('output');
        }
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      const message = error instanceof Error ? error.message : String(error);
      setBuildStatus('error');
      setCompileResult({
        ok: false,
        revision: activeRevision,
        durationMs: 0,
        entryPath: previewBundle()?.entryPath ?? null,
        modules: compileResult()?.modules ?? [],
        generatedSource: compileResult()?.generatedSource ?? '',
        generatedFile: compileResult()?.generatedFile ?? null,
        stdout: '',
        stderr: message,
        error: message,
        usedLastGood: Boolean(previewBundle()),
      });
      setOutputChannel('build');
      setRightView('output');
    }
  };

  const run = () => {
    const activeCompiler = compiler();
    if (!activeCompiler) {
      showToast(sessionError() ?? 'The compiler session is still starting.');
      return;
    }
    void runWithCompiler(activeCompiler);
  };

  const startCompiler = async () => {
    setSessionError(null);
    try {
      const created = await createBrowserCompiler();
      setCompiler(created);
      setCompilerVersion(created.compilerVersion);
      await runWithCompiler(created);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setSessionError(message);
      setLspStatus('offline');
      setBuildStatus('error');
      showToast(`Could not start playground: ${message}`);
    }
  };

  const onPreviewLog = (log: PreviewRuntimeLog) => {
    addRuntimeLog(log.level, log.args.map(printable).join(' '), log.timestamp);
  };

  const onPreviewError = (error: PreviewRuntimeError) => {
    const location = error.source
      ? `\n${error.source}${error.line ? `:${error.line}:${error.column ?? 0}` : ''}`
      : '';
    addRuntimeLog('error', `${error.name}: ${error.message}${location}${error.stack ? `\n${error.stack}` : ''}`, error.timestamp);
  };

  const toggleDevtools = () => {
    const next = !devtoolsVisible();
    setDevtoolsVisible(next);
    if (next) {
      setRightView('preview');
      if (mobileView() !== 'editor') setMobileView('devtools');
    } else if (mobileView() === 'devtools') {
      setMobileView('preview');
    }
  };

  const share = async () => {
    const url = makeShareUrl(source());
    try {
      await navigator.clipboard.writeText(url);
      window.history.replaceState(null, '', url);
      showToast('Share link copied');
    } catch {
      window.location.hash = new URL(url).hash;
      showToast('Share link added to the address bar');
    }
  };

  const reset = () => {
    if (source() !== DEFAULT_SOURCE && !window.confirm('Reset main.kk to the starter example?')) return;
    resetSource();
    setSource(DEFAULT_SOURCE);
    showToast('Starter restored');
  };

  const selectMobileView = (view: WorkspaceView) => {
    setMobileView(view);
    if (view === 'output') setRightView('output');
    if (view === 'preview' || view === 'devtools') setRightView('preview');
    if (view === 'devtools') setDevtoolsVisible(true);
  };

  createEffect(() => persistSource(source()));
  createEffect(() => persistTheme(theme()));
  createEffect(() => window.localStorage.setItem(SPLIT_KEY, String(editorWidth())));

  onMount(() => {
    resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const width = entry.contentRect.width;
      setWorkbenchWidth(width);
      setEditorWidth((current) => Math.min(Math.max(300, current), Math.max(300, width - 307)));
    });
    resizeObserver.observe(workbench);
    void startCompiler();
  });

  onCleanup(() => {
    resizeObserver?.disconnect();
    cursorSubscription?.dispose();
    compileController?.abort();
    compiler()?.dispose();
    if (toastTimer) window.clearTimeout(toastTimer);
  });

  return (
    <main
      class="app-shell"
      data-theme={theme()}
      style={`--editor-width:${editorWidth()}px`}
    >
      <Header
        theme={theme()}
        lspStatus={lspStatus()}
        buildStatus={buildStatus()}
        compilerVersion={compilerVersion()}
        buildDurationMs={compileResult()?.durationMs ?? null}
        problemCount={problemCount()}
        stale={stale()}
        devtoolsVisible={devtoolsVisible()}
        onRun={run}
        onShare={() => void share()}
        onReset={reset}
        onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
        onToggleDevtools={toggleDevtools}
      />

      <nav class="mobile-nav" aria-label="Playground panels">
        <button classList={{ 'is-active': mobileView() === 'editor' }} onClick={() => selectMobileView('editor')}>
          Editor
        </button>
        <button classList={{ 'is-active': mobileView() === 'preview' }} onClick={() => selectMobileView('preview')}>
          Preview
        </button>
        <button classList={{ 'is-active': mobileView() === 'output' }} onClick={() => selectMobileView('output')}>
          Output
        </button>
        <button classList={{ 'is-active': mobileView() === 'devtools' }} onClick={() => selectMobileView('devtools')}>
          DevTools
        </button>
      </nav>

      <div ref={workbench} class="workbench">
        <section class="workbench-panel" classList={{ 'is-mobile-active': mobileView() === 'editor' }}>
          <div class="panel-tabs">
            <div class="panel-tabs__group">
              <button type="button" class="panel-tab is-active">
                <span class="panel-tab__koka">K</span>
                main.kk
                <Show when={stale()}><span class="panel-tab__dirty" title="Not compiled" /></Show>
              </button>
            </div>
            <div class="panel-meta">Koka · UTF-8</div>
          </div>
          <div class="editor-host">
            <KokaEditor
              value={source()}
              documentUri={DOCUMENT_URI}
              theme={theme()}
              onChange={setSource}
              onRun={run}
              onLspStatus={setLspStatus}
              onProblemCount={setProblemCount}
              onReady={(editor) => {
                cursorSubscription?.dispose();
                cursorSubscription = editor.onDidChangeCursorPosition((event) => {
                  setCursor({ line: event.position.lineNumber, column: event.position.column });
                });
              }}
            />
          </div>
        </section>

        <DragResizer
          orientation="vertical"
          value={editorWidth()}
          min={300}
          max={maxEditorWidth()}
          step={8}
          class="split-handle split-handle--x"
          label="Resize source editor"
          onChange={setEditorWidth}
          onReset={() => setEditorWidth(Math.round(workbenchWidth() * 0.54))}
        />

        <section
          class="workbench-panel right-panel"
          classList={{ 'is-mobile-active': mobileView() !== 'editor' }}
        >
          <div class="panel-tabs">
            <div class="panel-tabs__group" role="tablist" aria-label="Result panels">
              <button
                type="button"
                role="tab"
                aria-selected={rightView() === 'preview'}
                class="panel-tab"
                classList={{ 'is-active': rightView() === 'preview' }}
                onClick={() => setRightView('preview')}
              >
                <Eye size={14} /> Preview
                <Show when={devtoolsVisible()}><Bug size={12} /></Show>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={rightView() === 'output'}
                class="panel-tab"
                classList={{ 'is-active': rightView() === 'output' }}
                onClick={() => setRightView('output')}
              >
                <SquareTerminal size={14} /> Output
              </button>
            </div>
            <div class="panel-meta">
              <Show when={compileResult()?.usedLastGood}>last good build</Show>
              <Show when={compileResult()?.generatedFile}>{compileResult()!.generatedFile}</Show>
            </div>
          </div>

          <div class="right-panel__body">
            <div
              class="right-surface"
              classList={{
                'is-active': rightView() === 'preview',
                'is-mobile-active': mobileView() === 'preview' || mobileView() === 'devtools',
              }}
            >
              <Show
                when={previewBundle()}
                fallback={
                  <div class="preview-empty">
                    <Code2 size={28} stroke-width={1.4} />
                    <strong>{buildStatus() === 'compiling' ? 'Compiling main.kk…' : 'Preview is waiting for a build'}</strong>
                    <span>{sessionError() ?? 'Run the program to compile Kokaine for the browser.'}</span>
                    <button type="button" disabled={buildStatus() === 'compiling'} onClick={run}>Run main.kk</button>
                  </div>
                }
              >
                {(moduleBundle) => (
                  <Preview
                    moduleBundle={moduleBundle()}
                    revision={previewRevision()}
                    reloadSignal={previewReload()}
                    dark={theme() === 'dark'}
                    devtoolsVisible={devtoolsVisible()}
                    onRuntimeLog={onPreviewLog}
                    onRuntimeError={onPreviewError}
                  />
                )}
              </Show>
            </div>

            <div
              class="right-surface"
              classList={{
                'is-active': rightView() === 'output',
                'is-mobile-active': mobileView() === 'output',
              }}
            >
              <OutputPane
                channel={outputChannel()}
                result={compileResult()}
                runtimeLogs={runtimeLogs()}
                onChannelChange={setOutputChannel}
              />
            </div>
          </div>
        </section>
      </div>

      <StatusBar
        lspStatus={lspStatus()}
        buildStatus={buildStatus()}
        problems={problemCount()}
        line={cursor().line}
        column={cursor().column}
      />

      <div class="toast-region" aria-live="polite" aria-atomic="true">
        <Show when={toast()}>{(message) => <div class="toast">{message()}</div>}</Show>
      </div>
    </main>
  );
}
