module async-runtime-cost

// Host-turn, batch, supervisor, and cancellation-scan costs of the generation
// async runtime under a deterministic dispatcher. Every scenario also checks
// its observable result so a cheaper schedule cannot silently drop work.

import kokaine/async/effects
import kokaine/async/structured
import kokaine/reactive
import kokaine/reactive/integration
import kokaine/reactive/async/integration
import kokaine/reactive/async/internal/runtime
import kokaine/reactive/async/internal/host-turn
import kokaine/reactive/integration/internal/reentry
import std/core/unsafe
import std/core/undiv


fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun hidden-load(value : ref<global,a>) : a
  unsafe-total { !value }

fun hidden-store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun check(ok : bool, message : string)
  if ok then () else throw("async runtime cost: " ++ message)

// A host queue whose raw `post` counts host callbacks (microtasks in a
// browser). As in the Web adapter, the dispatcher coalesces through a
// `host-turn-coalescer` over that raw post. Raw callbacks are kept as a
// reversed back list so 24,000 posts would stay linear.
type host
  Host(front : ref<global,list<() -> ui ()>>,
       back : ref<global,list<() -> ui ()>>,
       posts : ref<global,int>,
       coalescer : ref<global,maybe<host-turn-coalescer>>)

fun host/post(h : host, action : () -> ui ()) : ui bool
  hidden-store(h.posts,hidden-load(h.posts) + 1)
  hidden-store(h.back,Cons(action,hidden-load(h.back)))
  True

fun new-host() : host
  val h = Host(hidden([]),hidden([]),hidden(0),hidden(Nothing))
  hidden-store(h.coalescer,
               Just(new-host-turn-coalescer(fn(action) h.post(action))))
  h

fun host/dispatcher(h : host) : async-host-dispatcher
  match hidden-load(h.coalescer)
    Nothing -> new-async-host-dispatcher(fn(action) h.post(action))
    Just(coalescer) ->
      new-async-host-dispatcher(fn(action) coalescer.post(action))

// Run every posted turn, including turns posted by earlier turns.
fun host/drain(h : host) : <ui,div> ()
  match hidden-load(h.front)
    Cons(turn,rest) ->
      hidden-store(h.front,rest)
      turn()
      h.drain
    Nil ->
      match hidden-load(h.back)
        Nil -> ()
        pending ->
          hidden-store(h.back,[])
          hidden-store(h.front,pending.reverse)
          h.drain

// A closed wrapper lets the polymorphic `dispatch` row open inside the
// `<ui,div,exn>` measurement closures.
fun start(root : root<<ui>>, h : host,
          action : () -> <async,signal-read,signal-write,pure,ui> ())
         : <exn,ui> ()
  dispatch(root,fn() run-async-with-dispatcher(root,h.dispatcher,action))

fun new-root() : <exn,ui> root<<ui>>
  val (root,()) : (root<<ui>>,()) = create-root fn(_root) ()
  root

fun dispose-root(root : root<<ui>>) : <exn,ui> ()
  root.dispose()

type cost
  Cost(posts : int, batches : int, supervisors : int, scans : int)

fun cost/show(c : cost) : string
  "posts=" ++ c.posts.show ++ " batches=" ++ c.batches.show ++
  " supervisors=" ++ c.supervisors.show ++ " scans=" ++ c.scans.show

fun measure(h : host, action : () -> <ui,div,exn> ()) : <ui,div,exn> cost
  val posts0 = hidden-load(h.posts)
  val batches0 = reentry-batch-count()
  val supervisors0 = generation-async-supervisor-allocations()
  val scans0 = generation-async-scope-scans()
  action()
  Cost(hidden-load(h.posts) - posts0,
       reentry-batch-count() - batches0,
       generation-async-supervisor-allocations() - supervisors0,
       generation-async-scope-scans() - scans0)

fun report(label : string, c : cost) : console ()
  println("cost " ++ label ++ ": " ++ c.show)

// 50 independent handlers each await one fetch-like completion; all 50
// complete inside the same host macrotask.
fun scenario-fan-in(h : host) : <ui,div,exn,console> cost
  val completions : ref<global,list<int -> ui ()>> = hidden([])
  val observed = hidden(0)
  val root = new-root()
  val c = measure(h,fn()
    list(1,50).foreach fn(_)
      start(root,h,fn()
        val value = setup/await-noexn("fan-in",fn(complete)
          hidden-store(completions,Cons(complete,hidden-load(completions)))
          fn() ()
        )
        hidden-store(observed,hidden-load(observed) + value)
      )
    hidden-load(completions).foreach fn(complete) complete(1)
    h.drain
  )
  check(hidden-load(observed) == 50,"every fan-in completion resumed")
  check(generation-async-outstanding() == 0,"fan-in released ownership")
  dispose-root(root)
  report("fan-in x50",c)
  c

