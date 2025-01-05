import express from 'express';
import { 
    followUser, 
    unfollowUser, 
    followArtist, 
    unfollowArtist,
    getFeed,
    getProfile 
} from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes should be protected
router.use(authenticateUser);

router.get('/profile', getProfile);
router.post('/follow/user', followUser);
router.post('/unfollow/user', unfollowUser);
router.post('/follow/artist', followArtist);
router.post('/unfollow/artist', unfollowArtist);
router.get('/feed', getFeed);

export default router;