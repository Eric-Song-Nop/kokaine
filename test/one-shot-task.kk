module one-shot-task

import kokaine/reactive/internal/one-shot-task


fun check(ok : bool, message : string)
  if ok then () else throw("one-shot task: " ++ message)

fun test-completion-claims-every-retained-field-once()
  val task : one-shot-task<string,int,string> = new-one-shot-task("payload")
  check(!task.finish,"a pending task cannot fabricate completion")
  check(task.accept(7),"the first completion becomes ready")
  check(!task.finish,"a queued result is not running yet")
  check(!task.accept(8),"a duplicate completion loses")
  check(task.install-disposer("dispose") == Nothing,
        "a synchronous completion retains the later setup disposer")
  match task.claim-ready
    Nothing -> throw("one-shot task: ready state was not claimable")
    Just(Task-claim(payload,result,disposer)) ->
      check(payload == "payload","the claim owns the payload")
      check(result == Just(7),"the claim owns the winning result")
      check(disposer == Just("dispose"),"the claim owns the disposer")
  check(task.claim-ready.is-nothing,"a ready claim is one-shot")
  check(task.claim-stop(Task-retired).is-nothing,
        "a running payload is already stack-owned")
  check(task.finish,"the running owner can finish once")
  check(!task.finish,"terminal completion is idempotent")
  match task.phase
    Task-finished(Task-completed) -> ()
    _ -> throw("one-shot task: completion did not become terminal")

fun test-cancellation-wins-before-or-after-setup-returns()
  val early : one-shot-task<string,int,string> = new-one-shot-task("early")
  match early.claim-stop(Task-canceled)
    Nothing -> throw("one-shot task: pending cancellation did not win")
    Just(Task-claim(payload,result,disposer)) ->
      check(payload == "early","cancellation owns the pending payload")
      check(result.is-nothing,"pending cancellation has no result")
      check(disposer.is-nothing,"setup has not returned its disposer yet")
  check(early.install-disposer("late") == Just("late"),
        "late setup must dispose immediately after cancellation")
  check(!early.accept(1),"completion cannot revive a canceled task")
  match early.phase
    Task-finished(terminal) ->
      match terminal
        Task-stopped(reason) ->
          match reason
            Task-canceled -> ()
            _ -> throw("one-shot task: wrong cancellation reason")
        _ -> throw("one-shot task: cancellation looked completed")
    _ -> throw("one-shot task: cancellation reason was not retained")

  val queued : one-shot-task<string,int,string> = new-one-shot-task("queued")
  check(queued.accept(9),"a queued result becomes ready")
  check(queued.install-disposer("queued-dispose") == Nothing,
        "the queued task retains its disposer")
  match queued.claim-stop(Task-retired)
    Nothing -> throw("one-shot task: ready cancellation did not win")
    Just(Task-claim(payload,result,disposer)) ->
      check(payload == "queued","stop owns the queued payload")
      check(result == Just(9),"stop owns the queued result")
      check(disposer == Just("queued-dispose"),
            "stop owns the queued disposer")
  check(queued.claim-ready.is-nothing,
        "a canceled queued completion cannot run afterward")
  check(queued.claim-stop(Task-canceled).is-nothing,
        "terminal stop is idempotent")

pub fun main()
  test-completion-claims-every-retained-field-once()
  test-cancellation-wins-before-or-after-setup-returns()
  println("one-shot-task: all checks passed")
