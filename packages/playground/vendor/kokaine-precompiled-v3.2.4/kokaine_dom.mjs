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
/** Backs `extern dom-try-set-text`. Returns null or the failure message. */
function kokaineDomTrySetText(node, content) {
  try {
    node.data = content;
    return null;
  } catch (error) {
    return String(error && error.message != null ? error.message : error);
  }
}
/** Backs `extern dom-try-set-attribute`. Returns null or the failure message. */
function kokaineDomTrySetAttribute(element, name, content) {
  try {
    element.setAttribute(name, content);
    return null;
  } catch (error) {
    return String(error && error.message != null ? error.message : error);
  }
}
/** Backs `extern dom-try-remove-attribute`. Returns null or the failure message. */
function kokaineDomTryRemoveAttribute(element, name) {
  try {
    element.removeAttribute(name);
    return null;
  } catch (error) {
    return String(error && error.message != null ? error.message : error);
  }
}
/** Backs `extern dom-try-set-property`. Returns null or the failure message. */
function kokaineDomTrySetProperty(element, name, content) {
  try {
    element[name] = content;
    return null;
  } catch (error) {
    return String(error && error.message != null ? error.message : error);
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
    tracker.realms.set(view, { prototype: prototype, wrapper: null, epoch: 0 });
    return;
  }
  var original = descriptor.value;
  // `epoch` counts attachShadow calls so a keyed move session can tell that no
  // shadow root appeared since it validated a row.
  var realmState = { prototype: prototype, wrapper: null, epoch: 0 };
  var wrapper = function attachShadow() {
    realmState.epoch++;
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
  realmState.wrapper = wrapper;
  tracker.realms.set(view, realmState);
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
/**
 * Backs `extern dom-validate-range-move-lifecycle`. With a move `session`
 * (see kokaineDomKeyedOpenMoveSession), open shadow roots met on the way are
 * observed by that session and the row is recorded as planned/pre-validated.
 */
function kokaineDomValidateRangeMoveLifecycle(rangeParent, rangeFirst, rangeLast, session) {
  var doc = rangeParent && (rangeParent.nodeType === 9 ? rangeParent : rangeParent.ownerDocument);
  var view = doc && doc.defaultView;
  var tracker = globalThis[Symbol.for('kokaine.dom.shadow-roots')];
  var state = view && tracker && tracker.realms && tracker.realms.get(view);
  var prototype = view && view.Element && view.Element.prototype;
  var intact = state && state.prototype === prototype && (state.wrapper ? prototype.attachShadow === state.wrapper : typeof prototype.attachShadow !== 'function');
  if (!tracker || tracker.version !== 1 || !tracker.known || !tracker.closed || !state || !intact)
    throw new Error('cannot safely move keyed row: shadow-root tracking is unavailable');
  // Native inspection primitives, the inert serialisation document, and the
  // memo tables live on the realm's tracker state. Both memos are sound:
  // createElement(name) without options can never yield a custom element, so
  // a realm's baseline prototype for (namespace, localName) is fixed; and an
  // element's `is` value is immutable for its lifetime.
  var inspection = state.inspection;
  if (!inspection || inspection.document !== doc) {
    var documentPrototype = view.Document && view.Document.prototype;
    var createElement = documentPrototype && documentPrototype.createElement;
    var createElementNS = documentPrototype && documentPrototype.createElementNS;
    var importNode = documentPrototype && documentPrototype.importNode;
    var implementationDescriptor = documentPrototype && Object.getOwnPropertyDescriptor(documentPrototype, 'implementation');
    var implementation = implementationDescriptor && typeof implementationDescriptor.get === 'function' ? implementationDescriptor.get.call(doc) : null;
    var createHTMLDocument = view.DOMImplementation && view.DOMImplementation.prototype && view.DOMImplementation.prototype.createHTMLDocument;
    var outerHTMLDescriptor = prototype && Object.getOwnPropertyDescriptor(prototype, 'outerHTML');
    var serializeOuterHTML = outerHTMLDescriptor && outerHTMLDescriptor.get;
    if (typeof createElement !== 'function' || typeof createElementNS !== 'function' || typeof importNode !== 'function' || !implementation || typeof createHTMLDocument !== 'function' || typeof serializeOuterHTML !== 'function')
      throw new Error('cannot safely move keyed row: native element inspection is unavailable');
    inspection = {
      document: doc,
      createElement: createElement,
      createElementNS: createElementNS,
      importNode: importNode,
      serialize: serializeOuterHTML,
      // A document without a browsing context has no custom-element
      // registry, so importing into it never runs a constructor.
      inert: createHTMLDocument.call(implementation, ''),
      baselines: new Map(),
      plain: new WeakSet()
    };
    state.inspection = inspection;
  }
  function canHostShadow(element) {
    var name = element.localName || '';
    return name.indexOf('-') >= 0 || ['article', 'aside', 'blockquote', 'body', 'div', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'main', 'nav', 'p', 'section', 'span'].indexOf(name) >= 0;
  }
  function hasCustomPrototype(element) {
    var name = element.localName || '';
    if (name.indexOf('-') >= 0)
      return true;
    var namespace = element.namespaceURI;
    var key = (namespace || '') + ' ' + name;
    var baseline = inspection.baselines.get(key);
    if (baseline === undefined) {
      baseline = Object.getPrototypeOf(namespace ? inspection.createElementNS.call(doc, namespace, name) : inspection.createElement.call(doc, name));
      inspection.baselines.set(key, baseline);
    }
    return Object.getPrototypeOf(element) !== baseline;
  }
  // A customized built-in created with createElement(name, { is }) carries
  // its `is` value without an attribute; only serialisation exposes it.
  // Serialise a shallow copy imported into the inert document, so the cost is
  // one start tag rather than the whole subtree once per ancestor.
  function hasSerializedIsValue(element) {
    if (inspection.plain.has(element))
      return false;
    var serialized = inspection.serialize.call(inspection.importNode.call(inspection.inert, element, false));
    var end = serialized.indexOf('>');
    var customized = end >= 0 && serialized.slice(0, end).indexOf(' is="') >= 0;
    if (!customized)
      inspection.plain.add(element);
    return customized;
  }
  var watch = session && typeof session.watch === 'function' ? session.watch : null;
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
    if (current && current.shadowRoot) {
      if (watch)
        watch(current.shadowRoot);
      children = children.concat(Array.prototype.slice.call(current.shadowRoot.childNodes));
    }
    for (var i = 0; i < children.length; i++)
      pending.push(children[i]);
  }
  if (session && session.planned)
    session.planned.add(rangeFirst);
}
/**
 * Backs `extern dom-validate-range-move-focus`. Without an atomic native move,
 * reject a focused subtree whose focus or selection cannot be restored. The
 * focused node belongs to the range iff its composed ancestor chain reaches a
 * top-level range node, so only that chain is walked, not the whole subtree.
 */
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
  var active = rangeDocument.activeElement;
  while (active && active.shadowRoot && active.shadowRoot.activeElement)
    active = active.shadowRoot.activeElement;
  var top = active;
  while (top && top.parentNode !== rangeParent) {
    if (top.parentNode) {
      top = top.parentNode;
    } else {
      var tree = top.getRootNode ? top.getRootNode() : null;
      top = tree && tree.host ? tree.host : null;
    }
  }
  if (!top || nodes.indexOf(top) < 0)
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
/**
 * Backs `extern dom-keyed-open-move-session`. One session spans a keyed
 * reconciliation's move phase. Rows validated with it are "planned" and may
 * later move without re-inspection only while the session can prove that
 * nothing could have changed their lifecycle shape since: its observer saw no
 * mutation in the region (or in any open shadow root met during validation)
 * other than the keyed moves themselves, no attachShadow call happened in the
 * realm, and the attachShadow wrapper is still installed. Anything else, or a
 * realm without MutationObserver or an epoch-counting tracker, makes the
 * session dirty, and every later move re-validates its row as before.
 */
function kokaineDomKeyedOpenMoveSession(rangeParent) {
  var session = { closed: false, dirty: true, planned: new WeakSet(), observer: null, audit: null, watch: null };
  var doc = rangeParent && (rangeParent.nodeType === 9 ? rangeParent : rangeParent.ownerDocument);
  var view = doc && doc.defaultView;
  var tracker = globalThis[Symbol.for('kokaine.dom.shadow-roots')];
  var state = view && tracker && tracker.realms && tracker.realms.get(view);
  var prototype = view && view.Element && view.Element.prototype;
  if (!state || !prototype || typeof state.epoch !== 'number' || typeof view.MutationObserver !== 'function')
    return session;
  var options = { childList: true, subtree: true, attributes: true, attributeFilter: ['is'] };
  var observer;
  try {
    observer = new view.MutationObserver(function () {});
    observer.observe(rangeParent, options);
  } catch (_) {
    return session;
  }
  var epoch = state.epoch;
  function untouched() {
    return state.prototype === prototype && view.Element.prototype === prototype && state.epoch === epoch && (state.wrapper ? prototype.attachShadow === state.wrapper : typeof prototype.attachShadow !== 'function');
  }
  function contained(list, moved) {
    for (var i = 0; i < list.length; i++) {
      if (!moved.has(list[i]))
        return false;
    }
    return true;
  }
  session.observer = observer;
  session.dirty = false;
  // Consume pending records. `moved` lists the nodes of the keyed move that
  // produced them; childList records of the range parent touching only those
  // nodes are expected. Returns whether the session is still clean.
  session.audit = function (moved) {
    if (session.closed || session.dirty)
      return false;
    try {
      var records = observer.takeRecords();
      var clean = untouched();
      var allowed = moved ? new Set(moved) : null;
      for (var i = 0; clean && i < records.length; i++) {
        var record = records[i];
        clean = !!allowed && record.type === 'childList' && record.target === rangeParent && contained(record.addedNodes, allowed) && contained(record.removedNodes, allowed);
      }
      if (!clean)
        session.dirty = true;
    } catch (_) {
      session.dirty = true;
    }
    return !session.dirty;
  };
  session.watch = function (root) {
    if (session.closed || session.dirty)
      return;
    try {
      observer.observe(root, options);
    } catch (_) {
      session.dirty = true;
    }
  };
  return session;
}
/** Backs `extern dom-keyed-close-move-session`. Planned rows stay queryable. */
function kokaineDomKeyedCloseMoveSession(session) {
  if (!session || session.closed)
    return;
  session.closed = true;
  if (session.observer) {
    try {
      session.observer.disconnect();
    } catch (_) {
    }
  }
}
/** Backs `extern dom-keyed-session-trusts`: may this row skip re-validation? */
function kokaineDomKeyedSessionTrusts(session, rangeFirst) {
  if (!session || typeof session.audit !== 'function' || !session.planned.has(rangeFirst))
    return false;
  return session.audit(null);
}
/** Backs `extern dom-keyed-session-planned`. */
function kokaineDomKeyedSessionPlanned(session, rangeFirst) {
  return !!session && !!session.planned && session.planned.has(rangeFirst);
}
/**
 * Backs `extern dom-keyed-current-order`. `firsts`/`lasts` hold the boundary
 * markers of the rows expected in the region. Returns, in current DOM order,
 * each row's index in those arrays, or null unless the region consists of
 * exactly those rows, each once, with nothing between them.
 */
function kokaineDomKeyedCurrentOrder(rangeParent, rangeFirst, rangeLast, firsts, lasts) {
  if (!rangeParent || !rangeFirst || !rangeLast || rangeFirst.parentNode !== rangeParent || rangeLast.parentNode !== rangeParent)
    return null;
  var index = new Map();
  for (var i = 0; i < firsts.length; i++)
    index.set(firsts[i], i);
  var order = [];
  var n = rangeFirst.nextSibling;
  while (n && n !== rangeLast) {
    var position = index.get(n);
    if (position === undefined)
      return null;
    index.delete(n);
    var end = lasts[position];
    while (n && n !== end) {
      if (n === rangeLast)
        return null;
      n = n.nextSibling;
    }
    if (!n)
      return null;
    order.push(position);
    n = n.nextSibling;
  }
  if (n !== rangeLast || order.length !== firsts.length)
    return null;
  return order;
}
/**
 * Backs `extern dom-keyed-stable-rows`. `order` is a permutation of
 * 0..n-1: the target position of each row, listed in current DOM order.
 * Returns flags indexed by target position, true for the rows of one longest
 * increasing subsequence. Those rows keep their relative order and stay
 * put; every other row is moved (Vue/ivi-style placement). O(n log n).
 */
function kokaineDomKeyedStableRows(order) {
  var count = order.length;
  var keep = [];
  var previous = [];
  var tails = [];
  for (var i = 0; i < count; i++)
    keep.push(false);
  for (var j = 0; j < count; j++) {
    var value = order[j];
    var low = 0;
    var high = tails.length;
    while (low < high) {
      var middle = (low + high) >>> 1;
      if (order[tails[middle]] < value)
        low = middle + 1;
      else
        high = middle;
    }
    previous.push(low > 0 ? tails[low - 1] : -1);
    tails[low] = j;
  }
  var k = tails.length ? tails[tails.length - 1] : -1;
  while (k >= 0) {
    keep[order[k]] = true;
    k = previous[k];
  }
  return keep;
}
/**
 * Backs `extern dom-keyed-firsts-in-order`. Do the opening markers `firsts`
 * all occur, in this order, between the region markers (other nodes, such as
 * draft rows awaiting disposal, may sit in between)?
 */
function kokaineDomKeyedFirstsInOrder(rangeParent, rangeFirst, rangeLast, firsts) {
  if (!rangeParent || !rangeFirst || !rangeLast || rangeFirst.parentNode !== rangeParent || rangeLast.parentNode !== rangeParent)
    return false;
  var i = 0;
  var n = rangeFirst.nextSibling;
  while (n && n !== rangeLast) {
    if (i < firsts.length && n === firsts[i])
      i++;
    n = n.nextSibling;
  }
  return n === rangeLast && i === firsts.length;
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
/**
 * Backs `extern dom-move-range-before`. A keyed move `session` (or null)
 * audits the mutation records this move produced, so focus-restoration
 * handlers that mutate the region make later pre-validated moves re-validate.
 */
function kokaineDomMoveRangeBefore(rangeParent, rangeFirst, rangeLast, target, focusState, session) {
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
  } finally {
    if (session && typeof session.audit === 'function')
      session.audit(nodes);
  }
}
/** Backs `extern dom-clean-range`. */
// Detaching a connected custom element runs its disconnectedCallback
// synchronously, and that user code may move a range descendant elsewhere (into
// the document or a detached tree) or reinsert a removed node. Cleanup therefore
// snapshots every descendant (open shadow trees included) before detaching the
// range roots, then detaches any snapshot node that is still attached but no
// longer inside a range root, repeating until the DOM is stable.
//
// "Inside" means the node's ancestor chain (parentNode, then a shadow root's
// host) reaches a range root. The snapshot records each descendant's parent:
// a node still under that parent shares the parent's answer, so the common
// sweep is O(1) per node and only moved nodes walk their ancestors. The memo
// is trusted only until the sweep itself mutates the DOM (a removal can run
// user callbacks); every later check in that sweep walks.
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
  // descendants[j] was snapshotted under parents[j]: the node (or its shadow
  // root) at descendants[parentIndex[j]], or for index -1 a range root (or its
  // shadow root).
  var descendants = [];
  var parents = [];
  var parentIndex = [];
  var pending = roots.slice();
  var pendingIndex = [];
  for (var r = 0; r < roots.length; r++)
    pendingIndex.push(-1);
  while (pending.length) {
    var current = pending.pop();
    var currentIndex = pendingIndex.pop();
    var tree = current;
    while (tree) {
      for (var child = tree.firstChild; child; child = child.nextSibling) {
        pending.push(child);
        pendingIndex.push(descendants.length);
        descendants.push(child);
        parents.push(tree);
        parentIndex.push(currentIndex);
      }
      tree = tree === current ? current.shadowRoot : null;
    }
  }
  var rootSet = new Set(roots);
  function retained(node) {
    var current = node;
    while (current) {
      var top = current;
      for (var ancestor = current; ancestor; ancestor = ancestor.parentNode) {
        if (rootSet.has(ancestor))
          return true;
        top = ancestor;
      }
      current = top.nodeType === 11 && top.host ? top.host : null;
    }
    return false;
  }
  var inside = [];
  var dirty = false;
  // Returns the parent to detach descendants[j] from, or null when it is
  // detached or still inside the range.
  function escapedParent(j) {
    var node = descendants[j];
    var parent = node.parentNode;
    var result;
    if (!parent)
      result = false;
    else if (!dirty && parent === parents[j])
      result = parentIndex[j] < 0 || inside[parentIndex[j]];
    else
      result = retained(node);
    inside[j] = result;
    return result ? null : parent;
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
    dirty = false;
    for (var j = 0; j < descendants.length; j++) {
      var childParent = escapedParent(j);
      if (childParent) {
        attached = true;
        dirty = true;
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
// Same snapshot shape as kokaineDomCleanRange (descendants with their recorded
// parents), so kokaineDomRunRetirement can use the same parent memo.
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
  var parents = [];
  var parentIndex = [];
  var pending = roots.slice();
  var pendingIndex = [];
  for (var r = 0; r < roots.length; r++)
    pendingIndex.push(-1);
  while (pending.length) {
    var current = pending.pop();
    var currentIndex = pendingIndex.pop();
    var tree = current;
    while (tree) {
      for (var child = tree.firstChild; child; child = child.nextSibling) {
        pending.push(child);
        pendingIndex.push(descendants.length);
        descendants.push(child);
        parents.push(tree);
        parentIndex.push(currentIndex);
      }
      tree = tree === current ? current.shadowRoot : null;
    }
  }
  var doc = rangeFirst.ownerDocument;
  var view = doc && doc.defaultView;
  var proto = view && view.Node && view.Node.prototype;
  if (!proto || typeof proto.removeChild !== 'function' || typeof proto.contains !== 'function')
    throw new Error('cannot stage Kokaine keyed retirement without its DOM realm');
  return { roots: roots, descendants: descendants, parents: parents, parentIndex: parentIndex, proto: proto };
}
/** Backs `extern dom-run-retirement`. */
// See kokaineDomCleanRange for the escape sweep and its parent memo. Between
// staging and running, application code may already have moved snapshot
// nodes; the memo only answers for a node still under its recorded parent.
function kokaineDomRunRetirement(handle) {
  if (!handle || !handle.roots)
    return;
  var roots = handle.roots;
  var descendants = handle.descendants;
  var parents = handle.parents;
  var parentIndex = handle.parentIndex;
  var proto = handle.proto;
  var removeChild = proto && proto.removeChild;
  var contains = proto && proto.contains;
  if (typeof removeChild !== 'function' || typeof contains !== 'function')
    throw new Error('cannot run Kokaine keyed retirement without its DOM realm');
  var rootSet = new Set(roots);
  function retained(node) {
    var current = node;
    while (current) {
      var top = current;
      for (var ancestor = current; ancestor; ancestor = ancestor.parentNode) {
        if (rootSet.has(ancestor))
          return true;
        top = ancestor;
      }
      current = top.nodeType === 11 && top.host ? top.host : null;
    }
    return false;
  }
  var inside = [];
  var dirty = false;
  function isInside(j) {
    var node = descendants[j];
    var parent = node.parentNode;
    var result;
    if (!parent)
      result = false;
    else if (!dirty && parent === parents[j])
      result = parentIndex[j] < 0 || inside[parentIndex[j]];
    else
      result = retained(node);
    inside[j] = result;
    return result;
  }
  function detachRoot(node) {
    var parent = node && node.parentNode;
    if (!parent)
      return;
    try {
      removeChild.call(parent, node);
    } catch (error) {
      if (node.parentNode)
        throw error;
    }
  }
  function detachDescendant(j) {
    var node = descendants[j];
    var parent = node.parentNode;
    if (isInside(j) || !parent)
      return;
    dirty = true;
    try {
      removeChild.call(parent, node);
    } catch (error) {
      if (node.parentNode && !retained(node))
        throw error;
    }
  }
  var passes = Math.max(2, roots.length + descendants.length + 2);
  while (passes-- > 0) {
    for (var i = 0; i < roots.length; i++)
      detachRoot(roots[i]);
    dirty = false;
    for (var j = 0; j < descendants.length; j++)
      detachDescendant(j);
    var pending = false;
    for (var r = 0; r < roots.length; r++) {
      if (roots[r].parentNode) {
        pending = true;
        break;
      }
    }
    if (!pending) {
      dirty = false;
      for (var d = 0; d < descendants.length; d++) {
        if (!isInside(d) && descendants[d].parentNode) {
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
  handle.parents = null;
  handle.parentIndex = null;
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
// type listener-gate
export const Gate_pending = { _tag: 1 }; // listener-gate
export function Gate_captured(gate_continuation) /* (gate-continuation : kokaine/reactive/integration/event/event-continuation<kokaine/async/effects/async,kokaine/html/event>) -> listener-gate */  {
  return { _tag: 2, gate_continuation: gate_continuation };
}
export const Gate_closed = { _tag: 3 }; // listener-gate
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
 
 
// Automatically generated. Tests for the `Gate-pending` constructor of the `:listener-gate` type.
export function is_gate_pending(listener_gate) /* (listener-gate : listener-gate) -> bool */  {
  return (listener_gate._tag === 1);
}
 
 
// Automatically generated. Tests for the `Gate-captured` constructor of the `:listener-gate` type.
export function is_gate_captured(listener_gate) /* (listener-gate : listener-gate) -> bool */  {
  return (listener_gate._tag === 2);
}
 
 
// Automatically generated. Tests for the `Gate-closed` constructor of the `:listener-gate` type.
export function is_gate_closed(listener_gate) /* (listener-gate : listener-gate) -> bool */  {
  return (listener_gate._tag === 3);
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
export function _mlift_open_keyed_participation_11560(_y_x10157) /* (kokaine/reactive/integration/internal/provision/provision-lease<ui>) -> exn keyed-participation */  {
   
  var lease = _y_x10157;
   
  var current = $std_core_hnd._open_none1(function(lease_0 /* kokaine/reactive/integration/provision-lease<ui> */ ) {
      var _x24 = lease_0;
      return _x24;
    }, lease);
  return Keyed_owned(current, lease, $std_core_hnd._open_none0(function() {
      return $kokaine_dom_internal_keyed_dash_transaction.Keyed_transaction($kokaine_dom_internal_keyed_dash_transaction.cell($kokaine_dom_internal_keyed_dash_transaction.Keyed_open), $kokaine_dom_internal_keyed_dash_transaction.cell($std_core_types.Nil));
    }));
}
 
 
// monadic lift
export function _mlift_open_keyed_participation_11561(current_0, _c_x10159) /* (current@0 : kokaine/reactive/integration/provision<ui>, kokaine/dom/internal/keyed-transaction/keyed-transaction) -> keyed-participation */  {
  return Keyed_joined(current_0, _c_x10159);
}
 
 
// monadic lift
export function _mlift_open_keyed_participation_11562(renderer, root, _y_x10156) /* (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, maybe<kokaine/reactive/integration/provision<ui>>) -> exn keyed-participation */  {
  if (_y_x10156 === null) {
     
    var x_11736 = $kokaine_reactive_integration_internal_provision.open_provision($std_core_hnd._open_none1(function(value /* kokaine/reactive/root<ui> */ ) {
        return value;
      }, root));
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(_mlift_open_keyed_participation_11560);
    }
    else {
      return _mlift_open_keyed_participation_11560(x_11736);
    }
  }
  else {
     
    var x_0_11738 = $kokaine_dom_internal_keyed_dash_transaction.find_keyed_transaction($std_core_hnd._open_none1($kokaine_dom_internal_keyed_dash_transaction.load, renderer), _y_x10156.value);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10159 /* kokaine/dom/internal/keyed-transaction/keyed-transaction */ ) {
        return Keyed_joined(_y_x10156.value, _c_x10159);
      });
    }
    else {
      return Keyed_joined(_y_x10156.value, x_0_11738);
    }
  }
}
 
export function open_keyed_participation(renderer, root) /* (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>) -> exn keyed-participation */  {
   
  var x_11742 = $kokaine_reactive_integration.current_provision(root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10156 /* maybe<kokaine/reactive/integration/provision<ui>> */ ) {
      return _mlift_open_keyed_participation_11562(renderer, root, _y_x10156);
    });
  }
  else {
    if (x_11742 === null) {
       
      var x_0_11745 = $kokaine_reactive_integration_internal_provision.open_provision($std_core_hnd._open_none1(function(value /* kokaine/reactive/root<ui> */ ) {
          return value;
        }, root));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_open_keyed_participation_11560);
      }
      else {
         
        var lease = x_0_11745;
         
        var current = $std_core_hnd._open_none1(function(lease_0 /* kokaine/reactive/integration/provision-lease<ui> */ ) {
            var _x24 = lease_0;
            return _x24;
          }, lease);
        return Keyed_owned(current, lease, $std_core_hnd._open_none0(function() {
            return $kokaine_dom_internal_keyed_dash_transaction.Keyed_transaction($kokaine_dom_internal_keyed_dash_transaction.cell($kokaine_dom_internal_keyed_dash_transaction.Keyed_open), $kokaine_dom_internal_keyed_dash_transaction.cell($std_core_types.Nil));
          }));
      }
    }
    else {
       
      var x_1_11748 = $kokaine_dom_internal_keyed_dash_transaction.find_keyed_transaction($std_core_hnd._open_none1($kokaine_dom_internal_keyed_dash_transaction.load, renderer), x_11742.value);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_c_x10159 /* kokaine/dom/internal/keyed-transaction/keyed-transaction */ ) {
          return Keyed_joined(x_11742.value, _c_x10159);
        });
      }
      else {
        return Keyed_joined(x_11742.value, x_1_11748);
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
export function dom_validate_range_move_lifecycle(parent, first, last, session) /* (parent : node, first : node, last : node, session : any) -> ui () */  {
  return kokaineDomValidateRangeMoveLifecycle(parent,first,last,session);
}
 
export function dom_validate_range_move_focus(parent, first, last) /* (parent : node, first : node, last : node) -> ui () */  {
  return kokaineDomValidateRangeMoveFocus(parent,first,last);
}
 
export function dom_capture_range_focus(parent, first, last) /* (parent : node, first : node, last : node) -> ui any */  {
  return kokaineDomCaptureRangeFocus(parent,first,last);
}
 
export function dom_move_range_before(parent, first, last, before, focus, session) /* (parent : node, first : node, last : node, before : node, focus : any, session : any) -> ui () */  {
  return kokaineDomMoveRangeBefore(parent,first,last,before,focus,session);
}
 
 
// A keyed move session spans one reconciliation's move phase (JavaScript
// state, type-erased here). Rows validated through it are "planned"; a planned
// row moves without re-inspection only while the session's mutation observer
// and the shadow-root tracker prove its lifecycle shape is unchanged since
// that validation. Otherwise the move re-validates, exactly as an unplanned
// move does. `dom-keyed-no-session` is the absent session.
export function dom_keyed_no_session() /* () -> any */  {
  return null;
}
 
export function dom_keyed_open_move_session(parent) /* (parent : node) -> ui any */  {
  return kokaineDomKeyedOpenMoveSession(parent);
}
 
export function dom_keyed_close_move_session(session) /* (session : any) -> ui () */  {
  return kokaineDomKeyedCloseMoveSession(session);
}
 
export function dom_keyed_session_trusts(session, first) /* (session : any, first : node) -> ui bool */  {
  return kokaineDomKeyedSessionTrusts(session,first);
}
 
export function dom_keyed_session_planned(session, first) /* (session : any, first : node) -> ui bool */  {
  return kokaineDomKeyedSessionPlanned(session,first);
}
 
 
// Current DOM order of the expected rows as indices into `firsts`/`lasts`, or
// null unless the region holds exactly those rows.
export function dom_keyed_current_order(parent, first, last, firsts, lasts) /* (parent : node, first : node, last : node, firsts : vector<node>, lasts : vector<node>) -> ui any */  {
  return kokaineDomKeyedCurrentOrder(parent,first,last,firsts,lasts);
}
 
 
// Longest-increasing-subsequence membership, indexed by target position.
export function dom_keyed_stable_rows(order) /* (order : any) -> ui vector<bool> */  {
  return kokaineDomKeyedStableRows(order);
}
 
export function dom_keyed_firsts_in_order(parent, first, last, firsts) /* (parent : node, first : node, last : node, firsts : vector<node>) -> ui bool */  {
  return kokaineDomKeyedFirstsInOrder(parent,first,last,firsts);
}
 
 
// Single-operation writes used on every live update. Each catches its own
// host exception and returns null or the message `dom-attempt` would report,
// avoiding the per-call closure and result box of `dom-attempt-raw`.
export function dom_try_set_text(value, content) /* (value : node, content : string) -> ui any */  {
  return kokaineDomTrySetText(value,content);
}
 
export function dom_try_set_attribute(value, name, content) /* (value : element, name : string, content : string) -> ui any */  {
  return kokaineDomTrySetAttribute(value,name,content);
}
 
export function dom_try_remove_attribute(value, name) /* (value : element, name : string) -> ui any */  {
  return kokaineDomTryRemoveAttribute(value,name);
}
 
export function dom_try_set_property(value, name, content) /* (value : element, name : string, content : any) -> ui any */  {
  return kokaineDomTrySetProperty(value,name,content);
}
 
export function string_any(value) /* (value : string) -> any */  {
  return value;
}
 
export function bool_any(value) /* (value : bool) -> any */  {
  return value;
}
 
export function int_string_any(value) /* (value : string) -> any */  {
  return Number(value);
}
 
export function any_string(value) /* (value : any) -> string */  {
  return String(value);
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
export function _mlift_query_11563(selector, result) /* (selector : string, result : any) -> <ui,exn> node */  {
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
    var x_11755 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11755 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(result_0 /* any */ ) {
      return _mlift_query_11563(selector, result_0);
    });
  }
  else {
    var _x26 = $std_core_hnd._open_none1(any_is_null, x_11755);
    if (_x26) {
      return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("DOM selector did not match: ", selector));
    }
    else {
      return $std_core_hnd._open_none1(any_node, x_11755);
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
export function toggle_fs__mlift_state_11564(state) /* (state : int) -> <ui,exn> toggle-state */  {
  return ($std_core_types._int_eq(state,1)) ? Toggle_open : Toggle_closed;
}
 
export function toggle_fs_state(value) /* (value : kokaine/html/event) -> <exn,ui> toggle-state */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      var _x42 = value.original;
      return dom_toggle_state(_x42);
    });
   
  var _x43 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x43) {
    var x_11774 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11774 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(toggle_fs__mlift_state_11564);
  }
  else {
    return ($std_core_types._int_eq(x_11774,1)) ? Toggle_open : Toggle_closed;
  }
}
 
 
// monadic lift
export function _mlift_tracked_11565(read, _y_x10192) /* forall<a> (read : () -> kokaine/reactive/effects/signal-read a, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-read> a */  {
  return $std_core_hnd._mask_at(_y_x10192, false, read);
}
 
export function tracked(read) /* forall<a> (read : () -> kokaine/reactive/effects/signal-read a) -> <kokaine/reactive/effects/signal-read,pure> a */  {
   
  var x_11779 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10192 /* hnd/ev-index */ ) {
      return $std_core_hnd._mask_at(_y_x10192, false, read);
    });
  }
  else {
    return $std_core_hnd._mask_at(x_11779, false, read);
  }
}
 
 
// monadic lift
export function _mlift_constant_track_11566(_y_x10196) /* (hnd/ev-index) -> <exn,div> () */  {
  return $std_core_hnd._mask_at(_y_x10196, false, function() {
      return $std_core_types.Unit;
    });
}
 
 
// monadic lift
export function _mlift_constant_track_11567(_y_x10195) /* (hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn> () */  {
  return $std_core_hnd._mask_at(_y_x10195, false, function() {
       
      var x_11784 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_constant_track_11566);
      }
      else {
        return $std_core_hnd._mask_at(x_11784, false, function() {
            return $std_core_types.Unit;
          });
      }
    });
}
 
