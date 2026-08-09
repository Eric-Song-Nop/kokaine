export const PROJECT_SCHEMA_VERSION = 1 as const;
export const DEFAULT_PROJECT_ID = 'default';
export const DEFAULT_PROJECT_DB_NAME = 'kokaine-playground-projects-v1';
export const MAX_PROJECT_FILES = 128;
export const MAX_PROJECT_FILE_BYTES = 256 * 1024;
export const MAX_PROJECT_BYTES = 2 * 1024 * 1024;
export const MAX_PROJECT_PATH_BYTES = 240;

const PROJECT_STORE = 'projects';
const CURRENT_PROJECT_KEY = 'current';
const textEncoder = new TextEncoder();

export interface ProjectSnapshot {
  readonly schemaVersion: typeof PROJECT_SCHEMA_VERSION;
  readonly projectId: string;
  readonly revision: number;
  readonly entryModule: string;
  readonly directories: readonly string[];
  readonly files: Readonly<Record<string, string>>;
}

interface MutableProject {
  schemaVersion: typeof PROJECT_SCHEMA_VERSION;
  projectId: string;
  revision: number;
  entryModule: string;
  directories: string[];
  files: Record<string, string>;
}

export type ProjectFsErrorCode =
  | 'CLOSED'
  | 'CONFLICT'
  | 'ENTRY_NOT_FOUND'
  | 'FILE_TOO_LARGE'
  | 'INVALID_EXTENSION'
  | 'INVALID_PATH'
  | 'NOT_FOUND'
  | 'PROJECT_TOO_LARGE'
  | 'TOO_MANY_FILES';

export class ProjectFsError extends Error {
  readonly code: ProjectFsErrorCode;

  constructor(code: ProjectFsErrorCode, message: string) {
    super(message);
    this.name = 'ProjectFsError';
    this.code = code;
  }
}

export interface OpenProjectFsOptions {
  readonly dbName?: string;
}

export interface RemoveProjectEntryOptions {
  readonly recursive?: boolean;
}

export type ProjectFsListener = (snapshot: ProjectSnapshot) => void;

const DEFAULT_MAIN_SOURCE = `module main

import kokaine/reactive
import kokaine/html
import kokaine/dom
import app/copy

pub fun main()
  val (root,count) = create-root fn(root)
    signal(root,0)

  val page = view
    main-tag(attrs=[attr("style","min-height:100%;display:grid;place-items:center;padding:40px 20px;font-family:system-ui,sans-serif")])
      section(attrs=[attr("style","width:min(100%,560px);padding:34px;border:1px solid #dbe2ea;border-radius:20px;box-shadow:0 24px 70px rgba(31,45,61,.12)")])
        p("KOKAINE / MULTI-FILE PROJECT",attrs=[attr("style","margin:0 0 12px;color:#526476;font:700 12px/1.2 ui-monospace,monospace;letter-spacing:.12em")])
        h1(demo-title,attrs=[attr("style","margin:0 0 12px;font-size:clamp(28px,7vw,46px);line-height:1.02;letter-spacing:-.04em")])
        p(demo-summary,attrs=[attr("style","margin:0 0 28px;color:#5d6b79;line-height:1.6")])
        div(attrs=[attr("style","display:flex;align-items:center;gap:14px;flex-wrap:wrap")])
          button("Increment",attrs=[kind("button"),on-click(fn(_) count.modify(fn(value) value + 1))])
          strong(attrs=[aria("live","polite")])
            text { count.get.show }
          button("Decrement",attrs=[kind("button"),on("click",fn(_) count.set(count.get - 1))])

  val dispose = mount(root,query("#app"),page)
  ()
`;

const DEFAULT_COPY_SOURCE = `module app/copy

pub val demo-title = "Algebraic effects, one project at a time."
pub val demo-summary = "Edit main.kk and app/copy.kk, then run the selected entry module."
`;

