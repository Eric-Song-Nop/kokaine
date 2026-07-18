// Koka generated module: kokaine/reactive/internal/structural, koka version: 3.2.4
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
import * as $kokaine_reactive_internal_lifetime from './kokaine_reactive_internal_lifetime.mjs';
import * as $kokaine_internal_registry from './kokaine_internal_registry.mjs';
import * as $kokaine_reactive_internal_scheduler from './kokaine_reactive_internal_scheduler.mjs';
import * as $std_core_undiv from './std_core_undiv.mjs';
import * as $kokaine_reactive_internal_work_dash_transaction from './kokaine_reactive_internal_work_dash_transaction.mjs';
 
// externals
 
// type declarations
// type structural-authority
export const Structural_owned = 1; // structural-authority
export const Structural_joined = 2; // structural-authority
// type structural-owner
export function Structural_owner(structural_root, structural_checkpoint, structural_frame, structural_registration) /* forall<e> (structural-root : kokaine/reactive/internal/model/root-key, structural-checkpoint : maybe<kokaine/reactive/internal/model/continuation-gate>, structural-frame : kokaine/reactive/internal/model/frame<e>, structural-registration : kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<e>>) -> structural-owner<e> */  {
  return { structural_root: structural_root, structural_checkpoint: structural_checkpoint, structural_frame: structural_frame, structural_registration: structural_registration };
}
// type structural-transaction
export function Structural_transaction(structural_transaction_root, structural_scheduler, structural_authority) /* forall<e> (structural-transaction-root : kokaine/reactive/internal/model/root<e>, structural-scheduler : kokaine/reactive/internal/scheduler/scheduler-transaction<e>, structural-authority : structural-authority) -> structural-transaction<e> */  {
  return { structural_transaction_root: structural_transaction_root, structural_scheduler: structural_scheduler, structural_authority: structural_authority };
}
 
// declarations
 
 
// Automatically generated. Retrieves the `structural-root` constructor field of the `:structural-owner` type.
export function structural_owner_fs_structural_root(_this) /* forall<e> (structural-owner<e>) -> kokaine/reactive/internal/model/root-key */  {
  return _this.structural_root;
}
 
 
// Automatically generated. Retrieves the `structural-checkpoint` constructor field of the `:structural-owner` type.
export function structural_owner_fs_structural_checkpoint(_this) /* forall<e> (structural-owner<e>) -> maybe<kokaine/reactive/internal/model/continuation-gate> */  {
  return _this.structural_checkpoint;
}
 
 
// Automatically generated. Retrieves the `structural-frame` constructor field of the `:structural-owner` type.
export function structural_owner_fs_structural_frame(_this) /* forall<e> (structural-owner<e>) -> kokaine/reactive/internal/model/frame<e> */  {
  return _this.structural_frame;
}
 
 
// Automatically generated. Retrieves the `structural-registration` constructor field of the `:structural-owner` type.
export function structural_owner_fs_structural_registration(_this) /* forall<e> (structural-owner<e>) -> kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<e>> */  {
  return _this.structural_registration;
}
 
