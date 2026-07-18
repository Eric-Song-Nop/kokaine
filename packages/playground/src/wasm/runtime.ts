import {
  DEFAULT_COMPILER_WASM_PATH,
  loadRuntimeAssets,
  resolvePublicAssetUrl,
  type LoadedRuntimeAssets,
} from './assets';
import { normalizeModuleName } from './vfs';

export const DEFAULT_MAX_SOURCE_BYTES = 512 * 1024;
export const DEFAULT_COMPILE_TIMEOUT_MS = 45_000;

export const DEFAULT_COMPILER_FLAGS = [
  '--sharedir=/share',
  '--libdir=/lib',
  '--target=js',
  '--builddir=/.koka',
  '--include=/share/lib',
  '--include=/src',
  '--include=/',
  '--console=ansi',
] as const;

const MAX_CONFIGURED_SOURCE_BYTES = 4 * 1024 * 1024;
const WORKER_INITIALIZATION_TIMEOUT_MS = 90_000;

export interface CompilerLogEvent {
  requestId: number;
  stream: 'status' | 'stderr';
  text: string;
}

export interface BrowserCompilerOptions {
  runtimeUrl?: string | URL;
  wasmUrl?: string | URL;
  maxSourceBytes?: number;
  compileTimeoutMs?: number;
  compilerFlags?: readonly string[];
  signal?: AbortSignal;
  onLog?: (event: CompilerLogEvent) => void;
}

export interface BrowserCompileInput {
  source: string;
  moduleName?: string;
  entryFunction?: string;
  signal?: AbortSignal;
}

export interface BrowserCompileResult {
  requestId: number;
  ok: boolean;
  moduleName: string;
  durationMs: number;
  stdout: string;
  stderr: string;
  /** All compiler outputs, keyed by absolute VFS paths below `/.koka`. */
  generatedFiles: Map<string, string>;
  /** The `.mjs` subset of `generatedFiles`, including the executable wrapper. */
  generatedModules: Map<string, string>;
  error?: string;
}

export interface BrowserCompiler {
  readonly compilerVersion: string;
  readonly upstreamCommit: string;
  readonly maxSourceBytes: number;
  compile(input: BrowserCompileInput): Promise<BrowserCompileResult>;
  dispose(): void;
}

interface PendingCompile {
  requestId: number;
  moduleName: string;
  source: string;
  entryFunction?: string;
  signal?: AbortSignal;
  abortListener?: () => void;
  timeout?: ReturnType<typeof setTimeout>;
  resolve: (result: BrowserCompileResult) => void;
  reject: (error: unknown) => void;
}

interface WorkerReadyMessage {
  type: 'ready';
  requestId: number;
}

interface WorkerLogMessage {
  type: 'log';
  requestId: number;
  stream: 'stderr';
  text: string;
}

interface WorkerFatalMessage {
  type: 'fatal';
  requestId: number;
  error: string;
}

interface WorkerResultMessage {
  type: 'result';
  requestId: number;
  durationMs: number;
  ok: boolean;
  stdout: string;
  stderr: string;
  generatedFiles: [string, string][];
  generatedModules: [string, string][];
  error?: string;
}

type WorkerResponse =
  | WorkerReadyMessage
  | WorkerLogMessage
  | WorkerFatalMessage
  | WorkerResultMessage;

interface InitializationWaiter {
  generation: number;
  timer: ReturnType<typeof setTimeout>;
  resolve: () => void;
  reject: (error: unknown) => void;
}

export async function createBrowserCompiler(
  options: BrowserCompilerOptions = {},
): Promise<BrowserCompiler> {
  if (typeof Worker === 'undefined') {
    throw new Error('The Koka browser compiler requires Web Worker support');
  }

  const assets = await loadRuntimeAssets(options.runtimeUrl, options.signal);
  const compiler = new BrowserCompilerRuntime(assets, options);

  try {
    await compiler.initialize();
    return compiler;
  } catch (error) {
    compiler.dispose();
    throw error;
  }
}

class BrowserCompilerRuntime implements BrowserCompiler {
  readonly compilerVersion: string;
  readonly upstreamCommit: string;
  readonly maxSourceBytes: number;

  private readonly assets: LoadedRuntimeAssets;
  private readonly wasmUrl: URL;
  private readonly compilerFlags: string[];
  private readonly compileTimeoutMs: number;
  private readonly onLog?: (event: CompilerLogEvent) => void;
  private readonly queue: PendingCompile[] = [];
  private readonly sourceEncoder = new TextEncoder();

  private worker: Worker | null = null;
  private generation = 0;
  private nextRequestId = 1;
  private active: PendingCompile | null = null;
  private initializationWaiter: InitializationWaiter | null = null;
  private restarting = false;
  private disposed = false;

