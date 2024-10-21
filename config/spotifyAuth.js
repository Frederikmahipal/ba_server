// server/config/spotifyAuth.js

import axios from 'axios';
import qs from 'qs';

async function getAccessToken(clientId, clientSecret) {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const data = qs.stringify({ grant_type: 'client_credentials' });
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    };

    try {
        console.log('Attempting to get access token...');
        console.log('Client ID:', clientId);
        console.log('Client Secret:', clientSecret.slice(0, 5) + '...' + clientSecret.slice(-5));
        console.log('Base64 Auth:', headers.Authorization);

        const response = await axios.post(tokenUrl, data, { headers });
        console.log('Access Token Response:', response.data);
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        }
        throw new Error('Failed to fetch access token');
    }
}

export { getAccessToken };