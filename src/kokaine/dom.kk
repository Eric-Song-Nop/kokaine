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
import kokaine/internal/key-index
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

type owner-match<e::E>
  Owner-none
  Owner-live(owner-portal : reentry<e>)
  Owner-retired

// A keyed row has a lifetime which is deliberately independent from the
// collection observer generation.  `current-item` and `current-index` are the
// last committed values; their always-publishing sources are written only
// after the reconciler has already performed every fallible comparison and DOM
// move in the draft transaction.
type keyed-row<e::E,a,k>
  Keyed-row(
    row-key           : k,
    row-current-item  : ref<global,a>,
    row-current-index : ref<global,int>,
    row-item-source   : signal<a>,
    row-index-source  : signal<int>,
    row-owner         : structural-owner<<ui|e>>,
    row-first         : node,
    row-last          : node
  )

type keyed-update<e::E,a,k>
  Keyed-update(
    update-row           : keyed-row<e,a,k>,
    update-item          : a,
    update-index         : int,
    update-item-changed  : bool,
    update-index-changed : bool
  )

type keyed-table<e::E,a,k>
  Keyed-table(
    table-index : key-index<k,keyed-row<e,a,k>>,
    table-order : list<keyed-row<e,a,k>>
  )

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

extern any-reentry(value : any) : reentry<e>
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
extern dom-record-owner(value : node, root : root<e>, portal : reentry<e>)
                       : ui dom-owner-registration
  js inline "(function(){ var key=Symbol.for('kokaine.dom.owners'); var registry=globalThis[key]; if(!registry || !registry.owners || !registry.roots){ registry={ owners:new WeakMap(), roots:new WeakMap(), nextId:1 }; globalThis[key]=registry; } var ownerId=registry.roots.get(#2); if(ownerId==null){ ownerId=registry.nextId++; registry.roots.set(#2,ownerId); } var entry={ ownerId:ownerId, portal:#3, retired:false }; registry.owners.set(#1,entry); return [{ node:#1, ownerId:ownerId, entry:entry }]; })()"

extern dom-retire-owners(value : dom-owner-registration) : ui ()
  js inline "(function(){ var registry=globalThis[Symbol.for('kokaine.dom.owners')]; var handles=#1 || []; for(var i=0;i<handles.length;i++){ var handle=handles[i]; var entry=handle.entry; if(entry){ entry.portal=null; entry.retired=true; } if(registry && registry.owners && handle.node){ var current=registry.owners.get(handle.node); if(current===entry && current.ownerId===handle.ownerId){ registry.owners.set(handle.node,entry); } } handle.node=null; handle.entry=null; } })()"

extern dom-find-owner(value : node, root : root<e>) : ui any
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

extern dom-same-node(left : node, right : node) : bool
  js inline "(#1 === #2)"

// Validate a complete managed range before exposing either cursor.  The DOM
// can be mutated by application JavaScript, custom-element callbacks, or test
// fault injection, so reconciliation never trusts retained marker handles.
extern dom-range-first(parent : node, first : node, last : node) : ui node
  js inline "(function(rangeParent,rangeFirst,rangeLast){ if(!rangeParent || !rangeFirst || !rangeLast || rangeFirst===rangeLast || rangeFirst.parentNode!==rangeParent || rangeLast.parentNode!==rangeParent){ throw new Error('invalid Kokaine DOM range: endpoints do not share the expected parent'); } var n=rangeFirst; while(n && n!==rangeLast) n=n.nextSibling; if(n!==rangeLast){ throw new Error('invalid Kokaine DOM range: closing marker is not reachable after opening marker'); } return rangeFirst.nextSibling; })(#1,#2,#3)"

extern dom-range-next(parent : node, first : node, last : node) : ui node
  js inline "(function(rangeParent,rangeFirst,rangeLast){ if(!rangeParent || !rangeFirst || !rangeLast || rangeFirst===rangeLast || rangeFirst.parentNode!==rangeParent || rangeLast.parentNode!==rangeParent){ throw new Error('invalid Kokaine DOM range: endpoints do not share the expected parent'); } var n=rangeFirst; while(n && n!==rangeLast) n=n.nextSibling; if(n!==rangeLast){ throw new Error('invalid Kokaine DOM range: closing marker is not reachable after opening marker'); } var next=rangeLast.nextSibling; if(!next){ throw new Error('invalid Kokaine keyed DOM range: row has no following boundary'); } return next; })(#1,#2,#3)"

