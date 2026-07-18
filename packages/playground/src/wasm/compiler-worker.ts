/**
 * Adapted from koka-lang/koka's browser playground at commit
 * 94b2356a56eee5976174383ee35b0e9452aed9fe.
 * Koka is licensed under Apache-2.0; see the repository's third-party notice.
 */

/// <reference lib="webworker" />

import {
  ConsoleStdout,
  File,
  OpenFile,
  PreopenDirectory,
  WASI,
  type Directory,
} from '@bjorn3/browser_wasi_shim';

import { buildUnifiedTree, collectGeneratedFiles } from './wasi-fs';
import {
  cloneVfsFiles,
  moduleSourcePath,
  normalizeModuleName,
  type VfsFiles,
} from './vfs';

interface InitRequest {
  type: 'init';
  requestId: number;
  wasmUrl: string;
  files: [string, string][];
  compilerFlags: string[];
  maxSourceBytes: number;
}

interface CompileRequest {
  type: 'compile';
  requestId: number;
  moduleName: string;
  source: string;
  entryFunction?: string;
}

type WorkerRequest = InitRequest | CompileRequest;

interface CompileOutput {
  ok: boolean;
  stdout: string;
  stderr: string;
  generatedFiles: VfsFiles;
  generatedModules: VfsFiles;
  error?: string;
}

const MAX_COMPILER_WASM_BYTES = 32 * 1024 * 1024;
const scope = self as unknown as DedicatedWorkerGlobalScope;
const sourceEncoder = new TextEncoder();

let compilerModule: WebAssembly.Module | null = null;
let runtimeFiles: VfsFiles = new Map();
let compilerFlags: string[] = [];
let maxSourceBytes = 0;

scope.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const request = event.data;
  if (request.type === 'init') {
    void initialize(request);
    return;
  }

  if (request.type === 'compile') {
    compile(request);
  }
};

async function initialize(request: InitRequest): Promise<void> {
  try {
    const response = await fetch(request.wasmUrl, {
      credentials: 'same-origin',
      cache: 'force-cache',
    });
    if (!response.ok) {
      throw new Error(`Failed to load Koka compiler (${response.status} ${response.statusText})`);
    }

    const wasmBytes = await response.arrayBuffer();
    if (wasmBytes.byteLength > MAX_COMPILER_WASM_BYTES) {
      throw new Error(`Koka compiler exceeds ${MAX_COMPILER_WASM_BYTES} bytes`);
    }
    assertWasmMagic(new Uint8Array(wasmBytes));

    compilerModule = await WebAssembly.compile(wasmBytes);
    runtimeFiles = new Map(request.files);
    compilerFlags = [...request.compilerFlags];
    maxSourceBytes = request.maxSourceBytes;

    scope.postMessage({ type: 'ready', requestId: request.requestId });
  } catch (error) {
    scope.postMessage({
      type: 'fatal',
      requestId: request.requestId,
      error: errorMessage(error),
    });
  }
}

function compile(request: CompileRequest): void {
  const startedAt = performance.now();

  if (!compilerModule) {
    postCompileFailure(request, startedAt, 'Koka compiler is not initialized');
    return;
  }

  const sourceBytes = sourceEncoder.encode(request.source).byteLength;
  if (sourceBytes > maxSourceBytes) {
    postCompileFailure(
      request,
      startedAt,
      `Source is ${sourceBytes} bytes; the limit is ${maxSourceBytes} bytes`,
    );
    return;
  }

  try {
    const moduleName = normalizeModuleName(request.moduleName);
    const files = cloneVfsFiles(runtimeFiles);
    files.set(moduleSourcePath(moduleName), request.source);

    const output = runCompiler(
      compilerModule,
      moduleName,
      request.source,
      files,
      request.entryFunction,
      request.requestId,
    );

    scope.postMessage({
      type: 'result',
      requestId: request.requestId,
      durationMs: performance.now() - startedAt,
      ok: output.ok,
      stdout: output.stdout,
      stderr: output.stderr,
      generatedFiles: Array.from(output.generatedFiles),
      generatedModules: Array.from(output.generatedModules),
      error: output.error,
    });
  } catch (error) {
    postCompileFailure(request, startedAt, errorMessage(error));
  }
}

