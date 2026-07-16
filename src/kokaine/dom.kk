/*--------------------------------------------------------------------------
  Fine-grained browser DOM adapter for Koka's `jsweb` backend.

  Browser values are one-field wrappers around `any`; these erase to the raw
  JavaScript object. Every persistent listener and DOM range is attached to
  the continuation generation which created it and retires with that extent.
--------------------------------------------------------------------------*/
module kokaine/dom

import kokaine/reactive
import kokaine/html
import kokaine/internal/event-runtime
import std/core/unsafe


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

abstract type dom-owner-registration
  Dom-owner-registration(value : any)

type owner-match
  Owner-none
  Owner-live(owner-portal : reentry<<ui>>)
  Owner-retired

// Transaction state must survive abortive control while mount bootstraps are
// flushing. Keep this adapter-local and inaccessible to user code.
fun transaction-cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun transaction-load(value : ref<global,a>) : a
  unsafe-total { !value }

fun transaction-store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }


// --------------------------------------------------------------------------
// JavaScript primitives
// --------------------------------------------------------------------------

extern query-raw(selector : string) : ui any
  js inline "document.querySelector(#1)"

extern any-is-null(value : any) : bool
  js inline "(#1 == null)"

extern any-node(value : any) : node
  js inline "#1"

extern any-reentry(value : any) : reentry<<ui>>
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

// Nodes created by a managed generation remember its structural re-entry
// capability. The registry gives each live root a weakly keyed numeric ID:
// retired node tombstones can therefore reject stale same-root adoption without
// retaining the root or its generation portal.
extern dom-record-owner(value : node, root : root<<ui>>,
                        portal : reentry<<ui>>)
                       : ui dom-owner-registration
  js inline "(function(){ var key=Symbol.for('kokaine.dom.owners'); var registry=globalThis[key]; if(!registry || !registry.owners || !registry.roots){ registry={ owners:new WeakMap(), roots:new WeakMap(), nextId:1 }; globalThis[key]=registry; } var ownerId=registry.roots.get(#2); if(ownerId==null){ ownerId=registry.nextId++; registry.roots.set(#2,ownerId); } var entry={ ownerId:ownerId, portal:#3, retired:false }; registry.owners.set(#1,entry); return [{ node:#1, ownerId:ownerId, entry:entry }]; })()"

extern dom-retire-owners(value : dom-owner-registration) : ui ()
  js inline "(function(){ var registry=globalThis[Symbol.for('kokaine.dom.owners')]; var handles=#1 || []; for(var i=0;i<handles.length;i++){ var handle=handles[i]; var entry=handle.entry; if(entry){ entry.portal=null; entry.retired=true; } if(registry && registry.owners && handle.node){ var current=registry.owners.get(handle.node); if(current===entry && current.ownerId===handle.ownerId){ registry.owners.set(handle.node,entry); } } handle.node=null; handle.entry=null; } })()"

extern dom-find-owner(value : node, root : root<<ui>>) : ui any
  js inline "(function(){ var registry=globalThis[Symbol.for('kokaine.dom.owners')]; if(!registry || !registry.owners || !registry.roots) return { state:0 }; var ownerId=registry.roots.get(#2); if(ownerId==null) return { state:0 }; var current=#1; while(current){ var entry=registry.owners.get(current); if(entry && entry.ownerId===ownerId){ if(entry.retired || !entry.portal) return { state:2 }; return { state:1, portal:entry.portal }; } current=current.parentNode || current.host || null; } return { state:0 }; })()"

extern dom-owner-state(value : any) : int
  js inline "Number((#1).state)"

extern dom-owner-portal(value : any) : any
  js inline "(#1).portal"

extern dom-append(parent : node, child : node) : ui ()
  js inline "(#1).appendChild(#2)"

extern dom-insert-before(parent : node, child : node, before : node) : ui ()
  js inline "(#1).insertBefore(#2,#3)"

