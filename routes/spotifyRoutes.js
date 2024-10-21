// server/routes/spotifyRoutes.js

import express from 'express';
import { searchArtists, getArtist } from '../controllers/spotifyController.js';

const router = express.Router();

router.get('/search', searchArtists);
router.get('/artist/:id', getArtist); 

export default router;