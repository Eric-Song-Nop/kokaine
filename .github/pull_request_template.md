## What and why

## How it was tested
- [ ] `make test-native` (Koka 3.2.3 or 3.2.9)
- [ ] `make test-browser` / `make test-report` if DOM, HTML, or SSR changed
- [ ] `pnpm test` if the CLI or create package changed
- [ ] Regenerated the Playground cache (`make playground-precompile`) if `packages/core/src/` changed
