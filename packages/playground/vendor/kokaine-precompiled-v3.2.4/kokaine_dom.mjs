// Koka generated module: kokaine/dom, koka version: 3.2.4
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
import * as $kokaine_reactive_integration from './kokaine_reactive_integration.mjs';
import * as $kokaine_reactive_async from './kokaine_reactive_async.mjs';
import * as $kokaine_async_effects from './kokaine_async_effects.mjs';
import * as $kokaine_html from './kokaine_html.mjs';
import * as $kokaine_reactive_integration_event from './kokaine_reactive_integration_event.mjs';
import * as $kokaine_internal_key_dash_index from './kokaine_internal_key_dash_index.mjs';
import * as $kokaine_internal_compat from './kokaine_internal_compat.mjs';
import * as $kokaine_dom_internal_keyed_dash_transaction from './kokaine_dom_internal_keyed_dash_transaction.mjs';
import * as $std_core_unsafe from './std_core_unsafe.mjs';
import * as $std_core_undiv from './std_core_undiv.mjs';
import * as $kokaine_reactive_integration_internal_lifetime_dash_scope from './kokaine_reactive_integration_internal_lifetime_dash_scope.mjs';
import * as $kokaine_reactive_integration_internal_provision from './kokaine_reactive_integration_internal_provision.mjs';
import * as $kokaine_reactive_integration_internal_reentry from './kokaine_reactive_integration_internal_reentry.mjs';
import * as $kokaine_reactive_internal_model from './kokaine_reactive_internal_model.mjs';
import * as $kokaine_reactive_internal_runtime from './kokaine_reactive_internal_runtime.mjs';
import * as $kokaine_reactive_internal_handlers from './kokaine_reactive_internal_handlers.mjs';
 
// externals
// JavaScript primitives for the Koka module `kokaine/dom` (kokaine/dom.kk).
//
// This is not an ES module. `extern import { js file "dom-inline.js" }` in
// kokaine/dom.kk makes the Koka compiler paste this file verbatim into the generated
// `kokaine_dom.mjs` at compile time, so:
//   - it must contain only top-level function declarations (no imports,
//     exports, or top-level side effects) and runs in strict mode;
//   - every name shares the generated module's scope, hence the
//     `kokaineDom` prefix;
//   - a missing or unreadable file fails the Koka build, never the browser.
// Each function backs exactly one `extern`; the Koka declaration keeps the
// type and the design comment, and calls it as `js inline "name(#1,...)"`.
// Unit tests: test/sidecar/*.test.mjs (`node --test`).
/** Backs `extern dom-attempt-raw`. */
function kokaineDomAttemptRaw(action) {
  try {
    return { ok: true, value: (action)() };
  } catch (error) {
    return { ok: false, message: String(error && error.message != null ? error.message : error) };
  }
}
/** Backs `extern dom-install-shadow-tracker`. */
function kokaineDomInstallShadowTracker(parent) {
  var doc = parent && (parent.nodeType === 9 ? parent : parent.ownerDocument);
  var view = doc && doc.defaultView;
  if (!view || !view.Element)
    throw new Error('cannot install Kokaine shadow-root tracking outside a DOM realm');
  var key = Symbol.for('kokaine.dom.shadow-roots');
  var tracker = globalThis[key];
  if (!tracker) {
    tracker = { version: 1, known: new WeakSet(), closed: new WeakSet(), realms: new WeakMap() };
    tracker.remember = function (root) {
      var pending = root && root.childNodes ? Array.prototype.slice.call(root.childNodes) : [];
      while (pending.length) {
        var current = pending.pop();
        if (current && current.nodeType === 1) {
          tracker.known.add(current);
          if (current.localName === 'template' && current.content) {
            var mode = current.getAttribute('shadowrootmode');
            if (mode && mode.toLowerCase() === 'closed' && current.parentNode && current.parentNode.nodeType === 1)
              tracker.closed.add(current.parentNode);
            var templateChildren = Array.prototype.slice.call(current.content.childNodes);
            for (var j = 0; j < templateChildren.length; j++)
              pending.push(templateChildren[j]);
          }
        }
        var children = current && current.childNodes ? Array.prototype.slice.call(current.childNodes) : [];
        for (var i = 0; i < children.length; i++)
          pending.push(children[i]);
      }
    };
    globalThis[key] = tracker;
  }
  if (tracker.version !== 1 || !tracker.known || !tracker.closed || !tracker.realms || typeof tracker.remember !== 'function')
    throw new Error('invalid Kokaine shadow-root tracker');
  var prototype = view.Element.prototype;
  var state = tracker.realms.get(view);
  if (state) {
    var intact = state.wrapper ? prototype.attachShadow === state.wrapper : typeof prototype.attachShadow !== 'function';
    if (state.prototype !== prototype || !intact) {
      state.replaced = true;
    }
    return;
  }
  var descriptor = Object.getOwnPropertyDescriptor(prototype, 'attachShadow');
  if (!descriptor || typeof descriptor.value !== 'function') {
    if (typeof prototype.attachShadow === 'function')
      throw new Error('cannot safely wrap this DOM realm attachShadow implementation');
    tracker.realms.set(view, { prototype: prototype, wrapper: null });
    return;
  }
  var original = descriptor.value;
  var wrapper = function attachShadow() {
    var root = original.apply(this, arguments);
    tracker.known.add(this);
    try {
      var mode = root && root.mode;
      if (mode !== 'open')
        tracker.closed.add(this);
    } catch (error) {
      tracker.closed.add(this);
      throw error;
    }
    return root;
  };
  Object.defineProperty(prototype, 'attachShadow', { configurable: descriptor.configurable, enumerable: descriptor.enumerable, writable: descriptor.writable, value: wrapper });
  tracker.realms.set(view, { prototype: prototype, wrapper: wrapper });
}
/** Backs `extern dom-create-element`. */
function kokaineDomCreateElement(parent, name) {
  var doc = parent && (parent.nodeType === 9 ? parent : parent.ownerDocument);
  if (!doc)
    throw new Error('cannot create a Kokaine element without an owner document');
  var svg = 'http://www.w3.org/2000/svg', mathml = 'http://www.w3.org/1998/Math/MathML';
  var ns = null;
  if (name === 'svg')
    ns = svg;
  else if (name === 'math')
    ns = mathml;
  else if (parent && parent.nodeType === 1) {
    var pns = parent.namespaceURI, plocal = parent.localName;
    if (pns === svg && plocal !== 'foreignObject')
      ns = svg;
    else if (pns === mathml && (name === 'mglyph' || name === 'malignmark' || !/^(mi|mo|mn|ms|mtext|annotation-xml)$/.test(plocal)))
      ns = mathml;
  }
  var value = ns ? doc.createElementNS(ns, name) : doc.createElement(name);
  var tracker = globalThis[Symbol.for('kokaine.dom.shadow-roots')];
  if (tracker && tracker.known)
    tracker.known.add(value);
  return value;
}
/** Backs `extern dom-record-owner`. */
function kokaineDomRecordOwner(value, root, portal) {
  var key = Symbol.for('kokaine.dom.owners');
  var registry = globalThis[key];
  if (!registry || !registry.owners || !registry.roots) {
    registry = { owners: new WeakMap(), roots: new WeakMap(), nextId: 1 };
    globalThis[key] = registry;
  }
  var ownerId = registry.roots.get(root);
  if (ownerId == null) {
    ownerId = registry.nextId++;
    registry.roots.set(root, ownerId);
  }
  var entry = { ownerId: ownerId, portal: portal, retired: false };
  registry.owners.set(value, entry);
  return [{ node: value, ownerId: ownerId, entry: entry }];
}
/** Backs `extern dom-retire-owners`. */
function kokaineDomRetireOwners(value) {
  var registry = globalThis[Symbol.for('kokaine.dom.owners')];
  var handles = value || [];
  for (var i = 0; i < handles.length; i++) {
    var handle = handles[i];
    var entry = handle.entry;
    if (entry) {
      entry.portal = null;
      entry.retired = true;
    }
    if (registry && registry.owners && handle.node) {
      var current = registry.owners.get(handle.node);
      if (current === entry && current.ownerId === handle.ownerId) {
        registry.owners.set(handle.node, entry);
      }
    }
    handle.node = null;
    handle.entry = null;
  }
}
/** Backs `extern dom-find-owner`. */
function kokaineDomFindOwner(value, root) {
  var registry = globalThis[Symbol.for('kokaine.dom.owners')];
  if (!registry || !registry.owners || !registry.roots)
    return { state: 0 };
  var ownerId = registry.roots.get(root);
  if (ownerId == null)
    return { state: 0 };
  var current = value;
  while (current) {
    var entry = registry.owners.get(current);
    if (entry && entry.ownerId === ownerId) {
      if (entry.retired || !entry.portal)
        return { state: 2 };
      return { state: 1, portal: entry.portal };
    }
    current = current.parentNode || current.host || null;
  }
  return { state: 0 };
}
/** Backs `extern dom-append-marker-pair`. */
function kokaineDomAppendMarkerPair(parent, first, last) {
  var rangeFirst = first;
  var rangeLast = last;
  var fragment = document.createDocumentFragment();
  fragment.appendChild(rangeFirst);
  fragment.appendChild(rangeLast);
  try {
    (parent).appendChild(fragment);
  } catch (error) {
    try {
      if (rangeFirst.parentNode)
        Node.prototype.removeChild.call(rangeFirst.parentNode, rangeFirst);
    } catch (_) {
    }
    try {
      if (rangeLast.parentNode)
        Node.prototype.removeChild.call(rangeLast.parentNode, rangeLast);
    } catch (_) {
    }
    throw error;
  }
}
/** Backs `extern dom-insert-marker-pair-before`. */
function kokaineDomInsertMarkerPairBefore(parent, first, last, before) {
  var rangeFirst = first;
  var rangeLast = last;
  var fragment = document.createDocumentFragment();
  fragment.appendChild(rangeFirst);
  fragment.appendChild(rangeLast);
  try {
    (parent).insertBefore(fragment, before);
  } catch (error) {
    try {
      if (rangeFirst.parentNode)
        Node.prototype.removeChild.call(rangeFirst.parentNode, rangeFirst);
    } catch (_) {
    }
    try {
      if (rangeLast.parentNode)
        Node.prototype.removeChild.call(rangeLast.parentNode, rangeLast);
    } catch (_) {
    }
    throw error;
  }
}
/** Backs `extern dom-range-first`. */
function kokaineDomRangeFirst(rangeParent, rangeFirst, rangeLast) {
  if (!rangeParent || !rangeFirst || !rangeLast || rangeFirst === rangeLast || rangeFirst.parentNode !== rangeParent || rangeLast.parentNode !== rangeParent) {
    throw new Error('invalid Kokaine DOM range: endpoints do not share the expected parent');
  }
  var n = rangeFirst;
  while (n && n !== rangeLast)
    n = n.nextSibling;
  if (n !== rangeLast) {
    throw new Error('invalid Kokaine DOM range: closing marker is not reachable after opening marker');
  }
  return rangeFirst.nextSibling;
}
/** Backs `extern dom-range-next`. */
function kokaineDomRangeNext(rangeParent, rangeFirst, rangeLast) {
  if (!rangeParent || !rangeFirst || !rangeLast || rangeFirst === rangeLast || rangeFirst.parentNode !== rangeParent || rangeLast.parentNode !== rangeParent) {
    throw new Error('invalid Kokaine DOM range: endpoints do not share the expected parent');
  }
  var n = rangeFirst;
  while (n && n !== rangeLast)
    n = n.nextSibling;
  if (n !== rangeLast) {
    throw new Error('invalid Kokaine DOM range: closing marker is not reachable after opening marker');
  }
  var next = rangeLast.nextSibling;
  if (!next) {
    throw new Error('invalid Kokaine keyed DOM range: row has no following boundary');
  }
  return next;
}
/** Backs `extern dom-validate-range-move-lifecycle`. */
function kokaineDomValidateRangeMoveLifecycle(rangeParent, rangeFirst, rangeLast) {
  var doc = rangeParent && (rangeParent.nodeType === 9 ? rangeParent : rangeParent.ownerDocument);
  var view = doc && doc.defaultView;
  var tracker = globalThis[Symbol.for('kokaine.dom.shadow-roots')];
  var state = view && tracker && tracker.realms && tracker.realms.get(view);
  var prototype = view && view.Element && view.Element.prototype;
  var intact = state && state.prototype === prototype && (state.wrapper ? prototype.attachShadow === state.wrapper : typeof prototype.attachShadow !== 'function');
  if (!tracker || tracker.version !== 1 || !tracker.known || !tracker.closed || !state || !intact)
    throw new Error('cannot safely move keyed row: shadow-root tracking is unavailable');
  var documentPrototype = view.Document && view.Document.prototype;
  var createElement = documentPrototype && documentPrototype.createElement;
  var createElementNS = documentPrototype && documentPrototype.createElementNS;
  var outerHTMLDescriptor = prototype && Object.getOwnPropertyDescriptor(prototype, 'outerHTML');
  var serializeOuterHTML = outerHTMLDescriptor && outerHTMLDescriptor.get;
  if (typeof createElement !== 'function' || typeof createElementNS !== 'function' || typeof serializeOuterHTML !== 'function')
    throw new Error('cannot safely move keyed row: native element inspection is unavailable');
  function canHostShadow(element) {
    var name = element.localName || '';
    return name.indexOf('-') >= 0 || ['article', 'aside', 'blockquote', 'body', 'div', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'main', 'nav', 'p', 'section', 'span'].indexOf(name) >= 0;
  }
  function hasCustomPrototype(element) {
    var name = element.localName || '';
    if (name.indexOf('-') >= 0)
      return true;
    var namespace = element.namespaceURI;
    var baseline = namespace ? createElementNS.call(doc, namespace, name) : createElement.call(doc, name);
    return Object.getPrototypeOf(element) !== Object.getPrototypeOf(baseline);
  }
  function hasSerializedIsValue(element) {
    var serialized = serializeOuterHTML.call(element);
    var end = serialized.indexOf('>');
    return end >= 0 && serialized.slice(0, end).indexOf(' is="') >= 0;
  }
  var pending = [];
  var n = rangeFirst;
  while (n) {
    pending.push(n);
    if (n === rangeLast)
      break;
    n = n.nextSibling;
  }
  if (n !== rangeLast)
    throw new Error('invalid Kokaine DOM move: closing marker is not reachable after opening marker');
  while (pending.length) {
    var current = pending.pop();
    if (current && current.nodeType === 1) {
      if (!(current instanceof view.Element))
        throw new Error('cannot safely move keyed row: foreign-realm element lifecycle state is opaque');
      var customized = current.getAttribute('is');
      if (customized || hasCustomPrototype(current) || hasSerializedIsValue(current))
        throw new Error('cannot safely move keyed row: custom-element move callbacks are synchronous and cannot be atomically published');
      if (tracker.closed.has(current))
        throw new Error('cannot safely move keyed row: closed shadow roots are opaque');
      if (state.wrapper && !current.shadowRoot && canHostShadow(current) && !tracker.known.has(current))
        throw new Error('cannot safely move keyed row: an external shadow host may contain an untracked closed root');
    }
    var children = current && current.childNodes ? Array.prototype.slice.call(current.childNodes) : [];
    if (current && current.shadowRoot)
      children = children.concat(Array.prototype.slice.call(current.shadowRoot.childNodes));
    for (var i = 0; i < children.length; i++)
      pending.push(children[i]);
  }
}
/** Backs `extern dom-validate-range-move-focus`. */
function kokaineDomValidateRangeMoveFocus(rangeParent, rangeFirst, rangeLast) {
  var rangeDocument = rangeParent && (rangeParent.nodeType === 9 ? rangeParent : rangeParent.ownerDocument);
  var rangeView = rangeDocument && rangeDocument.defaultView;
  if (!rangeDocument || !rangeView)
    throw new Error('cannot inspect keyed-row focus outside a DOM realm');
  function movePrimitive(parent) {
    if (rangeView.Document && parent instanceof rangeView.Document && typeof rangeView.Document.prototype.moveBefore === 'function')
      return rangeView.Document.prototype.moveBefore;
    if (rangeView.DocumentFragment && parent instanceof rangeView.DocumentFragment && typeof rangeView.DocumentFragment.prototype.moveBefore === 'function')
      return rangeView.DocumentFragment.prototype.moveBefore;
    if (rangeView.Element && parent instanceof rangeView.Element && typeof rangeView.Element.prototype.moveBefore === 'function')
      return rangeView.Element.prototype.moveBefore;
    return null;
  }
  var primitive = movePrimitive(rangeParent);
  if (primitive && rangeParent.moveBefore === primitive)
    return;
  var pending = [];
  var all = [];
  var n = rangeFirst;
  while (n) {
    pending.push(n);
    if (n === rangeLast)
      break;
    n = n.nextSibling;
  }
  if (n !== rangeLast)
    throw new Error('invalid Kokaine DOM move: closing marker is not reachable after opening marker');
  while (pending.length) {
    var current = pending.pop();
    all.push(current);
    var children = current && current.childNodes ? Array.prototype.slice.call(current.childNodes) : [];
    if (current && current.shadowRoot)
      children = children.concat(Array.prototype.slice.call(current.shadowRoot.childNodes));
    for (var i = 0; i < children.length; i++)
      pending.push(children[i]);
  }
  var active = rangeDocument.activeElement;
  while (active && active.shadowRoot && active.shadowRoot.activeElement)
    active = active.shadowRoot.activeElement;
  if (!active || all.indexOf(active) < 0)
    return;
  if (active.localName === 'iframe')
    throw new Error('cannot safely move keyed row: fallback DOM moves cannot inspect the focused subtree');
  if (typeof active.selectionStart === 'number' && typeof active.selectionEnd === 'number')
    return;
  var selectionRoot = active.getRootNode ? active.getRootNode() : rangeDocument;
  if (selectionRoot && selectionRoot.host && typeof selectionRoot.getSelection !== 'function')
    throw new Error('cannot safely move keyed row: this browser cannot inspect shadow-root selections');
  var selection = selectionRoot && typeof selectionRoot.getSelection === 'function' ? selectionRoot.getSelection() : rangeDocument.getSelection();
  if (selection && selection.rangeCount > 0 && typeof selection.setBaseAndExtent !== 'function')
    throw new Error('cannot safely move keyed row: this browser cannot restore directional DOM selections');
}
/** Backs `extern dom-capture-range-focus`. */
function kokaineDomCaptureRangeFocus(rangeParent, rangeFirst, rangeLast) {
  var rangeDocument = rangeParent && (rangeParent.nodeType === 9 ? rangeParent : rangeParent.ownerDocument);
  if (!rangeDocument)
    throw new Error('cannot capture keyed-row focus without an owner document');
  var nodes = [];
  var n = rangeFirst;
  while (n) {
    nodes.push(n);
    if (n === rangeLast)
      break;
    n = n.nextSibling;
  }
  if (n !== rangeLast)
    throw new Error('invalid Kokaine DOM move: closing marker is not reachable after opening marker');
  function deepActive() {
    var active = rangeDocument.activeElement;
    while (active && active.shadowRoot && active.shadowRoot.activeElement)
      active = active.shadowRoot.activeElement;
    return active;
  }
  function composedParent(node) {
    if (!node)
      return null;
    if (node.parentNode)
      return node.parentNode;
    var tree = node.getRootNode ? node.getRootNode() : null;
    return tree && tree.host ? tree.host : null;
  }
  function belongs(node) {
    var current = node;
    while (current) {
      if (nodes.indexOf(current) >= 0)
        return true;
      current = composedParent(current);
    }
    return false;
  }
  function sameControlSelection(active, selection) {
    return active.selectionStart === selection[0] && active.selectionEnd === selection[1] && active.selectionDirection === selection[2];
  }
  function sameDomSelection(selection, snapshot) {
    return selection.anchorNode === snapshot[0] && selection.anchorOffset === snapshot[1] && selection.focusNode === snapshot[2] && selection.focusOffset === snapshot[3];
  }
  var active = deepActive();
  var ownsFocus = !!active && belongs(active);
  var controlSelection = null;
  var domSelection = null;
  if (ownsFocus && typeof active.selectionStart === 'number' && typeof active.selectionEnd === 'number') {
    controlSelection = [active.selectionStart, active.selectionEnd, active.selectionDirection];
  } else if (ownsFocus) {
    var selectionRoot = active.getRootNode ? active.getRootNode() : rangeDocument;
    var selection = selectionRoot && typeof selectionRoot.getSelection === 'function' ? selectionRoot.getSelection() : rangeDocument.getSelection();
    if (selection && selection.rangeCount > 0 && belongs(selection.anchorNode) && belongs(selection.focusNode)) {
      domSelection = [selection.anchorNode, selection.anchorOffset, selection.focusNode, selection.focusOffset];
    }
  }
  return { restore: function () {
      if (!ownsFocus)
        return;
      if (!active.isConnected)
        throw new Error('cannot restore keyed-row focus: the focused node was detached');
      if (deepActive() !== active) {
        if (typeof active.focus !== 'function')
          throw new Error('cannot restore keyed-row focus: the focused node is not focusable');
        try {
          active.focus({ preventScroll: true });
        } catch (_) {
          active.focus();
        }
        if (deepActive() !== active)
          throw new Error('cannot restore keyed-row focus: focus restoration did not take effect');
      }
      if (controlSelection) {
        if (typeof active.setSelectionRange !== 'function')
          throw new Error('cannot restore keyed-row selection: the focused control has no selection API');
        if (!sameControlSelection(active, controlSelection))
          active.setSelectionRange(controlSelection[0], controlSelection[1], controlSelection[2]);
        if (!sameControlSelection(active, controlSelection))
          throw new Error('cannot restore keyed-row selection: control selection restoration did not take effect');
      } else if (domSelection) {
        if (!domSelection[0].isConnected || !domSelection[2].isConnected)
          throw new Error('cannot restore keyed-row selection: a selection endpoint was detached');
        var selectionRoot = active.getRootNode ? active.getRootNode() : rangeDocument;
        var selection = selectionRoot && typeof selectionRoot.getSelection === 'function' ? selectionRoot.getSelection() : rangeDocument.getSelection();
        if (!selection || typeof selection.setBaseAndExtent !== 'function')
          throw new Error('cannot restore keyed-row selection: the directional selection API is unavailable');
        if (!sameDomSelection(selection, domSelection))
          selection.setBaseAndExtent(domSelection[0], domSelection[1], domSelection[2], domSelection[3]);
        if (!sameDomSelection(selection, domSelection))
          throw new Error('cannot restore keyed-row selection: DOM selection restoration did not take effect');
      }
    } };
}
/** Backs `extern dom-move-range-before`. */
function kokaineDomMoveRangeBefore(rangeParent, rangeFirst, rangeLast, target, focusState) {
  if (!rangeParent || !rangeFirst || !rangeLast || !target || rangeFirst === rangeLast || rangeFirst.parentNode !== rangeParent || rangeLast.parentNode !== rangeParent || target.parentNode !== rangeParent) {
    throw new Error('invalid Kokaine DOM move: range and target must share the expected parent');
  }
  var rangeDocument = rangeParent.nodeType === 9 ? rangeParent : rangeParent.ownerDocument;
  var rangeView = rangeDocument && rangeDocument.defaultView;
  if (!rangeDocument || !rangeView || !rangeView.Node)
    throw new Error('cannot move a keyed row outside a DOM realm');
  var nodePrototype = rangeView.Node.prototype;
  function movePrimitive(parent) {
    if (rangeView.Document && parent instanceof rangeView.Document && typeof rangeView.Document.prototype.moveBefore === 'function')
      return rangeView.Document.prototype.moveBefore;
    if (rangeView.DocumentFragment && parent instanceof rangeView.DocumentFragment && typeof rangeView.DocumentFragment.prototype.moveBefore === 'function')
      return rangeView.DocumentFragment.prototype.moveBefore;
    if (rangeView.Element && parent instanceof rangeView.Element && typeof rangeView.Element.prototype.moveBefore === 'function')
      return rangeView.Element.prototype.moveBefore;
    return null;
  }
  var nodes = [];
  var n = rangeFirst;
  while (n) {
    nodes.push(n);
    if (n === rangeLast)
      break;
    n = n.nextSibling;
  }
  if (n !== rangeLast) {
    throw new Error('invalid Kokaine DOM move: closing marker is not reachable after opening marker');
  }
  if (nodes.indexOf(target) >= 0) {
    throw new Error('invalid Kokaine DOM move: target lies inside the moved range');
  }
  if (rangeLast.nextSibling === target)
    return;
  var originalNext = rangeLast.nextSibling;
  var nativeMove = movePrimitive(rangeParent);
  var preserveMoves = !!nativeMove && rangeParent.moveBefore === nativeMove;
  function restoreFocus() {
    if (focusState && typeof focusState.restore === 'function')
      focusState.restore();
  }
  function gather(values) {
    var fragment = rangeDocument.createDocumentFragment();
    for (var i = 0; i < values.length; i++)
      nodePrototype.appendChild.call(fragment, values[i]);
    return fragment;
  }
  function place(anchor) {
    if (preserveMoves) {
      for (var i = 0; i < nodes.length; i++)
        nativeMove.call(rangeParent, nodes[i], anchor);
    } else {
      rangeParent.insertBefore(gather(nodes), anchor);
    }
  }
  function detachMoved() {
    var passes = Math.max(2, nodes.length + 2);
    while (passes-- > 0) {
      var attached = false;
      for (var i = 0; i < nodes.length; i++) {
        var parent = nodes[i].parentNode;
        if (parent) {
          attached = true;
          nodePrototype.removeChild.call(parent, nodes[i]);
        }
      }
      if (!attached)
        return;
    }
    throw new Error('a retired keyed range was synchronously reinserted');
  }
  function verify(anchor) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].parentNode !== rangeParent)
        throw new Error('a moved node escaped its keyed range');
      if (i > 0 && nodes[i - 1].nextSibling !== nodes[i])
        throw new Error('the keyed range became non-contiguous');
    }
    if (nodes[nodes.length - 1].nextSibling !== anchor)
      throw new Error('the keyed range was not placed at its requested boundary');
  }
  function rollback() {
    if (originalNext && originalNext.parentNode !== rangeParent) {
      detachMoved();
      throw new Error('the original keyed range successor was detached');
    }
    var anchor = originalNext || null;
    if (preserveMoves) {
      for (var i = 0; i < nodes.length; i++)
        nativeMove.call(rangeParent, nodes[i], anchor);
    } else {
      nodePrototype.insertBefore.call(rangeParent, gather(nodes), anchor);
    }
    restoreFocus();
    verify(anchor);
  }
  try {
    place(target);
    restoreFocus();
    verify(target);
  } catch (error) {
    try {
      rollback();
    } catch (rollbackError) {
      throw new Error(String(error && error.message != null ? error.message : error) + '; keyed DOM move rollback failed: ' + String(rollbackError && rollbackError.message != null ? rollbackError.message : rollbackError));
    }
    throw error;
  }
}
/** Backs `extern dom-clean-range`. */
function kokaineDomCleanRange(first, last, inclusive) {
  var rangeFirst = first;
  var rangeLast = last;
  var includeEndpoints = inclusive;
  var firstParent = rangeFirst && rangeFirst.parentNode;
  var lastParent = rangeLast && rangeLast.parentNode;
  if (!firstParent && !lastParent)
    return;
  if (!firstParent || firstParent !== lastParent || rangeFirst === rangeLast) {
    throw new Error('invalid Kokaine DOM range: endpoints do not share a parent');
  }
  var roots = [];
  var n = includeEndpoints ? rangeFirst : rangeFirst.nextSibling;
  while (n && n !== rangeLast) {
    roots.push(n);
    n = n.nextSibling;
  }
  if (n !== rangeLast) {
    throw new Error('invalid Kokaine DOM range: closing marker is not reachable after opening marker');
  }
  if (includeEndpoints)
    roots.push(rangeLast);
  var descendants = [];
  var pending = roots.slice();
  while (pending.length) {
    var current = pending.pop();
    var children = current && current.childNodes ? Array.prototype.slice.call(current.childNodes) : [];
    if (current && current.shadowRoot)
      children = children.concat(Array.prototype.slice.call(current.shadowRoot.childNodes));
    for (var i = 0; i < children.length; i++) {
      descendants.push(children[i]);
      pending.push(children[i]);
    }
  }
  function retained(node) {
    var current = node;
    while (current) {
      for (var i = 0; i < roots.length; i++) {
        if (roots[i] === current || Node.prototype.contains.call(roots[i], current))
          return true;
      }
      var tree = current.getRootNode ? current.getRootNode() : null;
      current = tree && tree.host ? tree.host : null;
    }
    return false;
  }
  var passes = Math.max(2, roots.length + descendants.length + 2);
  while (passes-- > 0) {
    var attached = false;
    for (var i = 0; i < roots.length; i++) {
      var parent = roots[i].parentNode;
      if (parent) {
        attached = true;
        Node.prototype.removeChild.call(parent, roots[i]);
      }
    }
    for (var j = 0; j < descendants.length; j++) {
      var childParent = descendants[j].parentNode;
      if (childParent && !retained(descendants[j])) {
        attached = true;
        Node.prototype.removeChild.call(childParent, descendants[j]);
      }
    }
    if (!attached)
      return;
  }
  for (var i = 0; i < roots.length; i++) {
    if (roots[i].parentNode) {
      throw new Error('invalid Kokaine DOM cleanup: a removed node was synchronously reinserted');
    }
  }
  for (var j = 0; j < descendants.length; j++) {
    if (descendants[j].parentNode && !retained(descendants[j])) {
      throw new Error('invalid Kokaine DOM cleanup: a removed descendant escaped its range');
    }
  }
}
/** Backs `extern dom-stage-retirement`. */
function kokaineDomStageRetirement(first, last) {
  var rangeFirst = first;
  var rangeLast = last;
  var parent = rangeFirst && rangeFirst.parentNode;
  if (!parent)
    throw new Error('invalid Kokaine keyed retirement range: opening marker is detached');
  if (parent !== rangeLast.parentNode)
    throw new Error('invalid Kokaine keyed retirement range: endpoints have different parents');
  if (rangeFirst === rangeLast)
    throw new Error('invalid Kokaine keyed retirement range: endpoints are identical');
  var roots = [];
  var node = rangeFirst;
  while (node) {
    roots.push(node);
    if (node === rangeLast)
      break;
    node = node.nextSibling;
  }
  if (node !== rangeLast)
    throw new Error('invalid Kokaine keyed retirement range: closing marker is unreachable');
  var descendants = [];
  var pending = roots.slice();
  while (pending.length) {
    var current = pending.pop();
    var children = current && current.childNodes ? Array.prototype.slice.call(current.childNodes) : [];
    if (current && current.shadowRoot)
      children = children.concat(Array.prototype.slice.call(current.shadowRoot.childNodes));
    for (var i = 0; i < children.length; i++) {
      descendants.push(children[i]);
      pending.push(children[i]);
    }
  }
  var doc = rangeFirst.ownerDocument;
  var view = doc && doc.defaultView;
  var proto = view && view.Node && view.Node.prototype;
  if (!proto || typeof proto.removeChild !== 'function' || typeof proto.contains !== 'function')
    throw new Error('cannot stage Kokaine keyed retirement without its DOM realm');
  return { roots: roots, descendants: descendants, proto: proto };
}
/** Backs `extern dom-run-retirement`. */
function kokaineDomRunRetirement(handle) {
  if (!handle || !handle.roots)
    return;
  var roots = handle.roots;
  var descendants = handle.descendants;
  var proto = handle.proto;
  var removeChild = proto && proto.removeChild;
  var contains = proto && proto.contains;
  if (typeof removeChild !== 'function' || typeof contains !== 'function')
    throw new Error('cannot run Kokaine keyed retirement without its DOM realm');
  function retained(node) {
    var current = node;
    while (current) {
      for (var i = 0; i < roots.length; i++) {
        if (roots[i] === current || contains.call(roots[i], current))
          return true;
      }
      var tree = current.getRootNode ? current.getRootNode() : null;
      current = tree && tree.host ? tree.host : null;
    }
    return false;
  }
  function detach(node, escaped) {
    var parent = node && node.parentNode;
    if (!parent || (escaped && retained(node)))
      return;
    try {
      removeChild.call(parent, node);
    } catch (error) {
      if (node.parentNode && (!escaped || !retained(node)))
        throw error;
    }
  }
  var passes = Math.max(2, roots.length + descendants.length + 2);
  while (passes-- > 0) {
    for (var i = 0; i < roots.length; i++)
      detach(roots[i], false);
    for (var j = 0; j < descendants.length; j++)
      detach(descendants[j], true);
    var pending = false;
    for (var r = 0; r < roots.length; r++) {
      if (roots[r].parentNode) {
        pending = true;
        break;
      }
    }
    if (!pending) {
      for (var d = 0; d < descendants.length; d++) {
        if (descendants[d].parentNode && !retained(descendants[d])) {
          pending = true;
          break;
        }
      }
    }
    if (!pending)
      return;
  }
  throw new Error('invalid Kokaine DOM cleanup: staged keyed nodes were synchronously reinserted');
}
/** Backs `extern dom-release-retirement`. */
function kokaineDomReleaseRetirement(handle) {
  if (!handle)
    return;
  handle.roots = null;
  handle.descendants = null;
  handle.proto = null;
}
/** Backs `extern dom-append-html`. */
function kokaineDomAppendHtml(parent, content, root, portal) {
  var doc = parent && (parent.nodeType === 9 ? parent : parent.ownerDocument);
  if (!doc)
    throw new Error('cannot create Kokaine trusted HTML without an owner document');
  var template = doc.createElement('template');
  template.innerHTML = content;
  var tracker = globalThis[Symbol.for('kokaine.dom.shadow-roots')];
  if (!tracker || typeof tracker.remember !== 'function')
    throw new Error('cannot register Kokaine trusted HTML without shadow-root tracking');
  tracker.remember(template.content);
  var key = Symbol.for('kokaine.dom.owners');
  var registry = globalThis[key];
  if (!registry || !registry.owners || !registry.roots) {
    registry = { owners: new WeakMap(), roots: new WeakMap(), nextId: 1 };
    globalThis[key] = registry;
  }
  var ownerId = registry.roots.get(root);
  if (ownerId == null) {
    ownerId = registry.nextId++;
    registry.roots.set(root, ownerId);
  }
  var handles = [];
  Array.from(template.content.childNodes).forEach(function (child) {
    var entry = { ownerId: ownerId, portal: portal, retired: false };
    registry.owners.set(child, entry);
    handles.push({ node: child, ownerId: ownerId, entry: entry });
  });
  try {
    parent.appendChild(template.content);
    return handles;
  } catch (error) {
    handles.forEach(function (handle) {
      var entry = handle.entry;
      if (entry) {
        entry.portal = null;
        entry.retired = true;
      }
      if (registry.owners.get(handle.node) === entry)
        registry.owners.set(handle.node, entry);
      handle.node = null;
      handle.entry = null;
    });
    throw error;
  }
}
/** Backs `extern dom-insert-html-before`. */
function kokaineDomInsertHtmlBefore(parent, before, content, root, portal) {
  var doc = parent && (parent.nodeType === 9 ? parent : parent.ownerDocument);
  if (!doc)
    throw new Error('cannot create Kokaine trusted HTML without an owner document');
  var template = doc.createElement('template');
  template.innerHTML = content;
  var tracker = globalThis[Symbol.for('kokaine.dom.shadow-roots')];
  if (!tracker || typeof tracker.remember !== 'function')
    throw new Error('cannot register Kokaine trusted HTML without shadow-root tracking');
  tracker.remember(template.content);
  var key = Symbol.for('kokaine.dom.owners');
  var registry = globalThis[key];
  if (!registry || !registry.owners || !registry.roots) {
    registry = { owners: new WeakMap(), roots: new WeakMap(), nextId: 1 };
    globalThis[key] = registry;
  }
  var ownerId = registry.roots.get(root);
  if (ownerId == null) {
    ownerId = registry.nextId++;
    registry.roots.set(root, ownerId);
  }
  var handles = [];
  Array.from(template.content.childNodes).forEach(function (child) {
    var entry = { ownerId: ownerId, portal: portal, retired: false };
    registry.owners.set(child, entry);
    handles.push({ node: child, ownerId: ownerId, entry: entry });
  });
  try {
    parent.insertBefore(template.content, before);
    return handles;
  } catch (error) {
    handles.forEach(function (handle) {
      var entry = handle.entry;
      if (entry) {
        entry.portal = null;
        entry.retired = true;
      }
      if (registry.owners.get(handle.node) === entry)
        registry.owners.set(handle.node, entry);
      handle.node = null;
      handle.entry = null;
    });
    throw error;
  }
}
/** Backs `extern dom-listen`. */
function kokaineDomListen(value, name, action) {
  var state = { action: action };
  var f = function (ev) {
    var current = state.action;
    return current ? current(ev) : undefined;
  };
  f.__kokaineListenerState = state;
  try {
    (value).addEventListener(name, f);
    return f;
  } catch (error) {
    state.action = null;
    try {
      (value).removeEventListener(name, f);
    } catch (_) {
    }
    throw error;
  }
}
/** Backs `extern dom-retire-listener`. */
function kokaineDomRetireListener(listener) {
  var state = (listener).__kokaineListenerState;
  if (state)
    state.action = null;
}
/** Backs `extern raw-event-value`. */
function kokaineDomRawEventValue(value) {
  var t = (value).currentTarget || (value).target;
  return (t && t.value != null ? String(t.value) : '');
}
/** Backs `extern raw-event-checked`. */
function kokaineDomRawEventChecked(value) {
  var t = (value).currentTarget || (value).target;
  return !!(t && t.checked);
}
/** Backs `extern dom-require-dialog-target`. */
function kokaineDomRequireDialogTarget(target, message) {
  if (typeof HTMLDialogElement !== 'function')
    throw new Error('HTMLDialogElement is not supported by this browser');
  var descriptor = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'open');
  if (!descriptor || typeof descriptor.get !== 'function')
    throw new Error('HTMLDialogElement.open is not supported by this browser');
  try {
    Reflect.apply(descriptor.get, target, []);
  } catch (_) {
    throw new TypeError(message);
  }
}
/** Backs `extern dom-require-element-target`. */
function kokaineDomRequireElementTarget(target, message) {
  if (typeof Element !== 'function')
    throw new Error('Element is not supported by this browser');
  var descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'localName');
  if (!descriptor || typeof descriptor.get !== 'function')
    throw new Error('Element.localName is not supported by this browser');
  try {
    Reflect.apply(descriptor.get, target, []);
  } catch (_) {
    throw new TypeError(message);
  }
}
/** Backs `extern dom-require-popover-target`. */
function kokaineDomRequirePopoverTarget(target, message) {
  if (typeof HTMLElement !== 'function')
    throw new Error('HTMLElement is not supported by this browser');
  var descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'popover');
  if (!descriptor || typeof descriptor.get !== 'function')
    throw new Error('HTMLElement.popover is not supported by this browser');
  var mode;
  try {
    mode = Reflect.apply(descriptor.get, target, []);
  } catch (_) {
    throw new TypeError(message);
  }
  if (mode !== 'auto' && mode !== 'manual' && mode !== 'hint')
    throw new TypeError(message);
}
/** Backs `extern dom-dialog-show`. */
function kokaineDomDialogShow(target) {
  if (typeof target.show !== 'function')
    throw new Error('HTMLDialogElement.show() is not supported by this browser');
  target.show();
}
/** Backs `extern dom-dialog-show-modal`. */
function kokaineDomDialogShowModal(target) {
  if (typeof target.showModal !== 'function')
    throw new Error('HTMLDialogElement.showModal() is not supported by this browser');
  target.showModal();
}
/** Backs `extern dom-dialog-close`. */
function kokaineDomDialogClose(target, result) {
  if (typeof target.close !== 'function')
    throw new Error('HTMLDialogElement.close() is not supported by this browser');
  target.close(result);
}
/** Backs `extern dom-dialog-request-close`. */
function kokaineDomDialogRequestClose(target, result) {
  if (typeof target.requestClose !== 'function')
    throw new Error('HTMLDialogElement.requestClose() is not supported by this browser');
  target.requestClose(result);
}
/** Backs `extern dom-dialog-is-modal`. */
function kokaineDomDialogIsModal(target) {
  if (typeof Element !== 'function' || typeof Element.prototype.matches !== 'function')
    throw new Error('Element.matches() is not supported by this browser');
  try {
    return Reflect.apply(Element.prototype.matches, target, [':modal']);
  } catch (error) {
    if (!error || error.name !== 'SyntaxError')
      throw error;
  }
  if (typeof HTMLDialogElement !== 'function')
    throw new Error('HTMLDialogElement is not supported by this browser');
  var openDescriptor = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'open');
  var showModal = HTMLDialogElement.prototype.showModal;
  if (!openDescriptor || typeof openDescriptor.get !== 'function')
    throw new Error('HTMLDialogElement.open is not supported by this browser');
  if (typeof showModal !== 'function')
    throw new Error('HTMLDialogElement.showModal() is not supported by this browser');
  if (!Reflect.apply(openDescriptor.get, target, []))
    return false;
  try {
    Reflect.apply(showModal, target, []);
    return true;
  } catch (error) {
    if (error && error.name === 'InvalidStateError')
      return false;
    throw error;
  }
}
/** Backs `extern dom-popover-show`. */
function kokaineDomPopoverShow(target) {
  if (typeof target.showPopover !== 'function')
    throw new Error('Element.showPopover() is not supported by this browser');
  target.showPopover();
}
/** Backs `extern dom-popover-hide`. */
function kokaineDomPopoverHide(target) {
  if (typeof target.hidePopover !== 'function')
    throw new Error('Element.hidePopover() is not supported by this browser');
  target.hidePopover();
}
/** Backs `extern dom-popover-toggle`. */
function kokaineDomPopoverToggle(target) {
  if (typeof target.togglePopover !== 'function')
    throw new Error('Element.togglePopover() is not supported by this browser');
  target.togglePopover();
  if (typeof target.matches !== 'function')
    throw new Error('Element.matches() is not supported by this browser');
  return target.matches(':popover-open');
}
/** Backs `extern dom-popover-set-open`. */
function kokaineDomPopoverSetOpen(target, open) {
  if (typeof target.togglePopover !== 'function')
    throw new Error('Element.togglePopover() is not supported by this browser');
  if (typeof Node !== 'function')
    throw new Error('Node is not supported by this browser');
  if (typeof Document !== 'function')
    throw new Error('Document is not supported by this browser');
  if (typeof Element !== 'function' || typeof Element.prototype.matches !== 'function')
    throw new Error('Element.matches() is not supported by this browser');
  var connectedDescriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'isConnected');
  var documentDescriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'ownerDocument');
  var viewDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'defaultView');
  if (!connectedDescriptor || typeof connectedDescriptor.get !== 'function')
    throw new Error('Node.isConnected is not supported by this browser');
  if (!documentDescriptor || typeof documentDescriptor.get !== 'function')
    throw new Error('Node.ownerDocument is not supported by this browser');
  if (!viewDescriptor || typeof viewDescriptor.get !== 'function')
    throw new Error('Document.defaultView is not supported by this browser');
  var nativeMatches = Element.prototype.matches;
  var matches = function (selector) {
    return Reflect.apply(nativeMatches, target, [selector]);
  };
  var current = matches(':popover-open');
  var desired = !!open;
  if (current !== desired) {
    target.togglePopover();
    return;
  }
  if (desired) {
    if (typeof target.showPopover !== 'function')
      throw new Error('Element.showPopover() is not supported by this browser');
    target.showPopover();
    return;
  }
  var doc = Reflect.apply(documentDescriptor.get, target, []);
  var view = Reflect.apply(viewDescriptor.get, doc, []);
  var connected = Reflect.apply(connectedDescriptor.get, target, []);
  var inactive = !connected || !view;
  if (!inactive) {
    try {
      if (view.document !== doc)
        inactive = true;
      while (!inactive && view.parent !== view) {
        var parent = view.parent;
        var listed = false;
        for (var i = 0; i < parent.length; i++) {
          if (parent[i] === view) {
            listed = true;
            break;
          }
        }
        if (!listed) {
          inactive = true;
          break;
        }
        view = parent;
      }
    } catch (_) {
      inactive = true;
    }
  }
  if (inactive || matches(':modal'))
    target.togglePopover();
}
/** Backs `extern dom-popover-is-open`. */
function kokaineDomPopoverIsOpen(target) {
  if (typeof target.matches !== 'function')
    throw new Error('Element.matches() is not supported by this browser');
  return target.matches(':popover-open');
}
/** Backs `extern dom-toggle-state`. */
function kokaineDomToggleState(event) {
  if (!event || typeof event !== 'object')
    throw new TypeError('toggle/state requires a DOM event');
  if (event.type !== 'toggle' && event.type !== 'beforetoggle')
    throw new TypeError('toggle/state requires a toggle or beforetoggle event');
  var target = event.currentTarget;
  if (typeof Element !== 'function')
    throw new Error('Element is not supported by this browser');
  var descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'localName');
  if (!descriptor || typeof descriptor.get !== 'function')
    throw new Error('Element.localName is not supported by this browser');
  try {
    Reflect.apply(descriptor.get, target, []);
  } catch (_) {
    throw new TypeError('toggle/state event must have an Element currentTarget');
  }
  if (event.newState === 'open')
    return 1;
  if (event.newState === 'closed')
    return 0;
  throw new TypeError('toggle/state event must have an open or closed newState');
}
/** Backs `extern dom-dialog-event-return-value`. */
function kokaineDomDialogEventReturnValue(event) {
  if (!event || typeof event !== 'object' || event.type !== 'close')
    throw new TypeError('dialog/event-return-value requires a close event');
  var target = event.currentTarget;
  if (typeof HTMLDialogElement !== 'function')
    throw new Error('HTMLDialogElement is not supported by this browser');
  var descriptor = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'open');
  if (!descriptor || typeof descriptor.get !== 'function')
    throw new Error('HTMLDialogElement.open is not supported by this browser');
  try {
    Reflect.apply(descriptor.get, target, []);
  } catch (_) {
    throw new TypeError('dialog/event-return-value event must have an HTMLDialogElement currentTarget');
  }
  return String(target.returnValue);
}
 
