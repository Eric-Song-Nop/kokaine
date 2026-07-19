module derived-structural

import kokaine/reactive
import std/core/unsafe

fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun bump(target : ref<global,int>) : ()
  store(target,load(target) + 1)

fun emit(target : ref<global,list<string>>, value : string) : ()
  store(target,load(target) ++ [value])

fun check(ok : bool, label : string)
  if ok then println("ok: " ++ label)
  else throw("FAILED: " ++ label)

fun check-int(actual : int, expected : int, label : string)
  check(actual == expected,
        label ++ " expected=" ++ expected.show ++ " actual=" ++ actual.show)

fun check-events(actual : list<string>, expected : list<string>, label : string)
  check(actual == expected,
        label ++ " expected=" ++ expected.show ++ " actual=" ++ actual.show)

fun test-derived-equality-and-structural-barrier()
  val derived-runs = hidden(0)
  val events = hidden([])

  val (root,(input,payload,stop)) = create-root fn(root)
    val input = signal(root,1)
    val payload = signal(root,10)
    val parity = derive(root,0,fn()
      val current = input.get
      bump(derived-runs)
      current % 2
    )
    val stop = create-effect(root,fn() parity.get,fn(value)
      emit(events,"parent:" ++ value.show)
      on-cleanup(root,fn() emit(events,"parent-clean:" ++ value.show))
      val child = create-effect(root,fn() payload.get,fn(current)
        emit(events,"child:" ++ value.show ++ ":" ++ current.show)
        on-cleanup(root,fn() emit(events,"child-clean:" ++ value.show))
      )
      ()
    )
    (input,payload,stop)

  load(derived-runs).check-int(1,"derived value bootstraps once")
  load(events).check-events(["parent:1","child:1:10"],
    "downstream structural scopes bootstrap after the derived value")

  update(root){ input.set(3) }
  load(derived-runs).check-int(2,"equal derived result still calculates")
  load(events).check-events(["parent:1","child:1:10"],
    "derived equality cuts off the downstream structural branch")

  update(root){ payload.set(11) }
  load(derived-runs).check-int(2,
    "child dependency does not target an ancestor derived value")
  load(events).check-events(
    ["parent:1","child:1:10","child-clean:1","child:1:11"],
    "child dependency resumes only its generation-local continuation")

  update(root){ input.set(2) }
  load(derived-runs).check-int(3,"changed derived result resumes one branch")
  load(events).check-events(
    ["parent:1","child:1:10","child-clean:1","child:1:11",
     "child-clean:1","parent-clean:1","parent:0","child:0:11"],
    "derived commit replaces the downstream structural generation")

  stop()
  root.dispose()

pub fun main()
  test-derived-equality-and-structural-barrier()
  println("derived-structural: all checks passed")
