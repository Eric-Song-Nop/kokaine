# Supported compilers: Koka >=3.2.3 <3.3.0; CI tests 3.2.3 and 3.2.9. Run
# `make print-managed-koka [KOKA_VERSION=3.2.9]` for the checksummed compiler
# the CLI installs.
KOKA ?= koka
KOKA_VERSION ?= 3.2.3
PYTHON ?= python3
UV ?= uv
PLAYWRIGHT ?= playwright==1.61.0
PNPM ?= pnpm
BUN ?= bun
NODE ?= node
WRANGLER ?= npx wrangler
PLAYGROUND_PAGES_PROJECT ?= kokaine-playground
PLAYGROUND_PAGES_BRANCH ?= main
POCKETJS_CHECKOUT ?=
POCKETJS_WEB_PORT ?= 8130
POCKETJS_VERSION := 0.6.0
POCKETJS_COMMIT := 1f848dcdb2629e3c6373710cd0aa16d775ea2ad3

PROJECT_ROOT := $(patsubst %/,%,$(dir $(abspath $(lastword $(MAKEFILE_LIST)))))
RUN_LOCKED := $(PROJECT_ROOT)/support/run_locked.py
KOKA_FLAGS := -j1 -i./packages/core/src
# Koka test programs exit 0 on an uncaught exception; this wrapper does not.
KOKA_TEST = $(PYTHON) "$(PROJECT_ROOT)/support/run_koka_test.py" $(KOKA) $(KOKA_FLAGS) -e
DIST_KOKA = $(PYTHON) "$(RUN_LOCKED)" dist/.koka-build.lock \
	$(KOKA) $(KOKA_FLAGS) --target=jsweb --outputdir=dist

.PHONY: check-koka print-managed-koka bench-keyed test test-native test-sidecar test-pocketjs-runtime test-pocketjs-bridge test-pocketjs-bundle test-pocketjs-wasm test-pocketjs-browser test-tooling test-all test-wasm test-report build-counter build-top-layer build-keyed build-report build-pocketjs-example compile-pocketjs-example build-window-fixture build-browser-fixtures browser-install test-browser bench-browser serve serve-pocketjs-example serve-top-layer serve-keyed serve-report
.PHONY: playground-install playground-assets playground-precompile playground-sync-assets playground-build playground-preview playground-release playground-deploy serve-playground

test: test-native test-pocketjs-runtime

check-koka:
	@version="$$($(KOKA) --version 2>/dev/null | sed -n 's/^version: //p')"; \
	case "$$version" in \
		3.2.[3-9]) ;; \
		*) echo "Kokaine needs Koka >=3.2.3 <3.3.0, but '$(KOKA)' reports '$${version:-nothing}'."; \
		   echo "Use the managed compiler: make KOKA=\"\$$(make -s print-managed-koka)\" ..."; \
		   exit 2 ;; \
	esac

print-managed-koka:
	@$(NODE) --input-type=module -e "import { resolveCompiler } from './packages/cli/src/toolchain.js'; const { binary } = await resolveCompiler('$(KOKA_VERSION)'); console.log(binary);"

# `pnpm test` covers the CLI packages and the JavaScript sidecars that Koka
# pastes into generated modules (`extern import { js file ... }`).
test-tooling:
	$(PNPM) test

test-sidecar:
	$(PNPM) run test:sidecar

playground-install:
	$(PNPM) install --frozen-lockfile

playground-precompile: playground-install
	$(PNPM) --filter @kokaine/playground run precompile:kokaine

# Fetch (or restore from the local cache) and verify the untracked pinned assets.
playground-assets: playground-install
	$(PNPM) --filter @kokaine/playground run assets

# Rebuild the runtime bundle and rewrite public/koka/assets.json (pin changes).
playground-sync-assets: playground-install
	$(PNPM) --filter @kokaine/playground run assets:koka:update
	$(PNPM) --filter @kokaine/playground run assets:devtools

playground-build: playground-install
	$(PNPM) --filter @kokaine/playground run build

playground-preview: playground-build
	@echo "Static browser-only playground: http://127.0.0.1:4173/ (COOP/COEP enabled)"
	$(PNPM) --filter @kokaine/playground run preview

playground-release: playground-precompile
	$(PNPM) --filter @kokaine/playground run test:wasm
	$(PNPM) --filter @kokaine/playground run build

playground-deploy: playground-release
	$(WRANGLER) pages deploy "packages/playground/dist" \
		--project-name="$(PLAYGROUND_PAGES_PROJECT)" \
		--branch="$(PLAYGROUND_PAGES_BRANCH)"

