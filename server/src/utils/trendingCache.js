/**
 * In-memory cache for trending results. Replace with Redis in production for multi-instance.
 * TTL 5 minutes.
 */
const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map();

export function getTrending(type) {
  const entry = cache.get(type);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(type);
    return null;
  }
  return entry.data;
}

export function setTrending(type, data) {
  cache.set(type, { data, expires: Date.now() + CACHE_TTL_MS });
}
