/*--------------------------------------------------------------------------
  One shared reactive graph for every executable island in the report.

  Keeping the sources and projections together makes an important property
  visible: the four mounts are separate DOM ranges, but they are all owned by
  one Kokaine root and participate in one scheduler.
--------------------------------------------------------------------------*/
module examples/report/model

import kokaine/reactive


pub struct report-model(
  report-feature             : signal<string>,
  report-flow-count          : signal<int>,
  report-flow-square         : memo<int>,
  report-flow-parity         : memo<string>,
  report-flow-revision       : memo<int>,
  report-flow-peak           : memo<int>,
  report-dynamic-name        : signal<string>,
  report-dynamic-count       : signal<string>,
  report-dynamic-name-mode   : signal<bool>,
  report-dynamic-output      : memo<string>,
  report-dynamic-runs        : memo<int>,
  report-owner-visible       : signal<bool>,
  report-owner-active        : signal<bool>,
  report-owner-runs          : signal<int>,
  report-owner-cleanups      : signal<int>
)


fun magnitude(value : int) : int
  if value < 0 then 0 - value else value

pub fun report-create(root)
  val feature = signal(root,"effects")

  val flow-count = signal(root,2)
  val flow-square = derive(root,4,fn()
    val current = flow-count.get
    current * current
  )
  val flow-parity = derive(root,"偶数",fn()
    if flow-count.get % 2 == 0 then "偶数" else "奇数"
  )

  // These are state-entry computations: `previous` belongs to the memo
  // capability, not to a second mutable signal hidden behind the example.
  val flow-revision = memo(root,0,fn(previous)
    val current = flow-count.get
    if current == current then previous + 1 else previous + 1
  )
  val flow-peak = memo(root,2,fn(previous)
    val current = magnitude(flow-count.get)
    if current > previous then current else previous
  )

  val dynamic-name = signal(root,"Koka")
  val dynamic-count = signal(root,"2")
  val dynamic-name-mode = signal(root,True)

  // Only one branch performs a tracked get. Updating the inactive source
  // therefore cannot invalidate either of these continuations.
  val dynamic-output = derive(root,"访客 Koka",fn()
    if dynamic-name-mode.get
    then "访客 " ++ dynamic-name.get
    else "当前计数 " ++ dynamic-count.get
  )
  val dynamic-runs = memo(root,0,fn(previous)
    val selected = if dynamic-name-mode.get
                   then dynamic-name.get
                   else dynamic-count.get
    if selected == "" then previous + 1 else previous + 1
  )

  val owner-visible = signal(root,True)
  val owner-active = signal(root,False)
  val owner-runs = signal(root,0)
  val owner-cleanups = signal(root,0)

  Report-model(
    feature,
    flow-count,
    flow-square,
    flow-parity,
    flow-revision,
    flow-peak,
    dynamic-name,
    dynamic-count,
    dynamic-name-mode,
    dynamic-output,
    dynamic-runs,
    owner-visible,
    owner-active,
    owner-runs,
    owner-cleanups
  )
