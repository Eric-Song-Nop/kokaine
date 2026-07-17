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

// A retained browser callback can use only capabilities which the DOM adapter
// explicitly reinstalls at the later host turn. In particular this row is not
// open: a lexical application handler surrounding `mount` has already returned
// when JavaScript delivers an event and cannot safely be reconstructed.
//
// `pure` includes Koka's modeled `exn`/`div`: the event boundary reports an
// uncaught Koka exception and still unwinds its reactive batch. Native throws
// from an extern declared only as `ui` violate that extern's effect contract;
// adapters must translate them at the innermost FFI boundary (as DOM does).
pub alias callback-effect = <signal-read,signal-write,ui,pure>
pub alias callback = (ev : event) -> callback-effect ()

pub type property-value
  String-property(value : string)
  Bool-property(value : bool)
  Int-property(value : int)

// Native top-layer attributes use closed vocabularies so ordinary call sites
// cannot accidentally emit unsupported modes or actions. The low-level `attr`
// escape hatch remains available for future platform additions.
pub type popover-mode
  Popover-auto
  Popover-manual
  Popover-hint

pub type popover-target-action
  Popover-toggle
  Popover-show
  Popover-hide

pub type dialog-close-policy
  Dialog-close-any
  Dialog-close-request
  Dialog-close-explicit

pub type attribute<e::E>
  Attribute(name : string, value : string)
  Boolean-attribute(name : string, enabled : bool)
  Property(name : string, value : property-value)
  Live-attribute(name : string, read : () -> signal-read maybe<string>)
  Live-property(name : string, read : () -> signal-read property-value)
  Listener(name : string, action : callback)


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

pub fun void/element-empty(name : string,
                           attrs : list<attribute<e>> = []) : html<e> ()
  emit(Element(name,attrs,[]))

pub fun fragment(children : () -> <html<e>|p> ()) : <html<e>|p> ()
  nested(Fragment,children)

pub fun text(content : string) : html<e> ()
  emit(Text(content))

// Static overloading lets static and live text share the plain `text` name.
pub fun live/text(read : () -> signal-read string) : html<e> ()
  emit(Live-text(read))

fun emit-region(read : () -> signal-read view<e>) : html<e> ()
  emit(Region(read))

// Dynamic structure reads signals and rebuilds just this region.
pub fun dynamic(children : () -> <html<e>,signal-read> ()) : html<e> ()
  emit-region(fn() view(children))

pub fun trusted(content : trusted-html) : html<e> ()
  emit(Raw-html(content))


// --------------------------------------------------------------------------
// Attribute vocabulary
// --------------------------------------------------------------------------

pub fun attr(name : string, value : string) : attribute<e>
  Attribute(name,value)

pub fun attr-if(name : string, enabled : bool) : attribute<e>
  Boolean-attribute(name,enabled)

pub fun live/attr(name : string,
                  read : () -> signal-read maybe<string>) : attribute<e>
  Live-attribute(name,read)

pub fun live-string/attr(name : string,
                         read : () -> signal-read string) : attribute<e>
  Live-attribute(name,fn() Just(read()))

pub fun prop(name : string, value : property-value) : attribute<e>
  Property(name,value)

pub fun live/prop(name : string,
                  read : () -> signal-read property-value) : attribute<e>
  Live-property(name,read)

pub fun string-property(value : string) : property-value
  String-property(value)

pub fun bool-property(value : bool) : property-value
  Bool-property(value)

pub fun int-property(value : int) : property-value
  Int-property(value)

// Closed event handlers may read/write signals and use the explicitly supported
// DOM and Koka exception capabilities. Other effects must be handled inside
// `action`.
pub fun on(name : string, action : callback) : attribute<e>
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
pub fun live/id(read : () -> signal-read string) : attribute<e>
  Live-attribute("id",fn() Just(read()))
pub fun class(value : string) : attribute<e>
  attr("class",value)
pub fun live/class(read : () -> signal-read string) : attribute<e>
  Live-attribute("class",fn() Just(read()))
pub fun title(value : string) : attribute<e>
  attr("title",value)
pub fun live/title(read : () -> signal-read string) : attribute<e>
  Live-attribute("title",fn() Just(read()))
pub fun href(value : string) : attribute<e>
  attr("href",value)
pub fun live/href(read : () -> signal-read string) : attribute<e>
  Live-attribute("href",fn() Just(read()))
pub fun kind(value : string) : attribute<e>
  attr("type",value)
pub fun live/kind(read : () -> signal-read string) : attribute<e>
  Live-attribute("type",fn() Just(read()))
pub fun name(value : string) : attribute<e>
  attr("name",value)
