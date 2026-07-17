/*--------------------------------------------------------------------------
  Generation-bound browser async interpretation.

  Each primitive await is a separate one-shot capability. It is attached to
  the current structural frame through `on-cleanup`, but keeps every retained
  payload behind mutable slots so completion or retirement can drop the Koka
  continuation, structural portal, and host disposer before calling out.

  Browser callbacks never resume a raw continuation directly. The first
  callback only schedules a microtask; that later turn validates the captured
  generation through `run-reentry`, installs a fresh async handler inside the
  re-entry batch, and only then resumes the parked suffix.
--------------------------------------------------------------------------*/
module kokaine/reactive/internal/async-runtime

import kokaine/async/effects
import kokaine/async/internal/web-schedule
import kokaine/reactive/effects
import kokaine/reactive/internal/model
import kokaine/reactive/internal/reentry
import kokaine/reactive/internal/runtime
import std/core/undiv


// --------------------------------------------------------------------------
// One-shot task state
// --------------------------------------------------------------------------

pub type generation-task-state
  Task-pending
  Task-scheduled
  Task-running
  Task-completed
  Task-canceled
  Task-retired

// The parked suffix is resumed shallowly: its primitive `async-await` handler
// is deliberately absent. This lets the generation installed at the host
// callback boundary become the nearest base interpreter for the next await.
alias taskresume<e,a> = (await-result<a>,bool) -> <async,signal-read,signal-write,pure,ui|e> ()

type generation-task<a,e::E>
  Generation-task(
    task-state    : ref<global,generation-task-state>,
    task-result   : ref<global,maybe<await-result<a>>>,
    task-portal   : ref<global,maybe<reentry<<ui|e>>>>,
    task-resume   : ref<global,maybe<taskresume<e,a>>>,
    task-disposer : ref<global,maybe<dispose-fn>>,
    // The structural owner closes over only this indirection. Terminal tasks
    // clear it, severing the owner's path to the family and task identity.
    task-owner-stop : ref<global,maybe<() -> <signal-write,pure,ui|e> ()>>,
    task-owner-registration : ref<global,maybe<cleanup-registration>>,
    task-label    : string
  )

type task-capability<e::E>
  Task-capability(
    capability-id     : int,
    capability-scope  : async-scope,
    capability-active : () -> bool,
    capability-stop   : (retired : bool) -> <signal-write,pure,ui|e> ()
  )

// A family is the structured lifetime shared by all fresh turn interpreters
// descended from one `run-async` invocation. Cancellation in a later turn must
// still find sibling operations installed by an earlier turn.
type async-family<e::E>
  Async-family(
    family-tasks    : ref<global,list<task-capability<e>>>,
    family-canceled : ref<global,list<async-scope>>,
    family-next-id  : ref<global,int>
  )

// This wrapper is intentionally allocated for every browser turn. Its handler
// closures are generation-local while the typed family remains shared.
type generation-runtime<e::E>
  Generation-runtime(runtime-family : async-family<e>)

// A debug-only aggregate is intentionally not an ownership index. Task cells
// remain owned exclusively by frames and lexical cancellation scopes.
val outstanding-operations : ref<global,int> = cell(0)

// Resource loaders need a lifetime which can outlive the create-effect
// generation that observed their source. A lease group owns only raw host
// disposers; the Resource keeps the active and latest groups in its own
// one-shot state machine.
type async-lease-entry
  Async-lease-entry(
    lease-entry-id       : int,
    lease-entry-disposer : ref<global,maybe<dispose-fn>>
  )

abstract type async-lease-group
  Async-lease-group(
    lease-group-live    : ref<global,bool>,
    lease-group-entries : ref<global,list<async-lease-entry>>,
    lease-group-next-id : ref<global,int>
  )

extern report-async-error(message : string) : ui ()
  js inline "console.error(#1)"

// `accept-task-result` is operationally a finite `ui` callback (cell updates
// plus microtask enqueue). Its `div` label only closes the recursive type SCC
// formed by the parked continuation and the next generation handler.
fun as-host-action(action : () -> <div,ui> ()) : (() -> ui ())
  fn() pretend-no-div{ action() }

