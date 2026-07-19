/*--------------------------------------------------------------------------
  Structural lifetime and draft-transaction operations for captured traces.
--------------------------------------------------------------------------*/
module kokaine/reactive/internal/lifetime

import kokaine/reactive/internal/model
import kokaine/internal/compat
import kokaine/internal/registry
import std/core/undiv

// --------------------------------------------------------------------------
// Trace inspection and source invalidation
// --------------------------------------------------------------------------

pub fun trace-state-of(current : trace<e>) : capture-state
  match current
    Trace-end -> Capture-dead
    Trace-read(gate,_,_,_,_,_,_,_) -> load(gate.gate-state)

pub fun trace-gate-of(current : trace<e>) : maybe<continuation-gate>
  match current
    Trace-end -> Nothing
    Trace-read(gate,_,_,_,_,_,_,_) -> Just(gate)

pub fun trace-parent-of(current : trace<e>) : maybe<continuation-gate>
  match current.trace-gate-of
    Nothing -> Nothing
    Just(gate) -> gate.gate-parent

// --------------------------------------------------------------------------
// Generic lifetime owners and iterative two-phase retirement
// --------------------------------------------------------------------------

pub alias retirement<e> = retirement-work<e>

pub fun new-retirement-coordinator() : retirement-coordinator<e>
  Retirement-coordinator(cell(0),cell(False),cell(Nothing))

pub fun retirement-coordinator/install-root-disposal(
    coordinator : retirement-coordinator<e>,
    dispose : () -> <div,exn|e> ()) : ()
  store(coordinator.retirement-dispose-root,Just(dispose))

pub fun retirement-coordinator/request-root-disposal(
    coordinator : retirement-coordinator<e>) : bool
  if load(coordinator.retirement-depth) <= 0 then False else
    store(coordinator.retirement-disposal-requested,True)
    True

pub fun new-lifetime-owner(state : scope-state,
                           coordinator : retirement-coordinator<e>)
                          : lifetime-owner<e>
  Lifetime-owner(cell(state),new-registry(),new-registry(),coordinator)

pub fun lifetime-owner/register-child(owner : lifetime-owner<e>,
                                      work : retirement-work<e>)
                                     : exn registry-registration<retirement-work<e>>
  owner.lifetime-children.insert(work)

pub fun lifetime-owner/register-finalizer(owner : lifetime-owner<e>,
                                          work : retirement-work<e>)
                                         : exn registry-registration<retirement-work<e>>
  owner.lifetime-finalizers.insert(work)

fun unlink-scope-owner(current : continuation-scope<e>) : ()
  val unlink = load(current.scope-unlink)
  store(current.scope-unlink,Nothing)
  match unlink
    Nothing -> ()
    Just(remove) ->
      val _ = remove()
      ()

tail fun reverse-onto(values : list<a>, target : list<a>) : <div> list<a>
  match values
    Nil -> target
    Cons(current,rest) -> reverse-onto(rest,Cons(current,target))

fun prepend-in-order(values : list<a>, target : list<a>) : <div> list<a>
  reverse-onto(values.reverse,target)

fun append-in-order(left : list<a>, right : list<a>) : <div> list<a>
  prepend-in-order(left,right)

fun widen-work-list(values : list<retirement-work<total>>,
                    collected : list<retirement-work<e>>)
                   : <div> list<retirement-work<e>>
  match values
    Nil -> collected.reverse
    Cons(current,rest) ->
      widen-work-list(rest,Cons(widen-pure-retirement(current),collected))

pub fun widen-pure-retirement(current : retirement-work<total>)
                         : <div> retirement-work<e>
  lift-div(fn()
    match current
      Retirement-step(expand) -> Retirement-step(fn()
        widen-work-list(expand(),[])
      )
      Retirement-finalizer(action) -> Retirement-finalizer(fn() action())
  )

fun lifetime-retirement-expand(owner : lifetime-owner<e>)
                          : <div> list<retirement-work<e>>
  store(owner.lifetime-token,Scope-dead)
  val children = match owner.lifetime-children.seal-detach
    Nothing -> []
    Just(values) -> values
  val finalizers = match owner.lifetime-finalizers.seal-detach
    Nothing -> []
    Just(values) -> values
  append-in-order(children,finalizers)

pub fun lifetime-retirement-work(owner : lifetime-owner<e>)
                            : retirement-work<e>
  Retirement-step(fn() lifetime-retirement-expand(owner))

