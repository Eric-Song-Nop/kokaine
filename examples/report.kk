/*--------------------------------------------------------------------------
  Browser entry point for the executable report. The checked-in HTML contains
  only #app; Kokaine owns the complete document UI as one mounted generation.
--------------------------------------------------------------------------*/
module report

import kokaine/reactive
import kokaine/reactive/async
import kokaine/dom
import kokaine/web/window
import examples/report/model
import examples/report/app


fun report-section-ids() : list<string>
  ["abstract","journey","flow-lab","effects","scheduler","batching",
   "dynamic","ownership","comparison","code","wasm","demo","limits"]

fun distance(left : int, right : int) : int
  if left < right then right - left else left - right

// Browser geometry is the only host input. The reading anchor, candidate
// order, nearest-section policy, and state equality guard are all Koka.
fun report-section-distance(section-id : string, anchor : int)
  val (top,bottom) = viewport-bounds("#" ++ section-id)
  if top <= anchor && bottom >= anchor
  then 0
  else
    val from-top = distance(top,anchor)
    val from-bottom = distance(bottom,anchor)
    if from-top < from-bottom then from-top else from-bottom

// Traverse from the end and compare while unwinding. Besides preserving the
// earlier section on equal scores, this avoids relying on backend tail-call
// parameter shuffling for the multi-value accumulator.
fun nearest-report-section(ids : list<string>, anchor : int) : <ui,exn> (string,int)
  match ids
    Nil -> ("abstract",2147483647)
    Cons(section-id,rest) ->
      val (best,best-distance) = nearest-report-section(rest,anchor)
      val candidate-distance = report-section-distance(section-id,anchor)
      if candidate-distance <= best-distance
      then (section-id,candidate-distance)
      else (best,best-distance)

fun set-active-section(model : report-model, section-id : string)
  if model.report-active-section.get == section-id
  then ()
  else model.report-active-section.set(section-id)

fun active-viewport-section()
  val anchor = viewport-height() * 32 / 100
  val (active,_) = nearest-report-section(report-section-ids(),anchor)
  active

fun sync-active-section(model : report-model)
  set-active-section(model,active-viewport-section())

fun is-report-section(ids : list<string>, candidate : string) : bool
  match ids
    Nil -> False
    Cons(section-id,rest) ->
      section-id == candidate || is-report-section(rest,candidate)

fun active-location-section()
  val fragment = location-fragment()
  if is-report-section(report-section-ids(),fragment)
  then fragment
  else active-viewport-section()

fun sync-active-location(model : report-model)
  set-active-section(model,active-location-section())

fun apply-window-event(model : report-model, changed : window-event)
  match changed
    Window-hash-change -> sync-active-location(model)
    Window-scroll -> sync-active-section(model)


pub fun main()
  val (root,model) = create-root fn(root)
    report-create(root)

  val dispose = mount(root,query("#app"),report-page(root,model))
  val initial-section = active-location-section()
  update(root)
    model.report-active-section.set(initial-section)
  dispatch(root,fn()
    run-async(root,fn()
      with catch fn(problem) log-window-error(problem.show)
      monitor-window-events(fn(changed) apply-window-event(model,changed))
    )
  )
  ()
