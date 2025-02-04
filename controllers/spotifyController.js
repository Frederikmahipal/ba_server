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
  getCurrentlyPlayingService,
  getQueueService,
  skipToNextService,
  skipToPreviousService,
  getRecentlyPlayedArtistsService,
  getTopArtistsService,
  getArtistGenresService,
  getArtistDetailsService,
  getRelatedArtistsService,
  addToRecentlyPlayedService,
  addTracksToPlaylistService,
  createPlaylistService
} from '../services/spotifyService.js';
import User from '../models/user.js';
import dotenv from 'dotenv';
import { cacheService } from '../services/cacheService.js';
import { invalidatePlaylistCache } from '../services/cacheService.js';
import axios from 'axios';
import { invalidateUserCaches } from '../services/cacheService.js';
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

export const getArtist = async (req, res) => {
  try {
    const artistId = req.params.id;
    const cacheKey = `artist:${artistId}`;
    
    // Check cache first
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const accessToken = await fetchAccessToken();
    const artistDetails = await getArtistService(artistId, accessToken);

    // Cache the result
    cacheService.set(cacheKey, artistDetails);
    res.status(200).json(artistDetails);
  } catch (error) {
    console.error('Error fetching artist details:', error);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch artist details',
      message: error.message,
      details: error.response?.data || null
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

    // Check cache first
    const cacheKey = `album:${albumId}`;
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const albumDetails = await getAlbumService(albumId, accessToken);
    
    // Cache for 1 hour since album data rarely changes
    cacheService.set(cacheKey, albumDetails, 3600);
    res.status(200).json(albumDetails);
  } catch (error) {
    console.error('Error fetching album details:', error);
    res.status(500).json({ 
      error: 'Failed to fetch album details',
      message: error.message
    });
  }
};


export const getUserPlaylists = async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    
    if (!accessToken) {
      return res.status(401).json({ error: 'No access token provided' });
    }

    let cacheKey = 'playlists:global';
    if (req.user?.id) {
      cacheKey = `playlists:user:${req.user.id}`;
    }

    // Check cache first
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const playlists = await getUserPlaylistsService(accessToken);
    
    // Cache for 5 minutes
    cacheService.set(cacheKey, playlists, 300);
    res.status(200).json(playlists);
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user playlists',
      message: error.message
    });
  }
};

export const getPlaylistDetails = async (req, res) => {
  try {
    const { id: playlistId } = req.params;
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (!playlistId) {
      return res.status(400).json({ 
        error: 'Playlist ID is required'
      });
    }

    if (!accessToken) {
      return res.status(401).json({
        error: 'No access token provided'
      });
    }

    // Check cache first
    const cacheKey = `playlist:${playlistId}`;
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    try {
      const playlistDetails = await getPlaylistDetailsService(playlistId, accessToken);
      
      // Cache for 5 minutes since playlist contents can change
      cacheService.set(cacheKey, playlistDetails, 300);
      
      res.json(playlistDetails);
    } catch (spotifyError) {
      console.error('Spotify API Error:', spotifyError.response?.data || spotifyError);
      
      // Handle specific Spotify API errors
      if (spotifyError.response?.status === 401) {
        return res.status(401).json({
          error: 'Spotify access token expired',
          message: 'Please refresh your session'
        });
      }
      
      if (spotifyError.response?.status === 404) {
        return res.status(404).json({
          error: 'Playlist not found',
          message: 'The requested playlist does not exist'
        });
      }

      throw spotifyError;
    }
  } catch (error) {
    console.error('Error in getPlaylistDetails:', error);
    res.status(500).json({ 
      error: 'Failed to fetch playlist details',
      message: error.message,
      details: error.response?.data || null
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
      const { deviceId, context_uri, uris, offset, position_ms = 0 } = req.body;
      const accessToken = req.headers.authorization?.split(' ')[1];

      if (!accessToken) {
          return res.status(401).json({ error: 'No access token provided' });
      }

      // Construct the playback request body based on what was provided
      let playbackData = {};
      
      if (context_uri) {
          // Playing from an album, artist, or playlist
          playbackData = {
              context_uri,
              offset: offset || { position: 0 },
              position_ms
          };
      } else if (uris) {
          // Playing individual tracks
          playbackData = {
              uris: Array.isArray(uris) ? uris : [uris],
              position_ms
          };
      } else {
          return res.status(400).json({ 
              error: 'Invalid playback request',
              message: 'Either context_uri or uris must be provided'
          });
      }

      // First activate the device
      await activateDeviceService(deviceId, accessToken);
      
      // Then start playback
      await startPlaybackService(deviceId, playbackData, accessToken);

      res.status(200).json({ success: true });
  } catch (error) {
      console.error('Error starting playback:', error.response?.data || error);
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

export const getQueue = async (req, res) => {
  try {
      const accessToken = req.headers.authorization?.split(' ')[1];
      
      if (!accessToken) {
          return res.status(401).json({ error: 'No access token provided' });
      }

      const queue = await getQueueService(accessToken);
      res.status(200).json(queue);
  } catch (error) {
      console.error('Error fetching queue:', error);
      // If no queue is available, return empty queue instead of error
      if (error.response?.status === 204) {
          return res.status(200).json({ 
              currently_playing: null,
              queue: [] 
          });
      }
      res.status(500).json({ 
          error: 'Failed to fetch queue',
          details: error.response?.data || error.message 
      });
  }
};

export const skipToNext = async (req, res) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        
        if (!accessToken) {
            return res.status(401).json({ error: 'No access token provided' });
        }

        await skipToNextService(accessToken);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error skipping to next track:', error);
        res.status(500).json({ 
            error: 'Failed to skip to next track',
            details: error.response?.data || error.message 
        });
    }
};

export const skipToPrevious = async (req, res) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        
        if (!accessToken) {
            return res.status(401).json({ error: 'No access token provided' });
        }

        await skipToPreviousService(accessToken);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error skipping to previous track:', error);
        res.status(500).json({ 
            error: 'Failed to skip to previous track',
            details: error.response?.data || error.message 
        });
    }
};