// Assemble boundary markers off-tree and publish them with one host mutation.
// If the final append/insert throws, neither endpoint has become observable in
// the target DOM.
extern dom-append-marker-pair(parent : node, first : node, last : node) : ui ()
  js inline "(function(){ var rangeFirst=#2; var rangeLast=#3; var fragment=document.createDocumentFragment(); fragment.appendChild(rangeFirst); fragment.appendChild(rangeLast); try { (#1).appendChild(fragment); } catch(error) { try { if(rangeFirst.parentNode) Node.prototype.removeChild.call(rangeFirst.parentNode,rangeFirst); } catch(_) {} try { if(rangeLast.parentNode) Node.prototype.removeChild.call(rangeLast.parentNode,rangeLast); } catch(_) {} throw error; } })()"

extern dom-insert-marker-pair-before(parent : node, first : node, last : node,
                                     before : node) : ui ()
  js inline "(function(){ var rangeFirst=#2; var rangeLast=#3; var fragment=document.createDocumentFragment(); fragment.appendChild(rangeFirst); fragment.appendChild(rangeLast); try { (#1).insertBefore(fragment,#4); } catch(error) { try { if(rangeFirst.parentNode) Node.prototype.removeChild.call(rangeFirst.parentNode,rangeFirst); } catch(_) {} try { if(rangeLast.parentNode) Node.prototype.removeChild.call(rangeLast.parentNode,rangeLast); } catch(_) {} throw error; } })()"

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
  js inline "(function(){ var rangeFirst=#1; var rangeLast=#2; var firstParent=rangeFirst && rangeFirst.parentNode; var lastParent=rangeLast && rangeLast.parentNode; if(!firstParent && !lastParent) return; if(!firstParent || firstParent!==lastParent || rangeFirst===rangeLast){ throw new Error('invalid Kokaine DOM range: endpoints do not share a parent'); } var nodes=[]; var n=rangeFirst.nextSibling; while(n && n!==rangeLast){ nodes.push(n); n=n.nextSibling; } if(n!==rangeLast){ throw new Error('invalid Kokaine DOM range: closing marker is not reachable after opening marker'); } var passes=Math.max(2,nodes.length+2); while(passes-- > 0){ var attached=false; for(var i=0;i<nodes.length;i++){ var parent=nodes[i].parentNode; if(parent){ attached=true; Node.prototype.removeChild.call(parent,nodes[i]); } } if(!attached) return; } for(var j=0;j<nodes.length;j++){ if(nodes[j].parentNode){ throw new Error('invalid Kokaine DOM cleanup: a removed node was synchronously reinserted'); } } })()"

extern dom-remove-range(first : node, last : node) : ui ()
  js inline "(function(){ var rangeFirst=#1; var rangeLast=#2; var firstParent=rangeFirst && rangeFirst.parentNode; var lastParent=rangeLast && rangeLast.parentNode; if(!firstParent && !lastParent) return; if(!firstParent || firstParent!==lastParent || rangeFirst===rangeLast){ throw new Error('invalid Kokaine DOM range: endpoints do not share a parent'); } var nodes=[]; var n=rangeFirst; while(n && n!==rangeLast){ nodes.push(n); n=n.nextSibling; } if(n!==rangeLast){ throw new Error('invalid Kokaine DOM range: closing marker is not reachable after opening marker'); } nodes.push(rangeLast); var passes=Math.max(2,nodes.length+2); while(passes-- > 0){ var attached=false; for(var i=0;i<nodes.length;i++){ var parent=nodes[i].parentNode; if(parent){ attached=true; Node.prototype.removeChild.call(parent,nodes[i]); } } if(!attached) return; } for(var j=0;j<nodes.length;j++){ if(nodes[j].parentNode){ throw new Error('invalid Kokaine DOM cleanup: a removed node was synchronously reinserted'); } } })()"

