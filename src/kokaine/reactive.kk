/*--------------------------------------------------------------------------
  Kokaine: an effect-typed, continuation-indexed reactive runtime.

  There is deliberately no root-wide dependency graph. Tracked reads install
  source-local subscriptions to the current one-shot wake token. The token
  owns cancellation for that captured generation; captured owner-generation
  capabilities retire stale child work, while direct observer handles form
  only scheduler and ownership scopes.
--------------------------------------------------------------------------*/
module kokaine/reactive

import std/core/unsafe
import std/core/undiv

type observer-kind
  Derivation
  User-effect

abstract type root-key
  Root-key(root-key-cell : ref<global,bool>)

// An owned observer captures the exact continuation generation that created
// it, including that generation's checkpoint cell. The parent link is a linear
// lifetime scope, not a reactive dependency: reads never add owner links, and
// every generation has at most one parent.
abstract type owner-generation
  Owner-generation(
    generation-live   : ref<global,bool>,
    generation-fired  : ref<global,bool>,
    generation-validating : ref<global,bool>,
    generation-parent : maybe<owner-generation>,
    generation-dependencies : ref<global,list<dependency-stamp>>
  )


// --------------------------------------------------------------------------
// Source-local continuation trace
// --------------------------------------------------------------------------

abstract type source-subscription
  Source-subscription(
    subscription-live : ref<global,bool>,
    subscription-wake : () -> ()
  )

// A memo source carries only effect-erased latches, its captured owner scope,
// and continuation-owned dependency checkpoints. It never retains the root or
// typed observer.
abstract type producer-state
  Producer-state(
    producer-live         : ref<global,bool>,
    producer-dirty        : ref<global,bool>,
    producer-running      : ref<global,bool>,
    producer-owner-generation : ref<global,maybe<owner-generation>>,
    producer-dependencies : ref<global,list<dependency-stamp>>
  )

// A checkpoint records the version returned by one tracked read and, for a
// memo, the effect-erased producer needed to validate that version lazily.
// This is a generation trace, not a root registry or an observer edge table.
abstract type dependency-stamp
  Dependency-stamp(
    stamp-version  : ref<global,int>,
    stamp-observed : int,
    stamp-producer : maybe<producer-state>
  )

// Sources retain their subscribers directly. There are no source IDs, source
// registry, reverse observer edge list, or graph lookup.
abstract type source<a>
  Source(
    source-root        : root-key,
    source-cell        : ref<global,a>,
    source-equals      : (a,a) -> bool,
    source-version     : ref<global,int>,
    source-subscribers : ref<global,list<source-subscription>>,
    source-producer    : maybe<producer-state>
  )


// --------------------------------------------------------------------------
// Public capabilities and values
// --------------------------------------------------------------------------

pub effect signal-read
  fun read-source(source : source<a>, tracked : bool) : a

pub effect signal-write
  fun write-source(source : source<a>, value : a) : ()
  fun modify-source(source : source<a>, update : a -> a) : ()
  fun commit-source(source : source<a>, value : a) : ()
  fun enter-batch(key : root-key) : ()
  fun leave-batch(key : root-key) : ()
  fun request-flush(key : root-key) : ()

pub alias reactive = <signal-read,signal-write>

abstract value type signal<a>
  Signal(source : source<a>)

abstract value type memo<a>
  Memo(source : source<a>)

pub alias disposer<e> = () -> <pure|e> ()


// --------------------------------------------------------------------------
// Continuation processes and direct scheduler state
// --------------------------------------------------------------------------

// One token represents one captured dependency and ownership generation.
// Every read in the generation subscribes this same token; fired is the
// one-shot scheduling latch, and cancellations eagerly remove source-local
// links on restart.
abstract type wake-token
  Wake-token(
    token-live          : ref<global,bool>,
    token-fired         : ref<global,bool>,
    token-generation    : owner-generation,
    token-cancellations : ref<global,list<() -> ()>>,
    token-dependencies  : ref<global,list<dependency-stamp>>,
    token-wake          : () -> ()
  )

effect observer-suspend
  ctl suspend-observer(outcome : error<()>) : ()

abstract type observer-process<e::E>
  Observer-process-done
  Observer-process-paused(
    process-outcome  : error<()>,
    process-resume   : () -> <signal-read,signal-write,pure|e> observer-process<e>,
    process-finalize : () -> <signal-read,signal-write,pure|e> observer-process<e>
  )

