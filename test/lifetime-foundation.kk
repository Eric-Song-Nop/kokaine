module lifetime-foundation

import kokaine/reactive/internal/model
import kokaine/reactive/internal/runtime
import kokaine/reactive/internal/capture
import kokaine/reactive/internal/lifetime
import kokaine/internal/registry
import kokaine/reactive/internal/scheduler
import std/core/unsafe
import std/core/undiv


effect ctl abandon-bootstrap() : ()

fun completes-bootstrap(action : () -> <abandon-bootstrap,exn> bool)
                       : exn bool
  with final ctl abandon-bootstrap() False
  action()

fun require-bootstrap(action : () -> <abandon-bootstrap,exn> a) : exn a
  with final ctl abandon-bootstrap()
    throw("unexpected bootstrap abandonment")
  action()


fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun hidden-load(value : ref<global,a>) : a
  unsafe-total { !value }

fun hidden-store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun emit(events : ref<global,list<string>>, event : string) : ()
  hidden-store(events,Cons(event,hidden-load(events)))

fun check(ok : bool, message : string)
  if ok then () else throw("lifetime foundation: " ++ message)

tail fun register-many(root : root<total>, remaining : int,
                       runs : ref<global,int>) : <div,exn> ()
  if remaining <= 0 then () else
    val _ = register-cleanup(root,fn()
      hidden-store(runs,hidden-load(runs) + 1)
    )
    register-many(root,remaining - 1,runs)

fun test-explicit-unregister-discards-without-running()
  val runs = hidden(0)
  val (root,registration) = create-root fn(root)
    register-cleanup(root,fn()
      hidden-store(runs,hidden-load(runs) + 1)
    )

  check(registration.unregister,"the live cleanup registration is removable")
  check(!registration.unregister,"cleanup unregistration is idempotent")
  check(hidden-load(runs) == 0,"unregister must discard rather than finalize")
  root.dispose()
  check(hidden-load(runs) == 0,"a removed cleanup cannot reappear at retirement")

fun test-retirement-snapshot-cannot-lose-a-sibling()
  val events = hidden([])
  val sibling-result = hidden(True)
  val older-slot : ref<global,maybe<cleanup-registration<total>>> =
    hidden(Nothing)
  val (root,()) : (root<total>,()) = create-root fn(root)
    val older = register-cleanup(root,fn() emit(events,"older"))
    hidden-store(older-slot,Just(older))
    val _ = register-cleanup(root,fn()
      emit(events,"newer")
      match hidden-load(older-slot)
        Nothing -> hidden-store(sibling-result,True)
        Just(current) -> hidden-store(sibling-result,current.unregister)
    )
    ()

  root.dispose()
  check(!hidden-load(sibling-result),
        "retirement must claim the whole snapshot before user cleanup")
  check(hidden-load(events).reverse == ["newer","older"],
        "snapshot ownership preserves exhaustive LIFO cleanup")

fun test-wide-retirement-is_stack_safe()
  val runs = hidden(0)
  val size = 50000
  val (root,()) : (root<total>,()) = create-root fn(root)
    pretend-no-div{ register-many(root,size,runs) }
  root.dispose()
  check(hidden-load(runs) == size,
        "wide retirement executes every finalizer exactly once")
  root.dispose()
  check(hidden-load(runs) == size,"wide retirement remains idempotent")

fun test-attempt-build-leaves-drafts-for-aggregate-retirement()
  val (root,source) : (root<<abandon-bootstrap>>,signal<int>) =
    require-bootstrap fn() create-root fn(root) signal(root,0)
  val plane = root.root-effect-plane
  val drafts : ref<global,list<trace<<abandon-bootstrap>>>> = hidden([])
  val owner-slot : ref<global,maybe<derive-producer>> = cell(Nothing)

  val completed = completes-bootstrap fn()
    val _ = lift-exn(fn()
      pretend-no-div{
        attempt-build(plane,drafts,fn()
          val built = reify-trace(
            root,plane,owner-slot,fn() source.get,fn(_) ())
          abandon-bootstrap()
          built
        )
      }
    )
    True

  check(!completed,"final control must abandon the draft transaction")
  match hidden-load(drafts)
    Nil -> throw("lifetime foundation: draft transaction captured no trace")
    Cons(current,_) ->
      match current.trace-state-of
        Capture-draft -> ()
        _ -> throw(
          "lifetime foundation: attempt-build retired caller-owned drafts")
  val cleaned = completes-bootstrap fn()
    pretend-no-div{ retire-drafts(hidden-load(drafts)) }
    root.dispose()
    True
  check(cleaned,"explicit aggregate cleanup must complete normally")

fun test-bootstrap-abort-detaches-scope-before-draft-cleanup()
  val scope-was-dead = hidden(False)
  val scope-token : ref<global,maybe<ref<global,scope-state>>> = hidden(Nothing)
  val (root,current) = require-bootstrap fn()
    create-root fn(root)
      val source = signal(root,0)
      val owner-slot : ref<global,maybe<derive-producer>> = cell(Nothing)
      val (current,_,_) = prepare-trace(
        root,root.root-effect-plane,owner-slot,Nothing,
        fn() source.get,
        fn(_)
          val frame = load(root.root-effect-plane.plane-current-frame)
          val _ = frame.frame-lifetime.register-finalizer(
            Retirement-finalizer(fn()
              match hidden-load(scope-token)
                Nothing -> ()
                Just(token) ->
                  match load(token)
                    Scope-dead -> hidden-store(scope-was-dead,True)
                    _ -> ()
            )
          )
          abandon-bootstrap()
      )
      hidden-store(scope-token,Just(current.scope-lifetime.lifetime-token))
      current

  val completed = completes-bootstrap fn()
    val _ = lift-exn(fn()
      pretend-no-div{ run-bootstrap(current) }
    )
    True
  check(!completed,"final control must abandon the bootstrap publication")
  check(hidden-load(scope-was-dead),
        "bootstrap rollback must detach its scope before raw draft cleanup")
  val disposed = completes-bootstrap fn()
    root.dispose()
    True
  check(disposed,"root disposal after bootstrap rollback must complete")

pub fun main()
  test-explicit-unregister-discards-without-running()
  test-retirement-snapshot-cannot-lose-a-sibling()
  test-wide-retirement-is_stack_safe()
  test-attempt-build-leaves-drafts-for-aggregate-retirement()
  test-bootstrap-abort-detaches-scope-before-draft-cleanup()
  println("lifetime-foundation: all checks passed")
