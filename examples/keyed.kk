/*--------------------------------------------------------------------------
  Interactive keyed-control example.

  The text fields are intentionally uncontrolled. Their values therefore live
  in the DOM nodes and make retained row identity visible when the list moves.
--------------------------------------------------------------------------*/
module keyed

import kokaine/reactive
import kokaine/html
import kokaine/control
import kokaine/dom


value struct specimen(id : int, name : string, family : string,
                      revision : int)

fun specimen/(==)(left : specimen, right : specimen) : bool
  specimen/id(left) == specimen/id(right) &&
  specimen/name(left) == specimen/name(right) &&
  specimen/family(left) == specimen/family(right) &&
  specimen/revision(left) == specimen/revision(right)

struct specimen-model(
  specimens      : signal<list<specimen>>,
  next-id        : signal<int>,
  specimen-count : memo<int>,
  has-specimens  : memo<bool>,
  board-status   : memo<string>
)

fun initial-specimens() : list<specimen>
  [ Specimen(17,"Continuation","runtime",0)
  , Specimen(31,"Structural owner","lifetime",0)
  , Specimen(42,"DOM range","renderer",0)
  ]

fun create-specimen-model(root)
  val specimens = signal(root,initial-specimens())
  val next-id = signal(root,57)
  val specimen-count = derive(root,3,fn() specimens.get.length)
  val has-specimens = derive(root,True,fn() specimen-count.get > 0)
  val board-status = derive(root,"THREE LIVE IDENTITIES",fn()
    val count = specimen-count.get
    if count == 0 then "THE BENCH IS EMPTY"
    elif count == 1 then "ONE LIVE IDENTITY"
    else count.show ++ " LIVE IDENTITIES"
  )
  Specimen-model(specimens,next-id,specimen-count,has-specimens,board-status)

fun remove-specimen(items : list<specimen>, identity : int) : list<specimen>
  items.filter(fn(item) specimen/id(item) != identity)

fun revise-specimen(items : list<specimen>, identity : int) : list<specimen>
  items.map fn(item)
    if specimen/id(item) != identity then item
    else Specimen(
      specimen/id(item),specimen/name(item),specimen/family(item),
      specimen/revision(item) + 1
    )

fun family-for(identity : int) : string
  match identity % 3
    0 -> "scheduler"
    1 -> "control"
    _ -> "ownership"

fun prepend-specimen(root, model : specimen-model)
  batch(root)
    val identity = model.next-id.get
    model.next-id.set(identity + 1)
    model.specimens.modify(fn(items)
      Cons(
        Specimen(identity,"Draft " ++ identity.show,
                 family-for(identity),0),
        items
      )
    )

fun reset-specimens(root, model : specimen-model)
  batch(root)
    model.specimens.set(initial-specimens())
    model.next-id.set(57)

fun specimen-row(model : specimen-model,
                 item : accessor<specimen>, index : accessor<int>)
  li(attrs=[class("specimen-row")])
    div(attrs=[class("identity-rail"),aria("hidden","true")])
      span(attrs=[class("position-mark")])
        text { (index() + 1).show }
      span("",attrs=[class("rail-line")])

    div(attrs=[class("specimen-card")])
      header(attrs=[class("specimen-heading")])
        div
          p(attrs=[class("identity-label")])
            text { "STABLE KEY / " ++ specimen/id(item()).show }
          h2
            text { specimen/name(item()) }
        span(attrs=[class("family-chip")])
          text { specimen/family(item()) }

      div(attrs=[class("specimen-readout")])
        div
          span("CURRENT INDEX")
          strong
            text { index().show }
        div
          span("ITEM REVISION")
          strong
            text { specimen/revision(item()).show }

      label(attrs=[class("local-note")])
        span("LOCAL DOM NOTE")
        input(attrs=[
          kind("text"),
          placeholder("Type here, then move this row"),
          attr("autocomplete","off")
        ])
        p("This field is uncontrolled: its value stays with the retained DOM node.")

      div(attrs=[class("row-actions")])
        button("Revise same key",attrs=[
          class("row-button"),kind("button"),
          on("click",fn(_)
            val identity = specimen/id(item())
            model.specimens.modify(fn(items)
              revise-specimen(items,identity)
            )
          )
        ])
        button("Delete row",attrs=[
          class("row-button row-button--danger"),kind("button"),
          on("click",fn(_)
            val identity = specimen/id(item())
            model.specimens.modify(fn(items)
              remove-specimen(items,identity)
            )
          )
        ])

fun keyed-page(root, model : specimen-model)
  view
    main-tag(attrs=[class("keyed-shell")])
      header(attrs=[class("page-header")])
        div(attrs=[class("wordmark")])
          span("K")
          p("KOKAINE / KEYED SPECIMEN BENCH")
        div(attrs=[class("headline-block")])
          h1
            text("Move the row.\nKeep the identity.")
          p(
            "Keyed For reconciles position without rebuilding the row. Type in a local note, then reverse or prepend: focus, input value, listeners, and row-owned reactive work travel together.",
            attrs=[class("lede")]
          )

      section(attrs=[class("control-deck"),aria("label","Collection controls")])
        div(attrs=[class("status-cell")])
          span("BRANCH / COLLECTION STATUS")
          branch(model.board-status) fn(status)
            strong
              text(status)
        div(attrs=[class("deck-actions")])
          button("Prepend identity",attrs=[
            id("keyed-prepend"),class("deck-button deck-button--primary"),
            kind("button"),on("click",fn(_) prepend-specimen(root,model))
          ])
          button("Reverse order",attrs=[
            id("keyed-reverse"),class("deck-button"),kind("button"),
            on-click(fn(_)
              model.specimens.modify(fn(items) items.reverse)
            )
          ])
          button("Clear bench",attrs=[
            id("keyed-clear"),class("deck-button"),kind("button"),
            on-click(fn(_) model.specimens.set([]))
          ])
          button("Reset",attrs=[
            id("keyed-reset"),class("deck-button"),kind("button"),
            on("click",fn(_) reset-specimens(root,model))
          ])

      div(attrs=[class("bench-caption")])
        p("POSITION IS REACTIVE")
        p("KEY IS STRUCTURAL")
        p("LOCAL STATE IS RETAINED")

      when(
        model.has-specimens,
        fn()
          ol(attrs=[id("keyed-list"),class("specimen-list")])
            for(
              fn() model.specimens.get,
              fn(item) specimen/id(item)
            ) fn(item,index)
              specimen-row(model,item,index)
        ,fallback=fn()
          section(attrs=[id("keyed-empty"),class("empty-bench")])
            p("NO LIVE ROW OWNERS",attrs=[class("empty-label")])
            h2("The bench is clear.")
            p("Reset the specimens or prepend a new identity to create a fresh keyed row.")
      )

      footer(attrs=[class("page-footer")])
        p("LIST + VECTOR WALKERS / BALANCED KEY INDEX / TRANSACTIONAL DOM MOVES")
        p("Open the source at examples/keyed.kk")

pub fun main()
  val (root,model) = create-root fn(root)
    create-specimen-model(root)
  val page = keyed-page(root,model)
  val dispose = mount(root,query("#app"),page)
  ()
