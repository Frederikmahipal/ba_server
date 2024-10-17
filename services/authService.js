import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js'; // Adjust the import path as necessary

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
    const newUser = new User({ name, email, password: hashedPassword });
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
    res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'Strict' });
    return { success: true, message: "Signed out successfully" };
};