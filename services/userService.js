import User from '../models/user.js'; // Import the User model

// Service to get user profile
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

export const searchUsersService = async (query) => {
  try {
    const users = await User.find({ name: { $regex: query, $options: 'i' } }); // Case-insensitive search
    return users;
  } catch (error) {
    throw error;
  }
};