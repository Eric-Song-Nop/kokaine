/*--------------------------------------------------------------------------
  Executable batching comparison. All state, rendering, and event handling
  stays inside Koka and Kokaine.
--------------------------------------------------------------------------*/
module examples/report/batching

import kokaine/reactive
import kokaine/html


pub struct batching-model(
  batching-writes : signal<int>
)


pub fun batching-create(root)
  Batching-model(signal(root,1))


fun select-writes(model : batching-model, writes : int)
  model.batching-writes.set(writes)

fun writes-button(model : batching-model, writes : int, label-text : string)
  button(label-text,attrs=[
    kind("button"),
    data("writes",writes.show),
    class {
      if model.batching-writes.get == writes
      then "segment is-active"
      else "segment"
    },
    aria("pressed") {
      if model.batching-writes.get == writes then "true" else "false"
    },
    on-click(fn(_) select-writes(model,writes))
  ])

fun metric-value(writes : int, metric : string, batched : bool) : int
  match metric
    "write" -> writes
    "compute" -> if batched then 2 else writes * 2
    _ -> if batched then 3 else writes * 3

fun batched-width(writes : int) : string
  match writes
    3 -> "33.33333333333333%"
    10 -> "10%"
    _ -> "100%"

fun bar-cell(model : batching-model, name : string, metric : string,
             batched : bool)
  div(attrs=[class("bar-track")])
    element-empty("i",attrs=[
      class(if batched then "bar bar--batch" else "bar bar--naive"),
      data("bar",name),
      attr("style") {
        "width: " ++
        (if batched && metric != "write"
         then batched-width(model.batching-writes.get)
         else "100%")
      }
    ])
    element("b",attrs=[data("value",name)])
      text {
        metric-value(model.batching-writes.get,metric,batched).show
      }

fun bar-row(model : batching-model, label-text : string, metric : string)
  div(attrs=[class("bar-row")])
    strong(label-text)
    bar-cell(model,"naive-" ++ metric,metric,False)
    bar-cell(model,"batch-" ++ metric,metric,True)

fun write-ticks(writes : int) : list<int>
  match writes
    10 -> [0,0,0,0,0,0,0,0,0,0]
    3 -> [0,0,0]
    _ -> [0]

fun immediate-events(writes : int)
  write-ticks(writes).foreach(fn(_)
    li("写/notify")
    li("settle")
    li("publish")
  )

fun batch-writes(writes : int)
  write-ticks(writes).foreach(fn(_) li("写/notify"))

fun batch-result(writes : int) : string
  if writes == 1
  then "在这条固定模拟路径中，写 1 次时两边相同。"
  else
    "在这条固定模拟路径中，" ++ writes.show ++
    " 次 write/version/notify 都发生；batch 只把 settling 延后到最外层边界。" ++
    "图中恢复与 DOM 数不是通用性能保证。"


pub fun render-batching(model : batching-model)
  section(attrs=[id("batching"),class("report-section"),data("section","05")])
    header(attrs=[class("section-heading")])
      p("05 / BATCHING",attrs=[class("section-number")])
      h2("连续写十次，只需让同一 capability 保持 Pending")
      p("source cell 仍然立即更新；batch 只延后 settle。一个 Live trace 第一次失效时转成 Pending 并产生工作票，之后的写入不会再凭空复制同一个 resumption。")

    div(attrs=[id("batch-lab"),class("batch-lab")])
      div(attrs=[class("batch-lab__controls"),role("group"),
                 aria("label","批处理实验控制")])
        span("一次事件里写入：")
        writes-button(model,1,"1 次")
        writes-button(model,3,"3 次")
        writes-button(model,10,"10 次")

      div(attrs=[class("bar-chart"),
                 aria("label","固定语义场景中逐次 settling 和 batch settling 比较")])
        div(attrs=[class("bar-chart__head")])
          span("模拟事件")
          span("每次立即 settle")
          span("batch 后 settle")
        bar-row(model,"数据写入","write")
        bar-row(model,"suffix 恢复","compute")
        bar-row(model,"effect publication","dom")

      div(attrs=[class("batch-timeline")])
        div
          span("每次立即 settle")
          ol(attrs=[id("naive-timeline")])
            dynamic
              immediate-events(model.batching-writes.get)
        div
          span("batch")
          ol(attrs=[id("batch-timeline")])
            dynamic
              batch-writes(model.batching-writes.get)
              li("settle")
              li("publish")

      p(attrs=[id("batch-result"),class("batch-result")])
        text { batch-result(model.batching-writes.get) }