export function structural_owner_fs__copy(_this, structural_root, structural_checkpoint, structural_frame, structural_registration) /* forall<e> (structural-owner<e>, structural-root : ? kokaine/reactive/internal/model/root-key, structural-checkpoint : ? (maybe<kokaine/reactive/internal/model/continuation-gate>), structural-frame : ? (kokaine/reactive/internal/model/frame<e>), structural-registration : ? (kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<e>>)) -> structural-owner<e> */  {
  if (structural_root !== undefined) {
    var _x0 = structural_root;
  }
  else {
    var _x0 = _this.structural_root;
  }
  if (structural_checkpoint !== undefined) {
    var _x1 = structural_checkpoint;
  }
  else {
    var _x1 = _this.structural_checkpoint;
  }
  if (structural_frame !== undefined) {
    var _x2 = structural_frame;
  }
  else {
    var _x2 = _this.structural_frame;
  }
  if (structural_registration !== undefined) {
    var _x3 = structural_registration;
  }
  else {
    var _x3 = _this.structural_registration;
  }
  return Structural_owner(_x0, _x1, _x2, _x3);
}
 
 
// Automatically generated. Tests for the `Structural-owned` constructor of the `:structural-authority` type.
export function is_structural_owned(structural_authority) /* (structural-authority : structural-authority) -> bool */  {
  return (structural_authority === 1);
}
 
 
// Automatically generated. Tests for the `Structural-joined` constructor of the `:structural-authority` type.
export function is_structural_joined(structural_authority) /* (structural-authority : structural-authority) -> bool */  {
  return (structural_authority === 2);
}
 
 
// Automatically generated. Retrieves the `structural-transaction-root` constructor field of the `:structural-transaction` type.
export function structural_transaction_fs_structural_transaction_root(_this) /* forall<e> (structural-transaction<e>) -> kokaine/reactive/internal/model/root<e> */  {
  return _this.structural_transaction_root;
}
 
 
// Automatically generated. Retrieves the `structural-scheduler` constructor field of the `:structural-transaction` type.
export function structural_transaction_fs_structural_scheduler(_this) /* forall<e> (structural-transaction<e>) -> kokaine/reactive/internal/scheduler/scheduler-transaction<e> */  {
  return _this.structural_scheduler;
}
 
 
// Automatically generated. Retrieves the `structural-authority` constructor field of the `:structural-transaction` type.
export function structural_transaction_fs_structural_authority(_this) /* forall<e> (structural-transaction<e>) -> structural-authority */  {
  return _this.structural_authority;
}
 
export function structural_transaction_fs__copy(_this, structural_transaction_root, structural_scheduler, structural_authority) /* forall<e> (structural-transaction<e>, structural-transaction-root : ? (kokaine/reactive/internal/model/root<e>), structural-scheduler : ? (kokaine/reactive/internal/scheduler/scheduler-transaction<e>), structural-authority : ? structural-authority) -> structural-transaction<e> */  {
  if (structural_transaction_root !== undefined) {
    var _x4 = structural_transaction_root;
  }
  else {
    var _x4 = _this.structural_transaction_root;
  }
  if (structural_scheduler !== undefined) {
    var _x5 = structural_scheduler;
  }
  else {
    var _x5 = _this.structural_scheduler;
  }
  if (structural_authority !== undefined) {
    var _x6 = structural_authority;
  }
  else {
    var _x6 = _this.structural_authority;
  }
  return Structural_transaction(_x4, _x5, _x6);
}
 
 
// monadic lift
export function _mlift_open_structural_owner_10111(lifetime, plane, root, registration) /* forall<_e,e1> (lifetime : kokaine/reactive/internal/model/lifetime-owner<e1>, plane : kokaine/reactive/internal/model/plane<e1>, root : kokaine/reactive/internal/model/root<e1>, registration : kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<e1>>) -> exn structural-owner<e1> */  {
   
  var value_0_10039 = $std_core_hnd._open_none1(function(plane_2 /* kokaine/reactive/internal/model/plane<483> */ ) {
      return plane_2.plane_current;
    }, plane);
  return Structural_owner($std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<483> */ ) {
        return root_1.root_key;
      }, root), value_0_10039.value, lifetime, registration);
}
 
 
// monadic lift
export function _mlift_open_structural_owner_10112(parent, plane, root, wild___0) /* forall<_e,e1> (parent : kokaine/reactive/internal/model/frame<e1>, plane : kokaine/reactive/internal/model/plane<e1>, root : kokaine/reactive/internal/model/root<e1>, wild_@0 : ()) -> exn structural-owner<e1> */  {
   
  var _x_x2_10081 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<483> */ ) {
      return plane_1.plane_retirement;
    }, plane);
   
  var lifetime = $std_core_hnd._open_none2($kokaine_reactive_internal_lifetime.new_lifetime_owner, $kokaine_reactive_internal_model.Scope_live, _x_x2_10081);
   
  var x_10121 = $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_child($std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<483> */ ) {
        return frame;
      }, parent), $std_core_hnd._open_none1(function(owner /* kokaine/reactive/internal/model/lifetime-owner<483> */ ) {
        return $kokaine_reactive_internal_model.Retirement_step(function() {
          return $kokaine_reactive_internal_lifetime.lifetime_retirement_expand(owner);
        });
      }, lifetime));
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(registration /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<483>> */ ) {
      return _mlift_open_structural_owner_10111(lifetime, plane, root, registration);
    });
  }
  else {
    return _mlift_open_structural_owner_10111(lifetime, plane, root, x_10121);
  }
}
 
 
// monadic lift
export function _mlift_open_structural_owner_10113(root, wild__) /* forall<_e,e1> (root : kokaine/reactive/internal/model/root<e1>, wild_ : ()) -> exn structural-owner<e1> */  {
   
  var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<483> */ ) {
      return root_0.root_effect_plane;
    }, root);
   
  var value_10032 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<483> */ ) {
      return plane_0.plane_current_frame;
    }, plane);
   
  var parent = value_10032.value;
   
  var x_10123 = $kokaine_reactive_internal_scheduler.check_frame_registration(root, parent);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_open_structural_owner_10112(parent, plane, root, wild___0);
    });
  }
  else {
    return _mlift_open_structural_owner_10112(parent, plane, root, x_10123);
  }
}
 
