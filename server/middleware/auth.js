const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { getMockUsers } = require('../services/mockStorage');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const jwtSecret = process.env.JWT_SECRET || 'volunteer_connect_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, jwtSecret);

    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(decoded.id);
    } else {
      user = getMockUsers().find(u => u._id.toString() === decoded.id.toString());
    }

    if (!user) {
      return res.status(401).json({ message: 'Token is invalid or user no longer exists.' });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    console.warn('Auth token verification notice:', err.message);
    return res.status(401).json({ message: 'Token is not valid or has expired. Please sign in again.' });
  }
};

module.exports = auth;
