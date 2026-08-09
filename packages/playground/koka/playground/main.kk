/*--------------------------------------------------------------------------
  Kokaine-owned browser playground workbench.

  Monaco, compiler/LSP workers, and sandboxed iframe plumbing remain browser
  host capabilities. All visible workbench DOM and reactive presentation state
  are owned by this Koka module.
--------------------------------------------------------------------------*/
module playground/main

import kokaine/reactive
import kokaine/html
import kokaine/dom
import playground/host

struct playground-model(
  source              : signal<string>,
  last-built-source   : signal<string>,
  dark                : signal<bool>,
  lsp-status          : signal<string>,
  build-status        : signal<string>,
  compiler-version    : signal<string>,
  build-label         : signal<string>,
  problems            : signal<int>,
  line                 : signal<int>,
  column               : signal<int>,
  right-view           : signal<string>,
  output-channel       : signal<string>,
  devtools-visible     : signal<bool>,
  mobile-view          : signal<string>,
  generated-output     : signal<string>,
  build-output         : signal<string>,
  runtime-output       : signal<string>,
  runtime-count        : signal<int>,
  generated-file       : signal<string>,
  used-last-good       : signal<bool>,
  preview-ready        : signal<bool>,
  session-error        : signal<string>,
  toast                : signal<string>
)

fun create-model(root, source : string, dark : bool)
  Playground-model(
    signal(root,source),
    signal(root,""),
    signal(root,dark),
    signal(root,"connecting"),
    signal(root,"idle"),
    signal(root,""),
    signal(root,""),
    signal(root,0),
    signal(root,1),
    signal(root,1),
    signal(root,"preview"),
    signal(root,"generated"),
    signal(root,False),
    signal(root,"editor"),
    signal(root,""),
    signal(root,""),
    signal(root,""),
    signal(root,0),
    signal(root,""),
    signal(root,False),
    signal(root,False),
    signal(root,""),
    signal(root,"")
  )

fun lsp-label(status : string) : string
  if status == "ready" then "LSP ready"
  else if status == "error" then "LSP error"
  else if status == "offline" then "LSP offline"
  else "LSP starting"

fun stale(model : playground-model) : signal-read bool
  model.last-built-source.get != "" &&
  model.source.get != model.last-built-source.get

fun output-text(model : playground-model) : signal-read string
  val channel = model.output-channel.get
  if channel == "generated" then
    val current = model.generated-output.get
    if current == ""
    then "A successful build will show the generated JavaScript here."
    else current
  else if channel == "build" then
    val current = model.build-output.get
    if current == "" then "Run main.kk to see compiler output." else current
  else
    val current = model.runtime-output.get
    if current == ""
    then "Runtime console messages will appear here and in DevTools."
    else current

fun github-icon()
  trusted(unsafe-trusted-html(
    "<svg aria-hidden=\"true\" width=\"20\" height=\"20\" viewBox=\"0 0 24 24\">" ++
    "<path fill=\"currentColor\" d=\"M12 .7a11.3 11.3 0 0 0-3.6 22c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.2 5 18.2 5.3 18.2 5.3c.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.3 11.3 0 0 0 12 .7Z\"/>" ++
    "</svg>"
  ))

fun show-toast(model : playground-model, message : string)
  model.toast.set(message)

fun select-mobile(model : playground-model, selected : string)
  model.mobile-view.set(selected)
  if selected == "output" then model.right-view.set("output")
  else if selected == "preview" then model.right-view.set("preview")
  else if selected == "devtools" then
    model.right-view.set("preview")
    model.devtools-visible.set(True)
    set-devtools(True)
  else ()

fun apply-build(model : playground-model, changed : event)
  val status = event-string(changed,"status")
  model.build-status.set(status)
  model.build-label.set(event-string(changed,"label"))
  model.generated-output.set(event-string(changed,"generated"))
  model.build-output.set(event-string(changed,"build"))
  model.generated-file.set(event-string(changed,"generatedFile"))
  model.used-last-good.set(event-bool(changed,"usedLastGood"))
  if event-bool(changed,"ok") then
    model.last-built-source.set(event-string(changed,"builtSource"))
    model.preview-ready.set(True)
    model.runtime-output.set("")
    model.runtime-count.set(0)
    model.right-view.set("preview")
  else if status == "error" then
    model.output-channel.set("build")
    model.right-view.set("output")
  else ()

