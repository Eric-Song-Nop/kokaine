/*--------------------------------------------------------------------------
  Copyright (c) 2026 Kokaine contributors. SPDX-License-Identifier: MIT

  Browser structured concurrency. Each child strand turns host suspensions
  into queued resumption thunks. The driver consumes those thunks until every
  child has returned or finished unwinding after cancellation.
--------------------------------------------------------------------------*/
module kokaine/async/structured

import kokaine/async/effects
import kokaine/async/channel
import kokaine/internal/compat
import kokaine/internal/registry
import std/core/unsafe
import std/core/undiv


type strand-outcome<a>
  Strand-value(value : a)
  Strand-exception(error : exception)
  Strand-canceled
  // Unwound by a final control operation whose handler lies outside the
  // group. The control itself keeps propagating; it is never reified.
  Strand-finalized

type group-outcome<a>
  Group-values(values : list<(int,a)>)
  Group-exception(error : exception)
  Group-canceled
  Group-finalized

type group-owned
  Group-owned(
    group-owned-index   : int,
    group-owned-discard : ref<global,maybe<dispose-fn>>
  )

abstract value type group-owned-registration
  Group-owned-registration(
    registration-node    : maybe<registry-registration<group-owned>>,
    registration-discard : ref<global,maybe<dispose-fn>>
  )

// `escapes` counts strands unwound by an outer final control. While it is
// positive, the driver and `run-group` are themselves unwinding that control
// through their `finally` clauses.
type group-state<a>
  Group-state(active : int, outcome : group-outcome<a>,
              owned : registry<group-owned>, escapes : int)

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

noinline fun group-cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

noinline fun group-load(value : ref<global,a>) : a
  unsafe-total { !value }

noinline fun group-store(target : ref<global,a>, value : a) : ()
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

fun release-ownership(release : ownership-release-fn,
                      guard : ownership-guard) : ui bool
  if release() then
    guard.accept
    True
  else False

fun discard-ownership(release : ownership-release-fn,
                      guard : ownership-guard) : ui ()
  // Unlink the generation registration first. If a retirement snapshot has
  // already won, its guarded disposer and this path still share one raw slot.
  val _ = release()
  guard.retire

fun ownership-discard-capability(release : ownership-release-fn,
                                 guard : ownership-guard) : dispose-fn
  fn() discard-ownership(release,guard)

fun group-lift-div(action : () -> e a) : <div|e> a
  mask<div>{ action() }

fun group-lift-exn(action : () -> e a) : <exn|e> a
  mask<exn>{ action() }

fun new-strand-group(require-all : bool) : strand-group<a>
  Strand-group(
    group-cell(Group-state(0,Group-values([]),new-registry(),0)),require-all)

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
      Strand-finalized -> Group-finalized
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
      Strand-finalized ->
        Group-finalized
      Strand-canceled ->
        match current
          Group-values(_) -> Group-canceled
          _ -> current

fun group-outcome/resume(current : group-outcome<a>) : <async,exn> list<a>
  match current
    Group-values(values) -> values.map(snd)
    Group-exception(error) -> Error(error).untry
    Group-canceled -> discontinue()
    // A final control never lets the driver return normally.
    Group-finalized -> impossible("structured group returned after a final control")

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
        Group-state(active,outcome,owned,escapes) ->
          group-store(state,Group-state(active + 1,outcome,owned,escapes))

fun strand-group/finish(group : strand-group<a>, index : int,
                        result : strand-outcome<a>) : ()
  match group
    Strand-group(state,require-all) ->
      match group-load(state)
        Group-state(active,outcome,owned,escapes) ->
          val escaped = match result
            Strand-finalized -> 1
            _ -> 0
          group-store(state,Group-state(
            active - 1,
            outcome.add(index,result,require-all),
            owned,
            escapes + escaped
          ))

fun strand-group/escapes(group : strand-group<a>) : int
  match group
    Strand-group(state,_) -> group-load(state).escapes

fun strand-group/track-owned(group : strand-group<a>, index : int,
                             discard : dispose-fn)
                            : group-owned-registration
  match group
    Strand-group(state,_) ->
      match group-load(state)
        Group-state(_,_,owned,_) ->
          val discard-slot = group-cell(Just(discard))
          val node = owned.try-insert(Group-owned(index,discard-slot))
          Group-owned-registration(node,discard-slot)

// Explicit release and group rollback race for the same entry. A live entry
// is physically removed before the lower ownership ledger is touched. The
// registration captures only its intrusive node and one-shot gate, never the
// group's sibling results. A kept winner's node may already be detached when
// its public release later consumes that independent gate.
fun group-owned-registration/try-untrack(
    registration : group-owned-registration) : bool
  match registration
    Group-owned-registration(node,discard-slot) ->
      val discard = group-load(discard-slot)
      group-store(discard-slot,Nothing)
      match discard
        Nothing -> False
        Just(_) ->
          match node
            Nothing -> ()
            Just(current) ->
              val _ = current.take
              ()
          True

fun release-group-ownership(registration : group-owned-registration,
                            release : ownership-release-fn,
                            guard : ownership-guard) : ui bool
  if !registration.try-untrack then False
  else release-ownership(release,guard)

fun group-ownership-release-capability(
    registration : group-owned-registration,
    release : ownership-release-fn,
    guard : ownership-guard) : ownership-release-fn
  fn() release-group-ownership(registration,release,guard)

