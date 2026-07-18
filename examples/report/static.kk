/*--------------------------------------------------------------------------
  Static long-form sections for the executable report.

  These sections deliberately use only the typed `kokaine/html` vocabulary.
  Keeping the prose in Koka means the report's HTML entry can remain a small
  mount point instead of a second, hand-authored implementation of the page.
--------------------------------------------------------------------------*/
module examples/report/static

import kokaine/html


fun inline-code(content : string)
  element("code",content)

fun small-text(content : string)
  element("small",content)

fun empty-decoration(name : string)
  element-empty(name)

fun proof-step(index : string, source : string, detail : string)
  li
    element("b",index)
    span
      inline-code(source)
      small-text(detail)

fun abstract-card(index : string, heading : string, copy)
  element("article")
    span(index,attrs=[class("card-index")])
    h2(heading)
    p
      copy()


pub fun render-abstract()
  section(attrs=[class("hero report-section"),id("abstract"),
                 data("section","00")])
    div(attrs=[class("hero__copy")])
      p(attrs=[class("kicker")])
        span("SELF-HOSTED",attrs=[class("live-pill")])
        text(" 可执行技术报告 · 面向 UI 工作者")
      h1
        text("这份报告，正在被")
        br()
        text("自己的")
        element("em","续体")
        text("驱动")
      p(attrs=[class("hero__lead")])
        text("页面里的数据流、动态分支与 cleanup 实验不是原生 JavaScript 仿制品：它们由本仓库的 ")
        inline-code("kokaine/html")
        text("、")
        inline-code("signal")
        text("、")
        inline-code("derive")
        text(" 与 ")
        inline-code("signal + create-effect")
        text(" 直接生成。每次 tracked ")
        inline-code("get")
        text(" 留下")
        strong("读取之后的精确计算后缀")
        text("；值改变后恢复 suffix，prefix 不会重放。")
      div(attrs=[class("hero__actions")])
        a("推动真实数据流",attrs=[class("button button--primary"),
                                   href("#flow-lab")])
        a("浏览 Koka 特性",attrs=[class("button button--quiet"),
                                  href("#effects")])

    element("figure",attrs=[class("hero-proof"),
                            aria("labelledby","hero-proof-title")])
      element("figcaption",attrs=[id("hero-proof-title")])
        span
          empty-decoration("i")
          text(" LIVE BUILD / KOKA 3.2.3")
        strong("REPORT PROVENANCE")
      ol(attrs=[class("proof-route")])
        proof-step("01","examples/report/*.kk","报告交互与状态模型")
        proof-step("02","html<e> / emit","effect-handled view builder")
        proof-step("03","jsweb / mount","continuation-backed DOM effects")
        li(attrs=[class("is-live")])
          element("b","04")
          span
            strong("你正在操作的页面")
            small-text("没有 JSX，也没有虚拟 DOM")
      a(attrs=[class("proof-source"),href("../../examples/report.kk")])
        text("查看报告入口源码 ")
        span("↗")

    div(attrs=[class("abstract-grid")])
      abstract-card("A","代数效应定义能力边界")
        inline-code("signal-read")
        text("、")
        inline-code("signal-write")
        text(" 与 ")
        inline-code("html<e>")
        text(" 说明代码可以请求什么；handler 决定如何解释请求。效应类型本身并不等于增量传播。")
      abstract-card("B","续体是增量执行单元")
        text("每个 tracked read occurrence 都通过 ")
        inline-code("raw ctl")
        text(" 捕获自己的同步后缀；后续读取继续捕获，形成嵌套的 ")
        inline-code("Trace-read")
        text("。")
      abstract-card("C","调度器负责正确提交")
        text("source 本地索引真实 capture；写入排入 ")
        inline-code("Resume-work(trace)")
        text("。Draft 只在后缀与发布成功后变成 Live，失败或 final control 会回滚草稿。")


fun journey-step(index : string, heading : string, detail : string)
  li
    span(index,attrs=[class("journey-map__icon")])
    div
      strong(heading)
      small-text(detail)

pub fun render-journey()
  section(attrs=[class("report-section"),id("journey"),
                 data("section","01")])
    header(attrs=[class("section-heading")])
      p("01 / THE JOURNEY",attrs=[class("section-number")])
      h2("一条语句，被 get 切成 prefix 与 suffix")
      p("增量性的关键不是“记住谁读过谁”，而是把同步执行在准确位置切开，并保存可以恢复的后半段。")

    element("figure",attrs=[class("journey-map"),
                            aria("labelledby","journey-title")])
      element("figcaption",attrs=[id("journey-title"),
                                  class("figure-title")])
        span("图 1")
        strong("一次同步读取的精确捕获与恢复")
      ol
        journey-step("01","先执行 prefix","日志、局部计算、分支判断")
        journey-step("02","执行 tracked count.get",
                     "在 reify-trace 中发出 signal-read")
        journey-step("03","handler 捕获 K","K = get 之后的 suffix")
        journey-step("04","初次立刻 resume","用当前值完成本轮计算")
        journey-step("05","写入后 Resume(K)",
                     "prefix 不再执行；suffix 建新 draft")

    div(attrs=[class("plain-model")])
      div(attrs=[class("plain-model__formula"),
                 aria("label","增量恢复等于 source 本地 capture 索引、精确后缀、提交协议与执行平面")])
        span("增量恢复")
        element("b","=")
        span("source-local capture")
        element("b","+")
        span("精确 suffix")
        element("b","+")
        span("draft / publish")
        element("b","+")
        span("执行 plane")
      p
        text("例如 ")
        inline-code("prefix(); val a = x.get; middle(); val b = y.get; suffix()")
        text(" 会产生嵌套轨迹：")
        inline-code("Trace-read(x, child = Trace-read(y, child = Trace-end))")
        text("。每个 read occurrence 都有自己的 K；重复读取同一 source 也不会复用一次捕获。")


