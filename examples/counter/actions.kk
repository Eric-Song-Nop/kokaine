/*--------------------------------------------------------------------------
  Mutations and continuation-scoped host re-entry for the example.
--------------------------------------------------------------------------*/
module examples/counter/actions

import kokaine/reactive
import examples/counter/model


pub fun lab-adjust-a(model : lab-model, delta : int)
  model.lab-channel-a.modify(fn(value) value + delta)

pub fun lab-adjust-b(model : lab-model, delta : int)
  model.lab-channel-b.modify(fn(value) value + delta)

pub fun lab-adjust-active(model : lab-model, delta : int)
  if model.lab-active-b.get
  then model.lab-channel-b.modify(fn(value) value + delta)
  else model.lab-channel-a.modify(fn(value) value + delta)

pub fun lab-zero-active(model : lab-model)
  if model.lab-active-b.get
  then model.lab-channel-b.set(0)
  else model.lab-channel-a.set(0)

pub fun lab-swap(root, model : lab-model)
  batch(root)
    val left = model.lab-channel-a.get
    val right = model.lab-channel-b.get
    model.lab-channel-a.set(right)
    model.lab-channel-b.set(left)

pub fun lab-reset(root, model : lab-model)
  batch(root)
    model.lab-channel-a.set(0)
    model.lab-channel-b.set(10)
    model.lab-active-b.set(False)
    model.lab-frozen.set(False)
    model.lab-operator.set("Koka")
    model.lab-probe-visible.set(True)

pub fun lab-pulse(model : lab-model)
  model.lab-heartbeat.set(0)

// A listener calls this during DOM re-entry. Both the cleanup and child
// effect become owned by the listener's exact region generation.
pub fun lab-arm-probe(root, model : lab-model)
  if model.lab-probe-attached.get then ()
  else
    model.lab-probe-attached.set(True)
    on-cleanup(root,fn()
      model.lab-probe-attached.set(False)
      model.lab-probe-cleanups.modify(fn(value) value + 1)
    )
    val child-dispose = create-effect(
      root,
      fn()
        val pulse = model.lab-heartbeat.get
        if model.lab-active-b.get
        then model.lab-channel-b.get
        else model.lab-channel-a.get
      ,fn(current)
        model.lab-probe-value.set(current)
        model.lab-probe-runs.modify(fn(value) value + 1)
    )
    ()
