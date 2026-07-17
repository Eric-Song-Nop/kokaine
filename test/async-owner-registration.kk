module async-owner-registration

import kokaine/async/effects
import kokaine/async/structured
import kokaine/reactive/internal/model
import kokaine/reactive/effects
import kokaine/reactive/internal/resource
import kokaine/reactive/internal/runtime
import kokaine/reactive/internal/async-runtime
import kokaine/reactive/internal/registry
import std/core/undiv


extern begin-result() : ui ()
  js inline "globalThis.__kokaineAsyncOwner={ done:false, owned:-1, outstanding:-1, leasedOwned:-1, leasedOutstanding:-1, leaseDisposals:0, snapshotLeaseDisposals:0, structuredSnapshotLeaseDisposals:0, reentrantDisposals:0, reentrantFinalizers:0, reentrantRootDisposed:false, siblingCancellations:0, siblingDisposals:0, siblingRootDisposed:false, familyFinalizers:0, familyDisposals:0, familyRootDisposed:false, claimMode:'', claimObservations:{ retireFirst:{ count:0, violation:false, maxOutstanding:0, maxOwned:0 }, completionFirst:{ count:0, violation:false, maxOutstanding:0, maxOwned:0 } } }"

extern select-claim-mode(mode : string) : ui ()
  js inline "globalThis.__kokaineAsyncOwner.claimMode=#1"

extern record-claim-observation(outstanding : int, owned : int) : ui ()
  js inline "(function(){ var owner=globalThis.__kokaineAsyncOwner; var sample=owner.claimObservations[owner.claimMode]; sample.count+=1; sample.maxOutstanding=Math.max(sample.maxOutstanding,Number(#1)); sample.maxOwned=Math.max(sample.maxOwned,Number(#2)); if(Number(#1)!==0 || Number(#2)!==0) sample.violation=true; })()"

extern queue-host-action(action : () -> ui ()) : ui ()
  js inline "queueMicrotask(#1)"

extern record-lease-disposal() : ui ()
  js inline "globalThis.__kokaineAsyncOwner.leaseDisposals += 1"

extern record-snapshot-lease-disposal() : ui ()
  js inline "globalThis.__kokaineAsyncOwner.snapshotLeaseDisposals += 1"

extern record-structured-snapshot-lease-disposal() : ui ()
  js inline "globalThis.__kokaineAsyncOwner.structuredSnapshotLeaseDisposals += 1"

extern record-reentrant-disposal() : ui ()
  js inline "globalThis.__kokaineAsyncOwner.reentrantDisposals += 1"

extern record-reentrant-finalizer() : ui ()
  js inline "globalThis.__kokaineAsyncOwner.reentrantFinalizers += 1"

extern record-reentrant-root-disposed(disposed : bool) : ui ()
  js inline "globalThis.__kokaineAsyncOwner.reentrantRootDisposed=#1"

extern record-sibling-cancellation() : ui ()
  js inline "globalThis.__kokaineAsyncOwner.siblingCancellations += 1"

extern record-sibling-disposal() : ui ()
  js inline "globalThis.__kokaineAsyncOwner.siblingDisposals += 1"

extern record-sibling-root-disposed(disposed : bool) : ui ()
  js inline "globalThis.__kokaineAsyncOwner.siblingRootDisposed=#1"

extern record-family-finalizer() : ui ()
  js inline "globalThis.__kokaineAsyncOwner.familyFinalizers += 1"

extern record-family-disposal() : ui ()
  js inline "globalThis.__kokaineAsyncOwner.familyDisposals += 1"

extern record-family-root-disposed(disposed : bool) : ui ()
  js inline "globalThis.__kokaineAsyncOwner.familyRootDisposed=#1"

extern publish-result(owned : int, outstanding : int,
                      leased-owned : int, leased-outstanding : int) : ui ()
  js inline "Object.assign(globalThis.__kokaineAsyncOwner,{ done:true, owned:#1, outstanding:#2, leasedOwned:#3, leasedOutstanding:#4 })"

