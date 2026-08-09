import { DEFAULT_PRECOMPILED_BASE_URL } from '../wasm/assets';
import {
  MAX_CDP_MESSAGE_BYTES,
  PREVIEW_CHANNEL,
  buildDevtoolsDocument,
  buildPreviewDocument,
} from './srcdoc';
import type { DevtoolsDocumentAssets } from './srcdoc';

export type PreviewRevision = string | number;
export type PreviewDeviceWidth = 'responsive' | number;
export type PreviewLogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

export interface PreviewModule {
  path: string;
  source: string;
}

export interface PreviewModuleBundle {
  entryPath: string;
  modules: readonly PreviewModule[];
  precompiledBaseUrl?: string;
}

export interface PreviewRuntimeLog {
  level: PreviewLogLevel;
  args: readonly unknown[];
  timestamp: number;
  revision: PreviewRevision;
}

export interface PreviewRuntimeError {
  name: string;
  message: string;
  stack?: string;
  source?: string;
  line?: number;
  column?: number;
  phase: 'module-import' | 'runtime' | 'unhandled-rejection';
  timestamp: number;
  revision: PreviewRevision;
}

export interface PreviewReadyInfo {
  entryPath: string;
  revision: PreviewRevision;
  timestamp: number;
}

export interface PreviewControllerOptions {
  root: HTMLElement;
  frame: HTMLIFrameElement;
  device: HTMLElement;
  devtoolsFrame: HTMLIFrameElement;
  dark: boolean;
  devtoolsAssets?: DevtoolsDocumentAssets & { chobitsuUrl?: string };
  onRuntimeLog?: (log: PreviewRuntimeLog) => void;
  onRuntimeError?: (error: PreviewRuntimeError) => void;
  onReady?: (info: PreviewReadyInfo) => void;
}

export interface PreviewController {
  load(bundle: PreviewModuleBundle, revision: PreviewRevision): void;
  reload(): void;
  setTheme(dark: boolean): void;
  setDeviceWidth(width: PreviewDeviceWidth): void;
  setDevtoolsVisible(visible: boolean): void;
  dispose(): void;
}

interface PreviewEnvelope {
  channel: typeof PREVIEW_CHANNEL;
  token: string;
  type: string;
  payload?: unknown;
}

interface PreviewSession {
  token: string;
  bundle: Required<PreviewModuleBundle>;
  revision: PreviewRevision;
  srcdoc: string;
}

const DEFAULT_CHOBITSU_URL = '/devtools/chobitsu.min.js';
const DEFAULT_CUSTOM_ELEMENTS_URL = '/devtools/custom-elements.js';
const DEFAULT_CHII_URL = '/devtools/chii/entrypoints/chii_app/chii_app.js';

function isEnvelope(value: unknown): value is PreviewEnvelope {
  if (value === null || typeof value !== 'object') return false;
  const envelope = value as Partial<PreviewEnvelope>;
  return envelope.channel === PREVIEW_CHANNEL
    && typeof envelope.token === 'string'
    && typeof envelope.type === 'string';
}

function isCdpMessage(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > MAX_CDP_MESSAGE_BYTES) return false;
  try {
    const parsed: unknown = JSON.parse(value);
    if (parsed === null || typeof parsed !== 'object') return false;
    const message = parsed as { method?: unknown; id?: unknown };
    return typeof message.method === 'string'
      || typeof message.id === 'number'
      || typeof message.id === 'string';
  } catch {
    return false;
  }
}

