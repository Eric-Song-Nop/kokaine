module reactive

import kokaine/reactive
import std/core/unsafe

effect ctl abort-continuation-turn() : ()


// --------------------------------------------------------------------------
// Tiny dependency-free test harness
// --------------------------------------------------------------------------

val checks : ref<global,int> = unsafe-total { ref(0) }

fun check(ok : bool, label : string)
  checks := !checks + 1
  if ok then () else throw("check failed: " ++ label)

fun check-int(actual : int, expected : int, label : string)
  check(actual == expected,
        label ++ " (expected " ++ expected.show ++ ", got " ++ actual.show ++ ")")

fun check-ints(actual : list<int>, expected : list<int>, label : string)
  check(actual == expected,
        label ++ " (expected " ++ expected.show ++ ", got " ++ actual.show ++ ")")

fun check-strings(actual : list<string>, expected : list<string>, label : string)
  check(actual == expected,
        label ++ " (expected " ++ expected.show ++ ", got " ++ actual.show ++ ")")

fun push(cell : ref<global,list<a>>, value : a)
  cell := Cons(value,!cell)

fun hidden-cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun hidden-load(cell : ref<global,a>) : a
  unsafe-total { !cell }

fun hidden-store(cell : ref<global,a>, value : a) : ()
  unsafe-total { cell := value }

fun completes-continuation-turn(action : () -> <abort-continuation-turn,pure|e> bool)
                                : <pure|e> bool
  with final ctl abort-continuation-turn() False
  action()

fun require-continuation-turn(action : () -> <abort-continuation-turn,pure|e> a)
                              : <div,exn|e> a
  with final ctl abort-continuation-turn()
    throw("unexpected continuation turn abort")
  action()


// --------------------------------------------------------------------------
// Signals, memo equality, caching, and nested batching
// --------------------------------------------------------------------------

fun test-signals-and-memos()
  val seen : ref<global,list<int>> = ref([])

  val (root,(count,parity)) = create-root fn(root)
    val count = signal(root,1)
    val parity = memo(root,0,fn(_)
      count.get % 2
    )
    val dispose = create-effect(root,fn() parity.get,fn(value)
      seen.push(value)
    )
    (count,parity)

  (!seen).check-ints([1],"effect sees initial memo")

  update(root){ count.set(1) }
  (!seen).check-ints([1],"equal signal write is ignored")

  update(root){ count.set(3) }
  (!seen).check-ints([1],"equal memo output prunes its consumer")

  update(root){ count.set(4) }
  (!seen).check-ints([0,1],"changed memo output reaches its consumer")

  update(root)
    batch(root)
      count.modify(fn(value) value + 1)
      batch(root)
        count.modify(fn(value) value + 1)

  sample(root){ count.get }.check-int(6,"updaters compose on latest batch value")
  (!seen).check-ints([0,1],"equal batched memo output stays pruned")
  sample(root){ parity.get }.check-int(0,"memo reads are cached")
  sample(root){ parity.get }.check-int(0,"repeated memo read is cached")
  root.dispose()


// --------------------------------------------------------------------------
// Dynamic dependency removal and untracked reads
// --------------------------------------------------------------------------

fun test-dynamic-dependencies()
  val seen : ref<global,list<int>> = ref([])

  val (root,(choose,left,right)) = create-root fn(root)
    val choose = signal(root,True)
    val left = signal(root,1)
    val right = signal(root,10)
    val selected = memo(root,0,fn(_)
      if choose.get then left.get else right.get
    )
    val dispose = create-effect(root,fn() selected.get,fn(value)
      seen.push(value)
    )
    (choose,left,right)

  (!seen).check-ints([1],"dynamic memo initial branch")
  update(root){ right.set(11) }
  (!seen).check-ints([1],"inactive branch is unsubscribed")
  update(root){ left.set(2) }
  (!seen).check-ints([2,1],"active branch updates")

  update(root)
    batch(root)
      choose.set(False)
      right.set(12)
  (!seen).check-ints([12,2,1],"branch switch observes final batch value once")
  update(root){ left.set(3) }
  (!seen).check-ints([12,2,1],"old branch edge is removed")
  root.dispose()

