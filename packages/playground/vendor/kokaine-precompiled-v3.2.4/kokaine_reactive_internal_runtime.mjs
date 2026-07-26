// Koka generated module: kokaine/reactive/internal/runtime, koka version: 3.2.4
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
import * as $kokaine_reactive_internal_model from './kokaine_reactive_internal_model.mjs';
import * as $kokaine_reactive_effects from './kokaine_reactive_effects.mjs';
import * as $kokaine_reactive_internal_lifetime from './kokaine_reactive_internal_lifetime.mjs';
import * as $kokaine_reactive_internal_scheduler from './kokaine_reactive_internal_scheduler.mjs';
import * as $kokaine_reactive_internal_handlers from './kokaine_reactive_internal_handlers.mjs';
import * as $kokaine_reactive_internal_capture from './kokaine_reactive_internal_capture.mjs';
import * as $kokaine_reactive_internal_resource from './kokaine_reactive_internal_resource.mjs';
import * as $kokaine_internal_registry from './kokaine_internal_registry.mjs';
import * as $kokaine_reactive_internal_work_dash_transaction from './kokaine_reactive_internal_work_dash_transaction.mjs';
import * as $std_core_undiv from './std_core_undiv.mjs';
 
// externals
 
// type declarations
 
// declarations
 
 
// Public dispatch lives at the composition layer; the handler implementation
// remains isolated in `internal/handlers`.
export function dispatch(root, action) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, action : () -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> a */  {
  return $kokaine_reactive_internal_handlers.dispatch_handled(root, action);
}
 
export function fresh_plane(current_frame, retirement) /* forall<e> (current-frame : kokaine/reactive/internal/model/frame<e>, retirement : kokaine/reactive/internal/model/retirement-coordinator<e>) -> kokaine/reactive/internal/model/plane<e> */  {
  return $kokaine_reactive_internal_model.Plane($kokaine_reactive_internal_work_dash_transaction.new_work_queue(), { value: ($std_core_types.Nothing) }, { value: ($std_core_types.Nothing) }, { value: current_frame }, { value: ($std_core_types.Nothing) }, retirement);
}
 
 
// Root retirement detaches local bootstrap groups before invoking cleanup so
// retained transaction capabilities cannot reclaim their scopes by re-entry.
export function claim_root_work(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> () */  {
   
  var _x0 = root.root_derive_plane.plane_work_group;
  var derive_group = _x0.value;
   
  var _x1 = root.root_effect_plane.plane_work_group;
  var effect_group = _x1.value;
   
  var _x2 = root.root_derive_plane.plane_work_group;
  ((_x2).value = ($std_core_types.Nothing));
   
  var _x3 = root.root_effect_plane.plane_work_group;
  ((_x3).value = ($std_core_types.Nothing));
   
  if (derive_group === null) {
    $std_core_types.Unit;
  }
  else {
     
    var _pat_1_7 = $kokaine_reactive_internal_work_dash_transaction.work_group_fs_mark_aborted(derive_group.value);
    $kokaine_reactive_internal_work_dash_transaction.work_group_fs_clear(derive_group.value);
  }
  if (effect_group === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var _pat_4_7 = $kokaine_reactive_internal_work_dash_transaction.work_group_fs_mark_aborted(effect_group.value);
    return $kokaine_reactive_internal_work_dash_transaction.work_group_fs_clear(effect_group.value);
  }
}
 
 
// monadic lift
export function _mlift_retire_root_now_10480(root, lifetime_finalizers) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, lifetime-finalizers : list<kokaine/reactive/internal/lifetime/retirement<e>>) -> <div,exn|e> () */  {
   
  var _x_x1_27_10367 = $std_core_hnd._open_none1(function(root_15 /* kokaine/reactive/internal/model/root<917> */ ) {
      return root_15.root_lifetime;
    }, root);
  return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/lifetime-owner<917> */ ) {
        return _this_0.lifetime_retirement;
      }, _x_x1_27_10367), lifetime_finalizers);
}
 
 
// This is the non-validating half of root disposal. Besides ordinary public
// disposal, it is used to roll back a root whose construction has not been
// published yet. In that case a batch may still be open, or an initial flush
// may have failed after publishing only a prefix of the queued scopes.
export function retire_root_now(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> <div,exn|e> () */  {
   
  var target_10161 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<917> */ ) {
      return root_0.root_disposing;
    }, root);
   
  ((target_10161).value = true);
   
  var _x_x1_0_10340 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<917> */ ) {
      return root_1.root_lifetime;
    }, root);
   
  var target_0_10164 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<917> */ ) {
      return _this.lifetime_token;
    }, _x_x1_0_10340);
   
  ((target_0_10164).value = ($kokaine_reactive_internal_model.Scope_dead));
   
  $std_core_hnd._open_none1(claim_root_work, root);
   
  var _x_x1_25_10365 = $std_core_hnd._open_none1(function(root_14 /* kokaine/reactive/internal/model/root<917> */ ) {
      return root_14.root_lifetime;
    }, root);
   
  var x_10514 = $std_core_hnd._open_none1(function(owner /* kokaine/reactive/internal/model/lifetime-owner<917> */ ) {
      return $kokaine_reactive_internal_lifetime.collect_retirement_loop($std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
            return $kokaine_reactive_internal_lifetime.lifetime_retirement_expand(owner);
          }), $std_core_types.Nil), $std_core_types.Nil);
    }, _x_x1_25_10365);
   
  function next_10515(lifetime_finalizers) /* (list<kokaine/reactive/internal/lifetime/retirement<917>>) -> <div,exn|917> () */  {
     
    var _x_x1_27_10367 = $std_core_hnd._open_none1(function(root_15_0 /* kokaine/reactive/internal/model/root<917> */ ) {
        return root_15_0.root_lifetime;
      }, root);
    return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/lifetime-owner<917> */ ) {
          return _this_0.lifetime_retirement;
        }, _x_x1_27_10367), lifetime_finalizers);
  }
  if ($std_core_hnd._yielding()) {
    var _x0 = $std_core_hnd.yield_extend(next_10515);
  }
  else {
    var _x0 = next_10515(x_10514);
  }
  return $std_core_hnd.finally_prompt(function() {
       
      var target_1_10169 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<917> */ ) {
          return root_2.root_batch_depth;
        }, root);
       
      ((target_1_10169).value = 0);
       
      var target_2_10172 = $std_core_hnd._open_none1(function(root_3 /* kokaine/reactive/internal/model/root<917> */ ) {
          return root_3.root_flushing;
        }, root);
       
      ((target_2_10172).value = false);
       
      var target_3_10175 = $std_core_hnd._open_none1(function(root_4 /* kokaine/reactive/internal/model/root<917> */ ) {
          return root_4.root_disposed;
        }, root);
       
      ((target_3_10175).value = true);
       
      var target_4_10178 = $std_core_hnd._open_none1(function(root_5 /* kokaine/reactive/internal/model/root<917> */ ) {
          return root_5.root_disposing;
        }, root);
       
      ((target_4_10178).value = false);
       
      var _x_x1_8_10348 = $std_core_hnd._open_none1(function(root_6 /* kokaine/reactive/internal/model/root<917> */ ) {
          return root_6.root_derive_plane;
        }, root);
       
      var _x_x1_7_10347 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<total> */ ) {
          return plane.plane_queue;
        }, _x_x1_8_10348);
       
      $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_queue_fs_clear, _x_x1_7_10347);
       
      var _x_x1_11_10351 = $std_core_hnd._open_none1(function(root_7 /* kokaine/reactive/internal/model/root<917> */ ) {
          return root_7.root_effect_plane;
        }, root);
       
      var _x_x1_10_10350 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<917> */ ) {
          return plane_0.plane_queue;
        }, _x_x1_11_10351);
       
      $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_queue_fs_clear, _x_x1_10_10350);
       
      var _x_x1_13_10353 = $std_core_hnd._open_none1(function(root_8 /* kokaine/reactive/internal/model/root<917> */ ) {
          return root_8.root_derive_plane;
        }, root);
       
      var target_5_10187 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<total> */ ) {
          return plane_1.plane_work_group;
        }, _x_x1_13_10353);
       
      ((target_5_10187).value = ($std_core_types.Nothing));
       
      var _x_x1_15_10355 = $std_core_hnd._open_none1(function(root_9 /* kokaine/reactive/internal/model/root<917> */ ) {
          return root_9.root_effect_plane;
        }, root);
       
      var target_6_10191 = $std_core_hnd._open_none1(function(plane_2 /* kokaine/reactive/internal/model/plane<917> */ ) {
          return plane_2.plane_work_group;
        }, _x_x1_15_10355);
       
      ((target_6_10191).value = ($std_core_types.Nothing));
       
      var _x_x1_17_10357 = $std_core_hnd._open_none1(function(root_10 /* kokaine/reactive/internal/model/root<917> */ ) {
          return root_10.root_derive_plane;
        }, root);
       
      var target_7_10195 = $std_core_hnd._open_none1(function(plane_3 /* kokaine/reactive/internal/model/plane<total> */ ) {
          return plane_3.plane_current;
        }, _x_x1_17_10357);
       
      ((target_7_10195).value = ($std_core_types.Nothing));
       
      var _x_x1_19_10359 = $std_core_hnd._open_none1(function(root_11 /* kokaine/reactive/internal/model/root<917> */ ) {
          return root_11.root_effect_plane;
        }, root);
       
      var target_8_10199 = $std_core_hnd._open_none1(function(plane_4 /* kokaine/reactive/internal/model/plane<917> */ ) {
          return plane_4.plane_current;
        }, _x_x1_19_10359);
       
      ((target_8_10199).value = ($std_core_types.Nothing));
       
      var _x_x1_21_10361 = $std_core_hnd._open_none1(function(root_12 /* kokaine/reactive/internal/model/root<917> */ ) {
          return root_12.root_derive_plane;
        }, root);
       
      var target_9_10203 = $std_core_hnd._open_none1(function(plane_5 /* kokaine/reactive/internal/model/plane<total> */ ) {
          return plane_5.plane_draft;
        }, _x_x1_21_10361);
       
      ((target_9_10203).value = ($std_core_types.Nothing));
       
      var _x_x1_23_10363 = $std_core_hnd._open_none1(function(root_13 /* kokaine/reactive/internal/model/root<917> */ ) {
          return root_13.root_effect_plane;
        }, root);
       
      var target_10_10207 = $std_core_hnd._open_none1(function(plane_6 /* kokaine/reactive/internal/model/plane<917> */ ) {
          return plane_6.plane_draft;
        }, _x_x1_23_10363);
      return ((target_10_10207).value = ($std_core_types.Nothing));
    }, _x0);
}
 
