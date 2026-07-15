/*--------------------------------------------------------------------------
  Kokaine: continuation-trace reactive runtime.

  A tracked read captures the raw suffix at that exact read. Sources retain
  the captured root + continuation node through a Church-encoded existential;
  there is no retained action, wake callback, observer, or dependency graph.
--------------------------------------------------------------------------*/
module kokaine/reactive

import std/core/unsafe
import std/core/undiv


// --------------------------------------------------------------------------
// Persistent cells and root identity
// --------------------------------------------------------------------------

fun cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun lift-div(action : () -> e a) : <div|e> a
  mask<div>{ action() }

fun lift-exn(action : () -> e a) : <exn|e> a
  mask<exn>{ action() }

abstract type root-key
  Root-key(identity : ref<global,bool>)

fun same-root(left : root-key, right : root-key) : bool
  unsafe-ptr-eq(left.identity,right.identity)


// --------------------------------------------------------------------------
// Source-local existential capabilities for exact read continuations
// --------------------------------------------------------------------------

// Rank-2 packaging erases only the ambient effect row. Unlike a callback,
// this value contains the actual root and continuation node and permits one
// operation: hand that typed pair to a polymorphic consumer.
abstract type packed-capture
  Packed-capture(
    run-packed : forall<r> (forall<e::E> (root<e>,trace<e>) -> r) -> r
  )

abstract type source<a>
  Source(
    source-root     : root-key,
    source-cell     : ref<global,a>,
    source-equals   : (a,a) -> bool,
    source-version  : ref<global,int>,
    source-captures : ref<global,list<packed-capture>>
  )


// --------------------------------------------------------------------------
// Public effects and values
// --------------------------------------------------------------------------

pub effect signal-read
  ctl read-source(source : source<a>, tracked : bool) : a

pub effect signal-write
  fun write-source(source : source<a>, value : a) : ()
  fun modify-source(source : source<a>, update : a -> a) : ()
  fun commit-source(source : source<a>, value : a) : ()
  fun enter-batch(key : root-key) : ()
  fun leave-batch(key : root-key) : ()
  fun request-flush(key : root-key) : ()

pub alias reactive = <signal-read,signal-write>

abstract value type signal<a>
  Signal(signal-source : source<a>)

// Filled in by the derivation layer below. Keeping the public type here lets
// downstream modules compile against one stable surface while the trace core
// remains the only execution mechanism.
abstract value type memo<a>
  Memo(memo-source : source<a>)

pub alias disposer<e> = () -> <exn|e> ()


// --------------------------------------------------------------------------
// Captured execution trace
// --------------------------------------------------------------------------

type trace-kind
  Derivation-trace
  Effect-trace

type capture-state
  Capture-draft
  Capture-live
  Capture-pending
  Capture-running
  Capture-spent
  Capture-dead

abstract type trace<e::E>
  Trace-end
  Trace-read(
    trace-kind       : trace-kind,
    trace-state      : ref<global,capture-state>,
    trace-parent     : maybe<trace<e>>,
    trace-child      : ref<global,trace<e>>,
    trace-resume     : () -> <div,exn|e> built-trace<e>,
    trace-finalize   : () -> <div,exn|e> (),
    trace-unlink     : () -> (),
    trace-stale      : () -> bool
  )

abstract type built-trace<e::E>
  Built-trace(
    built-root    : trace<e>,
    built-publish : () -> <div|e> error<()>
  )

abstract type fiber<e::E>
  Fiber(
    fiber-live  : ref<global,bool>,
    fiber-trace : ref<global,trace<e>>
  )

abstract type work<e::E>
  Resume-work(resume-trace : trace<e>)
  Bootstrap-work(
    bootstrap-live : ref<global,bool>,
    bootstrap-run  : () -> <div|e> error<()>
  )

abstract type root<e::E>
  Root(
    root-key          : root-key,
    root-derive-queue : ref<global,list<work<e>>>,
    root-effect-queue : ref<global,list<work<e>>>,
    root-current      : ref<global,maybe<trace<e>>>,
    root-draft        : ref<global,maybe<ref<global,list<trace<e>>>>>,
    root-fibers       : ref<global,list<fiber<e>>>,
    root-batch-depth  : ref<global,int>,
    root-flushing     : ref<global,bool>,
    root-disposing    : ref<global,bool>,
    root-disposed     : ref<global,bool>
  )