// `run-task-result` inherits the opaque root row in its type even though the
// public generation entry admits only the closed application row. Keep this
// erasure private to the runtime-owned trampoline: it catches exceptions,
// restores the structural portal, and installs the fresh async interpreter
// before it can invoke the parked suffix.
extern runtime-host-action(
  action : () -> <div,ui|e> ()) : (() -> ui ())
  inline "#1"

fun resume-generation(root : root<<ui|e>>, family : async-family<e>,
                      action : () -> <async,signal-read,signal-write,pure,ui|e> ())
                     : <signal-read,signal-write,pure,ui|e> ()
  run-generation-async-with-family(root,family,action)

pub fun generation-async-outstanding() : int
  load(outstanding-operations)

fun increment-outstanding() : ()
  store(outstanding-operations,load(outstanding-operations) + 1)

fun decrement-outstanding() : ()
  val current = load(outstanding-operations)
  store(outstanding-operations,if current <= 0 then 0 else current - 1)

pub fun new-async-lease-group() : async-lease-group
  Async-lease-group(cell(True),cell([]),cell(1))

fun release-async-lease(group : async-lease-group,
                        id : int,
                        disposer-slot : ref<global,maybe<dispose-fn>>) : ui bool
  match group
    Async-lease-group(_,entries,_) ->
      val current = load(disposer-slot)
      store(disposer-slot,Nothing)
      // Physically unlink released entries so a long-lived Resource cannot
      // accumulate empty slots after explicit ownership transfers.
      store(entries,load(entries).filter(fn(entry) entry.lease-entry-id != id))
      match current
        Nothing -> False
        Just(_) ->
          decrement-outstanding()
          True

fun async-lease-release(group : async-lease-group,
                        id : int,
                        disposer-slot : ref<global,maybe<dispose-fn>>)
                       : ownership-release-fn
  fn() release-async-lease(group,id,disposer-slot)

pub fun async-lease-group/own(group : async-lease-group,
                              dispose : dispose-fn) : ui ownership-release-fn
  match group
    Async-lease-group(live,entries,next-id) ->
      if !load(live) then
        // A re-entrant acquisition after retirement cannot become reachable.
        dispose()
        fn() False
      else
        val id = load(next-id)
        val disposer-slot = cell(Just(dispose))
        store(next-id,id + 1)
        store(entries,
          Cons(Async-lease-entry(id,disposer-slot),load(entries)))
        increment-outstanding()
        async-lease-release(group,id,disposer-slot)

fun claim-async-lease-disposers(entries : list<async-lease-entry>)
                                : list<dispose-fn>
  match entries
    Nil -> []
    Cons(entry,rest) ->
      val disposer-slot = entry.lease-entry-disposer
      val disposer = load(disposer-slot)
      store(disposer-slot,Nothing)
      match disposer
        Nothing -> claim-async-lease-disposers(rest)
        Just(current-dispose) ->
          decrement-outstanding()
          Cons(current-dispose,claim-async-lease-disposers(rest))

fun run-async-lease-disposers(disposers : list<dispose-fn>) : ui ()
  match disposers
    Nil -> ()
    Cons(dispose,rest) ->
      // A later disposer still runs if an earlier hostile host callback
      // escapes unexpectedly. Koka's finally lowering also preserves this
      // ordering on the JavaScript backend.
      finally(fn() run-async-lease-disposers(rest),dispose)

pub fun async-lease-group/dispose(group : async-lease-group) : ui ()
  match group
    Async-lease-group(live,entries,_) ->
      if !load(live) then () else
        // Close and detach the complete ledger before invoking untrusted host
        // disposers. Re-entry and aliased cleanup therefore see a terminal
        // group and cannot claim any entry twice.
        store(live,False)
        val current = load(entries)
        store(entries,[])
        // Claim and account for every slot before invoking the first disposer.
        // Even if host code aborts control flow, no detached entry remains
        // counted or available to a competing release path.
        run-async-lease-disposers(claim-async-lease-disposers(current))

