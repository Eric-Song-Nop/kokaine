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

function GitHubIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
      />
    </svg>
  );
}

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
        <a
          class="icon-button icon-button--compact"
          href="https://github.com/Eric-Song-Nop/kokaine"
          target="_blank"
          rel="noreferrer noopener"
          title="Kokaine on GitHub"
          aria-label="Kokaine on GitHub"
        >
          <GitHubIcon />
        </a>
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