fun trace-retirement-expand(current : trace<e>)
                       : <div> list<retirement-work<e>>
  match current
    Trace-end -> []
    Trace-read(gate,_,child,current-frame-slot,_,finalize,unlink,_) ->
      val state = gate.gate-state
      match load(state)
        Capture-dead -> []
        _ ->
          val current-frame = load(current-frame-slot)
          val lifetime = current-frame.frame-lifetime
          store(state,Capture-dead)
          store(lifetime.lifetime-token,Scope-branch-dead)
          unlink()
          val nested = load(child)
          store(child,Trace-end)
          [trace-retirement-work(nested),
           lifetime-retirement-work(lifetime),
           Retirement-finalizer(finalize)]

pub fun trace-retirement-work(current : trace<e>)
                         : <div> retirement-work<e>
  lift-div(fn() Retirement-step(fn() trace-retirement-expand(current)))

fun scope-retirement-expand(current : continuation-scope<e>)
                       : <div> list<retirement-work<e>>
  val lifetime = current.scope-lifetime
  store(current.scope-bootstrap-slot,Nothing)
  unlink-scope-owner(current)
  match load(lifetime.lifetime-token)
    Scope-dead -> []
    _ ->
      store(lifetime.lifetime-token,Scope-dead)
      val body = load(current.scope-body)
      store(current.scope-body,Trace-end)
      [trace-retirement-work(body),lifetime-retirement-work(lifetime)]

pub fun scope-retirement-work(current : continuation-scope<e>)
                         : retirement-work<e>
  Retirement-step(fn() scope-retirement-expand(current))

tail fun collect-retirement-loop(pending : list<retirement-work<e>>,
                                 collected : list<retirement-work<e>>)
                                : <div> list<retirement-work<e>>
  match pending
    Nil -> collected.reverse
    Cons(current,rest) ->
      match current
        Retirement-finalizer(_) ->
          collect-retirement-loop(rest,Cons(current,collected))
        Retirement-step(expand) ->
          collect-retirement-loop(
            prepend-in-order(expand(),rest),collected)

pub fun collect-retirement-work(values : list<retirement-work<e>>)
                           : <div> list<retirement-work<e>>
  collect-retirement-loop(values,[])

pub fun collect-scope(current : continuation-scope<e>)
                 : <div> list<retirement<e>>
  collect-retirement-work([scope-retirement-work(current)])

pub fun collect-lifetime(owner : lifetime-owner<e>)
                    : <div> list<retirement<e>>
  collect-retirement-work([lifetime-retirement-work(owner)])

fun run-finalizers-loop(coordinator : retirement-coordinator<e>,
                        finalizers : list<retirement<e>>,
                        latest : maybe<exception>)
                       : <div,exn|e> ()
  match finalizers
    Nil ->
      match latest
        Nothing -> ()
        Just(problem) -> throw-exn(problem)
    Cons(current,rest) ->
      match current
        Retirement-step(_) ->
          run-finalizers-loop(
            coordinator,
            pretend-no-div{ collect-retirement-work(Cons(current,rest)) },
            latest)
        Retirement-finalizer(finalize) ->
          val completed = cell(False)
          val attempted = finally(
            fn() {
              if load(completed) then ()
              else run-finalizers-loop(coordinator,rest,Nothing)
            },
            fn() lift-exn(fn()
              val result = capture-error(finalize)
              store(completed,True)
              result
            )
          )
          match attempted
            Ok(_) -> run-finalizers-loop(coordinator,rest,latest)
            Error(problem) ->
              run-finalizers-loop(coordinator,rest,Just(problem))

fun retirement-coordinator/leave(coordinator : retirement-coordinator<e>)
                            : <div,exn|e> ()
  val next = max(0,load(coordinator.retirement-depth) - 1)
  store(coordinator.retirement-depth,next)
  if next > 0 || !load(coordinator.retirement-disposal-requested)
  then ()
  else
    store(coordinator.retirement-disposal-requested,False)
    match load(coordinator.retirement-dispose-root)
      Nothing -> ()
      Just(dispose) -> dispose()

pub fun run-finalizers(coordinator : retirement-coordinator<e>,
                       finalizers : list<retirement<e>>)
                  : <div,exn|e> ()
  store(coordinator.retirement-depth,
        load(coordinator.retirement-depth) + 1)
  finally(
    fn() coordinator.leave,
    fn() run-finalizers-loop(coordinator,finalizers,Nothing)
  )

fun trace-retirement-coordinator(current : trace<e>)
                            : maybe<retirement-coordinator<e>>
  match current
    Trace-end -> Nothing
    Trace-read(_,_,_,frame,_,_,_,_) ->
      Just(load(frame).frame-lifetime.lifetime-retirement)

