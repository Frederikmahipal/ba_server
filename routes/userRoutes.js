import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import authenticateUser from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get user profile
router.get('/profile', authenticateUser, getProfile);

// Route to update user profile
router.put('/profile', authenticateUser, updateProfile);

export default router;