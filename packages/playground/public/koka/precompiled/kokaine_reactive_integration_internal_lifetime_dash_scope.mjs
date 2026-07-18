// Koka generated module: kokaine/reactive/integration/internal/lifetime-scope, koka version: 3.2.4
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
// type lifetime-scope
export function Lifetime_scope(scope_root, scope_checkpoint, scope_frame, scope_registration) /* forall<e> (scope-root : kokaine/reactive/internal/model/root-key, scope-checkpoint : maybe<kokaine/reactive/internal/model/continuation-gate>, scope-frame : kokaine/reactive/internal/model/frame<e>, scope-registration : kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<e>>) -> lifetime-scope<e> */  {
  return { scope_root: scope_root, scope_checkpoint: scope_checkpoint, scope_frame: scope_frame, scope_registration: scope_registration };
}
 
// declarations
 
 
// Automatically generated. Retrieves the `scope-root` constructor field of the `:lifetime-scope` type.
export function lifetime_scope_fs_scope_root(_this) /* forall<e> (lifetime-scope<e>) -> kokaine/reactive/internal/model/root-key */  {
  return _this.scope_root;
}
 
 
// Automatically generated. Retrieves the `scope-checkpoint` constructor field of the `:lifetime-scope` type.
export function lifetime_scope_fs_scope_checkpoint(_this) /* forall<e> (lifetime-scope<e>) -> maybe<kokaine/reactive/internal/model/continuation-gate> */  {
  return _this.scope_checkpoint;
}
 
 
// Automatically generated. Retrieves the `scope-frame` constructor field of the `:lifetime-scope` type.
export function lifetime_scope_fs_scope_frame(_this) /* forall<e> (lifetime-scope<e>) -> kokaine/reactive/internal/model/frame<e> */  {
  return _this.scope_frame;
}
 
 
// Automatically generated. Retrieves the `scope-registration` constructor field of the `:lifetime-scope` type.
export function lifetime_scope_fs_scope_registration(_this) /* forall<e> (lifetime-scope<e>) -> kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<e>> */  {
  return _this.scope_registration;
}
 
export function lifetime_scope_fs__copy(_this, scope_root, scope_checkpoint, scope_frame, scope_registration) /* forall<e> (lifetime-scope<e>, scope-root : ? kokaine/reactive/internal/model/root-key, scope-checkpoint : ? (maybe<kokaine/reactive/internal/model/continuation-gate>), scope-frame : ? (kokaine/reactive/internal/model/frame<e>), scope-registration : ? (kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<e>>)) -> lifetime-scope<e> */  {
  if (scope_root !== undefined) {
    var _x0 = scope_root;
  }
  else {
    var _x0 = _this.scope_root;
  }
  if (scope_checkpoint !== undefined) {
    var _x1 = scope_checkpoint;
  }
  else {
    var _x1 = _this.scope_checkpoint;
  }
  if (scope_frame !== undefined) {
    var _x2 = scope_frame;
  }
  else {
    var _x2 = _this.scope_frame;
  }
  if (scope_registration !== undefined) {
    var _x3 = scope_registration;
  }
  else {
    var _x3 = _this.scope_registration;
  }
  return Lifetime_scope(_x0, _x1, _x2, _x3);
}
 
 
// monadic lift
export function _mlift_open_lifetime_scope_10063(lifetime, plane, root, registration) /* forall<_e,e1> (lifetime : kokaine/reactive/internal/model/lifetime-owner<e1>, plane : kokaine/reactive/internal/model/plane<e1>, root : kokaine/reactive/internal/model/root<e1>, registration : kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<e1>>) -> exn lifetime-scope<e1> */  {
   
  var value_0_10024 = $std_core_hnd._open_none1(function(plane_2 /* kokaine/reactive/internal/model/plane<307> */ ) {
      return plane_2.plane_current;
    }, plane);
  return Lifetime_scope($std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<307> */ ) {
        return root_1.root_key;
      }, root), value_0_10024.value, lifetime, registration);
}
 
 
// monadic lift
export function _mlift_open_lifetime_scope_10064(parent, plane, root, wild___0) /* forall<_e,e1> (parent : kokaine/reactive/internal/model/frame<e1>, plane : kokaine/reactive/internal/model/plane<e1>, root : kokaine/reactive/internal/model/root<e1>, wild_@0 : ()) -> exn lifetime-scope<e1> */  {
   
  var _x_x2_10042 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<307> */ ) {
      return plane_1.plane_retirement;
    }, plane);
   
  var lifetime = $std_core_hnd._open_none2($kokaine_reactive_internal_lifetime.new_lifetime_owner, $kokaine_reactive_internal_model.Scope_live, _x_x2_10042);
   
  var x_10070 = $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_child($std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<307> */ ) {
        return frame;
      }, parent), $std_core_hnd._open_none1(function(owner /* kokaine/reactive/internal/model/lifetime-owner<307> */ ) {
        return $kokaine_reactive_internal_model.Retirement_step(function() {
          return $kokaine_reactive_internal_lifetime.lifetime_retirement_expand(owner);
        });
      }, lifetime));
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(registration /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<307>> */ ) {
      return _mlift_open_lifetime_scope_10063(lifetime, plane, root, registration);
    });
  }
  else {
    return _mlift_open_lifetime_scope_10063(lifetime, plane, root, x_10070);
  }
}
 
 
// monadic lift
export function _mlift_open_lifetime_scope_10065(root, wild__) /* forall<_e,e1> (root : kokaine/reactive/internal/model/root<e1>, wild_ : ()) -> exn lifetime-scope<e1> */  {
   
  var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<307> */ ) {
      return root_0.root_effect_plane;
    }, root);
   
  var value_10017 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<307> */ ) {
      return plane_0.plane_current_frame;
    }, plane);
   
  var parent = value_10017.value;
   
  var x_10072 = $kokaine_reactive_internal_scheduler.check_frame_registration(root, parent);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_open_lifetime_scope_10064(parent, plane, root, wild___0);
    });
  }
  else {
    return _mlift_open_lifetime_scope_10064(parent, plane, root, x_10072);
  }
}
 
