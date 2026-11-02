// Koka generated module: kokaine/reactive/internal/runtime, koka version: 3.2.9
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
import * as $std_core_bytes from './std_core_bytes.mjs';
import * as $std_core_bslice from './std_core_bslice.mjs';
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
 
 
// // Public dispatch lives at the composition layer; the handler implementation
// // remains isolated in `internal/handlers`.
export function dispatch(root, action) /* forall<a,e> (root : model/root<e>, action : () -> <effects/signal-read,effects/signal-write,pure|e> a) -> <exn|e> a */  {
  return $kokaine_reactive_internal_handlers.dispatch_handled(root, action);
}
 
export function fresh_plane(current_frame, retirement) /* forall<e> (current-frame : model/frame<e>, retirement : model/retirement-coordinator<e>) -> model/plane<e> */  {
  return $kokaine_reactive_internal_model.Plane($kokaine_reactive_internal_work_dash_transaction.cell($kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Nil, $std_core_types.Nil)), $kokaine_reactive_internal_model.cell($std_core_types.Nothing), $kokaine_reactive_internal_model.cell($std_core_types.Nothing), $kokaine_reactive_internal_model.cell(current_frame), $kokaine_reactive_internal_model.cell($std_core_types.Nothing), retirement, $kokaine_reactive_internal_model.cell($std_core_types.Nil));
}
 
 
// // Root retirement detaches local bootstrap groups before invoking cleanup so
// // retained transaction capabilities cannot reclaim their scopes by re-entry.
export function claim_root_work(root) /* forall<e> (root : model/root<e>) -> () */  {
   
  var _x0 = root.root_derive_plane.plane_work_group;
  var derive_group = $kokaine_reactive_internal_model.load(_x0);
   
  var _x1 = root.root_effect_plane.plane_work_group;
  var effect_group = $kokaine_reactive_internal_model.load(_x1);
   
  var _x2 = root.root_derive_plane.plane_work_group;
  $kokaine_reactive_internal_model.store(_x2, $std_core_types.Nothing);
   
  var _x3 = root.root_effect_plane.plane_work_group;
  $kokaine_reactive_internal_model.store(_x3, $std_core_types.Nothing);
   
  if (derive_group === null) {
    $std_core_types.Unit;
  }
  else {
     
    var _pat_1_7 = $kokaine_reactive_internal_work_dash_transaction.work_group_fs_mark_aborted(derive_group.value);
     
    var _x4 = derive_group.value.group_queue;
    $kokaine_reactive_internal_work_dash_transaction.store(_x4, $kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Nil, $std_core_types.Nil));
    var _x4 = derive_group.value.group_rollback;
    $kokaine_reactive_internal_work_dash_transaction.store(_x4, $kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Nil, $std_core_types.Nil));
  }
  if (effect_group === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var _pat_4_7 = $kokaine_reactive_internal_work_dash_transaction.work_group_fs_mark_aborted(effect_group.value);
     
    var _x0 = effect_group.value.group_queue;
    $kokaine_reactive_internal_work_dash_transaction.store(_x0, $kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Nil, $std_core_types.Nil));
    var _x0 = effect_group.value.group_rollback;
    return $kokaine_reactive_internal_work_dash_transaction.store(_x0, $kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Nil, $std_core_types.Nil));
  }
}
 
 
// // monadic lift
export function _mlift_retire_root_now_10530(root, lifetime_finalizers) /* forall<e> (root : model/root<e>, lifetime-finalizers : list<lifetime/retirement<e>>) -> <div,exn|e> () */  {
   
  var _x_x1_45_10376 = $std_core_hnd._open_none1(function(root_17 /* model/root<977> */ ) {
      return root_17.root_lifetime;
    }, root);
  return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this_0 /* model/lifetime-owner<977> */ ) {
        return _this_0.lifetime_retirement;
      }, _x_x1_45_10376), lifetime_finalizers);
}
 
 
// // This is the non-validating half of root disposal. Besides ordinary public
// // disposal, it is used to roll back a root whose construction has not been
// // published yet. In that case a batch may still be open, or an initial flush
// // may have failed after publishing only a prefix of the queued scopes.
export function retire_root_now(root) /* forall<e> (root : model/root<e>) -> <div,exn|e> () */  {
   
  var _x_x1_10316 = $std_core_hnd._open_none1(function(root_0 /* model/root<977> */ ) {
      return root_0.root_disposing;
    }, root);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_10316, true);
   
  var _x_x1_2_10321 = $std_core_hnd._open_none1(function(root_1 /* model/root<977> */ ) {
      return root_1.root_lifetime;
    }, root);
   
  var _x_x1_1_10319 = $std_core_hnd._open_none1(function(_this /* model/lifetime-owner<977> */ ) {
      return _this.lifetime_token;
    }, _x_x1_2_10321);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_1_10319, $kokaine_reactive_internal_model.Scope_dead);
   
  $std_core_hnd._open_none1(claim_root_work, root);
   
  var _x_x1_43_10374 = $std_core_hnd._open_none1(function(root_16 /* model/root<977> */ ) {
      return root_16.root_lifetime;
    }, root);
   
  var x_10565 = $std_core_hnd._open_none1(function(owner /* model/lifetime-owner<977> */ ) {
      return $kokaine_reactive_internal_lifetime.collect_retirement_loop($std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
            return $kokaine_reactive_internal_lifetime.lifetime_retirement_expand(owner);
          }), $std_core_types.Nil), $std_core_types.Nil);
    }, _x_x1_43_10374);
   
  function next_10566(lifetime_finalizers) /* (list<lifetime/retirement<977>>) -> <div,exn|977> () */  {
     
    var _x_x1_45_10376 = $std_core_hnd._open_none1(function(root_17_0 /* model/root<977> */ ) {
        return root_17_0.root_lifetime;
      }, root);
    return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this_0 /* model/lifetime-owner<977> */ ) {
          return _this_0.lifetime_retirement;
        }, _x_x1_45_10376), lifetime_finalizers);
  }
  if ($std_core_hnd._yielding()) {
    var _x1 = $std_core_hnd.yield_extend(next_10566);
  }
  else {
    var _x1 = next_10566(x_10565);
  }
  return $std_core_hnd.finally_prompt(function() {
       
      var _x_x1_5_10324 = $std_core_hnd._open_none1(function(root_2 /* model/root<977> */ ) {
          return root_2.root_batch_depth;
        }, root);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_5_10324, 0);
       
      var _x_x1_7_10327 = $std_core_hnd._open_none1(function(root_3 /* model/root<977> */ ) {
          return root_3.root_flushing;
        }, root);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_7_10327, false);
       
      var _x_x1_9_10330 = $std_core_hnd._open_none1(function(root_4 /* model/root<977> */ ) {
          return root_4.root_disposed;
        }, root);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_9_10330, true);
       
      var _x_x1_11_10333 = $std_core_hnd._open_none1(function(root_5 /* model/root<977> */ ) {
          return root_5.root_disposing;
        }, root);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_11_10333, false);
       
      var _x_x1_14_10337 = $std_core_hnd._open_none1(function(root_6 /* model/root<977> */ ) {
          return root_6.root_derive_plane;
        }, root);
       
      var _x_x1_13_10336 = $std_core_hnd._open_none1(function(plane /* model/plane<total> */ ) {
          return plane.plane_queue;
        }, _x_x1_14_10337);
       
      $std_core_hnd._open_none1(function(target /* work-transaction/work-queue<model/work<total>> */ ) {
          return $kokaine_reactive_internal_work_dash_transaction.store(target, $kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Nil, $std_core_types.Nil));
        }, _x_x1_13_10336);
       
      var _x_x1_17_10340 = $std_core_hnd._open_none1(function(root_7 /* model/root<977> */ ) {
          return root_7.root_effect_plane;
        }, root);
       
      var _x_x1_16_10339 = $std_core_hnd._open_none1(function(plane_0 /* model/plane<977> */ ) {
          return plane_0.plane_queue;
        }, _x_x1_17_10340);
       
      $std_core_hnd._open_none1(function(target_0 /* work-transaction/work-queue<model/work<977>> */ ) {
          return $kokaine_reactive_internal_work_dash_transaction.store(target_0, $kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Nil, $std_core_types.Nil));
        }, _x_x1_16_10339);
       
      var _x_x1_20_10344 = $std_core_hnd._open_none1(function(root_8 /* model/root<977> */ ) {
          return root_8.root_derive_plane;
        }, root);
       
      var _x_x1_19_10342 = $std_core_hnd._open_none1(function(plane_1 /* model/plane<total> */ ) {
          return plane_1.plane_failed;
        }, _x_x1_20_10344);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_19_10342, $std_core_types.Nil);
       
      var _x_x1_23_10348 = $std_core_hnd._open_none1(function(root_9 /* model/root<977> */ ) {
          return root_9.root_effect_plane;
        }, root);
       
      var _x_x1_22_10346 = $std_core_hnd._open_none1(function(plane_2 /* model/plane<977> */ ) {
          return plane_2.plane_failed;
        }, _x_x1_23_10348);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_22_10346, $std_core_types.Nil);
       
      var _x_x1_26_10352 = $std_core_hnd._open_none1(function(root_10 /* model/root<977> */ ) {
          return root_10.root_derive_plane;
        }, root);
       
      var _x_x1_25_10350 = $std_core_hnd._open_none1(function(plane_3 /* model/plane<total> */ ) {
          return plane_3.plane_work_group;
        }, _x_x1_26_10352);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_25_10350, $std_core_types.Nothing);
       
      var _x_x1_29_10356 = $std_core_hnd._open_none1(function(root_11 /* model/root<977> */ ) {
          return root_11.root_effect_plane;
        }, root);
       
      var _x_x1_28_10354 = $std_core_hnd._open_none1(function(plane_4 /* model/plane<977> */ ) {
          return plane_4.plane_work_group;
        }, _x_x1_29_10356);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_28_10354, $std_core_types.Nothing);
       
      var _x_x1_32_10360 = $std_core_hnd._open_none1(function(root_12 /* model/root<977> */ ) {
          return root_12.root_derive_plane;
        }, root);
       
      var _x_x1_31_10358 = $std_core_hnd._open_none1(function(plane_5 /* model/plane<total> */ ) {
          return plane_5.plane_current;
        }, _x_x1_32_10360);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_31_10358, $std_core_types.Nothing);
       
      var _x_x1_35_10364 = $std_core_hnd._open_none1(function(root_13 /* model/root<977> */ ) {
          return root_13.root_effect_plane;
        }, root);
       
      var _x_x1_34_10362 = $std_core_hnd._open_none1(function(plane_6 /* model/plane<977> */ ) {
          return plane_6.plane_current;
        }, _x_x1_35_10364);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_34_10362, $std_core_types.Nothing);
       
      var _x_x1_38_10368 = $std_core_hnd._open_none1(function(root_14 /* model/root<977> */ ) {
          return root_14.root_derive_plane;
        }, root);
       
      var _x_x1_37_10366 = $std_core_hnd._open_none1(function(plane_7 /* model/plane<total> */ ) {
          return plane_7.plane_draft;
        }, _x_x1_38_10368);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_37_10366, $std_core_types.Nothing);
       
      var _x_x1_41_10372 = $std_core_hnd._open_none1(function(root_15 /* model/root<977> */ ) {
          return root_15.root_effect_plane;
        }, root);
       
      var _x_x1_40_10370 = $std_core_hnd._open_none1(function(plane_8 /* model/plane<977> */ ) {
          return plane_8.plane_draft;
        }, _x_x1_41_10372);
      return $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_40_10370, $std_core_types.Nothing);
    }, _x1);
}
 