export function fresh_root() /* forall<e> () -> kokaine/reactive/internal/model/root<e> */  {
   
  var effect_retirement = $kokaine_reactive_internal_lifetime.new_retirement_coordinator();
   
  var derive_retirement = $kokaine_reactive_internal_lifetime.new_retirement_coordinator();
   
  var lifetime = $kokaine_reactive_internal_lifetime.new_lifetime_owner($kokaine_reactive_internal_model.Scope_live, effect_retirement);
   
  var derive_frame = $kokaine_reactive_internal_lifetime.new_lifetime_owner($kokaine_reactive_internal_model.Scope_live, derive_retirement);
   
  var root = $kokaine_reactive_internal_model.Root({ value: true }, fresh_plane(derive_frame, derive_retirement), fresh_plane(lifetime, effect_retirement), lifetime, { value: 0 }, { value: false }, { value: false }, { value: false });
   
  $kokaine_reactive_internal_lifetime.retirement_coordinator_fs_install_root_disposal(effect_retirement, function() {
      return retire_root_now(root);
    });
  return root;
}
 
 
// monadic lift
export function _mlift_create_root_10481(committed, result, root, wild___2) /* forall<_e,a,e1> (committed : ref<global,bool>, result : a, root : kokaine/reactive/internal/model/root<e1>, wild_@2 : ()) -> <div,exn|e1> (kokaine/reactive/internal/model/root<e1>, a) */  {
   
  ((committed).value = true);
  return $std_core_types.Tuple2(root, result);
}
 
 
// monadic lift
export function _mlift_create_root_10482(committed, root, result) /* forall<_e,a,e1> (committed : ref<global,bool>, root : kokaine/reactive/internal/model/root<e1>, result : a) -> <div,exn|e1> (kokaine/reactive/internal/model/root<e1>, a) */  {
   
  var target_0_10222 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<1221> */ ) {
      return root_1.root_batch_depth;
    }, root);
   
  ((target_0_10222).value = 0);
   
  var x_10518 = $kokaine_reactive_internal_scheduler.flush(root);
   
  function next_10519(wild___2) /* (()) -> <div,exn|1221> (kokaine/reactive/internal/model/root<1221>, 1220) */  {
     
    ((committed).value = true);
    return $std_core_types.Tuple2(root, result);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10519);
  }
  else {
    return next_10519(x_10518);
  }
}
 
 
// monadic lift
export function _mlift_create_root_10483(action, wild__) /* forall<_e,_e1,_e2,a,e3> (action : (kokaine/reactive/internal/model/root<e3>) -> <kokaine/reactive/effects/signal-write,pure|e3> a, wild_ : ()) -> <exn|e3> (kokaine/reactive/internal/model/root<e3>, a) */  {
   
  var root = $std_core_hnd._open_none0(fresh_root);
   
  var committed = { value: false };
   
  var target_10219 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<1221> */ ) {
      return root_0.root_batch_depth;
    }, root);
   
  ((target_10219).value = 1);
   
  var x_10526 = $kokaine_reactive_internal_handlers.interpret_write(root, function() {
      return action(root);
    });
  if ($std_core_hnd._yielding()) {
    var _x2 = $std_core_hnd.yield_extend(function(result /* 1220 */ ) {
      return _mlift_create_root_10482(committed, root, result);
    });
  }
  else {
    var _x2 = _mlift_create_root_10482(committed, root, x_10526);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x1 = committed.value;
      if (_x1) {
        return $std_core_types.Unit;
      }
      else {
        return retire_root_now(root);
      }
    }, _x2);
}
 
export function create_root(action) /* forall<a,e> (action : (kokaine/reactive/internal/model/root<e>) -> <kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> (kokaine/reactive/internal/model/root<e>, a) */  {
   
  var x_10528 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "reactive root creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_create_root_10483(action, wild__);
    });
  }
  else {
     
    var root = $std_core_hnd._open_none0(fresh_root);
     
    var committed = { value: false };
     
    var target_10219 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<1221> */ ) {
        return root_0.root_batch_depth;
      }, root);
     
    ((target_10219).value = 1);
     
    var x_0_10533 = $kokaine_reactive_internal_handlers.interpret_write(root, function() {
        return action(root);
      });
    if ($std_core_hnd._yielding()) {
      var _x4 = $std_core_hnd.yield_extend(function(result /* 1220 */ ) {
        return _mlift_create_root_10482(committed, root, result);
      });
    }
    else {
      var _x4 = _mlift_create_root_10482(committed, root, x_0_10533);
    }
    return $std_core_hnd.finally_prompt(function() {
        var _x3 = committed.value;
        if (_x3) {
          return $std_core_types.Unit;
        }
        else {
          return retire_root_now(root);
        }
      }, _x4);
  }
}
 
 
// monadic lift
export function root_fs__mlift_dispose_10484(root, wild__) /* forall<_e,_e1,e2> (root : kokaine/reactive/internal/model/root<e2>, wild_ : ()) -> <exn|e2> () */  {
   
  var value_10228 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<1505> */ ) {
      return root_0.root_disposed;
    }, root);
  var _x5 = value_10228.value;
  if (_x5) {
    return $std_core_types.Unit;
  }
  else {
     
    var value_0_10230 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<1505> */ ) {
        return root_1.root_disposing;
      }, root);
    var _x6 = value_0_10230.value;
    if (_x6) {
      return $std_core_types.Unit;
    }
    else {
       
      var _x_x1_3_10376 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<1505> */ ) {
          return root_2.root_lifetime;
        }, root);
       
      var _x_x1_2_10375 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<1505> */ ) {
          return _this.lifetime_retirement;
        }, _x_x1_3_10376);
      var _x7 = $std_core_hnd._open_none1($kokaine_reactive_internal_lifetime.retirement_coordinator_fs_request_root_disposal, _x_x1_2_10375);
      if (_x7) {
         
        var target_10235 = $std_core_hnd._open_none1(function(root_3 /* kokaine/reactive/internal/model/root<1505> */ ) {
            return root_3.root_disposing;
          }, root);
        return ((target_10235).value = true);
      }
      else {
         
        var value_2_10238 = $std_core_hnd._open_none1(function(root_4 /* kokaine/reactive/internal/model/root<1505> */ ) {
            return root_4.root_batch_depth;
          }, root);
        var _x8 = $std_core_types._int_gt((value_2_10238.value),0);
        if (_x8) {
          return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
        }
        else {
           
          var value_3_10241 = $std_core_hnd._open_none1(function(root_5 /* kokaine/reactive/internal/model/root<1505> */ ) {
              return root_5.root_flushing;
            }, root);
          var _x9 = value_3_10241.value;
          if (_x9) {
            return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
          }
          else {
             
            var _x_x1_11_10385 = $std_core_hnd._open_none1(function(root_6 /* kokaine/reactive/internal/model/root<1505> */ ) {
                return root_6.root_effect_plane;
              }, root);
             
            var value_4_10245 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<1505> */ ) {
                return plane.plane_current;
              }, _x_x1_11_10385);
             
            var _x_x1_10_10387 = value_4_10245.value;
            var _x10 = $std_core_hnd._open_none1(function(maybe /* maybe<kokaine/reactive/internal/model/continuation-gate> */ ) {
                return (maybe !== null);
              }, _x_x1_10_10387);
            if (_x10) {
              return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
            }
            else {
               
              var _x_x1_15_10390 = $std_core_hnd._open_none1(function(root_7 /* kokaine/reactive/internal/model/root<1505> */ ) {
                  return root_7.root_derive_plane;
                }, root);
               
              var value_5_10250 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<total> */ ) {
                  return plane_0.plane_current;
                }, _x_x1_15_10390);
               
              var _x_x1_14_10392 = value_5_10250.value;
              var _x11 = $std_core_hnd._open_none1(function(maybe_0 /* maybe<kokaine/reactive/internal/model/continuation-gate> */ ) {
                  return (maybe_0 !== null);
                }, _x_x1_14_10392);
              if (_x11) {
                return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
              }
              else {
                return retire_root_now(root);
              }
            }
          }
        }
      }
    }
  }
}
 
