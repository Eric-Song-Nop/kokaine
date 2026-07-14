HOMEBREW_KOKA := $(firstword $(wildcard /opt/homebrew/opt/koka/bin/koka /usr/local/opt/koka/bin/koka))
KOKA ?= $(if $(HOMEBREW_KOKA),$(HOMEBREW_KOKA),koka)
UV ?= uv

KOKA_FLAGS := -j1 -i./src

.PHONY: test test-native test-all test-wasm build-counter build-browser-fixtures browser-install test-browser serve

test: test-native

test-native:
	$(KOKA) $(KOKA_FLAGS) -e test/smoke.kk
	$(KOKA) $(KOKA_FLAGS) -e test/reactive.kk
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

test-all: test-native test-browser test-wasm

serve: build-counter
	python3 -m http.server 4173 --bind 127.0.0.1
