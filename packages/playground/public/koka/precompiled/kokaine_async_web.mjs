// Koka generated module: kokaine/async/web, koka version: 3.2.4
"use strict";
 
// imports
import * as $std_core_types from './std_core_types.mjs';
import * as $std_core_hnd from './std_core_hnd.mjs';
import * as $std_core_exn from './std_core_exn.mjs';
import * as $std_core_bool from './std_core_bool.mjs';
import * as $std_core_order from './std_core_order.mjs';
import * as $std_core_char from './std_core_char.mjs';
import * as $std_core_int from './std_core_int.mjs';
import * as $std_core_vector from './std_core_vector.mjs';
import * as $std_core_string from './std_core_string.mjs';
import * as $std_core_sslice from './std_core_sslice.mjs';
import * as $std_core_list from './std_core_list.mjs';
import * as $std_core_maybe from './std_core_maybe.mjs';
import * as $std_core_maybe2 from './std_core_maybe2.mjs';
import * as $std_core_either from './std_core_either.mjs';
import * as $std_core_result from './std_core_result.mjs';
import * as $std_core_tuple from './std_core_tuple.mjs';
import * as $std_core_lazy from './std_core_lazy.mjs';
import * as $std_core_show from './std_core_show.mjs';
import * as $std_core_debug from './std_core_debug.mjs';
import * as $std_core_delayed from './std_core_delayed.mjs';
import * as $std_core_console from './std_core_console.mjs';
import * as $std_core from './std_core.mjs';
import * as $kokaine_async_effects from './kokaine_async_effects.mjs';
import * as $kokaine_async_structured from './kokaine_async_structured.mjs';
import * as $std_time_duration from './std_time_duration.mjs';
import * as $std_num_ddouble from './std_num_ddouble.mjs';
import * as $std_time_timestamp from './std_time_timestamp.mjs';
 
// externals
 
// type declarations
// type fetch-subscription
export function Fetch_subscription(value) /* (value : any) -> fetch-subscription */  {
  return value;
}
// type promise
export function Browser_promise(value) /* forall<a> (value : any) -> promise<a> */  {
  return value;
}
// type promise-subscription
export function Promise_subscription(value) /* (value : any) -> promise-subscription */  {
  return value;
}
// type request
export function Browser_request(value) /* (value : any) -> request */  {
  return value;
}
// type response
export function Browser_response(value) /* (value : any) -> response */  {
  return value;
}
// type response-body-subscription
export function Response_body_subscription(value) /* (value : any) -> response-body-subscription */  {
  return value;
}
// type timer-subscription
export function Timer_subscription(value) /* (value : any) -> timer-subscription */  {
  return value;
}
 
// declarations
 
 
// Automatically generated. Retrieves the `value` constructor field of the `:timer-subscription` type.
export function timer_subscription_fs_value(_this) /* (timer-subscription) -> any */  {
  return _this;
}
 
export function timer_subscription_fs__copy(_this, value) /* (timer-subscription, value : ? any) -> timer-subscription */  {
  if (value !== undefined) {
    var _x0 = value;
  }
  else {
    var _x0 = _this;
  }
  return _x0;
}
 
 
// Browsers coerce one timeout delay through a signed 32-bit representation.
// Keep the exact total as a safe integer, schedule bounded chunks, and use a
// short monotonic deadline per chunk to absorb both early and late callbacks.
export function timer_setup_raw(milliseconds, fulfill, reject) /* (milliseconds : int, fulfill : () -> ui (), reject : (any) -> ui ()) -> ui any */  {
  return (function(){ var maxDelay=2147483647; var requested=Math.max(0,Number(milliseconds)); var state={ fulfill:fulfill, reject:reject, handle:null, remaining:0, started:0, slice:0, deadline:0 }; function clear(){ state.fulfill=null; state.reject=null; state.handle=null; } function complete(){ var callback=state.fulfill; clear(); if(callback) callback(); } function fail(error){ var callback=state.reject; clear(); if(callback) callback(error); } function schedule(delay){ state.handle=setTimeout(tick,delay); } function arm(){ state.slice=Math.min(maxDelay,Math.ceil(state.remaining)); state.started=performance.now(); state.deadline=state.started+state.slice; schedule(state.slice); } function tick(){ state.handle=null; if(!state.fulfill) return; try { var now=performance.now(); var until=state.deadline-now; if(until>0){ schedule(Math.min(maxDelay,Math.ceil(until))); return; } state.remaining=Math.max(0,state.remaining-Math.max(state.slice,now-state.started)); if(state.remaining<=0) complete(); else arm(); } catch(error) { fail(error); } } if(!Number.isSafeInteger(requested)){ clear(); return { ok:false, error:'duration exceeds the exact browser timer range' }; } state.remaining=requested; try { arm(); return { ok:true, state:state }; } catch(error) { clear(); return { ok:false, error:error }; } })();
}
 
