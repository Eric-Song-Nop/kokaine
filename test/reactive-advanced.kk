module reactive-advanced

import kokaine/reactive
import std/core/unsafe


// --------------------------------------------------------------------------
// Tiny dependency-free test harness
// --------------------------------------------------------------------------

val checks : ref<global,int> = unsafe-total { ref(0) }

fun check(ok : bool, label : string)
  checks := !checks + 1
  if ok then () else throw("check failed: " ++ label)

fun check-int(actual : int, expected : int, label : string)
  check(actual == expected,
        label ++ " (expected " ++ expected.show ++
        ", got " ++ actual.show ++ ")")

fun check-ints(actual : list<int>, expected : list<int>, label : string)
  check(actual == expected,
        label ++ " (expected " ++ expected.show ++
        ", got " ++ actual.show ++ ")")

fun check-strings(actual : list<string>, expected : list<string>, label : string)
  check(actual == expected,
        label ++ " (expected " ++ expected.show ++
        ", got " ++ actual.show ++ ")")

fun push(cell : ref<global,list<a>>, value : a)
  cell := Cons(value,!cell)

fun hidden-cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun hidden-load(cell : ref<global,a>) : a
  unsafe-total { !cell }

fun hidden-store(cell : ref<global,a>, value : a) : ()
  unsafe-total { cell := value }

fun bump(cell : ref<global,int>) : ()
  hidden-store(cell,hidden-load(cell) + 1)


// --------------------------------------------------------------------------
// A deep, wide, dynamically selected diamond
// --------------------------------------------------------------------------

fun test-deep-wide-dynamic-diamond()
  val m1-runs = hidden-cell(0)
  val m2-runs = hidden-cell(0)
  val m3-runs = hidden-cell(0)
  val m4-runs = hidden-cell(0)
  val left-runs = hidden-cell(0)
  val right-runs = hidden-cell(0)
  val join-runs = hidden-cell(0)
  val effect-runs = hidden-cell(0)
  val seen : ref<global,list<int>> = ref([])

  val (root,(source,choose,joined)) = create-root fn(root)
    val source = signal(root,1)
    val choose = signal(root,True)
    val m1 = memo(root,0,fn(_)
      bump(m1-runs)
      source.get * 2
    )
    val m2 = memo(root,0,fn(_)
      bump(m2-runs)
      source.get + 10
    )
    val m3 = memo(root,0,fn(_)
      bump(m3-runs)
      m1.get + m2.get
    )
    val m4 = memo(root,0,fn(_)
      bump(m4-runs)
      m1.get * 3
    )
    val left = memo(root,0,fn(_)
      bump(left-runs)
      if choose.get then m3.get else m4.get
    )
    val right = memo(root,0,fn(_)
      bump(right-runs)
      m2.get * 2
    )
    val joined = memo(root,0,fn(_)
      bump(join-runs)
      left.get + right.get
    )
    val stop = create-effect(root,fn() joined.get,fn(value)
      bump(effect-runs)
      seen.push(value)
    )
    (source,choose,joined)

  (!seen).check-ints([35],"deep dynamic diamond publishes its initial value")
  sample(root){ joined.get }.check-int(35,
    "deep dynamic diamond initializes coherently")

  update(root)
    batch(root)
      source.set(2)
      choose.set(False)
  (!seen).check-ints([36,35],
    "deep dynamic diamond emits one value for a branch-switch batch")
  sample(root){ joined.get }.check-int(36,
    "deep dynamic diamond switches to its alternate branch atomically")

  update(root)
    batch(root)
      source.set(3)
      choose.set(True)
  (!seen).check-ints([45,36,35],
    "deep dynamic diamond never publishes an intermediate epoch")
  sample(root){ joined.get }.check-int(45,
    "deep dynamic diamond switches back with fresh transitive inputs")

  hidden-load(m1-runs).check-int(3,"first source branch runs once per epoch")
  hidden-load(m2-runs).check-int(3,"second source branch runs once per epoch")
  hidden-load(m3-runs).check-int(3,"wide fan-in runs once per epoch")
  hidden-load(m4-runs).check-int(3,"alternate wide branch runs once per epoch")
  hidden-load(left-runs).check-int(3,"dynamic selector runs once per epoch")
  hidden-load(right-runs).check-int(3,"parallel selector runs once per epoch")
  hidden-load(join-runs).check-int(3,"deep join runs once per epoch")
  hidden-load(effect-runs).check-int(3,"deep join publishes once per epoch")
  root.dispose()


