import express from 'express';
<<<<<<< HEAD
import { getProfile, updateProfile, searchUsers, getUserInfo } from '../controllers/userController.js';
=======
import { getProfile, updateProfile, searchUsers, getOtherUserProfile } from '../controllers/userController.js';
>>>>>>> recovery-branch
import authenticateUser from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser); 

router.get('/search', searchUsers);
router.get('/profile/:userId', getUserInfo);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Route to search users
router.get('/search', authenticateUser, searchUsers);

// Route to get another user's profile
router.get('/profile/:id', authenticateUser, getOtherUserProfile);

export default router;