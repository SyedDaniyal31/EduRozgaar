/**
 * Redis client. Falls back to in-memory if REDIS_URL not set or ioredis unavailable.
 */
let client = null;
let clientPromise = null;
const inMemory = new Map();
const TTL_SEC = 300; // 5 min

export async function getRedisClient() {
  if (client) return client;
  if (clientPromise) return clientPromise;
  const url = process.env.REDIS_URL;
  if (!url) return null;
  clientPromise = (async () => {
    try {
      const { default: Redis } = await import('ioredis');
      const c = new Redis(url, { maxRetriesPerRequest: 2 });
      c.on('error', (err) => console.warn('Redis error:', err.message));
      client = c;
      return c;
    } catch (e) {
      console.warn('Redis not available, using in-memory cache:', e.message);
      return null;
    }
  })();
  return clientPromise;
}

export async function cacheGet(key) {
  const redis = await getRedisClient();
  if (redis) {
    const val = await redis.get(key);
    return val ? JSON.parse(val) : null;
  }
  const entry = inMemory.get(key);
  if (!entry || Date.now() > entry.expires) return null;
  return entry.data;
}

export async function cacheSet(key, data, ttlSec = TTL_SEC) {
  const redis = await getRedisClient();
  if (redis) {
    await redis.setex(key, ttlSec, JSON.stringify(data));
    return;
  }
  inMemory.set(key, { data, expires: Date.now() + ttlSec * 1000 });
}

export async function cacheDel(key) {
  const redis = await getRedisClient();
  if (redis) await redis.del(key);
  else inMemory.delete(key);
}

export async function cacheDelPattern(prefix) {
  const redis = await getRedisClient();
  if (redis) {
    const keys = await redis.keys(prefix + '*');
    if (keys.length) await redis.del(...keys);
  } else {
    for (const k of inMemory.keys()) if (k.startsWith(prefix)) inMemory.delete(k);
  }
}
