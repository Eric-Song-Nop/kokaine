/*--------------------------------------------------------------------------
  Generic intrusive registrations with constant-time claim and unlink.

  A registration keeps a pointer to the cell which currently points at its
  node. This pointer-to-pointer back link lets head, middle, and tail nodes use
  the same O(1) unlink operation without rebuilding an immutable list.
--------------------------------------------------------------------------*/
module kokaine/internal/registry

import std/core/unsafe
import std/core/undiv


fun cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }


type registry-link<a>
  Registry-end
  Registry-link(
    link-value : ref<global,maybe<a>>,
    link-back  : ref<global,ref<global,registry-link<a>>>,
    link-next  : ref<global,registry-link<a>>
  )

abstract type registry<a>
  Registry(
    registry-is-sealed : ref<global,bool>,
    registry-head      : ref<global,registry-link<a>>,
    registry-count     : ref<global,int>
  )

abstract value type registry-registration<a>
  Registry-registration(
    registration-value : ref<global,maybe<a>>,
    registration-back  : ref<global,ref<global,registry-link<a>>>,
    registration-next  : ref<global,registry-link<a>>,
    registration-count : ref<global,int>
  )


fun registry-link/set-back(value : registry-link<a>,
                           pointer : ref<global,registry-link<a>>) : ()
  match value
    Registry-end -> ()
    Registry-link(_,back,_) -> store(back,pointer)

pub fun new-registry() : registry<a>
  Registry(cell(False),cell(Registry-end),cell(0))

pub fun registry/sealed(target : registry<a>) : bool
  match target
    Registry(sealed,_,_) -> load(sealed)

pub fun registry/count(target : registry<a>) : int
  match target
    Registry(_,_,count) -> load(count)

// Internal observability for lifetime ownership tests. Unlike `count` or
// `snapshot`, this detects an empty tombstone still retained by the registry.
pub noinline fun registry/has-linked-nodes(target : registry<a>) : bool
  match target
    Registry(_,head,_) ->
      match load(head)
        Registry-end -> False
        Registry-link(_,_,_) -> True

pub fun registry/try-insert(target : registry<a>, value : a)
                       : maybe<registry-registration<a>>
  match target
    Registry(sealed,head,count) ->
      if load(sealed) then Nothing
      else
        val slot = cell(Just(value))
        val next = cell(load(head))
        load(next).set-back(next)
        val back = cell(head)
        store(head,Registry-link(slot,back,next))
        store(count,load(count) + 1)
        Just(Registry-registration(slot,back,next,count))

pub fun registry/insert(target : registry<a>, value : a)
                       : exn registry-registration<a>
  match target.try-insert(value)
    Nothing -> throw("cannot register with a sealed lifetime registry")
    Just(registration) -> registration

pub fun registry-registration/take(
    registration : registry-registration<a>) : maybe<a>
  match registration
    Registry-registration(slot,back,next,count) ->
      val value = load(slot)
      store(slot,Nothing)
      match value
        Nothing -> Nothing
        Just(current) ->
          val predecessor = load(back)
          val successor = load(next)
          store(predecessor,successor)
          successor.set-back(predecessor)
          store(count,max(0,load(count) - 1))
          // Break both links after the live chain is valid. This prevents the
          // registration handle from retaining the rest of the registry.
          store(back,next)
          store(next,Registry-end)
          Just(current)

tail fun snapshot-loop(values : registry-link<a>,
                       collected : list<a>) : <div> list<a>
  match values
    Registry-end -> collected.reverse
    Registry-link(slot,_,next) ->
      match load(slot)
        Nothing -> snapshot-loop(load(next),collected)
        Just(value) -> snapshot-loop(load(next),Cons(value,collected))

pub fun registry/snapshot(target : registry<a>) : list<a>
  match target
    Registry(_,head,_) -> pretend-no-div{ snapshot-loop(load(head),[]) }

// Allocation-free traversal for internal callbacks which neither enter user
// code nor mutate this registry. Read the successor before invoking the
// callback so traversal never depends on the current node afterward. This
// deliberately has a narrower contract than `snapshot`.
tail fun visit-readonly-loop(values : registry-link<a>,
                             action : (a) -> ()) : <div> ()
  match values
    Registry-end -> ()
    Registry-link(slot,_,next) ->
      val rest = load(next)
      match load(slot)
        Nothing -> visit-readonly-loop(rest,action)
        Just(value) ->
          action(value)
          visit-readonly-loop(rest,action)

pub fun registry/visit-readonly(target : registry<a>,
                                action : (a) -> ()) : ()
  match target
    Registry(_,head,_) ->
      pretend-no-div{ visit-readonly-loop(load(head),action) }

tail fun detach-loop(values : registry-link<a>,
                     collected : list<a>) : <div> list<a>
  match values
    Registry-end -> collected.reverse
    Registry-link(slot,back,next) ->
      val rest = load(next)
      val value = load(slot)
      store(slot,Nothing)
      // Sever each stale handle's pointer-to-pointer cycle while walking the
      // snapshot already detached from the registry head.
      store(back,next)
      store(next,Registry-end)
      match value
        Nothing -> detach-loop(rest,collected)
        Just(current) -> detach-loop(rest,Cons(current,collected))

pub fun registry/seal-detach(target : registry<a>) : maybe<list<a>>
  match target
    Registry(sealed,head,count) ->
      if load(sealed) then Nothing else
        store(sealed,True)
        val values = load(head)
        store(head,Registry-end)
        store(count,0)
        Just(pretend-no-div{ detach-loop(values,[]) })