fun task/is-active(task : generation-task<a,e>) : bool
  match load(task.task-state)
    Task-pending -> True
    Task-scheduled -> True
    _ -> False

// Keep row-polymorphic family internals out of generated Koka 3.2 `.kki`
// inline bodies; its interface printer otherwise emits an unparseable cache.
noinline fun runtime/is-canceled(runtime : generation-runtime<e>,
                                 scope : async-scope) : bool
  load(runtime.runtime-family.family-canceled)
    .any(fn(canceled) scope <= canceled)

noinline fun runtime/record-canceled(runtime : generation-runtime<e>,
                                     scope : async-scope) : ()
  if runtime.is-canceled(scope) then () else
    val canceled = runtime.runtime-family.family-canceled
    store(canceled,Cons(scope,load(canceled)))

// Exact removal matters for nested cancellation: releasing a drained child
// must not revive it while an enclosing canceled scope is still live.
noinline fun runtime/release-canceled(runtime : generation-runtime<e>,
                                      scope : async-scope) : ()
  val canceled = runtime.runtime-family.family-canceled
  store(canceled,load(canceled).filter(fn(current) !(current == scope)))

fun async-family/prune(family : async-family<e>) : ()
  val tasks = family.family-tasks
  store(tasks,load(tasks).filter(fn(capability)
    match capability
      Task-capability(_,_,active,_) -> active()
  ))

fun async-family/fresh-task-id(family : async-family<e>) : int
  val next-id = family.family-next-id
  val current = load(next-id)
  store(next-id,current + 1)
  current

fun task/detach-owner(task : generation-task<a,e>) : ()
  store(task.task-owner-stop,Nothing)
  val registration = load(task.task-owner-registration)
  store(task.task-owner-registration,Nothing)
  match registration
    Nothing -> ()
    Just(current) -> current.unregister

noinline fun async-family/stop-task(family : async-family<e>, id : int,
                                    retired : bool)
                                   : <signal-write,pure,ui|e> ()
  load(family.family-tasks).foreach fn(capability)
    match capability
      Task-capability(task-id,_,active,stop) ->
        if task-id == id && active() then stop(retired) else ()


// --------------------------------------------------------------------------
// Completion and retirement
// --------------------------------------------------------------------------

fun run-task-result(task : generation-task<a,e>, family : async-family<e>)
                   : <div,ui|e> ()
  lift-div fn()
    // Browser turns have no ambient Koka exception stack. Keep every failure
    // from re-entry or user code inside a stable host boundary.
    with catch fn(problem)
      report-async-error("uncaught Kokaine async exception (" ++
                         task.task-label ++ "): " ++ problem.show)
    match load(task.task-state)
      Task-scheduled ->
        val portal-slot = task.task-portal
        val resume-slot = task.task-resume
        val result-slot = task.task-result
        val portal = load(portal-slot)
        val resume = load(resume-slot)
        val result = load(result-slot)

        // The scheduled turn wins before it touches structural state or user
        // code. Clear every retained payload while only local stack values can
        // still reach them.
        store(task.task-state,Task-running)
        store(portal-slot,Nothing)
        store(resume-slot,Nothing)
        store(result-slot,Nothing)
        store(task.task-disposer,Nothing)
        task.detach-owner
        decrement-outstanding()
        family.prune

        finally(
          fn() store(task.task-state,Task-completed),
          fn()
            match (portal,resume,result)
              (Just(current),Just(resume-action),Just(completion)) ->
                match current
                  Reentry(root,_,_) ->
                    run-reentry(current,fn()
                      resume-generation(root,family,fn()
                        resume-action(completion,True)
                      )
                    )
              _ -> ()
        )
      _ -> ()

fun accept-task-result(task : generation-task<a,e>, family : async-family<e>,
                       result : await-result<a>, _is-done : bool) : <div,ui> ()
  lift-div fn()
    // `is-done` is reserved for future stream adapters. Primitive Kokaine
    // awaits are one-shot: the first callback owns the scheduled resumption.
    match load(task.task-state)
      Task-pending ->
        store(task.task-result,Just(result))
        store(task.task-state,Task-scheduled)
        enqueue-microtask(runtime-host-action(fn()
          run-task-result(task,family)
        ))
      _ -> ()

