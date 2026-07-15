/*--------------------------------------------------------------------------
  Deterministic differential stress for the continuation-indexed runtime.

  A pure reference model predicts both values and execution counts across a
  dynamic branch, an equality-cutoff bucket, and a converging diamond. The
  generated transaction schedule deliberately includes inactive writes,
  batched round trips, branch switches, and fan-in invalidation.
--------------------------------------------------------------------------*/
module reactive-stress

import kokaine/reactive
import std/core/unsafe
import std/core/undiv

val checks : ref<global,int> = unsafe-total { ref(0) }

fun hidden-cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun hidden-load(cell : ref<global,a>) : a
  unsafe-total { !cell }

fun hidden-store(cell : ref<global,a>, value : a) : ()
  unsafe-total { cell := value }

fun check-int(actual : int, expected : int, label : string)
  hidden-store(checks,hidden-load(checks) + 1)
  if actual == expected then () else
    throw("stress check failed at " ++ label ++
          " (expected " ++ expected.show ++ ", got " ++ actual.show ++ ")")

fun check-bool(actual : bool, expected : bool, label : string)
  hidden-store(checks,hidden-load(checks) + 1)
  if actual == expected then () else
    throw("stress check failed at " ++ label ++
          " (expected " ++ expected.show ++ ", got " ++ actual.show ++ ")")

fun step-label(step : int, field : string) : string
  "step " ++ step.show ++ " / " ++ field

fun nonzero-mod(value : int, divisor : int) : int
  // Every call site uses a static nonzero divisor; discharge the primitive
  // division effect so it does not pollute the transaction model's row.
  pretend-no-div{ value % divisor }

fun widen-div(action : () -> <exn|e> a) : <div,exn|e> a
  mask<div>{ action() }


// --------------------------------------------------------------------------
// Pure reference model
// --------------------------------------------------------------------------

type reference-model
  Reference-model(
    model-x              : int,
    model-y              : int,
    model-choose         : bool,
    model-selected       : int,
    model-bucket         : int,
    model-joined         : int,
    model-selected-runs  : int,
    model-bucket-runs    : int,
    model-left-runs      : int,
    model-right-runs     : int,
    model-joined-runs    : int,
    model-bucket-applies : int,
    model-joined-applies : int
  )

fun advance-model(model : reference-model,
                  final-x : int, final-y : int, final-choose : bool,
                  touched-x : bool, touched-y : bool, touched-choose : bool)
                 : reference-model
  // Dependency membership is the one captured at transaction start. Values
  // are read after the batch, from the final transaction state.
  val selected-dirty = touched-choose ||
                       (model.model-choose && touched-x) ||
                       (!model.model-choose && touched-y)
  val calculated-selected = if final-choose then final-x else final-y
  val selected = if selected-dirty
                 then calculated-selected
                 else model.model-selected
  val selected-commit = selected-dirty && selected != model.model-selected
  val bucket = if selected-commit then nonzero-mod(selected,5)
               else model.model-bucket
  val bucket-commit = selected-commit && bucket != model.model-bucket
  val joined = if selected-commit then selected * 5 else model.model-joined

  Reference-model(
    final-x,
    final-y,
    final-choose,
    selected,
    bucket,
    joined,
    model.model-selected-runs + (if selected-dirty then 1 else 0),
    model.model-bucket-runs + (if selected-commit then 1 else 0),
    model.model-left-runs + (if selected-commit then 1 else 0),
    model.model-right-runs + (if selected-commit then 1 else 0),
    model.model-joined-runs + (if selected-commit then 1 else 0),
    model.model-bucket-applies + (if bucket-commit then 1 else 0),
    model.model-joined-applies + (if selected-commit then 1 else 0)
  )


// --------------------------------------------------------------------------
// Reactive fixture
// --------------------------------------------------------------------------

type stress-fixture
  Stress-fixture(
    fixture-root            : root<total>,
    fixture-x               : signal<int>,
    fixture-y               : signal<int>,
    fixture-choose          : signal<bool>,
    fixture-selected        : memo<int>,
    fixture-bucket          : memo<int>,
    fixture-joined          : memo<int>,
    fixture-selected-runs   : ref<global,int>,
    fixture-bucket-runs     : ref<global,int>,
    fixture-left-runs       : ref<global,int>,
    fixture-right-runs      : ref<global,int>,
    fixture-joined-runs     : ref<global,int>,
    fixture-bucket-applies  : ref<global,int>,
    fixture-joined-applies  : ref<global,int>,
    fixture-last-bucket     : ref<global,int>,
    fixture-last-joined     : ref<global,int>
  )

