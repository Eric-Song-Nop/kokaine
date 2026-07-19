/*--------------------------------------------------------------------------
  Registry-backed cancellation ownership for one lexical async scope.

  Each registry value is a trusted, non-effectful claim which atomically
  revokes one task and returns its later cancellation action. `claim-cancel`
  first seals the registry and invokes every claim; only then does it return
  actions which may enter arbitrary host or user code.
--------------------------------------------------------------------------*/
module kokaine/async/internal/cancellation-supervisor

import kokaine/internal/registry
import std/core/undiv


type cancellation-entry<a>
  Cancellation-entry(
    claim-cancellation : () -> maybe<a>
  )


abstract type cancellation-supervisor<a>
  Cancellation-supervisor(
    cancellation-registry : registry<cancellation-entry<a>>
  )

abstract type cancellation-registration<a>
  Cancellation-registration(
    cancellation-node : registry-registration<cancellation-entry<a>>
  )

pub fun new-cancellation-supervisor() : cancellation-supervisor<a>
  Cancellation-supervisor(new-registry())

pub fun cancellation-supervisor/register(
    supervisor : cancellation-supervisor<a>, claim : () -> maybe<a>)
    : exn cancellation-registration<a>
  Cancellation-registration(
    supervisor.cancellation-registry.insert(Cancellation-entry(claim)))

pub fun cancellation-registration/unregister(
    registration : cancellation-registration<a>) : bool
  registration.cancellation-node.take.is-just

tail fun claim-cancellations(entries : list<cancellation-entry<a>>,
                             actions : list<a>) : <div> list<a>
  match entries
    Nil -> actions.reverse
    Cons(Cancellation-entry(claim),rest) ->
      match claim()
        Nothing -> claim-cancellations(rest,actions)
        Just(action) -> claim-cancellations(rest,Cons(action,actions))

pub noinline fun cancellation-supervisor/claim-cancel(
    supervisor : cancellation-supervisor<a>) : maybe<list<a>>
  match supervisor.cancellation-registry.seal-detach
    Nothing -> Nothing
    Just(entries) -> Just(pretend-no-div{
      claim-cancellations(entries,[])
    })

pub noinline fun cancellation-supervisor/is-canceled(
    supervisor : cancellation-supervisor<a>) : bool
  supervisor.cancellation-registry.sealed

pub noinline fun cancellation-supervisor/count(
    supervisor : cancellation-supervisor<a>) : int
  supervisor.cancellation-registry.count
