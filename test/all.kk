module all

import std/core/unsafe
import std/num/int32

// One compile for the whole native suite. Each suite's `main` runs in
// order; a failure is reported and the remaining suites still run. The
// process exits nonzero on any failure, which `koka -e` and compiled Koka
// programs do not do for an uncaught exception.

import test/root-construction
import test/resource-finalization
import test/internal-registry
import test/internal-int-index
import test/source-capture-registry
import test/lifetime-foundation
import test/work-transaction
import test/integration-boundaries
import test/publication-effect
import test/integration-event
import test/async-host-turn
import test/async-host-dispatcher
import test/one-shot-task
import test/cancellation-supervisor
import test/trace-semantics
import test/structural-scopes
import test/targeted-settle
import test/targeted-settle-canary
import test/execution-planes
import test/derived-structural
import test/smoke
import test/continuation
import test/final-control-rollback
import test/resume-transaction-regression
import test/continuation-reentry
import test/reactive
import test/reactive-advanced
import test/reactive-stress
import test/kernel-regressions
import test/html
import test/key-index
import test/control-flow
import test/async-effects
import test/structured-async

extern exit-process(code : int32) : ndet ()
  c inline "exit(#1)"
  js inline "process.exit(#1)"

val failures : ref<global,int> = unsafe-total { ref(0) }

fun suite(name : string, action : () -> <console,exn,ndet,div|e> ()) : <console,ndet,div|e> ()
  with catch fn(problem)
    unsafe-total { failures := !failures + 1 }
    println("FAILED " ++ name ++ ": " ++ problem.message)
  action()

pub fun main()
  suite("root-construction",fn() test/root-construction/main())
  suite("resource-finalization",fn() test/resource-finalization/main())
  suite("internal-registry",fn() test/internal-registry/main())
  suite("internal-int-index",fn() test/internal-int-index/main())
  suite("source-capture-registry",fn() test/source-capture-registry/main())
  suite("lifetime-foundation",fn() test/lifetime-foundation/main())
  suite("work-transaction",fn() test/work-transaction/main())
  suite("integration-boundaries",fn() test/integration-boundaries/main())
  suite("publication-effect",fn() test/publication-effect/main())
  suite("integration-event",fn() test/integration-event/main())
  suite("async-host-turn",fn() test/async-host-turn/main())
  suite("async-host-dispatcher",fn() test/async-host-dispatcher/main())
  suite("one-shot-task",fn() test/one-shot-task/main())
  suite("cancellation-supervisor",fn() test/cancellation-supervisor/main())
  suite("trace-semantics",fn() test/trace-semantics/main())
  suite("structural-scopes",fn() test/structural-scopes/main())
  suite("targeted-settle",fn() test/targeted-settle/main())
  suite("targeted-settle-canary",fn() test/targeted-settle-canary/main())
  suite("execution-planes",fn() test/execution-planes/main())
  suite("derived-structural",fn() test/derived-structural/main())
  suite("smoke",fn() test/smoke/main())
  suite("continuation",fn() test/continuation/main())
  suite("final-control-rollback",fn() test/final-control-rollback/main())
  suite("resume-transaction-regression",fn() test/resume-transaction-regression/main())
  suite("continuation-reentry",fn() test/continuation-reentry/main())
  suite("reactive",fn() test/reactive/main())
  suite("reactive-advanced",fn() test/reactive-advanced/main())
  suite("reactive-stress",fn() test/reactive-stress/main())
  suite("kernel-regressions",fn() test/kernel-regressions/main())
  suite("html",fn() test/html/main())
  suite("key-index",fn() test/key-index/main())
  suite("control-flow",fn() test/control-flow/main())
  suite("async-effects",fn() test/async-effects/main())
  suite("structured-async",fn() test/structured-async/main())
  val failed = unsafe-total { !failures }
  if failed == 0 then println("native suite: 34 suites passed")
  else
    println("native suite: " ++ failed.show ++ " suite(s) failed")
    exit-process(1.int32)