export const DEFAULT_PROJECT: ProjectSnapshot = freezeSnapshot({
  schemaVersion: PROJECT_SCHEMA_VERSION,
  projectId: DEFAULT_PROJECT_ID,
  revision: 0,
  entryModule: 'main',
  directories: ['app'],
  files: {
    'app/copy.kk': DEFAULT_COPY_SOURCE,
    'main.kk': DEFAULT_MAIN_SOURCE,
  },
});

export class ProjectFS {
  static async open(options: OpenProjectFsOptions = {}): Promise<ProjectFS> {
    const db = await openDatabase(options.dbName ?? DEFAULT_PROJECT_DB_NAME);
    const stored = await readStoredProject(db);
    const snapshot = stored === undefined
      ? DEFAULT_PROJECT
      : canonicalSnapshot(stored, stored.revision);

    if (stored === undefined) await writeStoredProject(db, snapshot);
    return new ProjectFS(db, snapshot);
  }

  readonly #db: IDBDatabase;
  readonly #listeners = new Set<ProjectFsListener>();
  #current: ProjectSnapshot;
  #closed = false;
  #mutations: Promise<void> = Promise.resolve();

  private constructor(db: IDBDatabase, initial: ProjectSnapshot) {
    this.#db = db;
    this.#current = initial;
  }

  snapshot(): ProjectSnapshot {
    this.#assertOpen();
    return this.#current;
  }

  readFile(path: string): string {
    this.#assertOpen();
    const canonicalPath = canonicalFilePath(path);
    const content = this.#current.files[canonicalPath];
    if (content === undefined) {
      throw new ProjectFsError('NOT_FOUND', `Project file does not exist: ${canonicalPath}`);
    }
    return content;
  }

