module html

import kokaine/reactive
import kokaine/html
import kokaine/ssr


fun assert-string(actual : string, expected : string, label : string)
  if actual == expected then ()
  else throw(label ++ "\nexpected: " ++ expected ++ "\nactual:   " ++ actual)

fun assert(ok : bool, label : string)
  if ok then () else throw("assertion failed: " ++ label)

pub fun main()
  val (root,(count,person)) = create-root fn(root)
    (signal(root,1),signal(root,"<Ada & Bob>"))

  val page = view
    main-tag(attrs=[class("app"),attr("data-note","\"<&")])
      h1
        text("Count: ")
        text { count.get.show }
      p(attrs=[title("greeting"),attr("data-person") { person.get }])
        text { person.get }
      div(attrs=[id("counter"),
                 attr("data-count") { Just(count.get.show) }])
        button("+",attrs=[kind("button"),
                          on-click(fn(_) count.modify(fn(n) n + 1))])
        input(attrs=[kind("checkbox"),
                     checked { count.get == 2 },
                     disabled { count.get == 1 }])
      dynamic
        if count.get == 1 then
          span("odd",attrs=[class("odd")])
        else
          span("even",attrs=[class("even")])
      trusted(unsafe-trusted-html("<em>trusted</em>"))

  val initial = render(root,page)
  initial.assert-string(
    "<main class=\"app\" data-note=\"&quot;&lt;&amp;\">" ++
    "<h1>Count: 1</h1>" ++
    "<p title=\"greeting\" data-person=\"&lt;Ada &amp; Bob&gt;\">" ++
    "&lt;Ada &amp; Bob&gt;</p>" ++
    "<div id=\"counter\" data-count=\"1\">" ++
    "<button type=\"button\">+</button>" ++
    "<input type=\"checkbox\" disabled=\"\">" ++
    "</div><span class=\"odd\">odd</span><em>trusted</em></main>",
    "initial safe rendering"
  )

  update(root)
    batch(root)
      count.set(2)
      person.set("Lin \"Q\"")

  val updated = render(root,page)
  updated.assert-string(
    "<main class=\"app\" data-note=\"&quot;&lt;&amp;\">" ++
    "<h1>Count: 2</h1>" ++
    "<p title=\"greeting\" data-person=\"Lin &quot;Q&quot;\">Lin \"Q\"</p>" ++
    "<div id=\"counter\" data-count=\"2\">" ++
    "<button type=\"button\">+</button><input type=\"checkbox\" checked>" ++
    "</div><span class=\"even\">even</span><em>trusted</em></main>",
    "live rendering after a transaction"
  )

  val inline-listener = view
    div(attrs=[attr("ONclick","alert(1)")])
      text("bad")
  val listener-error : error<string> = mask<exn>{
    error/try fn() render(root,inline-listener)
  }
  assert(listener-error.is-error,"inline event attributes are rejected")

  val html-property = view
    input(attrs=[prop("innerHTML",String-property("<b>bad</b>"))])
  val property-error : error<string> = mask<exn>{
    error/try fn() render(root,html-property)
  }
  assert(property-error.is-error,"markup-writing properties are rejected")

  val srcdoc-attribute = view
    element-empty("iframe",attrs=[attr("srcdoc","<script>bad</script>")])
  val srcdoc-error : error<string> = mask<exn>{
    error/try fn() render(root,srcdoc-attribute)
  }
  assert(srcdoc-error.is-error,"srcdoc requires an explicit trusted integration")
  assert(!is-valid-element-name("1div"),"element names start with a letter")

  root.dispose()
  println("html: builder, reactivity, escaping, and validation passed")
