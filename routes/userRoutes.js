import express from 'express';
import { getProfile, updateProfile, searchUsers, getOtherUserProfile } from '../controllers/userController.js';
import authenticateUser from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get user profile
router.get('/profile', authenticateUser, getProfile);

// Route to update user profile
router.put('/profile', authenticateUser, updateProfile);

// Route to search users
router.get('/search', authenticateUser, searchUsers);

// Route to get another user's profile
router.get('/profile/:id', authenticateUser, getOtherUserProfile);

export default router;