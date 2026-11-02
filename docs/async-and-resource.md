# Web async and Resource

Import `kokaine/async/web` for browser adapters and structured combinators.
Import `kokaine/reactive/async` when starting a generation-owned task outside
the DOM listener interpreter.
DOM listeners already install `run-async`, so their callbacks can suspend in
direct style:

```koka
on("click",fn(_)
  val response = fetch(get("/api/value")).require-ok
  val body = response.text
  result.set(body)
)
```

The event turn publishes `result` changes made before the first await, then
returns to the browser. Code after the await runs in a later microtask turn
only if the generation which installed the listener is still live. Use
`sleep`, `yield`, `promise.await`, `fetch`, `parallel`, `race`, and `timeout`
inside the same direct-style `async` row. `setup/await` is the lower-level
boundary for another cancelable Web adapter: setup receives a completion
callback and returns a disposer. Use the public `run-async(root, action)`
delimiter when starting the same kind of task from another live reactive turn.
Every resumed suffix uses a fresh base async interpreter. Active tasks in one
lexical cancellation scope share a registry-backed supervisor and one
lifetime cleanup registration. Completion unlinks its task in O(1); cancel or
retirement first claims every sibling `TaskState`, detaches the supervisor, and
then unwinds every cancellation continuation and user `finally` before invoking
any host disposer. Scope lookup is direct while a separate intrusive registry
provides subtree enumeration; neither completion nor sibling-heavy setup scans
an accumulated task list.
Async owns a rank-2 `host-turn-runner` around each complete completion or
cancellation turn. The current closed Web surface supplies an identity runtime
function, but its polymorphic type still closes the family row before the turn
becomes a retained `ui` callback. Reactive re-entry then restores only the
captured reactive lifetime and handlers; neither layer fabricates an escaped
dynamic handler stack. DOM event callbacks use their separate closed event-K
boundary and do not pass through the Async host-turn runner.
Fetch header delivery installs a generation-owned disposer lease;
`response.text` and `response.json` transfer it only after the body await is
registered, while `response.discard` releases an unconsumed response explicitly.
`response.require-ok` uses that discard path before raising its HTTP exception.
Structured groups retain a second, one-shot discard capability for leases
acquired inside each child, so a sibling failure cannot strand an unreachable
Response until generation retirement. Generation leases and structured discard
registrations share the same O(1) intrusive registry and detach stale handles
from sibling payloads.

`kokaine/resource` packages the common tracked-source/load/state pattern:

```koka
val endpoint = signal(root,Just("/api/value"))
val data = resource(
  root,
  fn() endpoint.get,
  fn(url)
    val response = fetch(get(url))
    response.require-ok
    response.text
)
```

The source must finish synchronously as
`() -> signal-read maybe<s>`. The loader is deliberately closed as
`s -> <async,ui,exn> a`: it sees the selected snapshot but cannot create a
reactive dependency before or after suspension. Observe the atomic
`resource-state<a>` through `data.state`:

```text
Unresolved
Pending(previous : maybe<a>)
Ready(value : a)
Failed(error : exception, previous : maybe<a>)
```

`data.latest` returns the current or last successful value. `data.refresh`
starts a fresh generation without discarding that value, and `data.cancel`
retires an active request. `resource-by` accepts explicit source equality;
equal snapshots do not restart or cancel the active loader. Loader
self-cancellation is terminal too: it restores the previous value (or
`Unresolved`) during unwinding and never strands the Resource in `Pending`.
Host values acquired through `async-own` are promoted from the request into
the Resource on success. The previous value therefore remains live across
refresh, failure, and cancellation; replacement, a `Nothing` source, or root
retirement releases its lease exactly once. Calling the returned release
action explicitly transfers that ownership back to application code.

See [Generation-bound async task leases](architecture.md#generation-bound-async-task-leases)
in the architecture notes for the ownership design behind this behavior.
