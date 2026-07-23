module integration-event

import kokaine/reactive
import kokaine/reactive/integration/event
import std/core/unsafe


fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun check(ok : bool, label : string)
  if ok then () else throw("FAILED: " ++ label)

pub fun main()
  val seen = hidden([])
  val (root,()) : (root<<ui>>,()) = create-root fn(_) ()
  val inner : event-continuation<total,int> = dispatch(root,fn()
    capture-event fn(value : int)
      store(seen,Cons("inner:" ++ value.show,load(seen)))
  )
  val outer : event-continuation<total,string> = dispatch(root,fn()
    capture-event fn(value : string)
      store(seen,Cons("outer:" ++ value,load(seen)))
      val delivered = inner.resume(value.count)
      if delivered then () else throw("nested event was unexpectedly retired")
  )

  check(dispatch(root){ outer.resume("abc") },
        "typed outer event resumes")
  check(load(seen) == ["inner:3","outer:abc"],
        "nested host delivery remains synchronous")

  inner.close
  check(!inner.is-live,"close revokes the continuation")
  check(!dispatch(root){ inner.resume(10) },
        "retired continuation rejects later delivery")
  check(load(seen) == ["inner:3","outer:abc"],
        "retired delivery does not enter user code")
  root.dispose()