export function host_result_ok(value) /* (value : any) -> bool */  {
  return !!(value).ok;
}
 
export function host_result_error(value) /* (value : any) -> any */  {
  return (value).error;
}
 
 
// JavaScript promises may reject with any value, including a Proxy or object
// whose `message` getter/string conversion throws. Formatting must never keep
// the Koka completion callback from observing that rejection.
export function host_error_message(value) /* (value : any) -> string */  {
  return (function(error){ try { var message=error && error.message; return String(message == null ? error : message); } catch(formatError) { try { var fallback=formatError && formatError.message; return String(fallback == null ? formatError : fallback); } catch(_) { return 'unprintable host error'; } } })(value);
}
 
export function host_result_state(value) /* (value : any) -> timer-subscription */  {
  return (value).state;
}
 
export function timer_retire(value) /* (value : timer-subscription) -> ui () */  {
  return (function(){ var state=value; if(!state) return; var handle=state.handle; state.fulfill=null; state.reject=null; state.handle=null; if(handle!=null){ try { clearTimeout(handle); } catch(_) {} } })();
}
 
 
// Automatically generated. Retrieves the `value` constructor field of the `:promise` type.
export function promise_fs_value(promise) /* forall<a> (promise : promise<a>) -> any */  {
  return promise;
}
 
export function promise_fs__copy(_this, value) /* forall<a> (promise<a>, value : ? any) -> promise<a> */  {
  if (value !== undefined) {
    var _x1 = value;
  }
  else {
    var _x1 = _this;
  }
  return _x1;
}
 
 
// Automatically generated. Retrieves the `value` constructor field of the `:promise-subscription` type.
export function promise_subscription_fs_value(_this) /* (promise-subscription) -> any */  {
  return _this;
}
 
export function promise_subscription_fs__copy(_this, value) /* (promise-subscription, value : ? any) -> promise-subscription */  {
  if (value !== undefined) {
    var _x2 = value;
  }
  else {
    var _x2 = _this;
  }
  return _x2;
}
 
export function promise_subscribe(value, fulfill, reject) /* forall<a> (value : promise<a>, fulfill : (a) -> ui (), reject : (any) -> ui ()) -> ui any */  {
  return (function(){ var state={ fulfill:fulfill, reject:reject }; try { Promise.resolve(value).then(function(value){ var callback=state.fulfill; state.fulfill=null; state.reject=null; if(callback) callback(value); },function(error){ var callback=state.reject; state.fulfill=null; state.reject=null; if(callback) callback(error); }); return { ok:true, state:state }; } catch(error) { state.fulfill=null; state.reject=null; return { ok:false, error:error }; } })();
}
 
export function promise_result_state(value) /* (value : any) -> promise-subscription */  {
  return (value).state;
}
 
 
// Drop both Koka callbacks before touching any host object. A non-cancelable
// Promise may still settle, but its JavaScript closure then sees an inert cell.
export function promise_retire(value) /* (value : promise-subscription) -> ui () */  {
  return (function(){ var state=value; if(state){ state.fulfill=null; state.reject=null; } })();
}
 
