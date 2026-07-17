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
  internal/commit-structural-transaction(joined)
  pretend-no-div{ internal/drain-structural-transaction(outer) }
  check(hidden-load(events) == ["outer","inner"],
        "a nested lease leaves work in the outer FIFO drain")
  internal/commit-structural-transaction(outer)
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
  internal/commit-structural-transaction(outer)
  check(hidden-load(events) == ["committed"],
        "only the outer lease owns commit or abort")
  root.dispose()

fun test_joined_publication_waits_for_outer_commit()
  val prepared = hidden(0)
  val published = hidden(False)
  val rolled-back = hidden(0)
  val (root,outer) = create-root fn(root)
    val outer = internal/open-structural-transaction(root)
    val bootstrap = create-effect(root,fn() (),fn(_)
      val joined = internal/open-structural-transaction(root)
      internal/stage-structural-publication(
        joined,
        fn() increment(prepared),
        fn() hidden-store(published,True),
        fn() increment(rolled-back)
      )
    )
    outer

  pretend-no-div{ internal/drain-structural-transaction(outer) }
  check(hidden-load(prepared) == 0,
        "joined publication is not prepared during the outer drain")
  check(!hidden-load(published),
        "joined publication remains private before the outer commit")
  internal/commit-structural-transaction(outer)
  check(hidden-load(prepared) == 1,
        "outer commit prepares each joined publication once")
  check(hidden-load(published),
        "outer commit publishes the joined adapter")
  check(hidden-load(rolled-back) == 0,
        "a committed joined publication is never rolled back")
  root.dispose()

fun test_joined_outer_abort_rolls_back_without_publication()
  val runs = hidden(0)
  val cleanups = hidden(0)
  val prepared = hidden(0)
  val published = hidden(False)
  val rolled-back = hidden(0)
  val (root,outer) = create-root fn(root)
    val outer = internal/open-structural-transaction(root)
    val bootstrap = create-effect(root,fn() (),fn(_)
      val joined = internal/open-structural-transaction(root)
      internal/stage-structural-publication(
        joined,
        fn() increment(prepared),
        fn() hidden-store(published,True),
        fn() increment(rolled-back)
      )
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

  val attempted : error<()> = error/try fn()
    pretend-no-div{ internal/drain-structural-transaction(outer) }
  check(attempted.is-error,
        "a later joined child failure rejects the outer drain")
  internal/abort-structural-transaction(outer)
  check(hidden-load(prepared) == 0,
        "an aborted outer transaction never prepares publication")
  check(!hidden-load(published),
        "an aborted outer transaction never publishes joined state")
  check(hidden-load(rolled-back) == 1,
        "outer abort rolls back the enlisted adapter exactly once")
  check(hidden-load(runs) == 1,
        "the successful joined child ran before the later failure")
  check(hidden-load(cleanups) == 1,
        "outer abort retires the successful joined child without leaking")
  root.dispose()

fun test-failed-outer-commit-cannot-reach-publication()
  val published = hidden(False)
  val (root,transaction) = create-root fn(root)
    internal/open-structural-transaction(root)

  internal/abort-structural-transaction(transaction)
  val attempted : error<()> = error/try fn()
    internal/commit-structural-transaction(transaction)
    hidden-store(published,True)

  check(attempted.is-error,"a terminal transaction rejects commit")
  check(!hidden-load(published),
        "failed commit cannot enter the irreversible publication suffix")
  root.dispose()

pub fun main()
  test-stable-owner-uses-independent-lifetime()
  test-nested-transaction-borrows_the_outer_fifo()
  test_joined_abort_does_not_steal_the_outer_lease()
  test_joined_publication_waits_for_outer_commit()
  test_joined_outer_abort_rolls_back_without_publication()
  test-failed-outer-commit-cannot-reach-publication()
  println("structural transactions: lifetime and joined-drain contracts passed")
