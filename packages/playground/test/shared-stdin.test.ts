import { WASI, wasi } from '@bjorn3/browser_wasi_shim';
import { describe, expect, it } from 'vitest';

import {
  SHARED_INPUT_HEADER_BYTES,
  BlockingStdinFile,
  createSharedInputBuffer,
  installBlockingStdinPoll,
} from '../src/wasm/shared-stdin';

const MAX_PAYLOAD_BYTES = 64 * 1024;
const CLOCK_SUBSCRIPTION_BYTES = 48;

function writeFdReadSubscription(
  view: DataView,
  pointer: number,
  userdata: bigint,
): void {
  view.setBigUint64(pointer, userdata, true);
  view.setUint8(pointer + 8, wasi.EVENTTYPE_FD_READ);
  view.setUint32(pointer + 16, wasi.FD_STDIN, true);
}

function writeClockSubscription(
  view: DataView,
  pointer: number,
  userdata: bigint,
  timeoutNanoseconds: bigint,
): void {
  view.setBigUint64(pointer, userdata, true);
  view.setUint8(pointer + 8, wasi.EVENTTYPE_CLOCK);
  view.setUint32(pointer + 16, wasi.CLOCKID_MONOTONIC, true);
  view.setBigUint64(pointer + 24, timeoutNanoseconds, true);
  view.setUint16(pointer + 36, 0, true);
}

function createPollHarness() {
  const sharedBuffer = createSharedInputBuffer(MAX_PAYLOAD_BYTES);
  const stdin = new BlockingStdinFile(sharedBuffer, MAX_PAYLOAD_BYTES);
  const runtime = new WASI([], [], []);
  const memory = new WebAssembly.Memory({ initial: 1 });
  runtime.inst = { exports: { memory } };
  installBlockingStdinPoll(runtime, stdin);
  return {
    sharedBuffer,
    stdin,
    poll: runtime.wasiImport.poll_oneoff,
    view: new DataView(memory.buffer),
  };
}

describe('blocking WASI stdin readiness polling', () => {
  it('reports stdin instead of the timeout when a mixed select has input', () => {
    const { sharedBuffer, stdin, poll, view } = createPollHarness();
    const input = new TextEncoder().encode('Content-Length: 2\r\n\r\n{}');
    const state = new Int32Array(sharedBuffer, 0, 2);
    new Uint8Array(sharedBuffer, SHARED_INPUT_HEADER_BYTES).set(input);
    Atomics.store(state, 1, input.byteLength);
    Atomics.store(state, 0, 1);

    writeFdReadSubscription(view, 0, 11n);
    writeClockSubscription(view, CLOCK_SUBSCRIPTION_BYTES, 12n, 1_000_000_000n);

    expect(poll(0, 128, 2, 256)).toBe(wasi.ERRNO_SUCCESS);
    expect(view.getUint32(256, true)).toBe(1);
    expect(view.getBigUint64(128, true)).toBe(11n);
    expect(view.getUint8(138)).toBe(wasi.EVENTTYPE_FD_READ);
    expect(stdin.fd_read(MAX_PAYLOAD_BYTES)).toEqual({ ret: 0, data: input });
    expect(Atomics.load(state, 0)).toBe(0);
  });

  it('reports an expired clock without consuming an empty stdin frame', () => {
    const { poll, view } = createPollHarness();
    writeFdReadSubscription(view, 0, 21n);
    writeClockSubscription(view, CLOCK_SUBSCRIPTION_BYTES, 22n, 0n);

    expect(poll(0, 128, 2, 256)).toBe(wasi.ERRNO_SUCCESS);
    expect(view.getUint32(256, true)).toBe(1);
    expect(view.getBigUint64(128, true)).toBe(22n);
    expect(view.getUint8(138)).toBe(wasi.EVENTTYPE_CLOCK);
  });
});
