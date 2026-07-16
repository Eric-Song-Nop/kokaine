module dom-lifecycle

import kokaine/reactive
import kokaine/html
import kokaine/dom


extern report-error(message : string) : ui ()
  js inline "console.error(#1)"

extern publish-controls(dispose : () -> ui (),
                        bump : () -> ui (),
                        read : () -> ui int,
                        child-runs : () -> ui int,
                        child-cleanups : () -> ui int) : ui ()
  js inline "(globalThis.__kokaineLifecycle = { dispose:#1, bump:#2, read:#3, childRuns:#4, childCleanups:#5 })"

fun safe-dispose(dispose : disposer<<ui>>) : ui ()
  with catch fn(problem)
    report-error("lifecycle dispose failed: " ++ problem.show)
  unmount(dispose)

fun safe-bump(root : root<<ui>>, clicks : signal<int>) : ui ()
  with catch fn(problem)
    report-error("lifecycle update failed: " ++ problem.show)
  update(root){ clicks.modify(fn(value) value + 1) }

fun safe-read(root : root<<ui>>, clicks : signal<int>) : ui int
  with catch fn(problem)
    report-error("lifecycle sample failed: " ++ problem.show)
    -999
  sample(root){ clicks.get }

pub fun main()
  val (root,(first-branch,clicks,child-runs,child-cleanups)) =
    create-root fn(root)
      (signal(root,True),signal(root,0),signal(root,0),signal(root,0))

  val page = view
    div(attrs=[id("lifecycle-fixture")])
      button("switch",attrs=[
        id("branch-toggle"),
        kind("button"),
        on-click(fn(_) first-branch.modify(fn(value) !value))
      ])
      span(attrs=[id("lifecycle-count")])
        text { clicks.get.show }
      dynamic
        if first-branch.get then
          button("old",attrs=[
            id("old-branch"),
            kind("button"),
            on("click",fn(_)
              clicks.modify(fn(value) value + 1)
              // This child is created asynchronously, after mount has
              // returned. DOM re-entry must still attach it to this
              // exact region continuation generation.
              val child = create-effect(root,fn() clicks.get,fn(_)
                child-runs.modify(fn(value) value + 1)
                on-cleanup(root,fn()
                  child-cleanups.modify(fn(value) value + 1)
                )
              )
              ()
            )
          ])
        else
          button("new",attrs=[
            id("new-branch"),
            kind("button"),
            on-click(fn(_) clicks.modify(fn(value) value + 1))
          ])

  val dispose = mount(root,query("#lifecycle-root"),page)
  publish-controls(
    fn() safe-dispose(dispose),
    fn() safe-bump(root,clicks),
    fn() safe-read(root,clicks),
    fn() safe-read(root,child-runs),
    fn() safe-read(root,child-cleanups)
  )
