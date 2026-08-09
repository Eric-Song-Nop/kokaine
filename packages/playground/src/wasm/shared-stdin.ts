import { type WASI, wasi } from '@bjorn3/browser_wasi_shim';

export const SHARED_INPUT_HEADER_BYTES = 8;
export const SHARED_INPUT_FRAME_OVERHEAD_BYTES = 256;

/** Create the bounded one-frame channel consumed synchronously by a WASI worker. */
export function createSharedInputBuffer(maxPayloadBytes: number): SharedArrayBuffer {
  return new SharedArrayBuffer(
    SHARED_INPUT_HEADER_BYTES + maxPayloadBytes + SHARED_INPUT_FRAME_OVERHEAD_BYTES,
  );
}

/** Minimal fd surface required by browser_wasi_shim. */
export class WasiFdStubs {
  fd_fdstat_get(): { ret: number; fdstat: wasi.Fdstat | null } {
    return { ret: 0, fdstat: null };
  }
  fd_close() { return 0; }
  fd_read(_length: number): { ret: number; data: Uint8Array<ArrayBufferLike> } {
    return { ret: 8, data: new Uint8Array() };
  }
  fd_write(_data: Uint8Array) { return { ret: 8, nwritten: 0 }; }
  fd_seek(_offset: bigint, _whence: number) { return { ret: 8, offset: 0n }; }
  fd_tell() { return { ret: 0, offset: 0n }; }
  fd_sync() { return 0; }
  fd_filestat_get() { return { ret: 0, filestat: null }; }
  fd_pread(_length: number, _offset: bigint) {
    return { ret: 8, data: new Uint8Array() };
  }
  fd_pwrite(_data: Uint8Array, _offset: bigint) { return { ret: 8, nwritten: 0 }; }
  fd_allocate(_offset: bigint, _length: bigint) { return 0; }
  fd_fdstat_set_flags(_flags: number) { return 0; }
  fd_fdstat_set_rights(_base: bigint, _inheriting: bigint) { return 0; }
  fd_filestat_set_size(_size: bigint) { return 0; }
  fd_filestat_set_times(_access: bigint, _modified: bigint, _flags: number) { return 0; }
  fd_prestat_get() { return { ret: 8, prestat: null }; }
  fd_readdir_single(_cookie: bigint) { return { ret: 8, dirent: null }; }
  path_create_directory(_path: string) { return 8; }
  path_filestat_get(_flags: number, _path: string) { return { ret: 8, filestat: null }; }
  path_filestat_set_times(
    _flags: number,
    _path: string,
    _access: bigint,
    _modified: bigint,
    _timeFlags: number,
  ) { return 8; }
  path_lookup(_path: string, _flags: number) { return { ret: 8, inode_obj: null }; }
  path_link(_path: string, _inode: unknown, _force: boolean) { return 8; }
  path_open(..._arguments: unknown[]) { return { ret: 8, fd_obj: null }; }
  path_readlink(_path: string) { return { ret: 8, data: null }; }
  path_remove_directory(_path: string) { return 8; }
  path_unlink(_path: string) { return { ret: 8, inode_obj: null }; }
  path_unlink_file(_path: string) { return 8; }
}

/** Blocking stdin fd for a WASI process that owns its dedicated Web Worker. */
export class BlockingStdinFile extends WasiFdStubs {
  private readonly state: Int32Array;
  private readonly bytes: Uint8Array;
  private pending = new Uint8Array();
  private offset = 0;

  constructor(
    sharedBuffer: SharedArrayBuffer,
    private readonly maxPayloadBytes: number,
  ) {
    super();
    this.state = new Int32Array(sharedBuffer, 0, 2);
    this.bytes = new Uint8Array(sharedBuffer, SHARED_INPUT_HEADER_BYTES);
  }
  override fd_fdstat_get() {
    return {
      ret: 0,
      fdstat: new wasi.Fdstat(wasi.FILETYPE_CHARACTER_DEVICE, 0),
    };
  }


  override fd_read(length: number): { ret: number; data: Uint8Array<ArrayBufferLike> } {
    if (!Number.isSafeInteger(length) || length <= 0) {
      return { ret: 0, data: new Uint8Array() };
    }
    if (this.offset < this.pending.byteLength) return this.readPending(length);

    const flag = Atomics.load(this.state, 0);
    if (flag === 0) return { ret: wasi.ERRNO_AGAIN, data: new Uint8Array() };
    if (flag !== 1) throw new Error(`Invalid WASI stdin state: ${flag}`);

    const dataLength = Atomics.load(this.state, 1);
    if (
      !Number.isSafeInteger(dataLength)
      || dataLength <= 0
      || dataLength > this.maxPayloadBytes + SHARED_INPUT_FRAME_OVERHEAD_BYTES
      || dataLength > this.bytes.byteLength
    ) {
      this.releaseFrame();
      throw new Error(`Invalid WASI stdin frame length: ${dataLength}`);
    }

    this.pending = this.bytes.slice(0, dataLength);
    this.offset = 0;
    this.releaseFrame();
    return this.readPending(length);
  }