extern dom-append-html(parent : node, content : string,
                       root : root<<ui>>, portal : reentry<<ui>>)
                      : ui dom-owner-registration
  js inline "(function(){ var template=document.createElement('template'); template.innerHTML=#2; var key=Symbol.for('kokaine.dom.owners'); var registry=globalThis[key]; if(!registry || !registry.owners || !registry.roots){ registry={ owners:new WeakMap(), roots:new WeakMap(), nextId:1 }; globalThis[key]=registry; } var ownerId=registry.roots.get(#3); if(ownerId==null){ ownerId=registry.nextId++; registry.roots.set(#3,ownerId); } var handles=[]; Array.from(template.content.childNodes).forEach(function(child){ var entry={ ownerId:ownerId, portal:#4, retired:false }; registry.owners.set(child,entry); handles.push({ node:child, ownerId:ownerId, entry:entry }); }); try { (#1).appendChild(template.content); return handles; } catch(error) { handles.forEach(function(handle){ var entry=handle.entry; if(entry){ entry.portal=null; entry.retired=true; } if(registry.owners.get(handle.node)===entry) registry.owners.set(handle.node,entry); handle.node=null; handle.entry=null; }); throw error; } })()"

extern dom-insert-html-before(parent : node, before : node,
                              content : string, root : root<<ui>>,
                              portal : reentry<<ui>>)
                             : ui dom-owner-registration
  js inline "(function(){ var template=document.createElement('template'); template.innerHTML=#3; var key=Symbol.for('kokaine.dom.owners'); var registry=globalThis[key]; if(!registry || !registry.owners || !registry.roots){ registry={ owners:new WeakMap(), roots:new WeakMap(), nextId:1 }; globalThis[key]=registry; } var ownerId=registry.roots.get(#4); if(ownerId==null){ ownerId=registry.nextId++; registry.roots.set(#4,ownerId); } var handles=[]; Array.from(template.content.childNodes).forEach(function(child){ var entry={ ownerId:ownerId, portal:#5, retired:false }; registry.owners.set(child,entry); handles.push({ node:child, ownerId:ownerId, entry:entry }); }); try { (#1).insertBefore(template.content,#2); return handles; } catch(error) { handles.forEach(function(handle){ var entry=handle.entry; if(entry){ entry.portal=null; entry.retired=true; } if(registry.owners.get(handle.node)===entry) registry.owners.set(handle.node,entry); handle.node=null; handle.entry=null; }); throw error; } })()"

extern dom-listen(value : element, name : string,
                  action : raw-event -> ui ()) : ui dom-listener
  js inline "(function(){ var state={ action:#3 }; var f=function(ev){ var current=state.action; return current ? current(ev) : undefined; }; f.__kokaineListenerState=state; try { (#1).addEventListener(#2,f); return f; } catch(error) { state.action=null; try { (#1).removeEventListener(#2,f); } catch(_) {} throw error; } })()"

// Drop the Koka closure before asking an unreliable host to detach the ABI
// trampoline. A callback retained after failed removal is then inert and no
// longer keeps the root, structural portal, or event K reachable.
extern dom-retire-listener(listener : dom-listener) : ui ()
  js inline "(function(){ var state=(#1).__kokaineListenerState; if(state) state.action=null; })()"

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

fun reactive-ui-exn-open(action : () -> <ui,exn|e> a)
                         : <signal-write,pure,ui|e> a
  mask<signal-write>{ mask<div>{ action() } }

fun insert(parent : node, before : maybe<node>, child : node) : <ui,exn> ()
  match before
    Nothing -> dom-attempt{ dom-append(parent,child) }
    Just(anchor) -> dom-attempt{ dom-insert-before(parent,child,anchor) }

fun insert-marker-pair(parent : node, before : maybe<node>,
                       first : node, last : node) : <ui,exn> ()
  match before
    Nothing -> dom-attempt{ dom-append-marker-pair(parent,first,last) }
    Just(anchor) ->
      dom-attempt{ dom-insert-marker-pair-before(parent,first,last,anchor) }

fun retire-owner-registration(value : dom-owner-registration) : <ui,exn> ()
  dom-attempt{ dom-retire-owners(value) }

fun register-owner-cleanup(root : root<<ui>>,
                           value : dom-owner-registration)
                          : <signal-write,pure,ui> ()
  val committed = transaction-cell(False)
  finally(
    fn() {
      if transaction-load(committed) then ()
      else retire-owner-registration(value)
    },
    fn()
      on-cleanup(root,fn()
        reactive-ui-exn{ retire-owner-registration(value) }
      )
      transaction-store(committed,True)
  )