// These latches are scheduler state, not a dependency graph: live controls
// lifetime, dirty/queued implement one-shot work scheduling, and running
// detects recursive producer pulls.
abstract type observer<e::E>
  Observer(
    observer-kind      : observer-kind,
    observer-live      : ref<global,bool>,
    observer-dirty     : ref<global,bool>,
    observer-queued    : ref<global,bool>,
    observer-running   : ref<global,bool>,
    observer-token     : ref<global,maybe<wake-token>>,
    observer-dependencies : ref<global,list<dependency-stamp>>,
    observer-owner-generation : ref<global,maybe<owner-generation>>,
    observer-children  : ref<global,list<observer<e>>>,
    observer-cleanups  : ref<global,list<() -> <signal-write,pure|e> ()>>,
    observer-unlink    : ref<global,maybe<() -> ()>>,
    observer-action    : ref<global,maybe<() -> <signal-read,signal-write,pure|e> ()>>,
    observer-process   : ref<global,maybe<observer-process<e>>>
  )

// Queues contain direct handles. The root has no source or observer registry,
// no integer node identities, no ranks, and no Pending propagation state.
abstract type root<e::E>
  Root(
    root-key             : root-key,
    root-derive-queue    : ref<global,list<observer<e>>>,
    root-effect-queue    : ref<global,list<observer<e>>>,
    root-batch-depth     : ref<global,int>,
    root-is-flushing     : ref<global,bool>,
    root-current-token   : ref<global,maybe<wake-token>>,
    root-current-owner   : ref<global,maybe<observer<e>>>,
    root-children        : ref<global,list<observer<e>>>,
    root-cleanups        : ref<global,list<() -> <signal-write,pure|e> ()>>,
    root-disposing       : ref<global,bool>,
    root-disposed        : ref<global,bool>
  )


// --------------------------------------------------------------------------
// Encapsulated persistent cells
// --------------------------------------------------------------------------

fun cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(cell : ref<global,a>) : a
  unsafe-total { !cell }

fun store(cell : ref<global,a>, value : a) : ()
  unsafe-total { cell := value }

fun generation-active-loop(generation : owner-generation) : <div> bool
  if !load(generation.generation-live) ||
     load(generation.generation-fired)
  then False
  else match generation.generation-parent
    Nothing -> True
    Just(parent) -> generation-active-loop(parent)

fun generation-active(generation : owner-generation) : bool
  // Owner generations are created only by linking a new child scope to an
  // already existing ancestor, so this chain is finite and acyclic.
  pretend-no-div{ generation-active-loop(generation) }

// --------------------------------------------------------------------------
// Source-local subscriptions and captured cancellation
// --------------------------------------------------------------------------

fun subscription-active(subscription : source-subscription) : bool
  load(subscription.subscription-live)

fun compact-subscriptions(subscriptions : list<source-subscription>)
                         : list<source-subscription>
  subscriptions.filter(subscription-active)

fun fire-token(token : wake-token) : ()
  if !generation-active(token.token-generation) then () else
    store(token.token-fired,True)
    val wake = token.token-wake
    wake()

fun has-dependency(dependencies : list<dependency-stamp>,
                   version : ref<global,int>) : bool
  match dependencies
    Nil -> False
    Cons(stamp,rest) ->
      unsafe-ptr-eq(stamp.stamp-version,version) ||
      has-dependency(rest,version)

fun subscribe-source(token : wake-token, source : source<a>, observed : int) : ()
  if !load(token.token-live) ||
     has-dependency(load(token.token-dependencies),source.source-version)
  then () else
    val link-live = cell(True)
    val subscription = Source-subscription(
      link-live,
      fn() fire-token(token)
    )
    store(source.source-subscribers,
          Cons(subscription,load(source.source-subscribers)))
    val cancel = fn()
      store(link-live,False)
      store(source.source-subscribers,
            compact-subscriptions(load(source.source-subscribers)))
    store(token.token-cancellations,
          Cons(cancel,load(token.token-cancellations)))
    store(token.token-dependencies,
          Cons(Dependency-stamp(source.source-version,
                                observed,
                                source.source-producer),
               load(token.token-dependencies)))

fun run-cancellations(cancellations : list<() -> ()>) : <div> ()
  match cancellations
    Nil -> ()
    Cons(cancel,rest) ->
      cancel()
      run-cancellations(rest)

fun cancel-token(token : wake-token) : <div> ()
  store(token.token-live,False)
  val cancellations = load(token.token-cancellations)
  store(token.token-cancellations,[])
  store(token.token-dependencies,[])
  run-cancellations(cancellations)

fun cancel-observer-token(observer : observer<e>) : <div> ()
  val current = load(observer.observer-token)
  store(observer.observer-token,Nothing)
  match current
    Nothing -> ()
    Just(token) -> cancel-token(token)

fun notify-source(root : root<e>, source : source<a>) : <div> ()
  if load(root.root-disposing) || load(root.root-disposed) then () else
    val active = compact-subscriptions(load(source.source-subscribers))
    store(source.source-subscribers,active)
    active.foreach fn(subscription)
      val wake = subscription.subscription-wake
      wake()