fun root-owned-resource-count(root : root<e>) : int
  root.root-lifetime.lifetime-finalizers.count

fun observe-supervisor-claim(root : root<<ui>>) : ui ()
  record-claim-observation(
    generation-async-outstanding(),root-owned-resource-count(root))

fun install-supervised-no-await(root : root<<ui>>, ready : bool) : <async,ui> ()
  val setup : await-setup<()> = fn(complete)
    if ready then complete(Result(()),True) else ()
    Ok(fn() observe-supervisor-claim(root))
  no-await(setup,async-scope,"supervisor sibling",fn(result)
    match result
      Cancel -> observe-supervisor-claim(root)
      _ -> ()
  )

fun park-supervisor-siblings(root : root<<ui>>, ready-first : bool,
                             retire-later : bool) : <async,ui> ()
  install-supervised-no-await(root,ready-first)
  install-supervised-no-await(root,False)
  if retire-later
  then queue-host-action(fn() dispose-root-from-host(root))
  else ()
  finally(
    fn() observe-supervisor-claim(root),
    fn()
      val park-setup = fn(_complete)
        fn() observe-supervisor-claim(root)
      val _ : () = setup/await-noexn(
        "supervisor parked sibling",park-setup)
      ()
  )

// Cover both race orders. In the first, retirement claims a Ready task before
// its queued completion turn. In the second, that completion unlinks first and
// a later host microtask retires the remaining siblings. Every disposer,
// Cancel callback, and lexical finally observes a fully detached supervisor.
fun exercise-supervisor-claim-order() : <ui,exn> ()
  select-claim-mode("retireFirst")
  val (retired-root,()) : (root<<ui>>,()) = create-root fn(_root) ()
  dispatch(retired-root,fn() {
    run-generation-async(retired-root,fn() {
      park-supervisor-siblings(retired-root,True,False)
    })
  })
  retired-root.dispose()

  select-claim-mode("completionFirst")
  val (completed-root,()) : (root<<ui>>,()) = create-root fn(_root) ()
  dispatch(completed-root,fn() {
    run-generation-async(completed-root,fn() {
      park-supervisor-siblings(completed-root,True,True)
    })
  })
  // `park-supervisor-siblings` already queued root retirement. Start the
  // unrelated completion/unlink fixture only afterward so global outstanding
  // observability describes this supervisor and no other family.
  queue-host-action(fn() start-completed-owner-registration())

fun complete-three() : async ()
  val _ = await1-noexn("owner registration one",fn(complete) complete(1))
  val _ = await1-noexn("owner registration two",fn(complete) complete(2))
  val _ = await1-noexn("owner registration three",fn(complete) complete(3))
  ()

fun exercise-completed-owner-registration() : <ui,exn> ()
  val (root,()) : (root<<ui>>,()) = create-root fn(_root) ()
  dispatch(root,fn()
    run-generation-async(root,fn()
      complete-three()
      val release = async-own(fn() record-lease-disposal())
      val leased-owned = root-owned-resource-count(root)
      val leased-outstanding = generation-async-outstanding()
      release()
      publish-result(
        root-owned-resource-count(root),generation-async-outstanding(),
        leased-owned,leased-outstanding)
    )
  )

fun start-completed-owner-registration() : ui ()
  with catch fn(_problem) ()
  exercise-completed-owner-registration()

// Retirement first claims all owner slots into a detached snapshot. A newer
// cleanup may then attempt to release an older lease; the snapshot must remain
// the unique winner and still run the lease disposer exactly once.
fun exercise-snapshot-release-race() : <ui,exn> ()
  val (root,()) : (root<<ui>>,()) = create-root fn(_root) ()
  dispatch(root,fn()
    run-generation-async(root,fn()
      val release = async-own(fn() record-snapshot-lease-disposal())
      on-cleanup(root,fn() release())
    )
  )
  root.dispose()

