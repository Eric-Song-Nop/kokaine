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
  return $kokaine_reactive_internal_model.Plane($kokaine_reactive_internal_work_dash_transaction.new_work_queue(), { value: ($std_core_types.Nothing) }, { value: ($std_core_types.Nothing) }, { value: ($std_core_types.Nothing) }, { value: current_frame }, { value: ($std_core_types.Nothing) }, retirement);
}
 
 
// monadic lift
export function _mlift_prepend_root_publication_rollbacks_10584(_c_x10081) /* forall<e> (() -> <exn|e> ()) -> () */  {
  return _c_x10081();
}
 
export function prepend_root_publication_rollbacks(values, collected) /* forall<e> (values : list<kokaine/reactive/internal/work-transaction/work-publication<e>>, collected : list<kokaine/reactive/internal/model/retirement-work<e>>) -> div list<kokaine/reactive/internal/model/retirement-work<e>> */  { tailcall: while(1)
{
  if (values === null) {
    return collected;
  }
  else {
    {
      // tail call
      var _x1 = function(_current0 /* kokaine/reactive/internal/work-transaction/work-publication<492> */ ) {
        return $std_core_types.Cons($kokaine_reactive_internal_model.Retirement_finalizer(function() {
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_c_x10081_0 /* () -> <exn|492> () */ ) {
                return _mlift_prepend_root_publication_rollbacks_10584(_c_x10081_0);
              });
            }
            else {
              var _x2 = _current0.publication_rollback;
              return _mlift_prepend_root_publication_rollbacks_10584(_x2);
            }
          }), collected);
      }(values.head);
      values = values.tail;
      collected = _x1;
      continue tailcall;
    }
  }
}}
 
 
// Root retirement must claim every transaction capability before invoking any
// user cleanup. A retained transaction can otherwise re-enter abort while the
// copied journal and live queue still name the same rollback callbacks.
export function claim_root_work(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> list<kokaine/reactive/internal/work-transaction/work-publication<e>> */  {
   
  var _x4 = root.root_work_publications;
  var _x3 = _x4.value;
  if (_x3 === null) {
    var publications = $std_core_types.Nil;
  }
  else {
     
    var values = $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_values(_x3.value);
     
    $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_clear(_x3.value);
    var publications = values;
  }
   
  var _x5 = root.root_work_publications;
  ((_x5).value = ($std_core_types.Nothing));
   
  var _x6 = root.root_derive_plane.plane_work_group;
  var derive_group = _x6.value;
   
  var _x7 = root.root_effect_plane.plane_work_group;
  var effect_group = _x7.value;
   
  var _x8 = root.root_derive_plane.plane_work_group;
  ((_x8).value = ($std_core_types.Nothing));
   
  var _x9 = root.root_effect_plane.plane_work_group;
  ((_x9).value = ($std_core_types.Nothing));
   
  if (derive_group === null) {
    $std_core_types.Unit;
  }
  else {
     
    var _pat_3_9 = $kokaine_reactive_internal_work_dash_transaction.work_group_fs_mark_aborted(derive_group.value);
    $kokaine_reactive_internal_work_dash_transaction.work_group_fs_clear(derive_group.value);
  }
   
  if (effect_group === null) {
    $std_core_types.Unit;
  }
  else {
     
    var _pat_6_5 = $kokaine_reactive_internal_work_dash_transaction.work_group_fs_mark_aborted(effect_group.value);
    $kokaine_reactive_internal_work_dash_transaction.work_group_fs_clear(effect_group.value);
  }
  return publications;
}
 
 
// monadic lift
export function _mlift_retire_root_now_10585(root, finalizers) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, finalizers : list<kokaine/reactive/internal/lifetime/retirement<e>>) -> <div,exn|e> () */  {
   
  var _x_x1_32_10441 = $std_core_hnd._open_none1(function(root_17 /* kokaine/reactive/internal/model/root<1189> */ ) {
      return root_17.root_lifetime;
    }, root);
  return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/lifetime-owner<1189> */ ) {
        return _this_0.lifetime_retirement;
      }, _x_x1_32_10441), finalizers);
}
 
 
// monadic lift
export function _mlift_retire_root_now_10586(lifetime_finalizers, root, publication_rollbacks) /* forall<e> (lifetime-finalizers : list<kokaine/reactive/internal/lifetime/retirement<e>>, root : kokaine/reactive/internal/model/root<e>, publication-rollbacks : list<kokaine/reactive/internal/model/retirement-work<e>>) -> <div,exn|e> () */  {
   
  var x_10628 = $std_core_list.append(lifetime_finalizers, publication_rollbacks);
   
  function next_10629(finalizers) /* (list<kokaine/reactive/internal/lifetime/retirement<1189>>) -> <div,exn|1189> () */  {
     
    var _x_x1_32_10441 = $std_core_hnd._open_none1(function(root_17 /* kokaine/reactive/internal/model/root<1189> */ ) {
        return root_17.root_lifetime;
      }, root);
    return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/lifetime-owner<1189> */ ) {
          return _this_0.lifetime_retirement;
        }, _x_x1_32_10441), finalizers);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10629);
  }
  else {
    return next_10629(x_10628);
  }
}
 
 
// monadic lift
export function _mlift_retire_root_now_10587(publications, root, lifetime_finalizers) /* forall<e> (publications : list<kokaine/reactive/internal/work-transaction/work-publication<e>>, root : kokaine/reactive/internal/model/root<e>, lifetime-finalizers : list<kokaine/reactive/internal/lifetime/retirement<e>>) -> <div,exn|e> () */  {
   
  var x_10632 = $std_core_hnd._open_none2(prepend_root_publication_rollbacks, publications, $std_core_types.Nil);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(publication_rollbacks /* list<kokaine/reactive/internal/model/retirement-work<1189>> */ ) {
      return _mlift_retire_root_now_10586(lifetime_finalizers, root, publication_rollbacks);
    });
  }
  else {
    return _mlift_retire_root_now_10586(lifetime_finalizers, root, x_10632);
  }
}
 
 
// This is the non-validating half of root disposal. Besides ordinary public
// disposal, it is used to roll back a root whose construction has not been
// published yet. In that case a batch may still be open, or an initial flush
// may have failed after publishing only a prefix of the queued scopes.
export function retire_root_now(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> <div,exn|e> () */  {
   
  var target_10194 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<1189> */ ) {
      return root_0.root_disposing;
    }, root);
   
  ((target_10194).value = true);
   
  var _x_x1_0_10408 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<1189> */ ) {
      return root_1.root_lifetime;
    }, root);
   
  var target_0_10197 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<1189> */ ) {
      return _this.lifetime_token;
    }, _x_x1_0_10408);
   
  ((target_0_10197).value = ($kokaine_reactive_internal_model.Scope_dead));
   
  var publications = $std_core_hnd._open_none1(claim_root_work, root);
   
  var _x_x1_29_10437 = $std_core_hnd._open_none1(function(root_16 /* kokaine/reactive/internal/model/root<1189> */ ) {
      return root_16.root_lifetime;
    }, root);
   
  var x_10636 = $std_core_hnd._open_none1(function(owner /* kokaine/reactive/internal/model/lifetime-owner<1189> */ ) {
      return $kokaine_reactive_internal_lifetime.collect_retirement_loop($std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
            return $kokaine_reactive_internal_lifetime.lifetime_retirement_expand(owner);
          }), $std_core_types.Nil), $std_core_types.Nil);
    }, _x_x1_29_10437);
  if ($std_core_hnd._yielding()) {
    var _x3 = $std_core_hnd.yield_extend(function(lifetime_finalizers /* list<kokaine/reactive/internal/lifetime/retirement<1189>> */ ) {
      return _mlift_retire_root_now_10587(publications, root, lifetime_finalizers);
    });
  }
  else {
    var _x3 = _mlift_retire_root_now_10587(publications, root, x_10636);
  }
  return $std_core_hnd.finally_prompt(function() {
       
      var target_1_10202 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<1189> */ ) {
          return root_2.root_batch_depth;
        }, root);
       
      ((target_1_10202).value = 0);
       
      var target_2_10205 = $std_core_hnd._open_none1(function(root_3 /* kokaine/reactive/internal/model/root<1189> */ ) {
          return root_3.root_flushing;
        }, root);
       
      ((target_2_10205).value = false);
       
      var target_3_10208 = $std_core_hnd._open_none1(function(root_4 /* kokaine/reactive/internal/model/root<1189> */ ) {
          return root_4.root_disposed;
        }, root);
       
      ((target_3_10208).value = true);
       
      var target_4_10211 = $std_core_hnd._open_none1(function(root_5 /* kokaine/reactive/internal/model/root<1189> */ ) {
          return root_5.root_disposing;
        }, root);
       
      ((target_4_10211).value = false);
       
      var _x_x1_8_10416 = $std_core_hnd._open_none1(function(root_6 /* kokaine/reactive/internal/model/root<1189> */ ) {
          return root_6.root_derive_plane;
        }, root);
       
      var _x_x1_7_10415 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<total> */ ) {
          return plane.plane_queue;
        }, _x_x1_8_10416);
       
      $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_queue_fs_clear, _x_x1_7_10415);
       
      var _x_x1_11_10419 = $std_core_hnd._open_none1(function(root_7 /* kokaine/reactive/internal/model/root<1189> */ ) {
          return root_7.root_effect_plane;
        }, root);
       
      var _x_x1_10_10418 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<1189> */ ) {
          return plane_0.plane_queue;
        }, _x_x1_11_10419);
       
      $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_queue_fs_clear, _x_x1_10_10418);
       
      var _x_x1_13_10421 = $std_core_hnd._open_none1(function(root_8 /* kokaine/reactive/internal/model/root<1189> */ ) {
          return root_8.root_derive_plane;
        }, root);
       
      var target_5_10220 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<total> */ ) {
          return plane_1.plane_work_group;
        }, _x_x1_13_10421);
       
      ((target_5_10220).value = ($std_core_types.Nothing));
       
      var _x_x1_15_10423 = $std_core_hnd._open_none1(function(root_9 /* kokaine/reactive/internal/model/root<1189> */ ) {
          return root_9.root_effect_plane;
        }, root);
       
      var target_6_10224 = $std_core_hnd._open_none1(function(plane_2 /* kokaine/reactive/internal/model/plane<1189> */ ) {
          return plane_2.plane_work_group;
        }, _x_x1_15_10423);
       
      ((target_6_10224).value = ($std_core_types.Nothing));
       
      var _x_x1_17_10425 = $std_core_hnd._open_none1(function(root_10 /* kokaine/reactive/internal/model/root<1189> */ ) {
          return root_10.root_derive_plane;
        }, root);
       
      var target_7_10228 = $std_core_hnd._open_none1(function(plane_3 /* kokaine/reactive/internal/model/plane<total> */ ) {
          return plane_3.plane_current;
        }, _x_x1_17_10425);
       
      ((target_7_10228).value = ($std_core_types.Nothing));
       
      var _x_x1_19_10427 = $std_core_hnd._open_none1(function(root_11 /* kokaine/reactive/internal/model/root<1189> */ ) {
          return root_11.root_effect_plane;
        }, root);
       
      var target_8_10232 = $std_core_hnd._open_none1(function(plane_4 /* kokaine/reactive/internal/model/plane<1189> */ ) {
          return plane_4.plane_current;
        }, _x_x1_19_10427);
       
      ((target_8_10232).value = ($std_core_types.Nothing));
       
      var _x_x1_21_10429 = $std_core_hnd._open_none1(function(root_12 /* kokaine/reactive/internal/model/root<1189> */ ) {
          return root_12.root_derive_plane;
        }, root);
       
      var target_9_10236 = $std_core_hnd._open_none1(function(plane_5 /* kokaine/reactive/internal/model/plane<total> */ ) {
          return plane_5.plane_current_entry;
        }, _x_x1_21_10429);
       
      ((target_9_10236).value = ($std_core_types.Nothing));
       
      var _x_x1_23_10431 = $std_core_hnd._open_none1(function(root_13 /* kokaine/reactive/internal/model/root<1189> */ ) {
          return root_13.root_effect_plane;
        }, root);
       
      var target_10_10240 = $std_core_hnd._open_none1(function(plane_6 /* kokaine/reactive/internal/model/plane<1189> */ ) {
          return plane_6.plane_current_entry;
        }, _x_x1_23_10431);
       
      ((target_10_10240).value = ($std_core_types.Nothing));
       
      var _x_x1_25_10433 = $std_core_hnd._open_none1(function(root_14 /* kokaine/reactive/internal/model/root<1189> */ ) {
          return root_14.root_derive_plane;
        }, root);
       
      var target_11_10244 = $std_core_hnd._open_none1(function(plane_7 /* kokaine/reactive/internal/model/plane<total> */ ) {
          return plane_7.plane_draft;
        }, _x_x1_25_10433);
       
      ((target_11_10244).value = ($std_core_types.Nothing));
       
      var _x_x1_27_10435 = $std_core_hnd._open_none1(function(root_15 /* kokaine/reactive/internal/model/root<1189> */ ) {
          return root_15.root_effect_plane;
        }, root);
       
      var target_12_10248 = $std_core_hnd._open_none1(function(plane_8 /* kokaine/reactive/internal/model/plane<1189> */ ) {
          return plane_8.plane_draft;
        }, _x_x1_27_10435);
      return ((target_12_10248).value = ($std_core_types.Nothing));
    }, _x3);
}
 