fun retire-task(task : generation-task<a,e>, family : async-family<e>,
                retired : bool)
               : <signal-write,pure,ui|e> ()
  match load(task.task-state)
    Task-pending -> retire-task-now(task,family,retired)
    Task-scheduled -> retire-task-now(task,family,retired)
    _ -> ()

fun retire-task-now(task : generation-task<a,e>, family : async-family<e>,
                    retired : bool)
                   : <signal-write,pure,ui|e> ()
  val portal = load(task.task-portal)
  val resume = load(task.task-resume)
  val disposer = load(task.task-disposer)

  // Gate and revoke first. A disposer is untrusted host code and may invoke a
  // stale callback synchronously; that callback must already see a terminal
  // state and no retained Koka payload.
  store(task.task-state,if retired then Task-retired else Task-canceled)
  store(task.task-result,Nothing)
  store(task.task-portal,Nothing)
  store(task.task-resume,Nothing)
  store(task.task-disposer,Nothing)
  task.detach-owner
  decrement-outstanding()
  family.prune

  val cancel-strand = fn()
    // Retirement finalizers likewise run without an ambient exception handler.
    // Cancellation is best-effort, but a failed user `finally` is reported
    // while the outer `finally` still guarantees host disposal afterward.
    with catch fn(problem)
      report-async-error("uncaught Kokaine async cancellation exception (" ++
                         task.task-label ++ "): " ++ problem.show)
    match (portal,resume)
      (Just(current),Just(resume-action)) ->
        match current
          Reentry(root,_,_) ->
            // Normal re-entry must reject this frame after structural
            // retirement. The private retirement context restores handlers
            // solely to discontinue the already-owned strand. If a `finally`
            // attempts another await, registration sees the dead frame and
            // fails before host setup.
            run-retirement-reentry(current,fn()
              resume-generation(root,family,fn()
                resume-action(Cancel,True)
              )
            )
      _ -> ()
  val dispose-host = fn()
    match disposer
      Nothing -> ()
      Just(dispose) -> dispose()
  // Preserve the structural cleanup capability row even though both branches
  // have handled their own exception/divergence paths and now infer as `ui`.
  mask<signal-write>{
    lift-exn(fn() lift-div(fn() finally(dispose-host,cancel-strand)))
  }


// --------------------------------------------------------------------------
// Owner registration and host setup
// --------------------------------------------------------------------------

fun register-task(
      root : root<<ui|e>>,
      runtime : generation-runtime<e>,
      scope : async-scope,
      label : string,
      setup : await-setup<a>,
      resume-action : (await-result<a>,bool) -> <async,signal-read,signal-write,pure,ui|e> ())
    : <signal-write,pure,ui|e> ()
  check-not-pure-plane("async suspension")

  // Capturing before setup binds this exact await to the frame/gate active at
  // the operation. `on-cleanup` validates registration and links cancellation
  // into the existing owner ledger before JavaScript can retain its callback.
  val portal = capture-reentry(root)
  val family = runtime.runtime-family
  val task-id = family.fresh-task-id
  val task = Generation-task(
    cell(Task-pending),cell(Nothing),cell(Just(portal)),
    cell(Just(resume-action)),cell(Nothing),cell(Nothing),cell(Nothing),label
  )
  val capability = Task-capability(
    task-id,
    scope,
    fn() task.is-active,
    fn(retired) retire-task(task,family,retired)
  )

  val owner-stop = task.task-owner-stop
  store(owner-stop,Just(fn() family.stop-task(task-id,True)))
  val registration = register-cleanup(root,fn()
    // Consume before stopping: retirement recursively detaches this task, and
    // the owner action must remain one-shot under aliased cleanup paths.
    val stop = load(owner-stop)
    store(owner-stop,Nothing)
    match stop
      Nothing -> ()
      Just(stop-task) -> stop-task()
  )
  store(task.task-owner-registration,Just(registration))

  // Publish the operation only after its owner link is durable. If structural
  // registration rejects a dead frame, no runtime ledger or debug counter can
  // retain the uninstalled task.
  store(family.family-tasks,
        Cons(capability,load(family.family-tasks)))
  increment-outstanding()

  if runtime.is-canceled(scope) then
    retire-task(task,family,False)
  else
    val complete = fn(result,is-done)
      as-host-action(fn()
        accept-task-result(task,family,result,is-done)
      )()
    match setup(complete)
      Error(problem) ->
        accept-task-result(task,family,Exception(problem),True)
      Ok(dispose) ->
        match load(task.task-state)
          Task-pending -> store(task.task-disposer,Just(dispose))
          Task-scheduled -> store(task.task-disposer,Just(dispose))
          _ -> dispose()

