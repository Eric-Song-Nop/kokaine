HOMEBREW_KOKA := $(firstword $(wildcard /opt/homebrew/opt/koka/bin/koka /usr/local/opt/koka/bin/koka))
KOKA ?= $(if $(HOMEBREW_KOKA),$(HOMEBREW_KOKA),koka)
UV ?= uv

KOKA_FLAGS := -j1 -i./src

.PHONY: test test-native test-all test-wasm test-report build-counter build-browser-fixtures browser-install test-browser serve serve-report

test: test-native

test-native:
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

build-counter:
	mkdir -p dist
	$(KOKA) $(KOKA_FLAGS) --target=jsweb --outputdir=dist \
		--buildname=counter examples/counter.kk

build-browser-fixtures: build-counter
	$(KOKA) $(KOKA_FLAGS) --target=jsweb --outputdir=dist \
		--buildname=dom-errors test/dom-errors.kk
	$(KOKA) $(KOKA_FLAGS) --target=jsweb --outputdir=dist \
		--buildname=dom-lifecycle test/dom-lifecycle.kk

browser-install:
	$(UV) run --with playwright python -m playwright install chromium

test-browser: build-browser-fixtures
	$(UV) run --with playwright python test/browser_counter.py

test-wasm:
	./support/wasmweb-proof/run.sh test

test-report:
	node --check docs/algebraic-effects-ui-report/report.js
	python3 test/report_html.py

test-all: test-native test-browser test-wasm test-report

serve: build-counter
	python3 -m http.server 4173 --bind 127.0.0.1

serve-report: build-counter
	@echo "Kokaine report: http://127.0.0.1:4173/docs/algebraic-effects-ui-report/"
	python3 -m http.server 4173 --bind 127.0.0.1