export function constant_track() /* () -> <pure,kokaine/reactive/effects/signal-read> () */  {
   
  var x_11786 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_constant_track_11567);
  }
  else {
    return $std_core_hnd._mask_at(x_11786, false, function() {
         
        var x_0_11789 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(_mlift_constant_track_11566);
        }
        else {
          return $std_core_hnd._mask_at(x_0_11789, false, function() {
              return $std_core_types.Unit;
            });
        }
      });
  }
}
 
 
// monadic lift
export function _mlift_reactive_ui_exn_11568(action, _y_x10199) /* forall<a,e> (action : () -> <ui,exn> a, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10199, false, function() {
      return $std_core_hnd._open_at0($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), action);
    });
}
 
export function reactive_ui_exn(action) /* forall<a,e> (action : () -> <ui,exn> a) -> <kokaine/reactive/effects/signal-write,pure,ui|e> a */  {
   
  var x_11792 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10199 /* hnd/ev-index */ ) {
      return _mlift_reactive_ui_exn_11568(action, _y_x10199);
    });
  }
  else {
    return $std_core_hnd._mask_at(x_11792, false, function() {
        return $std_core_hnd._open_at0($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), action);
      });
  }
}
 
 
// monadic lift
export function _mlift_reactive_ui_exn_open_11569(action, _y_x10203) /* forall<a,e> (action : () -> <ui,exn|e> a, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10203, false, action);
}
 
export function reactive_ui_exn_open(action) /* forall<a,e> (action : () -> <ui,exn|e> a) -> <kokaine/reactive/effects/signal-write,pure,ui|e> a */  {
   
  var x_11797 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10203 /* hnd/ev-index */ ) {
      return $std_core_hnd._mask_at(_y_x10203, false, action);
    });
  }
  else {
    return $std_core_hnd._mask_at(x_11797, false, action);
  }
}
 
 
// monadic lift
export function _mlift_reactive_sample_11570(action, root, _y_x10206) /* forall<a> (action : () -> <kokaine/reactive/effects/signal-read,pure> a, root : kokaine/reactive/root<ui>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> a */  {
  return $std_core_hnd._mask_at(_y_x10206, false, function() {
      return $kokaine_reactive.sample(root, action);
    });
}
 
 
// Row renderers are sampled once while their live closures retain the item and
// index accessors.  Widen the handled sample back to the DOM apply row so Koka
// does not prematurely close a surrounding lifetime-scope action at `<ui>`.
export function reactive_sample(root, action) /* forall<a> (root : kokaine/reactive/root<ui>, action : () -> <kokaine/reactive/effects/signal-read,pure> a) -> <kokaine/reactive/effects/signal-write,pure,ui> a */  {
   
  var x_11802 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10206 /* hnd/ev-index */ ) {
      return _mlift_reactive_sample_11570(action, root, _y_x10206);
    });
  }
  else {
    return $std_core_hnd._mask_at(x_11802, false, function() {
        return $kokaine_reactive.sample(root, action);
      });
  }
}
 
 
// monadic lift
export function _mlift_reactive_write_ui_11571(action, _y_x10210) /* forall<a,e> (action : () -> kokaine/reactive/effects/signal-write a, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-write|e> a */  {
  return $std_core_hnd._mask_at(_y_x10210, false, function() {
      return $std_core_hnd._open_at0($std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag), action);
    });
}
 
export function reactive_write_ui(action) /* forall<a,e> (action : () -> kokaine/reactive/effects/signal-write a) -> <kokaine/reactive/effects/signal-write,pure,ui|e> a */  {
   
  var x_11808 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10210 /* hnd/ev-index */ ) {
      return _mlift_reactive_write_ui_11571(action, _y_x10210);
    });
  }
  else {
    return _mlift_reactive_write_ui_11571(action, x_11808);
  }
}
 
 
// monadic lift
export function _mlift_reactive_integration_11572(action, _y_x10215) /* forall<a,e> (action : () -> <div,exn,ui|e> a, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10215, false, action);
}
 
export function reactive_integration(action) /* forall<a,e> (action : () -> <div,exn,ui|e> a) -> <kokaine/reactive/effects/signal-write,pure,ui|e> a */  {
   
  var x_11810 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10215 /* hnd/ev-index */ ) {
      return $std_core_hnd._mask_at(_y_x10215, false, action);
    });
  }
  else {
    return $std_core_hnd._mask_at(x_11810, false, action);
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
export function _mlift_move_range_before_11573(before, first, last, parent, session, focus) /* (before : node, first : node, last : node, parent : node, session : any, focus : any) -> <ui,exn> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_move_range_before(parent, first, last, before, focus, session);
    });
  var _x48 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x48) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
 
// monadic lift
export function _mlift_move_range_before_11574(before, first, last, parent, session, wild___0) /* (before : node, first : node, last : node, parent : node, session : any, wild_@0 : ()) -> <ui,exn> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_capture_range_focus(parent, first, last);
    });
   
  var _x49 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x49) {
    var x_11822 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11822 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(focus /* any */ ) {
      return _mlift_move_range_before_11573(before, first, last, parent, session, focus);
    });
  }
  else {
    return _mlift_move_range_before_11573(before, first, last, parent, session, x_11822);
  }
}
 
 
// monadic lift
export function _mlift_move_range_before_11575(before, first, last, parent, session, _c_x10227) /* (before : node, first : node, last : node, parent : node, session : any, ()) -> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_validate_range_move_focus(parent, first, last);
    });
   
  var _x49 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x49) {
    var x_11825 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11825 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_move_range_before_11574(before, first, last, parent, session, wild___0);
    });
  }
  else {
    return _mlift_move_range_before_11574(before, first, last, parent, session, x_11825);
  }
}
 
 
// monadic lift
export function _mlift_move_range_before_11576(before, first, last, parent, session, trusted) /* (before : node, first : node, last : node, parent : node, session : any, trusted : bool) -> <ui,exn> () */  {
   
  if (trusted) {
    var x_11828 = $std_core_types.Unit;
  }
  else {
     
    var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        return dom_validate_range_move_lifecycle(parent, first, last, dom_keyed_no_session());
      });
    var _x49 = $std_core_hnd._open_none1(dom_attempt_ok, result);
    if (_x49) {
      var x_11828 = $std_core_hnd._open_none1(dom_attempt_value, result);
    }
    else {
      var x_11828 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
    }
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10227 /* () */ ) {
      return _mlift_move_range_before_11575(before, first, last, parent, session, _c_x10227);
    });
  }
  else {
    return _mlift_move_range_before_11575(before, first, last, parent, session, x_11828);
  }
}
 
 
// A row planned (validated) by `session` skips the deep lifecycle walk while
// the session is clean; focus is always re-checked because it can change
// without a DOM mutation.
export function move_range_before(parent, first, last, before, session) /* (parent : node, first : node, last : node, before : node, session : any) -> <exn,ui> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_keyed_session_trusts(session, first);
    });
   
  var _x49 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x49) {
    var x_11831 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11831 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(trusted /* bool */ ) {
      return _mlift_move_range_before_11576(before, first, last, parent, session, trusted);
    });
  }
  else {
     
    if (x_11831) {
      var x_0_11835 = $std_core_types.Unit;
    }
    else {
       
      var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_validate_range_move_lifecycle(parent, first, last, dom_keyed_no_session());
        });
      var _x49 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
      if (_x49) {
        var x_0_11835 = $std_core_hnd._open_none1(dom_attempt_value, result_0);
      }
      else {
        var x_0_11835 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
      }
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10227 /* () */ ) {
        return _mlift_move_range_before_11575(before, first, last, parent, session, _c_x10227);
      });
    }
    else {
       
      var result_1 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_validate_range_move_focus(parent, first, last);
        });
       
      var _x49 = $std_core_hnd._open_none1(dom_attempt_ok, result_1);
      if (_x49) {
        var x_1_11839 = $std_core_hnd._open_none1(dom_attempt_value, result_1);
      }
      else {
        var x_1_11839 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_1)));
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
          return _mlift_move_range_before_11574(before, first, last, parent, session, wild___0);
        });
      }
      else {
         
        var result_2 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_capture_range_focus(parent, first, last);
          });
         
        var _x49 = $std_core_hnd._open_none1(dom_attempt_ok, result_2);
        if (_x49) {
          var x_2_11843 = $std_core_hnd._open_none1(dom_attempt_value, result_2);
        }
        else {
          var x_2_11843 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_2)));
        }
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(focus /* any */ ) {
            return _mlift_move_range_before_11573(before, first, last, parent, session, focus);
          });
        }
        else {
           
          var result_3 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
              return dom_move_range_before(parent, first, last, before, x_2_11843, session);
            });
          var _x49 = $std_core_hnd._open_none1(dom_attempt_ok, result_3);
          if (_x49) {
            return $std_core_hnd._open_none1(dom_attempt_value, result_3);
          }
          else {
            return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_3)));
          }
        }
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_validate_range_move_lifecycle_11577(first, last, parent, wild__) /* (first : node, last : node, parent : node, wild_ : ()) -> <ui,exn> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_validate_range_move_focus(parent, first, last);
    });
  var _x50 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x50) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function validate_range_move_lifecycle(parent, first, last, session) /* (parent : node, first : node, last : node, session : any) -> <exn,ui> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_validate_range_move_lifecycle(parent, first, last, session);
    });
   
  var _x51 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x51) {
    var x_11849 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11849 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_validate_range_move_lifecycle_11577(first, last, parent, wild__);
    });
  }
  else {
     
    var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        return dom_validate_range_move_focus(parent, first, last);
      });
    var _x51 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
    if (_x51) {
      return $std_core_hnd._open_none1(dom_attempt_value, result_0);
    }
    else {
      return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
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
export function _mlift_register_owner_cleanup_11578(_pat_1) /* (kokaine/reactive/internal/model/cleanup-registration<ui>) -> exn () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_register_owner_cleanup_11579(value, _y_x10238) /* (value : dom-owner-registration, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10238, false, function() {
       
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
export function _mlift_register_owner_cleanup_11580(committed, wild__) /* (committed : ref<global,bool>, wild_ : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
  return $std_core_hnd._open_none2(transaction_store, committed, true);
}
 
export function register_owner_cleanup(root, value) /* (root : kokaine/reactive/root<ui>, value : dom-owner-registration) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var committed = $std_core_hnd._open_none1(transaction_cell, false);
   
  var x_11860 = $std_core_hnd._open_at2(0, function(root_0 /* kokaine/reactive/root<ui> */ , cleanup /* () -> <kokaine/reactive/effects/signal-write,pure,ui> () */ ) {
       
      var root_0_10046 = $std_core_hnd._open_none1(function(value_1 /* kokaine/reactive/root<ui> */ ) {
          return value_1;
        }, root_0);
       
      var x_0_11862 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046, cleanup);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_register_owner_cleanup_11578);
      }
      else {
        return $std_core_types.Unit;
      }
    }, root, function() {
       
      var x_1_11864 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10238 /* hnd/ev-index */ ) {
          return _mlift_register_owner_cleanup_11579(value, _y_x10238);
        });
      }
      else {
        return _mlift_register_owner_cleanup_11579(value, x_1_11864);
      }
    });
  if ($std_core_hnd._yielding()) {
    var _x56 = $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return $std_core_hnd._open_none2(transaction_store, committed, true);
    });
  }
  else {
    var _x56 = $std_core_hnd._open_none2(transaction_store, committed, true);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x54 = $std_core_hnd._open_none1(transaction_load, committed);
      if (_x54) {
        return $std_core_types.Unit;
      }
      else {
        return $std_core_hnd._open_at1(0, function(value_0 /* dom-owner-registration */ ) {
             
            var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
                return dom_retire_owners(value_0);
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
export function _mlift_record_owner_11581(root, registered) /* (root : kokaine/reactive/root<ui>, registered : dom-owner-registration) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
  return register_owner_cleanup(root, registered);
}
 
 
// monadic lift
export function _mlift_record_owner_11582(_y_x10244) /* (kokaine/reactive/integration/internal/reentry/reentry<ui>) -> exn kokaine/reactive/integration/reentry<ui> */  {
  return _y_x10244;
}
 
 
// monadic lift
export function _mlift_record_owner_11583(root, value, portal) /* (root : kokaine/reactive/root<ui>, value : node, portal : kokaine/reactive/integration/reentry<ui>) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var x_11868 = $std_core_hnd._open_at1(0, dom_attempt, function() {
      return dom_record_owner(value, root, portal);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(registered /* dom-owner-registration */ ) {
      return register_owner_cleanup(root, registered);
    });
  }
  else {
    return register_owner_cleanup(root, x_11868);
  }
}
 
export function record_owner(root, value) /* (root : kokaine/reactive/root<ui>, value : node) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var x_11872 = $std_core_hnd._open_at1(0, function(root_0 /* kokaine/reactive/root<ui> */ ) {
       
      var x_0_11875 = $kokaine_reactive_integration_internal_reentry.capture_reentry($std_core_hnd._open_none1(function(value_0 /* kokaine/reactive/root<ui> */ ) {
          return value_0;
        }, root_0));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_record_owner_11582);
      }
      else {
        return x_0_11875;
      }
    }, root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(portal /* kokaine/reactive/integration/reentry<ui> */ ) {
      return _mlift_record_owner_11583(root, value, portal);
    });
  }
  else {
     
    var x_1_11877 = $std_core_hnd._open_at1(0, dom_attempt, function() {
        return dom_record_owner(value, root, x_11872);
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(registered /* dom-owner-registration */ ) {
        return register_owner_cleanup(root, registered);
      });
    }
    else {
      return register_owner_cleanup(root, x_1_11877);
    }
  }
}
 
 
// monadic lift
export function _mlift_find_owner_11584(found) /* (found : any) -> <ui,exn> owner-match */  {
  var _x57 = $std_core_hnd._open_none1(dom_owner_state, found);
  if (_x57 === 0) {
    return Owner_none;
  }
  else if (_x57 === 1) {
     
    var _x_x1_0_11088 = $std_core_hnd._open_none1(dom_owner_portal, found);
    return Owner_live($std_core_hnd._open_none1(any_reentry, _x_x1_0_11088));
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
    var x_11882 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11882 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_find_owner_11584);
  }
  else {
    var _x58 = $std_core_hnd._open_none1(dom_owner_state, x_11882);
    if (_x58 === 0) {
      return Owner_none;
    }
    else if (_x58 === 1) {
       
      var _x_x1_0_11088 = $std_core_hnd._open_none1(dom_owner_portal, x_11882);
      return Owner_live($std_core_hnd._open_none1(any_reentry, _x_x1_0_11088));
    }
    else {
      return Owner_retired;
    }
  }
}
 
 
// monadic lift
export function _mlift_insert_html_11585(root, _c_x10254) /* (root : kokaine/reactive/root<ui>, dom-owner-registration) -> () */  {
  return register_owner_cleanup(root, _c_x10254);
}
 
 
// monadic lift
export function _mlift_insert_html_11586(_y_x10250) /* (kokaine/reactive/integration/internal/reentry/reentry<ui>) -> exn kokaine/reactive/integration/reentry<ui> */  {
  return _y_x10250;
}
 
 
// monadic lift
export function _mlift_insert_html_11587(before, content, parent, root, portal) /* (before : maybe<node>, content : string, parent : node, root : kokaine/reactive/root<ui>, portal : kokaine/reactive/integration/reentry<ui>) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
   
  if (before === null) {
    var x_11886 = $std_core_hnd._open_at1(0, dom_attempt, function() {
        return dom_append_html(parent, content, root, portal);
      });
  }
  else {
    var x_11886 = $std_core_hnd._open_at1(0, dom_attempt, function() {
        return dom_insert_html_before(parent, before.value, content, root, portal);
      });
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10254 /* dom-owner-registration */ ) {
      return register_owner_cleanup(root, _c_x10254);
    });
  }
  else {
    return register_owner_cleanup(root, x_11886);
  }
}
 
export function insert_html(root, parent, before, content) /* (root : kokaine/reactive/root<ui>, parent : node, before : maybe<node>, content : string) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var x_11890 = $std_core_hnd._open_at1(0, function(root_0 /* kokaine/reactive/root<ui> */ ) {
       
      var x_0_11893 = $kokaine_reactive_integration_internal_reentry.capture_reentry($std_core_hnd._open_none1(function(value /* kokaine/reactive/root<ui> */ ) {
          return value;
        }, root_0));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_insert_html_11586);
      }
      else {
        return x_0_11893;
      }
    }, root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(portal /* kokaine/reactive/integration/reentry<ui> */ ) {
      return _mlift_insert_html_11587(before, content, parent, root, portal);
    });
  }
  else {
     
    if (before === null) {
      var x_1_11895 = $std_core_hnd._open_at1(0, dom_attempt, function() {
          return dom_append_html(parent, content, root, x_11890);
        });
    }
    else {
      var x_1_11895 = $std_core_hnd._open_at1(0, dom_attempt, function() {
          return dom_insert_html_before(parent, before.value, content, root, x_11890);
        });
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10254 /* dom-owner-registration */ ) {
        return register_owner_cleanup(root, _c_x10254);
      });
    }
    else {
      return register_owner_cleanup(root, x_1_11895);
    }
  }
}
 
export function dom_check(failure) /* (failure : any) -> exn () */  {
  var _x59 = $std_core_hnd._open_none1(any_is_null, failure);
  if (_x59) {
    return $std_core_types.Unit;
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(any_string, failure)));
  }
}
 
export function set_text(target, content) /* (target : node, content : string) -> <exn,ui> () */  {
   
  var failure_10039 = $std_core_hnd._open_none2(dom_try_set_text, target, content);
  var _x60 = $std_core_hnd._open_none1(any_is_null, failure_10039);
  if (_x60) {
    return $std_core_types.Unit;
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(any_string, failure_10039)));
  }
}
 
 
// A name is fixed for the lifetime of a binding, so live bindings classify it
// once (`valid`, and whether it is a URL attribute) and pass the result to
// every update. The value is still URL-checked on every update.
export function set_classified_attribute(value, name, valid, url, content) /* (value : element, name : string, valid : bool, url : bool, content : maybe<string>) -> <exn,ui> () */  {
  var _x61 = $std_core_hnd._open_none1(function(b /* bool */ ) {
      return (b) ? false : true;
    }, valid);
  if (_x61) {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("invalid HTML attribute name: ", name));
  }
  else {
    if (content === null) {
       
      var failure_10040 = $std_core_hnd._open_none2(dom_try_remove_attribute, value, name);
      var _x62 = $std_core_hnd._open_none1(any_is_null, failure_10040);
      if (_x62) {
        return $std_core_types.Unit;
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(any_string, failure_10040)));
      }
    }
    else {
      if (url) {
         
        var _x_x1_3_11105 = $std_core_hnd._open_none2($kokaine_html.is_safe_url_value, name, content.value);
        var _x63 = $std_core_hnd._open_none1(function(b_0 /* bool */ ) {
            return (b_0) ? false : true;
          }, _x_x1_3_11105);
        if (_x63) {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("unsafe URL scheme in ", $std_core_types._lp__plus__plus__rp_(name, $std_core_types._lp__plus__plus__rp_("; allowed are relative, http(s), mailto, tel, and data:image for src ", "(use unsafe-trusted-url for an application-produced URL)"))));
        }
        else {
           
          var failure_0_10041 = $std_core_hnd._open_none3(dom_try_set_attribute, value, name, content.value);
          var _x64 = $std_core_hnd._open_none1(any_is_null, failure_0_10041);
          if (_x64) {
            return $std_core_types.Unit;
          }
          else {
            return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(any_string, failure_0_10041)));
          }
        }
      }
      else {
         
        var failure_1_10042 = $std_core_hnd._open_none3(dom_try_set_attribute, value, name, content.value);
        var _x65 = $std_core_hnd._open_none1(any_is_null, failure_1_10042);
        if (_x65) {
          return $std_core_types.Unit;
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(any_string, failure_1_10042)));
        }
      }
    }
  }
}
 
export function set_attribute(value, name, content) /* (value : element, name : string, content : maybe<string>) -> <exn,ui> () */  {
  return set_classified_attribute(value, name, $std_core_hnd._open_none1($kokaine_html.is_valid_attribute_name, name), $std_core_hnd._open_none1($kokaine_html.is_url_attribute, name), content);
}
 
export function set_trusted_url(value, name, url) /* (value : element, name : string, url : kokaine/html/trusted-url) -> <exn,ui> () */  {
   
  var _x_x1_11120 = $std_core_hnd._open_none1($kokaine_html.is_valid_attribute_name, name);
  var _x66 = $std_core_hnd._open_none1(function(b /* bool */ ) {
      return (b) ? false : true;
    }, _x_x1_11120);
  if (_x66) {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("invalid HTML attribute name: ", name));
  }
  else {
     
    var _x_x3_11124 = $std_core_hnd._open_none1(function(value_0 /* kokaine/html/trusted-url */ ) {
        return value_0;
      }, url);
     
    var failure_10043 = $std_core_hnd._open_none3(dom_try_set_attribute, value, name, _x_x3_11124);
    var _x67 = $std_core_hnd._open_none1(any_is_null, failure_10043);
    if (_x67) {
      return $std_core_types.Unit;
    }
    else {
      return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(any_string, failure_10043)));
    }
  }
}
 
export function set_classified_property(value, name, valid, url, content) /* (value : element, name : string, valid : bool, url : bool, content : kokaine/html/property-value) -> <exn,ui> () */  {
  var _x68 = $std_core_hnd._open_none1(function(b /* bool */ ) {
      return (b) ? false : true;
    }, valid);
  if (_x68) {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("invalid or markup-writing DOM property: ", name));
  }
  else {
    if (content._tag === 1) {
      if (url) {
         
        var _x_x1_0_11129 = $std_core_hnd._open_none2($kokaine_html.is_safe_url_value, name, content.value);
        var _x69 = $std_core_hnd._open_none1(function(b_0 /* bool */ ) {
            return (b_0) ? false : true;
          }, _x_x1_0_11129);
        if (_x69) {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("unsafe URL scheme in ", $std_core_types._lp__plus__plus__rp_(name, $std_core_types._lp__plus__plus__rp_("; allowed are relative, http(s), mailto, tel, and data:image for src ", "(use unsafe-trusted-url for an application-produced URL)"))));
        }
        else {
           
          var _x_x3_11134 = $std_core_hnd._open_none1(string_any, content.value);
           
          var failure_10044 = $std_core_hnd._open_none3(dom_try_set_property, value, name, _x_x3_11134);
          var _x70 = $std_core_hnd._open_none1(any_is_null, failure_10044);
          if (_x70) {
            return $std_core_types.Unit;
          }
          else {
            return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(any_string, failure_10044)));
          }
        }
      }
      else {
         
        var _x_x3_0_11140 = $std_core_hnd._open_none1(string_any, content.value);
         
        var failure_0_10045 = $std_core_hnd._open_none3(dom_try_set_property, value, name, _x_x3_0_11140);
        var _x71 = $std_core_hnd._open_none1(any_is_null, failure_0_10045);
        if (_x71) {
          return $std_core_types.Unit;
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(any_string, failure_0_10045)));
        }
      }
    }
    else if (content._tag === 2) {
       
      var _x_x3_1_11146 = $std_core_hnd._open_none1(bool_any, content.value);
       
      var failure_1_10046 = $std_core_hnd._open_none3(dom_try_set_property, value, name, _x_x3_1_11146);
      var _x72 = $std_core_hnd._open_none1(any_is_null, failure_1_10046);
      if (_x72) {
        return $std_core_types.Unit;
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(any_string, failure_1_10046)));
      }
    }
    else {
       
      var _x_x1_15_11153 = $std_core_int.show(content.value);
       
      var _x_x3_2_11152 = $std_core_hnd._open_none1(int_string_any, _x_x1_15_11153);
       
      var failure_2_10047 = $std_core_hnd._open_none3(dom_try_set_property, value, name, _x_x3_2_11152);
      var _x73 = $std_core_hnd._open_none1(any_is_null, failure_2_10047);
      if (_x73) {
        return $std_core_types.Unit;
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(any_string, failure_2_10047)));
      }
    }
  }
}
 
export function set_property(value, name, content) /* (value : element, name : string, content : kokaine/html/property-value) -> <exn,ui> () */  {
  return set_classified_property(value, name, $std_core_hnd._open_none1($kokaine_html.is_valid_property_name, name), $std_core_hnd._open_none1($kokaine_html.is_url_attribute, name), content);
}
 
export function snapshot(value) /* (value : raw-event) -> <exn,ui> kokaine/html/event */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return $kokaine_html.Event(raw_event_value(value), raw_event_checked(value), raw_event_key(value), raw_event_any(value));
    });
  var _x74 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x74) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function gate_is_live(gate) /* (gate : ref<global,listener-gate>) -> bool */  {
  var _x75 = transaction_load(gate);
  if (_x75._tag === 1) {
    return true;
  }
  else if (_x75._tag === 2) {
    var _x76 = $kokaine_reactive_integration_event.event_load(_x75.gate_continuation);
    return (_x76 !== null);
  }
  else {
    return false;
  }
}
 
export function close_gate(gate) /* (gate : ref<global,listener-gate>) -> () */  {
   
  var current = transaction_load(gate);
   
  transaction_store(gate, Gate_closed);
  if (current._tag === 2) {
    return $kokaine_reactive_integration_event.event_store(current.gate_continuation, $kokaine_reactive_integration_event.Event_retired);
  }
  else {
    return $std_core_types.Unit;
  }
}
 
 
// monadic lift
export function _mlift_resume_gate_11588(_pat_1) /* (bool) -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui,pure|kokaine/async/effects/async> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_resume_gate_11589(_pat_3) /* (bool) -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui,pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_resume_gate_11590(gate, value, continuation_0) /* (gate : ref<global,listener-gate>, value : kokaine/html/event, continuation@0 : kokaine/reactive/integration/event/event-continuation<<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue>,kokaine/html/event>) -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui,pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue> () */  {
   
  $std_core_hnd._open_none2(transaction_store, gate, Gate_captured(continuation_0));
   
  var x_11901 = $kokaine_reactive_integration_event.event_continuation_fs_resume(continuation_0, value);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_resume_gate_11589);
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function resume_gate(gate, action, value) /* (gate : ref<global,listener-gate>, action : kokaine/html/callback, value : kokaine/html/event) -> <pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui> () */  {
  var _x77 = $std_core_hnd._open_none1(transaction_load, gate);
  if (_x77._tag === 3) {
    return $std_core_types.Unit;
  }
  else if (_x77._tag === 2) {
     
    var x_11903 = $kokaine_reactive_integration_event.event_continuation_fs_resume(_x77.gate_continuation, value);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(_mlift_resume_gate_11588);
    }
    else {
      return $std_core_types.Unit;
    }
  }
  else {
     
    var x_0_11906 = $kokaine_reactive_integration_event.capture_event(action);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(continuation_0 /* kokaine/reactive/integration/event/event-continuation<<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue>,kokaine/html/event> */ ) {
        return _mlift_resume_gate_11590(gate, value, continuation_0);
      });
    }
    else {
       
      $std_core_hnd._open_none2(transaction_store, gate, Gate_captured(x_0_11906));
       
      var x_1_11909 = $kokaine_reactive_integration_event.event_continuation_fs_resume(x_0_11906, value);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_resume_gate_11589);
      }
      else {
        return $std_core_types.Unit;
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_invoke_event_11591(action, gate, portal, root, captured) /* (action : kokaine/html/callback, gate : ref<global,listener-gate>, portal : kokaine/reactive/integration/reentry<ui>, root : kokaine/reactive/root<ui>, captured : kokaine/html/event) -> <exn,ui> () */  {
  var _x78 = $std_core_hnd._open_none1(gate_is_live, gate);
  if (_x78) {
    return $kokaine_reactive_integration_internal_reentry.run_reentry($std_core_hnd._open_none1(function(value_0_0 /* kokaine/reactive/integration/reentry<ui> */ ) {
          return value_0_0;
        }, portal), function() {
        return $kokaine_reactive_async.run_async(root, function() {
            return resume_gate(gate, action, captured);
          });
      });
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function invoke_event(root, portal, gate, action, value) /* (root : kokaine/reactive/root<ui>, portal : kokaine/reactive/integration/reentry<ui>, gate : ref<global,listener-gate>, action : kokaine/html/callback, value : raw-event) -> ui () */  {
  return $std_core_exn.exn_fs__handle($std_core_exn._Hnd_exn(0, function(m /* hnd/marker<ui,()> */ , ___wildcard_x654__16 /* hnd/ev<exn> */ , x /* exception */ ) {
        return $std_core_hnd.yield_to_final(m, function(___wildcard_x654__45 /* (hnd/resume-result<10004,()>) -> ui () */ ) {
            var _x79 = x.message;
            return dom_report_error($std_core_types._lp__plus__plus__rp_("uncaught Kokaine event exception: ", _x79));
          });
      }), function(_res /* () */ ) {
      return _res;
    }, function() {
      var _x80 = $std_core_hnd._open_none1(gate_is_live, gate);
      if (_x80) {
         
        var x_0_11913 = snapshot(value);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(captured /* kokaine/html/event */ ) {
            return _mlift_invoke_event_11591(action, gate, portal, root, captured);
          });
        }
        else {
          return _mlift_invoke_event_11591(action, gate, portal, root, x_0_11913);
        }
      }
      else {
        return $std_core_types.Unit;
      }
    });
}
 
export function retire_event_listener(target, name, gate, listener) /* (target : element, name : string, gate : ref<global,listener-gate>, listener : ref<global,maybe<dom-listener>>) -> <exn,ui> () */  {
  return $std_core_hnd.finally_prompt(function() {
      var _x81 = $std_core_hnd._open_none1(transaction_load, listener);
      if (_x81 === null) {
        return $std_core_types.Unit;
      }
      else {
         
        $std_core_hnd._open_none2(transaction_store, listener, $std_core_types.Nothing);
         
        $std_core_hnd._open_none1(dom_retire_listener, _x81.value);
         
        var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_unlisten(target, name, _x81.value);
          });
        var _x82 = $std_core_hnd._open_none1(dom_attempt_ok, result);
        if (_x82) {
          return $std_core_hnd._open_none1(dom_attempt_value, result);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
        }
      }
    }, $std_core_hnd._open_none1(function(gate_0 /* ref<global,listener-gate> */ ) {
         
        var current = transaction_load(gate_0);
         
        transaction_store(gate_0, Gate_closed);
        if (current._tag === 2) {
          return $kokaine_reactive_integration_event.event_store(current.gate_continuation, $kokaine_reactive_integration_event.Event_retired);
        }
        else {
          return $std_core_types.Unit;
        }
      }, gate));
}
 
 
// monadic lift
export function _mlift_install_event_listener_11592(gate, listener, name, target, _y_x10314) /* (gate : ref<global,listener-gate>, listener : ref<global,maybe<dom-listener>>, name : string, target : element, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10314, false, function() {
      return retire_event_listener(target, name, gate, listener);
    });
}
 
 
// monadic lift
export function _mlift_install_event_listener_11593(committed, _pat_1) /* (committed : ref<global,bool>, kokaine/reactive/internal/model/cleanup-registration<ui>) -> exn () */  {
  return $std_core_hnd._open_none2(transaction_store, committed, true);
}
 
 
// monadic lift
export function _mlift_install_event_listener_11594(committed, gate, listener, name, root, target, installed) /* (committed : ref<global,bool>, gate : ref<global,listener-gate>, listener : ref<global,maybe<dom-listener>>, name : string, root : kokaine/reactive/root<ui>, target : element, installed : dom-listener) -> <ui,exn> () */  {
   
  $std_core_hnd._open_none2(transaction_store, listener, $std_core_types.Just(installed));
   
  var root_0_10046 = $std_core_hnd._open_none1(function(value_1 /* kokaine/reactive/root<ui> */ ) {
      return value_1;
    }, root);
   
  var x_11919 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046, function() {
       
      var x_0_11921 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10314 /* hnd/ev-index */ ) {
          return _mlift_install_event_listener_11592(gate, listener, name, target, _y_x10314);
        });
      }
      else {
        return _mlift_install_event_listener_11592(gate, listener, name, target, x_0_11921);
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_pat_1_0 /* kokaine/reactive/internal/model/cleanup-registration<ui> */ ) {
      return $std_core_hnd._open_none2(transaction_store, committed, true);
    });
  }
  else {
    return $std_core_hnd._open_none2(transaction_store, committed, true);
  }
}
 
 
// monadic lift
export function _mlift_install_event_listener_11595(action, gate, name, root, target, _y_x10310) /* (action : kokaine/html/callback, gate : ref<global,listener-gate>, name : string, root : kokaine/reactive/root<ui>, target : element, kokaine/reactive/integration/internal/reentry/reentry<ui>) -> exn () */  {
   
  var listener = $std_core_hnd._open_none1(transaction_cell, $std_core_types.Nothing);
   
  var committed = $std_core_hnd._open_none1(transaction_cell, false);
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_listen(target, name, function(value_0 /* raw-event */ ) {
          return invoke_event(root, _y_x10310, gate, action, value_0);
        });
    });
   
  var _x83 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x83) {
    var x_11927 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11927 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    var _x84 = $std_core_hnd.yield_extend(function(installed /* dom-listener */ ) {
      return _mlift_install_event_listener_11594(committed, gate, listener, name, root, target, installed);
    });
  }
  else {
    var _x84 = _mlift_install_event_listener_11594(committed, gate, listener, name, root, target, x_11927);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x83 = $std_core_hnd._open_none1(transaction_load, committed);
      if (_x83) {
        return $std_core_types.Unit;
      }
      else {
        return retire_event_listener(target, name, gate, listener);
      }
    }, _x84);
}
 
