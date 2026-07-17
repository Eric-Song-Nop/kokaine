/*--------------------------------------------------------------------------
  Source invalidation, continuation scheduling, and targeted derivation settle.
--------------------------------------------------------------------------*/
module kokaine/reactive/internal/scheduler

import kokaine/reactive/internal/model
import kokaine/reactive/internal/lifetime
import kokaine/reactive/internal/registry
import kokaine/reactive/internal/work-transaction
import std/core/undiv

// --------------------------------------------------------------------------
// Source-local continuation indexing and invalidation
// --------------------------------------------------------------------------

pub fun pack-capture(plane : plane<e>, target : trace<e>, owner : trace<e>)
                : packed-capture
  Packed-capture(fn(consume) consume(plane,target,owner))

pub fun packed-active(packed : packed-capture) : bool
  match packed
    Packed-capture(run) -> run(fn(_,target,owner)
      match owner.trace-state-of
        Capture-dead -> False
        _ ->
          match target.trace-state-of
            Capture-dead -> False
            _ -> True
    )

pub fun cut-capture(packed : packed-capture) : ()
  match packed
    Packed-capture(run) ->
      run(fn(plane,target,owner)
        match owner.trace-state-of
          Capture-dead -> ()
          _ ->
            match target.trace-state-of
              Capture-running ->
                match owner.trace-state-of
                  // A Live owner belongs to the entry generation currently
                  // being replaced. Its upstream commit is already observed
                  // by the running entry calculation, so it must not schedule
                  // a second recurrence. New-generation owners remain Draft.
                  Capture-live -> ()
                  _ -> enqueue-trace(plane,target)
              _ -> enqueue-trace(plane,target)
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
    Trace-read(gate,_,_,_,_,_,_,_,_) ->
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
        _ -> ()
    Trace-entry(gate,_,_,_,_,_) ->
      val state = gate.gate-state
      match load(state)
        Capture-live ->
          store(state,Capture-pending)
          route-resume(plane.plane-queue,Resume-work(current))
        Capture-running ->
          // A write from the currently resumed suffix schedules a later turn;
          // the active queue ticket remains in place until this turn settles.
          store(state,Capture-pending)
        _ -> ()

pub fun notify-source(source : source<a>) : ()
  source.source-captures.snapshot.foreach(cut-capture)


pub fun activate-trace-loop(plane : plane<e>, current : trace<e>) : <div> ()
  match current
    Trace-end -> ()
    Trace-read(gate,_,entry,child,current-frame-slot,_,_,_,stale) ->
      val state = gate.gate-state
      match load(state)
        Capture-draft ->
          val current-frame = load(current-frame-slot)
          store(state,Capture-live)
          store(current-frame.frame-lifetime.lifetime-token,Scope-live)
          activate-trace-loop(plane,load(child))
          if stale() then
            match entry
              Nothing -> enqueue-trace(plane,current)
              Just(target) -> enqueue-trace(plane,target)
          else ()
        _ -> ()
    Trace-entry(gate,_,child,current-frame-slot,_,_) ->
      val state = gate.gate-state
      match load(state)
        Capture-draft ->
          val current-frame = load(current-frame-slot)
          store(state,Capture-live)
          store(current-frame.frame-lifetime.lifetime-token,Scope-live)
          activate-trace-loop(plane,load(child))
        _ -> ()

pub fun activate-trace(plane : plane<e>, current : trace<e>) : ()
  pretend-no-div{ activate-trace-loop(plane,current) }

// --------------------------------------------------------------------------
// Frontier scheduling
// --------------------------------------------------------------------------

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

pub fun take-work-loop(values : list<work<e>>, skipped : list<work<e>>)
                  : <div> (maybe<work<e>>,list<work<e>>)
  match values
    Nil -> (Nothing,skipped.reverse)
    Cons(current,rest) ->
      if current.work-runnable
      then (Just(current),skipped.reverse ++ rest)
      elif current.work-stale
      then take-work-loop(rest,skipped)
      else take-work-loop(rest,Cons(current,skipped))

pub fun take-work(values : list<work<e>>)
             : (maybe<work<e>>,list<work<e>>)
  pretend-no-div{ take-work-loop(values,[]) }

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
      val draft-frame = Frame(new-lifetime-owner(Scope-starting))
      val drafts = cell([])
      val completed = cell(False)
      val resume-draft = fn() resume(draft-frame)
      finally(
        fn() lift-div(fn(){
          if load(completed) then () else
            // An ambient final control never returns through error/try. Keep
            // the actual queued resumption Pending and synchronously retire
            // every continuation/scope created by the abandoned generation.
            match load(state)
              Capture-running -> store(state,Capture-pending)
              _ -> ()
            abandon-draft-frame(draft-frame,load(drafts))
        }),
        fn() lift-div(fn()
          val attempt = pretend-no-div{
            attempt-build(plane,drafts,{
              with-current(plane,current,draft-frame,resume-draft)
            })
          }
          val result = match attempt
            Error(failure) ->
              match load(state)
                Capture-running -> store(state,Capture-pending)
                _ -> ()
              abandon-draft-frame(draft-frame,load(drafts))
              Error(failure)
            Ok(built) ->
              val publish = built.built-publish
              val old = load(child)
              store(child,Trace-end)
              store(old-frame.frame-lifetime.lifetime-token,Scope-branch-dead)
              store(current-frame-slot,draft-frame)
              val retirement = pretend-no-div{
                collect-retirement-work([
                  trace-retirement-work(old),
                  lifetime-retirement-work(old-frame.frame-lifetime)
                ])
              }
              val retired = pretend-no-div{
                error/try(fn() run-finalizers(retirement))
              }
              match retired
                Error(failure) ->
                  match load(state)
                    Capture-running -> store(state,Capture-pending)
                    _ -> ()
                  abandon-draft-frame(draft-frame,load(drafts))
                  Error(failure)
                Ok(_) ->
                  match load(state)
                    Capture-dead ->
                      abandon-draft-frame(draft-frame,load(drafts))
                      Ok(())
                    _ ->
                      val publication = pretend-no-div{ publish() }
                      match publication
                        Error(failure) ->
                          match load(state)
                            Capture-running -> store(state,Capture-pending)
                            _ -> ()
                          abandon-draft-frame(draft-frame,load(drafts))
                          Error(failure)
                        Ok(_) ->
                          match load(state)
                            Capture-dead ->
                              abandon-draft-frame(draft-frame,load(drafts))
                              Ok(())
                            _ ->
                              store(child,built.built-root)
                              activate-trace(plane,built.built-root)
                              store(draft-frame.frame-lifetime.lifetime-token,Scope-live)
                              match load(state)
                                Capture-running -> store(state,Capture-live)
                                _ -> ()
                              Ok(())
          store(completed,True)
          result
        )
      )
    _ -> Ok(())

pub fun resume-capture(plane : plane<e>, current : trace<e>)
                   : <div|e> error<()>
  match current
    Trace-end -> Ok(())
    Trace-read(gate,_,_,child,current-frame-slot,resume,_,_,_) ->
      resume-node(plane,current,gate,child,current-frame-slot,resume)
    Trace-entry(gate,_,child,current-frame-slot,resume,_) ->
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
        Nothing -> error/try(fn()
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
                  val _ = error/try(fn(){
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
          Trace-read(_,slot,_,_,_,_,_,_,_) -> load(slot)
          Trace-entry(_,slot,_,_,_,_) -> load(slot)
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

pub fun run-next-effect(plane : plane<e>) : <div|e> error<bool>
  val next = take-queued-work(plane.plane-queue)
  match next
    Nothing -> Ok(False)
    Just(current) ->
      // Effect work can be abandoned by an ambient final control operation,
      // so its actual ticket stays queued across invocation. A normal success
      // makes it stale; abort/failure leaves the Pending capability recoverable.
      plane.plane-queue.prepend(current)
      match run-work-raw(plane,current)
        Error(failure) -> Error(failure)
        Ok(_) -> Ok(True)

pub fun run-next-pure(plane : plane<total>) : error<bool>
  pretend-no-div{ run-next-derived(plane) }


// --------------------------------------------------------------------------
// Isolated bootstrap transactions
// --------------------------------------------------------------------------

abstract type scheduler-transaction<e::E>
  Scheduler-transaction(
    transaction-root-key     : root-key,
    transaction-derive-group : work-group<work<total>>,
    transaction-effect-group : work-group<work<e>>
  )

pub noinline fun scheduler-transaction/state(
    transaction : scheduler-transaction<e>) : work-transaction-state
  transaction.transaction-derive-group.state

fun plane-has-group(plane : plane<e>, expected : work-group<work<e>>) : bool
  match load(plane.plane-work-group)
    Nothing -> False
    Just(actual) -> actual.same-transaction(expected)

fun check-transaction-root(root : root<e>,
                           transaction : scheduler-transaction<e>) : exn ()
  if same-root(root.root-key,transaction.transaction-root-key) &&
     !load(root.root-disposed) && !load(root.root-disposing)
  then ()
  else throw("scheduler transaction used outside its live reactive root")

fun check-active-transaction(root : root<e>,
                             transaction : scheduler-transaction<e>) : exn ()
  check-transaction-root(root,transaction)
  if root.root-derive-plane.plane-has-group(
       transaction.transaction-derive-group) &&
     root.root-effect-plane.plane-has-group(
       transaction.transaction-effect-group)
  then ()
  else throw("scheduler transaction is not active on this root")

pub fun open-work-transaction(root : root<e>) : exn scheduler-transaction<e>
  check-registration(root)
  if load(root.root-derive-plane.plane-work-group).is-just ||
     load(root.root-effect-plane.plane-work-group).is-just
  then throw("a scheduler transaction is already active on this root")
  else lift-exn(fn(){
    val state = new-work-transaction-state()
    val derive-group : work-group<work<total>> = new-work-group(state)
    val effect-group : work-group<work<e>> = new-work-group(state)
    store(root.root-derive-plane.plane-work-group,Just(derive-group))
    store(root.root-effect-plane.plane-work-group,Just(effect-group))
    Scheduler-transaction(root.root-key,derive-group,effect-group)
  })

// Structural adapters can be invoked recursively while an outer bootstrap is
// draining. They must join that exact transaction instead of opening a second
// pair of local groups or scanning the global frontier. The returned value is
// only a borrowed capability; ownership remains with the caller which opened
// the transaction.
pub fun current-work-transaction(root : root<e>)
                                 : exn maybe<scheduler-transaction<e>>
  check-registration(root)
  match (load(root.root-derive-plane.plane-work-group),
         load(root.root-effect-plane.plane-work-group))
    (Nothing,Nothing) -> Nothing
    (Just(derive-group),Just(effect-group)) ->
      if !derive-group.same-transaction(effect-group)
      then throw("reactive planes disagree about the active transaction")
      else match derive-group.state
        Work-open -> Just(Scheduler-transaction(
          root.root-key,derive-group,effect-group))
        Work-draining -> Just(Scheduler-transaction(
          root.root-key,derive-group,effect-group))
        _ -> throw("cannot join a terminal scheduler transaction")
    _ -> throw("reactive planes have a partially attached transaction")

tail fun restore-group-skipped(group : work-group<work<e>>,
                               skipped : list<work<e>>) : <div> ()
  match skipped
    Nil -> ()
    Cons(current,rest) ->
      group.prepend(current)
      restore-group-skipped(group,rest)

tail fun take-group-work-loop(group : work-group<work<e>>,
                              skipped : list<work<e>>)
                             : <div> maybe<work<e>>
  match group.pop
    Nothing ->
      restore-group-skipped(group,skipped)
      Nothing
    Just(current) ->
      if current.work-runnable then
        restore-group-skipped(group,skipped)
        Just(current)
      elif current.work-stale then take-group-work-loop(group,skipped)
      else take-group-work-loop(group,Cons(current,skipped))

fun take-group-work(group : work-group<work<e>>) : maybe<work<e>>
  pretend-no-div{ take-group-work-loop(group,[]) }

fun restore-group-deferred(group : work-group<work<total>>,
                           deferred : list<work<total>>) : ()
  group.append-values(pretend-no-div{ deferred.reverse })

fun run-next-derived-group-loop(plane : plane<total>,
                                group : work-group<work<total>>,
                                deferred : list<work<total>>)
                               : div error<bool>
  match take-group-work(group)
    Nothing ->
      restore-group-deferred(group,deferred)
      Ok(False)
    Just(current) ->
      match run-derive-work(plane,current)
        Settle-ok ->
          if current.work-stale then () else group.append(current)
          restore-group-deferred(group,deferred)
          Ok(True)
        Settle-deferred ->
          run-next-derived-group-loop(plane,group,Cons(current,deferred))
        Settle-failed(failure) ->
          if current.work-stale then () else group.append(current)
          restore-group-deferred(group,deferred)
          Error(failure)

fun run-next-derived-group(plane : plane<total>,
                           group : work-group<work<total>>) : error<bool>
  pretend-no-div{ run-next-derived-group-loop(plane,group,[]) }

fun run-next-effect-group(plane : plane<e>, group : work-group<work<e>>)
                      : <div|e> error<bool>
  match take-group-work(group)
    Nothing -> Ok(False)
    Just(current) ->
      // Preserve the concrete ticket across an ambient final-control unwind.
      group.prepend(current)
      match run-work-raw(plane,current)
        Error(failure) -> Error(failure)
        Ok(_) -> Ok(True)

fun drain-work-transaction-loop(root : root<e>,
                                transaction : scheduler-transaction<e>)
                               : <div|e> error<()>
  match run-next-derived-group(
          root.root-derive-plane,transaction.transaction-derive-group)
    Error(failure) -> Error(failure)
    Ok(True) -> drain-work-transaction-loop(root,transaction)
    Ok(False) ->
      match run-next-effect-group(
              root.root-effect-plane,transaction.transaction-effect-group)
        Error(failure) -> Error(failure)
        Ok(True) -> drain-work-transaction-loop(root,transaction)
        Ok(False) -> Ok(())

pub fun drain-work-transaction(root : root<e>,
                               transaction : scheduler-transaction<e>)
                              : <div,exn|e> ()
  check-active-transaction(root,transaction)
  val derive-group = transaction.transaction-derive-group
  if !derive-group.begin-drain
  then lift-div(fn(){
    throw("scheduler transaction can only be drained while open")
  })
  else
    val completed = cell(False)
    val (result,transitioned) = lift-exn(fn()
      finally(
        fn() lift-div(fn(){
          if load(completed) then () else
            // `error/try` cannot observe an abortive final control operation.
            // Dynamically abort and detach the local groups before control
            // returns to the host, just as abandoned continuation drafts roll
            // back from their surrounding `finally`.
            val _ = error/try(fn(){
              abort-work-transaction(root,transaction)
            })
            ()
        }),
        fn()
          val result = drain-work-transaction-loop(root,transaction)
          val transitioned = match result
            Error(failure) -> derive-group.mark-failed(failure)
            Ok(_) -> derive-group.mark-ready
          if transitioned then
            // Ordinary failure is a completed drain with Work-failed state; only
            // a non-local exit before this point should trigger dynamic abort.
            store(completed,True)
          else ()
          (result,transitioned)
      )
    )
    if !transitioned
    then throw("scheduler transaction could not enter a terminal drain state")
    else result.untry

fun detach-matching-group(plane : plane<e>,
                          expected : work-group<work<e>>) : ()
  match load(plane.plane-work-group)
    Nothing -> ()
    Just(actual) ->
      if actual.same-transaction(expected)
      then store(plane.plane-work-group,Nothing)
      else ()

pub fun commit-work-transaction(root : root<e>,
                                transaction : scheduler-transaction<e>)
                               : exn ()
  check-active-transaction(root,transaction)
  val derive-group = transaction.transaction-derive-group
  val effect-group = transaction.transaction-effect-group
  match derive-group.state
    Work-ready ->
      val derive-residual = derive-group.take-all
      val effect-residual = effect-group.take-all
      root.root-derive-plane.detach-matching-group(derive-group)
      root.root-effect-plane.detach-matching-group(effect-group)
      root.root-derive-plane.plane-queue.append-values(derive-residual)
      root.root-effect-plane.plane-queue.append-values(effect-residual)
      if derive-group.mark-committed then
        // Structural owners retain committed scopes; the transaction no longer
        // needs its rollback-only references after the state becomes terminal.
        derive-group.release-rollback
        effect-group.release-rollback
      else throw("scheduler transaction commit lost its ready state")
    _ -> throw("scheduler transaction must drain successfully before commit")

tail fun prepend-bootstrap-retirements(
    values : list<work<e>>, collected : list<retirement-work<e>>)
    : <div> list<retirement-work<e>>
  match values
    Nil -> collected
    Cons(current,rest) ->
      match current
        Bootstrap-work(scope,_) -> prepend-bootstrap-retirements(
          rest,Cons(scope-retirement-work(scope),collected))
        // Scheduler routing keeps every resumption on the global frontier.
        // Ignore a malformed local resume instead of retiring a live trace.
        Resume-work(_) -> prepend-bootstrap-retirements(rest,collected)

tail fun prepend-pure-bootstrap-retirements(
    values : list<work<total>>, collected : list<retirement-work<e>>)
    : <div> list<retirement-work<e>>
  match values
    Nil -> collected
    Cons(current,rest) ->
      match current
        Bootstrap-work(scope,_) ->
          val structural = widen-pure-retirement(
            scope-retirement-work(scope))
          prepend-pure-bootstrap-retirements(
            rest,Cons(structural,collected))
        Resume-work(_) -> prepend-pure-bootstrap-retirements(rest,collected)

fun retire-transaction-bootstraps(
    derive-owned : list<work<total>>, effect-owned : list<work<e>>)
    : <div,exn|e> ()
  val effect-structural = prepend-bootstrap-retirements(effect-owned,[])
  val structural = prepend-pure-bootstrap-retirements(
    derive-owned,effect-structural)
  // Expand every transaction-owned scope first. All bootstrap slots are
  // cleared, scopes are dead, and owner registrations are unlinked before
  // cleanup can run, including scopes which already drained successfully.
  val finalizers = collect-retirement-work(structural)
  run-finalizers(finalizers)

pub fun abort-work-transaction(root : root<e>,
                               transaction : scheduler-transaction<e>)
                              : <exn|e> ()
  pretend-no-div{
    if !same-root(root.root-key,transaction.transaction-root-key) then () else
      val derive-group = transaction.transaction-derive-group
      val effect-group = transaction.transaction-effect-group
      match derive-group.state
        Work-committed -> ()
        Work-aborted ->
          // Keep repeated abort idempotent even if the first call was itself
          // left through final control while running retirement finalizers.
          root.root-derive-plane.detach-matching-group(derive-group)
          root.root-effect-plane.detach-matching-group(effect-group)
          derive-group.clear
          effect-group.clear
        _ ->
          // Claim the complete rollback ledgers before clearing runnable queues.
          // A successful drain has already discarded its stale queue ticket but
          // remains transaction-owned until this claim or an explicit commit.
          val derive-owned = derive-group.take-rollback
          val effect-owned = effect-group.take-rollback
          root.root-derive-plane.detach-matching-group(derive-group)
          root.root-effect-plane.detach-matching-group(effect-group)
          val claimed = derive-group.mark-aborted
          effect-group.clear
          if !claimed
          then throw("scheduler transaction abort lost its active state")
          else retire-transaction-bootstraps(derive-owned,effect-owned)
  }

pub fun settle-failure(message : string) : settle-result
  match error/try(fn() throw(message))
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

pub fun settle-entry-target(plane : plane<total>,
                        entry : maybe<trace<total>>) : <div> settle-result
  match entry
    Nothing -> Settle-ok
    Just(target) ->
      match target.trace-state-of
        Capture-live -> Settle-ok
        Capture-pending -> settle-trace-result(plane,target)
        // The owner read belongs to a generation already replaced/retired.
        Capture-dead -> Settle-ok
        Capture-draft -> settle-failure("state entry target is draft")
        Capture-running -> settle-failure("cyclic state entry target")

pub fun settle-entry-node(plane : plane<total>, current : trace<total>,
                      gate : continuation-gate,
                      child : ref<global,trace<total>>)
                     : <div> settle-result
  match load(gate.gate-state)
    Capture-pending -> settle-trace-recheck(plane,current,gate)
    Capture-live ->
      val nested = settle-trace-result(plane,load(child))
      // Any result from the previous child is obsolete if nested settlement
      // invalidated the Entry. Resume the Entry K before propagating a stale
      // child failure/defer result.
      match load(gate.gate-state)
        Capture-pending -> settle-trace-recheck(plane,current,gate)
        Capture-live -> nested
        _ ->
          match nested
            Settle-ok -> settle-trace-recheck(plane,current,gate)
            _ -> nested
    _ -> settle-trace-recheck(plane,current,gate)

pub fun settle-read-child(plane : plane<total>, current : trace<total>,
                      gate : continuation-gate,
                      entry : maybe<trace<total>>,
                      child : ref<global,trace<total>>)
                     : <div> settle-result
  match settle-entry-target(plane,entry)
    Settle-deferred -> Settle-deferred
    Settle-failed(failure) -> Settle-failed(failure)
    Settle-ok ->
      match load(gate.gate-state)
        Capture-dead -> Settle-ok
        Capture-live ->
          val nested = settle-trace-result(plane,load(child))
          match settle-entry-target(plane,entry)
            Settle-deferred -> Settle-deferred
            Settle-failed(failure) -> Settle-failed(failure)
            Settle-ok ->
              match load(gate.gate-state)
                Capture-dead -> Settle-ok
                _ ->
                  match nested
                    Settle-ok -> settle-trace-recheck(plane,current,gate)
                    _ -> nested
        _ -> settle-trace-recheck(plane,current,gate)

pub fun settle-read-node(plane : plane<total>, current : trace<total>,
                     gate : continuation-gate,
                     entry : maybe<trace<total>>,
                     child : ref<global,trace<total>>)
                    : <div> settle-result
  // Entry is checked before the producer input, after that input settles, and
  // again after the child. This prevents work in an obsolete entry generation
  // from winning over the actual Entry continuation.
  match settle-entry-target(plane,entry)
    Settle-deferred -> Settle-deferred
    Settle-failed(failure) -> Settle-failed(failure)
    Settle-ok ->
      match load(gate.gate-state)
        Capture-dead -> Settle-ok
        Capture-live ->
          val input = match gate.gate-input-producer
            Nothing -> Settle-ok
            Just(upstream) -> settle-producer-result(upstream)
          match settle-entry-target(plane,entry)
            Settle-deferred -> Settle-deferred
            Settle-failed(failure) -> Settle-failed(failure)
            Settle-ok ->
              match load(gate.gate-state)
                Capture-dead -> Settle-ok
                _ ->
                  match input
                    Settle-ok ->
                      settle-read-child(plane,current,gate,entry,child)
                    Settle-deferred -> Settle-deferred
                    Settle-failed(failure) -> Settle-failed(failure)
        _ -> settle-trace-recheck(plane,current,gate)

pub fun settle-trace-result(plane : plane<total>, current : trace<total>)
                       : <div> settle-result
  match current
    Trace-end -> Settle-ok
    Trace-read(gate,_,entry,child,_,_,_,_,_) ->
      settle-read-node(plane,current,gate,entry,child)
    Trace-entry(gate,_,child,_,_,_) ->
      settle-entry-node(plane,current,gate,child)

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
          // Validation can retire the structural owner, so recheck before
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
  finally(fn() restore-pure-plane(previous-phase),fn()
    if load(producer.producer-settling)
    then settle-failure("cyclic derived continuation")
    else
      store(producer.producer-settling,True)
      val result = settle-producer-body(producer)
      store(producer.producer-settling,False)
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

pub fun drain-loop(root : root<e>) : <div|e> error<()>
  // Only the raw continuation machinery contributes `div`; the pure plane
  // has no ambient user effect to erase or coerce.
  val derivation = run-next-pure(root.root-derive-plane)
  match derivation
    Error(failure) -> Error(failure)
    Ok(True) -> drain-loop(root)
    Ok(False) ->
      match run-next-effect(root.root-effect-plane)
        Error(failure) -> Error(failure)
        Ok(True) -> drain-loop(root)
        Ok(False) -> Ok(())

pub fun flush(root : root<e>) : <div,exn|e> ()
  if load(root.root-disposed) || load(root.root-disposing) ||
     load(root.root-flushing) || load(root.root-batch-depth) > 0
  then ()
  else
    store(root.root-flushing,True)
    val result = lift-exn(fn()
      finally(
        fn() store(root.root-flushing,False),
        fn() drain-loop(root)
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
