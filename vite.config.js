import { defineConfig } from 'vite'
import eslintPlugin from 'vite-plugin-eslint'

const WEBFLOW_ORIGIN = 'https://corporativogto-staging.webflow.io'

function isViteInternalPath(path) {
  return (
    path.startsWith('/@') ||
    path.startsWith('/src/') ||
    path.startsWith('/node_modules/') ||
    path.startsWith('/__')
  )
}

function looksLikeStaticFile(path) {
  return /\.[a-zA-Z0-9]+$/.test(path)
}

function webflowDevProxy() {
  return {
    name: 'webflow-dev-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          next()
          return
        }

        const url = req.url || '/'
        const path = url.split('?')[0] || '/'

        if (isViteInternalPath(path) || looksLikeStaticFile(path)) {
          next()
          return
        }

        try {
          const query = url.includes('?') ? `?${url.slice(url.indexOf('?') + 1)}` : ''
          const target = `${WEBFLOW_ORIGIN}${path}${query}`
          const upstream = await fetch(target, {
            headers: {
              accept: 'text/html,application/xhtml+xml',
              'user-agent': req.headers['user-agent'] || 'vite-webflow-proxy',
            },
            redirect: 'follow',
          })

          if (!upstream.ok) {
            next()
            return
          }

          const contentType = upstream.headers.get('content-type') || ''
          if (!contentType.includes('text/html')) {
            next()
            return
          }

          if (req.method === 'HEAD') {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.end()
            return
          }

          let html = await upstream.text()
          // The staging site also loads the production bundle; skip it in local
          // dev so animations are not initialized twice.
          html = html.replace(
            /\s*<script[^>]*src="https:\/\/corporativogt\.netlify\.app\/main\.js"[^>]*><\/script>/g,
            '\n<!-- netlify bundle disabled while using the Vite proxy -->'
          )

          res.statusCode = 200
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.setHeader('Cache-Control', 'no-cache')
          res.end(html)
        } catch (error) {
          console.error('[webflow-dev-proxy]', error)
          next()
        }
      })
    },
  }
}

// vite.config.js
export default defineConfig({
  plugins: [eslintPlugin({ cache: false }), webflowDevProxy()],
  server: {
    host: '0.0.0.0',
    cors: true,
    fs: {
      allow: ['.'],
    },
    hmr: {
      host: 'localhost',
      protocol: 'ws',
      port: 3000,
    },
  },
  build: {
    minify: true,
    manifest: true,
    rollupOptions: {
      input: './src/main.js',
      output: {
        format: 'umd',
        entryFileNames: 'main.js',
        esModule: false,
        compact: true,
        globals: {
          jquery: '$',
        },
      },
      external: ['jquery'],
    },
  },
})
