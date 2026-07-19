// Koka generated module: kokaine/async/channel, koka version: 3.2.4
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
import * as $std_core_unsafe from './std_core_unsafe.mjs';
 
// externals
 
// type declarations
// type delivery-guard
export function Delivery_guard(disposer) /* (disposer : ref<global,maybe<kokaine/async/effects/dispose-fn>>) -> delivery-guard */  {
  return disposer;
}
// type queue-state
export function Queue_state(front, back, waiters) /* forall<a> (front : list<a>, back : list<a>, waiters : list<() -> ui ()>) -> queue-state<a> */  {
  return { front: front, back: back, waiters: waiters };
}
// type resume-queue
export function Resume_queue(state) /* forall<a> (state : ref<global,queue-state<a>>) -> resume-queue<a> */  {
  return state;
}
 
// declarations
 
 
// Automatically generated. Retrieves the `front` constructor field of the `:queue-state` type.
export function queue_state_fs_front(_this) /* forall<a> (queue-state<a>) -> list<a> */  {
  return _this.front;
}
 
 
// Automatically generated. Retrieves the `back` constructor field of the `:queue-state` type.
export function queue_state_fs_back(_this) /* forall<a> (queue-state<a>) -> list<a> */  {
  return _this.back;
}
 
 
// Automatically generated. Retrieves the `waiters` constructor field of the `:queue-state` type.
export function queue_state_fs_waiters(_this) /* forall<a> (queue-state<a>) -> list<() -> ui ()> */  {
  return _this.waiters;
}
 
export function queue_state_fs__copy(_this, front, back, waiters) /* forall<a> (queue-state<a>, front : ? (list<a>), back : ? (list<a>), waiters : ? (list<() -> ui ()>)) -> queue-state<a> */  {
  if (front !== undefined) {
    var _x0 = front;
  }
  else {
    var _x0 = _this.front;
  }
  if (back !== undefined) {
    var _x1 = back;
  }
  else {
    var _x1 = _this.back;
  }
  if (waiters !== undefined) {
    var _x2 = waiters;
  }
  else {
    var _x2 = _this.waiters;
  }
  return Queue_state(_x0, _x1, _x2);
}
 
 
// Automatically generated. Retrieves the `state` constructor field of the `:resume-queue` type.
export function resume_queue_fs_state(_this) /* forall<a> (resume-queue<a>) -> ref<global,queue-state<a>> */  {
  return _this;
}
 
export function resume_queue_fs__copy(_this, state) /* forall<a> (resume-queue<a>, state : ? (ref<global,queue-state<a>>)) -> resume-queue<a> */  {
  if (state !== undefined) {
    var _x3 = state;
  }
  else {
    var _x3 = _this;
  }
  return _x3;
}
 
 
// Automatically generated. Retrieves the `disposer` constructor field of the `:delivery-guard` type.
export function delivery_guard_fs_disposer(_this) /* (delivery-guard) -> ref<global,maybe<kokaine/async/effects/dispose-fn>> */  {
  return _this;
}
 
export function delivery_guard_fs__copy(_this, disposer) /* (delivery-guard, disposer : ? (ref<global,maybe<kokaine/async/effects/dispose-fn>>)) -> delivery-guard */  {
  if (disposer !== undefined) {
    var _x4 = disposer;
  }
  else {
    var _x4 = _this;
  }
  return _x4;
}
 
export function cell(value) /* forall<a> (value : a) -> ref<global,a> */  {
  return { value: value };
}
 
export function load(value) /* forall<a> (value : ref<global,a>) -> a */  {
  return value.value;
}
 
export function store(target, value) /* forall<a> (target : ref<global,a>, value : a) -> () */  {
  return ((target).value = value);
}
 
export function new_resume_queue() /* forall<a> () -> resume-queue<a> */  {
  return { value: (Queue_state($std_core_types.Nil, $std_core_types.Nil, $std_core_types.Nil)) };
}
 
export function new_delivery_guard() /* () -> delivery-guard */  {
  return { value: ($std_core_types.Nothing) };
}
 
