/*--------------------------------------------------------------------------
  Multi-file Koka + Kokaine browser workbench.

  The project explorer, tabs, console, preview navigation, status surfaces,
  and all reactive presentation state are Kokaine views. Monaco, IndexedDB,
  compiler/LSP/REPL Workers, and sandboxed module execution are host services.
--------------------------------------------------------------------------*/
module playground/main

import kokaine/reactive
import kokaine/html
import kokaine/dom
import playground/host

struct playground-model(
  dark              : signal<bool>,
  project-ready     : signal<bool>,
  file-count        : signal<int>,
  tab-count         : signal<int>,
  active-path       : signal<string>,
  selected-path     : signal<string>,
  entry-module      : signal<string>,
  project-revision  : signal<int>,
  dirty             : signal<bool>,
  lsp-status        : signal<string>,
  problems          : signal<int>,
  line               : signal<int>,
  column             : signal<int>,
  build-status       : signal<string>,
  build-label        : signal<string>,
  compiler-version   : signal<string>,
  repl-status        : signal<string>,
  repl-label         : signal<string>,
  right-view         : signal<string>,
  mobile-view        : signal<string>,
  console-output     : signal<string>,
  console-count      : signal<int>,
  repl-input         : signal<string>,
  generated-output   : signal<string>,
  build-output       : signal<string>,
  generated-file     : signal<string>,
  output-channel     : signal<string>,
  preview-ready      : signal<bool>,
  devtools-visible   : signal<bool>,
  session-error      : signal<string>,
  toast              : signal<string>
)

fun create-model(root, dark : bool)
  Playground-model(
    signal(root,dark),signal(root,False),signal(root,0),signal(root,0),
    signal(root,"main.kk"),signal(root,"main.kk"),signal(root,"main"),
    signal(root,0),signal(root,False),signal(root,"connecting"),
    signal(root,0),signal(root,1),signal(root,1),signal(root,"idle"),
    signal(root,""),signal(root,""),signal(root,"starting"),
    signal(root,"Starting REPL"),signal(root,"console"),signal(root,"editor"),
    signal(root,""),signal(root,0),signal(root,""),signal(root,""),
    signal(root,""),signal(root,""),signal(root,"generated"),
    signal(root,False),signal(root,False),signal(root,""),signal(root,"")
  )

fun lsp-label(status : string) : string
  if status == "ready" then "LSP ready"
  else if status == "error" then "LSP error"
  else if status == "offline" then "LSP offline"
  else "LSP starting"

fun repl-status-label(model : playground-model) : signal-read string
  val label = model.repl-label.get
  if label != "" then label
  else if model.repl-status.get == "ready" then "REPL ready"
  else if model.repl-status.get == "busy" then "REPL running"
  else if model.repl-status.get == "error" then "REPL error"
  else "REPL starting"

fun output-text(model : playground-model) : signal-read string
  if model.output-channel.get == "build" then
    val current = model.build-output.get
    if current == "" then "Run the project to see compiler diagnostics." else current
  else
    val current = model.generated-output.get
    if current == "" then "A successful project build will show generated JavaScript." else current

fun github-icon()
  trusted(unsafe-trusted-html(
    "<svg aria-hidden=\"true\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\">" ++
    "<path fill=\"currentColor\" d=\"M12 .7a11.3 11.3 0 0 0-3.6 22c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.2 5 18.2 5.3 18.2 5.3c.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.3 11.3 0 0 0 12 .7Z\"/>" ++
    "</svg>"
  ))

fun event-attributes(model : playground-model) : list<attribute<<ui>>>
  [
    on("playground-project",fn(changed)
      model.project-ready.set(True)
      model.file-count.set(event-int(changed,"fileCount"))
      model.tab-count.set(event-int(changed,"tabCount"))
      model.active-path.set(event-string(changed,"activePath"))
      model.selected-path.set(event-string(changed,"selectedPath"))
      model.entry-module.set(event-string(changed,"entryModule"))
      model.project-revision.set(event-int(changed,"revision"))
      model.dirty.set(event-bool(changed,"dirty"))
    ),
    on("playground-lsp",fn(changed) model.lsp-status.set(event-string(changed,"status"))),
    on("playground-problems",fn(changed) model.problems.set(event-int(changed,"count"))),
    on("playground-cursor",fn(changed)
      model.line.set(event-int(changed,"line"))
      model.column.set(event-int(changed,"column"))
    ),
    on("playground-session",fn(changed)
      model.compiler-version.set(event-string(changed,"compilerVersion"))
      model.session-error.set(event-string(changed,"error"))
    ),
    on("playground-build",fn(changed)
      model.build-status.set(event-string(changed,"status"))
      model.build-label.set(event-string(changed,"label"))
      model.generated-output.set(event-string(changed,"generated"))
      model.build-output.set(event-string(changed,"build"))
      model.generated-file.set(event-string(changed,"generatedFile"))
      if event-bool(changed,"ok") then model.preview-ready.set(True) else ()
    ),
    on("playground-repl",fn(changed)
      model.repl-status.set(event-string(changed,"status"))
      model.repl-label.set(event-string(changed,"label"))
    ),
    on("playground-console",fn(changed)
      model.console-output.set(event-string(changed,"text"))
      model.console-count.set(event-int(changed,"count"))
    ),
    on("playground-toast",fn(changed) model.toast.set(event-string(changed,"message")))
  ]