// --------------------------------------------------------------------------
// Exact producer pull must not execute a failing sibling
// --------------------------------------------------------------------------

fun test-batch-targeted-pull-failure-isolation()
  val good-runs = hidden-cell(0)
  val bad-runs = hidden-cell(0)
  val pulled-good = hidden-cell(-1)
  val bad-runs-at-pull = hidden-cell(-1)

  val (root,(x,y,good)) = create-root fn(root)
    val x = signal(root,1)
    val y = signal(root,0)
    val good = memo(root,0,fn(_)
      bump(good-runs)
      x.get * 2
    )
    val bad = memo(root,0,fn(_)
      bump(bad-runs)
      val current = y.get
      if current == 1 then throw("intentional sibling failure") else current
    )
    (x,y,good)

  val failed : error<()> = mask<exn>{
    error/try fn()
      dispatch(root)
        batch(root)
          x.set(2)
          y.set(1)
          hidden-store(pulled-good,good.get)
          hidden-store(bad-runs-at-pull,hidden-load(bad-runs))
  }
  check(failed.is-error,"failing sibling still escapes when the batch flushes")
  hidden-load(pulled-good).check-int(4,
    "targeted pull settles the requested producer inside a batch")
  hidden-load(bad-runs-at-pull).check-int(1,
    "targeted pull does not execute an unrelated failing sibling")
  hidden-load(good-runs).check-int(2,
    "requested producer executes exactly once for the failed batch")
  hidden-load(bad-runs).check-int(2,
    "unrelated sibling executes only during the batch-exit flush")

  update(root){ y.set(2) }
  hidden-load(bad-runs).check-int(3,"failed sibling retries on invalidation")
  hidden-load(good-runs).check-int(2,"sibling recovery leaves clean producer cached")
  sample(root){ good.get }.check-int(4,"clean targeted producer remains readable")
  root.dispose()


// --------------------------------------------------------------------------
// previous state, equality pruning, and duplicate dependency reads
// --------------------------------------------------------------------------

fun test-previous-equality-duplicate-fanin()
  val parity-runs = hidden-cell(0)
  val accumulated-runs = hidden-cell(0)
  val seen : ref<global,list<int>> = ref([])

  val (root,(count,tick,accumulated)) = create-root fn(root)
    val count = signal(root,1)
    val tick = signal(root,0)
    val parity = memo(root,0,fn(_)
      bump(parity-runs)
      count.get % 2
    )
    val accumulated = memo(root,0,fn(previous)
      bump(accumulated-runs)
      previous + parity.get + parity.get + tick.get
    )
    val stop = create-effect(root,fn() accumulated.get,fn(value)
      seen.push(value)
    )
    (count,tick,accumulated)

  (!seen).check-ints([2],"stateful fan-in publishes its initial value")
  hidden-load(parity-runs).check-int(1,"parity initializes once")
  hidden-load(accumulated-runs).check-int(1,"accumulator initializes once")
  sample(root){ accumulated.get }.check-int(2,
    "stateful fan-in initializes from previous and duplicate reads")

  update(root){ count.set(3) }
  hidden-load(parity-runs).check-int(2,"equal parity recomputes at its boundary")
  hidden-load(accumulated-runs).check-int(1,
    "equal parity output prunes the stateful duplicate fan-in")
  (!seen).check-ints([2],"equal parity output does not republish accumulation")

  val first = dispatch(root)
    batch(root)
      count.set(5)
      tick.set(1)
      accumulated.get
  first.check-int(5,"explicit dirty pull advances previous exactly once")
  hidden-load(parity-runs).check-int(3,
    "equal upstream settles once during explicit dirty pull")
  hidden-load(accumulated-runs).check-int(2,
    "duplicate upstream reads share one captured dependency")
  (!seen).check-ints([5,2],"explicit pull publishes one completed generation")

  update(root)
    batch(root)
      count.set(4)
      tick.set(2)
  hidden-load(parity-runs).check-int(4,"changed parity settles once")
  hidden-load(accumulated-runs).check-int(3,
    "fan-in invalidations remain deduplicated")
  (!seen).check-ints([7,5,2],
    "stateful duplicate fan-in publishes no intermediate value")
  sample(root){ accumulated.get }.check-int(7,
    "changed parity and tick advance prior state once")
  root.dispose()


