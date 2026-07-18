/**
 * Koka's WASI language server, isolated in a dedicated browser worker.
 *
 * JSON-RPC requests arrive through a bounded SharedArrayBuffer because the
 * WASI process performs blocking reads on stdin. Responses are parsed from
 * stdout as bytes so LSP Content-Length remains correct for non-ASCII source.
 */

/// <reference lib="webworker" />

import {
  ConsoleStdout,
  PreopenDirectory,
  WASI,
} from '@bjorn3/browser_wasi_shim';

import { buildUnifiedTree } from './wasi-fs';

interface InitRequest {
  type: 'init';
  wasmUrl: string;
  files: [string, string][];
  compilerFlags: string[];
  verbose: number;
  maxMessageBytes: number;
}

interface ReadyMessage {
  type: 'ready';
  sharedBuffer: SharedArrayBuffer;
}

interface LogMessage {
  type: 'log';
  text: string;
}

interface FatalMessage {
  type: 'fatal';
  error: string;
}

interface ResponseMessage {
  type: 'response';
  message: Record<string, unknown>;
}

type WorkerResponse = ReadyMessage | LogMessage | FatalMessage | ResponseMessage;

const MAX_LSP_WASM_BYTES = 32 * 1024 * 1024;
const MIN_MESSAGE_BYTES = 64 * 1024;
const MAX_MESSAGE_BYTES = 8 * 1024 * 1024;
const MAX_HEADER_BYTES = 8 * 1024;
const SHARED_HEADER_BYTES = 8;
const SHARED_FRAME_OVERHEAD_BYTES = 256;
const MAX_LOG_BYTES = 64 * 1024;
const HEADER_TERMINATOR = new Uint8Array([13, 10, 13, 10]);
const scope = self as unknown as DedicatedWorkerGlobalScope;

let initialized = false;

scope.onmessage = (event: MessageEvent<InitRequest>) => {
  if (initialized || event.data?.type !== 'init') {
    postFatal('Koka LSP worker received an invalid initialization request');
    return;
  }
  initialized = true;
  void initialize(event.data);
};

async function initialize(request: InitRequest): Promise<void> {
  try {
    const maxMessageBytes = validateMessageLimit(request.maxMessageBytes);
    const response = await fetch(request.wasmUrl, {
      credentials: 'same-origin',
      cache: 'force-cache',
    });
    if (!response.ok) {
      throw new Error(`Failed to load Koka LSP (${response.status} ${response.statusText})`);
    }

    const advertisedLength = Number(response.headers.get('content-length') ?? 0);
    if (advertisedLength > MAX_LSP_WASM_BYTES) {
      throw new Error(`Koka LSP exceeds ${MAX_LSP_WASM_BYTES} bytes`);
    }

    const wasmBytes = await response.arrayBuffer();
    if (wasmBytes.byteLength > MAX_LSP_WASM_BYTES) {
      throw new Error(`Koka LSP exceeds ${MAX_LSP_WASM_BYTES} bytes`);
    }
    assertWasmMagic(new Uint8Array(wasmBytes));

    const module = await WebAssembly.compile(wasmBytes);
    const root = buildUnifiedTree(new Map(request.files));
    const sharedBuffer = new SharedArrayBuffer(
      SHARED_HEADER_BYTES + maxMessageBytes + SHARED_FRAME_OVERHEAD_BYTES,
    );
    const stdin = new BlockingStdinFile(sharedBuffer, maxMessageBytes);
    const stdout = new LspStdoutCapture(maxMessageBytes);

    const wasi = new WASI(
      [
        'koka-lsp',
        '--language-server',
        '--lsstdio',
        ...request.compilerFlags,
        `-v${normalizeVerbosity(request.verbose)}`,
      ],
      [],
      [
        stdin as never,
        stdout as never,
        ConsoleStdout.lineBuffered((line: string) => postLog(line)),
        new PreopenDirectory('/', root.contents),
      ],
      { debug: false },
    );

    post({ type: 'ready', sharedBuffer });

    const instance = new WebAssembly.Instance(module, {
      wasi_snapshot_preview1: wasi.wasiImport,
    });

    try {
      wasi.start(instance as unknown as {
        exports: { memory: WebAssembly.Memory; _start: () => void };
      });
      throw new Error('Koka language server exited unexpectedly');
    } catch (error) {
      const message = errorMessage(error);
      if (!message.toLowerCase().includes('exit')) throw error;
      throw new Error(`Koka language server exited: ${message}`);
    }
  } catch (error) {
    postFatal(errorMessage(error));
  }
}