export function fresh_root() /* forall<e> () -> kokaine/reactive/internal/model/root<e> */  {
   
  var effect_retirement = $kokaine_reactive_internal_lifetime.new_retirement_coordinator();
   
  var derive_retirement = $kokaine_reactive_internal_lifetime.new_retirement_coordinator();
   
  var lifetime = $kokaine_reactive_internal_lifetime.new_lifetime_owner($kokaine_reactive_internal_model.Scope_live, effect_retirement);
   
  var derive_frame = $kokaine_reactive_internal_lifetime.new_lifetime_owner($kokaine_reactive_internal_model.Scope_live, derive_retirement);
   
  var root = $kokaine_reactive_internal_model.Root({ value: true }, fresh_plane(derive_frame, derive_retirement), fresh_plane(lifetime, effect_retirement), { value: ($std_core_types.Nothing) }, lifetime, { value: 0 }, { value: false }, { value: false }, { value: false });
   
  $kokaine_reactive_internal_lifetime.retirement_coordinator_fs_install_root_disposal(effect_retirement, function() {
      return retire_root_now(root);
    });
  return root;
}
 
 
// monadic lift
export function _mlift_create_root_10588(committed, result, root, wild___2) /* forall<_e,a,e1> (committed : ref<global,bool>, result : a, root : kokaine/reactive/internal/model/root<e1>, wild_@2 : ()) -> <div,exn|e1> (kokaine/reactive/internal/model/root<e1>, a) */  {
   
  ((committed).value = true);
  return $std_core_types.Tuple2(root, result);
}
 
 
// monadic lift
export function _mlift_create_root_10589(committed, root, result) /* forall<_e,a,e1> (committed : ref<global,bool>, root : kokaine/reactive/internal/model/root<e1>, result : a) -> <div,exn|e1> (kokaine/reactive/internal/model/root<e1>, a) */  {
   
  var target_0_10266 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<1503> */ ) {
      return root_1.root_batch_depth;
    }, root);
   
  ((target_0_10266).value = 0);
   
  var x_10638 = $kokaine_reactive_internal_scheduler.flush(root);
   
  function next_10639(wild___2) /* (()) -> <div,exn|1503> (kokaine/reactive/internal/model/root<1503>, 1502) */  {
     
    ((committed).value = true);
    return $std_core_types.Tuple2(root, result);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10639);
  }
  else {
    return next_10639(x_10638);
  }
}
 
 
// monadic lift
export function _mlift_create_root_10590(action, wild__) /* forall<_e,_e1,_e2,a,e3> (action : (kokaine/reactive/internal/model/root<e3>) -> <kokaine/reactive/effects/signal-write,pure|e3> a, wild_ : ()) -> <exn|e3> (kokaine/reactive/internal/model/root<e3>, a) */  {
   
  var root = $std_core_hnd._open_none0(fresh_root);
   
  var committed = { value: false };
   
  var target_10263 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<1503> */ ) {
      return root_0.root_batch_depth;
    }, root);
   
  ((target_10263).value = 1);
   
  var x_10646 = $kokaine_reactive_internal_handlers.interpret_write(root, function() {
      return action(root);
    });
  if ($std_core_hnd._yielding()) {
    var _x5 = $std_core_hnd.yield_extend(function(result /* 1502 */ ) {
      return _mlift_create_root_10589(committed, root, result);
    });
  }
  else {
    var _x5 = _mlift_create_root_10589(committed, root, x_10646);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x4 = committed.value;
      if (_x4) {
        return $std_core_types.Unit;
      }
      else {
        return retire_root_now(root);
      }
    }, _x5);
}
 
export function create_root(action) /* forall<a,e> (action : (kokaine/reactive/internal/model/root<e>) -> <kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> (kokaine/reactive/internal/model/root<e>, a) */  {
   
  var x_10648 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "reactive root creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_create_root_10590(action, wild__);
    });
  }
  else {
     
    var root = $std_core_hnd._open_none0(fresh_root);
     
    var committed = { value: false };
     
    var target_10263 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<1503> */ ) {
        return root_0.root_batch_depth;
      }, root);
     
    ((target_10263).value = 1);
     
    var x_0_10653 = $kokaine_reactive_internal_handlers.interpret_write(root, function() {
        return action(root);
      });
    if ($std_core_hnd._yielding()) {
      var _x7 = $std_core_hnd.yield_extend(function(result /* 1502 */ ) {
        return _mlift_create_root_10589(committed, root, result);
      });
    }
    else {
      var _x7 = _mlift_create_root_10589(committed, root, x_0_10653);
    }
    return $std_core_hnd.finally_prompt(function() {
        var _x6 = committed.value;
        if (_x6) {
          return $std_core_types.Unit;
        }
        else {
          return retire_root_now(root);
        }
      }, _x7);
  }
}
 
 
// monadic lift
export function root_fs__mlift_dispose_10591(root, wild__) /* forall<_e,_e1,e2> (root : kokaine/reactive/internal/model/root<e2>, wild_ : ()) -> <exn|e2> () */  {
   
  var value_10272 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<1787> */ ) {
      return root_0.root_disposed;
    }, root);
  var _x8 = value_10272.value;
  if (_x8) {
    return $std_core_types.Unit;
  }
  else {
     
    var value_0_10274 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<1787> */ ) {
        return root_1.root_disposing;
      }, root);
    var _x9 = value_0_10274.value;
    if (_x9) {
      return $std_core_types.Unit;
    }
    else {
       
      var _x_x1_3_10450 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<1787> */ ) {
          return root_2.root_lifetime;
        }, root);
       
      var _x_x1_2_10449 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<1787> */ ) {
          return _this.lifetime_retirement;
        }, _x_x1_3_10450);
      var _x10 = $std_core_hnd._open_none1($kokaine_reactive_internal_lifetime.retirement_coordinator_fs_request_root_disposal, _x_x1_2_10449);
      if (_x10) {
         
        var target_10279 = $std_core_hnd._open_none1(function(root_3 /* kokaine/reactive/internal/model/root<1787> */ ) {
            return root_3.root_disposing;
          }, root);
        return ((target_10279).value = true);
      }
      else {
         
        var value_2_10282 = $std_core_hnd._open_none1(function(root_4 /* kokaine/reactive/internal/model/root<1787> */ ) {
            return root_4.root_batch_depth;
          }, root);
        var _x11 = $std_core_types._int_gt((value_2_10282.value),0);
        if (_x11) {
          return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
        }
        else {
           
          var value_3_10285 = $std_core_hnd._open_none1(function(root_5 /* kokaine/reactive/internal/model/root<1787> */ ) {
              return root_5.root_flushing;
            }, root);
          var _x12 = value_3_10285.value;
          if (_x12) {
            return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
          }
          else {
             
            var _x_x1_11_10459 = $std_core_hnd._open_none1(function(root_6 /* kokaine/reactive/internal/model/root<1787> */ ) {
                return root_6.root_effect_plane;
              }, root);
             
            var value_4_10289 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<1787> */ ) {
                return plane.plane_current;
              }, _x_x1_11_10459);
             
            var _x_x1_10_10461 = value_4_10289.value;
            var _x13 = $std_core_hnd._open_none1(function(maybe /* maybe<kokaine/reactive/internal/model/continuation-gate> */ ) {
                return (maybe !== null);
              }, _x_x1_10_10461);
            if (_x13) {
              return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
            }
            else {
               
              var _x_x1_15_10464 = $std_core_hnd._open_none1(function(root_7 /* kokaine/reactive/internal/model/root<1787> */ ) {
                  return root_7.root_derive_plane;
                }, root);
               
              var value_5_10294 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<total> */ ) {
                  return plane_0.plane_current;
                }, _x_x1_15_10464);
               
              var _x_x1_14_10466 = value_5_10294.value;
              var _x14 = $std_core_hnd._open_none1(function(maybe_0 /* maybe<kokaine/reactive/internal/model/continuation-gate> */ ) {
                  return (maybe_0 !== null);
                }, _x_x1_14_10466);
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
 
