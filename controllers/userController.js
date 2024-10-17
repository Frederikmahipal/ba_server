import { getProfileService, updateProfileService, searchUsersService } from '../services/userService.js';

// Controller to get user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in the request object
    const userProfile = await getProfileService(userId);
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};

// Controller to update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in the request object
    const updatedProfile = await updateProfileService(userId, req.body);
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile', error });
  }
};

// Controller to search for users
export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q; // Get the search query from the request query parameters
    const users = await searchUsersService(query);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error searching for users:', error); // Log the error details
    res.status(500).json({ message: 'Error searching for users', error: error.message });
  }
};