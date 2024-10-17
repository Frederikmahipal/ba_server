import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.accessToken; // Get token from cookies
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    console.log('Token:', token); // Log the token for debugging
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded); // Log the decoded token for debugging
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error); // Log the error for debugging
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default authenticateUser;