export function root_fs_dispose(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> <exn|e> () */  {
   
  var x_10535 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "reactive root disposal");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return root_fs__mlift_dispose_10484(root, wild__);
    });
  }
  else {
     
    var value_10228 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<1505> */ ) {
        return root_0.root_disposed;
      }, root);
    var _x12 = value_10228.value;
    if (_x12) {
      return $std_core_types.Unit;
    }
    else {
       
      var value_0_10230 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<1505> */ ) {
          return root_1.root_disposing;
        }, root);
      var _x13 = value_0_10230.value;
      if (_x13) {
        return $std_core_types.Unit;
      }
      else {
         
        var _x_x1_3_10376 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<1505> */ ) {
            return root_2.root_lifetime;
          }, root);
         
        var _x_x1_2_10375 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<1505> */ ) {
            return _this.lifetime_retirement;
          }, _x_x1_3_10376);
        var _x14 = $std_core_hnd._open_none1($kokaine_reactive_internal_lifetime.retirement_coordinator_fs_request_root_disposal, _x_x1_2_10375);
        if (_x14) {
           
          var target_10235 = $std_core_hnd._open_none1(function(root_3 /* kokaine/reactive/internal/model/root<1505> */ ) {
              return root_3.root_disposing;
            }, root);
          return ((target_10235).value = true);
        }
        else {
           
          var value_2_10238 = $std_core_hnd._open_none1(function(root_4 /* kokaine/reactive/internal/model/root<1505> */ ) {
              return root_4.root_batch_depth;
            }, root);
          var _x15 = $std_core_types._int_gt((value_2_10238.value),0);
          if (_x15) {
            return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
          }
          else {
             
            var value_3_10241 = $std_core_hnd._open_none1(function(root_5 /* kokaine/reactive/internal/model/root<1505> */ ) {
                return root_5.root_flushing;
              }, root);
            var _x16 = value_3_10241.value;
            if (_x16) {
              return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
            }
            else {
               
              var _x_x1_11_10385 = $std_core_hnd._open_none1(function(root_6 /* kokaine/reactive/internal/model/root<1505> */ ) {
                  return root_6.root_effect_plane;
                }, root);
               
              var value_4_10245 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<1505> */ ) {
                  return plane.plane_current;
                }, _x_x1_11_10385);
               
              var _x_x1_10_10387 = value_4_10245.value;
              var _x17 = $std_core_hnd._open_none1(function(maybe /* maybe<kokaine/reactive/internal/model/continuation-gate> */ ) {
                  return (maybe !== null);
                }, _x_x1_10_10387);
              if (_x17) {
                return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
              }
              else {
                 
                var _x_x1_15_10390 = $std_core_hnd._open_none1(function(root_7 /* kokaine/reactive/internal/model/root<1505> */ ) {
                    return root_7.root_derive_plane;
                  }, root);
                 
                var value_5_10250 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<total> */ ) {
                    return plane_0.plane_current;
                  }, _x_x1_15_10390);
                 
                var _x_x1_14_10392 = value_5_10250.value;
                var _x18 = $std_core_hnd._open_none1(function(maybe_0 /* maybe<kokaine/reactive/internal/model/continuation-gate> */ ) {
                    return (maybe_0 !== null);
                  }, _x_x1_14_10392);
                if (_x18) {
                  return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
                }
                else {
                  return retire_root_now(root);
                }
              }
            }
          }
        }
      }
    }
  }
}
 
export function root_fs_is_disposed(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> bool */  {
  var _x19 = root.root_disposed;
  return _x19.value;
}
 
 
// monadic lift
export function _mlift_update_10485(result, wild__) /* forall<a,e> (result : a, wild_ : ()) -> <kokaine/reactive/effects/signal-write,div,exn|e> a */  {
  return result;
}
 
 
// monadic lift
export function _mlift_update_10486(root, result) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, result : a) -> <kokaine/reactive/effects/signal-write,pure|e> a */  {
   
  var _x_x1_10395 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<1582> */ ) {
      return root_1.root_key;
    }, root);
   
  var x_10538 = $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag), function(key /* kokaine/reactive/internal/model/root-key */ ) {
       
      var ev_10540 = $std_core_hnd._evv_at(0);
      var _x20 = $kokaine_reactive_effects.request_flush_fs__select(ev_10540.hnd);
      return _x20(ev_10540.marker, ev_10540, key);
    }, _x_x1_10395);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return result;
    });
  }
  else {
    return result;
  }
}
 
 
// monadic lift
export function _mlift_update_10487(action, root, _y_x10090) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-write,pure|e> a, root : kokaine/reactive/internal/model/root<e>, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write|e> a */  {
  return $std_core_hnd._mask_at(_y_x10090, false, function() {
       
      var x_10545 = action();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(result /* 1581 */ ) {
          return _mlift_update_10486(root, result);
        });
      }
      else {
        return _mlift_update_10486(root, x_10545);
      }
    });
}
 
export function update(root, action) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, action : () -> <kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> a */  {
  return $kokaine_reactive_internal_handlers.dispatch_handled(root, function() {
       
      var x_10547 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10090 /* hnd/ev-index */ ) {
          return _mlift_update_10487(action, root, _y_x10090);
        });
      }
      else {
        return _mlift_update_10487(action, root, x_10547);
      }
    });
}
 
 
// monadic lift
export function _mlift_sample_10488(action, _y_x10096) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-read,pure|e> a, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,kokaine/reactive/effects/signal-read|e> a */  {
  return $std_core_hnd._mask_at(_y_x10096, false, action);
}
 
export function sample(root, action) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, action : () -> <kokaine/reactive/effects/signal-read,pure|e> a) -> <exn|e> a */  {
  return $kokaine_reactive_internal_handlers.dispatch_handled(root, function() {
       
      var x_10549 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10096 /* hnd/ev-index */ ) {
          return $std_core_hnd._mask_at(_y_x10096, false, action);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_10549, false, action);
      }
    });
}
 
 
// monadic lift
export function _mlift_signal_by_10489(equals, initial, root, wild___0) /* forall<a,e> (equals : (a, a) -> bool, initial : a, root : kokaine/reactive/internal/model/root<e>, wild_@0 : ()) -> exn kokaine/reactive/internal/model/signal<a> */  {
  return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, equals);
}
 
 
// monadic lift
export function _mlift_signal_by_10490(equals, initial, root, wild__) /* forall<a,e> (equals : (a, a) -> bool, initial : a, root : kokaine/reactive/internal/model/root<e>, wild_ : ()) -> exn kokaine/reactive/internal/model/signal<a> */  {
   
  var x_10553 = $kokaine_reactive_internal_scheduler.check_registration(root);
   
  function next_10554(wild___0) /* (()) -> exn kokaine/reactive/internal/model/signal<1675> */  {
    return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, equals);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10554);
  }
  else {
    return next_10554(x_10553);
  }
}
 
export function signal_by(root, initial, equals) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, initial : a, equals : (a, a) -> bool) -> exn kokaine/reactive/internal/model/signal<a> */  {
   
  var x_10559 = $kokaine_reactive_internal_model.check_not_pure_plane("signal creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_signal_by_10490(equals, initial, root, wild__);
    });
  }
  else {
     
    var x_0_10562 = $kokaine_reactive_internal_scheduler.check_registration(root);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, equals);
      });
    }
    else {
      return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, equals);
    }
  }
}
 
