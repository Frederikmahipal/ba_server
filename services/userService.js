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

export const searchUsersService = async (query, currentUserId) => {
  try {
    const users = await User.find({
      name: { $regex: query, $options: 'i' },
      _id: { $ne: currentUserId } // Don't show the current user
    });
    return users;
  } catch (error) {
    throw error;
  }
};

export const getUserInfoService = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password');
    return user;
  } catch (error) {
    throw error;
  }
};