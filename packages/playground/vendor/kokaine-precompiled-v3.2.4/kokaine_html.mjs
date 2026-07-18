// Koka generated module: kokaine/html, koka version: 3.2.4
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
import * as $kokaine_reactive_effects from './kokaine_reactive_effects.mjs';
import * as $std_core from './std_core.mjs';
import * as $kokaine_reactive from './kokaine_reactive.mjs';
import * as $kokaine_async_effects from './kokaine_async_effects.mjs';
 
// externals
 
// type declarations
 
 
// runtime tag for the effect `:html`
export var html_fs__tag;
var html_fs__tag = "html@html";
// type event
export function Event(value, checked, key, original) /* (value : string, checked : bool, key : string, original : any) -> event */  {
  return { value: value, checked: checked, key: key, original: original };
}
// type property-value
export function String_property(value) /* (value : string) -> property-value */  {
  return { _tag: 1, value: value };
}
export function Bool_property(value) /* (value : bool) -> property-value */  {
  return { _tag: 2, value: value };
}
export function Int_property(value) /* (value : int) -> property-value */  {
  return { _tag: 3, value: value };
}
// type attribute
export function Attribute(name, value) /* forall<e> (name : string, value : string) -> attribute<e> */  {
  return { _tag: 1, name: name, value: value };
}
export function Boolean_attribute(name, enabled) /* forall<e> (name : string, enabled : bool) -> attribute<e> */  {
  return { _tag: 2, name: name, enabled: enabled };
}
export function Property(name, value) /* forall<e> (name : string, value : property-value) -> attribute<e> */  {
  return { _tag: 3, name: name, value: value };
}
export function Live_attribute(name, read) /* forall<e> (name : string, read : () -> kokaine/reactive/effects/signal-read maybe<string>) -> attribute<e> */  {
  return { _tag: 4, name: name, read: read };
}
export function Live_property(name, read) /* forall<e> (name : string, read : () -> kokaine/reactive/effects/signal-read property-value) -> attribute<e> */  {
  return { _tag: 5, name: name, read: read };
}
export function Listener(name, action) /* forall<e> (name : string, action : callback) -> attribute<e> */  {
  return { _tag: 6, name: name, action: action };
}
// type dialog-close-policy
export const Dialog_close_any = 1; // dialog-close-policy
export const Dialog_close_request = 2; // dialog-close-policy
export const Dialog_close_explicit = 3; // dialog-close-policy
// type trusted-html
export function Trusted_html(content) /* (content : string) -> trusted-html */  {
  return content;
}
// type html
export function _Hnd_html(_cfc, _fun_emit) /* forall<e,e1,a> (int, hnd/clause1<view<e>,(),html<e>,e1,a>) -> html<e,e1,a> */  {
  return { _cfc: _cfc, _fun_emit: _fun_emit };
}
// type keyed-spec
export function Keyed_spec(keyed_read, keyed_walk, keyed_key, keyed_compare, keyed_item_equals, keyed_children) /* forall<e,a,b,c> (keyed-read : () -> kokaine/reactive/effects/signal-read a, keyed-walk : forall<e1> (a, (b) -> e1 ()) -> e1 (), keyed-key : (b) -> c, keyed-compare : (c, c) -> order, keyed-item-equals : (b, b) -> bool, keyed-children : (item : accessor<b>, index : accessor<int>) -> <html<e>,kokaine/reactive/effects/signal-read> ()) -> keyed-spec<e,a,b,c> */  {
  return { keyed_read: keyed_read, keyed_walk: keyed_walk, keyed_key: keyed_key, keyed_compare: keyed_compare, keyed_item_equals: keyed_item_equals, keyed_children: keyed_children };
}
// type keyed-plan
export function Keyed_plan(plan_spec) /* forall<e,a,b,c> (plan-spec : keyed-spec<e,a,b,c>) -> keyed-plan<e> */  {
  return { plan_spec: plan_spec };
}
// type view
export const Empty = { _tag: 1 }; // forall<e> view<e>
export function Text(content) /* forall<e> (content : string) -> view<e> */  {
  return { _tag: 2, content: content };
}
export function Live_text(read) /* forall<e> (read : () -> kokaine/reactive/effects/signal-read string) -> view<e> */  {
  return { _tag: 3, read: read };
}
export function Element(name, attributes, children) /* forall<e> (name : string, attributes : list<attribute<e>>, children : list<view<e>>) -> view<e> */  {
  return { _tag: 4, name: name, attributes: attributes, children: children };
}
export function Fragment(children) /* forall<e> (children : list<view<e>>) -> view<e> */  {
  return { _tag: 5, children: children };
}
export function Region(read) /* forall<e> (read : () -> kokaine/reactive/effects/signal-read view<e>) -> view<e> */  {
  return { _tag: 6, read: read };
}
export function Keyed_region(plan) /* forall<e> (plan : keyed-plan<e>) -> view<e> */  {
  return { _tag: 7, plan: plan };
}
export function Raw_html(content) /* forall<e> (content : trusted-html) -> view<e> */  {
  return { _tag: 8, content: content };
}
// type popover-mode
export const Popover_auto = 1; // popover-mode
export const Popover_manual = 2; // popover-mode
export const Popover_hint = 3; // popover-mode
// type popover-target-action
export const Popover_toggle = 1; // popover-target-action
export const Popover_show = 2; // popover-target-action
export const Popover_hide = 3; // popover-target-action
 
// declarations
 
 
// Automatically generated. Retrieves the `value` constructor field of the `:event` type.
export function event_fs_value(event) /* (event : event) -> string */  {
  return event.value;
}
 
 
// Automatically generated. Retrieves the `checked` constructor field of the `:event` type.
export function event_fs_checked(event) /* (event : event) -> bool */  {
  return event.checked;
}
 
 
// Automatically generated. Retrieves the `key` constructor field of the `:event` type.
export function event_fs_key(event) /* (event : event) -> string */  {
  return event.key;
}
 
 
// Automatically generated. Retrieves the `original` constructor field of the `:event` type.
export function event_fs_original(event) /* (event : event) -> any */  {
  return event.original;
}
 
export function event_fs__copy(_this, value_0, checked_0, key, original) /* (event, value : ? string, checked : ? bool, key : ? string, original : ? any) -> event */  {
  if (value_0 !== undefined) {
    var _x0 = value_0;
  }
  else {
    var _x0 = _this.value;
  }
  if (checked_0 !== undefined) {
    var _x1 = checked_0;
  }
  else {
    var _x1 = _this.checked;
  }
  if (key !== undefined) {
    var _x2 = key;
  }
  else {
    var _x2 = _this.key;
  }
  if (original !== undefined) {
    var _x3 = original;
  }
  else {
    var _x3 = _this.original;
  }
  return Event(_x0, _x1, _x2, _x3);
}
 
 
// Automatically generated. Tests for the `String-property` constructor of the `:property-value` type.
export function is_string_property(property_value) /* (property-value : property-value) -> bool */  {
  return (property_value._tag === 1);
}
 
 
// Automatically generated. Tests for the `Bool-property` constructor of the `:property-value` type.
export function is_bool_property(property_value) /* (property-value : property-value) -> bool */  {
  return (property_value._tag === 2);
}
 
 
// Automatically generated. Tests for the `Int-property` constructor of the `:property-value` type.
export function is_int_property(property_value) /* (property-value : property-value) -> bool */  {
  return (property_value._tag === 3);
}
 
 
// Automatically generated. Tests for the `Popover-auto` constructor of the `:popover-mode` type.
export function is_popover_auto(popover_mode) /* (popover-mode : popover-mode) -> bool */  {
  return (popover_mode === 1);
}
 
 
// Automatically generated. Tests for the `Popover-manual` constructor of the `:popover-mode` type.
export function is_popover_manual(popover_mode) /* (popover-mode : popover-mode) -> bool */  {
  return (popover_mode === 2);
}
 
 
// Automatically generated. Tests for the `Popover-hint` constructor of the `:popover-mode` type.
export function is_popover_hint(popover_mode) /* (popover-mode : popover-mode) -> bool */  {
  return (popover_mode === 3);
}
 
 
// Automatically generated. Tests for the `Popover-toggle` constructor of the `:popover-target-action` type.
export function is_popover_toggle(popover_target_action_0) /* (popover-target-action : popover-target-action) -> bool */  {
  return (popover_target_action_0 === 1);
}
 
 
// Automatically generated. Tests for the `Popover-show` constructor of the `:popover-target-action` type.
export function is_popover_show(popover_target_action_0) /* (popover-target-action : popover-target-action) -> bool */  {
  return (popover_target_action_0 === 2);
}
 
 
// Automatically generated. Tests for the `Popover-hide` constructor of the `:popover-target-action` type.
export function is_popover_hide(popover_target_action_0) /* (popover-target-action : popover-target-action) -> bool */  {
  return (popover_target_action_0 === 3);
}
 
 
// Automatically generated. Tests for the `Dialog-close-any` constructor of the `:dialog-close-policy` type.
export function is_dialog_close_any(dialog_close_policy) /* (dialog-close-policy : dialog-close-policy) -> bool */  {
  return (dialog_close_policy === 1);
}
 
 
// Automatically generated. Tests for the `Dialog-close-request` constructor of the `:dialog-close-policy` type.
export function is_dialog_close_request(dialog_close_policy) /* (dialog-close-policy : dialog-close-policy) -> bool */  {
  return (dialog_close_policy === 2);
}
 
 
// Automatically generated. Tests for the `Dialog-close-explicit` constructor of the `:dialog-close-policy` type.
export function is_dialog_close_explicit(dialog_close_policy) /* (dialog-close-policy : dialog-close-policy) -> bool */  {
  return (dialog_close_policy === 3);
}
 
 
// Automatically generated. Tests for the `Attribute` constructor of the `:attribute` type.
export function is_attribute(attribute) /* forall<e> (attribute : attribute<e>) -> bool */  {
  return (attribute._tag === 1);
}
 
 
// Automatically generated. Retrieves the `name` constructor field of the `:attribute` type.
export function attribute_fs_name(attribute) /* forall<e> (attribute : attribute<e>) -> string */  {
  if (attribute._tag === 1) {
    return attribute.name;
  }
  else if (attribute._tag === 2) {
    return attribute.name;
  }
  else if (attribute._tag === 3) {
    return attribute.name;
  }
  else if (attribute._tag === 4) {
    return attribute.name;
  }
  else if (attribute._tag === 5) {
    return attribute.name;
  }
  else {
    return attribute.name;
  }
}
 
 
// Automatically generated. Tests for the `Boolean-attribute` constructor of the `:attribute` type.
export function is_boolean_attribute(attribute) /* forall<e> (attribute : attribute<e>) -> bool */  {
  return (attribute._tag === 2);
}
 
 
// Automatically generated. Tests for the `Property` constructor of the `:attribute` type.
export function is_property(attribute) /* forall<e> (attribute : attribute<e>) -> bool */  {
  return (attribute._tag === 3);
}
 
 
// Automatically generated. Tests for the `Live-attribute` constructor of the `:attribute` type.
export function is_live_attribute(attribute) /* forall<e> (attribute : attribute<e>) -> bool */  {
  return (attribute._tag === 4);
}
 
 
// Automatically generated. Tests for the `Live-property` constructor of the `:attribute` type.
export function is_live_property(attribute) /* forall<e> (attribute : attribute<e>) -> bool */  {
  return (attribute._tag === 5);
}
 
 
// Automatically generated. Tests for the `Listener` constructor of the `:attribute` type.
export function is_listener(attribute) /* forall<e> (attribute : attribute<e>) -> bool */  {
  return (attribute._tag === 6);
}
 
 
// Automatically generated. Retrieves the `content` constructor field of the `:trusted-html` type.
export function trusted_html_fs_content(_this) /* (trusted-html) -> string */  {
  return _this;
}
 
