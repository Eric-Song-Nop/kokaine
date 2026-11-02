/*--------------------------------------------------------------------------
  Source invalidation, continuation scheduling, and targeted derivation settle.
--------------------------------------------------------------------------*/
module kokaine/reactive/internal/scheduler

import kokaine/reactive/internal/model
import kokaine/reactive/internal/lifetime
import kokaine/internal/compat
import kokaine/internal/registry
import kokaine/reactive/internal/work-transaction
import std/core/undiv
import std/core/unsafe

// One ref records which dynamic context a non-local exit must unwind. Keeping
// this separate from lifetime state matters when publication disposes itself.
type resume-phase
  Resume-build
  Resume-ambient
  Resume-publication
  Resume-complete

// --------------------------------------------------------------------------
// Source-local continuation indexing and invalidation
// --------------------------------------------------------------------------

pub fun pack-capture(plane : plane<e>, current : trace<e>)
                : packed-capture
  Packed-capture(fn(consume) consume(plane,current))

pub fun cut-capture(packed : packed-capture) : ()
  match packed
    Packed-capture(run) ->
      run(fn(plane,current)
        match current.trace-state-of
          Capture-dead -> ()
          _ -> enqueue-trace(plane,current)
      )

pub fun pending-ancestor-loop(parent : maybe<continuation-gate>) : <div> bool
  match parent
    Nothing -> False
    Just(gate) ->
      match load(gate.gate-state)
        Capture-pending -> True
        Capture-running -> True
        Capture-dead -> False
        Capture-draft -> pending-ancestor-loop(gate.gate-parent)
        Capture-live -> pending-ancestor-loop(gate.gate-parent)

pub fun pending-ancestor(parent : maybe<continuation-gate>) : bool
  pretend-no-div{ pending-ancestor-loop(parent) }

pub fun enqueue-trace(plane : plane<e>, current : trace<e>) : ()
  match current
    Trace-end -> ()
    Trace-read(gate,_,_,_,_,_,_,_) ->
      val state = gate.gate-state
      match load(state)
        Capture-live ->
          store(state,Capture-pending)
          route-resume(plane.plane-queue,Resume-work(current))
        Capture-running ->
          // The scheduler owns the current ticket while this turn executes.
          // A self-write only changes the capability state; success/failure or
          // an effect-plane final-control unwind preserves that exact ticket.
          store(state,Capture-pending)
        Capture-pending -> readmit-failed-gate(plane,gate)
        _ -> ()

pub fun notify-source(source : source<a>) : ()
  // `cut-capture` only updates internal gates and queues existing tickets. It
  // cannot invoke tracked or publication code, so the registry remains stable.
  source.source-captures.visit-readonly(cut-capture)


pub fun activate-trace-loop(plane : plane<e>, current : trace<e>) : <div> ()
  match current
    Trace-end -> ()
    Trace-read(gate,_,child,current-frame-slot,_,_,_,stale) ->
      val state = gate.gate-state
      match load(state)
        Capture-draft ->
          val current-frame = load(current-frame-slot)
          store(state,Capture-live)
          store(current-frame.frame-lifetime.lifetime-token,Scope-live)
          activate-trace-loop(plane,load(child))
          if stale() then enqueue-trace(plane,current) else ()
        _ -> ()

pub fun activate-trace(plane : plane<e>, current : trace<e>) : ()
  pretend-no-div{ activate-trace-loop(plane,current) }

// --------------------------------------------------------------------------
// Frontier scheduling
// --------------------------------------------------------------------------

pub fun same-work(left : work<e>, right : work<e>) : bool
  match left
    Resume-work(Trace-read(left-gate,_,_,_,_,_,_,_)) ->
      match right
        Resume-work(Trace-read(right-gate,_,_,_,_,_,_,_)) ->
          unsafe-ptr-eq(left-gate.gate-state,right-gate.gate-state)
        _ -> False
    Bootstrap-work(left-scope,_) ->
      match right
        Bootstrap-work(right-scope,_) ->
          unsafe-ptr-eq(left-scope.scope-lifetime.lifetime-token,
                        right-scope.scope-lifetime.lifetime-token)
        _ -> False
    _ -> False

fun take-failed-loop(failed : list<failed-ticket>, state : ref<global,capture-state>,
                     kept : list<failed-ticket>) : <div> maybe<(failed-ticket,list<failed-ticket>)>
  match failed
    Nil -> Nothing
    Cons(ticket,rest) ->
      if unsafe-ptr-eq(ticket.failed-state,state)
      then Just((ticket,kept.reverse ++ rest))
      else take-failed-loop(rest,state,Cons(ticket,kept))