fun new-source(root : root<e>, value : a, equals : (a,a) -> bool,
               producer : maybe<producer-state>) : source<a>
  Source(root.root-key,value.cell,equals,cell(0),cell([]),producer)


// --------------------------------------------------------------------------
// Direct work queues
// --------------------------------------------------------------------------

fun observer-alive(observer : observer<e>) : bool
  load(observer.observer-live)

fun compact-observers(observers : list<observer<e>>) : list<observer<e>>
  observers.filter(observer-alive)

fun enqueue-observer(root : root<e>, observer : observer<e>) : ()
  if !load(observer.observer-live) || load(observer.observer-queued) then () else
    store(observer.observer-queued,True)
    match observer.observer-kind
      Derivation ->
        store(root.root-derive-queue,
              Cons(observer,load(root.root-derive-queue)))
      User-effect ->
        store(root.root-effect-queue,
              Cons(observer,load(root.root-effect-queue)))

fun queue-observer(root : root<e>, observer : observer<e>) : ()
  if !load(observer.observer-live) then () else
    store(observer.observer-dirty,True)
    enqueue-observer(root,observer)

fun new-wake-token(root : root<e>, observer : observer<e>) : wake-token
  val live = cell(True)
  val fired = cell(False)
  val generation = Owner-generation(
    live,fired,cell(False),load(observer.observer-owner-generation),
    observer.observer-dependencies
  )
  Wake-token(live,fired,generation,cell([]),observer.observer-dependencies,
             fn() queue-observer(root,observer))

// Producer pulls select their exact direct handle by the private dirty latch.
// Pointer identity here is an opaque queue ticket, not a node ID or registry.
fun restore-skipped-observers(skipped : list<observer<e>>,
                              remaining : list<observer<e>>)
                             : <div> list<observer<e>>
  match skipped
    Nil -> remaining
    Cons(observer,rest) ->
      restore-skipped-observers(rest,Cons(observer,remaining))

fun extract-observer-loop(observers : list<observer<e>>,
                          target : ref<global,bool>,
                          skipped : list<observer<e>>)
                         : <div> (maybe<observer<e>>,list<observer<e>>)
  match observers
    Nil -> (Nothing,restore-skipped-observers(skipped,[]))
    Cons(observer,rest) ->
      if unsafe-ptr-eq(observer.observer-dirty,target) then
        store(observer.observer-queued,False)
        (Just(observer),restore-skipped-observers(skipped,rest))
      else
        extract-observer-loop(rest,target,Cons(observer,skipped))

fun extract-observer(observers : list<observer<e>>,
                     target : ref<global,bool>)
                    : <div> (maybe<observer<e>>,list<observer<e>>)
  extract-observer-loop(observers,target,[])

fun take-queued-observer(queue : ref<global,list<observer<e>>>,
                         target : ref<global,bool>)
                        : <div> maybe<observer<e>>
  val (found,remaining) = extract-observer(load(queue),target)
  store(queue,remaining)
  found

fun pop-queued(root : root<e>, queue : ref<global,list<observer<e>>>)
              : <div,exn|e> maybe<observer<e>>
  match load(queue)
    Nil -> Nothing
    Cons(observer,rest) ->
      store(queue,rest)
      store(observer.observer-queued,False)
      if !load(observer.observer-live) || !load(observer.observer-dirty)
      then pop-queued(root,queue)
      else
        val completed = cell(False)
        val active = finally(
          fn() {
            // Owner checkpoint settlement can fail. Preserve the candidate's
            // direct ticket so a later retry cannot lose dirty work.
            if load(completed) || !load(observer.observer-live) ||
               !load(observer.observer-dirty)
            then ()
            else enqueue-observer(root,observer)
          },
          fn()
            val current = validate-owner-generation(
              root,load(observer.observer-owner-generation)
            )
            store(completed,True)
            current
        )
        // Leave the failure-preserving finally frame before skipping a stale
        // ticket. This keeps large retired ownership fan-outs tail recursive.
        // The pending owner rerun owns disposal of each stale observer.
        if active then Just(observer) else pop-queued(root,queue)


// --------------------------------------------------------------------------
// Direct ownership scopes and disposal
// --------------------------------------------------------------------------

fun add-child(root : root<e>, observer : observer<e>) : exn ()
  match load(root.root-current-owner)
    Nothing ->
      store(observer.observer-owner-generation,Nothing)
      store(root.root-children,
            Cons(observer,load(root.root-children)))
      store(observer.observer-unlink,Just(fn()
        store(root.root-children,
              compact-observers(load(root.root-children)))
      ))
    Just(owner) ->
      if !load(owner.observer-live) then () else
        match load(owner.observer-token)
          Nothing -> throw("reactive owner has no active generation")
          Just(token) ->
            store(observer.observer-owner-generation,
                  Just(token.token-generation))
            store(owner.observer-children,
                  Cons(observer,load(owner.observer-children)))
            store(observer.observer-unlink,Just(fn()
              store(owner.observer-children,
                    compact-observers(load(owner.observer-children)))
            ))