fun render-brand()
  div(attrs=[class("brand"),aria("label","Kokaine Playground")])
    span(attrs=[class("brand__mark"),aria("hidden","true")])
      element-empty("img",attrs=[attr("src","/kokaine-icon.svg"),attr("alt","")])
    span(attrs=[class("brand__copy")])
      strong("Kokaine Playground")
      span("Koka builds Kokaine builds UI")

fun render-header(model : playground-model)
  header(attrs=[class("topbar")])
    render-brand()
    div(attrs=[class("topbar__signals"),aria("label","Workbench status")])
      span(attrs=[class { "signal-chip signal-chip--" ++ model.lsp-status.get }])
        element-empty("span",attrs=[class("signal-chip__dot"),aria("hidden","true")])
        text { lsp-label(model.lsp-status.get) }
      span(attrs=[class { "signal-chip signal-chip--" ++ model.repl-status.get }])
        element-empty("span",attrs=[class("signal-chip__dot"),aria("hidden","true")])
        text { repl-status-label(model) }
      dynamic fn()
        val version = model.compiler-version.get
        if version == "" then ()
        else span("Koka " ++ version,attrs=[class("signal-chip signal-chip--compiler")])
      dynamic fn()
        val count = model.problems.get
        if count <= 0 then ()
        else span(count.show ++ (if count == 1 then " problem" else " problems"),
                  attrs=[class("signal-chip signal-chip--problem")])
      dynamic fn()
        val label = model.build-label.get
        if label == "" then ()
        else span(label,attrs=[class("signal-chip signal-chip--build")])
    div(attrs=[class("topbar__actions")])
      a(attrs=[class("icon-button"),href("https://github.com/Eric-Song-Nop/kokaine"),
               attr("target","_blank"),attr("rel","noreferrer noopener"),
               title("Kokaine on GitHub"),aria("label","Kokaine on GitHub")])
        github-icon()
      button("Share",attrs=[kind("button"),class("toolbar-button"),on("click",fn(_) share-project())])
      button("Reset",attrs=[kind("button"),class("toolbar-button"),on("click",fn(_) reset-project())])
      button(attrs=[kind("button"),class("icon-button"),
                    title { if model.dark.get then "Use light theme" else "Use dark theme" },
                    aria("label") { if model.dark.get then "Use light theme" else "Use dark theme" },
                    on("click",fn(_)
                      val next = !model.dark.get
                      model.dark.set(next)
                      set-theme(next)
                    )])
        text { if model.dark.get then "Light" else "Dark" }
      button(attrs=[kind("button"),class {
                      "run-button" ++ (if model.build-status.get == "compiling" then " is-running" else "")
                    },disabled { model.build-status.get == "compiling" },
                    title("Compile and run entry module"),on("click",fn(_) run-project())])
        span { text { if model.build-status.get == "compiling" then "Building…" else "Run Project" } }
        element("kbd","⌘↵")

fun render-project-entries(model : playground-model)
  val revision = model.project-revision.get
  val selected = model.selected-path.get
  val entry = model.entry-module.get
  if revision < 0 then ()
  else
    range/list(0,model.file-count.get - 1).foreach fn(index)
      val kind-name = project-entry-kind(index)
      val path = project-entry-path(index)
      val depth = project-entry-depth(index)
      button(attrs=[kind("button"),
        class("project-entry project-entry--" ++ kind-name ++
          (if path == selected then " is-selected" else "")),
        attr("style","--tree-depth:" ++ depth.show),
        title(path),
        on("click",fn(_) open-project-entry(index))
      ])
        span(if kind-name == "directory" then "›" else "K",attrs=[class("project-entry__icon"),aria("hidden","true")])
        span(project-entry-label(index),attrs=[class("project-entry__label")])
        if entry != "" && project-entry-is-entry(index)
        then span("entry",attrs=[class("project-entry__entry")])
        else ()

