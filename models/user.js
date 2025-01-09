import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    spotifyId: {
        type: String,
        index: { 
            unique: true,
            partialFilterExpression: { spotifyId: { $type: "string" } }  // Only enforce uniqueness when spotifyId is a string
        }
    },
    accessToken: {
        type: String
    },
    profilePicture: {
        type: String
    },
    followedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followedArtists: [{
        spotifyArtistId: String,
        name: String,
        imageUrl: String,
        followedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;

