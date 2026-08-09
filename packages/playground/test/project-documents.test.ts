import { describe, expect, it, vi } from 'vitest';

import {
  ProjectDocumentRegistry,
  projectDocumentPath,
  projectDocumentUri,
  type ProjectDocumentAdapter,
  type ProjectDocumentReference,
  type ProjectTextModel,
} from '../src/editor/project-documents';

interface FakeModel extends ProjectTextModel {
  value: string;
  disposed: boolean;
}

function fakeAdapter() {
  const references = new Map<string, FakeModel>();
  const create = vi.fn(async (uri: string, value: string): Promise<ProjectDocumentReference<FakeModel>> => {
    const model: FakeModel = {
      uri,
      value,
      disposed: false,
      getValue: () => model.value,
      setValue: (next) => { model.value = next; },
    };
    references.set(uri, model);
    return {
      model,
      dispose: () => { model.disposed = true; },
    };
  });
  return {
    adapter: { create } satisfies ProjectDocumentAdapter<FakeModel>,
    create,
    references,
  };
}

describe('project document registry', () => {
  it('maps canonical project paths to stable workspace file URIs', () => {
    expect(projectDocumentUri('main.kk')).toBe('file:///workspace/main.kk');
    expect(projectDocumentUri('util/math.kk')).toBe('file:///workspace/util/math.kk');
    expect(projectDocumentPath('file:///workspace/util/math.kk')).toBe('util/math.kk');
    expect(() => projectDocumentUri('../escape.kk')).toThrow('Invalid project document path');
    expect(() => projectDocumentPath('file:///outside/main.kk')).toThrow(
      'outside the project workspace',
    );
  });

  it('opens one model for every file before returning', async () => {
    const { adapter, create } = fakeAdapter();
    const registry = await ProjectDocumentRegistry.open(adapter, {
      'util/math.kk': 'module util/math\n',
      'main.kk': 'module main\n',
    });

    expect(registry.paths()).toEqual(['main.kk', 'util/math.kk']);
    expect(create.mock.calls.map(([uri]) => uri)).toEqual([
      'file:///workspace/main.kk',
      'file:///workspace/util/math.kk',
    ]);
    registry.dispose();
  });

  it('reconciles edits and structural file changes without duplicating models', async () => {
    const { adapter, create, references } = fakeAdapter();
    const registry = await ProjectDocumentRegistry.open(adapter, {
      'main.kk': 'module main\n',
      'old.kk': 'module old\n',
    });
    const removed = registry.model('old.kk');

    const delta = await registry.reconcile({
      'main.kk': 'module main\n\npub val changed = True\n',
      'new.kk': 'module new\n',
    });

    expect(delta).toEqual({ added: ['new.kk'], removed: ['old.kk'], updated: ['main.kk'] });
    expect(registry.model('main.kk').getValue()).toContain('changed');
    expect(removed.disposed).toBe(true);
    expect(create).toHaveBeenCalledTimes(3);
    expect(references.get('file:///workspace/new.kk')?.disposed).toBe(false);
    registry.dispose();
  });

  it('disposes every model reference exactly once', async () => {
    const { adapter, references } = fakeAdapter();
    const registry = await ProjectDocumentRegistry.open(adapter, {
      'main.kk': 'module main\n',
      'util/math.kk': 'module util/math\n',
    });

    registry.dispose();
    registry.dispose();
    expect([...references.values()].every(({ disposed }) => disposed)).toBe(true);
    await expect(registry.reconcile({})).rejects.toThrow('disposed');
  });
});
