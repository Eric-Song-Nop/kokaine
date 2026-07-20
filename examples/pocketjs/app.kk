module app

import kokaine/reactive
import kokaine/pocket
import std/core/unsafe


fun cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

pub fun main()
  host-entry fn()
    val (root,count) = create-root fn(root) signal(root,0)
    val committed = cell(False)
    finally(
      fn() { if load(committed) then () else root.dispose() },
      fn()
        val page = scene
          layout(props=[width(480),height(272),flex-column(),gap(8),
                        padding-top(24),padding-left(24),
                        background-color("#101827")])
            text("Kokaine + PocketJS",props=[text-color("#f8fafc")])
            live/text(props=[text-color("#bfdbfe")]) {
              "Count " ++ count.get.show
            }
            pressable-write(
              fn() count.modify(fn(value) value + 1),
              props=[width(144),height(40),justify-center(),align-center(),
                     background-color("#2563eb"),radius(6)])
              text("Increment",props=[text-color("#ffffff")])
        val dispose-page = mount(root,page)
        store(committed,True)
        fn() host-entry fn() root.dispose()
    )
