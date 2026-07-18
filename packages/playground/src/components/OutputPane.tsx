import { Check, Copy, FileCode2, SquareTerminal } from 'lucide-solid';
import { For, Show, createSignal } from 'solid-js';
import type { CompileResult, OutputChannel, RuntimeLog } from '../types';
import { IconButton } from './IconButton';

interface OutputPaneProps {
  channel: OutputChannel;
  result: CompileResult | null;
  runtimeLogs: readonly RuntimeLog[];
  onChannelChange: (channel: OutputChannel) => void;
}

function buildText(result: CompileResult | null): string {
  if (!result) return 'Run main.kk to see compiler output.';
  return [
    result.stdout.trim(),
    result.stderr.trim(),
    result.error?.trim() ?? '',
  ].filter(Boolean).join('\n\n');
}

export function OutputPane(props: OutputPaneProps) {
  const [copied, setCopied] = createSignal(false);

  const currentText = () => {
    if (props.channel === 'generated') {
      return props.result?.generatedSource || 'A successful build will show the generated JavaScript here.';
    }
    if (props.channel === 'build') return buildText(props.result);
    return props.runtimeLogs.map((line) => line.text).join('\n');
  };

  const copyCurrent = async () => {
    await navigator.clipboard.writeText(currentText());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <section class="output-pane" aria-label="Compiler output">
      <div class="output-toolbar">
        <div class="subtabs" role="tablist" aria-label="Output channels">
          <button
            type="button"
            role="tab"
            aria-selected={props.channel === 'generated'}
            class={props.channel === 'generated' ? 'is-active' : ''}
            onClick={() => props.onChannelChange('generated')}
          >
            <FileCode2 size={14} /> Generated JS
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={props.channel === 'build'}
            class={props.channel === 'build' ? 'is-active' : ''}
            onClick={() => props.onChannelChange('build')}
          >
            <SquareTerminal size={14} /> Build log
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={props.channel === 'runtime'}
            class={props.channel === 'runtime' ? 'is-active' : ''}
            onClick={() => props.onChannelChange('runtime')}
          >
            Runtime <span class="subtabs__count">{props.runtimeLogs.length}</span>
          </button>
        </div>
        <IconButton label={copied() ? 'Copied' : 'Copy output'} compact onClick={copyCurrent}>
          {copied() ? <Check size={14} /> : <Copy size={14} />}
        </IconButton>
      </div>

      <Show
        when={props.channel !== 'runtime'}
        fallback={
          <div class="runtime-stream" role="log" aria-live="polite">
            <Show
              when={props.runtimeLogs.length > 0}
              fallback={<p class="empty-copy">Runtime console messages will appear here and in DevTools.</p>}
            >
              <For each={props.runtimeLogs}>
                {(line) => (
                  <div class={`runtime-line runtime-line--${line.level}`}>
                    <time>{new Date(line.timestamp).toLocaleTimeString([], { hour12: false })}</time>
                    <span class="runtime-line__level">{line.level}</span>
                    <span>{line.text}</span>
                  </div>
                )}
              </For>
            </Show>
          </div>
        }
      >
        <pre class={`code-output code-output--${props.channel}`} tabindex="0">
          <code>{currentText()}</code>
        </pre>
      </Show>
    </section>
  );
}
