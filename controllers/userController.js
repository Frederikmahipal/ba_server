import { getProfileService, updateProfileService, searchUsersService, getUserInfoService } from '../services/userService.js';

// Controller to get current user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id; 
    console.log(userId);
    const userProfile = await getProfileService(userId);
    console.log(userProfile);
    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};

// Controller to update current users profile
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
    const currentUserId = req.user._id; // Get the current user's ID to exclude it from results
    const users = await searchUsersService(query, currentUserId);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error searching for users:', error); 
    res.status(500).json({ message: 'Error searching for users', error: error.message });
  }
};

// Controller to get user details
export const getUserInfo = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await getUserInfoService(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error });
  }
};