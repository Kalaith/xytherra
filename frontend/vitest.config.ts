import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const ensureGetter = (target: { prototype: object } | undefined, property: string): void => {
  if (!target) return;
  if (!Object.getOwnPropertyDescriptor(target.prototype, property)) {
    Object.defineProperty(target.prototype, property, {
      configurable: true,
      enumerable: false,
      get: () => false,
    });
  }
};

ensureGetter(ArrayBuffer, 'resizable');
ensureGetter(globalThis.SharedArrayBuffer as unknown as { prototype: object } | undefined, 'growable');

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
});
