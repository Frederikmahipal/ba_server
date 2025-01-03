import * as userService from '../services/userService.js';
import { getArtistService } from '../services/spotifyService.js';
import User from '../models/user.js'
import { cacheService } from '../services/cacheService.js';

const invalidateUserCaches = (userId) => {
    cacheService.del(`artistUpdates:${userId}`);
    cacheService.del(`playlists:user:${userId}`);
    cacheService.del(`recommendations:${userId}`);
};

export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userProfile = {
      id: user._id,
      name: user.name,
      email: user.email,
      spotifyId: user.spotifyId,
      createdAt: user.createdAt,
      profilePicture: user.profilePicture
    };

    res.status(200).json(userProfile);
    
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user profile',
      details: error.message 
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    const updatedProfile = await updateProfileService(userId, req.body);
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile', error });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q; 
    const currentUserId = req.user.id; 
    const users = await searchUsersService(query, currentUserId);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users', error });
  }
};

export const getOtherUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const userProfile = await getOtherUserProfileService(userId);
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};

export const followUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { userToFollowId } = req.body;
        const updatedUser = await userService.followUser(userId, userToFollowId);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const unfollowUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { userToUnfollowId } = req.body;
        const updatedUser = await userService.unfollowUser(userId, userToUnfollowId);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const followArtist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { artistId } = req.body;
        
        const user = await User.findById(userId);
        if (!user || !user.accessToken) {
            throw new Error('User not found or no access token available');
        }

        // Get artist details from Spotify using the user's access token
        const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
            headers: {
                'Authorization': `Bearer ${user.accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch artist data from Spotify');
        }

        const artistData = await response.json();
        
        const updatedUser = await userService.followArtist(userId, {
            id: artistData.id,
            name: artistData.name,
            images: artistData.images
        });

        // Invalidate caches after successful follow
        invalidateUserCaches(userId);

        res.json(updatedUser);
    } catch (error) {
        console.error('Error following artist:', error);
        res.status(500).json({ error: error.message });
    }
};

export const unfollowArtist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { artistId } = req.body;
        const updatedUser = await userService.unfollowArtist(userId, artistId);

        // Invalidate caches after successful unfollow
        invalidateUserCaches(userId);

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getFeed = async (req, res) => {
    try {
        const userId = req.user.id;
        const feed = await userService.getFeed(userId);
        res.json(feed);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