export const getRelatedArtists = async (req, res) => {
    try {
        const artistId = req.params.id;
        const relatedArtists = await getRelatedArtistsService(artistId, req.user.accessToken);
        res.json(relatedArtists);
    } catch (error) {
        console.error('Error getting related artists:', error);
        res.status(500).json({ error: 'Failed to get related artists' });
    }
};  

export const getRecommendedArtists = async (req, res) => {
  try {
    const cacheKey = `recommendations:${req.user.id}`;
    const cachedRecommendations = cacheService.get(cacheKey);
    if (cachedRecommendations) {
      return res.status(200).json(cachedRecommendations);
    }

    const user = await User.findById(req.user.id);
    if (!user || !user.accessToken) {
      return res.status(401).json({ error: 'No access token found' });
    }

    const recentArtists = await getRecentlyPlayedArtistsService(user.accessToken);
    const topArtists = await getTopArtistsService(user.accessToken);

    // 2. Combine and filter out followed artists
    const artistsMap = new Map();
    [...recentArtists, ...topArtists].forEach(artist => {
      if (!artistsMap.has(artist.id) && 
        !user.followedArtists.some(a => a.spotifyArtistId === artist.id)) {
        artistsMap.set(artist.id, artist);
      }
    });

    // 3. Get genres from followed artists
    const followedGenres = new Set();
    await Promise.all(
      user.followedArtists
        .slice(0, 5)
        .map(async (artist) => {
          const genres = await getArtistGenresService(
            artist.spotifyArtistId, 
            user.accessToken
          );
          genres.forEach(genre => followedGenres.add(genre));
        })
    );

    // 4. Get full details and sort
    const artistDetailsPromises = Array.from(artistsMap.keys())
      .map(artistId => getArtistDetailsService(artistId, user.accessToken));

    const artistDetails = (await Promise.all(artistDetailsPromises))
      .filter(artist => artist !== null)
      .sort((a, b) => {
        const aGenreMatch = a.genres?.some(genre => followedGenres.has(genre)) ? 1 : 0;
        const bGenreMatch = b.genres?.some(genre => followedGenres.has(genre)) ? 1 : 0;
        if (aGenreMatch !== bGenreMatch) return bGenreMatch - aGenreMatch;
        return b.popularity - a.popularity;
      })
      .slice(0, 20);

    // Cache results for 1 hour
    cacheService.set(cacheKey, artistDetails);
    res.json(artistDetails);
  } catch (error) {
    console.error('Error getting recommended artists:', error);
    res.status(500).json({ 
      error: 'Failed to get recommendations', 
      details: error.message 
    });
  }
};