fun create-stress-fixture()
  val selected-runs = hidden-cell(0)
  val bucket-runs = hidden-cell(0)
  val left-runs = hidden-cell(0)
  val right-runs = hidden-cell(0)
  val joined-runs = hidden-cell(0)
  val bucket-applies = hidden-cell(0)
  val joined-applies = hidden-cell(0)
  val last-bucket = hidden-cell(-1)
  val last-joined = hidden-cell(-1)

  val (root,(x,y,choose,(selected,bucket,joined))) = create-root fn(root)
    val x = signal(root,1)
    val y = signal(root,2)
    val choose = signal(root,True)
    val selected = memo(root,0,fn(_)
      hidden-store(selected-runs,hidden-load(selected-runs) + 1)
      if choose.get then x.get else y.get
    )
    val bucket = memo(root,0,fn(_)
      hidden-store(bucket-runs,hidden-load(bucket-runs) + 1)
      nonzero-mod(selected.get,5)
    )
    val left = memo(root,0,fn(_)
      hidden-store(left-runs,hidden-load(left-runs) + 1)
      selected.get * 2
    )
    val right = memo(root,0,fn(_)
      hidden-store(right-runs,hidden-load(right-runs) + 1)
      selected.get * 3
    )
    val joined = memo(root,0,fn(_)
      hidden-store(joined-runs,hidden-load(joined-runs) + 1)
      left.get + right.get
    )
    val stop-bucket = create-effect(root,fn() bucket.get,fn(value)
      hidden-store(bucket-applies,hidden-load(bucket-applies) + 1)
      hidden-store(last-bucket,value)
    )
    val stop-joined = create-effect(root,fn() joined.get,fn(value)
      hidden-store(joined-applies,hidden-load(joined-applies) + 1)
      hidden-store(last-joined,value)
    )
    (x,y,choose,(selected,bucket,joined))

  Stress-fixture(
    root,x,y,choose,selected,bucket,joined,
    selected-runs,bucket-runs,left-runs,right-runs,joined-runs,
    bucket-applies,joined-applies,last-bucket,last-joined
  )

fun verify-fixture(fixture : stress-fixture,
                   model : reference-model, step : int)
  // Raw sources have no producer to pull, so these reads cannot repair queued
  // work. They also prove that inactive-branch writes were actually retained.
  val (x,y,choose) = sample(fixture.fixture-root){
    (fixture.fixture-x.get,
     fixture.fixture-y.get,
     fixture.fixture-choose.get)
  }
  check-int(x,model.model-x,step-label(step,"x source"))
  check-int(y,model.model-y,step-label(step,"y source"))
  check-bool(choose,model.model-choose,step-label(step,"branch source"))
  // Check execution and publication first. A later sample must not be able to
  // heal work that the transaction incorrectly left queued.
  check-int(hidden-load(fixture.fixture-selected-runs),
            model.model-selected-runs,step-label(step,"selected runs"))
  check-int(hidden-load(fixture.fixture-bucket-runs),
            model.model-bucket-runs,step-label(step,"bucket runs"))
  check-int(hidden-load(fixture.fixture-left-runs),
            model.model-left-runs,step-label(step,"left runs"))
  check-int(hidden-load(fixture.fixture-right-runs),
            model.model-right-runs,step-label(step,"right runs"))
  check-int(hidden-load(fixture.fixture-joined-runs),
            model.model-joined-runs,step-label(step,"joined runs"))
  check-int(hidden-load(fixture.fixture-bucket-applies),
            model.model-bucket-applies,step-label(step,"bucket applies"))
  check-int(hidden-load(fixture.fixture-joined-applies),
            model.model-joined-applies,step-label(step,"joined applies"))
  check-int(hidden-load(fixture.fixture-last-bucket),
            model.model-bucket,step-label(step,"last bucket"))
  check-int(hidden-load(fixture.fixture-last-joined),
            model.model-joined,step-label(step,"last joined"))
  val (selected,bucket,joined) = sample(fixture.fixture-root){
    (fixture.fixture-selected.get,
     fixture.fixture-bucket.get,
     fixture.fixture-joined.get)
  }
  check-int(selected,model.model-selected,step-label(step,"selected value"))
  check-int(bucket,model.model-bucket,step-label(step,"bucket value"))
  check-int(joined,model.model-joined,step-label(step,"joined value"))


// --------------------------------------------------------------------------
// Fixed-seed transaction generator
// --------------------------------------------------------------------------

fun next-seed(seed : int) : int
  nonzero-mod(seed * 48271,2147483647)

