import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js'; // Adjust the import path as necessary
import axios from 'axios';

const generateAccessToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const generateRefreshToken = (userId) => {
    if (!process.env.JWT_REFRESH_SECRET) {
        throw new Error("JWT_REFRESH_SECRET is not defined");
    }
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
};

export const signup = async (name, email, password) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ 
        name, 
        email, 
        password: hashedPassword,
        spotifyId: null,
        accessToken: null
    });
    await newUser.save();
    return newUser;
};


export const login = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    return { user, accessToken, refreshToken };
};

export const logout = async (res) => {
    res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'Strict', path: '/' });
    res.clearCookie('refreshToken', { httpOnly: true, secure: false, sameSite: 'Strict', path: '/' });
    return { success: true, message: "Signed out successfully" };
};

export const checkAuth = async (token) => {
    if (!token) {
        throw new Error('Unauthorized');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        throw new Error('Invalid token');
    }
};


export const handleSpotifyLogin = async (accessToken) => {
    try {
        const userData = await fetchSpotifyUserData(accessToken);
        let user = await User.findOne({ email: userData.email });

        if (!user) {
            user = new User({
                name: userData.display_name,
                email: userData.email,
                spotifyId: userData.id,
                accessToken: accessToken
            });
            
            try {
                await user.save();
            } catch (saveError) {
                console.error('Error saving new user:', saveError.message);
                throw new Error('Failed to create new user');
            }
        } else {
            if (!user.spotifyId) {
                user.spotifyId = userData.id; // Link Spotify ID
            }
            user.accessToken = accessToken; // Update access token - needed in db ?
            
            try {
                await user.save();
            } catch (updateError) {
                throw new Error('Failed to update existing user');
            }
        }
        
        // Generate a JWT token for the user
        const token = generateAccessToken(user._id);

        return { 
            message: user ? 'Logged in successfully' : 'User created successfully', 
            user: user,
            accessToken: token,
            spotifyAccessToken: accessToken
        };
        
    } catch (error) {
        console.error('Error handling Spotify login:', error.message);
        console.error('Error stack trace:', error.stack);
        throw new Error('Failed to handle Spotify login');
    }
};

// Function to fetch Spotify user data
const fetchSpotifyUserData = async (accessToken) => {
    const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    return response.data;
};