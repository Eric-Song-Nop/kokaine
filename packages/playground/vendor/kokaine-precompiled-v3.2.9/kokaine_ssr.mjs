// Koka generated module: kokaine/ssr, koka version: 3.2.9
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
import * as $kokaine_reactive_effects from './kokaine_reactive_effects.mjs';
import * as $std_core from './std_core.mjs';
import * as $kokaine_reactive from './kokaine_reactive.mjs';
import * as $kokaine_html from './kokaine_html.mjs';
import * as $kokaine_internal_key_dash_index from './kokaine_internal_key_dash_index.mjs';
import * as $std_core_unsafe from './std_core_unsafe.mjs';
import * as $kokaine_async_effects from './kokaine_async_effects.mjs';
 
// externals
 
// type declarations
 
// declarations
 
export function render_cell(value) /* forall<a> (value : a) -> ref<global,a> */  {
  return { value: value };
}
 
export function render_load(value) /* forall<a> (value : ref<global,a>) -> a */  {
  return (value).value;
}
 
export function render_store(target, value) /* forall<a> (target : ref<global,a>, value : a) -> () */  {
  return ((target).value = value);
}
 
export function escape_text(value) /* (value : string) -> string */  {
  return $std_core_string.replace_all($std_core_string.replace_all($std_core_string.replace_all(value, "&", "&amp;"), "<", "&lt;"), ">", "&gt;");
}
 
export function escape_attribute(value) /* (value : string) -> string */  {
  return $std_core_string.replace_all($std_core_string.replace_all($std_core_string.replace_all($std_core_string.replace_all($std_core_string.replace_all(value, "&", "&amp;"), "<", "&lt;"), ">", "&gt;"), "\"", "&quot;"), "\'", "&#39;");
}
 
export function checked_element_name(name) /* (name : string) -> exn string */  {
  var _x0 = $std_core_hnd._open_none1($kokaine_html.is_valid_element_name, name);
  if (_x0) {
    return name;
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("invalid HTML element name: ", name));
  }
}
 
export function checked_attribute_name(name) /* (name : string) -> exn string */  {
  var _x1 = $std_core_hnd._open_none1($kokaine_html.is_valid_attribute_name, name);
  if (_x1) {
    return name;
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("invalid HTML attribute name: ", name));
  }
}
 
export function checked_event_name(name) /* (name : string) -> exn string */  {
  var _x2 = $std_core_hnd._open_none1($kokaine_html.is_valid_event_name, name);
  if (_x2) {
    return name;
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("invalid DOM event name: ", name));
  }
}
 
export function checked_property_name(name) /* (name : string) -> exn string */  {
  var _x3 = $std_core_hnd._open_none1($kokaine_html.is_valid_property_name, name);
  if (_x3) {
    return name;
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("invalid or markup-writing DOM property: ", name));
  }
}
 
 
// // monadic lift
export function _mlift_string_attribute_10160(value, _y_x10018) /* (value : string, string) -> exn string */  {
  return $std_core_types._lp__plus__plus__rp_(" ", $std_core_types._lp__plus__plus__rp_(_y_x10018, $std_core_types._lp__plus__plus__rp_("=\"", $std_core_types._lp__plus__plus__rp_($std_core_hnd._open_none1(escape_attribute, value), "\""))));
}
 