export function open_structural_owner(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> exn structural-owner<e> */  {
   
  var x_10125 = $kokaine_reactive_internal_model.check_not_pure_plane("structural owner creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_open_structural_owner_10113(root, wild__);
    });
  }
  else {
     
    var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<483> */ ) {
        return root_0.root_effect_plane;
      }, root);
     
    var value_10032 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<483> */ ) {
        return plane_0.plane_current_frame;
      }, plane);
     
    var parent = value_10032.value;
     
    var x_0_10128 = $kokaine_reactive_internal_scheduler.check_frame_registration(root, parent);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return _mlift_open_structural_owner_10112(parent, plane, root, wild___0);
      });
    }
    else {
       
      var _x_x2_10081 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<483> */ ) {
          return plane_1.plane_retirement;
        }, plane);
       
      var lifetime = $std_core_hnd._open_none2($kokaine_reactive_internal_lifetime.new_lifetime_owner, $kokaine_reactive_internal_model.Scope_live, _x_x2_10081);
       
      var x_1_10131 = $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_child($std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<483> */ ) {
            return frame;
          }, parent), $std_core_hnd._open_none1(function(owner /* kokaine/reactive/internal/model/lifetime-owner<483> */ ) {
            return $kokaine_reactive_internal_model.Retirement_step(function() {
              return $kokaine_reactive_internal_lifetime.lifetime_retirement_expand(owner);
            });
          }, lifetime));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(registration /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<483>> */ ) {
          return _mlift_open_structural_owner_10111(lifetime, plane, root, registration);
        });
      }
      else {
         
        var value_0_10039 = $std_core_hnd._open_none1(function(plane_2 /* kokaine/reactive/internal/model/plane<483> */ ) {
            return plane_2.plane_current;
          }, plane);
        return Structural_owner($std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<483> */ ) {
              return root_1.root_key;
            }, root), value_0_10039.value, lifetime, x_1_10131);
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_with_structural_owner_10114(action, owner, root, wild___1) /* forall<_e,_e1,a,e2,e3> (action : () -> <div,exn|e2> a, owner : structural-owner<e3>, root : kokaine/reactive/internal/model/root<e3>, wild_@1 : ()) -> <exn,div|e2> a */  {
   
  var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<723> */ ) {
      return root_0.root_effect_plane;
    }, root);
   
  var value_10047 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<723> */ ) {
      return plane_0.plane_current;
    }, plane);
   
  var previous_current = value_10047.value;
   
  var value_0_10049 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<723> */ ) {
      return plane_1.plane_current_entry;
    }, plane);
   
  var previous_entry = value_0_10049.value;
   
  var value_1_10051 = $std_core_hnd._open_none1(function(plane_2 /* kokaine/reactive/internal/model/plane<723> */ ) {
      return plane_2.plane_current_frame;
    }, plane);
   
  var previous_frame = value_1_10051.value;
   
  var target_2_10062 = $std_core_hnd._open_none1(function(plane_6 /* kokaine/reactive/internal/model/plane<723> */ ) {
      return plane_6.plane_current;
    }, plane);
   
  var value_5_10063 = $std_core_hnd._open_none1(function(_this_1 /* structural-owner<723> */ ) {
      return _this_1.structural_checkpoint;
    }, owner);
   
  ((target_2_10062).value = value_5_10063);
   
  var target_3_10066 = $std_core_hnd._open_none1(function(plane_7 /* kokaine/reactive/internal/model/plane<723> */ ) {
      return plane_7.plane_current_entry;
    }, plane);
   
  ((target_3_10066).value = ($std_core_types.Nothing));
   
  var target_4_10069 = $std_core_hnd._open_none1(function(plane_8 /* kokaine/reactive/internal/model/plane<723> */ ) {
      return plane_8.plane_current_frame;
    }, plane);
   
  var value_7_10070 = $std_core_hnd._open_none1(function(_this_2 /* structural-owner<723> */ ) {
      return _this_2.structural_frame;
    }, owner);
   
  ((target_4_10069).value = value_7_10070);
  return $std_core_hnd.finally_prompt(function() {
       
      var target_10053 = $std_core_hnd._open_none1(function(plane_3 /* kokaine/reactive/internal/model/plane<723> */ ) {
          return plane_3.plane_current;
        }, plane);
       
      ((target_10053).value = previous_current);
       
      var target_0_10056 = $std_core_hnd._open_none1(function(plane_4 /* kokaine/reactive/internal/model/plane<723> */ ) {
          return plane_4.plane_current_entry;
        }, plane);
       
      ((target_0_10056).value = previous_entry);
       
      var target_1_10059 = $std_core_hnd._open_none1(function(plane_5 /* kokaine/reactive/internal/model/plane<723> */ ) {
          return plane_5.plane_current_frame;
        }, plane);
      return ((target_1_10059).value = previous_frame);
    }, action());
}
 
 
// monadic lift
export function _mlift_with_structural_owner_10115(action, owner, root, wild___0) /* forall<_e,_e1,a,e2,e3> (action : () -> <div,exn|e2> a, owner : structural-owner<e3>, root : kokaine/reactive/internal/model/root<e3>, wild_@0 : ()) -> <exn,div|e2> a */  {
   
  var _x_x2_0_10092 = $std_core_hnd._open_none1(function(_this_0 /* structural-owner<723> */ ) {
      return _this_0.structural_frame;
    }, owner);
   
  var x_10136 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_frame_registration, root, _x_x2_0_10092);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___1 /* () */ ) {
      return _mlift_with_structural_owner_10114(action, owner, root, wild___1);
    });
  }
  else {
    return _mlift_with_structural_owner_10114(action, owner, root, x_10136);
  }
}
 
 
// monadic lift
export function _mlift_with_structural_owner_10116(action, owner, root, wild__) /* forall<_e,_e1,a,e2,e3> (action : () -> <div,exn|e2> a, owner : structural-owner<e3>, root : kokaine/reactive/internal/model/root<e3>, wild_ : ()) -> <exn,div|e2> a */  {
   
  var _x_x2_10089 = $std_core_hnd._open_none1(function(_this /* structural-owner<723> */ ) {
      return _this.structural_root;
    }, owner);
   
  var x_10138 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_root, root, _x_x2_10089);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_with_structural_owner_10115(action, owner, root, wild___0);
    });
  }
  else {
    return _mlift_with_structural_owner_10115(action, owner, root, x_10138);
  }
}
 