export function promise_fs_await(value) /* forall<a> (value : promise<a>) -> <kokaine/async/effects/async,exn> a */  {
  return $kokaine_async_effects.setup_fs_await("promise", function(resume /* (error<514>) -> ui () */ ) {
       
      var installed = promise_subscribe(value, function(result /* 514 */ ) {
          return resume($std_core_types.Ok(result));
        }, function(reason /* any */ ) {
          return resume($std_core_types.$Error($std_core_exn.Exception($std_core_types._lp__plus__plus__rp_("browser Promise rejected: ", host_error_message(reason)), $std_core_exn.ExnError)));
        });
       
      var b_10003 = host_result_ok(installed);
      if (b_10003) {
         
        var subscription = promise_result_state(installed);
        return $std_core_types.Ok(function() {
          return promise_retire(subscription);
        });
      }
      else {
        return $std_core_types.$Error($std_core_exn.Exception($std_core_types._lp__plus__plus__rp_("browser Promise setup failed: ", host_error_message(host_result_error(installed))), $std_core_exn.ExnError));
      }
    });
}
 
 
// Sleep without holding a Kokaine batch open. The generation handler invokes
// this setup only after it has registered the task with the current owner.
export function sleep(delay) /* (delay : std/time/duration/duration) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,exn> () */  {
  return $kokaine_async_effects.setup_fs_await($std_core_types._lp__plus__plus__rp_("sleep ", $std_core_hnd._open_none2($std_time_duration.show, delay)), function(resume /* (error<()>) -> ui () */ ) {
       
      var _x3 = delay;
      var j_10005 = $std_num_ddouble.int($std_num_ddouble._lp__star__rp_(_x3, $std_time_timestamp.int_fs_timespan(1000)));
       
      var _x4 = ($std_core_types._int_ge(0,j_10005)) ? 0 : j_10005;
      var installed = timer_setup_raw(_x4, function() {
          return resume($std_core_types.Ok($std_core_types.Unit));
        }, function(reason /* any */ ) {
          return resume($std_core_types.$Error($std_core_exn.Exception($std_core_types._lp__plus__plus__rp_("browser timer failed: ", host_error_message(reason)), $std_core_exn.ExnError)));
        });
       
      var b_10007 = host_result_ok(installed);
      if (b_10007) {
         
        var subscription = host_result_state(installed);
        return $std_core_types.Ok(function() {
          return timer_retire(subscription);
        });
      }
      else {
        return $std_core_types.$Error($std_core_exn.Exception($std_core_types._lp__plus__plus__rp_("browser timer setup failed: ", host_error_message(host_result_error(installed))), $std_core_exn.ExnError));
      }
    });
}
 
export function $yield() /* () -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,exn> () */  {
  return sleep($std_core_hnd._open_none1(function(n /* int */ ) {
      return $std_num_ddouble._lp__fs__rp_($std_time_timestamp.int_fs_timespan(n), $std_time_timestamp.int_fs_timespan(1000));
    }, 0));
}
 
 
// monadic lift
export function _mlift_timeout_10047(wild__) /* forall<a,e> (wild_ : ()) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,exn|e> maybe<a> */  {
  return $std_core_types.Nothing;
}
 
 
// monadic lift
export function _mlift_timeout_10048(_y_x10020) /* forall<a,e> (a) -> <kokaine/async/effects/async,exn|e> maybe<a> */  {
  return $std_core_types.Just(_y_x10020);
}
 
export function timeout(delay, action) /* forall<a,e> (delay : std/time/duration/duration, action : () -> <kokaine/async/effects/async,exn|e> a) -> <kokaine/async/effects/async,exn|e> maybe<a> */  {
  return $kokaine_async_structured.race(function() {
       
      var x_10052 = $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_types.Nil))))))), sleep, delay);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
          return $std_core_types.Nothing;
        });
      }
      else {
        return $std_core_types.Nothing;
      }
    }, function() {
       
      var x_0_10055 = action();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10020 /* 802 */ ) {
          return $std_core_types.Just(_y_x10020);
        });
      }
      else {
        return $std_core_types.Just(x_0_10055);
      }
    });
}
 
 
// Explicitly unsafe because no runtime check can prove the JavaScript promise
// resolves to Koka value `a`.
export function unsafe_promise(value) /* forall<a> (value : any) -> promise<a> */  {
  return value;
}
 
export function promise_fs_unsafe_any(value) /* forall<a> (value : promise<a>) -> any */  {
  return value;
}
 
 
// Automatically generated. Retrieves the `value` constructor field of the `:request` type.
export function request_fs_value(request_0) /* (request : request) -> any */  {
  return request_0;
}
 