export function root_fs_dispose(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> <exn|e> () */  {
   
  var x_10655 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "reactive root disposal");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return root_fs__mlift_dispose_10591(root, wild__);
    });
  }
  else {
     
    var value_10272 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<1787> */ ) {
        return root_0.root_disposed;
      }, root);
    var _x15 = value_10272.value;
    if (_x15) {
      return $std_core_types.Unit;
    }
    else {
       
      var value_0_10274 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<1787> */ ) {
          return root_1.root_disposing;
        }, root);
      var _x16 = value_0_10274.value;
      if (_x16) {
        return $std_core_types.Unit;
      }
      else {
         
        var _x_x1_3_10450 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<1787> */ ) {
            return root_2.root_lifetime;
          }, root);
         
        var _x_x1_2_10449 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<1787> */ ) {
            return _this.lifetime_retirement;
          }, _x_x1_3_10450);
        var _x17 = $std_core_hnd._open_none1($kokaine_reactive_internal_lifetime.retirement_coordinator_fs_request_root_disposal, _x_x1_2_10449);
        if (_x17) {
           
          var target_10279 = $std_core_hnd._open_none1(function(root_3 /* kokaine/reactive/internal/model/root<1787> */ ) {
              return root_3.root_disposing;
            }, root);
          return ((target_10279).value = true);
        }
        else {
           
          var value_2_10282 = $std_core_hnd._open_none1(function(root_4 /* kokaine/reactive/internal/model/root<1787> */ ) {
              return root_4.root_batch_depth;
            }, root);
          var _x18 = $std_core_types._int_gt((value_2_10282.value),0);
          if (_x18) {
            return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
          }
          else {
             
            var value_3_10285 = $std_core_hnd._open_none1(function(root_5 /* kokaine/reactive/internal/model/root<1787> */ ) {
                return root_5.root_flushing;
              }, root);
            var _x19 = value_3_10285.value;
            if (_x19) {
              return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
            }
            else {
               
              var _x_x1_11_10459 = $std_core_hnd._open_none1(function(root_6 /* kokaine/reactive/internal/model/root<1787> */ ) {
                  return root_6.root_effect_plane;
                }, root);
               
              var value_4_10289 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<1787> */ ) {
                  return plane.plane_current;
                }, _x_x1_11_10459);
               
              var _x_x1_10_10461 = value_4_10289.value;
              var _x20 = $std_core_hnd._open_none1(function(maybe /* maybe<kokaine/reactive/internal/model/continuation-gate> */ ) {
                  return (maybe !== null);
                }, _x_x1_10_10461);
              if (_x20) {
                return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "cannot dispose a reactive root during a computation or batch");
              }
              else {
                 
                var _x_x1_15_10464 = $std_core_hnd._open_none1(function(root_7 /* kokaine/reactive/internal/model/root<1787> */ ) {
                    return root_7.root_derive_plane;
                  }, root);
                 
                var value_5_10294 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<total> */ ) {
                    return plane_0.plane_current;
                  }, _x_x1_15_10464);
                 
                var _x_x1_14_10466 = value_5_10294.value;
                var _x21 = $std_core_hnd._open_none1(function(maybe_0 /* maybe<kokaine/reactive/internal/model/continuation-gate> */ ) {
                    return (maybe_0 !== null);
                  }, _x_x1_14_10466);
                if (_x21) {
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
  var _x22 = root.root_disposed;
  return _x22.value;
}
 
 
// monadic lift
export function _mlift_update_10592(result, wild__) /* forall<a,e> (result : a, wild_ : ()) -> <kokaine/reactive/effects/signal-write,div,exn|e> a */  {
  return result;
}
 
 
// monadic lift
export function _mlift_update_10593(root, result) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, result : a) -> <kokaine/reactive/effects/signal-write,pure|e> a */  {
   
  var _x_x1_10469 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<1864> */ ) {
      return root_1.root_key;
    }, root);
   
  var x_10658 = $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag), function(key /* kokaine/reactive/internal/model/root-key */ ) {
       
      var ev_10660 = $std_core_hnd._evv_at(0);
      var _x23 = $kokaine_reactive_effects.request_flush_fs__select(ev_10660.hnd);
      return _x23(ev_10660.marker, ev_10660, key);
    }, _x_x1_10469);
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
export function _mlift_update_10594(action, root, _y_x10112) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-write,pure|e> a, root : kokaine/reactive/internal/model/root<e>, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write|e> a */  {
  return $std_core_hnd._mask_at(_y_x10112, false, function() {
       
      var x_10665 = action();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(result /* 1863 */ ) {
          return _mlift_update_10593(root, result);
        });
      }
      else {
        return _mlift_update_10593(root, x_10665);
      }
    });
}
 
export function update(root, action) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, action : () -> <kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> a */  {
  return $kokaine_reactive_internal_handlers.dispatch_handled(root, function() {
       
      var x_10667 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10112 /* hnd/ev-index */ ) {
          return _mlift_update_10594(action, root, _y_x10112);
        });
      }
      else {
        return _mlift_update_10594(action, root, x_10667);
      }
    });
}
 
 
// monadic lift
export function _mlift_sample_10595(action, _y_x10118) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-read,pure|e> a, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,kokaine/reactive/effects/signal-read|e> a */  {
  return $std_core_hnd._mask_at(_y_x10118, false, action);
}
 
export function sample(root, action) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, action : () -> <kokaine/reactive/effects/signal-read,pure|e> a) -> <exn|e> a */  {
  return $kokaine_reactive_internal_handlers.dispatch_handled(root, function() {
       
      var x_10669 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10118 /* hnd/ev-index */ ) {
          return $std_core_hnd._mask_at(_y_x10118, false, action);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_10669, false, action);
      }
    });
}
 
 
// monadic lift
export function _mlift_signal_by_10596(equals, initial, root, wild___0) /* forall<a,e> (equals : (a, a) -> bool, initial : a, root : kokaine/reactive/internal/model/root<e>, wild_@0 : ()) -> exn kokaine/reactive/internal/model/signal<a> */  {
  return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, equals);
}
 
 
// monadic lift
export function _mlift_signal_by_10597(equals, initial, root, wild__) /* forall<a,e> (equals : (a, a) -> bool, initial : a, root : kokaine/reactive/internal/model/root<e>, wild_ : ()) -> exn kokaine/reactive/internal/model/signal<a> */  {
   
  var x_10673 = $kokaine_reactive_internal_scheduler.check_registration(root);
   
  function next_10674(wild___0) /* (()) -> exn kokaine/reactive/internal/model/signal<1957> */  {
    return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, equals);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10674);
  }
  else {
    return next_10674(x_10673);
  }
}
 
export function signal_by(root, initial, equals) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, initial : a, equals : (a, a) -> bool) -> exn kokaine/reactive/internal/model/signal<a> */  {
   
  var x_10679 = $kokaine_reactive_internal_model.check_not_pure_plane("signal creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_signal_by_10597(equals, initial, root, wild__);
    });
  }
  else {
     
    var x_0_10682 = $kokaine_reactive_internal_scheduler.check_registration(root);
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
export function _mlift_signal_always_10598(initial, root, wild___0) /* forall<a,e> (initial : a, root : kokaine/reactive/internal/model/root<e>, wild_@0 : ()) -> exn kokaine/reactive/internal/model/signal<a> */  {
  return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, function(___wildcard_x198__29 /* 2105 */ , ___wildcard_x198__31 /* 2105 */ ) {
      return false;
    });
}
 
 
// monadic lift
export function _mlift_signal_always_10599(initial, root, wild__) /* forall<a,e> (initial : a, root : kokaine/reactive/internal/model/root<e>, wild_ : ()) -> exn kokaine/reactive/internal/model/signal<a> */  {
   
  var x_10689 = $kokaine_reactive_internal_scheduler.check_registration(root);
   
  function next_10690(wild___0) /* (()) -> exn kokaine/reactive/internal/model/signal<2105> */  {
    return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, function(___wildcard_x198__29 /* 2105 */ , ___wildcard_x198__31 /* 2105 */ ) {
        return false;
      });
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10690);
  }
  else {
    return next_10690(x_10689);
  }
}
 
export function signal_always(root, initial) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, initial : a) -> exn kokaine/reactive/internal/model/signal<a> */  {
   
  var x_10694 = $kokaine_reactive_internal_model.check_not_pure_plane("signal creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_signal_always_10599(initial, root, wild__);
    });
  }
  else {
     
    var x_0_10697 = $kokaine_reactive_internal_scheduler.check_registration(root);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, function(___wildcard_x198__29 /* 2105 */ , ___wildcard_x198__31 /* 2105 */ ) {
            return false;
          });
      });
    }
    else {
      return $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, function(___wildcard_x198__29_0 /* 2105 */ , ___wildcard_x198__31_0 /* 2105 */ ) {
          return false;
        });
    }
  }
}
 
export function signal_fs_get(signal_0) /* forall<a> (signal : kokaine/reactive/internal/model/signal<a>) -> kokaine/reactive/effects/signal-read a */  {
   
  var source_10044 = $std_core_hnd._open_none1(function(signal_1 /* kokaine/reactive/internal/model/signal<2140> */ ) {
      return signal_1;
    }, signal_0);
  return $std_core_hnd._perform3($std_core_hnd._evv_at(0), $kokaine_reactive_effects.read_source_fs__select, source_10044, $kokaine_reactive_internal_model.Track_read, $std_core_types.Nothing);
}
 
export function signal_fs_set(signal_0, value) /* forall<a> (signal : kokaine/reactive/internal/model/signal<a>, value : a) -> kokaine/reactive/effects/signal-write () */  {
   
  var source_10047 = $std_core_hnd._open_none1(function(signal_1 /* kokaine/reactive/internal/model/signal<2168> */ ) {
      return signal_1;
    }, signal_0);
   
  var evx_10703 = $std_core_hnd._evv_at(0);
  var _x23 = $kokaine_reactive_effects.write_source_fs__select(evx_10703.hnd);
  return _x23(evx_10703.marker, evx_10703, source_10047, value);
}
 
