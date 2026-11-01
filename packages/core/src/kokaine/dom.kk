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
import kokaine/async/effects
import kokaine/html
import kokaine/reactive/integration/event
import kokaine/internal/key-index
import kokaine/internal/compat
import kokaine/dom/internal/keyed-transaction
import std/core/unsafe
import std/core/undiv

extern import
  js file "dom-inline.js"


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

// A listener's guarded event continuation is captured on its first delivery,
// not at mount: most listeners never fire, and capture needs a nested dispatch
// and async interpreter. Closing the gate is one-way in every state.
type listener-gate
  Gate-pending
  Gate-captured(gate-continuation : event-continuation<async,event>)
  Gate-closed

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
  js inline "kokaineDomAttemptRaw(#1)"

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
// If another host shim (Sentry replay, shadydom, scoped-registry polyfills)
// later replaces the wrapper, mounting continues and only keyed moves fail
// closed, because their validator re-checks the wrapper itself. As with
// the rest of the DOM adapter, direct calls through deliberately retained or
// foreign native primitives are outside the cooperative host contract.
extern dom-install-shadow-tracker(parent : node) : ui ()
  js inline "kokaineDomInstallShadowTracker(#1)"

// The namespace follows the HTML parser's rules so SVG and MathML created by
// the DOM adapter match what SSR markup parses into: `svg` and `math` switch
// namespace, children inherit it, and `foreignObject` or a MathML text
// integration point returns to HTML.
extern dom-create-element(parent : node, name : string) : ui element
  js inline "kokaineDomCreateElement(#1,#2)"

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
  js inline "kokaineDomRecordOwner(#1,#2,#3)"

extern dom-retire-owners(value : dom-owner-registration) : ui ()
  js inline "kokaineDomRetireOwners(#1)"

extern dom-find-owner(value : node, root : root<<ui>>) : ui any
  js inline "kokaineDomFindOwner(#1,#2)"

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
  js inline "kokaineDomAppendMarkerPair(#1,#2,#3)"

extern dom-insert-marker-pair-before(parent : node, first : node, last : node,
                                     before : node) : ui ()
  js inline "kokaineDomInsertMarkerPairBefore(#1,#2,#3,#4)"

extern dom-same-node(left : node, right : node) : bool
  js inline "(#1 === #2)"

// Validate a complete managed range before exposing either cursor.  The DOM
// can be mutated by application JavaScript, custom-element callbacks, or test
// fault injection, so reconciliation never trusts retained marker handles.
extern dom-range-first(parent : node, first : node, last : node) : ui node
  js inline "kokaineDomRangeFirst(#1,#2,#3)"

extern dom-range-next(parent : node, first : node, last : node) : ui node
  js inline "kokaineDomRangeNext(#1,#2,#3)"

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
  js inline "kokaineDomValidateRangeMoveLifecycle(#1,#2,#3)"

extern dom-validate-range-move-focus(parent : node, first : node,
                                     last : node) : ui ()
  js inline "kokaineDomValidateRangeMoveFocus(#1,#2,#3)"

extern dom-capture-range-focus(parent : node, first : node,
                               last : node) : ui any
  js inline "kokaineDomCaptureRangeFocus(#1,#2,#3)"

extern dom-move-range-before(parent : node, first : node, last : node,
                             before : node, focus : any) : ui ()
  js inline "kokaineDomMoveRangeBefore(#1,#2,#3,#4,#5)"

// Single-operation writes used on every live update. Each catches its own
// host exception and returns null or the message `dom-attempt` would report,
// avoiding the per-call closure and result box of `dom-attempt-raw`.
extern dom-try-set-text(value : node, content : string) : ui any
  js inline "kokaineDomTrySetText(#1,#2)"

extern dom-try-set-attribute(value : element, name : string,
                             content : string) : ui any
  js inline "kokaineDomTrySetAttribute(#1,#2,#3)"

extern dom-try-remove-attribute(value : element, name : string) : ui any
  js inline "kokaineDomTryRemoveAttribute(#1,#2)"

extern dom-try-set-property(value : element, name : string,
                            content : any) : ui any
  js inline "kokaineDomTrySetProperty(#1,#2,#3)"

