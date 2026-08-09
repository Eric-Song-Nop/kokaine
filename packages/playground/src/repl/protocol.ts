import type { ProjectSnapshot } from '../project/project-fs';
import { modulePath } from '../project/project-fs';

export const REPL_SCHEMA_VERSION = 1 as const;
export const REPL_WORKSPACE_ROOT = '/workspace';

export interface ReplProjectParams {
  readonly revision: number;
  readonly entryPath: string;
  readonly files: readonly (readonly [string, string])[];
}

export interface OpenSessionRequest {
  readonly schemaVersion: typeof REPL_SCHEMA_VERSION;
  readonly id: number;
  readonly method: 'session/open';
  readonly params: ReplProjectParams;
}

export interface ReloadProjectRequest {
  readonly schemaVersion: typeof REPL_SCHEMA_VERSION;
  readonly id: number;
  readonly method: 'project/reload';
  readonly params: ReplProjectParams;
}

export interface SubmitLineRequest {
  readonly schemaVersion: typeof REPL_SCHEMA_VERSION;
  readonly id: number;
  readonly method: 'repl/submit';
  readonly params: { readonly line: string };
}

export interface ResetSessionRequest {
  readonly schemaVersion: typeof REPL_SCHEMA_VERSION;
  readonly id: number;
  readonly method: 'session/reset';
  readonly params: Record<string, never>;
}

export type ReplRequest =
  | OpenSessionRequest
  | ReloadProjectRequest
  | SubmitLineRequest
  | ResetSessionRequest;

export interface ReplResponse {
  readonly schemaVersion: typeof REPL_SCHEMA_VERSION;
  readonly id: number;
  readonly kind: string;
  readonly success: boolean;
  readonly output: string | null;
  readonly entryPath: string | null;
  readonly error: string | null;
}

const encoder = new TextEncoder();

export function createOpenSessionRequest(
  id: number,
  project: ProjectSnapshot,
): OpenSessionRequest {
  return {
    schemaVersion: REPL_SCHEMA_VERSION,
    id: requestId(id),
    method: 'session/open',
    params: projectParams(project),
  };
}

export function createReloadProjectRequest(
  id: number,
  project: ProjectSnapshot,
): ReloadProjectRequest {
  return {
    schemaVersion: REPL_SCHEMA_VERSION,
    id: requestId(id),
    method: 'project/reload',
    params: projectParams(project),
  };
}

export function createSubmitLineRequest(id: number, line: string): SubmitLineRequest {
  if (typeof line !== 'string') throw new TypeError('Browser REPL input must be text');
  return {
    schemaVersion: REPL_SCHEMA_VERSION,
    id: requestId(id),
    method: 'repl/submit',
    params: { line },
  };
}

export function createResetSessionRequest(id: number): ResetSessionRequest {
  return {
    schemaVersion: REPL_SCHEMA_VERSION,
    id: requestId(id),
    method: 'session/reset',
    params: {},
  };
}

export function encodeReplRequest(request: ReplRequest): Uint8Array {
  return encoder.encode(`${JSON.stringify(request)}\n`);
}

export function parseReplResponse(value: unknown): ReplResponse {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Browser REPL returned a non-object response');
  }
  const response = value as Record<string, unknown>;
  if (response.schemaVersion !== REPL_SCHEMA_VERSION) {
    throw new Error(`Unsupported browser REPL schemaVersion: ${String(response.schemaVersion)}`);
  }
  if (!Number.isSafeInteger(response.id) || (response.id as number) < 0) {
    throw new Error('Browser REPL returned an invalid response id');
  }
  if (typeof response.kind !== 'string' || response.kind.length === 0) {
    throw new Error('Browser REPL returned an invalid response kind');
  }
  if (typeof response.success !== 'boolean') {
    throw new Error('Browser REPL returned an invalid success flag');
  }
  const output = nullableString(response.output, 'output');
  const entryPath = nullableString(response.entryPath, 'entryPath');
  const error = nullableString(response.error, 'error');
  return {
    schemaVersion: REPL_SCHEMA_VERSION,
    id: response.id as number,
    kind: response.kind,
    success: response.success,
    output,
    entryPath,
    error,
  };
}

function projectParams(project: ProjectSnapshot): ReplProjectParams {
  if (!Number.isSafeInteger(project.revision) || project.revision < 0) {
    throw new Error(`Invalid browser REPL project revision: ${String(project.revision)}`);
  }
  const files = Object.entries(project.files)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([path, content]) => [`${REPL_WORKSPACE_ROOT}/${path}`, content] as const);
  const entryPath = `${REPL_WORKSPACE_ROOT}/${modulePath(project.entryModule)}`;
  if (!files.some(([path]) => path === entryPath)) {
    throw new Error(`Browser REPL entry module source is missing: ${project.entryModule}`);
  }
  return { revision: project.revision, entryPath, files };
}

function requestId(value: number): number {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new RangeError('Browser REPL request id must be a positive safe integer');
  }
  return value;
}

function nullableString(value: unknown, name: string): string | null {
  if (value === null || typeof value === 'string') return value;
  throw new Error(`Browser REPL returned an invalid ${name}`);
}
