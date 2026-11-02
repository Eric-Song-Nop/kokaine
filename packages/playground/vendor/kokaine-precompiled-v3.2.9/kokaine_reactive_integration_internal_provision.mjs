// Koka generated module: kokaine/reactive/integration/internal/provision, koka version: 3.2.9
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
import * as $kokaine_reactive_internal_scheduler from './kokaine_reactive_internal_scheduler.mjs';
import * as $kokaine_reactive_internal_lifetime from './kokaine_reactive_internal_lifetime.mjs';
import * as $kokaine_reactive_internal_work_dash_transaction from './kokaine_reactive_internal_work_dash_transaction.mjs';
import * as $kokaine_internal_compat from './kokaine_internal_compat.mjs';
import * as $std_core_undiv from './std_core_undiv.mjs';
import * as $std_core_unsafe from './std_core_unsafe.mjs';
import * as $kokaine_internal_registry from './kokaine_internal_registry.mjs';
 
// externals
 
// type declarations
// type provision
export function Provision(provision_root, provision_derive_group, provision_effect_group) /* forall<e> (provision-root : internal/model/root<e>, provision-derive-group : internal/work-transaction/work-group<internal/model/work<total>>, provision-effect-group : internal/work-transaction/work-group<internal/model/work<e>>) -> provision<e> */  {
  return { provision_root: provision_root, provision_derive_group: provision_derive_group, provision_effect_group: provision_effect_group };
}
// type provision-lease
export function Provision_lease(lease_provision) /* forall<e> (lease-provision : provision<e>) -> provision-lease<e> */  {
  return lease_provision;
}
 
// declarations
 
 
// // Automatically generated. Retrieves the `provision-root` constructor field of the `:provision` type.
export function provision_fs_provision_root(provision) /* forall<e> (provision : provision<e>) -> internal/model/root<e> */  {
  return provision.provision_root;
}
 
 
// // Automatically generated. Retrieves the `provision-derive-group` constructor field of the `:provision` type.
export function provision_fs_provision_derive_group(provision) /* forall<e> (provision : provision<e>) -> internal/work-transaction/work-group<internal/model/work<total>> */  {
  return provision.provision_derive_group;
}
 
 
// // Automatically generated. Retrieves the `provision-effect-group` constructor field of the `:provision` type.
export function provision_fs_provision_effect_group(provision) /* forall<e> (provision : provision<e>) -> internal/work-transaction/work-group<internal/model/work<e>> */  {
  return provision.provision_effect_group;
}
 
export function provision_fs__copy(_this, provision_root, provision_derive_group, provision_effect_group) /* forall<e> (provision<e>, provision-root : ? (internal/model/root<e>), provision-derive-group : ? (internal/work-transaction/work-group<internal/model/work<total>>), provision-effect-group : ? (internal/work-transaction/work-group<internal/model/work<e>>)) -> provision<e> */  {
  if (provision_root !== undefined) {
    var _x0 = provision_root;
  }
  else {
    var _x0 = _this.provision_root;
  }
  if (provision_derive_group !== undefined) {
    var _x1 = provision_derive_group;
  }
  else {
    var _x1 = _this.provision_derive_group;
  }
  if (provision_effect_group !== undefined) {
    var _x2 = provision_effect_group;
  }
  else {
    var _x2 = _this.provision_effect_group;
  }
  return Provision(_x0, _x1, _x2);
}
 
 
// // Automatically generated. Retrieves the `lease-provision` constructor field of the `:provision-lease` type.
export function provision_lease_fs_lease_provision(_this) /* forall<e> (provision-lease<e>) -> provision<e> */  {
  return _this;
}
 
export function provision_lease_fs__copy(_this, lease_provision) /* forall<e> (provision-lease<e>, lease-provision : ? (provision<e>)) -> provision-lease<e> */  {
  if (lease_provision !== undefined) {
    var _x3 = lease_provision;
  }
  else {
    var _x3 = _this;
  }
  return _x3;
}
 
export function provision_lease_fs_provision(lease) /* forall<e> (lease : provision-lease<e>) -> provision<e> */  {
  return lease;
}
 
export function provision_fs_same(left, right) /* forall<e> (left : provision<e>, right : provision<e>) -> bool */  {
  var _x5 = left.provision_root.root_key;
  var _x6 = right.provision_root.root_key;
  var _x4 = Object.is(_x5,_x6);
  if (_x4) {
    var _x8 = left.provision_derive_group.group_state;
    var _x9 = right.provision_derive_group.group_state;
    var _x7 = Object.is(_x8,_x9);
    if (_x7) {
      var _x10 = left.provision_effect_group.group_state;
      var _x11 = right.provision_effect_group.group_state;
      return Object.is(_x10,_x11);
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
}
 
export function provision_lease_fs_state(lease) /* forall<e> (lease : provision-lease<e>) -> internal/work-transaction/work-transaction-state */  {
  var _x12 = lease.provision_derive_group;
  return $kokaine_reactive_internal_work_dash_transaction.work_group_fs_state(_x12);
}
 
export function plane_has_group(plane, expected) /* forall<e> (plane : internal/model/plane<e>, expected : internal/work-transaction/work-group<internal/model/work<e>>) -> bool */  {
  var _x14 = plane.plane_work_group;
  var _x13 = $kokaine_reactive_internal_model.load(_x14);
  if (_x13 === null) {
    return false;
  }
  else {
    var _x15 = _x13.value.group_state;
    var _x16 = expected.group_state;
    return Object.is(_x15,_x16);
  }
}
 
export function check_provision_root(current) /* forall<e> (current : provision<e>) -> exn () */  {
   
  var root = $std_core_hnd._open_none1(function(provision /* provision<636> */ ) {
      return provision.provision_root;
    }, current);
   
  var _x_x1_1_10263 = $std_core_hnd._open_none1(function(root_0 /* internal/model/root<636> */ ) {
      return root_0.root_disposed;
    }, root);
   
  var _x_x1_0_10262 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_1_10263);
  var _x17 = $std_core_hnd._open_none1(function(b /* bool */ ) {
      return (b) ? false : true;
    }, _x_x1_0_10262);
  if (_x17) {
     
    var _x_x1_4_10266 = $std_core_hnd._open_none1(function(root_1 /* internal/model/root<636> */ ) {
        return root_1.root_disposing;
      }, root);
     
    var _x_x1_3_10265 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_4_10266);
    var _x18 = $std_core_hnd._open_none1(function(b_0 /* bool */ ) {
        return (b_0) ? false : true;
      }, _x_x1_3_10265);
    if (_x18) {
      return $std_core_types.Unit;
    }
    else {
      return $std_core_exn.$throw("provisional frontier belongs to a retired reactive root");
    }
  }
  else {
    return $std_core_exn.$throw("provisional frontier belongs to a retired reactive root");
  }
}
 
 
// // monadic lift
export function _mlift_check_active_provision_10369(current, wild) /* forall<e> (current : provision<e>, wild : ()) -> exn () */  {
   
  var root = $std_core_hnd._open_none1(function(provision /* provision<729> */ ) {
      return provision.provision_root;
    }, current);
   
  var _x_x1_0_10269 = $std_core_hnd._open_none1(function(root_0 /* internal/model/root<729> */ ) {
      return root_0.root_derive_plane;
    }, root);
   
  var _x_x2_10270 = $std_core_hnd._open_none1(function(provision_0 /* provision<729> */ ) {
      return provision_0.provision_derive_group;
    }, current);
  var _x19 = $std_core_hnd._open_none2(function(plane /* internal/model/plane<total> */ , expected /* internal/work-transaction/work-group<internal/model/work<total>> */ ) {
      var _x21 = plane.plane_work_group;
      var _x20 = $kokaine_reactive_internal_model.load(_x21);
      if (_x20 === null) {
        return false;
      }
      else {
        var _x22 = _x20.value.group_state;
        var _x23 = expected.group_state;
        return Object.is(_x22,_x23);
      }
    }, _x_x1_0_10269, _x_x2_10270);
  if (_x19) {
     
    var _x_x1_3_10273 = $std_core_hnd._open_none1(function(root_1 /* internal/model/root<729> */ ) {
        return root_1.root_effect_plane;
      }, root);
     
    var _x_x2_0_10274 = $std_core_hnd._open_none1(function(provision_1 /* provision<729> */ ) {
        return provision_1.provision_effect_group;
      }, current);
    var _x24 = $std_core_hnd._open_none2(function(plane_1 /* internal/model/plane<729> */ , expected_0 /* internal/work-transaction/work-group<internal/model/work<729>> */ ) {
        var _x26 = plane_1.plane_work_group;
        var _x25 = $kokaine_reactive_internal_model.load(_x26);
        if (_x25 === null) {
          return false;
        }
        else {
          var _x27 = _x25.value.group_state;
          var _x28 = expected_0.group_state;
          return Object.is(_x27,_x28);
        }
      }, _x_x1_3_10273, _x_x2_0_10274);
    if (_x24) {
      return $std_core_types.Unit;
    }
    else {
      return $std_core_exn.$throw("provisional frontier is not active on its reactive root");
    }
  }
  else {
    return $std_core_exn.$throw("provisional frontier is not active on its reactive root");
  }
}
 