// type declarations
// type dom-listener
export function Dom_listener(value) /* (value : any) -> dom-listener */  {
  return value;
}
// type dom-owner-registration
export function Dom_owner_registration(value) /* (value : any) -> dom-owner-registration */  {
  return value;
}
// type dom-retirement
export function Dom_retirement(value) /* (value : any) -> dom-retirement */  {
  return value;
}
// type element
export function Dom_element(value) /* (value : any) -> element */  {
  return value;
}
// type keyed-participation
export function Keyed_owned(keyed_provision, keyed_lease, keyed_journal) /* (keyed-provision : kokaine/reactive/integration/provision<ui>, keyed-lease : kokaine/reactive/integration/provision-lease<ui>, keyed-journal : kokaine/dom/internal/keyed-transaction/keyed-transaction) -> keyed-participation */  {
  return { _tag: 1, keyed_provision: keyed_provision, keyed_lease: keyed_lease, keyed_journal: keyed_journal };
}
export function Keyed_joined(keyed_provision, keyed_journal) /* (keyed-provision : kokaine/reactive/integration/provision<ui>, keyed-journal : kokaine/dom/internal/keyed-transaction/keyed-transaction) -> keyed-participation */  {
  return { _tag: 2, keyed_provision: keyed_provision, keyed_journal: keyed_journal };
}
// type node
export function Dom_node(value) /* (value : any) -> node */  {
  return value;
}
// type keyed-row
export function Keyed_row(row_key, row_current_item, row_current_index, row_item_source, row_index_source, row_scope, row_first, row_last) /* forall<e,a,b> (row-key : b, row-current-item : ref<global,a>, row-current-index : ref<global,int>, row-item-source : kokaine/reactive/signal<a>, row-index-source : kokaine/reactive/signal<int>, row-scope : kokaine/reactive/integration/lifetime-scope<ui>, row-first : node, row-last : node) -> keyed-row<e,a,b> */  {
  return { row_key: row_key, row_current_item: row_current_item, row_current_index: row_current_index, row_item_source: row_item_source, row_index_source: row_index_source, row_scope: row_scope, row_first: row_first, row_last: row_last };
}
// type keyed-retirement
export function Keyed_retirement(retirement_row, retirement_handle) /* forall<e,a,b> (retirement-row : keyed-row<e,a,b>, retirement-handle : dom-retirement) -> keyed-retirement<e,a,b> */  {
  return { retirement_row: retirement_row, retirement_handle: retirement_handle };
}
// type keyed-table
export function Keyed_table(table_index, table_order, table_retirements) /* forall<e,a,b> (table-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, table-order : list<keyed-row<e,a,b>>, table-retirements : list<keyed-retirement<e,a,b>>) -> keyed-table<e,a,b> */  {
  return { table_index: table_index, table_order: table_order, table_retirements: table_retirements };
}
// type keyed-update
export function Keyed_update(update_row, update_item, update_index, update_item_changed, update_index_changed) /* forall<e,a,b> (update-row : keyed-row<e,a,b>, update-item : a, update-index : int, update-item-changed : bool, update-index-changed : bool) -> keyed-update<e,a,b> */  {
  return { update_row: update_row, update_item: update_item, update_index: update_index, update_item_changed: update_item_changed, update_index_changed: update_index_changed };
}
// type owner-match
export const Owner_none = { _tag: 1 }; // owner-match
export function Owner_live(owner_portal) /* (owner-portal : kokaine/reactive/integration/reentry<ui>) -> owner-match */  {
  return { _tag: 2, owner_portal: owner_portal };
}
export const Owner_retired = { _tag: 3 }; // owner-match
// type raw-event
export function Raw_event(value) /* (value : any) -> raw-event */  {
  return value;
}
// type toggle-state
export const Toggle_open = 1; // toggle-state
export const Toggle_closed = 2; // toggle-state
 
// declarations
 
 
// Automatically generated. Retrieves the `value` constructor field of the `:node` type.
export function node_fs_value(node) /* (node : node) -> any */  {
  return node;
}
 
export function node_fs__copy(_this, value) /* (node, value : ? any) -> node */  {
  if (value !== undefined) {
    var _x0 = value;
  }
  else {
    var _x0 = _this;
  }
  return _x0;
}
 
 
// Automatically generated. Retrieves the `value` constructor field of the `:element` type.
export function element_fs_value(element) /* (element : element) -> any */  {
  return element;
}
 
export function element_fs__copy(_this, value) /* (element, value : ? any) -> element */  {
  if (value !== undefined) {
    var _x1 = value;
  }
  else {
    var _x1 = _this;
  }
  return _x1;
}
 
 
// Automatically generated. Retrieves the `value` constructor field of the `:raw-event` type.
export function raw_event_fs_value(_this) /* (raw-event) -> any */  {
  return _this;
}
 
export function raw_event_fs__copy(_this, value) /* (raw-event, value : ? any) -> raw-event */  {
  if (value !== undefined) {
    var _x2 = value;
  }
  else {
    var _x2 = _this;
  }
  return _x2;
}
 
 
// Automatically generated. Retrieves the `value` constructor field of the `:dom-listener` type.
export function dom_listener_fs_value(_this) /* (dom-listener) -> any */  {
  return _this;
}
 
export function dom_listener_fs__copy(_this, value) /* (dom-listener, value : ? any) -> dom-listener */  {
  if (value !== undefined) {
    var _x3 = value;
  }
  else {
    var _x3 = _this;
  }
  return _x3;
}
 
 
// Automatically generated. Retrieves the `value` constructor field of the `:dom-owner-registration` type.
export function dom_owner_registration_fs_value(_this) /* (dom-owner-registration) -> any */  {
  return _this;
}
 
export function dom_owner_registration_fs__copy(_this, value) /* (dom-owner-registration, value : ? any) -> dom-owner-registration */  {
  if (value !== undefined) {
    var _x4 = value;
  }
  else {
    var _x4 = _this;
  }
  return _x4;
}
 
 
// Automatically generated. Retrieves the `value` constructor field of the `:dom-retirement` type.
export function dom_retirement_fs_value(_this) /* (dom-retirement) -> any */  {
  return _this;
}
 
export function dom_retirement_fs__copy(_this, value) /* (dom-retirement, value : ? any) -> dom-retirement */  {
  if (value !== undefined) {
    var _x5 = value;
  }
  else {
    var _x5 = _this;
  }
  return _x5;
}
 
 
// Automatically generated. Tests for the `Owner-none` constructor of the `:owner-match` type.
export function is_owner_none(owner_match) /* (owner-match : owner-match) -> bool */  {
  return (owner_match._tag === 1);
}
 
 
// Automatically generated. Tests for the `Owner-live` constructor of the `:owner-match` type.
export function is_owner_live(owner_match) /* (owner-match : owner-match) -> bool */  {
  return (owner_match._tag === 2);
}
 
 
// Automatically generated. Tests for the `Owner-retired` constructor of the `:owner-match` type.
export function is_owner_retired(owner_match) /* (owner-match : owner-match) -> bool */  {
  return (owner_match._tag === 3);
}
 
 
// Automatically generated. Tests for the `Toggle-open` constructor of the `:toggle-state` type.
export function is_toggle_open(toggle_state) /* (toggle-state : toggle-state) -> bool */  {
  return (toggle_state === 1);
}
 
 
// Automatically generated. Tests for the `Toggle-closed` constructor of the `:toggle-state` type.
export function is_toggle_closed(toggle_state) /* (toggle-state : toggle-state) -> bool */  {
  return (toggle_state === 2);
}
 
 
// Automatically generated. Retrieves the `row-key` constructor field of the `:keyed-row` type.
export function keyed_row_fs_row_key(_this) /* forall<e,a,b> (keyed-row<e,a,b>) -> b */  {
  return _this.row_key;
}
 
 
// Automatically generated. Retrieves the `row-current-item` constructor field of the `:keyed-row` type.
export function keyed_row_fs_row_current_item(_this) /* forall<e,a,b> (keyed-row<e,a,b>) -> ref<global,a> */  {
  return _this.row_current_item;
}
 
 
// Automatically generated. Retrieves the `row-current-index` constructor field of the `:keyed-row` type.
export function keyed_row_fs_row_current_index(_this) /* forall<e,a,b> (keyed-row<e,a,b>) -> ref<global,int> */  {
  return _this.row_current_index;
}
 
 
// Automatically generated. Retrieves the `row-item-source` constructor field of the `:keyed-row` type.
export function keyed_row_fs_row_item_source(_this) /* forall<e,a,b> (keyed-row<e,a,b>) -> kokaine/reactive/signal<a> */  {
  return _this.row_item_source;
}
 
 
// Automatically generated. Retrieves the `row-index-source` constructor field of the `:keyed-row` type.
export function keyed_row_fs_row_index_source(_this) /* forall<e,a,b> (keyed-row<e,a,b>) -> kokaine/reactive/signal<int> */  {
  return _this.row_index_source;
}
 
 
// Automatically generated. Retrieves the `row-scope` constructor field of the `:keyed-row` type.
export function keyed_row_fs_row_scope(_this) /* forall<e,a,b> (keyed-row<e,a,b>) -> kokaine/reactive/integration/lifetime-scope<ui> */  {
  return _this.row_scope;
}
 
 
// Automatically generated. Retrieves the `row-first` constructor field of the `:keyed-row` type.
export function keyed_row_fs_row_first(_this) /* forall<e,a,b> (keyed-row<e,a,b>) -> node */  {
  return _this.row_first;
}
 
 
// Automatically generated. Retrieves the `row-last` constructor field of the `:keyed-row` type.
export function keyed_row_fs_row_last(_this) /* forall<e,a,b> (keyed-row<e,a,b>) -> node */  {
  return _this.row_last;
}
 
export function keyed_row_fs__copy(_this, row_key, row_current_item, row_current_index, row_item_source, row_index_source, row_scope, row_first, row_last) /* forall<e,a,b> (keyed-row<e,a,b>, row-key : ? b, row-current-item : ? (ref<global,a>), row-current-index : ? (ref<global,int>), row-item-source : ? (kokaine/reactive/signal<a>), row-index-source : ? (kokaine/reactive/signal<int>), row-scope : ? (kokaine/reactive/integration/lifetime-scope<ui>), row-first : ? node, row-last : ? node) -> keyed-row<e,a,b> */  {
  if (row_key !== undefined) {
    var _x6 = row_key;
  }
  else {
    var _x6 = _this.row_key;
  }
  if (row_current_item !== undefined) {
    var _x7 = row_current_item;
  }
  else {
    var _x7 = _this.row_current_item;
  }
  if (row_current_index !== undefined) {
    var _x8 = row_current_index;
  }
  else {
    var _x8 = _this.row_current_index;
  }
  if (row_item_source !== undefined) {
    var _x9 = row_item_source;
  }
  else {
    var _x9 = _this.row_item_source;
  }
  if (row_index_source !== undefined) {
    var _x10 = row_index_source;
  }
  else {
    var _x10 = _this.row_index_source;
  }
  if (row_scope !== undefined) {
    var _x11 = row_scope;
  }
  else {
    var _x11 = _this.row_scope;
  }
  if (row_first !== undefined) {
    var _x12 = row_first;
  }
  else {
    var _x12 = _this.row_first;
  }
  if (row_last !== undefined) {
    var _x13 = row_last;
  }
  else {
    var _x13 = _this.row_last;
  }
  return Keyed_row(_x6, _x7, _x8, _x9, _x10, _x11, _x12, _x13);
}
 
 
// Automatically generated. Retrieves the `update-row` constructor field of the `:keyed-update` type.
export function keyed_update_fs_update_row(_this) /* forall<e,a,b> (keyed-update<e,a,b>) -> keyed-row<e,a,b> */  {
  return _this.update_row;
}
 
 
// Automatically generated. Retrieves the `update-item` constructor field of the `:keyed-update` type.
export function keyed_update_fs_update_item(_this) /* forall<e,a,b> (keyed-update<e,a,b>) -> a */  {
  return _this.update_item;
}
 
 
// Automatically generated. Retrieves the `update-index` constructor field of the `:keyed-update` type.
export function keyed_update_fs_update_index(_this) /* forall<e,a,b> (keyed-update<e,a,b>) -> int */  {
  return _this.update_index;
}
 
 
// Automatically generated. Retrieves the `update-item-changed` constructor field of the `:keyed-update` type.
export function keyed_update_fs_update_item_changed(_this) /* forall<e,a,b> (keyed-update<e,a,b>) -> bool */  {
  return _this.update_item_changed;
}
 
 
// Automatically generated. Retrieves the `update-index-changed` constructor field of the `:keyed-update` type.
export function keyed_update_fs_update_index_changed(_this) /* forall<e,a,b> (keyed-update<e,a,b>) -> bool */  {
  return _this.update_index_changed;
}
 
export function keyed_update_fs__copy(_this, update_row, update_item, update_index, update_item_changed, update_index_changed) /* forall<e,a,b> (keyed-update<e,a,b>, update-row : ? (keyed-row<e,a,b>), update-item : ? a, update-index : ? int, update-item-changed : ? bool, update-index-changed : ? bool) -> keyed-update<e,a,b> */  {
  if (update_row !== undefined) {
    var _x14 = update_row;
  }
  else {
    var _x14 = _this.update_row;
  }
  if (update_item !== undefined) {
    var _x15 = update_item;
  }
  else {
    var _x15 = _this.update_item;
  }
  if (update_index !== undefined) {
    var _x16 = update_index;
  }
  else {
    var _x16 = _this.update_index;
  }
  if (update_item_changed !== undefined) {
    var _x17 = update_item_changed;
  }
  else {
    var _x17 = _this.update_item_changed;
  }
  if (update_index_changed !== undefined) {
    var _x18 = update_index_changed;
  }
  else {
    var _x18 = _this.update_index_changed;
  }
  return Keyed_update(_x14, _x15, _x16, _x17, _x18);
}
 
 
// Automatically generated. Retrieves the `retirement-row` constructor field of the `:keyed-retirement` type.
export function keyed_retirement_fs_retirement_row(_this) /* forall<e,a,b> (keyed-retirement<e,a,b>) -> keyed-row<e,a,b> */  {
  return _this.retirement_row;
}
 
 
// Automatically generated. Retrieves the `retirement-handle` constructor field of the `:keyed-retirement` type.
export function keyed_retirement_fs_retirement_handle(_this) /* forall<e,a,b> (keyed-retirement<e,a,b>) -> dom-retirement */  {
  return _this.retirement_handle;
}
 
export function keyed_retirement_fs__copy(_this, retirement_row, retirement_handle) /* forall<e,a,b> (keyed-retirement<e,a,b>, retirement-row : ? (keyed-row<e,a,b>), retirement-handle : ? dom-retirement) -> keyed-retirement<e,a,b> */  {
  if (retirement_row !== undefined) {
    var _x19 = retirement_row;
  }
  else {
    var _x19 = _this.retirement_row;
  }
  if (retirement_handle !== undefined) {
    var _x20 = retirement_handle;
  }
  else {
    var _x20 = _this.retirement_handle;
  }
  return Keyed_retirement(_x19, _x20);
}
 
 
// Automatically generated. Retrieves the `table-index` constructor field of the `:keyed-table` type.
export function keyed_table_fs_table_index(_this) /* forall<e,a,b> (keyed-table<e,a,b>) -> kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>> */  {
  return _this.table_index;
}
 
 
// Automatically generated. Retrieves the `table-order` constructor field of the `:keyed-table` type.
export function keyed_table_fs_table_order(_this) /* forall<e,a,b> (keyed-table<e,a,b>) -> list<keyed-row<e,a,b>> */  {
  return _this.table_order;
}
 
 
// Automatically generated. Retrieves the `table-retirements` constructor field of the `:keyed-table` type.
export function keyed_table_fs_table_retirements(_this) /* forall<e,a,b> (keyed-table<e,a,b>) -> list<keyed-retirement<e,a,b>> */  {
  return _this.table_retirements;
}
 
export function keyed_table_fs__copy(_this, table_index, table_order, table_retirements) /* forall<e,a,b> (keyed-table<e,a,b>, table-index : ? (kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>), table-order : ? (list<keyed-row<e,a,b>>), table-retirements : ? (list<keyed-retirement<e,a,b>>)) -> keyed-table<e,a,b> */  {
  if (table_index !== undefined) {
    var _x21 = table_index;
  }
  else {
    var _x21 = _this.table_index;
  }
  if (table_order !== undefined) {
    var _x22 = table_order;
  }
  else {
    var _x22 = _this.table_order;
  }
  if (table_retirements !== undefined) {
    var _x23 = table_retirements;
  }
  else {
    var _x23 = _this.table_retirements;
  }
  return Keyed_table(_x21, _x22, _x23);
}
 
 
// Automatically generated. Tests for the `Keyed-owned` constructor of the `:keyed-participation` type.
export function is_keyed_owned(keyed_participation) /* (keyed-participation : keyed-participation) -> bool */  {
  return (keyed_participation._tag === 1);
}
 
 
// Automatically generated. Retrieves the `keyed-provision` constructor field of the `:keyed-participation` type.
export function keyed_participation_fs_keyed_provision(_this) /* (keyed-participation) -> kokaine/reactive/integration/provision<ui> */  {
  return (_this._tag === 1) ? _this.keyed_provision : _this.keyed_provision;
}
 
 
// Automatically generated. Retrieves the `keyed-journal` constructor field of the `:keyed-participation` type.
export function keyed_participation_fs_keyed_journal(_this) /* (keyed-participation) -> kokaine/dom/internal/keyed-transaction/keyed-transaction */  {
  return (_this._tag === 1) ? _this.keyed_journal : _this.keyed_journal;
}
 
 
// Automatically generated. Tests for the `Keyed-joined` constructor of the `:keyed-participation` type.
export function is_keyed_joined(keyed_participation) /* (keyed-participation : keyed-participation) -> bool */  {
  return (keyed_participation._tag === 2);
}
 
export function keyed_participation_fs_journal(current) /* (current : keyed-participation) -> kokaine/dom/internal/keyed-transaction/keyed-transaction */  {
  return (current._tag === 1) ? current.keyed_journal : current.keyed_journal;
}
 
export function keyed_participation_fs_is_owned(current) /* (current : keyed-participation) -> bool */  {
  return (current._tag === 1);
}
 
 
// monadic lift
export function _mlift_open_keyed_participation_11389(_y_x10271) /* (kokaine/reactive/integration/internal/provision/provision-lease<ui>) -> exn keyed-participation */  {
   
  var lease = _y_x10271;
   
  var current = $std_core_hnd._open_none1(function(lease_0 /* kokaine/reactive/integration/provision-lease<ui> */ ) {
      var _x24 = lease_0;
      return _x24;
    }, lease);
  return Keyed_owned(current, lease, $std_core_hnd._open_none0($kokaine_dom_internal_keyed_dash_transaction.new_keyed_transaction));
}
 
 
// monadic lift
export function _mlift_open_keyed_participation_11390(current_0, _y_x10272) /* (current@0 : kokaine/reactive/integration/provision<ui>, kokaine/dom/internal/keyed-transaction/keyed-transaction) -> exn keyed-participation */  {
  return Keyed_joined(current_0, _y_x10272);
}
 
 
// monadic lift
export function _mlift_open_keyed_participation_11391(renderer, root, _y_x10270) /* (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, maybe<kokaine/reactive/integration/provision<ui>>) -> exn keyed-participation */  {
  if (_y_x10270 === null) {
     
    var x_11566 = $kokaine_reactive_integration_internal_provision.open_provision($std_core_hnd._open_none1(function(value /* kokaine/reactive/root<ui> */ ) {
        return value;
      }, root));
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(_mlift_open_keyed_participation_11389);
    }
    else {
      return _mlift_open_keyed_participation_11389(x_11566);
    }
  }
  else {
     
    var x_0_11568 = $kokaine_dom_internal_keyed_dash_transaction.current_keyed_transaction(renderer, _y_x10270.value);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10272 /* kokaine/dom/internal/keyed-transaction/keyed-transaction */ ) {
        return Keyed_joined(_y_x10270.value, _y_x10272);
      });
    }
    else {
      return Keyed_joined(_y_x10270.value, x_0_11568);
    }
  }
}
 
export function open_keyed_participation(renderer, root) /* (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>) -> exn keyed-participation */  {
   
  var x_11572 = $kokaine_reactive_integration.current_provision(root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10270 /* maybe<kokaine/reactive/integration/provision<ui>> */ ) {
      return _mlift_open_keyed_participation_11391(renderer, root, _y_x10270);
    });
  }
  else {
    if (x_11572 === null) {
       
      var x_0_11575 = $kokaine_reactive_integration_internal_provision.open_provision($std_core_hnd._open_none1(function(value /* kokaine/reactive/root<ui> */ ) {
          return value;
        }, root));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_open_keyed_participation_11389);
      }
      else {
         
        var lease = x_0_11575;
         
        var current = $std_core_hnd._open_none1(function(lease_0 /* kokaine/reactive/integration/provision-lease<ui> */ ) {
            var _x24 = lease_0;
            return _x24;
          }, lease);
        return Keyed_owned(current, lease, $std_core_hnd._open_none0($kokaine_dom_internal_keyed_dash_transaction.new_keyed_transaction));
      }
    }
    else {
       
      var x_1_11578 = $kokaine_dom_internal_keyed_dash_transaction.current_keyed_transaction(renderer, x_11572.value);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10272 /* kokaine/dom/internal/keyed-transaction/keyed-transaction */ ) {
          return Keyed_joined(x_11572.value, _y_x10272);
        });
      }
      else {
        return Keyed_joined(x_11572.value, x_1_11578);
      }
    }
  }
}
 
export function drain_keyed_participation(renderer, current) /* (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, current : keyed-participation) -> <pure,ui> () */  {
  if (current._tag === 1) {
    return $kokaine_dom_internal_keyed_dash_transaction.with_keyed_transaction(renderer, current.keyed_provision, current.keyed_journal, function() {
        return $kokaine_reactive_integration_internal_provision.drain_provision($std_core_hnd._open_none1(function(value /* kokaine/reactive/integration/provision-lease<ui> */ ) {
            return value;
          }, current.keyed_lease));
      });
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function promote_keyed_participation(current) /* (current : keyed-participation) -> <pure,ui> () */  {
  if (current._tag === 1) {
    return $kokaine_reactive_integration_internal_provision.promote_provision($std_core_hnd._open_none1(function(value /* kokaine/reactive/integration/provision-lease<ui> */ ) {
        return value;
      }, current.keyed_lease));
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function discard_keyed_participation(current) /* (current : keyed-participation) -> <exn,ui> () */  {
  if (current._tag === 1) {
    return $std_core_hnd.finally_prompt(function() {
        return $kokaine_dom_internal_keyed_dash_transaction.abort_keyed_transaction(current.keyed_journal);
      }, $kokaine_reactive_integration_internal_provision.discard_provision($std_core_hnd._open_none1(function(value /* kokaine/reactive/integration/provision-lease<ui> */ ) {
          return value;
        }, current.keyed_lease)));
  }
  else {
    return $std_core_types.Unit;
  }
}
 
 
// Transaction state must survive abortive control while mount bootstraps are
// flushing. Keep this adapter-local and inaccessible to user code.
export function transaction_cell(value) /* forall<a> (value : a) -> ref<global,a> */  {
  return { value: value };
}
 
export function transaction_load(value) /* forall<a> (value : ref<global,a>) -> a */  {
  return value.value;
}
 
export function transaction_store(target, value) /* forall<a> (target : ref<global,a>, value : a) -> () */  {
  return ((target).value = value);
}
 
export function query_raw(selector) /* (selector : string) -> ui any */  {
  return document.querySelector(selector);
}
 
export function any_is_null(value) /* (value : any) -> bool */  {
  return (value == null);
}
 
export function any_node(value) /* (value : any) -> node */  {
  return value;
}
 
export function any_reentry(value) /* (value : any) -> kokaine/reactive/integration/reentry<ui> */  {
  return value;
}
 
 
// JavaScript DOM APIs throw native exceptions, which do not automatically
// become Koka's `exn` effect. Keep raw exceptions inside this tiny result box
// and rethrow them through Koka so handler/finally state is always restored.
export function dom_attempt_raw(action) /* forall<a> (action : () -> ui a) -> ui any */  {
  return kokaineDomAttemptRaw(action);
}
 
export function dom_attempt_ok(result) /* (result : any) -> bool */  {
  return !!(result).ok;
}
 
export function dom_attempt_value(result) /* forall<a> (result : any) -> a */  {
  return (result).value;
}
 
export function dom_attempt_message(result) /* (result : any) -> string */  {
  return String((result).message);
}
 
 
// Closed shadow roots are intentionally opaque, so a keyed move cannot inspect
// them for custom-element callbacks after the fact. Install one wrapper per DOM
// realm before mount construction and remember both observed closed hosts and
// elements whose provenance proves that they had no pre-existing closed root.
// If another host shim (Sentry replay, shadydom, scoped-registry polyfills)
// later replaces the wrapper, mounting continues and only keyed moves fail
// closed, because their validator re-checks the wrapper itself. As with
// the rest of the DOM adapter, direct calls through deliberately retained or
// foreign native primitives are outside the cooperative host contract.
export function dom_install_shadow_tracker(parent) /* (parent : node) -> ui () */  {
  return kokaineDomInstallShadowTracker(parent);
}
 
 
// The namespace follows the HTML parser's rules so SVG and MathML created by
// the DOM adapter match what SSR markup parses into: `svg` and `math` switch
// namespace, children inherit it, and `foreignObject` or a MathML text
// integration point returns to HTML.
export function dom_create_element(parent, name) /* (parent : node, name : string) -> ui element */  {
  return kokaineDomCreateElement(parent,name);
}
 
export function dom_create_text(value) /* (value : string) -> ui node */  {
  return document.createTextNode(value);
}
 
export function dom_create_comment(value) /* (value : string) -> ui node */  {
  return document.createComment(value);
}
 
export function element_node(value) /* (value : element) -> node */  {
  return value;
}
 
 
// Nodes created by a managed generation remember its structural re-entry
// capability. The registry gives each live root a weakly keyed numeric ID:
// retired node tombstones can therefore reject stale same-root adoption without
// retaining the root or its generation portal.
export function dom_record_owner(value, root, portal) /* (value : node, root : kokaine/reactive/root<ui>, portal : kokaine/reactive/integration/reentry<ui>) -> ui dom-owner-registration */  {
  return kokaineDomRecordOwner(value,root,portal);
}
 
export function dom_retire_owners(value) /* (value : dom-owner-registration) -> ui () */  {
  return kokaineDomRetireOwners(value);
}
 
export function dom_find_owner(value, root) /* (value : node, root : kokaine/reactive/root<ui>) -> ui any */  {
  return kokaineDomFindOwner(value,root);
}
 
export function dom_owner_state(value) /* (value : any) -> int */  {
  return Number((value).state);
}
 
export function dom_owner_portal(value) /* (value : any) -> any */  {
  return (value).portal;
}
 
export function dom_append(parent, child) /* (parent : node, child : node) -> ui () */  {
  return (parent).appendChild(child);
}
 
export function dom_insert_before(parent, child, before) /* (parent : node, child : node, before : node) -> ui () */  {
  return (parent).insertBefore(child,before);
}
 
 
// Assemble boundary markers off-tree and publish them with one host mutation.
// If the final append/insert throws, neither endpoint has become observable in
// the target DOM.
export function dom_append_marker_pair(parent, first, last) /* (parent : node, first : node, last : node) -> ui () */  {
  return kokaineDomAppendMarkerPair(parent,first,last);
}
 
export function dom_insert_marker_pair_before(parent, first, last, before) /* (parent : node, first : node, last : node, before : node) -> ui () */  {
  return kokaineDomInsertMarkerPairBefore(parent,first,last,before);
}
 
export function dom_same_node(left, right) /* (left : node, right : node) -> bool */  {
  return (left === right);
}
 
 
// Validate a complete managed range before exposing either cursor.  The DOM
// can be mutated by application JavaScript, custom-element callbacks, or test
// fault injection, so reconciliation never trusts retained marker handles.
export function dom_range_first(parent, first, last) /* (parent : node, first : node, last : node) -> ui node */  {
  return kokaineDomRangeFirst(parent,first,last);
}
 
export function dom_range_next(parent, first, last) /* (parent : node, first : node, last : node) -> ui node */  {
  return kokaineDomRangeNext(parent,first,last);
}
 
 
// Move one inclusive row range with verified host operations.  Validation is
// deliberately complete before extraction.  Custom-element-shaped nodes,
// opaque shadow hosts, and opaque focused subtrees fail before movement because
// their synchronous or hidden state cannot be published atomically.  If
// extraction, insertion,
// focus restoration, or a commit-then-throw host primitive fails, every
// snapshotted node is pulled back before the original successor through the
// same-realm parent prototype.  No node is cloned, so ordinary object identity,
// listeners, form values, and owner registrations are retained.
export function dom_validate_range_move_lifecycle(parent, first, last) /* (parent : node, first : node, last : node) -> ui () */  {
  return kokaineDomValidateRangeMoveLifecycle(parent,first,last);
}
 
export function dom_validate_range_move_focus(parent, first, last) /* (parent : node, first : node, last : node) -> ui () */  {
  return kokaineDomValidateRangeMoveFocus(parent,first,last);
}
 
export function dom_capture_range_focus(parent, first, last) /* (parent : node, first : node, last : node) -> ui any */  {
  return kokaineDomCaptureRangeFocus(parent,first,last);
}
 
export function dom_move_range_before(parent, first, last, before, focus) /* (parent : node, first : node, last : node, before : node, focus : any) -> ui () */  {
  return kokaineDomMoveRangeBefore(parent,first,last,before,focus);
}
 
export function dom_set_text(value, content) /* (value : node, content : string) -> ui () */  {
  return ((value).data = content);
}
 
export function dom_set_attribute(value, name, content) /* (value : element, name : string, content : string) -> ui () */  {
  return (value).setAttribute(name,content);
}
 
export function dom_remove_attribute(value, name) /* (value : element, name : string) -> ui () */  {
  return (value).removeAttribute(name);
}
 
export function dom_set_string_property(value, name, content) /* (value : element, name : string, content : string) -> ui () */  {
  return ((value)[name] = content);
}
 
export function dom_set_bool_property(value, name, content) /* (value : element, name : string, content : bool) -> ui () */  {
  return ((value)[name] = content);
}
 
export function dom_set_int_property(value, name, content) /* (value : element, name : string, content : string) -> ui () */  {
  return ((value)[name] = Number(content));
}
 
export function dom_clean_range(first, last, inclusive) /* (first : node, last : node, inclusive : bool) -> ui () */  {
  return kokaineDomCleanRange(first,last,inclusive);
}
 
export function dom_clear_between(first, last) /* (first : node, last : node) -> ui () */  {
  return dom_clean_range(first, last, false);
}
 
export function dom_remove_range(first, last) /* (first : node, last : node) -> ui () */  {
  return dom_clean_range(first, last, true);
}
 
 
// Validate and snapshot an inclusive row range without changing the DOM.
export function dom_stage_retirement(first, last) /* (first : node, last : node) -> ui dom-retirement */  {
  return kokaineDomStageRetirement(first,last);
}
 
 
// Detach a staged snapshot. If a host primitive throws before detaching its
// target, stop immediately so the complete remaining row stays retryable. A
// commit-then-throw is recognized by inspecting the target after the throw.
export function dom_run_retirement(value) /* (value : dom-retirement) -> ui () */  {
  return kokaineDomRunRetirement(value);
}
 
export function dom_release_retirement(value) /* (value : dom-retirement) -> ui () */  {
  return kokaineDomReleaseRetirement(value);
}
 
export function dom_append_html(parent, content, root, portal) /* (parent : node, content : string, root : kokaine/reactive/root<ui>, portal : kokaine/reactive/integration/reentry<ui>) -> ui dom-owner-registration */  {
  return kokaineDomAppendHtml(parent,content,root,portal);
}
 
export function dom_insert_html_before(parent, before, content, root, portal) /* (parent : node, before : node, content : string, root : kokaine/reactive/root<ui>, portal : kokaine/reactive/integration/reentry<ui>) -> ui dom-owner-registration */  {
  return kokaineDomInsertHtmlBefore(parent,before,content,root,portal);
}
 
export function dom_listen(value, name, action) /* (value : element, name : string, action : (raw-event) -> ui ()) -> ui dom-listener */  {
  return kokaineDomListen(value,name,action);
}
 
 
// Drop the Koka closure before asking an unreliable host to detach the ABI
// trampoline. A callback retained after failed removal is then inert and no
// longer keeps the root, structural portal, or event K reachable.
export function dom_retire_listener(listener) /* (listener : dom-listener) -> ui () */  {
  return kokaineDomRetireListener(listener);
}
 
export function dom_unlisten(value, name, listener) /* (value : element, name : string, listener : dom-listener) -> ui () */  {
  return (value).removeEventListener(name,listener);
}
 
export function raw_event_value(value) /* (value : raw-event) -> ui string */  {
  return kokaineDomRawEventValue(value);
}
 
export function raw_event_checked(value) /* (value : raw-event) -> ui bool */  {
  return kokaineDomRawEventChecked(value);
}
 
export function raw_event_key(value) /* (value : raw-event) -> ui string */  {
  return String((value).key == null ? '' : (value).key);
}
 
export function raw_event_any(value) /* (value : raw-event) -> any */  {
  return value;
}
 
export function event_prevent_default(value) /* (value : any) -> ui () */  {
  return (value).preventDefault();
}
 
export function event_stop_propagation(value) /* (value : any) -> ui () */  {
  return (value).stopPropagation();
}
 
 
// Validate and invoke within one host action. The surrounding `dom-attempt`
// then translates both adapter validation failures and native DOM exceptions.
// Native Web IDL getters provide realm-neutral brand checks: unlike
// `instanceof`, they accept genuine nodes created by another same-origin realm.
export function dom_require_dialog_target(target, message) /* (target : node, message : string) -> ui () */  {
  return kokaineDomRequireDialogTarget(target,message);
}
 
export function dom_require_element_target(target, message) /* (target : node, message : string) -> ui () */  {
  return kokaineDomRequireElementTarget(target,message);
}
 
 
// Read the platform reflection getter directly. An own `popover` class field on
// a custom element must neither hide a real content attribute nor manufacture
// popover state where the browser has none.
export function dom_require_popover_target(target, message) /* (target : node, message : string) -> ui () */  {
  return kokaineDomRequirePopoverTarget(target,message);
}
 
export function dom_dialog_show(target) /* (target : node) -> ui () */  {
  return kokaineDomDialogShow(target);
}
 
export function dom_dialog_show_modal(target) /* (target : node) -> ui () */  {
  return kokaineDomDialogShowModal(target);
}
 
export function dom_dialog_close(target, result) /* (target : node, result : string) -> ui () */  {
  return kokaineDomDialogClose(target,result);
}
 
 
// `close()` cannot emulate the cancellable `cancel` event from requestClose.
export function dom_dialog_request_close(target, result) /* (target : node, result : string) -> ui () */  {
  return kokaineDomDialogRequestClose(target,result);
}
 
export function dom_dialog_is_open(target) /* (target : node) -> ui bool */  {
  return !!(target).open;
}
 
export function dom_dialog_is_modal(target) /* (target : node) -> ui bool */  {
  return kokaineDomDialogIsModal(target);
}
 
export function dom_dialog_return_value(target) /* (target : node) -> ui string */  {
  return String((target).returnValue);
}
 
 
// A recognized reflected `popover` value distinguishes enabled elements from
// arbitrary nodes. Do not infer state or simulate unsupported native methods.
export function dom_popover_show(target) /* (target : node) -> ui () */  {
  return kokaineDomPopoverShow(target);
}
 
export function dom_popover_hide(target) /* (target : node) -> ui () */  {
  return kokaineDomPopoverHide(target);
}
 
 
// Some older implementations return `undefined`; querying the selector after
// the call gives Koka the authoritative post-toggle state in every case.
export function dom_popover_toggle(target) /* (target : node) -> ui bool */  {
  return kokaineDomPopoverToggle(target);
}
 
 
// The force overload arrived after the core Popover API. Compare state first so
// older implementations which ignore that argument still provide a true setter.
// A same-state force call still performs native validity checks; delegate an
// invalid case to the unforced method so its DOMException is not suppressed.
// `:modal` covers modal dialogs and the target's own fullscreen flag. Unlike
// `:fullscreen`, it does not match a retargeted shadow host.
export function dom_popover_set_open(target, open) /* (target : node, open : bool) -> ui () */  {
  return kokaineDomPopoverSetOpen(target,open);
}
 
export function dom_popover_is_open(target) /* (target : node) -> ui bool */  {
  return kokaineDomPopoverIsOpen(target);
}
 
export function dom_toggle_state(value) /* (value : any) -> ui int */  {
  return kokaineDomToggleState(value);
}
 
export function dom_dialog_event_return_value(value) /* (value : any) -> ui string */  {
  return kokaineDomDialogEventReturnValue(value);
}
 
export function dom_report_error(message) /* (message : string) -> ui () */  {
  return console.error(message);
}
 
export function dom_attempt(action) /* forall<a> (action : () -> ui a) -> <ui,exn> a */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, action);
  var _x24 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x24) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
 
// monadic lift
export function _mlift_query_11392(selector, result) /* (selector : string, result : any) -> <ui,exn> node */  {
  var _x25 = $std_core_hnd._open_none1(any_is_null, result);
  if (_x25) {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("DOM selector did not match: ", selector));
  }
  else {
    return $std_core_hnd._open_none1(any_node, result);
  }
}
 
export function query(selector) /* (selector : string) -> <exn,ui> node */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return query_raw(selector);
    });
   
  var _x26 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x26) {
    var x_11585 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11585 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(result_0 /* any */ ) {
      return _mlift_query_11392(selector, result_0);
    });
  }
  else {
    var _x26 = $std_core_hnd._open_none1(any_is_null, x_11585);
    if (_x26) {
      return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("DOM selector did not match: ", selector));
    }
    else {
      return $std_core_hnd._open_none1(any_node, x_11585);
    }
  }
}
 
