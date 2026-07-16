/*--------------------------------------------------------------------------
  A dynamic DOM region whose listener creates continuation-owned work.
--------------------------------------------------------------------------*/
module examples/counter/probe

import kokaine/reactive
import kokaine/html
import examples/counter/model
import examples/counter/actions


fun probe-branch(root, model : lab-model, channel-b : bool)
  view fn()
    div([
      id("channel-scope"),class("scope-generation"),
      data("channel",if channel-b then "b" else "a")
    ],fn()
      div([],fn()
        p([class("field-label")],fn() text("LIVE GENERATION"))
        h2([],fn()
          text(if channel-b then "Channel B scope" else "Channel A scope")
        )
        p([class("scope-generation__copy")],fn()
          text("The button listener and any child effect belong to this exact region generation.")
        )
      )
      div([class("scope-generation__reading")],fn()
        span([],fn() text("selected source"))
        strong([],fn()
          if channel-b
          then text-live(fn() model.lab-channel-b.get.show)
          else text-live(fn() model.lab-channel-a.get.show)
        )
      )
      button([
        id("probe-arm"),class("button button--arm"),kind("button"),
        disabled-live(fn() model.lab-probe-attached.get || model.lab-frozen.get),
        on("click",fn(_) lab-arm-probe(root,model))
      ],fn()
        text-live(fn()
          if model.lab-probe-attached.get
          then "CHILD EFFECT ATTACHED"
          else "ATTACH CHILD EFFECT"
        )
      )
    )

fun hidden-branch()
  view fn()
    div([id("channel-scope"),class("scope-generation scope-generation--hidden")],fn()
      p([class("field-label")],fn() text("REGION RETIRED"))
      h2([],fn() text("Probe is hidden"))
      p([class("scope-generation__copy")],fn()
        text("The previous marker range, listener, child effect, and cleanup have been retired together.")
      )
    )

pub fun render-probe(root, model : lab-model)
  section([class("panel probe-panel")],fn()
    div([class("panel__heading")],fn()
      div([],fn()
        p([class("kicker")],fn() text("CONTINUATION LIFETIME"))
        h2([],fn() text("Re-entry & structural cleanup"))
      )
      label([class("switch")],fn()
        input([
          id("probe-toggle"),kind("checkbox"),
          checked-live(fn() model.lab-probe-visible.get),
          on-change(fn(ev) model.lab-probe-visible.set(ev.checked))
        ])
        span([],fn() text("Show scope"))
      )
    )

    div([class("probe-stats")],fn()
      div([],fn()
        span([],fn() text("child active"))
        strong([id("probe-active")],fn()
          text-live(fn() if model.lab-probe-attached.get then "YES" else "NO")
        )
      )
      div([],fn()
        span([],fn() text("latest value"))
        strong([id("probe-value")],fn()
          text-live(fn() model.lab-probe-value.get.show)
        )
      )
      div([],fn()
        span([],fn() text("child runs"))
        strong([id("probe-runs")],fn()
          text-live(fn() model.lab-probe-runs.get.show)
        )
      )
      div([],fn()
        span([],fn() text("cleanups"))
        strong([id("probe-cleanups")],fn()
          text-live(fn() model.lab-probe-cleanups.get.show)
        )
      )
    )

    region fn()
      val visible = model.lab-probe-visible.get
      if !visible then hidden-branch()
      else
        val channel-b = model.lab-active-b.get
        probe-branch(root,model,channel-b)
  )
