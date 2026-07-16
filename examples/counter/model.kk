/*--------------------------------------------------------------------------
  State and derivations for the Continuation Lab example.

  This module deliberately contains no DOM vocabulary. It makes the reactive
  topology readable on its own: ordinary sources, dynamic selection,
  equality-pruned derivation, stateful entry, untracked sampling, and sinks.
--------------------------------------------------------------------------*/
module examples/counter/model

import kokaine/reactive


pub value struct lab-band(
  lab-band-index      : string,
  lab-band-entered-at : int
)

pub struct lab-model(
  lab-channel-a       : signal<int>,
  lab-channel-b       : signal<int>,
  lab-active-b        : signal<bool>,
  lab-frozen          : signal<bool>,
  lab-operator        : signal<string>,
  lab-heartbeat       : signal<int>,
  lab-probe-visible   : signal<bool>,
  lab-probe-attached  : signal<bool>,
  lab-probe-value     : signal<int>,
  lab-probe-runs      : signal<int>,
  lab-probe-cleanups  : signal<int>,
  lab-active-value    : memo<int>,
  lab-total-value     : memo<int>,
  lab-square-value    : memo<int>,
  lab-parity-value    : memo<string>,
  lab-peak-value      : memo<int>,
  lab-band-value      : memo<lab-band>,
  lab-band-revisions  : memo<int>,
  lab-sampled-operator : memo<string>,
  lab-heartbeat-runs  : memo<int>,
  lab-effect-runs     : signal<int>,
  lab-effect-snapshot : signal<string>
)


pub fun lab-magnitude(value : int) : int
  if value < 0 then 0 - value else value

pub fun lab-band-of(value : int) : string
  if value < 0 then "NEGATIVE"
  elif value == 0 then "ZERO"
  else "POSITIVE"

pub fun lab-create(root)
  val channel-a = signal(root,0)
  val channel-b = signal(root,10)
  val active-b = signal(root,False)
  val frozen = signal(root,False)
  val operator = signal(root,"Koka")

  // False equality makes an identical payload a real publication.
  val heartbeat = signal-always(root,0)

  val probe-visible = signal(root,True)
  val probe-attached = signal(root,False)
  val probe-value = signal(root,0)
  val probe-runs = signal(root,0)
  val probe-cleanups = signal(root,0)

  // Only the selected channel is read, so switching the selector replaces
  // the captured dependency suffix instead of retaining both branches.
  val active-value = derive(root,0,fn()
    if active-b.get then channel-b.get else channel-a.get
  )

  val total-value = derive(root,10,fn()
    channel-a.get + channel-b.get
  )
  val square-value = derive(root,0,fn()
    val current = active-value.get
    current * current
  )
  val parity-value = derive(root,"EVEN",fn()
    if active-value.get % 2 == 0 then "EVEN" else "ODD"
  )

  // `previous` enters through a state-entry continuation. The peak survives
  // later values without a second mutable source.
  val peak-value = memo(root,0,fn(previous)
    val current = lab-magnitude(active-value.get)
    if current > previous then current else previous
  )

  // Recompute on every active change, but publish only when the band changes.
  // Consequently `entered-at` remains the value that crossed the boundary.
  val band-value = derive-by(
    root,
    Lab-band("ZERO",0),
    fn()
      val current = active-value.get
      Lab-band(lab-band-of(current),current)
    ,fn(left,right) left.lab-band-index == right.lab-band-index
  )
  val band-revisions = memo(root,0,fn(previous)
    val current-band = band-value.get
    previous + 1
  )

  // The operator is sampled only when the tracked active value invalidates
  // this suffix. Editing the input alone does not publish this derivation.
  val sampled-operator = derive(root,"Koka",fn()
    val current = active-value.get
    untrack(fn() operator.get)
  )

  val heartbeat-runs = memo(root,0,fn(previous)
    val pulse = heartbeat.get
    previous + 1
  )

  val effect-runs = signal(root,0)
  val effect-snapshot = signal(root,"")
  val effect-dispose = create-effect(
    root,
    fn()
      val channel = if active-b.get then "B" else "A"
      channel ++ " → " ++ active-value.get.show
    ,fn(snapshot)
      effect-runs.modify(fn(value) value + 1)
      effect-snapshot.set(snapshot)
  )

  Lab-model(
    channel-a,
    channel-b,
    active-b,
    frozen,
    operator,
    heartbeat,
    probe-visible,
    probe-attached,
    probe-value,
    probe-runs,
    probe-cleanups,
    active-value,
    total-value,
    square-value,
    parity-value,
    peak-value,
    band-value,
    band-revisions,
    sampled-operator,
    heartbeat-runs,
    effect-runs,
    effect-snapshot
  )
