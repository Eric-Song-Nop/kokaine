// Unit tests for packages/core/src/kokaine/dom-inline.js against a fake DOM realm.
// Run: node --test "test/sidecar/*.test.mjs"
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createFakeRealm } from './fake-realm.mjs';
import { loadSidecar, SIDECARS } from './load.mjs';

const SHADOW_KEY = Symbol.for('kokaine.dom.shadow-roots');
const OWNERS_KEY = Symbol.for('kokaine.dom.owners');
// Objects created inside the sidecar's realm have that realm's
// Object.prototype; copy them before a deep (prototype-checking) comparison.
const plain = (value) => ({ ...value });

function setup(options) {
  const fake = createFakeRealm(options);
  const { fns, realm } = loadSidecar(SIDECARS.dom.js, { document: fake.document });
  return { ...fake, fns, realm };
}

describe('shadow-root tracker install', () => {
  it('wraps a data-property attachShadow once and records closed hosts', () => {
    const { fns, realm, document, body, Element, nativeAttachShadow } = setup();
    fns.kokaineDomInstallShadowTracker(body);

    const tracker = realm[SHADOW_KEY];
    assert.equal(tracker.version, 1);
    const wrapper = Element.prototype.attachShadow;
    assert.notEqual(wrapper, nativeAttachShadow);
    assert.equal(wrapper.name, 'attachShadow');
    const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'attachShadow');
    assert.deepEqual(
      [descriptor.configurable, descriptor.enumerable, descriptor.writable],
      [true, true, true],
    );
    assert.deepEqual(plain(tracker.realms.get(document.defaultView)), {
      prototype: Element.prototype, wrapper, epoch: 0,
    });

    const closedHost = document.createElement('div');
    const closedRoot = closedHost.attachShadow({ mode: 'closed' });
    assert.equal(closedRoot.mode, 'closed');
    assert.ok(tracker.known.has(closedHost));
    assert.ok(tracker.closed.has(closedHost));
    assert.equal(tracker.realms.get(document.defaultView).epoch, 1, 'attachShadow calls are counted');

    const openHost = document.createElement('div');
    openHost.attachShadow({ mode: 'open' });
    assert.ok(tracker.known.has(openHost));
    assert.ok(!tracker.closed.has(openHost));

    // A second install in an intact realm is a no-op.
    fns.kokaineDomInstallShadowTracker(document);
    assert.equal(Element.prototype.attachShadow, wrapper);
    assert.equal(tracker.realms.get(document.defaultView).replaced, undefined);
  });

  it('marks a realm replaced when a host shim swaps the wrapper, and keyed moves fail closed', () => {
    const { fns, realm, document, body, Element } = setup();
    fns.kokaineDomInstallShadowTracker(body);
    const wrapper = Element.prototype.attachShadow;
    const shim = function attachShadow(init) { return wrapper.call(this, init); };
    Element.prototype.attachShadow = shim;

    fns.kokaineDomInstallShadowTracker(body);
    const state = realm[SHADOW_KEY].realms.get(document.defaultView);
    assert.equal(state.replaced, true);
    // Mounting continues: the shim is not re-wrapped.
    assert.equal(Element.prototype.attachShadow, shim);

    const first = body.appendChild(document.createElement('span'));
    const last = body.appendChild(document.createElement('span'));
    assert.throws(
      () => fns.kokaineDomValidateRangeMoveLifecycle(body, first, last),
      /shadow-root tracking is unavailable/,
    );
  });

  it('records a realm without attachShadow as wrapper-less', () => {
    const { fns, realm, document, body, Element } = setup({ attachShadow: 'none' });
    fns.kokaineDomInstallShadowTracker(body);
    assert.equal(typeof Element.prototype.attachShadow, 'undefined');
    assert.deepEqual(plain(realm[SHADOW_KEY].realms.get(document.defaultView)), {
      prototype: Element.prototype, wrapper: null, epoch: 0,
    });
  });

  it('refuses to wrap an accessor attachShadow', () => {
    const { fns, realm, body } = setup({ attachShadow: 'accessor' });
    assert.throws(
      () => fns.kokaineDomInstallShadowTracker(body),
      /cannot safely wrap this DOM realm attachShadow implementation/,
    );
    assert.equal(realm[SHADOW_KEY].realms.has(body.ownerDocument.defaultView), false);
  });

  it('refuses nodes outside a DOM realm and foreign tracker shapes', () => {
    const { fns, realm, body } = setup();
    assert.throws(() => fns.kokaineDomInstallShadowTracker(null), /outside a DOM realm/);
    assert.throws(
      () => fns.kokaineDomInstallShadowTracker({ nodeType: 1, ownerDocument: { defaultView: {} } }),
      /outside a DOM realm/,
    );
    realm[SHADOW_KEY] = { version: 2 };
    assert.throws(() => fns.kokaineDomInstallShadowTracker(body), /invalid Kokaine shadow-root tracker/);
  });

  it('remembers parsed trees, including declarative closed shadow roots', () => {
    const { fns, realm, document, body } = setup();
    fns.kokaineDomInstallShadowTracker(body);
    const tracker = realm[SHADOW_KEY];

    const fragment = document.createElement('template').content;
    const host = fragment.appendChild(document.createElement('section'));
    const declarative = host.appendChild(document.createElement('template'));
    declarative.setAttribute('shadowrootmode', 'CLOSED');
    const inner = declarative.content.appendChild(document.createElement('p'));
    const sibling = fragment.appendChild(document.createElement('div'));

    tracker.remember(fragment);
    for (const node of [host, declarative, inner, sibling]) assert.ok(tracker.known.has(node));
    assert.ok(tracker.closed.has(host));
    assert.ok(!tracker.closed.has(sibling));
  });
});

