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

abstract div type trace<e::E>
  Trace-end
  Trace-read(
    trace-kind       : trace-kind,
    trace-state      : ref<global,capture-state>,
    trace-parent     : maybe<trace<e>>,
    trace-child      : ref<global,trace<e>>,
    trace-frame      : ref<global,frame<e>>,
    trace-resume     : (frame<e>) -> <div,exn|e> built-trace<e>,
    trace-finalize   : () -> <div,exn|e> (),
    trace-unlink     : () -> (),
    trace-stale      : () -> bool
  )

abstract type built-trace<e::E>
  Built-trace(
    built-root    : trace<e>,
    built-publish : () -> <div|e> error<()>
  )

type scope-state
  Scope-starting
  Scope-live
  Scope-branch-dead
  Scope-dead

abstract type owned<e::E>
  Owned-end
  Owned-fork(owned-scope : scope<e>, owned-next : owned<e>)
  Owned-cleanup(
    cleanup-live   : ref<global,bool>,
    cleanup-action : () -> <div,exn|e> (),
    cleanup-next   : owned<e>
  )

abstract type scope<e::E>
  Scope(
    scope-state  : ref<global,scope-state>,
    scope-prefix : ref<global,owned<e>>,
    scope-body   : ref<global,trace<e>>,
    scope-parent : maybe<trace<e>>
  )

abstract type frame<e::E>
  Frame(
    frame-token : ref<global,scope-state>,
    frame-owned : ref<global,owned<e>>
  )

abstract type work<e::E>
  Resume-work(resume-trace : trace<e>)
  Bootstrap-work(
    bootstrap-scope : scope<e>,
    bootstrap-run  : () -> <div|e> error<()>
  )

