// Koka generated module: kokaine/reactive/internal/handlers, koka version: 3.2.9
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
import * as $kokaine_reactive_internal_scheduler from './kokaine_reactive_internal_scheduler.mjs';
import * as $std_core_undiv from './std_core_undiv.mjs';
import * as $kokaine_internal_registry from './kokaine_internal_registry.mjs';
 
// externals
 
// type declarations
 
// declarations
 
 
// // monadic lift
export function _mlift_interpret_write_10162(root, wild_0) /* forall<e> (root : model/root<e>, wild@0 : ()) -> <exn|e> () */  {
   
  var _x_x1_3_10096 = $std_core_hnd._open_none1(function(root_1 /* model/root<690> */ ) {
      return root_1.root_batch_depth;
    }, root);
   
  var x_10036 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_3_10096);
   
  var _x_x1_1_10098 = $std_core_hnd._open_none1(function(root_0 /* model/root<690> */ ) {
      return root_0.root_batch_depth;
    }, root);
   
  var _x_x2_0_10099 = $std_core_types._int_add(x_10036,1);
  return $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_1_10098, _x_x2_0_10099);
}
 
 
// // monadic lift
export function _mlift_interpret_write_10163(key, root, wild) /* forall<e> (key : model/root-key, root : model/root<e>, wild : ()) -> <exn|e> () */  {
   
  var x_10176 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_root, root, key);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild_0 /* () */ ) {
      return _mlift_interpret_write_10162(root, wild_0);
    });
  }
  else {
    return _mlift_interpret_write_10162(root, x_10176);
  }
}
 
 
// // monadic lift
export function _mlift_interpret_write_10164(root, wild_2) /* forall<e> (root : model/root<e>, wild@2 : ()) -> <exn,div|e> () */  {
   
  var _x_x1_7_10104 = $std_core_hnd._open_none1(function(root_2 /* model/root<690> */ ) {
      return root_2.root_batch_depth;
    }, root);
   
  var depth = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_7_10104);
  if ($std_core_types._int_le(depth,0)) {
    return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "unbalanced reactive batch");
  }
  else {
     
    var _x_x1_10_10108 = $std_core_hnd._open_none1(function(root_3 /* model/root<690> */ ) {
        return root_3.root_batch_depth;
      }, root);
     
    var _x_x2_3_10109 = $std_core_types._int_sub(depth,1);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_10_10108, _x_x2_3_10109);
    return $kokaine_reactive_internal_scheduler.flush(root);
  }
}
 
 
// // monadic lift
export function _mlift_interpret_write_10165(key_0, root, wild_1) /* forall<e> (key@0 : model/root-key, root : model/root<e>, wild@1 : ()) -> <exn,div|e> () */  {
   
  var x_10179 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_root, root, key_0);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild_2 /* () */ ) {
      return _mlift_interpret_write_10164(root, wild_2);
    });
  }
  else {
    return _mlift_interpret_write_10164(root, x_10179);
  }
}
 
 
// // monadic lift
export function _mlift_interpret_write_10166(root, source, value, _y_x10012) /* forall<a,e> (root : model/root<e>, source : model/source<a>, value : a, bool) -> <div,exn|e> () */  {
  if (_y_x10012) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x_x1_20_10121 = $std_core_hnd._open_none1(function(source_3 /* model/source<462> */ ) {
        return source_3.source_cell;
      }, source);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_20_10121, value);
     
    var _x_x1_24_10124 = $std_core_hnd._open_none1(function(source_5 /* model/source<462> */ ) {
        return source_5.source_version;
      }, source);
     
    var x_1_10061 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_24_10124);
     
    var _x_x1_22_10126 = $std_core_hnd._open_none1(function(source_4 /* model/source<462> */ ) {
        return source_4.source_version;
      }, source);
     
    var _x_x2_7_10127 = $std_core_types._int_add(x_1_10061,1);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_22_10126, _x_x2_7_10127);
     
    $std_core_hnd._open_none1(function(source_6 /* model/source<462> */ ) {
        var _x0 = source_6.source_captures;
        return $kokaine_internal_registry.registry_fs_visit_readonly(_x0, $kokaine_reactive_internal_scheduler.cut_capture);
      }, source);
    return $kokaine_reactive_internal_scheduler.flush(root);
  }
}
 
 
// // monadic lift
export function _mlift_interpret_write_10167(root, source, update, wild_5) /* forall<a,e> (root : model/root<e>, source : model/source<a>, update : (a) -> a, wild@5 : ()) -> <exn,div|e> () */  {
   
  var _x_x1_15_10115 = $std_core_hnd._open_none1(function(source_1 /* model/source<462> */ ) {
      return source_1.source_cell;
    }, source);
   
  var previous = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_15_10115);
   
  var value = $std_core_hnd._open_none1(update, previous);
   
  var _x_x0_18_10055 = $std_core_hnd._open_none1(function(source_2 /* model/source<462> */ ) {
      return source_2.source_equals;
    }, source);
   
  var x_10181 = $std_core_hnd._open_none2(_x_x0_18_10055, previous, value);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10012 /* bool */ ) {
      return _mlift_interpret_write_10166(root, source, value, _y_x10012);
    });
  }
  else {
    return _mlift_interpret_write_10166(root, source, value, x_10181);
  }
}
 
 
// // monadic lift
export function _mlift_interpret_write_10168(root, source, update, wild_4) /* forall<a,e> (root : model/root<e>, source : model/source<a>, update : (a) -> a, wild@4 : ()) -> <exn,div|e> () */  {
   
  var _x_x2_4_10113 = $std_core_hnd._open_none1(function(source_0 /* model/source<462> */ ) {
      return source_0.source_root;
    }, source);
   
  var x_10183 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_root, root, _x_x2_4_10113);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild_5 /* () */ ) {
      return _mlift_interpret_write_10167(root, source, update, wild_5);
    });
  }
  else {
    return _mlift_interpret_write_10167(root, source, update, x_10183);
  }
}
 
 
// // monadic lift
export function _mlift_interpret_write_10169(root, wild_10) /* forall<e> (root : model/root<e>, wild@10 : ()) -> <exn,div|e> () */  {
   
  var _x_x1_29_10133 = $std_core_hnd._open_none1(function(root_4 /* model/root<690> */ ) {
      return root_4.root_effect_plane;
    }, root);
   
  $std_core_hnd._open_none1($kokaine_reactive_internal_scheduler.readmit_failed, _x_x1_29_10133);
  return $kokaine_reactive_internal_scheduler.flush(root);
}
 
 
// // monadic lift
export function _mlift_interpret_write_10170(key_1, root, wild_9) /* forall<e> (key@1 : model/root-key, root : model/root<e>, wild@9 : ()) -> <exn,div|e> () */  {
   
  var x_10185 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_root, root, key_1);
   
  function next_10186(wild_10) /* (()) -> <exn,div|690> () */  {
     
    var _x_x1_29_10133 = $std_core_hnd._open_none1(function(root_4 /* model/root<690> */ ) {
        return root_4.root_effect_plane;
      }, root);
     
    $std_core_hnd._open_none1($kokaine_reactive_internal_scheduler.readmit_failed, _x_x1_29_10133);
    return $kokaine_reactive_internal_scheduler.flush(root);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10186);
  }
  else {
    return next_10186(x_10185);
  }
}
 
 
// // monadic lift
export function _mlift_interpret_write_10171(root, source_0_0, value_0, _y_x10020) /* forall<a,e> (root : model/root<e>, source@0@0 : model/source<a>, value@0 : a, bool) -> <div,exn|e> () */  {
  if (_y_x10020) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x_x1_38_10144 = $std_core_hnd._open_none1(function(source_10 /* model/source<669> */ ) {
        return source_10.source_cell;
      }, source_0_0);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_38_10144, value_0);
     
    var _x_x1_42_10147 = $std_core_hnd._open_none1(function(source_12 /* model/source<669> */ ) {
        return source_12.source_version;
      }, source_0_0);
     
    var x_2_10081 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_42_10147);
     
    var _x_x1_40_10149 = $std_core_hnd._open_none1(function(source_11 /* model/source<669> */ ) {
        return source_11.source_version;
      }, source_0_0);
     
    var _x_x2_12_10150 = $std_core_types._int_add(x_2_10081,1);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_40_10149, _x_x2_12_10150);
     
    $std_core_hnd._open_none1(function(source_13 /* model/source<669> */ ) {
        var _x0 = source_13.source_captures;
        return $kokaine_internal_registry.registry_fs_visit_readonly(_x0, $kokaine_reactive_internal_scheduler.cut_capture);
      }, source_0_0);
    return $kokaine_reactive_internal_scheduler.flush(root);
  }
}
 
 
// // monadic lift
export function _mlift_interpret_write_10172(root, source_0_0, value_0, wild_13) /* forall<a,e> (root : model/root<e>, source@0@0 : model/source<a>, value@0 : a, wild@13 : ()) -> <exn,div|e> () */  {
   
  var _x_x1_34_10139 = $std_core_hnd._open_none1(function(source_8 /* model/source<669> */ ) {
      return source_8.source_cell;
    }, source_0_0);
   
  var previous_0 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_34_10139);
   
  var _x_x0_36_10075 = $std_core_hnd._open_none1(function(source_9 /* model/source<669> */ ) {
      return source_9.source_equals;
    }, source_0_0);
   
  var x_10189 = $std_core_hnd._open_none2(_x_x0_36_10075, previous_0, value_0);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10020 /* bool */ ) {
      return _mlift_interpret_write_10171(root, source_0_0, value_0, _y_x10020);
    });
  }
  else {
    return _mlift_interpret_write_10171(root, source_0_0, value_0, x_10189);
  }
}
 
 
// // monadic lift
export function _mlift_interpret_write_10173(root, source_0_0, value_0, wild_12) /* forall<a,e> (root : model/root<e>, source@0@0 : model/source<a>, value@0 : a, wild@12 : ()) -> <exn,div|e> () */  {
   
  var _x_x2_9_10137 = $std_core_hnd._open_none1(function(source_7 /* model/source<669> */ ) {
      return source_7.source_root;
    }, source_0_0);
   
  var x_10191 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_root, root, _x_x2_9_10137);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild_13 /* () */ ) {
      return _mlift_interpret_write_10172(root, source_0_0, value_0, wild_13);
    });
  }
  else {
    return _mlift_interpret_write_10172(root, source_0_0, value_0, x_10191);
  }
}
 
