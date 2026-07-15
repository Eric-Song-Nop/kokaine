module execution-planes

import kokaine/reactive
import std/core/unsafe

effect ctl abort-publication() : ()

fun completes-publication(action : () -> <abort-publication,pure|e> bool)
                         : <pure|e> bool
  with final ctl abort-publication() False
  action()

fun require-publication(action : () -> <abort-publication,pure|e> a)
                        : <div,exn|e> a
  with final ctl abort-publication()
    throw("unexpected publication abort")
  action()

fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun bump(target : ref<global,int>) : ()
  store(target,load(target) + 1)

fun emit(target : ref<global,list<string>>, value : string) : ()
  store(target,load(target) ++ [value])

fun check(ok : bool, label : string)
  if ok then println("ok: " ++ label) else throw("FAILED: " ++ label)

fun require-memo(slot : ref<global,maybe<memo<int>>>) : exn memo<int>
  match load(slot)
    Nothing -> throw("missing owned memo")
    Just(value) -> value

fun test-deep-wide-diamond()
  val m1-runs = hidden(0)
  val m2-runs = hidden(0)
  val m3-runs = hidden(0)
  val m4-runs = hidden(0)
  val left-runs = hidden(0)
  val right-runs = hidden(0)
  val join-runs = hidden(0)
  val seen = hidden([])

  val (root,(source,choose,_joined)) = create-root fn(root)
    val source = signal(root,1)
    val choose = signal(root,True)
    val m1 = derive(root,0,fn()
      val value = source.get * 2
      bump(m1-runs)
      value
    )
    val m2 = derive(root,0,fn()
      val value = source.get + 10
      bump(m2-runs)
      value
    )
    val m3 = derive(root,0,fn()
      val value = m1.get + m2.get
      bump(m3-runs)
      value
    )
    val m4 = derive(root,0,fn()
      val value = m1.get * 3
      bump(m4-runs)
      value
    )
    val left = derive(root,0,fn()
      val value = if choose.get then m3.get else m4.get
      bump(left-runs)
      value
    )
    val right = derive(root,0,fn()
      val value = m2.get * 2
      bump(right-runs)
      value
    )
    val joined = derive(root,0,fn()
      val value = left.get + right.get
      bump(join-runs)
      value
    )
    val stop = create-effect(root,fn() joined.get,
      fn(value) store(seen,Cons(value,load(seen))))
    (source,choose,joined)

  update(root)
    batch(root)
      source.set(2)
      choose.set(False)
  update(root)
    batch(root)
      source.set(3)
      choose.set(True)

  check(load(seen) == [45,36,35],"diamond publishes coherent epochs")
  check(load(m1-runs) == 3,"m1 runs once per epoch")
  check(load(m2-runs) == 3,"m2 runs once per epoch")
  check(load(m3-runs) == 3,"m1+m2 inner ticket validates owner prefix")
  check(load(m4-runs) == 3,"alternate branch runs once per epoch")
  check(load(left-runs) == 3,"dynamic branch runs once per epoch")
  check(load(right-runs) == 3,"right fanout runs once per epoch")
  check(load(join-runs) == 3,"join runs once per epoch")
  root.dispose()

fun test-target-does-not-drain-unrelated-producer()
  val events = hidden([])
  val (root,(base,other)) = create-root fn(root)
    val base = signal(root,0)
    val other = signal(root,0)
    val upstream = derive(root,0,fn()
      val value = base.get
      emit(events,"upstream")
      value
    )
    val target = derive(root,0,fn()
      val direct = base.get
      val nested = upstream.get
      emit(events,"target")
      direct + nested
    )
    val unrelated = derive(root,0,fn()
      val value = other.get
      emit(events,"unrelated")
      value
    )
    val stop = create-effect(root,fn() upstream.get,fn(_)
      emit(events,"effect")
    )
    (base,other)

  store(events,[])
  update(root)
    batch(root)
      other.set(1)
      base.set(1)
  check(load(events) == ["upstream","target","unrelated","effect"],
    "targeted get follows upstream capability without draining unrelated or effect work")
  root.dispose()

fun test-owner-gate-defers-to-lazy-parent-dependency()
  val slot : ref<global,maybe<memo<int>>> = hidden(Nothing)
  val parent-runs = hidden(0)
  val (root,(source,payload))
      : (root<total>,(signal<int>,signal<int>)) = create-root fn(root)
    val source = signal(root,1)
    val payload = signal(root,10)
    val marker = signal(root,0)
    val upstream = derive(root,0,fn() source.get)
    val stop = create-effect(root,fn()
      val current = upstream.get
      val _ = marker.get
      current
    ,fn(current)
      bump(parent-runs)
      val owned = derive(root,0,fn() current * 100 + payload.get)
      store(slot,Just(owned))
    )
    (source,payload)

  val stale = require-memo(slot)
  update(root)
    batch(root)
      // The owned child ticket is LIFO-newer. Its owner gate still looks Live
      // until validating upstream commits and marks the effect owner Pending.
      source.set(2)
      payload.set(11)

  if load(parent-runs) == 2 then ()
  else throw("deferred owner was not resumed exactly once")
  val stale-read : error<int> = mask<exn>{
    error/try fn() sample(root){ stale.get }
  }
  if stale-read.is-error then ()
  else throw("deferred owner left its old child readable")
  val replacement-read : error<int> = mask<exn>{
    error/try fn()
      match load(slot)
        Nothing -> throw("missing deferred replacement")
        Just(replacement) -> sample(root){ replacement.get }
  }
  match replacement-read
    Ok(value) ->
      if value == 211 then ()
      else throw("deferred replacement=" ++ value.show)
    Error(failure) -> throw-exn(failure.prepend("deferred replacement: "))
  root.dispose()

