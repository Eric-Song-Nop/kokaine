module integration-boundaries

import kokaine/reactive
import kokaine/reactive/integration
import std/core/undiv
import std/core/unsafe


fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun hidden-load(value : ref<global,a>) : a
  unsafe-total { !value }

fun hidden-store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun increment(target : ref<global,int>) : ()
  hidden-store(target,hidden-load(target) + 1)

fun emit(events : ref<global,list<string>>, event : string) : ()
  hidden-store(events,hidden-load(events) ++ [event])

fun check(ok : bool, message : string) : exn ()
  if ok then () else throw("integration boundaries: " ++ message)

fun test-stable-owner-uses-independent-lifetime()
  val runs = hidden(0)
  val cleanups = hidden(0)
  val (root,(owner,source)) = create-root fn(root)
    val source = signal(root,0)
    val owner = internal/open-structural-owner(root)
    internal/with-structural-owner(root,owner,fn()
      on-cleanup(root,fn() increment(cleanups))
      val stop = create-effect(root,fn() source.get,fn(_) increment(runs))
      ()
    )
    (owner,source)

  check(hidden-load(runs) == 1,"owner bootstraps its child")
  update(root){ source.set(1) }
  check(hidden-load(runs) == 2,"owner remains reactive")
  internal/dispose-structural-owner(owner)
  internal/dispose-structural-owner(owner)
  check(hidden-load(cleanups) == 1,"owner disposal is idempotent")
  update(root){ source.set(2) }
  check(hidden-load(runs) == 2,"retired owner no longer observes sources")
  root.dispose()

fun test-current-provision-borrows_the_outer_fifo()
  val events = hidden([])
  val (root,(outer,joined)) = create-root fn(root)
    val outer = open-provision(root)
    val joined = match current-provision(root)
      Nothing -> throw("active provision disappeared")
      Just(current) -> current
    val first = create-effect(root,fn() (),fn(_)
      emit(events,"outer")
    )
    val second = create-effect(root,fn() (),fn(_)
      emit(events,"inner")
    )
    (outer,joined)

  check(hidden-load(events).is-nil,
        "an open provision isolates bootstrap work")
  check(outer.provision.same(joined),
        "current provision borrows the exact outer frontier")
  pretend-no-div{ drain-provision(outer) }
  check(hidden-load(events) == ["outer","inner"],
        "borrowed construction leaves work in the outer FIFO drain")
  pretend-no-div{ promote-provision(outer) }
  root.dispose()

fun test-second-open-cannot-steal_the_outer_lease()
  val events = hidden([])
  val (root,(outer,rejected)) = create-root fn(root)
    val outer = open-provision(root)
    val rejected = mask<exn>{
      error/try(fn() open-provision(root))
    }.is-error
    val stop = create-effect(root,fn() (),fn(_) emit(events,"committed"))
    (outer,rejected)

  check(rejected,"a second owner cannot open while a provision is active")
  pretend-no-div{ drain-provision(outer) }
  pretend-no-div{ promote-provision(outer) }
  check(hidden-load(events) == ["committed"],
        "a rejected second owner cannot disturb the outer lease")
  root.dispose()

fun test_joined_outer_abort_retires_successful_prefix()
  val runs = hidden(0)
  val cleanups = hidden(0)
  val (root,outer) = create-root fn(root)
    val outer = open-provision(root)
    val bootstrap = create-effect(root,fn() (),fn(_)
      val joined = current-provision(root)
      val first = create-effect(root,fn() (),fn(_)
        increment(runs)
        on-cleanup(root,fn() increment(cleanups))
      )
      val failing = create-effect(root,fn() (),fn(_)
        throw("joined child bootstrap failed")
      )
      ()
    )
    outer

  val attempted : error<()> = mask<exn>{
    error/try fn()
      pretend-no-div{ drain-provision(outer) }
  }
  check(attempted.is-error,
        "a later joined child failure rejects the outer drain")
  discard-provision(outer)
  check(hidden-load(runs) == 1,
        "the successful joined child ran before the later failure")
  check(hidden-load(cleanups) == 1,
        "outer abort retires the successful joined child without leaking")
  root.dispose()

fun test-discarded-provision-rejects-promotion()
  val (root,lease) = create-root fn(root)
    open-provision(root)

  discard-provision(lease)
  val attempted : error<()> = mask<exn>{
    error/try fn()
      pretend-no-div{ promote-provision(lease) }
  }

  check(attempted.is-error,"a discarded provision rejects promotion")
  root.dispose()

pub fun main()
  test-stable-owner-uses-independent-lifetime()
  test-current-provision-borrows_the_outer_fifo()
  test-second-open-cannot-steal_the_outer_lease()
  test_joined_outer_abort_retires_successful_prefix()
  test-discarded-provision-rejects-promotion()
  println("integration boundaries: lifetime and provision contracts passed")