pub fun live/name(read : () -> signal-read string) : attribute<e>
  Live-attribute("name",fn() Just(read()))
pub fun placeholder(value : string) : attribute<e>
  attr("placeholder",value)
pub fun live/placeholder(read : () -> signal-read string) : attribute<e>
  Live-attribute("placeholder",fn() Just(read()))
pub fun role(value : string) : attribute<e>
  attr("role",value)
pub fun live/role(read : () -> signal-read string) : attribute<e>
  Live-attribute("role",fn() Just(read()))
pub fun aria(label : string, value : string) : attribute<e>
  attr("aria-" ++ label,value)
pub fun live/aria(label : string,
                  read : () -> signal-read string) : attribute<e>
  Live-attribute("aria-" ++ label,fn() Just(read()))
pub fun data(label : string, value : string) : attribute<e>
  attr("data-" ++ label,value)
pub fun live/data(label : string,
                  read : () -> signal-read string) : attribute<e>
  Live-attribute("data-" ++ label,fn() Just(read()))

pub fun value(value : string) : attribute<e>
  prop("value",String-property(value))

pub fun live/value(read : () -> signal-read string) : attribute<e>
  Live-property("value",fn() String-property(read()))

pub fun checked(value : bool) : attribute<e>
  prop("checked",Bool-property(value))

pub fun live/checked(read : () -> signal-read bool) : attribute<e>
  Live-property("checked",fn() Bool-property(read()))

pub fun disabled(value : bool) : attribute<e>
  attr-if("disabled",value)

pub fun live/disabled(read : () -> signal-read bool) : attribute<e>
  Live-attribute("disabled",fn() if read() then Just("") else Nothing)

pub fun popover(mode : popover-mode = Popover-auto) : attribute<e>
  val value = match mode
    Popover-auto -> "auto"
    Popover-manual -> "manual"
    Popover-hint -> "hint"
  attr("popover",value)

pub fun popover-target(id : string) : attribute<e>
  attr("popovertarget",id)

pub fun popover-target-action(action : popover-target-action) : attribute<e>
  val value = match action
    Popover-toggle -> "toggle"
    Popover-show -> "show"
    Popover-hide -> "hide"
  attr("popovertargetaction",value)

// A form with this method closes its containing dialog without navigation.
pub fun dialog-form-method() : attribute<e>
  attr("method","dialog")

pub fun autofocus() : attribute<e>
  attr-if("autofocus",True)

pub fun dialog-closed-by(policy : dialog-close-policy) : attribute<e>
  val value = match policy
    Dialog-close-any -> "any"
    Dialog-close-request -> "closerequest"
    Dialog-close-explicit -> "none"
  attr("closedby",value)

pub fun on-click(action : (event) -> signal-write ()) : attribute<e>
  on-write("click",action)

pub fun on-input(action : (string) -> signal-write ()) : attribute<e>
  on-write("input",fn(ev) action(ev.value))

pub fun on-change(action : (event) -> signal-write ()) : attribute<e>
  on-write("change",action)


// --------------------------------------------------------------------------
// Indentation-first elements
// --------------------------------------------------------------------------

pub fun block/element(name : string,
                      children : () -> <html<e>|p> (),
                      attrs : list<attribute<e>> = []) : <html<e>|p> ()
  container-tag(name,attrs,children)

pub fun string/element(name : string, content : string,
                       attrs : list<attribute<e>> = []) : html<e> ()
  text-tag(name,content,attrs)

pub fun block/div(children : () -> <html<e>|p> (),
                  attrs : list<attribute<e>> = []) : <html<e>|p> ()
  container-tag("div",attrs,children)
pub fun string/div(content : string,
                   attrs : list<attribute<e>> = []) : html<e> ()
  text-tag("div",content,attrs)

pub fun block/span(children : () -> <html<e>|p> (),
                   attrs : list<attribute<e>> = []) : <html<e>|p> ()
  container-tag("span",attrs,children)
pub fun string/span(content : string,
                    attrs : list<attribute<e>> = []) : html<e> ()
  text-tag("span",content,attrs)

pub fun block/main-tag(children : () -> <html<e>|p> (),
                       attrs : list<attribute<e>> = []) : <html<e>|p> ()
  container-tag("main",attrs,children)
pub fun string/main-tag(content : string,
                        attrs : list<attribute<e>> = []) : html<e> ()
  text-tag("main",content,attrs)

pub fun block/section(children : () -> <html<e>|p> (),
                      attrs : list<attribute<e>> = []) : <html<e>|p> ()
  container-tag("section",attrs,children)
