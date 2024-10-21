// server/controllers/spotifyController.js

import { getAccessToken } from '../config/spotifyAuth.js';
import { searchArtistsService, getArtistService } from '../services/spotifyService.js';
import dotenv from 'dotenv';

dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

export const fetchAccessToken = async () => {
  try {
    return await getAccessToken(clientId, clientSecret);
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw new Error('Failed to fetch access token');
  }
};

export const searchArtists = async (req, res) => {
  try {
    const query = req.query.q || '';
    const accessToken = await fetchAccessToken();
    
    if (!query) {
      res.status(200).json([]); // Return empty array if no query
      return;
    }

    const artists = await searchArtistsService(query, accessToken);
    res.status(200).json(artists);
  } catch (error) {
    console.error('Error searching artists:', error);
    res.status(500).json({ 
      error: 'Failed to search artists',
      message: error.message,
      details: error.response ? error.response.data : null
    });
  }
};

// New function to get artist details
export const getArtist = async (req, res) => {
  try {
    const artistId = req.params.id;
    const accessToken = await fetchAccessToken();

    if (!artistId) {
      res.status(400).json({ error: 'Artist ID is required' });
      return;
    }

    const artistDetails = await getArtistService(artistId, accessToken);
    res.status(200).json(artistDetails);
  } catch (error) {
    console.error('Error fetching artist details:', error);
    res.status(500).json({ 
      error: 'Failed to fetch artist details',
      message: error.message,
      details: error.response ? error.response.data : null
    });
  }
};