// Move one inclusive row range as a single host insertion.  Validation is
// deliberately complete before extraction.  If extraction, insertion, focus
// restoration, or a commit-then-throw host shim fails, every snapshotted node
// is pulled back before the original successor with native prototype methods.
// A focused descendant is restored together with its text selection; ordinary
// DOM object identity, listeners, form values, and owner registrations are
// retained because no node is cloned.
extern dom-validate-range-move-lifecycle(parent : node, first : node,
                                         last : node) : ui ()
  js inline "(function(rangeParent,rangeFirst,rangeLast){ var canPreserve=typeof rangeParent.moveBefore==='function'; var pending=[]; var n=rangeFirst; while(n){ pending.push(n); if(n===rangeLast) break; n=n.nextSibling; } if(n!==rangeLast) throw new Error('invalid Kokaine DOM move: closing marker is not reachable after opening marker'); var registry=globalThis.customElements; while(pending.length){ var current=pending.pop(); if(current && current.nodeType===1){ var name=current.getAttribute('is') || current.localName; var ctor=registry && registry.get(name); if(ctor){ var prototype=ctor.prototype; var reconnects=typeof prototype.connectedCallback==='function' || typeof prototype.disconnectedCallback==='function'; if(reconnects && !canPreserve) throw new Error('cannot safely move keyed row: this browser cannot preserve custom-element connection state'); if(reconnects && typeof prototype.connectedMoveCallback!=='function') throw new Error('cannot safely move keyed row: custom elements with connection callbacks must define connectedMoveCallback'); } } var children=current && current.childNodes ? Array.prototype.slice.call(current.childNodes) : []; if(current && current.shadowRoot) children=children.concat(Array.prototype.slice.call(current.shadowRoot.childNodes)); for(var i=0;i<children.length;i++) pending.push(children[i]); } })(#1,#2,#3)"

extern dom-move-range-before(parent : node, first : node, last : node,
                             before : node) : ui ()
  js inline "(function(rangeParent,rangeFirst,rangeLast,target){ if(!rangeParent || !rangeFirst || !rangeLast || !target || rangeFirst===rangeLast || rangeFirst.parentNode!==rangeParent || rangeLast.parentNode!==rangeParent || target.parentNode!==rangeParent){ throw new Error('invalid Kokaine DOM move: range and target must share the expected parent'); } var nodes=[]; var n=rangeFirst; while(n){ nodes.push(n); if(n===rangeLast) break; n=n.nextSibling; } if(n!==rangeLast){ throw new Error('invalid Kokaine DOM move: closing marker is not reachable after opening marker'); } if(nodes.indexOf(target)>=0){ throw new Error('invalid Kokaine DOM move: target lies inside the moved range'); } if(rangeLast.nextSibling===target) return; var originalNext=rangeLast.nextSibling; var active=document.activeElement; var ownsFocus=!!active && nodes.some(function(node){ return node===active || (node.nodeType===1 && node.contains(active)); }); var selection=null; if(ownsFocus && typeof active.selectionStart==='number' && typeof active.selectionEnd==='number'){ selection=[active.selectionStart,active.selectionEnd,active.selectionDirection]; } function restoreFocus(){ if(!ownsFocus || document.activeElement===active || !active.isConnected) return; active.focus({ preventScroll:true }); if(selection && typeof active.setSelectionRange==='function') active.setSelectionRange(selection[0],selection[1],selection[2]); } function gather(values){ var fragment=document.createDocumentFragment(); for(var i=0;i<values.length;i++) Node.prototype.appendChild.call(fragment,values[i]); return fragment; } function place(anchor){ if(typeof rangeParent.moveBefore==='function'){ for(var i=0;i<nodes.length;i++) rangeParent.moveBefore(nodes[i],anchor); } else { rangeParent.insertBefore(gather(nodes),anchor); } } function detachMoved(){ var passes=Math.max(2,nodes.length+2); while(passes-- > 0){ var attached=false; for(var i=0;i<nodes.length;i++){ var parent=nodes[i].parentNode; if(parent){ attached=true; Node.prototype.removeChild.call(parent,nodes[i]); } } if(!attached) return; } throw new Error('a retired keyed range was synchronously reinserted'); } function verify(anchor){ for(var i=0;i<nodes.length;i++){ if(nodes[i].parentNode!==rangeParent) throw new Error('a moved node escaped its keyed range'); if(i>0 && nodes[i-1].nextSibling!==nodes[i]) throw new Error('the keyed range became non-contiguous'); } if(nodes[nodes.length-1].nextSibling!==anchor) throw new Error('the keyed range was not placed at its requested boundary'); } function rollback(){ if(originalNext && originalNext.parentNode!==rangeParent){ detachMoved(); throw new Error('the original keyed range successor was detached'); } var anchor=originalNext || null; Node.prototype.insertBefore.call(rangeParent,gather(nodes),anchor); restoreFocus(); verify(anchor); } try { place(target); restoreFocus(); verify(target); } catch(error) { try { rollback(); } catch(rollbackError) { throw new Error(String(error && error.message != null ? error.message : error) + '; keyed DOM move rollback failed: ' + String(rollbackError && rollbackError.message != null ? rollbackError.message : rollbackError)); } throw error; } })(#1,#2,#3,#4)"

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

