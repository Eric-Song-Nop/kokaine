import { createEffect, on, onCleanup, onMount } from 'solid-js';
import type * as Monaco from 'monaco-editor';
import {
  KOKA_LANGUAGE_ID,
  setKokaDocumentLspReady,
} from './koka-language';
import {
  connectKokaLanguageServer,
  type KokaEditorTheme,
  type KokaLspDiagnostic,
  type KokaLspConnection,
} from './lsp';
import { initializeMonaco, type MonacoApi } from './monaco';

export type KokaLspStatus = 'connecting' | 'ready' | 'error' | 'offline';

export interface KokaEditorProps {
  value: string;
  onChange?: (value: string) => void;
  /** Stable file URI exposed to the in-browser Koka language server. */
  documentUri: string;
  theme: KokaEditorTheme;
  onReady?: (
    editor: Monaco.editor.IStandaloneCodeEditor,
    monaco: MonacoApi,
  ) => void;
  onLspStatus?: (status: KokaLspStatus) => void;
  onLspLog?: (message: string) => void;
  onDiagnostics?: (diagnostics: readonly KokaLspDiagnostic[]) => void;
  onProblemCount?: (count: number) => void;
  onRun?: () => void;
  class?: string;
  ariaLabel?: string;
  options?: Monaco.editor.IStandaloneEditorConstructionOptions;
}

