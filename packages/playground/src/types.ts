export type Theme = 'dark' | 'light';

export type LspStatus = 'connecting' | 'ready' | 'error' | 'offline';

export type BuildStatus = 'idle' | 'compiling' | 'success' | 'error';

export type WorkspaceView = 'editor' | 'preview' | 'output' | 'devtools';

export type OutputChannel = 'generated' | 'build' | 'runtime';

export interface GeneratedModule {
  path: string;
  source: string;
}

export interface CompileResult {
  ok: boolean;
  revision: number;
  durationMs: number;
  entryPath: string | null;
  modules: readonly GeneratedModule[];
  generatedSource: string;
  generatedFile: string | null;
  stdout: string;
  stderr: string;
  error?: string;
  usedLastGood?: boolean;
}

export interface RuntimeLog {
  id: number;
  level: 'log' | 'info' | 'warn' | 'error' | 'debug';
  text: string;
  timestamp: number;
}
