import { getProfileService, updateProfileService, searchUsersService, getOtherUserProfileService } from '../services/userService.js';

// Controller to get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userProfile = await getProfileService(userId);
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};

// Controller to update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    const updatedProfile = await updateProfileService(userId, req.body);
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile', error });
  }
};

// Controller to search users
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

// Controller to get another user's profile
export const getOtherUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const userProfile = await getOtherUserProfileService(userId);
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};