export function open_lifetime_scope(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> exn lifetime-scope<e> */  {
   
  var x_10074 = $kokaine_reactive_internal_model.check_not_pure_plane("lifetime scope creation");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_open_lifetime_scope_10065(root, wild__);
    });
  }
  else {
     
    var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<307> */ ) {
        return root_0.root_effect_plane;
      }, root);
     
    var value_10017 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<307> */ ) {
        return plane_0.plane_current_frame;
      }, plane);
     
    var parent = value_10017.value;
     
    var x_0_10077 = $kokaine_reactive_internal_scheduler.check_frame_registration(root, parent);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return _mlift_open_lifetime_scope_10064(parent, plane, root, wild___0);
      });
    }
    else {
       
      var _x_x2_10042 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<307> */ ) {
          return plane_1.plane_retirement;
        }, plane);
       
      var lifetime = $std_core_hnd._open_none2($kokaine_reactive_internal_lifetime.new_lifetime_owner, $kokaine_reactive_internal_model.Scope_live, _x_x2_10042);
       
      var x_1_10080 = $kokaine_reactive_internal_lifetime.lifetime_owner_fs_register_child($std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<307> */ ) {
            return frame;
          }, parent), $std_core_hnd._open_none1(function(owner /* kokaine/reactive/internal/model/lifetime-owner<307> */ ) {
            return $kokaine_reactive_internal_model.Retirement_step(function() {
              return $kokaine_reactive_internal_lifetime.lifetime_retirement_expand(owner);
            });
          }, lifetime));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(registration /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<307>> */ ) {
          return _mlift_open_lifetime_scope_10063(lifetime, plane, root, registration);
        });
      }
      else {
         
        var value_0_10024 = $std_core_hnd._open_none1(function(plane_2 /* kokaine/reactive/internal/model/plane<307> */ ) {
            return plane_2.plane_current;
          }, plane);
        return Lifetime_scope($std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<307> */ ) {
              return root_1.root_key;
            }, root), value_0_10024.value, lifetime, x_1_10080);
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_with_lifetime_scope_10066(action, root, scope, wild___1) /* forall<a,e,e1> (action : () -> <div,exn|e> a, root : kokaine/reactive/internal/model/root<e1>, scope : lifetime-scope<e1>, wild_@1 : ()) -> <exn,div|e> a */  {
  return $kokaine_reactive_internal_lifetime.with_context($std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<406> */ ) {
        return root_0.root_effect_plane;
      }, root), $std_core_hnd._open_none1(function(_this_1 /* lifetime-scope<406> */ ) {
        return _this_1.scope_checkpoint;
      }, scope), $std_core_hnd._open_none1(function(_this_2 /* lifetime-scope<406> */ ) {
        return _this_2.scope_frame;
      }, scope), action);
}
 
 
// monadic lift
export function _mlift_with_lifetime_scope_10067(action, root, scope, wild___0) /* forall<a,e,e1> (action : () -> <div,exn|e> a, root : kokaine/reactive/internal/model/root<e1>, scope : lifetime-scope<e1>, wild_@0 : ()) -> <exn,div|e> a */  {
   
  var _x_x2_0_10053 = $std_core_hnd._open_none1(function(_this_0 /* lifetime-scope<406> */ ) {
      return _this_0.scope_frame;
    }, scope);
   
  var x_10083 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_frame_registration, root, _x_x2_0_10053);
   
  function next_10084(wild___1) /* (()) -> <exn,div|405> 404 */  {
    return $kokaine_reactive_internal_lifetime.with_context($std_core_hnd._open_none1(function(root_0_0 /* kokaine/reactive/internal/model/root<406> */ ) {
          return root_0_0.root_effect_plane;
        }, root), $std_core_hnd._open_none1(function(_this_1 /* lifetime-scope<406> */ ) {
          return _this_1.scope_checkpoint;
        }, scope), $std_core_hnd._open_none1(function(_this_2 /* lifetime-scope<406> */ ) {
          return _this_2.scope_frame;
        }, scope), action);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10084);
  }
  else {
    return next_10084(x_10083);
  }
}
 
 
// monadic lift
export function _mlift_with_lifetime_scope_10068(action, root, scope, wild__) /* forall<a,e,e1> (action : () -> <div,exn|e> a, root : kokaine/reactive/internal/model/root<e1>, scope : lifetime-scope<e1>, wild_ : ()) -> <exn,div|e> a */  {
   
  var _x_x2_10050 = $std_core_hnd._open_none1(function(_this /* lifetime-scope<406> */ ) {
      return _this.scope_root;
    }, scope);
   
  var x_10089 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_root, root, _x_x2_10050);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_with_lifetime_scope_10067(action, root, scope, wild___0);
    });
  }
  else {
    return _mlift_with_lifetime_scope_10067(action, root, scope, x_10089);
  }
}
 