export function fresh_root() /* forall<e> () -> model/root<e> */  {
   
  var effect_retirement = $kokaine_reactive_internal_model.Retirement_coordinator($kokaine_reactive_internal_model.cell(0), $kokaine_reactive_internal_model.cell(false), $kokaine_reactive_internal_model.cell($std_core_types.Nothing));
   
  var derive_retirement = $kokaine_reactive_internal_model.Retirement_coordinator($kokaine_reactive_internal_model.cell(0), $kokaine_reactive_internal_model.cell(false), $kokaine_reactive_internal_model.cell($std_core_types.Nothing));
   
  var lifetime = $kokaine_reactive_internal_lifetime.new_lifetime_owner($kokaine_reactive_internal_model.Scope_live, effect_retirement);
   
  var derive_frame = $kokaine_reactive_internal_lifetime.new_lifetime_owner($kokaine_reactive_internal_model.Scope_live, derive_retirement);
   
  var root = $kokaine_reactive_internal_model.Root($kokaine_reactive_internal_model.cell(true), fresh_plane(derive_frame, derive_retirement), $kokaine_reactive_internal_model.Plane($kokaine_reactive_internal_work_dash_transaction.cell($kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Nil, $std_core_types.Nil)), $kokaine_reactive_internal_model.cell($std_core_types.Nothing), $kokaine_reactive_internal_model.cell($std_core_types.Nothing), $kokaine_reactive_internal_model.cell(lifetime), $kokaine_reactive_internal_model.cell($std_core_types.Nothing), effect_retirement, $kokaine_reactive_internal_model.cell($std_core_types.Nil)), lifetime, $kokaine_reactive_internal_model.cell(0), $kokaine_reactive_internal_model.cell(false), $kokaine_reactive_internal_model.cell(false), $kokaine_reactive_internal_model.cell(false), $kokaine_reactive_internal_model.cell(true));
   
  var _x3 = effect_retirement;
  var _x2 = _x3.retirement_dispose_root;
  $kokaine_reactive_internal_model.store(_x2, $std_core_types.Just(function() {
      return retire_root_now(root);
    }));
  return root;
}
 
 
// // monadic lift
export function _mlift_create_root_10531(committed, result, root, wild_2) /* forall<a,e> (committed : ref<global,bool>, result : a, root : model/root<e>, wild@2 : ()) -> <div,exn|e> (model/root<e>, a) */  {
   
  var _x_x1_6_10387 = $std_core_hnd._open_none1(function(root_2 /* model/root<1305> */ ) {
      return root_2.root_constructing;
    }, root);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_6_10387, false);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, committed, true);
  return $std_core_types.Tuple2(root, result);
}
 
 
// // monadic lift
export function _mlift_create_root_10532(committed, root, result) /* forall<a,e> (committed : ref<global,bool>, root : model/root<e>, result : a) -> <div,exn|e> (model/root<e>, a) */  {
   
  var _x_x1_4_10384 = $std_core_hnd._open_none1(function(root_1 /* model/root<1305> */ ) {
      return root_1.root_batch_depth;
    }, root);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_4_10384, 0);
   
  var x_10569 = $kokaine_reactive_internal_scheduler.flush(root);
   
  function next_10570(wild_2) /* (()) -> <div,exn|1305> (model/root<1305>, 1304) */  {
     
    var _x_x1_6_10387 = $std_core_hnd._open_none1(function(root_2 /* model/root<1305> */ ) {
        return root_2.root_constructing;
      }, root);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_6_10387, false);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, committed, true);
    return $std_core_types.Tuple2(root, result);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10570);
  }
  else {
    return next_10570(x_10569);
  }
}
 
 
// // monadic lift
export function _mlift_create_root_10533(action, wild) /* forall<a,e> (action : (model/root<e>) -> <effects/signal-write,pure|e> a, wild : ()) -> <exn|e> (model/root<e>, a) */  {
   
  var root = $std_core_hnd._open_none0(fresh_root);
   
  var committed = $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, false);
   
  var _x_x1_2_10381 = $std_core_hnd._open_none1(function(root_0 /* model/root<1305> */ ) {
      return root_0.root_batch_depth;
    }, root);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_2_10381, 1);
   
  var x_10577 = $kokaine_reactive_internal_handlers.interpret_write(root, function() {
      return action(root);
    });
  if ($std_core_hnd._yielding()) {
    var _x3 = $std_core_hnd.yield_extend(function(result /* 1304 */ ) {
      return _mlift_create_root_10532(committed, root, result);
    });
  }
  else {
    var _x3 = _mlift_create_root_10532(committed, root, x_10577);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x2 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, committed);
      if (_x2) {
        return $std_core_types.Unit;
      }
      else {
        return retire_root_now(root);
      }
    }, _x3);
}
 
