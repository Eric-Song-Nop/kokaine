// Mount/update benchmark fixture for test/browser_perf_mount.py.
//
// 2,000 rows, each with a few elements, one live text, one live attribute and
// two buttons, plus a region wrapping a 300-row table and a region holding the
// same 300 rows as sibling roots. The Playwright script
// times mount, region toggles, and a write that updates every live binding.
module dom-perf-mount

import kokaine/reactive
import kokaine/html
import kokaine/dom


extern report-error(message : string) : ui ()
  js inline "console.error(#1)"

extern publish-controls(mount-page : () -> ui bool,
                        toggle : () -> ui bool,
                        toggle-flat : () -> ui bool,
                        bump : () -> ui bool,
                        dispose : () -> ui bool,
                        read : () -> ui int) : ui ()
  js inline "(globalThis.__kokainePerfMount = { mount:#1, toggle:#2, toggleFlat:#3, bump:#4, dispose:#5, read:#6 })"

extern store-disposer(dispose : disposer<<ui>>) : ui ()
  js inline "(globalThis.__kokainePerfMountDisposer = #1)"

extern load-disposer() : ui disposer<<ui>>
  js inline "globalThis.__kokainePerfMountDisposer"

val row-count = 2000
val table-row-count = 300

fun bench-row(tick : signal<int>, clicks : signal<int>, index : int)
             : html<e> ()
  div(attrs=[class("perf-row"),data("index",index.show)])
    span(index.show,attrs=[class("perf-label")])
    span(attrs=[class("perf-value")])
      text { (tick.get + index).show }
    element("em",attrs=[
      class("perf-badge"),
      live/title(fn() "tick " ++ tick.get.show)
    ]) { text("badge") }
    button("+",attrs=[
      kind("button"),
      class("perf-inc"),
      on-click(fn(_) clicks.modify(fn(value) value + 1))
    ])
    button("-",attrs=[
      kind("button"),
      class("perf-dec"),
      on-click(fn(_) clicks.modify(fn(value) value - 1))
    ])

fun bench-table(indices : list<int>) : html<e> ()
  element("table",attrs=[id("perf-table")])
    element("tbody")
      indices.foreach fn(index)
        element("tr")
          element("td",index.show)
          element("td","cell")
          element("td",attrs=[class("perf-cell")]) { text("x") }

// The same 300 rows as siblings: every row is a root of the region range.
fun bench-flat(indices : list<int>) : html<e> ()
  indices.foreach fn(index)
    div(attrs=[class("perf-flat")])
      span(index.show)
      span("cell")
      span(attrs=[class("perf-cell")]) { text("x") }

fun safe(action : () -> <ui,exn> ()) : ui bool
  with catch fn(problem)
    report-error("perf-mount failed: " ++ problem.show)
    False
  action()
  True

pub fun main()
  val (root,(tick,clicks,shown,shown-flat)) = create-root fn(root)
    (signal(root,0),signal(root,0),signal(root,True),signal(root,True))

  val table-indices = list(1,table-row-count)
  val row-indices = list(0,row-count - 1)
  val page = view
    div(attrs=[id("perf-fixture")])
      dynamic
        if shown.get then bench-table(table-indices)
        else p("table hidden",attrs=[id("perf-table-hidden")])
      div(attrs=[id("perf-flat")])
        dynamic
          if shown-flat.get then bench-flat(table-indices)
          else p("flat hidden",attrs=[id("perf-flat-hidden")])
      div(attrs=[id("perf-rows")])
        row-indices.foreach fn(index)
          bench-row(tick,clicks,index)

  publish-controls(
    fn() safe(fn() store-disposer(mount(root,query("#perf-root"),page))),
    fn() safe(fn() update(root){ shown.modify(fn(value) !value) }),
    fn() safe(fn() update(root){ shown-flat.modify(fn(value) !value) }),
    fn() safe(fn() update(root){ tick.modify(fn(value) value + 1) }),
    fn() safe(fn() unmount(load-disposer())),
    fn() {
      with catch fn(_) -1
      sample(root){ clicks.get }
    }
  )
