import { describe, expect, it } from 'vitest';

import {
  createProjectVfsSnapshot,
  PROJECT_VFS_ROOT,
} from '../src/wasm/vfs';

describe('multi-file compiler VFS snapshot', () => {
  it('maps a complete project beneath an isolated workspace root', () => {
    const snapshot = createProjectVfsSnapshot('main', {
      'main.kk': 'module main\nimport util/math\n\npub fun main() answer.println\n',
      'util/math.kk': 'module util/math\n\npub val answer = 42\n',
    });

    expect(snapshot.entryModule).toBe('main');
    expect(snapshot.entrySource).toContain('module main');
    expect([...snapshot.files]).toEqual([
      [`${PROJECT_VFS_ROOT}/main.kk`, expect.stringContaining('module main')],
      [`${PROJECT_VFS_ROOT}/util/math.kk`, expect.stringContaining('module util/math')],
    ]);
  });

  it('selects a nested entry module by canonical module path', () => {
    const snapshot = createProjectVfsSnapshot('app/main', {
      'app/main.kk': 'module app/main\n\npub fun main() ()\n',
      'main.kk': 'module main\n',
    });

    expect(snapshot.entryModule).toBe('app/main');
    expect(snapshot.entrySource).toContain('module app/main');
  });

  it('rejects a missing entry module before starting WASM', () => {
    expect(() => createProjectVfsSnapshot('missing', {
      'main.kk': 'module main\n',
    })).toThrow('Entry module source is missing');
  });

  it('rejects traversal, absolute paths, non-Koka files, and normalized collisions', () => {
    const source = 'module invalid\n';
    expect(() => createProjectVfsSnapshot('main', { '../main.kk': source })).toThrow(
      'Project source path must be relative POSIX',
    );
    expect(() => createProjectVfsSnapshot('main', { '/main.kk': source })).toThrow(
      'Project source path must be relative POSIX',
    );
    expect(() => createProjectVfsSnapshot('main', { 'main.ts': source })).toThrow(
      'Project source files must end in .kk',
    );
    expect(() => createProjectVfsSnapshot('main', {
      'main.kk': source,
      './main.kk': source,
    })).toThrow('Duplicate project source path');
  });

  it('takes an immutable-at-the-boundary copy of file contents', () => {
    const files: Record<string, string> = { 'main.kk': 'module main\n' };
    const snapshot = createProjectVfsSnapshot('main', files);
    files['main.kk'] = 'corrupted';
    files['later.kk'] = 'module later\n';

    expect(snapshot.entrySource).toBe('module main\n');
    expect(snapshot.files.has(`${PROJECT_VFS_ROOT}/later.kk`)).toBe(false);
  });
});