export function trusted_html_fs__copy(_this, content) /* (trusted-html, content : ? string) -> trusted-html */  {
  if (content !== undefined) {
    var _x4 = content;
  }
  else {
    var _x4 = _this;
  }
  return _x4;
}
 
 
// Automatically generated. Tests for the `Empty` constructor of the `:view` type.
export function is_empty(view_0) /* forall<e> (view : view<e>) -> bool */  {
  return (view_0._tag === 1);
}
 
 
// Automatically generated. Tests for the `Text` constructor of the `:view` type.
export function is_text(view_0) /* forall<e> (view : view<e>) -> bool */  {
  return (view_0._tag === 2);
}
 
 
// Automatically generated. Tests for the `Live-text` constructor of the `:view` type.
export function is_live_text(view_0) /* forall<e> (view : view<e>) -> bool */  {
  return (view_0._tag === 3);
}
 
 
// Automatically generated. Tests for the `Element` constructor of the `:view` type.
export function is_element(view_0) /* forall<e> (view : view<e>) -> bool */  {
  return (view_0._tag === 4);
}
 
 
// Automatically generated. Tests for the `Fragment` constructor of the `:view` type.
export function is_fragment(view_0) /* forall<e> (view : view<e>) -> bool */  {
  return (view_0._tag === 5);
}
 
 
// Automatically generated. Tests for the `Region` constructor of the `:view` type.
export function is_region(view_0) /* forall<e> (view : view<e>) -> bool */  {
  return (view_0._tag === 6);
}
 
 
// Automatically generated. Tests for the `Keyed-region` constructor of the `:view` type.
export function is_keyed_region(view_0) /* forall<e> (view : view<e>) -> bool */  {
  return (view_0._tag === 7);
}
 
 
// Automatically generated. Tests for the `Raw-html` constructor of the `:view` type.
export function is_raw_html(view_0) /* forall<e> (view : view<e>) -> bool */  {
  return (view_0._tag === 8);
}
 
 
// The name makes the trust boundary visible at every call site. Browser and
// string renderers never interpret ordinary `text` as markup.
export function unsafe_trusted_html(content) /* (content : string) -> trusted-html */  {
  return content;
}
 
export function trusted_content(value_0) /* (value : trusted-html) -> string */  {
  return value_0;
}
 
export function is_name_tail_character(char) /* (char : char) -> bool */  {
  var _x5 = $std_core_char.is_alpha_num(char);
  if (_x5) {
    return true;
  }
  else {
    if ((char === 0x002D)) {
      return true;
    }
    else {
      if ((char === 0x005F)) {
        return true;
      }
      else {
        return ((char === 0x002E)) ? true : (char === 0x003A);
      }
    }
  }
}
 
export function begins_with_on(value_0) /* (value : string) -> bool */  {
  var _x6 = $std_core_string.list($std_core_string.to_lower(value_0));
  return (_x6 !== null && _x6.head === 0x006F && _x6.tail !== null && _x6.tail.head === 0x006E);
}
 
export function is_valid_element_name(value_0) /* (value : string) -> bool */  {
  var _x7 = $std_core_string.list(value_0);
  if (_x7 === null) {
    return false;
  }
  else {
    var _x8 = $std_core_char.is_alpha(_x7.head);
    if (_x8) {
      return $std_core_list.all(_x7.tail, is_name_tail_character);
    }
    else {
      return false;
    }
  }
}
 
 
// Static `on*` attributes are rejected so executable behavior must cross the
// typed Listener boundary instead of entering as a string.
export function is_valid_attribute_name(value_0) /* (value : string) -> bool */  {
  var _x9 = $std_core_string.list(value_0);
  if (_x9 === null) {
    return false;
  }
  else {
     
    var _x10 = $std_core_string.list($std_core_string.to_lower(value_0));
    var b_10005 = (_x10 !== null && _x10.head === 0x006F && _x10.tail !== null && _x10.tail.head === 0x006E);
    if (b_10005) {
      return false;
    }
    else {
      var _x10 = (($std_core_string.to_lower(value_0)) !== ("srcdoc"));
      if (_x10) {
        var _x11 = $std_core_char.is_alpha(_x9.head);
        if (_x11) {
          return $std_core_list.all(_x9.tail, is_name_tail_character);
        }
        else {
          if (((_x9.head) === 0x005F)) {
            return $std_core_list.all(_x9.tail, is_name_tail_character);
          }
          else {
            if (((_x9.head) === 0x003A)) {
              return $std_core_list.all(_x9.tail, is_name_tail_character);
            }
            else {
              return false;
            }
          }
        }
      }
      else {
        return false;
      }
    }
  }
}
 