fun test-untrack()
  val seen : ref<global,list<int>> = ref([])

  val (root,(tracked,ignored)) = create-root fn(root)
    val tracked = signal(root,1)
    val ignored = signal(root,10)
    val track = fn()
      val left = tracked.get
      val right = untrack{ ignored.get }
      left + right
    val dispose = create-effect(root,track,fn(value) seen.push(value))
    (tracked,ignored)

  update(root){ ignored.set(20) }
  (!seen).check-ints([11],"untracked source does not schedule effect")
  update(root){ tracked.set(2) }
  (!seen).check-ints([22,11],"later tracked run samples latest untracked value")
  root.dispose()

fun test-captured-incrementality()
  val left-prefixes = hidden-cell(0)
  val left-suffixes = hidden-cell(0)
  val right-prefixes = hidden-cell(0)
  val right-suffixes = hidden-cell(0)
  val fanin-prefixes = hidden-cell(0)
  val fanin-suffixes = hidden-cell(0)
  val fanin-applies = hidden-cell(0)

  val (root,(left,right)) = create-root fn(root)
    val left = signal(root,0)
    val right = signal(root,0)
    val stop-left = create-effect(root,fn()
      hidden-store(left-prefixes,hidden-load(left-prefixes) + 1)
      val value = left.get
      hidden-store(left-suffixes,hidden-load(left-suffixes) + 1)
      value
    ,fn(_) ())
    val stop-right = create-effect(root,fn()
      hidden-store(right-prefixes,hidden-load(right-prefixes) + 1)
      val value = right.get
      hidden-store(right-suffixes,hidden-load(right-suffixes) + 1)
      value
    ,fn(_) ())
    val stop-fanin = create-effect(root,fn()
      hidden-store(fanin-prefixes,hidden-load(fanin-prefixes) + 1)
      // Duplicate reads deliberately revisit the same source. One epoch must
      // resume the exact suffix once, without replaying this prefix.
      val value = left.get + left.get + right.get
      hidden-store(fanin-suffixes,hidden-load(fanin-suffixes) + 1)
      value
    ,fn(_)
      hidden-store(fanin-applies,hidden-load(fanin-applies) + 1)
    )
    (left,right)

  update(root){ left.set(1) }
  hidden-load(left-prefixes).check-int(1,
    "source-local capture does not replay the left prefix")
  hidden-load(left-suffixes).check-int(2,
    "source-local capture resumes the left suffix")
  hidden-load(right-prefixes).check-int(1,
    "source-local capture isolates the unrelated right prefix")
  hidden-load(right-suffixes).check-int(1,
    "source-local capture isolates the unrelated right suffix")
  hidden-load(fanin-prefixes).check-int(1,
    "duplicate reads do not replay the fan-in prefix")
  hidden-load(fanin-suffixes).check-int(2,
    "duplicate reads resume one captured generation")

  update(root)
    batch(root)
      left.set(2)
      right.set(1)
  hidden-load(left-prefixes).check-int(1,"left prefix remains one-shot")
  hidden-load(right-prefixes).check-int(1,"right prefix remains one-shot")
  hidden-load(fanin-prefixes).check-int(1,"fan-in prefix remains one-shot")
  hidden-load(left-suffixes).check-int(3,"left suffix advances once per batch")
  hidden-load(right-suffixes).check-int(2,"right suffix advances once per batch")
  hidden-load(fanin-suffixes).check-int(3,
    "fan-in suffix resumes once when several sources invalidate")
  hidden-load(fanin-applies).check-int(3,
    "fan-in publishes one complete value per generation")
  root.dispose()


// --------------------------------------------------------------------------
// Glitch freedom through a converging diamond
// --------------------------------------------------------------------------

fun test-diamond()
  val seen : ref<global,list<int>> = ref([])

  val (root,source) = create-root fn(root)
    val source = signal(root,0)
    // Deliberately construct the branches in the opposite order of their use.
    val right = memo(root,0,fn(_) source.get * 100)
    val left = memo(root,0,fn(_) source.get * 10)
    val joined = memo(root,0,fn(_) left.get + right.get)
    val dispose = create-effect(root,fn() joined.get,fn(value)
      seen.push(value)
    )
    source

  update(root){ source.set(1) }
  (!seen).check-ints([110,0],"diamond emits one coherent epoch")

  update(root)
    batch(root)
      source.set(2)
      source.set(3)
  (!seen).check-ints([330,110,0],"diamond and batch remain deduplicated")
  root.dispose()


// --------------------------------------------------------------------------
// Ownership, cleanup, child disposal, and idempotent roots
// --------------------------------------------------------------------------

