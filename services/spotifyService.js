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
        return response.data; // Return artist details
    } catch (error) {
        console.error('Error fetching artist details:', error);
        throw error;
    }
};

// get albums for a specific artist
export const getArtistAlbumsService = async (artistId, accessToken) => {
    try {
        const response = await axios.get(`${SPOTIFY_BASE_URL}/artists/${artistId}/albums`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                include_groups: 'album,single', // Fetch both albums and singles
                market: 'DK'
            }
        });
        return response.data.items;
    } catch (error) {
        console.error('Error fetching artist albums:', error);
        throw error;
    }
};

// get specific album
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

export const startPlaybackService = async (deviceId, trackUri, accessToken) => {
    try {
        const response = await axios.put(
            `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
            {
                uris: [trackUri]
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
        console.error('Error starting playback:', error);
        throw error;
    }
};

export const getCategoriesService = async (accessToken) => {
    try {
        const response = await axios.get(`${SPOTIFY_BASE_URL}/browse/categories`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                country: 'DA', // Specify the country if needed
                limit: 50 // Adjust the limit as needed
            }
        });
        return response.data.categories.items;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const getCategoryPlaylistsService = async (categoryId, accessToken) => {
    try {
        const response = await axios.get(`${SPOTIFY_BASE_URL}/browse/categories/${categoryId}/playlists`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                country: 'DA',
                limit: 50
            }
        });
        return response.data.playlists.items;
    } catch (error) {
        console.error('Error fetching category playlists:', error);
        throw error;
    }
};

