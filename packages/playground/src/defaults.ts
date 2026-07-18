export const DEFAULT_SOURCE = `module playground

import kokaine/reactive
import kokaine/html
import kokaine/dom

pub fun main()
  val (root,count) = create-root fn(root)
    signal(root,0)

  val page = view
    main-tag(attrs=[
      attr("style","min-height:100%;display:grid;place-items:center;padding:40px 20px;background:#f4f7f9;color:#17202a;font-family:system-ui,sans-serif")
    ])
      section(attrs=[
        attr("style","width:min(100%,520px);padding:34px;border:1px solid #dbe2ea;border-radius:20px;background:white;box-shadow:0 24px 70px rgba(31,45,61,.12)")
      ])
        p("KOKAINE / EFFECTFUL UI",attrs=[
          attr("style","margin:0 0 12px;color:#526476;font:700 12px/1.2 ui-monospace,monospace;letter-spacing:.12em")
        ])
        h1("A counter with no virtual DOM.",attrs=[
          attr("style","margin:0 0 12px;font-size:clamp(28px,7vw,46px);line-height:1.02;letter-spacing:-.04em")
        ])
        p("The button writes a signal. Kokaine resumes the captured suffix that owns the count.",attrs=[
          attr("style","margin:0 0 28px;color:#5d6b79;line-height:1.6")
        ])
        div(attrs=[
          attr("style","display:flex;align-items:center;gap:14px;flex-wrap:wrap")
        ])
          button("Increment",attrs=[
            kind("button"),
            attr("style","border:0;border-radius:999px;padding:12px 20px;background:#223b5d;color:white;font:700 14px system-ui;cursor:pointer"),
            on("click",fn(_) count.modify(fn(value) value + 1))
          ])
          strong(attrs=[
            attr("style","min-width:3ch;color:#223b5d;font:700 28px/1 ui-monospace,monospace"),
            aria("live","polite")
          ])
            text { count.get.show }

  val dispose = mount(root,query("#app"),page)
  ()
`;

export const STORAGE_KEY = 'kokaine-playground/source/v1';

export const SPLIT_KEY = 'kokaine-playground/split/v1';

export const THEME_KEY = 'kokaine-playground/theme/v1';
