module structural-owners

import kokaine/reactive
import std/core/undiv
import std/core/unsafe


fun cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a)
  unsafe-total { target := value }

fun increment(target : ref<global,int>)
  store(target,load(target) + 1)

fun emit(target : ref<global,list<string>>, value : string)
  store(target,load(target) ++ [value])

fun assert-int(actual : int, expected : int, label : string)
  if actual == expected then () else
    throw(label ++ " expected=" ++ expected.show ++ " actual=" ++ actual.show)

fun assert-events(actual : list<string>, expected : list<string>, label : string)
  if actual == expected then () else
    throw(label ++ " expected=" ++ expected.show ++ " actual=" ++ actual.show)

fun assert(ok : bool, label : string)
  if ok then () else throw("assertion failed: " ++ label)

fun bootstrap-total(owner : structural-owner<total>) : error<()>
  error/try fn()
    pretend-no-div{
      internal/bootstrap-structural-owner(owner)
    }

fun register-bootstrap-order(root : root<total>,
                             events : ref<global,list<string>>,
                             targeted : bool)
                            : <signal-write,div,exn> ()
  val owner = internal/open-structural-owner(root)
  internal/with-structural-owner(root,owner,fn()
    val stop-a = create-effect(root,fn() (),fn(_)
      emit(events,"A")
      val stop-c = create-effect(root,fn() (),fn(_) emit(events,"C"))
      ()
    )
    val stop-b = create-effect(root,fn() (),fn(_) emit(events,"B"))
    val attempted = if targeted then bootstrap-total(owner) else Ok(())
    attempted.untry
    batch(root){ () }
  )

fun run-bootstrap-order(targeted : bool) : exn list<string>
  val events = cell([])
  val (root,attempted) : (root<total>,error<()>) = create-root fn(root)
    error/try fn()
      pretend-no-div{
        register-bootstrap-order(root,events,targeted)
      }
  attempted.untry
  val result = load(events)
  root.dispose()
  result

fun test-targeted-bootstrap-preserves-fifo()
  val scheduled = run-bootstrap-order(False)
  val targeted = run-bootstrap-order(True)
  assert-events(scheduled,["A","B","C"],"ordinary scheduler is FIFO")
  assert-events(targeted,scheduled,
    "targeted structural bootstrap matches scheduler FIFO")

pub fun main()
  val row-runs = cell(0)
  val row-owner-cleanups = cell(0)
  val observer-cleanups = cell(0)
  val nested-cleanups = cell(0)

  val (root,(_,row-owner,item,epoch)) = create-root fn(root)
    val item = signal(root,0)
    val epoch = signal(root,0)
    val for-owner = internal/open-structural-owner(root)
    val row-owner = internal/with-structural-owner(root,for-owner,fn()
      internal/open-structural-owner(root)
    )

    internal/with-structural-owner(root,row-owner,fn()
      on-cleanup(root,fn() increment(row-owner-cleanups))
      val stop = create-effect(root,fn() item.get,fn(_)
        increment(row-runs)
      )
      ()
    )

    // This observer replaces its ordinary continuation generation on every
    // epoch.  The sibling row owner must remain live across those replacements.
    internal/with-structural-owner(root,for-owner,fn()
      val stop = create-effect(root,fn() epoch.get,fn(_)
        on-cleanup(root,fn() increment(observer-cleanups))
      )
      val nested = internal/open-structural-owner(root)
      internal/with-structural-owner(root,nested,fn()
        on-cleanup(root,fn() increment(nested-cleanups))
      )
      ()
    )

    (for-owner,row-owner,item,epoch)

  load(row-runs).assert-int(1,"row effect bootstraps once")
  load(row-owner-cleanups).assert-int(0,"row owner starts live")

  update(root){ epoch.set(1) }
  load(observer-cleanups).assert-int(
    1,"observer generation cleanup runs on replacement")
  load(row-owner-cleanups).assert-int(
    0,"stable row owner survives observer replacement")

  update(root){ item.set(1) }
  load(row-runs).assert-int(2,"row effect remains reactive after replacement")

  internal/dispose-structural-owner(row-owner)
  internal/dispose-structural-owner(row-owner)
  load(row-owner-cleanups).assert-int(1,"explicit owner disposal is idempotent")
  update(root){ item.set(2) }
  load(row-runs).assert-int(2,"disposed row no longer observes its source")

  val stale-registration : error<()> = error/try fn()
    internal/with-structural-owner(root,row-owner,fn() ())
  assert(stale-registration.is-error,
         "retired owners reject structural registration")

  root.dispose()
  load(nested-cleanups).assert-int(1,"root disposal recursively retires owners")
  load(observer-cleanups).assert-int(
    2,"root disposal finalizes the current observer generation exactly once")

  val pure-registration : error<()> = error/try fn()
    val (_,_) = create-root fn(bad-root)
      val source = signal(bad-root,0)
      val invalid = derive(bad-root,0,fn()
        val _ = source.get
        val owner = internal/open-structural-owner(bad-root)
        1
      )
      ()
    ()
  assert(pure-registration.is-error,
         "pure derivations reject hidden structural owner creation")

  test-targeted-bootstrap-preserves-fifo()

  println("structural-owners: persistence, recursion, staleness, and purity passed")
