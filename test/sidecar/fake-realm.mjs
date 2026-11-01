// A deliberately small DOM realm: just enough structure (node types, parent
// and child links, `Element.prototype.attachShadow`, `defaultView`) for the
// shadow-root tracker and owner registry. It is not a DOM implementation.

export function createFakeRealm({ attachShadow = 'data' } = {}) {
  // Minimal MutationObserver: childList records for the observed node or its
  // light-DOM descendants, plus `is` attribute records.
  const observers = new Set();
  function notify(target, record) {
    for (const observer of observers) {
      for (let node = target; node; node = node.parentNode) {
        if (observer.targets.includes(node)) {
          observer.records.push({ target, addedNodes: [], removedNodes: [], ...record });
          break;
        }
      }
    }
  }

  class MutationObserver {
    constructor(callback) {
      this.callback = callback;
      this.targets = [];
      this.records = [];
    }

    observe(target) {
      this.targets.push(target);
      observers.add(this);
    }

    takeRecords() {
      const records = this.records;
      this.records = [];
      return records;
    }

    disconnect() {
      observers.delete(this);
      this.targets = [];
      this.records = [];
    }
  }

  class Node {
    constructor(nodeType, ownerDocument) {
      this.nodeType = nodeType;
      this.ownerDocument = ownerDocument;
      this.parentNode = null;
      this.childNodes = [];
    }

    appendChild(child) {
      if (child.parentNode) child.parentNode.removeChild(child);
      this.childNodes.push(child);
      child.parentNode = this;
      notify(this, { type: 'childList', addedNodes: [child] });
      return child;
    }

    removeChild(child) {
      const index = this.childNodes.indexOf(child);
      if (index < 0) throw new Error('not a child');
      this.childNodes.splice(index, 1);
      child.parentNode = null;
      notify(this, { type: 'childList', removedNodes: [child] });
      return child;
    }

    get nextSibling() {
      if (!this.parentNode) return null;
      const siblings = this.parentNode.childNodes;
      return siblings[siblings.indexOf(this) + 1] ?? null;
    }
  }

  class Element extends Node {
    constructor(ownerDocument, localName, namespaceURI = 'http://www.w3.org/1999/xhtml') {
      super(1, ownerDocument);
      this.localName = localName;
      this.namespaceURI = namespaceURI;
      this.attributes = new Map();
      this.shadowRoot = null;
      if (localName === 'template') this.content = new DocumentFragment(ownerDocument);
    }

    getAttribute(name) {
      return this.attributes.has(name) ? this.attributes.get(name) : null;
    }

    setAttribute(name, value) {
      this.attributes.set(name, String(value));
      if (name === 'is') notify(this, { type: 'attributes', attributeName: name });
    }

    // Only the start tag matters to the keyed-move validator. Like the HTML
    // serializer, an `is` value without an `is` attribute follows the name.
    get outerHTML() {
      const isValue = this.isValue != null && !this.attributes.has('is') ? ` is="${this.isValue}"` : '';
      const attributes = [...this.attributes].map(([name, value]) => ` ${name}="${value}"`).join('');
      const children = this.childNodes.map((child) => (child.nodeType === 1 ? child.outerHTML : '')).join('');
      return `<${this.localName}${isValue}${attributes}>${children}</${this.localName}>`;
    }
  }

  class DocumentFragment extends Node {
    constructor(ownerDocument) {
      super(11, ownerDocument);
    }
  }

  class ShadowRoot extends DocumentFragment {
    constructor(host, mode) {
      super(host.ownerDocument);
      this.host = host;
      this.mode = mode;
    }
  }

  const nativeAttachShadow = function attachShadow(init) {
    const root = new ShadowRoot(this, init && init.mode);
    if (init && init.mode === 'open') this.shadowRoot = root;
    return root;
  };
  if (attachShadow === 'data') {
    Object.defineProperty(Element.prototype, 'attachShadow', {
      configurable: true, enumerable: true, writable: true, value: nativeAttachShadow,
    });
  } else if (attachShadow === 'accessor') {
    Object.defineProperty(Element.prototype, 'attachShadow', {
      configurable: true, enumerable: true, get: () => nativeAttachShadow,
    });
  }

  class Document extends Node {
    constructor() {
      super(9, null);
      this.defaultView = null;
    }

    createElement(name, options) {
      const element = new Element(this, name);
      if (options && options.is != null) element.isValue = String(options.is);
      return element;
    }

    createElementNS(namespace, name) {
      return new Element(this, name, namespace);
    }

    // A shallow import keeps the name, namespace, attributes and `is` value.
    importNode(node, deep) {
      if (deep) throw new Error('the fake realm only imports shallowly');
      const copy = new Element(this, node.localName, node.namespaceURI);
      for (const [name, value] of node.attributes) copy.attributes.set(name, value);
      copy.isValue = node.isValue;
      return copy;
    }

    get implementation() {
      return new DOMImplementation();
    }
  }

  class DOMImplementation {
    createHTMLDocument() {
      return new Document();
    }
  }

  const document = new Document();
  const view = { Node, Element, DocumentFragment, ShadowRoot, Document, DOMImplementation, MutationObserver };
  document.defaultView = view;
  const body = document.appendChild(document.createElement('body'));
  return { view, document, body, Element, nativeAttachShadow };
}
