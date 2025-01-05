import express from 'express';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { spotifyApiLimiter } from '../middleware/rateLimiter.js';
import { 
    getArtist, 
    searchSpotify, 
    getArtistAlbums, 
    getAlbum,
    getUserPlaylists,
    getPlaylistDetails,
    startPlayback,
    getArtistTopTracks,
    getRecentlyPlayed,
    getCurrentlyPlaying,
    getQueue,
    skipToNext,
    skipToPrevious,
    getRelatedArtists,
    getRecommendedArtists,
    addToRecentlyPlayed,
    getArtistUpdates,
    addTracksToPlaylist,
    activateDevice,
    createPlaylist
} from '../controllers/spotifyController.js';

const router = express.Router();

router.use(spotifyApiLimiter);

router.get('/search', searchSpotify);
router.get('/artist/:id', getArtist); 
router.get('/artist/:id/albums', getArtistAlbums);
router.get('/album/:id', getAlbum); 
router.get('/playlists', getUserPlaylists);
router.get('/playlist/:id', getPlaylistDetails);
router.put('/player/play', startPlayback);
router.get('/artist/:id/top-tracks', getArtistTopTracks);
router.get('/recently-played', getRecentlyPlayed);
router.get('/currently-playing', getCurrentlyPlaying);
router.get('/player/queue', getQueue);
router.post('/player/next', skipToNext);
router.post('/player/previous', skipToPrevious);
router.get('/artists/:id/related', authenticateUser, getRelatedArtists);
router.get('/recommendations/artists', authenticateUser, getRecommendedArtists);
router.post('/recently-played/add', authenticateUser, addToRecentlyPlayed);
router.get('/artist-updates', authenticateUser, getArtistUpdates);
router.post('/playlists/:id/tracks', authenticateUser, addTracksToPlaylist);
router.put('/player/activate-device', authenticateUser, activateDevice);
router.post('/playlists', authenticateUser, createPlaylist);

export default router;