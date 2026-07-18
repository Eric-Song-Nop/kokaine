import { RotateCw } from 'lucide-solid';
import { For, createEffect, createMemo, createSignal, onCleanup, type Component } from 'solid-js';
import { DragResizer } from './DragResizer';
import {
  MAX_CDP_MESSAGE_BYTES,
  PREVIEW_CHANNEL,
  buildDevtoolsDocument,
  buildPreviewDocument,
  type DevtoolsDocumentAssets,
} from './srcdoc';
import './preview.css';

export type PreviewRevision = string | number;
export type PreviewDeviceWidth = 'responsive' | number;
export type PreviewLogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

export interface PreviewModuleFile {
  path: string;
  source: string;
}

/**
 * A complete generated module graph for one successful compilation.
 *
 * Only freshly generated modules belong in `modules`. Relative imports that
 * are not present in this graph are resolved against `precompiledBaseUrl`.
 */
export interface PreviewModuleBundle {
  entryPath: string;
  modules: readonly PreviewModuleFile[];
  precompiledBaseUrl?: string;
}

export interface PreviewDevtoolsAssets extends DevtoolsDocumentAssets {
  chobitsuUrl?: string;
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

export interface PreviewProps {
  moduleBundle: PreviewModuleBundle;
  revision: PreviewRevision;
  dark: boolean;
  devtoolsVisible: boolean;
  onRuntimeLog?: (log: PreviewRuntimeLog) => void;
  onReady?: (info: PreviewReadyInfo) => void;
  onRuntimeError?: (error: PreviewRuntimeError) => void;
  reloadSignal?: unknown;
  deviceWidth?: PreviewDeviceWidth;
  onDeviceWidthChange?: (width: PreviewDeviceWidth) => void;
  devtoolsAssets?: PreviewDevtoolsAssets;
  class?: string;
}

interface PreviewEnvelope {
  channel: typeof PREVIEW_CHANNEL;
  token: string;
  type: string;
  payload?: unknown;
}

interface PreviewSession {
  token: string;
  moduleBundle: PreviewModuleBundle;
  revision: PreviewRevision;
  srcdoc: string;
}

const DEVICE_PRESETS = [390, 768, 1024] as const;
const DEFAULT_PRECOMPILED_BASE_URL = '/koka/precompiled/';
const DEFAULT_CHOBITSU_URL = '/devtools/chobitsu.min.js';
const DEFAULT_CUSTOM_ELEMENTS_URL = '/devtools/custom-elements.js';
const DEFAULT_CHII_URL = '/devtools/chii/entrypoints/chii_app/chii_app.js';
const DEVTOOLS_DEFAULT_HEIGHT = 310;
const DEVTOOLS_MIN_HEIGHT = 150;
const DEVTOOLS_MAX_HEIGHT = 720;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function isEnvelope(value: unknown): value is PreviewEnvelope {
  if (!isRecord(value)) return false;
  return value.channel === PREVIEW_CHANNEL
    && typeof value.token === 'string'
    && typeof value.type === 'string';
}

function isCdpMessage(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > MAX_CDP_MESSAGE_BYTES) return false;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!isRecord(parsed)) return false;
    return typeof parsed.method === 'string'
      || typeof parsed.id === 'number'
      || typeof parsed.id === 'string';
  } catch {
    return false;
  }
}