export function install_event_listener(root, target, name, action) /* (root : kokaine/reactive/root<ui>, target : element, name : string, action : kokaine/html/callback) -> <exn,ui> () */  {
   
  var gate = $std_core_hnd._open_none1(transaction_cell, Gate_pending);
   
  var x_11930 = $kokaine_reactive_integration_internal_reentry.capture_reentry($std_core_hnd._open_none1(function(value /* kokaine/reactive/root<ui> */ ) {
      return value;
    }, root));
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10310 /* kokaine/reactive/integration/internal/reentry/reentry<ui> */ ) {
      return _mlift_install_event_listener_11595(action, gate, name, root, target, _y_x10310);
    });
  }
  else {
     
    var listener = $std_core_hnd._open_none1(transaction_cell, $std_core_types.Nothing);
     
    var committed = $std_core_hnd._open_none1(transaction_cell, false);
     
    var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        return dom_listen(target, name, function(value_0 /* raw-event */ ) {
            return invoke_event(root, x_11930, gate, action, value_0);
          });
      });
     
    var _x85 = $std_core_hnd._open_none1(dom_attempt_ok, result);
    if (_x85) {
      var x_0_11935 = $std_core_hnd._open_none1(dom_attempt_value, result);
    }
    else {
      var x_0_11935 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
    }
    if ($std_core_hnd._yielding()) {
      var _x86 = $std_core_hnd.yield_extend(function(installed /* dom-listener */ ) {
        return _mlift_install_event_listener_11594(committed, gate, listener, name, root, target, installed);
      });
    }
    else {
      var _x86 = _mlift_install_event_listener_11594(committed, gate, listener, name, root, target, x_0_11935);
    }
    return $std_core_hnd.finally_prompt(function() {
        var _x85 = $std_core_hnd._open_none1(transaction_load, committed);
        if (_x85) {
          return $std_core_types.Unit;
        }
        else {
          return retire_event_listener(target, name, gate, listener);
        }
      }, _x86);
  }
}
 
 
// monadic lift
export function _mlift_mount_attribute_11596(read, _y_x10326) /* (read : () -> kokaine/reactive/effects/signal-read maybe<string>, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-read> maybe<string> */  {
  return $std_core_hnd._mask_at(_y_x10326, false, read);
}
 
 
// monadic lift
export function _mlift_mount_attribute_11597(name_3, target, url_0, valid, value_1_0, _y_x10329) /* (name@3 : string, target : element, url@0 : bool, valid : bool, value@1@0 : maybe<string>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10329, false, function() {
      return set_classified_attribute(target, name_3, valid, url_0, value_1_0);
    });
}
 
 
// monadic lift
export function _mlift_mount_attribute_11598(_y_x10333) /* (kokaine/reactive/disposer<ui>) -> <kokaine/reactive/effects/signal-write,pure> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_attribute_11599(read_0_0, _y_x10334) /* (read@0@0 : () -> kokaine/reactive/effects/signal-read kokaine/html/property-value, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-read> kokaine/html/property-value */  {
  return $std_core_hnd._mask_at(_y_x10334, false, read_0_0);
}
 
 
// monadic lift
export function _mlift_mount_attribute_11600(name_4, target, url_1, valid_0, value_2, _y_x10337) /* (name@4 : string, target : element, url@1 : bool, valid@0 : bool, value@2 : kokaine/html/property-value, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10337, false, function() {
      return set_classified_property(target, name_4, valid_0, url_1, value_2);
    });
}
 
 
// monadic lift
export function _mlift_mount_attribute_11601(_y_x10341) /* (kokaine/reactive/disposer<ui>) -> <kokaine/reactive/effects/signal-write,pure> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_attribute_11602(action_1, name_5, root, target, _y_x10344) /* (action@1 : kokaine/html/callback, name@5 : string, root : kokaine/reactive/root<ui>, target : element, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10344, false, function() {
      return install_event_listener(root, target, name_5, action_1);
    });
}
 
 
// monadic lift
export function _mlift_mount_attribute_11603(action_1, name_5, root, target, _c_x10343) /* (action@1 : kokaine/html/callback, name@5 : string, root : kokaine/reactive/root<ui>, target : element, ()) -> () */  {
   
  var x_11943 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10344 /* hnd/ev-index */ ) {
      return _mlift_mount_attribute_11602(action_1, name_5, root, target, _y_x10344);
    });
  }
  else {
    return _mlift_mount_attribute_11602(action_1, name_5, root, target, x_11943);
  }
}
 
export function mount_attribute(root, target, attribute) /* forall<e> (root : kokaine/reactive/root<ui>, target : element, attribute : kokaine/html/attribute<e>) -> <kokaine/reactive/effects/signal-write,ui,pure> () */  {
  if (attribute._tag === 1) {
    return $std_core_hnd._open_at3(0, function(value_0 /* element */ , name_0 /* string */ , content /* maybe<string> */ ) {
        return set_classified_attribute(value_0, name_0, $std_core_hnd._open_none1($kokaine_html.is_valid_attribute_name, name_0), $std_core_hnd._open_none1($kokaine_html.is_url_attribute, name_0), content);
      }, target, attribute.name, $std_core_types.Just(attribute.value));
  }
  else if (attribute._tag === 7) {
    return $std_core_hnd._open_at3(0, set_trusted_url, target, attribute.name, attribute.url);
  }
  else if (attribute._tag === 2) {
    if (attribute.enabled) {
      var _x87 = $std_core_types.Just("");
    }
    else {
      var _x87 = $std_core_types.Nothing;
    }
    return $std_core_hnd._open_at3(0, function(value_1 /* element */ , name_2 /* string */ , content_0 /* maybe<string> */ ) {
        return set_classified_attribute(value_1, name_2, $std_core_hnd._open_none1($kokaine_html.is_valid_attribute_name, name_2), $std_core_hnd._open_none1($kokaine_html.is_url_attribute, name_2), content_0);
      }, target, attribute.name, _x87);
  }
  else if (attribute._tag === 3) {
    return $std_core_hnd._open_at3(0, set_property, target, attribute.name, attribute.value);
  }
  else if (attribute._tag === 4) {
     
    var valid = $std_core_hnd._open_none1($kokaine_html.is_valid_attribute_name, attribute.name);
     
    var url_0 = $std_core_hnd._open_none1($kokaine_html.is_url_attribute, attribute.name);
     
    var x_11945 = $kokaine_reactive.create_effect(root, function() {
         
        var x_0_11948 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10326 /* hnd/ev-index */ ) {
            return $std_core_hnd._mask_at(_y_x10326, false, attribute.read);
          });
        }
        else {
          return $std_core_hnd._mask_at(x_0_11948, false, attribute.read);
        }
      }, function(value_1_0 /* maybe<string> */ ) {
         
        var x_1_11950 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10329 /* hnd/ev-index */ ) {
            return _mlift_mount_attribute_11597(attribute.name, target, url_0, valid, value_1_0, _y_x10329);
          });
        }
        else {
          return _mlift_mount_attribute_11597(attribute.name, target, url_0, valid, value_1_0, x_1_11950);
        }
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(_mlift_mount_attribute_11598);
    }
    else {
      return $std_core_types.Unit;
    }
  }
  else if (attribute._tag === 5) {
     
    var valid_0 = $std_core_hnd._open_none1($kokaine_html.is_valid_property_name, attribute.name);
     
    var url_1 = $std_core_hnd._open_none1($kokaine_html.is_url_attribute, attribute.name);
     
    var x_2_11952 = $kokaine_reactive.create_effect(root, function() {
         
        var x_3_11955 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10334 /* hnd/ev-index */ ) {
            return $std_core_hnd._mask_at(_y_x10334, false, attribute.read);
          });
        }
        else {
          return $std_core_hnd._mask_at(x_3_11955, false, attribute.read);
        }
      }, function(value_2 /* kokaine/html/property-value */ ) {
         
        var x_4_11957 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10337 /* hnd/ev-index */ ) {
            return _mlift_mount_attribute_11600(attribute.name, target, url_1, valid_0, value_2, _y_x10337);
          });
        }
        else {
          return _mlift_mount_attribute_11600(attribute.name, target, url_1, valid_0, value_2, x_4_11957);
        }
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(_mlift_mount_attribute_11601);
    }
    else {
      return $std_core_types.Unit;
    }
  }
  else {
     
    var _x_x1_11_11199 = $std_core_hnd._open_none1($kokaine_html.is_valid_event_name, attribute.name);
     
    var _x88 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_11_11199);
    if (_x88) {
       
      var _x_x1_13_11201 = $std_core_types._lp__plus__plus__rp_("invalid DOM event name: ", attribute.name);
      var x_5_11959 = $std_core_hnd._open_at2(0, $std_core_exn.$throw, _x_x1_13_11201);
    }
    else {
      var x_5_11959 = $std_core_types.Unit;
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10343 /* () */ ) {
        return _mlift_mount_attribute_11603(attribute.action, attribute.name, root, target, _c_x10343);
      });
    }
    else {
       
      var x_6_11962 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10344 /* hnd/ev-index */ ) {
          return _mlift_mount_attribute_11602(attribute.action, attribute.name, root, target, _y_x10344);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_6_11962, false, function() {
            return install_event_listener(root, target, attribute.name, attribute.action);
          });
      }
    }
  }
}
 
export function throw_keyed_row_failure(failure) /* (failure : ref<global,error<()>>) -> exn () */  {
  return $std_core_exn.untry($std_core_hnd._open_none1(transaction_load, failure));
}
 
 
// monadic lift
export function _mlift_run_keyed_row_actions_11604(failure, wild__) /* forall<e> (failure : ref<global,error<()>>, wild_ : ()) -> <exn|e> () */  {
  return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(failure_0 /* ref<global,error<()>> */ ) {
      return $std_core_exn.untry($std_core_hnd._open_none1(transaction_load, failure_0));
    }, failure);
}
 
 
// monadic lift
export function _mlift_run_keyed_row_actions_11605(completed, _c_x10357) /* (completed : ref<global,bool>, ()) -> () */  {
  return transaction_store(completed, true);
}
 
 
// monadic lift
export function _mlift_run_keyed_row_actions_11606(completed_0, failure_1, previous, _y_x10356) /* forall<e> (completed : ref<global,bool>, failure : ref<global,error<()>>, previous : error<()>, error<()>) -> e () */  {
   
  if (_y_x10356._tag === 1) {
    var x_11966 = transaction_store(failure_1, $std_core_types.$Error(_y_x10356.error));
  }
  else {
    var x_11966 = transaction_store(failure_1, previous);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10357_0 /* () */ ) {
      return _mlift_run_keyed_row_actions_11605(completed_0, _c_x10357_0);
    });
  }
  else {
    return _mlift_run_keyed_row_actions_11605(completed_0, x_11966);
  }
}
 
 
// monadic lift
export function _mlift_run_keyed_row_actions_11607(action, completed_1, failure_2, row, _y_x10354) /* forall<a,b,e,e1> (action : (keyed-row<e,a,b>) -> <exn|e1> (), completed : ref<global,bool>, failure : ref<global,error<()>>, row : keyed-row<e,a,b>, hnd/ev-index) -> <exn|e1> () */  {
  return $std_core_hnd._mask_at(_y_x10354, false, function() {
       
      var previous_0 = transaction_load(failure_2);
       
      transaction_store(failure_2, $std_core_types.Ok($std_core_types.Unit));
       
      var x_0_11968 = $kokaine_internal_compat.capture_error(function() {
        return action(row);
      });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10356_0 /* error<()> */ ) {
          return _mlift_run_keyed_row_actions_11606(completed_1, failure_2, previous_0, _y_x10356_0);
        });
      }
      else {
        return _mlift_run_keyed_row_actions_11606(completed_1, failure_2, previous_0, x_0_11968);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_keyed_row_actions_11608(action_0, failure_3, rest, wild___2) /* forall<a,b,e,e1> (action : (keyed-row<e,a,b>) -> <exn|e1> (), failure : ref<global,error<()>>, rest : list<keyed-row<e,a,b>>, wild_@2 : ()) -> <exn|e1> () */  {
  return run_keyed_row_actions(rest, action_0, failure_3);
}
 
export function run_keyed_row_actions(rows, action_1, failure_4) /* forall<a,b,e,e1> (rows : list<keyed-row<e,a,b>>, action : (keyed-row<e,a,b>) -> <exn|e1> (), failure : ref<global,error<()>>) -> <exn|e1> () */  { tailcall: while(1)
{
  if (rows === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var completed_2 = $std_core_hnd._open_none1(transaction_cell, false);
     
    var x_3_11977 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
     
    if ($std_core_hnd._yielding()) {
      var _x89 = $std_core_hnd.yield_extend(function(_y_x10354_0 /* hnd/ev-index */ ) {
        return _mlift_run_keyed_row_actions_11607(action_1, completed_2, failure_4, rows.head, _y_x10354_0);
      });
    }
    else {
      var _x89 = _mlift_run_keyed_row_actions_11607(action_1, completed_2, failure_4, rows.head, x_3_11977);
    }
    var x_1_11970 = $std_core_hnd.finally_prompt(function() {
        var _x88 = $std_core_hnd._open_none1(transaction_load, completed_2);
        if (_x88) {
          return $std_core_types.Unit;
        }
        else {
           
          var x_2_11975 = run_keyed_row_actions(rows.tail, action_1, failure_4);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
              return _mlift_run_keyed_row_actions_11604(failure_4, wild___0);
            });
          }
          else {
            return _mlift_run_keyed_row_actions_11604(failure_4, x_2_11975);
          }
        }
      }, _x89);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___2_0 /* () */ ) {
        return _mlift_run_keyed_row_actions_11608(action_1, failure_4, rows.tail, wild___2_0);
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
export function _mlift_exhaust_keyed_row_actions_11609(failure, wild__) /* forall<e> (failure : ref<global,error<()>>, wild_ : ()) -> <exn|e> () */  {
  return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(failure_0 /* ref<global,error<()>> */ ) {
      return $std_core_exn.untry($std_core_hnd._open_none1(transaction_load, failure_0));
    }, failure);
}
 
export function exhaust_keyed_row_actions(rows, action) /* forall<a,b,e,e1> (rows : list<keyed-row<e,a,b>>, action : (keyed-row<e,a,b>) -> <exn|e1> ()) -> <exn|e1> () */  {
   
  var failure = $std_core_hnd._open_none1(transaction_cell, $std_core_types.Ok($std_core_types.Unit));
   
  var x_11979 = run_keyed_row_actions(rows, action, failure);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(failure_0_0 /* ref<global,error<()>> */ ) {
          return $std_core_exn.untry($std_core_hnd._open_none1(transaction_load, failure_0_0));
        }, failure);
    });
  }
  else {
    return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(failure_0_1 /* ref<global,error<()>> */ ) {
        return $std_core_exn.untry($std_core_hnd._open_none1(transaction_load, failure_0_1));
      }, failure);
  }
}
 
export function dispose_keyed_rows(rows) /* forall<a,b,e> (rows : list<keyed-row<e,a,b>>) -> <ui,exn> () */  {
  return exhaust_keyed_row_actions(rows, function(row /* keyed-row<6587,6585,6586> */ ) {
       
      var scope_10064 = $std_core_hnd._open_none1(function(_this /* keyed-row<6587,6585,6586> */ ) {
          return _this.row_scope;
        }, row);
      return $kokaine_reactive_integration_internal_lifetime_dash_scope.lifetime_scope_fs_dispose($std_core_hnd._open_none1(function(value /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
          return value;
        }, scope_10064));
    });
}
 
 
// monadic lift
export function _mlift_rebuild_keyed_order_11610(last, parent, row, session, next) /* forall<a,b,e> (last : node, parent : node, row : keyed-row<e,a,b>, session : any, next : node) -> <ui,exn> () */  {
  var _x88 = $std_core_hnd._open_none2(dom_same_node, next, last);
  if (_x88) {
    return $std_core_types.Unit;
  }
  else {
    return move_range_before(parent, $std_core_hnd._open_none1(function(_this_1 /* keyed-row<6712,6710,6711> */ ) {
          return _this_1.row_first;
        }, row), $std_core_hnd._open_none1(function(_this_2 /* keyed-row<6712,6710,6711> */ ) {
          return _this_2.row_last;
        }, row), last, session);
  }
}
 
export function rebuild_keyed_order(parent, last, rows, session) /* forall<a,b,e> (parent : node, last : node, rows : list<keyed-row<e,a,b>>, session : any) -> <ui,exn> () */  {
  return exhaust_keyed_row_actions(rows, function(row /* keyed-row<6712,6710,6711> */ ) {
       
      var first_10066 = $std_core_hnd._open_none1(function(_this /* keyed-row<6712,6710,6711> */ ) {
          return _this.row_first;
        }, row);
       
      var last_0_10067 = $std_core_hnd._open_none1(function(_this_0 /* keyed-row<6712,6710,6711> */ ) {
          return _this_0.row_last;
        }, row);
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_range_next(parent, first_10066, last_0_10067);
        });
       
      var _x89 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x89) {
        var x_11984 = $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        var x_11984 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(next_0 /* node */ ) {
          return _mlift_rebuild_keyed_order_11610(last, parent, row, session, next_0);
        });
      }
      else {
        return _mlift_rebuild_keyed_order_11610(last, parent, row, session, x_11984);
      }
    });
}
 
 
// monadic lift
export function _mlift_rollback_keyed_order_11611(last, parent, restored, rows, session, in_order) /* forall<a,b,e> (last : node, parent : node, restored : error<()>, rows : list<keyed-row<e,a,b>>, session : any, in-order : bool) -> <ui,exn> () */  {
  if (in_order) {
    return $std_core_exn.untry(restored);
  }
  else {
    return rebuild_keyed_order(parent, last, rows, session);
  }
}
 
 
// monadic lift
export function _mlift_rollback_keyed_order_11612(first, last, parent, restored, rows, session, _y_x10378) /* forall<a,b,e> (first : node, last : node, parent : node, restored : error<()>, rows : list<keyed-row<e,a,b>>, session : any, list<node>) -> <exn,ui> () */  {
   
  var firsts = $std_core_vector.unvlist(_y_x10378);
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_keyed_firsts_in_order(parent, first, last, firsts);
    });
   
  var _x89 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x89) {
    var x_11987 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11987 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
   
  function next_11988(in_order) /* (bool) -> <ui,exn> () */  {
    if (in_order) {
      return $std_core_exn.untry(restored);
    }
    else {
      return rebuild_keyed_order(parent, last, rows, session);
    }
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_11988);
  }
  else {
    return next_11988(x_11987);
  }
}
 
 
// monadic lift
export function _mlift_rollback_keyed_order_11613(parent, row, session, target, next) /* forall<a,b,e> (parent : node, row : keyed-row<e,a,b>, session : any, target : node, next : node) -> <exn,ui,exn> () */  {
  var _x89 = $std_core_hnd._open_none2(dom_same_node, next, target);
  if (_x89) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x_x2_3_11235 = $std_core_hnd._open_none1(function(_this_3 /* keyed-row<7071,7069,7070> */ ) {
        return _this_3.row_first;
      }, row);
     
    var _x_x3_0_11236 = $std_core_hnd._open_none1(function(_this_4 /* keyed-row<7071,7069,7070> */ ) {
        return _this_4.row_last;
      }, row);
    return $std_core_hnd._open_at0(0, function() {
        return move_range_before(parent, _x_x2_3_11235, _x_x3_0_11236, target, session);
      });
  }
}
 
 
// monadic lift
export function _mlift_rollback_keyed_order_11614(first, last, parent, rows, session, restored) /* forall<a,b,e> (first : node, last : node, parent : node, rows : list<keyed-row<e,a,b>>, session : any, restored : error<()>) -> <ui,exn> () */  {
   
  var x_11996 = $std_core_list.map(rows, function(row_0 /* keyed-row<7071,7069,7070> */ ) {
      return $std_core_hnd._open_none1(function(_this_5 /* keyed-row<7071,7069,7070> */ ) {
          return _this_5.row_first;
        }, row_0);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10378 /* list<node> */ ) {
      return _mlift_rollback_keyed_order_11612(first, last, parent, restored, rows, session, _y_x10378);
    });
  }
  else {
    return _mlift_rollback_keyed_order_11612(first, last, parent, restored, rows, session, x_11996);
  }
}
 
export function rollback_keyed_order(parent, first, last, rows, session) /* forall<a,b,e> (parent : node, first : node, last : node, rows : list<keyed-row<e,a,b>>, session : any) -> <ui,exn> () */  {
   
  var anchor = $std_core_hnd._open_none1(transaction_cell, last);
   
  var x_11998 = $kokaine_internal_compat.capture_error(function() {
    return exhaust_keyed_row_actions($std_core_list.reverse_acc($std_core_types.Nil, rows), function(row /* keyed-row<7071,7069,7070> */ ) {
         
        var target = $std_core_hnd._open_none1(transaction_load, anchor);
         
        var _x_x2_11222 = $std_core_hnd._open_none1(function(_this /* keyed-row<7071,7069,7070> */ ) {
            return _this.row_first;
          }, row);
         
        $std_core_hnd._open_none2(transaction_store, anchor, _x_x2_11222);
         
        var _x_x2_0_11225 = $std_core_hnd._open_none1(function(_this_0 /* keyed-row<7071,7069,7070> */ ) {
            return _this_0.row_first;
          }, row);
        var _x90 = $std_core_hnd._open_none2(dom_keyed_session_planned, session, _x_x2_0_11225);
        if (_x90) {
           
          var _x_x2_1_11228 = $std_core_hnd._open_none1(function(_this_1 /* keyed-row<7071,7069,7070> */ ) {
              return _this_1.row_first;
            }, row);
           
          var _x_x3_11229 = $std_core_hnd._open_none1(function(_this_2 /* keyed-row<7071,7069,7070> */ ) {
              return _this_2.row_last;
            }, row);
           
          var x_0_12001 = $std_core_hnd._open_at3(0, function(parent_0 /* node */ , first_0 /* node */ , last_0 /* node */ ) {
               
              var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
                  return dom_range_next(parent_0, first_0, last_0);
                });
              var _x91 = $std_core_hnd._open_none1(dom_attempt_ok, result);
              if (_x91) {
                return $std_core_hnd._open_none1(dom_attempt_value, result);
              }
              else {
                return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
              }
            }, parent, _x_x2_1_11228, _x_x3_11229);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(next_1 /* node */ ) {
              return _mlift_rollback_keyed_order_11613(parent, row, session, target, next_1);
            });
          }
          else {
            return _mlift_rollback_keyed_order_11613(parent, row, session, target, x_0_12001);
          }
        }
        else {
          return $std_core_types.Unit;
        }
      });
  });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(restored /* error<()> */ ) {
      return _mlift_rollback_keyed_order_11614(first, last, parent, rows, session, restored);
    });
  }
  else {
     
    var x_1_12004 = $std_core_list.map(rows, function(row_0 /* keyed-row<7071,7069,7070> */ ) {
        return $std_core_hnd._open_none1(function(_this_5 /* keyed-row<7071,7069,7070> */ ) {
            return _this_5.row_first;
          }, row_0);
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10378 /* list<node> */ ) {
        return _mlift_rollback_keyed_order_11612(first, last, parent, x_11998, rows, session, _y_x10378);
      });
    }
    else {
       
      var firsts = $std_core_vector.unvlist(x_1_12004);
       
      var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_keyed_firsts_in_order(parent, first, last, firsts);
        });
       
      var _x90 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
      if (_x90) {
        var x_2_12007 = $std_core_hnd._open_none1(dom_attempt_value, result_0);
      }
      else {
        var x_2_12007 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(in_order /* bool */ ) {
          if (in_order) {
            return $std_core_exn.untry(x_11998);
          }
          else {
            return rebuild_keyed_order(parent, last, rows, session);
          }
        });
      }
      else {
        if (x_2_12007) {
          return $std_core_exn.untry(x_11998);
        }
        else {
          return rebuild_keyed_order(parent, last, rows, session);
        }
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_plan_keyed_moves_11615(first_0_10069, last_0_10070, parent, wild___0) /* (first@0@10069 : node, last@0@10070 : node, parent : node, wild_@0 : ()) -> <ui,exn> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_validate_range_move_focus(parent, first_0_10069, last_0_10070);
    });
  var _x90 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x90) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
 
// monadic lift
export function _mlift_plan_keyed_moves_11616(plan, wild___0_0) /* forall<a,b,e> (plan : list<(keyed-row<e,a,b>, bool)>, wild_@0@0 : ()) -> <exn,ui> list<(keyed-row<e,a,b>, bool)> */  {
  return plan;
}
 
 
// monadic lift
export function _mlift_plan_keyed_moves_11617(parent, rows, session, stable) /* forall<a,b,e> (parent : node, rows : list<keyed-row<e,a,b>>, session : any, stable : vector<bool>) -> <ui,exn> list<(keyed-row<e,a,b>, bool)> */  {
   
  var plan = $std_core_list.zip(rows, $std_core_vector.vlist(stable));
   
  var x_12018 = $std_core_list.foreach(plan, function(entry /* (keyed-row<7467,7465,7466>, bool) */ ) {
      if (entry.snd) {
        return $std_core_types.Unit;
      }
      else {
         
        var first_0_10069 = $std_core_hnd._open_none1(function(_this_1 /* keyed-row<7467,7465,7466> */ ) {
            return _this_1.row_first;
          }, entry.fst);
         
        var last_0_10070 = $std_core_hnd._open_none1(function(_this_2 /* keyed-row<7467,7465,7466> */ ) {
            return _this_2.row_last;
          }, entry.fst);
         
        var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_validate_range_move_lifecycle(parent, first_0_10069, last_0_10070, session);
          });
         
        var _x91 = $std_core_hnd._open_none1(dom_attempt_ok, result);
        if (_x91) {
          var x_0_12020 = $std_core_hnd._open_none1(dom_attempt_value, result);
        }
        else {
          var x_0_12020 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
        }
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
            return _mlift_plan_keyed_moves_11615(first_0_10069, last_0_10070, parent, wild___0);
          });
        }
        else {
          return _mlift_plan_keyed_moves_11615(first_0_10069, last_0_10070, parent, x_0_12020);
        }
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0_0 /* () */ ) {
      return plan;
    });
  }
  else {
    return plan;
  }
}
 
 
// monadic lift
export function _mlift_plan_keyed_moves_11618(current, parent, rows, session, _c_x10387) /* forall<a,b,e> (current : any, parent : node, rows : list<keyed-row<e,a,b>>, session : any, ()) -> list<(keyed-row<e,a,b>, bool)> */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_keyed_stable_rows(current);
    });
   
  var _x91 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x91) {
    var x_12025 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_12025 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(stable /* vector<bool> */ ) {
      return _mlift_plan_keyed_moves_11617(parent, rows, session, stable);
    });
  }
  else {
    return _mlift_plan_keyed_moves_11617(parent, rows, session, x_12025);
  }
}
 
 
// monadic lift
export function _mlift_plan_keyed_moves_11619(parent, rows, session, current) /* forall<a,b,e> (parent : node, rows : list<keyed-row<e,a,b>>, session : any, current : any) -> <ui,exn> list<(keyed-row<e,a,b>, bool)> */  {
   
  var _x91 = $std_core_hnd._open_none1(any_is_null, current);
  if (_x91) {
    var x_12028 = $std_core_exn.$throw("invalid Kokaine keyed DOM: unmanaged nodes remain in the region");
  }
  else {
    var x_12028 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10387 /* () */ ) {
      return _mlift_plan_keyed_moves_11618(current, parent, rows, session, _c_x10387);
    });
  }
  else {
    return _mlift_plan_keyed_moves_11618(current, parent, rows, session, x_12028);
  }
}
 
 
// monadic lift
export function _mlift_plan_keyed_moves_11620(first, firsts, last, parent, rows, session, _y_x10384) /* forall<a,b,e> (first : node, firsts : vector<node>, last : node, parent : node, rows : list<keyed-row<e,a,b>>, session : any, list<node>) -> <exn,ui> list<(keyed-row<e,a,b>, bool)> */  {
   
  var lasts = $std_core_vector.unvlist(_y_x10384);
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_keyed_current_order(parent, first, last, firsts, lasts);
    });
   
  var _x91 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x91) {
    var x_12030 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_12030 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(current /* any */ ) {
      return _mlift_plan_keyed_moves_11619(parent, rows, session, current);
    });
  }
  else {
    return _mlift_plan_keyed_moves_11619(parent, rows, session, x_12030);
  }
}
 
 
// monadic lift
export function _mlift_plan_keyed_moves_11621(first, last, parent, rows, session, _y_x10383) /* forall<a,b,e> (first : node, last : node, parent : node, rows : list<keyed-row<e,a,b>>, session : any, list<node>) -> <exn,ui> list<(keyed-row<e,a,b>, bool)> */  {
   
  var firsts = $std_core_vector.unvlist(_y_x10383);
   
  var x_12033 = $std_core_list.map(rows, function(row_0 /* keyed-row<7467,7465,7466> */ ) {
      return $std_core_hnd._open_none1(function(_this_0 /* keyed-row<7467,7465,7466> */ ) {
          return _this_0.row_last;
        }, row_0);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10384 /* list<node> */ ) {
      return _mlift_plan_keyed_moves_11620(first, firsts, last, parent, rows, session, _y_x10384);
    });
  }
  else {
    return _mlift_plan_keyed_moves_11620(first, firsts, last, parent, rows, session, x_12033);
  }
}
 
 
// Plan placement of `rows` (the complete target order) by a longest
// increasing subsequence over their current positions: rows on it stay, the
// rest move. Every row that will move is validated now, before the first
// move; rollback only moves planned rows, so this is also its validation.
export function plan_keyed_moves(parent, first, last, rows, session) /* forall<a,b,e> (parent : node, first : node, last : node, rows : list<keyed-row<e,a,b>>, session : any) -> <ui,exn> list<(keyed-row<e,a,b>, bool)> */  {
   
  var x_12035 = $std_core_list.map(rows, function(row /* keyed-row<7467,7465,7466> */ ) {
      return $std_core_hnd._open_none1(function(_this /* keyed-row<7467,7465,7466> */ ) {
          return _this.row_first;
        }, row);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10383 /* list<node> */ ) {
      return _mlift_plan_keyed_moves_11621(first, last, parent, rows, session, _y_x10383);
    });
  }
  else {
     
    var firsts = $std_core_vector.unvlist(x_12035);
     
    var x_0_12038 = $std_core_list.map(rows, function(row_0 /* keyed-row<7467,7465,7466> */ ) {
        return $std_core_hnd._open_none1(function(_this_0 /* keyed-row<7467,7465,7466> */ ) {
            return _this_0.row_last;
          }, row_0);
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10384 /* list<node> */ ) {
        return _mlift_plan_keyed_moves_11620(first, firsts, last, parent, rows, session, _y_x10384);
      });
    }
    else {
       
      var lasts = $std_core_vector.unvlist(x_0_12038);
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_keyed_current_order(parent, first, last, firsts, lasts);
        });
       
      var _x91 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x91) {
        var x_1_12041 = $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        var x_1_12041 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(current /* any */ ) {
          return _mlift_plan_keyed_moves_11619(parent, rows, session, current);
        });
      }
      else {
         
        var _x91 = $std_core_hnd._open_none1(any_is_null, x_1_12041);
        if (_x91) {
          var x_2_12045 = $std_core_exn.$throw("invalid Kokaine keyed DOM: unmanaged nodes remain in the region");
        }
        else {
          var x_2_12045 = $std_core_types.Unit;
        }
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_c_x10387 /* () */ ) {
            return _mlift_plan_keyed_moves_11618(x_1_12041, parent, rows, session, _c_x10387);
          });
        }
        else {
           
          var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
              return dom_keyed_stable_rows(x_1_12041);
            });
           
          var _x91 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
          if (_x91) {
            var x_3_12048 = $std_core_hnd._open_none1(dom_attempt_value, result_0);
          }
          else {
            var x_3_12048 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
          }
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(stable /* vector<bool> */ ) {
              return _mlift_plan_keyed_moves_11617(parent, rows, session, stable);
            });
          }
          else {
             
            var plan = $std_core_list.zip(rows, $std_core_vector.vlist(x_3_12048));
             
            var x_4_12052 = $std_core_list.foreach(plan, function(entry /* (keyed-row<7467,7465,7466>, bool) */ ) {
                if (entry.snd) {
                  return $std_core_types.Unit;
                }
                else {
                   
                  var first_0_10069 = $std_core_hnd._open_none1(function(_this_1 /* keyed-row<7467,7465,7466> */ ) {
                      return _this_1.row_first;
                    }, entry.fst);
                   
                  var last_0_10070 = $std_core_hnd._open_none1(function(_this_2 /* keyed-row<7467,7465,7466> */ ) {
                      return _this_2.row_last;
                    }, entry.fst);
                   
                  var result_1 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
                      return dom_validate_range_move_lifecycle(parent, first_0_10069, last_0_10070, session);
                    });
                   
                  var _x91 = $std_core_hnd._open_none1(dom_attempt_ok, result_1);
                  if (_x91) {
                    var x_5_12055 = $std_core_hnd._open_none1(dom_attempt_value, result_1);
                  }
                  else {
                    var x_5_12055 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_1)));
                  }
                  if ($std_core_hnd._yielding()) {
                    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
                      return _mlift_plan_keyed_moves_11615(first_0_10069, last_0_10070, parent, wild___0);
                    });
                  }
                  else {
                    return _mlift_plan_keyed_moves_11615(first_0_10069, last_0_10070, parent, x_5_12055);
                  }
                }
              });
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(wild___0_0 /* () */ ) {
                return plan;
              });
            }
            else {
              return plan;
            }
          }
        }
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_place_keyed_plan_11622(parent, rest, row, session, _c_x10395) /* forall<a,b,e> (parent : node, rest : list<(keyed-row<e,a,b>, bool)>, row : keyed-row<e,a,b>, session : any, ()) -> () */  {
  return place_keyed_plan(parent, $std_core_hnd._open_none1(function(_this_1 /* keyed-row<7583,7581,7582> */ ) {
        return _this_1.row_first;
      }, row), rest, session);
}
 
 
// Walk the plan back to front, moving each unstable row before the row that
// follows it in the target order (Vue/ivi style).
export function place_keyed_plan(parent_0, anchor, reversed, session_0) /* forall<a,b,e> (parent : node, anchor : node, reversed : list<(keyed-row<e,a,b>, bool)>, session : any) -> <ui,exn> () */  { tailcall: while(1)
{
  if (reversed === null) {
    return $std_core_types.Unit;
  }
  else {
     
    if (reversed.head.snd) {
      var x_12060 = $std_core_types.Unit;
    }
    else {
      var x_12060 = move_range_before(parent_0, $std_core_hnd._open_none1(function(_this /* keyed-row<7583,7581,7582> */ ) {
            return _this.row_first;
          }, reversed.head.fst), $std_core_hnd._open_none1(function(_this_0 /* keyed-row<7583,7581,7582> */ ) {
            return _this_0.row_last;
          }, reversed.head.fst), anchor, session_0);
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10395_0 /* () */ ) {
        return _mlift_place_keyed_plan_11622(parent_0, reversed.tail, reversed.head.fst, session_0, _c_x10395_0);
      });
    }
    else {
      {
        // tail call
        var _x91 = $std_core_hnd._open_none1(function(_this_1_0 /* keyed-row<7583,7581,7582> */ ) {
            return _this_1_0.row_first;
          }, reversed.head.fst);
        anchor = _x91;
        reversed = reversed.tail;
        continue tailcall;
      }
    }
  }
}}
 
 
// monadic lift
export function _mlift_move_keyed_rows_11623(last, move_phase, parent, session, plan) /* forall<a,b,e> (last : node, move-phase : ref<global,bool>, parent : node, session : any, plan : list<(keyed-row<e,a,b>, bool)>) -> <ui,exn> () */  {
   
  $std_core_hnd._open_none2(transaction_store, move_phase, true);
  return place_keyed_plan(parent, last, $std_core_list.reverse_acc($std_core_types.Nil, plan), session);
}
 
 
// monadic lift
export function _mlift_move_keyed_rows_11624(first, last, move_phase, parent, rows, session_cell, session) /* forall<a,b,e> (first : node, last : node, move-phase : ref<global,bool>, parent : node, rows : list<keyed-row<e,a,b>>, session-cell : ref<global,any>, session : any) -> <ui,exn> () */  {
   
  $std_core_hnd._open_none2(transaction_store, session_cell, session);
   
  var x_12065 = plan_keyed_moves(parent, first, last, rows, session);
   
  function next_12066(plan) /* (list<(keyed-row<7703,7701,7702>, bool)>) -> <ui,exn> () */  {
     
    $std_core_hnd._open_none2(transaction_store, move_phase, true);
    return place_keyed_plan(parent, last, $std_core_list.reverse_acc($std_core_types.Nil, plan), session);
  }
  if ($std_core_hnd._yielding()) {
    var _x92 = $std_core_hnd.yield_extend(next_12066);
  }
  else {
    var _x92 = next_12066(x_12065);
  }
  return $std_core_hnd.finally_prompt(function() {
      return $std_core_hnd._open_none1(dom_keyed_close_move_session, session);
    }, _x92);
}
 
 
// Reorder the region to `rows` with as few row moves as the LIS allows.
export function move_keyed_rows(parent, first, last, rows, session_cell, move_phase) /* forall<a,b,e> (parent : node, first : node, last : node, rows : list<keyed-row<e,a,b>>, session-cell : ref<global,any>, move-phase : ref<global,bool>) -> <ui,exn> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_keyed_open_move_session(parent);
    });
   
  var _x93 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x93) {
    var x_12072 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_12072 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(session /* any */ ) {
      return _mlift_move_keyed_rows_11624(first, last, move_phase, parent, rows, session_cell, session);
    });
  }
  else {
     
    $std_core_hnd._open_none2(transaction_store, session_cell, x_12072);
     
    var x_0_12078 = plan_keyed_moves(parent, first, last, rows, x_12072);
     
    var next_0_12079 = function(plan /* list<(keyed-row<7703,7701,7702>, bool)> */ ) {
       
      $std_core_hnd._open_none2(transaction_store, move_phase, true);
      return place_keyed_plan(parent, last, $std_core_list.reverse_acc($std_core_types.Nil, plan), x_12072);
    };
    if ($std_core_hnd._yielding()) {
      var _x93 = $std_core_hnd.yield_extend(next_0_12079);
    }
    else {
      var _x93 = next_0_12079(x_0_12078);
    }
    return $std_core_hnd.finally_prompt(function() {
        return $std_core_hnd._open_none1(dom_keyed_close_move_session, x_12072);
      }, _x93);
  }
}
 
 
// monadic lift
export function _mlift_validate_keyed_order_11625(last, parent, rest, next) /* forall<a,b,e> (last : node, parent : node, rest : list<keyed-row<e,a,b>>, next : node) -> <ui,exn> () */  {
  return validate_keyed_order(parent, last, next, rest);
}
 