fun record-owner(root : root<<ui>>, value : node)
                : <signal-write,pure,ui> ()
  val portal = capture-reentry(root)
  val registered = dom-attempt{ dom-record-owner(value,root,portal) }
  register-owner-cleanup(root,registered)

fun find-owner(root : root<<ui>>, value : node) : <ui,exn> owner-match
  val found = dom-attempt{ dom-find-owner(value,root) }
  match dom-owner-state(found)
    0 -> Owner-none
    1 -> Owner-live(any-reentry(dom-owner-portal(found)))
    _ -> Owner-retired

fun insert-html(root : root<<ui>>, parent : node, before : maybe<node>,
                content : string)
                : <signal-write,pure,ui> ()
  val portal = capture-reentry(root)
  val registered = match before
    Nothing -> dom-attempt{ dom-append-html(parent,content,root,portal) }
    Just(anchor) ->
      dom-attempt{
        dom-insert-html-before(parent,anchor,content,root,portal)
      }
  register-owner-cleanup(root,registered)

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

fun invoke-event(root : root<<ui>>, portal : reentry<<ui>>,
                 continuation : event-continuation,
                 value : raw-event)
                : ui ()
  // A browser event runs after `main` has returned, so its dynamic exception
  // stack is fresh. Install the boundary before `dispatch` performs even its
  // root validity check; otherwise an asynchronous throw has no Koka handler.
  with catch fn(problem)
    dom-report-error("uncaught Kokaine event exception: " ++ problem.show)
  // Closing the gate must make even a retained/undetachable JavaScript
  // trampoline inert: do not snapshot or touch a stale structural frame.
  if continuation.is-live then
    val captured = snapshot(value)
    // A custom event target getter can synchronously dispose during snapshot.
    // Recheck before touching the structural portal; resume checks once more.
    if continuation.is-live then
      // Re-entry restores Kokaine's structural/reactive handlers; the opaque
      // event capability then resumes the actual multi-shot user continuation.
      // Keeping resume synchronous preserves native nested `dispatchEvent` order.
      reenter(portal,fn()
        // The async delimiter is inside this re-entry batch. Reaching await
        // therefore returns here first, letting the batch close before any
        // later browser completion starts its own generation-bound turn.
        run-async(root,fn()
          val _ = continuation.resume(captured)
          ()
        )
      )
    else ()
  else ()

fun retire-event-listener(
      target : element, name : string,
      continuation : event-continuation,
      listener : ref<global,maybe<dom-listener>>)
    : <ui,exn> ()
  // Gate the continuation before detaching the host callback. Even if a
  // patched DOM removal throws, the retained callback can no longer resume K.
  finally(
    fn() {
      match transaction-load(listener)
        Nothing -> ()
        Just(value) ->
          transaction-store(listener,Nothing)
          dom-retire-listener(value)
          dom-attempt{ dom-unlisten(target,name,value) }
    },
    fn() continuation.close
  )

fun capture-event-listener(root : root<<ui>>, action : callback)
                          : <ui,exn> event-continuation
  val captured = transaction-cell(Nothing)
  dispatch(root,fn()
    run-async(root,fn()
      // `capture-event` reaches its unconditional browser-event suspension
      // before any user code or Web await, so the capability is published
      // synchronously while the real async evidence remains installed.
      transaction-store(captured,Just(capture-event(action)))
    )
  )
  match transaction-load(captured)
    Just(continuation) -> continuation
    Nothing -> throw("event continuation capture did not complete synchronously")