export function interpret_write(root, action) /* forall<a,e> (root : model/root<e>, action : () -> <effects/signal-write,pure|e> a) -> <div,exn|e> a */  {
  return $kokaine_reactive_effects.signal_write_fs__handle($kokaine_reactive_effects._Hnd_signal_write(1, $std_core_hnd.clause_tail1(function(key /* model/root-key */ ) {
         
        var x_10194 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "reactive batch");
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(wild /* () */ ) {
            return _mlift_interpret_write_10163(key, root, wild);
          });
        }
        else {
          return _mlift_interpret_write_10163(key, root, x_10194);
        }
      }), $std_core_hnd.clause_tail1(function(key_0 /* model/root-key */ ) {
         
        var x_0_10196 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "reactive batch");
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(wild_1 /* () */ ) {
            return _mlift_interpret_write_10165(key_0, root, wild_1);
          });
        }
        else {
          return _mlift_interpret_write_10165(key_0, root, x_0_10196);
        }
      }), function(m /* hnd/marker<<div,exn|690>,689> */ , ev /* hnd/ev<effects/signal-write> */ , x1 /* model/source<_62> */ , x2 /* (_62) -> _62 */ ) {
        return $std_core_hnd.under2(ev, function(source /* model/source<462> */ , update /* (462) -> 462 */ ) {
             
            var x_1_10199 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "signal modify");
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(wild_4 /* () */ ) {
                return _mlift_interpret_write_10168(root, source, update, wild_4);
              });
            }
            else {
              return _mlift_interpret_write_10168(root, source, update, x_1_10199);
            }
          }, x1, x2);
      }, $std_core_hnd.clause_tail1(function(key_1 /* model/root-key */ ) {
         
        var x_2_10201 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "reactive flush");
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(wild_9 /* () */ ) {
            return _mlift_interpret_write_10170(key_1, root, wild_9);
          });
        }
        else {
          return _mlift_interpret_write_10170(key_1, root, x_2_10201);
        }
      }), function(m_0 /* hnd/marker<<div,exn|690>,689> */ , ev_0 /* hnd/ev<effects/signal-write> */ , x1_0 /* model/source<_66> */ , x2_0 /* _66 */ ) {
        return $std_core_hnd.under2(ev_0, function(source_0_0 /* model/source<669> */ , value_0 /* 669 */ ) {
             
            var x_3_10204 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "signal write");
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(wild_12 /* () */ ) {
                return _mlift_interpret_write_10173(root, source_0_0, value_0, wild_12);
              });
            }
            else {
              return _mlift_interpret_write_10173(root, source_0_0, value_0, x_3_10204);
            }
          }, x1_0, x2_0);
      }), function(_res /* 689 */ ) {
      return _res;
    }, action);
}
 
 
// // monadic lift
export function _mlift_sample_action_10174(rcontext, source, wild) /* forall<a,b,e> (rcontext : hnd/resume-context<a,<exn,div,effects/signal-write|e>,<effects/signal-read,exn,div,effects/signal-write|e>,b>, source : model/source<a>, wild : ()) -> <exn,div,effects/signal-write|e> b */  {
   
  var _x_x1_1_10156 = $std_core_hnd._open_none1(function(source_1 /* model/source<817> */ ) {
      return source_1.source_cell;
    }, source);
   
  var x_10207 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_1_10156);
  return rcontext($std_core_hnd.Deep(x_10207));
}
 