fun test-cleanup()
  val events : ref<global,list<string>> = ref([])

  val (root,count) = create-root fn(root)
    val count = signal(root,0)
    val dispose = create-effect(root,fn() count.get,fn(value)
      events.push("run" ++ value.show)
      on-cleanup(root,fn() events.push("clean" ++ value.show))
    )
    count

  update(root){ count.set(1) }
  (!events).check-strings(["run1","clean0","run0"],
                          "cleanup runs before refresh")
  root.dispose()
  (!events).check-strings(["clean1","run1","clean0","run0"],
                          "root disposal runs current cleanup")
  root.dispose()
  (!events).check-strings(["clean1","run1","clean0","run0"],
                          "root disposal is idempotent")
  check(root.is-disposed,"root reports disposed")

fun test-owned-child()
  val events : ref<global,list<string>> = ref([])

  val (root,(parent-key,child-value)) = create-root fn(root)
    val parent-key = signal(root,0)
    val child-value = signal(root,10)
    val parent-dispose = create-effect(root,fn() parent-key.get,fn(parent)
      val child-dispose = create-effect(root,fn() child-value.get,fn(child)
        events.push("child" ++ parent.show ++ ":" ++ child.show)
        on-cleanup(root,fn() events.push("drop" ++ parent.show))
      )
      ()
    )
    (parent-key,child-value)

  update(root){ parent-key.set(1) }
  (!events).check-strings(
    ["child1:10","drop0","child0:10"],
    "refresh disposes owned child before creating replacement"
  )
  update(root){ child-value.set(11) }
  (!events).check-strings(
    ["child1:11","drop1","child1:10","drop0","child0:10"],
    "replacement child remains reactive"
  )
  root.dispose()

fun test-self-disposal()
  val runs = hidden-cell(0)
  val cleanups = hidden-cell(0)
  val stop-cell : ref<global,maybe<disposer<total>>> = hidden-cell(Nothing)

  val built : (root<total>,(signal<int>,disposer<total>)) =
    create-root fn(root)
      val source = signal(root,0)
      val stop = create-effect(root,fn() source.get,fn(value)
        hidden-store(runs,hidden-load(runs) + 1)
        on-cleanup(root,fn()
          hidden-store(cleanups,hidden-load(cleanups) + 1)
        )
        if value == 1 then
          match hidden-load(stop-cell)
            Just(dispose) -> dispose()
            Nothing -> ()
        else ()
      )
      (source,stop)
  val (root,(source,stop)) = built
  hidden-store(stop-cell,Just(stop))

  update(root){ source.set(1) }
  update(root){ source.set(2) }
  stop()
  root.dispose()
  if hidden-load(runs) == 2 then ()
  else throw("self-disposed continuation published another runnable process")
  if hidden-load(cleanups) == 2 then ()
  else throw("self-disposal did not clean both continuation generations")

fun test-cleanup-self-disposal()
  val runs = hidden-cell(0)
  val cleanups = hidden-cell(0)
  val stop-cell : ref<global,maybe<disposer<total>>> = hidden-cell(Nothing)

  val built : (root<total>,signal<int>) =
    create-root fn(root)
      val source = signal(root,0)
      val stop = create-effect(root,fn() source.get,fn(_)
        hidden-store(runs,hidden-load(runs) + 1)
        on-cleanup(root,fn()
          hidden-store(cleanups,hidden-load(cleanups) + 1)
          match hidden-load(stop-cell)
            Just(dispose) -> dispose()
            Nothing -> ()
        )
      )
      hidden-store(stop-cell,Just(stop))
      source
  val (root,source) = built

  update(root){ source.set(1) }
  update(root){ source.set(2) }
  root.dispose()
  if hidden-load(runs) == 1 then ()
  else throw("cleanup self-disposal resumed a finalized continuation")
  if hidden-load(cleanups) == 1 then ()
  else throw("cleanup self-disposal ran cleanup more than once")

