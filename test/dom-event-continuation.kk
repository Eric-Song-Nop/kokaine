module dom-event-continuation

import kokaine/reactive
import kokaine/reactive/async
import kokaine/html
import kokaine/dom
import kokaine/internal/event-runtime
import std/core/unsafe


extern append-log(value : string) : ui ()
  js inline "globalThis.__kokaineEventContinuation.log.push(#1)"

extern dispatch-inner() : ui bool
  js inline "document.querySelector('[id=event-inner]').dispatchEvent(new MouseEvent('click',{ bubbles:true, cancelable:true }))"

extern dispatch-outer() : ui bool
  js inline "document.querySelector('[id=event-outer]').dispatchEvent(new MouseEvent('click',{ bubbles:true, cancelable:true }))"

extern enter-depth() : ui int
  js inline "(++globalThis.__kokaineEventContinuation.depth)"

extern leave-depth() : ui ()
  js inline "(globalThis.__kokaineEventContinuation.depth -= 1)"

extern fake-original() : any
  js inline "({})"

extern report-error(message : string) : ui ()
  js inline "console.error(#1)"

extern publish-controls(dispose : () -> ui (), read : () -> ui int,
                        raw-resume : () -> ui bool,
                        raw-close : () -> ui (),
                        raw-read : () -> ui int) : ui ()
  js inline "(globalThis.__kokaineEventContinuation = { log:[], depth:0, dispose:#1, read:#2, rawResume:#3, rawClose:#4, rawRead:#5 })"

fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun hidden-load(value : ref<global,a>) : a
  unsafe-total { !value }

fun hidden-store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun safe-dispose(dispose : disposer<<ui>>) : ui ()
  with catch fn(problem)
    report-error("event-continuation dispose failed: " ++ problem.show)
  unmount(dispose)

fun safe-read(root : root<<ui>>, count : signal<int>) : ui int
  with catch fn(problem)
    report-error("event-continuation sample failed: " ++ problem.show)
    -999
  sample(root){ count.get }

fun safe-raw-resume(root : root<<ui>>, value : event-continuation) : ui bool
  with catch fn(problem)
    report-error("raw event-continuation resume failed: " ++ problem.show)
    False
  val accepted = hidden(False)
  dispatch(root){
    run-async(root,fn()
      hidden-store(accepted,
        value.resume(Event("raw",False,"",fake-original())))
    )
  }
  hidden-load(accepted)

pub fun main()
  val (root,(count,raw-runs)) = create-root fn(root)
    (signal(root,0),signal(root,0))

  // A direct capability canary isolates Event-live/Event-retired from DOM
  // listener removal and structural frame rejection.
  val captured-raw = hidden(Nothing)
  dispatch(root,fn()
    run-async(root,fn()
      hidden-store(captured-raw,Just(capture-event(fn(_)
        raw-runs.modify(fn(current) current + 1)
      )))
    )
  )
  val raw-capability = match hidden-load(captured-raw)
    Just(capability) -> capability
    Nothing -> throw("raw event continuation capture did not complete")

  val page = view
    div(attrs=[id("event-continuation-fixture")])
      button("outer",attrs=[
        id("event-outer"),
        kind("button"),
        on("click",fn(_)
          val depth = enter-depth()
          finally(
            fn() leave-depth(),
            fn()
              append-log("outer-start:" ++ depth.show)
              if depth == 1 then
                val accepted = dispatch-outer()
                append-log(if accepted
                  then "outer-nested-accepted"
                  else "outer-nested-cancelled")
              else
                val accepted = dispatch-inner()
                append-log(if accepted
                  then "inner-accepted"
                  else "inner-cancelled")
              append-log("outer-end:" ++ depth.show)
          )
        )
      ])
      button("inner",attrs=[
        id("event-inner"),
        kind("button"),
        on("click",fn(value)
          append-log("inner")
          prevent-default(value)
          count.modify(fn(current) current + 1)
        )
      ])
      button("throws",attrs=[
        id("event-throw"),
        kind("button"),
        on("click",fn(_)
          raw-runs.modify(fn(current) current + 1)
          throw("intentional event callback failure")
        )
      ])
      span(attrs=[id("event-count")])
        text { count.get.show }
      span(attrs=[id("event-raw-count")])
        text { raw-runs.get.show }

  val dispose = mount(root,query("#event-continuation-root"),page)
  publish-controls(
    fn() safe-dispose(dispose),
    fn() safe-read(root,count),
    fn() safe-raw-resume(root,raw-capability),
    fn() raw-capability.close,
    fn() safe-read(root,raw-runs)
  )
