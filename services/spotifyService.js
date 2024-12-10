import axios from 'axios';

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

export const searchSpotifyService = async (query, type, accessToken) => {
    try {
        const response = await axios.get(`${SPOTIFY_BASE_URL}/search`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                q: query,
                type: type
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${type} search results:`, error);
        throw error;
    }
};


export const getArtistService = async (artistId, accessToken) => {
    try {
        const response = await axios.get(`${SPOTIFY_BASE_URL}/artists/${artistId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data; //
    } catch (error) {
        console.error('Error fetching artist details:', error);
        throw error;
    }
};

export const getArtistTopTracksService = async (artistId, accessToken) => {
    try {
        const response = await axios.get(`${SPOTIFY_BASE_URL}/artists/${artistId}/top-tracks`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                market: 'DK' 
            }
        });
        return response.data.tracks; 
    } catch (error) {
        console.error('Error fetching artist top tracks:', error);
        throw error;
    }
};

export const getArtistAlbumsService = async (artistId, accessToken) => {
    try {
        const response = await axios.get(`${SPOTIFY_BASE_URL}/artists/${artistId}/albums`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                include_groups: 'album,single',
                market: 'DK'
            }
        });
        return response.data.items;
    } catch (error) {
        console.error('Error fetching artist albums:', error);
        throw error;
    }
};


export const getAlbumService = async (albumId, accessToken) => {
    try {
        const response = await axios.get(`${SPOTIFY_BASE_URL}/albums/${albumId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching album details:', error);
        throw error;
    }
};

export const getUserPlaylistsService = async (accessToken) => {
    try {
        const response = await axios.get(`${SPOTIFY_BASE_URL}/me/playlists`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                limit: 50
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user playlists:', error);
        throw error;
    }
};

export const getPlaylistDetailsService = async (playlistId, accessToken) => {
    try {
        const response = await axios.get(`${SPOTIFY_BASE_URL}/playlists/${playlistId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching playlist details:', error);
        throw error;
    }
};

export const getRecentlyPlayedService = async (accessToken) => {
    try {
        const response = await axios.get(`${SPOTIFY_BASE_URL}/me/player/recently-played`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recently played:', error);
        throw error;
    }
}

//web player
export const activateDeviceService = async (deviceId, accessToken) => {
    try {
        const response = await axios.put(
            'https://api.spotify.com/v1/me/player',
            {
                device_ids: [deviceId],
                play: false,
            },
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error activating device:', error);
        throw error;
    }
};

export const startPlaybackService = async (deviceId, playbackData, accessToken) => {
    try {
        
        const response = await axios.put(
            `${SPOTIFY_BASE_URL}/me/player/play?device_id=${deviceId}`,
            playbackData,  // contains context_uri or uris, and offset if needed
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error starting playback:', error.response?.data || error);
        throw error;
    }
};

export const getCurrentlyPlayingService = async (accessToken) => {
    try {
        const response = await axios.get(`${SPOTIFY_BASE_URL}/me/player/currently-playing`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return response.data; 
    } catch (error) {
        console.error('Error fetching currently playing:', error);
        throw error;
    }
}

export const addToRecentlyPlayedService = async (accessToken, trackUri) => {
    try {
        const response = await axios.put(
            `${SPOTIFY_BASE_URL}/me/player/play`,
            {
                uris: [trackUri],
                position_ms: 0
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error adding to recently played:', error);
        throw error;
    }
}

export const getQueueService = async (accessToken) => {
    try {
        // Add a small delay to ensure Spotify's API has updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const response = await axios.get(`${SPOTIFY_BASE_URL}/me/player/queue`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        
        // If no queue data, return an empty structure
        if (!response.data) {
            return {
                currently_playing: null,
                queue: []
            };
        }
        
        return response.data;
    } catch (error) {
        console.error('Error fetching queue:', error);
        // Return empty queue on error
        return {
            currently_playing: null,
            queue: []
        };
    }
}

export const skipToNextService = async (accessToken) => {
    try {
        const response = await axios.post(
            `${SPOTIFY_BASE_URL}/me/player/next`,
            {},  // empty body
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error skipping to next track:', error);
        throw error;
    }
};

export const skipToPreviousService = async (accessToken) => {
    try {
        const response = await axios.post(
            `${SPOTIFY_BASE_URL}/me/player/previous`,
            {},  // empty body
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error skipping to previous track:', error);
        throw error;
    }
};

