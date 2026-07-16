/*--------------------------------------------------------------------------
  Source controls and explicit mutation boundaries.
--------------------------------------------------------------------------*/
module examples/counter/controls

import kokaine/reactive
import kokaine/html
import kokaine/dom
import examples/counter/model
import examples/counter/actions


fun channel-row(model : lab-model, channel-name : string,
                value-id : string, decrement-id : string,
                increment-id : string, is-b : bool)
  div([class("channel-row")],fn()
    div([class("channel-row__identity")],fn()
      span([class("channel-row__name")],fn() text(channel-name))
      strong([id(value-id)],fn()
        if is-b
        then text-live(fn() model.lab-channel-b.get.show)
        else text-live(fn() model.lab-channel-a.get.show)
      )
    )
    div([class("stepper")],fn()
      button([
        id(decrement-id),class("button button--quiet"),kind("button"),
        disabled-live(fn() model.lab-frozen.get),
        aria("label","Decrease channel " ++ channel-name),
        on-click(fn(_)
          if is-b then lab-adjust-b(model,-1) else lab-adjust-a(model,-1)
        )
      ],fn() text("−"))
      button([
        id(increment-id),class("button button--quiet"),kind("button"),
        disabled-live(fn() model.lab-frozen.get),
        aria("label","Increase channel " ++ channel-name),
        on-click(fn(_)
          if is-b then lab-adjust-b(model,1) else lab-adjust-a(model,1)
        )
      ],fn() text("+"))
    )
  )

pub fun render-controls(root, model : lab-model)
  section([id("source-board"),class("panel source-board")],fn()
    div([class("panel__heading")],fn()
      div([],fn()
        p([class("kicker")],fn() text("HANDLED SIGNAL OPERATIONS"))
        h2([],fn() text("Source board"))
      )
      label([class("switch")],fn()
        input([
          id("freeze-toggle"),kind("checkbox"),
          checked-live(fn() model.lab-frozen.get),
          on-change(fn(ev) model.lab-frozen.set(ev.checked))
        ])
        span([],fn() text("Freeze writes"))
      )
    )

    div([class("selector")],fn()
      div([],fn()
        strong([],fn() text("Dynamic dependency"))
        p([],fn() text("The active derivation reads exactly one channel."))
      )
      label([class("switch switch--accent")],fn()
        input([
          id("active-b"),kind("checkbox"),
          checked-live(fn() model.lab-active-b.get),
          disabled-live(fn() model.lab-frozen.get),
          on-change(fn(ev) model.lab-active-b.set(ev.checked))
        ])
        span([],fn() text("Use channel B"))
      )
    )

    div([class("channel-list")],fn()
      channel-row(model,"A","channel-a","channel-a-dec","channel-a-inc",False)
      channel-row(model,"B","channel-b","channel-b-dec","channel-b-inc",True)
    )

    div([class("active-controls")],fn()
      p([class("field-label")],fn() text("ADJUST SELECTED SOURCE"))
      div([class("active-controls__buttons")],fn()
        button([
          id("active-dec"),class("button button--step"),kind("button"),
          disabled-live(fn() model.lab-frozen.get),
          aria("label","Decrease value"),
          on("click",fn(_) lab-adjust-active(model,-1))
        ],fn() text("−"))
        button([
          id("zero-active"),class("button button--zero"),kind("button"),
          disabled-live(fn() model.lab-frozen.get),
          on("click",fn(ev)
            prevent-default(ev)
            lab-zero-active(model)
          )
        ],fn() text("ZERO"))
        button([
          id("active-inc"),class("button button--step"),kind("button"),
          disabled-live(fn() model.lab-frozen.get),
          aria("label","Increase value"),
          on("click",fn(_) lab-adjust-active(model,1))
        ],fn() text("+"))
      )
    )

    div([class("batch-actions")],fn()
      button([
        id("swap-batch"),class("button"),kind("button"),
        disabled-live(fn() model.lab-frozen.get),
        on("click",fn(_) lab-swap(root,model))
      ],fn()
        strong([],fn() text("SWAP A / B"))
        span([],fn() text("one explicit batch"))
      )
      button([
        id("reset-batch"),class("button"),kind("button"),
        on("click",fn(_) lab-reset(root,model))
      ],fn()
        strong([],fn() text("RESET LAB"))
        span([],fn() text("batched defaults"))
      )
      button([
        id("pulse-heartbeat"),class("button"),kind("button"),
        on-click(fn(_) lab-pulse(model))
      ],fn()
        strong([],fn() text("PULSE 0"))
        span([],fn() text("same value publishes"))
      )
    )

    div([class("operator")],fn()
      label([attr("for","operator"),class("field-label")],fn() text("OPERATOR"))
      input([
        id("operator"),kind("text"),
        value-live(fn() model.lab-operator.get),
        disabled-live(fn() model.lab-frozen.get),
        on-input(fn(value) model.lab-operator.set(value)),
        aria("describedby","greeting sampled-operator")
      ])
      p([id("greeting")],fn()
        text-live(fn() "Signal received, " ++ model.lab-operator.get ++ ".")
      )
    )
  )
