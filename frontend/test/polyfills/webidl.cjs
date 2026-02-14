function defineBooleanGetter(target, property) {
  if (typeof target === 'undefined') {
    return;
  }

  const descriptor = Object.getOwnPropertyDescriptor(target.prototype, property);
  if (!descriptor) {
    Object.defineProperty(target.prototype, property, {
      configurable: true,
      enumerable: false,
      get() {
        return false;
      },
    });
  }
}

// Node builds can omit these accessors, but jsdom/webidl-conversions expects them.
defineBooleanGetter(ArrayBuffer, 'resizable');
defineBooleanGetter(globalThis.SharedArrayBuffer, 'growable');