function createToken(): string {
  const bytes = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
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

function directoryUrl(value: string | undefined): string {
  const resolved = sameOriginUrl(value ?? DEFAULT_PRECOMPILED_BASE_URL, DEFAULT_PRECOMPILED_BASE_URL);
  return resolved.endsWith('/') ? resolved : `${resolved}/`;
}

function text(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function number(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function runtimeError(payload: unknown, revision: PreviewRevision): PreviewRuntimeError {
  const value = isRecord(payload) ? payload : {};
  const rawPhase = value.phase;
  const phase = rawPhase === 'runtime' || rawPhase === 'unhandled-rejection'
    ? rawPhase
    : 'module-import';

  return {
    name: text(value.name, 'Error'),
    message: text(value.message, 'The preview failed.'),
    stack: text(value.stack) || undefined,
    source: text(value.source) || undefined,
    line: typeof value.line === 'number' ? value.line : undefined,
    column: typeof value.column === 'number' ? value.column : undefined,
    phase,
    timestamp: number(value.timestamp, Date.now()),
    revision,
  };
}

export const Preview: Component<PreviewProps> = (props) => {
  let previewFrame: HTMLIFrameElement | undefined;
  let devtoolsFrame: HTMLIFrameElement | undefined;

  const [manualReload, setManualReload] = createSignal(0);
  const [internalDeviceWidth, setInternalDeviceWidth] = createSignal<PreviewDeviceWidth>('responsive');
  const [devtoolsHeight, setDevtoolsHeight] = createSignal(DEVTOOLS_DEFAULT_HEIGHT);
  const [devtoolsLoaded, setDevtoolsLoaded] = createSignal(false);

  const session = createMemo<PreviewSession>(() => {
    // Reading both signals is deliberate: either is allowed to request a fresh,
    // independently-tokened browsing context even when the module graph is unchanged.
    void props.reloadSignal;
    manualReload();

    const token = createToken();
    const suppliedBundle = props.moduleBundle;
    const moduleBundle: PreviewModuleBundle = {
      entryPath: suppliedBundle.entryPath,
      modules: suppliedBundle.modules,
      precompiledBaseUrl: directoryUrl(suppliedBundle.precompiledBaseUrl),
    };
    const revision = props.revision;
    return {
      token,
      moduleBundle,
      revision,
      srcdoc: buildPreviewDocument({
        token,
        entryPath: moduleBundle.entryPath,
        revision,
        appOrigin: window.location.origin,
        chobitsuUrl: sameOriginUrl(
          props.devtoolsAssets?.chobitsuUrl ?? DEFAULT_CHOBITSU_URL,
          DEFAULT_CHOBITSU_URL,
        ),
      }),
    };
  });

  const [devtoolsObjectUrl, setDevtoolsObjectUrl] = createSignal('');
  createEffect(() => {
    const document = buildDevtoolsDocument({
      customElementsUrl: sameOriginUrl(
        props.devtoolsAssets?.customElementsUrl ?? DEFAULT_CUSTOM_ELEMENTS_URL,
        DEFAULT_CUSTOM_ELEMENTS_URL,
      ),
      chiiUrl: sameOriginUrl(
        props.devtoolsAssets?.chiiUrl ?? DEFAULT_CHII_URL,
        DEFAULT_CHII_URL,
      ),
    });
    const objectUrl = URL.createObjectURL(new Blob([document], { type: 'text/html' }));
    setDevtoolsObjectUrl(objectUrl);
    setDevtoolsLoaded(false);
    onCleanup(() => URL.revokeObjectURL(objectUrl));
  });

  const devtoolsSrc = createMemo(() => {
    const objectUrl = devtoolsObjectUrl();
    if (!objectUrl) return 'about:blank';
    const embeddedOrigin = encodeURIComponent(window.location.origin);
    const theme = props.dark ? 'dark' : 'light';
    return `${objectUrl}#?embedded=${embeddedOrigin}&kokaineTheme=${theme}`;
  });

  const selectedDeviceWidth = () => props.deviceWidth ?? internalDeviceWidth();
  const frameWidth = () => {
    const width = selectedDeviceWidth();
    return width === 'responsive' ? '100%' : `${Math.max(240, width)}px`;
  };

  const sendToPreviewSession = (
    activeSession: PreviewSession,
    type: string,
    payload?: unknown,
  ) => {
    const target = previewFrame?.contentWindow;
    if (!target) return;
    target.postMessage({
      channel: PREVIEW_CHANNEL,
      token: activeSession.token,
      type,
      payload,
    } satisfies PreviewEnvelope, '*');
  };

  const sendToPreview = (type: string, payload?: unknown) => {
    sendToPreviewSession(session(), type, payload);
  };

  const announcePreviewState = () => {
    sendToPreview('theme', props.dark);
    if (devtoolsLoaded()) sendToPreview('devtools-ready');
  };

  const loadPreviewModules = () => {
    const activeSession = session();
    sendToPreview('load-modules', activeSession.moduleBundle);
  };

  const messageListener = (event: MessageEvent<unknown>) => {
    const previewWindow = previewFrame?.contentWindow;
    const devtoolsWindow = devtoolsFrame?.contentWindow;

    if (previewWindow && event.source === previewWindow) {
      if (!isEnvelope(event.data)) return;
      const activeSession = session();
      if (event.data.token !== activeSession.token) return;

      if (event.data.type === 'bridge-ready') {
        announcePreviewState();
        return;
      }

      if (event.data.type === 'cdp') {
        if (devtoolsWindow && isCdpMessage(event.data.payload)) {
          devtoolsWindow.postMessage(event.data.payload, '*');
        }
        return;
      }

      if (event.data.type === 'runtime-log') {
        const payload = isRecord(event.data.payload) ? event.data.payload : {};
        const level = payload.level;
        if (level !== 'log' && level !== 'info' && level !== 'warn'
          && level !== 'error' && level !== 'debug') return;
        props.onRuntimeLog?.({
          level,
          args: Array.isArray(payload.args) ? payload.args : [],
          timestamp: number(payload.timestamp, Date.now()),
          revision: activeSession.revision,
        });
        return;
      }

      if (event.data.type === 'runtime-error') {
        props.onRuntimeError?.(runtimeError(event.data.payload, activeSession.revision));
        return;
      }

      if (event.data.type === 'ready') {
        const payload = isRecord(event.data.payload) ? event.data.payload : {};
        props.onReady?.({
          entryPath: text(payload.entryPath, activeSession.moduleBundle.entryPath),
          revision: activeSession.revision,
          timestamp: number(payload.timestamp, Date.now()),
        });
      }
      return;
    }

    // Chii emits raw CDP JSON. It cannot attach our token, so the exact WindowProxy
    // and a constrained CDP shape/size form this side of the relay boundary.
    if (devtoolsWindow && event.source === devtoolsWindow && isCdpMessage(event.data)) {
      sendToPreview('cdp-command', event.data);
    }
  };

  window.addEventListener('message', messageListener);
  onCleanup(() => window.removeEventListener('message', messageListener));

  createEffect(() => {
    props.dark;
    sendToPreview('theme', props.dark);
  });

  const selectDeviceWidth = (value: string) => {
    const next: PreviewDeviceWidth = value === 'responsive' ? 'responsive' : Number(value);
    if (next !== 'responsive' && !Number.isFinite(next)) return;
    if (props.deviceWidth === undefined) setInternalDeviceWidth(next);
    props.onDeviceWidthChange?.(next);
  };

  const currentWidthIsCustom = () => {
    const width = selectedDeviceWidth();
    return typeof width === 'number' && !DEVICE_PRESETS.includes(width as (typeof DEVICE_PRESETS)[number]);
  };

  return (
    <section
      class={`kokaine-preview-root${props.dark ? ' is-dark' : ''}${props.class ? ` ${props.class}` : ''}`}
      aria-label="Kokaine application preview"
    >
      <div class="kokaine-preview-toolbar">
        <label>
          <span>Viewport</span>
          <select
            aria-label="Preview viewport width"
            value={String(selectedDeviceWidth())}
            onChange={(event) => selectDeviceWidth(event.currentTarget.value)}
          >
            <option value="responsive">Responsive</option>
            {currentWidthIsCustom() && (
              <option value={selectedDeviceWidth()}>{selectedDeviceWidth()} px</option>
            )}
            <option value="390">Phone · 390 px</option>
            <option value="768">Tablet · 768 px</option>
            <option value="1024">Desktop · 1024 px</option>
          </select>
        </label>
        <span class="kokaine-preview-toolbar__sandbox">Sandboxed</span>
        <button
          class="kokaine-preview-toolbar__reload"
          type="button"
          title="Reload preview"
          onClick={() => setManualReload((value) => value + 1)}
        >
          <RotateCw size={14} aria-hidden="true" />
          Reload
        </button>
      </div>

      <div class="kokaine-preview-stage">
        <div
          class="kokaine-preview-device"
          classList={{ 'is-responsive': selectedDeviceWidth() === 'responsive' }}
          style={{ width: frameWidth() }}
        >
          <For each={[session()]}>
            {(activeSession) => (
              <iframe
                ref={previewFrame}
                class="kokaine-preview-frame"
                title="Kokaine compiled application"
                srcdoc={activeSession.srcdoc}
                sandbox="allow-scripts"
                referrerPolicy="no-referrer"
                onLoad={() => {
                  sendToPreviewSession(activeSession, 'theme', props.dark);
                  if (devtoolsLoaded()) {
                    sendToPreviewSession(activeSession, 'devtools-ready');
                  }
                  sendToPreviewSession(
                    activeSession,
                    'load-modules',
                    activeSession.moduleBundle,
                  );
                }}
              />
            )}
          </For>
        </div>
      </div>

      <div hidden={!props.devtoolsVisible}>
        <DragResizer
          orientation="horizontal"
          value={devtoolsHeight()}
          min={DEVTOOLS_MIN_HEIGHT}
          max={DEVTOOLS_MAX_HEIGHT}
          step={10}
          inverted
          label="Resize DevTools"
          onChange={setDevtoolsHeight}
          onReset={() => setDevtoolsHeight(DEVTOOLS_DEFAULT_HEIGHT)}
        />
      </div>
      <div
        class="kokaine-devtools-pane"
        hidden={!props.devtoolsVisible}
        style={{ height: `${devtoolsHeight()}px` }}
      >
        <iframe
          ref={devtoolsFrame}
          class="kokaine-devtools-frame"
          title="Kokaine Chromium DevTools"
          src={devtoolsSrc()}
          sandbox="allow-scripts allow-downloads"
          referrerPolicy="no-referrer"
          tabIndex={props.devtoolsVisible ? 0 : -1}
          onLoad={() => {
            setDevtoolsLoaded(true);
            sendToPreview('devtools-ready');
          }}
        />
      </div>
    </section>
  );
};
