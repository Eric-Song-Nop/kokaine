/*--------------------------------------------------------------------------
  View boundaries for the four independently mounted report islands.
--------------------------------------------------------------------------*/
module examples/report/app

import kokaine/html
import examples/report/model
import examples/report/features
import examples/report/flow
import examples/report/dynamic
import examples/report/ownership


pub fun report-feature-app(model : report-model)
  view
    render-features(model)

pub fun report-flow-app(root, model : report-model)
  view
    render-flow(root,model)

pub fun report-dynamic-app(model : report-model)
  view
    render-dynamic(model)

pub fun report-ownership-app(root, model : report-model)
  view
    render-ownership(root,model)
