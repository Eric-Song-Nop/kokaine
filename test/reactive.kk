module reactive

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
        label ++ " (expected " ++ expected.show ++ ", got " ++ actual.show ++ ")")

fun check-ints(actual : list<int>, expected : list<int>, label : string)
  check(actual == expected,
        label ++ " (expected " ++ expected.show ++ ", got " ++ actual.show ++ ")")

fun check-strings(actual : list<string>, expected : list<string>, label : string)
  check(actual == expected,
        label ++ " (expected " ++ expected.show ++ ", got " ++ actual.show ++ ")")

fun push(cell : ref<global,list<a>>, value : a)
  cell := Cons(value,!cell)


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
  (!seen).check-ints([1],"equal memo output prunes its observer")

  update(root){ count.set(4) }
  (!seen).check-ints([0,1],"changed memo output reaches observer")

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

fun test-transitive-pending()
  val (root,(source,leaf)) = create-root fn(root)
    val source = signal(root,1)
    val mid = memo(root,0,fn(_) source.get * 2)
    val leaf = memo(root,0,fn(_) mid.get * 2)
    (source,leaf)

  val observed = dispatch(root)
    batch(root)
      source.set(2)
      leaf.get
  observed.check-int(8,"pulling a transitive memo settles stale ancestors")
  root.dispose()

fun test-dynamic-rank-change()
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
      // The consumer was rank one before this update and is queued before the
      // previously unrelated deep chain. Pull settling must discover the new
      // dependency before committing `previous + leaf`.
      toggle.set(1)
      source.set(2)
  sample(root){ consumer.get }.check-int(4,
    "dynamic rank changes observe one atomic epoch")
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
                : <pure> ()
  update(root){ source.set(value) }

fun read-total(root : root<total>, source : signal<int>) : <pure> int
  sample(root){ source.get }

fun test-nested-handler-containment()
  val built : (root<total>,signal<int>) = create-root fn(root)
    signal(root,0)
  val (root,source) = built
  val failed : error<memo<int>> = mask<exn>{
    error/try fn()
      update(root)
        memo(root,0,fn(_)
          // This helper discharges :signal-write itself. Runtime phase checks
          // still reject it while the memo is collecting dependencies.
          mutate-total(root,source,7)
          source.get
        )
  }
  if failed.is-error then () else throw("nested handler write was accepted")
  val unchanged = sample(root){ source.get }
  if unchanged == 0 then () else throw("rejected memo write was committed")
  root.dispose()

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
    "cleanup failure leaves the observer retryable")
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

fun test-lazy-queue-coherence()
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
  test-diamond()
  test-cleanup()
  test-owned-child()
  test-non-reentrant-write()
  test-exception-restoration()
  test-transitive-pending()
  test-dynamic-rank-change()
  test-late-registration()
  test-nested-handler-containment()
  test-apply-is-untracked()
  test-cleanup-failure-recovery()
  test-memo-error-state()
  test-disposal-isolation()
  test-lazy-queue-coherence()
  println("reactive: " ++ (!checks).show ++ " checks passed")
