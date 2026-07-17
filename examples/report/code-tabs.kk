/*--------------------------------------------------------------------------
  Accessible Koka source tabs. Code samples are ordinary Text nodes, so source
  containing angle brackets can never be interpreted as markup.
--------------------------------------------------------------------------*/
module examples/report/code-tabs

import kokaine/reactive
import kokaine/html
import kokaine/dom


pub struct code-tabs-model(
  code-tabs-active : signal<int>
)


pub fun code-tabs-create(root)
  Code-tabs-model(signal(root,0))


fun code-tab-id(index : int) : string
  match index
    0 -> "code-tab-signal"
    1 -> "code-tab-effect"
    2 -> "code-tab-batch"
    _ -> "code-tab-view"

fun code-tab-key-target(current : int, key : string) : maybe<int>
  match key
    "ArrowRight" -> Just((current + 1) % 4)
    "ArrowLeft" -> Just((current + 3) % 4)
    "Home" -> Just(0)
    "End" -> Just(3)
    _ -> Nothing

fun activate-code-tab(model : code-tabs-model, index : int)
  model.code-tabs-active.set(index)

fun handle-code-tab-key(model : code-tabs-model, value : event)
  match code-tab-key-target(model.code-tabs-active.get,value.key)
    Nothing -> ()
    Just(index) ->
      prevent-default(value)
      activate-code-tab(model,index)

fun code-tab(model : code-tabs-model, index : int, tab-id : string,
             panel-id : string, label-text : string)
  button(label-text,attrs=[
    id(tab-id),kind("button"),role("tab"),
    aria("controls",panel-id),
    aria("selected") {
      if model.code-tabs-active.get == index then "true" else "false"
    },
    attr("tabindex") {
      if model.code-tabs-active.get == index then "0" else "-1"
    },
    on("click",fn(_) activate-code-tab(model,index)),
    on("keydown",fn(ev) handle-code-tab-key(model,ev))
  ])

fun signal-code() : string
  "val output = derive(root,0,fn()\n" ++
  "  prefix()                  // 不在 Kx 中\n" ++
  "  val x = source-x.get      // 捕获 Kx\n" ++
  "  middle(x)                 // 在 Kx 中\n" ++
  "  val y = source-y.get      // 捕获嵌套的 Ky\n" ++
  "  suffix(x,y)               // 同时在 Kx 与 Ky 中\n" ++
  ")\n\n" ++
  "// Trace-read(x, child = Trace-read(y, child = Trace-end))\n" ++
  "// x 写入恢复 Kx；prefix() 不会重放。\n" ++
  "// y 写入恢复更窄的 Ky。"

fun effect-code() : string
  "// 应用看到的是能力接口\n" ++
  "pub effect signal-read\n" ++
  "  fun validate-derived(producer : derive-producer) : ()\n" ++
  "  ctl read-source(source : source<a>,\n" ++
  "                  mode : read-mode,\n" ++
  "                  producer : maybe<derive-producer>) : a\n\n" ++
  "// 实现轮廓；真实节点还记录 gate、frame 与 finalizer\n" ++
  "raw ctl read-source(source,Track-read,producer)\n" ++
  "  val current = Trace-read(\n" ++
  "    resume = fn(_) rcontext.resume(load(source.source-cell)),\n" ++
  "    child = cell(Trace-end), ...)\n" ++
  "  source.source-captures.prepend(\n" ++
  "    pack-capture(plane,target,current))\n" ++
  "  val nested = rcontext.resume(load(source.source-cell))\n" ++
  "  current.child := nested.built-root\n" ++
  "  Built-trace(current,nested.built-publish)"

fun memo-code() : string
  "val changes = memo(root,0,fn(previous)\n" ++
  "  val value = count.get\n" ++
  "  previous + 1\n" ++
  ")\n\n" ++
  "// 内部入口，不把 memo 订阅回自己的 source：\n" ++
  "val track = fn() calculate(\n" ++
  "  read-source(output,State-entry-read,Nothing))\n\n" ++
  "// State-entry-read 捕获 Trace-entry。\n" ++
  "// 每次恢复都注入最近一次成功提交的 previous；\n" ++
  "// 失败的 Draft 不会污染下一次 previous。"