export function signal_fs_modify(signal_0, update_0) /* forall<a> (signal : kokaine/reactive/internal/model/signal<a>, update : (a) -> a) -> kokaine/reactive/effects/signal-write () */  {
   
  var source_10049 = $std_core_hnd._open_none1(function(signal_1 /* kokaine/reactive/internal/model/signal<2198> */ ) {
      return signal_1;
    }, signal_0);
   
  var evx_10707 = $std_core_hnd._evv_at(0);
  var _x24 = $kokaine_reactive_effects.modify_source_fs__select(evx_10707.hnd);
  return _x24(evx_10707.marker, evx_10707, source_10049, update_0);
}
 
export function signal_fs_update(signal_0, update_0) /* forall<a> (signal : kokaine/reactive/internal/model/signal<a>, update : (a) -> a) -> kokaine/reactive/effects/signal-write () */  {
  return signal_fs_modify(signal_0, update_0);
}
 
 
// monadic lift
export function _mlift_batch_10600(action, root, wild__) /* forall<a,e,e1> (action : () -> <kokaine/reactive/effects/signal-write,pure|e1> a, root : kokaine/reactive/internal/model/root<e>, wild_ : ()) -> <kokaine/reactive/effects/signal-write,div,exn|e1> a */  {
  return $std_core_hnd.finally_prompt(function() {
       
      var _x_x1_1_10482 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<2292> */ ) {
          return root_1.root_key;
        }, root);
      return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag), function(key_0 /* kokaine/reactive/internal/model/root-key */ ) {
           
          var ev_10713 = $std_core_hnd._evv_at(0);
          var _x25 = $kokaine_reactive_effects.leave_batch_fs__select(ev_10713.hnd);
          return _x25(ev_10713.marker, ev_10713, key_0);
        }, _x_x1_1_10482);
    }, action());
}
 
export function batch(root, action) /* forall<a,e,e1> (root : kokaine/reactive/internal/model/root<e>, action : () -> <kokaine/reactive/effects/signal-write,pure|e1> a) -> <kokaine/reactive/effects/signal-write,pure|e1> a */  {
   
  var _x_x1_10480 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<2292> */ ) {
      return root_0.root_key;
    }, root);
   
  var x_10716 = $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag), function(key /* kokaine/reactive/internal/model/root-key */ ) {
       
      var ev_10719 = $std_core_hnd._evv_at(0);
      var _x26 = $kokaine_reactive_effects.enter_batch_fs__select(ev_10719.hnd);
      return _x26(ev_10719.marker, ev_10719, key);
    }, _x_x1_10480);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_batch_10600(action, root, wild__);
    });
  }
  else {
    return $std_core_hnd.finally_prompt(function() {
         
        var _x_x1_1_10482 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<2292> */ ) {
            return root_1.root_key;
          }, root);
        return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag), function(key_0 /* kokaine/reactive/internal/model/root-key */ ) {
             
            var ev_0_10724 = $std_core_hnd._evv_at(0);
            var _x26 = $kokaine_reactive_effects.leave_batch_fs__select(ev_0_10724.hnd);
            return _x26(ev_0_10724.marker, ev_0_10724, key_0);
          }, _x_x1_1_10482);
      }, action());
  }
}
 
 
// monadic lift
export function _mlift_untrack_10601(action, _y_x10139) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-read,pure|e> a, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-read,div,exn|e> a */  {
  return $std_core_hnd._mask_at(_y_x10139, true, action);
}
 
export function untrack(action) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-read,pure|e> a) -> <kokaine/reactive/effects/signal-read,pure|e> a */  {
  return $kokaine_reactive_effects.signal_read_fs__handle($kokaine_reactive_effects._Hnd_signal_read(1, $std_core_hnd.clause_tail1(function(_pat_x765__20 /* (kokaine/reactive/internal/model/source<_2315>, kokaine/reactive/internal/model/read-mode, maybe<kokaine/reactive/internal/model/derive-producer>) */ ) {
        return $std_core_hnd._open_at3($std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag), function(source_0 /* kokaine/reactive/internal/model/source<2388> */ , mode /* kokaine/reactive/internal/model/read-mode */ , producer_0 /* maybe<kokaine/reactive/internal/model/derive-producer> */ ) {
            return $std_core_hnd._perform3($std_core_hnd._evv_at(0), $kokaine_reactive_effects.read_source_fs__select, source_0, mode, producer_0);
          }, _pat_x765__20.fst, $kokaine_reactive_internal_model.Sample_read, _pat_x765__20.thd);
      }), $std_core_hnd.clause_tail1(function(producer_0_0 /* kokaine/reactive/internal/model/derive-producer */ ) {
        return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag), function(producer_1 /* kokaine/reactive/internal/model/derive-producer */ ) {
             
            var ev_10728 = $std_core_hnd._evv_at(0);
            var _x27 = $kokaine_reactive_effects.validate_derived_fs__select(ev_10728.hnd);
            return _x27(ev_10728.marker, ev_10728, producer_1);
          }, producer_0_0);
      })), function(_res /* 2445 */ ) {
      return _res;
    }, function() {
       
      var x_0_10731 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10139 /* hnd/ev-index */ ) {
          return $std_core_hnd._mask_at(_y_x10139, true, action);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_0_10731, true, action);
      }
    });
}
 
 
// monadic lift
export function _mlift_create_effect_inner_10602(dispose, wild___3) /* forall<e> (dispose : kokaine/reactive/internal/model/disposer<e>, wild_@3 : ()) -> <kokaine/reactive/effects/signal-write,exn,div> kokaine/reactive/internal/model/disposer<e> */  {
  return dispose;
}
 
 
// monadic lift
export function _mlift_create_effect_inner_10603(bootstrap, current, dispose, plane, root, registration) /* forall<_e,e1> (bootstrap : kokaine/reactive/internal/model/work<e1>, current : kokaine/reactive/internal/model/continuation-scope<e1>, dispose : kokaine/reactive/internal/model/disposer<e1>, plane : kokaine/reactive/internal/model/plane<e1>, root : kokaine/reactive/internal/model/root<e1>, registration : kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<e1>>) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/disposer<e1> */  {
   
  var target_10323 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/continuation-scope<2661> */ ) {
      return _this.scope_unlink;
    }, current);
   
  ((target_10323).value = ($std_core_types.Just(function() {
     
    var maybe_10051 = $kokaine_internal_registry.registry_registration_fs_take(registration);
    return (maybe_10051 !== null);
  })));
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_scheduler.queue_work, plane, bootstrap);
   
  var _x_x1_10_10507 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<2661> */ ) {
      return root_1.root_key;
    }, root);
   
  var x_10735 = $std_core_hnd._open_at1(1, function(key /* kokaine/reactive/internal/model/root-key */ ) {
       
      var ev_10737 = $std_core_hnd._evv_at(0);
      var _x28 = $kokaine_reactive_effects.request_flush_fs__select(ev_10737.hnd);
      return _x28(ev_10737.marker, ev_10737, key);
    }, _x_x1_10_10507);
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
export function _mlift_create_effect_inner_10604(apply, owner, owner_slot, plane, root, track, wild___0) /* forall<_e,_e1,a,e2> (apply : (value : a) -> <kokaine/reactive/effects/signal-write,pure|e2> (), owner : kokaine/reactive/internal/model/frame<e2>, owner-slot : ref<global,maybe<kokaine/reactive/internal/model/derive-producer>>, plane : kokaine/reactive/internal/model/plane<e2>, root : kokaine/reactive/internal/model/root<e2>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, wild_@0 : ()) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/disposer<e2> */  {
   
  var value_1_10318 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<2661> */ ) {
      return plane_1.plane_current;
    }, plane);
   
  var _x_x4_10497 = value_1_10318.value;
  var _x28 = $std_core_hnd._open_none0(function() {
    return $kokaine_reactive_internal_capture.prepare_trace(root, plane, owner_slot, _x_x4_10497, track, function(value_2 /* 2660 */ ) {
        return $kokaine_reactive_internal_handlers.interpret_write(root, function() {
            return apply(value_2);
          });
      });
  });
   
  var _x_x1_5_10500 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<2661> */ ) {
      return frame;
    }, owner);
   
  var _x_x2_1_10501 = $std_core_hnd._open_none1(function(current_0 /* kokaine/reactive/internal/model/continuation-scope<2661> */ ) {
      return $kokaine_reactive_internal_model.Retirement_step(function() {
        return $kokaine_reactive_internal_lifetime.scope_retirement_expand(current_0);
      });
    }, _x28.fst);
   
  var x_10742 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_child, _x_x1_5_10500, _x_x2_1_10501);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(registration /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<2661>> */ ) {
      return _mlift_create_effect_inner_10603(_x28.snd, _x28.fst, _x28.thd, plane, root, registration);
    });
  }
  else {
    return _mlift_create_effect_inner_10603(_x28.snd, _x28.fst, _x28.thd, plane, root, x_10742);
  }
}
 
 
// monadic lift
export function _mlift_create_effect_inner_10605(apply, root, track, wild__) /* forall<_e,_e1,_e2,a,e3> (apply : (value : a) -> <kokaine/reactive/effects/signal-write,pure|e3> (), root : kokaine/reactive/internal/model/root<e3>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, wild_ : ()) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/disposer<e3> */  {
   
  var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<2661> */ ) {
      return root_0.root_effect_plane;
    }, root);
   
  var owner_slot = { value: ($std_core_types.Nothing) };
   
  var value_0_10314 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<2661> */ ) {
      return plane_0.plane_current_frame;
    }, plane);
   
  var owner = value_0_10314.value;
   
  var x_10744 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_scheduler.check_frame_registration, root, owner);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_create_effect_inner_10604(apply, owner, owner_slot, plane, root, track, wild___0);
    });
  }
  else {
    return _mlift_create_effect_inner_10604(apply, owner, owner_slot, plane, root, track, x_10744);
  }
}
 
