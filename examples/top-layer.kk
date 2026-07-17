/*--------------------------------------------------------------------------
  Native top-layer example: Kokaine renders ordinary DOM ownership while the
  browser supplies modal dialog and declarative popover behavior.
--------------------------------------------------------------------------*/
module top-layer

import kokaine/reactive
import kokaine/html
import kokaine/dom


pub fun main()
  val (root,(dialog-state,dialog-result,dialog-cancels,keep-dialog-open,
             popover-state)) =
    create-root fn(root)
      (signal(root,"closed"),signal(root,"none"),signal(root,0),
       signal(root,False),signal(root,"closed"))

  val page = view
    main-tag(attrs=[class("top-layer-shell")])
      header(attrs=[class("masthead")])
        p("KOKAINE / NATIVE TOP LAYER",attrs=[class("eyebrow")])
        h1("Keep the DOM tree.\nLet the browser raise the surface.")
        p(
          "Dialog and Popover stay inside their Kokaine owner while the browser handles focus, dismissal, and stacking.",
          attrs=[class("lede")]
        )

      section(attrs=[class("demo-grid"),aria("label","Top-layer examples")])
        section(attrs=[class("demo-card demo-card--dialog")])
          p("MODAL / COMMAND",attrs=[class("demo-card__kind")])
          h2("Review settings")
          p(
            "showModal() enters the modal top layer. The dialog form closes without navigation and reports the activated button value.",
            attrs=[class("demo-card__copy")]
          )
          div(attrs=[class("demo-card__actions")])
            button("Open dialog",attrs=[
              id("open-settings-dialog"),kind("button"),class("action action--primary"),
              on("click",fn(_)
                val target = query("#settings-dialog")
                dialog/show-modal(target)
                dialog-state.set("modal")
              )
            ])
          div(attrs=[class("readout"),aria("live","polite")])
            span("state")
            strong(attrs=[id("dialog-state")])
              text { dialog-state.get.to-upper }
            span("result")
            strong(attrs=[id("dialog-result")])
              text { dialog-result.get.to-upper }
            span("cancel requests")
            strong(attrs=[id("dialog-cancel-count")])
              text { dialog-cancels.get.show }

        section(attrs=[class("demo-card demo-card--popover")])
          p("POPOVER / DECLARATIVE",attrs=[class("demo-card__kind")])
          h2("Read the field note")
          p(
            "The trigger and close control are plain popovertarget attributes. Auto mode adds top-layer placement, light dismiss, and Escape.",
            attrs=[class("demo-card__copy")]
          )
          div(attrs=[class("demo-card__actions")])
            button("Open field note",attrs=[
              id("open-help-popover"),kind("button"),class("action action--secondary"),
              popover-target("help-popover"),
              popover-target-action(Popover-show)
            ])
            button("Toggle field note",attrs=[
              id("toggle-help-popover"),kind("button"),class("action action--quiet"),
              popover-target("help-popover"),
              popover-target-action(Popover-toggle)
            ])
          div(attrs=[class("readout readout--compact"),aria("live","polite")])
            span("browser state")
            strong(attrs=[id("popover-state")])
              text { popover-state.get.to-upper }

      footer(attrs=[class("page-note")])
        p("No portal, relocation, focus trap, or z-index manager.")
        p("The platform owns the top layer; Kokaine owns the nodes.")

      dialog(attrs=[
        id("settings-dialog"),class("settings-dialog"),
        aria("labelledby","settings-dialog-title"),
        dialog-closed-by(Dialog-close-request),
        on("cancel",fn(ev)
          dialog-cancels.modify(fn(value) value + 1)
          if keep-dialog-open.get
          then prevent-default(ev)
          else ()
        ),
        on("close",fn(ev)
          dialog-result.set(dialog/event-return-value(ev))
          dialog-state.set("closed")
        )
      ])
        div(attrs=[class("dialog-heading")])
          p("NATIVE MODAL",attrs=[class("demo-card__kind")])
          h2("Review settings",attrs=[id("settings-dialog-title")])
          p("Escape sends a cancel request. The checkbox makes that request cancelable.")
        element("form",attrs=[dialog-form-method(),class("dialog-form")])
          label(attrs=[class("keep-open")])
            input(attrs=[
              id("keep-dialog-open"),kind("checkbox"),
              checked { keep-dialog-open.get },
              on-change(fn(ev) keep-dialog-open.set(ev.checked))
            ])
            span("Keep the dialog open when Escape is pressed")
          div(attrs=[class("dialog-actions")])
            button("Cancel",attrs=[
              id("cancel-dialog"),kind("submit"),value("cancel"),
              class("action action--quiet")
            ])
            button("Save settings",attrs=[
              id("save-dialog"),kind("submit"),value("save"),autofocus(),
              class("action action--primary")
            ])

      div(attrs=[
        id("help-popover"),class("help-popover"),popover(Popover-auto),
        role("dialog"),aria("labelledby","help-popover-title"),
        on("toggle",fn(ev)
          match toggle/state(ev)
            Toggle-open -> popover-state.set("open")
            Toggle-closed -> popover-state.set("closed")
        )
      ])
        p("FIELD NOTE / AUTO",attrs=[class("demo-card__kind")])
        h2("Top layer without a portal",attrs=[id("help-popover-title")])
        p("This node remains a child of the mounted Kokaine view. Click outside, press Escape, or use the explicit hide action.")
        button("Close note",attrs=[
          id("close-help-popover"),kind("button"),class("action action--quiet"),
          popover-target("help-popover"),
          popover-target-action(Popover-hide)
        ])

  val dispose = mount(root,query("#app"),page)
  ()
