/*--------------------------------------------------------------------------
  Characterization checks for the raw resumptions used by the reactive
  observer scheduler. These intentionally test Koka's control semantics in
  isolation from the dependency tracker.
--------------------------------------------------------------------------*/
module continuation

import std/core/unsafe

fun cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(cell : ref<global,a>) : a
  unsafe-total { !cell }

fun store(cell : ref<global,a>, value : a) : ()
  unsafe-total { cell := value }

effect pause
  ctl pause(outcome : error<()>) : ()

effect ask
  fun ask() : int

type process<e>
  Done
  Paused(
    process-outcome  : error<()>,
    resume-process   : () -> e process<e>,
    finalize-process : () -> e process<e>
  )

fun once(action : () -> <pure|e> ()) : <pause,pure|e> ()
  val outcome = mask<pause>{ mask<exn>{ error/try(action) } }
  mask<exn>{ mask<div>{ pause(outcome) } }

fun cycle(action : () -> <pure|e> ()) : <pause,pure|e> ()
  once(action)
  cycle(action)

fun reify-cycle(action : () -> <pure|e> ())
               : <pure|e> process<<pure|e>>
  with raw ctl pause(outcome)
    Paused(outcome,fn() rcontext.resume(()),
                   fn() rcontext.finalize(Done))
  // The bootstrap suspension keeps registration lazy. Each later resume runs
  // exactly one action and captures the next one-shot continuation.
  pause(Ok(()))
  cycle(action)
  Done

fun reify-once(action : () -> <pause|e> ()) : e process<e>
  with raw ctl pause(outcome)
    Paused(outcome,fn() rcontext.resume(()),
                   fn() rcontext.finalize(Done))
  action()
  Done

fun step(state : process<e>) : e process<e>
  match state
    Done -> Done
    Paused(_,resume-process,_) -> resume-process()

fun cancel(state : process<e>) : e process<e>
  match state
    Done -> Done
    Paused(_,_,finalize-process) -> finalize-process()

fun with-ask(value : int, action : () -> <ask|e> a) : e a
  with fun ask() value
  action()

fun process-done(state : process<e>) : bool
  match state
    Done -> True
    _ -> False

fun process-failed(state : process<e>) : bool
  match state
    Paused(Error(_),_,_) -> True
    _ -> False

pub fun main()
  val count = cell(0)
  val first = with-ask(7,fn()
    reify-cycle fn()
      val next = load(count) + ask()
      store(count,next)
      if next == 11 then throw("expected process failure") else ()
  )
  val stayed-idle = load(count) == 0
  val second = with-ask(1,fn() first.step)
  val third = with-ask(10,fn() second.step)
  val fourth = with-ask(100,fn() third.step)
  val failed = process-failed(third)
  val done = with-ask(1000,fn() fourth.cancel)
  val recovered = stayed-idle && failed && process-done(done)

  val finalized = cell(False)
  val parked = reify-once fn()
    finally(fn() store(finalized,True),fn() pause(Ok(())))
  val canceled = parked.cancel

  if load(count) == 111 && recovered && load(finalized) && process-done(canceled)
  then println("continuation: resume, retry, and finalize passed")
  else throw("continuation characterization failed")
