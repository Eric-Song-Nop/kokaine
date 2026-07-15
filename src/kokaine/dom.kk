/*--------------------------------------------------------------------------
  Fine-grained browser DOM adapter for Koka's `jsweb` backend.

  Browser values are one-field wrappers around `any`; these erase to the raw
  JavaScript object. Every persistent listener and DOM range is attached to
  the continuation generation which created it and retires with that extent.
--------------------------------------------------------------------------*/
module kokaine/dom

import kokaine/reactive
import kokaine/html


// --------------------------------------------------------------------------
// Opaque browser values
// --------------------------------------------------------------------------

abstract type node
  Dom-node(value : any)

abstract type element
  Dom-element(value : any)

abstract type raw-event
  Raw-event(value : any)

abstract type dom-listener
  Dom-listener(value : any)


// --------------------------------------------------------------------------
// JavaScript primitives
// --------------------------------------------------------------------------

extern query-raw(selector : string) : ui any
  js inline "document.querySelector(#1)"

extern any-is-null(value : any) : bool
  js inline "(#1 == null)"

extern any-node(value : any) : node
  js inline "#1"

// JavaScript DOM APIs throw native exceptions, which do not automatically
// become Koka's `exn` effect. Keep raw exceptions inside this tiny result box
// and rethrow them through Koka so handler/finally state is always restored.
extern dom-attempt-raw(action : () -> ui a) : ui any
  js inline "(function(){ try { return { ok:true, value:(#1)() }; } catch(error) { return { ok:false, message:String(error && error.message != null ? error.message : error) }; } })()"

extern dom-attempt-ok(result : any) : bool
  js inline "!!(#1).ok"

extern dom-attempt-value(result : any) : a
  js inline "(#1).value"

extern dom-attempt-message(result : any) : string
  js inline "String((#1).message)"

extern dom-create-element(name : string) : ui element
  js inline "document.createElement(#1)"

extern dom-create-text(value : string) : ui node
  js inline "document.createTextNode(#1)"

extern dom-create-comment(value : string) : ui node
  js inline "document.createComment(#1)"

extern element-node(value : element) : node
  js inline "#1"

extern dom-append(parent : node, child : node) : ui ()
  js inline "(#1).appendChild(#2)"

extern dom-insert-before(parent : node, child : node, before : node) : ui ()
  js inline "(#1).insertBefore(#2,#3)"

extern dom-set-text(value : node, content : string) : ui ()
  js inline "((#1).data = #2)"

extern dom-set-attribute(value : element, name : string,
                         content : string) : ui ()
  js inline "(#1).setAttribute(#2,#3)"

extern dom-remove-attribute(value : element, name : string) : ui ()
  js inline "(#1).removeAttribute(#2)"

extern dom-set-string-property(value : element, name : string,
                               content : string) : ui ()
  js inline "((#1)[#2] = #3)"

extern dom-set-bool-property(value : element, name : string,
                             content : bool) : ui ()
  js inline "((#1)[#2] = #3)"

extern dom-set-int-property(value : element, name : string,
                            content : string) : ui ()
  js inline "((#1)[#2] = Number(#3))"

extern dom-clear-between(first : node, last : node) : ui ()
  js inline "(function(){ var n=(#1).nextSibling; while(n && n!==#2){ var next=n.nextSibling; n.remove(); n=next; } })()"

extern dom-remove-range(first : node, last : node) : ui ()
  js inline "(function(){ var n=#1; var end=#2; var parent=n.parentNode; while(parent && n){ var next=n.nextSibling; parent.removeChild(n); if(n===end) break; n=next; } })()"

extern dom-append-html(parent : node, content : string) : ui ()
  js inline "(function(){ var t=document.createElement('template'); t.innerHTML=#2; (#1).appendChild(t.content); })()"

extern dom-insert-html-before(parent : node, before : node,
                              content : string) : ui ()
  js inline "(function(){ var t=document.createElement('template'); t.innerHTML=#3; (#1).insertBefore(t.content,#2); })()"

extern dom-listen(value : element, name : string,
                  action : raw-event -> <ui|e> ()) : ui dom-listener
  js inline "(function(){ var f=function(ev){ return (#3)(ev); }; (#1).addEventListener(#2,f); return f; })()"

