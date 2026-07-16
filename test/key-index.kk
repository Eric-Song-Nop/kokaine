module key-index

import kokaine/internal/key-index
import std/core/unsafe


fun cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a)
  unsafe-total { target := value }

fun assert(ok : bool, label : string)
  if ok then () else throw("assertion failed: " ++ label)

pub fun main()
  val comparisons = cell(0)
  val compare = fn(left : int, right : int)
    store(comparisons,load(comparisons) + 1)
    left.cmp(right)

  var index := kokaine/internal/key-index/empty()
  for(4096) fn(value)
    match index.insert(value,value * 3,compare)
      Duplicate(_) -> throw("unexpected duplicate during unique insertion")
      Inserted(next) -> index := next

  assert(index.size == 4096,"AVL index retains every unique key")
  for(4096) fn(value)
    assert(index.find(value,compare) == Just(value * 3),
           "AVL lookup returns the matching value")

  match index.insert(2048,-1,compare)
    Inserted(_) -> throw("duplicate insertion unexpectedly succeeded")
    Duplicate(existing) ->
      assert(existing == 6144,"duplicate insertion returns the existing row")

  // Sequential insertion is the adversarial shape for an unbalanced tree.
  // This generous logarithmic bound still rejects O(n²) lookup/insertion.
  assert(load(comparisons) < 150000,
         "key lookup and insertion remain logarithmic")
  println("key-index: balanced unique insertion and lookup passed")