export function sample_action(root, action) /* forall<a,e> (root : model/root<e>, action : () -> <effects/signal-read,effects/signal-write,pure|e> a) -> <effects/signal-write,div,exn|e> a */  {
  return $kokaine_reactive_effects.signal_read_fs__handle($kokaine_reactive_effects._Hnd_signal_read(3, function(m /* hnd/marker<<exn,div,effects/signal-write|864>,863> */ , ___wildcard_x606__16 /* hnd/ev<effects/signal-read> */ , x /* (model/source<_702>, model/read-mode, maybe<model/derive-producer>) */ ) {
        return $std_core_hnd.yield_to(m, function(k /* (hnd/resume-result<_702,863>) -> <exn,div,effects/signal-write|864> 863 */ ) {
             
            var _x_x2_10154 = $std_core_hnd._open_none1(function(source_0 /* model/source<817> */ ) {
                return source_0.source_root;
              }, x.fst);
             
            var x_0_10209 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_root, root, _x_x2_10154);
             
            function next_10210(wild) /* (()) -> <exn,div,effects/signal-write|864> 863 */  {
               
              var _x_x1_1_10156 = $std_core_hnd._open_none1(function(source_1 /* model/source<817> */ ) {
                  return source_1.source_cell;
                }, x.fst);
               
              var x_10207 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_1_10156);
              return k($std_core_hnd.Deep(x_10207));
            }
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(next_10210);
            }
            else {
              return next_10210(x_0_10209);
            }
          });
      }, $std_core_hnd.clause_tail1(function(producer /* model/derive-producer */ ) {
        return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.settle_producer, producer);
      })), function(_res /* 863 */ ) {
      return _res;
    }, action);
}
 
 
// // monadic lift
export function _mlift_dispatch_handled_10175(action, root, wild) /* forall<a,e> (action : () -> <effects/signal-read,effects/signal-write,pure|e> a, root : model/root<e>, wild : ()) -> <exn|e> a */  {
  return interpret_write(root, function() {
      return sample_action(root, action);
    });
}
 
export function dispatch_handled(root, action) /* forall<a,e> (root : model/root<e>, action : () -> <effects/signal-read,effects/signal-write,pure|e> a) -> <exn|e> a */  {
   
  var _x_x2_10160 = $std_core_hnd._open_none1(function(root_0 /* model/root<929> */ ) {
      return root_0.root_key;
    }, root);
   
  var x_10211 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_root, root, _x_x2_10160);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild /* () */ ) {
      return interpret_write(root, function() {
          return sample_action(root, action);
        });
    });
  }
  else {
    return interpret_write(root, function() {
        return sample_action(root, action);
      });
  }
}