export function is_valid_property_name(value_0) /* (value : string) -> bool */  {
   
  var lower = $std_core_string.to_lower(value_0);
  var _x12 = is_valid_attribute_name(value_0);
  if (_x12) {
    if ((lower !== ("innerhtml"))) {
      return ((lower !== ("outerhtml"))) ? (lower !== ("insertadjacenthtml")) : false;
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
}
 
export function is_valid_event_name(value_0) /* (value : string) -> bool */  {
  var _x13 = $std_core_string.list(value_0);
  if (_x13 === null) {
    return false;
  }
  else {
    var _x14 = $std_core_char.is_alpha(_x13.head);
    if (_x14) {
      return $std_core_list.all(_x13.tail, is_name_tail_character);
    }
    else {
      return false;
    }
  }
}
 
 
// Automatically generated. Retrieves the `@cfc` constructor field of the `:html` type.
export function html_fs__cfc(html) /* forall<e,e1,a> (html : html<e,e1,a>) -> int */  {
  return html._cfc;
}
 
 
// handler for the effect `:html`
export function html_fs__handle(hnd, ret, action) /* forall<e,a,e1,b> (hnd : html<e,e1,b>, ret : (res : a) -> e1 b, action : () -> <html<e>|e1> a) -> e1 b */  {
  return $std_core_hnd._hhandle(html_fs__tag, hnd, ret, action);
}
 
 
// Automatically generated. Retrieves the `@fun-emit` constructor field of the `:html` type.
export function html_fs__fun_emit(html) /* forall<e,e1,a> (html : html<e,e1,a>) -> hnd/clause1<view<e>,(),html<e>,e1,a> */  {
  return html._fun_emit;
}
 
 
// select `emit` operation out of effect `:html`
export function emit_fs__select(hnd) /* forall<e,e1,a> (hnd : html<e,e1,a>) -> hnd/clause1<view<e>,(),html<e>,e1,a> */  {
  return hnd._fun_emit;
}
 
 
// Call the `fun emit` operation of the effect `:html`
export function emit(node) /* forall<e> (node : view<e>) -> (html<e>) () */  {
   
  var ev_10328 = $std_core_hnd._evv_at(0);
  return ev_10328.hnd._fun_emit(ev_10328.marker, ev_10328, node);
}
 
 
// Automatically generated. Retrieves the `keyed-read` constructor field of the `:keyed-spec` type.
export function keyed_spec_fs_keyed_read(_this) /* forall<e,a,b,c> (keyed-spec<e,a,b,c>) -> (() -> kokaine/reactive/effects/signal-read a) */  {
  return _this.keyed_read;
}
 
 
// Automatically generated. Retrieves the `keyed-walk` constructor field of the `:keyed-spec` type.
export function keyed_spec_fs_keyed_walk(_this) /* forall<e,a,b,c,e1> (keyed-spec<e,a,b,c>) -> ((a, (b) -> e1 ()) -> e1 ()) */  {
  return _this.keyed_walk;
}
 
 
// Automatically generated. Retrieves the `keyed-key` constructor field of the `:keyed-spec` type.
export function keyed_spec_fs_keyed_key(_this) /* forall<e,a,b,c> (keyed-spec<e,a,b,c>) -> ((b) -> c) */  {
  return _this.keyed_key;
}
 
 
// Automatically generated. Retrieves the `keyed-compare` constructor field of the `:keyed-spec` type.
export function keyed_spec_fs_keyed_compare(_this) /* forall<e,a,b,c> (keyed-spec<e,a,b,c>) -> ((c, c) -> order) */  {
  return _this.keyed_compare;
}
 
 
// Automatically generated. Retrieves the `keyed-item-equals` constructor field of the `:keyed-spec` type.
export function keyed_spec_fs_keyed_item_equals(_this) /* forall<e,a,b,c> (keyed-spec<e,a,b,c>) -> ((b, b) -> bool) */  {
  return _this.keyed_item_equals;
}
 
 
// Automatically generated. Retrieves the `keyed-children` constructor field of the `:keyed-spec` type.
export function keyed_spec_fs_keyed_children(_this) /* forall<e,a,b,c> (keyed-spec<e,a,b,c>) -> ((item : accessor<b>, index : accessor<int>) -> <html<e>,kokaine/reactive/effects/signal-read> ()) */  {
  return _this.keyed_children;
}
 
 
// monadic lift
export function keyed_spec_fs__mlift_copy_10296(_c_x10180, _c_x10182, _this, keyed_compare, keyed_item_equals, keyed_key, _c_x10184) /* forall<e,a,b,c> (() -> kokaine/reactive/effects/signal-read a, forall<e1> (a, (b) -> e1 ()) -> e1 (), keyed-spec<e,a,b,c>, keyed-compare : ? ((c, c) -> order), keyed-item-equals : ? ((b, b) -> bool), keyed-key : ? ((b) -> c), (item : accessor<b>, index : accessor<int>) -> <html<e>,kokaine/reactive/effects/signal-read> ()) -> keyed-spec<e,a,b,c> */  {
  if (keyed_key !== undefined) {
    var _x15 = keyed_key;
  }
  else {
    var _x15 = _this.keyed_key;
  }
  if (keyed_compare !== undefined) {
    var _x16 = keyed_compare;
  }
  else {
    var _x16 = _this.keyed_compare;
  }
  if (keyed_item_equals !== undefined) {
    var _x17 = keyed_item_equals;
  }
  else {
    var _x17 = _this.keyed_item_equals;
  }
  return Keyed_spec(_c_x10180, _c_x10182, _x15, _x16, _x17, _c_x10184);
}
 
 
// monadic lift
export function keyed_spec_fs__mlift_copy_10297(_c_x10181) /* forall<e,a,b> ((a, (b) -> e ()) -> e ()) -> (forall<e> (a, (b) -> e ()) -> e ()) */  {
  return _c_x10181;
}
 
 
// monadic lift
export function keyed_spec_fs__mlift_copy_10298(_c_x10180, _this, keyed_children, keyed_compare, keyed_item_equals, keyed_key, _c_x10182) /* forall<e,a,b,c> (() -> kokaine/reactive/effects/signal-read a, keyed-spec<e,a,b,c>, keyed-children : ? ((item : accessor<b>, index : accessor<int>) -> <html<e>,kokaine/reactive/effects/signal-read> ()), keyed-compare : ? ((c, c) -> order), keyed-item-equals : ? ((b, b) -> bool), keyed-key : ? ((b) -> c), forall<e1> (a, (b) -> e1 ()) -> e1 ()) -> keyed-spec<e,a,b,c> */  {
   
  function next_10332(_c_x10184) /* ((item : accessor<3584>, index : accessor<int>) -> <html<3582>,kokaine/reactive/effects/signal-read> ()) -> keyed-spec<3582,3583,3584,3585> */  {
    if (keyed_key !== undefined) {
      var _x18 = keyed_key;
    }
    else {
      var _x18 = _this.keyed_key;
    }
    if (keyed_compare !== undefined) {
      var _x19 = keyed_compare;
    }
    else {
      var _x19 = _this.keyed_compare;
    }
    if (keyed_item_equals !== undefined) {
      var _x20 = keyed_item_equals;
    }
    else {
      var _x20 = _this.keyed_item_equals;
    }
    return Keyed_spec(_c_x10180, _c_x10182, _x18, _x19, _x20, _c_x10184);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10332);
  }
  else {
    if (keyed_children !== undefined) {
      var _x18 = keyed_children;
    }
    else {
      var _x18 = _this.keyed_children;
    }
    return next_10332(_x18);
  }
}
 
 
// monadic lift
export function keyed_spec_fs__mlift_copy_10299(_this, keyed_children, keyed_compare, keyed_item_equals, keyed_key, keyed_walk, _c_x10180) /* forall<e,e1,a,b,c> (keyed-spec<e1,a,b,c>, keyed-children : ? ((item : accessor<b>, index : accessor<int>) -> <html<e1>,kokaine/reactive/effects/signal-read> ()), keyed-compare : ? ((c, c) -> order), keyed-item-equals : ? ((b, b) -> bool), keyed-key : ? ((b) -> c), keyed-walk : ? (forall<e2> (a, (b) -> e2 ()) -> e2 ()), () -> kokaine/reactive/effects/signal-read a) -> keyed-spec<e1,a,b,c> */  {
   
  if (keyed_walk !== undefined) {
    var x_10340 = keyed_walk;
  }
  else {
    if ($std_core_hnd._yielding()) {
      var x_10340 = $std_core_hnd.yield_extend(function(_c_x10181 /* (3583, (3584) -> 3427 ()) -> 3427 () */ ) {
        return _c_x10181;
      });
    }
    else {
      var _x19 = _this.keyed_walk;
      var x_10340 = _x19;
    }
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10182 /* forall<e> (3583, (3584) -> e ()) -> e () */ ) {
      return keyed_spec_fs__mlift_copy_10298(_c_x10180, _this, keyed_children, keyed_compare, keyed_item_equals, keyed_key, _c_x10182);
    });
  }
  else {
    return keyed_spec_fs__mlift_copy_10298(_c_x10180, _this, keyed_children, keyed_compare, keyed_item_equals, keyed_key, x_10340);
  }
}
 
export function keyed_spec_fs__copy(_this, keyed_read, keyed_walk, keyed_key, keyed_compare, keyed_item_equals, keyed_children) /* forall<e,a,b,c> (keyed-spec<e,a,b,c>, keyed-read : ? (() -> kokaine/reactive/effects/signal-read a), keyed-walk : ? (forall<e1> (a, (b) -> e1 ()) -> e1 ()), keyed-key : ? ((b) -> c), keyed-compare : ? ((c, c) -> order), keyed-item-equals : ? ((b, b) -> bool), keyed-children : ? ((item : accessor<b>, index : accessor<int>) -> <html<e>,kokaine/reactive/effects/signal-read> ())) -> keyed-spec<e,a,b,c> */  {
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10180 /* () -> kokaine/reactive/effects/signal-read 3583 */ ) {
      return keyed_spec_fs__mlift_copy_10299(_this, keyed_children, keyed_compare, keyed_item_equals, keyed_key, keyed_walk, _c_x10180);
    });
  }
  else {
     
    if (keyed_walk !== undefined) {
      var x_0_10348 = keyed_walk;
    }
    else {
      if ($std_core_hnd._yielding()) {
        var x_0_10348 = $std_core_hnd.yield_extend(function(_c_x10181 /* (3583, (3584) -> 3427 ()) -> 3427 () */ ) {
          return _c_x10181;
        });
      }
      else {
        var _x19 = _this.keyed_walk;
        var x_0_10348 = _x19;
      }
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10182 /* forall<e> (3583, (3584) -> e ()) -> e () */ ) {
        if (keyed_read !== undefined) {
          var _x19 = keyed_read;
        }
        else {
          var _x19 = _this.keyed_read;
        }
        return keyed_spec_fs__mlift_copy_10298(_x19, _this, keyed_children, keyed_compare, keyed_item_equals, keyed_key, _c_x10182);
      });
    }
    else {
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_c_x10184 /* (item : accessor<3584>, index : accessor<int>) -> <html<3582>,kokaine/reactive/effects/signal-read> () */ ) {
          if (keyed_read !== undefined) {
            var _x20 = keyed_read;
          }
          else {
            var _x20 = _this.keyed_read;
          }
          if (keyed_key !== undefined) {
            var _x21 = keyed_key;
          }
          else {
            var _x21 = _this.keyed_key;
          }
          if (keyed_compare !== undefined) {
            var _x22 = keyed_compare;
          }
          else {
            var _x22 = _this.keyed_compare;
          }
          if (keyed_item_equals !== undefined) {
            var _x23 = keyed_item_equals;
          }
          else {
            var _x23 = _this.keyed_item_equals;
          }
          return Keyed_spec(_x20, x_0_10348, _x21, _x22, _x23, _c_x10184);
        });
      }
      else {
        if (keyed_read !== undefined) {
          var _x24 = keyed_read;
        }
        else {
          var _x24 = _this.keyed_read;
        }
        if (keyed_key !== undefined) {
          var _x25 = keyed_key;
        }
        else {
          var _x25 = _this.keyed_key;
        }
        if (keyed_compare !== undefined) {
          var _x26 = keyed_compare;
        }
        else {
          var _x26 = _this.keyed_compare;
        }
        if (keyed_item_equals !== undefined) {
          var _x27 = keyed_item_equals;
        }
        else {
          var _x27 = _this.keyed_item_equals;
        }
        if (keyed_children !== undefined) {
          var _x28 = keyed_children;
        }
        else {
          var _x28 = _this.keyed_children;
        }
        return Keyed_spec(_x24, x_0_10348, _x25, _x26, _x27, _x28);
      }
    }
  }
}
 