// A quarantined ticket is still Pending, so an ordinary invalidation would
// not queue it again. Move it back when its own input changes.
fun readmit-failed-gate(plane : plane<e>, gate : continuation-gate) : ()
  match load(plane.plane-failed)
    Nil -> ()
    failed ->
      val taken = pretend-no-div{ take-failed-loop(failed,gate.gate-state,[]) }
      match taken
        Nothing -> ()
        Just(found) ->
          store(plane.plane-failed,found.snd)
          val requeue = found.fst.failed-requeue
          requeue(True)

// Explicit update boundaries give every quarantined ticket one recovery turn,
// queued behind the work that is already runnable.
pub fun readmit-failed(plane : plane<e>) : ()
  match load(plane.plane-failed)
    Nil -> ()
    failed ->
      store(plane.plane-failed,[])
      pretend-no-div{ failed.reverse.foreach(requeue-behind) }

fun requeue-behind(ticket : failed-ticket) : ()
  val requeue = ticket.failed-requeue
  requeue(False)

pub fun work-runnable(current : work<e>) : bool
  match current
    Bootstrap-work(scope,_) ->
      match load(scope.scope-lifetime.lifetime-token)
        Scope-starting ->
          load(scope.scope-bootstrap-slot).is-just &&
          !pending-ancestor(scope.scope-parent)
        _ -> False
    Resume-work(capture) ->
      match capture.trace-state-of
        Capture-pending -> !pending-ancestor(capture.trace-parent-of)
        _ -> False

pub fun work-stale(current : work<e>) : bool
  match current
    Bootstrap-work(scope,_) ->
      match load(scope.scope-lifetime.lifetime-token)
        Scope-starting -> load(scope.scope-bootstrap-slot).is-nothing
        _ -> True
    Resume-work(capture) ->
      match capture.trace-state-of
        Capture-dead -> True
        Capture-draft -> True
        Capture-live -> True
        _ -> False

tail fun restore-skipped(queue : work-queue<work<e>>,
                         skipped : list<work<e>>) : <div> ()
  match skipped
    Nil -> ()
    Cons(current,rest) ->
      queue.prepend(current)
      restore-skipped(queue,rest)

tail fun take-queued-work-loop(queue : work-queue<work<e>>,
                               skipped : list<work<e>>)
                              : <div> maybe<work<e>>
  match queue.pop
    Nothing ->
      restore-skipped(queue,skipped)
      Nothing
    Just(current) ->
      if current.work-runnable then
        restore-skipped(queue,skipped)
        Just(current)
      elif current.work-stale then take-queued-work-loop(queue,skipped)
      else take-queued-work-loop(queue,Cons(current,skipped))

pub fun take-queued-work(queue : work-queue<work<e>>) : maybe<work<e>>
  pretend-no-div{ take-queued-work-loop(queue,[]) }

fun queue-global-work(queue : work-queue<work<e>>, current : work<e>) : ()
  match current
    Bootstrap-work(_,_) -> queue.append(current)
    Resume-work(_) -> queue.prepend(current)

pub fun queue-work(plane : plane<e>, current : work<e>) : ()
  match current
    Bootstrap-work(_,_) ->
      route-bootstrap(plane.plane-queue,load(plane.plane-work-group),current)
    Resume-work(_) -> route-resume(plane.plane-queue,current)

pub fun abandon-draft-frame(current : frame<e>, drafts : list<trace<e>>) : e ()
  store(current.frame-lifetime.lifetime-token,Scope-branch-dead)
  val _ = try-retire-lifetime-drafts(current.frame-lifetime,drafts)
  ()

fun collect-replaced-generation(
    old : trace<e>, old-frame : frame<e>) : list<retirement-work<e>>
  pretend-no-div{
    collect-retirement-work([
      trace-retirement-work(old),
      lifetime-retirement-work(old-frame.frame-lifetime)
    ])
  }

fun retire-replaced-generation-raw(
    old : trace<e>, old-frame : frame<e>) : <div,exn|e> ()
  match old
    Trace-end ->
      if old-frame.frame-lifetime.try-retire-empty
      then ()
      else run-finalizers(
        old-frame.frame-lifetime.lifetime-retirement,
        collect-replaced-generation(old,old-frame))
    _ -> run-finalizers(
      old-frame.frame-lifetime.lifetime-retirement,
      collect-replaced-generation(old,old-frame))