export function create_effect_inner(root, track, apply) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, apply : (value : a) -> <kokaine/reactive/effects/signal-write,pure|e> ()) -> <kokaine/reactive/effects/signal-write,pure> kokaine/reactive/internal/model/disposer<e> */  {
   
  var x_10746 = $std_core_hnd._open_at1(0, $kokaine_reactive_internal_model.check_not_pure_plane, "effect creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_create_effect_inner_10605(apply, root, track, wild__);
    });
  }
  else {
     
    var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<2661> */ ) {
        return root_0.root_effect_plane;
      }, root);
     
    var owner_slot = { value: ($std_core_types.Nothing) };
     
    var value_0_10314 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<2661> */ ) {
        return plane_0.plane_current_frame;
      }, plane);
     
    var owner = value_0_10314.value;
     
    var x_0_10749 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_scheduler.check_frame_registration, root, owner);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return _mlift_create_effect_inner_10604(apply, owner, owner_slot, plane, root, track, wild___0);
      });
    }
    else {
       
      var value_1_10318 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<2661> */ ) {
          return plane_1.plane_current;
        }, plane);
       
      var _x_x4_10497 = value_1_10318.value;
      var _x29 = $std_core_hnd._open_none0(function() {
        return $kokaine_reactive_internal_capture.prepare_trace(root, plane, owner_slot, _x_x4_10497, track, function(value_2 /* 2660 */ ) {
            return $kokaine_reactive_internal_handlers.interpret_write(root, function() {
                return apply(value_2);
              });
          });
      });
       
      var _x_x1_5_10500 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<2661> */ ) {
          return frame;
        }, owner);
       
      var _x_x2_1_10501 = $std_core_hnd._open_none1(function(current_0 /* kokaine/reactive/internal/model/continuation-scope<2661> */ ) {
          return $kokaine_reactive_internal_model.Retirement_step(function() {
            return $kokaine_reactive_internal_lifetime.scope_retirement_expand(current_0);
          });
        }, _x29.fst);
       
      var x_1_10752 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_child, _x_x1_5_10500, _x_x2_1_10501);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(registration /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<2661>> */ ) {
          return _mlift_create_effect_inner_10603(_x29.snd, _x29.fst, _x29.thd, plane, root, registration);
        });
      }
      else {
         
        var target_10323 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/continuation-scope<2661> */ ) {
            return _this.scope_unlink;
          }, _x29.fst);
         
        ((target_10323).value = ($std_core_types.Just(function() {
           
          var maybe_10051 = $kokaine_internal_registry.registry_registration_fs_take(x_1_10752);
          return (maybe_10051 !== null);
        })));
         
        $std_core_hnd._open_none2($kokaine_reactive_internal_scheduler.queue_work, plane, _x29.snd);
         
        var _x_x1_10_10507 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<2661> */ ) {
            return root_1.root_key;
          }, root);
         
        var x_2_10755 = $std_core_hnd._open_at1(1, function(key /* kokaine/reactive/internal/model/root-key */ ) {
             
            var ev_10758 = $std_core_hnd._evv_at(0);
            var _x30 = $kokaine_reactive_effects.request_flush_fs__select(ev_10758.hnd);
            return _x30(ev_10758.marker, ev_10758, key);
          }, _x_x1_10_10507);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(wild___3 /* () */ ) {
            return _x29.thd;
          });
        }
        else {
          return _x29.thd;
        }
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_commit_derived_10606(source, value, _y_x10151) /* forall<_e,_e1,a> (source : kokaine/reactive/internal/model/source<a>, value : a, bool) -> exn () */  {
  if (_y_x10151) {
    return $std_core_types.Unit;
  }
  else {
     
    var target_10334 = $std_core_hnd._open_none1(function(source_3 /* kokaine/reactive/internal/model/source<2788> */ ) {
        return source_3.source_cell;
      }, source);
     
    ((target_10334).value = value);
     
    var target_0_10337 = $std_core_hnd._open_none1(function(source_4 /* kokaine/reactive/internal/model/source<2788> */ ) {
        return source_4.source_version;
      }, source);
     
    var value_3_10342 = $std_core_hnd._open_none1(function(source_5 /* kokaine/reactive/internal/model/source<2788> */ ) {
        return source_5.source_version;
      }, source);
     
    var x_10340 = value_3_10342.value;
     
    var value_2_10338 = $std_core_types._int_add(x_10340,1);
     
    ((target_0_10337).value = value_2_10338);
    return $std_core_hnd._open_none1(function(source_6 /* kokaine/reactive/internal/model/source<2788> */ ) {
        var _x30 = source_6.source_captures;
        return $std_core_list.foreach($kokaine_internal_registry.registry_fs_snapshot(_x30), $kokaine_reactive_internal_scheduler.cut_capture);
      }, source);
  }
}
 
 
// monadic lift
export function _mlift_commit_derived_10607(source, value, wild__) /* forall<_e,_e1,a> (source : kokaine/reactive/internal/model/source<a>, value : a, wild_ : ()) -> exn () */  {
   
  var value_0_10330 = $std_core_hnd._open_none1(function(source_1 /* kokaine/reactive/internal/model/source<2788> */ ) {
      return source_1.source_cell;
    }, source);
   
  var previous = value_0_10330.value;
   
  var _x_x0_1_10332 = $std_core_hnd._open_none1(function(source_2 /* kokaine/reactive/internal/model/source<2788> */ ) {
      return source_2.source_equals;
    }, source);
   
  var x_10763 = $std_core_hnd._open_none2(_x_x0_1_10332, previous, value);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10151 /* bool */ ) {
      return _mlift_commit_derived_10606(source, value, _y_x10151);
    });
  }
  else {
    return _mlift_commit_derived_10606(source, value, x_10763);
  }
}
 
export function commit_derived(root, source, value) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, source : kokaine/reactive/internal/model/source<a>, value : a) -> exn () */  {
   
  var x_10765 = $kokaine_reactive_internal_scheduler.check_root(root, $std_core_hnd._open_none1(function(source_0 /* kokaine/reactive/internal/model/source<2788> */ ) {
        return source_0.source_root;
      }, source));
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_commit_derived_10607(source, value, wild__);
    });
  }
  else {
     
    var value_0_10330 = $std_core_hnd._open_none1(function(source_1 /* kokaine/reactive/internal/model/source<2788> */ ) {
        return source_1.source_cell;
      }, source);
     
    var previous = value_0_10330.value;
     
    var _x_x0_1_10332 = $std_core_hnd._open_none1(function(source_2 /* kokaine/reactive/internal/model/source<2788> */ ) {
        return source_2.source_equals;
      }, source);
     
    var x_0_10768 = $std_core_hnd._open_none2(_x_x0_1_10332, previous, value);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10151 /* bool */ ) {
        return _mlift_commit_derived_10606(source, value, _y_x10151);
      });
    }
    else {
      if (x_0_10768) {
        return $std_core_types.Unit;
      }
      else {
         
        var target_10334 = $std_core_hnd._open_none1(function(source_3 /* kokaine/reactive/internal/model/source<2788> */ ) {
            return source_3.source_cell;
          }, source);
         
        ((target_10334).value = value);
         
        var target_0_10337 = $std_core_hnd._open_none1(function(source_4 /* kokaine/reactive/internal/model/source<2788> */ ) {
            return source_4.source_version;
          }, source);
         
        var value_3_10342 = $std_core_hnd._open_none1(function(source_5 /* kokaine/reactive/internal/model/source<2788> */ ) {
            return source_5.source_version;
          }, source);
         
        var x_10340 = value_3_10342.value;
         
        var value_2_10338 = $std_core_types._int_add(x_10340,1);
         
        ((target_0_10337).value = value_2_10338);
        return $std_core_hnd._open_none1(function(source_6 /* kokaine/reactive/internal/model/source<2788> */ ) {
            var _x31 = source_6.source_captures;
            return $std_core_list.foreach($kokaine_internal_registry.registry_fs_snapshot(_x31), $kokaine_reactive_internal_scheduler.cut_capture);
          }, source);
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_derive_by_inner_10608(producer, source, wild___5) /* forall<a> (producer : kokaine/reactive/internal/model/derive-producer, source : kokaine/reactive/internal/model/source<a>, wild_@5 : ()) -> <kokaine/reactive/effects/signal-write,exn,div> kokaine/reactive/internal/model/memo<a> */  {
  return $kokaine_reactive_internal_model.Memo(source, producer);
}
 
 
// monadic lift
export function _mlift_derive_by_inner_10609(bootstrap, current, derive_plane, producer, root, source, registration) /* forall<_e,a,e1> (bootstrap : kokaine/reactive/internal/model/work<total>, current : kokaine/reactive/internal/model/continuation-scope<total>, derive-plane : kokaine/reactive/internal/model/plane<total>, producer : kokaine/reactive/internal/model/derive-producer, root : kokaine/reactive/internal/model/root<e1>, source : kokaine/reactive/internal/model/source<a>, registration : kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<e1>>) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/memo<a> */  {
   
  var target_0_10364 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/continuation-scope<total> */ ) {
      return _this.scope_unlink;
    }, current);
   
  ((target_0_10364).value = ($std_core_types.Just(function() {
     
    var maybe_10053 = $kokaine_internal_registry.registry_registration_fs_take(registration);
    return (maybe_10053 !== null);
  })));
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_scheduler.queue_work, derive_plane, bootstrap);
   
  var _x_x1_14_10543 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<3094> */ ) {
      return root_2.root_key;
    }, root);
   
  var x_10771 = $std_core_hnd._open_at1(1, function(key /* kokaine/reactive/internal/model/root-key */ ) {
       
      var ev_10773 = $std_core_hnd._evv_at(0);
      var _x32 = $kokaine_reactive_effects.request_flush_fs__select(ev_10773.hnd);
      return _x32(ev_10773.marker, ev_10773, key);
    }, _x_x1_14_10543);
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
export function _mlift_derive_by_inner_10610(bootstrap, current, derive_plane, owner, producer, root, source, structural) /* forall<_e,a,e1> (bootstrap : kokaine/reactive/internal/model/work<total>, current : kokaine/reactive/internal/model/continuation-scope<total>, derive-plane : kokaine/reactive/internal/model/plane<total>, owner : kokaine/reactive/internal/model/frame<e1>, producer : kokaine/reactive/internal/model/derive-producer, root : kokaine/reactive/internal/model/root<e1>, source : kokaine/reactive/internal/model/source<a>, structural : kokaine/reactive/internal/model/retirement-work<e1>) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/memo<a> */  {
   
  var _x_x1_10_10537 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<3094> */ ) {
      return frame;
    }, owner);
   
  var x_10779 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_child, _x_x1_10_10537, structural);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(registration /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<3094>> */ ) {
      return _mlift_derive_by_inner_10609(bootstrap, current, derive_plane, producer, root, source, registration);
    });
  }
  else {
    return _mlift_derive_by_inner_10609(bootstrap, current, derive_plane, producer, root, source, x_10779);
  }
}
 
 
// monadic lift
export function _mlift_derive_by_inner_10611(calculate, effect_plane, owner, root, source, wild___1) /* forall<_e,_e1,_e2,a,e3> (calculate : () -> <kokaine/reactive/effects/signal-read,pure> a, effect-plane : kokaine/reactive/internal/model/plane<e3>, owner : kokaine/reactive/internal/model/frame<e3>, root : kokaine/reactive/internal/model/root<e3>, source : kokaine/reactive/internal/model/source<a>, wild_@1 : ()) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/memo<a> */  {
   
  var derive_plane = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<3094> */ ) {
      return root_1.root_derive_plane;
    }, root);
   
  var owner_slot = { value: ($std_core_types.Nothing) };
   
  var value_1_10355 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<3094> */ ) {
      return plane_0.plane_current;
    }, effect_plane);
   
  var _x_x4_10532 = value_1_10355.value;
  var _x32 = $std_core_hnd._open_none0(function() {
    return $kokaine_reactive_internal_capture.prepare_trace(root, derive_plane, owner_slot, _x_x4_10532, calculate, function(value_2 /* 3093 */ ) {
        return commit_derived(root, source, value_2);
      });
  });
   
  var producer = $kokaine_reactive_internal_model.Derive_producer(derive_plane, _x32.fst, { value: false });
   
  ((owner_slot).value = ($std_core_types.Just(producer)));
   
  var _x_x1_8_10535 = $std_core_hnd._open_none1(function(current_0 /* kokaine/reactive/internal/model/continuation-scope<total> */ ) {
      return $kokaine_reactive_internal_model.Retirement_step(function() {
        return $kokaine_reactive_internal_lifetime.scope_retirement_expand(current_0);
      });
    }, _x32.fst);
   
  var x_10781 = $std_core_hnd._open_none1($kokaine_reactive_internal_lifetime.widen_pure_retirement, _x_x1_8_10535);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(structural /* kokaine/reactive/internal/model/retirement-work<3094> */ ) {
      return _mlift_derive_by_inner_10610(_x32.snd, _x32.fst, derive_plane, owner, producer, root, source, structural);
    });
  }
  else {
    return _mlift_derive_by_inner_10610(_x32.snd, _x32.fst, derive_plane, owner, producer, root, source, x_10781);
  }
}
 
 
// monadic lift
export function _mlift_derive_by_inner_10612(calculate, equals, initial, root, wild___0) /* forall<_e,_e1,_e2,a,e3> (calculate : () -> <kokaine/reactive/effects/signal-read,pure> a, equals : (a, a) -> bool, initial : a, root : kokaine/reactive/internal/model/root<e3>, wild_@0 : ()) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/memo<a> */  {
   
  var source = $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, equals);
   
  var effect_plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<3094> */ ) {
      return root_0.root_effect_plane;
    }, root);
   
  var value_10349 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<3094> */ ) {
      return plane.plane_current_frame;
    }, effect_plane);
   
  var owner = value_10349.value;
   
  var x_10783 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_scheduler.check_frame_registration, root, owner);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___1 /* () */ ) {
      return _mlift_derive_by_inner_10611(calculate, effect_plane, owner, root, source, wild___1);
    });
  }
  else {
    return _mlift_derive_by_inner_10611(calculate, effect_plane, owner, root, source, x_10783);
  }
}
 
 
// monadic lift
export function _mlift_derive_by_inner_10613(calculate, equals, initial, root, wild__) /* forall<_e,_e1,_e2,a,e3> (calculate : () -> <kokaine/reactive/effects/signal-read,pure> a, equals : (a, a) -> bool, initial : a, root : kokaine/reactive/internal/model/root<e3>, wild_ : ()) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/memo<a> */  {
   
  var x_10785 = $std_core_hnd._open_at1(0, $kokaine_reactive_internal_scheduler.check_registration, root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_derive_by_inner_10612(calculate, equals, initial, root, wild___0);
    });
  }
  else {
    return _mlift_derive_by_inner_10612(calculate, equals, initial, root, x_10785);
  }
}
 