export function body() /* () -> <exn,ui> node */  {
  return query("body");
}
 
export function prevent_default(value) /* (value : kokaine/html/event) -> <exn,ui> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      var _x27 = value.original;
      return event_prevent_default(_x27);
    });
  var _x27 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x27) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function stop_propagation(value) /* (value : kokaine/html/event) -> <exn,ui> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      var _x28 = value.original;
      return event_stop_propagation(_x28);
    });
  var _x28 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x28) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function dialog_fs_show(target) /* (target : node) -> <exn,ui> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_dialog_target(target, "dialog/show target must be an HTMLDialogElement");
      return dom_dialog_show(target);
    });
  var _x29 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x29) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function dialog_fs_show_modal(target) /* (target : node) -> <exn,ui> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_dialog_target(target, "dialog/show-modal target must be an HTMLDialogElement");
      return dom_dialog_show_modal(target);
    });
  var _x30 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x30) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function dialog_fs_close(target, result) /* (target : node, result : ? string) -> <exn,ui> () */  {
   
  var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_dialog_target(target, "dialog/close target must be an HTMLDialogElement");
      var _x31 = (result !== undefined) ? result : "";
      return dom_dialog_close(target, _x31);
    });
  var _x31 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
  if (_x31) {
    return $std_core_hnd._open_none1(dom_attempt_value, result_0);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
  }
}
 
export function dialog_fs_request_close(target, result) /* (target : node, result : ? string) -> <exn,ui> () */  {
   
  var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_dialog_target(target, "dialog/request-close target must be an HTMLDialogElement");
      var _x32 = (result !== undefined) ? result : "";
      return dom_dialog_request_close(target, _x32);
    });
  var _x32 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
  if (_x32) {
    return $std_core_hnd._open_none1(dom_attempt_value, result_0);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
  }
}
 
export function dialog_fs_is_open(target) /* (target : node) -> <exn,ui> bool */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_dialog_target(target, "dialog/is-open target must be an HTMLDialogElement");
      return dom_dialog_is_open(target);
    });
  var _x33 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x33) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function dialog_fs_is_modal(target) /* (target : node) -> <exn,ui> bool */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_dialog_target(target, "dialog/is-modal target must be an HTMLDialogElement");
      return dom_dialog_is_modal(target);
    });
  var _x34 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x34) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function dialog_fs_return_value(target) /* (target : node) -> <exn,ui> string */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_dialog_target(target, "dialog/return-value target must be an HTMLDialogElement");
      return dom_dialog_return_value(target);
    });
  var _x35 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x35) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function dialog_fs_event_return_value(value) /* (value : kokaine/html/event) -> <exn,ui> string */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      var _x36 = value.original;
      return dom_dialog_event_return_value(_x36);
    });
  var _x36 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x36) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function popover_fs_show(target) /* (target : node) -> <exn,ui> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_element_target(target, "popover/show target must be an Element");
       
      dom_require_popover_target(target, "popover/show target must have a valid popover attribute");
      return dom_popover_show(target);
    });
  var _x37 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x37) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function popover_fs_hide(target) /* (target : node) -> <exn,ui> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_element_target(target, "popover/hide target must be an Element");
       
      dom_require_popover_target(target, "popover/hide target must have a valid popover attribute");
      return dom_popover_hide(target);
    });
  var _x38 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x38) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function popover_fs_toggle(target) /* (target : node) -> <exn,ui> bool */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_element_target(target, "popover/toggle target must be an Element");
       
      dom_require_popover_target(target, "popover/toggle target must have a valid popover attribute");
      return dom_popover_toggle(target);
    });
  var _x39 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x39) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function popover_fs_set_open(target, open) /* (target : node, open : bool) -> <exn,ui> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_element_target(target, "popover/set-open target must be an Element");
       
      dom_require_popover_target(target, "popover/set-open target must have a valid popover attribute");
      return dom_popover_set_open(target, open);
    });
  var _x40 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x40) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function popover_fs_is_open(target) /* (target : node) -> <exn,ui> bool */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_element_target(target, "popover/is-open target must be an Element");
       
      dom_require_popover_target(target, "popover/is-open target must have a valid popover attribute");
      return dom_popover_is_open(target);
    });
  var _x41 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x41) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
 
// monadic lift
export function toggle_fs__mlift_state_11393(state) /* (state : int) -> <ui,exn> toggle-state */  {
  return ($std_core_types._int_eq(state,1)) ? Toggle_open : Toggle_closed;
}
 
export function toggle_fs_state(value) /* (value : kokaine/html/event) -> <exn,ui> toggle-state */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      var _x42 = value.original;
      return dom_toggle_state(_x42);
    });
   
  var _x43 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x43) {
    var x_11604 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11604 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(toggle_fs__mlift_state_11393);
  }
  else {
    return ($std_core_types._int_eq(x_11604,1)) ? Toggle_open : Toggle_closed;
  }
}
 
 
// monadic lift
export function _mlift_tracked_11394(read, _y_x10305) /* forall<a> (read : () -> kokaine/reactive/effects/signal-read a, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-read> a */  {
  return $std_core_hnd._mask_at(_y_x10305, false, read);
}
 
export function tracked(read) /* forall<a> (read : () -> kokaine/reactive/effects/signal-read a) -> <kokaine/reactive/effects/signal-read,pure> a */  {
   
  var x_11609 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10305 /* hnd/ev-index */ ) {
      return $std_core_hnd._mask_at(_y_x10305, false, read);
    });
  }
  else {
    return $std_core_hnd._mask_at(x_11609, false, read);
  }
}
 
 
// monadic lift
export function _mlift_constant_track_11395(_y_x10309) /* (hnd/ev-index) -> <exn,div> () */  {
  return $std_core_hnd._mask_at(_y_x10309, false, function() {
      return $std_core_types.Unit;
    });
}
 
 
// monadic lift
export function _mlift_constant_track_11396(_y_x10308) /* (hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn> () */  {
  return $std_core_hnd._mask_at(_y_x10308, false, function() {
       
      var x_11614 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_constant_track_11395);
      }
      else {
        return $std_core_hnd._mask_at(x_11614, false, function() {
            return $std_core_types.Unit;
          });
      }
    });
}
 
export function constant_track() /* () -> <pure,kokaine/reactive/effects/signal-read> () */  {
   
  var x_11616 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_constant_track_11396);
  }
  else {
    return $std_core_hnd._mask_at(x_11616, false, function() {
         
        var x_0_11619 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(_mlift_constant_track_11395);
        }
        else {
          return $std_core_hnd._mask_at(x_0_11619, false, function() {
              return $std_core_types.Unit;
            });
        }
      });
  }
}
 
 
// monadic lift
export function _mlift_reactive_ui_exn_11397(action, _y_x10312) /* forall<a,e> (action : () -> <ui,exn> a, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10312, false, function() {
      return $std_core_hnd._open_at0($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), action);
    });
}
 
export function reactive_ui_exn(action) /* forall<a,e> (action : () -> <ui,exn> a) -> <kokaine/reactive/effects/signal-write,pure,ui|e> a */  {
   
  var x_11622 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10312 /* hnd/ev-index */ ) {
      return _mlift_reactive_ui_exn_11397(action, _y_x10312);
    });
  }
  else {
    return $std_core_hnd._mask_at(x_11622, false, function() {
        return $std_core_hnd._open_at0($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), action);
      });
  }
}
 
 
// monadic lift
export function _mlift_reactive_ui_exn_open_11398(action, _y_x10316) /* forall<a,e> (action : () -> <ui,exn|e> a, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10316, false, action);
}
 
export function reactive_ui_exn_open(action) /* forall<a,e> (action : () -> <ui,exn|e> a) -> <kokaine/reactive/effects/signal-write,pure,ui|e> a */  {
   
  var x_11627 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10316 /* hnd/ev-index */ ) {
      return $std_core_hnd._mask_at(_y_x10316, false, action);
    });
  }
  else {
    return $std_core_hnd._mask_at(x_11627, false, action);
  }
}
 
 
// monadic lift
export function _mlift_reactive_sample_11399(action, root, _y_x10319) /* forall<a> (action : () -> <kokaine/reactive/effects/signal-read,pure> a, root : kokaine/reactive/root<ui>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> a */  {
  return $std_core_hnd._mask_at(_y_x10319, false, function() {
      return $kokaine_reactive.sample(root, action);
    });
}
 
 
// Row renderers are sampled once while their live closures retain the item and
// index accessors.  Widen the handled sample back to the DOM apply row so Koka
// does not prematurely close a surrounding lifetime-scope action at `<ui>`.
export function reactive_sample(root, action) /* forall<a> (root : kokaine/reactive/root<ui>, action : () -> <kokaine/reactive/effects/signal-read,pure> a) -> <kokaine/reactive/effects/signal-write,pure,ui> a */  {
   
  var x_11632 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10319 /* hnd/ev-index */ ) {
      return _mlift_reactive_sample_11399(action, root, _y_x10319);
    });
  }
  else {
    return $std_core_hnd._mask_at(x_11632, false, function() {
        return $kokaine_reactive.sample(root, action);
      });
  }
}
 
 
// monadic lift
export function _mlift_reactive_write_ui_11400(action, _y_x10323) /* forall<a,e> (action : () -> kokaine/reactive/effects/signal-write a, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-write|e> a */  {
  return $std_core_hnd._mask_at(_y_x10323, false, function() {
      return $std_core_hnd._open_at0($std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag), action);
    });
}
 
export function reactive_write_ui(action) /* forall<a,e> (action : () -> kokaine/reactive/effects/signal-write a) -> <kokaine/reactive/effects/signal-write,pure,ui|e> a */  {
   
  var x_11638 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10323 /* hnd/ev-index */ ) {
      return _mlift_reactive_write_ui_11400(action, _y_x10323);
    });
  }
  else {
    return _mlift_reactive_write_ui_11400(action, x_11638);
  }
}
 
 
// monadic lift
export function _mlift_reactive_integration_11401(action, _y_x10328) /* forall<a,e> (action : () -> <div,exn,ui|e> a, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10328, false, action);
}
 
export function reactive_integration(action) /* forall<a,e> (action : () -> <div,exn,ui|e> a) -> <kokaine/reactive/effects/signal-write,pure,ui|e> a */  {
   
  var x_11640 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10328 /* hnd/ev-index */ ) {
      return $std_core_hnd._mask_at(_y_x10328, false, action);
    });
  }
  else {
    return $std_core_hnd._mask_at(x_11640, false, action);
  }
}
 
export function insert(parent, before, child) /* (parent : node, before : maybe<node>, child : node) -> <exn,ui> () */  {
  if (before === null) {
     
    var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        return dom_append(parent, child);
      });
    var _x42 = $std_core_hnd._open_none1(dom_attempt_ok, result);
    if (_x42) {
      return $std_core_hnd._open_none1(dom_attempt_value, result);
    }
    else {
      return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
    }
  }
  else {
     
    var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        return dom_insert_before(parent, child, before.value);
      });
    var _x43 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
    if (_x43) {
      return $std_core_hnd._open_none1(dom_attempt_value, result_0);
    }
    else {
      return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
    }
  }
}
 
export function insert_marker_pair(parent, before, first, last) /* (parent : node, before : maybe<node>, first : node, last : node) -> <exn,ui> () */  {
  if (before === null) {
     
    var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        return dom_append_marker_pair(parent, first, last);
      });
    var _x44 = $std_core_hnd._open_none1(dom_attempt_ok, result);
    if (_x44) {
      return $std_core_hnd._open_none1(dom_attempt_value, result);
    }
    else {
      return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
    }
  }
  else {
     
    var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        return dom_insert_marker_pair_before(parent, first, last, before.value);
      });
    var _x45 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
    if (_x45) {
      return $std_core_hnd._open_none1(dom_attempt_value, result_0);
    }
    else {
      return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
    }
  }
}
 
export function range_first(parent, first, last) /* (parent : node, first : node, last : node) -> <exn,ui> node */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_range_first(parent, first, last);
    });
  var _x46 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x46) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function range_next(parent, first, last) /* (parent : node, first : node, last : node) -> <exn,ui> node */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_range_next(parent, first, last);
    });
  var _x47 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x47) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
 
// monadic lift
export function _mlift_validate_range_move_lifecycle_11402(first, last, parent, wild__) /* (first : node, last : node, parent : node, wild_ : ()) -> <ui,exn> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_validate_range_move_focus(parent, first, last);
    });
  var _x48 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x48) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function validate_range_move_lifecycle(parent, first, last) /* (parent : node, first : node, last : node) -> <exn,ui> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_validate_range_move_lifecycle(parent, first, last);
    });
   
  var _x49 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x49) {
    var x_11652 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11652 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_validate_range_move_lifecycle_11402(first, last, parent, wild__);
    });
  }
  else {
     
    var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        return dom_validate_range_move_focus(parent, first, last);
      });
    var _x49 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
    if (_x49) {
      return $std_core_hnd._open_none1(dom_attempt_value, result_0);
    }
    else {
      return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
    }
  }
}
 
 
// monadic lift
export function _mlift_move_range_before_11403(before, first, last, parent, focus) /* (before : node, first : node, last : node, parent : node, focus : any) -> <ui,exn> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_move_range_before(parent, first, last, before, focus);
    });
  var _x50 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x50) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
 
// monadic lift
export function _mlift_move_range_before_11404(before, first, last, parent, wild___0) /* (before : node, first : node, last : node, parent : node, wild_@0 : ()) -> <ui,exn> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_capture_range_focus(parent, first, last);
    });
   
  var _x51 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x51) {
    var x_11658 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11658 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(focus /* any */ ) {
      return _mlift_move_range_before_11403(before, first, last, parent, focus);
    });
  }
  else {
    return _mlift_move_range_before_11403(before, first, last, parent, x_11658);
  }
}
 
 
// monadic lift
export function _mlift_move_range_before_11405(before, first, last, parent, wild__) /* (before : node, first : node, last : node, parent : node, wild_ : ()) -> <ui,exn> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_validate_range_move_focus(parent, first, last);
    });
   
  var _x51 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x51) {
    var x_11661 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11661 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_move_range_before_11404(before, first, last, parent, wild___0);
    });
  }
  else {
    return _mlift_move_range_before_11404(before, first, last, parent, x_11661);
  }
}
 
export function move_range_before(parent, first, last, before) /* (parent : node, first : node, last : node, before : node) -> <exn,ui> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_validate_range_move_lifecycle(parent, first, last);
    });
   
  var _x51 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x51) {
    var x_11664 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11664 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_move_range_before_11405(before, first, last, parent, wild__);
    });
  }
  else {
     
    var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        return dom_validate_range_move_focus(parent, first, last);
      });
     
    var _x51 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
    if (_x51) {
      var x_0_11668 = $std_core_hnd._open_none1(dom_attempt_value, result_0);
    }
    else {
      var x_0_11668 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return _mlift_move_range_before_11404(before, first, last, parent, wild___0);
      });
    }
    else {
       
      var result_1 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_capture_range_focus(parent, first, last);
        });
       
      var _x51 = $std_core_hnd._open_none1(dom_attempt_ok, result_1);
      if (_x51) {
        var x_1_11672 = $std_core_hnd._open_none1(dom_attempt_value, result_1);
      }
      else {
        var x_1_11672 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_1)));
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(focus /* any */ ) {
          return _mlift_move_range_before_11403(before, first, last, parent, focus);
        });
      }
      else {
         
        var result_2 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_move_range_before(parent, first, last, before, x_1_11672);
          });
        var _x51 = $std_core_hnd._open_none1(dom_attempt_ok, result_2);
        if (_x51) {
          return $std_core_hnd._open_none1(dom_attempt_value, result_2);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_2)));
        }
      }
    }
  }
}
 
export function retire_owner_registration(value) /* (value : dom-owner-registration) -> <exn,ui> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_retire_owners(value);
    });
  var _x52 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x52) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
 
// monadic lift
export function _mlift_register_owner_cleanup_11406(_pat_1) /* (kokaine/reactive/internal/model/cleanup-registration<ui>) -> exn () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_register_owner_cleanup_11407(value, _y_x10349) /* (value : dom-owner-registration, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10349, false, function() {
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_retire_owners(value);
        });
      var _x53 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x53) {
        return $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
    });
}
 
 
// monadic lift
export function _mlift_register_owner_cleanup_11408(committed, wild__) /* forall<_e> (committed : ref<global,bool>, wild_ : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
  return ((committed).value = true);
}
 
export function register_owner_cleanup(root, value) /* (root : kokaine/reactive/root<ui>, value : dom-owner-registration) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var committed = { value: false };
   
  var x_11683 = $std_core_hnd._open_at2(0, function(root_0 /* kokaine/reactive/root<ui> */ , cleanup /* () -> <kokaine/reactive/effects/signal-write,pure,ui> () */ ) {
       
      var root_0_10046 = $std_core_hnd._open_none1(function(value_3 /* kokaine/reactive/root<ui> */ ) {
          return value_3;
        }, root_0);
       
      var x_0_11685 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046, cleanup);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_register_owner_cleanup_11406);
      }
      else {
        return $std_core_types.Unit;
      }
    }, root, function() {
       
      var x_1_11687 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10349 /* hnd/ev-index */ ) {
          return _mlift_register_owner_cleanup_11407(value, _y_x10349);
        });
      }
      else {
        return _mlift_register_owner_cleanup_11407(value, x_1_11687);
      }
    });
  if ($std_core_hnd._yielding()) {
    var _x56 = $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return ((committed).value = true);
    });
  }
  else {
    var _x56 = ((committed).value = true);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x54 = committed.value;
      if (_x54) {
        return $std_core_types.Unit;
      }
      else {
        return $std_core_hnd._open_at1(0, function(value_2 /* dom-owner-registration */ ) {
             
            var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
                return dom_retire_owners(value_2);
              });
            var _x55 = $std_core_hnd._open_none1(dom_attempt_ok, result);
            if (_x55) {
              return $std_core_hnd._open_none1(dom_attempt_value, result);
            }
            else {
              return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
            }
          }, value);
      }
    }, _x56);
}
 
 
// monadic lift
export function _mlift_record_owner_11409(root, registered) /* (root : kokaine/reactive/root<ui>, registered : dom-owner-registration) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
  return register_owner_cleanup(root, registered);
}
 
 
// monadic lift
export function _mlift_record_owner_11410(_y_x10355) /* (kokaine/reactive/integration/internal/reentry/reentry<ui>) -> exn kokaine/reactive/integration/reentry<ui> */  {
  return _y_x10355;
}
 
 
// monadic lift
export function _mlift_record_owner_11411(root, value, portal) /* (root : kokaine/reactive/root<ui>, value : node, portal : kokaine/reactive/integration/reentry<ui>) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var x_11691 = $std_core_hnd._open_at1(0, dom_attempt, function() {
      return dom_record_owner(value, root, portal);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(registered /* dom-owner-registration */ ) {
      return register_owner_cleanup(root, registered);
    });
  }
  else {
    return register_owner_cleanup(root, x_11691);
  }
}
 
export function record_owner(root, value) /* (root : kokaine/reactive/root<ui>, value : node) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var x_11695 = $std_core_hnd._open_at1(0, function(root_0 /* kokaine/reactive/root<ui> */ ) {
       
      var x_0_11698 = $kokaine_reactive_integration_internal_reentry.capture_reentry($std_core_hnd._open_none1(function(value_0 /* kokaine/reactive/root<ui> */ ) {
          return value_0;
        }, root_0));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_record_owner_11410);
      }
      else {
        return x_0_11698;
      }
    }, root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(portal /* kokaine/reactive/integration/reentry<ui> */ ) {
      return _mlift_record_owner_11411(root, value, portal);
    });
  }
  else {
     
    var x_1_11700 = $std_core_hnd._open_at1(0, dom_attempt, function() {
        return dom_record_owner(value, root, x_11695);
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(registered /* dom-owner-registration */ ) {
        return register_owner_cleanup(root, registered);
      });
    }
    else {
      return register_owner_cleanup(root, x_1_11700);
    }
  }
}
 
 
// monadic lift
export function _mlift_find_owner_11412(found) /* (found : any) -> <ui,exn> owner-match */  {
  var _x57 = $std_core_hnd._open_none1(dom_owner_state, found);
  if (_x57 === 0) {
    return Owner_none;
  }
  else if (_x57 === 1) {
     
    var _x_x1_0_11135 = $std_core_hnd._open_none1(dom_owner_portal, found);
    return Owner_live($std_core_hnd._open_none1(any_reentry, _x_x1_0_11135));
  }
  else {
    return Owner_retired;
  }
}
 
export function find_owner(root, value) /* (root : kokaine/reactive/root<ui>, value : node) -> <exn,ui> owner-match */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_find_owner(value, root);
    });
   
  var _x58 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x58) {
    var x_11705 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11705 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_find_owner_11412);
  }
  else {
    var _x58 = $std_core_hnd._open_none1(dom_owner_state, x_11705);
    if (_x58 === 0) {
      return Owner_none;
    }
    else if (_x58 === 1) {
       
      var _x_x1_0_11135 = $std_core_hnd._open_none1(dom_owner_portal, x_11705);
      return Owner_live($std_core_hnd._open_none1(any_reentry, _x_x1_0_11135));
    }
    else {
      return Owner_retired;
    }
  }
}
 
 
// monadic lift
export function _mlift_insert_html_11413(root, _c_x10365) /* (root : kokaine/reactive/root<ui>, dom-owner-registration) -> () */  {
  return register_owner_cleanup(root, _c_x10365);
}
 
 
// monadic lift
export function _mlift_insert_html_11414(_y_x10361) /* (kokaine/reactive/integration/internal/reentry/reentry<ui>) -> exn kokaine/reactive/integration/reentry<ui> */  {
  return _y_x10361;
}
 
 
// monadic lift
export function _mlift_insert_html_11415(before, content, parent, root, portal) /* (before : maybe<node>, content : string, parent : node, root : kokaine/reactive/root<ui>, portal : kokaine/reactive/integration/reentry<ui>) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
   
  if (before === null) {
    var x_11709 = $std_core_hnd._open_at1(0, dom_attempt, function() {
        return dom_append_html(parent, content, root, portal);
      });
  }
  else {
    var x_11709 = $std_core_hnd._open_at1(0, dom_attempt, function() {
        return dom_insert_html_before(parent, before.value, content, root, portal);
      });
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10365 /* dom-owner-registration */ ) {
      return register_owner_cleanup(root, _c_x10365);
    });
  }
  else {
    return register_owner_cleanup(root, x_11709);
  }
}
 
export function insert_html(root, parent, before, content) /* (root : kokaine/reactive/root<ui>, parent : node, before : maybe<node>, content : string) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var x_11713 = $std_core_hnd._open_at1(0, function(root_0 /* kokaine/reactive/root<ui> */ ) {
       
      var x_0_11716 = $kokaine_reactive_integration_internal_reentry.capture_reentry($std_core_hnd._open_none1(function(value /* kokaine/reactive/root<ui> */ ) {
          return value;
        }, root_0));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_insert_html_11414);
      }
      else {
        return x_0_11716;
      }
    }, root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(portal /* kokaine/reactive/integration/reentry<ui> */ ) {
      return _mlift_insert_html_11415(before, content, parent, root, portal);
    });
  }
  else {
     
    if (before === null) {
      var x_1_11718 = $std_core_hnd._open_at1(0, dom_attempt, function() {
          return dom_append_html(parent, content, root, x_11713);
        });
    }
    else {
      var x_1_11718 = $std_core_hnd._open_at1(0, dom_attempt, function() {
          return dom_insert_html_before(parent, before.value, content, root, x_11713);
        });
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10365 /* dom-owner-registration */ ) {
        return register_owner_cleanup(root, _c_x10365);
      });
    }
    else {
      return register_owner_cleanup(root, x_1_11718);
    }
  }
}
 
export function set_attribute(value, name, content) /* (value : element, name : string, content : maybe<string>) -> <exn,ui> () */  {
   
  var _x_x1_11141 = $std_core_hnd._open_none1($kokaine_html.is_valid_attribute_name, name);
  var _x59 = $std_core_hnd._open_none1(function(b /* bool */ ) {
      return (b) ? false : true;
    }, _x_x1_11141);
  if (_x59) {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("invalid HTML attribute name: ", name));
  }
  else {
    if (content === null) {
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_remove_attribute(value, name);
        });
      var _x60 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x60) {
        return $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
    }
    else {
       
      var _x_x1_1_11143 = $std_core_hnd._open_none2($kokaine_html.is_safe_url_value, name, content.value);
      var _x61 = $std_core_hnd._open_none1(function(b_0 /* bool */ ) {
          return (b_0) ? false : true;
        }, _x_x1_1_11143);
      if (_x61) {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("unsafe URL scheme in ", $std_core_types._lp__plus__plus__rp_(name, $std_core_types._lp__plus__plus__rp_("; allowed are relative, http(s), mailto, tel, and data:image for src ", "(use unsafe-trusted-url for an application-produced URL)"))));
      }
      else {
         
        var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_set_attribute(value, name, content.value);
          });
        var _x62 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
        if (_x62) {
          return $std_core_hnd._open_none1(dom_attempt_value, result_0);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
        }
      }
    }
  }
}
 
export function set_trusted_url(value, name, url) /* (value : element, name : string, url : kokaine/html/trusted-url) -> <exn,ui> () */  {
   
  var _x_x1_11146 = $std_core_hnd._open_none1($kokaine_html.is_valid_attribute_name, name);
  var _x63 = $std_core_hnd._open_none1(function(b /* bool */ ) {
      return (b) ? false : true;
    }, _x_x1_11146);
  if (_x63) {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("invalid HTML attribute name: ", name));
  }
  else {
     
    var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        var _x64 = url;
        return dom_set_attribute(value, name, _x64);
      });
    var _x64 = $std_core_hnd._open_none1(dom_attempt_ok, result);
    if (_x64) {
      return $std_core_hnd._open_none1(dom_attempt_value, result);
    }
    else {
      return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
    }
  }
}
 
export function set_property(value, name, content) /* (value : element, name : string, content : kokaine/html/property-value) -> <exn,ui> () */  {
   
  var _x_x1_11148 = $std_core_hnd._open_none1($kokaine_html.is_valid_property_name, name);
  var _x65 = $std_core_hnd._open_none1(function(b /* bool */ ) {
      return (b) ? false : true;
    }, _x_x1_11148);
  if (_x65) {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("invalid or markup-writing DOM property: ", name));
  }
  else {
    if (content._tag === 1) {
       
      var _x_x1_1_11150 = $std_core_hnd._open_none2($kokaine_html.is_safe_url_value, name, content.value);
      var _x66 = $std_core_hnd._open_none1(function(b_0 /* bool */ ) {
          return (b_0) ? false : true;
        }, _x_x1_1_11150);
      if (_x66) {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("unsafe URL scheme in ", $std_core_types._lp__plus__plus__rp_(name, $std_core_types._lp__plus__plus__rp_("; allowed are relative, http(s), mailto, tel, and data:image for src ", "(use unsafe-trusted-url for an application-produced URL)"))));
      }
      else {
         
        var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_set_string_property(value, name, content.value);
          });
        var _x67 = $std_core_hnd._open_none1(dom_attempt_ok, result);
        if (_x67) {
          return $std_core_hnd._open_none1(dom_attempt_value, result);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
        }
      }
    }
    else if (content._tag === 2) {
       
      var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_set_bool_property(value, name, content.value);
        });
      var _x68 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
      if (_x68) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_0);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
      }
    }
    else {
       
      var result_1 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_set_int_property(value, name, $std_core_int.show(content.value));
        });
      var _x69 = $std_core_hnd._open_none1(dom_attempt_ok, result_1);
      if (_x69) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_1);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_1)));
      }
    }
  }
}
 
export function snapshot(value) /* (value : raw-event) -> <exn,ui> kokaine/html/event */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return $kokaine_html.Event(raw_event_value(value), raw_event_checked(value), raw_event_key(value), raw_event_any(value));
    });
  var _x70 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x70) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
 
// monadic lift
export function _mlift_invoke_event_11416(_pat_1_2) /* (bool) -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui,pure|kokaine/async/effects/async> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_invoke_event_11417(continuation, portal, root, captured) /* forall<_e> (continuation : kokaine/reactive/integration/event/event-continuation<kokaine/async/effects/async,kokaine/html/event>, portal : kokaine/reactive/integration/reentry<ui>, root : kokaine/reactive/root<ui>, captured : kokaine/html/event) -> <exn,ui> () */  {
  var _x71 = $std_core_hnd._open_none1(function(value_1 /* kokaine/reactive/integration/event/event-continuation<kokaine/async/effects/async,kokaine/html/event> */ ) {
      var _x72 = value_1.value;
      return (_x72 !== null);
    }, continuation);
  if (_x71) {
    return $kokaine_reactive_integration_internal_reentry.run_reentry($std_core_hnd._open_none1(function(value_0_0 /* kokaine/reactive/integration/reentry<ui> */ ) {
          return value_0_0;
        }, portal), function() {
        return $kokaine_reactive_async.run_async(root, function() {
             
            var x_11730 = $kokaine_reactive_integration_event.event_continuation_fs_resume(continuation, captured);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(_mlift_invoke_event_11416);
            }
            else {
              return $std_core_types.Unit;
            }
          });
      });
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function invoke_event(root, portal, continuation, value) /* (root : kokaine/reactive/root<ui>, portal : kokaine/reactive/integration/reentry<ui>, continuation : kokaine/reactive/integration/event/event-continuation<kokaine/async/effects/async,kokaine/html/event>, value : raw-event) -> ui () */  {
  return $std_core_exn.exn_fs__handle($std_core_exn._Hnd_exn(0, function(m /* hnd/marker<ui,()> */ , ___wildcard_x654__16 /* hnd/ev<exn> */ , x /* exception */ ) {
        return $std_core_hnd.yield_to_final(m, function(___wildcard_x654__45 /* (hnd/resume-result<10004,()>) -> ui () */ ) {
            var _x73 = x.message;
            return dom_report_error($std_core_types._lp__plus__plus__rp_("uncaught Kokaine event exception: ", _x73));
          });
      }), function(_res /* () */ ) {
      return _res;
    }, function() {
      var _x74 = $std_core_hnd._open_none1(function(value_0 /* kokaine/reactive/integration/event/event-continuation<kokaine/async/effects/async,kokaine/html/event> */ ) {
          var _x75 = value_0.value;
          return (_x75 !== null);
        }, continuation);
      if (_x74) {
         
        var x_0_11733 = snapshot(value);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(captured /* kokaine/html/event */ ) {
            return _mlift_invoke_event_11417(continuation, portal, root, captured);
          });
        }
        else {
          return _mlift_invoke_event_11417(continuation, portal, root, x_0_11733);
        }
      }
      else {
        return $std_core_types.Unit;
      }
    });
}
 
export function retire_event_listener(target, name, continuation, listener) /* (target : element, name : string, continuation : kokaine/reactive/integration/event/event-continuation<kokaine/async/effects/async,kokaine/html/event>, listener : ref<global,maybe<dom-listener>>) -> <exn,ui> () */  {
  return $std_core_hnd.finally_prompt(function() {
      var _x76 = listener.value;
      if (_x76 === null) {
        return $std_core_types.Unit;
      }
      else {
         
        ((listener).value = ($std_core_types.Nothing));
         
        $std_core_hnd._open_none1(dom_retire_listener, _x76.value);
         
        var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_unlisten(target, name, _x76.value);
          });
        var _x77 = $std_core_hnd._open_none1(dom_attempt_ok, result);
        if (_x77) {
          return $std_core_hnd._open_none1(dom_attempt_value, result);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
        }
      }
    }, $std_core_hnd._open_none1(function(value_2 /* kokaine/reactive/integration/event/event-continuation<kokaine/async/effects/async,kokaine/html/event> */ ) {
        return ((value_2).value = ($kokaine_reactive_integration_event.Event_retired));
      }, continuation));
}
 
 
// monadic lift
export function _mlift_capture_event_listener_11418(captured, _y_x10398) /* forall<_e> (captured : ref<global,maybe<kokaine/reactive/integration/event/event-continuation<<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue>,kokaine/html/event>>>, kokaine/reactive/integration/event/event-continuation<<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue>,kokaine/html/event>) -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui,pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue> () */  {
  return ((captured).value = ($std_core_types.Just(_y_x10398)));
}
 
 
// monadic lift
export function _mlift_capture_event_listener_11419(captured, wild__) /* forall<_e> (captured : ref<global,maybe<kokaine/reactive/integration/event/event-continuation<<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue>,kokaine/html/event>>>, wild_ : ()) -> <exn,ui> kokaine/reactive/integration/event/event-continuation<<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue>,kokaine/html/event> */  {
  var _x78 = captured.value;
  if (_x78 !== null) {
    return _x78.value;
  }
  else {
    return $std_core_exn.$throw("event continuation capture did not complete synchronously");
  }
}
 