fun run-cleanups(cleanups : list<() -> <signal-write,pure|e> ()>)
                 : <signal-write,pure|e> ()
  match cleanups
    Nil -> ()
    Cons(cleanup,rest) ->
      finally(fn() run-cleanups(rest),cleanup)

fun collect-owned(pending : list<observer<e>>,
                  ordered : list<observer<e>>) : <div> list<observer<e>>
  match pending
    Nil -> ordered
    Cons(current,rest) ->
      if !load(current.observer-live)
      then collect-owned(rest,ordered)
      else
        store(current.observer-live,False)
        store(current.observer-dirty,False)
        store(current.observer-queued,False)
        val children = load(current.observer-children)
        store(current.observer-children,[])
        val next = children.foldl(rest,fn(acc,child) Cons(child,acc))
        collect-owned(next,Cons(current,ordered))

fun cancel-observer-tokens(observers : list<observer<e>>) : <div> ()
  match observers
    Nil -> ()
    Cons(observer,rest) ->
      cancel-observer-token(observer)
      cancel-observer-tokens(rest)

fun clean-observers(observers : list<observer<e>>)
                    : <signal-write,pure|e> ()
  match observers
    Nil -> ()
    Cons(observer,rest) ->
      val cleanups = load(observer.observer-cleanups)
      store(observer.observer-cleanups,[])
      finally(fn() clean-observers(rest),fn() run-cleanups(cleanups))

fun finalize-observer-processes(root : root<e>,
                                observers : list<observer<e>>)
                               : <signal-write,pure|e> ()
  match observers
    Nil -> ()
    Cons(observer,rest) ->
      finally(
        fn() finalize-observer-processes(root,rest),
        fn()
          mask<signal-write>
            dispatch(root,fn() finalize-observer-process(observer))
      )

fun unlink-observers(observers : list<observer<e>>) : <div> ()
  match observers
    Nil -> ()
    Cons(observer,rest) ->
      val unlink = load(observer.observer-unlink)
      store(observer.observer-unlink,Nothing)
      store(observer.observer-owner-generation,Nothing)
      match unlink
        Just(action) -> action()
        Nothing -> ()
      unlink-observers(rest)

fun dispose-collected(root : root<e>, observers : list<observer<e>>)
                      : <signal-write,pure|e> ()
  cancel-observer-tokens(observers)
  finally(
    fn() unlink-observers(observers),
    fn()
      finally(
        fn() clean-observers(observers),
        fn() finalize-observer-processes(root,observers)
      )
  )

fun dispose-observers(root : root<e>, observers : list<observer<e>>)
                     : <signal-write,pure|e> ()
  val ordered = pretend-no-div{ collect-owned(observers,[]) }
  dispose-collected(root,ordered)

fun dispose-observer-inner(root : root<e>, observer : observer<e>)
                          : <signal-write,pure|e> ()
  dispose-observers(root,[observer])

fun reset-owned(root : root<e>, observer : observer<e>)
                : <signal-write,pure|e> ()
  val children = load(observer.observer-children)
  store(observer.observer-children,[])
  val cleanups = load(observer.observer-cleanups)
  store(observer.observer-cleanups,[])
  finally(fn() run-cleanups(cleanups),
          fn() dispose-observers(root,children))


// --------------------------------------------------------------------------
// Continuation-backed observer processes
// --------------------------------------------------------------------------

fun suspend-observer-context(outcome : error<()>)
                            : <observer-suspend,signal-read,signal-write,pure|e> ()
  mask<signal-read>
    mask<signal-write>
      mask<exn>
        mask<div>{ suspend-observer(outcome) }

fun attempt-observer(action : () -> <signal-read,signal-write,pure|e> ())
                    : <observer-suspend,signal-read,signal-write,pure|e> error<()>
  mask<observer-suspend>{ mask<exn>{ error/try(action) } }

fun observer-cycle(action : () -> <signal-read,signal-write,pure|e> ())
                  : <observer-suspend,signal-read,signal-write,pure|e> ()
  val outcome = attempt-observer(action)
  suspend-observer-context(outcome)
  observer-cycle(action)

fun reify-observer(action : () -> <signal-read,signal-write,pure|e> ())
                  : <signal-read,signal-write,pure|e> observer-process<e>
  with raw ctl suspend-observer(outcome)
    Observer-process-paused(
      outcome,
      fn() rcontext.resume(()),
      fn() rcontext.finalize(Observer-process-done)
    )
  suspend-observer-context(Ok(()))
  observer-cycle(action)
  Observer-process-done

