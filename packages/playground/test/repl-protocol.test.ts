import { describe, expect, it } from 'vitest';

import type { ProjectSnapshot } from '../src/project/project-fs';
import {
  REPL_SCHEMA_VERSION,
  createOpenSessionRequest,
  createReloadProjectRequest,
  createResetSessionRequest,
  createSubmitLineRequest,
  encodeReplRequest,
  parseReplResponse,
} from '../src/repl/protocol';

const project: ProjectSnapshot = {
  schemaVersion: 1,
  projectId: 'test',
  revision: 12,
  entryModule: 'app/main',
  directories: ['app', 'util'],
  files: {
    'util/math.kk': 'module util/math\n\npub val answer = 42\n',
    'app/main.kk': 'module app/main\nimport util/math\n',
  },
};

describe('browser REPL wire protocol', () => {
  it('opens a session with one canonical, sorted project snapshot', () => {
    expect(createOpenSessionRequest(7, project)).toEqual({
      schemaVersion: REPL_SCHEMA_VERSION,
      id: 7,
      method: 'session/open',
      params: {
        revision: 12,
        entryPath: '/workspace/app/main.kk',
        files: [
          ['/workspace/app/main.kk', expect.stringContaining('module app/main')],
          ['/workspace/util/math.kk', expect.stringContaining('module util/math')],
        ],
      },
    });
  });

  it('encodes Unicode and multiline input as one newline-delimited UTF-8 frame', () => {
    const request = createSubmitLineRequest(8, 'val greeting = "你好"\ngreeting');
    const frame = encodeReplRequest(request);
    const decoded = new TextDecoder('utf-8', { fatal: true }).decode(frame);

    expect(decoded.endsWith('\n')).toBe(true);
    expect(JSON.parse(decoded)).toEqual(request);
  });

  it('creates reload and reset requests without leaking mutable project objects', () => {
    const reload = createReloadProjectRequest(9, project);
    const reset = createResetSessionRequest(10);
    (project.files as Record<string, string>)['later.kk'] = 'module later\n';

    expect(reload.params.files).toHaveLength(2);
    expect(reset).toEqual({
      schemaVersion: REPL_SCHEMA_VERSION,
      id: 10,
      method: 'session/reset',
      params: {},
    });
  });

  it('accepts a complete response and rejects malformed or mismatched schemas', () => {
    expect(parseReplResponse({
      schemaVersion: 1,
      id: 11,
      kind: 'type',
      success: true,
      output: 'forall<a> (a) -> a',
      entryPath: null,
      error: null,
    })).toEqual({
      schemaVersion: 1,
      id: 11,
      kind: 'type',
      success: true,
      output: 'forall<a> (a) -> a',
      entryPath: null,
      error: null,
    });

    expect(() => parseReplResponse({ schemaVersion: 2, id: 1 })).toThrow(
      'Unsupported browser REPL schemaVersion',
    );
    expect(() => parseReplResponse({ schemaVersion: 1, id: -1 })).toThrow(
      'invalid response id',
    );
    expect(() => parseReplResponse({
      schemaVersion: 1,
      id: 1,
      kind: 'value',
      success: true,
      output: 42,
      entryPath: null,
      error: null,
    })).toThrow('invalid output');
  });
});
