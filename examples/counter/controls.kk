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
  div(attrs=[class("channel-row")])
    div(attrs=[class("channel-row__identity")])
      span(channel-name,attrs=[class("channel-row__name")])
      strong(attrs=[id(value-id)])
        if is-b
        then text { model.lab-channel-b.get.show }
        else text { model.lab-channel-a.get.show }
    div(attrs=[class("stepper")])
      button("−",attrs=[
        id(decrement-id),class("button button--quiet"),kind("button"),
        disabled { model.lab-frozen.get },
        aria("label","Decrease channel " ++ channel-name),
        on-click(fn(_)
          if is-b then lab-adjust-b(model,-1) else lab-adjust-a(model,-1)
        )
      ])
      button("+",attrs=[
        id(increment-id),class("button button--quiet"),kind("button"),
        disabled { model.lab-frozen.get },
        aria("label","Increase channel " ++ channel-name),
        on-click(fn(_)
          if is-b then lab-adjust-b(model,1) else lab-adjust-a(model,1)
        )
      ])

pub fun render-controls(root, model : lab-model)
  section(attrs=[id("source-board"),class("panel source-board")])
    div(attrs=[class("panel__heading")])
      div
        p("HANDLED SIGNAL OPERATIONS",attrs=[class("kicker")])
        h2("Source board")
      label(attrs=[class("switch")])
        input(attrs=[
          id("freeze-toggle"),kind("checkbox"),
          checked { model.lab-frozen.get },
          on-change(fn(ev) model.lab-frozen.set(ev.checked))
        ])
        span("Freeze writes")

    div(attrs=[class("selector")])
      div
        strong("Dynamic dependency")
        p("The active derivation reads exactly one channel.")
      label(attrs=[class("switch switch--accent")])
        input(attrs=[
          id("active-b"),kind("checkbox"),
          checked { model.lab-active-b.get },
          disabled { model.lab-frozen.get },
          on-change(fn(ev) model.lab-active-b.set(ev.checked))
        ])
        span("Use channel B")

    div(attrs=[class("channel-list")])
      channel-row(model,"A","channel-a","channel-a-dec","channel-a-inc",False)
      channel-row(model,"B","channel-b","channel-b-dec","channel-b-inc",True)

    div(attrs=[class("active-controls")])
      p("ADJUST SELECTED SOURCE",attrs=[class("field-label")])
      div(attrs=[class("active-controls__buttons")])
        button("−",attrs=[
          id("active-dec"),class("button button--step"),kind("button"),
          disabled { model.lab-frozen.get },
          aria("label","Decrease value"),
          on("click",fn(_) lab-adjust-active(model,-1))
        ])
        button("ZERO",attrs=[
          id("zero-active"),class("button button--zero"),kind("button"),
          disabled { model.lab-frozen.get },
          on("click",fn(ev)
            prevent-default(ev)
            lab-zero-active(model)
          )
        ])
        button("+",attrs=[
          id("active-inc"),class("button button--step"),kind("button"),
          disabled { model.lab-frozen.get },
          aria("label","Increase value"),
          on("click",fn(_) lab-adjust-active(model,1))
        ])

    div(attrs=[class("batch-actions")])
      button(attrs=[
        id("swap-batch"),class("button"),kind("button"),
        disabled { model.lab-frozen.get },
        on("click",fn(_) lab-swap(root,model))
      ])
        strong("SWAP A / B")
        span("one explicit batch")
      button(attrs=[
        id("reset-batch"),class("button"),kind("button"),
        on("click",fn(_) lab-reset(root,model))
      ])
        strong("RESET LAB")
        span("batched defaults")
      button(attrs=[
        id("pulse-heartbeat"),class("button"),kind("button"),
        on-click(fn(_) lab-pulse(model))
      ])
        strong("PULSE 0")
        span("same value publishes")

    div(attrs=[class("operator")])
      label("OPERATOR",attrs=[attr("for","operator"),class("field-label")])
      input(attrs=[
        id("operator"),kind("text"),
        value { model.lab-operator.get },
        disabled { model.lab-frozen.get },
        on-input(fn(value) model.lab-operator.set(value)),
        aria("describedby","greeting sampled-operator")
      ])
      p(attrs=[id("greeting")])
        text { "Signal received, " ++ model.lab-operator.get ++ "." }
