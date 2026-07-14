#include <emscripten.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>


/* -------------------------------------------------------------------------
   Retained Koka closures
------------------------------------------------------------------------- */

#define KK_WASM_PROOF_CALLBACK_CAPACITY 16

typedef struct kk_wasm_proof_callback_slot_s {
  kk_function_t callback;
  bool active;
} kk_wasm_proof_callback_slot_t;

static kk_wasm_proof_callback_slot_t
  kk_wasm_proof_callbacks[KK_WASM_PROOF_CALLBACK_CAPACITY];

static int32_t kk_wasm_proof_callback_store(kk_function_t callback,
                                             kk_context_t* ctx) {
  for (int32_t id = 1; id < KK_WASM_PROOF_CALLBACK_CAPACITY; id++) {
    if (!kk_wasm_proof_callbacks[id].active) {
      /* The extern receives an owned closure; the slot takes that ownership. */
      kk_wasm_proof_callbacks[id].callback = callback;
      kk_wasm_proof_callbacks[id].active = true;
      return id;
    }
  }
  kk_function_drop(callback,ctx);
  return 0;
}

static void kk_wasm_proof_callback_drop(int32_t id, kk_context_t* ctx) {
  if (id <= 0 || id >= KK_WASM_PROOF_CALLBACK_CAPACITY ||
      !kk_wasm_proof_callbacks[id].active) {
    return;
  }
  kk_wasm_proof_callbacks[id].active = false;
  kk_function_drop(kk_wasm_proof_callbacks[id].callback,ctx);
}

EMSCRIPTEN_KEEPALIVE
void kk_wasm_proof_dispatch(int32_t listener_id, int32_t event_id) {
  if (listener_id <= 0 || listener_id >= KK_WASM_PROOF_CALLBACK_CAPACITY ||
      !kk_wasm_proof_callbacks[listener_id].active) {
    return;
  }

  kk_context_t* ctx = kk_get_context();
  /* Calling a Koka closure consumes its function argument. Keep the slot's
     owner alive by invoking a duplicate on every browser event. */
  kk_function_t callback = kk_function_dup(
    kk_wasm_proof_callbacks[listener_id].callback,ctx);
  kk_function_call(
    kk_unit_t,
    (kk_function_t,int32_t,kk_context_t*),
    callback,
    (callback,event_id,ctx),
    ctx
  );
}


/* -------------------------------------------------------------------------
   JavaScript DOM handle table
------------------------------------------------------------------------- */

EM_JS(int32_t, kk_wasm_proof_js_create_element, (const char* tag), {
  let state = globalThis.__kokaineWasmProof;
  if (!state) {
    state = {
      nextHandle: 1,
      nodes: new Map(),
      listeners: new Map(),
      events: new Map()
    };
    globalThis.__kokaineWasmProof = state;
  }
  const id = state.nextHandle++;
  state.nodes.set(id,document.createElement(UTF8ToString(tag)));
  return id;
});

EM_JS(void, kk_wasm_proof_js_set_text,
      (int32_t node_id, const char* text), {
  const state = globalThis.__kokaineWasmProof;
  const node = state && state.nodes.get(node_id);
  if (!node) throw new Error(`invalid wasm proof node handle: ${node_id}`);
  node.textContent = UTF8ToString(text);
});

EM_JS(void, kk_wasm_proof_js_append,
      (int32_t parent_id, int32_t child_id), {
  const state = globalThis.__kokaineWasmProof;
  const parent = state && state.nodes.get(parent_id);
  const child = state && state.nodes.get(child_id);
  if (!parent || !child) throw new Error('invalid wasm proof append handle');
  parent.appendChild(child);
});

EM_JS(void, kk_wasm_proof_js_mount, (int32_t node_id), {
  const state = globalThis.__kokaineWasmProof;
  const node = state && state.nodes.get(node_id);
  if (!node) throw new Error(`invalid wasm proof node handle: ${node_id}`);
  document.body.appendChild(node);
});

EM_JS(int32_t, kk_wasm_proof_js_listen,
      (int32_t node_id, const char* event_name, int32_t listener_id), {
  const state = globalThis.__kokaineWasmProof;
  const node = state && state.nodes.get(node_id);
  if (!node) return 0;

  const type = UTF8ToString(event_name);
  const listener = (event) => {
    const eventId = state.nextHandle++;
    state.events.set(eventId,event);
    try {
      _kk_wasm_proof_dispatch(listener_id,eventId);
    }
    finally {
      state.events.delete(eventId);
    }
  };
  node.addEventListener(type,listener);
  state.listeners.set(listener_id,{ node, type, listener });
  return 1;
});