fun event-attributes(model : playground-model) : list<attribute<<ui>>>
  [
    on("playground-source",fn(changed)
      model.source.set(event-string(changed,"source"))
    ),
    on("playground-lsp",fn(changed)
      model.lsp-status.set(event-string(changed,"status"))
    ),
    on("playground-problems",fn(changed)
      model.problems.set(event-int(changed,"count"))
    ),
    on("playground-cursor",fn(changed)
      model.line.set(event-int(changed,"line"))
      model.column.set(event-int(changed,"column"))
    ),
    on("playground-session",fn(changed)
      model.compiler-version.set(event-string(changed,"compilerVersion"))
      model.session-error.set(event-string(changed,"error"))
    ),
    on("playground-build",fn(changed) apply-build(model,changed)),
    on("playground-runtime",fn(changed)
      model.runtime-output.set(event-string(changed,"text"))
      model.runtime-count.set(event-int(changed,"count"))
    ),
    on("playground-toast",fn(changed)
      show-toast(model,event-string(changed,"message"))
    )
  ]

fun render-brand()
  div(attrs=[class("brand"),aria("label","Koka and Kokaine Playground")])
    span(attrs=[class("brand__mark"),aria("hidden","true")])
      element-empty("img",attrs=[attr("src","/kokaine-icon.svg"),attr("alt","")])
    span(attrs=[class("brand__copy")])
      strong("Koka + Kokaine")
      span("Playground")

fun render-header(model : playground-model)
  header(attrs=[class("topbar")])
    render-brand()

    div(attrs=[class("topbar__signals"),aria("label","Playground status")])
      span(attrs=[class {
        "signal-chip signal-chip--" ++ model.lsp-status.get
      }])
        element-empty("span",attrs=[class("signal-chip__dot"),aria("hidden","true")])
        text { lsp-label(model.lsp-status.get) }
      span(attrs=[class("signal-chip signal-chip--compiler")])
        text {
          val version = model.compiler-version.get
          "Koka " ++ (if version == "" then "not found" else version)
        }
      dynamic fn()
        val count = model.problems.get
        if count > 0 then
          span(attrs=[class("signal-chip signal-chip--problem")])
            text(count.show ++ (if count == 1 then " problem" else " problems"))
        else ()
      dynamic fn()
        val label = model.build-label.get
        if label != "" && model.build-status.get != "compiling" then
          span(label,attrs=[class("signal-chip signal-chip--build")])
        else ()

    div(attrs=[class("topbar__actions")])
      a(attrs=[
        class("icon-button icon-button--compact"),
        href("https://github.com/Eric-Song-Nop/kokaine"),
        attr("target","_blank"),attr("rel","noreferrer noopener"),
        title("Kokaine on GitHub"),aria("label","Kokaine on GitHub")
      ])
        github-icon()
      button("↺",attrs=[
        kind("button"),class("icon-button icon-button--compact"),
        title("Reset starter"),aria("label","Reset starter"),
        on("click",fn(_) reset())
      ])
      button("⇧",attrs=[
        kind("button"),class("icon-button icon-button--compact"),
        title("Copy share link"),aria("label","Copy share link"),
        on("click",fn(_) share())
      ])
      button("⌁",attrs=[
        kind("button"),
        class {
          if model.devtools-visible.get
          then "icon-button icon-button--compact is-active"
          else "icon-button icon-button--compact"
        },
        title { if model.devtools-visible.get then "Hide DevTools" else "Show DevTools" },
        aria("label") { if model.devtools-visible.get then "Hide DevTools" else "Show DevTools" },
        on("click",fn(_)
          val next = !model.devtools-visible.get
          model.devtools-visible.set(next)
          model.right-view.set("preview")
          set-devtools(next)
        )
      ])
      button(attrs=[
        kind("button"),class("icon-button icon-button--compact"),
        title { if model.dark.get then "Use light theme" else "Use dark theme" },
        aria("label") { if model.dark.get then "Use light theme" else "Use dark theme" },
        on("click",fn(_)
          val next = !model.dark.get
          model.dark.set(next)
          set-theme(next)
        )
      ])
        text { if model.dark.get then "☀" else "◐" }
      button(attrs=[
        kind("button"),
        class {
          "run-button" ++
          (if model.build-status.get == "compiling" then " is-running" else "") ++
          (if stale(model) then " is-stale" else "")
        },
        disabled { model.build-status.get == "compiling" },
        title("Compile and run (Ctrl/Command + Enter)"),
        on("click",fn(_) run())
      ])
        span { text { if model.build-status.get == "compiling" then "Compiling…" else "Run" } }
        element("kbd","⌘↵")

fun render-mobile-nav(model : playground-model)
  element("nav",attrs=[class("mobile-nav"),aria("label","Playground panels")])
    button("Editor",attrs=[
      class { if model.mobile-view.get == "editor" then "is-active" else "" },
      on("click",fn(_) select-mobile(model,"editor"))
    ])
    button("Preview",attrs=[
      class { if model.mobile-view.get == "preview" then "is-active" else "" },
      on("click",fn(_) select-mobile(model,"preview"))
    ])
    button("Output",attrs=[
      class { if model.mobile-view.get == "output" then "is-active" else "" },
      on("click",fn(_) select-mobile(model,"output"))
    ])
    button("DevTools",attrs=[
      class { if model.mobile-view.get == "devtools" then "is-active" else "" },
      on("click",fn(_) select-mobile(model,"devtools"))
    ])

