import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import pkg from './package.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['v1/ios/180.png', 'v1/logo.svg'],
      manifest: {
        name: 'Karrinho',
        short_name: 'Karrinho',
        description: 'A household grocery list and shopping mode app.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#16a34a',
        background_color: '#f7f2ea',
        icons: [
          {
            src: '/v1/ios/192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/v1/ios/512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/v1/ios/512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: '/screenshots/mobile.png',
            sizes: '390x844',
            type: 'image/png',
            label: 'Karrinho mobile shopping mode'
          },
          {
            src: '/screenshots/wide.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Karrinho desktop dashboard'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  build: {
    target: 'esnext'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  define: {
    VITE_APP_VERSION: JSON.stringify(pkg.version)
  }
});