export function with_structural_owner(root, owner, action) /* forall<a,e,e1> (root : kokaine/reactive/internal/model/root<e1>, owner : structural-owner<e1>, action : () -> <div,exn|e> a) -> <div,exn|e> a */  {
   
  var x_10140 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "structural owner entry");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_with_structural_owner_10116(action, owner, root, wild__);
    });
  }
  else {
     
    var _x_x2_10089 = $std_core_hnd._open_none1(function(_this /* structural-owner<723> */ ) {
        return _this.structural_root;
      }, owner);
     
    var x_0_10143 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_root, root, _x_x2_10089);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return _mlift_with_structural_owner_10115(action, owner, root, wild___0);
      });
    }
    else {
       
      var _x_x2_0_10092 = $std_core_hnd._open_none1(function(_this_0 /* structural-owner<723> */ ) {
          return _this_0.structural_frame;
        }, owner);
       
      var x_1_10146 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_frame_registration, root, _x_x2_0_10092);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild___1 /* () */ ) {
          return _mlift_with_structural_owner_10114(action, owner, root, wild___1);
        });
      }
      else {
         
        var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<723> */ ) {
            return root_0.root_effect_plane;
          }, root);
         
        var value_10047 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<723> */ ) {
            return plane_0.plane_current;
          }, plane);
         
        var previous_current = value_10047.value;
         
        var value_0_10049 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<723> */ ) {
            return plane_1.plane_current_entry;
          }, plane);
         
        var previous_entry = value_0_10049.value;
         
        var value_1_10051 = $std_core_hnd._open_none1(function(plane_2 /* kokaine/reactive/internal/model/plane<723> */ ) {
            return plane_2.plane_current_frame;
          }, plane);
         
        var previous_frame = value_1_10051.value;
         
        var target_2_10062 = $std_core_hnd._open_none1(function(plane_6 /* kokaine/reactive/internal/model/plane<723> */ ) {
            return plane_6.plane_current;
          }, plane);
         
        var value_5_10063 = $std_core_hnd._open_none1(function(_this_1 /* structural-owner<723> */ ) {
            return _this_1.structural_checkpoint;
          }, owner);
         
        ((target_2_10062).value = value_5_10063);
         
        var target_3_10066 = $std_core_hnd._open_none1(function(plane_7 /* kokaine/reactive/internal/model/plane<723> */ ) {
            return plane_7.plane_current_entry;
          }, plane);
         
        ((target_3_10066).value = ($std_core_types.Nothing));
         
        var target_4_10069 = $std_core_hnd._open_none1(function(plane_8 /* kokaine/reactive/internal/model/plane<723> */ ) {
            return plane_8.plane_current_frame;
          }, plane);
         
        var value_7_10070 = $std_core_hnd._open_none1(function(_this_2 /* structural-owner<723> */ ) {
            return _this_2.structural_frame;
          }, owner);
         
        ((target_4_10069).value = value_7_10070);
        return $std_core_hnd.finally_prompt(function() {
             
            var target_10053 = $std_core_hnd._open_none1(function(plane_3 /* kokaine/reactive/internal/model/plane<723> */ ) {
                return plane_3.plane_current;
              }, plane);
             
            ((target_10053).value = previous_current);
             
            var target_0_10056 = $std_core_hnd._open_none1(function(plane_4 /* kokaine/reactive/internal/model/plane<723> */ ) {
                return plane_4.plane_current_entry;
              }, plane);
             
            ((target_0_10056).value = previous_entry);
             
            var target_1_10059 = $std_core_hnd._open_none1(function(plane_5 /* kokaine/reactive/internal/model/plane<723> */ ) {
                return plane_5.plane_current_frame;
              }, plane);
            return ((target_1_10059).value = previous_frame);
          }, action());
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_dispose_structural_owner_10117(owner, wild__) /* forall<e> (owner : structural-owner<e>, wild_ : ()) -> <exn|e> () */  {
   
  var _x_x1_0_10107 = $std_core_hnd._open_none1(function(_this /* structural-owner<792> */ ) {
      return _this.structural_registration;
    }, owner);
   
  var _pat_4 = $std_core_hnd._open_none1($kokaine_internal_registry.registry_registration_fs_take, _x_x1_0_10107);
   
  var _x_x1_2_10109 = $std_core_hnd._open_none1(function(_this_0 /* structural-owner<792> */ ) {
      return _this_0.structural_frame;
    }, owner);
  return $kokaine_reactive_internal_lifetime.retire_lifetime($std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<792> */ ) {
      return frame;
    }, _x_x1_2_10109));
}
 
