module resume-transaction-regression

import kokaine/reactive/internal/model
import kokaine/reactive/internal/runtime
import kokaine/reactive/internal/work-transaction
import kokaine/reactive/effects
import kokaine/internal/registry
import std/core/unsafe

effect ctl abandon-root-cleanup() : ()
effect ctl abandon-self-publication() : ()

fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load-hidden(value : ref<global,a>) : a
  unsafe-total { !value }

fun store-hidden(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun push(target : ref<global,list<int>>, value : int) : ()
  store-hidden(target,Cons(value,load-hidden(target)))

fun check(ok : bool, label : string)
  if ok then () else throw("resume transaction: " ++ label)

fun succeeds(action : () -> exn ()) : bool
  with catch fn(_) False
  action()
  True

fun completes-root-cleanup(
    action : () -> <abandon-root-cleanup,exn> bool) : exn bool
  with final ctl abandon-root-cleanup() False
  action()

fun require-root-cleanup(
    action : () -> <abandon-root-cleanup,exn> a) : exn a
  with final ctl abandon-root-cleanup()
    throw("unexpected root-cleanup abandonment")
  action()

fun completes-self-publication(
    action : () -> <abandon-self-publication,exn> bool) : exn bool
  with final ctl abandon-self-publication() False
  action()

fun require-self-publication(
    action : () -> <abandon-self-publication,exn> a) : exn a
  with final ctl abandon-self-publication()
    throw("unexpected self-publication abandonment")
  action()

fun test-publication-failure-restores-the-same-ticket()
  val fail-once = hidden(True)
  val seen = hidden([])
  val (root,(source,stop)) = create-root fn(root)
    val source = signal(root,0)
    val stop = create-effect(root,fn() source.get,fn(value)
      if value == 1 && load-hidden(fail-once) then
        store-hidden(fail-once,False)
        throw("publication failed")
      else push(seen,value)
    )
    (source,stop)

  check(!succeeds(fn() update(root){ source.set(1) }),
        "publication failure must escape its update")
  check(succeeds(fn() update(root){ source.set(1) }),
        "an equal update must retry the retained ticket")
  check(load-hidden(seen) == [1,0],
        "retry publishes exactly once without replaying bootstrap")
  stop()
  root.dispose()

fun test-self-write-reruns-once()
  val seen = hidden([])
  val (root,(source,stop)) = create-root fn(root)
    val source = signal(root,0)
    val stop = create-effect(root,fn() source.get,fn(value)
      push(seen,value)
      if value == 1 then source.set(2) else ()
    )
    (source,stop)

  update(root){ source.set(1) }
  check(load-hidden(seen) == [2,1,0],
        "self-write reruns the pending continuation exactly once")
  stop()
  root.dispose()

fun test-root-disposal-cannot-restore-an-abandoned-ticket()
  val (root,source) : (root<<abandon-root-cleanup>>,signal<int>) =
    require-root-cleanup fn()
      create-root fn(root : root<<abandon-root-cleanup>>)
        val source = signal(root,0)
        val stop = create-effect(root,fn() source.get,fn(value)
          on-cleanup(root,fn() mask<signal-write>{
            lift-div(fn() {
              if value == 0 then
                root.dispose()
                abandon-root-cleanup()
              else ()
            })
          })
        )
        source

  val completed = completes-root-cleanup fn()
    update(root){ source.set(1) }
    True
  check(!completed,
        "old-generation cleanup abandons the host update")
  check(root.is-disposed,
        "cleanup-requested root disposal completes during retirement")
  check(load-hidden(root.root-effect-plane.plane-current).is-nothing,
        "root disposal leaves the effect continuation slot cleared")
  check(load-hidden(root.root-effect-plane.plane-draft).is-nothing,
        "root disposal leaves the effect draft slot cleared")
  check(root.root-effect-plane.plane-queue.values.length == 0,
        "rollback cannot requeue a ticket after its gate is dead")

fun test-self-dispose-final-control-retires-every-draft-read()
  val runs = hidden(0)
  val cleanups = hidden(0)
  val stop-slot : ref<global,maybe<disposer<<abandon-self-publication>>>> =
    hidden(Nothing)
  val (root,(source,stop)) : (root<<abandon-self-publication>>,
    (signal<int>,disposer<<abandon-self-publication>>)) =
    require-self-publication fn()
      create-root fn(root : root<<abandon-self-publication>>)
        val source = signal(root,0)
        val stop = create-effect(root,fn()
          val first = source.get
          val second = source.get
          first + second
        ,fn(value)
          store-hidden(runs,load-hidden(runs) + 1)
          on-cleanup(root,fn()
            store-hidden(cleanups,load-hidden(cleanups) + 1)
          )
          if value == 2 then
            match load-hidden(stop-slot)
              Nothing -> throw("self disposer was not installed")
              Just(dispose) ->
                dispose()
                abandon-self-publication()
          else ()
        )
        (source,stop)
  store-hidden(stop-slot,Just(stop))

  check(source.signal-source.source-captures.count == 2,
        "bootstrap retains both tracked reads")
  val completed = completes-self-publication fn()
    update(root){ source.set(1) }
    True
  check(!completed,
        "self disposal final control abandons replacement publication")
  check(load-hidden(runs) == 2,
        "abandoned publication runs exactly once")
  check(load-hidden(cleanups) == 2,
        "old and abandoned generations each clean up exactly once")
  check(source.signal-source.source-captures.count == 0,
        "rollback unlinks both unpublished tracked reads")
  check(root.root-effect-plane.plane-queue.values.length == 2,
        "final control preserves both invalidated tickets until the next drain")

  require-self-publication fn() update(root){ source.set(2) }
  check(load-hidden(runs) == 2,
        "later updates cannot resume a self-disposed continuation")
  check(root.root-effect-plane.plane-queue.values.length == 0,
        "the next drain discards the retained dead ticket")
  require-self-publication fn() root.dispose()

pub fun main()
  test-publication-failure-restores-the-same-ticket()
  test-self-write-reruns-once()
  test-root-disposal-cannot-restore-an-abandoned-ticket()
  test-self-dispose-final-control-retires-every-draft-read()
  println("resume-transaction-regression: all checks passed")
