/*--------------------------------------------------------------------------
  Browser-only fixture for native dialog and popover commands. The fixture
  publishes small synchronous controls so Playwright can observe the browser's
  actual top-layer state without bypassing Kokaine's DOM adapters.
--------------------------------------------------------------------------*/
module dom-top-layer

import kokaine/reactive
import kokaine/html
import kokaine/dom


extern publish-dialog-controls(
  show-dialog : () -> ui string,
  show-modal : () -> ui string,
  close-dialog : (string) -> ui string,
  request-close : (string) -> ui string,
  is-open : () -> ui bool,
  is-modal : () -> ui bool,
  return-value : () -> ui string,
  wrong-target : () -> ui string,
  detached-modal : () -> ui string
) : ui ()
  js inline "(globalThis.__kokaineTopLayer = { dialog:{ show:#1, showModal:#2, close:#3, requestClose:#4, isOpen:#5, isModal:#6, returnValue:#7, wrongTarget:#8, detachedModal:#9 } })"

extern publish-popover-controls(
  show-manual : () -> ui string,
  hide-manual : () -> ui string,
  toggle-manual : () -> ui bool,
  set-manual : (bool) -> ui string,
  is-manual-open : () -> ui bool,
  show-auto : () -> ui string,
  show-hint-one : () -> ui string,
  show-hint-two : () -> ui string,
  wrong-target : () -> ui string
) : ui ()
  js inline "(globalThis.__kokaineTopLayer.popover = { showManual:#1, hideManual:#2, toggleManual:#3, setManual:#4, isManualOpen:#5, showAuto:#6, showHintOne:#7, showHintTwo:#8, wrongTarget:#9 })"

extern publish-adapter-controls(
  set-cancel-blocked : (bool) -> ui string,
  invalid-dialog-event : () -> ui string,
  before-state : () -> ui bool,
  detached-popover-target : () -> ui string,
  invalid-popover-event : () -> ui string,
  read-toggle-event : (any) -> ui string,
  read-dialog-event : (any) -> ui string
) : ui ()
  js inline "(Object.assign(globalThis.__kokaineTopLayer.dialog,{ setCancelBlocked:#1, invalidEvent:#2, readEvent:#7 }), Object.assign(globalThis.__kokaineTopLayer.popover,{ beforeState:#3, detached:#4, invalidEvent:#5, readEvent:#6 }))"

extern publish-owned-controls(
  open-dialog : () -> ui string,
  open-popover : () -> ui string,
  retire : () -> ui string,
  restore : () -> ui string,
  event-count : () -> ui int
) : ui ()
  js inline "(globalThis.__kokaineTopLayer.owned = { openDialog:#1, openPopover:#2, retire:#3, restore:#4, eventCount:#5 })"

extern publish-dispose-controls(
  open-dialog : () -> ui string,
  open-popover : () -> ui string,
  dispose-root : () -> ui string
) : ui ()
  js inline "(globalThis.__kokaineTopLayer.dispose = { openDialog:#1, openPopover:#2, root:#3 })"

extern detached-dialog() : ui node
  js inline "document.createElement('dialog')"

extern detached-popover() : ui node
  js inline "(function(){ var target=document.createElement('div'); target.popover='manual'; return target; })()"

extern invalid-toggle-event() : any
  js inline "({ type:'toggle', newState:'open', currentTarget:null })"

extern invalid-dialog-event() : any
  js inline "({ type:'close', currentTarget:document.createElement('div') })"


fun unit-result(action : () -> <ui,exn> ()) : ui string
  with catch fn(problem) "error: " ++ problem.show
  action()
  "ok"

fun bool-result(action : () -> <ui,exn> bool) : ui bool
  with catch fn(_) False
  action()

fun string-result(action : () -> <ui,exn> string) : ui string
  with catch fn(problem) "error: " ++ problem.show
  action()

fun update-result(root : root<<ui>>, action : () -> signal-write ()) : ui string
  with catch fn(problem) "error: " ++ problem.show
  update(root,action)
  "ok"

fun read-count(root : root<<ui>>, value : signal<int>) : ui int
  with catch fn(_) -1
  sample(root){ value.get }

fun read-bool(root : root<<ui>>, value : signal<bool>) : ui bool
  with catch fn(_) False
  sample(root){ value.get }

fun invalid-toggle-result() : ui string
  with catch fn(problem) "error: " ++ problem.show
  val state = toggle/state(Event("",False,"",invalid-toggle-event()))
  "missed"

fun invalid-dialog-result() : ui string
  with catch fn(problem) "error: " ++ problem.show
  val value = dialog/event-return-value(
    Event("",False,"",invalid-dialog-event())
  )
  "missed"

fun toggle-event-result(original : any) : ui string
  with catch fn(problem) "error: " ++ problem.show
  match toggle/state(Event("",False,"",original))
    Toggle-open -> "open"
    Toggle-closed -> "closed"

fun dialog-event-result(original : any) : ui string
  with catch fn(problem) "error: " ++ problem.show
  dialog/event-return-value(Event("",False,"",original))