pub fun render-dispose-protocol()
  element("figure",attrs=[class("dispose-phases"),
                          aria("labelledby","dispose-title")])
    element("figcaption",attrs=[id("dispose-title"),
                                class("figure-title")])
      span("图 3")
      strong("安全清理分两段完成")
    div
      span("1",attrs=[class("phase-number")])
      element("h3","先把旧 branch 设为 Dead")
      p("退役完整 child trace 与结构后代，source 本地索引在 compact 时移除失效 capture。已在队列中的 stale ticket 可以保留到 frontier 扫描时被跳过。")
    div("→",attrs=[class("dispose-phases__arrow")])
    div
      span("2",attrs=[class("phase-number")])
      element("h3","再发布新 Draft")
      p("恢复 Pending trace 时，新 capture 和结构孩子先属于 Draft frame。旧 generation 的 finalizer、用户 cleanup、计算与 publication 都成功后才激活新 trace；失败或 abortive final control 会同步清理 Draft，并让原 capability 保持 Pending 以供重试。触发本轮的 source write 已经提交，不会随 Draft 一起回滚。")


fun target-route(first : string, middle : string, last : string)
  div(attrs=[class("target-route")])
    span(first)
    element("b","→")
    span(middle)
    element("b","→")
    span(last)

pub fun render-wasm()
  section(attrs=[class("report-section"),id("wasm"),
                 data("section","10")])
    header(attrs=[class("section-heading")])
      p("10 / THE BROWSER BOUNDARY",attrs=[class("section-number")])
      h2("宿主 callback 是入口，不是用户 action 的执行模型")
      p
        text("tracked computation 中的 ")
        inline-code("get")
        text(" 捕获读操作后的同步 K；listener 安装也在 ")
        inline-code("await-browser-event")
        text(" 处停放真实 event continuation。浏览器仍从 ABI callback 进入，但用户 action 只由 continuation resume 执行。")

    element("figure",attrs=[class("runtime-layers"),
                            aria("labelledby","runtime-layers-title")])
      element("figcaption",attrs=[id("runtime-layers-title"),
                                  class("figure-title")])
        span("图 4")
        strong("同步捕获与宿主异步回调的边界")
      div(attrs=[class("runtime-core")])
        span("KOKAINE CORE")
        strong("exact read K · source-local index · structural frames")
        small-text("响应式核心不认识 document；DOM adapter 负责宿主落点")
      div(attrs=[class("runtime-split"),aria("hidden","true")])
        empty-decoration("i")
        empty-decoration("i")
      div(attrs=[class("runtime-targets")])
        element("article")
          span("SYNCHRONOUS GET",attrs=[class("target-badge")])
          element("h3","捕获并恢复 actual K")
          p
            inline-code("raw ctl")
            text(" 截取 read operation 之后的同步控制流；source 写入最终安排 ")
            inline-code("Resume-work(trace)")
            text("。")
          target-route("prefix","get / capture K","suffix")
        element("article")
          span("ASYNCHRONOUS EVENT",
               attrs=[class("target-badge target-badge--wasm")])
          element("h3","ABI callback + event continuation")
          p
            text("listener 保存 structural ")
            inline-code("reentry")
            text(" 与 opaque multi-shot event K。JS 只快照事件；live/retired gate 保证该 raw resumption 在 DOM generation 退休后不可再进入。")
          target-route("JS event snapshot","reenter","resume event K")

    div(attrs=[class("boundary-note")])
      element("h3","lifetime reentry 恢复什么，又不恢复什么？")
      p
        inline-code("reenter")
        text(" 本身仍是 non-resumptive lifetime capability：它检查 frame、恢复 effect-plane gate 与 generation frame，并安装新的读写 handler。随后 adapter 在这个 batch 内同步 resume 独立的 event continuation；因此嵌套 ")
        inline-code("dispatchEvent")
        text(" 与 ")
        inline-code("preventDefault")
        text(" 保持浏览器原生时序，callback 内新建的 effect、async lease 与 cleanup 也归属于准确 generation。它不会伪造已经返回的任意用户 handler，因此 public callback 关闭为 ")
        inline-code("<signal-read,signal-write,ui,async,pure>")
        text("；未在 callback 内处理的额外 effect 会被类型检查拒绝。wasmweb 若使用对象句柄，仍须管理 ABI callback 与 JS 对象句柄的保留和释放。")
      p
        text("页面级 scroll/hash 不复制这套 multi-shot event runtime；薄的 window adapter 用 ")
        inline-code("setup/await")
        text(" 安装可撤销的 one-shot listener。宿主 callback 只完成 await，导航策略在 generation reentry 后的新 batch 中运行；自动播放同样直接 ")
        inline-code("sleep")
        text("，timer 不持有 report action。")


