import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js'; 
import axios from 'axios';

const generateAccessToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
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

    return { user, accessToken };
};

export const logout = async (res) => {
    res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'Strict', path: '/' });
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

        // Get the web player token
        const webPlayerResponse = await axios.get('https://open.spotify.com/get_access_token', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });

        const profilePicture = userData.images && userData.images.length > 0 ? userData.images[0].url : null;
        if (!user) {
            user = new User({
                name: userData.display_name,
                email: userData.email,
                spotifyId: userData.id,
                accessToken: accessToken,
                profilePicture: profilePicture,
                webPlayerToken: webPlayerResponse.data.accessToken // Store web player token
            });
        } else {
            user.spotifyId = userData.id;
            user.accessToken = accessToken;
            user.profilePicture = profilePicture;
            user.webPlayerToken = webPlayerResponse.data.accessToken;
        }
        
        await user.save();
        
        const token = generateAccessToken(user._id);

        return { 
            message: 'Logged in successfully',
            user: user,
            accessToken: token,
            spotifyAccessToken: accessToken,
            webPlayerToken: webPlayerResponse.data.accessToken
        };
        
    } catch (error) {
        console.error('Error handling Spotify login:', error);
    }
};

const fetchSpotifyUserData = async (accessToken) => {
    const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    return response.data;
};