fun dispose-result(root : root<<ui>>) : ui string
  with catch fn(problem) "error: " ++ problem.show
  root.dispose()
  "ok"


pub fun main()
  val (root,(owned-visible,owned-events,cancel-blocked,manual-before-open)) =
    create-root fn(root)
      (signal(root,True),signal(root,0),signal(root,False),signal(root,False))

  val page = view
    div(attrs=[id("top-layer-command-fixture")])
      button("outside",attrs=[id("fixture-outside"),kind("button")])

      dialog("fixture dialog",attrs=[
        id("fixture-dialog"),
        on("cancel",fn(ev)
          if cancel-blocked.get then prevent-default(ev) else ()
        )
      ])

      div("manual",attrs=[
        id("fixture-manual-popover"),popover(Popover-manual),
        on("beforetoggle",fn(ev)
          match toggle/state(ev)
            Toggle-open -> manual-before-open.set(True)
            Toggle-closed -> manual-before-open.set(False)
        )
      ])
      div("auto",attrs=[
        id("fixture-auto-popover"),popover(Popover-auto)
      ])
      div("hint one",attrs=[
        id("fixture-hint-one"),popover(Popover-hint)
      ])
      div("hint two",attrs=[
        id("fixture-hint-two"),popover(Popover-hint)
      ])

      dynamic
        if owned-visible.get then
          div(attrs=[id("owned-top-layer-branch")])
            dialog("owned dialog",attrs=[
              id("owned-dialog"),
              on("close",fn(_)
                owned-events.modify(fn(value) value + 1)
              )
            ])
            div("owned popover",attrs=[
              id("owned-popover"),popover(Popover-manual),
              on("toggle",fn(_)
                owned-events.modify(fn(value) value + 1)
              )
            ])
        else
          span("retired",attrs=[id("owned-top-layer-retired")])

  val dispose = mount(root,query("#top-layer-fixture-root"),page)

  publish-dialog-controls(
    fn() unit-result(fn() dialog/show(query("#fixture-dialog"))),
    fn() unit-result(fn() dialog/show-modal(query("#fixture-dialog"))),
    fn(result) unit-result(fn()
      dialog/close(query("#fixture-dialog"),result)
    ),
    fn(result) unit-result(fn()
      dialog/request-close(query("#fixture-dialog"),result)
    ),
    fn() bool-result(fn() dialog/is-open(query("#fixture-dialog"))),
    fn() bool-result(fn() dialog/is-modal(query("#fixture-dialog"))),
    fn() string-result(fn() dialog/return-value(query("#fixture-dialog"))),
    fn() unit-result(fn()
      dialog/show(query("#fixture-manual-popover"))
    ),
    fn() unit-result(fn() dialog/show-modal(detached-dialog()))
  )

  publish-popover-controls(
    fn() unit-result(fn()
      popover/show(query("#fixture-manual-popover"))
    ),
    fn() unit-result(fn()
      popover/hide(query("#fixture-manual-popover"))
    ),
    fn() bool-result(fn()
      popover/toggle(query("#fixture-manual-popover"))
    ),
    fn(open) unit-result(fn()
      popover/set-open(query("#fixture-manual-popover"),open)
    ),
    fn() bool-result(fn()
      popover/is-open(query("#fixture-manual-popover"))
    ),
    fn() unit-result(fn()
      popover/show(query("#fixture-auto-popover"))
    ),
    fn() unit-result(fn()
      popover/show(query("#fixture-hint-one"))
    ),
    fn() unit-result(fn()
      popover/show(query("#fixture-hint-two"))
    ),
    fn() unit-result(fn()
      popover/show(query("#fixture-dialog"))
    )
  )

  publish-adapter-controls(
    fn(blocked) update-result(root,fn() cancel-blocked.set(blocked)),
    fn() invalid-dialog-result(),
    fn() read-bool(root,manual-before-open),
    fn() unit-result(fn() popover/show(detached-popover())),
    fn() invalid-toggle-result(),
    fn(original) toggle-event-result(original),
    fn(original) dialog-event-result(original)
  )

  publish-owned-controls(
    fn() unit-result(fn() dialog/show-modal(query("#owned-dialog"))),
    fn() unit-result(fn() popover/show(query("#owned-popover"))),
    fn() update-result(root,fn() owned-visible.set(False)),
    fn() update-result(root,fn() owned-visible.set(True)),
    fn() read-count(root,owned-events)
  )

  val (dispose-root,_) = create-root fn(dispose-root) ()
  val dispose-page = view
    div(attrs=[id("root-dispose-top-layer-branch")])
      dialog("dispose dialog",attrs=[id("root-dispose-dialog")])
      div("dispose popover",attrs=[
        id("root-dispose-popover"),popover(Popover-manual)
      ])
  val dispose-mount = mount(
    dispose-root,query("#top-layer-dispose-root"),dispose-page
  )
  publish-dispose-controls(
    fn() unit-result(fn()
      dialog/show-modal(query("#root-dispose-dialog"))
    ),
    fn() unit-result(fn()
      popover/show(query("#root-dispose-popover"))
    ),
    fn() dispose-result(dispose-root)
  )
  ()
