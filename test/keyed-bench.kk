// Keyed-reorder benchmark fixture (see test/bench_keyed.py and the keyed
// placement assertions in test/browser_keyed.py). Every row is a keyed range
// of about twenty DOM nodes. The page publishes one action, `setOrder`, which
// replaces the list with the given row identities; the Playwright scripts
// derive drag, reverse, shuffle and append orders from the current order.
module keyed-bench

import kokaine/reactive
import kokaine/html
import kokaine/control
import kokaine/dom

extern publish-bench(set-order : (vector<int>) -> ui bool) : ui ()
  js inline "(globalThis.__kokaineKeyedBench = { setOrder:#1 })"

fun safe-order(root : root<<ui>>, source : signal<list<int>>,
               next : vector<int>) : ui bool
  with catch fn(_)
    False
  update(root){ source.set(next.list) }
  True

fun bench-row(current : accessor<int>, index : accessor<int>)
             : <html<total>,signal-read> ()
  val identity = current().show
  li(attrs=[id("bench-row-" ++ identity),data("key",identity)])
    span(attrs=[class("bench-index")])
      text { index().show }
    span("row " ++ identity,attrs=[class("bench-label")])
    div(attrs=[class("bench-cells")])
      span("a")
      span("b")
      span("c")
      span("d")
      span("e")
    element-empty("input",attrs=[kind("text"),value("note " ++ identity)])
    button("open",attrs=[kind("button")])

fun bench-page(source : signal<list<int>>) : view<total>
  view
    ul(attrs=[id("bench-list")])
      for(fn() source.get,fn(value) value) fn(current,index)
        bench-row(current,index)

pub fun main()
  val (root,source) = create-root fn(root)
    val empty : list<int> = []
    signal(root,empty)
  val dispose = mount(root,query("#bench-root"),bench-page(source))
  publish-bench(fn(next) safe-order(root,source,next))
