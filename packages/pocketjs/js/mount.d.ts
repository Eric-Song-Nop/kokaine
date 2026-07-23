import type { MountOptions } from "@pocketjs/framework";

/** Mount a Koka entry and compose its cleanup with Pocket's native teardown. */
export declare function mountKokaine(
  start: () => () => void,
  options?: MountOptions
): () => void;
