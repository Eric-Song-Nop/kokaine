module targeted-settle

import kokaine/reactive
import std/core/unsafe


// --------------------------------------------------------------------------
// Tiny harness. Checks accumulate so a runtime without targeted settlement
// exposes every missing semantic in one run instead of stopping at the first.
// --------------------------------------------------------------------------

val checks : ref<global,int> = unsafe-total { ref(0) }
val failures : ref<global,int> = unsafe-total { ref(0) }
val failure-labels : ref<global,list<string>> = unsafe-total { ref([]) }

fun hidden-cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun hidden-load(target : ref<global,a>) : a
  unsafe-total { !target }

fun hidden-store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun bump(target : ref<global,int>) : ()
  hidden-store(target,hidden-load(target) + 1)

fun check(ok : bool, label : string) : ()
  hidden-store(checks,hidden-load(checks) + 1)
  if ok then () else
    hidden-store(failures,hidden-load(failures) + 1)
    hidden-store(failure-labels,Cons(label,hidden-load(failure-labels)))

fun check-int(actual : int, expected : int, label : string) : ()
  check(actual == expected,
    label ++ " (expected " ++ expected.show ++ ", got " ++ actual.show ++ ")")

fun require-memo(slot : ref<global,maybe<memo<int>>>) : exn memo<int>
  match hidden-load(slot)
    Nothing -> throw("memo fixture was not initialized")
    Just(value) -> value


// --------------------------------------------------------------------------
// A failed upstream stays pending. Reading an unrelated memo must not touch
// it; reading the related leaf must retry precisely the upstream -> leaf path.
// --------------------------------------------------------------------------

fun test-failed-upstream-exact-retry() : exn ()
  val fail-upstream = hidden-cell(False)
  val upstream-runs = hidden-cell(0)
  val leaf-runs = hidden-cell(0)
  val unrelated-runs = hidden-cell(0)

  val (root,(source,_upstream,leaf,unrelated)) = create-root fn(root)
    val source = signal(root,1)
    val other = signal(root,10)
    val upstream = derive(root,0,fn()
      val value = source.get
      // Counters deliberately live after the tracked read: they count the
      // resumed continuation suffix, not a retained calculate closure.
      bump(upstream-runs)
      if hidden-load(fail-upstream)
      then throw("intentional upstream failure")
      else value * 2
    )
    val leaf = derive(root,0,fn()
      val value = upstream.get
      bump(leaf-runs)
      value + 1
    )
    val unrelated = derive(root,0,fn()
      val value = other.get
      bump(unrelated-runs)
      value * 3
    )
    (source,upstream,leaf,unrelated)

  hidden-store(fail-upstream,True)
  val failed : error<()> = mask<exn>{
    error/try(fn() update(root){ source.set(2) })
  }
  check(failed.is-error,"upstream failure escapes its invalidation")
  check-int(hidden-load(upstream-runs),2,"failed upstream attempted once")
  check-int(hidden-load(leaf-runs),1,"failed upstream publishes no leaf")

  val unrelated-value = sample(root){ unrelated.get }
  check-int(unrelated-value,30,
    "unrelated get reads its clean producer while failed work is pending")
  check-int(hidden-load(upstream-runs),2,
    "unrelated get never retries the failed upstream")
  check-int(hidden-load(unrelated-runs),1,
    "unrelated get does not globally flush or recompute its clean producer")

  hidden-store(fail-upstream,False)
  val recovered = sample(root){ leaf.get }
  check-int(recovered,5,
    "related get synchronously retries the exact pending producer chain")
  check-int(hidden-load(upstream-runs),3,
    "related get retries the upstream exactly once")
  check-int(hidden-load(leaf-runs),2,
    "related get replaces the dependent suffix exactly once")
  root.dispose()


// --------------------------------------------------------------------------
// Transitive pull is observable inside a batch, before global propagation.
// A dirty unrelated sibling intentionally fails at batch exit. If get used a
// global flush, the requested value could never be recorded first.
// --------------------------------------------------------------------------

