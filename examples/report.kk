/*--------------------------------------------------------------------------
  Browser entry point for the executable report.

  All islands intentionally share one root/model. Their DOM ranges mount in
  different sections of the long-form document, but the continuation graph,
  scheduler, and structural ownership protocol remain one coherent runtime.
--------------------------------------------------------------------------*/
module report

import kokaine/reactive
import kokaine/dom
import examples/report/model
import examples/report/app


pub fun main()
  val (root,model) = create-root fn(root)
    report-create(root)

  val feature-dispose = mount(
    root,query("#koka-feature-app"),report-feature-app(model))
  val flow-dispose = mount(
    root,query("#koka-flow-app"),report-flow-app(root,model))
  val dynamic-dispose = mount(
    root,query("#koka-dynamic-app"),report-dynamic-app(model))
  val ownership-dispose = mount(
    root,query("#koka-ownership-app"),report-ownership-app(root,model))
  ()
