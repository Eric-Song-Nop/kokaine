/*--------------------------------------------------------------------------
  Nominal effects used by the public reactive API and internal interpreters.
--------------------------------------------------------------------------*/
module kokaine/reactive/effects

import kokaine/reactive/internal/model

pub effect signal-read
  fun validate-derived(producer : derive-producer) : ()
  ctl read-source(
    source   : source<a>,
    mode     : read-mode,
    producer : maybe<derive-producer>
  ) : a

pub effect signal-write
  fun write-source(source : source<a>, value : a) : ()
  fun modify-source(source : source<a>, update : a -> a) : ()
  fun enter-batch(key : root-key) : ()
  fun leave-batch(key : root-key) : ()
  fun request-flush(key : root-key) : ()

pub alias reactive = <signal-read,signal-write>