fun install-event-listener(root : root<<ui>>, target : element,
                           name : string, action : callback)
                          : <ui,exn> ()
  // Capture the action before JavaScript retains its ABI trampoline. The
  // short nested dispatch installs the full reactive handler set required by
  // the parked continuation, but no user action executes during capture.
  val continuation = capture-event-listener(root,action)
  val portal = capture-reentry(root)
  val listener : ref<global,maybe<dom-listener>> = transaction-cell(Nothing)
  val committed = transaction-cell(False)
  finally(
    fn() {
      if transaction-load(committed) then () else
        retire-event-listener(target,name,continuation,listener)
    },
    fn()
      val installed = dom-attempt fn()
        dom-listen(target,name,fn(value)
          invoke-event(root,portal,continuation,value)
        )
      transaction-store(listener,Just(installed))
      on-cleanup(root,fn()
        reactive-ui-exn{
          retire-event-listener(target,name,continuation,listener)
        }
      )
      transaction-store(committed,True)
  )


// --------------------------------------------------------------------------
// View interpreter
// --------------------------------------------------------------------------

fun mount-attribute(root : root<<ui>>, target : element,
                    attribute : attribute<e>)
                   : <signal-write,ui,pure> ()
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
      if !name.is-valid-event-name
      then throw("invalid DOM event name: " ++ name)
      else ()
      reactive-ui-exn-open{
        install-event-listener(root,target,name,action)
      }

fun mount-view(root : root<<ui>>, parent : node,
               before : maybe<node>, tree : view<e>)
              : <signal-write,ui,pure> ()
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
        record-owner(root,element-node(target))
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
      insert-marker-pair(parent,before,first,last)
      val dispose = create-effect(root,fn() tracked(read),fn(next)
        on-cleanup(root,fn()
          reactive-ui-exn{
            dom-attempt{ dom-clear-between(first,last) }
          }
        )
        mount-view(root,parent,Just(last),next)
      )
      ()
    Raw-html(content) ->
      insert-html(root,parent,before,trusted-content(content))

fun mount-effect(root : root<<ui>>, parent : node, tree : view<e>)
                 : <signal-write,ui,pure> disposer<<ui>>
  create-effect(root,constant-track,fn(_)
    val first = dom-attempt{ dom-create-comment("kokaine:mount") }
    val last = dom-attempt{ dom-create-comment("/kokaine:mount") }
    insert-marker-pair(parent,Nothing,first,last)
    on-cleanup(root,fn()
      reactive-ui-exn{
        dom-attempt{ dom-remove-range(first,last) }
      }
    )
    mount-view(root,parent,Just(last),tree)
  )

fun mount-transaction(root : root<<ui>>, parent : node, tree : view<e>,
                      inherit-owner : bool)
                     : <ui,exn> disposer<<ui>>
  val pending = transaction-cell(Nothing)
  val committed = transaction-cell(False)
  finally(
    fn() {
      if transaction-load(committed) then () else
        match transaction-load(pending)
          Nothing -> ()
          Just(dispose) -> dispose()
    },
    fn()
      val register = fn()
        val dispose = mount-effect(root,parent,tree)
        // `mount-effect` only queues its bootstrap while the surrounding batch
        // is open. Remember the disposer before that batch is allowed to flush.
        transaction-store(pending,Just(dispose))
        dispose
      val result =
        if !inherit-owner then
          update(root){ batch(root,register) }
        else match find-owner(root,parent)
          Owner-none -> update(root){ batch(root,register) }
          Owner-retired ->
            throw("cannot mount into a retired Kokaine DOM generation")
          Owner-live(portal) -> reenter(portal,fn()
            // Re-entry exposes the full reactive turn row even though mount
            // registration itself performs no reads.
            mask<signal-read>{ register() }
          )
      transaction-store(committed,True)
      result
  )

pub fun mount(root : root<<ui>>, parent : node, tree : view<e>)
             : <ui,exn> disposer<<ui>>
  mount-transaction(root,parent,tree,True)

// Opt out of physical DOM ownership inheritance for intentionally independent
// roots mounted inside a managed subtree. The caller then owns the returned
// disposer and must retire it explicitly.
pub fun mount-independent(root : root<<ui>>, parent : node, tree : view<e>)
                         : <ui,exn> disposer<<ui>>
  mount-transaction(root,parent,tree,False)

pub fun unmount(dispose : disposer<<ui|e>>) : <ui,exn|e> ()
  dispose()
