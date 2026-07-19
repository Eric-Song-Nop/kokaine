/*--------------------------------------------------------------------------
  Continuation scheduler semantic walkthrough.

  This is deliberately a model of the documented six-step scenario, not an
  inspection hook into Kokaine's private queues. Every visible transition is
  nevertheless rendered and driven through ordinary Kokaine signals, live
  bindings, dynamic regions, and typed DOM listeners.
--------------------------------------------------------------------------*/
module examples/report/scheduler

import kokaine/reactive
import kokaine/html
import kokaine/dom
import kokaine/async/web
import kokaine/web/window
import std/time/duration


pub struct scheduler-model(
  scheduler-count  : signal<int>,
  scheduler-origin : signal<int>,
  scheduler-delta  : signal<int>,
  scheduler-step   : signal<int>,
  scheduler-auto   : signal<bool>,
  scheduler-generation : signal<int>
)


pub fun scheduler-create(root)
  Scheduler-model(
    signal(root,2),
    signal(root,2),
    signal(root,0),
    signal(root,-1),
    signal(root,False),
    signal(root,0)
  )


fun parity(value : int) : string
  if value % 2 == 0 then "偶" else "奇"

fun active-step(model : scheduler-model) : signal-read int
  model.scheduler-step.get

fun old-count(model : scheduler-model) : signal-read int
  if active-step(model) < 0
  then model.scheduler-count.get
  else model.scheduler-origin.get

fun next-count(model : scheduler-model) : signal-read int
  if active-step(model) < 0
  then model.scheduler-count.get
  else model.scheduler-origin.get + model.scheduler-delta.get

fun parity-unchanged(model : scheduler-model) : signal-read bool
  parity(old-count(model)) == parity(next-count(model))

fun displayed-count(model : scheduler-model) : signal-read int
  if active-step(model) < 0 then old-count(model) else next-count(model)

fun displayed-parity(model : scheduler-model) : signal-read string
  if active-step(model) <= 1
  then parity(old-count(model))
  else parity(next-count(model))

fun displayed-double(model : scheduler-model) : signal-read int
  if active-step(model) <= 2
  then old-count(model) * 2
  else next-count(model) * 2

fun parity-state(model : scheduler-model) : signal-read string
  match active-step(model)
    0 -> "pending"
    1 -> "running"
    _ -> "live"

fun double-state(model : scheduler-model) : signal-read string
  val step = active-step(model)
  if step >= 0 && step <= 2 then "pending" else "live"

fun summary-state(model : scheduler-model) : signal-read string
  match active-step(model)
    2 -> if parity-unchanged(model) then "live" else "pending"
    3 -> "pending"
    4 -> "running"
    _ -> "live"

fun state-label(state : string) : string
  match state
    "source" -> "cell / version"
    "draft" -> "Draft"
    "pending" -> "Pending"
    "running" -> "Running"
    "dead" -> "Dead"
    _ -> "Live"

fun progress(model : scheduler-model) : signal-read string
  val step = active-step(model)
  if step < 0 then "0 / 0" else (step + 1).show ++ " / 6"

fun run-count(model : scheduler-model) : signal-read int
  match active-step(model)
    1 -> 1
    2 -> 1
    3 -> 2
    4 -> 3
    5 -> 3
    _ -> 0

fun pruned-count(model : scheduler-model) : signal-read int
  if active-step(model) >= 2 && parity-unchanged(model) then 1 else 0

fun step-message(model : scheduler-model) : signal-read string
  val step = active-step(model)
  val before = old-count(model)
  val after = next-count(model)
  val next-parity = parity(after)
  val same = parity-unchanged(model)
  match step
    0 ->
      "count " ++ before.show ++ " → " ++ after.show ++
      "：两个 pure captures 从 Live 变 Pending；队列保存 trace，不保存 producer action。"
    1 ->
      "frontier 选中没有 Pending/Running ancestor 的 parity K：capability 进入 Running，新后缀与结构孩子先进入 Draft frame。"
    2 ->
      if same
      then "parity 仍为“" ++ next-parity ++ "”：Draft trace 可转 Live，但 output source equality 截断发布，不产生 effect ticket。"
      else "parity 发布“" ++ next-parity ++ "”：summary@parity capture 进入 Pending。它的 K 包含后续 double.get，因此是 UI trace 的外层 capture。"
    3 ->
      if same
      then "double 发布 " ++ (after * 2).show ++ "，只让更窄的 summary@double suffix 进入 Pending；恢复它无需重读 parity。"
      else "double 发布 " ++ (after * 2).show ++ "，旧 summary@double child 也有一张 ticket，但它位于 Pending 外层 capture 下，frontier 暂时 deferred。"
    4 ->
      if same
      then "frontier 直接恢复 summary@double K：只执行 double.get 后的 UI suffix；更早的 parity read 不重放。"
      else "frontier 先恢复外层 summary@parity K，重新执行后续 double.get 并建立新 child；旧 child 变 Dead，旧 ticket 随即 stale。"
    5 ->
      if same
      then "新 UI suffix 发布成功并转 Live；effect plane 回到 frontier。"
      else "取工作时丢弃 Dead capture 对应的 stale ticket；没有 Observer 去重 latch，只有嵌套 K、ancestor frontier 与 capability state。"
    _ -> "选择 +1 或 +2，创建一次变化。"