function createToken(): string {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function sameOriginUrl(value: string, fallback: string): string {
  const fallbackUrl = new URL(fallback, window.location.href);
  try {
    const resolved = new URL(value, window.location.href);
    return resolved.origin === window.location.origin ? resolved.href : fallbackUrl.href;
  } catch {
    return fallbackUrl.href;
  }
}

function directoryUrl(value?: string): string {
  const resolved = sameOriginUrl(value ?? DEFAULT_PRECOMPILED_BASE_URL, DEFAULT_PRECOMPILED_BASE_URL);
  return resolved.endsWith('/') ? resolved : `${resolved}/`;
}

function stringValue(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function numberValue(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function decodeRuntimeError(payload: unknown, revision: PreviewRevision): PreviewRuntimeError {
  const value = payload !== null && typeof payload === 'object'
    ? payload as { [key: string]: unknown }
    : {};
  const rawPhase = value.phase;
  const phase = rawPhase === 'runtime' || rawPhase === 'unhandled-rejection'
    ? rawPhase
    : 'module-import';

  return {
    name: stringValue(value.name, 'Error'),
    message: stringValue(value.message, 'The preview failed.'),
    stack: stringValue(value.stack) || undefined,
    source: stringValue(value.source) || undefined,
    line: typeof value.line === 'number' ? value.line : undefined,
    column: typeof value.column === 'number' ? value.column : undefined,
    phase,
    timestamp: numberValue(value.timestamp, Date.now()),
    revision,
  };
}

export function createPreviewController(options: PreviewControllerOptions): PreviewController {
  let dark = options.dark;
  let devtoolsLoaded = false;
  let devtoolsVisible = false;
  let currentBundle: PreviewModuleBundle | undefined;
  let currentRevision: PreviewRevision = 0;
  let session: PreviewSession | undefined;
  let disposed = false;

  const devtoolsDocument = buildDevtoolsDocument({
    customElementsUrl: sameOriginUrl(
      options.devtoolsAssets?.customElementsUrl ?? DEFAULT_CUSTOM_ELEMENTS_URL,
      DEFAULT_CUSTOM_ELEMENTS_URL,
    ),
    chiiUrl: sameOriginUrl(
      options.devtoolsAssets?.chiiUrl ?? DEFAULT_CHII_URL,
      DEFAULT_CHII_URL,
    ),
  });
  const devtoolsObjectUrl = URL.createObjectURL(new Blob([devtoolsDocument], { type: 'text/html' }));

  const devtoolsSource = () => {
    const embeddedOrigin = encodeURIComponent(window.location.origin);
    return `${devtoolsObjectUrl}#?embedded=${embeddedOrigin}&kokaineTheme=${dark ? 'dark' : 'light'}`;
  };

  const sendToSession = (active: PreviewSession, type: string, payload?: unknown) => {
    options.frame.contentWindow?.postMessage({
      channel: PREVIEW_CHANNEL,
      token: active.token,
      type,
      payload,
    } satisfies PreviewEnvelope, '*');
  };

  const send = (type: string, payload?: unknown) => {
    if (session) sendToSession(session, type, payload);
  };

  const announceState = () => {
    send('theme', dark);
    if (devtoolsLoaded) send('devtools-ready');
  };

  const loadSession = () => {
    if (!currentBundle || disposed) return;
    const bundle: Required<PreviewModuleBundle> = {
      entryPath: currentBundle.entryPath,
      modules: currentBundle.modules,
      precompiledBaseUrl: directoryUrl(currentBundle.precompiledBaseUrl),
    };
    const token = createToken();
    session = {
      token,
      bundle,
      revision: currentRevision,
      srcdoc: buildPreviewDocument({
        token,
        entryPath: bundle.entryPath,
        revision: currentRevision,
        appOrigin: window.location.origin,
        chobitsuUrl: sameOriginUrl(
          options.devtoolsAssets?.chobitsuUrl ?? DEFAULT_CHOBITSU_URL,
          DEFAULT_CHOBITSU_URL,
        ),
      }),
    };
    options.frame.srcdoc = session.srcdoc;
  };

  const handlePreviewLoad = () => {
    const active = session;
    if (!active) return;
    sendToSession(active, 'theme', dark);
    if (devtoolsLoaded) sendToSession(active, 'devtools-ready');
    sendToSession(active, 'load-modules', active.bundle);
  };

  const handleDevtoolsLoad = () => {
    devtoolsLoaded = true;
    send('devtools-ready');
  };

  const handleMessage = (event: MessageEvent<unknown>) => {
    if (event.source === options.frame.contentWindow) {
      if (!session || !isEnvelope(event.data) || event.data.token !== session.token) return;

      if (event.data.type === 'bridge-ready') {
        announceState();
        return;
      }
      if (event.data.type === 'cdp') {
        if (isCdpMessage(event.data.payload)) {
          options.devtoolsFrame.contentWindow?.postMessage(event.data.payload, '*');
        }
        return;
      }
      if (event.data.type === 'runtime-log') {
        const payload = event.data.payload !== null && typeof event.data.payload === 'object'
          ? event.data.payload as { [key: string]: unknown }
          : {};
        const level = payload.level;
        if (level !== 'log' && level !== 'info' && level !== 'warn'
          && level !== 'error' && level !== 'debug') return;
        options.onRuntimeLog?.({
          level,
          args: Array.isArray(payload.args) ? payload.args : [],
          timestamp: numberValue(payload.timestamp, Date.now()),
          revision: session.revision,
        });
        return;
      }
      if (event.data.type === 'runtime-error') {
        options.onRuntimeError?.(decodeRuntimeError(event.data.payload, session.revision));
        return;
      }
      if (event.data.type === 'ready') {
        const payload = event.data.payload !== null && typeof event.data.payload === 'object'
          ? event.data.payload as { [key: string]: unknown }
          : {};
        options.onReady?.({
          entryPath: stringValue(payload.entryPath, session.bundle.entryPath),
          revision: session.revision,
          timestamp: numberValue(payload.timestamp, Date.now()),
        });
      }
      return;
    }

    if (event.source === options.devtoolsFrame.contentWindow && isCdpMessage(event.data)) {
      send('cdp-command', event.data);
    }
  };

  options.frame.addEventListener('load', handlePreviewLoad);
  options.devtoolsFrame.addEventListener('load', handleDevtoolsLoad);
  window.addEventListener('message', handleMessage);
  options.devtoolsFrame.src = devtoolsSource();
  options.devtoolsFrame.tabIndex = -1;

  return {
    load(bundle, revision) {
      currentBundle = bundle;
      currentRevision = revision;
      loadSession();
    },
    reload() {
      loadSession();
    },
    setTheme(nextDark) {
      if (dark === nextDark) return;
      dark = nextDark;
      options.root.classList.toggle('is-dark', dark);
      send('theme', dark);
      devtoolsLoaded = false;
      options.devtoolsFrame.src = devtoolsSource();
    },
    setDeviceWidth(width) {
      options.device.classList.toggle('is-responsive', width === 'responsive');
      options.device.style.width = width === 'responsive' ? '100%' : `${Math.max(240, width)}px`;
    },
    setDevtoolsVisible(visible) {
      devtoolsVisible = visible;
      options.devtoolsFrame.tabIndex = visible ? 0 : -1;
      if (devtoolsVisible && devtoolsLoaded) send('devtools-ready');
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      window.removeEventListener('message', handleMessage);
      options.frame.removeEventListener('load', handlePreviewLoad);
      options.devtoolsFrame.removeEventListener('load', handleDevtoolsLoad);
      options.frame.removeAttribute('srcdoc');
      options.devtoolsFrame.src = 'about:blank';
      URL.revokeObjectURL(devtoolsObjectUrl);
    },
  };
}