export function keyed_plan_fs__copy(_this, plan_spec) /* forall<e,a,b,c> (keyed-plan<e>, plan-spec : keyed-spec<e,a,b,c>) -> keyed-plan<e> */  {
  return Keyed_plan(plan_spec);
}
 
export function internal_fs_pack_keyed_plan(read, walk, key, cmp, item_equals, children) /* forall<a,e,b,c> (read : () -> kokaine/reactive/effects/signal-read c, walk : forall<e1> (c, (a) -> e1 ()) -> e1 (), key : (a) -> b, cmp : (b, b) -> order, item-equals : (a, a) -> bool, children : (item : accessor<a>, index : accessor<int>) -> <html<e>,kokaine/reactive/effects/signal-read> ()) -> keyed-plan<e> */  {
  return Keyed_plan(Keyed_spec(read, walk, key, cmp, item_equals, children));
}
 
 
// monadic lift
export function _mlift_collect_10300(node, nodes, _y_x10185) /* forall<h,e,e1> (node : view<e>, nodes : local-var<h,list<view<e>>>, list<view<e>>) -> <local<h>|e1> () */  {
  return ((nodes).value = ($std_core_types.Cons(node, _y_x10185)));
}
 
 
// monadic lift
export function _mlift_collect_10301(_y_x10187) /* forall<h,e,e1> (list<view<e>>) -> <local<h>|e1> list<view<e>> */  {
  return $std_core_list.reverse_acc($std_core_types.Nil, _y_x10187);
}
 
export function collect(action) /* forall<e,e1> (action : () -> <html<e>|e1> ()) -> e1 list<view<e>> */  {
  return function() {
     
    var loc = { value: ($std_core_types.Nil) };
     
    var res = html_fs__handle(_Hnd_html(1, $std_core_hnd.clause_tail1(function(node /* view<3963> */ ) {
           
          var x_10366 = ((loc).value);
           
          function next_10367(_y_x10185) /* (list<view<3963>>) -> <local<3953>|3964> () */  {
            return ((loc).value = ($std_core_types.Cons(node, _y_x10185)));
          }
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(next_10367);
          }
          else {
            return next_10367(x_10366);
          }
        })), function(__w_l180_c12 /* () */ ) {
         
        var x_0_10371 = ((loc).value);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10187 /* list<view<3963>> */ ) {
            return $std_core_list.reverse_acc($std_core_types.Nil, _y_x10187);
          });
        }
        else {
          return $std_core_list.reverse_acc($std_core_types.Nil, x_0_10371);
        }
      }, action);
    return $std_core_hnd.prompt_local_var(loc, res);
  }();
}
 
 
// monadic lift
export function _mlift_view_10302(_y_x10192) /* forall<e,e1> (list<view<e>>) -> e1 view<e> */  {
  if (_y_x10192 === null) {
    return Empty;
  }
  else if (_y_x10192 !== null && _y_x10192.tail === null) {
    return _y_x10192.head;
  }
  else {
    return Fragment(_y_x10192);
  }
}
 
export function view(action) /* forall<e,e1> (action : () -> <html<e>|e1> ()) -> e1 view<e> */  {
   
  var x_10375 = collect(action);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10192 /* list<view<4016>> */ ) {
      if (_y_x10192 === null) {
        return Empty;
      }
      else if (_y_x10192 !== null && _y_x10192.tail === null) {
        return _y_x10192.head;
      }
      else {
        return Fragment(_y_x10192);
      }
    });
  }
  else {
    if (x_10375 === null) {
      return Empty;
    }
    else if (x_10375 !== null && x_10375.tail === null) {
      return x_10375.head;
    }
    else {
      return Fragment(x_10375);
    }
  }
}
 
 
// monadic lift
export function _mlift_nested_10303(node, nodes, _y_x10194) /* forall<h,e,e1> (node : view<e>, nodes : local-var<h,list<view<e>>>, list<view<e>>) -> <local<h>,html<e>|e1> () */  {
  return ((nodes).value = ($std_core_types.Cons(node, _y_x10194)));
}
 
 
// monadic lift
export function _mlift_nested_10304(make, _y_x10196) /* forall<h,e,e1> (make : (list<view<e>>) -> view<e>, list<view<e>>) -> <local<h>,html<e>|e1> () */  {
   
  var final_nodes = $std_core_list.reverse_acc($std_core_types.Nil, _y_x10196);
   
  var _x_x1_10292 = $std_core_hnd._open_none1(make, final_nodes);
  return $std_core_hnd._open_at1($std_core_hnd._evv_index(html_fs__tag), function(node_0 /* view<4283> */ ) {
       
      var ev_10379 = $std_core_hnd._evv_at(0);
      return ev_10379.hnd._fun_emit(ev_10379.marker, ev_10379, node_0);
    }, _x_x1_10292);
}
 
 
// monadic lift
export function _mlift_nested_10305(children, _y_x10199) /* forall<h,e,e1> (children : () -> <html<e>|e1> (), hnd/ev-index) -> <html<e>,html<e>,local<h>|e1> () */  {
  return $std_core_hnd._mask_at(_y_x10199, true, children);
}
 
export function nested(make, children) /* forall<e,e1> (make : (list<view<e>>) -> view<e>, children : () -> <html<e>|e1> ()) -> <html<e>|e1> () */  {
  return function() {
     
    var loc = { value: ($std_core_types.Nil) };
     
    var res = html_fs__handle(_Hnd_html(1, $std_core_hnd.clause_tail1(function(node /* view<4283> */ ) {
           
          var x_10385 = ((loc).value);
           
          function next_10386(_y_x10194) /* (list<view<4283>>) -> <local<4273>,html<4283>|4284> () */  {
            return ((loc).value = ($std_core_types.Cons(node, _y_x10194)));
          }
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(next_10386);
          }
          else {
            return next_10386(x_10385);
          }
        })), function(__w_l195_c12 /* () */ ) {
         
        var x_0_10390 = ((loc).value);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10196 /* list<view<4283>> */ ) {
            return _mlift_nested_10304(make, _y_x10196);
          });
        }
        else {
          return _mlift_nested_10304(make, x_0_10390);
        }
      }, function() {
         
        var x_1_10392 = $std_core_hnd._evv_index(html_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10199 /* hnd/ev-index */ ) {
            return $std_core_hnd._mask_at(_y_x10199, true, children);
          });
        }
        else {
          return $std_core_hnd._mask_at(x_1_10392, true, children);
        }
      });
    return $std_core_hnd.prompt_local_var(loc, res);
  }();
}
 
export function container_tag(name_0, attributes, children) /* forall<e,e1> (name : string, attributes : list<attribute<e>>, children : () -> <html<e>|e1> ()) -> <html<e>|e1> () */  {
  return nested(function(nodes /* list<view<4323>> */ ) {
      return Element(name_0, attributes, nodes);
    }, children);
}
 
export function text_tag(name_0, content, attributes) /* forall<e> (name : string, content : string, attributes : list<attribute<e>>) -> (html<e>) () */  {
   
  var ev_10394 = $std_core_hnd._evv_at(0);
  return ev_10394.hnd._fun_emit(ev_10394.marker, ev_10394, Element(name_0, attributes, $std_core_types.Cons(Text(content), $std_core_types.Nil)));
}
 
