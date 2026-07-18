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
module kokaine/reactive/async/internal/runtime

import kokaine/async/effects
import kokaine/async/internal/web-schedule
import kokaine/reactive/effects
import kokaine/reactive/internal/model
import kokaine/reactive/integration/internal/reentry
import kokaine/reactive/internal/runtime
import kokaine/reactive/async/internal/host-turn
import kokaine/async/internal/one-shot-task
import kokaine/async/internal/cancellation-supervisor
import kokaine/internal/registry
import kokaine/internal/int-index
import std/core/undiv


// --------------------------------------------------------------------------
// Task leases and lexical cancellation ownership
// --------------------------------------------------------------------------

// The parked suffix is resumed shallowly: its primitive `async-await` handler
// is deliberately absent. This lets the generation installed at the host
// callback boundary become the nearest base interpreter for the next await.
alias taskresume<e,a> = await-result<a> -> <async,signal-read,signal-write,pure,ui|e> ()

alias task-cancel-strand = () -> ui ()

// Cancellation is deliberately represented as two capabilities. A claimed
// batch first unwinds every parked Koka strand while its captured root context
// is still available; only afterward may an untrusted host disposer invalidate
// that context. Both capabilities remain one-shot because their TaskState was
// made terminal before this value became reachable.
type task-cancellation
  Task-cancellation(
    cancellation-strand  : task-cancel-strand,
    cancellation-dispose : dispose-fn
  )

type task-payload<a,e::E>
  Task-payload(
    payload-portal : reentry<<ui|e>>,
    payload-resume : taskresume<e,a>,
    payload-label  : string
  )

// One active supervisor represents one lexical async scope under the current
// structural generation. Its single owner cleanup claims every sibling task
// before any cancel strand or host disposer can re-enter user code.
type runtime-supervisor<e::E>
  Runtime-supervisor(
    supervisor-scope  : async-scope,
    supervisor-tasks  : cancellation-supervisor<task-cancellation>,
    supervisor-reason : ref<global,task-stop-reason>,
    supervisor-owner  : ref<global,maybe<cleanup-registration<<ui|e>>>>,
    supervisor-family : ref<global,maybe<registry-registration<runtime-supervisor<e>>>>,
    supervisor-index  : ref<global,maybe<int-index-registration<runtime-supervisor<e>>>>
  )

type generation-task<a,e::E>
  Generation-task(
    task-state      : one-shot-task<task-payload<a,e>,await-result<a>,dispose-fn>,
    task-supervisor : runtime-supervisor<e>,
    task-cancel     : ref<global,maybe<cancellation-registration<task-cancellation>>>
  )