fun test-disposed-owner-rejects-registration()
  val child-runs = hidden-cell(0)
  val stop-cell : ref<global,maybe<disposer<total>>> = hidden-cell(Nothing)

  val built : (root<total>,signal<int>) =
    create-root fn(root)
      val source = signal(root,0)
      val stop = create-effect(root,fn() source.get,fn(value)
        if value == 1 then
          match hidden-load(stop-cell)
            Just(dispose) -> dispose()
            Nothing -> ()
          val orphan = create-effect(root,fn() source.get,fn(_)
            hidden-store(child-runs,hidden-load(child-runs) + 1)
          )
          ()
        else ()
      )
      hidden-store(stop-cell,Just(stop))
      source
  val (root,source) = built

  val failed : error<()> = mask<exn>{
    error/try fn() update(root){ source.set(1) }
  }
  if failed.is-error then ()
  else throw("registration under a disposed owner was accepted")
  update(root){ source.set(2) }
  root.dispose()
  if hidden-load(child-runs) == 0 then ()
  else throw("registration under a disposed owner leaked a child")

fun test-final-control-recovery()
  val runs = hidden-cell(0)

  val built =
    require-continuation-turn fn()
      create-root fn(root)
        val source = signal(root,0)
        val stop = create-effect(root,fn() source.get,fn(value)
          hidden-store(runs,hidden-load(runs) + 1)
          if value == 1 then abort-continuation-turn() else ()
        )
        source
  val (root,source) = built

  val completed = completes-continuation-turn fn()
    update(root){ source.set(1) }
    True
  if completed then
    throw("final control did not abort the continuation turn")
  else ()

  val recovered = completes-continuation-turn fn()
    update(root){ source.set(2) }
    True
  if recovered then ()
  else throw("final control unexpectedly aborted the recovery round")
  if hidden-load(runs) == 3 then ()
  else throw("continuation did not recover after final control abort")
  val disposed = completes-continuation-turn fn()
    root.dispose()
    True
  if disposed && root.is-disposed then ()
  else throw("final control recovery left the root undisposed")


// --------------------------------------------------------------------------
// Non-reentrant writes and exception-state restoration
// --------------------------------------------------------------------------

fun test-non-reentrant-write()
  val seen : ref<global,list<int>> = ref([])

  val (root,value) = create-root fn(root)
    val value = signal(root,0)
    val dispose = create-effect(root,fn() value.get,fn(current)
      seen.push(current)
      if current < 2 then value.set(current + 1) else ()
    )
    value

  (!seen).check-ints([2,1,0],"writes from apply callbacks queue non-reentrantly")
  sample(root){ value.get }.check-int(2,"queued feedback settles")
  root.dispose()

fun test-exception-restoration()
  val seen : ref<global,list<int>> = ref([])

  val (root,value) = create-root fn(root)
    val value = signal(root,0)
    val dispose = create-effect(root,fn() value.get,fn(current)
      if current == 1 then throw("intentional effect failure")
      else seen.push(current)
    )
    value

  val failed : error<()> = mask<exn>{
    error/try fn() update(root){ value.set(1) }
  }
  check(failed.is-error,"effect exception escapes update")
  update(root){ value.set(2) }
  (!seen).check-ints([2,0],"handler state is restored after exception")
  root.dispose()


// --------------------------------------------------------------------------
// Regression cases from independent scheduler and capability review
// --------------------------------------------------------------------------

fun test-transitive-batch-freshness()
  val (root,(source,leaf)) = create-root fn(root)
    val source = signal(root,1)
    val mid = memo(root,0,fn(_) source.get * 2)
    val leaf = memo(root,0,fn(_) mid.get * 2)
    (source,leaf)

  val observed = dispatch(root)
    batch(root)
      source.set(2)
      leaf.get
  observed.check-int(8,"pulling a transitive memo settles dirty ancestors")
  root.dispose()

fun test-dynamic-depth-atomicity()
  val (root,(source,toggle,consumer)) = create-root fn(root)
    val source = signal(root,1)
    val toggle = signal(root,0)
    val mid = memo(root,0,fn(_) source.get * 2)
    val leaf = memo(root,0,fn(_) mid.get)
    val consumer = memo(root,0,fn(previous)
      if toggle.get == 0 then 0 else previous + leaf.get
    )
    (source,toggle,consumer)

  update(root)
    batch(root)
      // The consumer was previously independent from the deep chain and can be
      // selected before it. Pull settlement must discover the new dependency
      // before committing `previous + leaf`.
      toggle.set(1)
      source.set(2)
  sample(root){ consumer.get }.check-int(4,
    "dynamic depth changes observe one atomic epoch")
  root.dispose()