export function capture_event_listener(root, action) /* (root : kokaine/reactive/root<ui>, action : kokaine/html/callback) -> <exn,ui> kokaine/reactive/integration/event/event-continuation<kokaine/async/effects/async,kokaine/html/event> */  {
   
  var captured = { value: ($std_core_types.Nothing) };
   
  var inner_0 = $std_core_hnd._open_none1(function(value_0 /* kokaine/reactive/root<ui> */ ) {
      return value_0;
    }, root);
   
  var x_11738 = $kokaine_reactive_internal_handlers.dispatch_handled(inner_0, function() {
      return $kokaine_reactive_async.run_async(root, function() {
           
          var x_0_11741 = $kokaine_reactive_integration_event.capture_event(action);
           
          function next_0_11742(_y_x10398) /* (kokaine/reactive/integration/event/event-continuation<<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue>,kokaine/html/event>) -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui,pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue> () */  {
            return ((captured).value = ($std_core_types.Just(_y_x10398)));
          }
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(next_0_11742);
          }
          else {
            return next_0_11742(x_0_11741);
          }
        });
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_capture_event_listener_11419(captured, wild__);
    });
  }
  else {
    var _x79 = captured.value;
    if (_x79 !== null) {
      return _x79.value;
    }
    else {
      return $std_core_exn.$throw("event continuation capture did not complete synchronously");
    }
  }
}
 
 
// monadic lift
export function _mlift_install_event_listener_11420(continuation, listener, name, target, _y_x10408) /* (continuation : kokaine/reactive/integration/event/event-continuation<kokaine/async/effects/async,kokaine/html/event>, listener : ref<global,maybe<dom-listener>>, name : string, target : element, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10408, false, function() {
      return retire_event_listener(target, name, continuation, listener);
    });
}
 
 
// monadic lift
export function _mlift_install_event_listener_11421(committed, _pat_1) /* forall<_e> (committed : ref<global,bool>, kokaine/reactive/internal/model/cleanup-registration<ui>) -> exn () */  {
  return ((committed).value = true);
}
 
 
// monadic lift
export function _mlift_install_event_listener_11422(committed, continuation, listener, name, root, target, installed) /* forall<_e> (committed : ref<global,bool>, continuation : kokaine/reactive/integration/event/event-continuation<kokaine/async/effects/async,kokaine/html/event>, listener : ref<global,maybe<dom-listener>>, name : string, root : kokaine/reactive/root<ui>, target : element, installed : dom-listener) -> <ui,exn> () */  {
   
  ((listener).value = ($std_core_types.Just(installed)));
   
  var root_0_10046 = $std_core_hnd._open_none1(function(value_5 /* kokaine/reactive/root<ui> */ ) {
      return value_5;
    }, root);
   
  var x_11746 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046, function() {
       
      var x_0_11748 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10408 /* hnd/ev-index */ ) {
          return _mlift_install_event_listener_11420(continuation, listener, name, target, _y_x10408);
        });
      }
      else {
        return _mlift_install_event_listener_11420(continuation, listener, name, target, x_0_11748);
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_pat_1_0 /* kokaine/reactive/internal/model/cleanup-registration<ui> */ ) {
      return ((committed).value = true);
    });
  }
  else {
    return ((committed).value = true);
  }
}
 
 
// monadic lift
export function _mlift_install_event_listener_11423(continuation, name, root, target, _y_x10404) /* forall<_e,_e1,_e2> (continuation : kokaine/reactive/integration/event/event-continuation<kokaine/async/effects/async,kokaine/html/event>, name : string, root : kokaine/reactive/root<ui>, target : element, kokaine/reactive/integration/internal/reentry/reentry<ui>) -> exn () */  {
   
  var listener = { value: ($std_core_types.Nothing) };
   
  var committed = { value: false };
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_listen(target, name, function(value_3 /* raw-event */ ) {
          return invoke_event(root, _y_x10404, continuation, value_3);
        });
    });
   
  var _x80 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x80) {
    var x_11754 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11754 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    var _x81 = $std_core_hnd.yield_extend(function(installed /* dom-listener */ ) {
      return _mlift_install_event_listener_11422(committed, continuation, listener, name, root, target, installed);
    });
  }
  else {
    var _x81 = _mlift_install_event_listener_11422(committed, continuation, listener, name, root, target, x_11754);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x80 = committed.value;
      if (_x80) {
        return $std_core_types.Unit;
      }
      else {
        return retire_event_listener(target, name, continuation, listener);
      }
    }, _x81);
}
 
 
// monadic lift
export function _mlift_install_event_listener_11424(name, root, target, continuation) /* forall<_e,_e1,_e2> (name : string, root : kokaine/reactive/root<ui>, target : element, continuation : kokaine/reactive/integration/event/event-continuation<kokaine/async/effects/async,kokaine/html/event>) -> <exn,ui> () */  {
   
  var x_11757 = $kokaine_reactive_integration_internal_reentry.capture_reentry($std_core_hnd._open_none1(function(value /* kokaine/reactive/root<ui> */ ) {
      return value;
    }, root));
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10404 /* kokaine/reactive/integration/internal/reentry/reentry<ui> */ ) {
      return _mlift_install_event_listener_11423(continuation, name, root, target, _y_x10404);
    });
  }
  else {
    return _mlift_install_event_listener_11423(continuation, name, root, target, x_11757);
  }
}
 
export function install_event_listener(root, target, name, action) /* (root : kokaine/reactive/root<ui>, target : element, name : string, action : kokaine/html/callback) -> <exn,ui> () */  {
   
  var x_11759 = capture_event_listener(root, action);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(continuation /* kokaine/reactive/integration/event/event-continuation<kokaine/async/effects/async,kokaine/html/event> */ ) {
      return _mlift_install_event_listener_11424(name, root, target, continuation);
    });
  }
  else {
     
    var x_0_11762 = $kokaine_reactive_integration_internal_reentry.capture_reentry($std_core_hnd._open_none1(function(value /* kokaine/reactive/root<ui> */ ) {
        return value;
      }, root));
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10404 /* kokaine/reactive/integration/internal/reentry/reentry<ui> */ ) {
        return _mlift_install_event_listener_11423(x_11759, name, root, target, _y_x10404);
      });
    }
    else {
       
      var listener = { value: ($std_core_types.Nothing) };
       
      var committed = { value: false };
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_listen(target, name, function(value_3 /* raw-event */ ) {
              return invoke_event(root, x_0_11762, x_11759, value_3);
            });
        });
       
      var _x82 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x82) {
        var x_1_11767 = $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        var x_1_11767 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
      if ($std_core_hnd._yielding()) {
        var _x83 = $std_core_hnd.yield_extend(function(installed /* dom-listener */ ) {
          return _mlift_install_event_listener_11422(committed, x_11759, listener, name, root, target, installed);
        });
      }
      else {
        var _x83 = _mlift_install_event_listener_11422(committed, x_11759, listener, name, root, target, x_1_11767);
      }
      return $std_core_hnd.finally_prompt(function() {
          var _x82 = committed.value;
          if (_x82) {
            return $std_core_types.Unit;
          }
          else {
            return retire_event_listener(target, name, x_11759, listener);
          }
        }, _x83);
    }
  }
}
 
 
// monadic lift
export function _mlift_mount_attribute_11425(read, _y_x10418) /* (read : () -> kokaine/reactive/effects/signal-read maybe<string>, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-read> maybe<string> */  {
  return $std_core_hnd._mask_at(_y_x10418, false, read);
}
 
 
// monadic lift
export function _mlift_mount_attribute_11426(name_3, target, value_1, _y_x10421) /* (name@3 : string, target : element, value@1 : maybe<string>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10421, false, function() {
      return set_attribute(target, name_3, value_1);
    });
}
 
 
// monadic lift
export function _mlift_mount_attribute_11427(_y_x10425) /* (kokaine/reactive/disposer<ui>) -> <kokaine/reactive/effects/signal-write,pure> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_attribute_11428(read_0_0, _y_x10426) /* (read@0@0 : () -> kokaine/reactive/effects/signal-read kokaine/html/property-value, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-read> kokaine/html/property-value */  {
  return $std_core_hnd._mask_at(_y_x10426, false, read_0_0);
}
 
 
// monadic lift
export function _mlift_mount_attribute_11429(name_4, target, value_2, _y_x10429) /* (name@4 : string, target : element, value@2 : kokaine/html/property-value, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10429, false, function() {
      return set_property(target, name_4, value_2);
    });
}
 
 
// monadic lift
export function _mlift_mount_attribute_11430(_y_x10433) /* (kokaine/reactive/disposer<ui>) -> <kokaine/reactive/effects/signal-write,pure> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_attribute_11431(action_1, name_5, root, target, _y_x10436) /* (action@1 : kokaine/html/callback, name@5 : string, root : kokaine/reactive/root<ui>, target : element, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10436, false, function() {
      return install_event_listener(root, target, name_5, action_1);
    });
}
 
 
// monadic lift
export function _mlift_mount_attribute_11432(action_1, name_5, root, target, _c_x10435) /* (action@1 : kokaine/html/callback, name@5 : string, root : kokaine/reactive/root<ui>, target : element, ()) -> () */  {
   
  var x_11775 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10436 /* hnd/ev-index */ ) {
      return _mlift_mount_attribute_11431(action_1, name_5, root, target, _y_x10436);
    });
  }
  else {
    return _mlift_mount_attribute_11431(action_1, name_5, root, target, x_11775);
  }
}
 
export function mount_attribute(root, target, attribute) /* forall<e> (root : kokaine/reactive/root<ui>, target : element, attribute : kokaine/html/attribute<e>) -> <kokaine/reactive/effects/signal-write,ui,pure> () */  {
  if (attribute._tag === 1) {
    return $std_core_hnd._open_at3(0, set_attribute, target, attribute.name, $std_core_types.Just(attribute.value));
  }
  else if (attribute._tag === 7) {
    return $std_core_hnd._open_at3(0, set_trusted_url, target, attribute.name, attribute.url);
  }
  else if (attribute._tag === 2) {
    if (attribute.enabled) {
      var _x84 = $std_core_types.Just("");
    }
    else {
      var _x84 = $std_core_types.Nothing;
    }
    return $std_core_hnd._open_at3(0, set_attribute, target, attribute.name, _x84);
  }
  else if (attribute._tag === 3) {
    return $std_core_hnd._open_at3(0, set_property, target, attribute.name, attribute.value);
  }
  else if (attribute._tag === 4) {
     
    var x_11777 = $kokaine_reactive.create_effect(root, function() {
         
        var x_0_11780 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10418 /* hnd/ev-index */ ) {
            return $std_core_hnd._mask_at(_y_x10418, false, attribute.read);
          });
        }
        else {
          return $std_core_hnd._mask_at(x_0_11780, false, attribute.read);
        }
      }, function(value_1 /* maybe<string> */ ) {
         
        var x_1_11782 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10421 /* hnd/ev-index */ ) {
            return _mlift_mount_attribute_11426(attribute.name, target, value_1, _y_x10421);
          });
        }
        else {
          return _mlift_mount_attribute_11426(attribute.name, target, value_1, x_1_11782);
        }
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(_mlift_mount_attribute_11427);
    }
    else {
      return $std_core_types.Unit;
    }
  }
  else if (attribute._tag === 5) {
     
    var x_2_11784 = $kokaine_reactive.create_effect(root, function() {
         
        var x_3_11787 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10426 /* hnd/ev-index */ ) {
            return $std_core_hnd._mask_at(_y_x10426, false, attribute.read);
          });
        }
        else {
          return $std_core_hnd._mask_at(x_3_11787, false, attribute.read);
        }
      }, function(value_2 /* kokaine/html/property-value */ ) {
         
        var x_4_11789 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10429 /* hnd/ev-index */ ) {
            return _mlift_mount_attribute_11429(attribute.name, target, value_2, _y_x10429);
          });
        }
        else {
          return _mlift_mount_attribute_11429(attribute.name, target, value_2, x_4_11789);
        }
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(_mlift_mount_attribute_11430);
    }
    else {
      return $std_core_types.Unit;
    }
  }
  else {
     
    var _x_x1_3_11173 = $std_core_hnd._open_none1($kokaine_html.is_valid_event_name, attribute.name);
     
    var _x85 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_3_11173);
    if (_x85) {
       
      var _x_x1_5_11175 = $std_core_types._lp__plus__plus__rp_("invalid DOM event name: ", attribute.name);
      var x_5_11791 = $std_core_hnd._open_at2(0, $std_core_exn.$throw, _x_x1_5_11175);
    }
    else {
      var x_5_11791 = $std_core_types.Unit;
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10435 /* () */ ) {
        return _mlift_mount_attribute_11432(attribute.action, attribute.name, root, target, _c_x10435);
      });
    }
    else {
       
      var x_6_11794 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10436 /* hnd/ev-index */ ) {
          return _mlift_mount_attribute_11431(attribute.action, attribute.name, root, target, _y_x10436);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_6_11794, false, function() {
            return install_event_listener(root, target, attribute.name, attribute.action);
          });
      }
    }
  }
}
 
export function throw_keyed_row_failure(failure) /* (failure : ref<global,error<()>>) -> exn () */  {
  return $std_core_exn.untry(failure.value);
}
 
 
// monadic lift
export function _mlift_run_keyed_row_actions_11433(failure, wild__) /* forall<e> (failure : ref<global,error<()>>, wild_ : ()) -> <exn|e> () */  {
  return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), throw_keyed_row_failure, failure);
}
 
 
// monadic lift
export function _mlift_run_keyed_row_actions_11434(completed, _c_x10448) /* forall<_e> (completed : ref<global,bool>, ()) -> () */  {
  return ((completed).value = true);
}
 
 
// monadic lift
export function _mlift_run_keyed_row_actions_11435(completed_0, failure_0, previous, _y_x10447) /* forall<_e,e1> (completed : ref<global,bool>, failure : ref<global,error<()>>, previous : error<()>, error<()>) -> e1 () */  {
   
  if (_y_x10447._tag === 1) {
    var x_11798 = ((failure_0).value = ($std_core_types.$Error(_y_x10447.error)));
  }
  else {
    var x_11798 = ((failure_0).value = previous);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10448_0 /* () */ ) {
      return _mlift_run_keyed_row_actions_11434(completed_0, _c_x10448_0);
    });
  }
  else {
    return _mlift_run_keyed_row_actions_11434(completed_0, x_11798);
  }
}
 
 
// monadic lift
export function _mlift_run_keyed_row_actions_11436(action, completed_1, failure_1, row, _y_x10445) /* forall<_e,_e1,a,b,e2,e3> (action : (keyed-row<e2,a,b>) -> <exn|e3> (), completed : ref<global,bool>, failure : ref<global,error<()>>, row : keyed-row<e2,a,b>, hnd/ev-index) -> <exn|e3> () */  {
  return $std_core_hnd._mask_at(_y_x10445, false, function() {
       
      var previous_0 = failure_1.value;
       
      ((failure_1).value = ($std_core_types.Ok($std_core_types.Unit)));
       
      var x_0_11800 = $kokaine_internal_compat.capture_error(function() {
        return action(row);
      });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10447_0 /* error<()> */ ) {
          return _mlift_run_keyed_row_actions_11435(completed_1, failure_1, previous_0, _y_x10447_0);
        });
      }
      else {
        return _mlift_run_keyed_row_actions_11435(completed_1, failure_1, previous_0, x_0_11800);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_keyed_row_actions_11437(action_0, failure_2, rest, wild___2) /* forall<a,b,e,e1> (action : (keyed-row<e,a,b>) -> <exn|e1> (), failure : ref<global,error<()>>, rest : list<keyed-row<e,a,b>>, wild_@2 : ()) -> <exn|e1> () */  {
  return run_keyed_row_actions(rest, action_0, failure_2);
}
 
export function run_keyed_row_actions(rows, action_1, failure_3) /* forall<a,b,e,e1> (rows : list<keyed-row<e,a,b>>, action : (keyed-row<e,a,b>) -> <exn|e1> (), failure : ref<global,error<()>>) -> <exn|e1> () */  { tailcall: while(1)
{
  if (rows === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var completed_2 = { value: false };
     
    var x_3_11809 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
     
    if ($std_core_hnd._yielding()) {
      var _x86 = $std_core_hnd.yield_extend(function(_y_x10445_0 /* hnd/ev-index */ ) {
        return _mlift_run_keyed_row_actions_11436(action_1, completed_2, failure_3, rows.head, _y_x10445_0);
      });
    }
    else {
      var _x86 = _mlift_run_keyed_row_actions_11436(action_1, completed_2, failure_3, rows.head, x_3_11809);
    }
    var x_1_11802 = $std_core_hnd.finally_prompt(function() {
        var _x85 = completed_2.value;
        if (_x85) {
          return $std_core_types.Unit;
        }
        else {
           
          var x_2_11807 = run_keyed_row_actions(rows.tail, action_1, failure_3);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
              return _mlift_run_keyed_row_actions_11433(failure_3, wild___0);
            });
          }
          else {
            return _mlift_run_keyed_row_actions_11433(failure_3, x_2_11807);
          }
        }
      }, _x86);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___2_0 /* () */ ) {
        return _mlift_run_keyed_row_actions_11437(action_1, failure_3, rows.tail, wild___2_0);
      });
    }
    else {
      {
        // tail call
        rows = rows.tail;
        continue tailcall;
      }
    }
  }
}}
 
 
// monadic lift
export function _mlift_exhaust_keyed_row_actions_11438(failure, wild__) /* forall<e> (failure : ref<global,error<()>>, wild_ : ()) -> <exn|e> () */  {
  return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), throw_keyed_row_failure, failure);
}
 
export function exhaust_keyed_row_actions(rows, action) /* forall<a,b,e,e1> (rows : list<keyed-row<e,a,b>>, action : (keyed-row<e,a,b>) -> <exn|e1> ()) -> <exn|e1> () */  {
   
  var failure = { value: ($std_core_types.Ok($std_core_types.Unit)) };
   
  var x_11811 = run_keyed_row_actions(rows, action, failure);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), throw_keyed_row_failure, failure);
    });
  }
  else {
    return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), throw_keyed_row_failure, failure);
  }
}
 
export function dispose_keyed_rows(rows) /* forall<a,b,e> (rows : list<keyed-row<e,a,b>>) -> <ui,exn> () */  {
  return exhaust_keyed_row_actions(rows, function(row /* keyed-row<6181,6179,6180> */ ) {
       
      var scope_10078 = $std_core_hnd._open_none1(function(_this /* keyed-row<6181,6179,6180> */ ) {
          return _this.row_scope;
        }, row);
      return $kokaine_reactive_integration_internal_lifetime_dash_scope.lifetime_scope_fs_dispose($std_core_hnd._open_none1(function(value /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
          return value;
        }, scope_10078));
    });
}
 
 
// monadic lift
export function _mlift_rollback_keyed_order_11439(first_10260, last, last_0_10261, parent, focus) /* (first@10260 : node, last : node, last@0@10261 : node, parent : node, focus : any) -> <ui,exn> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_move_range_before(parent, first_10260, last_0_10261, last, focus);
    });
  var _x85 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x85) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
 
// monadic lift
export function _mlift_rollback_keyed_order_11440(first_10260, last, last_0_10261, parent, wild___0) /* (first@10260 : node, last : node, last@0@10261 : node, parent : node, wild_@0 : ()) -> <ui,exn> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_capture_range_focus(parent, first_10260, last_0_10261);
    });
   
  var _x86 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x86) {
    var x_11817 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11817 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(focus /* any */ ) {
      return _mlift_rollback_keyed_order_11439(first_10260, last, last_0_10261, parent, focus);
    });
  }
  else {
    return _mlift_rollback_keyed_order_11439(first_10260, last, last_0_10261, parent, x_11817);
  }
}
 
 
// monadic lift
export function _mlift_rollback_keyed_order_11441(first_10260, last, last_0_10261, parent, wild__) /* (first@10260 : node, last : node, last@0@10261 : node, parent : node, wild_ : ()) -> <ui,exn> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_validate_range_move_focus(parent, first_10260, last_0_10261);
    });
   
  var _x86 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x86) {
    var x_11820 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11820 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_rollback_keyed_order_11440(first_10260, last, last_0_10261, parent, wild___0);
    });
  }
  else {
    return _mlift_rollback_keyed_order_11440(first_10260, last, last_0_10261, parent, x_11820);
  }
}
 
 
// monadic lift
export function _mlift_rollback_keyed_order_11442(last, parent, row, next) /* forall<a,b,e> (last : node, parent : node, row : keyed-row<e,a,b>, next : node) -> <ui,exn> () */  {
  var _x86 = $std_core_hnd._open_none2(dom_same_node, next, last);
  if (_x86) {
    return $std_core_types.Unit;
  }
  else {
     
    var first_10260 = $std_core_hnd._open_none1(function(_this_1 /* keyed-row<6305,6303,6304> */ ) {
        return _this_1.row_first;
      }, row);
     
    var last_0_10261 = $std_core_hnd._open_none1(function(_this_2 /* keyed-row<6305,6303,6304> */ ) {
        return _this_2.row_last;
      }, row);
     
    var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        return dom_validate_range_move_lifecycle(parent, first_10260, last_0_10261);
      });
     
    var _x87 = $std_core_hnd._open_none1(dom_attempt_ok, result);
    if (_x87) {
      var x_11823 = $std_core_hnd._open_none1(dom_attempt_value, result);
    }
    else {
      var x_11823 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
        return _mlift_rollback_keyed_order_11441(first_10260, last, last_0_10261, parent, wild__);
      });
    }
    else {
      return _mlift_rollback_keyed_order_11441(first_10260, last, last_0_10261, parent, x_11823);
    }
  }
}
 
export function rollback_keyed_order(parent, last, rows) /* forall<a,b,e> (parent : node, last : node, rows : list<keyed-row<e,a,b>>) -> <ui,exn> () */  {
  return exhaust_keyed_row_actions(rows, function(row /* keyed-row<6305,6303,6304> */ ) {
       
      var first_10080 = $std_core_hnd._open_none1(function(_this /* keyed-row<6305,6303,6304> */ ) {
          return _this.row_first;
        }, row);
       
      var last_0_10081 = $std_core_hnd._open_none1(function(_this_0 /* keyed-row<6305,6303,6304> */ ) {
          return _this_0.row_last;
        }, row);
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_range_next(parent, first_10080, last_0_10081);
        });
       
      var _x87 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x87) {
        var x_11826 = $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        var x_11826 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(next_0 /* node */ ) {
          return _mlift_rollback_keyed_order_11442(last, parent, row, next_0);
        });
      }
      else {
        return _mlift_rollback_keyed_order_11442(last, parent, row, x_11826);
      }
    });
}
 
 
// monadic lift
export function _mlift_validate_keyed_move_lifecycles_11443(first_10083, last_10084, parent, wild__) /* (first@10083 : node, last@10084 : node, parent : node, wild_ : ()) -> <ui,exn> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_validate_range_move_focus(parent, first_10083, last_10084);
    });
  var _x87 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x87) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function validate_keyed_move_lifecycles(parent, rows) /* forall<a,b,e> (parent : node, rows : list<keyed-row<e,a,b>>) -> <ui,exn> () */  {
  return $std_core_list.foreach(rows, function(row /* keyed-row<6389,6387,6388> */ ) {
       
      var first_10083 = $std_core_hnd._open_none1(function(_this /* keyed-row<6389,6387,6388> */ ) {
          return _this.row_first;
        }, row);
       
      var last_10084 = $std_core_hnd._open_none1(function(_this_0 /* keyed-row<6389,6387,6388> */ ) {
          return _this_0.row_last;
        }, row);
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_validate_range_move_lifecycle(parent, first_10083, last_10084);
        });
       
      var _x88 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x88) {
        var x_11830 = $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        var x_11830 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
          return _mlift_validate_keyed_move_lifecycles_11443(first_10083, last_10084, parent, wild__);
        });
      }
      else {
        return _mlift_validate_keyed_move_lifecycles_11443(first_10083, last_10084, parent, x_11830);
      }
    });
}
 
 
// monadic lift
export function _mlift_validate_keyed_order_11444(last, parent, rest, next) /* forall<a,b,e> (last : node, parent : node, rest : list<keyed-row<e,a,b>>, next : node) -> <ui,exn> () */  {
  return validate_keyed_order(parent, last, next, rest);
}
 
export function validate_keyed_order(parent_0, last_0, cursor, rows) /* forall<a,b,e> (parent : node, last : node, cursor : node, rows : list<keyed-row<e,a,b>>) -> <ui,exn> () */  { tailcall: while(1)
{
  if (rows === null) {
    var _x88 = $std_core_hnd._open_none2(dom_same_node, cursor, last_0);
    if (_x88) {
      return $std_core_types.Unit;
    }
    else {
      return $std_core_exn.$throw("invalid Kokaine keyed DOM: unmanaged nodes remain in the region");
    }
  }
  else {
     
    var _x_x2_0_11193 = $std_core_hnd._open_none1(function(_this /* keyed-row<6547,6545,6546> */ ) {
        return _this.row_first;
      }, rows.head);
     
    var _x_x1_0_11191 = $std_core_hnd._open_none2(dom_same_node, cursor, _x_x2_0_11193);
    var _x89 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_0_11191);
    if (_x89) {
      return $std_core_exn.$throw("invalid Kokaine keyed DOM: retained row ranges are out of order");
    }
    else {
       
      var first_10086 = $std_core_hnd._open_none1(function(_this_0 /* keyed-row<6547,6545,6546> */ ) {
          return _this_0.row_first;
        }, rows.head);
       
      var last_0_10087 = $std_core_hnd._open_none1(function(_this_1 /* keyed-row<6547,6545,6546> */ ) {
          return _this_1.row_last;
        }, rows.head);
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_range_next(parent_0, first_10086, last_0_10087);
        });
       
      var _x90 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x90) {
        var x_11833 = $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        var x_11833 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(next_1 /* node */ ) {
          return _mlift_validate_keyed_order_11444(last_0, parent_0, rows.tail, next_1);
        });
      }
      else {
        {
          // tail call
          cursor = x_11833;
          rows = rows.tail;
          continue tailcall;
        }
      }
    }
  }
}}
 
 
// monadic lift
export function _mlift_keyed_order_matches_11445(last, parent, rest, next) /* forall<a,b,e> (last : node, parent : node, rest : list<keyed-row<e,a,b>>, next : node) -> <ui,exn> bool */  {
  return keyed_order_matches(parent, last, next, rest);
}
 
export function keyed_order_matches(parent_0, last_0, cursor, rows) /* forall<a,b,e> (parent : node, last : node, cursor : node, rows : list<keyed-row<e,a,b>>) -> <ui,exn> bool */  { tailcall: while(1)
{
  if (rows === null) {
    return $std_core_hnd._open_none2(dom_same_node, cursor, last_0);
  }
  else {
     
    var _x_x2_0_11201 = $std_core_hnd._open_none1(function(_this /* keyed-row<6678,6676,6677> */ ) {
        return _this.row_first;
      }, rows.head);
     
    var _x_x1_0_11199 = $std_core_hnd._open_none2(dom_same_node, cursor, _x_x2_0_11201);
    var _x90 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_0_11199);
    if (_x90) {
      return false;
    }
    else {
       
      var first_10089 = $std_core_hnd._open_none1(function(_this_0 /* keyed-row<6678,6676,6677> */ ) {
          return _this_0.row_first;
        }, rows.head);
       
      var last_0_10090 = $std_core_hnd._open_none1(function(_this_1 /* keyed-row<6678,6676,6677> */ ) {
          return _this_1.row_last;
        }, rows.head);
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_range_next(parent_0, first_10089, last_0_10090);
        });
       
      var _x91 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x91) {
        var x_11837 = $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        var x_11837 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(next_1 /* node */ ) {
          return _mlift_keyed_order_matches_11445(last_0, parent_0, rows.tail, next_1);
        });
      }
      else {
        {
          // tail call
          cursor = x_11837;
          rows = rows.tail;
          continue tailcall;
        }
      }
    }
  }
}}
 
 
// monadic lift
export function _mlift_place_keyed_updates_11446(cursor, parent, rest, wild___1) /* forall<a,b,e> (cursor : node, parent : node, rest : list<keyed-update<e,a,b>>, wild_@1 : ()) -> <ui,exn> node */  {
  return place_keyed_updates(parent, cursor, rest);
}
 
 
// monadic lift
export function _mlift_place_keyed_updates_11447(cursor_0, first_10264, last_10265, parent_0, rest_0, focus) /* forall<a,b,e> (cursor : node, first@10264 : node, last@10265 : node, parent : node, rest : list<keyed-update<e,a,b>>, focus : any) -> <ui,exn> node */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_move_range_before(parent_0, first_10264, last_10265, cursor_0, focus);
    });
   
  var _x91 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x91) {
    var x_11841 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11841 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___1_0 /* () */ ) {
      return _mlift_place_keyed_updates_11446(cursor_0, parent_0, rest_0, wild___1_0);
    });
  }
  else {
    return _mlift_place_keyed_updates_11446(cursor_0, parent_0, rest_0, x_11841);
  }
}
 
 
// monadic lift
export function _mlift_place_keyed_updates_11448(cursor_1, first_10264_0, last_10265_0, parent_1, rest_1, wild___0) /* forall<a,b,e> (cursor : node, first@10264 : node, last@10265 : node, parent : node, rest : list<keyed-update<e,a,b>>, wild_@0 : ()) -> <ui,exn> node */  {
   
  var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_capture_range_focus(parent_1, first_10264_0, last_10265_0);
    });
   
  var _x91 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
  if (_x91) {
    var x_0_11844 = $std_core_hnd._open_none1(dom_attempt_value, result_0);
  }
  else {
    var x_0_11844 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(focus_0 /* any */ ) {
      return _mlift_place_keyed_updates_11447(cursor_1, first_10264_0, last_10265_0, parent_1, rest_1, focus_0);
    });
  }
  else {
    return _mlift_place_keyed_updates_11447(cursor_1, first_10264_0, last_10265_0, parent_1, rest_1, x_0_11844);
  }
}
 
 
// monadic lift
export function _mlift_place_keyed_updates_11449(cursor_2, first_10264_1, last_10265_1, parent_2, rest_2, wild__) /* forall<a,b,e> (cursor : node, first@10264 : node, last@10265 : node, parent : node, rest : list<keyed-update<e,a,b>>, wild_ : ()) -> <ui,exn> node */  {
   
  var result_1 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_validate_range_move_focus(parent_2, first_10264_1, last_10265_1);
    });
   
  var _x91 = $std_core_hnd._open_none1(dom_attempt_ok, result_1);
  if (_x91) {
    var x_1_11847 = $std_core_hnd._open_none1(dom_attempt_value, result_1);
  }
  else {
    var x_1_11847 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_1)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0_0 /* () */ ) {
      return _mlift_place_keyed_updates_11448(cursor_2, first_10264_1, last_10265_1, parent_2, rest_2, wild___0_0);
    });
  }
  else {
    return _mlift_place_keyed_updates_11448(cursor_2, first_10264_1, last_10265_1, parent_2, rest_2, x_1_11847);
  }
}
 
 
// monadic lift
export function _mlift_place_keyed_updates_11450(cursor_3, parent_3, rest_3, row, next_2) /* forall<a,b,e> (cursor : node, parent : node, rest : list<keyed-update<e,a,b>>, row : keyed-row<e,a,b>, next : node) -> <ui,exn> node */  {
   
  var _x_x2_11209 = $std_core_hnd._open_none1(function(_this_2 /* keyed-row<6854,6852,6853> */ ) {
      return _this_2.row_first;
    }, row);
  var _x91 = $std_core_hnd._open_none2(dom_same_node, cursor_3, _x_x2_11209);
  if (_x91) {
    return place_keyed_updates(parent_3, next_2, rest_3);
  }
  else {
     
    var first_10264_2 = $std_core_hnd._open_none1(function(_this_3 /* keyed-row<6854,6852,6853> */ ) {
        return _this_3.row_first;
      }, row);
     
    var last_10265_2 = $std_core_hnd._open_none1(function(_this_4 /* keyed-row<6854,6852,6853> */ ) {
        return _this_4.row_last;
      }, row);
     
    var result_2 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        return dom_validate_range_move_lifecycle(parent_3, first_10264_2, last_10265_2);
      });
     
    var _x92 = $std_core_hnd._open_none1(dom_attempt_ok, result_2);
    if (_x92) {
      var x_2_11850 = $std_core_hnd._open_none1(dom_attempt_value, result_2);
    }
    else {
      var x_2_11850 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_2)));
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___2 /* () */ ) {
        return _mlift_place_keyed_updates_11449(cursor_3, first_10264_2, last_10265_2, parent_3, rest_3, wild___2);
      });
    }
    else {
      return _mlift_place_keyed_updates_11449(cursor_3, first_10264_2, last_10265_2, parent_3, rest_3, x_2_11850);
    }
  }
}
 
export function place_keyed_updates(parent_4, cursor_4, updates) /* forall<a,b,e> (parent : node, cursor : node, updates : list<keyed-update<e,a,b>>) -> <ui,exn> node */  { tailcall: while(1)
{
  if (updates === null) {
    return cursor_4;
  }
  else {
     
    var row_0 = $std_core_hnd._open_none1(function(_this /* keyed-update<6854,6852,6853> */ ) {
        return _this.update_row;
      }, updates.head);
     
    var first_10092 = $std_core_hnd._open_none1(function(_this_0 /* keyed-row<6854,6852,6853> */ ) {
        return _this_0.row_first;
      }, row_0);
     
    var last_10093 = $std_core_hnd._open_none1(function(_this_1 /* keyed-row<6854,6852,6853> */ ) {
        return _this_1.row_last;
      }, row_0);
     
    var result_3 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        return dom_range_next(parent_4, first_10092, last_10093);
      });
     
    var _x92 = $std_core_hnd._open_none1(dom_attempt_ok, result_3);
    if (_x92) {
      var x_3_11853 = $std_core_hnd._open_none1(dom_attempt_value, result_3);
    }
    else {
      var x_3_11853 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_3)));
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(next_5 /* node */ ) {
        return _mlift_place_keyed_updates_11450(cursor_4, parent_4, updates.tail, row_0, next_5);
      });
    }
    else {
       
      var _x_x2_11209_0 = $std_core_hnd._open_none1(function(_this_2_0 /* keyed-row<6854,6852,6853> */ ) {
          return _this_2_0.row_first;
        }, row_0);
      var _x92 = $std_core_hnd._open_none2(dom_same_node, cursor_4, _x_x2_11209_0);
      if (_x92) {
        {
          // tail call
          cursor_4 = x_3_11853;
          updates = updates.tail;
          continue tailcall;
        }
      }
      else {
         
        var first_10264_3 = $std_core_hnd._open_none1(function(_this_3_0 /* keyed-row<6854,6852,6853> */ ) {
            return _this_3_0.row_first;
          }, row_0);
         
        var last_10265_3 = $std_core_hnd._open_none1(function(_this_4_0 /* keyed-row<6854,6852,6853> */ ) {
            return _this_4_0.row_last;
          }, row_0);
         
        var result_4 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_validate_range_move_lifecycle(parent_4, first_10264_3, last_10265_3);
          });
         
        var _x93 = $std_core_hnd._open_none1(dom_attempt_ok, result_4);
        if (_x93) {
          var x_4_11857 = $std_core_hnd._open_none1(dom_attempt_value, result_4);
        }
        else {
          var x_4_11857 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_4)));
        }
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(wild___3 /* () */ ) {
            return _mlift_place_keyed_updates_11449(cursor_4, first_10264_3, last_10265_3, parent_4, updates.tail, wild___3);
          });
        }
        else {
           
          var result_5 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
              return dom_validate_range_move_focus(parent_4, first_10264_3, last_10265_3);
            });
           
          var _x93 = $std_core_hnd._open_none1(dom_attempt_ok, result_5);
          if (_x93) {
            var x_5_11861 = $std_core_hnd._open_none1(dom_attempt_value, result_5);
          }
          else {
            var x_5_11861 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_5)));
          }
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(wild___0_1 /* () */ ) {
              return _mlift_place_keyed_updates_11448(cursor_4, first_10264_3, last_10265_3, parent_4, updates.tail, wild___0_1);
            });
          }
          else {
             
            var result_6 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
                return dom_capture_range_focus(parent_4, first_10264_3, last_10265_3);
              });
             
            var _x93 = $std_core_hnd._open_none1(dom_attempt_ok, result_6);
            if (_x93) {
              var x_6_11865 = $std_core_hnd._open_none1(dom_attempt_value, result_6);
            }
            else {
              var x_6_11865 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_6)));
            }
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(focus_1 /* any */ ) {
                return _mlift_place_keyed_updates_11447(cursor_4, first_10264_3, last_10265_3, parent_4, updates.tail, focus_1);
              });
            }
            else {
               
              var result_7 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
                  return dom_move_range_before(parent_4, first_10264_3, last_10265_3, cursor_4, x_6_11865);
                });
               
              var _x93 = $std_core_hnd._open_none1(dom_attempt_ok, result_7);
              if (_x93) {
                var x_7_11869 = $std_core_hnd._open_none1(dom_attempt_value, result_7);
              }
              else {
                var x_7_11869 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_7)));
              }
              if ($std_core_hnd._yielding()) {
                return $std_core_hnd.yield_extend(function(wild___1_1 /* () */ ) {
                  return _mlift_place_keyed_updates_11446(cursor_4, parent_4, updates.tail, wild___1_1);
                });
              }
              else {
                {
                  // tail call
                  updates = updates.tail;
                  continue tailcall;
                }
              }
            }
          }
        }
      }
    }
  }
}}
 
export function _trmc_collect_stale_rows(rows, next, compare, _acc) /* forall<a,b,e> (rows : list<keyed-row<e,a,b>>, next : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, compare : (b, b) -> order, ctx<list<keyed-row<e,a,b>>>) -> list<keyed-row<e,a,b>> */  { tailcall: while(1)
{
  if (rows === null) {
    return $std_core_types._cctx_apply(_acc,($std_core_types.Nil));
  }
  else {
    var _x94 = rows.head.row_key;
    var _x93 = $kokaine_internal_key_dash_index.find(next, _x94, compare);
    if (_x93 !== null) {
      {
        // tail call
        rows = rows.tail;
        continue tailcall;
      }
    }
    else {
       
      var _trmc_x10268 = undefined;
       
      var _trmc_x10269 = $std_core_types.Cons(rows.head, _trmc_x10268);
      {
        // tail call
        var _x95 = $std_core_types._cctx_extend(_acc,_trmc_x10269,({obj: _trmc_x10269, field_name: "tail"}));
        rows = rows.tail;
        _acc = _x95;
        continue tailcall;
      }
    }
  }
}}
 