export function derive_by_inner(root, initial, calculate, equals) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, initial : a, calculate : () -> <kokaine/reactive/effects/signal-read,pure> a, equals : (a, a) -> bool) -> <kokaine/reactive/effects/signal-write,pure> kokaine/reactive/internal/model/memo<a> */  {
   
  var x_10787 = $std_core_hnd._open_at1(0, $kokaine_reactive_internal_model.check_not_pure_plane, "derivation creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_derive_by_inner_10613(calculate, equals, initial, root, wild__);
    });
  }
  else {
     
    var x_0_10790 = $std_core_hnd._open_at1(0, $kokaine_reactive_internal_scheduler.check_registration, root);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return _mlift_derive_by_inner_10612(calculate, equals, initial, root, wild___0);
      });
    }
    else {
       
      var source = $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, equals);
       
      var effect_plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<3094> */ ) {
          return root_0.root_effect_plane;
        }, root);
       
      var value_10349 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<3094> */ ) {
          return plane.plane_current_frame;
        }, effect_plane);
       
      var owner = value_10349.value;
       
      var x_1_10793 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_scheduler.check_frame_registration, root, owner);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild___1 /* () */ ) {
          return _mlift_derive_by_inner_10611(calculate, effect_plane, owner, root, source, wild___1);
        });
      }
      else {
         
        var derive_plane = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<3094> */ ) {
            return root_1.root_derive_plane;
          }, root);
         
        var owner_slot = { value: ($std_core_types.Nothing) };
         
        var value_1_10355 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<3094> */ ) {
            return plane_0.plane_current;
          }, effect_plane);
         
        var _x_x4_10532 = value_1_10355.value;
        var _x33 = $std_core_hnd._open_none0(function() {
          return $kokaine_reactive_internal_capture.prepare_trace(root, derive_plane, owner_slot, _x_x4_10532, calculate, function(value_2 /* 3093 */ ) {
              return commit_derived(root, source, value_2);
            });
        });
         
        var producer = $kokaine_reactive_internal_model.Derive_producer(derive_plane, _x33.fst, { value: false });
         
        ((owner_slot).value = ($std_core_types.Just(producer)));
         
        var _x_x1_8_10535 = $std_core_hnd._open_none1(function(current_0 /* kokaine/reactive/internal/model/continuation-scope<total> */ ) {
            return $kokaine_reactive_internal_model.Retirement_step(function() {
              return $kokaine_reactive_internal_lifetime.scope_retirement_expand(current_0);
            });
          }, _x33.fst);
         
        var x_2_10796 = $std_core_hnd._open_none1($kokaine_reactive_internal_lifetime.widen_pure_retirement, _x_x1_8_10535);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(structural /* kokaine/reactive/internal/model/retirement-work<3094> */ ) {
            return _mlift_derive_by_inner_10610(_x33.snd, _x33.fst, derive_plane, owner, producer, root, source, structural);
          });
        }
        else {
           
          var _x_x1_10_10537 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<3094> */ ) {
              return frame;
            }, owner);
           
          var x_3_10799 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_child, _x_x1_10_10537, x_2_10796);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(registration /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<3094>> */ ) {
              return _mlift_derive_by_inner_10609(_x33.snd, _x33.fst, derive_plane, producer, root, source, registration);
            });
          }
          else {
             
            var target_0_10364 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/continuation-scope<total> */ ) {
                return _this.scope_unlink;
              }, _x33.fst);
             
            ((target_0_10364).value = ($std_core_types.Just(function() {
               
              var maybe_10053 = $kokaine_internal_registry.registry_registration_fs_take(x_3_10799);
              return (maybe_10053 !== null);
            })));
             
            $std_core_hnd._open_none2($kokaine_reactive_internal_scheduler.queue_work, derive_plane, _x33.snd);
             
            var _x_x1_14_10543 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<3094> */ ) {
                return root_2.root_key;
              }, root);
             
            var x_4_10802 = $std_core_hnd._open_at1(1, function(key /* kokaine/reactive/internal/model/root-key */ ) {
                 
                var ev_10805 = $std_core_hnd._evv_at(0);
                var _x34 = $kokaine_reactive_effects.request_flush_fs__select(ev_10805.hnd);
                return _x34(ev_10805.marker, ev_10805, key);
              }, _x_x1_14_10543);
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
  return derive_by_inner(root, initial, calculate, function(___wildcard_x299__39 /* 3289 */ , ___wildcard_x299__41 /* 3289 */ ) {
      return false;
    });
}
 
 
// monadic lift
export function _mlift_memo_by_inner_10614(producer_0, source, wild___5) /* forall<a> (producer@0 : kokaine/reactive/internal/model/derive-producer, source : kokaine/reactive/internal/model/source<a>, wild_@5 : ()) -> <kokaine/reactive/effects/signal-write,exn,div> kokaine/reactive/internal/model/memo<a> */  {
  return $kokaine_reactive_internal_model.Memo(source, producer_0);
}
 
 
// monadic lift
export function _mlift_memo_by_inner_10615(bootstrap, current, derive_plane, producer_0, root, source, registration) /* forall<_e,a,e1> (bootstrap : kokaine/reactive/internal/model/work<total>, current : kokaine/reactive/internal/model/continuation-scope<total>, derive-plane : kokaine/reactive/internal/model/plane<total>, producer@0 : kokaine/reactive/internal/model/derive-producer, root : kokaine/reactive/internal/model/root<e1>, source : kokaine/reactive/internal/model/source<a>, registration : kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<e1>>) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/memo<a> */  {
   
  var target_0_10390 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/continuation-scope<total> */ ) {
      return _this.scope_unlink;
    }, current);
   
  ((target_0_10390).value = ($std_core_types.Just(function() {
     
    var maybe_10063 = $kokaine_internal_registry.registry_registration_fs_take(registration);
    return (maybe_10063 !== null);
  })));
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_scheduler.queue_work, derive_plane, bootstrap);
   
  var _x_x1_15_10573 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<3612> */ ) {
      return root_2.root_key;
    }, root);
   
  var x_10811 = $std_core_hnd._open_at1(1, function(key /* kokaine/reactive/internal/model/root-key */ ) {
       
      var ev_10813 = $std_core_hnd._evv_at(0);
      var _x34 = $kokaine_reactive_effects.request_flush_fs__select(ev_10813.hnd);
      return _x34(ev_10813.marker, ev_10813, key);
    }, _x_x1_15_10573);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___5 /* () */ ) {
      return $kokaine_reactive_internal_model.Memo(source, producer_0);
    });
  }
  else {
    return $kokaine_reactive_internal_model.Memo(source, producer_0);
  }
}
 
 
// monadic lift
export function _mlift_memo_by_inner_10616(bootstrap, current, derive_plane, owner, producer_0, root, source, structural) /* forall<_e,a,e1> (bootstrap : kokaine/reactive/internal/model/work<total>, current : kokaine/reactive/internal/model/continuation-scope<total>, derive-plane : kokaine/reactive/internal/model/plane<total>, owner : kokaine/reactive/internal/model/frame<e1>, producer@0 : kokaine/reactive/internal/model/derive-producer, root : kokaine/reactive/internal/model/root<e1>, source : kokaine/reactive/internal/model/source<a>, structural : kokaine/reactive/internal/model/retirement-work<e1>) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/memo<a> */  {
   
  var _x_x1_11_10567 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<3612> */ ) {
      return frame;
    }, owner);
   
  var x_10819 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_child, _x_x1_11_10567, structural);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(registration /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<3612>> */ ) {
      return _mlift_memo_by_inner_10615(bootstrap, current, derive_plane, producer_0, root, source, registration);
    });
  }
  else {
    return _mlift_memo_by_inner_10615(bootstrap, current, derive_plane, producer_0, root, source, x_10819);
  }
}
 
 
// monadic lift
export function _mlift_memo_by_inner_10617(calculate, effect_plane, owner, root, source, wild___1) /* forall<_e,_e1,_e2,a,e3> (calculate : (previous : a) -> <kokaine/reactive/effects/signal-read,pure> a, effect-plane : kokaine/reactive/internal/model/plane<e3>, owner : kokaine/reactive/internal/model/frame<e3>, root : kokaine/reactive/internal/model/root<e3>, source : kokaine/reactive/internal/model/source<a>, wild_@1 : ()) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/memo<a> */  {
   
  var derive_plane = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<3612> */ ) {
      return root_1.root_derive_plane;
    }, root);
   
  var owner_slot = { value: ($std_core_types.Nothing) };
   
  var value_1_10380 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<3612> */ ) {
      return plane_0.plane_current;
    }, effect_plane);
   
  var _x_x4_10559 = value_1_10380.value;
  var _x34 = $std_core_hnd._open_none0(function() {
    return $kokaine_reactive_internal_capture.prepare_trace(root, derive_plane, owner_slot, _x_x4_10559, function() {
         
        var x_10821 = $std_core_hnd._open_at3(1, function(source_0 /* kokaine/reactive/internal/model/source<3611> */ , mode /* kokaine/reactive/internal/model/read-mode */ , producer /* maybe<kokaine/reactive/internal/model/derive-producer> */ ) {
            return $std_core_hnd._perform3($std_core_hnd._evv_at(0), $kokaine_reactive_effects.read_source_fs__select, source_0, mode, producer);
          }, source, $kokaine_reactive_internal_model.State_entry_read, $std_core_types.Nothing);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(calculate);
        }
        else {
          return calculate(x_10821);
        }
      }, function(value_2 /* 3611 */ ) {
        return commit_derived(root, source, value_2);
      });
  });
   
  var producer_0 = $kokaine_reactive_internal_model.Derive_producer(derive_plane, _x34.fst, { value: false });
   
  ((owner_slot).value = ($std_core_types.Just(producer_0)));
   
  var _x_x1_9_10565 = $std_core_hnd._open_none1(function(current_0 /* kokaine/reactive/internal/model/continuation-scope<total> */ ) {
      return $kokaine_reactive_internal_model.Retirement_step(function() {
        return $kokaine_reactive_internal_lifetime.scope_retirement_expand(current_0);
      });
    }, _x34.fst);
   
  var x_0_10823 = $std_core_hnd._open_none1($kokaine_reactive_internal_lifetime.widen_pure_retirement, _x_x1_9_10565);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(structural /* kokaine/reactive/internal/model/retirement-work<3612> */ ) {
      return _mlift_memo_by_inner_10616(_x34.snd, _x34.fst, derive_plane, owner, producer_0, root, source, structural);
    });
  }
  else {
    return _mlift_memo_by_inner_10616(_x34.snd, _x34.fst, derive_plane, owner, producer_0, root, source, x_0_10823);
  }
}
 
 
// monadic lift
export function _mlift_memo_by_inner_10618(calculate, equals, initial, root, wild___0) /* forall<_e,_e1,_e2,a,e3> (calculate : (previous : a) -> <kokaine/reactive/effects/signal-read,pure> a, equals : (a, a) -> bool, initial : a, root : kokaine/reactive/internal/model/root<e3>, wild_@0 : ()) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/memo<a> */  {
   
  var source = $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, equals);
   
  var effect_plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<3612> */ ) {
      return root_0.root_effect_plane;
    }, root);
   
  var value_10374 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<3612> */ ) {
      return plane.plane_current_frame;
    }, effect_plane);
   
  var owner = value_10374.value;
   
  var x_10825 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_scheduler.check_frame_registration, root, owner);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___1 /* () */ ) {
      return _mlift_memo_by_inner_10617(calculate, effect_plane, owner, root, source, wild___1);
    });
  }
  else {
    return _mlift_memo_by_inner_10617(calculate, effect_plane, owner, root, source, x_10825);
  }
}
 
 
// monadic lift
export function _mlift_memo_by_inner_10619(calculate, equals, initial, root, wild__) /* forall<_e,_e1,_e2,a,e3> (calculate : (previous : a) -> <kokaine/reactive/effects/signal-read,pure> a, equals : (a, a) -> bool, initial : a, root : kokaine/reactive/internal/model/root<e3>, wild_ : ()) -> <exn,kokaine/reactive/effects/signal-write,div> kokaine/reactive/internal/model/memo<a> */  {
   
  var x_10827 = $std_core_hnd._open_at1(0, $kokaine_reactive_internal_scheduler.check_registration, root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_memo_by_inner_10618(calculate, equals, initial, root, wild___0);
    });
  }
  else {
    return _mlift_memo_by_inner_10618(calculate, equals, initial, root, x_10827);
  }
}
 
