(() => {
  const makeNode = (tag) => ({
    tag,
    textContent: '',
    children: [],
    listeners: new Map(),

    appendChild(child) {
      this.children.push(child);
      child.parentNode = this;
      return child;
    },

    addEventListener(type,listener) {
      let listeners = this.listeners.get(type);
      if (!listeners) {
        listeners = new Set();
        this.listeners.set(type,listeners);
      }
      listeners.add(listener);
    },

    removeEventListener(type,listener) {
      this.listeners.get(type)?.delete(listener);
    },

    dispatchEvent(event) {
      for (const listener of [...(this.listeners.get(event.type) || [])]) {
        listener.call(this,event);
      }
      return true;
    }
  });

  globalThis.document = {
    body: makeNode('body'),
    createElement: makeNode
  };
})();
