module counter

import kokaine/reactive
import kokaine/html
import kokaine/dom


pub fun main()
  val (root,(count,square,level,parity,name)) = create-root fn(root)
    val count = signal(root,0)
    val square = memo(root,0,fn(_)
      val value = count.get
      value * value
    )
    val level = memo(root,0,fn(_)
      val value = count.get
      val magnitude = if value < 0 then 0 - value else value
      magnitude % 9
    )
    val parity = memo(root,"even",fn(_)
      if count.get % 2 == 0 then "even" else "odd"
    )
    val name = signal(root,"Koka")
    (count,square,level,parity,name)

  val reading-class = fn() Just("reading reading--" ++ parity.get)
  val reading-style = fn() Just("--level: " ++ level.get.show)

  val page = view fn()
    main-tag([class("instrument")],fn()
      header([class("masthead")],fn()
        div([class("wordmark")],fn()
          text("KOKAINE")
          span([class("wordmark__mark")],fn() text("/01"))
        )
        p([class("masthead__note")],fn()
          text("A reactive field instrument for algebraic effects")
        )
      )

      section([class("thesis")],fn()
        p([class("eyebrow")],fn() text("SIGNAL / COMPUTATION / EFFECT"))
        h1([],fn()
          text("A UI can be a ")
          span([class("thesis__handled")],fn() text("handled effect."))
        )
        p([class("thesis__copy")],fn()
          text("One source. Three derived readings. No virtual tree between intent and change.")
        )
      )

      section([class("console")],fn()
        div([attr-live("class",reading-class),
             attr-live("style",reading-style)],fn()
          div([class("reading__rail"),aria("hidden","true")],fn()
            span([class("tick tick--1")],fn() text(""))
            span([class("tick tick--2")],fn() text(""))
            span([class("tick tick--3")],fn() text(""))
            span([class("tick tick--4")],fn() text(""))
            span([class("tick tick--5")],fn() text(""))
            span([class("tick tick--6")],fn() text(""))
            span([class("tick tick--7")],fn() text(""))
            span([class("tick tick--8")],fn() text(""))
          )
          p([class("reading__label")],fn() text("CURRENT VALUE"))
          div([class("reading__number"),aria("live","polite")],fn()
            text-live(fn() count.get.show)
          )
          div([class("reading__derived")],fn()
            div([],fn()
              span([class("datum__label")],fn() text("SQUARE"))
              strong([],fn() text-live(fn() square.get.show))
            )
            div([],fn()
              span([class("datum__label")],fn() text("PARITY"))
              strong([],fn() text-live(fn() parity.get.to-upper))
            )
          )
        )

        div([class("controls")],fn()
          p([class("controls__label")],fn() text("CALIBRATE SOURCE"))
          div([class("controls__buttons")],fn()
            button([class("control control--step"),kind("button"),
                    aria("label","Decrease value"),
                    on-click(fn(_) count.modify(fn(value) value - 1))],fn()
              text("−")
            )
            button([class("control control--reset"),kind("button"),
                    on("click",fn(ev)
                      prevent-default(ev)
                      count.set(0)
                    )],fn()
              text("ZERO")
            )
            button([class("control control--step"),kind("button"),
                    aria("label","Increase value"),
                    on-click(fn(_) count.modify(fn(value) value + 1))],fn()
              text("+")
            )
          )

          div([class("identity")],fn()
            label([attr("for","operator")],fn() text("OPERATOR"))
            input([id("operator"),kind("text"),value-live(fn() name.get),
                   on-input(fn(value) name.set(value)),
                   aria("describedby","greeting")])
            p([id("greeting"),class("identity__greeting")],fn()
              text-live(fn() "Signal received, " ++ name.get ++ ".")
            )
          )

          div([class("status")],fn()
            span([class("status__lamp"),aria("hidden","true")],fn() text(""))
            region fn()
              view fn()
                val value = count.get
                if value < 0 then
                  p([],fn() text("Negative phase — propagation remains ordered."))
                elif value == 0 then
                  p([],fn() text("System at rest. Adjust the source to begin."))
                else
                  p([],fn() text("Positive phase — every dependent is coherent."))
          )
        )
      )

      footer([class("footnote")],fn()
        p([],fn() text("READS TRACK · WRITES BATCH · OWNERS CLEAN UP"))
        p([],fn() text("KOKA / JSWEB"))
      )
    )

  val dispose = mount(root,query("#app"),page)
  ()
