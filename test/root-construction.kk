module root-construction

import kokaine/reactive
import std/core/unsafe

effect ctl abandon-construction() : ()

fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a)
  unsafe-total { target := value }

fun bump(target : ref<global,int>)
  store(target,load(target) + 1)

fun check(ok : bool, message : string)
  if ok then () else throw("root construction: " ++ message)

val action-root : ref<global,maybe<root<total>>> = hidden(Nothing)
val action-tracks = hidden(0)
val action-applies = hidden(0)
val action-root-cleanups = hidden(0)

fun fail-action() : exn ()
  val _ : (root<total>,()) = create-root fn(root)
    store(action-root,Just(root))
    on-cleanup(root,fn() bump(action-root-cleanups))
    val stop = create-effect(root,fn()
      bump(action-tracks)
      0
    ,fn(_) bump(action-applies))
    throw("action sentinel")
  ()

val startup-root : ref<global,maybe<root<total>>> = hidden(Nothing)
val good-runs = hidden(0)
val good-cleanups = hidden(0)
val bad-runs = hidden(0)
val bad-cleanups = hidden(0)
val later-runs = hidden(0)

fun fail-startup() : exn ()
  val _ : (root<total>,()) = create-root fn(root)
    store(startup-root,Just(root))
    val good = create-effect(root,fn() 0,fn(_)
      bump(good-runs)
      on-cleanup(root,fn() bump(good-cleanups))
    )
    val bad = create-effect(root,fn() 0,fn(_)
      bump(bad-runs)
      on-cleanup(root,fn() bump(bad-cleanups))
      throw("startup sentinel")
    )
    val later = create-effect(root,fn() 0,fn(_) bump(later-runs))
    ()
  ()

val final-root : ref<global,maybe<root<<abandon-construction>>>> = hidden(Nothing)
val final-runs = hidden(0)
val final-cleanups = hidden(0)

fun completes-construction(
       action : () -> <abandon-construction,pure|e> bool)
     : <pure|e> bool
  with final ctl abandon-construction() False
  action()

fun abandon-action() : <abandon-construction,exn> bool
  val _ : (root<<abandon-construction>>,()) = create-root fn(root)
    store(final-root,Just(root))
    on-cleanup(root,fn() bump(final-cleanups))
    val stop = create-effect(root,fn() 0,fn(_) bump(final-runs))
    abandon-construction()
    ()
  True

fun check-disposed(slot : ref<global,maybe<root<e>>>, message : string)
  match load(slot)
    Nothing -> throw("missing side-channel root: " ++ message)
    Just(root) -> check(root.is-disposed,message)

fun main()
  val action-failure : error<()> = mask<exn>{
    error/try(fn() fail-action())
  }
  match action-failure
    Ok(_) -> throw("action exception did not escape")
    Error(problem) ->
      check(problem.show == "action sentinel","action exception was replaced")
  check(load(action-tracks) == 0,"failed action started effect tracking")
  check(load(action-applies) == 0,"failed action applied effect")
  check(load(action-root-cleanups) == 1,"failed action root cleanup count")
  check-disposed(action-root,"failed action root remained live")

  val startup-failure : error<()> = mask<exn>{
    error/try(fn() fail-startup())
  }
  match startup-failure
    Ok(_) -> throw("startup exception did not escape")
    Error(problem) ->
      check(problem.show == "startup sentinel","startup exception was replaced")
  check(load(good-runs) == 1 && load(good-cleanups) == 1,
        "successful startup sibling leaked")
  check(load(bad-runs) == 1 && load(bad-cleanups) == 1,
        "failed startup scope cleanup count")
  check(load(later-runs) == 0,"work after failed startup ran")
  check-disposed(startup-root,"failed startup root remained live")

  val final-result : error<bool> = mask<exn>{
    error/try(fn() completes-construction(fn() abandon-action()))
  }
  match final-result
    Error(problem) -> throw-exn(problem.prepend("final-control: "))
    Ok(completed) -> check(!completed,"final control returned normally")
  check(load(final-runs) == 0,"final control started queued effect")
  check(load(final-cleanups) == 1,"final control cleanup count")
  check-disposed(final-root,"final-control root remained live")

  println("root-construction: all checks passed")