fun limits-list(items : list<string>)
  ul
    items.foreach fn(item)
      li(item)

fun reference(target : string, label-text : string)
  a(label-text,attrs=[href(target)])

pub fun render-limits()
  section(attrs=[class("report-section"),id("limits"),
                 data("section","12")])
    header(attrs=[class("section-heading")])
      p("12 / CONCLUSION",attrs=[class("section-number")])
      h2("它解决了什么，又刻意没解决什么？")

    div(attrs=[class("limits-grid")])
      element("article",attrs=[class("limits-grid__yes")])
        span("这套核心负责")
        limits-list([
          "按实际读取建立细粒度数据流",
          "恢复 tracked get 的精确同步后缀，而非重跑 retained action",
          "以 pure/effect plane 排序，并用相等判断截断发布",
          "batch 延迟 settling；写值、版本递增与 notify 仍逐次发生",
          "让读、写、UI 能力进入 Koka 的效应类型",
          "让 Draft、listener、DOM range 与异步 task lease 跟随 generation 清理",
          "用显式 business key 保持列表行身份，并在 O(log n) 索引中更新"
        ])
      element("article",attrs=[class("limits-grid__not-yet")])
        span("更高层能力仍需单独设计")
        limits-list([
          "服务端 hydration 与流式客户端恢复",
          "面向超大数据集的窗口化与虚拟列表策略",
          "跨请求的 Suspense 协议与服务端传输格式",
          "跨线程更新",
          "生产级 wasmweb DOM 适配器",
          "恢复 mount 外已经返回的任意用户 handler 栈"
        ])

    element("blockquote",attrs=[class("final-thesis")])
      p
        text("在 Kokaine 中，增量 UI 的关键不是给订阅队列换名字，而是让 tracked ")
        inline-code("get")
        text(" 留下")
        strong("可直接恢复的精确同步后缀")
        text("；source 本地索引这些 capability，写入安排 ")
        inline-code("Resume-work(trace)")
        text("，成功的 Draft 才替换旧 generation。")
      footer
        text("代数效应让读、写、HTML builder 与局部 override 成为可组合的语言能力；continuation 才是传播时被恢复的执行单位。bootstrap 的 calculation closure 只消费一次：首次 bootstrap 失败会 retire scope，不能用已消费 closure 重试；已经捕获的 replacement K 失败时则保持 Pending，可在后续 flush 重试。")

    section(attrs=[class("references"),
                   aria("labelledby","references-title")])
      element("h3","资料与实现依据",attrs=[id("references-title")])
      div
        reference("https://react.dev/learn/render-and-commit",
                  "React · Render and Commit")
        reference("https://react.dev/learn/queueing-a-series-of-state-updates",
                  "React · Queueing state updates")
        reference("https://vuejs.org/guide/extras/reactivity-in-depth.html",
                  "Vue · Reactivity in Depth")
        reference("https://vuejs.org/api/general.html#nexttick",
                  "Vue · DOM update timing")
        reference("https://docs.solidjs.com/advanced-concepts/fine-grained-reactivity",
                  "SolidJS · Fine-grained reactivity")
        reference("https://docs.solidjs.com/reference/reactive-utilities/batch",
                  "SolidJS · batch")
        reference("https://koka-lang.github.io/koka/doc/book.html#sec-effect-types",
                  "Koka · Effect types")
        reference("https://koka-lang.github.io/koka/doc/book.html#sec-opfun",
                  "Koka · Tail-resumptive operations")
        reference("https://koka-lang.github.io/koka/doc/book.html#sec-multi-resume",
                  "Koka · Multi-shot resumptions")
        reference("https://koka-lang.github.io/koka/doc/book.html#sec-fbip",
                  "Koka · Functional but in-place")
        reference("../architecture.md","Kokaine · Architecture")
        reference("../../src/kokaine/reactive.kk","Kokaine · Reactive source")
        reference("../../src/kokaine/html.kk","Kokaine · HTML DSL source")
      p("框架对比以各项目官方文档描述的基础模型为准；所有队列动画、工作范围和次数都是 semantic simulation，用于解释状态转换，不是 runtime instrumentation 或 benchmark。")


pub fun render-report-footer()
  footer(attrs=[class("report-footer")])
    span("KOKAINE / ALGEBRAIC EFFECTS / INCREMENTAL UI")
    span("交互报告 · 2026")
