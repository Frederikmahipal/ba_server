import { signup, login, logout, checkAuth, handleSpotifyLogin } from '../services/authService.js';
import { getAuthorizationUrl, getAccessToken } from '../config/spotifyAuth.js';

export const signupController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = await signup(name, email, password);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, accessToken } = await login(email, password);

        res.cookie('accessToken', accessToken, { 
            httpOnly: true,           // Prevents JavaScript access
            secure: true,             // Required for HTTPS
            sameSite: 'none',         // Required for cross-site cookies
            path: '/',                // Available on all paths
            expires: new Date(Date.now() + 3600000) // 1 hour
        }); 



        res.status(200).json({ user });
    } catch (err) {
        console.error('Login error:', err);
        res.status(400).json({ error: err.message });
    }
};

export const logoutController = async (req, res) => {
    try {
        res.clearCookie('accessToken', { 
            httpOnly: true, 
            secure: true,
            sameSite: 'none',
            path: '/' 
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const checkAuthController = async (req, res) => {
    const token = req.cookies.accessToken;
    try {
        const user = await checkAuth(token);
        res.status(200).json({ user });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

export const spotifyLoginController = (req, res) => {
    const authUrl = getAuthorizationUrl(); 
    res.redirect(authUrl); 
};

export const spotifyCallbackController = async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'No code provided' });
    }

    try {
        const accessToken = await getAccessToken(code);
        const result = await handleSpotifyLogin(accessToken);

        // Set auth token
        res.cookie('accessToken', result.accessToken, { 
            httpOnly: true, 
            secure: true,
            sameSite: 'none',
            path: '/',
            expires: new Date(Date.now() + 3600000)
        });

        // Set Spotify token
        res.cookie('spotifyAccessToken', result.spotifyAccessToken, { 
            httpOnly: true, 
            secure: false, 
            sameSite: 'Strict', 
            path: '/'
        });


        const redirectUrl = 'https://client-sepia-xi-77.vercel.app/';
        res.redirect(redirectUrl);
        
    } catch (error) {
        console.error('Error handling Spotify login:', error);
        res.status(500).json({ 
            error: 'Failed to handle Spotify login', 
            details: error.message 
        });
    }
};