fun render-project-panel(model : playground-model)
  element("aside",attrs=[class {
    "project-panel" ++ (if model.mobile-view.get == "project" then " is-mobile-active" else "")
  },aria("label","Project explorer")])
    div(attrs=[class("project-panel__heading")])
      div
        strong("Project")
        span { text { "rev " ++ model.project-revision.get.show } }
      div(attrs=[class("project-panel__create")])
        button("+ File",attrs=[kind("button"),title("Create Koka file"),on("click",fn(_) create-file())])
        button("+ Folder",attrs=[kind("button"),title("Create folder"),on("click",fn(_) create-directory())])
    div(attrs=[class("project-tree"),role("tree")])
      dynamic fn()
        if model.project-ready.get then render-project-entries(model)
        else p("Opening IndexedDB project…",attrs=[class("project-tree__empty")])
    div(attrs=[class("project-panel__actions")])
      button("Rename",attrs=[kind("button"),on("click",fn(_) rename-selected())])
      button("Delete",attrs=[kind("button"),on("click",fn(_) delete-selected())])
      button("Set entry",attrs=[kind("button"),on("click",fn(_) set-selected-entry())])
    div(attrs=[class("project-panel__foot")])
      span("Entry")
      element("code",attrs=[title { model.entry-module.get }])
        text { model.entry-module.get }

fun render-open-tabs(model : playground-model)
  val revision = model.project-revision.get
  val active = model.active-path.get
  if revision < 0 then ()
  else
    range/list(0,model.tab-count.get - 1).foreach fn(index)
      val path = open-tab-path(index)
      div(attrs=[class("editor-tab" ++ (if path == active then " is-active" else ""))])
        button(attrs=[kind("button"),class("editor-tab__open"),title(path),on("click",fn(_) open-tab(index))])
          span("K",attrs=[class("editor-tab__koka")])
          span(open-tab-label(index),attrs=[class("editor-tab__label")])
          if path == active && model.dirty.get
          then element-empty("span",attrs=[class("editor-tab__dirty"),title("Saving changes")])
          else ()
        button("×",attrs=[kind("button"),class("editor-tab__close"),
                           aria("label","Close " ++ path),on("click",fn(_) close-tab(index))])

fun render-editor-panel(model : playground-model)
  section(attrs=[class {
    "editor-panel" ++ (if model.mobile-view.get == "editor" then " is-mobile-active" else "")
  },aria("label","Koka source editor")])
    div(attrs=[class("editor-tabs")])
      dynamic fn() render-open-tabs(model)
      span("Koka · UTF-8",attrs=[class("editor-tabs__meta")])
    div(attrs=[class("editor-host")])
      element-empty("div",attrs=[id("playground-editor"),class("koka-editor"),
        attr("style","width:100%;height:100%;min-width:0;min-height:0")])

fun submit-console(model : playground-model)
  val line = model.repl-input.get
  if line == "" then ()
  else
    submit-repl(line)
    model.repl-input.set("")

fun handle-repl-key(model : playground-model, changed : event)
  if changed.key == "Enter" && !event-shift(changed) then
    prevent-default(changed)
    submit-console(model)
  else if changed.key == "ArrowUp" then
    prevent-default(changed)
    model.repl-input.set(repl-history(-1))
  else if changed.key == "ArrowDown" then
    prevent-default(changed)
    model.repl-input.set(repl-history(1))
  else ()

fun render-console(model : playground-model)
  section(attrs=[class("console-pane"),aria("label","Koka REPL console")])
    div(attrs=[class("console-toolbar")])
      div
        strong("Koka REPL")
        span(attrs=[class { "console-status console-status--" ++ model.repl-status.get }])
          text { repl-status-label(model) }
      div
        button("Clear",attrs=[kind("button"),on("click",fn(_) clear-console())])
        button("Reset session",attrs=[kind("button"),on("click",fn(_) reset-repl())])
    element("pre",attrs=[id("playground-console-output"),class("console-stream"),
                          attr("tabindex","0"),aria("live","polite")])
      element("code")
        text {
          val current = model.console-output.get
          if current == "" then "REPL output will appear here." else current
        }
    element("form",attrs=[class("repl-prompt"),on("submit",fn(changed)
      prevent-default(changed)
      submit-console(model)
    )])
      span("›",attrs=[class("repl-prompt__mark"),aria("hidden","true")])
      element("textarea","",attrs=[id("playground-repl-input"),name("repl-line"),
        class("repl-prompt__input"),attr("rows","2"),placeholder("Expression or :t type query"),
        attr("spellcheck","false"),aria("label","Koka REPL input"),
        live/value(fn() model.repl-input.get),
        on("input",fn(changed) model.repl-input.set(changed.value)),
        on("keydown",fn(changed) handle-repl-key(model,changed))
      ])
      button("Run",attrs=[kind("submit"),disabled { model.repl-status.get == "busy" }])
    div(attrs=[class("console-hints"),aria("label","REPL shortcuts")])
      span
        element("kbd","Enter")
        text(" submit")
      span
        element("kbd","Shift+Enter")
        text(" newline")
      span
        element("kbd","↑↓")
        text(" history")
      span
        element("kbd","⌘L")
        text(" clear")
    element-empty("div",attrs=[id("playground-repl-sandbox"),class("repl-sandbox-host"),aria("hidden","true")])