function runCompiler(
  module: WebAssembly.Module,
  moduleName: string,
  source: string,
  files: ReadonlyMap<string, string>,
  entryFunction: string | undefined,
  requestId: number,
): CompileOutput {
  const root = buildUnifiedTree(files);
  const stdin = new File(sourceEncoder.encode(source));
  const stdoutLines: string[] = [];
  const stderrLines: string[] = [];
  const extraArguments = entryFunction && entryFunction !== 'main'
    ? [`--main-entry=${entryFunction}`]
    : [];

  const wasi = new WASI(
    ['koka-playground', ...compilerFlags, ...extraArguments, moduleName],
    [],
    [
      new OpenFile(stdin),
      ConsoleStdout.lineBuffered((line: string) => stdoutLines.push(line)),
      ConsoleStdout.lineBuffered((line: string) => {
        stderrLines.push(line);
        scope.postMessage({ type: 'log', requestId, stream: 'stderr', text: line });
      }),
      new PreopenDirectory('/', root.contents),
    ],
    { debug: false },
  );

  const instance = new WebAssembly.Instance(module, {
    wasi_snapshot_preview1: wasi.wasiImport,
  });

  try {
    wasi.start(instance as unknown as {
      exports: { memory: WebAssembly.Memory; _start: () => void };
    });
  } catch (error) {
    // browser_wasi_shim models proc_exit by throwing. A normal compiler exit is
    // represented this way and its real success value is the final JSON line.
    if (!(error instanceof Error && error.message.toLowerCase().includes('exit'))) {
      stderrLines.push(errorMessage(error));
    }
  }

  const stdout = stdoutLines.join('\n');
  const stderr = stderrLines.join('\n');
  const compilerResult = parseCompilerResult(stdoutLines);
  const generatedFiles = collectGeneratedFiles(root as Directory);
  const generatedModules = new Map(
    Array.from(generatedFiles).filter(([path]) => path.endsWith('.mjs')),
  );

  if (!compilerResult.ok) {
    return {
      ok: false,
      stdout,
      stderr,
      generatedFiles,
      generatedModules,
      error: compilerResult.error ?? 'Koka compilation failed',
    };
  }

  if (generatedModules.size === 0) {
    return {
      ok: false,
      stdout,
      stderr,
      generatedFiles,
      generatedModules,
      error: 'Koka reported success but generated no JavaScript modules',
    };
  }

  return { ok: true, stdout, stderr, generatedFiles, generatedModules };
}

function parseCompilerResult(lines: readonly string[]): { ok: boolean; error?: string } {
  const jsonLine = [...lines].reverse().find((line) => line.trimStart().startsWith('{'));
  if (!jsonLine) return { ok: false, error: 'Koka compiler returned no result' };

  try {
    const value = JSON.parse(jsonLine) as { success?: unknown; errors?: unknown };
    if (value.success === true) return { ok: true };
    if (Array.isArray(value.errors)) {
      return { ok: false, error: value.errors.map(String).join('\n') };
    }
    return { ok: false };
  } catch {
    return { ok: false, error: 'Koka compiler returned malformed JSON' };
  }
}

function postCompileFailure(
  request: CompileRequest,
  startedAt: number,
  error: string,
): void {
  scope.postMessage({
    type: 'result',
    requestId: request.requestId,
    durationMs: performance.now() - startedAt,
    ok: false,
    stdout: '',
    stderr: error,
    generatedFiles: [],
    generatedModules: [],
    error,
  });
}

function assertWasmMagic(bytes: Uint8Array): void {
  if (
    bytes.length < 8 ||
    bytes[0] !== 0x00 ||
    bytes[1] !== 0x61 ||
    bytes[2] !== 0x73 ||
    bytes[3] !== 0x6d
  ) {
    throw new Error('Koka compiler asset is not a WebAssembly module');
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export {};
