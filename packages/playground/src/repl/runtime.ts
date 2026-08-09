import type { ProjectSnapshot } from '../project/project-fs';
import {
  DEFAULT_REPL_WASM_PATH,
  loadRuntimeAssets,
  resolvePublicAssetUrl,
  type LoadedRuntimeAssets,
} from '../wasm/assets';
import { DEFAULT_COMPILER_FLAGS } from '../wasm/runtime';
import { SHARED_INPUT_HEADER_BYTES } from '../wasm/shared-stdin';
import {
  createOpenSessionRequest,
  createReloadProjectRequest,
  createResetSessionRequest,
  createSubmitLineRequest,
  encodeReplRequest,
  parseReplResponse,
  type ReplRequest,
  type ReplResponse,
} from './protocol';

export interface BrowserReplLog {
  readonly stream: 'stderr' | 'status';
  readonly text: string;
}

export interface BrowserReplResult {
  readonly response: ReplResponse;
  readonly generatedModules: ReadonlyMap<string, string>;
  readonly durationMs: number;
}

export interface BrowserReplOptions {
  readonly wasmUrl?: string | URL;
  readonly runtimeUrl?: string | URL;
  readonly compilerFlags?: readonly string[];
  readonly maxRequestBytes?: number;
  readonly requestTimeoutMs?: number;
  readonly onLog?: (log: BrowserReplLog) => void;
}

export interface BrowserRepl {
  readonly compilerVersion: string;
  open(project: ProjectSnapshot, signal?: AbortSignal): Promise<BrowserReplResult>;
  reload(project: ProjectSnapshot, signal?: AbortSignal): Promise<BrowserReplResult>;
  submit(line: string, signal?: AbortSignal): Promise<BrowserReplResult>;
  reset(signal?: AbortSignal): Promise<BrowserReplResult>;
  dispose(): void;
}

interface ReadyMessage {
  readonly type: 'ready';
  readonly sharedBuffer: SharedArrayBuffer;
}

interface ResponseMessage {
  readonly type: 'response';
  readonly response: unknown;
  readonly generatedModules: unknown;
}

interface WorkerLogMessage {
  readonly type: 'log';
  readonly text: string;
}

interface FatalMessage {
  readonly type: 'fatal';
  readonly error: string;
}

interface PendingRequest {
  readonly id: number;
  readonly startedAt: number;
  readonly resolve: (result: BrowserReplResult) => void;
  readonly reject: (error: Error) => void;
  readonly timer: ReturnType<typeof setTimeout>;
  readonly abortSignal?: AbortSignal;
  readonly abortListener?: () => void;
}

const DEFAULT_MAX_REQUEST_BYTES = 8 * 1024 * 1024;
const DEFAULT_REQUEST_TIMEOUT_MS = 120_000;
const READY_TIMEOUT_MS = 30_000;
const WRITER_WAIT_TIMEOUT_MS = 5_000;

export async function createBrowserRepl(options: BrowserReplOptions = {}): Promise<BrowserRepl> {
  if (typeof SharedArrayBuffer === 'undefined' || !globalThis.crossOriginIsolated) {
    throw new Error('The Koka browser REPL requires cross-origin isolation');
  }
  const assets = await loadRuntimeAssets(options.runtimeUrl);
  const runtime = new BrowserReplRuntime(assets, options);
  await runtime.initialize();
  return runtime;
}

class BrowserReplRuntime implements BrowserRepl {
  readonly compilerVersion: string;

  private readonly wasmUrl: URL;
  private readonly compilerFlags: readonly string[];
  private readonly maxRequestBytes: number;
  private readonly requestTimeoutMs: number;
  private worker: Worker | undefined;
  private sharedBuffer: SharedArrayBuffer | undefined;
  private initializePromise: Promise<void> | undefined;
  private initializeResolve: (() => void) | undefined;
  private initializeReject: ((error: Error) => void) | undefined;
  private initializeTimer: ReturnType<typeof setTimeout> | undefined;
  private pending: PendingRequest | undefined;
  private queue = Promise.resolve();
  private nextRequestId = 1;
  private project: ProjectSnapshot | undefined;
  private loadedRevision: number | undefined;
  private disposed = false;

