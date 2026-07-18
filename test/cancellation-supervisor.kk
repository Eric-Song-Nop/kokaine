module cancellation-supervisor

import kokaine/async/internal/cancellation-supervisor
import std/core/unsafe
import std/core/undiv


fun check(ok : bool, message : string)
  if ok then () else throw("cancellation supervisor: " ++ message)

fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun hidden-load(value : ref<global,a>) : a
  unsafe-total { !value }

fun hidden-store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

tail fun register-many(supervisor : cancellation-supervisor<int>,
                       remaining : int,
                       registrations : list<cancellation-registration<int>>)
                      : <div,exn> list<cancellation-registration<int>>
  if remaining <= 0 then registrations else
    val registration = supervisor.register(fn() Just(remaining))
    register-many(supervisor,remaining - 1,Cons(registration,registrations))

tail fun unregister-many(registrations : list<cancellation-registration<int>>)
                        : <div,exn> ()
  match registrations
    Nil -> ()
    Cons(registration,rest) ->
      check(registration.unregister,"every live registration unlinks once")
      unregister-many(rest)

fun test-cancel-claims-the-complete-snapshot-first()
  val supervisor = new-cancellation-supervisor()
  val claims = hidden(0)
  val events = hidden([])
  val older = supervisor.register(fn()
    hidden-store(claims,hidden-load(claims) + 1)
    Just(fn()
      check(hidden-load(claims) == 2,
            "every task is claimed before the first action")
      hidden-store(events,hidden-load(events) ++ ["older"])
    )
  )
  val newer = supervisor.register(fn()
    hidden-store(claims,hidden-load(claims) + 1)
    Just(fn()
      check(hidden-load(claims) == 2,
            "a reentrant action cannot beat an unclaimed sibling")
      hidden-store(events,hidden-load(events) ++ ["newer"])
    )
  )
  val claimed : maybe<list<() -> exn ()>> = supervisor.claim-cancel
  check(supervisor.is-canceled,"the supervisor seals before capabilities run")
  check(hidden-load(claims) == 2,"cancellation claims every task state first")
  check(hidden-load(events).is-nil,"claiming never invokes cancellation actions")
  check(!older.unregister && !newer.unregister,
        "snapshot claim invalidates every stale registration handle")
  check(supervisor.claim-cancel.is-nothing,"cancellation claim is one-shot")
  val late = error/try(fn(){
    supervisor.register(fn() Just(fn() check(True,"late action")))
  })
  check(late.is-error,"late registration is rejected after cancellation")
  match claimed
    Nothing -> throw("cancellation supervisor: live claim unexpectedly failed")
    Just(actions) -> actions.foreach(fn(action) action())
  check(hidden-load(events) == ["newer","older"],
        "claimed actions retain deterministic LIFO order")

fun test-individual-unlink-is-constant-space-and-idempotent()
  val supervisor = new-cancellation-supervisor()
  val size = 50000
  val registrations = pretend-no-div{
    register-many(supervisor,size,[])
  }
  check(supervisor.count == size,"the supervisor tracks every live child")
  pretend-no-div{ unregister-many(registrations) }
  check(supervisor.count == 0,"individual unlink leaves no tombstones")
  check(supervisor.claim-cancel == Just([]),
        "an empty live supervisor still transitions to canceled")

pub fun main()
  test-cancel-claims-the-complete-snapshot-first()
  test-individual-unlink-is-constant-space-and-idempotent()
  println("cancellation-supervisor: all checks passed")