export function signal(root, initial, _implicit_fs__lp__eq__eq__rp_) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, initial : a, ?(==) : (a, a) -> bool) -> exn kokaine/reactive/internal/model/signal<a> */  {
  return signal_by(root, initial, _implicit_fs__lp__eq__eq__rp_);
}
 
 
// monadic lift
export function _mlift_signal_always_10491(initial, root, wild___0) /* forall<a,e> (initial : a, root : kokaine/reactive/internal/model/root<e>, wild_@0 : ()) -> exn kokaine/reactive/internal/model/signal<a> */  {
  return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, function(___wildcard_x170__29 /* 1823 */ , ___wildcard_x170__31 /* 1823 */ ) {
      return false;
    });
}
 
 
// monadic lift
export function _mlift_signal_always_10492(initial, root, wild__) /* forall<a,e> (initial : a, root : kokaine/reactive/internal/model/root<e>, wild_ : ()) -> exn kokaine/reactive/internal/model/signal<a> */  {
   
  var x_10569 = $kokaine_reactive_internal_scheduler.check_registration(root);
   
  function next_10570(wild___0) /* (()) -> exn kokaine/reactive/internal/model/signal<1823> */  {
    return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, function(___wildcard_x170__29 /* 1823 */ , ___wildcard_x170__31 /* 1823 */ ) {
        return false;
      });
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10570);
  }
  else {
    return next_10570(x_10569);
  }
}
 
export function signal_always(root, initial) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, initial : a) -> exn kokaine/reactive/internal/model/signal<a> */  {
   
  var x_10574 = $kokaine_reactive_internal_model.check_not_pure_plane("signal creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_signal_always_10492(initial, root, wild__);
    });
  }
  else {
     
    var x_0_10577 = $kokaine_reactive_internal_scheduler.check_registration(root);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, function(___wildcard_x170__29 /* 1823 */ , ___wildcard_x170__31 /* 1823 */ ) {
            return false;
          });
      });
    }
    else {
      return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, function(___wildcard_x170__29_0 /* 1823 */ , ___wildcard_x170__31_0 /* 1823 */ ) {
          return false;
        });
    }
  }
}
 
export function signal_fs_get(signal_0) /* forall<a> (signal : kokaine/reactive/internal/model/signal<a>) -> kokaine/reactive/effects/signal-read a */  {
   
  var source_10034 = $std_core_hnd._open_none1(function(signal_1 /* kokaine/reactive/internal/model/signal<1858> */ ) {
      return signal_1;
    }, signal_0);
  return $std_core_hnd._perform3($std_core_hnd._evv_at(0), $kokaine_reactive_effects.read_source_fs__select, source_10034, $kokaine_reactive_internal_model.Track_read, $std_core_types.Nothing);
}
 
export function signal_fs_set(signal_0, value) /* forall<a> (signal : kokaine/reactive/internal/model/signal<a>, value : a) -> kokaine/reactive/effects/signal-write () */  {
   
  var source_10037 = $std_core_hnd._open_none1(function(signal_1 /* kokaine/reactive/internal/model/signal<1886> */ ) {
      return signal_1;
    }, signal_0);
   
  var evx_10583 = $std_core_hnd._evv_at(0);
  var _x20 = $kokaine_reactive_effects.write_source_fs__select(evx_10583.hnd);
  return _x20(evx_10583.marker, evx_10583, source_10037, value);
}
 
export function signal_fs_modify(signal_0, update_0) /* forall<a> (signal : kokaine/reactive/internal/model/signal<a>, update : (a) -> a) -> kokaine/reactive/effects/signal-write () */  {
   
  var source_10039 = $std_core_hnd._open_none1(function(signal_1 /* kokaine/reactive/internal/model/signal<1916> */ ) {
      return signal_1;
    }, signal_0);
   
  var evx_10587 = $std_core_hnd._evv_at(0);
  var _x21 = $kokaine_reactive_effects.modify_source_fs__select(evx_10587.hnd);
  return _x21(evx_10587.marker, evx_10587, source_10039, update_0);
}
 
 
// monadic lift
export function _mlift_batch_10493(action, root, wild__) /* forall<a,e,e1> (action : () -> <kokaine/reactive/effects/signal-write,pure|e1> a, root : kokaine/reactive/internal/model/root<e>, wild_ : ()) -> <kokaine/reactive/effects/signal-write,div,exn|e1> a */  {
  return $std_core_hnd.finally_prompt(function() {
       
      var _x_x1_1_10408 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<1975> */ ) {
          return root_1.root_key;
        }, root);
      return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag), function(key_0 /* kokaine/reactive/internal/model/root-key */ ) {
           
          var ev_10593 = $std_core_hnd._evv_at(0);
          var _x22 = $kokaine_reactive_effects.leave_batch_fs__select(ev_10593.hnd);
          return _x22(ev_10593.marker, ev_10593, key_0);
        }, _x_x1_1_10408);
    }, action());
}
 
export function batch(root, action) /* forall<a,e,e1> (root : kokaine/reactive/internal/model/root<e>, action : () -> <kokaine/reactive/effects/signal-write,pure|e1> a) -> <kokaine/reactive/effects/signal-write,pure|e1> a */  {
   
  var _x_x1_10406 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<1975> */ ) {
      return root_0.root_key;
    }, root);
   
  var x_10596 = $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag), function(key /* kokaine/reactive/internal/model/root-key */ ) {
       
      var ev_10599 = $std_core_hnd._evv_at(0);
      var _x23 = $kokaine_reactive_effects.enter_batch_fs__select(ev_10599.hnd);
      return _x23(ev_10599.marker, ev_10599, key);
    }, _x_x1_10406);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_batch_10493(action, root, wild__);
    });
  }
  else {
    return $std_core_hnd.finally_prompt(function() {
         
        var _x_x1_1_10408 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<1975> */ ) {
            return root_1.root_key;
          }, root);
        return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag), function(key_0 /* kokaine/reactive/internal/model/root-key */ ) {
             
            var ev_0_10604 = $std_core_hnd._evv_at(0);
            var _x23 = $kokaine_reactive_effects.leave_batch_fs__select(ev_0_10604.hnd);
            return _x23(ev_0_10604.marker, ev_0_10604, key_0);
          }, _x_x1_1_10408);
      }, action());
  }
}
 
 
// monadic lift
export function _mlift_untrack_10494(action, _y_x10116) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-read,pure|e> a, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-read,div,exn|e> a */  {
  return $std_core_hnd._mask_at(_y_x10116, true, action);
}
 