extern dom-clean-range(first : node, last : node, inclusive : bool) : ui ()
  js inline "(function(){ var rangeFirst=#1; var rangeLast=#2; var includeEndpoints=#3; var firstParent=rangeFirst && rangeFirst.parentNode; var lastParent=rangeLast && rangeLast.parentNode; if(!firstParent && !lastParent) return; if(!firstParent || firstParent!==lastParent || rangeFirst===rangeLast){ throw new Error('invalid Kokaine DOM range: endpoints do not share a parent'); } var roots=[]; var n=includeEndpoints ? rangeFirst : rangeFirst.nextSibling; while(n && n!==rangeLast){ roots.push(n); n=n.nextSibling; } if(n!==rangeLast){ throw new Error('invalid Kokaine DOM range: closing marker is not reachable after opening marker'); } if(includeEndpoints) roots.push(rangeLast); var descendants=[]; var pending=roots.slice(); while(pending.length){ var current=pending.pop(); var children=current && current.childNodes ? Array.prototype.slice.call(current.childNodes) : []; if(current && current.shadowRoot) children=children.concat(Array.prototype.slice.call(current.shadowRoot.childNodes)); for(var i=0;i<children.length;i++){ descendants.push(children[i]); pending.push(children[i]); } } function retained(node){ var current=node; while(current){ for(var i=0;i<roots.length;i++){ if(roots[i]===current || Node.prototype.contains.call(roots[i],current)) return true; } var tree=current.getRootNode ? current.getRootNode() : null; current=tree && tree.host ? tree.host : null; } return false; } var passes=Math.max(2,roots.length+descendants.length+2); while(passes-- > 0){ var attached=false; for(var i=0;i<roots.length;i++){ var parent=roots[i].parentNode; if(parent){ attached=true; Node.prototype.removeChild.call(parent,roots[i]); } } for(var j=0;j<descendants.length;j++){ var childParent=descendants[j].parentNode; if(childParent && !retained(descendants[j])){ attached=true; Node.prototype.removeChild.call(childParent,descendants[j]); } } if(!attached) return; } for(var i=0;i<roots.length;i++){ if(roots[i].parentNode){ throw new Error('invalid Kokaine DOM cleanup: a removed node was synchronously reinserted'); } } for(var j=0;j<descendants.length;j++){ if(descendants[j].parentNode && !retained(descendants[j])){ throw new Error('invalid Kokaine DOM cleanup: a removed descendant escaped its range'); } } })()"

fun dom-clear-between(first : node, last : node) : ui ()
  dom-clean-range(first,last,False)

fun dom-remove-range(first : node, last : node) : ui ()
  dom-clean-range(first,last,True)

extern dom-append-html(parent : node, content : string,
                       root : root<e>, portal : reentry<e>)
                      : ui dom-owner-registration
  js inline "(function(){ var template=document.createElement('template'); template.innerHTML=#2; var key=Symbol.for('kokaine.dom.owners'); var registry=globalThis[key]; if(!registry || !registry.owners || !registry.roots){ registry={ owners:new WeakMap(), roots:new WeakMap(), nextId:1 }; globalThis[key]=registry; } var ownerId=registry.roots.get(#3); if(ownerId==null){ ownerId=registry.nextId++; registry.roots.set(#3,ownerId); } var handles=[]; Array.from(template.content.childNodes).forEach(function(child){ var entry={ ownerId:ownerId, portal:#4, retired:false }; registry.owners.set(child,entry); handles.push({ node:child, ownerId:ownerId, entry:entry }); }); try { (#1).appendChild(template.content); return handles; } catch(error) { handles.forEach(function(handle){ var entry=handle.entry; if(entry){ entry.portal=null; entry.retired=true; } if(registry.owners.get(handle.node)===entry) registry.owners.set(handle.node,entry); handle.node=null; handle.entry=null; }); throw error; } })()"

