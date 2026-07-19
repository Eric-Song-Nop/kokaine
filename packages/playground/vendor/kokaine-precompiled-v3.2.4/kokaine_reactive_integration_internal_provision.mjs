// Koka generated module: kokaine/reactive/integration/internal/provision, koka version: 3.2.4
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
import * as $kokaine_reactive_internal_scheduler from './kokaine_reactive_internal_scheduler.mjs';
import * as $kokaine_reactive_internal_lifetime from './kokaine_reactive_internal_lifetime.mjs';
import * as $kokaine_reactive_internal_work_dash_transaction from './kokaine_reactive_internal_work_dash_transaction.mjs';
import * as $kokaine_internal_compat from './kokaine_internal_compat.mjs';
import * as $std_core_undiv from './std_core_undiv.mjs';
import * as $kokaine_internal_registry from './kokaine_internal_registry.mjs';
import * as $std_core_unsafe from './std_core_unsafe.mjs';
 
// externals
 
// type declarations
// type provision
export function Provision(provision_root, provision_derive_group, provision_effect_group) /* forall<e> (provision-root : kokaine/reactive/internal/model/root<e>, provision-derive-group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>>, provision-effect-group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<e>>) -> provision<e> */  {
  return { provision_root: provision_root, provision_derive_group: provision_derive_group, provision_effect_group: provision_effect_group };
}
// type provision-lease
export function Provision_lease(lease_provision) /* forall<e> (lease-provision : provision<e>) -> provision-lease<e> */  {
  return lease_provision;
}
 
// declarations
 
 
// Automatically generated. Retrieves the `provision-root` constructor field of the `:provision` type.
export function provision_fs_provision_root(provision) /* forall<e> (provision : provision<e>) -> kokaine/reactive/internal/model/root<e> */  {
  return provision.provision_root;
}
 
 
// Automatically generated. Retrieves the `provision-derive-group` constructor field of the `:provision` type.
export function provision_fs_provision_derive_group(provision) /* forall<e> (provision : provision<e>) -> kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>> */  {
  return provision.provision_derive_group;
}
 
 
// Automatically generated. Retrieves the `provision-effect-group` constructor field of the `:provision` type.
export function provision_fs_provision_effect_group(provision) /* forall<e> (provision : provision<e>) -> kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<e>> */  {
  return provision.provision_effect_group;
}
 
