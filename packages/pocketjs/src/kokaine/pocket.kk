/*--------------------------------------------------------------------------
  Experimental retained-mode PocketJS renderer.

  This vocabulary is intentionally separate from `kokaine/html`: PocketJS
  exposes View/Text/Image nodes, inline native styles, focus, and press input,
  not a browser DOM. The JavaScript bridge delegates every mutation to the
  public PocketJS renderer so its mirror, input registry, and sweep stay intact.
--------------------------------------------------------------------------*/
module kokaine/pocket

import kokaine/reactive
import kokaine/reactive/integration
import kokaine/reactive/integration/event
import std/core/unsafe


// --------------------------------------------------------------------------
// Pocket-specific declarative vocabulary
// --------------------------------------------------------------------------

pub alias press-effect = <signal-read,signal-write,ui,pure>
pub alias press-callback = () -> press-effect ()

abstract type property
  Style-number(name : string, value : int)
  Style-string(name : string, value : string)
  Live-style-number(name : string, read : () -> signal-read int)
  Live-style-string(name : string, read : () -> signal-read string)
  Focusable(enabled : bool)
  Source(value : string)
  Press(action : press-callback)

abstract type view
  Empty
  Text(content : string, properties : list<property>)
  Live-text(read : () -> signal-read string, properties : list<property>)
  Layout(properties : list<property>, children : list<view>)
  Image(properties : list<property>)
  Fragment(children : list<view>)
  Region(read : () -> signal-read view)

pub effect pocket
  fun emit(node : view) : ()

fun collect(action : () -> <pocket|e> ()) : e list<view>
  var nodes := []
  with handler
    fun emit(node) nodes := Cons(node,nodes)
    return(_) nodes.reverse
  action()

pub fun scene(action : () -> <pocket|e> ()) : e view
  match collect(action)
    Nil -> Empty
    Cons(node,Nil) -> node
    nodes -> Fragment(nodes)

fun nested(make : list<view> -> view,
           children : () -> <pocket|e> ()) : <pocket|e> ()
  var nodes := []
  with override
    fun emit(node) nodes := Cons(node,nodes)
    return(_) emit(make(nodes.reverse))
  children()

pub fun layout(children : () -> <pocket|e> (),
               props : list<property> = []) : <pocket|e> ()
  nested(fn(nodes) Layout(props,nodes),children)

pub fun fragment(children : () -> <pocket|e> ()) : <pocket|e> ()
  nested(Fragment,children)

pub fun text(content : string,
             props : list<property> = []) : pocket ()
  emit(Text(content,props))

pub fun live/text(read : () -> signal-read string,
                  props : list<property> = []) : pocket ()
  emit(Live-text(read,props))

pub fun image(source : string, props : list<property> = []) : pocket ()
  emit(Image(Cons(Source(source),props)))

pub fun dynamic(children : () -> <pocket,signal-read> ()) : pocket ()
  emit(Region(fn() scene(children)))

pub fun pressable(action : press-callback,
                  children : () -> <pocket|e> (),
                  props : list<property> = []) : <pocket|e> ()
  layout(children,Cons(Focusable(True),Cons(Press(action),props)))

pub fun pressable-write(action : () -> signal-write (),
                        children : () -> <pocket|e> (),
                        props : list<property> = []) : <pocket|e> ()
  layout(children,
    Cons(Focusable(True),Cons(on-press-write(action),props)))


// --------------------------------------------------------------------------
// Inline native styles and input properties
// --------------------------------------------------------------------------

// These low-level helpers are an escape hatch for the PocketJS 0.6 PROP
// vocabulary. Unknown names and invalid value kinds fail at the renderer
// boundary instead of being ignored.
pub fun number/style(name : string, value : int) : property
  Style-number(name,value)

pub fun string/style(name : string, value : string) : property
  Style-string(name,value)

pub fun live-number/style(name : string,
                          read : () -> signal-read int) : property
  Live-style-number(name,read)

pub fun live-string/style(name : string,
                          read : () -> signal-read string) : property
  Live-style-string(name,read)

pub fun width(value : int) : property
  Style-number("width",value)

pub fun live/width(read : () -> signal-read int) : property
  Live-style-number("width",read)

pub fun height(value : int) : property
  Style-number("height",value)

pub fun live/height(read : () -> signal-read int) : property
  Live-style-number("height",read)

pub fun min-width(value : int) : property
  Style-number("minW",value)

pub fun min-height(value : int) : property
  Style-number("minH",value)

