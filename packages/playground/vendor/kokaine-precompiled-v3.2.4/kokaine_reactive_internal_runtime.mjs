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
  return $kokaine_reactive_internal_model.Plane($kokaine_reactive_internal_work_dash_transaction.new_work_queue(), { value: ($std_core_types.Nothing) }, { value: ($std_core_types.Nothing) }, { value: current_frame }, { value: ($std_core_types.Nothing) }, retirement, { value: ($std_core_types.Nil) });
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
export function _mlift_retire_root_now_10494(root, lifetime_finalizers) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, lifetime-finalizers : list<kokaine/reactive/internal/lifetime/retirement<e>>) -> <div,exn|e> () */  {
   
  var _x_x1_31_10381 = $std_core_hnd._open_none1(function(root_17 /* kokaine/reactive/internal/model/root<977> */ ) {
      return root_17.root_lifetime;
    }, root);
  return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/lifetime-owner<977> */ ) {
        return _this_0.lifetime_retirement;
      }, _x_x1_31_10381), lifetime_finalizers);
}
 
 
// This is the non-validating half of root disposal. Besides ordinary public
// disposal, it is used to roll back a root whose construction has not been
// published yet. In that case a batch may still be open, or an initial flush
// may have failed after publishing only a prefix of the queued scopes.
export function retire_root_now(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> <div,exn|e> () */  {
   
  var target_10162 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<977> */ ) {
      return root_0.root_disposing;
    }, root);
   
  ((target_10162).value = true);
   
  var _x_x1_0_10350 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<977> */ ) {
      return root_1.root_lifetime;
    }, root);
   
  var target_0_10165 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<977> */ ) {
      return _this.lifetime_token;
    }, _x_x1_0_10350);
   
  ((target_0_10165).value = ($kokaine_reactive_internal_model.Scope_dead));
   
  $std_core_hnd._open_none1(claim_root_work, root);
   
  var _x_x1_29_10379 = $std_core_hnd._open_none1(function(root_16 /* kokaine/reactive/internal/model/root<977> */ ) {
      return root_16.root_lifetime;
    }, root);
   
  var x_10528 = $std_core_hnd._open_none1(function(owner /* kokaine/reactive/internal/model/lifetime-owner<977> */ ) {
      return $kokaine_reactive_internal_lifetime.collect_retirement_loop($std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
            return $kokaine_reactive_internal_lifetime.lifetime_retirement_expand(owner);
          }), $std_core_types.Nil), $std_core_types.Nil);
    }, _x_x1_29_10379);
   
  function next_10529(lifetime_finalizers) /* (list<kokaine/reactive/internal/lifetime/retirement<977>>) -> <div,exn|977> () */  {
     
    var _x_x1_31_10381 = $std_core_hnd._open_none1(function(root_17_0 /* kokaine/reactive/internal/model/root<977> */ ) {
        return root_17_0.root_lifetime;
      }, root);
    return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/lifetime-owner<977> */ ) {
          return _this_0.lifetime_retirement;
        }, _x_x1_31_10381), lifetime_finalizers);
  }
  if ($std_core_hnd._yielding()) {
    var _x0 = $std_core_hnd.yield_extend(next_10529);
  }
  else {
    var _x0 = next_10529(x_10528);
  }
  return $std_core_hnd.finally_prompt(function() {
       
      var target_1_10170 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<977> */ ) {
          return root_2.root_batch_depth;
        }, root);
       
      ((target_1_10170).value = 0);
       
      var target_2_10173 = $std_core_hnd._open_none1(function(root_3 /* kokaine/reactive/internal/model/root<977> */ ) {
          return root_3.root_flushing;
        }, root);
       
      ((target_2_10173).value = false);
       
      var target_3_10176 = $std_core_hnd._open_none1(function(root_4 /* kokaine/reactive/internal/model/root<977> */ ) {
          return root_4.root_disposed;
        }, root);
       
      ((target_3_10176).value = true);
       
      var target_4_10179 = $std_core_hnd._open_none1(function(root_5 /* kokaine/reactive/internal/model/root<977> */ ) {
          return root_5.root_disposing;
        }, root);
       
      ((target_4_10179).value = false);
       
      var _x_x1_8_10358 = $std_core_hnd._open_none1(function(root_6 /* kokaine/reactive/internal/model/root<977> */ ) {
          return root_6.root_derive_plane;
        }, root);
       
      var _x_x1_7_10357 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<total> */ ) {
          return plane.plane_queue;
        }, _x_x1_8_10358);
       
      $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_queue_fs_clear, _x_x1_7_10357);
       
      var _x_x1_11_10361 = $std_core_hnd._open_none1(function(root_7 /* kokaine/reactive/internal/model/root<977> */ ) {
          return root_7.root_effect_plane;
        }, root);
       
      var _x_x1_10_10360 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<977> */ ) {
          return plane_0.plane_queue;
        }, _x_x1_11_10361);
       
      $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_queue_fs_clear, _x_x1_10_10360);
       
      var _x_x1_13_10363 = $std_core_hnd._open_none1(function(root_8 /* kokaine/reactive/internal/model/root<977> */ ) {
          return root_8.root_derive_plane;
        }, root);
       
      var target_5_10188 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<total> */ ) {
          return plane_1.plane_failed;
        }, _x_x1_13_10363);
       
      ((target_5_10188).value = ($std_core_types.Nil));
       
      var _x_x1_15_10365 = $std_core_hnd._open_none1(function(root_9 /* kokaine/reactive/internal/model/root<977> */ ) {
          return root_9.root_effect_plane;
        }, root);
       
      var target_6_10192 = $std_core_hnd._open_none1(function(plane_2 /* kokaine/reactive/internal/model/plane<977> */ ) {
          return plane_2.plane_failed;
        }, _x_x1_15_10365);
       
      ((target_6_10192).value = ($std_core_types.Nil));
       
      var _x_x1_17_10367 = $std_core_hnd._open_none1(function(root_10 /* kokaine/reactive/internal/model/root<977> */ ) {
          return root_10.root_derive_plane;
        }, root);
       
      var target_7_10196 = $std_core_hnd._open_none1(function(plane_3 /* kokaine/reactive/internal/model/plane<total> */ ) {
          return plane_3.plane_work_group;
        }, _x_x1_17_10367);
       
      ((target_7_10196).value = ($std_core_types.Nothing));
       
      var _x_x1_19_10369 = $std_core_hnd._open_none1(function(root_11 /* kokaine/reactive/internal/model/root<977> */ ) {
          return root_11.root_effect_plane;
        }, root);
       
      var target_8_10200 = $std_core_hnd._open_none1(function(plane_4 /* kokaine/reactive/internal/model/plane<977> */ ) {
          return plane_4.plane_work_group;
        }, _x_x1_19_10369);
       
      ((target_8_10200).value = ($std_core_types.Nothing));
       
      var _x_x1_21_10371 = $std_core_hnd._open_none1(function(root_12 /* kokaine/reactive/internal/model/root<977> */ ) {
          return root_12.root_derive_plane;
        }, root);
       
      var target_9_10204 = $std_core_hnd._open_none1(function(plane_5 /* kokaine/reactive/internal/model/plane<total> */ ) {
          return plane_5.plane_current;
        }, _x_x1_21_10371);
       
      ((target_9_10204).value = ($std_core_types.Nothing));
       
      var _x_x1_23_10373 = $std_core_hnd._open_none1(function(root_13 /* kokaine/reactive/internal/model/root<977> */ ) {
          return root_13.root_effect_plane;
        }, root);
       
      var target_10_10208 = $std_core_hnd._open_none1(function(plane_6 /* kokaine/reactive/internal/model/plane<977> */ ) {
          return plane_6.plane_current;
        }, _x_x1_23_10373);
       
      ((target_10_10208).value = ($std_core_types.Nothing));
       
      var _x_x1_25_10375 = $std_core_hnd._open_none1(function(root_14 /* kokaine/reactive/internal/model/root<977> */ ) {
          return root_14.root_derive_plane;
        }, root);
       
      var target_11_10212 = $std_core_hnd._open_none1(function(plane_7 /* kokaine/reactive/internal/model/plane<total> */ ) {
          return plane_7.plane_draft;
        }, _x_x1_25_10375);
       
      ((target_11_10212).value = ($std_core_types.Nothing));
       
      var _x_x1_27_10377 = $std_core_hnd._open_none1(function(root_15 /* kokaine/reactive/internal/model/root<977> */ ) {
          return root_15.root_effect_plane;
        }, root);
       
      var target_12_10216 = $std_core_hnd._open_none1(function(plane_8 /* kokaine/reactive/internal/model/plane<977> */ ) {
          return plane_8.plane_draft;
        }, _x_x1_27_10377);
      return ((target_12_10216).value = ($std_core_types.Nothing));
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
export function _mlift_create_root_10495(committed, result, root, wild___2) /* forall<_e,a,e1> (committed : ref<global,bool>, result : a, root : kokaine/reactive/internal/model/root<e1>, wild_@2 : ()) -> <div,exn|e1> (kokaine/reactive/internal/model/root<e1>, a) */  {
   
  ((committed).value = true);
  return $std_core_types.Tuple2(root, result);
}
 
 
// monadic lift
export function _mlift_create_root_10496(committed, root, result) /* forall<_e,a,e1> (committed : ref<global,bool>, root : kokaine/reactive/internal/model/root<e1>, result : a) -> <div,exn|e1> (kokaine/reactive/internal/model/root<e1>, a) */  {
   
  var target_0_10231 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<1281> */ ) {
      return root_1.root_batch_depth;
    }, root);
   
  ((target_0_10231).value = 0);
   
  var x_10532 = $kokaine_reactive_internal_scheduler.flush(root);
   
  function next_10533(wild___2) /* (()) -> <div,exn|1281> (kokaine/reactive/internal/model/root<1281>, 1280) */  {
     
    ((committed).value = true);
    return $std_core_types.Tuple2(root, result);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10533);
  }
  else {
    return next_10533(x_10532);
  }
}
 
 
// monadic lift
export function _mlift_create_root_10497(action, wild__) /* forall<_e,_e1,_e2,a,e3> (action : (kokaine/reactive/internal/model/root<e3>) -> <kokaine/reactive/effects/signal-write,pure|e3> a, wild_ : ()) -> <exn|e3> (kokaine/reactive/internal/model/root<e3>, a) */  {
   
  var root = $std_core_hnd._open_none0(fresh_root);
   
  var committed = { value: false };
   
  var target_10228 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<1281> */ ) {
      return root_0.root_batch_depth;
    }, root);
   
  ((target_10228).value = 1);
   
  var x_10540 = $kokaine_reactive_internal_handlers.interpret_write(root, function() {
      return action(root);
    });
  if ($std_core_hnd._yielding()) {
    var _x2 = $std_core_hnd.yield_extend(function(result /* 1280 */ ) {
      return _mlift_create_root_10496(committed, root, result);
    });
  }
  else {
    var _x2 = _mlift_create_root_10496(committed, root, x_10540);
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
   
  var x_10542 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "reactive root creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_create_root_10497(action, wild__);
    });
  }
  else {
     
    var root = $std_core_hnd._open_none0(fresh_root);
     
    var committed = { value: false };
     
    var target_10228 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<1281> */ ) {
        return root_0.root_batch_depth;
      }, root);
     
    ((target_10228).value = 1);
     
    var x_0_10547 = $kokaine_reactive_internal_handlers.interpret_write(root, function() {
        return action(root);
      });
    if ($std_core_hnd._yielding()) {
      var _x4 = $std_core_hnd.yield_extend(function(result /* 1280 */ ) {
        return _mlift_create_root_10496(committed, root, result);
      });
    }
    else {
      var _x4 = _mlift_create_root_10496(committed, root, x_0_10547);
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
export function root_fs__mlift_dispose_10498(root, wild__) /* forall<_e,_e1,e2> (root : kokaine/reactive/internal/model/root<e2>, wild_ : ()) -> <exn|e2> () */  {
   
  var value_10237 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<1565> */ ) {
      return root_0.root_disposed;
    }, root);
  var _x5 = value_10237.value;
  if (_x5) {
    return $std_core_types.Unit;
  }
  else {
     
    var value_0_10239 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<1565> */ ) {
        return root_1.root_disposing;
      }, root);
    var _x6 = value_0_10239.value;
    if (_x6) {
      return $std_core_types.Unit;
    }
    else {
       
      var _x_x1_3_10390 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<1565> */ ) {
          return root_2.root_lifetime;
        }, root);
       
      var _x_x1_2_10389 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<1565> */ ) {
          return _this.lifetime_retirement;
        }, _x_x1_3_10390);
      var _x7 = $std_core_hnd._open_none1($kokaine_reactive_internal_lifetime.retirement_coordinator_fs_request_root_disposal, _x_x1_2_10389);
      if (_x7) {
         
        var target_10244 = $std_core_hnd._open_none1(function(root_3 /* kokaine/reactive/internal/model/root<1565> */ ) {
            return root_3.root_disposing;
          }, root);
        return ((target_10244).value = true);
      }
      else {
         
        var value_2_10247 = $std_core_hnd._open_none1(function(root_4 /* kokaine/reactive/internal/model/root<1565> */ ) {
            return root_4.root_batch_depth;
          }, root);
        var _x8 = $std_core_types._int_gt((value_2_10247.value),0);
        if (_x8) {
          return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
        }
        else {
           
          var value_3_10250 = $std_core_hnd._open_none1(function(root_5 /* kokaine/reactive/internal/model/root<1565> */ ) {
              return root_5.root_flushing;
            }, root);
          var _x9 = value_3_10250.value;
          if (_x9) {
            return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
          }
          else {
             
            var _x_x1_11_10399 = $std_core_hnd._open_none1(function(root_6 /* kokaine/reactive/internal/model/root<1565> */ ) {
                return root_6.root_effect_plane;
              }, root);
             
            var value_4_10254 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<1565> */ ) {
                return plane.plane_current;
              }, _x_x1_11_10399);
             
            var _x_x1_10_10401 = value_4_10254.value;
            var _x10 = $std_core_hnd._open_none1(function(maybe /* maybe<kokaine/reactive/internal/model/continuation-gate> */ ) {
                return (maybe !== null);
              }, _x_x1_10_10401);
            if (_x10) {
              return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
            }
            else {
               
              var _x_x1_15_10404 = $std_core_hnd._open_none1(function(root_7 /* kokaine/reactive/internal/model/root<1565> */ ) {
                  return root_7.root_derive_plane;
                }, root);
               
              var value_5_10259 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<total> */ ) {
                  return plane_0.plane_current;
                }, _x_x1_15_10404);
               
              var _x_x1_14_10406 = value_5_10259.value;
              var _x11 = $std_core_hnd._open_none1(function(maybe_0 /* maybe<kokaine/reactive/internal/model/continuation-gate> */ ) {
                  return (maybe_0 !== null);
                }, _x_x1_14_10406);
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
   
  var x_10549 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "reactive root disposal");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return root_fs__mlift_dispose_10498(root, wild__);
    });
  }
  else {
     
    var value_10237 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<1565> */ ) {
        return root_0.root_disposed;
      }, root);
    var _x12 = value_10237.value;
    if (_x12) {
      return $std_core_types.Unit;
    }
    else {
       
      var value_0_10239 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<1565> */ ) {
          return root_1.root_disposing;
        }, root);
      var _x13 = value_0_10239.value;
      if (_x13) {
        return $std_core_types.Unit;
      }
      else {
         
        var _x_x1_3_10390 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<1565> */ ) {
            return root_2.root_lifetime;
          }, root);
         
        var _x_x1_2_10389 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<1565> */ ) {
            return _this.lifetime_retirement;
          }, _x_x1_3_10390);
        var _x14 = $std_core_hnd._open_none1($kokaine_reactive_internal_lifetime.retirement_coordinator_fs_request_root_disposal, _x_x1_2_10389);
        if (_x14) {
           
          var target_10244 = $std_core_hnd._open_none1(function(root_3 /* kokaine/reactive/internal/model/root<1565> */ ) {
              return root_3.root_disposing;
            }, root);
          return ((target_10244).value = true);
        }
        else {
           
          var value_2_10247 = $std_core_hnd._open_none1(function(root_4 /* kokaine/reactive/internal/model/root<1565> */ ) {
              return root_4.root_batch_depth;
            }, root);
          var _x15 = $std_core_types._int_gt((value_2_10247.value),0);
          if (_x15) {
            return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
          }
          else {
             
            var value_3_10250 = $std_core_hnd._open_none1(function(root_5 /* kokaine/reactive/internal/model/root<1565> */ ) {
                return root_5.root_flushing;
              }, root);
            var _x16 = value_3_10250.value;
            if (_x16) {
              return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
            }
            else {
               
              var _x_x1_11_10399 = $std_core_hnd._open_none1(function(root_6 /* kokaine/reactive/internal/model/root<1565> */ ) {
                  return root_6.root_effect_plane;
                }, root);
               
              var value_4_10254 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<1565> */ ) {
                  return plane.plane_current;
                }, _x_x1_11_10399);
               
              var _x_x1_10_10401 = value_4_10254.value;
              var _x17 = $std_core_hnd._open_none1(function(maybe /* maybe<kokaine/reactive/internal/model/continuation-gate> */ ) {
                  return (maybe !== null);
                }, _x_x1_10_10401);
              if (_x17) {
                return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
              }
              else {
                 
                var _x_x1_15_10404 = $std_core_hnd._open_none1(function(root_7 /* kokaine/reactive/internal/model/root<1565> */ ) {
                    return root_7.root_derive_plane;
                  }, root);
                 
                var value_5_10259 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<total> */ ) {
                    return plane_0.plane_current;
                  }, _x_x1_15_10404);
                 
                var _x_x1_14_10406 = value_5_10259.value;
                var _x18 = $std_core_hnd._open_none1(function(maybe_0 /* maybe<kokaine/reactive/internal/model/continuation-gate> */ ) {
                    return (maybe_0 !== null);
                  }, _x_x1_14_10406);
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
export function _mlift_update_10499(result, wild__) /* forall<a,e> (result : a, wild_ : ()) -> <kokaine/reactive/effects/signal-write,div,exn|e> a */  {
  return result;
}
 
 
// monadic lift
export function _mlift_update_10500(root, result) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, result : a) -> <kokaine/reactive/effects/signal-write,pure|e> a */  {
   
  var _x_x1_10409 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<1642> */ ) {
      return root_1.root_key;
    }, root);
   
  var x_10552 = $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag), function(key /* kokaine/reactive/internal/model/root-key */ ) {
       
      var ev_10554 = $std_core_hnd._evv_at(0);
      var _x20 = $kokaine_reactive_effects.request_flush_fs__select(ev_10554.hnd);
      return _x20(ev_10554.marker, ev_10554, key);
    }, _x_x1_10409);
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
export function _mlift_update_10501(action, root, _y_x10091) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-write,pure|e> a, root : kokaine/reactive/internal/model/root<e>, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write|e> a */  {
  return $std_core_hnd._mask_at(_y_x10091, false, function() {
       
      var x_10559 = action();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(result /* 1641 */ ) {
          return _mlift_update_10500(root, result);
        });
      }
      else {
        return _mlift_update_10500(root, x_10559);
      }
    });
}
 
