/*--------------------------------------------------------------------------
  Copyright (c) 2026 Kokaine contributors. SPDX-License-Identifier: MIT

  Browser structured-asynchrony effects and cancellation-scope identities.

  This is Kokaine-owned code for the Web UI backend. It deliberately contains
  no host scheduler object or outer handler. A browser adapter interprets these
  effects where it can safely retain and later resume a continuation.
--------------------------------------------------------------------------*/
module kokaine/async/effects

import std/core/unsafe


// --------------------------------------------------------------------------
// Primitive await protocol
// --------------------------------------------------------------------------

// Terminal cancellation is a distinct result. Public await wrappers interpret
// it through the final `discontinue` effect instead of manufacturing an
// ordinary exception.
pub type await-result<a>
  Result(value : a)
  Exception(error : exception)
  Cancel

// Browser cleanup for an outstanding operation, for example `clearTimeout`
// or `AbortController.abort`.
pub alias dispose-fn = () -> ui ()

// Internal ownership handlers need to distinguish a successful transfer from
// a release which lost to an already-detached retirement snapshot. Public
// callers continue to receive an ordinary one-shot `dispose-fn` below.
pub alias ownership-release-fn = () -> ui bool

// Setup installs a callback and returns either a disposer or a setup failure.
// The completion flag is reserved for protocol compatibility. Primitive
// Kokaine awaits are one-shot, accept only the first callback, and pass `True`.
pub alias await-setup<a> = ((await-result<a>,bool) -> ui ()) -> ui error<dispose-fn>

pub effect async-await
  // Suspend the current strand until the host handler supplies a result.
  ctl do-await(setup : await-setup<a>, scope : async-scope,
               label : string) : await-result<a>

  // Install an operation without suspending this strand. Structured
  // concurrency uses this to route completions into its own scheduler.
  fun no-await(setup : await-setup<a>, scope : async-scope,
               label : string,
               callback : await-result<a> -> ui ()) : ()


// --------------------------------------------------------------------------
// Cancellation and handler-scope I/O
// --------------------------------------------------------------------------

pub effect async-cancel
  val async-scope : async-scope
  fun cancel-scope(scope : async-scope) : ()
  // Release the runtime's exact cancellation marker only after the lexical
  // scope has fully unwound. Cancellation finalizers may still await, so a
  // marker cannot be discarded merely because its current host tasks stopped.
  fun release-canceled-scope(scope : async-scope) : ()
  fun is-scope-canceled(scope : async-scope) : bool

// Browser-host operations which must run through the active generation
// interpreter. The migration-shaped name keeps this internal capability
// distinct from the application's direct-style async operations.
pub effect async-ioc
  fun async-ioc(action : () -> ui a) : a
  fun async-schedule-ioc(scope : async-scope, action : () -> ui ()) : ()

// Ownership is separate from host I/O so structured combinators and Resource
// loaders can install a nearer lease ledger without proxying polymorphic host
// operations through a retained continuation.
pub effect async-ownership
  // Keep a host disposer in the nearest ownership ledger after an await has
  // completed. The base ledger follows the reactive generation; structured
  // combinators and Resource loaders can refine that lifetime. The returned
  // release action transfers ownership without running the disposer.
  fun async-own-disposer(dispose : dispose-fn) : ownership-release-fn


// --------------------------------------------------------------------------
// Cancellation scopes
// --------------------------------------------------------------------------

alias scope-id = int

// IDs are kept abstract so callers can compare and derive scopes but cannot
// forge an unrelated scope. The head is the current scope and the tail its
// ancestors through the root.
abstract value type async-scope
  Scope(
    ids             : list<scope-id>,
    scope-namespace : int
  )

// Kokaine's browser runtime is single-threaded. Keep scope identity allocation
// behind total helpers just like the rest of its opaque generation metadata.
val next-scope-id : ref<global,int> = unsafe-total { ref(1) }

// The public root is used by standalone interpreters. Generation runtimes
// allocate separate cancellation namespaces from the same identity source.
pub val root-scope : async-scope = Scope([0],0)

