/*--------------------------------------------------------------------------
  Reification and one-shot bootstrap of exact synchronous read suffixes.
--------------------------------------------------------------------------*/
module kokaine/reactive/internal/capture

import kokaine/reactive/internal/model
import kokaine/reactive/effects
import kokaine/reactive/internal/lifetime
import kokaine/reactive/internal/scheduler
import kokaine/internal/compat
import kokaine/internal/registry
import std/core/undiv

// --------------------------------------------------------------------------
// Reifying exact read suffixes
// --------------------------------------------------------------------------

abstract type read-cache
  Read-cache-empty
  Read-cache-value(source-version : ref<global,int>,
                   version : int, value : any)

extern read-cache-box(value : a) : any
  inline "#1"

extern read-cache-unbox(value : any) : a
  inline "#1"

// Keeping the cached action pure prevents a hit from spanning root disposal
// or another state-changing effect that must reach the outer read handler.
pub fun cache-repeated-reads(action : () -> <signal-read,pure> a)
                             : <signal-read,pure> a
  val cache = cell(Read-cache-empty)
  with override
    fun validate-derived(producer)
      validate-derived(producer)
    fun read-source(source,mode,producer)
      match mode
        Track-read ->
          val current-version = load(source.source-version)
          match load(cache)
            Read-cache-value(identity,version,value) ->
              if same-source-version(identity,source.source-version) &&
                 version == current-version
              then read-cache-unbox(value)
              else
                val current = read-source(source,mode,producer)
                store(cache,Read-cache-value(
                  source.source-version,load(source.source-version),
                  read-cache-box(current)))
                current
            Read-cache-empty ->
              val current = read-source(source,mode,producer)
              store(cache,Read-cache-value(
                source.source-version,load(source.source-version),
                read-cache-box(current)))
              current
        Sample-read -> read-source(source,mode,producer)
  action()

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
            fn() capture-error(fn()
              with-context(plane,checkpoint,terminal,
                fn() publish(value))
            )
          )
        }
        raw ctl read-source(source,mode,producer) -> {
          check-root(root,source.source-root)
          match mode
            Sample-read -> rcontext.resume(load(source.source-cell))
            Track-read ->
              val version = load(source.source-version)
              val state = cell(Capture-draft)
              val gate = Continuation-gate(
                state,load(plane.plane-current),producer)
              val child = cell(Trace-end)
              val current-frame = Frame(new-lifetime-owner(
                Scope-starting,plane.plane-retirement))
              val current-frame-slot = cell(current-frame)
              val registration : ref<global,maybe<registry-registration<packed-capture>>> = cell(Nothing)
              val unlink = fn()
                match load(registration)
                  Nothing -> ()
                  Just(current-registration) ->
                    store(registration,Nothing)
                    val _ = current-registration.take
                    ()
              val current = Trace-read(
                gate,
                owner-slot,
                child,
                current-frame-slot,
                fn(_) rcontext.resume(load(source.source-cell)),
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
              val registered = source.source-captures.insert(
                pack-capture(plane,current))
              store(registration,Just(registered))
              val nested = with-current(plane,current,current-frame,
                fn() rcontext.resume(load(source.source-cell)))
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
  val lifetime = new-lifetime-owner(
    Scope-starting,plane.plane-retirement)
  val state = lifetime.lifetime-token
  val body = cell(Trace-end)
  val bootstrap-slot : ref<global,maybe<() -> <div|e> error<()>>> = cell(Nothing)
  val current = Scope(lifetime,body,parent,bootstrap-slot,cell(Nothing))
  val bootstrap-run = fn()
    match load(state)
      Scope-starting ->
        val scope-frame = Frame(lifetime)
        val drafts = cell([])
        val completed = cell(False)
        finally(
          fn() lift-div(fn(){
            if load(completed) then () else
              // A final control operation cannot return through `capture-error`.
              // Claim both the unpublished scope and every raw capture before
              // the first draft-owned cleanup is allowed to re-enter user code.
              val _ = try-retire-scope-drafts(current,load(drafts))
              ()
          }),
          fn() lift-div(fn()
            val attempt = pretend-no-div{
              attempt-build(plane,drafts,fn()
                with-context(plane,current.scope-parent,scope-frame,
                  fn() reify-trace(root,plane,owner-slot,track,publish))
              )
            }
            val result = match attempt
              Error(failure) ->
                val _ = try-retire-scope-drafts(current,load(drafts))
                Error(failure)
              Ok(built) ->
                val publish-built = built.built-publish
                val publication = pretend-no-div{ publish-built() }
                match publication
                  Error(failure) ->
                    val _ = try-retire-scope-drafts(current,load(drafts))
                    Error(failure)
                  Ok(_) ->
                    match load(state)
                      Scope-starting ->
                        store(body,built.built-root)
                        activate-trace(plane,built.built-root)
                        store(state,Scope-live)
                        Ok(())
                      _ ->
                        val _ = try-retire-scope-drafts(current,load(drafts))
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
