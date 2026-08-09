const PROJECT_DOCUMENT_ROOT = '/workspace/';

export interface ProjectTextModel {
  readonly uri: string;
  getValue(): string;
  setValue(value: string): void;
}

export interface ProjectDocumentReference<Model extends ProjectTextModel> {
  readonly model: Model;
  dispose(): void;
}

export interface ProjectDocumentAdapter<Model extends ProjectTextModel> {
  create(uri: string, value: string): Promise<ProjectDocumentReference<Model>>;
}

export interface ProjectDocumentDelta {
  readonly added: readonly string[];
  readonly removed: readonly string[];
  readonly updated: readonly string[];
}

export class ProjectDocumentRegistry<Model extends ProjectTextModel> {
  static async open<Model extends ProjectTextModel>(
    adapter: ProjectDocumentAdapter<Model>,
    files: Readonly<Record<string, string>>,
  ): Promise<ProjectDocumentRegistry<Model>> {
    const registry = new ProjectDocumentRegistry(adapter);
    try {
      await registry.reconcile(files);
      return registry;
    } catch (error) {
      registry.dispose();
      throw error;
    }
  }

  readonly #adapter: ProjectDocumentAdapter<Model>;
  readonly #references = new Map<string, ProjectDocumentReference<Model>>();
  #disposed = false;

  private constructor(adapter: ProjectDocumentAdapter<Model>) {
    this.#adapter = adapter;
  }

  paths(): string[] {
    this.#assertActive();
    return [...this.#references.keys()].sort();
  }

  model(path: string): Model {
    this.#assertActive();
    const canonicalPath = canonicalDocumentPath(path);
    const reference = this.#references.get(canonicalPath);
    if (!reference) throw new Error(`Project document is not open: ${canonicalPath}`);
    return reference.model;
  }

  async reconcile(files: Readonly<Record<string, string>>): Promise<ProjectDocumentDelta> {
    this.#assertActive();
    const incoming = canonicalFiles(files);
    const currentPaths = new Set(this.#references.keys());
    const added = [...incoming.keys()].filter((path) => !currentPaths.has(path)).sort();
    const removed = [...currentPaths].filter((path) => !incoming.has(path)).sort();
    const updated = [...incoming.keys()].filter((path) => {
      const reference = this.#references.get(path);
      return reference !== undefined && reference.model.getValue() !== incoming.get(path);
    }).sort();

    const created = new Map<string, ProjectDocumentReference<Model>>();
    try {
      for (const path of added) {
        created.set(path, await this.#adapter.create(projectDocumentUri(path), incoming.get(path)!));
      }
    } catch (error) {
      for (const reference of created.values()) reference.dispose();
      throw error;
    }

    this.#assertActive();
    for (const path of removed) {
      this.#references.get(path)?.dispose();
      this.#references.delete(path);
    }
    for (const path of updated) this.#references.get(path)!.model.setValue(incoming.get(path)!);
    for (const [path, reference] of created) this.#references.set(path, reference);
    return { added, removed, updated };
  }

  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    for (const reference of this.#references.values()) reference.dispose();
    this.#references.clear();
  }

  #assertActive(): void {
    if (this.#disposed) throw new Error('Project document registry is disposed');
  }
}

export function projectDocumentUri(path: string): string {
  return `file://${PROJECT_DOCUMENT_ROOT}${canonicalDocumentPath(path)}`;
}

export function projectDocumentPath(uri: string): string {
  let parsed: URL;
  try {
    parsed = new URL(uri);
  } catch {
    throw new Error(`Invalid project document URI: ${uri}`);
  }
  if (parsed.protocol !== 'file:' || parsed.host !== '' || !parsed.pathname.startsWith(PROJECT_DOCUMENT_ROOT)) {
    throw new Error(`Document URI is outside the project workspace: ${uri}`);
  }
  return canonicalDocumentPath(decodeURIComponent(parsed.pathname.slice(PROJECT_DOCUMENT_ROOT.length)));
}

function canonicalFiles(files: Readonly<Record<string, string>>): Map<string, string> {
  const canonical = new Map<string, string>();
  for (const [inputPath, content] of Object.entries(files)) {
    if (typeof content !== 'string') throw new TypeError(`Project document is not text: ${inputPath}`);
    const path = canonicalDocumentPath(inputPath);
    if (canonical.has(path)) throw new Error(`Duplicate project document path: ${inputPath}`);
    canonical.set(path, content);
  }
  return new Map([...canonical].sort(([left], [right]) => left.localeCompare(right)));
}

function canonicalDocumentPath(path: string): string {
  if (
    typeof path !== 'string'
    || path.length === 0
    || path.startsWith('/')
    || path.endsWith('/')
    || path.includes('\\')
    || path.includes('\0')
  ) {
    throw new Error(`Invalid project document path: ${path}`);
  }
  const parts = path.split('/');
  if (
    !path.endsWith('.kk')
    || parts.some((part, index) => {
      const stem = index === parts.length - 1 ? part.slice(0, -3) : part;
      return !/^[A-Za-z][A-Za-z0-9_-]*$/.test(stem);
    })
  ) {
    throw new Error(`Invalid project document path: ${path}`);
  }
  return parts.join('/');
}
