/*--------------------------------------------------------------------------
  Dynamic dependency selection with two real sources.
--------------------------------------------------------------------------*/
module examples/report/dynamic

import kokaine/reactive
import kokaine/html
import examples/report/model


fun mode-button(model : report-model, name-mode : bool, button-id : string,
                label-text : string)
  button(label-text,attrs=[
    id(button-id),kind("button"),
    attr("aria-controls","kk-dynamic-preview"),
    aria("pressed") {
      if model.report-dynamic-name-mode.get == name-mode
      then "true" else "false"
    },
    class {
      if model.report-dynamic-name-mode.get == name-mode
      then "kk-mode-button kk-mode-button--active"
      else "kk-mode-button"
    },
    on-click(fn(_) model.report-dynamic-name-mode.set(name-mode))
  ])

pub fun render-dynamic(model : report-model)
  section(attrs=[class("kk-dynamic kk-card"),
                 aria("label","动态依赖实验")])
    header(attrs=[class("kk-island-heading")])
      div
        p("DYNAMIC SUBSCRIPTION",attrs=[class("kk-eyebrow")])
        h2("一次只订阅真正读到的 source")
      span("精确依赖",attrs=[class("kk-badge")])

    p(
      "先选择标题模式，再编辑两个 source。未被选择的 source 仍会保存输入，但不会让标题 continuation 或运行计数重新执行。",
      attrs=[class("kk-island-copy")]
    )

    div(attrs=[class("kk-mode-switch"),role("group"),
               aria("label","选择标题依赖")])
      mode-button(model,True,"kk-mode-name","使用名字")
      mode-button(model,False,"kk-mode-count","使用计数")

    div(attrs=[id("kk-dynamic-preview"),class("kk-dynamic__preview"),
               aria("live","polite"),aria("atomic","true")])
      span("页面标题",attrs=[class("kk-dynamic__preview-label")])
      strong(attrs=[id("kk-dynamic-output"),class("kk-dynamic__output")])
        text { model.report-dynamic-output.get }
      element("small",attrs=[class("kk-dynamic__runs")])
        text("这个 suffix 已运行 ")
        strong(attrs=[id("kk-dynamic-runs")])
          text { model.report-dynamic-runs.get.show }
        text(" 次")

    div(attrs=[class("kk-dynamic__sources")])
      div(attrs=[
        class {
          if model.report-dynamic-name-mode.get
          then "kk-source-card kk-source-card--active"
          else "kk-source-card kk-source-card--inactive"
        }
      ])
        div(attrs=[class("kk-source-card__head")])
          span("SOURCE A",attrs=[class("kk-eyebrow")])
          strong(attrs=[class("kk-source-card__state")])
            text {
              if model.report-dynamic-name-mode.get then "TRACKED" else "IDLE"
            }
        label("名字",attrs=[class("kk-field-label"),
                             attr("for","kk-dynamic-name")])
        input(attrs=[
          id("kk-dynamic-name"),class("kk-field"),kind("text"),
          attr("name","report-name"),attr("autocomplete","name"),
          value { model.report-dynamic-name.get },
          on-input(fn(next) model.report-dynamic-name.set(next)),
          aria("describedby","kk-dynamic-name-help")
        ])
        p("只有名字模式会捕获这个 get。",
          attrs=[id("kk-dynamic-name-help"),class("kk-field-help")])

      div(attrs=[
        class {
          if !model.report-dynamic-name-mode.get
          then "kk-source-card kk-source-card--active"
          else "kk-source-card kk-source-card--inactive"
        }
      ])
        div(attrs=[class("kk-source-card__head")])
          span("SOURCE B",attrs=[class("kk-eyebrow")])
          strong(attrs=[class("kk-source-card__state")])
            text {
              if !model.report-dynamic-name-mode.get then "TRACKED" else "IDLE"
            }
        label("计数",attrs=[class("kk-field-label"),
                             attr("for","kk-dynamic-count")])
        input(attrs=[
          id("kk-dynamic-count"),class("kk-field"),kind("number"),
          attr("name","report-count"),attr("autocomplete","off"),
          attr("inputmode","numeric"),
          value { model.report-dynamic-count.get },
          on-input(fn(next) model.report-dynamic-count.set(next)),
          aria("describedby","kk-dynamic-count-help")
        ])
        p("只有计数模式会捕获这个 get。",
          attrs=[id("kk-dynamic-count-help"),class("kk-field-help")])

    p(attrs=[class("kk-note")])
      strong("试验方法：")
      text("保持“使用名字”，修改计数；标题和 suffix 次数都不会变化。切换模式后，旧名字 source 的订阅也会被替换。")