extern dom-insert-html-before(parent : node, before : node,
                              content : string, root : root<e>,
                              portal : reentry<e>)
                             : ui dom-owner-registration
  js inline "(function(){ var template=document.createElement('template'); template.innerHTML=#3; var key=Symbol.for('kokaine.dom.owners'); var registry=globalThis[key]; if(!registry || !registry.owners || !registry.roots){ registry={ owners:new WeakMap(), roots:new WeakMap(), nextId:1 }; globalThis[key]=registry; } var ownerId=registry.roots.get(#4); if(ownerId==null){ ownerId=registry.nextId++; registry.roots.set(#4,ownerId); } var handles=[]; Array.from(template.content.childNodes).forEach(function(child){ var entry={ ownerId:ownerId, portal:#5, retired:false }; registry.owners.set(child,entry); handles.push({ node:child, ownerId:ownerId, entry:entry }); }); try { (#1).insertBefore(template.content,#2); return handles; } catch(error) { handles.forEach(function(handle){ var entry=handle.entry; if(entry){ entry.portal=null; entry.retired=true; } if(registry.owners.get(handle.node)===entry) registry.owners.set(handle.node,entry); handle.node=null; handle.entry=null; }); throw error; } })()"

extern dom-listen(value : element, name : string,
                  action : raw-event -> <ui|e> ()) : ui dom-listener
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

// Row renderers are sampled once while their live closures retain the item and
// index accessors.  Widen the handled sample back to the DOM apply row so Koka
// does not prematurely close a surrounding structural-owner action at `<ui>`.
fun reactive-sample(root : root<<ui|e>>,
                    action : () -> <signal-read,pure> a)
                   : <signal-write,pure,ui|e> a
  mask<signal-write>{ mask<div>{ sample(root,action) } }

fun reactive-write-ui(action : () -> signal-write a)
                     : <signal-write,pure,ui|e> a
  mask<ui>{ mask<exn>{ mask<div>{ action() } } }

fun reactive-structural(action : () -> <div,exn,ui|e> a)
                       : <signal-write,pure,ui|e> a
  mask<signal-write>{ action() }

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

fun range-first(parent : node, first : node, last : node) : <ui,exn> node
  dom-attempt{ dom-range-first(parent,first,last) }

fun range-next(parent : node, first : node, last : node) : <ui,exn> node
  dom-attempt{ dom-range-next(parent,first,last) }

fun move-range-before(parent : node, first : node, last : node,
                      before : node) : <ui,exn> ()
  dom-attempt{ dom-validate-range-move-lifecycle(parent,first,last) }
  dom-attempt{ dom-move-range-before(parent,first,last,before) }

fun validate-range-move-lifecycle(parent : node, first : node, last : node)
                                  : <ui,exn> ()
  dom-attempt{
    dom-validate-range-move-lifecycle(parent,first,last)
  }

fun retire-owner-registration(value : dom-owner-registration) : <ui,exn> ()
  dom-attempt{ dom-retire-owners(value) }

fun register-owner-cleanup(root : root<<ui|e>>,
                           value : dom-owner-registration)
                          : <signal-write,pure,ui|e> ()
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

fun record-owner(root : root<<ui|e>>, value : node)
                : <signal-write,pure,ui|e> ()
  val portal = capture-reentry(root)
  val registered = dom-attempt{ dom-record-owner(value,root,portal) }
  register-owner-cleanup(root,registered)

fun find-owner(root : root<e>, value : node) : <ui,exn> owner-match<e>
  val found = dom-attempt{ dom-find-owner(value,root) }
  match dom-owner-state(found)
    0 -> Owner-none
    1 -> Owner-live(any-reentry(dom-owner-portal(found)))
    _ -> Owner-retired

fun insert-html(root : root<<ui|e>>, parent : node, before : maybe<node>,
                content : string)
                : <signal-write,pure,ui|e> ()
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

fun invoke-event(root : root<<ui|e>>, portal : reentry<<ui|e>>,
                 continuation : event-continuation,
                 value : raw-event)
                : <ui|e> ()
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
        val _ = continuation.resume(captured)
        ()
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

fun capture-event-listener(root : root<<ui|e>>, action : callback)
                          : <ui,exn|e> event-continuation
  dispatch(root,fn() capture-event(action))

