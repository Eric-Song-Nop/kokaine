import type { MonacoLanguageClient } from 'monaco-languageclient';
import {
  AbstractMessageReader,
  AbstractMessageWriter,
  Disposable,
  type DataCallback,
  type Message,
  type MessageReader,
  type MessageWriter,
} from 'vscode-jsonrpc/browser.js';

import {
  DEFAULT_LSP_WASM_PATH,
  loadRuntimeAssets,
  resolvePublicAssetUrl,
} from '../wasm/assets';
import { DEFAULT_COMPILER_FLAGS } from '../wasm/runtime';

export type KokaEditorTheme = 'dark' | 'light';

export const KOKA_INLAY_HINT_CONFIGURATION = {
  settings: {
    koka: {
      languageServer: {
        inlayHints: {
          showImplicitArguments: true,
          showInferredTypes: true,
          showFullQualifiers: false,
        },
      },
    },
  },
} as const;

export interface ConnectKokaLspOptions {
  documentUri: string;
  theme: KokaEditorTheme;
  /** Override the bundled Koka WASI language-server module. */
  wasmUrl?: string | URL;
  /** Override the bundled standard-library/runtime VFS archive. */
  runtimeUrl?: string | URL;
  compilerFlags?: readonly string[];
  /** Maximum UTF-8 JSON body size accepted in either direction. */
  maxMessageBytes?: number;
  verbose?: number;
  signal?: AbortSignal;
  onLog?: (message: string) => void;
  onClose?: () => void;
  onSignatureHelpContext?: () => void;
  /** Return true when diagnostics were applied by the host. */
  onDiagnostics?: (
    documentUri: string,
    diagnostics: readonly KokaLspDiagnostic[],
  ) => boolean | void;
}

export interface KokaLspPosition {
  line: number;
  character: number;
}

export interface KokaLspDiagnostic {
  range: {
    start: KokaLspPosition;
    end: KokaLspPosition;
  };
  message: string;
  severity?: number;
  source?: string;
  code?: string | number;
}

export interface KokaLspConnection {
  readonly client: MonacoLanguageClient;
  setTheme(theme: KokaEditorTheme): Promise<void>;
  dispose(): Promise<void>;
}

type LogMessageParams = { message?: string; type?: number };
type LogTraceParams = { message?: string; verbose?: string };

interface WorkerReadyMessage {
  type: 'ready';
  sharedBuffer: SharedArrayBuffer;
}

interface WorkerLogMessage {
  type: 'log';
  text: string;
}

interface WorkerFatalMessage {
  type: 'fatal';
  error: string;
}

interface WorkerResponseMessage {
  type: 'response';
  message: Message;
}

type LspWorkerMessage =
  | WorkerReadyMessage
  | WorkerLogMessage
  | WorkerFatalMessage
  | WorkerResponseMessage;

const DEFAULT_MAX_MESSAGE_BYTES = 2 * 1024 * 1024;
const MIN_MESSAGE_BYTES = 64 * 1024;
const MAX_MESSAGE_BYTES = 8 * 1024 * 1024;
const WORKER_INITIALIZATION_TIMEOUT_MS = 90_000;
const WRITER_WAIT_TIMEOUT_MS = 12_000;
const SHARED_HEADER_BYTES = 8;
const MAX_PENDING_RESPONSES = 64;

function abortError(): Error {
  const error = new Error('Koka language-server connection was cancelled.');
  error.name = 'AbortError';
  return error;
}

function describeError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function workspaceUriFor(documentUri: string, vscode: typeof import('vscode')): import('vscode').Uri {
  const uri = vscode.Uri.parse(documentUri);
  const path = uri.path.slice(0, Math.max(1, uri.path.lastIndexOf('/')));
  return uri.with({ path, query: '', fragment: '' });
}

class WorkerMessageReader extends AbstractMessageReader implements MessageReader {
  private callback: DataCallback | undefined;
  private readonly pending: Message[] = [];
  private listening = false;
  private closed = false;