export function request_fs__copy(_this, value) /* (request, value : ? any) -> request */  {
  if (value !== undefined) {
    var _x3 = value;
  }
  else {
    var _x3 = _this;
  }
  return _x3;
}
 
 
// Automatically generated. Retrieves the `value` constructor field of the `:response` type.
export function response_fs_value(response) /* (response : response) -> any */  {
  return response;
}
 
export function response_fs__copy(_this, value) /* (response, value : ? any) -> response */  {
  if (value !== undefined) {
    var _x4 = value;
  }
  else {
    var _x4 = _this;
  }
  return _x4;
}
 
 
// Automatically generated. Retrieves the `value` constructor field of the `:fetch-subscription` type.
export function fetch_subscription_fs_value(_this) /* (fetch-subscription) -> any */  {
  return _this;
}
 
export function fetch_subscription_fs__copy(_this, value) /* (fetch-subscription, value : ? any) -> fetch-subscription */  {
  if (value !== undefined) {
    var _x5 = value;
  }
  else {
    var _x5 = _this;
  }
  return _x5;
}
 
export function request(url, method, body) /* (url : string, method : ? string, body : ? (maybe<string>)) -> request */  {
  var _x6 = (method !== undefined) ? method : "GET";
  var _x7 = (body !== undefined) ? body : $std_core_types.Nothing;
  return ({ url:url, init:{ method:_x6, body:(_x7 == null ? undefined : (_x7).value) } });
}
 
 
// Convenience constructors keep the common call sites direct and typed.
export function get(url) /* (url : string) -> request */  {
  return request(url);
}
 
export function post(url, body) /* (url : string, body : string) -> request */  {
  return request(url, "POST", $std_core_types.Just(body));
}
 
export function fetch_subscribe(value, fulfill, reject) /* (value : request, fulfill : (response) -> ui (), reject : (any) -> ui ()) -> ui any */  {
  return (function(){ var controller=null; var state={ fulfill:fulfill, reject:reject, controller:null }; try { controller=new AbortController(); state.controller=controller; var request=value; globalThis.fetch(request.url,Object.assign({},request.init,{ signal:controller.signal })).then(function(value){ var callback=state.fulfill; var activeController=state.controller; state.fulfill=null; state.reject=null; if(callback) callback({ response:value, controller:activeController, release:null }); },function(error){ var callback=state.reject; state.fulfill=null; state.reject=null; state.controller=null; if(callback) callback(error); }); return { ok:true, state:state }; } catch(error) { state.fulfill=null; state.reject=null; state.controller=null; return { ok:false, error:error }; } })();
}
 
export function fetch_result_state(value) /* (value : any) -> fetch-subscription */  {
  return (value).state;
}
 
 
// Revoke Koka closures first; AbortController is invoked only after the task
// has become inert, so a hostile/polyfilled abort cannot re-enter it.
export function fetch_retire(value) /* (value : fetch-subscription) -> ui () */  {
  return (function(){ var state=value; if(!state) return; var controller=state.controller; state.fulfill=null; state.reject=null; state.controller=null; if(controller){ try { controller.abort(); } catch(_) {} } })();
}
 
export function response_own(value, release) /* (value : response, release : kokaine/async/effects/dispose-fn) -> ui () */  {
  return (value).release=release;
}
 
 
// Generation retirement owns this raw disposer. It must not call the lease's
// release action because the owner registration is already being finalized.
export function response_retire(value) /* (value : response) -> ui () */  {
  return (function(){ var wrapper=value; if(!wrapper) return; var response=wrapper.response; var controller=wrapper.controller; var body=response && response.body; wrapper.release=null; wrapper.controller=null; if(controller){ try { controller.abort(); } catch(_) {} } if(body && !body.locked){ try { var canceled=body.cancel(); if(canceled && canceled.catch) canceled.catch(function(){}); } catch(_) {} } })();
}
 
 
// monadic lift
export function _mlift_fetch_10049(result_0, wild__) /* (result@0 : response, wild_ : ()) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,exn> response */  {
  return result_0;
}
 
 
// monadic lift
export function _mlift_fetch_10050(result_0, release) /* (result@0 : response, release : () -> ui ()) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,exn> response */  {
   
  var x_10058 = $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons(0, $std_core_types.Cons(1, $std_core_types.Cons(2, $std_core_types.Cons(3, $std_core_types.Cons(4, $std_core_types.Nil)))))), $kokaine_async_effects.async_host, function() {
      return response_own(result_0, release);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return result_0;
    });
  }
  else {
    return result_0;
  }
}
 
 
// monadic lift
export function _mlift_fetch_10051(result_0) /* (result@0 : response) -> <kokaine/async/effects/async,exn> response */  {
   
  var x_10062 = $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons(0, $std_core_types.Cons(1, $std_core_types.Cons(2, $std_core_types.Cons(3, $std_core_types.Cons(4, $std_core_types.Nil)))))), $kokaine_async_effects.async_own, function() {
      return response_retire(result_0);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(release /* () -> ui () */ ) {
      return _mlift_fetch_10050(result_0, release);
    });
  }
  else {
    return _mlift_fetch_10050(result_0, x_10062);
  }
}
 
