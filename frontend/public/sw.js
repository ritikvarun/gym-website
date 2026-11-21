const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes
const MEDIA_CACHE_NAME = 'mc-media-cache-v1'
const MEDIA_META_CACHE_NAME = 'mc-media-meta-v1'
const API_CACHE_NAME = 'mc-api-sw-cache-v1'
const API_META_CACHE_NAME = 'mc-api-sw-meta-v1'

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  const allowed = new Set([
    MEDIA_CACHE_NAME,
    MEDIA_META_CACHE_NAME,
    API_CACHE_NAME,
    API_META_CACHE_NAME
  ])
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (!allowed.has(key)) {
            return caches.delete(key)
          }
          return Promise.resolve()
        })
      )
    ).then(() => self.clients.claim())
  )
})

function isViteInternal(url) {
  return (
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/node_modules/') ||
    url.pathname.includes('hot-update')
  )
}

function isMediaRequest(request, url) {
  if (request.destination === 'image') return true
  if (/\.(png|jpe?g|webp|gif|svg|avif|ico)(\?.*)?$/i.test(url.pathname)) return true
  if (url.hostname.includes('images.unsplash.com')) return true
  if (url.hostname.includes('res.cloudinary.com')) return true
  if (url.pathname.startsWith('/uploads/')) return true
  return false
}

function isApiGetRequest(request, url) {
  return request.method === 'GET' && url.pathname.startsWith('/api/')
}

async function handleCachedWithTTL(request, cacheName, metaCacheName) {
  const cacheKey = request.url
  const [cache, metaCache] = await Promise.all([
    caches.open(cacheName),
    caches.open(metaCacheName)
  ])

  const [cachedResponse, metaResponse] = await Promise.all([
    cache.match(cacheKey),
    metaCache.match(cacheKey)
  ])

  if (cachedResponse && metaResponse) {
    const ts = Number(await metaResponse.text())
    if (Number.isFinite(ts) && Date.now() - ts < CACHE_TTL_MS) {
      return cachedResponse
    }
  }

  try {
    const networkResponse = await fetch(request)
    if (networkResponse && (networkResponse.ok || networkResponse.type === 'opaque')) {
      await Promise.all([
        cache.put(cacheKey, networkResponse.clone()),
        metaCache.put(cacheKey, new Response(String(Date.now())))
      ])
    }
    return networkResponse
  } catch (err) {
    if (cachedResponse) {
      return cachedResponse
    }
    throw err
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return
  if (isViteInternal(url)) return

  if (isMediaRequest(request, url)) {
    event.respondWith(handleCachedWithTTL(request, MEDIA_CACHE_NAME, MEDIA_META_CACHE_NAME))
    return
  }

  if (isApiGetRequest(request, url)) {
    event.respondWith(handleCachedWithTTL(request, API_CACHE_NAME, API_META_CACHE_NAME))
  }
})