export function dispose_structural_owner(owner) /* forall<e> (owner : structural-owner<e>) -> <exn|e> () */  {
   
  var x_10151 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "structural owner disposal");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_dispose_structural_owner_10117(owner, wild__);
    });
  }
  else {
     
    var _x_x1_0_10107 = $std_core_hnd._open_none1(function(_this /* structural-owner<792> */ ) {
        return _this.structural_registration;
      }, owner);
     
    var _pat_4 = $std_core_hnd._open_none1($kokaine_internal_registry.registry_registration_fs_take, _x_x1_0_10107);
     
    var _x_x1_2_10109 = $std_core_hnd._open_none1(function(_this_0 /* structural-owner<792> */ ) {
        return _this_0.structural_frame;
      }, owner);
    return $kokaine_reactive_internal_lifetime.retire_lifetime($std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<792> */ ) {
        return frame;
      }, _x_x1_2_10109));
  }
}
 
 
// monadic lift
export function _mlift_open_structural_transaction_10118(root, _y_x10021) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, kokaine/reactive/internal/scheduler/scheduler-transaction<e>) -> exn structural-transaction<e> */  {
  return Structural_transaction(root, _y_x10021, Structural_owned);
}
 
 
// monadic lift
export function _mlift_open_structural_transaction_10119(root, _y_x10020) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, maybe<kokaine/reactive/internal/scheduler/scheduler-transaction<e>>) -> exn structural-transaction<e> */  {
  if (_y_x10020 === null) {
     
    var x_10154 = $kokaine_reactive_internal_scheduler.open_work_transaction(root);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10021 /* kokaine/reactive/internal/scheduler/scheduler-transaction<852> */ ) {
        return Structural_transaction(root, _y_x10021, Structural_owned);
      });
    }
    else {
      return Structural_transaction(root, x_10154, Structural_owned);
    }
  }
  else {
    return Structural_transaction(root, _y_x10020.value, Structural_joined);
  }
}
 
 
// monadic lift
export function _mlift_open_structural_transaction_10120(root, wild__) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, wild_ : ()) -> exn structural-transaction<e> */  {
   
  var x_10158 = $kokaine_reactive_internal_scheduler.current_work_transaction(root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10020 /* maybe<kokaine/reactive/internal/scheduler/scheduler-transaction<852>> */ ) {
      return _mlift_open_structural_transaction_10119(root, _y_x10020);
    });
  }
  else {
    return _mlift_open_structural_transaction_10119(root, x_10158);
  }
}
 
