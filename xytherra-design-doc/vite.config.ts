import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  // Use root path for dev server, /xytherra/ for build
  const base = command === 'serve' ? '/' : '/xytherra/';
  
  return {
    plugins: [react(), tailwindcss()],
    base: base,
  }
})
