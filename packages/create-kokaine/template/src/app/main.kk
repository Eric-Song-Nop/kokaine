module app/main

import kokaine/reactive
import kokaine/html
import kokaine/dom

pub fun main()
  val (root,count) = create-root fn(root)
    signal(root,0)

  val page = view
    div(attrs=[class("counter")])
      h1("Kokaine")
      strong
        text { count.get.show }
      button("Increment",attrs=[
        kind("button"),
        on-click(fn(_) count.modify(fn(value) value + 1))
      ])

  val dispose = mount(root,query("#app"),page)
  ()
