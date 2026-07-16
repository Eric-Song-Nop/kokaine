/*--------------------------------------------------------------------------
  Real-browser fixture for generation-bound asynchronous DOM actions.
--------------------------------------------------------------------------*/
module dom-async-runtime

import kokaine/async/effects
import kokaine/async/web
import kokaine/async/structured
import kokaine/reactive
import kokaine/reactive/internal/async-runtime
import kokaine/html
import kokaine/dom
import std/time/duration


extern begin-fixture() : ui ()
  js inline "(globalThis.__kokaineAsyncRuntime={ log:[], disposerCount:0, structuredOwnedDisposeCount:0, disposeRoot:null, outstanding:null })"

extern append-log(value : string) : ui ()
  js inline "globalThis.__kokaineAsyncRuntime.log.push(#1)"

extern record-disposer() : ui ()
  js inline "(globalThis.__kokaineAsyncRuntime.disposerCount += 1)"

extern record-structured-owned-disposal() : ui ()
  js inline "(globalThis.__kokaineAsyncRuntime.structuredOwnedDisposeCount += 1)"

extern resolved-promise(value : string) : promise<string>
  js inline "Promise.resolve(#1)"

extern rejected-promise(message : string) : promise<string>
  js inline "Promise.reject(new Error(#1))"

extern hostile-rejected-promise() : promise<string>
  js inline "Promise.reject(Object.defineProperty({},'message',{ get:function(){ throw new Error('message getter exploded'); } }))"

extern publish-controls(dispose-root : () -> ui (),
                        outstanding : () -> ui int) : ui ()
  js inline "(function(){ globalThis.__kokaineAsyncRuntime.disposeRoot=#1; globalThis.__kokaineAsyncRuntime.outstanding=#2; })()"

extern report-error(message : string) : ui ()
  js inline "console.error(#1)"

// Arrange the precise queue window used by the structured-retirement test:
// Promise completion schedules child delivery, this nested microtask retires
// the generation next, and the already-scheduled group driver would run last.
extern retire-generation-after-delivery() : ui ()
  js inline "queueMicrotask(function(){ queueMicrotask(function(){ document.querySelector('[id=async-toggle]').click(); }); })"


fun safe-dispose-root(root : root<<ui>>) : ui ()
  with catch fn(problem)
    report-error("root disposal failed: " ++ problem.message)
  root.dispose()

fun read-outstanding() : ui int
  generation-async-outstanding()

fun finish-count(finalizers : signal<int>, label : string)
                 : <signal-write,ui> ()
  append-log(label)
  finalizers.modify(fn(value) value + 1)

fun synchronous-double() : async string
  setup/await-noexn("synchronous duplicate completion",fn(complete)
    complete("first")
    complete("second")
    fn() record-disposer()
  )

fun setup-failure() : <async,exn> string
  setup/await("intentional setup failure",fn(_complete)
    Error(Exception("expected setup failure",ExnError))
  )

fun parked-structured-child(finalizers : signal<int>, label : string)
                            : <async,signal-write,ui> string
  finally(
    fn() finish-count(finalizers,label ++ "-finally"),
    fn()
      setup/await-noexn(label,fn(_complete)
        fn() append-log(label ++ "-dispose")
      )
  )

fun show-error(problem : exception) : string
  problem.message