export function memo_by_inner(root, initial, calculate, equals) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, initial : a, calculate : (previous : a) -> <kokaine/reactive/effects/signal-read,pure> a, equals : (a, a) -> bool) -> <kokaine/reactive/effects/signal-write,pure> kokaine/reactive/internal/model/memo<a> */  {
   
  var x_10829 = $std_core_hnd._open_at1(0, $kokaine_reactive_internal_model.check_not_pure_plane, "memo creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_memo_by_inner_10619(calculate, equals, initial, root, wild__);
    });
  }
  else {
     
    var x_0_10832 = $std_core_hnd._open_at1(0, $kokaine_reactive_internal_scheduler.check_registration, root);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return _mlift_memo_by_inner_10618(calculate, equals, initial, root, wild___0);
      });
    }
    else {
       
      var source = $std_core_hnd._open_none3($kokaine_reactive_internal_scheduler.new_source, root, initial, equals);
       
      var effect_plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<3612> */ ) {
          return root_0.root_effect_plane;
        }, root);
       
      var value_10374 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<3612> */ ) {
          return plane.plane_current_frame;
        }, effect_plane);
       
      var owner = value_10374.value;
       
      var x_1_10835 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_scheduler.check_frame_registration, root, owner);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild___1 /* () */ ) {
          return _mlift_memo_by_inner_10617(calculate, effect_plane, owner, root, source, wild___1);
        });
      }
      else {
         
        var derive_plane = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<3612> */ ) {
            return root_1.root_derive_plane;
          }, root);
         
        var owner_slot = { value: ($std_core_types.Nothing) };
         
        var value_1_10380 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<3612> */ ) {
            return plane_0.plane_current;
          }, effect_plane);
         
        var _x_x4_10559 = value_1_10380.value;
        var _x35 = $std_core_hnd._open_none0(function() {
          return $kokaine_reactive_internal_capture.prepare_trace(root, derive_plane, owner_slot, _x_x4_10559, function() {
               
              var x_2_10838 = $std_core_hnd._open_at3(1, function(source_0 /* kokaine/reactive/internal/model/source<3611> */ , mode /* kokaine/reactive/internal/model/read-mode */ , producer /* maybe<kokaine/reactive/internal/model/derive-producer> */ ) {
                  return $std_core_hnd._perform3($std_core_hnd._evv_at(0), $kokaine_reactive_effects.read_source_fs__select, source_0, mode, producer);
                }, source, $kokaine_reactive_internal_model.State_entry_read, $std_core_types.Nothing);
              if ($std_core_hnd._yielding()) {
                return $std_core_hnd.yield_extend(calculate);
              }
              else {
                return calculate(x_2_10838);
              }
            }, function(value_2 /* 3611 */ ) {
              return commit_derived(root, source, value_2);
            });
        });
         
        var producer_0 = $kokaine_reactive_internal_model.Derive_producer(derive_plane, _x35.fst, { value: false });
         
        ((owner_slot).value = ($std_core_types.Just(producer_0)));
         
        var _x_x1_9_10565 = $std_core_hnd._open_none1(function(current_0 /* kokaine/reactive/internal/model/continuation-scope<total> */ ) {
            return $kokaine_reactive_internal_model.Retirement_step(function() {
              return $kokaine_reactive_internal_lifetime.scope_retirement_expand(current_0);
            });
          }, _x35.fst);
         
        var x_3_10840 = $std_core_hnd._open_none1($kokaine_reactive_internal_lifetime.widen_pure_retirement, _x_x1_9_10565);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(structural /* kokaine/reactive/internal/model/retirement-work<3612> */ ) {
            return _mlift_memo_by_inner_10616(_x35.snd, _x35.fst, derive_plane, owner, producer_0, root, source, structural);
          });
        }
        else {
           
          var _x_x1_11_10567 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<3612> */ ) {
              return frame;
            }, owner);
           
          var x_4_10843 = $std_core_hnd._open_at2(0, $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_child, _x_x1_11_10567, x_3_10840);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(registration /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<3612>> */ ) {
              return _mlift_memo_by_inner_10615(_x35.snd, _x35.fst, derive_plane, producer_0, root, source, registration);
            });
          }
          else {
             
            var target_0_10390 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/continuation-scope<total> */ ) {
                return _this.scope_unlink;
              }, _x35.fst);
             
            ((target_0_10390).value = ($std_core_types.Just(function() {
               
              var maybe_10063 = $kokaine_internal_registry.registry_registration_fs_take(x_4_10843);
              return (maybe_10063 !== null);
            })));
             
            $std_core_hnd._open_none2($kokaine_reactive_internal_scheduler.queue_work, derive_plane, _x35.snd);
             
            var _x_x1_15_10573 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<3612> */ ) {
                return root_2.root_key;
              }, root);
             
            var x_5_10846 = $std_core_hnd._open_at1(1, function(key /* kokaine/reactive/internal/model/root-key */ ) {
                 
                var ev_10849 = $std_core_hnd._evv_at(0);
                var _x36 = $kokaine_reactive_effects.request_flush_fs__select(ev_10849.hnd);
                return _x36(ev_10849.marker, ev_10849, key);
              }, _x_x1_15_10573);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(wild___5 /* () */ ) {
                return $kokaine_reactive_internal_model.Memo(source, producer_0);
              });
            }
            else {
              return $kokaine_reactive_internal_model.Memo(source, producer_0);
            }
          }
        }
      }
    }
  }
}
 