serve-playground: playground-install
	@echo "Koka compiler and LSP run as browser WASM Workers; no native Koka, server, or container."
	$(PNPM) --filter @kokaine/playground run dev

# test/all.kk imports every native suite so the shared runtime compiles once,
# and exits nonzero when any suite fails.
test-native: check-koka
	$(KOKA_TEST) test/all.kk
	$(PYTHON) "$(PROJECT_ROOT)/support/run_koka_test.py" \
		$(KOKA) $(KOKA_FLAGS) --target=jsnode -e test/structured-escape.kk
	$(PYTHON) test/keyed_transaction_boundary.py
	$(PYTHON) test/event_effect_boundary.py $(KOKA)
	$(PYTHON) test/async_effect_boundary.py $(KOKA)
	$(PYTHON) test/publication_effect_boundary.py $(KOKA)
	$(PYTHON) test/run_locked.py
	$(PYTHON) test/make_parallel.py

test-pocketjs-runtime: check-koka
	$(PYTHON) "$(PROJECT_ROOT)/support/run_koka_test.py" \
		$(KOKA) $(KOKA_FLAGS) -i./packages/pocketjs/src \
		--target=jsnode -e test/pocketjs-runtime.kk
	$(PYTHON) test/pocketjs_boundary.py

test-pocketjs-bridge:
	$(BUN) test packages/pocketjs/test/bridge.test.js

build-counter:
	$(DIST_KOKA) \
		--buildname=counter examples/counter.kk

build-top-layer:
	$(DIST_KOKA) \
		--buildname=top-layer examples/top-layer.kk

build-keyed:
	$(DIST_KOKA) \
		--buildname=keyed examples/keyed.kk

build-report:
	$(DIST_KOKA) \
		--buildname=report examples/report.kk

build-pocketjs-example:
	$(KOKA) $(KOKA_FLAGS) -i./packages/pocketjs/src \
		-i./examples/pocketjs --target=jsweb \
		--outputdir=examples/pocketjs/generated \
		--buildname=kokaine-pocket-demo examples/pocketjs/app.kk

compile-pocketjs-example: build-pocketjs-example
	@if [ -z "$(POCKETJS_CHECKOUT)" ]; then \
		echo "Set POCKETJS_CHECKOUT to a PocketJS v0.6.0 checkout with bun install complete"; \
		exit 2; \
	fi
	@if [ "$$(cd "$(POCKETJS_CHECKOUT)" && $(NODE) -p "require('./package.json').version")" != "$(POCKETJS_VERSION)" ]; then \
		echo "POCKETJS_CHECKOUT must contain PocketJS $(POCKETJS_VERSION)"; \
		exit 2; \
	fi
	@if [ "$$(git -C "$(POCKETJS_CHECKOUT)" rev-parse HEAD 2>/dev/null)" != "$(POCKETJS_COMMIT)" ]; then \
		echo "POCKETJS_CHECKOUT must be the exact PocketJS v$(POCKETJS_VERSION) tag ($(POCKETJS_COMMIT))"; \
		exit 2; \
	fi
	@if ! git -C "$(POCKETJS_CHECKOUT)" diff --quiet HEAD --; then \
		echo "POCKETJS_CHECKOUT has tracked changes; exact verification requires a clean v$(POCKETJS_VERSION) checkout"; \
		exit 2; \
	fi
	cd "$(POCKETJS_CHECKOUT)" && $(BUN) scripts/pocket.ts compile \
		--target psp \
		--project-root "$(PROJECT_ROOT)/examples/pocketjs" \
		--manifest "$(PROJECT_ROOT)/examples/pocketjs/pocket.json" \
		--outdir "$(PROJECT_ROOT)/examples/pocketjs/dist"

test-pocketjs-bundle: compile-pocketjs-example
	$(NODE) test/pocketjs-bundle-smoke.mjs \
		"$(PROJECT_ROOT)/examples/pocketjs/dist/kokaine-pocket-demo.js"

test-pocketjs-wasm: test-pocketjs-bundle
	cd "$(POCKETJS_CHECKOUT)" && $(BUN) scripts/wasm.ts
	$(BUN) test/pocketjs-wasm-smoke.mjs \
		"$(PROJECT_ROOT)/examples/pocketjs/dist/kokaine-pocket-demo.js" \
		"$(PROJECT_ROOT)/examples/pocketjs/dist/kokaine-pocket-demo.pak" \
		"$(POCKETJS_CHECKOUT)"