fun test-batch-targeted-pull-failure-isolation()
  val self-slot : ref<global,maybe<memo<int>>> = hidden(Nothing)
  val good-runs = hidden(0)
  val bad-runs = hidden(0)
  val good-at-pull = hidden(-1)
  val bad-runs-at-pull = hidden(-1)
  val (root,(good-source,bad-source,good))
      : (root<total>,(signal<int>,signal<bool>,memo<int>)) = create-root fn(root)
    val good-source = signal(root,0)
    val bad-source = signal(root,False)
    val good = derive(root,0,fn()
      val value = good-source.get * 2
      bump(good-runs)
      value
    )
    val bad = derive(root,0,fn()
      val cyclic = bad-source.get
      bump(bad-runs)
      if !cyclic then 0 else
        match load(self-slot)
          Nothing -> 0
          Just(self) -> self.get
    )
    store(self-slot,Just(bad))
    (good-source,bad-source,good)

  val failed : error<()> = mask<exn>{
    error/try fn()
      dispatch(root,fn()
        batch(root)
          good-source.set(1)
          bad-source.set(True)
          store(good-at-pull,good.get)
          store(bad-runs-at-pull,load(bad-runs))
      )
  }
  if failed.is-error then ()
  else throw("cyclic bad producer did not fail at batch exit")

  if load(good-at-pull) == 2 && load(good-runs) == 2 then ()
  else throw("targeted good producer did not settle synchronously")
  if load(bad-runs-at-pull) == 1 && load(bad-runs) == 2 then ()
  else throw("targeted get drained the unrelated failing producer")

  // The failed pure ticket was leased, restored, and can recover on a later
  // ordinary flush without another explicit memo.get.
  update(root){ bad-source.set(False) }
  if load(bad-runs) == 3 then ()
  else throw("failed pure ticket was lost instead of retried")
  root.dispose()

fun test-final-control-retires-unpublished-bootstrap()
  val parent-runs = hidden(0)
  val bootstrap-runs = hidden(0)
  val bootstrap-cleanups = hidden(0)

  val built = require-publication fn()
    create-root fn(root)
      val generation = signal(root,0)
      val payload = signal(root,10)
      val parent = create-effect(root,fn() generation.get,fn(value)
        bump(parent-runs)
        if value == 1 then
          val child = create-effect(root,fn() payload.get,fn(_)
            bump(bootstrap-runs)
            on-cleanup(root,fn() bump(bootstrap-cleanups))
            abort-publication()
          )
          ()
        else ()
      )
      (generation,payload)
  val (root,(generation,payload)) = built

  val completed = completes-publication fn()
    update(root){ generation.set(1) }
    True
  if !completed && load(parent-runs) == 2 &&
     load(bootstrap-runs) == 1 && load(bootstrap-cleanups) == 1
  then ()
  else throw("final control did not retire the unpublished bootstrap draft")

  // Bootstrap is one-shot. Its concrete slot was consumed and its scope is
  // dead, so a later write cannot replay either calculate or publication.
  val unrelated = completes-publication fn()
    update(root){ payload.set(11) }
    True
  if unrelated && load(bootstrap-runs) == 1 &&
     load(bootstrap-cleanups) == 1
  then ()
  else throw("abandoned bootstrap was retained or replayed")

  val advanced = completes-publication fn()
    update(root){ generation.set(2) }
    True
  if advanced && load(parent-runs) == 3 then ()
  else throw("bootstrap final control left its owner root stuck")
  val disposed = completes-publication fn()
    root.dispose()
    True
  if disposed && root.is-disposed then ()
  else throw("bootstrap rollback left the root undisposable")


fun run-state-entry-target-order(direct-first : bool)
  val runs = hidden(0)
  val observed = hidden(-1)
  val (root,(direct,base,state)) = create-root fn(root)
    val direct = signal(root,1)
    val base = signal(root,10)
    val upstream = derive(root,0,fn() base.get * 10)
    val state = memo(root,100,fn(previous)
      bump(runs)
      previous + direct.get + upstream.get
    )
    (direct,base,state)

  val initial-value = sample(root){ state.get }
  if initial-value == 201 && load(runs) == 1 then ()
  else throw("state entry fixture did not initialize once")

  dispatch(root)
    batch(root)
      if direct-first then
        direct.set(2)
        base.set(20)
      else
        base.set(20)
        direct.set(2)
      store(observed,state.get)

  val final-value = sample(root){ state.get }
  if load(observed) == 403 && final-value == 403 &&
     load(runs) == 2
  then ()
  else throw("entry target advanced previous more than once")
  root.dispose()

fun test-state-entry-targeted-input-coherence()
  run-state-entry-target-order(True)
  run-state-entry-target-order(False)

pub fun main()
  test-deep-wide-diamond()
  test-target-does-not-drain-unrelated-producer()
  test-owner-gate-defers-to-lazy-parent-dependency()
  test-batch-targeted-pull-failure-isolation()
  test-final-control-retires-unpublished-bootstrap()
  test-state-entry-targeted-input-coherence()
  println("execution-planes: all checks passed")