  waitUntilReadable(timeoutMs?: number): boolean {
    if (this.offset < this.pending.byteLength) return true;
    const finiteTimeout = timeoutMs !== undefined && Number.isFinite(timeoutMs);
    const deadline = finiteTimeout ? performance.now() + Math.max(0, timeoutMs) : 0;
    let flag = Atomics.load(this.state, 0);
    while (flag !== 1) {
      if (flag !== 0) throw new Error(`Invalid WASI stdin state: ${flag}`);
      if (finiteTimeout) {
        const remaining = deadline - performance.now();
        if (remaining <= 0) return false;
        Atomics.wait(this.state, 0, 0, remaining);
      } else {
        Atomics.wait(this.state, 0, 0);
      }
      flag = Atomics.load(this.state, 0);
    }
    return true;
  }

  private releaseFrame(): void {
    Atomics.store(this.state, 1, 0);
    Atomics.store(this.state, 0, 0);
    Atomics.notify(this.state, 0);
  }

  private readPending(length: number): { ret: number; data: Uint8Array<ArrayBufferLike> } {
    const end = Math.min(this.offset + length, this.pending.byteLength);
    const data = this.pending.slice(this.offset, end);
    this.offset = end;
    if (this.offset >= this.pending.byteLength) {
      this.pending = new Uint8Array();
      this.offset = 0;
    }
    return { ret: 0, data };
  }
}

const WASI_SUBSCRIPTION_BYTES = 48;
const WASI_EVENT_BYTES = 32;
const MAX_POLL_SUBSCRIPTIONS = 64;

function clockWaitMilliseconds(subscription: wasi.Subscription): number | undefined {
  let remainingNanoseconds = subscription.timeout;
  if ((subscription.flags & wasi.SUBCLOCKFLAGS_SUBSCRIPTION_CLOCK_ABSTIME) !== 0) {
    let nowNanoseconds: bigint;
    if (subscription.clockid === wasi.CLOCKID_MONOTONIC) {
      nowNanoseconds = BigInt(Math.floor(performance.now() * 1_000_000));
    } else if (subscription.clockid === wasi.CLOCKID_REALTIME) {
      nowNanoseconds = BigInt(Date.now()) * 1_000_000n;
    } else {
      return undefined;
    }
    remainingNanoseconds -= nowNanoseconds;
  }
  if (remainingNanoseconds <= 0n) return 0;
  return Number(remainingNanoseconds) / 1_000_000;
}

/** Add stdin readiness polling missing from browser_wasi_shim. */
export function installBlockingStdinPoll(runtime: WASI, stdin: BlockingStdinFile): void {
  const fallback = runtime.wasiImport.poll_oneoff;
  if (typeof fallback !== 'function') throw new Error('WASI poll_oneoff is unavailable');

  runtime.wasiImport.poll_oneoff = (
    inputPointer: number,
    outputPointer: number,
    subscriptionCount: number,
    eventCountPointer: number,
  ): number => {
    if (
      !Number.isSafeInteger(subscriptionCount)
      || subscriptionCount <= 0
      || subscriptionCount > MAX_POLL_SUBSCRIPTIONS
    ) {
      return wasi.ERRNO_INVAL;
    }

    const view = new DataView(runtime.inst.exports.memory.buffer);
    const reads: wasi.Subscription[] = [];
    const clocks: { subscription: wasi.Subscription; waitMs: number }[] = [];
    for (let index = 0; index < subscriptionCount; index += 1) {
      const subscription = wasi.Subscription.read_bytes(
        view,
        inputPointer + index * WASI_SUBSCRIPTION_BYTES,
      );
      if (
        subscription.eventtype === wasi.EVENTTYPE_FD_READ
        && subscription.clockid === wasi.FD_STDIN
      ) {
        reads.push(subscription);
        continue;
      }
      if (subscription.eventtype === wasi.EVENTTYPE_CLOCK) {
        const waitMs = clockWaitMilliseconds(subscription);
        if (waitMs !== undefined) {
          clocks.push({ subscription, waitMs });
          continue;
        }
      }

      const result = fallback(
        inputPointer,
        outputPointer,
        subscriptionCount,
        eventCountPointer,
      );
      return typeof result === 'number' ? result : wasi.ERRNO_INVAL;
    }

    if (reads.length === 0) {
      const result = fallback(
        inputPointer,
        outputPointer,
        subscriptionCount,
        eventCountPointer,
      );
      return typeof result === 'number' ? result : wasi.ERRNO_INVAL;
    }

    const minimumClockWait = clocks.reduce(
      (minimum, clock) => Math.min(minimum, clock.waitMs),
      Number.POSITIVE_INFINITY,
    );
    const readable = stdin.waitUntilReadable(minimumClockWait);
    const selected = readable
      ? reads
      : clocks
        .filter((clock) => clock.waitMs <= minimumClockWait)
        .map((clock) => clock.subscription);
    if (selected.length === 0) return wasi.ERRNO_INVAL;

    new Uint8Array(
      view.buffer,
      outputPointer,
      selected.length * WASI_EVENT_BYTES,
    ).fill(0);
    selected.forEach((subscription, index) => {
      new wasi.Event(
        subscription.userdata,
        wasi.ERRNO_SUCCESS,
        subscription.eventtype,
      ).write_bytes(view, outputPointer + index * WASI_EVENT_BYTES);
    });
    view.setUint32(eventCountPointer, selected.length, true);
    return wasi.ERRNO_SUCCESS;
  };
}