export function string_attribute(name, value) /* (name : string, value : string) -> exn string */  {
   
  var _x_x1_10116 = $std_core_hnd._open_none2($kokaine_html.is_safe_url_value, name, value);
  var _x4 = $std_core_hnd._open_none1(function(b /* bool */ ) {
      return (b) ? false : true;
    }, _x_x1_10116);
  if (_x4) {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("unsafe URL scheme in ", $std_core_types._lp__plus__plus__rp_(name, $std_core_types._lp__plus__plus__rp_("; allowed are relative, http(s), mailto, tel, and data:image for src ", "(use unsafe-trusted-url for an application-produced URL)"))));
  }
  else {
     
    var _x5 = $std_core_hnd._open_none1($kokaine_html.is_valid_attribute_name, name);
    if (_x5) {
      var x_10182 = name;
    }
    else {
      var x_10182 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("invalid HTML attribute name: ", name));
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10018 /* string */ ) {
        return _mlift_string_attribute_10160(value, _y_x10018);
      });
    }
    else {
      return $std_core_types._lp__plus__plus__rp_(" ", $std_core_types._lp__plus__plus__rp_(x_10182, $std_core_types._lp__plus__plus__rp_("=\"", $std_core_types._lp__plus__plus__rp_($std_core_hnd._open_none1(escape_attribute, value), "\""))));
    }
  }
}
 
 
// // monadic lift
export function _mlift_trusted_url_attribute_10161(value, _y_x10020) /* (value : html/trusted-url, string) -> exn string */  {
   
  var value_0_10075 = $std_core_hnd._open_none1(function(value_0_0 /* html/trusted-url */ ) {
      return value_0_0;
    }, value);
  return $std_core_types._lp__plus__plus__rp_(" ", $std_core_types._lp__plus__plus__rp_(_y_x10020, $std_core_types._lp__plus__plus__rp_("=\"", $std_core_types._lp__plus__plus__rp_($std_core_string.replace_all($std_core_string.replace_all($std_core_string.replace_all($std_core_string.replace_all($std_core_string.replace_all(value_0_10075, "&", "&amp;"), "<", "&lt;"), ">", "&gt;"), "\"", "&quot;"), "\'", "&#39;"), "\""))));
}
 
export function trusted_url_attribute(name, value) /* (name : string, value : html/trusted-url) -> exn string */  {
   
  var _x5 = $std_core_hnd._open_none1($kokaine_html.is_valid_attribute_name, name);
  if (_x5) {
    var x_10186 = name;
  }
  else {
    var x_10186 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("invalid HTML attribute name: ", name));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10020 /* string */ ) {
      return _mlift_trusted_url_attribute_10161(value, _y_x10020);
    });
  }
  else {
     
    var value_0_10075 = $std_core_hnd._open_none1(function(value_0_0 /* html/trusted-url */ ) {
        return value_0_0;
      }, value);
    return $std_core_types._lp__plus__plus__rp_(" ", $std_core_types._lp__plus__plus__rp_(x_10186, $std_core_types._lp__plus__plus__rp_("=\"", $std_core_types._lp__plus__plus__rp_($std_core_string.replace_all($std_core_string.replace_all($std_core_string.replace_all($std_core_string.replace_all($std_core_string.replace_all(value_0_10075, "&", "&amp;"), "<", "&lt;"), ">", "&gt;"), "\"", "&quot;"), "\'", "&#39;"), "\""))));
  }
}
 
 
// // monadic lift
export function _mlift_boolean_attribute_10162(_y_x10021) /* (string) -> exn string */  {
  return $std_core_types._lp__plus__plus__rp_(" ", _y_x10021);
}
 
export function boolean_attribute(name, enabled) /* (name : string, enabled : bool) -> exn string */  {
  if (enabled) {
     
    var _x5 = $std_core_hnd._open_none1($kokaine_html.is_valid_attribute_name, name);
    if (_x5) {
      var x_10190 = name;
    }
    else {
      var x_10190 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("invalid HTML attribute name: ", name));
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(_mlift_boolean_attribute_10162);
    }
    else {
      return $std_core_types._lp__plus__plus__rp_(" ", x_10190);
    }
  }
  else {
    return "";
  }
}
 
 
// // monadic lift
export function _mlift_property_attribute_10163(_y_x10025) /* (string) -> exn string */  {
  return $std_core_types._lp__plus__plus__rp_(" ", _y_x10025);
}
 
 
// // monadic lift
export function _mlift_property_attribute_10164(value, safe_name) /* (value : html/property-value, safe-name : string) -> exn string */  {
  if (value._tag === 1) {
    return string_attribute(safe_name, value.value);
  }
  else if (value._tag === 2) {
    if (value.value) {
       
      var _x5 = $std_core_hnd._open_none1($kokaine_html.is_valid_attribute_name, safe_name);
      if (_x5) {
        var x_10194 = safe_name;
      }
      else {
        var x_10194 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("invalid HTML attribute name: ", safe_name));
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_property_attribute_10163);
      }
      else {
        return $std_core_types._lp__plus__plus__rp_(" ", x_10194);
      }
    }
    else {
      return "";
    }
  }
  else {
    return string_attribute(safe_name, $std_core_int.show(value.value));
  }
}
 