extern string-any(value : string) : any
  js inline "#1"

extern bool-any(value : bool) : any
  js inline "#1"

extern int-string-any(value : string) : any
  js inline "Number(#1)"

extern any-string(value : any) : string
  js inline "String(#1)"

extern dom-clean-range(first : node, last : node, inclusive : bool) : ui ()
  js inline "kokaineDomCleanRange(#1,#2,#3)"

fun dom-clear-between(first : node, last : node) : ui ()
  dom-clean-range(first,last,False)

fun dom-remove-range(first : node, last : node) : ui ()
  dom-clean-range(first,last,True)

// Validate and snapshot an inclusive row range without changing the DOM.
extern dom-stage-retirement(first : node, last : node) : ui dom-retirement
  js inline "kokaineDomStageRetirement(#1,#2)"

// Detach a staged snapshot. If a host primitive throws before detaching its
// target, stop immediately so the complete remaining row stays retryable. A
// commit-then-throw is recognized by inspecting the target after the throw.
extern dom-run-retirement(value : dom-retirement) : ui ()
  js inline "kokaineDomRunRetirement(#1)"

extern dom-release-retirement(value : dom-retirement) : ui ()
  js inline "kokaineDomReleaseRetirement(#1)"

extern dom-append-html(parent : node, content : string,
                       root : root<<ui>>, portal : reentry<<ui>>)
                      : ui dom-owner-registration
  js inline "kokaineDomAppendHtml(#1,#2,#3,#4)"

extern dom-insert-html-before(parent : node, before : node,
                              content : string, root : root<<ui>>,
                              portal : reentry<<ui>>)
                             : ui dom-owner-registration
  js inline "kokaineDomInsertHtmlBefore(#1,#2,#3,#4,#5)"

extern dom-listen(value : element, name : string,
                  action : raw-event -> ui ()) : ui dom-listener
  js inline "kokaineDomListen(#1,#2,#3)"

// Drop the Koka closure before asking an unreliable host to detach the ABI
// trampoline. A callback retained after failed removal is then inert and no
// longer keeps the root, structural portal, or event K reachable.
extern dom-retire-listener(listener : dom-listener) : ui ()
  js inline "kokaineDomRetireListener(#1)"

extern dom-unlisten(value : element, name : string,
                    listener : dom-listener) : ui ()
  js inline "(#1).removeEventListener(#2,#3)"

extern raw-event-value(value : raw-event) : ui string
  js inline "kokaineDomRawEventValue(#1)"

extern raw-event-checked(value : raw-event) : ui bool
  js inline "kokaineDomRawEventChecked(#1)"

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
  js inline "kokaineDomRequireDialogTarget(#1,#2)"

extern dom-require-element-target(target : node, message : string) : ui ()
  js inline "kokaineDomRequireElementTarget(#1,#2)"

// Read the platform reflection getter directly. An own `popover` class field on
// a custom element must neither hide a real content attribute nor manufacture
// popover state where the browser has none.
extern dom-require-popover-target(target : node, message : string) : ui ()
  js inline "kokaineDomRequirePopoverTarget(#1,#2)"

extern dom-dialog-show(target : node) : ui ()
  js inline "kokaineDomDialogShow(#1)"

extern dom-dialog-show-modal(target : node) : ui ()
  js inline "kokaineDomDialogShowModal(#1)"

extern dom-dialog-close(target : node, result : string) : ui ()
  js inline "kokaineDomDialogClose(#1,#2)"

// `close()` cannot emulate the cancellable `cancel` event from requestClose.
extern dom-dialog-request-close(target : node, result : string) : ui ()
  js inline "kokaineDomDialogRequestClose(#1,#2)"

extern dom-dialog-is-open(target : node) : ui bool
  js inline "!!(#1).open"

extern dom-dialog-is-modal(target : node) : ui bool
  js inline "kokaineDomDialogIsModal(#1)"

extern dom-dialog-return-value(target : node) : ui string
  js inline "String((#1).returnValue)"

// A recognized reflected `popover` value distinguishes enabled elements from
// arbitrary nodes. Do not infer state or simulate unsupported native methods.
extern dom-popover-show(target : node) : ui ()
  js inline "kokaineDomPopoverShow(#1)"