export function update(root, action) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, action : () -> <kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> a */  {
  return $kokaine_reactive_internal_handlers.dispatch_handled(root, function() {
       
      var x_10561 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10091 /* hnd/ev-index */ ) {
          return _mlift_update_10501(action, root, _y_x10091);
        });
      }
      else {
        return _mlift_update_10501(action, root, x_10561);
      }
    });
}
 
 
// monadic lift
export function _mlift_sample_10502(action, _y_x10097) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-read,pure|e> a, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,kokaine/reactive/effects/signal-read|e> a */  {
  return $std_core_hnd._mask_at(_y_x10097, false, action);
}
 
export function sample(root, action) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, action : () -> <kokaine/reactive/effects/signal-read,pure|e> a) -> <exn|e> a */  {
  return $kokaine_reactive_internal_handlers.dispatch_handled(root, function() {
       
      var x_10563 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10097 /* hnd/ev-index */ ) {
          return $std_core_hnd._mask_at(_y_x10097, false, action);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_10563, false, action);
      }
    });
}
 
 
// monadic lift
export function _mlift_signal_by_10503(equals, initial, root, wild___0) /* forall<a,e> (equals : (a, a) -> bool, initial : a, root : kokaine/reactive/internal/model/root<e>, wild_@0 : ()) -> exn kokaine/reactive/internal/model/signal<a> */  {
  return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, equals);
}
 
 
// monadic lift
export function _mlift_signal_by_10504(equals, initial, root, wild__) /* forall<a,e> (equals : (a, a) -> bool, initial : a, root : kokaine/reactive/internal/model/root<e>, wild_ : ()) -> exn kokaine/reactive/internal/model/signal<a> */  {
   
  var x_10567 = $kokaine_reactive_internal_scheduler.check_registration(root);
   
  function next_10568(wild___0) /* (()) -> exn kokaine/reactive/internal/model/signal<1735> */  {
    return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, equals);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10568);
  }
  else {
    return next_10568(x_10567);
  }
}
 
