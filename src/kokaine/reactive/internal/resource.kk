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
    resource-live     : ref<global,bool>,
    resource-finalize : () -> <div,exn|e> ()
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
  unsafe-total {
    val live = cell(True)
    with raw ctl park-resource()
      Resource-parked(live,fn()
        val _ = rcontext.finalize(Resource-done)
        ()
      )
    finally(fn() run-finalizer(finalizer),fn() park-resource())
    Resource-done
  }

pub fun finalize-resource(resource : resource-k<e>) : <div,exn|e> ()
  match resource
    Resource-done -> ()
    Resource-parked(live,finalize) ->
      if !load(live) then () else
        // Consume before entering user cleanup. Recursive or aliased retirement
        // therefore cannot finalize this one-shot continuation twice.
        store(live,False)
        finalize()

// Explicit unregistration consumes the capability without entering its
// parked finalizer. This is intentionally distinct from retirement: callers
// can prove that a detached cleanup can never be observed again.
pub fun discard-resource(resource : resource-k<e>) : bool
  match resource
    Resource-done -> False
    Resource-parked(live,_) ->
      if !load(live) then False else
        store(live,False)
        True