pub fun built-trace/run-publication(
    built : built-trace<e>, plane : plane<e>) : <div|e> error<()>
  val action = built.built-publication-action
  capture-error(fn() {
    with-context(
      plane,
      built.built-publication-current,
      built.built-publication-frame,
      action)
  })

fun restore-resume-build-context(
    plane : plane<e>,
    previous-draft : maybe<ref<global,list<trace<e>>>>,
    previous-current : maybe<continuation-gate>,
    previous-frame : frame<e>) : ()
  store(plane.plane-current-frame,previous-frame)
  store(plane.plane-current,previous-current)
  store(plane.plane-draft,previous-draft)

fun restore-resume-publication-context(
    plane : plane<e>,
    previous-current : maybe<continuation-gate>,
    previous-frame : frame<e>) : ()
  store(plane.plane-current-frame,previous-frame)
  store(plane.plane-current,previous-current)

fun rollback-resume(
    state : ref<global,capture-state>,
    draft-frame : frame<e>,
    drafts : ref<global,list<trace<e>>>) : e ()
  match load(state)
    Capture-running -> store(state,Capture-pending)
    _ -> ()
  abandon-draft-frame(draft-frame,load(drafts))

pub fun resume-node(plane : plane<e>, current : trace<e>,
                gate : continuation-gate,
                child : ref<global,trace<e>>,
                current-frame-slot : ref<global,frame<e>>,
                resume : (frame<e>) -> <div,exn|e> built-trace<e>)
               : <div|e> error<()>
  val state = gate.gate-state
  match load(state)
    Capture-pending ->
      store(state,Capture-running)
      val old-frame = load(current-frame-slot)
      val draft-frame = Frame(new-lifetime-owner(
        Scope-starting,plane.plane-retirement))
      val drafts = cell([])
      val previous-draft = load(plane.plane-draft)
      val previous-current = load(plane.plane-current)
      val previous-frame = load(plane.plane-current-frame)
      val phase = cell(Resume-build)
      finally(
        fn() lift-div(fn(){
          match load(phase)
            Resume-build ->
              restore-resume-build-context(
                plane,previous-draft,previous-current,previous-frame)
              rollback-resume(state,draft-frame,drafts)
            Resume-ambient ->
              rollback-resume(state,draft-frame,drafts)
            Resume-publication ->
              restore-resume-publication-context(
                plane,previous-current,previous-frame)
              rollback-resume(state,draft-frame,drafts)
            Resume-complete -> ()
        }),
        fn() lift-div(fn()
          val attempt = pretend-no-div{
            capture-error(fn() {
              store(plane.plane-draft,Just(drafts))
              store(plane.plane-current,Just(gate))
              store(plane.plane-current-frame,draft-frame)
              val built = resume(draft-frame)
              store(plane.plane-current-frame,previous-frame)
              store(plane.plane-current,previous-current)
              store(plane.plane-draft,previous-draft)
              store(phase,Resume-ambient)

              val old = load(child)
              store(child,Trace-end)
              store(
                old-frame.frame-lifetime.lifetime-token,Scope-branch-dead)
              store(current-frame-slot,draft-frame)
              retire-replaced-generation-raw(old,old-frame)

              match load(state)
                Capture-dead -> lift-div(fn() lift-exn(fn() ()))
                _ ->
                  store(phase,Resume-publication)
                  store(
                    plane.plane-current,built.built-publication-current)
                  store(
                    plane.plane-current-frame,
                    built.built-publication-frame)
                  val publication = built.built-publication-action
                  publication()
                  store(plane.plane-current-frame,previous-frame)
                  store(plane.plane-current,previous-current)
                  store(phase,Resume-ambient)
                  match load(state)
                    Capture-dead -> lift-div(fn() lift-exn(fn() ()))
                    _ ->
                      store(child,built.built-root)
                      activate-trace(plane,built.built-root)
                      match load(state)
                        Capture-running -> store(state,Capture-live)
                        _ -> ()
                      store(
                        draft-frame.frame-lifetime.lifetime-token,Scope-live)
                      store(phase,Resume-complete)
                      lift-div(fn() lift-exn(fn() ()))
            })
          }
          match attempt
            Error(failure) -> Error(failure)
            Ok(_) -> Ok(())
        )
      )
    _ -> Ok(())

