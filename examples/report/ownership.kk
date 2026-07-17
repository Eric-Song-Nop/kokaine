/*--------------------------------------------------------------------------
  Structural lifetime: a listener creates child work owned by its exact
  dynamic-region generation.
--------------------------------------------------------------------------*/
module examples/report/ownership

import kokaine/reactive
import kokaine/html
import examples/report/model


fun toggle-owner(model : report-model)
  model.report-owner-visible.modify(fn(value) !value)

fun arm-owner(root, model : report-model)
  if model.report-owner-active.get then ()
  else
    model.report-owner-active.set(True)

    // Because this runs inside DOM re-entry, the cleanup is attached to the
    // dynamic branch generation which created this listener.
    on-cleanup(root,fn()
      model.report-owner-active.set(False)
      model.report-owner-cleanups.modify(fn(value) value + 1)
    )

    // This effect is a real child capability, also created by the listener.
    // The shared flow count is its heartbeat, tying two report sections to
    // the same root without any global JavaScript bridge.
    val child-dispose = create-effect(
      root,
      fn() model.report-flow-count.get,
      fn(_) model.report-owner-runs.modify(fn(value) value + 1)
    )
    ()

fun visible-owner-branch(root, model : report-model)
  element("article",attrs=[class("kk-owner-branch kk-owner-branch--visible")])
    div(attrs=[class("kk-owner-branch__copy")])
      p("LIVE GENERATION",attrs=[class("kk-eyebrow")])
      element("h3","详情分支正在 DOM 中")
      p("点击“挂接 child effect”，监听器会在自己的 re-entry generation 内创建 effect 与 cleanup。随后可用上方数据流按钮触发 child。")
    div(attrs=[class("kk-owner-branch__action")])
      span("共享 count",attrs=[class("kk-owner-branch__label")])
      strong(attrs=[class("kk-owner-branch__count")])
        text { model.report-flow-count.get.show }
      button(attrs=[
        id("kk-owner-arm"),kind("button"),
        class("kk-button kk-button--accent"),
        disabled { model.report-owner-active.get },
        aria("pressed") {
          if model.report-owner-active.get then "true" else "false"
        },
        on("click",fn(_) arm-owner(root,model))
      ])
        text {
          if model.report-owner-active.get
          then "CHILD EFFECT 已挂接"
          else "挂接 CHILD EFFECT"
        }

fun hidden-owner-branch()
  element("article",attrs=[class("kk-owner-branch kk-owner-branch--hidden")])
    div(attrs=[class("kk-owner-branch__retired"),aria("live","polite")])
      span("RETIRED",attrs=[class("kk-badge")])
      element("h3","旧 generation 已整体退出")
      p("节点、listener、child effect 与 on-cleanup 共享同一结构生命周期；隐藏分支时无需手工逐项注销。")

fun owner-stat(label-text : string, value-id : string,
               read : () -> signal-read string)
  div(attrs=[class("kk-stat")])
    span(label-text,attrs=[class("kk-stat__label")])
    strong(attrs=[id(value-id),class("kk-stat__value")])
      text { read() }

pub fun render-ownership(root, model : report-model)
  section(attrs=[class("kk-ownership kk-card"),
                 aria("label","结构所有权与清理实验")])
    header(attrs=[class("kk-island-heading")])
      div
        p("CONTINUATION OWNERSHIP",attrs=[class("kk-eyebrow")])
        h2("移除分支，也移除它创建的工作")
      span("结构化清理",attrs=[class("kk-badge")])

    div(attrs=[class("kk-ownership__toolbar")])
      p("先挂接 child effect，再隐藏分支；active 会归零，cleanups 会增加。重新显示会得到全新的 listener generation。")
      button(attrs=[
        id("kk-owner-toggle"),kind("button"),
        class("kk-button kk-button--primary"),
        attr("aria-controls","kk-owner-region"),
        aria("expanded") {
          if model.report-owner-visible.get then "true" else "false"
        },
        on-click(fn(_) toggle-owner(model))
      ])
        text {
          if model.report-owner-visible.get then "隐藏详情分支" else "重新显示分支"
        }

    div(attrs=[class("kk-stat-grid kk-ownership__stats"),
               aria("live","polite"),aria("atomic","false")])
      owner-stat("ACTIVE","kk-owner-active",fn()
        if model.report-owner-active.get then "YES" else "NO"
      )
      owner-stat("CHILD RUNS","kk-owner-runs",fn()
        model.report-owner-runs.get.show
      )
      owner-stat("CLEANUPS","kk-owner-cleanups",fn()
        model.report-owner-cleanups.get.show
      )

    div(attrs=[id("kk-owner-region"),class("kk-ownership__region")])
      dynamic
        if model.report-owner-visible.get
        then visible-owner-branch(root,model)
        else hidden-owner-branch()

    p(attrs=[class("kk-note")])
      strong("关键验证：")
      text("隐藏后再操作数据流 count，CHILD RUNS 不会增加；这证明旧 child effect 已被真实 dispose，而不只是把卡片设为不可见。")