pub fun gap(value : int) : property
  Style-number("gap",value)

pub fun padding-top(value : int) : property
  Style-number("paddingT",value)

pub fun padding-right(value : int) : property
  Style-number("paddingR",value)

pub fun padding-bottom(value : int) : property
  Style-number("paddingB",value)

pub fun padding-left(value : int) : property
  Style-number("paddingL",value)

pub fun grow(value : int = 1) : property
  Style-number("grow",value)

pub fun radius(value : int) : property
  Style-number("radius",value)

pub fun border-width(value : int) : property
  Style-number("borderWidth",value)

pub fun font-slot(value : int) : property
  Style-number("fontSlot",value)

pub fun flex-row() : property
  Style-number("flexDir",0)

pub fun flex-column() : property
  Style-number("flexDir",1)

pub fun justify-center() : property
  Style-number("justify",1)

pub fun justify-between() : property
  Style-number("justify",3)

pub fun align-center() : property
  Style-number("align",1)

pub fun overflow-hidden() : property
  Style-number("overflow",1)

pub fun background-color(value : string) : property
  Style-string("bgColor",value)

pub fun live/background-color(read : () -> signal-read string) : property
  Live-style-string("bgColor",read)

pub fun text-color(value : string) : property
  Style-string("textColor",value)

pub fun live/text-color(read : () -> signal-read string) : property
  Live-style-string("textColor",read)

pub fun border-color(value : string) : property
  Style-string("borderColor",value)

pub fun focusable(enabled : bool = True) : property
  Focusable(enabled)

pub fun on-press(action : press-callback) : property
  Press(action)

pub fun on-press-write(action : () -> signal-write ()) : property
  Press(fn()
    mask<signal-read>{
      mask<ui>{ mask<exn>{ mask<div>{ action() } } }
    }
  )


// --------------------------------------------------------------------------
// Opaque host ABI
// --------------------------------------------------------------------------

abstract type node
  Pocket-node(value : any)

extern pocket-bridge() : ui any
  js inline "(function(){ var bridge=globalThis[Symbol.for('kokaine.pocketjs.bridge')]; if(!bridge || bridge.version!==1) throw new Error('Kokaine PocketJS bridge version 1 is not installed'); return bridge; })()"

extern bridge-root(bridge : any) : ui node
  js inline "(#1).getRoot()"

extern bridge-create-view(bridge : any) : ui node
  js inline "(#1).createView()"

extern bridge-create-text(bridge : any, value : string) : ui node
  js inline "(#1).createText(#2)"

extern bridge-create-image(bridge : any) : ui node
  js inline "(#1).createImage()"

// Live text is the renderer's hottest publication edge. Keep bridge ownership
// dynamic: every turn resolves and validates the installed ABI before invoking
// replaceText, while native throws are boxed before crossing Koka handlers.
extern bridge-replace-text-result(target : node, value : string) : ui any
  js inline "(function(){ try { var bridge=globalThis[Symbol.for('kokaine.pocketjs.bridge')]; if(!bridge || bridge.version!==1) throw new Error('Kokaine PocketJS bridge version 1 is not installed'); bridge.replaceText(#1,#2); return null; } catch(error) { return String(error && error.message != null ? error.message : error); } })()"

extern bridge-result-failed(result : any) : bool
  js inline "(#1)!==null"

extern bridge-result-message(result : any) : string
  js inline "String(#1)"

extern bridge-append(bridge : any, parent : node, child : node) : ui ()
  js inline "(#1).insertBefore(#2,#3,null)"

extern bridge-insert-before(bridge : any, parent : node, child : node,
                            anchor : node) : ui ()
  js inline "(#1).insertBefore(#2,#3,#4)"

extern bridge-remove(bridge : any, parent : node, child : node) : ui ()
  js inline "(#1).remove(#2,#3)"

extern bridge-discard(bridge : any, target : node) : ui ()
  js inline "(#1).discard(#2)"

extern bridge-set-style-number(bridge : any, target : node,
                               name : string, value : int) : ui ()
  js inline "(#1).setStyleNumber(#2,#3,#4)"

extern bridge-set-style-string(bridge : any, target : node,
                               name : string, value : string) : ui ()
  js inline "(#1).setStyleString(#2,#3,#4)"

extern bridge-set-focusable(bridge : any, target : node,
                            enabled : bool) : ui ()
  js inline "(#1).setFocusable(#2,#3)"

extern bridge-set-source(bridge : any, target : node,
                         value : string) : ui ()
  js inline "(#1).setSource(#2,#3)"