export function signal_by(root, initial, equals) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, initial : a, equals : (a, a) -> bool) -> exn kokaine/reactive/internal/model/signal<a> */  {
   
  var x_10573 = $kokaine_reactive_internal_model.check_not_pure_plane("signal creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_signal_by_10504(equals, initial, root, wild__);
    });
  }
  else {
     
    var x_0_10576 = $kokaine_reactive_internal_scheduler.check_registration(root);
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
export function _mlift_signal_always_10505(initial, root, wild___0) /* forall<a,e> (initial : a, root : kokaine/reactive/internal/model/root<e>, wild_@0 : ()) -> exn kokaine/reactive/internal/model/signal<a> */  {
  return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, function(___wildcard_x172__29 /* 1883 */ , ___wildcard_x172__31 /* 1883 */ ) {
      return false;
    });
}
 
 
// monadic lift
export function _mlift_signal_always_10506(initial, root, wild__) /* forall<a,e> (initial : a, root : kokaine/reactive/internal/model/root<e>, wild_ : ()) -> exn kokaine/reactive/internal/model/signal<a> */  {
   
  var x_10583 = $kokaine_reactive_internal_scheduler.check_registration(root);
   
  function next_10584(wild___0) /* (()) -> exn kokaine/reactive/internal/model/signal<1883> */  {
    return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, function(___wildcard_x172__29 /* 1883 */ , ___wildcard_x172__31 /* 1883 */ ) {
        return false;
      });
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10584);
  }
  else {
    return next_10584(x_10583);
  }
}
 