function errorText(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

/** A controlled, single-file Koka editor with a browser-WASM Koka LSP. */
export function KokaEditor(props: KokaEditorProps) {
  let container!: HTMLDivElement;
  let monaco: MonacoApi | undefined;
  let editor: Monaco.editor.IStandaloneCodeEditor | undefined;
  let model: Monaco.editor.ITextModel | undefined;
  let ownsModel = false;
  let modelSubscription: Monaco.IDisposable | undefined;
  let markerSubscription: Monaco.IDisposable | undefined;
  let runAction: Monaco.IDisposable | undefined;
  let connection: KokaLspConnection | undefined;
  let connectionAbort: AbortController | undefined;
  let shutdown = Promise.resolve();
  let connectedDocumentUri: string | undefined;
  let sourceDocumentUri: string | undefined;
  let lspAttempt = 0;
  let applyingControlledValue = false;
  let disposed = false;
  let lastStatus: KokaLspStatus | undefined;

  const reportStatus = (status: KokaLspStatus) => {
    if (disposed || status === lastStatus) return;
    lastStatus = status;
    props.onLspStatus?.(status);
  };

  const reportProblems = () => {
    if (!monaco || !model || disposed) return;
    props.onProblemCount?.(
      monaco.editor.getModelMarkers({ resource: model.uri }).length,
    );
  };

  const releaseModel = () => {
    modelSubscription?.dispose();
    modelSubscription = undefined;
    if (monaco && model && !model.isDisposed()) {
      monaco.editor.setModelMarkers(model, 'koka-lsp', []);
    }
    if (model && ownsModel && !model.isDisposed()) model.dispose();
    model = undefined;
    ownsModel = false;
  };

  const installModel = (documentUri: string, value: string) => {
    if (!monaco || !editor) return;
    const uri = monaco.Uri.parse(documentUri);
    if (uri.scheme !== 'file') {
      throw new Error(`Koka editor documentUri must use file://, received ${documentUri}`);
    }

    releaseModel();
    model = monaco.editor.getModel(uri) ?? undefined;
    ownsModel = !model;
    if (!model) model = monaco.editor.createModel(value, KOKA_LANGUAGE_ID, uri);
    else {
      if (model.getLanguageId() !== KOKA_LANGUAGE_ID) {
        monaco.editor.setModelLanguage(model, KOKA_LANGUAGE_ID);
      }
      if (model.getValue() !== value) model.setValue(value);
    }

    sourceDocumentUri = documentUri;
    editor.setModel(model);
    modelSubscription = model.onDidChangeContent(() => {
      if (!applyingControlledValue) props.onChange?.(model!.getValue());
    });
    reportProblems();
  };

  const stopLsp = () => {
    const previousConnection = connection;
    connection = undefined;
    connectionAbort?.abort();
    connectionAbort = undefined;
    if (connectedDocumentUri) {
      setKokaDocumentLspReady(connectedDocumentUri, false);
      connectedDocumentUri = undefined;
    }
    if (monaco && model && !model.isDisposed()) {
      monaco.editor.setModelMarkers(model, 'koka-lsp', []);
      reportProblems();
    }
    if (previousConnection) {
      shutdown = shutdown.then(() => previousConnection.dispose());
    }
    return shutdown;
  };

  const startLsp = async () => {
    const attempt = ++lspAttempt;
    await stopLsp();
    if (disposed || attempt !== lspAttempt) return;

    const documentUri = model?.uri.toString();
    if (!documentUri) {
      reportStatus('offline');
      return;
    }

    reportStatus('connecting');
    props.onLspLog?.('[client] Starting the Koka WebAssembly language server.');
    const abortController = new AbortController();
    connectionAbort = abortController;

    try {
      const nextConnection = await connectKokaLanguageServer({
        documentUri,
        theme: props.theme,
        signal: abortController.signal,
        onLog: (message) => props.onLspLog?.(message),
        onClose: () => {
          if (attempt !== lspAttempt || disposed) return;
          connection = undefined;
          setKokaDocumentLspReady(documentUri, false);
          connectedDocumentUri = undefined;
          reportStatus('offline');
        },
        onSignatureHelpContext: () => {
          editor?.trigger('koka', 'editor.action.triggerParameterHints', {});
        },
        onDiagnostics: (diagnosticUri, diagnostics) => {
          if (attempt !== lspAttempt || disposed || !monaco || !model) return false;
          let normalizedDiagnosticUri = diagnosticUri;
          try {
            normalizedDiagnosticUri = monaco.Uri.parse(diagnosticUri).toString();
          } catch {
            // Leave malformed URIs to the language client's default handler.
          }
          if (normalizedDiagnosticUri !== model.uri.toString()) return false;

          const severity = (value?: number): Monaco.MarkerSeverity => {
            switch (value) {
              case 2: return monaco!.MarkerSeverity.Warning;
              case 3: return monaco!.MarkerSeverity.Info;
              case 4: return monaco!.MarkerSeverity.Hint;
              default: return monaco!.MarkerSeverity.Error;
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
          props.onDiagnostics?.(diagnostics);
          reportProblems();
          return true;
        },
      });

      if (disposed || attempt !== lspAttempt) {
        await nextConnection.dispose();
        return;
      }

      connection = nextConnection;
      connectionAbort = undefined;
      connectedDocumentUri = documentUri;
      setKokaDocumentLspReady(documentUri, true);
      reportStatus('ready');
      props.onLspLog?.('[client] Koka language intelligence ready.');
    } catch (error) {
      if (disposed || attempt !== lspAttempt || abortController.signal.aborted) return;
      connectionAbort = undefined;
      reportStatus('error');
      props.onLspLog?.(`[client] ${errorText(error)}`);
    }
  };

  onMount(() => {
    void (async () => {
      try {
        monaco = await initializeMonaco();
        if (disposed) return;

        monaco.editor.setTheme(props.theme === 'dark' ? 'kokaine-dark' : 'kokaine-light');
        editor = monaco.editor.create(container, {
          automaticLayout: true,
          ariaLabel: props.ariaLabel ?? 'Koka source editor',
          language: KOKA_LANGUAGE_ID,
          theme: props.theme === 'dark' ? 'kokaine-dark' : 'kokaine-light',
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
          ...props.options,
          model: null,
        });

        installModel(props.documentUri, props.value);
        markerSubscription = monaco.editor.onDidChangeMarkers((resources) => {
          if (model && resources.some((resource) => resource.toString() === model!.uri.toString())) {
            reportProblems();
          }
        });
        runAction = editor.addAction({
          id: 'kokaine.playground.run',
          label: 'Run Koka program',
          keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
          contextMenuGroupId: 'navigation',
          contextMenuOrder: 1,
          run: () => props.onRun?.(),
        });

        props.onReady?.(editor, monaco);
        await startLsp();
      } catch (error) {
        if (disposed) return;
        reportStatus('error');
        props.onLspLog?.(`[editor] ${errorText(error)}`);
        if (!editor) container.textContent = `Editor failed to load: ${errorText(error)}`;
      }
    })();
  });

  createEffect(on(
    () => props.value,
    (value) => {
      if (!model || model.isDisposed() || model.getValue() === value) return;
      applyingControlledValue = true;
      try {
        model.setValue(value);
      } finally {
        applyingControlledValue = false;
      }
    },
  ));

  createEffect(on(
    () => props.documentUri,
    (documentUri, previousDocumentUri) => {
      if (!editor || !monaco || previousDocumentUri === undefined) return;
      if (documentUri !== previousDocumentUri) {
        try {
          if (connectedDocumentUri) setKokaDocumentLspReady(connectedDocumentUri, false);
          installModel(documentUri, props.value);
        } catch (error) {
          reportStatus('error');
          props.onLspLog?.(`[editor] ${errorText(error)}`);
          return;
        }
      }
      if (documentUri !== previousDocumentUri) void startLsp();
    },
    { defer: true },
  ));

  createEffect(on(
    () => props.theme,
    (theme) => {
      monaco?.editor.setTheme(theme === 'dark' ? 'kokaine-dark' : 'kokaine-light');
      void connection?.setTheme(theme);
    },
  ));

  onCleanup(() => {
    disposed = true;
    lspAttempt += 1;
    void stopLsp();
    markerSubscription?.dispose();
    modelSubscription?.dispose();
    runAction?.dispose();
    editor?.dispose();
    if (model && ownsModel && !model.isDisposed()) model.dispose();
  });

  return (
    <div
      ref={container}
      class={`koka-editor ${props.class ?? ''}`.trim()}
      style={{ width: '100%', height: '100%', 'min-width': '0', 'min-height': '0' }}
    />
  );
}
