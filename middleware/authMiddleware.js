import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const authenticateUser = async (req, res, next) => {
  const token = req.cookies.accessToken; 
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error); 
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default authenticateUser;