describe('keyed-move lifecycle validation', () => {
  function row(options) {
    const context = setup(options);
    const { fns, document, body } = context;
    fns.kokaineDomInstallShadowTracker(body);
    const first = fns.kokaineDomCreateElement(body, 'span');
    const last = fns.kokaineDomCreateElement(body, 'span');
    body.appendChild(first);
    return { ...context, first, last, insert: (node) => { body.appendChild(node); body.appendChild(last); return node; } };
  }

  it('accepts a row built only from tracked elements', () => {
    const { fns, body, first, last, insert } = row();
    const cell = insert(fns.kokaineDomCreateElement(body, 'div'));
    cell.appendChild(fns.kokaineDomCreateElement(cell, 'p'));
    assert.doesNotThrow(() => fns.kokaineDomValidateRangeMoveLifecycle(body, first, last));
  });

  it('rejects closed shadow hosts, untracked shadow-capable hosts, and custom elements', () => {
    const closed = row();
    const host = closed.insert(closed.fns.kokaineDomCreateElement(closed.body, 'div'));
    host.attachShadow({ mode: 'closed' });
    assert.throws(
      () => closed.fns.kokaineDomValidateRangeMoveLifecycle(closed.body, closed.first, closed.last),
      /closed shadow roots are opaque/,
    );

    const external = row();
    external.insert(external.document.createElement('div'));
    assert.throws(
      () => external.fns.kokaineDomValidateRangeMoveLifecycle(external.body, external.first, external.last),
      /external shadow host may contain an untracked closed root/,
    );

    const custom = row();
    custom.insert(custom.fns.kokaineDomCreateElement(custom.body, 'x-widget'));
    assert.throws(
      () => custom.fns.kokaineDomValidateRangeMoveLifecycle(custom.body, custom.first, custom.last),
      /custom-element move callbacks/,
    );

    const customized = row();
    customized.insert(customized.fns.kokaineDomCreateElement(customized.body, 'p')).setAttribute('is', 'x-para');
    assert.throws(
      () => customized.fns.kokaineDomValidateRangeMoveLifecycle(customized.body, customized.first, customized.last),
      /custom-element move callbacks/,
    );
  });
});