pub fun string/section(content : string,
                       attrs : list<attribute<e>> = []) : html<e> ()
  text-tag("section",content,attrs)

pub fun block/header(children : () -> <html<e>|p> (),
                     attrs : list<attribute<e>> = []) : <html<e>|p> ()
  container-tag("header",attrs,children)
pub fun string/header(content : string,
                      attrs : list<attribute<e>> = []) : html<e> ()
  text-tag("header",content,attrs)

pub fun block/footer(children : () -> <html<e>|p> (),
                     attrs : list<attribute<e>> = []) : <html<e>|p> ()
  container-tag("footer",attrs,children)
pub fun string/footer(content : string,
                      attrs : list<attribute<e>> = []) : html<e> ()
  text-tag("footer",content,attrs)

pub fun block/h1(children : () -> <html<e>|p> (),
                 attrs : list<attribute<e>> = []) : <html<e>|p> ()
  container-tag("h1",attrs,children)
pub fun string/h1(content : string,
                  attrs : list<attribute<e>> = []) : html<e> ()
  text-tag("h1",content,attrs)

pub fun block/h2(children : () -> <html<e>|p> (),
                 attrs : list<attribute<e>> = []) : <html<e>|p> ()
  container-tag("h2",attrs,children)
pub fun string/h2(content : string,
                  attrs : list<attribute<e>> = []) : html<e> ()
  text-tag("h2",content,attrs)

pub fun block/p(children : () -> <html<e>|p> (),
                attrs : list<attribute<e>> = []) : <html<e>|p> ()
  container-tag("p",attrs,children)
pub fun string/p(content : string,
                 attrs : list<attribute<e>> = []) : html<e> ()
  text-tag("p",content,attrs)

pub fun block/strong(children : () -> <html<e>|p> (),
                     attrs : list<attribute<e>> = []) : <html<e>|p> ()
  container-tag("strong",attrs,children)
pub fun string/strong(content : string,
                      attrs : list<attribute<e>> = []) : html<e> ()
  text-tag("strong",content,attrs)

pub fun block/ul(children : () -> <html<e>|p> (),
                 attrs : list<attribute<e>> = []) : <html<e>|p> ()
  container-tag("ul",attrs,children)
pub fun string/ul(content : string,
                  attrs : list<attribute<e>> = []) : html<e> ()
  text-tag("ul",content,attrs)

pub fun block/ol(children : () -> <html<e>|p> (),
                 attrs : list<attribute<e>> = []) : <html<e>|p> ()
  container-tag("ol",attrs,children)
pub fun string/ol(content : string,
                  attrs : list<attribute<e>> = []) : html<e> ()
  text-tag("ol",content,attrs)

pub fun block/li(children : () -> <html<e>|p> (),
                 attrs : list<attribute<e>> = []) : <html<e>|p> ()
  container-tag("li",attrs,children)
pub fun string/li(content : string,
                  attrs : list<attribute<e>> = []) : html<e> ()
  text-tag("li",content,attrs)

pub fun block/button(children : () -> <html<e>|p> (),
                     attrs : list<attribute<e>> = []) : <html<e>|p> ()
  container-tag("button",attrs,children)
pub fun string/button(content : string,
                      attrs : list<attribute<e>> = []) : html<e> ()
  text-tag("button",content,attrs)

pub fun block/dialog(children : () -> <html<e>|p> (),
                     attrs : list<attribute<e>> = []) : <html<e>|p> ()
  container-tag("dialog",attrs,children)
pub fun string/dialog(content : string,
                      attrs : list<attribute<e>> = []) : html<e> ()
  text-tag("dialog",content,attrs)

pub fun block/label(children : () -> <html<e>|p> (),
                    attrs : list<attribute<e>> = []) : <html<e>|p> ()
  container-tag("label",attrs,children)
pub fun string/label(content : string,
                     attrs : list<attribute<e>> = []) : html<e> ()
  text-tag("label",content,attrs)

pub fun block/a(children : () -> <html<e>|p> (),
                attrs : list<attribute<e>> = []) : <html<e>|p> ()
  container-tag("a",attrs,children)
pub fun string/a(content : string,
                 attrs : list<attribute<e>> = []) : html<e> ()
  text-tag("a",content,attrs)

pub fun void/input(attrs : list<attribute<e>> = []) : html<e> ()
  emit(Element("input",attrs,[]))

pub fun void/hr(attrs : list<attribute<e>> = []) : html<e> ()
  emit(Element("hr",attrs,[]))

pub fun void/br(attrs : list<attribute<e>> = []) : html<e> ()
  emit(Element("br",attrs,[]))
