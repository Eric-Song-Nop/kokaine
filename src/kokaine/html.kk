/*--------------------------------------------------------------------------
  A backend-neutral HTML vocabulary and effect-handled builder.

  `html<e>` is deliberately a tail-resumptive builder effect. Nested tag
  functions handle only the child emission they delimit, which gives Koka
  ordinary block syntax without a macro or JSX transform.
--------------------------------------------------------------------------*/
module kokaine/html

import kokaine/reactive


// --------------------------------------------------------------------------
// Events and attributes
// --------------------------------------------------------------------------

// Browser adapters snapshot the useful, stable parts of an event before
// entering Koka. `original` remains available for adapter-specific integrations.
pub value struct event(
  value   : string,
  checked : bool,
  key     : string,
  original : any
)

// `ui` is fixed instead of part of `e`: the DOM root already owns one `ui`
// capability, so a full handler can call prevent-default or another browser
// primitive without inferring an invalid duplicate `<ui,ui>` row.
pub alias callback<e> = (ev : event) -> <signal-read,signal-write,ui,pure|e> ()

pub type property-value
  String-property(value : string)
  Bool-property(value : bool)
  Int-property(value : int)

pub type attribute<e::E>
  Attribute(name : string, value : string)
  Boolean-attribute(name : string, enabled : bool)
  Property(name : string, value : property-value)
  Live-attribute(name : string, read : () -> signal-read maybe<string>)
  Live-property(name : string, read : () -> signal-read property-value)
  Listener(name : string, action : callback<e>)


// --------------------------------------------------------------------------
// View description
// --------------------------------------------------------------------------

abstract value type trusted-html
  Trusted-html(content : string)

pub type view<e::E>
  Empty
  Text(content : string)
  Live-text(read : () -> signal-read string)
  Element(name : string,
          attributes : list<attribute<e>>,
          children : list<view<e>>)
  Fragment(children : list<view<e>>)
  Region(read : () -> signal-read view<e>)
  Raw-html(content : trusted-html)

// The name makes the trust boundary visible at every call site. Browser and
// string renderers never interpret ordinary `text` as markup.
pub fun unsafe-trusted-html(content : string) : trusted-html
  Trusted-html(content)

pub fun trusted-content(value : trusted-html) : string
  match value
    Trusted-html(content) -> content

fun is-name-tail-character(char : char) : bool
  char.is-alpha-num || char == '-' || char == '_' || char == '.' || char == ':'

fun begins-with-on(value : string) : bool
  match value.to-lower.list
    Cons('o',Cons('n',_)) -> True
    _ -> False

pub fun is-valid-element-name(value : string) : bool
  match value.list
    Nil -> False
    Cons(first,rest) -> first.is-alpha && rest.all(is-name-tail-character)

// Static `on*` attributes are rejected so executable behavior must cross the
// typed Listener boundary instead of entering as a string.
pub fun is-valid-attribute-name(value : string) : bool
  match value.list
    Nil -> False
    Cons(first,rest) ->
      !begins-with-on(value) &&
      value.to-lower != "srcdoc" &&
      (first.is-alpha || first == '_' || first == ':') &&
      rest.all(is-name-tail-character)

pub fun is-valid-property-name(value : string) : bool
  val lower = value.to-lower
  is-valid-attribute-name(value) &&
  lower != "innerhtml" && lower != "outerhtml" &&
  lower != "insertadjacenthtml"

pub fun is-valid-event-name(value : string) : bool
  match value.list
    Nil -> False
    Cons(first,rest) -> first.is-alpha && rest.all(is-name-tail-character)


// --------------------------------------------------------------------------
// Effect-handled builder
// --------------------------------------------------------------------------

pub effect html<e::E>
  fun emit(node : view<e>) : ()

fun collect(action : () -> <html<e>|p> ()) : p list<view<e>>
  var nodes := []
  with handler
    fun emit(node) nodes := Cons(node,nodes)
    return(_) nodes.reverse
  action()

