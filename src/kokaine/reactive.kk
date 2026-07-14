/*--------------------------------------------------------------------------
  Kokaine: an effect-typed, fine-grained reactive runtime.

  Persistent graph state uses private global references because DOM callbacks
  outlive their lexical root invocation. Public state access is represented by
  the more meaningful :signal-read and :signal-write effects.
--------------------------------------------------------------------------*/
module kokaine/reactive

import std/core/unsafe
import std/core/undiv


// --------------------------------------------------------------------------
// Public capabilities
// --------------------------------------------------------------------------

// A source is public only as an abstract token so the effect operation can be
// polymorphic in its value. Applications construct signals and memos instead.
abstract type source<a>
  Source(
    root-id   : int,
    source-id : int,
    source-cell   : ref<global,a>,
    source-equals : (a,a) -> bool
  )

// Reading and writing are deliberately distinct effects. In particular, a
// memo calculator is typed with :signal-read but never :signal-write.
pub effect signal-read
  fun read-source(source : source<a>, tracked : bool) : a

pub effect signal-write
  fun write-source(source : source<a>, value : a) : ()
  fun modify-source(source : source<a>, update : a -> a) : ()
  fun commit-source(source : source<a>, value : a) : ()
  fun enter-batch(root-id : int) : ()
  fun leave-batch(root-id : int) : ()
  fun request-flush(root-id : int) : ()

pub alias reactive = <signal-read,signal-write>


// --------------------------------------------------------------------------
// Public values
// --------------------------------------------------------------------------

abstract value type signal<a>
  Signal(source : source<a>)

abstract value type memo<a>
  Memo(source : source<a>)

pub alias disposer<e> = () -> <pure|e> ()


// --------------------------------------------------------------------------
// Private graph representation
// --------------------------------------------------------------------------

type observer-kind
  Derivation
  User-effect

type observer-status
  Clean
  Pending
  Stale
  Disposed

fun observer-status/(==)(left : observer-status, right : observer-status) : bool
  match (left,right)
    (Clean,Clean) -> True
    (Pending,Pending) -> True
    (Stale,Stale) -> True
    (Disposed,Disposed) -> True
    _ -> False

abstract type source-info
  Source-info(
    info-id          : int,
    info-rank        : ref<global,int>,
    info-subscribers : ref<global,list<int>>,
    info-producer    : maybe<int>
  )

abstract type observer<e::E>
  Observer(
    observer-id       : int,
    observer-kind     : observer-kind,
    observer-rank     : ref<global,int>,
    observer-status   : ref<global,observer-status>,
    observer-executing : ref<global,bool>,
    observer-output   : maybe<int>,
    observer-sources  : ref<global,list<int>>,
    observer-children : ref<global,list<int>>,
    observer-cleanups : ref<global,list<() -> <signal-write,pure|e> ()>>,
    observer-action   : () -> <signal-read,signal-write,pure|e> ()
  )