fun start-scenario(root : root<<ui>>, model : scheduler-model, delta : int)
                  : callback-effect ()
  val current = model.scheduler-count.get
  batch(root)
    model.scheduler-auto.set(False)
    model.scheduler-generation.modify(fn(value) value + 1)
    model.scheduler-origin.set(current)
    model.scheduler-delta.set(delta)
    model.scheduler-step.set(0)

fun next-step(root : root<<ui>>, model : scheduler-model) : callback-effect ()
  val current = model.scheduler-step.get
  if current < 0 || current >= 5 then ()
  else
    val following = current + 1
    val committed = model.scheduler-origin.get + model.scheduler-delta.get
    batch(root)
      if following == 5
      then
        model.scheduler-count.set(committed)
        model.scheduler-auto.set(False)
        model.scheduler-generation.modify(fn(value) value + 1)
      else ()
      model.scheduler-step.set(following)

fun scheduler-auto-delay() : <ui,exn> duration
  if prefers-reduced-motion() then 90.milli-seconds else 900.milli-seconds

// The DOM callback already runs inside the generation async delimiter. Sleep
// suspends this Koka continuation and its disposer belongs to that generation;
// the host timer never invokes report policy directly.
fun run-auto-step(auto-root : root<<ui>>, model : scheduler-model,
                  generation : int) : callback-effect ()
  if !model.scheduler-auto.get ||
     model.scheduler-generation.get != generation
  then ()
  else
    val current = model.scheduler-step.get
    if current < 0
    then model.scheduler-step.set(0)
    else next-step(auto-root,model)

    if model.scheduler-step.get >= 5
    then model.scheduler-auto.set(False)
    else
      sleep(scheduler-auto-delay())
      run-auto-step(auto-root,model,generation)

fun toggle-auto(auto-root : root<<ui>>, model : scheduler-model)
                : callback-effect ()
  if model.scheduler-auto.get
  then batch(auto-root)
    model.scheduler-auto.set(False)
    model.scheduler-generation.modify(fn(value) value + 1)
  else
    val current = model.scheduler-step.get
    val base = model.scheduler-count.get
    val generation = model.scheduler-generation.get + 1
    batch(auto-root)
      if current < 0 || current >= 5
      then
        model.scheduler-origin.set(base)
        model.scheduler-delta.set(2)
        model.scheduler-step.set(-1)
      else ()
      model.scheduler-generation.set(generation)
      model.scheduler-auto.set(True)
    run-auto-step(auto-root,model,generation)

fun reset-scheduler(scheduler-root : root<<ui>>, model : scheduler-model)
                    : callback-effect ()
  batch(scheduler-root)
    model.scheduler-auto.set(False)
    model.scheduler-generation.modify(fn(value) value + 1)
    model.scheduler-count.set(2)
    model.scheduler-origin.set(2)
    model.scheduler-delta.set(0)
    model.scheduler-step.set(-1)


fun queue-empty()
  li("空",attrs=[class("empty")])

fun render-derived-queue(model : scheduler-model)
  dynamic
    match active-step(model)
      0 ->
        li("Resume(parity K)")
        li("Resume(double K)")
      1 -> li("Resume(double K)")
      2 -> li("Resume(double K)")
      _ -> queue-empty()

fun render-effect-queue(model : scheduler-model)
  dynamic
    val step = active-step(model)
    val same = parity-unchanged(model)
    match step
      2 -> if same then queue-empty() else li("Resume(summary@parity)")
      3 ->
        if same
        then li("Resume(summary@double)")
        else
          li("Resume(summary@double · deferred)")
          li("Resume(summary@parity)")
      4 -> if same then queue-empty() else li("stale: summary@double-old")
      _ -> queue-empty()

fun legend-item(chip-class : string, content : string)
  span
    element-empty("i",attrs=[class("state-chip " ++ chip-class)])
    text(content)

fun diamond-node(node-id : string, label-text : string, value-label : string,
                 read-value : () -> signal-read string,
                 read-state : () -> signal-read string)
  div(attrs=[
    id(node-id),
    class { "diamond-node is-" ++ read-state() }
  ])
    element("small",label-text)
    strong
      text(value-label)
      span
        text { read-value() }
    element("em")
      text { state-label(read-state()) }


