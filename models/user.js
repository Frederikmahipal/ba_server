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
        unique: true
    },
    accessToken: {
        type: String
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;