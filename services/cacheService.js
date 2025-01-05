import NodeCache from 'node-cache';

// Cache with default TTL of 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

export const cacheService = {
  get: (key) => cache.get(key),
  set: (key, value, ttl = 3600) => cache.set(key, value, ttl),
  del: (key) => cache.del(key),
  flush: () => cache.flushAll(),
}; 

export const invalidatePlaylistCache = (playlistId) => {
  cacheService.del(`playlist:${playlistId}`);
};

export const invalidateUserCaches = (userId) => {
  cacheService.del(`artistUpdates:${userId}`);
  cacheService.del(`playlists:user:${userId}`);
  cacheService.del(`recommendations:${userId}`);
}; 