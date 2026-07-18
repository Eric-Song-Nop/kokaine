// Koka generated module: kokaine/reactive/internal/handlers, koka version: 3.2.4
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
import * as $kokaine_reactive_internal_scheduler from './kokaine_reactive_internal_scheduler.mjs';
import * as $std_core_undiv from './std_core_undiv.mjs';
import * as $kokaine_internal_registry from './kokaine_internal_registry.mjs';
import * as $kokaine_reactive_internal_work_dash_transaction from './kokaine_reactive_internal_work_dash_transaction.mjs';
 
// externals
 
// type declarations
 
// declarations
 
 
// monadic lift
export function _mlift_interpret_write_10145(root, wild___0) /* forall<_e,_e1,e2> (root : kokaine/reactive/internal/model/root<e2>, wild_@0 : ()) -> <exn|e2> () */  {
   
  var target_10034 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<675> */ ) {
      return root_0.root_batch_depth;
    }, root);
   
  var value_0_10039 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<675> */ ) {
      return root_1.root_batch_depth;
    }, root);
   
  var x_10037 = value_0_10039.value;
   
  var value_10035 = $std_core_types._int_add(x_10037,1);
  return ((target_10034).value = value_10035);
}
 
 
// monadic lift
export function _mlift_interpret_write_10146(key, root, wild__) /* forall<_e,_e1,e2> (key : kokaine/reactive/internal/model/root-key, root : kokaine/reactive/internal/model/root<e2>, wild_ : ()) -> <exn|e2> () */  {
   
  var x_10159 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_root, root, key);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_interpret_write_10145(root, wild___0);
    });
  }
  else {
    return _mlift_interpret_write_10145(root, x_10159);
  }
}
 
 
// monadic lift
export function _mlift_interpret_write_10147(root, wild___2) /* forall<_e,_e1,e2> (root : kokaine/reactive/internal/model/root<e2>, wild_@2 : ()) -> <exn,div|e2> () */  {
   
  var value_1_10043 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<675> */ ) {
      return root_2.root_batch_depth;
    }, root);
   
  var depth = value_1_10043.value;
  if ($std_core_types._int_le(depth,0)) {
    return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "unbalanced reactive batch");
  }
  else {
     
    var target_0_10046 = $std_core_hnd._open_none1(function(root_3 /* kokaine/reactive/internal/model/root<675> */ ) {
        return root_3.root_batch_depth;
      }, root);
     
    var value_2_10047 = $std_core_types._int_sub(depth,1);
     
    ((target_0_10046).value = value_2_10047);
    return $kokaine_reactive_internal_scheduler.flush(root);
  }
}
 
 
// monadic lift
export function _mlift_interpret_write_10148(key_0, root, wild___1) /* forall<_e,_e1,e2> (key@0 : kokaine/reactive/internal/model/root-key, root : kokaine/reactive/internal/model/root<e2>, wild_@1 : ()) -> <exn,div|e2> () */  {
   
  var x_10162 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_root, root, key_0);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___2 /* () */ ) {
      return _mlift_interpret_write_10147(root, wild___2);
    });
  }
  else {
    return _mlift_interpret_write_10147(root, x_10162);
  }
}
 
 
// monadic lift
export function _mlift_interpret_write_10149(root, source, value_4, _y_x10012) /* forall<_e,_e1,a,e2> (root : kokaine/reactive/internal/model/root<e2>, source : kokaine/reactive/internal/model/source<a>, value@4 : a, bool) -> <div,exn|e2> () */  {
  if (_y_x10012) {
    return $std_core_types.Unit;
  }
  else {
     
    var target_1_10059 = $std_core_hnd._open_none1(function(source_3 /* kokaine/reactive/internal/model/source<462> */ ) {
        return source_3.source_cell;
      }, source);
     
    ((target_1_10059).value = value_4);
     
    var target_2_10062 = $std_core_hnd._open_none1(function(source_4 /* kokaine/reactive/internal/model/source<462> */ ) {
        return source_4.source_version;
      }, source);
     
    var value_7_10067 = $std_core_hnd._open_none1(function(source_5 /* kokaine/reactive/internal/model/source<462> */ ) {
        return source_5.source_version;
      }, source);
     
    var x_1_10065 = value_7_10067.value;
     
    var value_6_10063 = $std_core_types._int_add(x_1_10065,1);
     
    ((target_2_10062).value = value_6_10063);
     
    $std_core_hnd._open_none1(function(source_6 /* kokaine/reactive/internal/model/source<462> */ ) {
        var _x0 = source_6.source_captures;
        return $std_core_list.foreach($kokaine_internal_registry.registry_fs_snapshot(_x0), $kokaine_reactive_internal_scheduler.cut_capture);
      }, source);
    return $kokaine_reactive_internal_scheduler.flush(root);
  }
}
 
 
// monadic lift
export function _mlift_interpret_write_10150(root, source, update, wild___5) /* forall<_e,_e1,a,e2> (root : kokaine/reactive/internal/model/root<e2>, source : kokaine/reactive/internal/model/source<a>, update : (a) -> a, wild_@5 : ()) -> <exn,div|e2> () */  {
   
  var value_3_10054 = $std_core_hnd._open_none1(function(source_1 /* kokaine/reactive/internal/model/source<462> */ ) {
      return source_1.source_cell;
    }, source);
   
  var previous = value_3_10054.value;
   
  var value_4 = $std_core_hnd._open_none1(update, previous);
   
  var _x_x0_13_10057 = $std_core_hnd._open_none1(function(source_2 /* kokaine/reactive/internal/model/source<462> */ ) {
      return source_2.source_equals;
    }, source);
   
  var x_10164 = $std_core_hnd._open_none2(_x_x0_13_10057, previous, value_4);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10012 /* bool */ ) {
      return _mlift_interpret_write_10149(root, source, value_4, _y_x10012);
    });
  }
  else {
    return _mlift_interpret_write_10149(root, source, value_4, x_10164);
  }
}
 
 
// monadic lift
export function _mlift_interpret_write_10151(root, source, update, wild___4) /* forall<_e,_e1,a,e2> (root : kokaine/reactive/internal/model/root<e2>, source : kokaine/reactive/internal/model/source<a>, update : (a) -> a, wild_@4 : ()) -> <exn,div|e2> () */  {
   
  var _x_x2_2_10111 = $std_core_hnd._open_none1(function(source_0 /* kokaine/reactive/internal/model/source<462> */ ) {
      return source_0.source_root;
    }, source);
   
  var x_10166 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_root, root, _x_x2_2_10111);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___5 /* () */ ) {
      return _mlift_interpret_write_10150(root, source, update, wild___5);
    });
  }
  else {
    return _mlift_interpret_write_10150(root, source, update, x_10166);
  }
}
 
 
// monadic lift
export function _mlift_interpret_write_10152(root, wild___10) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, wild_@10 : ()) -> <exn,div|e> () */  {
  return $kokaine_reactive_internal_scheduler.flush(root);
}
 
 
// monadic lift
export function _mlift_interpret_write_10153(key_1, root, wild___9) /* forall<e> (key@1 : kokaine/reactive/internal/model/root-key, root : kokaine/reactive/internal/model/root<e>, wild_@9 : ()) -> <exn,div|e> () */  {
   
  var x_10168 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_root, root, key_1);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___10 /* () */ ) {
      return $kokaine_reactive_internal_scheduler.flush(root);
    });
  }
  else {
    return $kokaine_reactive_internal_scheduler.flush(root);
  }
}
 
 
// monadic lift
export function _mlift_interpret_write_10154(root, source_0_0, value_0_0, _y_x10020) /* forall<_e,_e1,a,e2> (root : kokaine/reactive/internal/model/root<e2>, source@0@0 : kokaine/reactive/internal/model/source<a>, value@0@0 : a, bool) -> <div,exn|e2> () */  {
  if (_y_x10020) {
    return $std_core_types.Unit;
  }
  else {
     
    var target_3_10079 = $std_core_hnd._open_none1(function(source_10 /* kokaine/reactive/internal/model/source<654> */ ) {
        return source_10.source_cell;
      }, source_0_0);
     
    ((target_3_10079).value = value_0_0);
     
    var target_4_10082 = $std_core_hnd._open_none1(function(source_11 /* kokaine/reactive/internal/model/source<654> */ ) {
        return source_11.source_version;
      }, source_0_0);
     
    var value_11_10087 = $std_core_hnd._open_none1(function(source_12 /* kokaine/reactive/internal/model/source<654> */ ) {
        return source_12.source_version;
      }, source_0_0);
     
    var x_2_10085 = value_11_10087.value;
     
    var value_10_10083 = $std_core_types._int_add(x_2_10085,1);
     
    ((target_4_10082).value = value_10_10083);
     
    $std_core_hnd._open_none1(function(source_13 /* kokaine/reactive/internal/model/source<654> */ ) {
        var _x0 = source_13.source_captures;
        return $std_core_list.foreach($kokaine_internal_registry.registry_fs_snapshot(_x0), $kokaine_reactive_internal_scheduler.cut_capture);
      }, source_0_0);
    return $kokaine_reactive_internal_scheduler.flush(root);
  }
}
 
 
// monadic lift
export function _mlift_interpret_write_10155(root, source_0_0, value_0_0, wild___12) /* forall<_e,_e1,a,e2> (root : kokaine/reactive/internal/model/root<e2>, source@0@0 : kokaine/reactive/internal/model/source<a>, value@0@0 : a, wild_@12 : ()) -> <exn,div|e2> () */  {
   
  var value_8_10075 = $std_core_hnd._open_none1(function(source_8 /* kokaine/reactive/internal/model/source<654> */ ) {
      return source_8.source_cell;
    }, source_0_0);
   
  var previous_0 = value_8_10075.value;
   
  var _x_x0_25_10077 = $std_core_hnd._open_none1(function(source_9 /* kokaine/reactive/internal/model/source<654> */ ) {
      return source_9.source_equals;
    }, source_0_0);
   
  var x_10172 = $std_core_hnd._open_none2(_x_x0_25_10077, previous_0, value_0_0);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10020 /* bool */ ) {
      return _mlift_interpret_write_10154(root, source_0_0, value_0_0, _y_x10020);
    });
  }
  else {
    return _mlift_interpret_write_10154(root, source_0_0, value_0_0, x_10172);
  }
}
 
 
// monadic lift
export function _mlift_interpret_write_10156(root, source_0_0, value_0_0, wild___11) /* forall<_e,_e1,a,e2> (root : kokaine/reactive/internal/model/root<e2>, source@0@0 : kokaine/reactive/internal/model/source<a>, value@0@0 : a, wild_@11 : ()) -> <exn,div|e2> () */  {
   
  var _x_x2_5_10127 = $std_core_hnd._open_none1(function(source_7 /* kokaine/reactive/internal/model/source<654> */ ) {
      return source_7.source_root;
    }, source_0_0);
   
  var x_10174 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_root, root, _x_x2_5_10127);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___12 /* () */ ) {
      return _mlift_interpret_write_10155(root, source_0_0, value_0_0, wild___12);
    });
  }
  else {
    return _mlift_interpret_write_10155(root, source_0_0, value_0_0, x_10174);
  }
}
 