pub fun main()
  begin-fixture()
  val (root,(phase,branch,finalizers)) = create-root fn(root)
    (signal(root,"idle"),signal(root,True),signal(root,0))

  val page = view
    div(attrs=[id("async-runtime-fixture")])
      span(attrs=[id("async-phase")])
        text { phase.get }
      span(attrs=[id("async-finalizers")])
        text { finalizers.get.show }

      button("timer",attrs=[
        id("async-timer"),kind("button"),
        on("click",fn(_)
          phase.set("timer-before")
          append-log("timer-before")
          sleep(35.milli-seconds)
          phase.set("timer-after")
          append-log("timer-after")
        )
      ])

      button("long timer",attrs=[
        id("async-long-timer"),kind("button"),
        on("click",fn(_)
          phase.set("long-timer-before")
          sleep(2147483648.milli-seconds)
          phase.set("long-timer-after")
        )
      ])

      button("long timer reschedule failure",attrs=[
        id("async-long-timer-failure"),kind("button"),
        on("click",fn(_)
          phase.set("long-timer-failure-before")
          with catch fn(problem)
            phase.set("long-timer-failed:" ++ show-error(problem))
          sleep(2147483648.milli-seconds)
          phase.set("long-timer-failure-was-not-raised")
        )
      ])

      button("promise",attrs=[
        id("async-promise"),kind("button"),
        on("click",fn(_)
          phase.set("promise-before")
          val value = resolved-promise("promise-after").await
          phase.set(value)
        )
      ])

      button("promise rejection",attrs=[
        id("async-promise-reject"),kind("button"),
        on("click",fn(_)
          phase.set("promise-reject-before")
          with catch fn(problem)
            phase.set("promise-rejected:" ++ show-error(problem))
          val _ = rejected-promise("expected rejection").await
          phase.set("promise-rejection-was-not-raised")
        )
      ])

      button("hostile promise rejection",attrs=[
        id("async-promise-hostile-reject"),kind("button"),
        on("click",fn(_)
          phase.set("promise-hostile-reject-before")
          with catch fn(problem)
            phase.set("promise-hostile-rejected:" ++ show-error(problem))
          val _ = hostile-rejected-promise().await
          phase.set("promise-hostile-rejection-was-not-raised")
        )
      ])

      button("synchronous duplicate",attrs=[
        id("async-sync-double"),kind("button"),
        on("click",fn(_)
          phase.set("sync-before")
          val value = synchronous-double()
          phase.set("sync:" ++ value)
        )
      ])

      button("setup failure",attrs=[
        id("async-setup-failure"),kind("button"),
        on("click",fn(_)
          phase.set("setup-before")
          with catch fn(problem)
            phase.set("setup-failed:" ++ show-error(problem))
          val _ = setup-failure()
          phase.set("setup-failure-was-not-raised")
        )
      ])

      button("uncaught async exception",attrs=[
        id("async-uncaught"),kind("button"),
        on("click",fn(_)
          phase.set("uncaught-before")
          sleep(0.milli-seconds)
          throw("expected uncaught async exception")
        )
      ])

      button("fetch",attrs=[
        id("async-fetch"),kind("button"),
        on("click",fn(_)
          phase.set("fetch-before")
          val response = fetch(get("/async-ok.txt")).require-ok
          phase.set("fetch:" ++ response.text)
        )
      ])

      button("fetch rejection",attrs=[
        id("async-fetch-reject"),kind("button"),
        on("click",fn(_)
          phase.set("fetch-reject-before")
          with catch fn(problem)
            phase.set("fetch-rejected:" ++ show-error(problem))
          val _ = fetch(get("/async-reject.txt"))
          phase.set("fetch-rejection-was-not-raised")
        )
      ])

      button("HTTP error",attrs=[
        id("async-http-error"),kind("button"),
        on("click",fn(_)
          phase.set("http-error-before")
          with catch fn(problem)
            phase.set("http-error:" ++ show-error(problem))
          val _ = fetch(get("/async-error.txt")).require-ok
          phase.set("http-error-was-not-raised")
        )
      ])

      button("parallel",attrs=[
        id("async-parallel"),kind("button"),
        on("click",fn(_)
          phase.set("parallel-before")
          val (left,right) = parallel(
            fn() {
              sleep(30.milli-seconds)
              "left"
            },
            fn() {
              sleep(10.milli-seconds)
              "right"
            }
          )
          phase.set("parallel:" ++ left ++ ":" ++ right)
        )
      ])

      button("parallel queued Fetch cancellation",attrs=[
        id("async-parallel-fetch-queued-cancel"),kind("button"),
        on("click",fn(_)
          phase.set("parallel-fetch-queued-before")
          with catch fn(problem)
            phase.set("parallel-fetch-queued-failed:" ++ show-error(problem))
          val pair = parallel(
            fn() setup-failure(),
            fn() {
              val result = fetch(get("/async-structured-owned.txt"))
              append-log("parallel-fetch-queued-after")
              result
            }
          )
          phase.set("parallel-fetch-queued-unexpected")
        )
      ])

      button("parallel owned Fetch rollback",attrs=[
        id("async-parallel-fetch-owned-rollback"),kind("button"),
        on("click",fn(_)
          phase.set("parallel-fetch-owned-before")
          with catch fn(problem)
            phase.set("parallel-fetch-owned-failed:" ++ show-error(problem))
          val pair = parallel(
            fn() {
              val result = fetch(get("/async-structured-owned.txt"))
              append-log("parallel-fetch-owned-after")
              result
            },
            fn() setup-failure()
          )
          phase.set("parallel-fetch-owned-unexpected")
        )
      ])

      button("parallel released ownership",attrs=[
        id("async-parallel-released-ownership"),kind("button"),
        on("click",fn(_)
          phase.set("parallel-released-ownership-before")
          with catch fn(problem)
            phase.set("parallel-released-ownership-failed:" ++
                      show-error(problem))
          val pair = parallel(
            fn() {
              val release = async-own(
                fn() record-structured-owned-disposal())
              async-host(release)
              "released"
            },
            fn() setup-failure()
          )
          phase.set("parallel-released-ownership-unexpected")
        )
      ])

      button("race",attrs=[
        id("async-race"),kind("button"),
        on("click",fn(_)
          phase.set("race-before")
          val winner = race(
            fn() {
              sleep(10.milli-seconds)
              "fast"
            },
            fn() {
              finally(
                fn() {
                  in-parent-scope(fn() sleep(0.milli-seconds))
                  append-log("race-loser-after-cleanup-await")
                  finish-count(finalizers,"race-loser-finally")
                },
                fn() {
                  sleep(150.milli-seconds)
                  "slow"
                }
              )
            }
          )
          phase.set("race:" ++ winner)
        )
      ])

      button("timeout",attrs=[
        id("async-timeout"),kind("button"),
        on("click",fn(_)
          phase.set("timeout-before")
          val result = timeout(
            10.milli-seconds,
            fn() {
              finally(
                fn() finish-count(finalizers,"timeout-loser-finally"),
                fn() {
                  sleep(150.milli-seconds)
                  "late"
                }
              )
            }
          )
          val next = match result
            Nothing -> "timeout:none"
            Just(value) -> "timeout:" ++ value
          phase.set(next)
        )
      ])

      button("cancel scoped schedule",attrs=[
        id("async-schedule-scope"),kind("button"),
        on("click",fn(_)
          phase.set("schedule-scope-before")
          cancelation-scope(fn()
            async-schedule(fn() append-log("canceled-schedule-ran"))
            cancel-outstanding()
          )
          phase.set("schedule-scope-after")
        )
      ])

      button("toggle generation",attrs=[
        id("async-toggle"),kind("button"),
        on-click(fn(_) branch.modify(fn(value) !value))
      ])

      dynamic
        if branch.get then
          div(attrs=[id("async-live-generation")])
            button("retire timer",attrs=[
              id("async-retire-timer"),kind("button"),
              on("click",fn(_)
                phase.set("retire-timer-before")
                finally(
                  fn() finish-count(finalizers,"retire-timer-finally"),
                  fn()
                    sleep(200.milli-seconds)
                    phase.set("retire-timer-stale")
                )
              )
            ])

            button("retire long timer chunk",attrs=[
              id("async-retire-long-timer"),kind("button"),
              on("click",fn(_)
                phase.set("retire-long-timer-before")
                finally(
                  fn() finish-count(finalizers,"retire-long-timer-finally"),
                  fn()
                    sleep(2147483648.milli-seconds)
                    phase.set("retire-long-timer-stale")
                )
              )
            ])

            button("retire scheduled completion",attrs=[
              id("async-retire-scheduled"),kind("button"),
              on("click",fn(_)
                phase.set("retire-scheduled-before")
                finally(
                  fn() finish-count(finalizers,"retire-scheduled-finally"),
                  fn()
                    val value = synchronous-double()
                    phase.set("retire-scheduled-stale:" ++ value)
                )
              )
            ])

            button("retire fetch",attrs=[
              id("async-retire-fetch"),kind("button"),
              on("click",fn(_)
                phase.set("retire-fetch-before")
                finally(
                  fn() finish-count(finalizers,"retire-fetch-finally"),
                  fn()
                    val response = fetch(get("/async-slow.txt")).require-ok
                    phase.set("retire-fetch-stale:" ++ response.text)
                )
              )
            ])

            button("retire streaming body",attrs=[
              id("async-retire-stream"),kind("button"),
              on("click",fn(_)
                phase.set("retire-stream-fetch-before")
                finally(
                  fn() finish-count(finalizers,"retire-stream-finally"),
                  fn()
                    val response = fetch(get("/async-stream.txt")).require-ok
                    phase.set("retire-stream-body-before")
                    val body = response.text
                    phase.set("retire-stream-stale:" ++ body)
                )
              )
            ])

            button("retire response between headers and body",attrs=[
              id("async-retire-header-gap"),kind("button"),
              on("click",fn(_)
                phase.set("retire-header-gap-fetch-before")
                finally(
                  fn() finish-count(finalizers,"retire-header-gap-finally"),
                  fn()
                    val response =
                      fetch(get("/async-header-gap.txt")).require-ok
                    phase.set("retire-header-gap-headers")
                    sleep(2.seconds)
                    phase.set("retire-header-gap-body-before")
                    val body = response.text
                    phase.set("retire-header-gap-stale:" ++ body)
                )
              )
            ])

            button("retire structured group",attrs=[
              id("async-retire-structured"),kind("button"),
              on("click",fn(_)
                phase.set("retire-structured-before")
                val _ = parallel(
                  fn() parked-structured-child(
                    finalizers,"retire-parallel-left"),
                  fn() race(
                    fn() parked-structured-child(
                      finalizers,"retire-nested-race-left"),
                    fn() parked-structured-child(
                      finalizers,"retire-nested-race-right")
                  )
                )
                phase.set("retire-structured-stale")
              )
            ])

            button("retire delivered structured result",attrs=[
              id("async-retire-structured-delivered"),kind("button"),
              on("click",fn(_)
                phase.set("retire-structured-delivered-before")
                val _ = parallel(
                  fn() finally(
                    fn() finish-count(
                      finalizers,"retire-delivered-left-finally"),
                    fn()
                      val value = resolved-promise("delivered").await
                      append-log("retire-delivered-left-after-await")
                      value
                  ),
                  fn()
                    async-host(fn() retire-generation-after-delivery())
                    parked-structured-child(
                      finalizers,"retire-delivered-right")
                )
                phase.set("retire-structured-delivered-stale")
              )
            ])
        else
          span("retired",attrs=[id("async-retired-generation")])

  val mounted = mount(root,query("#async-runtime-root"),page)
  publish-controls(fn() safe-dispose-root(root),read-outstanding)