describe('keyed-move validator memoisation', () => {
  function rows(count) {
    const context = setup();
    const { fns, body } = context;
    fns.kokaineDomInstallShadowTracker(body);
    const ranges = [];
    for (let i = 0; i < count; i++) {
      const first = body.appendChild(fns.kokaineDomCreateElement(body, 'span'));
      const cell = body.appendChild(fns.kokaineDomCreateElement(body, 'div'));
      const inner = cell.appendChild(fns.kokaineDomCreateElement(cell, 'p'));
      inner.appendChild(fns.kokaineDomCreateElement(inner, 'p'));
      const last = body.appendChild(fns.kokaineDomCreateElement(body, 'span'));
      ranges.push({ first, cell, last });
    }
    return { ...context, ranges };
  }

  function counting(object, name) {
    const original = object[name];
    const counter = { calls: 0 };
    object[name] = function (...args) {
      counter.calls++;
      return original.apply(this, args);
    };
    return counter;
  }

  it('creates one baseline per (namespace, localName) and serialises each element once, shallowly', () => {
    const { fns, realm, document, body, view, ranges } = rows(3);
    const created = counting(view.Document.prototype, 'createElementNS');
    const imported = counting(view.Document.prototype, 'importNode');
    const serialised = [];
    const descriptor = Object.getOwnPropertyDescriptor(view.Element.prototype, 'outerHTML');
    Object.defineProperty(view.Element.prototype, 'outerHTML', {
      configurable: true,
      get() {
        const value = descriptor.get.call(this);
        serialised.push(value);
        return value;
      },
    });
    for (const { first, last } of ranges) fns.kokaineDomValidateRangeMoveLifecycle(body, first, last, null);
    // span, div and p: one baseline each across all three rows.
    assert.equal(created.calls, 3);
    // 3 rows x 5 elements, each serialised as a childless shallow copy rather
    // than the original subtree.
    assert.equal(imported.calls, 15);
    assert.equal(serialised.length, 15);
    assert.ok(serialised.every((value) => /^<(\w+)[^<>]*><\/\1>$/.test(value)), serialised.join(' '));
    for (const { first, last } of ranges) fns.kokaineDomValidateRangeMoveLifecycle(body, first, last, null);
    assert.equal(created.calls, 3, 'baselines are memoised on the tracker');
    assert.equal(imported.calls, 15, 'an element without an is value is never serialised again');
    const inspection = realm[SHADOW_KEY].realms.get(document.defaultView).inspection;
    assert.equal(inspection.baselines.size, 3);
  });

  it('still rejects an is value without an attribute and a later prototype swap', () => {
    const { fns, realm, document, body, view, ranges } = rows(2);
    const [one, two] = ranges;
    fns.kokaineDomValidateRangeMoveLifecycle(body, one.first, one.last, null);
    fns.kokaineDomValidateRangeMoveLifecycle(body, two.first, two.last, null);

    // createElement(name, { is }) sets no attribute; only serialisation shows it.
    const customized = document.createElement('p', { is: 'x-para' });
    realm[SHADOW_KEY].known.add(customized);
    assert.equal(customized.getAttribute('is'), null);
    two.cell.appendChild(customized);
    assert.throws(
      () => fns.kokaineDomValidateRangeMoveLifecycle(body, two.first, two.last, null),
      /custom-element move callbacks/,
    );

    // The memos must not hide a prototype that no longer matches the baseline.
    class Upgraded extends view.Element {}
    Object.setPrototypeOf(one.cell, Upgraded.prototype);
    assert.throws(
      () => fns.kokaineDomValidateRangeMoveLifecycle(body, one.first, one.last, null),
      /custom-element move callbacks/,
    );
  });
});

