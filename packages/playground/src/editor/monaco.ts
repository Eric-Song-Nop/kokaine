import type * as Monaco from 'monaco-editor';
import editorWorkerUrl from 'monaco-editor/esm/vs/editor/editor.worker?worker&url';
import { registerKokaLanguage, registerKokaThemes } from './koka-language';

export type MonacoApi = typeof Monaco;

let monacoPromise: Promise<MonacoApi> | undefined;

/**
 * Initialize the VS Code services exactly once. Monaco must not be imported by
 * application code before this resolves: the language client installs model,
 * configuration, editor, and language services during this sequence.
 */
export function initializeMonaco(): Promise<MonacoApi> {
  monacoPromise ??= initializeMonacoOnce();
  return monacoPromise;
}

async function initializeMonacoOnce(): Promise<MonacoApi> {
  // Worker routing is configured by MonacoVscodeApiWrapper before it calls the
  // service initializer. Classic mode intentionally uses Monarch and therefore
  // does not need TextMate or extension-host workers.
  const workerFactory = await import('monaco-languageclient/workerFactory');
  const { MonacoVscodeApiWrapper } = await import('monaco-languageclient/vscodeApiWrapper');

  const apiWrapper = new MonacoVscodeApiWrapper({
    $type: 'classic',
    viewsConfig: { $type: 'EditorService' },
    userConfiguration: {
      json: JSON.stringify({
        'editor.experimental.asyncTokenization': true,
        'editor.wordBasedSuggestions': 'off',
        'editor.snippetSuggestions': 'top',
        'editor.inlayHints.enabled': 'on',
      }),
    },
    monacoWorkerFactory: (logger) => {
      workerFactory.useWorkerFactory({
        workerLoaders: {
          // Vite must resolve this URL in application source. The package's
          // generic new URL(bare-module, import.meta.url) fallback points into
          // monaco-languageclient/lib/worker during dev and cannot be fetched.
          editorWorkerService: () => new workerFactory.Worker(
            editorWorkerUrl,
            { type: 'module', name: 'editorWorkerService' },
          ),
          TextMateWorker: undefined,
          extensionHostWorkerMain: undefined,
        },
        logger,
      });
    },
  });

  await apiWrapper.start({ caller: '@kokaine/playground/editor' });

  // This is the Monaco instance backed by the services initialized above.
  const monaco = await import('@codingame/monaco-vscode-editor-api') as unknown as MonacoApi;
  registerKokaLanguage(monaco);
  registerKokaThemes(monaco);
  return monaco;
}
