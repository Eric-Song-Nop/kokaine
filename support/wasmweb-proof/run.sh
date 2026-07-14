#!/bin/sh
set -eu

proof_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
repo_root=$(CDPATH= cd -- "$proof_dir/../.." && pwd)

mode=${1:-test}
case "$mode" in
  test|build) ;;
  *)
    echo "usage: $0 [test|build] [output-directory]" >&2
    exit 2
    ;;
esac

temporary_output=0
if [ "${2:-}" ]; then
  output_root=$2
else
  output_root=$(mktemp -d "${TMPDIR:-/tmp}/kokaine-wasmweb-proof.XXXXXX")
  temporary_output=1
fi
mkdir -p "$output_root"
work_dir=$(mktemp -d "$output_root/.build.XXXXXX")
dist_dir=$output_root/dist
mkdir -p "$dist_dir" "$work_dir/primary"

cleanup() {
  rm -rf "$work_dir"
  if [ "$temporary_output" -eq 1 ]; then
    rm -rf "$output_root"
  fi
}
trap cleanup EXIT HUP INT TERM

if [ "${KOKA:-}" ]; then
  koka=$KOKA
elif [ -x /opt/homebrew/bin/koka ]; then
  koka=/opt/homebrew/bin/koka
else
  koka=$(command -v koka || true)
fi
if [ ! "$koka" ] || [ ! -x "$koka" ]; then
  echo "Koka 3.2.3 is required (set KOKA=/path/to/koka)." >&2
  exit 1
fi
case $("$koka" --version 2>&1 | sed -n '1p') in
  *"Koka 3.2.3"*) ;;
  *)
    echo "The wasmweb proof requires Koka 3.2.3; found:" >&2
    "$koka" --version >&2
    exit 1
    ;;
esac

# Homebrew's Emscripten 6 wrapper currently needs these explicit roots on
# Apple Silicon. Existing caller-provided values always win.
if [ -d /opt/homebrew/opt/emscripten/libexec ]; then
  EMSDK_PYTHON=${EMSDK_PYTHON:-/opt/homebrew/bin/python3}
  EM_LLVM_ROOT=${EM_LLVM_ROOT:-/opt/homebrew/opt/emscripten/libexec/llvm/bin}
  EM_BINARYEN_ROOT=${EM_BINARYEN_ROOT:-/opt/homebrew/opt/emscripten/libexec/binaryen}
  EM_NODE_JS=${EM_NODE_JS:-/opt/homebrew/opt/node/bin/node}
  export EMSDK_PYTHON EM_LLVM_ROOT EM_BINARYEN_ROOT EM_NODE_JS
fi

if [ "${EMCC:-}" ]; then
  emcc=$EMCC
else
  emcc=$(command -v emcc || true)
fi
if [ ! "$emcc" ] || [ ! -x "$emcc" ]; then
  echo "Emscripten emcc is required (set EMCC=/path/to/emcc)." >&2
  exit 1
fi

link_options="-sNO_EXIT_RUNTIME=1 -sALLOW_MEMORY_GROWTH=1"
if [ "$mode" = test ]; then
  link_options="--pre-js $proof_dir/fake-dom.js $link_options"
fi

"$koka" \
  --target=wasmweb \
  --cc="$emcc" \
  --include="$repo_root/src" \
  --builddir="$work_dir/koka" \
  --heap=67108864 \
  --ccopts="-Dmain=koka_generated_main -DKOKAINE_WASM_PROOF_CUSTOM_MAIN" \
  --cclinkopts="$link_options" \
  --output="$work_dir/primary/wasmweb-proof" \
  "$proof_dir/app.kk"

generated_js=$(find "$work_dir/koka" -type f -name 'wasmweb-proof.js' -print | sed -n '1p')
if [ ! "$generated_js" ]; then
  echo "Koka did not produce wasmweb-proof.js" >&2
  exit 1
fi
generated_base=${generated_js%.js}
for extension in html js wasm; do
  generated_file=$generated_base.$extension
  if [ ! -f "$generated_file" ]; then
    echo "Koka did not produce $generated_file" >&2
    exit 1
  fi
  cp "$generated_file" "$dist_dir/wasmweb-proof.$extension"
done
cp "$generated_base.html" "$dist_dir/index.html"

if [ "$mode" = build ]; then
  echo "wasmweb proof built in $dist_dir"
  echo "serve it with: python3 -m http.server --directory $dist_dir"
  temporary_output=0
  exit 0
fi

if [ "${NODE:-}" ]; then
  node=$NODE
else
  node=$(command -v node || true)
fi
if [ ! "$node" ] || [ ! -x "$node" ]; then
  echo "Node.js is required for the fake-DOM test (set NODE=/path/to/node)." >&2
  exit 1
fi

output=$("$node" "$dist_dir/wasmweb-proof.js" 2>&1) || {
  status=$?
  printf '%s\n' "$output" >&2
  exit "$status"
}
printf '%s\n' "$output"
case "$output" in
  *"wasmweb-proof: ok (count=2)"*) ;;
  *)
    echo "fake-DOM test did not observe the expected reactive update" >&2
    exit 1
    ;;
esac
