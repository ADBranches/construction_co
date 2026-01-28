// vite.config.mjs
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Use the Vite-specific plugin for Tailwind v4
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    include: ["src/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}"]
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
  },
  preview: {
    port: 5173,
    host: '0.0.0.0',
  }
})
