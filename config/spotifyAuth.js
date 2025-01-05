import axios from 'axios';
import qs from 'qs';
import dotenv from 'dotenv';
dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_ID; // Add your Client ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET; // Add your Client Secret
const redirectUri = 'http://https://ba-server.vercel.app/auth/spotify/callback'; // Your redirect URI

export const getAuthorizationUrl = () => {
    const scope = [
        'user-read-private',
        'user-read-email',
        'playlist-modify-public',
        'playlist-modify-private',
        'playlist-read-private',
        'playlist-read-collaborative',
        'user-read-playback-state',
        'user-read-currently-playing',
        'user-modify-playback-state',
        'streaming',
        'app-remote-control', // Add this scope
        'user-read-playback-position',
        'user-top-read',
        'user-read-recently-played'
    ].join(' ');

    return `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
};

//User level
export const getAccessToken = async (code) => {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const data = qs.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri, // Must match what is registered
        client_id: clientId,
        client_secret: clientSecret
    });
    
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    try {
        const response = await axios.post(tokenUrl, data, { headers });
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error.response?.data || error.message);
        throw new Error('Failed to fetch access token');
    }
};

//application level
export const getClientCredentialsToken = async () => {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const data = qs.stringify({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret
    });
    
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    try {
        const response = await axios.post(tokenUrl, data, { headers });
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching Client Credentials token:', error.response?.data || error.message);
        throw new Error('Failed to fetch Client Credentials token');
    }
};