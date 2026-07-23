module source-capture-registry

import kokaine/reactive/internal/model
import kokaine/reactive/internal/runtime
import kokaine/internal/registry
import kokaine/reactive/effects
import std/core/unsafe
import std/core/undiv


fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun hidden-load(value : ref<global,a>) : a
  unsafe-total { !value }

fun hidden-store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun check(ok : bool, message : string)
  if ok then () else throw("source capture registry: " ++ message)

fun capture-count(value : signal<a>) : int
  value.signal-source.source-captures.count

fun observe-reads(counter : ref<global,int>,
                  action : () -> <signal-read,pure> a)
                 : <signal-read,pure> a
  with override
    fun validate-derived(producer)
      validate-derived(producer)
    fun read-source(source,mode,producer)
      hidden-store(counter,hidden-load(counter) + 1)
      read-source(source,mode,producer)
  action()

tail fun create-effects(root : root<total>, source : signal<int>,
                        remaining : int, runs : ref<global,int>,
                        collected : list<disposer<total>>)
                       : <signal-write,pure,div> list<disposer<total>>
  if remaining <= 0 then collected else
    val stop = create-effect(root,fn() source.get,fn(_)
      hidden-store(runs,hidden-load(runs) + 1)
    )
    create-effects(root,source,remaining - 1,runs,Cons(stop,collected))

tail fun dispose-effects(values : list<disposer<total>>) : <div,exn> ()
  match values
    Nil -> ()
    Cons(dispose,rest) ->
      dispose()
      dispose-effects(rest)

fun test-source-captures-unlink-immediately()
  val runs = hidden(0)
  val size = 4096
  val (root,(source,stops)) = create-root fn(root)
    val source = signal(root,0)
    val stops = pretend-no-div{ create-effects(root,source,size,runs,[]) }
    (source,stops)

  check(source.capture-count == size,
        "every live tracked continuation has one registration")
  check(hidden-load(runs) == size,"every effect bootstrapped exactly once")

  pretend-no-div{ dispose-effects(stops) }
  check(source.capture-count == 0,
        "disposing continuations physically removes source registrations")

  update(root){ source.set(1) }
  check(hidden-load(runs) == size,
        "removed source registrations cannot resume retired continuations")
  root.dispose()

fun test-repeated-track-reads-capture-exact-suffixes()
  val observed = hidden(0)
  val seen = hidden([])
  val (root,(source,ignored,stop)) = create-root fn(root)
    val source = signal(root,1)
    val ignored = signal(root,10)
    val stop = create-effect(root,fn()
      val first = source.get
      val sampled = untrack{ ignored.get }
      val second = observe-reads(observed,fn() source.get)
      first + sampled + second
    ,fn(value) hidden-store(seen,Cons(value,hidden-load(seen))))
    (source,ignored,stop)

  check(source.capture-count == 2,
        "each repeated tracked read retains its exact continuation")
  check(ignored.capture-count == 0,
        "an untracked read retains no continuation registration")
  check(hidden-load(observed) == 1,
        "an inner read handler forwards the second tracked read")
  check(hidden-load(seen) == [12],"repeated reads initially publish")

  update(root){ ignored.set(20) }
  check(hidden-load(seen) == [12],
        "an untracked source cannot schedule the effect")
  update(root){ source.set(2) }
  check(source.capture-count == 2,
        "resumption rebuilds both exact continuation registrations")
  check(hidden-load(observed) == 2,
        "the inner read handler survives continuation resumption")
  check(hidden-load(seen) == [24,12],
        "resumption samples the latest untracked value")

  stop()
  check(source.capture-count == 0,
        "disposing the effect unlinks both registrations")
  root.dispose()

fun test-repeated-track-read-preserves-cross-root-check()
  val (foreign-root,foreign) = create-root fn(root)
    signal(root,10)
  val failed : error<()> = mask<exn>{
    error/try fn()
      val (local-root,_) = create-root fn(root)
        val local = signal(root,1)
        val stop = create-effect(root,fn()
          local.get + local.get + foreign.get
        ,fn(_) ())
        ()
      local-root.dispose()
  }
  check(failed.is-error,
        "a repeated tracked suffix still validates the foreign source root")
  foreign-root.dispose()

fun test-outer-untrack-keeps-repeated-reads-untracked()
  val seen = hidden([])
  val (root,(source,stop)) = create-root fn(root)
    val source = signal(root,1)
    val stop = create-effect(root,fn()
      untrack{
        source.get + source.get
      }
    ,fn(value) hidden-store(seen,Cons(value,hidden-load(seen))))
    (source,stop)

  check(source.capture-count == 0,
        "an outer untrack prevents repeated reads from registering")
  update(root){ source.set(2) }
  check(hidden-load(seen) == [2],
        "an outer untrack prevents repeated reads from scheduling")
  stop()
  root.dispose()

pub fun main()
  test-source-captures-unlink-immediately()
  test-repeated-track-reads-capture-exact-suffixes()
  test-repeated-track-read-preserves-cross-root-check()
  test-outer-untrack-keeps-repeated-reads-untracked()
  println("source-capture-registry: all checks passed")
