/*--------------------------------------------------------------------------
  Read-only projection of the reactive graph.
--------------------------------------------------------------------------*/
module examples/counter/meter

import kokaine/reactive
import kokaine/html
import examples/counter/model


fun metric(label-text : string, value-id : string,
           read : () -> signal-read string)
  div(attrs=[class("metric")])
    span(label-text,attrs=[class("metric__label")])
    strong(attrs=[id(value-id)])
      text { read() }

pub fun render-meter(model : lab-model)
  section(attrs=[id("continuation-ledger"),class("panel ledger")])
    div(attrs=[class("panel__heading")])
      div
        p("CAPTURED READ SUFFIXES",attrs=[class("kicker")])
        h2("Continuation ledger")
      span("LIVE",attrs=[class("badge")])

    div(attrs=[
      id("reading-panel"),
      class {
        "reading-card reading-card--" ++
        model.lab-parity-value.get.to-lower
      },
      data("band") { model.lab-band-value.get.lab-band-index.to-lower },
      attr("style") {
        Just("--level: " ++
             (lab-magnitude(model.lab-active-value.get) % 9).show)
      }
    ])
      div(attrs=[class("reading-card__top")])
        span("ACTIVE VALUE")
        strong
          text {
            if model.lab-active-b.get then "CHANNEL B" else "CHANNEL A"
          }
      p(attrs=[id("active-value"),class("reading-card__value"),
               aria("live","polite")])
        text { model.lab-active-value.get.show }
      div(attrs=[class("level-track"),aria("hidden","true")])
        span("")

    div(attrs=[class("metrics")])
      metric("TOTAL / FAN-IN","total-value",
             fn() model.lab-total-value.get.show)
      metric("SQUARE / DERIVE","square-value",
             fn() model.lab-square-value.get.show)
      metric("PARITY / DERIVE","parity-value",
             fn() model.lab-parity-value.get)
      metric("PEAK / STATE","peak-value",
             fn() model.lab-peak-value.get.show)

    div(attrs=[class("trace")])
      div(attrs=[class("trace__line")])
        span(attrs=[class("trace__step trace__step--source")])
          text {
            if model.lab-active-b.get then "source B" else "source A"
          }
        span("→",attrs=[class("trace__arrow"),aria("hidden","true")])
        span("captured suffix",attrs=[class("trace__step")])
        span("→",attrs=[class("trace__arrow"),aria("hidden","true")])
        span("DOM effect",attrs=[class("trace__step trace__step--effect")])
      p("A tracked get captures the remaining synchronous computation. Writes resume that suffix; they do not call a retained component closure.",
        attrs=[class("trace__note")])

    div(attrs=[class("ledger-list")])
      div(attrs=[class("ledger-row")])
        div
          span("CUSTOM EQUALITY",attrs=[class("ledger-row__label")])
          strong(attrs=[id("band-index")])
            text { model.lab-band-value.get.lab-band-index }
        div(attrs=[class("ledger-row__pair")])
          span("entered at")
          strong(attrs=[id("band-entered-at")])
            text { model.lab-band-value.get.lab-band-entered-at.show }
          span("revisions")
          strong(attrs=[id("band-revisions")])
            text { model.lab-band-revisions.get.show }

      div(attrs=[class("ledger-row")])
        div
          span("UNTRACKED SAMPLE",attrs=[class("ledger-row__label")])
          strong(attrs=[id("sampled-operator")])
            text { model.lab-sampled-operator.get }
        p("Resamples only when the active-value suffix runs.")

      div(attrs=[class("ledger-row")])
        div
          span("ALWAYS-PUBLISH SOURCE",attrs=[class("ledger-row__label")])
          strong(attrs=[id("heartbeat")])
            text { model.lab-heartbeat.get.show }
        div(attrs=[class("ledger-row__pair")])
          span("resumptions")
          strong(attrs=[id("heartbeat-runs")])
            text { model.lab-heartbeat-runs.get.show }

      div(attrs=[class("ledger-row")])
        div
          span("EFFECT SINK",attrs=[class("ledger-row__label")])
          strong(attrs=[id("effect-snapshot")])
            text { model.lab-effect-snapshot.get }
        div(attrs=[class("ledger-row__pair")])
          span("runs")
          strong(attrs=[id("effect-runs")])
            text { model.lab-effect-runs.get.show }