export function check_active_provision(current) /* forall<e> (current : provision<e>) -> exn () */  {
   
  var x_10386 = check_provision_root(current);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild /* () */ ) {
      return _mlift_check_active_provision_10369(current, wild);
    });
  }
  else {
     
    var root = $std_core_hnd._open_none1(function(provision /* provision<729> */ ) {
        return provision.provision_root;
      }, current);
     
    var _x_x1_0_10269 = $std_core_hnd._open_none1(function(root_0 /* internal/model/root<729> */ ) {
        return root_0.root_derive_plane;
      }, root);
     
    var _x_x2_10270 = $std_core_hnd._open_none1(function(provision_0 /* provision<729> */ ) {
        return provision_0.provision_derive_group;
      }, current);
    var _x29 = $std_core_hnd._open_none2(function(plane /* internal/model/plane<total> */ , expected /* internal/work-transaction/work-group<internal/model/work<total>> */ ) {
        var _x31 = plane.plane_work_group;
        var _x30 = $kokaine_reactive_internal_model.load(_x31);
        if (_x30 === null) {
          return false;
        }
        else {
          var _x32 = _x30.value.group_state;
          var _x33 = expected.group_state;
          return Object.is(_x32,_x33);
        }
      }, _x_x1_0_10269, _x_x2_10270);
    if (_x29) {
       
      var _x_x1_3_10273 = $std_core_hnd._open_none1(function(root_1 /* internal/model/root<729> */ ) {
          return root_1.root_effect_plane;
        }, root);
       
      var _x_x2_0_10274 = $std_core_hnd._open_none1(function(provision_1 /* provision<729> */ ) {
          return provision_1.provision_effect_group;
        }, current);
      var _x34 = $std_core_hnd._open_none2(function(plane_1 /* internal/model/plane<729> */ , expected_0 /* internal/work-transaction/work-group<internal/model/work<729>> */ ) {
          var _x36 = plane_1.plane_work_group;
          var _x35 = $kokaine_reactive_internal_model.load(_x36);
          if (_x35 === null) {
            return false;
          }
          else {
            var _x37 = _x35.value.group_state;
            var _x38 = expected_0.group_state;
            return Object.is(_x37,_x38);
          }
        }, _x_x1_3_10273, _x_x2_0_10274);
      if (_x34) {
        return $std_core_types.Unit;
      }
      else {
        return $std_core_exn.$throw("provisional frontier is not active on its reactive root");
      }
    }
    else {
      return $std_core_exn.$throw("provisional frontier is not active on its reactive root");
    }
  }
}
 
 
// // monadic lift
export function _mlift_open_provision_10370(root, _y_x10100) /* forall<_e,e1> (root : internal/model/root<e1>, hnd/ev-index) -> exn provision-lease<e1> */  {
  return $std_core_hnd._mask_at(_y_x10100, false, function() {
       
      var state = $kokaine_reactive_internal_work_dash_transaction.cell($kokaine_reactive_internal_work_dash_transaction.Work_open);
       
      var derive_group = $kokaine_reactive_internal_work_dash_transaction.new_work_group(state);
       
      var effect_group = $kokaine_reactive_internal_work_dash_transaction.new_work_group(state);
       
      var _x39 = root.root_derive_plane.plane_work_group;
      $kokaine_reactive_internal_model.store(_x39, $std_core_types.Just(derive_group));
       
      var _x40 = root.root_effect_plane.plane_work_group;
      $kokaine_reactive_internal_model.store(_x40, $std_core_types.Just(effect_group));
      return Provision(root, derive_group, effect_group);
    });
}
 
 
// // monadic lift
export function _mlift_open_provision_10371(root, wild) /* forall<_e,e1> (root : internal/model/root<e1>, wild : ()) -> exn provision-lease<e1> */  {
   
  var _x_x1_1_10279 = $std_core_hnd._open_none1(function(root_0 /* internal/model/root<950> */ ) {
      return root_0.root_derive_plane;
    }, root);
   
  var _x_x1_0_10278 = $std_core_hnd._open_none1(function(plane /* internal/model/plane<total> */ ) {
      return plane.plane_work_group;
    }, _x_x1_1_10279);
   
  var _x_x1_10277 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_0_10278);
  var _x39 = $std_core_hnd._open_none1(function(maybe /* maybe<internal/work-transaction/work-group<internal/model/work<total>>> */ ) {
      return (maybe !== null);
    }, _x_x1_10277);
  if (_x39) {
    return $std_core_exn.$throw("a provision is already active on this root");
  }
  else {
     
    var _x_x1_5_10283 = $std_core_hnd._open_none1(function(root_1 /* internal/model/root<950> */ ) {
        return root_1.root_effect_plane;
      }, root);
     
    var _x_x1_4_10282 = $std_core_hnd._open_none1(function(plane_0 /* internal/model/plane<950> */ ) {
        return plane_0.plane_work_group;
      }, _x_x1_5_10283);
     
    var _x_x1_3_10281 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_4_10282);
    var _x40 = $std_core_hnd._open_none1(function(maybe_0 /* maybe<internal/work-transaction/work-group<internal/model/work<950>>> */ ) {
        return (maybe_0 !== null);
      }, _x_x1_3_10281);
    if (_x40) {
      return $std_core_exn.$throw("a provision is already active on this root");
    }
    else {
       
      var x_10389 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10100 /* hnd/ev-index */ ) {
          return _mlift_open_provision_10370(root, _y_x10100);
        });
      }
      else {
        return _mlift_open_provision_10370(root, x_10389);
      }
    }
  }
}
 