export function collect_stale_rows(rows_0, next_0, compare_0) /* forall<a,b,e> (rows : list<keyed-row<e,a,b>>, next : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, compare : (b, b) -> order) -> list<keyed-row<e,a,b>> */  {
  return _trmc_collect_stale_rows(rows_0, next_0, compare_0, $std_core_types._cctx_empty());
}
 
 
// monadic lift
export function _mlift_stage_keyed_retirements_loop_11451(collected, rest, row, staged) /* forall<a,b,e> (collected : list<keyed-retirement<e,a,b>>, rest : list<keyed-row<e,a,b>>, row : keyed-row<e,a,b>, staged : dom-retirement) -> <ui,exn> list<keyed-retirement<e,a,b>> */  {
  return stage_keyed_retirements_loop(rest, $std_core_types.Cons(Keyed_retirement(row, staged), collected));
}
 
export function stage_keyed_retirements_loop(rows, collected_0) /* forall<a,b,e> (rows : list<keyed-row<e,a,b>>, collected : list<keyed-retirement<e,a,b>>) -> <ui,exn> list<keyed-retirement<e,a,b>> */  { tailcall: while(1)
{
  if (rows === null) {
    return $std_core_list.reverse_acc($std_core_types.Nil, collected_0);
  }
  else {
     
    var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        var _x96 = rows.head.row_first;
        var _x97 = rows.head.row_last;
        return dom_stage_retirement(_x96, _x97);
      });
     
    var _x98 = $std_core_hnd._open_none1(dom_attempt_ok, result);
    if (_x98) {
      var x_11873 = $std_core_hnd._open_none1(dom_attempt_value, result);
    }
    else {
      var x_11873 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(staged_0 /* dom-retirement */ ) {
        return _mlift_stage_keyed_retirements_loop_11451(collected_0, rows.tail, rows.head, staged_0);
      });
    }
    else {
      {
        // tail call
        var _x96 = $std_core_types.Cons(Keyed_retirement(rows.head, x_11873), collected_0);
        rows = rows.tail;
        collected_0 = _x96;
        continue tailcall;
      }
    }
  }
}}
 
export function stage_keyed_retirements(rows) /* forall<a,b,e> (rows : list<keyed-row<e,a,b>>) -> <ui,exn> list<keyed-retirement<e,a,b>> */  {
  return stage_keyed_retirements_loop(rows, $std_core_types.Nil);
}
 
export function release_keyed_retirements(values) /* forall<a,b,e> (values : list<keyed-retirement<e,a,b>>) -> ui () */  { tailcall: while(1)
{
  if (values === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x97 = values.head.retirement_handle;
    dom_release_retirement(_x97);
    {
      // tail call
      values = values.tail;
      continue tailcall;
    }
  }
}}
 
 
// monadic lift
export function _mlift_detach_keyed_retirements_loop_11452(current, detached, index, order, rest, table, wild__) /* forall<_e,_e1,a,b,e2> (current : keyed-retirement<e2,a,b>, detached : ref<global,list<keyed-row<e2,a,b>>>, index : kokaine/internal/key-index/key-index<b,keyed-row<e2,a,b>>, order : list<keyed-row<e2,a,b>>, rest : list<keyed-retirement<e2,a,b>>, table : ref<global,keyed-table<e2,a,b>>, wild_ : ()) -> <ui,exn> () */  {
   
  ((table).value = (Keyed_table(index, order, rest)));
   
  var _x_x1_11213 = $std_core_hnd._open_none1(function(_this_0 /* keyed-retirement<7438,7436,7437> */ ) {
      return _this_0.retirement_handle;
    }, current);
   
  $std_core_hnd._open_none1(dom_release_retirement, _x_x1_11213);
   
  var value_1_10884 = $std_core_types.Cons($std_core_hnd._open_none1(function(_this_1 /* keyed-retirement<7438,7436,7437> */ ) {
        return _this_1.retirement_row;
      }, current), detached.value);
   
  ((detached).value = value_1_10884);
  return detach_keyed_retirements_loop(table, detached);
}
 
export function detach_keyed_retirements_loop(table_0, detached_0) /* forall<a,b,e> (table : ref<global,keyed-table<e,a,b>>, detached : ref<global,list<keyed-row<e,a,b>>>) -> <pure,ui> () */  { tailcall: while(1)
{
  var _x97 = table_0.value;
  if (_x97.table_retirements === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        var _x98 = _x97.table_retirements.head.retirement_handle;
        return dom_run_retirement(_x98);
      });
     
    var _x99 = $std_core_hnd._open_none1(dom_attempt_ok, result);
    if (_x99) {
      var x_11877 = $std_core_hnd._open_none1(dom_attempt_value, result);
    }
    else {
      var x_11877 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return _mlift_detach_keyed_retirements_loop_11452(_x97.table_retirements.head, detached_0, _x97.table_index, _x97.table_order, _x97.table_retirements.tail, table_0, wild___0);
      });
    }
    else {
       
      ((table_0).value = (Keyed_table(_x97.table_index, _x97.table_order, _x97.table_retirements.tail)));
       
      var _x_x1_11213_0 = $std_core_hnd._open_none1(function(_this_0_0 /* keyed-retirement<7438,7436,7437> */ ) {
          return _this_0_0.retirement_handle;
        }, _x97.table_retirements.head);
       
      $std_core_hnd._open_none1(dom_release_retirement, _x_x1_11213_0);
       
      var value_1_10884_0 = $std_core_types.Cons($std_core_hnd._open_none1(function(_this_1_0 /* keyed-retirement<7438,7436,7437> */ ) {
            return _this_1_0.retirement_row;
          }, _x97.table_retirements.head), detached_0.value);
       
      ((detached_0).value = value_1_10884_0);
      {
        // tail call
        continue tailcall;
      }
    }
  }
}}
 
 
// monadic lift
export function _mlift_drain_keyed_retirements_11453(rows) /* forall<a,b,e> (rows : list<keyed-row<e,a,b>>) -> <exn,ui> () */  {
  return exhaust_keyed_row_actions(rows, function(row /* keyed-row<7551,7549,7550> */ ) {
       
      var scope_10078 = $std_core_hnd._open_none1(function(_this /* keyed-row<7551,7549,7550> */ ) {
          return _this.row_scope;
        }, row);
      return $kokaine_reactive_integration_internal_lifetime_dash_scope.lifetime_scope_fs_dispose($std_core_hnd._open_none1(function(value /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
          return value;
        }, scope_10078));
    });
}
 