export function signal_always(root, initial) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, initial : a) -> exn kokaine/reactive/internal/model/signal<a> */  {
   
  var x_10588 = $kokaine_reactive_internal_model.check_not_pure_plane("signal creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_signal_always_10506(initial, root, wild__);
    });
  }
  else {
     
    var x_0_10591 = $kokaine_reactive_internal_scheduler.check_registration(root);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, function(___wildcard_x172__29 /* 1883 */ , ___wildcard_x172__31 /* 1883 */ ) {
            return false;
          });
      });
    }
    else {
      return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, function(___wildcard_x172__29_0 /* 1883 */ , ___wildcard_x172__31_0 /* 1883 */ ) {
          return false;
        });
    }
  }
}
 
export function signal_fs_get(signal_0) /* forall<a> (signal : kokaine/reactive/internal/model/signal<a>) -> kokaine/reactive/effects/signal-read a */  {
   
  var source_10035 = $std_core_hnd._open_none1(function(signal_1 /* kokaine/reactive/internal/model/signal<1918> */ ) {
      return signal_1;
    }, signal_0);
  return $std_core_hnd._perform3($std_core_hnd._evv_at(0), $kokaine_reactive_effects.read_source_fs__select, source_10035, $kokaine_reactive_internal_model.Track_read, $std_core_types.Nothing);
}
 
export function signal_fs_set(signal_0, value) /* forall<a> (signal : kokaine/reactive/internal/model/signal<a>, value : a) -> kokaine/reactive/effects/signal-write () */  {
   
  var source_10038 = $std_core_hnd._open_none1(function(signal_1 /* kokaine/reactive/internal/model/signal<1946> */ ) {
      return signal_1;
    }, signal_0);
   
  var evx_10597 = $std_core_hnd._evv_at(0);
  var _x20 = $kokaine_reactive_effects.write_source_fs__select(evx_10597.hnd);
  return _x20(evx_10597.marker, evx_10597, source_10038, value);
}
 
export function signal_fs_modify(signal_0, update_0) /* forall<a> (signal : kokaine/reactive/internal/model/signal<a>, update : (a) -> a) -> kokaine/reactive/effects/signal-write () */  {
   
  var source_10040 = $std_core_hnd._open_none1(function(signal_1 /* kokaine/reactive/internal/model/signal<1976> */ ) {
      return signal_1;
    }, signal_0);
   
  var evx_10601 = $std_core_hnd._evv_at(0);
  var _x21 = $kokaine_reactive_effects.modify_source_fs__select(evx_10601.hnd);
  return _x21(evx_10601.marker, evx_10601, source_10040, update_0);
}
 
 
// monadic lift
export function _mlift_batch_10507(action, root, wild__) /* forall<a,e,e1> (action : () -> <kokaine/reactive/effects/signal-write,pure|e1> a, root : kokaine/reactive/internal/model/root<e>, wild_ : ()) -> <kokaine/reactive/effects/signal-write,div,exn|e1> a */  {
  return $std_core_hnd.finally_prompt(function() {
       
      var _x_x1_1_10422 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<2035> */ ) {
          return root_1.root_key;
        }, root);
      return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag), function(key_0 /* kokaine/reactive/internal/model/root-key */ ) {
           
          var ev_10607 = $std_core_hnd._evv_at(0);
          var _x22 = $kokaine_reactive_effects.leave_batch_fs__select(ev_10607.hnd);
          return _x22(ev_10607.marker, ev_10607, key_0);
        }, _x_x1_1_10422);
    }, action());
}
 
export function batch(root, action) /* forall<a,e,e1> (root : kokaine/reactive/internal/model/root<e>, action : () -> <kokaine/reactive/effects/signal-write,pure|e1> a) -> <kokaine/reactive/effects/signal-write,pure|e1> a */  {
   
  var _x_x1_10420 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<2035> */ ) {
      return root_0.root_key;
    }, root);
   
  var x_10610 = $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag), function(key /* kokaine/reactive/internal/model/root-key */ ) {
       
      var ev_10613 = $std_core_hnd._evv_at(0);
      var _x23 = $kokaine_reactive_effects.enter_batch_fs__select(ev_10613.hnd);
      return _x23(ev_10613.marker, ev_10613, key);
    }, _x_x1_10420);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_batch_10507(action, root, wild__);
    });
  }
  else {
    return $std_core_hnd.finally_prompt(function() {
         
        var _x_x1_1_10422 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<2035> */ ) {
            return root_1.root_key;
          }, root);
        return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag), function(key_0 /* kokaine/reactive/internal/model/root-key */ ) {
             
            var ev_0_10618 = $std_core_hnd._evv_at(0);
            var _x23 = $kokaine_reactive_effects.leave_batch_fs__select(ev_0_10618.hnd);
            return _x23(ev_0_10618.marker, ev_0_10618, key_0);
          }, _x_x1_1_10422);
      }, action());
  }
}
 
 
// monadic lift
export function _mlift_untrack_10508(action, _y_x10117) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-read,pure|e> a, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-read,div,exn|e> a */  {
  return $std_core_hnd._mask_at(_y_x10117, true, action);
}
 
