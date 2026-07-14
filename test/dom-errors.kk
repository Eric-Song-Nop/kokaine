module dom-errors

import kokaine/dom


extern publish-result(value : string) : ui ()
  js inline "(globalThis.__kokaineDomErrorResult = #1)"

pub fun main()
  val result = error/try fn() query("[")
  publish-result(if result.is-error then "translated" else "missed")