export function provision_fs__copy(_this, provision_root, provision_derive_group, provision_effect_group) /* forall<e> (provision<e>, provision-root : ? (kokaine/reactive/internal/model/root<e>), provision-derive-group : ? (kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>>), provision-effect-group : ? (kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<e>>)) -> provision<e> */  {
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
 
 
// Automatically generated. Retrieves the `lease-provision` constructor field of the `:provision-lease` type.
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
 
export function provision_lease_fs_state(lease) /* forall<e> (lease : provision-lease<e>) -> kokaine/reactive/internal/work-transaction/work-transaction-state */  {
  var _x12 = lease.provision_derive_group;
  return $kokaine_reactive_internal_work_dash_transaction.work_group_fs_state(_x12);
}
 
export function plane_has_group(plane, expected) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, expected : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<e>>) -> bool */  {
  var _x14 = plane.plane_work_group;
  var _x13 = _x14.value;
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
   
  var value_10150 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<636> */ ) {
      return root_0.root_disposed;
    }, root);
   
  var _x_x1_0_10253 = value_10150.value;
  var _x17 = $std_core_hnd._open_none1(function(b /* bool */ ) {
      return (b) ? false : true;
    }, _x_x1_0_10253);
  if (_x17) {
     
    var value_0_10153 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<636> */ ) {
        return root_1.root_disposing;
      }, root);
     
    var _x_x1_2_10255 = value_0_10153.value;
    var _x18 = $std_core_hnd._open_none1(function(b_0 /* bool */ ) {
        return (b_0) ? false : true;
      }, _x_x1_2_10255);
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
 
 
// monadic lift
export function _mlift_check_active_provision_10352(current, wild__) /* forall<_e,e1> (current : provision<e1>, wild_ : ()) -> exn () */  {
   
  var root = $std_core_hnd._open_none1(function(provision /* provision<729> */ ) {
      return provision.provision_root;
    }, current);
   
  var _x_x1_0_10257 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<729> */ ) {
      return root_0.root_derive_plane;
    }, root);
   
  var _x_x2_10258 = $std_core_hnd._open_none1(function(provision_0 /* provision<729> */ ) {
      return provision_0.provision_derive_group;
    }, current);
  var _x19 = $std_core_hnd._open_none2(function(plane /* kokaine/reactive/internal/model/plane<total> */ , expected /* kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>> */ ) {
      var _x21 = plane.plane_work_group;
      var _x20 = _x21.value;
      if (_x20 === null) {
        return false;
      }
      else {
        var _x22 = _x20.value.group_state;
        var _x23 = expected.group_state;
        return Object.is(_x22,_x23);
      }
    }, _x_x1_0_10257, _x_x2_10258);
  if (_x19) {
     
    var _x_x1_3_10261 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<729> */ ) {
        return root_1.root_effect_plane;
      }, root);
     
    var _x_x2_0_10262 = $std_core_hnd._open_none1(function(provision_1 /* provision<729> */ ) {
        return provision_1.provision_effect_group;
      }, current);
    var _x24 = $std_core_hnd._open_none2(function(plane_1 /* kokaine/reactive/internal/model/plane<729> */ , expected_0 /* kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<729>> */ ) {
        var _x26 = plane_1.plane_work_group;
        var _x25 = _x26.value;
        if (_x25 === null) {
          return false;
        }
        else {
          var _x27 = _x25.value.group_state;
          var _x28 = expected_0.group_state;
          return Object.is(_x27,_x28);
        }
      }, _x_x1_3_10261, _x_x2_0_10262);
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
   
  var x_10369 = check_provision_root(current);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_check_active_provision_10352(current, wild__);
    });
  }
  else {
     
    var root = $std_core_hnd._open_none1(function(provision /* provision<729> */ ) {
        return provision.provision_root;
      }, current);
     
    var _x_x1_0_10257 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<729> */ ) {
        return root_0.root_derive_plane;
      }, root);
     
    var _x_x2_10258 = $std_core_hnd._open_none1(function(provision_0 /* provision<729> */ ) {
        return provision_0.provision_derive_group;
      }, current);
    var _x29 = $std_core_hnd._open_none2(function(plane /* kokaine/reactive/internal/model/plane<total> */ , expected /* kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>> */ ) {
        var _x31 = plane.plane_work_group;
        var _x30 = _x31.value;
        if (_x30 === null) {
          return false;
        }
        else {
          var _x32 = _x30.value.group_state;
          var _x33 = expected.group_state;
          return Object.is(_x32,_x33);
        }
      }, _x_x1_0_10257, _x_x2_10258);
    if (_x29) {
       
      var _x_x1_3_10261 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<729> */ ) {
          return root_1.root_effect_plane;
        }, root);
       
      var _x_x2_0_10262 = $std_core_hnd._open_none1(function(provision_1 /* provision<729> */ ) {
          return provision_1.provision_effect_group;
        }, current);
      var _x34 = $std_core_hnd._open_none2(function(plane_1 /* kokaine/reactive/internal/model/plane<729> */ , expected_0 /* kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<729>> */ ) {
          var _x36 = plane_1.plane_work_group;
          var _x35 = _x36.value;
          if (_x35 === null) {
            return false;
          }
          else {
            var _x37 = _x35.value.group_state;
            var _x38 = expected_0.group_state;
            return Object.is(_x37,_x38);
          }
        }, _x_x1_3_10261, _x_x2_0_10262);
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
 
 
// monadic lift
export function _mlift_open_provision_10353(root, _y_x10087) /* forall<_e,_e1,_e2,e3> (root : kokaine/reactive/internal/model/root<e3>, hnd/ev-index) -> exn provision-lease<e3> */  {
  return $std_core_hnd._mask_at(_y_x10087, false, function() {
       
      var state = { value: ($kokaine_reactive_internal_work_dash_transaction.Work_open) };
       
      var derive_group = $kokaine_reactive_internal_work_dash_transaction.Work_group(state, $kokaine_reactive_internal_work_dash_transaction.new_work_queue(), $kokaine_reactive_internal_work_dash_transaction.new_work_queue());
       
      var effect_group = $kokaine_reactive_internal_work_dash_transaction.Work_group(state, $kokaine_reactive_internal_work_dash_transaction.new_work_queue(), $kokaine_reactive_internal_work_dash_transaction.new_work_queue());
       
      var _x39 = root.root_derive_plane.plane_work_group;
      ((_x39).value = ($std_core_types.Just(derive_group)));
       
      var _x40 = root.root_effect_plane.plane_work_group;
      ((_x40).value = ($std_core_types.Just(effect_group)));
      return Provision(root, derive_group, effect_group);
    });
}
 
 
// monadic lift
export function _mlift_open_provision_10354(root, wild__) /* forall<_e,_e1,_e2,_e3,e4> (root : kokaine/reactive/internal/model/root<e4>, wild_ : ()) -> exn provision-lease<e4> */  {
   
  var _x_x1_0_10265 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<950> */ ) {
      return root_0.root_derive_plane;
    }, root);
   
  var value_10163 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<total> */ ) {
      return plane.plane_work_group;
    }, _x_x1_0_10265);
   
  var _x_x1_10267 = value_10163.value;
  var _x39 = $std_core_hnd._open_none1(function(maybe /* maybe<kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>>> */ ) {
      return (maybe !== null);
    }, _x_x1_10267);
  if (_x39) {
    return $std_core_exn.$throw("a provision is already active on this root");
  }
  else {
     
    var _x_x1_3_10268 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<950> */ ) {
        return root_1.root_effect_plane;
      }, root);
     
    var value_0_10167 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<950> */ ) {
        return plane_0.plane_work_group;
      }, _x_x1_3_10268);
     
    var _x_x1_2_10270 = value_0_10167.value;
    var _x40 = $std_core_hnd._open_none1(function(maybe_0 /* maybe<kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<950>>> */ ) {
        return (maybe_0 !== null);
      }, _x_x1_2_10270);
    if (_x40) {
      return $std_core_exn.$throw("a provision is already active on this root");
    }
    else {
       
      var x_10372 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10087 /* hnd/ev-index */ ) {
          return _mlift_open_provision_10353(root, _y_x10087);
        });
      }
      else {
        return _mlift_open_provision_10353(root, x_10372);
      }
    }
  }
}
 
