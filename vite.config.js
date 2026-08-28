import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import pkg from './package.json'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'
import { LATEST_RELEASE } from './src/constants/changelog.js'

const timestamp = new Date().getTime()
const buildTime = new Date().toISOString()
const safeVersion = pkg.version.replace(/\./g, '-')

// Manifest versi yang di-serve di /version.json.
// Aplikasi yang sedang berjalan mem-polling file ini untuk mendeteksi rilis baru,
// sehingga popup pembaruan tetap muncul walau service worker belum sempat update.
const versionManifest = {
  version: pkg.version,
  buildTime,
  title: LATEST_RELEASE?.title || `Versi ${pkg.version}`,
  mandatory: LATEST_RELEASE?.mandatory === true,
  releasedAt: LATEST_RELEASE?.date || null,
  highlights: LATEST_RELEASE?.highlights || []
}

if (LATEST_RELEASE?.version !== pkg.version) {
  console.warn(
    `\u26a0\ufe0f  Versi package.json (${pkg.version}) tidak sama dengan entri teratas ` +
    `src/constants/changelog.js (${LATEST_RELEASE?.version}). ` +
    'Popup pembaruan akan menampilkan catatan rilis yang salah.'
  )
}

// Menulis /version.json saat build, dan menyajikannya saat dev agar bisa diuji lokal
const versionManifestPlugin = () => ({
  name: 'pitcar-version-manifest',
  configureServer(server) {
    server.middlewares.use('/version.json', (_req, res) => {
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Cache-Control', 'no-store')
      res.end(JSON.stringify(versionManifest))
    })
  },
  generateBundle() {
    this.emitFile({
      type: 'asset',
      fileName: 'version.json',
      source: JSON.stringify(versionManifest, null, 2)
    })
  }
})

export default defineConfig({
  plugins: [
    vue(),
    versionManifestPlugin(),
    VitePWA({
      // 'prompt' (bukan 'autoUpdate') agar service worker baru menunggu
      // konfirmasi user -> kita bisa menampilkan popup "Pembaruan Tersedia"
      registerType: 'prompt',
      injectRegister: 'auto',
      includeAssets: ['pitcar.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'JARVIS - Smart Dashboard PITCAR',
        short_name: 'JARVIS',
        description: 'JARVIS - Smart Dashboard PITCAR',
        theme_color: '#B70000',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'  // Combine purposes
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png'
          }
        ],
        start_url: '/',
        scope: '/',
        orientation: 'portrait'
      },
      workbox: {
        cleanupOutdatedCaches: true,
        // Wajib false pada mode 'prompt': SW baru menunggu sampai user menekan
        // "Perbarui Sekarang" (updateServiceWorker akan mengirim SKIP_WAITING)
        skipWaiting: false,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/sokasistem\.pitcar\.co\.id\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60 // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              networkTimeoutSeconds: 10 // Timeout after 10 seconds
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html'
      }
    })
  ],
  define: {
    '__APP_VERSION__': JSON.stringify(pkg.version),
    '__BUILD_TIME__': JSON.stringify(buildTime),
    '__APP_RELEASE__': JSON.stringify(versionManifest)
  },
  server: {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    proxy: {
      '/web': {
        target: 'https://sokasistem.pitcar.co.id',
        changeOrigin: true,
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('🚨 Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('Origin', 'https://sokasistem.pitcar.co.id');
            
            const cookies = req.headers.cookie;
            if (cookies) {
              proxyReq.setHeader('Cookie', cookies);
            }

            // Add version header
            proxyReq.setHeader('X-App-Version', pkg.version);

            console.log('📡 Proxying request:', {
              url: req.url,
              method: req.method,
              timestamp: new Date().toISOString()
            });
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('✅ Response received:', {
              url: req.url,
              status: proxyRes.statusCode,
              timestamp: new Date().toISOString()
            });
          });
        }
      }
    },
    host: true
  },
  build: {
    manifest: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-${safeVersion}-${timestamp}.[hash].js`,
        chunkFileNames: `assets/[name]-${safeVersion}-${timestamp}.[hash].js`,
        assetFileNames: `assets/[name]-${safeVersion}-${timestamp}.[hash].[ext]`
      }
    },
    // Add these options
    terserOptions: {
      compress: {
        drop_console: true,  // Remove console.logs in production
        drop_debugger: true
      }
    },
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})