// --------------------------------------------------------------------------
// Deep diamond failure and retry through an independent failure signal
// --------------------------------------------------------------------------

fun test-deep-diamond-failure-retry()
  val base-runs = hidden-cell(0)
  val left-runs = hidden-cell(0)
  val right-runs = hidden-cell(0)
  val join-runs = hidden-cell(0)
  val effect-runs = hidden-cell(0)
  val seen : ref<global,list<int>> = ref([])

  val (root,(source,should-fail,joined)) = create-root fn(root)
    val source = signal(root,1)
    val should-fail = signal(root,False)
    val base = memo(root,0,fn(_)
      bump(base-runs)
      source.get * 2
    )
    val left = memo(root,0,fn(_)
      bump(left-runs)
      base.get + 1
    )
    val right = memo(root,0,fn(_)
      bump(right-runs)
      base.get * 10
    )
    val joined = memo(root,0,fn(_)
      bump(join-runs)
      val left-value = left.get
      val right-value = right.get
      val fail = should-fail.get
      if fail then throw("intentional deep diamond failure")
      else left-value + right-value
    )
    val stop = create-effect(root,fn() joined.get,fn(value)
      bump(effect-runs)
      seen.push(value)
    )
    (source,should-fail,joined)

  (!seen).check-ints([23],"deep failure diamond publishes its initial value")
  sample(root){ joined.get }.check-int(23,"deep failure diamond initializes")
  val failed : error<()> = mask<exn>{
    error/try fn()
      update(root)
        batch(root)
          source.set(2)
          should-fail.set(True)
  }
  check(failed.is-error,"deep diamond calculation failure escapes update")
  hidden-load(base-runs).check-int(2,"failed epoch settles shared base once")
  hidden-load(left-runs).check-int(2,"failed epoch settles left branch once")
  hidden-load(right-runs).check-int(2,"failed epoch settles right branch once")
  hidden-load(join-runs).check-int(2,"failed epoch attempts its join once")
  hidden-load(effect-runs).check-int(1,"failed join publishes no partial value")
  (!seen).check-ints([23],"failed join preserves the last complete publication")

  update(root){ should-fail.set(False) }
  hidden-load(base-runs).check-int(2,"retry reuses the settled shared base")
  hidden-load(left-runs).check-int(2,"retry reuses the settled left branch")
  hidden-load(right-runs).check-int(2,"retry reuses the settled right branch")
  hidden-load(join-runs).check-int(3,"failed join retries exactly once")
  hidden-load(effect-runs).check-int(2,"successful retry publishes exactly once")
  (!seen).check-ints([45,23],"retry publishes only a coherent recovered value")
  sample(root){ joined.get }.check-int(45,
    "independent failure signal retries the complete dirty diamond")
  root.dispose()


// --------------------------------------------------------------------------
// A failed parent owns and later disposes a child that never started
// --------------------------------------------------------------------------

fun test-failed-parent-disposes-unstarted-child()
  val parent-runs = hidden-cell(0)
  val children-created = hidden-cell(0)
  val child-tracks = hidden-cell(0)
  val child-applies = hidden-cell(0)

  val (root,(generation,child-source)) = create-root fn(root)
    val generation = signal(root,0)
    val child-source = signal(root,10)
    val stop-parent = create-effect(root,fn() generation.get,fn(current)
      bump(parent-runs)
      if current == 1 then
        bump(children-created)
        val stop-child = create-effect(root,fn()
          bump(child-tracks)
          child-source.get
        ,fn(_)
          bump(child-applies)
        )
        throw("intentional parent failure after child registration")
      else ()
    )
    (generation,child-source)

  hidden-load(parent-runs).check-int(1,"parent initializes once")
  val failed : error<()> = mask<exn>{
    error/try fn() update(root){ generation.set(1) }
  }
  check(failed.is-error,"parent failure escapes its triggering update")
  hidden-load(parent-runs).check-int(2,"parent attempted the failed generation")
  hidden-load(children-created).check-int(1,
    "failed parent registered exactly one owned child")
  hidden-load(child-tracks).check-int(0,
    "owned child remains unstarted when its parent fails")
  hidden-load(child-applies).check-int(0,
    "unstarted child cannot publish after parent failure")

  update(root){ generation.set(2) }
  hidden-load(parent-runs).check-int(3,"failed parent retries on invalidation")
  hidden-load(child-tracks).check-int(0,
    "parent retry disposes its unstarted prior-generation child")
  hidden-load(child-applies).check-int(0,
    "disposed unstarted child never applies")

  update(root){ child-source.set(11) }
  hidden-load(child-tracks).check-int(0,
    "disposed child leaves no subscription to its source")
  hidden-load(child-applies).check-int(0,
    "disposed child stays silent after later source writes")
  root.dispose()