abstract type root<e::E>
  Root(
    root-id             : int,
    root-next-id        : ref<global,int>,
    root-sources        : ref<global,list<source-info>>,
    root-observers      : ref<global,list<observer<e>>>,
    root-derive-queue   : ref<global,list<int>>,
    root-effect-queue   : ref<global,list<int>>,
    root-batch-depth    : ref<global,int>,
    root-is-flushing    : ref<global,bool>,
    root-current-owner  : ref<global,int>,
    root-current-observer : ref<global,maybe<int>>,
    root-children       : ref<global,list<int>>,
    root-cleanups       : ref<global,list<() -> <signal-write,pure|e> ()>>,
    root-disposing      : ref<global,bool>,
    root-disposed       : ref<global,bool>
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

val next-root-id : ref<global,int> = cell(1)

fun fresh-root-id() : int
  val id = load(next-root-id)
  store(next-root-id,id + 1)
  id

fun fresh-id(root : root<e>) : int
  val id = load(root.root-next-id)
  store(root.root-next-id,id + 1)
  id


// --------------------------------------------------------------------------
// Small list helpers
// --------------------------------------------------------------------------

fun contains-id(ids : list<int>, id : int) : bool
  match ids
    Nil -> False
    Cons(head,tail) -> head == id || contains-id(tail,id)

fun remove-id(ids : list<int>, id : int) : list<int>
  match ids
    Nil -> []
    Cons(head,tail) ->
      if head == id then remove-id(tail,id)
      else Cons(head,remove-id(tail,id))

fun find-source(infos : list<source-info>, id : int) : maybe<source-info>
  match infos
    Nil -> Nothing
    Cons(info,rest) ->
      if info.info-id == id then Just(info) else find-source(rest,id)

fun find-observer(observers : list<observer<e>>, id : int) : maybe<observer<e>>
  match observers
    Nil -> Nothing
    Cons(observer,rest) ->
      if observer.observer-id == id then Just(observer)
      else find-observer(rest,id)

fun root-source(root : root<e>, id : int) : maybe<source-info>
  find-source(load(root.root-sources),id)

fun root-observer(root : root<e>, id : int) : maybe<observer<e>>
  find-observer(load(root.root-observers),id)


// --------------------------------------------------------------------------
// Graph mutation
// --------------------------------------------------------------------------

fun new-source(root : root<e>, value : a, equals : (a,a) -> bool,
               rank : int, producer : maybe<int>) : source<a>
  val id = fresh-id(root)
  val source = Source(root.root-id,id,cell(value),equals)
  val info = Source-info(id,cell(rank),cell([]),producer)
  store(root.root-sources,Cons(info,load(root.root-sources)))
  source

fun observer-rank-of(root : root<e>, id : int) : int
  match root-observer(root,id)
    Just(observer) -> load(observer.observer-rank)
    Nothing -> 0

fun insert-ranked(root : root<e>, id : int, ids : list<int>) : list<int>
  match ids
    Nil -> [id]
    Cons(head,tail) ->
      if observer-rank-of(root,id) < observer-rank-of(root,head)
      then Cons(id,ids)
      else Cons(head,insert-ranked(root,id,tail))

fun enqueue-observer(root : root<e>, observer : observer<e>) : ()
  val queue = match observer.observer-kind
                Derivation -> root.root-derive-queue
                User-effect -> root.root-effect-queue
  val queued = load(queue)
  if queued.contains-id(observer.observer-id) then ()
  else store(queue,insert-ranked(root,observer.observer-id,queued))

fun remove-queued(root : root<e>, observer : observer<e>) : ()
  store(root.root-derive-queue,
        remove-id(load(root.root-derive-queue),observer.observer-id))
  store(root.root-effect-queue,
        remove-id(load(root.root-effect-queue),observer.observer-id))

// A definitely stale memo may or may not change its output. Descendants are
// therefore only Pending until recursive settling proves that an upstream
// value actually changed. This is the distinction that preserves equality
// pruning while keeping transitive reads fresh inside a batch.
fun propagate-pending(root : root<e>, observer : observer<e>) : <div> ()
  match observer.observer-output
    Nothing -> ()
    Just(source-id) ->
      match root-source(root,source-id)
        Nothing -> ()
        Just(info) ->
          load(info.info-subscribers).foreach fn(observer-id)
            match root-observer(root,observer-id)
              Just(subscriber) -> queue-pending(root,subscriber)
              Nothing -> ()

fun queue-pending(root : root<e>, observer : observer<e>) : <div> ()
  match load(observer.observer-status)
    Clean ->
      store(observer.observer-status,Pending)
      enqueue-observer(root,observer)
      propagate-pending(root,observer)
    _ -> ()

fun queue-observer(root : root<e>, observer : observer<e>) : <div> ()
  match load(observer.observer-status)
    Disposed -> ()
    Stale -> ()
    Pending -> store(observer.observer-status,Stale)
    Clean ->
      store(observer.observer-status,Stale)
      enqueue-observer(root,observer)
      propagate-pending(root,observer)

fun notify-source(root : root<e>, source-id : int) : <div> ()
  if load(root.root-disposing) then () else match root-source(root,source-id)
    Nothing -> ()
    Just(info) ->
      load(info.info-subscribers).foreach fn(observer-id)
        match root-observer(root,observer-id)
          Just(observer) -> queue-observer(root,observer)
          Nothing -> ()

fun detach-observer(root : root<e>, observer : observer<e>) : ()
  load(observer.observer-sources).foreach fn(source-id)
    match root-source(root,source-id)
      Nothing -> ()
      Just(info) ->
        store(info.info-subscribers,
              remove-id(load(info.info-subscribers),observer.observer-id))
  store(observer.observer-sources,[])

fun track-source(root : root<e>, source-id : int) : ()
  match load(root.root-current-observer)
    Nothing -> ()
    Just(observer-id) ->
      match (root-observer(root,observer-id),root-source(root,source-id))
        (Just(observer),Just(info)) ->
          if load(observer.observer-sources).contains-id(source-id) then () else
            store(observer.observer-sources,
                  Cons(source-id,load(observer.observer-sources)))
            store(info.info-subscribers,
                  Cons(observer-id,load(info.info-subscribers)))
            val candidate = load(info.info-rank) + 1
            if candidate > load(observer.observer-rank)
            then store(observer.observer-rank,candidate)
            else ()
        _ -> ()

fun sync-source-rank(root : root<e>, source-id : int, observer-id : int) : ()
  match (root-source(root,source-id),root-observer(root,observer-id))
    (Just(info),Just(observer)) ->
      store(info.info-rank,load(observer.observer-rank))
    _ -> ()


// --------------------------------------------------------------------------
// Ownership and disposal
// --------------------------------------------------------------------------

fun add-child(root : root<e>, owner-id : int, child-id : int) : ()
  if owner-id == 0
  then store(root.root-children,Cons(child-id,load(root.root-children)))
  else match root-observer(root,owner-id)
         Just(owner) ->
           store(owner.observer-children,
                 Cons(child-id,load(owner.observer-children)))
         Nothing -> ()

fun run-cleanups(cleanups : list<() -> <signal-write,pure|e> ()>)
                 : <signal-write,pure|e> ()
  match cleanups
    Nil -> ()
    Cons(cleanup,rest) ->
      // `finally` makes teardown exhaustive: one failing cleanup cannot keep
      // later listeners, child roots, or DOM ranges alive.
      finally(fn() run-cleanups(rest),cleanup)

fun collect-owned(root : root<e>, pending : list<observer<e>>,
                  ordered : list<observer<e>>) : <div> list<observer<e>>
  match pending
    Nil -> ordered
    Cons(current,rest) ->
      if load(current.observer-status) == Disposed
      then collect-owned(root,rest,ordered)
      else
        store(current.observer-status,Disposed)
        val children = load(current.observer-children)
        store(current.observer-children,[])
        val next = children.foldl(rest,fn(acc,child-id)
          match root-observer(root,child-id)
            Just(child) -> Cons(child,acc)
            Nothing -> acc
        )
        collect-owned(root,next,Cons(current,ordered))

fun observer-ids(observers : list<observer<e>>) : list<int>
  observers.map fn(observer) observer.observer-id

fun remove-observers(observers : list<observer<e>>, ids : list<int>)
                    : list<observer<e>>
  match observers
    Nil -> []
    Cons(observer,rest) ->
      if ids.contains-id(observer.observer-id)
      then remove-observers(rest,ids)
      else Cons(observer,remove-observers(rest,ids))

fun remove-produced-sources(infos : list<source-info>, ids : list<int>)
                           : list<source-info>
  match infos
    Nil -> []
    Cons(info,rest) ->
      val remove = match info.info-producer
                     Just(id) -> ids.contains-id(id)
                     Nothing -> False
      if remove then remove-produced-sources(rest,ids)
      else Cons(info,remove-produced-sources(rest,ids))

fun unlink-observers(root : root<e>, observers : list<observer<e>>) : ()
  val ids = observer-ids(observers)
  ids.foreach fn(id)
    store(root.root-derive-queue,remove-id(load(root.root-derive-queue),id))
    store(root.root-effect-queue,remove-id(load(root.root-effect-queue),id))
  store(root.root-children,
        load(root.root-children).filter(fn(id) !ids.contains-id(id)))
  load(root.root-observers).foreach fn(observer)
    store(observer.observer-children,
          load(observer.observer-children).filter(fn(id) !ids.contains-id(id)))
  store(root.root-sources,remove-produced-sources(load(root.root-sources),ids))
  store(root.root-observers,remove-observers(load(root.root-observers),ids))

fun clean-observers(observers : list<observer<e>>)
                    : <signal-write,pure|e> ()
  match observers
    Nil -> ()
    Cons(observer,rest) ->
      val cleanups = load(observer.observer-cleanups)
      store(observer.observer-cleanups,[])
      finally(fn() clean-observers(rest),fn() run-cleanups(cleanups))

fun dispose-collected(root : root<e>, observers : list<observer<e>>)
                      : <signal-write,pure|e> ()
  // Collection marks the complete forest first. Detaching every node before
  // the first cleanup prevents teardown writes from re-entering a sibling.
  observers.foreach fn(observer)
    remove-queued(root,observer)
    detach-observer(root,observer)
  finally(fn() unlink-observers(root,observers),
          fn() clean-observers(observers))

fun dispose-ids(root : root<e>, ids : list<int>)
                : <signal-write,pure|e> ()
  val pending = ids.foldl([],fn(found,id)
    match root-observer(root,id)
      Just(observer) -> Cons(observer,found)
      Nothing -> found
  )
  val ordered = pretend-no-div{ collect-owned(root,pending,[]) }
  dispose-collected(root,ordered)

fun dispose-observer-inner(root : root<e>, observer : observer<e>)
                          : <signal-write,pure|e> ()
  dispose-ids(root,[observer.observer-id])

fun reset-owned(root : root<e>, observer : observer<e>)
                : <signal-write,pure|e> ()
  val children = load(observer.observer-children)
  store(observer.observer-children,[])
  val cleanups = load(observer.observer-cleanups)
  store(observer.observer-cleanups,[])
  finally(fn() run-cleanups(cleanups),fn() dispose-ids(root,children))


// --------------------------------------------------------------------------
// Runtime interpreter and scheduler
// --------------------------------------------------------------------------

fun check-root(root : root<e>, id : int) : exn ()
  if root.root-id == id && !load(root.root-disposed) then ()
  else throw("signal used outside its live reactive root")

fun check-public-write(root : root<e>) : exn ()
  match load(root.root-current-observer)
    Nothing -> ()
    Just(_) -> throw("signal write attempted during dependency tracking")

fun check-registration(root : root<e>) : exn ()
  if load(root.root-disposed) || load(root.root-disposing)
  then throw("reactive value created in a disposed root")
  else check-public-write(root)

fun settle-dependencies(root : root<e>, sources : list<int>) : <pure|e> ()
  sources.foreach fn(source-id) settle-source(root,source-id)

fun settle-observer(root : root<e>, observer : observer<e>) : <pure|e> ()
  if load(observer.observer-executing)
  then throw("reactive computation recursively re-entered")
  else match load(observer.observer-status)
         Disposed -> ()
         Clean -> ()
         Stale ->
           remove-queued(root,observer)
           run-observer(root,observer)
         Pending ->
           remove-queued(root,observer)
           settle-dependencies(root,load(observer.observer-sources))
           match load(observer.observer-status)
             Stale -> run-observer(root,observer)
             Pending -> store(observer.observer-status,Clean)
             _ -> ()

fun settle-source-inner(root : root<e>, source-id : int) : <pure|e> ()
  match root-source(root,source-id)
    Nothing -> throw("reactive source was disposed")
    Just(info) ->
      match info.info-producer
        Nothing -> ()
        Just(observer-id) ->
          match root-observer(root,observer-id)
            Nothing -> throw("memo producer was disposed")
            Just(observer) -> settle-observer(root,observer)

fun source-needs-settle(root : root<e>, source-id : int) : exn bool
  match root-source(root,source-id)
    Nothing -> throw("reactive source was disposed")
    Just(info) ->
      match info.info-producer
        Nothing -> False
        Just(observer-id) ->
          match root-observer(root,observer-id)
            Nothing -> throw("memo producer was disposed")
            Just(observer) ->
              if load(observer.observer-executing) then True
              else match load(observer.observer-status)
                     Pending -> True
                     Stale -> True
                     Disposed -> throw("memo producer was disposed")
                     Clean -> False

fun settle-source(root : root<e>, source-id : int) : <pure|e> ()
  if !source-needs-settle(root,source-id) then ()
  elif load(root.root-is-flushing)
  then settle-source-inner(root,source-id)
  else
    // A pulled memo must finish committing before queued effects can observe
    // it. The outer guard turns recursive reads into pull-settling and prevents
    // a memo commit from starting a nested flush while its producer executes.
    store(root.root-is-flushing,True)
    finally(fn() store(root.root-is-flushing,False),
            fn() settle-source-inner(root,source-id))
    flush(root)

fun pop-queued(queue : ref<global,list<int>>) : maybe<int>
  match load(queue)
    Nil -> Nothing
    Cons(id,rest) ->
      store(queue,rest)
      Just(id)

fun run-queued(root : root<e>, id : int) : <div,exn|e> ()
  match root-observer(root,id)
    Just(observer) -> settle-observer(root,observer)
    Nothing -> ()

fun flush-loop(root : root<e>) : <div,exn|e> ()
  match pop-queued(root.root-derive-queue)
    Just(id) ->
      run-queued(root,id)
      flush-loop(root)
    Nothing ->
      match pop-queued(root.root-effect-queue)
        Just(id) ->
          run-queued(root,id)
          flush-loop(root)
        Nothing -> ()

fun flush(root : root<e>) : <div,exn|e> ()
  if load(root.root-disposed) || load(root.root-disposing) ||
     load(root.root-is-flushing) ||
     load(root.root-batch-depth) > 0
  then ()
  else
    store(root.root-is-flushing,True)
    finally(
      fn() store(root.root-is-flushing,False),
      fn() flush-loop(root)
    )

fun run-observer(root : root<e>, observer : observer<e>) : <div,exn|e> ()
  if load(observer.observer-status) == Disposed then ()
  elif load(observer.observer-executing)
    then throw("reactive computation recursively re-entered")
  else
    remove-queued(root,observer)
    store(observer.observer-executing,True)
    store(observer.observer-status,Clean)
    val previous-observer = load(root.root-current-observer)
    val previous-owner = load(root.root-current-owner)
    val succeeded = cell(False)
    store(root.root-current-observer,Nothing)
    store(root.root-current-owner,observer.observer-id)
    finally(
      fn() {
        store(root.root-current-observer,previous-observer)
        store(root.root-current-owner,previous-owner)
        store(observer.observer-executing,False)
        if load(succeeded) || load(observer.observer-status) == Disposed then ()
        elif load(observer.observer-status) == Clean then
          store(observer.observer-status,Stale)
          enqueue-observer(root,observer)
          propagate-pending(root,observer)
        else ()
      },
      fn()
        // Run owned cleanup before detaching old dependencies. If cleanup
        // fails, the restoring frame leaves a stale, subscribed observer that
        // can retry instead of a permanently detached Running computation.
        dispatch(root,fn() mask<signal-read>{ reset-owned(root,observer) })
        detach-observer(root,observer)
        store(observer.observer-rank,1)
        store(root.root-current-observer,Just(observer.observer-id))
        dispatch(root,observer.observer-action)
        store(succeeded,True)
    )

fun interpret-write(root : root<e>,
                    action : () -> <signal-write,pure|e> a)
                   : <pure|e> a
  with handler
    fun write-source(source,value)
      check-public-write(root)
      check-root(root,source.root-id)
      val previous = load(source.source-cell)
      val equal = source.source-equals
      if equal(previous,value) then () else
        store(source.source-cell,value)
        notify-source(root,source.source-id)
        flush(root)

    fun modify-source(source,update)
      check-public-write(root)
      check-root(root,source.root-id)
      val previous = load(source.source-cell)
      val value = update(previous)
      val equal = source.source-equals
      if equal(previous,value) then () else
        store(source.source-cell,value)
        notify-source(root,source.source-id)
        flush(root)

    fun commit-source(source,value)
      check-root(root,source.root-id)
      val previous = load(source.source-cell)
      val equal = source.source-equals
      if equal(previous,value) then () else
        store(source.source-cell,value)
        notify-source(root,source.source-id)
        flush(root)

    fun enter-batch(id)
      mask<div>
        check-public-write(root)
        check-root(root,id)
        store(root.root-batch-depth,load(root.root-batch-depth) + 1)

    fun leave-batch(id)
      check-public-write(root)
      check-root(root,id)
      val depth = load(root.root-batch-depth)
      if depth <= 0 then throw("unbalanced reactive batch") else
        store(root.root-batch-depth,depth - 1)
        flush(root)

    fun request-flush(id)
      check-public-write(root)
      check-root(root,id)
      flush(root)

  action()

fun interpret-read(root : root<e>,
                   action : () -> <signal-read,signal-write,pure|e> a)
                  : <signal-write,pure|e> a
  with fun read-source(source,tracked)
    mask<signal-write>
      check-root(root,source.root-id)
      settle-source(root,source.source-id)
      if tracked then track-source(root,source.source-id) else ()
      load(source.source-cell)

  action()

pub fun dispatch(root : root<e>,
                 action : () -> <signal-read,signal-write,pure|e> a)
                : <pure|e> a
  check-root(root,root.root-id)
  interpret-write(root)
    interpret-read(root)
      action()


// --------------------------------------------------------------------------
// Roots
// --------------------------------------------------------------------------

fun fresh-root() : root<e>
  Root(
    fresh-root-id(), cell(1), cell([]), cell([]), cell([]), cell([]),
    cell(0), cell(False), cell(0), cell(Nothing), cell([]), cell([]),
    cell(False), cell(False)
  )

pub fun create-root(action : (root<e>) -> <signal-write,pure|e> a)
                   : <pure|e> (root<e>,a)
  val root = fresh-root()
  val result = dispatch(root)
    enter-batch(root.root-id)
    finally(
      fn() leave-batch(root.root-id),
      fn()
        // Root setup is structural. Direct signal access always goes through
        // `sample`, `update`, or `dispatch`, which keeps capability boundaries
        // explicit and lets setup callbacks use any host effect row `e`.
        mask<signal-read>{ action(root) }
    )
  (root,result)

pub fun root/dispose(root : root<e>) : <pure|e> ()
  if load(root.root-disposed) || load(root.root-disposing) then ()
  elif load(root.root-is-flushing) || load(root.root-current-observer).is-just
    then throw("cannot dispose a reactive root during a computation")
  else
    store(root.root-disposing,True)
    finally(
      fn() {
        store(root.root-disposed,True)
        store(root.root-disposing,False)
        store(root.root-derive-queue,[])
        store(root.root-effect-queue,[])
        store(root.root-children,[])
        store(root.root-cleanups,[])
        store(root.root-observers,[])
        store(root.root-sources,[])
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
              fn() dispose-ids(root,children)
            )
    )

pub fun root/is-disposed(root : root<e>) : bool
  load(root.root-disposed)

// Run a write-only transaction in a root. The missing read capability is
// injected without executing or masking any real read operation.
pub fun update(root : root<e>, action : () -> <signal-write,pure|e> a)
              : <pure|e> a
  dispatch(root,fn()
    mask<signal-read>{ action() }
  )

// Run a read-only sample in a root. Memos are settled before their value is
// returned, but the sample does not become a persistent graph observer.
pub fun sample(root : root<e>, action : () -> <signal-read,pure|e> a)
              : <pure|e> a
  dispatch(root,fn()
    mask<signal-write>{ action() }
  )


// --------------------------------------------------------------------------
// Signals and batches
// --------------------------------------------------------------------------

pub fun signal-by(root : root<e>, initial : a,
                  equals : (a,a) -> bool) : exn signal<a>
  check-registration(root)
  Signal(new-source(root,initial,equals,0,Nothing))

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
  enter-batch(root.root-id)
  finally(fn() leave-batch(root.root-id),action)

pub fun untrack(action : () -> <signal-read,pure|e> a)
               : <signal-read,pure|e> a
  with override fun read-source(source,_)
    read-source(source,False)
  action()


// --------------------------------------------------------------------------
// Memos and user effects
// --------------------------------------------------------------------------

fun register-observer(root : root<e>, kind : observer-kind,
                      action : () -> <signal-read,signal-write,pure|e> ())
                     : observer<e>
  val id = fresh-id(root)
  val observer = Observer(
    id,kind,cell(1),cell(Clean),cell(False),Nothing,
    cell([]),cell([]),cell([]),action
  )
  store(root.root-observers,Cons(observer,load(root.root-observers)))
  add-child(root,load(root.root-current-owner),id)
  observer

fun memo-by-inner(root : root<e>, initial : a,
                  calculate : (previous : a) -> <signal-read,pure> a,
                  equals : (a,a) -> bool) : <signal-write,pure> memo<a>
  check-registration(root)
  val observer-id = fresh-id(root)
  val source = new-source(root,initial,equals,1,Just(observer-id))
  val observer = Observer(
    observer-id,Derivation,cell(1),cell(Clean),cell(False),
    Just(source.source-id),cell([]),cell([]),cell([]),
    fn()
      // Inject capabilities this internal closure deliberately does not use so
      // it has the same storable shape as an application observer.
      val previous = load(source.source-cell)
      val value = calculate(previous)
      sync-source-rank(root,source.source-id,observer-id)
      commit-source(source,value)
  )
  store(root.root-observers,Cons(observer,load(root.root-observers)))
  add-child(root,load(root.root-current-owner),observer-id)
  queue-observer(root,observer)
  request-flush(root.root-id)
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
      // Only `track` owns dependency collection. `apply` keeps ownership for
      // nested bindings but clears the current observer, so even a nested
      // `sample` cannot accidentally become a dependency.
      store(root.root-current-observer,Nothing)
      mask<signal-read>{ apply(value) }
  )
  queue-observer(root,observer)
  request-flush(root.root-id)
  fn() dispatch(root,fn() mask<signal-read>{ dispose-observer-inner(root,observer) })

pub fun create-effect(root : root<e>,
                      track : () -> <signal-read,pure> a,
                      apply : (value : a) -> <signal-write,pure|e> ())
                     : <signal-write,pure> disposer<e>
  create-effect-inner(root,track,apply)

pub fun on-cleanup(root : root<e>,
                   cleanup : () -> <signal-write,pure|e> ()) : exn ()
  check-registration(root)
  val owner-id = load(root.root-current-owner)
  if owner-id == 0
  then store(root.root-cleanups,Cons(cleanup,load(root.root-cleanups)))
  else match root-observer(root,owner-id)
         Just(owner) ->
           store(owner.observer-cleanups,
                 Cons(cleanup,load(owner.observer-cleanups)))
         Nothing -> ()