/** Minimal fd surface required by browser_wasi_shim. */
class WasiFdStubs {
  fd_fdstat_get() { return { ret: 0, fdstat: null }; }
  fd_close() { return 0; }
  fd_read(_length: number): { ret: number; data: Uint8Array<ArrayBufferLike> } {
    return { ret: 8, data: new Uint8Array() };
  }
  fd_write(_data: Uint8Array) { return { ret: 8, nwritten: 0 }; }
  fd_seek(_offset: bigint, _whence: number) { return { ret: 8, offset: 0n }; }
  fd_tell() { return { ret: 0, offset: 0n }; }
  fd_sync() { return 0; }
  fd_filestat_get() { return { ret: 0, filestat: null }; }
  fd_pread(_length: number, _offset: bigint) {
    return { ret: 8, data: new Uint8Array() };
  }
  fd_pwrite(_data: Uint8Array, _offset: bigint) { return { ret: 8, nwritten: 0 }; }
  fd_allocate(_offset: bigint, _length: bigint) { return 0; }
  fd_fdstat_set_flags(_flags: number) { return 0; }
  fd_fdstat_set_rights(_base: bigint, _inheriting: bigint) { return 0; }
  fd_filestat_set_size(_size: bigint) { return 0; }
  fd_filestat_set_times(_access: bigint, _modified: bigint, _flags: number) { return 0; }
  fd_prestat_get() { return { ret: 8, prestat: null }; }
  fd_readdir_single(_cookie: bigint) { return { ret: 8, dirent: null }; }
  path_create_directory(_path: string) { return 8; }
  path_filestat_get(_flags: number, _path: string) { return { ret: 8, filestat: null }; }
  path_filestat_set_times(
    _flags: number,
    _path: string,
    _access: bigint,
    _modified: bigint,
    _timeFlags: number,
  ) { return 8; }
  path_lookup(_path: string, _flags: number) { return { ret: 8, inode_obj: null }; }
  path_link(_path: string, _inode: unknown, _force: boolean) { return 8; }
  path_open(..._arguments: unknown[]) { return { ret: 8, fd_obj: null }; }
  path_readlink(_path: string) { return { ret: 8, data: null }; }
  path_remove_directory(_path: string) { return 8; }
  path_unlink(_path: string) { return { ret: 8, inode_obj: null }; }
  path_unlink_file(_path: string) { return 8; }
}

class BlockingStdinFile extends WasiFdStubs {
  private readonly state: Int32Array;
  private readonly bytes: Uint8Array;
  private pending = new Uint8Array();
  private offset = 0;

  constructor(sharedBuffer: SharedArrayBuffer, private readonly maxMessageBytes: number) {
    super();
    this.state = new Int32Array(sharedBuffer, 0, 2);
    this.bytes = new Uint8Array(sharedBuffer, SHARED_HEADER_BYTES);
  }

  override fd_read(length: number): { ret: number; data: Uint8Array<ArrayBufferLike> } {
    if (!Number.isSafeInteger(length) || length <= 0) {
      return { ret: 0, data: new Uint8Array() };
    }

    if (this.offset < this.pending.byteLength) return this.readPending(length);

    let flag = Atomics.load(this.state, 0);
    if (flag !== 1) {
      // Koka's WASI runtime multiplexes server work on one worker. A short
      // wait mirrors upstream and yields back to that runtime between reads.
      Atomics.wait(this.state, 0, 0, 10);
      flag = Atomics.load(this.state, 0);
      if (flag !== 1) return { ret: 0, data: new Uint8Array() };
    }

    const dataLength = Atomics.load(this.state, 1);
    if (
      !Number.isSafeInteger(dataLength) ||
      dataLength <= 0 ||
      dataLength > this.maxMessageBytes + SHARED_FRAME_OVERHEAD_BYTES ||
      dataLength > this.bytes.byteLength
    ) {
      Atomics.store(this.state, 1, 0);
      Atomics.store(this.state, 0, 0);
      Atomics.notify(this.state, 0);
      throw new Error(`Invalid Koka LSP stdin frame length: ${dataLength}`);
    }

    this.pending = this.bytes.slice(0, dataLength);
    this.offset = 0;
    Atomics.store(this.state, 1, 0);
    Atomics.store(this.state, 0, 0);
    Atomics.notify(this.state, 0);
    return this.readPending(length);
  }

  private readPending(length: number): { ret: number; data: Uint8Array<ArrayBufferLike> } {
    const end = Math.min(this.offset + length, this.pending.byteLength);
    const data = this.pending.slice(this.offset, end);
    this.offset = end;
    if (this.offset >= this.pending.byteLength) {
      this.pending = new Uint8Array();
      this.offset = 0;
    }
    return { ret: 0, data };
  }
}