fun stress-loop(fixture : stress-fixture, model : reference-model,
                seed : int, step : int, remaining : int)
               : <div,exn> reference-model
  if remaining <= 0 then model else
    val seed1 = next-seed(seed)
    val value = nonzero-mod(seed1,97)
    val kind = nonzero-mod(step,8)
    val next-model = widen-div(fn() match kind
      0 ->
        // Equal write to the active branch: no token should fire.
        update(fixture.fixture-root)
          if model.model-choose
          then fixture.fixture-x.set(model.model-x)
          else fixture.fixture-y.set(model.model-y)
        advance-model(model,model.model-x,model.model-y,model.model-choose,
                      False,False,False)
      1 ->
        // Only the inactive branch changes.
        if model.model-choose then
          update(fixture.fixture-root){ fixture.fixture-y.set(value) }
          advance-model(model,model.model-x,value,model.model-choose,
                        False,value != model.model-y,False)
        else
          update(fixture.fixture-root){ fixture.fixture-x.set(value) }
          advance-model(model,value,model.model-y,model.model-choose,
                        value != model.model-x,False,False)
      2 ->
        // Active value changes by five: selected commits, bucket stays equal.
        if model.model-choose then
          val final-value = model.model-x + 5
          update(fixture.fixture-root){ fixture.fixture-x.set(final-value) }
          advance-model(model,final-value,model.model-y,model.model-choose,
                        True,False,False)
        else
          val final-value = model.model-y + 5
          update(fixture.fixture-root){ fixture.fixture-y.set(final-value) }
          advance-model(model,model.model-x,final-value,model.model-choose,
                        False,True,False)
      3 ->
        // Two effective writes collapse into one continuation generation.
        val final-value = nonzero-mod(value + 1,97)
        if model.model-choose then
          update(fixture.fixture-root)
            batch(fixture.fixture-root)
              fixture.fixture-x.set(value)
              fixture.fixture-x.set(final-value)
          advance-model(model,final-value,model.model-y,model.model-choose,
                        True,False,False)
        else
          update(fixture.fixture-root)
            batch(fixture.fixture-root)
              fixture.fixture-y.set(value)
              fixture.fixture-y.set(final-value)
          advance-model(model,model.model-x,final-value,model.model-choose,
                        False,True,False)
      4 ->
        // A batch round trip still reruns selected once, but publishes nothing.
        if model.model-choose then
          update(fixture.fixture-root)
            batch(fixture.fixture-root)
              fixture.fixture-x.set(model.model-x + 1)
              fixture.fixture-x.set(model.model-x)
          advance-model(model,model.model-x,model.model-y,model.model-choose,
                        True,False,False)
        else
          update(fixture.fixture-root)
            batch(fixture.fixture-root)
              fixture.fixture-y.set(model.model-y + 1)
              fixture.fixture-y.set(model.model-y)
          advance-model(model,model.model-x,model.model-y,model.model-choose,
                        False,True,False)
      5 ->
        // Switch branch and update the newly active source in one transaction.
        if model.model-choose then
          update(fixture.fixture-root)
            batch(fixture.fixture-root)
              fixture.fixture-choose.set(False)
              fixture.fixture-y.set(value)
          advance-model(model,model.model-x,value,False,
                        False,value != model.model-y,True)
        else
          update(fixture.fixture-root)
            batch(fixture.fixture-root)
              fixture.fixture-choose.set(True)
              fixture.fixture-x.set(value)
          advance-model(model,value,model.model-y,True,
                        value != model.model-x,False,True)
      6 ->
        // Three-source fan-in with a possibly unchanged final branch selector.
        val final-x = nonzero-mod(value + 3,97)
        val final-y = nonzero-mod(value * 2 + 1,97)
        val final-choose = nonzero-mod(value,2) == 0
        update(fixture.fixture-root)
          batch(fixture.fixture-root)
            fixture.fixture-x.set(final-x)
            fixture.fixture-y.set(final-y)
            fixture.fixture-choose.set(final-choose)
        advance-model(model,final-x,final-y,final-choose,
                      final-x != model.model-x,
                      final-y != model.model-y,
                      final-choose != model.model-choose)
      _ ->
        // A deterministic single write keeps the schedule non-periodic.
        match nonzero-mod(seed1,3)
          0 ->
            update(fixture.fixture-root){ fixture.fixture-x.set(value) }
            advance-model(model,value,model.model-y,model.model-choose,
                          value != model.model-x,False,False)
          1 ->
            update(fixture.fixture-root){ fixture.fixture-y.set(value) }
            advance-model(model,model.model-x,value,model.model-choose,
                          False,value != model.model-y,False)
          _ ->
            val final-choose = nonzero-mod(value,2) == 0
            update(fixture.fixture-root){
              fixture.fixture-choose.set(final-choose)
            }
            advance-model(model,model.model-x,model.model-y,final-choose,
                          False,False,final-choose != model.model-choose)
    )

    verify-fixture(fixture,next-model,step)
    stress-loop(fixture,next-model,seed1,step + 1,remaining - 1)


pub fun main()
  val fixture = create-stress-fixture()
  val initial = Reference-model(
    1,2,True,1,1,5,
    1,1,1,1,1,
    1,1
  )
  verify-fixture(fixture,initial,0)
  val final-model = stress-loop(fixture,initial,17,1,1200)
  widen-div fn()
    check-int(sample(fixture.fixture-root){ fixture.fixture-joined.get },
              final-model.model-joined,"final fixture/reference invariant")
    fixture.fixture-root.dispose()
