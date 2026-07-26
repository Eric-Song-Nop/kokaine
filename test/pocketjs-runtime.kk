module pocketjs-runtime

import kokaine/reactive
import kokaine/pocket
import kokaine/pocket/async
import kokaine/reactive/effects
import kokaine/reactive/internal/model


extern install-test-host() : ui ()
  js inline "(function(){ var all=[]; var root={ kind:'root', children:[], parent:null, style:{} }; var visit=function(node,action){ action(node); for(var i=0;i<node.children.length;i++) visit(node.children[i],action); }; var create=function(kind,text){ var node={ kind:kind, text:text||'', children:[], parent:null, style:{}, focusable:false, source:'', press:undefined, discarded:false }; all.push(node); return node; }; var state={ root:root, all:all, visit:visit, failAfter:-1, failLiveAfter:-1, liveWrites:0, reboundWrites:0, previousBridge:null, discarded:0 }; var mutateLive=function(action){ if(state.failLiveAfter===0){ state.failLiveAfter=-1; throw new Error('injected live failure'); } if(state.failLiveAfter>0) state.failLiveAfter--; state.liveWrites++; action(); }; globalThis.__kokainePocketTest=state; globalThis[Symbol.for('kokaine.pocketjs.bridge')]={ version:1, getRoot:function(){ return root; }, createView:function(){ return create('view',''); }, createText:function(value){ return create('text',String(value)); }, createImage:function(){ return create('image',''); }, replaceText:function(node,value){ mutateLive(function(){ node.text=String(value); }); }, insertBefore:function(parent,node,anchor){ if(state.failAfter===0){ state.failAfter=-1; throw new Error('injected insert failure'); } if(state.failAfter>0) state.failAfter--; if(node.parent){ var old=node.parent.children.indexOf(node); if(old>=0) node.parent.children.splice(old,1); } var index=anchor==null ? parent.children.length : parent.children.indexOf(anchor); if(index<0) throw new Error('bad anchor'); parent.children.splice(index,0,node); node.parent=parent; }, remove:function(parent,node){ var index=parent.children.indexOf(node); if(index<0) throw new Error('not a child'); parent.children.splice(index,1); node.parent=null; }, discard:function(node){ if(node.parent) throw new Error('discarded attached node'); node.discarded=true; state.discarded++; }, setStyleNumber:function(node,name,value){ mutateLive(function(){ node.style[name]=Number(value); }); }, setStyleString:function(node,name,value){ mutateLive(function(){ node.style[name]=String(value); }); }, setFocusable:function(node,value){ node.focusable=!!value; }, setSource:function(node,value){ node.source=String(value); }, setPress:function(node,handler){ node.press=handler; }, clearPress:function(node){ node.press=undefined; } }; })()"

extern install-test-async-host() : ui ()
  js inline "(function(){ var state={ active:true, queue:[], timers:[], lateRuns:0 }; var dispatcher={ post:function(callback){ if(!state.active) return false; state.queue.push(callback); return true; }, afterMilliseconds:function(milliseconds,callback){ if(!state.active) return false; var timer={ active:true, delay:Number(milliseconds), callback:callback }; state.timers.push(timer); return function(){ if(!timer.active) return; timer.active=false; timer.callback=undefined; }; } }; state.dispatcher=dispatcher; globalThis.__kokainePocketAsyncTest=state; globalThis[Symbol.for('kokaine.pocketjs.async')]={ version:1, capture:function(){ return dispatcher; } }; })()"

extern host-async-frame() : ui ()
  js inline "(function(){ var state=globalThis.__kokainePocketAsyncTest; var batch=state.queue; state.queue=[]; for(var i=0;i<batch.length;i++) batch[i](); })()"

extern host-drain-async(max-frames : int) : ui int
  js inline "(function(maxFrames){ var state=globalThis.__kokainePocketAsyncTest; var frames=0; while(state.queue.length>0 && frames<maxFrames){ var batch=state.queue; state.queue=[]; for(var i=0;i<batch.length;i++) batch[i](); frames++; } return frames; })(#1)"