// --------------------------------------------------------------------------
// Trace inspection and source invalidation
// --------------------------------------------------------------------------

fun trace-state-of(current : trace<e>) : capture-state
  match current
    Trace-end -> Capture-dead
    Trace-read(_,state,_,_,_,_,_,_) -> load(state)

fun trace-parent-of(current : trace<e>) : maybe<trace<e>>
  match current
    Trace-end -> Nothing
    Trace-read(_,_,parent,_,_,_,_,_) -> parent

fun trace-active(current : trace<e>) : bool
  match current.trace-state-of
    Capture-dead -> False
    _ -> True

fun fiber-active(current : fiber<e>) : bool
  load(current.fiber-live)

fun compact-fibers(values : list<fiber<e>>) : list<fiber<e>>
  values.filter(fiber-active)

fun pack-capture(root : root<e>, current : trace<e>) : packed-capture
  Packed-capture(fn(consume) consume(root,current))

fun packed-active(packed : packed-capture) : bool
  match packed
    Packed-capture(run) -> run(fn(_,current)
      match current.trace-state-of
        Capture-dead -> False
        Capture-spent -> False
        _ -> True
    )

fun compact-captures(values : list<packed-capture>) : list<packed-capture>
  values.filter(packed-active)

fun cut-capture(packed : packed-capture) : ()
  match packed
    Packed-capture(run) ->
      run(fn(root,current) enqueue-trace(root,current))

fun pending-ancestor-loop(parent : maybe<trace<e>>) : <div> bool
  match parent
    Nothing -> False
    Just(current) ->
      match current.trace-state-of
        Capture-pending -> True
        Capture-running -> True
        Capture-dead -> False
        Capture-draft -> pending-ancestor-loop(current.trace-parent-of)
        Capture-live -> pending-ancestor-loop(current.trace-parent-of)
        Capture-spent -> pending-ancestor-loop(current.trace-parent-of)

fun pending-ancestor(parent : maybe<trace<e>>) : bool
  pretend-no-div{ pending-ancestor-loop(parent) }

fun enqueue-trace(root : root<e>, current : trace<e>) : ()
  match current
    Trace-end -> ()
    Trace-read(kind,state,_,_,_,_,_,_) ->
      match load(state)
        Capture-live ->
          store(state,Capture-pending)
          match kind
            Derivation-trace ->
              store(root.root-derive-queue,
                    Cons(Resume-work(current),load(root.root-derive-queue)))
            Effect-trace ->
              store(root.root-effect-queue,
                    Cons(Resume-work(current),load(root.root-effect-queue)))
        Capture-running ->
          // A write from the currently resumed suffix schedules a later turn;
          // the running continuation is never entered recursively.
          store(state,Capture-pending)
          match kind
            Derivation-trace ->
              store(root.root-derive-queue,
                    Cons(Resume-work(current),load(root.root-derive-queue)))
            Effect-trace ->
              store(root.root-effect-queue,
                    Cons(Resume-work(current),load(root.root-effect-queue)))
        _ -> ()

fun notify-source(source : source<a>) : ()
  val active = compact-captures(load(source.source-captures))
  store(source.source-captures,active)
  active.foreach(cut-capture)


// --------------------------------------------------------------------------
// Structured trace retirement
// --------------------------------------------------------------------------

fun collect-retirement(current : trace<e>)
                      : <div> list<() -> <div,exn|e> ()>
  match current
    Trace-end -> []
    Trace-read(_,state,_,child,_,finalize,unlink,_) ->
      match load(state)
        Capture-dead -> []
        _ ->
          store(state,Capture-dead)
          unlink()
          val nested = load(child)
          store(child,Trace-end)
          collect-retirement(nested) ++ [finalize]

fun run-finalizers(finalizers : list<() -> <div,exn|e> ()>)
                  : <div,exn|e> ()
  match finalizers
    Nil -> ()
    Cons(finalize,rest) ->
      finally(fn() run-finalizers(rest),finalize)

fun retire-trace(current : trace<e>) : <div,exn|e> ()
  val finalizers = pretend-no-div{ collect-retirement(current) }
  run-finalizers(finalizers)

fun retire-drafts(values : list<trace<e>>) : <div,exn|e> ()
  match values
    Nil -> ()
    Cons(current,rest) ->
      finally(fn() retire-drafts(rest),fn() retire-trace(current))

