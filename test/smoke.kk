module smoke

import kokaine/reactive

fun assert-eq(actual : int, expected : int, label : string)
  if actual == expected then ()
  else throw(label ++ ": expected " ++ expected.show ++ ", got " ++ actual.show)

pub fun main()
  val seen : ref<global,list<int>> = ref([])
  val (root,(count,doubled)) = create-root fn(root)
    val count = signal(root,0)
    val doubled = derive(root,0,fn() count.get * 2)
    val disposer = create-effect(root,fn() doubled.get,fn(value)
      seen := Cons(value,!seen)
    )
    (count,doubled)

  (!seen).head.default(-1).assert-eq(0,"initial effect")

  update(root)
    count.set(2)
  (!seen).head.default(-1).assert-eq(4,"updated effect")

  update(root)
    batch(root)
      count.set(3)
      count.set(4)
  (!seen).head.default(-1).assert-eq(8,"batched effect")
  sample(root){ doubled.get }.assert-eq(8,"sampled memo")
  root.dispose()
  println("smoke: ok")
