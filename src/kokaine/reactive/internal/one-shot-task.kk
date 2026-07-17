/*--------------------------------------------------------------------------
  Single-cell ownership state for one-shot host tasks.

  Every transition stores its winning state before returning a payload. No
  user callback, disposer, or continuation runs while the cell is claimable.
--------------------------------------------------------------------------*/
module kokaine/reactive/internal/one-shot-task

import std/core/unsafe


fun cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }


pub type task-terminal
  Task-completed
  Task-canceled
  Task-retired

pub type task-phase
  Task-pending
  Task-ready
  Task-running
  Task-finished(task-terminal-state : task-terminal)

pub type task-claim<p,r,d>
  Task-claim(
    claim-payload  : p,
    claim-result   : maybe<r>,
    claim-disposer : maybe<d>
  )

type task-state<p,r,d>
  Task-state-pending(
    pending-payload  : p,
    pending-disposer : maybe<d>
  )
  Task-state-ready(
    ready-payload  : p,
    ready-result   : r,
    ready-disposer : maybe<d>
  )
  Task-state-running
  Task-state-terminal(terminal-state : task-terminal)

abstract type one-shot-task<p,r,d>
  One-shot-task(task-cell : ref<global,task-state<p,r,d>>)


pub fun new-one-shot-task(payload : p) : one-shot-task<p,r,d>
  One-shot-task(cell(Task-state-pending(payload,Nothing)))

pub noinline fun one-shot-task/phase(task : one-shot-task<p,r,d>)
                                      : task-phase
  match load(task.task-cell)
    Task-state-pending(_,_) -> Task-pending
    Task-state-ready(_,_,_) -> Task-ready
    Task-state-running -> Task-running
    Task-state-terminal(reason) -> Task-finished(reason)

pub fun one-shot-task/accept(task : one-shot-task<p,r,d>, result : r) : bool
  val target = task.task-cell
  match load(target)
    Task-state-pending(payload,disposer) ->
      store(target,Task-state-ready(payload,result,disposer))
      True
    _ -> False

// `Nothing` means the disposer was retained by the task. `Just(disposer)`
// transfers it back to setup code because another transition already won.
pub fun one-shot-task/install-disposer(task : one-shot-task<p,r,d>,
                                       disposer : d) : maybe<d>
  val target = task.task-cell
  match load(target)
    Task-state-pending(payload,Nothing) ->
      store(target,Task-state-pending(payload,Just(disposer)))
      Nothing
    Task-state-ready(payload,result,Nothing) ->
      store(target,Task-state-ready(payload,result,Just(disposer)))
      Nothing
    _ -> Just(disposer)

pub fun one-shot-task/claim-ready(task : one-shot-task<p,r,d>)
                              : maybe<task-claim<p,r,d>>
  val target = task.task-cell
  match load(target)
    Task-state-ready(payload,result,disposer) ->
      // Drop every retained field before the caller can enter host/user code.
      store(target,Task-state-running)
      Just(Task-claim(payload,Just(result),disposer))
    _ -> Nothing

pub fun one-shot-task/claim-stop(task : one-shot-task<p,r,d>,
                                 reason : task-terminal)
                             : maybe<task-claim<p,r,d>>
  val target = task.task-cell
  match load(target)
    Task-state-pending(payload,disposer) ->
      store(target,Task-state-terminal(reason))
      Just(Task-claim(payload,Nothing,disposer))
    Task-state-ready(payload,result,disposer) ->
      store(target,Task-state-terminal(reason))
      Just(Task-claim(payload,Just(result),disposer))
    _ -> Nothing

pub fun one-shot-task/finish(task : one-shot-task<p,r,d>) : bool
  val target = task.task-cell
  match load(target)
    Task-state-running ->
      store(target,Task-state-terminal(Task-completed))
      True
    _ -> False