fun advance-observer(observer : observer<e>)
                    : <signal-read,signal-write,pure|e> ()
  val process = match load(observer.observer-process)
                  Just(current) -> current
                  Nothing ->
                    match load(observer.observer-action)
                      Nothing -> throw("reactive observer has no continuation")
                      Just(action) ->
                        val initial = reify-observer(action)
                        store(observer.observer-process,Just(initial))
                        initial
  match process
    Observer-process-done ->
      throw("reactive observer continuation terminated")
    Observer-process-paused(_,resume-process,_) ->
      store(observer.observer-process,Nothing)
      val next = resume-process()
      if !load(observer.observer-live)
      then finalize-process(next)
      else store(observer.observer-process,Just(next))
      match next
        Observer-process-done ->
          if !load(observer.observer-live) then ()
          else throw("reactive observer continuation terminated")
        Observer-process-paused(outcome,_,_) -> outcome.untry

fun finalize-process(process : observer-process<e>)
                    : <signal-read,signal-write,pure|e> ()
  match process
    Observer-process-done -> ()
    Observer-process-paused(_,_,finalize-current) ->
      val finalized = finalize-current()
      ()

fun finalize-observer-process(observer : observer<e>)
                             : <signal-read,signal-write,pure|e> ()
  val process = load(observer.observer-process)
  store(observer.observer-action,Nothing)
  store(observer.observer-process,Nothing)
  match process
    Nothing -> ()
    Just(current) -> finalize-process(current)


// --------------------------------------------------------------------------
// Pull settlement and continuation scheduler
// --------------------------------------------------------------------------

fun same-root(left : root-key, right : root-key) : bool
  unsafe-ptr-eq(left.root-key-cell,right.root-key-cell)

fun check-root(root : root<e>, key : root-key) : exn ()
  if same-root(root.root-key,key) && !load(root.root-disposed) then ()
  else throw("signal used outside its live reactive root")

fun check-public-write(root : root<e>) : exn ()
  match load(root.root-current-token)
    Nothing -> ()
    Just(_) -> throw("signal write attempted during dependency tracking")

fun check-registration(root : root<e>) : exn ()
  if load(root.root-disposed) || load(root.root-disposing)
  then throw("reactive value created in a disposed root")
  else
    check-public-write(root)
    match load(root.root-current-owner)
      Nothing -> ()
      Just(owner) ->
        if load(owner.observer-live) then ()
        else throw("reactive value created under a disposed owner")

fun settle-observer(root : root<e>, observer : observer<e>) : <pure|e> ()
  if !load(observer.observer-live) || !load(observer.observer-dirty) then ()
  elif load(observer.observer-running)
    then throw("reactive observer recursively re-entered")
  else run-observer(root,observer)

fun check-producer(root : root<e>, producer : producer-state) : <div,exn|e> ()
  if !load(producer.producer-live)
  then throw("memo producer was disposed")
  elif load(producer.producer-running)
  then throw("memo producer recursively read its own output")
  elif !validate-owner-generation(
          root,load(producer.producer-owner-generation))
  then throw("memo producer belonged to an invalidated owner generation")
  else ()

// Validate every ancestor scope before owned work runs. A parent's tracked
// memo may still be dirty without having committed and fired the parent token;
// exact checkpoint settlement makes that latent invalidation visible first.
fun validate-owner-generation(root : root<e>,
                              captured : maybe<owner-generation>)
                             : <div,exn|e> bool
  match captured
    Nothing -> True
    Just(generation) ->
      if !generation-active(generation) then False else
        if load(generation.generation-validating)
        then throw("owner generation recursively depended on owned work")
        else finally(
          fn() store(generation.generation-validating,False),
          fn()
            // Cleanup may create work under the replacement token before the
            // owner's next track runs. If that track then depends on the same
            // owned producer, validating the producer would re-enter this
            // scope. Reject that ownership/checkpoint cycle explicitly.
            store(generation.generation-validating,True)
            val parent-active = validate-owner-generation(
              root,generation.generation-parent
            )
            if !parent-active then False else
              validate-dependencies(root,generation.generation-fired,
                                    load(generation.generation-dependencies))
              generation-active(generation)
        )

// Validate the checkpoints captured by one clean producer generation. A memo
// dependency is settled recursively; if its version changes, its source-local
// subscription fires the current producer token. An unchanged memo therefore
// leaves the downstream calculation completely untouched.
fun validate-dependencies(root : root<e>, target : ref<global,bool>,
                          dependencies : list<dependency-stamp>)
                         : <div,exn|e> ()
  if load(target) then () else match dependencies
    Nil -> ()
    Cons(stamp,rest) ->
      match stamp.stamp-producer
        Nothing -> ()
        Just(producer) ->
          val pulled = settle-producer(root,producer)
          ()
      if load(stamp.stamp-version) != stamp.stamp-observed &&
         !load(target)
      then throw("dependency checkpoint changed without waking its continuation")
      else validate-dependencies(root,target,rest)