export function open_provision(root) /* forall<e> (root : internal/model/root<e>) -> exn provision-lease<e> */  {
   
  var x_10391 = $kokaine_reactive_internal_scheduler.check_registration(root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild /* () */ ) {
      return _mlift_open_provision_10371(root, wild);
    });
  }
  else {
     
    var _x_x1_1_10279 = $std_core_hnd._open_none1(function(root_0 /* internal/model/root<950> */ ) {
        return root_0.root_derive_plane;
      }, root);
     
    var _x_x1_0_10278 = $std_core_hnd._open_none1(function(plane /* internal/model/plane<total> */ ) {
        return plane.plane_work_group;
      }, _x_x1_1_10279);
     
    var _x_x1_10277 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_0_10278);
    var _x41 = $std_core_hnd._open_none1(function(maybe /* maybe<internal/work-transaction/work-group<internal/model/work<total>>> */ ) {
        return (maybe !== null);
      }, _x_x1_10277);
    if (_x41) {
      return $std_core_exn.$throw("a provision is already active on this root");
    }
    else {
       
      var _x_x1_5_10283 = $std_core_hnd._open_none1(function(root_1 /* internal/model/root<950> */ ) {
          return root_1.root_effect_plane;
        }, root);
       
      var _x_x1_4_10282 = $std_core_hnd._open_none1(function(plane_0 /* internal/model/plane<950> */ ) {
          return plane_0.plane_work_group;
        }, _x_x1_5_10283);
       
      var _x_x1_3_10281 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_4_10282);
      var _x42 = $std_core_hnd._open_none1(function(maybe_0 /* maybe<internal/work-transaction/work-group<internal/model/work<950>>> */ ) {
          return (maybe_0 !== null);
        }, _x_x1_3_10281);
      if (_x42) {
        return $std_core_exn.$throw("a provision is already active on this root");
      }
      else {
         
        var x_0_10394 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10100 /* hnd/ev-index */ ) {
            return _mlift_open_provision_10370(root, _y_x10100);
          });
        }
        else {
          return $std_core_hnd._mask_at(x_0_10394, false, function() {
               
              var state = $kokaine_reactive_internal_work_dash_transaction.cell($kokaine_reactive_internal_work_dash_transaction.Work_open);
               
              var derive_group = $kokaine_reactive_internal_work_dash_transaction.new_work_group(state);
               
              var effect_group = $kokaine_reactive_internal_work_dash_transaction.new_work_group(state);
               
              var _x43 = root.root_derive_plane.plane_work_group;
              $kokaine_reactive_internal_model.store(_x43, $std_core_types.Just(derive_group));
               
              var _x44 = root.root_effect_plane.plane_work_group;
              $kokaine_reactive_internal_model.store(_x44, $std_core_types.Just(effect_group));
              return Provision(root, derive_group, effect_group);
            });
        }
      }
    }
  }
}
 
 
// // monadic lift
export function _mlift_current_provision_10372(root, wild) /* forall<e> (root : internal/model/root<e>, wild : ()) -> exn maybe<provision<e>> */  {
   
  var _x_x1_0_10286 = $std_core_hnd._open_none1(function(root_0 /* internal/model/root<1161> */ ) {
      return root_0.root_derive_plane;
    }, root);
   
  var _x_x1_10285 = $std_core_hnd._open_none1(function(plane /* internal/model/plane<total> */ ) {
      return plane.plane_work_group;
    }, _x_x1_0_10286);
  var _x43 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_10285);
   
  var _x_x1_3_10289 = $std_core_hnd._open_none1(function(root_1 /* internal/model/root<1161> */ ) {
      return root_1.root_effect_plane;
    }, root);
   
  var _x_x1_2_10288 = $std_core_hnd._open_none1(function(plane_0 /* internal/model/plane<1161> */ ) {
      return plane_0.plane_work_group;
    }, _x_x1_3_10289);
  var _x44 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_2_10288);
  if (_x43 === null && _x44 === null) {
    return $std_core_types.Nothing;
  }
  else if (_x43 !== null && _x44 !== null) {
     
    var _x_x1_5_10291 = $std_core_hnd._open_none2(function(left /* internal/work-transaction/work-group<internal/model/work<total>> */ , right /* internal/work-transaction/work-group<internal/model/work<1161>> */ ) {
        var _x45 = left.group_state;
        var _x46 = right.group_state;
        return Object.is(_x45,_x46);
      }, _x43.value, _x44.value);
    var _x45 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_5_10291);
    if (_x45) {
      return $std_core_exn.$throw("reactive planes disagree about the active provision");
    }
    else {
      var _x46 = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_state, _x43.value);
      if (_x46._tag === 1) {
        return $std_core_types.Just(Provision(root, _x43.value, _x44.value));
      }
      else if (_x46._tag === 2) {
        return $std_core_types.Just(Provision(root, _x43.value, _x44.value));
      }
      else {
        return $std_core_exn.$throw("cannot join a terminal provision");
      }
    }
  }
  else {
    return $std_core_exn.$throw("reactive root has a partially attached provision");
  }
}
 
 
// // Integrations inspect the active frontier to decide whether they own a new
// // boundary or join work already being drained.
export function current_provision(root) /* forall<e> (root : internal/model/root<e>) -> exn maybe<provision<e>> */  {
   
  var x_10397 = $kokaine_reactive_internal_scheduler.check_registration(root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild /* () */ ) {
      return _mlift_current_provision_10372(root, wild);
    });
  }
  else {
     
    var _x_x1_0_10286 = $std_core_hnd._open_none1(function(root_0 /* internal/model/root<1161> */ ) {
        return root_0.root_derive_plane;
      }, root);
     
    var _x_x1_10285 = $std_core_hnd._open_none1(function(plane /* internal/model/plane<total> */ ) {
        return plane.plane_work_group;
      }, _x_x1_0_10286);
    var _x47 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_10285);
     
    var _x_x1_3_10289 = $std_core_hnd._open_none1(function(root_1 /* internal/model/root<1161> */ ) {
        return root_1.root_effect_plane;
      }, root);
     
    var _x_x1_2_10288 = $std_core_hnd._open_none1(function(plane_0 /* internal/model/plane<1161> */ ) {
        return plane_0.plane_work_group;
      }, _x_x1_3_10289);
    var _x48 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_2_10288);
    if (_x47 === null && _x48 === null) {
      return $std_core_types.Nothing;
    }
    else if (_x47 !== null && _x48 !== null) {
       
      var _x_x1_5_10291 = $std_core_hnd._open_none2(function(left /* internal/work-transaction/work-group<internal/model/work<total>> */ , right /* internal/work-transaction/work-group<internal/model/work<1161>> */ ) {
          var _x49 = left.group_state;
          var _x50 = right.group_state;
          return Object.is(_x49,_x50);
        }, _x47.value, _x48.value);
      var _x49 = $std_core_hnd._open_none1(function(b /* bool */ ) {
          return (b) ? false : true;
        }, _x_x1_5_10291);
      if (_x49) {
        return $std_core_exn.$throw("reactive planes disagree about the active provision");
      }
      else {
        var _x50 = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_state, _x47.value);
        if (_x50._tag === 1) {
          return $std_core_types.Just(Provision(root, _x47.value, _x48.value));
        }
        else if (_x50._tag === 2) {
          return $std_core_types.Just(Provision(root, _x47.value, _x48.value));
        }
        else {
          return $std_core_exn.$throw("cannot join a terminal provision");
        }
      }
    }
    else {
      return $std_core_exn.$throw("reactive root has a partially attached provision");
    }
  }
}
 