fun retire-trace-now(current : trace<e>) : <exn|e> ()
  pretend-no-div{ retire-trace(current) }

fun retire-drafts-now(values : list<trace<e>>) : <exn|e> ()
  pretend-no-div{ retire-drafts(values) }

fun try-retire-trace(current : trace<e>) : e error<()>
  error/try(fn() retire-trace-now(current))

fun try-retire-drafts(values : list<trace<e>>) : e error<()>
  error/try(fn() retire-drafts-now(values))

fun record-draft(root : root<e>, current : trace<e>) : exn ()
  match load(root.root-draft)
    Nothing -> throw("continuation node created outside a draft transaction")
    Just(values) -> store(values,Cons(current,load(values)))

fun attempt-build(root : root<e>,
                  action : () -> <div,exn|e> built-trace<e>)
                 : <div|e> (error<built-trace<e>>,list<trace<e>>)
  val drafts = cell([])
  val previous = load(root.root-draft)
  val result = finally(
    fn() store(root.root-draft,previous),
    fn()
      store(root.root-draft,Just(drafts))
      error/try(action)
  )
  (result,load(drafts))

fun activate-trace-loop(root : root<e>, current : trace<e>) : <div> ()
  match current
    Trace-end -> ()
    Trace-read(_,state,_,child,_,_,_,stale) ->
      match load(state)
        Capture-draft ->
          store(state,Capture-live)
          activate-trace-loop(root,load(child))
          if stale() then enqueue-trace(root,current) else ()
        _ -> ()

fun activate-trace(root : root<e>, current : trace<e>) : ()
  pretend-no-div{ activate-trace-loop(root,current) }

fun with-current(root : root<e>, current : trace<e>,
                 action : () -> <div,exn|e> a) : <div,exn|e> a
  val previous = load(root.root-current)
  finally(
    fn() store(root.root-current,previous),
    fn()
      store(root.root-current,Just(current))
      action()
  )


// --------------------------------------------------------------------------
// Frontier scheduling
// --------------------------------------------------------------------------

fun work-runnable(current : work<e>) : bool
  match current
    Bootstrap-work(live,_) -> load(live)
    Resume-work(capture) ->
      match capture.trace-state-of
        Capture-pending -> !pending-ancestor(capture.trace-parent-of)
        _ -> False

fun work-stale(current : work<e>) : bool
  match current
    Bootstrap-work(live,_) -> !load(live)
    Resume-work(capture) ->
      match capture.trace-state-of
        Capture-dead -> True
        Capture-draft -> True
        Capture-live -> True
        Capture-spent -> True
        _ -> False

fun take-work-loop(values : list<work<e>>, skipped : list<work<e>>)
                  : <div> (maybe<work<e>>,list<work<e>>)
  match values
    Nil -> (Nothing,skipped.reverse)
    Cons(current,rest) ->
      if current.work-runnable
      then (Just(current),skipped.reverse ++ rest)
      elif current.work-stale
      then take-work-loop(rest,skipped)
      else take-work-loop(rest,Cons(current,skipped))

fun take-work(values : list<work<e>>)
             : (maybe<work<e>>,list<work<e>>)
  pretend-no-div{ take-work-loop(values,[]) }

fun queue-work(root : root<e>, kind : trace-kind, current : work<e>) : ()
  match kind
    Derivation-trace ->
      store(root.root-derive-queue,
            Cons(current,load(root.root-derive-queue)))
    Effect-trace ->
      store(root.root-effect-queue,
            Cons(current,load(root.root-effect-queue)))

fun resume-capture(root : root<e>, current : trace<e>)
                   : <div|e> error<()>
  lift-div(fn()
    match current
      Trace-end -> Ok(())
      Trace-read(_,state,_,child,resume,_,_,_) ->
        match load(state)
          Capture-pending ->
            store(state,Capture-running)
            val (attempt,drafts) = pretend-no-div{
              attempt-build(root,fn() with-current(root,current,resume))
            }
            match attempt
              Error(failure) ->
                match load(state)
                  Capture-running -> enqueue-trace(root,current)
                  _ -> ()
                val _ = try-retire-drafts(drafts)
                Error(failure)
              Ok(built) ->
                val publish = built.built-publish
                val publication = pretend-no-div{ publish() }
                match publication
                  Error(failure) ->
                    match load(state)
                      Capture-running -> enqueue-trace(root,current)
                      _ -> ()
                    val _ = try-retire-drafts(drafts)
                    Error(failure)
                  Ok(_) ->
                    val old = load(child)
                    store(child,built.built-root)
                    activate-trace(root,built.built-root)
                    match load(state)
                      Capture-running -> store(state,Capture-live)
                      _ -> ()
                    try-retire-trace(old)
          _ -> Ok(())
  )

