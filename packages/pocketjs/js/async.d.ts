export interface PocketAsyncDispatcher {
  /**
   * Queue work for the next Pocket frame turn. Returns false after the owning
   * mount has been disposed.
   */
  post(callback: () => void): boolean;

  /**
   * Complete host work when Pocket's virtual clock reaches the requested
   * safe-integer millisecond delay. A continuation posted by the callback is
   * flushed later in that frame. Delays round upward to a virtual-frame
   * boundary and therefore never complete early. The returned function
   * cancels the pending callback; false means the owning mount has already
   * been disposed.
   */
  afterMilliseconds(
    milliseconds: number,
    callback: () => void
  ): false | (() => void);
}

export interface PocketAsyncBridge {
  readonly version: 1;
  capture(): PocketAsyncDispatcher;
}

/**
 * Install the async bridge and bind its queue to the current Pocket lifecycle
 * owner. The returned disposer permanently closes captured dispatchers.
 */
export declare function createPocketAsyncScope(): () => void;
