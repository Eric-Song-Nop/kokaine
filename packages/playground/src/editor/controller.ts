import type * as Monaco from 'monaco-editor';
import { KOKA_LANGUAGE_ID, setKokaDocumentLspReady } from './koka-language';
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
  documentUri: string;
  value: string;
  theme: KokaEditorTheme;
  onChange?: (value: string) => void;
  onRun?: () => void;
  onStatus?: (status: KokaLspStatus) => void;
  onProblemCount?: (count: number) => void;
  onCursor?: (line: number, column: number) => void;
  onLspLog?: (message: string) => void;
  onDiagnostics?: (diagnostics: readonly KokaLspDiagnostic[]) => void;
}

export interface KokaEditorController {
  getValue(): string;
  setValue(value: string): void;
  setTheme(theme: KokaEditorTheme): void;
  focus(): void;
  dispose(): void;
}

export async function createKokaEditorController(
  options: KokaEditorControllerOptions,
): Promise<KokaEditorController> {
  let disposed = false;
  let applyingValue = false;
  let lastStatus: KokaLspStatus | undefined;
  let connection: KokaLspConnection | undefined;
  let connectionAbort: AbortController | undefined;
  let connectedDocumentUri: string | undefined;
  let shutdown = Promise.resolve();

  const monaco: MonacoApi = await initializeMonaco();
  if (disposed) throw new Error('Editor initialization was cancelled');

  const reportStatus = (status: KokaLspStatus) => {
    if (disposed || status === lastStatus) return;
    lastStatus = status;
    options.onStatus?.(status);
  };

  monaco.editor.setTheme(options.theme === 'dark' ? 'kokaine-dark' : 'kokaine-light');
  const uri = monaco.Uri.parse(options.documentUri);
  if (uri.scheme !== 'file') {
    throw new Error(`Koka editor documentUri must use file://, received ${options.documentUri}`);
  }
  const modelReference = await monaco.editor.createModelReference(uri, options.value);
  const model = modelReference.object.textEditorModel;
  if (!model) {
    modelReference.dispose();
    throw new Error(`Koka editor could not resolve ${options.documentUri}`);
  }
  if (model.getLanguageId() !== KOKA_LANGUAGE_ID) {
    monaco.editor.setModelLanguage(model, KOKA_LANGUAGE_ID);
  }
  if (model.getValue() !== options.value) model.setValue(options.value);

  const editor = monaco.editor.create(options.container, {
    automaticLayout: true,
    ariaLabel: 'Koka source editor',
    language: KOKA_LANGUAGE_ID,
    theme: options.theme === 'dark' ? 'kokaine-dark' : 'kokaine-light',
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
    model,
  });

  const reportProblems = () => {
    if (disposed || model.isDisposed()) return;
    options.onProblemCount?.(monaco.editor.getModelMarkers({ resource: model.uri }).length);
  };

  const modelSubscription = model.onDidChangeContent(() => {
    if (!applyingValue) options.onChange?.(model.getValue());
  });
  const markerSubscription = monaco.editor.onDidChangeMarkers((resources) => {
    if (resources.some((resource) => resource.toString() === model.uri.toString())) {
      reportProblems();
    }
  });
  const cursorSubscription = editor.onDidChangeCursorPosition(({ position }) => {
    options.onCursor?.(position.lineNumber, position.column);
  });
  const runAction = editor.addAction({
    id: 'kokaine.playground.run',
    label: 'Run Koka program',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
    contextMenuGroupId: 'navigation',
    contextMenuOrder: 1,
    run: () => options.onRun?.(),
  });

  const stopLsp = () => {
    const previousConnection = connection;
    connection = undefined;
    connectionAbort?.abort();
    connectionAbort = undefined;
    if (connectedDocumentUri) {
      setKokaDocumentLspReady(connectedDocumentUri, false);
      connectedDocumentUri = undefined;
    }
    if (!model.isDisposed()) {
      monaco.editor.setModelMarkers(model, 'koka-lsp', []);
      reportProblems();
    }
    if (previousConnection) shutdown = shutdown.then(() => previousConnection.dispose());
    return shutdown;
  };

  const startLsp = async () => {
    await stopLsp();
    if (disposed) return;
    const documentUri = model.uri.toString();
    reportStatus('connecting');
    options.onLspLog?.('[client] Starting the Koka WebAssembly language server.');
    const abortController = new AbortController();
    connectionAbort = abortController;

    try {
      const nextConnection = await connectKokaLanguageServer({
        documentUri,
        theme: options.theme,
        signal: abortController.signal,
        onLog: options.onLspLog,
        onClose: () => {
          if (disposed) return;
          connection = undefined;
          setKokaDocumentLspReady(documentUri, false);
          connectedDocumentUri = undefined;
          reportStatus('offline');
        },
        onSignatureHelpContext: () => {
          editor.trigger('koka', 'editor.action.triggerParameterHints', {});
        },
        onDiagnostics: (diagnosticUri, diagnostics) => {
          if (disposed || model.isDisposed()) return false;
          let normalizedDiagnosticUri = diagnosticUri;
          try {
            normalizedDiagnosticUri = monaco.Uri.parse(diagnosticUri).toString();
          } catch {
            return false;
          }
          if (normalizedDiagnosticUri !== model.uri.toString()) return false;

          const severity = (value?: number): Monaco.MarkerSeverity => {
            switch (value) {
              case 2: return monaco.MarkerSeverity.Warning;
              case 3: return monaco.MarkerSeverity.Info;
              case 4: return monaco.MarkerSeverity.Hint;
              default: return monaco.MarkerSeverity.Error;
            }
          };
          monaco.editor.setModelMarkers(
            model,
            'koka-lsp',
            diagnostics.map((diagnostic) => ({
              severity: severity(diagnostic.severity),
              message: diagnostic.message,
              source: diagnostic.source ?? 'Koka',
              code: diagnostic.code === undefined ? undefined : String(diagnostic.code),
              startLineNumber: diagnostic.range.start.line + 1,
              startColumn: diagnostic.range.start.character + 1,
              endLineNumber: diagnostic.range.end.line + 1,
              endColumn: diagnostic.range.end.character + 1,
            })),
          );
          options.onDiagnostics?.(diagnostics);
          reportProblems();
          return true;
        },
      });
      if (disposed) {
        await nextConnection.dispose();
        return;
      }
      connection = nextConnection;
      connectionAbort = undefined;
      connectedDocumentUri = documentUri;
      setKokaDocumentLspReady(documentUri, true);
      reportStatus('ready');
      options.onLspLog?.('[client] Koka language intelligence ready.');
    } catch (error) {
      if (disposed || abortController.signal.aborted) return;
      connectionAbort = undefined;
      reportStatus('error');
      options.onLspLog?.(`[client] ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  reportProblems();
  options.onCursor?.(1, 1);
  void startLsp();

  return {
    getValue() {
      return model.getValue();
    },
    setValue(value) {
      if (model.isDisposed() || model.getValue() === value) return;
      applyingValue = true;
      try {
        model.setValue(value);
      } finally {
        applyingValue = false;
      }
      options.onChange?.(value);
    },
    setTheme(theme) {
      monaco.editor.setTheme(theme === 'dark' ? 'kokaine-dark' : 'kokaine-light');
      void connection?.setTheme(theme);
    },
    focus() {
      editor.focus();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      void stopLsp();
      markerSubscription.dispose();
      modelSubscription.dispose();
      cursorSubscription.dispose();
      runAction.dispose();
      editor.dispose();
      modelReference.dispose();
    },
  };
}