export function validate_keyed_order(parent_0, last_0, cursor, rows) /* forall<a,b,e> (parent : node, last : node, cursor : node, rows : list<keyed-row<e,a,b>>) -> <ui,exn> () */  { tailcall: while(1)
{
  if (rows === null) {
    var _x94 = $std_core_hnd._open_none2(dom_same_node, cursor, last_0);
    if (_x94) {
      return $std_core_types.Unit;
    }
    else {
      return $std_core_exn.$throw("invalid Kokaine keyed DOM: unmanaged nodes remain in the region");
    }
  }
  else {
     
    var _x_x2_0_11259 = $std_core_hnd._open_none1(function(_this /* keyed-row<7861,7859,7860> */ ) {
        return _this.row_first;
      }, rows.head);
     
    var _x_x1_0_11257 = $std_core_hnd._open_none2(dom_same_node, cursor, _x_x2_0_11259);
    var _x95 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_0_11257);
    if (_x95) {
      return $std_core_exn.$throw("invalid Kokaine keyed DOM: retained row ranges are out of order");
    }
    else {
       
      var first_10073 = $std_core_hnd._open_none1(function(_this_0 /* keyed-row<7861,7859,7860> */ ) {
          return _this_0.row_first;
        }, rows.head);
       
      var last_0_10074 = $std_core_hnd._open_none1(function(_this_1 /* keyed-row<7861,7859,7860> */ ) {
          return _this_1.row_last;
        }, rows.head);
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_range_next(parent_0, first_10073, last_0_10074);
        });
       
      var _x96 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x96) {
        var x_12085 = $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        var x_12085 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(next_1 /* node */ ) {
          return _mlift_validate_keyed_order_11625(last_0, parent_0, rows.tail, next_1);
        });
      }
      else {
        {
          // tail call
          cursor = x_12085;
          rows = rows.tail;
          continue tailcall;
        }
      }
    }
  }
}}
 
 
// monadic lift
export function _mlift_keyed_order_matches_11626(last, parent, rest, next) /* forall<a,b,e> (last : node, parent : node, rest : list<keyed-row<e,a,b>>, next : node) -> <ui,exn> bool */  {
  return keyed_order_matches(parent, last, next, rest);
}
 
export function keyed_order_matches(parent_0, last_0, cursor, rows) /* forall<a,b,e> (parent : node, last : node, cursor : node, rows : list<keyed-row<e,a,b>>) -> <ui,exn> bool */  { tailcall: while(1)
{
  if (rows === null) {
    return $std_core_hnd._open_none2(dom_same_node, cursor, last_0);
  }
  else {
     
    var _x_x2_0_11267 = $std_core_hnd._open_none1(function(_this /* keyed-row<7992,7990,7991> */ ) {
        return _this.row_first;
      }, rows.head);
     
    var _x_x1_0_11265 = $std_core_hnd._open_none2(dom_same_node, cursor, _x_x2_0_11267);
    var _x96 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_0_11265);
    if (_x96) {
      return false;
    }
    else {
       
      var first_10076 = $std_core_hnd._open_none1(function(_this_0 /* keyed-row<7992,7990,7991> */ ) {
          return _this_0.row_first;
        }, rows.head);
       
      var last_0_10077 = $std_core_hnd._open_none1(function(_this_1 /* keyed-row<7992,7990,7991> */ ) {
          return _this_1.row_last;
        }, rows.head);
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_range_next(parent_0, first_10076, last_0_10077);
        });
       
      var _x97 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x97) {
        var x_12089 = $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        var x_12089 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(next_1 /* node */ ) {
          return _mlift_keyed_order_matches_11626(last_0, parent_0, rows.tail, next_1);
        });
      }
      else {
        {
          // tail call
          cursor = x_12089;
          rows = rows.tail;
          continue tailcall;
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
    var _x98 = rows.head.row_key;
    var _x97 = $kokaine_internal_key_dash_index.find(next, _x98, compare);
    if (_x97 !== null) {
      {
        // tail call
        rows = rows.tail;
        continue tailcall;
      }
    }
    else {
       
      var _trmc_x10154 = undefined;
       
      var _trmc_x10155 = $std_core_types.Cons(rows.head, _trmc_x10154);
      {
        // tail call
        var _x99 = $std_core_types._cctx_extend(_acc,_trmc_x10155,({obj: _trmc_x10155, field_name: "tail"}));
        rows = rows.tail;
        _acc = _x99;
        continue tailcall;
      }
    }
  }
}}
 
export function collect_stale_rows(rows_0, next_0, compare_0) /* forall<a,b,e> (rows : list<keyed-row<e,a,b>>, next : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, compare : (b, b) -> order) -> list<keyed-row<e,a,b>> */  {
  return _trmc_collect_stale_rows(rows_0, next_0, compare_0, $std_core_types._cctx_empty());
}
 
 
// monadic lift
export function _mlift_stage_keyed_retirements_loop_11627(collected, rest, row, staged) /* forall<a,b,e> (collected : list<keyed-retirement<e,a,b>>, rest : list<keyed-row<e,a,b>>, row : keyed-row<e,a,b>, staged : dom-retirement) -> <ui,exn> list<keyed-retirement<e,a,b>> */  {
  return stage_keyed_retirements_loop(rest, $std_core_types.Cons(Keyed_retirement(row, staged), collected));
}
 
export function stage_keyed_retirements_loop(rows, collected_0) /* forall<a,b,e> (rows : list<keyed-row<e,a,b>>, collected : list<keyed-retirement<e,a,b>>) -> <ui,exn> list<keyed-retirement<e,a,b>> */  { tailcall: while(1)
{
  if (rows === null) {
    return $std_core_list.reverse_acc($std_core_types.Nil, collected_0);
  }
  else {
     
    var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        var _x100 = rows.head.row_first;
        var _x101 = rows.head.row_last;
        return dom_stage_retirement(_x100, _x101);
      });
     
    var _x102 = $std_core_hnd._open_none1(dom_attempt_ok, result);
    if (_x102) {
      var x_12093 = $std_core_hnd._open_none1(dom_attempt_value, result);
    }
    else {
      var x_12093 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(staged_0 /* dom-retirement */ ) {
        return _mlift_stage_keyed_retirements_loop_11627(collected_0, rows.tail, rows.head, staged_0);
      });
    }
    else {
      {
        // tail call
        var _x100 = $std_core_types.Cons(Keyed_retirement(rows.head, x_12093), collected_0);
        rows = rows.tail;
        collected_0 = _x100;
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
     
    var _x101 = values.head.retirement_handle;
    dom_release_retirement(_x101);
    {
      // tail call
      values = values.tail;
      continue tailcall;
    }
  }
}}
 
 
// monadic lift
export function _mlift_detach_keyed_retirements_loop_11628(current, detached, index, order, rest, table, wild__) /* forall<a,b,e> (current : keyed-retirement<e,a,b>, detached : ref<global,list<keyed-row<e,a,b>>>, index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, order : list<keyed-row<e,a,b>>, rest : list<keyed-retirement<e,a,b>>, table : ref<global,keyed-table<e,a,b>>, wild_ : ()) -> <ui,exn> () */  {
   
  $std_core_hnd._open_none2(transaction_store, table, Keyed_table(index, order, rest));
   
  var _x_x1_1_11274 = $std_core_hnd._open_none1(function(_this_0 /* keyed-retirement<8576,8574,8575> */ ) {
      return _this_0.retirement_handle;
    }, current);
   
  $std_core_hnd._open_none1(dom_release_retirement, _x_x1_1_11274);
   
  var _x_x2_0_11277 = $std_core_types.Cons($std_core_hnd._open_none1(function(_this_1 /* keyed-retirement<8576,8574,8575> */ ) {
        return _this_1.retirement_row;
      }, current), $std_core_hnd._open_none1(transaction_load, detached));
   
  $std_core_hnd._open_none2(transaction_store, detached, _x_x2_0_11277);
  return detach_keyed_retirements_loop(table, detached);
}
 
export function detach_keyed_retirements_loop(table_0, detached_0) /* forall<a,b,e> (table : ref<global,keyed-table<e,a,b>>, detached : ref<global,list<keyed-row<e,a,b>>>) -> <pure,ui> () */  { tailcall: while(1)
{
  var _x101 = $std_core_hnd._open_none1(transaction_load, table_0);
  if (_x101.table_retirements === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        var _x102 = _x101.table_retirements.head.retirement_handle;
        return dom_run_retirement(_x102);
      });
     
    var _x103 = $std_core_hnd._open_none1(dom_attempt_ok, result);
    if (_x103) {
      var x_12097 = $std_core_hnd._open_none1(dom_attempt_value, result);
    }
    else {
      var x_12097 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return _mlift_detach_keyed_retirements_loop_11628(_x101.table_retirements.head, detached_0, _x101.table_index, _x101.table_order, _x101.table_retirements.tail, table_0, wild___0);
      });
    }
    else {
       
      $std_core_hnd._open_none2(transaction_store, table_0, Keyed_table(_x101.table_index, _x101.table_order, _x101.table_retirements.tail));
       
      var _x_x1_1_11274_0 = $std_core_hnd._open_none1(function(_this_0_0 /* keyed-retirement<8576,8574,8575> */ ) {
          return _this_0_0.retirement_handle;
        }, _x101.table_retirements.head);
       
      $std_core_hnd._open_none1(dom_release_retirement, _x_x1_1_11274_0);
       
      var _x_x2_0_11277_0 = $std_core_types.Cons($std_core_hnd._open_none1(function(_this_1_0 /* keyed-retirement<8576,8574,8575> */ ) {
            return _this_1_0.retirement_row;
          }, _x101.table_retirements.head), $std_core_hnd._open_none1(transaction_load, detached_0));
       
      $std_core_hnd._open_none2(transaction_store, detached_0, _x_x2_0_11277_0);
      {
        // tail call
        continue tailcall;
      }
    }
  }
}}
 
 
// monadic lift
export function _mlift_drain_keyed_retirements_11629(rows) /* forall<a,b,e> (rows : list<keyed-row<e,a,b>>) -> <exn,ui> () */  {
  return exhaust_keyed_row_actions(rows, function(row /* keyed-row<8689,8687,8688> */ ) {
       
      var scope_10064 = $std_core_hnd._open_none1(function(_this /* keyed-row<8689,8687,8688> */ ) {
          return _this.row_scope;
        }, row);
      return $kokaine_reactive_integration_internal_lifetime_dash_scope.lifetime_scope_fs_dispose($std_core_hnd._open_none1(function(value /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
          return value;
        }, scope_10064));
    });
}
 
