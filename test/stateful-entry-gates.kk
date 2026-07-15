module stateful-entry-gates

import kokaine/reactive
import std/core/unsafe

/*
  Stateful continuation-entry acceptance tests.

  Mutation canary:
  route a dependency invalidation to its ordinary Trace-read suffix instead
  of the memo entry continuation. test-entry-gate-latest-previous-and-dedup
  must then fail: `entry-runs` stays at 1 (rather than 3), and the recurrence
  keeps the initial previous value (typically publishing 104 and 106 instead
  of 106 and 112).
*/

fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun bump(target : ref<global,int>) : ()
  store(target,load(target) + 1)

fun push(target : ref<global,list<a>>, value : a) : ()
  store(target,Cons(value,load(target)))

fun emit(target : ref<global,list<string>>, value : string) : ()
  store(target,load(target) ++ [value])

fun check(ok : bool, label : string)
  if ok then println("ok: " ++ label)
  else throw("FAILED: " ++ label)

fun check-int(actual : int, expected : int, label : string)
  check(actual == expected,
        label ++ " expected=" ++ expected.show ++ " actual=" ++ actual.show)

fun check-ints(actual : list<int>, expected : list<int>, label : string)
  check(actual == expected,
        label ++ " expected=" ++ expected.show ++ " actual=" ++ actual.show)

fun check-events(actual : list<string>, expected : list<string>, label : string)
  check(actual == expected,
        label ++ " expected=" ++ expected.show ++ " actual=" ++ actual.show)

fun require(ok : bool, label : string) : exn ()
  if ok then () else throw("FAILED: " ++ label)

fun require-int(actual : int, expected : int, label : string) : exn ()
  require(actual == expected,
          label ++ " expected=" ++ expected.show ++ " actual=" ++ actual.show)


// The continuation before memo entry is construction-only. The calculation
// after entry runs once per committed generation, even though one source is
// read twice. Most importantly, each run receives the latest committed value.
fun test-entry-gate-latest-previous-and-dedup()
  val construction-prefix = hidden(0)
  val entry-runs = hidden(0)
  val after-first = hidden(0)
  val after-second = hidden(0)
  val seen = hidden([])

  val (root,(input,state)) = create-root fn(root)
    bump(construction-prefix)
    val input = signal(root,1)
    val state = memo(root,100,fn(previous)
      bump(entry-runs)
      val first = input.get
      bump(after-first)
      val second = input.get
      bump(after-second)
      previous + first + second
    )
    val stop = create-effect(root,fn() state.get,fn(value) push(seen,value))
    (input,state)

  load(seen).check-ints([102],"stateful memo initializes from its seed")
  update(root){ input.set(2) }
  load(entry-runs).check-int(2,
    "mutation canary: dependency invalidation targets the entry continuation")
  load(after-first).check-int(2,
    "first duplicate suffix belongs to one new entry generation")
  load(after-second).check-int(2,
    "second duplicate suffix belongs to the same entry generation")
  load(seen).check-ints([106,102],
    "first invalidation enters with latest committed previous")
  update(root){ input.set(3) }
  load(entry-runs).check-int(3,
    "mutation canary: later generation re-enters instead of resuming a read")
  load(seen).check-ints([112,106,102],
    "successive invalidation advances the recurrence once")

  load(construction-prefix).check-int(1,
    "continuation prefix before memo entry never repeats")
  load(entry-runs).check-int(3,
    "entry continuation runs once for initial plus two generations")
  load(after-first).check-int(3,
    "duplicate source capture shares one entry target")
  load(after-second).check-int(3,
    "inner duplicate capture is retired by entry replacement")
  sample(root){ state.get }.check-int(112,
    "stateful memo exposes its latest committed value")
  root.dispose()


