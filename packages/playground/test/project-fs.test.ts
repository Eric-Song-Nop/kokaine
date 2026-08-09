import 'fake-indexeddb/auto';

import { afterEach, describe, expect, it } from 'vitest';

import {
  DEFAULT_PROJECT,
  ProjectFS,
  ProjectFsError,
  type ProjectSnapshot,
} from '../src/project/project-fs';

const databases = new Set<string>();
const fileSystems = new Set<ProjectFS>();

async function openFileSystem(dbName: string): Promise<ProjectFS> {
  const fileSystem = await ProjectFS.open({ dbName });
  fileSystems.add(fileSystem);
  return fileSystem;
}


function databaseName(): string {
  const name = `kokaine-project-fs-${crypto.randomUUID()}`;
  databases.add(name);
  return name;
}

afterEach(async () => {
  for (const fileSystem of fileSystems) fileSystem.close();
  fileSystems.clear();
  await Promise.all(
    [...databases].map(
      (name) => new Promise<void>((resolve, reject) => {
        const request = indexedDB.deleteDatabase(name);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
        request.onblocked = () => reject(new Error(`Database ${name} is still open`));
      }),
    ),
  );
  databases.clear();
});

describe('ProjectFS', () => {
  it('creates and persists the canonical starter project', async () => {
    const dbName = databaseName();
    const first = await openFileSystem(dbName);

    expect(first.snapshot()).toEqual(DEFAULT_PROJECT);
    first.close();

    const reopened = await openFileSystem(dbName);
    expect(reopened.snapshot()).toEqual(DEFAULT_PROJECT);
    reopened.close();
  });

  it('commits create, write, rename, and delete as monotonic snapshots', async () => {
    const fs = await openFileSystem(databaseName());
    const seen: ProjectSnapshot[] = [];
    const unsubscribe = fs.subscribe((snapshot) => seen.push(snapshot));

    await fs.createDirectory('effects');
    await fs.createFile('effects/state.kk', 'module effects/state\n\npub val initial = 0\n');
    await fs.writeFile('effects/state.kk', 'module effects/state\n\npub val initial = 1\n');
    await fs.rename('effects', 'state');
    await fs.remove('state', { recursive: true });

    expect(fs.snapshot().revision).toBe(5);
    expect(fs.snapshot().directories).not.toContain('state');
    expect(fs.snapshot().files['state/state.kk']).toBeUndefined();
    expect(seen.map(({ revision }) => revision)).toEqual([1, 2, 3, 4, 5]);
    expect(Object.isFrozen(fs.snapshot())).toBe(true);

    unsubscribe();
    fs.close();
  });

  it('rejects unsafe paths and failed writes without changing revision', async () => {
    const fs = await openFileSystem(databaseName());

    await expect(fs.createFile('../escape.kk', 'module escape')).rejects.toMatchObject({
      code: 'INVALID_PATH',
    } satisfies Partial<ProjectFsError>);
    await expect(fs.createFile('/absolute.kk', 'module absolute')).rejects.toMatchObject({
      code: 'INVALID_PATH',
    } satisfies Partial<ProjectFsError>);
    await expect(fs.createFile('remote.kk?url=https://example.com', 'module remote')).rejects
      .toMatchObject({ code: 'INVALID_PATH' } satisfies Partial<ProjectFsError>);
    await expect(fs.createFile('notes.txt', 'not Koka')).rejects.toMatchObject({
      code: 'INVALID_EXTENSION',
    } satisfies Partial<ProjectFsError>);

    expect(fs.snapshot().revision).toBe(0);
    fs.close();
  });

  it('applies replacement snapshots atomically and validates the entry module', async () => {
    const fs = await openFileSystem(databaseName());
    const imported: ProjectSnapshot = {
      schemaVersion: 1,
      projectId: 'shared-project',
      revision: 41,
      entryModule: 'app/main',
      directories: ['app', 'lib'],
      files: {
        'app/main.kk': 'module app/main\nimport lib/answer\n\npub fun main() answer/value.println\n',
        'lib/answer.kk': 'module lib/answer\n\npub val value = 42\n',
      },
    };

    await fs.replace(imported);
    expect(fs.snapshot()).toEqual({ ...imported, revision: 1 });

    await expect(
      fs.replace({ ...imported, entryModule: 'missing' }),
    ).rejects.toMatchObject({ code: 'ENTRY_NOT_FOUND' } satisfies Partial<ProjectFsError>);
    expect(fs.snapshot().revision).toBe(1);
    fs.close();
  });

  it('serializes concurrent writes in invocation order', async () => {
    const fs = await openFileSystem(databaseName());

    await Promise.all([
      fs.writeFile('main.kk', 'module main\n\npub fun main() 1.println\n'),
      fs.writeFile('main.kk', 'module main\n\npub fun main() 2.println\n'),
      fs.writeFile('main.kk', 'module main\n\npub fun main() 3.println\n'),
    ]);

    expect(fs.readFile('main.kk')).toContain('3.println');
    expect(fs.snapshot().revision).toBe(3);
    fs.close();
  });
});