  constructor(
    private readonly assets: LoadedRuntimeAssets,
    private readonly options: BrowserReplOptions,
  ) {
    this.compilerVersion = assets.compilerVersion;
    this.wasmUrl = resolvePublicAssetUrl(options.wasmUrl, DEFAULT_REPL_WASM_PATH);
    this.compilerFlags = options.compilerFlags ?? DEFAULT_COMPILER_FLAGS;
    this.maxRequestBytes = boundedInteger(
      options.maxRequestBytes,
      DEFAULT_MAX_REQUEST_BYTES,
      64 * 1024,
      8 * 1024 * 1024,
      'request byte limit',
    );
    this.requestTimeoutMs = boundedInteger(
      options.requestTimeoutMs,
      DEFAULT_REQUEST_TIMEOUT_MS,
      1_000,
      5 * 60_000,
      'request timeout',
    );
  }

  initialize(): Promise<void> {
    return this.ensureWorker();
  }

  open(project: ProjectSnapshot, signal?: AbortSignal): Promise<BrowserReplResult> {
    const snapshot = cloneProject(project);
    return this.enqueue(async () => {
      this.project = snapshot;
      this.loadedRevision = undefined;
      const result = await this.send(createOpenSessionRequest(this.takeRequestId(), snapshot), signal);
      if (result.response.success) this.loadedRevision = snapshot.revision;
      return result;
    });
  }

  reload(project: ProjectSnapshot, signal?: AbortSignal): Promise<BrowserReplResult> {
    const snapshot = cloneProject(project);
    return this.enqueue(async () => {
      this.project = snapshot;
      const method = this.loadedRevision === undefined
        ? createOpenSessionRequest(this.takeRequestId(), snapshot)
        : createReloadProjectRequest(this.takeRequestId(), snapshot);
      const result = await this.send(method, signal);
      if (result.response.success) this.loadedRevision = snapshot.revision;
      return result;
    });
  }

  submit(line: string, signal?: AbortSignal): Promise<BrowserReplResult> {
    return this.enqueue(async () => {
      await this.ensureProjectLoaded(signal);
      return this.send(createSubmitLineRequest(this.takeRequestId(), line), signal);
    });
  }

  reset(signal?: AbortSignal): Promise<BrowserReplResult> {
    return this.enqueue(async () => {
      const result = await this.send(createResetSessionRequest(this.takeRequestId()), signal);
      this.loadedRevision = result.response.success && this.project
        ? this.project.revision
        : undefined;
      return result;
    });
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.stopWorker(new Error('The Koka browser REPL was disposed'));
  }

  private enqueue<T>(operation: () => Promise<T>): Promise<T> {
    if (this.disposed) return Promise.reject(new Error('The Koka browser REPL was disposed'));
    const result = this.queue.then(operation);
    this.queue = result.then(() => undefined, () => undefined);
    return result;
  }

  private async ensureProjectLoaded(signal?: AbortSignal): Promise<void> {
    if (this.loadedRevision !== undefined) return;
    if (!this.project) throw new Error('Open a Koka project before submitting REPL input');
    const result = await this.send(
      createOpenSessionRequest(this.takeRequestId(), this.project),
      signal,
    );
    if (!result.response.success) {
      throw new Error(result.response.error ?? 'The Koka browser REPL rejected the project');
    }
    this.loadedRevision = this.project.revision;
  }

  private async send(request: ReplRequest, signal?: AbortSignal): Promise<BrowserReplResult> {
    if (signal?.aborted) throw abortError();
    await this.ensureWorker();
    if (this.pending) throw new Error('The Koka browser REPL already has an active request');

    const frame = encodeReplRequest(request);
    if (frame.byteLength > this.maxRequestBytes) {
      throw new RangeError(
        `Koka browser REPL request is ${frame.byteLength} bytes; limit is ${this.maxRequestBytes}`,
      );
    }

    const result = new Promise<BrowserReplResult>((resolve, reject) => {
      const timer = setTimeout(() => {
        const error = new Error(`Koka browser REPL request timed out after ${this.requestTimeoutMs}ms`);
        this.stopWorker(error);
      }, this.requestTimeoutMs);
      const abortListener = signal ? () => this.stopWorker(abortError()) : undefined;
      const pending: PendingRequest = {
        id: request.id,
        startedAt: performance.now(),
        resolve,
        reject,
        timer,
        abortSignal: signal,
        abortListener,
      };
      this.pending = pending;
      if (signal && abortListener) {
        signal.addEventListener('abort', abortListener, { once: true });
        if (signal.aborted) abortListener();
      }
    });

    try {
      await this.writeFrame(frame);
    } catch (error) {
      this.stopWorker(asError(error));
    }
    return result;
  }