export function untrack(action) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-read,pure|e> a) -> <kokaine/reactive/effects/signal-read,pure|e> a */  {
  return $kokaine_reactive_effects.signal_read_fs__handle($kokaine_reactive_effects._Hnd_signal_read(1, $std_core_hnd.clause_tail1(function(_pat_x765__20 /* (kokaine/reactive/internal/model/source<_1998>, kokaine/reactive/internal/model/read-mode, maybe<kokaine/reactive/internal/model/derive-producer>) */ ) {
        return $std_core_hnd._open_at3($std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag), function(source_0 /* kokaine/reactive/internal/model/source<2071> */ , mode /* kokaine/reactive/internal/model/read-mode */ , producer_0 /* maybe<kokaine/reactive/internal/model/derive-producer> */ ) {
            return $std_core_hnd._perform3($std_core_hnd._evv_at(0), $kokaine_reactive_effects.read_source_fs__select, source_0, mode, producer_0);
          }, _pat_x765__20.fst, $kokaine_reactive_internal_model.Sample_read, _pat_x765__20.thd);
      }), $std_core_hnd.clause_tail1(function(producer_0_0 /* kokaine/reactive/internal/model/derive-producer */ ) {
        return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag), function(producer_1 /* kokaine/reactive/internal/model/derive-producer */ ) {
             
            var ev_10608 = $std_core_hnd._evv_at(0);
            var _x24 = $kokaine_reactive_effects.validate_derived_fs__select(ev_10608.hnd);
            return _x24(ev_10608.marker, ev_10608, producer_1);
          }, producer_0_0);
      })), function(_res /* 2128 */ ) {
      return _res;
    }, function() {
       
      var x_0_10611 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10116 /* hnd/ev-index */ ) {
          return $std_core_hnd._mask_at(_y_x10116, true, action);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_0_10611, true, action);
      }
    });
}
 
 
// monadic lift
export function _mlift_create_effect_publication_10495(dispose, wild___3) /* forall<e> (dispose : kokaine/reactive/internal/model/disposer<e>, wild_@3 : ()) -> <kokaine/reactive/effects/signal-write,exn,div> kokaine/reactive/internal/model/disposer<e> */  {
  return dispose;
}
 
 
// monadic lift
export function _mlift_create_effect_publication_10496(bootstrap, current, dispose, plane, root, registration) /* forall<_e,e1> (bootstrap : kokaine/reactive/internal/model/work<e1>, current : kokaine/reactive/internal/model/continuation-scope<e1>, dispose : kokaine/reactive/internal/model/disposer<e1>, plane : kokaine/reactive/internal/model/plane<e1>, root : kokaine/reactive/internal/model/root<e1>, registration : kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<e1>>) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/disposer<e1> */  {
   
  var target_10279 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/continuation-scope<2331> */ ) {
      return _this.scope_unlink;
    }, current);
   
  ((target_10279).value = ($std_core_types.Just(function() {
     
    var maybe_10041 = $kokaine_internal_registry.registry_registration_fs_take(registration);
    return (maybe_10041 !== null);
  })));
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_scheduler.queue_work, plane, bootstrap);
   
  var _x_x1_10_10433 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<2331> */ ) {
      return root_1.root_key;
    }, root);
   
  var x_10615 = $std_core_hnd._open_at1(1, function(key /* kokaine/reactive/internal/model/root-key */ ) {
       
      var ev_10617 = $std_core_hnd._evv_at(0);
      var _x25 = $kokaine_reactive_effects.request_flush_fs__select(ev_10617.hnd);
      return _x25(ev_10617.marker, ev_10617, key);
    }, _x_x1_10_10433);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___3 /* () */ ) {
      return dispose;
    });
  }
  else {
    return dispose;
  }
}
 
 
// monadic lift
export function _mlift_create_effect_publication_10497(owner, owner_slot, plane, publish, root, track, wild___0) /* forall<_e,_e1,a,e2> (owner : kokaine/reactive/internal/model/frame<e2>, owner-slot : ref<global,maybe<kokaine/reactive/internal/model/derive-producer>>, plane : kokaine/reactive/internal/model/plane<e2>, publish : (value : a) -> <div,exn|e2> (), root : kokaine/reactive/internal/model/root<e2>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, wild_@0 : ()) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/disposer<e2> */  {
   
  var value_1_10274 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<2331> */ ) {
      return plane_1.plane_current;
    }, plane);
   
  var _x_x4_10423 = value_1_10274.value;
  var _x25 = $std_core_hnd._open_none0(function() {
    return $kokaine_reactive_internal_capture.prepare_trace(root, plane, owner_slot, _x_x4_10423, track, publish);
  });
   
  var _x_x1_5_10426 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<2331> */ ) {
      return frame;
    }, owner);
   
  var _x_x2_1_10427 = $std_core_hnd._open_none1(function(current_0 /* kokaine/reactive/internal/model/continuation-scope<2331> */ ) {
      return $kokaine_reactive_internal_model.Retirement_step(function() {
        return $kokaine_reactive_internal_lifetime.scope_retirement_expand(current_0);
      });
    }, _x25.fst);
   
  var x_10622 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_child, _x_x1_5_10426, _x_x2_1_10427);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(registration /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<2331>> */ ) {
      return _mlift_create_effect_publication_10496(_x25.snd, _x25.fst, _x25.thd, plane, root, registration);
    });
  }
  else {
    return _mlift_create_effect_publication_10496(_x25.snd, _x25.fst, _x25.thd, plane, root, x_10622);
  }
}
 
 
// monadic lift
export function _mlift_create_effect_publication_10498(publish, root, track, wild__) /* forall<_e,_e1,_e2,a,e3> (publish : (value : a) -> <div,exn|e3> (), root : kokaine/reactive/internal/model/root<e3>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, wild_ : ()) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/disposer<e3> */  {
   
  var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<2331> */ ) {
      return root_0.root_effect_plane;
    }, root);
   
  var owner_slot = { value: ($std_core_types.Nothing) };
   
  var value_0_10270 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<2331> */ ) {
      return plane_0.plane_current_frame;
    }, plane);
   
  var owner = value_0_10270.value;
   
  var x_10624 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_scheduler.check_frame_registration, root, owner);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_create_effect_publication_10497(owner, owner_slot, plane, publish, root, track, wild___0);
    });
  }
  else {
    return _mlift_create_effect_publication_10497(owner, owner_slot, plane, publish, root, track, x_10624);
  }
}
 
export function create_effect_publication(root, track, publish) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, publish : (value : a) -> <div,exn|e> ()) -> <kokaine/reactive/effects/signal-write,pure> kokaine/reactive/internal/model/disposer<e> */  {
   
  var x_10626 = $std_core_hnd._open_at1(0, $kokaine_reactive_internal_model.check_not_pure_plane, "effect creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_create_effect_publication_10498(publish, root, track, wild__);
    });
  }
  else {
     
    var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<2331> */ ) {
        return root_0.root_effect_plane;
      }, root);
     
    var owner_slot = { value: ($std_core_types.Nothing) };
     
    var value_0_10270 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<2331> */ ) {
        return plane_0.plane_current_frame;
      }, plane);
     
    var owner = value_0_10270.value;
     
    var x_0_10629 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_scheduler.check_frame_registration, root, owner);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return _mlift_create_effect_publication_10497(owner, owner_slot, plane, publish, root, track, wild___0);
      });
    }
    else {
       
      var value_1_10274 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<2331> */ ) {
          return plane_1.plane_current;
        }, plane);
       
      var _x_x4_10423 = value_1_10274.value;
      var _x26 = $std_core_hnd._open_none0(function() {
        return $kokaine_reactive_internal_capture.prepare_trace(root, plane, owner_slot, _x_x4_10423, track, publish);
      });
       
      var _x_x1_5_10426 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<2331> */ ) {
          return frame;
        }, owner);
       
      var _x_x2_1_10427 = $std_core_hnd._open_none1(function(current_0 /* kokaine/reactive/internal/model/continuation-scope<2331> */ ) {
          return $kokaine_reactive_internal_model.Retirement_step(function() {
            return $kokaine_reactive_internal_lifetime.scope_retirement_expand(current_0);
          });
        }, _x26.fst);
       
      var x_1_10632 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_child, _x_x1_5_10426, _x_x2_1_10427);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(registration /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<2331>> */ ) {
          return _mlift_create_effect_publication_10496(_x26.snd, _x26.fst, _x26.thd, plane, root, registration);
        });
      }
      else {
         
        var target_10279 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/continuation-scope<2331> */ ) {
            return _this.scope_unlink;
          }, _x26.fst);
         
        ((target_10279).value = ($std_core_types.Just(function() {
           
          var maybe_10041 = $kokaine_internal_registry.registry_registration_fs_take(x_1_10632);
          return (maybe_10041 !== null);
        })));
         
        $std_core_hnd._open_none2($kokaine_reactive_internal_scheduler.queue_work, plane, _x26.snd);
         
        var _x_x1_10_10433 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<2331> */ ) {
            return root_1.root_key;
          }, root);
         
        var x_2_10635 = $std_core_hnd._open_at1(1, function(key /* kokaine/reactive/internal/model/root-key */ ) {
             
            var ev_10638 = $std_core_hnd._evv_at(0);
            var _x27 = $kokaine_reactive_effects.request_flush_fs__select(ev_10638.hnd);
            return _x27(ev_10638.marker, ev_10638, key);
          }, _x_x1_10_10433);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(wild___3 /* () */ ) {
            return _x26.thd;
          });
        }
        else {
          return _x26.thd;
        }
      }
    }
  }
}
 
