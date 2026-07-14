# Kokaine

Kokaine is an experimental fine-grained UI runtime for
[Koka](https://koka-lang.github.io/koka/doc/book.html). Signals, derivations,
effects, batching, and ownership are expressed with Koka's algebraic effects;
the browser layer uses a small Koka-native HTML DSL instead of JSX.

The project currently targets Koka 3.2.3. Its reactive core is backend-neutral.
The first browser adapter targets `jsweb`; the adapter boundary is deliberately
kept separate so an Emscripten-backed `wasmweb` host can be added without
changing signal semantics.

## Design goals

- Fine-grained dynamic dependency tracking with cached memos.
- Glitch-free, deduplicated propagation through converging graphs.
- Read-only memo computations enforced by effect rows.
- Synchronous nested batching and non-reentrant updates.
- Structured cleanup and idempotent root disposal.
- Safe text by default and explicit trusted HTML.
- No JSX, virtual DOM, code generation, or macro layer.

The API, examples, and build commands are documented as each executable layer
lands.