export function open_provision(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> exn provision-lease<e> */  {
   
  var x_10374 = $kokaine_reactive_internal_scheduler.check_registration(root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_open_provision_10354(root, wild__);
    });
  }
  else {
     
    var _x_x1_0_10265 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<950> */ ) {
        return root_0.root_derive_plane;
      }, root);
     
    var value_10163 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<total> */ ) {
        return plane.plane_work_group;
      }, _x_x1_0_10265);
     
    var _x_x1_10267 = value_10163.value;
    var _x41 = $std_core_hnd._open_none1(function(maybe /* maybe<kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>>> */ ) {
        return (maybe !== null);
      }, _x_x1_10267);
    if (_x41) {
      return $std_core_exn.$throw("a provision is already active on this root");
    }
    else {
       
      var _x_x1_3_10268 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<950> */ ) {
          return root_1.root_effect_plane;
        }, root);
       
      var value_0_10167 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<950> */ ) {
          return plane_0.plane_work_group;
        }, _x_x1_3_10268);
       
      var _x_x1_2_10270 = value_0_10167.value;
      var _x42 = $std_core_hnd._open_none1(function(maybe_0 /* maybe<kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<950>>> */ ) {
          return (maybe_0 !== null);
        }, _x_x1_2_10270);
      if (_x42) {
        return $std_core_exn.$throw("a provision is already active on this root");
      }
      else {
         
        var x_0_10377 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10087 /* hnd/ev-index */ ) {
            return _mlift_open_provision_10353(root, _y_x10087);
          });
        }
        else {
          return $std_core_hnd._mask_at(x_0_10377, false, function() {
               
              var state = { value: ($kokaine_reactive_internal_work_dash_transaction.Work_open) };
               
              var derive_group = $kokaine_reactive_internal_work_dash_transaction.Work_group(state, $kokaine_reactive_internal_work_dash_transaction.new_work_queue(), $kokaine_reactive_internal_work_dash_transaction.new_work_queue());
               
              var effect_group = $kokaine_reactive_internal_work_dash_transaction.Work_group(state, $kokaine_reactive_internal_work_dash_transaction.new_work_queue(), $kokaine_reactive_internal_work_dash_transaction.new_work_queue());
               
              var _x43 = root.root_derive_plane.plane_work_group;
              ((_x43).value = ($std_core_types.Just(derive_group)));
               
              var _x44 = root.root_effect_plane.plane_work_group;
              ((_x44).value = ($std_core_types.Just(effect_group)));
              return Provision(root, derive_group, effect_group);
            });
        }
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_current_provision_10355(root, wild__) /* forall<_e,e1> (root : kokaine/reactive/internal/model/root<e1>, wild_ : ()) -> exn maybe<provision<e1>> */  {
   
  var _x_x1_10271 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<1162> */ ) {
      return root_0.root_derive_plane;
    }, root);
   
  var value_10170 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<total> */ ) {
      return plane.plane_work_group;
    }, _x_x1_10271);
  var _x43 = value_10170.value;
   
  var _x_x1_1_10273 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<1162> */ ) {
      return root_1.root_effect_plane;
    }, root);
   
  var value_0_10173 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<1162> */ ) {
      return plane_0.plane_work_group;
    }, _x_x1_1_10273);
  var _x44 = value_0_10173.value;
  if (_x43 === null && _x44 === null) {
    return $std_core_types.Nothing;
  }
  else if (_x43 !== null && _x44 !== null) {
     
    var _x_x1_3_10275 = $std_core_hnd._open_none2(function(left /* kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>> */ , right /* kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<1162>> */ ) {
        var _x45 = left.group_state;
        var _x46 = right.group_state;
        return Object.is(_x45,_x46);
      }, _x43.value, _x44.value);
    var _x45 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_3_10275);
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
 
 
// Integrations inspect the active frontier to decide whether they own a new
// boundary or join work already being drained.
export function current_provision(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> exn maybe<provision<e>> */  {
   
  var x_10380 = $kokaine_reactive_internal_scheduler.check_registration(root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_current_provision_10355(root, wild__);
    });
  }
  else {
     
    var _x_x1_10271 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<1162> */ ) {
        return root_0.root_derive_plane;
      }, root);
     
    var value_10170 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<total> */ ) {
        return plane.plane_work_group;
      }, _x_x1_10271);
    var _x47 = value_10170.value;
     
    var _x_x1_1_10273 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<1162> */ ) {
        return root_1.root_effect_plane;
      }, root);
     
    var value_0_10173 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<1162> */ ) {
        return plane_0.plane_work_group;
      }, _x_x1_1_10273);
    var _x48 = value_0_10173.value;
    if (_x47 === null && _x48 === null) {
      return $std_core_types.Nothing;
    }
    else if (_x47 !== null && _x48 !== null) {
       
      var _x_x1_3_10275 = $std_core_hnd._open_none2(function(left /* kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>> */ , right /* kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<1162>> */ ) {
          var _x49 = left.group_state;
          var _x50 = right.group_state;
          return Object.is(_x49,_x50);
        }, _x47.value, _x48.value);
      var _x49 = $std_core_hnd._open_none1(function(b /* bool */ ) {
          return (b) ? false : true;
        }, _x_x1_3_10275);
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
 
export function restore_group_skipped(group, skipped) /* forall<e> (group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<e>>, skipped : list<kokaine/reactive/internal/model/work<e>>) -> div () */  { tailcall: while(1)
{
  if (skipped === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x51 = group.group_queue;
    $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x51, skipped.head);
    {
      // tail call
      skipped = skipped.tail;
      continue tailcall;
    }
  }
}}
 
