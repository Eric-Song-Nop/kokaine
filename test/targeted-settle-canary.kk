module targeted-settle-canary

import kokaine/reactive
import std/core/unsafe

fun hidden-cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun hidden-load(target : ref<global,a>) : a
  unsafe-total { !target }

fun hidden-store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

// This is the mutation gate. The observation occurs while batch depth is
// positive, so queue draining cannot accidentally make a cached read fresh.
// Removing the memo.get -> exact-producer-settle call must make this return 7
// instead of 21 and fail, even though batch exit later repairs the cache.
pub fun main()
  val observed = hidden-cell(-1)
  val runs = hidden-cell(0)
  val (root,(source,derived)) = create-root fn(root)
    val source = signal(root,1)
    val derived = derive(root,0,fn()
      val value = source.get
      hidden-store(runs,hidden-load(runs) + 1)
      value * 7
    )
    (source,derived)

  dispatch(root)
    batch(root)
      source.set(3)
      hidden-store(observed,derived.get)

  val value-at-get = hidden-load(observed)
  val runs-at-end = hidden-load(runs)
  root.dispose()
  if value-at-get != 21
  then throw("mutation survived: memo.get returned stale " ++ value-at-get.show)
  elif runs-at-end != 2
  then throw("target producer did not settle exactly once")
  else println("targeted-settle-canary: passed")