// Bootstrap order is semantic, not an eventual fixed-point detail. A later
// stateful memo must enter once against the already committed earlier derive;
// it may not run against the derive seed and then advance `previous` again.
fun test-upstream-is-committed-before-downstream-bootstrap()
  val upstream-runs = hidden(0)
  val downstream-runs = hidden(0)
  val seen = hidden([])

  val (root,_) = create-root fn(root)
    val input = signal(root,2)
    val upstream = derive(root,-1,fn()
      bump(upstream-runs)
      input.get * 10
    )
    val downstream = memo(root,100,fn(previous)
      bump(downstream-runs)
      previous + upstream.get
    )
    val stop = create-effect(root,fn() downstream.get,
      fn(value) push(seen,value))
    ()

  load(upstream-runs).check-int(1,
    "earlier pure derive bootstraps exactly once")
  load(downstream-runs).check-int(1,
    "later stateful memo does not enter against an upstream seed")
  load(seen).check-ints([120],
    "downstream initial entry observes committed upstream value")
  root.dispose()


// Every successful entry replaces the whole dependency suffix. This checks
// that both the inactive initial branch and a later retired branch stay dead.
fun test-dynamic-branch-retirement()
  val entries = hidden(0)
  val seen = hidden([])

  val (root,(choose,left,right)) = create-root fn(root)
    val choose = signal(root,True)
    val left = signal(root,1)
    val right = signal(root,10)
    val state = memo(root,0,fn(previous)
      bump(entries)
      previous + (if choose.get then left.get else right.get)
    )
    val stop = create-effect(root,fn() state.get,fn(value) push(seen,value))
    (choose,left,right)

  load(seen).check-ints([1],"stateful branch initializes on the left")
  update(root){ right.set(11) }
  load(entries).check-int(1,"inactive initial branch has no entry capture")

  update(root){ left.set(2) }
  load(seen).check-ints([3,1],"active left branch advances previous")

  update(root)
    batch(root)
      choose.set(False)
      right.set(12)
  load(seen).check-ints([15,3,1],
    "choice and new branch target one coherent entry generation")
  load(entries).check-int(3,
    "batched choice and branch writes deduplicate at the entry gate")

  update(root){ left.set(3) }
  load(entries).check-int(3,"retired left branch cannot enter the memo")
  update(root){ right.set(13) }
  load(seen).check-ints([28,15,3,1],
    "replacement right branch advances the committed recurrence")

  update(root)
    batch(root)
      choose.set(True)
      left.set(4)
      right.set(14)
  load(seen).check-ints([32,28,15,3,1],
    "switching back does not revive the retired right suffix")
  load(entries).check-int(5,"one entry runs for each live generation only")
  root.dispose()


// Equality is checked at two independent boundaries: an equal pure upstream
// must not enter the stateful memo; an entered memo whose output is equal must
// not wake its consumer. memo-always deliberately disables the second cutoff.
fun test-upstream-and-output-equality-cutoffs()
  val parity-runs = hidden(0)
  val stable-runs = hidden(0)
  val stable-effects = hidden(0)
  val always-runs = hidden(0)
  val always-effects = hidden(0)

  val (root,(count,tick)) = create-root fn(root)
    val count = signal(root,1)
    val tick = signal(root,0)
    val parity = derive(root,0,fn()
      val value = count.get % 2
      bump(parity-runs)
      value
    )
    val stable = memo-by(root,0,fn(previous)
      bump(stable-runs)
      val first = parity.get
      val second = parity.get
      val current = tick.get
      previous + first - second + current % 2
    ,fn(left,right) left == right)
    val always = memo-always(root,0,fn(previous)
      bump(always-runs)
      val _ = tick.get
      previous
    )
    val stop-stable = create-effect(root,fn() stable.get,fn(_)
      bump(stable-effects)
    )
    val stop-always = create-effect(root,fn() always.get,fn(_)
      bump(always-effects)
    )
    (count,tick)

  load(parity-runs).check-int(1,"pure upstream initializes once")
  load(stable-runs).check-int(1,"memo-by entry initializes once")
  load(stable-effects).check-int(1,"equal initial memo remains readable")
  load(always-runs).check-int(1,"memo-always initializes once")
  load(always-effects).check-int(1,"memo-always has an initial consumer")

  update(root){ count.set(3) }
  load(parity-runs).check-int(2,"equal pure upstream recomputes at its boundary")
  load(stable-runs).check-int(1,
    "equal pure upstream output does not enter stateful downstream")

  update(root){ tick.set(2) }
  load(stable-runs).check-int(2,"direct dependency enters memo-by once")
  load(stable-effects).check-int(1,
    "equal memo-by output prunes its consumer")
  load(always-runs).check-int(2,"same write enters memo-always once")
  load(always-effects).check-int(2,
    "memo-always publishes an equal output generation")

  update(root){ tick.set(3) }
  load(stable-runs).check-int(3,"changed memo-by generation runs once")
  load(stable-effects).check-int(2,
    "changed memo-by output reaches its consumer")
  load(always-runs).check-int(3,"memo-always remains entry-deduplicated")
  load(always-effects).check-int(3,"memo-always republishes every generation")
  root.dispose()