export function drain_keyed_retirements(table) /* forall<a,b,e> (table : ref<global,keyed-table<e,a,b>>) -> <ui,exn> () */  {
   
  var detached = { value: ($std_core_types.Nil) };
  return $std_core_hnd.finally_prompt(function() {
       
      var xs_10888 = detached.value;
       
      var x_11884 = $std_core_list.reverse_acc($std_core_types.Nil, xs_10888);
       
      function next_11885(rows) /* (list<keyed-row<7551,7549,7550>>) -> <exn,ui> () */  {
        return exhaust_keyed_row_actions(rows, function(row /* keyed-row<7551,7549,7550> */ ) {
             
            var scope_10078 = $std_core_hnd._open_none1(function(_this /* keyed-row<7551,7549,7550> */ ) {
                return _this.row_scope;
              }, row);
            return $kokaine_reactive_integration_internal_lifetime_dash_scope.lifetime_scope_fs_dispose($std_core_hnd._open_none1(function(value /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
                return value;
              }, scope_10078));
          });
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(next_11885);
      }
      else {
        return next_11885(x_11884);
      }
    }, detach_keyed_retirements_loop(table, detached));
}
 
 
// monadic lift
export function _mlift_commit_keyed_update_11454(row, update, wild___1) /* forall<_e,a,b,e1> (row : keyed-row<e1,a,b>, update : keyed-update<e1,a,b>, wild_@1 : ()) -> kokaine/reactive/effects/signal-write () */  {
   
  var target_0_10903 = $std_core_hnd._open_none1(function(_this_8 /* keyed-row<7783,7781,7782> */ ) {
      return _this_8.row_current_index;
    }, row);
   
  var value_3_10904 = $std_core_hnd._open_none1(function(_this_9 /* keyed-update<7783,7781,7782> */ ) {
      return _this_9.update_index;
    }, update);
  return ((target_0_10903).value = value_3_10904);
}
 
 
// monadic lift
export function _mlift_commit_keyed_update_11455(row, update, wild__) /* forall<_e,a,b,e1> (row : keyed-row<e1,a,b>, update : keyed-update<e1,a,b>, wild_ : ()) -> kokaine/reactive/effects/signal-write () */  {
   
  var target_10895 = $std_core_hnd._open_none1(function(_this_3 /* keyed-row<7783,7781,7782> */ ) {
      return _this_3.row_current_item;
    }, row);
   
  var value_0_10896 = $std_core_hnd._open_none1(function(_this_4 /* keyed-update<7783,7781,7782> */ ) {
      return _this_4.update_item;
    }, update);
  return ((target_10895).value = value_0_10896);
}
 
 
// monadic lift
export function _mlift_commit_keyed_update_11456(row, update, _c_x10504) /* forall<_e,a,b,e1> (row : keyed-row<e1,a,b>, update : keyed-update<e1,a,b>, ()) -> () */  {
  var _x98 = $std_core_hnd._open_none1(function(_this_5 /* keyed-update<7783,7781,7782> */ ) {
      return _this_5.update_index_changed;
    }, update);
  if (_x98) {
     
    var value_2_10111 = $std_core_hnd._open_none1(function(_this_6 /* keyed-row<7783,7781,7782> */ ) {
        return _this_6.row_index_source;
      }, row);
     
    var next_0_10112 = $std_core_hnd._open_none1(function(_this_7 /* keyed-update<7783,7781,7782> */ ) {
        return _this_7.update_index;
      }, update);
     
    var value_0_10023_0 = $std_core_hnd._open_none1(function(value_1_0 /* kokaine/reactive/signal<int> */ ) {
        return value_1_0;
      }, value_2_10111);
     
    var x_11886 = $kokaine_reactive_internal_runtime.signal_fs_set(value_0_10023_0, next_0_10112);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___1 /* () */ ) {
        return _mlift_commit_keyed_update_11454(row, update, wild___1);
      });
    }
    else {
      return _mlift_commit_keyed_update_11454(row, update, x_11886);
    }
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function commit_keyed_update(update) /* forall<a,b,e> (update : keyed-update<e,a,b>) -> kokaine/reactive/effects/signal-write () */  {
   
  var row = $std_core_hnd._open_none1(function(_this /* keyed-update<7783,7781,7782> */ ) {
      return _this.update_row;
    }, update);
   
  var _x99 = $std_core_hnd._open_none1(function(_this_0 /* keyed-update<7783,7781,7782> */ ) {
      return _this_0.update_item_changed;
    }, update);
  if (_x99) {
     
    var value_10108 = $std_core_hnd._open_none1(function(_this_1 /* keyed-row<7783,7781,7782> */ ) {
        return _this_1.row_item_source;
      }, row);
     
    var next_10109 = $std_core_hnd._open_none1(function(_this_2 /* keyed-update<7783,7781,7782> */ ) {
        return _this_2.update_item;
      }, update);
     
    var value_0_10023 = $std_core_hnd._open_none1(function(value_1 /* kokaine/reactive/signal<7781> */ ) {
        return value_1;
      }, value_10108);
     
    var x_0_11891 = $kokaine_reactive_internal_runtime.signal_fs_set(value_0_10023, next_10109);
    if ($std_core_hnd._yielding()) {
      var x_11888 = $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
        return _mlift_commit_keyed_update_11455(row, update, wild__);
      });
    }
    else {
      var x_11888 = _mlift_commit_keyed_update_11455(row, update, x_0_11891);
    }
  }
  else {
    var x_11888 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10504 /* () */ ) {
      return _mlift_commit_keyed_update_11456(row, update, _c_x10504);
    });
  }
  else {
    var _x99 = $std_core_hnd._open_none1(function(_this_5 /* keyed-update<7783,7781,7782> */ ) {
        return _this_5.update_index_changed;
      }, update);
    if (_x99) {
       
      var value_2_10111 = $std_core_hnd._open_none1(function(_this_6 /* keyed-row<7783,7781,7782> */ ) {
          return _this_6.row_index_source;
        }, row);
       
      var next_0_10112 = $std_core_hnd._open_none1(function(_this_7 /* keyed-update<7783,7781,7782> */ ) {
          return _this_7.update_index;
        }, update);
       
      var value_0_10023_0 = $std_core_hnd._open_none1(function(value_1_0 /* kokaine/reactive/signal<int> */ ) {
          return value_1_0;
        }, value_2_10111);
       
      var x_1_11893 = $kokaine_reactive_internal_runtime.signal_fs_set(value_0_10023_0, next_0_10112);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild___1 /* () */ ) {
          return _mlift_commit_keyed_update_11454(row, update, wild___1);
        });
      }
      else {
         
        var target_0_10903 = $std_core_hnd._open_none1(function(_this_8 /* keyed-row<7783,7781,7782> */ ) {
            return _this_8.row_current_index;
          }, row);
         
        var value_3_10904 = $std_core_hnd._open_none1(function(_this_9 /* keyed-update<7783,7781,7782> */ ) {
            return _this_9.update_index;
          }, update);
        return ((target_0_10903).value = value_3_10904);
      }
    }
    else {
      return $std_core_types.Unit;
    }
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11457(scope, _y_x10509) /* (scope : kokaine/reactive/integration/lifetime-scope<ui>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10509, false, function() {
      return $kokaine_reactive_integration_internal_lifetime_dash_scope.lifetime_scope_fs_dispose($std_core_hnd._open_none1(function(value_4 /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
          return value_4;
        }, scope));
    });
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11458(first, row_last, _y_x10516) /* (first : node, row-last : node, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10516, false, function() {
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_clean_range(first, row_last, true);
        });
      var _x100 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x100) {
        return $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
    });
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11459(committed, first_0, identity, index, index_source, item, item_source, row_last_0, scope_0, wild___3) /* forall<_e,_e1,a,b,e2> (committed : ref<global,bool>, first : node, identity : a, index : int, index-source : kokaine/reactive/signal<int>, item : b, item-source : kokaine/reactive/signal<b>, row-last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, wild_@3 : ()) -> <pure,kokaine/reactive/effects/signal-write,ui> keyed-row<e2,b,a> */  {
   
  var row = Keyed_row(identity, { value: item }, { value: index }, item_source, index_source, scope_0, first_0, row_last_0);
   
  ((committed).value = true);
  return row;
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11460(_y_x10540) /* forall<e> (list<kokaine/html/view<e>>) -> <kokaine/reactive/effects/signal-read,div,exn> kokaine/html/view<e> */  {
  if (_y_x10540 === null) {
    return $kokaine_html.Empty;
  }
  else if (_y_x10540 !== null && _y_x10540.tail === null) {
    return _y_x10540.head;
  }
  else {
    return $kokaine_html.Fragment(_y_x10540);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11461(committed_0, first_1, identity_0, index_0, index_source_0, item_0, item_source_0, parent, renderer, root, row_last_1, scope_1, tree) /* forall<_e,_e1,a,b,e2> (committed : ref<global,bool>, first : node, identity : a, index : int, index-source : kokaine/reactive/signal<int>, item : b, item-source : kokaine/reactive/signal<b>, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, row-last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, tree : kokaine/html/view<e2>) -> <kokaine/reactive/effects/signal-write,div,exn,ui> keyed-row<e2,b,a> */  {
   
  var x_11899 = mount_view(renderer, root, parent, $std_core_types.Just(row_last_1), tree);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___3_0 /* () */ ) {
      return _mlift_create_keyed_row_11459(committed_0, first_1, identity_0, index_0, index_source_0, item_0, item_source_0, row_last_1, scope_1, wild___3_0);
    });
  }
  else {
    return _mlift_create_keyed_row_11459(committed_0, first_1, identity_0, index_0, index_source_0, item_0, item_source_0, row_last_1, scope_1, x_11899);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11462(children, committed_1, first_2, identity_1, index_1, index_source_1, item_1, item_source_1, parent_0, renderer_0, root_0, row_last_2, scope_2, _y_x10536) /* forall<_e,_e1,a,b,e2> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e2>,kokaine/reactive/effects/signal-read> (), committed : ref<global,bool>, first : node, identity : a, index : int, index-source : kokaine/reactive/signal<int>, item : b, item-source : kokaine/reactive/signal<b>, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, row-last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> keyed-row<e2,b,a> */  {
   
  var x_0_11901 = $std_core_hnd._mask_at(_y_x10536, false, function() {
      return $kokaine_reactive.sample(root_0, function() {
           
          var x_1_11904 = $kokaine_html.collect(function() {
            return $std_core_hnd._open2($std_core_vector.unvlist($std_core_types.Cons(1, $std_core_types.Cons(2, $std_core_types.Nil))), children, function() {
                 
                var value_0_10022 = $std_core_hnd._open_none1(function(value_1_0 /* kokaine/reactive/signal<10993> */ ) {
                    return value_1_0;
                  }, item_source_1);
                return $kokaine_reactive_internal_runtime.signal_fs_get(value_0_10022);
              }, function() {
                 
                var value_0_10022_0 = $std_core_hnd._open_none1(function(value_1_1 /* kokaine/reactive/signal<int> */ ) {
                    return value_1_1;
                  }, index_source_1);
                return $kokaine_reactive_internal_runtime.signal_fs_get(value_0_10022_0);
              });
          });
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10540_0 /* list<kokaine/html/view<10994>> */ ) {
              return _mlift_create_keyed_row_11460(_y_x10540_0);
            });
          }
          else {
            return _mlift_create_keyed_row_11460(x_1_11904);
          }
        });
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(tree_0 /* kokaine/html/view<10994> */ ) {
      return _mlift_create_keyed_row_11461(committed_1, first_2, identity_1, index_1, index_source_1, item_1, item_source_1, parent_0, renderer_0, root_0, row_last_2, scope_2, tree_0);
    });
  }
  else {
    return _mlift_create_keyed_row_11461(committed_1, first_2, identity_1, index_1, index_source_1, item_1, item_source_1, parent_0, renderer_0, root_0, row_last_2, scope_2, x_0_11901);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11463(_y_x10534) /* (kokaine/reactive/internal/model/signal<int>) -> exn kokaine/reactive/signal<int> */  {
  return _y_x10534;
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11464(children_0, committed_2, first_3, identity_2, index_2, item_2, item_source_2, parent_1, renderer_1, root_1, row_last_3, scope_3, index_source_2) /* forall<_e,_e1,a,b,e2> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e2>,kokaine/reactive/effects/signal-read> (), committed : ref<global,bool>, first : node, identity : a, index : int, item : b, item-source : kokaine/reactive/signal<b>, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, row-last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, index-source : kokaine/reactive/signal<int>) -> <exn,div,kokaine/reactive/effects/signal-write,ui> keyed-row<e2,b,a> */  {
   
  var x_2_11906 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10536_0 /* hnd/ev-index */ ) {
      return _mlift_create_keyed_row_11462(children_0, committed_2, first_3, identity_2, index_2, index_source_2, item_2, item_source_2, parent_1, renderer_1, root_1, row_last_3, scope_3, _y_x10536_0);
    });
  }
  else {
    return _mlift_create_keyed_row_11462(children_0, committed_2, first_3, identity_2, index_2, index_source_2, item_2, item_source_2, parent_1, renderer_1, root_1, row_last_3, scope_3, x_2_11906);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11465(_y_x10532) /* forall<a> (kokaine/reactive/internal/model/signal<a>) -> exn kokaine/reactive/signal<a> */  {
  return _y_x10532;
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11466(children_1, committed_3, first_4, identity_3, index_3, item_3, parent_2, renderer_2, root_2, row_last_4, scope_4, item_source_3) /* forall<_e,_e1,a,b,e2> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e2>,kokaine/reactive/effects/signal-read> (), committed : ref<global,bool>, first : node, identity : a, index : int, item : b, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, row-last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, item-source : kokaine/reactive/signal<b>) -> <exn,div,kokaine/reactive/effects/signal-write,ui> keyed-row<e2,b,a> */  {
   
  var x_3_11908 = $std_core_hnd._open_at2(0, function(root_3 /* kokaine/reactive/root<ui> */ , initial_0 /* int */ ) {
       
      var root_1_10019_0 = $std_core_hnd._open_none1(function(value_11 /* kokaine/reactive/root<ui> */ ) {
          return value_11;
        }, root_3);
       
      var x_4_11910 = $kokaine_reactive_internal_runtime.signal_by(root_1_10019_0, initial_0, function(___wildcard_x134__29_0 /* int */ , ___wildcard_x134__31_0 /* int */ ) {
          return false;
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_create_keyed_row_11463);
      }
      else {
        return _mlift_create_keyed_row_11463(x_4_11910);
      }
    }, root_2, index_3);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(index_source_3 /* kokaine/reactive/signal<int> */ ) {
      return _mlift_create_keyed_row_11464(children_1, committed_3, first_4, identity_3, index_3, item_3, item_source_3, parent_2, renderer_2, root_2, row_last_4, scope_4, index_source_3);
    });
  }
  else {
    return _mlift_create_keyed_row_11464(children_1, committed_3, first_4, identity_3, index_3, item_3, item_source_3, parent_2, renderer_2, root_2, row_last_4, scope_4, x_3_11908);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11467(_pat_6_0) /* (kokaine/reactive/internal/model/cleanup-registration<ui>) -> exn () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11468(first_5, row_last_5, _y_x10527) /* (first : node, row-last : node, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10527, false, function() {
       
      var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_clean_range(first_5, row_last_5, true);
        });
      var _x101 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
      if (_x101) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_0);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
      }
    });
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11469(children_2, committed_4, first_6, identity_4, index_4, item_4, parent_3, range_owned, renderer_3, root_4, row_last_6, scope_5, wild___1) /* forall<_e,_e1,a,b,e2> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e2>,kokaine/reactive/effects/signal-read> (), committed : ref<global,bool>, first : node, identity : a, index : int, item : b, parent : node, range-owned : ref<global,bool>, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, row-last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, wild_@1 : ()) -> <exn,div,kokaine/reactive/effects/signal-write,ui> keyed-row<e2,b,a> */  {
   
  ((range_owned).value = true);
   
  var x_5_11914 = $std_core_hnd._open_at2(0, function(root_2_0 /* kokaine/reactive/root<ui> */ , initial /* 10993 */ ) {
       
      var root_1_10019 = $std_core_hnd._open_none1(function(value_10 /* kokaine/reactive/root<ui> */ ) {
          return value_10;
        }, root_2_0);
       
      var x_6_11916 = $kokaine_reactive_internal_runtime.signal_by(root_1_10019, initial, function(___wildcard_x134__29 /* 10993 */ , ___wildcard_x134__31 /* 10993 */ ) {
          return false;
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10532_0 /* kokaine/reactive/internal/model/signal<10993> */ ) {
          return _mlift_create_keyed_row_11465(_y_x10532_0);
        });
      }
      else {
        return _mlift_create_keyed_row_11465(x_6_11916);
      }
    }, root_4, item_4);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(item_source_4 /* kokaine/reactive/signal<10993> */ ) {
      return _mlift_create_keyed_row_11466(children_2, committed_4, first_6, identity_4, index_4, item_4, parent_3, renderer_3, root_4, row_last_6, scope_5, item_source_4);
    });
  }
  else {
    return _mlift_create_keyed_row_11466(children_2, committed_4, first_6, identity_4, index_4, item_4, parent_3, renderer_3, root_4, row_last_6, scope_5, x_5_11914);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11470(children_3, committed_5, first_7, identity_5, index_5, installed, item_5, parent_4, range_owned_0, renderer_4, root_5, row_last_7, scope_6, wild__) /* forall<_e,_e1,a,b,e2> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e2>,kokaine/reactive/effects/signal-read> (), committed : ref<global,bool>, first : node, identity : a, index : int, installed : ref<global,bool>, item : b, parent : node, range-owned : ref<global,bool>, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, row-last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, wild_ : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> keyed-row<e2,b,a> */  {
   
  ((installed).value = true);
   
  var x_7_11918 = $std_core_hnd._open_at2(0, function(root_1_0 /* kokaine/reactive/root<ui> */ , cleanup /* () -> <kokaine/reactive/effects/signal-write,pure,ui> () */ ) {
       
      var root_0_10046 = $std_core_hnd._open_none1(function(value_8 /* kokaine/reactive/root<ui> */ ) {
          return value_8;
        }, root_1_0);
       
      var x_8_11920 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046, cleanup);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_create_keyed_row_11467);
      }
      else {
        return _mlift_create_keyed_row_11467(x_8_11920);
      }
    }, root_5, function() {
       
      var x_9_11922 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10527_0 /* hnd/ev-index */ ) {
          return _mlift_create_keyed_row_11468(first_7, row_last_7, _y_x10527_0);
        });
      }
      else {
        return _mlift_create_keyed_row_11468(first_7, row_last_7, x_9_11922);
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___1_0 /* () */ ) {
      return _mlift_create_keyed_row_11469(children_3, committed_5, first_7, identity_5, index_5, item_5, parent_4, range_owned_0, renderer_4, root_5, row_last_7, scope_6, wild___1_0);
    });
  }
  else {
    return _mlift_create_keyed_row_11469(children_3, committed_5, first_7, identity_5, index_5, item_5, parent_4, range_owned_0, renderer_4, root_5, row_last_7, scope_6, x_7_11918);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11471(children_4, committed_6, first_8, identity_6, index_6, installed_0, item_6, last, parent_5, range_owned_1, renderer_5, root_6, scope_7, row_last_8) /* forall<_e,_e1,_e2,a,b,e3> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), committed : ref<global,bool>, first : node, identity : a, index : int, installed : ref<global,bool>, item : b, last : node, parent : node, range-owned : ref<global,bool>, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, scope : kokaine/reactive/integration/lifetime-scope<ui>, row-last : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> keyed-row<e3,b,a> */  {
   
  var x_11_11928 = $std_core_hnd._open_at4(0, function(parent_0_0 /* node */ , before /* maybe<node> */ , first_1_0 /* node */ , last_1 /* node */ ) {
      if (before === null) {
         
        var result_1 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_append_marker_pair(parent_0_0, first_1_0, last_1);
          });
        var _x102 = $std_core_hnd._open_none1(dom_attempt_ok, result_1);
        if (_x102) {
          return $std_core_hnd._open_none1(dom_attempt_value, result_1);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_1)));
        }
      }
      else {
         
        var result_2 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_insert_marker_pair_before(parent_0_0, first_1_0, last_1, before.value);
          });
        var _x103 = $std_core_hnd._open_none1(dom_attempt_ok, result_2);
        if (_x103) {
          return $std_core_hnd._open_none1(dom_attempt_value, result_2);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_2)));
        }
      }
    }, parent_5, $std_core_types.Just(last), first_8, row_last_8);
  if ($std_core_hnd._yielding()) {
    var _x104 = $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_create_keyed_row_11470(children_4, committed_6, first_8, identity_6, index_6, installed_0, item_6, parent_5, range_owned_1, renderer_5, root_6, row_last_8, scope_7, wild___0);
    });
  }
  else {
    var _x104 = _mlift_create_keyed_row_11470(children_4, committed_6, first_8, identity_6, index_6, installed_0, item_6, parent_5, range_owned_1, renderer_5, root_6, row_last_8, scope_7, x_11_11928);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x102 = installed_0.value;
      if (_x102) {
         
        var _x_x1_4_11234 = range_owned_1.value;
        var _x103 = $std_core_hnd._open_none1(function(b /* bool */ ) {
            return (b) ? false : true;
          }, _x_x1_4_11234);
        if (_x103) {
           
          var x_10_11926 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10516_0 /* hnd/ev-index */ ) {
              return _mlift_create_keyed_row_11458(first_8, row_last_8, _y_x10516_0);
            });
          }
          else {
            return _mlift_create_keyed_row_11458(first_8, row_last_8, x_10_11926);
          }
        }
        else {
          return $std_core_types.Unit;
        }
      }
      else {
        return $std_core_types.Unit;
      }
    }, _x104);
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11472(children_5, committed_7, identity_7, index_7, installed_1, item_7, last_0, parent_6, range_owned_2, renderer_6, root_7, scope_8, first_9) /* forall<_e,_e1,_e2,a,b,e3> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), committed : ref<global,bool>, identity : a, index : int, installed : ref<global,bool>, item : b, last : node, parent : node, range-owned : ref<global,bool>, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, scope : kokaine/reactive/integration/lifetime-scope<ui>, first : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> keyed-row<e3,b,a> */  {
   
  var x_12_11932 = $std_core_hnd._open_at1(0, dom_attempt, function() {
      return dom_create_comment("/kokaine:for-row");
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(row_last_9 /* node */ ) {
      return _mlift_create_keyed_row_11471(children_5, committed_7, first_9, identity_7, index_7, installed_1, item_7, last_0, parent_6, range_owned_2, renderer_6, root_7, scope_8, row_last_9);
    });
  }
  else {
    return _mlift_create_keyed_row_11471(children_5, committed_7, first_9, identity_7, index_7, installed_1, item_7, last_0, parent_6, range_owned_2, renderer_6, root_7, scope_8, x_12_11932);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11473(_y_x10507) /* (kokaine/reactive/integration/internal/lifetime-scope/lifetime-scope<ui>) -> exn kokaine/reactive/integration/lifetime-scope<ui> */  {
  return _y_x10507;
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11474(children_6, identity_8, index_8, item_8, last_2, parent_7, renderer_7, root_8, scope_9) /* forall<_e,_e1,_e2,a,b,e3> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), identity : a, index : int, item : b, last : node, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, scope : kokaine/reactive/integration/lifetime-scope<ui>) -> <exn,div,kokaine/reactive/effects/signal-write,ui> keyed-row<e3,b,a> */  {
   
  var committed_8 = { value: false };
   
  var installed_2 = { value: false };
   
  var range_owned_3 = { value: false };
  return $std_core_hnd.finally_prompt(function() {
      var _x105 = committed_8.value;
      if (_x105) {
        return $std_core_types.Unit;
      }
      else {
         
        var x_13_11936 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10509_0 /* hnd/ev-index */ ) {
            return _mlift_create_keyed_row_11457(scope_9, _y_x10509_0);
          });
        }
        else {
          return _mlift_create_keyed_row_11457(scope_9, x_13_11936);
        }
      }
    }, $kokaine_reactive_integration.with_lifetime_scope(root_8, scope_9, function() {
         
        var x_14_11938 = $std_core_hnd._open_at1(0, dom_attempt, function() {
            return dom_create_comment("kokaine:for-row");
          });
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(first_10 /* node */ ) {
            return _mlift_create_keyed_row_11472(children_6, committed_8, identity_8, index_8, installed_2, item_8, last_2, parent_7, range_owned_3, renderer_7, root_8, scope_9, first_10);
          });
        }
        else {
          return _mlift_create_keyed_row_11472(children_6, committed_8, identity_8, index_8, installed_2, item_8, last_2, parent_7, range_owned_3, renderer_7, root_8, scope_9, x_14_11938);
        }
      }));
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11475(drafts, wild___0_0) /* forall<_e,a,b,e1> (drafts : ref<global,list<keyed-row<e1,a,b>>>, wild_@0@0 : ()) -> <ui,exn> () */  {
   
  var rows_10152 = drafts.value;
  return exhaust_keyed_row_actions(rows_10152, function(row_0 /* keyed-row<11012,11010,11011> */ ) {
       
      var scope_1_10154 = $std_core_hnd._open_none1(function(_this /* keyed-row<11012,11010,11011> */ ) {
          return _this.row_scope;
        }, row_0);
      return $kokaine_reactive_integration_internal_lifetime_dash_scope.lifetime_scope_fs_dispose($std_core_hnd._open_none1(function(value_28 /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
          return value_28;
        }, scope_1_10154));
    });
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11476(drafts_0, last_0_0, move_phase, old_order, parent_0_0_0, participation, staged_retirements, _y_x10556) /* forall<_e,a,b,e1> (drafts : ref<global,list<keyed-row<e1,a,b>>>, last@0@0 : node, move-phase : ref<global,bool>, old-order : list<keyed-row<e1,a,b>>, parent@0@0 : node, participation : keyed-participation, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10556, false, function() {
      return $std_core_hnd.finally_prompt(function() {
          var _x106 = move_phase.value;
          if (_x106) {
            return rollback_keyed_order(parent_0_0_0, last_0_0, old_order);
          }
          else {
            return $std_core_types.Unit;
          }
        }, $std_core_hnd.finally_prompt(function() {
             
            var _x_x1_1_11254 = staged_retirements.value;
             
            var x_15_11945 = $std_core_hnd._open_none1(release_keyed_retirements, _x_x1_1_11254);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(wild___0_0_0 /* () */ ) {
                return _mlift_reconcile_keyed_11475(drafts_0, wild___0_0_0);
              });
            }
            else {
              return _mlift_reconcile_keyed_11475(drafts_0, x_15_11945);
            }
          }, discard_keyed_participation(participation)));
    });
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11477(table, _y_x10619) /* forall<a,b,e> (table : ref<global,keyed-table<e,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10619, false, function() {
      return drain_keyed_retirements(table);
    });
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11478(final_updates, _y_x10613) /* forall<a,b,e> (final-updates : list<keyed-update<e,a,b>>, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-write> () */  {
  return $std_core_hnd._mask_at(_y_x10613, false, function() {
      return $std_core_list.foreach(final_updates, function(update_1 /* keyed-update<11012,11010,11011> */ ) {
          return commit_keyed_update(update_1);
        });
    });
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11479(committed_0_0, final_index, final_order, retirements, staged_retirements_0, table_0, wild___18) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, retirements : list<keyed-retirement<e1,a,b>>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, table : ref<global,keyed-table<e1,a,b>>, wild_@18 : ()) -> <ui,div,exn,kokaine/reactive/effects/signal-write> () */  {
   
  ((table_0).value = (Keyed_table(final_index, final_order, retirements)));
   
  ((staged_retirements_0).value = ($std_core_types.Nil));
   
  ((committed_0_0).value = true);
   
  var x_16_11949 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10619_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11477(table_0, _y_x10619_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11477(table_0, x_16_11949);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11480(committed_0_1, final_index_0, final_order_0, final_updates_0, retirements_0, staged_retirements_1, table_1, wild___17) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, retirements : list<keyed-retirement<e1,a,b>>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, table : ref<global,keyed-table<e1,a,b>>, wild_@17 : ()) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_18_11954 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
   
  if ($std_core_hnd._yielding()) {
    var x_17_11951 = $std_core_hnd.yield_extend(function(_y_x10613_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11478(final_updates_0, _y_x10613_0);
    });
  }
  else {
    var x_17_11951 = _mlift_reconcile_keyed_11478(final_updates_0, x_18_11954);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___18_0 /* () */ ) {
      return _mlift_reconcile_keyed_11479(committed_0_1, final_index_0, final_order_0, retirements_0, staged_retirements_1, table_1, wild___18_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11479(committed_0_1, final_index_0, final_order_0, retirements_0, staged_retirements_1, table_1, x_17_11951);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11481(committed_0_2, final_index_1, final_order_1, final_updates_1, publication_transaction, retirements_1, staged_retirements_2, table_2, _y_x10610) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, retirements : list<keyed-retirement<e1,a,b>>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, table : ref<global,keyed-table<e1,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_19_11956 = $std_core_hnd._mask_at(_y_x10610, false, function() {
      return $kokaine_dom_internal_keyed_dash_transaction.publish_keyed_transaction(publication_transaction);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___17_0 /* () */ ) {
      return _mlift_reconcile_keyed_11480(committed_0_2, final_index_1, final_order_1, final_updates_1, retirements_1, staged_retirements_2, table_2, wild___17_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11480(committed_0_2, final_index_1, final_order_1, final_updates_1, retirements_1, staged_retirements_2, table_2, x_19_11956);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11482(committed_0_3, final_index_2, final_order_2, final_updates_2, publication_transaction_0, retirements_2, staged_retirements_3, table_3, wild___16) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, retirements : list<keyed-retirement<e1,a,b>>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, table : ref<global,keyed-table<e1,a,b>>, wild_@16 : ()) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_20_11958 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10610_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11481(committed_0_3, final_index_2, final_order_2, final_updates_2, publication_transaction_0, retirements_2, staged_retirements_3, table_3, _y_x10610_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11481(committed_0_3, final_index_2, final_order_2, final_updates_2, publication_transaction_0, retirements_2, staged_retirements_3, table_3, x_20_11958);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11483(committed_0_4, final_index_3, final_order_3, final_updates_3, participation_0, publication_transaction_1, retirements_3, staged_retirements_4, table_4, _y_x10606) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, retirements : list<keyed-retirement<e1,a,b>>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, table : ref<global,keyed-table<e1,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_21_11960 = $std_core_hnd._mask_at(_y_x10606, false, function() {
      if (participation_0._tag === 1) {
        return $kokaine_reactive_integration_internal_provision.promote_provision($std_core_hnd._open_none1(function(value_54 /* kokaine/reactive/integration/provision-lease<ui> */ ) {
            return value_54;
          }, participation_0.keyed_lease));
      }
      else {
        return $std_core_types.Unit;
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___16_0 /* () */ ) {
      return _mlift_reconcile_keyed_11482(committed_0_4, final_index_3, final_order_3, final_updates_3, publication_transaction_1, retirements_3, staged_retirements_4, table_4, wild___16_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11482(committed_0_4, final_index_3, final_order_3, final_updates_3, publication_transaction_1, retirements_3, staged_retirements_4, table_4, x_21_11960);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11484(committed_0_5, final_index_4, final_order_4, final_updates_4, participation_1, publication_transaction_2, retirements_4, staged_retirements_5, table_5, wild___15) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, retirements : list<keyed-retirement<e1,a,b>>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, table : ref<global,keyed-table<e1,a,b>>, wild_@15 : ()) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_22_11962 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10606_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11483(committed_0_5, final_index_4, final_order_4, final_updates_4, participation_1, publication_transaction_2, retirements_4, staged_retirements_5, table_5, _y_x10606_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11483(committed_0_5, final_index_4, final_order_4, final_updates_4, participation_1, publication_transaction_2, retirements_4, staged_retirements_5, table_5, x_22_11962);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11485(committed_0_6, final_index_5, final_order_5, final_updates_5, participation_2, publication_transaction_3, retirements_5, staged_retirements_6, table_6, _y_x10603) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, retirements : list<keyed-retirement<e1,a,b>>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, table : ref<global,keyed-table<e1,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_23_11964 = $std_core_hnd._mask_at(_y_x10603, false, function() {
      return $kokaine_dom_internal_keyed_dash_transaction.prepare_keyed_transaction(publication_transaction_3);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___15_0 /* () */ ) {
      return _mlift_reconcile_keyed_11484(committed_0_6, final_index_5, final_order_5, final_updates_5, participation_2, publication_transaction_3, retirements_5, staged_retirements_6, table_6, wild___15_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11484(committed_0_6, final_index_5, final_order_5, final_updates_5, participation_2, publication_transaction_3, retirements_5, staged_retirements_6, table_6, x_23_11964);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11486(committed_0_7, final_index_6, final_order_6, final_updates_6, participation_3, publication_transaction_4, staged_retirements_7, table_7, retirements_6) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, table : ref<global,keyed-table<e1,a,b>>, retirements : list<keyed-retirement<e1,a,b>>) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  ((staged_retirements_7).value = retirements_6);
   
  var x_24_11966 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10603_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11485(committed_0_7, final_index_6, final_order_6, final_updates_6, participation_3, publication_transaction_4, retirements_6, staged_retirements_7, table_7, _y_x10603_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11485(committed_0_7, final_index_6, final_order_6, final_updates_6, participation_3, publication_transaction_4, retirements_6, staged_retirements_7, table_7, x_24_11966);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11487(committed_0_8, final_index_7, final_order_7, final_updates_7, participation_4, publication_transaction_5, staged_retirements_8, stale, table_8, wild___13) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, stale : list<keyed-row<e1,a,b>>, table : ref<global,keyed-table<e1,a,b>>, wild_@13 : ()) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_25_11968 = $std_core_hnd._open_at1(0, function(rows_0 /* list<keyed-row<11012,11010,11011>> */ ) {
      return stage_keyed_retirements_loop(rows_0, $std_core_types.Nil);
    }, stale);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(retirements_7 /* list<keyed-retirement<11012,11010,11011>> */ ) {
      return _mlift_reconcile_keyed_11486(committed_0_8, final_index_7, final_order_7, final_updates_7, participation_4, publication_transaction_5, staged_retirements_8, table_8, retirements_7);
    });
  }
  else {
    return _mlift_reconcile_keyed_11486(committed_0_8, final_index_7, final_order_7, final_updates_7, participation_4, publication_transaction_5, staged_retirements_8, table_8, x_25_11968);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11488(committed_0_9, final_index_8, final_order_8, final_updates_8, participation_5, publication_transaction_6, root_0_0, scope_0_0, staged_retirements_9, stale_0, table_9, _y_x10598) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, stale : list<keyed-row<e1,a,b>>, table : ref<global,keyed-table<e1,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_26_11970 = $std_core_hnd._mask_at(_y_x10598, false, function() {
      return $kokaine_reactive_integration.with_lifetime_scope(root_0_0, scope_0_0, function() {
          return $std_core_types.Unit;
        });
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___13_0 /* () */ ) {
      return _mlift_reconcile_keyed_11487(committed_0_9, final_index_8, final_order_8, final_updates_8, participation_5, publication_transaction_6, staged_retirements_9, stale_0, table_9, wild___13_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11487(committed_0_9, final_index_8, final_order_8, final_updates_8, participation_5, publication_transaction_6, staged_retirements_9, stale_0, table_9, x_26_11970);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11489(committed_0_10, final_index_9, final_order_9, final_updates_9, participation_6, publication_transaction_7, root_0_0_0, scope_0_0_0, staged_retirements_10, stale_1, table_10, wild___12) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, stale : list<keyed-row<e1,a,b>>, table : ref<global,keyed-table<e1,a,b>>, wild_@12 : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_27_11972 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10598_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11488(committed_0_10, final_index_9, final_order_9, final_updates_9, participation_6, publication_transaction_7, root_0_0_0, scope_0_0_0, staged_retirements_10, stale_1, table_10, _y_x10598_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11488(committed_0_10, final_index_9, final_order_9, final_updates_9, participation_6, publication_transaction_7, root_0_0_0, scope_0_0_0, staged_retirements_10, stale_1, table_10, x_27_11972);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11490(committed_0_11, final_index_10, final_order_10, final_updates_10, last_0_0_0, parent_0_0_1, participation_7, physical_order, publication_transaction_8, root_0_0_1, scope_0_0_1, staged_retirements_11, stale_2, table_11, placed) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, last@0@0 : node, parent@0@0 : node, participation : keyed-participation, physical-order : list<keyed-row<e1,a,b>>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, stale : list<keyed-row<e1,a,b>>, table : ref<global,keyed-table<e1,a,b>>, placed : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_28_11974 = $std_core_hnd._open_at4(0, validate_keyed_order, parent_0_0_1, last_0_0_0, placed, physical_order);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___12_0 /* () */ ) {
      return _mlift_reconcile_keyed_11489(committed_0_11, final_index_10, final_order_10, final_updates_10, participation_7, publication_transaction_8, root_0_0_1, scope_0_0_1, staged_retirements_11, stale_2, table_11, wild___12_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11489(committed_0_11, final_index_10, final_order_10, final_updates_10, participation_7, publication_transaction_8, root_0_0_1, scope_0_0_1, staged_retirements_11, stale_2, table_11, x_28_11974);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11491(_y_x10593) /* (node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11492(final_updates_11, parent_0_0_2, cursor) /* forall<a,b,e> (final-updates : list<keyed-update<e,a,b>>, parent@0@0 : node, cursor : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_29_11976 = $std_core_hnd._open_at3(0, place_keyed_updates, parent_0_0_2, cursor, final_updates_11);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_reconcile_keyed_11491);
  }
  else {
    return _mlift_reconcile_keyed_11491(x_29_11976);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11493(final_updates_12, first_0_0, last_0_0_1, move_phase_0, parent_0_0_3, wild___9) /* forall<_e,a,b,e1> (final-updates : list<keyed-update<e1,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, parent@0@0 : node, wild_@9 : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  ((move_phase_0).value = true);
   
  var x_30_11978 = $std_core_hnd._open_at3(0, function(parent_3_0 /* node */ , first_5_0 /* node */ , last_5 /* node */ ) {
       
      var result_3 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_range_first(parent_3_0, first_5_0, last_5);
        });
      var _x107 = $std_core_hnd._open_none1(dom_attempt_ok, result_3);
      if (_x107) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_3);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_3)));
      }
    }, parent_0_0_3, first_0_0, last_0_0_1);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(cursor_0 /* node */ ) {
      return _mlift_reconcile_keyed_11492(final_updates_12, parent_0_0_3, cursor_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11492(final_updates_12, parent_0_0_3, x_30_11978);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11494(committed_0_12, final_index_11, final_order_11, final_updates_13, first_0_0_0, last_0_0_2, parent_0_0_4, participation_8, physical_order_0, publication_transaction_9, root_0_0_2, scope_0_0_2, staged_retirements_12, stale_3, table_12, _c_x10594) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, first@0@0 : node, last@0@0 : node, parent@0@0 : node, participation : keyed-participation, physical-order : list<keyed-row<e1,a,b>>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, stale : list<keyed-row<e1,a,b>>, table : ref<global,keyed-table<e1,a,b>>, ()) -> () */  {
   
  var x_31_11981 = $std_core_hnd._open_at3(0, function(parent_4_0 /* node */ , first_6_0 /* node */ , last_6 /* node */ ) {
       
      var result_4 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_range_first(parent_4_0, first_6_0, last_6);
        });
      var _x107 = $std_core_hnd._open_none1(dom_attempt_ok, result_4);
      if (_x107) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_4);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_4)));
      }
    }, parent_0_0_4, first_0_0_0, last_0_0_2);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(placed_0 /* node */ ) {
      return _mlift_reconcile_keyed_11490(committed_0_12, final_index_11, final_order_11, final_updates_13, last_0_0_2, parent_0_0_4, participation_8, physical_order_0, publication_transaction_9, root_0_0_2, scope_0_0_2, staged_retirements_12, stale_3, table_12, placed_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11490(committed_0_12, final_index_11, final_order_11, final_updates_13, last_0_0_2, parent_0_0_4, participation_8, physical_order_0, publication_transaction_9, root_0_0_2, scope_0_0_2, staged_retirements_12, stale_3, table_12, x_31_11981);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11495(committed_0_13, final_index_12, final_order_12, final_updates_14, first_0_0_1, last_0_0_3, move_phase_1, parent_0_0_5, participation_9, physical_order_1, publication_transaction_10, root_0_0_3, scope_0_0_3, staged_retirements_13, stale_4, table_13, _y_x10589) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, parent@0@0 : node, participation : keyed-participation, physical-order : list<keyed-row<e1,a,b>>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, stale : list<keyed-row<e1,a,b>>, table : ref<global,keyed-table<e1,a,b>>, bool) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var order_changed = $std_core_hnd._open_none1(function(b_1 /* bool */ ) {
      return (b_1) ? false : true;
    }, _y_x10589);
   
  if (order_changed) {
     
    var x_33_11986 = $std_core_hnd._open_at2(0, validate_keyed_move_lifecycles, parent_0_0_5, physical_order_1);
    if ($std_core_hnd._yielding()) {
      var x_32_11984 = $std_core_hnd.yield_extend(function(wild___9_0 /* () */ ) {
        return _mlift_reconcile_keyed_11493(final_updates_14, first_0_0_1, last_0_0_3, move_phase_1, parent_0_0_5, wild___9_0);
      });
    }
    else {
      var x_32_11984 = _mlift_reconcile_keyed_11493(final_updates_14, first_0_0_1, last_0_0_3, move_phase_1, parent_0_0_5, x_33_11986);
    }
  }
  else {
    var x_32_11984 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10594_0 /* () */ ) {
      return _mlift_reconcile_keyed_11494(committed_0_13, final_index_12, final_order_12, final_updates_14, first_0_0_1, last_0_0_3, parent_0_0_5, participation_9, physical_order_1, publication_transaction_10, root_0_0_3, scope_0_0_3, staged_retirements_13, stale_4, table_13, _c_x10594_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11494(committed_0_13, final_index_12, final_order_12, final_updates_14, first_0_0_1, last_0_0_3, parent_0_0_5, participation_9, physical_order_1, publication_transaction_10, root_0_0_3, scope_0_0_3, staged_retirements_13, stale_4, table_13, x_32_11984);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11496(committed_0_14, final_index_13, final_order_13, final_updates_15, first_0_0_2, last_0_0_4, move_phase_2, parent_0_0_6, participation_10, physical_order_2, publication_transaction_11, root_0_0_4, scope_0_0_4, staged_retirements_14, stale_5, table_14, current_cursor) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, parent@0@0 : node, participation : keyed-participation, physical-order : list<keyed-row<e1,a,b>>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, stale : list<keyed-row<e1,a,b>>, table : ref<global,keyed-table<e1,a,b>>, current-cursor : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_34_11988 = $std_core_hnd._open_at4(0, keyed_order_matches, parent_0_0_6, last_0_0_4, current_cursor, physical_order_2);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10589_0 /* bool */ ) {
      return _mlift_reconcile_keyed_11495(committed_0_14, final_index_13, final_order_13, final_updates_15, first_0_0_2, last_0_0_4, move_phase_2, parent_0_0_6, participation_10, physical_order_2, publication_transaction_11, root_0_0_4, scope_0_0_4, staged_retirements_14, stale_5, table_14, _y_x10589_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11495(committed_0_14, final_index_13, final_order_13, final_updates_15, first_0_0_2, last_0_0_4, move_phase_2, parent_0_0_6, participation_10, physical_order_2, publication_transaction_11, root_0_0_4, scope_0_0_4, staged_retirements_14, stale_5, table_14, x_34_11988);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11497(committed_0_15, final_index_14, final_order_14, final_updates_16, first_0_0_3, last_0_0_5, move_phase_3, parent_0_0_7, participation_11, publication_transaction_12, root_0_0_5, scope_0_0_5, staged_retirements_15, stale_6, table_15, wild___8) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, parent@0@0 : node, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, stale : list<keyed-row<e1,a,b>>, table : ref<global,keyed-table<e1,a,b>>, wild_@8 : ()) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var physical_order_3 = $std_core_list.append(final_order_14, stale_6);
   
  var x_35_11990 = $std_core_hnd._open_at3(0, function(parent_2_0 /* node */ , first_4_0 /* node */ , last_4 /* node */ ) {
       
      var result_5 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_range_first(parent_2_0, first_4_0, last_4);
        });
      var _x107 = $std_core_hnd._open_none1(dom_attempt_ok, result_5);
      if (_x107) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_5);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_5)));
      }
    }, parent_0_0_7, first_0_0_3, last_0_0_5);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(current_cursor_0 /* node */ ) {
      return _mlift_reconcile_keyed_11496(committed_0_15, final_index_14, final_order_14, final_updates_16, first_0_0_3, last_0_0_5, move_phase_3, parent_0_0_7, participation_11, physical_order_3, publication_transaction_12, root_0_0_5, scope_0_0_5, staged_retirements_15, stale_6, table_15, current_cursor_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11496(committed_0_15, final_index_14, final_order_14, final_updates_16, first_0_0_3, last_0_0_5, move_phase_3, parent_0_0_7, participation_11, physical_order_3, publication_transaction_12, root_0_0_5, scope_0_0_5, staged_retirements_15, stale_6, table_15, x_35_11990);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11498(committed_0_16, final_index_15, final_order_15, final_updates_17, first_0_0_4, last_0_0_6, move_phase_4, parent_0_0_8, participation_12, publication_transaction_13, renderer_0_0, root_0_0_6, scope_0_0_6, staged_retirements_16, stale_7, table_16, _y_x10584) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, parent@0@0 : node, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, stale : list<keyed-row<e1,a,b>>, table : ref<global,keyed-table<e1,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_36_11993 = $std_core_hnd._mask_at(_y_x10584, false, function() {
      if (participation_12._tag === 1) {
        return $kokaine_dom_internal_keyed_dash_transaction.with_keyed_transaction(renderer_0_0, participation_12.keyed_provision, participation_12.keyed_journal, function() {
            return $kokaine_reactive_integration_internal_provision.drain_provision($std_core_hnd._open_none1(function(value /* kokaine/reactive/integration/provision-lease<ui> */ ) {
                return value;
              }, participation_12.keyed_lease));
          });
      }
      else {
        return $std_core_types.Unit;
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___8_0 /* () */ ) {
      return _mlift_reconcile_keyed_11497(committed_0_16, final_index_15, final_order_15, final_updates_17, first_0_0_4, last_0_0_6, move_phase_4, parent_0_0_8, participation_12, publication_transaction_13, root_0_0_6, scope_0_0_6, staged_retirements_16, stale_7, table_16, wild___8_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11497(committed_0_16, final_index_15, final_order_15, final_updates_17, first_0_0_4, last_0_0_6, move_phase_4, parent_0_0_8, participation_12, publication_transaction_13, root_0_0_6, scope_0_0_6, staged_retirements_16, stale_7, table_16, x_36_11993);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11499(root_0_0_7, scope_0_0_7, wild___26) /* (root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, wild_@26 : ()) -> <ui,exn> () */  {
  return $kokaine_reactive_integration.with_lifetime_scope(root_0_0_7, scope_0_0_7, function() {
      return $std_core_types.Unit;
    });
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11500(final_order_16, last_0_0_7, parent_0_0_9, root_0_0_8, scope_0_0_8, placed_0_0) /* forall<a,b,e> (final-order : list<keyed-row<e,a,b>>, last@0@0 : node, parent@0@0 : node, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, placed@0 : node) -> <ui,exn> () */  {
   
  var x_37_11997 = validate_keyed_order(parent_0_0_9, last_0_0_7, placed_0_0, final_order_16);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___26_0 /* () */ ) {
      return _mlift_reconcile_keyed_11499(root_0_0_8, scope_0_0_8, wild___26_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11499(root_0_0_8, scope_0_0_8, x_37_11997);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11501(_y_x10632) /* (node) -> <ui,exn> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11502(final_updates_18, parent_0_0_10, cursor_0_0) /* forall<a,b,e> (final-updates : list<keyed-update<e,a,b>>, parent@0@0 : node, cursor@0 : node) -> <ui,exn> () */  {
   
  var x_38_11999 = place_keyed_updates(parent_0_0_10, cursor_0_0, final_updates_18);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_reconcile_keyed_11501);
  }
  else {
    return _mlift_reconcile_keyed_11501(x_38_11999);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11503(final_updates_19, first_0_0_5, last_0_0_8, move_phase_5, parent_0_0_11, wild___23) /* forall<_e,a,b,e1> (final-updates : list<keyed-update<e1,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, parent@0@0 : node, wild_@23 : ()) -> <ui,exn> () */  {
   
  ((move_phase_5).value = true);
   
  var result_6 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_range_first(parent_0_0_11, first_0_0_5, last_0_0_8);
    });
   
  var _x107 = $std_core_hnd._open_none1(dom_attempt_ok, result_6);
  if (_x107) {
    var x_39_12001 = $std_core_hnd._open_none1(dom_attempt_value, result_6);
  }
  else {
    var x_39_12001 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_6)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(cursor_0_1 /* node */ ) {
      return _mlift_reconcile_keyed_11502(final_updates_19, parent_0_0_11, cursor_0_1);
    });
  }
  else {
    return _mlift_reconcile_keyed_11502(final_updates_19, parent_0_0_11, x_39_12001);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11504(final_order_17, first_0_0_6, last_0_0_9, parent_0_0_12, root_0_0_9, scope_0_0_9, _c_x10633) /* forall<a,b,e> (final-order : list<keyed-row<e,a,b>>, first@0@0 : node, last@0@0 : node, parent@0@0 : node, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, ()) -> () */  {
   
  var result_7 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_range_first(parent_0_0_12, first_0_0_6, last_0_0_9);
    });
   
  var _x107 = $std_core_hnd._open_none1(dom_attempt_ok, result_7);
  if (_x107) {
    var x_40_12004 = $std_core_hnd._open_none1(dom_attempt_value, result_7);
  }
  else {
    var x_40_12004 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_7)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(placed_0_1 /* node */ ) {
      return _mlift_reconcile_keyed_11500(final_order_17, last_0_0_9, parent_0_0_12, root_0_0_9, scope_0_0_9, placed_0_1);
    });
  }
  else {
    return _mlift_reconcile_keyed_11500(final_order_17, last_0_0_9, parent_0_0_12, root_0_0_9, scope_0_0_9, x_40_12004);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11505(final_order_18, final_updates_20, first_0_0_7, last_0_0_10, move_phase_6, parent_0_0_13, root_0_0_10, scope_0_0_10, _y_x10629) /* forall<_e,a,b,e1> (final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, parent@0@0 : node, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, bool) -> <ui,exn> () */  {
   
  var order_changed_0 = $std_core_hnd._open_none1(function(b_4 /* bool */ ) {
      return (b_4) ? false : true;
    }, _y_x10629);
   
  if (order_changed_0) {
     
    var x_42_12009 = validate_keyed_move_lifecycles(parent_0_0_13, final_order_18);
    if ($std_core_hnd._yielding()) {
      var x_41_12007 = $std_core_hnd.yield_extend(function(wild___23_0 /* () */ ) {
        return _mlift_reconcile_keyed_11503(final_updates_20, first_0_0_7, last_0_0_10, move_phase_6, parent_0_0_13, wild___23_0);
      });
    }
    else {
      var x_41_12007 = _mlift_reconcile_keyed_11503(final_updates_20, first_0_0_7, last_0_0_10, move_phase_6, parent_0_0_13, x_42_12009);
    }
  }
  else {
    var x_41_12007 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10633_0 /* () */ ) {
      return _mlift_reconcile_keyed_11504(final_order_18, first_0_0_7, last_0_0_10, parent_0_0_13, root_0_0_10, scope_0_0_10, _c_x10633_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11504(final_order_18, first_0_0_7, last_0_0_10, parent_0_0_13, root_0_0_10, scope_0_0_10, x_41_12007);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11506(final_order_19, final_updates_21, first_0_0_8, last_0_0_11, move_phase_7, parent_0_0_14, root_0_0_11, scope_0_0_11, current_cursor_0_0) /* forall<_e,a,b,e1> (final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, parent@0@0 : node, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, current-cursor@0 : node) -> <ui,exn> () */  {
   
  var x_43_12011 = keyed_order_matches(parent_0_0_14, last_0_0_11, current_cursor_0_0, final_order_19);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10629_0 /* bool */ ) {
      return _mlift_reconcile_keyed_11505(final_order_19, final_updates_21, first_0_0_8, last_0_0_11, move_phase_7, parent_0_0_14, root_0_0_11, scope_0_0_11, _y_x10629_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11505(final_order_19, final_updates_21, first_0_0_8, last_0_0_11, move_phase_7, parent_0_0_14, root_0_0_11, scope_0_0_11, x_43_12011);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11507(enlisted, wild___28) /* forall<_e> (enlisted : ref<global,bool>, wild_@28 : ()) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return ((enlisted).value = true);
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11508(committed_0_17, drafts_1, enlisted_0, final_index_16, final_order_20, final_updates_22, first_0_0_9, last_0_0_12, move_phase_8, old_order_0, parent_0_0_15, publication_transaction_14, root_0_0_12, scope_0_0_12, table_17, _y_x10627) /* forall<_e,_e1,a,b,e2> (committed@0 : ref<global,bool>, drafts : ref<global,list<keyed-row<e2,a,b>>>, enlisted : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e2,a,b>>, final-order : list<keyed-row<e2,a,b>>, final-updates : list<keyed-update<e2,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, old-order : list<keyed-row<e2,a,b>>, parent@0@0 : node, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, table : ref<global,keyed-table<e2,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_44_12013 = $std_core_hnd._mask_at(_y_x10627, false, function() {
      return $kokaine_dom_internal_keyed_dash_transaction.stage_keyed_publication(publication_transaction_14, function() {
           
          var result_8 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
              return dom_range_first(parent_0_0_15, first_0_0_9, last_0_0_12);
            });
           
          var _x107 = $std_core_hnd._open_none1(dom_attempt_ok, result_8);
          if (_x107) {
            var x_45_12015 = $std_core_hnd._open_none1(dom_attempt_value, result_8);
          }
          else {
            var x_45_12015 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_8)));
          }
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(current_cursor_0_1 /* node */ ) {
              return _mlift_reconcile_keyed_11506(final_order_20, final_updates_22, first_0_0_9, last_0_0_12, move_phase_8, parent_0_0_15, root_0_0_12, scope_0_0_12, current_cursor_0_1);
            });
          }
          else {
            return _mlift_reconcile_keyed_11506(final_order_20, final_updates_22, first_0_0_9, last_0_0_12, move_phase_8, parent_0_0_15, root_0_0_12, scope_0_0_12, x_45_12015);
          }
        }, function() {
           
          ((table_17).value = (Keyed_table(final_index_16, final_order_20, $std_core_types.Nil)));
          return ((committed_0_17).value = true);
        }, function() {
           
          var rows_1_10207 = drafts_1.value;
          return $std_core_hnd.finally_prompt(function() {
              var _x107 = move_phase_8.value;
              if (_x107) {
                return rollback_keyed_order(parent_0_0_15, last_0_0_12, old_order_0);
              }
              else {
                return $std_core_types.Unit;
              }
            }, exhaust_keyed_row_actions(rows_1_10207, function(row_1 /* keyed-row<11012,11010,11011> */ ) {
                 
                var scope_2_10209 = $std_core_hnd._open_none1(function(_this_4 /* keyed-row<11012,11010,11011> */ ) {
                    return _this_4.row_scope;
                  }, row_1);
                return $kokaine_reactive_integration_internal_lifetime_dash_scope.lifetime_scope_fs_dispose($std_core_hnd._open_none1(function(value_60 /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
                    return value_60;
                  }, scope_2_10209));
              }));
        });
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___28_0 /* () */ ) {
      return _mlift_reconcile_keyed_11507(enlisted_0, wild___28_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11507(enlisted_0, x_44_12013);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11509(committed_0_18, drafts_2, enlisted_1, final_index_17, final_order_21, final_updates_23, first_0_0_10, last_0_0_13, move_phase_9, old_order_1, parent_0_0_16, publication_transaction_15, root_0_0_13, scope_0_0_13, table_18, _c_x10626) /* forall<_e,_e1,a,b,e2> (committed@0 : ref<global,bool>, drafts : ref<global,list<keyed-row<e2,a,b>>>, enlisted : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e2,a,b>>, final-order : list<keyed-row<e2,a,b>>, final-updates : list<keyed-update<e2,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, old-order : list<keyed-row<e2,a,b>>, parent@0@0 : node, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, table : ref<global,keyed-table<e2,a,b>>, ()) -> () */  {
   
  var x_46_12020 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10627_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11508(committed_0_18, drafts_2, enlisted_1, final_index_17, final_order_21, final_updates_23, first_0_0_10, last_0_0_13, move_phase_9, old_order_1, parent_0_0_16, publication_transaction_15, root_0_0_13, scope_0_0_13, table_18, _y_x10627_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11508(committed_0_18, drafts_2, enlisted_1, final_index_17, final_order_21, final_updates_23, first_0_0_10, last_0_0_13, move_phase_9, old_order_1, parent_0_0_16, publication_transaction_15, root_0_0_13, scope_0_0_13, table_18, x_46_12020);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11510(committed_0_19, drafts_3, enlisted_2, final_index_18, final_updates_24, first_0_0_11, last_0_0_14, move_phase_10, old_order_2, owns_provision, parent_0_0_17, participation_13, publication_transaction_16, renderer_0_1, root_0_0_14, scope_0_0_14, staged_retirements_17, stale_8, table_19, final_order_22) /* forall<_e,_e1,a,b,e2> (committed@0 : ref<global,bool>, drafts : ref<global,list<keyed-row<e2,a,b>>>, enlisted : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e2,a,b>>, final-updates : list<keyed-update<e2,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, old-order : list<keyed-row<e2,a,b>>, owns-provision : bool, parent@0@0 : node, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e2,a,b>>>, stale : list<keyed-row<e2,a,b>>, table : ref<global,keyed-table<e2,a,b>>, final-order : list<keyed-row<e2,a,b>>) -> <div,exn,kokaine/reactive/effects/signal-write,ui> () */  {
  if (owns_provision) {
     
    var x_47_12022 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10584_0 /* hnd/ev-index */ ) {
        return _mlift_reconcile_keyed_11498(committed_0_19, final_index_18, final_order_22, final_updates_24, first_0_0_11, last_0_0_14, move_phase_10, parent_0_0_17, participation_13, publication_transaction_16, renderer_0_1, root_0_0_14, scope_0_0_14, staged_retirements_17, stale_8, table_19, _y_x10584_0);
      });
    }
    else {
      return _mlift_reconcile_keyed_11498(committed_0_19, final_index_18, final_order_22, final_updates_24, first_0_0_11, last_0_0_14, move_phase_10, parent_0_0_17, participation_13, publication_transaction_16, renderer_0_1, root_0_0_14, scope_0_0_14, staged_retirements_17, stale_8, table_19, x_47_12022);
    }
  }
  else {
     
    var _x_x1_31_11321 = $std_core_hnd._open_none1(function(list /* list<keyed-row<11012,11010,11011>> */ ) {
        return (list === null);
      }, old_order_2);
     
    var _x107 = $std_core_hnd._open_none1(function(b_2 /* bool */ ) {
        return (b_2) ? false : true;
      }, _x_x1_31_11321);
    if (_x107) {
      var x_48_12024 = $std_core_hnd._open_at2(0, $std_core_exn.$throw, "joined keyed reconciliation must be initial construction");
    }
    else {
       
      var _x_x1_34_11325 = $std_core_hnd._open_none1(function(list_0 /* list<keyed-row<11012,11010,11011>> */ ) {
          return (list_0 === null);
        }, stale_8);
      var _x108 = $std_core_hnd._open_none1(function(b_3 /* bool */ ) {
          return (b_3) ? false : true;
        }, _x_x1_34_11325);
      if (_x108) {
        var x_48_12024 = $std_core_hnd._open_at2(0, $std_core_exn.$throw, "joined keyed reconciliation must be initial construction");
      }
      else {
        var x_48_12024 = $std_core_types.Unit;
      }
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10626_0 /* () */ ) {
        return _mlift_reconcile_keyed_11509(committed_0_19, drafts_3, enlisted_2, final_index_18, final_order_22, final_updates_24, first_0_0_11, last_0_0_14, move_phase_10, old_order_2, parent_0_0_17, publication_transaction_16, root_0_0_14, scope_0_0_14, table_19, _c_x10626_0);
      });
    }
    else {
      return _mlift_reconcile_keyed_11509(committed_0_19, drafts_3, enlisted_2, final_index_18, final_order_22, final_updates_24, first_0_0_11, last_0_0_14, move_phase_10, old_order_2, parent_0_0_17, publication_transaction_16, root_0_0_14, scope_0_0_14, table_19, x_48_12024);
    }
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11511(current_index, existing, item_changed, item_0_0, position, updates, _c_x10576) /* forall<_e,_e1,a,b,e2> (current-index : int, existing : keyed-row<e2,a,b>, item-changed : bool, item@0@0 : a, position : ref<global,int>, updates : ref<global,list<keyed-update<e2,a,b>>>, ()) -> () */  {
   
  var value_39_0_10982 = $std_core_hnd._open_none1(function(_this_1 /* keyed-row<11012,11010,11011> */ ) {
      return _this_1.row_current_index;
    }, existing);
   
  var update = Keyed_update(existing, item_0_0, current_index, item_changed, $std_core_types._int_ne((value_39_0_10982.value),current_index));
   
  var value_40_10985 = $std_core_types.Cons(update, updates.value);
   
  ((updates).value = value_40_10985);
   
  var value_42_10988 = $std_core_types._int_add(current_index,1);
  return ((position).value = value_42_10988);
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11512(current_index_0, draft, item_0_0_0, position_0, updates_0, _c_x10579) /* forall<_e,_e1,a,b,e2> (current-index : int, draft : keyed-row<e2,a,b>, item@0@0 : a, position : ref<global,int>, updates : ref<global,list<keyed-update<e2,a,b>>>, ()) -> () */  {
   
  var value_46_0_10999 = $std_core_hnd._open_none1(function(_this_2 /* keyed-row<11012,11010,11011> */ ) {
      return _this_2.row_current_index;
    }, draft);
   
  var update_0 = Keyed_update(draft, item_0_0_0, current_index_0, false, $std_core_types._int_ne((value_46_0_10999.value),current_index_0));
   
  var value_47_11002 = $std_core_types.Cons(update_0, updates_0.value);
   
  ((updates_0).value = value_47_11002);
   
  var value_49_11005 = $std_core_types._int_add(current_index_0,1);
  return ((position_0).value = value_49_11005);
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11513(compare, current_index_1, drafts_4, identity_0_0, item_0_0_1, next_index, position_1, updates_1, draft_0) /* forall<_e,_e1,a,b,e2> (compare : (b, b) -> order, current-index : int, drafts : ref<global,list<keyed-row<e2,a,b>>>, identity@0@0 : b, item@0@0 : a, next-index : ref<global,kokaine/internal/key-index/key-index<b,keyed-row<e2,a,b>>>, position : ref<global,int>, updates : ref<global,list<keyed-update<e2,a,b>>>, draft : keyed-row<e2,a,b>) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var value_43_10992 = $std_core_types.Cons(draft_0, drafts_4.value);
   
  ((drafts_4).value = value_43_10992);
   
  var _x_x1_16_11285 = next_index.value;
   
  var _x107 = $std_core_hnd._open_none4($kokaine_internal_key_dash_index.insert, _x_x1_16_11285, identity_0_0, draft_0, compare);
  if (_x107._tag === 2) {
    var x_49_12026 = $std_core_hnd._open_at2(0, $std_core_exn.$throw, "duplicate key in keyed For");
  }
  else {
    var x_49_12026 = ((next_index).value = (_x107.index));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10579_0 /* () */ ) {
      return _mlift_reconcile_keyed_11512(current_index_1, draft_0, item_0_0_1, position_1, updates_1, _c_x10579_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11512(current_index_1, draft_0, item_0_0_1, position_1, updates_1, x_49_12026);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11514(committed_0_20, compare_0, drafts_5, enlisted_3, first_0_0_12, last_0_0_15, move_phase_11, next_index_0, old_order_3, owns_provision_0, parent_0_0_18, participation_14, publication_transaction_17, renderer_0_2, root_0_0_15, scope_0_0_15, staged_retirements_18, table_20, updates_2, wild___7) /* forall<_e,_e1,a,b,e2> (committed@0 : ref<global,bool>, compare : (b, b) -> order, drafts : ref<global,list<keyed-row<e2,a,b>>>, enlisted : ref<global,bool>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, next-index : ref<global,kokaine/internal/key-index/key-index<b,keyed-row<e2,a,b>>>, old-order : list<keyed-row<e2,a,b>>, owns-provision : bool, parent@0@0 : node, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e2,a,b>>>, table : ref<global,keyed-table<e2,a,b>>, updates : ref<global,list<keyed-update<e2,a,b>>>, wild_@7 : ()) -> <div,exn,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var xs_0_11008 = updates_2.value;
   
  var final_updates_25 = $std_core_list.reverse_acc($std_core_types.Nil, xs_0_11008);
   
  var final_index_19 = next_index_0.value;
   
  var stale_9 = $std_core_hnd._open_none3(collect_stale_rows, old_order_3, final_index_19, compare_0);
   
  var x_50_12028 = $std_core_list.map(final_updates_25, function(update_0_0 /* keyed-update<11012,11010,11011> */ ) {
      return $std_core_hnd._open_none1(function(_this_3 /* keyed-update<11012,11010,11011> */ ) {
          return _this_3.update_row;
        }, update_0_0);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(final_order_23 /* list<keyed-row<11012,11010,11011>> */ ) {
      return _mlift_reconcile_keyed_11510(committed_0_20, drafts_5, enlisted_3, final_index_19, final_updates_25, first_0_0_12, last_0_0_15, move_phase_11, old_order_3, owns_provision_0, parent_0_0_18, participation_14, publication_transaction_17, renderer_0_2, root_0_0_15, scope_0_0_15, staged_retirements_18, stale_9, table_20, final_order_23);
    });
  }
  else {
    return _mlift_reconcile_keyed_11510(committed_0_20, drafts_5, enlisted_3, final_index_19, final_updates_25, first_0_0_12, last_0_0_15, move_phase_11, old_order_3, owns_provision_0, parent_0_0_18, participation_14, publication_transaction_17, renderer_0_2, root_0_0_15, scope_0_0_15, staged_retirements_18, stale_9, table_20, x_50_12028);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11515(children_0_0, committed_0_21, compare_1, drafts_6, enlisted_4, first_0_0_13, item_equals, keyed_items, last_0_0_16, move_phase_12, next_index_1, old_index, old_order_4, owns_provision_1, parent_0_0_19, participation_15, position_2, publication_transaction_18, renderer_0_3, root_0_0_16, scope_0_0_16, staged_retirements_19, table_21, updates_3, wild___3_0_0) /* forall<_e,_e1,a,b,e2> (children@0 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e2>,kokaine/reactive/effects/signal-read> (), committed@0 : ref<global,bool>, compare : (b, b) -> order, drafts : ref<global,list<keyed-row<e2,a,b>>>, enlisted : ref<global,bool>, first@0@0 : node, item-equals : (a, a) -> bool, keyed-items : ref<global,list<(a, b)>>, last@0@0 : node, move-phase : ref<global,bool>, next-index : ref<global,kokaine/internal/key-index/key-index<b,keyed-row<e2,a,b>>>, old-index : kokaine/internal/key-index/key-index<b,keyed-row<e2,a,b>>, old-order : list<keyed-row<e2,a,b>>, owns-provision : bool, parent@0@0 : node, participation : keyed-participation, position : ref<global,int>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e2,a,b>>>, table : ref<global,keyed-table<e2,a,b>>, updates : ref<global,list<keyed-update<e2,a,b>>>, wild_@3@0 : ()) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var xs_10969 = keyed_items.value;
   
  var x_51_12030 = $std_core_list.foreach($std_core_list.reverse_acc($std_core_types.Nil, xs_10969), function(keyed_item /* (11010, 11011) */ ) {
       
      var current_index_2 = position_2.value;
      var _x107 = $std_core_hnd._open_none3($kokaine_internal_key_dash_index.find, old_index, keyed_item.snd, compare_1);
      if (_x107 !== null) {
         
        var value_37_10975 = $std_core_hnd._open_none1(function(_this_0 /* keyed-row<11012,11010,11011> */ ) {
            return _this_0.row_current_item;
          }, _x107.value);
         
        var _x_x1_11_11276 = value_37_10975.value;
         
        var _x_x1_10_11274 = $std_core_hnd._open_none2(item_equals, _x_x1_11_11276, keyed_item.fst);
         
        var item_changed_0 = $std_core_hnd._open_none1(function(b_0 /* bool */ ) {
            return (b_0) ? false : true;
          }, _x_x1_10_11274);
         
        var _x_x1_13_11278 = next_index_1.value;
         
        var _x108 = $std_core_hnd._open_none4($kokaine_internal_key_dash_index.insert, _x_x1_13_11278, keyed_item.snd, _x107.value, compare_1);
        if (_x108._tag === 2) {
          var x_52_12032 = $std_core_hnd._open_at2(0, $std_core_exn.$throw, "duplicate key in keyed For");
        }
        else {
          var x_52_12032 = ((next_index_1).value = (_x108.index));
        }
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_c_x10576_0 /* () */ ) {
            return _mlift_reconcile_keyed_11511(current_index_2, _x107.value, item_changed_0, keyed_item.fst, position_2, updates_3, _c_x10576_0);
          });
        }
        else {
          return _mlift_reconcile_keyed_11511(current_index_2, _x107.value, item_changed_0, keyed_item.fst, position_2, updates_3, x_52_12032);
        }
      }
      else {
         
        var x_53_12034 = create_keyed_row(renderer_0_3, root_0_0_16, parent_0_0_19, last_0_0_16, keyed_item.snd, keyed_item.fst, current_index_2, children_0_0);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(draft_1 /* keyed-row<11012,11010,11011> */ ) {
            return _mlift_reconcile_keyed_11513(compare_1, current_index_2, drafts_6, keyed_item.snd, keyed_item.fst, next_index_1, position_2, updates_3, draft_1);
          });
        }
        else {
          return _mlift_reconcile_keyed_11513(compare_1, current_index_2, drafts_6, keyed_item.snd, keyed_item.fst, next_index_1, position_2, updates_3, x_53_12034);
        }
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___7_0 /* () */ ) {
      return _mlift_reconcile_keyed_11514(committed_0_21, compare_1, drafts_6, enlisted_4, first_0_0_13, last_0_0_16, move_phase_12, next_index_1, old_order_4, owns_provision_1, parent_0_0_19, participation_15, publication_transaction_18, renderer_0_3, root_0_0_16, scope_0_0_16, staged_retirements_19, table_21, updates_3, wild___7_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11514(committed_0_21, compare_1, drafts_6, enlisted_4, first_0_0_13, last_0_0_16, move_phase_12, next_index_1, old_order_4, owns_provision_1, parent_0_0_19, participation_15, publication_transaction_18, renderer_0_3, root_0_0_16, scope_0_0_16, staged_retirements_19, table_21, updates_3, x_51_12030);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11516(children_0_1, committed_0_22, compare_2, drafts_7, enlisted_5, first_0_0_14, item_equals_0, items, key, last_0_0_17, move_phase_13, next_index_2, old_index_0, old_order_5, owns_provision_2, parent_0_0_20, participation_16, position_3, publication_transaction_19, renderer_0_4, root_0_0_17, scope_0_0_17, staged_retirements_20, table_22, updates_4, wild___1_0_0) /* forall<_e,_e1,_e2,a,b,e3> (children@0 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), committed@0 : ref<global,bool>, compare : (b, b) -> order, drafts : ref<global,list<keyed-row<e3,a,b>>>, enlisted : ref<global,bool>, first@0@0 : node, item-equals : (a, a) -> bool, items : list<a>, key : (a) -> b, last@0@0 : node, move-phase : ref<global,bool>, next-index : ref<global,kokaine/internal/key-index/key-index<b,keyed-row<e3,a,b>>>, old-index : kokaine/internal/key-index/key-index<b,keyed-row<e3,a,b>>, old-order : list<keyed-row<e3,a,b>>, owns-provision : bool, parent@0@0 : node, participation : keyed-participation, position : ref<global,int>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e3,a,b>>>, table : ref<global,keyed-table<e3,a,b>>, updates : ref<global,list<keyed-update<e3,a,b>>>, wild_@1@0 : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var seen_identities = { value: ($kokaine_internal_key_dash_index.Key_index_empty) };
   
  var keyed_items_0 = { value: ($std_core_types.Nil) };
   
  var x_54_12036 = $std_core_list.foreach(items, function(item_0_1 /* 11010 */ ) {
       
      var identity_0_1 = $std_core_hnd._open_none1(key, item_0_1);
       
      var _x_x1_7_11265 = seen_identities.value;
      var _x107 = $std_core_hnd._open_none4($kokaine_internal_key_dash_index.insert, _x_x1_7_11265, identity_0_1, identity_0_1, compare_2);
      if (_x107._tag === 2) {
        return $std_core_hnd._open_at2(0, $std_core_exn.$throw, "duplicate key in keyed For");
      }
      else {
         
        ((seen_identities).value = (_x107.index));
         
        var value_33_0_10967 = $std_core_types.Cons($std_core_types.Tuple2(item_0_1, identity_0_1), keyed_items_0.value);
        return ((keyed_items_0).value = value_33_0_10967);
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___3_0_1 /* () */ ) {
      return _mlift_reconcile_keyed_11515(children_0_1, committed_0_22, compare_2, drafts_7, enlisted_5, first_0_0_14, item_equals_0, keyed_items_0, last_0_0_17, move_phase_13, next_index_2, old_index_0, old_order_5, owns_provision_2, parent_0_0_20, participation_16, position_3, publication_transaction_19, renderer_0_4, root_0_0_17, scope_0_0_17, staged_retirements_20, table_22, updates_4, wild___3_0_1);
    });
  }
  else {
    return _mlift_reconcile_keyed_11515(children_0_1, committed_0_22, compare_2, drafts_7, enlisted_5, first_0_0_14, item_equals_0, keyed_items_0, last_0_0_17, move_phase_13, next_index_2, old_index_0, old_order_5, owns_provision_2, parent_0_0_20, participation_16, position_3, publication_transaction_19, renderer_0_4, root_0_0_17, scope_0_0_17, staged_retirements_20, table_22, updates_4, x_54_12036);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11517(children_0_2, committed_0_23, compare_3, drafts_8, enlisted_6, first_0_0_15, item_equals_1, items_0, key_0, last_0_0_18, move_phase_14, next_index_3, old_index_1, old_order_6, owns_provision_3, parent_0_0_21, participation_17, position_4, publication_transaction_20, renderer_0_5, root_0_0_18, scope_0_0_18, staged_retirements_21, table_23, updates_5, old_cursor) /* forall<_e,_e1,_e2,a,b,e3> (children@0 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), committed@0 : ref<global,bool>, compare : (b, b) -> order, drafts : ref<global,list<keyed-row<e3,a,b>>>, enlisted : ref<global,bool>, first@0@0 : node, item-equals : (a, a) -> bool, items : list<a>, key : (a) -> b, last@0@0 : node, move-phase : ref<global,bool>, next-index : ref<global,kokaine/internal/key-index/key-index<b,keyed-row<e3,a,b>>>, old-index : kokaine/internal/key-index/key-index<b,keyed-row<e3,a,b>>, old-order : list<keyed-row<e3,a,b>>, owns-provision : bool, parent@0@0 : node, participation : keyed-participation, position : ref<global,int>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e3,a,b>>>, table : ref<global,keyed-table<e3,a,b>>, updates : ref<global,list<keyed-update<e3,a,b>>>, old-cursor : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_55_12038 = $std_core_hnd._open_at4(0, validate_keyed_order, parent_0_0_21, last_0_0_18, old_cursor, old_order_6);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___1_0_1 /* () */ ) {
      return _mlift_reconcile_keyed_11516(children_0_2, committed_0_23, compare_3, drafts_8, enlisted_6, first_0_0_15, item_equals_1, items_0, key_0, last_0_0_18, move_phase_14, next_index_3, old_index_1, old_order_6, owns_provision_3, parent_0_0_21, participation_17, position_4, publication_transaction_20, renderer_0_5, root_0_0_18, scope_0_0_18, staged_retirements_21, table_23, updates_5, wild___1_0_1);
    });
  }
  else {
    return _mlift_reconcile_keyed_11516(children_0_2, committed_0_23, compare_3, drafts_8, enlisted_6, first_0_0_15, item_equals_1, items_0, key_0, last_0_0_18, move_phase_14, next_index_3, old_index_1, old_order_6, owns_provision_3, parent_0_0_21, participation_17, position_4, publication_transaction_20, renderer_0_5, root_0_0_18, scope_0_0_18, staged_retirements_21, table_23, updates_5, x_55_12038);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11518(children_0_3, compare_4, first_0_0_16, item_equals_2, items_1, key_1, last_0_0_19, old_index_2, old_order_7, parent_0_0_22, renderer_0_6, root_0_0_19, scope_0_0_19, table_24, participation_18) /* forall<_e,_e1,_e2,a,b,e3> (children@0 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), compare : (b, b) -> order, first@0@0 : node, item-equals : (a, a) -> bool, items : list<a>, key : (a) -> b, last@0@0 : node, old-index : kokaine/internal/key-index/key-index<b,keyed-row<e3,a,b>>, old-order : list<keyed-row<e3,a,b>>, parent@0@0 : node, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, table : ref<global,keyed-table<e3,a,b>>, participation : keyed-participation) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var owns_provision_4 = $std_core_hnd._open_none1(function(current_0 /* keyed-participation */ ) {
      return (current_0._tag === 1);
    }, participation_18);
   
  var publication_transaction_21 = $std_core_hnd._open_none1(function(current_0_0 /* keyed-participation */ ) {
      return (current_0_0._tag === 1) ? current_0_0.keyed_journal : current_0_0.keyed_journal;
    }, participation_18);
   
  var next_index_4 = { value: ($kokaine_internal_key_dash_index.Key_index_empty) };
   
  var updates_6 = { value: ($std_core_types.Nil) };
   
  var drafts_9 = { value: ($std_core_types.Nil) };
   
  var position_5 = { value: 0 };
   
  var move_phase_15 = { value: false };
   
  var committed_0_24 = { value: false };
   
  var enlisted_7 = { value: false };
   
  var staged_retirements_22 = { value: ($std_core_types.Nil) };
   
  var x_57_12044 = $std_core_hnd._open_at3(0, function(parent_1_0 /* node */ , first_3_0 /* node */ , last_3 /* node */ ) {
       
      var result_9 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_range_first(parent_1_0, first_3_0, last_3);
        });
      var _x107 = $std_core_hnd._open_none1(dom_attempt_ok, result_9);
      if (_x107) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_9);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_9)));
      }
    }, parent_0_0_22, first_0_0_16, last_0_0_19);
  if ($std_core_hnd._yielding()) {
    var _x109 = $std_core_hnd.yield_extend(function(old_cursor_0 /* node */ ) {
      return _mlift_reconcile_keyed_11517(children_0_3, committed_0_24, compare_4, drafts_9, enlisted_7, first_0_0_16, item_equals_2, items_1, key_1, last_0_0_19, move_phase_15, next_index_4, old_index_2, old_order_7, owns_provision_4, parent_0_0_22, participation_18, position_5, publication_transaction_21, renderer_0_6, root_0_0_19, scope_0_0_19, staged_retirements_22, table_24, updates_6, old_cursor_0);
    });
  }
  else {
    var _x109 = _mlift_reconcile_keyed_11517(children_0_3, committed_0_24, compare_4, drafts_9, enlisted_7, first_0_0_16, item_equals_2, items_1, key_1, last_0_0_19, move_phase_15, next_index_4, old_index_2, old_order_7, owns_provision_4, parent_0_0_22, participation_18, position_5, publication_transaction_21, renderer_0_6, root_0_0_19, scope_0_0_19, staged_retirements_22, table_24, updates_6, x_57_12044);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x107 = committed_0_24.value;
      if (_x107) {
        return $std_core_types.Unit;
      }
      else {
        var _x108 = enlisted_7.value;
        if (_x108) {
          return $std_core_types.Unit;
        }
        else {
           
          var x_56_12042 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10556_0 /* hnd/ev-index */ ) {
              return _mlift_reconcile_keyed_11476(drafts_9, last_0_0_19, move_phase_15, old_order_7, parent_0_0_22, participation_18, staged_retirements_22, _y_x10556_0);
            });
          }
          else {
            return _mlift_reconcile_keyed_11476(drafts_9, last_0_0_19, move_phase_15, old_order_7, parent_0_0_22, participation_18, staged_retirements_22, x_56_12042);
          }
        }
      }
    }, _x109);
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11519(children_0_4, compare_5, first_0_0_17, item_equals_3, items_2, key_2, last_0_0_20, old_index_3, old_order_8, parent_0_0_23, renderer_0_7, root_0_0_20, scope_0_0_20, table_25, _y_x10553) /* forall<_e,_e1,_e2,a,b,e3> (children@0 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), compare : (b, b) -> order, first@0@0 : node, item-equals : (a, a) -> bool, items : list<a>, key : (a) -> b, last@0@0 : node, old-index : kokaine/internal/key-index/key-index<b,keyed-row<e3,a,b>>, old-order : list<keyed-row<e3,a,b>>, parent@0@0 : node, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, table : ref<global,keyed-table<e3,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_58_12047 = $std_core_hnd._mask_at(_y_x10553, false, function() {
      return open_keyed_participation(renderer_0_7, root_0_0_20);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(participation_19 /* keyed-participation */ ) {
      return _mlift_reconcile_keyed_11518(children_0_4, compare_5, first_0_0_17, item_equals_3, items_2, key_2, last_0_0_20, old_index_3, old_order_8, parent_0_0_23, renderer_0_7, root_0_0_20, scope_0_0_20, table_25, participation_19);
    });
  }
  else {
    return _mlift_reconcile_keyed_11518(children_0_4, compare_5, first_0_0_17, item_equals_3, items_2, key_2, last_0_0_20, old_index_3, old_order_8, parent_0_0_23, renderer_0_7, root_0_0_20, scope_0_0_20, table_25, x_58_12047);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11520(children_0_5, compare_6, first_0_0_18, item_equals_4, items_3, key_3, last_0_0_21, parent_0_0_24, renderer_0_8, root_0_0_21, scope_0_0_21, table_26, wild___5) /* forall<_e,_e1,_e2,a,b,e3> (children@0 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), compare : (b, b) -> order, first@0@0 : node, item-equals : (a, a) -> bool, items : list<a>, key : (a) -> b, last@0@0 : node, parent@0@0 : node, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, table : ref<global,keyed-table<e3,a,b>>, wild_@5 : ()) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  var _x110 = table_26.value;
   
  var x_59_12049 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10553_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11519(children_0_5, compare_6, first_0_0_18, item_equals_4, items_3, key_3, last_0_0_21, _x110.table_index, _x110.table_order, parent_0_0_24, renderer_0_8, root_0_0_21, scope_0_0_21, table_26, _y_x10553_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11519(children_0_5, compare_6, first_0_0_18, item_equals_4, items_3, key_3, last_0_0_21, _x110.table_index, _x110.table_order, parent_0_0_24, renderer_0_8, root_0_0_21, scope_0_0_21, table_26, x_59_12049);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11521(children_0_6, compare_7, first_0_0_19, item_equals_5, items_4, key_4, last_0_0_22, parent_0_0_25, renderer_0_9, root_0_0_22, scope_0_0_22, table_27, _y_x10549) /* forall<_e,_e1,_e2,a,b,e3> (children@0 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), compare : (b, b) -> order, first@0@0 : node, item-equals : (a, a) -> bool, items : list<a>, key : (a) -> b, last@0@0 : node, parent@0@0 : node, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, table : ref<global,keyed-table<e3,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_60_12051 = $std_core_hnd._mask_at(_y_x10549, false, function() {
      return drain_keyed_retirements(table_27);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___5_0 /* () */ ) {
      return _mlift_reconcile_keyed_11520(children_0_6, compare_7, first_0_0_19, item_equals_5, items_4, key_4, last_0_0_22, parent_0_0_25, renderer_0_9, root_0_0_22, scope_0_0_22, table_27, wild___5_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11520(children_0_6, compare_7, first_0_0_19, item_equals_5, items_4, key_4, last_0_0_22, parent_0_0_25, renderer_0_9, root_0_0_22, scope_0_0_22, table_27, x_60_12051);
  }
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11522(scope_1_0, _y_x10650) /* (scope@1@0 : kokaine/reactive/integration/lifetime-scope<ui>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10650, false, function() {
      return $kokaine_reactive_integration_internal_lifetime_dash_scope.lifetime_scope_fs_dispose($std_core_hnd._open_none1(function(value_68 /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
          return value_68;
        }, scope_1_0));
    });
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11523(first_1_0_0, last_1_0, _y_x10657) /* (first@1@0 : node, last@1@0 : node, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10657, false, function() {
       
      var result_10 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_clean_range(first_1_0_0, last_1_0, true);
        });
      var _x111 = $std_core_hnd._open_none1(dom_attempt_ok, result_10);
      if (_x111) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_10);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_10)));
      }
    });
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11524(read, _y_x10670) /* forall<a> (read : () -> kokaine/reactive/effects/signal-read a, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-read> a */  {
  return $std_core_hnd._mask_at(_y_x10670, false, read);
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11525(children_1_0, compare_0_0, first_1_0_1, item_equals_0_0, items_0_0, key_0_0, last_1_0_0, parent_1_0_0, renderer_1_0, root_1_0_0, scope_1_0_0, table_0_0, wild___3_1) /* forall<_e,a,b,e1> (children@1 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e1>,kokaine/reactive/effects/signal-read> (), compare@0 : (b, b) -> order, first@1@0 : node, item-equals@0 : (a, a) -> bool, items@0 : ref<global,list<a>>, key@0 : (a) -> b, last@1@0 : node, parent@1@0 : node, renderer@1 : kokaine/dom/internal/keyed-transaction/keyed-context, root@1@0 : kokaine/reactive/root<ui>, scope@1@0 : kokaine/reactive/integration/lifetime-scope<ui>, table@0 : ref<global,keyed-table<e1,a,b>>, wild_@3@1 : ()) -> <div,exn,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var xs_2_11074 = items_0_0.value;
  return reconcile_keyed(renderer_1_0, root_1_0_0, parent_1_0_0, first_1_0_1, last_1_0_0, scope_1_0_0, table_0_0, $std_core_list.reverse_acc($std_core_types.Nil, xs_2_11074), key_0_0, compare_0_0, item_equals_0_0, children_1_0);
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11526(committed_1_0, _y_x10676) /* forall<_e> (committed@1 : ref<global,bool>, kokaine/reactive/disposer<ui>) -> <kokaine/reactive/effects/signal-write,pure> () */  {
   
  ((committed_1_0).value = true);
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11527(_pat_38_0) /* (kokaine/reactive/internal/model/cleanup-registration<ui>) -> exn () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11528(first_1_0_2, last_1_0_1, _y_x10665) /* (first@1@0 : node, last@1@0 : node, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10665, false, function() {
       
      var result_11 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_clean_range(first_1_0_2, last_1_0_1, true);
        });
      var _x112 = $std_core_hnd._open_none1(dom_attempt_ok, result_11);
      if (_x112) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_11);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_11)));
      }
    });
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11529(children_1_1, committed_1_1, compare_0_1, first_1_0_3, item_equals_0_1, key_0_1, last_1_0_2, parent_1_0_1, range_owned_0_0, read_0, renderer_1_1, root_1_0_1, scope_1_0_1, walk, wild___1_1) /* forall<_e,_e1,_e2,a,b,c,e3> (children@1 : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), committed@1 : ref<global,bool>, compare@0 : (c, c) -> order, first@1@0 : node, item-equals@0 : (b, b) -> bool, key@0 : (b) -> c, last@1@0 : node, parent@1@0 : node, range-owned@0 : ref<global,bool>, read : () -> kokaine/reactive/effects/signal-read a, renderer@1 : kokaine/dom/internal/keyed-transaction/keyed-context, root@1@0 : kokaine/reactive/root<ui>, scope@1@0 : kokaine/reactive/integration/lifetime-scope<ui>, walk : forall<e4> (a, (b) -> e4 ()) -> e4 (), wild_@1@1 : ()) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
   
  ((range_owned_0_0).value = true);
   
  var table_0_1 = { value: (Keyed_table($kokaine_internal_key_dash_index.Key_index_empty, $std_core_types.Nil, $std_core_types.Nil)) };
   
  var x_61_12060 = $kokaine_reactive.create_effect(root_1_0_1, function() {
       
      var x_62_12062 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10670_0 /* hnd/ev-index */ ) {
          return _mlift_mount_keyed_fields_11524(read_0, _y_x10670_0);
        });
      }
      else {
        return _mlift_mount_keyed_fields_11524(read_0, x_62_12062);
      }
    }, function(snapshot_0 /* 11029 */ ) {
      return $kokaine_reactive_integration.with_lifetime_scope(root_1_0_1, scope_1_0_1, function() {
           
          var items_0_1 = { value: ($std_core_types.Nil) };
           
          var x_63_12064 = walk(snapshot_0, function(item_1_0 /* 11030 */ ) {
               
              var value_76_11072 = $std_core_types.Cons(item_1_0, items_0_1.value);
              return ((items_0_1).value = value_76_11072);
            });
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(wild___3_1_0 /* () */ ) {
              return _mlift_mount_keyed_fields_11525(children_1_1, compare_0_1, first_1_0_3, item_equals_0_1, items_0_1, key_0_1, last_1_0_2, parent_1_0_1, renderer_1_1, root_1_0_1, scope_1_0_1, table_0_1, wild___3_1_0);
            });
          }
          else {
            return _mlift_mount_keyed_fields_11525(children_1_1, compare_0_1, first_1_0_3, item_equals_0_1, items_0_1, key_0_1, last_1_0_2, parent_1_0_1, renderer_1_1, root_1_0_1, scope_1_0_1, table_0_1, x_63_12064);
          }
        });
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10676_0 /* kokaine/reactive/disposer<ui> */ ) {
      return _mlift_mount_keyed_fields_11526(committed_1_1, _y_x10676_0);
    });
  }
  else {
    return _mlift_mount_keyed_fields_11526(committed_1_1, x_61_12060);
  }
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11530(children_1_2, committed_1_2, compare_0_2, first_1_0_4, installed_0_0, item_equals_0_2, key_0_2, last_1_0_3, parent_1_0_2, range_owned_0_1, read_1, renderer_1_2, root_1_0_2, scope_1_0_2, walk_0, wild___29) /* forall<_e,_e1,_e2,a,b,c,e3> (children@1 : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), committed@1 : ref<global,bool>, compare@0 : (c, c) -> order, first@1@0 : node, installed@0 : ref<global,bool>, item-equals@0 : (b, b) -> bool, key@0 : (b) -> c, last@1@0 : node, parent@1@0 : node, range-owned@0 : ref<global,bool>, read : () -> kokaine/reactive/effects/signal-read a, renderer@1 : kokaine/dom/internal/keyed-transaction/keyed-context, root@1@0 : kokaine/reactive/root<ui>, scope@1@0 : kokaine/reactive/integration/lifetime-scope<ui>, walk : forall<e4> (a, (b) -> e4 ()) -> e4 (), wild_@29 : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  ((installed_0_0).value = true);
   
  var x_64_12066 = $std_core_hnd._open_at2(0, function(root_6_0 /* kokaine/reactive/root<ui> */ , cleanup_0 /* () -> <kokaine/reactive/effects/signal-write,pure,ui> () */ ) {
       
      var root_0_10046_0 = $std_core_hnd._open_none1(function(value_72 /* kokaine/reactive/root<ui> */ ) {
          return value_72;
        }, root_6_0);
       
      var x_65_12068 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046_0, cleanup_0);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_mount_keyed_fields_11527);
      }
      else {
        return _mlift_mount_keyed_fields_11527(x_65_12068);
      }
    }, root_1_0_2, function() {
       
      var x_66_12070 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10665_0 /* hnd/ev-index */ ) {
          return _mlift_mount_keyed_fields_11528(first_1_0_4, last_1_0_3, _y_x10665_0);
        });
      }
      else {
        return _mlift_mount_keyed_fields_11528(first_1_0_4, last_1_0_3, x_66_12070);
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___1_1_0 /* () */ ) {
      return _mlift_mount_keyed_fields_11529(children_1_2, committed_1_2, compare_0_2, first_1_0_4, item_equals_0_2, key_0_2, last_1_0_3, parent_1_0_2, range_owned_0_1, read_1, renderer_1_2, root_1_0_2, scope_1_0_2, walk_0, wild___1_1_0);
    });
  }
  else {
    return _mlift_mount_keyed_fields_11529(children_1_2, committed_1_2, compare_0_2, first_1_0_4, item_equals_0_2, key_0_2, last_1_0_3, parent_1_0_2, range_owned_0_1, read_1, renderer_1_2, root_1_0_2, scope_1_0_2, walk_0, x_64_12066);
  }
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11531(before_0, children_1_3, committed_1_3, compare_0_3, first_1_0_5, installed_0_1, item_equals_0_3, key_0_3, parent_1_0_3, range_owned_0_2, read_2, renderer_1_3, root_1_0_3, scope_1_0_3, walk_1, last_1_0_4) /* forall<_e,_e1,_e2,a,b,c,e3> (before@0 : maybe<node>, children@1 : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), committed@1 : ref<global,bool>, compare@0 : (c, c) -> order, first@1@0 : node, installed@0 : ref<global,bool>, item-equals@0 : (b, b) -> bool, key@0 : (b) -> c, parent@1@0 : node, range-owned@0 : ref<global,bool>, read : () -> kokaine/reactive/effects/signal-read a, renderer@1 : kokaine/dom/internal/keyed-transaction/keyed-context, root@1@0 : kokaine/reactive/root<ui>, scope@1@0 : kokaine/reactive/integration/lifetime-scope<ui>, walk : forall<e4> (a, (b) -> e4 ()) -> e4 (), last@1@0 : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_68_12076 = $std_core_hnd._open_at4(0, insert_marker_pair, parent_1_0_3, before_0, first_1_0_5, last_1_0_4);
  if ($std_core_hnd._yielding()) {
    var _x115 = $std_core_hnd.yield_extend(function(wild___29_0 /* () */ ) {
      return _mlift_mount_keyed_fields_11530(children_1_3, committed_1_3, compare_0_3, first_1_0_5, installed_0_1, item_equals_0_3, key_0_3, last_1_0_4, parent_1_0_3, range_owned_0_2, read_2, renderer_1_3, root_1_0_3, scope_1_0_3, walk_1, wild___29_0);
    });
  }
  else {
    var _x115 = _mlift_mount_keyed_fields_11530(children_1_3, committed_1_3, compare_0_3, first_1_0_5, installed_0_1, item_equals_0_3, key_0_3, last_1_0_4, parent_1_0_3, range_owned_0_2, read_2, renderer_1_3, root_1_0_3, scope_1_0_3, walk_1, x_68_12076);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x113 = installed_0_1.value;
      if (_x113) {
         
        var _x_x1_4_11337 = range_owned_0_2.value;
        var _x114 = $std_core_hnd._open_none1(function(b_5 /* bool */ ) {
            return (b_5) ? false : true;
          }, _x_x1_4_11337);
        if (_x114) {
           
          var x_67_12074 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10657_0 /* hnd/ev-index */ ) {
              return _mlift_mount_keyed_fields_11523(first_1_0_5, last_1_0_4, _y_x10657_0);
            });
          }
          else {
            return _mlift_mount_keyed_fields_11523(first_1_0_5, last_1_0_4, x_67_12074);
          }
        }
        else {
          return $std_core_types.Unit;
        }
      }
      else {
        return $std_core_types.Unit;
      }
    }, _x115);
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11532(before_0_0, children_1_4, committed_1_4, compare_0_4, installed_0_2, item_equals_0_4, key_0_4, parent_1_0_4, range_owned_0_3, read_3, renderer_1_4, root_1_0_4, scope_1_0_4, walk_2, first_1_0_6) /* forall<_e,_e1,_e2,a,b,c,e3> (before@0 : maybe<node>, children@1 : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), committed@1 : ref<global,bool>, compare@0 : (c, c) -> order, installed@0 : ref<global,bool>, item-equals@0 : (b, b) -> bool, key@0 : (b) -> c, parent@1@0 : node, range-owned@0 : ref<global,bool>, read : () -> kokaine/reactive/effects/signal-read a, renderer@1 : kokaine/dom/internal/keyed-transaction/keyed-context, root@1@0 : kokaine/reactive/root<ui>, scope@1@0 : kokaine/reactive/integration/lifetime-scope<ui>, walk : forall<e4> (a, (b) -> e4 ()) -> e4 (), first@1@0 : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_69_12078 = $std_core_hnd._open_at1(0, dom_attempt, function() {
      return dom_create_comment("/kokaine:for");
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(last_1_0_5 /* node */ ) {
      return _mlift_mount_keyed_fields_11531(before_0_0, children_1_4, committed_1_4, compare_0_4, first_1_0_6, installed_0_2, item_equals_0_4, key_0_4, parent_1_0_4, range_owned_0_3, read_3, renderer_1_4, root_1_0_4, scope_1_0_4, walk_2, last_1_0_5);
    });
  }
  else {
    return _mlift_mount_keyed_fields_11531(before_0_0, children_1_4, committed_1_4, compare_0_4, first_1_0_6, installed_0_2, item_equals_0_4, key_0_4, parent_1_0_4, range_owned_0_3, read_3, renderer_1_4, root_1_0_4, scope_1_0_4, walk_2, x_69_12078);
  }
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11533(_y_x10648) /* (kokaine/reactive/integration/internal/lifetime-scope/lifetime-scope<ui>) -> exn kokaine/reactive/integration/lifetime-scope<ui> */  {
  return _y_x10648;
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11534(before_0_1, children_1_5, compare_0_5, item_equals_0_5, key_0_5, parent_1_0_5, read_4, renderer_1_5, root_1_0_5, walk_3, scope_1_0_5) /* forall<_e,_e1,_e2,a,b,c,e3> (before@0 : maybe<node>, children@1 : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), compare@0 : (c, c) -> order, item-equals@0 : (b, b) -> bool, key@0 : (b) -> c, parent@1@0 : node, read : () -> kokaine/reactive/effects/signal-read a, renderer@1 : kokaine/dom/internal/keyed-transaction/keyed-context, root@1@0 : kokaine/reactive/root<ui>, walk : forall<e4> (a, (b) -> e4 ()) -> e4 (), scope@1@0 : kokaine/reactive/integration/lifetime-scope<ui>) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var committed_1_5 = { value: false };
   
  var installed_0_3 = { value: false };
   
  var range_owned_0_4 = { value: false };
  return $std_core_hnd.finally_prompt(function() {
      var _x116 = committed_1_5.value;
      if (_x116) {
        return $std_core_types.Unit;
      }
      else {
         
        var x_70_12082 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10650_0 /* hnd/ev-index */ ) {
            return _mlift_mount_keyed_fields_11522(scope_1_0_5, _y_x10650_0);
          });
        }
        else {
          return _mlift_mount_keyed_fields_11522(scope_1_0_5, x_70_12082);
        }
      }
    }, $kokaine_reactive_integration.with_lifetime_scope(root_1_0_5, scope_1_0_5, function() {
         
        var x_71_12084 = $std_core_hnd._open_at1(0, dom_attempt, function() {
            return dom_create_comment("kokaine:for");
          });
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(first_1_0_7 /* node */ ) {
            return _mlift_mount_keyed_fields_11532(before_0_1, children_1_5, committed_1_5, compare_0_5, installed_0_3, item_equals_0_5, key_0_5, parent_1_0_5, range_owned_0_4, read_4, renderer_1_5, root_1_0_5, scope_1_0_5, walk_3, first_1_0_7);
          });
        }
        else {
          return _mlift_mount_keyed_fields_11532(before_0_1, children_1_5, committed_1_5, compare_0_5, installed_0_3, item_equals_0_5, key_0_5, parent_1_0_5, range_owned_0_4, read_4, renderer_1_5, root_1_0_5, scope_1_0_5, walk_3, x_71_12084);
        }
      }));
}
 
 
// monadic lift
export function _mlift_mount_view_11535(before_1, parent_3_0_0, target_20) /* (before@1 : maybe<node>, parent@3@0 : node, target@20 : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
  return $std_core_hnd._open_at3(0, insert, parent_3_0_0, before_1, target_20);
}
 
 
// monadic lift
export function _mlift_mount_view_11536(read_1_0, _y_x10687) /* (read@1 : () -> kokaine/reactive/effects/signal-read string, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-read> string */  {
  return $std_core_hnd._mask_at(_y_x10687, false, read_1_0);
}
 
 
// monadic lift
export function _mlift_mount_view_11537(target_0_0, value_80, _y_x10690) /* (target@0@0 : node, value@80 : string, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10690, false, function() {
       
      var result_12 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_set_text(target_0_0, value_80);
        });
      var _x117 = $std_core_hnd._open_none1(dom_attempt_ok, result_12);
      if (_x117) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_12);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_12)));
      }
    });
}
 
 
// monadic lift
export function _mlift_mount_view_11538(_y_x10694) /* (kokaine/reactive/disposer<ui>) -> <kokaine/reactive/effects/signal-write,pure> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_view_11539(read_1_1, root_3_0, target_0_0_0, wild___30) /* (read@1 : () -> kokaine/reactive/effects/signal-read string, root@3@0 : kokaine/reactive/root<ui>, target@0@0 : node, wild_@30 : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_72_12089 = $kokaine_reactive.create_effect(root_3_0, function() {
       
      var x_73_12091 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10687_0 /* hnd/ev-index */ ) {
          return _mlift_mount_view_11536(read_1_1, _y_x10687_0);
        });
      }
      else {
        return _mlift_mount_view_11536(read_1_1, x_73_12091);
      }
    }, function(value_80_0 /* string */ ) {
       
      var x_74_12093 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10690_0 /* hnd/ev-index */ ) {
          return _mlift_mount_view_11537(target_0_0_0, value_80_0, _y_x10690_0);
        });
      }
      else {
        return _mlift_mount_view_11537(target_0_0_0, value_80_0, x_74_12093);
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_mount_view_11538);
  }
  else {
    return _mlift_mount_view_11538(x_72_12089);
  }
}
 
 
// monadic lift
export function _mlift_mount_view_11540(before_1_0, parent_3_0_1, read_1_2, root_3_0_0, target_0_0_1) /* (before@1 : maybe<node>, parent@3@0 : node, read@1 : () -> kokaine/reactive/effects/signal-read string, root@3@0 : kokaine/reactive/root<ui>, target@0@0 : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_75_12095 = $std_core_hnd._open_at3(0, insert, parent_3_0_1, before_1_0, target_0_0_1);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___30_0 /* () */ ) {
      return _mlift_mount_view_11539(read_1_2, root_3_0_0, target_0_0_1, wild___30_0);
    });
  }
  else {
    return _mlift_mount_view_11539(read_1_2, root_3_0_0, target_0_0_1, x_75_12095);
  }
}
 
 
// monadic lift
export function _mlift_mount_view_11541(before_1_1, parent_3_0_2, target_1_0, wild___2_2) /* (before@1 : maybe<node>, parent@3@0 : node, target@1@0 : element, wild_@2@2 : ()) -> <div,exn,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var _x_x3_1_11362 = $std_core_hnd._open_none1(element_node, target_1_0);
  return $std_core_hnd._open_at3(0, function(parent_8 /* node */ , before_2 /* maybe<node> */ , child_0 /* node */ ) {
      if (before_2 === null) {
         
        var result_13 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_append(parent_8, child_0);
          });
        var _x118 = $std_core_hnd._open_none1(dom_attempt_ok, result_13);
        if (_x118) {
          return $std_core_hnd._open_none1(dom_attempt_value, result_13);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_13)));
        }
      }
      else {
         
        var result_14 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_insert_before(parent_8, child_0, before_2.value);
          });
        var _x119 = $std_core_hnd._open_none1(dom_attempt_ok, result_14);
        if (_x119) {
          return $std_core_hnd._open_none1(dom_attempt_value, result_14);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_14)));
        }
      }
    }, parent_3_0_2, before_1_1, _x_x3_1_11362);
}
 
 
// monadic lift
export function _mlift_mount_view_11542(before_1_2, children_3_0, parent_3_0_3, renderer_3_0, root_3_0_1, target_1_0_0, wild___1_2) /* forall<e> (before@1 : maybe<node>, children@3 : list<kokaine/html/view<e>>, parent@3@0 : node, renderer@3 : kokaine/dom/internal/keyed-transaction/keyed-context, root@3@0 : kokaine/reactive/root<ui>, target@1@0 : element, wild_@1@2 : ()) -> <div,exn,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var x_76_12099 = $std_core_list.foreach(children_3_0, function(child /* kokaine/html/view<11058> */ ) {
      return mount_view(renderer_3_0, root_3_0_1, $std_core_hnd._open_none1(element_node, target_1_0_0), $std_core_types.Nothing, child);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___2_2_0 /* () */ ) {
      return _mlift_mount_view_11541(before_1_2, parent_3_0_3, target_1_0_0, wild___2_2_0);
    });
  }
  else {
    return _mlift_mount_view_11541(before_1_2, parent_3_0_3, target_1_0_0, x_76_12099);
  }
}
 
 
// monadic lift
export function _mlift_mount_view_11543(attributes, before_1_3, children_3_1, parent_3_0_4, renderer_3_1, root_3_0_2, target_1_0_1, wild___0_2) /* forall<e> (attributes : list<kokaine/html/attribute<e>>, before@1 : maybe<node>, children@3 : list<kokaine/html/view<e>>, parent@3@0 : node, renderer@3 : kokaine/dom/internal/keyed-transaction/keyed-context, root@3@0 : kokaine/reactive/root<ui>, target@1@0 : element, wild_@0@2 : ()) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var x_77_12101 = $std_core_list.foreach(attributes, function(attribute /* kokaine/html/attribute<11058> */ ) {
      return mount_attribute(root_3_0_2, target_1_0_1, attribute);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___1_2_0 /* () */ ) {
      return _mlift_mount_view_11542(before_1_3, children_3_1, parent_3_0_4, renderer_3_1, root_3_0_2, target_1_0_1, wild___1_2_0);
    });
  }
  else {
    return _mlift_mount_view_11542(before_1_3, children_3_1, parent_3_0_4, renderer_3_1, root_3_0_2, target_1_0_1, x_77_12101);
  }
}
 
 
// monadic lift
export function _mlift_mount_view_11544(attributes_0, before_1_4, children_3_2, parent_3_0_5, renderer_3_2, root_3_0_3, target_1_0_2) /* forall<e> (attributes : list<kokaine/html/attribute<e>>, before@1 : maybe<node>, children@3 : list<kokaine/html/view<e>>, parent@3@0 : node, renderer@3 : kokaine/dom/internal/keyed-transaction/keyed-context, root@3@0 : kokaine/reactive/root<ui>, target@1@0 : element) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_78_12103 = record_owner(root_3_0_3, $std_core_hnd._open_none1(element_node, target_1_0_2));
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0_2_0 /* () */ ) {
      return _mlift_mount_view_11543(attributes_0, before_1_4, children_3_2, parent_3_0_5, renderer_3_2, root_3_0_3, target_1_0_2, wild___0_2_0);
    });
  }
  else {
    return _mlift_mount_view_11543(attributes_0, before_1_4, children_3_2, parent_3_0_5, renderer_3_2, root_3_0_3, target_1_0_2, x_78_12103);
  }
}
 
 
// monadic lift
export function _mlift_mount_view_11545(read_0_0_0, _y_x10712) /* forall<e> (read@0@0@0 : () -> kokaine/reactive/effects/signal-read kokaine/html/view<e>, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-read> kokaine/html/view<e> */  {
  return $std_core_hnd._mask_at(_y_x10712, false, read_0_0_0);
}
 
 
// monadic lift
export function _mlift_mount_view_11546(_pat_41_0) /* (kokaine/reactive/internal/model/cleanup-registration<ui>) -> exn () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_view_11547(first_2_0, last_2_0, _y_x10716) /* (first@2@0 : node, last@2@0 : node, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10716, false, function() {
       
      var result_15 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_clean_range(first_2_0, last_2_0, false);
        });
      var _x120 = $std_core_hnd._open_none1(dom_attempt_ok, result_15);
      if (_x120) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_15);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_15)));
      }
    });
}
 
 
// monadic lift
export function _mlift_mount_view_11548(last_2_0_0, next_1_0, parent_3_0_6, renderer_3_3, root_3_0_4, wild___4_2) /* forall<e> (last@2@0 : node, next@1 : kokaine/html/view<e>, parent@3@0 : node, renderer@3 : kokaine/dom/internal/keyed-transaction/keyed-context, root@3@0 : kokaine/reactive/root<ui>, wild_@4@2 : ()) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
  return mount_view(renderer_3_3, root_3_0_4, parent_3_0_6, $std_core_types.Just(last_2_0_0), next_1_0);
}
 
 
// monadic lift
export function _mlift_mount_view_11549(_y_x10722) /* (kokaine/reactive/disposer<ui>) -> <kokaine/reactive/effects/signal-write,pure> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_view_11550(first_2_0_0, last_2_0_1, parent_3_0_7, read_0_0_0_0, renderer_3_4, root_3_0_5, wild___3_2) /* forall<e> (first@2@0 : node, last@2@0 : node, parent@3@0 : node, read@0@0@0 : () -> kokaine/reactive/effects/signal-read kokaine/html/view<e>, renderer@3 : kokaine/dom/internal/keyed-transaction/keyed-context, root@3@0 : kokaine/reactive/root<ui>, wild_@3@2 : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_79_12108 = $kokaine_reactive.create_effect(root_3_0_5, function() {
       
      var x_80_12110 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10712_0 /* hnd/ev-index */ ) {
          return _mlift_mount_view_11545(read_0_0_0_0, _y_x10712_0);
        });
      }
      else {
        return _mlift_mount_view_11545(read_0_0_0_0, x_80_12110);
      }
    }, function(next_1_1 /* kokaine/html/view<11058> */ ) {
       
      var x_81_12112 = $std_core_hnd._open_at2(0, function(root_7_0 /* kokaine/reactive/root<ui> */ , cleanup_1 /* () -> <kokaine/reactive/effects/signal-write,pure,ui> () */ ) {
           
          var root_0_10046_1 = $std_core_hnd._open_none1(function(value_81 /* kokaine/reactive/root<ui> */ ) {
              return value_81;
            }, root_7_0);
           
          var x_82_12114 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046_1, cleanup_1);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(_mlift_mount_view_11546);
          }
          else {
            return _mlift_mount_view_11546(x_82_12114);
          }
        }, root_3_0_5, function() {
           
          var x_83_12116 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10716_0 /* hnd/ev-index */ ) {
              return _mlift_mount_view_11547(first_2_0_0, last_2_0_1, _y_x10716_0);
            });
          }
          else {
            return _mlift_mount_view_11547(first_2_0_0, last_2_0_1, x_83_12116);
          }
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild___4_2_0 /* () */ ) {
          return _mlift_mount_view_11548(last_2_0_1, next_1_1, parent_3_0_7, renderer_3_4, root_3_0_5, wild___4_2_0);
        });
      }
      else {
        return _mlift_mount_view_11548(last_2_0_1, next_1_1, parent_3_0_7, renderer_3_4, root_3_0_5, x_81_12112);
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_mount_view_11549);
  }
  else {
    return _mlift_mount_view_11549(x_79_12108);
  }
}
 
 
// monadic lift
export function _mlift_mount_view_11551(before_1_5, first_2_0_1, parent_3_0_8, read_0_0_0_1, renderer_3_5, root_3_0_6, last_2_0_2) /* forall<e> (before@1 : maybe<node>, first@2@0 : node, parent@3@0 : node, read@0@0@0 : () -> kokaine/reactive/effects/signal-read kokaine/html/view<e>, renderer@3 : kokaine/dom/internal/keyed-transaction/keyed-context, root@3@0 : kokaine/reactive/root<ui>, last@2@0 : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_84_12118 = $std_core_hnd._open_at4(0, insert_marker_pair, parent_3_0_8, before_1_5, first_2_0_1, last_2_0_2);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___3_2_0 /* () */ ) {
      return _mlift_mount_view_11550(first_2_0_1, last_2_0_2, parent_3_0_8, read_0_0_0_1, renderer_3_5, root_3_0_6, wild___3_2_0);
    });
  }
  else {
    return _mlift_mount_view_11550(first_2_0_1, last_2_0_2, parent_3_0_8, read_0_0_0_1, renderer_3_5, root_3_0_6, x_84_12118);
  }
}
 
 
// monadic lift
export function _mlift_mount_view_11552(before_1_6, parent_3_0_9, read_0_0_0_2, renderer_3_6, root_3_0_7, first_2_0_2) /* forall<e> (before@1 : maybe<node>, parent@3@0 : node, read@0@0@0 : () -> kokaine/reactive/effects/signal-read kokaine/html/view<e>, renderer@3 : kokaine/dom/internal/keyed-transaction/keyed-context, root@3@0 : kokaine/reactive/root<ui>, first@2@0 : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_85_12120 = $std_core_hnd._open_at1(0, dom_attempt, function() {
      return dom_create_comment("/kokaine:region");
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(last_2_0_3 /* node */ ) {
      return _mlift_mount_view_11551(before_1_6, first_2_0_2, parent_3_0_9, read_0_0_0_2, renderer_3_6, root_3_0_7, last_2_0_3);
    });
  }
  else {
    return _mlift_mount_view_11551(before_1_6, first_2_0_2, parent_3_0_9, read_0_0_0_2, renderer_3_6, root_3_0_7, x_85_12120);
  }
}
 