export function fetch(value) /* (value : request) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,exn> response */  {
   
  var x_10064 = $kokaine_async_effects.setup_fs_await("fetch", function(resume /* (error<response>) -> ui () */ ) {
       
      var installed = fetch_subscribe(value, function(result /* response */ ) {
          return resume($std_core_types.Ok(result));
        }, function(reason /* any */ ) {
          return resume($std_core_types.$Error($std_core_exn.Exception($std_core_types._lp__plus__plus__rp_("browser Fetch rejected: ", host_error_message(reason)), $std_core_exn.ExnError)));
        });
       
      var b_10013 = host_result_ok(installed);
      if (b_10013) {
         
        var subscription = fetch_result_state(installed);
        return $std_core_types.Ok(function() {
          return fetch_retire(subscription);
        });
      }
      else {
        return $std_core_types.$Error($std_core_exn.Exception($std_core_types._lp__plus__plus__rp_("browser Fetch setup failed: ", host_error_message(host_result_error(installed))), $std_core_exn.ExnError));
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_fetch_10051);
  }
  else {
     
    var x_0_10067 = $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons(0, $std_core_types.Cons(1, $std_core_types.Cons(2, $std_core_types.Cons(3, $std_core_types.Cons(4, $std_core_types.Nil)))))), $kokaine_async_effects.async_own, function() {
        return response_retire(x_10064);
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(release /* () -> ui () */ ) {
        return _mlift_fetch_10050(x_10064, release);
      });
    }
    else {
       
      var x_1_10070 = $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons(0, $std_core_types.Cons(1, $std_core_types.Cons(2, $std_core_types.Cons(3, $std_core_types.Cons(4, $std_core_types.Nil)))))), $kokaine_async_effects.async_host, function() {
          return response_own(x_10064, x_0_10067);
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
          return x_10064;
        });
      }
      else {
        return x_10064;
      }
    }
  }
}
 
export function response_fs_status(value) /* (value : response) -> ui int */  {
  return Number((value).response.status);
}
 
export function response_fs_ok(value) /* (value : response) -> ui bool */  {
  return !!(value).response.ok;
}
 
export function response_fs_url(value) /* (value : response) -> ui string */  {
  return String((value).response.url == null ? '' : (value).response.url);
}
 
 
// A response which will not be consumed explicitly releases its generation
// lease before aborting. Clear the wrapper first so hostile host objects cannot
// observe or re-enter a live ownership edge.
export function response_fs_discard(value) /* (value : response) -> ui () */  {
  return (function(){ var wrapper=value; if(!wrapper) return; var response=wrapper.response; var release=wrapper.release; var controller=wrapper.controller; var body=response && response.body; wrapper.release=null; wrapper.controller=null; if(release){ try { release(); } catch(_) {} } if(controller){ try { controller.abort(); } catch(_) {} } if(body && !body.locked){ try { var canceled=body.cancel(); if(canceled && canceled.catch) canceled.catch(function(){}); } catch(_) {} } })();
}
 
 
// Automatically generated. Retrieves the `value` constructor field of the `:response-body-subscription` type.
export function response_body_subscription_fs_value(_this) /* (response-body-subscription) -> any */  {
  return _this;
}
 
