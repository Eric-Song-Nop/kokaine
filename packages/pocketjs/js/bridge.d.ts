export interface PocketRenderer {
  createElement(tag: string): object;
  createTextNode(value: string): object;
  detachNode(parent: object, node: object): void;
  getParentNode(node: object): object | undefined;
  replaceText(node: object, value: string): void;
  insertNode(parent: object, node: object, anchor?: object | null): void;
  release(node: object): void;
  setProp<T>(node: object, name: string, value: T, previous?: T): T | void;
}

/**
 * Install the versioned Kokaine ABI over PocketJS's public retained renderer.
 * Repeated compatible installs are reference-counted; the returned function
 * releases this installation without overwriting a later replacement.
 */
export declare function installPocketBridge(
  renderer?: PocketRenderer
): () => void;

/** Create the native node returned from Pocket's `mount` callback. */
export declare function createPocketRoot(start: () => void): object;

/** @internal Used by the mount transaction to roll back a detached root. */
export declare function discardPocketRoot(root: object): void;