// Pull exactly the requested producer. Running arbitrary derivation siblings
// here can create false recursive-read failures in a perfectly acyclic DAG.
fun settle-producer(root : root<e>, producer : producer-state)
                   : <div,exn|e> bool
  check-producer(root,producer)
  if !load(producer.producer-dirty) then
    validate-dependencies(root,producer.producer-dirty,
                          load(producer.producer-dependencies))
  else ()
  // Settling the producer's own checkpoints can also invalidate an ancestor
  // ownership generation. Recheck before extracting the direct queue ticket.
  check-producer(root,producer)
  if !load(producer.producer-dirty) then False else
    match take-queued-observer(root.root-derive-queue,
                               producer.producer-dirty)
      Nothing -> throw("memo producer was dirty without its direct queue ticket")
      Just(observer) ->
        settle-observer(root,observer)
        if load(producer.producer-dirty)
        then
          val pulled-again = settle-producer(root,producer)
          True
        else True

fun settle-source(root : root<e>, source : source<a>) : <pure|e> ()
  match source.source-producer
    Nothing -> ()
    Just(producer) ->
      val outer = !load(root.root-is-flushing)
      if outer then store(root.root-is-flushing,True) else ()
      val pulled = finally(
        fn() if outer then store(root.root-is-flushing,False) else (),
        fn()
          // Owner validation is effectful: it can exact-settle a captured
          // memo. Establish the flush guard before the first such check so a
          // nested commit cannot re-enter the scheduler through this pull.
          check-producer(root,producer)
          val current = settle-producer(root,producer)
          check-producer(root,producer)
          if load(producer.producer-dirty)
          then throw("memo producer did not settle")
          else current
      )
      if outer && pulled then flush(root) else ()

fun flush-loop(root : root<e>) : <div,exn|e> ()
  match pop-queued(root,root.root-derive-queue)
    Just(observer) ->
      settle-observer(root,observer)
      flush-loop(root)
    Nothing ->
      match pop-queued(root,root.root-effect-queue)
        Just(observer) ->
          // Owner validation while selecting an effect can settle a lazy memo
          // and enqueue derivations. Recheck the phase barrier before the
          // effect publishes, while preserving its direct ticket on failure.
          val completed = cell(False)
          val next-derivation = finally(
            fn() {
              if load(completed) || !load(observer.observer-live) ||
                 !load(observer.observer-dirty)
              then ()
              else enqueue-observer(root,observer)
            },
            fn()
              val current = pop-queued(root,root.root-derive-queue)
              store(completed,True)
              current
          )
          // Exit the ticket-preserving finalizer before continuing the flush,
          // so repeated effect/derivation phase changes do not retain one
          // finalizer frame per scheduler round.
          match next-derivation
            Just(derivation) ->
              enqueue-observer(root,observer)
              settle-observer(root,derivation)
              flush-loop(root)
            Nothing ->
              settle-observer(root,observer)
              flush-loop(root)
        Nothing -> ()

fun flush(root : root<e>) : <div,exn|e> ()
  if load(root.root-disposed) || load(root.root-disposing) ||
     load(root.root-is-flushing) || load(root.root-batch-depth) > 0
  then ()
  else
    store(root.root-is-flushing,True)
    finally(fn() store(root.root-is-flushing,False),
            fn() flush-loop(root))

fun run-observer(root : root<e>, observer : observer<e>) : <div,exn|e> ()
  if !load(observer.observer-live) then ()
  elif load(observer.observer-running)
    then throw("reactive observer run recursively re-entered")
  else
    store(observer.observer-queued,False)
    store(observer.observer-running,True)
    store(observer.observer-dirty,False)
    val previous-token = load(root.root-current-token)
    val previous-owner = load(root.root-current-owner)
    val succeeded = cell(False)
    store(root.root-current-token,Nothing)
    store(root.root-current-owner,Just(observer))
    finally(
      fn() {
        store(root.root-current-token,previous-token)
        store(root.root-current-owner,previous-owner)
        store(observer.observer-running,False)
        if load(succeeded) || !load(observer.observer-live) then ()
        else
          // A failed partial generation may already own children. Canceling
          // its capability makes every such child stale before retry.
          cancel-observer-token(observer)
          queue-observer(root,observer)
      },
      fn()
        cancel-observer-token(observer)
        // Publish this round's lifetime capability before reset cleanup. A
        // cleanup is allowed to register work into the replacement scope, but
        // it must never attach to the generation being retired.
        val token = new-wake-token(root,observer)
        store(observer.observer-token,Just(token))
        dispatch(root,fn() mask<signal-read>{ reset-owned(root,observer) })
        if !load(observer.observer-live) then ()
        else
          store(root.root-current-token,Just(token))
          dispatch(root,fn() advance-observer(observer))
          store(succeeded,True)
    )