export function create_keyed_row(renderer_9, root_9, parent_9, last_7, identity_9, item_9, index_9, children_7) /* forall<a,b,e> (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, parent : node, last : node, identity : a, item : b, index : int, children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> ()) -> <pure,kokaine/reactive/effects/signal-write,ui> keyed-row<e,b,a> */  {
   
  var x_86_12122 = $std_core_hnd._open_at1(0, function(root_0_1 /* kokaine/reactive/root<ui> */ ) {
       
      var x_87_12125 = $kokaine_reactive_integration_internal_lifetime_dash_scope.open_lifetime_scope($std_core_hnd._open_none1(function(value_0 /* kokaine/reactive/root<ui> */ ) {
          return value_0;
        }, root_0_1));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_create_keyed_row_11473);
      }
      else {
        return _mlift_create_keyed_row_11473(x_87_12125);
      }
    }, root_9);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(scope_10 /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
      return _mlift_create_keyed_row_11474(children_7, identity_9, index_9, item_9, last_7, parent_9, renderer_9, root_9, scope_10);
    });
  }
  else {
     
    var committed_9 = { value: false };
     
    var installed_3 = { value: false };
     
    var range_owned_4 = { value: false };
    return $std_core_hnd.finally_prompt(function() {
        var _x121 = committed_9.value;
        if (_x121) {
          return $std_core_types.Unit;
        }
        else {
           
          var x_88_12129 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10509_1 /* hnd/ev-index */ ) {
              return _mlift_create_keyed_row_11457(x_86_12122, _y_x10509_1);
            });
          }
          else {
            return _mlift_create_keyed_row_11457(x_86_12122, x_88_12129);
          }
        }
      }, $kokaine_reactive_integration.with_lifetime_scope(root_9, x_86_12122, function() {
           
          var x_89_12131 = $std_core_hnd._open_at1(0, dom_attempt, function() {
              return dom_create_comment("kokaine:for-row");
            });
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(first_11 /* node */ ) {
              return _mlift_create_keyed_row_11472(children_7, committed_9, identity_9, index_9, installed_3, item_9, last_7, parent_9, range_owned_4, renderer_9, root_9, x_86_12122, first_11);
            });
          }
          else {
            return _mlift_create_keyed_row_11472(children_7, committed_9, identity_9, index_9, installed_3, item_9, last_7, parent_9, range_owned_4, renderer_9, root_9, x_86_12122, x_89_12131);
          }
        }));
  }
}
 
