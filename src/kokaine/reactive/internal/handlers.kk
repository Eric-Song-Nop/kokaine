/*--------------------------------------------------------------------------
  Dynamic interpreters for signal reads, writes, and root dispatch.
--------------------------------------------------------------------------*/
module kokaine/reactive/internal/handlers

import kokaine/reactive/internal/model
import kokaine/reactive/effects
import kokaine/reactive/internal/scheduler
import std/core/undiv

// --------------------------------------------------------------------------
// Write and sample interpreters
// --------------------------------------------------------------------------

pub fun interpret-write(root : root<e>,
                    action : () -> <signal-write,pure|e> a)
                   : <div,exn|e> a
  with handler
    fun write-source(source,value)
      check-not-pure-plane("signal write")
      check-root(root,source.source-root)
      val previous = load(source.source-cell)
      val equal = source.source-equals
      if equal(previous,value) then () else
        store(source.source-cell,value)
        store(source.source-version,load(source.source-version) + 1)
        notify-source(source)
        flush(root)

    fun modify-source(source,update)
      check-not-pure-plane("signal modify")
      check-root(root,source.source-root)
      val previous = load(source.source-cell)
      val value = update(previous)
      val equal = source.source-equals
      if equal(previous,value) then () else
        store(source.source-cell,value)
        store(source.source-version,load(source.source-version) + 1)
        notify-source(source)
        flush(root)

    fun enter-batch(key)
      mask<div>
        check-not-pure-plane("reactive batch")
        check-root(root,key)
        store(root.root-batch-depth,load(root.root-batch-depth) + 1)

    fun leave-batch(key)
      check-not-pure-plane("reactive batch")
      check-root(root,key)
      val depth = load(root.root-batch-depth)
      if depth <= 0 then mask<div>{ throw("unbalanced reactive batch") } else
        store(root.root-batch-depth,depth - 1)
        flush(root)

    fun request-flush(key)
      check-not-pure-plane("reactive flush")
      check-root(root,key)
      flush(root)

  action()

pub fun sample-action(root : root<e>,
                  action : () -> <signal-read,signal-write,pure|e> a)
                 : <signal-write,div,exn|e> a
  with handler
    fun validate-derived(producer)
      producer.settle-producer
    raw ctl read-source(source,_,_)
      check-root(root,source.source-root)
      rcontext.resume(load(source.source-cell))
  action()

pub fun dispatch-handled(root : root<e>,
                         action : () -> <signal-read,signal-write,pure|e> a)
                        : <exn|e> a
  check-root(root,root.root-key)
  pretend-no-div{
    interpret-write(root,fn() sample-action(root,action))
  }
