module source-capture-registry

import kokaine/reactive/internal/model
import kokaine/reactive/internal/runtime
import kokaine/reactive/internal/registry
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

pub fun main()
  test-source-captures-unlink-immediately()
  println("source-capture-registry: all checks passed")