extern bridge-set-press(bridge : any, target : node,
                        listener : () -> ui ()) : ui ()
  js inline "(#1).setPress(#2,#3)"

extern bridge-clear-press(bridge : any, target : node) : ui ()
  js inline "(#1).clearPress(#2)"

// Native JavaScript throws do not implement Koka's modeled `exn` effect.
// Box them before unwinding through reactive handlers and finalizers.
extern pocket-attempt-raw(action : () -> ui a) : ui any
  js inline "(function(){ try { return { ok:true, value:(#1)() }; } catch(error) { return { ok:false, message:String(error && error.message != null ? error.message : error) }; } })()"

extern pocket-attempt-ok(result : any) : bool
  js inline "!!(#1).ok"

extern pocket-attempt-value(result : any) : a
  js inline "(#1).value"

extern pocket-attempt-message(result : any) : string
  js inline "String((#1).message)"

extern pocket-report-error(message : string) : ui ()
  js inline "console.error(#1)"

extern pocket-throw(message : string) : ui a
  js inline "(function(){ throw new Error(#1); })()"


// --------------------------------------------------------------------------
// Exact-row adapters and host operations
// --------------------------------------------------------------------------

fun cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

// JavaScript calls a generated Koka export after its lexical effect handlers
// have returned. Close modeled exceptions at that ABI edge and rethrow them as
// native errors so createPocketRoot/mountKokaine can roll back their host state.
pub fun host-entry(action : () -> <ui,exn|e> a) : <ui|e> a
  with catch fn(problem)
    pocket-throw("Kokaine PocketJS host entry failed: " ++ problem.show)
  action()

fun pocket-attempt(action : () -> ui a) : <ui,exn> a
  val result = pocket-attempt-raw(action)
  if pocket-attempt-ok(result)
  then pocket-attempt-value(result)
  else throw("PocketJS renderer exception: " ++ pocket-attempt-message(result))

fun tracked(read : () -> signal-read a) : <signal-read,pure> a
  mask<exn>{ mask<div>{ read() } }

fun constant-track() : <signal-read,pure> ()
  mask<signal-read>{ mask<exn>{ mask<div>{ () } } }

fun reactive-ui-exn(action : () -> <ui,exn> a)
                    : <signal-write,pure,ui|e> a
  mask<signal-write>{ mask<div>{ action() } }

fun bridge-result-or-throw(result : any) : exn ()
  if bridge-result-failed(result)
  then throw("PocketJS renderer exception: " ++ bridge-result-message(result))
  else ()

fun host-root() : <ui,exn> node
  pocket-attempt{
    val bridge = pocket-bridge()
    bridge-root(bridge)
  }

fun create-view() : <ui,exn> node
  pocket-attempt{
    val bridge = pocket-bridge()
    bridge-create-view(bridge)
  }

fun create-text(value : string) : <ui,exn> node
  pocket-attempt{
    val bridge = pocket-bridge()
    bridge-create-text(bridge,value)
  }

fun create-image() : <ui,exn> node
  pocket-attempt{
    val bridge = pocket-bridge()
    bridge-create-image(bridge)
  }

fun insert(parent : node, before : maybe<node>, child : node) : <ui,exn> ()
  pocket-attempt{
    val bridge = pocket-bridge()
    match before
      Nothing -> bridge-append(bridge,parent,child)
      Just(anchor) -> bridge-insert-before(bridge,parent,child,anchor)
  }

fun remove(parent : node, child : node) : <ui,exn> ()
  pocket-attempt{
    val bridge = pocket-bridge()
    bridge-remove(bridge,parent,child)
  }

fun discard(target : node) : <ui,exn> ()
  pocket-attempt{
    val bridge = pocket-bridge()
    bridge-discard(bridge,target)
  }

fun rollback-created(parent : node, target : node, inserted : bool)
                    : <ui,exn> ()
  if inserted then remove(parent,target) else discard(target)

fun remove-nodes(parent : node, nodes : list<node>) : <ui,exn> ()
  nodes.foreach fn(child) remove(parent,child)

fun append-nodes(left : list<node>, right : list<node>) : list<node>
  match left
    Nil -> right
    Cons(head,tail) -> Cons(head,append-nodes(tail,right))


// --------------------------------------------------------------------------
// Retained press callbacks
// --------------------------------------------------------------------------