export function create_root(action) /* forall<a,e> (action : (model/root<e>) -> <effects/signal-write,pure|e> a) -> <exn|e> (model/root<e>, a) */  {
   
  var x_10579 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "reactive root creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild /* () */ ) {
      return _mlift_create_root_10533(action, wild);
    });
  }
  else {
     
    var root = $std_core_hnd._open_none0(fresh_root);
     
    var committed = $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, false);
     
    var _x_x1_2_10381 = $std_core_hnd._open_none1(function(root_0 /* model/root<1305> */ ) {
        return root_0.root_batch_depth;
      }, root);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_2_10381, 1);
     
    var x_0_10584 = $kokaine_reactive_internal_handlers.interpret_write(root, function() {
        return action(root);
      });
    if ($std_core_hnd._yielding()) {
      var _x5 = $std_core_hnd.yield_extend(function(result /* 1304 */ ) {
        return _mlift_create_root_10532(committed, root, result);
      });
    }
    else {
      var _x5 = _mlift_create_root_10532(committed, root, x_0_10584);
    }
    return $std_core_hnd.finally_prompt(function() {
        var _x4 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, committed);
        if (_x4) {
          return $std_core_types.Unit;
        }
        else {
          return retire_root_now(root);
        }
      }, _x5);
  }
}
 
 
// // monadic lift
export function root_fs__mlift_dispose_10534(root, wild) /* forall<e> (root : model/root<e>, wild : ()) -> <exn|e> () */  {
   
  var _x_x1_0_10393 = $std_core_hnd._open_none1(function(root_0 /* model/root<1589> */ ) {
      return root_0.root_disposed;
    }, root);
  var _x6 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_0_10393);
  if (_x6) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x_x1_2_10395 = $std_core_hnd._open_none1(function(root_1 /* model/root<1589> */ ) {
        return root_1.root_disposing;
      }, root);
    var _x7 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_2_10395);
    if (_x7) {
      return $std_core_types.Unit;
    }
    else {
       
      var _x_x1_5_10398 = $std_core_hnd._open_none1(function(root_2 /* model/root<1589> */ ) {
          return root_2.root_lifetime;
        }, root);
       
      var _x_x1_4_10397 = $std_core_hnd._open_none1(function(_this /* model/lifetime-owner<1589> */ ) {
          return _this.lifetime_retirement;
        }, _x_x1_5_10398);
      var _x8 = $std_core_hnd._open_none1(function(coordinator /* model/retirement-coordinator<1589> */ ) {
          var _x10 = coordinator.retirement_depth;
          var _x9 = $std_core_types._int_le(($kokaine_reactive_internal_model.load(_x10)),0);
          if (_x9) {
            return false;
          }
          else {
             
            var _x11 = coordinator.retirement_disposal_requested;
            $kokaine_reactive_internal_model.store(_x11, true);
            return true;
          }
        }, _x_x1_4_10397);
      if (_x8) {
         
        var _x_x1_7_10400 = $std_core_hnd._open_none1(function(root_3 /* model/root<1589> */ ) {
            return root_3.root_disposing;
          }, root);
        return $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_7_10400, true);
      }
      else {
         
        var _x_x1_9_10403 = $std_core_hnd._open_none1(function(root_4 /* model/root<1589> */ ) {
            return root_4.root_batch_depth;
          }, root);
        var _x11 = $std_core_types._int_gt(($std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_9_10403)),0);
        if (_x11) {
          return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
        }
        else {
           
          var _x_x1_12_10407 = $std_core_hnd._open_none1(function(root_5 /* model/root<1589> */ ) {
              return root_5.root_flushing;
            }, root);
          var _x12 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_12_10407);
          if (_x12) {
            return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
          }
          else {
             
            var _x_x1_17_10413 = $std_core_hnd._open_none1(function(root_6 /* model/root<1589> */ ) {
                return root_6.root_effect_plane;
              }, root);
             
            var _x_x1_16_10412 = $std_core_hnd._open_none1(function(plane /* model/plane<1589> */ ) {
                return plane.plane_current;
              }, _x_x1_17_10413);
             
            var _x_x1_15_10411 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_16_10412);
            var _x13 = $std_core_hnd._open_none1(function(maybe /* maybe<model/continuation-gate> */ ) {
                return (maybe !== null);
              }, _x_x1_15_10411);
            if (_x13) {
              return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
            }
            else {
               
              var _x_x1_22_10419 = $std_core_hnd._open_none1(function(root_7 /* model/root<1589> */ ) {
                  return root_7.root_derive_plane;
                }, root);
               
              var _x_x1_21_10418 = $std_core_hnd._open_none1(function(plane_0 /* model/plane<total> */ ) {
                  return plane_0.plane_current;
                }, _x_x1_22_10419);
               
              var _x_x1_20_10417 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_21_10418);
              var _x14 = $std_core_hnd._open_none1(function(maybe_0 /* maybe<model/continuation-gate> */ ) {
                  return (maybe_0 !== null);
                }, _x_x1_20_10417);
              if (_x14) {
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
 
export function root_fs_dispose(root) /* forall<e> (root : model/root<e>) -> <exn|e> () */  {
   
  var x_10586 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "reactive root disposal");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild /* () */ ) {
      return root_fs__mlift_dispose_10534(root, wild);
    });
  }
  else {
     
    var _x_x1_0_10393 = $std_core_hnd._open_none1(function(root_0 /* model/root<1589> */ ) {
        return root_0.root_disposed;
      }, root);
    var _x15 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_0_10393);
    if (_x15) {
      return $std_core_types.Unit;
    }
    else {
       
      var _x_x1_2_10395 = $std_core_hnd._open_none1(function(root_1 /* model/root<1589> */ ) {
          return root_1.root_disposing;
        }, root);
      var _x16 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_2_10395);
      if (_x16) {
        return $std_core_types.Unit;
      }
      else {
         
        var _x_x1_5_10398 = $std_core_hnd._open_none1(function(root_2 /* model/root<1589> */ ) {
            return root_2.root_lifetime;
          }, root);
         
        var _x_x1_4_10397 = $std_core_hnd._open_none1(function(_this /* model/lifetime-owner<1589> */ ) {
            return _this.lifetime_retirement;
          }, _x_x1_5_10398);
        var _x17 = $std_core_hnd._open_none1(function(coordinator /* model/retirement-coordinator<1589> */ ) {
            var _x19 = coordinator.retirement_depth;
            var _x18 = $std_core_types._int_le(($kokaine_reactive_internal_model.load(_x19)),0);
            if (_x18) {
              return false;
            }
            else {
               
              var _x20 = coordinator.retirement_disposal_requested;
              $kokaine_reactive_internal_model.store(_x20, true);
              return true;
            }
          }, _x_x1_4_10397);
        if (_x17) {
           
          var _x_x1_7_10400 = $std_core_hnd._open_none1(function(root_3 /* model/root<1589> */ ) {
              return root_3.root_disposing;
            }, root);
          return $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_7_10400, true);
        }
        else {
           
          var _x_x1_9_10403 = $std_core_hnd._open_none1(function(root_4 /* model/root<1589> */ ) {
              return root_4.root_batch_depth;
            }, root);
          var _x20 = $std_core_types._int_gt(($std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_9_10403)),0);
          if (_x20) {
            return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
          }
          else {
             
            var _x_x1_12_10407 = $std_core_hnd._open_none1(function(root_5 /* model/root<1589> */ ) {
                return root_5.root_flushing;
              }, root);
            var _x21 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_12_10407);
            if (_x21) {
              return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
            }
            else {
               
              var _x_x1_17_10413 = $std_core_hnd._open_none1(function(root_6 /* model/root<1589> */ ) {
                  return root_6.root_effect_plane;
                }, root);
               
              var _x_x1_16_10412 = $std_core_hnd._open_none1(function(plane /* model/plane<1589> */ ) {
                  return plane.plane_current;
                }, _x_x1_17_10413);
               
              var _x_x1_15_10411 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_16_10412);
              var _x22 = $std_core_hnd._open_none1(function(maybe /* maybe<model/continuation-gate> */ ) {
                  return (maybe !== null);
                }, _x_x1_15_10411);
              if (_x22) {
                return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
              }
              else {
                 
                var _x_x1_22_10419 = $std_core_hnd._open_none1(function(root_7 /* model/root<1589> */ ) {
                    return root_7.root_derive_plane;
                  }, root);
                 
                var _x_x1_21_10418 = $std_core_hnd._open_none1(function(plane_0 /* model/plane<total> */ ) {
                    return plane_0.plane_current;
                  }, _x_x1_22_10419);
                 
                var _x_x1_20_10417 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_21_10418);
                var _x23 = $std_core_hnd._open_none1(function(maybe_0 /* maybe<model/continuation-gate> */ ) {
                    return (maybe_0 !== null);
                  }, _x_x1_20_10417);
                if (_x23) {
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
 
export function root_fs_is_disposed(root) /* forall<e> (root : model/root<e>) -> bool */  {
  var _x24 = root.root_disposed;
  return $kokaine_reactive_internal_model.load(_x24);
}
 
 
// // monadic lift
export function _mlift_update_10535(result, wild) /* forall<a,e> (result : a, wild : ()) -> <effects/signal-write,div,exn|e> a */  {
  return result;
}
 
 
// // monadic lift
export function _mlift_update_10536(root, result) /* forall<a,e> (root : model/root<e>, result : a) -> <effects/signal-write,pure|e> a */  {
   
  var _x_x1_10423 = $std_core_hnd._open_none1(function(root_1 /* model/root<1666> */ ) {
      return root_1.root_key;
    }, root);
   
  var x_10589 = $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag), function(key /* model/root-key */ ) {
       
      var ev_10591 = $std_core_hnd._evv_at(0);
      var _x25 = $kokaine_reactive_effects.request_flush_fs__select(ev_10591.hnd);
      return _x25(ev_10591.marker, ev_10591, key);
    }, _x_x1_10423);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild /* () */ ) {
      return result;
    });
  }
  else {
    return result;
  }
}
 
 
// // monadic lift
export function _mlift_update_10537(action, root, _y_x10079) /* forall<a,e> (action : () -> <effects/signal-write,pure|e> a, root : model/root<e>, hnd/ev-index) -> <effects/signal-read,div,exn,effects/signal-write|e> a */  {
  return $std_core_hnd._mask_at(_y_x10079, false, function() {
       
      var x_10596 = action();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(result /* 1665 */ ) {
          return _mlift_update_10536(root, result);
        });
      }
      else {
        return _mlift_update_10536(root, x_10596);
      }
    });
}
 
export function update(root, action) /* forall<a,e> (root : model/root<e>, action : () -> <effects/signal-write,pure|e> a) -> <exn|e> a */  {
  return $kokaine_reactive_internal_handlers.dispatch_handled(root, function() {
       
      var x_10598 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10079 /* hnd/ev-index */ ) {
          return _mlift_update_10537(action, root, _y_x10079);
        });
      }
      else {
        return _mlift_update_10537(action, root, x_10598);
      }
    });
}
 
 
// // monadic lift
export function _mlift_sample_10538(action, _y_x10085) /* forall<a,e> (action : () -> <effects/signal-read,pure|e> a, hnd/ev-index) -> <effects/signal-write,div,exn,effects/signal-read|e> a */  {
  return $std_core_hnd._mask_at(_y_x10085, false, action);
}
 
