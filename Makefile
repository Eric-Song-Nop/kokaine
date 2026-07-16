HOMEBREW_KOKA := $(firstword $(wildcard /opt/homebrew/opt/koka/bin/koka /usr/local/opt/koka/bin/koka))
KOKA ?= $(if $(HOMEBREW_KOKA),$(HOMEBREW_KOKA),koka)
UV ?= uv

KOKA_FLAGS := -j1 -i./src

.PHONY: test test-native test-all test-wasm test-report build-counter build-top-layer build-report build-browser-fixtures browser-install test-browser serve serve-top-layer serve-report

test: test-native

test-native:
	$(KOKA) $(KOKA_FLAGS) -e test/root-construction.kk
	$(KOKA) $(KOKA_FLAGS) -e test/resource-finalization.kk
	$(KOKA) $(KOKA_FLAGS) -e test/internal-registry.kk
	$(KOKA) $(KOKA_FLAGS) -e test/source-capture-registry.kk
	$(KOKA) $(KOKA_FLAGS) -e test/lifetime-foundation.kk
	$(KOKA) $(KOKA_FLAGS) -e test/work-transaction.kk
	$(KOKA) $(KOKA_FLAGS) -e test/application-runner.kk
	$(KOKA) $(KOKA_FLAGS) -e test/one-shot-task.kk
	$(KOKA) $(KOKA_FLAGS) -e test/cancellation-supervisor.kk
	$(KOKA) $(KOKA_FLAGS) -e test/trace-semantics.kk
	$(KOKA) $(KOKA_FLAGS) -e test/structural-scopes.kk
	$(KOKA) $(KOKA_FLAGS) -e test/targeted-settle.kk
	$(KOKA) $(KOKA_FLAGS) -e test/targeted-settle-canary.kk
	$(KOKA) $(KOKA_FLAGS) -e test/execution-planes.kk
	$(KOKA) $(KOKA_FLAGS) -e test/stateful-entry-gates.kk
	$(KOKA) $(KOKA_FLAGS) -e test/entry-targeted-settle.kk
	$(KOKA) $(KOKA_FLAGS) -e test/entry-structural.kk
	$(KOKA) $(KOKA_FLAGS) -e test/smoke.kk
	$(KOKA) $(KOKA_FLAGS) -e test/continuation.kk
	$(KOKA) $(KOKA_FLAGS) -e test/final-control-rollback.kk
	$(KOKA) $(KOKA_FLAGS) -e test/continuation-reentry.kk
	$(KOKA) $(KOKA_FLAGS) -e test/reactive.kk
	$(KOKA) $(KOKA_FLAGS) -e test/reactive-advanced.kk
	$(KOKA) $(KOKA_FLAGS) -e test/reactive-stress.kk
	$(KOKA) $(KOKA_FLAGS) -e test/html.kk
	python3 test/event_effect_boundary.py $(KOKA)
	python3 test/make_parallel.py

build-counter:
	mkdir -p dist
	$(KOKA) $(KOKA_FLAGS) --target=jsweb --outputdir=dist \
		--buildname=counter examples/counter.kk

build-top-layer:
	mkdir -p dist
	$(KOKA) $(KOKA_FLAGS) --target=jsweb --outputdir=dist \
		--buildname=top-layer examples/top-layer.kk

build-report:
	mkdir -p dist
	$(KOKA) $(KOKA_FLAGS) --target=jsweb --outputdir=dist \
		--buildname=report examples/report.kk

build-browser-fixtures: build-counter
	$(KOKA) $(KOKA_FLAGS) --target=jsweb --outputdir=dist \
		--buildname=top-layer examples/top-layer.kk
	$(KOKA) $(KOKA_FLAGS) --target=jsweb --outputdir=dist \
		--buildname=dom-errors test/dom-errors.kk
	$(KOKA) $(KOKA_FLAGS) --target=jsweb --outputdir=dist \
		--buildname=dom-lifecycle test/dom-lifecycle.kk
	$(KOKA) $(KOKA_FLAGS) --target=jsweb --outputdir=dist \
		--buildname=dom-range-safety test/dom-range-safety.kk
	$(KOKA) $(KOKA_FLAGS) --target=jsweb --outputdir=dist \
		--buildname=dom-mount-rollback test/dom-mount-rollback.kk
	$(KOKA) $(KOKA_FLAGS) --target=jsweb --outputdir=dist \
		--buildname=dom-ownership test/dom-ownership.kk
	$(KOKA) $(KOKA_FLAGS) --target=jsweb --outputdir=dist \
		--buildname=dom-event-continuation test/dom-event-continuation.kk
	$(KOKA) $(KOKA_FLAGS) --target=jsweb --outputdir=dist \
		--buildname=dom-top-layer test/dom-top-layer.kk

browser-install:
	$(UV) run --with playwright python -m playwright install chromium

test-browser: build-browser-fixtures
	$(UV) run --with playwright python test/browser_counter.py
	$(UV) run --with playwright python test/browser_top_layer.py

test-wasm:
	./support/wasmweb-proof/run.sh test

test-report: build-report
	node --check docs/algebraic-effects-ui-report/report.js
	python3 test/report_html.py

test-all: test-native test-browser test-wasm test-report

serve: build-counter
	python3 -m http.server 4173 --bind 127.0.0.1

serve-top-layer: build-top-layer
	@echo "Kokaine top-layer example: http://127.0.0.1:4173/examples/top-layer/"
	python3 -m http.server 4173 --bind 127.0.0.1

serve-report: build-report build-counter
	@echo "Kokaine report: http://127.0.0.1:4173/docs/algebraic-effects-ui-report/"
	python3 -m http.server 4173 --bind 127.0.0.1
