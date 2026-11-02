# Kokaine

Kokaine is an experimental fine-grained reactive UI runtime for
[Koka](https://koka-lang.github.io/koka/doc/book.html). Signal reads and
writes and the HTML vocabulary are algebraic effects. A tracked read captures
the rest of the computation as a continuation, and a later change resumes
exactly that suffix, so there is no virtual DOM and no re-running of whole
components. Views are written in an effect-handled Koka DSL instead of JSX,
and render to the DOM or to an SSR string.

## Try it online

[Open the Kokaine Playground](https://kokaine-playground.pages.dev/). The Koka
compiler, the language server, and Kokaine all run in browser Workers, so
there is nothing to install. Edit the starter and press
**Command/Control+Enter** to compile and run it.

## Quick start

```sh
npm create @kokaine my-app
cd my-app
npm install
npm run dev
```

The generated project includes the `@kokaine/cli` scripts (`dev`, `build`,
`check`, `doctor`). The CLI downloads the pinned Koka compiler into a
checksummed user cache, so you do not need to install Koka yourself. See
[npm packages and workspaces](docs/npm-packages.md) and
[Editor setup](docs/editor-setup.md).

## A counter

This is `src/app/main.kk` from the generated application:

```koka
module app/main

import kokaine/reactive
import kokaine/html
import kokaine/dom

pub fun main()
  val (root,count) = create-root fn(root)
    signal(root,0)

  val page = view
    div(attrs=[class("counter")])
      h1("Kokaine")
      strong
        text { count.get.show }
      button("Increment",attrs=[
        kind("button"),
        on-click(fn(_) count.modify(fn(value) value + 1))
      ])

  val dispose = mount(root,query("#app"),page)
  ()
```

The indented blocks are ordinary Koka trailing lambdas. `text { ... }` is a
live binding: when `count` changes, only that text node updates. Swap
`kokaine/dom` for `kokaine/ssr` and call `render(root,page)` to produce an
HTML string instead.

## The model

Three primitives cover most applications:

- **`signal(root, initial)`** holds mutable state. Read it with `.get`, write
  it with `.set` or `.modify`. Equal writes are ignored.
- **`derive(root, initial, calc)`** is a read-only value computed from the
  signals `calc` reads. It is stateless and cannot write. Unlike Solid's
  `createMemo`, it takes an explicit initial value, and you read it with
  `.get`.
- **`create-effect(root, track, apply)`** reacts to changes. Only reads in
  `track` become dependencies; `apply` receives the tracked value and may
  write signals or touch the host. To accumulate values over time, keep them
  in a `signal` and update it from an effect.

Every reactive value belongs to a root or to the effect or view region that
created it. Retiring that owner disposes its effects, listeners, and cleanups
in one step. `kokaine/control` adds `branch`, `when`, and keyed `for` lists.
`kokaine/async/web` and `kokaine/resource` add direct-style async code
(`sleep`, `fetch`, `timeout`, and others) that is cancelled when its owner
goes away. See the [API overview](docs/api.md).

## Requirements

- **Koka** `>=3.2.3 <3.3.0`. Generated applications pin Koka 3.2.9, and the
  CLI installs it for you. The Playground runs a Koka 3.2.9 browser build.
- **Node.js** `>=22.12.0` for the CLI, the Playground, and repository
  tooling.

Kokaine is experimental. It does not yet provide hydration or suspense, and
the complete renderer targets the browser (`jsweb`). An experimental native
backend for [PocketJS](https://pocketjs.dev/) is described in
[PocketJS feasibility and boundaries](docs/pocketjs.md).

## Repository development

This repository uses [pnpm](https://pnpm.io/). Native tests need Koka 3.2.3–3.2.9,
Python 3, and `make`. Browser tests also need [`uv`](https://docs.astral.sh/uv/).

```sh
pnpm install
pnpm --filter @kokaine/playground dev   # run the Playground locally
make test-native                        # Koka test suites
make browser-install
make test-browser                       # Chromium checks via Playwright
```

[Repository development](docs/development.md) covers the full test matrix, the
examples, the Playground release workflow, and the interactive report.

## Learn more

- [API overview](docs/api.md): the public modules, a complete small
  application, and control flow.
- [Web async and Resource](docs/async-and-resource.md): direct-style async,
  Fetch, structured concurrency, and `resource`.
- [Native dialog and Popover](docs/top-layer.md): top-layer elements and
  their commands.
- [Current guarantees](docs/guarantees.md): what the runtime promises and the
  tests check.
- [Architecture](docs/architecture.md): the scheduler, effect handlers,
  lifetimes, and host re-entry.
- [Design notes](docs/design.md): why algebraic effects and continuations,
  current scope, and references.
- [Continuation runtime decision record](docs/continuation-runtime-plan.md).
- [npm packages and workspaces](docs/npm-packages.md) and
  [Editor setup](docs/editor-setup.md).
- [PocketJS backend](docs/pocketjs.md) (experimental).
- [Interactive report](docs/algebraic-effects-ui-report/index.html) (Chinese,
  with an English summary; run `make serve-report` to view it).

## License

[MIT](LICENSE)