// --------------------------------------------------------------------------
// A parent refresh must retire its old child before that child can refresh
// --------------------------------------------------------------------------

fun run-parent-child-write-order(generation-first : bool)
  val events : ref<global,list<string>> = ref([])
  val child-cleanups = hidden-cell(0)

  val (root,(generation,payload)) = create-root fn(root)
    val generation = signal(root,0)
    val payload = signal(root,10)
    val stop-parent = create-effect(root,fn() generation.get,fn(current)
      val stop-child = create-effect(root,fn() payload.get,fn(value)
        events.push("child" ++ current.show ++ ":" ++ value.show)
        on-cleanup(root,fn() bump(child-cleanups))
      )
      ()
    )
    (generation,payload)

  update(root)
    batch(root)
      if generation-first then
        generation.set(1)
        payload.set(11)
      else
        payload.set(11)
        generation.set(1)

  val events-before-dispose = !events
  val cleanups-before-dispose = hidden-load(child-cleanups)
  root.dispose()
  val cleanups-after-dispose = hidden-load(child-cleanups)
  (events-before-dispose,cleanups-before-dispose,cleanups-after-dispose)

fun test-parent-refresh-precedes-stale-child()
  val expected-events = ["child1:11","child0:10"]

  // Writing the payload first currently happens to put the parent at the head
  // of the direct effect queue. This fixture establishes the desired semantic
  // result independently of that incidental insertion order.
  val (payload-first-events,payload-first-before,payload-first-after) =
    run-parent-child-write-order(False)
  payload-first-events.check-strings(expected-events,
    "payload-first batch publishes only the replacement child generation")
  payload-first-before.check-int(1,
    "payload-first batch cleans the retired child generation once")
  payload-first-after.check-int(2,
    "payload-first root disposal cleans the replacement child once")

  // This is the adversarial order: parent is queued first, then the old child
  // is queued at the head by the payload write. Ownership must still make the
  // parent refresh (and dispose that child) logically precede child execution.
  val (generation-first-events,generation-first-before,generation-first-after) =
    run-parent-child-write-order(True)
  generation-first-events.check-strings(expected-events,
    "generation-first batch must not run the stale child generation; " ++
    "cleanup counts expected 1 before / 2 after disposal, got " ++
    generation-first-before.show ++ " / " ++ generation-first-after.show)
  generation-first-before.check-int(1,
    "generation-first batch cleans the retired child generation once")
  generation-first-after.check-int(2,
    "generation-first root disposal cleans the replacement child once")


// --------------------------------------------------------------------------
// Owner-generation capabilities compose through deep scopes and memo pulls
// --------------------------------------------------------------------------

fun test-transitive-owner-generation-gate()
  val events : ref<global,list<string>> = ref([])
  val child-cleanups = hidden-cell(0)

  val (root,(generation,payload)) = create-root fn(root)
    val generation = signal(root,0)
    val payload = signal(root,10)
    val stop-grandparent = create-effect(root,fn() generation.get,fn(current)
      val stop-parent = create-effect(root,fn() 0,fn(_)
        val stop-child = create-effect(root,fn() payload.get,fn(value)
          events.push("child" ++ current.show ++ ":" ++ value.show)
          on-cleanup(root,fn() bump(child-cleanups))
        )
        ()
      )
      ()
    )
    (generation,payload)

  update(root){ payload.set(11) }
  (!events).check-strings(["child0:11","child0:10"],
    "a child remains incremental while all owner generations are current")
  hidden-load(child-cleanups).check-int(1,
    "an ordinary child refresh cleans exactly its previous round")

  update(root)
    batch(root)
      generation.set(1)
      payload.set(12)
  (!events).check-strings(["child1:12","child0:11","child0:10"],
    "an invalid grandparent generation gates its complete descendant chain")
  hidden-load(child-cleanups).check-int(2,
    "the grandparent refresh retires the current deep child exactly once")

  root.dispose()
  hidden-load(child-cleanups).check-int(3,
    "root disposal retires the replacement deep child exactly once")