export function take_group_work_loop(group, skipped) /* forall<e> (group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<e>>, skipped : list<kokaine/reactive/internal/model/work<e>>) -> div maybe<kokaine/reactive/internal/model/work<e>> */  { tailcall: while(1)
{
  var _x51 = $kokaine_reactive_internal_work_dash_transaction.work_group_fs_pop(group);
  if (_x51 === null) {
     
    restore_group_skipped(group, skipped);
    return $std_core_types.Nothing;
  }
  else {
    var _x52 = $kokaine_reactive_internal_scheduler.work_runnable(_x51.value);
    if (_x52) {
       
      restore_group_skipped(group, skipped);
      return $std_core_types.Just(_x51.value);
    }
    else {
      var _x53 = $kokaine_reactive_internal_scheduler.work_stale(_x51.value);
      if (_x53) {
        {
          // tail call
          continue tailcall;
        }
      }
      else {
        {
          // tail call
          var _x54 = $std_core_types.Cons(_x51.value, skipped);
          skipped = _x54;
          continue tailcall;
        }
      }
    }
  }
}}
 
export function take_group_work(group) /* forall<e> (group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<e>>) -> maybe<kokaine/reactive/internal/model/work<e>> */  {
  return take_group_work_loop(group, $std_core_types.Nil);
}
 
export function restore_group_deferred(group, deferred) /* (group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>>, deferred : list<kokaine/reactive/internal/model/work<total>>) -> () */  {
   
  var values_10048 = $std_core_list.reverse_acc($std_core_types.Nil, deferred);
  var _x55 = group.group_queue;
  return $kokaine_reactive_internal_work_dash_transaction.append_values_loop(_x55, values_10048);
}
 
export function run_next_derived_group_loop(plane, group, deferred) /* (plane : kokaine/reactive/internal/model/plane<total>, group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>>, deferred : list<kokaine/reactive/internal/model/work<total>>) -> div error<bool> */  { tailcall: while(1)
{
  var _x56 = take_group_work_loop(group, $std_core_types.Nil);
  if (_x56 === null) {
     
    restore_group_deferred(group, deferred);
    return $std_core_types.Ok(false);
  }
  else {
    var _x57 = $kokaine_reactive_internal_scheduler.run_derive_work(plane, _x56.value);
    if (_x57._tag === 1) {
       
      var _x58 = $kokaine_reactive_internal_scheduler.work_stale(_x56.value);
      if (_x58) {
        $std_core_types.Unit;
      }
      else {
        var _x59 = group.group_queue;
        $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_append(_x59, _x56.value);
      }
       
      restore_group_deferred(group, deferred);
      return $std_core_types.Ok(true);
    }
    else if (_x57._tag === 2) {
      {
        // tail call
        var _x58 = $std_core_types.Cons(_x56.value, deferred);
        deferred = _x58;
        continue tailcall;
      }
    }
    else {
       
      var _x59 = $kokaine_reactive_internal_scheduler.work_stale(_x56.value);
      if (_x59) {
        $std_core_types.Unit;
      }
      else {
        var _x60 = group.group_queue;
        $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_append(_x60, _x56.value);
      }
       
      restore_group_deferred(group, deferred);
      return $std_core_types.$Error(_x57.settle_exception);
    }
  }
}}
 
export function run_next_derived_group(plane, group) /* (plane : kokaine/reactive/internal/model/plane<total>, group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>>) -> error<bool> */  {
  return run_next_derived_group_loop(plane, group, $std_core_types.Nil);
}
 
 
// monadic lift
export function _mlift_run_next_effect_group_10356(_y_x10102) /* forall<e> (error<()>) -> <div|e> result<bool,exception> */  {
  if (_y_x10102._tag === 1) {
    return $std_core_types.$Error(_y_x10102.error);
  }
  else {
    return $std_core_types.Ok(true);
  }
}
 