export function interpret_write(root, action) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, action : () -> <kokaine/reactive/effects/signal-write,pure|e> a) -> <div,exn|e> a */  {
  return $kokaine_reactive_effects.signal_write_fs__handle($kokaine_reactive_effects._Hnd_signal_write(1, $std_core_hnd.clause_tail1(function(key /* kokaine/reactive/internal/model/root-key */ ) {
         
        var x_10177 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "reactive batch");
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
            return _mlift_interpret_write_10146(key, root, wild__);
          });
        }
        else {
          return _mlift_interpret_write_10146(key, root, x_10177);
        }
      }), $std_core_hnd.clause_tail1(function(key_0 /* kokaine/reactive/internal/model/root-key */ ) {
         
        var x_0_10179 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "reactive batch");
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(wild___1 /* () */ ) {
            return _mlift_interpret_write_10148(key_0, root, wild___1);
          });
        }
        else {
          return _mlift_interpret_write_10148(key_0, root, x_0_10179);
        }
      }), function(m /* hnd/marker<<div,exn|675>,674> */ , ev /* hnd/ev<kokaine/reactive/effects/signal-write> */ , x1 /* kokaine/reactive/internal/model/source<_62> */ , x2 /* (_62) -> _62 */ ) {
        return $std_core_hnd.under2(ev, function(source /* kokaine/reactive/internal/model/source<462> */ , update /* (462) -> 462 */ ) {
             
            var x_1_10182 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "signal modify");
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(wild___4 /* () */ ) {
                return _mlift_interpret_write_10151(root, source, update, wild___4);
              });
            }
            else {
              return _mlift_interpret_write_10151(root, source, update, x_1_10182);
            }
          }, x1, x2);
      }, $std_core_hnd.clause_tail1(function(key_1 /* kokaine/reactive/internal/model/root-key */ ) {
         
        var x_2_10184 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "reactive flush");
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(wild___9 /* () */ ) {
            return _mlift_interpret_write_10153(key_1, root, wild___9);
          });
        }
        else {
          return _mlift_interpret_write_10153(key_1, root, x_2_10184);
        }
      }), function(m_0 /* hnd/marker<<div,exn|675>,674> */ , ev_0 /* hnd/ev<kokaine/reactive/effects/signal-write> */ , x1_0 /* kokaine/reactive/internal/model/source<_66> */ , x2_0 /* _66 */ ) {
        return $std_core_hnd.under2(ev_0, function(source_0_0 /* kokaine/reactive/internal/model/source<654> */ , value_0_0 /* 654 */ ) {
             
            var x_3_10187 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "signal write");
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(wild___11 /* () */ ) {
                return _mlift_interpret_write_10156(root, source_0_0, value_0_0, wild___11);
              });
            }
            else {
              return _mlift_interpret_write_10156(root, source_0_0, value_0_0, x_3_10187);
            }
          }, x1_0, x2_0);
      }), function(_res /* 674 */ ) {
      return _res;
    }, action);
}
 
 
// monadic lift
export function _mlift_sample_action_10157(rcontext, source, wild__) /* forall<_e,a,b,e1> (rcontext : hnd/resume-context<a,<exn,div,kokaine/reactive/effects/signal-write|e1>,<kokaine/reactive/effects/signal-read,exn,div,kokaine/reactive/effects/signal-write|e1>,b>, source : kokaine/reactive/internal/model/source<a>, wild_ : ()) -> <exn,div,kokaine/reactive/effects/signal-write|e1> b */  {
   
  var value_10092 = $std_core_hnd._open_none1(function(source_1 /* kokaine/reactive/internal/model/source<802> */ ) {
      return source_1.source_cell;
    }, source);
   
  var x_10190 = value_10092.value;
  return rcontext($std_core_hnd.Deep(x_10190));
}
 
