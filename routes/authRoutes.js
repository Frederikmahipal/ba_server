import express from 'express';
import { signupController, loginController, refreshAccessTokenController, googleSignInController, logoutController } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/refresh-token', refreshAccessTokenController);
router.post('/google-signin', googleSignInController);
router.post('/logout', logoutController);

export default router;