fun fresh-scope-id() : int
  unsafe-total
    val current = !next-scope-id
    next-scope-id := current + 1
    current

// Runtime support: every interpreter gets an isolated cancellation namespace.
pub fun new-runtime-scope-root() : async-scope
  val namespace = fresh-scope-id()
  Scope([0],namespace)

pub fun async-scope/show(Scope(ids,_) : async-scope) : string
  ids.map(show).join("<")

pub fun new-child-scope(Scope(ids,namespace) : async-scope) : async-scope
  Scope(Cons(fresh-scope-id(),ids),namespace)

fun current-scope-id(Scope(ids,_) : async-scope) : scope-id
  ids.head(0)

// Runtime-root namespaces consume the same global ID source as children, so
// the root namespace and every non-root head ID are mutually unique hash keys.
pub fun async-scope/identity-key(scope : async-scope) : int
  match scope
    Scope(ids,namespace) ->
      val current = ids.head(0)
      if current == 0 then namespace else current

// Namespace membership is part of equality and ancestry even though hash keys
// are globally unique. Cancellation capabilities cannot cross runtimes.
pub fun async-scope/same-namespace(left : async-scope,
                                   right : async-scope) : bool
  match (left,right)
    (Scope(_,left-namespace),Scope(_,right-namespace)) ->
      left-namespace == right-namespace

pub fun async-scope/parent(
    Scope(ids,namespace) : async-scope) : async-scope
  match ids
    Cons(_,parents as Cons) -> Scope(parents,namespace)
    _ -> Scope(ids,namespace)

// Is `child` the same scope as, or a descendant of, `ancestor`?
pub fun async-scope/is-within(child : async-scope,
                              ancestor : async-scope) : bool
  if !child.same-namespace(ancestor) then False else
    match child
      Scope(ids,_) ->
        val target = ancestor.current-scope-id
        ids.any(fn(id) id == target)

pub fun async-scope/(<=)(child : async-scope,
                         ancestor : async-scope) : bool
  child.is-within(ancestor)

pub fun async-scope/(==)(left : async-scope,
                         right : async-scope) : bool
  left.same-namespace(right) &&
  left.current-scope-id == right.current-scope-id


// --------------------------------------------------------------------------
// Async capability and final cancellation
// --------------------------------------------------------------------------

pub effect discontinue
  // Cancellation cannot be caught as an ordinary exception. A final control
  // operation still unwinds Koka `finally` clauses in the canceled strand.
  final ctl discontinue() : a

pub alias async = <async-await,async-cancel,async-ioc,async-ownership,
                   discontinue>

// Perform browser-host work through the active generation interpreter.
pub fun async-host(action : () -> ui a) : async a
  async-ioc(action)

// Schedule browser work through the active generation interpreter.
pub fun async-schedule(action : () -> ui ()) : async ()
  async-schedule-ioc(async-scope,action)

// Acquire a lease for a host resource. By default it follows the reactive
// generation rather than a structured cancellation scope; a nearer structured
// or Resource ledger may further constrain or promote that lifetime.
pub fun async-own(dispose : dispose-fn) : async dispose-fn
  val release = async-own-disposer(dispose)
  fn()
    val _ = release()
    ()


// --------------------------------------------------------------------------
// Result conversion
// --------------------------------------------------------------------------

pub fun await-result/show(result : await-result<a>,
                          ?show : a -> string) : string
  match result
    Result(value) -> "Result(" ++ value.show ++ ")"
    Exception(error) -> "Exception(" ++ exn/show(error) ++ ")"
    Cancel -> "Cancel"

pub fun error/await-result(result : error<a>) : await-result<a>
  match result
    Ok(value) -> Result(value)
    Error(error) -> Exception(error)

// This is the single conversion point for cancellation. It performs final
// control rather than returning an error value or throwing an exception.
pub fun await-result/error(result : await-result<a>,
                           label : string = "")
                          : discontinue error<a>
  match result
    Result(value) -> Ok(value)
    Exception(error) -> Error(error)
    Cancel -> discontinue()


// --------------------------------------------------------------------------
// Await wrappers
// --------------------------------------------------------------------------

