/*--------------------------------------------------------------------------
  Read-only projection of the reactive graph.
--------------------------------------------------------------------------*/
module examples/counter/meter

import kokaine/reactive
import kokaine/html
import examples/counter/model


fun metric(label-text : string, value-id : string,
           read : () -> signal-read string)
  div([class("metric")],fn()
    span([class("metric__label")],fn() text(label-text))
    strong([id(value-id)],fn() text-live(read))
  )

pub fun render-meter(model : lab-model)
  section([id("continuation-ledger"),class("panel ledger")],fn()
    div([class("panel__heading")],fn()
      div([],fn()
        p([class("kicker")],fn() text("CAPTURED READ SUFFIXES"))
        h2([],fn() text("Continuation ledger"))
      )
      span([class("badge")],fn() text("LIVE"))
    )

    div([
      id("reading-panel"),
      attr-live("class",fn()
        Just("reading-card reading-card--" ++
             model.lab-parity-value.get.to-lower)
      ),
      attr-live("data-band",fn()
        Just(model.lab-band-value.get.lab-band-index.to-lower)
      ),
      attr-live("style",fn()
        Just("--level: " ++
             (lab-magnitude(model.lab-active-value.get) % 9).show)
      )
    ],fn()
      div([class("reading-card__top")],fn()
        span([],fn() text("ACTIVE VALUE"))
        strong([],fn()
          text-live(fn()
            if model.lab-active-b.get then "CHANNEL B" else "CHANNEL A"
          )
        )
      )
      p([id("active-value"),class("reading-card__value"),
         aria("live","polite")],fn()
        text-live(fn() model.lab-active-value.get.show)
      )
      div([class("level-track"),aria("hidden","true")],fn()
        span([],fn() text(""))
      )
    )

    div([class("metrics")],fn()
      metric("TOTAL / FAN-IN","total-value",
             fn() model.lab-total-value.get.show)
      metric("SQUARE / DERIVE","square-value",
             fn() model.lab-square-value.get.show)
      metric("PARITY / DERIVE","parity-value",
             fn() model.lab-parity-value.get)
      metric("PEAK / PREVIOUS","peak-value",
             fn() model.lab-peak-value.get.show)
    )

    div([class("trace")],fn()
      div([class("trace__line")],fn()
        span([class("trace__step trace__step--source")],fn()
          text-live(fn()
            if model.lab-active-b.get then "source B" else "source A"
          )
        )
        span([class("trace__arrow"),aria("hidden","true")],fn() text("→"))
        span([class("trace__step")],fn() text("captured suffix"))
        span([class("trace__arrow"),aria("hidden","true")],fn() text("→"))
        span([class("trace__step trace__step--effect")],fn() text("DOM effect"))
      )
      p([class("trace__note")],fn()
        text("A tracked get captures the remaining synchronous computation. Writes resume that suffix; they do not call a retained component closure.")
      )
    )

    div([class("ledger-list")],fn()
      div([class("ledger-row")],fn()
        div([],fn()
          span([class("ledger-row__label")],fn() text("CUSTOM EQUALITY"))
          strong([id("band-index")],fn()
            text-live(fn() model.lab-band-value.get.lab-band-index)
          )
        )
        div([class("ledger-row__pair")],fn()
          span([],fn() text("entered at"))
          strong([id("band-entered-at")],fn()
            text-live(fn() model.lab-band-value.get.lab-band-entered-at.show)
          )
          span([],fn() text("revisions"))
          strong([id("band-revisions")],fn()
            text-live(fn() model.lab-band-revisions.get.show)
          )
        )
      )

      div([class("ledger-row")],fn()
        div([],fn()
          span([class("ledger-row__label")],fn() text("UNTRACKED SAMPLE"))
          strong([id("sampled-operator")],fn()
            text-live(fn() model.lab-sampled-operator.get)
          )
        )
        p([],fn() text("Resamples only when the active-value suffix runs."))
      )

      div([class("ledger-row")],fn()
        div([],fn()
          span([class("ledger-row__label")],fn() text("ALWAYS-PUBLISH SOURCE"))
          strong([id("heartbeat")],fn()
            text-live(fn() model.lab-heartbeat.get.show)
          )
        )
        div([class("ledger-row__pair")],fn()
          span([],fn() text("resumptions"))
          strong([id("heartbeat-runs")],fn()
            text-live(fn() model.lab-heartbeat-runs.get.show)
          )
        )
      )

      div([class("ledger-row")],fn()
        div([],fn()
          span([class("ledger-row__label")],fn() text("EFFECT SINK"))
          strong([id("effect-snapshot")],fn()
            text-live(fn() model.lab-effect-snapshot.get)
          )
        )
        div([class("ledger-row__pair")],fn()
          span([],fn() text("runs"))
          strong([id("effect-runs")],fn()
            text-live(fn() model.lab-effect-runs.get.show)
          )
        )
      )
    )
  )
