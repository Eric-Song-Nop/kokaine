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
  view fn()
    main-tag([class("lab-shell")],fn()
      header([class("lab-header")],fn()
        div([],fn()
          p([class("wordmark")],fn() text("KOKAINE / CONTINUATION LAB"))
          h1([],fn() text("Incremental UI from captured computation."))
        )
        p([class("lab-header__copy")],fn()
          text("Change the sources, then watch equality boundaries, state entries, effects, and structural lifetimes move independently.")
        )
      )

      div([class("lab-grid")],fn()
        render-controls(root,model)
        render-meter(model)
      )

      render-probe(root,model)

      footer([class("lab-footer")],fn()
        p([],fn() text("ALGEBRAIC EFFECTS DEFINE OPERATIONS"))
        p([],fn() text("CONTINUATIONS DEFINE INCREMENTAL WORK"))
        p([],fn() text("FRAMES DEFINE LIFETIME"))
      )
    )