fun run-work(root : root<e>, current : work<e>) : <div|e> error<()>
  match current
    Resume-work(capture) -> resume-capture(root,capture)
    Bootstrap-work(live,run) -> if load(live) then run() else Ok(())

fun drain-loop(root : root<e>) : <div|e> error<()>
  val (derivation,derive-rest) = take-work(load(root.root-derive-queue))
  store(root.root-derive-queue,derive-rest)
  match derivation
    Just(current) ->
      match run-work(root,current)
        Error(failure) -> Error(failure)
        Ok(_) -> drain-loop(root)
    Nothing ->
      val (effect-work,effect-rest) = take-work(load(root.root-effect-queue))
      store(root.root-effect-queue,effect-rest)
      match effect-work
        Just(current) ->
          match run-work(root,current)
            Error(failure) -> Error(failure)
            Ok(_) -> drain-loop(root)
        Nothing -> Ok(())

fun flush(root : root<e>) : <div,exn|e> ()
  if load(root.root-disposed) || load(root.root-disposing) ||
     load(root.root-flushing) || load(root.root-batch-depth) > 0
  then ()
  else
    store(root.root-flushing,True)
    val result = lift-exn(fn()
      finally(
        fn() store(root.root-flushing,False),
        fn() drain-loop(root)
      )
    )
    result.untry


// --------------------------------------------------------------------------
// Root and source validation
// --------------------------------------------------------------------------

fun check-root(root : root<e>, key : root-key) : exn ()
  if same-root(root.root-key,key) && !load(root.root-disposed) then ()
  else throw("signal used outside its live reactive root")

fun check-registration(root : root<e>) : exn ()
  if load(root.root-disposed) || load(root.root-disposing)
  then throw("reactive value created in a disposed root")
  else ()

fun new-source(root : root<e>, value : a, equals : (a,a) -> bool) : source<a>
  Source(root.root-key,cell(value),equals,cell(0),cell([]))


// --------------------------------------------------------------------------
// Write and sample interpreters
// --------------------------------------------------------------------------

fun interpret-write(root : root<e>,
                    action : () -> <signal-write,pure|e> a)
                   : <div,exn|e> a
  with handler
    fun write-source(source,value)
      check-root(root,source.source-root)
      val previous = load(source.source-cell)
      val equal = source.source-equals
      if equal(previous,value) then () else
        store(source.source-cell,value)
        store(source.source-version,load(source.source-version) + 1)
        notify-source(source)
        flush(root)

    fun modify-source(source,update)
      check-root(root,source.source-root)
      val previous = load(source.source-cell)
      val value = update(previous)
      val equal = source.source-equals
      if equal(previous,value) then () else
        store(source.source-cell,value)
        store(source.source-version,load(source.source-version) + 1)
        notify-source(source)
        flush(root)

    fun commit-source(source,value)
      check-root(root,source.source-root)
      val previous = load(source.source-cell)
      val equal = source.source-equals
      if equal(previous,value) then () else
        store(source.source-cell,value)
        store(source.source-version,load(source.source-version) + 1)
        notify-source(source)
        flush(root)

    fun enter-batch(key)
      mask<div>
        check-root(root,key)
        store(root.root-batch-depth,load(root.root-batch-depth) + 1)

    fun leave-batch(key)
      check-root(root,key)
      val depth = load(root.root-batch-depth)
      if depth <= 0 then mask<div>{ throw("unbalanced reactive batch") } else
        store(root.root-batch-depth,depth - 1)
        flush(root)

    fun request-flush(key)
      check-root(root,key)
      flush(root)

  action()

fun sample-action(root : root<e>,
                  action : () -> <signal-read,signal-write,pure|e> a)
                 : <signal-write,div,exn|e> a
  with raw ctl read-source(source,_)
    check-root(root,source.source-root)
    rcontext.resume(load(source.source-cell))
  action()

pub fun dispatch(root : root<e>,
                 action : () -> <signal-read,signal-write,pure|e> a)
                : <exn|e> a
  check-root(root,root.root-key)
  pretend-no-div{
    interpret-write(root,fn() sample-action(root,action))
  }


