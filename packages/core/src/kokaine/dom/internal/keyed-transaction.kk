/*--------------------------------------------------------------------------
  Renderer-owned publication journal for nested keyed reconciliation.

  Reactive bootstrap isolation is a separate capability. This module owns
  only DOM preparation, authoritative publication, and rollback callbacks.
--------------------------------------------------------------------------*/
module kokaine/dom/internal/keyed-transaction

import kokaine/reactive/integration
import std/core/unsafe
import std/core/undiv


fun cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }


type keyed-publication
  Keyed-publication(
    publication-prepare  : () -> <ui,exn> (),
    publication-publish  : () -> (),
    publication-rollback : () -> <ui,exn> ()
  )

type keyed-transaction-state
  Keyed-open
  Keyed-prepared
  Keyed-committed
  Keyed-aborted

abstract type keyed-transaction
  Keyed-transaction(
    transaction-state : ref<global,keyed-transaction-state>,
    transaction-publications : ref<global,list<keyed-publication>>
  )

type keyed-entry
  Keyed-entry(
    entry-provision   : provision<<ui>>,
    entry-transaction : keyed-transaction
  )

abstract type keyed-context
  Keyed-context(
    context-active : ref<global,list<keyed-entry>>
  )

pub fun new-keyed-context() : keyed-context
  Keyed-context(cell([]))

pub fun new-keyed-transaction() : keyed-transaction
  Keyed-transaction(cell(Keyed-open),cell([]))

tail fun find-keyed-transaction(values : list<keyed-entry>,
                                expected : provision<<ui>>)
                               : exn keyed-transaction
  match values
    Nil -> throw(
      "active provision does not belong to this renderer transaction")
    Cons(current,rest) ->
      if current.entry-provision.same(expected)
      then current.entry-transaction
      else find-keyed-transaction(rest,expected)

pub fun current-keyed-transaction(renderer : keyed-context,
                                  expected : provision<<ui>>)
                                  : exn keyed-transaction
  match renderer
    Keyed-context(active) -> find-keyed-transaction(load(active),expected)

pub fun with-keyed-transaction(
    renderer : keyed-context, current : provision<<ui>>,
    transaction : keyed-transaction,
    action : () -> <div,exn|e> a) : <div,exn|e> a
  match renderer
    Keyed-context(active) ->
      val previous = load(active)
      finally(
        fn() store(active,previous),
        fn()
          store(active,Cons(Keyed-entry(current,transaction),previous))
          action()
      )

pub fun stage-keyed-publication(
    transaction : keyed-transaction,
    prepare : () -> <ui,exn> (), publish : () -> (),
    rollback : () -> <ui,exn> ()) : exn ()
  match transaction
    Keyed-transaction(state,publications) -> match load(state)
      Keyed-open -> store(publications,Cons(
        Keyed-publication(prepare,publish,rollback),load(publications)))
      _ -> throw("cannot enlist publication in a closed keyed transaction")

tail fun prepare-publications(values : list<keyed-publication>)
                              : <ui,exn> ()
  match values
    Nil -> ()
    Cons(current,rest) ->
      val prepare = current.publication-prepare
      val _ = prepare()
      prepare-publications(rest)

tail fun publish-publications(values : list<keyed-publication>) : ()
  match values
    Nil -> ()
    Cons(current,rest) ->
      val publish = current.publication-publish
      val _ = publish()
      publish-publications(rest)

fun rollback-publications(values : list<keyed-publication>) : <ui,exn> ()
  match values
    Nil -> ()
    Cons(current,rest) ->
      val rollback = current.publication-rollback
      finally(
        fn() rollback-publications(rest),
        fn() rollback()
      )

pub fun prepare-keyed-transaction(transaction : keyed-transaction)
                                  : <ui,exn> ()
  match transaction
    Keyed-transaction(state,publications) -> match load(state)
      Keyed-open ->
        val values = pretend-no-div{ load(publications).reverse }
        prepare-publications(values)
        store(state,Keyed-prepared)
      _ -> throw("keyed transaction can only prepare while open")

pub fun publish-keyed-transaction(transaction : keyed-transaction) : exn ()
  match transaction
    Keyed-transaction(state,publications) -> match load(state)
      Keyed-prepared ->
        val values = pretend-no-div{ load(publications).reverse }
        store(publications,[])
        store(state,Keyed-committed)
        publish-publications(values)
      _ -> throw("keyed transaction must prepare before publication")

pub fun abort-keyed-transaction(transaction : keyed-transaction)
                                : <ui,exn> ()
  match transaction
    Keyed-transaction(state,publications) -> match load(state)
      Keyed-committed -> ()
      Keyed-aborted -> ()
      _ ->
        // Claim the reverse-registration journal before arbitrary rollback
        // code can re-enter the renderer.
        val values = load(publications)
        store(publications,[])
        store(state,Keyed-aborted)
        rollback-publications(values)
