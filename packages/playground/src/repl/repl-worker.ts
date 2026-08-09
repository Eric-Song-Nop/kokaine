/// <reference lib="webworker" />

import {
  ConsoleStdout,
  PreopenDirectory,
  WASI,
  type Directory,
} from '@bjorn3/browser_wasi_shim';

import { parseReplResponse } from './protocol';
import {
  BlockingStdinFile,
  WasiFdStubs,
  createSharedInputBuffer,
  installBlockingStdinPoll,
} from '../wasm/shared-stdin';
import { buildUnifiedTree, collectGeneratedFiles } from '../wasm/wasi-fs';

interface InitRequest {
  readonly type: 'init';
  readonly wasmUrl: string;
  readonly files: [string, string][];
  readonly compilerFlags: string[];
  readonly maxRequestBytes: number;
}

const MAX_REPL_WASM_BYTES = 32 * 1024 * 1024;
const MIN_REQUEST_BYTES = 64 * 1024;
const MAX_REQUEST_BYTES = 8 * 1024 * 1024;
const MAX_RESPONSE_BYTES = 4 * 1024 * 1024;
const MAX_LOG_BYTES = 64 * 1024;
const scope = self as unknown as DedicatedWorkerGlobalScope;
let initialized = false;

scope.onmessage = (event: MessageEvent<InitRequest>) => {
  if (initialized || event.data?.type !== 'init') {
    postFatal('Koka browser REPL Worker received an invalid initialization request');
    return;
  }
  initialized = true;
  void initialize(event.data);
};

async function initialize(request: InitRequest): Promise<void> {
  try {
    const maxRequestBytes = validateRequestLimit(request.maxRequestBytes);
    const response = await fetch(request.wasmUrl, {
      credentials: 'same-origin',
      cache: 'force-cache',
    });
    if (!response.ok) {
      throw new Error(`Failed to load Koka browser REPL (${response.status} ${response.statusText})`);
    }

    const advertisedLength = Number(response.headers.get('content-length') ?? 0);
    if (advertisedLength > MAX_REPL_WASM_BYTES) {
      throw new Error(`Koka browser REPL exceeds ${MAX_REPL_WASM_BYTES} bytes`);
    }
    const wasmBytes = await response.arrayBuffer();
    if (wasmBytes.byteLength > MAX_REPL_WASM_BYTES) {
      throw new Error(`Koka browser REPL exceeds ${MAX_REPL_WASM_BYTES} bytes`);
    }
    assertWasmMagic(new Uint8Array(wasmBytes));

    const module = await WebAssembly.compile(wasmBytes);
    const root = buildUnifiedTree(new Map(request.files));
    const sharedBuffer = createSharedInputBuffer(maxRequestBytes);
    const stdin = new BlockingStdinFile(sharedBuffer, maxRequestBytes);
    const stdout = new ReplStdoutCapture(root);

    const wasi = new WASI(
      ['koka-browser-repl', ...request.compilerFlags],
      [],
      [
        stdin as never,
        stdout as never,
        ConsoleStdout.lineBuffered((line: string) => postLog(line)),
        new PreopenDirectory('/', root.contents),
      ],
      { debug: false },
    );
    installBlockingStdinPoll(wasi, stdin);

    post({ type: 'ready', sharedBuffer });
    const instance = new WebAssembly.Instance(module, {
      wasi_snapshot_preview1: wasi.wasiImport,
    });

    try {
      wasi.start(instance as unknown as {
        exports: { memory: WebAssembly.Memory; _start: () => void };
      });
      throw new Error('Koka browser REPL exited unexpectedly');
    } catch (error) {
      const message = errorMessage(error);
      if (!message.toLowerCase().includes('exit')) throw error;
      throw new Error(`Koka browser REPL exited: ${message}`);
    }
  } catch (error) {
    postFatal(errorMessage(error));
  }
}

class ReplStdoutCapture extends WasiFdStubs {
  private buffer = new Uint8Array();
  private readonly decoder = new TextDecoder('utf-8', { fatal: true });

  constructor(private readonly root: Directory) {
    super();
  }

  override fd_write(data: Uint8Array): { ret: number; nwritten: number } {
    if (data.byteLength === 0) return { ret: 0, nwritten: 0 };
    if (this.buffer.byteLength + data.byteLength > MAX_RESPONSE_BYTES) {
      throw new Error('Koka browser REPL returned an oversized response');
    }

    const joined = new Uint8Array(this.buffer.byteLength + data.byteLength);
    joined.set(this.buffer);
    joined.set(data, this.buffer.byteLength);
    this.buffer = joined;
    this.parseLines();
    return { ret: 0, nwritten: data.byteLength };
  }

  private parseLines(): void {
    while (true) {
      const lineEnd = this.buffer.indexOf(10);
      if (lineEnd < 0) return;
      const contentEnd = lineEnd > 0 && this.buffer[lineEnd - 1] === 13 ? lineEnd - 1 : lineEnd;
      const line = this.decoder.decode(this.buffer.slice(0, contentEnd));
      this.buffer = this.buffer.slice(lineEnd + 1);
      if (line.trim().length === 0) continue;

      const response = parseReplResponse(JSON.parse(line));
      const generatedModules = response.entryPath === null
        ? []
        : Array.from(collectGeneratedFiles(this.root))
          .filter(([path]) => path.endsWith('.mjs'));
      post({ type: 'response', response, generatedModules });
    }
  }
}

function validateRequestLimit(value: number): number {
  if (!Number.isSafeInteger(value) || value < MIN_REQUEST_BYTES || value > MAX_REQUEST_BYTES) {
    throw new Error(
      `Koka browser REPL request limit must be between ${MIN_REQUEST_BYTES} and ${MAX_REQUEST_BYTES}`,
    );
  }
  return value;
}

function assertWasmMagic(bytes: Uint8Array): void {
  if (
    bytes.byteLength < 8
    || bytes[0] !== 0x00
    || bytes[1] !== 0x61
    || bytes[2] !== 0x73
    || bytes[3] !== 0x6d
  ) {
    throw new Error('Koka browser REPL asset is not a WebAssembly module');
  }
}

function post(message: Record<string, unknown>): void {
  scope.postMessage(message);
}

function postLog(value: string): void {
  const encoded = new TextEncoder().encode(value);
  const text = encoded.byteLength <= MAX_LOG_BYTES
    ? value
    : `${new TextDecoder().decode(encoded.slice(0, MAX_LOG_BYTES))}\n[log truncated]`;
  post({ type: 'log', text });
}

function postFatal(error: string): void {
  post({ type: 'fatal', error });
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export {};
