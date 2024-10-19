import express from 'express';
import { getProfile, updateProfile, searchUsers, getUserInfo } from '../controllers/userController.js';
import authenticateUser from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateUser); 

router.get('/search', searchUsers);
router.get('/profile/:userId', getUserInfo);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

export default router;