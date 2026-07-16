/*--------------------------------------------------------------------------
  Page composition only. Feature areas live in their own modules.
--------------------------------------------------------------------------*/
module examples/counter/app

import kokaine/html
import examples/counter/model
import examples/counter/controls
import examples/counter/meter
import examples/counter/probe


pub fun lab-page(root, model : lab-model)
  view
    main-tag(attrs=[class("lab-shell")])
      header(attrs=[class("lab-header")])
        div
          p("KOKAINE / CONTINUATION LAB",attrs=[class("wordmark")])
          h1("Incremental UI from captured computation.")
        p(
          "Change the sources, then watch equality boundaries, state entries, effects, and structural lifetimes move independently.",
          attrs=[class("lab-header__copy")]
        )

      div(attrs=[class("lab-grid")])
        render-controls(root,model)
        render-meter(model)

      render-probe(root,model)

      footer(attrs=[class("lab-footer")])
        p("ALGEBRAIC EFFECTS DEFINE OPERATIONS")
        p("CONTINUATIONS DEFINE INCREMENTAL WORK")
        p("FRAMES DEFINE LIFETIME")