export function property_attribute(name, value) /* (name : string, value : html/property-value) -> exn string */  {
   
  var _x5 = $std_core_hnd._open_none1($kokaine_html.is_valid_property_name, name);
  if (_x5) {
    var x_10197 = name;
  }
  else {
    var x_10197 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("invalid or markup-writing DOM property: ", name));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(safe_name /* string */ ) {
      return _mlift_property_attribute_10164(value, safe_name);
    });
  }
  else {
    if (value._tag === 1) {
      return string_attribute(x_10197, value.value);
    }
    else if (value._tag === 2) {
      if (value.value) {
         
        var _x5 = $std_core_hnd._open_none1($kokaine_html.is_valid_attribute_name, x_10197);
        if (_x5) {
          var x_0_10201 = x_10197;
        }
        else {
          var x_0_10201 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("invalid HTML attribute name: ", x_10197));
        }
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(_mlift_property_attribute_10163);
        }
        else {
          return $std_core_types._lp__plus__plus__rp_(" ", x_0_10201);
        }
      }
      else {
        return "";
      }
    }
    else {
      return string_attribute(x_10197, $std_core_int.show(value.value));
    }
  }
}
 
 
// // monadic lift
export function _mlift_render_attribute_10165(_y_x10031) /* (string) -> exn string */  {
  return $std_core_types._lp__plus__plus__rp_(" ", _y_x10031);
}
 
 
// // monadic lift
export function _mlift_render_attribute_10166(name_3, _y_x10035) /* (name@3 : string, maybe<string>) -> <reactive/effects/signal-read,exn,div> string */  {
  if (_y_x10035 === null) {
    return "";
  }
  else {
    return $std_core_hnd._open_at2(0, string_attribute, name_3, _y_x10035.value);
  }
}
 
 
// // monadic lift
export function _mlift_render_attribute_10167(name_4, _y_x10038) /* (name@4 : string, html/property-value) -> <reactive/effects/signal-read,exn,div> string */  {
  return $std_core_hnd._open_at2(0, property_attribute, name_4, _y_x10038);
}
 
 
// // monadic lift
export function _mlift_render_attribute_10168(wild) /* (wild : string) -> <exn,reactive/effects/signal-read,div> string */  {
  return "";
}
 
export function render_attribute(attribute) /* forall<e> (attribute : html/attribute<e>) -> <reactive/effects/signal-read,pure> string */  {
  if (attribute._tag === 1) {
    return $std_core_hnd._open_at2(0, string_attribute, attribute.name, attribute.value);
  }
  else if (attribute._tag === 7) {
    return $std_core_hnd._open_at2(0, trusted_url_attribute, attribute.name, attribute.url);
  }
  else if (attribute._tag === 2) {
    return $std_core_hnd._open_at2(0, function(name_2 /* string */ , enabled_0 /* bool */ ) {
        if (enabled_0) {
           
          var _x5 = $std_core_hnd._open_none1($kokaine_html.is_valid_attribute_name, name_2);
          if (_x5) {
            var x_10205 = name_2;
          }
          else {
            var x_10205 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("invalid HTML attribute name: ", name_2));
          }
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(_mlift_render_attribute_10165);
          }
          else {
            return $std_core_types._lp__plus__plus__rp_(" ", x_10205);
          }
        }
        else {
          return "";
        }
      }, attribute.name, attribute.enabled);
  }
  else if (attribute._tag === 3) {
    return $std_core_hnd._open_at2(0, property_attribute, attribute.name, attribute.value);
  }
  else if (attribute._tag === 4) {
     
    var x_0_10208 = $std_core_hnd._open_at0(1, attribute.read);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10035 /* maybe<string> */ ) {
        if (_y_x10035 === null) {
          return "";
        }
        else {
          return $std_core_hnd._open_at2(0, string_attribute, attribute.name, _y_x10035.value);
        }
      });
    }
    else {
      if (x_0_10208 === null) {
        return "";
      }
      else {
        return $std_core_hnd._open_at2(0, string_attribute, attribute.name, x_0_10208.value);
      }
    }
  }
  else if (attribute._tag === 5) {
     
    var x_1_10213 = $std_core_hnd._open_at0(1, attribute.read);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10038 /* html/property-value */ ) {
        return $std_core_hnd._open_at2(0, property_attribute, attribute.name, _y_x10038);
      });
    }
    else {
      return $std_core_hnd._open_at2(0, property_attribute, attribute.name, x_1_10213);
    }
  }
  else {
     
    var x_2_10218 = $std_core_hnd._open_at1(0, checked_event_name, attribute.name);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(_mlift_render_attribute_10168);
    }
    else {
      return "";
    }
  }
}
 
 
// // monadic lift
export function _mlift_render_attributes_10169(_y_x10042) /* (list<string>) -> <div,exn,reactive/effects/signal-read> string */  {
  return $std_core_list.joinsep(_y_x10042, "");
}
 