fun render-preview(model : playground-model)
  section(attrs=[id("playground-preview-root"),
    class { if model.dark.get then "kokaine-preview-root is-dark" else "kokaine-preview-root" },
    aria("label","Kokaine application preview")])
    div(attrs=[class("kokaine-preview-toolbar")])
      label
        span("Viewport")
        element("select",attrs=[id("playground-device-width"),aria("label","Preview viewport width"),
          on("change",fn(changed) set-device-width(changed.value))])
          element("option","Responsive",attrs=[attr("value","responsive")])
          element("option","Phone · 390 px",attrs=[attr("value","390")])
          element("option","Tablet · 768 px",attrs=[attr("value","768")])
          element("option","Desktop · 1024 px",attrs=[attr("value","1024")])
      div(attrs=[class("preview-actions")])
        span("sandboxed",attrs=[class("kokaine-preview-toolbar__sandbox")])
        button("Reload",attrs=[kind("button"),on("click",fn(_) reload-preview())])
        button(attrs=[kind("button"),on("click",fn(_)
          val next = !model.devtools-visible.get
          model.devtools-visible.set(next)
          set-devtools(next)
        )])
          text { if model.devtools-visible.get then "Hide DevTools" else "Show DevTools" }
    div(attrs=[class("kokaine-preview-stage")])
      div(attrs=[id("playground-preview-device"),class("kokaine-preview-device is-responsive"),attr("style","width:100%")])
        element-empty("iframe",attrs=[id("playground-preview-frame"),class("kokaine-preview-frame"),
          title("Kokaine compiled application"),attr("sandbox","allow-scripts"),attr("referrerpolicy","no-referrer")])
    div(attrs=[id("playground-devtools-resizer"),
      class("kokaine-drag-resizer kokaine-drag-resizer--horizontal"),role("separator"),
      aria("label","Resize DevTools"),aria("orientation","horizontal"),attr("tabindex","0"),
      attr("hidden") { if model.devtools-visible.get then Nothing else Just("") }])
      element-empty("span",attrs=[aria("hidden","true")])
    div(attrs=[class("kokaine-devtools-pane"),attr("style","height:310px"),
      attr("hidden") { if model.devtools-visible.get then Nothing else Just("") }])
      element-empty("iframe",attrs=[id("playground-devtools-frame"),class("kokaine-devtools-frame"),
        title("Kokaine Chromium DevTools"),attr("sandbox","allow-scripts allow-downloads"),
        attr("referrerpolicy","no-referrer"),attr("tabindex","-1")])
    dynamic fn()
      if model.preview-ready.get then ()
      else div(attrs=[class("preview-empty")])
        strong { text { if model.build-status.get == "compiling" then "Building project…" else "Preview is waiting" } }
        span { text { if model.session-error.get == "" then "Run the entry module to create a sandboxed preview." else model.session-error.get } }
        button("Run Project",attrs=[kind("button"),on("click",fn(_) run-project())])

fun render-generated(model : playground-model)
  section(attrs=[class("output-pane"),aria("label","Generated and compiler output")])
    div(attrs=[class("output-toolbar")])
      div(attrs=[class("subtabs"),role("tablist"),aria("label","Build output channels")])
        button("Generated JS",attrs=[kind("button"),role("tab"),
          class { if model.output-channel.get == "generated" then "is-active" else "" },
          aria("selected") { if model.output-channel.get == "generated" then "true" else "false" },
          on("click",fn(_) model.output-channel.set("generated"))])
        button("Build log",attrs=[kind("button"),role("tab"),
          class { if model.output-channel.get == "build" then "is-active" else "" },
          aria("selected") { if model.output-channel.get == "build" then "true" else "false" },
          on("click",fn(_) model.output-channel.set("build"))])
      button("Copy",attrs=[kind("button"),on("click",fn(_) copy-output(output-text(model)))])
    element("pre",attrs=[class("code-output"),attr("tabindex","0")])
      element("code")
        text { output-text(model) }

