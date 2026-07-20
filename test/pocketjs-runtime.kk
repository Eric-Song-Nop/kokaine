module pocketjs-runtime

import kokaine/reactive
import kokaine/pocket


extern install-test-host() : ui ()
  js inline "(function(){ var all=[]; var root={ kind:'root', children:[], parent:null, style:{} }; var visit=function(node,action){ action(node); for(var i=0;i<node.children.length;i++) visit(node.children[i],action); }; var create=function(kind,text){ var node={ kind:kind, text:text||'', children:[], parent:null, style:{}, focusable:false, source:'', press:undefined, discarded:false }; all.push(node); return node; }; var state={ root:root, all:all, visit:visit, failAfter:-1, discarded:0 }; globalThis.__kokainePocketTest=state; globalThis[Symbol.for('kokaine.pocketjs.bridge')]={ version:1, getRoot:function(){ return root; }, createView:function(){ return create('view',''); }, createText:function(value){ return create('text',String(value)); }, createImage:function(){ return create('image',''); }, replaceText:function(node,value){ node.text=String(value); }, insertBefore:function(parent,node,anchor){ if(state.failAfter===0){ state.failAfter=-1; throw new Error('injected insert failure'); } if(state.failAfter>0) state.failAfter--; if(node.parent){ var old=node.parent.children.indexOf(node); if(old>=0) node.parent.children.splice(old,1); } var index=anchor==null ? parent.children.length : parent.children.indexOf(anchor); if(index<0) throw new Error('bad anchor'); parent.children.splice(index,0,node); node.parent=parent; }, remove:function(parent,node){ var index=parent.children.indexOf(node); if(index<0) throw new Error('not a child'); parent.children.splice(index,1); node.parent=null; }, discard:function(node){ if(node.parent) throw new Error('discarded attached node'); node.discarded=true; state.discarded++; }, setStyleNumber:function(node,name,value){ node.style[name]=Number(value); }, setStyleString:function(node,name,value){ node.style[name]=String(value); }, setFocusable:function(node,value){ node.focusable=!!value; }, setSource:function(node,value){ node.source=String(value); }, setPress:function(node,handler){ node.press=handler; }, clearPress:function(node){ node.press=undefined; } }; })()"

extern host-root-child-count() : ui int
  js inline "globalThis.__kokainePocketTest.root.children.length"

extern host-texts() : ui string
  js inline "(function(){ var values=[]; globalThis.__kokainePocketTest.visit(globalThis.__kokainePocketTest.root,function(node){ if(node.kind==='text' && node.text!=='') values.push(node.text); }); return values.join('|'); })()"

extern host-first-style(name : string) : ui string
  js inline "(function(name){ var found=''; globalThis.__kokainePocketTest.visit(globalThis.__kokainePocketTest.root,function(node){ if(found==='' && Object.prototype.hasOwnProperty.call(node.style,name)) found=String(node.style[name]); }); return found; })(#1)"

extern host-first-text-style(name : string) : ui string
  js inline "(function(name){ var found=''; globalThis.__kokainePocketTest.visit(globalThis.__kokainePocketTest.root,function(node){ if(found==='' && node.kind==='text' && Object.prototype.hasOwnProperty.call(node.style,name)) found=String(node.style[name]); }); return found; })(#1)"

extern host-image-source() : ui string
  js inline "(function(){ var found=''; globalThis.__kokainePocketTest.visit(globalThis.__kokainePocketTest.root,function(node){ if(found==='' && node.kind==='image') found=node.source; }); return found; })()"

extern host-fire-press() : ui bool
  js inline "(function(){ var pressed=false; globalThis.__kokainePocketTest.visit(globalThis.__kokainePocketTest.root,function(node){ if(!pressed && typeof node.press==='function'){ pressed=true; node.press(); } }); return pressed; })()"

extern host-retains-press() : ui bool
  js inline "globalThis.__kokainePocketTest.all.some(function(node){ return typeof node.press==='function'; })"

extern host-fail-after(successful-inserts : int) : ui ()
  js inline "(globalThis.__kokainePocketTest.failAfter=#1)"

extern host-discard-count() : ui int
  js inline "globalThis.__kokainePocketTest.discarded"

extern string-includes(value : string, part : string) : bool
  js inline "String(#1).includes(String(#2))"

fun check(ok : bool, label : string)
  if ok then () else throw("FAILED: " ++ label)

fun failing-insert-mount(root : root<<ui>>) : ui string
  with catch fn(problem) problem.show
  val dispose-failed = mount(root,scene
    live/text { "orphan" }
  )
  "missing failure"

pub fun main()
  install-test-host()
  val (root,(count,visible,color)) = create-root fn(root)
    (signal(root,0),signal(root,True),signal(root,"#102030"))
  val increment = fn() count.modify(fn(value) value + 1)

  val page = scene
    layout(props=[width(480),height(272),flex-column(),gap(4),
                  live/background-color(fn() color.get)])
      live/text(props=[text-color("#f0f4f8"),font-slot(2)]) {
        "Count " ++ count.get.show
      }
      image("hero",props=[width(32),height(32)])
      dynamic
        if visible.get then text("More") else ()
      pressable-write(increment,props=[width(96)])
        text("Increment")

  val dispose-page = mount(root,page)
  check(host-root-child-count() == 2,
        "root owns the page and a private mount anchor")
  check(host-texts() == "Count 0|More|Increment",
        "static, live, and dynamic text mount in order")
  check(host-first-style("bgColor") == "#102030",
        "live native style applies during bootstrap")
  check(host-first-text-style("textColor") == "#f0f4f8" &&
        host-first-text-style("fontSlot") == "2",
        "text properties apply to the native text node")
  check(host-image-source() == "hero",
        "image source crosses the Pocket bridge")

  check(host-fire-press(),"focusable press handler is retained")
  check(host-texts() == "Count 1|More|Increment",
        "press re-entry synchronously flushes live text")

  update(root){
    visible.set(False)
    color.set("#405060")
  }
  check(host-texts() == "Count 1|Increment",
        "dynamic region retires its previous nodes")
  check(host-first-style("bgColor") == "#405060",
        "live style updates through a complete inline-style snapshot")

  unmount(dispose-page)
  check(host-root-child-count() == 0,"unmount removes the retained range")
  check(!host-retains-press(),"unmount revokes retained press callbacks")

  host-fail-after(1)
  val failure = failing-insert-mount(root)
  check(string-includes(failure,"injected insert failure"),
        "rollback preserves the original insert failure")
  check(host-discard-count() == 1,
        "failed insertion releases its detached native node")
  check(host-root-child-count() == 0,
        "failed mount removes its already-published anchor")
  root.dispose()
