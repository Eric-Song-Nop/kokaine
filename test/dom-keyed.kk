module dom-keyed

import kokaine/reactive
import kokaine/html
import kokaine/control
import kokaine/dom


value struct tag-data(tag-id : int, tag-label : string)

value struct item-data(item-id : int, item-label : string,
                       item-tags : list<tag-data>)

value struct keyed-model(
  items-source : signal<list<item-data>>,
  pulse-source : signal<int>,
  clicks-source : signal<int>,
  runs-source : signal<int>,
  cleanups-source : signal<int>,
  visible-source : signal<bool>,
  mode-source : signal<bool>,
  visible : memo<bool>,
  compact : memo<bool>)

fun tag-data/(==)(left : tag-data, right : tag-data) : bool
  left.tag-id == right.tag-id && left.tag-label == right.tag-label

fun item-data/(==)(left : item-data, right : item-data) : bool
  left.item-id == right.item-id &&
  left.item-label == right.item-label &&
  left.item-tags == right.item-tags

fun item(identity : int, label : string,
         tags : list<tag-data> = []) : item-data
  Item-data(identity,label,tags)

fun tag(identity : int, label : string) : tag-data
  Tag-data(identity,label)

fun initial-items() : list<item-data>
  [ item(1,"alpha",[tag(11,"one")])
  , item(2,"beta",[tag(21,"red"),tag(22,"blue")])
  , item(3,"gamma",[tag(31,"three")])
  ]

fun prepended-items() : list<item-data>
  Cons(item(0,"zero"),initial-items())

fun appended-items() : list<item-data>
  prepended-items() ++ [item(4,"delta")]

fun inserted-items() : list<item-data>
  [ item(0,"zero")
  , item(1,"alpha",[tag(11,"one")])
  , item(5,"middle")
  , item(2,"beta",[tag(21,"red"),tag(22,"blue")])
  , item(3,"gamma",[tag(31,"three")])
  , item(4,"delta")
  ]

fun deleted-items() : list<item-data>
  [ item(0,"zero")
  , item(1,"alpha",[tag(11,"one")])
  , item(5,"middle")
  , item(2,"beta",[tag(21,"red"),tag(22,"blue")])
  , item(4,"delta")
  ]

fun reversed-items() : list<item-data>
  deleted-items().reverse

fun permuted-items() : list<item-data>
  [ item(2,"beta",[tag(21,"red"),tag(22,"blue")])
  , item(0,"zero")
  , item(4,"delta")
  , item(1,"alpha",[tag(11,"one")])
  , item(5,"middle")
  ]

fun updated-items() : list<item-data>
  [ item(2,"BETA",[tag(22,"BLUE"),tag(21,"RED"),tag(23,"green")])
  , item(0,"zero")
  , item(4,"delta")
  , item(1,"alpha",[tag(11,"one")])
  , item(5,"middle")
  ]

extern publish-main-actions(
  prepend : () -> ui bool,
  append : () -> ui bool,
  insert-middle : () -> ui bool,
  delete-middle : () -> ui bool,
  reverse : () -> ui bool,
  permute : () -> ui bool,
  update-item : () -> ui bool,
  toggle-mode : () -> ui bool,
  hide : () -> ui bool) : ui ()
  js inline "(globalThis.__kokaineKeyed = { prepend:#1, append:#2, insertMiddle:#3, deleteMiddle:#4, reverse:#5, permute:#6, updateItem:#7, toggleMode:#8, hide:#9 })"

extern publish-main-rest(
  show : () -> ui bool,
  pulse : () -> ui bool,
  read-clicks : () -> ui int,
  read-runs : () -> ui int,
  read-cleanups : () -> ui int,
  dispose : () -> ui ()) : ui ()
  js inline "Object.assign(globalThis.__kokaineKeyed, { show:#1, pulse:#2, readClicks:#3, readRuns:#4, readCleanups:#5, dispose:#6 })"

