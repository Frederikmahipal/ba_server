import { getClientCredentialsToken } from '../config/spotifyAuth.js';
import { searchSpotifyService, getArtistService, getArtistAlbumsService, getAlbumService, getUserPlaylistsService, getPlaylistDetailsService } from '../services/spotifyService.js';
import dotenv from 'dotenv';

dotenv.config();

export const fetchAccessToken = async () => {
  try {
    return await getClientCredentialsToken();
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw new Error('Failed to fetch access token');
  }
};

export const searchSpotify = async (req, res) => {
  const query = req.query.q || '';
  const type = req.query.type || 'artist'; // Default to artist if no type is provided

  try {
    const accessToken = await fetchAccessToken();
    
    if (!query) {
      res.status(200).json([]); // Return empty array if no query
      return;
    }

    const results = await searchSpotifyService(query, type, accessToken);
    res.status(200).json(results);
  } catch (error) {
    console.error(`Error searching ${type}:`, error);
    res.status(500).json({ 
      error: `Failed to search ${type}`,
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

export const getArtistAlbums = async (req, res) => {
  try {
    const artistId = req.params.id;
    const accessToken = await fetchAccessToken();

    if (!artistId) {
      res.status(400).json({ error: 'Artist ID is required' });
      return;
    }

    const artistAlbums = await getArtistAlbumsService(artistId, accessToken);
    res.status(200).json(artistAlbums);
  } catch (error) {
    console.error('Error fetching artist albums:', error);
    res.status(500).json({ 
      error: 'Failed to fetch artist albums',
      message: error.message,
      details: error.response ? error.response.data : null
    });
  }
};

export const getAlbum = async (req, res) => {
  try {
    const albumId = req.params.id;
    const accessToken = await getClientCredentialsToken();

    if (!albumId) {
      res.status(400).json({ error: 'Album ID is required' });
      return;
    }

    const albumDetails = await getAlbumService(albumId, accessToken);
    res.status(200).json(albumDetails);
  } catch (error) {
    console.error('Error fetching album details:', error);
    res.status(500).json({ 
      error: 'Failed to fetch album details',
      message: error.message,
      details: error.response ? error.response.data : null
    });
  }
};



export const getUserPlaylists = async (req, res) => {
  try {
      // For user playlists, we need the user's access token, not the client credentials token
      const accessToken = req.headers.authorization?.split(' ')[1];
      
      if (!accessToken) {
          return res.status(401).json({ error: 'No access token provided' });
      }

      const playlists = await getUserPlaylistsService(accessToken);
      res.status(200).json(playlists);
  } catch (error) {
      console.error('Error fetching user playlists:', error);
      res.status(500).json({ 
          error: 'Failed to fetch user playlists',
          message: error.message,
          details: error.response ? error.response.data : null
      });
  }
};

export const getPlaylistDetails = async (req, res) => {
  try {
      const playlistId = req.params.id;
      const accessToken = req.headers.authorization?.split(' ')[1];

      if (!accessToken) {
          return res.status(401).json({ error: 'No access token provided' });
      }

      if (!playlistId) {
          return res.status(400).json({ error: 'Playlist ID is required' });
      }

      const playlistDetails = await getPlaylistDetailsService(playlistId, accessToken);
      res.status(200).json(playlistDetails);
  } catch (error) {
      console.error('Error fetching playlist details:', error);
      res.status(500).json({ 
          error: 'Failed to fetch playlist details',
          message: error.message,
          details: error.response ? error.response.data : null
      });
  }
};
