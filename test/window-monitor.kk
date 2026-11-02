/*--------------------------------------------------------------------------
  Real-browser fixture for `monitor-window-events`: persistent listeners and a
  coalescing mailbox, so events during an action or between iterations survive.
--------------------------------------------------------------------------*/
module window-monitor

import kokaine/reactive
import kokaine/reactive/async
import kokaine/html
import kokaine/dom
import kokaine/web/window
import kokaine/async/effects


extern begin-fixture() : ui ()
  js inline "(globalThis.__kokaineWindowMonitor={ events:[], hold:false, throwNext:false, gate:null, phase:'running', disposeRoot:null })"

extern record-event(name : string) : ui ()
  js inline "globalThis.__kokaineWindowMonitor.events.push(#1)"

extern should-hold() : ui bool
  js inline "!!globalThis.__kokaineWindowMonitor.hold"

extern should-throw() : ui bool
  js inline "!!globalThis.__kokaineWindowMonitor.throwNext"

extern install-gate(complete : () -> ui ()) : ui ()
  js inline "(globalThis.__kokaineWindowMonitor.gate=#1)"

extern publish-phase(value : string) : ui ()
  js inline "(globalThis.__kokaineWindowMonitor.phase=#1)"

extern publish-controls(dispose-root : () -> ui ()) : ui ()
  js inline "(globalThis.__kokaineWindowMonitor.disposeRoot=#1)"

fun safe-dispose-root(root : root<<ui>>) : ui ()
  with catch fn(problem)
    log-window-error("window monitor fixture disposal failed: " ++ problem.show)
  root.dispose()

fun observe(changed : window-event) : <async,exn> ()
  val name = match changed
    Window-scroll -> "scroll"
    Window-hash-change -> "hashchange"
  async-host(fn() record-event(name))
  if async-host(fn() should-throw()) then throw("forced action failure")
  if async-host(fn() should-hold()) then
    await0-noexn("monitor gate",fn(complete) install-gate(complete))

pub fun main()
  begin-fixture()
  val (root,_) : (root<<ui>>,()) = create-root fn(_root) ()
  publish-controls(fn() safe-dispose-root(root))
  dispatch(root,fn()
    run-async(root,fn()
      with catch fn(problem)
        async-host(fn() publish-phase("monitor-error:" ++ problem.message))
      monitor-window-events(observe)
    )
  )
  ()
