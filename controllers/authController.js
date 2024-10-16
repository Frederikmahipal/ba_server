import { signup, login, googleSignIn, Logout } from '../services/authService.js';

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
        res.status(200).json({ user, accessToken, refreshToken });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const googleSignInController = async (req, res) => {
    try {
        const { idToken } = req.body;
        const { user, token } = await googleSignIn(idToken);
        res.status(200).json({ user, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const refreshAccessTokenController = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const { accessToken } = await refreshAccessToken(refreshToken);
        res.status(200).json({ accessToken });
    } catch (err) {
        res.status(400).json({ error: err.message });
        console.log(err);
    }
};


export const logoutController = async (req, res) => {
    try {
        const { authorization } = req.headers;
        const accessToken = authorization.split(' ')[1];
        const decoded = jwt.decode(accessToken);
        const userId = decoded.userId;

        const result = await Logout(userId);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};