extern publish-faults(
  duplicate : () -> ui bool,
  duplicate-reset : () -> ui bool,
  move : () -> ui bool,
  move-reset : () -> ui bool,
  bootstrap : () -> ui bool,
  bootstrap-reset : () -> ui bool) : ui ()
  js inline "Object.assign(globalThis.__kokaineKeyed, { duplicate:#1, duplicateReset:#2, move:#3, moveReset:#4, bootstrap:#5, bootstrapReset:#6 })"

fun safe-set(root : root<<ui>>, source : signal<list<item-data>>,
             next : list<item-data>) : ui bool
  with catch fn(_)
    False
  update(root){ source.set(next) }
  True

fun safe-set-bool(root : root<<ui>>, source : signal<bool>,
                  next : bool) : ui bool
  with catch fn(_)
    False
  update(root){ source.set(next) }
  True

fun safe-toggle(root : root<<ui>>, source : signal<bool>) : ui bool
  with catch fn(_)
    False
  update(root){ source.modify(fn(value) !value) }
  True

fun safe-increment(root : root<<ui>>, source : signal<int>) : ui bool
  with catch fn(_)
    False
  update(root){ source.modify(fn(value) value + 1) }
  True

fun safe-read(root : root<<ui>>, source : signal<int>) : ui int
  with catch fn(_)
    -999
  sample(root){ source.get }

fun safe-dispose(root : root<<ui>>) : ui ()
  with catch fn(_) ()
  root.dispose()

fun main-row(root : root<<ui>>, pulse : signal<int>, clicks : signal<int>,
             runs : signal<int>, cleanups : signal<int>, compact : memo<bool>,
             current : accessor<item-data>, position : accessor<int>)
            : <html<total>,signal-read> ()
  val initial = current()
  val identity = initial.item-id
  li(attrs=[id("keyed-row-" ++ identity.show),
            data("key",identity.show)])
    span(attrs=[class("keyed-index")])
      text { position().show }
    span(attrs=[class("keyed-label")])
      text { current().item-label }
    element-empty("input",attrs=[
      id("keyed-input-" ++ identity.show),
      kind("text"),
      value("seed-" ++ identity.show)
    ])
    button("hit",attrs=[
      id("keyed-hit-" ++ identity.show),
      kind("button"),
      on-click(fn(_) clicks.modify(fn(value) value + 1))
    ])
    button("arm",attrs=[
      id("keyed-arm-" ++ identity.show),
      kind("button"),
      on("click",fn(_)
        val row-effect = create-effect(root,fn() pulse.get,fn(_)
          runs.modify(fn(value) value + 1)
          on-cleanup(root,fn()
            cleanups.modify(fn(value) value + 1)
          )
        )
        ()
      )
    ])
    branch(compact) fn(is-compact)
      span(if is-compact then "compact" else "expanded",
           attrs=[class("keyed-mode")])
    ul(attrs=[class("keyed-tags")])
      for(fn() current().item-tags,fn(value) value.tag-id) fn(value,index)
        val first = value()
        li(attrs=[id("keyed-tag-" ++ identity.show ++ "-" ++
                     first.tag-id.show),
                  data("tag",first.tag-id.show)])
          text { index().show ++ ":" ++ value().tag-label }

fun main-page(root : root<<ui>>, source : signal<list<item-data>>,
              pulse : signal<int>, clicks : signal<int>, runs : signal<int>,
              cleanups : signal<int>, visible : memo<bool>,
              compact : memo<bool>) : view<total>
  view
    div(attrs=[id("keyed-main-fixture")])
      when(visible,
        fn()
          ul(attrs=[id("keyed-main-list")])
            for(fn() source.get,fn(value) value.item-id) fn(current,position)
              main-row(root,pulse,clicks,runs,cleanups,compact,
                       current,position)
        ,fallback=fn() p("hidden",attrs=[id("keyed-hidden")]))

fun simple-page(source : signal<list<item-data>>, list-id : string,
                row-prefix : string) : view<total>
  view
    ul(attrs=[id(list-id)])
      for(fn() source.get,fn(value) value.item-id) fn(current,index)
        val initial = current()
        li(attrs=[id(row-prefix ++ initial.item-id.show),
                  data("key",initial.item-id.show)])
          text { index().show ++ ":" ++ current().item-label }

