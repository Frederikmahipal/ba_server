export const invalidatePlaylistCache = (playlistId) => {
  cacheService.del(`playlist:${playlistId}`);
};

export const invalidateUserCaches = (userId) => {
  cacheService.del(`artistUpdates:${userId}`);
  cacheService.del(`playlists:user:${userId}`);
  cacheService.del(`recommendations:${userId}`);
}; 