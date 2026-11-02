/*--------------------------------------------------------------------------
  Real-browser fixture for the narrow browser-window adapter.
--------------------------------------------------------------------------*/
module window-event-lifecycle

import kokaine/reactive
import kokaine/reactive/async
import kokaine/html
import kokaine/dom
import kokaine/web/window
import kokaine/async/effects
import kokaine/async/structured


extern begin-fixture() : ui ()
  js inline "(globalThis.__kokaineWindowFixture={ runs:0, disposeRoot:null })"

extern record-window-event() : ui ()
  js inline "(globalThis.__kokaineWindowFixture.runs += 1)"

extern publish-controls(dispose-root : () -> ui ()) : ui ()
  js inline "(globalThis.__kokaineWindowFixture.disposeRoot=#1)"

fun safe-dispose-root(root : root<<ui>>) : ui ()
  with catch fn(problem)
    log-window-error("window fixture root disposal failed: " ++ problem.show)
  root.dispose()

fun show-error(problem : exception) : string
  problem.message

// The one-shot `await-window-event` lifecycle, raced per iteration.
// `monitor-window-events` has its own fixture, test/window-monitor.kk.
fun one-shot-window-loop(action : window-event -> <async,div,exn|e> ())
                        : <async,div,exn|e> ()
  while { True }
    val changed = race(
      fn() {
        await-window-event(Window-scroll)
        Window-scroll
      },
      fn() {
        await-window-event(Window-hash-change)
        Window-hash-change
      }
    )
    action(changed)


pub fun main()
  begin-fixture()
  val (root,phase) = create-root fn(root)
    signal(root,"waiting")

  val page = view
    div(attrs=[id("window-event-fixture")])
      span(attrs=[id("window-phase")])
        text { phase.get }

      button("height",attrs=[
        id("window-height"),kind("button"),
        on("click",fn(_)
          with catch fn(problem)
            phase.set("caught:" ++ show-error(problem))
          phase.set("height:" ++ viewport-height().show)
        )
      ])

      button("fragment",attrs=[
        id("window-fragment"),kind("button"),
        on("click",fn(_)
          with catch fn(problem)
            phase.set("caught:" ++ show-error(problem))
          phase.set("fragment:" ++ location-fragment())
        )
      ])

      button("motion",attrs=[
        id("window-motion"),kind("button"),
        on("click",fn(_)
          with catch fn(problem)
            phase.set("caught:" ++ show-error(problem))
          phase.set("motion:" ++ prefers-reduced-motion().show)
        )
      ])

      button("log",attrs=[
        id("window-log"),kind("button"),
        on("click",fn(_)
          log-window-error("expected window fixture log")
          phase.set("logged")
        )
      ])

  val dispose = mount(root,query("#window-event-root"),page)
  publish-controls(fn() safe-dispose-root(root))
  dispatch(root,fn()
    run-async(root,fn()
      with catch fn(problem)
        phase.set("monitor-error:" ++ show-error(problem))
      one-shot-window-loop(fn(_changed)
        record-window-event()
      )
    )
  )
  ()