export function void_fs_element_empty(name_0, attrs) /* forall<e> (name : string, attrs : ? (list<attribute<e>>)) -> (html<e>) () */  {
   
  var ev_10397 = $std_core_hnd._evv_at(0);
  var _x29 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
  return ev_10397.hnd._fun_emit(ev_10397.marker, ev_10397, Element(name_0, _x29, $std_core_types.Nil));
}
 
export function fragment(children) /* forall<e,e1> (children : () -> <html<e>|e1> ()) -> <html<e>|e1> () */  {
  return nested(Fragment, children);
}
 
export function text(content) /* forall<e> (content : string) -> (html<e>) () */  {
   
  var ev_10400 = $std_core_hnd._evv_at(0);
  return ev_10400.hnd._fun_emit(ev_10400.marker, ev_10400, Text(content));
}
 
 
// Static overloading lets static and live text share the plain `text` name.
export function live_fs_text(read) /* forall<e> (read : () -> kokaine/reactive/effects/signal-read string) -> (html<e>) () */  {
   
  var ev_10403 = $std_core_hnd._evv_at(0);
  return ev_10403.hnd._fun_emit(ev_10403.marker, ev_10403, Live_text(read));
}
 
export function emit_region(read) /* forall<e> (read : () -> kokaine/reactive/effects/signal-read view<e>) -> (html<e>) () */  {
   
  var ev_10406 = $std_core_hnd._evv_at(0);
  return ev_10406.hnd._fun_emit(ev_10406.marker, ev_10406, Region(read));
}
 
 
// monadic lift
export function _mlift_dynamic_10306(_y_x10212) /* forall<e> (list<view<e>>) -> kokaine/reactive/effects/signal-read view<e> */  {
  if (_y_x10212 === null) {
    return Empty;
  }
  else if (_y_x10212 !== null && _y_x10212.tail === null) {
    return _y_x10212.head;
  }
  else {
    return Fragment(_y_x10212);
  }
}
 
 
// Dynamic structure reads signals and rebuilds just this region.
export function dynamic(children) /* forall<e> (children : () -> <html<e>,kokaine/reactive/effects/signal-read> ()) -> (html<e>) () */  {
   
  var ev_10409 = $std_core_hnd._evv_at(0);
  return ev_10409.hnd._fun_emit(ev_10409.marker, ev_10409, Region(function() {
       
      var x_0_10412 = collect(children);
       
      function next_10413(_y_x10212) /* (list<view<4564>>) -> kokaine/reactive/effects/signal-read view<4564> */  {
        if (_y_x10212 === null) {
          return Empty;
        }
        else if (_y_x10212 !== null && _y_x10212.tail === null) {
          return _y_x10212.head;
        }
        else {
          return Fragment(_y_x10212);
        }
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(next_10413);
      }
      else {
        return next_10413(x_0_10412);
      }
    }));
}
 
 
// Constructor bridge used by `kokaine/control`; the packed plan keeps browser
// values out of the backend-neutral HTML layer.
export function keyed(plan) /* forall<e> (plan : keyed-plan<e>) -> (html<e>) () */  {
   
  var ev_10415 = $std_core_hnd._evv_at(0);
  return ev_10415.hnd._fun_emit(ev_10415.marker, ev_10415, Keyed_region(plan));
}
 
export function trusted(content) /* forall<e> (content : trusted-html) -> (html<e>) () */  {
   
  var ev_10418 = $std_core_hnd._evv_at(0);
  return ev_10418.hnd._fun_emit(ev_10418.marker, ev_10418, Raw_html(content));
}
 
export function attr(name_0, value_0) /* forall<e> (name : string, value : string) -> attribute<e> */  {
  return Attribute(name_0, value_0);
}
 
export function attr_if(name_0, enabled) /* forall<e> (name : string, enabled : bool) -> attribute<e> */  {
  return Boolean_attribute(name_0, enabled);
}
 
export function live_fs_attr(name_0, read) /* forall<e> (name : string, read : () -> kokaine/reactive/effects/signal-read maybe<string>) -> attribute<e> */  {
  return Live_attribute(name_0, read);
}
 
 
// monadic lift
export function live_string_fs__mlift_attr_10307(_y_x10217) /* (string) -> kokaine/reactive/effects/signal-read maybe<string> */  {
  return $std_core_types.Just(_y_x10217);
}
 
export function live_string_fs_attr(name_0, read) /* forall<e> (name : string, read : () -> kokaine/reactive/effects/signal-read string) -> attribute<e> */  {
  return Live_attribute(name_0, function() {
       
      var x_10421 = read();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(live_string_fs__mlift_attr_10307);
      }
      else {
        return $std_core_types.Just(x_10421);
      }
    });
}
 
export function prop(name_0, value_0) /* forall<e> (name : string, value : property-value) -> attribute<e> */  {
  return Property(name_0, value_0);
}
 
export function live_fs_prop(name_0, read) /* forall<e> (name : string, read : () -> kokaine/reactive/effects/signal-read property-value) -> attribute<e> */  {
  return Live_property(name_0, read);
}
 
export function string_property(value_0) /* (value : string) -> property-value */  {
  return String_property(value_0);
}
 
export function bool_property(value_0) /* (value : bool) -> property-value */  {
  return Bool_property(value_0);
}
 
export function int_property(value_0) /* (value : int) -> property-value */  {
  return Int_property(value_0);
}
 
 
// Closed event handlers may read/write signals and use the explicitly supported
// DOM and Koka exception capabilities. Other effects must be handled inside
// `action`.
export function on(name_0, action) /* forall<e> (name : string, action : callback) -> attribute<e> */  {
  return Listener(name_0, action);
}
 
 
// monadic lift
export function _mlift_on_write_10308(action, ev, _y_x10223) /* (action : (event) -> kokaine/reactive/effects/signal-write (), ev : event, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-write,kokaine/async/effects/async-ownership> () */  {
  return $std_core_hnd._mask_at(_y_x10223, false, function() {
      return $std_core_hnd._open_at1(1, action, ev);
    });
}
 
 
// monadic lift
export function _mlift_on_write_10309(action, ev, _y_x10222) /* (action : (event) -> kokaine/reactive/effects/signal-write (), ev : event, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui,kokaine/async/effects/async-ownership> () */  {
  return $std_core_hnd._mask_at(_y_x10222, false, function() {
       
      var x_10425 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10223 /* hnd/ev-index */ ) {
          return _mlift_on_write_10308(action, ev, _y_x10223);
        });
      }
      else {
        return _mlift_on_write_10308(action, ev, x_10425);
      }
    });
}
 
 
// monadic lift
export function _mlift_on_write_10310(action, ev, _y_x10221) /* (action : (event) -> kokaine/reactive/effects/signal-write (), ev : event, hnd/ev-index) -> <kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui,kokaine/async/effects/async-ownership> () */  {
  return $std_core_hnd._mask_at(_y_x10221, false, function() {
       
      var x_10427 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10222 /* hnd/ev-index */ ) {
          return _mlift_on_write_10309(action, ev, _y_x10222);
        });
      }
      else {
        return _mlift_on_write_10309(action, ev, x_10427);
      }
    });
}
 
 
// monadic lift
export function _mlift_on_write_10311(action, ev, _y_x10220) /* (action : (event) -> kokaine/reactive/effects/signal-write (), ev : event, hnd/ev-index) -> <kokaine/async/effects/async-ioc,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui,kokaine/async/effects/async-ownership> () */  {
  return $std_core_hnd._mask_at(_y_x10220, false, function() {
       
      var x_10429 = $std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10221 /* hnd/ev-index */ ) {
          return _mlift_on_write_10310(action, ev, _y_x10221);
        });
      }
      else {
        return _mlift_on_write_10310(action, ev, x_10429);
      }
    });
}
 
 
// monadic lift
export function _mlift_on_write_10312(action, ev, _y_x10219) /* (action : (event) -> kokaine/reactive/effects/signal-write (), ev : event, hnd/ev-index) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui,kokaine/async/effects/async-ownership> () */  {
  return $std_core_hnd._mask_at(_y_x10219, false, function() {
       
      var x_10431 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10220 /* hnd/ev-index */ ) {
          return _mlift_on_write_10311(action, ev, _y_x10220);
        });
      }
      else {
        return _mlift_on_write_10311(action, ev, x_10431);
      }
    });
}
 
 
// monadic lift
export function _mlift_on_write_10313(action, ev, _y_x10218) /* (action : (event) -> kokaine/reactive/effects/signal-write (), ev : event, hnd/ev-index) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui,kokaine/async/effects/async-ownership> () */  {
  return $std_core_hnd._mask_at(_y_x10218, false, function() {
       
      var x_10433 = $std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10219 /* hnd/ev-index */ ) {
          return _mlift_on_write_10312(action, ev, _y_x10219);
        });
      }
      else {
        return _mlift_on_write_10312(action, ev, x_10433);
      }
    });
}
 
 
// Most controls only write. This adapter injects the unused read and framework
// failure capabilities so call sites retain the smallest meaningful effect.
export function on_write(name_0, action) /* forall<e> (name : string, action : (event) -> kokaine/reactive/effects/signal-write ()) -> attribute<e> */  {
  return Listener(name_0, function(ev /* event */ ) {
       
      var x_10435 = $std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10218 /* hnd/ev-index */ ) {
          return _mlift_on_write_10313(action, ev, _y_x10218);
        });
      }
      else {
        return _mlift_on_write_10313(action, ev, x_10435);
      }
    });
}
 
