// server/services/spotifyService.js

import axios from 'axios';

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

export const searchArtistsService = async (query, accessToken) => {
    try {
        const response = await axios.get(`${SPOTIFY_BASE_URL}/search`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            params: {
                q: query,
                type: 'artist'
            }
        });
        return response.data.artists.items;
    } catch (error) {
        console.error('Error fetching artist search results:', error);
        throw error;
    }
};

// New service function to get artist details
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