fun require-owned-memo(slot : ref<global,maybe<memo<int>>>) : exn memo<int>
  match hidden-load(slot)
    Nothing -> throw("owned memo fixture was not initialized")
    Just(value) -> value

fun test-invalidated-owner-rejects-stale-memo-pull()
  val slot : ref<global,maybe<memo<int>>> = hidden-cell(Nothing)
  val seen : ref<global,list<int>> = ref([])

  val (root,(generation,payload)) = create-root fn(root)
    val generation = signal(root,0)
    val payload = signal(root,10)
    val stop-parent = create-effect(root,fn() generation.get,fn(current)
      val child = memo(root,0,fn(_) current * 100 + payload.get)
      hidden-store(slot,Just(child))
      val stop-child = create-effect(root,fn() child.get,fn(value)
        seen.push(value)
      )
      ()
    )
    (generation,payload)

  val stale-child = require-owned-memo(slot)
  // The exception handler surrounds dispatch because the read operation is
  // interpreted by dispatch's outer handler frame.
  val stale-read : error<int> = mask<exn>{
    error/try fn()
      dispatch(root)
        batch(root)
          generation.set(1)
          payload.set(11)
          stale-child.get
  }

  check(stale-read.is-error,
    "a leaked memo cannot pull work from an invalidated owner generation")
  (!seen).check-ints([111,10],
    "stale owned memo pull publishes no value from the retired generation")
  sample(root){ require-owned-memo(slot).get }.check-int(111,
    "the replacement owner generation publishes a readable memo")
  root.dispose()

fun test-owner-gate-validates-lazy-parent-dependency()
  val calculations = hidden-cell([])

  val (root,(trigger,payload)) = create-root fn(root)
    val trigger = signal(root,0)
    val payload = signal(root,10)
    val parent-input = memo(root,0,fn(_) trigger.get)
    val stop-parent = create-effect(root,fn() parent-input.get,fn(current)
      val child = memo(root,0,fn(_)
        val value = payload.get
        hidden-store(calculations,
          Cons("child" ++ current.show ++ ":" ++ value.show,
               hidden-load(calculations)))
        current * 100 + value
      )
      val stop-child = create-effect(root,fn() child.get,fn(_) ())
      ()
    )
    (trigger,payload)

  // The payload write puts the old child memo ahead of parent-input in the
  // rank-free derivation queue. Owner validation must settle the parent's
  // captured checkpoint before deciding that the child scope is current.
  update(root)
    batch(root)
      trigger.set(1)
      payload.set(11)
  hidden-load(calculations).check-strings(["child1:11","child0:10"],
    "lazy parent invalidation retires old owned derivations before they run")
  root.dispose()

fun test-owner-gate-preserves-equal-parent-generation()
  val calculations = hidden-cell([])
  val parent-runs = hidden-cell(0)

  val (root,(trigger,payload)) = create-root fn(root)
    val trigger = signal(root,0)
    val payload = signal(root,10)
    val parent-input = memo(root,0,fn(_) trigger.get % 2)
    val stop-parent = create-effect(root,fn() parent-input.get,fn(current)
      bump(parent-runs)
      val child = memo(root,0,fn(_)
        val value = payload.get
        hidden-store(calculations,
          Cons("child" ++ current.show ++ ":" ++ value.show,
               hidden-load(calculations)))
        value
      )
      ()
    )
    (trigger,payload)

  update(root)
    batch(root)
      trigger.set(2)
      payload.set(11)
  hidden-load(calculations).check-strings(["child0:11","child0:10"],
    "equal lazy parent output keeps its existing child generation current")
  hidden-load(parent-runs).check-int(1,
    "owner validation does not rerun a parent behind an equality cutoff")
  root.dispose()

