module dom-namespaces

// Browser fixture for renderer safety:
//   - SVG and MathML get their namespaces (foreignObject returns to HTML);
//   - URL attributes reject `javascript:` unless explicitly trusted;
//   - a later third-party patch of attachShadow does not break mounting.

import kokaine/reactive
import kokaine/html
import kokaine/dom


extern publish(key : string, value : string) : ui ()
  js inline "((globalThis.__kokaineNamespaces = globalThis.__kokaineNamespaces || {})[#1] = #2)"

extern make-host(id : string) : ui ()
  js inline "(function(id){ var host=document.createElement('div'); host.id=id; document.body.appendChild(host); })(#1)"

// What a lazily loaded session-replay or polyfill script typically does.
extern patch-attach-shadow() : ui ()
  js inline "(function(){ var proto=Element.prototype; var previous=proto.attachShadow; proto.attachShadow=function(){ return previous.apply(this,arguments); }; })()"

fun graphic() : view<total>
  Fragment([
    Element("svg",[id("ns-svg"),attr("viewBox","0 0 10 10")],[
      Element("circle",[id("ns-circle"),attr("r","4")],[]),
      Element("foreignObject",[id("ns-foreign")],[
        Element("div",[id("ns-foreign-div")],[])
      ])
    ]),
    Element("math",[id("ns-math")],[
      Element("mi",[id("ns-mi")],[Element("span",[id("ns-mi-span")],[])])
    ]),
    Element("a",[id("ns-trusted"),
                 trusted/href(unsafe-trusted-url("javascript:void(0)"))],[])
  ])

fun attempt-mount(root : root<<ui>>, selector : string,
                  tree : view<total>) : ui string
  match error/try(fn() mount(root,query(selector),tree))
    Ok(_) -> "mounted"
    Error(problem) -> "rejected: " ++ problem.message

pub fun main()
  val (root,_) = create-root fn(_) ()
  make-host("ns-root")
  make-host("ns-unsafe-root")
  make-host("ns-patched-root")
  publish("graphic",attempt-mount(root,"#ns-root",graphic()))
  publish("unsafe",attempt-mount(root,"#ns-unsafe-root",
    Element("a",[href("javascript:alert(1)")],[])))
  patch-attach-shadow()
  publish("patched",attempt-mount(root,"#ns-patched-root",
    Element("p",[id("ns-after-patch")],[Text("after patch")])))
