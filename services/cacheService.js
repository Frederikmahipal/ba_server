import NodeCache from 'node-cache';

// Cache with default TTL of 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

export const cacheService = {
  get: (key) => cache.get(key),
  set: (key, value, ttl = 3600) => cache.set(key, value, ttl),
  del: (key) => cache.del(key),
  flush: () => cache.flushAll(),
}; 