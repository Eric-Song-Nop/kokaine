import type * as Monaco from 'monaco-editor';
import { KOKA_LANGUAGE_ID, setKokaDocumentLspReady } from './koka-language';
import {
  ProjectDocumentRegistry,
  projectDocumentPath,
  projectDocumentUri,
  type ProjectDocumentAdapter,
  type ProjectTextModel,
} from './project-documents';
import { connectKokaLanguageServer } from './lsp';
import type {
  KokaEditorTheme,
  KokaLspConnection,
  KokaLspDiagnostic,
} from './lsp';
import { initializeMonaco } from './monaco';
import type { MonacoApi } from './monaco';

export type KokaLspStatus = 'connecting' | 'ready' | 'error' | 'offline';

export interface KokaEditorControllerOptions {
  container: HTMLElement;
  files: Readonly<Record<string, string>>;
  activePath: string;
  theme: KokaEditorTheme;
  onChange?: (path: string, value: string) => void;
  onActivePath?: (path: string) => void;
  onRun?: () => void;
  onStatus?: (status: KokaLspStatus) => void;
  onProblemCount?: (count: number) => void;
  onCursor?: (line: number, column: number) => void;
  onLspLog?: (message: string) => void;
  onDiagnostics?: (path: string, diagnostics: readonly KokaLspDiagnostic[]) => void;
}

export interface KokaEditorController {
  getActivePath(): string;
  getValue(path?: string): string;
  setValue(value: string): void;
  setProject(files: Readonly<Record<string, string>>, activePath?: string): Promise<void>;
  openFile(path: string): void;
  setTheme(theme: KokaEditorTheme): void;
  focus(): void;
  dispose(): void;
}

interface MonacoProjectModel extends ProjectTextModel {
  readonly textModel: Monaco.editor.ITextModel;
}