// A failed attempt cannot commit its candidate as `previous`. Retrying the
// pending entry must use the last successful value and publish no failed draft.
fun test-failure-retry-preserves-committed-previous()
  val entries = hidden(0)
  val seen = hidden([])

  val (root,(input,should-fail,state)) = create-root fn(root)
    val input = signal(root,1)
    val should-fail = signal(root,False)
    val state = memo(root,10,fn(previous)
      bump(entries)
      val current = input.get
      val failing = should-fail.get
      if failing then throw("intentional stateful entry failure")
      else previous + current
    )
    val stop = create-effect(root,fn() state.get,fn(value) push(seen,value))
    (input,should-fail,state)

  load(seen).check-ints([11],"stateful failure fixture initializes")
  val failed : error<()> = mask<exn>{
    error/try fn()
      update(root)
        batch(root)
          input.set(2)
          should-fail.set(True)
  }
  check(failed.is-error,"stateful calculation failure escapes update")
  load(entries).check-int(2,"failed batch attempts its entry exactly once")
  load(seen).check-ints([11],"failed candidate is never published")

  update(root){ should-fail.set(False) }
  load(entries).check-int(3,"pending entry retries exactly once")
  load(seen).check-ints([13,11],
    "retry uses successful previous rather than failed candidate or seed")

  update(root){ input.set(3) }
  load(entries).check-int(4,"post-recovery generation enters once")
  load(seen).check-ints([16,13,11],
    "post-recovery recurrence advances from retry commit")
  sample(root){ state.get }.check-int(16,"recovered state remains readable")
  root.dispose()