fun test-transitive-target-isolation() : exn ()
  val first-runs = hidden-cell(0)
  val second-runs = hidden-cell(0)
  val leaf-runs = hidden-cell(0)
  val sibling-runs = hidden-cell(0)
  val sibling-fails = hidden-cell(False)
  val observed = hidden-cell(-1)
  val sibling-at-read = hidden-cell(-1)

  val (root,(source,noise,leaf)) = create-root fn(root)
    val source = signal(root,1)
    val noise = signal(root,10)
    val first = derive(root,0,fn()
      val value = source.get
      bump(first-runs)
      value * 2
    )
    val second = derive(root,0,fn()
      val value = first.get
      bump(second-runs)
      value + 3
    )
    val leaf = derive(root,0,fn()
      val value = second.get
      bump(leaf-runs)
      value * 5
    )
    val sibling = derive(root,0,fn()
      val value = noise.get
      bump(sibling-runs)
      if hidden-load(sibling-fails)
      then throw("intentional unrelated sibling failure")
      else value
    )
    (source,noise,leaf)

  hidden-store(sibling-fails,True)
  val failed : error<()> = mask<exn>{
    error/try fn()
      dispatch(root)
        batch(root)
          source.set(3)
          noise.set(11)
          hidden-store(observed,leaf.get)
          hidden-store(sibling-at-read,hidden-load(sibling-runs))
  }
  check(failed.is-error,
    "unrelated dirty sibling still fails later at batch-exit propagation")
  check-int(hidden-load(observed),45,
    "transitive get settles first -> second -> leaf before batch exit")
  check-int(hidden-load(sibling-at-read),1,
    "targeted get does not run an unrelated queued producer")
  check-int(hidden-load(first-runs),2,"transitive first producer settles once")
  check-int(hidden-load(second-runs),2,"transitive second producer settles once")
  check-int(hidden-load(leaf-runs),2,"transitive leaf producer settles once")
  check-int(hidden-load(sibling-runs),2,
    "unrelated sibling runs only in the later global propagation phase")

  hidden-store(sibling-fails,False)
  update(root){ noise.set(12) }
  check-int(sample(root){ leaf.get },45,
    "unrelated failure recovery leaves the exact-pulled chain committed")
  root.dispose()


// --------------------------------------------------------------------------
// Resuming the suffix after `choose.get` discovers a new branch read. The new
// dependency must participate in the same synchronous settle, and the retired
// branch continuation must no longer react.
// --------------------------------------------------------------------------

fun test-dynamic-dependency-discovery() : exn ()
  val choose-suffix-runs = hidden-cell(0)
  val left-suffix-runs = hidden-cell(0)
  val right-suffix-runs = hidden-cell(0)
  val leaf-runs = hidden-cell(0)
  val first-observed = hidden-cell(-1)
  val second-observed = hidden-cell(-1)

  val (root,(choose,left,right,leaf)) = create-root fn(root)
    val choose = signal(root,False)
    val left = signal(root,10)
    val right = signal(root,20)
    val branch = derive(root,0,fn()
      val selected = choose.get
      bump(choose-suffix-runs)
      if selected then
        val value = left.get
        bump(left-suffix-runs)
        value
      else
        val value = right.get
        bump(right-suffix-runs)
        value
    )
    val leaf = derive(root,0,fn()
      val value = branch.get
      bump(leaf-runs)
      value * 2
    )
    (choose,left,right,leaf)

  dispatch(root)
    batch(root)
      choose.set(True)
      left.set(11)
      hidden-store(first-observed,leaf.get)
  check-int(hidden-load(first-observed),22,
    "replacement suffix discovers and settles the newly selected branch")
  check-int(hidden-load(choose-suffix-runs),2,
    "selector suffix resumes exactly once for the branch switch")
  check-int(hidden-load(left-suffix-runs),1,
    "new left dependency is captured and evaluated in the replacement")
  check-int(hidden-load(right-suffix-runs),1,
    "old right suffix is not replayed during the branch switch")
  check-int(hidden-load(leaf-runs),2,
    "dynamic branch publishes one coherent downstream replacement")

  update(root){ right.set(21) }
  check-int(hidden-load(right-suffix-runs),1,
    "retired branch capture no longer reacts to its old source")
  check-int(hidden-load(leaf-runs),2,
    "retired branch write cannot invalidate the leaf")

  dispatch(root)
    batch(root)
      left.set(12)
      hidden-store(second-observed,leaf.get)
  check-int(hidden-load(second-observed),24,
    "dependency discovered during replacement remains target-settleable")
  check-int(hidden-load(left-suffix-runs),2,
    "new branch continuation resumes directly on its later source change")
  root.dispose()


// --------------------------------------------------------------------------
// Producer validation must stop at an equal publication. The downstream
// trace remains live and is not resumed merely because an ancestor was dirty.
// --------------------------------------------------------------------------

fun test-equality-cutoff() : exn ()
  val parity-runs = hidden-cell(0)
  val leaf-runs = hidden-cell(0)
  val parity-at-equal-read = hidden-cell(-1)
  val leaf-at-equal-read = hidden-cell(-1)
  val equal-value = hidden-cell(-1)
  val changed-value = hidden-cell(-1)

  val (root,(count,leaf)) = create-root fn(root)
    val count = signal(root,1)
    val parity = derive(root,0,fn()
      val value = count.get
      bump(parity-runs)
      value % 2
    )
    val leaf = derive(root,0,fn()
      val value = parity.get
      bump(leaf-runs)
      value * 100
    )
    (count,leaf)

  dispatch(root)
    batch(root)
      count.set(3)
      hidden-store(equal-value,leaf.get)
      hidden-store(parity-at-equal-read,hidden-load(parity-runs))
      hidden-store(leaf-at-equal-read,hidden-load(leaf-runs))
  check-int(hidden-load(equal-value),100,
    "equal ancestor validates to the existing cached leaf value")
  check-int(hidden-load(parity-at-equal-read),2,
    "targeted read settles the dirty ancestor before returning")
  check-int(hidden-load(leaf-at-equal-read),1,
    "equality cutoff does not resume the downstream continuation")

  dispatch(root)
    batch(root)
      count.set(4)
      hidden-store(changed-value,leaf.get)
  check-int(hidden-load(changed-value),0,
    "changed ancestor continues settlement through the dependent leaf")
  check-int(hidden-load(parity-runs),3,"parity settles once per dirty epoch")
  check-int(hidden-load(leaf-runs),2,
    "leaf resumes only for the ancestor epoch that changes output")
  root.dispose()


