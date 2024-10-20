import User from '../models/user.js'; // Import the User model

// Service to get current user profile
export const getProfileService = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw error;
  }
};

// Service to update user profile
export const updateProfileService = async (userId, profileData) => {
  try {
    const user = await User.findByIdAndUpdate(userId, profileData, { new: true });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw error;
  }
};

// Service to search users
export const searchUsersService = async (query, currentUserId) => {
  try {
    const users = await User.find({
      name: { $regex: query, $options: 'i' }, // Case-insensitive search
      _id: { $ne: currentUserId } // Exclude the current user
    });
    return users;
  } catch (error) {
    throw error;
  }
};

// Service to get another user's profile
export const getOtherUserProfileService = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw error;
  }
};