EM_JS(void, kk_wasm_proof_js_schedule,
      (int32_t button_id, int32_t label_id), {
  const state = globalThis.__kokaineWasmProof;
  const button = state && state.nodes.get(button_id);
  const label = state && state.nodes.get(label_id);

  setTimeout(() => {
    if (!button || !label) throw new Error('wasm proof lost a DOM handle');
    const makeEvent = () => (
      typeof Event === 'function' ? new Event('click') : { type: 'click' }
    );
    button.dispatchEvent(makeEvent());
    button.dispatchEvent(makeEvent());

    if (label.textContent !== '2') {
      throw new Error(
        `wasmweb proof expected reactive text 2, got ${label.textContent}`
      );
    }
    console.log('wasmweb-proof: ok (count=2)');
  },0);
});

EM_JS(void, kk_wasm_proof_js_report_error, (const char* message), {
  console.error(UTF8ToString(message));
});


/* -------------------------------------------------------------------------
   Owned Koka values at the FFI boundary
------------------------------------------------------------------------- */

static kk_box_t kk_wasm_proof_create_element(kk_string_t tag,
                                              kk_context_t* ctx) {
  const char* ctag = kk_string_cbuf_borrow(tag,NULL,ctx);
  int32_t id = kk_wasm_proof_js_create_element(ctag);
  kk_string_drop(tag,ctx);
  return kk_int32_box(id,ctx);
}

static void kk_wasm_proof_set_text(kk_box_t node, kk_string_t text,
                                   kk_context_t* ctx) {
  int32_t node_id = kk_int32_unbox(node,KK_OWNED,ctx);
  const char* ctext = kk_string_cbuf_borrow(text,NULL,ctx);
  kk_wasm_proof_js_set_text(node_id,ctext);
  kk_string_drop(text,ctx);
}

static void kk_wasm_proof_append(kk_box_t parent, kk_box_t child,
                                 kk_context_t* ctx) {
  int32_t parent_id = kk_int32_unbox(parent,KK_OWNED,ctx);
  int32_t child_id = kk_int32_unbox(child,KK_OWNED,ctx);
  kk_wasm_proof_js_append(parent_id,child_id);
}

static void kk_wasm_proof_mount(kk_box_t node, kk_context_t* ctx) {
  int32_t node_id = kk_int32_unbox(node,KK_OWNED,ctx);
  kk_wasm_proof_js_mount(node_id);
}

static int32_t kk_wasm_proof_listen(kk_box_t node, kk_string_t event_name,
                                    kk_function_t callback,
                                    kk_context_t* ctx) {
  int32_t node_id = kk_int32_unbox(node,KK_OWNED,ctx);
  int32_t listener_id = kk_wasm_proof_callback_store(callback,ctx);
  if (listener_id == 0) {
    kk_string_drop(event_name,ctx);
    return 0;
  }

  const char* cevent = kk_string_cbuf_borrow(event_name,NULL,ctx);
  int32_t installed = kk_wasm_proof_js_listen(
    node_id,cevent,listener_id);
  kk_string_drop(event_name,ctx);
  if (!installed) {
    kk_wasm_proof_callback_drop(listener_id,ctx);
    return 0;
  }
  return listener_id;
}

static void kk_wasm_proof_schedule(kk_box_t button, kk_box_t label,
                                   kk_context_t* ctx) {
  int32_t button_id = kk_int32_unbox(button,KK_OWNED,ctx);
  int32_t label_id = kk_int32_unbox(label,KK_OWNED,ctx);
  kk_wasm_proof_js_schedule(button_id,label_id);
}

static void kk_wasm_proof_report_error(kk_string_t message,
                                       kk_context_t* ctx) {
  const char* cmessage = kk_string_cbuf_borrow(message,NULL,ctx);
  kk_wasm_proof_js_report_error(cmessage);
  kk_string_drop(message,ctx);
}


/* -------------------------------------------------------------------------
   Persistent wasmweb entry point

   Koka's generated main calls `main_done` as soon as the setup action returns,
   which drops standard-module globals before a later browser event. The build
   renames that generated entry and enables this one. Real teardown is still
   registered for a genuine Emscripten runtime exit.
------------------------------------------------------------------------- */

#if defined(KOKAINE_WASM_PROOF_CUSTOM_MAIN)
#undef main

extern void main_init(kk_context_t* ctx);
extern void main_run(kk_context_t* ctx);
extern void main_done(kk_context_t* ctx);

static void kk_wasm_proof_at_exit(void) {
  main_done(kk_get_context());
}

int main(int argc, char** argv) {
  kk_context_t* ctx = kk_main_start(argc,argv);
  main_init(ctx);
  atexit(kk_wasm_proof_at_exit);
  main_run(ctx);
  kk_main_end(ctx);
  return 0;
}
#endif