export function id(value_0) /* forall<e> (value : string) -> attribute<e> */  {
  return Attribute("id", value_0);
}
 
 
// monadic lift
export function live_fs__mlift_id_10314(_y_x10233) /* (string) -> kokaine/reactive/effects/signal-read maybe<string> */  {
  return $std_core_types.Just(_y_x10233);
}
 
export function live_fs_id(read) /* forall<e> (read : () -> kokaine/reactive/effects/signal-read string) -> attribute<e> */  {
  return Live_attribute("id", function() {
       
      var x_10437 = read();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(live_fs__mlift_id_10314);
      }
      else {
        return $std_core_types.Just(x_10437);
      }
    });
}
 
export function $class(value_0) /* forall<e> (value : string) -> attribute<e> */  {
  return Attribute("class", value_0);
}
 
 
// monadic lift
export function live_fs__mlift_class_10315(_y_x10234) /* (string) -> kokaine/reactive/effects/signal-read maybe<string> */  {
  return $std_core_types.Just(_y_x10234);
}
 
export function live_fs_class(read) /* forall<e> (read : () -> kokaine/reactive/effects/signal-read string) -> attribute<e> */  {
  return Live_attribute("class", function() {
       
      var x_10439 = read();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(live_fs__mlift_class_10315);
      }
      else {
        return $std_core_types.Just(x_10439);
      }
    });
}
 
export function title(value_0) /* forall<e> (value : string) -> attribute<e> */  {
  return Attribute("title", value_0);
}
 
 
// monadic lift
export function live_fs__mlift_title_10316(_y_x10235) /* (string) -> kokaine/reactive/effects/signal-read maybe<string> */  {
  return $std_core_types.Just(_y_x10235);
}
 
export function live_fs_title(read) /* forall<e> (read : () -> kokaine/reactive/effects/signal-read string) -> attribute<e> */  {
  return Live_attribute("title", function() {
       
      var x_10441 = read();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(live_fs__mlift_title_10316);
      }
      else {
        return $std_core_types.Just(x_10441);
      }
    });
}
 
export function href(value_0) /* forall<e> (value : string) -> attribute<e> */  {
  return Attribute("href", value_0);
}
 
 
// monadic lift
export function live_fs__mlift_href_10317(_y_x10236) /* (string) -> kokaine/reactive/effects/signal-read maybe<string> */  {
  return $std_core_types.Just(_y_x10236);
}
 
export function live_fs_href(read) /* forall<e> (read : () -> kokaine/reactive/effects/signal-read string) -> attribute<e> */  {
  return Live_attribute("href", function() {
       
      var x_10443 = read();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(live_fs__mlift_href_10317);
      }
      else {
        return $std_core_types.Just(x_10443);
      }
    });
}
 
export function kind(value_0) /* forall<e> (value : string) -> attribute<e> */  {
  return Attribute("type", value_0);
}
 
 
// monadic lift
export function live_fs__mlift_kind_10318(_y_x10237) /* (string) -> kokaine/reactive/effects/signal-read maybe<string> */  {
  return $std_core_types.Just(_y_x10237);
}
 
export function live_fs_kind(read) /* forall<e> (read : () -> kokaine/reactive/effects/signal-read string) -> attribute<e> */  {
  return Live_attribute("type", function() {
       
      var x_10445 = read();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(live_fs__mlift_kind_10318);
      }
      else {
        return $std_core_types.Just(x_10445);
      }
    });
}
 
export function name(value_0) /* forall<e> (value : string) -> attribute<e> */  {
  return Attribute("name", value_0);
}
 
 
// monadic lift
export function live_fs__mlift_name_10319(_y_x10238) /* (string) -> kokaine/reactive/effects/signal-read maybe<string> */  {
  return $std_core_types.Just(_y_x10238);
}
 
export function live_fs_name(read) /* forall<e> (read : () -> kokaine/reactive/effects/signal-read string) -> attribute<e> */  {
  return Live_attribute("name", function() {
       
      var x_10447 = read();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(live_fs__mlift_name_10319);
      }
      else {
        return $std_core_types.Just(x_10447);
      }
    });
}
 
export function placeholder(value_0) /* forall<e> (value : string) -> attribute<e> */  {
  return Attribute("placeholder", value_0);
}
 
 
// monadic lift
export function live_fs__mlift_placeholder_10320(_y_x10239) /* (string) -> kokaine/reactive/effects/signal-read maybe<string> */  {
  return $std_core_types.Just(_y_x10239);
}
 
export function live_fs_placeholder(read) /* forall<e> (read : () -> kokaine/reactive/effects/signal-read string) -> attribute<e> */  {
  return Live_attribute("placeholder", function() {
       
      var x_10449 = read();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(live_fs__mlift_placeholder_10320);
      }
      else {
        return $std_core_types.Just(x_10449);
      }
    });
}
 
export function role(value_0) /* forall<e> (value : string) -> attribute<e> */  {
  return Attribute("role", value_0);
}
 
 
// monadic lift
export function live_fs__mlift_role_10321(_y_x10240) /* (string) -> kokaine/reactive/effects/signal-read maybe<string> */  {
  return $std_core_types.Just(_y_x10240);
}
 
export function live_fs_role(read) /* forall<e> (read : () -> kokaine/reactive/effects/signal-read string) -> attribute<e> */  {
  return Live_attribute("role", function() {
       
      var x_10451 = read();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(live_fs__mlift_role_10321);
      }
      else {
        return $std_core_types.Just(x_10451);
      }
    });
}
 
export function aria(label, value_0) /* forall<e> (label : string, value : string) -> attribute<e> */  {
   
  var name_0_10041 = $std_core_types._lp__plus__plus__rp_("aria-", label);
  return Attribute(name_0_10041, value_0);
}
 
 
// monadic lift
export function live_fs__mlift_aria_10322(_y_x10241) /* (string) -> kokaine/reactive/effects/signal-read maybe<string> */  {
  return $std_core_types.Just(_y_x10241);
}
 
export function live_fs_aria(label, read) /* forall<e> (label : string, read : () -> kokaine/reactive/effects/signal-read string) -> attribute<e> */  {
  return Live_attribute($std_core_types._lp__plus__plus__rp_("aria-", label), function() {
       
      var x_10453 = read();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(live_fs__mlift_aria_10322);
      }
      else {
        return $std_core_types.Just(x_10453);
      }
    });
}
 
export function data(label, value_0) /* forall<e> (label : string, value : string) -> attribute<e> */  {
   
  var name_0_10043 = $std_core_types._lp__plus__plus__rp_("data-", label);
  return Attribute(name_0_10043, value_0);
}
 
 
// monadic lift
export function live_fs__mlift_data_10323(_y_x10242) /* (string) -> kokaine/reactive/effects/signal-read maybe<string> */  {
  return $std_core_types.Just(_y_x10242);
}
 
export function live_fs_data(label, read) /* forall<e> (label : string, read : () -> kokaine/reactive/effects/signal-read string) -> attribute<e> */  {
  return Live_attribute($std_core_types._lp__plus__plus__rp_("data-", label), function() {
       
      var x_10455 = read();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(live_fs__mlift_data_10323);
      }
      else {
        return $std_core_types.Just(x_10455);
      }
    });
}
 
export function value(value_0) /* forall<e> (value : string) -> attribute<e> */  {
  return Property("value", String_property(value_0));
}
 
 
// monadic lift
export function live_fs__mlift_value_10324(_y_x10243) /* (string) -> kokaine/reactive/effects/signal-read property-value */  {
  return String_property(_y_x10243);
}
 
export function live_fs_value(read) /* forall<e> (read : () -> kokaine/reactive/effects/signal-read string) -> attribute<e> */  {
  return Live_property("value", function() {
       
      var x_10457 = read();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(live_fs__mlift_value_10324);
      }
      else {
        return String_property(x_10457);
      }
    });
}
 
export function checked(value_0) /* forall<e> (value : bool) -> attribute<e> */  {
  return Property("checked", Bool_property(value_0));
}
 
 
// monadic lift
export function live_fs__mlift_checked_10325(_y_x10244) /* (bool) -> kokaine/reactive/effects/signal-read property-value */  {
  return Bool_property(_y_x10244);
}
 
export function live_fs_checked(read) /* forall<e> (read : () -> kokaine/reactive/effects/signal-read bool) -> attribute<e> */  {
  return Live_property("checked", function() {
       
      var x_10459 = read();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(live_fs__mlift_checked_10325);
      }
      else {
        return Bool_property(x_10459);
      }
    });
}
 
export function disabled(value_0) /* forall<e> (value : bool) -> attribute<e> */  {
  return Boolean_attribute("disabled", value_0);
}
 
 
// monadic lift
export function live_fs__mlift_disabled_10326(_y_x10245) /* (bool) -> kokaine/reactive/effects/signal-read maybe<string> */  {
  if (_y_x10245) {
    return $std_core_types.Just("");
  }
  else {
    return $std_core_types.Nothing;
  }
}
 