// A family is the structured lifetime shared by all fresh turn interpreters
// descended from one `run-async` invocation. Cancellation in a later turn must
// still find sibling operations installed by an earlier turn.
type async-family<e::E>
  Async-family(
    family-supervisors : registry<runtime-supervisor<e>>,
    family-index       : int-index<runtime-supervisor<e>>,
    family-canceled    : ref<global,list<async-scope>>,
    family-root-scope  : async-scope,
    family-runner      : host-turn-runner<<exn,ui|e>,<exn,ui>>
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
// one-shot state machine. The intrusive registry makes an individual transfer
// constant-time and severs the stale release handle's links to every sibling.
abstract type async-lease-group
  Async-lease-group(
    lease-group-entries : registry<dispose-fn>
  )

extern report-async-error(message : string) : ui ()
  js inline "console.error(#1)"

// `accept-task-result` is operationally a finite `ui` callback (cell updates
// plus microtask enqueue). Its `div` label only closes the recursive type SCC
// formed by the parked continuation and the next generation handler.
fun as-host-action(action : () -> <div,ui> ()) : (() -> ui ())
  fn() pretend-no-div{ action() }

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
  Async-lease-group(new-registry())

pub fun async-lease-group/count(group : async-lease-group) : int
  match group
    Async-lease-group(entries) -> entries.count

pub noinline fun async-lease-group/has-linked-entries(
    group : async-lease-group) : bool
  match group
    Async-lease-group(entries) -> entries.has-linked-nodes

fun async-lease-release(
    registration : registry-registration<dispose-fn>)
    : ownership-release-fn
  fn()
    match registration.take
      Nothing -> False
      Just(_) ->
        decrement-outstanding()
        True

pub fun async-lease-group/own(group : async-lease-group,
                              dispose : dispose-fn) : ui ownership-release-fn
  match group
    Async-lease-group(entries) ->
      match entries.try-insert(dispose)
        Nothing ->
          // A re-entrant acquisition after retirement cannot become reachable.
          dispose()
          fn() False
        Just(registration) ->
          increment-outstanding()
          async-lease-release(registration)

fun account-async-lease-disposers(disposers : list<dispose-fn>) : ()
  pretend-no-div{
    var pending := disposers
    while { !pending.is-nil }
      match pending
        Nil -> ()
        Cons(_,rest) ->
          pending := rest
          decrement-outstanding()
  }

fun run-async-lease-disposers(disposers : list<dispose-fn>) : ui ()
  pretend-no-div{
    var pending := disposers
    while { !pending.is-nil }
      match pending
        Nil -> ()
        Cons(dispose,rest) ->
          pending := rest
          dispose()
  }

pub fun async-lease-group/dispose(group : async-lease-group) : ui ()
  match group
    Async-lease-group(entries) ->
      match entries.seal-detach
        Nothing -> ()
        Just(disposers) ->
          // Close and detach the complete ledger before invoking untrusted host
          // disposers. Re-entry and aliased cleanup therefore see a terminal
          // group and cannot claim any entry twice. Account for every slot
          // before invoking the first disposer.
          account-async-lease-disposers(disposers)
          run-async-lease-disposers(disposers)

// Keep row-polymorphic family internals out of generated Koka 3.2 `.kki`
// inline bodies; its interface printer otherwise emits an unparseable cache.
fun async-family/scope-is-within(family : async-family<e>,
                                 child : async-scope,
                                 ancestor : async-scope) : bool
  // The family's own root owns every task interpreted by the family, including
  // an explicitly routed foreign scope. Other namespace roots remain isolated.
  ancestor == family.family-root-scope || child <= ancestor

noinline fun runtime/is-canceled(runtime : generation-runtime<e>,
                                 scope : async-scope) : bool
  val family = runtime.runtime-family
  load(family.family-canceled)
    .any(fn(canceled) family.scope-is-within(scope,canceled))

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

fun runtime-supervisor/detach(supervisor : runtime-supervisor<e>) : ()
  // Break the direct scope lookup cycle before unlinking either enumeration
  // owner. A completed scope therefore cannot retain its family or siblings.
  val index = load(supervisor.supervisor-index)
  store(supervisor.supervisor-index,Nothing)
  match index
    Nothing -> ()
    Just(registration) ->
      val _ = registration.take
      ()
  val owner = load(supervisor.supervisor-owner)
  store(supervisor.supervisor-owner,Nothing)
  match owner
    Nothing -> ()
    Just(registration) ->
      val _ = registration.unregister
      ()
  val family = load(supervisor.supervisor-family)
  store(supervisor.supervisor-family,Nothing)
  match family
    Nothing -> ()
    Just(registration) ->
      val _ = registration.take
      ()

fun runtime-supervisor/claim(
    supervisor : runtime-supervisor<e>, reason : task-stop-reason)
    : list<task-cancellation>
  store(supervisor.supervisor-reason,reason)
  match supervisor.supervisor-tasks.claim-cancel
    Nothing -> []
    Just(actions) ->
      // The task registry is now sealed and detached. Remove the aggregate
      // structural/family edges before any returned action enters user code.
      supervisor.detach
      actions

fun run-task-cancel-strands(actions : list<task-cancellation>) : ui ()
  pretend-no-div{
    var pending := actions
    while { !pending.is-nil }
      match pending
        Nil -> ()
        Cons(Task-cancellation(unwind,_),rest) ->
          pending := rest
          unwind()
  }

fun run-task-host-disposers(actions : list<task-cancellation>) : ui ()
  pretend-no-div{
    var pending := actions
    while { !pending.is-nil }
      match pending
        Nil -> ()
        Cons(Task-cancellation(_,dispose),rest) ->
          pending := rest
          dispose()
  }

fun run-task-cancellations(actions : list<task-cancellation>) : ui ()
  // Both capabilities are `ui`-closed. Modeled exceptions and final control
  // are consumed inside the cancellation strand; a raw JavaScript throw would
  // violate the host callback contract and cannot be recovered by Koka code.
  finally(
    fn() run-task-host-disposers(actions),
    fn() run-task-cancel-strands(actions)
  )

fun new-runtime-supervisor(
    root : root<<ui|e>>, family : async-family<e>, scope : async-scope)
    : <signal-write,pure,ui|e> runtime-supervisor<e>
  val supervisor = Runtime-supervisor(
    scope,new-cancellation-supervisor(),cell(Task-canceled),
    cell(Nothing),cell(Nothing),cell(Nothing))
  // One cleanup represents the whole lexical scope. Retirement claims every
  // TaskState first; only the detached action list may resume/dispose tasks.
  val owner = register-cleanup(root,fn()
    val actions = runtime-supervisor/claim(supervisor,Task-retired)
    run-task-cancellations(actions)
  )
  store(supervisor.supervisor-owner,Just(owner))
  val family-registration = family.family-supervisors.insert(supervisor)
  store(supervisor.supervisor-family,Just(family-registration))
  // Publish keyed lookup only after both cleanup/enumeration owners exist.
  val index-registration = family.family-index.insert(
    scope.identity-key,supervisor)
  store(supervisor.supervisor-index,Just(index-registration))
  supervisor

fun runtime/supervisor(
    runtime : generation-runtime<e>, root : root<<ui|e>>, scope : async-scope)
    : <signal-write,pure,ui|e> runtime-supervisor<e>
  val family = runtime.runtime-family
  match family.family-index.lookup(scope.identity-key)
    Just(supervisor) -> supervisor
    Nothing -> new-runtime-supervisor(root,family,scope)

fun task/detach-cancellation(task : generation-task<a,e>) : ()
  val registration = load(task.task-cancel)
  store(task.task-cancel,Nothing)
  match registration
    Nothing -> ()
    Just(current) ->
      val _ = current.unregister
      ()
  if task.task-supervisor.supervisor-tasks.count <= 0
  then task.task-supervisor.detach
  else ()

// --------------------------------------------------------------------------
// Completion and retirement
// --------------------------------------------------------------------------

fun run-task-result(task : generation-task<a,e>, family : async-family<e>)
                   : <div,ui> ()
  lift-div fn()
    match task.task-state.claim-ready
      Nothing -> ()
      Just(Task-claim(payload,result,_disposer)) ->
        // `claim-ready` has already replaced all retained fields with Running.
        // Unlink both ownership indexes before the host-turn runner restores
        // handlers or executes any continuation/user action.
        task.detach-cancellation
        decrement-outstanding()
        match payload
          Task-payload(portal,resume-action,label) ->
            // Browser turns have no ambient Koka exception stack. The runner
            // closes the family row around the complete reactive turn; this
            // outer boundary reports any remaining exn.
            with catch fn(problem)
              report-async-error("uncaught Kokaine async exception (" ++
                                 label ++ "): " ++ problem.show)
            finally(
              fn() { val _ = task.task-state.finish; () },
              fn()
                match result
                  Nothing -> ()
                  Just(completion) ->
                    val root = portal.root
                    family.family-runner.run(fn()
                      run-reentry(portal,fn() {
                        resume-generation(root,family,fn() {
                          resume-action(completion)
                        })
                      })
                    )
            )

fun accept-task-result(task : generation-task<a,e>, family : async-family<e>,
                       result : await-result<a>) : <div,ui> ()
  lift-div fn()
    // Primitive Kokaine awaits are one-shot: the first callback owns the
    // scheduled resumption.
    if task.task-state.accept(result)
    then enqueue-microtask(as-host-action(fn() run-task-result(task,family)))
    else ()

fun stopped-task-cancellation(
    family : async-family<e>,
    claim : task-claim<task-payload<a,e>,await-result<a>,dispose-fn>)
    : <div> task-cancellation
  lift-div fn() {
    match claim
      Task-claim(Task-payload(portal,resume-action,label),_result,disposer) ->
        val cancel-strand = fn()
          // The task was made terminal and unlinked during the claim phase. A
          // stale/re-entrant host callback therefore cannot win while its parked
          // strand unwinds lexical finalizers inside the closed host turn.
          with catch fn(problem)
            report-async-error("uncaught Kokaine async cancellation exception (" ++
                               label ++ "): " ++ problem.show)
          val root = portal.root
          family.family-runner.run(fn()
            run-retirement-reentry(portal,fn() {
              resume-generation(root,family,fn() {
                resume-action(Cancel)
              })
            })
          )
        val dispose-host = fn()
          match disposer
            Nothing -> ()
            Just(dispose) -> dispose()
        Task-cancellation(
          cancel-strand,
          dispose-host)
  }

noinline fun task/claim-stop(task : generation-task<a,e>,
                             family : async-family<e>)
                    : <div> maybe<task-cancellation>
  val reason = load(task.task-supervisor.supervisor-reason)
  match task.task-state.claim-stop(reason)
    Nothing -> lift-div(fn() Nothing)
    Just(claim) ->
      // `claim-cancel` already detached the supervisor registry snapshot.
      // Drop this stale handle before returning an action which can re-enter.
      store(task.task-cancel,Nothing)
      decrement-outstanding()
      Just(stopped-task-cancellation(family,claim))


// --------------------------------------------------------------------------
// Owner registration and host setup
// --------------------------------------------------------------------------

fun register-task(
      root : root<<ui|e>>,
      runtime : generation-runtime<e>,
      scope : async-scope,
      label : string,
      setup : await-setup<a>,
      resume-action : await-result<a> -> <async,signal-read,signal-write,pure,ui|e> ())
    : <signal-write,pure,ui|e> ()
  check-not-pure-plane("async suspension")

  // Capturing before setup binds this exact await to the frame/gate active at
  // the operation. `on-cleanup` validates registration and links cancellation
  // into the existing owner ledger before JavaScript can retain its callback.
  val portal = capture-reentry(root)
  val family = runtime.runtime-family
  val supervisor = runtime.supervisor(root,scope)
  val state = new-one-shot-task(Task-payload(portal,resume-action,label))
  val task = Generation-task(state,supervisor,cell(Nothing))
  val cancellation = supervisor.supervisor-tasks.register(
    fn() pretend-no-div{ task.claim-stop(family) })
  store(task.task-cancel,Just(cancellation))

  // Publish the debug count only after both structural and lexical ownership
  // links are durable. Rejected registration cannot retain an unowned task.
  increment-outstanding()

  val complete = fn(result)
    as-host-action(fn()
      accept-task-result(task,family,result)
    )()
  match setup(complete)
    Error(problem) ->
      accept-task-result(task,family,Exception(problem))
    Ok(dispose) ->
      match task.task-state.install-disposer(dispose)
        Nothing -> ()
        Just(unclaimed) -> unclaimed()

tail fun reverse-cancellations-onto(
    values : list<task-cancellation>, collected : list<task-cancellation>)
    : <div> list<task-cancellation>
  match values
    Nil -> collected
    Cons(current,rest) ->
      reverse-cancellations-onto(rest,Cons(current,collected))

tail fun claim-scope-supervisors-loop(
    supervisors : list<runtime-supervisor<e>>, scope : async-scope,
    include-all : bool, collected : list<task-cancellation>)
    : <div> list<task-cancellation>
  match supervisors
    Nil -> collected.reverse
    Cons(supervisor,rest) ->
      val next = if include-all || supervisor.supervisor-scope <= scope
                 then reverse-cancellations-onto(
                        supervisor.claim(Task-canceled),collected)
                 else collected
      claim-scope-supervisors-loop(rest,scope,include-all,next)

fun claim-scope-supervisors(
    supervisors : list<runtime-supervisor<e>>, scope : async-scope,
    include-all : bool)
    : <div> list<task-cancellation>
  claim-scope-supervisors-loop(supervisors,scope,include-all,[])

noinline fun cancel-runtime-scope(runtime : generation-runtime<e>,
                                  scope : async-scope)
                                 : <signal-write,pure,ui|e> ()
  runtime.record-canceled(scope)
  val family = runtime.runtime-family
  // First claim every matching supervisor/task in the immutable registry
  // snapshot. The family root explicitly includes routed foreign scopes; no
  // other namespace root can match them. Only after the full subtree is
  // terminal may cancellation run.
  val actions = claim-scope-supervisors(
    family.family-supervisors.snapshot,scope,
    scope == family.family-root-scope)
  run-task-cancellations(actions)

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
        if !registration.unregister then False else
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
    enqueue-microtask(fn() resume(Result(())))
    Ok(fn() ())
  val scheduled-resume = fn(result)
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
                    fn(result) rcontext.resume-shallow(result))
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
                    fn(result) callback(result))
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
    val async-scope = family.family-root-scope

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
  val runner : host-turn-runner<<exn,ui>,<exn,ui>> =
    Host-turn-runner(fn(run-action) run-action())
  run-generation-async-with-family(
    root,Async-family(new-registry(),new-int-index(),
                      cell([]),new-runtime-scope-root(),runner),action
  )
