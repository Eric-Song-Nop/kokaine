/*--------------------------------------------------------------------------
  Fine-grained browser DOM adapter for Koka's `jsweb` backend.

  Browser values are one-field wrappers around `any`; these erase to the raw
  JavaScript object. Every persistent listener and DOM range is attached to
  the continuation generation which created it and retires with that extent.
--------------------------------------------------------------------------*/
module kokaine/dom

import kokaine/reactive
import kokaine/reactive/integration
import kokaine/reactive/async
import kokaine/html
import kokaine/internal/event-runtime
import kokaine/internal/key-index
import kokaine/internal/compat
import kokaine/dom/internal/keyed-transaction
import std/core/unsafe
import std/core/undiv


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

// A staged retirement snapshots a complete row range once. Later retries use
// that snapshot instead of requiring the marker endpoints to remain attached.
abstract type dom-retirement
  Dom-retirement(value : any)

type owner-match
  Owner-none
  Owner-live(owner-portal : reentry<<ui>>)
  Owner-retired

pub type toggle-state
  Toggle-open
  Toggle-closed

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
    row-scope         : lifetime-scope<<ui>>,
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

type keyed-retirement<e::E,a,k>
  Keyed-retirement(
    retirement-row    : keyed-row<e,a,k>,
    retirement-handle : dom-retirement
  )

type keyed-table<e::E,a,k>
  Keyed-table(
    table-index : key-index<k,keyed-row<e,a,k>>,
    table-order : list<keyed-row<e,a,k>>,
    table-retirements : list<keyed-retirement<e,a,k>>
  )

// The renderer, not Reactive, decides whether this reconciliation owns a new
// provision or joins the journal already draining on this mount. A joiner has
// no lease and therefore cannot drain, promote, or discard outer work.
type keyed-participation
  Keyed-owned(
    keyed-provision : provision<<ui>>,
    keyed-lease     : provision-lease<<ui>>,
    keyed-journal   : keyed-transaction
  )
  Keyed-joined(
    keyed-provision : provision<<ui>>,
    keyed-journal   : keyed-transaction
  )

fun keyed-participation/journal(current : keyed-participation)
                                : keyed-transaction
  match current
    Keyed-owned(_,_,journal) -> journal
    Keyed-joined(_,journal) -> journal

fun keyed-participation/is-owned(current : keyed-participation) : bool
  match current
    Keyed-owned(_,_,_) -> True
    Keyed-joined(_,_) -> False

fun open-keyed-participation(renderer : keyed-context,
                             root : root<<ui>>)
                            : exn keyed-participation
  match current-provision(root)
    Nothing ->
      val lease = open-provision(root)
      val current = lease.provision
      Keyed-owned(current,lease,new-keyed-transaction())
    Just(current) -> Keyed-joined(
      current,current-keyed-transaction(renderer,current))

fun drain-keyed-participation(renderer : keyed-context,
                              current : keyed-participation)
                             : <div,ui,exn> ()
  match current
    Keyed-owned(provision,lease,journal) ->
      with-keyed-transaction(
        renderer,provision,journal,fn() drain-provision(lease))
    Keyed-joined(_,_) -> ()

fun promote-keyed-participation(current : keyed-participation)
                                : <div,ui,exn> ()
  match current
    Keyed-owned(_,lease,_) -> promote-provision(lease)
    Keyed-joined(_,_) -> ()

fun discard-keyed-participation(current : keyed-participation)
                                : <ui,exn> ()
  match current
    Keyed-owned(_,lease,journal) -> finally(
      fn() abort-keyed-transaction(journal),
      fn() discard-provision(lease))
    Keyed-joined(_,_) -> ()

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

// Closed shadow roots are intentionally opaque, so a keyed move cannot inspect
// them for custom-element callbacks after the fact. Install one wrapper per DOM
// realm before mount construction and remember both observed closed hosts and
// elements whose provenance proves that they had no pre-existing closed root.
// If another host shim replaces the wrapper, later moves fail closed. As with
// the rest of the DOM adapter, direct calls through deliberately retained or
// foreign native primitives are outside the cooperative host contract.
extern dom-install-shadow-tracker(parent : node) : ui ()
  js inline "(function(parent){ var doc=parent && (parent.nodeType===9 ? parent : parent.ownerDocument); var view=doc && doc.defaultView; if(!view || !view.Element) throw new Error('cannot install Kokaine shadow-root tracking outside a DOM realm'); var key=Symbol.for('kokaine.dom.shadow-roots'); var tracker=globalThis[key]; if(!tracker){ tracker={ version:1, known:new WeakSet(), closed:new WeakSet(), realms:new WeakMap() }; tracker.remember=function(root){ var pending=root && root.childNodes ? Array.prototype.slice.call(root.childNodes) : []; while(pending.length){ var current=pending.pop(); if(current && current.nodeType===1){ tracker.known.add(current); if(current.localName==='template' && current.content){ var mode=current.getAttribute('shadowrootmode'); if(mode && mode.toLowerCase()==='closed' && current.parentNode && current.parentNode.nodeType===1) tracker.closed.add(current.parentNode); var templateChildren=Array.prototype.slice.call(current.content.childNodes); for(var j=0;j<templateChildren.length;j++) pending.push(templateChildren[j]); } } var children=current && current.childNodes ? Array.prototype.slice.call(current.childNodes) : []; for(var i=0;i<children.length;i++) pending.push(children[i]); } }; globalThis[key]=tracker; } if(tracker.version!==1 || !tracker.known || !tracker.closed || !tracker.realms || typeof tracker.remember!=='function') throw new Error('invalid Kokaine shadow-root tracker'); var prototype=view.Element.prototype; var state=tracker.realms.get(view); if(state){ var intact=state.wrapper ? prototype.attachShadow===state.wrapper : typeof prototype.attachShadow!=='function'; if(state.prototype!==prototype || !intact) throw new Error('Kokaine shadow-root tracking was replaced'); return; } var descriptor=Object.getOwnPropertyDescriptor(prototype,'attachShadow'); if(!descriptor || typeof descriptor.value!=='function'){ if(typeof prototype.attachShadow==='function') throw new Error('cannot safely wrap this DOM realm attachShadow implementation'); tracker.realms.set(view,{ prototype:prototype, wrapper:null }); return; } var original=descriptor.value; var wrapper=function attachShadow(){ var root=original.apply(this,arguments); tracker.known.add(this); try { var mode=root && root.mode; if(mode!=='open') tracker.closed.add(this); } catch(error) { tracker.closed.add(this); throw error; } return root; }; Object.defineProperty(prototype,'attachShadow',{ configurable:descriptor.configurable, enumerable:descriptor.enumerable, writable:descriptor.writable, value:wrapper }); tracker.realms.set(view,{ prototype:prototype, wrapper:wrapper }); })(#1)"

extern dom-create-element(parent : node, name : string) : ui element
  js inline "(function(parent,name){ var doc=parent && (parent.nodeType===9 ? parent : parent.ownerDocument); if(!doc) throw new Error('cannot create a Kokaine element without an owner document'); var value=doc.createElement(name); var tracker=globalThis[Symbol.for('kokaine.dom.shadow-roots')]; if(tracker && tracker.known) tracker.known.add(value); return value; })(#1,#2)"

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

extern dom-same-node(left : node, right : node) : bool
  js inline "(#1 === #2)"