pub fun resume-capture(plane : plane<e>, current : trace<e>)
                   : <div|e> error<()>
  match current
    Trace-end -> Ok(())
    Trace-read(gate,_,child,current-frame-slot,resume,_,_,_) ->
      resume-node(plane,current,gate,child,current-frame-slot,resume)
pub fun run-bootstrap(scope : continuation-scope<e>) : <div|e> error<()>
  match load(scope.scope-lifetime.lifetime-token)
    Scope-starting ->
      val run-slot = scope.scope-bootstrap-slot
      val pending = load(run-slot)
      // Clear before invocation: neither the queue nor a producer can retain
      // the calculate closure after bootstrap starts.
      store(run-slot,Nothing)
      match pending
        Nothing -> capture-error(fn()
          throw("bootstrap slot was already consumed while scope is starting")
        )
        Just(run) ->
          finally(
            fn() lift-div(fn(){
              match load(scope.scope-lifetime.lifetime-token)
                Scope-starting ->
                  // An ambient final control effect may abandon `run`
                  // without producing Error. Its dynamic finalizer still
                  // retires the empty one-shot scope.
                  val _ = capture-error(fn(){
                    pretend-no-div{ retire-scope(scope) }
                  })
                  ()
                _ -> ()
            }),
            run
          )
    _ -> Ok(())

pub fun run-work-raw(plane : plane<e>, current : work<e>) : <div|e> error<()>
  match current
    Resume-work(capture) -> resume-capture(plane,capture)
    Bootstrap-work(scope,_) -> run-bootstrap(scope)

pub fun run-derive-work(plane : plane<total>, current : work<total>)
                    : div settle-result
  val previous-phase = enter-pure-plane()
  finally(fn() restore-pure-plane(previous-phase),fn()
    val owner = match current
      Resume-work(capture) ->
        match capture
          Trace-end -> Nothing
          Trace-read(_,slot,_,_,_,_,_,_) -> load(slot)
      Bootstrap-work(_,slot) -> load(slot)
    match owner
      Nothing ->
        match run-work-raw(plane,current)
          Error(failure) -> Settle-failed(failure)
          Ok(_) -> Settle-ok
      Just(producer) -> settle-producer-result(producer)
  )

pub fun restore-deferred(plane : plane<total>, deferred : list<work<total>>) : ()
  plane.plane-queue.append-values(pretend-no-div{ deferred.reverse })

pub fun run-next-derived-loop(plane : plane<total>,
                          deferred : list<work<total>>) : div error<bool>
  val next = take-queued-work(plane.plane-queue)
  match next
    Nothing ->
      restore-deferred(plane,deferred)
      Ok(False)
    Just(current) ->
      match run-derive-work(plane,current)
        Settle-ok ->
          if current.work-stale then ()
          else queue-global-work(plane.plane-queue,current)
          restore-deferred(plane,deferred)
          Ok(True)
        Settle-deferred ->
          // This ticket needs an effect owner (or another deferred producer)
          // to advance. Scan the remaining pure work once, then yield to the
          // effect plane without turning deferral into user failure.
          run-next-derived-loop(plane,Cons(current,deferred))
        Settle-failed(failure) ->
          if current.work-stale then ()
          else queue-global-work(plane.plane-queue,current)
          restore-deferred(plane,deferred)
          Error(failure)

pub fun run-next-derived(plane : plane<total>) : div error<bool>
  run-next-derived-loop(plane,[])

fun requeue-work(queue : work-queue<work<e>>, current : work<e>) : ((front : bool) -> ())
  fn(front)
    if front then route-resume(queue,current) else queue.append(current)

pub fun run-next-effect(plane : plane<e>) : <div|e> error<bool>
  val next = take-queued-work(plane.plane-queue)
  match next
    Nothing -> Ok(False)
    Just(current) ->
      // Effect work can be abandoned by an ambient final control operation,
      // so its actual ticket stays queued across invocation. A normal success
      // makes it stale; an abort leaves the Pending capability recoverable.
      plane.plane-queue.prepend(current)
      match run-work-raw(plane,current)
        Error(failure) ->
          // A failed ticket must not stay at the queue front: it would starve
          // everything behind it and rerun on every later flush. Quarantine
          // it until its own input changes or an update boundary retries it.
          plane.plane-queue.remove(fn(other) same-work(other,current))
          match current
            Resume-work(Trace-read(gate,_,_,_,_,_,_,_)) | !current.work-stale ->
              val ticket = Failed-ticket(gate.gate-state,
                                         requeue-work(plane.plane-queue,current))
              store(plane.plane-failed,Cons(ticket,load(plane.plane-failed)))
            _ -> ()
          Error(failure)
        Ok(_) -> Ok(True)