export function render_attributes(attributes) /* forall<e> (attributes : list<html/attribute<e>>) -> <reactive/effects/signal-read,pure> string */  {
   
  var x_10221 = $std_core_list.map(attributes, render_attribute);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_render_attributes_10169);
  }
  else {
    return $std_core_list.joinsep(x_10221, "");
  }
}
 
export function is_void_element(name) /* (name : string) -> bool */  {
  var _x5 = $std_core_string.to_lower(name);
  if (_x5 === "area") {
    return true;
  }
  else if (_x5 === "base") {
    return true;
  }
  else if (_x5 === "br") {
    return true;
  }
  else if (_x5 === "col") {
    return true;
  }
  else if (_x5 === "embed") {
    return true;
  }
  else if (_x5 === "hr") {
    return true;
  }
  else if (_x5 === "img") {
    return true;
  }
  else if (_x5 === "input") {
    return true;
  }
  else if (_x5 === "link") {
    return true;
  }
  else if (_x5 === "meta") {
    return true;
  }
  else if (_x5 === "param") {
    return true;
  }
  else if (_x5 === "source") {
    return true;
  }
  else if (_x5 === "track") {
    return true;
  }
  else if (_x5 === "wbr") {
    return true;
  }
  else {
    return false;
  }
}
 
 
// // monadic lift
export function _mlift_render_children_10170(_y_x10043) /* (list<string>) -> <div,exn,reactive/effects/signal-read> string */  {
  return $std_core_list.joinsep(_y_x10043, "");
}
 
 
// // monadic lift
export function _mlift_render_view_10171(_y_x10044) /* (string) -> <reactive/effects/signal-read,div,exn> string */  {
  return $std_core_string.replace_all($std_core_string.replace_all($std_core_string.replace_all(_y_x10044, "&", "&amp;"), "<", "&lt;"), ">", "&gt;");
}
 
 
// // monadic lift
export function _mlift_render_view_10172(_y_x10046) /* forall<e> (html/view<e>) -> <reactive/effects/signal-read,div,exn> string */  {
  return render_view(_y_x10046);
}
 
 
// // monadic lift
export function _mlift_render_view_10173(opening, safe_name, _y_x10051) /* (opening : string, safe-name : string, string) -> <pure,reactive/effects/signal-read> string */  {
  return $std_core_types._lp__plus__plus__rp_(opening, $std_core_types._lp__plus__plus__rp_(_y_x10051, $std_core_types._lp__plus__plus__rp_("</", $std_core_types._lp__plus__plus__rp_(safe_name, ">"))));
}
 
 
// // monadic lift
export function _mlift_render_view_10174(children_0_0, safe_name_0, _y_x10050) /* forall<e> (children@0@0 : list<html/view<e>>, safe-name : string, list<string>) -> <div,exn,reactive/effects/signal-read> string */  {
   
  var opening_0 = $std_core_types._lp__plus__plus__rp_("<", $std_core_types._lp__plus__plus__rp_(safe_name_0, $std_core_types._lp__plus__plus__rp_($std_core_list.joinsep(_y_x10050, ""), ">")));
  var _x6 = $std_core_hnd._open_none1(is_void_element, safe_name_0);
  if (_x6) {
    return opening_0;
  }
  else {
     
    var x_10224 = render_children(children_0_0);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10051_0 /* string */ ) {
        return _mlift_render_view_10173(opening_0, safe_name_0, _y_x10051_0);
      });
    }
    else {
      return _mlift_render_view_10173(opening_0, safe_name_0, x_10224);
    }
  }
}
 
 
// // monadic lift
export function _mlift_render_view_10175(attributes, children_0_0_0, safe_name_1) /* forall<e> (attributes : list<html/attribute<e>>, children@0@0 : list<html/view<e>>, safe-name : string) -> <exn,div,reactive/effects/signal-read> string */  {
   
  var x_0_10226 = $std_core_list.map(attributes, render_attribute);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10050_0 /* list<string> */ ) {
      return _mlift_render_view_10174(children_0_0_0, safe_name_1, _y_x10050_0);
    });
  }
  else {
    return _mlift_render_view_10174(children_0_0_0, safe_name_1, x_0_10226);
  }
}
 
 
// // monadic lift
export function _mlift_render_keyed_fields_10176(output, _y_x10060) /* (output : ref<global,list<string>>, string) -> <pure,reactive/effects/signal-read> () */  {
   
  var _x_x2_4_10156 = $std_core_types.Cons(_y_x10060, $std_core_hnd._open_none1(render_load, output));
  return $std_core_hnd._open_none2(render_store, output, _x_x2_4_10156);
}
 
 
// // monadic lift
export function _mlift_render_keyed_fields_10177(output_0, _c_x10059) /* forall<e> (output : ref<global,list<string>>, html/view<e>) -> () */  {
   
  var x_1_10228 = render_view(_c_x10059);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10060_0 /* string */ ) {
      return _mlift_render_keyed_fields_10176(output_0, _y_x10060_0);
    });
  }
  else {
    return _mlift_render_keyed_fields_10176(output_0, x_1_10228);
  }
}
 
 
// // monadic lift
export function _mlift_render_keyed_fields_10178(output_1, _y_x10058) /* forall<e> (output : ref<global,list<string>>, list<html/view<e>>) -> <reactive/effects/signal-read,div,exn> () */  {
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10059_0 /* html/view<1545> */ ) {
      return _mlift_render_keyed_fields_10177(output_1, _c_x10059_0);
    });
  }
  else {
    if (_y_x10058 === null) {
      var _x7 = $kokaine_html.Empty;
    }
    else if (_y_x10058 !== null && _y_x10058.tail === null) {
      var _x7 = _y_x10058.head;
    }
    else {
      var _x7 = $kokaine_html.Fragment(_y_x10058);
    }
    return _mlift_render_keyed_fields_10177(output_1, _x7);
  }
}
 
 
// // monadic lift
export function _mlift_render_keyed_fields_10179(children_1, item, output_2, position, _c_x10056) /* forall<a,e> (children@1 : (html/accessor<a>, html/accessor<int>) -> <html/html<e>,reactive/effects/signal-read> (), item : a, output : ref<global,list<string>>, position : ref<global,int>, ()) -> () */  {
   
  var current = $std_core_hnd._open_none1(render_load, position);
   
  var _x_x2_2_10152 = $std_core_types._int_add(current,1);
   
  $std_core_hnd._open_none2(render_store, position, _x_x2_2_10152);
   
  var x_3_10232 = $kokaine_html.collect(function() {
    return $std_core_hnd._open2($std_core_vector.unvlist($std_core_types.Cons(1, $std_core_types.Cons(2, $std_core_types.Nil))), children_1, function() {
        return item;
      }, function() {
        return current;
      });
  });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10058_0 /* list<html/view<1545>> */ ) {
      return _mlift_render_keyed_fields_10178(output_2, _y_x10058_0);
    });
  }
  else {
    return _mlift_render_keyed_fields_10178(output_2, x_3_10232);
  }
}
 
 
// // monadic lift
export function _mlift_render_keyed_fields_10180(output_3, wild_1) /* (output : ref<global,list<string>>, wild@1 : ()) -> <div,exn,reactive/effects/signal-read> string */  {
   
  var xs_2_10109 = $std_core_hnd._open_none1(render_load, output_3);
  return $std_core_list.joinsep($std_core_list.reverse_acc($std_core_types.Nil, xs_2_10109), "");
}
 
 
// // monadic lift
export function _mlift_render_keyed_fields_10181(children_1_0, compare, key, keys, output_4, position_0, walk, snapshot) /* forall<a,b,c,e> (children@1 : (html/accessor<b>, html/accessor<int>) -> <html/html<e>,reactive/effects/signal-read> (), compare : (c, c) -> order, key : (b) -> c, keys : ref<global,internal/key-index/key-index<c,()>>, output : ref<global,list<string>>, position : ref<global,int>, walk : forall<e1> (a, (b) -> e1 ()) -> e1 (), snapshot : a) -> <reactive/effects/signal-read,div,exn> string */  {
   
  var x_4_10234 = walk(snapshot, function(item_0 /* 1543 */ ) {
       
      var identity = $std_core_hnd._open_none1(key, item_0);
       
      var _x_x1_3_10141 = $std_core_hnd._open_none1(render_load, keys);
       
      var _x8 = $std_core_hnd._open_none4($kokaine_internal_key_dash_index.insert, _x_x1_3_10141, identity, $std_core_types.Unit, compare);
      if (_x8._tag === 2 && _x8.existing === 1) {
        var x_5_10236 = $std_core_hnd._open_at2(0, $std_core_exn.$throw, "duplicate key in keyed For");
      }
      else {
        var x_5_10236 = $std_core_hnd._open_none2(render_store, keys, _x8.index);
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_c_x10056_0 /* () */ ) {
          return _mlift_render_keyed_fields_10179(children_1_0, item_0, output_4, position_0, _c_x10056_0);
        });
      }
      else {
        return _mlift_render_keyed_fields_10179(children_1_0, item_0, output_4, position_0, x_5_10236);
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild_1_0 /* () */ ) {
      return _mlift_render_keyed_fields_10180(output_4, wild_1_0);
    });
  }
  else {
    return _mlift_render_keyed_fields_10180(output_4, x_4_10234);
  }
}
 
