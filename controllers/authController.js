import { signup, login, logout, checkAuth, handleSpotifyLogin } from '../services/authService.js';
import { getAuthorizationUrl, getAccessToken } from '../config/spotifyAuth.js';
import { getSpotifyUserProfile } from '../services/spotifyService.js';
import { User } from '../models/userModel.js';

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
        const { user, accessToken, refreshToken } = await login(email, password);

        // Set the tokens in the cookies
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: false, sameSite: 'Strict', path: '/', expires: new Date(Date.now() + 3600000) }); // 1 hour
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: 'Strict', path: '/', expires: new Date(Date.now() + 2592000000) }); // 30 days

        res.status(200).json({ user, accessToken, refreshToken });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const logoutController = async (req, res) => {
    try {
        res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'Strict', path: '/' });
        res.clearCookie('refreshToken', { httpOnly: true, secure: false, sameSite: 'Strict', path: '/' });
        res.status(200).json({ success: true, message: "Signed out successfully" });
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
    const authUrl = getAuthorizationUrl(); // Get the authorization URL
    res.redirect(authUrl); // Redirect user to Spotify login
};

export const spotifyCallbackController = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.redirect('https://client-sepia-xi-77.vercel.app/auth?error=no_code');
        }

        const accessToken = await getAccessToken(code);
        if (!accessToken) {
            return res.redirect('https://client-sepia-xi-77.vercel.app/auth?error=no_token');
        }

        const spotifyUser = await getSpotifyUserProfile(accessToken);
        
        let user = await User.findOne({ spotifyId: spotifyUser.id });
        if (!user) {
            user = new User({
                spotifyId: spotifyUser.id,
                email: spotifyUser.email,
                name: spotifyUser.display_name,
                accessToken
            });
        } else {
            user.accessToken = accessToken;
        }
        await user.save();

        // Simple cookie setting
        res.cookie('accessToken', accessToken, { 
            httpOnly: true, 
            secure: true,
            sameSite: 'none',
            path: '/'
        });

        res.redirect('https://client-sepia-xi-77.vercel.app');
    } catch (error) {
        console.error('Spotify callback error:', error);
        res.redirect('https://client-sepia-xi-77.vercel.app/auth?error=callback_failed');
    }
};