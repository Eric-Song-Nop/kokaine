import {
  PREVIEW_CHANNEL,
  buildPreviewDocument,
} from '../preview/srcdoc';
import type {
  PreviewModuleBundle,
  PreviewRuntimeError,
  PreviewRuntimeLog,
} from '../preview/controller';
import { DEFAULT_PRECOMPILED_BASE_URL } from '../wasm/assets';

export interface ReplSandboxOptions {
  readonly container: HTMLElement;
  readonly dark: boolean;
  readonly timeoutMs?: number;
  readonly onRuntimeLog?: (log: PreviewRuntimeLog) => void;
  readonly onRuntimeError?: (error: PreviewRuntimeError) => void;
  readonly onOutput?: (output: string) => void;
}

export interface ReplSandbox {
  run(bundle: PreviewModuleBundle, revision: string | number): Promise<void>;
  setTheme(dark: boolean): void;
  dispose(): void;
}

interface PreviewEnvelope {
  readonly channel: typeof PREVIEW_CHANNEL;
  readonly token: string;
  readonly type: string;
  readonly payload?: unknown;
}

interface ActiveRun {
  readonly token: string;
  readonly bundle: Required<PreviewModuleBundle>;
  readonly revision: string | number;
  readonly resolve: () => void;
  readonly reject: (error: Error) => void;
  readonly timer: ReturnType<typeof setTimeout>;
}

const DEFAULT_SANDBOX_TIMEOUT_MS = 30_000;
const EMPTY_SCRIPT_URL = 'data:text/javascript,void%200';

export function createReplSandbox(options: ReplSandboxOptions): ReplSandbox {
  let dark = options.dark;
  let disposed = false;
  let active: ActiveRun | undefined;
  const timeoutMs = boundedTimeout(options.timeoutMs);
  const frame = document.createElement('iframe');
  frame.className = 'repl-runtime-frame';
  frame.title = 'Koka REPL execution sandbox';
  frame.sandbox.add('allow-scripts');
  frame.referrerPolicy = 'no-referrer';
  frame.setAttribute('aria-hidden', 'true');
  frame.tabIndex = -1;
  options.container.append(frame);

  const sendToActive = (type: string, payload?: unknown): void => {
    if (!active) return;
    frame.contentWindow?.postMessage({
      channel: PREVIEW_CHANNEL,
      token: active.token,
      type,
      payload,
    } satisfies PreviewEnvelope, '*');
  };

  const handleLoad = (): void => {
    if (!active) return;
    sendToActive('theme', dark);
    sendToActive('load-modules', active.bundle);
  };

  const handleMessage = (event: MessageEvent<unknown>): void => {
    if (event.source !== frame.contentWindow || !active || !isEnvelope(event.data)) return;
    if (event.data.token !== active.token) return;

    if (event.data.type === 'bridge-ready') {
      sendToActive('theme', dark);
      return;
    }
    if (event.data.type === 'runtime-log') {
      const payload = recordValue(event.data.payload) ?? {};
      const level = payload.level;
      if (level !== 'log' && level !== 'info' && level !== 'warn'
        && level !== 'error' && level !== 'debug') return;
      options.onRuntimeLog?.({
        level,
        args: Array.isArray(payload.args) ? payload.args : [],
        timestamp: finiteNumber(payload.timestamp, Date.now()),
        revision: active.revision,
      });
      return;
    }
    if (event.data.type === 'runtime-error') {
      const error = decodeRuntimeError(event.data.payload, active.revision);
      options.onRuntimeError?.(error);
      settleActive(new Error(error.message));
      return;
    }
    if (event.data.type === 'ready') {
      const payload = recordValue(event.data.payload);
      if (typeof payload?.output === 'string' && payload.output.length > 0) {
        options.onOutput?.(payload.output);
      }
      settleActive();
    }
  };

  const settleActive = (error?: Error): void => {
    const completed = active;
    if (!completed) return;
    active = undefined;
    clearTimeout(completed.timer);
    if (error) completed.reject(error);
    else completed.resolve();
  };

  frame.addEventListener('load', handleLoad);
  window.addEventListener('message', handleMessage);

  return {
    run(bundle, revision) {
      if (disposed) return Promise.reject(new Error('The Koka REPL sandbox was disposed'));
      settleActive(new DOMException('A newer Koka REPL run replaced this run', 'AbortError'));
      const normalizedBundle: Required<PreviewModuleBundle> = {
        entryPath: bundle.entryPath,
        modules: [...bundle.modules],
        precompiledBaseUrl: directoryUrl(bundle.precompiledBaseUrl),
      };
      const token = createToken();
      const promise = new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => {
          settleActive(new Error(`Koka REPL execution timed out after ${timeoutMs}ms`));
        }, timeoutMs);
        active = { token, bundle: normalizedBundle, revision, resolve, reject, timer };
      });
      frame.srcdoc = buildPreviewDocument({
        token,
        entryPath: normalizedBundle.entryPath,
        revision,
        appOrigin: window.location.origin,
        chobitsuUrl: EMPTY_SCRIPT_URL,
        captureOutput: true,
        devtools: false,
      });
      return promise;
    },
    setTheme(nextDark) {
      dark = nextDark;
      sendToActive('theme', dark);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      settleActive(new Error('The Koka REPL sandbox was disposed'));
      frame.removeEventListener('load', handleLoad);
      window.removeEventListener('message', handleMessage);
      frame.remove();
    },
  };
}

function directoryUrl(value?: string): string {
  const resolved = new URL(value ?? DEFAULT_PRECOMPILED_BASE_URL, window.location.href).href;
  return resolved.endsWith('/') ? resolved : `${resolved}/`;
}

function createToken(): string {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function isEnvelope(value: unknown): value is PreviewEnvelope {
  const envelope = recordValue(value);
  return envelope?.channel === PREVIEW_CHANNEL
    && typeof envelope.token === 'string'
    && typeof envelope.type === 'string';
}

function decodeRuntimeError(
  value: unknown,
  revision: string | number,
): PreviewRuntimeError {
  const payload = recordValue(value) ?? {};
  const rawPhase = payload.phase;
  const phase = rawPhase === 'runtime' || rawPhase === 'unhandled-rejection'
    ? rawPhase
    : 'module-import';
  return {
    name: typeof payload.name === 'string' ? payload.name : 'Error',
    message: typeof payload.message === 'string' ? payload.message : 'Koka REPL execution failed',
    stack: typeof payload.stack === 'string' ? payload.stack : undefined,
    source: typeof payload.source === 'string' ? payload.source : undefined,
    line: typeof payload.line === 'number' ? payload.line : undefined,
    column: typeof payload.column === 'number' ? payload.column : undefined,
    phase,
    timestamp: finiteNumber(payload.timestamp, Date.now()),
    revision,
  };
}

function finiteNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function boundedTimeout(value: number | undefined): number {
  const timeout = value ?? DEFAULT_SANDBOX_TIMEOUT_MS;
  if (!Number.isSafeInteger(timeout) || timeout < 1_000 || timeout > 120_000) {
    throw new RangeError('Koka REPL sandbox timeout must be between 1000 and 120000ms');
  }
  return timeout;
}

function recordValue(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}
