module kernel-regressions

// Regression probes for three kernel defects found by the 2026-11 audit:
//   1. reading a clean memo re-validated upstream once per path (2^depth);
//   2. a user `finally` inside a tracked suffix ran again at retirement;
//   3. one failing effect stayed at the queue front, starving later work.

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

// Monotonic milliseconds. std/time would pull in std/num/int64, whose C does
// not build with GCC 15 on x86-64 CI runners.
extern now-ms() : ndet int
  c inline "({ kk_duration_t now = kk_timer_ticks(kk_context()); kk_integer_from_int64(now.seconds * 1000 + now.attoseconds / 1000000000000000LL, kk_context()); })"
  js inline "Math.floor(performance.now())"

fun hidden-cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun hidden-load(cell : ref<global,a>) : a
  unsafe-total { !cell }

fun hidden-store(cell : ref<global,a>, value : a) : ()
  unsafe-total { cell := value }

fun bump(cell : ref<global,int>) : ()
  hidden-store(cell,hidden-load(cell) + 1)

fun push(cell : ref<global,list<int>>, value : int) : ()
  hidden-store(cell,Cons(value,hidden-load(cell)))



// --------------------------------------------------------------------------
// 1. Clean memo reads are linear in the graph, not in its path count
// --------------------------------------------------------------------------

fun diamond-chain(root : root<e>, input : memo<int>, depth : int)
                 : <signal-write,pure> memo<int>
  if depth <= 0 then input
  else
    val left = derive(root,0,fn() input.get + 1)
    val right = derive(root,0,fn() input.get + 2)
    val join = derive(root,0,fn() (left.get + right.get) % 1000)
    diamond-chain(root,join,depth - 1)

fun test-clean-diamond-read-is-linear()
  // 22 diamonds is 67 memos but 2^22 upstream paths. Before the fix one
  // clean read took seconds here; now a read walks each producer once.
  val depth = 22
  val (root,(source,top)) = create-root fn(root)
    val source = signal(root,1)
    val base = derive(root,0,fn() source.get)
    (source,diamond-chain(root,base,depth))

  val first = sample(root){ top.get }
  val started = now-ms()
  val reads = sample(root){ top.get } + sample(root){ top.get } +
              sample(root){ top.get } + sample(root){ top.get }
  val spent = now-ms() - started
  check-int(reads,4 * first,"clean diamond reads agree")
  check(spent < 1000,
        "four clean reads of a 22-deep diamond take under a second (took " ++
        spent.show ++ " ms)")

  update(root){ source.set(2) }
  val after = sample(root){ top.get }
  check(after != first || depth == 0,"diamond still propagates a write")
  root.dispose()


// --------------------------------------------------------------------------
// 2. `finally` inside a tracked suffix runs once per completed run
// --------------------------------------------------------------------------

fun test-tracked-finally-runs-once-per-run()
  val finals = hidden-cell(0)
  val (root,(a,b,stop)) = create-root fn(root)
    val a = signal(root,0)
    val b = signal(root,0)
    val stop = create-effect(root,
      fn() finally(fn() bump(finals),fn() a.get + b.get),
      fn(_) ())
    (a,b,stop)

  hidden-load(finals).check-int(1,"initial tracked run finalizes once")
  update(root){ a.set(1) }
  hidden-load(finals).check-int(2,"resuming after `a` finalizes once")
  update(root){ b.set(1) }
  hidden-load(finals).check-int(3,"resuming after `b` finalizes once")
  stop()
  hidden-load(finals).check-int(3,"retiring completed suffixes runs no finalizer")
  root.dispose()
  hidden-load(finals).check-int(3,"root disposal runs no finalizer")


// --------------------------------------------------------------------------
// 3. A failing effect is quarantined instead of blocking the queue
// --------------------------------------------------------------------------

fun test-failing-effect-does-not-starve-others()
  val broken-runs = hidden-cell(0)
  val seen : ref<global,list<int>> = hidden-cell([])
  val (root,(bad,other,_,_)) = create-root fn(root)
    val bad = signal(root,0)
    val other = signal(root,0)
    val stop-broken = create-effect(root,fn() bad.get,fn(value)
      bump(broken-runs)
      if value > 0 then throw("intentional effect failure") else ()
    )
    val stop-other = create-effect(root,fn() other.get,fn(value) seen.push(value))
    (bad,other,stop-broken,stop-other)

  hidden-load(broken-runs).check-int(1,"broken effect starts once")
  val first : error<()> = mask<exn>{
    // Resumptions are prepended, so writing `bad` last queues the failing
    // ticket in front of the healthy one.
    error/try fn() update(root){ batch(root){ other.set(5); bad.set(1) } }
  }
  check(first.is-error,"the failure still escapes the update that caused it")
  hidden-load(seen).check-ints([5,0],
    "work queued behind the failing ticket drains in the same flush")
  hidden-load(broken-runs).check-int(2,"the failing ticket ran once")

  // The update boundary still offers the quarantined ticket a recovery turn,
  // but only after unrelated work has drained.
  val second : error<()> = mask<exn>{
    error/try fn() update(root){ other.set(6) }
  }
  check(second.is-error,"an update boundary retries the still-failing ticket")
  hidden-load(seen).check-ints([6,5,0],"unrelated work is never starved")
  hidden-load(broken-runs).check-int(3,"one retry per update boundary")

  // A fresh invalidation of the failed ticket's own input re-admits it.
  update(root){ bad.set(0) }
  hidden-load(broken-runs).check-int(4,"own invalidation re-admits the ticket")
  update(root){ other.set(7) }
  hidden-load(broken-runs).check-int(4,"a recovered ticket is not re-run")
  hidden-load(seen).check-ints([7,6,5,0],"recovered root keeps publishing")
  root.dispose()


pub fun main()
  test-clean-diamond-read-is-linear()
  test-tracked-finally-runs-once-per-run()
  test-failing-effect-does-not-starve-others()
  println("kernel-regressions: " ++ (!checks).show ++ " checks passed")
