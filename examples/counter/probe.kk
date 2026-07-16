/*--------------------------------------------------------------------------
  A dynamic DOM region whose listener creates continuation-owned work.
--------------------------------------------------------------------------*/
module examples/counter/probe

import kokaine/reactive
import kokaine/html
import examples/counter/model
import examples/counter/actions


fun probe-branch(root, model : lab-model, channel-b : bool)
  div(attrs=[
    id("channel-scope"),class("scope-generation"),
    data("channel",if channel-b then "b" else "a")
  ])
    div
      p("LIVE GENERATION",attrs=[class("field-label")])
      h2(if channel-b then "Channel B scope" else "Channel A scope")
      p("The button listener and any child effect belong to this exact region generation.",
        attrs=[class("scope-generation__copy")])
    div(attrs=[class("scope-generation__reading")])
      span("selected source")
      strong
        if channel-b
        then text { model.lab-channel-b.get.show }
        else text { model.lab-channel-a.get.show }
    button(attrs=[
      id("probe-arm"),class("button button--arm"),kind("button"),
      disabled { model.lab-probe-attached.get || model.lab-frozen.get },
      on("click",fn(_) lab-arm-probe(root,model))
    ])
      text {
        if model.lab-probe-attached.get
        then "CHILD EFFECT ATTACHED"
        else "ATTACH CHILD EFFECT"
      }

fun hidden-branch()
  div(attrs=[id("channel-scope"),
             class("scope-generation scope-generation--hidden")])
    p("REGION RETIRED",attrs=[class("field-label")])
    h2("Probe is hidden")
    p("The previous marker range, listener, child effect, and cleanup have been retired together.",
      attrs=[class("scope-generation__copy")])

pub fun render-probe(root, model : lab-model)
  section(attrs=[class("panel probe-panel")])
    div(attrs=[class("panel__heading")])
      div
        p("CONTINUATION LIFETIME",attrs=[class("kicker")])
        h2("Re-entry & structural cleanup")
      label(attrs=[class("switch")])
        input(attrs=[
          id("probe-toggle"),kind("checkbox"),
          checked { model.lab-probe-visible.get },
          on-change(fn(ev) model.lab-probe-visible.set(ev.checked))
        ])
        span("Show scope")

    div(attrs=[class("probe-stats")])
      div
        span("child active")
        strong(attrs=[id("probe-active")])
          text { if model.lab-probe-attached.get then "YES" else "NO" }
      div
        span("latest value")
        strong(attrs=[id("probe-value")])
          text { model.lab-probe-value.get.show }
      div
        span("child runs")
        strong(attrs=[id("probe-runs")])
          text { model.lab-probe-runs.get.show }
      div
        span("cleanups")
        strong(attrs=[id("probe-cleanups")])
          text { model.lab-probe-cleanups.get.show }

    dynamic
      val visible = model.lab-probe-visible.get
      if !visible then hidden-branch()
      else
        val channel-b = model.lab-active-b.get
        probe-branch(root,model,channel-b)