export function drain_keyed_retirements(table) /* forall<a,b,e> (table : ref<global,keyed-table<e,a,b>>) -> <ui,exn> () */  {
   
  var detached = $std_core_hnd._open_none1(transaction_cell, $std_core_types.Nil);
  return $std_core_hnd.finally_prompt(function() {
       
      var xs_10863 = $std_core_hnd._open_none1(transaction_load, detached);
       
      var x_12104 = $std_core_list.reverse_acc($std_core_types.Nil, xs_10863);
       
      function next_12105(rows) /* (list<keyed-row<8689,8687,8688>>) -> <exn,ui> () */  {
        return exhaust_keyed_row_actions(rows, function(row /* keyed-row<8689,8687,8688> */ ) {
             
            var scope_10064 = $std_core_hnd._open_none1(function(_this /* keyed-row<8689,8687,8688> */ ) {
                return _this.row_scope;
              }, row);
            return $kokaine_reactive_integration_internal_lifetime_dash_scope.lifetime_scope_fs_dispose($std_core_hnd._open_none1(function(value /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
                return value;
              }, scope_10064));
          });
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(next_12105);
      }
      else {
        return next_12105(x_12104);
      }
    }, detach_keyed_retirements_loop(table, detached));
}
 
 
// monadic lift
export function _mlift_commit_keyed_update_11630(row, update, wild___1) /* forall<a,b,e> (row : keyed-row<e,a,b>, update : keyed-update<e,a,b>, wild_@1 : ()) -> kokaine/reactive/effects/signal-write () */  {
   
  var _x_x1_11_11295 = $std_core_hnd._open_none1(function(_this_8 /* keyed-row<8921,8919,8920> */ ) {
      return _this_8.row_current_index;
    }, row);
   
  var _x_x2_0_11296 = $std_core_hnd._open_none1(function(_this_9 /* keyed-update<8921,8919,8920> */ ) {
      return _this_9.update_index;
    }, update);
  return $std_core_hnd._open_none2(transaction_store, _x_x1_11_11295, _x_x2_0_11296);
}
 
 
// monadic lift
export function _mlift_commit_keyed_update_11631(row, update, wild__) /* forall<a,b,e> (row : keyed-row<e,a,b>, update : keyed-update<e,a,b>, wild_ : ()) -> kokaine/reactive/effects/signal-write () */  {
   
  var _x_x1_4_11287 = $std_core_hnd._open_none1(function(_this_3 /* keyed-row<8921,8919,8920> */ ) {
      return _this_3.row_current_item;
    }, row);
   
  var _x_x2_11288 = $std_core_hnd._open_none1(function(_this_4 /* keyed-update<8921,8919,8920> */ ) {
      return _this_4.update_item;
    }, update);
  return $std_core_hnd._open_none2(transaction_store, _x_x1_4_11287, _x_x2_11288);
}
 
 
// monadic lift
export function _mlift_commit_keyed_update_11632(row, update, _c_x10430) /* forall<a,b,e> (row : keyed-row<e,a,b>, update : keyed-update<e,a,b>, ()) -> () */  {
  var _x102 = $std_core_hnd._open_none1(function(_this_5 /* keyed-update<8921,8919,8920> */ ) {
      return _this_5.update_index_changed;
    }, update);
  if (_x102) {
     
    var value_0_10088 = $std_core_hnd._open_none1(function(_this_6 /* keyed-row<8921,8919,8920> */ ) {
        return _this_6.row_index_source;
      }, row);
     
    var next_0_10089 = $std_core_hnd._open_none1(function(_this_7 /* keyed-update<8921,8919,8920> */ ) {
        return _this_7.update_index;
      }, update);
     
    var value_0_10023_0 = $std_core_hnd._open_none1(function(value_1_0 /* kokaine/reactive/signal<int> */ ) {
        return value_1_0;
      }, value_0_10088);
     
    var x_12106 = $kokaine_reactive_internal_runtime.signal_fs_set(value_0_10023_0, next_0_10089);
     
    var next_12107 = function(wild___1 /* () */ ) {
       
      var _x_x1_11_11295 = $std_core_hnd._open_none1(function(_this_8 /* keyed-row<8921,8919,8920> */ ) {
          return _this_8.row_current_index;
        }, row);
       
      var _x_x2_0_11296 = $std_core_hnd._open_none1(function(_this_9 /* keyed-update<8921,8919,8920> */ ) {
          return _this_9.update_index;
        }, update);
      return $std_core_hnd._open_none2(transaction_store, _x_x1_11_11295, _x_x2_0_11296);
    };
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(next_12107);
    }
    else {
      return next_12107(x_12106);
    }
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function commit_keyed_update(update) /* forall<a,b,e> (update : keyed-update<e,a,b>) -> kokaine/reactive/effects/signal-write () */  {
   
  var row = $std_core_hnd._open_none1(function(_this /* keyed-update<8921,8919,8920> */ ) {
      return _this.update_row;
    }, update);
   
  var _x103 = $std_core_hnd._open_none1(function(_this_0 /* keyed-update<8921,8919,8920> */ ) {
      return _this_0.update_item_changed;
    }, update);
  if (_x103) {
     
    var value_10086 = $std_core_hnd._open_none1(function(_this_1 /* keyed-row<8921,8919,8920> */ ) {
        return _this_1.row_item_source;
      }, row);
     
    var next_10087 = $std_core_hnd._open_none1(function(_this_2 /* keyed-update<8921,8919,8920> */ ) {
        return _this_2.update_item;
      }, update);
     
    var value_0_10023 = $std_core_hnd._open_none1(function(value_1 /* kokaine/reactive/signal<8919> */ ) {
        return value_1;
      }, value_10086);
     
    var x_0_12114 = $kokaine_reactive_internal_runtime.signal_fs_set(value_0_10023, next_10087);
     
    var next_0_12115 = function(wild__ /* () */ ) {
       
      var _x_x1_4_11287 = $std_core_hnd._open_none1(function(_this_3 /* keyed-row<8921,8919,8920> */ ) {
          return _this_3.row_current_item;
        }, row);
       
      var _x_x2_11288 = $std_core_hnd._open_none1(function(_this_4 /* keyed-update<8921,8919,8920> */ ) {
          return _this_4.update_item;
        }, update);
      return $std_core_hnd._open_none2(transaction_store, _x_x1_4_11287, _x_x2_11288);
    };
    if ($std_core_hnd._yielding()) {
      var x_12111 = $std_core_hnd.yield_extend(next_0_12115);
    }
    else {
      var x_12111 = next_0_12115(x_0_12114);
    }
  }
  else {
    var x_12111 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10430 /* () */ ) {
      return _mlift_commit_keyed_update_11632(row, update, _c_x10430);
    });
  }
  else {
    var _x103 = $std_core_hnd._open_none1(function(_this_5 /* keyed-update<8921,8919,8920> */ ) {
        return _this_5.update_index_changed;
      }, update);
    if (_x103) {
       
      var value_0_10088 = $std_core_hnd._open_none1(function(_this_6 /* keyed-row<8921,8919,8920> */ ) {
          return _this_6.row_index_source;
        }, row);
       
      var next_0_10089 = $std_core_hnd._open_none1(function(_this_7 /* keyed-update<8921,8919,8920> */ ) {
          return _this_7.update_index;
        }, update);
       
      var value_0_10023_0 = $std_core_hnd._open_none1(function(value_1_0 /* kokaine/reactive/signal<int> */ ) {
          return value_1_0;
        }, value_0_10088);
       
      var x_1_12119 = $kokaine_reactive_internal_runtime.signal_fs_set(value_0_10023_0, next_0_10089);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild___1 /* () */ ) {
           
          var _x_x1_11_11295 = $std_core_hnd._open_none1(function(_this_8 /* keyed-row<8921,8919,8920> */ ) {
              return _this_8.row_current_index;
            }, row);
           
          var _x_x2_0_11296 = $std_core_hnd._open_none1(function(_this_9 /* keyed-update<8921,8919,8920> */ ) {
              return _this_9.update_index;
            }, update);
          return $std_core_hnd._open_none2(transaction_store, _x_x1_11_11295, _x_x2_0_11296);
        });
      }
      else {
         
        var _x_x1_11_11295_0 = $std_core_hnd._open_none1(function(_this_8_0 /* keyed-row<8921,8919,8920> */ ) {
            return _this_8_0.row_current_index;
          }, row);
         
        var _x_x2_0_11296_0 = $std_core_hnd._open_none1(function(_this_9_0 /* keyed-update<8921,8919,8920> */ ) {
            return _this_9_0.update_index;
          }, update);
        return $std_core_hnd._open_none2(transaction_store, _x_x1_11_11295_0, _x_x2_0_11296_0);
      }
    }
    else {
      return $std_core_types.Unit;
    }
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11633(scope, _y_x10435) /* (scope : kokaine/reactive/integration/lifetime-scope<ui>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10435, false, function() {
      return $kokaine_reactive_integration_internal_lifetime_dash_scope.lifetime_scope_fs_dispose($std_core_hnd._open_none1(function(value_0 /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
          return value_0;
        }, scope));
    });
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11634(first, row_last, _y_x10442) /* (first : node, row-last : node, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10442, false, function() {
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_clean_range(first, row_last, true);
        });
      var _x104 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x104) {
        return $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
    });
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11635(committed, first_0, identity, index, index_source, item, item_source, row_last_0, scope_0, wild___3) /* forall<a,b,e> (committed : ref<global,bool>, first : node, identity : a, index : int, index-source : kokaine/reactive/signal<int>, item : b, item-source : kokaine/reactive/signal<b>, row-last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, wild_@3 : ()) -> <pure,kokaine/reactive/effects/signal-write,ui> keyed-row<e,b,a> */  {
   
  var row = Keyed_row(identity, $std_core_hnd._open_none1(transaction_cell, item), $std_core_hnd._open_none1(transaction_cell, index), item_source, index_source, scope_0, first_0, row_last_0);
   
  $std_core_hnd._open_none2(transaction_store, committed, true);
  return row;
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11636(_y_x10466) /* forall<e> (list<kokaine/html/view<e>>) -> <kokaine/reactive/effects/signal-read,div,exn> kokaine/html/view<e> */  {
  if (_y_x10466 === null) {
    return $kokaine_html.Empty;
  }
  else if (_y_x10466 !== null && _y_x10466.tail === null) {
    return _y_x10466.head;
  }
  else {
    return $kokaine_html.Fragment(_y_x10466);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11637(committed_0, first_1, identity_0, index_0, index_source_0, item_0, item_source_0, parent, renderer, root, row_last_1, scope_1, tree) /* forall<a,b,e> (committed : ref<global,bool>, first : node, identity : a, index : int, index-source : kokaine/reactive/signal<int>, item : b, item-source : kokaine/reactive/signal<b>, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, row-last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, tree : kokaine/html/view<e>) -> <kokaine/reactive/effects/signal-write,div,exn,ui> keyed-row<e,b,a> */  {
   
  var x_12128 = mount_view(renderer, root, parent, $std_core_types.Just(row_last_1), tree);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___3_0 /* () */ ) {
      return _mlift_create_keyed_row_11635(committed_0, first_1, identity_0, index_0, index_source_0, item_0, item_source_0, row_last_1, scope_1, wild___3_0);
    });
  }
  else {
    return _mlift_create_keyed_row_11635(committed_0, first_1, identity_0, index_0, index_source_0, item_0, item_source_0, row_last_1, scope_1, x_12128);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11638(children, committed_1, first_2, identity_1, index_1, index_source_1, item_1, item_source_1, parent_0, renderer_0, root_0, row_last_2, scope_2, _y_x10462) /* forall<a,b,e> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), committed : ref<global,bool>, first : node, identity : a, index : int, index-source : kokaine/reactive/signal<int>, item : b, item-source : kokaine/reactive/signal<b>, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, row-last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> keyed-row<e,b,a> */  {
   
  var x_0_12130 = $std_core_hnd._mask_at(_y_x10462, false, function() {
      return $kokaine_reactive.sample(root_0, function() {
           
          var x_1_12133 = $kokaine_html.collect(function() {
            return $std_core_hnd._open2($std_core_vector.unvlist($std_core_types.Cons(1, $std_core_types.Cons(2, $std_core_types.Nil))), children, function() {
                 
                var value_0_10022 = $std_core_hnd._open_none1(function(value_1_0 /* kokaine/reactive/signal<12089> */ ) {
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
            return $std_core_hnd.yield_extend(function(_y_x10466_0 /* list<kokaine/html/view<12090>> */ ) {
              return _mlift_create_keyed_row_11636(_y_x10466_0);
            });
          }
          else {
            return _mlift_create_keyed_row_11636(x_1_12133);
          }
        });
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(tree_0 /* kokaine/html/view<12090> */ ) {
      return _mlift_create_keyed_row_11637(committed_1, first_2, identity_1, index_1, index_source_1, item_1, item_source_1, parent_0, renderer_0, root_0, row_last_2, scope_2, tree_0);
    });
  }
  else {
    return _mlift_create_keyed_row_11637(committed_1, first_2, identity_1, index_1, index_source_1, item_1, item_source_1, parent_0, renderer_0, root_0, row_last_2, scope_2, x_0_12130);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11639(_y_x10460) /* (kokaine/reactive/internal/model/signal<int>) -> exn kokaine/reactive/signal<int> */  {
  return _y_x10460;
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11640(children_0, committed_2, first_3, identity_2, index_2, item_2, item_source_2, parent_1, renderer_1, root_1, row_last_3, scope_3, index_source_2) /* forall<a,b,e> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), committed : ref<global,bool>, first : node, identity : a, index : int, item : b, item-source : kokaine/reactive/signal<b>, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, row-last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, index-source : kokaine/reactive/signal<int>) -> <exn,div,kokaine/reactive/effects/signal-write,ui> keyed-row<e,b,a> */  {
   
  var x_2_12135 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10462_0 /* hnd/ev-index */ ) {
      return _mlift_create_keyed_row_11638(children_0, committed_2, first_3, identity_2, index_2, index_source_2, item_2, item_source_2, parent_1, renderer_1, root_1, row_last_3, scope_3, _y_x10462_0);
    });
  }
  else {
    return _mlift_create_keyed_row_11638(children_0, committed_2, first_3, identity_2, index_2, index_source_2, item_2, item_source_2, parent_1, renderer_1, root_1, row_last_3, scope_3, x_2_12135);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11641(_y_x10458) /* forall<a> (kokaine/reactive/internal/model/signal<a>) -> exn kokaine/reactive/signal<a> */  {
  return _y_x10458;
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11642(children_1, committed_3, first_4, identity_3, index_3, item_3, parent_2, renderer_2, root_2, row_last_4, scope_4, item_source_3) /* forall<a,b,e> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), committed : ref<global,bool>, first : node, identity : a, index : int, item : b, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, row-last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, item-source : kokaine/reactive/signal<b>) -> <exn,div,kokaine/reactive/effects/signal-write,ui> keyed-row<e,b,a> */  {
   
  var x_3_12137 = $std_core_hnd._open_at2(0, function(root_3 /* kokaine/reactive/root<ui> */ , initial_0 /* int */ ) {
       
      var root_1_10019_0 = $std_core_hnd._open_none1(function(value_3 /* kokaine/reactive/root<ui> */ ) {
          return value_3;
        }, root_3);
       
      var x_4_12139 = $kokaine_reactive_internal_runtime.signal_by(root_1_10019_0, initial_0, function(___wildcard_x134__29_0 /* int */ , ___wildcard_x134__31_0 /* int */ ) {
          return false;
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_create_keyed_row_11639);
      }
      else {
        return _mlift_create_keyed_row_11639(x_4_12139);
      }
    }, root_2, index_3);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(index_source_3 /* kokaine/reactive/signal<int> */ ) {
      return _mlift_create_keyed_row_11640(children_1, committed_3, first_4, identity_3, index_3, item_3, item_source_3, parent_2, renderer_2, root_2, row_last_4, scope_4, index_source_3);
    });
  }
  else {
    return _mlift_create_keyed_row_11640(children_1, committed_3, first_4, identity_3, index_3, item_3, item_source_3, parent_2, renderer_2, root_2, row_last_4, scope_4, x_3_12137);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11643(_pat_6_0) /* (kokaine/reactive/internal/model/cleanup-registration<ui>) -> exn () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11644(first_5, row_last_5, _y_x10453) /* (first : node, row-last : node, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10453, false, function() {
       
      var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_clean_range(first_5, row_last_5, true);
        });
      var _x105 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
      if (_x105) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_0);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
      }
    });
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11645(children_2, committed_4, first_6, identity_4, index_4, item_4, parent_3, range_owned, renderer_3, root_4, row_last_6, scope_5, wild___1) /* forall<a,b,e> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), committed : ref<global,bool>, first : node, identity : a, index : int, item : b, parent : node, range-owned : ref<global,bool>, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, row-last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, wild_@1 : ()) -> <exn,div,kokaine/reactive/effects/signal-write,ui> keyed-row<e,b,a> */  {
   
  $std_core_hnd._open_none2(transaction_store, range_owned, true);
   
  var x_5_12143 = $std_core_hnd._open_at2(0, function(root_2_0 /* kokaine/reactive/root<ui> */ , initial /* 12089 */ ) {
       
      var root_1_10019 = $std_core_hnd._open_none1(function(value_2 /* kokaine/reactive/root<ui> */ ) {
          return value_2;
        }, root_2_0);
       
      var x_6_12145 = $kokaine_reactive_internal_runtime.signal_by(root_1_10019, initial, function(___wildcard_x134__29 /* 12089 */ , ___wildcard_x134__31 /* 12089 */ ) {
          return false;
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10458_0 /* kokaine/reactive/internal/model/signal<12089> */ ) {
          return _mlift_create_keyed_row_11641(_y_x10458_0);
        });
      }
      else {
        return _mlift_create_keyed_row_11641(x_6_12145);
      }
    }, root_4, item_4);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(item_source_4 /* kokaine/reactive/signal<12089> */ ) {
      return _mlift_create_keyed_row_11642(children_2, committed_4, first_6, identity_4, index_4, item_4, parent_3, renderer_3, root_4, row_last_6, scope_5, item_source_4);
    });
  }
  else {
    return _mlift_create_keyed_row_11642(children_2, committed_4, first_6, identity_4, index_4, item_4, parent_3, renderer_3, root_4, row_last_6, scope_5, x_5_12143);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11646(children_3, committed_5, first_7, identity_5, index_5, installed, item_5, parent_4, range_owned_0, renderer_4, root_5, row_last_7, scope_6, wild__) /* forall<a,b,e> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), committed : ref<global,bool>, first : node, identity : a, index : int, installed : ref<global,bool>, item : b, parent : node, range-owned : ref<global,bool>, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, row-last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, wild_ : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> keyed-row<e,b,a> */  {
   
  $std_core_hnd._open_none2(transaction_store, installed, true);
   
  var x_7_12147 = $std_core_hnd._open_at2(0, function(root_1_0 /* kokaine/reactive/root<ui> */ , cleanup /* () -> <kokaine/reactive/effects/signal-write,pure,ui> () */ ) {
       
      var root_0_10046 = $std_core_hnd._open_none1(function(value_1 /* kokaine/reactive/root<ui> */ ) {
          return value_1;
        }, root_1_0);
       
      var x_8_12149 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046, cleanup);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_create_keyed_row_11643);
      }
      else {
        return _mlift_create_keyed_row_11643(x_8_12149);
      }
    }, root_5, function() {
       
      var x_9_12151 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10453_0 /* hnd/ev-index */ ) {
          return _mlift_create_keyed_row_11644(first_7, row_last_7, _y_x10453_0);
        });
      }
      else {
        return _mlift_create_keyed_row_11644(first_7, row_last_7, x_9_12151);
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___1_0 /* () */ ) {
      return _mlift_create_keyed_row_11645(children_3, committed_5, first_7, identity_5, index_5, item_5, parent_4, range_owned_0, renderer_4, root_5, row_last_7, scope_6, wild___1_0);
    });
  }
  else {
    return _mlift_create_keyed_row_11645(children_3, committed_5, first_7, identity_5, index_5, item_5, parent_4, range_owned_0, renderer_4, root_5, row_last_7, scope_6, x_7_12147);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11647(children_4, committed_6, first_8, identity_6, index_6, installed_0, item_6, last, parent_5, range_owned_1, renderer_5, root_6, scope_7, row_last_8) /* forall<a,b,e> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), committed : ref<global,bool>, first : node, identity : a, index : int, installed : ref<global,bool>, item : b, last : node, parent : node, range-owned : ref<global,bool>, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, scope : kokaine/reactive/integration/lifetime-scope<ui>, row-last : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> keyed-row<e,b,a> */  {
   
  var x_11_12157 = $std_core_hnd._open_at4(0, function(parent_0_0 /* node */ , before /* maybe<node> */ , first_1_0 /* node */ , last_1 /* node */ ) {
      if (before === null) {
         
        var result_1 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_append_marker_pair(parent_0_0, first_1_0, last_1);
          });
        var _x106 = $std_core_hnd._open_none1(dom_attempt_ok, result_1);
        if (_x106) {
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
        var _x107 = $std_core_hnd._open_none1(dom_attempt_ok, result_2);
        if (_x107) {
          return $std_core_hnd._open_none1(dom_attempt_value, result_2);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_2)));
        }
      }
    }, parent_5, $std_core_types.Just(last), first_8, row_last_8);
  if ($std_core_hnd._yielding()) {
    var _x108 = $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_create_keyed_row_11646(children_4, committed_6, first_8, identity_6, index_6, installed_0, item_6, parent_5, range_owned_1, renderer_5, root_6, row_last_8, scope_7, wild___0);
    });
  }
  else {
    var _x108 = _mlift_create_keyed_row_11646(children_4, committed_6, first_8, identity_6, index_6, installed_0, item_6, parent_5, range_owned_1, renderer_5, root_6, row_last_8, scope_7, x_11_12157);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x106 = $std_core_hnd._open_none1(transaction_load, installed_0);
      if (_x106) {
         
        var _x_x1_9_11309 = $std_core_hnd._open_none1(transaction_load, range_owned_1);
        var _x107 = $std_core_hnd._open_none1(function(b /* bool */ ) {
            return (b) ? false : true;
          }, _x_x1_9_11309);
        if (_x107) {
           
          var x_10_12155 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10442_0 /* hnd/ev-index */ ) {
              return _mlift_create_keyed_row_11634(first_8, row_last_8, _y_x10442_0);
            });
          }
          else {
            return _mlift_create_keyed_row_11634(first_8, row_last_8, x_10_12155);
          }
        }
        else {
          return $std_core_types.Unit;
        }
      }
      else {
        return $std_core_types.Unit;
      }
    }, _x108);
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11648(children_5, committed_7, identity_7, index_7, installed_1, item_7, last_0, parent_6, range_owned_2, renderer_6, root_7, scope_8, first_9) /* forall<a,b,e> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), committed : ref<global,bool>, identity : a, index : int, installed : ref<global,bool>, item : b, last : node, parent : node, range-owned : ref<global,bool>, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, scope : kokaine/reactive/integration/lifetime-scope<ui>, first : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> keyed-row<e,b,a> */  {
   
  var x_12_12161 = $std_core_hnd._open_at1(0, dom_attempt, function() {
      return dom_create_comment("/kokaine:for-row");
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(row_last_9 /* node */ ) {
      return _mlift_create_keyed_row_11647(children_5, committed_7, first_9, identity_7, index_7, installed_1, item_7, last_0, parent_6, range_owned_2, renderer_6, root_7, scope_8, row_last_9);
    });
  }
  else {
    return _mlift_create_keyed_row_11647(children_5, committed_7, first_9, identity_7, index_7, installed_1, item_7, last_0, parent_6, range_owned_2, renderer_6, root_7, scope_8, x_12_12161);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11649(_y_x10433) /* (kokaine/reactive/integration/internal/lifetime-scope/lifetime-scope<ui>) -> exn kokaine/reactive/integration/lifetime-scope<ui> */  {
  return _y_x10433;
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11650(children_6, identity_8, index_8, item_8, last_2, parent_7, renderer_7, root_8, scope_9) /* forall<a,b,e> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), identity : a, index : int, item : b, last : node, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, scope : kokaine/reactive/integration/lifetime-scope<ui>) -> <exn,div,kokaine/reactive/effects/signal-write,ui> keyed-row<e,b,a> */  {
   
  var committed_8 = $std_core_hnd._open_none1(transaction_cell, false);
   
  var installed_2 = $std_core_hnd._open_none1(transaction_cell, false);
   
  var range_owned_3 = $std_core_hnd._open_none1(transaction_cell, false);
  return $std_core_hnd.finally_prompt(function() {
      var _x109 = $std_core_hnd._open_none1(transaction_load, committed_8);
      if (_x109) {
        return $std_core_types.Unit;
      }
      else {
         
        var x_13_12165 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10435_0 /* hnd/ev-index */ ) {
            return _mlift_create_keyed_row_11633(scope_9, _y_x10435_0);
          });
        }
        else {
          return _mlift_create_keyed_row_11633(scope_9, x_13_12165);
        }
      }
    }, $kokaine_reactive_integration.with_lifetime_scope(root_8, scope_9, function() {
         
        var x_14_12167 = $std_core_hnd._open_at1(0, dom_attempt, function() {
            return dom_create_comment("kokaine:for-row");
          });
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(first_10 /* node */ ) {
            return _mlift_create_keyed_row_11648(children_6, committed_8, identity_8, index_8, installed_2, item_8, last_2, parent_7, range_owned_3, renderer_7, root_8, scope_9, first_10);
          });
        }
        else {
          return _mlift_create_keyed_row_11648(children_6, committed_8, identity_8, index_8, installed_2, item_8, last_2, parent_7, range_owned_3, renderer_7, root_8, scope_9, x_14_12167);
        }
      }));
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11651(drafts, wild___0_0) /* forall<a,b,e> (drafts : ref<global,list<keyed-row<e,a,b>>>, wild_@0@0 : ()) -> <ui,exn> () */  {
   
  var rows_10106 = $std_core_hnd._open_none1(transaction_load, drafts);
  return exhaust_keyed_row_actions(rows_10106, function(row_0 /* keyed-row<12108,12106,12107> */ ) {
       
      var scope_1_10107 = $std_core_hnd._open_none1(function(_this /* keyed-row<12108,12106,12107> */ ) {
          return _this.row_scope;
        }, row_0);
      return $kokaine_reactive_integration_internal_lifetime_dash_scope.lifetime_scope_fs_dispose($std_core_hnd._open_none1(function(value_6 /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
          return value_6;
        }, scope_1_10107));
    });
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11652(drafts_0, first_0_0, last_0_0, move_phase, move_session, old_order, parent_0_0_0, participation, staged_retirements, _y_x10482) /* forall<a,b,e> (drafts : ref<global,list<keyed-row<e,a,b>>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, move-session : ref<global,any>, old-order : list<keyed-row<e,a,b>>, parent@0@0 : node, participation : keyed-participation, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10482, false, function() {
      return $std_core_hnd.finally_prompt(function() {
          var _x110 = $std_core_hnd._open_none1(transaction_load, move_phase);
          if (_x110) {
            return rollback_keyed_order(parent_0_0_0, first_0_0, last_0_0, old_order, $std_core_hnd._open_none1(transaction_load, move_session));
          }
          else {
            return $std_core_types.Unit;
          }
        }, $std_core_hnd.finally_prompt(function() {
             
            var _x_x1_15_11352 = $std_core_hnd._open_none1(transaction_load, staged_retirements);
             
            var x_15_12174 = $std_core_hnd._open_none1(release_keyed_retirements, _x_x1_15_11352);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(wild___0_0_0 /* () */ ) {
                return _mlift_reconcile_keyed_11651(drafts_0, wild___0_0_0);
              });
            }
            else {
              return _mlift_reconcile_keyed_11651(drafts_0, x_15_12174);
            }
          }, discard_keyed_participation(participation)));
    });
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11653(table, _y_x10542) /* forall<a,b,e> (table : ref<global,keyed-table<e,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10542, false, function() {
      return drain_keyed_retirements(table);
    });
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11654(final_updates, _y_x10536) /* forall<a,b,e> (final-updates : list<keyed-update<e,a,b>>, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-write> () */  {
  return $std_core_hnd._mask_at(_y_x10536, false, function() {
      return $std_core_list.foreach(final_updates, function(update_1 /* keyed-update<12108,12106,12107> */ ) {
          return commit_keyed_update(update_1);
        });
    });
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11655(committed_0_0, final_index, final_order, retirements, staged_retirements_0, table_0, wild___16) /* forall<a,b,e> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, final-order : list<keyed-row<e,a,b>>, retirements : list<keyed-retirement<e,a,b>>, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, table : ref<global,keyed-table<e,a,b>>, wild_@16 : ()) -> <ui,div,exn,kokaine/reactive/effects/signal-write> () */  {
   
  $std_core_hnd._open_none2(transaction_store, table_0, Keyed_table(final_index, final_order, retirements));
   
  $std_core_hnd._open_none2(transaction_store, staged_retirements_0, $std_core_types.Nil);
   
  $std_core_hnd._open_none2(transaction_store, committed_0_0, true);
   
  var x_16_12178 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10542_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11653(table_0, _y_x10542_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11653(table_0, x_16_12178);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11656(committed_0_1, final_index_0, final_order_0, final_updates_0, retirements_0, staged_retirements_1, table_1, wild___15) /* forall<a,b,e> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, final-order : list<keyed-row<e,a,b>>, final-updates : list<keyed-update<e,a,b>>, retirements : list<keyed-retirement<e,a,b>>, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, table : ref<global,keyed-table<e,a,b>>, wild_@15 : ()) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_18_12183 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
   
  if ($std_core_hnd._yielding()) {
    var x_17_12180 = $std_core_hnd.yield_extend(function(_y_x10536_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11654(final_updates_0, _y_x10536_0);
    });
  }
  else {
    var x_17_12180 = _mlift_reconcile_keyed_11654(final_updates_0, x_18_12183);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___16_0 /* () */ ) {
      return _mlift_reconcile_keyed_11655(committed_0_1, final_index_0, final_order_0, retirements_0, staged_retirements_1, table_1, wild___16_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11655(committed_0_1, final_index_0, final_order_0, retirements_0, staged_retirements_1, table_1, x_17_12180);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11657(committed_0_2, final_index_1, final_order_1, final_updates_1, publication_transaction, retirements_1, staged_retirements_2, table_2, _y_x10533) /* forall<a,b,e> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, final-order : list<keyed-row<e,a,b>>, final-updates : list<keyed-update<e,a,b>>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, retirements : list<keyed-retirement<e,a,b>>, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, table : ref<global,keyed-table<e,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_19_12185 = $std_core_hnd._mask_at(_y_x10533, false, function() {
      return $kokaine_dom_internal_keyed_dash_transaction.publish_keyed_transaction(publication_transaction);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___15_0 /* () */ ) {
      return _mlift_reconcile_keyed_11656(committed_0_2, final_index_1, final_order_1, final_updates_1, retirements_1, staged_retirements_2, table_2, wild___15_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11656(committed_0_2, final_index_1, final_order_1, final_updates_1, retirements_1, staged_retirements_2, table_2, x_19_12185);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11658(committed_0_3, final_index_2, final_order_2, final_updates_2, publication_transaction_0, retirements_2, staged_retirements_3, table_3, wild___14) /* forall<a,b,e> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, final-order : list<keyed-row<e,a,b>>, final-updates : list<keyed-update<e,a,b>>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, retirements : list<keyed-retirement<e,a,b>>, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, table : ref<global,keyed-table<e,a,b>>, wild_@14 : ()) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_20_12187 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10533_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11657(committed_0_3, final_index_2, final_order_2, final_updates_2, publication_transaction_0, retirements_2, staged_retirements_3, table_3, _y_x10533_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11657(committed_0_3, final_index_2, final_order_2, final_updates_2, publication_transaction_0, retirements_2, staged_retirements_3, table_3, x_20_12187);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11659(committed_0_4, final_index_3, final_order_3, final_updates_3, participation_0, publication_transaction_1, retirements_3, staged_retirements_4, table_4, _y_x10529) /* forall<a,b,e> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, final-order : list<keyed-row<e,a,b>>, final-updates : list<keyed-update<e,a,b>>, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, retirements : list<keyed-retirement<e,a,b>>, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, table : ref<global,keyed-table<e,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_21_12189 = $std_core_hnd._mask_at(_y_x10529, false, function() {
      if (participation_0._tag === 1) {
        return $kokaine_reactive_integration_internal_provision.promote_provision($std_core_hnd._open_none1(function(value_4 /* kokaine/reactive/integration/provision-lease<ui> */ ) {
            return value_4;
          }, participation_0.keyed_lease));
      }
      else {
        return $std_core_types.Unit;
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___14_0 /* () */ ) {
      return _mlift_reconcile_keyed_11658(committed_0_4, final_index_3, final_order_3, final_updates_3, publication_transaction_1, retirements_3, staged_retirements_4, table_4, wild___14_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11658(committed_0_4, final_index_3, final_order_3, final_updates_3, publication_transaction_1, retirements_3, staged_retirements_4, table_4, x_21_12189);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11660(committed_0_5, final_index_4, final_order_4, final_updates_4, participation_1, publication_transaction_2, retirements_4, staged_retirements_5, table_5, wild___13) /* forall<a,b,e> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, final-order : list<keyed-row<e,a,b>>, final-updates : list<keyed-update<e,a,b>>, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, retirements : list<keyed-retirement<e,a,b>>, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, table : ref<global,keyed-table<e,a,b>>, wild_@13 : ()) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_22_12191 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10529_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11659(committed_0_5, final_index_4, final_order_4, final_updates_4, participation_1, publication_transaction_2, retirements_4, staged_retirements_5, table_5, _y_x10529_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11659(committed_0_5, final_index_4, final_order_4, final_updates_4, participation_1, publication_transaction_2, retirements_4, staged_retirements_5, table_5, x_22_12191);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11661(committed_0_6, final_index_5, final_order_5, final_updates_5, participation_2, publication_transaction_3, retirements_5, staged_retirements_6, table_6, _y_x10526) /* forall<a,b,e> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, final-order : list<keyed-row<e,a,b>>, final-updates : list<keyed-update<e,a,b>>, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, retirements : list<keyed-retirement<e,a,b>>, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, table : ref<global,keyed-table<e,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_23_12193 = $std_core_hnd._mask_at(_y_x10526, false, function() {
      return $kokaine_dom_internal_keyed_dash_transaction.prepare_keyed_transaction(publication_transaction_3);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___13_0 /* () */ ) {
      return _mlift_reconcile_keyed_11660(committed_0_6, final_index_5, final_order_5, final_updates_5, participation_2, publication_transaction_3, retirements_5, staged_retirements_6, table_6, wild___13_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11660(committed_0_6, final_index_5, final_order_5, final_updates_5, participation_2, publication_transaction_3, retirements_5, staged_retirements_6, table_6, x_23_12193);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11662(committed_0_7, final_index_6, final_order_6, final_updates_6, participation_3, publication_transaction_4, staged_retirements_7, table_7, retirements_6) /* forall<a,b,e> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, final-order : list<keyed-row<e,a,b>>, final-updates : list<keyed-update<e,a,b>>, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, table : ref<global,keyed-table<e,a,b>>, retirements : list<keyed-retirement<e,a,b>>) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  $std_core_hnd._open_none2(transaction_store, staged_retirements_7, retirements_6);
   
  var x_24_12195 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10526_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11661(committed_0_7, final_index_6, final_order_6, final_updates_6, participation_3, publication_transaction_4, retirements_6, staged_retirements_7, table_7, _y_x10526_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11661(committed_0_7, final_index_6, final_order_6, final_updates_6, participation_3, publication_transaction_4, retirements_6, staged_retirements_7, table_7, x_24_12195);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11663(committed_0_8, final_index_7, final_order_7, final_updates_7, participation_4, publication_transaction_5, staged_retirements_8, stale, table_8, wild___11) /* forall<a,b,e> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, final-order : list<keyed-row<e,a,b>>, final-updates : list<keyed-update<e,a,b>>, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, stale : list<keyed-row<e,a,b>>, table : ref<global,keyed-table<e,a,b>>, wild_@11 : ()) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_25_12197 = $std_core_hnd._open_at1(0, function(rows_0 /* list<keyed-row<12108,12106,12107>> */ ) {
      return stage_keyed_retirements_loop(rows_0, $std_core_types.Nil);
    }, stale);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(retirements_7 /* list<keyed-retirement<12108,12106,12107>> */ ) {
      return _mlift_reconcile_keyed_11662(committed_0_8, final_index_7, final_order_7, final_updates_7, participation_4, publication_transaction_5, staged_retirements_8, table_8, retirements_7);
    });
  }
  else {
    return _mlift_reconcile_keyed_11662(committed_0_8, final_index_7, final_order_7, final_updates_7, participation_4, publication_transaction_5, staged_retirements_8, table_8, x_25_12197);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11664(committed_0_9, final_index_8, final_order_8, final_updates_8, participation_5, publication_transaction_6, root_0_0, scope_0_0, staged_retirements_9, stale_0, table_9, _y_x10521) /* forall<a,b,e> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, final-order : list<keyed-row<e,a,b>>, final-updates : list<keyed-update<e,a,b>>, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, stale : list<keyed-row<e,a,b>>, table : ref<global,keyed-table<e,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_26_12199 = $std_core_hnd._mask_at(_y_x10521, false, function() {
      return $kokaine_reactive_integration.with_lifetime_scope(root_0_0, scope_0_0, function() {
          return $std_core_types.Unit;
        });
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___11_0 /* () */ ) {
      return _mlift_reconcile_keyed_11663(committed_0_9, final_index_8, final_order_8, final_updates_8, participation_5, publication_transaction_6, staged_retirements_9, stale_0, table_9, wild___11_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11663(committed_0_9, final_index_8, final_order_8, final_updates_8, participation_5, publication_transaction_6, staged_retirements_9, stale_0, table_9, x_26_12199);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11665(committed_0_10, final_index_9, final_order_9, final_updates_9, participation_6, publication_transaction_7, root_0_0_0, scope_0_0_0, staged_retirements_10, stale_1, table_10, wild___10) /* forall<a,b,e> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, final-order : list<keyed-row<e,a,b>>, final-updates : list<keyed-update<e,a,b>>, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, stale : list<keyed-row<e,a,b>>, table : ref<global,keyed-table<e,a,b>>, wild_@10 : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_27_12201 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10521_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11664(committed_0_10, final_index_9, final_order_9, final_updates_9, participation_6, publication_transaction_7, root_0_0_0, scope_0_0_0, staged_retirements_10, stale_1, table_10, _y_x10521_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11664(committed_0_10, final_index_9, final_order_9, final_updates_9, participation_6, publication_transaction_7, root_0_0_0, scope_0_0_0, staged_retirements_10, stale_1, table_10, x_27_12201);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11666(committed_0_11, final_index_10, final_order_10, final_updates_10, last_0_0_0, parent_0_0_1, participation_7, physical_order, publication_transaction_8, root_0_0_1, scope_0_0_1, staged_retirements_11, stale_2, table_11, placed) /* forall<a,b,e> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, final-order : list<keyed-row<e,a,b>>, final-updates : list<keyed-update<e,a,b>>, last@0@0 : node, parent@0@0 : node, participation : keyed-participation, physical-order : list<keyed-row<e,a,b>>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, stale : list<keyed-row<e,a,b>>, table : ref<global,keyed-table<e,a,b>>, placed : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_28_12203 = $std_core_hnd._open_at4(0, validate_keyed_order, parent_0_0_1, last_0_0_0, placed, physical_order);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___10_0 /* () */ ) {
      return _mlift_reconcile_keyed_11665(committed_0_11, final_index_10, final_order_10, final_updates_10, participation_7, publication_transaction_8, root_0_0_1, scope_0_0_1, staged_retirements_11, stale_2, table_11, wild___10_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11665(committed_0_11, final_index_10, final_order_10, final_updates_10, participation_7, publication_transaction_8, root_0_0_1, scope_0_0_1, staged_retirements_11, stale_2, table_11, x_28_12203);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11667(committed_0_12, final_index_11, final_order_11, final_updates_11, first_0_0_0, last_0_0_1, parent_0_0_2, participation_8, physical_order_0, publication_transaction_9, root_0_0_2, scope_0_0_2, staged_retirements_12, stale_3, table_12, _c_x10517) /* forall<a,b,e> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, final-order : list<keyed-row<e,a,b>>, final-updates : list<keyed-update<e,a,b>>, first@0@0 : node, last@0@0 : node, parent@0@0 : node, participation : keyed-participation, physical-order : list<keyed-row<e,a,b>>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, stale : list<keyed-row<e,a,b>>, table : ref<global,keyed-table<e,a,b>>, ()) -> () */  {
   
  var x_29_12205 = $std_core_hnd._open_at3(0, function(parent_3_0 /* node */ , first_5_0 /* node */ , last_5 /* node */ ) {
       
      var result_3 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_range_first(parent_3_0, first_5_0, last_5);
        });
      var _x111 = $std_core_hnd._open_none1(dom_attempt_ok, result_3);
      if (_x111) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_3);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_3)));
      }
    }, parent_0_0_2, first_0_0_0, last_0_0_1);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(placed_0 /* node */ ) {
      return _mlift_reconcile_keyed_11666(committed_0_12, final_index_11, final_order_11, final_updates_11, last_0_0_1, parent_0_0_2, participation_8, physical_order_0, publication_transaction_9, root_0_0_2, scope_0_0_2, staged_retirements_12, stale_3, table_12, placed_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11666(committed_0_12, final_index_11, final_order_11, final_updates_11, last_0_0_1, parent_0_0_2, participation_8, physical_order_0, publication_transaction_9, root_0_0_2, scope_0_0_2, staged_retirements_12, stale_3, table_12, x_29_12205);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11668(committed_0_13, final_index_12, final_order_12, final_updates_12, first_0_0_1, last_0_0_2, move_phase_0, move_session_0, parent_0_0_3, participation_9, physical_order_1, publication_transaction_10, root_0_0_3, scope_0_0_3, staged_retirements_13, stale_4, table_13, _y_x10515) /* forall<a,b,e> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, final-order : list<keyed-row<e,a,b>>, final-updates : list<keyed-update<e,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, move-session : ref<global,any>, parent@0@0 : node, participation : keyed-participation, physical-order : list<keyed-row<e,a,b>>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, stale : list<keyed-row<e,a,b>>, table : ref<global,keyed-table<e,a,b>>, bool) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var order_changed = $std_core_hnd._open_none1(function(b_1 /* bool */ ) {
      return (b_1) ? false : true;
    }, _y_x10515);
   
  if (order_changed) {
    var x_30_12208 = $std_core_hnd._open_at0(0, function() {
        return move_keyed_rows(parent_0_0_3, first_0_0_1, last_0_0_2, physical_order_1, move_session_0, move_phase_0);
      });
  }
  else {
    var x_30_12208 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10517_0 /* () */ ) {
      return _mlift_reconcile_keyed_11667(committed_0_13, final_index_12, final_order_12, final_updates_12, first_0_0_1, last_0_0_2, parent_0_0_3, participation_9, physical_order_1, publication_transaction_10, root_0_0_3, scope_0_0_3, staged_retirements_13, stale_4, table_13, _c_x10517_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11667(committed_0_13, final_index_12, final_order_12, final_updates_12, first_0_0_1, last_0_0_2, parent_0_0_3, participation_9, physical_order_1, publication_transaction_10, root_0_0_3, scope_0_0_3, staged_retirements_13, stale_4, table_13, x_30_12208);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11669(committed_0_14, final_index_13, final_order_13, final_updates_13, first_0_0_2, last_0_0_3, move_phase_1, move_session_1, parent_0_0_4, participation_10, physical_order_2, publication_transaction_11, root_0_0_4, scope_0_0_4, staged_retirements_14, stale_5, table_14, current_cursor) /* forall<a,b,e> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, final-order : list<keyed-row<e,a,b>>, final-updates : list<keyed-update<e,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, move-session : ref<global,any>, parent@0@0 : node, participation : keyed-participation, physical-order : list<keyed-row<e,a,b>>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, stale : list<keyed-row<e,a,b>>, table : ref<global,keyed-table<e,a,b>>, current-cursor : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_31_12210 = $std_core_hnd._open_at4(0, keyed_order_matches, parent_0_0_4, last_0_0_3, current_cursor, physical_order_2);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10515_0 /* bool */ ) {
      return _mlift_reconcile_keyed_11668(committed_0_14, final_index_13, final_order_13, final_updates_13, first_0_0_2, last_0_0_3, move_phase_1, move_session_1, parent_0_0_4, participation_10, physical_order_2, publication_transaction_11, root_0_0_4, scope_0_0_4, staged_retirements_14, stale_5, table_14, _y_x10515_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11668(committed_0_14, final_index_13, final_order_13, final_updates_13, first_0_0_2, last_0_0_3, move_phase_1, move_session_1, parent_0_0_4, participation_10, physical_order_2, publication_transaction_11, root_0_0_4, scope_0_0_4, staged_retirements_14, stale_5, table_14, x_31_12210);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11670(committed_0_15, final_index_14, final_order_14, final_updates_14, first_0_0_3, last_0_0_4, move_phase_2, move_session_2, parent_0_0_5, participation_11, publication_transaction_12, root_0_0_5, scope_0_0_5, staged_retirements_15, stale_6, table_15, wild___8) /* forall<a,b,e> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, final-order : list<keyed-row<e,a,b>>, final-updates : list<keyed-update<e,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, move-session : ref<global,any>, parent@0@0 : node, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, stale : list<keyed-row<e,a,b>>, table : ref<global,keyed-table<e,a,b>>, wild_@8 : ()) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var physical_order_3 = $std_core_list.append(final_order_14, stale_6);
   
  var x_32_12212 = $std_core_hnd._open_at3(0, function(parent_2_0 /* node */ , first_4_0 /* node */ , last_4 /* node */ ) {
       
      var result_4 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_range_first(parent_2_0, first_4_0, last_4);
        });
      var _x111 = $std_core_hnd._open_none1(dom_attempt_ok, result_4);
      if (_x111) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_4);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_4)));
      }
    }, parent_0_0_5, first_0_0_3, last_0_0_4);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(current_cursor_0 /* node */ ) {
      return _mlift_reconcile_keyed_11669(committed_0_15, final_index_14, final_order_14, final_updates_14, first_0_0_3, last_0_0_4, move_phase_2, move_session_2, parent_0_0_5, participation_11, physical_order_3, publication_transaction_12, root_0_0_5, scope_0_0_5, staged_retirements_15, stale_6, table_15, current_cursor_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11669(committed_0_15, final_index_14, final_order_14, final_updates_14, first_0_0_3, last_0_0_4, move_phase_2, move_session_2, parent_0_0_5, participation_11, physical_order_3, publication_transaction_12, root_0_0_5, scope_0_0_5, staged_retirements_15, stale_6, table_15, x_32_12212);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11671(committed_0_16, final_index_15, final_order_15, final_updates_15, first_0_0_4, last_0_0_5, move_phase_3, move_session_3, parent_0_0_6, participation_12, publication_transaction_13, renderer_0_0, root_0_0_6, scope_0_0_6, staged_retirements_16, stale_7, table_16, _y_x10510) /* forall<a,b,e> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, final-order : list<keyed-row<e,a,b>>, final-updates : list<keyed-update<e,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, move-session : ref<global,any>, parent@0@0 : node, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, stale : list<keyed-row<e,a,b>>, table : ref<global,keyed-table<e,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_33_12215 = $std_core_hnd._mask_at(_y_x10510, false, function() {
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
      return _mlift_reconcile_keyed_11670(committed_0_16, final_index_15, final_order_15, final_updates_15, first_0_0_4, last_0_0_5, move_phase_3, move_session_3, parent_0_0_6, participation_12, publication_transaction_13, root_0_0_6, scope_0_0_6, staged_retirements_16, stale_7, table_16, wild___8_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11670(committed_0_16, final_index_15, final_order_15, final_updates_15, first_0_0_4, last_0_0_5, move_phase_3, move_session_3, parent_0_0_6, participation_12, publication_transaction_13, root_0_0_6, scope_0_0_6, staged_retirements_16, stale_7, table_16, x_33_12215);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11672(root_0_0_7, scope_0_0_7, wild___22) /* (root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, wild_@22 : ()) -> <ui,exn> () */  {
  return $kokaine_reactive_integration.with_lifetime_scope(root_0_0_7, scope_0_0_7, function() {
      return $std_core_types.Unit;
    });
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11673(final_order_16, last_0_0_6, parent_0_0_7, root_0_0_8, scope_0_0_8, placed_0_0) /* forall<a,b,e> (final-order : list<keyed-row<e,a,b>>, last@0@0 : node, parent@0@0 : node, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, placed@0 : node) -> <ui,exn> () */  {
   
  var x_34_12219 = validate_keyed_order(parent_0_0_7, last_0_0_6, placed_0_0, final_order_16);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___22_0 /* () */ ) {
      return _mlift_reconcile_keyed_11672(root_0_0_8, scope_0_0_8, wild___22_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11672(root_0_0_8, scope_0_0_8, x_34_12219);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11674(final_order_17, first_0_0_5, last_0_0_7, parent_0_0_8, root_0_0_9, scope_0_0_9, _c_x10554) /* forall<a,b,e> (final-order : list<keyed-row<e,a,b>>, first@0@0 : node, last@0@0 : node, parent@0@0 : node, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, ()) -> () */  {
   
  var result_5 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_range_first(parent_0_0_8, first_0_0_5, last_0_0_7);
    });
   
  var _x111 = $std_core_hnd._open_none1(dom_attempt_ok, result_5);
  if (_x111) {
    var x_35_12221 = $std_core_hnd._open_none1(dom_attempt_value, result_5);
  }
  else {
    var x_35_12221 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_5)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(placed_0_1 /* node */ ) {
      return _mlift_reconcile_keyed_11673(final_order_17, last_0_0_7, parent_0_0_8, root_0_0_9, scope_0_0_9, placed_0_1);
    });
  }
  else {
    return _mlift_reconcile_keyed_11673(final_order_17, last_0_0_7, parent_0_0_8, root_0_0_9, scope_0_0_9, x_35_12221);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11675(final_order_18, first_0_0_6, last_0_0_8, move_phase_4, move_session_4, parent_0_0_9, root_0_0_10, scope_0_0_10, _y_x10552) /* forall<a,b,e> (final-order : list<keyed-row<e,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, move-session : ref<global,any>, parent@0@0 : node, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, bool) -> <ui,exn> () */  {
   
  var order_changed_0 = $std_core_hnd._open_none1(function(b_4 /* bool */ ) {
      return (b_4) ? false : true;
    }, _y_x10552);
   
  if (order_changed_0) {
    var x_36_12224 = move_keyed_rows(parent_0_0_9, first_0_0_6, last_0_0_8, final_order_18, move_session_4, move_phase_4);
  }
  else {
    var x_36_12224 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10554_0 /* () */ ) {
      return _mlift_reconcile_keyed_11674(final_order_18, first_0_0_6, last_0_0_8, parent_0_0_9, root_0_0_10, scope_0_0_10, _c_x10554_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11674(final_order_18, first_0_0_6, last_0_0_8, parent_0_0_9, root_0_0_10, scope_0_0_10, x_36_12224);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11676(final_order_19, first_0_0_7, last_0_0_9, move_phase_5, move_session_5, parent_0_0_10, root_0_0_11, scope_0_0_11, current_cursor_0_0) /* forall<a,b,e> (final-order : list<keyed-row<e,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, move-session : ref<global,any>, parent@0@0 : node, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, current-cursor@0 : node) -> <ui,exn> () */  {
   
  var x_37_12226 = keyed_order_matches(parent_0_0_10, last_0_0_9, current_cursor_0_0, final_order_19);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10552_0 /* bool */ ) {
      return _mlift_reconcile_keyed_11675(final_order_19, first_0_0_7, last_0_0_9, move_phase_5, move_session_5, parent_0_0_10, root_0_0_11, scope_0_0_11, _y_x10552_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11675(final_order_19, first_0_0_7, last_0_0_9, move_phase_5, move_session_5, parent_0_0_10, root_0_0_11, scope_0_0_11, x_37_12226);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11677(enlisted, wild___24) /* (enlisted : ref<global,bool>, wild_@24 : ()) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._open_none2(transaction_store, enlisted, true);
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11678(committed_0_17, drafts_1, enlisted_0, final_index_16, final_order_20, first_0_0_8, last_0_0_10, move_phase_6, move_session_6, old_order_0, parent_0_0_11, publication_transaction_14, root_0_0_12, scope_0_0_12, table_17, _y_x10550) /* forall<a,b,e> (committed@0 : ref<global,bool>, drafts : ref<global,list<keyed-row<e,a,b>>>, enlisted : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, final-order : list<keyed-row<e,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, move-session : ref<global,any>, old-order : list<keyed-row<e,a,b>>, parent@0@0 : node, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, table : ref<global,keyed-table<e,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_38_12228 = $std_core_hnd._mask_at(_y_x10550, false, function() {
      return $kokaine_dom_internal_keyed_dash_transaction.stage_keyed_publication(publication_transaction_14, function() {
           
          var result_6 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
              return dom_range_first(parent_0_0_11, first_0_0_8, last_0_0_10);
            });
           
          var _x111 = $std_core_hnd._open_none1(dom_attempt_ok, result_6);
          if (_x111) {
            var x_39_12230 = $std_core_hnd._open_none1(dom_attempt_value, result_6);
          }
          else {
            var x_39_12230 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_6)));
          }
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(current_cursor_0_1 /* node */ ) {
              return _mlift_reconcile_keyed_11676(final_order_20, first_0_0_8, last_0_0_10, move_phase_6, move_session_6, parent_0_0_11, root_0_0_12, scope_0_0_12, current_cursor_0_1);
            });
          }
          else {
            return _mlift_reconcile_keyed_11676(final_order_20, first_0_0_8, last_0_0_10, move_phase_6, move_session_6, parent_0_0_11, root_0_0_12, scope_0_0_12, x_39_12230);
          }
        }, function() {
           
          transaction_store(table_17, Keyed_table(final_index_16, final_order_20, $std_core_types.Nil));
          return transaction_store(committed_0_17, true);
        }, function() {
           
          var rows_1_10123 = $std_core_hnd._open_none1(transaction_load, drafts_1);
          return $std_core_hnd.finally_prompt(function() {
              var _x111 = $std_core_hnd._open_none1(transaction_load, move_phase_6);
              if (_x111) {
                return rollback_keyed_order(parent_0_0_11, first_0_0_8, last_0_0_10, old_order_0, $std_core_hnd._open_none1(transaction_load, move_session_6));
              }
              else {
                return $std_core_types.Unit;
              }
            }, exhaust_keyed_row_actions(rows_1_10123, function(row_1 /* keyed-row<12108,12106,12107> */ ) {
                 
                var scope_2_10124 = $std_core_hnd._open_none1(function(_this_4 /* keyed-row<12108,12106,12107> */ ) {
                    return _this_4.row_scope;
                  }, row_1);
                return $kokaine_reactive_integration_internal_lifetime_dash_scope.lifetime_scope_fs_dispose($std_core_hnd._open_none1(function(value_7 /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
                    return value_7;
                  }, scope_2_10124));
              }));
        });
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___24_0 /* () */ ) {
      return _mlift_reconcile_keyed_11677(enlisted_0, wild___24_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11677(enlisted_0, x_38_12228);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11679(committed_0_18, drafts_2, enlisted_1, final_index_17, final_order_21, first_0_0_9, last_0_0_11, move_phase_7, move_session_7, old_order_1, parent_0_0_12, publication_transaction_15, root_0_0_13, scope_0_0_13, table_18, _c_x10549) /* forall<a,b,e> (committed@0 : ref<global,bool>, drafts : ref<global,list<keyed-row<e,a,b>>>, enlisted : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, final-order : list<keyed-row<e,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, move-session : ref<global,any>, old-order : list<keyed-row<e,a,b>>, parent@0@0 : node, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, table : ref<global,keyed-table<e,a,b>>, ()) -> () */  {
   
  var x_40_12235 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10550_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11678(committed_0_18, drafts_2, enlisted_1, final_index_17, final_order_21, first_0_0_9, last_0_0_11, move_phase_7, move_session_7, old_order_1, parent_0_0_12, publication_transaction_15, root_0_0_13, scope_0_0_13, table_18, _y_x10550_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11678(committed_0_18, drafts_2, enlisted_1, final_index_17, final_order_21, first_0_0_9, last_0_0_11, move_phase_7, move_session_7, old_order_1, parent_0_0_12, publication_transaction_15, root_0_0_13, scope_0_0_13, table_18, x_40_12235);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11680(committed_0_19, drafts_3, enlisted_2, final_index_18, final_updates_16, first_0_0_10, last_0_0_12, move_phase_8, move_session_8, old_order_2, owns_provision, parent_0_0_13, participation_13, publication_transaction_16, renderer_0_1, root_0_0_14, scope_0_0_14, staged_retirements_17, stale_8, table_19, final_order_22) /* forall<a,b,e> (committed@0 : ref<global,bool>, drafts : ref<global,list<keyed-row<e,a,b>>>, enlisted : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, final-updates : list<keyed-update<e,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, move-session : ref<global,any>, old-order : list<keyed-row<e,a,b>>, owns-provision : bool, parent@0@0 : node, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, stale : list<keyed-row<e,a,b>>, table : ref<global,keyed-table<e,a,b>>, final-order : list<keyed-row<e,a,b>>) -> <div,exn,kokaine/reactive/effects/signal-write,ui> () */  {
  if (owns_provision) {
     
    var x_41_12237 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10510_0 /* hnd/ev-index */ ) {
        return _mlift_reconcile_keyed_11671(committed_0_19, final_index_18, final_order_22, final_updates_16, first_0_0_10, last_0_0_12, move_phase_8, move_session_8, parent_0_0_13, participation_13, publication_transaction_16, renderer_0_1, root_0_0_14, scope_0_0_14, staged_retirements_17, stale_8, table_19, _y_x10510_0);
      });
    }
    else {
      return _mlift_reconcile_keyed_11671(committed_0_19, final_index_18, final_order_22, final_updates_16, first_0_0_10, last_0_0_12, move_phase_8, move_session_8, parent_0_0_13, participation_13, publication_transaction_16, renderer_0_1, root_0_0_14, scope_0_0_14, staged_retirements_17, stale_8, table_19, x_41_12237);
    }
  }
  else {
     
    var _x_x1_74_11461 = $std_core_hnd._open_none1(function(list /* list<keyed-row<12108,12106,12107>> */ ) {
        return (list === null);
      }, old_order_2);
     
    var _x111 = $std_core_hnd._open_none1(function(b_2 /* bool */ ) {
        return (b_2) ? false : true;
      }, _x_x1_74_11461);
    if (_x111) {
      var x_42_12239 = $std_core_hnd._open_at2(0, $std_core_exn.$throw, "joined keyed reconciliation must be initial construction");
    }
    else {
       
      var _x_x1_77_11465 = $std_core_hnd._open_none1(function(list_0 /* list<keyed-row<12108,12106,12107>> */ ) {
          return (list_0 === null);
        }, stale_8);
      var _x112 = $std_core_hnd._open_none1(function(b_3 /* bool */ ) {
          return (b_3) ? false : true;
        }, _x_x1_77_11465);
      if (_x112) {
        var x_42_12239 = $std_core_hnd._open_at2(0, $std_core_exn.$throw, "joined keyed reconciliation must be initial construction");
      }
      else {
        var x_42_12239 = $std_core_types.Unit;
      }
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10549_0 /* () */ ) {
        return _mlift_reconcile_keyed_11679(committed_0_19, drafts_3, enlisted_2, final_index_18, final_order_22, first_0_0_10, last_0_0_12, move_phase_8, move_session_8, old_order_2, parent_0_0_13, publication_transaction_16, root_0_0_14, scope_0_0_14, table_19, _c_x10549_0);
      });
    }
    else {
      return _mlift_reconcile_keyed_11679(committed_0_19, drafts_3, enlisted_2, final_index_18, final_order_22, first_0_0_10, last_0_0_12, move_phase_8, move_session_8, old_order_2, parent_0_0_13, publication_transaction_16, root_0_0_14, scope_0_0_14, table_19, x_42_12239);
    }
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11681(current_index, existing, item_changed, item_0_0, position, updates, _c_x10502) /* forall<a,b,e> (current-index : int, existing : keyed-row<e,a,b>, item-changed : bool, item@0@0 : a, position : ref<global,int>, updates : ref<global,list<keyed-update<e,a,b>>>, ()) -> () */  {
   
  var _x_x1_42_11398 = $std_core_hnd._open_none1(function(_this_1 /* keyed-row<12108,12106,12107> */ ) {
      return _this_1.row_current_index;
    }, existing);
   
  var update = Keyed_update(existing, item_0_0, current_index, item_changed, $std_core_types._int_ne(($std_core_hnd._open_none1(transaction_load, _x_x1_42_11398)),current_index));
   
  var _x_x2_10_11401 = $std_core_types.Cons(update, $std_core_hnd._open_none1(transaction_load, updates));
   
  $std_core_hnd._open_none2(transaction_store, updates, _x_x2_10_11401);
   
  var _x_x2_11_11404 = $std_core_types._int_add(current_index,1);
  return $std_core_hnd._open_none2(transaction_store, position, _x_x2_11_11404);
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11682(current_index_0, draft, item_0_0_0, position_0, updates_0, _c_x10505) /* forall<a,b,e> (current-index : int, draft : keyed-row<e,a,b>, item@0@0 : a, position : ref<global,int>, updates : ref<global,list<keyed-update<e,a,b>>>, ()) -> () */  {
   
  var _x_x1_53_11417 = $std_core_hnd._open_none1(function(_this_2 /* keyed-row<12108,12106,12107> */ ) {
      return _this_2.row_current_index;
    }, draft);
   
  var update_0 = Keyed_update(draft, item_0_0_0, current_index_0, false, $std_core_types._int_ne(($std_core_hnd._open_none1(transaction_load, _x_x1_53_11417)),current_index_0));
   
  var _x_x2_16_11420 = $std_core_types.Cons(update_0, $std_core_hnd._open_none1(transaction_load, updates_0));
   
  $std_core_hnd._open_none2(transaction_store, updates_0, _x_x2_16_11420);
   
  var _x_x2_17_11423 = $std_core_types._int_add(current_index_0,1);
  return $std_core_hnd._open_none2(transaction_store, position_0, _x_x2_17_11423);
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11683(compare, current_index_1, drafts_4, identity_0_0, item_0_0_1, next_index, position_1, updates_1, draft_0) /* forall<a,b,e> (compare : (b, b) -> order, current-index : int, drafts : ref<global,list<keyed-row<e,a,b>>>, identity@0@0 : b, item@0@0 : a, next-index : ref<global,kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>>, position : ref<global,int>, updates : ref<global,list<keyed-update<e,a,b>>>, draft : keyed-row<e,a,b>) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var _x_x2_12_11406 = $std_core_types.Cons(draft_0, $std_core_hnd._open_none1(transaction_load, drafts_4));
   
  $std_core_hnd._open_none2(transaction_store, drafts_4, _x_x2_12_11406);
   
  var _x_x1_49_11408 = $std_core_hnd._open_none1(transaction_load, next_index);
   
  var _x111 = $std_core_hnd._open_none4($kokaine_internal_key_dash_index.insert, _x_x1_49_11408, identity_0_0, draft_0, compare);
  if (_x111._tag === 2) {
    var x_43_12241 = $std_core_hnd._open_at2(0, $std_core_exn.$throw, "duplicate key in keyed For");
  }
  else {
    var x_43_12241 = $std_core_hnd._open_none2(transaction_store, next_index, _x111.index);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10505_0 /* () */ ) {
      return _mlift_reconcile_keyed_11682(current_index_1, draft_0, item_0_0_1, position_1, updates_1, _c_x10505_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11682(current_index_1, draft_0, item_0_0_1, position_1, updates_1, x_43_12241);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11684(committed_0_20, compare_0, drafts_5, enlisted_3, first_0_0_11, last_0_0_13, move_phase_9, move_session_9, next_index_0, old_order_3, owns_provision_0, parent_0_0_14, participation_14, publication_transaction_17, renderer_0_2, root_0_0_15, scope_0_0_15, staged_retirements_18, table_20, updates_2, wild___7) /* forall<a,b,e> (committed@0 : ref<global,bool>, compare : (b, b) -> order, drafts : ref<global,list<keyed-row<e,a,b>>>, enlisted : ref<global,bool>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, move-session : ref<global,any>, next-index : ref<global,kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>>, old-order : list<keyed-row<e,a,b>>, owns-provision : bool, parent@0@0 : node, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, table : ref<global,keyed-table<e,a,b>>, updates : ref<global,list<keyed-update<e,a,b>>>, wild_@7 : ()) -> <div,exn,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var xs_0_10972 = $std_core_hnd._open_none1(transaction_load, updates_2);
   
  var final_updates_17 = $std_core_list.reverse_acc($std_core_types.Nil, xs_0_10972);
   
  var final_index_19 = $std_core_hnd._open_none1(transaction_load, next_index_0);
   
  var stale_9 = $std_core_hnd._open_none3(collect_stale_rows, old_order_3, final_index_19, compare_0);
   
  var x_44_12243 = $std_core_list.map(final_updates_17, function(update_0_0 /* keyed-update<12108,12106,12107> */ ) {
      return $std_core_hnd._open_none1(function(_this_3 /* keyed-update<12108,12106,12107> */ ) {
          return _this_3.update_row;
        }, update_0_0);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(final_order_23 /* list<keyed-row<12108,12106,12107>> */ ) {
      return _mlift_reconcile_keyed_11680(committed_0_20, drafts_5, enlisted_3, final_index_19, final_updates_17, first_0_0_11, last_0_0_13, move_phase_9, move_session_9, old_order_3, owns_provision_0, parent_0_0_14, participation_14, publication_transaction_17, renderer_0_2, root_0_0_15, scope_0_0_15, staged_retirements_18, stale_9, table_20, final_order_23);
    });
  }
  else {
    return _mlift_reconcile_keyed_11680(committed_0_20, drafts_5, enlisted_3, final_index_19, final_updates_17, first_0_0_11, last_0_0_13, move_phase_9, move_session_9, old_order_3, owns_provision_0, parent_0_0_14, participation_14, publication_transaction_17, renderer_0_2, root_0_0_15, scope_0_0_15, staged_retirements_18, stale_9, table_20, x_44_12243);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11685(children_0_0, committed_0_21, compare_1, drafts_6, enlisted_4, first_0_0_12, item_equals, keyed_items, last_0_0_14, move_phase_10, move_session_10, next_index_1, old_index, old_order_4, owns_provision_1, parent_0_0_15, participation_15, position_2, publication_transaction_18, renderer_0_3, root_0_0_16, scope_0_0_16, staged_retirements_19, table_21, updates_3, wild___3_0_0) /* forall<a,b,e> (children@0 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), committed@0 : ref<global,bool>, compare : (b, b) -> order, drafts : ref<global,list<keyed-row<e,a,b>>>, enlisted : ref<global,bool>, first@0@0 : node, item-equals : (a, a) -> bool, keyed-items : ref<global,list<(a, b)>>, last@0@0 : node, move-phase : ref<global,bool>, move-session : ref<global,any>, next-index : ref<global,kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>>, old-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, old-order : list<keyed-row<e,a,b>>, owns-provision : bool, parent@0@0 : node, participation : keyed-participation, position : ref<global,int>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, table : ref<global,keyed-table<e,a,b>>, updates : ref<global,list<keyed-update<e,a,b>>>, wild_@3@0 : ()) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var xs_10940 = $std_core_hnd._open_none1(transaction_load, keyed_items);
   
  var x_45_12245 = $std_core_list.foreach($std_core_list.reverse_acc($std_core_types.Nil, xs_10940), function(keyed_item /* (12106, 12107) */ ) {
       
      var current_index_2 = $std_core_hnd._open_none1(transaction_load, position_2);
      var _x111 = $std_core_hnd._open_none3($kokaine_internal_key_dash_index.find, old_index, keyed_item.snd, compare_1);
      if (_x111 !== null) {
         
        var _x_x1_36_11387 = $std_core_hnd._open_none1(function(_this_0 /* keyed-row<12108,12106,12107> */ ) {
            return _this_0.row_current_item;
          }, _x111.value);
         
        var _x_x1_35_11385 = $std_core_hnd._open_none1(transaction_load, _x_x1_36_11387);
         
        var _x_x1_34_11384 = $std_core_hnd._open_none2(item_equals, _x_x1_35_11385, keyed_item.fst);
         
        var item_changed_0 = $std_core_hnd._open_none1(function(b_0 /* bool */ ) {
            return (b_0) ? false : true;
          }, _x_x1_34_11384);
         
        var _x_x1_38_11389 = $std_core_hnd._open_none1(transaction_load, next_index_1);
         
        var _x112 = $std_core_hnd._open_none4($kokaine_internal_key_dash_index.insert, _x_x1_38_11389, keyed_item.snd, _x111.value, compare_1);
        if (_x112._tag === 2) {
          var x_46_12247 = $std_core_hnd._open_at2(0, $std_core_exn.$throw, "duplicate key in keyed For");
        }
        else {
          var x_46_12247 = $std_core_hnd._open_none2(transaction_store, next_index_1, _x112.index);
        }
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_c_x10502_0 /* () */ ) {
            return _mlift_reconcile_keyed_11681(current_index_2, _x111.value, item_changed_0, keyed_item.fst, position_2, updates_3, _c_x10502_0);
          });
        }
        else {
          return _mlift_reconcile_keyed_11681(current_index_2, _x111.value, item_changed_0, keyed_item.fst, position_2, updates_3, x_46_12247);
        }
      }
      else {
         
        var x_47_12249 = create_keyed_row(renderer_0_3, root_0_0_16, parent_0_0_15, last_0_0_14, keyed_item.snd, keyed_item.fst, current_index_2, children_0_0);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(draft_1 /* keyed-row<12108,12106,12107> */ ) {
            return _mlift_reconcile_keyed_11683(compare_1, current_index_2, drafts_6, keyed_item.snd, keyed_item.fst, next_index_1, position_2, updates_3, draft_1);
          });
        }
        else {
          return _mlift_reconcile_keyed_11683(compare_1, current_index_2, drafts_6, keyed_item.snd, keyed_item.fst, next_index_1, position_2, updates_3, x_47_12249);
        }
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___7_0 /* () */ ) {
      return _mlift_reconcile_keyed_11684(committed_0_21, compare_1, drafts_6, enlisted_4, first_0_0_12, last_0_0_14, move_phase_10, move_session_10, next_index_1, old_order_4, owns_provision_1, parent_0_0_15, participation_15, publication_transaction_18, renderer_0_3, root_0_0_16, scope_0_0_16, staged_retirements_19, table_21, updates_3, wild___7_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11684(committed_0_21, compare_1, drafts_6, enlisted_4, first_0_0_12, last_0_0_14, move_phase_10, move_session_10, next_index_1, old_order_4, owns_provision_1, parent_0_0_15, participation_15, publication_transaction_18, renderer_0_3, root_0_0_16, scope_0_0_16, staged_retirements_19, table_21, updates_3, x_45_12245);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11686(children_0_1, committed_0_22, compare_2, drafts_7, enlisted_5, first_0_0_13, item_equals_0, items, key, last_0_0_15, move_phase_11, move_session_11, next_index_2, old_index_0, old_order_5, owns_provision_2, parent_0_0_16, participation_16, position_3, publication_transaction_19, renderer_0_4, root_0_0_17, scope_0_0_17, staged_retirements_20, table_22, updates_4, wild___1_0_0) /* forall<a,b,e> (children@0 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), committed@0 : ref<global,bool>, compare : (b, b) -> order, drafts : ref<global,list<keyed-row<e,a,b>>>, enlisted : ref<global,bool>, first@0@0 : node, item-equals : (a, a) -> bool, items : list<a>, key : (a) -> b, last@0@0 : node, move-phase : ref<global,bool>, move-session : ref<global,any>, next-index : ref<global,kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>>, old-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, old-order : list<keyed-row<e,a,b>>, owns-provision : bool, parent@0@0 : node, participation : keyed-participation, position : ref<global,int>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, table : ref<global,keyed-table<e,a,b>>, updates : ref<global,list<keyed-update<e,a,b>>>, wild_@1@0 : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var seen_identities = $std_core_hnd._open_none1(transaction_cell, $kokaine_internal_key_dash_index.Key_index_empty);
   
  var keyed_items_0 = $std_core_hnd._open_none1(transaction_cell, $std_core_types.Nil);
   
  var x_48_12251 = $std_core_list.foreach(items, function(item_0_1 /* 12106 */ ) {
       
      var identity_0_1 = $std_core_hnd._open_none1(key, item_0_1);
       
      var _x_x1_25_11367 = $std_core_hnd._open_none1(transaction_load, seen_identities);
      var _x111 = $std_core_hnd._open_none4($kokaine_internal_key_dash_index.insert, _x_x1_25_11367, identity_0_1, identity_0_1, compare_2);
      if (_x111._tag === 2) {
        return $std_core_hnd._open_at2(0, $std_core_exn.$throw, "duplicate key in keyed For");
      }
      else {
         
        $std_core_hnd._open_none2(transaction_store, seen_identities, _x111.index);
         
        var _x_x2_4_11377 = $std_core_types.Cons($std_core_types.Tuple2(item_0_1, identity_0_1), $std_core_hnd._open_none1(transaction_load, keyed_items_0));
        return $std_core_hnd._open_none2(transaction_store, keyed_items_0, _x_x2_4_11377);
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___3_0_1 /* () */ ) {
      return _mlift_reconcile_keyed_11685(children_0_1, committed_0_22, compare_2, drafts_7, enlisted_5, first_0_0_13, item_equals_0, keyed_items_0, last_0_0_15, move_phase_11, move_session_11, next_index_2, old_index_0, old_order_5, owns_provision_2, parent_0_0_16, participation_16, position_3, publication_transaction_19, renderer_0_4, root_0_0_17, scope_0_0_17, staged_retirements_20, table_22, updates_4, wild___3_0_1);
    });
  }
  else {
    return _mlift_reconcile_keyed_11685(children_0_1, committed_0_22, compare_2, drafts_7, enlisted_5, first_0_0_13, item_equals_0, keyed_items_0, last_0_0_15, move_phase_11, move_session_11, next_index_2, old_index_0, old_order_5, owns_provision_2, parent_0_0_16, participation_16, position_3, publication_transaction_19, renderer_0_4, root_0_0_17, scope_0_0_17, staged_retirements_20, table_22, updates_4, x_48_12251);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11687(children_0_2, committed_0_23, compare_3, drafts_8, enlisted_6, first_0_0_14, item_equals_1, items_0, key_0, last_0_0_16, move_phase_12, move_session_12, next_index_3, old_index_1, old_order_6, owns_provision_3, parent_0_0_17, participation_17, position_4, publication_transaction_20, renderer_0_5, root_0_0_18, scope_0_0_18, staged_retirements_21, table_23, updates_5, old_cursor) /* forall<a,b,e> (children@0 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), committed@0 : ref<global,bool>, compare : (b, b) -> order, drafts : ref<global,list<keyed-row<e,a,b>>>, enlisted : ref<global,bool>, first@0@0 : node, item-equals : (a, a) -> bool, items : list<a>, key : (a) -> b, last@0@0 : node, move-phase : ref<global,bool>, move-session : ref<global,any>, next-index : ref<global,kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>>, old-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, old-order : list<keyed-row<e,a,b>>, owns-provision : bool, parent@0@0 : node, participation : keyed-participation, position : ref<global,int>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e,a,b>>>, table : ref<global,keyed-table<e,a,b>>, updates : ref<global,list<keyed-update<e,a,b>>>, old-cursor : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_49_12253 = $std_core_hnd._open_at4(0, validate_keyed_order, parent_0_0_17, last_0_0_16, old_cursor, old_order_6);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___1_0_1 /* () */ ) {
      return _mlift_reconcile_keyed_11686(children_0_2, committed_0_23, compare_3, drafts_8, enlisted_6, first_0_0_14, item_equals_1, items_0, key_0, last_0_0_16, move_phase_12, move_session_12, next_index_3, old_index_1, old_order_6, owns_provision_3, parent_0_0_17, participation_17, position_4, publication_transaction_20, renderer_0_5, root_0_0_18, scope_0_0_18, staged_retirements_21, table_23, updates_5, wild___1_0_1);
    });
  }
  else {
    return _mlift_reconcile_keyed_11686(children_0_2, committed_0_23, compare_3, drafts_8, enlisted_6, first_0_0_14, item_equals_1, items_0, key_0, last_0_0_16, move_phase_12, move_session_12, next_index_3, old_index_1, old_order_6, owns_provision_3, parent_0_0_17, participation_17, position_4, publication_transaction_20, renderer_0_5, root_0_0_18, scope_0_0_18, staged_retirements_21, table_23, updates_5, x_49_12253);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11688(children_0_3, compare_4, first_0_0_15, item_equals_2, items_1, key_1, last_0_0_17, old_index_2, old_order_7, parent_0_0_18, renderer_0_6, root_0_0_19, scope_0_0_19, table_24, participation_18) /* forall<a,b,e> (children@0 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), compare : (b, b) -> order, first@0@0 : node, item-equals : (a, a) -> bool, items : list<a>, key : (a) -> b, last@0@0 : node, old-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, old-order : list<keyed-row<e,a,b>>, parent@0@0 : node, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, table : ref<global,keyed-table<e,a,b>>, participation : keyed-participation) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var owns_provision_4 = $std_core_hnd._open_none1(function(current_0 /* keyed-participation */ ) {
      return (current_0._tag === 1);
    }, participation_18);
   
  var publication_transaction_21 = $std_core_hnd._open_none1(function(current_0_0 /* keyed-participation */ ) {
      return (current_0_0._tag === 1) ? current_0_0.keyed_journal : current_0_0.keyed_journal;
    }, participation_18);
   
  var next_index_4 = $std_core_hnd._open_none1(transaction_cell, $kokaine_internal_key_dash_index.Key_index_empty);
   
  var updates_6 = $std_core_hnd._open_none1(transaction_cell, $std_core_types.Nil);
   
  var drafts_9 = $std_core_hnd._open_none1(transaction_cell, $std_core_types.Nil);
   
  var position_5 = $std_core_hnd._open_none1(transaction_cell, 0);
   
  var move_phase_13 = $std_core_hnd._open_none1(transaction_cell, false);
   
  var _x_x1_7_11344 = $std_core_hnd._open_none0(dom_keyed_no_session);
   
  var move_session_13 = $std_core_hnd._open_none1(transaction_cell, _x_x1_7_11344);
   
  var committed_0_24 = $std_core_hnd._open_none1(transaction_cell, false);
   
  var enlisted_7 = $std_core_hnd._open_none1(transaction_cell, false);
   
  var staged_retirements_22 = $std_core_hnd._open_none1(transaction_cell, $std_core_types.Nil);
   
  var x_51_12259 = $std_core_hnd._open_at3(0, function(parent_1_0 /* node */ , first_3_0 /* node */ , last_3 /* node */ ) {
       
      var result_7 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_range_first(parent_1_0, first_3_0, last_3);
        });
      var _x111 = $std_core_hnd._open_none1(dom_attempt_ok, result_7);
      if (_x111) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_7);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_7)));
      }
    }, parent_0_0_18, first_0_0_15, last_0_0_17);
  if ($std_core_hnd._yielding()) {
    var _x113 = $std_core_hnd.yield_extend(function(old_cursor_0 /* node */ ) {
      return _mlift_reconcile_keyed_11687(children_0_3, committed_0_24, compare_4, drafts_9, enlisted_7, first_0_0_15, item_equals_2, items_1, key_1, last_0_0_17, move_phase_13, move_session_13, next_index_4, old_index_2, old_order_7, owns_provision_4, parent_0_0_18, participation_18, position_5, publication_transaction_21, renderer_0_6, root_0_0_19, scope_0_0_19, staged_retirements_22, table_24, updates_6, old_cursor_0);
    });
  }
  else {
    var _x113 = _mlift_reconcile_keyed_11687(children_0_3, committed_0_24, compare_4, drafts_9, enlisted_7, first_0_0_15, item_equals_2, items_1, key_1, last_0_0_17, move_phase_13, move_session_13, next_index_4, old_index_2, old_order_7, owns_provision_4, parent_0_0_18, participation_18, position_5, publication_transaction_21, renderer_0_6, root_0_0_19, scope_0_0_19, staged_retirements_22, table_24, updates_6, x_51_12259);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x111 = $std_core_hnd._open_none1(transaction_load, committed_0_24);
      if (_x111) {
        return $std_core_types.Unit;
      }
      else {
        var _x112 = $std_core_hnd._open_none1(transaction_load, enlisted_7);
        if (_x112) {
          return $std_core_types.Unit;
        }
        else {
           
          var x_50_12257 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10482_0 /* hnd/ev-index */ ) {
              return _mlift_reconcile_keyed_11652(drafts_9, first_0_0_15, last_0_0_17, move_phase_13, move_session_13, old_order_7, parent_0_0_18, participation_18, staged_retirements_22, _y_x10482_0);
            });
          }
          else {
            return _mlift_reconcile_keyed_11652(drafts_9, first_0_0_15, last_0_0_17, move_phase_13, move_session_13, old_order_7, parent_0_0_18, participation_18, staged_retirements_22, x_50_12257);
          }
        }
      }
    }, _x113);
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11689(children_0_4, compare_5, first_0_0_16, item_equals_3, items_2, key_2, last_0_0_18, old_index_3, old_order_8, parent_0_0_19, renderer_0_7, root_0_0_20, scope_0_0_20, table_25, _y_x10479) /* forall<a,b,e> (children@0 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), compare : (b, b) -> order, first@0@0 : node, item-equals : (a, a) -> bool, items : list<a>, key : (a) -> b, last@0@0 : node, old-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, old-order : list<keyed-row<e,a,b>>, parent@0@0 : node, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, table : ref<global,keyed-table<e,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_52_12262 = $std_core_hnd._mask_at(_y_x10479, false, function() {
      return open_keyed_participation(renderer_0_7, root_0_0_20);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(participation_19 /* keyed-participation */ ) {
      return _mlift_reconcile_keyed_11688(children_0_4, compare_5, first_0_0_16, item_equals_3, items_2, key_2, last_0_0_18, old_index_3, old_order_8, parent_0_0_19, renderer_0_7, root_0_0_20, scope_0_0_20, table_25, participation_19);
    });
  }
  else {
    return _mlift_reconcile_keyed_11688(children_0_4, compare_5, first_0_0_16, item_equals_3, items_2, key_2, last_0_0_18, old_index_3, old_order_8, parent_0_0_19, renderer_0_7, root_0_0_20, scope_0_0_20, table_25, x_52_12262);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11690(children_0_5, compare_6, first_0_0_17, item_equals_4, items_3, key_3, last_0_0_19, parent_0_0_20, renderer_0_8, root_0_0_21, scope_0_0_21, table_26, wild___5) /* forall<a,b,e> (children@0 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), compare : (b, b) -> order, first@0@0 : node, item-equals : (a, a) -> bool, items : list<a>, key : (a) -> b, last@0@0 : node, parent@0@0 : node, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, table : ref<global,keyed-table<e,a,b>>, wild_@5 : ()) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  var _x114 = $std_core_hnd._open_none1(transaction_load, table_26);
   
  var x_53_12264 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10479_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11689(children_0_5, compare_6, first_0_0_17, item_equals_4, items_3, key_3, last_0_0_19, _x114.table_index, _x114.table_order, parent_0_0_20, renderer_0_8, root_0_0_21, scope_0_0_21, table_26, _y_x10479_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11689(children_0_5, compare_6, first_0_0_17, item_equals_4, items_3, key_3, last_0_0_19, _x114.table_index, _x114.table_order, parent_0_0_20, renderer_0_8, root_0_0_21, scope_0_0_21, table_26, x_53_12264);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11691(children_0_6, compare_7, first_0_0_18, item_equals_5, items_4, key_4, last_0_0_20, parent_0_0_21, renderer_0_9, root_0_0_22, scope_0_0_22, table_27, _y_x10475) /* forall<a,b,e> (children@0 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), compare : (b, b) -> order, first@0@0 : node, item-equals : (a, a) -> bool, items : list<a>, key : (a) -> b, last@0@0 : node, parent@0@0 : node, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, table : ref<global,keyed-table<e,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_54_12266 = $std_core_hnd._mask_at(_y_x10475, false, function() {
      return drain_keyed_retirements(table_27);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___5_0 /* () */ ) {
      return _mlift_reconcile_keyed_11690(children_0_6, compare_7, first_0_0_18, item_equals_5, items_4, key_4, last_0_0_20, parent_0_0_21, renderer_0_9, root_0_0_22, scope_0_0_22, table_27, wild___5_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11690(children_0_6, compare_7, first_0_0_18, item_equals_5, items_4, key_4, last_0_0_20, parent_0_0_21, renderer_0_9, root_0_0_22, scope_0_0_22, table_27, x_54_12266);
  }
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11692(scope_1_0, _y_x10571) /* (scope@1@0 : kokaine/reactive/integration/lifetime-scope<ui>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10571, false, function() {
      return $kokaine_reactive_integration_internal_lifetime_dash_scope.lifetime_scope_fs_dispose($std_core_hnd._open_none1(function(value_9 /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
          return value_9;
        }, scope_1_0));
    });
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11693(first_1_0_0, last_1_0, _y_x10578) /* (first@1@0 : node, last@1@0 : node, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10578, false, function() {
       
      var result_8 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_clean_range(first_1_0_0, last_1_0, true);
        });
      var _x115 = $std_core_hnd._open_none1(dom_attempt_ok, result_8);
      if (_x115) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_8);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_8)));
      }
    });
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11694(read, _y_x10591) /* forall<a> (read : () -> kokaine/reactive/effects/signal-read a, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-read> a */  {
  return $std_core_hnd._mask_at(_y_x10591, false, read);
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11695(children_1_0, compare_0_0, first_1_0_1, item_equals_0_0, items_0_0, key_0_0, last_1_0_0, parent_1_0_0, renderer_1_0, root_1_0_0, scope_1_0_0, table_0_0, wild___3_1) /* forall<a,b,e> (children@1 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), compare@0 : (b, b) -> order, first@1@0 : node, item-equals@0 : (a, a) -> bool, items@0 : ref<global,list<a>>, key@0 : (a) -> b, last@1@0 : node, parent@1@0 : node, renderer@1 : kokaine/dom/internal/keyed-transaction/keyed-context, root@1@0 : kokaine/reactive/root<ui>, scope@1@0 : kokaine/reactive/integration/lifetime-scope<ui>, table@0 : ref<global,keyed-table<e,a,b>>, wild_@3@1 : ()) -> <div,exn,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var xs_2_11025 = $std_core_hnd._open_none1(transaction_load, items_0_0);
  return reconcile_keyed(renderer_1_0, root_1_0_0, parent_1_0_0, first_1_0_1, last_1_0_0, scope_1_0_0, table_0_0, $std_core_list.reverse_acc($std_core_types.Nil, xs_2_11025), key_0_0, compare_0_0, item_equals_0_0, children_1_0);
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11696(committed_1_0, _y_x10597) /* (committed@1 : ref<global,bool>, kokaine/reactive/disposer<ui>) -> <kokaine/reactive/effects/signal-write,pure> () */  {
   
  $std_core_hnd._open_none2(transaction_store, committed_1_0, true);
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11697(_pat_34_0) /* (kokaine/reactive/internal/model/cleanup-registration<ui>) -> exn () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11698(first_1_0_2, last_1_0_1, _y_x10586) /* (first@1@0 : node, last@1@0 : node, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10586, false, function() {
       
      var result_9 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_clean_range(first_1_0_2, last_1_0_1, true);
        });
      var _x116 = $std_core_hnd._open_none1(dom_attempt_ok, result_9);
      if (_x116) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_9);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_9)));
      }
    });
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11699(children_1_1, committed_1_1, compare_0_1, first_1_0_3, item_equals_0_1, key_0_1, last_1_0_2, parent_1_0_1, range_owned_0_0, read_0, renderer_1_1, root_1_0_1, scope_1_0_1, walk, wild___1_1) /* forall<a,b,c,e> (children@1 : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), committed@1 : ref<global,bool>, compare@0 : (c, c) -> order, first@1@0 : node, item-equals@0 : (b, b) -> bool, key@0 : (b) -> c, last@1@0 : node, parent@1@0 : node, range-owned@0 : ref<global,bool>, read : () -> kokaine/reactive/effects/signal-read a, renderer@1 : kokaine/dom/internal/keyed-transaction/keyed-context, root@1@0 : kokaine/reactive/root<ui>, scope@1@0 : kokaine/reactive/integration/lifetime-scope<ui>, walk : forall<e1> (a, (b) -> e1 ()) -> e1 (), wild_@1@1 : ()) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
   
  $std_core_hnd._open_none2(transaction_store, range_owned_0_0, true);
   
  var table_0_1 = $std_core_hnd._open_none1(transaction_cell, Keyed_table($kokaine_internal_key_dash_index.Key_index_empty, $std_core_types.Nil, $std_core_types.Nil));
   
  var x_55_12275 = $kokaine_reactive.create_effect(root_1_0_1, function() {
       
      var x_56_12277 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10591_0 /* hnd/ev-index */ ) {
          return _mlift_mount_keyed_fields_11694(read_0, _y_x10591_0);
        });
      }
      else {
        return _mlift_mount_keyed_fields_11694(read_0, x_56_12277);
      }
    }, function(snapshot_0 /* 12125 */ ) {
      return $kokaine_reactive_integration.with_lifetime_scope(root_1_0_1, scope_1_0_1, function() {
           
          var items_0_1 = $std_core_hnd._open_none1(transaction_cell, $std_core_types.Nil);
           
          var x_57_12279 = walk(snapshot_0, function(item_1_0 /* 12126 */ ) {
               
              var _x_x2_3_11503 = $std_core_types.Cons(item_1_0, $std_core_hnd._open_none1(transaction_load, items_0_1));
              return $std_core_hnd._open_none2(transaction_store, items_0_1, _x_x2_3_11503);
            });
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(wild___3_1_0 /* () */ ) {
              return _mlift_mount_keyed_fields_11695(children_1_1, compare_0_1, first_1_0_3, item_equals_0_1, items_0_1, key_0_1, last_1_0_2, parent_1_0_1, renderer_1_1, root_1_0_1, scope_1_0_1, table_0_1, wild___3_1_0);
            });
          }
          else {
            return _mlift_mount_keyed_fields_11695(children_1_1, compare_0_1, first_1_0_3, item_equals_0_1, items_0_1, key_0_1, last_1_0_2, parent_1_0_1, renderer_1_1, root_1_0_1, scope_1_0_1, table_0_1, x_57_12279);
          }
        });
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10597_0 /* kokaine/reactive/disposer<ui> */ ) {
      return _mlift_mount_keyed_fields_11696(committed_1_1, _y_x10597_0);
    });
  }
  else {
    return _mlift_mount_keyed_fields_11696(committed_1_1, x_55_12275);
  }
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11700(children_1_2, committed_1_2, compare_0_2, first_1_0_4, installed_0_0, item_equals_0_2, key_0_2, last_1_0_3, parent_1_0_2, range_owned_0_1, read_1, renderer_1_2, root_1_0_2, scope_1_0_2, walk_0, wild___25) /* forall<a,b,c,e> (children@1 : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), committed@1 : ref<global,bool>, compare@0 : (c, c) -> order, first@1@0 : node, installed@0 : ref<global,bool>, item-equals@0 : (b, b) -> bool, key@0 : (b) -> c, last@1@0 : node, parent@1@0 : node, range-owned@0 : ref<global,bool>, read : () -> kokaine/reactive/effects/signal-read a, renderer@1 : kokaine/dom/internal/keyed-transaction/keyed-context, root@1@0 : kokaine/reactive/root<ui>, scope@1@0 : kokaine/reactive/integration/lifetime-scope<ui>, walk : forall<e1> (a, (b) -> e1 ()) -> e1 (), wild_@25 : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  $std_core_hnd._open_none2(transaction_store, installed_0_0, true);
   
  var x_58_12281 = $std_core_hnd._open_at2(0, function(root_6_0 /* kokaine/reactive/root<ui> */ , cleanup_0 /* () -> <kokaine/reactive/effects/signal-write,pure,ui> () */ ) {
       
      var root_0_10046_0 = $std_core_hnd._open_none1(function(value_10 /* kokaine/reactive/root<ui> */ ) {
          return value_10;
        }, root_6_0);
       
      var x_59_12283 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046_0, cleanup_0);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_mount_keyed_fields_11697);
      }
      else {
        return _mlift_mount_keyed_fields_11697(x_59_12283);
      }
    }, root_1_0_2, function() {
       
      var x_60_12285 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10586_0 /* hnd/ev-index */ ) {
          return _mlift_mount_keyed_fields_11698(first_1_0_4, last_1_0_3, _y_x10586_0);
        });
      }
      else {
        return _mlift_mount_keyed_fields_11698(first_1_0_4, last_1_0_3, x_60_12285);
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___1_1_0 /* () */ ) {
      return _mlift_mount_keyed_fields_11699(children_1_2, committed_1_2, compare_0_2, first_1_0_4, item_equals_0_2, key_0_2, last_1_0_3, parent_1_0_2, range_owned_0_1, read_1, renderer_1_2, root_1_0_2, scope_1_0_2, walk_0, wild___1_1_0);
    });
  }
  else {
    return _mlift_mount_keyed_fields_11699(children_1_2, committed_1_2, compare_0_2, first_1_0_4, item_equals_0_2, key_0_2, last_1_0_3, parent_1_0_2, range_owned_0_1, read_1, renderer_1_2, root_1_0_2, scope_1_0_2, walk_0, x_58_12281);
  }
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11701(before_0, children_1_3, committed_1_3, compare_0_3, first_1_0_5, installed_0_1, item_equals_0_3, key_0_3, parent_1_0_3, range_owned_0_2, read_2, renderer_1_3, root_1_0_3, scope_1_0_3, walk_1, last_1_0_4) /* forall<a,b,c,e> (before@0 : maybe<node>, children@1 : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), committed@1 : ref<global,bool>, compare@0 : (c, c) -> order, first@1@0 : node, installed@0 : ref<global,bool>, item-equals@0 : (b, b) -> bool, key@0 : (b) -> c, parent@1@0 : node, range-owned@0 : ref<global,bool>, read : () -> kokaine/reactive/effects/signal-read a, renderer@1 : kokaine/dom/internal/keyed-transaction/keyed-context, root@1@0 : kokaine/reactive/root<ui>, scope@1@0 : kokaine/reactive/integration/lifetime-scope<ui>, walk : forall<e1> (a, (b) -> e1 ()) -> e1 (), last@1@0 : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_62_12291 = $std_core_hnd._open_at4(0, insert_marker_pair, parent_1_0_3, before_0, first_1_0_5, last_1_0_4);
  if ($std_core_hnd._yielding()) {
    var _x119 = $std_core_hnd.yield_extend(function(wild___25_0 /* () */ ) {
      return _mlift_mount_keyed_fields_11700(children_1_3, committed_1_3, compare_0_3, first_1_0_5, installed_0_1, item_equals_0_3, key_0_3, last_1_0_4, parent_1_0_3, range_owned_0_2, read_2, renderer_1_3, root_1_0_3, scope_1_0_3, walk_1, wild___25_0);
    });
  }
  else {
    var _x119 = _mlift_mount_keyed_fields_11700(children_1_3, committed_1_3, compare_0_3, first_1_0_5, installed_0_1, item_equals_0_3, key_0_3, last_1_0_4, parent_1_0_3, range_owned_0_2, read_2, renderer_1_3, root_1_0_3, scope_1_0_3, walk_1, x_62_12291);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x117 = $std_core_hnd._open_none1(transaction_load, installed_0_1);
      if (_x117) {
         
        var _x_x1_9_11487 = $std_core_hnd._open_none1(transaction_load, range_owned_0_2);
        var _x118 = $std_core_hnd._open_none1(function(b_5 /* bool */ ) {
            return (b_5) ? false : true;
          }, _x_x1_9_11487);
        if (_x118) {
           
          var x_61_12289 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10578_0 /* hnd/ev-index */ ) {
              return _mlift_mount_keyed_fields_11693(first_1_0_5, last_1_0_4, _y_x10578_0);
            });
          }
          else {
            return _mlift_mount_keyed_fields_11693(first_1_0_5, last_1_0_4, x_61_12289);
          }
        }
        else {
          return $std_core_types.Unit;
        }
      }
      else {
        return $std_core_types.Unit;
      }
    }, _x119);
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11702(before_0_0, children_1_4, committed_1_4, compare_0_4, installed_0_2, item_equals_0_4, key_0_4, parent_1_0_4, range_owned_0_3, read_3, renderer_1_4, root_1_0_4, scope_1_0_4, walk_2, first_1_0_6) /* forall<a,b,c,e> (before@0 : maybe<node>, children@1 : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), committed@1 : ref<global,bool>, compare@0 : (c, c) -> order, installed@0 : ref<global,bool>, item-equals@0 : (b, b) -> bool, key@0 : (b) -> c, parent@1@0 : node, range-owned@0 : ref<global,bool>, read : () -> kokaine/reactive/effects/signal-read a, renderer@1 : kokaine/dom/internal/keyed-transaction/keyed-context, root@1@0 : kokaine/reactive/root<ui>, scope@1@0 : kokaine/reactive/integration/lifetime-scope<ui>, walk : forall<e1> (a, (b) -> e1 ()) -> e1 (), first@1@0 : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_63_12293 = $std_core_hnd._open_at1(0, dom_attempt, function() {
      return dom_create_comment("/kokaine:for");
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(last_1_0_5 /* node */ ) {
      return _mlift_mount_keyed_fields_11701(before_0_0, children_1_4, committed_1_4, compare_0_4, first_1_0_6, installed_0_2, item_equals_0_4, key_0_4, parent_1_0_4, range_owned_0_3, read_3, renderer_1_4, root_1_0_4, scope_1_0_4, walk_2, last_1_0_5);
    });
  }
  else {
    return _mlift_mount_keyed_fields_11701(before_0_0, children_1_4, committed_1_4, compare_0_4, first_1_0_6, installed_0_2, item_equals_0_4, key_0_4, parent_1_0_4, range_owned_0_3, read_3, renderer_1_4, root_1_0_4, scope_1_0_4, walk_2, x_63_12293);
  }
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11703(_y_x10569) /* (kokaine/reactive/integration/internal/lifetime-scope/lifetime-scope<ui>) -> exn kokaine/reactive/integration/lifetime-scope<ui> */  {
  return _y_x10569;
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11704(before_0_1, children_1_5, compare_0_5, item_equals_0_5, key_0_5, parent_1_0_5, read_4, renderer_1_5, root_1_0_5, walk_3, scope_1_0_5) /* forall<a,b,c,e> (before@0 : maybe<node>, children@1 : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), compare@0 : (c, c) -> order, item-equals@0 : (b, b) -> bool, key@0 : (b) -> c, parent@1@0 : node, read : () -> kokaine/reactive/effects/signal-read a, renderer@1 : kokaine/dom/internal/keyed-transaction/keyed-context, root@1@0 : kokaine/reactive/root<ui>, walk : forall<e1> (a, (b) -> e1 ()) -> e1 (), scope@1@0 : kokaine/reactive/integration/lifetime-scope<ui>) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var committed_1_5 = $std_core_hnd._open_none1(transaction_cell, false);
   
  var installed_0_3 = $std_core_hnd._open_none1(transaction_cell, false);
   
  var range_owned_0_4 = $std_core_hnd._open_none1(transaction_cell, false);
  return $std_core_hnd.finally_prompt(function() {
      var _x120 = $std_core_hnd._open_none1(transaction_load, committed_1_5);
      if (_x120) {
        return $std_core_types.Unit;
      }
      else {
         
        var x_64_12297 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10571_0 /* hnd/ev-index */ ) {
            return _mlift_mount_keyed_fields_11692(scope_1_0_5, _y_x10571_0);
          });
        }
        else {
          return _mlift_mount_keyed_fields_11692(scope_1_0_5, x_64_12297);
        }
      }
    }, $kokaine_reactive_integration.with_lifetime_scope(root_1_0_5, scope_1_0_5, function() {
         
        var x_65_12299 = $std_core_hnd._open_at1(0, dom_attempt, function() {
            return dom_create_comment("kokaine:for");
          });
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(first_1_0_7 /* node */ ) {
            return _mlift_mount_keyed_fields_11702(before_0_1, children_1_5, committed_1_5, compare_0_5, installed_0_3, item_equals_0_5, key_0_5, parent_1_0_5, range_owned_0_4, read_4, renderer_1_5, root_1_0_5, scope_1_0_5, walk_3, first_1_0_7);
          });
        }
        else {
          return _mlift_mount_keyed_fields_11702(before_0_1, children_1_5, committed_1_5, compare_0_5, installed_0_3, item_equals_0_5, key_0_5, parent_1_0_5, range_owned_0_4, read_4, renderer_1_5, root_1_0_5, scope_1_0_5, walk_3, x_65_12299);
        }
      }));
}
 
 
// monadic lift
export function _mlift_mount_view_11705(before_1, parent_3_0_0, target) /* (before@1 : maybe<node>, parent@3@0 : node, target : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
  return $std_core_hnd._open_at3(0, insert, parent_3_0_0, before_1, target);
}
 
 
// monadic lift
export function _mlift_mount_view_11706(read_1_0, _y_x10608) /* (read@1 : () -> kokaine/reactive/effects/signal-read string, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-read> string */  {
  return $std_core_hnd._mask_at(_y_x10608, false, read_1_0);
}
 
 
// monadic lift
export function _mlift_mount_view_11707(target_0, value_11, _y_x10611) /* (target@0 : node, value@11 : string, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10611, false, function() {
      return set_text(target_0, value_11);
    });
}
 
 
// monadic lift
export function _mlift_mount_view_11708(_y_x10615) /* (kokaine/reactive/disposer<ui>) -> <kokaine/reactive/effects/signal-write,pure> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_view_11709(read_1_1, root_3_0, target_0_0, wild___26) /* (read@1 : () -> kokaine/reactive/effects/signal-read string, root@3@0 : kokaine/reactive/root<ui>, target@0 : node, wild_@26 : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_66_12303 = $kokaine_reactive.create_effect(root_3_0, function() {
       
      var x_67_12305 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10608_0 /* hnd/ev-index */ ) {
          return _mlift_mount_view_11706(read_1_1, _y_x10608_0);
        });
      }
      else {
        return _mlift_mount_view_11706(read_1_1, x_67_12305);
      }
    }, function(value_11_0 /* string */ ) {
       
      var x_68_12307 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10611_0 /* hnd/ev-index */ ) {
          return _mlift_mount_view_11707(target_0_0, value_11_0, _y_x10611_0);
        });
      }
      else {
        return _mlift_mount_view_11707(target_0_0, value_11_0, x_68_12307);
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_mount_view_11708);
  }
  else {
    return _mlift_mount_view_11708(x_66_12303);
  }
}
 
 
// monadic lift
export function _mlift_mount_view_11710(before_1_0, parent_3_0_1, read_1_2, root_3_0_0, target_0_1) /* (before@1 : maybe<node>, parent@3@0 : node, read@1 : () -> kokaine/reactive/effects/signal-read string, root@3@0 : kokaine/reactive/root<ui>, target@0 : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_69_12309 = $std_core_hnd._open_at3(0, insert, parent_3_0_1, before_1_0, target_0_1);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___26_0 /* () */ ) {
      return _mlift_mount_view_11709(read_1_2, root_3_0_0, target_0_1, wild___26_0);
    });
  }
  else {
    return _mlift_mount_view_11709(read_1_2, root_3_0_0, target_0_1, x_69_12309);
  }
}
 
 
// monadic lift
export function _mlift_mount_view_11711(before_1_1, parent_3_0_2, target_1, wild___2_2) /* (before@1 : maybe<node>, parent@3@0 : node, target@1 : element, wild_@2@2 : ()) -> <div,exn,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var _x_x3_1_11525 = $std_core_hnd._open_none1(element_node, target_1);
  return $std_core_hnd._open_at3(0, function(parent_6_0 /* node */ , before_2 /* maybe<node> */ , child_0 /* node */ ) {
      if (before_2 === null) {
         
        var result_10 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_append(parent_6_0, child_0);
          });
        var _x121 = $std_core_hnd._open_none1(dom_attempt_ok, result_10);
        if (_x121) {
          return $std_core_hnd._open_none1(dom_attempt_value, result_10);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_10)));
        }
      }
      else {
         
        var result_11 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_insert_before(parent_6_0, child_0, before_2.value);
          });
        var _x122 = $std_core_hnd._open_none1(dom_attempt_ok, result_11);
        if (_x122) {
          return $std_core_hnd._open_none1(dom_attempt_value, result_11);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_11)));
        }
      }
    }, parent_3_0_2, before_1_1, _x_x3_1_11525);
}
 
 
// monadic lift
export function _mlift_mount_view_11712(before_1_2, children_3_0, parent_3_0_3, renderer_3_0, root_3_0_1, target_1_0, wild___1_2) /* forall<e> (before@1 : maybe<node>, children@3 : list<kokaine/html/view<e>>, parent@3@0 : node, renderer@3 : kokaine/dom/internal/keyed-transaction/keyed-context, root@3@0 : kokaine/reactive/root<ui>, target@1 : element, wild_@1@2 : ()) -> <div,exn,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var x_70_12313 = $std_core_list.foreach(children_3_0, function(child /* kokaine/html/view<12154> */ ) {
      return mount_view(renderer_3_0, root_3_0_1, $std_core_hnd._open_none1(element_node, target_1_0), $std_core_types.Nothing, child);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___2_2_0 /* () */ ) {
      return _mlift_mount_view_11711(before_1_2, parent_3_0_3, target_1_0, wild___2_2_0);
    });
  }
  else {
    return _mlift_mount_view_11711(before_1_2, parent_3_0_3, target_1_0, x_70_12313);
  }
}
 
 
// monadic lift
export function _mlift_mount_view_11713(attributes, before_1_3, children_3_1, parent_3_0_4, renderer_3_1, root_3_0_2, target_1_1, wild___0_2) /* forall<e> (attributes : list<kokaine/html/attribute<e>>, before@1 : maybe<node>, children@3 : list<kokaine/html/view<e>>, parent@3@0 : node, renderer@3 : kokaine/dom/internal/keyed-transaction/keyed-context, root@3@0 : kokaine/reactive/root<ui>, target@1 : element, wild_@0@2 : ()) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var x_71_12315 = $std_core_list.foreach(attributes, function(attribute /* kokaine/html/attribute<12154> */ ) {
      return mount_attribute(root_3_0_2, target_1_1, attribute);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___1_2_0 /* () */ ) {
      return _mlift_mount_view_11712(before_1_3, children_3_1, parent_3_0_4, renderer_3_1, root_3_0_2, target_1_1, wild___1_2_0);
    });
  }
  else {
    return _mlift_mount_view_11712(before_1_3, children_3_1, parent_3_0_4, renderer_3_1, root_3_0_2, target_1_1, x_71_12315);
  }
}
 
 
// monadic lift
export function _mlift_mount_view_11714(attributes_0, before_1_4, children_3_2, parent_3_0_5, renderer_3_2, root_3_0_3, target_1_2) /* forall<e> (attributes : list<kokaine/html/attribute<e>>, before@1 : maybe<node>, children@3 : list<kokaine/html/view<e>>, parent@3@0 : node, renderer@3 : kokaine/dom/internal/keyed-transaction/keyed-context, root@3@0 : kokaine/reactive/root<ui>, target@1 : element) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_72_12317 = record_owner(root_3_0_3, $std_core_hnd._open_none1(element_node, target_1_2));
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0_2_0 /* () */ ) {
      return _mlift_mount_view_11713(attributes_0, before_1_4, children_3_2, parent_3_0_5, renderer_3_2, root_3_0_3, target_1_2, wild___0_2_0);
    });
  }
  else {
    return _mlift_mount_view_11713(attributes_0, before_1_4, children_3_2, parent_3_0_5, renderer_3_2, root_3_0_3, target_1_2, x_72_12317);
  }
}
 
 
// monadic lift
export function _mlift_mount_view_11715(read_0_0_0, _y_x10633) /* forall<e> (read@0@0@0 : () -> kokaine/reactive/effects/signal-read kokaine/html/view<e>, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-read> kokaine/html/view<e> */  {
  return $std_core_hnd._mask_at(_y_x10633, false, read_0_0_0);
}
 
 
// monadic lift
export function _mlift_mount_view_11716(_pat_37_0) /* (kokaine/reactive/internal/model/cleanup-registration<ui>) -> exn () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_view_11717(first_2_0, last_2_0, _y_x10637) /* (first@2@0 : node, last@2@0 : node, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10637, false, function() {
       
      var result_12 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_clean_range(first_2_0, last_2_0, false);
        });
      var _x123 = $std_core_hnd._open_none1(dom_attempt_ok, result_12);
      if (_x123) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_12);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_12)));
      }
    });
}
 
 
// monadic lift
export function _mlift_mount_view_11718(last_2_0_0, next_1_0, parent_3_0_6, renderer_3_3, root_3_0_4, wild___4_2) /* forall<e> (last@2@0 : node, next@1 : kokaine/html/view<e>, parent@3@0 : node, renderer@3 : kokaine/dom/internal/keyed-transaction/keyed-context, root@3@0 : kokaine/reactive/root<ui>, wild_@4@2 : ()) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
  return mount_view(renderer_3_3, root_3_0_4, parent_3_0_6, $std_core_types.Just(last_2_0_0), next_1_0);
}
 
 
// monadic lift
export function _mlift_mount_view_11719(_y_x10643) /* (kokaine/reactive/disposer<ui>) -> <kokaine/reactive/effects/signal-write,pure> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_view_11720(first_2_0_0, last_2_0_1, parent_3_0_7, read_0_0_0_0, renderer_3_4, root_3_0_5, wild___3_2) /* forall<e> (first@2@0 : node, last@2@0 : node, parent@3@0 : node, read@0@0@0 : () -> kokaine/reactive/effects/signal-read kokaine/html/view<e>, renderer@3 : kokaine/dom/internal/keyed-transaction/keyed-context, root@3@0 : kokaine/reactive/root<ui>, wild_@3@2 : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_73_12322 = $kokaine_reactive.create_effect(root_3_0_5, function() {
       
      var x_74_12324 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10633_0 /* hnd/ev-index */ ) {
          return _mlift_mount_view_11715(read_0_0_0_0, _y_x10633_0);
        });
      }
      else {
        return _mlift_mount_view_11715(read_0_0_0_0, x_74_12324);
      }
    }, function(next_1_1 /* kokaine/html/view<12154> */ ) {
       
      var x_75_12326 = $std_core_hnd._open_at2(0, function(root_7_0 /* kokaine/reactive/root<ui> */ , cleanup_1 /* () -> <kokaine/reactive/effects/signal-write,pure,ui> () */ ) {
           
          var root_0_10046_1 = $std_core_hnd._open_none1(function(value_12 /* kokaine/reactive/root<ui> */ ) {
              return value_12;
            }, root_7_0);
           
          var x_76_12328 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046_1, cleanup_1);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(_mlift_mount_view_11716);
          }
          else {
            return _mlift_mount_view_11716(x_76_12328);
          }
        }, root_3_0_5, function() {
           
          var x_77_12330 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10637_0 /* hnd/ev-index */ ) {
              return _mlift_mount_view_11717(first_2_0_0, last_2_0_1, _y_x10637_0);
            });
          }
          else {
            return _mlift_mount_view_11717(first_2_0_0, last_2_0_1, x_77_12330);
          }
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild___4_2_0 /* () */ ) {
          return _mlift_mount_view_11718(last_2_0_1, next_1_1, parent_3_0_7, renderer_3_4, root_3_0_5, wild___4_2_0);
        });
      }
      else {
        return _mlift_mount_view_11718(last_2_0_1, next_1_1, parent_3_0_7, renderer_3_4, root_3_0_5, x_75_12326);
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_mount_view_11719);
  }
  else {
    return _mlift_mount_view_11719(x_73_12322);
  }
}
 
 
// monadic lift
export function _mlift_mount_view_11721(before_1_5, first_2_0_1, parent_3_0_8, read_0_0_0_1, renderer_3_5, root_3_0_6, last_2_0_2) /* forall<e> (before@1 : maybe<node>, first@2@0 : node, parent@3@0 : node, read@0@0@0 : () -> kokaine/reactive/effects/signal-read kokaine/html/view<e>, renderer@3 : kokaine/dom/internal/keyed-transaction/keyed-context, root@3@0 : kokaine/reactive/root<ui>, last@2@0 : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_78_12332 = $std_core_hnd._open_at4(0, insert_marker_pair, parent_3_0_8, before_1_5, first_2_0_1, last_2_0_2);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___3_2_0 /* () */ ) {
      return _mlift_mount_view_11720(first_2_0_1, last_2_0_2, parent_3_0_8, read_0_0_0_1, renderer_3_5, root_3_0_6, wild___3_2_0);
    });
  }
  else {
    return _mlift_mount_view_11720(first_2_0_1, last_2_0_2, parent_3_0_8, read_0_0_0_1, renderer_3_5, root_3_0_6, x_78_12332);
  }
}
 
 
// monadic lift
export function _mlift_mount_view_11722(before_1_6, parent_3_0_9, read_0_0_0_2, renderer_3_6, root_3_0_7, first_2_0_2) /* forall<e> (before@1 : maybe<node>, parent@3@0 : node, read@0@0@0 : () -> kokaine/reactive/effects/signal-read kokaine/html/view<e>, renderer@3 : kokaine/dom/internal/keyed-transaction/keyed-context, root@3@0 : kokaine/reactive/root<ui>, first@2@0 : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_79_12334 = $std_core_hnd._open_at1(0, dom_attempt, function() {
      return dom_create_comment("/kokaine:region");
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(last_2_0_3 /* node */ ) {
      return _mlift_mount_view_11721(before_1_6, first_2_0_2, parent_3_0_9, read_0_0_0_2, renderer_3_6, root_3_0_7, last_2_0_3);
    });
  }
  else {
    return _mlift_mount_view_11721(before_1_6, first_2_0_2, parent_3_0_9, read_0_0_0_2, renderer_3_6, root_3_0_7, x_79_12334);
  }
}
 
