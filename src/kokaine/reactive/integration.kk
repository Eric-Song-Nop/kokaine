/*--------------------------------------------------------------------------
  Integration capabilities for provisional reactive construction.

  A provision is an identity-only borrowed view. Only the lease returned by
  `open-provision` can drain, promote, or discard its local bootstrap work.
  Integrations own their participation policy; Reactive owns only this work
  frontier and its lifetime guarantees.
--------------------------------------------------------------------------*/
module kokaine/reactive/integration

import kokaine/reactive
import kokaine/reactive/integration/internal/lifetime-scope
import kokaine/reactive/integration/internal/provision
import kokaine/reactive/integration/internal/reentry


abstract value type lifetime-scope<e::E>
  Public-lifetime-scope(
    internal-lifetime-scope
      : kokaine/reactive/integration/internal/lifetime-scope/lifetime-scope<e>
  )

abstract value type reentry<e::E>
  Public-reentry(
    internal-reentry
      : kokaine/reactive/integration/internal/reentry/reentry<e>
  )


abstract value type provision<e::E>
  Public-provision(
    internal-provision
      : kokaine/reactive/integration/internal/provision/provision<e>
  )

abstract value type provision-lease<e::E>
  Public-provision-lease(
    internal-provision-lease
      : kokaine/reactive/integration/internal/provision/provision-lease<e>
  )

fun unwrap-lifetime-scope(value : lifetime-scope<e>)
    : kokaine/reactive/integration/internal/lifetime-scope/lifetime-scope<e>
  match value
    Public-lifetime-scope(inner) -> inner

fun unwrap-reentry(value : reentry<e>)
    : kokaine/reactive/integration/internal/reentry/reentry<e>
  match value
    Public-reentry(inner) -> inner

fun unwrap-provision(value : provision<e>)
    : kokaine/reactive/integration/internal/provision/provision<e>
  match value
    Public-provision(inner) -> inner

fun unwrap-provision-lease(value : provision-lease<e>)
    : kokaine/reactive/integration/internal/provision/provision-lease<e>
  match value
    Public-provision-lease(inner) -> inner

pub fun open-lifetime-scope(root : root<e>) : exn lifetime-scope<e>
  Public-lifetime-scope(
    kokaine/reactive/integration/internal/lifetime-scope/open-lifetime-scope(
      internal/root-handle(root)))

pub fun with-lifetime-scope(
          root : root<r>, scope : lifetime-scope<r>,
          action : () -> <div,exn|e> a)
         : <div,exn|e> a
  kokaine/reactive/integration/internal/lifetime-scope/with-lifetime-scope(
    internal/root-handle(root),scope.unwrap-lifetime-scope,action)

pub fun lifetime-scope/dispose(scope : lifetime-scope<e>) : <exn|e> ()
  kokaine/reactive/integration/internal/lifetime-scope/lifetime-scope/dispose(
    scope.unwrap-lifetime-scope)

// Host callbacks capture the continuation generation which registered them.
// Work created during re-entry remains owned by that generation.
pub fun capture-reentry(root : root<e>) : exn reentry<e>
  Public-reentry(
    kokaine/reactive/integration/internal/reentry/capture-reentry(
      internal/root-handle(root)))

pub fun reenter(value : reentry<e>,
                action : () -> <signal-read,signal-write,pure|e> a)
               : <exn|e> a
  kokaine/reactive/integration/internal/reentry/run-reentry(
    value.unwrap-reentry,action)

pub fun current-provision(root : root<e>) : exn maybe<provision<e>>
  match kokaine/reactive/integration/internal/provision/current-provision(
          internal/root-handle(root))
    Nothing -> Nothing
    Just(current) -> Just(Public-provision(current))

pub fun open-provision(root : root<e>) : exn provision-lease<e>
  Public-provision-lease(
    kokaine/reactive/integration/internal/provision/open-provision(
      internal/root-handle(root)))

pub fun provision-lease/provision(lease : provision-lease<e>) : provision<e>
  Public-provision(lease.unwrap-provision-lease.provision)

pub fun provision/same(left : provision<e>, right : provision<e>) : bool
  kokaine/reactive/integration/internal/provision/provision/same(
    left.unwrap-provision,right.unwrap-provision)

pub fun drain-provision(lease : provision-lease<e>) : <div,exn|e> ()
  kokaine/reactive/integration/internal/provision/drain-provision(
    lease.unwrap-provision-lease)

pub fun promote-provision(lease : provision-lease<e>) : <div,exn|e> ()
  kokaine/reactive/integration/internal/provision/promote-provision(
    lease.unwrap-provision-lease)

pub fun discard-provision(lease : provision-lease<e>) : <exn|e> ()
  kokaine/reactive/integration/internal/provision/discard-provision(
    lease.unwrap-provision-lease)