// Validate a complete managed range before exposing either cursor.  The DOM
// can be mutated by application JavaScript, custom-element callbacks, or test
// fault injection, so reconciliation never trusts retained marker handles.
extern dom-range-first(parent : node, first : node, last : node) : ui node
  js inline "(function(rangeParent,rangeFirst,rangeLast){ if(!rangeParent || !rangeFirst || !rangeLast || rangeFirst===rangeLast || rangeFirst.parentNode!==rangeParent || rangeLast.parentNode!==rangeParent){ throw new Error('invalid Kokaine DOM range: endpoints do not share the expected parent'); } var n=rangeFirst; while(n && n!==rangeLast) n=n.nextSibling; if(n!==rangeLast){ throw new Error('invalid Kokaine DOM range: closing marker is not reachable after opening marker'); } return rangeFirst.nextSibling; })(#1,#2,#3)"

extern dom-range-next(parent : node, first : node, last : node) : ui node
  js inline "(function(rangeParent,rangeFirst,rangeLast){ if(!rangeParent || !rangeFirst || !rangeLast || rangeFirst===rangeLast || rangeFirst.parentNode!==rangeParent || rangeLast.parentNode!==rangeParent){ throw new Error('invalid Kokaine DOM range: endpoints do not share the expected parent'); } var n=rangeFirst; while(n && n!==rangeLast) n=n.nextSibling; if(n!==rangeLast){ throw new Error('invalid Kokaine DOM range: closing marker is not reachable after opening marker'); } var next=rangeLast.nextSibling; if(!next){ throw new Error('invalid Kokaine keyed DOM range: row has no following boundary'); } return next; })(#1,#2,#3)"

// Move one inclusive row range with verified host operations.  Validation is
// deliberately complete before extraction.  Custom-element-shaped nodes,
// opaque shadow hosts, and opaque focused subtrees fail before movement because
// their synchronous or hidden state cannot be published atomically.  If
// extraction, insertion,
// focus restoration, or a commit-then-throw host primitive fails, every
// snapshotted node is pulled back before the original successor through the
// same-realm parent prototype.  No node is cloned, so ordinary object identity,
// listeners, form values, and owner registrations are retained.
extern dom-validate-range-move-lifecycle(parent : node, first : node,
                                         last : node) : ui ()
  js inline "(function(rangeParent,rangeFirst,rangeLast){ var doc=rangeParent && (rangeParent.nodeType===9 ? rangeParent : rangeParent.ownerDocument); var view=doc && doc.defaultView; var tracker=globalThis[Symbol.for('kokaine.dom.shadow-roots')]; var state=view && tracker && tracker.realms && tracker.realms.get(view); var prototype=view && view.Element && view.Element.prototype; var intact=state && state.prototype===prototype && (state.wrapper ? prototype.attachShadow===state.wrapper : typeof prototype.attachShadow!=='function'); if(!tracker || tracker.version!==1 || !tracker.known || !tracker.closed || !state || !intact) throw new Error('cannot safely move keyed row: shadow-root tracking is unavailable'); var documentPrototype=view.Document && view.Document.prototype; var createElement=documentPrototype && documentPrototype.createElement; var createElementNS=documentPrototype && documentPrototype.createElementNS; var outerHTMLDescriptor=prototype && Object.getOwnPropertyDescriptor(prototype,'outerHTML'); var serializeOuterHTML=outerHTMLDescriptor && outerHTMLDescriptor.get; if(typeof createElement!=='function' || typeof createElementNS!=='function' || typeof serializeOuterHTML!=='function') throw new Error('cannot safely move keyed row: native element inspection is unavailable'); function canHostShadow(element){ var name=element.localName || ''; return name.indexOf('-')>=0 || ['article','aside','blockquote','body','div','footer','h1','h2','h3','h4','h5','h6','header','main','nav','p','section','span'].indexOf(name)>=0; } function hasCustomPrototype(element){ var name=element.localName || ''; if(name.indexOf('-')>=0) return true; var namespace=element.namespaceURI; var baseline=namespace ? createElementNS.call(doc,namespace,name) : createElement.call(doc,name); return Object.getPrototypeOf(element)!==Object.getPrototypeOf(baseline); } function hasSerializedIsValue(element){ var serialized=serializeOuterHTML.call(element); var end=serialized.indexOf('>'); return end>=0 && serialized.slice(0,end).indexOf(' is=\"')>=0; } var pending=[]; var n=rangeFirst; while(n){ pending.push(n); if(n===rangeLast) break; n=n.nextSibling; } if(n!==rangeLast) throw new Error('invalid Kokaine DOM move: closing marker is not reachable after opening marker'); while(pending.length){ var current=pending.pop(); if(current && current.nodeType===1){ if(!(current instanceof view.Element)) throw new Error('cannot safely move keyed row: foreign-realm element lifecycle state is opaque'); var customized=current.getAttribute('is'); if(customized || hasCustomPrototype(current) || hasSerializedIsValue(current)) throw new Error('cannot safely move keyed row: custom-element move callbacks are synchronous and cannot be atomically published'); if(tracker.closed.has(current)) throw new Error('cannot safely move keyed row: closed shadow roots are opaque'); if(state.wrapper && !current.shadowRoot && canHostShadow(current) && !tracker.known.has(current)) throw new Error('cannot safely move keyed row: an external shadow host may contain an untracked closed root'); } var children=current && current.childNodes ? Array.prototype.slice.call(current.childNodes) : []; if(current && current.shadowRoot) children=children.concat(Array.prototype.slice.call(current.shadowRoot.childNodes)); for(var i=0;i<children.length;i++) pending.push(children[i]); } })(#1,#2,#3)"

extern dom-validate-range-move-focus(parent : node, first : node,
                                     last : node) : ui ()
  js inline "(function(rangeParent,rangeFirst,rangeLast){ var rangeDocument=rangeParent && (rangeParent.nodeType===9 ? rangeParent : rangeParent.ownerDocument); var rangeView=rangeDocument && rangeDocument.defaultView; if(!rangeDocument || !rangeView) throw new Error('cannot inspect keyed-row focus outside a DOM realm'); function movePrimitive(parent){ if(rangeView.Document && parent instanceof rangeView.Document && typeof rangeView.Document.prototype.moveBefore==='function') return rangeView.Document.prototype.moveBefore; if(rangeView.DocumentFragment && parent instanceof rangeView.DocumentFragment && typeof rangeView.DocumentFragment.prototype.moveBefore==='function') return rangeView.DocumentFragment.prototype.moveBefore; if(rangeView.Element && parent instanceof rangeView.Element && typeof rangeView.Element.prototype.moveBefore==='function') return rangeView.Element.prototype.moveBefore; return null; } var primitive=movePrimitive(rangeParent); if(primitive && rangeParent.moveBefore===primitive) return; var pending=[]; var all=[]; var n=rangeFirst; while(n){ pending.push(n); if(n===rangeLast) break; n=n.nextSibling; } if(n!==rangeLast) throw new Error('invalid Kokaine DOM move: closing marker is not reachable after opening marker'); while(pending.length){ var current=pending.pop(); all.push(current); var children=current && current.childNodes ? Array.prototype.slice.call(current.childNodes) : []; if(current && current.shadowRoot) children=children.concat(Array.prototype.slice.call(current.shadowRoot.childNodes)); for(var i=0;i<children.length;i++) pending.push(children[i]); } var active=rangeDocument.activeElement; while(active && active.shadowRoot && active.shadowRoot.activeElement) active=active.shadowRoot.activeElement; if(!active || all.indexOf(active)<0) return; if(active.localName==='iframe') throw new Error('cannot safely move keyed row: fallback DOM moves cannot inspect the focused subtree'); if(typeof active.selectionStart==='number' && typeof active.selectionEnd==='number') return; var selectionRoot=active.getRootNode ? active.getRootNode() : rangeDocument; if(selectionRoot && selectionRoot.host && typeof selectionRoot.getSelection!=='function') throw new Error('cannot safely move keyed row: this browser cannot inspect shadow-root selections'); var selection=selectionRoot && typeof selectionRoot.getSelection==='function' ? selectionRoot.getSelection() : rangeDocument.getSelection(); if(selection && selection.rangeCount>0 && typeof selection.setBaseAndExtent!=='function') throw new Error('cannot safely move keyed row: this browser cannot restore directional DOM selections'); })(#1,#2,#3)"