// Claim every losing discard before invoking any of them. A re-entrant
// release therefore either won earlier or observes an already-retired slot.
fun collect-group-discards(values : list<group-owned>,
                           outcome : group-outcome<a>,
                           require-all : bool) : list<dispose-fn>
  match values
    Nil -> []
    Cons(entry,rest) ->
      if outcome.keeps-owned(entry.group-owned-index,require-all) then
        collect-group-discards(rest,outcome,require-all)
      else
        val discard = group-load(entry.group-owned-discard)
        group-store(entry.group-owned-discard,Nothing)
        match discard
          Nothing -> collect-group-discards(rest,outcome,require-all)
          Just(action) -> Cons(
            action,collect-group-discards(rest,outcome,require-all))

fun strand-group/discard-losers(group : strand-group<a>) : async ()
  match group
    Strand-group(state,require-all) ->
      match group-load(state)
        Group-state(_,outcome,owned,_) ->
          // Detach the rollback ledger before invoking untrusted host
          // disposers, then claim every loser slot from the detached snapshot.
          val snapshot = match owned.seal-detach
            Nothing -> []
            Just(values) -> values
          val discards = collect-group-discards(
            snapshot,outcome,require-all)
          discards.foreach fn(discard) async-host(discard)

fun strand-group/results(group : strand-group<a>) : <async,exn> list<a>
  group.discard-losers
  match group
    Strand-group(state,_) -> group-load(state).outcome.resume

// Runs from `run-group`'s `finally`. Only an outer final control raised by a
// child reaches here with `escapes > 0`; parent retirement keeps its existing
// path. The rollback matches `results`, and a later cleanup exception
// replaces the pending control, as Koka's `finally` rule prescribes.
fun strand-group/unwind-escape(group : strand-group<a>) : <async,exn> ()
  if group.escapes > 0 then
    group.discard-losers
    match group
      Strand-group(state,_) ->
        match group-load(state).outcome
          Group-exception(error) -> Error(error).untry
          _ -> ()

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
      val registration = group.track-owned(
        index,ownership-discard-capability(release,guard))
      group-ownership-release-capability(registration,release,guard)
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
        // Exceptions and cancellation return through the body, so the
        // `finally` clause sees an incomplete body only while a final control
        // targeting a handler outside the group unwinds this strand. It
        // records the escape and cancels the siblings; the control then
        // continues into the driver, whose own `finally` drains them before
        // Koka re-raises it. Nothing reifies the yield, which keeps this
        // independent of the `std/core/hnd` finalization API.
        val body-done = group-cell(False)
        val outcome = finally(
          fn() {
            if !group-load(body-done) then
              group.finish(index,Strand-finalized)
              cancel-outstanding()
          },
          fn() {
            val result =
              with unsafe-uncancel
              capture-error(fn() action())
            group-store(body-done,True)
            result
          }
        )
        match outcome
          Just(Ok(value)) ->
            group.finish(index,Strand-value(value))
            if !require-all then cancel-outstanding()
          Just(Error(error)) ->
            group.finish(index,Strand-exception(error))
            cancel-outstanding()
          Nothing ->
            group.finish(index,Strand-canceled)
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

// A child's outer final control is unwinding the driver. Keep driving every
// remaining strand, across browser turns if their cleanup awaits, exactly as
// the ordinary loop would after a settled outcome. A further escape from a
// sibling's cleanup restarts this drain (and later replaces the pending
// control); a parent cancellation falls back to the synchronous drain.
// `step` and `fallback` are the driver's own loop body and synchronous drain,
// passed as closures so the queue row stays inferred in `drive-strands`.
noinline fun drain-escaped(group : strand-group<b>, step : () -> <div|e> (),
                           fallback : () -> <div|e> ()) : <div|e> ()
  val seen = group.escapes
  finally(
    fn() {
      if group.active then
        if group.escapes > seen then drain-escaped(group,step,fallback)
        else fallback()
    },
    fn() {
      while { group.active }
        step()
    }
  )

fun drive-strands(actions : list<() -> <async,exn|e> a>, require-all : bool,
                   group : strand-group<a>) : <async|e> ()
  // Every iteration consumes one completion registered by a fixed child
  // strand; the effectful condition keeps this an event-loop wait.
  val queue = new-resume-queue()
  val scope = new-child-scope(async-scope)
  val step = fn()
    group-lift-div(fn()
      val select = queue.take()
      select(group.is-settled)
    )
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
            if group.escapes > 0 then
              drain-escaped(group,step,fn() cancel-queued(queue))
            else cancel-queued(queue)
          }
        )
      },
      fn() {
        // Strands start inside the `finally`, so a final control raised
        // before a strand's first await still drains the earlier siblings.
        group-lift-div(fn()
          actions.list/foreach-indexed fn(index,action)
            run-strand(require-all,group,queue,scope,index,action)
        )
        while { group-lift-div(fn() group.active) }
          step()
      }
    )
  )

fun run-group(actions : list<() -> <async,exn|e> a>, require-all : bool)
              : <async,exn|e> list<a>
  val group = new-strand-group(require-all)
  finally(
    fn() group.unwind-escape,
    fn() {
      group-lift-exn(fn() drive-strands(actions,require-all,group))
      group.results
    }
  )

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