// --------------------------------------------------------------------------
// Dynamic cycle: b validates pending a, while a's replacement suffix reads b.
// A preceding intentional failure leaves a pending without entering the cycle,
// so runtimes lacking get-settlement fail quickly instead of hanging here.
// --------------------------------------------------------------------------

fun test-cycle-is-controlled() : exn ()
  val b-slot : ref<global,maybe<memo<int>>> = hidden-cell(Nothing)
  val fail-before-cycle = hidden-cell(False)
  val a-runs = hidden-cell(0)
  val b-runs = hidden-cell(0)

  val (root,(trigger,b)) = create-root fn(root)
    val trigger = signal(root,0)
    val a = derive(root,0,fn()
      val epoch = trigger.get
      bump(a-runs)
      if epoch == 0 then 1
      elif hidden-load(fail-before-cycle)
        then throw("intentional pre-cycle failure")
      else require-memo(b-slot).get + 1
    )
    val b = derive(root,0,fn()
      val value = a.get
      bump(b-runs)
      value + 1
    )
    hidden-store(b-slot,Just(b))
    (trigger,b)

  hidden-store(fail-before-cycle,True)
  val primed : error<()> = mask<exn>{
    error/try(fn() update(root){ trigger.set(1) })
  }
  check(primed.is-error,"pre-cycle failure leaves producer a pending")

  hidden-store(fail-before-cycle,False)
  val cycle : error<int> = mask<exn>{
    error/try(fn() sample(root){ b.get })
  }
  check(cycle.is-error,
    "recursive producer validation reports a controlled cycle error")

  val recovered : error<()> = mask<exn>{
    error/try(fn() update(root){ trigger.set(0) })
  }
  check(recovered.is-ok,
    "cycle detection clears its validation state and leaves root recoverable")
  check-int(sample(root){ b.get },2,
    "cycle recovery preserves the last coherent equal publication")
  root.dispose()


// --------------------------------------------------------------------------
// A leaked producer belongs to the continuation extent that created it.
// Once the owner suffix is replaced, get must reject the dead producer even
// though its source cache still contains a value.
// --------------------------------------------------------------------------

fun test-owned-producer-stale-read() : exn ()
  val slot : ref<global,maybe<memo<int>>> = hidden-cell(Nothing)
  val child-runs = hidden-cell(0)

  val (root,(generation,payload)) = create-root fn(root)
    val generation = signal(root,0)
    val payload = signal(root,10)
    val parent = create-effect(root,fn() generation.get,fn(current)
      val child = derive(root,0,fn()
        val value = payload.get
        bump(child-runs)
        current * 100 + value
      )
      hidden-store(slot,Just(child))
    )
    (generation,payload)

  val stale = require-memo(slot)
  check-int(sample(root){ stale.get },10,
    "owned producer is readable while its continuation extent is live")

  update(root){ generation.set(1) }
  val current = require-memo(slot)
  check-int(sample(root){ current.get },110,
    "owner replacement publishes a new live producer")

  val stale-read : error<int> = mask<exn>{
    error/try(fn() sample(root){ stale.get })
  }
  check(stale-read.is-error,
    "get rejects a producer retired with its owning continuation suffix")

  update(root){ payload.set(11) }
  check-int(sample(root){ current.get },111,
    "replacement producer remains incremental after stale read rejection")
  check-int(hidden-load(child-runs),3,
    "retired producer never executes after owner replacement")
  root.dispose()


pub fun main()
  test-failed-upstream-exact-retry()
  test-transitive-target-isolation()
  test-dynamic-dependency-discovery()
  test-equality-cutoff()
  test-cycle-is-controlled()
  test-owned-producer-stale-read()
  val total = hidden-load(checks)
  val failed = hidden-load(failures)
  if failed == 0
  then println("targeted-settle: " ++ total.show ++ " checks passed")
  else
    hidden-load(failure-labels).reverse.foreach(fn(label)
      println("FAIL: " ++ label)
    )
    throw("targeted-settle: " ++ failed.show ++ " / " ++
          total.show ++ " checks failed")