fun install-event-listener(root : root<<ui|e>>, target : element,
                           name : string, action : callback)
                          : <ui,exn|e> ()
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
      if !name.is-valid-event-name
      then throw("invalid DOM event name: " ++ name)
      else ()
      reactive-ui-exn-open{
        install-event-listener(root,target,name,action)
      }

// --------------------------------------------------------------------------
// Incremental keyed regions
// --------------------------------------------------------------------------

fun throw-keyed-row-failure(
      failure : ref<global,error<()>>) : exn ()
  transaction-load(failure).untry

fun run-keyed-row-actions<a,k,rowe::E,p::E>(
      rows : list<keyed-row<rowe,a,k>>,
      action : (keyed-row<rowe,a,k>) -> <exn|p> (),
      failure : ref<global,error<()>>)
    : <exn|p> ()
  match rows
    Nil -> ()
    Cons(row,rest) ->
      val completed = transaction-cell(False)
      finally(
        fn() {
          if transaction-load(completed) then () else
            // A final control operation never returns through `error/try`.
            // Finish the remaining actions in its dynamic cleanup, and let a
            // later modeled exception override that control just as nested
            // `finally` did before this loop became stack-safe.
            run-keyed-row-actions(rest,action,failure)
            throw-keyed-row-failure(failure)
        },
        fn() mask<exn>{
          // Preserve only the latest modeled failure. Clearing the earlier
          // one first is essential when this action performs final control:
          // an older exception must not spuriously replace that control.
          val previous = transaction-load(failure)
          transaction-store(failure,Ok(()))
          match error/try(fn() action(row))
            Error(problem) -> transaction-store(failure,Error(problem))
            Ok(_) -> transaction-store(failure,previous)
          transaction-store(completed,True)
        }
      )
      run-keyed-row-actions(rest,action,failure)

fun exhaust-keyed-row-actions<a,k,rowe::E,p::E>(
      rows : list<keyed-row<rowe,a,k>>,
      action : (keyed-row<rowe,a,k>) -> <exn|p> ())
    : <exn|p> ()
  val failure : ref<global,error<()>> = transaction-cell(Ok(()))
  run-keyed-row-actions(rows,action,failure)
  throw-keyed-row-failure(failure)

fun dispose-keyed-rows<a,k,e::E>(rows : list<keyed-row<e,a,k>>)
                                  : <ui,exn|e> ()
  // A throwing cleanup cannot prevent later draft/stale rows from retiring.
  exhaust-keyed-row-actions(rows,fn(row)
    internal/dispose-structural-owner(row.row-owner)
  )

fun rollback-keyed-order<a,k,e::E>(parent : node, last : node,
                         rows : list<keyed-row<e,a,k>>) : <ui,exn> ()
  // Moving each prior row to the closing boundary in its former order
  // reconstructs that complete order regardless of the partial draft order.
  exhaust-keyed-row-actions(rows,fn(row)
    val next = range-next(parent,row.row-first,row.row-last)
    if dom-same-node(next,last) then ()
    else move-range-before(parent,row.row-first,row.row-last,last)
  )

fun validate-keyed-move-lifecycles<a,k,e::E>(parent : node,
                         rows : list<keyed-row<e,a,k>>) : <ui,exn> ()
  rows.foreach fn(row)
    validate-range-move-lifecycle(parent,row.row-first,row.row-last)

fun validate-keyed-order<a,k,e::E>(parent : node, last : node, cursor : node,
                         rows : list<keyed-row<e,a,k>>) : <ui,exn> ()
  match rows
    Nil ->
      if dom-same-node(cursor,last) then ()
      else throw("invalid Kokaine keyed DOM: unmanaged nodes remain in the region")
    Cons(row,rest) ->
      if !dom-same-node(cursor,row.row-first)
      then throw("invalid Kokaine keyed DOM: retained row ranges are out of order")
      else
        val next = range-next(parent,row.row-first,row.row-last)
        validate-keyed-order(parent,last,next,rest)

fun keyed-order-matches<a,k,e::E>(parent : node, last : node, cursor : node,
                         rows : list<keyed-row<e,a,k>>) : <ui,exn> bool
  match rows
    Nil -> dom-same-node(cursor,last)
    Cons(row,rest) ->
      if !dom-same-node(cursor,row.row-first) then False
      else
        val next = range-next(parent,row.row-first,row.row-last)
        keyed-order-matches(parent,last,next,rest)