export function live_fs_disabled(read) /* forall<e> (read : () -> kokaine/reactive/effects/signal-read bool) -> attribute<e> */  {
  return Live_attribute("disabled", function() {
       
      var x_10461 = read();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(live_fs__mlift_disabled_10326);
      }
      else {
        if (x_10461) {
          return $std_core_types.Just("");
        }
        else {
          return $std_core_types.Nothing;
        }
      }
    });
}
 
export function popover(mode) /* forall<e> (mode : ? popover-mode) -> attribute<e> */  {
  if (mode !== undefined) {
    if (mode === 1) {
      var _x30 = "auto";
    }
    else if (mode === 2) {
      var _x30 = "manual";
    }
    else {
      var _x30 = "hint";
    }
  }
  else {
    var _x30 = "auto";
  }
  return Attribute("popover", _x30);
}
 
export function popover_target(id_0) /* forall<e> (id : string) -> attribute<e> */  {
  return Attribute("popovertarget", id_0);
}
 
export function popover_target_action(action) /* forall<e> (action : popover-target-action) -> attribute<e> */  {
  if (action === 1) {
    var _x31 = "toggle";
  }
  else if (action === 2) {
    var _x31 = "show";
  }
  else {
    var _x31 = "hide";
  }
  return Attribute("popovertargetaction", _x31);
}
 
 
// A form with this method closes its containing dialog without navigation.
export function dialog_form_method() /* forall<e> () -> attribute<e> */  {
  return Attribute("method", "dialog");
}
 
export function autofocus() /* forall<e> () -> attribute<e> */  {
  return Boolean_attribute("autofocus", true);
}
 
export function dialog_closed_by(policy) /* forall<e> (policy : dialog-close-policy) -> attribute<e> */  {
  if (policy === 1) {
    var _x32 = "any";
  }
  else if (policy === 2) {
    var _x32 = "closerequest";
  }
  else {
    var _x32 = "none";
  }
  return Attribute("closedby", _x32);
}
 
export function on_click(action) /* forall<e> (action : (event) -> kokaine/reactive/effects/signal-write ()) -> attribute<e> */  {
  return Listener("click", function(ev /* event */ ) {
       
      var x_10435 = $std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10218 /* hnd/ev-index */ ) {
          return _mlift_on_write_10313(action, ev, _y_x10218);
        });
      }
      else {
        return _mlift_on_write_10313(action, ev, x_10435);
      }
    });
}
 
export function on_input(action) /* forall<e> (action : (string) -> kokaine/reactive/effects/signal-write ()) -> attribute<e> */  {
  return Listener("input", function(ev /* event */ ) {
       
      var x_10435 = $std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag);
       
      function next_10436(_y_x10218) /* (hnd/ev-index) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui,kokaine/async/effects/async-ownership> () */  {
        return _mlift_on_write_10313(function(ev_0 /* event */ ) {
            return action($std_core_hnd._open_none1(function(event /* event */ ) {
                return event.value;
              }, ev_0));
          }, ev, _y_x10218);
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(next_10436);
      }
      else {
        return next_10436(x_10435);
      }
    });
}
 
export function on_change(action) /* forall<e> (action : (event) -> kokaine/reactive/effects/signal-write ()) -> attribute<e> */  {
  return Listener("change", function(ev /* event */ ) {
       
      var x_10435 = $std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10218 /* hnd/ev-index */ ) {
          return _mlift_on_write_10313(action, ev, _y_x10218);
        });
      }
      else {
        return _mlift_on_write_10313(action, ev, x_10435);
      }
    });
}
 
export function block_fs_element(name_0, children, attrs) /* forall<e,e1> (name : string, children : () -> <html<e>|e1> (), attrs : ? (list<attribute<e>>)) -> <html<e>|e1> () */  {
  return nested(function(nodes /* list<view<6067>> */ ) {
      var _x33 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
      return Element(name_0, _x33, nodes);
    }, children);
}
 
export function string_fs_element(name_0, content, attrs) /* forall<e> (name : string, content : string, attrs : ? (list<attribute<e>>)) -> (html<e>) () */  {
   
  var ev_10463 = $std_core_hnd._evv_at(0);
  var _x34 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
  return ev_10463.hnd._fun_emit(ev_10463.marker, ev_10463, Element(name_0, _x34, $std_core_types.Cons(Text(content), $std_core_types.Nil)));
}
 
export function block_fs_div(children, attrs) /* forall<e,e1> (children : () -> <html<e>|e1> (), attrs : ? (list<attribute<e>>)) -> <html<e>|e1> () */  {
  return nested(function(nodes /* list<view<6131>> */ ) {
      var _x35 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
      return Element("div", _x35, nodes);
    }, children);
}
 
export function string_fs_div(content, attrs) /* forall<e> (content : string, attrs : ? (list<attribute<e>>)) -> (html<e>) () */  {
   
  var ev_10466 = $std_core_hnd._evv_at(0);
  var _x36 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
  return ev_10466.hnd._fun_emit(ev_10466.marker, ev_10466, Element("div", _x36, $std_core_types.Cons(Text(content), $std_core_types.Nil)));
}
 
export function block_fs_span(children, attrs) /* forall<e,e1> (children : () -> <html<e>|e1> (), attrs : ? (list<attribute<e>>)) -> <html<e>|e1> () */  {
  return nested(function(nodes /* list<view<6195>> */ ) {
      var _x37 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
      return Element("span", _x37, nodes);
    }, children);
}
 
export function string_fs_span(content, attrs) /* forall<e> (content : string, attrs : ? (list<attribute<e>>)) -> (html<e>) () */  {
   
  var ev_10469 = $std_core_hnd._evv_at(0);
  var _x38 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
  return ev_10469.hnd._fun_emit(ev_10469.marker, ev_10469, Element("span", _x38, $std_core_types.Cons(Text(content), $std_core_types.Nil)));
}
 
export function block_fs_main_tag(children, attrs) /* forall<e,e1> (children : () -> <html<e>|e1> (), attrs : ? (list<attribute<e>>)) -> <html<e>|e1> () */  {
  return nested(function(nodes /* list<view<6259>> */ ) {
      var _x39 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
      return Element("main", _x39, nodes);
    }, children);
}
 
export function string_fs_main_tag(content, attrs) /* forall<e> (content : string, attrs : ? (list<attribute<e>>)) -> (html<e>) () */  {
   
  var ev_10472 = $std_core_hnd._evv_at(0);
  var _x40 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
  return ev_10472.hnd._fun_emit(ev_10472.marker, ev_10472, Element("main", _x40, $std_core_types.Cons(Text(content), $std_core_types.Nil)));
}
 
export function block_fs_section(children, attrs) /* forall<e,e1> (children : () -> <html<e>|e1> (), attrs : ? (list<attribute<e>>)) -> <html<e>|e1> () */  {
  return nested(function(nodes /* list<view<6323>> */ ) {
      var _x41 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
      return Element("section", _x41, nodes);
    }, children);
}
 
export function string_fs_section(content, attrs) /* forall<e> (content : string, attrs : ? (list<attribute<e>>)) -> (html<e>) () */  {
   
  var ev_10475 = $std_core_hnd._evv_at(0);
  var _x42 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
  return ev_10475.hnd._fun_emit(ev_10475.marker, ev_10475, Element("section", _x42, $std_core_types.Cons(Text(content), $std_core_types.Nil)));
}
 
export function block_fs_header(children, attrs) /* forall<e,e1> (children : () -> <html<e>|e1> (), attrs : ? (list<attribute<e>>)) -> <html<e>|e1> () */  {
  return nested(function(nodes /* list<view<6387>> */ ) {
      var _x43 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
      return Element("header", _x43, nodes);
    }, children);
}
 
export function string_fs_header(content, attrs) /* forall<e> (content : string, attrs : ? (list<attribute<e>>)) -> (html<e>) () */  {
   
  var ev_10478 = $std_core_hnd._evv_at(0);
  var _x44 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
  return ev_10478.hnd._fun_emit(ev_10478.marker, ev_10478, Element("header", _x44, $std_core_types.Cons(Text(content), $std_core_types.Nil)));
}
 
export function block_fs_footer(children, attrs) /* forall<e,e1> (children : () -> <html<e>|e1> (), attrs : ? (list<attribute<e>>)) -> <html<e>|e1> () */  {
  return nested(function(nodes /* list<view<6451>> */ ) {
      var _x45 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
      return Element("footer", _x45, nodes);
    }, children);
}
 
export function string_fs_footer(content, attrs) /* forall<e> (content : string, attrs : ? (list<attribute<e>>)) -> (html<e>) () */  {
   
  var ev_10481 = $std_core_hnd._evv_at(0);
  var _x46 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
  return ev_10481.hnd._fun_emit(ev_10481.marker, ev_10481, Element("footer", _x46, $std_core_types.Cons(Text(content), $std_core_types.Nil)));
}
 
export function block_fs_h1(children, attrs) /* forall<e,e1> (children : () -> <html<e>|e1> (), attrs : ? (list<attribute<e>>)) -> <html<e>|e1> () */  {
  return nested(function(nodes /* list<view<6515>> */ ) {
      var _x47 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
      return Element("h1", _x47, nodes);
    }, children);
}
 
