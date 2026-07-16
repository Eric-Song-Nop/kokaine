/*--------------------------------------------------------------------------
  Copyright (c) 2026 Kokaine contributors. SPDX-License-Identifier: MIT

  Browser structured concurrency. Each child strand turns host suspensions
  into queued resumption thunks. The driver consumes those thunks until every
  child has returned or finished unwinding after cancellation.
--------------------------------------------------------------------------*/
module kokaine/async/structured

import kokaine/async/effects
import kokaine/async/channel
import std/core/unsafe
import std/core/undiv


type strand-outcome<a>
  Strand-value(value : a)
  Strand-exception(error : exception)
  Strand-canceled
  Strand-finalized(yield : yield-info)

type group-outcome<a>
  Group-values(values : list<(int,a)>)
  Group-exception(error : exception)
  Group-canceled
  Group-finalized(yield : yield-info)

type group-state<a>
  Group-state(active : int, outcome : group-outcome<a>,
              owned : list<(int,dispose-fn)>)

// Structured awaits are one-shot. An invocation-local cell can consequently
// hold the drain ledger without adding a private effect to every user thunk.
// It is never shared between parallel/race invocations or stored globally.
abstract value type strand-group<a>
  Strand-group(state : ref<global,group-state<a>>, require-all : bool)

// A nearer structured handler wraps the raw host disposer before the base
// generation runtime registers it. Releasing the base registration and then
// claiming this guard implements discard without changing the public
// `async-own` release protocol.
abstract value type ownership-guard
  Ownership-guard(disposer : ref<global,maybe<dispose-fn>>)

fun group-cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun group-load(value : ref<global,a>) : a
  unsafe-total { !value }

fun group-store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun new-ownership-guard(dispose : dispose-fn) : ownership-guard
  Ownership-guard(group-cell(Just(dispose)))

fun ownership-guard/retire(guard : ownership-guard) : ui ()
  match guard
    Ownership-guard(slot) ->
      val current = group-load(slot)
      group-store(slot,Nothing)
      match current
        Nothing -> ()
        Just(dispose) -> dispose()

fun ownership-guard/accept(guard : ownership-guard) : ()
  match guard
    Ownership-guard(slot) -> group-store(slot,Nothing)

fun ownership-guard/as-disposer(guard : ownership-guard) : dispose-fn
  fn() guard.retire

fun release-ownership(release : dispose-fn,
                      guard : ownership-guard) : ui ()
  release()
  guard.accept

fun ownership-release-capability(release : dispose-fn,
                                 guard : ownership-guard) : dispose-fn
  fn() release-ownership(release,guard)

fun discard-ownership(release : dispose-fn,
                      guard : ownership-guard) : ui ()
  // Unlink the generation registration first. If a retirement snapshot has
  // already won, its guarded disposer and this path still share one raw slot.
  release()
  guard.retire

fun ownership-discard-capability(release : dispose-fn,
                                 guard : ownership-guard) : dispose-fn
  fn() discard-ownership(release,guard)

fun group-lift-div(action : () -> e a) : <div|e> a
  mask<div>{ action() }

fun group-lift-exn(action : () -> e a) : <exn|e> a
  mask<exn>{ action() }

fun new-strand-group(require-all : bool) : strand-group<a>
  Strand-group(
    group-cell(Group-state(0,Group-values([]),[])),require-all)

tail fun ordered-insert(values : list<(int,a)>, entry : (int,a))
                       : list<(int,a)>
  match values
    Cons(value,rest) | value.fst < entry.fst ->
      Cons(value,ordered-insert(rest,entry))
    _ -> Cons(entry,values)