describe('keyed move session', () => {
  function region() {
    const context = setup();
    const { fns, realm, body } = context;
    fns.kokaineDomInstallShadowTracker(body);
    const first = body.appendChild(fns.kokaineDomCreateElement(body, 'span'));
    const cell = body.appendChild(fns.kokaineDomCreateElement(body, 'div'));
    const last = body.appendChild(fns.kokaineDomCreateElement(body, 'span'));
    const session = fns.kokaineDomKeyedOpenMoveSession(body);
    return { ...context, first, cell, last, session, tracker: realm[SHADOW_KEY] };
  }

  it('trusts only planned rows while nothing but keyed moves touched the region', () => {
    const { fns, body, first, cell, last, session } = region();
    assert.equal(fns.kokaineDomKeyedSessionTrusts(session, first), false, 'not yet validated');
    fns.kokaineDomValidateRangeMoveLifecycle(body, first, last, session);
    assert.ok(fns.kokaineDomKeyedSessionPlanned(session, first));
    assert.equal(fns.kokaineDomKeyedSessionPlanned(session, cell), false);
    assert.equal(fns.kokaineDomKeyedSessionTrusts(session, first), true);

    // A keyed move's own records (only its nodes, on the range parent) are expected.
    body.removeChild(cell);
    body.appendChild(cell);
    assert.equal(session.audit([first, cell, last]), true);
    assert.equal(fns.kokaineDomKeyedSessionTrusts(session, first), true);

    fns.kokaineDomKeyedCloseMoveSession(session);
    assert.equal(fns.kokaineDomKeyedSessionTrusts(session, first), false, 'a closed session trusts nothing');
    assert.ok(fns.kokaineDomKeyedSessionPlanned(session, first), 'planned rows remain known for rollback');
    assert.equal(fns.kokaineDomKeyedSessionTrusts(null, first), false);
    assert.equal(fns.kokaineDomKeyedSessionPlanned(null, first), false);
  });

  it('goes dirty on any foreign mutation, shadow attachment, or tracker replacement', () => {
    const subtree = region();
    subtree.fns.kokaineDomValidateRangeMoveLifecycle(subtree.body, subtree.first, subtree.last, subtree.session);
    subtree.cell.appendChild(subtree.document.createElement('x-late'));
    assert.equal(subtree.fns.kokaineDomKeyedSessionTrusts(subtree.session, subtree.first), false);
    subtree.cell.removeChild(subtree.cell.childNodes[0]);
    assert.equal(subtree.fns.kokaineDomKeyedSessionTrusts(subtree.session, subtree.first), false, 'dirt is sticky');

    const sibling = region();
    sibling.fns.kokaineDomValidateRangeMoveLifecycle(sibling.body, sibling.first, sibling.last, sibling.session);
    sibling.body.appendChild(sibling.document.createElement('i'));
    assert.equal(sibling.session.audit([sibling.first, sibling.cell, sibling.last]), false, 'a node outside the move');

    const attribute = region();
    attribute.fns.kokaineDomValidateRangeMoveLifecycle(attribute.body, attribute.first, attribute.last, attribute.session);
    attribute.cell.setAttribute('is', 'x-late');
    assert.equal(attribute.fns.kokaineDomKeyedSessionTrusts(attribute.session, attribute.first), false);

    const shadow = region();
    shadow.fns.kokaineDomValidateRangeMoveLifecycle(shadow.body, shadow.first, shadow.last, shadow.session);
    shadow.document.createElement('div').attachShadow({ mode: 'open' });
    assert.equal(shadow.fns.kokaineDomKeyedSessionTrusts(shadow.session, shadow.first), false, 'attachShadow anywhere');

    const replaced = region();
    replaced.fns.kokaineDomValidateRangeMoveLifecycle(replaced.body, replaced.first, replaced.last, replaced.session);
    const wrapper = replaced.Element.prototype.attachShadow;
    replaced.Element.prototype.attachShadow = function attachShadow(init) { return wrapper.call(this, init); };
    assert.equal(replaced.fns.kokaineDomKeyedSessionTrusts(replaced.session, replaced.first), false);
  });

  it('observes open shadow roots met during validation', () => {
    const { fns, document, body, first, cell, last } = region();
    const root = cell.attachShadow({ mode: 'open' });
    const session = fns.kokaineDomKeyedOpenMoveSession(body);
    fns.kokaineDomValidateRangeMoveLifecycle(body, first, last, session);
    assert.equal(fns.kokaineDomKeyedSessionTrusts(session, first), true);
    root.appendChild(document.createElement('x-hidden'));
    assert.equal(fns.kokaineDomKeyedSessionTrusts(session, first), false);
  });

  it('is never trusted without MutationObserver or an epoch-counting tracker', () => {
    const { fns, realm, document, body, first, last, view } = region();
    const state = realm[SHADOW_KEY].realms.get(document.defaultView);
    delete state.epoch;
    const legacy = fns.kokaineDomKeyedOpenMoveSession(body);
    fns.kokaineDomValidateRangeMoveLifecycle(body, first, last, legacy);
    assert.ok(fns.kokaineDomKeyedSessionPlanned(legacy, first));
    assert.equal(fns.kokaineDomKeyedSessionTrusts(legacy, first), false);
    state.epoch = 0;
    delete view.MutationObserver;
    const unobserved = fns.kokaineDomKeyedOpenMoveSession(body);
    fns.kokaineDomValidateRangeMoveLifecycle(body, first, last, unobserved);
    assert.equal(fns.kokaineDomKeyedSessionTrusts(unobserved, first), false);
  });
});

