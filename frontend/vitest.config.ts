import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const defineBooleanGetter = (
  target: { prototype: object } | undefined,
  property: string
): void => {
  if (!target) {
    return;
  }

  const descriptor = Object.getOwnPropertyDescriptor(target.prototype, property);
  if (!descriptor) {
    Object.defineProperty(target.prototype, property, {
      configurable: true,
      enumerable: false,
      get: () => false,
    });
  }
};

// Some Node builds omit these accessors, but jsdom/webidl-conversions expects them.
defineBooleanGetter(ArrayBuffer, 'resizable');
defineBooleanGetter(globalThis.SharedArrayBuffer as unknown as { prototype: object } | undefined, 'growable');

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
});
