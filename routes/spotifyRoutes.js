import express from 'express';
import { 
    getArtist, 
    searchSpotify, 
    getArtistAlbums, 
    getAlbum,
    getUserPlaylists,
    getPlaylistDetails,
    startPlayback
} from '../controllers/spotifyController.js';

const router = express.Router();

router.get('/search', searchSpotify);
router.get('/artist/:id', getArtist); 
router.get('/artist/:id/albums', getArtistAlbums);
router.get('/album/:id', getAlbum); 
router.get('/playlists', getUserPlaylists);
router.get('/playlist/:id', getPlaylistDetails);
router.put('/player/play', startPlayback);

export default router;