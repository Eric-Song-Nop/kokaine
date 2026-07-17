/*--------------------------------------------------------------------------
  Reclaimable integer-keyed index.

  Buckets contain intrusive links. A registration holds the pointer-to-pointer
  backlink for its node, so deletion is O(1) and stale handles sever their
  connection to the table. Rehashing updates those backlinks in place.
--------------------------------------------------------------------------*/
module kokaine/internal/int-index

import std/core/unsafe
import std/core/undiv
import std/core/vector


val minimum-capacity : int = 16

fun cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }


type int-index-link<a>
  Int-index-end
  Int-index-link(
    link-key   : int,
    link-value : ref<global,maybe<a>>,
    link-back  : ref<global,ref<global,int-index-link<a>>>,
    link-next  : ref<global,int-index-link<a>>
  )

abstract type int-index<a>
  Int-index(
    index-buckets : ref<global,vector<ref<global,int-index-link<a>>>>,
    index-count   : ref<global,int>
  )

abstract type int-index-registration<a>
  Int-index-registration(
    registration-value : ref<global,maybe<a>>,
    registration-back  : ref<global,ref<global,int-index-link<a>>>,
    registration-next  : ref<global,int-index-link<a>>,
    registration-owner : ref<global,maybe<int-index<a>>>
  )


fun new-buckets(capacity : int)
    : vector<ref<global,int-index-link<a>>>
  vector-init-total(max(minimum-capacity,capacity),
                    fn(_) cell(Int-index-end))

pub fun new-int-index() : int-index<a>
  Int-index(cell(new-buckets(minimum-capacity)),cell(0))

pub fun int-index/count(target : int-index<a>) : int
  match target
    Int-index(_,count) -> load(count)

pub fun int-index/capacity(target : int-index<a>) : int
  match target
    Int-index(buckets,_) -> load(buckets).length

fun normalized-key(key : int) : int
  if key >= 0 then key else 0 - (key + 1)

fun bucket-offset(key : int, capacity : int) : int
  pretend-no-div { normalized-key(key) % capacity }

fun bucket-at(
    buckets : vector<ref<global,int-index-link<a>>>, key : int)
    : ref<global,int-index-link<a>>
  match buckets.at(bucket-offset(key,buckets.length))
    Just(bucket) -> bucket
    Nothing -> cell(Int-index-end) // unreachable: every table has >=16 buckets

fun int-index-link/set-back(value : int-index-link<a>,
                            pointer : ref<global,int-index-link<a>>) : ()
  match value
    Int-index-end -> ()
    Int-index-link(_,_,back,_) -> store(back,pointer)

tail fun lookup-link(value : int-index-link<a>, key : int)
    : <div> maybe<a>
  match value
    Int-index-end -> Nothing
    Int-index-link(current,slot,_,next) ->
      if current == key then load(slot)
      else lookup-link(load(next),key)

pub fun int-index/lookup(target : int-index<a>, key : int) : maybe<a>
  match target
    Int-index(bucket-store,_) ->
      val buckets = load(bucket-store)
      pretend-no-div { lookup-link(load(bucket-at(buckets,key)),key) }

fun move-links(
    value : int-index-link<a>,
    buckets : vector<ref<global,int-index-link<a>>>) : ()
  pretend-no-div{
    var pending := value
    var moving := True
    while { moving }
      match pending
        Int-index-end -> moving := False
        current as Int-index-link(key,_,back,next) ->
          val rest = load(next)
          val bucket = bucket-at(buckets,key)
          val successor = load(bucket)
          store(next,successor)
          successor.set-back(next)
          store(back,bucket)
          store(bucket,current)
          pending := rest
  }

fun int-index/resize(target : int-index<a>, requested : int) : ()
  match target
    Int-index(bucket-store,_) ->
      val old-buckets = load(bucket-store)
      val next-buckets = new-buckets(requested)
      val _ = pretend-no-div{
        var offset := 0
        while { offset < old-buckets.length }
          match old-buckets.at(offset)
            Nothing -> ()
            Just(bucket) ->
              val values = load(bucket)
              store(bucket,Int-index-end)
              move-links(values,next-buckets)
          offset := offset + 1
      }
      store(bucket-store,next-buckets)

fun int-index/ensure-insert-capacity(target : int-index<a>) : ()
  val capacity = target.capacity
  if (target.count + 1) * 4 > capacity * 3
  then target.resize(capacity * 2)
  else ()

fun int-index/reclaim-delete-capacity(target : int-index<a>) : ()
  val capacity = target.capacity
  if capacity > minimum-capacity && target.count * 4 <= capacity
  then target.resize(max(minimum-capacity,
                         pretend-no-div { capacity / 2 }))
  else ()

pub fun int-index/insert(target : int-index<a>, key : int, value : a)
    : exn int-index-registration<a>
  match target.lookup(key)
    Just(_) -> throw("cannot register a duplicate integer index key")
    Nothing ->
      target.ensure-insert-capacity
      match target
        Int-index(bucket-store,count) ->
          val buckets = load(bucket-store)
          val bucket = bucket-at(buckets,key)
          val slot = cell(Just(value))
          val next = cell(load(bucket))
          load(next).set-back(next)
          val back = cell(bucket)
          store(bucket,Int-index-link(key,slot,back,next))
          store(count,load(count) + 1)
          Int-index-registration(slot,back,next,cell(Just(target)))

pub fun int-index-registration/take(
    registration : int-index-registration<a>) : maybe<a>
  match registration
    Int-index-registration(slot,back,next,owner-slot) ->
      val value = load(slot)
      store(slot,Nothing)
      val owner = load(owner-slot)
      store(owner-slot,Nothing)
      match (value,owner)
        (Just(current),Just(target)) ->
          val predecessor = load(back)
          val successor = load(next)
          store(predecessor,successor)
          successor.set-back(predecessor)
          match target
            Int-index(_,count) -> store(count,max(0,load(count) - 1))
          // A stale registration must retain neither the table nor neighbors.
          store(back,next)
          store(next,Int-index-end)
          target.reclaim-delete-capacity
          Just(current)
        _ -> Nothing
