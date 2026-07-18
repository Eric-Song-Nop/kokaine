module async-host-turn

import kokaine/reactive/async/internal/host-turn
import kokaine/reactive/internal/model
import kokaine/reactive/internal/runtime
import kokaine/reactive/internal/reentry
import std/core/unsafe


effect application-value
  fun application-value() : int

fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun hidden-load(value : ref<global,a>) : a
  unsafe-total { !value }

fun hidden-store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun check(ok : bool, message : string)
  if ok then () else throw("async host turn: " ++ message)

fun with-application(action : () -> <application-value,exn> a) : exn a
  with fun application-value() 41
  action()

fun require-reentry(slot : ref<global,maybe<reentry<<application-value>>>>)
                   : exn reentry<<application-value>>
  match hidden-load(slot)
    Nothing -> throw("async host turn: reentry was not captured")
    Just(value) -> value

fun test-runner-closes-the-complete-host-turn()
  val runner : host-turn-runner<<application-value,exn>,<exn>> =
    Host-turn-runner(with-application)
  val portal-slot : ref<global,maybe<reentry<<application-value>>>> =
    hidden(Nothing)
  val cleanups = hidden([])

  val built : (root<<application-value>>,signal<int>) = runner.run(fn()
    create-root fn(root)
      val generation = signal(root,0)
      val parent = create-effect(root,fn() generation.get,fn(_)
        hidden-store(portal-slot,Just(capture-reentry(root)))
        on-cleanup(root,fn()
          hidden-store(cleanups,
            hidden-load(cleanups) ++ [application-value()])
        )
      )
      generation
  )
  val (root,generation) = built
  val portal = require-reentry(portal-slot)

  runner.run(fn() run-reentry(portal,fn() generation.set(1)))
  check(hidden-load(cleanups) == [41],
        "replacement cleanup remains inside the application handler")

  runner.run(fn() root.dispose())
  check(hidden-load(cleanups) == [41,41],
        "root disposal can use the same host-turn boundary")

pub fun main()
  test-runner-closes-the-complete-host-turn()
  println("async host turn: all checks passed")
