import { signup, login, logout } from '../services/authService.js';
import jwt from 'jsonwebtoken';

export const signupController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = await signup(name, email, password);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = await login(email, password);

        // Set the tokens in the cookies
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
        console.log('user logged in: ', user);

        res.status(200).json({ user, accessToken, refreshToken });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const logoutController = async (req, res) => {
    try {
        res.clearCookie('accessToken', { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.status(200).json({ success: true, message: "Signed out successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const checkAuthController = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ message: 'Authenticated' });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};