// --------------------------------------------------------------------------
// Effect interpreters
// --------------------------------------------------------------------------

fun interpret-write(root : root<e>,
                    action : () -> <signal-write,pure|e> a)
                   : <pure|e> a
  with handler
    fun write-source(source,value)
      check-public-write(root)
      check-root(root,source.source-root)
      val previous = load(source.source-cell)
      val equal = source.source-equals
      if equal(previous,value) then () else
        store(source.source-cell,value)
        store(source.source-version,load(source.source-version) + 1)
        notify-source(root,source)
        flush(root)

    fun modify-source(source,update)
      check-public-write(root)
      check-root(root,source.source-root)
      val previous = load(source.source-cell)
      val value = update(previous)
      val equal = source.source-equals
      if equal(previous,value) then () else
        store(source.source-cell,value)
        store(source.source-version,load(source.source-version) + 1)
        notify-source(root,source)
        flush(root)

    fun commit-source(source,value)
      check-root(root,source.source-root)
      val previous = load(source.source-cell)
      val equal = source.source-equals
      if equal(previous,value) then () else
        store(source.source-cell,value)
        store(source.source-version,load(source.source-version) + 1)
        notify-source(root,source)
        flush(root)

    fun enter-batch(key)
      mask<div>
        check-public-write(root)
        check-root(root,key)
        store(root.root-batch-depth,load(root.root-batch-depth) + 1)

    fun leave-batch(key)
      check-public-write(root)
      check-root(root,key)
      val depth = load(root.root-batch-depth)
      if depth <= 0 then throw("unbalanced reactive batch") else
        store(root.root-batch-depth,depth - 1)
        flush(root)

    fun request-flush(key)
      check-public-write(root)
      check-root(root,key)
      flush(root)

  action()

fun interpret-read(root : root<e>,
                   action : () -> <signal-read,signal-write,pure|e> a)
                  : <signal-write,pure|e> a
  with fun read-source(source,tracked)
    mask<signal-write>
      check-root(root,source.source-root)
      settle-source(root,source)
      val value = load(source.source-cell)
      val version = load(source.source-version)
      if tracked then
        match load(root.root-current-token)
          Nothing -> ()
          Just(token) -> subscribe-source(token,source,version)
      else ()
      value

  action()

pub fun dispatch(root : root<e>,
                 action : () -> <signal-read,signal-write,pure|e> a)
                : <pure|e> a
  check-root(root,root.root-key)
  interpret-write(root)
    interpret-read(root)
      action()


// --------------------------------------------------------------------------
// Roots
// --------------------------------------------------------------------------

fun fresh-root() : root<e>
  Root(
    Root-key(cell(True)),cell([]),cell([]),cell(0),cell(False),
    cell(Nothing),cell(Nothing),cell([]),cell([]),cell(False),cell(False)
  )

pub fun create-root(action : (root<e>) -> <signal-write,pure|e> a)
                   : <pure|e> (root<e>,a)
  val root = fresh-root()
  val result = dispatch(root)
    enter-batch(root.root-key)
    finally(
      fn() leave-batch(root.root-key),
      fn() mask<signal-read>{ action(root) }
    )
  (root,result)

pub fun root/dispose(root : root<e>) : <pure|e> ()
  if load(root.root-disposed) || load(root.root-disposing) then ()
  elif load(root.root-is-flushing) || load(root.root-current-token).is-just
    then throw("cannot dispose a reactive root during a computation")
  else
    store(root.root-disposing,True)
    finally(
      fn() {
        store(root.root-disposed,True)
        store(root.root-disposing,False)
        store(root.root-derive-queue,[])
        store(root.root-effect-queue,[])
        store(root.root-current-token,Nothing)
        store(root.root-current-owner,Nothing)
        store(root.root-children,[])
        store(root.root-cleanups,[])
      },
      fn()
        dispatch(root)
          mask<signal-read>
            val children = load(root.root-children)
            store(root.root-children,[])
            finally(
              fn() {
                val cleanups = load(root.root-cleanups)
                store(root.root-cleanups,[])
                run-cleanups(cleanups)
              },
              fn() dispose-observers(root,children)
            )
    )

pub fun root/is-disposed(root : root<e>) : bool
  load(root.root-disposed)