extern dom-capture-range-focus(parent : node, first : node,
                               last : node) : ui any
  js inline "(function(rangeParent,rangeFirst,rangeLast){ var rangeDocument=rangeParent && (rangeParent.nodeType===9 ? rangeParent : rangeParent.ownerDocument); if(!rangeDocument) throw new Error('cannot capture keyed-row focus without an owner document'); var nodes=[]; var n=rangeFirst; while(n){ nodes.push(n); if(n===rangeLast) break; n=n.nextSibling; } if(n!==rangeLast) throw new Error('invalid Kokaine DOM move: closing marker is not reachable after opening marker'); function deepActive(){ var active=rangeDocument.activeElement; while(active && active.shadowRoot && active.shadowRoot.activeElement) active=active.shadowRoot.activeElement; return active; } function composedParent(node){ if(!node) return null; if(node.parentNode) return node.parentNode; var tree=node.getRootNode ? node.getRootNode() : null; return tree && tree.host ? tree.host : null; } function belongs(node){ var current=node; while(current){ if(nodes.indexOf(current)>=0) return true; current=composedParent(current); } return false; } function sameControlSelection(active,selection){ return active.selectionStart===selection[0] && active.selectionEnd===selection[1] && active.selectionDirection===selection[2]; } function sameDomSelection(selection,snapshot){ return selection.anchorNode===snapshot[0] && selection.anchorOffset===snapshot[1] && selection.focusNode===snapshot[2] && selection.focusOffset===snapshot[3]; } var active=deepActive(); var ownsFocus=!!active && belongs(active); var controlSelection=null; var domSelection=null; if(ownsFocus && typeof active.selectionStart==='number' && typeof active.selectionEnd==='number'){ controlSelection=[active.selectionStart,active.selectionEnd,active.selectionDirection]; } else if(ownsFocus){ var selectionRoot=active.getRootNode ? active.getRootNode() : rangeDocument; var selection=selectionRoot && typeof selectionRoot.getSelection==='function' ? selectionRoot.getSelection() : rangeDocument.getSelection(); if(selection && selection.rangeCount>0 && belongs(selection.anchorNode) && belongs(selection.focusNode)){ domSelection=[selection.anchorNode,selection.anchorOffset,selection.focusNode,selection.focusOffset]; } } return { restore:function(){ if(!ownsFocus) return; if(!active.isConnected) throw new Error('cannot restore keyed-row focus: the focused node was detached'); if(deepActive()!==active){ if(typeof active.focus!=='function') throw new Error('cannot restore keyed-row focus: the focused node is not focusable'); try { active.focus({ preventScroll:true }); } catch(_) { active.focus(); } if(deepActive()!==active) throw new Error('cannot restore keyed-row focus: focus restoration did not take effect'); } if(controlSelection){ if(typeof active.setSelectionRange!=='function') throw new Error('cannot restore keyed-row selection: the focused control has no selection API'); if(!sameControlSelection(active,controlSelection)) active.setSelectionRange(controlSelection[0],controlSelection[1],controlSelection[2]); if(!sameControlSelection(active,controlSelection)) throw new Error('cannot restore keyed-row selection: control selection restoration did not take effect'); } else if(domSelection){ if(!domSelection[0].isConnected || !domSelection[2].isConnected) throw new Error('cannot restore keyed-row selection: a selection endpoint was detached'); var selectionRoot=active.getRootNode ? active.getRootNode() : rangeDocument; var selection=selectionRoot && typeof selectionRoot.getSelection==='function' ? selectionRoot.getSelection() : rangeDocument.getSelection(); if(!selection || typeof selection.setBaseAndExtent!=='function') throw new Error('cannot restore keyed-row selection: the directional selection API is unavailable'); if(!sameDomSelection(selection,domSelection)) selection.setBaseAndExtent(domSelection[0],domSelection[1],domSelection[2],domSelection[3]); if(!sameDomSelection(selection,domSelection)) throw new Error('cannot restore keyed-row selection: DOM selection restoration did not take effect'); } } }; })(#1,#2,#3)"

extern dom-move-range-before(parent : node, first : node, last : node,
                             before : node, focus : any) : ui ()
  js inline "(function(rangeParent,rangeFirst,rangeLast,target,focusState){ if(!rangeParent || !rangeFirst || !rangeLast || !target || rangeFirst===rangeLast || rangeFirst.parentNode!==rangeParent || rangeLast.parentNode!==rangeParent || target.parentNode!==rangeParent){ throw new Error('invalid Kokaine DOM move: range and target must share the expected parent'); } var rangeDocument=rangeParent.nodeType===9 ? rangeParent : rangeParent.ownerDocument; var rangeView=rangeDocument && rangeDocument.defaultView; if(!rangeDocument || !rangeView || !rangeView.Node) throw new Error('cannot move a keyed row outside a DOM realm'); var nodePrototype=rangeView.Node.prototype; function movePrimitive(parent){ if(rangeView.Document && parent instanceof rangeView.Document && typeof rangeView.Document.prototype.moveBefore==='function') return rangeView.Document.prototype.moveBefore; if(rangeView.DocumentFragment && parent instanceof rangeView.DocumentFragment && typeof rangeView.DocumentFragment.prototype.moveBefore==='function') return rangeView.DocumentFragment.prototype.moveBefore; if(rangeView.Element && parent instanceof rangeView.Element && typeof rangeView.Element.prototype.moveBefore==='function') return rangeView.Element.prototype.moveBefore; return null; } var nodes=[]; var n=rangeFirst; while(n){ nodes.push(n); if(n===rangeLast) break; n=n.nextSibling; } if(n!==rangeLast){ throw new Error('invalid Kokaine DOM move: closing marker is not reachable after opening marker'); } if(nodes.indexOf(target)>=0){ throw new Error('invalid Kokaine DOM move: target lies inside the moved range'); } if(rangeLast.nextSibling===target) return; var originalNext=rangeLast.nextSibling; var nativeMove=movePrimitive(rangeParent); var preserveMoves=!!nativeMove && rangeParent.moveBefore===nativeMove; function restoreFocus(){ if(focusState && typeof focusState.restore==='function') focusState.restore(); } function gather(values){ var fragment=rangeDocument.createDocumentFragment(); for(var i=0;i<values.length;i++) nodePrototype.appendChild.call(fragment,values[i]); return fragment; } function place(anchor){ if(preserveMoves){ for(var i=0;i<nodes.length;i++) nativeMove.call(rangeParent,nodes[i],anchor); } else { rangeParent.insertBefore(gather(nodes),anchor); } } function detachMoved(){ var passes=Math.max(2,nodes.length+2); while(passes-- > 0){ var attached=false; for(var i=0;i<nodes.length;i++){ var parent=nodes[i].parentNode; if(parent){ attached=true; nodePrototype.removeChild.call(parent,nodes[i]); } } if(!attached) return; } throw new Error('a retired keyed range was synchronously reinserted'); } function verify(anchor){ for(var i=0;i<nodes.length;i++){ if(nodes[i].parentNode!==rangeParent) throw new Error('a moved node escaped its keyed range'); if(i>0 && nodes[i-1].nextSibling!==nodes[i]) throw new Error('the keyed range became non-contiguous'); } if(nodes[nodes.length-1].nextSibling!==anchor) throw new Error('the keyed range was not placed at its requested boundary'); } function rollback(){ if(originalNext && originalNext.parentNode!==rangeParent){ detachMoved(); throw new Error('the original keyed range successor was detached'); } var anchor=originalNext || null; if(preserveMoves){ for(var i=0;i<nodes.length;i++) nativeMove.call(rangeParent,nodes[i],anchor); } else { nodePrototype.insertBefore.call(rangeParent,gather(nodes),anchor); } restoreFocus(); verify(anchor); } try { place(target); restoreFocus(); verify(target); } catch(error) { try { rollback(); } catch(rollbackError) { throw new Error(String(error && error.message != null ? error.message : error) + '; keyed DOM move rollback failed: ' + String(rollbackError && rollbackError.message != null ? rollbackError.message : rollbackError)); } throw error; } })(#1,#2,#3,#4,#5)"

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