export function response_body_subscription_fs__copy(_this, value) /* (response-body-subscription, value : ? any) -> response-body-subscription */  {
  if (value !== undefined) {
    var _x8 = value;
  }
  else {
    var _x8 = _this;
  }
  return _x8;
}
 
 
// Response body consumption remains tied to the AbortController created for
// Fetch. `fetch()` resolves as soon as headers arrive, so revoking only the
// body Promise callbacks would otherwise leave a streaming network request
// alive after its Kokaine generation retired.
export function response_body_subscribe(value, as_json, fulfill, reject) /* forall<a> (value : response, as-json : bool, fulfill : (a) -> ui (), reject : (any) -> ui ()) -> ui any */  {
  return (function(){ var wrapper=value; var response=wrapper.response; var release=wrapper.release; var state={ fulfill:fulfill, reject:reject, controller:wrapper.controller, body:response.body }; wrapper.release=null; wrapper.controller=null; function clear(){ state.controller=null; state.body=null; } function stop(){ var controller=state.controller; var body=state.body; state.fulfill=null; state.reject=null; clear(); if(controller){ try { controller.abort(); } catch(_) {} } if(body && !body.locked){ try { var canceled=body.cancel(); if(canceled && canceled.catch) canceled.catch(function(){}); } catch(_) {} } } try { if(release) release(); var pending=(as_json ? response.json() : response.text()); Promise.resolve(pending).then(function(result){ var callback=state.fulfill; state.fulfill=null; state.reject=null; clear(); if(callback) callback(result); },function(error){ var callback=state.reject; state.fulfill=null; state.reject=null; clear(); if(callback) callback(error); }); return { ok:true, state:state }; } catch(error) { stop(); return { ok:false, error:error }; } })();
}
 
export function response_body_result_state(value) /* (value : any) -> response-body-subscription */  {
  return (value).state;
}
 
 
// Revoke language callbacks before aborting the request. A locked body is
// canceled by AbortController; an as-yet-unlocked stream is canceled directly
// as well so custom Fetch implementations get the same retirement contract.
export function response_body_retire(value) /* (value : response-body-subscription) -> ui () */  {
  return (function(){ var state=value; if(!state) return; var controller=state.controller; var body=state.body; state.fulfill=null; state.reject=null; state.controller=null; state.body=null; if(controller){ try { controller.abort(); } catch(_) {} } if(body && !body.locked){ try { var canceled=body.cancel(); if(canceled && canceled.catch) canceled.catch(function(){}); } catch(_) {} } })();
}
 
export function await_response_body(value, as_json) /* forall<a> (value : response, as-json : bool) -> <kokaine/async/effects/async,exn> a */  {
  return $kokaine_async_effects.setup_fs_await("response body", function(resume /* (error<1481>) -> ui () */ ) {
       
      var installed = response_body_subscribe(value, as_json, function(result /* 1481 */ ) {
          return resume($std_core_types.Ok(result));
        }, function(reason /* any */ ) {
          return resume($std_core_types.$Error($std_core_exn.Exception($std_core_types._lp__plus__plus__rp_("browser Response body rejected: ", host_error_message(reason)), $std_core_exn.ExnError)));
        });
       
      var b_10015 = host_result_ok(installed);
      if (b_10015) {
         
        var subscription = response_body_result_state(installed);
        return $std_core_types.Ok(function() {
          return response_body_retire(subscription);
        });
      }
      else {
        return $std_core_types.$Error($std_core_exn.Exception($std_core_types._lp__plus__plus__rp_("browser Response body setup failed: ", host_error_message(host_result_error(installed))), $std_core_exn.ExnError));
      }
    });
}
 
export function response_fs_text(value) /* (value : response) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,exn> string */  {
  return await_response_body(value, false);
}
 
 
// JSON stays an `any` FFI value. A domain adapter should validate/decode it at
// its boundary instead of asserting an unchecked generic Koka type.
export function response_fs_json(value) /* (value : response) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,exn> any */  {
  return await_response_body(value, true);
}
 
export function response_fs_require_ok(value) /* (value : response) -> <exn,ui> response */  {
  var _x9 = $std_core_hnd._open_none1(response_fs_ok, value);
  if (_x9) {
    return value;
  }
  else {
     
    var status = $std_core_hnd._open_none1(response_fs_status, value);
     
    $std_core_hnd._open_none1(response_fs_discard, value);
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("HTTP request failed with status ", $std_core_int.show(status)));
  }
}