export function delivery_guard_fs_install(guard, dispose) /* (guard : delivery-guard, dispose : kokaine/async/effects/dispose-fn) -> () */  {
  return ((guard).value = ($std_core_types.Just(dispose)));
}
 
export function delivery_guard_fs_accept(guard) /* (guard : delivery-guard) -> () */  {
  return ((guard).value = ($std_core_types.Nothing));
}
 
export function delivery_guard_fs_abandon(guard) /* (guard : delivery-guard) -> ui () */  {
   
  var current = guard.value;
   
  ((guard).value = ($std_core_types.Nothing));
  if (current === null) {
    return $std_core_types.Unit;
  }
  else {
    return current.value();
  }
}
 
export function delivery_guard_fs_abandon_async(guard) /* (guard : delivery-guard) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue> () */  {
  return $kokaine_async_effects.async_host(function() {
    return delivery_guard_fs_abandon(guard);
  });
}
 
export function resume_queue_fs_has_value(queue) /* forall<a> (queue : resume-queue<a>) -> bool */  {
  var _x5 = queue.value;
  return (_x5.front === null && _x5.back === null) ? false : true;
}
 
 
// Remove the oldest buffered value. The two-list representation keeps host
// enqueue O(1) while preserving browser-observed callback order.
export function resume_queue_fs_try_take(queue) /* forall<a> (queue : resume-queue<a>) -> maybe<a> */  {
  var _x6 = queue.value;
  if (_x6.front !== null) {
     
    ((queue).value = (Queue_state(_x6.front.tail, _x6.back, _x6.waiters)));
    return $std_core_types.Just(_x6.front.head);
  }
  else if (_x6.front === null && _x6.back === null) {
    return $std_core_types.Nothing;
  }
  else {
    var _x7 = $std_core_list.reverse_acc($std_core_types.Nil, _x6.back);
    if (_x7 === null) {
      return $std_core_types.Nothing;
    }
    else {
       
      ((queue).value = (Queue_state(_x7.tail, $std_core_types.Nil, _x6.waiters)));
      return $std_core_types.Just(_x7.head);
    }
  }
}
 
 
// Called only by a browser callback interpreted as `ui`. Always buffer the
// inert value before waking a driver. In particular, if that driver's wakeup
// is scheduled but its owner retires first, the queued strand capability is
// still available to the structured cancellation drain.
export function resume_queue_fs_push_from_host(queue, value) /* forall<a> (queue : resume-queue<a>, value : a) -> ui () */  {
  var _x8 = queue.value;
  if (_x8.waiters !== null) {
     
    ((queue).value = (Queue_state(_x8.front, $std_core_types.Cons(value, _x8.back), _x8.waiters.tail)));
    return _x8.waiters.head();
  }
  else {
    return ((queue).value = (Queue_state(_x8.front, $std_core_types.Cons(value, _x8.back), $std_core_types.Nil)));
  }
}
 
 
// monadic lift
export function resume_queue_fs__mlift_take_10128(queue, wild__) /* forall<a> (queue : resume-queue<a>, wild_ : ()) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue> a */  {
  var _x9 = $std_core_hnd._open_none1(resume_queue_fs_try_take, queue);
  if (_x9 !== null) {
    return _x9.value;
  }
  else {
    return $std_core_debug.impossible("structured resume woke without a queued value", $std_core_types._lp__plus__plus__rp_("kokaine/async/channel.kk", $std_core_types._lp__plus__plus__rp_("(", $std_core_types._lp__plus__plus__rp_($std_core_int.show(123), ")"))));
  }
}
 
 
// The structured driver has at most one outstanding receive, but retaining a
// waiter list makes synchronous setup/completion re-entry harmless.
export function resume_queue_fs_take(queue) /* forall<a> (queue : resume-queue<a>) -> kokaine/async/effects/async a */  {
  var _x10 = $std_core_hnd._open_none1(resume_queue_fs_try_take, queue);
  if (_x10 !== null) {
    return _x10.value;
  }
  else {
     
    var x_10133 = $kokaine_async_effects.await0_noexn("structured resume", function(resume /* () -> ui () */ ) {
        var _x11 = queue.value;
        if (_x11.front === null) {
          if (_x11.back === null) {
             
            var value_1_10049 = Queue_state(_x11.front, _x11.back, $std_core_list.append(_x11.waiters, $std_core_types.Cons(resume, $std_core_types.Nil)));
            return ((queue).value = value_1_10049);
          }
          else {
            return resume();
          }
        }
        else {
          return resume();
        }
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
        return resume_queue_fs__mlift_take_10128(queue, wild__);
      });
    }
    else {
      var _x11 = $std_core_hnd._open_none1(resume_queue_fs_try_take, queue);
      if (_x11 !== null) {
        return _x11.value;
      }
      else {
        return $std_core_debug.impossible("structured resume woke without a queued value", $std_core_types._lp__plus__plus__rp_("kokaine/async/channel.kk", $std_core_types._lp__plus__plus__rp_("(", $std_core_types._lp__plus__plus__rp_($std_core_int.show(123), ")"))));
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_route_awaits_10129(rcontext, wild___1) /* forall<a,e> (rcontext : hnd/resume-context<kokaine/async/effects/await-result<a>,<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e>,<kokaine/async/effects/async-await,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e>,()>, wild_@1 : ()) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> () */  {
  return rcontext($std_core_hnd.Deep($kokaine_async_effects.Cancel));
}
 
 
// monadic lift
export function _mlift_route_awaits_10130(rcontext, wild___3) /* forall<a,e> (rcontext : hnd/resume-context<kokaine/async/effects/await-result<a>,<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e>,<kokaine/async/effects/async-await,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e>,()>, wild_@3 : ()) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> () */  {
  return rcontext($std_core_hnd.Deep($kokaine_async_effects.Cancel));
}
 
 
// monadic lift
export function _mlift_route_awaits_10131(wild___5) /* forall<e> (wild_@5 : ()) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_route_awaits_10132(action, _y_x10093) /* forall<e> (action : () -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> (), hnd/ev-index) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> () */  {
  return $std_core_hnd._mask_at(_y_x10093, true, action);
}
 
 
// Convert each suspension in `action` into an installed non-blocking await.
// The host callback stores, but never directly executes, the captured suffix.
// The suffix is resumed only when the structured driver consumes the queue.
export function route_awaits(queue, action) /* forall<e> (queue : resume-queue<(force-cancel : bool) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> ()>, action : () -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> ()) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> () */  {
   
  var cancel_started = { value: false };
  return $kokaine_async_effects.async_await_fs__handle($kokaine_async_effects._Hnd_async_await(3, function(m /* hnd/marker<<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|1390>,()> */ , ___wildcard_x598__16 /* hnd/ev<kokaine/async/effects/async-await> */ , x /* (kokaine/async/effects/await-setup<_1024>, kokaine/async/effects/async-scope, string) */ ) {
        return $std_core_hnd.yield_to(m, function(k /* (hnd/resume-result<kokaine/async/effects/await-result<_1024>,()>) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|1390> () */ ) {
             
            var rcontext_10163 = k;
             
            var delivery = { value: ($std_core_types.Nothing) };
             
            var _x_x3_10117 = $std_core_types._lp__plus__plus__rp_("structured: ", x.thd);
             
            var x_0_10141 = $std_core_hnd._open_at4($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), function(setup_0 /* kokaine/async/effects/await-setup<1311> */ , scope_0 /* kokaine/async/effects/async-scope */ , label_0 /* string */ , callback /* (kokaine/async/effects/await-result<1311>) -> ui () */ ) {
                return $std_core_hnd._perform4($std_core_hnd._evv_at(0), $kokaine_async_effects.no_await_fs__select, setup_0, scope_0, label_0, callback);
              }, function(complete /* (kokaine/async/effects/await-result<1311>) -> ui () */ ) {
                var _x12 = x.fst(complete);
                if (_x12._tag === 1) {
                  return $std_core_types.$Error(_x12.error);
                }
                else {
                   
                  ((delivery).value = ($std_core_types.Just(_x12.value)));
                  return $std_core_types.Ok(function() {
                    return delivery_guard_fs_abandon(delivery);
                  });
                }
              }, x.snd, _x_x3_10117, function(result /* kokaine/async/effects/await-result<1311> */ ) {
                return resume_queue_fs_push_from_host(queue, function(force_cancel /* bool */ ) {
                    if (result._tag === 3) {
                       
                      ((cancel_started).value = true);
                       
                      var x_1_10145 = $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Nil)))))), function(guard_0 /* delivery-guard */ ) {
                          return $kokaine_async_effects.async_host(function() {
                            return delivery_guard_fs_abandon(guard_0);
                          });
                        }, delivery);
                       
                      var next_0_10146 = function(wild___1 /* () */ ) {
                        return rcontext_10163($std_core_hnd.Deep($kokaine_async_effects.Cancel));
                      };
                      if ($std_core_hnd._yielding()) {
                        return $std_core_hnd.yield_extend(next_0_10146);
                      }
                      else {
                        return next_0_10146(x_1_10145);
                      }
                    }
                    else {
                      if (force_cancel) {
                         
                        var _x_x1_1_10120 = cancel_started.value;
                        var _x13 = $std_core_hnd._open_none1(function(b /* bool */ ) {
                            return (b) ? false : true;
                          }, _x_x1_1_10120);
                        if (_x13) {
                           
                          ((cancel_started).value = true);
                           
                          var x_2_10147 = $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Nil)))))), function(guard_0_0 /* delivery-guard */ ) {
                              return $kokaine_async_effects.async_host(function() {
                                return delivery_guard_fs_abandon(guard_0_0);
                              });
                            }, delivery);
                           
                          var next_1_10148 = function(wild___3 /* () */ ) {
                            return rcontext_10163($std_core_hnd.Deep($kokaine_async_effects.Cancel));
                          };
                          if ($std_core_hnd._yielding()) {
                            return $std_core_hnd.yield_extend(next_1_10148);
                          }
                          else {
                            return next_1_10148(x_2_10147);
                          }
                        }
                        else {
                           
                          $std_core_hnd._open_none1(function(guard_1 /* delivery-guard */ ) {
                              return ((guard_1).value = ($std_core_types.Nothing));
                            }, delivery);
                          return rcontext_10163($std_core_hnd.Deep(result));
                        }
                      }
                      else {
                         
                        $std_core_hnd._open_none1(function(guard_2 /* delivery-guard */ ) {
                            return ((guard_2).value = ($std_core_types.Nothing));
                          }, delivery);
                        return rcontext_10163($std_core_hnd.Deep(result));
                      }
                    }
                  });
              });
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(wild___5 /* () */ ) {
                return $std_core_types.Unit;
              });
            }
            else {
              return $std_core_types.Unit;
            }
          });
      }, $std_core_hnd.clause_tail1(function(_pat_x789__20 /* (kokaine/async/effects/await-setup<_1027>, kokaine/async/effects/async-scope, string, (kokaine/async/effects/await-result<_1027>) -> ui ()) */ ) {
        return $std_core_hnd._open_at4($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), function(setup_1 /* kokaine/async/effects/await-setup<1363> */ , scope_1 /* kokaine/async/effects/async-scope */ , label_1 /* string */ , callback_1 /* (kokaine/async/effects/await-result<1363>) -> ui () */ ) {
            return $std_core_hnd._perform4($std_core_hnd._evv_at(0), $kokaine_async_effects.no_await_fs__select, setup_1, scope_1, label_1, callback_1);
          }, _pat_x789__20.fst, _pat_x789__20.snd, _pat_x789__20.thd, _pat_x789__20.field4);
      })), function(_res /* () */ ) {
      return _res;
    }, function() {
       
      var x_5_10155 = $std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10093 /* hnd/ev-index */ ) {
          return $std_core_hnd._mask_at(_y_x10093, true, action);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_5_10155, true, action);
      }
    });
}