  listen(callback: DataCallback): Disposable {
    if (this.listening) throw new Error('Koka LSP message reader can only be listened to once');
    if (this.closed) throw new Error('Koka LSP message reader is closed');
    this.listening = true;
    this.callback = callback;

    for (const message of this.pending.splice(0)) callback(message);

    return Disposable.create(() => {
      this.callback = undefined;
    });
  }

  accept(message: Message): boolean {
    if (this.closed) return false;
    if (this.callback) {
      this.callback(message);
      return true;
    }
    if (this.pending.length >= MAX_PENDING_RESPONSES) {
      return false;
    }
    this.pending.push(message);
    return true;
  }

  reportError(error: unknown): void {
    if (!this.closed) this.fireError(error);
  }

  reportClose(): void {
    if (this.closed) return;
    this.closed = true;
    this.pending.length = 0;
    this.fireClose();
  }

  override dispose(): void {
    this.closed = true;
    this.callback = undefined;
    this.pending.length = 0;
    super.dispose();
  }
}

class SharedBufferMessageWriter extends AbstractMessageWriter implements MessageWriter {
  private readonly encoder = new TextEncoder();
  private state: Int32Array | undefined;
  private bytes: Uint8Array | undefined;
  private writeQueue = Promise.resolve();
  private terminalError: Error | undefined;
  private ended = false;
  private errorCount = 0;

  constructor(
    private readonly maxMessageBytes: number,
    private readonly signal?: AbortSignal,
  ) {
    super();
  }

  attach(sharedBuffer: SharedArrayBuffer): void {
    if (this.state) throw new Error('Koka LSP shared buffer was attached more than once');
    if (sharedBuffer.byteLength <= SHARED_HEADER_BYTES) {
      throw new Error('Koka LSP returned an invalid shared input buffer');
    }
    this.state = new Int32Array(sharedBuffer, 0, 2);
    this.bytes = new Uint8Array(sharedBuffer, SHARED_HEADER_BYTES);
  }

  write(message: Message): Promise<void> {
    const operation = this.writeQueue.then(() => this.writeNow(message));
    this.writeQueue = operation.catch(() => undefined);
    return operation;
  }

  private async writeNow(message: Message): Promise<void> {
    try {
      this.throwIfClosed();
      const state = this.state;
      const destination = this.bytes;
      if (!state || !destination) throw new Error('Koka LSP input buffer is not ready');

      const body = this.encoder.encode(JSON.stringify(message));
      if (body.byteLength > this.maxMessageBytes) {
        throw new Error(
          `Koka LSP request is ${body.byteLength} bytes; limit is ${this.maxMessageBytes}`,
        );
      }

      const header = this.encoder.encode(`Content-Length: ${body.byteLength}\r\n\r\n`);
      const frameLength = header.byteLength + body.byteLength;
      if (frameLength > destination.byteLength) {
        throw new Error(`Koka LSP request frame exceeds shared buffer capacity (${frameLength})`);
      }

      const deadline = performance.now() + WRITER_WAIT_TIMEOUT_MS;
      while (Atomics.load(state, 0) !== 0) {
        this.throwIfClosed();
        if (performance.now() >= deadline) {
          throw new Error('Timed out waiting for the Koka language server to read a request');
        }
        await new Promise<void>((resolve) => window.setTimeout(resolve, 4));
      }

      this.throwIfClosed();
      destination.set(header, 0);
      destination.set(body, header.byteLength);
      Atomics.store(state, 1, frameLength);
      Atomics.store(state, 0, 1);
      Atomics.notify(state, 0);
    } catch (error) {
      const failure = asError(error);
      this.errorCount += 1;
      this.fireError(failure, message, this.errorCount);
      throw failure;
    }
  }

  fail(error: Error): void {
    if (this.terminalError || this.ended) return;
    this.terminalError = error;
    this.fireClose();
  }

  end(): void {
    if (this.ended) return;
    this.ended = true;
    this.fireClose();
  }