export function sample(root, action) /* forall<a,e> (root : model/root<e>, action : () -> <effects/signal-read,pure|e> a) -> <exn|e> a */  {
  return $kokaine_reactive_internal_handlers.dispatch_handled(root, function() {
       
      var x_10600 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10085 /* hnd/ev-index */ ) {
          return $std_core_hnd._mask_at(_y_x10085, false, action);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_10600, false, action);
      }
    });
}
 
 
// // monadic lift
export function _mlift_signal_by_10539(equals, initial, root, wild_0) /* forall<a,e> (equals : (a, a) -> bool, initial : a, root : model/root<e>, wild@0 : ()) -> exn model/signal<a> */  {
  return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, equals);
}
 
 
// // monadic lift
export function _mlift_signal_by_10540(equals, initial, root, wild) /* forall<a,e> (equals : (a, a) -> bool, initial : a, root : model/root<e>, wild : ()) -> exn model/signal<a> */  {
   
  var x_10604 = $kokaine_reactive_internal_scheduler.check_registration(root);
   
  function next_10605(wild_0) /* (()) -> exn model/signal<1759> */  {
    return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, equals);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10605);
  }
  else {
    return next_10605(x_10604);
  }
}
 
export function signal_by(root, initial, equals) /* forall<a,e> (root : model/root<e>, initial : a, equals : (a, a) -> bool) -> exn model/signal<a> */  {
   
  var x_10610 = $kokaine_reactive_internal_model.check_not_pure_plane("signal creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild /* () */ ) {
      return _mlift_signal_by_10540(equals, initial, root, wild);
    });
  }
  else {
     
    var x_0_10613 = $kokaine_reactive_internal_scheduler.check_registration(root);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild_0 /* () */ ) {
        return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, equals);
      });
    }
    else {
      return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, equals);
    }
  }
}
 
export function signal(root, initial, _implicit_fs__lp__eq__eq__rp_) /* forall<a,e> (root : model/root<e>, initial : a, ?(==) : (a, a) -> bool) -> exn model/signal<a> */  {
  return signal_by(root, initial, _implicit_fs__lp__eq__eq__rp_);
}
 
 
// // monadic lift
export function _mlift_signal_always_10541(initial, root, wild_0) /* forall<a,e> (initial : a, root : model/root<e>, wild@0 : ()) -> exn model/signal<a> */  {
  return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, function(___wildcard_x173__29 /* 1907 */ , ___wildcard_x173__31 /* 1907 */ ) {
      return false;
    });
}
 
 
// // monadic lift
export function _mlift_signal_always_10542(initial, root, wild) /* forall<a,e> (initial : a, root : model/root<e>, wild : ()) -> exn model/signal<a> */  {
   
  var x_10620 = $kokaine_reactive_internal_scheduler.check_registration(root);
   
  function next_10621(wild_0) /* (()) -> exn model/signal<1907> */  {
    return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, function(___wildcard_x173__29 /* 1907 */ , ___wildcard_x173__31 /* 1907 */ ) {
        return false;
      });
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10621);
  }
  else {
    return next_10621(x_10620);
  }
}
 
export function signal_always(root, initial) /* forall<a,e> (root : model/root<e>, initial : a) -> exn model/signal<a> */  {
   
  var x_10625 = $kokaine_reactive_internal_model.check_not_pure_plane("signal creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild /* () */ ) {
      return _mlift_signal_always_10542(initial, root, wild);
    });
  }
  else {
     
    var x_0_10628 = $kokaine_reactive_internal_scheduler.check_registration(root);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild_0 /* () */ ) {
        return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, function(___wildcard_x173__29 /* 1907 */ , ___wildcard_x173__31 /* 1907 */ ) {
            return false;
          });
      });
    }
    else {
      return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, function(___wildcard_x173__29_0 /* 1907 */ , ___wildcard_x173__31_0 /* 1907 */ ) {
          return false;
        });
    }
  }
}
 
export function signal_fs_get(signal_0) /* forall<a> (signal : model/signal<a>) -> effects/signal-read a */  {
   
  var source_10022 = $std_core_hnd._open_none1(function(signal_1 /* model/signal<1942> */ ) {
      return signal_1;
    }, signal_0);
  return $std_core_hnd._perform3($std_core_hnd._evv_at(0), $kokaine_reactive_effects.read_source_fs__select, source_10022, $kokaine_reactive_internal_model.Track_read, $std_core_types.Nothing);
}
 
export function signal_fs_set(signal_0, value) /* forall<a> (signal : model/signal<a>, value : a) -> effects/signal-write () */  {
   
  var source_10025 = $std_core_hnd._open_none1(function(signal_1 /* model/signal<1970> */ ) {
      return signal_1;
    }, signal_0);
   
  var evx_10634 = $std_core_hnd._evv_at(0);
  var _x25 = $kokaine_reactive_effects.write_source_fs__select(evx_10634.hnd);
  return _x25(evx_10634.marker, evx_10634, source_10025, value);
}
 
export function signal_fs_modify(signal_0, update_0) /* forall<a> (signal : model/signal<a>, update : (a) -> a) -> effects/signal-write () */  {
   
  var source_10027 = $std_core_hnd._open_none1(function(signal_1 /* model/signal<2000> */ ) {
      return signal_1;
    }, signal_0);
   
  var evx_10638 = $std_core_hnd._evv_at(0);
  var _x26 = $kokaine_reactive_effects.modify_source_fs__select(evx_10638.hnd);
  return _x26(evx_10638.marker, evx_10638, source_10027, update_0);
}
 
 
// // monadic lift
export function _mlift_batch_10543(action, root, wild) /* forall<a,e,e1> (action : () -> <effects/signal-write,pure|e1> a, root : model/root<e>, wild : ()) -> <effects/signal-write,div,exn|e1> a */  {
  return $std_core_hnd.finally_prompt(function() {
       
      var _x_x1_1_10436 = $std_core_hnd._open_none1(function(root_1 /* model/root<2059> */ ) {
          return root_1.root_key;
        }, root);
      return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag), function(key_0 /* model/root-key */ ) {
           
          var ev_10644 = $std_core_hnd._evv_at(0);
          var _x27 = $kokaine_reactive_effects.leave_batch_fs__select(ev_10644.hnd);
          return _x27(ev_10644.marker, ev_10644, key_0);
        }, _x_x1_1_10436);
    }, action());
}
 
export function batch(root, action) /* forall<a,e,e1> (root : model/root<e>, action : () -> <effects/signal-write,pure|e1> a) -> <effects/signal-write,pure|e1> a */  {
   
  var _x_x1_10434 = $std_core_hnd._open_none1(function(root_0 /* model/root<2059> */ ) {
      return root_0.root_key;
    }, root);
   
  var x_10647 = $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag), function(key /* model/root-key */ ) {
       
      var ev_10650 = $std_core_hnd._evv_at(0);
      var _x28 = $kokaine_reactive_effects.enter_batch_fs__select(ev_10650.hnd);
      return _x28(ev_10650.marker, ev_10650, key);
    }, _x_x1_10434);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild /* () */ ) {
      return _mlift_batch_10543(action, root, wild);
    });
  }
  else {
    return $std_core_hnd.finally_prompt(function() {
         
        var _x_x1_1_10436 = $std_core_hnd._open_none1(function(root_1 /* model/root<2059> */ ) {
            return root_1.root_key;
          }, root);
        return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag), function(key_0 /* model/root-key */ ) {
             
            var ev_0_10655 = $std_core_hnd._evv_at(0);
            var _x28 = $kokaine_reactive_effects.leave_batch_fs__select(ev_0_10655.hnd);
            return _x28(ev_0_10655.marker, ev_0_10655, key_0);
          }, _x_x1_1_10436);
      }, action());
  }
}
 
 
// // monadic lift
export function _mlift_untrack_10544(action, _y_x10105) /* forall<a,e> (action : () -> <effects/signal-read,pure|e> a, hnd/ev-index) -> <effects/signal-read,effects/signal-read,div,exn|e> a */  {
  return $std_core_hnd._mask_at(_y_x10105, true, action);
}
 