extern host-fire-timer(delay : int) : ui bool
  js inline "(function(delay){ var timers=globalThis.__kokainePocketAsyncTest.timers; for(var i=0;i<timers.length;i++){ var timer=timers[i]; if(timer.active && timer.delay===delay){ timer.active=false; var callback=timer.callback; timer.callback=undefined; callback(); return true; } } return false; })(#1)"

extern host-active-timers() : ui int
  js inline "globalThis.__kokainePocketAsyncTest.timers.filter(function(timer){ return timer.active; }).length"

extern host-queued-async-turns() : ui int
  js inline "globalThis.__kokainePocketAsyncTest.queue.length"

extern host-record-late-run() : ui ()
  js inline "globalThis.__kokainePocketAsyncTest.lateRuns++"

extern host-late-runs() : ui int
  js inline "globalThis.__kokainePocketAsyncTest.lateRuns"

extern dispose-test-async-host() : ui ()
  js inline "(function(){ var state=globalThis.__kokainePocketAsyncTest; state.active=false; state.queue.length=0; for(var i=0;i<state.timers.length;i++){ state.timers[i].active=false; state.timers[i].callback=undefined; } delete globalThis[Symbol.for('kokaine.pocketjs.async')]; })()"

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

extern host-fail-live-after(successful-writes : int) : ui ()
  js inline "(globalThis.__kokainePocketTest.failLiveAfter=#1)"

extern host-live-writes() : ui int
  js inline "globalThis.__kokainePocketTest.liveWrites"

extern host-install-rebound-bridge() : ui ()
  js inline "(function(){ var key=Symbol.for('kokaine.pocketjs.bridge'); var state=globalThis.__kokainePocketTest; var previous=globalThis[key]; state.previousBridge=previous; var rebound=Object.create(previous); rebound.version=1; rebound.replaceText=function(node,value){ state.reboundWrites++; return previous.replaceText(node,value); }; globalThis[key]=rebound; })()"

extern host-restore-bridge() : ui ()
  js inline "(function(){ var key=Symbol.for('kokaine.pocketjs.bridge'); var state=globalThis.__kokainePocketTest; globalThis[key]=state.previousBridge; state.previousBridge=null; })()"

extern host-rebound-writes() : ui int
  js inline "globalThis.__kokainePocketTest.reboundWrites"

extern host-discard-count() : ui int
  js inline "globalThis.__kokainePocketTest.discarded"

extern string-includes(value : string, part : string) : bool
  js inline "String(#1).includes(String(#2))"

fun check(ok : bool, label : string)
  if ok then () else throw("FAILED: " ++ label)

fun failing-insert-mount(root : kokaine/reactive/root<<ui>>) : ui string
  with catch fn(problem) problem.show
  val dispose-failed = mount(root,scene
    live/text { "orphan" }
  )
  "missing failure"

fun failing-live-update(root : kokaine/reactive/root<<ui>>,
                        source : kokaine/reactive/signal<int>,
                        value : int) : ui string
  with catch fn(problem) problem.show
  update(root){ source.set(value) }
  "missing failure"

fun exact-untrack(action : () -> signal-read a) : signal-read a
  with override
    fun validate-derived(producer)
      validate-derived(producer)
    fun read-source(source,_,producer)
      read-source(source,Sample-read,producer)
  action()

