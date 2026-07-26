module publication-effect

import kokaine/reactive
import kokaine/reactive/integration
import std/core/unsafe
import std/core/undiv

fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun check(ok : bool, message : string) : exn ()
  if ok then () else throw("publication effect: " ++ message)

fun run() : <ui,exn> ()
  val seen = hidden([])
  val reject-write = hidden(False)
  val (root,(source,other))
      : (root<<ui>>,(signal<int>,signal<int>)) = create-root fn(root)
    val source = signal(root,0)
    val other = signal(root,10)
    val stop = create-ui-publication-effect(root,fn() source.get,fn(value)
      store(seen,Cons(value,load(seen)))
      // The closed row excludes direct signal-write. A nested public update
      // hides its write statically, so the dynamic guard remains authoritative.
      if load(reject-write) then update(root){ other.set(99) } else ()
    )
    (source,other)

  check(load(seen) == [0],"initial publication runs exactly once")
  store(reject-write,True)
  val rejected : error<()> = mask<exn>{
    error/try fn() update(root){ source.set(1) }
  }
  check(rejected.is-error,
        "a signal write absorbed by the open row is rejected")
  check(sample(root){ other.get } == 10,
        "a rejected publication cannot mutate reactive state")

  store(reject-write,False)
  update(root){ source.set(2) }
  check(load(seen) == [2,1,0],
        "independent publications preserve their exact generations")
  update(root){ other.set(11) }
  check(sample(root){ other.get } == 11,
        "the dynamic read-only guard is restored after failure")
  root.dispose()

fun main()
  run()
  println("publication effect: all checks passed")