fun place-keyed-updates<a,k,e::E>(parent : node, cursor : node,
                        updates : list<keyed-update<e,a,k>>)
                       : <ui,exn> node
  match updates
    Nil -> cursor
    Cons(update,rest) ->
      val row = update.update-row
      val next = range-next(parent,row.row-first,row.row-last)
      if dom-same-node(cursor,row.row-first)
      then place-keyed-updates(parent,next,rest)
      else
        move-range-before(parent,row.row-first,row.row-last,cursor)
        place-keyed-updates(parent,cursor,rest)

fun collect-stale-rows<a,k,e::E>(rows : list<keyed-row<e,a,k>>,
                       next : key-index<k,keyed-row<e,a,k>>,
                       compare : (k,k) -> order)
                      : list<keyed-row<e,a,k>>
  match rows
    Nil -> []
    Cons(row,rest) ->
      match next.find(row.row-key,compare)
        Just(_) -> collect-stale-rows(rest,next,compare)
        Nothing -> Cons(row,collect-stale-rows(rest,next,compare))

fun commit-keyed-update<a,k,e::E>(update : keyed-update<e,a,k>)
                                  : signal-write ()
  val row = update.update-row
  if update.update-item-changed then
    row.row-item-source.set(update.update-item)
    transaction-store(row.row-current-item,update.update-item)
  else ()
  if update.update-index-changed then
    row.row-index-source.set(update.update-index)
    transaction-store(row.row-current-index,update.update-index)
  else ()

fun create-keyed-row<a,k,e::E>(
      root : root<<ui|e>>, parent : node, last : node,
      identity : k, item : a, index : int,
      children : (item : accessor<a>, index : accessor<int>)
                 -> <html<e>,signal-read> ())
    : <signal-write,ui,pure|e> keyed-row<e,a,k>
  val owner = internal/open-structural-owner(root)
  val committed = transaction-cell(False)
  val installed = transaction-cell(False)
  val range-owned = transaction-cell(False)
  finally(
    fn() {
      if transaction-load(committed) then ()
      else reactive-ui-exn-open{
        internal/dispose-structural-owner(owner)
      }
    },
    fn()
      internal/with-structural-owner(root,owner,fn()
        val first = dom-attempt{ dom-create-comment("kokaine:for-row") }
        val row-last = dom-attempt{ dom-create-comment("/kokaine:for-row") }
        finally(
          fn() {
            // Cover the tiny interval between publishing the pair and parking
            // its owner cleanup.  The pair insertion primitive compensates a
            // commit-then-throw before `installed` can become true.
            if transaction-load(installed) &&
               !transaction-load(range-owned)
            then reactive-ui-exn{
              dom-attempt{ dom-remove-range(first,row-last) }
            }
            else ()
          },
          fn()
            insert-marker-pair(parent,Just(last),first,row-last)
            transaction-store(installed,True)
            on-cleanup(root,fn()
              reactive-ui-exn{
                dom-attempt{ dom-remove-range(first,row-last) }
              }
            )
            transaction-store(range-owned,True)

            // The reconciler performs item equality before committing.  These
            // sources therefore use a total always-publish equality and are
            // written only for values already known to have changed.
            val item-source = signal-always(root,item)
            val index-source = signal-always(root,index)
            val tree = reactive-sample(root,fn()
              view fn()
                children(fn() item-source.get,fn() index-source.get)
            )
            mount-view(root,parent,Just(row-last),tree)
            // Keep descendant bootstrap capabilities queued until every draft
            // row is reachable from the reconciler's rollback ledger.  The
            // reconciler settles all draft owners as one targeted set.
            val row = Keyed-row(
              identity,transaction-cell(item),transaction-cell(index),
              item-source,index-source,owner,first,row-last)
            transaction-store(committed,True)
            row
        )
      )
  )