export function run_next_effect_group(plane, group) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<e>>) -> <div|e> error<bool> */  {
  var _x59 = take_group_work_loop(group, $std_core_types.Nil);
  if (_x59 === null) {
    return $std_core_types.Ok(false);
  }
  else {
     
    var _x60 = group.group_queue;
    $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x60, _x59.value);
     
    var x_10383 = $kokaine_reactive_internal_scheduler.run_work_raw(plane, _x59.value);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10102 /* error<()> */ ) {
        if (_y_x10102._tag === 1) {
          return $std_core_types.$Error(_y_x10102.error);
        }
        else {
          return $std_core_types.Ok(true);
        }
      });
    }
    else {
      if (x_10383._tag === 1) {
        return $std_core_types.$Error(x_10383.error);
      }
      else {
        return $std_core_types.Ok(true);
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_drain_provision_loop_10357(current, _y_x10105) /* forall<e> (current : provision<e>, error<bool>) -> <div|e> result<(),exception> */  {
  if (_y_x10105._tag === 1) {
    return $std_core_types.$Error(_y_x10105.error);
  }
  else if (_y_x10105._tag === 2 && _y_x10105.value) {
    return drain_provision_loop(current);
  }
  else {
    return $std_core_types.Ok($std_core_types.Unit);
  }
}
 
export function drain_provision_loop(current_0) /* forall<e> (current : provision<e>) -> <div|e> error<()> */  { tailcall: while(1)
{
  var _x61 = current_0.provision_root.root_derive_plane;
  var _x62 = current_0.provision_derive_group;
  var _x60 = run_next_derived_group_loop(_x61, _x62, $std_core_types.Nil);
  if (_x60._tag === 1) {
    return $std_core_types.$Error(_x60.error);
  }
  else if (_x60._tag === 2 && _x60.value) {
    {
      // tail call
      continue tailcall;
    }
  }
  else {
     
    var _x63 = current_0.provision_root.root_effect_plane;
    var _x64 = current_0.provision_effect_group;
    var x_10387 = run_next_effect_group(_x63, _x64);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10105_0 /* error<bool> */ ) {
        return _mlift_drain_provision_loop_10357(current_0, _y_x10105_0);
      });
    }
    else {
      if (x_10387._tag === 1) {
        return $std_core_types.$Error(x_10387.error);
      }
      else if (x_10387._tag === 2 && x_10387.value) {
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
 
export function detach_matching_group(plane, expected) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, expected : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<e>>) -> () */  {
  var _x64 = plane.plane_work_group;
  var _x63 = _x64.value;
  if (_x63 === null) {
    return $std_core_types.Unit;
  }
  else {
    var _x66 = _x63.value.group_state;
    var _x67 = expected.group_state;
    var _x65 = Object.is(_x66,_x67);
    if (_x65) {
      var _x68 = plane.plane_work_group;
      return ((_x68).value = ($std_core_types.Nothing));
    }
    else {
      return $std_core_types.Unit;
    }
  }
}
 
export function prepend_bootstrap_retirements(values, collected) /* forall<e> (values : list<kokaine/reactive/internal/model/work<e>>, collected : list<kokaine/reactive/internal/model/retirement-work<e>>) -> div list<kokaine/reactive/internal/model/retirement-work<e>> */  { tailcall: while(1)
{
  if (values === null) {
    return collected;
  }
  else {
    if (values.head._tag === 2) {
      {
        // tail call
        var _x70 = function(_scope69 /* kokaine/reactive/internal/model/continuation-scope<1950> */ ) {
          return $std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
              return $kokaine_reactive_internal_lifetime.scope_retirement_expand(_scope69);
            }), collected);
        }(values.head.bootstrap_scope);
        values = values.tail;
        collected = _x70;
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
 
export function prepend_pure_bootstrap_retirements(values, collected) /* forall<e> (values : list<kokaine/reactive/internal/model/work<total>>, collected : list<kokaine/reactive/internal/model/retirement-work<e>>) -> div list<kokaine/reactive/internal/model/retirement-work<e>> */  { tailcall: while(1)
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
        var _x71 = $std_core_types.Cons(structural, collected);
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
 
 
// monadic lift
export function _mlift_retire_provision_bootstraps_10358(root, finalizers) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, finalizers : list<kokaine/reactive/internal/model/retirement-work<e>>) -> <div,exn|e> () */  {
   
  var _x_x1_2_10284 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<2087> */ ) {
      return root_0.root_lifetime;
    }, root);
  return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<2087> */ ) {
        return _this.lifetime_retirement;
      }, _x_x1_2_10284), finalizers);
}
 
 
// monadic lift
export function _mlift_retire_provision_bootstraps_10359(root, structural) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, structural : list<kokaine/reactive/internal/model/retirement-work<e>>) -> <div,exn|e> () */  {
   
  var x_10390 = $std_core_hnd._open_none1(function(values /* list<kokaine/reactive/internal/model/retirement-work<2087>> */ ) {
      return $kokaine_reactive_internal_lifetime.collect_retirement_loop(values, $std_core_types.Nil);
    }, structural);
   
  function next_10391(finalizers) /* (list<kokaine/reactive/internal/model/retirement-work<2087>>) -> <div,exn|2087> () */  {
     
    var _x_x1_2_10284 = $std_core_hnd._open_none1(function(root_0_0 /* kokaine/reactive/internal/model/root<2087> */ ) {
        return root_0_0.root_lifetime;
      }, root);
    return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<2087> */ ) {
          return _this.lifetime_retirement;
        }, _x_x1_2_10284), finalizers);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10391);
  }
  else {
    return next_10391(x_10390);
  }
}
 
 
// monadic lift
export function _mlift_retire_provision_bootstraps_10360(derive_owned, root, effect_structural) /* forall<e> (derive-owned : list<kokaine/reactive/internal/model/work<total>>, root : kokaine/reactive/internal/model/root<e>, effect-structural : list<kokaine/reactive/internal/model/retirement-work<e>>) -> <div,exn|e> () */  {
   
  var x_10394 = $std_core_hnd._open_none2(prepend_pure_bootstrap_retirements, derive_owned, effect_structural);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(structural /* list<kokaine/reactive/internal/model/retirement-work<2087>> */ ) {
      return _mlift_retire_provision_bootstraps_10359(root, structural);
    });
  }
  else {
    return _mlift_retire_provision_bootstraps_10359(root, x_10394);
  }
}
 
