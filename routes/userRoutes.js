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

router.use(authenticateUser);

router.get('/profile', getProfile);
router.get('/feed', getFeed);
router.post('/follow/user', followUser);
router.post('/unfollow/user', unfollowUser);
router.post('/follow/artist', followArtist);
router.post('/unfollow/artist', unfollowArtist);

export default router;