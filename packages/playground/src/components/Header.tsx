import {
  Bug,
  Moon,
  Play,
  RotateCcw,
  Share2,
  Sun,
} from 'lucide-solid';
import { Show } from 'solid-js';
import type { BuildStatus, LspStatus, Theme } from '../types';
import { Brand } from './Brand';
import { IconButton } from './IconButton';

interface HeaderProps {
  theme: Theme;
  lspStatus: LspStatus;
  buildStatus: BuildStatus;
  compilerVersion: string | null;
  buildDurationMs: number | null;
  problemCount: number;
  stale: boolean;
  devtoolsVisible: boolean;
  onRun: () => void;
  onShare: () => void;
  onReset: () => void;
  onToggleTheme: () => void;
  onToggleDevtools: () => void;
}

const lspLabel: Record<LspStatus, string> = {
  connecting: 'LSP starting',
  ready: 'LSP ready',
  error: 'LSP error',
  offline: 'LSP offline',
};

export function Header(props: HeaderProps) {
  const running = () => props.buildStatus === 'compiling';

  return (
    <header class="topbar">
      <Brand />

      <div class="topbar__signals" aria-label="Playground status">
        <span class={`signal-chip signal-chip--${props.lspStatus}`}>
          <span class="signal-chip__dot" aria-hidden="true" />
          {lspLabel[props.lspStatus]}
        </span>
        <span class="signal-chip signal-chip--compiler">
          Koka {props.compilerVersion?.replace(/^Koka\s*/i, '') ?? 'not found'}
        </span>
        <Show when={props.problemCount > 0}>
          <span class="signal-chip signal-chip--problem">
            {props.problemCount} {props.problemCount === 1 ? 'problem' : 'problems'}
          </span>
        </Show>
        <Show when={props.buildDurationMs !== null && props.buildStatus !== 'compiling'}>
          <span class="signal-chip signal-chip--build">
            {props.buildStatus === 'success' ? 'Built' : 'Failed'} in{' '}
            {(props.buildDurationMs! / 1000).toFixed(1)}s
          </span>
        </Show>
      </div>

      <div class="topbar__actions">
        <IconButton label="Reset starter" compact onClick={props.onReset}>
          <RotateCcw size={16} />
        </IconButton>
        <IconButton label="Copy share link" compact onClick={props.onShare}>
          <Share2 size={16} />
        </IconButton>
        <IconButton
          label={props.devtoolsVisible ? 'Hide DevTools' : 'Show DevTools'}
          compact
          class={props.devtoolsVisible ? 'is-active' : ''}
          onClick={props.onToggleDevtools}
        >
          <Bug size={16} />
        </IconButton>
        <IconButton
          label={props.theme === 'dark' ? 'Use light theme' : 'Use dark theme'}
          compact
          onClick={props.onToggleTheme}
        >
          {props.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </IconButton>
        <button
          type="button"
          class={`run-button${running() ? ' is-running' : ''}${props.stale ? ' is-stale' : ''}`}
          disabled={running()}
          onClick={props.onRun}
          title="Compile and run (Ctrl/Command + Enter)"
        >
          <Play size={15} fill="currentColor" />
          <span>{running() ? 'Compiling…' : 'Run'}</span>
          <kbd>⌘↵</kbd>
        </button>
      </div>
    </header>
  );
}
