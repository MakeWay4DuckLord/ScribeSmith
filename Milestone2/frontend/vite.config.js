import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 80,
    host: '0.0.0.0',
    watch: {
      usePolling: true
    },
    hmr: true
  },
  preview: {
    port: 80,
    host: '0.0.0.0'
  },
  css: {
    modules: true,
  },
})
