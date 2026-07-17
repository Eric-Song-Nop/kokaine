/*--------------------------------------------------------------------------
  The complete report is one Kokaine view and one owned DOM generation.
--------------------------------------------------------------------------*/
module examples/report/app

import kokaine/html
import examples/report/model
import examples/report/shell
import examples/report/static
import examples/report/sections
import examples/report/scheduler
import examples/report/batching
import examples/report/comparison
import examples/report/code-tabs


pub fun report-page(root, model : report-model)
  view
    render-topbar(model.report-toc-open)

    div(attrs=[id("top"),class("page-shell")])
      render-toc(model.report-toc-open,model.report-active-section)

      main-tag(attrs=[id("report")])
        render-abstract()
        render-journey()
        render-flow-section(root,model)
        render-features-section(model)
        render-scheduler(root,model.report-scheduler)
        render-batching(model.report-batching)
        render-dynamic-section(model)
        render-ownership-section(root,model)
        render-comparison(model.report-comparison)
        render-code-tabs(model.report-code-tabs)
        render-wasm()
        render-demo-section(model.report-demo-revision)
        render-limits()
        render-report-footer()
