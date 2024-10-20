import { signup, login, logout, checkAuth } from '../services/authService.js';
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
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: false, sameSite: 'Strict', path: '/', expires: new Date(Date.now() + 3600000) }); // 1 hour
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: 'Strict', path: '/', expires: new Date(Date.now() + 2592000000) }); // 30 days

        res.status(200).json({ user, accessToken, refreshToken });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const logoutController = async (req, res) => {
    try {
        res.clearCookie('accessToken', { httpOnly: true, secure: false, sameSite: 'Strict', path: '/' });
        res.clearCookie('refreshToken', { httpOnly: true, secure: false, sameSite: 'Strict', path: '/' });
        res.status(200).json({ success: true, message: "Signed out successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const checkAuthController = async (req, res) => {
    const token = req.cookies.accessToken;
    try {
        const user = await checkAuth(token);
        res.status(200).json({ user });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};