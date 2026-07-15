module entry-targeted-settle

import kokaine/reactive
import std/core/unsafe


// --------------------------------------------------------------------------
// Tiny accumulating harness. These tests intentionally run against the
// pre-plane-split runtime as well: that runtime must compile the suite but
// fail the synchronous observations without preventing later checks.
// --------------------------------------------------------------------------

val checks : ref<global,int> = unsafe-total { ref(0) }
val failures : ref<global,int> = unsafe-total { ref(0) }
val failure-labels : ref<global,list<string>> = unsafe-total { ref([]) }

fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(target : ref<global,a>) : a
  unsafe-total { !target }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun bump(target : ref<global,int>) : ()
  store(target,load(target) + 1)

fun check(ok : bool, label : string) : ()
  store(checks,load(checks) + 1)
  if ok then () else
    store(failures,load(failures) + 1)
    store(failure-labels,Cons(label,load(failure-labels)))

fun check-int(actual : int, expected : int, label : string) : ()
  check(actual == expected,
    label ++ " expected=" ++ expected.show ++ " actual=" ++ actual.show)

fun require-memo(slot : ref<global,maybe<memo<int>>>) : exn memo<int>
  match load(slot)
    Nothing -> throw("memo fixture was not initialized")
    Just(value) -> value


// --------------------------------------------------------------------------
// The active entry trace is:
//
//   Trace-entry -> choice.get -> old-branch.get
//
// Both choice and old-branch are pending. Validating state first settles
// choice. Its changed publication makes Trace-entry pending. Validation must
// now stop walking the obsolete child (whose producer deliberately fails),
// resume the entry, and discover the fresh branch. The poison failure is still
// expected later, during ordinary batch-exit propagation.
// --------------------------------------------------------------------------

fun test-obsolete-branch-is-skipped-after-entry-pends() : exn ()
  val poison-fails = hidden(False)
  val entry-runs = hidden(0)
  val observed = hidden(-1)

  val (root,(choose-input,poison-input,state)) = create-root fn(root)
    val choose-input = signal(root,True)
    val poison-input = signal(root,10)
    val fresh-input = signal(root,20)
    val choice = derive(root,True,fn() choose-input.get)
    val old-branch = derive(root,0,fn()
      val value = poison-input.get
      if load(poison-fails)
      then throw("intentional obsolete-branch failure")
      else value
    )
    val fresh-branch = derive(root,0,fn() fresh-input.get)
    val state = memo(root,0,fn(_)
      bump(entry-runs)
      if choice.get then old-branch.get else fresh-branch.get
    )
    (choose-input,poison-input,state)

  check-int(sample(root){ state.get },10,
    "obsolete-branch fixture initializes on the old branch")
  store(poison-fails,True)
  val failed : error<()> = mask<exn>{
    error/try fn()
      dispatch(root)
        batch(root)
          // Queue poison first and choice second. Targeted state.get must not
          // use that global queue order as its validation frontier.
          poison-input.set(11)
          choose-input.set(False)
          store(observed,state.get)
  }
  check(failed.is-error,
    "obsolete poison remains observable at later global propagation")
  check-int(load(observed),20,
    "entry pending after choice settle skips its obsolete branch child")
  check-int(load(entry-runs),2,
    "choice publication replaces the entry exactly once before get returns")
  root.dispose()


// --------------------------------------------------------------------------
// Here the entry's first producer is itself initially clean:
//
//   entry -> middle.get -> poison.get
//              |
//              +-> child.get (pending)
//
// Settling child's changed value first makes middle pending; settling middle
// then makes the entry pending. The entry must be rechecked *after* returning
// from the recursive child settlement, before validation advances to poison.
// --------------------------------------------------------------------------

fun test-entry-rechecked-after_nested-child-settle() : exn ()
  val poison-fails = hidden(False)
  val child-runs = hidden(0)
  val middle-runs = hidden(0)
  val entry-runs = hidden(0)
  val observed = hidden(-1)

  val (root,(branch-input,poison-input,state)) = create-root fn(root)
    val branch-input = signal(root,True)
    val poison-input = signal(root,5)
    val safe-input = signal(root,30)
    val child = derive(root,True,fn()
      val value = branch-input.get
      bump(child-runs)
      value
    )
    val middle = derive(root,True,fn()
      val value = child.get
      bump(middle-runs)
      value
    )
    val poison = derive(root,0,fn()
      val value = poison-input.get
      if load(poison-fails)
      then throw("intentional nested obsolete-child failure")
      else value
    )
    val safe = derive(root,0,fn() safe-input.get)
    val state = memo(root,0,fn(_)
      bump(entry-runs)
      if middle.get then poison.get else safe.get
    )
    (branch-input,poison-input,state)

  check-int(sample(root){ state.get },5,
    "nested-settle fixture initializes on the poison branch")
  store(poison-fails,True)
  val failed : error<()> = mask<exn>{
    error/try fn()
      dispatch(root)
        batch(root)
          poison-input.set(6)
          branch-input.set(False)
          store(observed,state.get)
  }
  check(failed.is-error,
    "nested poison remains observable only in later propagation")
  check-int(load(observed),30,
    "entry is rechecked after its producer's child settles")
  check-int(load(child-runs),2,
    "targeted nested child settles once")
  check-int(load(middle-runs),2,
    "targeted middle replacement settles once")
  check-int(load(entry-runs),2,
    "nested publication replaces the state entry exactly once")
  root.dispose()