abstract type root<e::E>
  Root(
    root-key          : root-key,
    root-derive-queue : ref<global,list<work<e>>>,
    root-effect-queue : ref<global,list<work<e>>>,
    root-current      : ref<global,maybe<trace<e>>>,
    root-current-frame: ref<global,frame<e>>,
    root-draft        : ref<global,maybe<ref<global,list<trace<e>>>>>,
    root-token        : ref<global,scope-state>,
    root-owned        : ref<global,owned<e>>,
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
    Trace-read(_,state,_,_,_,_,_,_,_) -> load(state)

fun trace-parent-of(current : trace<e>) : maybe<trace<e>>
  match current
    Trace-end -> Nothing
    Trace-read(_,_,parent,_,_,_,_,_,_) -> parent

fun trace-active(current : trace<e>) : bool
  match current.trace-state-of
    Capture-dead -> False
    _ -> True

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
    Trace-read(kind,state,_,_,_,_,_,_,_) ->
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
    Trace-read(_,state,_,child,current-frame-slot,_,finalize,unlink,_) ->
      match load(state)
        Capture-dead -> []
        _ ->
          val current-frame = load(current-frame-slot)
          store(state,Capture-dead)
          store(current-frame.frame-token,Scope-branch-dead)
          unlink()
          val nested = load(child)
          store(child,Trace-end)
          val structural = load(current-frame.frame-owned)
          store(current-frame.frame-owned,Owned-end)
          collect-retirement(nested) ++
          collect-owned(structural) ++ [finalize]

fun collect-scope(current : scope<e>)
                 : <div> list<() -> <div,exn|e> ()>
  match load(current.scope-state)
    Scope-dead -> []
    _ ->
      store(current.scope-state,Scope-dead)
      val body = load(current.scope-body)
      val structural-prefix = load(current.scope-prefix)
      store(current.scope-body,Trace-end)
      store(current.scope-prefix,Owned-end)
      collect-retirement(body) ++ collect-owned(structural-prefix)

// Structural children are completely marked dead before cleanup actions are
// allowed to run. This is what makes self-disposal and cleanup-triggered writes
// unable to re-enter a half-retired subtree.
fun collect-owned-forks(values : owned<e>)
                       : <div> list<() -> <div,exn|e> ()>
  match values
    Owned-end -> []
    Owned-fork(current,next) ->
      collect-scope(current) ++ collect-owned-forks(next)
    Owned-cleanup(_,_,next) -> collect-owned-forks(next)

fun collect-owned-cleanups(values : owned<e>)
                          : <div> list<() -> <div,exn|e> ()>
  match values
    Owned-end -> []
    Owned-fork(_,next) -> collect-owned-cleanups(next)
    Owned-cleanup(live,action,next) ->
      if !load(live) then collect-owned-cleanups(next) else
        store(live,False)
        Cons(action,collect-owned-cleanups(next))

fun collect-owned(values : owned<e>)
                 : <div> list<() -> <div,exn|e> ()>
  collect-owned-forks(values) ++ collect-owned-cleanups(values)

fun run-finalizers(finalizers : list<() -> <div,exn|e> ()>)
                  : <div,exn|e> ()
  match finalizers
    Nil -> ()
    Cons(finalize,rest) ->
      finally(fn() run-finalizers(rest),finalize)

fun retire-trace(current : trace<e>) : <div,exn|e> ()
  val finalizers = pretend-no-div{ collect-retirement(current) }
  run-finalizers(finalizers)

fun retire-owned(values : owned<e>) : <div,exn|e> ()
  val finalizers = pretend-no-div{ collect-owned(values) }
  run-finalizers(finalizers)

fun retire-scope(current : scope<e>) : <div,exn|e> ()
  val finalizers = pretend-no-div{ collect-scope(current) }
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

fun try-retire-owned(values : owned<e>) : e error<()>
  error/try(fn() pretend-no-div{ retire-owned(values) })

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
    Trace-read(_,state,_,child,current-frame-slot,_,_,_,stale) ->
      match load(state)
        Capture-draft ->
          val current-frame = load(current-frame-slot)
          store(state,Capture-live)
          store(current-frame.frame-token,Scope-live)
          activate-trace-loop(root,load(child))
          if stale() then enqueue-trace(root,current) else ()
        _ -> ()

fun activate-trace(root : root<e>, current : trace<e>) : ()
  pretend-no-div{ activate-trace-loop(root,current) }

fun with-frame(root : root<e>, current : frame<e>,
               action : () -> <div,exn|e> a) : <div,exn|e> a
  val previous = load(root.root-current-frame)
  finally(
    fn() store(root.root-current-frame,previous),
    fn()
      store(root.root-current-frame,current)
      action()
  )

fun with-current(root : root<e>, current : trace<e>, current-frame : frame<e>,
                 action : () -> <div,exn|e> a) : <div,exn|e> a
  with-context(root,Just(current),current-frame,action)

fun with-context(root : root<e>, current : maybe<trace<e>>,
                 current-frame : frame<e>,
                 action : () -> <div,exn|e> a) : <div,exn|e> a
  val previous = load(root.root-current)
  finally(
    fn() store(root.root-current,previous),
    fn()
      store(root.root-current,current)
      with-frame(root,current-frame,action)
  )


// --------------------------------------------------------------------------
// Frontier scheduling
// --------------------------------------------------------------------------

fun work-runnable(current : work<e>) : bool
  match current
    Bootstrap-work(scope,_) ->
      match load(scope.scope-state)
        Scope-starting -> !pending-ancestor(scope.scope-parent)
        _ -> False
    Resume-work(capture) ->
      match capture.trace-state-of
        Capture-pending -> !pending-ancestor(capture.trace-parent-of)
        _ -> False

fun work-stale(current : work<e>) : bool
  match current
    Bootstrap-work(scope,_) ->
      match load(scope.scope-state)
        Scope-starting -> False
        _ -> True
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

fun abandon-draft-frame(current : frame<e>, drafts : list<trace<e>>) : e ()
  store(current.frame-token,Scope-branch-dead)
  val structural = load(current.frame-owned)
  store(current.frame-owned,Owned-end)
  val _ = try-retire-drafts(drafts)
  val _ = try-retire-owned(structural)
  ()

fun resume-capture(root : root<e>, current : trace<e>)
                   : <div|e> error<()>
  lift-div(fn()
    match current
      Trace-end -> Ok(())
      Trace-read(_,state,_,child,current-frame-slot,resume,_,_,_) ->
        match load(state)
          Capture-pending ->
            store(state,Capture-running)
            val old-frame = load(current-frame-slot)
            val draft-owned = cell(Owned-end)
            val draft-frame = Frame(cell(Scope-starting),draft-owned)
            val resume-draft = fn() resume(draft-frame)
            val (attempt,drafts) = pretend-no-div{
              attempt-build(root,{
                with-current(root,current,draft-frame,resume-draft)
              })
            }
            match attempt
              Error(failure) ->
                match load(state)
                  Capture-running -> enqueue-trace(root,current)
                  _ -> ()
                abandon-draft-frame(draft-frame,drafts)
                Error(failure)
              Ok(built) ->
                val publish = built.built-publish
                // The previous suffix generation is structurally dead before
                // the replacement apply runs. Cleanups can write, but every
                // descendant continuation and bootstrap has already been cut.
                val old = load(child)
                store(child,Trace-end)
                store(old-frame.frame-token,Scope-branch-dead)
                // From this point onward self-disposal must see and kill the
                // in-flight generation, never the already detached one.
                store(current-frame-slot,draft-frame)
                val old-owned = load(old-frame.frame-owned)
                store(old-frame.frame-owned,Owned-end)
                val retirement = pretend-no-div{
                  collect-retirement(old) ++ collect-owned(old-owned)
                }
                val retired = pretend-no-div{
                  error/try(fn() run-finalizers(retirement))
                }
                match retired
                  Error(failure) ->
                    match load(state)
                      Capture-running -> enqueue-trace(root,current)
                      _ -> ()
                    abandon-draft-frame(draft-frame,drafts)
                    Error(failure)
                  Ok(_) ->
                    match load(state)
                      Capture-dead ->
                        abandon-draft-frame(draft-frame,drafts)
                        Ok(())
                      _ ->
                        val publication = pretend-no-div{ publish() }
                        match publication
                          Error(failure) ->
                            match load(state)
                              Capture-running -> enqueue-trace(root,current)
                              _ -> ()
                            abandon-draft-frame(draft-frame,drafts)
                            Error(failure)
                          Ok(_) ->
                            match load(state)
                              Capture-dead ->
                                abandon-draft-frame(draft-frame,drafts)
                                Ok(())
                              _ ->
                                store(child,built.built-root)
                                activate-trace(root,built.built-root)
                                store(draft-frame.frame-token,Scope-live)
                                match load(state)
                                  Capture-running -> store(state,Capture-live)
                                  _ -> ()
                                Ok(())
          _ -> Ok(())
  )

fun run-work(root : root<e>, current : work<e>) : <div|e> error<()>
  match current
    Resume-work(capture) -> resume-capture(root,capture)
    Bootstrap-work(scope,run) ->
      match load(scope.scope-state)
        Scope-starting -> run()
        _ -> Ok(())

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

fun check-frame-registration(root : root<e>, current : frame<e>) : exn ()
  check-registration(root)
  match load(current.frame-token)
    Scope-starting -> ()
    Scope-live -> ()
    _ -> throw("reactive value created under a retired continuation branch")

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
          val terminal = load(root.root-current-frame)
          val checkpoint = load(root.root-current)
          Built-trace(
            Trace-end,
            fn() error/try(fn()
              with-context(root,checkpoint,terminal,
                fn() interpret-write(root,fn() publish(value)))
            )
          )
        }
        raw ctl read-source(source,tracked) -> {
          check-root(root,source.source-root)
          if !tracked then rcontext.resume(load(source.source-cell)) else
            val version = load(source.source-version)
            val state = cell(Capture-draft)
            val child = cell(Trace-end)
            val token = cell(Scope-starting)
            val owned = cell(Owned-end)
            val current-frame = Frame(token,owned)
            val current-frame-slot = cell(current-frame)
            val unlink = fn()
              store(source.source-captures,
                    compact-captures(load(source.source-captures)))
            val current = Trace-read(
              kind,
              state,
              load(root.root-current),
              child,
              current-frame-slot,
              fn(_) rcontext.resume(load(source.source-cell)),
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
            val nested = with-current(root,current,current-frame,
              fn() rcontext.resume(load(source.source-cell)))
            store(child,nested.built-root)
            Built-trace(current,nested.built-publish)
        }
  track()


// --------------------------------------------------------------------------
// Roots
// --------------------------------------------------------------------------

fun fresh-root() : root<e>
  val token = cell(Scope-live)
  val owned = cell(Owned-end)
  val current-frame = cell(Frame(token,owned))
  Root(
    Root-key(cell(True)),cell([]),cell([]),cell(Nothing),current-frame,
    cell(Nothing),token,owned,cell(0),cell(False),cell(False),cell(False)
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

pub fun root/dispose(root : root<e>) : <exn|e> ()
  if load(root.root-disposed) || load(root.root-disposing) then ()
  elif load(root.root-flushing) || load(root.root-current).is-just
    then throw("cannot dispose a reactive root during a computation")
  else pretend-no-div{
    store(root.root-disposing,True)
    store(root.root-token,Scope-dead)
    finally(
      fn() {
        store(root.root-disposed,True)
        store(root.root-disposing,False)
        store(root.root-derive-queue,[])
        store(root.root-effect-queue,[])
        store(root.root-current,Nothing)
        store(root.root-draft,Nothing)
        store(root.root-owned,Owned-end)
      },
      fn()
        val values = load(root.root-owned)
        val finalizers = collect-owned(values)
        run-finalizers(finalizers)
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

fun create-trace-inner(root : root<e>, kind : trace-kind,
                       track : () -> <signal-read,pure> a,
                       apply : (value : a) -> <signal-write,pure|e> ())
                      : <signal-write,pure> disposer<e>
  val owner = load(root.root-current-frame)
  check-frame-registration(root,owner)
  val state = cell(Scope-starting)
  val structural-prefix = cell(Owned-end)
  val body = cell(Trace-end)
  val current = Scope(state,structural-prefix,body,load(root.root-current))
  store(owner.frame-owned,
        Owned-fork(current,load(owner.frame-owned)))
  val bootstrap = Bootstrap-work(current,fn() lift-div(fn()
    match load(state)
      Scope-starting ->
        val scope-frame = Frame(state,structural-prefix)
        val (attempt,drafts) = pretend-no-div{
          attempt-build(root,fn()
            with-context(root,current.scope-parent,scope-frame,
              fn() reify-trace(root,kind,track,apply))
          )
        }
        match attempt
          Error(failure) ->
            val _ = pretend-no-div{ error/try(fn() retire-scope(current)) }
            val _ = try-retire-drafts(drafts)
            Error(failure)
          Ok(built) ->
            val publish = built.built-publish
            val publication = pretend-no-div{ publish() }
            match publication
              Error(failure) ->
                val _ = pretend-no-div{ error/try(fn() retire-scope(current)) }
                val _ = try-retire-drafts(drafts)
                Error(failure)
              Ok(_) ->
                match load(state)
                  Scope-starting ->
                    store(body,built.built-root)
                    activate-trace(root,built.built-root)
                    store(state,Scope-live)
                    Ok(())
                  _ ->
                    val _ = try-retire-drafts(drafts)
                    Ok(())
      _ -> Ok(())
  ))
  queue-work(root,kind,bootstrap)
  request-flush(root.root-key)
  fn() pretend-no-div{
    retire-scope(current)
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

pub fun on-cleanup(root : root<e>,
                   cleanup : () -> <signal-write,pure|e> ()) : exn ()
  val current = load(root.root-current-frame)
  val checkpoint = load(root.root-current)
  check-frame-registration(root,current)
  val live = cell(True)
  val action = fn()
    with-context(root,checkpoint,current,
      fn() interpret-write(root,cleanup))
  store(current.frame-owned,
        Owned-cleanup(live,action,load(current.frame-owned)))
