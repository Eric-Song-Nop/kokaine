/*--------------------------------------------------------------------------
  Browser entry point for the executable report. The checked-in HTML contains
  only #app; Kokaine owns the complete document UI as one mounted generation.
--------------------------------------------------------------------------*/
module report

import kokaine/reactive
import kokaine/dom
import examples/report/model
import examples/report/app


pub fun main()
  val (root,model) = create-root fn(root)
    report-create(root)

  val dispose = mount(root,query("#app"),report-page(root,model))
  ()