export function untrack(action) /* forall<a,e> (action : () -> <effects/signal-read,pure|e> a) -> <effects/signal-read,pure|e> a */  {
  return $kokaine_reactive_effects.signal_read_fs__handle($kokaine_reactive_effects._Hnd_signal_read(1, $std_core_hnd.clause_tail1(function(_pat_x783__20 /* (model/source<_2082>, model/read-mode, maybe<model/derive-producer>) */ ) {
        return $std_core_hnd._open_at3($std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag), function(source_0 /* model/source<2155> */ , mode /* model/read-mode */ , producer_0 /* maybe<model/derive-producer> */ ) {
            return $std_core_hnd._perform3($std_core_hnd._evv_at(0), $kokaine_reactive_effects.read_source_fs__select, source_0, mode, producer_0);
          }, _pat_x783__20.fst, $kokaine_reactive_internal_model.Sample_read, _pat_x783__20.thd);
      }), $std_core_hnd.clause_tail1(function(producer_0_0 /* model/derive-producer */ ) {
        return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag), function(producer_1 /* model/derive-producer */ ) {
             
            var ev_10659 = $std_core_hnd._evv_at(0);
            var _x29 = $kokaine_reactive_effects.validate_derived_fs__select(ev_10659.hnd);
            return _x29(ev_10659.marker, ev_10659, producer_1);
          }, producer_0_0);
      })), function(_res /* 2212 */ ) {
      return _res;
    }, function() {
       
      var x_0_10662 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10105 /* hnd/ev-index */ ) {
          return $std_core_hnd._mask_at(_y_x10105, true, action);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_0_10662, true, action);
      }
    });
}
 
 
// // monadic lift
export function _mlift_create_effect_publication_10545(dispose, wild_3) /* forall<e> (dispose : model/disposer<e>, wild@3 : ()) -> <effects/signal-write,exn,div> model/disposer<e> */  {
  return dispose;
}
 
 
// // monadic lift
export function _mlift_create_effect_publication_10546(bootstrap, current, dispose, plane, root, registration) /* forall<e> (bootstrap : model/work<e>, current : model/continuation-scope<e>, dispose : model/disposer<e>, plane : model/plane<e>, root : model/root<e>, registration : internal/registry/registry-registration<model/retirement-work<e>>) -> <exn,effects/signal-write,div> model/disposer<e> */  {
   
  var _x_x1_11_10461 = $std_core_hnd._open_none1(function(_this /* model/continuation-scope<2415> */ ) {
      return _this.scope_unlink;
    }, current);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_11_10461, $std_core_types.Just(function() {
       
      var maybe_10029 = $kokaine_internal_registry.registry_registration_fs_take(registration);
      return (maybe_10029 !== null);
    }));
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_scheduler.queue_work, plane, bootstrap);
   
  var _x_x1_14_10466 = $std_core_hnd._open_none1(function(root_1 /* model/root<2415> */ ) {
      return root_1.root_key;
    }, root);
   
  var x_10666 = $std_core_hnd._open_at1(1, function(key /* model/root-key */ ) {
       
      var ev_10668 = $std_core_hnd._evv_at(0);
      var _x30 = $kokaine_reactive_effects.request_flush_fs__select(ev_10668.hnd);
      return _x30(ev_10668.marker, ev_10668, key);
    }, _x_x1_14_10466);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild_3 /* () */ ) {
      return dispose;
    });
  }
  else {
    return dispose;
  }
}
 
 
// // monadic lift
export function _mlift_create_effect_publication_10547(owner, owner_slot, plane, publish, root, track, wild_0) /* forall<a,e> (owner : model/frame<e>, owner-slot : ref<global,maybe<model/derive-producer>>, plane : model/plane<e>, publish : (value : a) -> <div,exn|e> (), root : model/root<e>, track : () -> <effects/signal-read,pure> a, wild@0 : ()) -> <exn,effects/signal-write,div> model/disposer<e> */  {
   
  var _x_x1_6_10455 = $std_core_hnd._open_none1(function(plane_1 /* model/plane<2415> */ ) {
      return plane_1.plane_current;
    }, plane);
   
  var _x_x4_10452 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_6_10455);
  var _x30 = $std_core_hnd._open_none0(function() {
    return $kokaine_reactive_internal_capture.prepare_trace(root, plane, owner_slot, _x_x4_10452, track, publish);
  });
   
  var _x_x1_8_10457 = $std_core_hnd._open_none1(function(frame /* model/frame<2415> */ ) {
      return frame;
    }, owner);
   
  var _x_x2_1_10458 = $std_core_hnd._open_none1(function(current_0 /* model/continuation-scope<2415> */ ) {
      return $kokaine_reactive_internal_model.Retirement_step(function() {
        return $kokaine_reactive_internal_lifetime.scope_retirement_expand(current_0);
      });
    }, _x30.fst);
   
  var x_10673 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_child, _x_x1_8_10457, _x_x2_1_10458);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(registration /* internal/registry/registry-registration<model/retirement-work<2415>> */ ) {
      return _mlift_create_effect_publication_10546(_x30.snd, _x30.fst, _x30.thd, plane, root, registration);
    });
  }
  else {
    return _mlift_create_effect_publication_10546(_x30.snd, _x30.fst, _x30.thd, plane, root, x_10673);
  }
}
 
 
// // monadic lift
export function _mlift_create_effect_publication_10548(publish, root, track, wild) /* forall<a,e> (publish : (value : a) -> <div,exn|e> (), root : model/root<e>, track : () -> <effects/signal-read,pure> a, wild : ()) -> <exn,effects/signal-write,div> model/disposer<e> */  {
   
  var plane = $std_core_hnd._open_none1(function(root_0 /* model/root<2415> */ ) {
      return root_0.root_effect_plane;
    }, root);
   
  var owner_slot = $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $std_core_types.Nothing);
   
  var _x_x1_2_10445 = $std_core_hnd._open_none1(function(plane_0 /* model/plane<2415> */ ) {
      return plane_0.plane_current_frame;
    }, plane);
   
  var owner = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_2_10445);
   
  var x_10675 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_scheduler.check_frame_registration, root, owner);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild_0 /* () */ ) {
      return _mlift_create_effect_publication_10547(owner, owner_slot, plane, publish, root, track, wild_0);
    });
  }
  else {
    return _mlift_create_effect_publication_10547(owner, owner_slot, plane, publish, root, track, x_10675);
  }
}
 
export function create_effect_publication(root, track, publish) /* forall<a,e> (root : model/root<e>, track : () -> <effects/signal-read,pure> a, publish : (value : a) -> <div,exn|e> ()) -> <effects/signal-write,pure> model/disposer<e> */  {
   
  var x_10677 = $std_core_hnd._open_at1(0, $kokaine_reactive_internal_model.check_not_pure_plane, "effect creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild /* () */ ) {
      return _mlift_create_effect_publication_10548(publish, root, track, wild);
    });
  }
  else {
     
    var plane = $std_core_hnd._open_none1(function(root_0 /* model/root<2415> */ ) {
        return root_0.root_effect_plane;
      }, root);
     
    var owner_slot = $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $std_core_types.Nothing);
     
    var _x_x1_2_10445 = $std_core_hnd._open_none1(function(plane_0 /* model/plane<2415> */ ) {
        return plane_0.plane_current_frame;
      }, plane);
     
    var owner = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_2_10445);
     
    var x_0_10680 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_scheduler.check_frame_registration, root, owner);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild_0 /* () */ ) {
        return _mlift_create_effect_publication_10547(owner, owner_slot, plane, publish, root, track, wild_0);
      });
    }
    else {
       
      var _x_x1_6_10455 = $std_core_hnd._open_none1(function(plane_1 /* model/plane<2415> */ ) {
          return plane_1.plane_current;
        }, plane);
       
      var _x_x4_10452 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_6_10455);
      var _x31 = $std_core_hnd._open_none0(function() {
        return $kokaine_reactive_internal_capture.prepare_trace(root, plane, owner_slot, _x_x4_10452, track, publish);
      });
       
      var _x_x1_8_10457 = $std_core_hnd._open_none1(function(frame /* model/frame<2415> */ ) {
          return frame;
        }, owner);
       
      var _x_x2_1_10458 = $std_core_hnd._open_none1(function(current_0 /* model/continuation-scope<2415> */ ) {
          return $kokaine_reactive_internal_model.Retirement_step(function() {
            return $kokaine_reactive_internal_lifetime.scope_retirement_expand(current_0);
          });
        }, _x31.fst);
       
      var x_1_10683 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_child, _x_x1_8_10457, _x_x2_1_10458);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(registration /* internal/registry/registry-registration<model/retirement-work<2415>> */ ) {
          return _mlift_create_effect_publication_10546(_x31.snd, _x31.fst, _x31.thd, plane, root, registration);
        });
      }
      else {
         
        var _x_x1_11_10461 = $std_core_hnd._open_none1(function(_this /* model/continuation-scope<2415> */ ) {
            return _this.scope_unlink;
          }, _x31.fst);
         
        $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_11_10461, $std_core_types.Just(function() {
             
            var maybe_10029 = $kokaine_internal_registry.registry_registration_fs_take(x_1_10683);
            return (maybe_10029 !== null);
          }));
         
        $std_core_hnd._open_none2($kokaine_reactive_internal_scheduler.queue_work, plane, _x31.snd);
         
        var _x_x1_14_10466 = $std_core_hnd._open_none1(function(root_1 /* model/root<2415> */ ) {
            return root_1.root_key;
          }, root);
         
        var x_2_10686 = $std_core_hnd._open_at1(1, function(key /* model/root-key */ ) {
             
            var ev_10689 = $std_core_hnd._evv_at(0);
            var _x32 = $kokaine_reactive_effects.request_flush_fs__select(ev_10689.hnd);
            return _x32(ev_10689.marker, ev_10689, key);
          }, _x_x1_14_10466);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(wild_3 /* () */ ) {
            return _x31.thd;
          });
        }
        else {
          return _x31.thd;
        }
      }
    }
  }
}
 