fun view-code() : string
  "// 阶段 1：trailing lambda 直接形成 tag block；attrs 默认 []\n" ++
  "val page = view\n" ++
  "  main-tag(attrs=[class(\"instrument\")])\n" ++
  "    h1(\"Signal console\")          // string leaf\n" ++
  "    p(attrs=[class { if expanded.get then \"result is-open\" else \"result\" }])\n" ++
  "      text(\"平方：\")\n" ++
  "      text { square.get.show }     // live text overload\n" ++
  "    input(attrs=[                 // void helper\n" ++
  "      kind(\"checkbox\"),\n" ++
  "      checked { expanded.get }    // live property overload\n" ++
  "    ])\n" ++
  "    dynamic\n" ++
  "      if expanded.get\n" ++
  "      then p(\"Expanded\")\n" ++
  "      else p(\"Collapsed\")\n\n" ++
  "// 阶段 2：DOM adapter 解释 view\n" ++
  "// Text      → 一次创建 Text node\n" ++
  "// Live-text → create-effect(track = read, apply = set Text.data)\n" ++
  "// dynamic → Region → create-effect + 结构化 child frame\n" ++
  "// Listener  → ABI callback + captured reentry + event continuation\n\n" ++
  "val dispose = mount(root,body(),page)"

fun panel-notes(notes : list<string>)
  match notes
    Nil -> ()
    Cons(note,rest) ->
      span(note)
      panel-notes(rest)

fun code-panel(model : code-tabs-model, index : int, panel-id : string,
               tab-id : string, source : string, note-title : string,
               notes : list<string>)
  section(attrs=[
    id(panel-id),class("code-panel"),role("tabpanel"),
    aria("labelledby",tab-id),
    attr("hidden") {
      if model.code-tabs-active.get == index then Nothing else Just("")
    }
  ])
    element("pre")
      element("code",source)
    element("aside")
      strong(note-title)
      panel-notes(notes)


pub fun render-code-tabs(model : code-tabs-model)
  section(attrs=[id("code"),class("report-section"),data("section","09")])
    header(attrs=[class("section-heading")])
      p("09 / FROM IDEA TO KOKA",attrs=[class("section-number")])
      h2("把续体轨迹中的动作翻译成 Koka 代码")
      p("这里不追求展示全部实现，只对应前面已经看见的几个关键动作。")

    div(attrs=[id("code-tabs"),class("code-tabs")])
      div(attrs=[class("code-tabs__list"),role("tablist"),
                 aria("label","选择 Koka 代码示例")])
        code-tab(model,0,"code-tab-signal","code-panel-signal","精确后缀")
        code-tab(model,1,"code-tab-effect","code-panel-effect","capture handler")
        code-tab(model,2,"code-tab-batch","code-panel-batch","memo(previous)")
        code-tab(model,3,"code-tab-view","code-panel-view","HTML 到 DOM")

      code-panel(
        model,0,"code-panel-signal","code-tab-signal",signal-code(),
        "捕获按 occurrence 发生",
        ["同一 source 连续 get 两次也产生两个嵌套 Trace-read",
         "动态分支只留下实际执行到的 read",
         "初次 calculation closure 仅存于 one-shot bootstrap slot"]
      )
      code-panel(
        model,1,"code-panel-effect","code-tab-effect",effect-code(),
        "handler 与 K 分工",
        ["handler 选择 Track / Sample / State-entry 解释",
         "raw ctl 提供实际同步后缀",
         "source 保存 rank-2 packed capture，不保存 callback 或 action"]
      )
      code-panel(
        model,2,"code-panel-batch","code-tab-batch",memo-code(),
        "Trace-entry 解决什么",
        ["保存的是 entry continuation，不是 calculate 闭包",
         "entry target 在 input 与 child settle 前后都会复查",
         "状态只在成功 publish 后前进"]
      )
      code-panel(
        model,3,"code-panel-view","code-tab-view",view-code(),
        "方案一只使用 Koka 语法",
        ["trailing lambda 与 block brace elision 提供缩进式结构，不需要 JSX 或宏",
         "attrs 默认 []；tag(\"text\") 是 string leaf",
         "text(\"...\") / text { ... }、checked(False) / checked { ... } 由 static overloading 共用名字",
         "input、hr、br 是 void helper",
         "dynamic 创建可替换的内部 Region；DOM adapter 为 live binding 建立 continuation-backed effect"]
      )