export function restore_group_skipped(group, skipped) /* forall<e> (group : internal/work-transaction/work-group<internal/model/work<e>>, skipped : list<internal/model/work<e>>) -> div () */  { tailcall: while(1)
{
  if (skipped === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x51 = group.group_queue;
    var target_0_10027 = $kokaine_reactive_internal_work_dash_transaction.load(_x51);
     
    var _x52 = group.group_queue;
    var _x53 = target_0_10027.deque_front;
    var _x54 = target_0_10027.deque_back;
    $kokaine_reactive_internal_work_dash_transaction.store(_x52, $kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Cons(skipped.head, _x53), _x54));
    {
      // tail call
      skipped = skipped.tail;
      continue tailcall;
    }
  }
}}
 
export function take_group_work_loop(group, skipped) /* forall<e> (group : internal/work-transaction/work-group<internal/model/work<e>>, skipped : list<internal/model/work<e>>) -> div maybe<internal/model/work<e>> */  { tailcall: while(1)
{
  var _x52 = group.group_queue;
  var _x51 = $kokaine_reactive_internal_work_dash_transaction.deque_fs_pop($kokaine_reactive_internal_work_dash_transaction.load(_x52));
   
  var _x53 = group.group_queue;
  $kokaine_reactive_internal_work_dash_transaction.store(_x53, _x51.snd);
  if (_x51.fst === null) {
     
    restore_group_skipped(group, skipped);
    return $std_core_types.Nothing;
  }
  else {
    var _x53 = $kokaine_reactive_internal_scheduler.work_runnable(_x51.fst.value);
    if (_x53) {
       
      restore_group_skipped(group, skipped);
      return $std_core_types.Just(_x51.fst.value);
    }
    else {
      var _x54 = $kokaine_reactive_internal_scheduler.work_stale(_x51.fst.value);
      if (_x54) {
        {
          // tail call
          continue tailcall;
        }
      }
      else {
        {
          // tail call
          var _x55 = $std_core_types.Cons(_x51.fst.value, skipped);
          skipped = _x55;
          continue tailcall;
        }
      }
    }
  }
}}
 
export function take_group_work(group) /* forall<e> (group : internal/work-transaction/work-group<internal/model/work<e>>) -> maybe<internal/model/work<e>> */  {
  return take_group_work_loop(group, $std_core_types.Nil);
}
 
export function restore_group_deferred(group, deferred) /* (group : internal/work-transaction/work-group<internal/model/work<total>>, deferred : list<internal/model/work<total>>) -> () */  {
   
  var values_10040 = $std_core_list.reverse_acc($std_core_types.Nil, deferred);
  var _x56 = group.group_queue;
  return $kokaine_reactive_internal_work_dash_transaction.append_values_loop(_x56, values_10040);
}
 
export function run_next_derived_group_loop(plane, group, deferred) /* (plane : internal/model/plane<total>, group : internal/work-transaction/work-group<internal/model/work<total>>, deferred : list<internal/model/work<total>>) -> div error<bool> */  { tailcall: while(1)
{
  var _x57 = take_group_work_loop(group, $std_core_types.Nil);
  if (_x57 === null) {
     
    restore_group_deferred(group, deferred);
    return $std_core_types.Ok(false);
  }
  else {
    var _x58 = $kokaine_reactive_internal_scheduler.run_derive_work(plane, _x57.value);
    if (_x58._tag === 1) {
       
      var _x59 = $kokaine_reactive_internal_scheduler.work_stale(_x57.value);
      if (_x59) {
        $std_core_types.Unit;
      }
      else {
         
        var _x60 = group.group_queue;
        var target_0_10038 = $kokaine_reactive_internal_work_dash_transaction.load(_x60);
        var _x60 = group.group_queue;
        var _x61 = target_0_10038.deque_front;
        var _x62 = target_0_10038.deque_back;
        $kokaine_reactive_internal_work_dash_transaction.store(_x60, $kokaine_reactive_internal_work_dash_transaction.Deque(_x61, $std_core_types.Cons(_x57.value, _x62)));
      }
       
      restore_group_deferred(group, deferred);
      return $std_core_types.Ok(true);
    }
    else if (_x58._tag === 2) {
      {
        // tail call
        var _x59 = $std_core_types.Cons(_x57.value, deferred);
        deferred = _x59;
        continue tailcall;
      }
    }
    else {
       
      var _x60 = $kokaine_reactive_internal_scheduler.work_stale(_x57.value);
      if (_x60) {
        $std_core_types.Unit;
      }
      else {
         
        var _x61 = group.group_queue;
        var target_0_10038_0 = $kokaine_reactive_internal_work_dash_transaction.load(_x61);
        var _x61 = group.group_queue;
        var _x62 = target_0_10038_0.deque_front;
        var _x63 = target_0_10038_0.deque_back;
        $kokaine_reactive_internal_work_dash_transaction.store(_x61, $kokaine_reactive_internal_work_dash_transaction.Deque(_x62, $std_core_types.Cons(_x57.value, _x63)));
      }
       
      restore_group_deferred(group, deferred);
      return $std_core_types.$Error(_x58.settle_exception);
    }
  }
}}
 
export function run_next_derived_group(plane, group) /* (plane : internal/model/plane<total>, group : internal/work-transaction/work-group<internal/model/work<total>>) -> error<bool> */  {
  return run_next_derived_group_loop(plane, group, $std_core_types.Nil);
}
 
 
// // monadic lift
export function _mlift_run_next_effect_group_10373(_y_x10116) /* forall<e> (error<()>) -> <div|e> result<bool,exception> */  {
  if (_y_x10116._tag === 1) {
    return $std_core_types.$Error(_y_x10116.error);
  }
  else {
    return $std_core_types.Ok(true);
  }
}
 
export function run_next_effect_group(plane, group) /* forall<e> (plane : internal/model/plane<e>, group : internal/work-transaction/work-group<internal/model/work<e>>) -> <div|e> error<bool> */  {
  var _x60 = take_group_work_loop(group, $std_core_types.Nil);
  if (_x60 === null) {
    return $std_core_types.Ok(false);
  }
  else {
     
    var _x61 = group.group_queue;
    var target_0_10027 = $kokaine_reactive_internal_work_dash_transaction.load(_x61);
     
    var _x62 = group.group_queue;
    var _x63 = target_0_10027.deque_front;
    var _x64 = target_0_10027.deque_back;
    $kokaine_reactive_internal_work_dash_transaction.store(_x62, $kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Cons(_x60.value, _x63), _x64));
     
    var x_10400 = $kokaine_reactive_internal_scheduler.run_work_raw(plane, _x60.value);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10116 /* error<()> */ ) {
        if (_y_x10116._tag === 1) {
          return $std_core_types.$Error(_y_x10116.error);
        }
        else {
          return $std_core_types.Ok(true);
        }
      });
    }
    else {
      if (x_10400._tag === 1) {
        return $std_core_types.$Error(x_10400.error);
      }
      else {
        return $std_core_types.Ok(true);
      }
    }
  }
}
 
 
// // monadic lift
export function _mlift_drain_provision_loop_10374(current, _y_x10119) /* forall<e> (current : provision<e>, error<bool>) -> <div|e> result<(),exception> */  {
  if (_y_x10119._tag === 1) {
    return $std_core_types.$Error(_y_x10119.error);
  }
  else if (_y_x10119._tag === 2 && _y_x10119.value) {
    return drain_provision_loop(current);
  }
  else {
    return $std_core_types.Ok($std_core_types.Unit);
  }
}
 