  override dispose(): void {
    this.ended = true;
    this.state = undefined;
    this.bytes = undefined;
    super.dispose();
  }

  private throwIfClosed(): void {
    if (this.signal?.aborted) throw abortError();
    if (this.terminalError) throw this.terminalError;
    if (this.ended) throw new Error('Koka LSP message writer is closed');
  }
}

/**
 * Run Koka's WASI language server entirely in a dedicated browser
 * worker. The page must be cross-origin isolated so the WASI process can make
 * blocking stdin reads without blocking Monaco's main thread.
 */
export async function connectKokaLanguageServer(
  options: ConnectKokaLspOptions,
): Promise<KokaLspConnection> {
  if (options.signal?.aborted) throw abortError();
  assertWorkerSupport();

  const maxMessageBytes = integerOption(
    options.maxMessageBytes,
    DEFAULT_MAX_MESSAGE_BYTES,
    MIN_MESSAGE_BYTES,
    MAX_MESSAGE_BYTES,
    'maxMessageBytes',
  );
  const assets = await loadRuntimeAssets(options.runtimeUrl, options.signal);
  if (options.signal?.aborted) throw abortError();

  const wasmUrl = resolvePublicAssetUrl(options.wasmUrl, DEFAULT_LSP_WASM_PATH);
  const worker = new Worker(new URL('../wasm/lsp-worker.ts', import.meta.url), {
    type: 'module',
    name: 'koka-wasm-language-server',
  });
  const reader = new WorkerMessageReader();
  const writer = new SharedBufferMessageWriter(maxMessageBytes, options.signal);

  let client: MonacoLanguageClient | undefined;
  let startupSettled = false;
  let transportClosed = false;
  let transportError: Error | undefined;
  let disposing = false;
  let disposed = false;
  let readyResolve!: () => void;
  let readyReject!: (error: unknown) => void;

  const ready = new Promise<void>((resolve, reject) => {
    readyResolve = resolve;
    readyReject = reject;
  });

  const startupTimer = window.setTimeout(() => {
    failTransport(new Error('Timed out while starting the Koka WASM language server'));
  }, WORKER_INITIALIZATION_TIMEOUT_MS);

  function settleStartup(error?: Error): void {
    if (startupSettled) return;
    startupSettled = true;
    window.clearTimeout(startupTimer);
    if (error) readyReject(error);
    else readyResolve();
  }

  function closeTransport(error?: Error): void {
    if (transportClosed) return;
    transportClosed = true;
    if (error) transportError = error;
    worker.removeEventListener('message', handleWorkerMessage);
    worker.removeEventListener('error', handleWorkerError);
    worker.removeEventListener('messageerror', handleWorkerMessageError);
    worker.terminate();
    if (error) {
      writer.fail(error);
      reader.reportError(error);
    } else {
      writer.end();
    }
    reader.reportClose();
  }

  function failTransport(error: Error): void {
    settleStartup(error);
    closeTransport(error);
  }

  function handleWorkerMessage(event: MessageEvent<unknown>): void {
    let message: LspWorkerMessage;
    try {
      message = parseWorkerMessage(event.data);
    } catch (error) {
      failTransport(asError(error));
      return;
    }

    switch (message.type) {
      case 'ready':
        if (startupSettled) {
          failTransport(new Error('Koka LSP worker sent an unexpected ready message'));
          return;
        }
        try {
          writer.attach(message.sharedBuffer);
          settleStartup();
        } catch (error) {
          failTransport(asError(error));
        }
        break;
      case 'response':
        if (!reader.accept(message.message)) {
          failTransport(new Error('Koka LSP produced too many responses before the client was ready'));
        }
        break;
      case 'log': {
        const text = message.text.trim();
        if (text) options.onLog?.(text);
        break;
      }
      case 'fatal':
        failTransport(new Error(`Koka language server failed: ${message.error}`));
        break;
    }
  }

  function handleWorkerError(event: ErrorEvent): void {
    event.preventDefault();
    failTransport(new Error(event.message || 'The Koka LSP worker crashed'));
  }

  function handleWorkerMessageError(): void {
    failTransport(new Error('The Koka LSP worker returned an unreadable message'));
  }

  let disposeConnection: (() => Promise<void>) | undefined;
  const handleAbort = () => {
    if (disposeConnection) void disposeConnection();
    else failTransport(abortError());
  };

  worker.addEventListener('message', handleWorkerMessage);
  worker.addEventListener('error', handleWorkerError);
  worker.addEventListener('messageerror', handleWorkerMessageError);
  options.signal?.addEventListener('abort', handleAbort, { once: true });

  try {
    try {
      worker.postMessage({
        type: 'init',
        wasmUrl: wasmUrl.href,
        files: [...assets.files],
        compilerFlags: [...(options.compilerFlags ?? DEFAULT_COMPILER_FLAGS)],
        verbose: integerOption(options.verbose, 0, 0, 3, 'verbose'),
        maxMessageBytes,
      });
    } catch (error) {
      failTransport(asError(error));
    }
    await ready;

    // Runtime imports happen only after initializeMonaco() has installed the
    // VS Code services. Importing these modules earlier can create an incomplete
    // standalone service graph.
    const [languageClientModule, languageClientProtocol, vscode] = await Promise.all([
      import('monaco-languageclient'),
      import('vscode-languageclient/browser.js'),
      import('vscode'),
    ]);

    if (options.signal?.aborted) throw abortError();
    if (transportError) throw transportError;

    let starting = true;
    client = new languageClientModule.MonacoLanguageClient({
      id: 'koka',
      name: 'Koka Language Server',
      clientOptions: {
        documentSelector: [{ language: 'koka', scheme: 'file' }],
        workspaceFolder: {
          index: 0,
          name: 'kokaine-playground',
          uri: workspaceUriFor(options.documentUri, vscode),
        },
        markdown: {
          isTrusted: false,
          supportHtml: false,
        },
        errorHandler: {
          error: (error) => {
            options.onLog?.(`[client] ${describeError(error)}`);
            return {
              action: starting
                ? languageClientProtocol.ErrorAction.Shutdown
                : languageClientProtocol.ErrorAction.Continue,
            };
          },
          closed: () => ({ action: languageClientProtocol.CloseAction.DoNotRestart }),
        },
        middleware: {
          handleDiagnostics: (uri, diagnostics, next) => {
            const handled = options.onDiagnostics?.(
              uri.toString(),
              diagnostics as readonly KokaLspDiagnostic[],
            );
            if (handled === true) return;
            next(uri, diagnostics);
          },
          executeCommand: async (command, args, next) => {
            if (command === 'koka/signature-help/set-context') {
              const result = await next(command, args);
              options.onSignatureHelpContext?.();
              return result;
            }
            return next(command, args);
          },
        },
      },
      messageTransports: { reader, writer },
    });

    client.onNotification('window/logMessage', (params: LogMessageParams) => {
      const message = params.message?.trim();
      if (message) options.onLog?.(message);
    });
    client.onNotification('$/logTrace', (params: LogTraceParams) => {
      const message = [params.message, params.verbose].filter(Boolean).join(' ');
      if (message) options.onLog?.(`[trace] ${message}`);
    });

    reader.onError((error) => {
      options.onLog?.(`[transport] ${describeError(error)}`);
    });
    reader.onClose(() => {
      if (!disposing) {
        options.onLog?.('[transport] Koka language server disconnected.');
        options.onClose?.();
      }
    });

    const setTheme = async (theme: KokaEditorTheme): Promise<void> => {
      if (disposed || !client?.isRunning()) return;
      try {
        await client.sendRequest('workspace/executeCommand', {
          command: 'koka/set-colors',
          arguments: [{ mode: theme }],
        });
      } catch (error) {
        // This command was added after the first Koka LSP release, so an older
        // compiler may legitimately not implement it.
        options.onLog?.(`[client] Could not set LSP colors: ${describeError(error)}`);
      }
    };

    const dispose = async (): Promise<void> => {
      if (disposed || disposing) return;
      disposing = true;
      options.signal?.removeEventListener('abort', handleAbort);
      try {
        if (client?.isRunning()) await client.stop();
        await client?.dispose();
      } catch {
        // A terminated worker commonly rejects shutdown; it is already gone.
      } finally {
        disposed = true;
        closeTransport();
        try { reader.dispose(); } catch { /* already disposed */ }
        try { writer.dispose(); } catch { /* already disposed */ }
        disposing = false;
      }
    };
    disposeConnection = dispose;

    await client.start();
    starting = false;
    if (options.signal?.aborted) throw abortError();
    if (transportError) throw transportError;

    // Koka's Config FromJSON instance requires the complete nested object and
    // all three booleans; partial settings are rejected by the compiler.
    await client.sendNotification(
      'workspace/didChangeConfiguration',
      KOKA_INLAY_HINT_CONFIGURATION,
    );
    await setTheme(options.theme);

    // The model already exists, so this resolves it through the initialized VS
    // Code document service and guarantees a textDocument/didOpen notification.
    await vscode.workspace.openTextDocument(vscode.Uri.parse(options.documentUri));

    return { client, setTheme, dispose };
  } catch (error) {
    options.signal?.removeEventListener('abort', handleAbort);
    disposing = true;
    settleStartup(asError(error));
    try {
      if (client?.isRunning()) await client.stop();
      await client?.dispose();
    } catch {
      // The transport may already be unavailable.
    } finally {
      disposed = true;
      closeTransport();
      try { reader.dispose(); } catch { /* already disposed */ }
      try { writer.dispose(); } catch { /* already disposed */ }
      disposing = false;
    }
    throw error;
  }
}