noinline fun cancel-runtime-scope(runtime : generation-runtime<e>,
                                  scope : async-scope)
                                 : <signal-write,pure,ui|e> ()
  runtime.record-canceled(scope)
  load(runtime.runtime-family.family-tasks).foreach fn(capability)
    match capability
      Task-capability(_,task-scope,active,stop) ->
        if active() && task-scope <= scope then stop(False) else ()

noinline fun release-runtime-scope(runtime : generation-runtime<e>,
                                   scope : async-scope) : ()
  runtime.release-canceled(scope)

// Some host resources outlive the await which creates them. Register their
// disposer directly with the current reactive generation and return a
// one-shot release action for ownership transfer. Both paths consume the same
// slot before unlinking or invoking host code, so re-entry cannot double-run
// either transition.
fun register-owned-disposer(root : root<<ui|e>>, dispose : dispose-fn)
                           : <signal-write,pure,ui|e> ownership-release-fn
  val disposer-slot : ref<global,maybe<dispose-fn>> = cell(Just(dispose))
  val committed = cell(False)
  val rollback = fn()
    if load(committed) then () else dispose()
  finally(
    rollback,
    fn()
      val registration = register-cleanup(root,fn()
        val current = load(disposer-slot)
        store(disposer-slot,Nothing)
        match current
          Nothing -> ()
          Just(current-dispose) ->
            decrement-outstanding()
            current-dispose()
      )
      increment-outstanding()
      store(committed,True)
      fn()
        // Retirement may already have claimed the registered cleanup into a
        // detached snapshot. Only a successful unlink may consume this slot;
        // otherwise the snapshot remains responsible for disposal/counting.
        if !registration.try-unregister then False else
          val current = load(disposer-slot)
          store(disposer-slot,Nothing)
          match current
            Nothing -> False
            Just(_) ->
              decrement-outstanding()
              True
  )

// Scheduled host actions are ordinary generation-owned tasks. Keep their
// structural phase evidence live through registration; erasing it would make
// owner cleanup masks invalid at runtime on Koka's JavaScript backend.
fun register-scheduled-ioc(root : root<<ui|e>>,
                           runtime : generation-runtime<e>,
                           scope : async-scope,
                           host-action : () -> ui ())
                          : <signal-write,pure,ui|e> ()
  val scheduled-setup = fn(resume)
    enqueue-microtask(fn() resume(Result(()),True))
    Ok(fn() ())
  val scheduled-resume = fn(result,_)
    match result
      Result(_) -> host-action()
      _ -> ()
  register-task(root,runtime,scope,"scheduled host action",
                scheduled-setup,scheduled-resume)


// --------------------------------------------------------------------------
// Async interpreter
// --------------------------------------------------------------------------