// A stateful memo created during a parent publication belongs to that exact
// structural continuation extent. Replacing the parent must retire the old
// memo's source captures before a later payload write.
fun test-nested-stateful-owner-retirement()
  val events = hidden([])
  val memo-runs = hidden(0)

  val (root,(generation,payload)) = create-root fn(root)
    val generation = signal(root,0)
    val payload = signal(root,1)
    val stop-parent = create-effect(root,fn() generation.get,fn(g)
      emit(events,"parent:" ++ g.show)
      on-cleanup(root,fn() emit(events,"parent-clean:" ++ g.show))
      val state = memo(root,g * 100,fn(previous)
        bump(memo-runs)
        previous + payload.get
      )
      val stop-child = create-effect(root,fn() state.get,fn(value)
        emit(events,"child:" ++ g.show ++ ":" ++ value.show)
        on-cleanup(root,fn() emit(events,"child-clean:" ++ g.show))
      )
      ()
    )
    (generation,payload)

  load(events).check-events(["parent:0","child:0:1"],
    "nested stateful memo and consumer bootstrap under parent")
  load(memo-runs).check-int(1,"first owned memo enters once")

  update(root){ payload.set(2) }
  load(events).check-events(
    ["parent:0","child:0:1","child-clean:0","child:0:3"],
    "owned memo remains incremental while parent generation is live")
  load(memo-runs).check-int(2,"live owned memo advances previous")

  update(root){ generation.set(1) }
  load(events).check-events(
    ["parent:0","child:0:1","child-clean:0","child:0:3",
     "child-clean:0","parent-clean:0","parent:1","child:1:102"],
    "parent replacement retires child and memo before rebuilding")
  load(memo-runs).check-int(3,"replacement memo starts from its own seed")

  update(root){ payload.set(3) }
  load(events).check-events(
    ["parent:0","child:0:1","child-clean:0","child:0:3",
     "child-clean:0","parent-clean:0","parent:1","child:1:102",
     "child-clean:1","child:1:105"],
    "only replacement memo capture observes later payload")
  load(memo-runs).check-int(4,
    "retired owned memo does not run alongside its replacement")

  root.dispose()
  load(events).check-events(
    ["parent:0","child:0:1","child-clean:0","child:0:3",
     "child-clean:0","parent-clean:0","parent:1","child:1:102",
     "child-clean:1","child:1:105","child-clean:1","parent-clean:1"],
    "root disposal retires replacement stateful subtree postorder")


// Self-disposal during a consumer publication must retire the just-created
// draft structural extent. The upstream memo remains live and stateful, but
// no later value may reattach or rerun that consumer.
fun test-stateful-consumer-self-disposal()
  val memo-runs = hidden(0)
  val effect-runs = hidden(0)
  val cleanups = hidden(0)
  val stop-slot : ref<global,maybe<disposer<total>>> = hidden(Nothing)

  val (root,(input,state)) : (root<total>,(signal<int>,memo<int>)) =
    create-root fn(root)
      val input = signal(root,0)
      val state = memo(root,0,fn(previous)
        bump(memo-runs)
        previous + input.get
      )
      val stop = create-effect(root,fn() state.get,fn(value)
        bump(effect-runs)
        on-cleanup(root,fn() bump(cleanups))
        if value == 1 then
          match load(stop-slot)
            Just(dispose) -> dispose()
            Nothing -> ()
        else ()
      )
      store(stop-slot,Just(stop))
      (input,state)

  load(memo-runs).require-int(1,"self-disposal fixture memo initializes")
  load(effect-runs).require-int(1,"consumer initializes before disposer is used")

  update(root){ input.set(1) }
  load(memo-runs).require-int(2,"memo advances before consumer self-disposes")
  load(effect-runs).require-int(2,"consumer runs the self-disposing generation")
  load(cleanups).require-int(2,
    "old and self-disposed draft cleanups each run exactly once")

  update(root){ input.set(2) }
  load(memo-runs).require-int(3,"upstream state survives consumer disposal")
  load(effect-runs).require-int(2,"self-disposed consumer never reattaches")
  load(cleanups).require-int(2,"later memo generation cannot duplicate cleanup")
  val current = sample(root){ state.get }
  current.require-int(3,
    "memo previous advances independently after consumer disposal")

  val disposed-again : error<()> = mask<exn>{
    error/try fn()
      match load(stop-slot)
        Just(dispose) -> dispose()
        Nothing -> ()
  }
  require(disposed-again.is-ok,"repeated consumer disposer succeeds")
  load(cleanups).require-int(2,"repeated disposal remains idempotent")
  root.dispose()


pub fun main()
  test-entry-gate-latest-previous-and-dedup()
  test-upstream-is-committed-before-downstream-bootstrap()
  test-dynamic-branch-retirement()
  test-upstream-and-output-equality-cutoffs()
  test-failure-retry-preserves-committed-previous()
  test-nested-stateful-owner-retirement()
  test-stateful-consumer-self-disposal()
  println("stateful-entry-gates: all checks passed")
