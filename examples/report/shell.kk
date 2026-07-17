/*--------------------------------------------------------------------------
  Report chrome. Navigation state is ordinary Kokaine state: no host script
  owns the mobile drawer or the active-link presentation.
--------------------------------------------------------------------------*/
module examples/report/shell

import kokaine/reactive
import kokaine/html


fun toc-link(open : signal<bool>, active : signal<string>, target : string,
             number : string, label-text : string)
  li
    a(attrs=[
      href("#" ++ target),
      class { if active.get == target then "is-active" else "" },
      attr("aria-current") {
        if active.get == target then Just("true") else Nothing
      },
      on-click(fn(_)
        active.set(target)
        open.set(False)
      )
    ])
      span(number)
      text(label-text)

fun legend-item(kind-name : string, label-text : string)
  span
    element-empty("i",attrs=[class("dot dot--" ++ kind-name)])
    text(label-text)

pub fun render-topbar(open : signal<bool>)
  a("跳到报告正文",attrs=[class("skip-link"),href("#report")])
  div(attrs=[class("reading-progress"),aria("hidden","true")])
    element-empty("span",attrs=[id("reading-progress")])

  header(attrs=[class("topbar")])
    a(attrs=[class("brand"),href("#top"),aria("label","返回报告开头")])
      span("K/Δ",attrs=[class("brand__mark")])
      span("Kokaine Field Report")
    button("目录",attrs=[
      id("toc-toggle"),kind("button"),class("toc-toggle button button--quiet"),
      aria("expanded") { if open.get then "true" else "false" },
      aria("controls","toc"),
      on-click(fn(_) open.modify(fn(value) !value))
    ])
    p(attrs=[class("topbar__status")])
      element-empty("span",attrs=[class("status-dot")])
      text("整份报告由 Kokaine 自己渲染")

pub fun render-toc(open : signal<bool>, active : signal<string>)
  element("aside",attrs=[
    id("toc"),
    class { if open.get then "toc is-open" else "toc" },
    aria("label","报告目录")
  ])
    p("REPORT / 07—26",attrs=[class("toc__eyebrow")])
    ol
      toc-link(open,active,"abstract","00","先说结论")
      toc-link(open,active,"journey","01","一次更新的旅程")
      toc-link(open,active,"flow-lab","02","真实数据流")
      toc-link(open,active,"effects","03","Koka 特性图谱")
      toc-link(open,active,"scheduler","04","如何少算又算对")
      toc-link(open,active,"batching","05","批量更新")
      toc-link(open,active,"dynamic","06","真实动态订阅")
      toc-link(open,active,"ownership","07","真实生命周期")
      toc-link(open,active,"comparison","08","框架对比")
      toc-link(open,active,"code","09","Koka 代码")
      toc-link(open,active,"wasm","10","浏览器与 WASM")
      toc-link(open,active,"demo","11","真实示例")
      toc-link(open,active,"limits","12","边界与结论")
    div(attrs=[class("toc__legend")])
      legend-item("source","原始数据")
      legend-item("memo","算出来的数据")
      legend-item("effect","页面动作")