export function string_fs_h1(content, attrs) /* forall<e> (content : string, attrs : ? (list<attribute<e>>)) -> (html<e>) () */  {
   
  var ev_10484 = $std_core_hnd._evv_at(0);
  var _x48 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
  return ev_10484.hnd._fun_emit(ev_10484.marker, ev_10484, Element("h1", _x48, $std_core_types.Cons(Text(content), $std_core_types.Nil)));
}
 
export function block_fs_h2(children, attrs) /* forall<e,e1> (children : () -> <html<e>|e1> (), attrs : ? (list<attribute<e>>)) -> <html<e>|e1> () */  {
  return nested(function(nodes /* list<view<6579>> */ ) {
      var _x49 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
      return Element("h2", _x49, nodes);
    }, children);
}
 
export function string_fs_h2(content, attrs) /* forall<e> (content : string, attrs : ? (list<attribute<e>>)) -> (html<e>) () */  {
   
  var ev_10487 = $std_core_hnd._evv_at(0);
  var _x50 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
  return ev_10487.hnd._fun_emit(ev_10487.marker, ev_10487, Element("h2", _x50, $std_core_types.Cons(Text(content), $std_core_types.Nil)));
}
 
export function block_fs_p(children, attrs) /* forall<e,e1> (children : () -> <html<e>|e1> (), attrs : ? (list<attribute<e>>)) -> <html<e>|e1> () */  {
  return nested(function(nodes /* list<view<6643>> */ ) {
      var _x51 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
      return Element("p", _x51, nodes);
    }, children);
}
 
export function string_fs_p(content, attrs) /* forall<e> (content : string, attrs : ? (list<attribute<e>>)) -> (html<e>) () */  {
   
  var ev_10490 = $std_core_hnd._evv_at(0);
  var _x52 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
  return ev_10490.hnd._fun_emit(ev_10490.marker, ev_10490, Element("p", _x52, $std_core_types.Cons(Text(content), $std_core_types.Nil)));
}
 
export function block_fs_strong(children, attrs) /* forall<e,e1> (children : () -> <html<e>|e1> (), attrs : ? (list<attribute<e>>)) -> <html<e>|e1> () */  {
  return nested(function(nodes /* list<view<6707>> */ ) {
      var _x53 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
      return Element("strong", _x53, nodes);
    }, children);
}
 
export function string_fs_strong(content, attrs) /* forall<e> (content : string, attrs : ? (list<attribute<e>>)) -> (html<e>) () */  {
   
  var ev_10493 = $std_core_hnd._evv_at(0);
  var _x54 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
  return ev_10493.hnd._fun_emit(ev_10493.marker, ev_10493, Element("strong", _x54, $std_core_types.Cons(Text(content), $std_core_types.Nil)));
}
 
export function block_fs_ul(children, attrs) /* forall<e,e1> (children : () -> <html<e>|e1> (), attrs : ? (list<attribute<e>>)) -> <html<e>|e1> () */  {
  return nested(function(nodes /* list<view<6771>> */ ) {
      var _x55 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
      return Element("ul", _x55, nodes);
    }, children);
}
 
export function string_fs_ul(content, attrs) /* forall<e> (content : string, attrs : ? (list<attribute<e>>)) -> (html<e>) () */  {
   
  var ev_10496 = $std_core_hnd._evv_at(0);
  var _x56 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
  return ev_10496.hnd._fun_emit(ev_10496.marker, ev_10496, Element("ul", _x56, $std_core_types.Cons(Text(content), $std_core_types.Nil)));
}
 
export function block_fs_ol(children, attrs) /* forall<e,e1> (children : () -> <html<e>|e1> (), attrs : ? (list<attribute<e>>)) -> <html<e>|e1> () */  {
  return nested(function(nodes /* list<view<6835>> */ ) {
      var _x57 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
      return Element("ol", _x57, nodes);
    }, children);
}
 
export function string_fs_ol(content, attrs) /* forall<e> (content : string, attrs : ? (list<attribute<e>>)) -> (html<e>) () */  {
   
  var ev_10499 = $std_core_hnd._evv_at(0);
  var _x58 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
  return ev_10499.hnd._fun_emit(ev_10499.marker, ev_10499, Element("ol", _x58, $std_core_types.Cons(Text(content), $std_core_types.Nil)));
}
 
export function block_fs_li(children, attrs) /* forall<e,e1> (children : () -> <html<e>|e1> (), attrs : ? (list<attribute<e>>)) -> <html<e>|e1> () */  {
  return nested(function(nodes /* list<view<6899>> */ ) {
      var _x59 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
      return Element("li", _x59, nodes);
    }, children);
}
 
export function string_fs_li(content, attrs) /* forall<e> (content : string, attrs : ? (list<attribute<e>>)) -> (html<e>) () */  {
   
  var ev_10502 = $std_core_hnd._evv_at(0);
  var _x60 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
  return ev_10502.hnd._fun_emit(ev_10502.marker, ev_10502, Element("li", _x60, $std_core_types.Cons(Text(content), $std_core_types.Nil)));
}
 
export function block_fs_button(children, attrs) /* forall<e,e1> (children : () -> <html<e>|e1> (), attrs : ? (list<attribute<e>>)) -> <html<e>|e1> () */  {
  return nested(function(nodes /* list<view<6963>> */ ) {
      var _x61 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
      return Element("button", _x61, nodes);
    }, children);
}
 
export function string_fs_button(content, attrs) /* forall<e> (content : string, attrs : ? (list<attribute<e>>)) -> (html<e>) () */  {
   
  var ev_10505 = $std_core_hnd._evv_at(0);
  var _x62 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
  return ev_10505.hnd._fun_emit(ev_10505.marker, ev_10505, Element("button", _x62, $std_core_types.Cons(Text(content), $std_core_types.Nil)));
}
 
export function block_fs_dialog(children, attrs) /* forall<e,e1> (children : () -> <html<e>|e1> (), attrs : ? (list<attribute<e>>)) -> <html<e>|e1> () */  {
  return nested(function(nodes /* list<view<7027>> */ ) {
      var _x63 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
      return Element("dialog", _x63, nodes);
    }, children);
}
 
export function string_fs_dialog(content, attrs) /* forall<e> (content : string, attrs : ? (list<attribute<e>>)) -> (html<e>) () */  {
   
  var ev_10508 = $std_core_hnd._evv_at(0);
  var _x64 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
  return ev_10508.hnd._fun_emit(ev_10508.marker, ev_10508, Element("dialog", _x64, $std_core_types.Cons(Text(content), $std_core_types.Nil)));
}
 
export function block_fs_label(children, attrs) /* forall<e,e1> (children : () -> <html<e>|e1> (), attrs : ? (list<attribute<e>>)) -> <html<e>|e1> () */  {
  return nested(function(nodes /* list<view<7091>> */ ) {
      var _x65 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
      return Element("label", _x65, nodes);
    }, children);
}
 
export function string_fs_label(content, attrs) /* forall<e> (content : string, attrs : ? (list<attribute<e>>)) -> (html<e>) () */  {
   
  var ev_10511 = $std_core_hnd._evv_at(0);
  var _x66 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
  return ev_10511.hnd._fun_emit(ev_10511.marker, ev_10511, Element("label", _x66, $std_core_types.Cons(Text(content), $std_core_types.Nil)));
}
 
export function block_fs_a(children, attrs) /* forall<e,e1> (children : () -> <html<e>|e1> (), attrs : ? (list<attribute<e>>)) -> <html<e>|e1> () */  {
  return nested(function(nodes /* list<view<7155>> */ ) {
      var _x67 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
      return Element("a", _x67, nodes);
    }, children);
}
 
export function string_fs_a(content, attrs) /* forall<e> (content : string, attrs : ? (list<attribute<e>>)) -> (html<e>) () */  {
   
  var ev_10514 = $std_core_hnd._evv_at(0);
  var _x68 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
  return ev_10514.hnd._fun_emit(ev_10514.marker, ev_10514, Element("a", _x68, $std_core_types.Cons(Text(content), $std_core_types.Nil)));
}
 
export function void_fs_input(attrs) /* forall<e> (attrs : ? (list<attribute<e>>)) -> (html<e>) () */  {
   
  var ev_10517 = $std_core_hnd._evv_at(0);
  var _x69 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
  return ev_10517.hnd._fun_emit(ev_10517.marker, ev_10517, Element("input", _x69, $std_core_types.Nil));
}
 
export function void_fs_hr(attrs) /* forall<e> (attrs : ? (list<attribute<e>>)) -> (html<e>) () */  {
   
  var ev_10520 = $std_core_hnd._evv_at(0);
  var _x70 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
  return ev_10520.hnd._fun_emit(ev_10520.marker, ev_10520, Element("hr", _x70, $std_core_types.Nil));
}
 
export function void_fs_br(attrs) /* forall<e> (attrs : ? (list<attribute<e>>)) -> (html<e>) () */  {
   
  var ev_10523 = $std_core_hnd._evv_at(0);
  var _x71 = (attrs !== undefined) ? attrs : $std_core_types.Nil;
  return ev_10523.hnd._fun_emit(ev_10523.marker, ev_10523, Element("br", _x71, $std_core_types.Nil));
}