fun render-editor(model : playground-model)
  section(attrs=[class {
    if model.mobile-view.get == "editor"
    then "workbench-panel is-mobile-active"
    else "workbench-panel"
  }])
    div(attrs=[class("panel-tabs")])
      div(attrs=[class("panel-tabs__group")])
        button(attrs=[kind("button"),class("panel-tab is-active")])
          span("K",attrs=[class("panel-tab__koka")])
          text("main.kk")
          dynamic fn()
            if stale(model)
            then element-empty("span",attrs=[class("panel-tab__dirty"),title("Not compiled")])
            else ()
      div("Koka · UTF-8",attrs=[class("panel-meta")])
    div(attrs=[class("editor-host")])
      element-empty("div",attrs=[
        id("playground-editor"),class("koka-editor"),
        attr("style","width:100%;height:100%;min-width:0;min-height:0")
      ])

fun render-editor-resizer()
  div(attrs=[
    id("playground-editor-resizer"),
    class("kokaine-drag-resizer kokaine-drag-resizer--vertical split-handle split-handle--x"),
    role("separator"),aria("label","Resize source editor"),
    aria("orientation","vertical"),attr("tabindex","0"),
    attr("aria-valuemin","300"),attr("aria-valuenow","600")
  ])
    element-empty("span",attrs=[aria("hidden","true")])

fun render-preview(model : playground-model)
  section(attrs=[
    id("playground-preview-root"),
    class { if model.dark.get then "kokaine-preview-root is-dark" else "kokaine-preview-root" },
    aria("label","Kokaine application preview"),
    attr("hidden") { if model.preview-ready.get then Nothing else Just("") }
  ])
    div(attrs=[class("kokaine-preview-toolbar")])
      label
        span("Viewport")
        element("select",attrs=[
          id("playground-device-width"),aria("label","Preview viewport width"),
          on("change",fn(changed) set-device-width(changed.value))
        ])
          element("option","Responsive",attrs=[attr("value","responsive")])
          element("option","Phone · 390 px",attrs=[attr("value","390")])
          element("option","Tablet · 768 px",attrs=[attr("value","768")])
          element("option","Desktop · 1024 px",attrs=[attr("value","1024")])
      span("Sandboxed",attrs=[class("kokaine-preview-toolbar__sandbox")])
      button("Reload",attrs=[
        kind("button"),class("kokaine-preview-toolbar__reload"),
        title("Reload preview"),on("click",fn(_) reload-preview())
      ])

    div(attrs=[class("kokaine-preview-stage")])
      div(attrs=[
        id("playground-preview-device"),
        class("kokaine-preview-device is-responsive"),
        attr("style","width:100%")
      ])
        element-empty("iframe",attrs=[
          id("playground-preview-frame"),class("kokaine-preview-frame"),
          title("Kokaine compiled application"),
          attr("sandbox","allow-scripts"),attr("referrerpolicy","no-referrer")
        ])

    div(attrs=[attr("hidden") {
      if model.devtools-visible.get then Nothing else Just("")
    }])
      div(attrs=[
        id("playground-devtools-resizer"),
        class("kokaine-drag-resizer kokaine-drag-resizer--horizontal"),
        role("separator"),aria("label","Resize DevTools"),
        aria("orientation","horizontal"),attr("tabindex","0"),
        attr("aria-valuemin","150"),attr("aria-valuenow","310")
      ])
        element-empty("span",attrs=[aria("hidden","true")])
    div(attrs=[
      class("kokaine-devtools-pane"),
      attr("hidden") { if model.devtools-visible.get then Nothing else Just("") },
      attr("style","height:310px")
    ])
      element-empty("iframe",attrs=[
        id("playground-devtools-frame"),class("kokaine-devtools-frame"),
        title("Kokaine Chromium DevTools"),
        attr("sandbox","allow-scripts allow-downloads"),
        attr("referrerpolicy","no-referrer"),attr("tabindex","-1")
      ])

fun render-preview-empty(model : playground-model)
  div(attrs=[class("preview-empty")])
    strong {
      text {
        if model.build-status.get == "compiling"
        then "Compiling main.kk…"
        else "Preview is waiting for a build"
      }
    }
    span {
      text {
        val problem = model.session-error.get
        if problem == ""
        then "Run the program to compile Kokaine for the browser."
        else problem
      }
    }
    button("Run main.kk",attrs=[
      kind("button"),disabled { model.build-status.get == "compiling" },
      on("click",fn(_) run())
    ])

