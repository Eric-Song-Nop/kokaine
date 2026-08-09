import { describe, expect, it } from 'vitest';

import { DEFAULT_PROJECT } from '../src/project/project-fs';
import {
  decodeProjectHash,
  encodeProjectHash,
} from '../src/project/project-share';

describe('project share links', () => {
  it('round-trips a deterministic multi-file project snapshot', () => {
    const first = encodeProjectHash(DEFAULT_PROJECT);
    const second = encodeProjectHash({
      ...DEFAULT_PROJECT,
      directories: [...DEFAULT_PROJECT.directories].reverse(),
      files: Object.fromEntries(Object.entries(DEFAULT_PROJECT.files).reverse()),
    });

    expect(first).toBe(second);
    expect(first.startsWith('#project=')).toBe(true);
    expect(decodeProjectHash(first)).toEqual({
      ...DEFAULT_PROJECT,
      revision: 0,
    });
  });

  it('rejects unrelated, corrupt, and oversized fragments', () => {
    expect(decodeProjectHash('#code=old')).toBeUndefined();
    expect(() => decodeProjectHash('#project=not-valid-compressed-data')).toThrow(
      'not a valid compressed project',
    );
    expect(() => decodeProjectHash(`#project=${'a'.repeat(200_001)}`)).toThrow(
      'share fragment is too large',
    );
  });
});
