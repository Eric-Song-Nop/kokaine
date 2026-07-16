/*--------------------------------------------------------------------------
  This module is expected not to typecheck. A retained DOM callback cannot
  capture an arbitrary lexical effect handler which returns before JavaScript
  later delivers the event.
--------------------------------------------------------------------------*/
module event-effect-boundary-invalid

import kokaine/html

effect audit-effect
  fun audit-ping() : ()

fun invalid-listener() : attribute<total>
  on("click",fn(_) audit-ping())