fun group-outcome/add(current : group-outcome<a>, index : int,
                      outcome : strand-outcome<a>, require-all : bool)
                     : group-outcome<a>
  if !require-all then
    // A value or ordinary cancellation settles a race once. An exception or
    // final control observed while unwinding a loser is cleanup failure, and
    // follows Koka's `finally` rule by replacing the earlier body outcome.
    match outcome
      Strand-exception(error) -> Group-exception(error)
      Strand-finalized(yield) -> Group-finalized(yield)
      Strand-value(value) ->
        match current
          Group-values(Nil) -> Group-values([(index,value)])
          _ -> current
      Strand-canceled ->
        match current
          Group-values(Nil) -> Group-canceled
          _ -> current
  else
    match outcome
      Strand-value(value) ->
        match current
          Group-values(values) ->
            Group-values(ordered-insert(values,(index,value)))
          _ -> current
      Strand-exception(error) ->
        Group-exception(error)
      Strand-finalized(yield) ->
        Group-finalized(yield)
      Strand-canceled ->
        match current
          Group-values(_) -> Group-canceled
          _ -> current

fun group-outcome/resume(current : group-outcome<a>) : <async,exn> list<a>
  match current
    Group-values(values) -> values.map(snd)
    Group-exception(error) -> Error(error).untry
    Group-canceled -> discontinue()
    Group-finalized(yield) -> unsafe-reyield(yield)

fun group-outcome/keeps-owned(current : group-outcome<a>, index : int,
                              require-all : bool) : bool
  match current
    Group-values(values) ->
      require-all || values.any(fn(entry) entry.fst == index)
    _ -> False

fun strand-group/active(group : strand-group<a>) : bool
  match group
    Strand-group(state,_) -> group-load(state).active > 0

fun strand-group/start(group : strand-group<a>) : ()
  match group
    Strand-group(state,_) ->
      match group-load(state)
        Group-state(active,outcome,owned) ->
          group-store(state,Group-state(active + 1,outcome,owned))

fun strand-group/finish(group : strand-group<a>, index : int,
                        result : strand-outcome<a>) : ()
  match group
    Strand-group(state,require-all) ->
      match group-load(state)
        Group-state(active,outcome,owned) ->
          group-store(state,Group-state(
            active - 1,
            outcome.add(index,result,require-all),
            owned
          ))

fun strand-group/track-owned(group : strand-group<a>, index : int,
                             discard : dispose-fn) : ()
  match group
    Strand-group(state,_) ->
      match group-load(state)
        Group-state(active,outcome,owned) ->
          group-store(state,Group-state(
            active,outcome,Cons((index,discard),owned)))

fun strand-group/results(group : strand-group<a>) : <async,exn> list<a>
  match group
    Strand-group(state,require-all) ->
      match group-load(state)
        Group-state(active,outcome,owned) ->
          // Detach the rollback ledger before invoking untrusted host
          // disposers. Nested/re-entrant cleanup can no longer claim it twice.
          group-store(state,Group-state(active,outcome,[]))
          owned.foreach fn(entry)
            if outcome.keeps-owned(entry.fst,require-all) then ()
            else async-host(entry.snd)
          outcome.resume

// Once a race has a winner, or a parallel group has failed/canceled, every
// later queued ordinary result is a loser. It must take the retained Cancel
// path instead of running user code after its await.
fun strand-group/is-settled(group : strand-group<a>) : bool
  match group
    Strand-group(state,require-all) ->
      match group-load(state).outcome
        Group-values(Nil) -> False
        Group-values(_) -> !require-all
        _ -> True

// Install one explicit group scope inside the routing handler. The route is
// deliberately outermost: when its captured strand resumes in a later browser
// turn, the fixed scope override remains part of that continuation, including
// for second and subsequent awaits.
fun in-strand-scope(scope : async-scope, action : () -> <async|e> a)
                    : <async|e> a
  with override
    val async-scope = scope
    fun is-scope-canceled(current) is-scope-canceled(current)
    fun cancel-scope(current) cancel-scope(current)
    fun release-canceled-scope(current) release-canceled-scope(current)
  action()

// Record ownership acquired inside a child dynamic extent. The outer runtime
// still owns the actual one-shot lease; this nearer handler retains only its
// discard capability so an unreachable group result can be rolled back.
fun in-strand-ownership(group : some<a> strand-group<a>, index : int,
                        action : () -> <async|e> b) : <async|e> b
  with override
    fun async-own-disposer(dispose)
      val guard = new-ownership-guard(dispose)
      val release = async-own-disposer(guard.as-disposer)
      group.track-owned(
        index,ownership-discard-capability(release,guard))
      ownership-release-capability(release,guard)
  action()

