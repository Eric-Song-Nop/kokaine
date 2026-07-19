/*--------------------------------------------------------------------------
  Provisional bootstrap frontiers owned by reactive integrations.

  A provision isolates bootstrap work until its integration explicitly
  drains and promotes it. The core scheduler supplies only generic work and
  settle primitives; this module owns the lease state machine, local drain,
  and rollback retirement policy.
--------------------------------------------------------------------------*/
module kokaine/reactive/integration/internal/provision

import kokaine/reactive/internal/model
import kokaine/reactive/internal/scheduler
import kokaine/reactive/internal/lifetime
import kokaine/reactive/internal/work-transaction
import kokaine/internal/compat
import std/core/undiv


abstract type provision<e::E>
  Provision(
    provision-root         : root<e>,
    provision-derive-group : work-group<work<total>>,
    provision-effect-group : work-group<work<e>>
  )

abstract type provision-lease<e::E>
  Provision-lease(
    lease-provision : provision<e>
  )

pub fun provision-lease/provision(lease : provision-lease<e>) : provision<e>
  lease.lease-provision

pub fun provision/same(left : provision<e>, right : provision<e>) : bool
  same-root(left.provision-root.root-key,right.provision-root.root-key) &&
  left.provision-derive-group.same-transaction(
    right.provision-derive-group) &&
  left.provision-effect-group.same-transaction(
    right.provision-effect-group)

pub noinline fun provision-lease/state(
    lease : provision-lease<e>) : work-transaction-state
  lease.lease-provision.provision-derive-group.state

fun plane-has-group(plane : plane<e>, expected : work-group<work<e>>) : bool
  match load(plane.plane-work-group)
    Nothing -> False
    Just(actual) -> actual.same-transaction(expected)

fun check-provision-root(current : provision<e>) : exn ()
  val root = current.provision-root
  if !load(root.root-disposed) && !load(root.root-disposing)
  then ()
  else throw("provisional frontier belongs to a retired reactive root")

fun check-active-provision(current : provision<e>) : exn ()
  check-provision-root(current)
  val root = current.provision-root
  if root.root-derive-plane.plane-has-group(
       current.provision-derive-group) &&
     root.root-effect-plane.plane-has-group(
       current.provision-effect-group)
  then ()
  else throw("provisional frontier is not active on its reactive root")

pub fun open-provision(root : root<e>) : exn provision-lease<e>
  check-registration(root)
  if load(root.root-derive-plane.plane-work-group).is-just ||
     load(root.root-effect-plane.plane-work-group).is-just
  then throw("a provision is already active on this root")
  else lift-exn(fn(){
    val state = new-work-transaction-state()
    val derive-group : work-group<work<total>> = new-work-group(state)
    val effect-group : work-group<work<e>> = new-work-group(state)
    store(root.root-derive-plane.plane-work-group,Just(derive-group))
    store(root.root-effect-plane.plane-work-group,Just(effect-group))
    Provision-lease(Provision(root,derive-group,effect-group))
  })

// Integrations inspect the active frontier to decide whether they own a new
// boundary or join work already being drained.
pub fun current-provision(root : root<e>) : exn maybe<provision<e>>
  check-registration(root)
  match (load(root.root-derive-plane.plane-work-group),
         load(root.root-effect-plane.plane-work-group))
    (Nothing,Nothing) -> Nothing
    (Just(derive-group),Just(effect-group)) ->
      if !derive-group.same-transaction(effect-group)
      then throw("reactive planes disagree about the active provision")
      else match derive-group.state
        Work-open -> Just(Provision(root,derive-group,effect-group))
        Work-draining -> Just(Provision(root,derive-group,effect-group))
        _ -> throw("cannot join a terminal provision")
    _ -> throw("reactive root has a partially attached provision")

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

fun drain-provision-loop(current : provision<e>) : <div|e> error<()>
  val root = current.provision-root
  match run-next-derived-group(
          root.root-derive-plane,current.provision-derive-group)
    Error(failure) -> Error(failure)
    Ok(True) -> drain-provision-loop(current)
    Ok(False) ->
      match run-next-effect-group(
              root.root-effect-plane,current.provision-effect-group)
        Error(failure) -> Error(failure)
        Ok(True) -> drain-provision-loop(current)
        Ok(False) -> Ok(())