function assertWorkerSupport(): void {
  if (typeof Worker === 'undefined') {
    throw new Error('The Koka language server requires Web Worker support');
  }
  if (typeof SharedArrayBuffer === 'undefined' || globalThis.crossOriginIsolated !== true) {
    throw new Error(
      'The Koka language server requires cross-origin isolation (COOP: same-origin and COEP: require-corp) for SharedArrayBuffer support',
    );
  }
}

function parseWorkerMessage(value: unknown): LspWorkerMessage {
  if (!isRecord(value) || typeof value.type !== 'string') {
    throw new Error('Koka LSP worker returned an invalid message');
  }

  switch (value.type) {
    case 'ready':
      if (!(value.sharedBuffer instanceof SharedArrayBuffer)) {
        throw new Error('Koka LSP worker returned an invalid shared buffer');
      }
      return { type: 'ready', sharedBuffer: value.sharedBuffer };
    case 'log':
      if (typeof value.text !== 'string') throw new Error('Koka LSP worker returned an invalid log');
      return { type: 'log', text: value.text };
    case 'fatal':
      if (typeof value.error !== 'string') {
        throw new Error('Koka LSP worker returned an invalid failure');
      }
      return { type: 'fatal', error: value.error };
    case 'response':
      if (!isJsonRpcMessage(value.message)) {
        throw new Error('Koka LSP worker returned an invalid JSON-RPC response');
      }
      return { type: 'response', message: value.message };
    default:
      throw new Error(`Koka LSP worker returned an unknown message type: ${value.type}`);
  }
}

function isJsonRpcMessage(value: unknown): value is Message {
  return isRecord(value) && value.jsonrpc === '2.0';
}

function integerOption(
  value: number | undefined,
  fallback: number,
  minimum: number,
  maximum: number,
  name: string,
): number {
  const resolved = value ?? fallback;
  if (!Number.isSafeInteger(resolved) || resolved < minimum || resolved > maximum) {
    throw new Error(`${name} must be an integer between ${minimum} and ${maximum}`);
  }
  return resolved;
}

function asError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
