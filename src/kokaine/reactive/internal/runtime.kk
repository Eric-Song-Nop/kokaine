/*--------------------------------------------------------------------------
  Root construction and the high-level signal, derivation, and effect API.
--------------------------------------------------------------------------*/
module kokaine/reactive/internal/runtime

import kokaine/reactive/internal/model
import kokaine/reactive/effects
import kokaine/reactive/internal/lifetime
import kokaine/reactive/internal/scheduler
import kokaine/reactive/internal/handlers
import kokaine/reactive/internal/capture
import kokaine/reactive/internal/resource
import kokaine/reactive/internal/registry
import kokaine/reactive/internal/work-transaction
import std/core/undiv

// Public dispatch lives at the composition layer; the handler implementation
// remains isolated in `internal/handlers`.
pub fun dispatch(root : root<e>,
                 action : () -> <signal-read,signal-write,pure|e> a)
                : <exn|e> a
  dispatch-handled(root,action)

// --------------------------------------------------------------------------
// Roots
// --------------------------------------------------------------------------

fun fresh-plane(current-frame : frame<e>,
                retirement : retirement-coordinator<e>) : plane<e>
  Plane(new-work-queue(),cell(Nothing),cell(Nothing),cell(Nothing),
        cell(current-frame),cell(Nothing),retirement)

fun fresh-root() : root<e>
  val effect-retirement : retirement-coordinator<e> =
    new-retirement-coordinator()
  val derive-retirement : retirement-coordinator<total> =
    new-retirement-coordinator()
  val lifetime = new-lifetime-owner(Scope-live,effect-retirement)
  val effect-frame = Frame(lifetime)
  val derive-frame = Frame(
    new-lifetime-owner(Scope-live,derive-retirement))
  val root = Root(
    Root-key(cell(True)),
    fresh-plane(derive-frame,derive-retirement),
    fresh-plane(effect-frame,effect-retirement),
    cell(Nothing),lifetime,cell(0),cell(False),cell(False),cell(False)
  )
  effect-retirement.install-root-disposal(fn() retire-root-now(root))
  root

tail fun prepend-root-publication-rollbacks(
    values : list<work-publication<e>>,
    collected : list<retirement-work<e>>)
    : <div> list<retirement-work<e>>
  match values
    Nil -> collected
    Cons(current,rest) ->
      val rollback = current.publication-rollback
      prepend-root-publication-rollbacks(
        rest,Cons(Retirement-finalizer(
          fn() lift-div(fn() rollback())),collected))

// Root retirement must claim every transaction capability before invoking any
// user cleanup. A retained transaction can otherwise re-enter abort while the
// copied journal and live queue still name the same rollback callbacks.
fun claim-root-work(root : root<e>) : list<work-publication<e>>
  val publications = match load(root.root-work-publications)
    Nothing -> []
    Just(pending) ->
      val values = pending.values
      pending.clear
      values
  store(root.root-work-publications,Nothing)

  val derive-group = load(root.root-derive-plane.plane-work-group)
  val effect-group = load(root.root-effect-plane.plane-work-group)
  store(root.root-derive-plane.plane-work-group,Nothing)
  store(root.root-effect-plane.plane-work-group,Nothing)
  match derive-group
    Nothing -> ()
    Just(group) ->
      val _ = group.mark-aborted
      group.clear
  match effect-group
    Nothing -> ()
    Just(group) ->
      val _ = group.mark-aborted
      group.clear
  publications