export async function createKokaEditorController(
  options: KokaEditorControllerOptions,
): Promise<KokaEditorController> {
  const monaco: MonacoApi = await initializeMonaco();
  const applyingPaths = new Set<string>();
  let disposed = false;
  let activePath = options.activePath;
  let currentTheme = options.theme;
  let lastStatus: KokaLspStatus | undefined;
  let connection: KokaLspConnection | undefined;
  let connectionAbort: AbortController | undefined;
  let connectedDocumentUris: string[] = [];
  let lspGeneration = 0;
  let shutdown = Promise.resolve();

  const reportStatus = (status: KokaLspStatus) => {
    if (disposed || status === lastStatus) return;
    lastStatus = status;
    options.onStatus?.(status);
  };

  const adapter: ProjectDocumentAdapter<MonacoProjectModel> = {
    async create(documentUri, value) {
      const path = projectDocumentPath(documentUri);
      const uri = monaco.Uri.parse(documentUri);
      const modelReference = await monaco.editor.createModelReference(uri, value);
      const textModel = modelReference.object.textEditorModel;
      if (!textModel) {
        modelReference.dispose();
        throw new Error(`Koka editor could not resolve ${documentUri}`);
      }
      if (textModel.getLanguageId() !== KOKA_LANGUAGE_ID) {
        monaco.editor.setModelLanguage(textModel, KOKA_LANGUAGE_ID);
      }
      if (textModel.getValue() !== value) textModel.setValue(value);

      const model: MonacoProjectModel = {
        uri: documentUri,
        textModel,
        getValue: () => textModel.getValue(),
        setValue: (nextValue) => {
          if (textModel.isDisposed() || textModel.getValue() === nextValue) return;
          applyingPaths.add(path);
          try {
            textModel.setValue(nextValue);
          } finally {
            applyingPaths.delete(path);
          }
        },
      };
      const subscription = textModel.onDidChangeContent(() => {
        if (!applyingPaths.has(path)) options.onChange?.(path, textModel.getValue());
      });
      return {
        model,
        dispose() {
          subscription.dispose();
          if (!textModel.isDisposed()) monaco.editor.setModelMarkers(textModel, 'koka-lsp', []);
          modelReference.dispose();
        },
      };
    },
  };

  const documents = await ProjectDocumentRegistry.open(adapter, options.files);
  const initialPaths = documents.paths();
  if (initialPaths.length === 0) {
    documents.dispose();
    throw new Error('Koka editor project has no source files');
  }
  if (!initialPaths.includes(activePath)) activePath = initialPaths[0]!;

  monaco.editor.setTheme(currentTheme === 'dark' ? 'kokaine-dark' : 'kokaine-light');
  const editor = monaco.editor.create(options.container, {
    automaticLayout: true,
    ariaLabel: 'Koka project source editor',
    language: KOKA_LANGUAGE_ID,
    theme: currentTheme === 'dark' ? 'kokaine-dark' : 'kokaine-light',
    fontFamily: '"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, monospace',
    fontLigatures: true,
    fontSize: 13.5,
    lineHeight: 22,
    tabSize: 2,
    insertSpaces: true,
    detectIndentation: false,
    minimap: { enabled: false },
    padding: { top: 12, bottom: 16 },
    scrollBeyondLastLine: false,
    smoothScrolling: true,
    bracketPairColorization: { enabled: true },
    guides: { bracketPairs: true, indentation: true },
    glyphMargin: true,
    folding: true,
    codeLens: true,
    lightbulb: { enabled: monaco.editor.ShowLightbulbIconMode.On },
    inlayHints: { enabled: 'on' },
    hover: { enabled: true, delay: 250, sticky: true },
    quickSuggestions: { other: true, comments: false, strings: false },
    suggestOnTriggerCharacters: true,
    parameterHints: { enabled: true, cycle: true },
    formatOnPaste: true,
    fixedOverflowWidgets: true,
    model: documents.model(activePath).textModel,
  });

  const projectFiles = (): Record<string, string> => Object.fromEntries(
    documents.paths().map((path) => [path, documents.model(path).getValue()]),
  );

  const reportProblems = () => {
    if (disposed) return;
    const count = documents.paths().reduce((total, path) => {
      const model = documents.model(path).textModel;
      return total + (model.isDisposed()
        ? 0
        : monaco.editor.getModelMarkers({ resource: model.uri }).length);
    }, 0);
    options.onProblemCount?.(count);
  };

  const clearLspState = () => {
    for (const documentUri of connectedDocumentUris) {
      setKokaDocumentLspReady(documentUri, false);
    }
    connectedDocumentUris = [];
    for (const path of documents.paths()) {
      const model = documents.model(path).textModel;
      if (!model.isDisposed()) monaco.editor.setModelMarkers(model, 'koka-lsp', []);
    }
    reportProblems();
  };

  const stopLsp = () => {
    const previousConnection = connection;
    connection = undefined;
    connectionAbort?.abort();
    connectionAbort = undefined;
    clearLspState();
    if (previousConnection) shutdown = shutdown.then(() => previousConnection.dispose());
    return shutdown;
  };

  const startLsp = async () => {
    const generation = ++lspGeneration;
    await stopLsp();
    if (disposed || generation !== lspGeneration) return;

    const documentUris = documents.paths().map(projectDocumentUri);
    reportStatus('connecting');
    options.onLspLog?.('[client] Starting the Koka WebAssembly language server.');
    const abortController = new AbortController();
    connectionAbort = abortController;

    try {
      const nextConnection = await connectKokaLanguageServer({
        workspaceUri: 'file:///workspace',
        documentUris,
        files: projectFiles(),
        theme: currentTheme,
        signal: abortController.signal,
        onLog: options.onLspLog,
        onClose: () => {
          if (disposed || generation !== lspGeneration) return;
          connection = undefined;
          clearLspState();
          reportStatus('offline');
        },
        onSignatureHelpContext: () => {
          editor.trigger('koka', 'editor.action.triggerParameterHints', {});
        },
        onDiagnostics: (diagnosticUri, diagnostics) => {
          if (disposed || generation !== lspGeneration) return false;
          let path: string;
          try {
            path = projectDocumentPath(diagnosticUri);
          } catch {
            return false;
          }
          let model: MonacoProjectModel;
          try {
            model = documents.model(path);
          } catch {
            return false;
          }
          if (model.textModel.isDisposed()) return false;
          monaco.editor.setModelMarkers(
            model.textModel,
            'koka-lsp',
            diagnostics.map((diagnostic) => ({
              severity: diagnosticSeverity(monaco, diagnostic.severity),
              message: diagnostic.message,
              source: diagnostic.source ?? 'Koka',
              code: diagnostic.code === undefined ? undefined : String(diagnostic.code),
              startLineNumber: diagnostic.range.start.line + 1,
              startColumn: diagnostic.range.start.character + 1,
              endLineNumber: diagnostic.range.end.line + 1,
              endColumn: diagnostic.range.end.character + 1,
            })),
          );
          options.onDiagnostics?.(path, diagnostics);
          reportProblems();
          return true;
        },
      });
      if (disposed || generation !== lspGeneration) {
        await nextConnection.dispose();
        return;
      }
      connection = nextConnection;
      connectionAbort = undefined;
      connectedDocumentUris = documentUris;
      for (const documentUri of documentUris) setKokaDocumentLspReady(documentUri, true);
      reportStatus('ready');
      options.onLspLog?.('[client] Koka language intelligence ready.');
    } catch (error) {
      if (disposed || abortController.signal.aborted || generation !== lspGeneration) return;
      connectionAbort = undefined;
      reportStatus('error');
      options.onLspLog?.(`[client] ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const openFile = (path: string) => {
    const model = documents.model(path);
    activePath = projectDocumentPath(model.uri);
    editor.setModel(model.textModel);
    options.onActivePath?.(activePath);
    const position = editor.getPosition();
    options.onCursor?.(position?.lineNumber ?? 1, position?.column ?? 1);
  };

  const markerSubscription = monaco.editor.onDidChangeMarkers((resources) => {
    const projectUris = new Set(documents.paths().map((path) => documents.model(path).textModel.uri.toString()));
    if (resources.some((resource) => projectUris.has(resource.toString()))) reportProblems();
  });
  const cursorSubscription = editor.onDidChangeCursorPosition(({ position }) => {
    options.onCursor?.(position.lineNumber, position.column);
  });
  const runAction = editor.addAction({
    id: 'kokaine.playground.run',
    label: 'Run Koka project',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
    contextMenuGroupId: 'navigation',
    contextMenuOrder: 1,
    run: () => options.onRun?.(),
  });

  reportProblems();
  options.onCursor?.(1, 1);
  options.onActivePath?.(activePath);
  void startLsp();

  return {
    getActivePath: () => activePath,
    getValue: (path = activePath) => documents.model(path).getValue(),
    setValue(value) {
      documents.model(activePath).setValue(value);
      options.onChange?.(activePath, value);
    },
    async setProject(files, requestedActivePath) {
      const delta = await documents.reconcile(files);
      const paths = documents.paths();
      if (paths.length === 0) throw new Error('Koka editor project has no source files');
      const nextActivePath = requestedActivePath && paths.includes(requestedActivePath)
        ? requestedActivePath
        : paths.includes(activePath) ? activePath : paths[0]!;
      openFile(nextActivePath);
      reportProblems();
      if (delta.added.length > 0 || delta.removed.length > 0) void startLsp();
    },
    openFile,
    setTheme(theme) {
      currentTheme = theme;
      monaco.editor.setTheme(theme === 'dark' ? 'kokaine-dark' : 'kokaine-light');
      void connection?.setTheme(theme);
    },
    focus: () => editor.focus(),
    dispose() {
      if (disposed) return;
      disposed = true;
      lspGeneration += 1;
      void stopLsp();
      markerSubscription.dispose();
      cursorSubscription.dispose();
      runAction.dispose();
      editor.dispose();
      documents.dispose();
    },
  };
}

function diagnosticSeverity(monaco: MonacoApi, value?: number): Monaco.MarkerSeverity {
  switch (value) {
    case 2: return monaco.MarkerSeverity.Warning;
    case 3: return monaco.MarkerSeverity.Info;
    case 4: return monaco.MarkerSeverity.Hint;
    default: return monaco.MarkerSeverity.Error;
  }
}
