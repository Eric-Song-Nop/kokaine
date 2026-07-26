// Pocket's native QuickJS guest starts without browser or Node globals. Koka
// 3.2.x probes console/process while generated modules are evaluated, before
// Pocket mount installs its devtools console bridge.
const guest = globalThis;

if (!guest.console) {
  const ignore = () => {};
  guest.console = {
    log: ignore,
    info(...values) {
      guest.console?.log(...values);
    },
    warn: ignore,
    error: ignore
  };
}

// Browsers are detected by Koka before its Node branch and must not gain a
// process global. QuickJS has neither window nor process, so provide only the
// stdout shape emitted by Koka's console module.
if (guest.window === undefined && !guest.process) {
  guest.process = {
    stdout: {
      write(value) {
        guest.console?.log(String(value));
      }
    }
  };
}