fun invoke-press(root : root<<ui>>, portal : reentry<<ui>>,
                 continuation : event-continuation<total,()>) : ui ()
  with catch fn(problem)
    pocket-report-error("uncaught Kokaine PocketJS press exception: " ++
                        problem.show)
  if continuation.is-live then
    reenter(portal,fn()
      val _ = continuation.resume(())
      ()
    )
  else ()

fun retire-press(target : node,
                 continuation : event-continuation<total,()>) : <ui,exn> ()
  continuation.close
  pocket-attempt{
    val bridge = pocket-bridge()
    bridge-clear-press(bridge,target)
  }

fun capture-press(root : root<<ui>>, action : press-callback)
                  : <ui,exn> event-continuation<total,()>
  val captured = cell(Nothing)
  dispatch(root,fn()
    store(captured,Just(capture-event(fn(_ : ()) action())))
  )
  match load(captured)
    Just(continuation) -> continuation
    Nothing -> throw("PocketJS press continuation did not capture synchronously")

fun install-press(root : root<<ui>>, target : node,
                  action : press-callback)
                 : <signal-write,pure,ui> ()
  val continuation : event-continuation<total,()> =
    reactive-ui-exn{ capture-press(root,action) }
  val portal = capture-reentry(root)
  val listener = fn() invoke-press(root,portal,continuation)
  val installed = cell(False)
  val committed = cell(False)
  finally(
    fn() {
      if load(committed) then () else
        continuation.close
        if load(installed) then
          reactive-ui-exn{
            pocket-attempt{
              val bridge = pocket-bridge()
              bridge-clear-press(bridge,target)
            }
          }
        else ()
    },
    fn()
      reactive-ui-exn{
        pocket-attempt{
          val bridge = pocket-bridge()
          bridge-set-press(bridge,target,listener)
        }
      }
      store(installed,True)
      on-cleanup(root,fn()
        reactive-ui-exn{ retire-press(target,continuation) }
      )
      store(committed,True)
  )


// --------------------------------------------------------------------------
// Retained tree interpreter
// --------------------------------------------------------------------------

fun mount-property(root : root<<ui>>, target : node,
                   value : property) : <signal-write,ui,pure> ()
  match value
    Style-number(name,number) -> reactive-ui-exn{
      pocket-attempt{
        val bridge = pocket-bridge()
        bridge-set-style-number(bridge,target,name,number)
      }
    }
    Style-string(name,text) -> reactive-ui-exn{
      pocket-attempt{
        val bridge = pocket-bridge()
        bridge-set-style-string(bridge,target,name,text)
      }
    }
    Live-style-number(name,read) ->
      val dispose = create-effect(root,fn() tracked(read),fn(number)
        reactive-ui-exn{
          pocket-attempt{
            val bridge = pocket-bridge()
            bridge-set-style-number(bridge,target,name,number)
          }
        }
      )
      ()
    Live-style-string(name,read) ->
      val dispose = create-effect(root,fn() tracked(read),fn(text)
        reactive-ui-exn{
          pocket-attempt{
            val bridge = pocket-bridge()
            bridge-set-style-string(bridge,target,name,text)
          }
        }
      )
      ()
    Focusable(enabled) -> reactive-ui-exn{
      pocket-attempt{
        val bridge = pocket-bridge()
        bridge-set-focusable(bridge,target,enabled)
      }
    }
    Source(source) -> reactive-ui-exn{
      pocket-attempt{
        val bridge = pocket-bridge()
        bridge-set-source(bridge,target,source)
      }
    }
    Press(action) -> install-press(root,target,action)

