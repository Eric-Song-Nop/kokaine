module structural-transactions

import kokaine/reactive
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
  if ok then () else throw("structural transaction: " ++ message)

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

fun test-nested-transaction-borrows_the_outer_fifo()
  val events = hidden([])
  val (root,(outer,joined)) = create-root fn(root)
    val outer = internal/open-structural-transaction(root)
    val joined = internal/open-structural-transaction(root)
    val first = create-effect(root,fn() (),fn(_)
      emit(events,"outer")
    )
    val second = create-effect(root,fn() (),fn(_)
      emit(events,"inner")
    )
    (outer,joined)

  check(hidden-load(events).is-nil,
        "an open transaction isolates bootstrap work")
  pretend-no-div{ internal/drain-structural-transaction(joined) }
  pretend-no-div{ internal/commit-structural-transaction(joined) }
  pretend-no-div{ internal/drain-structural-transaction(outer) }
  check(hidden-load(events) == ["outer","inner"],
        "a nested lease leaves work in the outer FIFO drain")
  pretend-no-div{ internal/commit-structural-transaction(outer) }
  root.dispose()

fun test_joined_abort_does_not_steal_the_outer_lease()
  val events = hidden([])
  val (root,(outer,joined)) = create-root fn(root)
    val outer = internal/open-structural-transaction(root)
    val joined = internal/open-structural-transaction(root)
    val stop = create-effect(root,fn() (),fn(_) emit(events,"committed"))
    (outer,joined)

  internal/abort-structural-transaction(joined)
  pretend-no-div{ internal/drain-structural-transaction(outer) }
  pretend-no-div{ internal/commit-structural-transaction(outer) }
  check(hidden-load(events) == ["committed"],
        "only the outer lease owns commit or abort")
  root.dispose()

fun test_joined_outer_abort_retires_successful_prefix()
  val runs = hidden(0)
  val cleanups = hidden(0)
  val (root,outer) = create-root fn(root)
    val outer = internal/open-structural-transaction(root)
    val bootstrap = create-effect(root,fn() (),fn(_)
      val joined = internal/open-structural-transaction(root)
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
      pretend-no-div{ internal/drain-structural-transaction(outer) }
  }
  check(attempted.is-error,
        "a later joined child failure rejects the outer drain")
  internal/abort-structural-transaction(outer)
  check(hidden-load(runs) == 1,
        "the successful joined child ran before the later failure")
  check(hidden-load(cleanups) == 1,
        "outer abort retires the successful joined child without leaking")
  root.dispose()

fun test-terminal-transaction-rejects-commit()
  val (root,transaction) = create-root fn(root)
    internal/open-structural-transaction(root)

  internal/abort-structural-transaction(transaction)
  val attempted : error<()> = mask<exn>{
    error/try fn()
      pretend-no-div{ internal/commit-structural-transaction(transaction) }
  }

  check(attempted.is-error,"a terminal transaction rejects commit")
  root.dispose()

pub fun main()
  test-stable-owner-uses-independent-lifetime()
  test-nested-transaction-borrows_the_outer_fifo()
  test_joined_abort_does_not_steal_the_outer_lease()
  test_joined_outer_abort_retires_successful_prefix()
  test-terminal-transaction-rejects-commit()
  println("structural transactions: lifetime and joined-drain contracts passed")