  private async writeFrame(frame: Uint8Array): Promise<void> {
    const sharedBuffer = this.sharedBuffer;
    if (!sharedBuffer) throw new Error('Koka browser REPL input is not ready');
    const state = new Int32Array(sharedBuffer, 0, 2);
    const destination = new Uint8Array(sharedBuffer, SHARED_INPUT_HEADER_BYTES);
    if (frame.byteLength > destination.byteLength) {
      throw new Error('Koka browser REPL request exceeds the shared input buffer');
    }

    const deadline = performance.now() + WRITER_WAIT_TIMEOUT_MS;
    while (Atomics.load(state, 0) !== 0) {
      if (performance.now() >= deadline) {
        throw new Error('Timed out waiting for the Koka browser REPL to read a request');
      }
      await new Promise<void>((resolve) => globalThis.setTimeout(resolve, 4));
    }
    destination.set(frame);
    Atomics.store(state, 1, frame.byteLength);
    Atomics.store(state, 0, 1);
    Atomics.notify(state, 0);
  }

  private ensureWorker(): Promise<void> {
    if (this.disposed) return Promise.reject(new Error('The Koka browser REPL was disposed'));
    if (this.sharedBuffer && this.worker) return Promise.resolve();
    if (this.initializePromise) return this.initializePromise;

    const worker = new Worker(new URL('./repl-worker.ts', import.meta.url), {
      type: 'module',
      name: 'koka-browser-repl',
    });
    this.worker = worker;
    worker.addEventListener('message', this.handleWorkerMessage);
    worker.addEventListener('error', this.handleWorkerError);
    worker.addEventListener('messageerror', this.handleWorkerMessageError);

    this.initializePromise = new Promise<void>((resolve, reject) => {
      this.initializeResolve = resolve;
      this.initializeReject = reject;
      this.initializeTimer = setTimeout(() => {
        this.stopWorker(new Error('Timed out while loading the Koka browser REPL'));
      }, READY_TIMEOUT_MS);
    });
    worker.postMessage({
      type: 'init',
      wasmUrl: this.wasmUrl.href,
      files: Array.from(this.assets.files),
      compilerFlags: [...this.compilerFlags],
      maxRequestBytes: this.maxRequestBytes,
    });
    return this.initializePromise;
  }

  private readonly handleWorkerMessage = (event: MessageEvent<unknown>): void => {
    const message = recordValue(event.data);
    if (!message) return;
    if (message.type === 'ready') {
      this.handleReady(message as unknown as ReadyMessage);
      return;
    }
    if (message.type === 'response') {
      this.handleResponse(message as unknown as ResponseMessage);
      return;
    }
    if (message.type === 'log' && typeof message.text === 'string') {
      this.options.onLog?.({ stream: 'stderr', text: message.text });
      return;
    }
    if (message.type === 'fatal' && typeof message.error === 'string') {
      this.stopWorker(new Error(message.error));
    }
  };

  private readonly handleWorkerError = (event: ErrorEvent): void => {
    this.stopWorker(event.error instanceof Error ? event.error : new Error(event.message));
  };

  private readonly handleWorkerMessageError = (): void => {
    this.stopWorker(new Error('The Koka browser REPL returned an unreadable message'));
  };