export function reconcile_keyed(renderer_0_10, root_0_0_23, parent_0_0_26, first_0_0_20, last_0_0_23, scope_0_0_23, table_28, items_5, key_5, compare_8, item_equals_6, children_0_7) /* forall<a,b,e> (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, parent : node, first : node, last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, table : ref<global,keyed-table<e,a,b>>, items : list<a>, key : (a) -> b, compare : (b, b) -> order, item-equals : (a, a) -> bool, children : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> ()) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var x_90_12133 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10549_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11521(children_0_7, compare_8, first_0_0_20, item_equals_6, items_5, key_5, last_0_0_23, parent_0_0_26, renderer_0_10, root_0_0_23, scope_0_0_23, table_28, _y_x10549_0);
    });
  }
  else {
     
    var x_91_12136 = $std_core_hnd._mask_at(x_90_12133, false, function() {
        return drain_keyed_retirements(table_28);
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___5_1 /* () */ ) {
        return _mlift_reconcile_keyed_11520(children_0_7, compare_8, first_0_0_20, item_equals_6, items_5, key_5, last_0_0_23, parent_0_0_26, renderer_0_10, root_0_0_23, scope_0_0_23, table_28, wild___5_1);
      });
    }
    else {
      var _x122 = table_28.value;
       
      var x_92_12140 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10553_1 /* hnd/ev-index */ ) {
          return _mlift_reconcile_keyed_11519(children_0_7, compare_8, first_0_0_20, item_equals_6, items_5, key_5, last_0_0_23, _x122.table_index, _x122.table_order, parent_0_0_26, renderer_0_10, root_0_0_23, scope_0_0_23, table_28, _y_x10553_1);
        });
      }
      else {
         
        var x_93_12143 = $std_core_hnd._mask_at(x_92_12140, false, function() {
            return open_keyed_participation(renderer_0_10, root_0_0_23);
          });
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(participation_20 /* keyed-participation */ ) {
            return _mlift_reconcile_keyed_11518(children_0_7, compare_8, first_0_0_20, item_equals_6, items_5, key_5, last_0_0_23, _x122.table_index, _x122.table_order, parent_0_0_26, renderer_0_10, root_0_0_23, scope_0_0_23, table_28, participation_20);
          });
        }
        else {
           
          var owns_provision_5 = $std_core_hnd._open_none1(function(current_1 /* keyed-participation */ ) {
              return (current_1._tag === 1);
            }, x_93_12143);
           
          var publication_transaction_22 = $std_core_hnd._open_none1(function(current_0_1 /* keyed-participation */ ) {
              return (current_0_1._tag === 1) ? current_0_1.keyed_journal : current_0_1.keyed_journal;
            }, x_93_12143);
           
          var next_index_5 = { value: ($kokaine_internal_key_dash_index.Key_index_empty) };
           
          var updates_7 = { value: ($std_core_types.Nil) };
           
          var drafts_10 = { value: ($std_core_types.Nil) };
           
          var position_6 = { value: 0 };
           
          var move_phase_16 = { value: false };
           
          var committed_0_25 = { value: false };
           
          var enlisted_8 = { value: false };
           
          var staged_retirements_23 = { value: ($std_core_types.Nil) };
           
          var x_95_12150 = $std_core_hnd._open_at3(0, function(parent_1_1 /* node */ , first_3_1 /* node */ , last_3_0 /* node */ ) {
               
              var result_16 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
                  return dom_range_first(parent_1_1, first_3_1, last_3_0);
                });
              var _x123 = $std_core_hnd._open_none1(dom_attempt_ok, result_16);
              if (_x123) {
                return $std_core_hnd._open_none1(dom_attempt_value, result_16);
              }
              else {
                return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_16)));
              }
            }, parent_0_0_26, first_0_0_20, last_0_0_23);
          if ($std_core_hnd._yielding()) {
            var _x125 = $std_core_hnd.yield_extend(function(old_cursor_1 /* node */ ) {
              return _mlift_reconcile_keyed_11517(children_0_7, committed_0_25, compare_8, drafts_10, enlisted_8, first_0_0_20, item_equals_6, items_5, key_5, last_0_0_23, move_phase_16, next_index_5, _x122.table_index, _x122.table_order, owns_provision_5, parent_0_0_26, x_93_12143, position_6, publication_transaction_22, renderer_0_10, root_0_0_23, scope_0_0_23, staged_retirements_23, table_28, updates_7, old_cursor_1);
            });
          }
          else {
            var _x125 = _mlift_reconcile_keyed_11517(children_0_7, committed_0_25, compare_8, drafts_10, enlisted_8, first_0_0_20, item_equals_6, items_5, key_5, last_0_0_23, move_phase_16, next_index_5, _x122.table_index, _x122.table_order, owns_provision_5, parent_0_0_26, x_93_12143, position_6, publication_transaction_22, renderer_0_10, root_0_0_23, scope_0_0_23, staged_retirements_23, table_28, updates_7, x_95_12150);
          }
          return $std_core_hnd.finally_prompt(function() {
              var _x123 = committed_0_25.value;
              if (_x123) {
                return $std_core_types.Unit;
              }
              else {
                var _x124 = enlisted_8.value;
                if (_x124) {
                  return $std_core_types.Unit;
                }
                else {
                   
                  var x_94_12148 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
                  if ($std_core_hnd._yielding()) {
                    return $std_core_hnd.yield_extend(function(_y_x10556_1 /* hnd/ev-index */ ) {
                      return _mlift_reconcile_keyed_11476(drafts_10, last_0_0_23, move_phase_16, _x122.table_order, parent_0_0_26, x_93_12143, staged_retirements_23, _y_x10556_1);
                    });
                  }
                  else {
                    return _mlift_reconcile_keyed_11476(drafts_10, last_0_0_23, move_phase_16, _x122.table_order, parent_0_0_26, x_93_12143, staged_retirements_23, x_94_12148);
                  }
                }
              }
            }, _x125);
        }
      }
    }
  }
}
 
export function mount_keyed_fields(renderer_1_6, root_1_0_6, parent_1_0_6, before_0_2, read_5, walk_4, key_0_6, compare_0_6, item_equals_0_6, children_1_6) /* forall<a,b,c,e> (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, parent : node, before : maybe<node>, read : () -> kokaine/reactive/effects/signal-read a, walk : forall<e1> (a, (b) -> e1 ()) -> e1 (), key : (b) -> c, compare : (c, c) -> order, item-equals : (b, b) -> bool, children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> ()) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var x_96_12153 = $std_core_hnd._open_at1(0, function(root_5_0 /* kokaine/reactive/root<ui> */ ) {
       
      var x_97_12156 = $kokaine_reactive_integration_internal_lifetime_dash_scope.open_lifetime_scope($std_core_hnd._open_none1(function(value_63 /* kokaine/reactive/root<ui> */ ) {
          return value_63;
        }, root_5_0));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_mount_keyed_fields_11533);
      }
      else {
        return _mlift_mount_keyed_fields_11533(x_97_12156);
      }
    }, root_1_0_6);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(scope_1_0_6 /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
      return _mlift_mount_keyed_fields_11534(before_0_2, children_1_6, compare_0_6, item_equals_0_6, key_0_6, parent_1_0_6, read_5, renderer_1_6, root_1_0_6, walk_4, scope_1_0_6);
    });
  }
  else {
     
    var committed_1_6 = { value: false };
     
    var installed_0_4 = { value: false };
     
    var range_owned_0_5 = { value: false };
    return $std_core_hnd.finally_prompt(function() {
        var _x126 = committed_1_6.value;
        if (_x126) {
          return $std_core_types.Unit;
        }
        else {
           
          var x_98_12160 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10650_1 /* hnd/ev-index */ ) {
              return _mlift_mount_keyed_fields_11522(x_96_12153, _y_x10650_1);
            });
          }
          else {
            return _mlift_mount_keyed_fields_11522(x_96_12153, x_98_12160);
          }
        }
      }, $kokaine_reactive_integration.with_lifetime_scope(root_1_0_6, x_96_12153, function() {
           
          var x_99_12162 = $std_core_hnd._open_at1(0, dom_attempt, function() {
              return dom_create_comment("kokaine:for");
            });
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(first_1_0_8 /* node */ ) {
              return _mlift_mount_keyed_fields_11532(before_0_2, children_1_6, committed_1_6, compare_0_6, installed_0_4, item_equals_0_6, key_0_6, parent_1_0_6, range_owned_0_5, read_5, renderer_1_6, root_1_0_6, x_96_12153, walk_4, first_1_0_8);
            });
          }
          else {
            return _mlift_mount_keyed_fields_11532(before_0_2, children_1_6, committed_1_6, compare_0_6, installed_0_4, item_equals_0_6, key_0_6, parent_1_0_6, range_owned_0_5, read_5, renderer_1_6, root_1_0_6, x_96_12153, walk_4, x_99_12162);
          }
        }));
  }
}
 
export function mount_keyed_plan(renderer_2_0, root_2_0_0, parent_2_0_0, before_0_0_0, plan) /* forall<e> (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, parent : node, before : maybe<node>, plan : kokaine/html/keyed-plan<e>) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
  return mount_keyed_fields(renderer_2_0, root_2_0_0, parent_2_0_0, before_0_0_0, plan.plan_spec.keyed_read, plan.plan_spec.keyed_walk, plan.plan_spec.keyed_key, plan.plan_spec.keyed_compare, plan.plan_spec.keyed_item_equals, plan.plan_spec.keyed_children);
}
 
export function mount_view(renderer_3_7, root_3_0_8, parent_3_0_10, before_1_7, tree_0_0) /* forall<e> (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, parent : node, before : maybe<node>, tree : kokaine/html/view<e>) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
  if (tree_0_0._tag === 1) {
    return $std_core_types.Unit;
  }
  else if (tree_0_0._tag === 2) {
     
    var x_100_12164 = $std_core_hnd._open_at1(0, dom_attempt, function() {
        return dom_create_text(tree_0_0.content);
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(target_20_0 /* node */ ) {
        return _mlift_mount_view_11535(before_1_7, parent_3_0_10, target_20_0);
      });
    }
    else {
      return $std_core_hnd._open_at3(0, insert, parent_3_0_10, before_1_7, x_100_12164);
    }
  }
  else if (tree_0_0._tag === 3) {
     
    var x_101_12167 = $std_core_hnd._open_at1(0, dom_attempt, function() {
        return dom_create_text("");
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(target_0_0_2 /* node */ ) {
        return _mlift_mount_view_11540(before_1_7, parent_3_0_10, tree_0_0.read, root_3_0_8, target_0_0_2);
      });
    }
    else {
       
      var x_102_12170 = $std_core_hnd._open_at3(0, insert, parent_3_0_10, before_1_7, x_101_12167);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild___30_1 /* () */ ) {
          return _mlift_mount_view_11539(tree_0_0.read, root_3_0_8, x_101_12167, wild___30_1);
        });
      }
      else {
         
        var x_103_12173 = $kokaine_reactive.create_effect(root_3_0_8, function() {
             
            var x_104_12176 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_y_x10687_1 /* hnd/ev-index */ ) {
                return _mlift_mount_view_11536(tree_0_0.read, _y_x10687_1);
              });
            }
            else {
              return _mlift_mount_view_11536(tree_0_0.read, x_104_12176);
            }
          }, function(value_80_1 /* string */ ) {
             
            var x_105_12178 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_y_x10690_1 /* hnd/ev-index */ ) {
                return _mlift_mount_view_11537(x_101_12167, value_80_1, _y_x10690_1);
              });
            }
            else {
              return _mlift_mount_view_11537(x_101_12167, value_80_1, x_105_12178);
            }
          });
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(_mlift_mount_view_11538);
        }
        else {
          return $std_core_types.Unit;
        }
      }
    }
  }
  else if (tree_0_0._tag === 4) {
     
    var _x_x1_3_11353 = $std_core_hnd._open_none1($kokaine_html.is_valid_element_name, tree_0_0.name);
    var _x127 = $std_core_hnd._open_none1(function(b_6 /* bool */ ) {
        return (b_6) ? false : true;
      }, _x_x1_3_11353);
    if (_x127) {
       
      var _x_x1_5_11355 = $std_core_types._lp__plus__plus__rp_("invalid HTML element name: ", tree_0_0.name);
      return $std_core_hnd._open_at2(0, $std_core_exn.$throw, _x_x1_5_11355);
    }
    else {
       
      var x_106_12180 = $std_core_hnd._open_at1(0, dom_attempt, function() {
          return dom_create_element(parent_3_0_10, tree_0_0.name);
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(target_1_0_3 /* element */ ) {
          return _mlift_mount_view_11544(tree_0_0.attributes, before_1_7, tree_0_0.children, parent_3_0_10, renderer_3_7, root_3_0_8, target_1_0_3);
        });
      }
      else {
         
        var x_107_12183 = record_owner(root_3_0_8, $std_core_hnd._open_none1(element_node, x_106_12180));
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(wild___0_2_1 /* () */ ) {
            return _mlift_mount_view_11543(tree_0_0.attributes, before_1_7, tree_0_0.children, parent_3_0_10, renderer_3_7, root_3_0_8, x_106_12180, wild___0_2_1);
          });
        }
        else {
           
          var x_108_12186 = $std_core_list.foreach(tree_0_0.attributes, function(attribute_0 /* kokaine/html/attribute<11058> */ ) {
              return mount_attribute(root_3_0_8, x_106_12180, attribute_0);
            });
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(wild___1_2_1 /* () */ ) {
              return _mlift_mount_view_11542(before_1_7, tree_0_0.children, parent_3_0_10, renderer_3_7, root_3_0_8, x_106_12180, wild___1_2_1);
            });
          }
          else {
             
            var x_109_12189 = $std_core_list.foreach(tree_0_0.children, function(child_1 /* kokaine/html/view<11058> */ ) {
                return mount_view(renderer_3_7, root_3_0_8, $std_core_hnd._open_none1(element_node, x_106_12180), $std_core_types.Nothing, child_1);
              });
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(wild___2_2_1 /* () */ ) {
                return _mlift_mount_view_11541(before_1_7, parent_3_0_10, x_106_12180, wild___2_2_1);
              });
            }
            else {
               
              var _x_x3_1_11362_0 = $std_core_hnd._open_none1(element_node, x_106_12180);
              return $std_core_hnd._open_at3(0, function(parent_8_0 /* node */ , before_2_0 /* maybe<node> */ , child_0_0 /* node */ ) {
                  if (before_2_0 === null) {
                     
                    var result_17 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
                        return dom_append(parent_8_0, child_0_0);
                      });
                    var _x128 = $std_core_hnd._open_none1(dom_attempt_ok, result_17);
                    if (_x128) {
                      return $std_core_hnd._open_none1(dom_attempt_value, result_17);
                    }
                    else {
                      return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_17)));
                    }
                  }
                  else {
                     
                    var result_18 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
                        return dom_insert_before(parent_8_0, child_0_0, before_2_0.value);
                      });
                    var _x129 = $std_core_hnd._open_none1(dom_attempt_ok, result_18);
                    if (_x129) {
                      return $std_core_hnd._open_none1(dom_attempt_value, result_18);
                    }
                    else {
                      return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_18)));
                    }
                  }
                }, parent_3_0_10, before_1_7, _x_x3_1_11362_0);
            }
          }
        }
      }
    }
  }
  else if (tree_0_0._tag === 5) {
    return $std_core_list.foreach(tree_0_0.children, function(child_0_0_0 /* kokaine/html/view<11058> */ ) {
        return mount_view(renderer_3_7, root_3_0_8, parent_3_0_10, before_1_7, child_0_0_0);
      });
  }
  else if (tree_0_0._tag === 6) {
     
    var x_110_12194 = $std_core_hnd._open_at1(0, dom_attempt, function() {
        return dom_create_comment("kokaine:region");
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(first_2_0_3 /* node */ ) {
        return _mlift_mount_view_11552(before_1_7, parent_3_0_10, tree_0_0.read, renderer_3_7, root_3_0_8, first_2_0_3);
      });
    }
    else {
       
      var x_111_12197 = $std_core_hnd._open_at1(0, dom_attempt, function() {
          return dom_create_comment("/kokaine:region");
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(last_2_0_4 /* node */ ) {
          return _mlift_mount_view_11551(before_1_7, x_110_12194, parent_3_0_10, tree_0_0.read, renderer_3_7, root_3_0_8, last_2_0_4);
        });
      }
      else {
         
        var x_112_12200 = $std_core_hnd._open_at4(0, insert_marker_pair, parent_3_0_10, before_1_7, x_110_12194, x_111_12197);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(wild___3_2_1 /* () */ ) {
            return _mlift_mount_view_11550(x_110_12194, x_111_12197, parent_3_0_10, tree_0_0.read, renderer_3_7, root_3_0_8, wild___3_2_1);
          });
        }
        else {
           
          var x_113_12203 = $kokaine_reactive.create_effect(root_3_0_8, function() {
               
              var x_114_12206 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
              if ($std_core_hnd._yielding()) {
                return $std_core_hnd.yield_extend(function(_y_x10712_1 /* hnd/ev-index */ ) {
                  return _mlift_mount_view_11545(tree_0_0.read, _y_x10712_1);
                });
              }
              else {
                return _mlift_mount_view_11545(tree_0_0.read, x_114_12206);
              }
            }, function(next_1_2 /* kokaine/html/view<11058> */ ) {
               
              var x_115_12208 = $std_core_hnd._open_at2(0, function(root_7_1 /* kokaine/reactive/root<ui> */ , cleanup_1_0 /* () -> <kokaine/reactive/effects/signal-write,pure,ui> () */ ) {
                   
                  var root_0_10046_1_0 = $std_core_hnd._open_none1(function(value_81_0 /* kokaine/reactive/root<ui> */ ) {
                      return value_81_0;
                    }, root_7_1);
                   
                  var x_116_12210 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046_1_0, cleanup_1_0);
                  if ($std_core_hnd._yielding()) {
                    return $std_core_hnd.yield_extend(_mlift_mount_view_11546);
                  }
                  else {
                    return _mlift_mount_view_11546(x_116_12210);
                  }
                }, root_3_0_8, function() {
                   
                  var x_117_12212 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
                  if ($std_core_hnd._yielding()) {
                    return $std_core_hnd.yield_extend(function(_y_x10716_1 /* hnd/ev-index */ ) {
                      return _mlift_mount_view_11547(x_110_12194, x_111_12197, _y_x10716_1);
                    });
                  }
                  else {
                    return _mlift_mount_view_11547(x_110_12194, x_111_12197, x_117_12212);
                  }
                });
              if ($std_core_hnd._yielding()) {
                return $std_core_hnd.yield_extend(function(wild___4_2_1 /* () */ ) {
                  return _mlift_mount_view_11548(x_111_12197, next_1_2, parent_3_0_10, renderer_3_7, root_3_0_8, wild___4_2_1);
                });
              }
              else {
                return _mlift_mount_view_11548(x_111_12197, next_1_2, parent_3_0_10, renderer_3_7, root_3_0_8, x_115_12208);
              }
            });
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(_mlift_mount_view_11549);
          }
          else {
            return $std_core_types.Unit;
          }
        }
      }
    }
  }
  else if (tree_0_0._tag === 7) {
    return mount_keyed_plan(renderer_3_7, root_3_0_8, parent_3_0_10, before_1_7, tree_0_0.plan);
  }
  else {
    return insert_html(root_3_0_8, parent_3_0_10, before_1_7, $std_core_hnd._open_none1(function(value_0_0 /* kokaine/html/trusted-html */ ) {
          return value_0_0;
        }, tree_0_0.content));
  }
}
 
 
// monadic lift
export function _mlift_mount_effect_11553(_y_x10727) /* (hnd/ev-index) -> <exn,div> () */  {
  return $std_core_hnd._mask_at(_y_x10727, false, function() {
      return $std_core_types.Unit;
    });
}
 
 
// monadic lift
export function _mlift_mount_effect_11554(_y_x10726) /* (hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn> () */  {
  return $std_core_hnd._mask_at(_y_x10726, false, function() {
       
      var x_12215 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_mount_effect_11553);
      }
      else {
        return $std_core_hnd._mask_at(x_12215, false, function() {
            return $std_core_types.Unit;
          });
      }
    });
}
 
 
// monadic lift
export function _mlift_mount_effect_11555(_pat_2) /* (kokaine/reactive/internal/model/cleanup-registration<ui>) -> exn () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_effect_11556(first, last, _y_x10737) /* (first : node, last : node, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10737, false, function() {
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_clean_range(first, last, true);
        });
      var _x130 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x130) {
        return $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
    });
}
 
 
// monadic lift
export function _mlift_mount_effect_11557(last, parent, renderer, root, tree, wild___0) /* forall<e> (last : node, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, tree : kokaine/html/view<e>, wild_@0 : ()) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
  return mount_view(renderer, root, parent, $std_core_types.Just(last), tree);
}
 
 
// monadic lift
export function _mlift_mount_effect_11558(first, last, parent, renderer, root, tree, wild__) /* forall<e> (first : node, last : node, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, tree : kokaine/html/view<e>, wild_ : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_12219 = $std_core_hnd._open_at2(0, function(root_0 /* kokaine/reactive/root<ui> */ , cleanup /* () -> <kokaine/reactive/effects/signal-write,pure,ui> () */ ) {
       
      var root_0_10046 = $std_core_hnd._open_none1(function(value /* kokaine/reactive/root<ui> */ ) {
          return value;
        }, root_0);
       
      var x_0_12221 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046, cleanup);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_mount_effect_11555);
      }
      else {
        return $std_core_types.Unit;
      }
    }, root, function() {
       
      var x_1_12223 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10737 /* hnd/ev-index */ ) {
          return _mlift_mount_effect_11556(first, last, _y_x10737);
        });
      }
      else {
        return _mlift_mount_effect_11556(first, last, x_1_12223);
      }
    });
   
  function next_12220(wild___0) /* (()) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
    return mount_view(renderer, root, parent, $std_core_types.Just(last), tree);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_12220);
  }
  else {
    return next_12220(x_12219);
  }
}
 
 
// monadic lift
export function _mlift_mount_effect_11559(first, parent, renderer, root, tree, last) /* forall<e> (first : node, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, tree : kokaine/html/view<e>, last : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_12231 = $std_core_hnd._open_at4(0, function(parent_0 /* node */ , before /* maybe<node> */ , first_0 /* node */ , last_0 /* node */ ) {
      if (before === null) {
         
        var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_append_marker_pair(parent_0, first_0, last_0);
          });
        var _x131 = $std_core_hnd._open_none1(dom_attempt_ok, result);
        if (_x131) {
          return $std_core_hnd._open_none1(dom_attempt_value, result);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
        }
      }
      else {
         
        var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_insert_marker_pair_before(parent_0, first_0, last_0, before.value);
          });
        var _x132 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
        if (_x132) {
          return $std_core_hnd._open_none1(dom_attempt_value, result_0);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
        }
      }
    }, parent, $std_core_types.Nothing, first, last);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_mount_effect_11558(first, last, parent, renderer, root, tree, wild__);
    });
  }
  else {
    return _mlift_mount_effect_11558(first, last, parent, renderer, root, tree, x_12231);
  }
}
 
 
// monadic lift
export function _mlift_mount_effect_11560(parent, renderer, root, tree, first) /* forall<e> (parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, tree : kokaine/html/view<e>, first : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_12235 = $std_core_hnd._open_at1(0, dom_attempt, function() {
      return dom_create_comment("/kokaine:mount");
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(last /* node */ ) {
      return _mlift_mount_effect_11559(first, parent, renderer, root, tree, last);
    });
  }
  else {
    return _mlift_mount_effect_11559(first, parent, renderer, root, tree, x_12235);
  }
}
 
export function mount_effect(renderer, root, parent, tree) /* forall<e> (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, parent : node, tree : kokaine/html/view<e>) -> <kokaine/reactive/effects/signal-write,ui,pure> kokaine/reactive/disposer<ui> */  {
  return $kokaine_reactive.create_effect(root, function() {
       
      var x_12237 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_mount_effect_11554);
      }
      else {
        return _mlift_mount_effect_11554(x_12237);
      }
    }, function(___wildcard_x1467__40 /* () */ ) {
       
      var x_0_12239 = $std_core_hnd._open_at1(0, dom_attempt, function() {
          return dom_create_comment("kokaine:mount");
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(first /* node */ ) {
          return _mlift_mount_effect_11560(parent, renderer, root, tree, first);
        });
      }
      else {
        return _mlift_mount_effect_11560(parent, renderer, root, tree, x_0_12239);
      }
    });
}
 
 
// monadic lift
export function _mlift_mount_transaction_11561(pending, dispose_0) /* forall<_e> (pending : ref<global,maybe<() -> <exn,ui> ()>>, dispose@0 : () -> <exn,ui> ()) -> <kokaine/reactive/effects/signal-write,ui,pure> (() -> <exn,ui> ()) */  {
   
  ((pending).value = ($std_core_types.Just(dispose_0)));
  return dispose_0;
}
 
 
// monadic lift
export function _mlift_mount_transaction_11562(register, _y_x10755) /* (register : () -> <div,exn,kokaine/reactive/effects/signal-write,ui> (() -> <exn,ui> ()), hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui> (() -> <exn,ui> ()) */  {
  return $std_core_hnd._mask_at(_y_x10755, false, register);
}
 
 
// monadic lift
export function _mlift_mount_transaction_11563(register, root, _y_x10751) /* (register : () -> <div,exn,kokaine/reactive/effects/signal-write,ui> (() -> <exn,ui> ()), root : kokaine/reactive/root<ui>, owner-match) -> <exn,ui> (() -> <exn,ui> ()) */  {
  if (_y_x10751._tag === 1) {
     
    var inner_0_0 = $std_core_hnd._open_none1(function(value_6 /* kokaine/reactive/root<ui> */ ) {
        return value_6;
      }, root);
    return $kokaine_reactive_internal_runtime.update(inner_0_0, function() {
         
        var root_0_10027_0 = $std_core_hnd._open_none1(function(value_7 /* kokaine/reactive/root<ui> */ ) {
            return value_7;
          }, root);
        return $kokaine_reactive_internal_runtime.batch(root_0_10027_0, register);
      });
  }
  else if (_y_x10751._tag === 3) {
    return $std_core_exn.$throw("cannot mount into a retired Kokaine DOM generation");
  }
  else {
    return $kokaine_reactive_integration_internal_reentry.run_reentry($std_core_hnd._open_none1(function(value_0_0 /* kokaine/reactive/integration/reentry<ui> */ ) {
          return value_0_0;
        }, _y_x10751.owner_portal), function() {
         
        var x_12241 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10755 /* hnd/ev-index */ ) {
            return $std_core_hnd._mask_at(_y_x10755, false, register);
          });
        }
        else {
          return $std_core_hnd._mask_at(x_12241, false, register);
        }
      });
  }
}
 
 
// monadic lift
export function _mlift_mount_transaction_11564(committed, _c_x10759) /* forall<_e> (committed : ref<global,bool>, () -> <exn,ui> ()) -> (() -> <exn,ui> ()) */  {
   
  ((committed).value = true);
  return _c_x10759;
}
 
 
// monadic lift
export function _mlift_mount_transaction_11565(inherit_owner, parent, root, tree, wild__) /* forall<_e,_e1,_e2,e3> (inherit-owner : bool, parent : node, root : kokaine/reactive/root<ui>, tree : kokaine/html/view<e3>, wild_ : ()) -> <ui,exn> (() -> <exn,ui> ()) */  {
   
  var renderer = $std_core_hnd._open_none0($kokaine_dom_internal_keyed_dash_transaction.new_keyed_context);
   
  var pending = { value: ($std_core_types.Nothing) };
   
  var committed = { value: false };
   
  function register() /* () -> <div,exn,kokaine/reactive/effects/signal-write,ui> (() -> <exn,ui> ()) */  {
     
    var x_12247 = mount_effect(renderer, root, parent, tree);
     
    function next_12248(dispose_0) /* (kokaine/reactive/disposer<ui>) -> <kokaine/reactive/effects/signal-write,ui,pure> (() -> <exn,ui> ()) */  {
       
      ((pending).value = ($std_core_types.Just(dispose_0)));
      return dispose_0;
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(next_12248);
    }
    else {
      return next_12248(x_12247);
    }
  }
   
  var _x131 = $std_core_hnd._open_none1(function(b /* bool */ ) {
      return (b) ? false : true;
    }, inherit_owner);
  if (_x131) {
     
    var inner_0 = $std_core_hnd._open_none1(function(value_4 /* kokaine/reactive/root<ui> */ ) {
        return value_4;
      }, root);
    var x_0_12251 = $kokaine_reactive_internal_runtime.update(inner_0, function() {
         
        var root_0_10027 = $std_core_hnd._open_none1(function(value_5 /* kokaine/reactive/root<ui> */ ) {
            return value_5;
          }, root);
        return $kokaine_reactive_internal_runtime.batch(root_0_10027, register);
      });
  }
  else {
     
    var x_1_12253 = find_owner(root, parent);
    if ($std_core_hnd._yielding()) {
      var x_0_12251 = $std_core_hnd.yield_extend(function(_y_x10751 /* owner-match */ ) {
        return _mlift_mount_transaction_11563(register, root, _y_x10751);
      });
    }
    else {
      var x_0_12251 = _mlift_mount_transaction_11563(register, root, x_1_12253);
    }
  }
  if ($std_core_hnd._yielding()) {
    var _x133 = $std_core_hnd.yield_extend(function(_c_x10759 /* () -> <exn,ui> () */ ) {
       
      ((committed).value = true);
      return _c_x10759;
    });
  }
  else {
     
    ((committed).value = true);
    var _x133 = x_0_12251;
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x131 = committed.value;
      if (_x131) {
        return $std_core_types.Unit;
      }
      else {
        var _x132 = pending.value;
        if (_x132 === null) {
          return $std_core_types.Unit;
        }
        else {
          return _x132.value();
        }
      }
    }, _x133);
}
 
export function mount_transaction(root, parent, tree, inherit_owner) /* forall<e> (root : kokaine/reactive/root<ui>, parent : node, tree : kokaine/html/view<e>, inherit-owner : bool) -> <ui,exn> kokaine/reactive/disposer<ui> */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_install_shadow_tracker(parent);
    });
   
  var _x134 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x134) {
    var x_12257 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_12257 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_mount_transaction_11565(inherit_owner, parent, root, tree, wild__);
    });
  }
  else {
     
    var renderer = $std_core_hnd._open_none0($kokaine_dom_internal_keyed_dash_transaction.new_keyed_context);
     
    var pending = { value: ($std_core_types.Nothing) };
     
    var committed = { value: false };
     
    var register = function() {
       
      var x_0_12263 = mount_effect(renderer, root, parent, tree);
       
      var next_0_12264 = function(dispose_0 /* () -> <exn,ui> () */ ) {
         
        ((pending).value = ($std_core_types.Just(dispose_0)));
        return dispose_0;
      };
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(next_0_12264);
      }
      else {
        return next_0_12264(x_0_12263);
      }
    };
     
    var _x134 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, inherit_owner);
    if (_x134) {
       
      var inner_0 = $std_core_hnd._open_none1(function(value_4 /* kokaine/reactive/root<ui> */ ) {
          return value_4;
        }, root);
      var x_1_12267 = $kokaine_reactive_internal_runtime.update(inner_0, function() {
           
          var root_0_10027 = $std_core_hnd._open_none1(function(value_5 /* kokaine/reactive/root<ui> */ ) {
              return value_5;
            }, root);
          return $kokaine_reactive_internal_runtime.batch(root_0_10027, register);
        });
    }
    else {
       
      var x_2_12269 = find_owner(root, parent);
      if ($std_core_hnd._yielding()) {
        var x_1_12267 = $std_core_hnd.yield_extend(function(_y_x10751 /* owner-match */ ) {
          return _mlift_mount_transaction_11563(register, root, _y_x10751);
        });
      }
      else {
        var x_1_12267 = _mlift_mount_transaction_11563(register, root, x_2_12269);
      }
    }
    if ($std_core_hnd._yielding()) {
      var _x136 = $std_core_hnd.yield_extend(function(_c_x10759 /* () -> <exn,ui> () */ ) {
         
        ((committed).value = true);
        return _c_x10759;
      });
    }
    else {
       
      ((committed).value = true);
      var _x136 = x_1_12267;
    }
    return $std_core_hnd.finally_prompt(function() {
        var _x134 = committed.value;
        if (_x134) {
          return $std_core_types.Unit;
        }
        else {
          var _x135 = pending.value;
          if (_x135 === null) {
            return $std_core_types.Unit;
          }
          else {
            return _x135.value();
          }
        }
      }, _x136);
  }
}
 
export function mount(root, parent, tree) /* forall<e> (root : kokaine/reactive/root<ui>, parent : node, tree : kokaine/html/view<e>) -> <ui,exn> kokaine/reactive/disposer<ui> */  {
  return mount_transaction(root, parent, tree, true);
}
 
 
// Opt out of physical DOM ownership inheritance for intentionally independent
// roots mounted inside a managed subtree. The caller then owns the returned
// disposer and must retire it explicitly.
export function mount_independent(root, parent, tree) /* forall<e> (root : kokaine/reactive/root<ui>, parent : node, tree : kokaine/html/view<e>) -> <ui,exn> kokaine/reactive/disposer<ui> */  {
  return mount_transaction(root, parent, tree, false);
}
 
export function unmount(dispose) /* forall<e> (dispose : kokaine/reactive/disposer<<ui|e>>) -> <ui,exn|e> () */  {
  return dispose();
}