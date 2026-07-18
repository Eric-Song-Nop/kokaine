/*--------------------------------------------------------------------------
  Amortized O(1) scheduler queues and short-lived bootstrap transactions.

  Structural owners never retain a work group. A group is installed only for
  the construction transaction which created it: resumptions stay global,
  while bootstraps append locally until the group is frozen.
--------------------------------------------------------------------------*/
module kokaine/reactive/internal/work-transaction

import std/core/unsafe
import std/core/undiv


fun cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }


// The front is stored in dequeue order and the back in reverse append order.
// Reversing an exhausted back list amortizes across all preceding appends.
pub type deque<a>
  Deque(
    deque-front : list<a>,
    deque-back  : list<a>
  )

pub fun empty-deque() : deque<a>
  Deque([],[])

pub fun deque/prepend(target : deque<a>, value : a) : deque<a>
  Deque(Cons(value,target.deque-front),target.deque-back)

pub fun deque/append(target : deque<a>, value : a) : deque<a>
  Deque(target.deque-front,Cons(value,target.deque-back))

pub fun deque/pop(target : deque<a>) : (maybe<a>,deque<a>)
  match target.deque-front
    Cons(value,rest) -> (Just(value),Deque(rest,target.deque-back))
    Nil ->
      val values = pretend-no-div{ reverse(target.deque-back) }
      match values
        Nil -> (Nothing,empty-deque())
        Cons(value,rest) -> (Just(value),Deque(rest,[]))

pub fun deque/values(target : deque<a>) : list<a>
  pretend-no-div{ target.deque-front ++ reverse(target.deque-back) }


pub alias work-queue<a> = ref<global,deque<a>>

pub fun new-work-queue() : work-queue<a>
  cell(empty-deque())

pub fun work-queue/prepend(target : work-queue<a>, value : a) : ()
  store(target,load(target).prepend(value))

pub fun work-queue/append(target : work-queue<a>, value : a) : ()
  store(target,load(target).append(value))

pub fun work-queue/pop(target : work-queue<a>) : maybe<a>
  val (value,rest) = load(target).pop
  store(target,rest)
  value

pub fun work-queue/values(target : work-queue<a>) : list<a>
  load(target).values

pub fun work-queue/clear(target : work-queue<a>) : ()
  store(target,empty-deque())

tail fun append-values-loop(target : work-queue<a>, values : list<a>)
                           : <div> ()
  match values
    Nil -> ()
    Cons(value,rest) ->
      target.append(value)
      append-values-loop(target,rest)

pub fun work-queue/append-values(target : work-queue<a>, values : list<a>) : ()
  pretend-no-div{ append-values-loop(target,values) }


pub type work-transaction-state
  Work-open
  Work-draining
  Work-ready
  Work-failed(work-failure : exception)
  Work-committed
  Work-aborted

pub type work-group<a>
  Work-group(
    group-state    : ref<global,work-transaction-state>,
    group-queue    : work-queue<a>,
    group-rollback : work-queue<a>
  )

pub fun new-work-transaction-state()
    : ref<global,work-transaction-state>
  cell(Work-open)

pub fun new-work-group(state : ref<global,work-transaction-state>)
                      : work-group<a>
  Work-group(state,new-work-queue(),new-work-queue())

pub noinline fun work-group/state(group : work-group<a>)
                                  : work-transaction-state
  load(group.group-state)

pub fun work-group/same-transaction(left : work-group<a>,
                                    right : work-group<b>) : bool
  unsafe-ptr-eq(left.group-state,right.group-state)

pub fun work-group/append(group : work-group<a>, value : a) : ()
  group.group-queue.append(value)

// A bootstrap enters the runnable queue once but remains in the rollback
// ledger until the complete transaction commits or aborts. Drain-time requeues
// use `append`/`prepend` and therefore cannot duplicate transaction ownership.
pub fun work-group/track(group : work-group<a>, value : a) : ()
  group.group-rollback.append(value)
  group.group-queue.append(value)

pub fun work-group/prepend(group : work-group<a>, value : a) : ()
  group.group-queue.prepend(value)

pub fun work-group/pop(group : work-group<a>) : maybe<a>
  group.group-queue.pop

pub fun work-group/values(group : work-group<a>) : list<a>
  group.group-queue.values

pub fun work-group/take-all(group : work-group<a>) : list<a>
  val values = group.values
  group.group-queue.clear
  values

pub fun work-group/take-rollback(group : work-group<a>) : list<a>
  val values = group.group-rollback.values
  group.group-rollback.clear
  values

pub fun work-group/release-rollback(group : work-group<a>) : ()
  group.group-rollback.clear

pub fun work-group/append-values(group : work-group<a>, values : list<a>) : ()
  group.group-queue.append-values(values)

pub fun work-group/clear(group : work-group<a>) : ()
  group.group-queue.clear
  group.group-rollback.clear

pub fun work-group/begin-drain(group : work-group<a>) : bool
  match group.state
    Work-open ->
      store(group.group-state,Work-draining)
      True
    _ -> False

pub fun work-group/mark-ready(group : work-group<a>) : bool
  match group.state
    Work-draining ->
      store(group.group-state,Work-ready)
      True
    _ -> False

pub fun work-group/mark-failed(group : work-group<a>, failure : exception)
                          : bool
  match group.state
    Work-open ->
      store(group.group-state,Work-failed(failure))
      True
    Work-draining ->
      store(group.group-state,Work-failed(failure))
      True
    _ -> False

pub fun work-group/mark-committed(group : work-group<a>) : bool
  match group.state
    Work-ready ->
      store(group.group-state,Work-committed)
      True
    _ -> False

pub fun work-group/mark-aborted(group : work-group<a>) : bool
  match group.state
    Work-committed -> False
    Work-aborted -> False
    _ ->
      store(group.group-state,Work-aborted)
      group.clear
      True

pub fun route-resume(global : work-queue<a>, value : a) : ()
  global.prepend(value)

pub fun route-bootstrap(global : work-queue<a>,
                        active : maybe<work-group<a>>, value : a) : ()
  match active
    Just(group) ->
      match group.state
        Work-open -> group.track(value)
        Work-draining -> group.track(value)
        _ -> global.append(value)
    Nothing -> global.append(value)