test-pocketjs-browser: test-pocketjs-bundle
	$(UV) run --with "$(PLAYWRIGHT)" python test/browser_pocketjs.py

build-window-fixture:
	$(DIST_KOKA) \
		--buildname=window-event-lifecycle test/window-event-lifecycle.kk
	$(DIST_KOKA) \
		--buildname=window-monitor test/window-monitor.kk

build-browser-fixtures: build-counter build-top-layer build-keyed
	$(DIST_KOKA) \
		--buildname=dom-errors test/dom-errors.kk
	$(DIST_KOKA) \
		--buildname=dom-namespaces test/dom-namespaces.kk
	$(DIST_KOKA) \
		--buildname=dom-lifecycle test/dom-lifecycle.kk
	$(DIST_KOKA) \
		--buildname=dom-range-safety test/dom-range-safety.kk
	$(DIST_KOKA) \
		--buildname=dom-mount-rollback test/dom-mount-rollback.kk
	$(DIST_KOKA) \
		--buildname=dom-ownership test/dom-ownership.kk
	$(DIST_KOKA) \
		--buildname=dom-event-continuation test/dom-event-continuation.kk
	$(DIST_KOKA) \
		--buildname=dom-top-layer test/dom-top-layer.kk
	$(DIST_KOKA) \
		--buildname=dom-keyed test/dom-keyed.kk
	$(DIST_KOKA) \
		--buildname=keyed-bench test/keyed-bench.kk
	$(DIST_KOKA) \
		--buildname=dom-async-runtime test/dom-async-runtime.kk
	$(DIST_KOKA) \
		--buildname=async-resource test/async-resource.kk
	$(DIST_KOKA) \
		--buildname=async-owner-registration test/async-owner-registration.kk
	$(DIST_KOKA) \
		--buildname=async-runtime-scale test/async-runtime-scale.kk
	$(DIST_KOKA) \
		--buildname=dom-perf-mount test/dom-perf-mount.kk

browser-install:
	$(UV) run --with "$(PLAYWRIGHT)" python -m playwright install chromium

test-browser: build-browser-fixtures
	$(UV) run --with "$(PLAYWRIGHT)" python test/browser_counter.py
	$(UV) run --with "$(PLAYWRIGHT)" python test/browser_top_layer.py
	$(UV) run --with "$(PLAYWRIGHT)" python test/browser_keyed.py
	$(UV) run --with "$(PLAYWRIGHT)" python test/browser_async.py

# Keyed reorder benchmark: row moves and timings for drag/reverse/shuffle/append.
bench-keyed:
	$(DIST_KOKA) \
		--buildname=keyed-bench test/keyed-bench.kk
	$(UV) run --with "$(PLAYWRIGHT)" python test/bench_keyed.py
# Not part of test-all: timings are machine-dependent. Prints median mount,
# region toggle and live-update times plus heap allocation estimates.
bench-browser: build-browser-fixtures
	$(UV) run --with "$(PLAYWRIGHT)" python test/browser_perf_mount.py

test-wasm:
	./support/wasmweb-proof/run.sh test

test-report: build-report build-counter build-window-fixture
	$(PYTHON) test/report_html.py
	$(UV) run --with "$(PLAYWRIGHT)" python test/browser_window.py
	$(UV) run --with "$(PLAYWRIGHT)" python test/browser_report.py

test-all: test-tooling test test-pocketjs-bridge test-browser test-wasm test-report

serve: build-counter
	$(PYTHON) -m http.server 4173 --bind 127.0.0.1

serve-pocketjs-example: test-pocketjs-bundle
	@echo "Kokaine PocketJS browser example: http://127.0.0.1:$(POCKETJS_WEB_PORT)/"
	PORT="$(POCKETJS_WEB_PORT)" \
		$(BUN) examples/pocketjs/serve.ts

serve-top-layer: build-top-layer
	@echo "Kokaine top-layer example: http://127.0.0.1:4173/examples/top-layer/"
	$(PYTHON) -m http.server 4173 --bind 127.0.0.1

serve-keyed: build-keyed
	@echo "Kokaine keyed example: http://127.0.0.1:4173/examples/keyed/"
	$(PYTHON) -m http.server 4173 --bind 127.0.0.1

serve-report: build-report build-counter
	@echo "Kokaine report: http://127.0.0.1:4173/docs/algebraic-effects-ui-report/"
	$(PYTHON) -m http.server 4173 --bind 127.0.0.1