extern dom-popover-hide(target : node) : ui ()
  js inline "kokaineDomPopoverHide(#1)"

// Some older implementations return `undefined`; querying the selector after
// the call gives Koka the authoritative post-toggle state in every case.
extern dom-popover-toggle(target : node) : ui bool
  js inline "kokaineDomPopoverToggle(#1)"

// The force overload arrived after the core Popover API. Compare state first so
// older implementations which ignore that argument still provide a true setter.
// A same-state force call still performs native validity checks; delegate an
// invalid case to the unforced method so its DOMException is not suppressed.
// `:modal` covers modal dialogs and the target's own fullscreen flag. Unlike
// `:fullscreen`, it does not match a retargeted shadow host.
extern dom-popover-set-open(target : node, open : bool) : ui ()
  js inline "kokaineDomPopoverSetOpen(#1,#2)"

extern dom-popover-is-open(target : node) : ui bool
  js inline "kokaineDomPopoverIsOpen(#1)"

extern dom-toggle-state(value : any) : ui int
  js inline "kokaineDomToggleState(#1)"

extern dom-dialog-event-return-value(value : any) : ui string
  js inline "kokaineDomDialogEventReturnValue(#1)"

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

fun dom-check(failure : any) : exn ()
  if failure.any-is-null then ()
  else throw("browser DOM exception: " ++ failure.any-string)

fun set-text(target : node, content : string) : <ui,exn> ()
  dom-check(dom-try-set-text(target,content))

// A name is fixed for the lifetime of a binding, so live bindings classify it
// once (`valid`, and whether it is a URL attribute) and pass the result to
// every update. The value is still URL-checked on every update.
fun set-classified-attribute(value : element, name : string, valid : bool,
                             url : bool, content : maybe<string>)
                            : <ui,exn> ()
  if !valid
  then throw("invalid HTML attribute name: " ++ name)
  else match content
         Nothing -> dom-check(dom-try-remove-attribute(value,name))
         Just(text) ->
           if url && !is-safe-url-value(name,text)
           then throw(unsafe-url-message(name))
           else dom-check(dom-try-set-attribute(value,name,text))

fun set-attribute(value : element, name : string,
                  content : maybe<string>) : <ui,exn> ()
  set-classified-attribute(value,name,name.is-valid-attribute-name,
                           name.is-url-attribute,content)

fun set-trusted-url(value : element, name : string,
                    url : trusted-url) : <ui,exn> ()
  if !name.is-valid-attribute-name
  then throw("invalid HTML attribute name: " ++ name)
  else dom-check(dom-try-set-attribute(value,name,trusted-url-content(url)))

fun set-classified-property(value : element, name : string, valid : bool,
                            url : bool, content : property-value)
                           : <ui,exn> ()
  if !valid
  then throw("invalid or markup-writing DOM property: " ++ name)
  else match content
         String-property(text) ->
           if url && !is-safe-url-value(name,text)
           then throw(unsafe-url-message(name))
           else dom-check(dom-try-set-property(value,name,string-any(text)))
         Bool-property(flag) ->
           dom-check(dom-try-set-property(value,name,bool-any(flag)))
         Int-property(number) ->
           dom-check(dom-try-set-property(
             value,name,int-string-any(number.show)))

fun set-property(value : element, name : string,
                 content : property-value) : <ui,exn> ()
  set-classified-property(value,name,name.is-valid-property-name,
                          name.is-url-attribute,content)

fun snapshot(value : raw-event) : <ui,exn> event
  dom-attempt fn()
    Event(raw-event-value(value),raw-event-checked(value),raw-event-key(value),
          raw-event-any(value))

fun gate-is-live(gate : ref<global,listener-gate>) : bool
  match transaction-load(gate)
    Gate-pending -> True
    Gate-captured(continuation) -> continuation.is-live
    Gate-closed -> False

fun close-gate(gate : ref<global,listener-gate>) : ()
  val current = transaction-load(gate)
  transaction-store(gate,Gate-closed)
  match current
    Gate-captured(continuation) -> continuation.close
    _ -> ()