// --------------------------------------------------------------------------
// Reifying exact read suffixes
// --------------------------------------------------------------------------

fun reify-trace(root : root<e>, kind : trace-kind,
                track : () -> <signal-read,pure> a,
                publish : (value : a) -> <signal-write,pure|e> ())
               : <div,exn|e> built-trace<e>
  with handler
        return(value) -> {
          Built-trace(
            Trace-end,
            fn() error/try(fn()
              interpret-write(root,fn() publish(value))
            )
          )
        }
        raw ctl read-source(source,tracked) -> {
          check-root(root,source.source-root)
          if !tracked then rcontext.resume(load(source.source-cell)) else
            val version = load(source.source-version)
            val state = cell(Capture-draft)
            val child = cell(Trace-end)
            val unlink = fn()
              store(source.source-captures,
                    compact-captures(load(source.source-captures)))
            val current = Trace-read(
              kind,
              state,
              load(root.root-current),
              child,
              fn() rcontext.resume(load(source.source-cell)),
              fn() {
                val _ = rcontext.finalize(
                  Built-trace(Trace-end,fn() lift-div(fn() Ok(())))
                )
                ()
              },
              unlink,
              fn() load(source.source-version) != version
            )
            record-draft(root,current)
            store(source.source-captures,
                  Cons(pack-capture(root,current),load(source.source-captures)))
            val nested = with-current(root,current,
              fn() rcontext.resume(load(source.source-cell)))
            store(child,nested.built-root)
            Built-trace(current,nested.built-publish)
        }
  track()


// --------------------------------------------------------------------------
// Roots
// --------------------------------------------------------------------------

fun fresh-root() : root<e>
  Root(
    Root-key(cell(True)),cell([]),cell([]),cell(Nothing),cell(Nothing),cell([]),
    cell(0),cell(False),cell(False),cell(False)
  )

pub fun create-root(action : (root<e>) -> <signal-write,pure|e> a)
                   : <exn|e> (root<e>,a)
  val root = fresh-root()
  pretend-no-div{
    val result = interpret-write(root)
      enter-batch(root.root-key)
      finally(fn() leave-batch(root.root-key),fn() action(root))
    (root,result)
  }

fun dispose-fiber(current : fiber<e>) : <div,exn|e> ()
  if !load(current.fiber-live) then () else
    store(current.fiber-live,False)
    val captured = load(current.fiber-trace)
    store(current.fiber-trace,Trace-end)
    retire-trace(captured)

fun dispose-fibers(values : list<fiber<e>>) : <div,exn|e> ()
  match values
    Nil -> ()
    Cons(current,rest) ->
      finally(fn() dispose-fibers(rest),fn() dispose-fiber(current))

pub fun root/dispose(root : root<e>) : <exn|e> ()
  if load(root.root-disposed) || load(root.root-disposing) then ()
  elif load(root.root-flushing) || load(root.root-current).is-just
    then throw("cannot dispose a reactive root during a computation")
  else pretend-no-div{
    store(root.root-disposing,True)
    finally(
      fn() {
        store(root.root-disposed,True)
        store(root.root-disposing,False)
        store(root.root-derive-queue,[])
        store(root.root-effect-queue,[])
        store(root.root-current,Nothing)
        store(root.root-draft,Nothing)
        store(root.root-fibers,[])
      },
      fn()
        val values = load(root.root-fibers)
        dispose-fibers(values)
    )
  }

pub fun root/is-disposed(root : root<e>) : bool
  load(root.root-disposed)

pub fun update(root : root<e>, action : () -> <signal-write,pure|e> a)
              : <exn|e> a
  dispatch(root,fn() mask<signal-read>{ action() })

pub fun sample(root : root<e>, action : () -> <signal-read,pure|e> a)
              : <exn|e> a
  dispatch(root,fn() mask<signal-write>{ action() })


// --------------------------------------------------------------------------
// Signals and batches
// --------------------------------------------------------------------------

pub fun signal-by(root : root<e>, initial : a,
                  equals : (a,a) -> bool) : exn signal<a>
  check-registration(root)
  Signal(new-source(root,initial,equals))

pub fun signal(root : root<e>, initial : a,
               ?(==) : (a,a) -> bool) : exn signal<a>
  signal-by(root,initial,(==))

pub fun signal-always(root : root<e>, initial : a) : exn signal<a>
  signal-by(root,initial,fn(_,_) False)