fun test-owner-validation-failure-preserves-child-ticket()
  val calculations = hidden-cell([])
  val parent-runs = hidden-cell(0)

  val (root,(trigger,payload,should-fail)) = create-root fn(root)
    val trigger = signal(root,0)
    val payload = signal(root,10)
    val should-fail = signal(root,False)
    val parent-input = memo(root,0,fn(_)
      val value = trigger.get
      if should-fail.get then throw("intentional owner checkpoint failure")
      else value % 2
    )
    val stop-parent = create-effect(root,fn() parent-input.get,fn(current)
      bump(parent-runs)
      val child = memo(root,0,fn(_)
        val value = payload.get
        hidden-store(calculations,
          Cons("child" ++ current.show ++ ":" ++ value.show,
               hidden-load(calculations)))
        current * 100 + value
      )
      val stop-child = create-effect(root,fn() child.get,fn(_) ())
      ()
    )
    (trigger,payload,should-fail)

  val failed : error<()> = mask<exn>{
    error/try fn()
      update(root)
        batch(root)
          // The retry settles to the same parity. The parent will not replace
          // its child, so only preservation of the child's own queue ticket
          // can make the pending payload update observable.
          trigger.set(2)
          should-fail.set(True)
          payload.set(11)
  }
  check(failed.is-error,"owner checkpoint failure escapes propagation")
  hidden-load(calculations).check-strings(["child0:10"],
    "failed owner validation cannot run or lose the queued stale child")

  update(root){ should-fail.set(False) }
  hidden-load(calculations).check-strings(["child0:11","child0:10"],
    "equal owner checkpoint retry executes the preserved child ticket")
  hidden-load(parent-runs).check-int(1,
    "equal owner checkpoint retry does not replace or heal the child")
  root.dispose()


// --------------------------------------------------------------------------
// Recursive owner checkpoints fail explicitly and leave the root recoverable
// --------------------------------------------------------------------------

fun test-owner-checkpoint-cycle-is-controlled()
  val slot : ref<global,maybe<memo<int>>> = hidden-cell(Nothing)
  val allow-cleanup-spawn = hidden-cell(True)
  val child-runs = hidden-cell(0)
  val parent-runs = hidden-cell(0)

  val (root,(epoch,payload)) = create-root fn(root)
    val epoch = signal(root,0)
    val payload = signal(root,10)
    val stop-parent = create-effect(root,fn()
      val current = epoch.get
      match hidden-load(slot)
        Nothing -> current * 1000
        Just(child) -> current * 1000 + child.get
    ,fn(_)
      bump(parent-runs)
      on-cleanup(root,fn()
        if hidden-load(allow-cleanup-spawn) then
          val child = memo(root,0,fn(_)
            bump(child-runs)
            payload.get
          )
          hidden-store(slot,Just(child))
        else hidden-store(slot,Nothing)
      )
    )
    (epoch,payload)

  update(root){ epoch.set(1) }
  hidden-load(parent-runs).check-int(2,
    "cleanup-created memo becomes a tracked owner checkpoint")
  hidden-load(child-runs).check-int(1,
    "cleanup-created owned memo initializes exactly once")

  val failed : error<()> = mask<exn>{
    error/try fn() update(root){ payload.set(11) }
  }
  check(failed.is-error,
    "an owner/owned checkpoint cycle is rejected instead of recursing")
  hidden-load(child-runs).check-int(1,
    "cycle detection precedes stale owned memo calculation")
  hidden-load(parent-runs).check-int(2,
    "cycle detection publishes no partial parent generation")

  // Stop recreating the unsupported owner/owned cycle, then invalidate the
  // owner directly. Its next continuation generation no longer reads a child.
  hidden-store(allow-cleanup-spawn,False)
  update(root){ epoch.set(2) }
  hidden-load(parent-runs).check-int(3,
    "direct owner invalidation recovers after checkpoint-cycle rejection")
  hidden-load(child-runs).check-int(1,
    "recovery does not rerun the rejected owned memo")

  // Root disposal runs the current cleanup with registration still disabled.
  root.dispose()
  check(root.is-disposed,
    "checkpoint-cycle recovery still leaves the root disposable")


// --------------------------------------------------------------------------
// Owner preflight pulls stay inside the scheduler re-entry guard
// --------------------------------------------------------------------------