extern dom-unlisten(value : element, name : string,
                    listener : dom-listener) : ui ()
  js inline "(#1).removeEventListener(#2,#3)"

extern raw-event-value(value : raw-event) : ui string
  js inline "(function(){ var t=(#1).currentTarget || (#1).target; return (t && t.value != null ? String(t.value) : ''); })()"

extern raw-event-checked(value : raw-event) : ui bool
  js inline "(function(){ var t=(#1).currentTarget || (#1).target; return !!(t && t.checked); })()"

extern raw-event-key(value : raw-event) : ui string
  js inline "String((#1).key == null ? '' : (#1).key)"

extern raw-event-any(value : raw-event) : any
  js inline "#1"

extern event-prevent-default(value : any) : ui ()
  js inline "(#1).preventDefault()"

extern event-stop-propagation(value : any) : ui ()
  js inline "(#1).stopPropagation()"

extern dom-report-error(message : string) : ui ()
  js inline "console.error(#1)"


// --------------------------------------------------------------------------
// Public host helpers
// --------------------------------------------------------------------------

pub fun query(selector : string) : <ui,exn> node
  val result = dom-attempt{ query-raw(selector) }
  if result.any-is-null
  then throw("DOM selector did not match: " ++ selector)
  else any-node(result)

pub fun body() : <ui,exn> node
  query("body")

pub fun prevent-default(value : event) : <ui,exn> ()
  dom-attempt{ event-prevent-default(value.original) }

pub fun stop-propagation(value : event) : <ui,exn> ()
  dom-attempt{ event-stop-propagation(value.original) }


// --------------------------------------------------------------------------
// Exact-row adapters
// --------------------------------------------------------------------------

fun dom-attempt(action : () -> ui a) : <ui,exn> a
  val result = dom-attempt-raw(action)
  if dom-attempt-ok(result)
  then dom-attempt-value(result)
  else throw("browser DOM exception: " ++ dom-attempt-message(result))

fun tracked(read : () -> signal-read a) : <signal-read,pure> a
  mask<exn>{ mask<div>{ read() } }

fun constant-track() : <signal-read,pure> ()
  mask<signal-read>{ mask<exn>{ mask<div>{ () } } }

fun reactive-ui-exn(action : () -> <ui,exn> a)
                    : <signal-write,pure,ui|e> a
  mask<signal-write>{ mask<div>{ action() } }

fun insert(parent : node, before : maybe<node>, child : node) : <ui,exn> ()
  match before
    Nothing -> dom-attempt{ dom-append(parent,child) }
    Just(anchor) -> dom-attempt{ dom-insert-before(parent,child,anchor) }

fun insert-html(parent : node, before : maybe<node>, content : string)
                : <ui,exn> ()
  match before
    Nothing -> dom-attempt{ dom-append-html(parent,content) }
    Just(anchor) ->
      dom-attempt{ dom-insert-html-before(parent,anchor,content) }

fun set-attribute(value : element, name : string,
                  content : maybe<string>) : <ui,exn> ()
  if !name.is-valid-attribute-name
  then throw("invalid HTML attribute name: " ++ name)
  else match content
         Nothing -> dom-attempt{ dom-remove-attribute(value,name) }
         Just(text) -> dom-attempt{ dom-set-attribute(value,name,text) }

fun set-property(value : element, name : string,
                 content : property-value) : <ui,exn> ()
  if !name.is-valid-property-name
  then throw("invalid or markup-writing DOM property: " ++ name)
  else match content
         String-property(text) ->
           dom-attempt{ dom-set-string-property(value,name,text) }
         Bool-property(flag) ->
           dom-attempt{ dom-set-bool-property(value,name,flag) }
         Int-property(number) ->
           dom-attempt{ dom-set-int-property(value,name,number.show) }

fun snapshot(value : raw-event) : <ui,exn> event
  dom-attempt fn()
    Event(raw-event-value(value),raw-event-checked(value),raw-event-key(value),
          raw-event-any(value))

