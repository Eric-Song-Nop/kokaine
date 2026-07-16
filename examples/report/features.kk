/*--------------------------------------------------------------------------
  A live tour of Koka language features used by Kokaine itself.
--------------------------------------------------------------------------*/
module examples/report/features

import kokaine/reactive
import kokaine/html
import examples/report/model


fun feature-tab(model : report-model, key : string, button-id : string,
                label-text : string)
  button(label-text,attrs=[
    id(button-id),kind("button"),
    attr("aria-controls","kk-feature-panel"),
    aria("pressed") {
      if model.report-feature.get == key then "true" else "false"
    },
    class {
      if model.report-feature.get == key
      then "kk-feature-tab kk-feature-tab--active"
      else "kk-feature-tab"
    },
    on-click(fn(_) model.report-feature.set(key))
  ])

fun code-sample(content : string)
  element("pre",attrs=[class("kk-code")])
    element("code")
      text(content)

fun official-link(target : string, label-text : string)
  a(label-text,attrs=[
    class("kk-doc-link"),href(target),attr("target","_blank"),
    attr("rel","noreferrer"),
    aria("label",label-text ++ "（在新标签页打开）")
  ])

fun effects-panel()
  element("article",attrs=[class("kk-feature-panel__body")])
    div(attrs=[class("kk-feature-panel__copy")])
      p("EFFECT ROW",attrs=[class("kk-eyebrow")])
      element("h3","类型会写出一段代码可能请求的能力")
      p("Koka 的 effect row 是开放且可多态的：调用方从类型上就能分辨纯计算、读取 signal 与写入宿主 UI。handler 再决定每个 operation 的解释。")
      official-link(
        "https://koka-lang.github.io/koka/doc/book.html#sec-effect-types",
        "阅读 Koka 官方文档：Effect Types"
      )
    code-sample(
      "fun project(read : () -> <signal-read,pure> int)\n" ++
      "            : <signal-read,pure> int\n" ++
      "  read() * read()\n\n" ++
      "// effect row 精确描述允许发生的 operation"
    )

fun control-panel()
  element("article",attrs=[class("kk-feature-panel__body")])
    div(attrs=[class("kk-feature-panel__copy")])
      p("FUN / CTL / RAW CTL",attrs=[class("kk-eyebrow")])
      element("h3","从尾恢复到手动管理续体")
      p("fun operation 保证恰好尾恢复一次；ctl 把 resume 交给 handler；raw ctl 还暴露 rcontext，让 Kokaine 可以保存、恢复或 finalize 精确的同步后缀。")
      official-link(
        "https://koka-lang.github.io/koka/doc/book.html#sec-opfun",
        "阅读 Koka 官方文档：Tail-resumptive 与 Control Operations"
      )
    code-sample(
      "with fun ask() 21\n" ++
      "with ctl choose() resume(True)\n\n" ++
      "with raw ctl read-source(source,mode)\n" ++
      "  // rcontext.resume(value) / finalize(result)"
    )

fun multishot-panel()
  element("article",attrs=[class("kk-feature-panel__body")])
    div(attrs=[class("kk-feature-panel__copy")])
      p("MULTI-SHOT RESUMPTION",attrs=[class("kk-eyebrow")])
      element("h3","同一个未来可以被探索不止一次")
      p("一般 ctl 的 resume 可以调用多次，因此回溯、搜索与概率程序都能写成普通 handler。Kokaine 的普通更新选择单次恢复，但底层控制能力更通用。")
      official-link(
        "https://koka-lang.github.io/koka/doc/book.html#sec-multi-resume",
        "阅读 Koka 官方文档：Resuming More Than Once"
      )
    code-sample(
      "effect ctl choice() : bool\n\n" ++
      "with ctl choice()\n" ++
      "  val no  = resume(False)\n" ++
      "  val yes = resume(True)\n" ++
      "  no || yes"
    )

fun perceus-panel()
  element("article",attrs=[class("kk-feature-panel__body")])
    div(attrs=[class("kk-feature-panel__copy")])
      p("PERCEUS",attrs=[class("kk-eyebrow")])
      element("h3","确定性引用计数，还能复用构造器")
      p("Perceus 用编译器分析消除大部分引用计数，并把同尺寸的 pattern match 与 constructor 配对复用。Koka 因而能直接生成 C，无需 tracing GC。")
      official-link(
        "https://koka-lang.github.io/koka/doc/book.html#why-perceus",
        "阅读 Koka 官方文档：Perceus"
      )
    code-sample(
      "fun map(xs,f)\n" ++
      "  match xs\n" ++
      "    Cons(x,xx) -> Cons(f(x),map(xx,f))\n" ++
      "    Nil        -> Nil\n\n" ++
      "// reuse analysis 可原位复用 Cons"
    )

pub fun render-features(model : report-model)
  section(attrs=[class("kk-features kk-card"),
                 aria("label","Koka 官方特性交互导览")])
    header(attrs=[class("kk-island-heading")])
      div
        p("OFFICIAL KOKA FEATURES",attrs=[class("kk-eyebrow")])
        h2("这份报告背后的语言能力")
      span("4 个特性",attrs=[class("kk-badge")])

    div(attrs=[class("kk-feature-tabs"),role("group"),
               aria("label","选择 Koka 特性")])
      feature-tab(model,"effects","kk-feature-effects","Effect row")
      feature-tab(model,"control","kk-feature-control","fun / ctl / raw ctl")
      feature-tab(model,"multishot","kk-feature-multishot","Multi-shot")
      feature-tab(model,"perceus","kk-feature-perceus","Perceus")

    div(attrs=[id("kk-feature-panel"),class("kk-feature-panel"),
               role("region"),aria("label","当前 Koka 特性"),
               aria("live","polite"),
               aria("atomic","true")])
      dynamic
        match model.report-feature.get
          "control" -> control-panel()
          "multishot" -> multishot-panel()
          "perceus" -> perceus-panel()
          _ -> effects-panel()