fun render-output(model : playground-model)
  section(attrs=[class("output-pane"),aria("label","Compiler output")])
    div(attrs=[class("output-toolbar")])
      div(attrs=[class("subtabs"),role("tablist"),aria("label","Output channels")])
        button("Generated JS",attrs=[
          kind("button"),role("tab"),
          aria("selected") { if model.output-channel.get == "generated" then "true" else "false" },
          class { if model.output-channel.get == "generated" then "is-active" else "" },
          on("click",fn(_) model.output-channel.set("generated"))
        ])
        button("Build log",attrs=[
          kind("button"),role("tab"),
          aria("selected") { if model.output-channel.get == "build" then "true" else "false" },
          class { if model.output-channel.get == "build" then "is-active" else "" },
          on("click",fn(_) model.output-channel.set("build"))
        ])
        button(attrs=[
          kind("button"),role("tab"),
          aria("selected") { if model.output-channel.get == "runtime" then "true" else "false" },
          class { if model.output-channel.get == "runtime" then "is-active" else "" },
          on("click",fn(_) model.output-channel.set("runtime"))
        ])
          text("Runtime ")
          span(attrs=[class("subtabs__count")])
            text { model.runtime-count.get.show }
      button("Copy",attrs=[
        kind("button"),class("icon-button icon-button--compact"),
        aria("label","Copy output"),title("Copy output"),
        on("click",fn(_) copy-output(output-text(model)))
      ])
    element("pre",attrs=[
      class { "code-output code-output--" ++ model.output-channel.get },
      attr("tabindex","0")
    ])
      element("code")
        text { output-text(model) }

fun render-result-panel(model : playground-model)
  section(attrs=[
    class {
      if model.mobile-view.get != "editor"
      then "workbench-panel right-panel is-mobile-active"
      else "workbench-panel right-panel"
    }
  ])
    div(attrs=[class("panel-tabs")])
      div(attrs=[class("panel-tabs__group"),role("tablist"),aria("label","Result panels")])
        button("Preview",attrs=[
          kind("button"),role("tab"),
          aria("selected") { if model.right-view.get == "preview" then "true" else "false" },
          class { if model.right-view.get == "preview" then "panel-tab is-active" else "panel-tab" },
          on("click",fn(_) model.right-view.set("preview"))
        ])
        button("Output",attrs=[
          kind("button"),role("tab"),
          aria("selected") { if model.right-view.get == "output" then "true" else "false" },
          class { if model.right-view.get == "output" then "panel-tab is-active" else "panel-tab" },
          on("click",fn(_) model.right-view.set("output"))
        ])
      div(attrs=[class("panel-meta")])
        dynamic fn()
          if model.used-last-good.get then span("last good build") else ()
        dynamic fn()
          val file = model.generated-file.get
          if file != "" then span(file) else ()

    div(attrs=[class("right-panel__body")])
      div(attrs=[class {
        "right-surface" ++
        (if model.right-view.get == "preview" then " is-active" else "") ++
        (if model.mobile-view.get == "preview" || model.mobile-view.get == "devtools"
         then " is-mobile-active" else "")
      }])
        render-preview(model)
        dynamic fn()
          if model.preview-ready.get then () else render-preview-empty(model)
      div(attrs=[class {
        "right-surface" ++
        (if model.right-view.get == "output" then " is-active" else "") ++
        (if model.mobile-view.get == "output" then " is-mobile-active" else "")
      }])
        render-output(model)

fun render-statusbar(model : playground-model)
  footer(attrs=[class("statusbar")])
    div
      span("main.kk")
      span(attrs=[class { "statusbar__lsp statusbar__lsp--" ++ model.lsp-status.get }])
        text { "Koka LSP " ++ model.lsp-status.get }
      span { text { model.problems.get.show } }
    div
      span { text { "Ln " ++ model.line.get.show ++ ", Col " ++ model.column.get.show } }
      span("Spaces: 2")
      span {
        text {
          if model.build-status.get == "compiling"
          then "Compiling in WASM…"
          else "Koka WASM"
        }
      }

fun render-app(model : playground-model)
  view
    main-tag(attrs=event-attributes(model) ++ [
      id("playground-root"),class("app-shell"),
      attr("data-workbench-runtime","kokaine"),
      attr("data-theme") { Just(if model.dark.get then "dark" else "light") }
    ])
      render-header(model)
      render-mobile-nav(model)
      div(attrs=[id("playground-workbench"),class("workbench")])
        render-editor(model)
        render-editor-resizer()
        render-result-panel(model)
      render-statusbar(model)
      div(attrs=[class("toast-region"),aria("live","polite"),aria("atomic","true")])
        dynamic fn()
          val message = model.toast.get
          if message == "" then () else div(message,attrs=[class("toast")])

pub fun main()
  val source = initial-source()
  val dark = initial-dark()
  val (root,model) = create-root fn(root)
    create-model(root,source,dark)
  val dispose = mount(root,query("#app"),render-app(model))
  start()
  ()
