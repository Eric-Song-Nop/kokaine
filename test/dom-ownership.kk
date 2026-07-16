module dom-ownership

import kokaine/reactive
import kokaine/html
import kokaine/dom


extern report-error(message : string) : ui ()
  js inline "console.error(#1)"

extern publish-controls(toggle : () -> ui (),
                        dispose-outer : () -> ui (),
                        dispose-children : () -> ui (),
                        read : () -> ui int) : ui ()
  js inline "(globalThis.__kokaineOwnership = { toggle:#1, disposeOuter:#2, disposeChildren:#3, read:#4 })"

fun safe-update(root : root<<ui>>, action : () -> signal-write ()) : ui ()
  with catch fn(problem)
    report-error("ownership update failed: " ++ problem.show)
  update(root,action)

fun safe-toggle(root : root<<ui>>, value : signal<bool>) : ui ()
  safe-update(root,fn() value.modify(fn(current) !current))

fun safe-read(root : root<<ui>>, value : signal<int>) : ui int
  with catch fn(problem)
    report-error("ownership sample failed: " ++ problem.show)
    -999
  sample(root){ value.get }

fun safe-unmount(dispose : disposer<<ui>>) : ui ()
  with catch fn(problem)
    report-error("ownership unmount failed: " ++ problem.show)
  unmount(dispose)

pub fun main()
  val (root,(first-branch,count)) = create-root fn(root)
    (signal(root,True),signal(root,0))

  val outer-view = view
    section(attrs=[id("ownership-tree")])
      dynamic
        if first-branch.get then
          div("",attrs=[id("owned-region-host")])
        else
          p("replacement",attrs=[id("owned-region-replacement")])
      div("",attrs=[id("owned-top-host")])

  val outer-stop = mount(root,query("#ownership-root"),outer-view)

  // These mounts happen after the outer mount has returned. The DOM adapter
  // must recover the exact generation which created each physical host:
  // the dynamic region for the first one and the outer mount for the second.
  val region-stop = mount(root,query("#owned-region-host"),view
    button("region child",attrs=[
      id("owned-region-button"),
      kind("button"),
      on-click(fn(_) count.modify(fn(value) value + 1))
    ])
    span(attrs=[id("owned-region-count")])
      text { count.get.show }
  )

  val top-stop = mount(root,query("#owned-top-host"),view
    button("top child",attrs=[
      id("owned-top-button"),
      kind("button"),
      on-click(fn(_) count.modify(fn(value) value + 1))
    ])
    span(attrs=[id("owned-top-count")])
      text { count.get.show }
  )

  publish-controls(
    fn() safe-toggle(root,first-branch),
    fn() safe-unmount(outer-stop),
    fn() {
      safe-unmount(region-stop)
      safe-unmount(top-stop)
    },
    fn() safe-read(root,count)
  )