pub fun update(root : root<e>, action : () -> <signal-write,pure|e> a)
              : <pure|e> a
  dispatch(root,fn() mask<signal-read>{ action() })

pub fun sample(root : root<e>, action : () -> <signal-read,pure|e> a)
              : <pure|e> a
  dispatch(root,fn() mask<signal-write>{ action() })


// --------------------------------------------------------------------------
// Signals and batches
// --------------------------------------------------------------------------

pub fun signal-by(root : root<e>, initial : a,
                  equals : (a,a) -> bool) : exn signal<a>
  check-registration(root)
  Signal(new-source(root,initial,equals,Nothing))

pub fun signal(root : root<e>, initial : a,
               ?(==) : (a,a) -> bool) : exn signal<a>
  signal-by(root,initial,(==))

pub fun signal-always(root : root<e>, initial : a) : exn signal<a>
  signal-by(root,initial,fn(_,_) False)

pub fun signal/get(signal : signal<a>) : signal-read a
  read-source(signal.source,True)

pub fun signal/set(signal : signal<a>, value : a) : signal-write ()
  write-source(signal.source,value)

pub fun signal/modify(signal : signal<a>, update : a -> a) : signal-write ()
  modify-source(signal.source,update)

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
// Memos and effects
// --------------------------------------------------------------------------

fun blank-observer(root : root<e>, kind : observer-kind) : observer<e>
  Observer(
    kind,cell(True),cell(True),cell(False),cell(False),cell(Nothing),
    cell([]),cell(Nothing),cell([]),cell([]),
    cell(Nothing),cell(Nothing),cell(Nothing)
  )

fun register-observer(root : root<e>, kind : observer-kind,
                      action : () -> <signal-read,signal-write,pure|e> ())
                     : exn observer<e>
  val observer = blank-observer(root,kind)
  store(observer.observer-action,Just(action))
  add-child(root,observer)
  observer

fun memo-by-inner(root : root<e>, initial : a,
                  calculate : (previous : a) -> <signal-read,pure> a,
                  equals : (a,a) -> bool) : <signal-write,pure> memo<a>
  check-registration(root)
  val observer = blank-observer(root,Derivation)
  add-child(root,observer)
  val producer = Producer-state(
    observer.observer-live,
    observer.observer-dirty,
    observer.observer-running,
    observer.observer-owner-generation,
    observer.observer-dependencies
  )
  val source = new-source(root,initial,equals,Just(producer))
  store(observer.observer-action,Just(fn()
    val previous = load(source.source-cell)
    val value = calculate(previous)
    commit-source(source,value)
  ))
  queue-observer(root,observer)
  request-flush(root.root-key)
  Memo(source)

pub fun memo-by(root : root<e>, initial : a,
                calculate : (previous : a) -> <signal-read,pure> a,
                equals : (a,a) -> bool) : <signal-write,pure> memo<a>
  memo-by-inner(root,initial,calculate,equals)

pub fun memo(root : root<e>, initial : a,
             calculate : (previous : a) -> <signal-read,pure> a,
             ?(==) : (a,a) -> bool) : <signal-write,pure> memo<a>
  memo-by(root,initial,calculate,(==))

pub fun memo-always(root : root<e>, initial : a,
                    calculate : (previous : a) -> <signal-read,pure> a)
                   : <signal-write,pure> memo<a>
  memo-by(root,initial,calculate,fn(_,_) False)

pub fun memo/get(memo : memo<a>) : signal-read a
  read-source(memo.source,True)

fun create-effect-inner(root : root<e>,
                        track : () -> <signal-read,pure> a,
                        apply : (value : a) -> <signal-write,pure|e> ())
                       : <signal-write,pure> disposer<e>
  check-registration(root)
  val observer = register-observer(root,User-effect,
    fn()
      val value = track()
      store(root.root-current-token,Nothing)
      mask<signal-read>{ apply(value) }
  )
  queue-observer(root,observer)
  request-flush(root.root-key)
  fn() dispatch(root,fn()
    mask<signal-read>{ dispose-observer-inner(root,observer) }
  )

pub fun create-effect(root : root<e>,
                      track : () -> <signal-read,pure> a,
                      apply : (value : a) -> <signal-write,pure|e> ())
                     : <signal-write,pure> disposer<e>
  create-effect-inner(root,track,apply)

pub fun on-cleanup(root : root<e>,
                   cleanup : () -> <signal-write,pure|e> ()) : exn ()
  check-registration(root)
  match load(root.root-current-owner)
    Nothing ->
      store(root.root-cleanups,Cons(cleanup,load(root.root-cleanups)))
    Just(owner) ->
      if !load(owner.observer-live)
      then throw("cleanup registered under a disposed owner")
      else store(owner.observer-cleanups,
                 Cons(cleanup,load(owner.observer-cleanups)))