pub fun drain-provision(lease : provision-lease<e>) : <div,exn|e> ()
  val current = lease.provision
  check-active-provision(current)
  val derive-group = current.provision-derive-group
  if !derive-group.begin-drain
  then lift-div(fn(){
    throw("provision can only be drained while open")
  })
  else
    val completed = cell(False)
    val (result,transitioned) = lift-exn(fn()
      finally(
        fn() lift-div(fn(){
          if load(completed) then () else
            // `capture-error` cannot observe an abortive final control operation.
            // Dynamically abort and detach the local groups before control
            // returns to the host, just as abandoned continuation drafts roll
            // back from their surrounding `finally`.
            val _ = capture-error(fn(){
              discard-provision(lease)
            })
            ()
        }),
        fn()
          val result = drain-provision-loop(current)
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
    then throw("provision could not enter a terminal drain state")
    else result.untry

fun detach-matching-group(plane : plane<e>,
                          expected : work-group<work<e>>) : ()
  match load(plane.plane-work-group)
    Nothing -> ()
    Just(actual) ->
      if actual.same-transaction(expected)
      then store(plane.plane-work-group,Nothing)
      else ()

pub fun promote-provision(lease : provision-lease<e>) : <div,exn|e> ()
  lift-div(fn()
    val current = lease.provision
    check-active-provision(current)
    val root = current.provision-root
    val derive-group = current.provision-derive-group
    val effect-group = current.provision-effect-group
    match derive-group.state
      Work-ready ->
        val derive-residual = derive-group.take-all
        val effect-residual = effect-group.take-all
        root.root-derive-plane.detach-matching-group(derive-group)
        root.root-effect-plane.detach-matching-group(effect-group)
        root.root-derive-plane.plane-queue.append-values(derive-residual)
        root.root-effect-plane.plane-queue.append-values(effect-residual)
        if derive-group.mark-committed then
          derive-group.release-rollback
          effect-group.release-rollback
        else throw("provision promotion lost its ready state")
      _ -> throw("provision must drain successfully before promotion")
  )

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

fun retire-provision-bootstraps(
    root : root<e>,
    derive-owned : list<work<total>>, effect-owned : list<work<e>>)
    : <div,exn|e> ()
  val effect-structural = prepend-bootstrap-retirements(
    effect-owned,[])
  val structural = prepend-pure-bootstrap-retirements(
    derive-owned,effect-structural)
  // Expand every provision-owned scope first. All bootstrap slots are
  // cleared, scopes are dead, and owner registrations are unlinked before
  // cleanup can run, including scopes which already drained successfully.
  val finalizers = collect-retirement-work(structural)
  run-finalizers(root.root-lifetime.lifetime-retirement,finalizers)

pub fun discard-provision(lease : provision-lease<e>) : <exn|e> ()
  pretend-no-div{
    val current = lease.provision
    val root = current.provision-root
    val derive-group = current.provision-derive-group
    val effect-group = current.provision-effect-group
    match derive-group.state
      Work-committed -> ()
      Work-aborted ->
        // Keep repeated discard idempotent even if the first call was itself
        // left through final control while running retirement finalizers.
        root.root-derive-plane.detach-matching-group(derive-group)
        root.root-effect-plane.detach-matching-group(effect-group)
        derive-group.clear
        effect-group.clear
      _ ->
        // Claim the complete rollback ledgers before clearing runnable queues.
        // A successful drain has already discarded its stale queue ticket but
        // remains provision-owned until this claim or an explicit promotion.
        val derive-owned = derive-group.take-rollback
        val effect-owned = effect-group.take-rollback
        root.root-derive-plane.detach-matching-group(derive-group)
        root.root-effect-plane.detach-matching-group(effect-group)
        val claimed = derive-group.mark-aborted
        effect-group.clear
        if !claimed
        then throw("provision discard lost its active state")
        else retire-provision-bootstraps(
          root,derive-owned,effect-owned)
  }