fun bootstrap-page(source : signal<list<item-data>>) : view<total>
  view
    div(attrs=[id("keyed-bootstrap-list")])
      for(fn() source.get,fn(value) value.item-id) fn(current,_)
        element-empty("x-kokaine-keyed-fail",attrs=[
          id("keyed-bootstrap-target"),
          Live-property("boom",fn() {
            String-property(current().item-label)
          })
        ])

pub fun main()
  val (root,model) = create-root fn(root)
    val source = signal(root,initial-items())
    val pulse = signal(root,0)
    val clicks = signal(root,0)
    val runs = signal(root,0)
    val cleanups = signal(root,0)
    val visible-source = signal(root,True)
    val mode-source = signal(root,False)
    val visible = derive(root,True,fn() visible-source.get)
    val compact = derive(root,False,fn() mode-source.get)
    Keyed-model(source,pulse,clicks,runs,cleanups,visible-source,mode-source,
                visible,compact)

  val source = model.items-source
  val pulse = model.pulse-source
  val clicks = model.clicks-source
  val runs = model.runs-source
  val cleanups = model.cleanups-source
  val visible-source = model.visible-source
  val mode-source = model.mode-source
  val visible = model.visible
  val compact = model.compact

  val dispose = mount(root,query("#keyed-main-root"),
    main-page(root,source,pulse,clicks,runs,cleanups,visible,compact))

  val (duplicate-root,duplicate-source) = create-root fn(current-root)
    signal(current-root,[item(1,"one"),item(2,"two")])
  val duplicate-dispose = mount(
    duplicate-root,query("#keyed-duplicate-root"),
    simple-page(duplicate-source,"keyed-duplicate-list","keyed-duplicate-row-"))

  val (move-root,move-source) = create-root fn(current-root)
    signal(current-root,[item(1,"one"),item(2,"two"),item(3,"three")])
  val move-dispose = mount(
    move-root,query("#keyed-move-root"),
    simple-page(move-source,"keyed-move-list","keyed-move-row-"))

  val (bootstrap-root,bootstrap-source) = create-root fn(current-root)
    val empty : list<item-data> = []
    signal(current-root,empty)
  val bootstrap-dispose = mount(
    bootstrap-root,query("#keyed-bootstrap-root"),
    bootstrap-page(bootstrap-source))

  publish-main-actions(
    fn() safe-set(root,source,prepended-items()),
    fn() safe-set(root,source,appended-items()),
    fn() safe-set(root,source,inserted-items()),
    fn() safe-set(root,source,deleted-items()),
    fn() safe-set(root,source,reversed-items()),
    fn() safe-set(root,source,permuted-items()),
    fn() safe-set(root,source,updated-items()),
    fn() safe-toggle(root,mode-source),
    fn() safe-set-bool(root,visible-source,False)
  )
  publish-main-rest(
    fn() safe-set-bool(root,visible-source,True),
    fn() safe-increment(root,pulse),
    fn() safe-read(root,clicks),
    fn() safe-read(root,runs),
    fn() safe-read(root,cleanups),
    fn() {
      safe-dispose(root)
      safe-dispose(duplicate-root)
      safe-dispose(move-root)
      safe-dispose(bootstrap-root)
    }
  )
  publish-faults(
    fn() safe-set(duplicate-root,duplicate-source,
      [item(1,"one"),item(1,"duplicate")]),
    fn() safe-set(duplicate-root,duplicate-source,
      [item(1,"one"),item(2,"two")]),
    fn() safe-set(move-root,move-source,
      [item(3,"three"),item(1,"one"),item(2,"two")]),
    fn() safe-set(move-root,move-source,
      [item(1,"one"),item(2,"two"),item(3,"three")]),
    fn() safe-set(bootstrap-root,bootstrap-source,[item(7,"seven")]),
    fn() safe-set(bootstrap-root,bootstrap-source,[])
  )