// Factoring the await interpreter is important for both dynamic and static
// semantics. Dynamically, its prompt is installed inside the other base
// handlers, so none of those handler frames become part of the parked suffix.
// Statically, the shallow resumption retains the complete residual async row;
// the caller below discharges those effects with the surrounding handlers.
fun interpret-generation-await(
    root : root<<ui|e>>,
    family : async-family<e>,
    runtime : generation-runtime<e>,
    action : () -> <async,signal-read,signal-write,pure,ui|e> ())
    : <async-cancel,async-ioc,async-ownership,discontinue,signal-read,
       signal-write,pure,ui|e> ()
  with handler<async-await>
    raw ctl do-await(setup,scope,label)
      // Exact rows require the raw clause body to preserve the effects which
      // remain outside this single-effect interpreter.
      mask<async-cancel>{
        mask<async-ioc>{
          mask<async-ownership>{
            mask<discontinue>{
              if runtime.is-canceled(scope) then
                resume-generation(root,family,fn()
                  rcontext.resume-shallow(Cancel)
                )
              else
                // The resumed suffix may sample, but it is always invoked under
                // captured re-entry. Registration itself performs no read.
                mask<signal-read>{
                  register-task(root,runtime,scope,label,setup,
                    fn(result,_) rcontext.resume-shallow(result))
                }
            }
          }
        }
      }

    fun no-await(setup,scope,label,callback)
      mask<async-cancel>{
        mask<async-ioc>{
          mask<async-ownership>{
            mask<discontinue>{
              if runtime.is-canceled(scope) then callback(Cancel) else
                mask<signal-read>{
                  register-task(root,runtime,scope,label,setup,
                    fn(result,_) callback(result))
                }
            }
          }
        }
      }

  action()

// Install this inside an already established Kokaine turn (in particular,
// inside the action passed to `reenter`). A raw await returns from this handler,
// allowing the surrounding re-entry batch to close. Each later completion
// calls this function again only after entering a fresh generation-bound batch.
fun run-generation-async-with-family(
    root : root<<ui|e>>,
    family : async-family<e>,
    action : () -> <async,signal-read,signal-write,pure,ui|e> ())
    : <signal-read,signal-write,pure,ui|e> ()
  val runtime = Generation-runtime(family)

  with handler<async-ioc>
    fun async-ioc(host-action)
      // Exact effect rows require the clause to preserve the surrounding turn
      // capabilities. The host action itself is `ui`-only, so these labels are
      // latent and may be masked without hiding an operation it can perform.
      mask<signal-read>{
        mask<signal-write>{
          lift-exn(fn() lift-div(host-action))
        }
      }

    fun async-schedule-ioc(scope,host-action)
      mask<signal-read>{
        register-scheduled-ioc(root,runtime,scope,host-action)
      }


  with handler<async-ownership>
    fun async-own-disposer(dispose)
      mask<async-ioc>{
        mask<signal-read>{ register-owned-disposer(root,dispose) }
      }

  with handler<async-cancel>
    val async-scope = root-scope

    fun cancel-scope(scope)
      // Cancellation itself needs the live signal-write evidence below these
      // unused residual handlers. In particular, do not erase that evidence.
      mask<async-ioc>{
        mask<async-ownership>{
          mask<signal-read>{ cancel-runtime-scope(runtime,scope) }
        }
      }

    fun release-canceled-scope(scope)
      mask<async-ioc>{
        mask<async-ownership>{
          mask<signal-read>{
            mask<signal-write>{
              mask<ui>{
                lift-exn(fn() lift-div(fn()
                  release-runtime-scope(runtime,scope)
                ))
              }
            }
          }
        }
      }

    fun is-scope-canceled(scope)
      mask<async-ioc>{
        mask<async-ownership>{
          mask<signal-read>{
            mask<signal-write>{
              mask<ui>{
                lift-exn(fn() lift-div(fn() runtime.is-canceled(scope)))
              }
            }
          }
        }
      }

  with handler<discontinue>
    final ctl discontinue() ()

  // Keep the primitive await prompt innermost among the runtime's base
  // handlers. A shallow resumption then contains application-level lexical
  // handlers, but none of this generation's base interpreter.
  interpret-generation-await(root,family,runtime,action)

pub fun run-generation-async(
    root : root<<ui>>,
    action : () -> <async,signal-read,signal-write,pure,ui> ())
    : <signal-read,signal-write,pure,ui> ()
  run-generation-async-with-family(
    root,Async-family(cell([]),cell([]),cell(1)),action
  )
