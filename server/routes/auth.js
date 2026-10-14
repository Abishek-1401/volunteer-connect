const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { getMockUsers, setMockUsers } = require('../services/mockStorage');

const JWT_SECRET = process.env.JWT_SECRET || 'volunteer_connect_super_secret_jwt_key_2026';

// Helper to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      location,
      causes,
      availability,
      organization,
      designation,
      website,
      terms
    } = req.body;

    // Common validations
    if (!name || !name.trim()) {
      return res.status(400).json({ field: 'name', message: 'Full name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ field: 'email', message: 'Email address is required.' });
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ field: 'email', message: 'Please provide a valid email address.' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ field: 'password', message: 'Password must be at least 8 characters long.' });
    }
    if (!role || !['volunteer', 'worker'].includes(role)) {
      return res.status(400).json({ field: 'role', message: 'Please select a valid role (Volunteer or Social Service Worker).' });
    }
    if (!location || !location.trim()) {
      return res.status(400).json({ field: 'location', message: 'City / location is required.' });
    }
    if (!terms) {
      return res.status(400).json({ field: 'terms', message: 'You must agree to the Terms and Privacy Policy.' });
    }

    // Role-specific validations
    if (role === 'volunteer') {
      if (!causes || !Array.isArray(causes) || causes.length === 0) {
        return res.status(400).json({ field: 'causes', message: 'Please select at least one cause you care about.' });
      }
    } else if (role === 'worker') {
      if (!organization || !organization.trim()) {
        return res.status(400).json({ field: 'organization', message: 'Organization / NGO name is required.' });
      }
      if (!designation || !designation.trim()) {
        return res.status(400).json({ field: 'designation', message: 'Your designation or role is required.' });
      }
      if (!causes || !Array.isArray(causes) || causes.length === 0) {
        return res.status(400).json({ field: 'causes', message: 'Please select at least one focus area.' });
      }
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check duplicate email
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(400).json({ field: 'email', message: 'Email is already registered. Please login instead.' });
      }
    } else {
      const existingUser = getMockUsers().find(u => u.email === normalizedEmail);
      if (existingUser) {
        return res.status(400).json({ field: 'email', message: 'Email is already registered. Please login instead.' });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=0F766E&textColor=ffffff`;

    let createdUser;

    if (mongoose.connection.readyState === 1) {
      const newUser = new User({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role,
        location: location.trim(),
        causes: causes || [],
        availability: role === 'volunteer' ? (availability || 'Flexible') : undefined,
        organization: role === 'worker' ? organization.trim() : undefined,
        designation: role === 'worker' ? designation.trim() : undefined,
        website: role === 'worker' ? (website ? website.trim() : '') : undefined,
        avatar: defaultAvatar,
        bio: '',
        skills: [],
        totalHours: 0
      });
      await newUser.save();
      createdUser = newUser;
    } else {
      createdUser = {
        _id: 'usr_' + Date.now(),
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role,
        location: location.trim(),
        causes: causes || [],
        availability: role === 'volunteer' ? (availability || 'Flexible') : undefined,
        organization: role === 'worker' ? organization.trim() : undefined,
        designation: role === 'worker' ? designation.trim() : undefined,
        website: role === 'worker' ? (website ? website.trim() : '') : undefined,
        avatar: defaultAvatar,
        bio: '',
        skills: [],
        totalHours: 0,
        createdAt: new Date()
      };
      setMockUsers([...getMockUsers(), createdUser]);
    }

    const token = generateToken(createdUser._id);
    let safeUser = createdUser.toObject ? createdUser.toObject() : { ...createdUser };
    delete safeUser.password;

    return res.status(201).json({
      message: 'Registration successful!',
      token,
      user: safeUser,
      isNewUser: true
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Server error during registration. Please try again.' });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ field: 'email', message: 'Please enter your email address.' });
    }
    if (!password) {
      return res.status(400).json({ field: 'password', message: 'Please enter your password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user;

    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email: normalizedEmail });
    } else {
      user = getMockUsers().find(u => u.email === normalizedEmail);
    }

    if (!user) {
      return res.status(400).json({ field: 'email', message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ field: 'password', message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);
    let safeUser = user.toObject ? user.toObject() : { ...user };
    delete safeUser.password;
    delete safeUser.resetToken;
    delete safeUser.resetTokenExpires;

    return res.json({
      message: 'Login successful!',
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error during login. Please try again.' });
  }
});

// @route   GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    let safeUser = req.user.toObject ? req.user.toObject() : { ...req.user };
    delete safeUser.password;
    delete safeUser.resetToken;
    delete safeUser.resetTokenExpires;
    return res.json({ user: safeUser });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to retrieve user profile.' });
  }
});

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const resetCode = crypto.randomBytes(3).toString('hex').toUpperCase();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: normalizedEmail });
      if (user) {
        user.resetToken = resetCode;
        user.resetTokenExpires = Date.now() + 3600000;
        await user.save();
      }
    } else {
      const user = getMockUsers().find(u => u.email === normalizedEmail);
      if (user) {
        user.resetToken = resetCode;
        user.resetTokenExpires = Date.now() + 3600000;
      }
    }

    return res.json({
      message: 'Password reset code generated.',
      devResetCode: resetCode
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error during forgot password.' });
  }
});

// @route   POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Email, reset code, and new password are required.' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters long.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const normalizedEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({
        email: normalizedEmail,
        resetToken: code.trim(),
        resetTokenExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset code.' });
      }

      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpires = null;
      await user.save();
    } else {
      const user = getMockUsers().find(u => u.email === normalizedEmail && u.resetToken === code.trim());
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset code.' });
      }
      user.password = hashedPassword;
      user.resetToken = null;
    }

    return res.json({ message: 'Password has been successfully updated! You can now log in.' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error during password reset.' });
  }
});

module.exports = router;
