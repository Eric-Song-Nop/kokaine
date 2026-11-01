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