tail fun traces-retirement-coordinator(values : list<trace<e>>)
                                  : maybe<retirement-coordinator<e>>
  match values
    Nil -> Nothing
    Cons(current,rest) ->
      match trace-retirement-coordinator(current)
        Nothing -> traces-retirement-coordinator(rest)
        found -> found

pub fun retire-lifetime(owner : lifetime-owner<e>) : <div,exn|e> ()
  val finalizers = pretend-no-div{ collect-lifetime(owner) }
  run-finalizers(owner.lifetime-retirement,finalizers)

pub fun retire-scope(current : continuation-scope<e>) : <div,exn|e> ()
  val finalizers = pretend-no-div{ collect-scope(current) }
  run-finalizers(current.scope-lifetime.lifetime-retirement,finalizers)

tail fun draft-work-list(values : list<trace<e>>,
                         collected : list<retirement-work<e>>)
                        : <div> list<retirement-work<e>>
  match values
    Nil -> collected.reverse
    Cons(current,rest) ->
      draft-work-list(rest,Cons(trace-retirement-work(current),collected))

pub fun collect-scope-drafts(current : continuation-scope<e>,
                             values : list<trace<e>>)
                            : <div> list<retirement<e>>
  val work = draft-work-list(values,[scope-retirement-work(current)])
  collect-retirement-work(work)

pub fun collect-lifetime-drafts(owner : lifetime-owner<e>,
                                values : list<trace<e>>)
                               : <div> list<retirement<e>>
  val work = draft-work-list(values,[lifetime-retirement-work(owner)])
  collect-retirement-work(work)

pub fun retire-scope-drafts(current : continuation-scope<e>,
                            values : list<trace<e>>)
                           : <div,exn|e> ()
  val finalizers = pretend-no-div{ collect-scope-drafts(current,values) }
  run-finalizers(current.scope-lifetime.lifetime-retirement,finalizers)

pub fun retire-lifetime-drafts(owner : lifetime-owner<e>,
                               values : list<trace<e>>)
                              : <div,exn|e> ()
  val finalizers = pretend-no-div{ collect-lifetime-drafts(owner,values) }
  run-finalizers(owner.lifetime-retirement,finalizers)

pub fun retire-drafts(values : list<trace<e>>) : <div,exn|e> ()
  match traces-retirement-coordinator(values)
    Nothing -> ()
    Just(coordinator) ->
      val work = draft-work-list(values,[])
      val finalizers = pretend-no-div{ collect-retirement-work(work) }
      run-finalizers(coordinator,finalizers)

pub fun retire-drafts-now(values : list<trace<e>>) : <exn|e> ()
  pretend-no-div{ retire-drafts(values) }

pub fun try-retire-scope-drafts(current : continuation-scope<e>,
                                values : list<trace<e>>) : e error<()>
  capture-error(fn() pretend-no-div{ retire-scope-drafts(current,values) })

pub fun try-retire-lifetime-drafts(owner : lifetime-owner<e>,
                                   values : list<trace<e>>) : e error<()>
  capture-error(fn() pretend-no-div{ retire-lifetime-drafts(owner,values) })

pub fun record-draft(plane : plane<e>, current : trace<e>) : exn ()
  match load(plane.plane-draft)
    Nothing -> throw("continuation node created outside a draft transaction")
    Just(values) -> store(values,Cons(current,load(values)))

pub fun attempt-build(plane : plane<e>,
                  drafts : ref<global,list<trace<e>>>,
                  action : () -> <div,exn|e> built-trace<e>)
                 : <div|e> error<built-trace<e>>
  val previous = load(plane.plane-draft)
  finally(
    fn() store(plane.plane-draft,previous),
    fn()
      store(plane.plane-draft,Just(drafts))
      capture-error(action)
  )

pub fun with-frame(plane : plane<r>, current : frame<r>,
               action : () -> <div,exn|e> a) : <div,exn|e> a
  val previous = load(plane.plane-current-frame)
  finally(
    fn() store(plane.plane-current-frame,previous),
    fn()
      store(plane.plane-current-frame,current)
      action()
  )

pub fun with-current(plane : plane<e>, current : trace<e>, current-frame : frame<e>,
                 action : () -> <div,exn|e> a) : <div,exn|e> a
  match current.trace-gate-of
    Nothing -> with-context(plane,Nothing,current-frame,action)
    Just(gate) -> with-context(plane,Just(gate),current-frame,action)

pub fun with-context(plane : plane<r>, current : maybe<continuation-gate>,
                 current-frame : frame<r>,
                 action : () -> <div,exn|e> a) : <div,exn|e> a
  val previous = load(plane.plane-current)
  finally(
    fn() store(plane.plane-current,previous),
    fn()
      store(plane.plane-current,current)
      with-frame(plane,current-frame,action)
  )