export function untrack(action) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-read,pure|e> a) -> <kokaine/reactive/effects/signal-read,pure|e> a */  {
  return $kokaine_reactive_effects.signal_read_fs__handle($kokaine_reactive_effects._Hnd_signal_read(1, $std_core_hnd.clause_tail1(function(_pat_x765__20 /* (kokaine/reactive/internal/model/source<_2058>, kokaine/reactive/internal/model/read-mode, maybe<kokaine/reactive/internal/model/derive-producer>) */ ) {
        return $std_core_hnd._open_at3($std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag), function(source_0 /* kokaine/reactive/internal/model/source<2131> */ , mode /* kokaine/reactive/internal/model/read-mode */ , producer_0 /* maybe<kokaine/reactive/internal/model/derive-producer> */ ) {
            return $std_core_hnd._perform3($std_core_hnd._evv_at(0), $kokaine_reactive_effects.read_source_fs__select, source_0, mode, producer_0);
          }, _pat_x765__20.fst, $kokaine_reactive_internal_model.Sample_read, _pat_x765__20.thd);
      }), $std_core_hnd.clause_tail1(function(producer_0_0 /* kokaine/reactive/internal/model/derive-producer */ ) {
        return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag), function(producer_1 /* kokaine/reactive/internal/model/derive-producer */ ) {
             
            var ev_10622 = $std_core_hnd._evv_at(0);
            var _x24 = $kokaine_reactive_effects.validate_derived_fs__select(ev_10622.hnd);
            return _x24(ev_10622.marker, ev_10622, producer_1);
          }, producer_0_0);
      })), function(_res /* 2188 */ ) {
      return _res;
    }, function() {
       
      var x_0_10625 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10117 /* hnd/ev-index */ ) {
          return $std_core_hnd._mask_at(_y_x10117, true, action);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_0_10625, true, action);
      }
    });
}
 
 
// monadic lift
export function _mlift_create_effect_publication_10509(dispose, wild___3) /* forall<e> (dispose : kokaine/reactive/internal/model/disposer<e>, wild_@3 : ()) -> <kokaine/reactive/effects/signal-write,exn,div> kokaine/reactive/internal/model/disposer<e> */  {
  return dispose;
}
 
 
// monadic lift
export function _mlift_create_effect_publication_10510(bootstrap, current, dispose, plane, root, registration) /* forall<_e,e1> (bootstrap : kokaine/reactive/internal/model/work<e1>, current : kokaine/reactive/internal/model/continuation-scope<e1>, dispose : kokaine/reactive/internal/model/disposer<e1>, plane : kokaine/reactive/internal/model/plane<e1>, root : kokaine/reactive/internal/model/root<e1>, registration : kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<e1>>) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/disposer<e1> */  {
   
  var target_10288 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/continuation-scope<2391> */ ) {
      return _this.scope_unlink;
    }, current);
   
  ((target_10288).value = ($std_core_types.Just(function() {
     
    var maybe_10042 = $kokaine_internal_registry.registry_registration_fs_take(registration);
    return (maybe_10042 !== null);
  })));
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_scheduler.queue_work, plane, bootstrap);
   
  var _x_x1_10_10447 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<2391> */ ) {
      return root_1.root_key;
    }, root);
   
  var x_10629 = $std_core_hnd._open_at1(1, function(key /* kokaine/reactive/internal/model/root-key */ ) {
       
      var ev_10631 = $std_core_hnd._evv_at(0);
      var _x25 = $kokaine_reactive_effects.request_flush_fs__select(ev_10631.hnd);
      return _x25(ev_10631.marker, ev_10631, key);
    }, _x_x1_10_10447);
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
export function _mlift_create_effect_publication_10511(owner, owner_slot, plane, publish, root, track, wild___0) /* forall<_e,_e1,a,e2> (owner : kokaine/reactive/internal/model/frame<e2>, owner-slot : ref<global,maybe<kokaine/reactive/internal/model/derive-producer>>, plane : kokaine/reactive/internal/model/plane<e2>, publish : (value : a) -> <div,exn|e2> (), root : kokaine/reactive/internal/model/root<e2>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, wild_@0 : ()) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/disposer<e2> */  {
   
  var value_1_10283 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<2391> */ ) {
      return plane_1.plane_current;
    }, plane);
   
  var _x_x4_10437 = value_1_10283.value;
  var _x25 = $std_core_hnd._open_none0(function() {
    return $kokaine_reactive_internal_capture.prepare_trace(root, plane, owner_slot, _x_x4_10437, track, publish);
  });
   
  var _x_x1_5_10440 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<2391> */ ) {
      return frame;
    }, owner);
   
  var _x_x2_1_10441 = $std_core_hnd._open_none1(function(current_0 /* kokaine/reactive/internal/model/continuation-scope<2391> */ ) {
      return $kokaine_reactive_internal_model.Retirement_step(function() {
        return $kokaine_reactive_internal_lifetime.scope_retirement_expand(current_0);
      });
    }, _x25.fst);
   
  var x_10636 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_child, _x_x1_5_10440, _x_x2_1_10441);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(registration /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<2391>> */ ) {
      return _mlift_create_effect_publication_10510(_x25.snd, _x25.fst, _x25.thd, plane, root, registration);
    });
  }
  else {
    return _mlift_create_effect_publication_10510(_x25.snd, _x25.fst, _x25.thd, plane, root, x_10636);
  }
}
 
 
// monadic lift
export function _mlift_create_effect_publication_10512(publish, root, track, wild__) /* forall<_e,_e1,_e2,a,e3> (publish : (value : a) -> <div,exn|e3> (), root : kokaine/reactive/internal/model/root<e3>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, wild_ : ()) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/disposer<e3> */  {
   
  var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<2391> */ ) {
      return root_0.root_effect_plane;
    }, root);
   
  var owner_slot = { value: ($std_core_types.Nothing) };
   
  var value_0_10279 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<2391> */ ) {
      return plane_0.plane_current_frame;
    }, plane);
   
  var owner = value_0_10279.value;
   
  var x_10638 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_scheduler.check_frame_registration, root, owner);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_create_effect_publication_10511(owner, owner_slot, plane, publish, root, track, wild___0);
    });
  }
  else {
    return _mlift_create_effect_publication_10511(owner, owner_slot, plane, publish, root, track, x_10638);
  }
}
 
export function create_effect_publication(root, track, publish) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, publish : (value : a) -> <div,exn|e> ()) -> <kokaine/reactive/effects/signal-write,pure> kokaine/reactive/internal/model/disposer<e> */  {
   
  var x_10640 = $std_core_hnd._open_at1(0, $kokaine_reactive_internal_model.check_not_pure_plane, "effect creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_create_effect_publication_10512(publish, root, track, wild__);
    });
  }
  else {
     
    var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<2391> */ ) {
        return root_0.root_effect_plane;
      }, root);
     
    var owner_slot = { value: ($std_core_types.Nothing) };
     
    var value_0_10279 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<2391> */ ) {
        return plane_0.plane_current_frame;
      }, plane);
     
    var owner = value_0_10279.value;
     
    var x_0_10643 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_scheduler.check_frame_registration, root, owner);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return _mlift_create_effect_publication_10511(owner, owner_slot, plane, publish, root, track, wild___0);
      });
    }
    else {
       
      var value_1_10283 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<2391> */ ) {
          return plane_1.plane_current;
        }, plane);
       
      var _x_x4_10437 = value_1_10283.value;
      var _x26 = $std_core_hnd._open_none0(function() {
        return $kokaine_reactive_internal_capture.prepare_trace(root, plane, owner_slot, _x_x4_10437, track, publish);
      });
       
      var _x_x1_5_10440 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<2391> */ ) {
          return frame;
        }, owner);
       
      var _x_x2_1_10441 = $std_core_hnd._open_none1(function(current_0 /* kokaine/reactive/internal/model/continuation-scope<2391> */ ) {
          return $kokaine_reactive_internal_model.Retirement_step(function() {
            return $kokaine_reactive_internal_lifetime.scope_retirement_expand(current_0);
          });
        }, _x26.fst);
       
      var x_1_10646 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_child, _x_x1_5_10440, _x_x2_1_10441);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(registration /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<2391>> */ ) {
          return _mlift_create_effect_publication_10510(_x26.snd, _x26.fst, _x26.thd, plane, root, registration);
        });
      }
      else {
         
        var target_10288 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/continuation-scope<2391> */ ) {
            return _this.scope_unlink;
          }, _x26.fst);
         
        ((target_10288).value = ($std_core_types.Just(function() {
           
          var maybe_10042 = $kokaine_internal_registry.registry_registration_fs_take(x_1_10646);
          return (maybe_10042 !== null);
        })));
         
        $std_core_hnd._open_none2($kokaine_reactive_internal_scheduler.queue_work, plane, _x26.snd);
         
        var _x_x1_10_10447 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<2391> */ ) {
            return root_1.root_key;
          }, root);
         
        var x_2_10649 = $std_core_hnd._open_at1(1, function(key /* kokaine/reactive/internal/model/root-key */ ) {
             
            var ev_10652 = $std_core_hnd._evv_at(0);
            var _x27 = $kokaine_reactive_effects.request_flush_fs__select(ev_10652.hnd);
            return _x27(ev_10652.marker, ev_10652, key);
          }, _x_x1_10_10447);
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
  return create_effect_publication(root, track, function(value /* 2440 */ ) {
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
  return create_effect_publication(root, track, function(value /* 2503 */ ) {
       
      var previous_phase = $std_core_hnd._open_none0($kokaine_reactive_internal_model.enter_pure_plane);
      return $std_core_hnd.finally_prompt(function() {
          return ((($kokaine_reactive_internal_model.pure_plane_depth)).value = previous_phase);
        }, publish(value));
    });
}
 
 
// monadic lift
export function _mlift_commit_derived_10513(source, value, _y_x10133) /* forall<_e,_e1,a> (source : kokaine/reactive/internal/model/source<a>, value : a, bool) -> exn () */  {
  if (_y_x10133) {
    return $std_core_types.Unit;
  }
  else {
     
    var target_10301 = $std_core_hnd._open_none1(function(source_3 /* kokaine/reactive/internal/model/source<2627> */ ) {
        return source_3.source_cell;
      }, source);
     
    ((target_10301).value = value);
     
    var target_0_10304 = $std_core_hnd._open_none1(function(source_4 /* kokaine/reactive/internal/model/source<2627> */ ) {
        return source_4.source_version;
      }, source);
     
    var value_3_10309 = $std_core_hnd._open_none1(function(source_5 /* kokaine/reactive/internal/model/source<2627> */ ) {
        return source_5.source_version;
      }, source);
     
    var x_10307 = value_3_10309.value;
     
    var value_2_10305 = $std_core_types._int_add(x_10307,1);
     
    ((target_0_10304).value = value_2_10305);
    return $std_core_hnd._open_none1(function(source_6 /* kokaine/reactive/internal/model/source<2627> */ ) {
        var _x27 = source_6.source_captures;
        return $kokaine_internal_registry.registry_fs_visit_readonly(_x27, $kokaine_reactive_internal_scheduler.cut_capture);
      }, source);
  }
}
 
 
// monadic lift
export function _mlift_commit_derived_10514(source, value, wild__) /* forall<_e,_e1,a> (source : kokaine/reactive/internal/model/source<a>, value : a, wild_ : ()) -> exn () */  {
   
  var value_0_10297 = $std_core_hnd._open_none1(function(source_1 /* kokaine/reactive/internal/model/source<2627> */ ) {
      return source_1.source_cell;
    }, source);
   
  var previous = value_0_10297.value;
   
  var _x_x0_1_10299 = $std_core_hnd._open_none1(function(source_2 /* kokaine/reactive/internal/model/source<2627> */ ) {
      return source_2.source_equals;
    }, source);
   
  var x_10659 = $std_core_hnd._open_none2(_x_x0_1_10299, previous, value);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10133 /* bool */ ) {
      return _mlift_commit_derived_10513(source, value, _y_x10133);
    });
  }
  else {
    return _mlift_commit_derived_10513(source, value, x_10659);
  }
}
 