export function retire_provision_bootstraps(root, derive_owned, effect_owned) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, derive-owned : list<kokaine/reactive/internal/model/work<total>>, effect-owned : list<kokaine/reactive/internal/model/work<e>>) -> <div,exn|e> () */  {
   
  var x_10396 = $std_core_hnd._open_none2(prepend_bootstrap_retirements, effect_owned, $std_core_types.Nil);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(effect_structural /* list<kokaine/reactive/internal/model/retirement-work<2087>> */ ) {
      return _mlift_retire_provision_bootstraps_10360(derive_owned, root, effect_structural);
    });
  }
  else {
     
    var x_0_10399 = $std_core_hnd._open_none2(prepend_pure_bootstrap_retirements, derive_owned, x_10396);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(structural /* list<kokaine/reactive/internal/model/retirement-work<2087>> */ ) {
        return _mlift_retire_provision_bootstraps_10359(root, structural);
      });
    }
    else {
       
      var x_1_10402 = $std_core_hnd._open_none1(function(values /* list<kokaine/reactive/internal/model/retirement-work<2087>> */ ) {
          return $kokaine_reactive_internal_lifetime.collect_retirement_loop(values, $std_core_types.Nil);
        }, x_0_10399);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(finalizers /* list<kokaine/reactive/internal/model/retirement-work<2087>> */ ) {
           
          var _x_x1_2_10284 = $std_core_hnd._open_none1(function(root_0_0 /* kokaine/reactive/internal/model/root<2087> */ ) {
              return root_0_0.root_lifetime;
            }, root);
          return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<2087> */ ) {
                return _this.lifetime_retirement;
              }, _x_x1_2_10284), finalizers);
        });
      }
      else {
         
        var _x_x1_2_10284_0 = $std_core_hnd._open_none1(function(root_0_1 /* kokaine/reactive/internal/model/root<2087> */ ) {
            return root_0_1.root_lifetime;
          }, root);
        return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/lifetime-owner<2087> */ ) {
              return _this_0.lifetime_retirement;
            }, _x_x1_2_10284_0), x_1_10402);
      }
    }
  }
}
 