fun mount-view(root : root<<ui>>, parent : node,
               before : maybe<node>, tree : view)
              : <signal-write,ui,pure> list<node>
  match tree
    Empty -> []
    Text(content,properties) ->
      val target = reactive-ui-exn{ create-text(content) }
      val inserted = cell(False)
      val committed = cell(False)
      finally(
        fn() {
          if load(committed) then ()
          else reactive-ui-exn{
            rollback-created(parent,target,load(inserted))
          }
        },
        fn()
          reactive-ui-exn{ insert(parent,before,target) }
          store(inserted,True)
          properties.foreach fn(value) mount-property(root,target,value)
          store(committed,True)
          [target]
      )
    Live-text(read,properties) ->
      val target = reactive-ui-exn{ create-text("") }
      val inserted = cell(False)
      val committed = cell(False)
      finally(
        fn() {
          if load(committed) then ()
          else reactive-ui-exn{
            rollback-created(parent,target,load(inserted))
          }
        },
        fn()
          reactive-ui-exn{ insert(parent,before,target) }
          store(inserted,True)
          properties.foreach fn(value) mount-property(root,target,value)
          val dispose = create-ui-publication-effect(
            root,fn() tracked(read),fn(value)
            bridge-result-or-throw(
              bridge-replace-text-result(target,value))
          )
          store(committed,True)
          [target]
      )
    Layout(properties,children) ->
      val target = reactive-ui-exn{ create-view() }
      val inserted = cell(False)
      val committed = cell(False)
      finally(
        fn() {
          if load(committed) then ()
          else reactive-ui-exn{
            rollback-created(parent,target,load(inserted))
          }
        },
        fn()
          reactive-ui-exn{ insert(parent,before,target) }
          store(inserted,True)
          properties.foreach fn(value) mount-property(root,target,value)
          val _ = mount-views(root,target,Nothing,children)
          store(committed,True)
          [target]
      )
    Image(properties) ->
      val target = reactive-ui-exn{ create-image() }
      val inserted = cell(False)
      val committed = cell(False)
      finally(
        fn() {
          if load(committed) then ()
          else reactive-ui-exn{
            rollback-created(parent,target,load(inserted))
          }
        },
        fn()
          reactive-ui-exn{ insert(parent,before,target) }
          store(inserted,True)
          properties.foreach fn(value) mount-property(root,target,value)
          store(committed,True)
          [target]
      )
    Fragment(children) -> mount-views(root,parent,before,children)
    Region(read) ->
      val anchor = reactive-ui-exn{ create-text("") }
      val inserted = cell(False)
      val committed = cell(False)
      finally(
        fn() {
          if load(committed) then ()
          else reactive-ui-exn{
            rollback-created(parent,anchor,load(inserted))
          }
        },
        fn()
          reactive-ui-exn{ insert(parent,before,anchor) }
          store(inserted,True)
          val dispose = create-effect(root,fn() tracked(read),fn(next)
            val mounted = cell([])
            on-cleanup(root,fn()
              reactive-ui-exn{ remove-nodes(parent,load(mounted)) }
            )
            val nodes = mount-view(root,parent,Just(anchor),next)
            store(mounted,nodes)
          )
          store(committed,True)
          [anchor]
      )

fun mount-views(root : root<<ui>>, parent : node,
                before : maybe<node>, trees : list<view>)
               : <signal-write,ui,pure> list<node>
  match trees
    Nil -> []
    Cons(tree,rest) ->
      val first = mount-view(root,parent,before,tree)
      val committed = cell(False)
      finally(
        fn() {
          if load(committed) then ()
          else reactive-ui-exn{ remove-nodes(parent,first) }
        },
        fn()
          val remaining = mount-views(root,parent,before,rest)
          store(committed,True)
          append-nodes(first,remaining)
      )

fun mount-effect(root : root<<ui>>, parent : node, tree : view)
                 : <signal-write,ui,pure> disposer<<ui>>
  create-effect(root,constant-track,fn(_)
    val anchor = reactive-ui-exn{ create-text("") }
    val inserted = cell(False)
    val range-owned = cell(False)
    val mounted = cell([])
    finally(
      fn() {
        if !load(inserted) then
          reactive-ui-exn{ discard(anchor) }
        else if !load(range-owned) then
          reactive-ui-exn{
            remove-nodes(parent,load(mounted))
            remove(parent,anchor)
          }
        else ()
      },
      fn()
        reactive-ui-exn{ insert(parent,Nothing,anchor) }
        store(inserted,True)
        on-cleanup(root,fn()
          reactive-ui-exn{
            remove-nodes(parent,load(mounted))
            remove(parent,anchor)
          }
        )
        store(range-owned,True)
        val nodes = mount-view(root,parent,Just(anchor),tree)
        store(mounted,nodes)
    )
  )

pub fun mount(root : root<<ui>>, tree : view)
             : <ui,exn> disposer<<ui>>
  val parent = host-root()
  val pending = cell(Nothing)
  val committed = cell(False)
  finally(
    fn() {
      if load(committed) then () else
        match load(pending)
          Nothing -> ()
          Just(dispose) -> dispose()
    },
    fn()
      val register = fn()
        val dispose = mount-effect(root,parent,tree)
        store(pending,Just(dispose))
        dispose
      val result = update(root){ batch(root,register) }
      store(committed,True)
      result
  )

pub fun unmount(dispose : disposer<<ui|e>>) : <ui,exn|e> ()
  dispose()
