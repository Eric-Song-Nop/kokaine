module dom-mount-rollback

import kokaine/reactive
import kokaine/html
import kokaine/dom


extern report-error(message : string) : ui ()
  js inline "console.error(#1)"

extern publish-result(failed : bool, read : () -> ui int,
                      dispose-root : () -> ui ()) : ui ()
  js inline "(globalThis.__kokaineMountRollback = { failed:#1, read:#2, disposeRoot:#3 })"

fun safe-read(root : root<<ui>>, value : signal<int>) : ui int
  with catch fn(problem)
    report-error("rollback sample failed: " ++ problem.show)
    -999
  sample(root){ value.get }

fun safe-root-dispose(root : root<<ui>>) : ui ()
  with catch fn(problem)
    report-error("rollback root dispose failed: " ++ problem.show)
  root.dispose()

fun failing-page(count : signal<int>) : view<total>
  view
    element-empty("x-kokaine-fail",attrs=[
      id("rollback-listener"),
      on-click(fn(_) count.modify(fn(value) value + 1)),
      // The browser fixture defines this valid custom-element property setter
      // to throw during the descendant live binding's initial bootstrap.
      Live-property("boom",fn() String-property(count.get.show))
    ])
    span(attrs=[id("rollback-later-live")])
      text { count.get.show }

fun safe-failing-mount(root : root<<ui>>, count : signal<int>) : ui bool
  val result = error/try fn()
    val dispose = mount(root,query("#mount-rollback-root"),failing-page(count))
    ()
  result.is-error

pub fun main()
  val (root,count) = create-root fn(root) signal(root,0)
  publish-result(
    safe-failing-mount(root,count),
    fn() safe-read(root,count),
    fn() safe-root-dispose(root)
  )