export function drain_provision_loop(current_0) /* forall<e> (current : provision<e>) -> <div|e> error<()> */  { tailcall: while(1)
{
  var _x62 = current_0.provision_root.root_derive_plane;
  var _x63 = current_0.provision_derive_group;
  var _x61 = run_next_derived_group_loop(_x62, _x63, $std_core_types.Nil);
  if (_x61._tag === 1) {
    return $std_core_types.$Error(_x61.error);
  }
  else if (_x61._tag === 2 && _x61.value) {
    {
      // tail call
      continue tailcall;
    }
  }
  else {
     
    var _x64 = current_0.provision_root.root_effect_plane;
    var _x65 = current_0.provision_effect_group;
    var x_10404 = run_next_effect_group(_x64, _x65);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10119_0 /* error<bool> */ ) {
        return _mlift_drain_provision_loop_10374(current_0, _y_x10119_0);
      });
    }
    else {
      if (x_10404._tag === 1) {
        return $std_core_types.$Error(x_10404.error);
      }
      else if (x_10404._tag === 2 && x_10404.value) {
        {
          // tail call
          continue tailcall;
        }
      }
      else {
        return $std_core_types.Ok($std_core_types.Unit);
      }
    }
  }
}}
 
export function detach_matching_group(plane, expected) /* forall<e> (plane : internal/model/plane<e>, expected : internal/work-transaction/work-group<internal/model/work<e>>) -> () */  {
  var _x65 = plane.plane_work_group;
  var _x64 = $kokaine_reactive_internal_model.load(_x65);
  if (_x64 === null) {
    return $std_core_types.Unit;
  }
  else {
    var _x67 = _x64.value.group_state;
    var _x68 = expected.group_state;
    var _x66 = Object.is(_x67,_x68);
    if (_x66) {
      var _x69 = plane.plane_work_group;
      return $kokaine_reactive_internal_model.store(_x69, $std_core_types.Nothing);
    }
    else {
      return $std_core_types.Unit;
    }
  }
}
 
export function prepend_bootstrap_retirements(values, collected) /* forall<e> (values : list<internal/model/work<e>>, collected : list<internal/model/retirement-work<e>>) -> div list<internal/model/retirement-work<e>> */  { tailcall: while(1)
{
  if (values === null) {
    return collected;
  }
  else {
    if (values.head._tag === 2) {
      {
        // tail call
        var _x71 = function(_scope70 /* internal/model/continuation-scope<1948> */ ) {
          return $std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
              return $kokaine_reactive_internal_lifetime.scope_retirement_expand(_scope70);
            }), collected);
        }(values.head.bootstrap_scope);
        values = values.tail;
        collected = _x71;
        continue tailcall;
      }
    }
    else {
      {
        // tail call
        values = values.tail;
        continue tailcall;
      }
    }
  }
}}
 
export function prepend_pure_bootstrap_retirements(values, collected) /* forall<e> (values : list<internal/model/work<total>>, collected : list<internal/model/retirement-work<e>>) -> div list<internal/model/retirement-work<e>> */  { tailcall: while(1)
{
  if (values === null) {
    return collected;
  }
  else {
    if (values.head._tag === 2) {
       
      var structural = $kokaine_reactive_internal_lifetime.widen_pure_retirement($kokaine_reactive_internal_model.Retirement_step(function() {
        return $kokaine_reactive_internal_lifetime.scope_retirement_expand(values.head.bootstrap_scope);
      }));
      {
        // tail call
        var _x72 = $std_core_types.Cons(structural, collected);
        values = values.tail;
        collected = _x72;
        continue tailcall;
      }
    }
    else {
      {
        // tail call
        values = values.tail;
        continue tailcall;
      }
    }
  }
}}
 
 
// // monadic lift
export function _mlift_retire_provision_bootstraps_10375(root, finalizers) /* forall<e> (root : internal/model/root<e>, finalizers : list<internal/model/retirement-work<e>>) -> <div,exn|e> () */  {
   
  var _x_x1_2_10300 = $std_core_hnd._open_none1(function(root_0 /* internal/model/root<2085> */ ) {
      return root_0.root_lifetime;
    }, root);
  return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this /* internal/model/lifetime-owner<2085> */ ) {
        return _this.lifetime_retirement;
      }, _x_x1_2_10300), finalizers);
}
 
 
// // monadic lift
export function _mlift_retire_provision_bootstraps_10376(root, structural) /* forall<e> (root : internal/model/root<e>, structural : list<internal/model/retirement-work<e>>) -> <div,exn|e> () */  {
   
  var x_10407 = $std_core_hnd._open_none1(function(values /* list<internal/model/retirement-work<2085>> */ ) {
      return $kokaine_reactive_internal_lifetime.collect_retirement_loop(values, $std_core_types.Nil);
    }, structural);
   
  function next_10408(finalizers) /* (list<internal/model/retirement-work<2085>>) -> <div,exn|2085> () */  {
     
    var _x_x1_2_10300 = $std_core_hnd._open_none1(function(root_0_0 /* internal/model/root<2085> */ ) {
        return root_0_0.root_lifetime;
      }, root);
    return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this /* internal/model/lifetime-owner<2085> */ ) {
          return _this.lifetime_retirement;
        }, _x_x1_2_10300), finalizers);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10408);
  }
  else {
    return next_10408(x_10407);
  }
}
 
 
// // monadic lift
export function _mlift_retire_provision_bootstraps_10377(derive_owned, root, effect_structural) /* forall<e> (derive-owned : list<internal/model/work<total>>, root : internal/model/root<e>, effect-structural : list<internal/model/retirement-work<e>>) -> <div,exn|e> () */  {
   
  var x_10411 = $std_core_hnd._open_none2(prepend_pure_bootstrap_retirements, derive_owned, effect_structural);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(structural /* list<internal/model/retirement-work<2085>> */ ) {
      return _mlift_retire_provision_bootstraps_10376(root, structural);
    });
  }
  else {
    return _mlift_retire_provision_bootstraps_10376(root, x_10411);
  }
}
 
export function retire_provision_bootstraps(root, derive_owned, effect_owned) /* forall<e> (root : internal/model/root<e>, derive-owned : list<internal/model/work<total>>, effect-owned : list<internal/model/work<e>>) -> <div,exn|e> () */  {
   
  var x_10413 = $std_core_hnd._open_none2(prepend_bootstrap_retirements, effect_owned, $std_core_types.Nil);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(effect_structural /* list<internal/model/retirement-work<2085>> */ ) {
      return _mlift_retire_provision_bootstraps_10377(derive_owned, root, effect_structural);
    });
  }
  else {
     
    var x_0_10416 = $std_core_hnd._open_none2(prepend_pure_bootstrap_retirements, derive_owned, x_10413);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(structural /* list<internal/model/retirement-work<2085>> */ ) {
        return _mlift_retire_provision_bootstraps_10376(root, structural);
      });
    }
    else {
       
      var x_1_10419 = $std_core_hnd._open_none1(function(values /* list<internal/model/retirement-work<2085>> */ ) {
          return $kokaine_reactive_internal_lifetime.collect_retirement_loop(values, $std_core_types.Nil);
        }, x_0_10416);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(finalizers /* list<internal/model/retirement-work<2085>> */ ) {
           
          var _x_x1_2_10300 = $std_core_hnd._open_none1(function(root_0_0 /* internal/model/root<2085> */ ) {
              return root_0_0.root_lifetime;
            }, root);
          return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this /* internal/model/lifetime-owner<2085> */ ) {
                return _this.lifetime_retirement;
              }, _x_x1_2_10300), finalizers);
        });
      }
      else {
         
        var _x_x1_2_10300_0 = $std_core_hnd._open_none1(function(root_0_1 /* internal/model/root<2085> */ ) {
            return root_0_1.root_lifetime;
          }, root);
        return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this_0 /* internal/model/lifetime-owner<2085> */ ) {
              return _this_0.lifetime_retirement;
            }, _x_x1_2_10300_0), x_1_10419);
      }
    }
  }
}
 
