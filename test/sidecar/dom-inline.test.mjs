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
      prototype: Element.prototype, wrapper,
    });

    const closedHost = document.createElement('div');
    const closedRoot = closedHost.attachShadow({ mode: 'closed' });
    assert.equal(closedRoot.mode, 'closed');
    assert.ok(tracker.known.has(closedHost));
    assert.ok(tracker.closed.has(closedHost));

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
      prototype: Element.prototype, wrapper: null,
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
