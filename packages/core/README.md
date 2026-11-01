# `@kokaine/core`

The Kokaine runtime: a fine-grained reactive UI library for
[Koka](https://koka-lang.github.io/koka/doc/book.html) whose signal reads,
writes, and HTML vocabulary are algebraic effects. This package ships Koka
sources (`src/kokaine/...`) plus small JavaScript sidecars for the browser
renderer; the `koka` field in `package.json` lets
[`@kokaine/cli`](https://www.npmjs.com/package/@kokaine/cli) find them.

Start a new application with:

```sh
npm create @kokaine my-app
```

- Supported compilers: Koka `>=3.2.3 <3.3.0` (new applications pin 3.2.9).
- Target: `jsweb`.
- Modules: `kokaine/reactive`, `kokaine/html`, `kokaine/dom`, `kokaine/ssr`,
  `kokaine/control`, `kokaine/resource`, `kokaine/async`, and friends.

Documentation, the Playground, and examples live in the
[repository](https://github.com/Eric-Song-Nop/kokaine).

MIT licensed.
