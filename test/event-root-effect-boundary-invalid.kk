/*--------------------------------------------------------------------------
  This module is expected not to typecheck. A mounted tree can contain a
  retained listener, so DOM mounting cannot accept a root whose custom
  reactive effects require a lexical handler on a later browser turn.
--------------------------------------------------------------------------*/
module event-root-effect-boundary-invalid

import kokaine/dom
import kokaine/html
import kokaine/reactive

effect audit-effect
  fun audit-ping() : ()

fun invalid-mount(root : root<<audit-effect,ui>>,
                  target : node, tree : view<<audit-effect>>)
  mount(root,target,tree)

pub fun main() ()