export function create_keyed_row(renderer_9, root_9, parent_8, last_6, identity_9, item_9, index_9, children_7) /* forall<a,b,e> (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, parent : node, last : node, identity : a, item : b, index : int, children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> ()) -> <pure,kokaine/reactive/effects/signal-write,ui> keyed-row<e,b,a> */  {
   
  var x_80_12336 = $std_core_hnd._open_at1(0, function(root_0_1 /* kokaine/reactive/root<ui> */ ) {
       
      var x_81_12339 = $kokaine_reactive_integration_internal_lifetime_dash_scope.open_lifetime_scope($std_core_hnd._open_none1(function(value_5 /* kokaine/reactive/root<ui> */ ) {
          return value_5;
        }, root_0_1));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_create_keyed_row_11649);
      }
      else {
        return _mlift_create_keyed_row_11649(x_81_12339);
      }
    }, root_9);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(scope_10 /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
      return _mlift_create_keyed_row_11650(children_7, identity_9, index_9, item_9, last_6, parent_8, renderer_9, root_9, scope_10);
    });
  }
  else {
     
    var committed_9 = $std_core_hnd._open_none1(transaction_cell, false);
     
    var installed_3 = $std_core_hnd._open_none1(transaction_cell, false);
     
    var range_owned_4 = $std_core_hnd._open_none1(transaction_cell, false);
    return $std_core_hnd.finally_prompt(function() {
        var _x124 = $std_core_hnd._open_none1(transaction_load, committed_9);
        if (_x124) {
          return $std_core_types.Unit;
        }
        else {
           
          var x_82_12343 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10435_1 /* hnd/ev-index */ ) {
              return _mlift_create_keyed_row_11633(x_80_12336, _y_x10435_1);
            });
          }
          else {
            return _mlift_create_keyed_row_11633(x_80_12336, x_82_12343);
          }
        }
      }, $kokaine_reactive_integration.with_lifetime_scope(root_9, x_80_12336, function() {
           
          var x_83_12345 = $std_core_hnd._open_at1(0, dom_attempt, function() {
              return dom_create_comment("kokaine:for-row");
            });
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(first_11 /* node */ ) {
              return _mlift_create_keyed_row_11648(children_7, committed_9, identity_9, index_9, installed_3, item_9, last_6, parent_8, range_owned_4, renderer_9, root_9, x_80_12336, first_11);
            });
          }
          else {
            return _mlift_create_keyed_row_11648(children_7, committed_9, identity_9, index_9, installed_3, item_9, last_6, parent_8, range_owned_4, renderer_9, root_9, x_80_12336, x_83_12345);
          }
        }));
  }
}
 