export function create_effect_inner(root, track, apply) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, apply : (value : a) -> <kokaine/reactive/effects/signal-write,pure|e> ()) -> <kokaine/reactive/effects/signal-write,pure> kokaine/reactive/internal/model/disposer<e> */  {
  return create_effect_publication(root, track, function(value /* 2380 */ ) {
      return $kokaine_reactive_internal_handlers.interpret_write(root, function() {
          return apply(value);
        });
    });
}
 
 
// UI integrations can publish host state without installing a fresh
// signal-write interpreter for every value. The closed publication row cannot
// absorb a signal-write instance. The dynamic pure-plane guard also rejects
// writes hidden behind a nested public reactive wrapper. `finally` restores
// that guard for modeled exceptions and ambient final-control exits alike.
export function create_ui_publication_effect(root, track, publish) /* forall<a> (root : kokaine/reactive/internal/model/root<ui>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, publish : (value : a) -> <ui,exn> ()) -> <kokaine/reactive/effects/signal-write,pure> kokaine/reactive/internal/model/disposer<ui> */  {
  return create_effect_publication(root, track, function(value /* 2443 */ ) {
       
      var previous_phase = $std_core_hnd._open_none0($kokaine_reactive_internal_model.enter_pure_plane);
      return $std_core_hnd.finally_prompt(function() {
          return ((($kokaine_reactive_internal_model.pure_plane_depth)).value = previous_phase);
        }, publish(value));
    });
}
 
 
// monadic lift
export function _mlift_commit_derived_10499(source, value, _y_x10132) /* forall<_e,_e1,a> (source : kokaine/reactive/internal/model/source<a>, value : a, bool) -> exn () */  {
  if (_y_x10132) {
    return $std_core_types.Unit;
  }
  else {
     
    var target_10292 = $std_core_hnd._open_none1(function(source_3 /* kokaine/reactive/internal/model/source<2567> */ ) {
        return source_3.source_cell;
      }, source);
     
    ((target_10292).value = value);
     
    var target_0_10295 = $std_core_hnd._open_none1(function(source_4 /* kokaine/reactive/internal/model/source<2567> */ ) {
        return source_4.source_version;
      }, source);
     
    var value_3_10300 = $std_core_hnd._open_none1(function(source_5 /* kokaine/reactive/internal/model/source<2567> */ ) {
        return source_5.source_version;
      }, source);
     
    var x_10298 = value_3_10300.value;
     
    var value_2_10296 = $std_core_types._int_add(x_10298,1);
     
    ((target_0_10295).value = value_2_10296);
    return $std_core_hnd._open_none1(function(source_6 /* kokaine/reactive/internal/model/source<2567> */ ) {
        var _x27 = source_6.source_captures;
        return $kokaine_internal_registry.registry_fs_visit_readonly(_x27, $kokaine_reactive_internal_scheduler.cut_capture);
      }, source);
  }
}
 
 
// monadic lift
export function _mlift_commit_derived_10500(source, value, wild__) /* forall<_e,_e1,a> (source : kokaine/reactive/internal/model/source<a>, value : a, wild_ : ()) -> exn () */  {
   
  var value_0_10288 = $std_core_hnd._open_none1(function(source_1 /* kokaine/reactive/internal/model/source<2567> */ ) {
      return source_1.source_cell;
    }, source);
   
  var previous = value_0_10288.value;
   
  var _x_x0_1_10290 = $std_core_hnd._open_none1(function(source_2 /* kokaine/reactive/internal/model/source<2567> */ ) {
      return source_2.source_equals;
    }, source);
   
  var x_10645 = $std_core_hnd._open_none2(_x_x0_1_10290, previous, value);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10132 /* bool */ ) {
      return _mlift_commit_derived_10499(source, value, _y_x10132);
    });
  }
  else {
    return _mlift_commit_derived_10499(source, value, x_10645);
  }
}
 
export function commit_derived(root, source, value) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, source : kokaine/reactive/internal/model/source<a>, value : a) -> exn () */  {
   
  var x_10647 = $kokaine_reactive_internal_scheduler.check_root(root, $std_core_hnd._open_none1(function(source_0 /* kokaine/reactive/internal/model/source<2567> */ ) {
        return source_0.source_root;
      }, source));
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_commit_derived_10500(source, value, wild__);
    });
  }
  else {
     
    var value_0_10288 = $std_core_hnd._open_none1(function(source_1 /* kokaine/reactive/internal/model/source<2567> */ ) {
        return source_1.source_cell;
      }, source);
     
    var previous = value_0_10288.value;
     
    var _x_x0_1_10290 = $std_core_hnd._open_none1(function(source_2 /* kokaine/reactive/internal/model/source<2567> */ ) {
        return source_2.source_equals;
      }, source);
     
    var x_0_10650 = $std_core_hnd._open_none2(_x_x0_1_10290, previous, value);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10132 /* bool */ ) {
        return _mlift_commit_derived_10499(source, value, _y_x10132);
      });
    }
    else {
      if (x_0_10650) {
        return $std_core_types.Unit;
      }
      else {
         
        var target_10292 = $std_core_hnd._open_none1(function(source_3 /* kokaine/reactive/internal/model/source<2567> */ ) {
            return source_3.source_cell;
          }, source);
         
        ((target_10292).value = value);
         
        var target_0_10295 = $std_core_hnd._open_none1(function(source_4 /* kokaine/reactive/internal/model/source<2567> */ ) {
            return source_4.source_version;
          }, source);
         
        var value_3_10300 = $std_core_hnd._open_none1(function(source_5 /* kokaine/reactive/internal/model/source<2567> */ ) {
            return source_5.source_version;
          }, source);
         
        var x_10298 = value_3_10300.value;
         
        var value_2_10296 = $std_core_types._int_add(x_10298,1);
         
        ((target_0_10295).value = value_2_10296);
        return $std_core_hnd._open_none1(function(source_6 /* kokaine/reactive/internal/model/source<2567> */ ) {
            var _x28 = source_6.source_captures;
            return $kokaine_internal_registry.registry_fs_visit_readonly(_x28, $kokaine_reactive_internal_scheduler.cut_capture);
          }, source);
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_derive_by_inner_10501(producer, source, wild___5) /* forall<a> (producer : kokaine/reactive/internal/model/derive-producer, source : kokaine/reactive/internal/model/source<a>, wild_@5 : ()) -> <kokaine/reactive/effects/signal-write,exn,div> kokaine/reactive/internal/model/memo<a> */  {
  return $kokaine_reactive_internal_model.Memo(source, producer);
}
 
 
// monadic lift
export function _mlift_derive_by_inner_10502(bootstrap, current, derive_plane, producer, root, source, registration) /* forall<_e,a,e1> (bootstrap : kokaine/reactive/internal/model/work<total>, current : kokaine/reactive/internal/model/continuation-scope<total>, derive-plane : kokaine/reactive/internal/model/plane<total>, producer : kokaine/reactive/internal/model/derive-producer, root : kokaine/reactive/internal/model/root<e1>, source : kokaine/reactive/internal/model/source<a>, registration : kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<e1>>) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/memo<a> */  {
   
  var target_0_10322 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/continuation-scope<total> */ ) {
      return _this.scope_unlink;
    }, current);
   
  ((target_0_10322).value = ($std_core_types.Just(function() {
     
    var maybe_10043 = $kokaine_internal_registry.registry_registration_fs_take(registration);
    return (maybe_10043 !== null);
  })));
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_scheduler.queue_work, derive_plane, bootstrap);
   
  var _x_x1_14_10469 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<2873> */ ) {
      return root_2.root_key;
    }, root);
   
  var x_10653 = $std_core_hnd._open_at1(1, function(key /* kokaine/reactive/internal/model/root-key */ ) {
       
      var ev_10655 = $std_core_hnd._evv_at(0);
      var _x29 = $kokaine_reactive_effects.request_flush_fs__select(ev_10655.hnd);
      return _x29(ev_10655.marker, ev_10655, key);
    }, _x_x1_14_10469);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___5 /* () */ ) {
      return $kokaine_reactive_internal_model.Memo(source, producer);
    });
  }
  else {
    return $kokaine_reactive_internal_model.Memo(source, producer);
  }
}
 
 
// monadic lift
export function _mlift_derive_by_inner_10503(bootstrap, current, derive_plane, owner, producer, root, source, structural) /* forall<_e,a,e1> (bootstrap : kokaine/reactive/internal/model/work<total>, current : kokaine/reactive/internal/model/continuation-scope<total>, derive-plane : kokaine/reactive/internal/model/plane<total>, owner : kokaine/reactive/internal/model/frame<e1>, producer : kokaine/reactive/internal/model/derive-producer, root : kokaine/reactive/internal/model/root<e1>, source : kokaine/reactive/internal/model/source<a>, structural : kokaine/reactive/internal/model/retirement-work<e1>) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/memo<a> */  {
   
  var _x_x1_10_10463 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<2873> */ ) {
      return frame;
    }, owner);
   
  var x_10661 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_child, _x_x1_10_10463, structural);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(registration /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<2873>> */ ) {
      return _mlift_derive_by_inner_10502(bootstrap, current, derive_plane, producer, root, source, registration);
    });
  }
  else {
    return _mlift_derive_by_inner_10502(bootstrap, current, derive_plane, producer, root, source, x_10661);
  }
}
 
 
// monadic lift
export function _mlift_derive_by_inner_10504(calculate, effect_plane, owner, root, source, wild___1) /* forall<_e,_e1,_e2,a,e3> (calculate : () -> <kokaine/reactive/effects/signal-read,pure> a, effect-plane : kokaine/reactive/internal/model/plane<e3>, owner : kokaine/reactive/internal/model/frame<e3>, root : kokaine/reactive/internal/model/root<e3>, source : kokaine/reactive/internal/model/source<a>, wild_@1 : ()) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/memo<a> */  {
   
  var derive_plane = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<2873> */ ) {
      return root_1.root_derive_plane;
    }, root);
   
  var owner_slot = { value: ($std_core_types.Nothing) };
   
  var value_1_10313 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<2873> */ ) {
      return plane_0.plane_current;
    }, effect_plane);
   
  var _x_x4_10458 = value_1_10313.value;
  var _x29 = $std_core_hnd._open_none0(function() {
    return $kokaine_reactive_internal_capture.prepare_trace(root, derive_plane, owner_slot, _x_x4_10458, calculate, function(value_2 /* 2872 */ ) {
        return commit_derived(root, source, value_2);
      });
  });
   
  var producer = $kokaine_reactive_internal_model.Derive_producer(derive_plane, _x29.fst, { value: false });
   
  ((owner_slot).value = ($std_core_types.Just(producer)));
   
  var _x_x1_8_10461 = $std_core_hnd._open_none1(function(current_0 /* kokaine/reactive/internal/model/continuation-scope<total> */ ) {
      return $kokaine_reactive_internal_model.Retirement_step(function() {
        return $kokaine_reactive_internal_lifetime.scope_retirement_expand(current_0);
      });
    }, _x29.fst);
   
  var x_10663 = $std_core_hnd._open_none1($kokaine_reactive_internal_lifetime.widen_pure_retirement, _x_x1_8_10461);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(structural /* kokaine/reactive/internal/model/retirement-work<2873> */ ) {
      return _mlift_derive_by_inner_10503(_x29.snd, _x29.fst, derive_plane, owner, producer, root, source, structural);
    });
  }
  else {
    return _mlift_derive_by_inner_10503(_x29.snd, _x29.fst, derive_plane, owner, producer, root, source, x_10663);
  }
}
 
 
// monadic lift
export function _mlift_derive_by_inner_10505(calculate, equals, initial, root, wild___0) /* forall<_e,_e1,_e2,a,e3> (calculate : () -> <kokaine/reactive/effects/signal-read,pure> a, equals : (a, a) -> bool, initial : a, root : kokaine/reactive/internal/model/root<e3>, wild_@0 : ()) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/memo<a> */  {
   
  var source = $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, equals);
   
  var effect_plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<2873> */ ) {
      return root_0.root_effect_plane;
    }, root);
   
  var value_10307 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<2873> */ ) {
      return plane.plane_current_frame;
    }, effect_plane);
   
  var owner = value_10307.value;
   
  var x_10665 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_scheduler.check_frame_registration, root, owner);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___1 /* () */ ) {
      return _mlift_derive_by_inner_10504(calculate, effect_plane, owner, root, source, wild___1);
    });
  }
  else {
    return _mlift_derive_by_inner_10504(calculate, effect_plane, owner, root, source, x_10665);
  }
}
 
 
// monadic lift
export function _mlift_derive_by_inner_10506(calculate, equals, initial, root, wild__) /* forall<_e,_e1,_e2,a,e3> (calculate : () -> <kokaine/reactive/effects/signal-read,pure> a, equals : (a, a) -> bool, initial : a, root : kokaine/reactive/internal/model/root<e3>, wild_ : ()) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/memo<a> */  {
   
  var x_10667 = $std_core_hnd._open_at1(0, $kokaine_reactive_internal_scheduler.check_registration, root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_derive_by_inner_10505(calculate, equals, initial, root, wild___0);
    });
  }
  else {
    return _mlift_derive_by_inner_10505(calculate, equals, initial, root, x_10667);
  }
}
 