// A structured child wraps the generation lease in its own ownership guard.
// Losing the generation unlink race must not let that nearer release clear the
// raw disposer which the detached retirement snapshot is still responsible for.
fun exercise-structured-snapshot-release-race() : <ui,exn> ()
  val (root,()) : (root<<ui>>,()) = create-root fn(_root) ()
  dispatch(root,fn()
    run-generation-async(root,fn()
      val _ = parallel(
        fn() {
          val release = async-own(
            fn() record-structured-snapshot-lease-disposal())
          on-cleanup(root,fn() release())
          1
        },
        fn() 2
      )
      ()
    )
  )
  root.dispose()

fun dispose-root-from-host(root : root<<ui>>) : ui ()
  with catch fn(_problem) ()
  root.dispose()

fun park-reentrant-host(root : root<<ui>>) : <async,ui> ()
  finally(
    fn() record-reentrant-finalizer(),
    fn()
      val _ : () = setup/await-noexn(
        "reentrant host disposal",fn(_complete)
          fn() {
            record-reentrant-disposal()
            dispose-root-from-host(root)
          }
      )
      ()
  )

fun start-reentrant-host(root : root<<ui>>) : <signal-write,pure,ui> ()
  mask<div>{
    mask<signal-write>{
      dispatch(root,fn()
        run-generation-async(root,fn() park-reentrant-host(root))
      )
    }
  }

// Retiring an effect scope revokes its pending host operation. That untrusted
// disposer may synchronously dispose the whole root, so the parked strand must
// receive Cancel and unwind its `finally` before host re-entry can kill it.
fun exercise-reentrant-host-disposal() : <ui,exn> ()
  val (root,stop) = create-root fn(root)
    create-effect(root,fn() 0,fn(_)
      start-reentrant-host(root)
    )
  stop()
  record-reentrant-root-disposed(root.is-disposed)

fun install-sibling(root : root<<ui>>, hostile : bool) : <async,ui> ()
  val setup : await-setup<()> = fn(_complete)
    Ok(fn() {
      record-sibling-disposal()
      if hostile then dispose-root-from-host(root) else ()
    })
  no-await(setup,async-scope,"hostile cancellation sibling",fn(result)
    match result
      Cancel -> record-sibling-cancellation()
      _ -> ()
  )

// Claiming a supervisor is a three-phase protocol: every task is terminal,
// every parked strand unwinds, and only then may an untrusted host disposer
// invalidate the root needed by a sibling cancellation turn.
fun exercise-hostile-sibling-disposal() : <ui,exn> ()
  val (root,()) : (root<<ui>>,()) = create-root fn(_root) ()
  dispatch(root,fn()
    run-generation-async(root,fn() {
      install-sibling(root,False)
      install-sibling(root,True)
      cancel-outstanding()
    })
  )
  record-sibling-root-disposed(root.is-disposed)

fun park-family(root : root<<ui>>, hostile : bool) : <async,ui> ()
  finally(
    fn() record-family-finalizer(),
    fn()
      val _ : () = setup/await-noexn(
        "detached family sibling",fn(_complete)
          fn() {
            record-family-disposal()
            if hostile then dispose-root-from-host(root) else ()
          }
      )
      ()
  )

fun start-detached-families(root : root<<ui>>)
                           : <signal-write,pure,ui> ()
  mask<div>{
    mask<signal-write>{
      dispatch(root,fn() {
        // The hostile family is newer, hence first in the frame's detached
        // LIFO retirement snapshot. The older family must still unwind after
        // that disposer synchronously completes whole-root retirement.
        run-generation-async(root,fn() park-family(root,False))
        run-generation-async(root,fn() park-family(root,True))
      })
    }
  }

fun exercise-detached-family-disposal() : <ui,exn> ()
  val (root,stop) = create-root fn(root)
    create-effect(root,fn() 0,fn(_) start-detached-families(root))
  stop()
  record-family-root-disposed(root.is-disposed)

pub fun main()
  begin-result()
  exercise-snapshot-release-race()
  exercise-structured-snapshot-release-race()
  exercise-reentrant-host-disposal()
  exercise-hostile-sibling-disposal()
  exercise-detached-family-disposal()
  exercise-supervisor-claim-order()
