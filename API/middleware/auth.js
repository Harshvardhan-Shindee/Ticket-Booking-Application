const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const config = require('../config');

// Auth middleware to verify JWT token and attach user to req
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No auth token provided' });
    }

    const token = authHeader.split(' ')[1]; // More robust than replace
    const decoded = jwt.verify(token, config.JWT_SECRET);

    const user = await User.findById(decoded.userId).select('-password'); // Exclude password for safety
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check if user is admin
const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admins only' });
  }
  next();
};

module.exports = { auth, verifyAdmin };