// Validate and snapshot an inclusive row range without changing the DOM.
extern dom-stage-retirement(first : node, last : node) : ui dom-retirement
  js inline "(function(){ var rangeFirst=#1; var rangeLast=#2; var parent=rangeFirst && rangeFirst.parentNode; if(!parent) throw new Error('invalid Kokaine keyed retirement range: opening marker is detached'); if(parent!==rangeLast.parentNode) throw new Error('invalid Kokaine keyed retirement range: endpoints have different parents'); if(rangeFirst===rangeLast) throw new Error('invalid Kokaine keyed retirement range: endpoints are identical'); var roots=[]; var node=rangeFirst; while(node){ roots.push(node); if(node===rangeLast) break; node=node.nextSibling; } if(node!==rangeLast) throw new Error('invalid Kokaine keyed retirement range: closing marker is unreachable'); var descendants=[]; var pending=roots.slice(); while(pending.length){ var current=pending.pop(); var children=current && current.childNodes ? Array.prototype.slice.call(current.childNodes) : []; if(current && current.shadowRoot) children=children.concat(Array.prototype.slice.call(current.shadowRoot.childNodes)); for(var i=0;i<children.length;i++){ descendants.push(children[i]); pending.push(children[i]); } } var doc=rangeFirst.ownerDocument; var view=doc && doc.defaultView; var proto=view && view.Node && view.Node.prototype; if(!proto || typeof proto.removeChild!=='function' || typeof proto.contains!=='function') throw new Error('cannot stage Kokaine keyed retirement without its DOM realm'); return { roots:roots, descendants:descendants, proto:proto }; })()"

// Detach a staged snapshot. If a host primitive throws before detaching its
// target, stop immediately so the complete remaining row stays retryable. A
// commit-then-throw is recognized by inspecting the target after the throw.
extern dom-run-retirement(value : dom-retirement) : ui ()
  js inline "(function(handle){ if(!handle || !handle.roots) return; var roots=handle.roots; var descendants=handle.descendants; var proto=handle.proto; var removeChild=proto && proto.removeChild; var contains=proto && proto.contains; if(typeof removeChild!=='function' || typeof contains!=='function') throw new Error('cannot run Kokaine keyed retirement without its DOM realm'); function retained(node){ var current=node; while(current){ for(var i=0;i<roots.length;i++){ if(roots[i]===current || contains.call(roots[i],current)) return true; } var tree=current.getRootNode ? current.getRootNode() : null; current=tree && tree.host ? tree.host : null; } return false; } function detach(node,escaped){ var parent=node && node.parentNode; if(!parent || (escaped && retained(node))) return; try { removeChild.call(parent,node); } catch(error) { if(node.parentNode && (!escaped || !retained(node))) throw error; } } var passes=Math.max(2,roots.length+descendants.length+2); while(passes-- > 0){ for(var i=0;i<roots.length;i++) detach(roots[i],false); for(var j=0;j<descendants.length;j++) detach(descendants[j],true); var pending=false; for(var r=0;r<roots.length;r++){ if(roots[r].parentNode){ pending=true; break; } } if(!pending){ for(var d=0;d<descendants.length;d++){ if(descendants[d].parentNode && !retained(descendants[d])){ pending=true; break; } } } if(!pending) return; } throw new Error('invalid Kokaine DOM cleanup: staged keyed nodes were synchronously reinserted'); })(#1)"

extern dom-release-retirement(value : dom-retirement) : ui ()
  js inline "(function(handle){ if(!handle) return; handle.roots=null; handle.descendants=null; handle.proto=null; })(#1)"

extern dom-append-html(parent : node, content : string,
                       root : root<<ui>>, portal : reentry<<ui>>)
                      : ui dom-owner-registration
  js inline "(function(parent){ var doc=parent && (parent.nodeType===9 ? parent : parent.ownerDocument); if(!doc) throw new Error('cannot create Kokaine trusted HTML without an owner document'); var template=doc.createElement('template'); template.innerHTML=#2; var tracker=globalThis[Symbol.for('kokaine.dom.shadow-roots')]; if(!tracker || typeof tracker.remember!=='function') throw new Error('cannot register Kokaine trusted HTML without shadow-root tracking'); tracker.remember(template.content); var key=Symbol.for('kokaine.dom.owners'); var registry=globalThis[key]; if(!registry || !registry.owners || !registry.roots){ registry={ owners:new WeakMap(), roots:new WeakMap(), nextId:1 }; globalThis[key]=registry; } var ownerId=registry.roots.get(#3); if(ownerId==null){ ownerId=registry.nextId++; registry.roots.set(#3,ownerId); } var handles=[]; Array.from(template.content.childNodes).forEach(function(child){ var entry={ ownerId:ownerId, portal:#4, retired:false }; registry.owners.set(child,entry); handles.push({ node:child, ownerId:ownerId, entry:entry }); }); try { parent.appendChild(template.content); return handles; } catch(error) { handles.forEach(function(handle){ var entry=handle.entry; if(entry){ entry.portal=null; entry.retired=true; } if(registry.owners.get(handle.node)===entry) registry.owners.set(handle.node,entry); handle.node=null; handle.entry=null; }); throw error; } })(#1)"

