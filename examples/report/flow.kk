/*--------------------------------------------------------------------------
  Executable signal -> derive -> memo(previous) flow.
--------------------------------------------------------------------------*/
module examples/report/flow

import kokaine/reactive
import kokaine/html
import examples/report/model


fun flow-plus(model : report-model)
  model.report-flow-count.modify(fn(value) value + 1)

fun flow-batch(root, model : report-model)
  // Three writes, one explicit scheduler boundary.
  batch(root)
    model.report-flow-count.modify(fn(value) value + 1)
    model.report-flow-count.modify(fn(value) value + 1)
    model.report-flow-count.modify(fn(value) value + 1)

fun flow-reset(root, model : report-model)
  batch(root)
    model.report-flow-count.set(2)

fun flow-stat(label-text : string, value-id : string,
              detail : string, read : () -> signal-read string)
  div(attrs=[class("kk-stat")])
    span(label-text,attrs=[class("kk-stat__label")])
    strong(attrs=[id(value-id),class("kk-stat__value")])
      text { read() }
    element("small",detail,attrs=[class("kk-stat__detail")])

pub fun render-flow(root, model : report-model)
  section(attrs=[class("kk-flow kk-card"),aria("label","Kokaine 真实响应式数据流")])
    header(attrs=[class("kk-island-heading")])
      div
        p("LIVE KOKAINE ROOT",attrs=[class("kk-eyebrow")])
        h2("signal、derive 与 previous 正在运行")
      span("真实续体",attrs=[class("kk-badge")])

    p(
      "每次操作都直接写入 Kokaine signal。平方与奇偶由 derive 计算；revision 与 peak 由 memo(previous) 保存状态。",
      attrs=[class("kk-island-copy")]
    )

    div(attrs=[class("kk-toolbar kk-flow__toolbar"),role("group"),
               aria("label","数据流操作")])
      button("写入 +1",attrs=[
        id("kk-flow-plus"),class("kk-button kk-button--primary"),kind("button"),
        on-click(fn(_) flow-plus(model))
      ])
      button("batch +3",attrs=[
        id("kk-flow-batch"),class("kk-button kk-button--accent"),kind("button"),
        aria("label","在一个显式 batch 中连续写入三次"),
        on("click",fn(_) flow-batch(root,model))
      ])
      button("复位为 2",attrs=[
        id("kk-flow-reset"),class("kk-button kk-button--quiet"),kind("button"),
        on("click",fn(_) flow-reset(root,model))
      ])

    div(attrs=[
      class {
        "kk-flow__reading kk-flow__reading--" ++
        (if model.report-flow-count.get % 2 == 0 then "even" else "odd")
      }
    ])
      span("当前 source",attrs=[class("kk-flow__reading-label")])
      strong(attrs=[class("kk-flow__hero-value")])
        text { model.report-flow-count.get.show }
      span(attrs=[class("kk-flow__reading-state")])
        text { model.report-flow-parity.get }

    div(attrs=[class("kk-stat-grid kk-flow__stats"),
               aria("live","polite"),aria("atomic","false")])
      flow-stat("COUNT","kk-flow-count","signal<int>",
                fn() model.report-flow-count.get.show)
      flow-stat("SQUARE","kk-flow-square","derive",
                fn() model.report-flow-square.get.show)
      flow-stat("PARITY","kk-flow-parity","derive + equality",
                fn() model.report-flow-parity.get)
      flow-stat("REVISION","kk-flow-revision","memo(previous)",
                fn() model.report-flow-revision.get.show)
      flow-stat("PEAK","kk-flow-peak","memo(previous)",
                fn() model.report-flow-peak.get.show)

    div(attrs=[class("kk-flow__pipeline"),aria("hidden","true")])
      span("signal count",attrs=[class("kk-flow__node kk-flow__node--source")])
      strong("→",attrs=[class("kk-flow__arrow")])
      span("derive square / parity",attrs=[class("kk-flow__node kk-flow__node--derive")])
      strong("→",attrs=[class("kk-flow__arrow")])
      span("memo(previous)",attrs=[class("kk-flow__node kk-flow__node--memo")])

    p(attrs=[class("kk-note")])
      strong("batch +3 ")
      text("会执行三次 source write，但只在 batch 边界结算依赖图；复位不会抹掉 peak，因为 previous 正是这个状态实验要展示的语义。")
