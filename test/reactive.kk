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


pub fun main()
  test-signals-and-memos()
  test-dynamic-dependencies()
  test-untrack()
  test-diamond()
  test-cleanup()
  test-owned-child()
  test-non-reentrant-write()
  test-exception-restoration()
  println("reactive: " ++ (!checks).show ++ " checks passed")