extern dom-insert-html-before(parent : node, before : node,
                              content : string, root : root<<ui>>,
                              portal : reentry<<ui>>)
                             : ui dom-owner-registration
  js inline "(function(parent,before){ var doc=parent && (parent.nodeType===9 ? parent : parent.ownerDocument); if(!doc) throw new Error('cannot create Kokaine trusted HTML without an owner document'); var template=doc.createElement('template'); template.innerHTML=#3; var tracker=globalThis[Symbol.for('kokaine.dom.shadow-roots')]; if(!tracker || typeof tracker.remember!=='function') throw new Error('cannot register Kokaine trusted HTML without shadow-root tracking'); tracker.remember(template.content); var key=Symbol.for('kokaine.dom.owners'); var registry=globalThis[key]; if(!registry || !registry.owners || !registry.roots){ registry={ owners:new WeakMap(), roots:new WeakMap(), nextId:1 }; globalThis[key]=registry; } var ownerId=registry.roots.get(#4); if(ownerId==null){ ownerId=registry.nextId++; registry.roots.set(#4,ownerId); } var handles=[]; Array.from(template.content.childNodes).forEach(function(child){ var entry={ ownerId:ownerId, portal:#5, retired:false }; registry.owners.set(child,entry); handles.push({ node:child, ownerId:ownerId, entry:entry }); }); try { parent.insertBefore(template.content,before); return handles; } catch(error) { handles.forEach(function(handle){ var entry=handle.entry; if(entry){ entry.portal=null; entry.retired=true; } if(registry.owners.get(handle.node)===entry) registry.owners.set(handle.node,entry); handle.node=null; handle.entry=null; }); throw error; } })(#1,#2)"

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

// Validate and invoke within one host action. The surrounding `dom-attempt`
// then translates both adapter validation failures and native DOM exceptions.
// Native Web IDL getters provide realm-neutral brand checks: unlike
// `instanceof`, they accept genuine nodes created by another same-origin realm.
extern dom-require-dialog-target(target : node, message : string) : ui ()
  js inline "(function(target,message){ if(typeof HTMLDialogElement !== 'function') throw new Error('HTMLDialogElement is not supported by this browser'); var descriptor=Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype,'open'); if(!descriptor || typeof descriptor.get!=='function') throw new Error('HTMLDialogElement.open is not supported by this browser'); try { Reflect.apply(descriptor.get,target,[]); } catch(_) { throw new TypeError(message); } })(#1,#2)"

extern dom-require-element-target(target : node, message : string) : ui ()
  js inline "(function(target,message){ if(typeof Element !== 'function') throw new Error('Element is not supported by this browser'); var descriptor=Object.getOwnPropertyDescriptor(Element.prototype,'localName'); if(!descriptor || typeof descriptor.get!=='function') throw new Error('Element.localName is not supported by this browser'); try { Reflect.apply(descriptor.get,target,[]); } catch(_) { throw new TypeError(message); } })(#1,#2)"

// Read the platform reflection getter directly. An own `popover` class field on
// a custom element must neither hide a real content attribute nor manufacture
// popover state where the browser has none.
extern dom-require-popover-target(target : node, message : string) : ui ()
  js inline "(function(target,message){ if(typeof HTMLElement !== 'function') throw new Error('HTMLElement is not supported by this browser'); var descriptor=Object.getOwnPropertyDescriptor(HTMLElement.prototype,'popover'); if(!descriptor || typeof descriptor.get!=='function') throw new Error('HTMLElement.popover is not supported by this browser'); var mode; try { mode=Reflect.apply(descriptor.get,target,[]); } catch(_) { throw new TypeError(message); } if(mode!=='auto' && mode!=='manual' && mode!=='hint') throw new TypeError(message); })(#1,#2)"

extern dom-dialog-show(target : node) : ui ()
  js inline "(function(target){ if(typeof target.show !== 'function') throw new Error('HTMLDialogElement.show() is not supported by this browser'); target.show(); })(#1)"

extern dom-dialog-show-modal(target : node) : ui ()
  js inline "(function(target){ if(typeof target.showModal !== 'function') throw new Error('HTMLDialogElement.showModal() is not supported by this browser'); target.showModal(); })(#1)"

extern dom-dialog-close(target : node, result : string) : ui ()
  js inline "(function(target,result){ if(typeof target.close !== 'function') throw new Error('HTMLDialogElement.close() is not supported by this browser'); target.close(result); })(#1,#2)"

// `close()` cannot emulate the cancellable `cancel` event from requestClose.
extern dom-dialog-request-close(target : node, result : string) : ui ()
  js inline "(function(target,result){ if(typeof target.requestClose !== 'function') throw new Error('HTMLDialogElement.requestClose() is not supported by this browser'); target.requestClose(result); })(#1,#2)"

extern dom-dialog-is-open(target : node) : ui bool
  js inline "!!(#1).open"

extern dom-dialog-is-modal(target : node) : ui bool
  js inline "(function(target){ if(typeof Element !== 'function' || typeof Element.prototype.matches !== 'function') throw new Error('Element.matches() is not supported by this browser'); try { return Reflect.apply(Element.prototype.matches,target,[':modal']); } catch(error) { if(!error || error.name!=='SyntaxError') throw error; } if(typeof HTMLDialogElement !== 'function') throw new Error('HTMLDialogElement is not supported by this browser'); var openDescriptor=Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype,'open'); var showModal=HTMLDialogElement.prototype.showModal; if(!openDescriptor || typeof openDescriptor.get!=='function') throw new Error('HTMLDialogElement.open is not supported by this browser'); if(typeof showModal!=='function') throw new Error('HTMLDialogElement.showModal() is not supported by this browser'); if(!Reflect.apply(openDescriptor.get,target,[])) return false; try { Reflect.apply(showModal,target,[]); return true; } catch(error) { if(error && error.name==='InvalidStateError') return false; throw error; } })(#1)"

extern dom-dialog-return-value(target : node) : ui string
  js inline "String((#1).returnValue)"

// A recognized reflected `popover` value distinguishes enabled elements from
// arbitrary nodes. Do not infer state or simulate unsupported native methods.
extern dom-popover-show(target : node) : ui ()
  js inline "(function(target){ if(typeof target.showPopover !== 'function') throw new Error('Element.showPopover() is not supported by this browser'); target.showPopover(); })(#1)"

extern dom-popover-hide(target : node) : ui ()
  js inline "(function(target){ if(typeof target.hidePopover !== 'function') throw new Error('Element.hidePopover() is not supported by this browser'); target.hidePopover(); })(#1)"

// Some older implementations return `undefined`; querying the selector after
// the call gives Koka the authoritative post-toggle state in every case.
extern dom-popover-toggle(target : node) : ui bool
  js inline "(function(target){ if(typeof target.togglePopover !== 'function') throw new Error('Element.togglePopover() is not supported by this browser'); target.togglePopover(); if(typeof target.matches !== 'function') throw new Error('Element.matches() is not supported by this browser'); return target.matches(':popover-open'); })(#1)"

