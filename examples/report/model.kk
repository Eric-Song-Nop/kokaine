/*--------------------------------------------------------------------------
  One shared reactive graph for the complete executable report.

  Document chrome, narrative labs, and the embedded experiments all belong to
  one Kokaine root, one scheduler, and one mounted DOM generation.
--------------------------------------------------------------------------*/
module examples/report/model

import kokaine/reactive
import examples/report/scheduler
import examples/report/batching
import examples/report/comparison
import examples/report/code-tabs


pub struct report-model(
  report-scheduler           : scheduler-model,
  report-batching            : batching-model,
  report-comparison          : comparison-model,
  report-code-tabs           : code-tabs-model,
  report-toc-open            : signal<bool>,
  report-active-section      : signal<string>,
  report-demo-revision       : signal<int>,
  report-feature             : signal<string>,
  report-flow-count          : signal<int>,
  report-flow-square         : memo<int>,
  report-flow-parity         : memo<string>,
  report-flow-revision       : signal<int>,
  report-flow-peak           : signal<int>,
  report-dynamic-name        : signal<string>,
  report-dynamic-count       : signal<string>,
  report-dynamic-name-mode   : signal<bool>,
  report-dynamic-output      : memo<string>,
  report-dynamic-runs        : signal<int>,
  report-owner-visible       : signal<bool>,
  report-owner-active        : signal<bool>,
  report-owner-runs          : signal<int>,
  report-owner-cleanups      : signal<int>
)


fun magnitude(value : int) : int
  if value < 0 then 0 - value else value

fun retain-maximum(previous : int, current : int) : int
  if current > previous then current else previous

pub fun report-create(root)
  val scheduler = scheduler-create(root)
  val batching = batching-create(root)
  val comparison = comparison-create(root)
  val code-tabs = code-tabs-create(root)
  val toc-open = signal(root,False)
  val active-section = signal(root,"abstract")
  val demo-revision = signal(root,0)
  val feature = signal(root,"effects")

  val flow-count = signal(root,2)
  val flow-square = derive(root,4,fn()
    val current = flow-count.get
    current * current
  )
  val flow-parity = derive(root,"偶数",fn()
    if flow-count.get % 2 == 0 then "偶数" else "奇数"
  )

  // Revision and peak are accumulated state, so the model exposes them as
  // signals and updates them from effects with explicit dependencies.
  val flow-revision = signal(root,0)
  val flow-revision-dispose = create-effect(root,
    fn() flow-count.get,
    fn(_) flow-revision.modify(fn(previous) previous + 1)
  )
  val flow-peak = signal(root,2)
  val flow-peak-dispose = create-effect(root,
    fn() magnitude(flow-count.get),
    fn(current) flow-peak.modify(
      fn(previous) retain-maximum(previous,current)
    )
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
  val dynamic-runs = signal(root,0)
  val dynamic-run-dispose = create-effect(root,
    fn() if dynamic-name-mode.get
         then dynamic-name.get
         else dynamic-count.get,
    fn(_) dynamic-runs.modify(fn(previous) previous + 1)
  )

  val owner-visible = signal(root,True)
  val owner-active = signal(root,False)
  val owner-runs = signal(root,0)
  val owner-cleanups = signal(root,0)

  Report-model(
    scheduler,
    batching,
    comparison,
    code-tabs,
    toc-open,
    active-section,
    demo-revision,
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
