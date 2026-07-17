/*--------------------------------------------------------------------------
  Deterministic string rendering for tests, snapshots, and server output.

  Ordinary text and attribute values are escaped. Raw markup can only enter
  through `unsafe-trusted-html`, making the trust boundary explicit.
--------------------------------------------------------------------------*/
module kokaine/ssr

import kokaine/reactive
import kokaine/html
import kokaine/internal/key-index
import std/core/unsafe


fun render-cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun render-load(value : ref<global,a>) : a
  unsafe-total { !value }

fun render-store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }


fun escape-text(value : string) : string
  value
    .replace-all("&","&amp;")
    .replace-all("<","&lt;")
    .replace-all(">","&gt;")

fun escape-attribute(value : string) : string
  value.escape-text
    .replace-all("\"","&quot;")
    .replace-all("'","&#39;")

fun checked-element-name(name : string) : exn string
  if name.is-valid-element-name then name
  else throw("invalid HTML element name: " ++ name)

fun checked-attribute-name(name : string) : exn string
  if name.is-valid-attribute-name then name
  else throw("invalid HTML attribute name: " ++ name)

fun checked-event-name(name : string) : exn string
  if name.is-valid-event-name then name
  else throw("invalid DOM event name: " ++ name)

fun checked-property-name(name : string) : exn string
  if name.is-valid-property-name then name
  else throw("invalid or markup-writing DOM property: " ++ name)

fun string-attribute(name : string, value : string) : exn string
  " " ++ checked-attribute-name(name) ++ "=\"" ++
  value.escape-attribute ++ "\""

fun boolean-attribute(name : string, enabled : bool) : exn string
  if enabled then " " ++ checked-attribute-name(name) else ""

fun property-attribute(name : string, value : property-value) : exn string
  val safe-name = checked-property-name(name)
  match value
    String-property(content) -> string-attribute(safe-name,content)
    Bool-property(enabled) -> boolean-attribute(safe-name,enabled)
    Int-property(number) -> string-attribute(safe-name,number.show)

fun render-attribute(attribute : attribute<e>) : <signal-read,pure> string
  match attribute
    Attribute(name,value) -> string-attribute(name,value)
    Boolean-attribute(name,enabled) -> boolean-attribute(name,enabled)
    Property(name,value) -> property-attribute(name,value)
    Live-attribute(name,read) ->
      match read()
        Nothing -> ""
        Just(value) -> string-attribute(name,value)
    Live-property(name,read) -> property-attribute(name,read())
    Listener(name,_) ->
      // Listeners never serialize as inline JavaScript. Still validate their
      // event name so SSR catches the same malformed view as the DOM adapter.
      checked-event-name(name)
      ""

fun render-attributes(attributes : list<attribute<e>>)
                     : <signal-read,pure> string
  attributes.map(render-attribute).join("")

fun is-void-element(name : string) : bool
  match name.to-lower
    "area" -> True
    "base" -> True
    "br" -> True
    "col" -> True
    "embed" -> True
    "hr" -> True
    "img" -> True
    "input" -> True
    "link" -> True
    "meta" -> True
    "param" -> True
    "source" -> True
    "track" -> True
    "wbr" -> True
    _ -> False

fun render-children(children : list<view<e>>) : <signal-read,pure> string
  children.map(render-view).join("")

fun render-keyed-fields<s,a,k,e::E>(
      read : () -> signal-read s,
      walk : forall<p::E> (s,(a) -> p ()) -> p (),
      key : (a) -> k, compare : (k,k) -> order,
      children : (accessor<a>,accessor<int>)
                 -> <html<e>,signal-read> ())
    : <signal-read,pure> string
  val keys = render-cell(kokaine/internal/key-index/empty())
  val output = render-cell([])
  val position = render-cell(0)
  val snapshot = read()
  walk(snapshot) fn(item)
    val identity = key(item)
    match render-load(keys).insert(identity,(),compare)
      Duplicate(_) -> throw("duplicate key in keyed For")
      Inserted(next) -> render-store(keys,next)
    val current = render-load(position)
    render-store(position,current + 1)
    val row = view fn()
      children(fn() item,fn() current)
    render-store(output,Cons(render-view(row),render-load(output)))
  render-load(output).reverse.join("")

fun render-keyed(plan : keyed-plan<e>) : <signal-read,pure> string
  match plan
    Keyed-plan(spec) ->
      match spec
        Keyed-spec(read,walk,key,compare,_,children) ->
          render-keyed-fields(read,walk,key,compare,children)

fun render-view(node : view<e>) : <signal-read,pure> string
  match node
    Empty -> ""
    Text(content) -> content.escape-text
    Live-text(read) -> read().escape-text
    Fragment(children) -> render-children(children)
    Region(read) -> render-view(read())
    Keyed-region(plan) -> render-keyed(plan)
    Raw-html(content) -> trusted-content(content)
    Element(name,attributes,children) ->
      val safe-name = checked-element-name(name)
      val opening = "<" ++ safe-name ++ render-attributes(attributes) ++ ">"
      if safe-name.is-void-element then opening
      else opening ++ render-children(children) ++ "</" ++ safe-name ++ ">"

pub fun render(root : root<e>, node : view<e>) : <exn|e> string
  sample(root,fn() render-view(node))