fun run-strand(
    require-all : bool,
    group : some<a> strand-group<a>,
    queue,
    scope : async-scope,
    index : int,
    action)
  group.start
  with route-awaits(queue)
  in-strand-scope(scope,fn()
    in-strand-ownership(group,index,fn()
      if is-canceled() then
        group.finish(index,Strand-canceled)
      else
        val outcome =
          with unsafe-try-finalize
          with unsafe-uncancel
          error/try(fn() action())
        match outcome
          Right(Just(Ok(value))) ->
            group.finish(index,Strand-value(value))
            if !require-all then cancel-outstanding()
          Right(Just(Error(error))) ->
            group.finish(index,Strand-exception(error))
            cancel-outstanding()
          Right(Nothing) ->
            group.finish(index,Strand-canceled)
            cancel-outstanding()
          Left(yield) ->
            group.finish(index,Strand-finalized(yield))
            cancel-outstanding()
    )
  )

// Every queued item selects between its real completion and a first synthetic
// cancellation. Parent retirement enters this drain through the driver's
// `finally` while the async interpreter is still installed, so no later
// browser turn or live structural frame is needed to unwind child finalizers.
// `noinline` also keeps this higher-rank queue row out of Koka 3.2's cached
// inline printer.
noinline fun cancel-queued(queue : resume-queue<(bool) -> e ()>) : <div|e> ()
  while { queue.has-value }
    match queue.try-take
      Nothing -> ()
      Just(select) -> group-lift-div(fn() select(True))

fun drive-strands(actions : list<() -> <async,exn|e> a>, require-all : bool,
                   group : strand-group<a>) : <async|e> ()
  // Every iteration consumes one completion registered by a fixed child
  // strand; the effectful condition keeps this an event-loop wait.
  val queue = new-resume-queue()
  val scope = new-child-scope(async-scope)
  val () =
    actions.list/foreach-indexed fn(index,action)
      run-strand(require-all,group,queue,scope,index,action)
  pretend-no-div(fn()
    finally(
      fn() {
        // Keep the cancellation marker live until every buffered Cancel
        // resumption and its finalizers have drained. Releasing in an outer
        // finally also prevents a failing finalizer from leaking the marker.
        finally(
          fn() release-canceled-scope(scope),
          fn() {
            cancel-scope(scope)
            cancel-queued(queue)
          }
        )
      },
      fn() {
        while { group-lift-div(fn() group.active) }
          group-lift-div(fn()
            val select = queue.take()
            select(group.is-settled)
          )
      }
    )
  )

fun run-group(actions : list<() -> <async,exn|e> a>, require-all : bool)
              : <async,exn|e> list<a>
  val group = new-strand-group(require-all)
  group-lift-exn(fn() drive-strands(actions,require-all,group))
  group.results

// Run both actions concurrently and preserve argument/result order. Internal
// completion order is nondeterministic, but a successful pair is not.
pub fun parallel(left : () -> <async,exn|e> a,
                 right : () -> <async,exn|e> b) : <async,exn|e> (a,b)
  fun run-left() Left(left())
  fun run-right() Right(right())
  val results = run-group([run-left,run-right],True)
  match results
    [Left(left-value),Right(right-value)] -> (left-value,right-value)
    _ -> impossible("parallel completed without both ordered results")

// Settle on the first terminal outcome, cancel the loser, and keep driving the
// group until every loser finalizer has run.
pub fun race(left : () -> <async,exn|e> a,
             right : () -> <async,exn|e> a) : <async,exn|e> a
  match run-group([left,right],False)
    Cons(value,_) -> value
    Nil -> impossible("race completed without a result")

// The facade supplies a browser timer action, keeping this leaf independent
// of Web timer representation and avoiding an import cycle.
pub fun timeout-with(timer-action : () -> <async,exn|e> (),
                     action : () -> <async,exn|e> a)
                    : <async,exn|e> maybe<a>
  race(
    fn() {
      timer-action()
      Nothing
    },
    fn() { Just(action()) }
  )