describe('keyed placement', () => {
  const { fns } = loadSidecar(SIDECARS.dom.js);
  const stable = (order) => Array.from(fns.kokaineDomKeyedStableRows(order));

  // Longest strictly increasing subsequence length by O(n^2) DP.
  function lisLength(order) {
    const best = order.map(() => 1);
    for (let i = 0; i < order.length; i++)
      for (let j = 0; j < i; j++)
        if (order[j] < order[i]) best[i] = Math.max(best[i], best[j] + 1);
    return Math.max(0, ...best);
  }

  it('keeps one longest increasing subsequence of target positions', () => {
    assert.deepEqual(stable([]), []);
    assert.deepEqual(stable([0]), [true]);
    assert.deepEqual(stable([0, 1, 2, 3]), [true, true, true, true]);
    // First row dragged to the end: in DOM order the old first row now has
    // target position n-1; only it moves.
    assert.deepEqual(stable([4, 0, 1, 2, 3]), [true, true, true, true, false]);
    // Last row dragged to the front: only it moves.
    assert.deepEqual(stable([1, 2, 3, 4, 0]), [false, true, true, true, true]);
    // A full reverse keeps exactly one row.
    assert.equal(stable([4, 3, 2, 1, 0]).filter(Boolean).length, 1);
  });

  it('matches a brute-force LIS on random permutations', () => {
    let seed = 7;
    const random = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
    for (let round = 0; round < 200; round++) {
      const count = Math.floor(random() * 40);
      const order = Array.from({ length: count }, (_, i) => i);
      for (let i = count - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      const keep = stable(order);
      assert.equal(keep.length, count);
      const kept = order.filter((position) => keep[position]);
      for (let i = 1; i < kept.length; i++) assert.ok(kept[i - 1] < kept[i], `not increasing: ${order}`);
      assert.equal(kept.length, lisLength(order), `not longest: ${order}`);
    }
  });

  function keyedRegion(count) {
    const fake = createFakeRealm();
    const { fns: dom } = loadSidecar(SIDECARS.dom.js, { document: fake.document });
    const { document, body } = fake;
    const open = body.appendChild(document.createElement('i'));
    const rows = [];
    for (let i = 0; i < count; i++) {
      const first = body.appendChild(document.createElement('s'));
      body.appendChild(document.createElement('li'));
      const last = body.appendChild(document.createElement('s'));
      rows.push({ first, last });
    }
    const close = body.appendChild(document.createElement('i'));
    return { dom, document, body, open, close, rows };
  }

  it('reads the current order of exactly the expected rows', () => {
    const { dom, document, body, open, close, rows } = keyedRegion(3);
    const target = [rows[2], rows[0], rows[1]];
    const firsts = target.map((row) => row.first);
    const lasts = target.map((row) => row.last);
    assert.deepEqual(Array.from(dom.kokaineDomKeyedCurrentOrder(body, open, close, firsts, lasts)), [1, 2, 0]);
    assert.equal(dom.kokaineDomKeyedCurrentOrder(body, open, close, firsts.slice(1), lasts.slice(1)), null, 'an unexpected row');
    assert.equal(dom.kokaineDomKeyedCurrentOrder(body, open, close, firsts.concat(firsts[0]), lasts.concat(lasts[0])), null, 'a missing row');
    body.removeChild(close);
    const stray = body.appendChild(document.createElement('b'));
    body.appendChild(close);
    assert.equal(dom.kokaineDomKeyedCurrentOrder(body, open, close, firsts, lasts), null, 'an unmanaged node');
    body.removeChild(stray);
    assert.equal(dom.kokaineDomKeyedFirstsInOrder(body, open, close, rows.map((row) => row.first)), true);
    assert.equal(dom.kokaineDomKeyedFirstsInOrder(body, open, close, firsts), false);
    assert.equal(dom.kokaineDomKeyedFirstsInOrder(body, open, close, [rows[0].first, rows[2].first]), true, 'other rows may interleave');
  });
});

describe('element creation', () => {
  it('follows the HTML parser namespace rules and records provenance', () => {
    const { fns, realm, body } = setup();
    fns.kokaineDomInstallShadowTracker(body);
    const svg = fns.kokaineDomCreateElement(body, 'svg');
    assert.equal(svg.namespaceURI, 'http://www.w3.org/2000/svg');
    const circle = fns.kokaineDomCreateElement(svg, 'circle');
    assert.equal(circle.namespaceURI, 'http://www.w3.org/2000/svg');
    const foreign = fns.kokaineDomCreateElement(svg, 'foreignObject');
    assert.equal(fns.kokaineDomCreateElement(foreign, 'div').namespaceURI, 'http://www.w3.org/1999/xhtml');
    const math = fns.kokaineDomCreateElement(body, 'math');
    const mi = fns.kokaineDomCreateElement(math, 'mi');
    assert.equal(mi.namespaceURI, 'http://www.w3.org/1998/Math/MathML');
    assert.equal(fns.kokaineDomCreateElement(mi, 'span').namespaceURI, 'http://www.w3.org/1999/xhtml');
    assert.equal(fns.kokaineDomCreateElement(mi, 'mglyph').namespaceURI, 'http://www.w3.org/1998/Math/MathML');
    assert.ok(realm[SHADOW_KEY].known.has(svg));
    assert.throws(() => fns.kokaineDomCreateElement(null, 'div'), /without an owner document/);
  });
});

describe('owner registry', () => {
  it('assigns one weakly keyed id per root and resolves owners through parents and shadow hosts', () => {
    const { fns, realm, document, body } = setup();
    const rootA = {};
    const rootB = {};
    const portalA = { name: 'a' };

    const container = body.appendChild(document.createElement('div'));
    const handlesA = fns.kokaineDomRecordOwner(container, rootA, portalA);
    const registry = realm[OWNERS_KEY];
    assert.equal(handlesA.length, 1);
    assert.equal(handlesA[0].node, container);
    assert.equal(handlesA[0].ownerId, 1);
    assert.deepEqual(plain(registry.owners.get(container)), { ownerId: 1, portal: portalA, retired: false });

    const other = body.appendChild(document.createElement('div'));
    const handlesB = fns.kokaineDomRecordOwner(other, rootB, {});
    assert.equal(handlesB[0].ownerId, 2);
    const again = fns.kokaineDomRecordOwner(body.appendChild(document.createElement('p')), rootA, portalA);
    assert.equal(again[0].ownerId, 1, 'the same root keeps its id');

    const leaf = container.appendChild(document.createElement('span'));
    const found = fns.kokaineDomFindOwner(leaf, rootA);
    assert.equal(found.state, 1);
    assert.equal(found.portal, portalA);

    const host = container.appendChild(document.createElement('div'));
    const shadow = host.attachShadow({ mode: 'open' });
    const shadowLeaf = shadow.appendChild(document.createElement('b'));
    assert.equal(fns.kokaineDomFindOwner(shadowLeaf, rootA).state, 1, 'walks across a shadow host');

    assert.equal(fns.kokaineDomFindOwner(leaf, rootB).state, 0, 'another root does not own the subtree');
    assert.equal(fns.kokaineDomFindOwner(leaf, {}).state, 0, 'an unregistered root owns nothing');
  });

  it('retires registrations into tombstones that reject stale adoption', () => {
    const { fns, realm, document, body } = setup();
    const root = {};
    const node = body.appendChild(document.createElement('div'));
    const handles = fns.kokaineDomRecordOwner(node, root, { live: true });
    const entry = handles[0].entry;

    fns.kokaineDomRetireOwners(handles);
    assert.deepEqual(plain(entry), { ownerId: 1, portal: null, retired: true });
    assert.equal(handles[0].node, null);
    assert.equal(handles[0].entry, null);
    assert.equal(realm[OWNERS_KEY].owners.get(node), entry, 'the tombstone stays registered');
    assert.deepEqual(plain(fns.kokaineDomFindOwner(node, root)), { state: 2 });

    // Retiring twice, or retiring nothing, is harmless.
    fns.kokaineDomRetireOwners(handles);
    fns.kokaineDomRetireOwners(null);

    // A newer registration for the same node is not clobbered by a stale handle.
    const stale = fns.kokaineDomRecordOwner(node, root, { live: 1 });
    const fresh = fns.kokaineDomRecordOwner(node, root, { live: 2 });
    fns.kokaineDomRetireOwners(stale);
    assert.equal(realm[OWNERS_KEY].owners.get(node), fresh[0].entry);
    assert.equal(fns.kokaineDomFindOwner(node, root).state, 1);
  });

  it('rebuilds a malformed global registry and treats a missing one as unowned', () => {
    const { fns, realm, document, body } = setup();
    const node = body.appendChild(document.createElement('div'));
    assert.equal(fns.kokaineDomFindOwner(node, {}).state, 0);
    realm[OWNERS_KEY] = { owners: null };
    assert.equal(fns.kokaineDomFindOwner(node, {}).state, 0);
    const root = {};
    fns.kokaineDomRecordOwner(node, root, {});
    assert.ok(realm[OWNERS_KEY].owners instanceof realm.WeakMap);
    assert.equal(fns.kokaineDomFindOwner(node, root).state, 1);
  });
});