pub fun run-next-pure(plane : plane<total>) : error<bool>
  pretend-no-div{ run-next-derived(plane) }


pub fun settle-failure(message : string) : settle-result
  match capture-error(fn() throw(message))
    Error(failure) -> Settle-failed(failure)
    Ok(_) -> Settle-ok

pub fun validate-owner-gate-current(gate : continuation-gate) : <div> settle-result
  match load(gate.gate-state)
    Capture-live ->
      match gate.gate-input-producer
        Nothing -> Settle-ok
        Just(upstream) ->
          match settle-producer-result(upstream)
            Settle-deferred -> Settle-deferred
            Settle-failed(failure) -> Settle-failed(failure)
            Settle-ok ->
              match load(gate.gate-state)
                Capture-live -> Settle-ok
                Capture-pending -> Settle-deferred
                Capture-running -> Settle-deferred
                _ -> settle-failure(
                  "derived owner changed while validating its input")
    Capture-pending -> Settle-deferred
    Capture-running -> Settle-deferred
    Capture-draft -> settle-failure("derived owner continuation is draft")
    Capture-dead -> settle-failure("derived owner continuation was retired")

pub fun validate-owner-gate(parent : maybe<continuation-gate>) : <div> settle-result
  match parent
    Nothing -> Settle-ok
    Just(gate) ->
      match validate-owner-gate(gate.gate-parent)
        Settle-ok -> validate-owner-gate-current(gate)
        Settle-deferred -> Settle-deferred
        Settle-failed(failure) -> Settle-failed(failure)

pub fun settle-trace-recheck(plane : plane<total>, current : trace<total>,
                         gate : continuation-gate) : <div> settle-result
  match load(gate.gate-state)
    Capture-pending ->
      if pending-ancestor(gate.gate-parent)
      then Settle-deferred
      else
        match resume-capture(plane,current)
          Error(failure) -> Settle-failed(failure)
          Ok(_) -> settle-trace-result(plane,current)
    Capture-live -> Settle-ok
    Capture-draft -> settle-failure("cyclic read of a draft derivation")
    Capture-running -> settle-failure("cyclic read of a running derivation")
    Capture-dead -> settle-failure("derived continuation was retired")

pub fun settle-read-child(plane : plane<total>, current : trace<total>,
                      gate : continuation-gate,
                      child : ref<global,trace<total>>)
                     : <div> settle-result
  match load(gate.gate-state)
    Capture-dead -> Settle-ok
    Capture-live ->
      val nested = settle-trace-result(plane,load(child))
      match load(gate.gate-state)
        Capture-dead -> Settle-ok
        _ ->
          match nested
            Settle-ok -> settle-trace-recheck(plane,current,gate)
            _ -> nested
    _ -> settle-trace-recheck(plane,current,gate)

pub fun settle-read-node(plane : plane<total>, current : trace<total>,
                     gate : continuation-gate,
                     child : ref<global,trace<total>>)
                    : <div> settle-result
  match load(gate.gate-state)
    Capture-dead -> Settle-ok
    Capture-live ->
      val input = match gate.gate-input-producer
        Nothing -> Settle-ok
        Just(upstream) -> settle-producer-result(upstream)
      match load(gate.gate-state)
        Capture-dead -> Settle-ok
        _ ->
          match input
            Settle-ok -> settle-read-child(plane,current,gate,child)
            Settle-deferred -> Settle-deferred
            Settle-failed(failure) -> Settle-failed(failure)
    _ -> settle-trace-recheck(plane,current,gate)

pub fun settle-trace-result(plane : plane<total>, current : trace<total>)
                       : <div> settle-result
  match current
    Trace-end -> Settle-ok
    Trace-read(gate,_,child,_,_,_,_,_) ->
      settle-read-node(plane,current,gate,child)