fun select-right(model : playground-model, selected : string)
  model.right-view.set(selected)
  if selected == "console" then model.mobile-view.set("console")
  else if selected == "preview" then model.mobile-view.set("preview")
  else ()

fun render-right-panel(model : playground-model)
  section(attrs=[class {
    "right-panel" ++
    (if model.mobile-view.get == "console" || model.mobile-view.get == "preview" then " is-mobile-active" else "")
  }])
    div(attrs=[class("right-tabs"),role("tablist"),aria("label","Workbench tools")])
      button("Console",attrs=[kind("button"),role("tab"),
        class { if model.right-view.get == "console" then "is-active" else "" },
        aria("selected") { if model.right-view.get == "console" then "true" else "false" },
        on("click",fn(_) select-right(model,"console"))])
      button("Preview",attrs=[kind("button"),role("tab"),
        class { if model.right-view.get == "preview" then "is-active" else "" },
        aria("selected") { if model.right-view.get == "preview" then "true" else "false" },
        on("click",fn(_) select-right(model,"preview"))])
      button("Generated",attrs=[kind("button"),role("tab"),
        class { if model.right-view.get == "generated" then "is-active" else "" },
        aria("selected") { if model.right-view.get == "generated" then "true" else "false" },
        on("click",fn(_) model.right-view.set("generated"))])
      span(attrs=[class("right-tabs__meta")])
        text { model.console-count.get.show ++ " lines" }
    div(attrs=[class("right-panel__body")])
      div(attrs=[class { "right-surface" ++ (if model.right-view.get == "console" then " is-active" else "") }])
        render-console(model)
      div(attrs=[class { "right-surface" ++ (if model.right-view.get == "preview" then " is-active" else "") }])
        render-preview(model)
      div(attrs=[class { "right-surface" ++ (if model.right-view.get == "generated" then " is-active" else "") }])
        render-generated(model)

fun render-mobile-nav(model : playground-model)
  element("nav",attrs=[class("mobile-nav"),aria("label","Workbench panels")])
    button("Project",attrs=[class { if model.mobile-view.get == "project" then "is-active" else "" },
      on("click",fn(_) model.mobile-view.set("project"))])
    button("Editor",attrs=[class { if model.mobile-view.get == "editor" then "is-active" else "" },
      on("click",fn(_) model.mobile-view.set("editor"))])
    button("Console",attrs=[class { if model.mobile-view.get == "console" then "is-active" else "" },
      on("click",fn(_) select-right(model,"console"))])
    button("Preview",attrs=[class { if model.mobile-view.get == "preview" then "is-active" else "" },
      on("click",fn(_) select-right(model,"preview"))])

fun render-statusbar(model : playground-model)
  footer(attrs=[class("statusbar")])
    div
      span { text { model.active-path.get } }
      span(attrs=[class { "statusbar__lsp statusbar__lsp--" ++ model.lsp-status.get }])
        text { "Koka LSP " ++ model.lsp-status.get }
      span { text { model.problems.get.show ++ " problems" } }
    div
      span { text { "Ln " ++ model.line.get.show ++ ", Col " ++ model.column.get.show } }
      span { text { if model.dirty.get then "Saving…" else "Saved to IndexedDB" } }
      span { text { "entry " ++ model.entry-module.get } }

fun render-app(model : playground-model)
  view
    main-tag(attrs=event-attributes(model) ++ [id("playground-root"),class("app-shell"),
      attr("data-workbench-runtime","kokaine"),attr("data-theme") { Just(if model.dark.get then "dark" else "light") }])
      render-header(model)
      render-mobile-nav(model)
      div(attrs=[id("playground-workbench"),class("workbench")])
        render-project-panel(model)
        render-editor-panel(model)
        element-empty("div",attrs=[id("playground-editor-resizer"),
          class("split-handle split-handle--x"),role("separator"),aria("label","Resize editor and tools"),
          aria("orientation","vertical"),attr("tabindex","0"),attr("aria-valuemin","320"),attr("aria-valuenow","620")])
        render-right-panel(model)
      render-statusbar(model)
      div(attrs=[class("toast-region"),aria("live","polite"),aria("atomic","true")])
        dynamic fn()
          val message = model.toast.get
          if message == "" then () else div(message,attrs=[class("toast")])

pub fun main()
  val (root,model) = create-root fn(root) create-model(root,initial-dark())
  val dispose = mount(root,query("#app"),render-app(model))
  start()
  ()
