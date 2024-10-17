import express from 'express';
import { signupController, loginController, logoutController, checkAuthController } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
// router.post('/google-signin', googleSignInController);
router.post('/logout', logoutController);
router.get('/check-auth', checkAuthController); // New route for checking authentication

export default router;