// --------------------------------------------------------------------------
// Dynamic entry/producer cycle:
//
//   state entry --(epoch 1)--> peer.get
//   peer trace ----------------> state.get
//
// peer uses an equality function that always cuts off publication. That keeps
// the old runtime finite: if it misses the cycle, it commits 122 and exposes
// previous-value pollution rather than looping. Correct producer validation
// reports a cycle before state commits. Switching epoch back to zero must then
// recover from the last successful previous value, 11, and publish 12.
// --------------------------------------------------------------------------

fun test-entry_cycle_recovers_without_previous_pollution() : exn ()
  val peer-slot : ref<global,maybe<memo<int>>> = hidden(Nothing)
  val state-runs = hidden(0)
  val peer-runs = hidden(0)
  val observed-during-cycle = hidden(-1)

  val (root,(epoch,state)) = create-root fn(root)
    val epoch = signal(root,0)
    val state = memo(root,10,fn(previous)
      bump(state-runs)
      if epoch.get == 0
      then previous + 1
      else previous + require-memo(peer-slot).get
    )
    val peer = derive-by(root,111,fn()
      val value = state.get
      bump(peer-runs)
      value + 100
    ,fn(_,_) True)
    store(peer-slot,Just(peer))
    (epoch,state)

  check-int(sample(root){ state.get },11,
    "cycle fixture commits its first previous value")
  val cycle : error<()> = mask<exn>{
    error/try fn()
      dispatch(root)
        batch(root)
          epoch.set(1)
          store(observed-during-cycle,state.get)
  }
  check(cycle.is-error,
    "recursive entry producer validation reports a controlled cycle")
  check-int(load(observed-during-cycle),-1,
    "cycle fails before a candidate entry value is returned")

  val recovered : error<int> = mask<exn>{
    error/try fn()
      update(root){ epoch.set(0) }
      sample(root){ state.get }
  }
  match recovered
    Error(_) -> check(False,
      "disabling the dynamic cycle leaves the entry producer recoverable")
    Ok(value) -> check-int(value,12,
      "cycle recovery injects the last committed previous, not a failed draft")
  root.dispose()


// --------------------------------------------------------------------------
// Mutation gate for entry targeting. Initially:
//
//   previous=10, upstream=1  => 11
//
// A pending upstream changes to 2. Correct entry targeting re-enters with 11
// and yields 13. Mutating the capture target from Trace-entry to Trace-read
// resumes the suffix that closed over the seed previous=10 and yields 12.
// --------------------------------------------------------------------------

fun test-entry_target_routing_mutation_canary() : exn ()
  val entry-runs = hidden(0)
  val observed = hidden(-1)

  val (root,(input,state)) = create-root fn(root)
    val input = signal(root,1)
    val upstream = derive(root,0,fn() input.get)
    val state = memo(root,10,fn(previous)
      bump(entry-runs)
      previous + upstream.get
    )
    (input,state)

  check-int(sample(root){ state.get },11,
    "entry-target canary initializes from its seed")
  dispatch(root)
    batch(root)
      input.set(2)
      store(observed,state.get)
  check-int(load(observed),13,
    "upstream get routes invalidation to entry before returning")
  check-int(load(entry-runs),2,
    "entry target mutation cannot resume only the captured read suffix")
  check-int(sample(root){ state.get },13,
    "entry target canary commits exactly one recurrence generation")
  root.dispose()


pub fun main()
  test-obsolete-branch-is-skipped-after-entry-pends()
  test-entry-rechecked-after_nested-child-settle()
  test-entry_cycle_recovers_without_previous_pollution()
  test-entry_target_routing_mutation_canary()
  val total = load(checks)
  val failed = load(failures)
  if failed == 0
  then println("entry-targeted-settle: " ++ total.show ++ " checks passed")
  else
    load(failure-labels).reverse.foreach(fn(label)
      println("FAIL: " ++ label)
    )
    throw("entry-targeted-settle: " ++ failed.show ++ " / " ++
          total.show ++ " checks failed")