  constructor(assets: LoadedRuntimeAssets, options: BrowserCompilerOptions) {
    this.assets = assets;
    this.compilerVersion = assets.compilerVersion;
    this.upstreamCommit = assets.upstreamCommit;
    this.maxSourceBytes = validIntegerOption(
      options.maxSourceBytes,
      DEFAULT_MAX_SOURCE_BYTES,
      1,
      MAX_CONFIGURED_SOURCE_BYTES,
      'maxSourceBytes',
    );
    this.compileTimeoutMs = validIntegerOption(
      options.compileTimeoutMs,
      DEFAULT_COMPILE_TIMEOUT_MS,
      1_000,
      10 * 60_000,
      'compileTimeoutMs',
    );
    this.compilerFlags = [...(options.compilerFlags ?? DEFAULT_COMPILER_FLAGS)];
    this.wasmUrl = resolvePublicAssetUrl(options.wasmUrl, DEFAULT_COMPILER_WASM_PATH);
    this.onLog = options.onLog;
  }

  async initialize(): Promise<void> {
    if (this.disposed) throw new Error('The Koka browser compiler is disposed');
    await this.startWorker();
    this.emitLog({
      requestId: 0,
      stream: 'status',
      text: `Koka ${this.compilerVersion} browser compiler ready`,
    });
  }

  compile(input: BrowserCompileInput): Promise<BrowserCompileResult> {
    if (this.disposed) {
      return Promise.reject(new Error('The Koka browser compiler is disposed'));
    }
    if (input.signal?.aborted) return Promise.reject(abortError());

    const sourceBytes = this.sourceEncoder.encode(input.source).byteLength;
    if (sourceBytes > this.maxSourceBytes) {
      return Promise.reject(new RangeError(
        `Koka source is ${sourceBytes} bytes; the limit is ${this.maxSourceBytes} bytes`,
      ));
    }

    let moduleName: string;
    try {
      moduleName = normalizeModuleName(input.moduleName ?? deriveModuleName(input.source));
      validateEntryFunction(input.entryFunction);
    } catch (error) {
      return Promise.reject(error);
    }

    return new Promise<BrowserCompileResult>((resolve, reject) => {
      const pending: PendingCompile = {
        requestId: this.nextRequestId++,
        moduleName,
        source: input.source,
        entryFunction: input.entryFunction,
        signal: input.signal,
        resolve,
        reject,
      };

      if (input.signal) {
        pending.abortListener = () => this.abortPending(pending);
        input.signal.addEventListener('abort', pending.abortListener, { once: true });
      }

      this.queue.push(pending);
      this.pump();
    });
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.restarting = false;

    this.worker?.terminate();
    this.worker = null;
    this.rejectInitialization(new Error('The Koka browser compiler was disposed'));

    if (this.active) {
      const active = this.active;
      this.active = null;
      this.cleanupPending(active);
      active.reject(new Error('The Koka browser compiler was disposed'));
    }

    this.rejectQueue(new Error('The Koka browser compiler was disposed'));
  }

  private startWorker(): Promise<void> {
    const worker = new Worker(new URL('./compiler-worker.ts', import.meta.url), {
      type: 'module',
      name: 'koka-browser-compiler',
    });
    const generation = ++this.generation;
    this.worker = worker;

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      if (generation !== this.generation || worker !== this.worker) return;
      this.handleWorkerMessage(event.data, generation);
    };
    worker.onerror = (event: ErrorEvent) => {
      if (generation !== this.generation || worker !== this.worker) return;
      event.preventDefault();
      this.handleWorkerFailure(new Error(event.message || 'Koka compiler worker crashed'));
    };
    worker.onmessageerror = () => {
      if (generation !== this.generation || worker !== this.worker) return;
      this.handleWorkerFailure(new Error('Koka compiler worker sent an unreadable message'));
    };