export const addToRecentlyPlayed = async (req, res) => {
    try {
        const { track, context } = req.body;
        const accessToken = req.headers.authorization?.split(' ')[1];

        if (!accessToken) {
            return res.status(401).json({ error: 'No access token provided' });
        }

        await addToRecentlyPlayedService(accessToken, track);
        
        // Fetch updated recently played list
        const recentlyPlayed = await getRecentlyPlayedService(accessToken);
        res.status(200).json(recentlyPlayed);
    } catch (error) {
        console.error('Error adding to recently played:', error);
        res.status(500).json({ 
            error: 'Failed to add to recently played',
            details: error.response?.data || error.message 
        });
    }
};

export const getArtistUpdates = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const accessToken = await fetchAccessToken();
    
    // Check cache first
    const cacheKey = `artistUpdates:${req.user.id}`;
    const cachedData = cacheService.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }
    
    const followedArtists = user.followedArtists;
    
    const updates = await Promise.all(
      followedArtists.map(async (artist) => {
        // Only get albums/singles, no need for top tracks anymore
        const albums = await getArtistAlbumsService(artist.spotifyArtistId, accessToken);

        // Filter for releases from the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const recentReleases = albums
          .filter(release => new Date(release.release_date) >= sixMonthsAgo)
          .slice(0, 3);  // Keep only the 3 most recent releases

        // Only return artists that have recent releases
        if (recentReleases.length > 0) {
          return {
            artistId: artist.spotifyArtistId,
            artistName: artist.name,
            artistImage: artist.imageUrl,
            updates: {
              newReleases: recentReleases
            }
          };
        }
        return null;
      })
    );

    // Filter out null values (artists with no updates)
    const filteredUpdates = updates.filter(update => update !== null);

    // Cache the results for 1 hour
    cacheService.set(cacheKey, filteredUpdates, 3600);
    
    res.json(filteredUpdates);
  } catch (error) {
    console.error('Error fetching artist updates:', error);
    res.status(500).json({ 
      error: 'Failed to fetch artist updates',
    });
  }
};

export const addTracksToPlaylist = async (req, res) => {
  try {
    const { id: playlistId } = req.params;
    const { tracks } = req.body;
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (!playlistId) {
      console.error('Missing playlist ID in request');
      return res.status(400).json({ 
        error: 'Playlist ID is required'
      });
    }

    if (!tracks || !tracks.length) {
      return res.status(400).json({ 
        error: 'No tracks provided'
      });
    }

    const response = await addTracksToPlaylistService(playlistId, tracks, accessToken);
    
    // Invalidate the cache for this playlist
    invalidatePlaylistCache(playlistId);
    
    res.json(response);
  } catch (error) {
    console.error('Error adding tracks to playlist:', error);
    res.status(500).json({ 
      error: 'Failed to add tracks to playlist',
      details: error.message 
    });
  }
};

export const activateDevice = async (req, res) => {
  try {
    const { deviceId } = req.body;
    const accessToken = req.headers.authorization?.split(' ')[1];

    if (!accessToken) {
      return res.status(401).json({ error: 'No access token provided' });
    }

    if (!deviceId) {
      return res.status(400).json({ error: 'Device ID is required' });
    }

    await activateDeviceService(deviceId, accessToken);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error activating device:', error);
    res.status(500).json({ 
      error: 'Failed to activate device',
      details: error.message 
    });
  }
};

export const createPlaylist = async (req, res) => {
    try {
        const { name } = req.body;
        const accessToken = req.headers.authorization?.split(' ')[1];
        
        if (!accessToken) {
            return res.status(401).json({ error: 'No access token provided' });
        }

        if (!name) {
            return res.status(400).json({ error: 'Playlist name is required' });
        }

        // Get user ID from Spotify
        const userResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: { 
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        const userId = userResponse.data.id;
        const playlist = await createPlaylistService(userId, name, accessToken);
        
        invalidateUserCaches(userId);
        
        res.status(201).json({
            playlist,
            isNew: true
        });
    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(500).json({ 
            error: 'Failed to create playlist',
            details: error.response?.data || error.message 
        });
    }
};


