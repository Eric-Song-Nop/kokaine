module app

import kokaine/reactive
import kokaine/pocket
import kokaine/pocket/async
import std/core/unsafe


fun cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

pub fun main()
  host-entry fn()
    val (root,(count,async-phase)) = create-root fn(root)
      (signal(root,0),signal(root,"idle"))
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
            live/text(props=[text-color("#cbd5e1")]) {
              "Async " ++ async-phase.get
            }
            pressable-async(
              fn() {
                count.modify(fn(value) value + 1)
                async-phase.set("waiting")
                yield()
                async-phase.set("resumed")
              },
              props=[width(144),height(40),justify-center(),align-center(),
                     background-color("#2563eb"),radius(6)])
              text("Increment",props=[text-color("#ffffff")])
        val dispose-page = mount(root,page)
        store(committed,True)
        fn() host-entry fn() root.dispose()
    )
