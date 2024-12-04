import { getClientCredentialsToken } from '../config/spotifyAuth.js';
import { 
  searchSpotifyService, 
  getArtistService, 
  getArtistAlbumsService, 
  getAlbumService, 
  getUserPlaylistsService, 
  getPlaylistDetailsService, 
  startPlaybackService,
  activateDeviceService,
  getArtistTopTracksService,
  getRecentlyPlayedService,
  getCurrentlyPlayingService
} from '../services/spotifyService.js';
import dotenv from 'dotenv';

dotenv.config();

//client access token
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

export const getArtistTopTracks = async (req, res) => {
  try {
    const artistId = req.params.id;
    const accessToken = await fetchAccessToken();

    if (!artistId) {
      res.status(400).json({ error: 'Artist ID is required' });
      return;
    }

    const topTracks = await getArtistTopTracksService(artistId, accessToken);
    res.status(200).json(topTracks);
  } catch (error) {
    console.error('Error fetching artist top tracks:', error);
  }
}

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

export const getRecentlyPlayed = async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (!accessToken) {
      return res.status(401).json({ error: 'No access token provided' });
    }

    const recentlyPlayed = await getRecentlyPlayedService(accessToken);
    res.status(200).json(recentlyPlayed);
  } catch (error) {
    console.error('Error fetching recently played:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recently played',
      details: error.response?.data || error.message 
    });
  }
}

export const startPlayback = async (req, res) => {
  try {
    const { deviceId, trackUri } = req.body;
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (!accessToken) {
      return res.status(401).json({ error: 'No access token provided' });
    }

    // Use service functions instead of direct axios calls
    await activateDeviceService(deviceId, accessToken);
    await startPlaybackService(deviceId, trackUri, accessToken);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error starting playback:', error);
    res.status(500).json({ 
      error: 'Failed to start playback',
      details: error.response?.data || error.message 
    });
  }
};

export const getCurrentlyPlaying = async (req, res) => {
  try {
      const accessToken = req.headers.authorization?.split(' ')[1];
      
      if (!accessToken) {
          return res.status(401).json({ error: 'No access token provided' });
      }

      const currentTrack = await getCurrentlyPlayingService(accessToken);
      res.status(200).json(currentTrack);
  } catch (error) {
      console.error('Error fetching currently playing track:', error);
      // If no track is playing, return null instead of an error
      if (error.response?.status === 204) {
          return res.status(200).json(null);
      }
      res.status(500).json({ 
          error: 'Failed to fetch currently playing track',
          details: error.response?.data || error.message 
      });
  }
};