pub fun render-scheduler(root : root<<ui>>, model : scheduler-model)
  section(attrs=[id("scheduler"),class("report-section lab-section"),
                 data("section","04")])
    header(attrs=[class("section-heading section-heading--split")])
      div
        p("04 / CORRECT & MINIMAL",attrs=[class("section-number")])
        h2("frontier 如何选择一条可运行的 continuation？")
      p
        text("下面是 ")
        element("code","Resume-work(trace)")
        text(" 与两条执行 plane 的语义模拟，不是实际队列采样。逐步执行，看 Pending capability 如何进入 Running、创建 Draft 并发布新 Live generation。")

    div(attrs=[id("scheduler-lab"),class("scheduler-lab")])
      div(attrs=[class("scheduler-controls")])
        button("count +1",attrs=[
          id("scheduler-plus-one"),class("button button--primary"),kind("button"),
          on("click",fn(_) start-scenario(root,model,1))
        ])
        button("count +2",attrs=[
          id("scheduler-plus-two"),class("button button--accent"),kind("button"),
          on("click",fn(_) start-scenario(root,model,2))
        ])
        button("下一步",attrs=[
          id("scheduler-step"),class("button button--quiet"),kind("button"),
          on("click",fn(_) next-step(root,model))
        ])
        button(attrs=[
          id("scheduler-auto"),kind("button"),
          class {
            if model.scheduler-auto.get
            then "button button--quiet is-active"
            else "button button--quiet"
          },
          aria("pressed") {
            if model.scheduler-auto.get then "true" else "false"
          },
          on("click",fn(_) toggle-auto(root,model))
        ])
          text {
            if model.scheduler-auto.get then "暂停" else "自动播放"
          }
        button("复位",attrs=[
          id("scheduler-reset"),class("button button--quiet"),kind("button"),
          on("click",fn(_) reset-scheduler(root,model))
        ])

      div(attrs=[class("state-legend"),aria("label","调度状态图例")])
        legend-item("state-chip--live","Live：可被 source 唤醒")
        legend-item("state-chip--pending","Pending：已有 Resume-work")
        legend-item("state-chip--running","Running：当前 K 正在恢复")
        legend-item("state-chip--draft","Draft：尚未公开的新 generation")
        legend-item("state-chip--dead","Dead：已退役，ticket 可 stale")

      div(attrs=[class("scheduler-stage")])
        div(attrs=[id("scheduler-diamond"),class("scheduler-diamond"),
                   aria("label","菱形 source-local continuation trace")])
          diamond-node(
            "diamond-count","source","count = ",
            fn() displayed-count(model).show,
            fn() "source"
          )
          diamond-node(
            "diamond-parity","pure suffix A","奇偶 = ",
            fn() displayed-parity(model),
            fn() parity-state(model)
          )
          diamond-node(
            "diamond-double","pure suffix B","两倍 = ",
            fn() displayed-double(model).show,
            fn() double-state(model)
          )
          div(attrs=[id("diamond-summary"),
                     class { "diamond-node is-" ++ summary-state(model) }])
            element("small","effect suffix")
            strong("汇总 UI")
            element("em")
              text { state-label(summary-state(model)) }
          span("",attrs=[class("diamond-edge diamond-edge--ca")])
          span("",attrs=[class("diamond-edge diamond-edge--cb")])
          span("",attrs=[class("diamond-edge diamond-edge--as")])
          span("",attrs=[class("diamond-edge diamond-edge--bs")])

        element("aside",attrs=[class("step-panel")])
          div(attrs=[class("step-panel__top")])
            span("SETTLE QUEUE")
            strong(attrs=[id("scheduler-progress")])
              text { progress(model) }
          p(attrs=[id("scheduler-message"),class("step-panel__message")])
            text { step-message(model) }
          div(attrs=[class("queue-lanes")])
            div
              element("small","pure plane")
              ol(attrs=[id("derive-queue")])
                render-derived-queue(model)
            div
              element("small","effect plane")
              ol(attrs=[id("effect-queue")])
                render-effect-queue(model)
          div(attrs=[class("scheduler-score")])
            span
              text("本轮恢复 suffix ")
              strong(attrs=[id("scheduler-runs")])
                text { run-count(model).show }
              text(" 次")
            span
              text("相等提交截断 ")
              strong(attrs=[id("scheduler-pruned")])
                text { pruned-count(model).show }
              text(" 条")

    div(attrs=[class("pending-explainer")])
      div(attrs=[class("pending-explainer__visual"),aria("hidden","true")])
        span("frontier 跳过 deferred",attrs=[class("badge-stale")])
        element("b","→")
        span("Resume-work(trace)",attrs=[class("badge-pending")])
        element("b","→")
        span("draft publish / retire",attrs=[class("badge-clean")])
      div
        element("h3","队列不是 Observer 列表，targeted settle 也不是全局 flush")
        p
          text("frontier 选择 Pending 且没有 Pending/Running ancestor 的工作；已退休的 stale ticket 可以暂留队列，取工作时再丢弃。同步 ")
          element("code","memo.get")
          text(" 只沿目标 producer 的 parent gate、input producer 与 child trace 定向 settle，不会顺带清空无关 pure work，更不会执行 effect plane。只有 derive 发布不相等的新值时，输出 source 才增加版本并触发下游 capture。")