// One handler performing three sequential awaits.
fun scenario-sequential(h : host) : <ui,div,exn,console> cost
  val completion : ref<global,maybe<int -> ui ()>> = hidden(Nothing)
  val observed : ref<global,list<int>> = hidden([])
  val root = new-root()
  fun step(label : string) : async int
    setup/await-noexn(label,fn(complete)
      hidden-store(completion,Just(complete))
      fn() ()
    )
  fun complete(value : int) : <ui,div,exn> ()
    match hidden-load(completion)
      Nothing -> throw("async runtime cost: no sequential completion")
      Just(resume) ->
        hidden-store(completion,Nothing)
        resume(value)
        h.drain
  val c = measure(h,fn()
    start(root,h,fn()
      val a = step("first")
      val b = step("second")
      val d = step("third")
      hidden-store(observed,[a,b,d])
    )
    complete(1)
    complete(2)
    complete(3)
  )
  check(hidden-load(observed) == [1,2,3],"sequential awaits resume in order")
  check(generation-async-outstanding() == 0,"sequential awaits release")
  dispose-root(root)
  report("sequential x3",c)
  c

// A race of two awaits where the right strand loses.
fun scenario-race(h : host) : <ui,div,exn,console> cost
  val winner : ref<global,maybe<int -> ui ()>> = hidden(Nothing)
  val loser-disposed = hidden(0)
  val loser-finalized = hidden(0)
  val observed = hidden(0)
  val root = new-root()
  val c = measure(h,fn()
    start(root,h,fn()
      with catch fn(_problem) ()
      val value = race(
        fn() setup/await-noexn("winner",fn(complete)
          hidden-store(winner,Just(complete))
          fn() ()
        ),
        fn() finally(
          fn() hidden-store(loser-finalized,hidden-load(loser-finalized) + 1),
          fn() setup/await-noexn("loser",fn(_complete)
            fn() hidden-store(loser-disposed,hidden-load(loser-disposed) + 1)
          )
        )
      )
      hidden-store(observed,value)
    )
    match hidden-load(winner)
      Nothing -> throw("async runtime cost: winner was not installed")
      Just(complete) -> complete(7)
    h.drain
  )
  check(hidden-load(observed) == 7,"race returns the winner")
  check(hidden-load(loser-disposed) == 1,"race disposes the loser once")
  check(hidden-load(loser-finalized) == 1,"race finalizes the loser once")
  check(generation-async-outstanding() == 0,"race releases ownership")
  dispose-root(root)
  report("race of 2",c)
  c

fun schedule-many(count : int, ran : ref<global,int>) : <async,div> ()
  if count <= 0 then () else
    async-schedule(fn() hidden-store(ran,hidden-load(ran) + 1))
    schedule-many(count - 1,ran)

// One handler scheduling 12,000 host actions.
fun scenario-schedule(h : host) : <ui,div,exn,console> cost
  val ran = hidden(0)
  val root = new-root()
  val c = measure(h,fn()
    start(root,h,fn() pretend-no-div{ schedule-many(12000,ran) })
    h.drain
  )
  check(hidden-load(ran) == 12000,"every scheduled action ran once")
  check(generation-async-outstanding() == 0,"scheduled actions release")
  dispose-root(root)
  report("schedule x12000",c)
  c

// The coalescer shares one host callback among turns accepted before its
// drain starts, preserves acceptance order, and gives a turn accepted during
// a drain its own later host callback (after host work queued meanwhile).
fun test-coalescer-order() : <ui,div,exn> ()
  val h = Host(hidden([]),hidden([]),hidden(0),hidden(Nothing))
  val coalescer = new-host-turn-coalescer(fn(action) h.post(action))
  val log : ref<global,list<string>> = hidden([])
  fun note(entry : string) : ui ()
    hidden-store(log,hidden-load(log) ++ [entry])
  val _ = coalescer.post(fn() {
    note("a")
    val _ = h.post(fn() note("host"))
    val _ = coalescer.post(fn() note("c"))
    ()
  })
  val _ = coalescer.post(fn() note("b"))
  check(hidden-load(h.posts) == 1,"two accepted turns share one host post")
  h.drain
  check(hidden-load(log) == ["a","b","host","c"],
        "drain keeps acceptance order and defers turns accepted mid-drain")
  check(hidden-load(h.posts) == 3,"a mid-drain turn posts a fresh drain")

  val closed = new-host-turn-coalescer(fn(_action) False)
  check(!closed.post(fn() note("rejected")),"rejection reaches the caller")
  check(!closed.post(fn() note("rejected")),"a rejected post leaves no drain")
  check(!hidden-load(log).any(fn(entry) entry == "rejected"),
        "a rejected turn never runs")

pub fun main()
  test-coalescer-order()
  val fan-in = scenario-fan-in(new-host())
  check(fan-in.posts == 1,"fan-in completions share one host callback")
  check(fan-in.batches == 50,"each fan-in completion keeps its own batch")
  val sequential = scenario-sequential(new-host())
  check(sequential.posts == 3 && sequential.batches == 3,
        "sequential awaits take one turn and batch each")
  val raced = scenario-race(new-host())
  check(raced.posts == 2,"a race settles in two coalesced host callbacks")
  val scheduled = scenario-schedule(new-host())
  check(scheduled.posts == 2,"12,000 scheduled actions need two host callbacks")
  check(scheduled.batches == 12000,"each scheduled action runs in its batch")
  println("async runtime cost: all checks passed")