export function discard_provision(lease) /* forall<e> (lease : provision-lease<e>) -> <exn|e> () */  {
   
  var current = $std_core_hnd._open_none1(function(lease_0 /* provision-lease<2312> */ ) {
      return lease_0;
    }, lease);
   
  var root = $std_core_hnd._open_none1(function(provision /* provision<2312> */ ) {
      return provision.provision_root;
    }, current);
   
  var derive_group = $std_core_hnd._open_none1(function(provision_0 /* provision<2312> */ ) {
      return provision_0.provision_derive_group;
    }, current);
   
  var effect_group = $std_core_hnd._open_none1(function(provision_1 /* provision<2312> */ ) {
      return provision_1.provision_effect_group;
    }, current);
  var _x72 = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_state, derive_group);
  if (_x72._tag === 5) {
    return $std_core_types.Unit;
  }
  else if (_x72._tag === 6) {
     
    var _x_x1_4_10291 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<2312> */ ) {
        return root_0.root_derive_plane;
      }, root);
     
    $std_core_hnd._open_none2(detach_matching_group, _x_x1_4_10291, derive_group);
     
    var _x_x1_6_10294 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<2312> */ ) {
        return root_1.root_effect_plane;
      }, root);
     
    $std_core_hnd._open_none2(detach_matching_group, _x_x1_6_10294, effect_group);
     
    $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_clear, derive_group);
    return $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_clear, effect_group);
  }
  else {
     
    var derive_owned = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_take_rollback, derive_group);
     
    var effect_owned = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_take_rollback, effect_group);
     
    var _x_x1_12_10301 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<2312> */ ) {
        return root_2.root_derive_plane;
      }, root);
     
    $std_core_hnd._open_none2(detach_matching_group, _x_x1_12_10301, derive_group);
     
    var _x_x1_14_10304 = $std_core_hnd._open_none1(function(root_3 /* kokaine/reactive/internal/model/root<2312> */ ) {
        return root_3.root_effect_plane;
      }, root);
     
    $std_core_hnd._open_none2(detach_matching_group, _x_x1_14_10304, effect_group);
     
    var claimed = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_mark_aborted, derive_group);
     
    $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_clear, effect_group);
    var _x73 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, claimed);
    if (_x73) {
      return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "provision discard lost its active state");
    }
    else {
      return retire_provision_bootstraps(root, derive_owned, effect_owned);
    }
  }
}
 
 
// monadic lift
export function _mlift_drain_provision_10361(_pat_3_0) /* forall<e> (error<()>) -> e () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_drain_provision_10362(_c_x10133, result, _c_x10134) /* (bool, result : error<()>, ()) -> (error<()>, bool) */  {
  return $std_core_types.Tuple2(result, _c_x10133);
}
 
 
// monadic lift
export function _mlift_drain_provision_10363(completed, result, _c_x10133) /* forall<_e> (completed : ref<global,bool>, result : error<()>, bool) -> (error<()>, bool) */  {
   
  if (_c_x10133) {
    var x_10407 = ((completed).value = true);
  }
  else {
    var x_10407 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10134 /* () */ ) {
      return $std_core_types.Tuple2(result, _c_x10133);
    });
  }
  else {
    return $std_core_types.Tuple2(result, _c_x10133);
  }
}
 
 
// monadic lift
export function _mlift_drain_provision_10364(completed, derive_group, result) /* forall<_e,e1> (completed : ref<global,bool>, derive-group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>>, result : error<()>) -> <div|e1> (error<()>, bool) */  {
   
  if (result._tag === 1) {
    var x_10412 = $kokaine_reactive_internal_work_dash_transaction.work_group_fs_mark_failed(derive_group, result.error);
  }
  else {
    var x_10412 = $kokaine_reactive_internal_work_dash_transaction.work_group_fs_mark_ready(derive_group);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10133 /* bool */ ) {
      return _mlift_drain_provision_10363(completed, result, _c_x10133);
    });
  }
  else {
    return _mlift_drain_provision_10363(completed, result, x_10412);
  }
}
 
 
// monadic lift
export function _mlift_drain_provision_10365(_y_x10136) /* forall<e> ((error<()>, bool)) -> <exn,div|e> () */  {
  var _x74 = $std_core_hnd._open_none1(function(b_0 /* bool */ ) {
      return (b_0) ? false : true;
    }, _y_x10136.snd);
  if (_x74) {
    return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "provision could not enter a terminal drain state");
  }
  else {
    return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, _y_x10136.fst);
  }
}
 
 
// monadic lift
export function _mlift_drain_provision_10366(completed, current, derive_group, lease, _y_x10127) /* forall<_e,_e1,e2> (completed : ref<global,bool>, current : provision<e2>, derive-group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>>, lease : provision-lease<e2>, hnd/ev-index) -> <exn,div|e2> () */  {
   
  var x_10414 = $std_core_hnd._mask_at(_y_x10127, false, function() {
       
      var x_1_10422 = drain_provision_loop(current);
      if ($std_core_hnd._yielding()) {
        var _x76 = $std_core_hnd.yield_extend(function(result /* error<()> */ ) {
          return _mlift_drain_provision_10364(completed, derive_group, result);
        });
      }
      else {
        var _x76 = _mlift_drain_provision_10364(completed, derive_group, x_1_10422);
      }
      return $std_core_hnd.finally_prompt(function() {
          var _x75 = completed.value;
          if (_x75) {
            return $std_core_types.Unit;
          }
          else {
             
            var x_0_10419 = $kokaine_internal_compat.capture_error(function() {
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
        }, _x76);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10136 /* (error<()>, bool) */ ) {
      return _mlift_drain_provision_10365(_y_x10136);
    });
  }
  else {
    return _mlift_drain_provision_10365(x_10414);
  }
}
 
 
// monadic lift
export function _mlift_drain_provision_10367(current, lease, wild__) /* forall<_e,_e1,_e2,e3> (current : provision<e3>, lease : provision-lease<e3>, wild_ : ()) -> <exn,div|e3> () */  {
   
  var derive_group = $std_core_hnd._open_none1(function(provision /* provision<2562> */ ) {
      return provision.provision_derive_group;
    }, current);
   
  var _x_x1_2_10315 = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_begin_drain, derive_group);
  var _x75 = $std_core_hnd._open_none1(function(b /* bool */ ) {
      return (b) ? false : true;
    }, _x_x1_2_10315);
  if (_x75) {
    return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "provision can only be drained while open");
  }
  else {
     
    var completed = { value: false };
     
    var x_10425 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10127 /* hnd/ev-index */ ) {
        return _mlift_drain_provision_10366(completed, current, derive_group, lease, _y_x10127);
      });
    }
    else {
      return _mlift_drain_provision_10366(completed, current, derive_group, lease, x_10425);
    }
  }
}
 
