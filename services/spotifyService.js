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