export function commit_derived(root, source, value) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, source : kokaine/reactive/internal/model/source<a>, value : a) -> exn () */  {
   
  var x_10661 = $kokaine_reactive_internal_scheduler.check_root(root, $std_core_hnd._open_none1(function(source_0 /* kokaine/reactive/internal/model/source<2627> */ ) {
        return source_0.source_root;
      }, source));
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_commit_derived_10514(source, value, wild__);
    });
  }
  else {
     
    var value_0_10297 = $std_core_hnd._open_none1(function(source_1 /* kokaine/reactive/internal/model/source<2627> */ ) {
        return source_1.source_cell;
      }, source);
     
    var previous = value_0_10297.value;
     
    var _x_x0_1_10299 = $std_core_hnd._open_none1(function(source_2 /* kokaine/reactive/internal/model/source<2627> */ ) {
        return source_2.source_equals;
      }, source);
     
    var x_0_10664 = $std_core_hnd._open_none2(_x_x0_1_10299, previous, value);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10133 /* bool */ ) {
        return _mlift_commit_derived_10513(source, value, _y_x10133);
      });
    }
    else {
      if (x_0_10664) {
        return $std_core_types.Unit;
      }
      else {
         
        var target_10301 = $std_core_hnd._open_none1(function(source_3 /* kokaine/reactive/internal/model/source<2627> */ ) {
            return source_3.source_cell;
          }, source);
         
        ((target_10301).value = value);
         
        var target_0_10304 = $std_core_hnd._open_none1(function(source_4 /* kokaine/reactive/internal/model/source<2627> */ ) {
            return source_4.source_version;
          }, source);
         
        var value_3_10309 = $std_core_hnd._open_none1(function(source_5 /* kokaine/reactive/internal/model/source<2627> */ ) {
            return source_5.source_version;
          }, source);
         
        var x_10307 = value_3_10309.value;
         
        var value_2_10305 = $std_core_types._int_add(x_10307,1);
         
        ((target_0_10304).value = value_2_10305);
        return $std_core_hnd._open_none1(function(source_6 /* kokaine/reactive/internal/model/source<2627> */ ) {
            var _x28 = source_6.source_captures;
            return $kokaine_internal_registry.registry_fs_visit_readonly(_x28, $kokaine_reactive_internal_scheduler.cut_capture);
          }, source);
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_derive_by_inner_10515(producer, source, wild___5) /* forall<a> (producer : kokaine/reactive/internal/model/derive-producer, source : kokaine/reactive/internal/model/source<a>, wild_@5 : ()) -> <kokaine/reactive/effects/signal-write,exn,div> kokaine/reactive/internal/model/memo<a> */  {
  return $kokaine_reactive_internal_model.Memo(source, producer);
}
 
 
// monadic lift
export function _mlift_derive_by_inner_10516(bootstrap, current, derive_plane, producer, root, source, registration) /* forall<_e,a,e1> (bootstrap : kokaine/reactive/internal/model/work<total>, current : kokaine/reactive/internal/model/continuation-scope<total>, derive-plane : kokaine/reactive/internal/model/plane<total>, producer : kokaine/reactive/internal/model/derive-producer, root : kokaine/reactive/internal/model/root<e1>, source : kokaine/reactive/internal/model/source<a>, registration : kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<e1>>) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/memo<a> */  {
   
  var target_0_10332 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/continuation-scope<total> */ ) {
      return _this.scope_unlink;
    }, current);
   
  ((target_0_10332).value = ($std_core_types.Just(function() {
     
    var maybe_10044 = $kokaine_internal_registry.registry_registration_fs_take(registration);
    return (maybe_10044 !== null);
  })));
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_scheduler.queue_work, derive_plane, bootstrap);
   
  var _x_x1_14_10483 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<2941> */ ) {
      return root_2.root_key;
    }, root);
   
  var x_10667 = $std_core_hnd._open_at1(1, function(key /* kokaine/reactive/internal/model/root-key */ ) {
       
      var ev_10669 = $std_core_hnd._evv_at(0);
      var _x29 = $kokaine_reactive_effects.request_flush_fs__select(ev_10669.hnd);
      return _x29(ev_10669.marker, ev_10669, key);
    }, _x_x1_14_10483);
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
export function _mlift_derive_by_inner_10517(bootstrap, current, derive_plane, owner, producer, root, source, structural) /* forall<_e,a,e1> (bootstrap : kokaine/reactive/internal/model/work<total>, current : kokaine/reactive/internal/model/continuation-scope<total>, derive-plane : kokaine/reactive/internal/model/plane<total>, owner : kokaine/reactive/internal/model/frame<e1>, producer : kokaine/reactive/internal/model/derive-producer, root : kokaine/reactive/internal/model/root<e1>, source : kokaine/reactive/internal/model/source<a>, structural : kokaine/reactive/internal/model/retirement-work<e1>) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/memo<a> */  {
   
  var _x_x1_10_10477 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<2941> */ ) {
      return frame;
    }, owner);
   
  var x_10675 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_child, _x_x1_10_10477, structural);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(registration /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<2941>> */ ) {
      return _mlift_derive_by_inner_10516(bootstrap, current, derive_plane, producer, root, source, registration);
    });
  }
  else {
    return _mlift_derive_by_inner_10516(bootstrap, current, derive_plane, producer, root, source, x_10675);
  }
}
 
 
// monadic lift
export function _mlift_derive_by_inner_10518(calculate, effect_plane, owner, root, source, wild___1) /* forall<_e,_e1,_e2,a,e3> (calculate : () -> <kokaine/reactive/effects/signal-read,pure> a, effect-plane : kokaine/reactive/internal/model/plane<e3>, owner : kokaine/reactive/internal/model/frame<e3>, root : kokaine/reactive/internal/model/root<e3>, source : kokaine/reactive/internal/model/source<a>, wild_@1 : ()) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/memo<a> */  {
   
  var derive_plane = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<2941> */ ) {
      return root_1.root_derive_plane;
    }, root);
   
  var owner_slot = { value: ($std_core_types.Nothing) };
   
  var value_1_10322 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<2941> */ ) {
      return plane_0.plane_current;
    }, effect_plane);
   
  var _x_x4_10472 = value_1_10322.value;
  var _x29 = $std_core_hnd._open_none0(function() {
    return $kokaine_reactive_internal_capture.prepare_trace(root, derive_plane, owner_slot, _x_x4_10472, calculate, function(value_2 /* 2940 */ ) {
        return commit_derived(root, source, value_2);
      });
  });
   
  var producer = $kokaine_reactive_internal_model.Derive_producer(derive_plane, _x29.fst, { value: false }, { value: 0 });
   
  ((owner_slot).value = ($std_core_types.Just(producer)));
   
  var _x_x1_8_10475 = $std_core_hnd._open_none1(function(current_0 /* kokaine/reactive/internal/model/continuation-scope<total> */ ) {
      return $kokaine_reactive_internal_model.Retirement_step(function() {
        return $kokaine_reactive_internal_lifetime.scope_retirement_expand(current_0);
      });
    }, _x29.fst);
   
  var x_10677 = $std_core_hnd._open_none1($kokaine_reactive_internal_lifetime.widen_pure_retirement, _x_x1_8_10475);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(structural /* kokaine/reactive/internal/model/retirement-work<2941> */ ) {
      return _mlift_derive_by_inner_10517(_x29.snd, _x29.fst, derive_plane, owner, producer, root, source, structural);
    });
  }
  else {
    return _mlift_derive_by_inner_10517(_x29.snd, _x29.fst, derive_plane, owner, producer, root, source, x_10677);
  }
}
 
 
// monadic lift
export function _mlift_derive_by_inner_10519(calculate, equals, initial, root, wild___0) /* forall<_e,_e1,_e2,a,e3> (calculate : () -> <kokaine/reactive/effects/signal-read,pure> a, equals : (a, a) -> bool, initial : a, root : kokaine/reactive/internal/model/root<e3>, wild_@0 : ()) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/memo<a> */  {
   
  var source = $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, equals);
   
  var effect_plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<2941> */ ) {
      return root_0.root_effect_plane;
    }, root);
   
  var value_10316 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<2941> */ ) {
      return plane.plane_current_frame;
    }, effect_plane);
   
  var owner = value_10316.value;
   
  var x_10679 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_scheduler.check_frame_registration, root, owner);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___1 /* () */ ) {
      return _mlift_derive_by_inner_10518(calculate, effect_plane, owner, root, source, wild___1);
    });
  }
  else {
    return _mlift_derive_by_inner_10518(calculate, effect_plane, owner, root, source, x_10679);
  }
}
 
 
// monadic lift
export function _mlift_derive_by_inner_10520(calculate, equals, initial, root, wild__) /* forall<_e,_e1,_e2,a,e3> (calculate : () -> <kokaine/reactive/effects/signal-read,pure> a, equals : (a, a) -> bool, initial : a, root : kokaine/reactive/internal/model/root<e3>, wild_ : ()) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/memo<a> */  {
   
  var x_10681 = $std_core_hnd._open_at1(0, $kokaine_reactive_internal_scheduler.check_registration, root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_derive_by_inner_10519(calculate, equals, initial, root, wild___0);
    });
  }
  else {
    return _mlift_derive_by_inner_10519(calculate, equals, initial, root, x_10681);
  }
}
 
