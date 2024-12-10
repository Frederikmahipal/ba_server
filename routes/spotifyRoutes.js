import express from 'express';
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
    skipToPrevious
} from '../controllers/spotifyController.js';

const router = express.Router();

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

export default router;