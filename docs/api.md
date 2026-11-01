# API overview

A tour of the public modules. The declarations themselves carry doc comments;
see `src/kokaine/reactive.kk`, `src/kokaine/control.kk`,
`src/kokaine/resource.kk`, and `src/kokaine/async/web.kk`.

## API shape

- `create-root`, `root.dispose`, `update`, `sample`, and `dispatch` delimit
  root-scoped reactive capabilities. Root construction commits only after its
  initial queue drains successfully; a failed action or bootstrap retires the
  unpublished root and its registered resources.
- `signal`, `signal-by`, and `signal-always` select equality behavior.
- `derive`, `derive-by`, and `derive-always` create stateless read-only
  `memo<a>` values. Use `signal` plus `create-effect` when a value must
  accumulate across updates.
- `create-effect(root, track, apply)` tracks only `track`; reads performed by
  `apply` do not silently become dependencies.
- `on-cleanup` parks a one-shot resource continuation under the current owner.
  Disposers returned by `create-effect` finalize the complete owned subtree.
- `kokaine/reactive/integration` exposes `capture-reentry` and `reenter` so a
  host callback can re-enter the exact continuation generation that registered
  it. They restore Kokaine's reactive
  structure, not arbitrary lexical effect handlers. DOM listeners additionally
  park the user action in an opaque multi-shot event continuation; the host
  callback only snapshots the event and synchronously resumes that capability.
- `kokaine/reactive/async.run-async(root, action)` delimits one
  generation-bound browser task. Each
  await returns control to close the current turn; completion resumes under a
  newly installed async interpreter inside the captured generation. Its root
  is closed to `ui`: a later browser turn cannot reconstruct a lexical handler
  needed by a wider reactive root.
- `kokaine/async/web` supplies `sleep`, `yield`, `timeout`, Promise interop,
  `request`/`get`/`post`/`fetch`, and response status/body operations; it
  re-exports `parallel` and `race`. `kokaine/async/effects` supplies the
  cancelable `setup/await` protocol and cancellation scopes for adapter and
  combinator authors.
- `resource` and `resource-by` expose a tracked synchronous source, an
  untracked async loader, one atomic state signal, `latest`, `refresh`, and
  `cancel`.
- `view`, common tag helpers, live text/attributes/properties, `region`, and
  typed listeners form the HTML DSL. A listener callback has the closed
  `<signal-read,signal-write,ui,async,pure>` capability row; unsupported
  application effects are rejected instead of escaping into a later host turn.
- `branch` and `when` consume read-only memos and delimit conditional regions.
  List and vector `for` consume a sequential collection reader plus stable-key
  function; row item/index accessors are reactive but read-only.
- `mount`/`unmount` interpret a view into validated DOM ranges. Browser mounts
  likewise require a `root<<ui>>`, because a tree may contain a retained
  listener. A mount into a
  managed element inherits the exact same-root DOM generation which created
  that element, while `mount-independent` is the explicit opt-out. Mount
  construction is transactional, so a descendant bootstrap failure cannot
  leave caller-inaccessible DOM or listeners. Retired managed nodes keep only a
  numeric stale-owner tombstone: remount is rejected without retaining the old
  root or generation portal. `render` safely interprets the same value to a
  string.
- Native dialog and Popover elements stay in those same ranges even while the
  browser presents them in the top layer. Branch replacement, unmount, and
  `root.dispose` remove an open surface and retire its listeners exactly like
  any other owned DOM node; no portal or ownership exception is involved.

## A complete small application

```koka
module counter

import kokaine/reactive
import kokaine/html
import kokaine/dom

pub fun main()
  val (root,(count,doubled)) = create-root fn(root)
    val count = signal(root,0)
    val doubled = derive(root,0,fn() count.get * 2)
    (count,doubled)

  val page = view
    div(attrs=[class("counter")])
      button("Increment",attrs=[
        kind("button"),
        on-click(fn(_) count.modify(fn(n) n + 1))
      ])
      strong
        text { doubled.get.show }

  val stop = mount(root,query("#app"),page)
  ()
```

The indented `view` and tag blocks are normal Koka trailing-lambda syntax. Pass
attributes through the optional `attrs` argument; a single static text child
can use the string overload directly. A trailing lambda selects a live binding,
as in `text { doubled.get.show }`, while `dynamic` delimits live structure.
Tag helpers delimit nested `html` handlers. This synchronous builder algebraic
effect produces a `view` without retaining its continuation as the propagation
engine. When mounted, live text, attributes/properties, and dynamic regions
become continuation-backed effects. Static
structure is created once; each live binding owns the continuation-backed
effect targeting its node, while mount and dynamic scopes own DOM ranges.

For deterministic snapshots or server output, replace the DOM import with
`kokaine/ssr` and call `render(root,page)`.

## Responsive control flow

`kokaine/control` adds conditional and keyed structure without making the HTML
builder or either renderer collection-specific:

```koka
import kokaine/control

val ready = derive(root,False,fn() todos.get.length > 0)

when(ready,
  fn()
    ul
      for(fn() todos.get,fn(todo) todo/id(todo)) fn(item,index)
        li
          text { (index() + 1).show ++ ". " ++ todo/title(item()) }
  ,fallback=fn() p("Nothing to do."))
```

`branch(value, children)` rebuilds its conditional region when the supplied
memo publishes. `when(condition, children, fallback)` is its boolean form; the
fallback defaults to an empty view. Both accept tracked reads inside the child
builder and use ordinary dynamic-region lifetime.

The list and vector `for` overloads accept a tracked collection reader, a
business-key function, and a row builder. They walk their native collection in
sequence—the list overload is never converted to a vector. The row builder
receives read-only `item()` and `index()` accessors. When a retained key receives
a changed item or moves, those accessors publish the new value while the row's
DOM nodes, listener continuations, owned derivations/effects/resources, and
uncontrolled form state remain intact. Custom key comparison and item equality
functions are optional; equality suppresses needless item publications.

Keys must be unique within a snapshot. A duplicate throws and leaves the last
committed browser order and row sources unchanged; SSR rejects the same input.
The shared persistent balanced-tree index makes lookup and insertion
`O(log n)`, so a complete reconciliation is `O(n log n)` plus the required DOM
range moves. DOM interpretation is incremental and transactional; SSR renders
the current sequence once in source order.

## Further reading

- [Web async and Resource](async-and-resource.md)
- [Native dialog and Popover](top-layer.md)
- [Current guarantees](guarantees.md)

See [the architecture notes](architecture.md) for the scheduler, handlers,
generation-bound browser async, and host re-entry design.

The [continuation runtime decision record](continuation-runtime-plan.md)
records the capability assessment and invariants behind replacing the Observer
runtime with source-local indexes of actual continuation capabilities.