export function create_effect_inner(root, track, apply) /* forall<a,e> (root : model/root<e>, track : () -> <effects/signal-read,pure> a, apply : (value : a) -> <effects/signal-write,pure|e> ()) -> <effects/signal-write,pure> model/disposer<e> */  {
  return create_effect_publication(root, track, function(value /* 2464 */ ) {
      return $kokaine_reactive_internal_handlers.interpret_write(root, function() {
          return apply(value);
        });
    });
}
 
 
// // UI integrations can publish host state without installing a fresh
// // signal-write interpreter for every value. The closed publication row cannot
// // absorb a signal-write instance. The dynamic pure-plane guard also rejects
// // writes hidden behind a nested public reactive wrapper. `finally` restores
// // that guard for modeled exceptions and ambient final-control exits alike.
export function create_ui_publication_effect(root, track, publish) /* forall<a> (root : model/root<ui>, track : () -> <effects/signal-read,pure> a, publish : (value : a) -> <ui,exn> ()) -> <effects/signal-write,pure> model/disposer<ui> */  {
  return create_effect_publication(root, track, function(value /* 2527 */ ) {
       
      var previous_phase = $std_core_hnd._open_none0(function() {
         
        var previous = $kokaine_reactive_internal_model.load($kokaine_reactive_internal_model.pure_plane_depth);
         
        $kokaine_reactive_internal_model.store($kokaine_reactive_internal_model.pure_plane_depth, $std_core_types._int_add(previous,1));
        return previous;
      });
      return $std_core_hnd.finally_prompt(function() {
          return $std_core_hnd._open_none1(function(previous_0 /* int */ ) {
              return $kokaine_reactive_internal_model.store($kokaine_reactive_internal_model.pure_plane_depth, previous_0);
            }, previous_phase);
        }, publish(value));
    });
}
 
 
// // monadic lift
export function _mlift_commit_derived_10549(source, value, _y_x10121) /* forall<a> (source : model/source<a>, value : a, bool) -> exn () */  {
  if (_y_x10121) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x_x1_4_10475 = $std_core_hnd._open_none1(function(source_3 /* model/source<2651> */ ) {
        return source_3.source_cell;
      }, source);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_4_10475, value);
     
    var _x_x1_8_10478 = $std_core_hnd._open_none1(function(source_5 /* model/source<2651> */ ) {
        return source_5.source_version;
      }, source);
     
    var x_10277 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_8_10478);
     
    var _x_x1_6_10480 = $std_core_hnd._open_none1(function(source_4 /* model/source<2651> */ ) {
        return source_4.source_version;
      }, source);
     
    var _x_x2_1_10481 = $std_core_types._int_add(x_10277,1);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_6_10480, _x_x2_1_10481);
    return $std_core_hnd._open_none1(function(source_6 /* model/source<2651> */ ) {
        var _x32 = source_6.source_captures;
        return $kokaine_internal_registry.registry_fs_visit_readonly(_x32, $kokaine_reactive_internal_scheduler.cut_capture);
      }, source);
  }
}
 
 
// // monadic lift
export function _mlift_commit_derived_10550(source, value, wild) /* forall<a> (source : model/source<a>, value : a, wild : ()) -> exn () */  {
   
  var _x_x1_0_10470 = $std_core_hnd._open_none1(function(source_1 /* model/source<2651> */ ) {
      return source_1.source_cell;
    }, source);
   
  var previous = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_0_10470);
   
  var _x_x0_2_10271 = $std_core_hnd._open_none1(function(source_2 /* model/source<2651> */ ) {
      return source_2.source_equals;
    }, source);
   
  var x_10696 = $std_core_hnd._open_none2(_x_x0_2_10271, previous, value);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10121 /* bool */ ) {
      return _mlift_commit_derived_10549(source, value, _y_x10121);
    });
  }
  else {
    return _mlift_commit_derived_10549(source, value, x_10696);
  }
}
 
export function commit_derived(root, source, value) /* forall<a,e> (root : model/root<e>, source : model/source<a>, value : a) -> exn () */  {
   
  var x_10698 = $kokaine_reactive_internal_scheduler.check_root(root, $std_core_hnd._open_none1(function(source_0 /* model/source<2651> */ ) {
        return source_0.source_root;
      }, source));
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild /* () */ ) {
      return _mlift_commit_derived_10550(source, value, wild);
    });
  }
  else {
     
    var _x_x1_0_10470 = $std_core_hnd._open_none1(function(source_1 /* model/source<2651> */ ) {
        return source_1.source_cell;
      }, source);
     
    var previous = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_0_10470);
     
    var _x_x0_2_10271 = $std_core_hnd._open_none1(function(source_2 /* model/source<2651> */ ) {
        return source_2.source_equals;
      }, source);
     
    var x_0_10701 = $std_core_hnd._open_none2(_x_x0_2_10271, previous, value);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10121 /* bool */ ) {
        return _mlift_commit_derived_10549(source, value, _y_x10121);
      });
    }
    else {
      if (x_0_10701) {
        return $std_core_types.Unit;
      }
      else {
         
        var _x_x1_4_10475 = $std_core_hnd._open_none1(function(source_3 /* model/source<2651> */ ) {
            return source_3.source_cell;
          }, source);
         
        $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_4_10475, value);
         
        var _x_x1_8_10478 = $std_core_hnd._open_none1(function(source_5 /* model/source<2651> */ ) {
            return source_5.source_version;
          }, source);
         
        var x_10277 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_8_10478);
         
        var _x_x1_6_10480 = $std_core_hnd._open_none1(function(source_4 /* model/source<2651> */ ) {
            return source_4.source_version;
          }, source);
         
        var _x_x2_1_10481 = $std_core_types._int_add(x_10277,1);
         
        $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_6_10480, _x_x2_1_10481);
        return $std_core_hnd._open_none1(function(source_6 /* model/source<2651> */ ) {
            var _x33 = source_6.source_captures;
            return $kokaine_internal_registry.registry_fs_visit_readonly(_x33, $kokaine_reactive_internal_scheduler.cut_capture);
          }, source);
      }
    }
  }
}
 
 
// // monadic lift
export function _mlift_derive_by_inner_10551(producer, source, wild_5) /* forall<a> (producer : model/derive-producer, source : model/source<a>, wild@5 : ()) -> <effects/signal-write,exn,div> model/memo<a> */  {
  return $kokaine_reactive_internal_model.Memo(source, producer);
}
 
 
// // monadic lift
export function _mlift_derive_by_inner_10552(bootstrap, current, derive_plane, producer, root, source, registration) /* forall<a,e> (bootstrap : model/work<total>, current : model/continuation-scope<total>, derive-plane : model/plane<total>, producer : model/derive-producer, root : model/root<e>, source : model/source<a>, registration : internal/registry/registry-registration<model/retirement-work<e>>) -> <exn,effects/signal-write,div> model/memo<a> */  {
   
  var _x_x1_18_10513 = $std_core_hnd._open_none1(function(_this /* model/continuation-scope<total> */ ) {
      return _this.scope_unlink;
    }, current);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_18_10513, $std_core_types.Just(function() {
       
      var maybe_10031 = $kokaine_internal_registry.registry_registration_fs_take(registration);
      return (maybe_10031 !== null);
    }));
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_scheduler.queue_work, derive_plane, bootstrap);
   
  var _x_x1_21_10518 = $std_core_hnd._open_none1(function(root_2 /* model/root<2965> */ ) {
      return root_2.root_key;
    }, root);
   
  var x_10704 = $std_core_hnd._open_at1(1, function(key /* model/root-key */ ) {
       
      var ev_10706 = $std_core_hnd._evv_at(0);
      var _x34 = $kokaine_reactive_effects.request_flush_fs__select(ev_10706.hnd);
      return _x34(ev_10706.marker, ev_10706, key);
    }, _x_x1_21_10518);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild_5 /* () */ ) {
      return $kokaine_reactive_internal_model.Memo(source, producer);
    });
  }
  else {
    return $kokaine_reactive_internal_model.Memo(source, producer);
  }
}
 
 
// // monadic lift
export function _mlift_derive_by_inner_10553(bootstrap, current, derive_plane, owner, producer, root, source, structural) /* forall<a,e> (bootstrap : model/work<total>, current : model/continuation-scope<total>, derive-plane : model/plane<total>, owner : model/frame<e>, producer : model/derive-producer, root : model/root<e>, source : model/source<a>, structural : model/retirement-work<e>) -> <exn,effects/signal-write,div> model/memo<a> */  {
   
  var _x_x1_16_10510 = $std_core_hnd._open_none1(function(frame /* model/frame<2965> */ ) {
      return frame;
    }, owner);
   
  var x_10712 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_child, _x_x1_16_10510, structural);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(registration /* internal/registry/registry-registration<model/retirement-work<2965>> */ ) {
      return _mlift_derive_by_inner_10552(bootstrap, current, derive_plane, producer, root, source, registration);
    });
  }
  else {
    return _mlift_derive_by_inner_10552(bootstrap, current, derive_plane, producer, root, source, x_10712);
  }
}
 
 
// // monadic lift
export function _mlift_derive_by_inner_10554(calculate, effect_plane, owner, root, source, wild_1) /* forall<a,e> (calculate : () -> <effects/signal-read,pure> a, effect-plane : model/plane<e>, owner : model/frame<e>, root : model/root<e>, source : model/source<a>, wild@1 : ()) -> <exn,effects/signal-write,div> model/memo<a> */  {
   
  var derive_plane = $std_core_hnd._open_none1(function(root_1 /* model/root<2965> */ ) {
      return root_1.root_derive_plane;
    }, root);
   
  var owner_slot = $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $std_core_types.Nothing);
   
  var _x_x1_9_10502 = $std_core_hnd._open_none1(function(plane_0 /* model/plane<2965> */ ) {
      return plane_0.plane_current;
    }, effect_plane);
   
  var _x_x4_10499 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_9_10502);
  var _x34 = $std_core_hnd._open_none0(function() {
    return $kokaine_reactive_internal_capture.prepare_trace(root, derive_plane, owner_slot, _x_x4_10499, calculate, function(value /* 2964 */ ) {
        return commit_derived(root, source, value);
      });
  });
   
  var producer = $kokaine_reactive_internal_model.Derive_producer(derive_plane, _x34.fst, $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, false), $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, 0));
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, owner_slot, $std_core_types.Just(producer));
   
  var _x_x1_14_10508 = $std_core_hnd._open_none1(function(current_0 /* model/continuation-scope<total> */ ) {
      return $kokaine_reactive_internal_model.Retirement_step(function() {
        return $kokaine_reactive_internal_lifetime.scope_retirement_expand(current_0);
      });
    }, _x34.fst);
   
  var x_10714 = $std_core_hnd._open_none1($kokaine_reactive_internal_lifetime.widen_pure_retirement, _x_x1_14_10508);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(structural /* model/retirement-work<2965> */ ) {
      return _mlift_derive_by_inner_10553(_x34.snd, _x34.fst, derive_plane, owner, producer, root, source, structural);
    });
  }
  else {
    return _mlift_derive_by_inner_10553(_x34.snd, _x34.fst, derive_plane, owner, producer, root, source, x_10714);
  }
}
 
 
// // monadic lift
export function _mlift_derive_by_inner_10555(calculate, equals, initial, root, wild_0) /* forall<a,e> (calculate : () -> <effects/signal-read,pure> a, equals : (a, a) -> bool, initial : a, root : model/root<e>, wild@0 : ()) -> <exn,effects/signal-write,div> model/memo<a> */  {
   
  var source = $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, equals);
   
  var effect_plane = $std_core_hnd._open_none1(function(root_0 /* model/root<2965> */ ) {
      return root_0.root_effect_plane;
    }, root);
   
  var _x_x1_3_10490 = $std_core_hnd._open_none1(function(plane /* model/plane<2965> */ ) {
      return plane.plane_current_frame;
    }, effect_plane);
   
  var owner = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_3_10490);
   
  var x_10716 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_scheduler.check_frame_registration, root, owner);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild_1 /* () */ ) {
      return _mlift_derive_by_inner_10554(calculate, effect_plane, owner, root, source, wild_1);
    });
  }
  else {
    return _mlift_derive_by_inner_10554(calculate, effect_plane, owner, root, source, x_10716);
  }
}
 
 
// // monadic lift
export function _mlift_derive_by_inner_10556(calculate, equals, initial, root, wild) /* forall<a,e> (calculate : () -> <effects/signal-read,pure> a, equals : (a, a) -> bool, initial : a, root : model/root<e>, wild : ()) -> <exn,effects/signal-write,div> model/memo<a> */  {
   
  var x_10718 = $std_core_hnd._open_at1(0, $kokaine_reactive_internal_scheduler.check_registration, root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild_0 /* () */ ) {
      return _mlift_derive_by_inner_10555(calculate, equals, initial, root, wild_0);
    });
  }
  else {
    return _mlift_derive_by_inner_10555(calculate, equals, initial, root, x_10718);
  }
}
 