export function derive_by_inner(root, initial, calculate, equals) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, initial : a, calculate : () -> <kokaine/reactive/effects/signal-read,pure> a, equals : (a, a) -> bool) -> <kokaine/reactive/effects/signal-write,pure> kokaine/reactive/internal/model/memo<a> */  {
   
  var x_10669 = $std_core_hnd._open_at1(0, $kokaine_reactive_internal_model.check_not_pure_plane, "derivation creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_derive_by_inner_10506(calculate, equals, initial, root, wild__);
    });
  }
  else {
     
    var x_0_10672 = $std_core_hnd._open_at1(0, $kokaine_reactive_internal_scheduler.check_registration, root);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return _mlift_derive_by_inner_10505(calculate, equals, initial, root, wild___0);
      });
    }
    else {
       
      var source = $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, equals);
       
      var effect_plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<2873> */ ) {
          return root_0.root_effect_plane;
        }, root);
       
      var value_10307 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<2873> */ ) {
          return plane.plane_current_frame;
        }, effect_plane);
       
      var owner = value_10307.value;
       
      var x_1_10675 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_scheduler.check_frame_registration, root, owner);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild___1 /* () */ ) {
          return _mlift_derive_by_inner_10504(calculate, effect_plane, owner, root, source, wild___1);
        });
      }
      else {
         
        var derive_plane = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<2873> */ ) {
            return root_1.root_derive_plane;
          }, root);
         
        var owner_slot = { value: ($std_core_types.Nothing) };
         
        var value_1_10313 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<2873> */ ) {
            return plane_0.plane_current;
          }, effect_plane);
         
        var _x_x4_10458 = value_1_10313.value;
        var _x30 = $std_core_hnd._open_none0(function() {
          return $kokaine_reactive_internal_capture.prepare_trace(root, derive_plane, owner_slot, _x_x4_10458, calculate, function(value_2 /* 2872 */ ) {
              return commit_derived(root, source, value_2);
            });
        });
         
        var producer = $kokaine_reactive_internal_model.Derive_producer(derive_plane, _x30.fst, { value: false });
         
        ((owner_slot).value = ($std_core_types.Just(producer)));
         
        var _x_x1_8_10461 = $std_core_hnd._open_none1(function(current_0 /* kokaine/reactive/internal/model/continuation-scope<total> */ ) {
            return $kokaine_reactive_internal_model.Retirement_step(function() {
              return $kokaine_reactive_internal_lifetime.scope_retirement_expand(current_0);
            });
          }, _x30.fst);
         
        var x_2_10678 = $std_core_hnd._open_none1($kokaine_reactive_internal_lifetime.widen_pure_retirement, _x_x1_8_10461);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(structural /* kokaine/reactive/internal/model/retirement-work<2873> */ ) {
            return _mlift_derive_by_inner_10503(_x30.snd, _x30.fst, derive_plane, owner, producer, root, source, structural);
          });
        }
        else {
           
          var _x_x1_10_10463 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<2873> */ ) {
              return frame;
            }, owner);
           
          var x_3_10681 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_child, _x_x1_10_10463, x_2_10678);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(registration /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<2873>> */ ) {
              return _mlift_derive_by_inner_10502(_x30.snd, _x30.fst, derive_plane, producer, root, source, registration);
            });
          }
          else {
             
            var target_0_10322 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/continuation-scope<total> */ ) {
                return _this.scope_unlink;
              }, _x30.fst);
             
            ((target_0_10322).value = ($std_core_types.Just(function() {
               
              var maybe_10043 = $kokaine_internal_registry.registry_registration_fs_take(x_3_10681);
              return (maybe_10043 !== null);
            })));
             
            $std_core_hnd._open_none2($kokaine_reactive_internal_scheduler.queue_work, derive_plane, _x30.snd);
             
            var _x_x1_14_10469 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<2873> */ ) {
                return root_2.root_key;
              }, root);
             
            var x_4_10684 = $std_core_hnd._open_at1(1, function(key /* kokaine/reactive/internal/model/root-key */ ) {
                 
                var ev_10687 = $std_core_hnd._evv_at(0);
                var _x31 = $kokaine_reactive_effects.request_flush_fs__select(ev_10687.hnd);
                return _x31(ev_10687.marker, ev_10687, key);
              }, _x_x1_14_10469);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(wild___5 /* () */ ) {
                return $kokaine_reactive_internal_model.Memo(source, producer);
              });
            }
            else {
              return $kokaine_reactive_internal_model.Memo(source, producer);
            }
          }
        }
      }
    }
  }
}
 
export function derive_by(root, initial, calculate, equals) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, initial : a, calculate : () -> <kokaine/reactive/effects/signal-read,pure> a, equals : (a, a) -> bool) -> <kokaine/reactive/effects/signal-write,pure> kokaine/reactive/internal/model/memo<a> */  {
  return derive_by_inner(root, initial, calculate, equals);
}
 
export function derive(root, initial, calculate, _implicit_fs__lp__eq__eq__rp_) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, initial : a, calculate : () -> <kokaine/reactive/effects/signal-read,pure> a, ?(==) : (a, a) -> bool) -> <kokaine/reactive/effects/signal-write,pure> kokaine/reactive/internal/model/memo<a> */  {
  return derive_by_inner(root, initial, calculate, _implicit_fs__lp__eq__eq__rp_);
}
 