export function sample_action(root, action) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, action : () -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure|e> a) -> <kokaine/reactive/effects/signal-write,div,exn|e> a */  {
  return $kokaine_reactive_effects.signal_read_fs__handle($kokaine_reactive_effects._Hnd_signal_read(3, function(m /* hnd/marker<<exn,div,kokaine/reactive/effects/signal-write|849>,848> */ , ___wildcard_x598__16 /* hnd/ev<kokaine/reactive/effects/signal-read> */ , x /* (kokaine/reactive/internal/model/source<_687>, kokaine/reactive/internal/model/read-mode, maybe<kokaine/reactive/internal/model/derive-producer>) */ ) {
        return $std_core_hnd.yield_to(m, function(k /* (hnd/resume-result<_687,848>) -> <exn,div,kokaine/reactive/effects/signal-write|849> 848 */ ) {
             
            var _x_x2_10138 = $std_core_hnd._open_none1(function(source_0 /* kokaine/reactive/internal/model/source<802> */ ) {
                return source_0.source_root;
              }, x.fst);
             
            var x_0_10192 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_root, root, _x_x2_10138);
             
            function next_10193(wild__) /* (()) -> <exn,div,kokaine/reactive/effects/signal-write|849> 848 */  {
               
              var value_10092 = $std_core_hnd._open_none1(function(source_1 /* kokaine/reactive/internal/model/source<802> */ ) {
                  return source_1.source_cell;
                }, x.fst);
               
              var x_10190 = value_10092.value;
              return k($std_core_hnd.Deep(x_10190));
            }
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(next_10193);
            }
            else {
              return next_10193(x_0_10192);
            }
          });
      }, $std_core_hnd.clause_tail1(function(producer /* kokaine/reactive/internal/model/derive-producer */ ) {
        return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.settle_producer, producer);
      })), function(_res /* 848 */ ) {
      return _res;
    }, action);
}
 
 
// monadic lift
export function _mlift_dispatch_handled_10158(action, root, wild__) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure|e> a, root : kokaine/reactive/internal/model/root<e>, wild_ : ()) -> <exn|e> a */  {
  return interpret_write(root, function() {
      return sample_action(root, action);
    });
}
 
export function dispatch_handled(root, action) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, action : () -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> a */  {
   
  var _x_x2_10143 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<914> */ ) {
      return root_0.root_key;
    }, root);
   
  var x_10194 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_root, root, _x_x2_10143);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
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