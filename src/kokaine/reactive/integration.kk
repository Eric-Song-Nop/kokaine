/*--------------------------------------------------------------------------
  Integration capabilities for provisional reactive construction.

  A provision is an identity-only borrowed view. Only the lease returned by
  `open-provision` can drain, promote, or discard its local bootstrap work.
  Integrations own their participation policy; Reactive owns only this work
  frontier and its lifetime guarantees.
--------------------------------------------------------------------------*/
module kokaine/reactive/integration

import kokaine/reactive
import kokaine/reactive/internal/scheduler


abstract value type provision<e::E>
  Public-provision(
    internal-provision : kokaine/reactive/internal/scheduler/provision<e>
  )

abstract value type provision-lease<e::E>
  Public-provision-lease(
    internal-provision-lease
      : kokaine/reactive/internal/scheduler/provision-lease<e>
  )

fun unwrap-provision(value : provision<e>)
    : kokaine/reactive/internal/scheduler/provision<e>
  match value
    Public-provision(inner) -> inner

fun unwrap-provision-lease(value : provision-lease<e>)
    : kokaine/reactive/internal/scheduler/provision-lease<e>
  match value
    Public-provision-lease(inner) -> inner

pub fun current-provision(root : root<e>) : exn maybe<provision<e>>
  match kokaine/reactive/internal/scheduler/current-provision(
          internal/root-handle(root))
    Nothing -> Nothing
    Just(current) -> Just(Public-provision(current))

pub fun open-provision(root : root<e>) : exn provision-lease<e>
  Public-provision-lease(
    kokaine/reactive/internal/scheduler/open-provision(
      internal/root-handle(root)))

pub fun provision-lease/provision(lease : provision-lease<e>) : provision<e>
  Public-provision(lease.unwrap-provision-lease.provision)

pub fun provision/same(left : provision<e>, right : provision<e>) : bool
  kokaine/reactive/internal/scheduler/provision/same(
    left.unwrap-provision,right.unwrap-provision)

pub fun drain-provision(lease : provision-lease<e>) : <div,exn|e> ()
  kokaine/reactive/internal/scheduler/drain-provision(
    lease.unwrap-provision-lease)

pub fun promote-provision(lease : provision-lease<e>) : <div,exn|e> ()
  kokaine/reactive/internal/scheduler/promote-provision(
    lease.unwrap-provision-lease)

pub fun discard-provision(lease : provision-lease<e>) : <exn|e> ()
  kokaine/reactive/internal/scheduler/discard-provision(
    lease.unwrap-provision-lease)