fun test-owner-preflight-pull-does-not-reenter-flush()
  val slot : ref<global,maybe<memo<int>>> = hidden-cell(Nothing)
  val should-fail = hidden-cell(False)
  val track-runs = hidden-cell(0)

  val (root,trigger) = create-root fn(root)
    val trigger = signal(root,0)
    val parent-input = memo(root,0,fn(_)
      val current = trigger.get
      if hidden-load(should-fail)
      then throw("intentional delayed owner-input failure")
      else current
    )
    val stop-parent = create-effect(root,fn()
      bump(track-runs)
      parent-input.get
    ,fn(current)
      val child = memo(root,0,fn(_) current)
      hidden-store(slot,Just(child))
    )
    trigger

  hidden-store(should-fail,True)
  val update-failed : error<()> = mask<exn>{
    error/try fn() update(root){ trigger.set(1) }
  }
  check(update-failed.is-error,
    "delayed owner input retains a dirty retry after failure")
  hidden-load(track-runs).check-int(1,
    "failed upstream producer does not run its dependent parent")

  hidden-store(should-fail,False)
  val stale-read : error<int> = mask<exn>{
    error/try fn() sample(root){ require-owned-memo(slot).get }
  }
  check(stale-read.is-error,
    "pulling an owned memo detects its newly invalidated owner")
  hidden-load(track-runs).check-int(1,
    "owner preflight commit cannot re-enter an upstream producer frame")

  update(root){ trigger.set(2) }
  hidden-load(track-runs).check-int(2,
    "queued parent generation recovers after guarded owner preflight")
  sample(root){ require-owned-memo(slot).get }.check-int(2,
    "recovery publishes a readable replacement owned memo")
  root.dispose()


// --------------------------------------------------------------------------
// A large invalidated ownership fan-out stays stack safe and incremental
// --------------------------------------------------------------------------

fun create-owned-memo-fanout(root : root<e>, payload : signal<int>,
                             remaining : int, child-runs : ref<global,int>)
                            : <div,exn,signal-write> ()
  if remaining <= 0 then () else
    val child = memo(root,0,fn(_)
      bump(child-runs)
      payload.get
    )
    create-owned-memo-fanout(root,payload,remaining - 1,child-runs)

fun run-large-stale-owner-fanout(trigger-first : bool)
  val width = 10000
  val child-runs = hidden-cell(0)
  val parent-runs = hidden-cell(0)
  val order = if trigger-first then "exact-pull-first" else "stale-pop-first"

  val (root,(trigger,payload)) = create-root fn(root)
    val trigger = signal(root,0)
    val payload = signal(root,10)
    val parent-input = memo(root,0,fn(_) trigger.get)
    val stop-parent = create-effect(root,fn() parent-input.get,fn(current)
      bump(parent-runs)
      if current == 0
      then create-owned-memo-fanout(root,payload,width,child-runs)
      else ()
    )
    (trigger,payload)

  hidden-load(child-runs).check-int(width,
    order ++ " fan-out initializes each child exactly once")

  // trigger-first puts children ahead of the lazy parent input, so the first
  // child exact-pulls a ticket at the tail of a 10k queue. payload-first puts
  // the parent input at the head, after which pop skips 10k stale child tickets.
  update(root)
    batch(root)
      if trigger-first then
        trigger.set(1)
        payload.set(11)
      else
        payload.set(11)
        trigger.set(1)
  hidden-load(parent-runs).check-int(2,
    order ++ " fan-out refreshes only its owning continuation")
  hidden-load(child-runs).check-int(width,
    order ++ " fan-out publishes no retired child calculation")
  root.dispose()

fun test-large-stale-owner-fanout-is-stack-safe()
  run-large-stale-owner-fanout(True)
  run-large-stale-owner-fanout(False)


pub fun main()
  test-deep-wide-dynamic-diamond()
  test-batch-targeted-pull-failure-isolation()
  test-previous-equality-duplicate-fanin()
  test-deep-diamond-failure-retry()
  test-failed-parent-disposes-unstarted-child()
  test-parent-refresh-precedes-stale-child()
  test-transitive-owner-generation-gate()
  test-invalidated-owner-rejects-stale-memo-pull()
  test-owner-gate-validates-lazy-parent-dependency()
  test-owner-gate-preserves-equal-parent-generation()
  test-owner-validation-failure-preserves-child-ticket()
  test-owner-checkpoint-cycle-is-controlled()
  test-owner-preflight-pull-does-not-reenter-flush()
  test-large-stale-owner-fanout-is-stack-safe()
  println("reactive-advanced: " ++ (!checks).show ++ " checks passed")