fun resume-gate(gate : ref<global,listener-gate>, action : callback,
                value : event)
               : <async,signal-read,signal-write,pure,ui> ()
  match transaction-load(gate)
    Gate-closed -> ()
    Gate-captured(continuation) ->
      val _ = continuation.resume(value)
      ()
    Gate-pending ->
      // `capture-event` reaches its unconditional browser-event suspension
      // before running any user code, so this publishes the master
      // continuation before the first (possibly re-entrant) delivery resumes
      // it. Nested deliveries then resume the same multi-shot master.
      val continuation = capture-event(action)
      transaction-store(gate,Gate-captured(continuation))
      val _ = continuation.resume(value)
      ()

fun invoke-event(root : root<<ui>>, portal : reentry<<ui>>,
                 gate : ref<global,listener-gate>, action : callback,
                 value : raw-event)
                : ui ()
  // A browser event runs after `main` has returned, so its dynamic exception
  // stack is fresh. Install the boundary before `dispatch` performs even its
  // root validity check; otherwise an asynchronous throw has no Koka handler.
  with catch fn(problem)
    dom-report-error("uncaught Kokaine event exception: " ++ problem.show)
  // Closing the gate must make even a retained/undetachable JavaScript
  // trampoline inert: do not snapshot or touch a stale structural frame.
  if gate.gate-is-live then
    val captured = snapshot(value)
    // A custom event target getter can synchronously dispose during snapshot.
    // Recheck before touching the structural portal; resume checks once more.
    if gate.gate-is-live then
      // Re-entry restores Kokaine's structural/reactive handlers; the opaque
      // event capability then resumes the actual multi-shot user continuation.
      // Keeping resume synchronous preserves native nested `dispatchEvent` order.
      reenter(portal,fn()
        // The async delimiter is inside this re-entry batch. Reaching await
        // therefore returns here first, letting the batch close before any
        // later browser completion starts its own generation-bound turn.
        // The continuation is resumed under these handlers whether it was
        // captured just now or by an earlier delivery.
        run-async(root,fn()
          resume-gate(gate,action,captured)
        )
      )
    else ()
  else ()

fun retire-event-listener(
      target : element, name : string,
      gate : ref<global,listener-gate>,
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
    fn() close-gate(gate)
  )

fun install-event-listener(root : root<<ui>>, target : element,
                           name : string, action : callback)
                          : <ui,exn> ()
  // The gate exists before JavaScript retains its ABI trampoline, so
  // retirement can always close it. The continuation itself is captured on
  // first delivery, under that delivery's re-entry and async handlers.
  val gate = transaction-cell(Gate-pending)
  val portal = capture-reentry(root)
  val listener : ref<global,maybe<dom-listener>> = transaction-cell(Nothing)
  val committed = transaction-cell(False)
  finally(
    fn() {
      if transaction-load(committed) then () else
        retire-event-listener(target,name,gate,listener)
    },
    fn()
      val installed = dom-attempt fn()
        dom-listen(target,name,fn(value)
          invoke-event(root,portal,gate,action,value)
        )
      transaction-store(listener,Just(installed))
      on-cleanup(root,fn()
        reactive-ui-exn{
          retire-event-listener(target,name,gate,listener)
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
    Trusted-url-attribute(name,url) -> set-trusted-url(target,name,url)
    Boolean-attribute(name,enabled) ->
      set-attribute(target,name,if enabled then Just("") else Nothing)
    Property(name,value) -> set-property(target,name,value)
    Live-attribute(name,read) ->
      // An invalid name still fails on the first run, as before.
      val valid = name.is-valid-attribute-name
      val url = name.is-url-attribute
      val dispose = create-effect(root,fn() tracked(read),fn(value)
        reactive-ui-exn{
          set-classified-attribute(target,name,valid,url,value)
        }
      )
      ()
    Live-property(name,read) ->
      val valid = name.is-valid-property-name
      val url = name.is-url-attribute
      val dispose = create-effect(root,fn() tracked(read),fn(value)
        reactive-ui-exn{
          set-classified-property(target,name,valid,url,value)
        }
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
        reactive-ui-exn{ set-text(target,value) }
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