export function derive_by_inner(root, initial, calculate, equals) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, initial : a, calculate : () -> <kokaine/reactive/effects/signal-read,pure> a, equals : (a, a) -> bool) -> <kokaine/reactive/effects/signal-write,pure> kokaine/reactive/internal/model/memo<a> */  {
   
  var x_10683 = $std_core_hnd._open_at1(0, $kokaine_reactive_internal_model.check_not_pure_plane, "derivation creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_derive_by_inner_10520(calculate, equals, initial, root, wild__);
    });
  }
  else {
     
    var x_0_10686 = $std_core_hnd._open_at1(0, $kokaine_reactive_internal_scheduler.check_registration, root);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return _mlift_derive_by_inner_10519(calculate, equals, initial, root, wild___0);
      });
    }
    else {
       
      var source = $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, equals);
       
      var effect_plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<2941> */ ) {
          return root_0.root_effect_plane;
        }, root);
       
      var value_10316 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<2941> */ ) {
          return plane.plane_current_frame;
        }, effect_plane);
       
      var owner = value_10316.value;
       
      var x_1_10689 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_scheduler.check_frame_registration, root, owner);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild___1 /* () */ ) {
          return _mlift_derive_by_inner_10518(calculate, effect_plane, owner, root, source, wild___1);
        });
      }
      else {
         
        var derive_plane = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<2941> */ ) {
            return root_1.root_derive_plane;
          }, root);
         
        var owner_slot = { value: ($std_core_types.Nothing) };
         
        var value_1_10322 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<2941> */ ) {
            return plane_0.plane_current;
          }, effect_plane);
         
        var _x_x4_10472 = value_1_10322.value;
        var _x30 = $std_core_hnd._open_none0(function() {
          return $kokaine_reactive_internal_capture.prepare_trace(root, derive_plane, owner_slot, _x_x4_10472, calculate, function(value_2 /* 2940 */ ) {
              return commit_derived(root, source, value_2);
            });
        });
         
        var producer = $kokaine_reactive_internal_model.Derive_producer(derive_plane, _x30.fst, { value: false }, { value: 0 });
         
        ((owner_slot).value = ($std_core_types.Just(producer)));
         
        var _x_x1_8_10475 = $std_core_hnd._open_none1(function(current_0 /* kokaine/reactive/internal/model/continuation-scope<total> */ ) {
            return $kokaine_reactive_internal_model.Retirement_step(function() {
              return $kokaine_reactive_internal_lifetime.scope_retirement_expand(current_0);
            });
          }, _x30.fst);
         
        var x_2_10692 = $std_core_hnd._open_none1($kokaine_reactive_internal_lifetime.widen_pure_retirement, _x_x1_8_10475);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(structural /* kokaine/reactive/internal/model/retirement-work<2941> */ ) {
            return _mlift_derive_by_inner_10517(_x30.snd, _x30.fst, derive_plane, owner, producer, root, source, structural);
          });
        }
        else {
           
          var _x_x1_10_10477 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<2941> */ ) {
              return frame;
            }, owner);
           
          var x_3_10695 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_child, _x_x1_10_10477, x_2_10692);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(registration /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<2941>> */ ) {
              return _mlift_derive_by_inner_10516(_x30.snd, _x30.fst, derive_plane, producer, root, source, registration);
            });
          }
          else {
             
            var target_0_10332 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/continuation-scope<total> */ ) {
                return _this.scope_unlink;
              }, _x30.fst);
             
            ((target_0_10332).value = ($std_core_types.Just(function() {
               
              var maybe_10044 = $kokaine_internal_registry.registry_registration_fs_take(x_3_10695);
              return (maybe_10044 !== null);
            })));
             
            $std_core_hnd._open_none2($kokaine_reactive_internal_scheduler.queue_work, derive_plane, _x30.snd);
             
            var _x_x1_14_10483 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<2941> */ ) {
                return root_2.root_key;
              }, root);
             
            var x_4_10698 = $std_core_hnd._open_at1(1, function(key /* kokaine/reactive/internal/model/root-key */ ) {
                 
                var ev_10701 = $std_core_hnd._evv_at(0);
                var _x31 = $kokaine_reactive_effects.request_flush_fs__select(ev_10701.hnd);
                return _x31(ev_10701.marker, ev_10701, key);
              }, _x_x1_14_10483);
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
  return derive_by_inner(root, initial, calculate, function(___wildcard_x293__39 /* 3136 */ , ___wildcard_x293__41 /* 3136 */ ) {
      return false;
    });
}
 
 
// monadic lift
export function memo_fs__mlift_get_10521(memo, wild__) /* forall<a> (memo : kokaine/reactive/internal/model/memo<a>, wild_ : ()) -> kokaine/reactive/effects/signal-read a */  {
   
  var source_10054 = $std_core_hnd._open_none1(function(memo_1 /* kokaine/reactive/internal/model/memo<3195> */ ) {
      return memo_1.memo_source;
    }, memo);
   
  var producer_0_10056 = $std_core_types.Just($std_core_hnd._open_none1(function(memo_2 /* kokaine/reactive/internal/model/memo<3195> */ ) {
      return memo_2.memo_producer;
    }, memo));
  return $std_core_hnd._perform3($std_core_hnd._evv_at(0), $kokaine_reactive_effects.read_source_fs__select, source_10054, $kokaine_reactive_internal_model.Track_read, producer_0_10056);
}
 