pub fun view(action : () -> <html<e>|p> ()) : p view<e>
  match collect(action)
    Nil -> Empty
    Cons(node,Nil) -> node
    nodes -> Fragment(nodes)

fun nested(make : list<view<e>> -> view<e>,
           children : () -> <html<e>|p> ()) : <html<e>|p> ()
  var nodes := []
  with override
    fun emit(node)
      nodes := Cons(node,nodes)
    return(_)
      val final-nodes = nodes.reverse
      emit(make(final-nodes))
  children()

fun container-tag(name : string, attributes : list<attribute<e>>,
                  children : () -> <html<e>|p> ()) : <html<e>|p> ()
  nested(fn(nodes) Element(name,attributes,nodes),children)

fun text-tag(name : string, content : string,
             attributes : list<attribute<e>>) : html<e> ()
  emit(Element(name,attributes,[Text(content)]))

pub fun element(name : string, attributes : list<attribute<e>>,
                children : () -> <html<e>|p> ()) : <html<e>|p> ()
  container-tag(name,attributes,children)

pub fun element-empty(name : string,
                      attributes : list<attribute<e>>) : html<e> ()
  emit(Element(name,attributes,[]))

pub fun fragment(children : () -> <html<e>|p> ()) : <html<e>|p> ()
  nested(Fragment,children)

pub fun text(content : string) : html<e> ()
  emit(Text(content))

pub fun text-live(read : () -> signal-read string) : html<e> ()
  emit(Live-text(read))

pub fun region(read : () -> signal-read view<e>) : html<e> ()
  emit(Region(read))

pub fun trusted(content : trusted-html) : html<e> ()
  emit(Raw-html(content))


// --------------------------------------------------------------------------
// Attribute vocabulary
// --------------------------------------------------------------------------

pub fun attr(name : string, value : string) : attribute<e>
  Attribute(name,value)

pub fun attr-if(name : string, enabled : bool) : attribute<e>
  Boolean-attribute(name,enabled)

pub fun attr-live(name : string,
                  read : () -> signal-read maybe<string>) : attribute<e>
  Live-attribute(name,read)

pub fun prop(name : string, value : property-value) : attribute<e>
  Property(name,value)

pub fun prop-live(name : string,
                  read : () -> signal-read property-value) : attribute<e>
  Live-property(name,read)

pub fun string-property(value : string) : property-value
  String-property(value)

pub fun bool-property(value : bool) : property-value
  Bool-property(value)

pub fun int-property(value : int) : property-value
  Int-property(value)

// Full handlers may read and write signals and use the root's host row `e`.
pub fun on(name : string, action : callback<e>) : attribute<e>
  Listener(name,action)

// Most controls only write. This adapter injects the unused read and framework
// failure capabilities so call sites retain the smallest meaningful effect.
pub fun on-write(name : string,
                 action : (event) -> signal-write ()) : attribute<e>
  Listener(name,fn(ev)
    mask<signal-read>{ mask<ui>{ mask<exn>{ mask<div>{ action(ev) } } } }
  )

pub fun id(value : string) : attribute<e>
  attr("id",value)
pub fun class(value : string) : attribute<e>
  attr("class",value)
pub fun title(value : string) : attribute<e>
  attr("title",value)
pub fun href(value : string) : attribute<e>
  attr("href",value)
pub fun kind(value : string) : attribute<e>
  attr("type",value)
pub fun name(value : string) : attribute<e>
  attr("name",value)
pub fun placeholder(value : string) : attribute<e>
  attr("placeholder",value)
pub fun role(value : string) : attribute<e>
  attr("role",value)
pub fun aria(label : string, value : string) : attribute<e>
  attr("aria-" ++ label,value)
pub fun data(label : string, value : string) : attribute<e>
  attr("data-" ++ label,value)

