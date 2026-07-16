/*--------------------------------------------------------------------------
  Reification and one-shot bootstrap of exact synchronous read suffixes.
--------------------------------------------------------------------------*/
module kokaine/reactive/internal/capture

import kokaine/reactive/internal/model
import kokaine/reactive/effects
import kokaine/reactive/internal/lifetime
import kokaine/reactive/internal/scheduler
import std/core/undiv

// --------------------------------------------------------------------------
// Reifying exact read suffixes
// --------------------------------------------------------------------------

pub fun reify-trace(root : root<r>, plane : plane<e>,
                owner-slot : ref<global,maybe<derive-producer>>,
                track : () -> <signal-read,pure> a,
                publish : (value : a) -> <div,exn|e> ())
               : <div,exn|e> built-trace<e>
  with handler
        fun validate-derived(producer) -> {
          producer.settle-producer
        }
        return(value) -> {
          val terminal = load(plane.plane-current-frame)
          val checkpoint = load(plane.plane-current)
          Built-trace(
            Trace-end,
            fn() error/try(fn()
              // A publication starts a fresh structural extent. It must not
              // inherit a state entry target from the calculation it commits.
              with-entry(plane,Nothing,fn()
                with-context(plane,checkpoint,terminal,
                  fn() publish(value))
              )
            )
          )
        }
        raw ctl read-source(source,mode,producer) -> {
          check-root(root,source.source-root)
          match mode
            Sample-read -> rcontext.resume(load(source.source-cell))
            State-entry-read ->
              // This read injects latest committed state into the captured
              // entry suffix. It is neither self-validation nor a retained edge
              // to the memo's own source.
              val state = cell(Capture-draft)
              val gate = Continuation-gate(
                state,load(plane.plane-current),Nothing)
              val child = cell(Trace-end)
              val token = cell(Scope-starting)
              val owned = cell(Owned-end)
              val current-frame = Frame(token,owned)
              val current-frame-slot = cell(current-frame)
              val self = cell(Trace-end)
              val current = Trace-entry(
                gate,
                owner-slot,
                child,
                current-frame-slot,
                fn(_) with-entry(plane,Just(load(self)),fn()
                  rcontext.resume(load(source.source-cell))
                ),
                fn() {
                  val _ = rcontext.finalize(
                    Built-trace(Trace-end,fn() lift-div(fn() Ok(())))
                  )
                  ()
                }
              )
              store(self,current)
              record-draft(plane,current)
              val nested = with-entry(plane,Just(current),fn()
                with-current(plane,current,current-frame,
                  fn() rcontext.resume(load(source.source-cell)))
              )
              store(child,nested.built-root)
              Built-trace(current,nested.built-publish)
            Track-read ->
              val version = load(source.source-version)
              val entry = load(plane.plane-current-entry)
              val state = cell(Capture-draft)
              val gate = Continuation-gate(
                state,load(plane.plane-current),producer)
              val child = cell(Trace-end)
              val token = cell(Scope-starting)
              val owned = cell(Owned-end)
              val current-frame = Frame(token,owned)
              val current-frame-slot = cell(current-frame)
              val unlink = fn()
                store(source.source-captures,
                      compact-captures(load(source.source-captures)))
              val current = Trace-read(
                gate,
                owner-slot,
                entry,
                child,
                current-frame-slot,
                fn(_) with-entry(plane,entry,fn()
                  rcontext.resume(load(source.source-cell))
                ),
                fn() {
                  val _ = rcontext.finalize(
                    Built-trace(Trace-end,fn() lift-div(fn() Ok(())))
                  )
                  ()
                },
                unlink,
                fn() load(source.source-version) != version
              )
              record-draft(plane,current)
              val target = match entry
                Nothing -> current
                Just(entry-target) -> entry-target
              store(source.source-captures,
                    Cons(pack-capture(plane,target,current),
                         load(source.source-captures)))
              val nested = with-entry(plane,entry,fn()
                with-current(plane,current,current-frame,
                  fn() rcontext.resume(load(source.source-cell)))
              )
              store(child,nested.built-root)
              Built-trace(current,nested.built-publish)
        }
  track()


// --------------------------------------------------------------------------
// Continuation-backed effects
// --------------------------------------------------------------------------

pub fun prepare-trace(root : root<r>, plane : plane<e>,
                  owner-slot : ref<global,maybe<derive-producer>>,
                  parent : maybe<continuation-gate>,
                  track : () -> <signal-read,pure> a,
                  publish : (value : a) -> <div,exn|e> ())
                 : (continuation-scope<e>,work<e>,disposer<e>)
  val state = cell(Scope-starting)
  val structural-prefix = cell(Owned-end)
  val body = cell(Trace-end)
  val bootstrap-slot : ref<global,maybe<() -> <div|e> error<()>>> = cell(Nothing)
  val target-mark : ref<global,maybe<ref<global,bool>>> = cell(Nothing)
  val current = Scope(
    state,structural-prefix,body,parent,bootstrap-slot,target-mark)
  val bootstrap-run = fn()
    match load(state)
      Scope-starting ->
        val scope-frame = Frame(state,structural-prefix)
        val drafts = cell([])
        val completed = cell(False)
        finally(
          fn() lift-div(fn(){
            if load(completed) then () else
              // `run-bootstrap` retires the scope on a non-local exit; these
              // raw captures are not attached to scope.body yet and therefore
              // need their own dynamic rollback.
              val _ = try-retire-drafts(load(drafts))
              ()
          }),
          fn() lift-div(fn()
            val attempt = pretend-no-div{
              attempt-build(plane,drafts,fn()
                with-entry(plane,Nothing,fn()
                  with-context(plane,current.scope-parent,scope-frame,
                    fn() reify-trace(root,plane,owner-slot,track,publish))
                )
              )
            }
            val result = match attempt
              Error(failure) ->
                val _ = pretend-no-div{ error/try(fn() retire-scope(current)) }
                val _ = try-retire-drafts(load(drafts))
                Error(failure)
              Ok(built) ->
                val publish-built = built.built-publish
                val publication = pretend-no-div{ publish-built() }
                match publication
                  Error(failure) ->
                    val _ = pretend-no-div{ error/try(fn() retire-scope(current)) }
                    val _ = try-retire-drafts(load(drafts))
                    Error(failure)
                  Ok(_) ->
                    match load(state)
                      Scope-starting ->
                        store(body,built.built-root)
                        activate-trace(plane,built.built-root)
                        store(state,Scope-live)
                        Ok(())
                      _ ->
                        val _ = try-retire-drafts(load(drafts))
                        Ok(())
            store(completed,True)
            result
          )
        )
      _ -> Ok(())
  store(bootstrap-slot,Just(bootstrap-run))
  val bootstrap = Bootstrap-work(current,owner-slot)
  (current,bootstrap,fn()
    check-not-pure-plane("reactive scope disposal")
    pretend-no-div{ retire-scope(current) }
  )