// This is the non-validating half of root disposal. Besides ordinary public
// disposal, it is used to roll back a root whose construction has not been
// published yet. In that case a batch may still be open, or an initial flush
// may have failed after publishing only a prefix of the queued scopes.
fun retire-root-now(root : root<e>) : <div,exn|e> ()
  store(root.root-disposing,True)
  store(root.root-lifetime.lifetime-token,Scope-dead)
  val publications = claim-root-work(root)
  finally(
    fn() {
      store(root.root-batch-depth,0)
      store(root.root-flushing,False)
      store(root.root-disposed,True)
      store(root.root-disposing,False)
      root.root-derive-plane.plane-queue.clear
      root.root-effect-plane.plane-queue.clear
      store(root.root-derive-plane.plane-work-group,Nothing)
      store(root.root-effect-plane.plane-work-group,Nothing)
      store(root.root-derive-plane.plane-current,Nothing)
      store(root.root-effect-plane.plane-current,Nothing)
      store(root.root-derive-plane.plane-current-entry,Nothing)
      store(root.root-effect-plane.plane-current-entry,Nothing)
      store(root.root-derive-plane.plane-draft,Nothing)
      store(root.root-effect-plane.plane-draft,Nothing)
    },
    fn()
      val lifetime-finalizers = collect-lifetime(root.root-lifetime)
      val publication-rollbacks = prepend-root-publication-rollbacks(
        publications,[])
      val finalizers = pretend-no-div{
        lifetime-finalizers ++ publication-rollbacks
      }
      run-finalizers(root.root-lifetime.lifetime-retirement,finalizers)
  )

pub fun create-root(action : (root<e>) -> <signal-write,pure|e> a)
                   : <exn|e> (root<e>,a)
  check-not-pure-plane("reactive root creation")
  val root = fresh-root()
  val committed = cell(False)
  pretend-no-div{
    finally(
      fn() {
        if load(committed) then () else retire-root-now(root)
      },
      fn()
        // Keep all construction work queued until the action itself succeeds.
        // Only a successful initial drain publishes the root to its caller.
        store(root.root-batch-depth,1)
        val result = interpret-write(root,fn() action(root))
        store(root.root-batch-depth,0)
        flush(root)
        store(committed,True)
        (root,result)
    )
  }

pub fun root/dispose(root : root<e>) : <exn|e> ()
  check-not-pure-plane("reactive root disposal")
  if load(root.root-disposed) || load(root.root-disposing) then ()
  elif root.root-lifetime.lifetime-retirement.request-root-disposal then
    // Reject new ownership immediately, but keep `disposed=False` so the
    // already-claimed outer retirement snapshot can finish signal cleanup.
    store(root.root-disposing,True)
  elif load(root.root-batch-depth) > 0 ||
       load(root.root-flushing) ||
       load(root.root-effect-plane.plane-current).is-just ||
       load(root.root-derive-plane.plane-current).is-just
    then throw("cannot dispose a reactive root during a computation or batch")
  else pretend-no-div{
    retire-root-now(root)
  }

pub noinline fun root/is-disposed(root : root<e>) : bool
  load(root.root-disposed)

pub fun update(root : root<e>, action : () -> <signal-write,pure|e> a)
              : <exn|e> a
  dispatch(root,fn() mask<signal-read>{
    val result = action()
    // An earlier failed continuation remains queued even when this action's
    // write is equal and therefore emits no fresh invalidation. An explicit
    // update boundary still gives that pending work a recovery turn.
    request-flush(root.root-key)
    result
  })

pub fun sample(root : root<e>, action : () -> <signal-read,pure|e> a)
              : <exn|e> a
  dispatch(root,fn() mask<signal-write>{ action() })


// --------------------------------------------------------------------------
// Signals and batches
// --------------------------------------------------------------------------

pub fun signal-by(root : root<e>, initial : a,
                  equals : (a,a) -> bool) : exn signal<a>
  check-not-pure-plane("signal creation")
  check-registration(root)
  Signal(new-source(root,initial,equals))

pub fun signal(root : root<e>, initial : a,
               ?(==) : (a,a) -> bool) : exn signal<a>
  signal-by(root,initial,(==))

pub fun signal-always(root : root<e>, initial : a) : exn signal<a>
  signal-by(root,initial,fn(_,_) False)