// Primitive wrapper for setup functions which return plain values and a
// disposer but cannot fail during setup or completion.
pub fun setup/await-noexn(
    label : string = "",
    setup : ((a) -> ui ()) -> ui dispose-fn)
    : async a
  val result = setup/await-error(label,fn(complete)
    Ok(setup(complete))
  )
  match result
    Ok(value) -> value
    Error(error) ->
      impossible("unexpected exception from non-throwing async await: " ++
                 exn/show(error))

pub fun await1-noexn(
    label : string = "",
    setup : ((a) -> ui ()) -> ui ()) : async a
  setup/await-noexn(label,fn(complete)
    setup(complete)
    fn() ()
  )

pub fun await0-noexn(
    label : string = "",
    setup : (() -> ui ()) -> ui ()) : async ()
  await1-noexn(label,fn(complete) setup(fn() complete(())))

// Await a callback whose setup may fail and which returns a real disposer.
pub fun await1(
    label : string = "",
    setup : ((a) -> ui ()) -> ui error<dispose-fn>)
    : <async,exn> a
  setup/await(label,fn(complete)
    setup(fn(value) complete(Ok(value)))
  )

pub fun await0(
    label : string = "",
    setup : (() -> ui ()) -> ui error<dispose-fn>)
    : <async,exn> ()
  await1(label,fn(resume) setup(fn() resume(())))

// Await a setup whose completion callback carries an `error<a>`.
pub fun setup/await(
    label : string = "",
    setup : (error<a> -> ui ()) -> ui error<dispose-fn>)
    : <async,exn> a
  setup/await-error1(label,setup).untry

// Await a plain completion and preserve asynchronous exceptions as an
// explicit `error<a>`. Cancellation still discontinues the strand.
pub fun setup/await-error(
    label : string = "",
    setup : ((a) -> ui ()) -> ui error<dispose-fn>)
    : async error<a>
  val wrapped = fn(complete)
    setup(fn(value) complete(Result(value),True))
  val result = do-await(wrapped,async-scope,label)
  result.error(label)

// Variant whose completion callback already carries `error<a>`.
pub fun setup/await-error1(
    label : string = "",
    setup : (error<a> -> ui ()) -> ui error<dispose-fn>)
    : async error<a>
  val wrapped = fn(complete)
    setup(fn(value) complete(value.await-result,True))
  val result = do-await(wrapped,async-scope,label)
  result.error(label)


// --------------------------------------------------------------------------
// Cancellation-scope composition
// --------------------------------------------------------------------------

pub fun cancel-outstanding() : async-cancel ()
  cancel-scope(async-scope)

pub fun is-canceled() : async-cancel bool
  is-scope-canceled(async-scope)

pub fun cancelation-scope(action : () -> <async|e> a) : <async|e> a
  val child = new-child-scope(async-scope)
  var canceled := False
  with override
    val async-scope = child
    fun is-scope-canceled(scope)
      (scope <= child && canceled) || is-scope-canceled(scope)
    fun cancel-scope(scope)
      if scope == child then canceled := True
      cancel-scope(scope)
    fun release-canceled-scope(scope)
      if scope == child then canceled := False
      release-canceled-scope(scope)
  finally(fn() release-canceled-scope(child),action)

// Splice an action into the surrounding scope. Structured combinators use
// this for bookkeeping which must outlive a nested child cancellation.
pub fun in-parent-scope(action : () -> <async|e> a) : <async|e> a
  with override
    val async-scope = async-scope.parent
    fun is-scope-canceled(scope) is-scope-canceled(scope)
    fun cancel-scope(scope) cancel-scope(scope)
    fun release-canceled-scope(scope) release-canceled-scope(scope)
  action()

// Internal escape hatch for structured combinators which must observe a
// canceled strand while still draining sibling finalizers. Application code
// should not suppress cancellation.
pub fun unsafe-uncancel(action : () -> <async|e> a)
                       : <async|e> maybe<a>
  with override
    return(value) Just(value)
    final ctl discontinue() Nothing
  action()