export function discard_provision(lease) /* forall<e> (lease : provision-lease<e>) -> <exn|e> () */  {
   
  var current = $std_core_hnd._open_none1(function(lease_0 /* provision-lease<2309> */ ) {
      return lease_0;
    }, lease);
   
  var root = $std_core_hnd._open_none1(function(provision /* provision<2309> */ ) {
      return provision.provision_root;
    }, current);
   
  var derive_group = $std_core_hnd._open_none1(function(provision_0 /* provision<2309> */ ) {
      return provision_0.provision_derive_group;
    }, current);
   
  var effect_group = $std_core_hnd._open_none1(function(provision_1 /* provision<2309> */ ) {
      return provision_1.provision_effect_group;
    }, current);
  var _x73 = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_state, derive_group);
  if (_x73._tag === 5) {
    return $std_core_types.Unit;
  }
  else if (_x73._tag === 6) {
     
    var _x_x1_4_10307 = $std_core_hnd._open_none1(function(root_0 /* internal/model/root<2309> */ ) {
        return root_0.root_derive_plane;
      }, root);
     
    $std_core_hnd._open_none2(function(plane /* internal/model/plane<total> */ , expected /* internal/work-transaction/work-group<internal/model/work<total>> */ ) {
        var _x75 = plane.plane_work_group;
        var _x74 = $kokaine_reactive_internal_model.load(_x75);
        if (_x74 === null) {
          return $std_core_types.Unit;
        }
        else {
          var _x77 = _x74.value.group_state;
          var _x78 = expected.group_state;
          var _x76 = Object.is(_x77,_x78);
          if (_x76) {
            var _x79 = plane.plane_work_group;
            return $kokaine_reactive_internal_model.store(_x79, $std_core_types.Nothing);
          }
          else {
            return $std_core_types.Unit;
          }
        }
      }, _x_x1_4_10307, derive_group);
     
    var _x_x1_6_10310 = $std_core_hnd._open_none1(function(root_1 /* internal/model/root<2309> */ ) {
        return root_1.root_effect_plane;
      }, root);
     
    $std_core_hnd._open_none2(function(plane_2 /* internal/model/plane<2309> */ , expected_0 /* internal/work-transaction/work-group<internal/model/work<2309>> */ ) {
        var _x81 = plane_2.plane_work_group;
        var _x80 = $kokaine_reactive_internal_model.load(_x81);
        if (_x80 === null) {
          return $std_core_types.Unit;
        }
        else {
          var _x83 = _x80.value.group_state;
          var _x84 = expected_0.group_state;
          var _x82 = Object.is(_x83,_x84);
          if (_x82) {
            var _x85 = plane_2.plane_work_group;
            return $kokaine_reactive_internal_model.store(_x85, $std_core_types.Nothing);
          }
          else {
            return $std_core_types.Unit;
          }
        }
      }, _x_x1_6_10310, effect_group);
     
    $std_core_hnd._open_none1(function(group /* internal/work-transaction/work-group<internal/model/work<total>> */ ) {
         
        var _x86 = group.group_queue;
        $kokaine_reactive_internal_work_dash_transaction.store(_x86, $kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Nil, $std_core_types.Nil));
        var _x86 = group.group_rollback;
        return $kokaine_reactive_internal_work_dash_transaction.store(_x86, $kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Nil, $std_core_types.Nil));
      }, derive_group);
    return $std_core_hnd._open_none1(function(group_0 /* internal/work-transaction/work-group<internal/model/work<2309>> */ ) {
         
        var _x74 = group_0.group_queue;
        $kokaine_reactive_internal_work_dash_transaction.store(_x74, $kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Nil, $std_core_types.Nil));
        var _x74 = group_0.group_rollback;
        return $kokaine_reactive_internal_work_dash_transaction.store(_x74, $kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Nil, $std_core_types.Nil));
      }, effect_group);
  }
  else {
     
    var derive_owned = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_take_rollback, derive_group);
     
    var effect_owned = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_take_rollback, effect_group);
     
    var _x_x1_12_10317 = $std_core_hnd._open_none1(function(root_2 /* internal/model/root<2309> */ ) {
        return root_2.root_derive_plane;
      }, root);
     
    $std_core_hnd._open_none2(function(plane_5 /* internal/model/plane<total> */ , expected_1 /* internal/work-transaction/work-group<internal/model/work<total>> */ ) {
        var _x76 = plane_5.plane_work_group;
        var _x75 = $kokaine_reactive_internal_model.load(_x76);
        if (_x75 === null) {
          return $std_core_types.Unit;
        }
        else {
          var _x78 = _x75.value.group_state;
          var _x79 = expected_1.group_state;
          var _x77 = Object.is(_x78,_x79);
          if (_x77) {
            var _x80 = plane_5.plane_work_group;
            return $kokaine_reactive_internal_model.store(_x80, $std_core_types.Nothing);
          }
          else {
            return $std_core_types.Unit;
          }
        }
      }, _x_x1_12_10317, derive_group);
     
    var _x_x1_14_10320 = $std_core_hnd._open_none1(function(root_3 /* internal/model/root<2309> */ ) {
        return root_3.root_effect_plane;
      }, root);
     
    $std_core_hnd._open_none2(function(plane_8 /* internal/model/plane<2309> */ , expected_2 /* internal/work-transaction/work-group<internal/model/work<2309>> */ ) {
        var _x82 = plane_8.plane_work_group;
        var _x81 = $kokaine_reactive_internal_model.load(_x82);
        if (_x81 === null) {
          return $std_core_types.Unit;
        }
        else {
          var _x84 = _x81.value.group_state;
          var _x85 = expected_2.group_state;
          var _x83 = Object.is(_x84,_x85);
          if (_x83) {
            var _x86 = plane_8.plane_work_group;
            return $kokaine_reactive_internal_model.store(_x86, $std_core_types.Nothing);
          }
          else {
            return $std_core_types.Unit;
          }
        }
      }, _x_x1_14_10320, effect_group);
     
    var claimed = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_mark_aborted, derive_group);
     
    $std_core_hnd._open_none1(function(group_1 /* internal/work-transaction/work-group<internal/model/work<2309>> */ ) {
         
        var _x87 = group_1.group_queue;
        $kokaine_reactive_internal_work_dash_transaction.store(_x87, $kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Nil, $std_core_types.Nil));
        var _x87 = group_1.group_rollback;
        return $kokaine_reactive_internal_work_dash_transaction.store(_x87, $kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Nil, $std_core_types.Nil));
      }, effect_group);
    var _x75 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, claimed);
    if (_x75) {
      return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "provision discard lost its active state");
    }
    else {
      return retire_provision_bootstraps(root, derive_owned, effect_owned);
    }
  }
}
 
 
// // monadic lift
export function _mlift_drain_provision_10378(_pat_3_0) /* forall<e> (error<()>) -> e () */  {
  return $std_core_types.Unit;
}
 
 
// // monadic lift
export function _mlift_drain_provision_10379(_c_x10145, result, _c_x10146) /* (bool, result : error<()>, ()) -> (error<()>, bool) */  {
  return $std_core_types.Tuple2(result, _c_x10145);
}
 
 
// // monadic lift
export function _mlift_drain_provision_10380(completed, result, _c_x10145) /* (completed : ref<global,bool>, result : error<()>, bool) -> (error<()>, bool) */  {
   
  if (_c_x10145) {
    var x_10424 = $kokaine_reactive_internal_model.store(completed, true);
  }
  else {
    var x_10424 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10146 /* () */ ) {
      return $std_core_types.Tuple2(result, _c_x10145);
    });
  }
  else {
    return $std_core_types.Tuple2(result, _c_x10145);
  }
}
 
 
// // monadic lift
export function _mlift_drain_provision_10381(completed, derive_group, result) /* forall<e> (completed : ref<global,bool>, derive-group : internal/work-transaction/work-group<internal/model/work<total>>, result : error<()>) -> <div|e> (error<()>, bool) */  {
   
  if (result._tag === 1) {
    var x_10429 = $kokaine_reactive_internal_work_dash_transaction.work_group_fs_mark_failed(derive_group, result.error);
  }
  else {
    var _x76 = $kokaine_reactive_internal_work_dash_transaction.work_group_fs_state(derive_group);
    if (_x76._tag === 2) {
       
      var _x77 = derive_group.group_state;
      $kokaine_reactive_internal_work_dash_transaction.store(_x77, $kokaine_reactive_internal_work_dash_transaction.Work_ready);
      var x_10429 = true;
    }
    else {
      var x_10429 = false;
    }
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10145 /* bool */ ) {
      return _mlift_drain_provision_10380(completed, result, _c_x10145);
    });
  }
  else {
    return _mlift_drain_provision_10380(completed, result, x_10429);
  }
}
 
 
// // monadic lift
export function _mlift_drain_provision_10382(_y_x10148) /* forall<e> ((error<()>, bool)) -> <exn,div|e> () */  {
  var _x76 = $std_core_hnd._open_none1(function(b_0 /* bool */ ) {
      return (b_0) ? false : true;
    }, _y_x10148.snd);
  if (_x76) {
    return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "provision could not enter a terminal drain state");
  }
  else {
    return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, _y_x10148.fst);
  }
}
 
 
// // monadic lift
export function _mlift_drain_provision_10383(completed, current, derive_group, lease, _y_x10139) /* forall<e> (completed : ref<global,bool>, current : provision<e>, derive-group : internal/work-transaction/work-group<internal/model/work<total>>, lease : provision-lease<e>, hnd/ev-index) -> <exn,div|e> () */  {
   
  var x_10431 = $std_core_hnd._mask_at(_y_x10139, false, function() {
       
      var x_1_10439 = drain_provision_loop(current);
      if ($std_core_hnd._yielding()) {
        var _x78 = $std_core_hnd.yield_extend(function(result /* error<()> */ ) {
          return _mlift_drain_provision_10381(completed, derive_group, result);
        });
      }
      else {
        var _x78 = _mlift_drain_provision_10381(completed, derive_group, x_1_10439);
      }
      return $std_core_hnd.finally_prompt(function() {
          var _x77 = $kokaine_reactive_internal_model.load(completed);
          if (_x77) {
            return $std_core_types.Unit;
          }
          else {
             
            var x_0_10436 = $kokaine_internal_compat.capture_error(function() {
              return discard_provision(lease);
            });
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_pat_3_0 /* error<()> */ ) {
                return $std_core_types.Unit;
              });
            }
            else {
              return $std_core_types.Unit;
            }
          }
        }, _x78);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10148 /* (error<()>, bool) */ ) {
      return _mlift_drain_provision_10382(_y_x10148);
    });
  }
  else {
    return _mlift_drain_provision_10382(x_10431);
  }
}
 
 
// // monadic lift
export function _mlift_drain_provision_10384(current, lease, wild) /* forall<e> (current : provision<e>, lease : provision-lease<e>, wild : ()) -> <exn,div|e> () */  {
   
  var derive_group = $std_core_hnd._open_none1(function(provision /* provision<2557> */ ) {
      return provision.provision_derive_group;
    }, current);
   
  var _x_x1_2_10331 = $std_core_hnd._open_none1(function(group /* internal/work-transaction/work-group<internal/model/work<total>> */ ) {
      var _x77 = $kokaine_reactive_internal_work_dash_transaction.work_group_fs_state(group);
      if (_x77._tag === 1) {
         
        var _x78 = group.group_state;
        $kokaine_reactive_internal_work_dash_transaction.store(_x78, $kokaine_reactive_internal_work_dash_transaction.Work_draining);
        return true;
      }
      else {
        return false;
      }
    }, derive_group);
  var _x77 = $std_core_hnd._open_none1(function(b /* bool */ ) {
      return (b) ? false : true;
    }, _x_x1_2_10331);
  if (_x77) {
    return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "provision can only be drained while open");
  }
  else {
     
    var completed = $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, false);
     
    var x_10442 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10139 /* hnd/ev-index */ ) {
        return _mlift_drain_provision_10383(completed, current, derive_group, lease, _y_x10139);
      });
    }
    else {
      return _mlift_drain_provision_10383(completed, current, derive_group, lease, x_10442);
    }
  }
}
 
