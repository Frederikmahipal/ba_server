import express from 'express';
import { getArtist, searchSpotify, getArtistAlbums, getAlbum } from '../controllers/spotifyController.js';

const router = express.Router();

router.get('/search', searchSpotify);
router.get('/artist/:id', getArtist); 
router.get('/artist/:id/albums', getArtistAlbums);
router.get('/album/:id', getAlbum); 

export default router;