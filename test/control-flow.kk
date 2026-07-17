module control-flow

import kokaine/reactive
import kokaine/html
import kokaine/control
import kokaine/ssr


type page-state
  Loading
  Failed(message : string)
  Ready(name : string)

value struct todo(id : int, title : string)

fun page-equals(left : page-state, right : page-state) : bool
  match (left,right)
    (Loading,Loading) -> True
    (Failed(a),Failed(b)) -> a == b
    (Ready(a),Ready(b)) -> a == b
    _ -> False

fun todo/(==)(left : todo, right : todo) : bool
  todo/id(left) == todo/id(right) && todo/title(left) == todo/title(right)

fun assert-string(actual : string, expected : string, label : string)
  if actual == expected then () else
    throw(label ++ "\nexpected: " ++ expected ++ "\nactual:   " ++ actual)

fun assert(ok : bool, label : string)
  if ok then () else throw("assertion failed: " ++ label)

pub fun main()
  val initial = [Todo(7,"<write>"),Todo(3,"ship")]
  val (root,((page-source,visible-source,list-source,vector-source),
             (page,visible))) =
    create-root fn(root)
      val page-source = signal-by(root,Loading,page-equals)
      val visible-source = signal(root,False)
      val list-source = signal(root,initial)
      val vector-source = signal-always(root,initial.vector)
      val page = derive-by(root,Loading,fn() page-source.get,page-equals)
      val visible = derive(root,False,fn() visible-source.get)
      ((page-source,visible-source,list-source,vector-source),(page,visible))

  val tree = view
    branch(page) fn(state)
      match state
        Loading -> p("loading",attrs=[id("state")])
        Failed(message) -> p(message,attrs=[id("state")])
        Ready(name) -> p("hello " ++ name,attrs=[id("state")])
    when(visible,
      fn() strong("shown"),
      fallback=fn() span("hidden",attrs=[class("fallback")]))
    ul(attrs=[id("list")])
      for(fn() list-source.get,fn(item) todo/id(item)) fn(item,index)
        li
          text { (index() + 1).show ++ ":" ++ todo/title(item()) }
    ol(attrs=[id("vector")])
      for(fn() vector-source.get,fn(item) todo/id(item)) fn(item,index)
        li
          text { index().show ++ ":" ++ todo/title(item()) }

  render(root,tree).assert-string(
    "<p id=\"state\">loading</p><span class=\"fallback\">hidden</span>" ++
    "<ul id=\"list\"><li>1:&lt;write&gt;</li><li>2:ship</li></ul>" ++
    "<ol id=\"vector\"><li>0:&lt;write&gt;</li><li>1:ship</li></ol>",
    "branch, when, list For, and vector For render one snapshot")

  update(root)
    batch(root)
      page-source.set(Ready("Ada"))
      visible-source.set(True)
      list-source.set(initial.reverse)
      vector-source.set(initial.reverse.vector)

  render(root,tree).assert-string(
    "<p id=\"state\">hello Ada</p><strong>shown</strong>" ++
    "<ul id=\"list\"><li>1:ship</li><li>2:&lt;write&gt;</li></ul>" ++
    "<ol id=\"vector\"><li>0:ship</li><li>1:&lt;write&gt;</li></ol>",
    "control snapshots follow the current values and preserve escaping")

  val list-only = view
    for(fn() list-source.get,fn(item) todo/id(item)) fn(item,index)
      text { index().show ++ ":" ++ todo/title(item()) ++ ";" }
  val vector-only = view
    for(fn() vector-source.get,fn(item) todo/id(item)) fn(item,index)
      text { index().show ++ ":" ++ todo/title(item()) ++ ";" }
  render(root,list-only).assert-string(
    render(root,vector-only),
    "list and vector walkers produce the same ordered snapshot")

  val empty : list<todo> = []
  val singleton = [Todo(9,"one & only")]
  val edge-cases = view
    div(attrs=[id("empty")])
      for(fn() empty,fn(item) todo/id(item)) fn(item,_)
        text { todo/title(item()) }
    div(attrs=[id("singleton")])
      for(fn() singleton,fn(item) todo/id(item)) fn(item,index)
        text { index().show ++ ":" ++ todo/title(item()) }
    section(attrs=[id("nested")])
      when(visible,fallback=fn() text("nested-hidden"))
        branch(page) fn(state)
          match state
            Ready(name) -> text("nested " ++ name)
            _ -> text("nested pending")
  render(root,edge-cases).assert-string(
    "<div id=\"empty\"></div>" ++
    "<div id=\"singleton\">0:one &amp; only</div>" ++
    "<section id=\"nested\">nested Ada</section>",
    "empty, singleton, and nested controls render deterministically")

  val duplicate = view
    for(fn() [Todo(1,"a"),Todo(1,"b")],fn(item) todo/id(item)) fn(item,_)
      span
        text { todo/title(item()) }
  val duplicate-result : error<string> = mask<exn>{
    error/try fn() render(root,duplicate)
  }
  assert(duplicate-result.is-error,"SSR rejects duplicate business keys")

  // The standard formatting function remains available beside `when`.
  assert(42.show == "42","control imports do not shadow standard show")
  root.dispose()
  println("control: branch, when, keyed snapshots, and duplicate keys passed")