    return new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => {
        if (this.initializationWaiter?.generation !== generation) return;
        this.initializationWaiter = null;
        worker.terminate();
        if (this.worker === worker) this.worker = null;
        reject(new Error('Timed out while loading the Koka WebAssembly compiler'));
      }, WORKER_INITIALIZATION_TIMEOUT_MS);

      this.initializationWaiter = { generation, timer, resolve, reject };
      worker.postMessage({
        type: 'init',
        requestId: 0,
        wasmUrl: this.wasmUrl.href,
        files: Array.from(this.assets.files),
        compilerFlags: this.compilerFlags,
        maxSourceBytes: this.maxSourceBytes,
      });
    });
  }

  private handleWorkerMessage(message: WorkerResponse, generation: number): void {
    if (message.type === 'ready') {
      const waiter = this.initializationWaiter;
      if (!waiter || waiter.generation !== generation) return;
      clearTimeout(waiter.timer);
      this.initializationWaiter = null;
      waiter.resolve();
      return;
    }

    if (message.type === 'fatal') {
      this.handleWorkerFailure(new Error(message.error));
      return;
    }

    if (message.type === 'log') {
      this.emitLog(message);
      return;
    }

    const active = this.active;
    if (!active || active.requestId !== message.requestId) return;

    this.active = null;
    this.cleanupPending(active);
    active.resolve({
      requestId: message.requestId,
      ok: message.ok,
      moduleName: active.moduleName,
      durationMs: message.durationMs,
      stdout: message.stdout,
      stderr: message.stderr,
      generatedFiles: new Map(message.generatedFiles),
      generatedModules: new Map(message.generatedModules),
      error: message.error,
    });
    this.pump();
  }

  private handleWorkerFailure(error: Error): void {
    const waiter = this.initializationWaiter;
    if (waiter) {
      clearTimeout(waiter.timer);
      this.initializationWaiter = null;
      waiter.reject(error);
      return;
    }

    if (this.active) {
      const active = this.active;
      this.active = null;
      this.cleanupPending(active);
      active.reject(error);
    }

    void this.restartWorker(error);
  }

  private pump(): void {
    if (this.disposed || this.restarting || this.active || !this.worker) return;

    const pending = this.queue.shift();
    if (!pending) return;
    if (pending.signal?.aborted) {
      this.cleanupPending(pending);
      pending.reject(abortError());
      this.pump();
      return;
    }

    this.active = pending;
    pending.timeout = setTimeout(() => {
      if (this.active !== pending) return;
      this.active = null;
      this.cleanupPending(pending);
      pending.reject(new Error(`Koka compilation timed out after ${this.compileTimeoutMs}ms`));
      void this.restartWorker();
    }, this.compileTimeoutMs);

    this.worker.postMessage({
      type: 'compile',
      requestId: pending.requestId,
      moduleName: pending.moduleName,
      source: pending.source,
      entryFunction: pending.entryFunction,
    });
  }

  private abortPending(pending: PendingCompile): void {
    if (this.active === pending) {
      this.active = null;
      this.cleanupPending(pending);
      pending.reject(abortError());
      void this.restartWorker();
      return;
    }

    const queueIndex = this.queue.indexOf(pending);
    if (queueIndex >= 0) this.queue.splice(queueIndex, 1);
    this.cleanupPending(pending);
    pending.reject(abortError());
  }

  private async restartWorker(cause?: Error): Promise<void> {
    if (this.disposed || this.restarting) return;
    this.restarting = true;
    this.terminateCurrentWorker();

    if (cause) {
      this.emitLog({ requestId: 0, stream: 'status', text: cause.message });
    }

    try {
      await this.startWorker();
      if (this.disposed) return;
      this.restarting = false;
      this.pump();
    } catch (error) {
      this.terminateCurrentWorker();
      this.restarting = false;
      this.rejectQueue(new Error('Failed to restart the Koka compiler worker', { cause: error }));
    }
  }

  private terminateCurrentWorker(): void {
    const worker = this.worker;
    this.worker = null;
    worker?.terminate();
  }

  private emitLog(event: CompilerLogEvent): void {
    try {
      this.onLog?.(event);
    } catch {
      // An application logger must not be able to break compiler lifecycle handling.
    }
  }

  private cleanupPending(pending: PendingCompile): void {
    if (pending.timeout) clearTimeout(pending.timeout);
    if (pending.signal && pending.abortListener) {
      pending.signal.removeEventListener('abort', pending.abortListener);
    }
  }

  private rejectInitialization(error: Error): void {
    const waiter = this.initializationWaiter;
    if (!waiter) return;
    clearTimeout(waiter.timer);
    this.initializationWaiter = null;
    waiter.reject(error);
  }

  private rejectQueue(error: Error): void {
    for (const pending of this.queue.splice(0)) {
      this.cleanupPending(pending);
      pending.reject(error);
    }
  }
}

function deriveModuleName(source: string): string {
  const declaration = source.match(/^\s*module\s+([A-Za-z][A-Za-z0-9_./-]*)/m);
  return declaration?.[1] ?? 'playground';
}

function validateEntryFunction(entryFunction: string | undefined): void {
  if (entryFunction === undefined) return;
  const parts = entryFunction.split('/');
  if (parts.some((part) => !/^[A-Za-z][A-Za-z0-9_-]*$/.test(part))) {
    throw new Error(`Invalid Koka entry function: ${entryFunction}`);
  }
}

function validIntegerOption(
  supplied: number | undefined,
  fallback: number,
  minimum: number,
  maximum: number,
  name: string,
): number {
  const value = supplied ?? fallback;
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw new RangeError(`${name} must be an integer from ${minimum} to ${maximum}`);
  }
  return value;
}

function abortError(): DOMException {
  return new DOMException('Koka compilation was cancelled', 'AbortError');
}