fun test-targeted-producer-pull()
  val (root,(x,y,toggle,combined)) = create-root fn(root)
    val x = signal(root,0)
    val y = signal(root,0)
    val toggle = signal(root,False)
    val branch = memo(root,0,fn(_) x.get)
    val selected = memo(root,0,fn(_)
      if toggle.get then branch.get else 0
    )
    val combined = memo(root,0,fn(_) selected.get + y.get)
    (x,y,toggle,combined)

  update(root)
    batch(root)
      // This creates the queue order selected, combined, branch. Pulling the
      // branch from selected must extract that exact producer instead of
      // running the unrelated combined sibling and reporting a false cycle.
      x.set(1)
      y.set(1)
      toggle.set(True)
  sample(root){ combined.get }.check-int(2,
    "targeted producer pull preserves an acyclic dynamic dependency")
  root.dispose()

fun test-generation-checkpoint-equality()
  val downstream-runs = hidden-cell(0)
  val (root,(count,accumulated)) = create-root fn(root)
    val count = signal(root,1)
    val parity = memo(root,0,fn(_) count.get % 2)
    val accumulated = memo(root,0,fn(previous)
      val current = parity.get
      hidden-store(downstream-runs,hidden-load(downstream-runs) + 1)
      previous + current
    )
    (count,accumulated)

  hidden-load(downstream-runs).check-int(1,
    "downstream memo captures one initial generation")
  val observed = dispatch(root)
    batch(root)
      count.set(3)
      accumulated.get
  observed.check-int(1,
    "checkpoint validation returns the cached value after equal commit")
  hidden-load(downstream-runs).check-int(1,
    "equal upstream memo does not execute a stateful downstream memo")
  root.dispose()

fun test-clean-read-failure-isolation()
  val failing-runs = hidden-cell(0)
  val (root,(trigger,stable)) = create-root fn(root)
    val trigger = signal(root,0)
    val failing = memo(root,0,fn(_)
      hidden-store(failing-runs,hidden-load(failing-runs) + 1)
      val value = trigger.get
      if value == 1 then throw("intentional unrelated memo failure")
      else value
    )
    val stable-source = signal(root,7)
    val stable = memo(root,0,fn(_) stable-source.get * 2)
    (trigger,stable)

  val failed : error<()> = mask<exn>{
    error/try fn() update(root){ trigger.set(1) }
  }
  check(failed.is-error,"unrelated memo failure remains queued for retry")
  hidden-load(failing-runs).check-int(2,
    "failing memo ran initially and once for the failed update")
  sample(root){ stable.get }.check-int(14,
    "reading a clean memo does not flush unrelated failed work")
  hidden-load(failing-runs).check-int(2,
    "clean memo validation leaves unrelated retry work untouched")
  root.dispose()

fun test-late-registration()
  val seen : ref<global,int> = ref(0)
  val seen-double : ref<global,int> = ref(0)
  val (root,source) = create-root fn(root) signal(root,7)

  val stop = update(root)
    create-effect(root,fn() source.get,fn(value) seen := value)
  (!seen).check-int(7,"late effect runs before registration returns")

  val (double,stop-double) = update(root)
    batch(root)
      val double = memo(root,0,fn(_) source.get * 2)
      val stop-double = create-effect(root,fn() double.get,
        fn(value) seen-double := value)
      (double,stop-double)
  (!seen-double).check-int(14,"late memo and effect initialize coherently")
  sample(root){ double.get }.check-int(14,"late memo remains readable")
  stop-double()
  stop()
  root.dispose()

fun mutate-total(root : root<total>, source : signal<int>, value : int)
                : exn ()
  update(root){ source.set(value) }

fun read-total(root : root<total>, source : signal<int>) : exn int
  sample(root){ source.get }

fun test-nested-handler-rejection()
  val built : (root<total>,signal<int>) = create-root fn(root)
    signal(root,0)
  val (root,source) = built
  val failed : error<memo<int>> = mask<exn>{
    error/try fn()
      update(root)
        derive(root,0,fn()
          mutate-total(root,source,7)
          source.get
        )
  }
  val after-rejection = sample(root){ source.get }
  update(root){ source.set(8) }
  val after-update = sample(root){ source.get }
  root.dispose()
  if failed.is-error then ()
  else throw("a locally handled write was accepted in a pure calculator")
  if after-rejection == 0 then ()
  else throw("rejected calculator write partially committed its source")
  if after-update == 8 then ()
  else throw("pure-plane rejection leaked into an ordinary update")