export function open_structural_transaction(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> exn structural-transaction<e> */  {
   
  var x_10160 = $kokaine_reactive_internal_model.check_not_pure_plane("structural transaction creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_open_structural_transaction_10120(root, wild__);
    });
  }
  else {
     
    var x_0_10163 = $kokaine_reactive_internal_scheduler.current_work_transaction(root);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10020 /* maybe<kokaine/reactive/internal/scheduler/scheduler-transaction<852>> */ ) {
        return _mlift_open_structural_transaction_10119(root, _y_x10020);
      });
    }
    else {
      if (x_0_10163 === null) {
         
        var x_1_10166 = $kokaine_reactive_internal_scheduler.open_work_transaction(root);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10021 /* kokaine/reactive/internal/scheduler/scheduler-transaction<852> */ ) {
            return Structural_transaction(root, _y_x10021, Structural_owned);
          });
        }
        else {
          return Structural_transaction(root, x_1_10166, Structural_owned);
        }
      }
      else {
        return Structural_transaction(root, x_0_10163.value, Structural_joined);
      }
    }
  }
}
 
export function drain_structural_transaction(transaction) /* forall<e> (transaction : structural-transaction<e>) -> <div,exn|e> () */  {
  if (transaction.structural_authority === 1) {
    return $kokaine_reactive_internal_scheduler.drain_work_transaction(transaction.structural_transaction_root, transaction.structural_scheduler);
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function structural_transaction_fs_owns_publication(transaction) /* forall<e> (transaction : structural-transaction<e>) -> bool */  {
  return (transaction.structural_authority === 1);
}
 
export function stage_structural_publication(transaction, prepare, publish, rollback) /* forall<e> (transaction : structural-transaction<e>, prepare : () -> <exn|e> (), publish : () -> (), rollback : () -> <exn|e> ()) -> exn () */  {
  return $kokaine_reactive_internal_scheduler.stage_work_publication(transaction.structural_transaction_root, transaction.structural_scheduler, prepare, publish, rollback);
}
 
export function commit_structural_transaction(transaction) /* forall<e> (transaction : structural-transaction<e>) -> <div,exn|e> () */  {
  if (transaction.structural_authority === 1) {
    return $kokaine_reactive_internal_scheduler.commit_work_transaction(transaction.structural_transaction_root, transaction.structural_scheduler);
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function abort_structural_transaction(transaction) /* forall<e> (transaction : structural-transaction<e>) -> <exn|e> () */  {
  if (transaction.structural_authority === 1) {
    return $kokaine_reactive_internal_scheduler.abort_work_transaction(transaction.structural_transaction_root, transaction.structural_scheduler);
  }
  else {
    return $std_core_types.Unit;
  }
}