export function with_lifetime_scope(root, scope, action) /* forall<a,e,e1> (root : kokaine/reactive/internal/model/root<e1>, scope : lifetime-scope<e1>, action : () -> <div,exn|e> a) -> <div,exn|e> a */  {
   
  var x_10091 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "lifetime scope entry");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_with_lifetime_scope_10068(action, root, scope, wild__);
    });
  }
  else {
     
    var _x_x2_10050 = $std_core_hnd._open_none1(function(_this /* lifetime-scope<406> */ ) {
        return _this.scope_root;
      }, scope);
     
    var x_0_10094 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_root, root, _x_x2_10050);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return _mlift_with_lifetime_scope_10067(action, root, scope, wild___0);
      });
    }
    else {
       
      var _x_x2_0_10053 = $std_core_hnd._open_none1(function(_this_0 /* lifetime-scope<406> */ ) {
          return _this_0.scope_frame;
        }, scope);
       
      var x_1_10097 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_frame_registration, root, _x_x2_0_10053);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild___1 /* () */ ) {
          return $kokaine_reactive_internal_lifetime.with_context($std_core_hnd._open_none1(function(root_0_0 /* kokaine/reactive/internal/model/root<406> */ ) {
                return root_0_0.root_effect_plane;
              }, root), $std_core_hnd._open_none1(function(_this_1 /* lifetime-scope<406> */ ) {
                return _this_1.scope_checkpoint;
              }, scope), $std_core_hnd._open_none1(function(_this_2 /* lifetime-scope<406> */ ) {
                return _this_2.scope_frame;
              }, scope), action);
        });
      }
      else {
        return $kokaine_reactive_internal_lifetime.with_context($std_core_hnd._open_none1(function(root_0_1 /* kokaine/reactive/internal/model/root<406> */ ) {
              return root_0_1.root_effect_plane;
            }, root), $std_core_hnd._open_none1(function(_this_1_0 /* lifetime-scope<406> */ ) {
              return _this_1_0.scope_checkpoint;
            }, scope), $std_core_hnd._open_none1(function(_this_2_0 /* lifetime-scope<406> */ ) {
              return _this_2_0.scope_frame;
            }, scope), action);
      }
    }
  }
}
 
 
// monadic lift
export function lifetime_scope_fs__mlift_dispose_10069(scope, wild__) /* forall<e> (scope : lifetime-scope<e>, wild_ : ()) -> <exn|e> () */  {
   
  var _x_x1_0_10059 = $std_core_hnd._open_none1(function(_this /* lifetime-scope<483> */ ) {
      return _this.scope_registration;
    }, scope);
  var _x4 = $std_core_hnd._open_none1($kokaine_internal_registry.registry_registration_fs_take, _x_x1_0_10059);
  if (_x4 === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x_x1_2_10061 = $std_core_hnd._open_none1(function(_this_0 /* lifetime-scope<483> */ ) {
        return _this_0.scope_frame;
      }, scope);
    return $kokaine_reactive_internal_lifetime.retire_lifetime($std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<483> */ ) {
        return frame;
      }, _x_x1_2_10061));
  }
}
 
export function lifetime_scope_fs_dispose(scope) /* forall<e> (scope : lifetime-scope<e>) -> <exn|e> () */  {
   
  var x_10104 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "lifetime scope disposal");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return lifetime_scope_fs__mlift_dispose_10069(scope, wild__);
    });
  }
  else {
     
    var _x_x1_0_10059 = $std_core_hnd._open_none1(function(_this /* lifetime-scope<483> */ ) {
        return _this.scope_registration;
      }, scope);
    var _x5 = $std_core_hnd._open_none1($kokaine_internal_registry.registry_registration_fs_take, _x_x1_0_10059);
    if (_x5 === null) {
      return $std_core_types.Unit;
    }
    else {
       
      var _x_x1_2_10061 = $std_core_hnd._open_none1(function(_this_0 /* lifetime-scope<483> */ ) {
          return _this_0.scope_frame;
        }, scope);
      return $kokaine_reactive_internal_lifetime.retire_lifetime($std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<483> */ ) {
          return frame;
        }, _x_x1_2_10061));
    }
  }
}