fun test-apply-is-untracked()
  val built : (root<total>,(signal<int>,signal<int>,signal<int>)) =
    create-root fn(root)
      val tracked = signal(root,0)
      val apply-only = signal(root,2)
      val output = signal(root,0)
      val stop = create-effect(root,fn() tracked.get,fn(_)
        output.set(read-total(root,apply-only))
      )
      (tracked,apply-only,output)
  val (root,(tracked,apply-only,output)) = built

  update(root){ apply-only.set(3) }
  val first = sample(root){ output.get }
  if first == 2 then () else throw("apply sample became a dependency")
  update(root){ tracked.set(1) }
  val second = sample(root){ output.get }
  if second == 3 then () else throw("apply did not sample the latest value")
  root.dispose()

fun test-cleanup-failure-recovery()
  val events : ref<global,list<string>> = ref([])
  val (root,value) = create-root fn(root)
    val value = signal(root,0)
    val stop = create-effect(root,fn() value.get,fn(current)
      events.push("run" ++ current.show)
      on-cleanup(root,fn()
        events.push("clean" ++ current.show)
        if current == 0 then throw("intentional cleanup failure") else ()
      )
    )
    value

  val failed : error<()> = mask<exn>{
    error/try fn() update(root){ value.set(1) }
  }
  check(failed.is-error,"cleanup failure escapes the triggering update")
  update(root){ value.set(2) }
  (!events).check-strings(["run2","clean0","run0"],
    "cleanup failure leaves the continuation retryable")
  root.dispose()

fun test-memo-error-state()
  val (root,(source,broken)) = create-root fn(root)
    val source = signal(root,0)
    val broken = memo(root,42,fn(_)
      val value = source.get
      if value == 1 then throw("memo failed")
      elif value == 0 then 42
      else value
    )
    (source,broken)

  val update-failed : error<()> = mask<exn>{
    error/try fn() update(root){ source.set(1) }
  }
  check(update-failed.is-error,"memo exception escapes propagation")
  val read-failed : error<int> = mask<exn>{
    error/try fn() sample(root){ broken.get }
  }
  check(read-failed.is-error,"failed memo never exposes its stale cache")
  update(root){ source.set(2) }
  sample(root){ broken.get }.check-int(2,"invalidated memo recovers after failure")
  root.dispose()

fun test-disposal-isolation()
  val runs : ref<global,int> = ref(0)
  val (root,_) = create-root fn(root)
    val source = signal(root,0)
    val trigger = signal(root,0)
    val first = create-effect(root,fn() source.get,fn(_)
      runs := !runs + 1
    )
    val second = create-effect(root,fn() trigger.get,fn(_)
      on-cleanup(root,fn() source.set(1))
    )
    ()

  (!runs).check-int(1,"effect initialized before disposal")
  root.dispose()
  (!runs).check-int(1,"cleanup writes cannot rerun sibling effects")

fun churn(source : signal<int>, derived : memo<int>, count : int)
          : <signal-read,signal-write,pure> ()
  if count <= 0 then () else
    source.set(count)
    val current = derived.get
    churn(source,derived,count - 1)

fun test-continuation-churn-coherence()
  val (root,(source,derived)) = create-root fn(root)
    val source = signal(root,0)
    val derived = memo(root,0,fn(_) source.get)
    (source,derived)
  dispatch(root)
    batch(root)
      churn(source,derived,10002)
  sample(root){ derived.get }.check-int(1,
    "lazy settling removes queue tombstones")
  root.dispose()


pub fun main()
  test-signals-and-memos()
  test-dynamic-dependencies()
  test-untrack()
  test-captured-incrementality()
  test-diamond()
  test-cleanup()
  test-owned-child()
  test-self-disposal()
  test-cleanup-self-disposal()
  test-disposed-owner-rejects-registration()
  test-final-control-recovery()
  test-non-reentrant-write()
  test-exception-restoration()
  test-transitive-batch-freshness()
  test-dynamic-depth-atomicity()
  test-targeted-producer-pull()
  test-generation-checkpoint-equality()
  test-clean-read-failure-isolation()
  test-late-registration()
  test-nested-handler-rejection()
  test-apply-is-untracked()
  test-cleanup-failure-recovery()
  test-memo-error-state()
  test-disposal-isolation()
  test-continuation-churn-coherence()
  println("reactive: " ++ (!checks).show ++ " checks passed")