// The force overload arrived after the core Popover API. Compare state first so
// older implementations which ignore that argument still provide a true setter.
// A same-state force call still performs native validity checks; delegate an
// invalid case to the unforced method so its DOMException is not suppressed.
// `:modal` covers modal dialogs and the target's own fullscreen flag. Unlike
// `:fullscreen`, it does not match a retargeted shadow host.
extern dom-popover-set-open(target : node, open : bool) : ui ()
  js inline "(function(target,open){ if(typeof target.togglePopover !== 'function') throw new Error('Element.togglePopover() is not supported by this browser'); if(typeof Node !== 'function') throw new Error('Node is not supported by this browser'); if(typeof Document !== 'function') throw new Error('Document is not supported by this browser'); if(typeof Element !== 'function' || typeof Element.prototype.matches !== 'function') throw new Error('Element.matches() is not supported by this browser'); var connectedDescriptor=Object.getOwnPropertyDescriptor(Node.prototype,'isConnected'); var documentDescriptor=Object.getOwnPropertyDescriptor(Node.prototype,'ownerDocument'); var viewDescriptor=Object.getOwnPropertyDescriptor(Document.prototype,'defaultView'); if(!connectedDescriptor || typeof connectedDescriptor.get!=='function') throw new Error('Node.isConnected is not supported by this browser'); if(!documentDescriptor || typeof documentDescriptor.get!=='function') throw new Error('Node.ownerDocument is not supported by this browser'); if(!viewDescriptor || typeof viewDescriptor.get!=='function') throw new Error('Document.defaultView is not supported by this browser'); var nativeMatches=Element.prototype.matches; var matches=function(selector){ return Reflect.apply(nativeMatches,target,[selector]); }; var current=matches(':popover-open'); var desired=!!open; if(current!==desired){ target.togglePopover(); return; } if(desired){ if(typeof target.showPopover !== 'function') throw new Error('Element.showPopover() is not supported by this browser'); target.showPopover(); return; } var doc=Reflect.apply(documentDescriptor.get,target,[]); var view=Reflect.apply(viewDescriptor.get,doc,[]); var connected=Reflect.apply(connectedDescriptor.get,target,[]); var inactive=!connected || !view; if(!inactive){ try { if(view.document!==doc) inactive=true; while(!inactive && view.parent!==view){ var parent=view.parent; var listed=false; for(var i=0;i<parent.length;i++){ if(parent[i]===view){ listed=true; break; } } if(!listed){ inactive=true; break; } view=parent; } } catch(_) { inactive=true; } } if(inactive || matches(':modal')) target.togglePopover(); })(#1,#2)"

extern dom-popover-is-open(target : node) : ui bool
  js inline "(function(target){ if(typeof target.matches !== 'function') throw new Error('Element.matches() is not supported by this browser'); return target.matches(':popover-open'); })(#1)"

extern dom-toggle-state(value : any) : ui int
  js inline "(function(event){ if(!event || typeof event!=='object') throw new TypeError('toggle/state requires a DOM event'); if(event.type!=='toggle' && event.type!=='beforetoggle') throw new TypeError('toggle/state requires a toggle or beforetoggle event'); var target=event.currentTarget; if(typeof Element !== 'function') throw new Error('Element is not supported by this browser'); var descriptor=Object.getOwnPropertyDescriptor(Element.prototype,'localName'); if(!descriptor || typeof descriptor.get!=='function') throw new Error('Element.localName is not supported by this browser'); try { Reflect.apply(descriptor.get,target,[]); } catch(_) { throw new TypeError('toggle/state event must have an Element currentTarget'); } if(event.newState==='open') return 1; if(event.newState==='closed') return 0; throw new TypeError('toggle/state event must have an open or closed newState'); })(#1)"

extern dom-dialog-event-return-value(value : any) : ui string
  js inline "(function(event){ if(!event || typeof event!=='object' || event.type!=='close') throw new TypeError('dialog/event-return-value requires a close event'); var target=event.currentTarget; if(typeof HTMLDialogElement !== 'function') throw new Error('HTMLDialogElement is not supported by this browser'); var descriptor=Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype,'open'); if(!descriptor || typeof descriptor.get!=='function') throw new Error('HTMLDialogElement.open is not supported by this browser'); try { Reflect.apply(descriptor.get,target,[]); } catch(_) { throw new TypeError('dialog/event-return-value event must have an HTMLDialogElement currentTarget'); } return String(target.returnValue); })(#1)"

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

pub fun dialog/show(target : node) : <ui,exn> ()
  dom-attempt{
    dom-require-dialog-target(target,
      "dialog/show target must be an HTMLDialogElement")
    dom-dialog-show(target)
  }

pub fun dialog/show-modal(target : node) : <ui,exn> ()
  dom-attempt{
    dom-require-dialog-target(target,
      "dialog/show-modal target must be an HTMLDialogElement")
    dom-dialog-show-modal(target)
  }

pub fun dialog/close(target : node, result : string = "") : <ui,exn> ()
  dom-attempt{
    dom-require-dialog-target(target,
      "dialog/close target must be an HTMLDialogElement")
    dom-dialog-close(target,result)
  }

pub fun dialog/request-close(target : node, result : string = "")
                        : <ui,exn> ()
  dom-attempt{
    dom-require-dialog-target(target,
      "dialog/request-close target must be an HTMLDialogElement")
    dom-dialog-request-close(target,result)
  }

pub fun dialog/is-open(target : node) : <ui,exn> bool
  dom-attempt{
    dom-require-dialog-target(target,
      "dialog/is-open target must be an HTMLDialogElement")
    dom-dialog-is-open(target)
  }

pub fun dialog/is-modal(target : node) : <ui,exn> bool
  dom-attempt{
    dom-require-dialog-target(target,
      "dialog/is-modal target must be an HTMLDialogElement")
    dom-dialog-is-modal(target)
  }

pub fun dialog/return-value(target : node) : <ui,exn> string
  dom-attempt{
    dom-require-dialog-target(target,
      "dialog/return-value target must be an HTMLDialogElement")
    dom-dialog-return-value(target)
  }

pub fun dialog/event-return-value(value : event) : <ui,exn> string
  dom-attempt{ dom-dialog-event-return-value(value.original) }

pub fun popover/show(target : node) : <ui,exn> ()
  dom-attempt{
    dom-require-element-target(target,
      "popover/show target must be an Element")
    dom-require-popover-target(target,
      "popover/show target must have a valid popover attribute")
    dom-popover-show(target)
  }

pub fun popover/hide(target : node) : <ui,exn> ()
  dom-attempt{
    dom-require-element-target(target,
      "popover/hide target must be an Element")
    dom-require-popover-target(target,
      "popover/hide target must have a valid popover attribute")
    dom-popover-hide(target)
  }

pub fun popover/toggle(target : node) : <ui,exn> bool
  dom-attempt{
    dom-require-element-target(target,
      "popover/toggle target must be an Element")
    dom-require-popover-target(target,
      "popover/toggle target must have a valid popover attribute")
    dom-popover-toggle(target)
  }

pub fun popover/set-open(target : node, open : bool) : <ui,exn> ()
  dom-attempt{
    dom-require-element-target(target,
      "popover/set-open target must be an Element")
    dom-require-popover-target(target,
      "popover/set-open target must have a valid popover attribute")
    dom-popover-set-open(target,open)
  }

pub fun popover/is-open(target : node) : <ui,exn> bool
  dom-attempt{
    dom-require-element-target(target,
      "popover/is-open target must be an Element")
    dom-require-popover-target(target,
      "popover/is-open target must have a valid popover attribute")
    dom-popover-is-open(target)
  }

