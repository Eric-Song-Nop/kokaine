/*--------------------------------------------------------------------------
  A deliberately small wasmweb proof.

  The retained browser callback owns the reactive root after `main` returns.
  Each click enters the root through `update`, and the reactive effect writes
  the resulting value back through the DOM bridge.
--------------------------------------------------------------------------*/
module app

import kokaine/reactive
import std/num/int32


extern import
  c file "bridge-inline.c"

extern create-element(tag : string) : ui any
  c "kk_wasm_proof_create_element"

extern set-text(node : any, text : string) : ui ()
  c "kk_wasm_proof_set_text"

extern append(parent : any, child : any) : ui ()
  c "kk_wasm_proof_append"

extern mount(node : any) : ui ()
  c "kk_wasm_proof_mount"

extern listen(node : any, event-name : string,
              callback : (int32) -> <ui,div|e> ()) : ui int32
  c "kk_wasm_proof_listen"

extern schedule-proof(button : any, label : any) : ui ()
  c "kk_wasm_proof_schedule"

extern report-error(message : string) : ui ()
  c "kk_wasm_proof_report_error"


fun main()
  val button = create-element("button")
  val label = create-element("span")
  append(button,label)
  mount(button)

  val (root,count) = create-root fn(root)
    val count = signal(root,0)
    val dispose = create-effect(root,fn() count.get,fn(value)
      set-text(label,value.show)
    )
    count

  // The native table retains this callback after the initial dynamic stack
  // has returned, so install a fresh exception boundary for every event.
  val listener-id = listen(button,"click",fn(_)
    with catch fn(problem)
      report-error("uncaught wasm proof event exception: " ++ problem.show)
    dispatch(root,fn()
      mask<ui>{ count.modify(fn(value) value + 1) }
    )
  )
  if listener-id == 0.int32
  then throw("wasmweb proof could not retain its click listener")
  else schedule-proof(button,label)