fun invoke-event(root : root<<ui|e>>, portal : reentry<<ui|e>>,
                 action : callback<e>, value : raw-event)
                : <ui|e> ()
  // A browser event runs after `main` has returned, so its dynamic exception
  // stack is fresh. Install the boundary before `dispatch` performs even its
  // root validity check; otherwise an asynchronous throw has no Koka handler.
  with catch fn(problem)
    dom-report-error("uncaught Kokaine event exception: " ++ problem.show)
  val captured = snapshot(value)
  // Re-entry itself is an atomic turn: callback-created children join the
  // registering continuation extent before writes are allowed to settle.
  reenter(portal,fn() action(captured))


// --------------------------------------------------------------------------
// View interpreter
// --------------------------------------------------------------------------

fun mount-attribute(root : root<<ui|e>>, target : element,
                    attribute : attribute<e>)
                   : <signal-write,ui,pure|e> ()
  match attribute
    Attribute(name,value) -> set-attribute(target,name,Just(value))
    Boolean-attribute(name,enabled) ->
      set-attribute(target,name,if enabled then Just("") else Nothing)
    Property(name,value) -> set-property(target,name,value)
    Live-attribute(name,read) ->
      val dispose = create-effect(root,fn() tracked(read),fn(value)
        reactive-ui-exn{ set-attribute(target,name,value) }
      )
      ()
    Live-property(name,read) ->
      val dispose = create-effect(root,fn() tracked(read),fn(value)
        reactive-ui-exn{ set-property(target,name,value) }
      )
      ()
    Listener(name,action) ->
      if !name.is-valid-event-name then throw("invalid DOM event name: " ++ name)
      else
        val portal = capture-reentry(root)
        val listener = dom-attempt fn()
          dom-listen(target,name,fn(value)
            invoke-event(root,portal,action,value)
          )
        on-cleanup(root,fn()
          reactive-ui-exn{
            dom-attempt{ dom-unlisten(target,name,listener) }
          }
        )

fun mount-view(root : root<<ui|e>>, parent : node,
               before : maybe<node>, tree : view<e>)
              : <signal-write,ui,pure|e> ()
  match tree
    Empty -> ()
    Text(content) ->
      val target = dom-attempt{ dom-create-text(content) }
      insert(parent,before,target)
    Live-text(read) ->
      val target = dom-attempt{ dom-create-text("") }
      insert(parent,before,target)
      val dispose = create-effect(root,fn() tracked(read),fn(value)
        reactive-ui-exn{ dom-attempt{ dom-set-text(target,value) } }
      )
      ()
    Element(name,attributes,children) ->
      if !name.is-valid-element-name
      then throw("invalid HTML element name: " ++ name)
      else
        val target = dom-attempt{ dom-create-element(name) }
        attributes.foreach fn(attribute)
          mount-attribute(root,target,attribute)
        children.foreach fn(child)
          mount-view(root,element-node(target),Nothing,child)
        insert(parent,before,element-node(target))
    Fragment(children) ->
      children.foreach fn(child) mount-view(root,parent,before,child)
    Region(read) ->
      val first = dom-attempt{ dom-create-comment("kokaine:region") }
      val last = dom-attempt{ dom-create-comment("/kokaine:region") }
      insert(parent,before,first)
      insert(parent,before,last)
      val dispose = create-effect(root,fn() tracked(read),fn(next)
        on-cleanup(root,fn()
          reactive-ui-exn{
            dom-attempt{ dom-clear-between(first,last) }
          }
        )
        mount-view(root,parent,Just(last),next)
      )
      ()
    Raw-html(content) -> insert-html(parent,before,trusted-content(content))

pub fun mount(root : root<<ui|e>>, parent : node, tree : view<e>)
             : <ui,exn|e> disposer<<ui|e>>
  update(root)
    batch(root)
      create-effect(root,constant-track,fn(_)
        val first = dom-attempt{ dom-create-comment("kokaine:mount") }
        val last = dom-attempt{ dom-create-comment("/kokaine:mount") }
        dom-attempt{ dom-append(parent,first) }
        dom-attempt{ dom-append(parent,last) }
        on-cleanup(root,fn()
          reactive-ui-exn{
            dom-attempt{ dom-remove-range(first,last) }
          }
        )
        mount-view(root,parent,Just(last),tree)
      )

pub fun unmount(dispose : disposer<<ui|e>>) : <ui,exn|e> ()
  dispose()