pub fun toggle/state(value : event) : <ui,exn> toggle-state
  val state = dom-attempt{ dom-toggle-state(value.original) }
  if state == 1
  then Toggle-open
  else Toggle-closed


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
// does not prematurely close a surrounding lifetime-scope action at `<ui>`.
fun reactive-sample(root : root<<ui>>,
                    action : () -> <signal-read,pure> a)
                   : <signal-write,pure,ui> a
  mask<signal-write>{ mask<div>{ sample(root,action) } }

fun reactive-write-ui(action : () -> signal-write a)
                     : <signal-write,pure,ui|e> a
  mask<ui>{ mask<exn>{ mask<div>{ action() } } }

fun reactive-integration(action : () -> <div,exn,ui|e> a)
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
  validate-range-move-lifecycle(parent,first,last)
  val focus = dom-attempt{ dom-capture-range-focus(parent,first,last) }
  dom-attempt{ dom-move-range-before(parent,first,last,before,focus) }

fun validate-range-move-lifecycle(parent : node, first : node, last : node)
                                  : <ui,exn> ()
  dom-attempt{
    dom-validate-range-move-lifecycle(parent,first,last)
  }
  dom-attempt{
    dom-validate-range-move-focus(parent,first,last)
  }

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
            // A final control operation never returns through `capture-error`.
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
          match capture-error(fn() action(row))
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
                                  : <ui,exn> ()
  // A throwing cleanup cannot prevent later draft/stale rows from retiring.
  exhaust-keyed-row-actions(rows,fn(row)
    row.row-scope.dispose
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

tail fun stage-keyed-retirements-loop<a,k,e::E>(
      rows : list<keyed-row<e,a,k>>,
      collected : list<keyed-retirement<e,a,k>>)
    : <ui,exn> list<keyed-retirement<e,a,k>>
  match rows
    Nil -> pretend-no-div{ collected.reverse }
    Cons(row,rest) ->
      val staged = dom-attempt{
        dom-stage-retirement(row.row-first,row.row-last)
      }
      stage-keyed-retirements-loop(
        rest,Cons(Keyed-retirement(row,staged),collected))

fun stage-keyed-retirements<a,k,e::E>(
      rows : list<keyed-row<e,a,k>>)
    : <ui,exn> list<keyed-retirement<e,a,k>>
  stage-keyed-retirements-loop(rows,[])

tail fun release-keyed-retirements<a,k,e::E>(
      values : list<keyed-retirement<e,a,k>>) : ui ()
  match values
    Nil -> ()
    Cons(current,rest) ->
      dom-release-retirement(current.retirement-handle)
      release-keyed-retirements(rest)

tail fun detach-keyed-retirements-loop<a,k,e::E>(
      table : ref<global,keyed-table<e,a,k>>,
      detached : ref<global,list<keyed-row<e,a,k>>>) : <div,ui,exn> ()
  match transaction-load(table)
    Keyed-table(_,_,[]) -> ()
    Keyed-table(index,order,Cons(current,rest)) ->
      dom-attempt{ dom-run-retirement(current.retirement-handle) }
      // Physical removal makes this entry non-authoritative. Pop it before
      // lifecycle disposal so a throwing cleanup cannot poison future retries.
      transaction-store(table,Keyed-table(index,order,rest))
      dom-release-retirement(current.retirement-handle)
      transaction-store(detached,
        Cons(current.retirement-row,transaction-load(detached)))
      detach-keyed-retirements-loop(table,detached)

fun drain-keyed-retirements<a,k,e::E>(
      table : ref<global,keyed-table<e,a,k>>) : <ui,exn> ()
  val detached = transaction-cell([])
  finally(
    fn(){
      val rows = pretend-no-div{ transaction-load(detached).reverse }
      dispose-keyed-rows(rows)
    },
    fn() pretend-no-div{
      detach-keyed-retirements-loop(table,detached)
    }
  )

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
      renderer : keyed-context, root : root<<ui>>, parent : node, last : node,
      identity : k, item : a, index : int,
      children : (item : accessor<a>, index : accessor<int>)
                 -> <html<e>,signal-read> ())
    : <signal-write,ui,pure> keyed-row<e,a,k>
  val scope = open-lifetime-scope(root)
  val committed = transaction-cell(False)
  val installed = transaction-cell(False)
  val range-owned = transaction-cell(False)
  finally(
    fn() {
      if transaction-load(committed) then ()
      else reactive-ui-exn-open{
        scope.dispose
      }
    },
    fn()
      with-lifetime-scope(root,scope,fn()
        val first = dom-attempt{ dom-create-comment("kokaine:for-row") }
        val row-last = dom-attempt{ dom-create-comment("/kokaine:for-row") }
        finally(
          fn() {
            // Cover the tiny interval between publishing the pair and parking
            // its scope cleanup.  The pair insertion primitive compensates a
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
            mount-view(renderer,root,parent,Just(row-last),tree)
            // Keep descendant bootstrap capabilities queued until every draft
            // row is reachable from the reconciler's rollback ledger.  The
            // reconciler settles all draft scopes as one targeted set.
            val row = Keyed-row(
              identity,transaction-cell(item),transaction-cell(index),
              item-source,index-source,scope,first,row-last)
            transaction-store(committed,True)
            row
        )
      )
  )

fun reconcile-keyed<a,k,e::E>(
      renderer : keyed-context, root : root<<ui>>,
      parent : node, first : node, last : node,
      scope : lifetime-scope<<ui>>,
      table : ref<global,keyed-table<e,a,k>>, items : list<a>,
      key : (a) -> k,
      compare : (k,k) -> order, item-equals : (a,a) -> bool,
      children : (item : accessor<a>, index : accessor<int>)
                 -> <html<e>,signal-read> ())
    : <signal-write,ui,pure> ()
  // A failed post-commit host cleanup leaves explicit pending retirements in
  // the table. Resolve those first so no later reconciliation treats their DOM
  // as unmanaged or loses the only retry capability.
  reactive-ui-exn-open{ drain-keyed-retirements(table) }
  match transaction-load(table)
    Keyed-table(old-index,old-order,_) ->
      // The outermost reconciler opens a local bootstrap provision. A nested
      // keyed adapter resolves the matching renderer journal but receives no
      // lease, so only the outer participation can terminate reactive work.
      val participation = reactive-integration{
        open-keyed-participation(renderer,root)
      }
      val owns-provision = participation.is-owned
      val publication-transaction = participation.journal
      val next-index = transaction-cell(
        kokaine/internal/key-index/empty())
      val updates = transaction-cell([])
      val drafts = transaction-cell([])
      val position = transaction-cell(0)
      val move-phase = transaction-cell(False)
      val committed = transaction-cell(False)
      val enlisted = transaction-cell(False)
      val staged-retirements = transaction-cell([])
      finally(
        fn() {
          if transaction-load(committed) || transaction-load(enlisted)
          then () else
            // Claim every provision-owned bootstrap before user cleanup can
            // re-enter. Draft owners and DOM order are then retired/restored
            // exhaustively even if one cleanup fails.
            reactive-ui-exn-open{
              finally(
                fn() {
                  if transaction-load(move-phase)
                  then rollback-keyed-order(parent,last,old-order)
                  else ()
                },
                fn()
                  finally(
                    fn() {
                      release-keyed-retirements(
                        transaction-load(staged-retirements))
                      dispose-keyed-rows(transaction-load(drafts))
                    },
                    fn()
                      discard-keyed-participation(participation)
                  )
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
                    renderer,root,parent,last,identity,item,current-index,children)
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

          if owns-provision then
            // Every draft is now rollback-reachable and all comparator work has
            // succeeded. Drain only this provision's bootstrap FIFO; resume
            // work remains on the root's global frontier.
            reactive-integration{
              drain-keyed-participation(renderer,participation)
            }

            // Fail closed before the first physical move if a retained custom
            // or stale element would receive synchronous disconnect/reconnect
            // callbacks during forward placement or rollback. A matching order
            // never enters the move phase: later preparation/retirement failure
            // then has no physical order to restore.
            val physical-order = final-order ++ stale
            val current-cursor = range-first(parent,first,last)
            val order-changed = !keyed-order-matches(
              parent,last,current-cursor,physical-order)
            if order-changed then
              validate-keyed-move-lifecycles(
                parent,physical-order)
              transaction-store(move-phase,True)
              val cursor = range-first(parent,first,last)
              val _ = place-keyed-updates(parent,cursor,final-updates)
              ()
            else ()

            // Moving a row may synchronously reconnect custom elements. Validate
            // the complete region before publishing scope or table state.
            val placed = range-first(parent,first,last)
            validate-keyed-order(parent,last,placed,physical-order)
            reactive-integration{
              with-lifetime-scope(root,scope,fn() ())
            }

            // Snapshot every stale range while its markers are still connected.
            // The committed table receives these retry handles atomically.
            val retirements = stage-keyed-retirements(stale)
            transaction-store(staged-retirements,retirements)

            // The renderer prepares every nested DOM participant before the
            // reactive provision lease is promoted. Publication is then a
            // total renderer-owned suffix; the scheduler never stores DOM
            // callbacks.
            reactive-integration{
              prepare-keyed-transaction(publication-transaction)
            }
            reactive-integration{
              promote-keyed-participation(participation)
            }
            reactive-integration{
              publish-keyed-transaction(publication-transaction)
            }
            reactive-write-ui{
              final-updates.foreach(fn(update) commit-keyed-update(update))
            }
            transaction-store(
              table,Keyed-table(final-index,final-order,retirements))
            transaction-store(staged-retirements,[])
            transaction-store(committed,True)

            // Removed rows retire after the new table and sources are coherent.
            // A host failure leaves the unconsumed suffix in that table.
            reactive-ui-exn-open{
              drain-keyed-retirements(table)
            }
          else
            // A nested adapter is constructed while the outer bootstrap FIFO is
            // draining. Existing rows would require signal writes in the total
            // publication phase, so joined reconciliation deliberately supports
            // initial construction only and fails closed otherwise.
            if !old-order.is-nil || !stale.is-nil
            then throw("joined keyed reconciliation must be initial construction")
            else ()
            reactive-integration{
              stage-keyed-publication(
                publication-transaction,
                fn() pretend-no-div{
                  val current-cursor = range-first(parent,first,last)
                  val order-changed = !keyed-order-matches(
                    parent,last,current-cursor,final-order)
                  if order-changed then
                    validate-keyed-move-lifecycles(parent,final-order)
                    transaction-store(move-phase,True)
                    val cursor = range-first(parent,first,last)
                    val _ = place-keyed-updates(parent,cursor,final-updates)
                    ()
                  else ()
                  val placed = range-first(parent,first,last)
                  validate-keyed-order(parent,last,placed,final-order)
                  with-lifetime-scope(root,scope,fn() ())
                },
                fn(){
                  transaction-store(
                    table,Keyed-table(final-index,final-order,[]))
                  transaction-store(committed,True)
                },
                fn()
                  finally(
                    fn() {
                      if transaction-load(move-phase)
                      then rollback-keyed-order(parent,last,old-order)
                      else ()
                    },
                    fn() dispose-keyed-rows(transaction-load(drafts))
                  )
              )
            }
            // From this point the outer journal exclusively owns rollback.
            transaction-store(enlisted,True)
      )

fun mount-keyed-fields<s,a,k,e::E>(
      renderer : keyed-context, root : root<<ui>>,
      parent : node, before : maybe<node>,
      read : () -> signal-read s,
      walk : forall<p::E> (s,(a) -> p ()) -> p (), key : (a) -> k,
      compare : (k,k) -> order, item-equals : (a,a) -> bool,
      children : (item : accessor<a>, index : accessor<int>)
                 -> <html<e>,signal-read> ())
    : <signal-write,ui,pure> ()
  val scope = open-lifetime-scope(root)
  val committed = transaction-cell(False)
  val installed = transaction-cell(False)
  val range-owned = transaction-cell(False)
  finally(
    fn() {
      if transaction-load(committed) then ()
      else reactive-ui-exn-open{
        scope.dispose
      }
    },
    fn()
      with-lifetime-scope(root,scope,fn()
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
              kokaine/internal/key-index/empty(),[],[]))
            val dispose = create-effect(
              root,fn() tracked(read),fn(snapshot)
                with-lifetime-scope(root,scope,fn()
                  // Keep the higher-ranked source walker local to the packed
                  // collection closure.  Koka 3.2.3 mis-specializes it if it
                  // crosses another generic function boundary.  This still
                  // walks the tracked snapshot exactly once.
                  val items = transaction-cell([])
                  walk(snapshot) fn(item)
                    transaction-store(items,
                      Cons(item,transaction-load(items)))
                  reconcile-keyed(
                    renderer,root,parent,first,last,scope,table,
                    transaction-load(items).reverse,
                    key,compare,item-equals,children)
                )
            )
            transaction-store(committed,True)
            ()
        )
      )
  )

