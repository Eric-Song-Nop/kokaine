module dom-range-safety

import kokaine/reactive
import kokaine/html
import kokaine/dom


extern publish-controls(toggle-region : () -> ui bool,
                        dispose-range : () -> ui bool,
                        dispose-detached : () -> ui bool,
                        dispose-moving : () -> ui bool,
                        mount-atomic : () -> ui bool) : ui ()
  js inline "(globalThis.__kokaineRangeSafety = { toggleRegion:#1, disposeRange:#2, disposeDetached:#3, disposeMoving:#4, mountAtomic:#5 })"

fun safe-toggle(root : root<<ui>>, branch : signal<bool>) : ui bool
  val attempt = error/try fn()
    update(root){ branch.modify(fn(value) !value) }
  attempt.is-error

fun safe-unmount(dispose : disposer<<ui>>) : ui bool
  val attempt = error/try fn() unmount(dispose)
  attempt.is-error

fun safe-atomic-mount(root : root<<ui>>) : ui bool
  val attempt = error/try fn()
    val page = view
      span("atomic",attrs=[id("range-atomic-child")])
    val dispose = mount(root,query("#range-atomic-root"),page)
    ()
  attempt.is-error

pub fun main()
  val (region-root,branch) = create-root fn(root) signal(root,True)
  val region-page = view
    div(attrs=[id("range-region-parent")])
      dynamic
        if branch.get then
          span("old",attrs=[id("range-region-old")])
        else
          span("new",attrs=[id("range-region-new")])
  val region-dispose = mount(region-root,query("#range-region-root"),region-page)

  val (remove-root,_) = create-root fn(root) ()
  val remove-page = view
    div("owned",attrs=[id("range-remove-owned")])
  val remove-dispose = mount(remove-root,query("#range-remove-root"),remove-page)

  val (detached-root,_) = create-root fn(root) ()
  val detached-page = view
    div("detached",attrs=[id("range-detached-owned")])
  val detached-dispose = mount(detached-root,query("#range-detached-root"),detached-page)

  val (moving-root,_) = create-root fn(root) ()
  val moving-page = view
    element("x-kokaine-range-mutator",attrs=[id("range-moving-mutator")]) {}
    div("moving",attrs=[id("range-moving-owned")])
  val moving-dispose = mount(moving-root,query("#range-moving-root"),moving-page)

  val (atomic-root,_) = create-root fn(root) ()
  publish-controls(
    fn() safe-toggle(region-root,branch),
    fn() safe-unmount(remove-dispose),
    fn() safe-unmount(detached-dispose),
    fn() safe-unmount(moving-dispose),
    fn() safe-atomic-mount(atomic-root)
  )
