import { getProfileService, updateProfileService, searchUsersService, getOtherUserProfileService } from '../services/userService.js';

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

// Controller to search users
export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q; // Assuming the search query is passed as a query parameter
    const currentUserId = req.user.id;
    console.log(currentUserId, "USERID") // Assuming user ID is available in the request object
    const users = await searchUsersService(query, currentUserId);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching users', error });
  }
};

// Controller to get another user's profile
export const getOtherUserProfile = async (req, res) => {
  try {
    const userId = req.params.id; // Assuming the user ID is passed as a URL parameter
    const userProfile = await getOtherUserProfileService(userId);
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};
// Controller to search artists