export function derive_always(root, initial, calculate) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, initial : a, calculate : () -> <kokaine/reactive/effects/signal-read,pure> a) -> <kokaine/reactive/effects/signal-write,pure> kokaine/reactive/internal/model/memo<a> */  {
  return derive_by_inner(root, initial, calculate, function(___wildcard_x291__39 /* 3068 */ , ___wildcard_x291__41 /* 3068 */ ) {
      return false;
    });
}
 
 
// monadic lift
export function memo_fs__mlift_get_10507(memo, wild__) /* forall<a> (memo : kokaine/reactive/internal/model/memo<a>, wild_ : ()) -> kokaine/reactive/effects/signal-read a */  {
   
  var source_10053 = $std_core_hnd._open_none1(function(memo_1 /* kokaine/reactive/internal/model/memo<3127> */ ) {
      return memo_1.memo_source;
    }, memo);
   
  var producer_0_10055 = $std_core_types.Just($std_core_hnd._open_none1(function(memo_2 /* kokaine/reactive/internal/model/memo<3127> */ ) {
      return memo_2.memo_producer;
    }, memo));
  return $std_core_hnd._perform3($std_core_hnd._evv_at(0), $kokaine_reactive_effects.read_source_fs__select, source_10053, $kokaine_reactive_internal_model.Track_read, producer_0_10055);
}
 
export function memo_fs_get(memo) /* forall<a> (memo : kokaine/reactive/internal/model/memo<a>) -> kokaine/reactive/effects/signal-read a */  {
   
  var producer_10052 = $std_core_hnd._open_none1(function(memo_0 /* kokaine/reactive/internal/model/memo<3127> */ ) {
      return memo_0.memo_producer;
    }, memo);
   
  var ev_10696 = $std_core_hnd._evv_at(0);
   
  var _x31 = $kokaine_reactive_effects.validate_derived_fs__select(ev_10696.hnd);
  var x_10693 = _x31(ev_10696.marker, ev_10696, producer_10052);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return memo_fs__mlift_get_10507(memo, wild__);
    });
  }
  else {
     
    var source_10053 = $std_core_hnd._open_none1(function(memo_1 /* kokaine/reactive/internal/model/memo<3127> */ ) {
        return memo_1.memo_source;
      }, memo);
     
    var producer_0_10055 = $std_core_types.Just($std_core_hnd._open_none1(function(memo_2 /* kokaine/reactive/internal/model/memo<3127> */ ) {
        return memo_2.memo_producer;
      }, memo));
    return $std_core_hnd._perform3($std_core_hnd._evv_at(0), $kokaine_reactive_effects.read_source_fs__select, source_10053, $kokaine_reactive_internal_model.Track_read, producer_0_10055);
  }
}
 
export function create_effect(root, track, apply) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, apply : (value : a) -> <kokaine/reactive/effects/signal-write,pure|e> ()) -> <kokaine/reactive/effects/signal-write,pure> kokaine/reactive/internal/model/disposer<e> */  {
  return create_effect_publication(root, track, function(value /* 3160 */ ) {
      return $kokaine_reactive_internal_handlers.interpret_write(root, function() {
          return apply(value);
        });
    });
}
 
 
// monadic lift
export function _mlift_register_cleanup_10508(resource, node) /* forall<e> (resource : kokaine/reactive/internal/resource/resource-k<e>, node : kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<e>>) -> exn kokaine/reactive/internal/model/cleanup-registration<e> */  {
  return $kokaine_reactive_internal_model.Cleanup_registration(node, resource);
}
 
 
// monadic lift
export function _mlift_register_cleanup_10509(checkpoint, cleanup, current, plane, root, wild___0) /* forall<e> (checkpoint : maybe<kokaine/reactive/internal/model/continuation-gate>, cleanup : () -> <kokaine/reactive/effects/signal-write,pure|e> (), current : kokaine/reactive/internal/model/frame<e>, plane : kokaine/reactive/internal/model/plane<e>, root : kokaine/reactive/internal/model/root<e>, wild_@0 : ()) -> exn kokaine/reactive/internal/model/cleanup-registration<e> */  {
   
  var resource = $std_core_hnd._open_none1($kokaine_reactive_internal_resource.capture_resource, function() {
      return $kokaine_reactive_internal_lifetime.with_context(plane, checkpoint, current, function() {
          return $kokaine_reactive_internal_handlers.interpret_write(root, cleanup);
        });
    });
   
  var x_10699 = $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_finalizer($std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<3299> */ ) {
        return frame;
      }, current), $kokaine_reactive_internal_model.Retirement_finalizer(function() {
      var _x31 = $std_core_hnd._open_none1($kokaine_reactive_internal_resource.claim_resource, resource);
      if (_x31 === null) {
        return $std_core_types.Unit;
      }
      else {
        return _x31.value();
      }
    }));
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(node /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<3299>> */ ) {
      return $kokaine_reactive_internal_model.Cleanup_registration(node, resource);
    });
  }
  else {
    return $kokaine_reactive_internal_model.Cleanup_registration(x_10699, resource);
  }
}
 
 
// monadic lift
export function _mlift_register_cleanup_10510(cleanup, root, wild__) /* forall<_e,e1> (cleanup : () -> <kokaine/reactive/effects/signal-write,pure|e1> (), root : kokaine/reactive/internal/model/root<e1>, wild_ : ()) -> exn kokaine/reactive/internal/model/cleanup-registration<e1> */  {
   
  var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<3299> */ ) {
      return root_0.root_effect_plane;
    }, root);
   
  var value_10332 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<3299> */ ) {
      return plane_0.plane_current_frame;
    }, plane);
   
  var current = value_10332.value;
   
  var value_0_10334 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<3299> */ ) {
      return plane_1.plane_current;
    }, plane);
   
  var checkpoint = value_0_10334.value;
   
  var x_10703 = $kokaine_reactive_internal_scheduler.check_frame_registration(root, current);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_register_cleanup_10509(checkpoint, cleanup, current, plane, root, wild___0);
    });
  }
  else {
    return _mlift_register_cleanup_10509(checkpoint, cleanup, current, plane, root, x_10703);
  }
}
 
export function register_cleanup(root, cleanup) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, cleanup : () -> <kokaine/reactive/effects/signal-write,pure|e> ()) -> exn kokaine/reactive/internal/model/cleanup-registration<e> */  {
   
  var x_10705 = $kokaine_reactive_internal_model.check_not_pure_plane("cleanup registration");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_register_cleanup_10510(cleanup, root, wild__);
    });
  }
  else {
     
    var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<3299> */ ) {
        return root_0.root_effect_plane;
      }, root);
     
    var value_10332 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<3299> */ ) {
        return plane_0.plane_current_frame;
      }, plane);
     
    var current = value_10332.value;
     
    var value_0_10334 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<3299> */ ) {
        return plane_1.plane_current;
      }, plane);
     
    var checkpoint = value_0_10334.value;
     
    var x_0_10708 = $kokaine_reactive_internal_scheduler.check_frame_registration(root, current);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return _mlift_register_cleanup_10509(checkpoint, cleanup, current, plane, root, wild___0);
      });
    }
    else {
       
      var resource = $std_core_hnd._open_none1($kokaine_reactive_internal_resource.capture_resource, function() {
          return $kokaine_reactive_internal_lifetime.with_context(plane, checkpoint, current, function() {
              return $kokaine_reactive_internal_handlers.interpret_write(root, cleanup);
            });
        });
       
      var x_1_10711 = $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_finalizer($std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<3299> */ ) {
            return frame;
          }, current), $kokaine_reactive_internal_model.Retirement_finalizer(function() {
          var _x31 = $std_core_hnd._open_none1($kokaine_reactive_internal_resource.claim_resource, resource);
          if (_x31 === null) {
            return $std_core_types.Unit;
          }
          else {
            return _x31.value();
          }
        }));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(node /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<3299>> */ ) {
          return $kokaine_reactive_internal_model.Cleanup_registration(node, resource);
        });
      }
      else {
        return $kokaine_reactive_internal_model.Cleanup_registration(x_1_10711, resource);
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_on_cleanup_10511(_pat) /* forall<e> (kokaine/reactive/internal/model/cleanup-registration<e>) -> exn () */  {
  return $std_core_types.Unit;
}
 
export function on_cleanup(root, cleanup) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, cleanup : () -> <kokaine/reactive/effects/signal-write,pure|e> ()) -> exn () */  {
   
  var x_10716 = register_cleanup(root, cleanup);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_pat_1 /* kokaine/reactive/internal/model/cleanup-registration<3323> */ ) {
      return $std_core_types.Unit;
    });
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function cleanup_registration_fs_unregister(registration) /* forall<e> (registration : kokaine/reactive/internal/model/cleanup-registration<e>) -> bool */  {
  var _x32 = registration.cleanup_node;
  var _x31 = $kokaine_internal_registry.registry_registration_fs_take(_x32);
  if (_x31 === null) {
    return false;
  }
  else {
     
    var _x33 = registration.cleanup_resource;
    var maybe_10016 = $kokaine_reactive_internal_resource.claim_resource(_x33);
    return (maybe_10016 !== null);
  }
}