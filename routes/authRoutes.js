import express from 'express';
import { signupController, loginController, logoutController, checkAuthController, spotifyCallbackController, spotifyLoginController } from '../controllers/authController.js';

const router = express.Router();

router.get('/check-auth', checkAuthController); 
router.get('/spotify/login', spotifyLoginController); 
router.get('/spotify/callback', spotifyCallbackController); 
router.post('/login', loginController);
router.post('/logout', logoutController);

export default router;