pub fun signal/get(signal : signal<a>) : signal-read a
  read-source(signal.signal-source,Track-read,Nothing)

pub fun signal/set(signal : signal<a>, value : a) : signal-write ()
  write-source(signal.signal-source,value)

pub fun signal/modify(signal : signal<a>, update : a -> a) : signal-write ()
  modify-source(signal.signal-source,update)

pub fun signal/update(signal : signal<a>, update : a -> a) : signal-write ()
  signal.modify(update)

pub fun batch(root : root<e>, action : () -> <signal-write,pure|e1> a)
             : <signal-write,pure|e1> a
  enter-batch(root.root-key)
  finally(fn() leave-batch(root.root-key),action)

pub fun untrack(action : () -> <signal-read,pure|e> a)
               : <signal-read,pure|e> a
  with override
    fun validate-derived(producer)
      validate-derived(producer)
    fun read-source(source,_,producer)
      read-source(source,Sample-read,producer)
  action()


// --------------------------------------------------------------------------
// Continuation-backed effects and derivations
// --------------------------------------------------------------------------

fun create-effect-inner(root : root<e>,
                        track : () -> <signal-read,pure> a,
                        apply : (value : a) -> <signal-write,pure|e> ())
                       : <signal-write,pure> disposer<e>
  check-not-pure-plane("effect creation")
  val plane = root.root-effect-plane
  val owner-slot = cell(Nothing)
  val owner = load(plane.plane-current-frame)
  check-frame-registration(root,owner)
  val (current,bootstrap,dispose) = prepare-trace(
    root,plane,owner-slot,load(plane.plane-current),track,
    fn(value) interpret-write(root,fn() apply(value))
  )
  val registration = owner.frame-lifetime.register-child(
    scope-retirement-work(current))
  store(current.scope-unlink,Just(fn() registration.take.is-just))
  queue-work(plane,bootstrap)
  request-flush(root.root-key)
  dispose

fun commit-derived(root : root<e>, source : source<a>, value : a) : exn ()
  check-root(root,source.source-root)
  val previous = load(source.source-cell)
  val equal = source.source-equals
  if equal(previous,value) then () else
    store(source.source-cell,value)
    store(source.source-version,load(source.source-version) + 1)
    notify-source(source)

fun derive-by-inner(root : root<e>, initial : a,
                    calculate : () -> <signal-read,pure> a,
                    equals : (a,a) -> bool) : <signal-write,pure> memo<a>
  check-not-pure-plane("derivation creation")
  check-registration(root)
  val source = new-source(root,initial,equals)
  val effect-plane = root.root-effect-plane
  val owner = load(effect-plane.plane-current-frame)
  check-frame-registration(root,owner)
  val derive-plane = root.root-derive-plane
  val owner-slot = cell(Nothing)
  val (current,bootstrap,_) = prepare-trace(
    root,derive-plane,owner-slot,load(effect-plane.plane-current),calculate,
    fn(value) commit-derived(root,source,value)
  )
  val producer = Derive-producer(derive-plane,current,cell(False))
  store(owner-slot,Just(producer))
  val structural = pretend-no-div{
    widen-pure-retirement(scope-retirement-work(current))
  }
  val registration = owner.frame-lifetime.register-child(structural)
  store(current.scope-unlink,Just(fn() registration.take.is-just))
  queue-work(derive-plane,bootstrap)
  request-flush(root.root-key)
  Memo(source,producer)

pub fun derive-by(root : root<e>, initial : a,
                  calculate : () -> <signal-read,pure> a,
                  equals : (a,a) -> bool) : <signal-write,pure> memo<a>
  derive-by-inner(root,initial,calculate,equals)

pub fun derive(root : root<e>, initial : a,
               calculate : () -> <signal-read,pure> a,
               ?(==) : (a,a) -> bool) : <signal-write,pure> memo<a>
  derive-by(root,initial,calculate,(==))