export function derive_by_inner(root, initial, calculate, equals) /* forall<a,e> (root : model/root<e>, initial : a, calculate : () -> <effects/signal-read,pure> a, equals : (a, a) -> bool) -> <effects/signal-write,pure> model/memo<a> */  {
   
  var x_10720 = $std_core_hnd._open_at1(0, $kokaine_reactive_internal_model.check_not_pure_plane, "derivation creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild /* () */ ) {
      return _mlift_derive_by_inner_10556(calculate, equals, initial, root, wild);
    });
  }
  else {
     
    var x_0_10723 = $std_core_hnd._open_at1(0, $kokaine_reactive_internal_scheduler.check_registration, root);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild_0 /* () */ ) {
        return _mlift_derive_by_inner_10555(calculate, equals, initial, root, wild_0);
      });
    }
    else {
       
      var source = $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, equals);
       
      var effect_plane = $std_core_hnd._open_none1(function(root_0 /* model/root<2965> */ ) {
          return root_0.root_effect_plane;
        }, root);
       
      var _x_x1_3_10490 = $std_core_hnd._open_none1(function(plane /* model/plane<2965> */ ) {
          return plane.plane_current_frame;
        }, effect_plane);
       
      var owner = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_3_10490);
       
      var x_1_10726 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_scheduler.check_frame_registration, root, owner);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild_1 /* () */ ) {
          return _mlift_derive_by_inner_10554(calculate, effect_plane, owner, root, source, wild_1);
        });
      }
      else {
         
        var derive_plane = $std_core_hnd._open_none1(function(root_1 /* model/root<2965> */ ) {
            return root_1.root_derive_plane;
          }, root);
         
        var owner_slot = $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $std_core_types.Nothing);
         
        var _x_x1_9_10502 = $std_core_hnd._open_none1(function(plane_0 /* model/plane<2965> */ ) {
            return plane_0.plane_current;
          }, effect_plane);
         
        var _x_x4_10499 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_9_10502);
        var _x35 = $std_core_hnd._open_none0(function() {
          return $kokaine_reactive_internal_capture.prepare_trace(root, derive_plane, owner_slot, _x_x4_10499, calculate, function(value /* 2964 */ ) {
              return commit_derived(root, source, value);
            });
        });
         
        var producer = $kokaine_reactive_internal_model.Derive_producer(derive_plane, _x35.fst, $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, false), $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, 0));
         
        $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, owner_slot, $std_core_types.Just(producer));
         
        var _x_x1_14_10508 = $std_core_hnd._open_none1(function(current_0 /* model/continuation-scope<total> */ ) {
            return $kokaine_reactive_internal_model.Retirement_step(function() {
              return $kokaine_reactive_internal_lifetime.scope_retirement_expand(current_0);
            });
          }, _x35.fst);
         
        var x_2_10729 = $std_core_hnd._open_none1($kokaine_reactive_internal_lifetime.widen_pure_retirement, _x_x1_14_10508);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(structural /* model/retirement-work<2965> */ ) {
            return _mlift_derive_by_inner_10553(_x35.snd, _x35.fst, derive_plane, owner, producer, root, source, structural);
          });
        }
        else {
           
          var _x_x1_16_10510 = $std_core_hnd._open_none1(function(frame /* model/frame<2965> */ ) {
              return frame;
            }, owner);
           
          var x_3_10732 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_child, _x_x1_16_10510, x_2_10729);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(registration /* internal/registry/registry-registration<model/retirement-work<2965>> */ ) {
              return _mlift_derive_by_inner_10552(_x35.snd, _x35.fst, derive_plane, producer, root, source, registration);
            });
          }
          else {
             
            var _x_x1_18_10513 = $std_core_hnd._open_none1(function(_this /* model/continuation-scope<total> */ ) {
                return _this.scope_unlink;
              }, _x35.fst);
             
            $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_18_10513, $std_core_types.Just(function() {
                 
                var maybe_10031 = $kokaine_internal_registry.registry_registration_fs_take(x_3_10732);
                return (maybe_10031 !== null);
              }));
             
            $std_core_hnd._open_none2($kokaine_reactive_internal_scheduler.queue_work, derive_plane, _x35.snd);
             
            var _x_x1_21_10518 = $std_core_hnd._open_none1(function(root_2 /* model/root<2965> */ ) {
                return root_2.root_key;
              }, root);
             
            var x_4_10735 = $std_core_hnd._open_at1(1, function(key /* model/root-key */ ) {
                 
                var ev_10738 = $std_core_hnd._evv_at(0);
                var _x36 = $kokaine_reactive_effects.request_flush_fs__select(ev_10738.hnd);
                return _x36(ev_10738.marker, ev_10738, key);
              }, _x_x1_21_10518);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(wild_5 /* () */ ) {
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
 
export function derive_by(root, initial, calculate, equals) /* forall<a,e> (root : model/root<e>, initial : a, calculate : () -> <effects/signal-read,pure> a, equals : (a, a) -> bool) -> <effects/signal-write,pure> model/memo<a> */  {
  return derive_by_inner(root, initial, calculate, equals);
}
 
export function derive(root, initial, calculate, _implicit_fs__lp__eq__eq__rp_) /* forall<a,e> (root : model/root<e>, initial : a, calculate : () -> <effects/signal-read,pure> a, ?(==) : (a, a) -> bool) -> <effects/signal-write,pure> model/memo<a> */  {
  return derive_by_inner(root, initial, calculate, _implicit_fs__lp__eq__eq__rp_);
}
 
export function derive_always(root, initial, calculate) /* forall<a,e> (root : model/root<e>, initial : a, calculate : () -> <effects/signal-read,pure> a) -> <effects/signal-write,pure> model/memo<a> */  {
  return derive_by_inner(root, initial, calculate, function(___wildcard_x294__39 /* 3160 */ , ___wildcard_x294__41 /* 3160 */ ) {
      return false;
    });
}
 
 
// // monadic lift
export function memo_fs__mlift_get_10557(memo, wild) /* forall<a> (memo : model/memo<a>, wild : ()) -> effects/signal-read a */  {
   
  var source_10041 = $std_core_hnd._open_none1(function(memo_1 /* model/memo<3219> */ ) {
      return memo_1.memo_source;
    }, memo);
   
  var producer_0_10043 = $std_core_types.Just($std_core_hnd._open_none1(function(memo_2 /* model/memo<3219> */ ) {
      return memo_2.memo_producer;
    }, memo));
  return $std_core_hnd._perform3($std_core_hnd._evv_at(0), $kokaine_reactive_effects.read_source_fs__select, source_10041, $kokaine_reactive_internal_model.Track_read, producer_0_10043);
}
 
export function memo_fs_get(memo) /* forall<a> (memo : model/memo<a>) -> effects/signal-read a */  {
   
  var producer_10040 = $std_core_hnd._open_none1(function(memo_0 /* model/memo<3219> */ ) {
      return memo_0.memo_producer;
    }, memo);
   
  var ev_10747 = $std_core_hnd._evv_at(0);
   
  var _x36 = $kokaine_reactive_effects.validate_derived_fs__select(ev_10747.hnd);
  var x_10744 = _x36(ev_10747.marker, ev_10747, producer_10040);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild /* () */ ) {
      return memo_fs__mlift_get_10557(memo, wild);
    });
  }
  else {
     
    var source_10041 = $std_core_hnd._open_none1(function(memo_1 /* model/memo<3219> */ ) {
        return memo_1.memo_source;
      }, memo);
     
    var producer_0_10043 = $std_core_types.Just($std_core_hnd._open_none1(function(memo_2 /* model/memo<3219> */ ) {
        return memo_2.memo_producer;
      }, memo));
    return $std_core_hnd._perform3($std_core_hnd._evv_at(0), $kokaine_reactive_effects.read_source_fs__select, source_10041, $kokaine_reactive_internal_model.Track_read, producer_0_10043);
  }
}
 