export function memo_by(root, initial, calculate, equals) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, initial : a, calculate : (previous : a) -> <kokaine/reactive/effects/signal-read,pure> a, equals : (a, a) -> bool) -> <kokaine/reactive/effects/signal-write,pure> kokaine/reactive/internal/model/memo<a> */  {
  return memo_by_inner(root, initial, calculate, equals);
}
 
export function memo(root, initial, calculate, _implicit_fs__lp__eq__eq__rp_) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, initial : a, calculate : (previous : a) -> <kokaine/reactive/effects/signal-read,pure> a, ?(==) : (a, a) -> bool) -> <kokaine/reactive/effects/signal-write,pure> kokaine/reactive/internal/model/memo<a> */  {
  return memo_by_inner(root, initial, calculate, _implicit_fs__lp__eq__eq__rp_);
}
 
export function memo_always(root, initial, calculate) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, initial : a, calculate : (previous : a) -> <kokaine/reactive/effects/signal-read,pure> a) -> <kokaine/reactive/effects/signal-write,pure> kokaine/reactive/internal/model/memo<a> */  {
  return memo_by_inner(root, initial, calculate, function(___wildcard_x345__37 /* 3804 */ , ___wildcard_x345__39 /* 3804 */ ) {
      return false;
    });
}
 
 
// monadic lift
export function memo_fs__mlift_get_10620(memo_0, wild__) /* forall<a> (memo@0 : kokaine/reactive/internal/model/memo<a>, wild_ : ()) -> kokaine/reactive/effects/signal-read a */  {
   
  var source_10073 = $std_core_hnd._open_none1(function(memo_2 /* kokaine/reactive/internal/model/memo<3863> */ ) {
      return memo_2.memo_source;
    }, memo_0);
   
  var producer_0_10075 = $std_core_types.Just($std_core_hnd._open_none1(function(memo_3 /* kokaine/reactive/internal/model/memo<3863> */ ) {
      return memo_3.memo_producer;
    }, memo_0));
  return $std_core_hnd._perform3($std_core_hnd._evv_at(0), $kokaine_reactive_effects.read_source_fs__select, source_10073, $kokaine_reactive_internal_model.Track_read, producer_0_10075);
}
 
export function memo_fs_get(memo_0) /* forall<a> (memo : kokaine/reactive/internal/model/memo<a>) -> kokaine/reactive/effects/signal-read a */  {
   
  var producer_10072 = $std_core_hnd._open_none1(function(memo_1 /* kokaine/reactive/internal/model/memo<3863> */ ) {
      return memo_1.memo_producer;
    }, memo_0);
   
  var ev_10858 = $std_core_hnd._evv_at(0);
   
  var _x36 = $kokaine_reactive_effects.validate_derived_fs__select(ev_10858.hnd);
  var x_10855 = _x36(ev_10858.marker, ev_10858, producer_10072);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return memo_fs__mlift_get_10620(memo_0, wild__);
    });
  }
  else {
     
    var source_10073 = $std_core_hnd._open_none1(function(memo_2 /* kokaine/reactive/internal/model/memo<3863> */ ) {
        return memo_2.memo_source;
      }, memo_0);
     
    var producer_0_10075 = $std_core_types.Just($std_core_hnd._open_none1(function(memo_3 /* kokaine/reactive/internal/model/memo<3863> */ ) {
        return memo_3.memo_producer;
      }, memo_0));
    return $std_core_hnd._perform3($std_core_hnd._evv_at(0), $kokaine_reactive_effects.read_source_fs__select, source_10073, $kokaine_reactive_internal_model.Track_read, producer_0_10075);
  }
}
 
export function create_effect(root, track, apply) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, apply : (value : a) -> <kokaine/reactive/effects/signal-write,pure|e> ()) -> <kokaine/reactive/effects/signal-write,pure> kokaine/reactive/internal/model/disposer<e> */  {
  return create_effect_inner(root, track, apply);
}
 
 
// monadic lift
export function _mlift_register_cleanup_10621(resource, node) /* forall<e> (resource : kokaine/reactive/internal/resource/resource-k<e>, node : kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<e>>) -> exn kokaine/reactive/internal/model/cleanup-registration<e> */  {
  return $kokaine_reactive_internal_model.Cleanup_registration(node, resource);
}
 
 
// monadic lift
export function _mlift_register_cleanup_10622(checkpoint, cleanup, current, plane, root, wild___0) /* forall<e> (checkpoint : maybe<kokaine/reactive/internal/model/continuation-gate>, cleanup : () -> <kokaine/reactive/effects/signal-write,pure|e> (), current : kokaine/reactive/internal/model/frame<e>, plane : kokaine/reactive/internal/model/plane<e>, root : kokaine/reactive/internal/model/root<e>, wild_@0 : ()) -> exn kokaine/reactive/internal/model/cleanup-registration<e> */  {
   
  var resource = $std_core_hnd._open_none1($kokaine_reactive_internal_resource.capture_resource, function() {
      return $kokaine_reactive_internal_lifetime.with_context(plane, checkpoint, current, function() {
          return $kokaine_reactive_internal_handlers.interpret_write(root, cleanup);
        });
    });
   
  var x_10861 = $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_finalizer($std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<4032> */ ) {
        return frame;
      }, current), $kokaine_reactive_internal_model.Retirement_finalizer(function() {
      var _x36 = $std_core_hnd._open_none1($kokaine_reactive_internal_resource.claim_resource, resource);
      if (_x36 === null) {
        return $std_core_types.Unit;
      }
      else {
        return _x36.value();
      }
    }));
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(node /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<4032>> */ ) {
      return $kokaine_reactive_internal_model.Cleanup_registration(node, resource);
    });
  }
  else {
    return $kokaine_reactive_internal_model.Cleanup_registration(x_10861, resource);
  }
}
 
 
// monadic lift
export function _mlift_register_cleanup_10623(cleanup, root, wild__) /* forall<_e,e1> (cleanup : () -> <kokaine/reactive/effects/signal-write,pure|e1> (), root : kokaine/reactive/internal/model/root<e1>, wild_ : ()) -> exn kokaine/reactive/internal/model/cleanup-registration<e1> */  {
   
  var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<4032> */ ) {
      return root_0.root_effect_plane;
    }, root);
   
  var value_10400 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<4032> */ ) {
      return plane_0.plane_current_frame;
    }, plane);
   
  var current = value_10400.value;
   
  var value_0_10402 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<4032> */ ) {
      return plane_1.plane_current;
    }, plane);
   
  var checkpoint = value_0_10402.value;
   
  var x_10865 = $kokaine_reactive_internal_scheduler.check_frame_registration(root, current);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_register_cleanup_10622(checkpoint, cleanup, current, plane, root, wild___0);
    });
  }
  else {
    return _mlift_register_cleanup_10622(checkpoint, cleanup, current, plane, root, x_10865);
  }
}
 
export function register_cleanup(root, cleanup) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, cleanup : () -> <kokaine/reactive/effects/signal-write,pure|e> ()) -> exn kokaine/reactive/internal/model/cleanup-registration<e> */  {
   
  var x_10867 = $kokaine_reactive_internal_model.check_not_pure_plane("cleanup registration");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_register_cleanup_10623(cleanup, root, wild__);
    });
  }
  else {
     
    var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<4032> */ ) {
        return root_0.root_effect_plane;
      }, root);
     
    var value_10400 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<4032> */ ) {
        return plane_0.plane_current_frame;
      }, plane);
     
    var current = value_10400.value;
     
    var value_0_10402 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<4032> */ ) {
        return plane_1.plane_current;
      }, plane);
     
    var checkpoint = value_0_10402.value;
     
    var x_0_10870 = $kokaine_reactive_internal_scheduler.check_frame_registration(root, current);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return _mlift_register_cleanup_10622(checkpoint, cleanup, current, plane, root, wild___0);
      });
    }
    else {
       
      var resource = $std_core_hnd._open_none1($kokaine_reactive_internal_resource.capture_resource, function() {
          return $kokaine_reactive_internal_lifetime.with_context(plane, checkpoint, current, function() {
              return $kokaine_reactive_internal_handlers.interpret_write(root, cleanup);
            });
        });
       
      var x_1_10873 = $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_finalizer($std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<4032> */ ) {
            return frame;
          }, current), $kokaine_reactive_internal_model.Retirement_finalizer(function() {
          var _x36 = $std_core_hnd._open_none1($kokaine_reactive_internal_resource.claim_resource, resource);
          if (_x36 === null) {
            return $std_core_types.Unit;
          }
          else {
            return _x36.value();
          }
        }));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(node /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<4032>> */ ) {
          return $kokaine_reactive_internal_model.Cleanup_registration(node, resource);
        });
      }
      else {
        return $kokaine_reactive_internal_model.Cleanup_registration(x_1_10873, resource);
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_on_cleanup_10624(_pat) /* forall<e> (kokaine/reactive/internal/model/cleanup-registration<e>) -> exn () */  {
  return $std_core_types.Unit;
}
 
export function on_cleanup(root, cleanup) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, cleanup : () -> <kokaine/reactive/effects/signal-write,pure|e> ()) -> exn () */  {
   
  var x_10878 = register_cleanup(root, cleanup);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_pat_1 /* kokaine/reactive/internal/model/cleanup-registration<4056> */ ) {
      return $std_core_types.Unit;
    });
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function cleanup_registration_fs_unregister(registration) /* forall<e> (registration : kokaine/reactive/internal/model/cleanup-registration<e>) -> bool */  {
  var _x37 = registration.cleanup_node;
  var _x36 = $kokaine_internal_registry.registry_registration_fs_take(_x37);
  if (_x36 === null) {
    return false;
  }
  else {
     
    var _x38 = registration.cleanup_resource;
    var maybe_10016 = $kokaine_reactive_internal_resource.claim_resource(_x38);
    return (maybe_10016 !== null);
  }
}