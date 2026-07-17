/*--------------------------------------------------------------------------
  Interactive framework-route comparison, expressed entirely as Kokaine
  signals, live bindings, dynamic regions, and typed listeners.
--------------------------------------------------------------------------*/
module examples/report/comparison

import kokaine/reactive
import kokaine/html


pub struct comparison-model(
  comparison-scenario : signal<string>
)

struct route-detail(
  route-items : list<string>,
  route-note  : string,
  route-work  : int,
  route-scope : string
)


pub fun comparison-create(root)
  Comparison-model(signal(root,"leaf"))


fun scenario-button(model : comparison-model, scenario : string,
                    label-text : string)
  button(label-text,attrs=[
    kind("button"),
    data("scenario",scenario),
    class {
      if model.comparison-scenario.get == scenario
      then "segment is-active"
      else "segment"
    },
    aria("pressed") {
      if model.comparison-scenario.get == scenario then "true" else "false"
    },
    on-click(fn(_) model.comparison-scenario.set(scenario))
  ])

fun scenario-detail(scenario : string, framework : string) : route-detail
  match scenario
    "branch" ->
      match framework
        "react" -> Route-detail(
          ["state 更新","重新得到分支描述","协调子树","提交增删"],
          "组件返回新元素结构，React 协调前后结构并提交节点增删。",
          78,"条件子树")
        "vue" -> Route-detail(
          ["条件写入","组件更新","执行分支补丁","挂载 / 卸载"],
          "编译器为模板生成分支提示，运行时执行对应补丁路径。",
          58,"条件区块")
        "solid" -> Route-detail(
          ["signal 写入","条件计算","清理旧 owner","挂载新分支"],
          "控制流范围在切换时清理旧分支并建立新分支。",
          37,"条件区域")
        _ -> Route-detail(
          ["outer K Pending","旧 child Dead","新 child Draft",
           "publish Live branch"],
          "dynamic 生成的 Region binding，其 continuation frame 拥有该 generation 的 DOM range、listener 与 child effects。",
          39,"continuation frame")
    "batch" ->
      match framework
        "react" -> Route-detail(
          ["3 次 state 更新","自动批处理","组件渲染","一次提交"],
          "现代 React 会在常见边界批处理；实际次数依更新方式而定。",
          54,"批后的子树")
        "vue" -> Route-detail(
          ["3 次属性写入","任务去重","组件更新","一次补丁"],
          "触发被调度到队列，同一组件任务通常会合并。",
          45,"去重任务")
        "solid" -> Route-detail(
          ["batch 中 3 次写","延后下游","一次传播","目标 DOM"],
          "batch 延后下游计算，离开边界后按最终值传播。",
          20,"最终联系")
        _ -> Route-detail(
          ["3 次 write/version/notify","capability 保持 Pending",
           "边界后 settle","publish"],
          "batch 只延迟 settling；source 写入和 notify 仍逐次发生。",
          20,"Pending frontier")
    _ ->
      match framework
        "react" -> Route-detail(
          ["state 更新","调用组件","比较结果","提交文字 DOM"],
          "默认从发生更新的组件开始重新计算其返回结果，再提交必要的 DOM 改动。",
          64,"组件子树")
        "vue" -> Route-detail(
          ["属性写入","触发订阅","组件更新","补丁文字 DOM"],
          "Proxy / ref 在运行时跟踪读写；组件通常以响应式 effect 更新。",
          48,"相关组件")
        "solid" -> Route-detail(
          ["signal 写入","通知计算","重算绑定","改文字节点"],
          "运行时记录 signal 与计算之间的联系，静态 DOM 通常只建立一次。",
          22,"绑定节点")
        _ -> Route-detail(
          ["write operation","Resume-work(trace)","恢复 exact suffix",
           "发布文字 effect"],
          "source 索引实际 K；恢复 tracked read 后缀，而不是从 retained action 开头重算。",
          22,"capture suffix")

fun render-route-items(items : list<string>)
  match items
    Nil -> ()
    Cons(item,Nil) -> span(item)
    Cons(item,rest) ->
      span(item)
      element("i","→")
      render-route-items(rest)