export function drain_provision(lease) /* forall<e> (lease : provision-lease<e>) -> <div,exn|e> () */  {
   
  var current = $std_core_hnd._open_none1(function(lease_0 /* provision-lease<2562> */ ) {
      return lease_0;
    }, lease);
   
  var x_10427 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), check_active_provision, current);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_drain_provision_10367(current, lease, wild__);
    });
  }
  else {
     
    var derive_group = $std_core_hnd._open_none1(function(provision /* provision<2562> */ ) {
        return provision.provision_derive_group;
      }, current);
     
    var _x_x1_2_10315 = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_begin_drain, derive_group);
    var _x76 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_2_10315);
    if (_x76) {
      return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "provision can only be drained while open");
    }
    else {
       
      var completed = { value: false };
       
      var x_0_10431 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10127 /* hnd/ev-index */ ) {
          return _mlift_drain_provision_10366(completed, current, derive_group, lease, _y_x10127);
        });
      }
      else {
         
        var x_1_10434 = $std_core_hnd._mask_at(x_0_10431, false, function() {
             
            var x_3_10443 = drain_provision_loop(current);
            if ($std_core_hnd._yielding()) {
              var _x78 = $std_core_hnd.yield_extend(function(result /* error<()> */ ) {
                return _mlift_drain_provision_10364(completed, derive_group, result);
              });
            }
            else {
              var _x78 = _mlift_drain_provision_10364(completed, derive_group, x_3_10443);
            }
            return $std_core_hnd.finally_prompt(function() {
                var _x77 = completed.value;
                if (_x77) {
                  return $std_core_types.Unit;
                }
                else {
                   
                  var x_2_10440 = $kokaine_internal_compat.capture_error(function() {
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
          return $std_core_hnd.yield_extend(function(_y_x10136 /* (error<()>, bool) */ ) {
            return _mlift_drain_provision_10365(_y_x10136);
          });
        }
        else {
          var _x77 = $std_core_hnd._open_none1(function(b_0 /* bool */ ) {
              return (b_0) ? false : true;
            }, x_1_10434.snd);
          if (_x77) {
            return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "provision could not enter a terminal drain state");
          }
          else {
            return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, x_1_10434.fst);
          }
        }
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_promote_provision_10368(current, wild__) /* forall<e> (current : provision<e>, wild_ : ()) -> <exn|e> () */  {
   
  var root = $std_core_hnd._open_none1(function(provision /* provision<2786> */ ) {
      return provision.provision_root;
    }, current);
   
  var derive_group = $std_core_hnd._open_none1(function(provision_0 /* provision<2786> */ ) {
      return provision_0.provision_derive_group;
    }, current);
   
  var effect_group = $std_core_hnd._open_none1(function(provision_1 /* provision<2786> */ ) {
      return provision_1.provision_effect_group;
    }, current);
  var _x78 = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_state, derive_group);
  if (_x78._tag === 3) {
     
    var derive_residual = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_take_all, derive_group);
     
    var effect_residual = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_take_all, effect_group);
     
    var _x_x1_7_10331 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<2786> */ ) {
        return root_0.root_derive_plane;
      }, root);
     
    $std_core_hnd._open_none2(detach_matching_group, _x_x1_7_10331, derive_group);
     
    var _x_x1_9_10334 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<2786> */ ) {
        return root_1.root_effect_plane;
      }, root);
     
    $std_core_hnd._open_none2(detach_matching_group, _x_x1_9_10334, effect_group);
     
    var _x_x1_12_10339 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<2786> */ ) {
        return root_2.root_derive_plane;
      }, root);
     
    var _x_x1_11_10337 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<total> */ ) {
        return plane.plane_queue;
      }, _x_x1_12_10339);
     
    $std_core_hnd._open_none2(function(target /* kokaine/reactive/internal/work-transaction/work-queue<kokaine/reactive/internal/model/work<total>> */ , values /* list<kokaine/reactive/internal/model/work<total>> */ ) {
        return $kokaine_reactive_internal_work_dash_transaction.append_values_loop(target, values);
      }, _x_x1_11_10337, derive_residual);
     
    var _x_x1_15_10343 = $std_core_hnd._open_none1(function(root_3 /* kokaine/reactive/internal/model/root<2786> */ ) {
        return root_3.root_effect_plane;
      }, root);
     
    var _x_x1_14_10341 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<2786> */ ) {
        return plane_0.plane_queue;
      }, _x_x1_15_10343);
     
    $std_core_hnd._open_none2(function(target_0 /* kokaine/reactive/internal/work-transaction/work-queue<kokaine/reactive/internal/model/work<2786>> */ , values_0 /* list<kokaine/reactive/internal/model/work<2786>> */ ) {
        return $kokaine_reactive_internal_work_dash_transaction.append_values_loop(target_0, values_0);
      }, _x_x1_14_10341, effect_residual);
    var _x79 = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_mark_committed, derive_group);
    if (_x79) {
       
      $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_release_rollback, derive_group);
      return $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_release_rollback, effect_group);
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
   
  var current = $std_core_hnd._open_none1(function(lease_0 /* provision-lease<2786> */ ) {
      return lease_0;
    }, lease);
   
  var x_10446 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), check_active_provision, current);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_promote_provision_10368(current, wild__);
    });
  }
  else {
    return _mlift_promote_provision_10368(current, x_10446);
  }
}