pub fun value(value : string) : attribute<e>
  prop("value",String-property(value))

pub fun value-live(read : () -> signal-read string) : attribute<e>
  prop-live("value",fn() String-property(read()))

pub fun checked(value : bool) : attribute<e>
  prop("checked",Bool-property(value))

pub fun checked-live(read : () -> signal-read bool) : attribute<e>
  prop-live("checked",fn() Bool-property(read()))

pub fun disabled(value : bool) : attribute<e>
  attr-if("disabled",value)

pub fun disabled-live(read : () -> signal-read bool) : attribute<e>
  attr-live("disabled",fn() if read() then Just("") else Nothing)

pub fun on-click(action : (event) -> signal-write ()) : attribute<e>
  on-write("click",action)

pub fun on-input(action : (string) -> signal-write ()) : attribute<e>
  on-write("input",fn(ev) action(ev.value))

pub fun on-change(action : (event) -> signal-write ()) : attribute<e>
  on-write("change",action)


// --------------------------------------------------------------------------
// Common elements
// --------------------------------------------------------------------------

pub fun div(attributes : list<attribute<e>>,
            children : () -> <html<e>|p> ()) : <html<e>|p> ()
  element("div",attributes,children)

pub fun span(attributes : list<attribute<e>>,
             children : () -> <html<e>|p> ()) : <html<e>|p> ()
  element("span",attributes,children)

pub fun main-tag(attributes : list<attribute<e>>,
                 children : () -> <html<e>|p> ()) : <html<e>|p> ()
  element("main",attributes,children)

pub fun section(attributes : list<attribute<e>>,
                children : () -> <html<e>|p> ()) : <html<e>|p> ()
  element("section",attributes,children)

pub fun header(attributes : list<attribute<e>>,
               children : () -> <html<e>|p> ()) : <html<e>|p> ()
  element("header",attributes,children)

pub fun footer(attributes : list<attribute<e>>,
               children : () -> <html<e>|p> ()) : <html<e>|p> ()
  element("footer",attributes,children)

pub fun h1(attributes : list<attribute<e>>,
           children : () -> <html<e>|p> ()) : <html<e>|p> ()
  element("h1",attributes,children)

pub fun h2(attributes : list<attribute<e>>,
           children : () -> <html<e>|p> ()) : <html<e>|p> ()
  element("h2",attributes,children)

pub fun p(attributes : list<attribute<e>>,
          children : () -> <html<e>|p> ()) : <html<e>|p> ()
  element("p",attributes,children)

pub fun strong(attributes : list<attribute<e>>,
               children : () -> <html<e>|p> ()) : <html<e>|p> ()
  element("strong",attributes,children)

pub fun ul(attributes : list<attribute<e>>,
           children : () -> <html<e>|p> ()) : <html<e>|p> ()
  element("ul",attributes,children)

pub fun ol(attributes : list<attribute<e>>,
           children : () -> <html<e>|p> ()) : <html<e>|p> ()
  element("ol",attributes,children)

pub fun li(attributes : list<attribute<e>>,
           children : () -> <html<e>|p> ()) : <html<e>|p> ()
  element("li",attributes,children)

pub fun button(attributes : list<attribute<e>>,
               children : () -> <html<e>|p> ()) : <html<e>|p> ()
  element("button",attributes,children)

pub fun label(attributes : list<attribute<e>>,
              children : () -> <html<e>|p> ()) : <html<e>|p> ()
  element("label",attributes,children)

pub fun a(attributes : list<attribute<e>>,
          children : () -> <html<e>|p> ()) : <html<e>|p> ()
  element("a",attributes,children)

pub fun input(attributes : list<attribute<e>>) : html<e> ()
  element-empty("input",attributes)

pub fun br() : html<e> ()
  element-empty("br",[])

pub fun hr(attributes : list<attribute<e>>) : html<e> ()
  element-empty("hr",attributes)
