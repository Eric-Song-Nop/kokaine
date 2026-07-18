/*--------------------------------------------------------------------------
  Opaque one-shot resource continuations.

  A resource owner retains only the capability returned by `capture-resource`.
  The resource action itself lives in the parked continuation's `finally` and
  can run only through `rcontext.finalize`.
--------------------------------------------------------------------------*/
module kokaine/reactive/internal/resource

import std/core/unsafe

fun cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

effect resource-park
  ctl park-resource() : ()

// Constructors remain private to this module. In particular, the ownership
// model cannot manufacture a retained-action substitute for this capability.
abstract type resource-k<e::E>
  Resource-done
  Resource-parked(
    resource-finalizer : ref<global,maybe<() -> <div,exn|e> ()>>
  )

fun run-finalizer(finalizer : () -> <div,exn|e> ())
                 : <resource-park,div,exn|e> ()
  // `finally` requires exact effect rows. The private masked layer widens the
  // finalizer without giving callers access to `park-resource`.
  mask<resource-park>{ finalizer() }

pub fun capture-resource(finalizer : () -> <div,exn|e> ()) : resource-k<e>
  // The apparent ambient effects are latent in the captured continuation: the
  // locally handled `park-resource` is unconditionally reached before the
  // finalizer can execute. This is the same controlled cast used to package
  // other effectful computations as opaque capabilities.
  val pending : ref<global,maybe<() -> <div,exn|e> ()>> = cell(Nothing)
  unsafe-total {
    with raw ctl park-resource()
      val finalize = fn()
        val _ = rcontext.finalize(Resource-done)
        ()
      store(pending,Just(finalize))
      Resource-parked(pending)
    finally(fn() run-finalizer(finalizer),fn() park-resource())
    Resource-done
  }

fun claim-resource(resource : resource-k<e>)
                  : maybe<() -> <div,exn|e> ()>
  match resource
    Resource-done -> Nothing
    Resource-parked(pending) ->
      val claimed = load(pending)
      store(pending,Nothing)
      claimed

// Internal observability for ownership tests. This reports whether an aliased
// resource still retains the parked continuation closure, not merely whether
// that continuation is allowed to run.
pub fun resource-retains-finalizer(resource : resource-k<e>) : bool
  match resource
    Resource-done -> False
    Resource-parked(pending) -> load(pending).is-just

pub fun finalize-resource(resource : resource-k<e>) : <div,exn|e> ()
  match claim-resource(resource)
    Nothing -> ()
    Just(finalize) ->
      // Consume before entering user cleanup. Recursive or aliased retirement
      // therefore cannot finalize this one-shot continuation twice.
      finalize()

// Explicit unregistration consumes the capability without entering its
// parked finalizer. This is intentionally distinct from retirement: callers
// can prove that a detached cleanup can never be observed again.
pub fun discard-resource(resource : resource-k<e>) : bool
  claim-resource(resource).is-just
