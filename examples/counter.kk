/*--------------------------------------------------------------------------
  Browser entry point. The example itself is split into focused modules under
  examples/counter/; this file only creates, composes, and mounts the app.
--------------------------------------------------------------------------*/
module counter

import kokaine/reactive
import kokaine/dom
import examples/counter/model
import examples/counter/app


pub fun main()
  val (root,model) = create-root fn(root)
    lab-create(root)

  val page = lab-page(root,model)
  val dispose = mount(root,query("#app"),page)
  ()
