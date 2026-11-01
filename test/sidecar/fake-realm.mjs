// A deliberately small DOM realm: just enough structure (node types, parent
// and child links, `Element.prototype.attachShadow`, `defaultView`) for the
// shadow-root tracker and owner registry. It is not a DOM implementation.

export function createFakeRealm({ attachShadow = 'data' } = {}) {
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
      return child;
    }

    removeChild(child) {
      const index = this.childNodes.indexOf(child);
      if (index < 0) throw new Error('not a child');
      this.childNodes.splice(index, 1);
      child.parentNode = null;
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
    }

    // Only the start tag matters to the keyed-move validator.
    get outerHTML() {
      const attributes = [...this.attributes].map(([name, value]) => ` ${name}="${value}"`).join('');
      return `<${this.localName}${attributes}></${this.localName}>`;
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

    createElement(name) {
      return new Element(this, name);
    }

    createElementNS(namespace, name) {
      return new Element(this, name, namespace);
    }
  }

  const document = new Document();
  const view = { Node, Element, DocumentFragment, ShadowRoot, Document };
  document.defaultView = view;
  const body = document.appendChild(document.createElement('body'));
  return { view, document, body, Element, nativeAttachShadow };
}