export function drain_provision(lease) /* forall<e> (lease : provision-lease<e>) -> <div,exn|e> () */  {
   
  var current = $std_core_hnd._open_none1(function(lease_0 /* provision-lease<2557> */ ) {
      return lease_0;
    }, lease);
   
  var x_10444 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), check_active_provision, current);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild /* () */ ) {
      return _mlift_drain_provision_10384(current, lease, wild);
    });
  }
  else {
     
    var derive_group = $std_core_hnd._open_none1(function(provision /* provision<2557> */ ) {
        return provision.provision_derive_group;
      }, current);
     
    var _x_x1_2_10331 = $std_core_hnd._open_none1(function(group /* internal/work-transaction/work-group<internal/model/work<total>> */ ) {
        var _x78 = $kokaine_reactive_internal_work_dash_transaction.work_group_fs_state(group);
        if (_x78._tag === 1) {
           
          var _x79 = group.group_state;
          $kokaine_reactive_internal_work_dash_transaction.store(_x79, $kokaine_reactive_internal_work_dash_transaction.Work_draining);
          return true;
        }
        else {
          return false;
        }
      }, derive_group);
    var _x78 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_2_10331);
    if (_x78) {
      return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "provision can only be drained while open");
    }
    else {
       
      var completed = $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, false);
       
      var x_0_10448 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10139 /* hnd/ev-index */ ) {
          return _mlift_drain_provision_10383(completed, current, derive_group, lease, _y_x10139);
        });
      }
      else {
         
        var x_1_10451 = $std_core_hnd._mask_at(x_0_10448, false, function() {
             
            var x_3_10460 = drain_provision_loop(current);
            if ($std_core_hnd._yielding()) {
              var _x80 = $std_core_hnd.yield_extend(function(result /* error<()> */ ) {
                return _mlift_drain_provision_10381(completed, derive_group, result);
              });
            }
            else {
              var _x80 = _mlift_drain_provision_10381(completed, derive_group, x_3_10460);
            }
            return $std_core_hnd.finally_prompt(function() {
                var _x79 = $kokaine_reactive_internal_model.load(completed);
                if (_x79) {
                  return $std_core_types.Unit;
                }
                else {
                   
                  var x_2_10457 = $kokaine_internal_compat.capture_error(function() {
                    return discard_provision(lease);
                  });
                  if ($std_core_hnd._yielding()) {
                    return $std_core_hnd.yield_extend(function(_pat_3_0 /* error<()> */ ) {
                      return $std_core_types.Unit;
                    });
                  }
                  else {
                    return $std_core_types.Unit;
                  }
                }
              }, _x80);
          });
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10148 /* (error<()>, bool) */ ) {
            return _mlift_drain_provision_10382(_y_x10148);
          });
        }
        else {
          var _x79 = $std_core_hnd._open_none1(function(b_0 /* bool */ ) {
              return (b_0) ? false : true;
            }, x_1_10451.snd);
          if (_x79) {
            return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "provision could not enter a terminal drain state");
          }
          else {
            return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, x_1_10451.fst);
          }
        }
      }
    }
  }
}
 
 
// // monadic lift
export function _mlift_promote_provision_10385(current, wild) /* forall<e> (current : provision<e>, wild : ()) -> <exn|e> () */  {
   
  var root = $std_core_hnd._open_none1(function(provision /* provision<2781> */ ) {
      return provision.provision_root;
    }, current);
   
  var derive_group = $std_core_hnd._open_none1(function(provision_0 /* provision<2781> */ ) {
      return provision_0.provision_derive_group;
    }, current);
   
  var effect_group = $std_core_hnd._open_none1(function(provision_1 /* provision<2781> */ ) {
      return provision_1.provision_effect_group;
    }, current);
  var _x80 = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_state, derive_group);
  if (_x80._tag === 3) {
     
    var derive_residual = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_take_all, derive_group);
     
    var effect_residual = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_take_all, effect_group);
     
    var _x_x1_7_10348 = $std_core_hnd._open_none1(function(root_0 /* internal/model/root<2781> */ ) {
        return root_0.root_derive_plane;
      }, root);
     
    $std_core_hnd._open_none2(function(plane /* internal/model/plane<total> */ , expected /* internal/work-transaction/work-group<internal/model/work<total>> */ ) {
        var _x82 = plane.plane_work_group;
        var _x81 = $kokaine_reactive_internal_model.load(_x82);
        if (_x81 === null) {
          return $std_core_types.Unit;
        }
        else {
          var _x84 = _x81.value.group_state;
          var _x85 = expected.group_state;
          var _x83 = Object.is(_x84,_x85);
          if (_x83) {
            var _x86 = plane.plane_work_group;
            return $kokaine_reactive_internal_model.store(_x86, $std_core_types.Nothing);
          }
          else {
            return $std_core_types.Unit;
          }
        }
      }, _x_x1_7_10348, derive_group);
     
    var _x_x1_9_10351 = $std_core_hnd._open_none1(function(root_1 /* internal/model/root<2781> */ ) {
        return root_1.root_effect_plane;
      }, root);
     
    $std_core_hnd._open_none2(function(plane_2 /* internal/model/plane<2781> */ , expected_0 /* internal/work-transaction/work-group<internal/model/work<2781>> */ ) {
        var _x88 = plane_2.plane_work_group;
        var _x87 = $kokaine_reactive_internal_model.load(_x88);
        if (_x87 === null) {
          return $std_core_types.Unit;
        }
        else {
          var _x90 = _x87.value.group_state;
          var _x91 = expected_0.group_state;
          var _x89 = Object.is(_x90,_x91);
          if (_x89) {
            var _x92 = plane_2.plane_work_group;
            return $kokaine_reactive_internal_model.store(_x92, $std_core_types.Nothing);
          }
          else {
            return $std_core_types.Unit;
          }
        }
      }, _x_x1_9_10351, effect_group);
     
    var _x_x1_12_10356 = $std_core_hnd._open_none1(function(root_2 /* internal/model/root<2781> */ ) {
        return root_2.root_derive_plane;
      }, root);
     
    var _x_x1_11_10354 = $std_core_hnd._open_none1(function(plane_5 /* internal/model/plane<total> */ ) {
        return plane_5.plane_queue;
      }, _x_x1_12_10356);
     
    $std_core_hnd._open_none2(function(target /* internal/work-transaction/work-queue<internal/model/work<total>> */ , values /* list<internal/model/work<total>> */ ) {
        return $kokaine_reactive_internal_work_dash_transaction.append_values_loop(target, values);
      }, _x_x1_11_10354, derive_residual);
     
    var _x_x1_15_10360 = $std_core_hnd._open_none1(function(root_3 /* internal/model/root<2781> */ ) {
        return root_3.root_effect_plane;
      }, root);
     
    var _x_x1_14_10358 = $std_core_hnd._open_none1(function(plane_6 /* internal/model/plane<2781> */ ) {
        return plane_6.plane_queue;
      }, _x_x1_15_10360);
     
    $std_core_hnd._open_none2(function(target_0 /* internal/work-transaction/work-queue<internal/model/work<2781>> */ , values_0 /* list<internal/model/work<2781>> */ ) {
        return $kokaine_reactive_internal_work_dash_transaction.append_values_loop(target_0, values_0);
      }, _x_x1_14_10358, effect_residual);
    var _x81 = $std_core_hnd._open_none1(function(group /* internal/work-transaction/work-group<internal/model/work<total>> */ ) {
        var _x82 = $kokaine_reactive_internal_work_dash_transaction.work_group_fs_state(group);
        if (_x82._tag === 3) {
           
          var _x83 = group.group_state;
          $kokaine_reactive_internal_work_dash_transaction.store(_x83, $kokaine_reactive_internal_work_dash_transaction.Work_committed);
          return true;
        }
        else {
          return false;
        }
      }, derive_group);
    if (_x81) {
       
      $std_core_hnd._open_none1(function(group_0 /* internal/work-transaction/work-group<internal/model/work<total>> */ ) {
          var _x83 = group_0.group_rollback;
          return $kokaine_reactive_internal_work_dash_transaction.store(_x83, $kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Nil, $std_core_types.Nil));
        }, derive_group);
      return $std_core_hnd._open_none1(function(group_1 /* internal/work-transaction/work-group<internal/model/work<2781>> */ ) {
          var _x83 = group_1.group_rollback;
          return $kokaine_reactive_internal_work_dash_transaction.store(_x83, $kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Nil, $std_core_types.Nil));
        }, effect_group);
    }
    else {
      return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "provision promotion lost its ready state");
    }
  }
  else {
    return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "provision must drain successfully before promotion");
  }
}
 
export function promote_provision(lease) /* forall<e> (lease : provision-lease<e>) -> <div,exn|e> () */  {
   
  var current = $std_core_hnd._open_none1(function(lease_0 /* provision-lease<2781> */ ) {
      return lease_0;
    }, lease);
   
  var x_10463 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), check_active_provision, current);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild /* () */ ) {
      return _mlift_promote_provision_10385(current, wild);
    });
  }
  else {
    return _mlift_promote_provision_10385(current, x_10463);
  }
}