export function reconcile_keyed(renderer_0_10, root_0_0_23, parent_0_0_22, first_0_0_19, last_0_0_21, scope_0_0_23, table_28, items_5, key_5, compare_8, item_equals_6, children_0_7) /* forall<a,b,e> (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, parent : node, first : node, last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, table : ref<global,keyed-table<e,a,b>>, items : list<a>, key : (a) -> b, compare : (b, b) -> order, item-equals : (a, a) -> bool, children : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> ()) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var x_84_12347 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10475_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11691(children_0_7, compare_8, first_0_0_19, item_equals_6, items_5, key_5, last_0_0_21, parent_0_0_22, renderer_0_10, root_0_0_23, scope_0_0_23, table_28, _y_x10475_0);
    });
  }
  else {
     
    var x_85_12350 = $std_core_hnd._mask_at(x_84_12347, false, function() {
        return drain_keyed_retirements(table_28);
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___5_1 /* () */ ) {
        return _mlift_reconcile_keyed_11690(children_0_7, compare_8, first_0_0_19, item_equals_6, items_5, key_5, last_0_0_21, parent_0_0_22, renderer_0_10, root_0_0_23, scope_0_0_23, table_28, wild___5_1);
      });
    }
    else {
      var _x125 = $std_core_hnd._open_none1(transaction_load, table_28);
       
      var x_86_12354 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10479_1 /* hnd/ev-index */ ) {
          return _mlift_reconcile_keyed_11689(children_0_7, compare_8, first_0_0_19, item_equals_6, items_5, key_5, last_0_0_21, _x125.table_index, _x125.table_order, parent_0_0_22, renderer_0_10, root_0_0_23, scope_0_0_23, table_28, _y_x10479_1);
        });
      }
      else {
         
        var x_87_12357 = $std_core_hnd._mask_at(x_86_12354, false, function() {
            return open_keyed_participation(renderer_0_10, root_0_0_23);
          });
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(participation_20 /* keyed-participation */ ) {
            return _mlift_reconcile_keyed_11688(children_0_7, compare_8, first_0_0_19, item_equals_6, items_5, key_5, last_0_0_21, _x125.table_index, _x125.table_order, parent_0_0_22, renderer_0_10, root_0_0_23, scope_0_0_23, table_28, participation_20);
          });
        }
        else {
           
          var owns_provision_5 = $std_core_hnd._open_none1(function(current_1 /* keyed-participation */ ) {
              return (current_1._tag === 1);
            }, x_87_12357);
           
          var publication_transaction_22 = $std_core_hnd._open_none1(function(current_0_1 /* keyed-participation */ ) {
              return (current_0_1._tag === 1) ? current_0_1.keyed_journal : current_0_1.keyed_journal;
            }, x_87_12357);
           
          var next_index_5 = $std_core_hnd._open_none1(transaction_cell, $kokaine_internal_key_dash_index.Key_index_empty);
           
          var updates_7 = $std_core_hnd._open_none1(transaction_cell, $std_core_types.Nil);
           
          var drafts_10 = $std_core_hnd._open_none1(transaction_cell, $std_core_types.Nil);
           
          var position_6 = $std_core_hnd._open_none1(transaction_cell, 0);
           
          var move_phase_14 = $std_core_hnd._open_none1(transaction_cell, false);
           
          var _x_x1_7_11344_0 = $std_core_hnd._open_none0(dom_keyed_no_session);
           
          var move_session_14 = $std_core_hnd._open_none1(transaction_cell, _x_x1_7_11344_0);
           
          var committed_0_25 = $std_core_hnd._open_none1(transaction_cell, false);
           
          var enlisted_8 = $std_core_hnd._open_none1(transaction_cell, false);
           
          var staged_retirements_23 = $std_core_hnd._open_none1(transaction_cell, $std_core_types.Nil);
           
          var x_89_12364 = $std_core_hnd._open_at3(0, function(parent_1_1 /* node */ , first_3_1 /* node */ , last_3_0 /* node */ ) {
               
              var result_13 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
                  return dom_range_first(parent_1_1, first_3_1, last_3_0);
                });
              var _x126 = $std_core_hnd._open_none1(dom_attempt_ok, result_13);
              if (_x126) {
                return $std_core_hnd._open_none1(dom_attempt_value, result_13);
              }
              else {
                return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_13)));
              }
            }, parent_0_0_22, first_0_0_19, last_0_0_21);
          if ($std_core_hnd._yielding()) {
            var _x128 = $std_core_hnd.yield_extend(function(old_cursor_1 /* node */ ) {
              return _mlift_reconcile_keyed_11687(children_0_7, committed_0_25, compare_8, drafts_10, enlisted_8, first_0_0_19, item_equals_6, items_5, key_5, last_0_0_21, move_phase_14, move_session_14, next_index_5, _x125.table_index, _x125.table_order, owns_provision_5, parent_0_0_22, x_87_12357, position_6, publication_transaction_22, renderer_0_10, root_0_0_23, scope_0_0_23, staged_retirements_23, table_28, updates_7, old_cursor_1);
            });
          }
          else {
            var _x128 = _mlift_reconcile_keyed_11687(children_0_7, committed_0_25, compare_8, drafts_10, enlisted_8, first_0_0_19, item_equals_6, items_5, key_5, last_0_0_21, move_phase_14, move_session_14, next_index_5, _x125.table_index, _x125.table_order, owns_provision_5, parent_0_0_22, x_87_12357, position_6, publication_transaction_22, renderer_0_10, root_0_0_23, scope_0_0_23, staged_retirements_23, table_28, updates_7, x_89_12364);
          }
          return $std_core_hnd.finally_prompt(function() {
              var _x126 = $std_core_hnd._open_none1(transaction_load, committed_0_25);
              if (_x126) {
                return $std_core_types.Unit;
              }
              else {
                var _x127 = $std_core_hnd._open_none1(transaction_load, enlisted_8);
                if (_x127) {
                  return $std_core_types.Unit;
                }
                else {
                   
                  var x_88_12362 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
                  if ($std_core_hnd._yielding()) {
                    return $std_core_hnd.yield_extend(function(_y_x10482_1 /* hnd/ev-index */ ) {
                      return _mlift_reconcile_keyed_11652(drafts_10, first_0_0_19, last_0_0_21, move_phase_14, move_session_14, _x125.table_order, parent_0_0_22, x_87_12357, staged_retirements_23, _y_x10482_1);
                    });
                  }
                  else {
                    return _mlift_reconcile_keyed_11652(drafts_10, first_0_0_19, last_0_0_21, move_phase_14, move_session_14, _x125.table_order, parent_0_0_22, x_87_12357, staged_retirements_23, x_88_12362);
                  }
                }
              }
            }, _x128);
        }
      }
    }
  }
}
 