fun framework-card(model : comparison-model, framework : string,
                   logo : string, name-text : string, subtitle : string,
                   logo-class : string, kokaine-card : bool)
  element("article",attrs=[
    class(if kokaine-card
          then "framework-card framework-card--kokaine"
          else "framework-card"),
    data("framework",framework)
  ])
    header
      span(logo,attrs=[class("framework-logo " ++ logo-class)])
      div
        element("h3",name-text)
        element("small",subtitle)
    div(attrs=[class("route"),data("route","")])
      dynamic
        val detail = scenario-detail(model.comparison-scenario.get,framework)
        render-route-items(detail.route-items)
    p(attrs=[data("route-note","")])
      text {
        val detail = scenario-detail(model.comparison-scenario.get,framework)
        detail.route-note
      }
    div(attrs=[class("work-meter")])
      span("本场景抽象工作范围")
      element("i")
        element-empty("b",attrs=[
          data("work") {
            val detail = scenario-detail(model.comparison-scenario.get,framework)
            detail.route-work.show
          },
          attr("style") {
            val detail = scenario-detail(model.comparison-scenario.get,framework)
            "width: " ++ detail.route-work.show ++ "%"
          }
        ])
      element("em",attrs=[])
        text {
          val detail = scenario-detail(model.comparison-scenario.get,framework)
          detail.route-scope
        }

fun comparison-table()
  div(attrs=[class("comparison-table-wrap"),attr("tabindex","0"),
             aria("label","框架底层机制对比表，可横向滚动")])
    element("table",attrs=[class("comparison-table")])
      element("thead")
        element("tr")
          element("th","观察角度")
          element("th","React")
          element("th","Vue")
          element("th","SolidJS")
          element("th","Kokaine")
      element("tbody")
        element("tr")
          element("th","主要更新单位")
          element("td","组件返回结果")
          element("td","组件渲染 effect")
          element("td","细粒度计算 / DOM 绑定")
          element("td","细粒度计算 / DOM 绑定")
        element("tr")
          element("th","联系如何建立")
          element("td","state 所在组件与 props 流向")
          element("td","运行时拦截属性读取")
          element("td","运行时 signal 读取")
          element("td","每个 signal-read occurrence 捕获 K，并索引到 source")
        element("tr")
          element("th","页面结构")
          element("td","重新得到元素描述并比较")
          element("td","编译提示 + 虚拟 DOM 补丁")
          element("td","静态结构建立一次")
          element("td")
            element("code","html.emit")
            text(" 同步建立 view，DOM adapter 为 live binding 建 effect")
        element("tr")
          element("th","“只读不能写”")
          element("td","靠规则与工具检查")
          element("td","靠 API 约定")
          element("td","靠 API 约定")
          element("td","可出现在 Koka 函数的效应类型里")
        element("tr")
          element("th","局部改变读取含义")
          element("td","通常换 Hook / API")
          element("td","通常换 API")
          element("td")
            element("code","untrack")
            text(" 等工具")
          element("td","用局部 handler 转发读取操作")


pub fun render-comparison(model : comparison-model)
  section(attrs=[id("comparison"),class("report-section"),data("section","08")])
    header(attrs=[class("section-heading")])
      p("08 / FRAMEWORK COMPARISON",attrs=[class("section-number")])
      h2("React、Vue、SolidJS 与 Kokaine：同一变化，路线不同")
      p("这是对主流默认心智模型的简化比较，不是性能排名。各框架都有编译器、缓存或手动优化手段，实际结果取决于应用写法。")

    div(attrs=[class("comparison-switcher"),role("group"),
               aria("label","选择对比场景")])
      scenario-button(model,"leaf","叶子文字变化")
      scenario-button(model,"branch","条件分支替换")
      scenario-button(model,"batch","连续三次写入")

    div(attrs=[id("framework-routes"),class("framework-routes")])
      framework-card(model,"react","R","React","组件渲染 + 提交",
                     "framework-logo--react",False)
      framework-card(model,"vue","V","Vue","代理跟踪 + 组件更新",
                     "framework-logo--vue",False)
      framework-card(model,"solid","S","SolidJS","细粒度订阅",
                     "framework-logo--solid",False)
      framework-card(model,"kokaine","K","Kokaine",
                     "source-local capture + 精确续体",
                     "framework-logo--kokaine",True)

    comparison-table()

    element("aside",attrs=[class("comparison-takeaway")])
      span("关键结论")
      p
        text("Kokaine 与 SolidJS 都追求细粒度目标更新，但内部模型不同：")
        strong("Kokaine 的 source-local index 保存实际 continuation capability，而不是另建 Observer 节点再映射回 retained action")
        text("。它仍然存在图状关系与调度状态，所以准确说法是“没有第二套 Observer dependency graph”，不是“完全没有 graph”。")