export function render_children(children) /* forall<e> (children : list<html/view<e>>) -> <pure,reactive/effects/signal-read> string */  {
   
  var x_6_10238 = $std_core_list.map(children, render_view);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_render_children_10170);
  }
  else {
    return $std_core_list.joinsep(x_6_10238, "");
  }
}
 
export function render_view(node) /* forall<e> (node : html/view<e>) -> <pure,reactive/effects/signal-read> string */  { tailcall: while(1)
{
  if (node._tag === 1) {
    return "";
  }
  else if (node._tag === 2) {
    return $std_core_string.replace_all($std_core_string.replace_all($std_core_string.replace_all(node.content, "&", "&amp;"), "<", "&lt;"), ">", "&gt;");
  }
  else if (node._tag === 3) {
     
    var x_7_10241 = $std_core_hnd._open_at0(1, node.read);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(_mlift_render_view_10171);
    }
    else {
      return $std_core_string.replace_all($std_core_string.replace_all($std_core_string.replace_all(x_7_10241, "&", "&amp;"), "<", "&lt;"), ">", "&gt;");
    }
  }
  else if (node._tag === 5) {
    return render_children(node.children);
  }
  else if (node._tag === 6) {
     
    var x_8_10244 = $std_core_hnd._open_at0(1, node.read);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10046_0 /* html/view<1531> */ ) {
        return _mlift_render_view_10172(_y_x10046_0);
      });
    }
    else {
      {
        // tail call
        node = x_8_10244;
        continue tailcall;
      }
    }
  }
  else if (node._tag === 7) {
    return render_keyed(node.plan);
  }
  else if (node._tag === 8) {
    return $std_core_hnd._open_none1(function(value_0_0 /* html/trusted-html */ ) {
        return value_0_0;
      }, node.content);
  }
  else {
     
    var x_9_10247 = $std_core_hnd._open_at1(0, checked_element_name, node.name);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(safe_name_2 /* string */ ) {
        return _mlift_render_view_10175(node.attributes, node.children, safe_name_2);
      });
    }
    else {
       
      var x_10_10250 = $std_core_list.map(node.attributes, render_attribute);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10050_1 /* list<string> */ ) {
          return _mlift_render_view_10174(node.children, x_9_10247, _y_x10050_1);
        });
      }
      else {
         
        var opening_1 = $std_core_types._lp__plus__plus__rp_("<", $std_core_types._lp__plus__plus__rp_(x_9_10247, $std_core_types._lp__plus__plus__rp_($std_core_list.joinsep(x_10_10250, ""), ">")));
        var _x8 = $std_core_hnd._open_none1(is_void_element, x_9_10247);
        if (_x8) {
          return opening_1;
        }
        else {
           
          var x_11_10253 = render_children(node.children);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10051_1 /* string */ ) {
              return _mlift_render_view_10173(opening_1, x_9_10247, _y_x10051_1);
            });
          }
          else {
            return $std_core_types._lp__plus__plus__rp_(opening_1, $std_core_types._lp__plus__plus__rp_(x_11_10253, $std_core_types._lp__plus__plus__rp_("</", $std_core_types._lp__plus__plus__rp_(x_9_10247, ">"))));
          }
        }
      }
    }
  }
}}
 