fun reconcile-keyed<a,k,e::E>(
      root : root<<ui|e>>, parent : node, first : node, last : node,
      owner : structural-owner<<ui|e>>,
      table : ref<global,keyed-table<e,a,k>>, items : list<a>,
      key : (a) -> k,
      compare : (k,k) -> order, item-equals : (a,a) -> bool,
      children : (item : accessor<a>, index : accessor<int>)
                 -> <html<e>,signal-read> ())
    : <signal-write,ui,pure|e> ()
  match transaction-load(table)
    Keyed-table(old-index,old-order) ->
      val next-index = transaction-cell(
        kokaine/internal/key-index/empty())
      val updates = transaction-cell([])
      val drafts = transaction-cell([])
      val position = transaction-cell(0)
      val move-phase = transaction-cell(False)
      val committed = transaction-cell(False)
      finally(
        // Row disposal leaves inert structural registrations in this owner's
        // ledger.  Compact once after either stale retirement or draft
        // rollback so retained memory remains proportional to live rows.
        fn() internal/compact-structural-owner(owner),
        fn()
        finally(
          fn() {
            if transaction-load(committed) then () else
              // Draft owner cleanup and order restoration are both exhaustive.
              // `finally` makes a failure in either path unable to skip the other.
              reactive-ui-exn-open{
                finally(
                  fn() {
                    if transaction-load(move-phase)
                    then rollback-keyed-order(parent,last,old-order)
                    else ()
                  },
                  fn() dispose-keyed-rows(transaction-load(drafts))
                )
              }
          },
          fn()
          val old-cursor = range-first(parent,first,last)
          validate-keyed-order(parent,last,old-cursor,old-order)

          // Reject the complete key set before creating or connecting a draft
          // row. Lifecycle callbacks are externally observable and cannot be
          // rolled back after a later duplicate is discovered.
          val seen-identities = transaction-cell(
            kokaine/internal/key-index/empty())
          val keyed-items = transaction-cell([])
          items.foreach fn(item)
            val identity = key(item)
            match transaction-load(seen-identities).insert(
                    identity,identity,compare)
              Duplicate(_) -> throw("duplicate key in keyed For")
              Inserted(next) ->
                transaction-store(seen-identities,next)
                transaction-store(keyed-items,
                  Cons((item,identity),transaction-load(keyed-items)))

          transaction-load(keyed-items).reverse.foreach fn(keyed-item)
            val (item,identity) = keyed-item
            val current-index = transaction-load(position)
            val (row,item-changed) =
              match old-index.find(identity,compare)
                Just(existing) ->
                  (existing,
                   !item-equals(transaction-load(existing.row-current-item),
                                item))
                Nothing ->
                  val draft = create-keyed-row(
                    root,parent,last,identity,item,current-index,children)
                  // Publish the draft handle before another fallible comparison
                  // so final-control and comparator failure can always reach it.
                  transaction-store(drafts,
                    Cons(draft,transaction-load(drafts)))
                  (draft,False)

            match transaction-load(next-index).insert(
                    identity,row,compare)
              Duplicate(_) -> throw("duplicate key in keyed For")
              Inserted(next) -> transaction-store(next-index,next)

            val update = Keyed-update(
              row,item,current-index,item-changed,
              transaction-load(row.row-current-index) != current-index)
            transaction-store(updates,
              Cons(update,transaction-load(updates)))
            transaction-store(position,current-index + 1)

          val final-updates = transaction-load(updates).reverse
          val final-index = transaction-load(next-index)
          // Comparator failures while finding stale rows still happen before
          // the first move, so the old DOM and sources remain untouched.
          val stale = collect-stale-rows(old-order,final-index,compare)
          val final-order = final-updates.map(fn(update) update.update-row)

          // Every draft is now rollback-reachable and all comparator work has
          // succeeded.  Mark the draft owners together, but let the canonical
          // continuation queue retain FIFO bootstrap order across their rows.
          val draft-owners =
            transaction-load(drafts).map(fn(row) row.row-owner)
          reactive-structural{
            internal/bootstrap-structural-owners(draft-owners)
          }

          // Fail closed before the first physical move if a retained custom
          // element would receive synchronous disconnect/reconnect callbacks.
          val current-cursor = range-first(parent,first,last)
          if keyed-order-matches(
               parent,last,current-cursor,final-order ++ stale)
          then ()
          else validate-keyed-move-lifecycles(parent,final-order)
          transaction-store(move-phase,True)
          val cursor = range-first(parent,first,last)
          val _ = place-keyed-updates(parent,cursor,final-updates)

          // Moving a row may synchronously reconnect custom elements.  Validate
          // the complete region after those callbacks and before publishing any
          // owner, source, or table state.
          val placed = range-first(parent,first,last)
          validate-keyed-order(parent,last,placed,final-order ++ stale)

          // A synchronous host callback can retire the parent while a fallback
          // fragment move is in progress.  Re-entering validates the persistent
          // frame once more before any source/table publication.
          reactive-structural{
            internal/with-structural-owner(root,owner,fn() ())
          }

          // Reconciliation is itself an effect publication inside the active
          // scheduler flush, so source notifications queue work but cannot
          // settle between these writes.  No nested public batch is necessary.
          reactive-write-ui{
            final-updates.foreach(fn(update) commit-keyed-update(update))
          }
          transaction-store(table,Keyed-table(final-index,final-order))
          transaction-store(committed,True)

          // Removed rows retire only after the new table and all row sources are
          // coherent.  Cleanup writes merely queue a later collection turn.
          reactive-ui-exn-open{
            dispose-keyed-rows(stale)
          }
        )
      )