pub fun derive-always(root : root<e>, initial : a,
                      calculate : () -> <signal-read,pure> a)
                     : <signal-write,pure> memo<a>
  derive-by(root,initial,calculate,fn(_,_) False)

fun memo-by-inner(root : root<e>, initial : a,
                  calculate : (previous : a) -> <signal-read,pure> a,
                  equals : (a,a) -> bool) : <signal-write,pure> memo<a>
  check-not-pure-plane("memo creation")
  check-registration(root)
  val source = new-source(root,initial,equals)
  val effect-plane = root.root-effect-plane
  val owner = load(effect-plane.plane-current-frame)
  check-frame-registration(root,owner)
  val derive-plane = root.root-derive-plane
  val owner-slot = cell(Nothing)
  // Bootstrap consumes `calculate` once. The retained execution capability is
  // the raw continuation captured at State-entry-read; each resume injects the
  // latest successfully committed source value as `previous`.
  val track = fn() calculate(
    read-source(source,State-entry-read,Nothing))
  val (current,bootstrap,_) = prepare-trace(
    root,derive-plane,owner-slot,load(effect-plane.plane-current),track,
    fn(value) commit-derived(root,source,value)
  )
  val producer = Derive-producer(derive-plane,current,cell(False))
  store(owner-slot,Just(producer))
  val structural = pretend-no-div{
    widen-pure-retirement(scope-retirement-work(current))
  }
  val registration = owner.frame-lifetime.register-child(structural)
  store(current.scope-unlink,Just(fn() registration.take.is-just))
  queue-work(derive-plane,bootstrap)
  request-flush(root.root-key)
  Memo(source,producer)

pub fun memo-by(root : root<e>, initial : a,
                calculate : (previous : a) -> <signal-read,pure> a,
                equals : (a,a) -> bool) : <signal-write,pure> memo<a>
  memo-by-inner(root,initial,calculate,equals)

pub fun memo(root : root<e>, initial : a,
             calculate : (previous : a) -> <signal-read,pure> a,
             ?(==) : (a,a) -> bool) : <signal-write,pure> memo<a>
  memo-by(root,initial,calculate,(==))

pub fun memo-always(root : root<e>, initial : a,
                    calculate : (previous : a) -> <signal-read,pure> a)
                   : <signal-write,pure> memo<a>
  memo-by(root,initial,calculate,fn(_,_) False)

pub fun memo/get(memo : memo<a>) : signal-read a
  validate-derived(memo.memo-producer)
  read-source(memo.memo-source,Track-read,Just(memo.memo-producer))

pub fun create-effect(root : root<e>,
                      track : () -> <signal-read,pure> a,
                      apply : (value : a) -> <signal-write,pure|e> ())
                     : <signal-write,pure> disposer<e>
  create-effect-inner(root,track,apply)

pub fun on-cleanup(root : root<e>,
                   cleanup : () -> <signal-write,pure|e> ()) : exn ()
  val _ = register-cleanup(root,cleanup)
  ()

pub fun register-cleanup(root : root<e>,
                         cleanup : () -> <signal-write,pure|e> ())
                        : exn cleanup-registration<e>
  check-not-pure-plane("cleanup registration")
  val plane = root.root-effect-plane
  val current = load(plane.plane-current-frame)
  val checkpoint = load(plane.plane-current)
  check-frame-registration(root,current)
  val resource = capture-resource(fn()
    with-context(plane,checkpoint,current,
      fn() interpret-write(root,cleanup))
  )
  val node = current.frame-lifetime.register-finalizer(
    Retirement-finalizer(fn() finalize-resource(resource)))
  Cleanup-registration(node,resource)

pub fun cleanup-registration/unregister(
    registration : cleanup-registration<e>) : bool
  match registration.cleanup-node.take
    Nothing -> False
    Just(_) -> discard-resource(registration.cleanup-resource)