fun mount-keyed-plan<e::E>(renderer : keyed-context, root : root<<ui>>,
                     parent : node, before : maybe<node>, plan : keyed-plan<e>)
                    : <signal-write,ui,pure> ()
  match plan
    Keyed-plan(spec) ->
      match spec
        Keyed-spec(read,walk,key,compare,item-equals,children) ->
          mount-keyed-fields(
            renderer,root,parent,before,
            read,walk,key,compare,item-equals,children)

fun mount-view(renderer : keyed-context, root : root<<ui>>, parent : node,
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
        val target = dom-attempt{ dom-create-element(parent,name) }
        record-owner(root,element-node(target))
        attributes.foreach fn(attribute)
          mount-attribute(root,target,attribute)
        children.foreach fn(child)
          mount-view(renderer,root,element-node(target),Nothing,child)
        insert(parent,before,element-node(target))
    Fragment(children) ->
      children.foreach fn(child) mount-view(renderer,root,parent,before,child)
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
        mount-view(renderer,root,parent,Just(last),next)
      )
      ()
    Keyed-region(plan) -> mount-keyed-plan(renderer,root,parent,before,plan)
    Raw-html(content) ->
      insert-html(root,parent,before,trusted-content(content))

fun mount-effect(renderer : keyed-context, root : root<<ui>>,
                 parent : node, tree : view<e>)
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
    mount-view(renderer,root,parent,Just(last),tree)
  )

fun mount-transaction(root : root<<ui>>, parent : node, tree : view<e>,
                      inherit-owner : bool)
                     : <ui,exn> disposer<<ui>>
  dom-attempt{ dom-install-shadow-tracker(parent) }
  val renderer = new-keyed-context()
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
        val dispose = mount-effect(renderer,root,parent,tree)
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