export function render_keyed_fields(read_1, walk_0, key_0, compare_0, children_1_1) /* forall<a,b,c,e> (read : () -> reactive/effects/signal-read a, walk : forall<e1> (a, (b) -> e1 ()) -> e1 (), key : (b) -> c, compare : (c, c) -> order, children : (html/accessor<b>, html/accessor<int>) -> <html/html<e>,reactive/effects/signal-read> ()) -> <pure,reactive/effects/signal-read> string */  {
   
  var keys_0 = $std_core_hnd._open_none1(render_cell, $kokaine_internal_key_dash_index.Key_index_empty);
   
  var output_5 = $std_core_hnd._open_none1(render_cell, $std_core_types.Nil);
   
  var position_1 = $std_core_hnd._open_none1(render_cell, 0);
   
  var x_12_10256 = $std_core_hnd._open_at0(1, read_1);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(snapshot_0 /* 1542 */ ) {
      return _mlift_render_keyed_fields_10181(children_1_1, compare_0, key_0, keys_0, output_5, position_1, walk_0, snapshot_0);
    });
  }
  else {
     
    var x_13_10259 = walk_0(x_12_10256, function(item_1 /* 1543 */ ) {
         
        var identity_0 = $std_core_hnd._open_none1(key_0, item_1);
         
        var _x_x1_3_10141_0 = $std_core_hnd._open_none1(render_load, keys_0);
         
        var _x9 = $std_core_hnd._open_none4($kokaine_internal_key_dash_index.insert, _x_x1_3_10141_0, identity_0, $std_core_types.Unit, compare_0);
        if (_x9._tag === 2 && _x9.existing === 1) {
          var x_14_10262 = $std_core_hnd._open_at2(0, $std_core_exn.$throw, "duplicate key in keyed For");
        }
        else {
          var x_14_10262 = $std_core_hnd._open_none2(render_store, keys_0, _x9.index);
        }
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_c_x10056_1 /* () */ ) {
            return _mlift_render_keyed_fields_10179(children_1_1, item_1, output_5, position_1, _c_x10056_1);
          });
        }
        else {
          return _mlift_render_keyed_fields_10179(children_1_1, item_1, output_5, position_1, x_14_10262);
        }
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild_1_1 /* () */ ) {
        return _mlift_render_keyed_fields_10180(output_5, wild_1_1);
      });
    }
    else {
       
      var xs_2_10109_0 = $std_core_hnd._open_none1(render_load, output_5);
      return $std_core_list.joinsep($std_core_list.reverse_acc($std_core_types.Nil, xs_2_10109_0), "");
    }
  }
}
 
export function render_keyed(plan_0) /* forall<e> (plan : html/keyed-plan<e>) -> <pure,reactive/effects/signal-read> string */  {
  return render_keyed_fields(plan_0.plan_spec.keyed_read, plan_0.plan_spec.keyed_walk, plan_0.plan_spec.keyed_key, plan_0.plan_spec.keyed_compare, plan_0.plan_spec.keyed_children);
}
 
export function render(root, node) /* forall<e> (root : reactive/root<e>, node : html/view<e>) -> <exn|e> string */  {
  return $kokaine_reactive.sample(root, function() {
      return $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag), $std_core_types.Nil))), render_view, node);
    });
}