  private handleReady(message: ReadyMessage): void {
    if (!(message.sharedBuffer instanceof SharedArrayBuffer)) {
      this.stopWorker(new Error('The Koka browser REPL returned an invalid input buffer'));
      return;
    }
    if (message.sharedBuffer.byteLength < SHARED_INPUT_HEADER_BYTES + this.maxRequestBytes) {
      this.stopWorker(new Error('The Koka browser REPL returned an undersized input buffer'));
      return;
    }
    this.sharedBuffer = message.sharedBuffer;
    clearTimeout(this.initializeTimer);
    this.initializeTimer = undefined;
    const resolve = this.initializeResolve;
    this.initializeResolve = undefined;
    this.initializeReject = undefined;
    resolve?.();
    this.options.onLog?.({
      stream: 'status',
      text: `Koka ${this.compilerVersion} browser REPL ready`,
    });
  }

  private handleResponse(message: ResponseMessage): void {
    const pending = this.pending;
    if (!pending) {
      this.stopWorker(new Error('The Koka browser REPL returned an unsolicited response'));
      return;
    }

    try {
      const response = parseReplResponse(message.response);
      if (response.id !== pending.id) {
        throw new Error(
          `Koka browser REPL response id ${response.id} does not match request ${pending.id}`,
        );
      }
      const generatedModules = parseGeneratedModules(message.generatedModules);
      this.pending = undefined;
      cleanupPending(pending);
      pending.resolve({
        response,
        generatedModules,
        durationMs: performance.now() - pending.startedAt,
      });
    } catch (error) {
      this.stopWorker(asError(error));
    }
  }

  private stopWorker(error: Error): void {
    const worker = this.worker;
    if (worker) {
      worker.removeEventListener('message', this.handleWorkerMessage);
      worker.removeEventListener('error', this.handleWorkerError);
      worker.removeEventListener('messageerror', this.handleWorkerMessageError);
      worker.terminate();
    }
    this.worker = undefined;
    this.sharedBuffer = undefined;
    this.loadedRevision = undefined;

    clearTimeout(this.initializeTimer);
    this.initializeTimer = undefined;
    const rejectInitialization = this.initializeReject;
    this.initializeResolve = undefined;
    this.initializeReject = undefined;
    this.initializePromise = undefined;
    rejectInitialization?.(error);

    const pending = this.pending;
    this.pending = undefined;
    if (pending) {
      cleanupPending(pending);
      pending.reject(error);
    }
  }

  private takeRequestId(): number {
    const id = this.nextRequestId;
    this.nextRequestId += 1;
    if (!Number.isSafeInteger(this.nextRequestId)) this.nextRequestId = 1;
    return id;
  }
}

function parseGeneratedModules(value: unknown): ReadonlyMap<string, string> {
  if (!Array.isArray(value)) throw new Error('Koka browser REPL returned invalid generated modules');
  const modules = new Map<string, string>();
  for (const entry of value) {
    if (
      !Array.isArray(entry)
      || entry.length !== 2
      || typeof entry[0] !== 'string'
      || typeof entry[1] !== 'string'
      || !entry[0].startsWith('/')
      || !entry[0].endsWith('.mjs')
      || modules.has(entry[0])
    ) {
      throw new Error('Koka browser REPL returned an invalid generated module');
    }
    modules.set(entry[0], entry[1]);
  }
  return modules;
}

function cloneProject(project: ProjectSnapshot): ProjectSnapshot {
  return {
    schemaVersion: project.schemaVersion,
    projectId: project.projectId,
    revision: project.revision,
    entryModule: project.entryModule,
    directories: [...project.directories],
    files: { ...project.files },
  };
}

function cleanupPending(pending: PendingRequest): void {
  clearTimeout(pending.timer);
  if (pending.abortSignal && pending.abortListener) {
    pending.abortSignal.removeEventListener('abort', pending.abortListener);
  }
}

function boundedInteger(
  supplied: number | undefined,
  fallback: number,
  minimum: number,
  maximum: number,
  name: string,
): number {
  const value = supplied ?? fallback;
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw new RangeError(`Koka browser REPL ${name} must be between ${minimum} and ${maximum}`);
  }
  return value;
}

function recordValue(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

function abortError(): DOMException {
  return new DOMException('The Koka browser REPL request was aborted', 'AbortError');
}

function asError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}