export function mount_keyed_fields(renderer_1_6, root_1_0_6, parent_1_0_6, before_0_2, read_5, walk_4, key_0_6, compare_0_6, item_equals_0_6, children_1_6) /* forall<a,b,c,e> (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, parent : node, before : maybe<node>, read : () -> kokaine/reactive/effects/signal-read a, walk : forall<e1> (a, (b) -> e1 ()) -> e1 (), key : (b) -> c, compare : (c, c) -> order, item-equals : (b, b) -> bool, children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> ()) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var x_90_12367 = $std_core_hnd._open_at1(0, function(root_5_0 /* kokaine/reactive/root<ui> */ ) {
       
      var x_91_12370 = $kokaine_reactive_integration_internal_lifetime_dash_scope.open_lifetime_scope($std_core_hnd._open_none1(function(value_8 /* kokaine/reactive/root<ui> */ ) {
          return value_8;
        }, root_5_0));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_mount_keyed_fields_11703);
      }
      else {
        return _mlift_mount_keyed_fields_11703(x_91_12370);
      }
    }, root_1_0_6);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(scope_1_0_6 /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
      return _mlift_mount_keyed_fields_11704(before_0_2, children_1_6, compare_0_6, item_equals_0_6, key_0_6, parent_1_0_6, read_5, renderer_1_6, root_1_0_6, walk_4, scope_1_0_6);
    });
  }
  else {
     
    var committed_1_6 = $std_core_hnd._open_none1(transaction_cell, false);
     
    var installed_0_4 = $std_core_hnd._open_none1(transaction_cell, false);
     
    var range_owned_0_5 = $std_core_hnd._open_none1(transaction_cell, false);
    return $std_core_hnd.finally_prompt(function() {
        var _x129 = $std_core_hnd._open_none1(transaction_load, committed_1_6);
        if (_x129) {
          return $std_core_types.Unit;
        }
        else {
           
          var x_92_12374 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10571_1 /* hnd/ev-index */ ) {
              return _mlift_mount_keyed_fields_11692(x_90_12367, _y_x10571_1);
            });
          }
          else {
            return _mlift_mount_keyed_fields_11692(x_90_12367, x_92_12374);
          }
        }
      }, $kokaine_reactive_integration.with_lifetime_scope(root_1_0_6, x_90_12367, function() {
           
          var x_93_12376 = $std_core_hnd._open_at1(0, dom_attempt, function() {
              return dom_create_comment("kokaine:for");
            });
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(first_1_0_8 /* node */ ) {
              return _mlift_mount_keyed_fields_11702(before_0_2, children_1_6, committed_1_6, compare_0_6, installed_0_4, item_equals_0_6, key_0_6, parent_1_0_6, range_owned_0_5, read_5, renderer_1_6, root_1_0_6, x_90_12367, walk_4, first_1_0_8);
            });
          }
          else {
            return _mlift_mount_keyed_fields_11702(before_0_2, children_1_6, committed_1_6, compare_0_6, installed_0_4, item_equals_0_6, key_0_6, parent_1_0_6, range_owned_0_5, read_5, renderer_1_6, root_1_0_6, x_90_12367, walk_4, x_93_12376);
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
     
    var x_94_12378 = $std_core_hnd._open_at1(0, dom_attempt, function() {
        return dom_create_text(tree_0_0.content);
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(target_2 /* node */ ) {
        return _mlift_mount_view_11705(before_1_7, parent_3_0_10, target_2);
      });
    }
    else {
      return $std_core_hnd._open_at3(0, insert, parent_3_0_10, before_1_7, x_94_12378);
    }
  }
  else if (tree_0_0._tag === 3) {
     
    var x_95_12381 = $std_core_hnd._open_at1(0, dom_attempt, function() {
        return dom_create_text("");
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(target_0_2 /* node */ ) {
        return _mlift_mount_view_11710(before_1_7, parent_3_0_10, tree_0_0.read, root_3_0_8, target_0_2);
      });
    }
    else {
       
      var x_96_12384 = $std_core_hnd._open_at3(0, insert, parent_3_0_10, before_1_7, x_95_12381);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild___26_1 /* () */ ) {
          return _mlift_mount_view_11709(tree_0_0.read, root_3_0_8, x_95_12381, wild___26_1);
        });
      }
      else {
         
        var x_97_12387 = $kokaine_reactive.create_effect(root_3_0_8, function() {
             
            var x_98_12390 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_y_x10608_1 /* hnd/ev-index */ ) {
                return _mlift_mount_view_11706(tree_0_0.read, _y_x10608_1);
              });
            }
            else {
              return _mlift_mount_view_11706(tree_0_0.read, x_98_12390);
            }
          }, function(value_11_1 /* string */ ) {
             
            var x_99_12392 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_y_x10611_1 /* hnd/ev-index */ ) {
                return _mlift_mount_view_11707(x_95_12381, value_11_1, _y_x10611_1);
              });
            }
            else {
              return _mlift_mount_view_11707(x_95_12381, value_11_1, x_99_12392);
            }
          });
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(_mlift_mount_view_11708);
        }
        else {
          return $std_core_types.Unit;
        }
      }
    }
  }
  else if (tree_0_0._tag === 4) {
     
    var _x_x1_3_11516 = $std_core_hnd._open_none1($kokaine_html.is_valid_element_name, tree_0_0.name);
    var _x130 = $std_core_hnd._open_none1(function(b_6 /* bool */ ) {
        return (b_6) ? false : true;
      }, _x_x1_3_11516);
    if (_x130) {
       
      var _x_x1_5_11518 = $std_core_types._lp__plus__plus__rp_("invalid HTML element name: ", tree_0_0.name);
      return $std_core_hnd._open_at2(0, $std_core_exn.$throw, _x_x1_5_11518);
    }
    else {
       
      var x_100_12394 = $std_core_hnd._open_at1(0, dom_attempt, function() {
          return dom_create_element(parent_3_0_10, tree_0_0.name);
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(target_1_3 /* element */ ) {
          return _mlift_mount_view_11714(tree_0_0.attributes, before_1_7, tree_0_0.children, parent_3_0_10, renderer_3_7, root_3_0_8, target_1_3);
        });
      }
      else {
         
        var x_101_12397 = record_owner(root_3_0_8, $std_core_hnd._open_none1(element_node, x_100_12394));
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(wild___0_2_1 /* () */ ) {
            return _mlift_mount_view_11713(tree_0_0.attributes, before_1_7, tree_0_0.children, parent_3_0_10, renderer_3_7, root_3_0_8, x_100_12394, wild___0_2_1);
          });
        }
        else {
           
          var x_102_12400 = $std_core_list.foreach(tree_0_0.attributes, function(attribute_0 /* kokaine/html/attribute<12154> */ ) {
              return mount_attribute(root_3_0_8, x_100_12394, attribute_0);
            });
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(wild___1_2_1 /* () */ ) {
              return _mlift_mount_view_11712(before_1_7, tree_0_0.children, parent_3_0_10, renderer_3_7, root_3_0_8, x_100_12394, wild___1_2_1);
            });
          }
          else {
             
            var x_103_12403 = $std_core_list.foreach(tree_0_0.children, function(child_1 /* kokaine/html/view<12154> */ ) {
                return mount_view(renderer_3_7, root_3_0_8, $std_core_hnd._open_none1(element_node, x_100_12394), $std_core_types.Nothing, child_1);
              });
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(wild___2_2_1 /* () */ ) {
                return _mlift_mount_view_11711(before_1_7, parent_3_0_10, x_100_12394, wild___2_2_1);
              });
            }
            else {
               
              var _x_x3_1_11525_0 = $std_core_hnd._open_none1(element_node, x_100_12394);
              return $std_core_hnd._open_at3(0, function(parent_6_1 /* node */ , before_2_0 /* maybe<node> */ , child_0_0 /* node */ ) {
                  if (before_2_0 === null) {
                     
                    var result_14 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
                        return dom_append(parent_6_1, child_0_0);
                      });
                    var _x131 = $std_core_hnd._open_none1(dom_attempt_ok, result_14);
                    if (_x131) {
                      return $std_core_hnd._open_none1(dom_attempt_value, result_14);
                    }
                    else {
                      return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_14)));
                    }
                  }
                  else {
                     
                    var result_15 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
                        return dom_insert_before(parent_6_1, child_0_0, before_2_0.value);
                      });
                    var _x132 = $std_core_hnd._open_none1(dom_attempt_ok, result_15);
                    if (_x132) {
                      return $std_core_hnd._open_none1(dom_attempt_value, result_15);
                    }
                    else {
                      return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_15)));
                    }
                  }
                }, parent_3_0_10, before_1_7, _x_x3_1_11525_0);
            }
          }
        }
      }
    }
  }
  else if (tree_0_0._tag === 5) {
    return $std_core_list.foreach(tree_0_0.children, function(child_0_0_0 /* kokaine/html/view<12154> */ ) {
        return mount_view(renderer_3_7, root_3_0_8, parent_3_0_10, before_1_7, child_0_0_0);
      });
  }
  else if (tree_0_0._tag === 6) {
     
    var x_104_12408 = $std_core_hnd._open_at1(0, dom_attempt, function() {
        return dom_create_comment("kokaine:region");
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(first_2_0_3 /* node */ ) {
        return _mlift_mount_view_11722(before_1_7, parent_3_0_10, tree_0_0.read, renderer_3_7, root_3_0_8, first_2_0_3);
      });
    }
    else {
       
      var x_105_12411 = $std_core_hnd._open_at1(0, dom_attempt, function() {
          return dom_create_comment("/kokaine:region");
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(last_2_0_4 /* node */ ) {
          return _mlift_mount_view_11721(before_1_7, x_104_12408, parent_3_0_10, tree_0_0.read, renderer_3_7, root_3_0_8, last_2_0_4);
        });
      }
      else {
         
        var x_106_12414 = $std_core_hnd._open_at4(0, insert_marker_pair, parent_3_0_10, before_1_7, x_104_12408, x_105_12411);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(wild___3_2_1 /* () */ ) {
            return _mlift_mount_view_11720(x_104_12408, x_105_12411, parent_3_0_10, tree_0_0.read, renderer_3_7, root_3_0_8, wild___3_2_1);
          });
        }
        else {
           
          var x_107_12417 = $kokaine_reactive.create_effect(root_3_0_8, function() {
               
              var x_108_12420 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
              if ($std_core_hnd._yielding()) {
                return $std_core_hnd.yield_extend(function(_y_x10633_1 /* hnd/ev-index */ ) {
                  return _mlift_mount_view_11715(tree_0_0.read, _y_x10633_1);
                });
              }
              else {
                return _mlift_mount_view_11715(tree_0_0.read, x_108_12420);
              }
            }, function(next_1_2 /* kokaine/html/view<12154> */ ) {
               
              var x_109_12422 = $std_core_hnd._open_at2(0, function(root_7_1 /* kokaine/reactive/root<ui> */ , cleanup_1_0 /* () -> <kokaine/reactive/effects/signal-write,pure,ui> () */ ) {
                   
                  var root_0_10046_1_0 = $std_core_hnd._open_none1(function(value_12_0 /* kokaine/reactive/root<ui> */ ) {
                      return value_12_0;
                    }, root_7_1);
                   
                  var x_110_12424 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046_1_0, cleanup_1_0);
                  if ($std_core_hnd._yielding()) {
                    return $std_core_hnd.yield_extend(_mlift_mount_view_11716);
                  }
                  else {
                    return _mlift_mount_view_11716(x_110_12424);
                  }
                }, root_3_0_8, function() {
                   
                  var x_111_12426 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
                  if ($std_core_hnd._yielding()) {
                    return $std_core_hnd.yield_extend(function(_y_x10637_1 /* hnd/ev-index */ ) {
                      return _mlift_mount_view_11717(x_104_12408, x_105_12411, _y_x10637_1);
                    });
                  }
                  else {
                    return _mlift_mount_view_11717(x_104_12408, x_105_12411, x_111_12426);
                  }
                });
              if ($std_core_hnd._yielding()) {
                return $std_core_hnd.yield_extend(function(wild___4_2_1 /* () */ ) {
                  return _mlift_mount_view_11718(x_105_12411, next_1_2, parent_3_0_10, renderer_3_7, root_3_0_8, wild___4_2_1);
                });
              }
              else {
                return _mlift_mount_view_11718(x_105_12411, next_1_2, parent_3_0_10, renderer_3_7, root_3_0_8, x_109_12422);
              }
            });
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(_mlift_mount_view_11719);
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
export function _mlift_mount_effect_11723(_y_x10648) /* (hnd/ev-index) -> <exn,div> () */  {
  return $std_core_hnd._mask_at(_y_x10648, false, function() {
      return $std_core_types.Unit;
    });
}
 
 
// monadic lift
export function _mlift_mount_effect_11724(_y_x10647) /* (hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn> () */  {
  return $std_core_hnd._mask_at(_y_x10647, false, function() {
       
      var x_12429 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_mount_effect_11723);
      }
      else {
        return $std_core_hnd._mask_at(x_12429, false, function() {
            return $std_core_types.Unit;
          });
      }
    });
}
 
 
// monadic lift
export function _mlift_mount_effect_11725(_pat_2) /* (kokaine/reactive/internal/model/cleanup-registration<ui>) -> exn () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_effect_11726(first, last, _y_x10658) /* (first : node, last : node, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10658, false, function() {
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_clean_range(first, last, true);
        });
      var _x133 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x133) {
        return $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
    });
}
 
 
// monadic lift
export function _mlift_mount_effect_11727(last, parent, renderer, root, tree, wild___0) /* forall<e> (last : node, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, tree : kokaine/html/view<e>, wild_@0 : ()) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
  return mount_view(renderer, root, parent, $std_core_types.Just(last), tree);
}
 
 
// monadic lift
export function _mlift_mount_effect_11728(first, last, parent, renderer, root, tree, wild__) /* forall<e> (first : node, last : node, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, tree : kokaine/html/view<e>, wild_ : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_12433 = $std_core_hnd._open_at2(0, function(root_0 /* kokaine/reactive/root<ui> */ , cleanup /* () -> <kokaine/reactive/effects/signal-write,pure,ui> () */ ) {
       
      var root_0_10046 = $std_core_hnd._open_none1(function(value /* kokaine/reactive/root<ui> */ ) {
          return value;
        }, root_0);
       
      var x_0_12435 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046, cleanup);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_mount_effect_11725);
      }
      else {
        return $std_core_types.Unit;
      }
    }, root, function() {
       
      var x_1_12437 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10658 /* hnd/ev-index */ ) {
          return _mlift_mount_effect_11726(first, last, _y_x10658);
        });
      }
      else {
        return _mlift_mount_effect_11726(first, last, x_1_12437);
      }
    });
   
  function next_12434(wild___0) /* (()) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
    return mount_view(renderer, root, parent, $std_core_types.Just(last), tree);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_12434);
  }
  else {
    return next_12434(x_12433);
  }
}
 
 
// monadic lift
export function _mlift_mount_effect_11729(first, parent, renderer, root, tree, last) /* forall<e> (first : node, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, tree : kokaine/html/view<e>, last : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_12445 = $std_core_hnd._open_at4(0, function(parent_0 /* node */ , before /* maybe<node> */ , first_0 /* node */ , last_0 /* node */ ) {
      if (before === null) {
         
        var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_append_marker_pair(parent_0, first_0, last_0);
          });
        var _x134 = $std_core_hnd._open_none1(dom_attempt_ok, result);
        if (_x134) {
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
        var _x135 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
        if (_x135) {
          return $std_core_hnd._open_none1(dom_attempt_value, result_0);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
        }
      }
    }, parent, $std_core_types.Nothing, first, last);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_mount_effect_11728(first, last, parent, renderer, root, tree, wild__);
    });
  }
  else {
    return _mlift_mount_effect_11728(first, last, parent, renderer, root, tree, x_12445);
  }
}
 
 
// monadic lift
export function _mlift_mount_effect_11730(parent, renderer, root, tree, first) /* forall<e> (parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, tree : kokaine/html/view<e>, first : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_12449 = $std_core_hnd._open_at1(0, dom_attempt, function() {
      return dom_create_comment("/kokaine:mount");
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(last /* node */ ) {
      return _mlift_mount_effect_11729(first, parent, renderer, root, tree, last);
    });
  }
  else {
    return _mlift_mount_effect_11729(first, parent, renderer, root, tree, x_12449);
  }
}
 
export function mount_effect(renderer, root, parent, tree) /* forall<e> (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, parent : node, tree : kokaine/html/view<e>) -> <kokaine/reactive/effects/signal-write,ui,pure> kokaine/reactive/disposer<ui> */  {
  return $kokaine_reactive.create_effect(root, function() {
       
      var x_12451 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_mount_effect_11724);
      }
      else {
        return _mlift_mount_effect_11724(x_12451);
      }
    }, function(___wildcard_x1633__40 /* () */ ) {
       
      var x_0_12453 = $std_core_hnd._open_at1(0, dom_attempt, function() {
          return dom_create_comment("kokaine:mount");
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(first /* node */ ) {
          return _mlift_mount_effect_11730(parent, renderer, root, tree, first);
        });
      }
      else {
        return _mlift_mount_effect_11730(parent, renderer, root, tree, x_0_12453);
      }
    });
}
 
 
// monadic lift
export function _mlift_mount_transaction_11731(pending, dispose_0) /* (pending : ref<global,maybe<() -> <exn,ui> ()>>, dispose@0 : () -> <exn,ui> ()) -> <kokaine/reactive/effects/signal-write,ui,pure> (() -> <exn,ui> ()) */  {
   
  $std_core_hnd._open_none2(transaction_store, pending, $std_core_types.Just(dispose_0));
  return dispose_0;
}
 
 
// monadic lift
export function _mlift_mount_transaction_11732(register, _y_x10676) /* (register : () -> <div,exn,kokaine/reactive/effects/signal-write,ui> (() -> <exn,ui> ()), hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui> (() -> <exn,ui> ()) */  {
  return $std_core_hnd._mask_at(_y_x10676, false, register);
}
 
 
// monadic lift
export function _mlift_mount_transaction_11733(register, root, _y_x10672) /* (register : () -> <div,exn,kokaine/reactive/effects/signal-write,ui> (() -> <exn,ui> ()), root : kokaine/reactive/root<ui>, owner-match) -> <exn,ui> (() -> <exn,ui> ()) */  {
  if (_y_x10672._tag === 1) {
     
    var inner_0_0 = $std_core_hnd._open_none1(function(value_1 /* kokaine/reactive/root<ui> */ ) {
        return value_1;
      }, root);
    return $kokaine_reactive_internal_runtime.update(inner_0_0, function() {
         
        var root_0_10027_0 = $std_core_hnd._open_none1(function(value_2 /* kokaine/reactive/root<ui> */ ) {
            return value_2;
          }, root);
        return $kokaine_reactive_internal_runtime.batch(root_0_10027_0, register);
      });
  }
  else if (_y_x10672._tag === 3) {
    return $std_core_exn.$throw("cannot mount into a retired Kokaine DOM generation");
  }
  else {
    return $kokaine_reactive_integration_internal_reentry.run_reentry($std_core_hnd._open_none1(function(value_0_0 /* kokaine/reactive/integration/reentry<ui> */ ) {
          return value_0_0;
        }, _y_x10672.owner_portal), function() {
         
        var x_12455 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10676 /* hnd/ev-index */ ) {
            return $std_core_hnd._mask_at(_y_x10676, false, register);
          });
        }
        else {
          return $std_core_hnd._mask_at(x_12455, false, register);
        }
      });
  }
}
 
 
// monadic lift
export function _mlift_mount_transaction_11734(committed, _c_x10680) /* (committed : ref<global,bool>, () -> <exn,ui> ()) -> (() -> <exn,ui> ()) */  {
   
  $std_core_hnd._open_none2(transaction_store, committed, true);
  return _c_x10680;
}
 
 
// monadic lift
export function _mlift_mount_transaction_11735(inherit_owner, parent, root, tree, wild__) /* forall<e> (inherit-owner : bool, parent : node, root : kokaine/reactive/root<ui>, tree : kokaine/html/view<e>, wild_ : ()) -> <ui,exn> (() -> <exn,ui> ()) */  {
   
  var renderer = $std_core_hnd._open_none0(function() {
    return $kokaine_dom_internal_keyed_dash_transaction.cell($std_core_types.Nil);
  });
   
  var pending = $std_core_hnd._open_none1(transaction_cell, $std_core_types.Nothing);
   
  var committed = $std_core_hnd._open_none1(transaction_cell, false);
   
  function register() /* () -> <div,exn,kokaine/reactive/effects/signal-write,ui> (() -> <exn,ui> ()) */  {
     
    var x_12461 = mount_effect(renderer, root, parent, tree);
     
    function next_12462(dispose_0) /* (kokaine/reactive/disposer<ui>) -> <kokaine/reactive/effects/signal-write,ui,pure> (() -> <exn,ui> ()) */  {
       
      $std_core_hnd._open_none2(transaction_store, pending, $std_core_types.Just(dispose_0));
      return dispose_0;
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(next_12462);
    }
    else {
      return next_12462(x_12461);
    }
  }
   
  var _x134 = $std_core_hnd._open_none1(function(b /* bool */ ) {
      return (b) ? false : true;
    }, inherit_owner);
  if (_x134) {
     
    var inner_0 = $std_core_hnd._open_none1(function(value /* kokaine/reactive/root<ui> */ ) {
        return value;
      }, root);
    var x_0_12465 = $kokaine_reactive_internal_runtime.update(inner_0, function() {
         
        var root_0_10027 = $std_core_hnd._open_none1(function(value_0 /* kokaine/reactive/root<ui> */ ) {
            return value_0;
          }, root);
        return $kokaine_reactive_internal_runtime.batch(root_0_10027, register);
      });
  }
  else {
     
    var x_1_12467 = find_owner(root, parent);
    if ($std_core_hnd._yielding()) {
      var x_0_12465 = $std_core_hnd.yield_extend(function(_y_x10672 /* owner-match */ ) {
        return _mlift_mount_transaction_11733(register, root, _y_x10672);
      });
    }
    else {
      var x_0_12465 = _mlift_mount_transaction_11733(register, root, x_1_12467);
    }
  }
  if ($std_core_hnd._yielding()) {
    var _x136 = $std_core_hnd.yield_extend(function(_c_x10680 /* () -> <exn,ui> () */ ) {
       
      $std_core_hnd._open_none2(transaction_store, committed, true);
      return _c_x10680;
    });
  }
  else {
     
    $std_core_hnd._open_none2(transaction_store, committed, true);
    var _x136 = x_0_12465;
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x134 = $std_core_hnd._open_none1(transaction_load, committed);
      if (_x134) {
        return $std_core_types.Unit;
      }
      else {
        var _x135 = $std_core_hnd._open_none1(transaction_load, pending);
        if (_x135 === null) {
          return $std_core_types.Unit;
        }
        else {
          return _x135.value();
        }
      }
    }, _x136);
}
 
export function mount_transaction(root, parent, tree, inherit_owner) /* forall<e> (root : kokaine/reactive/root<ui>, parent : node, tree : kokaine/html/view<e>, inherit-owner : bool) -> <ui,exn> kokaine/reactive/disposer<ui> */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_install_shadow_tracker(parent);
    });
   
  var _x137 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x137) {
    var x_12471 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_12471 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_mount_transaction_11735(inherit_owner, parent, root, tree, wild__);
    });
  }
  else {
     
    var renderer = $std_core_hnd._open_none0(function() {
      return $kokaine_dom_internal_keyed_dash_transaction.cell($std_core_types.Nil);
    });
     
    var pending = $std_core_hnd._open_none1(transaction_cell, $std_core_types.Nothing);
     
    var committed = $std_core_hnd._open_none1(transaction_cell, false);
     
    var register = function() {
       
      var x_0_12477 = mount_effect(renderer, root, parent, tree);
       
      var next_0_12478 = function(dispose_0 /* () -> <exn,ui> () */ ) {
         
        $std_core_hnd._open_none2(transaction_store, pending, $std_core_types.Just(dispose_0));
        return dispose_0;
      };
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(next_0_12478);
      }
      else {
        return next_0_12478(x_0_12477);
      }
    };
     
    var _x137 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, inherit_owner);
    if (_x137) {
       
      var inner_0 = $std_core_hnd._open_none1(function(value /* kokaine/reactive/root<ui> */ ) {
          return value;
        }, root);
      var x_1_12481 = $kokaine_reactive_internal_runtime.update(inner_0, function() {
           
          var root_0_10027 = $std_core_hnd._open_none1(function(value_0 /* kokaine/reactive/root<ui> */ ) {
              return value_0;
            }, root);
          return $kokaine_reactive_internal_runtime.batch(root_0_10027, register);
        });
    }
    else {
       
      var x_2_12483 = find_owner(root, parent);
      if ($std_core_hnd._yielding()) {
        var x_1_12481 = $std_core_hnd.yield_extend(function(_y_x10672 /* owner-match */ ) {
          return _mlift_mount_transaction_11733(register, root, _y_x10672);
        });
      }
      else {
        var x_1_12481 = _mlift_mount_transaction_11733(register, root, x_2_12483);
      }
    }
    if ($std_core_hnd._yielding()) {
      var _x139 = $std_core_hnd.yield_extend(function(_c_x10680 /* () -> <exn,ui> () */ ) {
         
        $std_core_hnd._open_none2(transaction_store, committed, true);
        return _c_x10680;
      });
    }
    else {
       
      $std_core_hnd._open_none2(transaction_store, committed, true);
      var _x139 = x_1_12481;
    }
    return $std_core_hnd.finally_prompt(function() {
        var _x137 = $std_core_hnd._open_none1(transaction_load, committed);
        if (_x137) {
          return $std_core_types.Unit;
        }
        else {
          var _x138 = $std_core_hnd._open_none1(transaction_load, pending);
          if (_x138 === null) {
            return $std_core_types.Unit;
          }
          else {
            return _x138.value();
          }
        }
      }, _x139);
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