HOMEBREW_KOKA := $(firstword $(wildcard /opt/homebrew/opt/koka/bin/koka /usr/local/opt/koka/bin/koka))
KOKA ?= $(if $(HOMEBREW_KOKA),$(HOMEBREW_KOKA),koka)
PYTHON ?= python3
UV ?= uv
NPM ?= npm
WRANGLER ?= npx wrangler
PLAYGROUND_PAGES_PROJECT ?= kokaine-playground

PROJECT_ROOT := $(patsubst %/,%,$(dir $(abspath $(lastword $(MAKEFILE_LIST)))))
RUN_LOCKED := $(PROJECT_ROOT)/support/run_locked.py
KOKA_FLAGS := -j1 -i./src
DIST_KOKA = $(PYTHON) "$(RUN_LOCKED)" dist/.koka-build.lock \
	$(KOKA) $(KOKA_FLAGS) --target=jsweb --outputdir=dist

.PHONY: test test-native test-tooling test-all test-wasm test-report build-counter build-top-layer build-keyed build-report build-window-fixture build-browser-fixtures browser-install test-browser serve serve-top-layer serve-keyed serve-report
.PHONY: playground-install playground-sync-assets playground-build playground-preview playground-deploy serve-playground

test: test-native

test-tooling:
	npm test

playground-install:
	$(NPM) install --workspace @kokaine/playground

playground-sync-assets: playground-install
	$(NPM) run assets:koka --workspace @kokaine/playground
	$(NPM) run assets:devtools --workspace @kokaine/playground

playground-build: playground-install
	$(NPM) run build --workspace @kokaine/playground

playground-preview: playground-build
	@echo "Static browser-only playground: http://127.0.0.1:4173/ (COOP/COEP enabled)"
	$(NPM) run preview --workspace @kokaine/playground

playground-deploy: playground-build
	$(WRANGLER) pages deploy packages/playground/dist --project-name=$(PLAYGROUND_PAGES_PROJECT)

serve-playground: playground-install
	@echo "Koka compiler and LSP run as browser WASM Workers; no native Koka, server, or container."
	$(NPM) run dev --workspace @kokaine/playground

test-native:
	$(KOKA) $(KOKA_FLAGS) -e test/root-construction.kk
	$(KOKA) $(KOKA_FLAGS) -e test/resource-finalization.kk
	$(KOKA) $(KOKA_FLAGS) -e test/internal-registry.kk
	$(KOKA) $(KOKA_FLAGS) -e test/internal-int-index.kk
	$(KOKA) $(KOKA_FLAGS) -e test/source-capture-registry.kk
	$(KOKA) $(KOKA_FLAGS) -e test/lifetime-foundation.kk
	$(KOKA) $(KOKA_FLAGS) -e test/work-transaction.kk
	$(KOKA) $(KOKA_FLAGS) -e test/integration-boundaries.kk
	$(KOKA) $(KOKA_FLAGS) -e test/async-host-turn.kk
	$(KOKA) $(KOKA_FLAGS) -e test/one-shot-task.kk
	$(KOKA) $(KOKA_FLAGS) -e test/cancellation-supervisor.kk
	$(KOKA) $(KOKA_FLAGS) -e test/trace-semantics.kk
	$(KOKA) $(KOKA_FLAGS) -e test/structural-scopes.kk
	$(KOKA) $(KOKA_FLAGS) -e test/targeted-settle.kk
	$(KOKA) $(KOKA_FLAGS) -e test/targeted-settle-canary.kk
	$(KOKA) $(KOKA_FLAGS) -e test/execution-planes.kk
	$(KOKA) $(KOKA_FLAGS) -e test/derived-structural.kk
	$(KOKA) $(KOKA_FLAGS) -e test/smoke.kk
	$(KOKA) $(KOKA_FLAGS) -e test/continuation.kk
	$(KOKA) $(KOKA_FLAGS) -e test/final-control-rollback.kk
	$(KOKA) $(KOKA_FLAGS) -e test/continuation-reentry.kk
	$(KOKA) $(KOKA_FLAGS) -e test/reactive.kk
	$(KOKA) $(KOKA_FLAGS) -e test/reactive-advanced.kk
	$(KOKA) $(KOKA_FLAGS) -e test/reactive-stress.kk
	$(KOKA) $(KOKA_FLAGS) -e test/html.kk
	$(KOKA) $(KOKA_FLAGS) -e test/key-index.kk
	$(KOKA) $(KOKA_FLAGS) -e test/control-flow.kk
	$(KOKA) $(KOKA_FLAGS) -e test/async-effects.kk
	$(KOKA) $(KOKA_FLAGS) -e test/structured-async.kk
	$(PYTHON) test/keyed_transaction_boundary.py
	$(PYTHON) test/event_effect_boundary.py $(KOKA)
	$(PYTHON) test/async_effect_boundary.py $(KOKA)
	$(PYTHON) test/run_locked.py
	$(PYTHON) test/make_parallel.py

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

build-window-fixture:
	$(DIST_KOKA) \
		--buildname=window-event-lifecycle test/window-event-lifecycle.kk

build-browser-fixtures: build-counter build-top-layer build-keyed
	$(DIST_KOKA) \
		--buildname=dom-errors test/dom-errors.kk
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
		--buildname=dom-async-runtime test/dom-async-runtime.kk
	$(DIST_KOKA) \
		--buildname=async-resource test/async-resource.kk
	$(DIST_KOKA) \
		--buildname=async-owner-registration test/async-owner-registration.kk
	$(DIST_KOKA) \
		--buildname=async-runtime-scale test/async-runtime-scale.kk

browser-install:
	$(UV) run --with playwright python -m playwright install chromium

test-browser: build-browser-fixtures
	$(UV) run --with playwright python test/browser_counter.py
	$(UV) run --with playwright python test/browser_top_layer.py
	$(UV) run --with playwright python test/browser_keyed.py
	$(UV) run --with playwright python test/browser_async.py

test-wasm:
	./support/wasmweb-proof/run.sh test

test-report: build-report build-counter build-window-fixture
	$(PYTHON) test/report_html.py
	$(UV) run --with playwright python test/browser_window.py
	$(UV) run --with playwright python test/browser_report.py

test-all: test-tooling test-native test-browser test-wasm test-report

serve: build-counter
	$(PYTHON) -m http.server 4173 --bind 127.0.0.1

serve-top-layer: build-top-layer
	@echo "Kokaine top-layer example: http://127.0.0.1:4173/examples/top-layer/"
	$(PYTHON) -m http.server 4173 --bind 127.0.0.1

serve-keyed: build-keyed
	@echo "Kokaine keyed example: http://127.0.0.1:4173/examples/keyed/"
	$(PYTHON) -m http.server 4173 --bind 127.0.0.1

serve-report: build-report build-counter
	@echo "Kokaine report: http://127.0.0.1:4173/docs/algebraic-effects-ui-report/"
	$(PYTHON) -m http.server 4173 --bind 127.0.0.1
