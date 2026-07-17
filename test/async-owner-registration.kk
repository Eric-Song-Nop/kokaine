module async-owner-registration

import kokaine/async/effects
import kokaine/async/structured
import kokaine/reactive/internal/model
import kokaine/reactive/effects
import kokaine/reactive/internal/resource
import kokaine/reactive/internal/runtime
import kokaine/reactive/internal/async-runtime
import std/core/undiv


extern begin-result() : ui ()
  js inline "globalThis.__kokaineAsyncOwner={ done:false, owned:-1, outstanding:-1, leasedOwned:-1, leasedOutstanding:-1, leaseDisposals:0, snapshotLeaseDisposals:0, structuredSnapshotLeaseDisposals:0, reentrantDisposals:0, reentrantFinalizers:0, reentrantRootDisposed:false }"

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

extern publish-result(owned : int, outstanding : int,
                      leased-owned : int, leased-outstanding : int) : ui ()
  js inline "Object.assign(globalThis.__kokaineAsyncOwner,{ done:true, owned:#1, outstanding:#2, leasedOwned:#3, leasedOutstanding:#4 })"

fun owned-resource-count(values : owned<e>) : <div> int
  match values
    Owned-end -> 0
    Owned-fork(_,next) -> owned-resource-count(next)
    Owned-derive-fork(_,next) -> owned-resource-count(next)
    Owned-resource(_,next) -> 1 + owned-resource-count(next)

fun root-owned-resource-count(root : root<e>) : int
  pretend-no-div{ owned-resource-count(load(root.root-owned)) }

fun complete-three() : async ()
  val _ = await1-noexn("owner registration one",fn(complete) complete(1))
  val _ = await1-noexn("owner registration two",fn(complete) complete(2))
  val _ = await1-noexn("owner registration three",fn(complete) complete(3))
  ()

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

pub fun main()
  begin-result()
  exercise-snapshot-release-race()
  exercise-structured-snapshot-release-race()
  exercise-reentrant-host-disposal()
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
