module dom-lifecycle

import kokaine/reactive
import kokaine/html
import kokaine/dom


extern report-error(message : string) : ui ()
  js inline "console.error(#1)"

extern publish-controls(dispose : () -> <ui,div> (),
                        bump : () -> <ui,div> (),
                        read : () -> <ui,div> int) : ui ()
  js inline "(globalThis.__kokaineLifecycle = { dispose:#1, bump:#2, read:#3 })"

fun safe-dispose(dispose : disposer<<ui>>) : <ui,div> ()
  with catch fn(problem)
    report-error("lifecycle dispose failed: " ++ problem.show)
  unmount(dispose)

fun safe-bump(root : root<<ui>>, clicks : signal<int>) : <ui,div> ()
  with catch fn(problem)
    report-error("lifecycle update failed: " ++ problem.show)
  update(root){ clicks.modify(fn(value) value + 1) }

fun safe-read(root : root<<ui>>, clicks : signal<int>) : <ui,div> int
  with catch fn(problem)
    report-error("lifecycle sample failed: " ++ problem.show)
    -999
  sample(root){ clicks.get }

pub fun main()
  val (root,(first-branch,clicks)) = create-root fn(root)
    (signal(root,True),signal(root,0))

  val page = view fn()
    div([id("lifecycle-fixture")],fn()
      button([id("branch-toggle"),kind("button"),
              on-click(fn(_)
                first-branch.modify(fn(value) !value)
              )],fn()
        text("switch")
      )
      span([kokaine/html/id("lifecycle-count")],fn()
        text-live(fn() clicks.get.show)
      )
      region fn()
        view fn()
          if first-branch.get then
            button([id("old-branch"),kind("button"),
                    on-click(fn(_)
                      clicks.modify(fn(value) value + 1)
                    )],fn()
              text("old")
            )
          else
            button([id("new-branch"),kind("button"),
                    on-click(fn(_)
                      clicks.modify(fn(value) value + 1)
                    )],fn()
              text("new")
            )
    )

  val dispose = mount(root,query("#lifecycle-root"),page)
  publish-controls(
    fn() safe-dispose(dispose),
    fn() safe-bump(root,clicks),
    fn() safe-read(root,clicks)
  )