export function create_effect(root, track, apply) /* forall<a,e> (root : model/root<e>, track : () -> <effects/signal-read,pure> a, apply : (value : a) -> <effects/signal-write,pure|e> ()) -> <effects/signal-write,pure> model/disposer<e> */  {
  return create_effect_publication(root, track, function(value /* 3252 */ ) {
      return $kokaine_reactive_internal_handlers.interpret_write(root, function() {
          return apply(value);
        });
    });
}
 
 
// // monadic lift
export function _mlift_register_cleanup_10558(resource, node) /* forall<e> (resource : resource/resource-k<e>, node : internal/registry/registry-registration<model/retirement-work<e>>) -> exn model/cleanup-registration<e> */  {
  return $kokaine_reactive_internal_model.Cleanup_registration(node, resource);
}
 
 
// // monadic lift
export function _mlift_register_cleanup_10559(checkpoint, cleanup, current, plane, root, wild_0) /* forall<e> (checkpoint : maybe<model/continuation-gate>, cleanup : () -> <effects/signal-write,pure|e> (), current : model/frame<e>, plane : model/plane<e>, root : model/root<e>, wild@0 : ()) -> exn model/cleanup-registration<e> */  {
   
  var resource = $std_core_hnd._open_none1($kokaine_reactive_internal_resource.capture_resource, function() {
      return $kokaine_reactive_internal_lifetime.with_context(plane, checkpoint, current, function() {
          return $kokaine_reactive_internal_handlers.interpret_write(root, cleanup);
        });
    });
   
  var x_10750 = $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_finalizer($std_core_hnd._open_none1(function(frame /* model/frame<3391> */ ) {
        return frame;
      }, current), $kokaine_reactive_internal_model.Retirement_finalizer(function() {
      return $kokaine_reactive_internal_resource.finalize_resource(resource);
    }));
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(node /* internal/registry/registry-registration<model/retirement-work<3391>> */ ) {
      return $kokaine_reactive_internal_model.Cleanup_registration(node, resource);
    });
  }
  else {
    return $kokaine_reactive_internal_model.Cleanup_registration(x_10750, resource);
  }
}
 
 
// // monadic lift
export function _mlift_register_cleanup_10560(cleanup, root, wild) /* forall<e> (cleanup : () -> <effects/signal-write,pure|e> (), root : model/root<e>, wild : ()) -> exn model/cleanup-registration<e> */  {
   
  var plane = $std_core_hnd._open_none1(function(root_0 /* model/root<3391> */ ) {
      return root_0.root_effect_plane;
    }, root);
   
  var _x_x1_0_10524 = $std_core_hnd._open_none1(function(plane_0 /* model/plane<3391> */ ) {
      return plane_0.plane_current_frame;
    }, plane);
   
  var current = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_0_10524);
   
  var _x_x1_2_10526 = $std_core_hnd._open_none1(function(plane_1 /* model/plane<3391> */ ) {
      return plane_1.plane_current;
    }, plane);
   
  var checkpoint = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_2_10526);
   
  var x_10754 = $kokaine_reactive_internal_scheduler.check_frame_registration(root, current);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild_0 /* () */ ) {
      return _mlift_register_cleanup_10559(checkpoint, cleanup, current, plane, root, wild_0);
    });
  }
  else {
    return _mlift_register_cleanup_10559(checkpoint, cleanup, current, plane, root, x_10754);
  }
}
 
export function register_cleanup(root, cleanup) /* forall<e> (root : model/root<e>, cleanup : () -> <effects/signal-write,pure|e> ()) -> exn model/cleanup-registration<e> */  {
   
  var x_10756 = $kokaine_reactive_internal_model.check_not_pure_plane("cleanup registration");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild /* () */ ) {
      return _mlift_register_cleanup_10560(cleanup, root, wild);
    });
  }
  else {
     
    var plane = $std_core_hnd._open_none1(function(root_0 /* model/root<3391> */ ) {
        return root_0.root_effect_plane;
      }, root);
     
    var _x_x1_0_10524 = $std_core_hnd._open_none1(function(plane_0 /* model/plane<3391> */ ) {
        return plane_0.plane_current_frame;
      }, plane);
     
    var current = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_0_10524);
     
    var _x_x1_2_10526 = $std_core_hnd._open_none1(function(plane_1 /* model/plane<3391> */ ) {
        return plane_1.plane_current;
      }, plane);
     
    var checkpoint = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_2_10526);
     
    var x_0_10759 = $kokaine_reactive_internal_scheduler.check_frame_registration(root, current);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild_0 /* () */ ) {
        return _mlift_register_cleanup_10559(checkpoint, cleanup, current, plane, root, wild_0);
      });
    }
    else {
       
      var resource = $std_core_hnd._open_none1($kokaine_reactive_internal_resource.capture_resource, function() {
          return $kokaine_reactive_internal_lifetime.with_context(plane, checkpoint, current, function() {
              return $kokaine_reactive_internal_handlers.interpret_write(root, cleanup);
            });
        });
       
      var x_1_10762 = $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_finalizer($std_core_hnd._open_none1(function(frame /* model/frame<3391> */ ) {
            return frame;
          }, current), $kokaine_reactive_internal_model.Retirement_finalizer(function() {
          return $kokaine_reactive_internal_resource.finalize_resource(resource);
        }));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(node /* internal/registry/registry-registration<model/retirement-work<3391>> */ ) {
          return $kokaine_reactive_internal_model.Cleanup_registration(node, resource);
        });
      }
      else {
        return $kokaine_reactive_internal_model.Cleanup_registration(x_1_10762, resource);
      }
    }
  }
}
 
 
// // monadic lift
export function _mlift_on_cleanup_10561(_pat) /* forall<e> (model/cleanup-registration<e>) -> exn () */  {
  return $std_core_types.Unit;
}
 
export function on_cleanup(root, cleanup) /* forall<e> (root : model/root<e>, cleanup : () -> <effects/signal-write,pure|e> ()) -> exn () */  {
   
  var x_10767 = register_cleanup(root, cleanup);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_pat_1 /* model/cleanup-registration<3415> */ ) {
      return $std_core_types.Unit;
    });
  }
  else {
    return $std_core_types.Unit;
  }
}
 
 
// // monadic lift
export function cleanup_registration_fs__mlift_unregister_10562(_c_x10149) /* forall<e> (maybe<() -> <div,exn|e> ()>) -> bool */  {
  return (_c_x10149 !== null);
}
 
export function cleanup_registration_fs_unregister(registration) /* forall<e> (registration : model/cleanup-registration<e>) -> bool */  {
  var _x37 = registration.cleanup_node;
  var _x36 = $kokaine_internal_registry.registry_registration_fs_take(_x37);
  if (_x36 === null) {
    return false;
  }
  else {
     
    if (registration.cleanup_resource === null) {
      var x_10771 = $std_core_types.Nothing;
    }
    else {
       
      var claimed = $kokaine_reactive_internal_resource.load(registration.cleanup_resource.resource_finalizer);
       
      $kokaine_reactive_internal_resource.store(registration.cleanup_resource.resource_finalizer, $std_core_types.Nothing);
      var x_10771 = claimed;
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10149 /* maybe<() -> <div,exn|3468> ()> */ ) {
        return (_c_x10149 !== null);
      });
    }
    else {
      return (x_10771 !== null);
    }
  }
}