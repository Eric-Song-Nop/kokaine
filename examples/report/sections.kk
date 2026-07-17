/*--------------------------------------------------------------------------
  Narrative wrappers around the executable Kokaine experiments. The former
  HTML mount islands are now ordinary children of one page view.
--------------------------------------------------------------------------*/
module examples/report/sections

import kokaine/reactive
import kokaine/html
import examples/report/model
import examples/report/flow
import examples/report/features
import examples/report/dynamic
import examples/report/ownership
import examples/report/static


fun code-text(content : string)
  element("code",content)

pub fun render-flow-section(root, model : report-model)
  section(attrs=[id("flow-lab"),class("report-section lab-section"),
                 data("section","02")])
    header(attrs=[class("section-heading section-heading--split")])
      div
        p("02 / SELF-HOSTED DATA FLOW",attrs=[class("section-number")])
        h2("亲手推动一条真实的 Kokaine 数据流")
      p("按钮、派生值、live class 与数字文字都由编译后的 Koka 运行。轨迹图是这些真实响应式结果的语义投影，不声称读取私有调度队列。")

    div(attrs=[class("koka-mount koka-mount--flow")])
      render-flow(root,model)

    div(attrs=[class("annotation-row")])
      element("article")
        span("观察 1")
        element("h3","source 索引真实 capture")
        p("索引项打包执行 plane、目标 trace 与 owning read。它不是 wake callback、Observer ID 或被保留的完整 action。")
      element("article")
        span("观察 2")
        element("h3","两条执行 plane")
        p
          text("纯 derivation 只能保存 ")
          code-text("plane<total>")
          text("；UI effect 保存宿主 effect plane。完整 flush 优先推进 pure work，再推进 effect work。")
      element("article")
        span("观察 3")
        element("h3","状态属于 capability")
        p("Draft、Live、Pending、Running、Dead 描述真实 resumption 的生命周期；没有平行的 dirty Observer 状态机。")

pub fun render-features-section(model : report-model)
  section(attrs=[id("effects"),class("report-section"),data("section","03")])
    header(attrs=[class("section-heading")])
      p("03 / KOKA FEATURE ATLAS",attrs=[class("section-number")])
      h2("Koka 不只“有 effect”：它把控制流做成了可组合的语言材料")
      p("下面四组能力来自 Koka 3.2.3 官方文档。切换标签时，面板本身通过 Kokaine 的 signal 与 dynamic region 重建。")
    div(attrs=[class("koka-mount koka-mount--features")])
      render-features(model)

pub fun render-dynamic-section(model : report-model)
  section(attrs=[id("dynamic"),class("report-section lab-section"),
                 data("section","06")])
    header(attrs=[class("section-heading section-heading--split")])
      div
        p("06 / DYNAMIC DEPENDENCIES",attrs=[class("section-number")])
        h2("改动未被选择的 source，页面真的不会恢复")
      p
        text("这一段直接使用 ")
        code-text("dynamic")
        text(" 与两个真实 source。“本轮执行到哪个 read occurrence”比静态扫描更精确；切换模式会替换 region 的 continuation-owned generation。")
    div(attrs=[class("koka-mount koka-mount--dynamic")])
      render-dynamic(model)

pub fun render-ownership-section(root, model : report-model)
  section(attrs=[id("ownership"),class("report-section"),data("section","07")])
    header(attrs=[class("section-heading")])
      p("07 / OWNERSHIP & CLEANUP",attrs=[class("section-number")])
      h2("把分支隐藏掉，listener、child effect 与 cleanup 一起退休")
      p
        text("下面的 child effect 由分支里的真实 listener 创建；")
        code-text("on-cleanup")
        text(" 绑定到准确 generation。传播依赖 source-local capture，资源释放依赖结构化 frame——两者用途不同。")
    div(attrs=[class("koka-mount koka-mount--ownership")])
      render-ownership(root,model)
    render-dispose-protocol()

pub fun render-demo-section(revision : signal<int>)
  section(attrs=[id("demo"),class("report-section demo-section"),
                 data("section","11")])
    header(attrs=[class("section-heading section-heading--split")])
      div
        p("11 / REAL KOKA DEMO",attrs=[class("section-number")])
        h2("不是模拟器：这里运行真实的 Kokaine 示例")
      p("下面的控件、派生值、动态分支、事件与 cleanup 都来自拆分成多个模块的 Koka 源码，并编译到浏览器。")

    div(attrs=[class("demo-frame-wrap")])
      div(attrs=[class("demo-frame__bar")])
        span
          element-empty("i")
          element-empty("i")
          element-empty("i")
        code-text("examples/counter/*.kk + counter.kk → jsweb")
        button("重新载入",attrs=[
          id("demo-reload"),kind("button"),class("button button--quiet"),
          on-click(fn(_) revision.modify(fn(value) value + 1))
        ])
      dynamic
        val current = revision.get
        element-empty("iframe",attrs=[
          id("koka-demo"),
          title("Kokaine 真实 Continuation Lab 示例"),
          attr("src","../../examples/counter/index.html?revision=" ++ current.show),
          attr("loading","lazy")
        ])
    p(attrs=[class("demo-note")])
      text("需要先运行 ")
      code-text("make build-counter")
      text("，再从仓库根目录启动静态服务器；本报告的 ")
      code-text("make serve-report")
      text(" 会自动完成这一步。")
