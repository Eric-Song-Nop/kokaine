import LZString from 'lz-string';

import {
  PROJECT_SCHEMA_VERSION,
  type ProjectSnapshot,
} from './project-fs';

const SHARE_PREFIX = '#project=';
const MAX_COMPRESSED_FRAGMENT_CHARS = 200_000;
const MAX_DECOMPRESSED_PROJECT_CHARS = 3_000_000;

export function encodeProjectHash(project: ProjectSnapshot): string {
  const canonical = {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    projectId: project.projectId,
    revision: 0,
    entryModule: project.entryModule,
    directories: [...project.directories].sort(),
    files: Object.fromEntries(
      Object.entries(project.files).sort(([left], [right]) => left.localeCompare(right)),
    ),
  } satisfies ProjectSnapshot;
  const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(canonical));
  if (compressed.length > MAX_COMPRESSED_FRAGMENT_CHARS) {
    throw new RangeError('The project is too large for a share link');
  }
  return `${SHARE_PREFIX}${compressed}`;
}

export function decodeProjectHash(hash: string): ProjectSnapshot | undefined {
  if (!hash.startsWith(SHARE_PREFIX)) return undefined;
  const compressed = hash.slice(SHARE_PREFIX.length);
  if (compressed.length > MAX_COMPRESSED_FRAGMENT_CHARS) {
    throw new RangeError('The project share fragment is too large');
  }
  const decoded = LZString.decompressFromEncodedURIComponent(compressed);
  if (!decoded) throw new Error('The project share fragment is not a valid compressed project');
  if (decoded.length > MAX_DECOMPRESSED_PROJECT_CHARS) {
    throw new RangeError('The shared project is too large');
  }

  let value: unknown;
  try {
    value = JSON.parse(decoded);
  } catch (error) {
    throw new Error('The project share fragment is not a valid compressed project', { cause: error });
  }
  if (!isProjectShape(value)) {
    throw new Error('The URL does not contain a valid Koka project');
  }
  return {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    projectId: value.projectId,
    revision: 0,
    entryModule: value.entryModule,
    directories: [...value.directories],
    files: { ...value.files },
  };
}

export function makeProjectShareUrl(project: ProjectSnapshot, baseUrl: string): string {
  const url = new URL(baseUrl);
  url.hash = encodeProjectHash(project).slice(1);
  return url.toString();
}

function isProjectShape(value: unknown): value is ProjectSnapshot {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const project = value as Record<string, unknown>;
  if (
    project.schemaVersion !== PROJECT_SCHEMA_VERSION
    || typeof project.projectId !== 'string'
    || typeof project.entryModule !== 'string'
    || !Array.isArray(project.directories)
    || project.directories.some((path) => typeof path !== 'string')
    || project.files === null
    || typeof project.files !== 'object'
    || Array.isArray(project.files)
  ) {
    return false;
  }
  return Object.entries(project.files as Record<string, unknown>)
    .every(([path, content]) => path.length > 0 && typeof content === 'string');
}
