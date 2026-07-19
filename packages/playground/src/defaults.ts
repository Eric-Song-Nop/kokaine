export const DEFAULT_SOURCE = `module main

import kokaine/reactive
import kokaine/html
import kokaine/dom

pub fun main()
  // create-root 创建整个应用的响应式运行域；signal 显式归属于该 root。
  val (root,count) = create-root fn(root)
    signal(root,0)

  // view 是 Kokaine 的 effect-handled HTML builder。
  // 下面的缩进块是普通的 Koka trailing-lambda 语法，
  val page = view
    main-tag(attrs=[
      attr(
        "style",
        "min-height:100%;display:grid;place-items:center;" ++
        "padding:40px 20px;font-family:system-ui,sans-serif"
      )
    ])
      section(attrs=[
        attr(
          "style",
          "width:min(100%,520px);padding:34px;" ++
          "border:1px solid #dbe2ea;border-radius:20px;" ++
          "box-shadow:0 24px 70px rgba(31,45,61,.12)"
        )
      ])
        p("KOKAINE / EFFECTFUL UI",attrs=[attr("style","margin:0 0 12px;color:#526476;" ++"font:700 12px/1.2 ui-monospace,monospace;" ++"letter-spacing:.12em")])
        div(attrs=[attr("style","display:flex;align-items:center;gap:14px;flex-wrap:wrap")])
          button("Increment",attrs=[kind("button"),attr("style","border:0;border-radius:999px;padding:12px 20px;" ++"background:#223b5d;color:white;" ++"font:700 14px system-ui;cursor:pointer"),
            // on-click 是只要求 signal-write 的便捷事件 API。
            //
            // modify 接收一个“旧值 -> 新值”函数，因此不需要
            // 单独执行 count.get，也不会引入 signal-read effect。
            on-click(fn(_)
              count.modify(fn(value) value + 1)
            )
          ])

          strong(attrs=[attr("style","min-width:3ch;color:#223b5d;" ++"font:700 28px/1 ui-monospace,monospace"),aria("live","polite")])
            // 带花括号的 text 是 live binding。
            //
            // count.get 会产生 signal-read effect。Kokaine 在这里捕获
            // get 之后的同步续体后缀。count 改变时，它恢复这段后缀，
            // 更新对应的 Text 节点，而不是重新执行整个 main 或 page。
            //
            // show 把 int 转换成可显示的 string。
            text { count.get.show }

          button("Decrement",attrs=[
            kind("button"),
            attr(
              "style",
              "border:0;border-radius:999px;padding:12px 20px;" ++
              "background:#223b5d;color:white;" ++
              "font:700 14px system-ui;cursor:pointer"
            ),

            // 这里演示另一种更新方式：
            //
            // count.get      产生 signal-read
            // count.set(...) 产生 signal-write
            //
            // 因为同时需要读写能力，所以使用完整的 on，而不是
            // 仅接受 signal-write 回调的 on-click。
            on("click",fn(_)
              count.set(count.get - 1)
            )
          ])

        h1(
          "A counter with no virtual DOM but algebraic effects.",
          attrs=[
            attr(
              "style",
              "margin:0 0 12px;font-size:clamp(28px,7vw,46px);" ++
              "line-height:1.02;letter-spacing:-.04em"
            )
          ]
        )

        p(
          "The buttons write a signal. Kokaine resumes the captured " ++
          "suffix that updates the count text.",
          attrs=[
            attr(
              "style",
              "margin:0 0 28px;color:#5d6b79;line-height:1.6"
            )
          ]
        )


  // mount 把 backend-neutral view 挂载到真实 DOM。
  //
  // root 负责响应式调度和生命周期；
  // query("#app") 才是真正的 DOM 挂载位置。
  //
  // dispose 是卸载函数。调用它会移除 DOM、事件监听器，
  // 并清理这个 mount 拥有的响应式工作。
  val dispose = mount(root,query("#app"),page)
  ()
`;

export const STORAGE_KEY = 'kokaine-playground/source/v2';

export const SPLIT_KEY = 'kokaine-playground/split/v1';

export const THEME_KEY = 'kokaine-playground/theme/v1';