pub fun settle-producer-body(producer : derive-producer) : <div> settle-result
  match load(producer.producer-scope.scope-lifetime.lifetime-token)
    Scope-branch-dead -> settle-failure(
      "derived value belongs to a retired branch")
    Scope-dead -> settle-failure("derived value belongs to a retired scope")
    _ ->
      match validate-owner-gate(producer.producer-scope.scope-parent)
        Settle-deferred -> Settle-deferred
        Settle-failed(failure) -> Settle-failed(failure)
        Settle-ok ->
          // Validation can retire the parent lifetime, so recheck before
          // starting or walking the producer.
          match load(producer.producer-scope.scope-lifetime.lifetime-token)
            Scope-starting ->
              match run-bootstrap(producer.producer-scope)
                Error(failure) -> Settle-failed(failure)
                Ok(_) -> settle-producer-body(producer)
            Scope-live -> settle-trace-result(
              producer.producer-plane,load(producer.producer-scope.scope-body))
            Scope-branch-dead -> settle-failure(
              "derived value belongs to a retired branch")
            Scope-dead -> settle-failure(
              "derived value belongs to a retired scope")

pub fun settle-producer-result(producer : derive-producer) : <div> settle-result
  val previous-phase = enter-pure-plane()
  val walk = enter-settle-walk()
  finally(fn() { leave-settle-walk(); restore-pure-plane(previous-phase) },fn()
    if load(producer.producer-settling)
    then settle-failure("cyclic derived continuation")
    elif load(producer.producer-clean) == walk &&
         load(producer.producer-scope.scope-lifetime.lifetime-token).is-scope-live
    then Settle-ok
    else
      store(producer.producer-settling,True)
      val result = settle-producer-body(producer)
      store(producer.producer-settling,False)
      match result
        Settle-ok -> store(producer.producer-clean,walk)
        _ -> ()
      result
  )

// Synchronous memo reads can execute this capability without gaining the
// ambient effect row. It follows only the target scope's actual Trace-read
// producer capabilities and never drains unrelated pure or effect work.
pub fun settle-producer(producer : derive-producer) : exn ()
  val result = pretend-no-div{ settle-producer-result(producer) }
  match result
    Settle-ok -> ()
    Settle-deferred -> throw("derived value is waiting for its effect owner")
    Settle-failed(failure) -> throw-exn(failure)

pub fun drain-loop(root : root<e>, first-failure : maybe<exception>)
                  : <div|e> error<()>
  // Only the raw continuation machinery contributes `div`; the pure plane
  // has no ambient user effect to erase or coerce.
  val derivation = run-next-pure(root.root-derive-plane)
  match derivation
    Error(failure) -> Error(failure)
    Ok(True) -> drain-loop(root,first-failure)
    Ok(False) ->
      match run-next-effect(root.root-effect-plane)
        // The failed ticket is quarantined; keep draining unrelated work and
        // report the first failure once the queue is empty. Root construction
        // is all-or-nothing, so there the first failure ends the drain.
        Error(failure) | load(root.root-constructing) -> Error(failure)
        Error(failure) ->
          val first = match first-failure
            Nothing -> Just(failure)
            _ -> first-failure
          drain-loop(root,first)
        Ok(True) -> drain-loop(root,first-failure)
        Ok(False) ->
          match first-failure
            Nothing -> Ok(())
            Just(failure) -> Error(failure)

pub fun flush(root : root<e>) : <div,exn|e> ()
  if load(root.root-disposed) || load(root.root-disposing) ||
     load(root.root-flushing) || load(root.root-batch-depth) > 0
  then ()
  else
    store(root.root-flushing,True)
    val result = lift-exn(fn()
      finally(
        fn() store(root.root-flushing,False),
        fn() drain-loop(root,Nothing)
      )
    )
    result.untry


// --------------------------------------------------------------------------
// Root and source validation
// --------------------------------------------------------------------------

pub fun check-root(root : root<e>, key : root-key) : exn ()
  if same-root(root.root-key,key) && !load(root.root-disposed) then ()
  else throw("signal used outside its live reactive root")

pub fun check-registration(root : root<e>) : exn ()
  if load(root.root-disposed) || load(root.root-disposing)
  then throw("reactive value created in a disposed root")
  else ()

pub fun check-frame-registration(root : root<e>, current : frame<e>) : exn ()
  check-registration(root)
  match load(current.frame-lifetime.lifetime-token)
    Scope-starting -> ()
    Scope-live -> ()
    _ -> throw("reactive value created under a retired continuation branch")

pub fun new-source(root : root<e>, value : a, equals : (a,a) -> bool) : source<a>
  Source(root.root-key,cell(value),equals,cell(0),new-registry())