export function memo_fs_get(memo) /* forall<a> (memo : kokaine/reactive/internal/model/memo<a>) -> kokaine/reactive/effects/signal-read a */  {
   
  var producer_10053 = $std_core_hnd._open_none1(function(memo_0 /* kokaine/reactive/internal/model/memo<3195> */ ) {
      return memo_0.memo_producer;
    }, memo);
   
  var ev_10710 = $std_core_hnd._evv_at(0);
   
  var _x31 = $kokaine_reactive_effects.validate_derived_fs__select(ev_10710.hnd);
  var x_10707 = _x31(ev_10710.marker, ev_10710, producer_10053);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return memo_fs__mlift_get_10521(memo, wild__);
    });
  }
  else {
     
    var source_10054 = $std_core_hnd._open_none1(function(memo_1 /* kokaine/reactive/internal/model/memo<3195> */ ) {
        return memo_1.memo_source;
      }, memo);
     
    var producer_0_10056 = $std_core_types.Just($std_core_hnd._open_none1(function(memo_2 /* kokaine/reactive/internal/model/memo<3195> */ ) {
        return memo_2.memo_producer;
      }, memo));
    return $std_core_hnd._perform3($std_core_hnd._evv_at(0), $kokaine_reactive_effects.read_source_fs__select, source_10054, $kokaine_reactive_internal_model.Track_read, producer_0_10056);
  }
}
 
export function create_effect(root, track, apply) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, apply : (value : a) -> <kokaine/reactive/effects/signal-write,pure|e> ()) -> <kokaine/reactive/effects/signal-write,pure> kokaine/reactive/internal/model/disposer<e> */  {
  return create_effect_publication(root, track, function(value /* 3228 */ ) {
      return $kokaine_reactive_internal_handlers.interpret_write(root, function() {
          return apply(value);
        });
    });
}
 
 
// monadic lift
export function _mlift_register_cleanup_10522(resource, node) /* forall<e> (resource : kokaine/reactive/internal/resource/resource-k<e>, node : kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<e>>) -> exn kokaine/reactive/internal/model/cleanup-registration<e> */  {
  return $kokaine_reactive_internal_model.Cleanup_registration(node, resource);
}
 
 
// monadic lift
export function _mlift_register_cleanup_10523(checkpoint, cleanup, current, plane, root, wild___0) /* forall<e> (checkpoint : maybe<kokaine/reactive/internal/model/continuation-gate>, cleanup : () -> <kokaine/reactive/effects/signal-write,pure|e> (), current : kokaine/reactive/internal/model/frame<e>, plane : kokaine/reactive/internal/model/plane<e>, root : kokaine/reactive/internal/model/root<e>, wild_@0 : ()) -> exn kokaine/reactive/internal/model/cleanup-registration<e> */  {
   
  var resource = $std_core_hnd._open_none1($kokaine_reactive_internal_resource.capture_resource, function() {
      return $kokaine_reactive_internal_lifetime.with_context(plane, checkpoint, current, function() {
          return $kokaine_reactive_internal_handlers.interpret_write(root, cleanup);
        });
    });
   
  var x_10713 = $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_finalizer($std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<3367> */ ) {
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
    return $std_core_hnd.yield_extend(function(node /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<3367>> */ ) {
      return $kokaine_reactive_internal_model.Cleanup_registration(node, resource);
    });
  }
  else {
    return $kokaine_reactive_internal_model.Cleanup_registration(x_10713, resource);
  }
}
 
 
// monadic lift
export function _mlift_register_cleanup_10524(cleanup, root, wild__) /* forall<_e,e1> (cleanup : () -> <kokaine/reactive/effects/signal-write,pure|e1> (), root : kokaine/reactive/internal/model/root<e1>, wild_ : ()) -> exn kokaine/reactive/internal/model/cleanup-registration<e1> */  {
   
  var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<3367> */ ) {
      return root_0.root_effect_plane;
    }, root);
   
  var value_10342 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<3367> */ ) {
      return plane_0.plane_current_frame;
    }, plane);
   
  var current = value_10342.value;
   
  var value_0_10344 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<3367> */ ) {
      return plane_1.plane_current;
    }, plane);
   
  var checkpoint = value_0_10344.value;
   
  var x_10717 = $kokaine_reactive_internal_scheduler.check_frame_registration(root, current);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_register_cleanup_10523(checkpoint, cleanup, current, plane, root, wild___0);
    });
  }
  else {
    return _mlift_register_cleanup_10523(checkpoint, cleanup, current, plane, root, x_10717);
  }
}
 
export function register_cleanup(root, cleanup) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, cleanup : () -> <kokaine/reactive/effects/signal-write,pure|e> ()) -> exn kokaine/reactive/internal/model/cleanup-registration<e> */  {
   
  var x_10719 = $kokaine_reactive_internal_model.check_not_pure_plane("cleanup registration");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_register_cleanup_10524(cleanup, root, wild__);
    });
  }
  else {
     
    var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<3367> */ ) {
        return root_0.root_effect_plane;
      }, root);
     
    var value_10342 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<3367> */ ) {
        return plane_0.plane_current_frame;
      }, plane);
     
    var current = value_10342.value;
     
    var value_0_10344 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<3367> */ ) {
        return plane_1.plane_current;
      }, plane);
     
    var checkpoint = value_0_10344.value;
     
    var x_0_10722 = $kokaine_reactive_internal_scheduler.check_frame_registration(root, current);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return _mlift_register_cleanup_10523(checkpoint, cleanup, current, plane, root, wild___0);
      });
    }
    else {
       
      var resource = $std_core_hnd._open_none1($kokaine_reactive_internal_resource.capture_resource, function() {
          return $kokaine_reactive_internal_lifetime.with_context(plane, checkpoint, current, function() {
              return $kokaine_reactive_internal_handlers.interpret_write(root, cleanup);
            });
        });
       
      var x_1_10725 = $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_finalizer($std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<3367> */ ) {
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
        return $std_core_hnd.yield_extend(function(node /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<3367>> */ ) {
          return $kokaine_reactive_internal_model.Cleanup_registration(node, resource);
        });
      }
      else {
        return $kokaine_reactive_internal_model.Cleanup_registration(x_1_10725, resource);
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_on_cleanup_10525(_pat) /* forall<e> (kokaine/reactive/internal/model/cleanup-registration<e>) -> exn () */  {
  return $std_core_types.Unit;
}
 
export function on_cleanup(root, cleanup) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, cleanup : () -> <kokaine/reactive/effects/signal-write,pure|e> ()) -> exn () */  {
   
  var x_10730 = register_cleanup(root, cleanup);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_pat_1 /* kokaine/reactive/internal/model/cleanup-registration<3391> */ ) {
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