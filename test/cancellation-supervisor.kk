module cancellation-supervisor

import kokaine/reactive/internal/cancellation-supervisor
import std/core/undiv


fun check(ok : bool, message : string)
  if ok then () else throw("cancellation supervisor: " ++ message)

tail fun register-many(supervisor : cancellation-supervisor<int>,
                       remaining : int,
                       registrations : list<cancellation-registration<int>>)
                      : <div,exn> list<cancellation-registration<int>>
  if remaining <= 0 then registrations else
    val registration = supervisor.register(remaining)
    register-many(supervisor,remaining - 1,Cons(registration,registrations))

tail fun unregister-many(registrations : list<cancellation-registration<int>>)
                        : <div,exn> ()
  match registrations
    Nil -> ()
    Cons(registration,rest) ->
      check(registration.unregister,"every live registration unlinks once")
      unregister-many(rest)

fun test_cancel_claims_the_complete_snapshot_first()
  val supervisor = new-cancellation-supervisor()
  val older = supervisor.register("older")
  val newer = supervisor.register("newer")
  val claimed = supervisor.claim-cancel
  check(supervisor.is-canceled,"the supervisor seals before capabilities run")
  check(claimed == Just(["newer","older"]),
        "cancellation owns a complete LIFO snapshot")
  check(!older.unregister && !newer.unregister,
        "snapshot claim invalidates every stale registration handle")
  check(supervisor.claim-cancel.is-nothing,"cancellation claim is one-shot")
  val late = error/try(fn() supervisor.register("late"))
  check(late.is-error,"late registration is rejected after cancellation")

fun test_individual_unlink_is_constant_space_and_idempotent()
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