  subscribe(listener: ProjectFsListener): () => void {
    this.#assertOpen();
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  createDirectory(path: string): Promise<ProjectSnapshot> {
    return this.#commit((project) => {
      const canonicalPath = canonicalDirectoryPath(path);
      assertPathAvailable(project, canonicalPath);
      project.directories.push(canonicalPath);
      addParentDirectories(project.directories, canonicalPath);
    });
  }

  createFile(path: string, content = ''): Promise<ProjectSnapshot> {
    return this.#commit((project) => {
      const canonicalPath = canonicalFilePath(path);
      assertPathAvailable(project, canonicalPath);
      project.files[canonicalPath] = content;
      addParentDirectories(project.directories, canonicalPath);
    });
  }

  writeFile(path: string, content: string): Promise<ProjectSnapshot> {
    return this.#commit((project) => {
      const canonicalPath = canonicalFilePath(path);
      if (project.files[canonicalPath] === undefined) {
        throw new ProjectFsError('NOT_FOUND', `Project file does not exist: ${canonicalPath}`);
      }
      project.files[canonicalPath] = content;
    });
  }

  rename(from: string, to: string): Promise<ProjectSnapshot> {
    return this.#commit((project) => {
      const source = canonicalProjectPath(from);
      const sourceContent = project.files[source];
      if (sourceContent !== undefined) {
        const target = canonicalFilePath(to);
        assertPathAvailable(project, target, source);
        const sourceModule = moduleNameFromPath(source);
        const targetModule = moduleNameFromPath(target);
        delete project.files[source];
        project.files[target] = sourceContent;
        rewriteProjectModules(project, new Map([[sourceModule, targetModule]]));
        addParentDirectories(project.directories, target);
        if (sourceModule === project.entryModule) {
          project.entryModule = targetModule;
        }
        return;
      }

      if (!project.directories.includes(source)) {
        throw new ProjectFsError('NOT_FOUND', `Project entry does not exist: ${source}`);
      }
      const target = canonicalDirectoryPath(to);
      assertPathAvailable(project, target, source);
      const prefix = `${source}/`;
      const movedFiles = Object.entries(project.files)
        .filter(([path]) => path.startsWith(prefix));
      const movedDirectories = project.directories
        .filter((path) => path === source || path.startsWith(prefix));
      const moduleRenames = new Map(movedFiles.map(([path]) => {
        const movedPath = replacePathPrefix(path, source, target);
        return [moduleNameFromPath(path), moduleNameFromPath(movedPath)];
      }));

      for (const [path] of movedFiles) delete project.files[path];
      for (const path of movedDirectories) {
        project.directories.splice(project.directories.indexOf(path), 1);
      }
      for (const [path, content] of movedFiles) {
        project.files[replacePathPrefix(path, source, target)] = content;
      }
      for (const path of movedDirectories) {
        project.directories.push(replacePathPrefix(path, source, target));
      }
      rewriteProjectModules(project, moduleRenames);
      const entryPath = modulePath(project.entryModule);
      if (entryPath.startsWith(prefix)) {
        project.entryModule = moduleNameFromPath(replacePathPrefix(entryPath, source, target));
      }
      addParentDirectories(project.directories, target);
    });
  }

  remove(path: string, options: RemoveProjectEntryOptions = {}): Promise<ProjectSnapshot> {
    return this.#commit((project) => {
      const canonicalPath = canonicalProjectPath(path);
      if (project.files[canonicalPath] !== undefined) {
        if (moduleNameFromPath(canonicalPath) === project.entryModule) {
          throw new ProjectFsError('ENTRY_NOT_FOUND', 'Select another entry module before deleting it');
        }
        delete project.files[canonicalPath];
        return;
      }

      if (!project.directories.includes(canonicalPath)) {
        throw new ProjectFsError('NOT_FOUND', `Project entry does not exist: ${canonicalPath}`);
      }
      const prefix = `${canonicalPath}/`;
      const childFiles = Object.keys(project.files).filter((filePath) => filePath.startsWith(prefix));
      const childDirectories = project.directories.filter((directory) => directory.startsWith(prefix));
      if (!options.recursive && (childFiles.length > 0 || childDirectories.length > 0)) {
        throw new ProjectFsError('CONFLICT', `Project directory is not empty: ${canonicalPath}`);
      }
      if (childFiles.some((filePath) => moduleNameFromPath(filePath) === project.entryModule)) {
        throw new ProjectFsError('ENTRY_NOT_FOUND', 'Select another entry module before deleting it');
      }
      for (const filePath of childFiles) delete project.files[filePath];
      project.directories = project.directories.filter(
        (directory) => directory !== canonicalPath && !directory.startsWith(prefix),
      );
    });
  }

  setEntryModule(moduleName: string): Promise<ProjectSnapshot> {
    return this.#commit((project) => {
      project.entryModule = canonicalModuleName(moduleName);
    });
  }

  replace(snapshot: ProjectSnapshot): Promise<ProjectSnapshot> {
    return this.#commit((project) => {
      const imported = mutableSnapshot(snapshot);
      project.schemaVersion = imported.schemaVersion;
      project.projectId = imported.projectId;
      project.entryModule = imported.entryModule;
      project.directories = imported.directories;
      project.files = imported.files;
    });
  }

  close(): void {
    if (this.#closed) return;
    this.#closed = true;
    this.#listeners.clear();
    this.#db.close();
  }

  #commit(mutator: (project: MutableProject) => void): Promise<ProjectSnapshot> {
    this.#assertOpen();
    const operation = this.#mutations.then(async () => {
      this.#assertOpen();
      const draft = mutableSnapshot(this.#current);
      mutator(draft);
      const next = canonicalSnapshot(draft, this.#current.revision + 1);
      await writeStoredProject(this.#db, next);
      this.#current = next;
      for (const listener of this.#listeners) listener(next);
      return next;
    });
    this.#mutations = operation.then(() => undefined, () => undefined);
    return operation;
  }

  #assertOpen(): void {
    if (this.#closed) throw new ProjectFsError('CLOSED', 'ProjectFS is closed');
  }
}

function mutableSnapshot(snapshot: ProjectSnapshot): MutableProject {
  return {
    schemaVersion: snapshot.schemaVersion,
    projectId: snapshot.projectId,
    revision: snapshot.revision,
    entryModule: snapshot.entryModule,
    directories: [...snapshot.directories],
    files: Object.fromEntries(Object.entries(snapshot.files)),
  };
}

function rewriteProjectModules(
  project: MutableProject,
  renames: ReadonlyMap<string, string>,
): void {
  if (renames.size === 0) return;
  const declaration = /^([ \t]*(?:module|(?:pub[ \t]+)?import)[ \t]+)([A-Za-z0-9_./-]+)(?=\s|$)/gm;
  for (const [path, source] of Object.entries(project.files)) {
    project.files[path] = source.replace(
      declaration,
      (statement, prefix: string, moduleName: string) => {
        const renamed = renames.get(moduleName);
        return renamed === undefined ? statement : `${prefix}${renamed}`;
      },
    );
  }
}

function canonicalSnapshot(snapshot: ProjectSnapshot, revision: number): ProjectSnapshot {
  if (snapshot.schemaVersion !== PROJECT_SCHEMA_VERSION) {
    throw new ProjectFsError('CONFLICT', `Unsupported project schema: ${String(snapshot.schemaVersion)}`);
  }
  if (!Number.isSafeInteger(revision) || revision < 0) {
    throw new ProjectFsError('CONFLICT', `Invalid project revision: ${String(revision)}`);
  }
  if (typeof snapshot.projectId !== 'string' || snapshot.projectId.length === 0 || snapshot.projectId.length > 128) {
    throw new ProjectFsError('CONFLICT', 'Project ID must contain 1 to 128 characters');
  }

  const files: Record<string, string> = {};
  let totalBytes = 0;
  const entries = Object.entries(snapshot.files);
  if (entries.length > MAX_PROJECT_FILES) {
    throw new ProjectFsError('TOO_MANY_FILES', `Projects may contain at most ${MAX_PROJECT_FILES} files`);
  }
  for (const [rawPath, content] of entries.sort(([left], [right]) => left.localeCompare(right))) {
    const path = canonicalFilePath(rawPath);
    if (typeof content !== 'string') {
      throw new ProjectFsError('CONFLICT', `Project file is not text: ${path}`);
    }
    const contentBytes = textEncoder.encode(content).byteLength;
    if (contentBytes > MAX_PROJECT_FILE_BYTES) {
      throw new ProjectFsError('FILE_TOO_LARGE', `${path} exceeds ${MAX_PROJECT_FILE_BYTES} bytes`);
    }
    totalBytes += contentBytes;
    if (totalBytes > MAX_PROJECT_BYTES) {
      throw new ProjectFsError('PROJECT_TOO_LARGE', `Project exceeds ${MAX_PROJECT_BYTES} bytes`);
    }
    files[path] = content;
  }

  const directories = snapshot.directories.map(canonicalDirectoryPath);
  for (const filePath of Object.keys(files)) addParentDirectories(directories, filePath);
  const canonicalDirectories = [...new Set(directories)].sort();
  for (const directory of canonicalDirectories) {
    if (files[directory] !== undefined) {
      throw new ProjectFsError('CONFLICT', `Path is both a file and directory: ${directory}`);
    }
  }

  const entryModule = canonicalModuleName(snapshot.entryModule);
  if (files[modulePath(entryModule)] === undefined) {
    throw new ProjectFsError('ENTRY_NOT_FOUND', `Entry module does not exist: ${entryModule}`);
  }

  return freezeSnapshot({
    schemaVersion: PROJECT_SCHEMA_VERSION,
    projectId: snapshot.projectId,
    revision,
    entryModule,
    directories: canonicalDirectories,
    files,
  });
}

function freezeSnapshot(snapshot: ProjectSnapshot): ProjectSnapshot {
  Object.freeze(snapshot.files);
  Object.freeze(snapshot.directories);
  return Object.freeze(snapshot);
}

function canonicalProjectPath(path: string): string {
  if (typeof path !== 'string' || path.length === 0) {
    throw new ProjectFsError('INVALID_PATH', 'Project path must not be empty');
  }
  if (path.startsWith('/') || path.endsWith('/') || path.includes('\\') || path.includes('\0')) {
    throw new ProjectFsError('INVALID_PATH', `Project path must be relative POSIX: ${path}`);
  }
  if (textEncoder.encode(path).byteLength > MAX_PROJECT_PATH_BYTES) {
    throw new ProjectFsError('INVALID_PATH', `Project path exceeds ${MAX_PROJECT_PATH_BYTES} bytes`);
  }
  const segments = path.split('/');
  if (segments.some((segment) => !/^[A-Za-z][A-Za-z0-9_-]*(?:\.[A-Za-z][A-Za-z0-9_-]*)?$/.test(segment))) {
    throw new ProjectFsError('INVALID_PATH', `Invalid project path: ${path}`);
  }
  return segments.join('/');
}

function canonicalFilePath(path: string): string {
  const canonicalPath = canonicalProjectPath(path);
  if (!canonicalPath.endsWith('.kk')) {
    throw new ProjectFsError('INVALID_EXTENSION', `Koka project files must end in .kk: ${canonicalPath}`);
  }
  if (canonicalPath.slice(0, -3).includes('.')) {
    throw new ProjectFsError('INVALID_PATH', `Invalid Koka module path: ${canonicalPath}`);
  }
  return canonicalPath;
}

function canonicalDirectoryPath(path: string): string {
  const canonicalPath = canonicalProjectPath(path);
  if (canonicalPath.includes('.')) {
    throw new ProjectFsError('CONFLICT', `Project directories cannot contain extensions: ${canonicalPath}`);
  }
  return canonicalPath;
}

function canonicalModuleName(moduleName: string): string {
  return moduleNameFromPath(canonicalFilePath(modulePath(moduleName)));
}

export function modulePath(moduleName: string): string {
  return `${moduleName}.kk`;
}

export function moduleNameFromPath(path: string): string {
  return path.endsWith('.kk') ? path.slice(0, -3) : path;
}

function addParentDirectories(directories: string[], path: string): void {
  const segments = path.split('/');
  for (let length = 1; length < segments.length; length += 1) {
    const directory = segments.slice(0, length).join('/');
    if (!directories.includes(directory)) directories.push(directory);
  }
}

function assertPathAvailable(project: MutableProject, path: string, except?: string): void {
  if (path !== except && (project.files[path] !== undefined || project.directories.includes(path))) {
    throw new ProjectFsError('CONFLICT', `Project path already exists: ${path}`);
  }
  const prefix = `${path}/`;
  const collidesWithDescendant = Object.keys(project.files).some((filePath) => filePath.startsWith(prefix))
    || project.directories.some((directory) => directory.startsWith(prefix));
  if (path !== except && collidesWithDescendant) {
    throw new ProjectFsError('CONFLICT', `Project path has existing children: ${path}`);
  }
}

function replacePathPrefix(path: string, source: string, target: string): string {
  return path === source ? target : `${target}${path.slice(source.length)}`;
}

function openDatabase(name: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(PROJECT_STORE)) {
        request.result.createObjectStore(PROJECT_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error(`Could not open ${name}`));
    request.onblocked = () => reject(new Error(`Opening ${name} was blocked`));
  });
}

function readStoredProject(db: IDBDatabase): Promise<ProjectSnapshot | undefined> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PROJECT_STORE, 'readonly');
    const request = transaction.objectStore(PROJECT_STORE).get(CURRENT_PROJECT_KEY);
    request.onsuccess = () => resolve(request.result as ProjectSnapshot | undefined);
    request.onerror = () => reject(request.error ?? new Error('Could not read the current project'));
  });
}

function writeStoredProject(db: IDBDatabase, snapshot: ProjectSnapshot): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PROJECT_STORE, 'readwrite');
    transaction.objectStore(PROJECT_STORE).put(snapshot, CURRENT_PROJECT_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('Could not persist the project'));
    transaction.onabort = () => reject(transaction.error ?? new Error('Project persistence was aborted'));
  });
}