fun mount-keyed-fields<s,a,k,e::E>(
      root : root<<ui|e>>, parent : node, before : maybe<node>,
      read : () -> signal-read s,
      walk : forall<p::E> (s,(a) -> p ()) -> p (), key : (a) -> k,
      compare : (k,k) -> order, item-equals : (a,a) -> bool,
      children : (item : accessor<a>, index : accessor<int>)
                 -> <html<e>,signal-read> ())
    : <signal-write,ui,pure|e> ()
  val owner = internal/open-structural-owner(root)
  val committed = transaction-cell(False)
  val installed = transaction-cell(False)
  val range-owned = transaction-cell(False)
  finally(
    fn() {
      if transaction-load(committed) then ()
      else reactive-ui-exn-open{
        internal/dispose-structural-owner(owner)
      }
    },
    fn()
      internal/with-structural-owner(root,owner,fn()
        val first = dom-attempt{ dom-create-comment("kokaine:for") }
        val last = dom-attempt{ dom-create-comment("/kokaine:for") }
        finally(
          fn() {
            if transaction-load(installed) &&
               !transaction-load(range-owned)
            then reactive-ui-exn{
              dom-attempt{ dom-remove-range(first,last) }
            }
            else ()
          },
          fn()
            insert-marker-pair(parent,before,first,last)
            transaction-store(installed,True)
            on-cleanup(root,fn()
              reactive-ui-exn{
                dom-attempt{ dom-remove-range(first,last) }
              }
            )
            transaction-store(range-owned,True)
            val table = transaction-cell(Keyed-table(
              kokaine/internal/key-index/empty(),[]))
            val dispose = create-effect(
              root,fn() tracked(read),fn(snapshot)
                internal/with-structural-owner(root,owner,fn()
                  // Keep the higher-ranked source walker local to the packed
                  // collection closure.  Koka 3.2.3 mis-specializes it if it
                  // crosses another generic function boundary.  This still
                  // walks the tracked snapshot exactly once.
                  val items = transaction-cell([])
                  walk(snapshot) fn(item)
                    transaction-store(items,
                      Cons(item,transaction-load(items)))
                  reconcile-keyed(
                    root,parent,first,last,owner,table,
                    transaction-load(items).reverse,
                    key,compare,item-equals,children)
                )
            )
            transaction-store(committed,True)
            ()
        )
      )
  )

fun mount-keyed-plan<e::E>(root : root<<ui|e>>, parent : node,
                     before : maybe<node>, plan : keyed-plan<e>)
                    : <signal-write,ui,pure|e> ()
  match plan
    Keyed-plan(spec) ->
      match spec
        Keyed-spec(read,walk,key,compare,item-equals,children) ->
          mount-keyed-fields(
            root,parent,before,read,walk,key,compare,item-equals,children)

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
    Keyed-region(plan) -> mount-keyed-plan(root,parent,before,plan)
    Raw-html(content) ->
      insert-html(root,parent,before,trusted-content(content))

fun mount-effect(root : root<<ui|e>>, parent : node, tree : view<e>)
                 : <signal-write,ui,pure|e> disposer<<ui|e>>
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

fun mount-transaction(root : root<<ui|e>>, parent : node, tree : view<e>,
                      inherit-owner : bool)
                     : <ui,exn|e> disposer<<ui|e>>
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

pub fun mount(root : root<<ui|e>>, parent : node, tree : view<e>)
             : <ui,exn|e> disposer<<ui|e>>
  mount-transaction(root,parent,tree,True)

// Opt out of physical DOM ownership inheritance for intentionally independent
// roots mounted inside a managed subtree. The caller then owns the returned
// disposer and must retire it explicitly.
pub fun mount-independent(root : root<<ui|e>>, parent : node, tree : view<e>)
                         : <ui,exn|e> disposer<<ui|e>>
  mount-transaction(root,parent,tree,False)

pub fun unmount(dispose : disposer<<ui|e>>) : <ui,exn|e> ()
  dispose()
