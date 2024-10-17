import { getProfileService, updateProfileService } from '../services/userService.js';

// Controller to get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in the request object
    console.log("USER ID ", userId);
    const userProfile = await getProfileService(userId);
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};

// Controller to update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in the request object
    const updatedProfile = await updateProfileService(userId, req.body);
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile', error });
  }
};