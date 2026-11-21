import { API_URL } from '../config'

export const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes

const API_CACHE_PREFIX = 'mc_api_cache_v1:'
const WARM_SESSION_KEY = 'mc_warm_session_ts_v1'
export const IMAGE_CACHE_NAME = 'mc-media-cache-v1'
export const IMAGE_META_CACHE_NAME = 'mc-media-meta-v1'

// In-memory fast lookup and request deduplication
const memoryApiCache = new Map()
const inFlightRequests = new Map()
const preloadedImages = new Set()

const isBrowser = typeof window !== 'undefined'

function safeGetStorage(key) {
  if (!isBrowser) return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSetStorage(key, value) {
  if (!isBrowser) return
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Ignore storage quota or private browsing errors
  }
}

export function isCacheWarm() {
  const raw = safeGetStorage(WARM_SESSION_KEY)
  if (!raw) return false
  const ts = Number(raw)
  if (!Number.isFinite(ts)) return false
  return Date.now() - ts < CACHE_TTL_MS
}

export function markCacheWarm() {
  safeSetStorage(WARM_SESSION_KEY, String(Date.now()))
}

/**
 * Synchronously read valid (non-expired) cached API data from memory or localStorage.
 */
export function getCachedSync(endpoint) {
  const mem = memoryApiCache.get(endpoint)
  if (mem && Date.now() - mem.timestamp < CACHE_TTL_MS) {
    return mem.data
  }

  const raw = safeGetStorage(API_CACHE_PREFIX + endpoint)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed.timestamp === 'number' && Date.now() - parsed.timestamp < CACHE_TTL_MS) {
      memoryApiCache.set(endpoint, parsed)
      return parsed.data
    }
  } catch {
    // Ignore malformed cache entry
  }
  return null
}

function getStaleCachedSync(endpoint) {
  const mem = memoryApiCache.get(endpoint)
  if (mem) return mem.data

  const raw = safeGetStorage(API_CACHE_PREFIX + endpoint)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return parsed?.data ?? null
  } catch {
    return null
  }
}

export function setCachedData(endpoint, data) {
  const entry = { data, timestamp: Date.now() }
  memoryApiCache.set(endpoint, entry)
  safeSetStorage(API_CACHE_PREFIX + endpoint, JSON.stringify(entry))
  markCacheWarm()
}

/**
 * Fetch an API endpoint with 30-minute localStorage caching and concurrent request deduplication.
 */
export async function fetchWithCache(endpoint, { timeoutMs = 8000 } = {}) {
  const cached = getCachedSync(endpoint)
  if (cached !== null) {
    return cached
  }

  if (inFlightRequests.has(endpoint)) {
    return inFlightRequests.get(endpoint)
  }

  const requestPromise = (async () => {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
    const timeoutId = controller ? setTimeout(() => controller.abort(), timeoutMs) : null

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        signal: controller ? controller.signal : undefined
      })
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const data = await response.json()
      setCachedData(endpoint, data)
      return data
    } catch (err) {
      const stale = getStaleCachedSync(endpoint)
      if (stale !== null) {
        return stale
      }
      throw err
    } finally {
      if (timeoutId) clearTimeout(timeoutId)
      inFlightRequests.delete(endpoint)
    }
  })()

  inFlightRequests.set(endpoint, requestPromise)
  return requestPromise
}

/**
 * Warm browser memory and CacheStorage for image URLs so repeat opens within 30 mins are instant.
 */
export async function cacheImageUrl(url) {
  if (!isBrowser || !url || typeof url !== 'string') return
  if (url.startsWith('data:') || url.startsWith('blob:')) return
  if (preloadedImages.has(url)) return
  preloadedImages.add(url)

  // Always trigger browser image decode/memory warm
  try {
    const img = new Image()
    img.decoding = 'async'
    img.src = url
  } catch {
    // Ignore
  }

  if (!('caches' in window)) return

  try {
    const [mediaCache, metaCache] = await Promise.all([
      caches.open(IMAGE_CACHE_NAME),
      caches.open(IMAGE_META_CACHE_NAME)
    ])

    const existingMeta = await metaCache.match(url)
    if (existingMeta) {
      const ts = Number(await existingMeta.text())
      if (Number.isFinite(ts) && Date.now() - ts < CACHE_TTL_MS) {
        const existingMedia = await mediaCache.match(url)
        if (existingMedia) return
      }
    }

    let response = null
    try {
      response = await fetch(url, { mode: 'cors', credentials: 'omit' })
    } catch {
      response = await fetch(url, { mode: 'no-cors' })
    }

    if (response && (response.ok || response.type === 'opaque')) {
      await Promise.all([
        mediaCache.put(url, response.clone()),
        metaCache.put(url, new Response(String(Date.now())))
      ])
    }
  } catch {
    // Ignore network or CacheStorage errors gracefully
  }
}

export function preloadAndCacheImages(urls = []) {
  if (!isBrowser || !Array.isArray(urls)) return
  const uniqueUrls = [...new Set(urls.filter((u) => typeof u === 'string' && u.length > 0))]
  uniqueUrls.forEach((url) => {
    cacheImageUrl(url)
  })
}