class LspStdoutCapture extends WasiFdStubs {
  private buffer = new Uint8Array();
  private readonly decoder = new TextDecoder('utf-8', { fatal: true });

  constructor(private readonly maxMessageBytes: number) {
    super();
  }

  override fd_write(data: Uint8Array): { ret: number; nwritten: number } {
    if (data.byteLength === 0) return { ret: 0, nwritten: 0 };
    const capacity = this.maxMessageBytes + MAX_HEADER_BYTES + HEADER_TERMINATOR.byteLength;
    let offset = 0;

    // A single WASI write may contain several valid frames. Append only up to
    // one bounded frame at a time, parse it, then continue with the remainder.
    while (offset < data.byteLength) {
      const available = capacity - this.buffer.byteLength;
      if (available <= 0) {
        throw new Error('Koka LSP stdout exceeded the bounded message buffer');
      }

      const count = Math.min(available, data.byteLength - offset);
      const joined = new Uint8Array(this.buffer.byteLength + count);
      joined.set(this.buffer);
      joined.set(data.subarray(offset, offset + count), this.buffer.byteLength);
      this.buffer = joined;
      offset += count;
      this.parseMessages();
    }
    return { ret: 0, nwritten: data.byteLength };
  }

  private parseMessages(): void {
    while (this.buffer.byteLength > 0) {
      const headerEnd = indexOfBytes(this.buffer, HEADER_TERMINATOR);
      if (headerEnd < 0) {
        if (this.buffer.byteLength > MAX_HEADER_BYTES) {
          throw new Error('Koka LSP returned an oversized or unterminated header');
        }
        return;
      }
      if (headerEnd > MAX_HEADER_BYTES) {
        throw new Error('Koka LSP returned an oversized header');
      }

      const headerText = this.decoder.decode(this.buffer.slice(0, headerEnd));
      const contentLength = parseContentLength(headerText);
      if (contentLength > this.maxMessageBytes) {
        throw new Error(
          `Koka LSP response is ${contentLength} bytes; limit is ${this.maxMessageBytes}`,
        );
      }

      const bodyStart = headerEnd + HEADER_TERMINATOR.byteLength;
      const frameEnd = bodyStart + contentLength;
      if (this.buffer.byteLength < frameEnd) return;

      const body = this.decoder.decode(this.buffer.slice(bodyStart, frameEnd));
      const message = parseJsonRpcMessage(body);
      post({ type: 'response', message });
      this.buffer = this.buffer.slice(frameEnd);
    }
  }
}

function parseContentLength(header: string): number {
  const matches = [...header.matchAll(/^content-length\s*:\s*(\d+)\s*$/gim)];
  if (matches.length !== 1) throw new Error('Koka LSP returned an invalid Content-Length header');

  const value = Number(matches[0]?.[1]);
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`Koka LSP returned an invalid Content-Length: ${String(matches[0]?.[1])}`);
  }
  return value;
}

function parseJsonRpcMessage(body: string): Record<string, unknown> {
  const message: unknown = JSON.parse(body);
  if (
    typeof message !== 'object' ||
    message === null ||
    Array.isArray(message) ||
    (message as { jsonrpc?: unknown }).jsonrpc !== '2.0'
  ) {
    throw new Error('Koka LSP returned an invalid JSON-RPC message');
  }
  return message as Record<string, unknown>;
}

function indexOfBytes(haystack: Uint8Array, needle: Uint8Array): number {
  const lastStart = haystack.byteLength - needle.byteLength;
  for (let start = 0; start <= lastStart; start += 1) {
    let matches = true;
    for (let offset = 0; offset < needle.byteLength; offset += 1) {
      if (haystack[start + offset] !== needle[offset]) {
        matches = false;
        break;
      }
    }
    if (matches) return start;
  }
  return -1;
}

function validateMessageLimit(value: number): number {
  if (!Number.isSafeInteger(value) || value < MIN_MESSAGE_BYTES || value > MAX_MESSAGE_BYTES) {
    throw new Error(
      `Koka LSP message limit must be between ${MIN_MESSAGE_BYTES} and ${MAX_MESSAGE_BYTES}`,
    );
  }
  return value;
}

function normalizeVerbosity(value: number): number {
  if (!Number.isSafeInteger(value)) return 0;
  return Math.min(3, Math.max(0, value));
}

function assertWasmMagic(bytes: Uint8Array): void {
  if (
    bytes.byteLength < 8 ||
    bytes[0] !== 0x00 ||
    bytes[1] !== 0x61 ||
    bytes[2] !== 0x73 ||
    bytes[3] !== 0x6d
  ) {
    throw new Error('Koka LSP asset is not a WebAssembly module');
  }
}

function post(message: WorkerResponse): void {
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
