/*--------------------------------------------------------------------------
  Minimal persistent AVL index used by backend-neutral keyed rendering.

  Koka's standard map module is not yet a usable dependency for Kokaine.  This
  index deliberately exposes only lookup and unique insertion: reconciliation
  rebuilds one table per published collection snapshot, so deletion and
  mutation are unnecessary.  Every operation is driven by the caller's key
  comparison function and remains O(log n).
--------------------------------------------------------------------------*/
module kokaine/internal/key-index


pub type key-index<k,v>
  Key-index-empty
  Key-index-node(
    index-height : int,
    index-key    : k,
    index-value  : v,
    index-left   : key-index<k,v>,
    index-right  : key-index<k,v>
  )

pub type insert-result<k,v>
  Inserted(index : key-index<k,v>)
  Duplicate(existing : v)

pub fun empty() : key-index<k,v>
  Key-index-empty

fun height(index : key-index<k,v>) : int
  match index
    Key-index-empty -> 0
    Key-index-node(value,_,_,_,_) -> value

fun make-node(left : key-index<k,v>, key : k, value : v,
              right : key-index<k,v>) : key-index<k,v>
  Key-index-node(1 + left.height.max(right.height),key,value,left,right)

fun balance(left : key-index<k,v>, key : k, value : v,
            right : key-index<k,v>) : key-index<k,v>
  if left.height > right.height + 1 then
    match left
      Key-index-empty -> make-node(left,key,value,right)
      Key-index-node(_,left-key,left-value,left-left,left-right) ->
        if left-left.height >= left-right.height then
          make-node(
            left-left,left-key,left-value,
            make-node(left-right,key,value,right)
          )
        else match left-right
          Key-index-empty -> make-node(left,key,value,right)
          Key-index-node(_,middle-key,middle-value,middle-left,middle-right) ->
            make-node(
              make-node(left-left,left-key,left-value,middle-left),
              middle-key,middle-value,
              make-node(middle-right,key,value,right)
            )
  elif right.height > left.height + 1 then
    match right
      Key-index-empty -> make-node(left,key,value,right)
      Key-index-node(_,right-key,right-value,right-left,right-right) ->
        if right-right.height >= right-left.height then
          make-node(
            make-node(left,key,value,right-left),
            right-key,right-value,right-right
          )
        else match right-left
          Key-index-empty -> make-node(left,key,value,right)
          Key-index-node(_,middle-key,middle-value,middle-left,middle-right) ->
            make-node(
              make-node(left,key,value,middle-left),
              middle-key,middle-value,
              make-node(middle-right,right-key,right-value,right-right)
            )
  else make-node(left,key,value,right)

pub fun find(index : key-index<k,v>, key : k,
             cmp : (k,k) -> order) : maybe<v>
  match index
    Key-index-empty -> Nothing
    Key-index-node(_,current,current-value,left,right) ->
      match cmp(key,current)
        Lt -> find(left,key,cmp)
        Eq -> Just(current-value)
        Gt -> find(right,key,cmp)

pub fun insert(index : key-index<k,v>, key : k, value : v,
               cmp : (k,k) -> order) : insert-result<k,v>
  match index
    Key-index-empty -> Inserted(make-node(empty(),key,value,empty()))
    Key-index-node(_,current,current-value,left,right) ->
      match cmp(key,current)
        Eq -> Duplicate(current-value)
        Lt ->
          match insert(left,key,value,cmp)
            Duplicate(existing) -> Duplicate(existing)
            Inserted(next-left) ->
              Inserted(balance(next-left,current,current-value,right))
        Gt ->
          match insert(right,key,value,cmp)
            Duplicate(existing) -> Duplicate(existing)
            Inserted(next-right) ->
              Inserted(balance(left,current,current-value,next-right))

pub fun size(index : key-index<k,v>) : int
  match index
    Key-index-empty -> 0
    Key-index-node(_,_,_,left,right) -> 1 + left.size + right.size
