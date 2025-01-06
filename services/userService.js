import User from '../models/user.js'; 

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

export const followUser = async (userId, userToFollowId) => {
    try {
        const user = await User.findById(userId);
        if (!user.followedUsers.includes(userToFollowId)) {
            user.followedUsers.push(userToFollowId);
            await user.save();
        }
        return user;
    } catch (error) {
        throw new Error('Failed to follow user');
    }
};

export const unfollowUser = async (userId, userToUnfollowId) => {
    try {
        const user = await User.findById(userId);
        user.followedUsers = user.followedUsers.filter(id => id.toString() !== userToUnfollowId);
        await user.save();
        return user;
    } catch (error) {
        throw new Error('Failed to unfollow user');
    }
};

export const followArtist = async (userId, artistData) => {
    try {
        const user = await User.findById(userId);
        const isAlreadyFollowing = user.followedArtists.some(
            artist => artist.spotifyArtistId === artistData.id
        );

        if (!isAlreadyFollowing) {
            user.followedArtists.push({
                spotifyArtistId: artistData.id,
                name: artistData.name,
                imageUrl: artistData.images?.[0]?.url || '',
                followedAt: new Date()
            });
            await user.save();
        }
        return user;
    } catch (error) {
        console.error('Error in followArtist service:', error);
        throw new Error('Failed to follow artist');
    }
};

export const unfollowArtist = async (userId, artistId) => {
    try {
        const user = await User.findById(userId);
        user.followedArtists = user.followedArtists.filter(
            artist => artist.spotifyArtistId !== artistId
        );
        await user.save();
        return user;
    } catch (error) {
        throw new Error('Failed to unfollow artist');
    }
};

export const getFeed = async (userId) => {
    try {
        const user = await User.findById(userId)
            .populate('followedUsers', 'name profilePicture');

        const feed = {
            followedUsers: user.followedUsers,
            followedArtists: user.followedArtists,
        };

        return feed;
    } catch (error) {
        throw new Error('Failed to get feed');
    }
};

