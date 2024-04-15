import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({ 
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'ScribeSmith',
        short_name: 'ScribeSmith',
        icons: [
            {
                src: 'pwa-64x64.png',
                sizes: '64x64',
                type: 'image/png'
            },
            {
                src: 'pwa-192x192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: 'pwa-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: 'maskable-icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
            }
        ],
        theme_color:'#32224b',
        background_color:'#252328',
        display:"standalone",
        scope:'/',
        start_url:"/login",
        orientation:'portrait'
      },
      workbox: {
        // defining cached files formats
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => {
              return url.pathname.startsWith("/api");
            },
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
        additionalManifestEntries: [
          {url: '/offline.html', revision: null}
        ],
        navigateFallback: "/offline.html",
     } 
    })
  ],
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