pub fun main()
  install-test-host()
  val (root,(count,visible,color,
             (secondary,old-region,new-region,failure-value,
              (isolation-trigger,isolation-sample,
               region-selector,region-value)))) =
    create-root fn(root)
      (signal(root,0),signal(root,True),signal(root,"#102030"),
       (signal(root,0),signal(root,0),signal(root,0),signal(root,0),
        (signal(root,0),signal(root,0),signal(root,0),signal(root,0))))
  val increment = fn() count.modify(fn(value) value + 1)

  val page = scene
    layout(props=[width(480),height(272),flex-column(),gap(4),
                  live/background-color(fn() color.get)])
      live/text(props=[text-color("#f0f4f8"),font-slot(2)]) {
        "Count " ++ count.get.show
      }
      live/text { "Mirror " ++ count.get.show }
      live/text { "Secondary " ++ secondary.get.show }
      image("hero",props=[width(32),height(32)])
      dynamic
        if visible.get
        then live/text { "Old " ++ old-region.get.show }
        else live/text { "New " ++ new-region.get.show }
      pressable-write(increment,props=[width(96)])
        text("Increment")

  val dispose-page = mount(root,page)
  check(host-root-child-count() == 2,
        "root owns the page and a private mount anchor")
  check(host-texts() ==
        "Count 0|Mirror 0|Secondary 0|Old 0|Increment",
        "live, static, and dynamic text mount in order")
  check(host-first-style("bgColor") == "#102030",
        "live native style applies during bootstrap")
  check(host-first-text-style("textColor") == "#f0f4f8" &&
        host-first-text-style("fontSlot") == "2",
        "text properties apply to the native text node")
  check(host-image-source() == "hero",
        "image source crosses the Pocket bridge")

  val before-secondary = host-live-writes()
  update(root){ secondary.set(1) }
  check(host-live-writes() == before-secondary + 1,
        "an independent source publishes only its changed binding")
  check(host-texts() ==
        "Count 0|Mirror 0|Secondary 1|Old 0|Increment",
        "the independent binding reaches the host")

  check(host-fire-press(),"focusable press handler is retained")
  check(host-texts() ==
        "Count 1|Mirror 1|Secondary 1|Old 0|Increment",
        "press re-entry synchronously flushes live text")

  update(root){
    visible.set(False)
    color.set("#405060")
  }
  check(host-texts() ==
        "Count 1|Mirror 1|Secondary 1|New 0|Increment",
        "dynamic region retires its previous nodes")
  check(host-first-style("bgColor") == "#405060",
        "live style updates through a complete inline-style snapshot")

  val before-retired-region = host-live-writes()
  update(root){ old-region.set(1) }
  check(host-live-writes() == before-retired-region,
        "a retired region cannot publish from its old source")
  update(root){ new-region.set(1) }
  check(host-live-writes() == before-retired-region + 1,
        "the current region publishes only its changed binding")
  check(host-texts() ==
        "Count 1|Mirror 1|Secondary 1|New 1|Increment",
        "the current region remains reactive")

  unmount(dispose-page)
  check(host-root-child-count() == 0,"unmount removes the retained range")
  check(!host-retains-press(),"unmount revokes retained press callbacks")
  val before-retired-page = host-live-writes()
  update(root){
    count.set(2)
    visible.set(True)
    color.set("#607080")
    secondary.set(2)
    old-region.set(2)
    new-region.set(2)
  }
  check(host-live-writes() == before-retired-page,
        "unmounted bindings cannot publish host mutations")

  val dispose-failure-page = mount(root,scene
    live/text { "First " ++ failure-value.get.show }
    live/text { "Second " ++ failure-value.get.show }
  )
  val before-first-failure = host-live-writes()
  host-fail-live-after(0)
  val first-failure = failing-live-update(root,failure-value,1)
  check(string-includes(first-failure,"injected live failure"),
        "a live bridge failure escapes the triggering update")
  check(host-live-writes() == before-first-failure &&
        host-texts() == "First 0|Second 0",
        "failure before publication leaves every binding uncommitted")
  update(root){ failure-value.set(1) }
  check(host-live-writes() == before-first-failure + 2 &&
        host-texts() == "First 1|Second 1",
        "an equal update retries every unpublished binding")

  val before-partial-failure = host-live-writes()
  host-fail-live-after(1)
  val partial-failure = failing-live-update(root,failure-value,2)
  check(string-includes(partial-failure,"injected live failure"),
        "a partial live bridge failure escapes the triggering update")
  check(host-live-writes() == before-partial-failure + 1 &&
        host-texts() == "First 2|Second 1",
        "successful prefix bindings commit before a later failure")
  update(root){ failure-value.set(2) }
  check(host-live-writes() == before-partial-failure + 2 &&
        host-texts() == "First 2|Second 2",
        "an equal update retries only the unpublished suffix")
  unmount(dispose-failure-page)
  check(host-root-child-count() == 0,
        "the update failure fixture releases its retained range")

  val dispose-isolation-page = mount(root,scene
    live/text { "Tracked " ++ isolation-trigger.get.show }
    live/text {
      "Sampled " ++ exact-untrack{ isolation-sample.get }.show
    }
  )
  check(host-texts() == "Tracked 0|Sampled 0",
        "the binding isolation fixture mounts in order")
  val before-isolation-update = host-live-writes()
  update(root){ isolation-sample.set(1) }
  check(host-live-writes() == before-isolation-update &&
        host-texts() == "Tracked 0|Sampled 0",
        "an untracked sibling source cannot schedule host publication")
  update(root){ isolation-trigger.set(1) }
  check(host-live-writes() == before-isolation-update + 1 &&
        host-texts() == "Tracked 1|Sampled 0",
        "a tracked sibling update cannot resample a later binding")
  unmount(dispose-isolation-page)
  check(host-root-child-count() == 0,
        "the binding isolation fixture releases its retained range")

  val dispose-bridge-page = mount(root,scene
    live/text { "Bridge " ++ secondary.get.show }
  )
  check(host-texts() == "Bridge 2",
        "the dynamic bridge fixture mounts before replacement")
  val before-rebound = host-rebound-writes()
  host-install-rebound-bridge()
  update(root){ secondary.set(3) }
  check(host-rebound-writes() == before-rebound + 1 &&
        host-texts() == "Bridge 3",
        "a live publication resolves the currently installed bridge")
  host-restore-bridge()
  unmount(dispose-bridge-page)
  check(host-root-child-count() == 0,
        "the dynamic bridge fixture releases its retained range")

  val dispose-region-failure = mount(root,scene
    dynamic
      if region-selector.get == 0 then text("Off")
      else fragment
        live/text { "First " ++ region-value.get.show }
        live/text { "Second " ++ region-value.get.show }
  )
  check(host-texts() == "Off",
        "the region failure fixture starts inactive")
  val before-region-failure = host-live-writes()
  host-fail-live-after(1)
  val region-failure = failing-live-update(root,region-selector,1)
  check(string-includes(region-failure,"injected live failure"),
        "a region bootstrap bridge failure escapes its update")
  check(host-live-writes() == before-region-failure + 1 &&
        host-texts() == "First 0",
        "a later bootstrap failure preserves its successful prefix")
  update(root){ region-value.set(1) }
  check(host-live-writes() == before-region-failure + 2 &&
        host-texts() == "First 1",
        "the successful prefix retains its independent continuation")
  unmount(dispose-region-failure)
  check(host-root-child-count() == 0,
        "the region failure fixture releases its retained range")

  host-fail-after(1)
  val failure = failing-insert-mount(root)
  check(string-includes(failure,"injected insert failure"),
        "rollback preserves the original insert failure")
  check(host-discard-count() == 1,
        "failed insertion releases its detached native node")
  check(host-root-child-count() == 0,
        "failed mount removes its already-published anchor")
  root.dispose()

  install-test-async-host()
  val (async-root,async-phase) =
    create-root fn(owner) signal(owner,"idle")
  val dispose-async-page = mount(async-root,scene
    live/text { "Async " ++ async-phase.get }
    pressable-async(fn()
      async-phase.set("before-yield")
      yield()
      async-phase.set("after-yield")
      sleep(50)
      async-phase.set("after-sleep")
      match timeout(50,fn() {
              sleep(500)
              "late"
            })
        Nothing -> async-phase.set("timed-out")
        Just(value) -> async-phase.set(value)
    )
      text("Run async")
  )
  check(host-fire-press(),"async press handler is retained independently")
  check(host-texts() == "Async before-yield|Run async",
        "async press publishes synchronously until its first await")
  check(host-active-timers() == 1 && host-queued-async-turns() == 0,
        "yield parks on the Pocket virtual clock without a Promise turn")
  check(host-fire-timer(0),"the virtual zero timer is installed")
  check(host-queued-async-turns() == 1,
        "timer completion schedules one generation-bound host turn")
  host-async-frame()
  check(host-texts() == "Async after-yield|Run async" &&
        host-active-timers() == 1,
        "the next Pocket frame restores the owning reactive generation")
  check(host-fire-timer(50),"the requested virtual sleep is installed")
  host-async-frame()
  check(host-texts() == "Async after-sleep|Run async",
        "sleep resumes once and flushes its signal publication")
  host-drain-async(20)
  check(host-active-timers() == 2,
        "timeout starts its virtual deadline and action as owned strands")
  check(host-fire-timer(50),"the timeout deadline uses Pocket virtual time")
  val timeout-settle-frames = host-drain-async(20)
  check(timeout-settle-frames > 0 &&
        host-texts() == "Async timed-out|Run async" &&
        host-active-timers() == 0,
        "timeout cancels the losing action timer before publishing Nothing")
  unmount(dispose-async-page)
  async-root.dispose()
  check(host-root-child-count() == 0 && !host-retains-press(),
        "normal async unmount retires its range and press continuation")

  val (retired-root,retired-phase) =
    create-root fn(owner) signal(owner,"idle")
  val dispose-retired-page = mount(retired-root,scene
    live/text { "Retired " ++ retired-phase.get }
    pressable-async(fn()
      retired-phase.set("waiting")
      sleep(500)
      retired-phase.set("late")
    )
      text("Wait")
  )
  check(host-fire-press() && host-active-timers() == 1,
        "the retirement fixture owns one outstanding virtual timer")
  retired-root.dispose()
  check(host-active-timers() == 0 &&
        host-root-child-count() == 0 &&
        !host-retains-press(),
        "root retirement cancels timers and revokes async press callbacks")
  check(!host-fire-timer(500),
        "a canceled Pocket timer cannot resume its parked continuation")

  val (queued-root,queued-phase) =
    create-root fn(owner) signal(owner,"idle")
  val dispose-queued-page = mount(queued-root,scene
    live/text { "Queued " ++ queued-phase.get }
    pressable-async(fn()
      queued-phase.set("waiting")
      sleep(100)
      host-record-late-run()
      queued-phase.set("late")
    )
      text("Queue")
  )
  check(host-fire-press() && host-fire-timer(100) &&
        host-queued-async-turns() == 1,
        "a completed timer retains one generation-bound frame turn")
  queued-root.dispose()
  check(host-root-child-count() == 0 && !host-retains-press(),
        "root retirement revokes the queued async fixture")
  host-async-frame()
  check(host-late-runs() == 0 && host-queued-async-turns() == 0,
        "a timer turn queued before retirement cannot revive its continuation")

  val (multi-root,multi-count) =
    create-root fn(owner) signal(owner,0)
  val dispose-multi-page = mount(multi-root,scene
    live/text { "Multi " ++ multi-count.get.show }
    pressable-async(fn()
      multi-count.modify(fn(value) value + 1)
      yield()
      multi-count.modify(fn(value) value + 1)
    )
      text("Multi press")
  )
  check(host-fire-press() && host-fire-press() &&
        host-texts() == "Multi 2|Multi press" &&
        host-active-timers() == 2,
        "multi-shot async press starts independent structured strands")
  check(host-fire-timer(0) && host-fire-timer(0) &&
        host-queued-async-turns() == 2,
        "both async press strands post their own generation turn")
  host-async-frame()
  check(host-texts() == "Multi 4|Multi press" &&
        host-active-timers() == 0,
        "both multi-shot async press strands resume exactly once")
  unmount(dispose-multi-page)
  multi-root.dispose()
  check(host-root-child-count() == 0 && !host-retains-press(),
        "multi-shot async press fixture retires without retained callbacks")

  dispose-test-async-host()
