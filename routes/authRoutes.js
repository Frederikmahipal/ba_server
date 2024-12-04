import express from 'express';
import { signupController, loginController, logoutController, checkAuthController, spotifyCallbackController, spotifyLoginController } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/logout', logoutController);
router.get('/check-auth', checkAuthController); // New route for checking authentication

// New routes for Spotify authentication
router.get('/spotify/login', spotifyLoginController); // Redirects to Spotify login
router.get('/spotify/callback', spotifyCallbackController); // Handles the callback from Spotify

export default router;