pub fun signal/get(signal : signal<a>) : signal-read a
  read-source(signal.signal-source,True)

pub fun signal/set(signal : signal<a>, value : a) : signal-write ()
  write-source(signal.signal-source,value)

pub fun signal/modify(signal : signal<a>, update : a -> a) : signal-write ()
  modify-source(signal.signal-source,update)

pub fun signal/update(signal : signal<a>, update : a -> a) : signal-write ()
  signal.modify(update)

pub fun batch(root : root<e>, action : () -> <signal-write,pure|e1> a)
             : <signal-write,pure|e1> a
  enter-batch(root.root-key)
  finally(fn() leave-batch(root.root-key),action)

pub fun untrack(action : () -> <signal-read,pure|e> a)
               : <signal-read,pure|e> a
  with override fun read-source(source,_)
    read-source(source,False)
  action()


// --------------------------------------------------------------------------
// Continuation-backed effects
// --------------------------------------------------------------------------

fun register-fiber(root : root<e>, current : fiber<e>) : ()
  store(root.root-fibers,Cons(current,load(root.root-fibers)))

fun unregister-fiber(root : root<e>, current : fiber<e>) : ()
  store(root.root-fibers,compact-fibers(load(root.root-fibers)))

fun create-trace-inner(root : root<e>, kind : trace-kind,
                       track : () -> <signal-read,pure> a,
                       apply : (value : a) -> <signal-write,pure|e> ())
                      : <signal-write,pure> disposer<e>
  check-registration(root)
  val live = cell(True)
  val captured = cell(Trace-end)
  val current = Fiber(live,captured)
  register-fiber(root,current)
  val bootstrap = Bootstrap-work(live,fn() lift-div(fn()
    if !load(live) then Ok(()) else
      val (attempt,drafts) = pretend-no-div{
        attempt-build(root,fn()
          reify-trace(root,kind,track,apply)
        )
      }
      match attempt
        Error(failure) ->
          store(live,False)
          unregister-fiber(root,current)
          val _ = try-retire-drafts(drafts)
          Error(failure)
        Ok(built) ->
          val publish = built.built-publish
          val publication = pretend-no-div{ publish() }
          match publication
            Error(failure) ->
              store(live,False)
              unregister-fiber(root,current)
              val _ = try-retire-drafts(drafts)
              Error(failure)
            Ok(_) ->
              store(captured,built.built-root)
              activate-trace(root,built.built-root)
              Ok(())
  ))
  queue-work(root,kind,bootstrap)
  request-flush(root.root-key)
  fn() pretend-no-div{
    if !load(live) then () else
      dispose-fiber(current)
      unregister-fiber(root,current)
  }

fun create-effect-inner(root : root<e>,
                        track : () -> <signal-read,pure> a,
                        apply : (value : a) -> <signal-write,pure|e> ())
                       : <signal-write,pure> disposer<e>
  create-trace-inner(root,Effect-trace,track,apply)

fun derive-by-inner(root : root<e>, initial : a,
                    calculate : () -> <signal-read,pure> a,
                    equals : (a,a) -> bool) : <signal-write,pure> memo<a>
  check-registration(root)
  val source = new-source(root,initial,equals)
  val disposer = create-trace-inner(root,Derivation-trace,calculate,
    fn(value) commit-source(source,value))
  Memo(source)

pub fun derive-by(root : root<e>, initial : a,
                  calculate : () -> <signal-read,pure> a,
                  equals : (a,a) -> bool) : <signal-write,pure> memo<a>
  derive-by-inner(root,initial,calculate,equals)

pub fun derive(root : root<e>, initial : a,
               calculate : () -> <signal-read,pure> a,
               ?(==) : (a,a) -> bool) : <signal-write,pure> memo<a>
  derive-by(root,initial,calculate,(==))

pub fun derive-always(root : root<e>, initial : a,
                      calculate : () -> <signal-read,pure> a)
                     : <signal-write,pure> memo<a>
  derive-by(root,initial,calculate,fn(_,_) False)

pub fun memo/get(memo : memo<a>) : signal-read a
  read-source(memo.memo-source,True)

pub fun create-effect(root : root<e>,
                      track : () -> <signal-read,pure> a,
                      apply : (value : a) -> <signal-write,pure|e> ())
                     : <signal-write,pure> disposer<e>
  create-effect-inner(root,track,apply)
